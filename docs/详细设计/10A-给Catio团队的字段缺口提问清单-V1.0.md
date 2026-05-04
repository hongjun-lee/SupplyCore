# 给 Catio 团队的字段缺口提问清单 V1.0

**文档目的：** SupplyCores（物资管理系统）通过 `[DependsOn]` 复用 Catio 仓库的 `Nova.Platform` + `Nova.Workflow` ABP 模块代码，在本地独立数据库建相同结构的表（不访问集团 Nova Platform 的运行库，部署边界遵循概设 01）。本清单列出 SupplyCores 详细设计 10《权限审批流详细设计 V1.0》要求的字段，与 Catio 模块当前实现之间已识别的 8 处缺口，请贵方核对并按 ✓ / ✗ 勾选回复。

**回复 SLA 期望：** T+5 工作日。超期 SupplyCores 将按降级方案落地（缺失字段的表从 REUSE 改为 SupplyCores 自建 ADD），后续如 Catio 扩展再回切。

**回复方式：** 直接在本文档勾选 / 补字段名 / 补说明，签字回传即可。

> **SupplyCores 自助核对说明（2026-05-05 补）**：以下涉及 `Nova.Workflow` 模块的问题已根据 `aizhetech/Catio/modules/nova.workflow` 仓库源码自助核对并填入"代码事实 / 替代方案"，请 Catio 团队复核确认：
>
> - **Q4.1 / Q4.2 / Q4.3**（ProcessDefinition 路由条件、会签开关、加签开关）
> - **Q5.1 / Q5.2**（ApprovalRecord 附件 + 审批链路快照）
> - **Q7.1 / Q7.2 / Q7.3**（ProcessInstance 索引、模板快照、状态值域）
> - **Q8.1 / Q8.2**（ProcessDefinitionVersion V2 图结构 DSL）
> - **Q9.1**（Schema = `workflow`，硬编码）
>
> 涉及 `Nova.Platform` 模块的 **Q2.1 / Q3.1 / Q3.2 / Q6.1** 仍由 SupplyCores 团队基于 Platform 仓库回复，本次未触碰。

---

## 一、对接背景速览


| 项      | 说明                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------- |
| 引用方式   | C# `[DependsOn(typeof(Nova.PlatformModule))]` + `[DependsOn(typeof(Nova.WorkflowModule))]`        |
| 部署     | SupplyCores 独立 PostgreSQL 库，与集团 Nova Platform 运行库**物理隔离**                                         |
| schema | 待 Catio 仓库实际部署确认，默认假设 `public`（见本清单 §九）                                                           |
| 复用范围   | A-01~A-20 共 20 张权限/审批/审计表中的 11 张：A-01/A-02/A-03/A-04/A-05/A-06(org)/A-08/A-09/A-10/A-12/A-14/A-20 |
| 自建范围   | 7 张业务专属表（A-11/A-13/A-15/A-16/A-17/A-18/A-19）+ A-06 业务资源维度子集                                       |


---

## 二、缺口 #1：`AbpRoles` `Properties` 字段索引（对应 A-02）

**SupplyCores 需求：** A-02 业务角色表有 `role_category varchar(50)` 字段（值域：管理查询/信息化运维/物资管理/仓储执行/业务申请/采购执行/质检控制/财务控制/安全专项/审计查询/系统管理 共 11 类），需要支持"按 role_category 列表查询所有角色"业务功能（如系统管理页按类别筛选）。SupplyCores 计划把此字段落到 ABP 标准 `AbpRoles.Properties` JSON 字段。

**问 Catio 团队：**

- [ ✗] **Q2.1** Catio 仓库当前是否对 `AbpRoles.Properties` JSON 内某 key 提供 GIN/btree 索引？或是否有计划提供自定义索引扩展点？
  - ✓ 已有 / 计划提供：________（请补字段名/版本）
  - ✗ 暂无：SupplyCores 自建投影 view 或冗余列（无需 Catio 改动）

---

