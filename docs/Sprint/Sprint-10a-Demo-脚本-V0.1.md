# Sprint 10a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 10a 验收演示脚本
**配套：** [`Sprint-10a-任务卡-V0.3.md`](./Sprint-10a-任务卡-V0.3.md)

---

## 一、Sprint 10a 落地范围

按 V0.3 锁版 5 决策点（1C / 2B / 3A / 4B / 5B），本 Sprint 实际交付 **~10 PD**：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D3 | Lift Catio LlmProvider → 国产 DeepSeek + Qwen 接入（V0.3 决策点 1C，8 测试） | `c1667b9` | a |
| D4-5 | 国产 LLM Advisor 三件套（R-04/R-05/R-06）+ 三级 fallback + 中文 Prompt（9 测试） | `519ee83` | a |
| D4-5 后 | 复用 Catio ApiKey（appsettings.secrets.json）→ Host 启动即真接 LLM | — (secrets 不入仓) | a |
| D6-7 | SY-02 SystemConfig 完整化 — Wave 71 sy.system_config + Seed 6 + Provider（DB-first + 60s TTL + IOptions fallback）+ AppService + 5 Detector 改造（13 测试） | `eb36cda` → `ccf7ff0` 重命名 | a |
| D8 | SY-02 命名修订（Dictionary → Config，详设 01/11 对齐）+ SafetyStock=0 两 path 对齐 + StockBalanceUpdater 线程安全 review + C-02.PaidAmount reconciliation 4 测试 + C-09 BatchRunner 接通真 Org 循环 + 4 测试 | `ccf7ff0` | a |
| D9 | 集成 E2E — Sprint10aLlmAdvisor_E2E（5 测试）+ Sprint10aSY02Config_E2E（6 测试）| `ad1bdfb` | a |
| D10 | Demo-10a + Sprint-11a 草案 | 本文档 | a |

**测试基线演进**：
- Sprint 9a D9 收尾：1139 → 1156（+17 Sprint 9a Web.Tests/E2E）
- Sprint 10a D3：1156 → 1156（+8 LLM Provider，0 净增因 D2 Codex 修复未做）
- Sprint 10a D4-5：1156 → 1156（+9 LlmAdvisor，0 净增）
- Sprint 10a D6-7：1156 → 1169（+13 SY-02）
- Sprint 10a D8：1169 → 1178（+9 reconciliation + BatchRunner + InventoryLowStock null fallback）
- **Sprint 10a D9：1178 → 1189**（+11 LlmAdvisor E2E 5 + SY-02 E2E 6）

**协同节奏**：本 Sprint 主要 a 单人主线（cici memory 上 sweet spot 3.8x 未触发并行，因任务多为编排 / 接通 / 测试增量，依赖紧）。

**Codex 评审延后**：Pro daily quota 持续触顶（Sprint 9a 已撞过）。累计 14 commits 待评审顺延 Sprint 11a Day 1。

---

## 二、回归用例（Sprint 1-9 已落 56 项）

承接 Sprint-9a-Demo 共 56 项。本期新增 Sprint 10a 8 项（用例 57-64）。

---

## 三、Sprint 10a 新增 Demo 用例（57-64）

### 用例 57：国产 LLM 三 Advisor 端到端（V0.3 决策点 1C）⭐ 真接路径

启动 Web Host（`appsettings.secrets.json` 含 DeepSeek/Qwen ApiKey）后调用 R-04/R-05/R-06 任一 AppService：

```csharp
// AppService 编排：触发 detector → AI Advisor 给出处置建议
var ctx = new PaymentDueAdvisorContext
{
    OrgId = 100, PaymentPlanId = 1001, ContractId = 200,
    PlanAmount = 50000m, CumulativePaidAmount = 10000m, DaysToDue = 3,
};
var ans = await _paymentAdvisor.AskAsync(ctx);

// 期望（DeepSeek 主路径成功）：
//   ToolName="R-04-PaymentDueAdvisorLlm-primary"
//   Confidence=0.85（LlmAdvisorHelper.LlmConfidence）
//   IsFallback=false
//   Suggestion 中文 markdown — 3-5 条建议（资金到位 / 银行付款提前期 / 供方沟通 / 已过期风险）
//   Evidence 引用 C-07 PaymentPlanId + C-02 ContractId
//   DurationMs > 0
```

### 用例 58：LLM 三级 fallback 链（V0.3 决策点 3A）

DeepSeek 不可达（503）+ Qwen 不可达（504）→ 自动降级 MockStub：

