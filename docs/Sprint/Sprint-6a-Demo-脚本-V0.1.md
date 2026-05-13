# Sprint 6a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** 实施层 · Sprint 6a 验收演示脚本
**配套：** [`Sprint-6a-任务卡-V0.2.md`](./Sprint-6a-任务卡-V0.2.md)（D10-3 验收物）
**并行轨道：** 与 Sprint 6b 设备运维强化 平行落地，b 轨道 Demo 见 [`Sprint-6b-Demo-脚本-V0.1.md`](./Sprint-6b-Demo-脚本-V0.1.md)（由 b 输出）

---

## 一、Sprint 6a 落地范围

按 V0.2 锁版 5 决策点（全 A），本 Sprint 实际交付 **10 PD / 10 天工作**：

| Day | 交付 | commit |
|---|---|---|
| D1-2 | S-10 StockReturn 退料入库 + NC BIZ-MR stub + Wave 31 | `f9393a2` + `36dcf4c` |
| D3 | S-12 StockTransfer 跨组织调拨 + Wave 32 | `31b5d36` |
| D4-5 | 招采平台真接框架（ITenderPlatformApiService + Mock + TenderPlatformBatchService）| `8c3d069` |
| D6-7 | C-07 PaymentPlan 付款计划 + C-04 自动联动 + Wave 33 | `f2faa9e` |
| D8 | C-08 PaymentRequest 付款申请 + NC BIZ-PAY stub + C-07 ApplyPayment 累计回写 + Wave 34 | `34110b4` |
| D9 | Sprint6aPaymentChain_E2E + Sprint6aDownstreamChain_E2E（6 用例全过）| `db3d8ea` |
| D10 | Demo-6a + Sprint-7a 草案 | 本文档 |

**测试**：557 → **727**（Sprint 6a +98 / Sprint 6b +72 = +170）：
- Domain.Tests 467
- Application.Tests 250
- EntityFrameworkCore.Tests 10

**Migration**：31 → 40（Sprint 6a 加 5：Wave 31/32/33/34 + 招采平台真接无 schema 改动）

**详设备注**：
- C-07 PaymentPlan 实施按详设 05 V1.3 §4.7 的 **4 状态**（待满足/已满足/部分付款/已完成），非任务卡 V0.2 §1.1 误写的"5 状态审批流转"。详设是业务条件流转，非审批流转。
- S-12 实施加 1 个 Voided（已作废）= 6 状态，保留实务必要（与 S-06/S-10 模式对齐）。

---

## 二、回归用例（Sprint 1-5 已落，共 22 项）

承接 `Sprint-5a-Demo-脚本-V0.1.md` 用例 1-22 + Sprint 5b Demo 用例（如有）；本次 Demo 仅列 Sprint 6a 新增 5 项。

---

## 三、Sprint 6a 新增 Demo 用例（23-27）

### 用例 23：S-10 StockReturn 退料入库 + NC BIZ-MR ⭐

**目标：** 验证 5 状态机 + 双轨 SubGroupId 钩子 + NC 红字模式失败不阻断。

```bash
# 前置：S-09 领料单 ID=1 已出库，TotalQuantity=100，SubGroupId=42

# 1. 创建退料单（SubGroupId 从 S-09 复制，C-02 模式）
POST /api/supply-cores/stock-returns
{
  "returnNo": "MR-2026-001",
  "issuanceId": 1,
  "orgId": 100,
  "warehouseId": 1,
  "usageUnitId": 100,
  "returnDate": "2026-05-13",
  "returnReason": "未用完退料",
  "totalReturnQuantity": 30,
  "totalReturnAmount": 3000
}
# 期望：return_state=草稿，sub_group_id=42
# 反向：S-09 未出库（草稿/待审等）→ SourceIssuanceNotIssued
# 反向：return_qty > S-09.TotalQuantity → ReturnQuantityExceedsIssuance

# 2. 提交 → 审核
POST /api/supply-cores/stock-returns/{id}/submit
POST /api/supply-cores/stock-returns/{id}/approve?approverUserId=99

# 3. 确认退料 → 触发 NC BIZ-MR 推送
POST /api/supply-cores/stock-returns/{id}/confirm-return
# 期望：
#   return_state=已退（终态）
#   interface_push_state=推送成功
#   nc_voucher_no=NC-MR-xxx
#   idempotent_key=BIZ-MR-MR-2026-001-100

# 4. NC 失败场景 — 已退事实仍成立（沿用 S-06 BIZ-RED 模式）
# return_state=已退，interface_push_state=推送失败 + push_error_*

# 5. 反向：作废仅允许草稿
POST /api/supply-cores/stock-returns/{id2}/void
{ "reason": "..." }
# 草稿状态可作废；已审/已退状态 → InvalidStateTransition

# 6. 反向：驳回退回草稿（允许修改重提）
POST /api/supply-cores/stock-returns/{id3}/reject
{ "reason": "数量错误" }
# 期望：return_state=草稿，reject_reason 回填
```

