# Sprint 6a 任务卡 — 供应链下游补强 + 招采平台真接（V0.2）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（评审后锁版 / 实施基线）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（实施基线）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 6a（预估 10 工作日 / 约 2 周）
**并行轨道：** 与 Sprint 6b 设备运维强化 平行进行（详 [`Sprint-6b-任务卡-V0.2.md`](./Sprint-6b-任务卡-V0.2.md)）

**衔接文档：**

- 上游 Sprint → [`Sprint-5a-招投标闭环-任务卡-V0.2.md`](./Sprint-5a-招投标闭环-任务卡-V0.2.md)
- 详设依据：04 §4.13a/§4.13b（T-06 真接 / T-08-T-09 强化）/ 06 §4.7-§4.8（S-10 / S-12）/ 05 §4.7-§4.8（C-07 / C-08）
- Sprint 5 a/b 落地基线 → commit `8d74faf`（Sprint 5b B6 收尾，测试 557 全过 = Domain 341 / App 206 / EFCore 10）

---

## 一、目标与范围

### 1.1 V0.2 锁版范围（10 PD）

Sprint 5a 招投标 + 出库前置已闭环，Sprint 6a 补齐供应链下游 + 接入真实招采平台 + 起步付款流程。

**A. S-10 退料入库 + S-12 跨组织调拨（~3 PD）**
- S-10 退料入库（详设 06 §4.7）：与 S-09 领料出库形成闭环；接受领料后退还的物料
- S-12 跨组织调拨（详设 06 §4.9）：M-01 组织间物资调拨，状态机 + 双向库存联动

**B. 招采平台真实对接（~2.5 PD）**
- 替换 T-06 TenderPlatformLog mock 为真实平台 API（OAuth 凭据已待 Sprint 4 D9 机会窗口拿到）
- T-06 batch 导入/导出 batch 真接 + 重试 + 失败补偿
- 联调脚本：从外部平台 batch 拉取 50+ 投标响应

**C. C-07 PaymentPlan 付款计划起步（~2 PD）**
- C-04 付款节点已满足 → 自动生成 C-07 付款计划
- C-07 状态机：草稿 / 已生成 / 已审 / 已支付 / 已取消（5 状态）
- C-04 → C-07 联动钩子

**D. C-08 PaymentRequest 付款申请（~1.5 PD）**
- C-07 已审 → C-08 PaymentRequest 落地
- 与 NC 资金接口 BIZ-PAY 联动 stub

**E. 验收 + Sprint 6b backlog（~1 PD）**
- 全量回归 ≥ 580 通过（基线 ~540 + 6a 新增 ~40）
- Sprint-6a-Demo-脚本-V0.1
- Sprint-7a 任务卡草案

### 1.2 V0.2 评审决策点（已锁版）

| # | 决策点 | 锁版结论 | 理由 |
|---|--------|----------|------|
| 1 | S-10 退料入库范围 | **A — 完整 5 状态** | 与 S-09 出库 6 状态对齐；3 状态版后续要补还得改实体 + migration，成本累积 |
| 2 | 招采平台真接时机 | **A — 本期做** | OAuth 凭据 Sprint 4 D9 已拿到，mock → 真接积压越久越难（Sprint 7a 还要拆 S-13/14 大模块占工） |
| 3 | C-07 自动生成 vs 手动 | **A — C-04 满足后自动生成** | 详设 05 §4.7 明确为自动联动；手动版 = 临时 hack，回头要拆掉 |
| 4 | C-08 NC 资金接口范围 | **A — BIZ-PAY stub + 实体落** | 沿用 BIZ-RED / BIZ-001 stub 模式成本极低（INcInterfaceService 框架已就位）；不做反而割裂 |
| 5 | 与 b 集成测试边界 | **A — a 不依赖 b** | 双向不依赖 = 双轨干净；6b 同样选 A；E-05 联动 C-02 留 Sprint 7 待详设 07 V1.0b 真正稳定后再做 |

