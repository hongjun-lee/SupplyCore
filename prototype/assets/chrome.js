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
    { id: 'purchase-receipt',  href: 'purchase-receipt.html',   label: '采购入库审核 ★', icon: '☷' },
    { id: 'quality-check',     href: 'quality-check.html',      label: '质检', icon: '✓' },
    { id: 'inventory',         href: 'inventory.html',          label: '库存查询', icon: '▦' },
    { id: 'inventory-flow',    href: 'inventory-flow.html',     label: '库存流转', icon: '↔' },
    { id: 'stocktake',         href: 'stocktake.html',          label: '盘点', icon: '⊞' },
    { id: 'scrap-disposal',    href: 'scrap-disposal.html',     label: '废旧处置', icon: '✗' },
    { id: 'equipment-rent',    href: 'equipment-rent.html',     label: '设备租赁', icon: '⚙' },
    { id: 'equipment-lifecycle', href: 'equipment-lifecycle.html', label: '设备生命周期', icon: '◑' },
    { id: 'maintenance-order', href: 'maintenance-order.html',  label: '设备维修工单', icon: '⚒' },
    { id: 'equipment-oee',     href: 'equipment-oee.html',      label: '设备 OEE 看板', icon: '◴' },
    { id: 'material-issuance', href: 'material-issuance.html',  label: '领料出库主线 ★二期', icon: '↗' },
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
    { id: 'council-meeting',   href: 'council-meeting.html',    label: '月度集体决议 ★二期', icon: '⊕' },
    { id: 'payment-execution', href: 'payment-execution.html',  label: '付款执行台账 ★二期', icon: '✓' },
  ]},
  { title: '基础数据', items: [
    { id: 'material-master',   href: 'material-master.html',    label: '物料主数据', icon: '◫' },
    { id: 'base-archive',      href: 'base-archive.html',       label: '基础档案', icon: '◯' },
    { id: 'supplier-performance', href: 'supplier-performance.html', label: '供应商履约画像', icon: '◎' },
  ]},
  { title: '决策 / AI', items: [
    { id: 'reports',           href: 'reports.html',            label: '报表 / AI 助理', icon: '☆' },
    { id: 'alert-rules',       href: 'alert-rules.html',        label: '预警规则配置', icon: '!' },
    { id: 'split-detection',   href: 'split-detection.html',    label: '化整为零检测 ★二期', icon: '⚯' },
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
      <div>辽宁能源 · 阜矿物资供应管理系统 <span class="sub">原型 v0.15</span></div>
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
  f.innerHTML = `SupplyCore 原型 v0.15 · 演示数据，不作为开发或验收依据 · ${SC.docVer}`;
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
  // 引擎层若已加载 → 用 SC.roles.badgeCounts 动态更新 sidebar 徽标（v0.14）
  setTimeout(SC.updateBadges, 200);
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

/* ─── 动态徽标更新（v0.14：引擎层加载后调用） ─── */
SC.updateBadges = function () {
  if (!window.SC || !SC.roles || !SC.store) return; // 引擎未加载，保持静态
  try {
    const counts = SC.roles.badgeCounts();
    // 审批中心徽标 → counts.todo
    const approvalLink = document.querySelector('.nav-item[href="approval-center.html"]');
    if (approvalLink) {
      let badge = approvalLink.querySelector('.badge');
      if (counts.todo > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'badge';
          approvalLink.appendChild(badge);
        }
        badge.textContent = counts.todo;
      } else if (badge) {
        badge.remove();
      }
    }
    // 预警规则徽标 → counts.alert
    const alertLink = document.querySelector('.nav-item[href="alert-rules.html"]');
    if (alertLink) {
      let badge = alertLink.querySelector('.badge');
      if (counts.alert > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'badge';
          badge.style.background = 'var(--red)';
          alertLink.appendChild(badge);
        }
        badge.textContent = counts.alert;
      } else if (badge) {
        badge.remove();
      }
    }
  } catch (e) { console.warn('[chrome] updateBadges error', e); }
};

