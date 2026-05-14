# Sprint 19a B1 — 12 类审批模板设计 V0.2（锁版）

**项目**：阜矿物资供应管理系统 / SupplyCore
**版本**：V0.2（锁版 · cici 2026-05-15 一键采纳 9 决策点）
**日期**：2026-05-15
**文档性质**：详细设计层 · 配套实施稿
**配套**：
- 详设 10 V1.2 §6.1 `审批流程清单` / §6.2 `审批流节点模板示例`
- Sprint-19a-任务卡-V0.2.md §一 副轨 B（19a-B1 / B2 / B3 / B4）
- 已实现基础设施：Sprint 13a A-20 ApprovalInstance + ApprovalInstanceManager（NCalc 已接通）

---

## 一、设计目的与边界

### 1.1 目的

承接详设 10 V1.2 §6.1 共 22 类审批模板清单（V1.2 / V1.2a / V1.3 累计），补完 Sprint 13a + Sprint 16a 后**剩余 12 类**审批模板的**详细 chain 设计 + DataSeed 计划 + A-20 接入测试计划**，确保 Sprint 19a 副轨 B 可在不依赖 NC 端反馈的前提下独立落地。

### 1.2 现有 10 类模板已实现盘点

| TemplateCode | 来源 | seed 落点 |
|---|---|---|
| WF-DIR-001 | Sprint 5b B5 | `WorkflowTemplateDataSeedContributor` |
| WF-RPR-001 | Sprint 5b B5 | 同上 |
| WF-CON-OVERLIMIT-001 | Sprint 5b B5 | 同上 |
| WF-SUP-REASSESS-001 | Sprint 5b B5 | 同上 |
| WF-CON-001 | Sprint 13a Day 2-1 | 同上 |
| WF-PAY-001 | Sprint 13a Day 2-1 | 同上 |
| WF-PR-001 | Sprint 13a Day 2-1 | 同上 |
| WF-PO-001 | Sprint 13a Day 2-1 | 同上 |
| WF-REV-001 | Sprint 16a（inline） | `Sprint16aMonthlyClose_E2E_Tests` inline seed |
| —— | —— | —— |

> ⚠️ **已实现盘点澄清**：任务卡描述"9 个已实现"，实际生产 seed 8 个，WF-REV-001 仅在月结反结 E2E 测试中 inline seed。**Sprint 19a B1-2 DataSeed 落地时一并将 WF-REV-001 收编进 `WorkflowTemplateDataSeedContributor`**（避免双源 seed），即"10 已实现 + 12 新增 = 22 全覆盖"。

### 1.3 12 类待补模板清单（详设 10 V1.2 §6.1 锚定）

| # | TemplateCode | 业务实体 | V1.2 §6.1 章节锚 | 是否高敏感 | 节点数（设计目标）|
|---|---|---|---|---|---|
| 1 | WF-CON-002 | contract_change | §6.1 + §7 SENS-CON-001 | ✓ | 4 |
| 2 | WF-CON-003 | contract_termination | §6.1 + §7 SENS-CON-002 | ✓ | 4 |
| 3 | WF-TRF-001 | transfer_request | §6.1 + §7 SENS-INV-004 | ✓ | 3 |
| 4 | WF-CNT-001 | inventory_count | §6.1 | — | 2 |
| 5 | WF-SHT-001 | inventory_shortage | §6.1 + §7 SENS-INV-002 | ✓ | 4 |
| 6 | WF-SCP-001 | scrap_disposal | §6.1 + §7 SENS-INV-003 | ✓ | 4 |
| 7 | WF-EQP-001 | equipment_status_change | §6.1 | — | 2 |
| 8 | WF-RNT-001 | rental_request | §6.1 | — | 2 |
| 9 | WF-MDT-001 | material | §6.1 + §7 SENS-MDT-001 | — / ✓（关键字段变更）| 2 |
| 10 | WF-SUP-001 | supplier_blacklist_release | §6.1 + §7 SENS-SUP-001 | ✓ | 3 |
| 11 | WF-RPT-001 | sensitive_export | §6.1 + §7 SENS-RPT-001 | ✓ | 2 |
| 12 | WF-PUR-EXC-001 | purchase_supplier_exception | §6.2 V1.3 拍板 | — | 2 |

**节点总数合计**：4×2 + 3×3 + 2×7 = 31 节点（chain_snapshot JSON 数组元素总和）

---

## 二、设计原则与接入基线

### 2.1 设计原则

1. **严格对齐详设 10 V1.2 §6.1 / §6.2 / §7**：节点设计的角色 / 触发条件 / 高敏感映射不脱离已锁版的详设。
2. **复用 Sprint 13a A-20 框架**：所有模板 chain_snapshot 都走 `ApprovalInstanceManager.InitiateAsync` freeze JSON，由现有状态机 `ApproveNodeAsync` / `RejectAsync` / `TerminateAsync` 推进；不引入新基础设施。
3. **高敏感模板留痕**：8 个高敏感模板（WF-CON-002/003、TRF/SHT/SCP/SUP/RPT、PUR-EXC 非高敏感）触发对应 SENS-* 高敏感操作（详设 10 §7.1），由 Sprint 17a 拦截器在审批节点 / 终态推进时落痕入 A-13/A-14。
4. **NCalc condition_expr 占位**：路由条件 / 升级条件（如金额阈值、是否安全专项）以 NCalc 表达式占位（Sprint 14a 已接通 `NCalcApprovalConditionEvaluator`）；本期暂以纯文本 + 表达式样例双形态写入设计，B2 任务卡落 12 类全覆盖。
5. **DataSeed 幂等**：按 TemplateCode 检查存在则跳过（与现有 `WorkflowTemplateDataSeedContributor` 一致）。
6. **chain_snapshot freeze 不变**：模板升版（A-08 升新版本）不影响历史 A-20 实例，按现有 `ApprovalInstance.ChainSnapshot` JSON 拷贝语义。
7. **复合角色按 `+` 分隔**：参考已有 `"FIN+EQP+LEGAL"`，会签节点 roleId 用 `+` 拼写，B 域 ApprovalInstanceManager.CanCallerApproveCurrentNode 已支持复合角色匹配。

