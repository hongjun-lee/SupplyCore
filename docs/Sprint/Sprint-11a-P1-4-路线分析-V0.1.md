# Sprint 11a P1-4 路线 A vs B 影响分析报告（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审 V0.2 决策点 6）
**日期：** 2026-05-14
**文档性质：** 实施层 · P1-4 修复路线评估（V0.2 锁版决策点 6 评审材料）
**配套：** [`Sprint-11a-Day1-P1修复-设计-V0.1.md`](./Sprint-11a-Day1-P1修复-设计-V0.1.md) §五

---

## 一、Bug 复述（来自 `42b4804` Codex 评审）

**双扣点：**

| 调用 path | 文件:行 | 代码 |
|---|---|---|
| Path-1 (Approve) | `PaymentRequestAppService.cs:121` | `plan.ApplyPayment(entity.RequestAmount);` |
| Path-2 (MarkPaid) | `PaymentExecutionAppService.cs:77` | `plan.ApplyPayment(input.TotalAmount);` |

完整业务流程：`Submit → Approve → BIZ-PAY → MarkPaid` — `plan.ApplyPayment` 被调 **2 次**。

**症状**：
- 全额支付（input.TotalAmount == plan.PlanAmount）：第一次 Approve 后 plan.PlanState=Completed；第二次 MarkPaid `EnsureState(Fulfilled, PartiallyPaid)` 抛 `InvalidStateTransition` → MarkPaid throw
- 分期支付：plan.CumulativePaidAmount 双倍累计 → 与 C-02.PaidAmount（仅 MarkPaid 时累）不一致 → 详设 §4.7 业务规则崩溃

**为什么测试基线 1189 全过？**
1. `PaymentExecutionAppService_Tests` setup 直接 reflection 设 `request.ApprovalState=Approved` + `plan.CumulativePaidAmount=0`（**绕过** Approve 真实 path）
2. `Sprint6aPaymentChain_E2E_Tests` 用 `_requestSvc.MarkPaidAsync()`（仅推 C-08 状态，不动 C-07/C-02）— **不调** `_executionSvc.MarkPaidAsync()`
3. `Sprint7aPaymentReceipt_E2E_Tests` Domain 层 `exec.MarkPaid(...) + request.MarkPaid()` 直调（不走 AppService 编排）
4. ✅ 现实部署若用户真走 `Approve → MarkPaid` 完整 path 立即暴露 bug

---

## 二、路线 A vs B 业务语义

### 2.1 语义对比

| 维度 | 路线 A（推荐） | 路线 B |
|---|---|---|
| **C-07.CumulativePaidAmount 含义** | "累计已批准付款" | "累计实际付款" |
| **C-07 累计触发点** | Approve 时 | MarkPaid 时 |
| **C-07.RemainingAmount 含义** | "剩余可申请" | "剩余可执行" |
| **C-08 Approve 失败回滚** | C-07 throw（金额超剩余）→ 阻断 Approve | C-07 不参与，Approve 不阻断（详设 §4.7 业务规则 line 111 失效）|
| **NC 实付失败回执** | 不影响 C-07（仅状态 Refund + C-02 不扣）| C-07 ReversePayment 才动 |
| **reconciliation F-2 公式** | C-07 = SUM(C-08.RequestAmount WHERE state ∈ {Approved, Paid, Refunded}) | C-07 = SUM(C-10.ActualPaymentAmount WHERE state=Paid) |

### 2.2 详设引用对照

- **PaymentPlan.cs:30** 注释：`/// <summary>已累计付款金额（由 C-10 / C-08 ApplyPayment 回写，初始 0）。</summary>` — **歧义**（C-10 暗示路线 B，C-08 暗示路线 A）
- **PaymentRequestAppService.cs:124** 日志：`"C-08 → C-07 ApplyPayment 联动：..."` — 暗示路线 A
- **PaymentRequestAppService.cs:111** 注释：`C-07.ApplyPayment 抛业务异常 → 阻断 Approve` — **明确路线 A**（C-07 是 Approve 的前置校验）
- **PaymentExecution.cs:14** 注释：`C-07.ApplyPayment(actualPaymentAmount) 累计回写（Sprint 6a Day 8 已实施）` — **暗示路线 B**

