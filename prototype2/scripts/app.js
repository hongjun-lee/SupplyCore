const menuGroups = [
  {
    title: "工作台",
    icon: "台",
    items: [{ id: "dashboard", title: "综合工作台" }]
  },
  {
    title: "基础档案",
    icon: "基",
    items: [
      { id: "warehouse", title: "仓库管理" },
      { id: "location", title: "库区货位" },
      { id: "unit", title: "计量单位" },
      { id: "cost-center", title: "成本中心" }
    ]
  },
  {
    title: "物料主数据",
    icon: "物",
    items: [
      { id: "material", title: "物料档案" },
      { id: "material-request", title: "物料申请单" },
      { id: "category", title: "分类编码" },
      { id: "batch-rule", title: "批次规则" }
    ]
  },
  {
    title: "需求计划",
    icon: "需",
    items: [
      { id: "demand-plan", title: "需求计划单" },
      { id: "purchase-request", title: "采购申请" },
      { id: "plan-summary", title: "计划汇总" }
    ]
  },
  {
    title: "采购协同",
    icon: "采",
    items: [
      { id: "purchase-order", title: "采购订单" },
      { id: "arrival-notice", title: "到货通知" },
      { id: "purchase-progress", title: "采购进度" }
    ]
  },
  {
    title: "合同资金",
    icon: "合",
    items: [
      { id: "contract", title: "合同台账" },
      { id: "payment-plan", title: "付款计划" },
      { id: "fund-execution", title: "资金执行" }
    ]
  },
  {
    title: "库存流转",
    icon: "库",
    items: [
      { id: "purchase-receipt", title: "采购入库单" },
      { id: "requisition-issue", title: "领料出库单" },
      { id: "inventory-ledger", title: "库存台账" },
      { id: "transfer", title: "调拨单" },
      { id: "stocktaking", title: "盘点单" }
    ]
  },
  {
    title: "设备租赁",
    icon: "设",
    items: [
      { id: "equipment-ledger", title: "设备台账" },
      { id: "equipment-lease", title: "租赁单" },
      { id: "lease-fee", title: "费用汇总" }
    ]
  },
  {
    title: "财务接口",
    icon: "财",
    items: [
      { id: "interface-monitor", title: "NC 接口任务" },
      { id: "reconciliation", title: "对账差异" },
      { id: "month-close", title: "月结封账" }
    ]
  },
  {
    title: "报表预警",
    icon: "报",
    items: [
      { id: "alert-center", title: "预警中心" },
      { id: "inventory-report", title: "库存报表" },
      { id: "purchase-report", title: "采购报表" }
    ]
  },
  {
    title: "权限审批",
    icon: "审",
    items: [
      { id: "approval-tasks", title: "我的待办" },
      { id: "approval-records", title: "审批记录" },
      { id: "audit-log", title: "操作审计" }
    ]
  }
];

const pageTitles = Object.fromEntries(menuGroups.flatMap(group => group.items.map(item => [item.id, item.title])));

const statusClass = {
  "草稿": "draft",
  "待审核": "pending",
  "审中": "running",
  "已批准": "approved",
  "已驳回": "rejected",
  "已撤回": "neutral",
  "启用": "success",
  "停用": "neutral",
  "冻结": "purple",
  "待推送": "pending",
  "推送中": "running",
  "推送成功": "success",
  "推送失败": "failed",
  "已关闭": "neutral",
  "正常": "success",
  "临期": "warning",
  "异常": "danger",
  "待处理": "pending",
  "已完成": "success"
};

