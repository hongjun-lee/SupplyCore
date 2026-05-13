# Sprint 8a 任务卡 — 库存联动 line 级收口 + C-09 NC 批次推送 + R-05/Hangfire + 合同/支付补强（V0.2）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（评审后锁版 / 实施基线）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（实施基线）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 8a（预估 10 工作日 / 约 2 周）
**并行轨道：** 与 Sprint 8b 设备运维 AI 深化 平行进行（详 [`Sprint-8b-任务卡-V0.1.md`](./Sprint-8b-任务卡-V0.1.md) — b 已起草，待 cici 评审锁版）

**衔接文档：**

- 上游 Sprint → [`Sprint-7a-任务卡-V0.2.md`](./Sprint-7a-任务卡-V0.2.md) / [`Sprint-7b-任务卡-V0.1.md`](./Sprint-7b-任务卡-V0.1.md)
- 详设依据：06 V1.1 §4.10/§4.11（S-13/S-14）/ 05 V1.3 §4.9/§4.10（C-09/C-10）/ [`09-报表预警详细设计-V0.1.md`](../详细设计/09-报表预警详细设计-V0.1.md) / 07 V1.0b §5.13（E-13 折旧）
- Sprint 7a/7b 落地基线 → a Sprint 7a Day 8 EF 层批量 commit `6c71293` / b Sprint 7b Day 4 commit `fc00968`
- 测试基线 **870 全过**（Sprint 7a/7b 同步 push 后）

---

## 一、目标与范围

### 1.1 V0.2 锁版范围（10 PD 严卡）

Sprint 7a 闭环 S-13/S-14/S-21 库存余额 + C-09/C-10 付款后续 + R-04 PaymentDueNear 起步；Sprint 7b 闭环设备运维 4 大场景 + E-13 折旧起步。Sprint 8a 把"Sprint 5-7 累计技术债 + 顺延项 + 报表预警调度框架"统一收口。

**A. Sprint 5-6 库存联动 TODO 收口（line 级，~4 PD）**

- Sprint 5a/6a/7a 累计 6+ 处单据库存联动当时按"单据头 + 单行简化"做（Sprint 7a Day 2-2/3 跳过 line 级）；本期改为 line 级全做
- 涉及单据：S-05 PurchaseReceipt / S-06 PurchaseReturn / S-09 MaterialIssuance / S-10 StockReturn / S-12 StockTransfer（5 处）
- 改动模式：每个单据 CreateDto 加 Lines 数组（多行）+ ApplyDelta 按 line 多次调用 + 每行写 1 行 S-21 StockTransaction
- **重点价值**：库存余额 + 流水从"头级"升级到"line 级"，与详设 06 §4.X.2 line 字段表完全对齐；消化 Sprint 7a §1.5 已记录的 6+ 处备忘

**B. C-09 PaymentBatch 批次推送 + NC BIZ-PAY-BATCH 接口（~2 PD）**

- Sprint 7a 决策点 2B 顺延项收尾：本期 C-09 仅实体落 → 接 NC 批次推送
- NC BIZ-PAY-BATCH stub 接入（沿用 BIZ-PAY 模式 + 失败 / 部分成功回执处理）
- C-09 → C-08（多对一）回写 NC 凭证号 + 推送状态

**C. R-05 BondReleaseNear + Hangfire 调度框架（~2.5 PD）**

- Sprint 7a 决策点 4B 顺延项收尾 + Sprint 7b 决策点 4B 顺延项（E-13 折旧月度调度）合并
- BondReleaseNearDetector Domain Service（按 09 V0.1 §4.2 草拟）+ ReportAlert.CreateBondReleaseNear 工厂方法
- Hangfire 调度框架引入（Volo.Abp.BackgroundJobs.Hangfire 或 Hangfire.AspNetCore 直接接入）
- 5 个 RecurringJob 注册：R-04 / R-05 / R-06（候选）/ R-07（候选）/ R-08（候选）+ E-13 月度折旧

**D. C-02 PaidAmount 字段 + 合同推进到"已完成"联动（~1 PD）**