**结论**：源码注释自相矛盾。需 cici 拍板。

---

## 三、路线 A 修复方案（推荐 — 最小侵入）

### 3.1 代码变更

| 文件 | 变更 | 行数 |
|---|---|---|
| `PaymentExecutionAppService.cs:75-78` | 删除 `plan.ApplyPayment(input.TotalAmount)` + `await _planRepo.UpdateAsync(plan)` | -3 行 |
| `PaymentExecutionAppService.cs:80` 注释 | 改 "C-10 MarkPaid 编排：C-08 → C-02"（去掉 C-07 步骤）| 1 行 |
| `IPaymentExecutionAppService.cs:12-13` 注释 | 删除 "3. C-07.ApplyPayment" 文档化（仅留 4. C-02.AddPayment）| 1 行 |
| `PaymentExecution.cs:14` 注释 | 改"C-07 累计在 Approve 阶段已完成" | 1 行 |
| `PaymentPlan.cs:30` 注释 | 改 "由 C-08 ApplyPayment 回写"（去 C-10 / 字样）| 1 行 |

**总代码改动：~7 行**。

### 3.2 受影响测试

| 测试文件 | 当前断言 | 路线 A 期望 | 改动量 |
|---|---|---|---|
| `PaymentExecutionAppService_Tests.cs:109` | `CumulativePaidAmount.ShouldBe(beforeCumulative + 30000m)` | `CumulativePaidAmount.ShouldBe(beforeCumulative)` — 不再累加 | 改 1 行 |
| `PaymentExecutionAppService_Tests.cs:137` | `CumulativePaidAmount.ShouldBe(30000m)` | `CumulativePaidAmount.ShouldBe(0m)` — setup 阶段未 Approve 故 0 | 改 1 行 |
| `Sprint6aPaymentChain_E2E_Tests.cs:135,152` | Approve 后 C-07 累计 ✅ 路线 A 正确 | 无需改 | 0 |
| `PaymentRequestAppService_Tests.cs:100,116,133,166` | Approve 后 C-07 累计 ✅ 路线 A 正确 | 无需改 | 0 |
| `Sprint7aPaymentReceipt_E2E_Tests.cs` 全部 | Domain 层直调 `plan.ApplyPayment + exec.MarkPaid + request.MarkPaid`（脱离 AppService 编排）— ✅ 行为不变 | 无需改 | 0 |
| `Sprint8aDay8_PaymentRefund_E2E_Tests.cs` | Approve 时 C-07 累计 ✅ 路线 A 正确 | 无需改 | 0 |
| `C02PaidAmountReconciliation_Tests.cs`（Sprint 10a D8-3）| F-2 公式 `C-07 = SUM(C-10.ActualPaymentAmount where Paid)` | F-2 公式改 `C-07 = SUM(C-08.RequestAmount where state ∈ {Approved, Paid, Refunded})` | 改 ~30 行（注释 + 1 测试逻辑）|

**总测试改动：~32 行（PaymentExecutionAppService_Tests 2 + reconciliation 30）**

### 3.3 P1-1 + P1-2 协同

路线 A 下：
- **P1-1**: RefundPayment 从 `已审` 退 → C-07 已扣 → 需调 `plan.ReversePayment(refundedAmount)`
- **P1-2**: SubtractPayment demote 逻辑不变（C-02 累计仅 MarkPaid 时发生，路线 A 不影响）

### 3.4 风险

| # | 风险 | 等级 |
|---|---|---|
| 1 | 详设 §4.7 业务规则若实际是路线 B 立场 → 路线 A 与详设不符 | 中（建议查详设原文）|
| 2 | reconciliation F-2 公式改：测试逻辑改动 30 行 | 低（机械改动）|
| 3 | PaymentExecution.cs:14 注释误导未来开发者 | 低（同 commit 一并改）|

