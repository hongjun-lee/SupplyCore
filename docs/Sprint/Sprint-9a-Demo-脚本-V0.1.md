# Sprint 9a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** 实施层 · Sprint 9a 验收演示脚本
**配套：** [`Sprint-9a-任务卡-V0.2.md`](./Sprint-9a-任务卡-V0.2.md)

---

## 一、Sprint 9a 落地范围

按 V0.2 锁版 5 决策点（1A / 2A / 3B / 4A / 5A），本 Sprint 实际交付 **~10.5 PD**：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D2 | R-05 字段补强（C-02 加 BondReleaseState + PartiallyReleaseBond 业务方法）+ Wave 70 migration（含数据迁移）| `b72512d` | a |
| D3 | SY-02 字典化精简版（IOptions 注入 4 核心 const）+ PaymentExecutionAppService 编排（C-10→C-08→C-07→C-02 4 步联动） | `42b4804` | a |
| D4-1 | R-06 ContractExpiryNearDetector（9 测试 / SHA256 IdempotentKey / 3 active states 过滤）| `45554f7` | a |
| D4-2 | R-07 InventoryLowStockDetector + StockBalanceUpdater 出库后实时触发钩子（22 测试） | `45554f7` + `dd41165` | b 子代理 |
| D5-1 | R-08 InventoryNearExpiryDetector（M-15.ExpireDate 真字段 join，17 测试） | `e586638` | c 子代理 |
| D6-7 | AI Tool 接口骨架 + 3 Mock Stub（V0.2 决策点 3B 多 Tool 模式，10 测试） | `7574ba5` | a |
| D8 前 | NC BatchDetails 部分成功 schema（V0.2 决策点 4A 完整化，5 测试） | `c1173d4` | a |
| D8 后 | Web.Tests 项目首次接通 + Hangfire 7 RecurringJob 注册守护（6 测试） | `b8e0d61` | a |
| D9 | 综合 E2E + Sprint 9a 全产物 contract 守护（6 测试） | `6e1fd2f` | a |
| D10 | Demo-9a + Sprint-10a 草案 | 本文档 | a |

**协同节奏二次验证（继 Sprint 8a 后）**：
- D4-2 (b) + D5-1 (c) **同期并行落地** ≈ 2.5 PD 同步进展
- 子代理决策：c 自主选 M-15.ExpireDate 真字段（拒任务卡建议的简化版），M-15 字段已存在
- 子代理决策：b 自主选 M-05.SafetyStock 真字段 + DefaultSafetyStockThreshold const 兜底

**Codex 评审延后**：Pro daily quota 11:56 PM 仍未恢复（Sprint 8a + 9a 累计 4+5 个 commit 待评审顺延 Sprint 10a Day 1）

---

## 二、回归用例（Sprint 1-8 已落 48 项）

承接 Sprint-8a-Demo 共 48 项。本期新增 Sprint 9a 8 项（用例 49-56）。

---

## 三、Sprint 9a 新增 Demo 用例（49-56）

### 用例 49：C-02 PartiallyReleaseBond 部分释放押金（V0.2 决策点 1A）

```csharp
// 缴纳保证金后部分释放（分期释放场景）
contract.PayBond(BondForms.BankGuarantee);
contract.BondReleaseState.ShouldBe(ContractBondReleaseStates.NotReleased);  // 自动设

contract.PartiallyReleaseBond();
contract.BondState.ShouldBe(ContractBondStates.Paid);  // 状态不变
contract.BondReleaseState.ShouldBe(ContractBondReleaseStates.PartiallyReleased);

// 后续全释放
contract.ReleaseBond(BondReleaseTriggers.AcceptancePassed);
contract.BondReleaseState.ShouldBeNull();  // 清空（终态由 BondState 表达）
```

### 用例 50：R-06 ContractExpiryNear（每日 04:00 UTC Hangfire 调度）⭐

```csharp
// C-02 ExpiryDate < TODAY+60 + ContractState ∈ {已签/执行中/完成待确认} → 触发预警
var count = await _r06Detector.DetectAndAlertAsync();

// 期望：
//   ReportAlert AlertCode="R-06" / AlertType="合同到期"
//   AlertLevel: ≤7 High / ≤30 Medium / ≤60 Low
//   AlertContent JSON 含 contractId / contractNo / supplierId / daysToExpiry / executedAmount / idempotentKey
//   排除 ContractState=已终止/已作废/已完成/草稿/待审/已驳回
//   去重 24h 窗口内不重复
```

