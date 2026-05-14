# Sprint 16a Day 1-X A+E 双轨 — 实施设计草案（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 16a A+E 双轨实施细化设计
**配套：** [`Sprint-16a-任务卡-V0.2.md`](./Sprint-16a-任务卡-V0.2.md) §一A + 详设 08 V1.1 §5.2 / §6.10-6.14

---

## 一、范围（A+E 双轨，~11 PD · 主代理 a + 子代理 b + c 三轨并行）

### A 主线：剩 9 BIZ 接口（~6-8 PD · 主代理 a）

详设 08 §5.2 共 20 BIZ。已落 12（Sprint 14a 4 + Sprint 15a 8）。本期落 9 个剩余：

| # | Code | 业务实体 | 触发时机 | NC 凭证 | 工时 |
|---|---|---|---|---|---|
| 1 | **BIZ-005A** | sale_outbound | S-09 收货方=厂矿 | 借 1122 应收 / 贷 6001 收入 + 2221 销项税 | 0.8 PD |
| 2 | BIZ-010 | scrap_outbound | S-20/S-31 处置审 | 借 6301 / 贷 1403 | 0.7 PD |
| 3 | BIZ-011 | scrap_income | S-20 变卖收款 | 借 1002 / 贷 6301 | 0.7 PD |
| 4 | BIZ-012 | hazmat_destroy | S-20/S-31 销毁审 | 借 6301 / 贷 1403 独立科目 | 0.7 PD |
| 5 | BIZ-013 | explosives_inout | S-05/S-09/S-21 火工品审 | 独立科目 + 单独凭证序号 | 0.7 PD |
| 6 | BIZ-015 | prepayment_writeoff | C-08+S-05 发票+入库匹配 | 借 2202 / 贷 1123 | 0.7 PD |
| 7 | BIZ-016 | concession_inbound | S-04+S-05 让步降价 | 降价后借 1403 / 贷 2202 | 0.7 PD |
| 8 | BIZ-017 | safety_special_issue | S-09 安全专项 | 借专项储备 / 贷 1403 | 0.7 PD |
| 9 | BIZ-018 | low_value_amortize | S-09/S-21 月末摊销 | 一次性/五五/分期摊销 | 0.7 PD |

**合计**：BIZ-005A 0.8 + 8 × 0.7 = **6.4 PD**

### E 子代理 b：月结反结 + NC 凭证规则（~2-3 PD）

| Task | 内容 | 工时 |
|---|---|---|
| E-1 | F-10 period_close_record + F-11 period_reverse_request + F-12 nc_account_rule 实体 + EFCore 配置 | 0.5 PD |
| E-2 | Wave 87 migration（3 表 CREATE + UK 索引）| 0.3 PD |
| E-3 | PeriodCloseManager（月结 reconcile + UoW 状态机）| 0.5 PD |
| E-4 | PeriodReverseAppService（反结申请 + 高敏感拦截 SENS-FIN-003/004） | 0.5 PD |
| E-5 | F-12 NC 凭证规则配置化（SY-02 简化版 + 硬编码常用 6 规则）| 0.3 PD |
| E-6 | HTTP Controller + 测试 ≥ 8 | 0.3 PD |

**合计 ~2.4 PD**

### 累计技术债（~2-2.5 PD · 子代理 c）

| # | 项 | 工时 |
|---|---|---|
| 1 | InterfaceMonitor cross-org RBAC 完整版（业务表 OrgId join）| 1 PD |
| 2 | NC 真端点联调（含 Mock 兜底降级路径）| 0.5-1 PD |
| 3 | WireMock.Net 集成测试（替代 mock HttpMessageHandler 部分场景）| 0.5 PD |

**合计 ~2-2.5 PD**

---

## 二、A 主线 — 9 个 BIZ Contributor 模板（~6.4 PD）

复用 Sprint 14a/15a IInterfaceContributor + ContributorPayloadHelper + try/catch retry 模式（含 Codex 14a P1 修复）。

**实现模式**（统一）：
- 构造注入 InterfaceTaskManager + INcInterfaceClient + IRepository<InterfaceMessage> + ILogger
- CreateTaskAsync 幂等键 = `BIZ-XXX:{business_entity}:{businessId}`
- InvokeAsync ContributorPayloadHelper.ResolvePayloadAsync + try/catch + rethrow
- WriteReceiptAsync 写 F-03 + 业务回写 NC 凭证号

