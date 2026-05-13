# Sprint 7a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** 实施层 · Sprint 7a 验收演示脚本
**配套：** [`Sprint-7a-任务卡-V0.2.md`](./Sprint-7a-任务卡-V0.2.md)（D10 验收物）
**并行轨道：** 与 Sprint 7b 设备运维深化 平行落地，b 轨道 Demo 见 [`Sprint-7b-Demo-脚本-V0.1.md`](./Sprint-7b-Demo-脚本-V0.1.md)

---

## 一、Sprint 7a 落地范围

按 V0.2 锁版 5 决策点（1A / 2B / 3A / 4B / 5A），本 Sprint 实际交付 **10 PD 严卡**：

| Day | 交付 | commit |
|---|---|---|
| D1 | S-13 StockBalance + S-14 StockBatchBalance + S-21 StockTransaction Domain | `24f0f07` |
| D2-1 | StockBalanceUpdater Domain Service — 库存变更唯一入口 + S-13/S-14/S-21 同事务原子写 | `82aed96` |
| D2-2/D3 | ⏭️ 跳过（5 处单据 line 级联动留 Sprint 8a 完整化）— 决策点 1A 调整 | — |
| D4 | C-09 MonthlyPrepaymentSummary 月度预支付汇总（决策点 2B 简化版） | `7578fcc` |
| D5 | C-10 PaymentExecution 付款执行台账 | `1c3f37a` |
| D6 | RealTenderPlatformApiService 真接实装（决策点 3A：OAuth + Polly + Token 缓存） | `83f3996` |
| D7 | R-04 PaymentDueNear 报表预警起步（决策点 4B：仅 R-04） | `347dddd` |
| D8 | EF 层批量 Wave 56-61（6 entity 合并 migration） | `6c71293` |
| D9-1 | Sprint7aStockBalance E2E（S-13/S-14/S-21 同事务原子写场景）| `e40ea7b` |
| D9-2 | Sprint7aPaymentReceipt E2E（C-10 → C-08 → C-07 联动）| `09cd0b3` |
| ⭐ Codex | **P1-1 + P1-2 修复**（InsufficientAvailable + UnitMismatch）| `4e2c61a` |
| D10 | Demo-7a + Sprint-8a V0.1 草案（c 子代理输出） | 本文档 |

**详设偏差备忘**：
- C-09 任务卡 V0.2 §二 Day 4 写"PaymentBatch"，详设 §4.9 实际为 `monthly_prepayment_summary` 月度预支付汇总；严守详设命名（commit `7578fcc` sprint message 留痕）
- Day 2-2/D3 5 处单据 line 级联动跳过，留 Sprint 8a 完整化（决策点 1A 简化 — 见 Sprint-8a §四接收）

**Codex 评审沉淀（Sprint 7a 首次自动评审落地）**：
- 自动评审用 `codex review --commit <sha>`（gpt-5.5 xhigh reasoning，5-10 分钟/commit）
- `82aed96` StockBalanceUpdater 评出 2 P1 → cici 拍板 (a) 立修 → commit `4e2c61a` 闭环
- 沿用 Sprint 5a Codex finding 闭环模式（`062db78` → `9fb706c` 二次评审）

---

## 二、回归用例（Sprint 1-6 已落，共 32 项）

承接 Sprint-6a-Demo（用例 23-27）+ Sprint-6b-Demo（用例 28-32）共 32 项；本次仅列 Sprint 7a 新增 4 项（用例 33-36）。

---

## 三、Sprint 7a 新增 Demo 用例（33-36）

### 用例 33：S-13/S-14/S-21 同事务原子写 ⭐⭐ 库存核心

**目标：** 验证 StockBalanceUpdater 作为库存唯一变更入口 + 详设 §4.16 硬约束（S-13/S-14/S-21 同事务原子提交）+ 移动平均成本 + 幂等键 + 不允许负库存 + 单位匹配。

