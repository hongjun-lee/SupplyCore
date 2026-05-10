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

  /* P-02 计划审批通过 → 按 P-03 计划行预生成 P-05 草稿 */
  SC.linkage.on('P-02:已审', function (plan) {
    var lines = SC.store.list('P-03', { plan_id: plan.id });
    if (lines.length === 0 && plan.lines) {
      // 嵌入式 lines 兼容
      lines = plan.lines.map(function (l, i) {
        return Object.assign({ id: -(i + 1) }, l);
      });
    }
    if (lines.length === 0) {
      console.warn('[linkage] P-02:' + plan.id + ' 已审，但无计划行可生成 P-05');
      return;
    }
    lines.forEach(function (line) {
      SC.store.create('P-05', {
        task_no: SC.store.nextNo('PT'),
        plan_id: plan.id,
        plan_line_id: line.id,
        material_id: line.material_id,
        quantity: line.quantity,
        amount: line.amount,
        task_state: '草稿',
        tender_type: line.tender_type || null, // 计划员后续手工选择
      });
    });
    console.log('[linkage] P-02:' + plan.id + ' 已审 → 生成 ' + lines.length + ' 个 P-05 草稿');
  });

  /* P-05 计划员确认分解 → 按采购方式分流 + 触发 P-02 自动转已分解 */
  SC.linkage.on('P-05:草稿→已分解', function (task) {
    // 路径分流：招采 → T-01；直采 → S-01
    if (task.tender_type === '招标' || task.tender_type === '招采') {
      SC.store.create('T-01', {
        application_no: SC.store.nextNo('TA'),
        task_id: task.id,
        plan_id: task.plan_id,
        material_id: task.material_id,
        amount: task.amount,
        state: '待申请',
      });
      console.log('[linkage] P-05:' + task.id + ' 已分解 (招采) → 创建 T-01');
    } else if (task.tender_type === '直采' || task.tender_type === '直接采购') {
      SC.store.create('S-01', {
        request_no: SC.store.nextNo('PR'),
        task_id: task.id,
        plan_id: task.plan_id,
        material_id: task.material_id,
        amount: task.amount,
        state: '草稿',
      });
      console.log('[linkage] P-05:' + task.id + ' 已分解 (直采) → 创建 S-01');
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

  /* T-05 中标结果验证通过 → 自动创建 C-01 合同会签 */
  SC.linkage.on('T-05:已验证', function (result) {
    SC.store.create('C-01', {
      approval_no: SC.store.nextNo('CA'),
      tender_result_id: result.id,
      supplier_id: result.supplier_id,
      contract_amount: result.winning_amount,
      approval_state: '会签中',
    });
    console.log('[linkage] T-05:' + result.id + ' 已验证 → 创建 C-01 会签');
  });

  /* C-02 已签 → 同步设置 executed_amount = 0 / paid_amount = 0 */
  SC.linkage.on('C-02:已签', function (contract) {
    SC.store.update('C-02', contract.id, {
      executed_amount: 0,
      paid_amount: 0,
    });
    console.log('[linkage] C-02:' + contract.id + ' 已签 → 初始化执行/已付金额');
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
