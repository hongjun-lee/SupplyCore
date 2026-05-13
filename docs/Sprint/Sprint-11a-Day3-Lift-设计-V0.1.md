# Sprint 11a Day 3-5 Lift 设计草案 — 详设 11 完整 LLM 编排（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 11a Day 3-5 实施细化设计
**配套：** [`Sprint-11a-任务卡-V0.1.md`](./Sprint-11a-任务卡-V0.1.md) §1.1 B
**衔接：** Sprint 10a Day 3 LLM Provider Lift（`c1667b9`）已落地 — 本期继续 Lift Catio Nova.AiAssistant 的 Tool 编排能力

---

## 一、Lift 范围（6 文件 Lift + 1 原创）

按 Catio 探查结果 + SupplyCores 业务需求精简：

| # | Catio 源文件 | SupplyCores 目标 | 处理方式 | 工时 |
|---|---|---|---|---|
| 1 | `Nova.AiAssistant.Domain/Tools/IAiTool.cs` | `Nova.SupplyCores.Domain/Llm/Tools/IAiTool.cs` | **Lift**（namespace rename）| 0.1 PD |
| 2 | `Nova.AiAssistant.Domain/Tools/ToolResult.cs` | `Nova.SupplyCores.Domain/Llm/Tools/ToolResult.cs` | **Lift** | 0.1 PD |
| 3 | `Nova.AiAssistant.Domain/Tools/AiToolAttribute.cs` | `Nova.SupplyCores.Domain/Llm/Tools/AiToolAttribute.cs` | **Lift** | 0.1 PD |
| 4 | `Nova.AiAssistant.Application/Tools/ToolRegistry.cs` | `Nova.SupplyCores.Application/Llm/Tools/ToolRegistry.cs` | **Lift** | 0.2 PD |
| 5 | `Nova.AiAssistant.Application/Chat/SystemPromptBuilder.cs` | `Nova.SupplyCores.Application/Llm/SystemPromptBuilder.cs` | **Lift + 改造**（去 Catio 业务上下文，加 SupplyCores 上下文）| 0.3 PD |
| 6 | `Nova.AiAssistant.Application/Chat/ChatAppService.cs` 的**多 Tool 调用循环**（L80-262 节选） | `Nova.SupplyCores.Application/Llm/AdvisorOrchestrator.cs` | **Lift 核心算法 + 简化**（不引 ChatSession/ChatMessage 持久化，stateless 单次请求内多轮）| 0.7 PD |
| 7 | **不在 Catio 中** | `Nova.SupplyCores.Domain/Auditing/AiCallLog.cs` + Manager + Migration Wave 72 | **原创设计**（详设 11 §13 5 年留存）| 0.5 PD |

**总 Lift+原创 ~2 PD**（Sprint-11a-V0.1 §1.1 B 预算 3 PD，剩 1 PD 给 Tool 实现 + 测试）。

---

## 二、Lift 文件细节

### 2.1 IAiTool 接口（Domain/Llm/Tools/IAiTool.cs）

```csharp
namespace Nova.SupplyCores.Llm.Tools;

public interface IAiTool
{
    /// <summary>工具唯一名（snake_case，如 "list_report_alerts"）。</summary>
    string Name { get; }

    /// <summary>对 LLM 的功能描述（中文，含使用场景示例）。</summary>
    string Description { get; }

    /// <summary>JSON Schema 定义入参格式（OpenAI tool_calls 规范）。</summary>
    JsonElement ParametersSchema { get; }

    /// <summary>异步执行。返回 ToolResult（Success + Data 或 Error + Sensitive 标记）。</summary>
    Task<ToolResult> ExecuteAsync(JsonElement parameters, CancellationToken cancellationToken = default);
}
```

### 2.2 ToolResult（Domain/Llm/Tools/ToolResult.cs）

```csharp
public class ToolResult
{
    public bool Success { get; init; }
    public object? Data { get; init; }
    public string? Error { get; init; }

    /// <summary>敏感数据标记（如供方银行账号 / 押金金额 / 内部价格）— 写 a.ai_call_log 时脱敏。</summary>
    public bool Sensitive { get; init; }

    public static ToolResult Ok(object? data = null, bool sensitive = false)
        => new() { Success = true, Data = data, Sensitive = sensitive };

    public static ToolResult Fail(string error)
        => new() { Success = false, Error = error };
}
```

### 2.3 AiToolAttribute（自动扫描注册）

