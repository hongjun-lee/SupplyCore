# Sprint 7b 任务卡 — 设备运维深化 + LeaseBilling NC 实装 + 设备资产折旧起步（V0.1 草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案，待评审锁版为 V0.2）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（草案）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 7b（预估 10 工作日 / 约 2 周）
**并行轨道：** 与 Sprint 7a 库存余额 + 付款流程后续 平行进行（草案 [`Sprint-7a-任务卡-V0.1.md`](./Sprint-7a-任务卡-V0.1.md)）

**衔接文档：**

- 上游 Sprint → [`Sprint-6b-任务卡-V0.2.md`](./Sprint-6b-任务卡-V0.2.md)
- 详设依据：07 V1.0b §5.6（E-06 ScrappingApplication）/ §5.7（E-07 SparePartIssuance）/ §5.8（E-08 BreakdownRequest）/ §5.2（equipment_status_change 日志型）/ §5.13（E-13 资产折旧，待详设升 V1.1）
- Sprint 6 a/b 落地基线 → commit `cb0d631`（Sprint 6b Day 9-2 收尾，735 测试全过 = Domain 467 / App 258 / EFCore 10）

---

## 一、目标与范围

### 1.1 V0.1 候选范围（约 11 PD，待评审收口到 ~9-10）

Sprint 6b 闭环 Equipment 7 状态 + E-09 ~ E-12 租赁链 + E-05/E-05a 检修执行；Sprint 7b 把"设备运维深化"（备件领用 + 故障报修 + 检修工单）+ "LeaseBilling NC BIZ-LEASE 接入"+ "设备资产折旧起步"三条主线收口，同时落 equipment_status_change 日志型实体。

**A. E-06 / E-07 / E-08 设备运维深化（~4 PD）**
- E-07 SparePartIssuance 备件领用单（详设 07 V1.0b §5.7）：FK→E-01 + S-09 模式领料；4 状态机
- E-08 BreakdownRequest 故障报修申请（详设 07 V1.0b §5.8）：员工发起 → 现场判定 → 是否走 E-05 外委 / 自修 决策
- E-06 ScrappingApplication 报废处置申请（详设 07 V1.0b §5.6）：联动 Equipment.RequestScrap + ApproveScrap（Sprint 6b §5.1.1 #10/#12）
- **重点价值**：补齐设备运维 4 大业务场景（建档 → 投用 → 检修 → 报废）的报修与备件链路

**B. E-11 LeaseBilling NC BIZ-LEASE 接口实装（~1.5 PD）**
- 决策点 4B 顺延项收尾：本期 PushToPaymentAsync 仅 log 占位 → 接 NC 实装
- 沿用 BIZ-PAY / BIZ-RED 模式（NcInterfaceService + 失败不阻断 + push_error_* 标记）
- 关联 C-08 PaymentRequestId 回写（如 NC 接口同步返回付款申请 ID）

**C. equipment_status_change 日志型实体（~1.5 PD）**
- Sprint 5b B2 决策点接收：Sprint 7b 落（详设 07 V1.0b §5.2 日志型）
- 自动落日志：Equipment 10 transition 全部入口写一条 equipment_status_change（来源单据类型 + ID）
- 与 E-02 EquipmentCategory（设备分类字典）命名解耦，命名最终 `EquipmentStatusChange`
- 不影响 7 状态主链，仅作审计 / 报表追溯支撑

**D. E-13 EquipmentDepreciation 设备资产折旧起步（~2 PD）**
- 详设 07 V1.0b §5.13（待 V1.1 升版补齐字段表 + 状态机）
- 直线法折旧最小可用版：(OriginalValue - SalvageValue) × 月数 / 总月数
- 月度计算调度框架占位（Hangfire 接入留 Sprint 8b）
- 联动 C-07 资产负债与 Sprint 7a 报表预警 R-04 / R-05 模式同期

**E. 验收 + Sprint 8b backlog（~1 PD）**
- 全量回归 ≥ 785 通过（基线 735 + 7b 新增 ~50）
- Sprint-7b-Demo
- Sprint-8b 任务卡草案（AI 预警 + 智能调度 + 资产折旧 V1.1 升版深化）

