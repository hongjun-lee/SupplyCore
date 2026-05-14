# Sprint 12a 任务卡 — Sprint 11a Codex 评审消化 + AiCallLog Token 监控完善 + 详设 12/13 进入实施 + Sprint 5-11 累计技术债 P3 扫尾（V0.1 草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审锁版 · 候选工时 10.5 PD）
**日期：** 2026-05-14
**文档性质：** 开发实施层 · Sprint 任务卡
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 12a（10 工作日 / 约 2 周 / 预算 ~10 PD）
**并行轨道：** 与 Sprint 12b（待定 — 详设 13 候选 / 设备 ML 升级 / 招采域升级 候选）平行

**衔接文档：**

- 上游 Sprint → [`Sprint-11a-任务卡-V0.2.md`](./Sprint-11a-任务卡-V0.2.md)（D10 验收物） + [`Sprint-11a-Demo-脚本-V0.1.md`](./Sprint-11a-Demo-脚本-V0.1.md)（D10 待出）
- Sprint 11a 落地基线 → 9 commits 合并至 `main`（`228146b` / `ce487a1` / `5c7f5e3` / `2b03bb0` / `6932d37` / `968a3da` / `d1a40cb` / `c4b7708` / `9334138` / `d624cea` — 10 commits 实际）
- 测试基线 **1262 全过**（Domain / Application / EFCore / Web 全绿）

---

## 一、目标与范围

### 1.1 V0.1 候选范围（约 10.5 PD，含 0.5 PD buffer）

Sprint 11a 闭环了详设 11 LLM 编排（Lift Catio ToolRegistry + 3 Advisor Tool）+ AiCallLog token 用量审计 + SY-02 Org Scope 完整化 + Wave 74 partial unique index + E-13 EquipmentDepreciation 接通真 Manager + 6 P1 Codex finding 修复。本期目标：**Sprint 11a Codex 累计评审消化 + AiCallLog token 监控完善（DailyAggregator + dashboard endpoint）+ 详设 12/13 进入实施 ⭐ 主线 + Sprint 5-11 累计技术债 P3 扫尾**。

**A. Sprint 11a 累计 Codex 评审消化（~2 PD）**

Sprint 11a 10 个 commit 在锁版后陆续 push 至 main，按 Sprint 11a Day 1-2 分批策略消化：

| Commit | 主题 | 来源 Day |
|---|---|---|
| `228146b` | Day 1 P1-1/P1-2 修复（C-08 退款回执 + Contract 阈值重算） | D1 |
| `ce487a1` | Day 1 P1-3 修复（MonthlyPrepayment batch 去重） | D1 |
| `5c7f5e3` | Day 1 P1-4 修复（PaymentExecution.ApplyPayment 路线 A 删除） | D1 |
| `2b03bb0` | Day 1 P1-5 修复（C-08 idempotent skip 加 Approved 守护） | D1 |
| `6932d37` | Day 1 P1-6 修复（NC BatchDetails 部分确认分类） | D1 |
| `968a3da` | Day 3-5 详设 11 LLM 编排（Lift Catio ToolRegistry + 3 Advisor Tool） | D3-5 |
| `d1a40cb` | Day 6 Real LLM 集成测试 + token 用量监控基础 | D6 |
| `c4b7708` | Day 7 SY-02 Org Scope 完整化（Provider.GetIntForOrg 新签名 + Wave 72 Seed） | D7 |
| `9334138` | Day 8 Wave 74 partial unique index + DefaultSafetyStockThreshold 删除 + C-02 EFCore.Tests | D8 |
| `d624cea` | Day 8 E-13 EquipmentDepreciation 接通真 Manager（Sprint 8b 协同 lift-in） | D8 |

Day 1-2 分批 spawn `codex review --commit <sha>`（每批 4-5 commits，配合 Pro daily quota），分批跑减少触顶风险。
按 memory rule `feedback_auto_remind_codex_review.md` 不自动修复，列 finding 给 cici 决策。

**B. AiCallLog Token 用量监控完善（~2 PD）**

Sprint 11a Day 6 已落 token 字段（PromptTokens / CompletionTokens / TotalTokens）+ `GetTokenUsageStatsAsync` AppService 基础查询（按日 / 按 Org / 按 Tool 聚合查询）。本期完善：

