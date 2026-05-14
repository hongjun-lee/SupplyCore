# Sprint 18a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 18a 验收演示脚本
**配套：** [`Sprint-18a-任务卡-V0.2.md`](./Sprint-18a-任务卡-V0.2.md) + [`Sprint-18a-NC端配合度评估-V0.1.md`](./Sprint-18a-NC端配合度评估-V0.1.md) + [`Sprint-18a-灰度上线Checklist-V0.1.md`](./Sprint-18a-灰度上线Checklist-V0.1.md)

---

## 一、Sprint 18a 落地范围

按 V0.2 锁版（主线 A NC 真端点 phase 2 / 4 累计技术债全修 / 8-11 PD / 主+2 子代理 sweet spot 3.8x），实际交付 **~2.8 PD**（A2 强依赖 NC 端配合，已交付 A1 评估清单等 NC 端反馈；其余 A1/A3/A4/A5 全部完成）：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（cici 评审锁主线 A）| `25ec871` | a |
| **D1** | A3 F-06 ReconciliationRecord ledger_sum amount + Wave 89 + reconcile by_chk JSON 升级 | `9b57f08` | a |
| **D1** | A1 NC 端配合度评估清单（7 项 + 沟通模板 + 风险隔离决策）| `c9ebbe9` | a |
| **D2** | A4 真端点 chaos phase 2（5 新场景：429 / 部分成功 / 不规范响应 / 大 payload / 慢网络）| `641ff0e` | **b（子代理）** |
| **D2** | A5 灰度上线 Checklist（7 章节）+ NcHealthSnapshotDto 5 dashboard 扩展字段（24h 成功率 / 熔断器提示等）| `641ff0e` + `eb3b7ba` | **c（子代理）** |
| D7+ | Demo 脚本（本文档）+ Codex 18a 触发 | 本 commit | a |

**测试基线演进**：
- Sprint 17a 收尾：**1581**（含 Codex 17a 修复 1582）
- Sprint 18a Day 1 A3（F-06 amount 升级）：**1586**（+4 D_PeriodCloseReconcile 守护）
- **Sprint 18a Day 2 A5**：**1589**（+3 D_HealthSnapshotExtended）+ 10 Integration 独立（17a chaos 5 + 18a phase2 5）
- Domain 876 / Application 674 / EFCore 33（默认）/ Web 6

**A2 顺延 Sprint 18b**：
- 强依赖 NC 端配合（OAuth2 token endpoint + 23 接口 schema + 业务码字典 + 测试环境 BaseUrl）
- Sprint 18a Day 1 已交付 A1 评估清单 + 沟通模板，cici 已协调 NC 端发起评估
- NC 端反馈到位后 Sprint 18b 主线 A2 推进（23 接口 phase 1 实测）

---

## 二、Demo 演示路径

### 路径 A：reconcile ledger_sum amount 升级（5 分钟）

1. **数据准备**：dev 数据库直插 F-06 ReconciliationRecord（带 amount 真值）：
   ```sql
   INSERT INTO f.reconciliation_record (..., total_count, matched_count, variance_count, amount_total, amount_matched, amount_variance) VALUES
     (..., 100, 95, 5, 1000.00, 950.00, 50.00);  -- CHK-001 日对账，金额真值
   ```
2. **跑月结**：`POST /api/.../period-close` periodCode=202604 → 触发 ReconcileAndCloseAsync
3. **查 summary JSON**：`record.ReconciliationSummary` 应含：
   - `by_chk.CHK_001.amount_total=1000, amount_matched=950, amount_variance=50`
   - `has_amount_data: true`
   - `total_amount_real: 1000`（跨 CHK 求和）
   - `ledger_sum_from_nc_placeholder: false`（已接 amount 真值）
4. **向后兼容验证**：删 amount 真值（设 null） → 重跑月结 → `has_amount_data: false / ledger_sum_from_nc_placeholder: true`（Sprint 17a 行为）

### 路径 B：NC Health Snapshot Dashboard 扩展字段（5 分钟）

