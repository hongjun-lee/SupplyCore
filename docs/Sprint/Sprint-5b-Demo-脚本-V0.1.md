# Sprint 5b Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** 实施层 · Sprint 5b 验收演示脚本
**配套：** [`Sprint-5b-外委检修专项-任务卡-V0.2.md`](./Sprint-5b-外委检修专项-任务卡-V0.2.md)（B7-3 验收物）
**并行轨道：** 与 Sprint 5a 招投标闭环 平行落地，a 轨道 Demo 见 [`Sprint-5a-Demo-脚本-V0.1.md`](./Sprint-5a-Demo-脚本-V0.1.md)

---

## 一、Sprint 5b 落地范围

按 V0.2 锁版任务卡，本 Sprint 实际交付 **6.5 PD / 7 任务（B1-B7）**：

| 任务 | 交付 | 详设 / commit |
|---|---|---|
| B1 | 详设 05 V1.3 升版（C-02 加 equipment_id / overlimit_reason / overlimit_approval_id 三字段 + §8.7 收口到 C-02 主表）| SupplyCore commit `0487d1b` |
| B2 | E-01 Equipment + E-02 EquipmentCategory 设备主档（最小可用版 4 状态 + Wave 37-38）| 07 V1.0a §5.1 / §5.2 + commit `9e63340` |
| B3 | E-05 RepairApplication 外委检修申请（语义升级 + 6 状态机 + Wave 39）| 07 V1.0a §5.5 + commit `1670a66` |
| B4 | C-02 加 EquipmentId / OverlimitReason / OverlimitApprovalId + 40% 上限前置校验 + SENS-CON-004 attribute | 05 V1.3 §8.7.2 + commit `f43d762` |
| B5 | 4 审批模板 mock seed（WF-DIR-001 / WF-RPR-001 / WF-CON-OVERLIMIT-001 / WF-SUP-REASSESS-001）+ WorkflowTemplate Wave 40 | 10 V1.2a §6.1 + commit `a6fc49e` |
| B6-1 | Sprint5bRepairChain_E2E（7 用例，含 40% 上限 3 场景 + SENS-CON-004 反射 + 审批分档 + SubGroupId 链路）| commit `8d74faf` |
| B6-2/B6-3/B6-4 | sub_group_id 守护单测自动覆盖 b 新增 3 实体 + 全量回归 557 通过 + 与 a 主分支 rebase 集成回归 | — |
| B7-3 | Demo 脚本 + Sprint-6b 任务卡草案 | 本文档 |

**详设升版：**
- 05 V1.2 → V1.3（B1 升版：§4.2.1 C-02 三字段 + §8.7 外委检修 40% 上限规则收口到 C-02 主表）
- 07 V1.0a 沿用（V1.0b 升版决策点见 §六，留 Sprint 6b 处理：E-05 拆分 + Equipment 7 状态）

**决策点：** Sprint 5b B3 报告中识别的 3 个详设 07 升版决策点（E-05 拆分 / E-02 命名歧义 / Equipment 7 状态）已记入 Sprint-6b 草案 §四，本期不破坏既有契约前提下落到 V1.0a。

---

## 二、回归用例（Sprint 1-5a 已落，共 22 项）

承接 `Sprint-5a-Demo-脚本-V0.1.md` 用例 1-22；本次 Demo 仅列 Sprint 5b 新增 4 项（23-26）。

---

## 三、Sprint 5b 新增 Demo 用例（23-26）

### 用例 23：E-01 Equipment 设备主档生命周期 ⭐

**目标：** 验证设备主档 4 状态机 + EquipmentManager 写入钩子（CategoryId Active 强约束 + SubGroupId 链路 + OriginalValue > 0）。

