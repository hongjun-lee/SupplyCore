# Sprint 19o-19s 中期 Roadmap V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · 5 Sprint 中期路线图（基于 19a-19n Retrospective）
**触发**：cici 切 effort=max + 选 C+A 路径（复盘 + Roadmap + cici 协调）

---

## 一、Roadmap 设计原则

基于 19a-19n Retrospective 关键发现：
1. 🔴 **业务方协调是核心阻塞** — Roadmap 必须区分"业务方依赖"路径 vs "不依赖"路径
2. 🟡 **避免 UI-3 续反模式深化** — 26 React 化页面已足够，新 UI 必须有 PO 优先级支持
3. 🟢 **质量基线已稳** — race 治理 / Codex 评审 / 子代理协作可继续

## 二、5 Sprint 三轨规划

### 轨道 A：业务交付主轨（业务方反馈到位时启动）

| Sprint | 主线 | 工时 | 启动条件 |
|---|---|---|---|
| **19o** A | 6 endpoint mock → real（前 3 endpoint）| 2-3 PD | 5 业务方 ≥ 3 反馈 spec |
| **19p** A | 6 endpoint mock → real（后 3 endpoint）+ E2E 集成 | 2.5-3 PD | 19o A 完整 |
| **19q** A | 基础资料业务字段补完（19m 3 原型 DTO 调整）| 1.5-2 PD | 业务方反馈基础资料字段 |
| **19r** A | LeaseBilling 月结视图 + EquipmentLifecycle history | 1 PD | 业务方反馈（设备方）|
| **19s** A | 业务回归测试 + Demo 业务方验收 | 1-2 PD | A 轨完整 |

**轨道 A 总**：~9-11 PD（5 Sprint）— 业务方反馈窗口 ≥ 3 endpoint spec 启动

### 轨道 B：CI/CD + 质量基线主轨（cici 配 secrets 后启动）

| Sprint | 主线 | 工时 | 启动条件 |
|---|---|---|---|
| **19o** B | CI/CD secrets 验证 + Codex hook 实测 + continue-on-error 拆除 | 0.9 PD | cici 配 3 secrets |
| **19p** B | Codex pre-merge hook 真实 PR 评审验证 + finding 质量评估 | 0.5 PD | 19o B PR run 通过 |
| **19q** B | E2E 扩展（19n b 5 业务流 spec — 19l 模式补完）| 1 PD | 无 |
| **19r** B | 业务回归测试覆盖度评估 + RBAC 边界测试 | 1 PD | 19p B 完成 |
| **19s** B | Codex 评审自动化 + Sprint 评审报告生成 | 0.5 PD | 19p B 完成 |

**轨道 B 总**：~4 PD（5 Sprint）— cici 5 分钟自助配 secrets 启动

### 轨道 C：race 治理 + 反模式实测（可与轨道 A/B 并行）

| Sprint | 主线 | 工时 | 启动条件 |
|---|---|---|---|
| **19o** C | race [P0] 同模块实测（按 V0.2 §六.2 方案 1 — b/c 同改 Permissions.cs）| 0.5 PD | cici 同意触发 |
| **19p** C | race-governance V0.3（19o 实测回填 §六.5 表格）| 0.3 PD | 19o C 完成 |
| **19q** C | 第 2 次同模块实测（按方案 2 — vite.config.ts）| 0.5 PD | 19o C 通过 |
| **19r** C | race-governance V0.4 + [P0] → [P1] 降级评估 | 0.3 PD | 19q C 通过 |
| **19s** C | AGENTS.md V1.5 治理升级总结（19h-19s 完整记录）| 0.2 PD | 19r C 完成 |

**轨道 C 总**：~1.8 PD（5 Sprint）— 主代理 a 故意设计同模块任务

### 轨道 D：UI-3 续 + 业务价值评估（PO 介入后启动）

| Sprint | 主线 | 工时 | 启动条件 |
|---|---|---|---|
| **19o** D | PO 与 cici 协商 prototype/ 剩 16 候选业务价值评估 | 0 PD（外部）| cici 与 PO 协调 1 day |
| **19p** D | UI-3 续 5 高价值原型（PO 优先级前 5）| 2-3 PD | 19o D 评估完成 |
| **19q** D | UI-3 续 5（PO 优先级 6-10）| 2-3 PD | 19p D 完成 |
| **19r** D | 长尾原型批量处理（剩余 6 个 — sed 批量）| 1-1.5 PD | 19q D 完成 |
| **19s** D | UI Demo 完整路径 + 业务方演练 | 1 PD | 业务方协调到位 |

