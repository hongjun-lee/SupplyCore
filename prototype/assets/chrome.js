/* SupplyCore 原型 — 顶部 / 侧栏 / 角色切换 / 演示横幅
 * 用法（每个页面只需 4 行）：
 *   <div id="header"></div>
 *   <div class="app-layout"><div id="sidebar"></div><div class="app-main"><div id="page-area"></div></div></div>
 *   <script src="assets/data.js"></script><script src="assets/chrome.js"></script>
 *   <script>SC.layout({ page:'requirement-list', crumbs:['采购协同','需求计划'], title:'需求计划', desc:'…', actions:[…] });</script>
 */
window.SC = window.SC || {};

SC.docVer = '对齐详设 V1.2 基线（2026-05-10 同步）';

SC.nav = [
  { title: '工作', items: [
    { id: 'dashboard',         href: 'index.html',              label: '工作台', icon: '◰' },
    { id: 'approval-center',   href: 'approval-center.html',    label: '审批中心', icon: '✓', badge: 4 },
  ]},
  { title: '业务流转', items: [
    { id: 'requirement-list',  href: 'requirement-list.html',   label: '需求计划', icon: '✎' },
    { id: 'purchase-orders',   href: 'purchase-orders.html',    label: '采购订单', icon: '⇄' },
    { id: 'goods-receipt',     href: 'goods-receipt.html',      label: '到货验收', icon: '⇩' },
    { id: 'quality-check',     href: 'quality-check.html',      label: '质检', icon: '✓' },
    { id: 'inventory',         href: 'inventory.html',          label: '库存查询', icon: '▦' },
    { id: 'inventory-flow',    href: 'inventory-flow.html',     label: '库存流转', icon: '↔' },
    { id: 'stocktake',         href: 'stocktake.html',          label: '盘点', icon: '⊞' },
    { id: 'scrap-disposal',    href: 'scrap-disposal.html',     label: '废旧处置', icon: '✗' },
    { id: 'equipment-rent',    href: 'equipment-rent.html',     label: '设备租赁', icon: '⚙' },
    { id: 'equipment-lifecycle', href: 'equipment-lifecycle.html', label: '设备生命周期', icon: '◑' },
    { id: 'maintenance-order', href: 'maintenance-order.html',  label: '设备维修工单', icon: '⚒' },
    { id: 'equipment-oee',     href: 'equipment-oee.html',      label: '设备 OEE 看板', icon: '◴' },
    { id: 'mobile-stocktake',  href: 'mobile-stocktake.html',   label: '移动端盘点（演示）', icon: '▢' },
  ]},
  { title: '采购协同', items: [
    { id: 'purchase-planning', href: 'purchase-planning.html', label: '采购计划编排', icon: '☷' },
    { id: 'purchase-task-decomposition', href: 'purchase-task-decomposition.html', label: '采购任务分解', icon: '⇢' },
    { id: 'tender',            href: 'tender.html',             label: '招投标', icon: '◐' },
    { id: 'tender-archive',    href: 'tender-archive.html',     label: '招投标归档', icon: '▣' },
  ]},
  { title: '合同与资金', items: [
    { id: 'contract-list',     href: 'contract-list.html',      label: '合同管理', icon: '◇' },
    { id: 'contract-detail',   href: 'contract-detail.html',    label: '合同详情（演示）', icon: '◇' },
    { id: 'payment-request',   href: 'payment-request.html',    label: '付款申请（演示）', icon: '¥' },
    { id: 'funding-plan',      href: 'funding-plan.html',       label: '资金计划（月度）', icon: '☷' },
    { id: 'three-way-match',   href: 'three-way-match.html',    label: '三单匹配', icon: '☰' },
    { id: 'tentative-estimate', href: 'tentative-estimate.html', label: '暂估闭环', icon: '◌' },
  ]},
  { title: '基础数据', items: [
    { id: 'material-master',   href: 'material-master.html',    label: '物料主数据', icon: '◫' },
    { id: 'base-archive',      href: 'base-archive.html',       label: '基础档案', icon: '◯' },
    { id: 'supplier-performance', href: 'supplier-performance.html', label: '供应商履约画像', icon: '◎' },
  ]},
  { title: '决策 / AI', items: [
    { id: 'reports',           href: 'reports.html',            label: '报表 / AI 助理', icon: '☆' },
    { id: 'alert-rules',       href: 'alert-rules.html',        label: '预警规则配置', icon: '!' },
    { id: 'ai-assistant',      href: 'ai-assistant.html',       label: 'AI 助理（独立演示）', icon: '✺' },
    { id: 'ai-write-flow',     href: 'ai-write-flow.html',      label: 'AI 写操作（演示）', icon: '✎' },
    { id: 'dashboard-bigscreen', href: 'dashboard-bigscreen.html', label: '大屏看板（投屏）', icon: '⬜' },
  ]},
  { title: '运维 / 集成', items: [
    { id: 'nc-interface',      href: 'nc-interface.html',       label: 'NC 接口监控', icon: '⇆' },
    { id: 'nc-interface-detail', href: 'nc-interface-detail.html', label: '接口异常详情（演示）', icon: '⚠' },
    { id: 'system-admin',      href: 'system-admin.html',       label: '系统管理', icon: '⚙' },
    { id: 'xinchuang-matrix',  href: 'xinchuang-matrix.html',   label: '信创兼容性矩阵', icon: '◧' },
  ]},
];