const datasets = {
  warehouse: [
    ["WH-FK-001", "中央材料库", "阜矿集团", "启用", "综合仓库", "1820", "2026-05-02"],
    ["WH-FK-002", "机电备件库", "恒大煤矿", "启用", "备件仓库", "634", "2026-05-01"],
    ["WH-FK-003", "安全物资库", "五龙煤矿", "冻结", "专用仓库", "218", "2026-04-29"],
    ["WH-FK-004", "废旧物资库", "阜矿集团", "启用", "废旧仓库", "96", "2026-04-28"]
  ],
  material: [
    ["MAT-HG-000231", "高压胶管", "HG-25-4SP", "启用", "根", "机电材料", "2026-05-02"],
    ["MAT-HX-000088", "矿用阻燃输送带", "ST/S 1600", "启用", "米", "安全材料", "2026-05-01"],
    ["MAT-YB-000312", "电磁阀", "DFB-20/10", "待审核", "件", "通用备件", "2026-04-30"],
    ["MAT-GJ-000127", "锚杆", "MG500", "启用", "套", "支护材料", "2026-04-27"]
  ],
  contract: [
    ["CT-2026-05001", "高压胶管年度采购合同", "辽宁恒源物资", "已批准", "1,260,000.00", "执行中", "2026-05-02"],
    ["CT-2026-05002", "机电备件框架协议", "沈阳矿机配套", "审中", "860,000.00", "待会签", "2026-05-01"],
    ["CT-2026-04288", "安全物资补充采购", "抚顺安防设备", "已批准", "420,500.00", "执行中", "2026-04-29"]
  ],
  inventory: [
    ["MAT-HG-000231", "高压胶管", "中央材料库", "有效", "根", "268", "32", "2026-05-02"],
    ["MAT-HX-000088", "矿用阻燃输送带", "安全物资库", "临期", "米", "680", "120", "2026-05-02"],
    ["MAT-YB-000312", "电磁阀", "机电备件库", "有效", "件", "94", "10", "2026-05-01"],
    ["MAT-GJ-000127", "锚杆", "中央材料库", "冻结", "套", "1200", "0", "2026-04-30"]
  ],
  interfaces: [
    ["IF-20260502-0018", "采购入库推送 NC", "BIZ_PURCHASE_RECEIPT", "推送失败", "PR-2026-05018", "科目映射缺失", "2026-05-02 15:32"],
    ["IF-20260502-0017", "合同付款推送 NC", "BIZ_CONTRACT_PAYMENT", "推送成功", "PAY-2026-05006", "已返回凭证号", "2026-05-02 14:18"],
    ["IF-20260502-0016", "物料主数据同步", "MD_MATERIAL", "推送中", "MAT-HG-000231", "等待回执", "2026-05-02 13:44"],
    ["IF-20260501-0099", "领料出库推送 NC", "BIZ_REQUISITION_ISSUE", "待推送", "OUT-2026-05012", "队列等待", "2026-05-01 18:11"]
  ],
  approvals: [
    ["AP-20260502-003", "物料申请单", "MR-2026-05008", "待审核", "机电科负责人", "新增电磁阀物料", "2026-05-02"],
    ["AP-20260502-002", "采购订单", "PO-2026-05012", "审中", "供应部部长", "高压胶管采购", "2026-05-02"],
    ["AP-20260501-018", "设备租赁单", "EL-2026-05003", "待审核", "设备管理部", "掘进机租赁续租", "2026-05-01"],
    ["AP-20260501-011", "合同台账", "CT-2026-05002", "审中", "财务会签", "机电备件框架协议", "2026-05-01"]
  ],
  alerts: [
    ["AL-20260502-012", "库存临期", "矿用阻燃输送带 120 米即将临期", "待处理", "高", "安全物资库", "2026-05-02"],
    ["AL-20260502-011", "接口异常", "采购入库推送 NC 失败", "待处理", "高", "NC 接口", "2026-05-02"],
    ["AL-20260501-022", "低库存", "电磁阀低于安全库存", "待处理", "中", "机电备件库", "2026-05-01"],
    ["AL-20260430-017", "审批超时", "设备租赁单超过 24 小时未处理", "已完成", "中", "审批流", "2026-04-30"]
  ]
};

