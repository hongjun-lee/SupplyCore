# 19q PO 协调 - 业务价值清单 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1（cici 与 PO 协调材料 1/5）
**日期：** 2026-05-15
**文档性质：** 实施层 · PO 协调材料 · 34 页 mock → real ROI 优先级
**配套：** [`UI-34Pages-Endpoint-Inventory-V0.1.md`](./UI-34Pages-Endpoint-Inventory-V0.1.md) + [`Sprint-19q-任务卡-V0.2.md`](./Sprint-19q-任务卡-V0.2.md)

---

## 一、TL;DR — cici 与 PO 沟通用 1 张表

> **现状**：SupplyCores 已完成 34 页 React 化 + ABP Identity 登录链路 + 22 业务流原型 mock 数据 — **70% UI 待真实接通（24 页）**

> **业务方协调 5 月失败**（17a-19i NC 9 次顺延 / 19j-19p 6 endpoint 5 Sprint 0 反馈）— **核心堵点**：业务方对接人未明确 / 反馈窗口未建立 / 无 deadline

> **19q 战略行动**：5 业务方对接人 + 反馈窗口 + deadline + 跟踪机制 → 19r+ 解锁 mock → real

> **ROI 最高**：**财务方 10 页**（F-01 三单匹配 / F-02 付款 / C-04 资金计划 / T-01-T-05 招标）— 阻塞月结 / 反结 / 三单匹配核心交易流

---

## 二、5 业务方 × 24 页 mock → 业务价值矩阵

按 ROI 排序（业务影响 × mock → real 工时 / 业务方反馈难度）：

### 🔴 财务方 10 页（最高 ROI / 优先协调）

| 页面 | 详设 | mock 影响业务流 | mock → real 工时 |
|---|---|---|---|
| **purchase-planning** | P-02/P-03 | 采购计划编排 — 阻塞 19q-19s 采购预算 | L2 0.5-1 PD |
| **three-way-match** | F-01 | **三单匹配核心** — 阻塞付款审核 + 月结 | L3 1-1.5 PD（强业务规则）|
| **funding-plan** | C-04 | 资金计划 — 阻塞月度现金流预测 | L2 0.5-1 PD |
| **payment-request** | F-02 | 付款申请 — 阻塞财务方放款流程 | L3 1-1.5 PD（form-heavy + timeline）|
| **tender** | T-01~T-05 | 招标管理 — 阻塞 5 类招标流程 | L2 0.5-1 PD 每页（共 ~3-4 PD）|
| **requirement-list** | P-01 | 需求计划 — 阻塞采购前置链 | L2 0.5-1 PD |
| **reconciliation** | INV_RECON | 三对一致对账 — 阻塞月度对账 | L2 0.5-1 PD |
| **purchase-receipt** | S-05 | 入库审核 4 件事原子事务 — 阻塞采购完成 | L3 1-1.5 PD（事务核心）|
| ~~purchase-orders~~ | P-04 | （已部分接通）| L1 0.3-0.5 PD（DTO 一致）|
| ~~contract~~ | C-01 | （已部分接通）| L1 0.3-0.5 PD（状态机 mock 真接通）|

**财务方累计**：~10-15 PD（10 页 mock → real）

**协调难度**：财务总监级别 1 个对接人（10 页域内）— 应是 PO 直接资源

### 🟡 设备方 5 页（中 ROI）

| 页面 | 详设 | mock 影响 | 工时 |
|---|---|---|---|
| **equipment-oee** | E-OEE-* | OEE Controller 骨架 / equipment_oee_daily 视图缺失 | L3 1.5 PD（视图实施）|
| **maintenance-order** | E-03/E-04 | 维修工单 40% 阈值规则 | L2 0.5-1 PD |
| **scrap-disposal** | E-SCRAP | 废旧处置 | L2 0.5-1 PD |
| ~~equipment-lifecycle~~ | E-01 | （已部分接通）| L1 状态机 mock 真接通 |
| ~~equipment-rent~~ | E-02 | （已部分接通）月结视图缺 | L2 月结视图 |

**设备方累计**：~3-4 PD

### 🟡 仓储方 7 页（中 ROI）

