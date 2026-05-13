# Sprint 11a 任务卡 — 详设 11 LLM 编排 + Codex 14 commits 消化 + Sprint 5-10 累计技术债 P2 扫尾（V0.1 草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审锁版）
**日期：** 2026-05-14
**文档性质：** 开发实施层 · Sprint 任务卡
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 11a（10 工作日 / 约 2 周 / 预算 ~10 PD）
**并行轨道：** 与 Sprint 11b（待定 — 设备 ML / 招采域升级 候选）平行

**衔接文档：**

- 上游 Sprint → [`Sprint-10a-任务卡-V0.3.md`](./Sprint-10a-任务卡-V0.3.md)（D10 验收物） + [`Sprint-10a-Demo-脚本-V0.1.md`](./Sprint-10a-Demo-脚本-V0.1.md)
- Sprint 10a 落地基线 → commit `ad1bdfb`（Day 9 综合 E2E）
- 测试基线 **1189 全过**（Domain 757 / Application 414 / EFCore 12 / Web 6）

---

## 一、目标与范围

### 1.1 V0.1 候选范围（约 10 PD）

Sprint 10a 闭环了国产 LLM 接入（DeepSeek+Qwen 三级 fallback）+ SY-02 SystemConfig 完整化 + Sprint 5-9 累计技术债 P1。本期目标：**详设 11 完整 LLM 编排 + Codex 累计 14 commits 一次性消化 + Sprint 5-10 累计技术债 P2 扫尾**。

**A. Codex 评审累计 14 commits 消化（~2 PD）**

Sprint 8a + 9a + 10a 累计 14 个未评审 commit：

| Commit | 主题 | 来源 Sprint |
|---|---|---|
| `44062d4` | Hangfire 框架引入 | 8a |
| `408545b` | C-02 PaidAmount + C-08 RefundedState | 8a |
| `c8f2600` | C-09 BIZ-PAY-BATCH + 联动 C-08 | 8a |
| `428e5cc` | R-05 BondReleaseNear | 8a |
| `42b4804` | SY-02 字典化 + PaymentExecution 编排 | 9a |
| `45554f7` | R-06 ContractExpiryNear + R-07 主代码 | 9a |
| `e586638` | R-08 InventoryNearExpiry | 9a |
| `7574ba5` | AI Tool 接口 + 3 Mock Stub | 9a |
| `c1173d4` | NC BatchDetails 部分成功 schema | 9a |
| `b8e0d61` | Web.Tests 项目 + Hangfire 注册守护 | 9a |
| `c1667b9` | Lift Catio LLM Provider 国产接入 | 10a |
| `519ee83` | 国产 LLM Advisor 三件套 + 三级 fallback | 10a |
| `ccf7ff0` | SY-02 SystemConfig 完整化 + Sprint 5-9 累计技术债 P1 | 10a |
| `ad1bdfb` | Sprint10a LlmAdvisor + SY02Config E2E | 10a |

Day 1-2 分批 spawn `codex review --commit <sha>`（每批 4-5 commits，配合 Pro daily quota），分批跑减少触顶风险。

**B. 详设 11 完整 LLM 编排（~3 PD）⭐ 优先**

Sprint 10a Stub→Real 闭环后，本期推进详设 11 完整能力：

- **多 Tool 协同**：现 IPaymentDueAdvisorTool / IBondReleaseAdvisorTool / IContractExpiryAdvisorTool 独立 — 本期加 ToolRegistry 让 Claude/DeepSeek 可在一次对话中动态调用多个 Tool
- **AI 工作流编排**（详设 11 §6 简化版）：典型场景 — 报表预警综合处置助手
  - 用户问"本月待处理预警如何处理" → LLM 调用 ListReportAlertsTool → 按类型分组 → 对每条 alert 调对应 Advisor → 综合回答
- **Tool 调用审计**（详设 11 §13 5 年留存）：a.ai_call_log 加 tool_call_id / function_name / arguments / response / duration
- **Token 用量监控**：每次调用记 PromptTokens / CompletionTokens / TotalTokens 入 a.ai_call_log，按日 / 按 Org 聚合可查
- 测试 ≥ 10（含多 Tool 调用 mock + 工作流 E2E）

**C. Real LLM 集成 E2E + token 监控（~1.5 PD）**

Sprint 10a D9 E2E 用 mocked HttpMessageHandler 验证 fallback 链；本期加：

- **Real ApiKey 集成测试**（带条件跳过 — CI 无 ApiKey 时 skip）：触发真 DeepSeek API 1-2 次 → 验证响应解析 + 中文 prompt 实际效果
- **Token 用量统计 AppService**：日 / 周 / 月 / Org / Tool 维度聚合查询
- 测试 ≥ 5

