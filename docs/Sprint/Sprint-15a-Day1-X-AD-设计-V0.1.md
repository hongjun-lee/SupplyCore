# Sprint 15a Day 1-X A+D 双轨 — 实施设计草案（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 15a A+D 双轨实施细化设计
**配套：** [`Sprint-15a-任务卡-V0.2.md`](./Sprint-15a-任务卡-V0.2.md) §一A + §一D + 详设 08 V1.1 §5.2

---

## 一、范围（A+D 双轨，~11 PD · 主代理 a + 子代理 b + c 三轨并行）

### A 主线：剩余 14 BIZ 接口（~3-4 PD · 主代理 a）

详设 08 §5.2 共 20 BIZ。Sprint 14a 已落 4 个（BIZ-001/005/014/020）。Sprint 15a 一期聚焦剩 14 中的 **8 个**核心：

| # | Code | 业务实体 | 触发时机 | 一期落 |
|---|---|---|---|---|
| 1 | BIZ-002 | 采购入库（暂估）| 月末暂估批 | ✅ |
| 2 | BIZ-003 | 暂估红字冲销 | 次月初 | ✅ |
| 3 | BIZ-004 | 采购退货 | 退货单审 | ✅ |
| 4 | BIZ-006 | 退料入库 | 退料单审 | ✅ |
| 5 | BIZ-007 | 跨组织调拨 | 调出+调入签收 | ✅ |
| 6 | BIZ-008 | 盘盈处理 | 盘盈审 | ✅ |
| 7 | BIZ-009 | 盘亏处理 | 盘亏审 | ✅ |
| 8 | BIZ-019 | 委托加工财务触发 | 加工费确认 | ✅ |

**一期顺延 Sprint 16a**：BIZ-005A 对厂矿销售出库 / BIZ-010~013 废旧/危险品/火工品 / BIZ-015~018 预付款核销/让步/安全/低耗摊销

### D 子代理 b：NcInterfaceHttpClient 真接通（~3-4 PD）

Sprint 14a 仅 NcInterfaceMockClient。Sprint 15a 加真 HTTP 实现 + Polly retry + Mock↔Real 配置切换。

### 累计技术债（~2.3 PD · 子代理 c）

| # | 项 | 工时 |
|---|---|---|
| 1 | NcInterfaceHttpClient 真接通（融入 D 子代理 b 范围）| 1-1.5 PD（D 内）|
| 2 | NC 异常场景压测（断网 / 5XX / 慢响应）| 0.5-1 PD |
| 3 | InterfaceMonitor cross-org RBAC scope | 0.5 PD |
| 4 | Wave 84 PG timezone NOTICE | 0.3 PD |

合计 ~1.3-1.8 PD（NcInterfaceHttpClient 在 D 范围内不重复算）

---

## 二、A 主线 — 8 个 BIZ Contributor 模板（~3-4 PD）

复用 Sprint 14a IInterfaceContributor + ContributorPayloadHelper 模式。每个 Contributor 约 0.4 PD（含测试）：

| Contributor | 业务实体 | InterfaceId（F-14 seed） |
|---|---|---|
| Biz002InventoryEstimateContributor | inventory_estimate (S-07) | 14 |
| Biz003InventoryEstimateReversalContributor | estimate_reversal (S-07) | 15 |
| Biz004PurchaseReturnContributor | purchase_return (S-06) | 16 |
| Biz006MaterialReturnContributor | material_return (S-10) | 17 |
| Biz007CrossOrgTransferContributor | cross_org_transfer (S-12) | 18 |
| Biz008StockGainContributor | stock_gain (S-17) | 19 |
| Biz009StockLossContributor | stock_loss (S-18) | 20 |
| Biz019OutsourcedProcessingContributor | outsourced_processing | 21 |

**实现模式**（统一）：
- 构造注入 InterfaceTaskManager + INcInterfaceClient + IRepository<InterfaceMessage> + ILogger
- CreateTaskAsync 幂等键 = "BIZ-XXX:{business_entity}:{businessId}"
- InvokeAsync 走 ContributorPayloadHelper.ResolvePayloadAsync + try/catch retry（已修 Codex 14a P1）
- WriteReceiptAsync 写 F-03 + ABP UoW

**测试**：每 Contributor 2 测试（CreateTask 业务实体 / InvokeAsync 成功路径）= 16 测试

---

## 三、D 子代理 b — NcInterfaceHttpClient 真接通（~3-4 PD）

### 3.1 范围

| Task | 内容 | 工时 |
|---|---|---|
| D-1 | NcInterfaceHttpClient（HttpClientFactory + Polly retry + 幂等键 header） | 1-1.5 PD |
| D-2 | NC API endpoint + 认证（Bearer/OAuth2 — 暂用 appsettings stub） | 0.5 PD |
| D-3 | Polly 重试策略（exponential backoff + 熔断 + timeout） | 0.5 PD |
| D-4 | NC 异常场景压测（断网 / 5XX / 慢响应 / 熔断触发） | 0.5-1 PD |
| D-5 | Mock↔Real 配置切换 + DI 注册升级（NcInterface:UseMock=false → Real） | 0.3 PD |
| D-6 | 测试 ≥ 6（成功 / retry / 熔断 / timeout / Mock↔Real 切换） | 0.5 PD |

### 3.2 关键设计

