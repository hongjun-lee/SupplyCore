# Sprint 12a Day 3-5 详设 12 报表统计完善 — 实施设计（V0.2 锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（cici 锁版 · 2026-05-14）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 12a Day 3-5 实施细化设计
**配套：** [`Sprint-12a-任务卡-V0.1.md`](./Sprint-12a-任务卡-V0.1.md) §一C 候选 1
**衔接：** Sprint 11a Day 4-7（r.alert_log / R-04~R-08 Detector / SY-02 Org Scope）已落地 — 本期基于稳定的 r.* 表做跨域聚合 + 自助报表 + Excel 导出

---

## 一、范围（D3-1 ~ D5-1，~3.0 PD · V0.2 锁版砍 PDF 顺延 Sprint 13a）

| Day | Task | 工时 | 说明 |
|---|---|---|---|
| D3-1 | r.alert_aggregate_daily 维度表 schema 设计 + Wave 76 migration（含 30 天历史回填）| 0.7 PD | 三维聚合（day / org_id / alert_code / source_bill_type），复合索引（day, org_id, alert_code）；Wave 76 含 30 天 backfill SQL |
| D3-2 | `AlertAggregateDailyAggregator` Hangfire 02:00 任务（聚合昨日 r.alert_log → 维度表）| 0.5 PD | 含 org_id=0 集团合计行；IRecurringJobManager 注册（Satellite Pattern）|
| D3-3 | `ReportAggregatorAppService` 4 endpoint | 0.8 PD | GetDailyTrend / GetWeeklyTrend / GetOrgRanking / GetTypeDistribution |
| D4-1 | `SelfServiceReportAppService` 自助筛选 endpoint | 0.5 PD | multi-dim filter + groupBy（**限 4 维度 + 4 measure**，不支持 OLAP 自定义 SQL）|
| D4-2 | Excel 导出（ClosedXML）| 0.4 PD | RFC 4180 兼容 CSV 兜底；header 用 SY-02 国际化 |
| ~~D4-3~~ | ~~PDF 导出（QuestPDF）~~ | ~~0.5 PD~~ | **V0.2 砍 — 顺延 Sprint 13a 看板期复用 Org logo 管理** |
| D5-1 | 测试 ≥ 11（聚合 / 导出 / 跨域 join 性能 / backfill）| 0.3 PD | 含 1 个 1k 行级 perf smoke + 1 个 backfill smoke |

**合计 ~3.0 PD**（V0.2 锁版砍 PDF 0.5 PD，节省工时转 D7-8 P3 扫尾或 Sprint 13a）

---

## 二、Schema 设计（D3-1）

### 2.1 r.alert_aggregate_daily 维度表

```sql
CREATE TABLE r.alert_aggregate_daily (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    day                 DATE NOT NULL,                    -- 聚合日期（00:00 计入）
    org_id              BIGINT NOT NULL,                  -- 组织（含 0 = 集团合计）
    alert_code          VARCHAR(20) NOT NULL,             -- R-04 / R-05 / R-06 / R-07 / R-08
    source_bill_type    VARCHAR(20) NOT NULL,             -- C-08 / C-04 / C-02 / C-12 / I-02 / I-03
    total_count         INT NOT NULL DEFAULT 0,           -- 当日新增预警数
    pending_count       INT NOT NULL DEFAULT 0,           -- 当日新增中未处理
    handled_count       INT NOT NULL DEFAULT 0,           -- 当日新增中已处理
    ignored_count       INT NOT NULL DEFAULT 0,           -- 当日新增中已忽略
    creation_time       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_modification_time TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_alert_aggregate_daily UNIQUE (day, org_id, alert_code, source_bill_type)
);

CREATE INDEX idx_alert_aggregate_daily_query
    ON r.alert_aggregate_daily (day DESC, org_id, alert_code);
```