### 1.2 V0.1 待评审决策点

| # | 决策点 | 候选方案 | 倾向 |
|---|--------|----------|------|
| 1 | E-06/E-07/E-08 范围 | A. 完整 3 实体一次性 / B. 仅 E-08 故障报修 + E-07 备件（E-06 顺延 Sprint 8b） | A — 三者互相依赖（E-08 现场判定可能落 E-05 外委 / E-07 备件 / E-06 报废），分割落地反复修复 |
| 2 | E-11 NC BIZ-LEASE 范围 | A. 完整推送 + C-08 回写 / B. 推送 only（C-08 回写顺延 Sprint 8b） | A — 沿用 BIZ-PAY 模式工时 1.5 PD 内可控；NC 接口契约已 Sprint 6a 落 |
| 3 | equipment_status_change 触发时机 | A. Domain 层 Equipment 状态机方法内自动落（侵入式）/ B. AppService 层各 transition endpoint 手工落（显式）| B — 沿用 NC stub 模式，AppService 显式控制；Domain 层保持纯净 |
| 4 | E-13 折旧范围 | A. 完整折旧表 + 月度调度起步 / B. 仅折旧表 + Manager（调度顺延 Sprint 8b）/ C. 顺延 Sprint 8b | B — Hangfire 调度链路本期不引入，仅落实体 + Manager + 月度计算 endpoint（手工触发版） |
| 5 | 与 a 主分支集成边界 | A. b 不依赖 a / B. b E-11 实装 NC 时需 a 的 C-08 已落地的 BIZ-PAY stub | A — Sprint 6 双轨 5A 模式继续；NC stub 各域独立 |

### 1.3 不在范围

- Sprint 7a 库存余额 / 付款后续（独立轨道）
- AI 设备预警 / 智能调度（Sprint 8b 大模块）
- E-13 折旧 Hangfire 月度调度（决策点 4B 顺延 Sprint 8b）
- 09 详设报表预警（Sprint 7a 起步）
- 详设 07 V1.1 升版（E-13 资产折旧字段表 / E-06 报废处置完整流程）

### 1.4 基线（Sprint 6b 收尾确认）

- ✅ Sprint 6b D10 commit 已 push + Demo-6b V0.1 入库
- ✅ Sprint 6a 全部任务收尾（D10 已交付）
- ✅ EF migrations 48 条全部 apply（Sprint 6a 加 4 Wave 31-34 + Sprint 6b 加 7 Wave 41/43-48）
- ✅ sub_group_id 守护单测自动覆盖 Sprint 6a/6b 新增 13 实体（反射扫所有派生类）

### 1.5 完成标准（Sprint 7b 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 785 通过（基线 735 + 7b 新增 ~50）
- [ ] 新增 EF migrations 6-7 条：Add_SparePartIssuance_E07 / Add_BreakdownRequest_E08 / Add_ScrappingApplication_E06 / Add_EquipmentStatusChange / Add_EquipmentDepreciation_E13 / Add_LeaseBilling_BIZ_LEASE_Fields（NC 接口字段补强）
- [ ] Sprint 6b 决策点 4B 接收消化（E-11 NC BIZ-LEASE 实装）
- [ ] Sprint 5b B2 决策点接收消化（equipment_status_change 落地）
- [ ] Sprint7b_EquipmentMaintenance_E2E（E-08 → E-05 / E-07 / E-06 现场判定分流）+ Sprint7b_LeaseBillingNc_E2E 通过
- [ ] Sprint-7b-Demo 入库
- [ ] **a 集成回归**：与 a 主分支 merge 全量回归

---

## 二、按日任务拆解（V0.1 草案，10 PD）

