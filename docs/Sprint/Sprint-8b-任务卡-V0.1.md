# Sprint 8b 任务卡 — 设备运维 AI 深化 + 折旧调度 + NC C-08 回写完整化 + R-05/SENS-LEASE-001（V0.1 草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案，待评审锁版为 V0.2）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（草案）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 8b（预估 10 工作日 / 约 2 周）
**并行轨道：** 与 Sprint 8a 库存联动 line 级收口 + R-05/Hangfire 平行进行

**衔接文档：**

- 上游 Sprint → [`Sprint-7b-任务卡-V0.1.md`](./Sprint-7b-任务卡-V0.1.md)（D10-4 验收物） + [`Sprint-7b-Demo-脚本-V0.1.md`](./Sprint-7b-Demo-脚本-V0.1.md)
- 详设依据：07 V1.0b §5.1.1 设备状态机 + §5.2 status_change + §5.13 折旧 / 05 V1.3 §4.8 C-08 / 09 报表预警详设 V0.1 §4.3 BondReleaseNear
- Sprint 7b 落地基线 → commit `2857cd5`（Day 8 E2E）
- 测试基线 **922 全过**（Sprint 7b push 完毕后）

---

## 一、目标与范围

### 1.1 V0.1 候选范围（约 11 PD，待评审收口到 ~10）

Sprint 7b 闭环了设备运维 4 大场景（E-06/E-07/E-08 + EquipmentStatusChange + E-11 NC + E-13 折旧起步）；本期收口 Sprint 7b 累计 4 项决策点接收 + 引入 AI 预警起步 + 押金没收 SENS-LEASE-001 高敏感操作。

**A. E-13 折旧 Hangfire 月度调度（~1.5 PD，Sprint 7b 决策点 4B 顺延项）**

- Sprint 7b Day 7 落地手工触发 EquipmentDepreciationAppService.CalculateAsync；本期接 Hangfire `RecurringJob`
- 月度调度（Cron `0 0 1 * *` 每月 1 号 00:00 UTC）扫所有 Active 设备 + 未作废未归档历史 → 自动 Calculate 当月折旧
- Sprint 8a R-05/Hangfire 调度框架先落（Sprint 8b 共用，避免重复引入）
- 失败容错：单设备失败不阻断整批；落 InterfaceOperationLog 留痕
- 测试 ≥ 5（含调度触发 + 单设备失败兜底 + Equipment.AccumulatedDepreciation 回写）

**B. E-11 NC BIZ-LEASE → C-08 PaymentRequestId 回写完整化（~1.5 PD，Sprint 7b 决策点 2A 顺延）**

- Sprint 7b Day 5 落地简化版：NC 返回 `NC-LEASE-PAY-{id}` 时自动回写 PaymentRequestId（凭证号约定）
- 本期接入真 NC 回执 schema（NC-MD-LEASE-RESP）：
  - NC 回执含 paymentRequestId 字段（结构化），而非凭证号字符串解析
  - 失败 / 异常重试逻辑：3 次重推（间隔 1m / 5m / 30m）；3 次后落 push_error_*
- C-08 PaymentRequest 反向链：通过 PaymentRequestId 查 LeaseBilling.BillingNo（用于付款单据追溯）
- 测试 ≥ 4

**C. R-05 BondReleaseNear 押金到期预警（~1.5 PD，Sprint 7b 决策点 5 顺延 + 详设 09 V0.1 §4.3）**

- 沿用 R-04 PaymentDueNear 模式（Sprint 7a Day 7 落地）
- BondReleaseNearDetector Domain Service：扫所有 E-09 LeaseContract（Performing 状态）→ 检查 BondReleaseDate ≤ 30 天 → 落 R-05 ReportAlert
- AlertType="BondReleaseNear"，AlertLevel="Warning"
- 反向去重：同合同 + 同 BondReleaseDate 不重复落（IdempotentKey）
- Hangfire 月度调度（Sprint 8a 共用框架）
- 测试 ≥ 5

**D. AI 设备预警起步（~3 PD，Sprint 7b 候选范围 — 探索性）**

- 基于 EquipmentStatusChange + BreakdownRequest 历史模式分析
- 简化版指标：
  - 单设备 30 天内故障次数 > 3 → AlertType="EquipmentHighFailureRate" Warning
  - 单设备维修中状态时长 > 7 天 → AlertType="EquipmentLongRepair" Warning
  - 设备分类故障率 > 全分类均值 2σ → AlertType="CategoryFailureAnomaly" Info