```csharp
// 模拟 DeepSeek + Qwen API 都失败（mock HttpMessageHandler 队列 6 个 5xx 响应）
// 三个 Advisor (R-04 / R-05 / R-06) 都走 MockStub 兜底
var pAns = await _paymentAdvisor.AskAsync(ctx);
var bAns = await _bondAdvisor.AskAsync(bondCtx);
var cAns = await _contractAdvisor.AskAsync(contractCtx);

// 期望：
//   IsFallback=true
//   ToolName 后缀 "-MockFinalFallback"
//   Confidence=0.6（MockStub 默认）
//   Suggestion 含 mock 输出特征（"40,000.00" 剩余 / "30,000.00" 押金 / "85.0%" 执行率）
//   DurationMs 记录完整三段尝试耗时
```

### 用例 59：混合三状态 fallback 共存

同一批 Detector 触发，每个 Advisor 走不同 fallback 等级：

| Advisor | DeepSeek | Qwen | 实际路径 | ToolName 后缀 |
|---|---|---|---|---|
| R-04 PaymentDue | ✅ | — | primary | `-primary` |
| R-05 BondRelease | ❌ | ✅ | fallback LLM | `-fallback` |
| R-06 ContractExpiry | ❌ | ❌ | MockStub 兜底 | `-MockFinalFallback` |

验证：三种状态可共存于同次扫描；前端可按 IsFallback / ToolName 区分置信度展示。

### 用例 60：SY-02 sy.system_config 动态阈值即时生效 ⭐ 决策点 2B

管理员通过 AppService 改阈值 → Provider Invalidate → 下次 Detector 立即读到新值：

```http
PUT /api/app/system-config/set
{
    "code": "PAYMENT_DUE_ALERT_DAYS",
    "value": "14",
    "dataType": "Int",
    "isActive": true
}
```

```csharp
// 改前：阈值 7 → AppService.SetAsync 改为 14
var beforeAdjust = _provider.GetInt(SystemConfigConsts.Keys.PaymentDueAlertDays, 0);  // → 7
await _appService.SetAsync(new SetSystemConfigDto { Code = "PAYMENT_DUE_ALERT_DAYS", Value = "14", ... });
var afterAdjust = _provider.GetInt(SystemConfigConsts.Keys.PaymentDueAlertDays, 0);   // → 14（无需重启）

// 跨字段独立缓存：只 Invalidate 修改的 key，其他字段缓存保留
```

撤回字典项（IsActive=Disabled）→ 自动 fallback 到 IOptions.SupplyCoresAlertSettings 兼容值。

### 用例 61：SafetyStock=0 两 path 行为对齐 ⭐ 决策点 5B P1

```csharp
// M-05 SafetyStock = 0 表示"用户明确不预警"（非"未配置"）
CreateMaterial(safetyStock: 0m);

// Hangfire 批扫 path
var batchCount = await _detector.DetectAndAlertAsync();
batchCount.ShouldBe(0);  // 阈值 0 → AvailableQuantity >= 0 永真 → 跳过

// StockBalanceUpdater 实时 hook path
await sut.ApplyDeltaAsync(OutboundInput(qty: 150m));
_alerts.Count.ShouldBe(0);  // 同样跳过 — 两 path 行为一致

// SafetyStock=null 才回退 DefaultSafetyStockThreshold=100
CreateMaterial(safetyStock: null);
// → AvailableQuantity 50 < 100 → 触发预警
```

### 用例 62：C-02.PaidAmount reconciliation 守护（Sprint 8a 顺延闭环）

reconciliation 公式作为不变量在测试层守护：

- **F-1 正向**：`Contract.PaidAmount = SUM(C-07.CumulativePaidAmount WHERE ContractId)`
- **F-2 反向**：`C-07.CumulativePaidAmount = SUM(C-10.ActualPaymentAmount WHERE state=Paid)`

```csharp
contract.AddPayment(40000m); plan1.ApplyPayment(40000m);
contract.AddPayment(20000m); plan2.ApplyPayment(20000m);

var sum = SumPlanCumulativePaid(plans, contractId: 1L);
contract.PaidAmount.ShouldBe(sum);  // F-1 守护

// 偏差检测：若 AppService 漏调 contract.AddPayment → sum - contract.PaidAmount ≠ 0
// reconciliation Job 周期跑 → 告警 + 人工排查
```

### 用例 63：C-09 月末批处理循环 Org 接通（Sprint 8a placeholder 顺延）

Hangfire `C-09-MonthlyPrepayment` cron 触发 → BatchRunner 取所有启用 Org → per-Org 调 GenerateAsync：

