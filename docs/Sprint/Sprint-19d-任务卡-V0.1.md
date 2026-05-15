# Sprint 19d 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19d 起步草案
**配套：** [`Sprint-19c-Demo-脚本-V0.1.md`](./Sprint-19c-Demo-脚本-V0.1.md) §四 候选范围 + 3 Sprint Codex finding 顺延

---

## 一、Sprint 19d 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 A2'-FINAL：NC 真端点 phase 2 决策窗口（19a/19b/19c 三次顺延后 cici 必须决策）

| Task | 范围 | 工时 | 依赖 NC 端 |
|---|---|---|---|
| 19d-A2-FINAL | cici 评估 NC 端 19d 反馈窗口；硬截止 vs 撤 A2' | 决策项 | **强** |
| 19d-A2-1 | 若 NC 反馈到位：完整执行 A2-1~A2-4 | 4 PD | **强** |
| 19d-A2-RETIRE | 若 NC 端无反馈：撤 A2' 改 V0 删除 + "放弃理由" + 转 19e/20a 重启 | 0.3 PD | 无 |

### 候选 UI-3：剩 44 HTML 原型批量 React 化

19b 6 + 19c 6 = 12 页面已 MVP 完成；剩 44 HTML 原型（contract / equipment / quality / scrap / 危品 / 招标 / 主数据扩展等）。

| Task | 范围 | 工时 |
|---|---|---|
| 19d-UI-3-1 | contract-list / contract-detail | 1 PD |
| 19d-UI-3-2 | equipment-lifecycle / equipment-oee / equipment-rent | 1.5 PD |
| 19d-UI-3-3 | quality-check / scrap-disposal / mobile-stocktake | 1.5 PD |
| 19d-UI-3-4 | dashboard-bigscreen 大屏 demo 高光 | 1 PD |
| 19d-UI-3-5 | 其他 35+ 原型批量 React 化（顺延 19e/20a）| 5-10 PD |

**预算 UI-3 phase 1**：5-6 PD

### 候选 UI-3-DEBT：Codex 19a/19b/19c 13 P3 + 1 P2 顺延项消化

| 来源 | finding | 工时 |
|---|---|---|
| 19a P3-1 | D9 NCalc 异常 LogDebug trace | 0.1 PD |
| 19a P3-2 | minSignCount 会签计票实现（4 模板） | 1-1.5 PD |
| 19a P3-3 | InitiateAsync 首节点 D9 评估对称化 | 0.2 PD |
| 19b P2 顺延 | vendor-devextreme tree-shaking（1.94 MB → ~400 KB / 与 Catio 同等技术债 #6）| 1+ PD |
| 19b P3-1~5 | vite 注释 / Lookup key / alert 占位 / version bump | 0.3 PD |
| 19c P3-1~5 | Singleton captive / Popup race AbortController / Form 校验 / unit 字段污染 | 0.5-0.8 PD |

**预算 UI-3-DEBT**：3-4 PD

### 候选 UI-2-5 E2E（Sprint 19c 顺延 1-1.5 PD）/ C / G（持续顺延）

---

## 二、推荐策略：双轨 UI-3 + UI-3-DEBT + 撤 A2'

**V0.1 倾向**：
- **主轨 UI-3 phase 1**：5-6 PD（核心 9 页面）
- **副轨 UI-3-DEBT**：3-4 PD（消化 P3 + vendor）
- **决策项 A2'-FINAL**：**推荐撤 A2'**（避免持续顺延反模式深化 - 19a/19b/19c 三次顺延已构成）

---

## 三、累计技术债

### 3.1 Sprint 17a-19c 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | A2' NC 真端点 phase 2 | 19a/19b/19c 三次顺延 | 4 PD | **19d 必决策** |
| 2 | 详情页 / 编辑表单（reports / nc-interface backend endpoint 占位）| 19c | 0.3 PD | 19d 待 cici 确认 |
| 3 | A2-1' 占位稿 NC 反馈调整（NCC OpenAPI 适配）| 18b 起 | 1-2 PD | 等 NC 端 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19d 评估 |
| 5 | UI-2-5 E2E Playwright | 19c 顺延 | 1-1.5 PD | 19d 候选 |
| 6 | **vendor-devextreme tree-shaking**（19b finding 4）| 19b | 1+ PD | **19d 必修**（与 Catio 同等技术债登记）|

