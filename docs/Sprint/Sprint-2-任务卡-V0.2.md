# Sprint 2 任务卡 — P-04/P-05 + 合同三件套 + P-02→P-05 linkage（V0.2）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（用户评审 8 决策点后定版）
**日期：** 2026-05-12
**文档性质：** 开发实施层 · Sprint 任务卡
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 2（预估 10 工作日 / 约 2 周）
**衔接文档：**

- 上游 Sprint 节奏 → [`Sprint-1-任务卡-V0.7.md`](./Sprint-1-任务卡-V0.7.md) §三 Sprint 2 衔接（D10-5 起源）
- 上游工时模型 → [`开发进度规划-V0.5.md`](../详细设计/开发进度规划-V0.5.md) §3.2 04 / 05 子模块
- 详设依据 → [`04-需求计划与采购协同详细设计-V1.1.md`](../详细设计/04-需求计划与采购协同详细设计-V1.1.md) §4.6 P-04 / §4.7 P-05 / [`05-合同管理详细设计-V1.1.md`](../详细设计/05-合同管理详细设计-V1.1.md) §4.1 C-01 / §4.2 C-02
- Sprint 1 落地基线 → commit `77a9505`（D9 收尾，126 测试通过）

---

## 一、目标与范围

### 1.1 目标

**继续 Stage B2 业务模块铺面**（V0.4 §3.2 / §5.2）：

1. **04 P-04/P-05 收尾**——把 D8 已审 P-02 接到分解执行：
   - P-04 plan_adjustment 计划调整单（详设 §4.6）
   - P-05 purchase_task 采购任务单（详设 §4.7 + 原型 v0.16 B 方案任务分解）
   - **关键 linkage：** P-02 `已审` → P-05 任务自动生成 → P-02 `已分解`（Sprint 1 D8 MarkDecomposed 在此接通）
2. **05 合同三件套起步**：
   - C-01 contract_negotiation 合同会签（详设 §4.1）
   - C-02 contract 合同主体（详设 §4.2）
3. **延后到 Sprint 3 的内容**（V0.4 §3.2 工时上限超 Sprint 2）：
   - T-01~T-07 招投标全链（招采平台对接 +30 PD 外部协调，需要先回函 § 三）
   - C-03~C-XX 合同变更 / 履约 / 验收 / 决算后续单据

### 1.2 基线

- ✅ Sprint 1 commit `77a9505` 已 push（D1-D9 收尾，126 测试通过）
- ✅ EF migrations 3 条：`Init` / `Add_DemandRequest` / `Add_PurchasePlan`（本地 DB 已 apply）
- ✅ P-01 → P-02 自动 linkage 已落（D8-4），sub_group_id 端到端继承
- ✅ Material 编码生成 + 批量导入（D4-D5）+ NovaSync 996 行真实组织树
- ⚠ **预备动作**：Sprint 2 D1 起手前确认 Sprint-1-Demo 用例 7-8 在容器内跑通（D10-3 验收点）

### 1.3 不在范围

- T-01~T-07 招投标全链（外部对接缓冲 +30 PD，留 Sprint 3）
- C-03+ 合同后续单据（变更 / 履约 / 验收 / 决算）
- M-13 默认成本中心规则（独立模块，按业务方排期跟进）
- Stage B1 NovaSync HttpReader 切换（Catio 团队 OAuth 凭据 + §九 Bis 回函）

### 1.4 完成标准（Sprint 2 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 145 通过（Sprint 1 基线 126 + Sprint 2 新增 ~20）
- [ ] 新增 EF migrations ≥ 3 条（`Add_PlanAdjustment` / `Add_PurchaseTask` / `Add_Contract`），全部 apply 通过
- [ ] Sprint-2-Demo-脚本 V0.1 入库（用例 9-11 覆盖 P-04 / P-05 链 / C-01 + C-02 起草）
- [ ] Sprint-2-Demo 在 docker compose 容器内全 200 OK
- [ ] commit log 整洁 + 5 个左右 feat commit 全 push 到 main

---

## 二、按日任务拆解（10 工作日）