```csharp
[AttributeUsage(AttributeTargets.Class)]
public sealed class AiToolAttribute : Attribute
{
    public string Name { get; }
    public string Description { get; }
    public AiToolAttribute(string name, string description)
    {
        Name = name;
        Description = description;
    }
}
```

模块注册（NovaSupplyCoresApplicationModule.cs ConfigureLlm 扩展）：

```csharp
// 扫描程序集 → 找出所有 [AiTool] + IAiTool 实现 → 注册 Transient + ToolRegistry
foreach (var toolType in typeof(NovaSupplyCoresApplicationModule).Assembly.GetTypes()
    .Where(t => typeof(IAiTool).IsAssignableFrom(t) && !t.IsAbstract))
{
    services.AddTransient(toolType);
    services.AddTransient(typeof(IAiTool), toolType);
}
services.AddSingleton<ToolRegistry>();
```

### 2.4 ToolRegistry（Application/Llm/Tools/ToolRegistry.cs）

```csharp
public class ToolRegistry
{
    private readonly Dictionary<string, IAiTool> _tools;
    private readonly ILogger<ToolRegistry> _log;

    public ToolRegistry(IEnumerable<IAiTool> tools, ILogger<ToolRegistry> log)
    {
        _tools = tools.ToDictionary(t => t.Name, StringComparer.Ordinal);
        _log = log;
    }

    /// <summary>导出所有 Tool 定义供 LlmRequest.Tools 字段。</summary>
    public List<LlmToolDefinition> GetAllToolDefinitions() => _tools.Values
        .Select(t => new LlmToolDefinition { Name = t.Name, Description = t.Description, Parameters = t.ParametersSchema })
        .ToList();

    public IAiTool? GetTool(string name) => _tools.TryGetValue(name, out var t) ? t : null;

    /// <summary>执行工具 — 异常 + 时长记录走 AiCallLog。</summary>
    public async Task<ToolResult> ExecuteToolAsync(string name, JsonElement args, CancellationToken ct = default)
    {
        if (!_tools.TryGetValue(name, out var tool))
        {
            return ToolResult.Fail($"Unknown tool: {name}");
        }
        try
        {
            return await tool.ExecuteAsync(args, ct);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "[Tool] {Name} 执行异常", name);
            return ToolResult.Fail(ex.Message);
        }
    }
}
```

### 2.5 SystemPromptBuilder 改造（去 Catio 业务上下文）

Catio 的 SystemPromptBuilder 注入工资项 / 货场 / 业务类型等 — SupplyCores **完全不复用**这些，但保留**架构模板**：缓存 30 min + 动态拼字符串。

SupplyCores 版本注入：
- 当前角色（采购助手 / 履约助手 / 合同助手 — 按调用方区分）
- SY-02 当前阈值快照（PaymentDueAlertDays / BondReleaseAlertDays / ContractExpiryAlertDays 等）
- 可调用 Tool 列表 + 使用规则（"请优先使用 Tool 查实时数据，而非依赖训练数据"）

### 2.6 AdvisorOrchestrator（Lift 核心算法简化版）

Catio ChatAppService 是 1100 行的"完整 chat 服务"（含 session 持久化 / 流式响应 / DSML 工具调用解析 / fallback / 文本清洗）。SupplyCores **不引完整版**，只 Lift 多轮 Tool 调用编排（L80-262 节选）：

