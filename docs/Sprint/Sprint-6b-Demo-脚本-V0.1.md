# Sprint 6b Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** 实施层 · Sprint 6b 验收演示脚本
**配套：** [`Sprint-6b-任务卡-V0.2.md`](./Sprint-6b-任务卡-V0.2.md)（D10-3 验收物）
**并行轨道：** 与 Sprint 6a 库存出入库 + 付款流程 平行落地，a 轨道 Demo 见 [`Sprint-6a-Demo-脚本-V0.1.md`](./Sprint-6a-Demo-脚本-V0.1.md)

---

## 一、Sprint 6b 落地范围

按 V0.2 锁版 6 决策点（5A + 1A，全 A），本 Sprint 实际交付 **10 PD / 10 天工作**：

| Day | 交付 | commit |
|---|---|---|
| D1 | 详设 07 V1.0b 升版（SupplyCore 仓库）：E-05 拆 + Equipment 7 状态 + 转换矩阵 | `SupplyCore` 详设 commit |
| D2-3 | E-05a EquipmentInspectionRecord 执行型实体（4 状态机）+ E-05 联动钩子（StartAsync 自动派生 EIR）+ Wave 41 | `ee3bdbd` |
| D4 | Equipment 7 状态扩展 + 10 transition + 15 边转换矩阵（详设 §5.1.1）| `c3c640f` |
| D5 | E-03 Manufacturer 厂家字典 + E-04 InstallationLocation 安装位置字典（Wave 43/44）| `38e6be7` |
| D6-8 | E-09 LeaseContract + E-10 EquipmentEntry + E-11 LeaseBilling + E-12 EquipmentExit 租赁闭环（Wave 45-48）| `2667ea3` |
| D9-1 | Sprint6bEquipmentLifecycle_E2E 设备租赁全链路（5 用例）| `9ad450d` |
| D9-2 | Sprint6bRepairExecution_E2E 外委检修主链（3 用例）| `cb0d631` |
| D10 | Demo-6b + Sprint-7b 草案 | 本文档 |

**测试**：727 → **735**（Sprint 6b 新增 8 用例 — Day 9-1 + 5 / Day 9-2 + 3）：
- Domain.Tests 467
- Application.Tests 258（+8）
- EntityFrameworkCore.Tests 10

**Migration**：基线 40 → 48（Sprint 6b 加 8：Wave 41/43/44/45/46/47/48 + Day 4 Equipment 7 状态升版无 schema 改动）

**详设备注**：
- 07 V1.0a → V1.0b 升版同期完成（SupplyCore 详设仓库；Sprint 6b 实施同步落代码）。
- E-05 → E-05a 拆分本期落地（决策点 1A 锁版）；E-02 命名最终保留 EquipmentCategory（决策点 6A 锁版）；equipment_status_change 日志型实体留 Sprint 7b。
- E-11 LeaseBilling NC BIZ-LEASE 接入顺延 Sprint 7b（决策点 4B 锁版）：本期 `PushToPaymentAsync` 仅 `_logger.LogInformation` 占位。

---

## 二、回归用例（Sprint 1-6a 已落，共 27 项）

承接 `Sprint-6a-Demo-脚本-V0.1.md` 用例 1-27（含 Sprint 5b 用例 23-26 设备建档 + 外委检修审批）；本次 Demo 仅列 Sprint 6b 新增 5 项（28-32）。

---

## 三、Sprint 6b 新增 Demo 用例（28-32）

### 用例 28：E-03 Manufacturer + E-04 InstallationLocation 字典创建 ⭐

**目标：** 验证厂家字典 + 安装位置字典最小可用版（沿用 E-02 EquipmentCategory 字典模式）。

