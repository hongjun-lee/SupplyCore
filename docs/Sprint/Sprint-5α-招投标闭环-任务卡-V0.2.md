# Sprint 5α 任务卡 — 招投标闭环 + 库存出库前置（V0.2）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（评审后锁版 / 实施基线）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（实施基线）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 5α（预估 10 工作日 / 约 2 周）
**并行轨道：** 与 Sprint 5β 外委检修专项 平行进行（详 [`Sprint-5β-外委检修专项-任务卡-V0.2.md`](./Sprint-5β-外委检修专项-任务卡-V0.2.md)）

**衔接文档：**

- 上游 Sprint → [`Sprint-5-任务卡-V0.2.md`](./Sprint-5-任务卡-V0.2.md)（D0-D2 已落基线）
- 详设依据：04 §4.12（T-08）/ §4.14（T-09）/ §4.13（T-06 LogAsync 联调）/ 06 §4.6（S-06）/ §4.7（S-09）
- Sprint 5 落地基线 → commit `966561c`（D0-D2 收尾 + T-07 Material Active 强约束加固，370 测试通过）

---

## 一、目标与范围

### 1.1 V0.2 锁版范围（10 PD）

Sprint 5α 聚焦 **T 域闭环** + **S 域出库前置**，与 Sprint 5β（E 域 + 外委检修）几乎正交，仅共享 DbContext / ModelSnapshot 治理协议。

**A. 招投标投标响应 + 评标结果（~4 PD）**
- T-08 BidResponse 投标响应（详设 04 V1.2 §4.13a）：4 状态（已提交 / 已撤回 / 评标中 / 已评定）
- T-09 EvaluationResult 评标结果明细（详设 04 V1.2 §4.13b）：关联 T-08，无独立状态

**B. T 域主链 E2E + 招采平台 Mock 联调（~1 PD）**
- Sprint5α_TenderFullChain_E2E：T-01 → T-03 → T-04 → T-06 LogAsync → T-08 → T-09 → T-05 → C-02
- T-06 招采平台对接 mock 端到端 batch 接入测试（导入/导出 双向）

**C. 库存出库前置（~3.5 PD，Sprint 6α 主线前移）**
- S-06 PurchaseReturn 采购退货（详设 06 §4.6）：5 状态 + 与 S-05 入库联动
- S-09 MaterialIssue 领料出库（详设 06 §4.7）：6 状态 + 库存扣减

**D. 验收 + Sprint 6α backlog（~1.5 PD）**
- 全量回归 ≥ 410 通过
- Sprint-5α-Demo-脚本-V0.1
- Sprint-6α 任务卡草案（S-10 退料入库 / S-12 跨组织调拨 / 招采平台真接 / C-07 付款计划起步）

### 1.2 V0.2 评审决策点（已锁版）

| # | 决策点 | 锁版结论 | 理由 |
|---|--------|----------|------|
| 1 | 招投标范围 | **全 T-08 + T-09** | 详设 04 V1.2 §4.13a/§4.13b 已补齐实体定义；招投标闭环必备 |
| 2 | T-06 联调 | **batch 端到端 mock（导入/导出全场景）** | T-06 已落 D1-D2，本期补 batch 场景成本低 |
| 3 | 出库切片 | **S-06 + S-09 都做** | 两单据共享库存事务模式，一起做协同效应高 |
| 4 | 与 β 集成测试边界 | **α 不依赖 β** | 两轨道完全正交；β 升详设 07 不影响 α |
| 5 | E2E 写法 | **单文件 Sprint5α_FullChain** | 单测式 E2E 与 Sprint 3/4 模式一致 |
| 6 | 总工时上限 | **严卡 10 PD** | Sprint 4 已经历质量债教训；不再用超额换范围 |

### 1.3 不在范围