### 1.3 不在范围

- Sprint 6b 设备运维强化（独立轨道）
- S-13 库存余额表 / S-14 库存日记账（拆 Sprint 7a 大模块）
- AI 报表预警 / 智能调拨建议（跨 Sprint 大模块）
- C-09 / C-10 后续付款流程（顺延 Sprint 7a）

### 1.4 基线

- ✅ Sprint 5a D10 commit `ab73da7` 已 push + Demo-5a V0.1 入库（SupplyCore `b7fc49c`）
- ✅ Sprint 5b 全部 7 任务收尾（B1-B7）+ Demo-5b V0.1 入库（SupplyCore `76fba61`）
- ☐ 详设 07 V1.0b 升版由 Sprint 6b §二 Day 1 落地（非 6a 依赖；§5A 锁版结论：a 不依赖 b）
- ✅ EF migrations 31 条全部 apply（5a 加 4 / 5b 加 5：Wave 27-30 / 37-40 + Add_Contract_EquipmentId_OverlimitFields）
- ✅ sub_group_id 守护单测自动覆盖 Sprint 5a/5b 新增 7 实体（BidResponse / EvaluationResult / PurchaseReturn / MaterialIssuance / Equipment / EquipmentCategory / RepairApplication）

### 1.5 完成标准（Sprint 6a 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 597 通过（基线 557 + 6a 新增 ~40）
- [ ] 新增 EF migrations 5 条：Add_StockReturn_S10 / Add_StockTransfer_S12 / Add_PaymentPlan_C07 / Add_PaymentRequest_C08 / TenderPlatform_RealApi（如有 schema 改动）
- [ ] Sprint6a_DownstreamChain_E2E + Sprint6a_PaymentChain_E2E 通过
- [ ] 招采平台真接联调成功（≥ 50 条 batch 导入）
- [ ] Sprint-6a-Demo 入库
- [ ] **b 集成回归**：在 a 收尾后与 b 主分支 merge 全量回归

---

## 二、按日任务拆解（V0.1 草案，10 PD）

### Day 1-2 — S-10 StockReturn 退料入库（~2 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | S-10 实体（FK→S-09 IssuanceId / M-01 OrgId，13+ 字段）+ 5 状态：草稿/待审/已审/已退/已作废 | 06 §4.7 | 单测 ≥ 6 |
| D1-2 | Manager 写入钩子（IssuanceId → S-09 复制 SubGroupId；C-02 模式）+ 退料数量 ≤ S-09.TotalQuantity 强约束 | Sprint 3 D7-2 双轨钩子 | 单测 ≥ 2 负向 |
| D2-1 | S-10 AppService + Controller + 已审触发回写 S-09.returned_quantity | 06 §4.7.2 | 单测 ≥ 5 |
| D2-2 | EF mapping + Wave 31 + Add_StockReturn_S10 migration | — | apply 通过 |

### Day 3 — S-12 StockTransfer 跨组织调拨（~1 PD，简化版）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D3-1 | S-12 实体（FK→M-01 OrgId 源/目标，10+ 字段）+ 5 状态：草稿/待审/已审/已发出/已签收 | 06 §4.9 | 单测 ≥ 5 |
| D3-2 | Manager 写入钩子（双 OrgId → SubGroupId 取源组织）+ 库存可用量校验（Sprint 7a 接 S-13 完整实现）| — | 单测 ≥ 2 |
| D3-3 | EF mapping + Wave 32 + Add_StockTransfer_S12 migration | — | apply 通过 |