```bash
# 1. E-03 厂家字典创建（关联 M-09 Supplier）
POST /api/supply-cores/manufacturers
{
  "manufacturerCode": "MF-2026-0001",
  "manufacturerName": "中信重工机械股份",
  "supplierId": 1,
  "country": "中国",
  "remarks": "国内 1#提升机主力厂商"
}
# 期望：
#   manufacturer_state=启用
#   sub_group_id=42（Manager 通过 OrgId 反查；Wave 43 字段表）
# 反向：SupplierId 不存在 → SupplierNotFound

# 2. E-04 安装位置字典创建（树状层级 FK→M-01）
POST /api/supply-cores/installation-locations
{
  "locationCode": "LOC-MINE-A-01",
  "locationName": "A 矿井 1 段",
  "parentLocationId": null,
  "orgId": 100,
  "locationType": "工作面"
}
# 期望：
#   location_state=启用
#   parent_location_id=NULL（顶级节点）
#   sub_group_id=42

# 3. 创建子节点（树状层级）
POST /api/supply-cores/installation-locations
{
  "locationCode": "LOC-MINE-A-01-01",
  "locationName": "A 矿井 1 段 1 工区",
  "parentLocationId": <id1>,
  "orgId": 100,
  "locationType": "工区"
}
# 期望：parent_location_id 回填，形成树状层级
```

**验收点：**
- 字典型实体最小可用版（沿用 E-02 EquipmentCategory 模式）
- E-03 FK→M-09 Supplier 子集守护
- E-04 树状 ParentLocationId 自引用 FK
- SubGroupId 链路：OrgId → Organization.SubGroupId
- 留作 Sprint 7b E-13+ 设备资产折旧 / E-06 维修工单 字典依赖

---

### 用例 29：Equipment 7 状态扩展全转换矩阵演示 ⭐⭐

**目标：** 验证 Equipment 从 V1.0a 4 状态升级到 V1.0b 7 状态（详设 §5.1.1 mermaid 15 边转换矩阵）。

```bash
# 前置：用例 23 已落 Equipment 4 状态最小版骨架；V1.0b 升 7 状态 + 10 transition 入口

# 1. 草稿 → 启用（#1 Activate；与 V1.0a Submit 兼容）
POST /api/supply-cores/equipments
{ "equipmentCode": "EQ-LC-001", "equipmentName": "2#塔吊", "categoryId": 11, "orgId": 100, "originalValue": 2000000 }
POST /api/supply-cores/equipments/{id}/activate
# 期望：equipment_state=启用

# 2. 启用 → 在用（#2 PutInUse；E-02 status_change 驱动）
POST /api/supply-cores/equipments/{id}/put-in-use
# 期望：equipment_state=在用

# 3. 在用 → 启用（#3 Return；E-02 status_change 收回）
POST /api/supply-cores/equipments/{id}/return
# 期望：equipment_state=启用

# 4. 启用 → 维修中（#7 SendToRepair；由 RepairApplication.Start 联动钩子驱动）
# 见用例 30 RepairApplication 自动联动；不允许直接调（仅作占位 endpoint）

# 5. 启用 → 租赁在用（#4 Lease；由 EquipmentEntry.Confirm 联动钩子驱动）
# 见用例 31 LeaseContract 全链路

# 6. 启用 → 待报废（#10 RequestScrap；ScrapReason 必填）
POST /api/supply-cores/equipments/{id2}/request-scrap?reason=服役年限到期
# 期望：equipment_state=待报废，scrap_reason 回写

# 7. 待报废 → 报废（#12 ApproveScrap；终态）
POST /api/supply-cores/equipments/{id2}/approve-scrap
# 期望：equipment_state=报废（终态）

# 反向：在 维修中 / 待报废 / 已报废 等状态调 SendToRepair → InvalidStateTransition
POST /api/supply-cores/equipments/{id2}/send-to-repair
# id2 已是 报废 → InvalidStateTransition
```

**验收点：**
- 7 状态：Draft / Active / InUse / Leased / UnderRepair / PendingScrap / Scrapped
- 10 transition（与 15 边转换矩阵对齐；V1.0b §5.1.1）
- V1.0a 兼容：Submit / Approve / Scrap 保留（Sprint 5b B6 既有测试不破）
- 历史 V1.0a Disabled (停用) 状态退役；DisableReason 字段保留作历史数据兼容载体
- 业务约束守护（如 Leased 状态不能 SendToRepair，必须先 Unlease）

---

### 用例 30：RepairApplication → EquipmentInspectionRecord 自动联动 + Equipment 状态联动 ⭐⭐

**目标：** 验证 E-05 RepairApplication.Start 触发 1）派生 E-05a EIR 草稿 + 2）Equipment.SendToRepair 联动；E-05a.Complete 触发 Equipment.FinishRepair 回写。