### Day 1 — P-04 plan_adjustment Domain + EF

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | 新增 Domain 实体 `PlanAdjustment`（继承 SupplyCoresFullAuditedAggregateRoot；含 `adj_type` 5 类）| 04 V1.1 §4.6.1 全字段 | 14 字段对齐 |
| D1-2 | 状态机方法：`Submit() / Approve(approverUserId) / Reject(reason)` | 04 V1.1 §4.6.2 业务规则 | 单测 ≥ 4 |
| D1-3 | EF mapping + `Add_PlanAdjustment` migration；sub_group_id 索引 | 同 D6 模式 | apply 通过 |

**预估工时：** 1 PD

### Day 2 — P-04 AppService + Controller + 业务规则生效

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D2-1 | `IPlanAdjustmentAppService` + AppService（Get/List/Create/Submit/Approve/Reject）| 04 §4.6 | 单测 ≥ 5 |
| D2-2 | 业务规则三路径：`adj_type=取消行` 须 P-03 `fulfillment_state=待采购`；`adj_type=增量/减量` Approve 后更新对应 P-03 行；**`adj_type=新增行` Approve 后 new PurchasePlanLine（含 SubGroupId 对齐 P-02）** | 04 §4.6.2 业务规则 2-3（V0.2 决策点 6 明确「新增行」补建路径）| 单测覆盖 cancel / increment / new-row 3 路径 |
| D2-3 | Controller `/api/supply-cores/plan-adjustments` | — | Swagger 可见 |

**预估工时：** 1.1 PD（V0.2 +0.1 PD 决策点 6 新增行路径）

### Day 3 — P-05 purchase_task Domain + EF

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D3-1 | 新增 Domain 实体 `PurchaseTask`（继承基类；含 `source_type` ∈ 招采/直采/合同采购）| 04 §4.7.1 | 字段对齐 |
| D3-2 | 状态机方法：`AssignTo(userId) / MarkInTender(tenderAppId) / MarkAssignedToContract(prRequestId) / Complete() / Cancel()` | 04 §4.7.2 业务规则 | 单测 ≥ 5 |
| D3-3 | EF mapping + `Add_PurchaseTask` migration | — | apply 通过 |

**预估工时：** 1.5 PD

### Day 4 — P-05 AppService + 任务分解 linkage（关键）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D4-1 | `IPurchasePlanTaskLinkage` + 实现：P-02 `已审` → 按 source_type 拆 P-05 任务（计划分解 / 紧急采购）| 原型 v0.16 任务分解 B 方案 + 04 §4.5.4 + §4.7 | 单测：1 P-02 (10 行 line) → 10 P-05 任务 |
| D4-2 | `IPurchaseTaskAppService` + AppService（Get/List/Create/Assign/Cancel/...）| 04 §4.7 | 单测 ≥ 5 |
| D4-3 | **接通 D8 P-02 MarkDecomposed**：P-05 全部生成后回写 P-02 `ApprovalState=已分解`（Sprint 1 D8 状态机方法在此首次实际调用）| 04 §4.5.3 + Sprint 1 D8 | E2E：linkage 跑完后 P-02 终态=已分解 |
| D4-4 | Controller `/api/supply-cores/purchase-tasks` | — | Swagger 可见 |

**预估工时：** 1.5 PD

### Day 5 — P-04 + P-05 集成验证 + E2E

| # | 任务 | 验收 |
|---|------|------|
| D5-1 | E2E 链测：P-01 → P-02 → 已审 → linkage 拆 P-05 → P-02 `已分解` | 1 个集成 test 通过 |
| D5-2 | 跑全量 `dotnet test SupplyCores.slnx` 验证回归 | ≥ 145 通过 |
| D5-3 | 提交 P-04/P-05 整段 commit + push | git log 整洁 |
| D5-4 | **sub_group_id 写入钩子覆盖率守护单测**（V0.2 决策点 5）：EFCore.Tests 新增 `SubGroupIdHookCoverage_Tests`，反射扫所有 `SupplyCoresFullAuditedAggregateRoot<long>` 派生类 → 对每个建一个最小 instance 走 Create 路径 → 断言 `SubGroupId` 非 null（集团级共享白名单单独跳过）| sub_group_id 清单 §三 原则 3 + Sprint 1 风险 4 | 1 个守护单测覆盖 P-01/P-06/P-02/P-03/P-04/P-05/C-01/C-02 + Sprint 1 已有实体 |

**预估工时：** 1.3 PD（V0.2 +0.3 PD 决策点 5 守护单测）