- **Hangfire DailyAggregator**（决策点 2）：每日 02:00 聚合昨日 a.ai_call_log → 维度表 `a.ai_token_usage_daily`（day / org_id / tool_name / total_tokens / cost_estimate） → dashboard 查询无需扫全表
- **Token 用量 dashboard endpoint**：4 endpoint（GetDailyTrend / GetTopTools / GetOrgRanking / GetCostEstimate）
- **异常监控**（决策点 3）：token 用量 > 阈值（SY-02 配置 `TokenUsageDailyThreshold` 默认 100K）触发 r.alert_log + 邮件通知（兜底 stub log）
- 测试 ≥ 8（DailyAggregator 单测 + dashboard 聚合 + 阈值触发 alert）

**C. 详设 12/13 进入实施（~3-4 PD）⭐ 主线（决策点 1 — 待 cici 评审锁版方向）**

V0.1 候选 3 方向，主代理留空决策点，cici V0.2 评审时锁版具体方向：

- **候选 1：详设 12 报表统计完善（如有）** — 报表统计域升级（r.* 表跨域聚合 + 自助报表 + 导出 Excel/PDF）
- **候选 2：详设 13 设备运维 ML 接入** — 设备健康度 / 故障预测 ML 模型集成（与 Sprint 10b 协同 lift-in）
- **候选 3：详设 13 招采域升级** — 招标采购流程完整化（评标 / 中标 / 合同自动生成 — 详设 13 §5-7）

主代理建议候选 1（详设 12 报表统计完善）— 基础 r.alert_log 已稳定，跨域聚合可复用 Sprint 11a Org Scope；候选 2/3 涉及新 schema + 复杂业务规则，工程量更大。

**D. Sprint 5-11 累计技术债 P3 扫尾（~1.5 PD）**

Codex Sprint 11a 评审完成后累计 P2/P3 选择性修复 + 历史顺延项：

| # | 技术债项 | 来源 | 决策建议 |
|---|---|---|---|
| 1 | Sprint 11a Codex 累计 P2/P3 finding 修复 | §一A 评审产出 | 决策点 5（B 仅 Sprint 8a 历史 P2）|
| 2 | R-04 dedupe（RecurringJobHandlers 加 IsDuplicateRecentAsync）| Sprint 8a Codex P2-1 | 历史 P2 优先 |
| 3 | RecurringJobHandlers 移入 modules/nova.supplycores（满足 Satellite Pattern）| Sprint 8a Codex P2-2 | 历史 P2 优先（决策点 5）|
| 4 | PaymentPlan.Demote 后 C-04 节点状态回退 | Sprint 8a Codex P2-3 | 决策点 5 评估 |
| 5 | DefaultSafetyStockThreshold 完整化删除验证（Sprint 11a D8 已删，本期回归验证） | Sprint 11a D8-2 | 顺延回归 |
| 6 | R-08 InventoryNearExpiry FEFO 完整化（Sprint 9a 简化版 — 暂用 ExpiryDate）| Sprint 9a R-08 | 决策点 5 评估 |

**E. D9 集成 E2E + D10 Demo + Sprint 13a 草案（~1 PD）**

- Sprint12aTokenAggregator_E2E（DailyAggregator + dashboard 查询）
- Sprint12a[详设12/13]_E2E（按决策点 1 锁版方向调整）
- 全量 ≥ 1300（基线 1262 + ~40 新增）

---

## 二、决策点（V0.1 待评审，5 个）

| # | 决策点 | 选项 | V0.1 倾向 | 备注 |
|---|---|---|---|---|
| 1 | 详设 12/13 进入哪个 | A. 详设 12 报表统计完善 / B. 详设 13 设备 ML 接入 / C. 详设 13 招采域升级 | A | 实施层涉及不同 schema：A 走 r.* + 复用 Sprint 11a Org Scope / B 走 e.* + ML SDK 引入 / C 走 t.* + 详设 13 业务规则完整化。主代理建议 A（基础稳 + 工程量小）。|
| 2 | AiCallLog DailyAggregator 实现 | A. Hangfire RecurringJob / B. EF Core Query Hint（视图层）| A | A 与现有 R-04/R-05/R-08 等同 Hangfire 模式（已熟悉）+ 维度表预聚合 dashboard 查询快；B 视图层每次扫表延迟高。|
| 3 | Token 用量 dashboard | A. 仅 backend AppService（4 endpoint）/ B. 加前端可视化（图表 + 表格） | A | 前端工作量大且 Sprint 12a 主线是详设 12/13；A 先打通 backend endpoint，前端可视化顺延 Sprint 13+ 协同。|
| 4 | Codex 评审分批 | A. 一次性 10 commits / B. 4-5 commits 分批 | B | 沿用 Sprint 11a 经验：Pro quota 已多次触顶，分批稳。|
| 5 | P3 技术债修复深度 | A. 全部修复（Sprint 11a P2 + 历史累计） / B. 仅 P2/P3 中 Sprint 8a 历史 / C. 跳过本期 | B | 历史 P2 优先（R-04 dedupe / RecurringJobHandlers Satellite Pattern）；Sprint 11a 新出 P2/P3 累计到 Sprint 13。|

