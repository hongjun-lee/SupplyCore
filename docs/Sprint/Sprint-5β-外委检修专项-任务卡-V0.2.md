# Sprint 5β 任务卡 — 外委检修专项 + 4 审批模板（V0.2）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（评审后锁版 / 实施基线）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（实施基线）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 5β（预估 10 工作日 / 约 2 周）
**并行轨道：** 与 Sprint 5α 招投标闭环 平行进行（详 [`Sprint-5α-招投标闭环-任务卡-V0.2.md`](./Sprint-5α-招投标闭环-任务卡-V0.2.md)）

**衔接文档：**

- 上游 Sprint → [`Sprint-5-任务卡-V0.2.md`](./Sprint-5-任务卡-V0.2.md)（D0-D2 已落基线）
- 详设依据：07 V1.0a §五（E-01 / E-05 含外委检修字段）+ §八（40% 上限配置项）/ 05 V1.3 §4.2.1、§8.7 / 10 V1.2 §7.1（SENS-CON-004）
- Sprint 5 落地基线 → commit `966561c`（D0-D2 收尾 + T-07 Material Active 强约束加固，370 测试通过）

---

## 一、目标与范围

### 1.1 V0.2 锁版范围（10 PD）

Sprint 5β 聚焦 **E 域设备起步** + **外委检修业务闭环（40% 上限 + 高敏感拦截器 + 4 审批模板）**，与 Sprint 5α（T 域 + S 域出库）几乎正交，仅共享 DbContext / ModelSnapshot 治理协议。

**前置发现**：详设 07 已是 V1.0a（含外委检修字段 + 40% 上限配置项），**Sprint 5β 不需要升 07**；可能需 05 V1.2 → V1.3 小升把 `equipment_id` 字段落入 C-02 §4.2.1。

**A. 详设小升版（~0.5 PD）**
- 05 V1.2 → V1.3 小升：§4.2.1 C-02 全字段表追加 `equipment_id`（外委检修合同关联设备）+ `overlimit_reason` + `overlimit_approval_id`（详设 §8.7.3 V1.2 留 V1.3 项）

**B. E 域设备主档最小可用（~1.5 PD）**
- E-01 Equipment 设备主档（含 `equipment_original_value` 原值字段——40% 上限计算基数）
- E-02 EquipmentCategory 设备分类字典（轻量）

**C. E-05 RepairApplication 外委检修申请（~2.5 PD）**
- E-05 实体 + 6 状态机：草稿 / 待审 / 已审 / 已驳回 / 进行中 / 已完工
- 外委检修字段（repair_mode / repair_amount / repair_contract_id / repair_supplier_id / repair_workflow_instance_id 等，详设 07 §五已定义）
- Manager 写入钩子（EquipmentId → Equipment → OrgId → SubGroupId）+ Equipment Active 强约束（同 Sprint 5 D1-D2 Material 加固风格）

**D. 40% 上限 + SENS-CON-004 高敏感（~2 PD）**
- C-02 加 `EquipmentId` 字段（指向 E-01）+ `OverlimitReason` + `OverlimitApprovalId`
- C-02 内 `service_subtype=外委检修` 时校验：合同总额 ≤ Equipment.OriginalValue × 0.40（SY-02 `OUTSOURCED_REPAIR_PRICE_CAP_RATIO` 可配置）
- SENS-CON-004 seed（合同金额超阈值）+ 拦截器（ContractAppService.SubmitAsync 时检查）+ WF-CON-OVERLIMIT-001 触发占位

**E. 4 新审批模板 mock seed（~1 PD）**
- WF-DIR-001（直达例外）/ WF-RPR-001（外委检修审批）/ WF-CON-OVERLIMIT-001（合同超阈）/ WF-SUP-REASSESS-001（后评价联动）
- 配置 seed contributor + 单测覆盖加载

