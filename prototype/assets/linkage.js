/* ============================================================
 * 档 A 一期 · Day 3 · 联动规则总线
 * SC.linkage — on / off / emit
 *
 * 监听状态机迁移事件（由 SC.sm.transition 触发），执行级联动作：
 *   - P-02:已审 → 自动生成 P-05 草稿
 *   - P-05:草稿→已分解 → 路径分流（招采/直采）+ 检查 P-02 是否全部分解完毕
 *   - T-05:已验证 → 自动创建 C-01 会签
 *   - S-05:已审 → 库存原子事务（S-21 + S-13 + S-14）+ 触发 F-01 NC mock
 *   - F-01:推送失败 → 自动重推（≤3 次）
 *
 * V0.4a 收口：状态机本身不做副作用，所有副作用由 linkage 唯一负责（避免重复）。
 * ============================================================ */
(function () {
  var SC = window.SC = window.SC || {};
  if (SC.linkage) return;

  var listeners = {};

  SC.linkage = {
    on: function (eventName, handler) {
      if (!listeners[eventName]) listeners[eventName] = [];
      listeners[eventName].push(handler);
    },

    off: function (eventName, handler) {
      if (!listeners[eventName]) return;
      var idx = listeners[eventName].indexOf(handler);
      if (idx >= 0) listeners[eventName].splice(idx, 1);
    },

    emit: function (eventName, item, payload) {
      var handlers = listeners[eventName] || [];
      handlers.forEach(function (h) {
        try { h(item, payload); } catch (e) { console.error('[linkage]', eventName, e); }
      });
      if (handlers.length > 0) {
        console.log('[linkage] emit', eventName, '→', handlers.length, 'handler(s)');
      }
    },

    debug: function () {
      var out = {};
      Object.keys(listeners).forEach(function (k) { out[k] = listeners[k].length; });
      return out;
    },

    _listeners: listeners,
  };

  /* ====================================================
   * 预定义关键联动（对齐 02 V0.4 §6.2-6.3 + V0.4a 收口）
   * ==================================================== */

  /* P-01 需求审批通过 → 自动归集到当月同 org P-02 草稿 + 创建 P-03 计划行（v0.16 补 P1-1）
   * 修复同事评审 P1-1：原 P-01 已审是终态，没 linkage 进入 P-02 链路 */
  SC.linkage.on('P-01:已审', function (req) {
    var period = (req.submit_date || new Date().toISOString().slice(0, 10)).slice(0, 7); // YYYY-MM
    var orgId = req.org_id;
    // 找当月 + 同 org 的 P-02 草稿（幂等聚合）
    var plan = SC.store.list('P-02').filter(function (p) {
      return p.period === period && p.org_id === orgId && p.state === '草稿';
    })[0];
    if (!plan) {
      plan = SC.store.create('P-02', {
        plan_no: SC.store.nextNo('PP'),
        period: period,
        org_id: orgId,
        amount: 0,
        state: '草稿',
        owner: '系统聚合（来自 P-01 审批）',
      });
      console.log('[linkage] P-01:' + req.id + ' 已审 → 新建 P-02 #' + plan.id + '（' + period + ' / org#' + orgId + '）');
    }
    var planLines = SC.store.list('P-03', { plan_id: plan.id });
    var alreadyMerged = planLines.filter(function (l) {
      return l.source_request_no === req.request_no ||
        (l.source_request_nos && l.source_request_nos.indexOf(req.request_no) >= 0);
    })[0];
    if (alreadyMerged) {
      console.log('[linkage] P-01:' + req.id + ' 已聚合到 P-02 #' + plan.id + '（P-03 #' + alreadyMerged.id + ' 已存在来源，跳过）');
      return;
    }
    // D5：同期间、同组织、同物料先合并到同一 P-03，后续由计划员在 P-05 页人工拆/合任务。
    var mergeLine = planLines.filter(function (l) {
      return l.material_id === req.material_id;
    })[0];
    if (mergeLine) {
      var mergedSources = mergeLine.source_request_nos || (mergeLine.source_request_no ? [mergeLine.source_request_no] : []);
      mergedSources.push(req.request_no);
      SC.store.update('P-03', mergeLine.id, {
        quantity: (mergeLine.quantity || 0) + (req.quantity || 0),
        amount: (mergeLine.amount || 0) + (req.amount || 0),
        source_request_no: mergedSources.join(','),
        source_request_nos: mergedSources,
      });
      SC.store.update('P-02', plan.id, { amount: (plan.amount || 0) + (req.amount || 0) });
      console.log('[linkage] P-01:' + req.id + ' 已审 → 合并到 P-03 #' + mergeLine.id + '（同物料）');
      return;
    }
    var lineCount = planLines.length;
    SC.store.create('P-03', {
      plan_id: plan.id,
      plan_line_no: plan.plan_no + '-' + String(lineCount + 1).padStart(2, '0'),
      material_id: req.material_id,
      quantity: req.quantity,
      amount: req.amount,
      tender_type: '招标', // 默认招采，计划员可在 P-02 审批后于任务分解页改
      source_request_no: req.request_no,
      source_request_nos: [req.request_no],
    });
    SC.store.update('P-02', plan.id, { amount: (plan.amount || 0) + (req.amount || 0) });
    console.log('[linkage] P-01:' + req.id + ' 已审 → P-02 #' + plan.id + ' 加 P-03 行（金额累计 ' + ((plan.amount || 0) + (req.amount || 0)) + '）');
  });

  /* P-02 计划审批通过 → 按 P-03 计划行预生成 P-05 草稿（幂等，v0.16 补 P1-2）
   * 修复同事评审 P1-2：原直接 create 没查重，重复 emit 会重复创建 */
  SC.linkage.on('P-02:已审', function (plan) {
    var lines = SC.store.list('P-03', { plan_id: plan.id });
    if (lines.length === 0 && plan.lines) {
      lines = plan.lines.map(function (l, i) {
        return Object.assign({ id: -(i + 1) }, l);
      });
    }
    if (lines.length === 0) {
      console.warn('[linkage] P-02:' + plan.id + ' 已审，但无计划行可生成 P-05');
      return;
    }
    // 幂等：先查已存在的 P-05（按 plan_line_id 索引）
    var existingTasks = SC.store.list('P-05', { plan_id: plan.id });
    var existingByLine = {};
    existingTasks.forEach(function (t) { existingByLine[t.plan_line_id] = t; });

    var created = 0, skipped = 0;
    lines.forEach(function (line) {
      if (existingByLine[line.id]) { skipped++; return; }
      SC.store.create('P-05', {
        task_no: SC.store.nextNo('PT'),
        plan_id: plan.id,
        plan_line_id: line.id,
        material_id: line.material_id,
        quantity: line.quantity,
        amount: line.amount,
        task_state: '草稿',
        tender_type: line.tender_type || null,
      });
      created++;
    });
    console.log('[linkage] P-02:' + plan.id + ' 已审 → P-05 created=' + created + ' skipped=' + skipped + '（幂等，按 plan_line_id 查重）');
  });

  /* P-05 计划员确认分解 → 按采购方式分流（招采/直采/合同采购，v0.16 补 P1-3）
   * 修复同事评审 P1-3：原只处理招采/直采，合同采购页面允许选但 linkage 没处理 */
  SC.linkage.on('P-05:草稿→已分解', function (task) {
    if (task.tender_type === '招标' || task.tender_type === '招采') {
      var existingTender = SC.store.list('T-01', { task_id: task.id })[0];
      if (!existingTender) {
        SC.store.create('T-01', {
          application_no: SC.store.nextNo('TA'),
          task_id: task.id,
          plan_id: task.plan_id,
          material_id: task.material_id,
          amount: task.amount,
          state: '待申请',
        });
      }
      console.log('[linkage] P-05:' + task.id + ' 已分解 (招采) → ' + (existingTender ? '复用' : '创建') + ' T-01');
    } else if (task.tender_type === '直采' || task.tender_type === '直接采购') {
      var existingDirect = SC.store.list('S-01', { task_id: task.id })[0];
      if (!existingDirect) {
        SC.store.create('S-01', {
          request_no: SC.store.nextNo('PR'),
          task_id: task.id,
          plan_id: task.plan_id,
          material_id: task.material_id,
          amount: task.amount,
          state: '待审',
          purchase_route: '直采',
          quantity: task.quantity,
          source_type: 'P-05',
          source_id: task.id,
        });
      }
      console.log('[linkage] P-05:' + task.id + ' 已分解 (直采) → ' + (existingDirect ? '复用' : '创建') + ' S-01 待审');
    } else if (task.tender_type === '合同采购') {
      // 找现有已签 / 执行中合同；找不到也创建 S-01 但 contract_id=null（提示需关联）
      var contract = SC.store.list('C-02').filter(function (c) {
        return c.state === '已签' || c.state === '执行中';
      })[0];
      var existingContractReq = SC.store.list('S-01', { task_id: task.id })[0];
      if (!existingContractReq) {
        SC.store.create('S-01', {
          request_no: SC.store.nextNo('PR'),
          task_id: task.id,
          plan_id: task.plan_id,
          material_id: task.material_id,
          amount: task.amount,
          contract_id: contract ? contract.id : null,
          state: '待审',
          purchase_route: '合同采购',
          quantity: task.quantity,
          source_type: 'P-05',
          source_id: task.id,
        });
      }
      console.log('[linkage] P-05:' + task.id + ' 已分解 (合同采购) → ' + (existingContractReq ? '复用' : '创建') + ' S-01 待审，关联 C-02 #' + (contract ? contract.id : 'null'));
    }

    // V0.4a：检查所属 P-02 全部 P-05 是否都已脱离草稿态；满足则触发 P-02 自动转已分解
    if (task.plan_id) {
      var plan = SC.store.get('P-02', task.plan_id);
      if (plan && plan.state === '已审' && SC.sm && SC.sm.canTransition('P-02', plan, '全部任务分解完毕')) {
        try {
          SC.sm.transition('P-02', plan.id, '全部任务分解完毕');
          console.log('[linkage] P-02:' + plan.id + ' 全部 P-05 分解完毕 → 自动转已分解');
        } catch (e) { console.warn('[linkage] auto-transition failed', e.message); }
      }
    }
  });

  /* S-01 采购申请审批通过 → 自动创建 S-02 订单（v0.16 补 P1-3）
   * 衔接直采 / 合同采购 路径直达订单 */
  SC.linkage.on('S-01:已审', function (req) {
    var existingOrder = SC.store.list('S-02').filter(function (o) {
      return o.request_id === req.id || (req.task_id && o.task_id === req.task_id);
    })[0];
    if (existingOrder) {
      console.log('[linkage] S-01:' + req.id + ' 已审 → S-02 #' + existingOrder.id + ' 已存在，跳过');
      return;
    }
    SC.store.create('S-02', {
      order_no: SC.store.nextNo('CG'),
      request_id: req.id,
      contract_id: req.contract_id || null,
      task_id: req.task_id,
      material_id: req.material_id,
      quantity: req.quantity,
      amount: req.amount,
      order_state: '草稿',
      purchase_route: req.purchase_route || '直采',
    });
    console.log('[linkage] S-01:' + req.id + ' 已审 → 创建 S-02 订单（' + (req.purchase_route || '直采') + '）');
  });

  /* S-02 订单下达 → 订单同步 NC mock 标记（页面/审批中心都走统一副作用） */
  SC.linkage.on('S-02:已下达', function (order) {
    if (order.nc_synced) {
      console.log('[linkage] S-02:' + order.id + ' 已下达 → NC 同步标记已存在，跳过');
      return;
    }
    SC.store.update('S-02', order.id, {
      nc_synced: true,
      nc_sync_time: new Date().toISOString(),
    });
    console.log('[linkage] S-02:' + order.id + ' 已下达 → NC mock 订单同步标记成功');
  });

  /* C-01 会签通过 → 自动创建 C-02 已签（v0.16 补 P2-1）
   * 修复同事评审 P2-1：C-01 会签通过原是手工按钮，没走统一引擎 */
  SC.linkage.on('C-01:已批准', function (approval) {
    var existingContract = SC.store.list('C-02', { approval_id: approval.id })[0];
    if (existingContract) {
      console.log('[linkage] C-01:' + approval.id + ' 已批准 → C-02 #' + existingContract.id + ' 已存在，跳过');
      return;
    }
    var contract = SC.store.create('C-02', {
      contract_no: SC.store.nextNo('HT'),
      approval_id: approval.id,
      supplier_id: approval.supplier_id,
      amount: approval.contract_amount,
      payment_terms: '30% 预付 + 60% 验收 + 10% 质保（payment_terms 文本字段；linkage 同步建 C-04 节点 + C-07 计划）',
      state: '已签',
    });
    SC.linkage.emit('C-02:已签', contract);
    console.log('[linkage] C-01:' + approval.id + ' 已批准 → 自动创建 C-02 #' + contract.id);
  });

  /* T-05 中标结果验证通过 → 自动创建 C-01 合同会签 */
  SC.linkage.on('T-05:已验证', function (result) {
    var existingApproval = SC.store.list('C-01', { tender_result_id: result.id })[0];
    if (existingApproval) {
      console.log('[linkage] T-05:' + result.id + ' 已验证 → C-01 #' + existingApproval.id + ' 已存在，跳过');
      return;
    }
    SC.store.create('C-01', {
      approval_no: SC.store.nextNo('CA'),
      tender_result_id: result.id,
      supplier_id: result.supplier_id,
      contract_amount: result.winning_amount,
      approval_state: '会签中',
    });
    console.log('[linkage] T-05:' + result.id + ' 已验证 → 创建 C-01 会签');
  });

  /* C-02 已签 → 同步设置 executed_amount = 0 / paid_amount = 0
     + 二期 A4a：自动按 payment_terms 拆 3 个 C-04 付款节点（30%预付 / 60%验收 / 10%质保），
       每个 C-04 同步生成对应的 C-07 付款计划（详设 05 §4.4 + §4.6）*/
  SC.linkage.on('C-02:已签', function (contract) {
    SC.store.update('C-02', contract.id, {
      executed_amount: 0,
      paid_amount: 0,
    });
    console.log('[linkage] C-02:' + contract.id + ' 已签 → 初始化执行/已付金额');

    // A4a：自动建 3 节点 + 3 计划（幂等：已存在则跳过）
    var existingNodes = SC.store.list('C-04', { contract_id: contract.id });
    if (existingNodes.length > 0) {
      console.log('[linkage] C-04 #' + contract.id + ' 已存在 ' + existingNodes.length + ' 节点，跳过自动生成');
      return;
    }
    var amount = contract.amount || 0;
    var today = new Date();
    var nodes = [
      { no: 1, condition: '合同签订', percentage: 30, dueOffset: 7,   label: '预付款 30%' },
      { no: 2, condition: '验收合格', percentage: 60, dueOffset: 90,  label: '验收款 60%' },
      { no: 3, condition: '质保期满', percentage: 10, dueOffset: 365, label: '质保金 10%' },
    ];
    nodes.forEach(function (n) {
      var due = new Date(today); due.setDate(due.getDate() + n.dueOffset);
      var c04 = SC.store.create('C-04', {
        contract_id: contract.id,
        payment_node_no: n.no,
        payment_condition: n.condition,
        payment_percentage: n.percentage,
        payment_amount: Math.round(amount * n.percentage / 100),
        due_date: due.toISOString().slice(0, 10),
        node_label: n.label,
        node_state: '待满足',
      });
      // 同步建 C-07 付款计划
      SC.store.create('C-07', {
        contract_id: contract.id,
        payment_node_id: c04.id,
        total_amount: c04.payment_amount,
        cumulative_amount: 0,
        condition_fulfilled: false,
        plan_state: '待满足',
      });
    });
    console.log('[linkage] C-02:' + contract.id + ' 已签 → 创建 3 个 C-04 节点 + 3 个 C-07 计划');
  });

  /* C-04:已满足 → 同步 C-07 计划 condition_fulfilled=true + plan_state=已满足 */
  SC.linkage.on('C-04:已满足', function (node) {
    var plan = SC.store.list('C-07', { payment_node_id: node.id })[0];
    if (!plan) return;
    SC.store.update('C-07', plan.id, { condition_fulfilled: true });
    if (plan.plan_state === '待满足') {
      SC.sm.transition('C-07', plan.id, '条件满足');
    }
    console.log('[linkage] C-04:' + node.id + ' 已满足 → C-07 #' + plan.id + ' 已满足');
  });

  /* C-04:已付款 → 同步 C-07 计划 plan_state=已完成 */
  SC.linkage.on('C-04:已付款', function (node) {
    var plan = SC.store.list('C-07', { payment_node_id: node.id })[0];
    if (!plan) return;
    if (plan.plan_state !== '已完成') {
      try { SC.sm.transition('C-07', plan.id, '完成'); } catch (e) {}
    }
    console.log('[linkage] C-04:' + node.id + ' 已付款 → C-07 #' + plan.id + ' 已完成');
  });

  /* S-05 采购入库审核通过 → 库存原子事务（S-21 + S-13 + S-14）+ F-01 NC 接口任务 */
  SC.linkage.on('S-05:已审', function (receipt) {
    var lines = SC.store.list('S-25', { receipt_id: receipt.id });
    if (lines.length === 0 && receipt.lines) lines = receipt.lines;
    if (lines.length === 0) {
      console.warn('[linkage] S-05:' + receipt.id + ' 已审，但无入库行');
      return;
    }
    SC.store.transaction(['S-21', 'S-13', 'S-14', 'F-01'], function () {
      lines.forEach(function (line) {
        // 1. 写 S-21 库存事务流水
        SC.store.create('S-21', {
          transaction_no: SC.store.nextNo('IT'),
          transaction_type: '入库',
          material_id: line.material_id,
          warehouse_id: receipt.warehouse_id,
          batch_id: line.batch_id || null,
          quantity_delta: line.quantity,
          amount_delta: line.line_amount,
          source_bill_type: 'S-05',
          source_bill_id: receipt.id,
          source_line_id: line.id || null,
        });

        // 2. 更新 S-13 库存余额（移动平均）
        var inv = SC.store.upsert('S-13',
          { org_id: receipt.org_id, warehouse_id: receipt.warehouse_id, material_id: line.material_id },
          {} // 先 upsert 占位，下面 patch
        );
        var newQty = (inv.quantity || 0) + line.quantity;
        var newAmount = (inv.total_amount || 0) + line.line_amount;
        SC.store.update('S-13', inv.id, {
          quantity: newQty,
          total_amount: newAmount,
          unit_cost: newQty > 0 ? newAmount / newQty : 0,
          available_quantity: newQty - (inv.frozen_quantity || 0),
        });

        // 3. 批次（如有）
        if (line.batch_id) {
          SC.store.upsert('S-14',
            { material_id: line.material_id, batch_id: line.batch_id, warehouse_id: receipt.warehouse_id },
            { quantity: line.quantity, amount: line.line_amount }
          );
        }
      });

      // 4. F-01 NC 接口任务（mock）
      var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-001-switch' })[0];
      if (!ncSwitch || ncSwitch.switch_status === '开') {
        var task = SC.store.create('F-01', {
          task_no: SC.store.nextNo('FT'),
          interface_id: 'BIZ-001',
          source_bill_no: receipt.receipt_no,
          source_bill_type: 'S-05',
          source_bill_id: receipt.id,
          task_state: '待推送',
          retry_count: 0,
        });
        // 异步推送（不阻塞当前事务）
        if (SC.nc) {
          setTimeout(function () { SC.nc.push(task.id); }, 0);
        }
      }
    });
    console.log('[linkage] S-05:' + receipt.id + ' 已审 → ' + lines.length + ' 行库存事务 + NC 任务');
  });

  /* F-01 推送失败 → 30 秒后自动重推（≤3 次） */
  SC.linkage.on('F-01:推送失败', function (task) {
    if ((task.retry_count || 0) >= 3) {
      console.warn('[linkage] F-01:' + task.id + ' 已重推 3 次仍失败，升级 F-08 异常台账');
      SC.store.create('F-08', {
        task_id: task.id,
        interface_id: task.interface_id,
        source_bill_no: task.source_bill_no,
        error_message: task.push_error_message,
        state: '待处置',
      });
      return;
    }
    setTimeout(function () {
      SC.store.update('F-01', task.id, { retry_count: (task.retry_count || 0) + 1 });
      if (SC.nc) SC.nc.push(task.id);
    }, 30000);
    console.log('[linkage] F-01:' + task.id + ' 推送失败 → 30 秒后自动重推（第 ' + ((task.retry_count || 0) + 1) + ' 次）');
  });

  /* ====================================================
   * E2 自动预警（v0.14 加：流标 / NC 失败 / 库存异常）
   * 写入 R-05 alert_record，alert-rules 页 alert-center 三段视图聚合
   * ==================================================== */

  function emitAlert(payload) {
    SC.store.create('R-05', Object.assign({
      read_state: '未读',
      occur_time: new Date().toISOString(),
    }, payload));
  }

  /* T-03:流标 → ALR-PUR-002 */
  SC.linkage.on('T-03:流标', function (pkg) {
    emitAlert({
      alert_code: 'ALR-PUR-002',
      level: '重要',
      source_entity: 'T-03',
      source_id: pkg.id,
      title: '招标流标',
      message: 'T-03 #' + pkg.id + (pkg.package_no ? ' (' + pkg.package_no + ')' : '') + ' 流标，重新发标须重走集体决策（详设 04 §4.10.5）',
    });
    console.log('[linkage] auto-alert ALR-PUR-002 created for T-03:' + pkg.id);
  });

  /* F-01:推送失败 → ALR-INT-001（独立于已有的重推处理）*/
  SC.linkage.on('F-01:推送失败', function (task) {
    emitAlert({
      alert_code: 'ALR-INT-001',
      level: (task.retry_count || 0) >= 2 ? '紧急' : '一般',
      source_entity: 'F-01',
      source_id: task.id,
      title: 'NC 接口推送失败',
      message: 'F-01 #' + task.id + ' (' + (task.task_no || '') + ') 推送失败：' + (task.push_error_message || '') + '，retry=' + (task.retry_count || 0),
    });
  });

  /* S-13 update → 库存低储 / 超储 检查 ALR-INV-001
   * 简单 mock：quantity < 50 视为低储；> 1500 视为超储
   */
  SC.store.subscribe('S-13', function (msg) {
    if (msg.event !== 'update' && msg.event !== 'create') return;
    var i = msg.item;
    if (!i || !i.quantity) return;
    if (i.quantity < 50) {
      emitAlert({
        alert_code: 'ALR-INV-001',
        level: '一般',
        source_entity: 'S-13',
        source_id: i.id,
        title: '库存低储',
        message: '物料 #' + i.material_id + ' 仓库 #' + i.warehouse_id + ' 数量 ' + i.quantity + ' < 50（mock 阈值）',
      });
    } else if (i.quantity > 1500) {
      emitAlert({
        alert_code: 'ALR-INV-002',
        level: '一般',
        source_entity: 'S-13',
        source_id: i.id,
        title: '库存超储',
        message: '物料 #' + i.material_id + ' 仓库 #' + i.warehouse_id + ' 数量 ' + i.quantity + ' > 1500（mock 阈值）',
      });
    }
  });

  /* ========================================================
   * 二期 P0 引擎接入（v0.18 补 — 让二期页面也走引擎层）
   * ======================================================== */

  /* A2 出库主线：S-08 领料申请审批通过 → 自动 create S-09 出库执行草稿 */
  SC.linkage.on('S-08:已审', function (req) {
    var existing = SC.store.list('S-09').filter(function (o) { return o.request_id === req.id; })[0];
    if (existing) return;
    SC.store.create('S-09', {
      record_no: SC.store.nextNo('CK'),
      request_id: req.id,
      cost_center_id: req.cost_center_id,
      material_id: req.material_id,
      warehouse_id: req.warehouse_id || 2,
      org_id: req.org_id,
      quantity: req.quantity,
      amount: req.amount,
      state: '草稿',
    });
    console.log('[linkage] S-08:' + req.id + ' 已审 → 创建 S-09 #' + (SC.store.list('S-09').slice(-1)[0].id));
  });

  /* A2 出库主线：S-09:已出库 → 库存原子事务（S-21 出库流水 + S-13 余额减 + F-01 BIZ-005）*/
  SC.linkage.on('S-09:已出库', function (rec) {
    var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-005-switch' })[0];
    SC.store.transaction(['S-21', 'S-13', 'F-01'], function () {
      // S-21 出库流水
      SC.store.create('S-21', {
        transaction_no: SC.store.nextNo('IT'),
        transaction_type: '出库',
        material_id: rec.material_id,
        warehouse_id: rec.warehouse_id,
        cost_center_id: rec.cost_center_id,
        quantity_delta: -(rec.quantity || 0),
        amount_delta: -(rec.amount || 0),
        source_bill_type: 'S-09',
        source_bill_id: rec.id,
      });
      // S-13 余额减（用现有 unit_cost 计算实际出库金额，演示用按 rec.amount 简化）
      var inv = SC.store.list('S-13').filter(function (i) {
        return i.material_id === rec.material_id && i.warehouse_id === rec.warehouse_id;
      })[0];
      if (inv) {
        var newQty = (inv.quantity || 0) - rec.quantity;
        var newAmount = newQty > 0 && inv.unit_cost ? newQty * inv.unit_cost : 0;
        SC.store.update('S-13', inv.id, {
          quantity: newQty,
          total_amount: newAmount,
          available_quantity: newQty - (inv.frozen_quantity || 0),
        });
      }
      // F-01 NC 任务（BIZ-005 出库凭证）
      if (!ncSwitch || ncSwitch.switch_status === '开') {
        var task = SC.store.create('F-01', {
          task_no: SC.store.nextNo('FT'),
          interface_id: 'BIZ-005',
          source_bill_no: rec.record_no,
          source_bill_type: 'S-09',
          source_bill_id: rec.id,
          task_state: '待推送',
          retry_count: 0,
        });
        if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
      }
    });
    console.log('[linkage] S-09:' + rec.id + ' 已出库 → S-21 流水 + S-13 余额减 + F-01 BIZ-005');
  });

  /* A4b 付款链路：C-08:已审 → 自动 create C-10 付款执行 + 累加 C-07 累计金额 */
  SC.linkage.on('C-08:已审', function (req) {
    var existing = SC.store.list('C-10').filter(function (e) { return e.request_id === req.id; })[0];
    if (existing) return;
    SC.store.create('C-10', {
      execution_no: SC.store.nextNo('FK'),
      request_id: req.id,
      contract_id: req.contract_id,
      supplier_id: req.supplier_id,
      amount: req.amount,
      payment_node_id: req.payment_node_id || null,
      state: '待执行',
    });
    console.log('[linkage] C-08:' + req.id + ' 已审 → 创建 C-10 待执行');

    // A4a：累加到对应 C-07 计划的 cumulative_amount，并推动状态
    if (req.payment_node_id) {
      var plan = SC.store.list('C-07', { payment_node_id: req.payment_node_id })[0];
      if (plan) {
        var newCum = (plan.cumulative_amount || 0) + (req.amount || 0);
        SC.store.update('C-07', plan.id, { cumulative_amount: newCum });
        if (plan.plan_state === '已满足') {
          SC.sm.transition('C-07', plan.id, '部分付款');
        }
        console.log('[linkage] C-08:' + req.id + ' 已审 → C-07 #' + plan.id + ' cumulative_amount += ' + req.amount);
      }
    }
  });

  /* A4b 付款链路：C-10:已记账 → 应付消减 + 更新合同 paid_amount + 推动 C-04/C-07 完成 */
  SC.linkage.on('C-10:已记账', function (exec) {
    if (exec.contract_id) {
      var c = SC.store.get('C-02', exec.contract_id);
      if (c) {
        SC.store.update('C-02', exec.contract_id, {
          paid_amount: (c.paid_amount || 0) + (exec.amount || 0),
        });
      }
    }

    // A4a：若 C-10 关联了 C-04 节点 → 推动 C-04:已付款 + C-07:已完成
    if (exec.payment_node_id) {
      var node = SC.store.get('C-04', exec.payment_node_id);
      var plan = SC.store.list('C-07', { payment_node_id: exec.payment_node_id })[0];
      if (plan) {
        // 检查累计是否达到节点金额
        if (plan.cumulative_amount >= plan.total_amount && plan.plan_state !== '已完成') {
          try { SC.sm.transition('C-07', plan.id, '完成'); } catch (e) {}
        }
      }
      if (node && node.node_state === '已满足') {
        try { SC.sm.transition('C-04', node.id, '记账完成'); } catch (e) {}
      }
    }
    console.log('[linkage] C-10:' + exec.id + ' 已记账 → C-02 paid_amount += ' + exec.amount);
  });

  /* C-10 触发 NC mock 推送：根据节点类型决定 BIZ-013 实付 / BIZ-014 预付
   * - 节点序号 1（合同签订/预付款）→ BIZ-014 预付款转应付
   * - 其他节点 → BIZ-013 付款执行 */
  SC.linkage.on('C-10:执行中', function (exec) {
    var bizCode = 'BIZ-013';
    if (exec.payment_node_id) {
      var node = SC.store.get('C-04', exec.payment_node_id);
      if (node && node.payment_node_no === 1) {
        bizCode = 'BIZ-014';  // 预付款转应付
      }
    }
    var ncSwitch = SC.store.list('F-13', { switch_code: bizCode + '-switch' })[0];
    if (ncSwitch && ncSwitch.switch_status === '关') {
      console.log('[linkage] C-10:' + exec.id + ' ' + bizCode + ' 开关=关，跳过 NC 推送');
      return;
    }
    var task = SC.store.create('F-01', {
      task_no: SC.store.nextNo('FT'),
      interface_id: bizCode,
      source_bill_no: exec.execution_no,
      source_bill_type: 'C-10',
      source_bill_id: exec.id,
      task_state: '待推送',
      retry_count: 0,
    });
    if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
    console.log('[linkage] C-10:' + exec.id + ' 执行中 → F-01 ' + bizCode + ' 任务 + mock NC 推送');
  });

  /* BIZ-015 应付暂估转正式：S-07:已冲销 后，若有正式发票则走 BIZ-015 入账（区别于 BIZ-001 普通采购入库） */
  SC.linkage.on('S-07:已冲销', function (estimate) {
    if (!estimate.invoice_received) return;  // 只在收到发票后走 BIZ-015
    var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-015-switch' })[0];
    if (ncSwitch && ncSwitch.switch_status === '关') {
      console.log('[linkage] S-07:' + estimate.id + ' BIZ-015 开关=关，跳过');
      return;
    }
    var task = SC.store.create('F-01', {
      task_no: SC.store.nextNo('FT'),
      interface_id: 'BIZ-015',
      source_bill_no: estimate.estimate_no,
      source_bill_type: 'S-07',
      source_bill_id: estimate.id,
      task_state: '待推送',
      retry_count: 0,
    });
    if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
    console.log('[linkage] S-07:' + estimate.id + ' 已冲销 + 发票到 → F-01 BIZ-015 + NC');
  });

  /* BIZ-020 月度应付消减：手动触发（在 payment-execution 页点按钮）→ 月末批量消减已付应付 */
  SC.linkage.runMonthlyPayableReduction = function () {
    var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-020-switch' })[0];
    if (ncSwitch && ncSwitch.switch_status === '关') {
      return { ok: false, reason: 'BIZ-020 开关=关' };
    }
    var month = (SC.time && SC.time.iso ? SC.time.iso() : new Date().toISOString()).slice(0, 7);
    // 找当月已记账 C-10 → 汇总到一笔月度消减
    var c10s = SC.store.list('C-10').filter(function (r) {
      return r.state === '已记账' && (r.created_at || '').slice(0, 7) === month;
    });
    var total = c10s.reduce(function (a, r) { return a + (r.amount || 0); }, 0);
    if (c10s.length === 0) {
      return { ok: false, reason: '本月无已记账 C-10' };
    }
    var task = SC.store.create('F-01', {
      task_no: SC.store.nextNo('FT'),
      interface_id: 'BIZ-020',
      source_bill_no: 'PAYABLE-' + month,
      source_bill_type: 'monthly',
      source_bill_id: null,
      task_state: '待推送',
      retry_count: 0,
      remark: '月度应付消减 ' + month + ' / 笔数 ' + c10s.length + ' / 金额 ' + total,
    });
    if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
    console.log('[linkage] BIZ-020 月度消减 ' + month + ' → ' + c10s.length + ' 笔 / ¥' + total);
    return { ok: true, month: month, count: c10s.length, amount: total, task: task };
  };

  /* A8 暂估：S-05:已审 时，如果 receipt.estimate_required = true 则自动创建 S-07 暂估 + BIZ-002 */
  SC.linkage.on('S-05:已审', function (receipt) {
    if (!receipt.estimate_required) return;
    var existing = SC.store.list('S-07').filter(function (e) { return e.receipt_id === receipt.id; })[0];
    if (existing) return;
    var period = (SC.time && SC.time.iso ? SC.time.iso() : new Date().toISOString()).slice(0, 7);
    var lines = SC.store.list('S-25', { receipt_id: receipt.id });
    var totalAmt = lines.reduce(function (a, l) { return a + (l.line_amount || 0); }, 0);
    SC.store.create('S-07', {
      estimate_no: SC.store.nextNo('ZG'),
      receipt_id: receipt.id,
      supplier_id: receipt.supplier_id,
      estimate_period: period,
      estimate_amount: totalAmt,
      estimate_state: '暂估中',
    });
    // 推 BIZ-002
    var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-002-switch' })[0];
    if (ncSwitch && ncSwitch.switch_status === '开') {
      var task = SC.store.create('F-01', {
        task_no: SC.store.nextNo('FT'),
        interface_id: 'BIZ-002',
        source_bill_no: receipt.receipt_no,
        source_bill_type: 'S-05',
        source_bill_id: receipt.id,
        task_state: '待推送',
        retry_count: 0,
      });
      if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
    }
    console.log('[linkage] S-05:' + receipt.id + ' 已审（含暂估）→ 创建 S-07 暂估 + BIZ-002');
  });

  /* A8 暂估：S-07:已冲销 → 推 BIZ-003 红字冲销 */
  SC.linkage.on('S-07:已冲销', function (est) {
    var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-002-switch' })[0];
    if (ncSwitch && ncSwitch.switch_status === '开') {
      var task = SC.store.create('F-01', {
        task_no: SC.store.nextNo('FT'),
        interface_id: 'BIZ-003',
        source_bill_no: est.estimate_no,
        source_bill_type: 'S-07',
        source_bill_id: est.id,
        task_state: '待推送',
        retry_count: 0,
      });
      if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
    }
    console.log('[linkage] S-07:' + est.id + ' 已冲销 → F-01 BIZ-003 红字推送');
  });

  /* A14 反规避：P-01:已审 → 检查 30 天累计同 org+material 申请总额，超阈值预警 */
  SC.linkage.on('P-01:已审', function (req) {
    var WINDOW_DAYS = 30;
    var THRESHOLD = 200000; // mock 阈值，实际应从 SY-02 配置读
    var now = SC.time && SC.time.now ? SC.time.now() : new Date();
    var since = new Date(now.getTime() - WINDOW_DAYS * 24 * 3600 * 1000);
    var related = SC.store.list('P-01').filter(function (r) {
      return r.id !== req.id &&
        r.org_id === req.org_id &&
        r.material_id === req.material_id &&
        r.state === '已审' &&
        new Date(r.submit_date || r.created_at || 0) >= since;
    });
    var sum = related.reduce(function (a, r) { return a + (r.amount || 0); }, 0) + (req.amount || 0);
    if (sum > THRESHOLD) {
      emitAlert({
        alert_code: 'ALR-PUR-SPLIT-001',
        level: '重要',
        source_entity: 'P-01',
        source_id: req.id,
        title: '化整为零嫌疑',
        message: '同 org#' + req.org_id + ' 同 material#' + req.material_id + ' ' + WINDOW_DAYS + ' 天累计 ' +
          related.length + ' + 1 = ' + (related.length + 1) + ' 笔，金额 ' +
          sum + ' > 阈值 ' + THRESHOLD + '（详设 04 §8.3 反规避）',
      });
      console.log('[linkage] P-01:' + req.id + ' → ALR-PUR-SPLIT-001 反规避预警');
    }
  });

  /* ========================================================
   * 二期 P1 引擎接入（v0.19 — A3 调拨 + A5 盘点 + A12 后评价 + B3 主数据）
   * ======================================================== */

  /* A3 调拨：S-11:已审 → 自动 create S-12 调拨执行草稿 */
  SC.linkage.on('S-11:已审', function (req) {
    var existing = SC.store.list('S-12').filter(function (e) { return e.request_id === req.id; })[0];
    if (existing) return;
    SC.store.create('S-12', {
      record_no: SC.store.nextNo('DB'),
      request_id: req.id,
      from_org_id: req.from_org_id,
      to_org_id: req.to_org_id,
      from_warehouse_id: req.from_warehouse_id,
      to_warehouse_id: req.to_warehouse_id,
      material_id: req.material_id,
      quantity: req.quantity,
      amount: req.amount,
      state: '草稿',
    });
    console.log('[linkage] S-11:' + req.id + ' 已审 → 创建 S-12 调拨执行');
  });

  /* A3 调拨：S-12:已执行 → 双向 S-21 流水（出+入）+ S-13 双向更新 + F-01 BIZ-007 内部往来 */
  SC.linkage.on('S-12:已执行', function (rec) {
    SC.store.transaction(['S-21', 'S-13', 'F-01'], function () {
      // 出库流水（from）
      SC.store.create('S-21', {
        transaction_no: SC.store.nextNo('IT'),
        transaction_type: '调拨出',
        material_id: rec.material_id,
        warehouse_id: rec.from_warehouse_id,
        org_id: rec.from_org_id,
        quantity_delta: -(rec.quantity || 0),
        amount_delta: -(rec.amount || 0),
        source_bill_type: 'S-12',
        source_bill_id: rec.id,
      });
      // 入库流水（to）
      SC.store.create('S-21', {
        transaction_no: SC.store.nextNo('IT'),
        transaction_type: '调拨入',
        material_id: rec.material_id,
        warehouse_id: rec.to_warehouse_id,
        org_id: rec.to_org_id,
        quantity_delta: rec.quantity || 0,
        amount_delta: rec.amount || 0,
        source_bill_type: 'S-12',
        source_bill_id: rec.id,
      });
      // S-13 from 减
      var fromInv = SC.store.list('S-13').filter(function (i) {
        return i.material_id === rec.material_id && i.warehouse_id === rec.from_warehouse_id;
      })[0];
      if (fromInv) {
        SC.store.update('S-13', fromInv.id, {
          quantity: (fromInv.quantity || 0) - rec.quantity,
          total_amount: (fromInv.total_amount || 0) - rec.amount,
        });
      }
      // S-13 to 增
      var toInv = SC.store.upsert('S-13',
        { org_id: rec.to_org_id, warehouse_id: rec.to_warehouse_id, material_id: rec.material_id },
        {});
      var fromUnitCost = fromInv ? (fromInv.unit_cost || 0) : (rec.amount / rec.quantity);
      var newQty = (toInv.quantity || 0) + rec.quantity;
      var newAmount = (toInv.total_amount || 0) + (rec.quantity * fromUnitCost);
      SC.store.update('S-13', toInv.id, {
        quantity: newQty,
        total_amount: newAmount,
        unit_cost: newQty > 0 ? newAmount / newQty : 0,
      });
      // F-01 BIZ-007 内部往来对冲
      var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-007-switch' })[0];
      if (!ncSwitch || ncSwitch.switch_status === '开') {
        var task = SC.store.create('F-01', {
          task_no: SC.store.nextNo('FT'),
          interface_id: 'BIZ-007',
          source_bill_no: rec.record_no,
          source_bill_type: 'S-12',
          source_bill_id: rec.id,
          task_state: '待推送',
          retry_count: 0,
        });
        if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
      }
    });
    console.log('[linkage] S-12:' + rec.id + ' 已执行 → 双向 S-21 + S-13 + F-01 BIZ-007');
  });

  /* A5 盘点：S-15:已审（盘点完成审批通过）→ 比对账实差异 → 自动 create S-17 差异行 */
  SC.linkage.on('S-15:已审', function (sheet) {
    if (!sheet.lines || sheet.lines.length === 0) return;
    sheet.lines.forEach(function (l) {
      var diff = (l.actual_quantity || 0) - (l.book_quantity || 0);
      if (diff === 0) return;
      var existing = SC.store.list('S-17').filter(function (a) { return a.sheet_id === sheet.id && a.material_id === l.material_id; })[0];
      if (existing) return;
      SC.store.create('S-17', {
        adjustment_no: SC.store.nextNo('PD'),
        sheet_id: sheet.id,
        material_id: l.material_id,
        warehouse_id: sheet.warehouse_id,
        book_quantity: l.book_quantity,
        actual_quantity: l.actual_quantity,
        diff_quantity: diff,
        adjustment_type: diff > 0 ? '盘盈' : '盘亏',
        amount: Math.abs(diff) * (l.unit_cost || 0),
        state: '草稿',
      });
    });
    console.log('[linkage] S-15:' + sheet.id + ' 已审 → 自动 create S-17 差异行（' + sheet.lines.length + ' 行扫描）');
  });

  /* A5 盘点：S-17:已审 → S-21 调整流水 + S-13 修正 + F-01 BIZ-008（盘盈）/ BIZ-009（盘亏）*/
  SC.linkage.on('S-17:已审', function (adj) {
    SC.store.transaction(['S-21', 'S-13', 'F-01'], function () {
      SC.store.create('S-21', {
        transaction_no: SC.store.nextNo('IT'),
        transaction_type: adj.adjustment_type,
        material_id: adj.material_id,
        warehouse_id: adj.warehouse_id,
        quantity_delta: adj.diff_quantity,
        amount_delta: adj.adjustment_type === '盘盈' ? adj.amount : -adj.amount,
        source_bill_type: 'S-17',
        source_bill_id: adj.id,
      });
      var inv = SC.store.list('S-13').filter(function (i) {
        return i.material_id === adj.material_id && i.warehouse_id === adj.warehouse_id;
      })[0];
      if (inv) {
        SC.store.update('S-13', inv.id, {
          quantity: (inv.quantity || 0) + adj.diff_quantity,
          total_amount: (inv.total_amount || 0) + (adj.adjustment_type === '盘盈' ? adj.amount : -adj.amount),
        });
      }
      var bizCode = adj.adjustment_type === '盘盈' ? 'BIZ-008' : 'BIZ-009';
      var ncSwitch = SC.store.list('F-13', { switch_code: bizCode + '-switch' })[0];
      if (!ncSwitch || ncSwitch.switch_status === '开') {
        var task = SC.store.create('F-01', {
          task_no: SC.store.nextNo('FT'),
          interface_id: bizCode,
          source_bill_no: adj.adjustment_no,
          source_bill_type: 'S-17',
          source_bill_id: adj.id,
          task_state: '待推送',
          retry_count: 0,
        });
        if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
      }
    });
    SC.store.update('S-17', adj.id, { state: '已调整' });
    console.log('[linkage] S-17:' + adj.id + ' 已审 → S-21 + S-13 + F-01 ' + (adj.adjustment_type === '盘盈' ? 'BIZ-008' : 'BIZ-009'));
  });

  /* A12 后评价：M-13:已确认 → 累计差评 ≥ 3 → 触发 WF-SUP-REASSESS-001 重评估 */
  SC.linkage.on('M-13:已确认', function (eval0) {
    if (eval0.score >= 3) return; // 仅差评（≤ 2 星）触发
    var REASSESS_THRESHOLD = 3;
    var related = SC.store.list('M-13').filter(function (e) {
      return e.supplier_id === eval0.supplier_id && e.state === '已确认' && (e.score || 5) < 3;
    });
    if (related.length >= REASSESS_THRESHOLD) {
      emitAlert({
        alert_code: 'ALR-SUP-REASSESS',
        level: '重要',
        source_entity: 'M-09',
        source_id: eval0.supplier_id,
        title: '供应商重评估',
        message: '供应商 #' + eval0.supplier_id + ' 累计差评 ' + related.length + ' 次 ≥ ' + REASSESS_THRESHOLD + '，触发 WF-SUP-REASSESS-001 重评估流程；请考虑暂停接单 / 调降评级 / 加入黑名单',
      });
      // 自动暂停接单（mock）
      var sup = SC.store.get('M-09', eval0.supplier_id);
      if (sup && sup.state === '合格') {
        SC.store.update('M-09', eval0.supplier_id, { state: '暂停' });
        console.log('[linkage] 供应商 #' + eval0.supplier_id + ' 累计差评 ' + related.length + ' 次 → 自动暂停接单');
      }
    }
  });

  /* ========================================================
   * 二期 P2 引擎接入（v0.20 — A6 废旧 + A11 直达 + A13 应急）
   * ======================================================== */

  /* A6 废旧处置：S-19:已处置 → S-21 出库流水 + S-13 减 + F-01 BIZ-010/011/012 */
  SC.linkage.on('S-19:已处置', function (req) {
    var bizCode = req.disposal_type === '报废' ? 'BIZ-010' :
                  req.disposal_type === '变卖' ? 'BIZ-011' :
                  req.disposal_type === '回收' ? 'BIZ-012' : 'BIZ-010';
    SC.store.transaction(['S-21', 'S-13', 'F-01'], function () {
      SC.store.create('S-21', {
        transaction_no: SC.store.nextNo('IT'),
        transaction_type: '废旧处置',
        material_id: req.material_id,
        warehouse_id: req.warehouse_id,
        org_id: req.org_id,
        quantity_delta: -(req.quantity || 0),
        amount_delta: -(req.amount || 0),
        source_bill_type: 'S-19',
        source_bill_id: req.id,
      });
      var inv = SC.store.list('S-13').filter(function (i) {
        return i.material_id === req.material_id && i.warehouse_id === req.warehouse_id;
      })[0];
      if (inv) {
        SC.store.update('S-13', inv.id, {
          quantity: (inv.quantity || 0) - req.quantity,
          total_amount: (inv.total_amount || 0) - req.amount,
        });
      }
      var ncSwitch = SC.store.list('F-13', { switch_code: bizCode + '-switch' })[0];
      if (!ncSwitch || ncSwitch.switch_status === '开') {
        var task = SC.store.create('F-01', {
          task_no: SC.store.nextNo('FT'),
          interface_id: bizCode,
          source_bill_no: req.disposal_no,
          source_bill_type: 'S-19',
          source_bill_id: req.id,
          task_state: '待推送',
          retry_count: 0,
        });
        if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
      }
    });
    console.log('[linkage] S-19:' + req.id + ' 已处置 → S-21 + S-13 减 + F-01 ' + bizCode);
  });

  /* A11 直达使用单位：S-23:已挂账 → 财务挂账（不进 S-13）+ F-01 BIZ-005A 对厂矿销售 */
  SC.linkage.on('S-23:已挂账', function (rec) {
    var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-005-switch' })[0];
    if (!ncSwitch || ncSwitch.switch_status === '开') {
      var task = SC.store.create('F-01', {
        task_no: SC.store.nextNo('FT'),
        interface_id: 'BIZ-005A',
        source_bill_no: rec.delivery_no,
        source_bill_type: 'S-23',
        source_bill_id: rec.id,
        task_state: '待推送',
        retry_count: 0,
      });
      if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
    }
    console.log('[linkage] S-23:' + rec.id + ' 已挂账 → F-01 BIZ-005A 对厂矿销售（不进 S-13）');
  });

  /* A13 应急采购：P-01:已审 + is_emergency → 标记 3 工作日补办期限 + emit 应急预警 */
  SC.linkage.on('P-01:已审', function (req) {
    if (!req.is_emergency) return;
    var followupDeadline = (SC.time && SC.time.now ? SC.time.now() : new Date());
    followupDeadline.setDate(followupDeadline.getDate() + 3);
    SC.store.update('P-01', req.id, {
      followup_deadline: followupDeadline.toISOString().slice(0, 10),
      followup_state: '待补办',
    });
    emitAlert({
      alert_code: 'ALR-PUR-EMERGENCY-001',
      level: '一般',
      source_entity: 'P-01',
      source_id: req.id,
      title: '应急采购补办提醒',
      message: 'P-01 #' + req.id + ' 已通过应急通道审批，须在 ' + followupDeadline.toISOString().slice(0, 10) + ' 前完成 P-02 计划补办（详设 04 §8.2.2）',
    });
    console.log('[linkage] P-01:' + req.id + ' 应急通道审批 → 3 工作日补办期限 ' + followupDeadline.toISOString().slice(0, 10));
  });

  /* ========================================================
   * 二期 P2 第二批引擎接入（v0.21 — A7 + A9 + A10）
   * ======================================================== */

  /* A7 设备租赁：E-08:在租 → 月底自动 trigger 月度费用 BIZ-019 */
  SC.linkage.on('E-08:在租', function (rec) {
    var period = (SC.time && SC.time.iso ? SC.time.iso() : new Date().toISOString()).slice(0, 7);
    var existing = SC.store.list('E-13').filter(function (f) { return f.registration_id === rec.id && f.period === period; })[0];
    if (existing) return;
    SC.store.create('E-13', {
      fee_no: SC.store.nextNo('LF'),
      registration_id: rec.id,
      contract_id: rec.contract_id,
      supplier_id: rec.supplier_id,
      equipment_id: rec.equipment_id,
      period: period,
      monthly_amount: rec.monthly_rate || 5000,
      state: '已生成',
    });
    console.log('[linkage] E-08:' + rec.id + ' 在租 → 当月 E-13 月度费用已生成（BIZ-019 推送占位）');
  });

  /* A7 设备租赁：E-08:已结算 → F-01 BIZ-019 推送 */
  SC.linkage.on('E-08:已结算', function (rec) {
    var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-019-switch' })[0];
    if (!ncSwitch || ncSwitch.switch_status === '开') {
      var task = SC.store.create('F-01', {
        task_no: SC.store.nextNo('FT'),
        interface_id: 'BIZ-019',
        source_bill_no: rec.registration_no,
        source_bill_type: 'E-08',
        source_bill_id: rec.id,
        task_state: '待推送',
        retry_count: 0,
      });
      if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
    }
    console.log('[linkage] E-08:' + rec.id + ' 已结算 → F-01 BIZ-019 租赁费用 NC 推送');
  });

  /* A10 外委检修：E-04:已审 → 检查 40% 原值上限 → 如超阈值 emit 高敏感预警 + WF-CON-OVERLIMIT-001 */
  SC.linkage.on('E-04:已审', function (req) {
    if (req.amount && req.original_value && req.amount > 0.4 * req.original_value) {
      emitAlert({
        alert_code: 'ALR-CON-OVERLIMIT-001',
        level: '紧急',
        source_entity: 'E-04',
        source_id: req.id,
        title: '外委检修合同超 40% 原值',
        message: 'E-04 #' + req.id + ' 检修金额 ¥' + req.amount + ' / 设备原值 ¥' + req.original_value + ' = ' + ((req.amount / req.original_value * 100).toFixed(1)) + '% > 40%；触发 WF-CON-OVERLIMIT-001 加签 + SENS-CON-004 高敏感留痕（详设 07 V1.0a + 10 V1.2）',
      });
      console.log('[linkage] E-04:' + req.id + ' 超 40% 原值上限 → ALR-CON-OVERLIMIT-001');
    }
  });

  /* A10 外委检修：E-04:已结算 → F-01 BIZ-018 外委检修结算（占位，实际 NC 凭证待财务确认）*/
  SC.linkage.on('E-04:已结算', function (req) {
    console.log('[linkage] E-04:' + req.id + ' 已结算 → NC 凭证待财务确认（详设 07 V1.0a + 详设 08 占位项）');
  });

  /* A9 委托加工：OP-01:已投料 → S-21 出库流水（投料原料从主库到受托虚拟仓）+ S-13 减原料 */
  SC.linkage.on('OP-01:已投料', function (op) {
    SC.store.transaction(['S-21', 'S-13'], function () {
      SC.store.create('S-21', {
        transaction_no: SC.store.nextNo('IT'),
        transaction_type: '委托投料',
        material_id: op.raw_material_id,
        warehouse_id: op.from_warehouse_id,
        quantity_delta: -(op.raw_quantity || 0),
        amount_delta: -(op.raw_amount || 0),
        source_bill_type: 'OP-01',
        source_bill_id: op.id,
      });
      var inv = SC.store.list('S-13').filter(function (i) {
        return i.material_id === op.raw_material_id && i.warehouse_id === op.from_warehouse_id;
      })[0];
      if (inv) {
        SC.store.update('S-13', inv.id, {
          quantity: (inv.quantity || 0) - op.raw_quantity,
          total_amount: (inv.total_amount || 0) - op.raw_amount,
        });
      }
    });
    console.log('[linkage] OP-01:' + op.id + ' 已投料 → S-21 出库 + S-13 减原料');
  });

  /* A9 委托加工：OP-01:已入库 → S-21 入库流水（产品 + 加工费）+ S-13 加产品 + F-01 BIZ-019 加工费 */
  SC.linkage.on('OP-01:已入库', function (op) {
    SC.store.transaction(['S-21', 'S-13', 'F-01'], function () {
      // 产品入库（含加工费）
      var totalAmount = (op.raw_amount || 0) + (op.processing_fee || 0);
      SC.store.create('S-21', {
        transaction_no: SC.store.nextNo('IT'),
        transaction_type: '委托产成',
        material_id: op.product_material_id,
        warehouse_id: op.to_warehouse_id,
        quantity_delta: op.product_quantity || 0,
        amount_delta: totalAmount,
        source_bill_type: 'OP-01',
        source_bill_id: op.id,
      });
      var prodInv = SC.store.upsert('S-13',
        { warehouse_id: op.to_warehouse_id, material_id: op.product_material_id },
        {});
      var newQty = (prodInv.quantity || 0) + (op.product_quantity || 0);
      var newAmount = (prodInv.total_amount || 0) + totalAmount;
      SC.store.update('S-13', prodInv.id, {
        quantity: newQty,
        total_amount: newAmount,
        unit_cost: newQty > 0 ? newAmount / newQty : 0,
      });
      // F-01 加工费 NC 推送
      var ncSwitch = SC.store.list('F-13', { switch_code: 'BIZ-019-switch' })[0];
      if (!ncSwitch || ncSwitch.switch_status === '开') {
        var task = SC.store.create('F-01', {
          task_no: SC.store.nextNo('FT'),
          interface_id: 'BIZ-019',
          source_bill_no: op.op_no,
          source_bill_type: 'OP-01',
          source_bill_id: op.id,
          task_state: '待推送',
          retry_count: 0,
        });
        if (SC.nc) setTimeout(function () { SC.nc.push(task.id); }, 0);
      }
    });
    console.log('[linkage] OP-01:' + op.id + ' 已入库 → S-21 产品入库 + S-13 加产品（含加工费）+ F-01 BIZ-019');
  });

  /* B4 三对一致：暴露手工触发函数（账实对账 + 系统对账）— 演示用，实际是月度调度 */
  SC.linkage.runReconciliation = function () {
    var s13 = SC.store.list('S-13');
    var s21 = SC.store.list('S-21');
    var results = [];
    s13.forEach(function (i) {
      var related = s21.filter(function (t) { return t.material_id === i.material_id && t.warehouse_id === i.warehouse_id; });
      var sum = related.reduce(function (a, t) { return a + (t.quantity_delta || 0); }, 0);
      var diff = (i.quantity || 0) - sum;
      results.push({
        material_id: i.material_id,
        warehouse_id: i.warehouse_id,
        s13_qty: i.quantity || 0,
        s21_sum: sum,
        diff: diff,
        consistent: diff === 0,
      });
    });
    var inconsistent = results.filter(function (r) { return !r.consistent; });
    if (inconsistent.length > 0) {
      emitAlert({
        alert_code: 'ALR-INV-RECON-001',
        level: '重要',
        source_entity: 'S-13',
        source_id: 0,
        title: '三对一致对账异常',
        message: 'S-13 余额 vs S-21 流水累计 ' + inconsistent.length + ' 行不一致；详设 11 §11.1 INV_RECON_TRIPLE_CONSISTENCY 月度调度任务',
      });
    }
    return results;
  };

  /* 暴露给页面调用：mock 触发审批超时（无时间穿越的替代）*/
  SC.linkage.mockTriggerWFTimeout = function () {
    var pending = []
      .concat(SC.store.list('P-01', { state: '待审' }))
      .concat(SC.store.list('P-02', { state: '待审' }));
    pending.slice(0, 3).forEach(function (p) {
      emitAlert({
        alert_code: 'ALR-WF-001',
        level: '一般',
        source_entity: p.request_no ? 'P-01' : 'P-02',
        source_id: p.id,
        title: '审批超时',
        message: (p.request_no || p.plan_no || '#' + p.id) + ' 提交超过 4h 未处理（mock 触发）',
      });
    });
    return pending.slice(0, 3).length;
  };

  console.log('[linkage] ready · ' + Object.keys(listeners).length + ' event(s) wired + 3 auto-alert handlers');
})();
