# Sprint 13a Day 1-3 详设 10 权限审批 — 实施设计草案（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 13a A 主线实施细化设计
**配套：** [`Sprint-13a-任务卡-V0.2.md`](./Sprint-13a-任务卡-V0.2.md) §一A + 详设 10 V1.2

---

## 一、范围（A1-A3，~6 PD · 主代理 a 主线）

详设 10 V1.2 共 20 类审批模板 + 21 条高敏感拦截器。本 Sprint 一期聚焦 **8 类核心模板 + 8 条核心高敏感**（约 40% 覆盖，剩余 Sprint 14a/15a）。

| Day | Task | 工时 | 说明 |
|---|---|---|---|
| **D1-1** | A-08/A-09/A-10/A-14 表骨架 + Wave 80 migration（schema `a`）| 0.8 PD | 4 表：approval_workflow / approval_node / approval_opinion / audit_log；含外键 + 索引 |
| **D1-2** | ApprovalWorkflow / ApprovalNode 实体 + Manager（创建审批实例 / 状态机）| 1.2 PD | 状态机：草稿 → 审批中 → 通过/退回/终止；Manager 含 InitiateAsync / ApproveNodeAsync / RejectAsync |
| **D2-1** | 8 类核心审批模板配置 seed（Wave 81）| 1.5 PD | WF-CON-001 合同 / WF-PAY-001 付款 / WF-PR-001 申请 / WF-PO-001 订单 / WF-DIR-001 直达 / WF-CON-002 合同变更 / WF-RPR-001 外委检修 / WF-CON-OVERLIMIT-001 超 40% 加签 |
| **D2-2** | 8 条核心高敏感操作 seed + 拦截器（A-11 表）| 1.0 PD | WF-CON-002 变更 / WF-CON-003 终止 / WF-PAY 付款 / WF-TRF 跨组织调拨 / WF-SHT 盘亏 / WF-SCP 废旧处置 / WF-SUP 供应商黑名单 / WF-REV 月结反结 |
| **D3-1** | ApprovalAppService（启动审批 / 节点审批 / 查询）+ 4 endpoint | 0.8 PD | InitiateAsync / ApproveNodeAsync / RejectAsync / GetMyPendingAsync |
| **D3-2** | HTTP Controller + 测试 ≥ 12 | 0.7 PD | RESTful endpoint + 状态机单测 + 集成 E2E |

**合计 ~6.0 PD**（V0.2 §一A 预算）

**一期不做（顺延 Sprint 14a/15a）**：
- 集团并行会签 V1.2（OR 节点支持）
- 阶段 A/B/C 适配层（详设 10A V0.6）
- 角色权限矩阵初始化（依赖 M-04 user_copy 同步）
- sub_group_id A-06 一刀切口径（依赖 A-06 实施）

---

## 二、Schema 设计（D1-1，0.8 PD）

### 2.1 A-08 approval_workflow（审批流程模板）

```sql
CREATE TABLE a.approval_workflow (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    workflow_code   VARCHAR(32) NOT NULL,        -- WF-CON-001 / WF-PAY-001 ...
    workflow_name   VARCHAR(128) NOT NULL,
    business_entity VARCHAR(32) NOT NULL,        -- contract / payment_request / purchase_request
    is_sensitive    BOOLEAN NOT NULL DEFAULT false,  -- 高敏感操作（联动 A-11）
    status          VARCHAR(8) NOT NULL DEFAULT '启用',  -- 启用 / 停用
    ... [审计字段] ...
    CONSTRAINT uk_approval_workflow_code UNIQUE (workflow_code)
);
```

### 2.2 A-09 approval_node（审批节点）

```sql
CREATE TABLE a.approval_node (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    workflow_id     BIGINT NOT NULL REFERENCES a.approval_workflow(id),
    node_seq        INT NOT NULL,                -- 1, 2, 3 ...
    node_name       VARCHAR(64) NOT NULL,
    approver_role   VARCHAR(64) NOT NULL,        -- 复用 A-02 business_role.role_code
    condition_expr  TEXT,                        -- 触发条件（如金额 > 100W）
    ... [审计字段] ...
    CONSTRAINT uk_approval_node_workflow_seq UNIQUE (workflow_id, node_seq)
);
```

### 2.3 A-20 approval_instance（运行态实例 — 沿用现有）

已存在；本期接通：
- approval_chain_snapshot JSONB 字段含模板 freeze
- current_node_seq 追踪当前进度

### 2.4 A-11 sensitive_operation（高敏感操作枚举）

```sql
CREATE TABLE a.sensitive_operation (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    operation_code  VARCHAR(32) NOT NULL,        -- SENS-CON-002 / SENS-PAY-001 ...
    operation_name  VARCHAR(128) NOT NULL,
    workflow_code   VARCHAR(32),                 -- 关联 A-08
    audit_required  BOOLEAN NOT NULL DEFAULT true,  -- 必写 a.audit_log
    ... [审计字段] ...
    CONSTRAINT uk_sensitive_operation_code UNIQUE (operation_code)
);
```

---

## 三、8 类核心审批模板（D2-1 Wave 81 seed）

按业务优先级 + Sprint 11a/12a 已有业务实体覆盖排序：

