# Sprint 18a 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-14 评审锁定主线 A）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 18a 锁版任务卡
**配套：** [`Sprint-17a-Demo-脚本-V0.1.md`](./Sprint-17a-Demo-脚本-V0.1.md) §四 候选范围、Sprint 18a-V0.1（已锁定）

---

## 一、Sprint 18a 主线方向（锁版 · 决策点 1）

### 主线 A：NC 真端点联调 phase 2（Sprint 17a 顺延）

| Task | 范围 | 工时 | 依赖 NC 端 | 子代理 |
|---|---|---|---|---|
| 18a-A1 | NC 端配合度评估清单 + 状态追踪文档 | 0.5 PD | 部分 | 主代理 a |
| 18a-A2 | 23 NC 接口路径 + 业务码对照实测 phase 1（MD-001/004 + 4 BIZ + 5 CHK）| 2-3 PD | **强** | 主代理 a（等 NC 端）|
| 18a-A3 | F-06 ReconciliationRecord ledger_sum amount 字段升级 + Wave 89 + reconcile by_chk JSON 升级 | 1 PD | 无 | 主代理 a |
| 18a-A4 | 真端点 chaos 测试 phase 2（基于实测限流 / 401 / 5xx 等场景扩展）| 1 PD | 部分 | 子代理 b |
| 18a-A5 | 灰度上线 checklist + 监控 dashboard 实际值看板设计 | 1 PD | 部分 | 子代理 c |

**预算**：~6-7 PD（A2 强依赖 NC 端，A1/A3/A4/A5 可独立推进）

### 风险隔离策略

A2 强依赖 NC 端 — 若 NC 端配合度评估（A1）阻塞，主代理可优先做 A3（F-06 schema 升级，独立可做）+ A4/A5（子代理并行准备工作）；A2 留在 NC 端就绪后再推进，必要时顺延 Sprint 19a。

### 候选 B：详设 10 剩 12 类审批模板 + 高级

详 Sprint 17a 候选 B。**预算 10-12 PD**

### 候选 C：详设 09 看板剩 5 类 + OLAP

详 Sprint 17a 候选 C。**预算 8-10 PD**

### 候选 F：详设 04 招投标 T-01~07（外部对接）

详 Sprint 17a 候选 F。**预算 6-8 PD（+30 PD 外部缓冲）**

### 候选 G：详设 06 库存超储处置 + 暂估完整化

详 Sprint 17a 候选 G。**预算 5-6 PD**

---

## 二、累计技术债（Sprint 18a 必修，决策点 2）

### 2.1 Sprint 17a 后续技术债

| # | 项 | 复杂度 | 工时 |
|---|---|---|---|
| 1 | NC 真端点联调 phase 2（D3-2 顺延，融入候选 A）| 中 | 2-3 PD |
| 2 | F-12 ledger_sum amount 字段 schema 升级（融入 A3）| 低 | 1 PD |
| 3 | OAuth2 Token 持久化 cache（一期内存重启重取，可加 Redis 缓存）| 低 | 0.5 PD |
| 4 | NC 真端点切换 checklist §五 实际执行追踪 | 低 | 0.3 PD |

### 2.2 Codex 17a 顺延（评审完成 · 0 顺延）

Codex 17a 评审 5 commits 共 0 P1 + 3 P2 + 3 P3，P2 已在 commit `4a6054b` 当 Sprint 全修：
- P2-1 RefreshAsync epoch double-check 防并发 N 倍调 token endpoint
- P2-2 InvokeAsync/QueryStatusAsync response Dispose 防 connection 泄漏
- P2-3 Wave 87 测试硬编码 dev DB 密码（env-only）

P3 3 项顺延 Sprint 18a：
- P3-4 GetStatus 无锁读 _cachedToken / _cachedExpiresAt（监控 DTO 罕见不一致）
- P3-5 PeriodCloseManager TotalEntryCount 命名与语义偏移（Sprint 18a NC ledger_sum 真接时重构）
- P3-6 WireMockExtended BuildFixture maxRetry 形参 `_ = maxRetry` 死参数

**0 顺延 P2** — Codex 0 顺延记录连续 6 Sprint（12a/13a/14a/15a/16a/17a）。

**预估合计 ~0.5 PD**（P3 顺延项轻量）

---