**F. 集成 + Demo + Sprint 6β 草案（~2.5 PD）**
- Sprint5β_RepairChain_E2E：E-01 设备 → E-05 申请 → 审批通过 → C-02 合同（含 service_subtype=外委检修 + 40% 校验）→ 超阈值场景触发 SENS-CON-004
- 全量回归 ≥ 410 通过
- Sprint-5β-Demo-脚本-V0.1
- Sprint-6β 任务卡草案（设备完整 E-03~E-12 + 暂估双预警 + 后评价联动）

### 1.2 V0.2 评审决策点（已锁版）

| # | 决策点 | 锁版结论 | 理由 |
|---|--------|----------|------|
| 1 | 详设升版范围 | **05 V1.2 → V1.3 小升**（加 C-02 equipment_id + overlimit_*）| 07 V1.0a 已含外委检修字段，不再升 07；05 V1.3 落 C-02 字段表保持文档代码同步 |
| 2 | E 域最小可用 | **E-01 + E-02 都落** | E-01 是 40% 上限计算基数源；E-02 字典轻量同期落避免后续 Sprint 6β 字典补建 |
| 3 | E-05 状态机 | **6 状态完整**（草稿/待审/已审/已驳回/进行中/已完工）| 详设 07 §五已明确，进行中/已完工 状态机方法简单；分批不省工 |
| 4 | SENS-CON-004 拦截范围 | **仅 C-02 超阈值** | E-05 申请阶段 1 万/10 万分档已走 SY-02 配置；SENS-CON-004 专注合同金额超原值 40% 阈值 |
| 5 | 4 审批模板配置 | **4 个全 mock seed** | seed 写法成本低（参考 SENS-CON seed 模式），一次落齐避免 Sprint 6 重复 |
| 6 | β/α 集成边界 | **β 不依赖 α** | 两轨道完全正交；β E2E 不引用 α T-08 评标流程 |
| 7 | 总工时上限 | **严卡 10 PD** | 与 α 一致；不再用超额换范围 |

### 1.3 不在范围

- Sprint 5α 招投标闭环（独立轨道）
- E-03~E-12 设备完整模块（留 Sprint 6β）
- 设备租赁闭环（详设 07 §4.2，留 Sprint 6β+）
- C-07~C-10 付款流程（α/β 都不做，留 Sprint 6+）
- 暂估双预警 / 超储三级处置 / 后评价联动业务逻辑（仅本 Sprint 落 4 审批模板 mock 配置）
- 09 报表预警 AI 能力

### 1.4 基线

- ✅ Sprint 5 D0-D2 commit `966561c` 已 push（Sprint 4 follow-up + T-06/T-07 + Material Active 加固，370 测试）
- ✅ EF migrations 21 条全部 apply
- ✅ 详设 05 V1.3（含 service_subtype + equipment_id + overlimit_* 字段 + §8.7 40% 上限规则）
- ✅ 详设 07 V1.0a（含 E-05 外委检修字段 + §八 40% 配置项 + 1 万 / 10 万审批分档）
- ✅ Sprint 4 D5-2 已落 SENS-CON-003（履约保证金没收高敏感），SENS-CON-004 沿用同 attribute 风格

### 1.5 完成标准（Sprint 5β 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 410 通过（基线 370 + β 新增 ~40）
- [ ] 新增 EF migrations 3-4 条：Add_Equipment / Add_RepairApplication / Add_Contract_EquipmentId / Add_FourWorkflowTemplates（seed 类）
- [ ] Sprint5β_RepairChain_E2E 通过
- [ ] Sprint-5β-Demo 入库
- [ ] **α 集成回归**：在 β 收尾后，与 α 主分支 merge 后全量再回归一次
- [x] 详设 05 V1.2 → V1.3 升版完成（B1 已完成，commit 见文档仓库）

---

## 二、按日任务拆解（V0.2 锁版，10 PD 严卡）

### Day 1 — 详设 05 V1.2 → V1.3 升版（~0.5 PD）