```csharp
public class NcInterfaceHttpClient : INcInterfaceClient
{
    public const string HttpClientName = "nc-interface";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly NcInterfaceOptions _options;
    private readonly IAsyncPolicy<HttpResponseMessage> _resilientPolicy;

    public NcInterfaceHttpClient(
        IHttpClientFactory httpClientFactory,
        IOptions<NcInterfaceOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
        _resilientPolicy = BuildResilientPolicy();
    }

    private static IAsyncPolicy<HttpResponseMessage> BuildResilientPolicy()
    {
        // Polly：retry (3 次 exponential) + CircuitBreaker (5 次失败熔断 30s) + Timeout (30s)
        return Policy.WrapAsync(
            Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(30)),
            Policy.Handle<HttpRequestException>()
                .OrResult<HttpResponseMessage>(r => r.StatusCode >= HttpStatusCode.InternalServerError)
                .WaitAndRetryAsync(3, retry => TimeSpan.FromSeconds(Math.Pow(2, retry))),
            Policy.Handle<HttpRequestException>()
                .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));
    }

    public async Task<NcResponse> InvokeAsync(string interfaceCode, object requestBody, string idempotencyKey, CancellationToken ct = default)
    {
        var client = _httpClientFactory.CreateClient(HttpClientName);
        // POST {_options.BaseUrl}/{interfaceCode} with X-Idempotency-Key + JSON body
        // ...
    }
}
```

### 3.3 配置

```jsonc
// appsettings.json
"NcInterface": {
    "UseMock": false,  // Sprint 15a 默认 false（生产用真接通）
    "BaseUrl": "https://nc.fukuang.example.com/api/v1",
    "TimeoutSeconds": 30,
    "MaxRetry": 3,
    "CircuitBreakerThreshold": 5,
    "CircuitBreakerDurationSeconds": 30,
    "Authentication": {
      "Type": "Bearer",
      "TokenStub": "STUB_TOKEN_REPLACE_BEFORE_DEPLOY"
    }
}
```

### 3.4 包引用

```xml
<PackageReference Include="Polly" Version="8.5.0" />
<PackageReference Include="Polly.Extensions.Http" Version="3.0.0" />
```

（MIT 协议）

---

## 四、子代理 c — 累计技术债（~1.3-1.8 PD）

### C-1 NC 异常场景压测（~0.5-1 PD）

**测试矩阵**：
- 断网：模拟 NC 端不可达 → Polly retry + 熔断
- 5XX：模拟 NC 返回 503/500 → retry 后入 F-08 异常台账
- 慢响应：模拟 NC 30s+ 响应 → Timeout 触发
- 熔断恢复：5 次失败后 30s 内拒绝调用，30s 后半开试探

**实现**：测试用 mock HttpMessageHandler 注入不同响应；集成测试用 WireMock.Net（如时间允许）

**工时分配**：纯单测 0.5 PD；含 WireMock.Net 集成 1 PD

### C-2 InterfaceMonitor cross-org RBAC（~0.5 PD）

**问题**：Sprint 14a `InterfaceMonitorAppService.GetTaskListAsync` 等 4 endpoint 不过滤 caller's OrgId scope。

**修复**：
- 注入 ICurrentUser + ICurrentUserRoleResolver
- 每个 endpoint 加 caller scope 过滤（admin 白名单 = OrgId=0 / 集团权限）
- 加 4 测试（每 endpoint 1 测试守护）

### C-3 Wave 84 PG timezone NOTICE（~0.3 PD）

**修复**：参考 Wave 81 模式新增 Wave 86 fix migration：
- Up 内仅 RAISE NOTICE 提示 session timezone 非 UTC 警告
- Down no-op
- 加 1 EFCore.Tests 守护

---

## 五、测试矩阵（≥ 30 个）

| 类别 | 数量 | 类型 |
|---|---|---|
| 8 BIZ Contributor 测试 | 16 | Domain |
| NcInterfaceHttpClient 测试 | 6 | Application |
| NC 异常压测 | 4 | Application |
| InterfaceMonitor cross-org RBAC | 4 | Application |
| Wave 86 守护 | 1 | EFCore |
| Sprint15aFullSprint_E2E_Tests | 2 | Application |

**基线增量**：1484 → ~1517（+33）

---

## 六、风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 厂商真实端点未提供 | 高 | NcInterface:UseMock=true 兜底，生产部署前 cici 配置真 endpoint |
| 2 | Polly 包升级影响其他模块 | 低 | Polly 是隔离 nuget 包，不影响 ABP / EF Core |
| 3 | 8 BIZ Contributor 业务规则差异大 | 中 | 一期仅做 Contributor 模板 + 幂等键；业务规则细节顺延 Sprint 16a 完整化 |
| 4 | WireMock.Net 集成测试覆盖率 | 中 | 一期可选；C-1 单测覆盖 80%+ 异常场景已足够 |
| 5 | NC 认证机制不确定（Bearer vs OAuth2 vs 自定义） | 中 | 一期 Bearer Token stub；真 OAuth2 等 NC 厂商确认后 Sprint 16a 加 |

---

## 七、决策点（待 cici V0.1 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | 一期 BIZ 数（V0.1 8 个 vs 10 个 vs 14 全做） | 8 个核心（合 3-4 PD）|
| 2 | NcInterfaceHttpClient Polly 策略（retry+熔断+timeout 全做 vs 仅 retry） | 三层全做（生产标准）|
| 3 | C-1 NC 异常压测含 WireMock.Net？ | 不含（一期单测足够）|
| 4 | NC 认证机制（Bearer stub vs OAuth2） | Bearer Token stub（Sprint 16a 升 OAuth2）|
| 5 | Mock↔Real 切换粒度（按 interface vs 全局） | 全局（appsettings NcInterface:UseMock）|

---

## 八、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 8 BIZ Contributor + NcInterfaceHttpClient + Polly retry + 4 累计技术债 + 5 决策点 |