```bash
# 前置：Equipment id=5001 已 Active 状态（OriginalValue=1,000,000；SubGroupId=42）

# 1. E-05 创建外委检修申请
POST /api/supply-cores/repair-applications
{
  "applyNo": "RA-2026-0001",
  "equipmentId": 5001,
  "estimatedAmount": 50000,
  "inspectionType": "外委",
  "applicationReason": "1#提升机减速箱外委检修",
  "repairMode": "外委",
  "repairContractId": 7777,
  "repairSupplierId": 1
}
# 期望：
#   application_state=草稿
#   sub_group_id=42（Equipment.OrgId → Org 反查）

# 2. Submit → Approve（公司级；50000 ∈ [10000, 100000) → ApprovalLevel=公司级）
POST /api/supply-cores/repair-applications/{id}/submit
POST /api/supply-cores/repair-applications/{id}/approve?approvedAmount=50000&approverUserId=999

# 3. Start → 触发联动钩子（详设 §5.5 业务规则 4 + §5.1.1 #7）
POST /api/supply-cores/repair-applications/{id}/start
# 期望：
#   application_state=进行中
#   联动 1：Equipment.SendToRepair → equipment_state=维修中（5001）
#   联动 2：E-05a EIR 自动派生（status=待执行，record_no=EIR-YYYYMMDD-{repair.id}，sub_group_id=42 从 E-05 复制）

# 查询新派生的 EIR
GET /api/supply-cores/equipment-inspection-records?repairApplicationId={repairId}
# 期望：1 条记录，record_state=待执行，repair_application_id 关联

# 4. EIR.Start（待执行 → 执行中）
POST /api/supply-cores/equipment-inspection-records/{eirId}/start
# 期望：record_state=执行中，actual_start_time 回写

# 5. EIR.Complete（执行中 → 已完成；联动 Equipment.FinishRepair）
POST /api/supply-cores/equipment-inspection-records/{eirId}/complete
{
  "inspectionResult": "合格",
  "acceptancePersonId": 88,
  "acceptanceOpinion": "减速箱齿轮检修合格，外观无异常"
}
# 期望：
#   record_state=已完成
#   actual_complete_time 回写
#   联动：Equipment.FinishRepair → equipment_state=启用（5001 回归 Active；详设 §5.1.1 #9）

# 反向 1：外委 Start 缺合同号 / 供应商
POST /api/supply-cores/repair-applications
{ ..., "inspectionType": "外委", "repairContractId": null, "repairSupplierId": null }
# Submit + Approve OK；Start → RepairContractIdRequiredForOutsourced
# 重要：Equipment 仍 Active，EIR 未派生（联动事务整体未触发）

# 反向 2：EIR Cancel 不回写 Equipment
POST /api/supply-cores/equipment-inspection-records/{eirId2}/cancel?reason=现场判定无需检修
# 期望：record_state=已取消，Equipment 仍是 维修中（业务侧补 E-02 留痕）
```

**验收点：**
- RepairApplication.Start 联动 2 步（自动派生 EIR + Equipment.SendToRepair）原子性
- E-05a EIR 由 RepairApplicationAppService 直接 InsertAsync（详设 §5.5a R-1 限制）
- E-05a.Complete 联动 Equipment.FinishRepair（UnderRepair → Active）
- E-05a.Cancel 不联动 Equipment（任务卡 V0.2 决策：业务侧通过 E-02 补留痕）
- SubGroupId 全链：Equipment(42) → RepairApplication(42 反查) → EIR(42 复制源 E-05)

---

### 用例 31：E-09 → E-10 → E-11 → E-12 租赁全链路（含 Equipment.Lease / Unlease 联动）⭐⭐⭐

**目标：** 验证设备租赁全链路 4 实体（E-09 / E-10 / E-11 / E-12）+ 2 处状态联动钩子（Lease / Unlease）+ E-11 计费规则。