| # | 任务 | 验收 |
|---|------|------|
| B1-1 | **三动作同 commit**：git mv 05 V1.2.md → V1.3.md / 改头部 / 加 §十四 V1.3 沿革 | 文档入库 |
| B1-2 | §4.2.1 C-02 全字段表追加 3 字段：`equipment_id` (FK→E-01 NULL) / `overlimit_reason` (varchar 512 NULL) / `overlimit_approval_id` (FK→A-20 NULL) | 详设字段表更新 |
| B1-3 | §8.7.3 字段补充建议表更新：`service_subtype` ✅（V1.2 已落）/ `equipment_id` / `overlimit_reason` / `overlimit_approval_id` 全 ✅ V1.3 已落 | 详设入库 |

**预估工时：** 0.5 PD

### Day 2 — E-01 Equipment + E-02 EquipmentCategory 设备主档（~1.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| B2-1 | E-01 Equipment 实体（含 EquipmentCode / EquipmentName / CategoryId / OrgId / OriginalValue / Status 等核心字段）+ 4 状态机（草稿/启用/停用/报废）| 07 V1.0a §五 E-01 | 单测 ≥ 4 |
| B2-2 | E-02 EquipmentCategory 字典实体（树形或扁平，参考详设 07）| 07 V1.0a §五 E-02 | 字段对齐 |
| B2-3 | Equipment Manager 写入钩子（OrgId 反查 SubGroupId）+ Active 状态守护（同 Material 模式）| Sprint 5 D1-D2 加固经验 | 单测 |
| B2-4 | EF mapping + Wave 31/32 + Add_Equipment migration（schema "e" 首次启用）| — | apply 通过 |
| B2-5 | AppService + Controller（CRUD + Submit/Approve/Disable/Scrap）| — | 单测 ≥ 5 |

**预估工时：** 1.5 PD

### Day 3-5 — E-05 RepairApplication 外委检修申请（~2.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| B3-1 | E-05 RepairApplication 实体 + 6 状态机：草稿 → 待审 → 已审 → 进行中 → 已完工 / 已驳回回路 | 07 V1.0a §五 E-05 | 单测 ≥ 6 |
| B3-2 | 外委检修字段（repair_mode / repair_amount / repair_contract_id / repair_supplier_id / repair_workflow_instance_id / repair_settlement_file_id 等）| 07 V1.0a §五 E-05 补充字段表 | 字段对齐 |
| B3-3 | Manager 写入钩子（EquipmentId → Equipment.OrgId → SubGroupId）+ Equipment Active 前置校验 | sub_group_id 清单 §三 + Sprint 5 D1-D2 加固风格 | 单测 ≥ 2 负向 |
| B3-4 | EF mapping + Wave 33 + Add_RepairApplication migration | — | apply 通过 |
| B3-5 | E-05 AppService + Controller（CRUD + Submit / Approve / Reject / Start / Complete）| — | 单测 ≥ 6 |
| B3-6 | E-05 1 万 / 10 万审批分档（SY-02 `OUTSOURCED_REPAIR_APPROVAL_THRESHOLD_LOW/HIGH`）| 07 §八配置项 | 单测 ≥ 2（分档边界）|

**预估工时：** 2.5 PD

### Day 6-7 — 40% 上限 + C-02 字段扩展 + SENS-CON-004 拦截（~2 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| B4-1 | C-02 实体加 3 字段：EquipmentId / OverlimitReason / OverlimitApprovalId | 详设 05 V1.3 §4.2.1（B1-2 升版后） | 字段对齐 |
| B4-2 | EF mapping 更新 + Wave （复用 Contract Wave 13）+ Add_Contract_EquipmentId migration | — | apply 通过 |
| B4-3 | Contract.Approve() 内加 40% 上限校验：当 ServiceSubtype="外委检修" + EquipmentId 非空 时，ContractAmount ≤ Equipment.OriginalValue × SY-02 `OUTSOURCED_REPAIR_PRICE_CAP_RATIO`（默认 0.40）；超阈值需 OverlimitReason 必填 + 触发 WF-CON-OVERLIMIT-001 | 详设 05 V1.3 §8.7 + 07 §五业务规则 5 | 单测 ≥ 4（含负向 + 边界） |
| B4-4 | SENS-CON-004 seed 加入 SensitiveOperationDataSeedContributor | Sprint 4 D5-2 SENS-CON-003 模式 | seed 加载 |
| B4-5 | ContractAppService 加 `ApproveOverlimitAsync` endpoint 挂 `[SensitiveOperation("SENS-CON-004")]` attribute（同 SENS-CON-003 风格）| Sprint 4 D5-2 风格 | 反射测试验证 attribute |

