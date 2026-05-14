# Sprint 18a 灰度上线 Checklist V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（初版）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 18a A5 灰度上线运维清单
**配套：**
- [`Sprint-17a-Demo-脚本-V0.1.md`](./Sprint-17a-Demo-脚本-V0.1.md) §五 NC 真端点切换 Checklist（前置准备）
- [`Sprint-18a-任务卡-V0.2.md`](./Sprint-18a-任务卡-V0.2.md) A5 任务定义
- 详设 08 V1.1 §11 监控 dashboard、§9 异常台账

---

## 一、灰度上线总策略

### 1.1 推进节奏（按接口逐个，不全量同步切）

```
Phase POC：BIZ-005A 单接口走通（已 Sprint 16a 完成，作为参照模板）
   ↓
Phase 1（Sprint 18a-19a）：4 BIZ + MD-001/004 + 5 CHK 共 11 接口分批
   ↓
Phase 2（Sprint 20a+）：剩余 12 接口（含 F-12 ledger_sum + 财务结算回写）
   ↓
Phase 3：全量上线 + Mock 关闭 + 24h 稳定观察期
```

### 1.2 核心原则

| # | 原则 | 说明 |
|---|---|---|
| 1 | **一接口一闭环** | 单接口走完"前置 7 项 + 中 5 项 + 后 3 项"再切下一个，禁止并行多接口同时切 |
| 2 | **Mock fallback 永不删** | `UseMock=true` 配置项保留至 Phase 3 完整稳定 90 天后，灰度期间任何时间可一键回滚 |
| 3 | **NC 端配合度评估优先** | 接口切换前必须 Sprint 17a §五 7 项 NC 配合事项全 ✅，缺一项不开 |
| 4 | **dashboard 真值确认** | 上线后 24h 看 `LastSuccessfulCallAt` / `RecentSuccessRate24h` 真值，dashboard 显示 "Unknown" 视为未生效 |
| 5 | **回滚不解释** | 任何异常无需追因即可回滚（`UseMock=true` + 单接口 disable 开关），追因放回滚之后 |

---

## 二、单接口上线前 7 项检查

每个接口切真端点前必过的 7 项（缺一不切）。

| # | 检查项 | 责任 | 验证手段 |
|---|---|---|---|
| 1 | **OAuth2 Token 已能成功获取** | cici + NC 端 | `INcOAuth2TokenService.GetStatus()` 返 `HasCachedToken=true` + `RemainingSeconds>0` |
| 2 | **endpoint 联通性** | cici | `curl -H "Authorization: Bearer $TOKEN" $BaseUrl/$endpoint` 返 200 或预期 4xx（非超时/连接拒绝）|
| 3 | **业务码字典对照确认** | NC 端 | NC 提供该接口业务码枚举（0000 成功 + N 失败码），SC 端 SY-02 字典已配 |
| 4 | **chaos 测试通过** | cici（子代理 b）| WireMock chaos 5 场景全过（401 / 5xx / timeout / 限流 / net-split），见 Sprint 17a D6 + 18a A4 |
| 5 | **monitoring 字段配齐** | cici | dashboard `LastSuccessfulCallAt` / `RecentSuccessRate24h` / `CircuitBreakerHint` 有真值（非 null / Unknown）|
| 6 | **回滚开关验证** | cici | 预先演练：改 `UseMock=true` → 重启 Host → dashboard 回到 Mock 模式 ≤ 60s |
| 7 | **验证测试用例就绪** | cici | 单接口集成测试 1 例（happy path）+ 异常测试 2 例（4xx / 5xx）已就绪可执行 |

**任何 1 项未达 → 接口不开 + 记入"接口配合度阻塞清单"反推 NC 端**

---

## 三、单接口上线中 5 项观察（切换后 24h 内每 4h 看一次）

| # | 观察项 | 阈值 | 数据来源 |
|---|---|---|---|
| 1 | **错误率** | ≤ 1%（24h 滚动）| `NcHealthSnapshotDto.RecentSuccessRate24h ≥ 0.99` |
| 2 | **平均耗时** | ≤ Mock 模式的 3 倍 | `InterfaceOverviewDto.AvgDurationMs`（InterfaceCodePrefix 过滤）|
| 3 | **熔断器状态** | "Closed" 常态 | `NcHealthSnapshotDto.CircuitBreakerHint`（Open 持续 > 5min 立即告警）|
| 4 | **Token 刷新次数** | 24h ≤ 50 次（按 Token TTL 估算）| `NcOAuth2TokenStatus` 日志 `RefreshAsync` 计数（异常多则查 NC 端 401 异常）|
| 5 | **异常台账增量** | 24h ≤ 上线前同接口的 2 倍 | `ExceptionRecord` 24h 新增条数 |