### Day 6-7 — C-01 contract_negotiation 合同会签

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D6-1 | 新增 Domain 实体 `ContractNegotiation`（继承基类）| 05 V1.1 §4.1.1 | 字段对齐 |
| D6-2 | 状态机：草稿/会签中/已会签/已驳回；方法 Submit / Approve / Reject | 05 §4.1.2 | 单测 ≥ 4 |
| D6-3 | EF mapping + `Add_ContractNegotiation` migration | — | apply 通过 |
| D7-1 | `IContractNegotiationAppService` + AppService + Controller | 05 §4.1 | 单测 ≥ 5 |
| D7-2 | **多方会签 mock 最简版**（V0.2 决策点 3）：Submit → 会签中（状态转换）→ 一次 Approve 即推进到 已会签。**不解析 approval_chain JSON**（V0.2 决策点 7）；Stage B1 接 Catio Workflow 时一并切真实 chain 推进 | 05 §4.1.3 + 10A | 单测：1 路径（单签即推进）+ log 验证 |

**预估工时：** 2 PD

### Day 8-9 — C-02 contract 合同主体

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D8-1 | 新增 Domain 实体 `Contract`（继承基类；含 contract_type 5 类）| 05 V1.1 §4.2.1 | 字段对齐 |
| D8-2 | 状态机：草稿/已生效/履约中/已完成/已终止/已作废；6 状态 | 05 §4.2.2 | 单测 ≥ 6 |
| D8-3 | EF mapping + `Add_Contract` migration；sub_group_id 索引 | — | apply 通过 |
| D9-1 | `IContractAppService` + AppService + Controller | 05 §4.2 | 单测 ≥ 5 |
| D9-2 | **关键 linkage：** C-01 `已会签` → C-02 草稿自动生成（复制字段 + sub_group_id） | 05 §4.2.4 业务规则 1 + 清单 §修订 #2 原则 3 | E2E 单测 |
| D9-3 | **NC 接口中等 stub**（V0.2 决策点 4）：C-02 生效 → 调 INcInterfaceService.PushAsync('BIZ-001', ...) → 复用 Sprint 0 MockNcInterfaceService 模式 → 回写 mock `nc_voucher_no` 到 contract。Demo 可演完整"合同已生效 + NC 凭证已记账"链路；NC 团队回函后替换实现，外部观感不变 | 详设 08 §5.2 BIZ-001 + 08A 给NC清单 V0.2 + Sprint 0 D2 NC-MD-001 mock 模式 | 单测：C-02 生效后 contract.nc_voucher_no 非空 + INcInterfaceService.PushAsync 被调 1 次 |

**预估工时：** 2 PD

### Day 10 — Sprint 2 验收 + Demo + Sprint 3 backlog

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 `dotnet test SupplyCores.slnx` ≥ 145 通过 | 0 失败 |
| D10-2 | Sprint-1-Demo 用例 1-8 回归跑通；Sprint-2-Demo 新增用例 9-11（P-04 / P-05 linkage / C-01+C-02）| 全 200 OK |
| D10-3 | `docker compose up` 容器内跑 D10-2 全套 | 容器内 demo 全通过 |
| D10-4 | 写 `Sprint-2-Demo-脚本-V0.1.md`（仿 Sprint-1-Demo V0.1 格式）| 文档入库 |
| D10-5 | 起 Sprint 3 任务卡草案：T-01~T-07 招投标 + C-03+ 合同后续单据（按 V0.4 §3.3 工时估算）| `Sprint-3-任务卡-V0.1.md` 草案入库 |
| D10-6 | 整理 Sprint 2 commit log + PR / release notes | git log 整洁 |

**预估工时：** 1 PD

---

## 三、Sprint 3 衔接 + 远端衔接

### 3.1 Sprint 3（下一个 Sprint）

Sprint 2 完成后，Sprint 3 起接（V0.4 §3.3 招投标 + 合同后续）：

| 重点 | 详设依据 | V0.4 工时 |
|------|---------|----------|
| T-01~T-07 招投标全链 | 04 V1.1 §4.8 | ≈ 15-25 PD（外部对接 +30 PD 缓冲）|
| C-03 合同变更 / C-04 履约 / C-05 验收 / C-06 决算 | 05 V1.1 §4.3-4.6 | ≈ 12-15 PD |
| 入库 S-04 质检让步 + S-05 入库 | 06 V1.1 §4.1 / §4.2 | ≈ 10 PD |