### Day 1-4 — E-06 / E-07 / E-08 设备运维（~4 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | E-08 BreakdownRequest 故障报修申请（实体 + 状态机：草稿/已上报/已判定/已处置）+ Wave 49 + migration | 07 V1.0b §5.8 | 单测 ≥ 6 |
| D1-2 | E-08.Decision 现场判定 endpoint：决策走向 E-05 外委 / E-07 备件 / E-06 报废 / 直接处置 4 路径 | 07 V1.0b §5.8 业务规则 | 单测 ≥ 4 |
| D2-1 | E-07 SparePartIssuance 备件领用单（FK→E-01 + 沿用 S-09 模式领料；4 状态机：草稿/已审/已发料/已退料）+ Wave 50 | 07 V1.0b §5.7 | 单测 ≥ 5 |
| D2-2 | E-07 AppService（5 endpoint：Get / List / Create / Approve / Issue）+ Mapper | — | 单测 ≥ 3 |
| D3-1 | E-06 ScrappingApplication 报废处置申请（实体 + 4 状态机：草稿/已审/处置中/已处置）+ Wave 51 | 07 V1.0b §5.6 | 单测 ≥ 5 |
| D3-2 | E-06 AppService.Approve 联动 Equipment.RequestScrap（Sprint 6b §5.1.1 #10）；E-06.Dispose 联动 Equipment.ApproveScrap（#12） | 07 V1.0b §5.1.1 + §5.6 | 联动单测 ≥ 2 |
| D4-1 | E-08 → E-05 / E-07 / E-06 联动协调单测（现场判定走外委时自动创建 E-05 草稿；走备件时自动创建 E-07 草稿；走报废时自动创建 E-06 草稿）| 07 V1.0b §5.8 R-2 | 单测 ≥ 3 |
| D4-2 | E-08 / E-07 / E-06 联动钩子集成 AppService 层（沿用 EIR 自动派生模式）| — | 联动单测 ≥ 2 |

### Day 5-6 — E-11 LeaseBilling NC BIZ-LEASE 实装 + equipment_status_change（~1.5 + 1.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D5-1 | E-11 LeaseBillingAppService.PushToPaymentAsync 接入 NcInterfaceService.PushAsync("BIZ-LEASE", ...)；沿用 BIZ-PAY 模式 + 失败不阻断 | 决策点 4B 接收 | 单测 ≥ 4（含失败场景）|
| D5-2 | E-11 加 InterfacePushState / NcVoucherNo / IdempotentKey / PushErrorMessage 字段 + Wave 52 NC 接口字段补强 | 05 V1.3 BIZ-PAY 模式 | EF 单测 ≥ 2 |
| D5-3 | E-11 → C-08 PaymentRequestId 回写（如 NC 同步返回付款申请 ID）| 决策点 2A 选项 | 联动单测 ≥ 2 |
| D6-1 | EquipmentStatusChange 日志型实体（不可变；记录 transition_type / source_bill_type / source_bill_id / before_state / after_state / changed_by_person_id）+ Wave 53 | 07 V1.0b §5.2 + 5b B2 决策点接收 | 单测 ≥ 5 |
| D6-2 | EquipmentAppService 10 transition endpoint 显式落 EquipmentStatusChange（决策点 3B 落地）| — | 联动单测 ≥ 4 |

### Day 7-8 — E-13 EquipmentDepreciation 起步 + 集成 E2E（~2 + 1 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D7-1 | E-13 EquipmentDepreciation 实体（直线法字段：OriginalValue / SalvageValue / UsefulLifeMonths / MonthlyDepreciationAmount / AccumulatedDepreciation）+ Wave 54 | 07 V1.0b §5.13（V1.1 升版后补齐）| 单测 ≥ 5 |
| D7-2 | EquipmentDepreciationManager.CalculateMonthly（直线法实现 + Equipment.OriginalValue 守护 > 0）| — | 单测 ≥ 4 |
| D7-3 | E-13 AppService（4 endpoint：Get / List / CalculateForEquipment 手工触发 / ListByPeriod）| — | 单测 ≥ 3 |
| D8-1 | Sprint7b_EquipmentMaintenance_E2E：E-01 → E-08 故障上报 → 现场判定（4 路径分流）→ E-05/E-07/E-06 联动派生 | — | E2E 通过 |
| D8-2 | Sprint7b_LeaseBillingNc_E2E：E-09 → E-10 → E-11 完整链路 + NC BIZ-LEASE 推送成功/失败场景 | — | E2E 通过 |
| D8-3 | sub_group_id 守护单测自动覆盖 b 新增 5 实体（E-06/E-07/E-08/EquipmentStatusChange/E-13）| 守护 0 失败 | — |

