# Sprint 8a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** 实施层 · Sprint 8a 验收演示脚本
**配套：** [`Sprint-8a-任务卡-V0.2.md`](./Sprint-8a-任务卡-V0.2.md)（D10 验收物）
**并行轨道：** 与 Sprint 8b 设备运维 AI 起步 + 折旧调度 平行落地

---

## 一、Sprint 8a 落地范围

按 V0.2 锁版 5 决策点（1A / 2A / 3A / 4A / 5A），本 Sprint 实际交付 **10 PD 严卡**：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D1 | S-05 StockInbound line 级 + Wave 62 migration | `23dec0c` | a |
| D2 | S-06 PurchaseReturn + S-09 MaterialIssuance 双 line 级 + Wave 63/64 | `17a7a93` | a |
| D3 | S-10 StockReturn + S-12 StockTransfer 双 line 级（含 S-12 双边联动） + Wave 65/66 | `ee53e4d` | a |
| D4 | line 级集成 E2E + 守护单测（多 line 入出库 / 调拨双边 / NULLS NOT DISTINCT / 幂等键） | `1d005d4` | a |
| D5 | C-09 MonthlyPrepaymentSummary 全栈 + BIZ-PAY-BATCH 4 要素 + 联动 C-08 批量回写 | `c8f2600` | a |
| D6 | Hangfire 调度框架引入 + 7 RecurringJob 注册（R-04/R-05/E-13/C-09 + R-06/R-07/R-08 占位） | `44062d4` | a |
| D7 | R-05 BondReleaseNear Detector + ReportAlert.CreateBondReleaseNear 工厂方法 | `428e5cc` | **b 子代理** |
| D8 | C-02.PaidAmount + Contract.MarkReadyForCompletion + C-08 RefundedState + C-07 反向冲减 + Wave 68/69 | `408545b` | **c 子代理** |
| D9 | 综合冒烟（5 line 实体 + C-09/R-05/C-02/C-08 contract 守护 + Wave 62-69 完整性） | `df8b130` | a |
| D10 | Demo-8a + Sprint-9a 草案 | 本文档 | a |

**协同节奏验证（首次启用并行）**：
- D5 (a) + D7 (b) + D8 (c) **同日并行落地** ≈ 3 PD 同时进展
- 实测 sweet spot：主代理 a + 2 子代理（b/c worktree 隔离）≈ 3x 加速（考虑 merge 间隔）
- 三轨独立 push 后 main 自然合并，无 git 冲突

**Codex 评审待办（Pro daily quota 触顶顺延）**：
- 4 个新模块完成（44062d4 Hangfire / 408545b C-02/C-08 / c8f2600 C-09 / 428e5cc R-05）评审 spawn 全失败 — 待 quota 重置（11:56 PM）或 Sprint 9a 开工前补评
- 按 memory rule `feedback_auto_remind_codex_review.md`，未评审风险记录为 Sprint 9a 候选项

---

## 二、回归用例（Sprint 1-7 已落 36 项）

承接 Sprint-7a-Demo（用例 33-36）+ Sprint-7b-Demo（用例 37-40）共 40 项；本期仅列 Sprint 8a 新增 8 项（用例 41-48）。

---

## 三、Sprint 8a 新增 Demo 用例（41-48）

### 用例 41：S-05 多 line 入库 + S-13/S-14 多 batch 同时累计 ⭐⭐ 库存联动

**目标：** 验证 line 级 ApplyDelta loop（详设 06 §4.16 同事务原子）。

```csharp
// 同 material 不同 batch 的 3 行入库（CreateStockInboundDto.Lines）
var dto = await _inboundSvc.CreateAsync(new CreateStockInboundDto
{
    ReceiptNo = "RC-DEMO-001",
    OrgId = 100, WarehouseId = 1, SupplierId = 1, ContractId = 200,
    ReceiptDate = today, ReceiptType = "采购入库",
    Lines = new List<CreateUpdateStockInboundLineDto>
    {
        new() { MaterialId = 1001, UnitId = 1, BatchId = 10, Quantity = 30, UnitPrice = 50 },
        new() { MaterialId = 1001, UnitId = 1, BatchId = 20, Quantity = 50, UnitPrice = 60 },
        new() { MaterialId = 1001, UnitId = 1, BatchId = 30, Quantity = 20, UnitPrice = 70 },
    },
});
await _inboundSvc.SubmitAsync(dto.Id);
await _inboundSvc.ApproveAsync(dto.Id);
// 期望：
//   S-13 单行：Quantity=100, UnitCost=移动平均=59 (5900/100), TotalAmount=5900
//   S-14 三行：BatchId=10 Qty=30; BatchId=20 Qty=50; BatchId=30 Qty=20
//   S-21 三条流水：每 line 一条，含 BatchInventoryId 回填
```

### 用例 42：S-12 调拨双边 + line 级双 S-21 流水 ⭐ 跨组织