---

## 三、任务拆解（10 PD 收口建议）

### Day 1-2 — Sprint 11a Codex 评审 10 commits 分批消化（~2 PD）

- D1：spawn 5 codex review（commits 1-5 — P1 修复 5 个 commit）+ cici 决策 P1/P2 finding
- D2：spawn 5 codex review（commits 6-10 — 详设 11 LLM 编排 / Org Scope / Wave 74 / E-13）
- D2 末：累计 finding 汇总 + P1 修复（如适用，留 0.5 PD buffer）

### Day 3-5 — 详设 12/13 进入实施（~3-4 PD）⭐ 主线（按决策点 1 锁版方向调整）

**候选 1（详设 12 报表统计完善）— V0.1 倾向**：
- D3-1 r.* 跨域聚合 schema 设计（按 alertCode / sourceBillType / org 三维聚合）
- D3-2 ReportAggregatorAppService（统计 4-6 endpoint：日聚合 / 周聚合 / Org 排行 / 类型分布）
- D4-1 自助报表 endpoint（自定义筛选 + 导出 Excel）
- D4-2 导出 PDF（参考 Catio 报表导出模式）
- D5-1 测试 ≥ 10（聚合 / 导出 / 跨域 join）

**候选 2/3**（按决策点 1 锁版方向调整任务拆解 — V0.2 评审时具体化）

### Day 6 — AiCallLog Token 监控完善（~1.5 PD）

- D6-1 Hangfire DailyAggregator + 维度表 a.ai_token_usage_daily（Wave 75 migration）（决策点 2A）
- D6-2 Token dashboard AppService 4 endpoint（决策点 3A）
- D6-3 异常监控 stub（TokenUsageDailyThreshold > 触发 alert）
- D6-4 测试 ≥ 8

### Day 7-8 — Sprint 5-11 累计技术债 P3 扫尾（~2 PD）

- D7-1 R-04 dedupe 接通（Sprint 8a P2-1 — IsDuplicateRecentAsync）
- D7-2 RecurringJobHandlers 移入 modules/nova.supplycores（Sprint 8a P2-2 — Satellite Pattern 合规）
- D7-3 PaymentPlan.Demote 后 C-04 节点状态回退（Sprint 8a P2-3）
- D8-1 Sprint 11a Codex 新 P2 选择性修复（按决策点 5B）
- D8-2 R-08 FEFO 完整化评估 + 决策（保留简化版 / 升级 FEFO）
- D8-3 DefaultSafetyStockThreshold 删除回归验证

### Day 9 — 集成 E2E + 全量回归（~1 PD）

- Sprint12aTokenAggregator_E2E（DailyAggregator + dashboard）
- Sprint12a[详设12/13]_E2E（按决策点 1 锁版调整）
- 全量 ≥ 1300 通过

### Day 10 — Demo + Sprint 13a 草案（~0.5 PD）

- Sprint-12a-Demo-脚本-V0.1.md
- Sprint-13a-任务卡-V0.1.md（候选：详设 12/13 剩余实施 / Token dashboard 前端可视化 / Sprint 5-12 累计技术债 P3+）

**Sprint 12a V0.1 候选总工时：** 2 + 4 + 1.5 + 2 + 1 + 0.5 = **11 PD**（需 V0.2 锁版收口到 10 PD，含 0.5 PD buffer）

锁版评审目标：候选 D（P3 技术债）由 2 PD → 1.5 PD（决策点 5B 仅历史 P2）+ 或候选 C（详设 12/13）由 4 PD → 3.5 PD（详设 12 报表统计精简版），收口到 10.5 PD（含 0.5 PD buffer）。

---

