# Sprint 7a 任务卡 — 库存余额 + 付款流程后续 + 报表预警起步（V0.1 草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案，待评审锁版为 V0.2）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（草案）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 7a（预估 10 工作日 / 约 2 周）
**并行轨道：** 与 Sprint 7b 设备运维深化 平行进行（草案另立）

**衔接文档：**

- 上游 Sprint → [`Sprint-6a-任务卡-V0.2.md`](./Sprint-6a-任务卡-V0.2.md)
- 详设依据：06 §4.10/§4.11（S-13 / S-14）/ 05 §4.9/§4.10（C-09 / C-10）/ 09 报表预警（待详设）
- Sprint 6 a/b 落地基线 → commit `db3d8ea`（Sprint 6a Day 9 收尾，727 测试全过 = Domain 467 / App 250 / EFCore 10）

---

## 一、目标与范围

### 1.1 V0.1 候选范围（约 10 PD，待评审收口到 ~8-9）

Sprint 6a 闭环 C-04 → C-07 → C-08 付款链 + S-10/S-12 库存出入库前置。Sprint 7a 把"库存余额"和"付款后续"两条主线收口，同时启动 09 报表预警。

**A. S-13 StockBalance + S-14 StockJournal 库存余额（~3.5 PD）**
- S-13 StockBalance 库存余额表（详设 06 §4.10）：物料 × 仓库 × 批次 × 货位维度
- S-14 StockJournal 库存日记账（详设 06 §4.11）：每次库存变更落账（含来源单据类型 + ID）
- 回写 Sprint 5a/6a 累计字段：S-05 / S-06 / S-09 / S-10 / S-12 联动 S-13 + S-14
- **重点价值**：补齐 Sprint 5a-6a 留下的库存联动 TODO（"留 Sprint 7a 接 S-13 时实装"）

**B. C-09 PaymentBatch + C-10 PaymentReceipt 付款后续（~2.5 PD）**
- C-09 PaymentBatch 付款批次（详设 05 §4.9）：把多个 C-08 已审申请打包成一批推 NC
- C-10 PaymentReceipt 实付回执（详设 05 §4.10）：NC 实付回执 → 触发 C-08.MarkPaid + C-07 实际累计
- NC BIZ-PAY-BATCH stub + 失败 / 部分成功回执处理

**C. 招采平台真接 OAuth + Polly（~1.5 PD）**
- Sprint 6a Mock 实现 → Real 实现切换
- HttpClientFactory + OAuth bearer token（凭据已 Sprint 4 D9 拿到）
- Polly 重试 + 断路器 + 失败补偿任务

**D. 09 报表预警起步（~1.5 PD）**
- R-04 PaymentDueNear：C-07 plan_state ∈ {已满足,部分付款} 且 due_date < TODAY + 7 天 → 预警（详设 05 §4.7.3 §2）
- R-05 BondReleaseNear：C-02 履约保证金 90 天到期未退还 → 预警（Sprint 4 D5 履约保证金沿用）
- 报表预警表 R-XX 起步 + 调度框架（基础设施层，Sprint 8+ 接 Hangfire）

**E. 验收 + Sprint 8a backlog（~1 PD）**
- 全量回归 ≥ 780 通过（基线 727 + 7a 新增 ~55）
- Sprint-7a-Demo
- Sprint-8a 任务卡草案

### 1.2 V0.1 待评审决策点

| # | 决策点 | 候选方案 | 倾向 |
|---|--------|----------|------|
| 1 | S-13/S-14 范围 | A. 完整双表 + 全联动 / B. S-13 only（S-14 留 Sprint 8a） | A — 单表无意义；Sprint 5-6 库存联动 TODO 累计已经多个，必须一起做闭环 |
| 2 | C-09 PaymentBatch 范围 | A. 完整批次 + NC 推送 / B. 仅实体落，批次推送简化 | B — 批次推送复杂度高（事务一致性 + 部分失败回执），Sprint 8a 接 |
| 3 | 招采平台 OAuth 真接 | A. 本期实装 / B. 顺延 Sprint 8a | A — 凭据已拿到，Sprint 6a Mock 不实接积压成本累计 |
| 4 | 09 报表预警范围 | A. 完整 2 预警 + 调度 / B. 仅 R-04 PaymentDueNear / C. 顺延 Sprint 8a | B — 优先做最有业务价值的 R-04；R-05 / 调度 Sprint 8a |
| 5 | 与 b 集成测试边界 | A. a 不依赖 b / B. a 接 b 的 E-09 LeaseContract → C-08 联动 | A — Sprint 6 双轨 5A 经验稳；E-09 → C-08 联动留 Sprint 8 详设 V1.X 升版后做 |