### 3.2 Codex 19a/19b/19c 顺延（评审完成）

3 Sprint Codex 评审已闭环（commit `a5974c0`）：
- 19a：0 P1 + 0 P2 + 3 P3 → 全 P3 顺延 19d
- 19b：2 P1 全修 + 3 P2 全修 + **1 P2 顺延（vendor）** + 5 P3 顺延
- 19c：0 P1 + 2 P2 全修 + 5 P3 顺延

**19d 必修汇总**：13 P3 + 1 P2 vendor → 估 3-4 PD

---

## 四、V0.1 决策点

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19d 主线方向 | **双轨 UI-3 phase 1 + UI-3-DEBT** |
| 2 | 6 累计技术债哪些必修 | **优先 #6 vendor + 13 P3** ~3-4 PD |
| 3 | 工时预算 | **UI-3 5-6 + DEBT 3-4 + A2' (触发 4 / 撤 0.3) + 缓冲 = 9-15 PD** |
| 4 | 子代理并行策略 | **主代理 a UI-3 + 子代理 b DEBT + 子代理 c (vendor 拆分专题)** sweet spot 3x |
| 5 | Codex 19c 评审 | 已完成（commit `a5974c0`）|
| 6 | **A2' 第三次顺延决策**（必决）| **推荐撤 A2' 改 V0 删除**（持续顺延已构成反模式深化）|

---

## 五、Sprint 19d 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | A2' 第四次顺延 = 反模式重度深化 | **极高** | 19d 启动前 cici 必明确：硬截止 / 撤 A2' / 静默废弃 三选一 |
| 2 | vendor tree-shaking 1+ PD 实际超工作量 | 中 | 子代理 c 专题；与 Catio 同等技术债参考 Catio 路径 |
| 3 | UI-3 9 核心页面 5-6 PD 是否乐观 | 中 | 19c 实测提速 65%（模板复用）— 5-6 PD 可信 |
| 4 | 19a P3-2 minSignCount 会签 1-1.5 PD 超预期 | 中 | 仅修关键 4 模板（CON-002/003/SHT-001/SCP-001）；其余 stub |

---

## 六、Codex 19a/19b/19c Finding 附录

详 commit `a5974c0` "Sprint 19a/19b/19c Codex 三轨评审修复（2 P1 + 5 P2 全修 + 1 P2 工作量顺延 + 13 P3 顺延 19d）"。

| Sprint Commit 范围 | 已评 | P1 | P2 | P3 | 当 Sprint 修 P1+P2 | 顺延 19d |
|---|---|---|---|---|---|---|
| Sprint 19a 7 commits | Y | 0 | 0 | 3 | - | 3 P3 |
| Sprint 19b 5 commits | Y | 2 | 4 | 5 | 2 P1 + 3 P2 | 1 P2 (vendor) + 5 P3 |
| Sprint 19c 4 commits | Y | 0 | 2 | 5 | 2 P2 | 5 P3 |
| **合计** | 16 | **2** | **6** | **13** | **2 P1 + 5 P2** | **1 P2 + 13 P3** |

**Codex 0 顺延 P2 连续 Sprint 记录调整**：
- **11a-19a 连续 9 Sprint 完整 0 P2 顺延** ✓
- **19b 首次合理顺延 1 P2**（vendor tree-shaking 1+ PD 工作量超 0.5 PD 阈值；登记累计技术债 #6；与 Catio 同等技术债 — 不算反模式）
- 19c 0 P2 顺延延续

新表述："**0 关键 P2 顺延 9 Sprint + 1 工作量超阈值 P2 显式顺延（19b vendor）**"

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双轨 UI-3 + UI-3-DEBT + A2' 第三次顺延决策（推荐撤 A2'）+ 6 累计技术债 + 6 决策点 + 4 风险 + §六 3 Sprint Codex 评审附录 |