```csharp
// 1. 首次入库 100 件 @ 10 元/件
var input = new StockBalanceDeltaInput
{
    OrgId = 100, WarehouseId = 1, MaterialId = 1001, UnitId = 1,
    TransactionNo = "TX-001",
    TransactionType = StockTransactionTypes.Inbound,
    QuantityDelta = 100m, AmountDelta = 1000m,
    SourceBillType = "S-05", SourceBillId = 999, SourceBillNo = "RC-001", SourceLineId = 1,
    OperatorId = 99, IdempotentKey = "S-05-999-1-入库",
    SubGroupId = 42,
};
var txId = await stockBalanceUpdater.ApplyDeltaAsync(input);
// 期望：
//   S-13 创建 1 行：Quantity=100, AvailableQuantity=100, UnitCost=10, TotalAmount=1000
//   S-21 写 1 行：QuantityBefore=0, QuantityAfter=100, IdempotentKey UQ
//   SubGroupId=42 全链继承

// 2. 二次入库 50 件 @ 12 元/件 → 移动平均
input.IdempotentKey = "S-05-999-2-入库"; input.QuantityDelta = 50m; input.AmountDelta = 600m;
await stockBalanceUpdater.ApplyDeltaAsync(input);
// 期望：UnitCost = (1000+600)/(100+50) = 10.666...（移动平均）

// 3. 幂等：相同 IdempotentKey 重复调用 → 返回已有 tx，不重复入库
var dupTxId = await stockBalanceUpdater.ApplyDeltaAsync(input);  // 同 key
// 期望：dupTxId == 上次 txId；S-13.Quantity 仍是 150（不重复扣）

// 4. ⭐ Codex P1-1 修复：80 件 reserved 时出库 50 应阻断
balance.Reserve(80m);  // AvailableQuantity = 70
await stockBalanceUpdater.ApplyDeltaAsync(outboundInput(50m));
// 期望：BusinessException SupplyCores:StockBalance:InsufficientAvailable
//   含 RequiredOut=50 / AvailableQuantity=70（实际可用） / Quantity=150 / ReservedQuantity=80

// 5. ⭐ Codex P1-2 修复：相同物料不同单位 → 阻断
input.UnitId = 2;  // 不同单位
await stockBalanceUpdater.ApplyDeltaAsync(input);
// 期望：BusinessException SupplyCores:StockBalance:UnitMismatch
```

**验收点：**
- ApplyDelta 唯一变更入口（禁止外部 setter 旁路）
- 幂等键 UQ 防重复入库
- 移动平均成本计算（入库时重算，出库不变）
- ⭐ 不允许出库 > AvailableQuantity（Codex P1-1）
- ⭐ 相同 S-13 行 UnitId 强一致（Codex P1-2）
- Sprint 8a follow-up：5 处单据按 line 级写多行 S-21 + S-09 / S-12 等业务 AppService 调 ApplyDeltaAsync

---

### 用例 34：C-09 月度预支付汇总（决策点 2B 简化版）

**目标：** 验证 C-09 4 状态机 + 唯一约束 + 汇总数据不可变。

```csharp
// 月末批处理生成（系统调用，不允许手工新建 — 详设 §4.9.1 特别说明）
var summary = MonthlyPrepaymentSummary.Create(
    orgId: 100, supplierId: 1,
    summaryMonth: "2026-05",
    generateDate: new DateOnly(2026, 5, 31),
    summaryAmount: 350000m,
    invoiceCount: 12, contractCount: 5,
    includedRequests: "[101, 102, ..., 112]");
// 期望：plan_state=待汇总

summary.Summarize();   // 待汇总 → 已汇总
// 期望：SummaryAmount + IncludedRequests 锁定不可改（详设规则）

summary.MarkPushedToPayment();  // 已汇总 → 已推付款（决策点 2B：NC 批次推送 Sprint 8a）
summary.WriteBackActualPaid();  // 已推付款 → 已回写实付（终态）

// 唯一约束验证：同 (OrgId, SupplierId, SummaryMonth) 重复 → DB 阻断
```

**验收点：**
- 5 状态机：待汇总 / 已汇总 / 已推付款 / 已回写实付 / 已作废
- (OrgId, SupplierId, SummaryMonth) UQ
- Summarize 后金额冻结（业务规则）
- Void 仅允许"待汇总"状态（已汇总后走 F-07 对账差异）
- **Sprint 8a follow-up**：NC BIZ-PAY-BATCH 推送实装（决策点 2B 顺延项）

