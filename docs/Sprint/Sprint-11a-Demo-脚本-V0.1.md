# Sprint 11a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 11a 验收演示脚本
**配套：** [`Sprint-11a-任务卡-V0.2.md`](./Sprint-11a-任务卡-V0.2.md)

---

## 一、Sprint 11a 落地范围

按 V0.2 锁版 6 决策点（1B / 2A / 3A / 4B / 5B / 6A），本 Sprint 实际交付 **10 PD**：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D1 | P1-1 PaymentRequest.RefundPayment 接受 Approved + P1-2 Contract.SubtractPayment demote + Complete 阈值复算 | `228146b` | a |
| D1 | P1-3 月末 batch 排除已 push 的 C-08 + P1-6 BatchDetails 覆盖检查 + P2-10 失败 batch 不写 voucher | `ce487a1` | a |
| D2 | **P1-4 路线 A** 删 MarkPaidAsync 重复 C-07.ApplyPayment + P1-5 非 Approved C-08 throw | `5c7f5e3` | a |
| D3 | Lift Catio IAiTool + ToolResult + AiToolAttribute + ToolRegistry + ListReportAlertsTool | `2b03bb0` | a |
| D4 | AdvisorOrchestrator 多轮 Tool 调用编排 + SystemPromptBuilder | `6932d37` | a |
| D5 | AiCallLog Manager + GetSystemConfigTool + GetContractDetailsTool | `968a3da` | a |
| D6 | AiCallLog Token 字段（Wave 72）+ Orchestrator 接审计 + Token 用量 AppService + Real LLM 集成测试 | `d1a40cb` | **a + b + c** |
| D7 | SY-02 Org Scope GetIntForOrg/GetDecimalForOrg + Wave 73 Seed 示例 | `c4b7708` | a |
| D8 | Wave 74 r.report_alert partial unique index + DefaultSafetyStockThreshold 决策留痕 + E-13 接通 + reconciliation schema 守护 | `9334138` | **a + b + c** |
| D9 | Sprint11aLlmOrchestration_E2E + Sprint11aSY02OrgScope_E2E + Hangfire 测试更新 | `d624cea` | **a + b** |
| D10 | Demo-11a + Sprint-12a 草案 + Codex 评审提醒 | 本文档 | a + b |

**测试基线演进**：
- Sprint 10a D9 收尾：**1189**（Domain 757 / Application 414 / EFCore 12 / Web 6）
- Sprint 11a D1-D2 P1 修复完：1189 → 1202（+13）
- Sprint 11a D3-D5 Tool 编排基础：1202 → 1232（+30）
- Sprint 11a D6 Token 监控：1232 → 1240（+8）
- Sprint 11a D7 SY-02 Org Scope：1240 → 1246（+6）
- Sprint 11a D8 P2 技术债：1246 → 1254（+8）
- **Sprint 11a D9 集成 E2E：1254 → 1262**（+8）
- 全 Sprint 总测试增量：**1189 → 1262（+73）**

**协同节奏（Sprint 8a/9a/11a 三次验证）**：
- D6 三轨并行（a + b + c）✓ — Token 监控（a）+ Token AppService（b）+ Real LLM 测试（c）
- D8 三轨并行 ✓ — Wave 74（a）+ E-13 接通（b 工作超时已留 memory）+ reconciliation 守护（c）
- D9 双轨并行 ✓ — LlmOrchestration E2E（a）+ SY02OrgScope E2E（b 工作时间 80% of a，符合 memory `feedback_subagent_workload_calibration`）

**Codex 评审延后**：Pro quota Sprint 11a 期间未触顶，9 commits 顺延 Sprint 12a Day 1-2（分批跑，沿用 Sprint 11a Day 1 策略）。

---

## 二、回归用例（Sprint 1-10 已落 64 项）

承接 Sprint-10a-Demo 共 64 项。本期新增 Sprint 11a 11 项（用例 65-75）。

---

## 三、Sprint 11a 新增 Demo 用例（65-75）

### 用例 65：P1-1 PaymentRequest 失败 path 接通（已审 → 支付退回）⭐ Codex P1 修复

NC BIZ-PAY 推送失败回执场景，C-08 仍在 `已审`：

```csharp
var request = new PaymentRequest { ... };
request.Submit();
request.Approve(99L);
// NC 推送失败 / 财务撤回 → 直接退回（无需走 MarkPaid → Refund 两步）
request.RefundPayment("NC BIZ-PAY 推送失败");

// 期望：
request.ApprovalState.ShouldBe(PaymentRequestStates.Refunded);
request.PaidTime.ShouldBeNull();  // 已审退回未实付
request.RefundedAmount.ShouldBe(30000m);
```

