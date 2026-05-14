# Sprint 14a Day 1-X 详设 08 NC 接口联调 — 实施设计草案（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 14a A 主线实施细化设计
**配套：** [`Sprint-14a-任务卡-V0.2.md`](./Sprint-14a-任务卡-V0.2.md) §一A + 详设 08 V1.1 §五

---

## 一、范围（A1-A6，~8-10 PD · 主代理 a 主线）

详设 08 V1.1 共 29 接口（MD-001~005 / BIZ-001~020 / CHK-001~005）。
本 Sprint 一期聚焦 **8 个核心接口 + F-01~F-04 任务/报文/回执/日志框架 + 接口监控 dashboard**。

| Day | Task | 工时 | 说明 |
|---|---|---|---|
| **D1-1** | F-14 interface_definition + F-13 interface_switch + F-01 interface_task 表骨架 + Wave 84 migration | 0.8 PD | schema "f"；F-01 状态机（待处理→处理中→成功/失败）|
| **D1-2** | F-02 interface_message + F-03 interface_receipt + F-04 interface_log + Wave 84 续 | 0.8 PD | 报文 / 回执 / 日志三表 |
| **D2-1** | INcInterfaceClient HTTP 抽象 + 重试 + 死信队列 | 1 PD | HttpClientFactory + Polly retry policy；幂等键（详设 §7.2）|
| **D2-2** | InterfaceTaskManager 状态机 + IRecurringJobManager 调度（Hangfire）| 0.8 PD | 周期跑 F-01 待处理任务 → 调 NC API → 回写 F-03 |
| **D3-1** | MD-001 物料-存货映射同步（M-14 → NC） | 0.5 PD | 物资→NC 推送，M-14 映射启用触发 |
| **D3-2** | MD-004 成本中心对照同步（NC → 物资） | 0.5 PD | NC→物资 拉取，定时 |
| **D4-1** | BIZ-001 采购入库（S-05 → NC）| 0.5 PD | S-05 入库审核通过 + 发票匹配 → 推 NC 凭证 |
| **D4-2** | BIZ-005 领料出库（S-09 → NC）| 0.5 PD | S-09 出库审核通过 → 推 NC |
| **D5-1** | BIZ-014 预付款登记（C-08/C-10 → NC，已有 C-09 基础）| 0.5 PD | 复用 Sprint 8a/12a 已落审计链 |
| **D5-2** | BIZ-020 付款执行（C-08+C-10 → NC，已有 BIZ-PAY-BATCH 基础）| 0.5 PD | 同上 |
| **D6-1** | CHK-001 日对账（物资↔NC 笔数/金额）+ F-06 reconciliation_record | 0.8 PD | Hangfire 每日 03:00 跑 |
| **D6-2** | CHK-004 接口状态查询（NC→物资/物资→NC）| 0.4 PD | 实时查 F-01/F-03/F-04 |
| **D7-1** | InterfaceMonitorAppService + Controller（dashboard 4 endpoint：成功率/失败率/耗时/重试数）| 0.8 PD | dashboard 综合 4 指标 |
| **D7-2** | 异常监控（F-08 exception_record 触发 R-09 类预警 + LogWarning stub）| 0.5 PD | 复用 Sprint 12a Token 监控 stub 模式 |
| **D8** | 测试 ≥ 18（接口任务状态机 + 重试 + 死信 + 对账 + dashboard）| 0.8 PD | 含 1 E2E 全链路 |

**合计 ~9.7 PD**（V0.2 §一A 预算 8-10 PD 内）

**一期不做（顺延 Sprint 15a/16a）**：
- 剩 14 BIZ 接口（BIZ-002~004/006~013/015~019）
- 月结反结（F-10 period_close_record + F-11 period_reverse_request）
- F-12 NC 凭证科目规则配置化
- CHK-002 周库存核对 / CHK-003 月末全量 / CHK-005 映射完整性
- F-05 重推记录 / F-07 对账差异清单（一期仅 F-06 + Hangfire log）

---

## 二、Schema 设计（D1-1 + D1-2，1.6 PD）

### 2.1 F-14 interface_definition 接口元数据

