# Sprint 5 任务卡 — 招投标后续 + 外委检修起步 + 暂估双预警 + 出库扩展 + Stage B1 真接续作（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 / 待评审）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（待评审）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 5（预估 10 工作日 / 约 2 周）
**衔接文档：**

- 上游 Sprint → [`Sprint-4-任务卡-V0.2.md`](./Sprint-4-任务卡-V0.2.md) §三
- 上游工时模型 → [`开发进度规划-V0.5.md`](../详细设计/开发进度规划-V0.5.md) §3.3 11 项政策驱动剩余增量
- 详设依据：04 §4.12-4.14 / 05 §4.5（C-05 已落 Sprint 3）/ 06 §4.6-4.9 / 07 §外委检修 / 10 V1.2 §4.6
- Sprint 4 落地基线 → commit `4b7a518`（D10 收尾，345 测试通过）

---

## 一、目标与范围

### 1.1 候选范围（V0.5 §3.3 + Sprint 4 衔接累积）

Sprint 5 候选 ~28 PD，需评审切片至 10 PD：

**A. 招投标后续**（Sprint 4 D2-2 衔接，~4 PD）：
- T-06 EvaluationCommittee 评标委员会（详设 04 §4.13）
- T-07 TenderPackageLine 标包明细（详设 04 §4.10.2，关联 P-03 + M-05）
- T-08 BidResponse 投标响应（详设 04 §4.12）
- T-09 EvaluationResult 评标结果明细（详设 04 §4.14）

**B. 合同付款流程**（Sprint 4 衔接，~5 PD）：
- C-07 PaymentPlan 付款计划（详设 05 §4.7，C-04 满足条件自动生成）
- C-08 PaymentRequest 付款申请（详设 05 §4.8）
- C-09 MonthlySummary 月度汇总（详设 05 §4.9）
- C-10 PaymentExecution 付款执行（详设 05 §4.10）

**C. V0.5 §3.3 政策驱动 4 项**（~10 PD）：
- 暂估 D-90/D-30 双预警（V0.5 §3.3 #5，~2 PD，BIZ-002/003 NC 接口联动）
- 超储三级处置（V0.5 §3.3 #6，~3 PD）
- 外委检修起步（V0.5 §3.3 #1，~3 PD，仅 E-05 字段 + WF-RPR-001 mock；07 设备完整 +20 PD 留 Sprint 6+）
- 后评价自动联动 WF-SUP-REASSESS-001（V0.5 §3.3 #7，~2 PD）

**D. 出库扩展**（详设 06，~5 PD）：
- S-06 PurchaseReturn 采购退货（~1.5 PD）
- S-09 MaterialIssue 领料出库（~1.5 PD）
- S-10 MaterialReturn 退料入库（~1 PD）
- S-12 CrossOrgTransfer 跨组织调拨（~1 PD）

**E. Stage B1 真接续作**（Sprint 4 D9 延后，~4 PD）：
- NovaSync HttpReader 切换（OAuth 凭据到位后）
- Catio Workflow 真实联调：C-01 多方会签 chain 解析（替换 Sprint 2 单签 mock）
- 4 新审批模板配置（WF-DIR / WF-RPR / WF-CON-OVERLIMIT / WF-SUP-REASSESS）
- NC BIZ-001 真接：替换 MockNcInterfaceService 实现

**F. Sprint 4 顺延项**（~1 PD）：
- S-01 fulfillment_type 字段补（V0.5 §3.3 #8）
- 性能优化：sub_group_id 索引 P95 监控（Sprint 4 D7-2 挪后）

### 1.2 切片方案建议

| 方案 | 内容 | PD |
|------|------|----|
| 方案 1（保守） | A 招投标后续（4） + B 付款流程子集 C-07/C-08 仅（3） + F 顺延（1） + E 部分 Stage B1（2） + 验收（1） | 11（略紧）|
| 方案 2（激进） | A（4） + C 政策驱动 4 子项中选 2（外委检修 + 暂估双预警，5） + F（1） | 10 |
| 方案 3（出库优先）| A（4） + D 出库（5） + 验收（1） | 10 |
| **方案 4（推荐）** | **A 招投标后续（4） + C 外委检修起步（3） + F（1） + E Stage B1 真接（2，依赖外部到位）** | **10** |