- Sprint 5β 外委检修专项（独立轨道）
- S-10 退料入库 / S-12 跨组织调拨（留 Sprint 6α）
- C-07~C-10 付款流程（移 Sprint 6α）
- 招采平台真实对接（依赖外部平台凭据，留 Sprint 6α+ 机会窗口）
- 09 报表预警 AI 能力（跨 Sprint 大模块）
- E 域设备模块（由 Sprint 5β 起步）

### 1.4 基线

- ✅ Sprint 5 D0-D2 commit `966561c` 已 push（含 Sprint 4 D7-8 follow-up + T-06/T-07 实体 + Material Active 加固，370 测试）
- ✅ EF migrations 21 条全部 apply
- ✅ 详设 05 V1.2 升版完成（Sprint 4 D4-1）
- ✅ sub_group_id 守护单测自动覆盖 Sprint 4-5 累计新增 8 实体

### 1.5 完成标准（Sprint 5α 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 410 通过（基线 370 + α 新增 ~40）
- [ ] 新增 EF migrations 4 条：Add_Tender_T08_T09 / Add_StockOutbound_S06 / Add_MaterialIssue_S09 / Add_S04_S05_S06_Linkage（如有）
- [ ] Sprint5α_TenderFullChain_E2E + Sprint5α_OutboundChain_E2E 通过
- [ ] Sprint-5α-Demo 入库
- [ ] **β 集成回归**：在 α 收尾后，与 β 主分支 merge 后全量再回归一次

---

## 二、按日任务拆解（V0.2 锁版，10 PD 严卡）

### Day 1-2 — T-08 BidResponse 投标响应（~2 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | T-08 BidResponse 实体（FK→T-03 / M-09，10+ 字段）+ 4 状态机：提交 / 撤回 / 评标中 / 评定 | 04 §4.12 | 单测 ≥ 6 |
| D1-2 | Manager 写入钩子（PackageId → T-03 → T-01 → Org → SubGroupId）+ M-09 Supplier Active 前置校验（同 T-07 Material 强约束风格）| sub_group_id 清单 §三 + Sprint 5 D1-D2 Material 加固经验 | 单测 ≥ 2 负向 |
| D2-1 | T-08 AppService + Controller（Get / List / Submit / Withdraw / StartEvaluation / Determine） | — | 单测 ≥ 5 |
| D2-2 | EF mapping + Wave 27 + Add_Tender_T08 migration | — | apply 通过 |

**预估工时：** 2 PD

### Day 3-4 — T-09 EvaluationResult 评标结果明细（~2 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D3-1 | T-09 EvaluationResult 实体（FK→T-08，无独立状态；评分明细 + 综合得分）| 04 §4.14 | 字段对齐 |
| D3-2 | Manager 写入钩子（BidResponseId → T-08 → T-03 → T-01 → Org → SubGroupId）| 同上 | — |
| D3-3 | EF mapping + Wave 28 + Add_Tender_T09 migration | — | apply 通过 |
| D4-1 | T-09 AppService + Controller（Get / List / Create / BulkCreate / Delete）+ T-08 状态前置校验：仅 评标中 状态允许增删评分明细 | 04 §4.12 业务规则 | 单测 ≥ 5（含负向）|
| D4-2 | T-09 → T-08 综合得分回写联动（评分明细全部录入后回写 T-08 综合得分）| 04 §4.14 业务规则 | 单测 ≥ 2 |

**预估工时：** 2 PD

### Day 5 — 招投标主链 E2E + T-06 batch 联调 mock（~1 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D5-1 | Sprint5α_TenderFullChain_E2E：T-01 → T-03 + T-04 → T-06 LogAsync（导入 batch）→ T-08 提交 + 撤回 + 评定 → T-09 评分 → T-05 中标 → C-02 已签 | 04 全链 | E2E 1 个通过 |
| D5-2 | T-06 batch 接入 mock：模拟从外部平台 batch 导入 20 条投标响应 → 调用 T-08 BulkCreate + T-06 LogAsync 写日志（含 success/fail count）| 04 §4.13 业务规则 | 单测 ≥ 2 |

