# Sprint 3 任务卡 — T-01 招投标主链 + C-03 合同变更 + S-05 入库（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 / 待评审）
**日期：** 2026-05-12
**文档性质：** 开发实施层 · Sprint 任务卡（待评审）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 3（预估 10 工作日 / 约 2 周）
**衔接文档：**

- 上游 Sprint 节奏 → [`Sprint-2-任务卡-V0.2.md`](./Sprint-2-任务卡-V0.2.md) §三 Sprint 3 衔接（D10-5 起源）
- 上游工时模型 → [`开发进度规划-V0.4.md`](../详细设计/开发进度规划-V0.4.md) §3.3 04/05/06 子模块
- 详设依据：
  - [`04-需求计划与采购协同详细设计-V1.1.md`](../详细设计/04-需求计划与采购协同详细设计-V1.1.md) §4.8 T-01 招标申请 + §4.9-4.12 T-02~T-05 采购方式/招标公告/投标/评标
  - [`05-合同与资金详细设计-V1.1.md`](../详细设计/05-合同与资金详细设计-V1.1.md) §4.3 C-03 合同变更
  - 06 入库管理详细设计 §4.2 S-05 入库（详设若未升 V1.1，按现行版本）
- Sprint 2 落地基线 → commit `942e8f5`（D8-D9 收尾，200 测试通过）

---

## 一、目标与范围

### 1.1 目标

**继续 Stage B2 业务模块铺面**（V0.4 §3.3 招投标 + 入库子模块）：

1. **04 招投标主链起步**：
   - T-01 tender_application 招标申请单
   - T-02 procurement_method 采购方式字典（少量 seed 数据 + Get/List）
   - T-05 tender_result 中标结果（最小可用版，能让 C-01 引用 tender_result_id）
   - **关键 linkage**：P-05.SourceType=招采 → 触发 T-01 创建（D4 P-05 已留 endpoint MarkInTender(tenderAppId)，Sprint 3 接通）
2. **05 合同后续起步**：
   - C-03 合同变更单（详设 §4.3）：变更后回写 C-02 + 触发 P-02 调整？（Sprint 2 D2 P-04 调整单已 cover P-02 调整，C-03 主要是合同金额/期限变更）
3. **06 入库主链起步**：
   - S-05 入库单（外购入库 BIZ-001 触发点）
   - **关键 linkage**：S-05 入库审核通过 → 触发 NC BIZ-001 推送（Sprint 2 D9-3 NC stub 此时**真实**消费）

**延后到 Sprint 4 的内容**：
- T-03 招标公告 / T-04 投标 / T-06 评标委员会 / T-07 标包明细
- C-04 履约 / C-05 验收 / C-06 决算
- S-04 质检让步 / S-06 ~ S-22 其他入库出库单据
- M-13 默认成本中心规则
- Stage B1 NovaSync HttpReader 切换 + Catio Workflow 真实联调

### 1.2 基线

- ✅ Sprint 2 commit `942e8f5` 已 push（D1-D9 收尾，200 测试通过）
- ✅ EF migrations 7 条（Init / Add_DemandRequest / Add_PurchasePlan / Add_PlanAdjustment / Add_PurchaseTask / Add_ContractNegotiation / Add_Contract）
- ✅ P-02 → P-05 自动 linkage 已落（D4-1），SubGroupId 端到端继承
- ✅ C-01 → C-02 自动 linkage 已落（D9-2）
- ✅ NC 中等 stub 已落（D9-3，BIZ-001）
- ✅ sub_group_id 钩子覆盖率守护单测（D5-4）

### 1.3 不在范围

- T-03~T-07 完整招投标全链（Sprint 4）
- C-04~C-06 合同后续单据（Sprint 4）
- S-06 入库后续单据（Sprint 4）
- M-13 默认成本中心规则（独立模块按业务方排期）
- Catio Workflow 真实联调（OAuth 凭据未到）
- NC 真实接入（08A 清单回函未到）

### 1.4 完成标准（Sprint 3 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 220 通过（Sprint 2 基线 200 + Sprint 3 新增 ~20）
- [ ] 新增 EF migrations ≥ 4 条（`Add_TenderApplication` / `Add_ProcurementMethod` / `Add_TenderResult` / `Add_ContractChange` / `Add_StockInbound`），全部 apply
- [ ] Sprint-3-Demo-脚本 V0.1 入库（用例 12-14 覆盖招投标 / 合同变更 / 入库链）
- [ ] commit log 整洁 + 5 个左右 feat commit 全 push

---

## 二、按日任务拆解（10 工作日）