- Sprint 7a Day 5 备忘消化：C-02 加 PaidAmount 累计字段（与 ContractAmount 对比判定完成）
- C-10 PaymentExecution 实付回执触发 → C-02.PaidAmount += 实付金额
- 当 C-02.PaidAmount ≥ C-02.ContractAmount × 95%（SY-02 阈值）且无未完成 C-04 节点 → 候选自动推进到 ContractState = 已完成（业务审批节点暂保留人工确认）
- 不阻塞 C-10 完整化，但减少人工跟单成本

**E. C-08 加"支付退回"状态（~0.5 PD）**

- Sprint 7a Day 5 备忘消化：C-08 PaymentRequest 当前 5 状态（草稿/已审/已支付/已驳回/已取消），缺"支付退回"
- C-10 NC 支付失败回执时触发 C-08.RefundPayment → 状态从"已支付" → "支付退回"
- 影响：C-07 PaymentPlan 已统计的累计金额需回退（CumulativePaidAmount -= 退回金额）
- 守护：仅"已支付" → "支付退回" 允许；"支付退回" 不可再二次转换（终态）

**F. D9/Demo/Sprint-9a 草案（~1 PD）**

- 全量回归 ≥ 920 通过（基线 870 + 8a 新增 ~50）
- Sprint-8a-Demo 脚本
- Sprint-9a 任务卡草案

### 1.2 V0.2 评审决策点（已锁版 — cici 一次性 Y 通过全推荐版本 A/A/A/A/A）

| # | 决策点 | 锁版结论 | 理由 |
|---|--------|----------|------|
| 1 | 5 处单据 line 级范围 | A. 5 处全做（S-05 / S-06 / S-09 / S-10 / S-12）/ B. 简化只做 2 处（S-05 + S-09）其余顺延 Sprint 9a | **A — 全做（线级 4 处：S-05/S-09/S-10/S-12，S-06 顺延 9a）** | Sprint 5-7 累计 6+ 处 TODO 一次性消化（S-06 已有 NC BIZ-RED 模式简单；分批次只增加上下文切换成本；模式同（CreateDto Lines + ApplyDelta loop + S-21 N 行）|
| 2 | C-09 NC 推送范围 | A. 完整 BIZ-PAY-BATCH 接入 + 失败 / 部分成功 / 重推 / 幂等四要素 / B. 仅 BIZ-PAY-BATCH stub（不实装失败 / 部分成功）顺延 Sprint 9a | **A — 完整 BIZ-PAY-BATCH + 失败 / 部分成功 / 重推 / 幂等** | 沿用 BIZ-PAY 模式工时 2 PD 内可控；批次推送是 C-09 价值核心，stub 化无意义 |
| 3 | R-05 范围 | A. 完整 R-05 BondReleaseNear + Hangfire 调度框架 + 5 个 RecurringJob 注册 / B. 仅 R-05 实施（Hangfire 顺延 Sprint 9a 接）| **A — 完整 R-05 + Hangfire（仅 R-04/R-05 RecurringJob，其他留 skeleton）** | R-05 单独无价值（手工触发与 R-04 重复成本）；Hangfire 接入 ~1 PD 内可控；与 Sprint 7b E-13 折旧月度调度合并落地 |
| 4 | C-02 PaidAmount 字段加在 Sprint 8a 还是 Sprint 9a | A. 加在 Sprint 8a / B. 顺延 Sprint 9a | **A — Sprint 8a 加** | 不阻塞 C-10 完整化，但减少人工跟单成本；工时仅 1 PD；C-10 已 Sprint 7a Day 5 落地，本期联动改动小 |
| 5 | 与 b 集成测试边界 | A. a 不依赖 b（沿用 Sprint 6/7 §5A）/ B. a 需要 b 的 E-13 折旧 Hangfire 调度框架共享 | **A — 不依赖（与 6/7 §5A 对称）** | Sprint 6/7 双轨 5A 经验稳；Hangfire 框架 a/b 都用但各自注册各自 Job；共享 DI 配置即可 |

**总工时调整**（V0.1 12 PD → V0.2 10 PD 严卡，cici 选 A/A/A/A/A 全推荐版本）：

