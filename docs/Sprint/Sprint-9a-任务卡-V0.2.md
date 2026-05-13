# Sprint 9a 任务卡 — 09 详设升版 + R-06/R-07/R-08 完整化 + AI 报表起步 + 技术债扫尾（V0.2 锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 评审通过 1A/2A/3B/4A/5A · 工时收口 12.5 → 10.5 PD）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 9a（10 工作日 / 约 2 周 / 实际 10.5 PD）
**并行轨道：** 与 Sprint 9b（AI 设备预警深化 / 折旧调度完整化 / 详设 07 V1.2）平行

**衔接文档：**

- 上游 Sprint → [`Sprint-8a-任务卡-V0.2.md`](./Sprint-8a-任务卡-V0.2.md)（D10 验收物） + [`Sprint-8a-Demo-脚本-V0.1.md`](./Sprint-8a-Demo-脚本-V0.1.md)
- 详设依据：09 V0.1 + 09 V1.2 合并 V1.3 / 11 详设（AI 工具） / 05 V1.3 / 07 V1.1
- Sprint 8a 落地基线 → commit `df8b130`（Day 9 综合冒烟）
- 测试基线 **1056 全过**（Domain 689 / Application 355 / EFCore 12）

---

## 一、目标与范围

### 1.1 V0.2 锁版范围（约 10.5 PD，含 0.5 PD buffer）

Sprint 8a 闭环了库存联动 line 级 + C-09 BIZ-PAY-BATCH + R-05 + Hangfire + C-02/C-08 财务联动。本期目标：**详设 09 升版定型 + 报表 3 个 Detector 完整化 + AI 工具骨架起步 + Sprint 5-8 累计技术债扫尾 + Codex 评审 4 commits 补评**。

**A. 09 详设升版 V0.1 + V1.2 合并 V1.3（~1.5 PD）**

- 09 V0.1（实施口径，BondReleaseDate/SY-02 字典等）+ 09 V1.2（业务全景，AI 智能建议等）合并为 V1.3
- 统一字段编号 + 业务规则 + 实施口径
- R-05 字段映射回归：C-02.BondReleaseState (enum) + BondReleaseDate (DateOnly?) + Wave 70 migration
- BondReleaseNearDetector 重构用 BondReleaseState/BondReleaseDate（兼容数据迁移：BondState=已缴纳 → BondReleaseState=未释放）
- SY-02 字典硬编码迁出：BondReleaseAlertDays / PaymentDueDays / DedupWindowHours / CompletionThresholdRate

**B. R-06/R-07/R-08 完整化（~3 PD，09 V0.1 §4.3-4.5）**

- R-06 ContractExpiryNear：扫 C-02 ContractEndDate < TODAY+60 → 触发预警
- R-07 InventoryLowStock：扫 S-13 AvailableQuantity < safety_stock_threshold → 触发预警 + 业务事件实时触发（出库后立即检测）
- R-08 InventoryNearExpiry：扫 S-14 BatchExpiryDate < TODAY+30 → 触发预警
- 沿用 R-04/R-05 Detector 模式 + ReportAlert.CreateXxx 工厂 + Hangfire 接通（占位 Job 接通真 Detector）
- 测试 ≥ 15（每 Detector ≥5）

**C. AI 报表智能建议起步（~2 PD，V0.2 收口 -1 PD：仅 stub mock，不真接 LLM）**

- 基于 C-07 历史付款 / R-04 PaymentDueNear / R-05 BondReleaseNear 数据
- AI Tool 接口骨架（IReportAdvisorTool）+ stub 实现（返回 mock 建议）
- Domain Service：AskAdvisor(reportContext) → AdvisorAnswer
- 不引入真 LLM；纯接口骨架 + mock 输出（Sprint 10+ 接 Claude API/OpenAI）
- 测试 ≥ 6（含 prompt 构造 / 上下文裁剪 / 失败软降级）

**D. Sprint 5-8 累计技术债扫尾（~1 PD，V0.2 收口 -0.5 PD：SY-02 字典化精简到 4 个 const）**