### 1.3 不在范围

- Sprint 7b 设备运维深化（独立轨道）
- 实际 NC BIZ-PAY-BATCH 接入（本期 stub）
- AI 报表预警 / 智能建议（Sprint 8+ 大模块）
- 09 详设 V1.0 升版（本期仅起步 R-04，详设升版留 Sprint 8a）

### 1.4 基线（待 Sprint 6 收尾确认）

- ☐ Sprint 6a D10 commit 已 push + Demo-6a V0.1 入库
- ☐ Sprint 6b 全部任务收尾（含 Day 9 集成 E2E + Day 10 Demo）
- ☐ EF migrations 40 条全部 apply（Sprint 6a 加 4 + Sprint 6b 加 5）
- ☐ sub_group_id 守护单测覆盖 Sprint 6a/6b 新增 13 实体

### 1.5 完成标准（Sprint 7a 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 780 通过（基线 727 + 7a 新增 ~55）
- [ ] 新增 EF migrations 5-6 条：Add_StockBalance_S13 / Add_StockJournal_S14 / Add_PaymentBatch_C09 / Add_PaymentReceipt_C10 / Add_ReportAlert_R04（视决策点 4）
- [ ] Sprint 5a-6a 累计 6+ 处"库存联动留 Sprint 7a"备忘全部消化（S-05/S-06/S-09/S-10/S-12 → S-13/S-14）
- [ ] Sprint7a_StockBalance_E2E + Sprint7a_PaymentReceipt_E2E 通过
- [ ] 招采平台真接 OAuth 联调成功（Mock → Real DI 切换）
- [ ] Sprint-7a-Demo 入库
- [ ] **b 集成回归**：与 b 主分支 merge 全量回归

---

## 二、按日任务拆解（V0.1 草案，10 PD）

### Day 1-3 — S-13 StockBalance + S-14 StockJournal（~3.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | S-13 StockBalance 实体（FK→M-05 / M-02 / M-15 / M-03B，复合主键 MaterialId/WarehouseId/BatchId/LocationId）+ Wave 49 + migration | 06 §4.10 | 单测 ≥ 6 |
| D1-2 | S-14 StockJournal 实体（每次库存变更落 1 行 + 来源单据 type/id）+ Wave 50 + migration | 06 §4.11 | 单测 ≥ 5 |
| D2-1 | StockBalanceManager.ApplyDelta(...) Domain Service：所有库存变更入口（增/减/初始化）+ 同步落 S-14 日记 | — | 单测 ≥ 5 |
| D2-2 | S-05 入库 → ApplyDelta + 写 S-14（receipt_type=采购入库 / 让步入库）联动 | Sprint 5a 备忘消化 | 联动单测 |
| D3-1 | S-06 / S-10 退货退料 → ApplyDelta 负 + S-09 累计退料量回写 | Sprint 6a 备忘消化 | 联动单测 |
| D3-2 | S-09 领料出库 → ApplyDelta 负 + S-13 库存可用量前置校验（领料数量 ≤ 当前余量）| Sprint 5a 备忘消化 | 单测 ≥ 3 含负向 |
| D3-3 | S-12 跨组织调拨 → 双边 ApplyDelta（调出负 + 调入正）+ S-21 调拨事务流水 | Sprint 6a 备忘消化 | 联动单测 |