详设 §4.8 文档化路径接通；AppService 编排前判 `wasPaid = ApprovalState == Paid` 决定是否反向扣 C-02。

### 用例 66：P1-2 退款减额跌破阈值自动 demote + Complete 阈值复算 ⭐ Codex P1 修复

```csharp
var c = NewExecutingContract(100000m);
c.AddPayment(96000m);  // 96% > 95%
c.MarkReadyForCompletion(...);  // → ReadyForCompletion

c.SubtractPayment(2000m);  // 94000 < 95%
c.ContractState.ShouldBe(ContractStates.InExecution);  // 自动 demote
Should.Throw<BusinessException>(() => c.Complete()).Code
    .ShouldBe("SupplyCores:Contract:PaidAmountBelowCompletionThreshold");
// 防止 InExecution 直跳 Complete 也走阈值校验（双层防御）
```

### 用例 67：P1-3 月末 batch 排除已 push 的 C-08 ⭐ Codex P1 修复

```csharp
// 当 C-08 在 Approve 时已通过 BIZ-PAY 单笔 push（InterfacePushState=推送成功）
var pushed = CreateApprovedRequest(...);
pushed.InterfacePushState = PaymentRequestInterfaceStates.Success;
var notPushed = CreateApprovedRequest(...);

var summaries = await _sut.GenerateAsync(...);
summaries.Count.ShouldBe(1);  // 仅 notPushed 进 batch，避免重复推 NC + 覆盖 NcVoucherNo
```

### 用例 68：P1-6 BatchDetails 部分确认降级 PartialSuccess ⭐ Codex P1 修复

```csharp
// NC 仅返回 2/3 个 ItemIds 的 BatchDetails，全部 Success
_nc.PushAsync(...).Returns(new NcPushResult {
    BatchDetails = new List<NcBatchItemResult> {
        new() { ItemId = c08Ids[0], Success = true },
        new() { ItemId = c08Ids[1], Success = true },
        // c08Ids[2] 未返回 — NC 部分确认
    },
});

await _sut.PushToPaymentAsync(summaryId);
// P1-6: 未覆盖全部 IncludedRequests → 降级 PartialSuccess（不再误标 AllSuccess）
summary.InterfacePushState.ShouldBe(MonthlyPrepaymentSummaryInterfaceStates.Failed);
summary.NcVoucherNo.ShouldBeNull();  // P2-10: 失败 batch 不写 voucher
```

### 用例 69：P1-4 路线 A 删 MarkPaidAsync 重复 C-07 累计 ⭐ V0.2 决策点 6A

```csharp
// Approve 时 C-07 已扣（PaymentRequestAppService.ApproveAsync line 121）
// MarkPaid 不再调 plan.ApplyPayment（防双扣）
var beforeCumulative = _plan.CumulativePaidAmount;
await _sut.MarkPaidAsync(executionId, new MarkPaidPaymentExecutionDto { TotalAmount = 30000m });

_plan.CumulativePaidAmount.ShouldBe(beforeCumulative);  // 不再累加（路线 A）
_contract.PaidAmount.ShouldBe(beforePaidAmount + 30000m);  // C-02 在 MarkPaid 时累加（语义一致）
```

reconciliation F-2 公式注释修订：`C-07 = SUM(C-08.RequestAmount WHERE state ∈ {Approved, Paid, Refunded})`。

### 用例 70：P1-5 非 Approved C-08 throw + Paid 幂等 skip ⭐ Codex P1 修复

```csharp
// 草稿 / 待审 / 已驳回 / 已退 → throw
[Theory] [InlineData(Draft)] [InlineData(PendingReview)] [InlineData(Rejected)] [InlineData(Refunded)]
public async Task MarkPaidAsync_When_Request_NotApproved_Should_Throw(string nonApprovedState) {
    typeof(PaymentRequest).GetProperty("ApprovalState")!.SetValue(_request, nonApprovedState);
    await Should.ThrowAsync<BusinessException>(() => _sut.MarkPaidAsync(...))
        .Code.ShouldBe("SupplyCores:PaymentExecution:InvalidRequestState");
}

// Paid → 幂等 skip 提前 return（不重复扣 C-02）
typeof(PaymentRequest).GetProperty("ApprovalState")!.SetValue(_request, Paid);
await _sut.MarkPaidAsync(...);
_contract.PaidAmount.ShouldBe(beforePaidAmount);  // 未重复累加
```

### 用例 71：Lift Catio Tool 编排基础（IAiTool + ToolRegistry）⭐ V0.2 决策点 1B