---

## 四、路线 B 修复方案（保留 MarkPaid 累计）

### 4.1 代码变更

| 文件 | 变更 | 行数 |
|---|---|---|
| `PaymentRequestAppService.cs:119-122` | 删除 `plan.ApplyPayment(entity.RequestAmount) + await _planRepo.UpdateAsync(plan)` + 日志 | -4 行 |
| `PaymentRequestAppService.cs:111` 注释 | 删 "C-07.ApplyPayment 阻断 Approve"（业务规则改）| 1 行 |
| `PaymentRequestAppService.cs:124` 日志 | 删 "C-08 → C-07 ApplyPayment 联动" | 1 行 |
| `PaymentPlan.cs:30` 注释 | 改 "由 C-10 ApplyPayment 回写" | 1 行 |

**总代码改动：~7 行**。

### 4.2 受影响测试

| 测试文件 | 当前断言 | 路线 B 期望 | 改动量 |
|---|---|---|---|
| `PaymentRequestAppService_Tests.cs:100,133` | Approve 后 `CumulativePaidAmount.ShouldBe(30000m)` | `CumulativePaidAmount.ShouldBe(0m)` — Approve 不累计 | 改 ~4 处 |
| `PaymentRequestAppService_Tests.cs:101,116` | `RemainingAmount.ShouldBe(70000m / 0m)` | `RemainingAmount.ShouldBe(100000m)`（PlanAmount 全保留）| 改 ~2 处 |
| `PaymentRequestAppService_Tests.cs:166` | `CumulativePaidAmount.ShouldBe(0m)` ✅ 路线 B 正确 | 无需改 | 0 |
| `Sprint6aPaymentChain_E2E_Tests.cs:135,152,153` | Approve 后 C-07 累计 / RemainingAmount=0 | 全部改 0 累计 / RemainingAmount 保留 | 改 ~6 处 |
| `Sprint6aPaymentChain_E2E_Tests.cs:107` | 初始 `RemainingAmount.ShouldBe(100000m)` ✅ 路线 B 不变 | 无需改 | 0 |
| `PaymentExecutionAppService_Tests.cs:109,137` | MarkPaid 后 C-07 += 30000 ✅ 路线 B 正确 | 无需改 | 0 |
| `Sprint7aPaymentReceipt_E2E_Tests.cs` 全部 | Domain 层直调 — ✅ 路线 B 不变 | 无需改 | 0 |
| `Sprint8aDay8_PaymentRefund_E2E_Tests.cs` | Approve → C-07 累计 → Refund → ReversePayment | 改：Approve 不累计；Refund 也无需 ReversePayment（仅 MarkPaid 后 Refund 才 ReversePayment）| 改 ~5 处 |
| `C02PaidAmountReconciliation_Tests.cs` | F-2 公式 `C-07 = SUM(C-10 Paid)` ✅ 路线 B 正确 | 无需改 | 0 |
| `PaymentPlan_Tests.cs` | ApplyPayment 直调测试 — Domain 层不变 | 无需改 | 0 |
| `PaymentPlan_ReversePayment_Tests.cs` | 同上 | 无需改 | 0 |

**总测试改动：~17 处**（PaymentRequestAppService 6 + Sprint6a E2E 6 + Sprint8aDay8 5）

### 4.3 P1-1 + P1-2 协同

路线 B 下：
- **P1-1**: RefundPayment 从 `已审` 退 → C-07 未扣 → 无需 ReversePayment（仅状态推进）
- **P1-2**: 同路线 A（不影响）

### 4.4 风险

