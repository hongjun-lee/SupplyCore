# Sprint 11a Day 1-2 — 5 P1 修复设计草案（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 11a Day 1-2 修复细化设计
**配套：** [`Sprint-11a-任务卡-V0.1.md`](./Sprint-11a-任务卡-V0.1.md) §一A + §七

---

## 一、修复范围总览

5 个 P1 finding 来自 Codex 评审 commit `408545b` + `c8f2600` + `42b4804`。本文档为 cici 决策提供：(a) 修复方案 (b) 受影响测试 (c) 风险 (d) 工时。

| # | P1 ID | 修复复杂度 | 工时 | 风险 |
|---|---|---|---|---|
| P1-1 | PaymentRequest 失败 path 进不了 refund state | 低 | 0.2 PD | 低 — 仅扩 EnsureState |
| P1-2 | 退款减后 ContractState 未 demote | 中 | 0.3 PD | 中 — 状态机扩展，测试需覆盖完整 |
| P1-3 | 月末 batch 包含已 push 的 C-08 | 低 | 0.2 PD | 低 — query filter 加 1 条件 |
| P1-4 | MarkPaidAsync 重复扣 C-07 | **高** | **0.5 PD** | **高 — 涉及 reconciliation 公式选择 + Sprint 10a D8-3 测试需改** |
| P1-5 | 非 Approved C-08 可被 MarkPaid | 中 | 0.3 PD | 中 — 幂等逻辑改造 |

**合计：~1.5 PD**（Sprint-11a-V0.1 §一A Day 1-2 预算 2.5 PD，剩余 1 PD 给跑 5 commits Codex + 汇总 + buffer）

---

## 二、P1-1 PaymentRequest 失败 path 进不了 refund state

### 2.1 现状

`PaymentRequest.cs:204`：
```csharp
public virtual void RefundPayment(string reason)
{
    EnsureState(PaymentRequestStates.Paid);  // ← 仅接受 已支付
    ...
}
```

**Bug**：NC 失败回执时 C-08 仍是 `已审`（没走 MarkPaid），RefundPayment 抛 `InvalidStateTransition` → 详设 §4.8 文档化的"已审 → 支付退回"路径走不通。

### 2.2 修复方案

```csharp
public virtual void RefundPayment(string reason)
{
    EnsureState(PaymentRequestStates.Paid, PaymentRequestStates.Approved);  // ← 加 Approved
    if (string.IsNullOrWhiteSpace(reason))
        throw new BusinessException("SupplyCores:PaymentRequest:RefundReasonRequired");

    var previousState = ApprovalState;  // 记录前态供 AppService 编排判断

    RefundReason = reason;
    RefundedAmount = RequestAmount;
    RefundedTime = DateTime.UtcNow;
    ApprovalState = PaymentRequestStates.Refunded;
}

/// <summary>新方法：暴露前态供 AppService 判断是否反向扣减。</summary>
public bool WasPaidBeforeRefund => RefundedTime.HasValue && ApprovalState == PaymentRequestStates.Refunded;
```

AppService 编排（PaymentExecutionAppService.RefundAsync 或 PaymentRequestAppService.RefundPaymentAsync）：

```csharp
var wasPaid = request.ApprovalState == PaymentRequestStates.Paid;
request.RefundPayment(reason);

if (wasPaid)
{
    // 从已支付退 → 反向扣减 C-07/C-02
    plan.ReversePayment(refundedAmount);
    contract.SubtractPayment(refundedAmount);
}
// else: 从已审退 → C-07/C-02 之前没扣过（路线 A — 详 P1-4），无需反向
```

### 2.3 测试

- PaymentRequest_Tests：`RefundPayment_From_Approved_Should_Succeed`（新）
- PaymentRequest_Tests：`RefundPayment_From_Pending_Should_Throw`（新 — 守护其他非法状态）
- Sprint8aDay8_PaymentRefund_E2E_Tests：补 Approved → Refund 完整链路

---

## 三、P1-2 退款减 PaidAmount 后 ContractState 未 demote

### 3.1 现状

`Contract.cs:351-365` SubtractPayment：仅扣 PaidAmount，不动 ContractState。

**Bug 场景**：
1. 合同 95% 阈值通过 → `MarkReadyForCompletion` → ContractState=`完成待确认`
2. 退款减 PaidAmount → 跌到 < 95%
3. `Complete()` 接受 `完成待确认` 状态 → 不重算阈值 → **合规违规：未达阈值已完成**

### 3.2 修复方案