- SY-02 字典化全量（含 R-05 BondReleaseAlertDays / DedupWindowHours / CompletionThresholdRate / Sprint 8a 硬编码 const 7+）
- NC 接口 idempotent 增强（C-09 部分成功回执 schema 设计 + 测试覆盖 — Sprint 8a Day 5 简化为 all-or-nothing 现补全）
- PaymentExecutionAppService 编排（C-10 → Contract.AddPayment 联动钩子，Sprint 8a Day 8 顺延项）
- C-02.PaidAmount = SUM(C-07.CumulativePaidAmount) reconciliation 集成单测（EFCore.Tests 层）

**E. Sprint 8a Codex 评审补评 + 修复（~1 PD）**

- Codex 评审 4 commits（44062d4 Hangfire / 408545b C-02-C-08 / c8f2600 C-09 / 428e5cc R-05）
- finding 列给 cici 决策（按 memory rule `feedback_auto_remind_codex_review.md` 不自动修复）
- 修复闭环（含 PaymentExecution / PaymentPlan / MonthlyPrepaymentSummary / BondReleaseNearDetector 边角案例）

**F. Web.Tests 项目建 + D9 Hangfire 注册测试补齐（~0.5 PD）**

- 新建 `test/SupplyCores.Web.Tests` 项目
- 加 Hangfire RecurringJob 注册守护单测（7 JobId 唯一性 + Cron 表达式合法 + Handler 类型可解析 + AddOrUpdate 幂等）
- 接通 GitHub Actions 含 Web.Tests 跑

**G. D8 集成 E2E + D9 全量回归 + D10 Demo + Sprint 10a 草案（~1 PD）**

- Sprint9aReports_E2E：R-06/R-07/R-08 同时触发 → ReportAlert 分类正确 + 去重生效
- Sprint9aAiAdvisor_E2E：AI Tool 骨架调用 + mock 输出验证
- 全量 ≥ 1080（基线 1056 + ~30 新增）

---

## 二、决策点（V0.2 锁版，5 个）

| # | 决策点 | 选项 | V0.1 倾向 | **V0.2 锁版** |
|---|---|---|---|---|
| 1 | C-02 字段补强范围 | A. 加 BondReleaseState + BondReleaseDate 双字段 / B. 仅加 BondReleaseDate | A | **1A ✅** — 详设 09 V0.1 §4.2 明确两字段；R-05 简化版完整回归 |
| 2 | R-07 实时触发 vs 批处理 | A. 出库后实时检测 + 批处理兜底 / B. 仅批处理（每小时） | A | **2A ✅** — 出库后立即检测，业务体验佳 |
| 3 | AI Tool 接口设计 | A. 单 Tool（通用 advisor） / B. 多 Tool（每 report 一个 advisor） | B | **3B ✅** — 详设 11 推荐多 Tool；后期独立 prompt 优化 |
| 4 | NC 部分成功回执 schema | A. 详细 schema / B. 沿用 all-or-nothing | A | **4A ✅** — 真接联调需要真 schema |
| 5 | Codex 评审范围 | A. 评 Sprint 8a 全 4 commits + Sprint 9a 新模块 / B. 仅 Sprint 9a 新模块 | A | **5A ✅** — Sprint 8a 顺延评审必须补 |

---

## 三、任务拆解（10 PD 收口建议）

### Day 1 — 09 详设升版起草 + 测试基线 baseline（~1 PD）

- 09 V0.1 + V1.2 合并 V1.3 起草（重点：R-05 字段补强 + SY-02 字典化字段表 + AI Tool 接口规范）
- Sprint 8a Codex 评审 4 commits 触发（一次评审）
- 测试基线 1056 验证 + R-05 简化版 → 完整版数据迁移 plan
- 任务卡 V0.1 → V0.2 锁版评审

### Day 2 — R-05 字段补强 + Codex finding 修复（~1 PD）

- C-02 加 BondReleaseState (enum) + BondReleaseDate (DateOnly?) + Wave 70
- BondReleaseNearDetector 重构用新字段
- 数据迁移：BondState=已缴纳 → BondReleaseState=未释放（migration 内 SQL）
- Codex Sprint 8a 4 commits finding 修复 closing
- 测试 ≥ 4 + 兼容 Sprint 8a R-05 简化版测试

### Day 3 — SY-02 字典化全量 + 技术债扫尾（~1.5 PD）

- 新建 `c.system_dictionary` 表（如未有）+ 接通 RecurringJob 配置注入
- 迁出 const：BondReleaseAlertDays / PaymentDueDays / DedupWindowHours / CompletionThresholdRate / Sprint 8a Hangfire Cron
- PaymentExecutionAppService 编排（C-10 → Contract.AddPayment 联动）
- C-02.PaidAmount reconciliation 集成单测
- 测试 ≥ 8