```bash
# 前置：M-01 OrgId=100（SubGroupId=42）+ E-02 CategoryId=11（启用）

# 1. 创建设备草稿
POST /api/supply-cores/equipments
{
  "equipmentCode": "EQ-2026-0001",
  "equipmentName": "1#提升机",
  "categoryId": 11,
  "orgId": 100,
  "originalValue": 1000000.00,
  "specModel": "JKM-2.8×4(I)",
  "acquisitionDate": "2024-08-15"
}
# 期望：
#   equipment_state=草稿
#   sub_group_id=42（Manager 通过 OrgId → Org.SubGroupId 反查）
#   created_org_id=100
#   反向：CategoryId 不存在或停用 → CategoryNotActive
#   反向：OrgId=0 → OrgIdRequired

# 2. Submit 草稿 → 启用（OriginalValue > 0 强校验）
POST /api/supply-cores/equipments/{id}/submit
# 期望：equipment_state=启用
# 反向：OriginalValue=0 或 null → OriginalValueMustBePositive

# 3. 启用 → 停用（DisableReason 必填）
POST /api/supply-cores/equipments/{id}/disable
{ "reason": "故障停机检修中" }
# 期望：equipment_state=停用，disable_reason 回写

# 4. 启用 / 停用 → 报废（终态）
POST /api/supply-cores/equipments/{id}/scrap
{ "reason": "服役年限到期，2026 Q2 报废处置" }
# 期望：equipment_state=报废（终态），scrap_reason 回写
# 反向：草稿状态直接调 → InvalidStateTransition（必须先走 Submit 到启用）
```

**验收点：**
- 4 状态 transition：Draft / Active / Disabled / Scrapped（最小可用版骨架）
- CategoryId Active 强约束（C-4，沿用 BidResponseManager 风格）
- SubGroupId 链路：OrgId → Organization → SubGroupId=42
- OriginalValue > 0 强校验（Sprint 5b B4 外委检修 40% 上限计算基数前置）
- 7 状态扩展（草稿/启用/在用/租赁在用/维修中/停用/待报废/已报废）留 Sprint 6b

---

### 用例 24：E-05 RepairApplication 外委检修申请审批链 ⭐

**目标：** 验证外委检修申请 6 状态机 + 1万/10万 ApprovalLevel 分档 + Outsourced 模式启动校验。

```bash
# 前置：E-01 设备（OriginalValue=1,000,000）已启用；M-09 供应商 1 合格

# 1. 创建外委检修申请
POST /api/supply-cores/repair-applications
{
  "applyNo": "RA-2026-0001",
  "equipmentId": 5001,
  "estimatedAmount": 50000.00,
  "inspectionType": "外委",
  "applicationReason": "1#提升机减速箱年度检修",
  "repairMode": "外委",
  "repairContractId": 7001,
  "repairSupplierId": 1
}
# 期望：
#   application_state=草稿
#   sub_group_id=42（Manager: Equipment.OrgId → Org.SubGroupId 反查）
#   反向：Equipment 未启用 → EquipmentNotActive（C-4 强约束）
#   反向：InspectionType=未知 → InvalidInspectionType（M-1 白名单）

# 2. Submit 草稿 → 待审
POST /api/supply-cores/repair-applications/{id}/submit
# 期望：application_state=待审
# 反向：EstimatedAmount=0 → EstimatedAmountMustBePositive

# 3. Approve 待审 → 已审（按 ApprovedAmount 自动算 ApprovalLevel 分档）
POST /api/supply-cores/repair-applications/{id}/approve
{ "approvedAmount": 50000.00, "approverUserId": 999 }
# 期望：
#   application_state=已审
#   approved_amount=50000
#   approved_by=999
#   approval_level=公司级（10000 ≤ 50000 < 100000）

# 4. 反向分档场景：
#   ApprovedAmount=5,000 → approval_level=部门级（<10000）
#   ApprovedAmount=200,000 → approval_level=集团级（≥100000）

# 5. Start 已审 → 进行中（外委模式必填 RepairContractId + RepairSupplierId）
POST /api/supply-cores/repair-applications/{id}/start
# 期望：application_state=进行中
# 反向：InspectionType=外委 但 RepairContractId=null → RepairContractIdRequiredForOutsourced

# 6. Complete 进行中 → 已完工（结算附件必填）
POST /api/supply-cores/repair-applications/{id}/complete?settlementFileId=88888
# 期望：application_state=已完工，repair_settlement_file_id=88888

# 7. 反向 Reject：
POST /api/supply-cores/repair-applications/{id2}/reject
{ "reason": "工程量不实，需重新评估" }
# 期望：application_state=已驳回，reject_reason 回写
```