```csharp
public class AdvisorOrchestrator : ITransientDependency
{
    private const int MaxToolRounds = 5;

    private readonly LlmProviderFactory _factory;
    private readonly ToolRegistry _toolRegistry;
    private readonly IAiCallLogManager _auditLog;
    private readonly SystemPromptBuilder _promptBuilder;
    private readonly ILogger<AdvisorOrchestrator> _log;

    /// <summary>
    /// 单次请求内多轮 Tool 调用编排。stateless — 不持久化 ChatSession。
    /// 最大轮数 5（参考 Catio）；超出回 fallback MockStub 兜底（与 Sprint 10a 一致）。
    /// </summary>
    public async Task<AdvisorAnswer> RunAsync(
        string role,
        string userQuestion,
        List<AdvisorEvidenceItem> initialEvidence,
        CancellationToken ct = default)
    {
        var primary = _factory.CreatePrimary();
        var messages = new List<LlmMessage>
        {
            new() { Role = "user", Content = userQuestion },
        };

        var sw = Stopwatch.StartNew();
        for (var round = 0; round < MaxToolRounds; round++)
        {
            var request = new LlmRequest
            {
                SystemPrompt = await _promptBuilder.BuildAsync(role, ct),
                Messages = messages,
                Tools = _toolRegistry.GetAllToolDefinitions(),
            };

            var resp = await primary.CompleteAsync(request, ct);

            // 若 LLM 给出 ToolCalls → 逐个执行 → 把结果追加 message 继续下一轮
            if (resp.ToolCalls is { Count: > 0 })
            {
                foreach (var call in resp.ToolCalls)
                {
                    var result = await _toolRegistry.ExecuteToolAsync(call.Name, call.Arguments, ct);
                    await _auditLog.LogAsync(call.Name, call.Arguments, result, sw.ElapsedMilliseconds);
                    messages.Add(new LlmMessage
                    {
                        Role = "tool",
                        ToolCallId = call.Id,
                        Content = JsonSerializer.Serialize(result.Sensitive ? new { masked = true } : result.Data),
                    });
                }
                continue;
            }

            // 无 ToolCalls + 有文本 → 终止
            if (!string.IsNullOrWhiteSpace(resp.Content))
            {
                sw.Stop();
                return new AdvisorAnswer
                {
                    Suggestion = resp.Content,
                    Confidence = 0.9m,  // 高于 Sprint 10a 单 Tool LLM 0.85 — 多 Tool 协同更可信
                    Evidence = initialEvidence,
                    DurationMs = sw.ElapsedMilliseconds,
                    IsFallback = false,
                };
            }
        }

        // 5 轮内未收敛 → 走 MockStub 兜底（Sprint 10a 同模式）
        return await FallbackToMockStubAsync(role, userQuestion, initialEvidence);
    }
}
```

**简化点对比 Catio**：
- ❌ 不 Lift 流式响应（SSE）— SupplyCores Advisor 是请求-响应模式，不需要流
- ❌ 不 Lift DSML/XML 工具调用解析（Catio 兼容 DeepSeek 旧版本，新版 v3 已统一 JSON）
- ❌ 不 Lift ChatSession/ChatMessage 持久化（无聊天会话语义）
- ❌ 不 Lift 用户手动 ProviderOverride（SupplyCores 用 LlmProviderFactory 自动 fallback）
- ✅ Lift 多轮 Tool 调用循环（核心算法）
- ✅ Lift SystemPromptBuilder 模板（缓存 + 上下文注入架构）
- ✅ Lift fallback 链（primary → fallback LLM → MockStub）— Sprint 10a 已有

---

## 三、原创：AiCallLog entity（Catio 缺）

详设 11 §13 要求 5 年留存 LLM + Tool 调用审计。Catio 仅 ChatMessage.ToolCalls JSON 序列化，不够规范。

### 3.1 Entity（Domain/Auditing/AiCallLog.cs）

```csharp
public class AiCallLog : SupplyCoresFullAuditedAggregateRoot<long>
{
    /// <summary>调用类型：LlmComplete / ToolCall（区分顶层 LLM 调用 vs 工具调用）。</summary>
    public string CallType { get; protected set; } = null!;

    /// <summary>Tool 名 或 LLM Provider 名。</summary>
    public string Target { get; protected set; } = null!;

    /// <summary>Role（Advisor 角色 / Orchestrator 编排器）。</summary>
    public string? Role { get; protected set; }

    /// <summary>入参（敏感数据自动脱敏 — Tool.Sensitive=true 时仅记 {"masked": true}）。</summary>
    public string? RequestPayload { get; protected set; }

    /// <summary>响应（同上脱敏规则）。</summary>
    public string? ResponsePayload { get; protected set; }

    /// <summary>Token 用量（Llm 调用时记录，Tool 调用为 null）。</summary>
    public int? PromptTokens { get; protected set; }
    public int? CompletionTokens { get; protected set; }
    public int? TotalTokens { get; protected set; }

    /// <summary>执行耗时毫秒。</summary>
    public long DurationMs { get; protected set; }

    /// <summary>是否成功。</summary>
    public bool Success { get; protected set; }

    /// <summary>失败原因（HTTP error / Tool exception）。</summary>
    public string? ErrorMessage { get; protected set; }

    /// <summary>会话关联 ID（同次 Orchestrator.RunAsync 内多次调用共享，便于 trace 跨 Tool 调用）。</summary>
    public string TraceId { get; protected set; } = null!;
}
```

### 3.2 Schema (Wave 72 — `a.ai_call_log`)

