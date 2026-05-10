/* ============================================================
 * 档 A 一期 · Day 2 · 状态机引擎
 * SC.sm — define / canTransition / getAllowedEvents / transition
 *
 * 状态机配置结构：
 *   {
 *     stateField: 'state',           // 实体上保存状态的字段名
 *     initial: '草稿',                // 创建实体时的默认状态
 *     states: {
 *       '草稿': { on: { '提交审批': '待审' } },
 *       '待审': { on: { '审批通过': { target: '已审', guards: ['xxx'] } } },
 *     },
 *     guards: { xxx: function(item, payload) { return true; } }
 *   }
 * ============================================================ */
(function () {
  var SC = window.SC = window.SC || {};
  if (SC.sm) return;

  var machines = {};

  function getStateField(entity) {
    var m = machines[entity];
    return (m && m.stateField) || 'state';
  }

  SC.sm = {
    define: function (entity, config) {
      machines[entity] = config;
    },

    has: function (entity) { return !!machines[entity]; },

    initialState: function (entity) {
      var m = machines[entity];
      return m ? m.initial : null;
    },

    /* 当前状态可执行哪些 event */
    getAllowedEvents: function (entity, item) {
      var m = machines[entity];
      if (!m || !item) return [];
      var current = item[getStateField(entity)];
      var s = m.states[current];
      return s && s.on ? Object.keys(s.on) : [];
    },

    canTransition: function (entity, item, event) {
      var m = machines[entity];
      if (!m || !item) return false;
      var current = item[getStateField(entity)];
      var s = m.states[current];
      if (!s || !s.on) return false;
      var next = s.on[event];
      if (!next) return false;
      var guards = typeof next === 'object' ? (next.guards || []) : [];
      for (var i = 0; i < guards.length; i++) {
        var g = m.guards && m.guards[guards[i]];
        if (!g) return false;
        if (!g(item)) return false;
      }
      return true;
    },

    /* 触发状态迁移：返回更新后的实体 */
    transition: function (entity, id, event, payload) {
      var m = machines[entity];
      if (!m) throw new Error('SM not defined: ' + entity);
      var item = SC.store.get(entity, id);
      if (!item) throw new Error('Item not found: ' + entity + ' #' + id);
      var stateField = getStateField(entity);
      var current = item[stateField];
      var s = m.states[current];
      if (!s || !s.on) throw new Error('State has no transitions: ' + entity + '.' + current);
      var next = s.on[event];
      if (!next) throw new Error('Event not allowed: ' + event + ' from ' + current);

      var target = typeof next === 'string' ? next : next.target;
      var guards = typeof next === 'object' ? (next.guards || []) : [];

      for (var i = 0; i < guards.length; i++) {
        var g = m.guards && m.guards[guards[i]];
        if (!g) throw new Error('Unknown guard: ' + guards[i]);
        if (!g(item, payload)) throw new Error('Guard failed: ' + guards[i]);
      }

      var patch = {};
      patch[stateField] = target;
      var updated = SC.store.update(entity, id, patch);

      // emit linkage events
      if (SC.linkage && updated) {
        SC.linkage.emit(entity + ':' + target, updated, payload);
        SC.linkage.emit(entity + ':' + current + '→' + target, updated, payload);
      }

      console.log('[sm]', entity + '#' + id, current, '→', target, '(' + event + ')');
      return updated;
    },

    /* 调试：列出所有状态机 */
    debug: function () {
      var out = {};
      Object.keys(machines).forEach(function (e) {
        out[e] = {
          initial: machines[e].initial,
          states: Object.keys(machines[e].states),
        };
      });
      return out;
    },

    _machines: machines,
  };

  /* ====================================================
   * 预定义状态机（对齐详设 V1.x）
   * ==================================================== */

  // P-01 需求（详设 04）
  SC.sm.define('P-01', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交审批': '待审', '作废': '已作废' } },
      '待审': { on: { '审批通过': '已审', '审批驳回': '已驳回' } },
      '已审': {},
      '已驳回': { on: { '修改后重提': '待审' } },
      '已作废': {},
    },
    guards: {},
  });

  // P-02 采购计划（详设 04 + 02 V0.4 §6.2）
  SC.sm.define('P-02', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交审批': { target: '待审', guards: ['hasLines'] } } },
      '待审': { on: { '审批通过': '已审', '审批驳回': '已驳回' } },
      '已审': { on: { '全部任务分解完毕': { target: '已分解', guards: ['allTasksDecomposed'] } } },
      '已驳回': { on: { '修改后提交': '待审' } },
      '已分解': {},
      '已作废': {},
    },
    guards: {
      hasLines: function (plan) {
        var lines = SC.store.list('P-03', { plan_id: plan.id });
        return lines.length > 0 || (plan.lines && plan.lines.length > 0);
      },
      allTasksDecomposed: function (plan) {
        var tasks = SC.store.list('P-05', { plan_id: plan.id });
        if (tasks.length === 0) return false;
        return tasks.every(function (t) {
          return ['已分解', '待采购', '已分流', '已完成'].indexOf(t.task_state) >= 0;
        });
      },
    },
  });

  // P-05 采购任务（详设 04）
  SC.sm.define('P-05', {
    stateField: 'task_state',
    initial: '草稿',
    states: {
      '草稿': { on: { '确认分解': '已分解', '合并': '已合并', '作废': '已作废' } },
      '已分解': { on: { '进入采购': '待采购', '路径分流': '已分流' } },
      '待采购': { on: { '路径分流': '已分流', '完成': '已完成' } },
      '已分流': { on: { '完成': '已完成' } },
      '已合并': {},
      '已完成': {},
      '已作废': {},
    },
    guards: {},
  });

  // T-01 招标申请（详设 04）
  SC.sm.define('T-01', {
    stateField: 'state',
    initial: '待申请',
    states: {
      '待申请': { on: { '提交审批': '待审' } },
      '待审': { on: { '审批通过': '已审', '审批驳回': '已驳回' } },
      '已审': { on: { '结案': '已结案' } },
      '已驳回': { on: { '修改后提交': '待审' } },
      '已结案': {},
    },
    guards: {},
  });

  // T-03 标包（D1 简化 + E5 流标，详设 04 §4.10.4-5）
  SC.sm.define('T-03', {
    stateField: 'state',
    initial: '待标',
    states: {
      '待标': { on: { '直录中标': '已结案', '流标': '流标' } },
      '流标': { on: { '重新发标': '待标', '终止': '已终止' } },
      '已结案': {},
      '已终止': {},
    },
    guards: {},
  });

  // C-02 合同（详设 05 §4.2.1 + V0.4 §1.1）
  SC.sm.define('C-02', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交会签': '会签中' } },
      '会签中': { on: { '会签通过': '已签', '会签驳回': '草稿' } },
      '已签': { on: { '执行': '执行中' } },
      '执行中': { on: { '完成': '已完成', '发起变更': '已变更', '终止': '已终止' } },
      '已变更': { on: { '变更生效': '执行中' } },
      '已完成': {},
      '已终止': {},
      '已作废': {},
    },
    guards: {},
  });

  // S-02 采购订单（详设 04）
  SC.sm.define('S-02', {
    stateField: 'order_state',
    initial: '草稿',
    states: {
      '草稿': { on: { '下达': '已下达' } },
      '已下达': { on: { '部分到货': '部分到货', '全部到货': '全部到货', '关闭': '已关闭' } },
      '部分到货': { on: { '继续到货': '部分到货', '全部到货': '全部到货', '关闭': '已关闭' } },
      '全部到货': { on: { '关闭': '已关闭' } },
      '已关闭': {},
    },
    guards: {},
  });

  // S-03 到货验收（详设 06）
  SC.sm.define('S-03', {
    stateField: 'state',
    initial: '待验收',
    states: {
      '待验收': { on: { '验收': '已验收', '拒收': '已拒收' } },
      '已验收': {},
      '已拒收': {},
    },
    guards: {},
  });

  // S-04 质检（D3 开关启用，详设 06 §4.3.1 三类验收串行短路）
  SC.sm.define('S-04', {
    stateField: 'state',
    initial: '待检',
    states: {
      '待检': { on: { '开始品种检验': '品种检验中' } },
      '品种检验中': { on: { '品种合格': '数量检验中', '品种不合格': '已检验' } },
      '数量检验中': { on: { '数量合格': '质量检验中', '数量不合格': '已检验' } },
      '质量检验中': { on: { '质量合格': '已检验', '质量不合格': '已检验' } },
      '已检验': {},
    },
    guards: {},
  });

  // C-01 合同会签（v0.16 补 P2-1：原 C-01 没状态机，contract-detail 用手工按钮）
  SC.sm.define('C-01', {
    stateField: 'approval_state',
    initial: '会签中',
    states: {
      '会签中': { on: { '会签通过': '已批准', '会签驳回': '已驳回' } },
      '已批准': {},
      '已驳回': { on: { '修改后重提': '会签中' } },
    },
    guards: {},
  });

  // S-01 采购申请（v0.16 补 P1-3：直采 / 合同采购 路径达到订单）
  SC.sm.define('S-01', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交审批': '待审', '作废': '已作废' } },
      '待审': { on: { '审批通过': '已审', '审批驳回': '已驳回' } },
      '已审': {},
      '已驳回': { on: { '修改后重提': '待审' } },
      '已作废': {},
    },
    guards: {},
  });

  // S-07 采购入库暂估（详设 06 §4.7 + 02 V0.4 二期 A8）
  SC.sm.define('S-07', {
    stateField: 'estimate_state',
    initial: '暂估中',
    states: {
      '暂估中': { on: { '冲销': '已冲销', '正式入账': '已正式入账', '作废': '已作废' } },
      '已冲销': {},
      '已正式入账': {},
      '已作废': {},
    },
    guards: {},
  });

  // S-08 领料申请（详设 06 + 02 V0.4 二期 A2 出库主线）
  SC.sm.define('S-08', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交审批': '待审', '作废': '已作废' } },
      '待审': { on: { '审批通过': '已审', '审批驳回': '已驳回' } },
      '已审': { on: { '出库执行': '已出库' } },
      '已出库': {},
      '已驳回': { on: { '修改后重提': '待审' } },
      '已作废': {},
    },
    guards: {},
  });

  // S-09 出库执行（详设 06 + 二期 A2，对应 BIZ-005 自用消耗）
  SC.sm.define('S-09', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '执行出库': '已出库', '撤销': '已撤销' } },
      '已出库': { on: { '冲销': '已冲销' } },
      '已冲销': {},
      '已撤销': {},
    },
    guards: {},
  });

  // C-08 付款申请（详设 05 §7 + 二期 A4b）
  SC.sm.define('C-08', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交审批': '待审', '作废': '已作废' } },
      '待审': { on: { '审批通过': '已审', '审批驳回': '已驳回' } },
      '已审': { on: { '执行付款': '已支付' } },
      '已支付': {},
      '已驳回': { on: { '修改后重提': '待审' } },
      '已作废': {},
    },
    guards: {},
  });

  // C-10 付款执行（详设 05 §7 + 二期 A4b，对应 BIZ-013 NC 实付回写）
  SC.sm.define('C-10', {
    stateField: 'state',
    initial: '待执行',
    states: {
      '待执行': { on: { '执行': '执行中', '取消': '已取消' } },
      '执行中': { on: { '记账完成': '已记账', '失败': '已失败' } },
      '已记账': {},
      '已失败': { on: { '重试': '执行中' } },
      '已取消': {},
    },
    guards: {},
  });

  // S-11 调拨申请（详设 06 + 二期 A3 调拨主线）
  SC.sm.define('S-11', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交审批': '待审', '作废': '已作废' } },
      '待审': { on: { '审批通过': '已审', '审批驳回': '已驳回' } },
      '已审': { on: { '执行调拨': '已调出' } },
      '已调出': {},
      '已驳回': { on: { '修改后重提': '待审' } },
      '已作废': {},
    },
    guards: {},
  });

  // S-12 调拨执行（详设 06 + 二期 A3，对应 BIZ-007 内部往来）
  SC.sm.define('S-12', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '执行调拨': '已执行', '撤销': '已撤销' } },
      '已执行': {},
      '已撤销': {},
    },
    guards: {},
  });

  // S-15 盘点单（详设 06 + 二期 A5 盘点主线）
  SC.sm.define('S-15', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '开始盘点': '进行中', '作废': '已作废' } },
      '进行中': { on: { '完成盘点': '已盘点' } },
      '已盘点': { on: { '审批通过': '已审', '审批驳回': '已驳回' } },
      '已审': { on: { '结案': '已结案' } },
      '已结案': {},
      '已驳回': { on: { '修改后重提': '已盘点' } },
      '已作废': {},
    },
    guards: {},
  });

  // S-17 盘盈盘亏调整（详设 06 + 二期 A5，对应 BIZ-008 盘盈 / BIZ-009 盘亏）
  SC.sm.define('S-17', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交审批': '待审' } },
      '待审': { on: { '审批通过': '已审', '审批驳回': '已驳回' } },
      '已审': { on: { '执行调整': '已调整' } },
      '已调整': {},
      '已驳回': { on: { '修改后重提': '待审' } },
    },
    guards: {},
  });

  // M-13 供应商后评价（详设 04 §4.1.4 + 二期 A12，差评累计触发重评估）
  SC.sm.define('M-13', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交确认': '待审' } },
      '待审': { on: { '确认评价': '已确认', '驳回评价': '已驳回' } },
      '已确认': { on: { '供应商申诉': '已争议' } },
      '已争议': { on: { '维持评价': '已确认', '撤销评价': '已驳回' } },
      '已驳回': {},
    },
    guards: {},
  });

  // M-09 供应商状态（详设 04 + 二期 B3，maintained by 主数据 + 后评价 linkage）
  SC.sm.define('M-09', {
    stateField: 'state',
    initial: '合格',
    states: {
      '合格': { on: { '暂停接单': '暂停', '加入黑名单': '黑名单' } },
      '暂停': { on: { '恢复合格': '合格', '加入黑名单': '黑名单' } },
      '黑名单': { on: { '解除黑名单': '暂停' } },
    },
    guards: {},
  });

  // S-05 采购入库（详设 06，最关键的演示点：S-05:已审 触发库存原子事务 + NC mock）
  SC.sm.define('S-05', {
    stateField: 'state',
    initial: '草稿',
    states: {
      '草稿': { on: { '提交审核': '待审' } },
      '待审': { on: { '审核通过': '已审', '审核驳回': '草稿' } },
      '已审': { on: { '冲销': '已冲销' } },
      '已冲销': {},
      '已作废': {},
    },
    guards: {},
  });

  console.log('[sm] ready · ' + Object.keys(machines).length + ' machines:', Object.keys(machines).join(', '));
})();