### Day 1-2 — T-02 + T-01 招标基线

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | T-02 ProcurementMethod 字典实体（公开招标/邀请招标/竞争性谈判/询比/询价/竞价/单一来源/直接采购/小额采购 9 类）+ Seed | 04 §4.9 | DataSeedContributor 9 条 |
| D1-2 | EF mapping + Add_ProcurementMethod migration | — | apply 通过 |
| D2-1 | T-01 TenderApplication 实体（详设 §4.8.1 17 字段）+ 7 状态机（草稿/待审/已审/已驳回/进行中/已结案/已作废）| 04 §4.8 | 状态机单测 ≥ 5 |
| D2-2 | EF mapping + Add_TenderApplication migration；sub_group_id 索引 | — | apply 通过 |
| D2-3 | ITenderApplicationAppService + AppService + Controller（6 endpoint） | 04 §4.8 | 单测 ≥ 5 |

**预估工时：** 2 PD

### Day 3 — T-05 中标结果（最小可用）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D3-1 | T-05 TenderResult 实体（招标结果回写，让 C-01 / C-02 能引用 tender_result_id）| 04 §4.12 | 最小字段集 |
| D3-2 | EF mapping + Add_TenderResult migration | — | apply 通过 |
| D3-3 | AppService + Controller（CRUD） | 04 §4.12 | 单测 ≥ 3 |

**预估工时：** 1 PD

### Day 4 — P-05 → T-01 自动 linkage

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D4-1 | IPurchaseTaskToTenderLinkage：P-05 MarkInTender 调用前先自动创建 T-01 草稿 | 04 §4.7.2 业务规则 2 路径分发 + 原型 v0.16 | 单测：P-05 触发后自动建 T-01 |
| D4-2 | 改 PurchaseTaskAppService.MarkInTenderAsync：参数从 `tenderAppId` 改为可选 → 不传时自动建 T-01 + 回填 | — | 兼容已有 endpoint |
| D4-3 | E2E：从 P-01 提交 → P-02 已分解 → P-05 招采路径 → T-01 草稿自动生成 | — | E2E 单测 1 个 |

**预估工时：** 1.5 PD

### Day 5 — C-03 合同变更单

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D5-1 | C-03 ContractChange 实体（变更类型：金额变更/期限变更/条款变更/补充协议）+ 4 状态机 | 05 §4.3 | 单测 ≥ 4 |
| D5-2 | EF mapping + Add_ContractChange migration | — | apply 通过 |
| D5-3 | AppService + Controller + 变更生效后回写 C-02 字段 | 05 §4.3 | 单测 ≥ 5 |

**预估工时：** 1 PD

### Day 6-8 — S-05 入库主链

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D6-1 | S-05 StockInbound 实体（外购入库主表，~30 字段） | 06 §4.2 | 字段对齐 |
| D6-2 | S-05.S-22 入库明细行实体 | 06 §4.2 | 字段对齐 |
| D6-3 | 状态机 5 状态（草稿/待审/已审/已驳回/已入库）+ 7 单测 | 06 §4.2 | 单测 ≥ 5 |
| D6-4 | EF mapping + Add_StockInbound migration | — | apply 通过 |
| D7-1 | IStockInboundAppService + AppService + Controller（含 BulkAddLine endpoint） | 06 §4.2 | 单测 ≥ 5 |
| D7-2 | 入库审核通过后回写 C-02.ExecutedAmount 增量 | 05 §4.2.2 状态迁移约束（已签 → 执行中） | 单测覆盖 |
| D8-1 | **关键 linkage：S-05 入库审核通过 → 触发 NC BIZ-001 真实推送**（Sprint 2 D9-3 stub 此时被实际消费） | 详设 08 §5.2 BIZ-001 + V0.2 D9-3 | E2E：审核后 contract.nc_voucher_no 写入 |
| D8-2 | 接通 C-02 状态机：首笔 S-05 入库审核通过 → C-02.StartExecution() 触发（详设 §4.2.2"已签 → 执行中"系统自动驱动） | 05 §4.2.2 | E2E 单测 |

**预估工时：** 3 PD

### Day 9 — Sprint 2 + Sprint 3 全模块集成测试

| # | 任务 | 验收 |
|---|------|------|
| D9-1 | 端到端 E2E：P-01 → P-02 → P-05 → T-01 → 中标 → C-01 → C-02 → S-05 入库 → C-02 执行中 + NC 凭证号 | 1 个 E2E 集成测试 |
| D9-2 | sub_group_id 钩子覆盖率守护单测扫所有新增业务实体（T-01 / T-05 / C-03 / S-05 / S-22）| 守护单测覆盖 |
| D9-3 | 跑全量回归 | ≥ 220 通过 |

**预估工时：** 1 PD

