# SupplyCores 34 页 mock/真实接口清单 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · 同事评审 5 步建议 — 步 5 / 34 React 页面接口状态盘点
**触发**：同事评审"先把 UI 从'做得多'收成'真能跑、能演示、能验收'" + cici 选 A 完成 P0-2 + 主代理 a 整理清单

---

## 一、34 entries 接口状态汇总

| # | 页面 | Sprint | 接口状态 | 真实端点 | 业务方 |
|---|---|---|---|---|---|
| **1** | home（NC 健康快照）| 19b | ✅ **真实**（InterfaceMonitor `/api/supply-cores/interface-monitor/nc-health`）| ✓ | - |
| **2** | nc-interface（NC 接口监控）| 19c | ✅ **真实**（InterfaceMonitor 4 endpoint）| ✓ | - |
| **3** | approval-center（审批中心）| 19c | 🟡 部分真实（ApprovalInstance ✓ / 21 模板真接通）| ✓ | - |
| **4** | inventory（库存查询）| 19c | 🟡 部分（StockBalance 真接通 / DataGrid 列表）| ✓ | 仓储 |
| **5** | purchase-orders（采购订单）| 19c | 🟡 部分（PurchaseOrder ✓ / 详情 mock）| ✓ | 财务 |
| **6** | material-master（物料主数据）| 19c | ✅ **真实**（Material CRUD 完整）| ✓ | - |
| **7** | reports（报表中心）| 19c | 🟡 部分（R-09 真接 / 大屏 mock）| ✓ | SQA |
| **8** | contract（合同管理）| 19d | 🟡 部分（Contract CRUD ✓ / 状态机 mock）| ✓ | 财务 |
| **9** | equipment-lifecycle（设备生命周期）| 19d | 🟡 部分（Equipment ✓ / 状态机 mock）| ✓ | 设备 |
| **10** | equipment-oee（设备 OEE）| 19d | ❌ **Mock**（OEE Controller 骨架 / equipment_oee_daily 视图缺失）| ✗ | 设备 |
| **11** | equipment-rent（设备租赁）| 19d | 🟡 部分（LeaseContract ✓ / 月结视图缺）| ✓ | 设备 |
| **12** | dashboard-bigscreen（综合监控大屏）| 19f | ❌ **Mock**（19j 骨架 + Mock SeedData）| ✗ | SQA / 财务 |
| **13** | quality-check（质检）| 19f | ❌ **Mock**（19j 骨架）| ✗ | 质保 |
| **14** | scrap-disposal（废旧处置）| 19f | ❌ **Mock**（19j 骨架）| ✗ | 设备 |
| **15** | mobile-stocktake（移动盘点）| 19f | ❌ **Mock**（19j 骨架）| ✗ | 仓储 |
| **16** | xinchuang-matrix（信创矩阵）| 19f | ❌ **Mock**（19j 骨架 / 静态招标承诺数据）| ✗ | SQA |
| **17** | purchase-planning（采购计划编排）| 19k | ❌ Mock（无 endpoint）| ✗ | 财务 |
| **18** | three-way-match（三单匹配）| 19k | ❌ Mock（F-01 财务核心）| ✗ | 财务 |
| **19** | supplier-performance（供应商履约画像）| 19k | ❌ Mock（M-13 / SQA）| ✗ | SQA |
| **20** | material-issuance（领料出库）| 19k | ❌ Mock（S-08/S-09 高敏感会签）| ✗ | 仓储 |
| **21** | funding-plan（资金计划）| 19k | ❌ Mock（C-04 / FCS）| ✗ | 财务 |
| **22** | tender（招标管理）| 19l | ❌ Mock（T-01~T-05）| ✗ | 财务 / 项目 |
| **23** | goods-receipt（到货验收）| 19l | ❌ Mock（S-02/S-03）| ✗ | 仓储 |
| **24** | payment-request（付款申请）| 19l | ❌ Mock（F-02）| ✗ | 财务 |
| **25** | stocktake（库存盘点）| 19l | ❌ Mock（S-06/S-07 桌面盘点）| ✗ | 仓储 |
| **26** | alert-rules（预警规则中心）| 19l | ❌ Mock（R-05）| ✗ | SQA |
| **27** | base-archive（基础档案）| 19m | ❌ Mock（详设 02 — 组织/仓库/货位）| ✗ | 全业务方 |
| **28** | master-data-admin（主数据管理）| 19m | ❌ Mock（详设 03 — 物料分类/编码/BOM）| ✗ | SQA |
| **29** | tender-archive（招标静态档案）| 19m | ❌ Mock（详设 04 §4.10）| ✗ | 财务 |
| **30** | requirement-list（需求计划列表）| 19n | ❌ Mock（P-01）| ✗ | 财务 |
| **31** | purchase-receipt（入库审核）| 19n | ❌ Mock（S-05 4 件事原子事务）| ✗ | 仓储 / 财务 |
| **32** | reconciliation（三对一致对账）| 19n | ❌ Mock（INV_RECON）| ✗ | 财务 |
| **33** | inventory-flow（流水图谱）| 19n | ❌ Mock（S-21 7 类型）| ✗ | 仓储 |
| **34** | maintenance-order（维修工单）| 19n | ❌ Mock（E-03/E-04 + 40% 阈值）| ✗ | 设备 |