为保 10 PD 严卡，子任务范围微调（推荐版本下 -2 PD）：
- **§A line 级范围降到 4 处**（S-05 / S-09 / S-10 / S-12，去 S-06 退货因 Sprint 5a 已有 NC BIZ-RED 模式简单可顺延 Sprint 9a）= **-1 PD**
- **§C Hangfire RecurringJob 仅注册 2 个**（R-04 PaymentDueNear + R-05 BondReleaseNear，其他候选 R-06/R-07/R-08 仅留 Detector skeleton 不注册 Job）= **-1 PD**
- 总计 **-2 PD** → V0.2 严卡 **10 PD ✓**

### 1.3 不在范围

- Sprint 8b 设备 AI 预警 + 智能调度（独立轨道）
- AI 报表智能建议（Sprint 9+ 大模块）
- 09 详设 V0.1 → V1.3 升版（合并 V0.1 实施口径 + V1.2 业务全景，Sprint 8a 收尾时由 a 推动）
- R-06 / R-07 / R-08 完整 Detector 实施（本期仅 Hangfire 调度框架预留 RecurringJob 槽位 + 草拟 Detector skeleton）
- 招采平台真接补强（Sprint 7a Day 9 已实施）

### 1.4 基线

- ✅ Sprint 7a Day 1-10 完成（commit `24f0f07..09cd0b3` + Codex 修复 `4e2c61a` + `192975e` + Demo-7a `9ef16eb`）
- ✅ Sprint 7b Day 1-10 完成（commit `fc00968..2857cd5` + Demo-7b `704dd31`）
- ✅ EF migrations 实际 48+ 条全部 apply（Sprint 7a 加 Wave 56-61 合并 1 + Codex P2-1 修复 1 / Sprint 7b 加 Wave 49-53 + LeaseBilling fields = 共 7 个 migration）
- ✅ sub_group_id 守护单测自动覆盖 Sprint 7a/7b 新增 14+ 实体（StockBalance/14/21 + C-09/C-10 + R-04 ReportAlert + E-07/E-08/E-06 BreakdownRequest/SparePart/Scrapping + EquipmentStatusChange + EquipmentDepreciation 等）
- ✅ Codex 评审落地（Sprint 7a 首次启用 `codex review` 自动评审；闭环 P1 + P2 finding）
- ✅ 测试基线 **929 全过**（Domain 609 / Application 310 / EFCore 10）
- ✅ 测试基线 **870 全过**
- ⚠️ Sprint 7a Day 9-10 / Sprint 7b Day 5-10 尚未完成（Day 9 集成 E2E + Day 10 Demo + Sprint-8a/Sprint-8b 草案）— Sprint 8a 起步前需完成

### 1.5 完成标准（Sprint 8a 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 920 通过（基线 870 + 8a 新增 ~50）
- [ ] 新增 EF migrations 4-6 条：Add_S05_S06_S09_S10_S12_Lines（5 表 line 级改造合并一个 wave）/ Add_C09_NC_PushFields / Add_C02_PaidAmount / Add_C08_RefundedState_Enum / Add_ReportAlertScanLog（候选）
- [ ] Sprint 7a 决策点 2B 接收消化（C-09 NC BIZ-PAY-BATCH 推送实装）
- [ ] Sprint 7a 决策点 4B 接收消化（R-05 + Hangfire 调度框架）
- [ ] Sprint 7a Day 2-2/3 跳过项接收消化（5 处单据 line 级库存联动）
- [ ] Sprint 6 / 7a 累计备忘消化（C-02 PaidAmount / C-08 支付退回 / 库存 6+ TODO）
- [ ] Sprint 7b 决策点 4B 接收消化（E-13 折旧 Hangfire 月度调度）
- [ ] Sprint8a_LineLevelStockTransaction_E2E + Sprint8a_PaymentBatchNc_E2E + Sprint8a_HangfireScheduler_E2E 通过
- [ ] Sprint-8a-Demo 入库
- [ ] **b 集成回归**：与 b 主分支 merge 全量回归

---

## 二、按日任务拆解（V0.1 草案，12 PD）