**验收点：**
- 6 状态 transition：Draft / PendingReview / Approved / Rejected / InProgress / Completed
- ApprovalLevel 三档：< 1 万 部门级 / 1-10 万 公司级 / ≥ 10 万 集团级（详设 §八 OUTSOURCED_REPAIR_APPROVAL_THRESHOLD_LOW/HIGH）
- C-4 Active 强约束：Equipment.EquipmentState=启用 才能引用
- 外委补充字段（RepairMode / RepairAmount / RepairContractId / RepairSupplierId）仅 Outsourced 启用
- WF-RPR-001 审批模板对应（mock，本期不接 Catio Workflow）

---

### 用例 25：C-02 外委检修合同 40% 上限校验 + SENS-CON-004 ⭐

**目标：** 验证 C-02 外委检修合同 40% 原值上限前置校验（Submit 阶段）+ ApproveOverlimitAsync 高敏感留痕。

```bash
# 前置：E-01 设备 EquipmentId=5001，OriginalValue=1,000,000；40% 上限 = 400,000

# ── 场景 a：Happy 不超阈 ──
POST /api/supply-cores/contracts
{
  "contractNo": "CT-OR-2026-001",
  "orgId": 100,
  "supplierId": 1,
  "contractType": "服务合同",
  "serviceSubtype": "外委检修",
  "contractName": "1#提升机减速箱外委检修合同",
  "contractAmount": 395500.00,
  "contractAmountExclTax": 350000.00,
  "taxAmount": 45500.00,
  "paymentTerms": "验收付款",
  "equipmentId": 5001,
  "contractDate": "2026-05-13",
  "effectiveDate": "2026-05-13"
}
POST /api/supply-cores/contracts/{id}/submit
# 期望：
#   contract_state=待审
#   不触发超阈值校验（350000 ≤ 400000）
#   不需要 OverlimitReason

# ── 场景 b：超阈值 + 无 OverlimitReason → 阻断 ──
POST /api/supply-cores/contracts
{
  ...
  "contractAmountExclTax": 500000.00,  # 超过 400000 上限
  "overlimitReason": null
}
POST /api/supply-cores/contracts/{id}/submit
# 期望：HTTP 400
# 错误码：SupplyCores:Contract:OverlimitReasonRequired
# 错误详情：
#   ContractAmountExclTax=500000
#   PriceCap=400000
#   OriginalValue=1000000
#   CapRatio=0.40
# 合同保留在 草稿 状态

# ── 场景 c：超阈值 + 有 OverlimitReason → 允许 + 后续走 SENS-CON-004 ──
POST /api/supply-cores/contracts
{
  ...
  "contractAmountExclTax": 500000.00,
  "overlimitReason": "独家供应商不可拆分整机改造，工期受限"
}
POST /api/supply-cores/contracts/{id}/submit
# 期望：
#   contract_state=待审（前置校验通过）
#   overlimit_reason 已保存
#   日志输出：Contract CT-... 外委检修合同金额 500000 超 40% 原值上限 400000 ...

POST /api/supply-cores/contracts/{id}/approve-overlimit?approvalId=88001
# 期望：
#   overlimit_approval_id=88001 回写
#   [SensitiveOperation("SENS-CON-004")] attribute 触发审计留痕
#   联动 WF-CON-OVERLIMIT-001 财务+设备管理+法务三方并行会签（mock）
# 反向：ContractType 不是 服务合同 → OverlimitApproveOnlyForOutsourcedRepair
# 反向：未填 OverlimitReason → OverlimitReasonRequired
# 反向：approvalId ≤ 0 → OverlimitApprovalIdRequired
```