### Day 4-5 — C-09 / C-10 付款后续 + 招采平台真接（~2.5 + 1.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D4-1 | C-09 PaymentBatch 实体（决策点 2B 简化版：仅实体 + 状态机，批次推送 Sprint 8a）+ Wave 51 + migration | 05 §4.9 | 单测 ≥ 5 |
| D4-2 | C-10 PaymentReceipt 实付回执实体 + Wave 52 + migration | 05 §4.10 | 单测 ≥ 5 |
| D4-3 | C-10.Receive → 触发 C-08.MarkPaid + C-07 累计回写 ApplyPayment（如本期未已联动）| 05 §4.10 业务规则 | 联动单测 ≥ 2 |
| D5-1 | 招采平台真接：RealTenderPlatformApiService 实现（HttpClientFactory + OAuth + Polly + 失败补偿）| 04 §4.13 + 平台 API 文档 | E2E 真接通过 1 次 |
| D5-2 | DI 切换：appsettings.json 决定 Mock vs Real（沿用 INcInterfaceService 模式）| — | 配置可读 + 单测兼容 |

### Day 6-7 — Sprint 5-6 库存联动 TODO 收尾 + 09 报表预警起步（~1 + 1.5 PD）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D6-1 | Sprint 5a S-05 累计 invoice_arrived 回写（让步入库联动收尾）| Sprint 5a 备忘 | 联动单测 |
| D6-2 | Sprint 6a S-12 双边库存联动 + S-09 累计 returned_quantity 回写 | Sprint 6a 备忘 | 联动单测 |
| D7-1 | 09 详设 R-04 PaymentDueNear 实体（report_alert 表，simple version）+ Wave 53 + migration | 09 详设草拟 | 单测 ≥ 5 |
| D7-2 | C-07 plan_state IN ('已满足','部分付款') + due_date < TODAY + 7 触发 R-04 写入 | 05 §4.7.3 §2 | 联动单测 ≥ 2 |

### Day 8 — 集成 E2E + 守护单测（~1 PD）

| # | 任务 | 验收 |
|---|------|------|
| D8-1 | Sprint7a_StockBalance_E2E：S-05 → S-13 + S-14 落账 → S-09 领料 → S-13 扣减 → S-10 退料 → S-13 回补 | E2E 通过 |
| D8-2 | Sprint7a_PaymentReceipt_E2E：C-08 已审 → C-10 实付回执 → C-08 已支付 + C-07 实际累计 | E2E 通过 |
| D8-3 | sub_group_id 守护单测自动覆盖 a 新增 5 实体（S-13/S-14/C-09/C-10/R-04）| 守护 0 失败 |
| D8-4 | 全量回归 ≥ 780 通过 | 0 失败 |

### Day 9 — 招采平台真接联调 + 集成回归（~1 PD）

| # | 任务 | 验收 |
|---|------|------|
| D9-1 | 招采平台 RealTenderPlatformApiService 真接联调（OAuth + batch 拉取 50+ 投标响应）| 真接 200 OK |
| D9-2 | 失败补偿 + Polly 重试单测 | 单测 ≥ 3 |
| D9-3 | **与 b 主分支 merge 集成回归**：本地 merge b 最新 push 后再跑一次全量 | 集成 0 失败 |

### Day 10 — Demo + Sprint 8a 草案（~0.5 PD）

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 780 通过 | 0 失败 |
| D10-2 | Sprint 1-6 Demo 用例 1-27 回归 + Sprint 7a 新增 28-31（S-13/S-14/C-10/R-04）| 全 200 OK |
| D10-3 | 写 `Sprint-7a-Demo-脚本-V0.1.md` | 入库 |
| D10-4 | 起 Sprint 8a 任务卡草案：C-09 批次推送 + AI 报表预警 + 招采平台真接补强 | `Sprint-8a-任务卡-V0.1.md` 草案 |

**Sprint 7a V0.1 总工时（草案）：** 3.5 + 2.5 + 1.5 + 1 + 1.5 + 1 + 1 + 0.5 = **12.5 PD**（超 10 PD 上限 → 待评审收口）

**收口候选**：
- 决策点 2B 落地（C-09 简化）= -0.5 PD
- 决策点 4B 落地（R-05 / 调度顺延）= -1 PD
- D9-1 招采平台真接联调可作为 buffer 时降级（Mock 维持，Sprint 8a 真接）= -1 PD
- 总计可压缩到 **10 PD ✓**

---

## 三、Sprint 8a 衔接

