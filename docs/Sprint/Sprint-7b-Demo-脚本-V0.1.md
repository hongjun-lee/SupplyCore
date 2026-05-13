# Sprint 7b Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** 实施层 · Sprint 7b 验收演示脚本
**配套：** [`Sprint-7b-任务卡-V0.1.md`](./Sprint-7b-任务卡-V0.1.md)（D10-3 验收物）
**并行轨道：** 与 Sprint 7a 库存台账 + 付款执行 平行落地

---

## 一、Sprint 7b 落地范围

按 V0.1 锁版结论（决策点 1-5 + 6b 接收消化），本 Sprint 实际交付 **10 PD / 10 天工作**：

| Day | 交付 | commit |
|---|---|---|
| D1 | E-08 BreakdownRequest 设备故障报修（4 状态 + 4 路径分流）+ Domain Manager 钩子 | `fc00968` (合并 Day 1-4) |
| D2-3 | E-07 SparePartIssuance 备件领用 + E-06 ScrappingApplication 报废处置 | `cb7840e` |
| D4 | Wave 49-51 EF mapping + Migration + AppService + Controller | `fc00968` |
| D5 | **E-11 LeaseBilling NC BIZ-LEASE 实装（决策点 2A）** — 含 E-11→C-08 PaymentRequestId 自动回写联动 | `2ff47ec` |
| D6 | **EquipmentStatusChange 日志型实体 + 10 transition 全埋点（决策点 3B）** + Wave 52 | `c177834` |
| D7 | **E-13 EquipmentDepreciation 资产折旧起步（决策点 4B 简化版）** + Wave 53 | `df5eb04` |
| D8 | Sprint7bEquipmentMaintenance E2E（4 路径分流）+ Sprint7bLeaseBillingNc E2E（NC 失败 + 决策点 2A 联动）| `2857cd5` |
| D9 | 全量回归 + sub_group_id 守护单测自动覆盖 b 新增 5 实体 | `2857cd5` |
| D10 | Sprint 7b Demo 脚本 + Sprint 8b 任务卡草案 | 本文档 |

**测试增量**：870 → **922**（+52）
- Domain.Tests **602**（+22）= EquipmentStatusChange 7 + EquipmentDepreciation 15
- Application.Tests **310**（+30）= LeaseBillingAppService 6 + EquipmentAppService 5 联动 + Sprint7bEquipmentMaintenance_E2E 5 + Sprint7bLeaseBillingNc_E2E 3 + Day 1-4 Sprint7b AppService 11
- EntityFrameworkCore.Tests **10**

**Migration**：基线 67 → 70（Sprint 7b 加 3：Wave 49-51 合并 Day 4 + LeaseBilling_BIZ_LEASE_Fields Day 5 + Wave 52 Day 6 + Wave 53 Day 7）

**详设备注**：
- 07 V1.0b 详设已经覆盖 E-06/E-07/E-08/E-13 字段表 + Equipment 7 状态机；equipment_status_change 表沿用 §5.2 命名（本期与 E-02 EquipmentCategory 解耦明确）。
- 决策点 2A E-11→C-08 联动凭证号约定：NC 返回 `NC-LEASE-PAY-{paymentRequestId}` 时自动回写；Sprint 8b 接真 NC 后由真实回执 schema 替换。
- 决策点 4B：E-13 Hangfire 月度调度顺延 Sprint 8b。
- 决策点 3B：EquipmentStatusChange AppService 触发，Domain 保持纯净；写入钩子 EquipmentStatusChangeManager。

---

## 二、回归用例（Sprint 1-7a 已落，共 32 项）

承接 `Sprint-7a-Demo-脚本-V0.x.md` 用例 1-32（含 Sprint 6a/6b 用例 23-32 设备建档 + 外委检修 + 租赁全链）；本次 Demo 仅列 Sprint 7b 新增 5 项（33-37）。

---

## 三、Sprint 7b 新增 Demo 用例（33-37）

### 用例 33：E-08 BreakdownRequest 4 路径分流 ⭐⭐

**目标：** 验证设备故障报修 4 状态机（草稿 → 待审 → 现场判定中 → 已分流）+ 4 路径联动钩子。