## 三、缺口 #2：`Nova.Platform.RoleOrganization` 字段（对应 A-03）

**SupplyCores 需求：** A-03 用户角色关系表除了"角色 × 组织 × IncludeChildren"标准三元组外，还要求两个业务字段：

- `assigned_by bigint`（授权操作人，软外键 → A-01.user_id 或 AbpUsers.Id）
- `expired_date timestamptz`（角色到期时间，用于临时授权场景）

**问 Catio 团队：**

- [✓ ] **Q3.1** `Nova.Platform.RoleOrganization` 实体是否有 `AssignedBy`（或语义等价字段，如 `CreatorId` / `GrantedBy`）？
  - ✓ 已有：字段名 *creator_id*__**，类型 uuid**
  - ✗ 暂无：是否考虑扩展？预计版本 ________
- [ ✗] **Q3.2** `Nova.Platform.RoleOrganization` 实体是否有 `ExpiredDate` / `ExpireTime` / `ValidUntil` 等到期字段？
  - ✓ 已有：字段名 ________，类型 ________
  - ✗ 暂无：是否考虑扩展？预计版本 ________

---

## 四、缺口 #3：`Nova.Workflow.ProcessDefinition` 三字段（对应 A-08）

**SupplyCores 需求：** A-08 审批流程模板需要三个流程级配置字段：

- `route_conditions jsonb`（路由条件，存放金额区间、物资类别、供应商状态等条件配置；详设 10 §九多个金额阈值落到这里）
- `allow_countersign boolean`（是否允许会签）
- `allow_add_approver boolean`（是否允许加签）

**问 Catio 团队：**

- [✗] **Q4.1** `ProcessDefinition` 是否有 jsonb 路由条件字段（语义等价于 `RouteConditions` / `BranchRules` / `Conditions`）？
  - ✓ 已有：字段名 ________
  - ✗ 暂无：是否考虑扩展？
  - **代码事实**：`ProcessDefinition` 表（`workflow.process_definitions`）无独立 `route_conditions` 字段。但有两个 jsonb 字段可承载：
    - `Settings`（列名 `settings`，jsonb）—— 流程级"扩展配置"，可放金额阈值/物资类别/供应商状态等业务参数；
    - `StepsConfig`（列名 `steps_config`，jsonb）—— 审批步骤配置，路由分支由"条件节点"承载（V2 DSL：`stepsConfig.nodes[].conditionConfig.{conditions[] | expression}`，支持 SIMPLE/EXPRESSION 两种模式，详见 §八）。
  - **建议落点**：金额/类别等条件落 `ConditionNode.expression`（如 `amount * rate > 10000 && department == "FIN"`），全局策略落 `Settings`。SupplyCores 详设 10 §九的多个金额阈值无需新增字段，直接走 `ConditionNode`。
- [✗] **Q4.2** `ProcessDefinition` 是否有"是否允许会签"开关？
  - ✓ 已有：字段名 ________
  - ✗ 暂无 / 在 ProcessDefinitionVersion 的 JSON 节点配置里：JSON 字段路径 `stepsConfig.nodes[].approvalConfig.signMode`
  - **代码事实**：会签为**节点级**配置，无流程级开关。`ApprovalNodeConfig.SignMode` 值域 `SINGLE / COUNTERSIGN / OR_SIGN`（见 `Nova.Workflow.Domain.Shared/StepsConfig/WorkflowGraphDto.cs` 与 `ApprovalNodeHandler.cs` 的 `ValidSignModes`）。运行时由 `ApprovalTask.SignMode` + `CountersignItem` + `CountersignCompletionService` 实现"任一驳回即驳回 / 达到所需通过数即通过"。
