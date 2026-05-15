# Sprint 19g 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19g 起步草案
**配套：** [`Sprint-19f-Demo-脚本-V0.1.md`](./Sprint-19f-Demo-脚本-V0.1.md) §四 候选范围 + 19f 收尾 Codex 19f 评审顺延

---

## 一、Sprint 19g 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 UI-2-5 E2E：Playwright 集成 + 1-2 核心场景（19c-19f 4 次顺延 — 必修）

19c/19d/19e/19f 连续 4 次顺延 — 19g 必修（避免反模式深化）：

| Task | 范围 | 工时 |
|---|---|---|
| 19g-UI-2-5-1 | Playwright 安装 + 基础配置（playwright.config.ts + 浏览器准备）| 0.3 PD |
| 19g-UI-2-5-2 | E2E 场景 1：approval-center 完整链路（list → 详情 → approve / reject 状态机）| 0.5 PD |
| 19g-UI-2-5-3 | E2E 场景 2：nc-interface 监控（NcHealthSnapshot 4 endpoint 实测）| 0.4 PD |

**预算 UI-2-5**：1-1.5 PD

### 候选 6 backend endpoint [⚠️] 占位归属决策（19f UI-3 phase 2 顺延）

19f UI-3 phase 2 5 React 页面 + 19c reports/nc-interface backend 累计 6 [⚠️] 占位：

| 页面 | endpoint | 业务方 |
|---|---|---|
| dashboard-bigscreen | `GET /api/supply-cores/dashboard/bigscreen` | 大屏聚合（SQA 团队 / 财务部）|
| quality-check | `GET /quality-checks{,/{id}}` + `POST /{id}/judge` | S-04 质检（质保部）|
| scrap-disposal | `GET /scrap-disposals` + `POST /{id}/{approve|reject|execute}` | S-19 处置（设备部）|
| mobile-stocktake | `GET /stocktake-sheets{,/{id}}` + `POST /{id}/{scan|sync}` | S-15 盘点（仓储部）|
| xinchuang-matrix | `GET /xinchuang/matrix` | readonly 矩阵（SQA 团队维护建议）|
| equipment-oee | `GET /equipment-oee/dashboard` + `equipment_oee_daily 视图`（19d 顺延）| OEE Controller（设备部）|

**预算 6 endpoint 归属决策**：2-3 PD（cici 与业务方协调 + 主代理 a 接通 mock → real）

### 候选 commit history 治理债（19f 协作 race 教训）

| Task | 范围 | 工时 |
|---|---|---|
| 19g-GOV-1 | 19f 协作 race 教训文档化（详 V0.3 §八）+ 子代理 spawn 模板加协调提示 | 0.3 PD |
| 19g-GOV-2 | 主代理 a 收到子代理报告后核实流程标准化（git log + show --stat 必查）| 0.2 PD |

**预算 commit 治理**：0.5 PD

### 候选 A2' 重启（cici 19g 启动前评估 NC 端反馈）

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19g-A2-RESTART | NC 真端点 phase 2（19d V0.2 §一 5 步重启路径）| 4 PD | NC 端反馈 ≥ 5 项关键差异 + 项目正式协调 |

### 候选 UI-3 phase 3（19f 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19g-UI-3-3 | 35+ 长尾 HTML 原型批量 React 化（按 prototype/ 剩余文件）| 5-10 PD |

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a-19f 候选 C/G。**预算 5-10 PD**

---

## 二、推荐策略：双轨 UI-2-5 E2E + 6 endpoint 归属 + commit 治理

**V0.1 倾向**：
- **主轨 UI-2-5 E2E**：1-1.5 PD（必修 4 次顺延 — 反模式深化风险红线）
- **副轨 6 backend endpoint 归属决策**：2-3 PD（cici 与业务方协调 + mock → real 接通）
- **旁路 commit history 治理债**：0.5 PD（19f 协作 race 教训文档化 + 子代理模板优化）
- **预算 19g**：3.5-5 PD（不含 A2' 重启）

**A2' 启动条件评估**：
- 若 cici 19g 启动前 NC 端反馈 ≥ 5 项 → A2'-RESTART 主轨（合并工时 7-8 PD）
- 若 NC 端持续无反馈 → A2' 继续顺延（性质改变 — cici 19d 已撤主线）

---

## 三、累计技术债（Sprint 19g 必修，决策点 2）