/* ─── 工具：渲染状态徽章 ─── */
SC.badge = function (label, color, dot) {
  return `<span class="badge ${color || 'gray'} ${dot ? 'dot' : ''}">${label}</span>`;
};
SC.fmtMoney = function (n) {
  return '¥ ' + Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
SC.fmtNum = function (n) { return Number(n).toLocaleString('zh-CN'); };

/* ─── 档 A 二期 · B1 时间穿越 widget（右下角浮动） ─── */
SC.renderTimeWidget = function () {
  if (!SC.time) return; // time.js 未加载则不渲染
  if (document.getElementById('sc-time-widget')) return;

  const w = document.createElement('div');
  w.id = 'sc-time-widget';
  w.style.cssText = [
    'position:fixed', 'bottom:16px', 'right:16px', 'z-index:9999',
    'background:#fff', 'border:1px solid #d9d9d9', 'border-radius:8px',
    'box-shadow:0 4px 12px rgba(0,0,0,0.12)',
    'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif',
    'font-size:12px', 'min-width:200px', 'overflow:hidden'
  ].join(';');

  function render() {
    const mocked = SC.time.isMocked();
    const headerBg = mocked ? '#fff7e6' : '#f5f5f5';
    const headerColor = mocked ? '#d48806' : '#666';
    const expanded = w.dataset.expanded === '1';
    w.innerHTML = `
      <div id="sc-tw-header" style="padding:8px 10px;background:${headerBg};color:${headerColor};cursor:pointer;display:flex;justify-content:space-between;align-items:center;border-bottom:${expanded?'1px solid #f0f0f0':'none'}">
        <span><b>${SC.time.label()}</b></span>
        <span style="font-size:10px;opacity:0.6">${expanded ? '▼' : '▲'}</span>
      </div>
      ${expanded ? `
      <div style="padding:10px;display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;gap:4px;align-items:center">
          <input id="sc-tw-date" type="datetime-local" style="flex:1;padding:4px;border:1px solid #d9d9d9;border-radius:4px;font-size:11px">
          <button id="sc-tw-set" style="padding:4px 8px;border:1px solid #1677ff;background:#1677ff;color:#fff;border-radius:4px;cursor:pointer;font-size:11px">设</button>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          <button class="sc-tw-adv" data-d="1" style="flex:1;padding:4px;border:1px solid #d9d9d9;background:#fff;border-radius:4px;cursor:pointer;font-size:11px">+1天</button>
          <button class="sc-tw-adv" data-d="7" style="flex:1;padding:4px;border:1px solid #d9d9d9;background:#fff;border-radius:4px;cursor:pointer;font-size:11px">+7天</button>
          <button class="sc-tw-adv" data-d="30" style="flex:1;padding:4px;border:1px solid #d9d9d9;background:#fff;border-radius:4px;cursor:pointer;font-size:11px">+30天</button>
          <button class="sc-tw-adv" data-d="90" style="flex:1;padding:4px;border:1px solid #d9d9d9;background:#fff;border-radius:4px;cursor:pointer;font-size:11px">+90天</button>
        </div>
        <button id="sc-tw-reset" style="padding:5px;border:1px solid #ff7875;background:#fff;color:#cf1322;border-radius:4px;cursor:pointer;font-size:11px">重置（回真实时间）</button>
        <div style="font-size:10px;color:#999;line-height:1.4">提示：mock 时间用于演示"暂估超期 / 合同到期 / 应急补办"等多日才出现的场景；切换后页面需刷新查看效果</div>
      </div>` : ''}
    `;

    // 绑定事件
    document.getElementById('sc-tw-header').onclick = function () {
      w.dataset.expanded = expanded ? '0' : '1';
      render();
    };
    if (expanded) {
      const inp = document.getElementById('sc-tw-date');
      const cur = SC.time.now();
      inp.value = cur.getFullYear() + '-' +
        String(cur.getMonth() + 1).padStart(2, '0') + '-' +
        String(cur.getDate()).padStart(2, '0') + 'T' +
        String(cur.getHours()).padStart(2, '0') + ':' +
        String(cur.getMinutes()).padStart(2, '0');
      document.getElementById('sc-tw-set').onclick = function () {
        if (inp.value) {
          SC.time.setMock(new Date(inp.value));
          render();
        }
      };
      Array.from(document.getElementsByClassName('sc-tw-adv')).forEach(function (b) {
        b.onclick = function () {
          SC.time.advance(parseInt(b.dataset.d, 10));
          render();
        };
      });
      document.getElementById('sc-tw-reset').onclick = function () {
        if (confirm('确认回到真实时间？mock 时间会被清除。')) {
          SC.time.clearMock();
          render();
        }
      };
    }
  }

  render();
  document.body.appendChild(w);

  // 跨页同步
  SC.time.subscribe(render);
};

// 自动注入(DOMContentLoaded 后)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () { SC.renderTimeWidget(); });
} else {
  SC.renderTimeWidget();
}