```bash
# 前置：Equipment id=5001 已 Active；Supplier id=1 lessor；OrgId=100 lessee

# 1. E-09 LeaseContract：创建 → Submit → Sign
POST /api/supply-cores/lease-contracts
{
  "leaseContractNo": "LC-2026-0001",
  "lessorId": 1,
  "lesseeOrgId": 100,
  "equipmentId": 5001,
  "startDate": "2026-05-13",
  "endDate": "2026-11-13",
  "totalAmount": 60000,
  "depositAmount": 10000,
  "monthlyRate": 10000,
  "billingCycle": "按月"
}
# 期望：lease_contract_state=草稿，sub_group_id=42（LesseeOrgId 反查 — 任务卡 V0.2 双 OrgId 取承租方）

POST /api/supply-cores/lease-contracts/{id}/submit
POST /api/supply-cores/lease-contracts/{id}/sign
# 期望：lease_contract_state 推进到 待审 → 已签

# 2. E-10 EquipmentEntry：Create → Register → Confirm
POST /api/supply-cores/equipment-entries
{
  "entryNo": "EE-2026-0001",
  "leaseContractId": {contractId},
  "initialReading": 1000,
  "handoverCondition": "外观完好"
}
# 期望：entry_state=草稿，equipment_id=5001（从合同冗余复制），sub_group_id=42

POST /api/supply-cores/equipment-entries/{id}/register
{ "entryDate": "2026-05-13", "handoverCondition": "经检查正常" }
# 期望：entry_state=已登记

POST /api/supply-cores/equipment-entries/{id}/confirm
{ "confirmedByPersonId": 77 }
# 期望：
#   entry_state=已确认，confirmed_at 回写
#   联动 1：Equipment.Lease → equipment_state=租赁在用（5001；详设 §5.1.1 #4）
#   联动 2：LeaseContract.Start → lease_contract_state=履行中

# 3. E-11 LeaseBilling：第 1 个月（按月，BillingDays=30）
POST /api/supply-cores/lease-billings
{
  "billingNo": "LB-2026-0001",
  "leaseContractId": {contractId},
  "equipmentEntryId": {entryId},
  "billingCycle": "按月",
  "billingStartDate": "2026-05-13", "billingEndDate": "2026-06-12",
  "billingDays": 30,
  "monthlyRate": 10000,
  "adjustmentAmount": 0
}
POST /api/supply-cores/lease-billings/{id}/summarize
# 期望：billing_state=已汇总，payable_amount=10000.00（10000 × 30/30 + 0）

POST /api/supply-cores/lease-billings/{id}/push-to-payment
{ "paymentRequestId": null }
# 期望：
#   billing_state=已推付款
#   日志：[Info] E-11 LeaseBilling[{Id}] PushToPayment 占位：留 Sprint 7b 接 NC BIZ-LEASE
# 决策点 4B 锁版：本期不实装 NC BIZ-LEASE 推送

POST /api/supply-cores/lease-billings/{id}/write-back-actual
{ "actualPaidAmount": 10000 }
# 期望：billing_state=已回写实付，actual_paid_amount=10000

# 4. 第 2 月计费（含 -500 调整）
POST /api/supply-cores/lease-billings { ..., "adjustmentAmount": -500 }
POST /api/supply-cores/lease-billings/{id2}/summarize
# 期望：payable_amount=9500

# 5. E-12 EquipmentExit：Create → Exit → Close
POST /api/supply-cores/equipment-exits
{
  "exitNo": "EX-2026-0001",
  "leaseContractId": {contractId},
  "entryId": {entryId},
  "plannedExitDate": "2026-11-13"
}
# 期望：deposit_amount=10000（合同 DepositAmount 快照复制），equipment_id=5001（从 entry 复制）

POST /api/supply-cores/equipment-exits/{id}/exit
{
  "actualExitDate": "2026-11-13",
  "depositReturnedAmount": 10000,
  "equipmentCondition": "完好交还",
  "finalReading": 1500
}
# 期望：exit_state=已退场，全额退还押金（无需 deposit_deduction_reason）

POST /api/supply-cores/equipment-exits/{id}/close
# 期望：
#   exit_state=已结案
#   联动 1：LeaseContract.Finish → lease_contract_state=已结束
#   联动 2：Equipment.Unlease → equipment_state=启用（5001 回归 Active；详设 §5.1.1 #6）

# 反向 1：合同未 Sign 直接 Confirm Entry → 阻断
# Entry Manager: ContractNotSigned

# 反向 2：合同未 Performing 直接 Create Exit → 阻断
# Exit Manager: ContractNotPerforming

# 反向 3：Entry 未 Confirmed 直接 Create Exit → 阻断
# Exit Manager: EntryNotConfirmed
```