**验收点：**
- 5 状态 transition：Draft / PendingReview / Approved / Returned / Voided
- 双轨 SubGroupId 钩子：S-09 复制 / OrgId 反查备路
- 强约束：S-09.IssuanceState=已出库 + ReturnQuantity ≤ S-09.TotalQuantity
- NC BIZ-MR 失败不阻断 ConfirmReturn
- 备忘：S-09 累计退料量回写 + S-21 库存落账留 Sprint 7a 接 S-13 时实装

---

### 用例 24：S-12 StockTransfer 跨组织调拨

**目标：** 验证 6 状态机 + 跨组织约束 + SubGroupId 取源组织。

```bash
# 1. 创建调拨单（FromOrg=100 调出，ToOrg=200 调入）
POST /api/supply-cores/stock-transfers
{
  "orderNo": "TR-2026-001",
  "fromOrgId": 100,
  "toOrgId": 200,
  "fromWarehouseId": 1,
  "toWarehouseId": 2,
  "transferDate": "2026-05-13",
  "totalQuantity": 50,
  "totalAmount": 5000
}
# 期望：
#   transfer_order_state=草稿
#   sub_group_id=42（取源组织 FromOrgId=100 反查，不是 ToOrgId=200 反查 → 88）
# 反向：FromOrgId=ToOrgId → CrossOrgRequired（同组织内调拨用 S-21 内部移库）

# 2. 提交 → 审核
POST /api/supply-cores/stock-transfers/{id}/submit
POST /api/supply-cores/stock-transfers/{id}/approve?approverUserId=99

# 3. 调出确认（OutConfirmPersonId 回填 + ShippedTime）
POST /api/supply-cores/stock-transfers/{id}/ship?outConfirmPersonId=88
# 期望：
#   transfer_order_state=已发出
#   out_confirm_person_id=88, shipped_time 回填
# 备忘：调出方库存扣减留 Sprint 7a 接 S-13

# 4. 调入签收（终态）
POST /api/supply-cores/stock-transfers/{id}/receive?inConfirmPersonId=77
# 期望：
#   transfer_order_state=已签收（终态）
#   in_confirm_person_id=77, received_time 回填
# 备忘：调入方库存增加 + S-21 落账留 Sprint 7a

# 5. 反向：跳过 Ship 直接 Receive
POST /api/supply-cores/stock-transfers/{id2}/receive?inConfirmPersonId=77
# 已审状态 → InvalidStateTransition

# 6. 反向：误开作废
POST /api/supply-cores/stock-transfers/{id3}/void
{ "reason": "..." }
# 草稿状态可作废；已审及之后 → InvalidStateTransition
```

**验收点：**
- 6 状态 transition：Draft / PendingReview / Approved / Shipped / Received / Voided
- 跨组织约束（FromOrgId ≠ ToOrgId）
- SubGroupId 取源组织（任务卡 V0.2 锁版 D3-2 规则）
- 备忘：详设原始"已冲销"状态留 Sprint 7a 接 S-21 时实装

---

### 用例 25：T-06 招采平台真接 batch 导入 / 导出 ⭐

**目标：** 验证 ITenderPlatformApiService 抽象 + Mock 实现 + 协调服务 + T-06 日志写入。

```bash
# 1. batch 导入（Mock 模拟外部平台拉 5 条投标响应）
POST /api/supply-cores/tender-platform-batch/import?packageId=100&tenderAppId=1&operatorId=99
# 期望：
#   total_count=5, success_count=5, fail_count=0
#   log_state=成功
#   T-06 日志 1 条写入（sync_direction=导入, sync_type=招采结果）
#   5 条 T-08 BidResponse 自动创建（import_source=平台导入, platform_bid_code 填）

# 2. 幂等场景：重复调 import → 平台返回相同 platform_bid_code
POST /api/supply-cores/tender-platform-batch/import?packageId=100&tenderAppId=1&operatorId=99
# 期望：success_count=5（Sprint 5a C-3 幂等去重，返回已有记录不计 fail）

# 3. batch 导出（先评定再导出，前置 mock 已落）
POST /api/supply-cores/tender-platform-batch/export?packageId=100&tenderAppId=1&operatorId=99
# 期望：T-06 日志写入（sync_direction=导出）

# 4. 失败场景（mock 整批拉取失败）
# log_state=失败，error_detail=NETWORK_TIMEOUT
```