```sql
CREATE TABLE f.interface_definition (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    interface_code  VARCHAR(32) NOT NULL,        -- MD-001 / BIZ-001 / CHK-001
    interface_name  VARCHAR(128) NOT NULL,
    interface_type  VARCHAR(16) NOT NULL,        -- MD / BIZ / CHK
    direction       VARCHAR(16) NOT NULL,        -- nc_to_sc / sc_to_nc / bidirectional
    realtime_level  VARCHAR(16) NOT NULL,        -- realtime / near_realtime / batch / scheduled
    is_enabled      BOOLEAN NOT NULL DEFAULT true,
    config_json     TEXT,                        -- 接口配置（URL / 字段映射等）
    ... [审计字段] ...
    CONSTRAINT uk_interface_definition_code UNIQUE (interface_code)
);
```

### 2.2 F-01 interface_task 接口任务（运行态）

```sql
CREATE TABLE f.interface_task (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    interface_id    BIGINT NOT NULL REFERENCES f.interface_definition(id),
    interface_code  VARCHAR(32) NOT NULL,        -- 冗余便于查询
    business_entity VARCHAR(64) NOT NULL,        -- 业务来源（s_05 / c_08 等）
    business_id     BIGINT NOT NULL,
    idempotency_key VARCHAR(64) NOT NULL,        -- 幂等键（详设 §7.2）
    task_state      VARCHAR(16) NOT NULL DEFAULT '待处理',  -- 待处理/处理中/成功/失败/重试中
    retry_count     INT NOT NULL DEFAULT 0,
    max_retry       INT NOT NULL DEFAULT 3,
    next_retry_at   TIMESTAMP WITH TIME ZONE,
    last_error_code VARCHAR(64),
    last_error_msg  TEXT,
    ... [审计字段] ...
    CONSTRAINT uk_interface_task_idempotency UNIQUE (interface_code, idempotency_key)
);
```

### 2.3 F-02 ~ F-04（报文 / 回执 / 日志）+ F-06 reconciliation_record

简化版（详 详设 08 §6.4-6.6 / §6.8）：
- F-02：task_id + request_body (JSONB) + response_body (JSONB) + http_status
- F-03：task_id + nc_response_code + nc_voucher_no + receipt_time
- F-04：task_id + log_level + log_message + creation_time
- F-06：日对账 record（period + total_count + matched_count + variance_count + reconciled_at）

---

## 三、INcInterfaceClient（D2-1，1 PD）

### 3.1 接口定义

```csharp
public interface INcInterfaceClient
{
    Task<NcResponse> InvokeAsync(string interfaceCode, object requestBody, string idempotencyKey, CancellationToken ct = default);
    Task<NcQueryResponse> QueryStatusAsync(string interfaceCode, string idempotencyKey, CancellationToken ct = default);
}

public class NcResponse
{
    public bool Success { get; set; }
    public string? NcResponseCode { get; set; }
    public string? NcResponseMessage { get; set; }
    public string? NcVoucherNo { get; set; }
    public string? RawResponseJson { get; set; }
}
```

### 3.2 实现要点

- HttpClientFactory + named client "nc-interface"
- Polly retry policy（exponential backoff，max 3 次）
- 死信队列：第 4 次失败入 F-01.task_state='失败' + F-08 exception_record
- 幂等键：按详设 §7.2 公式（接口编码 + 业务编码 + 时间窗）
- 配置化 NC base URL（appsettings.json 或 SY-02）

---

## 四、8 个核心接口（D3-D5，~3 PD）

每个接口逐 day 实施模式：

```csharp
public class Md001MaterialMappingSyncContributor : INcInterfaceContributor
{
    public string InterfaceCode => "MD-001";
    public Task<F01InterfaceTask> CreateTaskAsync(long businessId, ...) { ... }
    public Task<NcResponse> InvokeAsync(F01InterfaceTask task) { ... }
    public Task WriteReceiptAsync(F01InterfaceTask task, NcResponse response) { ... }
}
```

**8 个接口优先级**：