**关键决策**：
- **预聚合**而非实时 join：万行级 r.alert_log 直接 GROUP BY day/org_id 在 R-04~R-08 持续累积下性能差。维度表预存避免实时聚合。
- **org_id = 0 表示集团合计**：业务上"集团级 dashboard"需求频繁，避免每次查询时 SUM 所有子公司。
- **day 用 DATE** 而非 TIMESTAMP：聚合粒度日级，对齐 Hangfire 每日 02:00 任务。
- **status 4 列拆分**：而非单 JSONB 字段 — 三维聚合查询（按 alert_code 分组求 pending_count）走索引快。

### 2.2 实体类（Domain）

```csharp
namespace Nova.SupplyCores.ReportAlerts;

public class AlertAggregateDaily : AuditedAggregateRoot<long>
{
    public DateOnly Day { get; set; }
    public long OrgId { get; set; }
    public string AlertCode { get; set; } = "";
    public string SourceBillType { get; set; } = "";
    public int TotalCount { get; set; }
    public int PendingCount { get; set; }
    public int HandledCount { get; set; }
    public int IgnoredCount { get; set; }
}
```

继承 `AuditedAggregateRoot<long>` 跟随项目基类约定（snake_case）。

---

## 三、Hangfire DailyAggregator（D3-2）

### 3.1 AlertAggregateDailyAggregator（Domain）

```csharp
namespace Nova.SupplyCores.ReportAlerts;

public class AlertAggregateDailyAggregator : ITransientDependency
{
    private readonly IRepository<ReportAlert, long> _alertRepo;
    private readonly IRepository<AlertAggregateDaily, long> _aggRepo;
    private readonly IClock _clock;
    private readonly ILogger<AlertAggregateDailyAggregator> _log;

    public async Task AggregateAsync(DateOnly day, CancellationToken ct = default)
    {
        var start = day.ToDateTime(TimeOnly.MinValue);
        var end = start.AddDays(1);

        // 1. SUM by (org_id, alert_code, source_bill_type) — 含 org_id = 0 集团合计
        var query = await _alertRepo.GetQueryableAsync();
        var grouped = await query
            .Where(a => a.AlertTime >= start && a.AlertTime < end)
            .GroupBy(a => new { a.OrgId, a.AlertCode, a.SourceBillType })
            .Select(g => new {
                g.Key.OrgId,
                g.Key.AlertCode,
                g.Key.SourceBillType,
                Total = g.Count(),
                Pending = g.Count(a => a.AlertState == "待处理"),
                Handled = g.Count(a => a.AlertState == "已处理"),
                Ignored = g.Count(a => a.AlertState == "已忽略"),
            })
            .ToListAsync(ct);

        // 2. 写维度表 — UpsertAsync(uk_alert_aggregate_daily)
        foreach (var row in grouped) { /* InsertOrUpdate */ }

        // 3. org_id = 0 集团合计行（额外 SUM 所有 org）
        var groupTotal = grouped.GroupBy(r => new { r.AlertCode, r.SourceBillType }).Select(g => ...);
        // 写集团合计行

        _log.LogInformation("[AlertAggregateDaily] {Day} 聚合完成：{Count} 行", day, grouped.Count);
    }
}
```

### 3.2 Hangfire 注册（Application Module）

```csharp
// NovaSupplyCoresApplicationModule.OnApplicationInitialization
var recurring = context.ServiceProvider.GetRequiredService<IRecurringJobManager>();
recurring.AddOrUpdate<AlertAggregateDailyAggregator>(
    "alert-aggregate-daily",
    j => j.AggregateAsync(DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-1)), CancellationToken.None),
    Cron.Daily(2, 0));  // 每日 02:00 聚合昨日
```

**注意**：按 memory `feedback_team_naming_convention.md` 中 Satellite Pattern + Sprint 11a Day 7 R-04 dedupe 接通经验，**RecurringJobHandlers 必须放 `modules/nova.supplycores/`** 而非 SupplyCores.Web。

---