> ⚠ V0.2 升版前请用户评审拍板切片方案 + 决策点。

### 1.3 V0.1 待评审决策点

| # | 决策点 | 选项 |
|---|--------|------|
| 1 | 切片方案 | 方案 1 / 2 / 3 / 4 / 混合 |
| 2 | T-06/T-07/T-08/T-09 | (a) 全 4 项一次性落 / (b) T-06/T-07 优先 T-08/T-09 留 Sprint 6 / (c) 仅 T-06 EvaluationCommittee（评标审批最小可用版）|
| 3 | 外委检修 | (a) Sprint 5 仅起步（E-05 字段 + WF-RPR-001 mock，3 PD）/ (b) Sprint 6 整 20 PD 完整落 |
| 4 | Stage B1 真接 | (a) 本 Sprint D9-D10 预占 2 PD / (b) 仍机会窗口（OAuth 仍未到则继续延）|
| 5 | 详设升版 | (a) 是否本期升 04 V1.2（含 T-06/T-07/T-08 入字段表） / (b) 是否本期升 07 V1.1（含 E-05 外委检修字段）|
| 6 | 总工时 | (a) 严卡 10 PD / (b) 接受 11 PD |

### 1.4 基线

- ✅ Sprint 4 commit `4b7a518` 已 push（D1-D10，345 测试通过）
- ✅ EF migrations 18 条全部 apply（Sprint 4 新增 5 条）
- ✅ Sprint 4 全链 E2E 通过（T-03/T-04 / C-04/C-06 / 履约保证金 / S-04 让步入库联动）
- ✅ 详设 05 V1.1 → V1.2 升版完成
- ✅ sub_group_id 守护单测自动覆盖 Sprint 4 新增 6 实体

### 1.5 不在范围（候选）

- 07 设备模块完整（20 PD，留 Sprint 6+ 独立 Sprint）
- 09 报表预警 AI 能力（11 报表 + 13 预警 + 8 AI Tool，250 PD 跨多 Sprint）
- C-03 ContractClause AppService（Sprint 4 仅 entity；本 Sprint 也不优先）
- T-06/T-07 详化（详设 04 V1.2 升版必要时配套）

---

## 二、按日任务拆解（待评审；以推荐方案 4 起草）

> ⚠ 以下任务按推荐方案 4 起草；V0.2 升版时按评审结果调整。

### Day 1-2 — T-06 + T-07 标包后续

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | T-06 EvaluationCommittee 实体 + 状态机（草稿 → 评标中 → 评标完成）| 04 §4.13 | 单测 ≥ 4 |
| D1-2 | T-07 TenderPackageLine 实体（与 P-03 / M-05 关联）| 04 §4.10.2 | 字段对齐 |
| D2-1 | T-06 / T-07 AppService + Controller | — | 单测 ≥ 5 |
| D2-2 | EF mapping + Add_Tender_T06_T07 migration | — | apply 通过 |

**预估工时：** 1.5 PD

### Day 3-4 — T-08 + T-09 投标响应 + 评标结果

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D3-1 | T-08 BidResponse 实体 + 状态机（提交 / 撤回 / 评标中 / 评定）| 04 §4.12 | 单测 ≥ 5 |
| D3-2 | T-09 EvaluationResult 评标结果明细 | 04 §4.14 | 字段对齐 |
| D3-3 | EF + 2 migration | — | apply 通过 |
| D4-1 | T-08 / T-09 AppService + Controller | — | 单测 ≥ 6 |

**预估工时：** 2 PD

### Day 5-7 — 外委检修起步（V0.5 §3.3 #1，仅起步）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D5-1 | **详设 05 V1.2 → V1.3 升版（如需）**：§8.7.3 字段补齐（overlimit_reason / overlimit_approval_id 落字段表）；或独立详设 07 V1.1 升版 | 详设 05 / 07 V1.x | 详设入库 |
| D5-2 | E-05 RepairApplication 实体（外委检修申请，C-02 关联 service_subtype=外委检修）| 详设 07 §外委检修 | 字段对齐 |
| D6-1 | WF-RPR-001 mock：外委检修审批模板配置（依赖 Catio Workflow，本 Sprint 用 mock）| 详设 10 V1.2 §4.6 | 模板配置入库 |
| D6-2 | 外委检修价格上限校验（详设 05 V1.2 §8.7：合同总额 ≤ 设备原值 × 40%）| 详设 05 §8.7 | 单测 ≥ 3 |
| D7-1 | SENS-CON-004 超阈值高敏感拦截器 + WF-CON-OVERLIMIT-001 审批触发 | 详设 10 §7.1 + 05 §8.7 | 单测 ≥ 2 |