### 2.2 角色编码统一约定（V0.1 提案 · 待 cici 评审）

为避免 mock 角色编码膨胀，本设计沿用现有 8 seed 已出现的 13 个角色编码 + 新增 8 个 = 共 21 个角色：

**复用已有**：`BUYER` / `PUR_MGR` / `GM` / `CON_MGR` / `FIN_MGR` / `VP` / `DELEGATE_UNIT` / `REPAIR_LEAD_GROUP` / `GROUP_PROD_TECH` / `GROUP_VP` / `GROUP_GM` / `MAT_MGR` / `MAT_MGR_HEAD` / `SYSTEM_TASK` / `LEGAL` / `SAFETY`

**新增 8 个**：`WH_KEEPER`（仓库管理员）/ `WH_MGR`（仓库主管）/ `EQP_MGR`（设备管理）/ `SAFE_DEPT`（安全部门，与 SAFETY 区别：SAFE_DEPT 是部门，SAFETY 是单角色）/ `MAT_GROUP`（集团物资管理）/ `MDT_OWNER`（主数据 owner）/ `IT_ADMIN`（网信办）/ `DATA_AUDITOR`（数据审计）

> ⚠️ 待 cici 评审决策点 #1：角色编码是否沿 V1.2 §5.1 / V1.0 角色矩阵 11 个 ROLE-* 编码体系，还是继续用现有简短编码（PUR_MGR 等）。简短编码与现有 8 seed 一致 / 长编码与 §5.1 11 角色清单一致。**默认按现有简短编码（不破坏一致性）**。

---

## 三、12 类审批模板详细设计

### 3.1 WF-CON-002 合同变更

**业务实体**：`contract_change`（C-04 contract_change_request，详设 05 V1.3 §6）
**触发**：合同审批通过后发生变更（金额 / 期限 / 履约条款），由 PS 经办发起
**详设 10 V1.2 §6.1 路由要素**：变更金额 / 变更原因
**高敏感**：✓（SENS-CON-001 合同变更终审，详设 10 §7.1）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | BUYER | 变更原因必填 + 影响范围说明 | — |
| 2 | 业务复核 | CON_MGR | — | →1 |
| 3 | 财务/法务会签 | FIN_MGR+LEGAL | 变更金额 > 0 或 履约条款变更 | →2 |
| 4 | 终审 | GM | 变更金额 > `CONTRACT_CHANGE_GM_THRESHOLD`（默认 100万） | →2 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"BUYER","roleName":"采购人员/合同经办"},
  {"order":2,"nodeType":"业务复核","roleId":"CON_MGR","roleName":"合同管理部门"},
  {"order":3,"nodeType":"会签","roleId":"FIN_MGR+LEGAL","roleName":"财务+法务并行会签","signMode":"COUNTERSIGN","minSignCount":2,"conditionExpr":"changeAmount > 0 or termsChanged == true"},
  {"order":4,"nodeType":"终审","roleId":"GM","roleName":"企业总经理","conditionExpr":"changeAmount > 1000000"}
]
```

**NCalc condition_expr 占位（B2 落地）**：
- 节点 3：`changeAmount > 0 or termsChanged == true`
- 节点 4：`changeAmount > 1000000`

**A-20 接入触发点**：C-04 contract_change_request `status=已提交` → `ApprovalInstanceManager.InitiateAsync("WF-CON-002", "contract_change", changeId, ...)`，TriggerContext JSON 含 `{ "contractId": ..., "changeAmount": ..., "termsChanged": ..., "changeReason": ... }`。

**SENS 联动**：终态 Approved 触发 SENS-CON-001 入 A-13 高敏感日志（详设 10 §7.1）。

> ⚠️ 待 cici 评审决策点 #2：节点 3 是否需要"并行会签 minSignCount=2"还是顺序 FIN→LEGAL；详设 10 V1.2 §6.2 WF-CON-001 节点 3 明确并行（缩短 30-50%）—— 本设计沿用并行。

---

### 3.2 WF-CON-003 合同终止

**业务实体**：`contract_termination`（C-04 ContractTermination，详设 05 V1.3）
**触发**：合同执行中需要提前终止（供应商违约 / 业务取消 / 战略调整）
**详设 10 V1.2 §6.1 路由要素**：合同金额 / 履约状态
**高敏感**：✓（SENS-CON-002 合同终止终审）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | BUYER | 终止原因必填 + 已履约金额评估 | — |
| 2 | 业务复核 | CON_MGR | — | →1 |
| 3 | 财务/法务会签 | FIN_MGR+LEGAL | 所有合同终止 | →2 |
| 4 | 终审 | GM | 合同剩余金额 > `CONTRACT_TERM_GM_THRESHOLD`（默认 100万）或 供应商违约 | →2 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"BUYER","roleName":"采购人员/合同经办"},
  {"order":2,"nodeType":"业务复核","roleId":"CON_MGR","roleName":"合同管理部门"},
  {"order":3,"nodeType":"会签","roleId":"FIN_MGR+LEGAL","roleName":"财务+法务并行会签","signMode":"COUNTERSIGN","minSignCount":2},
  {"order":4,"nodeType":"终审","roleId":"GM","roleName":"企业总经理","conditionExpr":"remainingAmount > 1000000 or supplierBreach == true"}
]
```