- [✗→📅 已纳入 Catio 路线图 P2-7] **Q4.3** `ProcessDefinition` 是否有"是否允许加签"开关？
  - ✓ 已有：字段名 ________
  - ✗ 暂无 / 在 JSON 节点配置里：JSON 字段路径 ________
  - **代码事实**：当前 Nova.Workflow 后端代码**未实现加签**（前端 bundle 出现"加签"字样但后端无对应实体/动作）。`WorkflowStatuses.ApprovalAction` 仅含 `SUBMIT/APPROVE/REJECT/PARTIAL/DELEGATE/CLAIM/CANCEL/AUTO/ROLLBACK/RESUBMIT`，无 `ADD_APPROVER`。委托走 `ProcessDelegate` 表 + `Delegate` 动作，是"转给他人"而非"前/后加签"。
  - **状态（2026-05-05）**：已登记到 Catio 路线图 P2-7（见 `nova.workflow/docs/Nova_Workflow_模块实现对齐与开发路线图_v1.0_20260427.md` §11.3）。
    - **MVP 范围**：仅做"并加签"（PARALLEL）—— 复用 `CountersignItem` + `CountersignCompletionService`，零 Elsa 改动，~5–7 人天
    - **扩展点**：`ApprovalAction.AddApproverParallel/After/Before` + `ApprovalNodeConfig.AllowAddApprover` + `ApprovalTask.AddedFromTaskId` + `ApprovalTaskAppService.AddApproverAsync(...)`
  - **SupplyCores 当前过渡方案**：
    - 在 Catio P2-7 落地前，业务上**降级**：不暴露加签入口；如确需扩链，使用现有 `Delegate`（转交）能力。
    - **不要**在 SupplyCores 适配层自建加签（会绕开 Elsa 引擎，未来 Catio 跟进会冲突）。

---

## 五、缺口 #4：`Nova.Workflow.ApprovalRecord` 字段（对应 A-10 + A-14）

**SupplyCores 需求：** A-10 审批意见与 A-14 审批日志双映射到 Catio `ApprovalRecord` 单表，缺两个字段：

- `attachment_ids jsonb`（审批意见附件 ID 列表，由前端附件组件回传）
- `approval_chain_path jsonb`（完整审批链路快照，A-14 强审计要求；区别于 A-20 `approval_chain_snapshot` 的"模板快照"，本字段是"实际走过的节点序列"）

**问 Catio 团队：**

- [✓] **Q5.1** `ApprovalRecord` 是否有附件 ID 列表字段？
  - ✓ 已有：字段名 `Attachments`（列名 `attachments`），类型 `jsonb`（C# 端为 `string?`，前端按 JSON 数组序列化附件 ID/URL）
  - ✗ 暂无：是否考虑扩展？
  - **代码事实**：`ApprovalRecord.Attachments` + `ApprovalTask.Attachments` 都是 jsonb（见 `WorkflowDbContextModelCreatingExtensions.cs` L174、L248；`InitialWorkflow` 迁移 L31）。SupplyCores 直接复用即可，无需 Catio 改动。
- [✗] **Q5.2** `ApprovalRecord` 是否有"完整审批链路快照"字段（记录从发起到当前的所有节点流转）？
  - ✓ 已有：字段名 ________，结构示例 ________
  - ✗ 暂无：是否考虑在 `ApprovalRecord` 或 `ProcessInstance` 上扩展？
  - **代码事实**：`ApprovalRecord` 是"逐条流水"模型——每次审批动作写一条（含 `NodeName/OperatorPersonId/Action/Comment/OperatedAt/RollbackTargetStepKey` 等），**没有**单条字段保存"完整审批链路快照"。
  - **替代查询方案**：完整审批链可通过 `SELECT * FROM workflow.approval_records WHERE process_instance_id = ? ORDER BY operated_at` 实时还原，已有 `ix_approval_records_instance` 索引保障性能。
  - **建议**：SupplyCores 详设 10 §A-14 的"完整审批链路快照"如果是"实时拼装即可"则适配层组装；如果是"强审计冻结快照"，建议在 `ProcessInstance` 上扩展 `approval_chain_path jsonb`（在流程结束时写入），或推动 Catio 在 `ProcessInstance.Variables` 内规约一个 `_chainPath` key。

---