**预估工时：** 1 PD

### Day 6-7 — S-06 PurchaseReturn 采购退货（~1.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D6-1 | S-06 PurchaseReturn 实体 + 5 状态：草稿 / 待审 / 已审 / 已驳回 / 已作废 | 06 §4.6 | 单测 ≥ 5 |
| D6-2 | Manager 写入钩子（SourceReceiptId → S-05 → Contract → SubGroupId 复制；C-02 模式）| Sprint 3 D7-2 双轨钩子 | 单测 |
| D6-3 | EF mapping + Wave 29 + Add_StockOutbound_S06 migration | — | apply 通过 |
| D7-1 | S-06 AppService + Controller（含 S-05 入库可退货量校验：退货数量 ≤ S-05 入库剩余可退量）| 06 §4.6 业务规则 | 单测 ≥ 5 含负向 |
| D7-2 | S-06 审核通过 → 回写 S-05.returned_quantity + C-02.executed_amount 减少 + NC BIZ-RED stub | 06 §4.6.2 + 08 §5.2 | E2E 单测 |

**预估工时：** 1.5 PD

### Day 8 — S-09 MaterialIssue 领料出库（~1.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D8-1 | S-09 MaterialIssue 实体 + 6 状态（含 待审 / 已审 / 已发出 / 已签收 / 已作废 / 已冲销）| 06 §4.7 | 单测 ≥ 6 |
| D8-2 | Manager（OrgId → SubGroupId 反查）+ 库存可用量前置校验（领料数量 ≤ 当前库存余量）| 06 §4.7 业务规则 | 单测 ≥ 2 |
| D8-3 | EF mapping + Wave 30 + Add_MaterialIssue migration | — | apply 通过 |
| D8-4 | S-09 AppService + Controller + 已签收触发 NC BIZ-005 stub | 08 §5.2 | 单测 ≥ 5 |

**预估工时：** 1.5 PD

### Day 9 — 集成 + 守护 + 全量回归（~1 PD）

| # | 任务 | 验收 |
|---|------|------|
| D9-1 | Sprint5α_OutboundChain_E2E：S-05 入库 → S-06 部分退货 + S-09 部分领料 → C-02 executed_amount 反向核对 | E2E 通过 |
| D9-2 | sub_group_id 守护单测自动覆盖 α 新增 4 实体（T-08/T-09/S-06/S-09）| 守护单测全过 |
| D9-3 | 全量回归 ≥ 410 通过 | 0 失败 |
| D9-4 | **与 β 主分支 merge 集成回归**：本地 merge β 最新 push 后再跑一次全量 | 集成 0 失败 |

**预估工时：** 1 PD

### Day 10 — Demo + Sprint 6α 草案（~0.5 PD）

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 410 通过 | 0 失败 |
| D10-2 | Sprint 1-5 Demo 用例 1-22 回归 + Sprint 5α 新增用例 23-26（T-08/T-09/S-06/S-09）| 全 200 OK |
| D10-3 | 写 `Sprint-5α-Demo-脚本-V0.1.md` | 入库 |
| D10-4 | 起 Sprint 6α 任务卡草案：S-10 退料入库 / S-12 跨组织调拨 / 招采平台真接 / C-07 付款计划起步 | `Sprint-6α-任务卡-V0.1.md` 草案 |
| D10-5 | 整理 Sprint 5α commit log | git log 整洁 |

**预估工时：** 0.5 PD

**Sprint 5α V0.1 总工时（草案）：** 2 + 2 + 1 + 1.5 + 1.5 + 1 + 0.5 + 余 0.5 buffer = **10 PD ✓**

---

## 三、Sprint 6α 衔接