- 不引入真实 ML / LLM；纯 SQL 聚合查询 + 阈值判定
- 后置接 R-05 同 Hangfire 调度框架（每日 1 次）
- 测试 ≥ 6（含聚合查询正确性 + 阈值边界 + 去重）

**E. 押金没收 SENS-LEASE-001 高敏感操作（~1.5 PD，Sprint 6b 备忘 + 详设 07 V1.1 升版后处理）**

- 详设 07 V1.1 升版补足 SENS-LEASE-001 字段表 + 业务规则（前置 Sprint 8b 开工）
- E-12 EquipmentExit.ConfirmDamage 触发 → 押金部分 / 全额没收
- 软删除 + DeleteReason 必填（详设 11 §13 5 年留痕要求）
- 审批节点：单笔 ≥ 5000 元强制走 A-20 审批流（Sprint 8+ 审批中间件 stub）
- 测试 ≥ 4

**F. D8 集成 E2E + D9 全量回归 + D10 Demo + Sprint-9b 草案（~2 PD）**

- Sprint8bDepreciationSchedule_E2E（Hangfire 月度调度全链）
- Sprint8bAiAlert_E2E（AI 预警聚合查询）
- 全量 ≥ 1000（922 baseline + ~80 新增）

---

## 二、决策点（V0.1 草案，5 个）

| # | 决策点 | 选项 | V0.1 倾向 |
|---|---|---|---|
| 1 | E-13 Hangfire 调度范围 | A. 月度全量扫描 + B. 按变更触发（CDC）| A — CDC 复杂度高 / 月度足够；B 留 Sprint 9b |
| 2 | E-11 → C-08 NC 回执 schema | A. 完整结构化 schema / B. 沿用凭证号字符串解析 | A — Sprint 7b 简化版已锁约定，真接需迁移 |
| 3 | AI 预警范围 | A. 3 指标全做 / B. 仅高故障率 1 指标 + 探索性 | A — SQL 聚合工作量可控；B 拖 Sprint 9b |
| 4 | SENS-LEASE-001 审批阈值 | A. 5000 元强制审批 / B. 业务方自定义 | A — V0.1 硬编码即可；B 等审批引擎完整化 |
| 5 | Hangfire 引入位置 | A. SupplyCore Web 主机 / B. 独立调度服务 | A — Sprint 8a 已倾向 A；保持一致 |

---

## 三、任务拆解（10 PD 收口建议）

### Day 1 — 详设 07 V1.1 升版准备 + Sprint 7b 接收消化盘点（~0.5 PD）

- 详设 07 V1.0b → V1.1 升版起草（重点：§5.13 折旧 Hangfire 字段 + SENS-LEASE-001 字段表）
- Sprint 7b 4 项决策点接收落 §四
- 任务卡 V0.1 → V0.2 锁版评审

### Day 2 — E-13 Hangfire 月度调度（~1.5 PD，决策点 1A）

- Sprint 8a R-05/Hangfire 框架共用（前置依赖 Sprint 8a Day 3 落地）
- DepreciationCalculationJob `RecurringJob`：扫所有 Active 设备 → 调 EquipmentDepreciationManager.CalculateMonthlyDepreciationAsync
- Equipment.AccumulatedDepreciation 字段补充（Wave 54 字段补强 — 不新表，Equipment 加字段）
- Archive 时 Equipment.AccumulatedDepreciation += MonthlyDepreciationAmount
- 测试 ≥ 5

### Day 3-4 — E-11 → C-08 真 NC 回执 schema（~1.5 PD，决策点 2A）

- NC-MD-LEASE-RESP 接口契约对齐（结构化 paymentRequestId 字段）
- LeaseBillingAppService.PushToPaymentAsync 升级：
  - NC 回执 schema 解析（仍兼容 NC-LEASE-PAY-{id} 凭证号约定作为 fallback）
  - 重试逻辑：失败 3 次重推（间隔 1m / 5m / 30m，Hangfire delayed job）
- 测试 ≥ 4

### Day 5 — R-05 BondReleaseNear（~1.5 PD，决策点 5）

- BondReleaseNearDetector Domain Service
- ReportAlert.CreateBondReleaseNear 工厂方法（沿用 R-04 模式）
- Hangfire 月度调度（Sprint 8a 共用）
- 测试 ≥ 5