### Day 1-4 — Sprint 5-7 库存联动 line 级收口（~4 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | S-05 PurchaseReceipt 加 Lines 数组（多行 receipt_line）+ ApplyDelta loop + S-21 N 行落账（采购入库）+ Wave 62 migration | 06 V1.1 §4.4.2（S-25 line 字段表）| line 级单测 ≥ 6 |
| D1-2 | S-05 CreateDto / UpdateDto / 5 endpoint AppService Lines 字段支持 + 校验 line 数量、批次、货位等 | — | AppService 单测 ≥ 4 |
| D2-1 | S-06 PurchaseReturn 加 Lines 数组（红字冲销 line 级）+ ApplyDelta loop + S-21 N 行落账 + Wave 63 | 06 V1.1 §4.5.2（S-29 line）| line 级单测 ≥ 5 |
| D2-2 | S-09 MaterialIssuance 加 Lines 数组（出库 line 级 + 批次 FIFO 校验 per line）+ ApplyDelta loop + S-21 N 行 + Wave 64 | 06 V1.1 §4.10.2（S-27 line）| line 级单测 ≥ 6 含批次 FIFO |
| D3-1 | S-10 StockReturn 加 Lines 数组（退料 line 级 + 原出库 line 追溯）+ ApplyDelta loop + S-21 N 行 + Wave 65 | 06 V1.1 §4.11.2（S-30 line）| line 级单测 ≥ 5 |
| D3-2 | S-12 StockTransfer 加 Lines 数组（调出 + 调入双边 line 级）+ ApplyDelta loop 双边 + S-21 调出 N 行 + 调入 N 行 + Wave 66 | 06 V1.1 §4.13.2（S-28 line）| line 级单测 ≥ 6（含双边）|
| D4-1 | line 级集成单测：S-05 多行入库 → S-13/S-14 多 batch 同时累计 → S-09 多行 FIFO 出库 → S-13/S-14 多 batch 同时扣减 → S-21 流水按 line 完整 | — | E2E 单测 ≥ 3 |
| D4-2 | line 级守护：CreateDto Lines 数组不可为空 / line 数量与汇总数量一致 / line.material_id ∈ org.warehouse 物料范围 | — | 守护单测 ≥ 6 |

### Day 5-6 — C-09 PaymentBatch NC 推送 + Hangfire 调度框架（~2 + 1 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D5-1 | C-09.PushToNcAsync 接入 NcInterfaceService.PushAsync("BIZ-PAY-BATCH", ...)；沿用 BIZ-PAY 模式 + 失败 / 部分成功 / 重推 / 幂等四要素 | 05 V1.3 §4.9 + Sprint 7a 决策点 2B 接收 | 单测 ≥ 6（含 4 种失败场景）|
| D5-2 | C-09 加 InterfacePushState / NcVoucherNo / IdempotentKey / PushErrorMessage 字段 + Wave 67 NC 接口字段补强 | 05 V1.3 BIZ-PAY 模式 | EF 单测 ≥ 2 |
| D5-3 | C-09 → C-08（多对一）回写 NC 凭证号 + 推送状态（C-08 在 C-09 推送成功后由"待推送" → "已推送"批量推进）| 05 V1.3 §4.9 + §4.8 联动 | 联动单测 ≥ 3 |
| D5-4 | C-09 失败 / 部分成功回执处理：批次内 N 个 C-08 部分成功时，标记成功的为"已推送"，失败的回滚到"已审" + 写 push_error_message | — | 单测 ≥ 3 |
| D6-1 | Hangfire 包引入 + DI 注入 + appsettings 配置（数据库 vs 内存模式 + Dashboard 启用 vs 仅 API）+ 1 个 spike RecurringJob 验证（如"每分钟 log 一次"）| — | Hangfire Dashboard 可访问 + spike Job 跑通 |
| D6-2 | Hangfire 5 个 RecurringJob 注册（R-04 / R-05 / E-13 月度 + R-06/R-07/R-08 候选 skeleton）+ 共享 DI 配置（与 b E-13 折旧月度同 Hangfire 实例）| 09 V0.1 §5.2 | 注册单测 ≥ 2 + 各 Job 手工触发跑通 |

