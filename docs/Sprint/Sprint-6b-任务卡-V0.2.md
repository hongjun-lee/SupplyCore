# Sprint 6b 任务卡 — 设备运维强化 + 详设 07 V1.0b 升版 + 租赁闭环起步（V0.2）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（评审后锁版 / 实施基线）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（实施基线）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 6b（预估 10 工作日 / 约 2 周）
**并行轨道：** 与 Sprint 6a 供应链下游补强 平行进行（详 [`Sprint-6a-任务卡-V0.2.md`](./Sprint-6a-任务卡-V0.2.md)）

**衔接文档：**

- 上游 Sprint → [`Sprint-5b-外委检修专项-任务卡-V0.2.md`](./Sprint-5b-外委检修专项-任务卡-V0.2.md)
- 详设依据：07 V1.0a §5.1-§5.12（设备主档 / 设备分类 / 设备字典 / 检修记录 / 备件领用 / 故障报修 / 租赁合同 / 进出场 / 计费 / 退租）
- Sprint 5b 落地基线 → commit `8d74faf`（Sprint 5b B6 收尾，含全 7 任务，557 测试全过）

---

## 一、目标与范围

### 1.1 V0.2 锁版范围（10 PD）

Sprint 5b 已落 E-01 / E-02 / E-05 三实体最小可用版 + C-02 40% 上限规则 + 4 审批模板 seed。Sprint 6b 补齐设备运维剩余实体 + 详设 07 V1.0b 升版 + 设备租赁闭环起步。

**A. 详设 07 V1.0a → V1.0b 升版（~1 PD）**
- 详设升版：E-05 拆为 RepairApplication（审批型，6 状态）+ EquipmentInspectionRecord（执行型，4 状态）
- 升版联动：07 字段表 + 状态机表 + 业务规则；与既有 RepairApplication 命名 / 字段对齐确认
- 评审：交叉评审记录 + 5a/5b 集成回归不破坏

**B. E-05 代码层拆分（~1.5 PD）**
- 复用 Sprint 5b B3 已落 `RepairApplication`（审批型 6 状态）
- 新增 `EquipmentInspectionRecord` 执行型实体（4 状态：待执行 / 执行中 / 已完成 / 已取消）
- 联动钩子：RepairApplication.Start → 自动生成 EquipmentInspectionRecord 草稿
- Wave 41-42 + Add_EquipmentInspectionRecord migration

**C. Equipment 状态机扩展（~1 PD）**
- E-01 EquipmentStates 从 4 → 7 状态：Draft / Active / InUse / Leased / UnderRepair / PendingScrap / Scrapped
- 状态转换矩阵：在用 ↔ 租赁在用 ↔ 维修中 ↔ 待报废 ↔ 报废
- 联动：E-05 Start → Equipment 进入 维修中；C-08 租赁合同 Sign → Equipment 进入 租赁在用
- E-02 命名歧义解决确认：保留 EquipmentCategory 实体名（设备分类字典）；equipment_status_change 后续作日志型实体（不与 E-02 冲突）

**D. E-03 / E-04 设备字典扩展（~1 PD）**
- E-03 厂家字典（Manufacturer）：FK→ M-09 Supplier 子集
- E-04 安装位置字典（InstallationLocation）：FK→ M-01 Organization 树状
- 最小可用版字典型（沿用 E-02 EquipmentCategory 模式）
- Wave 43-44 + migration

**E. E-09 ~ E-12 设备租赁闭环起步（~3.5 PD）**
- E-09 设备租赁合同（LeaseContract）：FK→ M-09 出租方 / M-01 承租方组织 / E-01 设备
- E-10 进场登记（EquipmentEntry）：租赁开始的进场记录
- E-11 计费记录（LeaseBilling）：按日 / 按月计费明细（NC BIZ-LEASE stub 留 Sprint 7b）
- E-12 退租 / 出场登记（EquipmentExit）：租赁结束的出场记录 + 押金退还
- Wave 45-48 + 4 migrations

