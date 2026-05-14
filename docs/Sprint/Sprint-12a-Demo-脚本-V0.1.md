# Sprint 12a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 12a 验收演示脚本
**配套：** [`Sprint-12a-任务卡-V0.1.md`](./Sprint-12a-任务卡-V0.1.md) + [`Sprint-12a-Day3-5-详设12-设计-V0.2.md`](./Sprint-12a-Day3-5-详设12-设计-V0.2.md)

---

## 一、Sprint 12a 落地范围

按 V0.1 起步 + 主线持续工作（Day 3-5 V0.2 cici 锁版 + Day 6 V0.1 倾向），本 Sprint 实际交付 **~7 PD**：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D1 | Sprint 11a 全产物 contract 守护测试（防 P1+P2-高严重 回退） | `f2436f5` / `d208fd4` | a |
| D1-2 | 4 P1 修复（α-1 Orchestrator scope / α-2 ContractTool scope / β-1 detector 扩窗 / γ FakeTool）+ 4 P2-高严重（P2-4/5/6/7） | `21846a2` / `0421b11` / `d2be1d0` | a |
| D1-2 | Sprint 12a 全产物 contract 守护测试 + Codex 11a 10/10 评审 §七 附录 | `ddb8534` / `20a567d` | a |
| D1-2 | P2-9 LLM provider 审计复合名 + P2-10 失败 attempt 审计 + P2-2 retry 清旧 voucher | `6c76963` / `0f49ad5` | a |
| **D3-1** | r.alert_aggregate_daily 维度表 + Wave 76 + 30 天 backfill SQL | `43fbab6` | a |
| **D3-2** | AlertAggregateDailyAggregator + Hangfire 02:00 注册 | `0c7b2e4` | a |
| **D3-3** | ReportAggregatorAppService 4 endpoint（GetDailyTrend / GetWeeklyTrend / GetOrgRanking / GetTypeDistribution） | `0c7b2e4` | **b** (子代理并行) |
| **D4-1** | SelfServiceReportAppService 自助报表（4 维度 + 4 measure 白名单 + Filters 精确等值） | `1f63c25` | a |
| **D4-2** | ReportExportAppService Excel 导出（ClosedXML 0.105.0） | `75c63b1` | a |
| **D5-1** | Wave 76 EFCore.Tests 守护 + Cron 注册 Smoke + 12+ 守护测试 | `f871986` | a |
| **D6-1/6-2** | AiTokenUsageDaily 实体 + Wave 77 + Aggregator + Hangfire 02:10 注册 | `e631b48` | a |
| **D6-3** | AiTokenUsageQueryAppService Token dashboard 4 endpoint | `e631b48` | a |
| **D6-4** | 异常监控 stub（阈值 100K Token + LogWarning + 邮件 stub） | `881afdd` | a |
| D7-8 | V0.1 §一D 评估（DefaultSafetyStockThreshold Sprint 11a D8-2 已保留 const）；P2-1/P2-8 范围扩展顺延 13a | — | — |
| **D9** | Sprint12aReportAggregator_E2E（详设 12 全链路 + 详设 11 Token 全链路） | `8ee346e` | a |
| D10 | Demo-12a + Sprint-13a 草案 | 本文档 | a |

**测试基线演进**：
- Sprint 11a D9 收尾：**1262**（Domain 766 / Application 471 / EFCore 19 / Web 6）
- Sprint 12a Day 1-2 守护落地后：**1306**（+44）
- **Sprint 12a Day 10 完成**：**1359**（Domain 793 / Application 536 / EFCore 24 / Web 6 · +97 较 Sprint 11a 收尾）

---

## 二、Demo 演示路径（建议顺序）

### 路径 A：4 P1 修复链路验证（5 分钟）

1. **跨 Org 数据泄露 P1-α-1** — 启动 LLM Advisor，模拟问"查本月所有 Org 预警"
   - 期望：仅返回 caller 所在 Org alert，跨 Org 拒绝
   - 守护：`AdvisorOrchestrator` 透传 `ToolCallContext.CallerOrgId` 强制覆盖 LLM 给的 args.orgId
2. **越权合同详情 P1-α-2** — LLM 调 `get_contract_details` 指定他 Org 的 contractId
   - 期望：返回"不在您的数据范围内"
   - 守护：`GetContractDetailsTool` 校验 `c.OrgId == context.CallerOrgId`
