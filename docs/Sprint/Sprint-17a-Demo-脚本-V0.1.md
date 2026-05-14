# Sprint 17a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 17a 验收演示脚本
**配套：** [`Sprint-17a-任务卡-V0.2.md`](./Sprint-17a-任务卡-V0.2.md)

---

## 一、Sprint 17a 落地范围

按 V0.2 锁版（主线 D NC OAuth2 + 真端点 / 4 累计技术债全修 / 8-10 PD / 主+2 子代理 sweet spot 3.8x），实际交付 **~6 PD**（其中 NC 真端点联调 D3-2 顺延 Sprint 17b 待 NC 端配合）：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（任务卡 cici 评审锁主线 D）| `6a1d25a` | a |
| **D1** | D1 NC OAuth2 client_credentials TokenService + 6 守护 | `9f4857f` | a |
| **D2** | D2 401 智能 retry + Wave 87 PG 边界 5 守护 | `7c109f1` | a + **b（子代理）** |
| **D3-4** | D3 OAuth2 WireMock 集成 + D4 F-12 SY-02 化 + reconcile 完整化 | `dc0c69c` | a + **b + c（子代理）** |
| **D5-6** | D5 NC Health Snapshot monitoring + D6 WireMock 扩展 5 chaos | `2e69a2a` | a + **b（子代理）** |
| D7 | Demo 脚本 + Codex 17a 触发 | 本文档 | a |

**测试基线演进**：
- Sprint 16a 收尾：**1562**
- Sprint 17a Day 1 D1（OAuth2 TokenService）：**1568**（+6）
- Sprint 17a Day 2 D2（401 retry）：**1570**（+2）+ Wave 87 +5（Integration 独立）
- Sprint 17a Day 3-4：**1574**（+4 D4 SY-02 / +4 D_reconcile / -2 D3 OAuth2 WireMock 移到 Integration）
- **Sprint 17a Day 5-6**：**1581**（+4 NC Health Snapshot / +5 WireMock chaos Integration 独立）
- Domain 876 / Application 666 / EFCore 33（默认）+ 10 Integration / Web 6

---

## 二、Demo 演示路径

### 路径 A：OAuth2 client_credentials 全链路（8 分钟）

1. **配置切换**：appsettings.json `NcInterface:Authentication:Type` 从 "Bearer" → "OAuth2"，填 OAuth2 子段（TokenEndpoint/ClientId/ClientSecret/Scope）
2. **首次调 BIZ-001**：`NcOAuth2TokenService.GetTokenAsync` → POST /oauth2/token 取 access_token → InvokeAsync 带 Authorization Bearer 头
3. **缓存命中**：第二次调 → 复用缓存 token（不再调 token endpoint，验证 SemaphoreSlim single-flight）
4. **401 智能 retry**：业务 endpoint 返 401 → SendWithAuthRetryAsync 调 RefreshAsync 强制刷 → 带新 token 重试 → 成功
5. **monitoring 查看**：GET `/api/supply-cores/interface-monitor/nc-health` → NcHealthSnapshotDto（认证类型、Token 缓存状态、剩余有效秒数、Mock 模式）

### 路径 B：WireMock chaos 测试基线（5 分钟）

跑 `Sprint17a_D6_WireMockExtended_Integration_Tests` 5 场景：
1. **MD-001 成功**：F-03 receipt 写入 + TaskState=Success
2. **BIZ-001 业务拒收**：HTTP 200 + ncCode=5001 → Success=false + MarkFailedOrRetry
3. **NC 500 + Polly retry**：首次 500 / retry 后 200 恢复
4. **熔断器触发**：连续 500 累积 → 第 3 次 BrokenCircuitException 返 CIRCUIT_OPEN
5. **TimeoutPolicy 触发**：NC delay 5s + TimeoutSeconds=1 → TIMEOUT < 4s 快速触发

### 路径 C：F-12 SY-02 字典化 + reconcile 完整化（5 分钟）

