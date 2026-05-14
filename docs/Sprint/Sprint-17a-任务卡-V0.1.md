# Sprint 17a 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 17a 起步草案
**配套：** [`Sprint-16a-Demo-脚本-V0.1.md`](./Sprint-16a-Demo-脚本-V0.1.md) §五 候选范围

---

## 一、Sprint 17a 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 D：NC OAuth2 升级 + 真端点联调（Sprint 15a/16a 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 17a-D1 | NC OAuth2 客户端凭证流（client_credentials）| 1 PD |
| 17a-D2 | Token 自动刷新 + 过期重试 + 安全存储 | 1 PD |
| 17a-D3 | NC 厂商真端点联调（含 NC 端配合度评估）| 2-3 PD |
| 17a-D4 | F-12 NC 凭证规则 SY-02 化（Sprint 16a 硬编码 → 配置化）| 0.5 PD |
| 17a-D5 | NC 真端点 chaos 测试 + monitoring 完善 | 1 PD |

**预算**：~6-7 PD

### 候选 B：详设 10 剩 12 类审批模板 + 高级

详 Sprint 14a/15a 候选 B。**预算 10-12 PD**

### 候选 C：详设 09 看板剩 5 类 + OLAP

详 Sprint 14a/15a 候选 C。**预算 8-10 PD**

### 候选 F：详设 04 招投标 T-01~07（外部对接）

详 Sprint 15a 候选 E。**预算 6-8 PD（+30 PD 外部缓冲）**

### 候选 G：详设 06 库存超储处置 + 暂估完整化

| Task | 范围 | 工时 |
|---|---|---|
| 17a-G1 | 超储处置三级流程（详设 06 V1.1 §超储 +8 PD 增量）| 3-4 PD |
| 17a-G2 | 暂估 D-90/D-30 双预警闭环（详设 06 V1.1 §暂估 +2 PD）| 1-2 PD |

**预算**：5-6 PD

---

## 二、累计技术债（Sprint 17a 必修，决策点 2）

### 2.1 Sprint 16a 后续技术债

| # | 项 | 复杂度 | 工时 |
|---|---|---|---|
| 1 | F-12 NC 凭证规则 SY-02 化（融入候选 D #4）| 低 | 0.5 PD |
| 2 | Wave 87 partial unique index PG 边界测试 | 低 | 0.3 PD |
| 3 | PeriodCloseManager reconcile 完整化（一期仅 CHK-001 占位）| 中 | 1 PD |
| 4 | WireMock.Net 集成测试扩展（一期仅 BIZ-005A POC）| 中 | 0.5-1 PD |

### 2.2 Codex 16a 顺延（评审完成 · 0 顺延）

Codex 16a 评审 2 commits（`6452501` + `f32ab52`）共 1 P1 + 2 P2，已在 commit `7f68eb0` 当 Sprint 全修：
- P1 orgId 透传（IInterfaceContributor + 23 Contributor）
- P2-1 InterfaceHealthCheckService UoW.Begin 包裹
- P2-2 Sprint16aMonthlyClose E2E ApprovalManager stub

**0 顺延** — Codex 0 顺延记录连续 5 Sprint（12a/13a/14a/15a/16a）。

**预估合计 0 PD**（全修无顺延 → 技术债节省 ~2 PD）

---

## 三、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 17a 主线方向（D/B/C/F/G）| D NC OAuth2 + 真端点（Sprint 15a/16a 顺延关键依赖）|
| 2 | 4 累计技术债哪些必修 | 全修（~2-3 PD）|
| 3 | 工时预算 | 10-13 PD（D 6-7 + 技术债 2-3 + 缓冲）|
| 4 | 子代理并行策略 | 主+2 子代理 sweet spot 3.8x |
| 5 | Codex 16a 评审时机 | Sprint 16a 收尾后 cici 触发 |

---

## 四、Sprint 17a 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 厂商真端点配合度（候选 D 主线核心依赖）| 高 | Sprint 14a-16a Mock 已落地 + WireMock.Net POC，可阶段切换 + 缓冲 +5-10 PD |
| 2 | OAuth2 安全实现（client_credentials + 刷新）| 中 | 标准 IdentityModel 库（MIT） + Token 加密存储 |
| 3 | F-12 SY-02 化破坏现有 6 规则硬编码 | 低 | 配置化 + fallback 硬编码兜底（兼容历史） |
| 4 | PeriodCloseManager reconcile 完整化（CHK-001 真接通）| 中 | 复用 Sprint 14a CHK-001 框架 + 财务方业务规则确认 |

---

## 五、Codex 16a 评审待触发

> 占位 — Sprint 16a 完成时触发 Codex 16a 评审 2 commits（`6452501` 三轨第一波 + 本 D8/Demo commit）

**评审重点**：
- 9 BIZ Contributor 一致性 + sed 模板批量生成质量
- F-10/F-11/F-12 实体 + Wave 87 partial unique 边界
- PeriodCloseManager 状态机（重月结复用行 / 反结审批触发 ApprovalInstance）
- InterfaceTask.OrgId Wave 88 历史 backfill 0
- NcAccountRule 6 规则硬编码 fallback 业务正确性
- WireMock.Net BIZ-005A POC 安全性

---

## 六、Codex 16a Finding 附录（评审完成 · 0 顺延）

| Sprint 16a Commits | 已评 | P1 | P2 | 当 Sprint 修 | 顺延 |
|---|---|---|---|---|---|
| `6452501` 三轨第一波（9 BIZ + F-10/F-11/F-12 + Wave 87/88）| Y | 1（orgId 透传断裂）| 1（HostedService UoW）| 2 | 0 |
| `f32ab52` E2E + Demo | Y | 0 | 1（E2E ApprovalManager null）| 1 | 0 |
| **合计** | 2 | **1** | **2** | **3** | **0** |

**修复 commit**：`7f68eb0` "Sprint 16a Codex 16a 评审修复（1 P1 + 2 P2 全修 0 顺延）"

**Codex 0 顺延连续 5 Sprint 记录**：

| Sprint | 评审 commits | P1+P2 | 当 Sprint 修 | 顺延 |
|---|---|---|---|---|
| 12a | 2 | - | - | 0 |
| 13a | 2 | - | - | 0 |
| 14a | 3 | - | - | 0 |
| 15a | 2 | - | - | 0 |
| **16a** | **2** | **3** | **3** | **0** |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 5 候选方向（D NC OAuth2 / B 详设 10 / C 看板 / F 招投标 / G 库存超储+暂估）+ 4 累计技术债 + 5 决策点 |
| V0.1.1 | 2026-05-14 | Codex 16a 评审完成补 §二.2 + §六附录（1 P1 + 2 P2 全修 0 顺延，连续 5 Sprint 记录）|