## 四、ReportAggregatorAppService 4 endpoint（D3-3）

### 4.1 接口签名（Application.Contracts）

```csharp
public interface IReportAggregatorAppService : IApplicationService
{
    Task<List<AlertDailyTrendDto>> GetDailyTrendAsync(GetDailyTrendInput input);
    Task<List<AlertWeeklyTrendDto>> GetWeeklyTrendAsync(GetWeeklyTrendInput input);
    Task<List<OrgRankingDto>> GetOrgRankingAsync(GetOrgRankingInput input);
    Task<List<TypeDistributionDto>> GetTypeDistributionAsync(GetTypeDistributionInput input);
}
```

| Endpoint | Input | Output | SQL 粗略 |
|---|---|---|---|
| **GetDailyTrend** | (start, end, orgId?, alertCode?) | List<{day, total, pending}> | SUM by day（命中 idx_alert_aggregate_daily_query）|
| **GetWeeklyTrend** | (weekStart, weekCount, orgId?) | List<{week, total, pending}> | SUM by date_trunc('week', day) |
| **GetOrgRanking** | (start, end, top=10) | List<{orgId, orgName, total}> ORDER BY total DESC | JOIN m.org + SUM by org_id |
| **GetTypeDistribution** | (start, end, orgId?) | List<{alertCode, total, pending}> | SUM by alert_code |

### 4.2 关键决策

- **Org Scope 强制透传**（Sprint 12a P1-α 同模式）：所有 endpoint Input.OrgId 必须先经 caller 权限校验，禁止裸 LLM/前端传值穿透。
- **复用 SY-02 阈值**：DefaultDaysWindow = `GetIntForOrg("REPORT_DEFAULT_DAYS_WINDOW", 30, orgId)`。
- **Authorization Policy**：`[Authorize(SupplyCoresPermissions.Reports.Aggregator)]` — Sprint 13a 权限模块待。

---

## 五、自助报表（D4-1）+ 导出（D4-2/D4-3）

### 5.1 SelfServiceReportAppService（D4-1，0.5 PD）

```csharp
public class SelfServiceReportRequest
{
    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }
    public List<string> Dimensions { get; set; } = new();  // {"day","org_id","alert_code","source_bill_type"}
    public Dictionary<string, string> Filters { get; set; } = new();
    public List<string> Measures { get; set; } = new();    // {"total","pending","handled"}
}
```

**简化范围**：仅 4 维度 + 4 measure，**不做** OLAP 通用引擎。后续 Sprint 13a 看是否需要。

### 5.2 Excel 导出（D4-2，ClosedXML 0.4 PD）

- 包：`ClosedXML.Excel` 0.105.x（行业 OSS，MIT 协议）
- 模式：StreamingExportWorker 异步导出（万行级避免阻塞 HTTP）
- 文件存 ABP BlobStorage（按 Sprint 6b D-09 附件存储模式）+ 返回 download token

### 5.3 ~~PDF 导出（D4-3）~~ — V0.2 砍掉 顺延 Sprint 13a

cici V0.2 锁版决策：仅 Excel 一期，PDF 顺延 Sprint 13a 看板期复用 Org logo 管理。节省 0.5 PD。

---

## 六、测试矩阵（D5-1，~0.3 PD，≥ 11 个）