## 四、Sprint 11a 决策点接收（来自 D10 收尾报告 — 预计）

| 备忘 | 来源 | 本 Sprint 处理时机 |
|---|---|---|
| **Sprint 11a Codex 评审 10 commits 顺延** | Pro daily quota 持续触顶 | **Day 1-2 处理 ✅** |
| **AiCallLog Token 用量 dashboard 完善** | Sprint 11a Day 6 基础已落 | **Day 6 处理 ✅** |
| **Sprint 11a §七 13 P2 / 2 P3 finding 未修部分** | Sprint 11a 仅修 P1 | **Day 7-8 处理（决策点 5B）✅** |
| **R-08 InventoryNearExpiry FEFO 完整化** | Sprint 9a 简化版（ExpiryDate）| Day 8 评估（决策点 5）|
| **详设 12 / 13 进入实施候选** | Sprint 11a 详设 11 完整闭环 | **Day 3-5 处理（决策点 1）✅** |
| **R-04 dedupe + RecurringJobHandlers Satellite Pattern** | Sprint 8a Codex P2-1/P2-2 | **Day 7 处理 ✅** |
| **DefaultSafetyStockThreshold 删除回归** | Sprint 11a D8-2 已删 | Day 8 处理回归 |

---

## 五、资源 / 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 详设 12 报表统计跨域聚合 SQL 性能差（万行级 join）| 中 | Day 3-1 schema 设计时加复合索引（alertCode + org_id + day）；聚合走维度表预存（同 §一B Token 用量模式）|
| 2 | Hangfire DailyAggregator 调度时机与现有 R-04/R-05/R-08 冲突（同 02:00）| 低 | Day 6-1 错峰：DailyAggregator 02:30（R-04 02:00 / R-05 02:15 已占）|
| 3 | Sprint 11a Codex 累计 finding 过多（14 P2 + 2 P3 历史 + 新出未知）| 中 | Day 2 留 0.5 PD buffer 处理 P1；P2 选择性按决策点 5B 修复 Sprint 8a 历史，新 P2 累计到 Sprint 13 |
| 4 | 详设 12/13 决策方向影响 Day 3-5 拆解 | 高 | V0.2 评审锁版决策点 1 后再具体化 Day 3-5 任务；V0.1 仅占位候选 1（详设 12）|
| 5 | RecurringJobHandlers 移入 modules/nova.supplycores 跨 Host 依赖关系 | 中 | Day 7-2 先评估 Hangfire DI 注册 + IAbpDependency 路径；如阻塞则降级保留 Host-only 例外（同 Nova Pattern Host-only 既有约定）|

---

## 六、版本沿革

| 版本 | 日期 | 主要变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 首版草案。基于 Sprint-11a-任务卡-V0.2 锁版 + Sprint 11a D9 全过基线 1262 起。5 类候选范围 ~10.5 PD（需 V0.2 锁版收口到 10 PD）。5 决策点待评审。Sprint 11a 决策点接收记入 §四（7 项）。重点：**A Sprint 11a Codex 10 commits 消化** + **B AiCallLog token 监控完善（DailyAggregator + dashboard）** + **C 详设 12/13 进入实施 ⭐ 主线（待锁版方向）** + **D Sprint 5-11 累计技术债 P3 扫尾**。**重点评审建议**：决策点 1（详设 12/13 进入方向）— V0.1 倾向 A 详设 12 报表统计完善，cici 评审时需确认是否调整为 B 设备 ML / C 招采升级。|
| V0.1+ (附录) | 2026-05-14 | **Codex 11a 评审阶段性结果**：完成 7/10 commits（剩 3 commits Pro quota 触顶顺延：5c7f5e3 / 2b03bb0 / d1a40cb）。已知 finding **4 P1 / 14 P2 / 1 已修 / 1 zero-finding**。详 §七 Codex finding 附录。**Sprint 12a Day 1 已落（不依赖 V0.2）**：Codex 8a 历史 P2-1 R-04 dedupe + P2-2 RecurringHandlers 移位（commit `f2436f5`）+ Sprint 11a 全产物 contract 守护（commit `d208fd4`）— 基线 1262 → 1278（+16）。Day 1-2 工时重估 2 → 2.5 PD。等 cici 评审 V0.2 锁版 + §七 4 P1 修复策略。|
| V0.1++ (附录) | 2026-05-14 | **Codex 11a 评审完成 10/10**：补跑 3 commits（`bmrxatwey`）+5 finding（+2 P1 +3 P2），其中 2 P1 是 Sprint 12a Day 1-2 已修 finding 的 commit 源头（2b03bb0 ↔ P1-α-1 / d1a40cb ↔ P2-5 jsonb wrap）— **Sprint 12a P1 修复链路完整闭环**。新增 P2-8/P2-9/P2-10 累计 Sprint 13a 修候选。Sprint 12a Day 1-2 累计修 4 P1 + 4 P2-高严重 + 守护测试，6 commits（f2436f5 / d208fd4 / 21846a2 / 0421b11 / d2be1d0 / ddb8534），基线 1262 → 1306（+44）。等 cici 评审 V0.2 锁版（决策点 1-5）。|

