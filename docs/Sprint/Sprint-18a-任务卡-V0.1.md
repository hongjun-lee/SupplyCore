# Sprint 18a 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 18a 起步草案
**配套：** [`Sprint-17a-Demo-脚本-V0.1.md`](./Sprint-17a-Demo-脚本-V0.1.md) §四 候选范围

---

## 一、Sprint 18a 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 A：NC 真端点联调 phase 2（Sprint 17a 顺延 · V0.1 倾向）

| Task | 范围 | 工时 |
|---|---|---|
| 18a-A1 | NC 端配合度评估完成（OAuth2 endpoint + Client 颁发 + 接口 schema）| 1 PD |
| 18a-A2 | 23 NC 接口路径 + 业务码对照实测 phase 1（MD-001/004 + 4 BIZ + 5 CHK）| 2-3 PD |
| 18a-A3 | F-12 NcAccountRule ledger_sum 实接（NC 凭证 sum 字段升级 amount/decimal）| 1 PD |
| 18a-A4 | 真端点 chaos 测试 + 实际限流 / 401 等异常实测 | 1 PD |
| 18a-A5 | 灰度上线 1 个 BIZ-005A 单接口 + 监控 dashboard 实际值 | 1 PD |

**预算**：~6-7 PD（强依赖 NC 端配合）

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

### 2.2 Codex 17a 顺延（待评审后补 §六附录）

> 占位 — Codex 17a 评审完成后从顺延清单挑选补到本节。

**预估合计 ~3-4 PD**（占位等评审后修订）

---

## 三、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 18a 主线方向（A/B/C/F/G）| **A** NC 真端点 phase 2（Sprint 17a 顺延关键依赖）|
| 2 | 4 累计技术债哪些必修 | 全修（~3-4 PD）— A2/A3 主线吸收 #1/#2 |
| 3 | 工时预算 | 8-11 PD（A 6-7 + 技术债 3-4 + 缓冲）|
| 4 | 子代理并行策略 | 主+2 子代理 sweet spot 3.8x |
| 5 | Codex 17a 评审时机 | Sprint 17a 收尾后 cici 触发（D7 Demo 完成）|

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

## 六、Codex 17a Finding 附录（占位 — 待评审后补）

| Sprint 17a Commits | 已评 | finding 数 |
|---|---|---|
| `9f4857f` D1 NC OAuth2 TokenService | _待评_ | - |
| `7c109f1` D2 401 retry + Wave 87 边界 | _待评_ | - |
| `dc0c69c` D3-4 WireMock + SY-02 + reconcile | _待评_ | - |
| `2e69a2a` D5-6 NC Health Snapshot + WireMock chaos | _待评_ | - |
| `84cde86` D7 Demo 脚本 | _待评_ | - |
| **合计** | 5 | **0** | _待评_ |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 5 候选方向（A NC 真端点 phase 2 顺延 / B/C/F/G）+ 4 累计技术债 + 5 决策点 |