**验收点：**
- ITenderPlatformApiService 抽象 + MockTenderPlatformApiService Mock 默认实现
- ImportBatch 协调：拉外部 → BidResponseAppService.CreateAsync 循环 → T-06 LogAsync
- 幂等去重（Sprint 5a C-3 复用：(import_source=平台导入, platform_bid_code) 唯一）
- 失败重试 Sprint 7+ 接 Polly + OAuth 凭据真接（替换 Mock）

---

### 用例 26：C-07 PaymentPlan 自动联动（C-04 → C-07）⭐⭐

**目标：** 验证 C-04 创建即生成 C-07 草稿 + C-04 ConfirmConditionMet → C-07 MarkFulfilled。

```bash
# 1. 创建 C-04 付款节点（自动联动生成 C-07）
POST /api/supply-cores/contract-payment-nodes
{
  "contractId": 1,
  "paymentNodeNo": 1,
  "paymentCondition": "合同签订",
  "paymentPercentage": 1.0,
  "paymentAmount": 100000
}
# 期望（C-04）：
#   node_state=待满足，sub_group_id=42
#   payment_plan_id 回填（联动创建的 C-07 ID）

# 同时查 C-07
GET /api/supply-cores/payment-plans?contractId=1
# 期望：
#   1 条记录（自动生成）
#   plan_state=待满足，condition_fulfilled=false
#   plan_amount=100000，remaining_amount=100000
#   sub_group_id=42（从 C-04 复制）

# 2. C-04 条件满足触发 C-07 MarkFulfilled
POST /api/supply-cores/contract-payment-nodes/{id}/confirm-condition-met
{ "sourceBillType": "contract_signed" }
# 期望：
#   C-04.node_state=已满足
#   C-07.plan_state=已满足，condition_fulfilled=true

# 3. C-07 只读 endpoint（详设 §4.7.3 §1 不允许手工独立新建）
GET /api/supply-cores/payment-plans/{planId}
# 不支持 POST /api/supply-cores/payment-plans → 404 / 405
```

**验收点：**
- C-04.CreateAsync → 自动 InsertAsync PaymentPlan（不需要手工 Create endpoint）
- C-04.ConfirmConditionMetAsync → 联动 PaymentPlan.MarkFulfilled
- PaymentPlanId 回填到 C-04（详设 §4.4 字段）
- C-07 AppService 只暴露 Get / List 只读 endpoint

---

### 用例 27：C-08 PaymentRequest 付款申请 + NC BIZ-PAY + C-07 累计回写 ⭐⭐

**目标：** 验证 5 状态机 + 三单匹配 + NC BIZ-PAY 失败不阻断 + C-07 ApplyPayment 联动。

```bash
# 前置：用例 26 落地后 C-07 plan_state=已满足

# 1. 第 1 笔预付款申请（豁免三单匹配）
POST /api/supply-cores/payment-requests
{
  "requestNo": "PA-2026-001",
  "contractId": 1, "supplierId": 1,
  "paymentPlanId": 1, "paymentNodeId": 1, "orgId": 100,
  "requestAmount": 30000,
  "isPrepayment": true
}
# 期望：approval_state=草稿，sub_group_id=42（从 C-07 复制）

# 2. 提交（预付款豁免三单匹配）→ 审批通过 → 触发 NC BIZ-PAY + C-07 ApplyPayment
POST /api/supply-cores/payment-requests/{id}/submit
POST /api/supply-cores/payment-requests/{id}/approve?approverUserId=99
# 期望：
#   approval_state=已审
#   interface_push_state=推送成功，nc_voucher_no=NC-PAY-xxx
#   idempotent_key=BIZ-PAY-PA-2026-001-100

# 同时查 C-07 累计回写
GET /api/supply-cores/payment-plans/1
# 期望：
#   cumulative_paid_amount=30000，remaining_amount=70000
#   plan_state=部分付款

# 3. 第 2 笔尾款申请（70%）
POST /api/supply-cores/payment-requests
{ "requestNo": "PA-2026-002", "paymentPlanId": 1, ..., "requestAmount": 70000, "isPrepayment": true }
POST /api/supply-cores/payment-requests/{id2}/submit
POST /api/supply-cores/payment-requests/{id2}/approve?approverUserId=99
# 期望：C-07 cumulative=100000, remaining=0, plan_state=已完成

# 4. 第 3 笔尝试 → 阻断（C-07 已完成）
POST /api/supply-cores/payment-requests
{ ... "paymentPlanId": 1, "requestAmount": 10000 }
# 期望：PaymentPlanNotFulfilled 异常

# 5. NC BIZ-PAY 失败场景（mock NcPushResult.Success=false）
# 已审事实仍成立，C-07 联动仍执行（NC 推送与业务联动解耦）
# interface_push_state=推送失败 + push_error_*

# 6. 非预付款场景（必须三单匹配）
POST /api/supply-cores/payment-requests
{ ..., "isPrepayment": false, "invoiceAmount": 30000, "invoiceNo": "INV-001" }
POST /api/supply-cores/payment-requests/{id}/submit
# 期望：ReceiptCheckRequired 阻断

POST /api/supply-cores/payment-requests/{id}/complete-receipt-check?checkedByPersonId=88
# 期望：receipt_check=true，receipt_check_by=88

POST /api/supply-cores/payment-requests/{id}/submit
# 期望：approval_state=待审，通过

# 7. MarkPaid（模拟 NC 实付回执；Sprint 7+ 由 NC 回执服务自动触发）
POST /api/supply-cores/payment-requests/{id}/mark-paid
# 期望：approval_state=已支付（终态），paid_time 回填
```