**F. 联动与验收（~2 PD）**
- Sprint6b_EquipmentLifecycle_E2E：E-01 → E-03 / E-04 → E-05 检修 → E-09 租赁 → E-12 退租
- Sprint6b_RepairExecution_E2E：RepairApplication → EquipmentInspectionRecord（拆分后）→ Complete
- 全量回归 ≥ 595 通过（基线 ~557 + 6b 新增 ~38）
- 与 a 主分支 merge 集成回归
- Sprint-6b-Demo-脚本-V0.1
- Sprint-7b 任务卡草案

### 1.2 V0.2 评审决策点（已锁版）

| # | 决策点 | 锁版结论 | 理由 |
|---|--------|----------|------|
| 1 | E-05 代码层拆分时机 | **A — 本期拆** | Sprint 5b B3 升版决策已识别；越拖兼容成本越高（5b 引用越多） |
| 2 | Equipment 7 状态扩展范围 | **A — 完整 7 状态 + 转换矩阵** | 与 E-09 租赁闭环同期落地最干净；增量 5 状态后续要重做转换矩阵 |
| 3 | E-03 厂家字典数据来源 | **A — 独立实体** | 设备厂家 ≠ 物资供应商（业务事实）；独立字典便于设备主档关联与统计 |
| 4 | E-11 LeaseBilling NC 接口 | **B — 顺延 Sprint 7b** | 按日/按月计费口径业务方未确认；本期先落实体 + 状态机，stub 等业务确认后接 |
| 5 | 与 a 集成测试边界 | **A — b 独立** | 6a 同样选 A（双向不依赖 = 双轨干净）；跨域联动 S-09 ↔ E-06 留 Sprint 7b |
| 6 | E-02 命名最终确认 | **A — 保留 EquipmentCategory** | 5b B2 大量代码引用；equipment_status_change 是另一回事（详设 07 §5.2 日志型），Sprint 7b 单独落 |

### 1.3 不在范围

- Sprint 6a 供应链下游补强 + 招采平台真接 + 付款流程（独立轨道）
- E-06 ~ E-08 设备运维剩余（备件领用 / 故障报修 / 检修工单）— 顺延 Sprint 7b
- 设备 AI 预警 / 智能调度（跨 Sprint 大模块）
- E-13+ 设备资产折旧 / 报废处置后续（顺延 Sprint 7b）

### 1.4 基线

- ✅ Sprint 5b B7 commit 已 push（`8d74faf`）+ Demo-5b V0.1 入库（SupplyCore `76fba61`）
- ✅ Sprint 5a 全部 10 PD 任务收尾 + Demo-5a V0.1 入库（SupplyCore `b7fc49c`）
- ✅ 详设 07 V1.0a 已锁版（V1.0b 升版作为本 Sprint Day 1 交付）
- ✅ EF migrations 31 条全部 apply（5a 加 4 Wave 27-30 / 5b 加 5 Wave 37-40 + Contract 字段补丁）
- ✅ sub_group_id 守护单测自动覆盖 Sprint 5b 新增 3 实体（Equipment / EquipmentCategory / RepairApplication）

### 1.5 完成标准（Sprint 6b 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 595 通过（基线 557 + 6b 新增 ~38）
- [ ] 新增 EF migrations 8 条：Add_EquipmentInspectionRecord / Add_Equipment_7States / Add_Manufacturer_E03 / Add_InstallationLocation_E04 / Add_LeaseContract_E09 / Add_EquipmentEntry_E10 / Add_LeaseBilling_E11 / Add_EquipmentExit_E12
- [ ] Sprint6b_EquipmentLifecycle_E2E + Sprint6b_RepairExecution_E2E 通过
- [ ] 详设 07 V1.0a → V1.0b 升版评审通过 + 入库
- [ ] Sprint-6b-Demo 入库
- [ ] **a 集成回归**：在 b 收尾后与 a 主分支 merge 全量回归

---

## 二、按日任务拆解（V0.1 草案，10 PD）