**预估工时：** 3 PD

### Day 8 — F 顺延项 + S-01 fulfillment_type

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D8-1 | S-01 SaleOrder 加 fulfillment_type 字段（V0.5 §3.3 #8）| 详设 06 §4.1 | migration apply |
| D8-2 | Sprint 4 D7-2 挪后：sub_group_id 索引 P95 监控基线脚本 | EFCore.Tests 加查询响应基线断言 | 可选 |
| D8-3 | C-03 ContractClause AppService + Controller（Sprint 4 顺延）| 详设 05 §4.3 | 单测 ≥ 4 |

**预估工时：** 1 PD

### Day 9 — Stage B1 真接续作（机会窗口转主线，依赖外部到位）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D9-1 | **依赖外部回函**：Catio 10A V1.1 §九 Bis 回函检查；如就绪，NovaSync HttpReader 切换 | NovaSync 切换方案 V0.2 | 切换落地或登记延 Sprint 6 |
| D9-2 | **依赖外部回函**：NC 08B 外发函回函检查；如就绪，BIZ-001 真接（MockNcInterfaceService → 真实 implementation 替换）| 08B + 08A 内部底稿 | 真接落地或登记延 Sprint 6 |
| D9-3 | Catio Workflow C-01 多方会签真实联调（依赖 OAuth）| 详设 10 V1.2 §4.6 | 单测 + E2E |
| D9-4 | 4 新审批模板配置（WF-DIR / WF-RPR / WF-CON-OVERLIMIT / WF-SUP-REASSESS，V0.5 §3.3 #3）| 详设 10 V1.2 | 模板配置入库 |

**预估工时：** 2 PD（依赖外部到位；如未到位则降级到登记 Sprint 6）

### Day 10 — Sprint 5 验收 + Demo + Sprint 6 backlog

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 370 通过 | 0 失败 |
| D10-2 | Sprint 1-4 Demo 用例 1-18 回归 + 新增用例 19-22（T-06/T-07/T-08-T-09 招投标后续 + 外委检修起步 + Stage B1 真接）| 全 200 OK |
| D10-3 | `docker compose up` 容器内跑全套 | 全通过 |
| D10-4 | 写 `Sprint-5-Demo-脚本-V0.1.md` | 入库 |
| D10-5 | 起 Sprint 6 任务卡草案：07 设备完整 + C-07~C-10 付款流程 + 09 报表起步 + 出库 S-06/S-09/S-10/S-12 + 集团并行会签 A4 | `Sprint-6-任务卡-V0.1.md` 草案 |
| D10-6 | 整理 Sprint 5 commit log | git log 整洁 |

**预估工时：** 0.5 PD

**Sprint 5 V0.1 总工时（草案）：** 1.5 + 2 + 3 + 1 + 2 + 0.5 = **10 PD ✓**

---

## 三、Sprint 6+ 衔接 + V0.5 §3.3 剩余增量

### 3.1 Sprint 6（候选范围，~10-15 PD）

| 重点 | 详设依据 | V0.5 §3.3 关联 |
|------|---------|-----|
| 07 设备完整模块（剩余 17 PD） | 详设 07 V1.1 | #1 +20 PD |
| C-07~C-10 付款流程 | 详设 05 §4.7-4.10 | — |
| 出库 S-06 / S-09 / S-10 / S-12 | 详设 06 §4.6-4.9 | — |
| 暂估 D-90/D-30 双预警 + BIZ-002/003 NC | 详设 06 + 09 + 11 | #5 +5 PD |
| 超储三级处置 | 政策 04 + 详设 06 | #6 +8 PD |
| 后评价自动联动 WF-SUP-REASSESS-001 | 详设 09 + 10 | #7 +3 PD |

### 3.2 Sprint 7+ 衔接