### Day 7 — R-05 BondReleaseNear Detector + ReportAlert 完整化（~1.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D7-1 | BondReleaseNearDetector Domain Service（沿用 PaymentDueNearDetector 模式）：扫描 C-02.bond_amount > 0 + bond_release_state ∈ {未释放, 部分释放} + bond_release_date < TODAY + 90 → 触发 R-05 | 09 V0.1 §4.2 | 单测 ≥ 6（空集 / 已超期 / 7 天 / 30 天 / 90 天边界 / Released 跳过）|
| D7-2 | ReportAlert.CreateBondReleaseNear 工厂方法 + AlertContent JSON 字段集（contractId / supplierId / bondAmount / bondReleaseDate / bondReleaseState / daysToRelease）| 09 V0.1 §4.2 | 实体单测 ≥ 3 |
| D7-3 | ReportAlert 加去重判定逻辑（同 alert_code + source_bill_type + source_bill_id 在 dedup_hours 窗口内 + state = 待处理 → 跳过）+ SY-02 字典硬编码（PAYMENT_DUE_ALERT_DAYS / BOND_RELEASE_ALERT_DAYS / INVENTORY_LOW_STOCK_DEDUP_HOURS）| 09 V0.1 §6.1 | 去重单测 ≥ 4 |
| D7-4 | ReportAlert AppService（4 endpoint：Get / List by org+code+state + page / MarkHandled / MarkIgnored）+ Controller（Sprint 7a 留的）| — | AppService 单测 ≥ 5 |

### Day 8 — C-02 PaidAmount + C-08 支付退回 + 集成 E2E（~1 + 0.5 + 1 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D8-1 | C-02 Contract 加 PaidAmount decimal 字段 + Wave 68；C-10 PaymentExecution 接收时触发 Contract.AddPayment(amount) → PaidAmount += amount | 05 V1.3 §4.2 + Sprint 7a Day 5 备忘 | 单测 ≥ 4 |
| D8-2 | Contract.PaidAmount ≥ ContractAmount × 95%（SY-02 `CONTRACT_COMPLETION_THRESHOLD_RATE` 阈值）且无 C-04 节点 state ≠ 已完成 → Contract.MarkReadyForCompletion（候选状态，等待人工 ApproveCompletion）| 05 V1.3 §4.2 状态机扩展 | 联动单测 ≥ 3 |
| D8-3 | C-08 PaymentRequest 加"支付退回"状态（PaymentRequestStates.Refunded）+ Wave 69（如需 enum constraint 改）；C-08.RefundPayment(reason) transition：已支付 → 支付退回（终态）| 05 V1.3 §4.8 状态机扩展 | 状态机单测 ≥ 4 |
| D8-4 | C-08.RefundPayment → C-07 PaymentPlan.CumulativePaidAmount -= 退回金额 + PlanState 重新评估（已满足 → 部分付款 / 部分付款 → 未支付）| 05 V1.3 §4.7.3 联动 | 联动单测 ≥ 3 |
| D8-5 | Sprint8a_LineLevelStockTransaction_E2E：S-05 多行入库 → S-09 多行 FIFO 出库 → S-10 多行退料 → S-12 多行调拨 → S-13/S-14/S-21 全数据校验 | — | E2E 通过 |
| D8-6 | Sprint8a_PaymentBatchNc_E2E：C-08 批 N 单已审 → C-09 创建批次 → PushToNcAsync 成功 / 部分成功 / 全失败 3 场景 → C-08 状态正确回写 | — | E2E 通过 |

### Day 9 — Hangfire 调度 E2E + 集成回归（~1 PD）

| # | 任务 | 验收 |
|---|------|------|
| D9-1 | Sprint8a_HangfireScheduler_E2E：Hangfire 启动 → 5 RecurringJob 注册成功 → 手工触发 R-04/R-05 Detector → ReportAlert 落库且 alert_code 正确 + 去重生效 | E2E 通过 |
| D9-2 | sub_group_id 守护单测自动覆盖 a 新增实体（S-05 Line / S-06 Line / S-09 Line / S-10 Line / S-12 Line）— line 实体也带 SubGroupId 复制自单据头 | 守护 0 失败 |
| D9-3 | 全量回归 ≥ 920 通过 | 0 失败 |
| D9-4 | **与 b 主分支 merge 集成回归**：本地 merge b 最新 push 后再跑一次全量（Hangfire 共享实例 b E-13 月度 RecurringJob 不冲突）| 集成 0 失败 |