| 候选范围 | 详设依据 | 估计 PD |
|---|---|---|
| C-09 PaymentBatch 批次推送 + NC BIZ-PAY-BATCH | 05 §4.9 业务规则 | ~2 |
| R-05 BondReleaseNear + 报表调度框架（Hangfire 接入）| 09 详设升版 | ~2.5 |
| AI 报表智能建议起步（基于 C-07 历史 + R-04 触发频率分析）| 09 详设草拟 | ~2.5 |
| Sprint 7a 顺延 / 招采平台真接补强 | — | ~1.5 |

---

## 四、Sprint 6 决策点接收（来自 Sprint 6 收尾报告）

Sprint 6 完成阶段识别的 TODO（非 a 主路径但需记录）：

| 备忘 | 来源 | 处理时机 |
|---|---|---|
| S-09 累计退料量回写 + S-21 库存事务落账 | Sprint 6a Day 1-2 S-10 实施备忘 | 本 Sprint Day 3 处理 |
| S-12 双边库存联动 + S-21 调拨事务流水 | Sprint 6a Day 3 S-12 实施备忘 | 本 Sprint Day 3 处理 |
| C-04 → C-07 自动联动已完成（Sprint 6a Day 6）| — | 已交付 |
| C-08 → C-07 ApplyPayment 累计回写已完成（Sprint 6a Day 8）| — | 已交付 |
| C-10 NC 实付回执触发 C-08.MarkPaid 联动 | Sprint 6a Day 8 C-08 实施备忘 | 本 Sprint Day 4 处理 |
| 招采平台 Mock → Real 切换 | Sprint 6a Day 4-5 实施备忘 | 本 Sprint Day 5 处理（决策点 3）|

---

## 五、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| S-13 复合主键 EF 配置复杂 | 中 | D1 返工 | D1-1 第一动作做 EF tooling spike，提前发现 |
| S-13 联动 5 处单据（S-05/S-06/S-09/S-10/S-12）改动量大 | 高 | D2-D3 工时超估 | 拆 5 子任务并行 / 引入 IStockBalanceUpdater 抽象统一调用 |
| 招采平台 OAuth 凭据失效 | 中 | D5 / D9 阻塞 | D5 第一动作验证凭据；失效则降级 Mock 顺延 |
| C-07 ApplyPayment 已经在 Sprint 6a Day 8 落地，C-10 联动可能重复实施 | 中 | D4-3 设计冲突 | D4-1 前先 audit Sprint 6a 已落代码，明确分工 |
| Wave 编号撞车 | 低 | EF 表名重复 | 预分配 a=49-53 / b=51-55；越界前同步 |

---

## 六、可复用资产

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | S-13/S-14/C-09/C-10/R-04 继承 |
| 双轨 SubGroupId 钩子（C-02 复制 / OrgId 反查）| Sprint 3 D7-2 | S-13/S-14 从 S-05/S-06/S-09/S-10 复制 |
| `INcInterfaceService.PushAsync` + BIZ-PAY stub | Sprint 6a Day 8 | C-09 BIZ-PAY-BATCH 沿用模式 |
| sync `.Any()` 前置校验风格（Sprint 4 D7-8） | Sprint 4 评审纠错 | S-09 库存可用量前置同模式 |
| AsyncExecuter / sync LINQ 兼容（Sprint 5a Codex 评审 m-3）| Sprint 5a | 沿用 sync LINQ 单测 mock 友好 |
| C-04 → C-07 自动联动模式 | Sprint 6a Day 6-7 | C-08 → C-10 联动同模式 |
| Mock + Real DI 切换模式（INcInterfaceService）| Sprint 0 | ITenderPlatformApiService 沿用 |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，基于 Sprint-6a-V0.2 D10-4 验收物起。范围 5 类候选：A S-13/S-14 库存余额 / B C-09/C-10 付款后续 / C 招采平台真接 / D 09 报表预警起步 / E 验收，约 12.5 PD（需收口到 10 PD）。5 决策点待评审锁版。Sprint 6 决策点接收记入 §四（S-09/S-12 库存联动 + C-10 NC 实付回执 + 招采平台 Mock→Real）。|