```csharp
public virtual void SubtractPayment(decimal amount)
{
    if (amount <= 0) throw ...;
    EnsureState(Signed, InExecution, ReadyForCompletion);
    if (amount > PaidAmount) throw ...;

    PaidAmount -= amount;

    // Sprint 11a P1-2 修复：如果当前在 ReadyForCompletion，扣后跌破阈值要 demote 回 InExecution
    if (ContractState == ContractStates.ReadyForCompletion)
    {
        var threshold = ContractAmount * ContractCompletionRules.CompletionThresholdRate;
        if (PaidAmount < threshold)
        {
            ContractState = ContractStates.InExecution;
        }
    }
}
```

### 3.3 测试

- Contract_Tests（新）：
  - `SubtractPayment_From_ReadyForCompletion_Below_Threshold_Should_Demote_To_InExecution`
  - `SubtractPayment_From_ReadyForCompletion_Above_Threshold_Should_Stay`
  - `SubtractPayment_From_InExecution_Should_Not_Touch_State`
- Sprint8aDay8 E2E：补 ready → refund → complete 应被守护链路（complete 应抛 InvalidStateTransition）

### 3.4 风险

- 中等。状态机扩展可能影响其他流程（如果某 path 期望 ReadyForCompletion 不会被 demote）。Day 1 实施时跑全量回归确认。

---

## 四、P1-3 月末 batch 包含已 push 的 C-08

### 4.1 现状

`MonthlyPrepaymentSummaryManager.cs:66-71`：
```csharp
var requests = requestQuery
    .Where(r => r.OrgId == orgId
        && r.ApprovalState == PaymentRequestStates.Approved
        && r.CreationTime >= monthBoundary.start
        && r.CreationTime < monthBoundary.end)
    .ToList();
```

**Bug**：`PaymentRequestAppService.ApproveAsync` line 128 已调 `PushToNcAsync` 把 C-08 通过 BIZ-PAY 单笔推送。月末 BIZ-PAY-BATCH 又把它包进 batch → NC 端收到重复 voucher_no。

### 4.2 修复方案

加 InterfacePushState 过滤：

```csharp
var requests = requestQuery
    .Where(r => r.OrgId == orgId
        && r.ApprovalState == PaymentRequestStates.Approved
        && r.CreationTime >= monthBoundary.start
        && r.CreationTime < monthBoundary.end
        && r.InterfacePushState != PaymentRequestInterfaceStates.Pushed)  // ← P1-3 修复：排除已 push
    .ToList();
```

需确认 `PaymentRequestInterfaceStates` 常量；如缺则补一个 enum / const。

### 4.3 测试

- MonthlyPrepaymentSummaryManager_Tests：
  - `GenerateForOrgAsync_Should_Exclude_AlreadyPushed_Requests`（新）
  - `GenerateForOrgAsync_When_All_Pushed_Should_Return_Empty`（新）

---

## 五、P1-4 MarkPaidAsync 重复扣 C-07（**核心矛盾，需 cici 决策**）

### 5.1 现状

两条 path 都调 `plan.ApplyPayment(amount)`：

| 路径 | 文件 | 行 | 调用 |
|---|---|---|---|
| Approve | `PaymentRequestAppService.cs:121` | 121 | `plan.ApplyPayment(entity.RequestAmount)` |
| MarkPaid | `PaymentExecutionAppService.cs:77` | 77 | `plan.ApplyPayment(input.TotalAmount)` |

**双扣**：全额时 throw `InvalidStateTransition`（Completed → 已 Completed 不接受 ApplyPayment）；分期时 C-07.CumulativePaidAmount 双倍累计。

### 5.2 设计矛盾（需 cici 决策）

业务语义选择：

| 路线 | C-07.CumulativePaidAmount 含义 | 触发点 | reconciliation F-2 公式 |
|---|---|---|---|
| **A** | "累计已批准付款" | Approve 时累计 | C-07 ≠ SUM(C-10 Paid)（Approve 阶段差异）|
| **B** | "累计实际付款" | MarkPaid 时累计 | C-07 = SUM(C-10 Paid)（Sprint 10a D8-3 假设）|

**Sprint 10a D8-3 reconciliation 测试基于路线 B**。
**当前代码同时做了 A + B（双扣）** — bug。

### 5.3 修复方案

**推荐路线 A**（最小侵入 — 修 1 行 + 删 Sprint 10a D8-3 F-2 假设）：

```csharp
// PaymentExecutionAppService.MarkPaidAsync — 删除 line 75-78 的 C-07 累计调用
// 1. C-10.MarkPaid（已做）
// 2. C-08.MarkPaid（已做）
// 3. ❌ 删除 C-07.ApplyPayment（已在 Approve 时累计）
// 4. C-02.AddPayment（保留 — Approve 不扣 C-02，MarkPaid 才扣）
```