### Day 4-5 — R-06/R-07/R-08 Detector 实装（~3 PD）

- D4-1 R-06 ContractExpiryNearDetector + ReportAlert.CreateContractExpiryNear（沿用 R-04 模式，Hangfire 接占位 Job）
- D4-2 R-07 InventoryLowStockDetector + ReportAlert.CreateInventoryLowStock + 出库后业务事件实时触发钩子
- D5-1 R-08 InventoryNearExpiryDetector + ReportAlert.CreateInventoryNearExpiry
- D5-2 Hangfire 7 RecurringJob 中 R-06/R-07/R-08 占位 Handler 接通真 Detector
- 测试 ≥ 18（3 Detector × 6+）

### Day 6-7 — AI 报表智能建议起步（~3 PD）

- D6-1 IReportAdvisorTool 接口骨架 + ReportAdvisorContext / ReportAdvisorAnswer
- D6-2 各 Detector 接 AdvisorTool（D6/D7 接 R-04/R-05/R-06）
- D7-1 stub ReportAdvisorService（mock 输出 + prompt 构造）
- D7-2 测试 ≥ 6（含 prompt 构造 / 上下文裁剪 / 失败软降级）

### Day 8 — NC 部分成功回执 schema 完整化 + Web.Tests 项目建（~1.5 PD）

- D8-1 NcPushResult 扩展 BatchDetails 字段（每 C-08 成功/失败状态）
- D8-2 MonthlyPrepaymentSummary.PushToPaymentAsync 升级用 BatchDetails 分别回写
- D8-3 测试 ≥ 4（全成功 / 部分成功 / 全失败 / 异常）
- D8-4 新建 SupplyCores.Web.Tests 项目
- D8-5 Hangfire 7 RecurringJob 注册守护单测（D9 顺延项）

### Day 9 — 集成 E2E + 全量回归（~1 PD）

- Sprint9aReports_E2E：R-06/R-07/R-08 同时触发 → 分类正确 + 去重
- Sprint9aAiAdvisor_E2E：AI Tool 骨架调用
- 全量 ≥ 1080 通过
- 与 b 主分支 merge 集成回归

### Day 10 — Demo + Sprint 10a 草案（~0.5 PD）

- Sprint-9a-Demo-脚本-V0.1.md
- Sprint-10a-任务卡-V0.1.md 候选范围（AI 报表深化 + LLM 真接 + ML 设备预警 / Sprint 9 累计技术债）

**Sprint 9a V0.2 锁版总工时：** 1 + 1 + 1 + 3 + 2 + 1.5 + 1 + 0.5 = **11 PD**

**V0.2 收口对比 V0.1**：
- §1.1 C AI Tool：3 → 2 PD（-1）：仅 stub mock，真 LLM 接入留 Sprint 10
- §1.1 D 技术债：1.5 → 1 PD（-0.5）：SY-02 字典化精简到 4 个核心 const

**§1.1 + Day 拆解后总 11 PD 含 0.5 PD buffer，实际 10.5 PD ≈ 10 PD 严卡** ✓

---

## 四、Sprint 8a 决策点接收（来自 D10 收尾报告）

| 备忘 | 来源 | 本 Sprint 处理时机 |
|---|---|---|
| Sprint 8a Day 7 R-05 字段简化（BondState/ExpiryDate）| project memory `r05_simplification_owed_to_sprint9` | **本 Sprint Day 2** ✅ |
| Sprint 8a Day 8 顺延：PaymentExecutionAppService 编排 | c 子代理 Day 8 报告 | **本 Sprint Day 3** ✅ |
| Sprint 8a Day 5 顺延：C-09 部分成功回执 schema | a Day 5 实施备忘 | **本 Sprint Day 8** ✅ |
| Sprint 8a Day 9 顺延：Codex 评审 4 commits（Pro quota 触顶）| Day 9 Demo §四 | **本 Sprint Day 1** ✅ |
| Sprint 8a Day 9 顺延：Web.Tests + Hangfire 注册测试 | Day 9 Demo §五 | **本 Sprint Day 8** ✅ |
| Sprint 8a Day 6 顺延：C-09 月末批处理循环 Org | Day 6 Handler placeholder | **本 Sprint Day 8（与 NC 部分成功一起做）** ✅ |
| Sprint 8a Day 4 顺延：SY-02 字典化全量 | Sprint 5-8 累计 const 硬编码 | **本 Sprint Day 3** ✅ |
| Sprint 5-8 累计 reconciliation 单测 | Sprint 8a §五 风险表 | **本 Sprint Day 3** ✅ |