---

## 七、Codex 11a 10 commits Finding 附录（**完成 10/10** — 2026-05-14 补跑完）

### 7.1 整体统计

| Sprint 11a Day | Commits | 已评 | finding 数 |
|---|---|---|---|
| D1（P1 修复 5 件）| 228146b / ce487a1 | 2 | 4 (0 P1 + 4 P2 + **1 zero-finding** 228146b) |
| D2（P1-4 路线 A + P1-5）| 5c7f5e3 | 1 | 1 (0 P1 + 1 P2) |
| D3（Lift Tool 基础）| 2b03bb0 | 1 | 1 (1 P1 + 0 P2，**1 P1 同源已修**) |
| D4-D5（Orchestrator + AiCallLog 3 Tool）| 6932d37 / 968a3da | 2 | 12 (4 P1 + 8 P2) |
| D6（Token + Real LLM）| d1a40cb | 1 | 3 (1 P1 + 2 P2，**1 P1 同源已修**) |
| D7（SY-02 Org Scope）| c4b7708 | 1 | 4 (2 P1 + 2 P2，**1 P1 已修**) |
| D8（Wave 74 + E-13）| 9334138 | 1 | 2 (2 P1 + 0 P2) |
| D9（集成 E2E）| d624cea | 1 | 0 (Codex 未识别 finding — zero-finding) |
| **合计** | 10 | **10** | **10 P1 / 17 P2 / 4 已修 / 2 zero-finding** |

> **补跑增量（2026-05-14）**：5c7f5e3 + 2b03bb0 + d1a40cb 共 +5 finding (+2 P1 +3 P2)，其中 2 个 P1 是 Sprint 12a Day 1-2 已修 finding 的 commit 源头（2b03bb0 ↔ α-1 / d1a40cb ↔ P2-5 jsonb wrap），3 个 P2 新增到累计技术债。

### 7.2 4 个未修 P1 finding（Day 1-2 优先修，按 cici V0.2 决策）

| # | Commit | 文件 | 标题 | 影响 |
|---|---|---|---|---|
| **P1-α-1** | `6932d37` | `AdvisorOrchestrator.cs:142` | Orchestrator 把 LLM 给的 `call.Arguments` 直接传 ToolRegistry，无 caller scope 验证 | 🚨 **跨 Org 数据泄露** — 用户问"查本月预警"可拿其他 Org alert |
| **P1-α-2** | `968a3da` | `GetContractDetailsTool.cs:57` | Tool 仅 contractId 查，不过滤 caller's permitted scope | 🚨 **越权返回合同详情**（金额 / 已付 / 押金 / 供应商）|
| **P1-β-1** | `9334138` | `Wave74_Migration.cs:27-29` | partial unique index 与 R-05/R-08 detector dedup 不协调 — 旧 Pending alert (>DedupWindowHours) → unique violation → Hangfire 反复 fail | ⚠️ **Hangfire 调度反复失败**；migration 在已有重复 Pending DB 上 fail |
| **P1-γ** | `c4b7708` | `ISystemConfigProvider.cs:35-38` | 接口扩展未在 FakeSystemConfigProvider 实现 → CS0535 build 失败 | ✅ **已修**（Sprint 11a D8-3 b 子代理顺手补全）|

### 7.3 14 个 P2 finding（Sprint 13a 累计修候选）