**NCalc condition_expr 占位**：
- 节点 4：`remainingAmount > 1000000 or supplierBreach == true`

**A-20 接入**：C-04 `terminationStatus=待审批` 触发 InitiateAsync。TriggerContext：`{ "contractId", "remainingAmount", "supplierBreach", "terminationReason" }`。

**SENS 联动**：终态 Approved 触发 SENS-CON-002。

---

### 3.3 WF-TRF-001 跨组织调拨申请

**业务实体**：`transfer_request`（S-11，详设 06 V1.1 §4.11）
**触发**：跨组织调拨（M-16 组织-仓库关系约束）
**详设 10 V1.2 §6.1 路由要素**：组织 / 物资类别 / 金额
**高敏感**：✓（SENS-INV-004 跨组织调拨审批）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | WH_KEEPER | 调出仓发起；调拨原因 + 物料明细 | — |
| 2 | 调出方主管 | WH_MGR | — | →1 |
| 3 | 集团物资管理 | MAT_GROUP | 跨组织或调拨金额 > `TRANSFER_GROUP_THRESHOLD`（默认 50万） | →2 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"WH_KEEPER","roleName":"调出仓仓管员"},
  {"order":2,"nodeType":"业务主管","roleId":"WH_MGR","roleName":"调出仓主管"},
  {"order":3,"nodeType":"集团审批","roleId":"MAT_GROUP","roleName":"集团物资管理","conditionExpr":"crossOrg == true or transferAmount > 500000"}
]
```

**NCalc condition_expr 占位**：节点 3 `crossOrg == true or transferAmount > 500000`

**A-20 接入**：S-11 `transfer_request_state=已提交` 且 `crossOrg=true` 触发 InitiateAsync。TriggerContext：`{ "requestId", "crossOrg", "transferAmount", "outOrgId", "inOrgId", "materialCategory" }`。

**SENS 联动**：节点 3 终审 Approved 触发 SENS-INV-004。

> ⚠️ 待 cici 评审决策点 #3：同组织跨仓调拨是否走本 WF（按详设 10 §6.1 路由要素含"组织"，本设计仅跨组织走 WF；同组织跨仓由 S-11 流程自管）。

---

### 3.4 WF-CNT-001 盘点差异确认

**业务实体**：`inventory_count`（S-17 盘点单 / S-18 盘亏处理单关联，详设 06 V1.1 §4.14）
**触发**：盘点产生差异（盘盈 / 盘亏 / 差异率超阈值），由仓管发起差异确认
**详设 10 V1.2 §6.1 路由要素**：差异金额 / 差异率
**高敏感**：—（差异确认本身不是高敏感；盘亏处置进入 WF-SHT-001 才高敏感）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | WH_KEEPER | 盘点报告 + 差异明细 | — |
| 2 | 业务主管 | WH_MGR | — | →1 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"WH_KEEPER","roleName":"仓库管理员"},
  {"order":2,"nodeType":"业务主管","roleId":"WH_MGR","roleName":"仓库主管"}
]
```

**NCalc condition_expr 占位**：暂无；差异率 > 5% 时自动升级 WF-SHT-001 由业务层判定，不在本 chain 内。

**A-20 接入**：S-17 `count_state=待确认` 触发 InitiateAsync。TriggerContext：`{ "countId", "diffAmount", "diffRate", "countDate" }`。

**SENS 联动**：—

---

### 3.5 WF-SHT-001 盘亏处理

