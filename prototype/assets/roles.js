/* ============================================================
 * 档 A 一阶段 · Day 5 · 6 角色定义与能力
 * SC.roles — current / set / capabilities / canSee / dataFilter
 *
 * 注意：SC.data.roles（chrome.js 用的角色列表）继续作为角色基础数据；
 * 本文件提供 capabilities 层（菜单可见性 + 数据范围过滤）。
 * ============================================================ */
(function () {
  var SC = window.SC = window.SC || {};
  if (SC.roles) return;

  var STORAGE_KEY = 'sc.role';

  /* 6 角色 + 能力定义（按 02 V0.4 §4.1 + §10.1 验收 11 角色切换演示）*/
  var capabilities = {
    'buyer': {
      label: '采购员',
      menus: [
        'dashboard', 'requirement-list', 'purchase-orders', 'tender', 'tender-archive',
        'goods-receipt', 'quality-check', 'inventory', 'approval-center', 'reports',
      ],
      dataScope: 'OWN_DEPT',
      defaultLanding: 'requirement-list.html',
      description: '负责需求接收、采购单创建、招标录入、到货跟踪',
    },
    'planner': {
      label: '计划员',
      menus: [
        'dashboard', 'requirement-list', 'purchase-planning', 'purchase-task-decomposition',
        'tender', 'inventory', 'approval-center', 'reports', 'alert-rules',
      ],
      dataScope: 'GROUP',
      defaultLanding: 'purchase-planning.html',
      description: '负责需求归集、计划汇总、任务分解、标包编排',
    },
    'storage_mgr': {
      label: '物资主管',
      menus: [
        'dashboard', 'inventory', 'inventory-flow', 'goods-receipt', 'quality-check',
        'stocktake', 'mobile-stocktake', 'scrap-disposal', 'approval-center',
        'supplier-performance', 'reports',
      ],
      dataScope: 'OWN_MINE',
      defaultLanding: 'inventory.html',
      description: '负责入库审核、库存管理、盘点、废旧处置、供应商履约',
    },
    'finance': {
      label: '财务',
      menus: [
        'dashboard', 'payment-request', 'three-way-match', 'tentative-estimate',
        'funding-plan', 'nc-interface', 'nc-interface-detail', 'contract-list',
        'contract-detail', 'reports', 'approval-center',
      ],
      dataScope: 'GROUP',
      defaultLanding: 'nc-interface.html',
      description: '负责合同会签、付款审批、三单匹配、NC 接口监控',
    },
    'it': {
      label: 'IT',
      menus: [
        'dashboard', 'nc-interface', 'nc-interface-detail', 'system-admin',
        'alert-rules', 'xinchuang-matrix', 'reports',
      ],
      dataScope: 'GROUP',
      defaultLanding: 'nc-interface.html',
      description: '负责 NC 接口运维、系统配置、信创适配、预警规则',
    },
    'group_committee': {
      label: '集团委员会',
      menus: [
        'dashboard', 'approval-center', 'reports', 'dashboard-bigscreen',
        'contract-list', 'contract-detail',
      ],
      dataScope: 'GROUP',
      defaultLanding: 'dashboard-bigscreen.html',
      description: '集团领导小组：大额审批、月度集体决议、汇报视图',
    },
  };

  SC.roles = {
    STORAGE_KEY: STORAGE_KEY,
    capabilities: capabilities,

    current: function () {
      return localStorage.getItem(STORAGE_KEY) || 'planner';
    },

    /* 当前角色对象（含能力） */
    currentInfo: function () {
      var id = SC.roles.current();
      return Object.assign({ id: id }, capabilities[id] || capabilities['planner']);
    },

    /* 设置当前角色 + 跨页广播 */
    set: function (roleId) {
      if (!capabilities[roleId]) {
        console.warn('[roles] unknown role:', roleId);
        return false;
      }
      var oldRole = SC.roles.current();
      localStorage.setItem(STORAGE_KEY, roleId);
      // 跨页广播角色切换
      if (SC.store && SC.store._bus) {
        try { SC.store._bus.postMessage({ type: 'role-change', from: oldRole, to: roleId, ts: Date.now() }); } catch (e) {}
      }
      console.log('[roles] switched:', oldRole, '→', roleId);
      return true;
    },

    list: function () {
      return Object.keys(capabilities).map(function (id) {
        return Object.assign({ id: id }, capabilities[id]);
      });
    },

    /* 菜单可见性 */
    canSee: function (menuId, roleId) {
      var caps = capabilities[roleId || SC.roles.current()] || capabilities['planner'];
      return caps.menus.indexOf(menuId) >= 0;
    },

    /* 数据范围过滤（mock 实现：返回 store 查询的 filter 对象） */
    dataFilter: function (entity, roleId) {
      var caps = capabilities[roleId || SC.roles.current()] || capabilities['planner'];
      // GROUP / OWN_MINE / OWN_DEPT 三档；mock 实现保留 filter 占位
      if (caps.dataScope === 'GROUP') return null;          // 全集团数据
      if (caps.dataScope === 'OWN_MINE') return { _scope: 'OWN_MINE' }; // 演示用
      if (caps.dataScope === 'OWN_DEPT') return { _scope: 'OWN_DEPT' };
      return null;
    },

    /* 计算角色在当前数据下的待办数（用于徽标）*/
    badgeCounts: function (roleId) {
      var role = roleId || SC.roles.current();
      var counts = { todo: 0, alert: 0 };
      if (!SC.store) return counts;

      try {
        // 待办：物资主管/集团委员会看 P-02 待审；财务看 C-02 待会签；采购员看 P-01 已驳回需修改
        if (role === 'storage_mgr' || role === 'group_committee') {
          counts.todo += SC.store.list('P-02', { state: '待审' }).length;
        }
        if (role === 'finance' || role === 'group_committee') {
          counts.todo += SC.store.list('C-02', { state: '会签中' }).length;
        }
        if (role === 'storage_mgr') {
          counts.todo += SC.store.list('P-01', { state: '待审' }).length;
        }
        if (role === 'buyer') {
          counts.todo += SC.store.list('P-01', { state: '已驳回' }).length;
          counts.todo += SC.store.list('S-02', { order_state: '草稿' }).length;
        }
        if (role === 'it') {
          counts.alert += SC.store.list('F-01', { task_state: '推送失败' }).length;
        }
        // 通用：未读预警
        if (SC.store.list('R-05')) {
          counts.alert += SC.store.list('R-05', { read_state: '未读' }).length;
        }
      } catch (e) {
        console.warn('[roles] badgeCounts error:', e);
      }
      return counts;
    },
  };

  console.log('[roles] ready · ' + Object.keys(capabilities).length + ' roles · current=' + SC.roles.current());
})();