const docTemplates = {
  "material-request": {
    type: "物料申请单",
    no: "MR-2026-05008",
    title: "新增电磁阀物料申请",
    status: "待审核",
    fields: [
      ["申请组织", "恒大煤矿 / 机电科"],
      ["申请人", "王立军"],
      ["申请类型", "新建物料"],
      ["业务分类", "通用备件"],
      ["是否关键变更", "否"],
      ["期望启用日期", "2026-05-08"],
      ["NC 映射状态", "待映射"],
      ["备注", "用于井下排水设备检修备件"]
    ],
    lines: [
      ["1", "电磁阀", "DFB-20/10", "件", "通用备件", "待查重"],
      ["2", "阀体密封圈", "DFB-MFQ", "套", "通用备件", "待查重"]
    ]
  },
  "demand-plan": {
    type: "需求计划单",
    no: "DP-2026-05016",
    title: "恒大煤矿 5 月机电材料需求计划",
    status: "审中",
    fields: [
      ["需求组织", "恒大煤矿"],
      ["提报部门", "机电科"],
      ["计划月份", "2026-05"],
      ["需求类型", "月度计划"],
      ["预算口径", "生产维修"],
      ["当前环节", "矿级审核"],
      ["计划金额", "328,600.00"],
      ["备注", "优先保障主运输系统检修"]
    ],
    lines: [
      ["1", "高压胶管", "HG-25-4SP", "根", "120", "中央材料库"],
      ["2", "电磁阀", "DFB-20/10", "件", "24", "机电备件库"],
      ["3", "锚杆", "MG500", "套", "600", "中央材料库"]
    ]
  },
  "purchase-order": {
    type: "采购订单",
    no: "PO-2026-05012",
    title: "高压胶管采购订单",
    status: "审中",
    fields: [
      ["采购组织", "阜矿集团供应部"],
      ["供应商", "辽宁恒源物资"],
      ["来源单据", "DP-2026-05016"],
      ["订单金额", "186,000.00"],
      ["交货日期", "2026-05-18"],
      ["交货仓库", "中央材料库"],
      ["当前环节", "供应部部长审核"],
      ["合同关联", "CT-2026-05001"]
    ],
    lines: [
      ["1", "高压胶管", "HG-25-4SP", "根", "120", "1,550.00"],
      ["2", "胶管接头", "KJ-25", "套", "240", "38.00"]
    ]
  },
  "purchase-receipt": {
    type: "采购入库单",
    no: "PR-2026-05018",
    title: "高压胶管采购入库",
    status: "待推送",
    fields: [
      ["入库组织", "阜矿集团"],
      ["入库仓库", "中央材料库"],
      ["来源订单", "PO-2026-05012"],
      ["验收单号", "GR-2026-05021"],
      ["入库日期", "2026-05-02"],
      ["接口状态", "待推送"],
      ["经办人", "赵强"],
      ["备注", "首批到货入库"]
    ],
    lines: [
      ["1", "高压胶管", "HG-25-4SP", "根", "80", "B2026050201"],
      ["2", "胶管接头", "KJ-25", "套", "160", "B2026050202"]
    ]
  },
  "requisition-issue": {
    type: "领料出库单",
    no: "OUT-2026-05012",
    title: "恒大煤矿机电科领料出库",
    status: "待审核",
    fields: [
      ["领用组织", "恒大煤矿"],
      ["领用部门", "机电科"],
      ["出库仓库", "机电备件库"],
      ["领料类型", "生产维修"],
      ["申请人", "王立军"],
      ["出库日期", "2026-05-03"],
      ["库存校验", "通过"],
      ["备注", "主运输系统抢修备件"]
    ],
    lines: [
      ["1", "电磁阀", "DFB-20/10", "件", "6", "B2026042107"],
      ["2", "阀体密封圈", "DFB-MFQ", "套", "12", "B2026041803"]
    ]
  },
  "equipment-lease": {
    type: "设备租赁单",
    no: "EL-2026-05003",
    title: "掘进机租赁续租申请",
    status: "待审核",
    fields: [
      ["承租组织", "五龙煤矿"],
      ["设备名称", "掘进机"],
      ["设备编号", "EQ-JJ-2024-006"],
      ["租赁方式", "内部调剂"],
      ["起租日期", "2026-05-10"],
      ["预计停租", "2026-08-10"],
      ["费用规则", "按月汇总"],
      ["当前环节", "设备管理部审核"]
    ],
    lines: [
      ["1", "掘进机", "EBZ-160", "台", "1", "井下二采区"],
      ["2", "随机备件包", "EBZ-PACK", "套", "1", "随设备交接"]
    ]
  }
};

function statusTag(status) {
  return `<span class="tag ${statusClass[status] || "neutral"}">${status}</span>`;
}

function renderNav() {
  const nav = document.getElementById("navTree");
  nav.innerHTML = menuGroups.map(group => `
    <div class="nav-group">
      <div class="nav-group-title"><span class="nav-icon">${group.icon}</span>${group.title}</div>
      <div class="nav-items">
        ${group.items.map(item => `<button class="nav-item" data-page="${item.id}">${item.title}</button>`).join("")}
      </div>
    </div>
  `).join("");

  nav.addEventListener("click", event => {
    const button = event.target.closest(".nav-item");
    if (!button) return;
    navigate(button.dataset.page);
  });
}