| # | Commit | 文件 | 标题 |
|---|---|---|---|
| P2-1 | `ce487a1` | `MonthlyPrepaymentSummaryManager.cs:70` | filter 加 InterfacePushState=Success 过滤后已存在 C-09 在 GenerateAsync 不返回 → idempotent rerun 行为破 |
| P2-2 | `ce487a1` | `MonthlyPrepaymentSummaryAppService.cs:179-181` | 失败 retry 时 entity.NcVoucherNo 旧值未 clear → 失败仍显示 voucher（与 P2-10 目标矛盾） |
| P2-3 | `6932d37` | `SystemPromptBuilder.cs:50` | prompt 提到 get_system_config Tool 但该 commit 时仅注册 list_report_alerts → LLM 调用 not found，浪费 round（Sprint 11a D5 commit `968a3da` 已加 get_system_config，本 P2 在 D5 后实际无效）|
| P2-4 | `6932d37` | `SystemPromptBuilder.cs:36-38` | 30 min prompt 缓存与 Provider Invalidate 不联动 → admin 改 SY-02 后 prompt 仍显示旧阈值 |
| P2-5 | `968a3da` | `AiCallLogManager.cs:67` | OutputSummary 列 jsonb 但 LLM 返回普通 text → PG 拒插 + catch silent → 审计 row 丢失 |
| P2-6 | `968a3da` | `GetSystemConfigTool.cs:75` | 未支持 configKey 用 GetInt(key, 0) 返回 Success+0 → advisor 报告假阈值 |
| P2-7 | `c4b7708` | `Wave73_Migration.cs:22-24` | Seed Org Scope 用固定 id=7,8 + ON CONFLICT DO NOTHING → 已有 id 7/8 的 DB 升级时 Org override silent absent |
| P2-8 | `5c7f5e3` | `PaymentExecutionAppService.cs:61-65` | C-08 已 Paid 早返回假设 C-10/C-02 已更新；但 `IPaymentRequestAppService.MarkPaidAsync` 是独立 public path 仅置 request 状态 → 后续 C-10 callback 跳过 `execution.MarkPaid` + `contract.AddPayment` → 支付不进 execution ledger / contract paid amount。修复：仅 execution 已 paid 才 idempotent，否则 reconcile / throw |
| P2-9 | `d1a40cb` | `AdvisorOrchestrator.cs:146` | `providerName: providerTag` — providerTag 是 "primary"/"fallback" 抽象 tag 而非实际 provider 名（deepseek/openai/...） → 审计行无法定位真实 LLM 来源 |
| P2-10 | `d1a40cb` | `AdvisorOrchestrator.cs:152` | LLM provider 失败 + fallback 时未先 LogLlmCompleteAsync 记失败 attempt → 审计漏失败路径，无法回溯 fallback 触发原因 |

### 7.4 Zero-finding（Codex 认可干净）

| Commit | 状态 |
|---|---|
| `228146b` Sprint 11a P1-1 + P1-2 修复 | ✨ "did not identify a discrete regression" |
| `d624cea` Sprint 11a D9 集成 E2E | ✨ Codex 补跑未识别独立 regression |

### 7.5 补跑 3 commits finding（2026-05-14 补足 10/10）

| Commit | Codex finding | Sprint 12a 状态 |
|---|---|---|
| `5c7f5e3` D2 P1-4 路线 A + P1-5 修复 | 1 P2: PaymentExecution Paid shortcut 跨 path 风险 | 累计 P2-8（Sprint 13a 候选）|
| `2b03bb0` D3 Lift Catio Tool 基础 | 1 P1: ListReportAlertsTool cross-org（args.orgId 可信泄露其他 Org alert）| ✅ **同源已修** — Sprint 12a P1-α-1（Orchestrator 强制透传 ToolCallContext + Tool 内强制覆盖 args.orgId）|
| `d1a40cb` D6 Token + Real LLM | 1 P1: jsonb wrap（Orchestrator.cs:150 → Manager.WrapAsJson 兜底）+ 2 P2（provider 抽象名 / fallback 路径未审计失败）| ✅ **P1 同源已修** — Sprint 12a P2-5（AiCallLogManager.WrapAsJson + EnsureJson）；2 P2 累计 P2-9/P2-10 |

> **补跑结论**：3 commits 中 2 个 P1 finding（2b03bb0 + d1a40cb）正是 Sprint 12a Day 1-2 P1-α-1 + P2-5 修复的 Codex 源头记录，**Sprint 12a P1 修复链路完整闭环**。新增 3 P2 累计技术债（5c7f5e3 P2-8 + d1a40cb P2-9 + P2-10），Sprint 13a 评估修复优先级。