**验收点：**
- 触发条件：ContractType=服务合同 AND ServiceSubtype=外委检修 AND EquipmentId 非空
- OUTSOURCED_REPAIR_PRICE_CAP_RATIO=0.40（SY-02 可配置，调整范围 30%-50%）
- 草稿阶段允许保存超阈（详设 §8.7.2 警告但允许），Submit 阶段强校验
- SENS-CON-004 attribute 反射验证：`ContractAppService.ApproveOverlimitAsync` 必须挂 `[SensitiveOperation("SENS-CON-004")]`
- 不修改合同状态机（沿用既有 Approve），仅回写 OverlimitApprovalId 留痕

---

### 用例 26：4 审批模板 mock seed 加载验证 ⭐

**目标：** 验证 V1.2a 新增 4 审批模板 seed 加载 + ApprovalChain JSON 结构 + 与既有 SensitiveOperation seed 共存。

```bash
# 前置：DbMigrator 已 apply Wave 40 + 全部 seed contributor 已运行

# 1. 查询全部模板
GET /api/supply-cores/workflow-templates
# 期望：返回 4 条
#   WF-DIR-001 非直达物资走直达通道审批     | PUR | 3 节点
#   WF-RPR-001 外委检修审批                  | RPR | 5 节点（含集团总经理终审）
#   WF-CON-OVERLIMIT-001 外委检修合同超 40% 原值加签 | CON | 3 节点（含并行会签）
#   WF-SUP-REASSESS-001 供应商重评估审批     | SUP | 4 节点

# 2. 按 TemplateCode 查询节点详情
GET /api/supply-cores/workflow-templates?templateCode=WF-CON-OVERLIMIT-001
# 期望 ApprovalChain (jsonb)：
# [
#   {"order":1,"nodeType":"发起","roleId":"BUYER","roleName":"采购人员/合同经办"},
#   {"order":2,"nodeType":"并行会签","roleId":"FIN+EQP+LEGAL",
#    "roleName":"财务人员+设备管理人员+法务人员",
#    "signMode":"COUNTERSIGN","minSignCount":3},
#   {"order":3,"nodeType":"终审","roleId":"GROUP_MAT_OR_GM",
#    "roleName":"集团物资管理/集团总经理（按金额分档）"}
# ]

# 3. 幂等性验证：重启 DbMigrator
docker-compose restart dbmigrator
# 期望：seed contributor 检测已存在 4 条 → 不重复插入
# 验证：workflow_template 表仍是 4 条

# 4. 共存验证：sensitive_operation 表仍是 22 条（含 SENS-CON-003 / SENS-CON-004）
GET /api/supply-cores/sensitive-operations
# 期望：22 条，b 新增的 4 模板 seed 加载不影响既有 SENS-* seed

# 5. WF-RPR-001 字段对齐（详设 07 §5.5 + 10 §6.2）
GET /api/supply-cores/workflow-templates?templateCode=WF-RPR-001
# 期望：
#   ModuleId=RPR
#   ApprovalChain 5 节点：发起 → 本单位审批 → 集团生技复核 → 集团分管领导 → 集团公司总经理
#   末节点 roleName 含 "集团" 和 "总经理"
```

**验收点：**
- 4 模板 TemplateCode 唯一 + 全部默认 Status=启用
- ApprovalChain JSON 结构：每节点必含 order / nodeType / roleName，order 严格递增 1..N
- WF-CON-OVERLIMIT-001 必含 signMode=COUNTERSIGN + minSignCount=3（详设 10 §6.2 并行会签）
- WF-RPR-001 5 节点 + 集团公司总经理终审（详设 07 §5.5 政策回填）
- Seed 幂等：按 TemplateCode 检查缺失则补，已存在则跳过（不删除现有）
- 6b 接 Catio Workflow V2 DSL 时由本 JSON 迁移到 ProcessDefinitionVersion.StepsConfig

---

## 四、E2E 主链回归

### 4.1 Sprint5bRepairChain_E2E（外委检修主链）