**特殊处理**：
- **BIZ-005A 销售出库**：业务实体 `sale_outbound`，需校验 `S-09.recipient_type == "厂矿"` 才推（与 BIZ-005 内部领用区分）
- **BIZ-013 火工品**：F-14 加 `is_independent_voucher_seq` 字段 → 独立凭证序号
- **BIZ-015 预付款核销**：需关联 BIZ-014 已登记的预付款 task → 写 F-03 时回写 BIZ-014 voucher 关联
- **BIZ-018 低耗摊销**：月末批 Hangfire job 触发，类似 C-09 模式

**InterfaceId 顺位（F-14 seed）**：22-30

| Contributor | InterfaceId | 备注 |
|---|---|---|
| Biz005APurchaseToSubsidiarySalesContributor | 22 | 销售出库 |
| Biz010ScrapOutboundContributor | 23 | 废旧出库 |
| Biz011ScrapIncomeContributor | 24 | 废旧收入 |
| Biz012HazmatDestroyContributor | 25 | 危险品销毁 |
| Biz013ExplosivesInOutContributor | 26 | 火工品 |
| Biz015PrepaymentWriteoffContributor | 27 | 预付款核销 |
| Biz016ConcessionInboundContributor | 28 | 让步入库 |
| Biz017SafetySpecialIssueContributor | 29 | 安全专项 |
| Biz018LowValueAmortizeContributor | 30 | 低耗摊销 |

**测试**：每 Contributor 1 个 smoke 测试 + 1 个 unique InterfaceCode 守护 = 9 + 1 = 10 测试

---

## 三、E 子代理 b — 月结反结 + NC 凭证规则（~2.4 PD）

### 3.1 F-10/F-11/F-12 实体设计

```csharp
// F-10 period_close_record（详设 08 §6.12）
public class PeriodCloseRecord : SupplyCoresFullAuditedAggregateRoot<long>
{
    public string PeriodCode { get; set; }       // 202604 / 202605
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public string CloseState { get; set; }       // 待月结/月结中/已月结/已反结
    public DateTime? ClosedAt { get; set; }
    public Guid? ClosedByUserId { get; set; }
    public int TotalEntryCount { get; set; }
    public int FrozenEntryCount { get; set; }
    public string? ReconciliationSummary { get; set; }
}

// F-11 period_reverse_request（详设 08 §6.13）
public class PeriodReverseRequest : SupplyCoresFullAuditedAggregateRoot<long>
{
    public string PeriodCode { get; set; }
    public Guid RequesterUserId { get; set; }
    public string ReverseReason { get; set; }
    public string RequestState { get; set; }     // 待审批/审批中/已通过/已拒绝
    public Guid? ApproverUserId { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovalComment { get; set; }
}

// F-12 nc_account_rule（详设 08 §6.14）
public class NcAccountRule : SupplyCoresFullAuditedAggregateRoot<long>
{
    public string InterfaceCode { get; set; }    // BIZ-001 / BIZ-005A 等
    public string RuleName { get; set; }
    public string DebitAccount { get; set; }     // 1403
    public string CreditAccount { get; set; }    // 2202
    public string? Condition { get; set; }       // 触发条件（如金额 > 100W）
    public int Priority { get; set; }            // 多规则同接口的优先级
    public bool IsEnabled { get; set; } = true;
}
```

### 3.2 PeriodCloseManager 状态机

```csharp
public class PeriodCloseManager : DomainService
{
    public async Task<PeriodCloseRecord> InitiateCloseAsync(string periodCode, ...)
    {
        // 1. 校验：同 periodCode 不能重复月结（除非已反结）
        // 2. reconcile：触发 CHK-001 日对账 + CHK-002 周对账 + 总账 sum
        // 3. 状态 → 月结中 → 已月结 + 写 F-10
        // 4. 触发 NC BIZ-003 暂估冲销（次月初）
    }
}
```

### 3.3 PeriodReverseAppService 高敏感拦截

```csharp
[SensitiveOperation("SENS-FIN-004")]  // 反结审批已在 Sprint 13a A-11 seed
public async Task<PeriodReverseRequest> ApplyReverseAsync(...)
{
    // 1. 校验：仅已月结期可申请反结
    // 2. 走 A-20 ApprovalInstance 审批流（WF-REV-001）
    // 3. 审批通过 → F-10.CloseState = '已反结'
}
```