| # | Code | 来源 | 接通方式 | 工时 |
|---|---|---|---|---|
| 1 | **MD-001** 物料映射同步 | M-14 启用钩子 | 物资→NC 推送 | 0.5 PD |
| 2 | **MD-004** 成本中心对照 | NC API 拉取 | NC→物资 定时 | 0.5 PD |
| 3 | **BIZ-001** 采购入库 | S-05 入库审核 + 发票匹配 | 物资→NC 准实时 | 0.5 PD |
| 4 | **BIZ-005** 领料出库 | S-09 出库审核 | 物资→NC 准实时 | 0.5 PD |
| 5 | **BIZ-014** 预付款登记 | C-08/C-10 预付款 | 物资→NC（复用 C-09 基础）| 0.5 PD |
| 6 | **BIZ-020** 付款执行 | C-08 + C-10 实付完成 | 物资→NC（复用 BIZ-PAY-BATCH）| 0.5 PD |
| 7 | **CHK-001** 日对账 | Hangfire 03:00 | 物资↔NC | 0.5 PD |
| 8 | **CHK-004** 接口状态查询 | 按需 | 实时双向 | 0.3 PD |

---

## 五、InterfaceMonitorAppService dashboard（D7-1，0.8 PD）

4 endpoint：
- `GetOverviewAsync(input)` → 综合 dashboard（成功率 / 失败率 / 平均耗时 / 重试数）
- `GetTaskListAsync(input)` → F-01 任务列表（支持 state / interface_code / time_window 过滤）
- `GetReconciliationAsync(input)` → F-06 对账记录
- `GetExceptionListAsync(input)` → F-08 异常台账

RESTful Controller：`/api/supply-cores/interface-monitor/`

---

## 六、异常监控 stub（D7-2，0.5 PD）

复用 Sprint 12a D6-4 Token 监控 stub 模式：
- F-01 重试 3 次后 task_state='失败' → 写 F-08 exception_record
- 同时 LogWarning + 触发 R-09 类预警（暂复用 R-09，Sprint 15a 加 R-10 InterfaceFailed）
- SMTP 邮件 stub log（顺延 Sprint 15a 真接通）

---

## 七、测试矩阵（D8，~0.8 PD，≥ 18 个）

| # | 测试 | 类型 |
|---|---|---|
| 1-3 | F-14 / F-13 / F-01 实体 + 状态机 | Domain |
| 4-6 | InterfaceTaskManager InitiateAsync / RetryAsync / MarkFailed | Domain |
| 7-9 | INcInterfaceClient mock HTTP 成功 / 失败 / 重试 | Application |
| 10-12 | 3 个 BIZ 接口 Contributor 状态机覆盖 | Application |
| 13 | CHK-001 日对账 Hangfire job 注册 | Smoke |
| 14-16 | InterfaceMonitor 4 endpoint 测试 | Application |
| 17 | Wave 84 migration 守护 | EFCore |
| 18 | Sprint14aNcInterface_E2E（创建 F-01 → 调 NC mock → 回写 F-03 → 对账 F-06）| E2E |

**基线增量**：1411 → ~1429（+18）

---

## 八、风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 厂商配合度不确定 | 高 | 一期仅 8 关键接口；+30 PD 缓冲；NC mock client 优先开发本地联调 |
| 2 | 接口数据格式确认延迟 | 高 | D1 立即对接 08A V0.2 + 08B V0.1；如有阻塞 → 用 mock JSON 解锁 D2-D5 |
| 3 | 幂等键设计冲突 | 中 | 详设 §7.2 已定义；测试覆盖重复触发场景 |
| 4 | 重试 + 死信队列复杂度 | 中 | Polly 标准模板；详 §3.2 |
| 5 | 并发任务竞态（多 Hangfire worker 同时处理 F-01）| 中 | partial unique index ON (interface_code, idempotency_key) WHERE task_state='处理中' |
| 6 | NC 端 timeout / 网络抖动 | 中 | Polly retry + 死信兜底 |

---

## 九、决策点（待 cici V0.1 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | 一期接口数（V0.1 8 个 vs 6 个 vs 10 个）| 8 个（核心覆盖 + 9.7 PD 内合理）|
| 2 | NC API URL 配置化方式 | appsettings.json（一期简化）；Sprint 15a 改 SY-02 配置 |
| 3 | 异常监控接 R-09 vs 新 R-10 | 复用 R-09（一期）；Sprint 15a 拆 R-10 InterfaceFailed |
| 4 | F-05 重推记录 vs F-08 异常台账 | 仅 F-08（一期，重推用 retry_count）；F-05 顺延 |
| 5 | dashboard 综合 endpoint vs 拆分 endpoint | 拆 4 endpoint（V0.1 倾向）|

---

## 十、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 8 接口 + F-14/F-01/F-02/F-03/F-04/F-06 schema + INcInterfaceClient + dashboard + 5 决策点 |