### Day 10 — Demo + Sprint 9a 草案（~0.5 PD）

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 920 通过 | 0 失败 |
| D10-2 | Sprint 1-7 Demo 用例回归 + Sprint 8a 新增 32-38（5 处 line 级 / C-09 批次 / R-05 / Hangfire / C-02 PaidAmount / C-08 退回）| 全 200 OK |
| D10-3 | 写 `Sprint-8a-Demo-脚本-V0.1.md` | 入库 |
| D10-4 | 起 Sprint 9a 任务卡草案：09 详设 V0.1 + V1.2 合并 V1.3 + R-06/R-07/R-08 完整化 + AI 报表智能建议起步 + Sprint 5-8 累计技术债扫尾 | `Sprint-9a-任务卡-V0.1.md` 草案 |

**Sprint 8a V0.1 总工时（草案）：** 4 + 2 + 1 + 1.5 + 1 + 0.5 + 1 + 1 + 0.5 = **12 PD**（超 10 PD 上限 → 待评审收口）

**收口候选**：
- 决策点 1B（line 级简化 2 处）= -2 PD
- 决策点 2B（C-09 stub 化）= -1 PD
- 决策点 3B（Hangfire 顺延）= -1 PD
- 决策点 4B（C-02 PaidAmount 顺延 Sprint 9a）= -1 PD
- 总计可压缩到 **10 PD ✓**

> 推荐版本（决策点 1A/2A/3A/4A/5A 全做）若评审通过，则需在 Day 9 集成 E2E 中做适度合并（Sprint8a_LineLevelStockTransaction_E2E + Sprint8a_PaymentBatchNc_E2E + Sprint8a_HangfireScheduler_E2E 三合一），并把 R-06/R-07/R-08 RecurringJob skeleton 严格降级为"仅占位空 Job 注册"，预估可压缩到 10.5 PD。

---

## 三、Sprint 9a 衔接

| 候选范围 | 详设依据 | 估计 PD |
|---|---|---|
| 09 详设 V0.1 + V1.2 合并 V1.3（统一编号体系 + 业务全景 + 实施口径）| 09 详设升版 | ~1.5 |
| R-06 ContractExpiryNear + R-07 InventoryLowStock + R-08 InventoryNearExpiry 完整化（含业务事件实时触发 R-07）| 09 V0.1 §4.3-4.5 | ~3 |
| AI 报表智能建议起步（基于 C-07 / R-04 / R-05 历史 + Tool 接口骨架）| 09 V1.2 §七 + 11 详设 | ~3 |
| Sprint 5-8 累计技术债扫尾（如 SY-02 字典化全量 / NC 接口 idempotent 增强）| — | ~1.5 |
| Sprint 8a 顺延项（如决策点 1B/2B/3B/4B 任一）| — | ~1 |

---

## 四、Sprint 6 / 7a / 7b 决策点接收（来自上游收尾报告）

Sprint 6-7 完成阶段识别的决策点与备忘（任务卡 V0.2 §四 + Demo §六 + 实施备忘）：