### Day 4-5 — 招采平台真接（~2.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D4-1 | T-06 真接服务（ITenderPlatformApiService）+ HttpClientFactory + OAuth 认证 | 04 §4.13 + 招采平台 API 文档 | 真接配置可读 |
| D4-2 | T-06 batch 导入（外部平台 → T-08 BulkCreate + T-06 LogAsync）真接联调 | — | E2E 真接通过 1 次 |
| D5-1 | T-06 batch 导出（T-08 → 外部平台）真接 + 失败重试 + 补偿任务 | 04 §4.13 业务规则 | 单测 ≥ 3 含失败重试 |
| D5-2 | Sprint 5a T-06 mock 实现保留为 INcInterfaceService Mock 默认（联调切换 DI 注入）| — | 单测兼容 |

### Day 6-7 — C-07 PaymentPlan 付款计划（~2 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D6-1 | C-07 PaymentPlan 实体（FK→C-04 PaymentNodeId / C-02 ContractId）+ 5 状态 | 05 §4.7 | 单测 ≥ 6 |
| D6-2 | C-04 ConfirmConditionMet / MarkPaid 钩子 → 自动生成 C-07 草稿 | 05 §4.7 业务规则 | 联动单测 ≥ 2 |
| D7-1 | C-07 AppService + Controller（含审批 / 取消 / 状态机）| — | 单测 ≥ 5 |
| D7-2 | EF mapping + Wave 33 + Add_PaymentPlan_C07 migration | — | apply 通过 |

### Day 8-9 — C-08 PaymentRequest 付款申请（~1.5 PD）+ 集成 + 回归（~1 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D8-1 | C-08 实体 + 5 状态：草稿/待审/已审/已支付/已驳回 | 05 §4.8 | 单测 ≥ 6 |
| D8-2 | NC BIZ-PAY stub（沿用 BIZ-RED 模式）+ 失败不阻断 Approve | 08 §5.2 | 单测 |
| D8-3 | EF mapping + Wave 34 + Add_PaymentRequest_C08 migration | — | apply 通过 |
| D9-1 | Sprint6a_DownstreamChain_E2E：S-09 → S-10 退料 / S-12 跨组织调拨 | E2E 1 个 | 通过 |
| D9-2 | Sprint6a_PaymentChain_E2E：C-02 → C-04 满足 → C-07 自动生成 → C-08 申请 → BIZ-PAY stub | E2E 1 个 | 通过 |
| D9-3 | 全量回归 ≥ 580 通过 | 0 失败 | — |
| D9-4 | **与 b 主分支 merge 集成回归** | 集成 0 失败 | — |

### Day 10 — Demo + Sprint 7a 草案（~0.5 PD）

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 580 通过 | 0 失败 |
| D10-2 | Sprint 1-6 Demo 用例 1-26 回归 + Sprint 6a 新增 27-30（S-10/S-12/真接/C-07-C-08）| 全 200 OK |
| D10-3 | 写 `Sprint-6a-Demo-脚本-V0.1.md` | 入库 |
| D10-4 | 起 Sprint 7a 任务卡草案：S-13 库存余额 / S-14 库存日记账 / C-09-C-10 付款后续 | `Sprint-7a-任务卡-V0.1.md` 草案 |

**Sprint 6a V0.1 总工时（草案）：** 2 + 1 + 2.5 + 2 + 1.5 + 1 + 0.5 = **10.5 PD**（D9 与 D8 部分重叠，实际 ≈ 10 PD）

---

## 三、Sprint 7a 衔接

| 候选范围 | 详设依据 | 估计 PD |
|---|---|---|
| S-13 StockBalance 库存余额表 + S-14 StockJournal 库存日记账 | 06 §4.10 / §4.11 | ~3 |
| C-09 / C-10 付款流程后续 | 05 §4.9 / §4.10 | ~2 |
| Sprint 6a 顺延 / 招采平台真接补强 | — | ~1.5 |
| 09 报表预警 + AI 智能建议起步 | 09 详设草拟 | ~3 |

---

## 四、Sprint 5b 决策点接收（来自 b 报告）

Sprint 5b B3 完成报告中的决策点（非 a 主路径，但需在 Sprint 6 阶段消化）：