并修订 Sprint 10a D8-3 reconciliation 测试 F-2 公式注释：
- F-1 正向不变：`Contract.PaidAmount = SUM(C-07.CumulativePaidAmount)`
- F-2 反向改：`C-07.CumulativePaidAmount = SUM(C-08.RequestAmount WHERE ApprovalState ∈ {Approved, Paid, Refunded})` — 已审/已付/已退累计；MarkPaid 阶段差异为零（仅状态推进）

**备选路线 B**（更接近"实付"语义，但侵入大）：
- 删除 ApproveAsync line 121 的 C-07.ApplyPayment
- MarkPaidAsync line 77 保留
- Approve 阶段 C-07 仅 MarkFulfilled（条件满足，但未累计）
- 影响：Sprint 9a Day 4 之前所有 PaymentPlan 测试期望需改

### 5.4 测试

- PaymentExecutionAppService_Tests：
  - `MarkPaidAsync_Should_Not_Double_Apply_C07`（新 — 守护回归）
- Sprint10a D8-3 Reconciliation_Tests：F-2 公式注释 + 测试逻辑修订
- 全量回归：路线 A 影响 PaymentPlan 累计语义，所有 plan.CumulativePaidAmount 期望需 review

### 5.5 风险

**高**。这是设计矛盾不是 simple bug。路线 A/B 任一选择都影响 Sprint 6a-10a 已经写过的 ~30 个 PaymentPlan / Contract / Reconciliation 相关测试。建议：cici 在 V0.2 锁版评审时 **新增一个决策点（决策点 6）专门决定路线 A/B**。

---

## 六、P1-5 非 Approved C-08 可被 MarkPaid

### 6.1 现状

`PaymentExecutionAppService.cs:62-73`：
```csharp
if (request.ApprovalState == PaymentRequestStates.Approved)
{
    request.MarkPaid();
    ...
}
else
{
    _log.LogInformation(...);  // 跳过 — 但 line 75+ 继续走 C-07/C-02 写入
}
```

**Bug**：if C-08 是 Draft / Pending / Rejected / Refunded（且有 C-10 行 — 罕见但可能因测试 seed / 异常路径产生），else 分支 silent skip → 继续 line 75+ 的 C-07/C-02 写入 → **绕过审批写款**。

### 6.2 修复方案

```csharp
if (request.ApprovalState == PaymentRequestStates.Approved)
{
    request.MarkPaid();
    await _requestRepo.UpdateAsync(request, autoSave: false);
}
else if (request.ApprovalState == PaymentRequestStates.Paid)
{
    // 幂等：C-08 已是 Paid（之前已 MarkPaid 过）— C-07/C-02 也已扣，全部 skip 后续
    _log.LogInformation("C-08 已 Paid，幂等 skip 完整编排");
    return _dtoMapper.Map(execution);  // 提前返回
}
else
{
    // 草稿 / 待审 / 已驳回 / 已退 → 不允许 MarkPaid
    throw new BusinessException("SupplyCores:PaymentExecution:InvalidRequestState")
        .WithData("RequestId", request.Id)
        .WithData("CurrentState", request.ApprovalState);
}
```

### 6.3 测试

- PaymentExecutionAppService_Tests：
  - `MarkPaidAsync_When_Request_NotApproved_Should_Throw`（新，覆盖 4 个非法状态）
  - `MarkPaidAsync_When_Request_AlreadyPaid_Should_Skip_Idempotent`（新 — 守护幂等）

---

## 七、Day 1-2 实施顺序建议

| Day | 项目 | 工时 | 备注 |
|---|---|---|---|
| D1 上午 | Pro quota 恢复后跑剩 5 commits Codex | 0.5 PD | 与 V0.2 锁版评审 finding 合并 |
| D1 中午 | cici 评审 V0.2 锁版 + 决策点 6（P1-4 路线 A/B）| — | 阻塞下半 |
| D1 下午 | **P1-1 + P1-3 + P1-5 实施**（低/中风险，可独立）| 0.7 PD | 单独 commit |
| D2 上午 | **P1-2 实施**（中风险）+ 跑相关 E2E | 0.3 PD | 单独 commit |
| D2 下午 | **P1-4 实施**（按 cici 决策路线）+ 全量回归 + reconciliation 测试修订 | 0.5 PD | 单独 commit；最大风险点 |

---

## 八、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 首版草案。5 P1 finding 逐项修复设计。**核心矛盾**：P1-4 涉及 C-07 累计语义（路线 A 已批准 vs 路线 B 已实付），影响 Sprint 6a-10a ~30 个测试，建议 V0.2 锁版加 决策点 6 专项评审。其他 4 P1 修复方案低/中风险，可常规实施。总工时 ~1.5 PD。|