| 备忘 | 来源 | 本 Sprint 处理时机 |
|---|---|---|
| Sprint 7a 决策点 2B 顺延：C-09 NC BIZ-PAY-BATCH 推送（Sprint 7a 仅实体落）| Sprint 7a V0.2 §1.2 决策点 2B | **本 Sprint Day 5 处理（A-B 子任务）** ✅ |
| Sprint 7a 决策点 4B 顺延：R-05 BondReleaseNear + Hangfire 调度（Sprint 7a 仅 R-04）| Sprint 7a V0.2 §1.2 决策点 4B | **本 Sprint Day 6-7 处理（C 子任务）** ✅ |
| Sprint 7a Day 2-2/3 跳过项：5 处单据 line 级库存联动（S-05/S-06/S-09/S-10/S-12 当时仅头级实施）| Sprint 7a Day 2-2/3 实施备忘 | **本 Sprint Day 1-4 处理（A 子任务）** ✅ |
| Sprint 6 / 7a Day 5/7 累计备忘：C-02 PaidAmount 字段 + 合同推进到"已完成"联动 | Sprint 7a Day 5 实施备忘 | **本 Sprint Day 8 处理（D 子任务）** ✅ |
| Sprint 7a Day 5 累计备忘：C-08 加"支付退回"状态（C-10 支付失败回退）| Sprint 7a Day 5 实施备忘 | **本 Sprint Day 8 处理（E 子任务）** ✅ |
| Sprint 5-6 累计 6+ 库存联动 TODO（"留 Sprint 7a 接 S-13 / 后续 Sprint"）| Sprint 5a/5b/6a/6b 累计备忘 | **本 Sprint Day 1-4 处理（A 子任务）合并消化** ✅ |
| Sprint 7b 决策点 4B 顺延：E-13 折旧 Hangfire 月度调度（Sprint 7b 仅落实体 + 手工触发）| Sprint 7b V0.1 §1.2 决策点 4 | **本 Sprint Day 6 处理（C 子任务 Hangfire 共享框架）** ✅ |

---

## 五、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 5 处单据 line 级改造 EF migration 体量大（每张表加 line 子表 + FK + 索引）| 高 | D1-D3 工时超估 | D1-1 第一动作做 1 表 spike（S-05 / S-25），验证 wave 模式 + 索引方案后批量 |
| C-09 NC BIZ-PAY-BATCH 部分成功回执 + 幂等四要素复杂度高 | 中 | D5-1 / D5-4 工时超估 | D5-1 先建 4 场景测试用例（全成功 / 全失败 / 部分成功 / 重推冲突）再编码；沿用 BIZ-PAY 失败处理模式严格对齐 |
| Hangfire 接入 Volo.Abp.BackgroundJobs.Hangfire vs Hangfire.AspNetCore 选型不确定 | 中 | D6-1 选错返工 | D6-1 第一动作做选型 spike：①检测 Volo.Abp.BackgroundJobs.Hangfire 是否兼容 SubGroupId 多租户；②若兼容用 Volo；③不兼容则 Hangfire.AspNetCore 直接接（DI 自行处理多租户）|
| R-05 BondReleaseDate 来源不确定（C-02 是否已有 BondReleaseDate 字段，Sprint 4 D5 落地范围核查）| 中 | D7-1 阻塞 | D7-1 第一动作 audit C-02 表结构：若已有则直接用，未有则同步加字段（Wave 70）|
| C-02 PaidAmount 累计与 C-07 PaymentPlan CumulativePaidAmount 双口径风险（两处累加可能不一致）| 中 | D8-1 / D8-4 口径偏差 | D8 加 daily reconciliation 单测：C-02.PaidAmount = SUM(C-07.CumulativePaidAmount where ContractId = X)；如发现偏差立即 fail |
| C-08 支付退回触发 C-07 状态回退（已满足 → 部分付款 → 未支付）逻辑复杂 | 中 | D8-4 边界 case 漏 | D8-4 单测覆盖 5 边界：单笔退回 / 多笔累计退回 / 全退回 / 部分退回 / 退回 + 重新支付 |
| Wave 编号撞车（a 8a 用 62-70；b 8b 待定）| 中 | EF 迁移冲突 | 预分配 a=62-72 / b=73-85；越界前同步 |
| 与 b Hangfire 共享实例可能 RecurringJob 命名冲突 | 中 | D9-4 集成失败 | RecurringJob ID 加前缀 `a.` / `b.`（如 `a.ReportAlert.PaymentDueNear.Daily` / `b.EquipmentDepreciation.Monthly`）|

**Wave 编号约定（更新）**：

- a 轨道 Wave 62-72（Sprint 8a 候选 9-11 个 migration）
- b 轨道 Wave 73-85（Sprint 8b 候选 ~12 个 migration）

---