```bash
# 前置：Equipment id=5001 已 Active / InUse

# Path 1 — 现场修复（无关联实体）
POST /api/supply-cores/breakdown-requests
{
  "breakdownNo": "BD-2026-0001",
  "equipmentId": 5001,
  "reportedByPersonId": 88,
  "breakdownDate": "2026-06-15",
  "breakdownDescription": "1#减速箱异响",
  "severity": "普通"
}
POST /api/supply-cores/breakdown-requests/{id}/submit
POST /api/supply-cores/breakdown-requests/{id}/start-judgment
POST /api/supply-cores/breakdown-requests/{id}/dispatch
{ "resolutionPath": "现场修复", "onsiteJudgment": "紧固完成" }
# 期望：resolved_entity_id=null，无 E-05/E-07/E-06 派生

POST /api/supply-cores/breakdown-requests/{id}/close
{ "remark": "现场修复完毕" }
# 期望：breakdown_state=已分流（终态）

# Path 2 — 外委检修（派生 E-05 RepairApplication）
POST /api/supply-cores/breakdown-requests/{id2}/dispatch
{
  "resolutionPath": "外委检修",
  "onsiteJudgment": "需外委",
  "repairApplicationReason": "1#减速机故障外委检修",
  "repairEstimatedAmount": 50000
}
# 期望：
#   resolved_entity_type=RepairApplication，resolved_entity_id 回写真实 E-05.id
#   关联 E-05 状态=草稿，SubGroupId=42 端到端复制

# Path 3 — 备件领用（派生 E-07 SparePartIssuance）
POST /api/supply-cores/breakdown-requests/{id3}/dispatch
{
  "resolutionPath": "备件领用",
  "onsiteJudgment": "更换 1 件",
  "sparePartMaterialId": 99,
  "sparePartQuantity": 2
}
# 期望：resolved_entity_type=SparePartIssuance；E-07.breakdown_request_id 反向链 OK

# Path 4 — 报废（派生 E-06 ScrappingApplication）
POST /api/supply-cores/breakdown-requests/{id4}/dispatch
{
  "resolutionPath": "报废",
  "scrapReason": "主轴断裂报废"
}
# 期望：resolved_entity_type=ScrappingApplication；E-06.breakdown_request_id 反向链 OK
```

**验收点：**
- 4 路径分流 Dispatch 钩子原子性（state 切换 + 派生关联实体 + resolved_entity_id 回写 单事务）
- SubGroupId 端到端：Equipment(42) → BreakdownRequest(42 反查) → 派生实体(42 反查或复制)
- 反向 close 路径：现场修复 → close OK；其他路径需走完关联实体的状态机后再 close

---

### 用例 34：E-11 LeaseBilling NC BIZ-LEASE 实装 + 决策点 2A 联动 ⭐⭐⭐

**目标：** 验证 E-11→NC 推送 stub + NC 失败不阻断 + E-11→C-08 PaymentRequestId 自动回写联动。

```bash
# 前置：合同 LC-7B-001 (id=9001) 已 Performing，monthly_rate=30000

# 1. 创建 + 汇总
POST /api/supply-cores/lease-billings
{
  "billingNo": "LB-7B-001",
  "leaseContractId": 9001,
  "billingCycle": "按月",
  "billingStartDate": "2026-06-01",
  "billingEndDate": "2026-06-30",
  "billingDays": 30,
  "monthlyRate": 30000
}
POST /api/supply-cores/lease-billings/{id}/summarize
# 期望：billing_state=已汇总，payable_amount=30000

# 2. PushToPayment — 走 NC BIZ-LEASE 推送（Sprint 7b Day 5 新接入）
POST /api/supply-cores/lease-billings/{id}/push-to-payment
{ "paymentRequestId": null }
# 期望（成功路径）：
#   billing_state=已推付款
#   interface_push_state=推送成功
#   nc_voucher_no=NC-LEASE-... 回写
#   日志：[Info] E-11 NC BIZ-LEASE 推送成功

# 决策点 2A 联动 — NC 返回 NC-LEASE-PAY-{paymentRequestId} 时自动回写
# 测试场景：NC stub 返回 NC-LEASE-PAY-77777
# 期望：payment_request_id=77777 自动回写形成 E-11→C-08 联动

# 反向 1：NC 推送失败（5% 模拟概率）
# 期望：
#   billing_state=已推付款（事实仍成立 — 决策点 2A 守护）
#   interface_push_state=推送失败
#   push_error_code=NC-LEASE-ERR
#   日志：[Warn] E-11 NC BIZ-LEASE 推送失败（已推付款事实成立，不阻断）

# 反向 2：NC 异常（网络等）
# 期望：push_error_code=EXCEPTION，PushErrorMessage=异常消息
```

**验收点：**
- 决策点 2A NC BIZ-LEASE 实装：沿用 C-08 BIZ-PAY 模式（idempotent_key + push_error_* + nc_voucher_no）
- NC 失败 / 异常不阻断 PushedToPayment 状态转换
- 决策点 2A 联动：NC-LEASE-PAY-{id} 凭证号约定自动回写 PaymentRequestId 形成 E-11→C-08 联动
- 调用方手工传 paymentRequestId 优先级高于自动解析

---

