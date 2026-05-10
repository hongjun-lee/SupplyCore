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
    { id: 'purchase-receipt',  href: 'purchase-receipt.html',   label: '采购入库审核', icon: '☷' },
    { id: 'inventory',         href: 'inventory.html',          label: '库存查询', icon: '▦' },
    { id: 'inventory-flow',    href: 'inventory-flow.html',     label: '库存流转', icon: '↔' },
    { id: 'stocktake',         href: 'stocktake.html',          label: '盘点', icon: '⊞' },
    { id: 'scrap-disposal',    href: 'scrap-disposal.html',     label: '废旧处置', icon: '✗' },
    { id: 'equipment-rent',    href: 'equipment-rent.html',     label: '设备租赁', icon: '⚙' },
    { id: 'equipment-lifecycle', href: 'equipment-lifecycle.html', label: '设备生命周期', icon: '◑' },
    { id: 'maintenance-order', href: 'maintenance-order.html',  label: '设备维修工单', icon: '⚒' },
    { id: 'equipment-oee',     href: 'equipment-oee.html',      label: '设备 OEE 看板', icon: '◴' },
    { id: 'material-issuance', href: 'material-issuance.html',  label: '领料出库主线', icon: '↗' },
    { id: 'inventory-transfer', href: 'inventory-transfer.html', label: '库存调拨', icon: '⇄' },
    { id: 'outsourced-processing', href: 'outsourced-processing.html', label: '委托加工', icon: '⊕' },
    { id: 'mobile-stocktake',  href: 'mobile-stocktake.html',   label: '移动端盘点（演示）', icon: '▢' },
  ]},
  { title: '采购协同', items: [
    { id: 'purchase-planning', href: 'purchase-planning.html', label: '采购计划编排', icon: '☷' },
    { id: 'purchase-task-decomposition', href: 'purchase-task-decomposition.html', label: '采购任务分解', icon: '⇢' },
    { id: 'tender',            href: 'tender.html',             label: '招投标', icon: '◐' },
    { id: 'tender-archive',    href: 'tender-archive.html',     label: '招投标归档', icon: '▣' },
    { id: 'direct-delivery',   href: 'direct-delivery.html',    label: '直达使用', icon: '⇩' },
    { id: 'emergency-purchase', href: 'emergency-purchase.html', label: '应急采购', icon: '⚠' },
  ]},
  { title: '合同与资金', items: [
    { id: 'contract-list',     href: 'contract-list.html',      label: '合同管理', icon: '◇' },
    { id: 'contract-detail',   href: 'contract-detail.html',    label: '合同详情（演示）', icon: '◇' },
    { id: 'payment-request',   href: 'payment-request.html',    label: '付款申请', icon: '¥' },
    { id: 'funding-plan',      href: 'funding-plan.html',       label: '资金计划（月度）', icon: '☷' },
    { id: 'three-way-match',   href: 'three-way-match.html',    label: '三单匹配', icon: '☰' },
    { id: 'tentative-estimate', href: 'tentative-estimate.html', label: '暂估闭环', icon: '◌' },
    { id: 'council-meeting',   href: 'council-meeting.html',    label: '月度集体决议', icon: '⊕' },
    { id: 'payment-execution', href: 'payment-execution.html',  label: '付款执行台账', icon: '✓' },
  ]},
  { title: '基础数据', items: [
    { id: 'material-master',   href: 'material-master.html',    label: '物料主数据', icon: '◫' },
    { id: 'base-archive',      href: 'base-archive.html',       label: '基础档案', icon: '◯' },
    { id: 'supplier-performance', href: 'supplier-performance.html', label: '供应商履约画像', icon: '◎' },
    { id: 'master-data-admin', href: 'master-data-admin.html',  label: '主数据维护', icon: '▦' },
  ]},
  { title: '决策 / AI', items: [
    { id: 'reports',           href: 'reports.html',            label: '报表 / AI 助理', icon: '☆' },
    { id: 'report-detail',     href: 'report-detail.html',      label: '报表穿透（演示）', icon: '◐' },
    { id: 'alert-rules',       href: 'alert-rules.html',        label: '预警规则配置', icon: '!' },
    { id: 'split-detection',   href: 'split-detection.html',    label: '化整为零检测', icon: '⚯' },
    { id: 'demo-snapshot',     href: 'demo-snapshot.html',      label: '演示数据快照', icon: '▢' },
    { id: 'ai-assistant',      href: 'ai-assistant.html',       label: 'AI 助理', icon: '✺' },
    { id: 'ai-write-flow',     href: 'ai-write-flow.html',      label: 'AI 写操作（演示）', icon: '✎' },
    { id: 'dashboard-bigscreen', href: 'dashboard-bigscreen.html', label: '大屏看板（投屏）', icon: '⬜' },
  ]},
  { title: '运维 / 集成', items: [
    { id: 'nc-interface',      href: 'nc-interface.html',       label: 'NC 接口监控', icon: '⇆' },
    { id: 'nc-interface-detail', href: 'nc-interface-detail.html', label: '接口异常详情（演示）', icon: '⚠' },
    { id: 'reconciliation',    href: 'reconciliation.html',     label: '三对一致对账（月度）', icon: '↔' },
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
  SC.renderDemoFlow(opts);
  SC.bindRoleSwitch();
  SC.renderFooter();
  SC.mountEngineDock();
};

/* 底部引擎面板抽屉（v0.17 仿 DevTools dock）
 * 自动识别页内"📡 档 A 引擎接入"卡片（蓝/黄两色 inline style 标记）→ 移到底部固定 dock
 * 默认收起 36px 状态条，点击展开 45vh 可滚动 */
SC.mountEngineDock = function () {
  if (document.getElementById('engine-dock')) return;
  const all = document.querySelectorAll('#page-area .card');
  const panels = Array.from(all).filter(c => {
    const s = (c.getAttribute('style') || '').replace(/\s+/g, '').toLowerCase();
    return (s.includes('border-left:4pxsolidvar(--brand)') && s.includes('background:#f0f7ff')) ||
           (s.includes('border-left:4pxsolidvar(--amber)') && s.includes('background:#fffbf3'));
  });
  if (panels.length === 0) return;

  const dock = document.createElement('div');
  dock.id = 'engine-dock';
  dock.dataset.expanded = '0';
  dock.innerHTML = `
    <div class="engine-dock-bar" id="engine-dock-bar">
      <span class="engine-dock-icon">📡</span>
      <span class="engine-dock-title">档 A 引擎面板</span>
      <span class="engine-dock-count" id="engine-dock-count">${panels.length} 个</span>
      <span class="engine-dock-hint">演示工具 · 业务视图请收起</span>
      <span class="engine-dock-toggle" id="engine-dock-toggle">展开 ↑</span>
    </div>
    <div class="engine-dock-body" id="engine-dock-body"></div>
  `;
  document.body.appendChild(dock);

  const body = document.getElementById('engine-dock-body');
  panels.forEach(p => {
    // 移走引擎面板自身的 sticky-friendly inline 边框（保留 4px 左色条作为视觉分隔）
    body.appendChild(p);
  });

  const bar = document.getElementById('engine-dock-bar');
  const toggle = document.getElementById('engine-dock-toggle');
  bar.addEventListener('click', function () {
    const expanded = dock.dataset.expanded === '1';
    dock.dataset.expanded = expanded ? '0' : '1';
    toggle.textContent = expanded ? '展开 ↑' : '收起 ↓';
  });
};

/* 演示场景多套主线（v0.17 — 步骤条改场景切换器，业务方按演示主题切换）
 * 每场景一条短步骤条（≤ 8 步），不再单条塞所有业务 */
SC.demoScenarios = {
  'main-purchase': {
    label: '采购入库主线',
    desc: '需求 → 计划 → 任务 → 招采 → 合同 → 订单 → 到货 → 质检 → 入库 → 库存 → NC → 报表',
    steps: [
      { id: 'requirement-list', file: 'requirement-list.html', label: 'P-01 需求', desc: '基层提报与审批', aliases: ['requirement-detail.html'] },
      { id: 'purchase-planning', file: 'purchase-planning.html', label: 'P-02 计划', desc: '计划汇总 / P-03 聚合' },
      { id: 'purchase-task-decomposition', file: 'purchase-task-decomposition.html', label: 'P-05 任务', desc: '合并拆分与采购路径' },
      { id: 'tender', file: 'tender.html', label: 'T 招采', desc: '招标申请 / 标包 / 中标', aliases: ['tender-archive.html'] },
      { id: 'contract-detail', file: 'contract-detail.html', label: 'C 合同', desc: 'C-01 会签 + C-02 执行', aliases: ['contract-list.html'] },
      { id: 'purchase-orders', file: 'purchase-orders.html', label: 'S-02 订单', desc: '采购订单下达' },
      { id: 'goods-receipt', file: 'goods-receipt.html', label: 'S-03 到货', desc: '到货验收 + 质检开关' },
      { id: 'quality-check', file: 'quality-check.html', label: 'S-04 质检', desc: '三类验收串行 / 可跳过' },
      { id: 'purchase-receipt', file: 'purchase-receipt.html', label: 'S-05 入库', desc: '入库审核 + 库存原子事务' },
      { id: 'inventory', file: 'inventory.html', label: 'S-13 库存', desc: '余额 / 流水追溯' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'F-01 NC', desc: '接口推送 / 重推', aliases: ['nc-interface-detail.html'] },
      { id: 'reports', file: 'reports.html', label: 'R 报表', desc: '汇总收口', aliases: ['report-detail.html'] },
    ],
  },
  'payment-chain': {
    label: '付款全链路',
    desc: '合同 → 月度集体决议 → 付款申请 → 三单匹配 → 付款执行 → NC 实付',
    steps: [
      { id: 'contract-detail', file: 'contract-detail.html', label: 'C-02 合同', desc: '执行中合同', aliases: ['contract-list.html'] },
      { id: 'council-meeting', file: 'council-meeting.html', label: '月度集体决议', desc: 'WF-PAY-001 决议批准付款' },
      { id: 'payment-request', file: 'payment-request.html', label: 'C-08 付款申请', desc: '按节点发起付款' },
      { id: 'three-way-match', file: 'three-way-match.html', label: '三单匹配', desc: '合同 / 入库 / 发票' },
      { id: 'payment-execution', file: 'payment-execution.html', label: 'C-10 付款执行', desc: 'NC 实付回写 + 应付消减' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'NC 实付', desc: 'BIZ-013 推送' },
    ],
  },
  'tentative-loop': {
    label: '暂估闭环',
    desc: '入库时无票 → 暂估台账 → 6 月窗口预警 → 冲销 → NC',
    steps: [
      { id: 'goods-receipt', file: 'goods-receipt.html', label: 'S-03 到货', desc: '到货但发票未到' },
      { id: 'purchase-receipt', file: 'purchase-receipt.html', label: 'S-05 暂估入库', desc: '暂估批准生成 BIZ-002' },
      { id: 'tentative-estimate', file: 'tentative-estimate.html', label: '暂估台账', desc: '6 月窗口 / D-90/D-30/D-0/D+30' },
      { id: 'three-way-match', file: 'three-way-match.html', label: '三单匹配', desc: '发票到达后冲销 BIZ-003' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'NC 冲销', desc: 'BIZ-002 红冲 + BIZ-001 正式入账' },
    ],
  },
  'tender-fail': {
    label: '流标重走集体决策',
    desc: '招标流标 → ALR-PUR-002 → 重新走 P-02 集体决策（合规防火墙）',
    steps: [
      { id: 'tender', file: 'tender.html', label: 'T-03 流标', desc: '直录流标 + 原因' },
      { id: 'alert-rules', file: 'alert-rules.html', label: 'ALR-PUR-002', desc: '流标自动预警' },
      { id: 'purchase-planning', file: 'purchase-planning.html', label: 'P-02 重审', desc: '重新走集体决策（详设 04 §4.10.5）' },
      { id: 'tender', file: 'tender.html', label: 'T 重发标', desc: '重新发起招标' },
    ],
  },
  'nc-retry': {
    label: 'NC 失败 → 重推 → F-08',
    desc: '入库审核 → NC 推送失败 → 自动重推 ≤3 → F-08 异常台账（治理闭环）',
    steps: [
      { id: 'purchase-receipt', file: 'purchase-receipt.html', label: 'S-05:已审', desc: '触发 BIZ-001 推送' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'F-01 推送中', desc: 'mock 1-2 秒' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'F-01 失败', desc: '5% 失败率 + ALR-INT-001' },
      { id: 'nc-interface-detail', file: 'nc-interface-detail.html', label: 'F-08 异常', desc: '≥3 次重推升级 + 高敏感处置' },
    ],
  },
  'issuance': {
    label: '出库 / 成本归集',
    desc: '领用申请 → 库存核对 → 出库审核 → S-21 流水 → BIZ-005 NC 凭证',
    steps: [
      { id: 'material-issuance', file: 'material-issuance.html', label: '领料申请', desc: '成本中心归集' },
      { id: 'inventory-flow', file: 'inventory-flow.html', label: '出库审批', desc: '领料 / 退料 / 调拨' },
      { id: 'inventory', file: 'inventory.html', label: 'S-13 库存', desc: '余额变化 + 移动平均出库成本' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'NC 凭证', desc: 'BIZ-005 自用消耗' },
    ],
  },
  'split-detect': {
    label: '反规避检测',
    desc: '化整为零 / 指定供应商嫌疑检测（30 天累计）',
    steps: [
      { id: 'split-detection', file: 'split-detection.html', label: '检测看板', desc: 'ALR-PUR-SPLIT/DESIGNATE-001' },
      { id: 'purchase-planning', file: 'purchase-planning.html', label: 'P-02 关联', desc: '30 天累计申请' },
      { id: 'alert-rules', file: 'alert-rules.html', label: '预警闭环', desc: '处置留痕' },
    ],
  },
  'transfer': {
    label: '调拨主线',
    desc: '跨组织调拨 + 双向 S-21 流水 + BIZ-007 内部往来对冲',
    steps: [
      { id: 'inventory-transfer', file: 'inventory-transfer.html', label: 'S-11/S-12 调拨', desc: '申请 → 审批 → 执行' },
      { id: 'inventory', file: 'inventory.html', label: 'S-13 双向变化', desc: '调出方减 / 调入方增' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'BIZ-007 NC', desc: '内部往来对冲' },
    ],
  },
  'stocktake': {
    label: '盘点 → 盘盈盘亏',
    desc: 'S-15 盘点单 → S-17 差异调整 → BIZ-008 盘盈 / BIZ-009 盘亏',
    steps: [
      { id: 'stocktake', file: 'stocktake.html', label: 'S-15 盘点', desc: '账实对比' },
      { id: 'stocktake', file: 'stocktake.html', label: 'S-17 调整', desc: '盘盈 / 盘亏审批' },
      { id: 'inventory', file: 'inventory.html', label: 'S-13 修正', desc: '账实一致' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'BIZ-008/009', desc: 'NC 凭证' },
    ],
  },
  'supplier-reassess': {
    label: '供应商重评估',
    desc: '后评价差评累计 → 自动 emit WF-SUP-REASSESS-001 → 暂停接单',
    steps: [
      { id: 'supplier-performance', file: 'supplier-performance.html', label: 'M-13 后评价', desc: '差评录入 + 确认' },
      { id: 'alert-rules', file: 'alert-rules.html', label: 'ALR-SUP-REASSESS', desc: '累计 ≥3 差评触发' },
      { id: 'supplier-performance', file: 'supplier-performance.html', label: 'M-09 状态', desc: '合格 → 暂停 / 黑名单' },
    ],
  },
  'master-data': {
    label: '主数据维护',
    desc: 'M-02/M-05/M-09 增删改 + NC-MD-001/002/003 主数据下推',
    steps: [
      { id: 'master-data-admin', file: 'master-data-admin.html', label: '主数据维护', desc: '物料 / 供应商 / 仓库 CRUD' },
      { id: 'material-master', file: 'material-master.html', label: '物料展示', desc: 'M-05 一物一码' },
      { id: 'base-archive', file: 'base-archive.html', label: '基础档案', desc: 'M-01/M-02 组织 / 仓库' },
    ],
  },
  'scrap-disposal': {
    label: '废旧处置',
    desc: '4 类处置（报废 / 变卖 / 回收 / 销毁）+ BIZ-010/011/012',
    steps: [
      { id: 'scrap-disposal', file: 'scrap-disposal.html', label: 'S-19 处置', desc: '申请 → 审批 → 执行' },
      { id: 'inventory', file: 'inventory.html', label: 'S-13 减库存', desc: '出库流水' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'BIZ-010/011/012', desc: 'NC 凭证' },
    ],
  },
  'direct-delivery': {
    label: '直达使用单位',
    desc: '不进 S-13 库存，三方验收 + BIZ-005A 一次性销售凭证',
    steps: [
      { id: 'purchase-orders', file: 'purchase-orders.html', label: 'S-02 直达', desc: 'fulfillment_type=直达' },
      { id: 'direct-delivery', file: 'direct-delivery.html', label: 'S-23 签收挂账', desc: '三方验收 + 财务挂账' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'BIZ-005A', desc: '对厂矿销售凭证' },
    ],
  },
  'emergency': {
    label: '应急采购',
    desc: 'is_emergency 紧急通道 + 3 工作日补办 P-02 + 100% 准确率',
    steps: [
      { id: 'emergency-purchase', file: 'emergency-purchase.html', label: '应急 P-01', desc: '一键审批通过' },
      { id: 'requirement-list', file: 'requirement-list.html', label: 'P-01 全量', desc: '见紧急标记' },
      { id: 'alert-rules', file: 'alert-rules.html', label: 'ALR-PUR-EMERGENCY', desc: '补办期限提醒' },
    ],
  },
  'snapshot': {
    label: '演示快照 / 数据导入导出',
    desc: 'B2/B6 — 跨设备演示 + 多场景切换 + 培训重置 + 故障恢复',
    steps: [
      { id: 'demo-snapshot', file: 'demo-snapshot.html', label: '快照管理', desc: '保存 / 还原 / 导入导出' },
    ],
  },
  'equipment-rental': {
    label: '设备租赁',
    desc: 'A7 — E-08 在租 / 已结算 + BIZ-019 月度租赁费',
    steps: [
      { id: 'equipment-rent', file: 'equipment-rent.html', label: 'E-08 租赁', desc: '在租 → 月结 → 已结算' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'BIZ-019', desc: '租赁费凭证' },
    ],
  },
  'outsourced-processing': {
    label: '委托加工',
    desc: 'A9 — OP-01 投料 → 产出 → 入库 + 标准损耗率 + 三方联合验收',
    steps: [
      { id: 'outsourced-processing', file: 'outsourced-processing.html', label: 'OP-01 加工单', desc: '投料 → 产出 → 入库' },
      { id: 'inventory', file: 'inventory.html', label: 'S-13/S-21', desc: '原料出 + 产品入' },
      { id: 'nc-interface', file: 'nc-interface.html', label: 'BIZ-019', desc: '加工费凭证' },
    ],
  },
  'external-repair': {
    label: '外委检修',
    desc: 'A10 — E-04 检修单 + 40% 原值上限 + WF-CON-OVERLIMIT-001 加签',
    steps: [
      { id: 'maintenance-order', file: 'maintenance-order.html', label: 'E-04 检修', desc: '审批 + 阈值检查' },
      { id: 'alert-rules', file: 'alert-rules.html', label: 'ALR-CON-OVERLIMIT', desc: '超阈值预警' },
    ],
  },
  'reconciliation': {
    label: '三对一致对账',
    desc: 'B4 — 财务 + 系统 S-13 + 保管卡片 月度比对 + ALR-INV-RECON-001',
    steps: [
      { id: 'reconciliation', file: 'reconciliation.html', label: '对账演示', desc: '手工触发 + 历史归档' },
      { id: 'alert-rules', file: 'alert-rules.html', label: 'ALR-INV-RECON', desc: '不一致预警' },
    ],
  },
  'ai-tool': {
    label: 'AI Tool 调用',
    desc: 'B5 — AI 助理实时查询 SC.store + 自然语言响应',
    steps: [
      { id: 'ai-assistant', file: 'ai-assistant.html', label: 'AI 助理', desc: '查询库存 / 计划 / 预警' },
    ],
  },
};

SC.SCENARIO_KEY = 'sc.scenario';
SC.getScenario = function () {
  const id = localStorage.getItem(SC.SCENARIO_KEY) || 'main-purchase';
  return SC.demoScenarios[id] ? id : 'main-purchase';
};
SC.findScenarioContaining = function (file, currentPage) {
  for (const id of Object.keys(SC.demoScenarios)) {
    const steps = SC.demoScenarios[id].steps;
    const idx = steps.findIndex(s =>
      s.id === currentPage || s.file === file || (s.aliases || []).indexOf(file) >= 0
    );
    if (idx >= 0) return { id, idx };
  }
  return null;
};

SC.renderDemoFlow = function (opts) {
  const area = document.getElementById('page-area');
  if (!area || document.getElementById('demo-flow-nav')) return;
  const file = (location.pathname.split('/').pop() || 'index.html');
  const currentPage = opts && opts.page;

  let scenarioId = SC.getScenario();
  let scenario = SC.demoScenarios[scenarioId];
  let idx = scenario.steps.findIndex(s =>
    s.id === currentPage || s.file === file || (s.aliases || []).indexOf(file) >= 0
  );

  // 当前页面不在选中场景里 → 自动找包含该页的场景
  let notInScenario = false;
  if (idx < 0) {
    const found = SC.findScenarioContaining(file, currentPage);
    if (found) {
      scenarioId = found.id;
      scenario = SC.demoScenarios[scenarioId];
      idx = found.idx;
      notInScenario = (scenarioId !== SC.getScenario()); // 标记是自动切的
    } else {
      // 该页不属于任何场景 → 不显示步骤条
      return;
    }
  }

  const steps = scenario.steps;
  const cur = steps[idx];
  const prev = steps[idx - 1];
  const next = steps[idx + 1];

  const scenarioOpts = Object.keys(SC.demoScenarios).map(id => {
    const s = SC.demoScenarios[id];
    const sel = id === scenarioId ? ' selected' : '';
    return `<option value="${id}"${sel}>${s.label}（${s.steps.length} 步）</option>`;
  }).join('');

  const links = steps.map((s, i) => {
    const cls = ['demo-flow-step'];
    if (i < idx) cls.push('done');
    if (i === idx) cls.push('current');
    return `<a class="${cls.join(' ')}" href="${s.file}" title="${s.desc}">
      <span class="num">${i + 1}</span><span class="txt">${s.label}</span>
    </a>`;
  }).join('');

  const prevBtn = prev ? `<a class="btn btn-sm" href="${prev.file}" title="${prev.desc}">←</a>` : '';
  const nextBtn = next ? `<a class="btn btn-sm btn-primary" href="${next.file}" title="${next.desc}">→</a>` : '';
  const noticeHtml = notInScenario
    ? `<span class="demo-flow-notice" title="当前页不在原选场景中">已切到「${scenario.label}」</span>` : '';

  const html = `
    <div class="demo-flow-nav" id="demo-flow-nav" title="${scenario.desc} · 当前 ${idx + 1}/${steps.length}：${cur.label} · ${cur.desc}">
      <select class="demo-flow-scenario" id="demo-flow-scenario" title="切换演示场景">${scenarioOpts}</select>
      <span class="demo-flow-badge">${idx + 1}/${steps.length}</span>
      ${noticeHtml}
      <div class="demo-flow-steps">${links}</div>
      <div class="demo-flow-pager">${prevBtn}${nextBtn}</div>
    </div>`;

  const header = area.querySelector('.page-header');
  if (header) header.insertAdjacentHTML('afterend', html);
  else area.insertAdjacentHTML('afterbegin', html);

  const sel = document.getElementById('demo-flow-scenario');
  if (sel) {
    sel.addEventListener('change', e => {
      localStorage.setItem(SC.SCENARIO_KEY, e.target.value);
      const newScenario = SC.demoScenarios[e.target.value];
      // 跳到新场景的第一个 step
      if (newScenario && newScenario.steps.length > 0) {
        location.href = newScenario.steps[0].file;
      } else {
        location.reload();
      }
    });
  }
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
      <div>辽宁能源 · 阜矿物资供应管理系统 <span class="sub">原型 v0.16</span></div>
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
  f.innerHTML = `SupplyCore 原型 v0.16 · 演示数据，不作为开发或验收依据 · ${SC.docVer}`;
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
    w.querySelector('#sc-tw-header').onclick = function () {
      w.dataset.expanded = expanded ? '0' : '1';
      render();
    };
    if (expanded) {
      const inp = w.querySelector('#sc-tw-date');
      const cur = SC.time.now();
      inp.value = cur.getFullYear() + '-' +
        String(cur.getMonth() + 1).padStart(2, '0') + '-' +
        String(cur.getDate()).padStart(2, '0') + 'T' +
        String(cur.getHours()).padStart(2, '0') + ':' +
        String(cur.getMinutes()).padStart(2, '0');
      w.querySelector('#sc-tw-set').onclick = function () {
        if (inp.value) {
          SC.time.setMock(new Date(inp.value));
          render();
        }
      };
      Array.from(w.getElementsByClassName('sc-tw-adv')).forEach(function (b) {
        b.onclick = function () {
          SC.time.advance(parseInt(b.dataset.d, 10));
          render();
        };
      });
      w.querySelector('#sc-tw-reset').onclick = function () {
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