---

### 用例 35：C-10 PaymentExecution + 招采平台 Real 实装 ⭐⭐

**目标：** 验证 C-10 4 状态 + Manual/NcReceipt 来源切换 + RealTenderPlatformApiService OAuth + Polly。

#### 35-A：C-10 状态机

```csharp
var exec = PaymentExecution.Create(paymentRequestId: 1, contractId: 200, supplierId: 1);
exec.MarkPartiallyPaid(30000m, today);  // Pending → PartiallyPaid
exec.MarkPaid(100000m, today, "NC-PAY-XXX");  // PartiallyPaid → Paid（终态）

// 失败 / 重推路径
exec2.MarkFailed("银行账户冻结");  // Pending → Failed
exec2.Retry();                     // Failed → Pending（RetryCount++）
exec2.MarkPaid(50000m, today, "NC-RETRY-OK");
```

#### 35-B：招采平台真接（决策点 3A）

```csharp
// appsettings.json
"TenderPlatform": {
  "UseRealApi": true,
  "BaseUrl": "https://tender.fxky.cn/api/v1",
  "TokenEndpoint": "https://tender.fxky.cn/oauth/token",
  "ClientId": "fxky-supply-core",
  "ClientSecret": "***",
  "TimeoutSeconds": 30,
  "MaxRetries": 3,
  "RetryBaseDelaySeconds": 2
}

// Module DI 切换（Mock → Real）
if (options.UseRealApi)
    context.Services.Replace(ServiceDescriptor.Transient<ITenderPlatformApiService, RealTenderPlatformApiService>());

// 实际调用
var batch = await tenderPlatformApi.ImportBidResponsesAsync(packageId: 100);
// Real 实现行为：
//   - 首次调 OAuth Token Endpoint 拿 bearer token（缓存到本地变量 + ExpiresIn 过期重取）
//   - 5xx / 429 自动重试（指数退避：2 → 4 → 8 秒）
//   - 4xx / 401 不重试直接返回 FetchSuccess=false
//   - 网络异常 → ErrorCode=HTTP_ERROR / TIMEOUT
```

**验收点：**
- C-10 4 状态 + Retry 重置回 Pending（RetryCount++）
- NcSource 白名单：NC回执 / 手工录入（详设 §4.10.2 过渡口径）
- RealTenderPlatformApiService 7 测试用例（HttpMessageHandler mock）：Happy / 5xx 重试 / 401 不重试 / Token 缓存 / Export 失败
- D9-1 50+ batch 真接联调 buffer（V0.2 §1.2 锁版条款降级，OAuth 凭据可用时联调）

---

### 用例 36：R-04 PaymentDueNear 付款到期预警（决策点 4B）

**目标：** 验证 C-07 → R-04 自动检测 + 预警级别推断 + 3 状态机。

```csharp
// 1. C-07 已满足且 dueDate < TODAY + 7 天 → 触发 R-04
var detector = new PaymentDueNearDetector(planRepo, alertRepo, log);
var alertCount = await detector.DetectAndAlertAsync();
// 期望：扫所有 plan_state ∈ {已满足, 部分付款} + due_date 临近的 C-07
//   生成 R-04 预警写入 report_alert 表（SourceBillType=C-07, SourceBillId=plan.Id）

// 2. 预警级别推断（基于 days_to_due）
//   - daysToDue < 0 或 ≤ 2：High
//   - 3-5：Medium
//   - 6-7：Low
//   - > 7：不预警

// 3. 处理流程
alert.MarkHandled(handlerUserId: 99, handleResult: "已联系供应商安排付款");
// 期望：待处理 → 已处理（终态）+ HandledBy/HandledTime 回填

alert.MarkIgnored(handlerUserId: 99, reason: "供应商主动延后，无需处理");
// 期望：待处理 → 已忽略（终态）
```