- 09 报表预警与 AI 能力（11 报表 + 13 预警 + 8 AI Tool + 6 看板，~250 PD 跨多 Sprint）
- 集团并行会签 A4（V0.5 §3.3 #12，依赖详设 10 V1.2）
- 多二级集团扩展（清能 / 铁煤 / 沈煤 等 10 家二级集团）
- 委托加工受托虚拟仓（V0.5 §3.3 #9）

### 3.3 政策驱动 V0.5 §3.3 14 项落地路径（Sprint 4 V0.2 衔接）

| # | 增量 | 落地 Sprint | 备注 |
|---|------|------------|------|
| 1 | 外委检修专项 | **Sprint 5 起步** + Sprint 6 完整 | Sprint 5 落 E-05 + WF-RPR-001 mock + 价格上限校验 |
| 2 | WF-DIR-001 直达例外 | Sprint 5 D9 | 依赖 Catio Workflow 真实联调 |
| 3 | 4 新审批模板 | Sprint 5 D9 | 同上 |
| 4 | 2 新高敏感 SENS-CON-003/004 | ✅ Sprint 4 D5-2（003）+ Sprint 5 D7-1（004）| — |
| 5 | 暂估 D-90/D-30 双预警 | Sprint 6 | 09 报表预警 |
| 6 | 超储三级处置 | Sprint 6 | 06 库存 |
| 7 | 后评价自动联动 | Sprint 6 | 09 + 10 |
| 8 | S-01 fulfillment_type | **Sprint 5 D8** | Sprint 4 V0.2 顺延 |
| 9 | 委托加工受托虚拟仓 | Sprint 7+ | 06 + 08 |
| 10 | 第四批 E 类必补 5 项 | Sprint 5-6 | 07 设备 |
| 11 | 履约保证金 `bond_required` | ✅ Sprint 4 D4-5 完成 | — |
| 12 | 集团并行会签 A4 | Sprint 7+ | Catio Workflow V1.2 |
| 13 | sub_group_id 全链路 | ✅ 已落 Sprint 1-2 | — |
| 14 | NovaSync 切换方案 | Sprint 5 D9 | Stage B1 真接 |

---

## 四、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 详设 07 V1.1 升版（如需）与 D5-D7 外委检修落地冲突 | 中 | D5-1 前置依赖 | D5-1 第一动作；详设升版与代码落地同周完成 |
| Catio Workflow OAuth 凭据继续延期 | 高 | D9 真接全部降级 | D9-1/D9-2 改"登记延 Sprint 6"；不阻断主线 |
| NC 08B 外发函回函继续延期 | 中 | D9 NC 真接降级 | 同上 |
| 外委检修业务方需求未完全确认 | 中 | E-05 字段不全 | 外委检修起步仅落 E-05 最小可用版；详化留 Sprint 6 |
| Sprint 5 评审切片方案分歧 | 高 | 工时变动大 | V0.2 评审时按 4 个候选切片方案拍板 |

---

## 五、可复用资产（Sprint 1-4 → Sprint 5 沿用）

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | 新业务实体继承 |
| 双轨钩子（C-02 复制 / OrgId 反查）| Sprint 3 D7-2 | T-06/T-07/T-08/T-09/E-05 同模式 |
| `INcInterfaceService.PushAsync` + Mock | Sprint 0 + 2/3 | BIZ-002/003 真接时替换实现 |
| `SensitiveOperationAttribute` + AuditingStore | Sprint 2 D9-D10 + Sprint 4 D5-2 | SENS-CON-004 + 后评价等沿用 |
| 让步入库联动模式（S-04 → S-05）| Sprint 4 D6-3 | 类似联动复用 |
| sub_group_id 守护单测覆盖率 | Sprint 2 D5-4 | 反射自动覆盖新实体 |
| 详设升版"git mv + 头部 + §六沿革"三动作同 commit | Sprint 1+ 沉淀 | 详设 07 V1.x / 05 V1.3 复用 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，Sprint 4 D10-5 起。列 6 类候选范围（A 招投标后续 / B 付款流程 / C V0.5 政策驱动 / D 出库扩展 / E Stage B1 真接续作 / F 顺延）共 ~28 PD；推荐方案 4（招投标后续 + 外委检修起步 + S-01 + Stage B1）+ 6 决策点待用户评审。Sprint 4 D9 机会窗口未达成（OAuth + 08B 回函均未到），Stage B1 真接续作转 Sprint 5 D9 主线。|