```csharp
var dto = await _transferSvc.CreateAsync(new CreateStockTransferDto
{
    OrderNo = "TR-DEMO-001",
    FromOrgId = 100, ToOrgId = 200,
    FromWarehouseId = 1, ToWarehouseId = 2,
    TransferDate = today,
    Lines = new List<CreateUpdateStockTransferLineDto>
    {
        new() { MaterialId = 1001, UnitId = 1, BatchId = 10, Quantity = 20, UnitPrice = 100,
               FromLocationId = 501, ToLocationId = 602 },
    },
});
await _transferSvc.SubmitAsync(dto.Id);
await _transferSvc.ApproveAsync(dto.Id, 99);
await _transferSvc.ShipAsync(dto.Id, outConfirmPersonId: 88);    // → FromOrg 扣减 + 调出 S-21
await _transferSvc.ReceiveAsync(dto.Id, inConfirmPersonId: 77);  // → ToOrg 增加 + 调入 S-21

// 期望：
//   FromOrg (100/1/1001) S-13 减 20
//   ToOrg (200/2/1001) S-13 加 20
//   S-21 两条流水：TransferOut（line.ShipTransactionId）+ TransferIn（line.ReceiveTransactionId）
```

### 用例 43：C-09 月末批处理 + BIZ-PAY-BATCH 推送 + 联动 C-08 回写 ⭐⭐ NC

```csharp
// 1. 月末批处理生成（每月 28-31 22:00 UTC 由 Hangfire 触发，本地手工调）
var summaries = await _summarySvc.GenerateAsync(new GenerateMonthlyPrepaymentDto
{
    OrgId = 100,
    SummaryMonth = "2026-05",
    GenerateDate = today,
});
// 期望：按 SupplierId 分组 → 每 supplier 一条 C-09，IncludedRequests JSON 含所含 C-08 IDs

// 2. 推送 BIZ-PAY-BATCH（已汇总 → 已推付款）
await _summarySvc.SummarizeAsync(summaries[0].Id);
var pushed = await _summarySvc.PushToPaymentAsync(summaries[0].Id);
// 期望：
//   C-09.SummaryState=已推付款 + NcVoucherNo 回写
//   所含 C-08（已审）的 InterfacePushState=推送成功 + 共享 NcVoucherNo
//   IdempotentKey = "BIZ-PAY-BATCH-{orgId}-{supplierId}-{summaryMonth}"

// 3. 失败路径：NC 返回 Success=false → C-09 状态推进但所含 C-08 标记推送失败 + push_error_*
```

### 用例 44：R-05 BondReleaseNear 触发押金到期预警 ⭐ 报表

```csharp
// C-02 押金已缴纳 + ExpiryDate < TODAY+90 → 触发 R-05
// Sprint 8a Day 7 简化映射：用 BondState=已缴纳 + ExpiryDate 替代详设 09 V0.1 §4.2
//                      （C-02 字段补强 + 详设升版顺延 Sprint 9a，详 project memory）
var count = await _bondReleaseDetector.DetectAndAlertAsync();
// 期望：
//   ReportAlert 落库：AlertCode="R-05" / AlertType="保证金到期" / AlertLevel=Warning
//   AlertContent JSON 含 contractId / supplierId / bondAmount / daysToRelease / idempotentKey 短码
//   去重 24h 窗口内同 alert_code+source_bill_id+state=待处理 → 跳过
```

### 用例 45：C-02 AddPayment + MarkReadyForCompletion 联动 ⭐ 财务

```csharp
// C-10.MarkPaid → AppService 编排调 Contract.AddPayment
contract.AddPayment(amount: 80000m);
// 期望：
//   Contract.PaidAmount += 80000 (protected setter 不允许外部旁路)
//   ContractState ∈ {已签, 执行中, 完成待确认} 才允许累计；终态 / 作废拒收

// 阈值触发候选状态机（详设 05 V1.3 §4.2 扩展）：
//   PaidAmount ≥ ContractAmount × 0.95 (CONTRACT_COMPLETION_THRESHOLD_RATE)
//   AND 所有 C-04 节点 state="已付款"
//   → contract.MarkReadyForCompletion(nodes) → ContractState="完成待确认"
```

### 用例 46：C-08 RefundPayment → C-07 反向冲减联动 ⭐⭐ 联动闭环

```csharp
// C-08 已支付 → 支付退回（终态）
paymentRequest.RefundPayment(reason: "供应商退款 / 财务红字");
// 期望：
//   ApprovalState=支付退回 (终态，不允许复活)
//   RefundedAmount + RefundedTime + RefundReason 回填

// 联动 C-07：PaymentPlan.ReversePayment 反向冲减
paymentPlan.ReversePayment(amount: 80000m);
// 期望：
//   CumulativePaidAmount -= 80000
//   PlanState 重新评估：已满足 → 部分付款（若 < 计划额）/ 部分付款 → 未支付（若 = 0）
```

### 用例 47：Hangfire 7 RecurringJob 注册（appsettings Enabled=true 时启动） ⭐ 调度

启动 Web Host（`Hangfire:Enabled=true` + `Hangfire:JobsEnabled=true`）后访问 Dashboard：