**预估工时：** 2 PD

### Day 8 — 4 新审批模板 mock seed（~1 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| B5-1 | WF-DIR-001 直达例外审批模板配置 seed | 详设 10 V1.2 §4.6 | seed 加载 |
| B5-2 | WF-RPR-001 外委检修审批模板配置 seed | 详设 07 §五业务规则 4 | seed 加载 |
| B5-3 | WF-CON-OVERLIMIT-001 合同超阈值审批模板配置 seed | 详设 05 V1.3 §8.7.2 + 10 §4.6 | seed 加载 |
| B5-4 | WF-SUP-REASSESS-001 后评价联动审批模板配置 seed | 详设 09 + 10 | seed 加载 |
| B5-5 | 4 模板单测覆盖加载 + 字段对齐 | — | 单测 ≥ 4 |

**预估工时：** 1 PD

### Day 9 — 集成 + 守护 + 全量回归（~1 PD）

| # | 任务 | 验收 |
|---|------|------|
| B6-1 | Sprint5β_RepairChain_E2E：E-01 设备 → E-05 申请 → 审批通过 → C-02 合同（service_subtype=外委检修 + EquipmentId）+ 40% 上限校验 happy + 超阈值场景（SENS-CON-004 attribute 触发） | E2E 通过 |
| B6-2 | sub_group_id 守护单测自动覆盖 β 新增 3 实体（E-01/E-02/E-05）| 守护单测全过 |
| B6-3 | 全量回归 ≥ 410 通过 | 0 失败 |
| B6-4 | **与 α 主分支 merge 集成回归**：本地 merge α 最新 push 后再跑一次全量 | 集成 0 失败 |

**预估工时：** 1 PD

### Day 10 — Demo + Sprint 6β 草案（~0.5 PD）

| # | 任务 | 验收 |
|---|------|------|
| B7-1 | 全量测试 ≥ 410 通过 | 0 失败 |
| B7-2 | Sprint 1-5 Demo 用例回归 + Sprint 5β 新增用例 27-30（E-01/E-05/40% 上限/SENS-CON-004）| 全 200 OK |
| B7-3 | 写 `Sprint-5β-Demo-脚本-V0.1.md` | 入库 |
| B7-4 | 起 Sprint 6β 任务卡草案：设备完整 E-03~E-12 + 设备租赁闭环 + 后评价联动 + 暂估双预警 | `Sprint-6β-任务卡-V0.1.md` 草案 |
| B7-5 | 整理 Sprint 5β commit log | git log 整洁 |

**预估工时：** 0.5 PD

**Sprint 5β V0.1 总工时（草案）：** 0.5 + 1.5 + 2.5 + 2 + 1 + 1 + 0.5 + 余 1 buffer = **10 PD ✓**

---

## 三、Sprint 6β 衔接

| 候选范围 | 详设依据 | 估计 PD |
|---|---|---|
| 设备完整模块 E-03~E-12（含巡检 / 检修 / 报废 / 调拨）| 07 V1.0a §五 | ~5 |
| 设备租赁闭环（E-09 租赁合同 + E-10 租赁台账 + 一次性收费 + 质保金）| 07 §4.2 + 05 §8.10 | ~3 |
| 后评价自动联动 WF-SUP-REASSESS-001 完整业务逻辑 | 09 + 10 V1.2 | ~3 |
| 暂估 D-90/D-30 双预警 + BIZ-002/003 NC 接口 | 06 + 09 + 11 | ~2 |
| Sprint 5β 顺延 / 集成补强 | — | ~1.5 |