### 3.4 测试（≥ 8）

- PeriodCloseManager 状态机：InitiateClose / Reconcile / Reverse 4 测试
- PeriodReverseAppService：审批流 + SENS-FIN-004 拦截 2 测试
- F-12 NcAccountRule seed 6 规则覆盖 2 测试

---

## 四、子代理 c — 累计技术债（~2-2.5 PD）

### C-1 InterfaceMonitor cross-org RBAC 完整版（~1 PD）

**问题**：Sprint 15a 一期仅 caller 登录态校验。完整版需按业务表 OrgId join。

**修复**：
- InterfaceTask 加 OrgId 字段（Wave 88 加列）
- Contributor.CreateTaskAsync 写 OrgId（从 ICurrentUser claim）
- InterfaceMonitorAppService 4 endpoint 加 OrgId scope 过滤
- Wave 88 migration + 数据 backfill（已有 task 设 OrgId=0）

### C-2 NC 真端点联调降级路径（~0.5-1 PD）

**修复**：
- NcInterfaceHttpClient 加 HealthCheck（GET /health）
- 启动期 InterfaceMonitorService check NC 可用性 → 不可用 fallback Mock
- LogWarning 通知运维

### C-3 WireMock.Net 集成测试（~0.5 PD）

**修复**：替代部分 `mock HttpMessageHandler` 用 WireMock.Net stub server，更接近真 HTTP 行为：
- 1 集成测试覆盖 BIZ-005A 端到端（Contributor → HttpClient → WireMock NC）
- 包：`WireMock.Net` 1.6.x（MIT 协议）

---

## 五、Wave 87 + Wave 88

- **Wave 87**：F-10/F-11/F-12 CREATE（E 子代理 b）
- **Wave 88**：InterfaceTask 加 OrgId 列（C 子代理 c）

---

## 六、测试矩阵（≥ 25 个）

| 类别 | 数量 | 类型 |
|---|---|---|
| 9 BIZ Contributor smoke + unique 守护 | 10 | Domain |
| F-10/F-11/F-12 实体 + EFCore 守护 | 3 | EFCore |
| PeriodCloseManager 状态机 | 4 | Domain |
| PeriodReverseAppService 审批流 | 3 | Application |
| InterfaceMonitor cross-org RBAC | 4 | Application |
| WireMock.Net BIZ-005A 集成 | 1 | Application |
| Sprint16aMonthlyClose_E2E（月结→反结→重月结）| 2 | E2E |

**基线增量**：1519 → ~1546（+27）

---

## 七、风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | BIZ-005A 销售出库与 BIZ-005 内部领用区分逻辑（recipient_type）| 中 | S-09 加 recipient_type 字段查询 + 一期硬编码"厂矿"白名单 |
| 2 | BIZ-013 火工品独立凭证序号实现复杂度 | 中 | F-14 加 is_independent_voucher_seq 字段 + NC 端配合 |
| 3 | F-12 nc_account_rule 6 条 seed 业务规则确认 | 中 | cici 业务方确认 6 条核心规则（一期硬编码 fallback）|
| 4 | InterfaceTask OrgId backfill 历史数据缺失 | 中 | Wave 88 默认 OrgId=0，业务运行后增量补 |
| 5 | WireMock.Net 包大小膨胀 | 低 | 仅 Test 项目引入 |

---

## 八、决策点（待 cici V0.1 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | 一期 BIZ 数（9 个 vs 6 个） | 9 个全做（合 6.4 PD 内）|
| 2 | F-12 NC 凭证规则一期 SY-02 化 vs 硬编码 | 硬编码 6 规则 fallback（Sprint 17a 升 SY-02）|
| 3 | InterfaceTask OrgId Wave 88 强制非空 vs 默认 0 | 默认 0（向后兼容历史 task）|
| 4 | NC 真端点 HealthCheck 触发时机（启动期 vs 每 N 次调用）| 启动期一次 + 失败时再 check |
| 5 | WireMock.Net 覆盖范围（仅 BIZ-005A vs 全 BIZ）| 仅 BIZ-005A（POC，扩展 Sprint 17a） |

---

## 九、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 9 BIZ Contributor + F-10/F-11/F-12 月结反结 + 3 累计技术债 + 5 决策点 |