1. **配置切换**：appsettings.json `NcInterface:Authentication:Type` 改 OAuth2 + 填 OAuth2 子段
2. **跑几个 NC 调用**：触发 Hangfire 跑 MD-001 推送 / 跑 1 个 BIZ-005A 凭证 → 累积 24h 内成功 / 失败数据
3. **GET dashboard**：`GET /api/supply-cores/interface-monitor/nc-health` → NcHealthSnapshotDto:
   - 基础（17a D5）：UseMock / AuthType / OAuth2Configured / HasCachedToken / TokenExpiresAt
   - **扩展（18a A5）**：
     - `LastSuccessfulCallAt: 2026-05-14T13:45:00Z`（最近 NC 成功）
     - `RecentSuccessCount24h: 234` / `RecentFailureCount24h: 6`
     - `RecentSuccessRate24h: 0.975`
     - `CircuitBreakerHint: "Unknown"`（NC 真端点接入后接 PollyCircuitState）

### 路径 C：A4 chaos phase 2 测试守护跑通（5 分钟）

跑 `Sprint18a_A4_ChaosPhase2_Integration_Tests` 5 场景：
1. **429 + Retry-After**：Polly 当前不重试 429 → 业务拒收单次 HTTP（NC 端配合度评估后决定是否升级 retry 429）
2. **批接口部分成功**：HTTP 200 + items 含 failed → 顶层成功（failed 明细在 RawResponseJson 保留，待 NC 真端点联调后决定 per-item F-08 拆分）
3. **不规范响应**：NC 端 code=int → ParseInvokeResponseAsync 抛 InvalidOperationException（P3 备忘留 18b 字段类型守卫）
4. **大 payload 1MB**：req/resp 各 ~1MB <5s 完成不挂不 OOM
5. **慢网络 5x 100ms**：TimeoutSeconds=10 不误触发，不触发熔断器

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | A NC 真端点 phase 2 | ✅ A1/A3/A4/A5 完成；**A2 顺延 18b（强依赖 NC 端配合）** |
| 2. 4 累计技术债 | 全修 | ✅ #1 NC 真端点 phase 2 部分（A1 已交付） / #2 F-12 ledger_sum 升级（A3 完成）/ #3 OAuth2 Redis 缓存（顺延 18b）/ #4 切换 checklist 追踪（A5 完成）|
| 3. 工时预算 | 8-11 PD | **2.8 PD 实际**（A2 ~3 PD 顺延 18b 待 NC 端） |
| 4. 子代理策略 | 主+2 子代理 3.8x | ✅ Day 2 双子代理（b A4 + c A5）+ 主代理 a 验证 |
| 5. Codex 17a 评审 | 已完成 0 P1 + 3 P2 全修 | ✅ commit `4a6054b` 连续 6 Sprint 0 顺延 P2 |

---

## 四、Sprint 18b 候选方向（A2 顺延 + 新增）

| 候选 | 范围 | 工时 |
|---|---|---|
| **A2** | **NC 真端点联调 phase 2 主线（Sprint 18a 顺延）— 待 NC 端配合度评估完成** | 3-4 PD |
| B | 详设 10 剩 12 类审批模板 | 10-12 PD |
| C | 详设 09 看板剩 5 类 + OLAP | 8-10 PD |
| G | 详设 06 库存超储处置 + 暂估完整化 | 5-6 PD |

**V0.1 倾向 A2**：NC 端配合度评估完成（18a A1 已交付）后实测 23 接口 phase 1（MD-001/004 + 4 BIZ + 5 CHK）

---

## 五、Sprint 18a Codex 评审待触发

> 占位 — Sprint 18a 完成时 cici 触发 Codex 18a 评审

**评审重点**：
- F-06 ReconciliationRecord amount 字段升级向后兼容（nullable + has_amount_data flag）
- by_chk JSON 结构稳定（Sprint 18b NC 真端点接 amount 真值时不破坏）
- NcHealthSnapshotDto 24h 聚合性能（_taskRepo.GetQueryableAsync 全表扫风险）
- A4 chaos phase 2 P3 finding（ParseInvokeResponseAsync ValueKind 守卫）
- A5 灰度上线 Checklist 实际可执行性（cici 经验法则）

**触发提示词**：
"评审 Sprint 18a 共 5 commits（`25ec871` V0.2 / `9b57f08` A3 / `c9ebbe9` A1 / `641ff0e` A4+A5 / `eb3b7ba` A5 Checklist） — 重点关注 F-06 amount 向后兼容 + NcHealthSnapshot 24h 聚合性能 + ParseInvokeResponseAsync 字段类型守卫顺延决策"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — Day 1-2 A1/A3/A4/A5 落地（2.8 PD） + A2 顺延 18b 决策 + 3 演示路径 + Codex 18a 触发提示 |
