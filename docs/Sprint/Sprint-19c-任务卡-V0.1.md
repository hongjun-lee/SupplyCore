# Sprint 19c 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19c 起步草案
**配套：** [`Sprint-19b-Demo-脚本-V0.1.md`](./Sprint-19b-Demo-脚本-V0.1.md) §四 候选范围

---

## 一、Sprint 19c 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 UI-2（推荐）：6 MVP 页面详情页 + 后端 endpoint 配套

19b 6 MVP 页面骨架已就绪，本任务补完详情页 / 编辑表单 + 缺失 backend endpoint：

| Task | 范围 | 工时 |
|---|---|---|
| 19c-UI-2-1 | InventoryBalance 聚合视图 backend Controller + Application Service | 1 PD |
| 19c-UI-2-2 | PurchaseOrders Controller P-04（详设缺）+ DTO + Application Service | 1.5 PD |
| 19c-UI-2-3 | 6 MVP 页面详情页（Drawer / Modal）：approval / inventory / purchase / material / report / nc-task | 2 PD |
| 19c-UI-2-4 | 6 MVP 页面编辑表单（Form + 校验 + 提交联调）| 1.5 PD |
| 19c-UI-2-5 | E2E 测试基础（Playwright 1-2 核心场景如 approval-center 完整链路）| 0.5-1 PD |

**预算 UI-2**：6.5-7 PD

### 候选 A2'：NC 真端点联调 phase 2（19a/19b 二次顺延）

| Task | 范围 | 工时 | 依赖 NC 端 |
|---|---|---|---|
| 19c-A2-1~4 | 同 19b A2'（NC 端配合度 / OAuth2 真接通 / 23 接口实测 / BIZ-005A 灰度）| 4 PD | **强** |

### 候选 X1：OAuth2 Token Redis 持久化缓存（17a/19a/19b 三次顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19c-X1 | NcOAuth2TokenService 加 IDistributedCache 抽象 + Redis 配置 + 测试 | 0.5 PD |

### 候选 UI-3：可选页面 + 大批量 React 化（顺延候选）

剩 44 HTML 原型 React 化（contract-list / dashboard-bigscreen / equipment-* / quality-check / scrap-disposal 等）。**预算 8-12 PD（可选 1-2 PD/页面平均）**

### 候选 C：详设 09 看板剩 5 类 + OLAP（持续顺延）

详 Sprint 17a/18a/19a/19b 候选 C。**预算 7-10 PD**

---

## 二、推荐策略：双轨 UI-2 + A2' + X1 旁路

**V0.1 倾向**：
- **主轨 UI-2**：6 MVP 详情页 + 后端 endpoint 配套（6.5-7 PD）
- **副轨 A2'**：NC 反馈触发（保留；19c 仍无反馈则顺延 19d 但需重评策略）
- **旁路 X1**：OAuth2 Redis 0.5 PD（独立可做）

**反模式风险**：A2' 已 19a/19b 二次顺延 — 19c 第三次顺延前需 cici 评估是否：
- 撤掉 A2' 改单线主线（避免长期"伪保留"）
- 设硬截止时间（如 19d 前 NC 端必须反馈或正式撤）

---

## 三、累计技术债（Sprint 19c 必修，决策点 2）

### 3.1 Sprint 19b 后续技术债

| # | 项 | 来源 | 工时 |
|---|---|---|---|
| 1 | InventoryBalance 聚合 endpoint（19b inventory 联调缺）| 19b 起 | 1 PD（融入 UI-2-1） |
| 2 | PurchaseOrders Controller P-04（19b purchase-orders 联调缺）| 19b 起 | 1.5 PD（融入 UI-2-2） |
| 3 | 6 MVP 详情页 + 编辑表单（19b 临时 alert）| 19b 起 | 3.5 PD（融入 UI-2-3+4） |
| 4 | OAuth2 Token Redis 持久化（17a/19a/19b 三次顺延） | 17a 起 | 0.5 PD（融入 X1） |
| 5 | A2' NC 真端点（19a/19b 二次顺延） | 19a 起 | 4 PD（融入 A2'）|

### 3.2 Codex 19b 顺延（待评审后补 §六附录）

> 占位 — Codex 19b 评审完成后从顺延清单挑选补到本节。

**预估合计 ~1-2 PD**（占位等评审后修订）

---

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19c 主线方向 | **双轨 主轨 UI-2 + 副轨 A2'**（X1 旁路）|
| 2 | 5 累计技术债哪些必修 | **全修** ~10-12 PD（UI-2 主线吸收 #1-#3 / X1 旁路 #4 / A2' 副轨 #5） |
| 3 | 工时预算 | **UI-2 6.5-7 + A2' 4 触发 + X1 0.5 + 缓冲 = 11-13 PD** |
| 4 | 子代理并行策略 | **主代理 a UI-2-1/2 (后端 endpoint) + 子代理 b UI-2-3 (详情页) + 子代理 c UI-2-4 (编辑表单)** sweet spot 3x |
| 5 | Codex 19b 评审 | Sprint 19b 收尾后 cici 触发（Demo `587cd9c` 已就绪） |
| 6 | A2' 第三次顺延决策 | 19c 启动前 cici 评估：NC 端硬截止 vs 撤掉 A2' 改单线主线 |

---

## 五、Sprint 19c 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | A2' 第三次顺延 = 反模式深化 | **高** | cici 19c 启动前必须明确 NC 反馈窗口 / 硬截止 / 撤 A2' 决策 |
| 2 | UI-2 后端 endpoint 配套（InventoryBalance / PurchaseOrders P-04）规模超 2.5 PD | 中 | 子代理 b 跑 endpoint 设计 + Mock 占位（真值待业务方反馈）|
| 3 | 详情页 / 编辑表单 6 个 × 0.5 PD = 3 PD 是否过高 | 中 | 复用 approval-center 模板 + DevExtreme Form 组件 → 实测可能 2 PD（参考 19b UI MVP 实测提速 50%）|
| 4 | E2E 测试 Playwright 学习曲线 | 中 | 先 1 个核心场景（approval-center 完整链路）+ 后续 19d 扩展 |

---

## 六、Codex 19b 评审待触发（已就绪）

Sprint 19b Demo 脚本 §五 已写就触发提示词：

> "评审 Sprint 19b 共 5 commits（`b521feb`+`68640b9` V0.2 / `4842244` Day 1 frontend skeleton / `4fb2280` Day 2 approval-center / `6717355` Day 3-4 5 页面 双子代理 / `587cd9c` Day 7 Demo）— 重点关注模块化 frontend 架构正确性 + React 19/DevExtreme 25 升级稳定性 + approval-center 模板复用质量 + 3 [⚠️] 待 cici 确认 endpoint 缺口"

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双轨 UI-2 + A2' + X1 旁路 + 5 累计技术债 + 6 决策点 + 4 风险（含 A2' 第三次顺延 = 反模式深化）|