| # | workflow_code | 业务实体 | 触发条件 | 节点数 |
|---|---|---|---|---|
| 1 | **WF-CON-001** | contract（C-02）| 金额 ≤ 100W → 2 节点 ；> 100W → 3 节点 | 2-3 |
| 2 | **WF-PAY-001** | payment_request（C-08）| V1.2 调整 5 节点 | 5 |
| 3 | **WF-PR-001** | purchase_request | 金额 / 物资类别 | 2 |
| 4 | **WF-PO-001** | purchase_order | 金额 / 供应商状态 | 2 |
| 5 | **WF-DIR-001** | direct_delivery_exception | > 100W 叠加总经理 | 1-2 |
| 6 | **WF-CON-002** | contract_change | 变更金额 / 高敏感 | 3 |
| 7 | **WF-RPR-001** | outsourced_repair（E-05）| 1W/10W 分档 | 2-3 |
| 8 | **WF-CON-OVERLIMIT-001** | contract_overlimit | 设备原值 40% 加签 | 3 并行 |

**一期顺延 12 类**：CON-003 / TRF / CNT / SHT / SCP / EQP / RNT / MDT / SUP / REV / RPT / PUR-EXC / SUP-REASSESS

---

## 四、8 条核心高敏感操作（D2-2 A-11 seed）

| # | operation_code | 关联 workflow | 拦截动作 |
|---|---|---|---|
| 1 | **SENS-CON-002** | WF-CON-002 | 合同变更必走审批 + 写 a.audit_log |
| 2 | **SENS-CON-003** | WF-CON-003 | 合同终止必走审批 + 留痕 |
| 3 | **SENS-PAY-001** | WF-PAY-001 | 付款金额超阈拦截 |
| 4 | **SENS-TRF-001** | WF-TRF-001 | 跨组织调拨拦截 |
| 5 | **SENS-SHT-001** | WF-SHT-001 | 盘亏处理拦截 |
| 6 | **SENS-SCP-001** | WF-SCP-001 | 废旧处置拦截 |
| 7 | **SENS-SUP-001** | WF-SUP-001 | 供应商黑名单解除拦截 |
| 8 | **SENS-REV-001** | WF-REV-001 | 月结反结拦截 |

---

## 五、ApprovalAppService 4 endpoint（D3-1，0.8 PD）

```csharp
public interface IApprovalAppService : IApplicationService
{
    Task<ApprovalInstanceDto> InitiateAsync(InitiateApprovalInput input);  // 启动审批
    Task<ApprovalInstanceDto> ApproveNodeAsync(long instanceId, ApproveInput input);  // 当前节点审批
    Task<ApprovalInstanceDto> RejectAsync(long instanceId, RejectInput input);        // 退回
    Task<List<ApprovalInstanceDto>> GetMyPendingAsync(GetMyPendingInput input);       // 我的待办
}
```

**Auth 校验**：
- `[Authorize(SupplyCoresPermissions.Approval.Initiate)]` — 一期占位，Sprint 14a 角色权限矩阵接通后启用
- caller 必须对 business_entity 有 approval 权限

---

## 六、测试矩阵（D3-2，0.7 PD，≥ 12 个）

| # | 测试 | 类型 |
|---|---|---|
| 1 | ApprovalWorkflow_Create_Should_Set_Initial_Status | Domain |
| 2 | ApprovalInstance_Initiate_Should_Snapshot_Chain | Domain |
| 3 | ApprovalInstance_Approve_Should_Advance_Node_Seq | Domain |
| 4 | ApprovalInstance_Reject_Should_Move_Back_To_Previous | Domain |
| 5 | ApprovalInstance_Last_Node_Approve_Should_Complete | Domain |
| 6 | ApprovalInstance_Reject_From_First_Should_Terminate | Domain |
| 7 | ApprovalAppService_Initiate_Should_Find_Workflow_By_Code | Application |
| 8 | ApprovalAppService_Approve_Should_Validate_Caller_Role | Application |
| 9 | GetMyPending_Should_Filter_By_User_And_Role | Application |
| 10 | WF-CON-001_Should_Have_2_Nodes_Or_3_By_Amount | Seed validation |
| 11 | SensitiveOperation_Should_Cover_8_Core_Codes | Seed validation |
| 12 | Wave80_Migration_Should_Create_4_Tables | EFCore |
| 13 | Sprint13aApproval_E2E（启动 → 审批 → 完成）| E2E |

**基线增量**：1364 → ~1377（+13）

---

## 七、风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 20 类模板一期仅做 8，业务部门可能期望更多 | 中 | 优先级排序按已有业务实体（C-02 / C-08 已落）；顺延 12 类进 Sprint 14a |
| 2 | A-20 approval_instance 已存在但未接通业务 | 中 | 复用现有 schema；Manager 内 InitiateAsync 创建实例时 freeze chain_snapshot |
| 3 | 高敏感拦截器需要 ABP Interceptor 注入 | 低 | 一期用 AppService 层显式校验（Sprint 14a 改 ABP Interceptor 通用机制）|
| 4 | 节点 condition_expr 表达式引擎 | 中 | 一期硬编码 if-else（金额阈值）；Sprint 14a 改 NCalc / 表达式引擎 |

---

## 八、决策点（待 cici V0.1 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | 一期模板数（V0.1 8 类 vs 10 类 vs 12 类）| 8 类（核心覆盖 + 6 PD 内合理）|
| 2 | 高敏感拦截器实现（V0.1 AppService 显式校验 vs ABP Interceptor）| AppService 显式（一期简化）|
| 3 | condition_expr 表达式引擎 | 硬编码 if-else（一期）|
| 4 | A-20 approval_instance 是否复用 vs 新建 | 复用（schema 已存在）|

---

## 九、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 8 模板 + 8 高敏感 + 4 endpoint + 测试矩阵 + 4 决策点 |