---

## 五、资源 / 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | R-05 字段迁移数据正确性（BondState → BondReleaseState） | 中 | Day 2 migration 内 SQL 迁移 + Detector 测试对照 Sprint 8a 简化版数据 |
| 2 | SY-02 字典表 schema 设计 | 中 | Day 3 第一动作做 schema spike（参考 ABP 标准 SettingProvider） |
| 3 | AI Tool 接口稳定性（Sprint 10+ 真 LLM 接入时不大改） | 中 | Day 6 接口设计参考 Claude API SDK / OpenAI Function Calling 通用模式 |
| 4 | NC 部分成功 schema 与生产 NC 真实接口不一致 | 中 | Day 8 与 NC 集成方对齐 schema 后再实施（非阻塞性，最坏情况沿用 all-or-nothing 留 Sprint 10） |
| 5 | Codex 评审若再触顶 quota | 中 | Day 1 第一动作先评 Sprint 8a 4 commits（quota 优先消耗）；Sprint 9a 新模块评审排 Day 10 |
| 6 | R-07 业务事件实时触发性能（出库后立即查 S-13）| 低 | 加 S-13 索引 (org_id, warehouse_id, material_id) 已有 |
| 7 | Wave 编号撞车（a 9a 用 70-78；b 9b 待定）| 中 | 预分配 a=70-80 / b=81-93 |

---

## 六、可复用资产

| 资产 | 来源 | 复用方式 |
|---|---|---|
| `BondReleaseNearDetector` Domain Service 模式 | Sprint 8a Day 7 | R-06/R-07/R-08 Detector 镜像复制 |
| `ReportAlert.CreateXxx` 工厂方法 + AlertContent JSON | Sprint 7a/8a Day 7 | R-06/R-07/R-08 工厂方法 |
| `SY-02 字典硬编码 const` 模式（Sprint 7a BondReleaseAlertDays 等）| Sprint 7a+ | 替换为 SettingProvider 注入 |
| `MonthlyPrepaymentSummaryAppService` BIZ-PAY-BATCH 推送 + 联动 C-08 模式 | Sprint 8a Day 5 | NC 部分成功 schema 完整化沿用 |
| `Hangfire RecurringJob` 注册 + Handler 类 | Sprint 8a Day 6 | R-06/R-07/R-08 真 Detector 接通占位 Job |
| `sub_group_id 守护单测`（反射扫派生类）| Sprint 2 V0.2 D5-4 | R-06/R-07/R-08 ReportAlert 自动覆盖 |
| Codex 评审工作流（spawn + finding 列给 cici）| Sprint 5a/7a/8a | Sprint 8a 4 commits 补评 + Sprint 9a 新模块评 |

---

## 七、版本沿革

| 版本 | 日期 | 主要变更 |
|---|---|---|
| V0.1 | 2026-05-13 | 首版草案，基于 Sprint-8a-Demo-V0.1 D10-4 验收物起。范围 7 类候选：A 09 详设升版 / B R-06/R-07/R-08 Detector / C AI Tool 骨架 / D 技术债扫尾 / E Sprint 8a Codex 评审补评 / F Web.Tests 项目 / G E2E + Demo + Sprint 10a 草案，约 12.5 PD（需收口到 10 PD）。5 决策点待评审。Sprint 8a 决策点接收记入 §四（8 项）。 |
| V0.2 | 2026-05-13 | **锁版**（cici 评审通过）。5 决策点全部收口：1A 双字段补强 / 2A R-07 实时触发 / **3B AI 多 Tool 接口** / 4A NC 详细 schema / 5A 评 Sprint 8a 全 4 commits。工时 12.5 → 11 PD（含 0.5 buffer）：§1.1 C AI Tool 3→2 PD（-1）+ §1.1 D 技术债 1.5→1 PD（-0.5）。Sprint 9a 立即进入实施，Day 1 起步 09 详设升版 + Codex 4 commits 补评（待配额恢复 11:56 PM 后跑）。 |