## 六、缺口 #5：`Nova.Platform.PermissionChangeLog` 保留期（对应 A-12）

**SupplyCores 需求：** A-12 用户权限变更日志按详设 10 §8.1 要求保留 **5 年**，超期归档至冷存储。集团信息安全/合规可能进一步要求更长。

**问 Catio 团队：**

- [ ✓] **Q6.1** `Nova.Platform.PermissionChangeLog` 默认归档周期？
  - ✓ ≥ 5 年（满足）：默认值 ________
  - ✗ < 5 年：默认值 ________ 年；SupplyCores 是否可在本地 PG 上独立配置 cron 归档（不动 Catio 模块）？
  - ⚠ Catio 不参与归档策略：✓ 由调用方（SupplyCores）自行实现 cron + 冷存储

---

## 七、Q5 决议带出的额外问题：`ProcessInstance` 索引与字段（对应 A-20）

**背景：** SupplyCores 业务方已确认走 Catio Workflow 引擎（不自建审批）。A-20 审批实例需要按"业务单据"反查（详设 10 §4.20 索引建议）。

**问 Catio 团队：**

- [✓] **Q7.1** `Nova.Workflow.ProcessInstance` 是否有 `(BusinessType, BusinessId)` 二级索引？
  - ✓ 已有：索引名 `ix_process_instances_business`，定义 `HasIndex(x => new { x.BusinessType, x.BusinessId })`（见 `WorkflowDbContextModelCreatingExtensions.cs` L127）。
  - ✗ 暂无：SupplyCores 在本地库加 partial index 是否安全（不影响 Catio 模块升级）？或考虑 Catio 扩展？
  - **补充**：另有 `ix_process_instances_initiator/status/started_at/elsa_id` 共 5 个索引，详设 10 §4.20 索引建议已被覆盖。
- [✗] **Q7.2** `ProcessInstance` 是否有 "审批链快照"字段（详设 10 §4.20 `approval_chain_snapshot jsonb`，用于"模板变更不影响历史实例"的快照）？
  - ✓ 已有：字段名 ________，结构示例 ________
  - ✗ 暂无：SupplyCores 在适配层包装序列化是否可行？或考虑 Catio 扩展？
  - **代码事实**：`ProcessInstance` 上没有 `approval_chain_snapshot` 字段。当前 jsonb 字段仅有：`FormData`（表单数据快照）、`Variables`（流程变量）、`RollbackContext`（回退链上下文）。
  - **Catio 已有的"模板版本快照"机制**：`ProcessDefinitionVersion` 表（`workflow.process_definition_versions`）每次保存自动新建一条记录，含 `StepsConfig jsonb` + `ConfigHash` + `VersionNumber`，唯一索引 `(process_definition_id, version_number)`。`ProcessInstance.ProcessDefinitionId` 反查即可拿到"发起时的模板"，因此"模板变更不影响历史实例"是**靠 ProcessDefinitionVersion 表实现**，而非在 ProcessInstance 上冗余快照。
  - **建议**：SupplyCores 若需"实例级冻结快照"，可在适配层把 `ProcessDefinitionVersion.StepsConfig` 拷贝到 `ProcessInstance.Variables._snapshot` 节点；或推动 Catio 增加 `ProcessInstance.ProcessDefinitionVersionId` 外键 + 落 `approval_chain_snapshot jsonb`。