| 备忘 | 来源 | 处理时机 |
|---|---|---|
| 详设 07 §5.5 E-05 拆为两实体：RepairApplication（审批型，6 状态）+ EquipmentInspectionRecord（执行型，4 状态）| Sprint 5b B3 | Sprint 6b 详设 07 V1.0b 升版（不在 a 范围）|
| E-02 命名歧义：EquipmentCategory（设备分类）vs equipment_status_change（状态变更日志）| Sprint 5b B2 | Sprint 6b 统一命名（不在 a 范围）|
| Equipment 状态机扩展到 7 状态（含外委检修中 / 待报废）| Sprint 5b B2 | Sprint 6b 状态机扩展（不在 a 范围）|

a 在 Sprint 6a 不涉及 E 域，但 D9-4 集成回归时需确保 b 的详设升版不破坏 a 链路。

---

## 五、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 招采平台真接 OAuth 凭据失效 | 中 | D4-5 阻塞 | D1 第一动作验证凭据；失效则降级到 mock 顺延 Sprint 7a |
| C-07 自动生成钩子与 C-04 现有状态机冲突 | 中 | D6 返工 | D6-1 先写联动单测；冲突时退回手动 |
| S-12 跨组织调拨需 S-13 库存余额校验 | 高 | D3 简化 | 本期不依赖 S-13；调拨数量校验留 Sprint 7a |
| 与 b 详设 07 V1.0b 升版进度耦合 | 中 | D9-4 集成回归延期 | 双周双方 sync 详设基线；不让单方超 3 天领先 |
| Wave 编号撞车 | 低 | EF 表名重复 | 预分配 a=31-34 / b=47-50；越界前同步 |

---

## 六、可复用资产

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | S-10 / S-12 / C-07 / C-08 继承 |
| 双轨 SubGroupId 钩子（C-02 复制 / OrgId 反查）| Sprint 3 D7-2 | S-10 从 S-09 复制；S-12 双 OrgId 取源 |
| `INcInterfaceService.PushAsync` + BIZ-PAY stub | Sprint 0 + 2/3 | C-08 沿用 BIZ-RED / BIZ-001 模式 |
| sync `.Any()` 前置校验风格（Sprint 4 D7-8） | Sprint 4 评审纠错 | S-10 → S-09 / S-12 → 组织前置同模式 |
| SENS-CON-XXX 高敏感 attribute | Sprint 4 D5 + Sprint 5b B4 | C-08 大额付款 SENS-CON-005 候选 |
| sub_group_id 守护单测反射覆盖 | Sprint 2 D5-4 | 自动覆盖新增实体 |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，基于 Sprint-5a-V0.2 D10-4 验收物起。范围 5 类候选：A S-10 退料 / B S-12 调拨 / C 招采平台真接 / D C-07 付款计划 / E C-08 付款申请，约 10 PD。5 决策点待评审锁版。Sprint 5b 决策点（详设 07 V1.0b 拆分 E-05 / E-02 命名 / Equipment 7 状态）记入 §四 留 Sprint 6b 处理。|
| V0.2 | 2026-05-13 | 评审 5 决策点一次性按"我倾向"锁版：(1) S-10 完整 5 状态；(2) 招采平台真接本期做；(3) C-07 自动生成；(4) C-08 BIZ-PAY stub；(5) **a 不依赖 b**（双轨彻底解耦，E-05 联动 C-02 顺延 Sprint 7）。§1.4 基线更新到 Sprint 5 a/b 收尾后的实际状态：commit `8d74faf` / 557 测试全过 / EF migrations 31 条 apply。§1.5 验收门 580 → **597**（基线 557 + 新增 ~40）。§二 D1-D10 工时与 V0.1 一致（10 PD 严卡，0.5 PD buffer）；6a 即刻进入实施，按 D1 起步 S-10 退料入库。|