### 用例 51：R-07 InventoryLowStock 实时触发（出库后业务事件）⭐⭐ 实时

```csharp
// 出库 (S-09) 后 StockBalanceUpdater 钩子自动触发 R-07 检测
await _updater.ApplyDeltaAsync(new StockBalanceDeltaInput
{
    OrgId = 100, WarehouseId = 1, MaterialId = 1001,
    QuantityDelta = -80m,  // 大量出库
    // ...
});

// 期望：
//   StockBalanceUpdater 出库完成后自动调 InventoryLowStockDetector.DetectForBalanceAsync(balanceId)
//   如 AvailableQuantity < SafetyStockThreshold → R-07 预警写入
//   钩子失败不阻断主流程（详 b 子代理实施）
//   AlertLevel: AvailableQuantity=0 → High / 其他 Warning
```

### 用例 52：R-08 InventoryNearExpiry 批次临期（每日 05:00 UTC）⭐ M-15 真字段

```csharp
// S-14 × M-15 join 扫描：ExpireDate < TODAY+30 → 触发预警
var count = await _r08Detector.DetectAndAlertAsync();

// 期望：
//   AlertCode="R-08" / AlertType="批次临期"
//   AlertLevel: daysToExpiry ≤7 High / ≤14 Medium / ≤29 Low
//   排除 ExpiredFlag=true 或 BatchQuantity=0 的批次
//   排除已超 24h 窗口处理过的预警（去重）
```

### 用例 53：C-10 PaymentExecution 4 步联动（C-10→C-08→C-07→C-02）⭐⭐ 编排核心

```csharp
// Sprint 9a Day 3 D8-1 顺延项完整闭环
var dto = await _executionSvc.MarkPaidAsync(executionId, new MarkPaidPaymentExecutionDto
{
    TotalAmount = 30000m,
    PaymentDate = today,
    VoucherNo = "VCH-001",
});

// 期望（ABP UoW 同事务原子）：
//   C-10.ExecutiveState=已支付 (Codex P2-2 累计校验防呆)
//   C-08.ApprovalState=已支付 (幂等：已是 Paid 跳过)
//   C-07.CumulativePaidAmount += 30000
//   C-02.PaidAmount += 30000 (Sprint 8a Day 8 D8-1 联动闭环 ✓)
```

### 用例 54：AI Advisor 多 Tool Mock 输出（V0.2 决策点 3B）⭐ AI 起步

```csharp
// 3 Advisor Mock Stub 调用（Sprint 10+ 接 Claude API 替换 stub，接口契约不变）
var paymentAns = await _paymentAdvisor.AskAsync(new PaymentDueAdvisorContext
{
    PaymentPlanId = 300, ContractId = 200, DaysToDue = 5, PlanAmount = 50000m,
    CumulativePaidAmount = 10000m,
});

// 期望：
//   ToolName="R-04-PaymentDueAdvisorMockStub"
//   Confidence=0.6 (Stub 标记)
//   Suggestion 含 "剩余 40,000.00" + 3 条建议
//   Evidence 引用 C-07 PaymentPlanId + C-02 ContractId
//   软降级：null context → IsFallback=true / Confidence=0.3
```

### 用例 55：C-09 NC 部分成功回执（V0.2 决策点 4A）⭐ 生产真接路径

```csharp
// Sprint 8a Day 5 顺延项 - NC BatchDetails schema 完整化
_nc.PushAsync(Arg.Any<string>(), Arg.Any<object>())
   .Returns(new NcPushResult
   {
       Success = true,
       BatchDetails = new List<NcBatchItemResult>
       {
           new() { ItemId = c08Id1, Success = true, NcSubVoucherNo = "NC-SUB-001" },
           new() { ItemId = c08Id2, Success = false, ErrorCode = "NC-409", ErrorMessage = "Duplicate" },
       },
   });

await _summarySvc.PushToPaymentAsync(summaryId);

// 期望：
//   C-09.InterfacePushState=Failed (BatchOutcome=PartialSuccess 触发重推)
//   成功 C-08 (Id1)：InterfacePushState=Success + NcSubVoucherNo=NC-SUB-001
//   失败 C-08 (Id2)：InterfacePushState=Failed + PushErrorCode=NC-409
//   BatchDetails=null 时 fallback 到 Sprint 8a all-or-nothing 路径
```