SC.layout = function (opts) {
  opts = opts || {};
  const headerEl = document.getElementById('header');
  if (headerEl) headerEl.outerHTML = SC.renderHeader();
  const sideEl = document.getElementById('sidebar');
  if (sideEl) sideEl.outerHTML = SC.renderSidebar(opts.page);
  const area = document.getElementById('page-area');
  if (area && (opts.crumbs || opts.title)) {
    area.insertAdjacentHTML('afterbegin', SC.renderPageHeader(opts));
  }
  SC.bindRoleSwitch();
  SC.renderFooter();
};

SC.renderHeader = function () {
  const sg = SC.data.subGroup;
  const role = SC.getRole();
  const sgChildren = sg.children.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const roleOpts = SC.data.roles.map(r =>
    `<option value="${r.id}" ${r.id === role.id ? 'selected' : ''}>${r.label}</option>`).join('');
  return `
  <div class="demo-banner">
    <span><strong>原型演示 · 非真实数据</strong> — 仅用于业务沟通、需求确认与招标说明</span>
    <span class="doc-ver">${SC.docVer}</span>
  </div>
  <header class="app-header">
    <button class="menu-toggle" id="menu-toggle" aria-label="菜单">☰</button>
    <div class="logo">
      <div class="mark">辽</div>
      <div>辽宁能源 · 阜矿物资供应管理系统 <span class="sub">原型 v0.10</span></div>
    </div>
    <span class="spacer"></span>
    <div class="h-item">二级集团：<strong style="color:var(--text);font-weight:500;margin-left:4px;">${sg.name}</strong></div>
    <div class="h-item">
      厂矿：
      <select class="role-select" style="margin-left:4px;">
        <option value="ALL">全部</option>${sgChildren}
      </select>
    </div>
    <div class="h-item">
      当前角色：
      <select id="role-switch" class="role-select" style="margin-left:4px;">${roleOpts}</select>
    </div>
    <div class="avatar" title="${role.label}">${role.label.slice(0, 1)}</div>
  </header>`;
};

SC.renderSidebar = function (activeId) {
  const sections = SC.nav.map(sec => {
    const items = sec.items.map(it => {
      const cls = ['nav-item'];
      if (it.id === activeId) cls.push('active');
      const muted = it.muted ? ' style="opacity:0.55;cursor:not-allowed;"' : '';
      const badge = it.badge ? `<span class="badge">${it.badge}</span>` : '';
      return `<a class="${cls.join(' ')}" href="${it.href}"${muted}>
        <span class="icon">${it.icon}</span>
        <span>${it.label}</span>${badge}
      </a>`;
    }).join('');
    return `<div class="nav-section">
      <div class="nav-section-title">${sec.title}</div>
      ${items}
    </div>`;
  }).join('');
  return `<aside class="app-sidebar">${sections}</aside>`;
};

SC.renderPageHeader = function (opts) {
  const crumbs = (opts.crumbs || []).map(c => `<span>${c}</span>`).join('');
  const actions = (opts.actions || []).map(a =>
    `<button class="btn ${a.primary ? 'btn-primary' : ''}">${a.label}</button>`).join('');
  return `
    <div class="crumbs">${crumbs}</div>
    <div class="page-header">
      <div>
        <h1 class="title">${opts.title || ''}</h1>
        ${opts.desc ? `<div class="desc">${opts.desc}</div>` : ''}
      </div>
      <div class="actions">${actions}</div>
    </div>`;
};

SC.renderFooter = function () {
  if (document.querySelector('.app-footer')) return;
  const f = document.createElement('div');
  f.className = 'app-footer';
  f.innerHTML = `SupplyCore 原型 v0.10 · 演示数据，不作为开发或验收依据 · ${SC.docVer}`;
  document.body.appendChild(f);
};

SC.getRole = function () {
  const id = localStorage.getItem('sc.role') || 'planner';
  return SC.data.roles.find(r => r.id === id) || SC.data.roles[1];
};
SC.bindRoleSwitch = function () {
  const sel = document.getElementById('role-switch');
  if (sel) {
    sel.addEventListener('change', e => {
      localStorage.setItem('sc.role', e.target.value);
      location.reload();
    });
  }
  const tgl = document.getElementById('menu-toggle');
  if (tgl) {
    tgl.addEventListener('click', () => {
      document.querySelector('.app-sidebar').classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      const sb = document.querySelector('.app-sidebar');
      if (!sb || !sb.classList.contains('open')) return;
      if (!sb.contains(e.target) && e.target.id !== 'menu-toggle') {
        sb.classList.remove('open');
      }
    });
  }
};

/* ─── 工具：渲染状态徽章 ─── */
SC.badge = function (label, color, dot) {
  return `<span class="badge ${color || 'gray'} ${dot ? 'dot' : ''}">${label}</span>`;
};
SC.fmtMoney = function (n) {
  return '¥ ' + Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
SC.fmtNum = function (n) { return Number(n).toLocaleString('zh-CN'); };