function setActive(pageId) {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.page === pageId);
  });
  document.getElementById("pageTitle").textContent = pageTitles[pageId] || "综合工作台";
}

function navigate(pageId) {
  setActive(pageId);
  const host = document.getElementById("pageHost");
  if (pageId === "dashboard") host.innerHTML = dashboardPage();
  else if (pageId === "warehouse") host.innerHTML = listPage("仓库管理", "基础档案", ["仓库编码", "仓库名称", "所属组织", "状态", "仓库类型", "库存品种", "更新时间"], datasets.warehouse);
  else if (pageId === "material") host.innerHTML = listPage("物料档案", "物料主数据", ["物料编码", "物料名称", "规格型号", "状态", "单位", "分类", "更新时间"], datasets.material);
  else if (pageId === "contract") host.innerHTML = listPage("合同台账", "合同资金", ["合同编号", "合同名称", "供应商", "状态", "金额", "执行状态", "更新时间"], datasets.contract);
  else if (pageId === "inventory-ledger") host.innerHTML = listPage("库存台账", "库存流转", ["物料编码", "物料名称", "仓库", "批次状态", "单位", "可用量", "冻结量", "更新时间"], datasets.inventory);
  else if (pageId === "interface-monitor") host.innerHTML = monitorPage();
  else if (pageId === "alert-center") host.innerHTML = listPage("预警中心", "报表预警", ["预警编号", "预警类型", "预警内容", "状态", "级别", "来源", "触发日期"], datasets.alerts);
  else if (pageId === "approval-tasks") host.innerHTML = approvalPage();
  else if (docTemplates[pageId]) host.innerHTML = documentPage(docTemplates[pageId]);
  else host.innerHTML = placeholderPage(pageTitles[pageId] || "功能页面");
}

function summaryCards(cards) {
  return `<section class="summary-grid">${cards.map(card => `
    <div class="summary-card">
      <div class="label">${card.label}</div>
      <div class="value">${card.value}</div>
      <div class="meta">${card.meta}</div>
    </div>
  `).join("")}</section>`;
}

function dashboardPage() {
  return `
    ${summaryCards([
      { label: "我的待办", value: "18", meta: "较昨日 +4" },
      { label: "接口异常", value: "6", meta: "NC 推送失败 3 项" },
      { label: "待入库物资", value: "42", meta: "今日预计到货 12 批" },
      { label: "库存预警", value: "15", meta: "临期 4 / 低库存 11" }
    ])}
    <section class="page-grid">
      <div class="panel">
        <div class="panel-head">
          <h2>今日待办</h2>
          <button class="link-button" data-page-link="approval-tasks">查看全部</button>
        </div>
        ${simpleTable(["类型", "单号", "事项", "状态", "到达时间"], [
          ["物料申请", "MR-2026-05008", "新增电磁阀物料", statusTag("待审核"), "09:32"],
          ["采购订单", "PO-2026-05012", "高压胶管采购", statusTag("审中"), "10:18"],
          ["设备租赁", "EL-2026-05003", "掘进机续租", statusTag("待审核"), "11:05"],
          ["接口异常", "IF-20260502-0018", "采购入库推送失败", statusTag("异常"), "15:32"]
        ])}
      </div>
      <div class="panel">
        <div class="panel-head"><h2>库存态势</h2><span class="muted">近 7 日</span></div>
        <div class="mini-chart" aria-label="库存态势图">
          ${[42, 58, 50, 64, 73, 68, 82, 76].map(v => `<div class="bar" style="height:${v}%"></div>`).join("")}
        </div>
        <div class="metric-strip" style="margin-top:12px">
          <div class="info-box"><div class="label">可用库存</div><div class="value">12,860</div></div>
          <div class="info-box"><div class="label">冻结库存</div><div class="value">416</div></div>
          <div class="info-box"><div class="label">临期批次</div><div class="value">4</div></div>
        </div>
      </div>
    </section>
    <section class="panel">
      <div class="panel-head">
        <h2>快捷入口</h2>
        <span class="muted">常用单据</span>
      </div>
      <div class="button-row">
        <button class="secondary-button" data-page-link="material-request">物料申请</button>
        <button class="secondary-button" data-page-link="demand-plan">需求计划</button>
        <button class="secondary-button" data-page-link="purchase-order">采购订单</button>
        <button class="secondary-button" data-page-link="purchase-receipt">采购入库</button>
        <button class="secondary-button" data-page-link="interface-monitor">接口监控</button>
      </div>
    </section>
  `;
}