**D. SY-02 完整 Scope 过滤（~1 PD）**

Sprint 10a 仅启用 ConfigScope=全局。本期：

- ConfigScope=组织：按 OrgId 注入差异化配置（如阜矿本部 vs 子公司不同阈值）
- ConfigScope=模块：按业务模块注入（如 R-04 用 7 天 / R-05 用 90 天 — 但本期 Key 即可区分，作为预留接口）
- Provider.GetIntForOrg(code, orgId, fallback) 新签名（Sprint 10a GetInt 保留）
- 测试 ≥ 4

**E. Sprint 5-10 累计技术债 P2 扫尾（~1.5 PD）**

| # | 技术债项 | 来源 | 决策建议 |
|---|---|---|---|
| 1 | StockBalanceUpdater 实时触发钩子线程安全 | Sprint 10a D8-2 评估 P2 | 决策点 5（A/B/C）— 候选 B（DB 唯一约束）|
| 2 | DefaultSafetyStockThreshold=100 删除 | Sprint 10a D8-1 评估 | 评估字段是否稳定，决定保留/去除 |
| 3 | E-13 EquipmentDepreciation 接通 | Sprint 8a Day 6 placeholder | 与 Sprint 8b/11b 协同 |
| 4 | C-02.PaidAmount EFCore.Tests 真集成测 | Sprint 10a D8-3 仅 in-memory | 接通真 PG（可选）|

**F. D9 集成 E2E + D10 Demo + Sprint 12a 草案（~1 PD）**

- Sprint11aLlmOrchestration_E2E（多 Tool + 工作流编排）
- Sprint11aSY02OrgScope_E2E（按 Org 差异化阈值）
- 全量 ≥ 1210（基线 1189 + ~20 新增）

---

## 二、决策点（V0.1 待评审，5 个）

| # | 决策点 | 选项 | V0.1 倾向 | 备注 |
|---|---|---|---|---|
| 1 | LLM 多 Tool 协同实现路径 | A. 自封装 ToolRegistry（轻量）/ B. Lift Catio Nova.AiAssistant ToolRegistry / C. 跳过 Sprint 11a（仅做单 Tool 升级）| **B Lift Catio**（沿用 Sprint 10a 经验） | A 重复造轮 / B 风险低 / C 推迟会卡详设 11 落地 |
| 2 | Real LLM 集成测试运行方式 | A. CI 跳过 + 本地手工跑 / B. 加 docker DeepSeek mock / C. Mock 即可不接通真 | **A** | C 失去本期价值；B 工程量大 |
| 3 | SY-02 Org Scope schema | A. 改 Provider.GetIntForOrg 新签名 / B. 同签名内自动从 IAbpSession.OrgId 取（隐式）| **A 显式参数** | B 易出错且测试难 |
| 4 | Codex 评审分批策略 | A. 一次性 14 commits / B. 4-5 commits 分批 | **B 分批** | Pro quota 持续触顶 |
| 5 | StockBalanceUpdater 线程安全升级 | A. SemaphoreSlim / B. DB 唯一约束（Wave 72）/ C. 现状（继续延后） | **B DB 唯一约束** | A 跨实例无效；C 影响 Hangfire+业务并发场景信任 |

---

## 三、任务拆解（10 PD 收口建议）

### Day 1-2 — Codex 评审 14 commits 分批消化（~2 PD）

- D1：spawn 5 codex review（commits 1-5）+ cici 决策 P1/P2 finding
- D2：spawn 5 codex review（commits 6-10）+ P1 finding 修复（如适用）
- D2 末：剩余 4 commits 排到 Day 3 buffer 或顺延

### Day 3-5 — 详设 11 完整 LLM 编排（~3 PD）⭐ 主线

- D3-1 Lift Catio ToolRegistry + IAiTool 接口（决策点 1B）
- D3-2 多 Tool 注册路径 → ListReportAlertsTool 起步
- D4-1 AI 工作流编排（综合处置助手骨架）— SystemPrompt + 多轮 message 链
- D4-2 Tool 调用审计扩展 — a.ai_call_log 加 tool_call_id / function_name / arguments / response
- D5-1 Token 用量监控（DailyAggregator + AppService 4 endpoint）
- D5-2 单测 ≥ 10（多 Tool / 工作流 E2E / token 聚合）

### Day 6 — Real LLM 集成测试 + token 监控（~1.5 PD）