**任 1 项触阈值 → 触发回滚预案（§六）**

---

## 四、单接口上线后 3 项验收（24h 稳定后做）

| # | 验收项 | 验收方 | 通过条件 |
|---|---|---|---|
| 1 | **24h 错误率 < 1%** | cici | `RecentSuccessRate24h ≥ 0.99` 持续 24h（无 < 0.99 波动）|
| 2 | **dashboard 显示真值** | cici | 4 关键字段非默认值：`LastSuccessfulCallAt ≠ null` + `RecentSuccessCount24h > 0` + `RecentSuccessRate24h > 0` + `CircuitBreakerHint ∈ {Closed, HalfOpen}`（非 Unknown）|
| 3 | **财务方业务正确性确认** | 财务方 + cici | 对账核心 KPI（凭证金额 / 对账匹配数 / 异常工单数）与 NC 真值差异 ≤ 0.1% 持续 3 个对账周期 |

**3 项全过 → 接口标"Phase X 上线完成"，进入下一接口切换**

---

## 五、灰度比例分级（POC 后 23 接口阶段适用）

### 5.1 比例阶梯

| 阶段 | 切换接口数 | 占比 | 持续时长 | 升级条件 |
|---|---|---|---|---|
| 灰度 1% | 1 接口（POC BIZ-005A）| ~4% | ≥ 7 天 | §三 5 项观察连续 7 天达标 + §四 3 项验收通过 |
| 灰度 10% | 2-3 接口（MD-001 + CHK-001）| ~13% | ≥ 7 天 | 同上 + 累计无 P1 故障 |
| 灰度 50% | 11 接口（Phase 1 完整）| ~48% | ≥ 14 天 | 同上 + 财务方 1 个完整月对账周期验收通过 |
| 灰度 100% | 23 接口全量 | 100% | 持续 | 90 天稳定后撤 Mock 兜底（关 `UseMock` 配置项）|

### 5.2 升级判定矩阵

任一项不达 → **停在当前阶段**，不退也不升：
- §三 5 观察项全过
- §四 3 验收项全过
- 累计 P1 故障 = 0
- 财务方明确签字（仅 50% → 100% 阶段）

---

## 六、回滚预案（一键操作 ≤ 60s）

### 6.1 全量回滚（最高优先）

**触发条件**：≥ 2 接口同时触阈值 / 数据完整性疑虑 / 不可控未知异常

**执行**：
```
1. 改 appsettings.Production.json：NcInterface:UseMock=true
2. 重启 Host（kubectl rollout restart / systemctl restart）
3. 验证：GET /api/supply-cores/interface-monitor/nc-health → UseMock=true
4. 通知财务方暂停 NC 真接业务，回 Mock 兜底模式
```

**预期影响**：实时业务回到 Mock 模式（不真发 NC），SC 端业务运转正常，可暂停 ≤ 4h

### 6.2 单接口回滚

**触发条件**：1 接口触阈值 + 其他接口正常

**执行**：
```
1. 改 SY-02 字典：interface.{code}.enabled=false
2. NcInterfaceHttpClient.InvokeAsync 检测 enabled=false → 返 "Mock"（兜底回 Mock 路径）
3. 验证：dashboard 该接口 RecentSuccessCount24h 停止增长
```

**预期影响**：仅该接口回 Mock 路径，其他接口照旧

### 6.3 全量 disable（最严重）

**触发条件**：NC 端整体瘫痪 + 数据风险

**执行**：
```
1. 改 appsettings.Production.json：NcInterface:UseMock=true + NcInterface:Disabled=true
2. NcInterfaceHttpClient 任何调用直接 throw NcDisabledException
3. 业务侧降级到完全离线模式（凭证暂存 + 后期补传）
```

**预期影响**：业务完全脱离 NC，仅财务月结 / 对账延后处理

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — 总策略 + 前 7 / 中 5 / 后 3 检查 + 灰度比例分级 + 回滚预案 3 级（配合 Sprint 18a A5 dashboard 5 新字段 LastSuccessfulCallAt / RecentSuccessCount24h / RecentFailureCount24h / RecentSuccessRate24h / CircuitBreakerHint 落地）|