**业务实体**：`inventory_shortage`（S-18，详设 06 V1.1 §4.14.3）
**触发**：盘亏单据需要审批处置（损失认定 / 责任划分）
**详设 10 V1.2 §6.1 路由要素**：金额 / 物资类别 / 损失原因
**高敏感**：✓（SENS-INV-002 盘亏终审）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | WH_KEEPER | 盘亏单 + 责任分析 + 损失估值 | — |
| 2 | 业务主管 | WH_MGR | — | →1 |
| 3 | 财务/安全会签 | FIN_MGR+SAFE_DEPT | 盘亏金额 > `SHORTAGE_FIN_THRESHOLD`（默认 10万）或 安全专项物资 | →2 |
| 4 | 终审 | MAT_GROUP | 盘亏金额 > `SHORTAGE_GROUP_THRESHOLD`（默认 50万）或 火工/危险品 | →2 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"WH_KEEPER","roleName":"仓库管理员"},
  {"order":2,"nodeType":"业务主管","roleId":"WH_MGR","roleName":"仓库主管"},
  {"order":3,"nodeType":"会签","roleId":"FIN_MGR+SAFE_DEPT","roleName":"财务+安全并行会签","signMode":"COUNTERSIGN","minSignCount":2,"conditionExpr":"shortageAmount > 100000 or isSafetySpecial == true"},
  {"order":4,"nodeType":"终审","roleId":"MAT_GROUP","roleName":"集团物资管理","conditionExpr":"shortageAmount > 500000 or isExplosive == true"}
]
```

**NCalc condition_expr 占位**：
- 节点 3：`shortageAmount > 100000 or isSafetySpecial == true`
- 节点 4：`shortageAmount > 500000 or isExplosive == true`

**A-20 接入**：S-18 `state=待审批` 触发 InitiateAsync。TriggerContext：`{ "shortageId", "shortageAmount", "isSafetySpecial", "isExplosive", "shortageReason" }`。

**SENS 联动**：节点 4 Approved 触发 SENS-INV-002。

---

### 3.6 WF-SCP-001 废旧处置

**业务实体**：`scrap_disposal`（S-20，详设 06 V1.1 §4.15.2）
**触发**：废旧物资处置（报废 / 回收 / 变卖 / 销毁）
**详设 10 V1.2 §6.1 路由要素**：金额 / 处置类型 / 物资类别
**高敏感**：✓（SENS-INV-003 报废/销毁终审）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | WH_KEEPER | 处置单 + 废旧认定 S-19 关联 | — |
| 2 | 业务主管 | WH_MGR | — | →1 |
| 3 | 财务/安全会签 | FIN_MGR+SAFE_DEPT | 处置金额 > `SCRAP_FIN_THRESHOLD`（默认 10万）或 销毁类型 | →2 |
| 4 | 终审 | MAT_GROUP | 处置金额 > `SCRAP_GROUP_THRESHOLD`（默认 50万）或 火工/危险品销毁 | →2 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"WH_KEEPER","roleName":"仓库管理员"},
  {"order":2,"nodeType":"业务主管","roleId":"WH_MGR","roleName":"仓库主管"},
  {"order":3,"nodeType":"会签","roleId":"FIN_MGR+SAFE_DEPT","roleName":"财务+安全并行会签","signMode":"COUNTERSIGN","minSignCount":2,"conditionExpr":"disposalAmount > 100000 or disposalType == \"销毁\""},
  {"order":4,"nodeType":"终审","roleId":"MAT_GROUP","roleName":"集团物资管理","conditionExpr":"disposalAmount > 500000 or (disposalType == \"销毁\" and isExplosive == true)"}
]
```

**NCalc condition_expr 占位**：
- 节点 3：`disposalAmount > 100000 or disposalType == "销毁"`
- 节点 4：`disposalAmount > 500000 or (disposalType == "销毁" and isExplosive == true)`

**A-20 接入**：S-20 `state=待审批` 触发 InitiateAsync。TriggerContext：`{ "disposalId", "disposalAmount", "disposalType", "isExplosive", "declarationId" }`。

**SENS 联动**：节点 4 Approved 触发 SENS-INV-003。

---

### 3.7 WF-EQP-001 设备状态变更

**业务实体**：`equipment_status_change`（E-01 equipment_ledger 状态变更日志，详设 07 V1.0b §4）
**触发**：设备状态变更（在用 → 闲置 / 报修 / 报废 / 调拨）
**详设 10 V1.2 §6.1 路由要素**：变更类型 / 设备价值
**高敏感**：—（一般变更）；设备报废另走 WF-SCP-001

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | EQP_MGR | 设备 ID + 变更前后状态 + 原因 | — |
| 2 | 终审 | WH_MGR | 设备原值 > `EQP_STATUS_MGR_THRESHOLD`（默认 100万）走主管复核 | →1 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"EQP_MGR","roleName":"设备管理员"},
  {"order":2,"nodeType":"主管复核","roleId":"WH_MGR","roleName":"设备主管","conditionExpr":"equipmentOriginalValue > 1000000"}
]
```

**NCalc condition_expr 占位**：节点 2 `equipmentOriginalValue > 1000000`

**A-20 接入**：E-01 `status_change` 事件 → InitiateAsync。TriggerContext：`{ "equipmentId", "oldStatus", "newStatus", "equipmentOriginalValue", "changeReason" }`。

**SENS 联动**：—

> ⚠️ 待 cici 评审决策点 #4：设备状态变更 → 报废变更是否直接复用 WF-EQP-001 还是必须串接 WF-SCP-001（设备资产报废与库存物资废旧的边界）。本设计：报废变更走 WF-EQP-001 节点 1 + 节点 2 通过后，业务层自动发起 WF-SCP-001 实例处理资产核销，**两实例并存不冲突**。

---

### 3.8 WF-RNT-001 租赁申请

**业务实体**：`rental_request`（E-08 设备租赁详设 07 V1.0b §5）
**触发**：设备租赁新建 / 续租 / 退租
**详设 10 V1.2 §6.1 路由要素**：租金金额 / 设备类型
**高敏感**：—

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | BUYER | 租赁合同 + 租期 + 月租金 | — |
| 2 | 业务主管 | PUR_MGR | 月租金 > `RENTAL_MGR_THRESHOLD`（默认 5万）或 长租期（>6 月）| →1 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"BUYER","roleName":"租赁经办"},
  {"order":2,"nodeType":"业务主管","roleId":"PUR_MGR","roleName":"业务主管","conditionExpr":"monthlyRent > 50000 or rentalMonths > 6"}
]
```

**NCalc condition_expr 占位**：节点 2 `monthlyRent > 50000 or rentalMonths > 6`

**A-20 接入**：E-08 rental_request `state=已提交` 触发 InitiateAsync。TriggerContext：`{ "requestId", "monthlyRent", "rentalMonths", "equipmentType" }`。

**SENS 联动**：—

> ⚠️ 待 cici 评审决策点 #5：租赁金额大额时是否需要终审节点（如月租金 > 50万走 GM）。本设计 2 节点足够；如政策要求大额走 GM，需补 3 节点。

---