**轨道 D 总**：~6-8.5 PD（5 Sprint）— 强依赖 PO 评估

## 三、3 决策场景

### 场景 1：业务方反馈到位（5 业务方 ≥ 3 反馈）

**路径**：轨道 A 主 + 轨道 B 副 + 轨道 C 旁
**5 Sprint 累计**：~15 PD
**关键节点**：19o 启动 A 主轨 → 19p E2E 集成 → 19q-19s 业务回归 + 验收

### 场景 2：业务方未反馈但 cici 配 secrets（推动 PO 介入）

**路径**：轨道 B 主 + 轨道 C 副 + 轨道 D（PO 协调后）旁
**5 Sprint 累计**：~10-12 PD
**关键节点**：19o secrets 验证 + race 实测 → 19p Codex hook 实测 → 19q-19s 视 PO 协调进度

### 场景 3：双未持续（业务方未反馈 + cici 未配 secrets）

**路径**：轨道 C 主 + 暂停轨道 A/B
**5 Sprint 累计**：~2-3 PD（仅维持基础）
**警告**：**反模式深化严重** — 5 Sprint 0 业务价值交付
**对策**：cici 必须在 19o D0 与 PO 约定明确决策窗口（≤ 2 Sprint 内必有突破）

## 四、Roadmap 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 业务方反馈持续延期（≥ 6 Sprint = 19j-19o）| 🔴 极高 | 19o 必须升级 — cici 与 PO 正式会议机制 |
| 2 | cici 配 secrets 持续延期（≥ 8 Sprint = 19h-19o）| 🟡 中 | 19o D0 cici 直接配（不超过 5 分钟）|
| 3 | UI-3 续无 PO 优先级支持 | 🟡 中 | 轨道 D 暂停 — 等 PO 评估 |
| 4 | race [P0] 实测条件难以构造 | 🟢 低 | 轨道 C 主代理 a 主动设计同模块任务 |
| 5 | 5 Sprint 累计 PD 过载（如三轨并行 = 15+ PD）| 🟡 中 | cici 决策"单轨"or"多轨"or"暂停推 Sprint 节奏" |

## 五、cici 19o 启动前必决策清单

| # | 决策 | 影响 |
|---|---|---|
| 1 | **业务方协调机制建立**（cici 与 PO 1-2 day 正式会议）| 决定轨道 A 启动条件 |
| 2 | **CI/CD secrets 自助配**（cici 5 分钟）| 解锁轨道 B 启动 |
| 3 | **PO 业务价值评估**（19o-19s 主线方向）| 决定 ABCD 4 轨优先级 |
| 4 | **race [P0] 实测触发意愿**（cici 同意 / 不同意）| 决定轨道 C 启动 |
| 5 | **Sprint 节奏调整**（持续推 / 暂停 / 减速）| 决定后续 5 Sprint 整体强度 |

---

## 六、推荐方案

**默认路径**（如 cici 19o D0 已与 PO 协调到位）：场景 2 → **轨道 B 主 + 轨道 C 副 + 等待轨道 A 启动条件**
- 19o：CI secrets 验证 + race [P0] 同模块实测 + 等业务方反馈 ~1.5 PD
- 19p：Codex hook 实测 + race 实测扩展 + 评估业务方反馈 ~1 PD
- 19q-19s：视业务方反馈状态切轨道 A / D

**最坏路径**（场景 3 持续）：警示 cici 反模式严重 — 19o 启动前必须升级
- 主代理 a 仅做主代理 a 任务（不 spawn 子代理）
- 持续推 PO 协调（每个 Sprint 必决策升级）
- 累计 PD 控制 ≤ 3 PD（避免持续投入无业务方反馈方向）

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 19o-19s 5 Sprint 中期 Roadmap / 4 轨道（A 业务交付 / B CI 质量 / C race 治理 / D UI-3 续）+ 3 决策场景（业务方反馈 / cici secrets / 双未持续）+ Roadmap 风险 + cici 启动前 5 决策清单 + 推荐默认 + 最坏路径 |