```sql
CREATE TABLE a.ai_call_log (
    id BIGSERIAL PRIMARY KEY,
    call_type VARCHAR(16) NOT NULL,
    target VARCHAR(64) NOT NULL,
    role VARCHAR(32),
    request_payload TEXT,
    response_payload TEXT,
    prompt_tokens INT,
    completion_tokens INT,
    total_tokens INT,
    duration_ms BIGINT NOT NULL,
    success BOOLEAN NOT NULL,
    error_message VARCHAR(512),
    trace_id VARCHAR(36) NOT NULL,
    -- 审计字段（FullAudited 标准）
    creation_time TIMESTAMPTZ NOT NULL,
    creator_id UUID,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    ...
);
CREATE INDEX IX_ai_call_log_target ON a.ai_call_log(target);
CREATE INDEX IX_ai_call_log_trace_id ON a.ai_call_log(trace_id);
CREATE INDEX IX_ai_call_log_creation_time ON a.ai_call_log(creation_time);
```

### 3.3 AiCallLogManager + AppService (Day 5)

- IAiCallLogManager.LogAsync(...) — Orchestrator 内部调用
- IAiCallLogAppService — 查询接口（按 trace_id / target / 时间区间）
- TokenUsageDailyAggregator — 日 / Org / Tool 维度聚合（D5-1）

---

## 四、Day 3-5 业务 Tool 候选清单（≥3 个起步）

| Tool Name | 调用场景 | 接口 | 复杂度 |
|---|---|---|---|
| `list_report_alerts` | LLM 问"本月待处理预警" → 按 AlertCode / 时间窗 / OrgId 查 R-04~R-08 | IReportAlertRepository | 低 |
| `get_system_config` | LLM 问"当前 R-04 触发阈值多少" → 读 sy.system_config | ISystemConfigProvider | 低 |
| `get_contract_details` | LLM 处置 R-06 时调 → 查 C-02 字段 | IRepository<Contract, long> | 中 |
| `get_payment_plan_summary` | LLM 处置 R-04 时调 → 查 C-07 + 关联 C-08 状态 | IRepository<PaymentPlan, long> + ... | 中 |
| `get_supplier_quality_summary` | LLM 处置 R-05/R-06 时调 → 查 M-11 评分 | IRepository<Supplier, long> | 中 |

**Day 3-5 实施建议**：先做 3 个低复杂度 Tool（`list_report_alerts` / `get_system_config` / `get_contract_details`）做"端到端编排可用"基线，剩留 Day 4-5 buffer 或 Sprint 12a。

---

## 五、测试规划（≥10 测试）

| 类别 | 测试数 | 覆盖 |
|---|---|---|
| IAiTool 单元测试 | 3 | 每个 Tool 单独的 input/output 契约 |
| ToolRegistry 单元测试 | 3 | Register / GetByName / 异常处理 |
| AdvisorOrchestrator 单元测试 | 4 | 单轮 / 多轮 / 5 轮上限 / MockStub 兜底 |
| AiCallLog 单元测试 | 2 | LogAsync + 脱敏 |
| Sprint11aLlmOrchestration_E2E (Day 9) | 3 | 多 Tool 协同 + 工作流编排 + token 聚合 |
| **合计** | **15** | |

---

## 六、依赖 + 风险

### 6.1 依赖
- Sprint 10a Day 3 LLM Provider Lift（已落）
- Sprint 10a Day 6-7 SY-02 SystemConfig（已落，供 GetSystemConfigTool 调用）
- ReportAlert entity（Sprint 7a/9a 已落，供 ListReportAlertsTool 调用）

### 6.2 风险
| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | Catio AdvisorOrchestrator 简化版可能漏掉关键 corner case（如 ToolCallId 不匹配）| 中 | 单测覆盖 + Sprint 9 E2E mock 多轮响应 |
| 2 | AiCallLog 写入失败应不阻断 LLM 主流程 | 低 | LogAsync 内部 try/catch；与 Sprint 10a InventoryLowStockDetector hook 同模式 |
| 3 | Tool 实现需访问跨域 Repository（M-11 供方 / C-02 合同），违反 Domain Service 边界 | 中 | Tool 放 Application 层（非 Domain Service），允许跨域查询 |
| 4 | LLM 5 轮上限 + DeepSeek 慢响应导致整体超时 | 中 | Per-call timeout 30s（Sprint 10a 已设）+ 整体超时 60s |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 首版草案。基于 Catio Nova.AiAssistant 探查结果。6 Lift + 1 原创（AiCallLog）+ ≥3 Tool 起步 + ≥10 测试规划。总 Day 3-5 工时 ~3 PD，与 Sprint-11a-V0.1 §1.1 B 一致。等 cici 评审 V0.2 锁版。|