**验收点：**
- 3 状态机：待处理 → 已处理 / 已忽略（终态）
- AlertCode 白名单：R-04（本期）/ R-05/06/07/08 候选（Sprint 8a 实施 R-05，详设 09 V0.1 已列）
- 预警级别推断（4 档）
- SY-02 PAYMENT_DUE_ALERT_DAYS = 7（硬编码，Sprint 8a 接 SY-02 字典）
- **Sprint 8a follow-up**：Hangfire 月度调度（决策点 4B 顺延项）+ R-05 BondReleaseNear

---

## 四、E2E 主链回归

### 4.1 Sprint7aStockBalance_E2E（库存唯一事实源）

```bash
dotnet test --filter "FullyQualifiedName~Sprint7aStockBalance"

# 链路（6 用例）：
# Multi_Inbound_Then_Outbound：移动平均 + 累计字段 + 流水快照
# Idempotent_Same_Key_Twice：UQ 幂等返回（不重复入库）
# Two_Batches_FIFO：S-14 批次维度独立
# Outbound_Negative：不允许负库存（Codex P1-1 修复后改抛 InsufficientAvailable）
# Different_Materials：物料维度独立
# Multi_Source_BillTypes：S-05 + S-10 源类型追踪
```

### 4.2 Sprint7aPaymentReceipt_E2E（付款回执联动）

```bash
dotnet test --filter "FullyQualifiedName~Sprint7aPaymentReceipt"

# 链路（5 用例）：
# FullChain: C-07 MarkFulfilled → C-08 Approve → ApplyPayment → C-10 Create + MarkPaid → C-08 MarkPaid
# PartialPayment_Multi_Receipts：分笔回执累计到 Paid 终态
# PaymentFailure_Then_Retry：MarkFailed + Retry 路径
# C07_Full_Payment_Should_Reach_Completed
# Manual_Entry_Source（详设 §4.10.2 过渡口径）
```

---

## 五、Demo 验收检查清单

- [ ] 用例 33-36 全部 200 OK
- [ ] Sprint 1-6 用例 1-32 回归通过
- [ ] `dotnet test` 全套 ≥ 926 / 0 失败（实际 916 + b 集成）
- [ ] EF migration Wave 56-61 + b's Wave 52/53 全部 apply 成功
- [ ] sub_group_id 守护单测自动覆盖 Sprint 7a 新增 6 实体（反射扫覆盖）
- [ ] Codex 评审闭环：commit `4e2c61a` 含 P1-1 + P1-2 修复 + 4 新单测验证
- [ ] **b 主分支集成回归**：merge b 主分支后全套测试再跑（已含 — main 上 7a + 7b 已合并）

---

## 六、Codex 评审备忘（首次自动化落地）

Sprint 7a Day 9 首次启用 `codex review` 自动评审（本机装 codex CLI v0.128.0 + gpt-5.5 + xhigh reasoning）：

| Commit | 评审状态 | Finding |
|---|---|---|
| `82aed96` StockBalanceUpdater | ✅ 完成 | 2 P1 → 修复 `4e2c61a` |
| `1c3f37a` C-10 | ⏳ 后台跑（`bz47o2odl`）| 待 |
| `83f3996` RealTenderPlatformApiService | 📋 未跑 | 优先级 ⭐⭐⭐ |
| `347dddd` R-04 PaymentDueNear | 📋 未跑 | 优先级 ⭐⭐ |
| `6c71293` Day 8 EF | 📋 未跑 | 优先级 ⭐⭐ |

**规则**（已入 memory `feedback_auto_remind_codex_review`）：
- finding 不自动修复，全部列给 cici 决策
- cici 选 (a) 立修 / (b) 留 Sprint 8a / (c) 不修 / (d) 跳过继续

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版，配合 Sprint-7a-V0.2 D10 验收物。覆盖 4 新增 Demo 用例（33-36 — S-13/14/21 库存核心 / C-09 月度汇总 / C-10 + 招采平台真接 / R-04 报表预警）+ 2 E2E 主链回归。**首次启用 Codex 自动评审**（commit `82aed96` 产 2 P1 → 闭环 `4e2c61a`）。全量回归 926 通过（Domain 606 / App 310 / EFCore 10）。EF migrations 47 条（Wave 56-61 合并 + b's Wave 52/53）。Sprint 7a 5 决策点全部按 V0.2 锁版交付：1A/2B/3A/4B/5A。|