**验收点：**
- 4 实体 + 9 状态机：LeaseContract (5) + Entry (3) + Billing (4) + Exit (3)
- 2 联动钩子：EntryConfirm（Lease + Start）+ ExitClose（Finish + Unlease）
- 押金快照复制（Exit.DepositAmount = Contract.DepositAmount，避免后续修改影响结案）
- E-11 计费规则：按日 = days × dailyRate + adjust；按月 = monthlyRate × (days/30) + adjust
- 决策点 4B：NC BIZ-LEASE 顺延 Sprint 7b，本期 log 占位

---

### 用例 32：E-12 押金扣款 + DepositReturnedAmount 计算 ⭐

**目标：** 验证押金退还规则（部分扣款必填扣款原因；全额没收必填扣款原因；超退押金阻断）。

```bash
# 前置：用例 31 第 5 步前 — Entry 已 Confirmed，合同 Performing，DepositAmount=5000

POST /api/supply-cores/equipment-exits
{
  "exitNo": "EX-DD-0001",
  "leaseContractId": {contractId},
  "entryId": {entryId},
  "plannedExitDate": "2026-08-13"
}
# 期望：deposit_amount=5000（合同快照）

# 场景 A：部分扣款未填扣款原因 → 阻断
POST /api/supply-cores/equipment-exits/{id}/exit
{ "actualExitDate": "2026-08-13", "depositReturnedAmount": 3000, "equipmentCondition": "轻微磨损" }
# 期望：DepositDeductionReasonRequired

# 场景 B：补上扣款原因 → 通过
POST /api/supply-cores/equipment-exits/{id}/exit
{
  "actualExitDate": "2026-08-13",
  "depositReturnedAmount": 3000,
  "depositDeductionReason": "齿轮磨损扣 2000",
  "damageAmount": 2000,
  "equipmentCondition": "轻微磨损"
}
# 期望：exit_state=已退场，deposit_returned_amount=3000，deposit_deduction_reason 回写，damage_amount=2000

# 场景 C：超退押金（returned > deposit）→ 阻断
POST /api/supply-cores/equipment-exits/{id2}/exit
{ ..., "depositReturnedAmount": 6000 }   # > deposit_amount=5000
# 期望：DepositReturnedExceedsDeposit

# 场景 D：押金全额没收（returned=0）必填扣款原因
POST /api/supply-cores/equipment-exits/{id3}/exit
{ "actualExitDate": "2026-08-13", "depositReturnedAmount": 0 }
# 期望：DepositDeductionReasonRequired

POST /api/supply-cores/equipment-exits/{id3}/exit
{ "actualExitDate": "2026-08-13", "depositReturnedAmount": 0, "depositDeductionReason": "设备损毁，押金全额没收" }
# 期望：exit_state=已退场，押金全部扣除
```

**验收点：**
- 部分扣款（returned < deposit）必填 DepositDeductionReason
- 全额没收（returned == 0 且 deposit > 0）必填 DepositDeductionReason
- 超退（returned > deposit）阻断
- DamageAmount 字段独立记录损坏赔偿（与押金扣款解耦，留作 Sprint 7b 押金没收候选 SENS-LEASE-001 参考）
- 备忘：押金没收高敏感操作 SENS-LEASE-001 留 Sprint 7b 实装

---

## 四、E2E 主链回归

### 4.1 Sprint6bEquipmentLifecycle_E2E（设备租赁全链路）

```bash
dotnet test --filter "FullyQualifiedName~Sprint6bEquipmentLifecycle"

# 5 用例覆盖：
# 1. FullLeaseLifecycle_From_Equipment_To_Exit_Should_Complete_Happy_Path
#    Equipment(Active) → LeaseContract(Submit/Sign) → Entry(Register/Confirm 联动) →
#    Billing × 2（含 -500 调整）→ Exit（全额退押金）/Close 联动
#
# 2. EquipmentExit_With_DepositDeduction_Should_Require_Reason
#    部分退还押金未填扣款原因 → 阻断；补上 → 通过
#
# 3. LeaseBilling_Daily_Should_Compute_PayableAmount_By_DailyRate
#    按日计费：DailyRate=500 × Days=10 = 5000
#
# 4. EquipmentEntry_Confirm_Should_Block_When_Equipment_Not_Leasable
#    Equipment 处于 UnderRepair 时 Confirm → Equipment.Lease EnsureState 阻断
#
# 5. SubGroupId_Should_Propagate_Across_Lease_Chain
#    SubGroupId=42 全链 5 实体共享（Org → Equipment → Contract → Entry → Billing/Exit）
```