1. **SY-02 改 6 规则**：改 SystemConfig `nc.account_rule.BIZ-001.default.debit_account` 值 → 重启 reseed → F-12 表新值生效（fallback 硬编码兜底）
2. **reconcile by_chk**：跑月结 → ReconciliationSummary JSON 含 `by_chk` 分类聚合 CHK-001/002/003 + `total_records` 总览 + `ledger_sum_from_nc_placeholder` 占位
3. **Wave 87 partial unique**：dev PG 直跑 `Sprint17a_Wave87_PartialUnique_Tests`：同周期不能两条 Approved 反结，Rejected/InApproval/is_deleted 允许共存

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | D NC OAuth2 + 真端点 | ✅ D1 + D2 + D3 完成；**D3-2 真端点联调顺延 Sprint 17b**（NC 端配合度评估清单见 §五） |
| 2. 4 累计技术债 | 全修 | ✅ #1 SY-02 / #2 Wave 87 / #3 reconcile / #4 WireMock 全修 |
| 3. 工时预算 | 8-10 PD | 6 PD 实际（D3-2 顺延 ~2 PD） |
| 4. 子代理策略 | 主+2 子代理 3.8x | ✅ 三轨 Day 3-4 / Day 5-6 验证 |
| 5. Codex 16a 评审 | Sprint 16a 收尾触发 | ✅ commit `7f68eb0` 0 顺延，连续 5 Sprint |

---

## 四、Sprint 17b 候选方向（顺延 + 新增）

| 候选 | 范围 | 工时 |
|---|---|---|
| **A** | NC 真端点联调 phase 2（D3-2 顺延）— 需 NC 端配合度评估完成 | 3-4 PD |
| B | 详设 10 剩 12 类审批模板 | 10-12 PD |
| C | 详设 09 看板剩 5 类 + OLAP | 8-10 PD |
| F | 详设 04 招投标 T-01~07（外部对接）| 6-8 PD（+30 PD 外部缓冲） |
| G | 详设 06 库存超储处置 + 暂估完整化 | 5-6 PD |

**V0.1 倾向 A**：D3-2 顺延 + NC 真端点联调 + F-12 ledger_sum 实接（NC 凭证 sum 字段升级 amount 类型）

---

## 五、NC 真端点切换 Checklist（Sprint 17b 前置准备）

切换 Mock → 真端点前需 NC 端配合的事项：

| 项 | 责任 | 状态 |
|---|---|---|
| 1. NC OAuth2 token endpoint 提供 + ClientId/Secret 颁发 | NC 端 + cici | ⏳ 待 |
| 2. NC 端 23 个接口 endpoint 路径 + 请求/响应 schema 文档 | NC 端 | ⏳ 待 |
| 3. NC 端业务码（0000 成功 / 其他失败码）枚举对照 | NC 端 | ⏳ 待 |
| 4. NC 真端点测试环境 BaseUrl + 限流策略 | NC 端 | ⏳ 待 |
| 5. F-12 ledger_sum 实接 schema（amount 字段类型）| NC 端 | ⏳ 待 |
| 6. NC 端 401/超时 / 5xx 等异常场景实测协调 | NC 端 + cici | ⏳ 待 |
| 7. NC 真端点联调测试报告 + Demo 复演 | cici | ⏳ 待 |

切换实施步骤（Sprint 17b 主线）：
1. 改 `appsettings.Production.json` UseMock=false + OAuth2 子段 + BaseUrl
2. ClientSecret 用 dotnet user-secrets / KeyVault / Env 注入（不写 appsettings）
3. 部署后 GET `/api/supply-cores/interface-monitor/nc-health` 看 OAuth2 Configured / Token 缓存状态
4. 跑 1 个 BIZ-005A 单接口验证全链路（OAuth2 + Polly + Authorization 头）
5. 全量灰度上线 + 监控 dashboard 关注

---

## 六、Sprint 17a Codex 评审待触发

> 占位 — Sprint 17a 完成时 cici 触发 Codex 17a 评审

**评审重点**：
- OAuth2 client_credentials 实现安全性（Token 内存缓存 + RefreshBufferSeconds + single-flight 防雪崩）
- 401 智能 retry 边界（双 Refresh 是否会陷入死循环 / token cancellation 透传）
- F-12 SY-02 化向后兼容（硬编码 fallback 兜底正确性 / SY-02 key 命名稳定性）
- reconcile by_chk JSON 结构稳定性（Sprint 17b NC 真端点接入 ledger_sum 兼容路径）
- WireMock chaos 5 场景覆盖度（是否漏 net-split / partial-fail 场景）
- NC Health Snapshot DTO 字段（生产 dashboard 实际需要的字段）

**触发提示词**：
"评审 Sprint 17a 共 5 commits（`9f4857f` D1 / `7c109f1` D2 / `dc0c69c` D3-4 / `2e69a2a` D5-6 / `<demo commit>` D7）— 重点关注 OAuth2 client_credentials 安全性 + 401 智能 retry 死循环防御 + reconcile by_chk JSON 结构稳定性"

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — D1-D6 落地 + 路径 A/B/C Demo + NC 真端点切换 checklist + Sprint 17b 候选 + Codex 17a 触发提示 |