### 3.2 NC 接口预联调（远端衔接）

Sprint 2 D9-3 已落 NC endpoint stub；正式联调需先收 NC 团队回函（[08A-给NC团队的对接需求清单-V0.2.md](../详细设计/08A-给NC团队的对接需求清单-V0.2.md)）。
NC 凭据 + endpoint 到位后：

- BIZ-001 采购入库正式（合同入库 → NC 凭证生成 + 回写凭证号）
- BIZ-005A 对厂矿销售出库（视同销售凭证模板）
- F-13 接口开关 + F-12 科目规则配置

工时预估：2-3 PD 实施 + NC 团队 5-10 PD 联调。

### 3.3 Stage B1（远端衔接）— NovaSync 实施层切换

不变，沿用 Sprint 1 V0.7 §3.2 描述。

---

## 四、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 招投标外部对接（能源集团招采平台）延期 | 高 | 阻塞 Sprint 3 T-01~T-07 | Sprint 2 不依赖招采平台，主线推 P-04/P-05/C-01/C-02 即可 |
| Catio Workflow（A-08~A-20）真实联调时机未定 | 中 | C-01 多方会签先用 mock，真实切换时需 D7-2 改造 | Sprint 2 D7 用 mock 接口；约定切换点在 Stage B1 |
| NC 团队回函（08A 清单）SLA 未确认 | 中 | C-02 NC 接口 stub 占位足够，但正式联调时点不定 | Sprint 2 D9-3 只声明 stub，本期不做正式 NC 推送 |
| sub_group_id 写入钩子覆盖率（D6-6 Sprint 1 已建模板） | 低 | 新业务实体若忘写钩子，导致 SubGroupId 为 null | EFCore.Tests 加守护单测：所有 IsBusinessTable + has SubGroupId 实体 SubGroupId 非空率 100% |

---

## 五、可复用资产（Sprint 1 → Sprint 2）

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` 基类 | Sprint 1 D6 | 所有新业务实体继承，自动获得 SubGroupId / CreatedOrgId / DeleteReason |
| `XxxManager.CreateDraftAsync(orgId, ...)` Domain Service 模式 | Sprint 1 D6 + D8 | 每个 AppService 用 Manager 触发 sub_group_id 写入钩子 |
| `IXxxLinkage` + `[ExposeServices]` 抽象 | Sprint 1 D7-D8 | P-02→P-05 linkage 沿用同模式（D4-1） |
| EnforceSnakeCaseColumnNames 自动转 snake_case | Sprint 0 D11 | EF mapping 写 ToTable + ConfigureByConvention 即可 |
| Mapperly `[Mapper(RequiredMappingStrategy = Target)]` 模式 | Sprint 0 D2 | 实体 ↔ DTO 全部走 Mapperly |
| NSubstitute in-memory repo 测试模板 | Sprint 1 D7-D9 | 新单测/E2E 复用 mock 仓储 lambda 模板 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-12 | 首版草案，Sprint 1 D10-5 起。范围：P-04 / P-05 + C-01 + C-02 + 关键 linkage 接 D8 MarkDecomposed。预估 10 PD。T-01~T-07 招投标延后 Sprint 3。待用户评审 + 业务方/Catio/NC 三方进度信号回函后升 V0.2 联动。 |
| V0.2 | 2026-05-12 | 用户评审 8 决策点后定版：(1) 范围维持 V0.1 4 模块 4 PD（决策点 1）；(2) P-02→P-05 选 B 方案（决策点 2）；(3) D7-2 C-01 mock 最简单签即推进 + 不解析 approval_chain（决策点 3+7）；(4) D9-3 NC 中等 stub 复用 MockNcInterfaceService 回写 mock 凭证号（决策点 4）；(5) 新增 D5-4 sub_group_id 写入钩子覆盖率守护单测（决策点 5，+0.3 PD）；(6) D2-2 新增「新增行」补建 P-03 路径 + 单测（决策点 6，+0.1 PD）；(7) Demo curl 留 D10-4 时补（决策点 8）。工时合计 10.4 PD（10 PD 内可挤）。文件名 V0.1 → V0.2 git mv 同 commit。 |