### Day 9 — 联动集成回归 + 与 a 主分支集成（~1 PD）

| # | 任务 | 验收 |
|---|------|------|
| D9-1 | 全量回归 ≥ 785 通过 | 0 失败 |
| D9-2 | Sprint 6b 决策点 4B 接收消化验证（E-11 NC BIZ-LEASE log 占位 → 真接推送）| 联动单测 |
| D9-3 | **与 a 主分支 merge 集成回归**：本地 merge a 最新 push 后再跑一次全量 | 集成 0 失败 |
| D9-4 | Sprint 7b 决策点 1/3 接收验证（E-08 现场判定 4 路径 + EquipmentStatusChange AppService 层显式触发）| — |

### Day 10 — Demo + Sprint 8b 草案（~0.5 PD）

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 785 通过 | 0 失败 |
| D10-2 | Sprint 1-6 Demo 用例 1-32 回归 + Sprint 7b 新增 33-37（E-08 / E-07 / E-06 / E-11 NC / EquipmentStatusChange / E-13）| 全 200 OK |
| D10-3 | 写 `Sprint-7b-Demo-脚本-V0.1.md` | 入库 |
| D10-4 | 起 Sprint 8b 任务卡草案：AI 设备预警 + 智能调度 + E-13 折旧调度 V1.1 升版 | `Sprint-8b-任务卡-V0.1.md` 草案 |

**Sprint 7b V0.1 总工时（草案）：** 4 + 1.5 + 1.5 + 2 + 1 + 1 + 0.5 = **11.5 PD**（超 10 PD 上限 → 待评审收口）

**收口候选**：
- 决策点 4B 落地（E-13 Hangfire 调度顺延）= -0.5 PD
- 决策点 1B 落地（E-06 顺延 Sprint 8b）= -1 PD
- D7-3 E-13 AppService 4 endpoint 简化到 2（Get + Calculate）= -0.5 PD
- 总计可压缩到 **10 PD ✓**

---

## 三、Sprint 8b 衔接

| 候选范围 | 详设依据 | 估计 PD |
|---|---|---|
| AI 设备预警起步（基于 EquipmentStatusChange + E-08 历史模式分析）| 09 详设升版 + AI 模块设计 | ~3 |
| 智能调度（设备 + 备件 + 人力资源协调）| 待详设 | ~3 |
| E-13 折旧 V1.1 升版 + Hangfire 月度调度 | 07 详设升 V1.1 | ~2 |
| Sprint 7b 顺延 / E-06 报废处置补强（如本期 B 落地）| — | ~1.5 |

---

## 四、Sprint 6b 决策点接收（来自 Sprint 6b 收尾报告）

Sprint 6b 完成阶段识别的决策点（任务卡 V0.2 §四 + Demo §六）：

| 备忘 | 来源 | 本 Sprint 处理时机 |
|---|---|---|
| 详设 07 V1.0b 已落地（E-05 拆 / Equipment 7 状态 / E-03 / E-04 / 租赁闭环）✅ | Sprint 6b Day 1 | 已交付（基线引入） |
| E-02 命名最终保留 EquipmentCategory（设备分类字典）✅ | Sprint 5b B2 决策点 6A | 已交付（基线引入） |
| equipment_status_change 日志型实体落地 | Sprint 5b B2 决策点 + Sprint 6b §四 | **本 Sprint Day 6 处理** |
| E-11 LeaseBilling NC BIZ-LEASE 接口实装 | Sprint 6b 决策点 4B 顺延项 | **本 Sprint Day 5 处理** |
| 押金没收 SENS-LEASE-001 高敏感操作 | Sprint 6b Day 8 E-12 实施备忘 | 留 Sprint 8b（详设升版后处理）|
| E-13 资产折旧 / 报废处置后续 | Sprint 6b 候选范围 C | **本 Sprint Day 3 / Day 7 处理（决策点 1A / 4B）** |