### Day 1 — 详设 07 V1.0a → V1.0b 升版（~1 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | 详设 07 升版起草：E-05 拆为 RepairApplication（审批型 6 状态，沿用 Sprint 5b B3）+ EquipmentInspectionRecord（执行型 4 状态，新增）| 07 V1.0a §5.5 | 草案完成 |
| D1-2 | Equipment 状态机扩展 4 → 7 状态 + 转换矩阵 + 状态变更触发条件梳理 | 07 V1.0a §5.1.1 + 5b B2 报告 | 草案完成 |
| D1-3 | 详设 07 V1.0b 评审 + 入库（交叉评审记录） | — | 评审通过 |

### Day 2-3 — E-05 代码层拆分 + EquipmentInspectionRecord（~1.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D2-1 | `EquipmentInspectionRecord` 实体（FK→E-05 RepairApplicationId / E-01 EquipmentId，10+ 字段）+ 4 状态：待执行 / 执行中 / 已完成 / 已取消 | 07 V1.0b §5.5a（新增） | 单测 ≥ 5 |
| D2-2 | Manager 写入钩子 + RepairApplication.Start → 自动生成 EquipmentInspectionRecord 草稿联动 | — | 联动单测 ≥ 2 |
| D3-1 | AppService + Controller（5 状态机方法 + 列表查询）| — | 单测 ≥ 4 |
| D3-2 | EF mapping + Wave 41 + Add_EquipmentInspectionRecord migration | — | apply 通过 |

### Day 4 — Equipment 7 状态扩展（~1 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D4-1 | E-01 EquipmentStates 扩展：Draft / Active / InUse / Leased / UnderRepair / PendingScrap / Scrapped + 转换矩阵 | 07 V1.0b §5.1.1 | 单测 ≥ 8（转换全覆盖）|
| D4-2 | E-05 RepairApplication.Start → Equipment 进入 UnderRepair 联动钩子 | — | 联动单测 ≥ 2 |
| D4-3 | E-09 LeaseContract.Sign → Equipment 进入 Leased 联动钩子（占位，D8 实现）| — | 联动 stub |
| D4-4 | EF migration: Add_Equipment_7States（仅枚举扩展，无表结构改）| — | apply 通过 |

### Day 5 — E-03 / E-04 设备字典扩展（~1 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D5-1 | E-03 Manufacturer 厂家字典（FK→M-09，最小可用版字典型，沿用 E-02 模式）+ Wave 43 | 07 V1.0b §5.3 | 单测 ≥ 3 |
| D5-2 | E-04 InstallationLocation 安装位置字典（FK→M-01，树状结构）+ Wave 44 | 07 V1.0b §5.4 | 单测 ≥ 3 |
| D5-3 | 2 migrations apply + DbContext 注册 | — | apply 通过 |

### Day 6-8 — E-09 ~ E-12 设备租赁闭环（~3.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D6-1 | E-09 LeaseContract 设备租赁合同实体（FK→M-09 出租方 / M-01 承租方 / E-01 设备）+ 5 状态：草稿/待审/已签/履行中/已结束 | 07 V1.0b §5.9 | 单测 ≥ 6 |
| D6-2 | EF mapping + Wave 45 + Add_LeaseContract_E09 migration | — | apply 通过 |
| D7-1 | E-10 EquipmentEntry 进场登记实体（FK→E-09 LeaseContractId）+ 3 状态：草稿/已登记/已确认 + 自动联动 Equipment 进入 Leased | 07 V1.0b §5.10 | 单测 ≥ 4 |
| D7-2 | E-11 LeaseBilling 计费记录实体（FK→E-09 LeaseContractId）+ 按日/按月计费规则 + 4 状态 | 07 V1.0b §5.11 | 单测 ≥ 5 |
| D7-3 | E-10 / E-11 EF mapping + Wave 46-47 + 2 migrations | — | apply 通过 |
| D8-1 | E-12 EquipmentExit 退租 / 出场登记实体（FK→E-09 / E-10）+ 3 状态 + 押金退还规则 | 07 V1.0b §5.12 | 单测 ≥ 4 |
| D8-2 | E-12 联动：LeaseContract 进入 已结束 + Equipment 回到 Active；Wave 48 + migration | — | apply 通过 |