---

## 四、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 与 α 共享 ModelSnapshot.cs 冲突 | 高 | 每次 push 前需 rebase | 协议：晚上 push 前 `git pull --rebase`，冲突时重 add migration |
| Wave 编号撞车 | 低 | EF 表名重复 | 预分配 α=27-30 / β=31-38；越界前同步 |
| 详设 05 V1.3 升版与 B1-1 三动作执行 | 低 | 文档与代码不同步 | B1 第一动作；与 B4 C-02 字段扩展同周内合并 |
| E-01 Equipment 字段范围业务方未完全确认 | 中 | 字段返工 | E-01 最小可用版（核心 6-8 字段 + OriginalValue 必落）；E-02 字典精简 |
| 40% 上限校验依赖 Equipment.OriginalValue 真实数据 | 中 | seed 仅 mock 数据测试 | Sprint 5β 单测/E2E 用 mock；Sprint 6β 接入真实设备档案 |
| α 主分支推进过快导致 β B6-4 集成冲突 | 中 | 集成回归延期 | 每周五双方同步基线 commit；不让单方主分支超 3 天领先 |
| SY-02 `OUTSOURCED_REPAIR_PRICE_CAP_RATIO` 未落地 seed | 中 | 校验逻辑取不到配置 | Sprint 5β B4-3 时同步加 SY-02 seed |

---

## 五、可复用资产

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | E-01/E-02/E-05 实体继承 |
| `XxxManager.CreateDraftAsync` Domain Service | Sprint 1+ | E-01/E-05 各自 Manager |
| 双轨钩子（OrgId 反查 / 关联实体复制）| Sprint 3 D7-2 | E-01 OrgId 反查；E-05 EquipmentId → Equipment.OrgId 反查 |
| Material/Supplier Active 强约束模式 | Sprint 5 D1-D2（同事加固）| E-05 用 Equipment Active 同模式 |
| `SensitiveOperationAttribute` + AuditingStore | Sprint 2 + Sprint 4 D5-2 | SENS-CON-004 沿用 SENS-CON-003 同模式 |
| 详设升版"三动作同 commit"约定 | Sprint 1+ | 详设 05 V1.2 → V1.3 复用 |
| sub_group_id 守护单测覆盖率 | Sprint 2 D5-4 | 反射自动覆盖 E-01/E-02/E-05 |
| 4 模板配置 seed 加载模式 | Sprint 4 D5-2 SENS-CON seed | 4 审批模板同 seed contributor 风格 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，基于 Sprint 5 V0.2 D0-D2 已落基线起。Sprint 级 α/β 并行方案确认后单独成卡。范围 6 类（A 详设小升 / B E 域设备主档 / C E-05 外委检修申请 / D 40% 上限 + SENS-CON-004 / E 4 审批模板 / F 集成 Demo）总 ~10 PD。7 决策点待用户评审 + α 共享治理协议见 §四 风险表。前置发现：详设 07 V1.0a 已含外委检修字段，本 Sprint 不升 07；可能升 05 V1.2 → V1.3 小版（加 C-02 equipment_id / overlimit_*）。|
| V0.2 | 2026-05-13 | 评审 7 决策点一次性按"我倾向"锁版：(1) 05 V1.2 → V1.3 小升；(2) E-01+E-02 都落；(3) E-05 6 状态完整；(4) 仅 C-02 超阈值 SENS-CON-004；(5) 4 审批模板全 mock seed；(6) β 不依赖 α；(7) 严卡 10 PD。§二 D1-D10 工时不变（0.5+1.5+2.5+2+1+1+0.5 = 9 PD + 1 PD buffer）；β 即刻进入实施，按 B1 起步详设 05 V1.3 升版。|