### Day 6-7 — AI 设备预警起步（~3 PD，决策点 3A）

- 3 指标 SQL 聚合查询 + 阈值判定（D6 高故障率 + D7 长维修 + 分类异常）
- AlertType / AlertLevel 标准化
- 去重 IdempotentKey 设计（同设备 + 同 AlertType + 同 7 天窗口）
- 测试 ≥ 6

### Day 8 — SENS-LEASE-001 押金没收（~1.5 PD，决策点 4A）

- E-12 EquipmentExit.ConfirmDamage 触发押金没收
- 审批阈值 ≥ 5000 元 强制 A-20（本期 stub）
- DeleteReason 必填守护 + 软删除留痕
- 测试 ≥ 4

### Day 9 — 集成 E2E + 全量回归（~1 PD）

- Sprint8bDepreciationSchedule_E2E（Hangfire 月度全链）
- Sprint8bAiAlert_E2E（聚合查询 + 去重）
- 全量 ≥ 1000 全过

### Day 10 — Sprint-8b Demo + Sprint-9b 草案（~0.5 PD）

- Sprint-8b-Demo-脚本-V0.1.md
- Sprint-9b-任务卡-V0.1.md 候选范围（CDC 触发折旧 / AI 预警 ML 接入 / 详设 07 V1.2 设备运维度量体系完整化）

---

## 四、Sprint 7b 决策点接收消化（必须含）

| 接收项 | 来源 | 本期处理 |
|---|---|---|
| **E-13 折旧 Hangfire 月度调度（决策点 4B 顺延）** | Sprint 7b Day 7 | **Day 2 处理 ✅** |
| **E-11 NC BIZ-LEASE C-08 回写完整化（决策点 2A 顺延）** | Sprint 7b Day 5 | **Day 3-4 处理 ✅** |
| **R-05 BondReleaseNear（决策点 5 顺延）** | Sprint 7b 候选范围 | **Day 5 处理 ✅** |
| **押金没收 SENS-LEASE-001（Sprint 6b 备忘）** | Sprint 6b → 7b → 8b | **Day 8 处理 ✅**（详设 07 V1.1 升版后）|
| **AI 设备预警起步（Sprint 7b 候选范围 — 探索性）** | Sprint 7b Day 10 草案 | **Day 6-7 处理 ✅** |
| equipment_status_change 日志型实体 | Sprint 5b B2 + Sprint 6b §四 | **Sprint 7b Day 6 已处理 ✅** |

---

## 五、风险与对策

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | Hangfire 引入复杂度（DI / Outbox / 持久化）| 中 | Sprint 8a 优先落框架，b 接 RecurringJob；Volo.Abp.BackgroundJobs.Hangfire 标准方案 |
| 2 | E-11 NC 真接 schema 与现有简化版冲突 | 中 | 保留 NC-LEASE-PAY-{id} fallback 兼容；真 schema 主路径 |
| 3 | AI 预警 SQL 聚合性能（全设备扫表）| 中 | Detector 跑 Hangfire 异步 + 索引 (EquipmentId, ChangedAt) 已建 Wave 52 |
| 4 | SENS-LEASE-001 详设升版延期 | 低 | Day 1 升版优先；若延期 Day 8 顺延 Sprint 9b |
| 5 | AI 预警去重 IdempotentKey 冲突 | 低 | (EquipmentId, AlertType, WeekOfYear) 唯一约束 |

---

## 六、版本沿革

| 版本 | 日期 | 主要变更 |
|---|---|---|
| V0.1 | 2026-05-13 | 首版草案，基于 Sprint-7b-V0.1 D10-4 验收物起。范围 5 类候选：A E-13 Hangfire / B E-11→C-08 真接 / C R-05 BondReleaseNear / D AI 预警起步 / E SENS-LEASE-001，约 11 PD（需收口到 10）。5 决策点待评审。Sprint 7b 决策点接收记入 §四：(1) 决策点 2A E-11 真接 → Day 3-4；(2) 决策点 3B EquipmentStatusChange 已落 ✅；(3) 决策点 4B Hangfire 折旧 → Day 2；(4) 决策点 5 R-05 → Day 5；(5) SENS-LEASE-001 → Day 8；(6) AI 预警探索 → Day 6-7。 |