### 用例 35：EquipmentStatusChange 日志型实体 + 10 transition 全埋点（决策点 3B）⭐⭐⭐

**目标：** 验证 Equipment 10 transition endpoint 全部显式落 EquipmentStatusChange 日志（决策点 3B：AppService 触发 + Domain 纯净）。

```bash
# 前置：Equipment id=5001 已 Active

# Equipment 走完整 7 状态闭环：Active → InUse → UnderRepair → Active → Leased → Active → PendingScrap → Scrapped
POST /api/supply-cores/equipments/{id}/put-in-use
POST /api/supply-cores/equipments/{id}/send-to-repair
POST /api/supply-cores/equipments/{id}/finish-repair
POST /api/supply-cores/equipments/{id}/lease
POST /api/supply-cores/equipments/{id}/unlease
POST /api/supply-cores/equipments/{id}/request-scrap?reason=退役
POST /api/supply-cores/equipments/{id}/approve-scrap

# 期望（每个 transition 都落一条日志，按 changed_at 排序查询）：
GET /api/supply-cores/equipment-status-changes?equipmentId=5001
# 结果：8 条日志（PutInUse / SendToRepair / FinishRepair / Lease / Unlease / RequestScrap / ApproveScrap + 起点 Activate）
# 每条字段：
#   equipment_id=5001
#   transition_type=Activate|PutInUse|...|ApproveScrap
#   before_state / after_state 字符串快照
#   changed_at UTC
#   changed_by_person_id（ICurrentUser 反查；测试环境 SystemPersonIdFallback=1）
#   sub_group_id=42（复制自 Equipment.SubGroupId）

# 反向：失败转换不落日志（Draft 直接 Lease → InvalidStateTransition）
POST /api/supply-cores/equipments/{id-draft}/lease
# 期望：BusinessException，无新日志
```

**验收点：**
- 10 transition endpoint 全埋点（含 V1.0a 兼容 3 transition + V1.0b 9 transition）
- TransitionAsync 统一入口：before_state 自动抓取 + state 转换后落日志（原子性）
- 失败 transition 不留日志（Domain 抛异常即返回，不调 EquipmentStatusChangeManager）
- AppService 触发，Domain 保持纯净（Equipment.cs 无日志写入逻辑）

---

### 用例 36：E-13 EquipmentDepreciation 月度折旧计算（决策点 4B 简化版） ⭐⭐

**目标：** 验证设备资产折旧直线法计算 + 4 状态机 + 同月幂等性。

```bash
# 前置：Equipment id=5001 OriginalValue=1_200_000，已 Active

# 1. 第 1 月折旧（默认参数）
POST /api/supply-cores/equipment-depreciations/calculate
{
  "equipmentId": 5001,
  "month": "2026-06-15"  # 自动取月初 2026-06-01
}
# 期望（直线法 + 默认 5% 残值 + 60 月使用年限）：
#   depreciation_method=直线法
#   salvage_value=60000（OriginalValue * 5%）
#   useful_life_months=60
#   monthly_depreciation_amount=19000  # (1200000 - 60000) / 60
#   accumulated_depreciation=19000
#   book_value=1181000  # 1200000 - 19000
#   depreciation_state=已计算
#   sub_group_id=42

# 2. 第 2 月折旧
POST /api/supply-cores/equipment-depreciations/calculate
{ "equipmentId": 5001, "month": "2026-07-01" }
# 期望：accumulated_depreciation=38000，book_value=1162000

# 3. 显式 SalvageValue + UsefulLifeMonths
POST /api/supply-cores/equipment-depreciations/calculate
{
  "equipmentId": 5001,
  "month": "2026-08-01",
  "salvageValue": 100000,
  "usefulLifeMonths": 120
}
# 期望：monthly_amount = (1200000 - 100000) / 120 = 9166.67

# 4. 归档
POST /api/supply-cores/equipment-depreciations/{id}/archive
# 期望：depreciation_state=已归档

# 5. 作废
POST /api/supply-cores/equipment-depreciations/{id2}/void
{ "reason": "录入错误" }
# 期望：depreciation_state=已作废，void_reason 回写

# 反向 1：同月幂等（已有 2026-06 → 再 calculate → DuplicateMonth）
POST /api/supply-cores/equipment-depreciations/calculate
{ "equipmentId": 5001, "month": "2026-06-30" }
# 期望：BusinessException SupplyCores:EquipmentDepreciation:DuplicateMonth

# 反向 2：SalvageValue 超过 OriginalValue
POST /api/supply-cores/equipment-depreciations/calculate
{ "equipmentId": 5001, "month": "2027-01-01", "salvageValue": 1500000 }
# 期望：BusinessException SalvageValueOutOfRange
```