## 三、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 18a 主线方向 | **A NC 真端点 phase 2（Sprint 17a 顺延关键依赖）** |
| 2 | 4 累计技术债哪些必修 | **全修**（A3 主线吸收 #1/#2 + OAuth2 Redis 缓存 / checklist 追踪 独立走）|
| 3 | 工时预算 | **8-11 PD**（A 6-7 + 技术债 3-4 + 缓冲）|
| 4 | 子代理并行策略 | **主+2 子代理 sweet spot 3.8x**（A1/A3 主线 a + A4 子代理 b + A5 子代理 c）|
| 5 | Codex 17a 评审 | 已完成 0 P1 + 3 P2 全修（commit `4a6054b`）连续 6 Sprint 0 顺延 P2 |

---

## 四、Sprint 18a 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 厂商真端点配合度（候选 A 主线核心依赖）| **高** | Sprint 17a checklist §五 7 项 + WireMock chaos 5 场景已落地 + 缓冲 +5-10 PD |
| 2 | OAuth2 token endpoint 实际安全要求（mTLS / IP 白名单）| 中 | NcOAuth2TokenService 设计已抽离 HttpClient 注入，可扩 |
| 3 | NC 端 23 接口实际响应 schema 与 Mock 偏差 | 中 | Sprint 17a Mock + WireMock 模拟充分 + chaos 测试覆盖 |
| 4 | F-12 ledger_sum amount 类型升级破坏现有数据 | 低 | Wave 89 加 nullable amount + 历史 backfill 0 + by_chk JSON 字段稳定 |

---

## 五、Codex 17a 评审待触发

> 占位 — Sprint 17a 完成时触发 Codex 17a 评审 5 commits（`9f4857f` D1 / `7c109f1` D2 / `dc0c69c` D3-4 / `2e69a2a` D5-6 / `84cde86` D7 Demo）

**评审重点**：
- OAuth2 client_credentials 实现安全性（Token 内存缓存 + RefreshBufferSeconds + single-flight 防雪崩）
- 401 智能 retry 死循环防御（双 Refresh / token cancellation 透传）
- F-12 SY-02 化向后兼容（硬编码 fallback 兜底 / SY-02 key 命名稳定）
- reconcile by_chk JSON 结构稳定（Sprint 18a NC 真端点接入 ledger_sum 兼容路径）
- WireMock chaos 5 场景覆盖度（漏 net-split / partial-fail？）
- NC Health Snapshot DTO 生产实际字段

---

## 六、Codex 17a Finding 附录（评审完成 · 0 顺延 P2）

| Sprint 17a Commits | 已评 | P1 | P2 | P3 | 当 Sprint 修 | 顺延 |
|---|---|---|---|---|---|---|
| `9f4857f` D1 NC OAuth2 TokenService | Y | 0 | 1 (epoch double-check) | 1 (GetStatus 无锁) | 1 P2 | 1 P3 |
| `7c109f1` D2 401 retry + Wave 87 边界 | Y | 0 | 2 (response Dispose + 测试密码) | 0 | 2 P2 | 0 |
| `dc0c69c` D3-4 WireMock + SY-02 + reconcile | Y | 0 | 0 | 1 (TotalEntryCount 命名) | 0 | 1 P3 |
| `2e69a2a` D5-6 NC Health Snapshot + WireMock chaos | Y | 0 | 0 | 1 (maxRetry 死参数) | 0 | 1 P3 |
| `84cde86` D7 Demo 脚本 | Y | 0 | 0 | 0 | 0 | 0 |
| **合计** | 5 | **0** | **3** | **3** | **3 P2** | **3 P3** |

**修复 commit**：`4a6054b` "Sprint 17a Codex 17a 评审修复（3 P2 全修 0 顺延，连续 6 Sprint）"

**Codex 0 顺延 P2 连续 6 Sprint 记录**：

| Sprint | 评审 commits | P1+P2 | 当 Sprint 修 P2 | 顺延 P2 |
|---|---|---|---|---|
| 12a | 2 | - | - | 0 |
| 13a | 2 | - | - | 0 |
| 14a | 3 | - | - | 0 |
| 15a | 2 | - | - | 0 |
| 16a | 2 | 3 | 3 | 0 |
| **17a** | **5** | **3** | **3** | **0** |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 5 候选方向（A NC 真端点 phase 2 顺延 / B/C/F/G）+ 4 累计技术债 + 5 决策点 |
| V0.1.1 | 2026-05-14 | Codex 17a 评审完成补 §二.2 + §六附录（0 P1 + 3 P2 全修 + 3 P3 顺延 18a，连续 6 Sprint 0 顺延 P2 记录）|
| **V0.2** | **2026-05-14** | **cici 评审锁版主线 A NC 真端点 phase 2；全修 4 累计技术债 + 3 P3 顺延项；8-11 PD 预算；主+2 子代理 sweet spot 3.8x；A2 强依赖 NC 端可顺延 19a 风险隔离** |
