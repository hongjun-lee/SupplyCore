# Sprint 4 Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** 实施层 · Sprint 4 验收演示脚本
**配套：** Sprint-4-任务卡-V0.2.md（D10-4 验收物）

---

## 一、Sprint 4 落地范围

按 V0.2 锁版 6 决策点，本 Sprint 实际交付 **10 PD / 9 天工作**（D9 改机会窗口未占主线）：

| Day | 交付 | 详设 |
|---|---|---|
| D1-2 | T-03 标包 + T-04 采购文件 + T-05 PackageId NOT NULL 收口 | 04 V1.1 §4.10 / §4.11 |
| D3 | C-04 付款节点 + C-06 终止单 + C-03 条款 entity 字段 | 05 V1.1/V1.2 §4.3-4.4 / §4.6 |
| D4-5 | 履约保证金（详设 05 V1.1→V1.2 升版 + C-02 8 字段 + 状态机 + SENS-CON-003）⭐ | 05 V1.2 §4.2.1 + §8.6 |
| D6 | S-04 质检让步（让步入库联动 S-05）| 06 V1.1 §4.3 |
| D7-8 | Sprint4FullChain E2E + 守护单测 + 全量回归 | — |
| D9 | Stage B1 机会窗口 → 延 Sprint 5（OAuth / 08B 回函未到） | V0.2 决策点 3 |
| D10 | Demo 脚本 + Sprint 5 草案 | — |

**测试 345 全过**（Sprint 3 基线 264 → +81）：Domain 220 / App 115 / EFCore 10

---

## 二、回归用例（Sprint 1-3 已落，共 14 项）

承接 `Sprint-3-Demo-脚本-V0.1.md` 中 14 项；本次 Demo 脚本仅列 Sprint 4 新增 4 项。

---

## 三、Sprint 4 新增 Demo 用例（15-18）

### 用例 15：T-03 标包全生命周期 + T-04 采购文件版本管理

**目标：** 验证标包从草稿到结案的 5 状态流转 + 流标重发 + 采购文件 4 状态。

```bash
# 1. 创建标包（来源 T-01 招标申请，sub_group_id 自动继承）
POST /api/supply-cores/tender-packages
{
  "tenderAppId": 1,
  "packageCode": "PKG-2026-001",
  "packageName": "钢丝绳一标段",
  "totalEstimateAmount": 500000.00,
  "minSupplierCount": 3,
  "qualifiedSupplierIds": "[1,2,3]"
}
# 期望：状态 待标，sub_group_id 已写

# 2. 发标
POST /api/supply-cores/tender-packages/{id}/publish
# 期望：状态 已发标，publish_date 自动填

# 3. 评标完成
POST /api/supply-cores/tender-packages/{id}/complete-evaluation
# 期望：状态 已评标

# 4. 公示
POST /api/supply-cores/tender-packages/{id}/announce
# 期望：状态 已公示

# 5. 结案
POST /api/supply-cores/tender-packages/{id}/close
# 期望：状态 已结案

# 6. 创建 T-04 招标文件 under T-03
POST /api/supply-cores/procurement-documents
{
  "packageId": {id},
  "docType": "招标文件",
  "docTitle": "钢丝绳采购招标文件 V1.0",
  "attachmentId": 100,
  "uploadBy": 1,
  "docVersion": "V1.0"
}
POST /api/supply-cores/procurement-documents/{docId}/publish

# 7. 升版（先创建新版本 → 旧版 Supersede）
POST /api/supply-cores/procurement-documents
{ ... "docVersion": "V1.1" }
POST /api/supply-cores/procurement-documents/{oldDocId}/supersede
{ "newDocId": {newDocId} }
# 期望：旧版 状态=已更新，superseded_by={newDocId}

# 8. 流标场景：重新创建一个标包测试 Fail → Restart
POST /api/supply-cores/tender-packages/{id2}/publish
POST /api/supply-cores/tender-packages/{id2}/fail
{ "reason": "响应不足" }
# 期望：状态 流标

POST /api/supply-cores/tender-packages/{id2}/restart
{ "decisionMeetingId": 99 }
# 期望：状态 待标，restart_count=1
```

**验收点：**
- T-03 8 transition 全通：Publish / CompleteEvaluation / Announce / Reopen / Close / Fail / Restart / Void
- T-04 3 transition：Publish / Supersede / Void
- T-05 PackageId NOT NULL 已收口（migration 已 apply）

---

### 用例 16：C-04 付款节点 + C-06 合同终止单

**目标：** 验证付款节点 4 状态流转 + 合同终止 4 状态。

```bash
# 1. 创建 C-04 付款节点（来源 C-02 合同，sub_group_id 从 C-02 复制）
POST /api/supply-cores/contract-payment-nodes
{
  "contractId": 1,
  "paymentNodeNo": 1,
  "paymentCondition": "合同签订",
  "paymentPercentage": 0.3,
  "paymentAmount": 150000.00
}
# 期望：状态 待满足

# 2. 条件触发（关联采购入库单据）
POST /api/supply-cores/contract-payment-nodes/{id}/confirm-condition-met
{ "sourceBillType": "purchase_receipt", "sourceBillId": 999 }
# 期望：状态 已满足，condition_source_bill_* 回填

# 3. 标记已付款
POST /api/supply-cores/contract-payment-nodes/{id}/mark-paid
{ "paymentPlanId": 42 }
# 期望：状态 已付款（终态）

# 4. 创建 C-06 终止单
POST /api/supply-cores/contract-terminations
{
  "termNo": "TN-2026-001",
  "contractId": 1,
  "terminationType": "协议终止",
  "terminationReason": "双方协商终止",
  "terminationDate": "2026-05-13"
}

# 5. 提交审批
POST /api/supply-cores/contract-terminations/{id}/submit
# 期望：状态 待审

# 6. 审批通过
POST /api/supply-cores/contract-terminations/{id}/approve?approverUserId=99
# 期望：状态 已审，approved_by=99
```