### Day 9 — 集成 E2E + 全量回归（~1 PD）

| # | 任务 | 验收 |
|---|------|------|
| D9-1 | Sprint6b_EquipmentLifecycle_E2E：E-01 → E-03 / E-04 → E-05 检修 → E-09 租赁 → E-12 退租 | 通过 |
| D9-2 | Sprint6b_RepairExecution_E2E：RepairApplication → EquipmentInspectionRecord（自动联动）→ Complete | 通过 |
| D9-3 | sub_group_id 守护单测自动覆盖 b 新增 ≥ 5 业务实体（EquipmentInspectionRecord / Manufacturer / InstallationLocation / LeaseContract / EquipmentEntry / LeaseBilling / EquipmentExit）| 守护 0 失败 |
| D9-4 | 全量回归 ≥ 595 通过 | 0 失败 |
| D9-5 | **与 a 主分支 merge 集成回归** | 集成 0 失败 |

### Day 10 — Demo + Sprint 7b 草案（~0.5 PD）

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 595 通过 | 0 失败 |
| D10-2 | Sprint 1-6 Demo 用例 1-26 回归 + Sprint 6b 新增 27-32（拆分 / 7 状态 / 字典 / 租赁闭环）| 全 200 OK |
| D10-3 | 写 `Sprint-6b-Demo-脚本-V0.1.md` | 入库 |
| D10-4 | 起 Sprint 7b 任务卡草案：E-06 ~ E-08 设备运维剩余 + LeaseBilling NC 接入 + 设备 AI 预警起步 | `Sprint-7b-任务卡-V0.1.md` 草案 |

**Sprint 6b V0.1 总工时（草案）：** 1 + 1.5 + 1 + 1 + 3.5 + 1 + 0.5 = **9.5 PD**（D9 全量回归与 D8 部分重叠，实际 ≈ 10 PD）

---

## 三、Sprint 7b 衔接

| 候选范围 | 详设依据 | 估计 PD |
|---|---|---|
| E-06 EquipmentSparePartIssuance 备件领用 + E-07 EquipmentFaultReport 故障报修 | 07 V1.0b §5.6 / §5.7 | ~3 |
| E-08 检修工单（细化 EquipmentInspectionRecord 子任务）| 07 V1.0b §5.8 | ~1.5 |
| E-11 LeaseBilling NC BIZ-LEASE 接口 stub + 按日/按月口径配置化 | 07 V1.0b §5.11 + 08 | ~2 |
| 设备 AI 预警起步（设备到期 / 检修预警 / 租赁到期 / 折旧预警）| 09 详设草拟 | ~2.5 |
| Sprint 6b 顺延 / 评审纠错 | — | ~1 |

---

## 四、Sprint 5b 决策点接收（来自 b 报告）

Sprint 5b 完成报告中识别的 3 个详设 07 升版决策点：

| 决策点 | 来源 | 本 Sprint 处理任务 |
|---|---|---|
| **详设 07 §5.5 E-05 拆为两实体：RepairApplication（审批型，6 状态）+ EquipmentInspectionRecord（执行型，4 状态）** | Sprint 5b B3 报告 | §二 Day 1 升版 + Day 2-3 代码层拆分 |
| **E-02 命名歧义：EquipmentCategory（设备分类字典）vs equipment_status_change（详设 07 §5.2 状态变更日志）** | Sprint 5b B2 报告 | §二 Day 4-1 与 V1.0b 升版同期确认保留 EquipmentCategory（决策点 6 倾向 A）；equipment_status_change 落 Sprint 7b 作日志型实体 |
| **Equipment 状态机扩展到 7 状态（含 在用 / 租赁在用 / 维修中 / 外委检修中 / 待报废）** | Sprint 5b B2 报告 | §二 Day 4 完整 7 状态扩展 + 转换矩阵 + 联动钩子（决策点 2 倾向 A）|