**验收点：**
- 5 状态 transition：Draft / PendingReview / Approved / Paid / Rejected
- 三单匹配（详设 §4.8.3）：合同 + 入库 + 发票，预付款豁免
- C-07 ApplyPayment 联动：累计回写 + plan_state 推进 部分付款 → 已完成
- NC BIZ-PAY 失败不阻断 Approve（已审事实成立，沿用 BIZ-RED 模式）
- 详设原始 7 状态（审中/支付退回）简化掉，Sprint 7+ 实装

---

## 四、E2E 主链回归

### 4.1 Sprint6aPaymentChain_E2E（付款全链）

```bash
dotnet test --filter "FullyQualifiedName~Sprint6aPaymentChain"

# 链路：
# C-02 → C-04 创建 → C-07 自动生成（plan_state=待满足）
# → C-04 ConfirmConditionMet → C-07 MarkFulfilled
# → C-08 申请 1（30% 预付款）→ Submit → Approve → C-07 partially_paid + NC BIZ-PAY
# → C-08 申请 2（70% 尾款）→ Submit → Approve → C-07 completed
# → C-08 MarkPaid（模拟 NC 回执）
# → C-08 申请 3 → 阻断（C-07 已完成）

# 验收点：
# - SubGroupId=42 全链端到端
# - C-04 PaymentPlanId 回填
# - C-07 cumulative_paid + remaining_amount 恒等式
# - NC BIZ-PAY Push 2 次（每笔 Approve 各 1）
```

### 4.2 Sprint6aDownstreamChain_E2E（供应链下游）

```bash
dotnet test --filter "FullyQualifiedName~Sprint6aDownstreamChain"

# 链路 1（S-09 → S-10 退料）：
# S-09 mock 已出库 → S-10 创建（SubGroupId 从 S-09 复制）
# → Submit → Approve → ConfirmReturn → NC BIZ-MR
# 包含 NC 失败不阻断验证

# 链路 2（S-12 跨组织调拨）：
# S-12 创建（SubGroupId 取源组织）→ Submit → Approve → Ship → Receive
# 包含同组织约束阻断验证
```

---

## 五、Demo 验收检查清单

- [ ] 用例 23-27 全部 200 OK
- [ ] Sprint 1-5 用例 1-22 回归通过
- [ ] `dotnet test` 全套 ≥ 727 / 0 失败
- [ ] EF migrations Wave 31-34 全部 apply 成功（dev.aizhetech.com）
- [ ] sub_group_id 守护单测自动覆盖 Sprint 6a 新增 5 实体（S-10/S-12/C-07/C-08 + 招采平台真接无新 entity）
- [ ] C-04 → C-07 自动联动验证（C-04 Create 后查 C-07 自动出现）
- [ ] C-08 → C-07 ApplyPayment 累计回写验证（CumulativePaid + Remaining 恒等式）
- [ ] NC BIZ-MR / BIZ-PAY 失败场景：已退/已审事实仍成立，仅 push_error_* 标记
- [ ] **b 主分支集成回归**：merge b 主分支后全套测试再跑一次（b 5pm Shanghai 重启后 Day 9 集成 E2E 完成时）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版，配合 Sprint-6a-V0.2 锁版后 D10-3 验收物。覆盖 5 新增 Demo 用例（23-27 — S-10/S-12/招采平台真接/C-07/C-08）+ 2 E2E 主链回归（PaymentChain + DownstreamChain）。Sprint 6a 全 10 PD 完成，commit 链：`f9393a2` / `36dcf4c` / `31b5d36` / `8c3d069` / `f2faa9e` / `34110b4` / `db3d8ea`。全量回归 **727 通过**（基线 557 + Sprint 6a 98 + Sprint 6b 72 = 727）。Wave 31-34 共 4 个 migration。|