**验收点：**
- 直线法计算口径：(OriginalValue - SalvageValue) / UsefulLifeMonths（2 位 ROUND_HALF_UP）
- 默认值：5% 残值 + 60 月使用年限（业务方未指定时回退）
- 同月幂等：(EquipmentId, DepreciationMonth) 唯一守护（作废记录不计）
- AccumulatedDepreciation 自动累加历史（不计 Draft / Voided）
- BookValue clamp >= 0
- 决策点 4B：手工触发；Hangfire 月度调度顺延 Sprint 8b

---

### 用例 37：sub_group_id 守护单测覆盖 b 新增 5 实体 ⭐

**目标：** 验证守护单测自动扫描新加业务实体，确保 SubGroupId / CreatedOrgId 写入钩子合规。

```bash
# 测试运行：
cd /Users/lihongjun/aizhetech/SupplyCores
dotnet test modules/nova.supplycores/test/Nova.SupplyCores.EntityFrameworkCore.Tests/ --filter "FullyQualifiedName~SubGroupIdHookCoverage"

# 期望：3 用例全过
#   1) All_Business_Aggregate_Roots_Should_Have_Protected_SubGroupId_Setter
#   2) All_Business_Aggregate_Roots_Should_Have_Protected_CreatedOrgId_Setter
#   3) SupplyCoresFullAuditedAggregateRoot_Should_Expose_SetSubGroupId_And_SetCreatedOrgId_Hooks

# Sprint 7b 新增 5 实体自动覆盖（反射扫描 SupplyCoresFullAuditedAggregateRoot 派生类）：
#   - BreakdownRequest
#   - SparePartIssuance
#   - ScrappingApplication
#   - EquipmentStatusChange
#   - EquipmentDepreciation
```

**验收点：**
- 反射式守护单测自动覆盖新增实体，无需手工补单测
- 全部新增实体 SubGroupId / CreatedOrgId setter 为 protected（继承基类钩子）

---

## 四、Sprint 6b / Sprint 7b 决策点接收消化

| 接收项 | 来源 | 本期处理 |
|---|---|---|
| equipment_status_change 日志型实体落地 | Sprint 5b B2 + Sprint 6b §四 | **Day 6 处理 ✅** |
| E-11 LeaseBilling NC BIZ-LEASE 接口实装 | Sprint 6b 决策点 4B 顺延 | **Day 5 处理 ✅** |
| 押金没收 SENS-LEASE-001 高敏感操作 | Sprint 6b Day 8 E-12 备忘 | **顺延 Sprint 8b**（详设升版后处理） |
| E-13 资产折旧 / 报废处置 | Sprint 6b 候选范围 C | **Day 3 / Day 7 处理 ✅**（E-06 D3 / E-13 D7 决策点 4B 简化版） |

---

## 五、Sprint 7b 决策点接收（顺延 Sprint 8b）

| 接收项 | 来源 | 顺延理由 |
|---|---|---|
| E-13 Hangfire 月度调度 | 决策点 4B 简化版 | 本期手工触发可用，月度自动调度需 Hangfire 集成（~1.5 PD）|
| AI 设备预警起步（基于 EquipmentStatusChange + E-08 历史模式分析） | 任务卡 V0.1 候选范围 | 09 详设需升版 + AI 模块设计 |
| R-05 BondReleaseNear 押金到期预警 | 任务卡 V0.1 候选范围 | 沿用 R-04 PaymentDueNear 模式（Sprint 8b 落地）|
| 押金没收 SENS-LEASE-001 | Sprint 6b 备忘 | 详设 07 V1.1 升版完成后处理 |

---

## 六、Demo 演示路径建议（30 分钟版）

1. **5 min**：Sprint 7b 范围 + 测试增量（922 全过 + Wave 49-53 + 1 字段补强 migration）+ 4 决策点接收
2. **10 min**：用例 33 — E-08 4 路径分流（运行 4 个 dispatch 请求，验证 4 关联实体派生 + state 推进）
3. **8 min**：用例 34 — E-11 LeaseBilling NC BIZ-LEASE 实装（演示成功 + 失败 + 决策点 2A 自动回写）
4. **7 min**：用例 35 — EquipmentStatusChange 10 transition 全埋点（GET 日志验证）

时间充裕时补：用例 36 折旧计算 + 用例 37 守护单测演示。

---

## 七、版本沿革

| 版本 | 日期 | 主要变更 |
|---|---|---|
| V0.1 | 2026-05-13 | 首版草案。Sprint 7b D10-2 验收物（10 PD 完整交付：E-06/E-07/E-08 + E-11 NC + EquipmentStatusChange + E-13 折旧起步）。决策点 1-5 全部 A 锁版且全部消化。回归用例 1-32 沿 Sprint 7a Demo；新增 33-37。 |
