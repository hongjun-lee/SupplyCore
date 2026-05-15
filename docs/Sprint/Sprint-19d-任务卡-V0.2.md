# Sprint 19d 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 选 1：撤 A2' + 双轨 UI-3 + UI-3-DEBT）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19d 锁版任务卡
**配套：** [`Sprint-19c-Demo-脚本-V0.1.md`](./Sprint-19c-Demo-脚本-V0.1.md) §四 候选范围 + 3 Sprint Codex finding 顺延

---

## 一、Sprint 19d 主线方向（锁版 · 双轨 UI-3 + UI-3-DEBT）

### A2' 已撤（cici 2026-05-15 决策 · 选 1）

**A2' NC 真端点 phase 2 已撤** — Sprint 19a/19b/19c 三次连续顺延后，cici 评估 NC 端持续无反馈构成"反模式深化"风险，决策撤 A2' 主线 + 转项目层面正式重启。

#### 撤 A2' 放弃理由声明（基于 19c Demo §四 + 19d V0.1 §五 reflection）

**根本原因**（非技术 / 协调层面）：
- NC 端责任主体不清（用友 NCC 厂商 / 阜矿集团 NC 实例运维 / 财务部 IT 三方未明确单一对接人）
- NC 端优先级低（SupplyCores 是新系统对 NC 端是新需求）
- 沟通渠道未正式化（cici 个人推动 vs 项目级协调会议）
- 60 ⚠️ 占位稿可能太技术（NC 端需业务方语言版本 / 优先级排序）

**已交付不丢失**（NC 端反馈到位即可重启）：
- Sprint 18a A1 配合度评估清单 7 项（commit `c9ebbe9`）
- Sprint 18b A2-1' 23 接口 JSON Schema 占位稿 V0.1.1 60 ⚠️（commit `0c2cc47`）含 NCC OpenAPI 7 关键差异 NC-1-1~7
- Sprint 17a NcOAuth2TokenService 完整实现（OAuth2 client_credentials + 401 retry + L1+L2 缓存）
- Sprint 18a chaos 5 + 18a phase 2 5 = 10 WireMock chaos 场景守护

**重启路径**（19e/20a 项目协调到位后）：
1. cici 与项目方明确 NC 端对接人（财务部 IT 负责人 / NCC 厂商客户经理）
2. 60 ⚠️ 占位稿拆"必反馈 5 项 + 可选 2 项 + 后置 N 项"分级
3. 设置项目级正式协调会议（含财务方业务负责人）替代 cici 个人推动
4. NC 端反馈到位 → 重启 A2'（Sprint 19e/20a 主线 4 PD）
5. 重启时无需重新设计：所有底层基础设施（OAuth2 / Polly / chaos 守护 / NcInterfaceHttpClient）就绪

### 主轨 UI-3：剩 44 HTML 原型批量 React 化（A2' 撤后转主线）

19b 6 + 19c 6 = 12 页面已 MVP 完成；剩 44 HTML 原型（contract / equipment / quality / scrap / 危品 / 招标 / 主数据扩展等）。

| Task | 范围 | 工时 |
|---|---|---|
| 19d-UI-3-1 | contract-list / contract-detail | 1 PD |
| 19d-UI-3-2 | equipment-lifecycle / equipment-oee / equipment-rent | 1.5 PD |
| 19d-UI-3-3 | quality-check / scrap-disposal / mobile-stocktake | 1.5 PD |
| 19d-UI-3-4 | dashboard-bigscreen 大屏 demo 高光 | 1 PD |
| 19d-UI-3-5 | 其他 35+ 原型批量 React 化（顺延 19e/20a）| 5-10 PD |

**预算 UI-3 phase 1**：5-6 PD

### 副轨 UI-3-DEBT：Codex 19a/19b/19c 13 P3 + 1 P2 顺延项消化

| 来源 | finding | 工时 |
|---|---|---|
| 19a P3-1 | D9 NCalc 异常 LogDebug trace | 0.1 PD |
| 19a P3-2 | minSignCount 会签计票实现（4 模板） | 1-1.5 PD |
| 19a P3-3 | InitiateAsync 首节点 D9 评估对称化 | 0.2 PD |
| 19b P2 顺延 | vendor-devextreme tree-shaking（1.94 MB → ~400 KB / 与 Catio 同等技术债 #6）| 1+ PD |
| 19b P3-1~5 | vite 注释 / Lookup key / alert 占位 / version bump | 0.3 PD |
| 19c P3-1~5 | Singleton captive / Popup race AbortController / Form 校验 / unit 字段污染 | 0.5-0.8 PD |

**预算 UI-3-DEBT**：3-4 PD

### 顺延候选（Sprint 19e+ 重新评估）

- 候选 UI-2-5 E2E Playwright（19c 顺延 1-1.5 PD）
- 候选 C 详设 09 看板剩 5 类 + OLAP（持续顺延）
- 候选 G 详设 06 库存超储处置（持续顺延）
- **A2' 重启**（项目层面正式协调到位后）

---

## 二、双轨执行策略（V0.2 锁版）

- **主代理 a 主轨 UI-3 phase 1**：5-6 PD（核心 9 页面 contract / equipment / quality / dashboard）
- **子代理 b 副轨 UI-3-DEBT**：3-4 PD（消化 13 P3 + 1 P2 vendor）
- **子代理 c**：vendor tree-shaking 专题（与 Catio 同等技术债 #6 重点项）
- **A2' 撤后**：原 4 PD 预留转 UI-3 phase 1 扩展（如 cici 19d 期间想多做 1-2 页面）

---

## 三、累计技术债

### 3.1 Sprint 17a-19c 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | ~~19a/19b/19c 三次顺延~~ | ~~4 PD~~ | **19d V0.2 撤**（cici 选 1 / §一 放弃理由声明 / 19e/20a 项目协调后重启）|
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

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19d 主线方向 | **双轨 UI-3 phase 1 + UI-3-DEBT**（撤 A2' 后纯前端 + 技术债消化）|
| 2 | 6 累计技术债 | **优先 #6 vendor + 13 P3** ~3-4 PD（#1 A2' 已撤 / #2-#5 按需）|
| 3 | 工时预算 | **UI-3 5-6 + DEBT 3-4 + 缓冲 = 8-10 PD**（撤 A2' 节省 4 PD 预留）|
| 4 | 子代理并行策略 | **主代理 a UI-3 + 子代理 b DEBT + 子代理 c (vendor 专题)** sweet spot 3x |
| 5 | Codex 19c 评审 | 已完成（commit `a5974c0`）|
| 6 | **A2' 第三次顺延决策** | **cici 选 1：撤 A2' + 项目层面正式重启**（详 §一 放弃理由声明）|

---

## 五、Sprint 19d 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | ~~A2' 第四次顺延~~ → 已撤（V0.2 cici 决策选 1 消除此风险）| 已消除 | 详 §一 放弃理由声明 + 项目协调到位后 19e/20a 重启 |
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
| **V0.2** | **2026-05-15** | **cici 选 1：撤 A2' + 项目层面正式重启** — §一 加放弃理由声明（根本原因 / 已交付不丢失 / 5 步重启路径）+ §三 #1 状态删除线 + §四 决策点 6 锁版 + §五 风险 #1 已消除 + 8-10 PD 预算（节省 4 PD A2' 预留） |