- D6-1 Sprint11aRealLlm_IntegrationTest（条件跳过，需 CATIO_LLM_API_KEY 环境变量）
- D6-2 Token 用量 AppService + 聚合查询（按日 / Org / Tool）
- D6-3 测试 ≥ 5

### Day 7 — SY-02 Org Scope 过滤（~1 PD）

- D7-1 Provider.GetIntForOrg / GetDecimalForOrg 新签名（决策点 3A）
- D7-2 Wave 72 — sy.system_config 加 Seed 2 行（按 Org 差异化示例）
- D7-3 测试 ≥ 4

### Day 8 — Sprint 5-10 累计技术债 P2 扫尾（~1.5 PD）

- D8-1 StockBalanceUpdater DB 唯一约束（决策点 5B）— Wave 73 加 UQ on (alertCode, sourceBillType, sourceBillId) WHERE state=Pending
- D8-2 DefaultSafetyStockThreshold 删除评估 + 决策（保留 / 去除）
- D8-3 E-13 接通真 Manager（与 Sprint 8b 协同，或顺延）
- D8-4 C-02.PaidAmount EFCore.Tests 真集成测（可选）

### Day 9 — 集成 E2E + 全量回归（~1 PD）

- Sprint11aLlmOrchestration_E2E（多 Tool + 工作流）
- Sprint11aSY02OrgScope_E2E（按 Org 差异化）
- 全量 ≥ 1210 通过

### Day 10 — Demo + Sprint 12a 草案（~0.5 PD）

- Sprint-11a-Demo-脚本-V0.1.md
- Sprint-12a-任务卡-V0.1.md（候选：详设 12 / 13 进入实施 / Sprint 5-11 累计技术债 P3）

**Sprint 11a V0.1 候选总工时：** 2 + 3 + 1.5 + 1 + 1.5 + 1 + 0.5 = **10.5 PD**（含 0.5 PD buffer）

锁版评审目标：收口到 10 PD（如某 P2 不做则减 0.5 PD）。

---

## 四、Sprint 10a 决策点接收（来自 D10 收尾报告）

| 备忘 | 来源 | 本 Sprint 处理时机 |
|---|---|---|
| **Codex 评审 14 commits 顺延** | Pro daily quota 持续触顶 | **Day 1-2 处理 ✅** |
| **详设 11 完整 LLM 编排** | Sprint 10a Stub→真接闭环 | **Day 3-5 处理 ✅** |
| **Real LLM 集成测试 + token 监控** | Sprint 10a D9 仅 mock HttpHandler | **Day 6 处理 ✅** |
| **SY-02 Org Scope 过滤** | Sprint 10a 仅 Global Scope | **Day 7 处理 ✅** |
| **StockBalanceUpdater 线程安全升级** | Sprint 10a D8-2 评估 P2 | **Day 8 处理 ✅** |
| **DefaultSafetyStockThreshold 删除** | Sprint 10a D8-1 评估 | **Day 8 处理 ✅** |
| **E-13 EquipmentDepreciation 接通** | Sprint 8a Day 6 占位 | Day 8 处理（或与 Sprint 8b/11b 协同）|

---

## 五、资源 / 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | Catio ToolRegistry Lift 时引入 Nova.AiAssistant 完整模块依赖 | 中 | Day 3-1 复制时 rename 命名空间 `Nova.SupplyCores.Llm.Tools`；不引完整 AiAssistant 依赖（沿用 Sprint 10a D3 经验）|
| 2 | Real LLM 集成测试 CI 跳过策略 | 低 | Day 6-1 用 `[SkippableFact]` + 环境变量判断；本地 run-with-secrets 验证 |
| 3 | Wave 72 + Wave 73 双 migration 同 Sprint 易冲突 | 中 | Day 7 先 Wave 72（SY-02 Scope seed），Day 8 后 Wave 73（DB 唯一约束）— 时序分开 |
| 4 | Codex 14 commits 累计 finding 过多 | 中 | Day 2 留 0.5 PD buffer 处理 P1；P2 累计记入 Sprint 12 |
| 5 | 多 Tool + 工作流编排测试复杂度高 | 中 | D5-2 用 mock HttpHandler 模拟 LLM 决策多轮 tool_call 响应（参考 Catio 测试模式）|

---

## 六、版本沿革

| 版本 | 日期 | 主要变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 首版草案。基于 Sprint-10a-Demo-V0.1 D10 验收物。6 类候选范围 ~10.5 PD（需收口到 10）。5 决策点待评审。Sprint 10a 决策点接收记入 §四（7 项）。重点：A Codex 14 commits 消化 + B 详设 11 完整 LLM 编排 + C Real LLM 集成 + D SY-02 Org Scope + E P2 技术债扫尾。 |