### 3.9 WF-MDT-001 物料主数据新增/变更

**业务实体**：`material`（M-05 material_master，详设 03 V1.1 §3）
**触发**：物料主数据新增 / 关键字段变更（NC 映射 / 安全专项标识 / 物资类别）
**详设 10 V1.2 §6.1 路由要素**：是否关键物料 / NC 映射变更
**高敏感**：关键字段变更触发 SENS-MDT-001（详设 10 §7.1）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | MDT_OWNER | 主数据完整字段 + 变更 diff | — |
| 2 | 物资管理复核 | MAT_MGR | NC 映射变更 / 安全专项标识变更 / 物资类别变更 | →1 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"MDT_OWNER","roleName":"主数据 owner"},
  {"order":2,"nodeType":"物资管理复核","roleId":"MAT_MGR","roleName":"物资管理部门","conditionExpr":"ncMappingChanged == true or safetySpecialChanged == true or categoryChanged == true"}
]
```

**NCalc condition_expr 占位**：节点 2 `ncMappingChanged == true or safetySpecialChanged == true or categoryChanged == true`

**A-20 接入**：M-05 物料主数据 `change_request_state=待审批` 触发 InitiateAsync。TriggerContext：`{ "materialId", "ncMappingChanged", "safetySpecialChanged", "categoryChanged", "changeFields" }`。

**SENS 联动**：节点 2 Approved 且 `changeFields` 包含关键字段触发 SENS-MDT-001。

> ⚠️ 待 cici 评审决策点 #6：物料**新增**是否走本 WF（详设 10 §6.1 含"新增/变更"），还是新增免审？本设计：新增 + 变更均走，新增时节点 2 条件简化为 `isNewMaterial == true or （其他变更条件）`。

---

### 3.10 WF-SUP-001 供应商黑名单解除

**业务实体**：`supplier_blacklist_release`（M-09 supplier_master.supplier_state 从 `blacklist` 解除）
**触发**：供应商申请解除黑名单（需要充分理由 + 整改证明）
**详设 10 V1.2 §6.1 路由要素**：黑名单原因
**高敏感**：✓（SENS-SUP-001 供应商黑名单解除）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | PUR_MGR | 解除申请 + 整改证明 + 原黑名单原因核查 | — |
| 2 | 物资管理复核 | MAT_MGR | — | →1 |
| 3 | 终审 | MAT_MGR_HEAD | 所有黑名单解除均走最高级 | →2 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"PUR_MGR","roleName":"采购主管"},
  {"order":2,"nodeType":"物资管理复核","roleId":"MAT_MGR","roleName":"物资管理部门"},
  {"order":3,"nodeType":"终审","roleId":"MAT_MGR_HEAD","roleName":"物资管理负责人"}
]
```

**NCalc condition_expr 占位**：暂无；所有黑名单解除走完整 3 节点（最严口径）。

**A-20 接入**：M-09 `state_transition=blacklist→active` 触发 InitiateAsync。TriggerContext：`{ "supplierId", "blacklistReason", "rectificationEvidence" }`。

**SENS 联动**：节点 3 Approved 触发 SENS-SUP-001（强制留痕 + 二次确认）。

---

### 3.11 WF-RPT-001 大范围敏感导出审批