function listPage(title, moduleName, headers, rows) {
  return `
    <section class="toolbar">
      <div class="toolbar-grid">
        <div class="field"><label>关键词</label><input class="input" value="" placeholder="编号 / 名称 / 供应商"></div>
        <div class="field"><label>组织</label><select class="select"><option>阜矿集团</option><option>恒大煤矿</option><option>五龙煤矿</option></select></div>
        <div class="field"><label>状态</label><select class="select"><option>全部状态</option><option>待审核</option><option>已批准</option><option>异常</option></select></div>
        <div class="field"><label>日期</label><input class="input" value="2026-05-01 至 2026-05-03"></div>
        <div class="button-row"><button class="primary-button">查询</button><button class="ghost-button">重置</button></div>
      </div>
    </section>
    ${summaryCards([
      { label: `${moduleName}总数`, value: rows.length * 16 + 8, meta: "mock 数据统计" },
      { label: "待审核", value: "7", meta: "需要业务处理" },
      { label: "异常/冻结", value: "3", meta: "需重点关注" },
      { label: "今日新增", value: "5", meta: "较昨日 +2" }
    ])}
    <section class="table-card">
      <div class="table-head" style="padding:14px 14px 0">
        <h2>${title}</h2>
        <div class="button-row">
          <button class="primary-button">新增</button>
          <button class="ghost-button">导入</button>
          <button class="ghost-button">导出</button>
        </div>
      </div>
      ${dataTable(headers, rows)}
    </section>
  `;
}

function monitorPage() {
  return `
    ${summaryCards([
      { label: "待推送", value: "12", meta: "等待任务调度" },
      { label: "推送中", value: "3", meta: "等待 NC 回执" },
      { label: "推送成功", value: "86", meta: "今日完成" },
      { label: "推送失败", value: "6", meta: "需处理" }
    ])}
    <section class="page-grid">
      <div class="table-card">
        <div class="table-head" style="padding:14px 14px 0">
          <h2>NC 接口任务</h2>
          <div class="button-row"><button class="primary-button">批量重推</button><button class="ghost-button">关闭任务</button></div>
        </div>
        ${dataTable(["任务编号", "任务名称", "接口编码", "状态", "业务单据", "处理摘要", "时间"], datasets.interfaces)}
      </div>
      <div class="panel">
        <div class="panel-head"><h2>任务链路</h2><span class="tag failed">推送失败</span></div>
        <div class="timeline">
          ${timelineItem("业务单据已审核", "采购入库单 PR-2026-05018 进入待推送状态", "done")}
          ${timelineItem("生成接口任务", "幂等键 BIZ_PURCHASE_RECEIPT:PR-2026-05018", "done")}
          ${timelineItem("调用 NC 接口", "科目映射缺失，NC 返回业务错误", "warn")}
          ${timelineItem("等待人工处理", "补齐 F-12 科目规则后允许重推", "")}
        </div>
      </div>
    </section>
  `;
}

function approvalPage() {
  return `
    ${summaryCards([
      { label: "待我审批", value: "18", meta: "含超时 2 项" },
      { label: "审中单据", value: "46", meta: "跨部门会签 8 项" },
      { label: "今日完成", value: "23", meta: "平均处理 2.6 小时" },
      { label: "退回/驳回", value: "4", meta: "需发起人修正" }
    ])}
    <section class="table-card">
      <div class="table-head" style="padding:14px 14px 0">
        <h2>我的待办</h2>
        <div class="button-row"><button class="primary-button">同意</button><button class="ghost-button">退回</button><button class="ghost-button">转办</button></div>
      </div>
      ${dataTable(["任务编号", "业务类型", "业务单号", "状态", "当前处理人", "摘要", "到达日期"], datasets.approvals)}
    </section>
  `;
}