3. **5 Detector dedup P1-β-1** — 跑 R-04~R-08 Detector 多次
   - 期望：所有 Pending alert dedup（与 Wave 74 partial unique index 语义对齐）

### 路径 B：详设 12 报表统计完善（10 分钟）

1. **30 天历史回填** — Wave 76 migration up 后查 `r.alert_aggregate_daily`
   - 期望：含最近 30 天聚合数据 + org_id=0 集团合计行
2. **Hangfire 02:00 DailyAggregator** — 触发 manual run（dev 工具）
   - 期望：聚合昨日 r.report_alert → 维度表，idempotent 重跑不重复
3. **4 endpoint dashboard** — POST GetDailyTrend / GetOrgRanking / GetTypeDistribution / GetWeeklyTrend
   - 期望：日趋势补 0 / Top 10 Org / GROUP BY 类型分布 / ISO 周
4. **自助报表 SelfServiceReport** — 多维度组合（day + alert_code 二维）
   - 期望：动态分组聚合，非法维度 fail（白名单 4 维度 + 4 measure）
5. **Excel 导出** — Excel 导出 GetDailyTrend → 用 Office / 在线打开
   - 期望：表头加粗 + 数据行 + 列宽自适应

### 路径 C：详设 11 Token 监控完善（5 分钟）

1. **Wave 77 + DailyAggregator** — 查 `a.ai_token_usage_daily` 表
   - 期望：聚合粒度 day × org_id × tool_name + 集团合计行
2. **Token dashboard 4 endpoint** — GetDailyTrend / GetTopTools / GetOrgRanking / GetCostEstimate
   - 期望：Token 用量趋势 / Top N Tool 排行 / Org 排行（排除集团合计行）/ 时间窗成本汇总
3. **异常监控 stub** — 模拟当日 Token 用量 > 100K
   - 期望：log warning + stub 邮件占位（Sprint 13a 看板期接 R-09 + SMTP）

---

## 三、验收要点

| # | 验收项 | 状态 |
|---|---|---|
| 1 | Codex 11a 评审 10/10 完成 + §七 附录 | ✅ |
| 2 | 4 P1 修复（α-1/α-2/β-1/γ）+ 守护测试 | ✅ |
| 3 | 5 P2-高严重修复（P2-2/4/5/6/7/9/10）| ✅ |
| 4 | 详设 12 报表统计完善（V0.2 锁版 6 task）| ✅ |
| 5 | 详设 11 Token 监控完善（DailyAggregator + 4 endpoint + 异常监控）| ✅ |
| 6 | 集成 E2E 2 个 | ✅ |
| 7 | 基线 ≥ 1300（实际 1359）| ✅ |
| 8 | 累计技术债 P2-1/P2-8 顺延 Sprint 13a | ✅ |

---

## 四、Sprint 12a 收益总结

- **跨 Org 数据安全** — Tool 调用强制透传 caller scope，根除 LLM args.orgId 信任路径
- **审计完整性** — jsonb 列 wrap、LLM 失败 attempt 审计、provider 复合名定位真实来源
- **报表统计能力** — r.* 跨域聚合 + 自助报表 + Excel 导出（详设 12 完整闭环）
- **Token 监控** — Token 用量趋势 + Top N + 成本预估（详设 11 §一B 完整闭环）
- **基线增长 +97** — 1262 → 1359（Domain +27 / Application +65 / EFCore +5）

---

## 五、Sprint 13a 候选范围

详 [`Sprint-13a-任务卡-V0.1.md`](./Sprint-13a-任务卡-V0.1.md)（草案）。

主要方向：
1. **详设 10 权限审批流**（60 PD 后端 + 45 前端）— 20 类审批模板 + 21 高敏感拦截器
2. **详设 08 NC 接口 联调**（47 + 229 PD）— 业务大头中的大头
3. **详设 09 看板 6 类**（22 PD 后端，看板期接 R-09 + PDF 导出）
4. **累计技术债**：P2-1（MonthlyPrepayment idempotent）+ P2-8（PaymentExecution Paid shortcut）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — Sprint 12a 收尾 Demo 脚本 + Sprint 13a 草案候选 |
