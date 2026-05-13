# Sprint 10a 任务卡 — Codex 评审消化 + AI 真 LLM 接入 + SY-02 完整化 + 累计技术债扫尾（V0.1 草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案，待评审锁版为 V0.2）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（草案）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 10a（10 工作日 / 约 2 周）
**并行轨道：** 与 Sprint 10b（设备运维 ML 接入 / 详设 07 V1.2 实施）平行

**衔接文档：**

- 上游 Sprint → [`Sprint-9a-任务卡-V0.2.md`](./Sprint-9a-任务卡-V0.2.md)（D10 验收物） + [`Sprint-9a-Demo-脚本-V0.1.md`](./Sprint-9a-Demo-脚本-V0.1.md)
- Sprint 9a 落地基线 → commit `6e1fd2f`（Day 9 综合 E2E）
- 测试基线 **1139 全过**（Domain 752 / Application 369 / EFCore 12 / Web 6）

---

## 一、目标与范围

### 1.1 V0.1 候选范围（约 11 PD，待评审收口到 ~10）

Sprint 9a 闭环了 R-06/R-07/R-08 完整化 + AI Tool 接口骨架 + NC 部分成功 schema + Web.Tests + SY-02 字典化精简版。本期目标：**Codex 评审累计 9 commits 一次性消化 + AI Advisor 真 LLM 接入 + SY-02 SystemDictionary 表完整化 + Sprint 5-9 累计技术债扫尾**。

**A. Codex 评审累计 9 commits 消化（~2 PD）**

Sprint 8a + 9a 累计 9 个未评审 commit：

| Commit | 主题 | 来源 Sprint |
|---|---|---|
| `44062d4` | Hangfire 框架引入 | 8a Day 6 |
| `408545b` | C-02 PaidAmount + C-08 RefundedState | 8a Day 8 |
| `c8f2600` | C-09 BIZ-PAY-BATCH + 联动 C-08 | 8a Day 5 |
| `428e5cc` | R-05 BondReleaseNear | 8a Day 7 |
| `42b4804` | SY-02 字典化 + PaymentExecution 编排 | 9a Day 3 |
| `45554f7` | R-06 ContractExpiryNear + R-07 主代码 | 9a Day 4 |
| `e586638` | R-08 InventoryNearExpiry | 9a Day 5-1 |
| `7574ba5` | AI Tool 接口 + 3 Mock Stub | 9a Day 6-7 |
| `c1173d4` | NC BatchDetails 部分成功 schema | 9a Day 8 |

Day 1 一次性 spawn 9 个 codex review，预计 5-10 分钟/commit，配合 cici daily quota 分批跑（每批 3-4 commits）。
按 memory rule `feedback_auto_remind_codex_review.md` 不自动修复，列 finding 给 cici 决策。

**B. AI Advisor 真 LLM 接入（~3 PD，Sprint 9a Day 6-7 顺延）**

- 引入 Claude API 客户端（`Anthropic.SDK` 或自封装 HttpClient + JSON）
- 实装 ClaudeReportAdvisorTool 三件套（PaymentDue / BondRelease / ContractExpiry）替换 MockStub
- IOptions<ClaudeApiSettings>：ApiKey / Model（claude-opus-4-7）/ MaxTokens / Temperature
- Prompt 构造：上下文裁剪 + System Prompt + Few-shot examples（接近详设 11 Tool 调用规范）
- 失败软降级保留：API 失败 fallback 到 MockStub 输出
- 测试 ≥ 8（mock HttpMessageHandler + Stub-vs-真 LLM 切换 + token 用量估算）

**C. SY-02 SystemDictionary 表完整化（~2 PD，Sprint 9a Day 3 顺延）**

- 新 SystemDictionary entity（detailed 06 V1.1 §SY-02 或自定 schema）
- 字段：Code（PaymentDueAlertDays 等）/ Value / DataType / Description / EffectiveDate
- 替换 IOptions<SupplyCoresAlertSettings> 为 SettingProvider（运行时读 SY-02 表）
- AppService：维护字典 endpoint（4 endpoint：Get / List / Set / GetHistory）
- 测试 ≥ 6

**D. PaymentPlan reconciliation 集成单测（~1 PD，Sprint 8a Day 9 顺延）**