**业务实体**：`sensitive_export`（A-18 data_export_log，详设 10 §4.18）
**触发**：导出含金额敏感字段 / 大范围（> 1万条）/ 跨组织导出
**详设 10 V1.2 §6.1 路由要素**：范围 / 字段 / 人员
**高敏感**：✓（SENS-RPT-001 大范围敏感导出）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | DATA_AUDITOR | 导出范围 + 字段清单 + 用途说明 | — |
| 2 | 终审 | IT_ADMIN | 行数 > `EXPORT_ROW_THRESHOLD`（默认 10000）或 含敏感字段或 跨组织 | →1 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"DATA_AUDITOR","roleName":"申请人（含敏感字段权限）"},
  {"order":2,"nodeType":"信息化审批","roleId":"IT_ADMIN","roleName":"网信办/信息化","conditionExpr":"rowCount > 10000 or hasSensitiveFields == true or crossOrg == true"}
]
```

**NCalc condition_expr 占位**：节点 2 `rowCount > 10000 or hasSensitiveFields == true or crossOrg == true`

**A-20 接入**：A-18 `export_request_state=待审批` 触发 InitiateAsync。TriggerContext：`{ "exportType", "rowCount", "hasSensitiveFields", "crossOrg", "exportFields" }`。

**SENS 联动**：节点 2 Approved 触发 SENS-RPT-001（强制留痕 + 水印）。

> ⚠️ 待 cici 评审决策点 #7：节点 2 IT_ADMIN 是否需要叠加业务部门主管会签（如导出付款明细需要财务主管会签）。本设计单 IT_ADMIN 节点；若需要业务会签则节点 2 改 `IT_ADMIN+FIN_MGR` 复合角色（按导出类型动态拼装会签角色复杂度高 → 留 Sprint 19b+ 评估）。

---

### 3.12 WF-PUR-EXC-001 询价/竞价/谈判不足供应商特批

**业务实体**：`purchase_supplier_exception`（详设 04 V1.2 §8.3.1 + 详设 10 V1.2 §6.2 V1.3 拍板）
**触发**：tender_response_count < tender_min_supplier_count（询比/竞价 < 3 家 / 谈判 < 2 家）系统强约束拦截，业务员发起特批
**详设 10 V1.2 §6.2 节点表**：业务主管 + 财务复核（V1.3 拍板）
**高敏感**：—（V1.2 §7.1 未列入高敏感清单；但 ALR-PUR-001 月度合规暴露指标）

**审批 chain**：

| 节点 | 类型 | roleId | 触发条件 | 驳回跳转 |
|---|---|---|---|---|
| 1 | 业务发起 | BUYER | 校验：实际响应数 < 最低要求 + 必填《不足供应商数说明》 | — |
| 2 | 业务主管 | PUR_MGR | — | →1 |
| 3 | 财务复核 | FIN_MGR | — | →2 |

**chain_snapshot JSON**：
```json
[
  {"order":1,"nodeType":"业务发起","roleId":"BUYER","roleName":"采购人员"},
  {"order":2,"nodeType":"业务主管","roleId":"PUR_MGR","roleName":"物资公司业务部主管"},
  {"order":3,"nodeType":"财务复核","roleId":"FIN_MGR","roleName":"财务人员"}
]
```

**NCalc condition_expr 占位**：暂无；详设 04 V1.2 §8.3.1 业务规则中已明确所有不足情形都需要走特批，节点条件不区分。

**A-20 接入**：招采记录（tender_record）`state=不足拦截` 触发 InitiateAsync。TriggerContext：`{ "tenderId", "tenderType", "responseCount", "minRequired", "insufficientReason", "isEmergency" }`。

**SENS 联动**：—（不在 §7.1 高敏感清单；但联动 ALR-PUR-001 月报暴露）

> **节点说明**（与详设 10 V1.2 §6.2 完全对齐）：
> - 仅 2 节点（业务主管 + 财务复核），**不上集团**层面 — 区别于 WF-CON-001 / WF-PAY-001 大额合同审批。
> - 全程留痕入 A-14 审批日志（与正常审批同等审计标准）。
> - 联动详设 04 V1.2 §8.3.1（强约束 + 简化特批规则）+ 详设 09 V1.2 §六 ALR-PUR-001（无论是否走特批，触发月度报表暴露指标）。

---

## 四、DataSeed 实施计划（Sprint 19a B1-2 落地）

### 4.1 实施范围

按 `WorkflowTemplateDataSeedContributor` 现有模式 **扩展 13 模板 seed**（12 新增 + 1 WF-REV-001 收编）：

| 序号 | TemplateCode | 工时（PD）|
|---|---|---|
| 1 | WF-CON-002 | 0.08 |
| 2 | WF-CON-003 | 0.08 |
| 3 | WF-TRF-001 | 0.08 |
| 4 | WF-CNT-001 | 0.05 |
| 5 | WF-SHT-001 | 0.10 |
| 6 | WF-SCP-001 | 0.10 |
| 7 | WF-EQP-001 | 0.05 |
| 8 | WF-RNT-001 | 0.05 |
| 9 | WF-MDT-001 | 0.05 |
| 10 | WF-SUP-001 | 0.08 |
| 11 | WF-RPT-001 | 0.05 |
| 12 | WF-PUR-EXC-001 | 0.08 |
| 13 | WF-REV-001（收编）| 0.05 |
| **合计** | | **0.90 PD** |

### 4.2 实施手法

- **sed 批量模板法**（参考 reference_team_tech_stack memory `feedback_sed_batch_contributor_template`）：以 Sprint 13a Day 2-1 已 seed 的 4 模板（WF-CON-001/PAY-001/PR-001/PO-001）为模板，sed 批量生成 13 个 New(...) 调用块 → 工时压缩到 0.05 PD/个。
- **chain_snapshot JSON 字面量**：直接复用本设计文档 §3.x 的 JSON，行内字符串拼接（参考现有 `WorkflowTemplateDataSeedContributor` 第 37-41 行写法）。
- **幂等保护**：现有 `existing.Select(s => s.TemplateCode).ToHashSet()` 检查继续生效，覆盖 13 新增的 TemplateCode。

### 4.3 Application.Tests 联动

`Sprint16aMonthlyClose_E2E_Tests.cs` 第 88-93 行的 inline seed WF-REV-001 改为依赖 `WorkflowTemplateDataSeedContributor`：删除 inline seed 代码，测试启动时 DataSeed 自动落 WF-REV-001 + 12 新增（避免双源 seed）。

> ⚠️ 待 cici 评审决策点 #8：是否在本 Sprint 19a B1-2 同步消化 inline seed 改造（涉及 1 个测试文件改动），还是留下技术债。**默认建议同步消化**（避免双源 seed 漂移风险）。

---

## 五、A-20 接入测试计划（Sprint 19a B1-3 落地）

### 5.1 测试范围

参照 `Sprint16aMonthlyClose_E2E_Tests` pattern，**每个模板 1 个 InitiateAsync 守护测试 + 1 个 完整 chain 推进测试 = 24 测试**：

| 测试类 | 数量 | 工时 |
|---|---|---|
| InitiateAsync 守护测试（每模板 1 个） | 12 | 0.5 PD |
| 完整 chain 推进测试（每模板 1 个 Approve 全链路） | 12 | 1.0 PD |
| RejectAsync 退回测试（高敏感 8 模板 + 关键 2 模板）| 10 | 0.5 PD |
| RBAC 角色拦截测试（CanCallerApproveCurrentNode）| 5 | 0.2 PD |
| **合计** | **39** | **2.2 PD** |

### 5.2 测试文件组织

新建测试类（与现有 `Sprint16aMonthlyClose_E2E_Tests` 同目录 `test/Nova.SupplyCores.Application.Tests/`）：

```
Sprint19aWorkflow12Templates_Tests.cs
  ├─ 4 类合同/付款族（WF-CON-002/003 + WF-TRF-001 + WF-PUR-EXC-001）
  ├─ 3 类库存族（WF-CNT-001/SHT-001/SCP-001）
  ├─ 2 类设备族（WF-EQP-001/RNT-001）
  └─ 3 类主数据/供应商/导出族（WF-MDT-001/SUP-001/RPT-001）