---

## 二、汇总统计

### 2.1 按接口状态

| 状态 | 数量 | 占比 | 说明 |
|---|---|---|---|
| ✅ **真实端点接通**（≥ 80% endpoint 真实）| 2 | 6% | home / nc-interface / material-master（19b-19c 基础 3 页）|
| 🟡 **部分真实**（核心 CRUD ✓ / 业务流 mock）| 8 | 24% | approval-center / inventory / purchase-orders / contract / equipment-lifecycle / equipment-rent / reports |
| ❌ **完全 Mock**（19j 骨架 / 业务方未反馈）| 24 | 70% | 19f-19n 累计 24 页 mock 待业务方反馈 |

### 2.2 按 Sprint 来源

| Sprint | 页面数 | 真实/部分/Mock | 业务进展评估 |
|---|---|---|---|
| 19b-19c | 8 | 2 真实 + 5 部分 + 1 Mock | ★★★★★（基础已接通）|
| 19d | 3 | 0 + 2 部分 + 1 Mock | ★★★★☆（设备域核心）|
| 19f | 5 | 0 + 0 + 5 Mock | ★★☆☆☆（业务流 phase 2）|
| 19j 6 endpoint Controller 骨架 | 6 影响 | 已建 Mock SeedData | ⏳ 业务方反馈 |
| 19k | 5 | 0 + 0 + 5 Mock | ★☆☆☆☆（业务流核心）|
| 19l | 5 | 0 + 0 + 5 Mock | ★☆☆☆☆（业务流续）|
| 19m | 3 | 0 + 0 + 3 Mock | ★☆☆☆☆（基础资料）|
| 19n | 5 | 0 + 0 + 5 Mock | ★☆☆☆☆（业务流续）|

### 2.3 按业务方分类（mock → real 协调对象）

| 业务方 | 涉及页面 | 优先级建议 |
|---|---|---|
| **财务** | purchase-planning / three-way-match / funding-plan / payment-request / tender / contract / purchase-orders / requirement-list / reconciliation / purchase-receipt = **10 页** | 🔴 最高（F-01/F-02/T-01 等核心交易流）|
| **设备** | equipment-oee / equipment-lifecycle / equipment-rent / scrap-disposal / maintenance-order = **5 页** | 🟡 中（OEE 视图 + 月结视图待实施）|
| **仓储** | inventory / mobile-stocktake / material-issuance / goods-receipt / stocktake / purchase-receipt / inventory-flow = **7 页** | 🟡 中（S-* 系列 — S-05 4 件事原子事务核心）|
| **质保** | quality-check = **1 页** | 🟢 低 |
| **SQA** | supplier-performance / xinchuang-matrix / reports / dashboard-bigscreen / alert-rules / master-data-admin = **6 页** | 🟢 低（数据展示 / 配置类）|
| **全业务方** | base-archive = **1 页** | 🟢 低（cici 直接维护）|
| 项目 | tender = **1 页** | 🟡 中（招采流程）|

**关键观察**：**财务方 10 页 mock 待反馈** — 业务方协调最大缺口 / 续 Sprint cici 推动财务方反馈是 ROI 最高的协调

---

## 三、mock → real 改动范围分级（参考 19j V0.3 §六.4）

| Level | 改动范围 | 工作量 / 页面 |
|---|---|---|
| **L1 最优**（DTO 字段一致 / Mock 替 Repository）| AppService Mock return → \_repository.GetListAsync(...) | 0.3-0.5 PD |
| **L2 中等**（DTO 缺 1-3 字段 / 业务方反馈调整）| AppService + DTO + frontend binding 微调 | 0.5-1 PD |
| **L3 最坏**（DTO 字段重构 / spec 大差）| DTO 重构 + AppService 改 + frontend binding 改 + E2E 改 | 1-1.5 PD |

**19j 设计目标**：争取 L1（19j DTO 已按 19f-19n React mock 完整反推 + 110+ [⚠️ 业务方 spec 确认] 标记预留）

---

## 四、续 Sprint 推动优先级

### Phase 1（19o）：cici 与 PO 协调机制建立

- 财务方对接（10 页 mock — ROI 最高）
- 5 业务方对接人 + 反馈窗口 + 优先级
- 项目级正式协调会议替代 cici 单点

### Phase 2（19p-19q）：业务方反馈到位 → mock → real 主轨

按业务方反馈实际收到的 endpoint spec 实施 — 期望 L1 / L2 改动范围（每 Sprint 3-4 endpoint）

### Phase 3（19r+）：基础资料 DTO 字段补完 + E2E 全集成

- 业务方反馈基础资料字段 → 19m 3 原型 DTO 调整
- 38 tests in 20 files E2E 接通真 endpoint
- Full ABP OpenIddict + Identity UI 实施（解锁 cici 实际登录测试）

---

## 五、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 34 页接口状态盘点（2 真实 + 8 部分 + 24 Mock）+ 业务方分类（财务 10 页 ROI 最高）+ L1/L2/L3 改动范围分级 + 续 Sprint 3 Phase 推动优先级 |