- [⚠] **Q7.3** `ProcessInstance.Status` 状态值域是否覆盖详设 10 要求的 6 种值（草稿/审批中/已通过/已驳回/已撤回/已终止）？
  - ✓ 完全覆盖：值列表 ________
  - ⚠ 部分覆盖：缺 `草稿`；映射方案见下表。
  - **代码事实**：`WorkflowStatuses.ProcessInstanceStatus` 实际 6 值 = `RUNNING / COMPLETED / CANCELLED / REJECTED / SUSPENDED / RETURNED`（见 `Nova.Workflow.Domain.Shared/WorkflowStatuses.cs` L16-24）。另有 `Result` 字段值域 `APPROVED / REJECTED / PARTIAL / CANCELLED`。
  - **映射表**：

    | 详设 10 状态 | Catio 映射                                  | 备注                                                                                       |
    | -------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
    | 草稿       | ⚠ 无对应                                     | SupplyCores 业务侧自管（提交前不创建 ProcessInstance），或借用 `ProcessDefinition.Status=DRAFT`（针对模板而非实例） |
    | 审批中      | `RUNNING`                                 |                                                                                          |
    | 已通过      | `COMPLETED` + `Result=APPROVED`           |                                                                                          |
    | 已驳回      | `REJECTED`（终态）或 `RETURNED`（退回发起人/退回到指定步骤） | 详见 `RejectBehavior = END / RETURN_TO_INITIATOR / RETURN_TO_STEP`                         |
    | 已撤回      | `CANCELLED` + `Result=CANCELLED`          |                                                                                          |
    | 已终止      | `SUSPENDED`（挂起可恢复）/ `CANCELLED`（终止不可恢复）   | 二选一，建议 SupplyCores 统一映射到 `CANCELLED`                                                     |


---

## 八、Q5 决议带出的额外问题：`ProcessDefinitionVersion` JSON 节点结构（对应 A-09）

**背景：** Catio 把审批节点配置内嵌于 `ProcessDefinitionVersion` 的 JSON 字段。SupplyCores 详设 10 §4.9 要求节点字段：node_sequence/node_type（发起/初审/复核/会签/终审）/node_name/approver_type/approver_role_id/approver_org_id/approve_condition/is_parallel/reject_goto_node。

**问 Catio 团队：**

- [✓] **Q8.1** `ProcessDefinitionVersion` JSON 节点结构 schema 是否对外公开？请提供完整 JSON Schema 或字段列表。
  - JSON Schema URL / 文档：源码 DTO 在 `Nova.Workflow.Domain.Shared/StepsConfig/`，对外公开（V2 图结构 DSL）：
    - `WorkflowGraphDto`（顶层）：`{ version: 2, nodes: WorkflowNodeDto[], edges: WorkflowEdgeDto[], completionActions: CompletionActionsDto }`
    - `WorkflowNodeDto`：`{ id, type, approvalConfig?, conditionConfig?, forkConfig?, joinConfig?, extensionConfig? }`
    - `WorkflowEdgeDto`：`{ id, sourceNodeId, targetNodeId, label? }`
  - **节点 type 值域**（来自 `NodeHandlerRegistry`）：`START / APPROVAL / CONDITION / FORK / JOIN / END / NOTIFICATION / HTTP_CALL / DATA_QUERY / COMPUTE`（**注意是技术节点类型，不是业务流程角色**）。