```csharp
[AiTool("list_report_alerts", "查询报表预警列表...")]
public class ListReportAlertsTool : IAiTool, ITransientDependency {
    public Task<ToolResult> ExecuteAsync(JsonElement parameters, CancellationToken ct) {
        // 按 alertCode/orgId/maxResults 过滤 R-04~R-08 待处理 alert
        // 返回 ToolResult.Ok(new { count, alerts, filter })
    }
}

// Module 反射自动扫描 + 注册：
ConfigureAiTools(services);  // typeof(IAiTool).IsAssignableFrom(t) → services.AddTransient(typeof(IAiTool), t)

var registry = new ToolRegistry(tools, log);
registry.Count.ShouldBe(3);  // list_report_alerts / get_system_config / get_contract_details
```

### 用例 72：AdvisorOrchestrator 多轮 Tool 协同 + AiCallLog 审计 ⭐ Day 9 E2E

```csharp
// 轮 1: LLM 调 list_report_alerts
responses.Enqueue(LlmToolCall("list_report_alerts", "{}"));
// 轮 2: LLM 调 get_system_config 查阈值
responses.Enqueue(LlmToolCall("get_system_config", """{"configKey":"PAYMENT_DUE_ALERT_DAYS"}"""));
// 轮 3: LLM 调 get_contract_details 查关联合同
responses.Enqueue(LlmToolCall("get_contract_details", """{"contractId":200}"""));
// 轮 4: LLM 综合给建议
responses.Enqueue(LlmText("合同 CT-001 已付 50%，建议立即支付。"));

var ans = await sut.RunAsync("采购付款助手", "处理本月 R-04 预警");

ans.Suggestion.ShouldContain("CT-001");
ans.Evidence.Count.ShouldBeGreaterThanOrEqualTo(3);  // 3 Tool 调用入 Evidence
ans.Confidence.ShouldBe(0.9m);  // OrchestrationConfidence (高于单 Tool 0.85)

// 审计：2 LLM 调用 + 3 Tool 调用 共享同 TraceId
await audit.Received(2).LogLlmCompleteAsync(...);
await audit.Received(3).LogToolCallAsync(...);
```

5 轮 Tool 调用上限 → 兜底 MockStub（IsFallback=true / Confidence=0.3）。
`OperationCanceledException` 上抛（Sprint 10a P2-8 教训）。

### 用例 73：AiCallLog Token 用量监控 + Wave 72 新字段

```csharp
// Wave 72 — a.ai_call_log 加 prompt_tokens / completion_tokens / total_tokens / trace_id 4 字段
// AdvisorOrchestrator 每轮 LLM 调用后写入：

await _auditLog.LogLlmCompleteAsync(
    providerName: "deepseek",
    callerUserId: userId,
    callerOrgId: orgId,
    inputParams: requestJson,
    outputSummary: respContent,
    callDurationMs: 850,
    success: true,
    errorCode: null,
    promptTokens: resp.Usage.PromptTokens,
    completionTokens: resp.Usage.CompletionTokens,
    totalTokens: resp.Usage.TotalTokens,
    traceId: traceId);

// AiCallLogQueryAppService.GetTokenUsageStatsAsync 聚合查询：
var stats = await _sut.GetTokenUsageStatsAsync(new GetTokenUsageStatsInput {
    StartDate = ..., EndDate = ..., OrgId = 100, TargetPrefix = "llm:" });
// 返回 TotalCalls / TotalPromptTokens / Breakdown(Top 10) 等
```

### 用例 74：SY-02 Org Scope 端到端 ⭐ V0.2 决策点 3A 显式参数

```csharp
// 全局=7 / Org 100 override=14 / Org 200 override=21
_store.Add(NewEntry(SystemConfigConsts.Keys.PaymentDueAlertDays, "7", Int));
_store.Add(NewOrgEntry(SystemConfigConsts.Keys.PaymentDueAlertDays, "14", orgId: 100, Int));
_store.Add(NewOrgEntry(SystemConfigConsts.Keys.PaymentDueAlertDays, "21", orgId: 200, Int));

// 三 Org 独立解析：
_sut.GetIntForOrg(SystemConfigConsts.Keys.PaymentDueAlertDays, orgId: 100, fallback: 0).ShouldBe(14);
_sut.GetIntForOrg(SystemConfigConsts.Keys.PaymentDueAlertDays, orgId: 200, fallback: 0).ShouldBe(21);
_sut.GetIntForOrg(SystemConfigConsts.Keys.PaymentDueAlertDays, orgId: 999, fallback: 0).ShouldBe(7);  // 全局兜底

// 管理员调 Org override → Invalidate → 即时生效（不等 60s TTL）
existingOrg100.UpdateValue("28");
_sut.Invalidate(SystemConfigConsts.Keys.PaymentDueAlertDays);
_sut.GetIntForOrg(..., orgId: 100, fallback: 0).ShouldBe(28);
```