## 六、可复用资产

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | S-05 / S-06 / S-09 / S-10 / S-12 line 实体继承（与单据头共享审计字段）|
| 双轨 SubGroupId 钩子（C-02 复制 / OrgId 反查）| Sprint 3 D7-2 | 5 类 line 实体从单据头复制 SubGroupId；ReportAlert 从 source bill 复制 |
| `INcInterfaceService.PushAsync` + BIZ-PAY 模式 | Sprint 6a Day 8 | C-09 BIZ-PAY-BATCH 沿用 + push_error_* 失败不阻断 |
| `IStockBalanceUpdater.ApplyDelta` 库存变更统一入口 | Sprint 7a Day 2-1 | 5 处单据 line 级改造继续沿用，每行调用一次 |
| sync `.ToList()` 单测 mock 友好模式 | Sprint 5a Codex 评审 m-3 | BondReleaseNearDetector 沿用（与 PaymentDueNearDetector 镜像）|
| `ReportAlert.CreateXxx` 工厂方法 + AlertContent JSON 模式 | Sprint 7a Day 7 | R-05 CreateBondReleaseNear 同模式 |
| `PaymentDueNearDetector` Domain Service 模式 | Sprint 7a Day 7 | BondReleaseNearDetector / ContractExpiryNearDetector / InventoryLowStockDetector / InventoryNearExpiryDetector 镜像复制 |
| sub_group_id 守护单测（反射扫派生类）| Sprint 2 V0.2 D5-4 | a 新增 line 实体 + R-05 工厂自动覆盖，无需手工补 |
| 决策点接收记入 §四模式 | Sprint 5b → Sprint 6a → Sprint 7a | Sprint 7a → Sprint 8a 继续沿用，本期 §四 接收 7 项 |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，由 c 子代理 Sprint 7a Day 8 EF 层批量 push (`6c71293`) 后起。范围 6 类候选：A 5 处单据 line 级 / B C-09 NC 批次推送 / C R-05 + Hangfire 调度框架（含 E-13 月度 Job 共享）/ D C-02 PaidAmount 字段 + 完成联动 / E C-08 支付退回状态 / F 验收 + Sprint 9a 草案，约 12 PD（需收口到 10 PD）。5 决策点待评审锁版（倾向 A/A/A/A/A 全做）。Sprint 6/7 决策点接收记入 §四：(1) Sprint 7a 2B 顺延 C-09 NC 推送 → Day 5；(2) Sprint 7a 4B 顺延 R-05 + Hangfire → Day 6-7；(3) Sprint 7a Day 2-2/3 跳过 line 级 → Day 1-4；(4) Sprint 7a Day 5 备忘 C-02 PaidAmount → Day 8；(5) Sprint 7a Day 5 备忘 C-08 支付退回 → Day 8；(6) Sprint 5-6 累计 6+ 库存 TODO → Day 1-4 合并；(7) Sprint 7b 4B 顺延 E-13 折旧 Hangfire → Day 6 共享框架。详设依据加入 09 V0.1（c 子代理本次同 commit 起草）。 |
| V0.2 | 2026-05-13 | 评审 5 决策点一次性按 cici Y 推荐版本锁版：(1) **A — line 级 4 处**（S-05/S-09/S-10/S-12，S-06 顺延 9a 因已有 NC BIZ-RED 模式）；(2) **A — 完整 BIZ-PAY-BATCH + 四要素**；(3) **A — R-05 + Hangfire 仅注册 R-04/R-05 RecurringJob，其他 Detector 留 skeleton**；(4) **A — C-02 PaidAmount Sprint 8a 加**；(5) **A — a 不依赖 b**（与 6/7 §5A 对称）。§1.1 范围标题更新到 "10 PD 严卡"；§1.2 决策点表（候选/倾向 → 锁版结论/理由）+ 子任务范围微调公式 -2 PD（§A 5→4 处 -1 + §C Hangfire RecurringJob 仅 2 个 -1） → 10 PD ✓。§1.4 基线更新到 Sprint 7a/7b 实际收尾 commit + Codex 评审落地（首次启用 `codex review` + P1/P2 闭环 commit `4e2c61a`+`192975e`）；测试基线 **929 全过**（Domain 609 / App 310 / EFCore 10）。§1.5 验收门保持 ≥ 980（基线 929 + ~50 新增）。Sprint 8a 即刻进入实施，按 Day 1 起步 S-05 line 级收口。|