```csharp
// SupplyCoresRecurringJobHandlers.RunMonthlyPrepaymentGenerateAsync
//   → IMonthlyPrepaymentSummaryBatchRunner.RunForAllOrgsAsync(generateDate)
//   → 仅启用 Org 入循环（停用 / 待审跳过）
//   → 单 Org 失败 catch + log + continue（不阻断后续 Org）
//   → 返回 BatchRunResult { TotalOrgs, SuccessOrgs, FailedOrgs, FailedOrgErrors[], TotalSummariesGenerated }

// 用例验收：mock 3 个启用 Org，Org#2 失败 → 期望
//   TotalOrgs=3 / SuccessOrgs=2 / FailedOrgs=1
//   FailedOrgErrors[0] = { OrgId: 2, OrgName: "Org B 失败", ErrorMessage: ... }
//   Org#1 + Org#3 各 2 条汇总入 sy 表（共 4 条）
```

### 用例 64：StockBalanceUpdater 实时触发钩子线程安全评估（决策点 5B P1）

Sprint 10a Day 8 review 结论留痕到代码注释（不动代码）：

> **并发场景**：Hangfire 批扫 `DetectAndAlertAsync` 与业务出库 hook `DetectForBalanceAsync` 可能在同一 dedup 窗口内同时通过去重判定 → 产生 2 条同 (balanceId) 的 R-07 alert。
>
> **评估**：触发概率极低（Hangfire 每日 cron + 同物料瞬时并发窗口 < 1s）；影响仅是重复预警，不影响业务正确性。
> **严重性**：P2，留 Sprint 11 评估升级方案。
>
> **候选缓解**（Sprint 11 决策）：
> - A. SemaphoreSlim per (orgId, warehouseId, materialId)
> - B. DB 唯一约束 on (alertCode, sourceBillType, sourceBillId) WHERE state=Pending
> - C. 现状（应用层去重 + try/catch）+ 监控

---

## 四、Sprint 10a 协同回顾

| 节点 | 实测 | 备忘 |
|---|---|---|
| **a 单人主线** | D3-D10 共 5 commit | 任务多为编排 / 接通 / 测试增量，依赖紧；未拆 b/c 子代理 |
| **外部 reviewer 改名干预** | D6-7 commit 后 SystemDictionary → SystemConfig 自动改名（详设 01/11 对齐） | cici 评审决策"接受"；D8 commit 合入改名 + Wave 71 重生成 |
| **Codex 评审持续触顶** | Pro daily quota 第 3 次撞顶（Sprint 9a 已撞过） | 累计 14 commits 顺延 Sprint 11a Day 1（4 类提醒：关键模块/详设升版/Sprint 收尾/累计 ≥2 次跳过）|

---

## 五、技术债 + 顺延项

| 项 | 来源 | 顺延 |
|---|---|---|
| **Codex 评审 Sprint 8a/9a/10a 累计 14 commits** | Pro daily quota 持续触顶 | **Sprint 11a Day 1**（一次性消化 + 分批跑）|
| **StockBalanceUpdater 实时触发钩子线程安全升级** | D8-2 评估 P2 | Sprint 11a — 决定走 SemaphoreSlim / DB 唯一约束 / 现状 |
| **DefaultSafetyStockThreshold=100 fallback 删除** | M-05 阈值字段已稳定 | Sprint 11a — 评估去掉 const fallback |
| **E-13 EquipmentDepreciation 接通真 Manager** | Sprint 8a Day 6 placeholder | Sprint 8b Day 2 / Sprint 11a 协同 |
| **详设 11 完整 LLM 编排（多 Tool 协同 + AI 工作流）** | Sprint 10a Stub→真接闭环后下一阶段 | Sprint 11a 候选 ⭐ 优先 |
| **Real LLM 集成 E2E（含真 ApiKey + token 用量监控）** | Sprint 10a D9 E2E 用 mock HttpHandler | Sprint 11a — 接通真 DeepSeek/Qwen 调用 + 监控指标 |
| **SY-02 完整 Scope 过滤（ConfigScope=组织/模块）** | Sprint 10a 仅启用 Global Scope | Sprint 11a — 按 Org 注入差异化配置 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | Sprint 10a 收尾 Demo 起。V0.3 锁版 5 决策点（1C 国产 LLM Lift / 2B SY-02 精简 / 3A MockStub 兜底 / 4B Codex 分批 / 5B 仅 P1 技术债）全交付。范围 D3-D9 完整 + Codex 评审 9 commits 顺延 Sprint 11a。8 新增用例 57-64 覆盖：国产 LLM 三 Advisor / 三级 fallback / SY-02 动态阈值 / SafetyStock=0 对齐 / reconciliation 守护 / C-09 BatchRunner / 线程安全评估。测试基线 1156 → 1189（+33）。 |
