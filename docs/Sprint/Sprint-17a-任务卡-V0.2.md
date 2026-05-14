# Sprint 17a 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-14 评审锁定主线 D）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 17a 锁版任务卡
**配套：** [`Sprint-16a-Demo-脚本-V0.1.md`](./Sprint-16a-Demo-脚本-V0.1.md) §五 候选范围、Sprint 17a-V0.1（已锁定）

---

## 一、Sprint 17a 主线方向（锁版 · 决策点 1）

### 主线 D：NC OAuth2 升级 + 真端点联调（Sprint 15a/16a 顺延）

| Task | 范围 | 工时 | 子代理 |
|---|---|---|---|
| 17a-D1 | NC OAuth2 客户端凭证流（client_credentials）| 1 PD | 主代理 a |
| 17a-D2 | Token 自动刷新 + 过期重试 + 安全存储 | 1 PD | 主代理 a |
| 17a-D3 | NC 厂商真端点联调（含 NC 端配合度评估）| 2-3 PD | 主代理 a |
| 17a-D4 | F-12 NC 凭证规则 SY-02 化（Sprint 16a 硬编码 → 配置化）| 0.5 PD | 子代理 b |
| 17a-D5 | NC 真端点 chaos 测试 + monitoring 完善 | 1 PD | 子代理 c |

**预算**：6-7 PD（合并累计技术债 8-10 PD 整 Sprint）

### 顺延候选（Sprint 18a+ 重新评估）

- 候选 B：详设 10 剩 12 类审批模板（10-12 PD）
- 候选 C：详设 09 看板剩 5 类 + OLAP（8-10 PD）
- 候选 F：详设 04 招投标 T-01~07 外部对接（6-8 PD + 30 PD 外部缓冲）
- 候选 G：详设 06 库存超储处置 + 暂估完整化（5-6 PD）

---

## 二、累计技术债（锁版 · 决策点 2 · 全修）

### 2.1 Sprint 16a 后续技术债（4 项 ~2-3 PD）

| # | 项 | 复杂度 | 工时 | 处置 |
|---|---|---|---|---|
| 1 | F-12 NC 凭证规则 SY-02 化（融入 17a-D4）| 低 | 0.5 PD | 主线吸收 |
| 2 | Wave 87 partial unique index PG 边界测试 | 低 | 0.3 PD | Day 1-2 子代理 b 顺手 |
| 3 | PeriodCloseManager reconcile 完整化（一期仅 CHK-001 占位）| 中 | 1 PD | Day 3-4 |
| 4 | WireMock.Net 集成测试扩展（一期仅 BIZ-005A POC）| 中 | 0.5-1 PD | Day 5-6 |

### 2.2 Codex 16a 顺延（评审完成 · 0 顺延）

Codex 16a 评审 2 commits（`6452501` + `f32ab52`）共 1 P1 + 2 P2，已在 commit `7f68eb0` 当 Sprint 全修：
- P1 orgId 透传（IInterfaceContributor + 23 Contributor）
- P2-1 InterfaceHealthCheckService UoW.Begin 包裹
- P2-2 Sprint16aMonthlyClose E2E ApprovalManager stub

**0 顺延** — Codex 0 顺延记录连续 5 Sprint（12a/13a/14a/15a/16a）。

**预估合计 0 PD**（全修无顺延 → 技术债节省 ~2 PD）

---

## 三、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 17a 主线方向 | **D NC OAuth2 + 真端点（Sprint 15a/16a 关键依赖顺延）** |
| 2 | 4 累计技术债哪些必修 | **全修**（D4 融入主线 / Wave 87 + reconcile + WireMock 单独走）|
| 3 | 工时预算 | **8-10 PD**（D 6-7 + 技术债 2-3） |
| 4 | 子代理并行策略 | **主+2 子代理 sweet spot 3.8x**（D1/D2/D3 主线 a + D4 子代理 b + D5 子代理 c）|
| 5 | Codex 16a 评审时机 | 已完成 0 顺延（commit `7f68eb0`） |

---

## 四、Sprint 17a Day 拆分（锁版）

| Day | Task | 主代理 a | 子代理 b | 子代理 c |
|---|---|---|---|---|
| Day 1 | D1 OAuth2 client_credentials 流（IdentityModel）| ✓ | Wave 87 边界测试 | - |
| Day 2 | D2 Token 刷新 + 过期重试 + 加密存储 | ✓ | F-12 SY-02 化（D4）| - |
| Day 3 | D3-1 NC 真端点联调 phase 1（MD-001/004 + 4 BIZ）| ✓ | - | PeriodCloseManager reconcile 完整化 |
| Day 4 | D3-2 NC 真端点联调 phase 2（剩 9 BIZ + 5 CHK）| ✓ | - | WireMock.Net 集成测试扩展 |
| Day 5 | D3-3 + D5-1 真端点 chaos 测试基线 | ✓ | - | ✓ |
| Day 6 | D5-2 monitoring 完善 + 健康基线对照 | ✓ | - | ✓ |
| Day 7 | Demo 脚本 + 收尾 | ✓ | - | - |

**节奏**：连续 6-7 工作日 + 1 day Demo（参考 Sprint 16a 节奏）。

---

## 五、风险（锁版）

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 厂商真端点配合度（D3 主线核心依赖）| **高** | Sprint 14a-16a Mock 已落地 + WireMock.Net POC，可阶段切换 + 缓冲 +5-10 PD |
| 2 | OAuth2 安全实现（client_credentials + 刷新）| 中 | 标准 IdentityModel 库（MIT）+ Token AES 加密存储 |
| 3 | F-12 SY-02 化破坏现有 6 规则硬编码 | 低 | 配置化 + fallback 硬编码兜底（兼容历史）|
| 4 | PeriodCloseManager reconcile 完整化（CHK-001 真接通）| 中 | 复用 Sprint 14a CHK-001 框架 + 财务方业务规则确认 |

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

## 七、Codex 17a 评审待触发

> 占位 — Sprint 17a 完成时 cici 触发 Codex 17a 评审

**评审重点**：
- OAuth2 client_credentials 实现安全性（Token 存储加密 + 刷新窗口 + 撤销链）
- NC 真端点 chaos 测试覆盖度（超时 / 部分失败 / 重试雪崩）
- F-12 SY-02 化向后兼容（硬编码兜底）
- WireMock.Net 集成测试扩展边界
- PeriodCloseManager reconcile CHK-001 业务规则正确性

---

## 八、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 5 候选方向（D NC OAuth2 / B 详设 10 / C 看板 / F 招投标 / G 库存超储+暂估）+ 4 累计技术债 + 5 决策点 |
| V0.1.1 | 2026-05-14 | Codex 16a 评审完成补 §二.2 + §六附录（1 P1 + 2 P2 全修 0 顺延，连续 5 Sprint 记录）|
| **V0.2** | **2026-05-14** | **cici 评审锁版主线 D NC OAuth2 + 真端点；全修 4 累计技术债；8-10 PD 预算；主+2 子代理 sweet spot 3.8x；Day 1-7 节奏拆分** |