---

## 五、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| E-08 现场判定 4 路径分流业务逻辑复杂 | 高 | D1-2 / D4 工时超估 | D1-1 第一动作做现场判定决策树 spike，文档化后再编码 |
| E-07 备件领用与 S-09 MaterialIssuance 重叠（S-09 是物料一般出库，E-07 是设备备件领用）| 中 | D2 边界模糊 | D2-1 业务方确认：E-07 通过 EquipmentId 与 S-09 解耦（S-09 由 OrgId 直接领，E-07 必绑 Equipment）|
| EquipmentStatusChange 触发遗漏（10 transition + 联动钩子）| 中 | 审计断链 | D6-2 引入 EquipmentStatusChangeLogger（DI 注入 + AOP 风格），减少 forgot-to-log |
| E-11 NC BIZ-LEASE 字段补强可能涉及 EF migration 大改 | 中 | D5-2 表结构调整 | D5-1 先验证沿用 BIZ-PAY 字段命名兼容性，避免双轨字段 |
| E-13 折旧基数与 Equipment.OriginalValue 一致性 | 中 | D7 计算口径偏差 | D7-1 强约束 OriginalValue > 0（Sprint 5b B4 已落 C-3 前置校验，本期沿用）|
| Wave 编号撞车（a 7a 用 49-53；b 7b 用 49-54）| 高 | EF 迁移冲突 | 预分配 a=49-53 / b=54-60；越界前同步 |

**Wave 编号约定（更新）**：
- a 轨道 Wave 49-53（Sprint 7a 候选 5 个 migration）
- b 轨道 Wave 54-60（Sprint 7b 候选 6-7 个 migration）

---

## 六、可复用资产

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | E-06 / E-07 / E-08 / EquipmentStatusChange / E-13 继承 |
| 双轨 SubGroupId 钩子（C-02 复制 / OrgId 反查）| Sprint 3 D7-2 | E-06/E-07/E-08 从 Equipment.OrgId 反查；EquipmentStatusChange 复制 Equipment.SubGroupId |
| `INcInterfaceService.PushAsync` + BIZ-PAY stub | Sprint 6a Day 8 | E-11 BIZ-LEASE 沿用 + push_error_* 失败不阻断 |
| RepairApplication.Start 自动派生 EIR 模式（Sprint 6b Day 2-3）| Sprint 6b | E-08.Decision 自动派生 E-05/E-07/E-06 草稿同模式 |
| Equipment.SendToRepair / Unlease 联动钩子 | Sprint 6b Day 4 | E-06.Approve 联动 Equipment.RequestScrap / E-06.Dispose 联动 ApproveScrap |
| 决策点接收记入 §四模式 | Sprint 5b → Sprint 6b | Sprint 6b → Sprint 7b 继续沿用 |
| sub_group_id 守护单测自动覆盖（反射扫派生类）| Sprint 2 V0.2 D5-4 | b 新增 5 实体自动通过，无需手工补 |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，基于 Sprint-6b-V0.2 D10-4 验收物起。范围 5 类候选：A E-06/E-07/E-08 设备运维深化 / B E-11 NC BIZ-LEASE 实装 / C equipment_status_change 日志 / D E-13 资产折旧起步 / E 验收，约 11.5 PD（需收口到 10 PD）。5 决策点待评审锁版。Sprint 6b 决策点接收记入 §四：(1) 详设 07 V1.0b 已落地 ✅；(2) E-02 命名最终保留 EquipmentCategory ✅；(3) equipment_status_change 日志落地 → Day 6；(4) E-11 NC BIZ-LEASE 实装 → Day 5；(5) 押金没收 SENS-LEASE-001 顺延 Sprint 8b；(6) E-13 资产折旧起步 → Day 7。 |