3 个决策点全部记入本 Sprint，由 §二 Day 1（详设升版）+ Day 2-3（E-05 拆分）+ Day 4（Equipment 7 状态）落地。

---

## 五、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 详设 07 V1.0a → V1.0b 升版评审延期 | 中 | D2-3 阻塞 | D1 全天专注升版 + 第一时间评审；评审延期则降级为 V1.0b 草案与代码并行 |
| E-05 拆分破坏 Sprint 5b 既有契约 | 中 | D2 返工 | 保持 RepairApplication 类名 / 字段不变（仅新增 EquipmentInspectionRecord）；E-05 字典词义升级靠详设而非代码 |
| Equipment 7 状态扩展引发既有 4 状态 DB 数据迁移 | 中 | D4 阻塞 | 新增状态值不替换既有 Active / Disabled / Scrapped；草稿 / 启用 平滑兼容 |
| E-09 ~ E-12 4 实体 EF wave 编号撞车 | 低 | D6-8 表名重复 | 预分配 b=45-48 / a=31-34；越界前同步 |
| 与 a 详设 06 真接进度耦合 | 低 | D9-5 集成回归延期 | 双周双方 sync 详设基线；Sprint 6b 不引入 a 域依赖（决策点 5 倾向 A） |

---

## 六、可复用资产

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | EquipmentInspectionRecord / Manufacturer / InstallationLocation / LeaseContract / EquipmentEntry / LeaseBilling / EquipmentExit 全部继承 |
| 双轨 SubGroupId 钩子（C-02 复制 / OrgId 反查） | Sprint 3 D7-2 | EquipmentInspectionRecord 从 RepairApplication 复制；LeaseContract 双 OrgId（出租方+承租方）取承租方 |
| EquipmentManager Active 强约束模式（Sprint 5b B2）| Sprint 5b B2 | E-09 / E-10 / E-12 引用 Equipment 时同模式校验 |
| sync `.Any()` 前置校验风格 | Sprint 4 评审纠错 | E-12 退租 → E-09 LeaseContract 在 履行中 前置 |
| SENS-CON-XXX 高敏感 attribute | Sprint 4 D5 + Sprint 5b B4 | E-12 押金没收候选 SENS-LEASE-001 |
| sub_group_id 守护单测反射覆盖 | Sprint 2 D5-4 | 自动覆盖新增 7 实体 |
| WorkflowTemplate seed 模式（Sprint 5b B5）| Sprint 5b B5 | 6b 可补 WF-LEASE-001 设备租赁审批模板 seed（如详设 10 V1.2b 升版同期） |
| ContractAppService 40% 上限规则模式 | Sprint 5b B4 | LeaseBilling 押金 / 计费上限校验同模式 |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，基于 Sprint-5b-V0.2 B7-4 验收物起。范围 6 类候选：A 详设 07 V1.0b 升版 / B E-05 代码层拆分 / C Equipment 7 状态 / D E-03 / E-04 字典扩展 / E E-09 ~ E-12 租赁闭环 / F 联动 E2E，约 10 PD。6 决策点待评审锁版。Sprint 5b B3 决策点（E-05 拆分 / E-02 命名 / Equipment 7 状态）已记入 §四并由 §二 Day 1-4 落地。|
| V0.2 | 2026-05-13 | 评审 6 决策点一次性按"我倾向"锁版：(1) E-05 本期拆；(2) Equipment 完整 7 状态；(3) E-03 独立实体；(4) **E-11 LeaseBilling NC 接口顺延 Sprint 7b**（按日/按月计费口径业务方未确认）；(5) b 独立（与 6a §5A 对称）；(6) 保留 EquipmentCategory。§1.4 基线更新到 Sprint 5 a/b 收尾后的实际状态：commit `8d74faf` / 557 测试全过 / EF migrations 31 条 apply。§1.5 验收门 595（基线 557 + 新增 ~38）。§二 D1-D10 工时与 V0.1 一致（10 PD 严卡，1 PD buffer）；6b 即刻进入实施，按 Day 1 起步详设 07 V1.0b 升版。|