### 用例 56：Hangfire 7 RecurringJob 注册防回退 ⭐ Web.Tests 接通

启动 Web Host（`Hangfire:Enabled=true`）后访问 `/hangfire`：

| JobId | Cron (UTC) | Queue | 接通状态 |
|---|---|---|---|
| R-04-PaymentDueNear | `0 2 * * *` | alerts | ✅ Sprint 7a |
| R-05-BondReleaseNear | `0 3 * * 1` | alerts | ✅ Sprint 8a |
| **R-06-ContractExpiryNear** | `0 4 * * *` | alerts | ✅ **Sprint 9a** |
| **R-07-InventoryLowStock** | `0 * * * *` | alerts | ✅ **Sprint 9a** |
| **R-08-InventoryNearExpiry** | `0 5 * * *` | alerts | ✅ **Sprint 9a** |
| E-13-EquipmentDepreciation | `0 0 1 * *` | default | 🟡 Sprint 8b 接通 |
| C-09-MonthlyPrepaymentGenerate | `0 22 28-31 * *` | monthly-batch | 🟡 循环 Org 留 Sprint 10 |

Web.Tests/SupplyCoresRecurringJobs_Tests 6 个守护断言防回退（JobId 唯一性 / Cron 5 段 / Handler 类型 / async 实装）。

---

## 四、Sprint 9a 协同回顾（继 Sprint 8a 后第二次并行）

| 节点 | 实测 | 备忘 |
|---|---|---|
| **a + b + c 同期 push** | D4-1 (a) + D4-2 (b) + D5-1 (c) 三轨同期 | 验证：sweet spot 3x 实测稳定 |
| **子代理自主决策** | b 选 M-05.SafetyStock 真字段，c 选 M-15.ExpireDate 真字段 | 双方都拒"任务卡建议的简化版"，更接近详设 |
| **CommonRefactoring 累积** | SupplyCoresAlertSettings 加 4 个新字段（含 a + c 各自加的）| 多次 git pull --rebase 自动 merge，0 冲突 |
| **Codex 评审延后** | Pro daily quota 触顶 | Sprint 10a Day 1 优先消化 Sprint 8a+9a 共 9 commits 评审 |

---

## 五、技术债 + 顺延项

| 项 | 来源 | 顺延 |
|---|---|---|
| **Codex 评审 4+5 commits** | Sprint 8a 顺延 + Sprint 9a 新模块 | Sprint 10a Day 1（约 9 commits 一次性评审）|
| **SafetyStock=0 两 path 行为不一致** | b 子代理 R-07 报告 | Sprint 10 决定批量扫 path 是否对齐单行 path |
| **C-09 月末批处理循环 Org** | Sprint 8a Day 6 落地 placeholder | Sprint 10（接入 IOrganizationRepository 循环）|
| **真 LLM 接入 AI Advisor** | Day 6-7 Stub 阶段 | Sprint 10/11 接 Claude API（接口契约稳定） |
| **完整 SY-02 SystemDictionary 表** | Day 3 IOptions 精简版 | Sprint 10/11 |
| **C-02.PaidAmount = SUM(C-07.CumulativePaidAmount) reconciliation 集成单测** | Day 9 顺延 | Sprint 10 EFCore.Tests 层 |
| **E-13 EquipmentDepreciation 接通** | Day 6 RecurringJob 占位 | Sprint 8b Day 2 / Sprint 10 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-13 | Sprint 9a 收尾 Demo 起。范围 D2-D9 9 days 完成；含 b/c 子代理协同二次落地；8 个新增用例 49-56 覆盖：R-05 字段补强 / SY-02 字典化 / PaymentExecution 编排 / R-06/R-07/R-08 / AI Tool 多 Tool / NC 部分成功 / Hangfire 守护。Codex 评审 9 commits 顺延 Sprint 10a Day 1。技术债 7 项记入 §五。|