- [⚠] **Q8.2** 是否覆盖 SupplyCores 11 个节点字段？请逐项确认（基于代码 vs 详设 10 §4.9 重新校对）：
  - node_sequence ✗ —— Catio 是 V2 图结构（nodes + edges），**节点顺序由 edges 拓扑推导，无显式 sequence 字段**。SupplyCores 若需要线性 sequence，需在导出/适配层做拓扑排序后编号。
  - node_type（5 种值域：发起/初审/复核/会签/终审） ⚠ —— Catio 的 `type` 是**技术维度**（START/APPROVAL/...），并非"初审/复核/终审"的业务角色。业务语义需通过 `approvalConfig.name` + `approverRuleCode` 表达，会签通过 `approvalConfig.signMode=COUNTERSIGN/OR_SIGN` 表达。
  - approver_type（role/user/org_manager） ⚠ —— 不在节点 inline 字段，落到独立 `ApproverRule` 表的 `RuleType`（节点引用 `approvalConfig.approverRuleCode`，运行时由 `IApproverResolverService` + `Providers/ApproverRuleResolveQueryProvider` 解析）。
  - approver_role_id ⚠ —— 同上，落 `ApproverRule.Config jsonb`，节点不直接持有。
  - approver_org_id ⚠ —— 同上，落 `ApproverRule.Config jsonb`。
  - approve_condition（节点准入条件） ✓ —— 通过独立 `CONDITION` 节点实现，配置 `conditionConfig.{logicOperator, conditions[]}` 或 `conditionConfig.expression`（高级表达式模式，例 `amount * rate > 10000 && department == "FIN"`）。
  - is_parallel（会签并行） ✓ —— `approvalConfig.signMode = COUNTERSIGN`（会签）/ `OR_SIGN`（或签）/ `SINGLE`（单人）。
  - reject_goto_node（驳回跳转节点） ✓ —— `approvalConfig.rejectBehavior` 值域 `END / RETURN_TO_INITIATOR / RETURN_TO_STEP`，配合 `approvalConfig.allowedReturnStepKeys: string[]` 指定可退回到的节点 key。
  - **结论**：11 字段中 3 个 ✓，3 个 ⚠（需走 ApproverRule 间接表达），node_sequence/node_type 与 Catio 的图模型不直接对应（需要 SupplyCores 在适配层做语义映射）。**建议** SupplyCores 详设 10 §4.9 改为"逻辑字段"，物理落点指向 Catio 的 V2 DSL 结构。

---

## 九、部署/Schema 占位

**问 Catio 团队：**

- [✓] **Q9.1** Catio `Nova.Platform` / `Nova.Workflow` 模块表的**默认 schema** 是 `public` 还是其他（如 `workflow`、`platform`）？SupplyCores 节七主路径 SQL 与节 6.3 写明的 schema 必须与 Catio 实际部署一致。
  - ✓ `public`
  - ✓ 其他：`workflow`（Nova.Workflow 模块固定为 `workflow` schema，常量定义见 `WorkflowDbContextModelCreatingExtensions.cs` L15 `const string schema = "workflow"`，迁移 `InitialWorkflow` L16 `EnsureSchema("workflow")`）。Nova.Platform 待平台团队补充。
  - ⚠ 部署方可配置：默认值 ________，配置位置 ________
  - **代码事实**：`Nova.Workflow` 当前是**硬编码** `workflow` schema，**不可由部署方配置**（无 options 注入点）。SupplyCores 详设 10 §七主路径 SQL 与 §6.3 须将所有 Workflow 相关表前缀统一改为 `workflow.process_definitions`、`workflow.process_instances`、`workflow.approval_records`、`workflow.approval_tasks`、`workflow.approver_rules`、`workflow.process_definition_versions`、`workflow.business_process_bindings` 等。

---

## 十、回复格式建议

为方便 SupplyCores 一次性吸收回复，建议：

1. 在每条 ✓/✗ 框打勾，必要时补字段名/版本/示例；
2. 如条目不清楚，备注 `[需澄清]` + 问题；
3. 整体在节十一签字栏写明回复人 + 日期 + Catio 仓库当前 commit/tag。

---

## 十一、签字栏


| 项                     | 内容       |
| --------------------- | -------- |
| 回复人                   | ________ |
| 回复日期                  | ________ |
| Catio 仓库 commit / tag | ________ |
| 备注                    | ________ |


---

## 附件：相关文档对照


| 名称              | 路径                                           | 说明                        |
| --------------- | -------------------------------------------- | ------------------------- |
| 详设 10 字段定义      | `docs/详细设计/10-权限审批流详细设计-V1.0.md`             | A-01~A-20 完整字段规范          |
| 10A 整合方案        | `docs/详细设计/10A-权限审计域整合方案-V0.4.md`（即将升级 V0.5） | 实施层选择 + 适配层 + 阶段排期 + 风险登记 |
| 10A 节 5A 字段映射详表 | 同上文档 §五A                                     | 已识别缺口的字段级 ✗/? 标注          |
| 概设 01 部署边界      | `docs/概设/01-...` 节 6.1                       | "物资系统独立部署、不访问 Nova 底层数据库" |