```

或拆 4 个测试文件（按业务族）—— 由 B1-3 实施时决定。

### 5.3 测试关键验证点

每个 InitiateAsync 测试验证：
1. **TemplateCode 存在 + Active** → 成功创建 InstanceState=InProgress
2. **chain_snapshot freeze** → 比对 Instance.ChainSnapshot == Template.ApprovalChain（不可空 / 不可篡改）
3. **CurrentNodeSeq=1** → 进入第 1 节点
4. **TriggerContext 落痕** → 验证 JSON 字段完整

每个 Approve 全链路测试验证：
1. 逐节点 Approve → CurrentNodeSeq 推进正确
2. 最后节点 Approve → InstanceState=Approved + FinalResult=Approved + CompletionTime != null
3. （高敏感模板）触发 SENS-* 拦截器入 A-13/A-14（mock 验证）

每个 Reject 测试验证：
1. 节点 N>1 退回 → CurrentNodeSeq 回退 N-1
2. 节点 1 退回 → InstanceState=Rejected
3. Reject 必填原因 → 空原因 throw

### 5.4 测试样例代码骨架（参考）

```csharp
[Fact]
public async Task WF_CON_002_Should_Initiate_With_ChainSnapshot()
{
    // Arrange: 确保 WF-CON-002 seed 已落
    var template = await _templateRepo.GetAsync(t => t.TemplateCode == "WF-CON-002");
    template.ShouldNotBeNull();
    template.Status.ShouldBe(WorkflowTemplateStatuses.Active);

    // Act
    var instance = await _manager.InitiateAsync(
        workflowTemplateCode: "WF-CON-002",
        businessEntity: "contract_change",
        businessId: 9001L,
        initiatorUserId: _testUserId,
        initiatorOrgId: 10L,
        triggerContextJson: """{"contractId":1001,"changeAmount":500000,"termsChanged":false,"changeReason":"金额调增"}""");

    // Assert
    instance.InstanceState.ShouldBe(ApprovalInstanceStates.InProgress);
    instance.ChainSnapshot.ShouldBe(template.ApprovalChain);
    instance.CurrentNodeSeq.ShouldBe(1);
}
```

---

## 六、NCalc condition_expr 12 类全覆盖（Sprint 19a B2 配套）

### 6.1 condition_expr 汇总

| WF | 节点 | 表达式 |
|---|---|---|
| WF-CON-002 | 3 | `changeAmount > 0 or termsChanged == true` |
| WF-CON-002 | 4 | `changeAmount > 1000000` |
| WF-CON-003 | 4 | `remainingAmount > 1000000 or supplierBreach == true` |
| WF-TRF-001 | 3 | `crossOrg == true or transferAmount > 500000` |
| WF-CNT-001 | — | — |
| WF-SHT-001 | 3 | `shortageAmount > 100000 or isSafetySpecial == true` |
| WF-SHT-001 | 4 | `shortageAmount > 500000 or isExplosive == true` |
| WF-SCP-001 | 3 | `disposalAmount > 100000 or disposalType == "销毁"` |
| WF-SCP-001 | 4 | `disposalAmount > 500000 or (disposalType == "销毁" and isExplosive == true)` |
| WF-EQP-001 | 2 | `equipmentOriginalValue > 1000000` |
| WF-RNT-001 | 2 | `monthlyRent > 50000 or rentalMonths > 6` |
| WF-MDT-001 | 2 | `ncMappingChanged == true or safetySpecialChanged == true or categoryChanged == true` |
| WF-SUP-001 | — | — |
| WF-RPT-001 | 2 | `rowCount > 10000 or hasSensitiveFields == true or crossOrg == true` |
| WF-PUR-EXC-001 | — | — |

**12 类共 14 个 condition_expr 表达式**（9 模板有 / 3 模板无）。

### 6.2 NCalc 接通点

`ApprovalInstanceManager.ApproveNodeAsync` 推进时调用 `_conditionEvaluator.Evaluate(expr, triggerContext)`，false 则跳过该节点（视为条件不满足，节点自动 pass）。

> ⚠️ 待 cici 评审决策点 #9：条件不满足时，节点 **自动 pass** 还是 **跳过整个 chain 直接 Approved**？详设 10 V1.2 §6.2 "条件"列暗示节点条件为 `进入本节点的条件`，本设计采用 **自动 pass**（节点 not entered → CurrentNodeSeq++ 推进下一节点）。

---

## 七、与详设 10 V1.2 实际章节对照

| WF | V1.2 §6.1 | V1.2 §6.2 详写 | V1.2 §7 SENS | 已实现状态 | Sprint 19a B 任务 |
|---|---|---|---|---|---|
| WF-CON-002 | ✓ | — | SENS-CON-001 | ❌ | B1（本稿）+ B2 + B3 |
| WF-CON-003 | ✓ | — | SENS-CON-002 | ❌ | 同上 |
| WF-TRF-001 | ✓ | — | SENS-INV-004 | ❌ | 同上 |
| WF-CNT-001 | ✓ | — | — | ❌ | 同上 |
| WF-SHT-001 | ✓ | — | SENS-INV-002 | ❌ | 同上 |
| WF-SCP-001 | ✓ | — | SENS-INV-003 | ❌ | 同上 |
| WF-EQP-001 | ✓ | — | — | ❌ | 同上 |
| WF-RNT-001 | ✓ | — | — | ❌ | 同上 |
| WF-MDT-001 | ✓ | — | SENS-MDT-001 | ❌ | 同上 |
| WF-SUP-001 | ✓ | — | SENS-SUP-001 | ❌ | 同上 |
| WF-RPT-001 | ✓ | — | SENS-RPT-001 | ❌ | 同上 |
| WF-PUR-EXC-001 | ✓ | ✓ 详写 | — | ❌ | 同上 |
| —— | | | | | |
| WF-CON-001 | ✓ | ✓ | — | ✅ Sprint 13a | — |
| WF-PAY-001 | ✓ | ✓ | SENS-PAY-001 | ✅ Sprint 13a | — |
| WF-PR-001 | ✓ | — | — | ✅ Sprint 13a | — |
| WF-PO-001 | ✓ | — | — | ✅ Sprint 13a | — |
| WF-DIR-001 | ✓ | ✓ | — | ✅ Sprint 5b | — |
| WF-RPR-001 | ✓ | ✓ | — | ✅ Sprint 5b | — |
| WF-CON-OVERLIMIT-001 | ✓ | ✓ | SENS-CON-004 | ✅ Sprint 5b | — |
| WF-SUP-REASSESS-001 | ✓ | ✓ | — | ✅ Sprint 5b | — |
| WF-REV-001 | ✓ | ✓ | SENS-FIN-004 | ⚠️ inline 测试 | B1-2 收编 |

**12 / 22 = 54% 模板设计待 B1 起草**，**B1 通过评审后由 B1-2 / B1-3 / B2 / B3 / B4 落地**。

---

## 八、Sprint 19a B 副轨工作量评估（修正）

基于本稿 §四 + §五 + §六，B 副轨细化预算：

| Task | 内容 | 工时（PD） |
|---|---|---|
| B1（本稿）| 12 类设计文档起草 + cici 评审 | 0.8（含评审反馈调整 0.2）|
| B1-2 | DataSeed 13 模板（含 WF-REV-001 收编）| 0.9 |
| B1-3 | A-20 接入测试 39 个 | 2.2 |
| B2 | NCalc condition_expr 12 类全覆盖（9 模板 14 表达式 + 集成测试）| 2.0-2.5 |
| B3 | 工作流图（chain_snapshot 校验工具）/ 状态机守护测试 | 1.5 |
| B4 | chain_snapshot freeze + 升版兼容（A-08 版本化升级路径）| 1.0 |
| **合计** | | **8.4-8.9 PD** |

**预算对齐**：与任务卡 V0.2 §一 "B 主线 8-11 PD" 一致，落在下限附近（充足缓冲应对评审反馈）。

---

## 九、待 cici 评审决策点汇总

| # | 决策点 | 章节 | 默认提案 |
|---|---|---|---|
| 1 | 角色编码体系（11 ROLE-* vs 简短编码）| §2.2 | 简短编码（与现有 8 seed 一致）|
| 2 | WF-CON-002 节点 3 会签是并行还是顺序 | §3.1 | 并行（沿用 WF-CON-001 §6.2 节点 3 一致）|
| 3 | WF-TRF-001 同组织跨仓是否走本 WF | §3.3 | 仅跨组织走 WF，同组织跨仓由 S-11 流程自管 |
| 4 | WF-EQP-001 设备报废变更是否串接 WF-SCP-001 | §3.7 | 两实例并存（EQP-001 通过后业务层发起 SCP-001）|
| 5 | WF-RNT-001 大额租赁是否需要 GM 终审节点 | §3.8 | 2 节点足够（如政策要求大额走 GM 需补 3 节点）|
| 6 | WF-MDT-001 物料新增是否走本 WF | §3.9 | 新增 + 变更均走，新增时 conditionExpr 简化 |
| 7 | WF-RPT-001 节点 2 是否叠加业务主管会签 | §3.11 | 单 IT_ADMIN 节点（业务会签按导出类型动态拼装复杂度高 → 留 19b+）|
| 8 | Sprint 19a B1-2 是否同步收编 WF-REV-001 inline seed | §4.3 | 同步消化（避免双源 seed 漂移）|
| 9 | NCalc 条件不满足时节点 pass 还是整 chain 直 Approved | §6.2 | 自动 pass（节点 not entered → 推进下一节点）|

---

## 十、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 12 类审批模板详细设计：节点表 / chain_snapshot JSON / NCalc condition_expr / A-20 接入 TriggerContext / SENS-* 联动 / DataSeed 实施计划（13 含 WF-REV-001 收编）/ A-20 接入测试计划（39 测试）/ Sprint 19a B 副轨工作量评估 8.4-8.9 PD / 9 项待评审决策点 |
| **V0.2** | **2026-05-15** | **cici 一键采纳子代理建议 9 决策点全锁定**：简短角色编码 / CON-002 节点 3 并行会签 / TRF 同组织跨仓不走 WF / EQP-001 报废业务层串接 SCP-001 / RNT 5w 阈值 GM 终审 / MDT-001 仅变更走 WF（新增不走）/ RPT-001 不叠加业务会签 / 同步收编 WF-REV-001 inline seed / NCalc 不满足时节点 pass —— 启动 B1-2 实施 |