| # | 测试 | 类型 | 关键断言 |
|---|---|---|---|
| 1 | AggregatorDay_Should_Sum_By_OrgCodeBillType | Domain | 维度表 row 数 = GROUP BY 唯一组合数 |
| 2 | AggregatorDay_Should_Generate_Group_Total_Row | Domain | org_id=0 行存在且 total = SUM(子公司) |
| 3 | AggregatorDay_Should_Be_Idempotent | Domain | 重跑同 day 不产生重复行（UK 约束）|
| 4 | GetDailyTrend_Should_Return_Window | Application | 范围内日期连续，缺失天补 0 行 |
| 5 | GetOrgRanking_Should_Order_By_Total_Desc | Application | TOP 10 DESC + 含 org_name JOIN |
| 6 | GetTypeDistribution_Should_Include_All_5_Alert_Codes | Application | R-04~R-08 全覆盖即使当日 0 行 |
| 7 | SelfServiceReport_Should_Filter_By_Org_Scope | Application | 跨 Org 数据隔离（同 Sprint 12a P1-α 模式）|
| 8 | ExcelExport_Should_Stream_10k_Rows | Performance | 1 万行 < 5 秒导出完成 |
| 9 | AlertAggregateDaily_Migration_Wave76 | EFCore.Tests | 表存在 + UK + 索引齐 + 30 天 backfill seed |
| 10 | Wave76_Backfill_Should_Populate_30_Days | EFCore.Tests | backfill 后维度表含最近 30 天聚合行 |
| 11 | AggregatorDay_Cron_Should_Be_Registered | Smoke | RecurringJobHandlers 注册 "alert-aggregate-daily" |
| 12 | GetDailyTrend_Should_Respect_Caller_Org_Scope | Security | LLM 传 orgId 跨域时 fail（同 P1-α-1 守护）|

**基线增量**：1310 → ~1322（+12）

---

## 七、风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 跨域 r.alert_log JOIN m.org 万行级性能差 | 中 | 维度表预存（D3-1），实时查询走维度表不走原表 |
| 2 | DailyAggregator 跨 0:00 时区问题 | 中 | UTC 存储 + 业务展示用 SY-02 Org Scope 时区 |
| 3 | ClosedXML / QuestPDF 包大小膨胀 | 低 | 仅 Web Host 引入，业务模块不依赖 |
| 4 | PDF 导出 Org logo 占位 stub 影响生产 | 低 | V0.1 占位 stub，Sprint 13a 看板时统一引入 logo 管理 |
| 5 | 自助报表 OLAP 范围易蔓延 | 中 | V0.1 限 4 维度 + 4 measure，扩展进 V0.2 评审 |

---

## 八、决策点（V0.2 cici 锁版 · 2026-05-14）

| # | 决策点 | V0.1 倾向 | **V0.2 锁版** | 影响 |
|---|---|---|---|---|
| 1 | 详设 12 完善 vs 详设 13 招采升级 | 先 12 完整闭环 | ✅ **先详设 12 完整闭环** | 详设 13 进 Sprint 13a 独立 |
| 2 | Excel + PDF 都做 vs 仅 Excel | 都做 | ✅ **仅 Excel 一期，PDF 顺延 Sprint 13a 看板期** | 砍 0.5 PD（PDF）转 D7-8 P3 扫尾 |
| 3 | DailyAggregator 是否含 org_id=0 集团合计行 | 含（业务必需）| ✅ **含集团合计行**（org_id=0）| 集团 dashboard 查询不需 SUM 子公司 |
| 4 | SelfServiceReport 是否支持 OLAP 自定义 SQL | 不支持（V0.1 限 4 维度）| ✅ **不支持** OLAP 自定义 SQL | V0.1 限 4 维度 + 4 measure；Sprint 13a 看板期评估业务真实需求 |
| 5 | 维度表是否回填历史数据 | 不回填 | ✅ **30 天回填** | dashboard 上线即可看 1 个月趋势，+0.2 PD（D3-1 加 backfill SQL）|

---

## 九、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 范围（7 task ~3.5 PD）+ schema 设计 + 4 endpoint + 测试矩阵 + 5 决策点 |
| V0.2 | 2026-05-14 | **cici 锁版** — 砍 D4-3 PDF（0.5 PD 顺延 Sprint 13a 看板期）；D3-1 加 30 天 backfill（+0.2 PD）；明确含 org_id=0 集团合计行；明确不支持 OLAP 自定义 SQL；锁先 12 后 13；合计 3.5 → 3.0 PD |