### Day 10 — Sprint 3 验收 + Demo + Sprint 4 backlog

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 `dotnet test SupplyCores.slnx` ≥ 220 通过 | 0 失败 |
| D10-2 | Sprint-1/2-Demo 用例 1-11 回归跑通；Sprint-3-Demo 新增用例 12-14（招投标 / 合同变更 / 入库 + NC 推送）| 全 200 OK |
| D10-3 | `docker compose up` 容器内跑 D10-2 全套 | 容器内 demo 全通过 |
| D10-4 | 写 `Sprint-3-Demo-脚本-V0.1.md` | 文档入库 |
| D10-5 | 起 Sprint 4 任务卡草案：T-03~T-07 招投标后续 + C-04~C-06 合同收尾 + S-04/S-06+ 入库出库单据 + Catio Workflow 真实联调 + NC 真实接入（依赖 08A 回函）| `Sprint-4-任务卡-V0.1.md` 草案 |
| D10-6 | 整理 Sprint 3 commit log + PR / release notes | git log 整洁 |

**预估工时：** 1 PD

---

## 三、Sprint 4 衔接 + 远端衔接

### 3.1 Sprint 4（下一个 Sprint）

| 重点 | 详设依据 | 预估 PD |
|------|---------|---------|
| T-03 招标公告 / T-04 投标 / T-06 评标委员会 / T-07 标包明细 | 04 §4.10-4.13 | ≈ 8-10 PD |
| C-04 履约 / C-05 验收 / C-06 决算 | 05 §4.4-4.6 | ≈ 8 PD |
| S-04 质检让步 / S-06+ 其他入库出库单据起步 | 06 §4.1, §4.3+ | ≈ 5 PD |
| Catio Workflow 真实联调（OAuth 凭据到位后切真实 chain 解析） | 10A V1.1 + NovaSync 切换方案 | ≈ 2 PD |
| NC 真实接入（08A 回函到位后切真实 endpoint） | 08A V0.1 → V0.2 联动详设 08 升 V1.2 | ≈ 3 PD（实施侧）|

### 3.2 远端衔接（不在 Sprint 4 范围）

- 多二级集团扩展（清能 / 铁煤 / 沈煤 等 10 家二级集团）
- 大规模业务上线后的性能优化（含 sub_group_id 索引 P95 监控）
- 业务方决策的几个占位项（M-13 默认成本中心规则 / 暂估价差阈值 / 委托加工来源单据等）

---

## 四、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 招投标外部对接（能源集团招采平台）延期 | 高 | T-04 投标 / T-06 评标接口形态不定 | Sprint 3 不依赖招采平台，T-01/T-02/T-05 主链先落，T-04+ 留 Sprint 4 |
| NC 团队 08A 清单回函 SLA | 中 | D8-1 真实推送切换时点未定 | Sprint 3 仍用 Sprint 2 MockNcInterfaceService；08A 回函后 D8-1 替换实现 |
| 详设 06 入库主链版本（V1.1 是否就绪） | 中 | S-05 字段以详设为准；如详设未升 V1.1 须先升 | Sprint 3 D1 起手前确认 |
| sub_group_id 写入钩子新业务实体覆盖率 | 低 | D9-2 守护单测兜底 | Sprint 2 D5-4 已建守护，新加业务实体若违规立刻失败 |

---

## 五、可复用资产（Sprint 1 → 2 → 3 沿用）

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` 基类 | Sprint 1 D6 | 所有新业务实体（T-01/T-05/C-03/S-05/S-22）继承 |
| `XxxManager.CreateDraftAsync(orgId, ...)` Domain Service 模式 | Sprint 1 D6+ | 每个 AppService 用 Manager 触发 sub_group_id 钩子 |
| `IXxxLinkage` + `[ExposeServices]` 抽象 | Sprint 1 D7+ | P-05→T-01 / S-05→C-02 / S-05→NC linkage 沿用 |
| `INcInterfaceService.PushAsync` 抽象 | Sprint 0 D2 NC-MD-001 + Sprint 2 D9-3 BIZ-001 | S-05 入库审核触发真实 BIZ-001 推送 |
| EnforceSnakeCaseColumnNames 自动 snake_case | Sprint 0 D11 | EF mapping 写 ToTable + ConfigureByConvention |
| Mapperly mapper 模板 | Sprint 0 D2 | 实体 ↔ DTO 全走 Mapperly |
| NSubstitute in-memory repo 测试模板 | Sprint 1 D7-D9 | 新单测复用 |
| sub_group_id 钩子覆盖率守护单测 | Sprint 2 D5-4 | 守护新加业务实体不违规 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-12 | 首版草案，Sprint 2 D10-5 起。范围：T-01 招标主链 + T-02 字典 + T-05 中标结果 + P-05→T-01 linkage + C-03 合同变更 + S-05 入库 + S-05→NC BIZ-001 真实推送。预估 10 PD。T-03~T-07 + C-04~C-06 + S-04/S-06+ 延后 Sprint 4。Catio Workflow 与 NC 真实接入依赖外部回函，留 Sprint 4。待用户评审 + 三方进度信号回函后升 V0.2 联动。 |