Wave 73 Seed 示例：OrgId=10086 PaymentDueAlertDays=14 / BondReleaseAlertDays=120。

### 用例 75：Wave 74 StockBalanceUpdater 线程安全升级 ⭐ V0.2 决策点 5B

`r.report_alert` partial unique index：

```sql
CREATE UNIQUE INDEX IF NOT EXISTS UX_report_alert_dedup_pending
    ON r.report_alert (alert_code, source_bill_type, source_bill_id)
    WHERE alert_state = '待处理' AND is_deleted = false;
```

并发场景（Hangfire 批扫 + 业务出库 hook 同时通过应用层去重判定）→ DB 层 unique violation → 应用层 catch + log 视为去重命中，主流程不受影响。

Sprint 10a D8-2 留 P2 评估的"重复 alert"问题在 Sprint 11a Day 8 关闭。

### 用例 76：E-13 EquipmentDepreciation Hangfire 接通

```csharp
// Sprint 8a placeholder → Sprint 11a Day 8 接通真 Manager
public virtual async Task RunEquipmentDepreciationAsync() {
    using var uow = _uow.Begin(requiresNew: true);
    using var scope = _services.CreateScope();
    var mgr = scope.ServiceProvider.GetRequiredService<EquipmentDepreciationManager>();
    var result = await mgr.CalculateMonthlyDepreciationForAllActiveAsync(
        DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-1)));  // 上一月
    _log.LogInformation("[E-13] Total={Total} Success={S} AlreadyExists={A} Failed={F}",
        result.TotalActive, result.SuccessCount, result.AlreadyExistsCount, result.FailedCount);
    await uow.CompleteAsync();
}
```

批量方法：单设备失败不阻断其他设备（catch + log + continue）。

---

## 四、Sprint 11a 协同回顾

| 节点 | 实测 | 备忘 |
|---|---|---|
| **D6 三轨并行（a + b + c）** | a Token schema + Manager / b AppService / c Real LLM 测试 | sweet spot 3.8x 三次验证 |
| **D8 三轨并行（a + b + c）** | a Wave 74 / b E-13 接通（**工作超时**） / c reconciliation 守护 | 触发 cici 反馈"任务分配不合理" → memory `feedback_subagent_complexity_pre_check` |
| **D9 双轨并行（a + b）** | a LlmOrchestration E2E / b SY02OrgScope E2E | spawn 前 grep 确认前置条件 → b 2.4 min 合理（80% of a 5 min） |
| **memory 沉淀 3 条** | feedback_subagent_workload_calibration / feedback_evaluate_parallel_subagent_default / feedback_subagent_complexity_pre_check | 工作流稳健性提升 |

---

## 五、技术债 + 顺延项

| 项 | 来源 | 顺延 |
|---|---|---|
| **Codex 评审 Sprint 11a 9 commits** | Pro quota 暂未触顶但 Sprint 收尾自然时机 | **Sprint 12a Day 1-2**（一次性消化 + 分批跑 4-5 commits）|
| **AiCallLog Daily Token 聚合表** | Sprint 11a 仅 AppService 聚合查询，未做按日预聚合 | Sprint 12a — 加 Hangfire DailyAggregator + dashboard endpoint |
| **DefaultSafetyStockThreshold 删除** | Sprint 11a D8-2 决策保留 | Sprint 12+ M-05.SafetyStock 完整化运维后再删 |
| **R-04 dedupe 守护**（Codex Sprint 8a P2-1） | Wave 74 已加 DB unique 兜底，R-04 应用层去重逻辑仍可补 | Sprint 12a 选择性修 |
| **RecurringJobHandlers 移出 Host 层**（Codex Sprint 8a P2-2） | 详设 Nova Satellite Pattern 要求业务模块自带调度 | Sprint 12a 选择性修 |
| **详设 12/13 进入实施** | Sprint 11a 完成 LLM 编排基础 + AiCallLog 审计 | Sprint 12a 主线候选（待 cici 评审锁版方向）|

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | Sprint 11a 收尾 Demo 起。V0.2 锁版 6 决策点（1B Lift / 2A CI 跳 / 3A 显式 / 4B 分批 / 5B DB 唯一 / 6A 路线 A）全交付。范围 D1-D9 完整 + 9 commits 累计基线 1189→1262（+73）。11 新增用例 65-76 覆盖：6 P1 修复 + Tool 编排 + AdvisorOrchestrator + AiCallLog + SY-02 Org Scope + Wave 74 + E-13。Codex 评审 9 commits 顺延 Sprint 12a。3 条 memory feedback 沉淀（子代理工作量校准 / 默认评估并行 / spawn 前复杂度评估）。 |