### 3.1 Sprint 17a-19f 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | 17a-19f | 4 PD | **19d 撤** + 待重启条件 |
| 2 | 详情页 / 编辑表单（reports / nc-interface backend endpoint 占位）| 19c | 0.3 PD | 19g 待 cici 确认 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 等 NC 端 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19g 评估 |
| 5 | UI-2-5 E2E Playwright | 19c-19f 4 次顺延 | 1-1.5 PD | **19g 必修** ✅ |
| 6 | ~~vendor brotli + lazy-load~~ | 19b/19d | 0.5-1 PD | **19f STYLE-OPT 已落地** ✅ |
| 7 | UI-STYLE | 19e/19f | 0 | **已完成** ✅ |
| 8 | minSignCount 4 模板真接通后业务回归测试 | 19d | 0.5 PD | 19g 候选 |
| 9 | ~~Razor Page 细粒度 Permission~~ | 19e 起 | 0.5 PD | **19f UI-FIX 已落地** ✅ |
| 10 | ~~abp install-libs LeptonX libs~~ | 19e 起 | 0.1 PD | **19f UI-FIX 已落地** ✅ |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | **19g 6 endpoint 归属一并** |
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |
| **14** | **6 backend endpoint [⚠️] 占位归属决策** | **19f** | **2-3 PD** | **19g 副轨** |
| **15** | **commit history 治理债**（19f 协作 race） | **19f** | **0.3 PD** | **19g 旁路** |

### 3.2 Codex 19f 顺延（待评审后补 §六附录）

> 占位 — Codex 19f 评审完成后从顺延清单挑选补到本节。

**预估合计 ~1-2 PD**（占位等评审后修订）

---

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19g 主线方向 | **双轨 主轨 UI-2-5 E2E 必修 + 副轨 6 endpoint 归属 + 旁路 commit 治理**（推荐 — 4 次顺延红线 + 业务方协调 + 治理债）|
| 2 | 15 累计技术债 | **#5 E2E 必修 + #14 6 endpoint 副轨 + #15 commit 治理旁路** ~3.5-5 PD |
| 3 | 工时预算 | **UI-2-5 1-1.5 + 6 endpoint 2-3 + commit 治理 0.5 + 缓冲 = 3.5-5 PD**（不含 A2' 4 PD）|
| 4 | 子代理并行策略 | **主代理 a UI-2-5 E2E + 子代理 b 6 endpoint Controller + 子代理 c commit 治理 + 19f 顺延** sweet spot 2x |
| 5 | Codex 19f 评审 | **待 cici 触发**（提示词详 19f Demo §五 — 累计 1 Sprint 待评 / 关键时机）|
| 6 | A2' 重启决策 | **19g 启动前 cici 评估 NC 端反馈窗口**（无反馈 → 继续顺延性质改变；反馈 ≥ 5 项 → 撤主轨改 A2'-RESTART 主轨 4 PD）|
| 7 | 6 endpoint 业务方协调时机 | **19g D0 cici 通知财务/质保/设备/仓储/SQA 5 业务方对接人**（SQA 可由 cici 直接维护 readonly 矩阵 mock 数据）|

---

## 五、Sprint 19g 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | UI-2-5 E2E 4 次顺延后再次顺延（反模式深化）| 高 | **19g 必修红线**；如启动 19g 时无可行 Playwright 配置则 spawn 子代理 1 PD 优先做 |
| 2 | 6 endpoint 业务方协调延期（业务方未指派对接人）| 中 | 19g D0 cici 提前通知 5 业务方；mock 数据可继续支撑 Demo 演示直至业务方反馈 |
| 3 | A2' 重启条件评估失误（NC 端反馈数量不足 ≥ 5 但 cici 决策启动）| 中 | V0.2 锁版前 cici 与项目方明确反馈数量 + 反馈质量基线 |
| 4 | commit history 治理债推迟到下下 Sprint（19g 也顺延）| 低 | 旁路位置确保不阻塞主线；最迟 Sprint 20a 必修（教训过期前文档化） |

---

## 六、Codex 19f Finding 附录（占位 · 待评审完成补全）

> 占位 — Codex 19f 评审完成后从顺延清单挑选补到本节。

**评审重点候选**（详 19f Demo §五）：
- UI-3 phase 2 5 React 页面架构正确性
- UI-FIX 11 Razor Page Permission 完整性
- STYLE-OPT brotli 配置 + closeBundle order
- 5 fix 修复完整性
- **协作 race 治理建议**（commit message 误差教训）

**触发提示词**：详 19f Demo §五

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双轨 UI-2-5 E2E 必修（4 次顺延红线）+ 副轨 6 endpoint 归属（业务方协调）+ 旁路 commit 治理（19f race 教训）+ 15 累计技术债 + §六 Codex 19f Finding 附录占位 + A2' 重启评估时机 |
