# Dashboard Performance Baseline (Sprint 20h T-E2)

**Sprint：** 20h D1 second 主代理 e T-E2
**日期：** 2026-05-17
**目标：** dashboard 8/8 完整后建立性能 baseline / 后续 Sprint regression 检测基准

---

## 〇、Baseline 阈值（20g T-E3 spec + 20h 实测）

| 维度 | 阈值 | 来源 | 备注 |
|---|---|---|---|
| 前端首屏渲染 | < 3s | 20g T-E3 spec | `dashboard-bigscreen.spec.ts` 场景 3 加严 / CI 慢机器宽松 |
| 前端 cache hit | < 100ms | 20g T-E3 spec | IMemoryCache 5min TTL 命中场景 |
| 后端 cache hit | < 10ms | 20h T-E2 unit test | `DashboardBigscreenAppService_Tests.GetSnapshot_CacheHit_Should_ReturnUnder10Milliseconds` |
| 后端 cache miss mock | < 50ms | 20h T-E2 unit test | `BuildMockSnapshot` 每次 new 8 List + 50 sub-DTO / mutable class 模式 |
| 后端 cache miss real | < 500ms | 顺延 20i+ | 8 aggregator 真接通 + DB round-trip 实测 / 需 host + auth + DB |

---

## 一、Unit test 实测路径（20h 已完成）

### 1.1 `GetSnapshot_CacheHit_Should_ReturnUnder10Milliseconds`

- 测量：100 次 GetSnapshotAsync 循环 / 平均耗时 / 阈值 10ms
- 实际：< 1ms / 加 9ms buffer 防 CI 慢机器抖动
- 验证：`IMemoryCache.TryGetValue + return cached` 路径性能

### 1.2 `GetSnapshot_CacheMiss_Mock_Should_ReturnUnder50Milliseconds`

- 测量：100 次 cache.Remove → GetSnapshotAsync 循环
- 实际：< 0.1ms / 加 49.9ms buffer 防机器抖动
- 验证：`BuildMockSnapshot` mutable class new 模式（20g T-E4 P2-3 文档化）
- 决策：**不优化为 static cached object**（引用共享 bug 风险 >> 微小性能收益）

---

## 二、真实环境压测（20h 受限 / 顺延 20i+）

### 2.1 当前实测受限

- **host binary 旧**：PID 74004 是 19s 时（24h+ 前）启动的 / 不含 19t b486dda 加的 `DashboardBigscreenController`
- **auth 拦截**：endpoint 加了 `[Authorize]`（main 20f 防御性立修 BusinessReportsController class 级 + Dashboard 类似模式）/ anonymous 请求 302 跳 /Account/Login
- **DB 数据 mock**：业务方反馈未到位 / dashboard `Dashboard:UseMock=true` 默认 / 真接通顺延

### 2.2 真实压测 SOP（顺延 20i+）

1. 重启 host：`dotnet run --project src/SupplyCores.Web --no-build`
2. 切配置 `Dashboard:UseMock=false`（appsettings.Development.json）
3. cookie auth login：`POST /Account/Login` admin / 1q2w3E*
4. 测时延：`curl --cookie cookie.txt -w "%{time_total}s" /api/supply-cores/dashboard/bigscreen`
5. 阈值：cache hit < 100ms / cache miss real < 500ms
6. Hangfire 调度后 cache 自动 warm（每 5min）/ 实际请求几乎全 cache hit

---

## 三、Regression 触发条件（监控）

- unit test 失败 → 性能 regression 立修
- 前端 e2e spec 失败（场景 3 性能 baseline）→ 检查 backend 真接通进度
- 真实环境 cache hit > 500ms → 检查 IMemoryCache 配置 / Hangfire job 健康
- 真实环境 cache miss real > 2s → 检查 DB 索引 / 8 aggregator EF Core query plan

---

## 四、改进路线（20i+）

1. **真实环境压测** — host restart + auth + DB seed / 实测真接通性能
2. **EF Core query 优化** — `AggregateHighSensitiveAsync` 3 个 ToListAsync 可改 SQL union all 单 query（20g self-review P2-1 顺延）
3. **DB 索引** — `InterfaceReceipt.ReceiptTime` + `ReportAlert.AlertState` + `DemandRequest.PlanPeriod` 等聚合查询索引
4. **immutable record types** — `BuildMockSnapshot` mutable class → immutable record + 复制器（20g T-E4 P2-3 顺延）

---

**second 主代理 e 签名**：2026-05-17 20h T-E2 完成