| 页面 | 详设 | mock 影响 | 工时 |
|---|---|---|---|
| **mobile-stocktake** | S-MOBILE | 移动盘点 PWA / 离线缓存 | L2 1 PD |
| **material-issuance** | S-08/S-09 | 领料出库高敏感会签 | L3 1.5 PD（会签流）|
| **goods-receipt** | S-02/S-03 | 到货验收 | L2 0.5-1 PD |
| **stocktake** | S-06/S-07 | 库存盘点（桌面）| L2 0.5-1 PD |
| **inventory-flow** | S-21 | 流水图谱 7 类型 | L3 1 PD |
| ~~inventory~~ | S-01 | （已部分接通）| L1 0.3-0.5 PD |
| ~~purchase-receipt~~ | S-05 | （财务方共有 / 4 件事原子事务）| L3 1-1.5 PD |

**仓储方累计**：~5-7 PD

### 🟢 SQA 方 6 页（低 ROI）

dashboard-bigscreen / supplier-performance / xinchuang-matrix / reports / alert-rules / master-data-admin — **大多展示类 / 配置类**

**SQA 方累计**：~3-4 PD（大多 L1+L2）

### 🟢 质保方 1 页 + 全业务方 1 页 + 项目方 1 页（低优先）

- quality-check（质保）— L2 0.5 PD
- base-archive（全业务方 / cici 可直接维护）— L1 0.3-0.5 PD
- tender（项目方 / 与财务共有）— 已计

---

## 三、mock → real 改动范围分级（详 19j V0.3 §六.4）

| Level | 工作量/页 | 触发条件 | 占比预期 |
|---|---|---|---|
| **L1** 最优 | 0.3-0.5 PD | DTO 字段一致 / Mock 替换 Repository | 30%（DTO 反推预留好的页）|
| **L2** 中等 | 0.5-1 PD | DTO 缺 1-3 字段 / 业务方反馈调整 | 50%（多数业务流）|
| **L3** 最坏 | 1-1.5 PD | DTO 重构 / 业务规则复杂（三单匹配 / 会签流 / 视图实施）| 20%（核心交易流 / 视图）|

**预期 24 页 mock → real 总工时**：
- 30% × 0.4 + 50% × 0.75 + 20% × 1.25 × 24 = **~17-20 PD**（如业务方反馈 DTO 大体一致）
- 最坏情况 60% L3 = **~30-35 PD**（DTO 重大重构）

---

## 四、阻塞业务流影响（cici 与 PO 风险沟通用）

### 🔴 月结业务流堵塞链

mock 状态 → 月结操作不可执行：
- F-01 三单匹配 mock → 付款审核手工 → 月结手工
- C-04 资金计划 mock → 月度现金流预测手工
- INV_RECON 对账 mock → 三对一致检查手工
- F-02 付款申请 mock → 财务放款流程手工

**累计**：4 核心流程在 mock 状态 = 财务部月结**全手工 / 实际 ROI 极高**

### 🟡 采购前置链堵塞

- P-01 需求计划 mock → 业务部门提单手工 Excel
- P-02/P-03 采购计划 mock → 采购员编排手工
- T-01~T-05 招标 mock → 招采流程半手工

**累计**：采购前置链 mock → SQA / 采购部仍依赖现有 ERP（NC）

### 🟢 仓储 / 设备域

部分接通 + 19f 19j 详设域 phase 2 phase 3 prototype 已建 — 主要欠真实数据 + 业务方反馈

---

## 五、cici 与 PO 1h 会议优先级建议

### 🥇 第 1 优先：财务方对接人锁定 + 反馈窗口（30 min）

- **业务价值**：10 页 mock → real 解锁月结 + 三单匹配核心
- **协调动作**：财务总监 / 主管 1 人 / 项目内任命 / 与 cici 1-on-1 反馈机制（每周 / 飞书 / 紧急 1d 内）
- **deadline**：≤ 1 周内财务方对接人正式接 + 第一个 endpoint（如 F-01 三单匹配）反馈到位

### 🥈 第 2 优先：设备方 + 仓储方对接人（20 min）

- **业务价值**：12 页 mock → real（设备 5 + 仓储 7）解锁现场作业
- **协调动作**：设备主管 1 + 仓储主管 1 / 每周邮件 / 紧急 2d 内
- **deadline**：≤ 2 周内对接人接 + 第一个 endpoint 反馈

### 🥉 第 3 优先：SQA + 质保 + 项目方（10 min）

- **业务价值**：8 页 mock → real（多数展示类）
- **协调动作**：SQA / 质保 / 项目部各 1 人
- **deadline**：≤ 3 周内对接人接

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 5 业务方 × 24 页 ROI 矩阵 + 财务方 10 页最高 + 阻塞月结 4 流程链 + 1h 会议 3 优先级（财务方 30 min / 设备+仓储 20 min / SQA+质保+项目 10 min）+ mock → real 预期 17-20 PD（DTO 大体一致）/ 最坏 30-35 PD |