| 候选范围 | 详设依据 | 估计 PD |
|---|---|---|
| S-10 退料入库 + S-12 跨组织调拨 | 06 §4.8 / §4.9 | ~2.5 |
| 招采平台真实对接（替换 T-06 mock）| 04 §4.13 + 平台 API | ~2 |
| C-07 PaymentPlan 付款计划起步（C-04 满足后自动生成）| 05 §4.7 | ~2 |
| C-08 PaymentRequest 付款申请 | 05 §4.8 | ~2 |
| Sprint 5α 顺延 / 集成补强 | — | ~1.5 |

---

## 四、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 与 β 共享 ModelSnapshot.cs 冲突 | 高 | 每次 push 前需 rebase | 协议：晚上 push 前 `git pull --rebase`，冲突时重 add migration |
| Wave 编号撞车 | 低 | EF 表名重复 | 预分配 α=27-30 / β=31-38；越界前同步 |
| T-08 业务规则细节（撤回时点 / 评定标准）业务方未确认 | 中 | D1-D2 字段返工 | D1 第一动作业务方对齐；不确认即按详设最小可用版落地 |
| S-06 / S-09 库存余量校验需 S-13 库存余额表 | 高 | S-13 未落地，余量取不到 | Sprint 5α 简化为：S-06 用 S-05 入库剩余可退量校验（不依赖 S-13）；S-09 用 mock 余量校验（Sprint 6α 接 S-13）|
| β 主分支推进过快导致 α D9-4 集成冲突 | 中 | 集成回归延期 | 每周五双方同步基线 commit；不让单方主分支超 3 天领先 |

---

## 五、可复用资产

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | 新业务实体继承 |
| `XxxManager.CreateDraftAsync` Domain Service | Sprint 1+ | T-08/T-09/S-06/S-09 各自 Manager |
| 双轨钩子（C-02 复制 / OrgId 反查）| Sprint 3 D7-2 | S-06 从 S-05 复制；S-09 从 OrgId 反查 |
| Material/Supplier Active 强约束 | Sprint 5 D1-D2（同事加固）| T-08 用 Supplier；S-06 / S-09 用 Material 同模式 |
| `INcInterfaceService.PushAsync` + Mock | Sprint 0 + 2/3 | BIZ-RED / BIZ-005 stub |
| sub_group_id 守护单测覆盖率 | Sprint 2 D5-4 | 反射自动覆盖新实体 |
| sync `.Any()` 前置校验风格（Sprint 4 D7-8 follow-up）| Sprint 4 评审纠错 | T-09 → T-08 状态前置 / S-06 → S-05 退货量校验同模式 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，基于 Sprint 5 V0.2 D0-D2 已落基线起。Sprint 级 α/β 并行方案确认后单独成卡。范围 4 类候选：A 招投标 T-08/T-09 / B 主链 E2E / C 出库 S-06+S-09 前置 / D 验收，约 10 PD。6 决策点待用户评审 + β 共享治理协议见 §四 风险表。 |
| V0.2 | 2026-05-13 | 评审 6 决策点一次性按"我倾向"锁版：(1) 全 T-08+T-09；(2) T-06 batch 端到端 mock；(3) S-06 + S-09 都做；(4) α 不依赖 β；(5) 单文件 Sprint5α_FullChain；(6) 严卡 10 PD。§二 D1-D10 工时不变（2+2+1+1.5+1.5+1+0.5 = 10 PD ✓）；α 即刻进入实施，按 D1 起步 T-08。**入实施时发现 V0.2 引用错位**（D1 准备阶段）：详设 04 V1.1 §4.12 实际是 T-05，无 T-08 / T-09 实体表定义。同步升详设 04 V1.1 → V1.2（commit B 选项），§4.13a/§4.13b 补齐 T-08/T-09 全字段表 + 状态机 + 业务规则；α V0.2 引用同步更新为 V1.2 §4.13a/§4.13b。本次任务卡章节号不重命名（V0.2 主体内容仍生效），仅更新详设引用。|