- EFCore.Tests 集成层加 reconciliation 测试
- 校验：Contract.PaidAmount = SUM(C-07.CumulativePaidAmount where ContractId)
- 反向校验：C-07.CumulativePaidAmount = SUM(C-10.ActualPaymentAmount where state=Paid AND PaymentRequest.ContractId)
- 测试 ≥ 4（含偏差检测 + 修复流程）

**E. C-09 月末批处理循环 Org（~1 PD，Sprint 8a Day 6 顺延）**

- SupplyCoresRecurringJobHandlers.RunMonthlyPrepaymentGenerateAsync 接通真 Org 循环
- 调 IOrganizationRepository 取所有 Status=启用 Org
- 循环调 IMonthlyPrepaymentSummaryAppService.GenerateAsync per Org
- 单 Org 失败不阻断其他 Org（catch + log + continue）
- 测试 ≥ 3

**F. Sprint 5-9 累计技术债扫尾（~1.5 PD）**

- SafetyStock=0 两 path 对齐（b 子代理 R-07 报告）
- StockBalanceUpdater 出库后实时触发钩子的线程安全性 review
- S-14 M-15 join 性能优化（in-memory linq join，~5K 批次时考虑 EF projection）
- E-13 EquipmentDepreciation RecurringJob 接通真 Manager（Sprint 8b 协同）

**G. D9 集成 E2E + D10 Demo + Sprint 11a 草案（~1 PD）**

- Sprint10aClaudeAdvisor_E2E：mock HttpHandler 模拟 Claude API 响应
- Sprint10aSY02Dictionary_E2E：动态调整阈值 → Detector 立即生效
- 全量 ≥ 1170（基线 1139 + ~30 新增）

---

## 二、决策点（V0.1 草案，5 个）

| # | 决策点 | 选项 | V0.1 倾向 |
|---|---|---|---|
| 1 | Claude API 客户端选型 | A. `Anthropic.SDK` (NuGet 官方) / B. 自封装 HttpClient + System.Text.Json | A — 官方 SDK 维护成本低，但需评估 .NET 10 + ABP 10.1 兼容性 |
| 2 | SY-02 SystemDictionary schema | A. 详设 06 §SY-02 完整（含 EffectiveDate 时间窗）/ B. 精简版（仅 Code/Value/DataType）| B — V1 精简，时间窗留 Sprint 11+；A 复杂度高 |
| 3 | LLM 失败 fallback 策略 | A. Mock Stub 兜底 / B. 缓存最近成功响应 / C. 直接 IsFallback=true 错误返回 | A — Stub 已有，零成本兜底；B 缓存延后 Sprint 11 |
| 4 | Codex 评审分批策略 | A. Day 1 一次性 9 commits / B. Day 1-3 每天 3 commits 分批 | B — Pro quota 防触顶；finding 列出后 cici 渐次决策 |
| 5 | Sprint 5-9 技术债扫尾深度 | A. 全部修复 / B. 仅 P1（性能 + 安全相关）| B — 9 个 const 中只有 SafetyStock=0 / 线程安全两项必修 |

---

## 三、任务拆解（10 PD 收口建议）

### Day 1 — Codex 评审 9 commits 一次性消化（~1 PD）

- 分 3 批 spawn `codex review --commit <sha>`（每批 3 个，间隔 quota 留 buffer）
- 累计 finding 列给 cici 决策（P1/P2 分级）
- 任务卡 V0.1 → V0.2 锁版评审

### Day 2-3 — Codex finding 修复 + AI Advisor Claude API 起步（~2 PD）

- D2 Codex finding 闭环（按 cici 决策修复）
- D3-1 引入 `Anthropic.SDK` NuGet（决策点 1A）
- D3-2 IClaudeApiClient 封装 + IOptions<ClaudeApiSettings>

### Day 4-5 — Claude API 三 Advisor 实装（~3 PD）

- D4-1 ClaudePaymentDueAdvisor + Prompt template + Few-shot examples
- D4-2 ClaudeBondReleaseAdvisor 同模式
- D5-1 ClaudeContractExpiryAdvisor 同模式
- D5-2 失败软降级（fallback 到 MockStub）
- D5-3 单测 ≥ 8（mock HttpHandler + Stub-vs-真 LLM 切换）

### Day 6-7 — SY-02 SystemDictionary 表（~2 PD）