```bash
dotnet test --filter "FullyQualifiedName~Sprint5bRepairChain"

# 链路：
# E-01 Equipment 设备主档（OriginalValue=1,000,000；40% 上限 = 400,000）
#   → 草稿 → Submit → 启用
# → C-02 Contract 外委检修合同 + 40% 上限校验 3 场景：
#   a) Happy：ContractAmountExclTax=350,000 → SubmitAsync 通过 + Approve → Signed
#   b) 超阈 450,000 + null reason → BusinessException(OverlimitReasonRequired)
#   c) 超阈 450,000 + reason → SubmitAsync 通过 → ApproveOverlimitAsync → OverlimitApprovalId=88001
# → E-05 RepairApplication 外委检修申请审批闭环
#   → Draft → Submit → Approve(50000) → Start
#   → ApprovalLevel=公司级
# → SubGroupId 全链路继承（Org=42 → Equipment → Repair → Contract 全部 = 42）

# 验收点：
# - ApproveOverlimitAsync 反射验证 SENS-CON-004 attribute
# - RepairApplication 引用 草稿 设备 → EquipmentNotActive 阻断（C-4 强约束）
# - ApprovalLevel 分档：5k 部门 / 50k 公司 / 200k 集团（10000/100000 阈值）
# - SubGroupId 全链路 = 42 一致
```

### 4.2 sub_group_id 守护单测（EntityFrameworkCore.Tests）

```bash
dotnet test --filter "FullyQualifiedName~SubGroupIdHookCoverage"

# 反射扫所有 SupplyCoresFullAuditedAggregateRoot<TKey> 派生类
# 自动覆盖 Sprint 5b 新增 3 业务实体：Equipment / EquipmentCategory / RepairApplication
# 验收点：
# - 全部派生类 SubGroupId.set 非 public（protected/internal）
# - 全部派生类 CreatedOrgId.set 非 public
# - 基类暴露 SetSubGroupId / SetCreatedOrgId 钩子方法
# - 加新业务实体若暴露 public setter → 测试立刻失败（守护防线）
```

---

## 五、Demo 验收检查清单

- [ ] 用例 23-26 全部 200 OK
- [ ] Sprint 1-5a 用例 1-22 回归通过
- [ ] `dotnet test` 全套 ≥ 557 / 0 失败（基线 543 + B5 7 单测 + B6 7 E2E）
- [ ] EF migrations 全部 apply 成功（Sprint 5b 新增 Wave 37-40 共 4 条：E-01 / E-05 / Contract OverlimitFields / WorkflowTemplate）
- [ ] sub_group_id 守护单测自动覆盖 Sprint 5b 新增 3 业务实体（Equipment / EquipmentCategory / RepairApplication）
- [ ] WorkflowTemplate seed 4 条加载 + 幂等性验证
- [ ] SENS-CON-004 attribute 反射验证通过（ApproveOverlimitAsync）
- [ ] 详设 05 V1.2 → V1.3 升版文档入库（B1 已落 commit `0487d1b`）
- [ ] **a 主分支集成回归**：rebase a 最新 push 后全套测试再跑一次

---

## 六、Sprint 6b 决策点待消化

| 决策点 | 来源 | 处理时机 |
|---|---|---|
| 详设 07 V1.0a → V1.0b 升版：E-05 拆为 RepairApplication（审批型 6 状态）+ EquipmentInspectionRecord（执行型 4 状态）| Sprint 5b B3 报告 | Sprint 6b 详设升版 + 代码层拆分 |
| E-02 命名歧义：EquipmentCategory（设备分类字典）vs equipment_status_change（详设 07 §5.2 状态变更日志）| Sprint 5b B2 报告 | Sprint 6b 统一命名（实体保持 EquipmentCategory）|
| Equipment 状态机扩展到 7 状态（含 在用 / 租赁在用 / 维修中 / 外委检修中 / 待报废 / 已报废）| Sprint 5b B2 报告 | Sprint 6b 状态机扩展 + 转换矩阵 |

详见 [`Sprint-6b-任务卡-V0.1.md`](./Sprint-6b-任务卡-V0.1.md) §四。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版，配合 Sprint-5b-V0.2 锁版后 B7-3 验收物。覆盖 4 新增 Demo 用例（23-26）+ Sprint5bRepairChain_E2E 主链（7 用例）+ sub_group_id 守护单测自动覆盖 3 新增实体。Sprint 6b 决策点 3 条记入 §六，留 6b 处理。|