| # | 风险 | 等级 |
|---|---|---|
| 1 | Approve 不阻断（详设 §4.7 业务规则 line 111 失效）→ 业务规则需重写 | **高** |
| 2 | C-08 Approve 后 RemainingAmount 不变 → UI 显示"可申请额度"反复出现 → 用户体验问题 | 中 |
| 3 | 测试改动量 ~17 处 + 详设文档更新 | 中 |
| 4 | Sprint 6a/8a 已稳定流程被打破，回归测试时间长 | 中 |

---

## 五、推荐：路线 A

### 5.1 推荐理由

1. **侵入最小**：代码 7 行 / 测试 32 行（含 reconciliation 注释修订），路线 B ~7 行代码 + 17 测试改动 + **详设业务规则**重写
2. **保留 Approve 阶段业务规则守护**：C-07.ApplyPayment 抛异常 → 阻断 Approve（防止超额申请通过审批）— 这是详设 §4.7 line 111 明确文档化的业务规则
3. **PaymentRequestAppService.cs 现有代码 + 注释**强烈倾向路线 A：line 111 "C-07.ApplyPayment 抛业务异常 → 阻断 Approve"
4. **C-02.PaidAmount 不动**：保留 Sprint 10a D8-1 引入的 C-02 在 MarkPaid 时累计语义（路线 A/B 都保留）
5. **业务语义合理**：「已批准」= 申请获批锁定预算；「已实付」= C-10 实际付款台账。C-07 是计划层（已批准的预算），C-10 是执行层（实际付款）— 各自累计语义清晰

### 5.2 路线 A 实施步骤（按 P1 修复设计 §五）

1. 删除 `PaymentExecutionAppService.cs:75-78`（4 行 — line 75 注释 + line 77 调用 + line 78 await）
2. 改 `PaymentExecutionAppService.cs:80,86` 注释（去 C-07 步骤）
3. 改 `IPaymentExecutionAppService.cs:12-13` 文档化注释
4. 改 `PaymentExecution.cs:14` + `PaymentPlan.cs:30` 注释（统一为路线 A 语义）
5. 改 `PaymentExecutionAppService_Tests.cs:109,137`（2 处期望值改 0）
6. 改 `C02PaidAmountReconciliation_Tests.cs` F-2 公式（30 行注释 + 1 测试逻辑）
7. 跑全量回归：目标基线 ≥ 1189（与 Sprint 10a D9 一致）

预计工时：**0.5 PD**（与 P1 修复设计 §五估算一致）

---

## 六、备选方案 — 路线 C：保留双扣 + 加业务规则区分

如果 cici 评估路线 A/B 都不可行，**备选路线 C**：

- Approve 时 `plan.ApplyPayment` 改名 `plan.ReserveBudget`（仅 RemainingAmount 锁定，不累计 CumulativePaidAmount）
- MarkPaid 时保留 `plan.ApplyPayment`（实际累计）
- C-07 加新字段 `ReservedBudget`（已批预算）+ `CumulativePaidAmount`（实付）

工时：~1.5 PD（schema 改动 + Wave 73 migration）
风险：高 — 涉及 entity schema 改动 + 详设文档全部修订
**不推荐**（除非 cici 评估业务上两个金额都有意义且需独立展示）

---

## 七、cici 决策点 6 模板

V0.2 锁版评审时建议如下选项：

| 选项 | 路线 | 工时 | 推荐 |
|---|---|---|---|
| 6A | 路线 A — 删 PaymentExecutionAppService 的 ApplyPayment | 0.5 PD | ⭐ |
| 6B | 路线 B — 删 PaymentRequestAppService 的 ApplyPayment + 详设业务规则修订 | 0.8 PD | |
| 6C | 路线 C — 保留双扣 + 新增 ReservedBudget 字段 + Wave 73 | 1.5 PD | |

---

## 八、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 首版。基于 Codex `42b4804` P1-4 finding + 实际源码 grep 分析。路线 A 推荐（最小侵入 / 保留详设业务规则 / 现有代码注释倾向）。受影响测试逐文件列出（路线 A 32 行改动 / 路线 B 17 处改动 + 详设修订）。等 cici V0.2 决策点 6 评审。|