- D6-1 SystemDictionary entity + Manager + AppService（决策点 2B 精简版）
- D6-2 Wave 71 migration（c.system_dictionary 表）
- D6-3 IOptions → ISettingProvider 改造（PaymentDueAlertDays 等 4 字段）
- D7-1 维护 endpoint + 测试 ≥ 6

### Day 8 — Sprint 5-9 累计技术债扫尾（~1.5 PD）

- D8-1 SafetyStock=0 两 path 对齐（决策点 5B）
- D8-2 StockBalanceUpdater 实时触发钩子线程安全 review
- D8-3 C-02.PaidAmount reconciliation EFCore.Tests
- D8-4 C-09 月末批处理循环 Org（Sprint 8a 顺延）

### Day 9 — 集成 E2E + 全量回归（~1 PD）

- Sprint10aClaudeAdvisor_E2E（mock HttpHandler）
- Sprint10aSY02Dictionary_E2E（动态阈值生效）
- 全量 ≥ 1170 通过

### Day 10 — Demo + Sprint 11a 草案（~0.5 PD）

- Sprint-10a-Demo-脚本-V0.1.md
- Sprint-11a-任务卡-V0.1.md（候选：详设 11 完整 LLM 编排 / AI 工作流 / Sprint 9-10 累计技术债）

**Sprint 10a V0.1 总工时：** 1 + 2 + 3 + 2 + 1.5 + 1 + 0.5 = **11 PD**（需收口到 10）

**收口候选：**
- 决策点 1B 自封装 vs 官方 SDK（自封装省 SDK 学习成本 -0.5 PD）
- 决策点 5B 仅 P1 技术债（D8 1.5 → 1 PD，-0.5 PD）
- 总计可压缩到 **10 PD ✓**

---

## 四、Sprint 9a 决策点接收（来自 D10 收尾报告）

| 备忘 | 来源 | 本 Sprint 处理时机 |
|---|---|---|
| **Codex 评审 4+5 commits 顺延** | Pro daily quota 触顶 | **Day 1 处理 ✅** |
| **真 LLM 接入 AI Advisor** | Sprint 9a Day 6-7 Stub | **Day 3-5 处理 ✅** |
| **完整 SY-02 SystemDictionary 表** | Sprint 9a Day 3 IOptions 精简版 | **Day 6-7 处理 ✅** |
| **C-02.PaidAmount reconciliation 集成单测** | Sprint 8a Day 9 顺延 | **Day 8 处理 ✅** |
| **C-09 月末批处理循环 Org** | Sprint 8a Day 6 placeholder | **Day 8 处理 ✅** |
| **SafetyStock=0 两 path 对齐** | b 子代理 R-07 Day 4 报告 | **Day 8 处理 ✅** |
| **E-13 EquipmentDepreciation 接通** | Sprint 8a Day 6 占位 | 跨 Sprint 与 8b 协同（不在本卡）|

---

## 五、资源 / 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | Anthropic.SDK 与 .NET 10 / ABP 10.1 兼容 | 中 | Day 3-1 第一动作做 spike（Hello World 调用），不兼容退到 1B 自封装 |
| 2 | Claude API 单测无真 API key（CI 跑不动）| 中 | mock HttpMessageHandler + 录制响应 fixture（参考 RealTenderPlatformApiService_Tests 模式）|
| 3 | SY-02 表运行时切换不破现有 Detector 单测 | 中 | ISettingProvider 默认提供 IOptions 兼容 fallback；Detector 测试无需改 |
| 4 | Codex 9 commits 累计 finding 过多 | 中 | Day 2 留缓冲 buffer 处理 P1；P2 累计记入 Sprint 11 |
| 5 | 实时触发钩子线程安全（Hangfire + ApplyDelta 并发）| 中 | Day 8 第一动作 review；如严重则加 SemaphoreSlim per (org, warehouse, material) |

---

## 六、版本沿革

| 版本 | 日期 | 主要变更 |
|---|---|---|
| V0.1 | 2026-05-13 | 首版草案，基于 Sprint-9a-Demo-V0.1 D10 验收物起。7 类候选范围 ~11 PD（需收口到 10）。5 决策点待评审。Sprint 9a 决策点接收记入 §四（7 项）。重点：A Codex 9 commits 消化 + B 真 LLM 接入 + C SY-02 完整化 + D-G 累计技术债扫尾。|