### 4.2 Sprint6bRepairExecution_E2E（外委检修主链）

```bash
dotnet test --filter "FullyQualifiedName~Sprint6bRepairExecution"

# 3 用例覆盖：
# 1. FullChain_Equipment_To_RepairApplication_To_EIR_Complete_Should_Pass
#    Equipment(Active) → RepairApplication(Submit/Approve/Start 联动 Equipment.SendToRepair
#    + 派生 EIR 草稿) → EIR.Start → EIR.Complete（联动 Equipment.FinishRepair）
#
# 2. RepairApplication_Start_Without_Outsourced_Fields_Should_Block
#    外委检修缺 RepairContractId / RepairSupplierId 时 Start 阻断；Equipment 仍 Active；EIR 未派生
#
# 3. EIR_Cancel_Should_Not_Touch_Equipment_State
#    EIR Cancel 不回写 Equipment（Equipment 仍 UnderRepair，业务侧补 E-02 留痕）
```

### 4.3 配套 Sprint 5b RepairChain E2E（Sprint 6b Day 2-3 升版后仍 7 用例全过）

```bash
dotnet test --filter "FullyQualifiedName~Sprint5bRepairChain"
# 7 用例：40% 上限 3 场景 + SENS-CON-004 反射 + 审批分档 + SubGroupId 链路
# Sprint 6b Day 2-3 升版后 RepairApplicationAppService 加 inspectionRepo / inspectionManager / equipmentRepo 3 依赖，测试已同步加 wire-up
```

---

## 五、Demo 验收检查清单

- [ ] 用例 28-32 全部 200 OK
- [ ] Sprint 1-6a 用例 1-27 回归通过
- [ ] `dotnet test` 全套 **735 / 0 失败**（基线 727 + Day 9-1 5 + Day 9-2 3）
- [ ] EF migrations Wave 41/43/44/45/46/47/48 全部 apply 成功（dev.aizhetech.com）
- [ ] sub_group_id 守护单测自动覆盖 Sprint 6b 新增 10 实体（Equipment 升 7 状态 / EquipmentCategory / Manufacturer / InstallationLocation / RepairApplication / EquipmentInspectionRecord / LeaseContract / EquipmentEntry / LeaseBilling / EquipmentExit；反射扫所有 SupplyCoresFullAuditedAggregateRoot 派生类）
- [ ] RepairApplication.Start 联动钩子双步原子性验证（自动派生 EIR + Equipment.SendToRepair）
- [ ] EquipmentEntry.Confirm 联动钩子双步原子性验证（Equipment.Lease + LeaseContract.Start）
- [ ] EquipmentExit.Close 联动钩子双步原子性验证（LeaseContract.Finish + Equipment.Unlease）
- [ ] E-11 LeaseBilling PushToPayment 日志占位（NC BIZ-LEASE 顺延 Sprint 7b）
- [ ] **a 主分支集成回归**：与 Sprint 6a Day 9 主分支 merge 后 735 全过

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版，配合 Sprint-6b-V0.2 锁版后 D10-3 验收物。覆盖 5 新增 Demo 用例（28-32 — E-03/E-04 字典 / Equipment 7 状态扩展 / RepairApplication-EIR 联动 / 租赁全链路 / 押金扣款）+ 2 E2E 主链回归（EquipmentLifecycle + RepairExecution）。Sprint 6b 全 10 PD 完成，commit 链：详设 07 V1.0b 升版（SupplyCore 仓）→ `ee3bdbd`（D2-3 EIR 拆分）→ `c3c640f`（D4 Equipment 7 状态）→ `38e6be7`（D5 E-03/E-04 字典）→ `2667ea3`（D6-8 租赁闭环）→ `9ad450d` / `cb0d631`（D9 E2E）。全量回归 **735 通过**（基线 727 + 新增 8 E2E）。Wave 41/43-48 共 7 个 migration。决策点接收：(1A) E-05 本期拆 ✅；(2A) Equipment 完整 7 状态 ✅；(3A) E-03 独立实体 ✅；(4B) E-11 NC BIZ-LEASE 顺延 Sprint 7b（log 占位）；(5A) b 独立轨道 ✅；(6A) 保留 EquipmentCategory ✅。equipment_status_change 日志型实体留 Sprint 7b 单独落。 |