---

### 用例 17：履约保证金全链 ⭐

**目标：** 验证 V1.2 履约保证金自动触发 + 状态机 + SENS-CON-003 高敏感。

```bash
# 1. 创建大额合同（≥20 万 + 非"直接采购"→ 触发 bond_required）
POST /api/supply-cores/contracts
{
  "contractNo": "CT-BOND-001",
  "orgId": 100,
  "supplierId": 1,
  "contractType": "采购合同",
  "contractName": "高额钢丝绳采购合同",
  "contractAmount": 500000.00,
  ...
}

# 2. Submit + Approve（Approve 自动判定 bond_required）
POST /api/supply-cores/contracts/{id}/submit
POST /api/supply-cores/contracts/{id}/approve
# 期望：
#   contract_state=已签
#   bond_required=true
#   bond_amount=50000（10%）
#   bond_state=待缴纳

# 3. 缴纳保证金（银行保函）
POST /api/supply-cores/contracts/{id}/pay-bond
{ "bondForm": "BANK_GUARANTEE" }
# 期望：bond_state=已缴纳，bond_paid_date 回填

# 4. 验收合格后退还
POST /api/supply-cores/contracts/{id}/release-bond
{ "trigger": "ACCEPTANCE_PASSED" }
# 期望：bond_state=已退还，bond_release_trigger=ACCEPTANCE_PASSED

# 5. 没收场景（另一个合同，触发 SENS-CON-003 高敏感留痕）
POST /api/supply-cores/contracts/{id2}/forfeit-bond
{ "reason": "供应商严重违约停产 30 日" }
# 期望：
#   bond_state=已没收
#   bond_forfeit_reason 回填
#   OperationLog 记录加 [SENS-CON-003] 前缀（A-11 高敏感留痕）
```

**对比小额合同（不触发）：**
```bash
POST /api/supply-cores/contracts
{ "contractAmount": 100000.00, "contractType": "采购合同", ... }
POST /api/supply-cores/contracts/{id}/submit
POST /api/supply-cores/contracts/{id}/approve
# 期望：bond_required=false，bond_state=null
```

---

### 用例 18：S-04 质检让步 + 让步入库联动 S-05

**目标：** 验证质检 5 状态 + 让步数量自动联动 S-05。

```bash
# 1. 创建质检单（来源 S-03 到货验收）
POST /api/supply-cores/quality-inspections
{
  "inspectionNo": "QC-2026-001",
  "receiptId": 1,
  "orgId": 100,
  "inspectionMethod": "抽检",
  "sampleQuantity": 10
}
# 期望：状态 待检，sub_group_id=42

# 2. 检验员接单
POST /api/supply-cores/quality-inspections/{id}/start-inspection?inspectorId=99
# 期望：状态 检验中，inspector_id=99，inspection_date 回填

# 3. 检验完成（含让步数量 30 → 联动 S-05 让步入库）
POST /api/supply-cores/quality-inspections/{id}/complete
{
  "qualifiedQuantity": 60,
  "unqualifiedQuantity": 10,
  "concessionQuantity": 30,
  "inspectionResult": "让步接收",
  "disposalSuggestion": "让步接收"
}
# 期望：
#   状态 已检验
#   S-05 自动创建：receipt_type=让步入库，total_quantity=30
#   联动失败不阻断（日志记录）

# 4. 不合格转待验区场景
POST /api/supply-cores/quality-inspections/{id2}/start-inspection?inspectorId=99
POST /api/supply-cores/quality-inspections/{id2}/reject-to-holding
{ "reason": "品种不符（短路终止）" }
# 期望：状态 不合格转待验区，unqualified_reason 回填
```

---

## 四、E2E 主链回归（Sprint4FullChain）

```bash
# 单测式 E2E 已落（Sprint4FullChain_E2E_Tests.cs，单测 1 个）：
dotnet test --filter "FullyQualifiedName~Sprint4FullChain"

# 链路：
# T-01 → T-03 标包全生命周期 → T-04 文件
# → C-02 Submit → Approve（bond_required 自动触发）→ PayBond → ReleaseBond
# → C-04 付款节点 → C-06 终止单
# → S-04 质检让步 → S-05 让步入库联动

# 验收点：
# - SubGroupId=42 全链路端到端继承
# - bond_amount=50000（10% × 500000）
# - IStockInboundAppService.CreateAsync 让步入库被调用 1 次（receipt_type=让步入库, quantity=30）
```

---

## 五、Demo 验收检查清单

- [ ] 用例 15-18 全部 200 OK
- [ ] Sprint 1-3 用例 1-14 回归通过
- [ ] `dotnet test` 全套 345 / 0 失败
- [ ] `docker compose up` 容器内跑全套
- [ ] EF migrations 全部 apply 成功（含本期 4 条：Add_TenderPackage_ProcurementDocument / TenderResult_PackageId_NotNull / Add_ContractClause_PaymentNode_Termination / Add_Contract_BondFields / Add_QualityInspection — 实际 5 条）
- [ ] sub_group_id 守护单测自动覆盖 Sprint 4 新增 6 实体（T-03/T-04/C-03/C-04/C-06/S-04）
- [ ] SENS-CON-003 OperationLog 写入验证（forfeit-bond 调用后查 a.operation_log 含 [SENS-CON-003] 前缀）
- [ ] 详设 05 V1.1 → V1.2 升版文档入库 + git log 留痕

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版，配合 Sprint-4-任务卡-V0.2 锁版后 D10-4 验收物 |