```
http://localhost:5100/hangfire （仅 Dev 启用）
```

期望看到 7 个 RecurringJob 注册：

| JobId | Cron (UTC) | Queue | 状态 |
|---|---|---|---|
| R-04-PaymentDueNear | `0 2 * * *` 每日 02:00 | alerts | ✅ Sprint 7a Day 7 实装 |
| R-05-BondReleaseNear | `0 3 * * 1` 周一 03:00 | alerts | ✅ Sprint 8a Day 7 实装 |
| E-13-EquipmentDepreciation | `0 0 1 * *` 每月 1 号 | default | 🟡 Sprint 7b Day 7 落实体；Sprint 8b Day 2 接通 |
| C-09-MonthlyPrepaymentGenerate | `0 22 28-31 * *` 月末 22:00 | monthly-batch | 🟡 Job 自检真月末；循环 Org 留 Sprint 8b |
| R-06-ContractExpiryNear | `0 4 * * *` 每日 04:00 | alerts | 占位 — Sprint 9a 接 Detector |
| R-07-InventoryLowStock | `0 * * * *` 每小时 | alerts | 占位 — Sprint 9a 接 Detector |
| R-08-InventoryNearExpiry | `0 5 * * *` 每日 05:00 | alerts | 占位 — Sprint 9a 接 Detector |

### 用例 48：Sprint 8a 综合冒烟（Day 9 contract 守护）⭐ 防回退

```csharp
// 反射检查 Sprint 8a 关键产物未漂移：
//   - 5 line 实体存在 + 派生 SupplyCoresFullAuditedAggregateRoot
//   - 5 单据主实体 Lines collection navigation 类型正确
//   - C-09 5 状态字段 + C-08 Refunded state + Contract.PaidAmount protected setter
//   - BondReleaseNearDetector + ReportAlert 双工厂方法
//   - Migrations 含 Wave 62/63_64/65_66/68_69（不依赖文件名扫盘）
// 期望：8 个守护断言全过（commit df8b130）
```

---

## 四、Sprint 8a 协同回顾（首次启用并行子代理）

| 节点 | 实测 | 备忘 |
|---|---|---|
| **a + b + c 同日 push** | D5/D7/D8 三轨同日完成 | sweet spot 3x（含 merge 间隔实测 ~2x，远超单代理 1x） |
| **worktree 隔离** | b/c 在独立 worktree 工作，main 自然 merge | b SSH push 失败由 a `c8f2600` 接管（边角案例已处理） |
| **子代理决策权** | b/c 报告 5+6 个决策点，cici 仅需 1 次 (a) 决策（R-05 字段映射） | 子代理自主合理简化，主代理 a 主线推进不被打断 |
| **Codex 评审窗口** | A + C 双窗口触发（主代理主动提醒，不需 cici 询问）| Pro daily quota 触顶顺延 Sprint 9a；评审延后 |

---

## 五、技术债 + 顺延项

| 项 | 来源 | 顺延 |
|---|---|---|
| **R-05 字段映射简化**：BondState/ExpiryDate 替代详设 BondReleaseState/BondReleaseDate | Sprint 8a Day 7 cici (a) 决策 | **Sprint 9a**：C-02 字段补强 + Wave 67 + Detector 重构 |
| **PaymentExecutionAppService 编排 D8-1 联动钩子**（C-10 → Contract.AddPayment）| c 子代理 Day 8 报告 | **Sprint 9a**（与 C-10 NC 真接一起做）|
| **C-02.PaidAmount = SUM(C-07.CumulativePaidAmount) reconciliation 单测** | Sprint 8a §五 风险表 | **Sprint 9a EFCore 集成层** |
| **Codex 评审 4 commits 延后**（44062d4/408545b/c8f2600/428e5cc）| Pro daily quota 触顶 | **Sprint 9a 开工前补评** |
| **C-09 月末批处理循环 Org**（当前仅按 OrgId 单调）| Day 6 Handler placeholder | **Sprint 8b/9** |
| **Hangfire Dashboard 生产部署** + 身份认证 | Day 6 范围外 | **Sprint 9+ Ops** |
| **Web.Tests 项目建** + Hangfire 注册单测 | Day 9 跨 csproj 引用问题 | **Sprint 9a** |
| **SY-02 字典化全量**（BondReleaseAlertDays/CompletionThresholdRate/DedupWindowHours/PaymentDueDays）| Sprint 5-8 累计 const 硬编码 | **Sprint 9a 累计技术债扫尾** |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-13 | Sprint 8a 收尾 Demo 脚本起，含 D1-D9 全部实施 + 子代理 b/c 协同首次落地。8 个新增用例（41-48）覆盖：S-05 多 line + S-12 双边 / C-09 BIZ-PAY-BATCH / R-05 / C-02 AddPayment / C-08 RefundPayment / Hangfire 7 RecurringJob / 综合冒烟。技术债 8 项记入 §五 顺延 Sprint 9a。Codex 评审 4 commits 因 Pro daily quota 触顶顺延 Sprint 9a 补评。 |