function documentPage(doc) {
  return `
    <section class="document-shell">
      <div class="document-head">
        <div>
          <div class="page-kicker">${doc.type}</div>
          <h2 class="document-title">${doc.title}</h2>
          <div class="document-meta">
            <span class="tag info mono">${doc.no}</span>
            ${statusTag(doc.status)}
            <span class="tag neutral">静态演示</span>
          </div>
        </div>
        <div class="button-row">
          <button class="primary-button">提交审批</button>
          <button class="ghost-button">保存草稿</button>
          <button class="ghost-button">更多</button>
        </div>
      </div>
      <div class="document-body">
        <section>
          <div class="section-head"><h2>基本信息</h2><span class="muted">字段来源于详细设计分卷</span></div>
          <div class="form-grid">
            ${doc.fields.map(([label, value]) => `<div class="info-box"><div class="label">${label}</div><div class="value">${value}</div></div>`).join("")}
          </div>
        </section>
        <section>
          <div class="section-head">
            <h2>明细行</h2>
            <div class="button-row"><button class="secondary-button">新增行</button><button class="ghost-button">批量选择</button></div>
          </div>
          ${dataTable(["序号", "物料/设备", "规格型号", "单位", "数量", "仓库/说明"], doc.lines)}
        </section>
        <section class="page-grid">
          <div class="panel">
            <div class="panel-head"><h2>附件</h2><button class="ghost-button">上传</button></div>
            ${simpleTable(["文件名", "类型", "上传人", "时间"], [
              ["需求说明.pdf", "业务附件", "王立军", "2026-05-02 09:20"],
              ["现场照片.jpg", "图片", "王立军", "2026-05-02 09:22"]
            ])}
          </div>
          <div class="panel">
            <div class="panel-head"><h2>审批轨迹</h2><span class="tag running">当前环节</span></div>
            <div class="timeline">
              ${timelineItem("发起申请", "王立军 提交单据", "done")}
              ${timelineItem("部门审核", "机电科负责人 已同意", "done")}
              ${timelineItem("业务会签", "供应部 / 财务部处理中", "")}
            </div>
          </div>
        </section>
      </div>
    </section>
  `;
}

function placeholderPage(title) {
  return `
    <section class="empty-state">
      <h2>${title}</h2>
      <p>该页面已纳入菜单树，第一版先保留占位。后续可按列表页、单据页或配置页模板继续展开。</p>
    </section>
  `;
}

function dataTable(headers, rows) {
  return `
    <table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}<th>操作</th></tr></thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            ${row.map(cell => `<td>${formatCell(cell)}</td>`).join("")}
            <td><button class="link-button" data-drawer="${row[0]}">查看</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function simpleTable(headers, rows) {
  return `
    <table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  `;
}

function formatCell(cell) {
  if (statusClass[cell]) return statusTag(cell);
  if (String(cell).match(/^(WH|MAT|CT|IF|AP|AL|MR|DP|PO|PR|OUT|EL)-/)) return `<span class="mono">${cell}</span>`;
  return cell;
}

function timelineItem(title, desc, cls) {
  return `
    <div class="timeline-item ${cls}">
      <div class="timeline-dot"></div>
      <div><strong>${title}</strong><div class="muted">${desc}</div></div>
    </div>
  `;
}

function openDrawer(title) {
  const drawer = document.getElementById("drawer");
  document.getElementById("drawerTitle").textContent = title;
  document.getElementById("drawerBody").innerHTML = `
    <div class="timeline">
      ${timelineItem("单据摘要", "这里展示业务对象的关键字段、当前状态和关联单据。", "done")}
      ${timelineItem("接口/审批", "展示最近一次 NC 推送、审批节点或操作日志。", "")}
      ${timelineItem("下一步操作", "可在正式系统中放置重推、退回、补录、冻结等操作。", "warn")}
    </div>
  `;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function bindPageEvents() {
  document.body.addEventListener("click", event => {
    const link = event.target.closest("[data-page-link]");
    if (link) navigate(link.dataset.pageLink);

    const drawerButton = event.target.closest("[data-drawer]");
    if (drawerButton) openDrawer(drawerButton.dataset.drawer);
  });

  document.getElementById("drawerClose").addEventListener("click", () => {
    document.getElementById("drawer").classList.remove("open");
    document.getElementById("drawer").setAttribute("aria-hidden", "true");
  });

  document.getElementById("drawer").addEventListener("click", event => {
    if (event.target.id === "drawer") {
      event.currentTarget.classList.remove("open");
      event.currentTarget.setAttribute("aria-hidden", "true");
    }
  });
}

renderNav();
bindPageEvents();
navigate("dashboard");
