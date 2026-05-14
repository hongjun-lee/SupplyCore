# Sprint 18a NC 端配合度评估清单 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 18a A1 主任务交付物
**配套：** [`Sprint-18a-任务卡-V0.2.md`](./Sprint-18a-任务卡-V0.2.md) §一 主线 A / Sprint-17a Demo §五 NC 真端点切换 Checklist

---

## 一、评估清单（7 项，与 Sprint 17a Demo §五 对齐 + 细化）

| 项 | 责任方 | 当前状态 | 阻塞情况 | 备注 |
|---|---|---|---|---|
| 1. NC OAuth2 token endpoint 提供 + ClientId/Secret 颁发 | NC 端 + cici | ⏳ 待确认 | 阻塞 A2 全部 23 接口实测 | Sprint 17a NcOAuth2TokenService 已实现 client_credentials 流；NC 端需提供 token endpoint URL + 颁发凭证 |
| 2. NC 端 23 接口 endpoint 路径 + 请求/响应 schema 文档 | NC 端 | ⏳ 待确认 | 阻塞 A2 接口逐个对接 | 详设 08 §6.7 列了 29 接口（MD-001/004 + BIZ-001~020 + CHK-001~005），已实现 23 个 Mock；NC 端需提供真实 schema 比对 |
| 3. NC 端业务码（0000 成功 / 其他失败码）枚举对照 | NC 端 | ⏳ 待确认 | 阻塞 A2 业务码逻辑校准 | Sprint 15a NcInterfaceHttpClient 已实现严格 0000 业务码判定；NC 端需提供完整失败码字典 |
| 4. NC 真端点测试环境 BaseUrl + 限流策略 | NC 端 | ⏳ 待确认 | 阻塞 A2/A4 联调与 chaos 测试 | 一期 Mock BaseUrl=空；NC 端需提供 dev / staging 真端点 + 限流参数（QPS / burst / 退避策略）|
| 5. F-12 ledger_sum 实接 schema（amount 字段类型）| NC 端 | ✅ **18a A3 已落地**（不阻塞）| - | Wave 89 已加 AmountTotal/Matched/Variance 3 字段 nullable decimal（commit `9b57f08`）；NC 真接时直接填值，by_chk JSON 自动切换 has_amount_data=true |
| 6. NC 端 401/超时/5xx 等异常场景实测协调 | NC 端 + cici | ⏳ 待确认 | 部分阻塞 A4 | Sprint 17a WireMock chaos 5 场景已模拟覆盖（500 retry / 熔断 / 超时 / 401 retry / 业务拒收）；NC 真端点验证后可作为 18b 基线 |
| 7. NC 真端点联调测试报告 + Demo 复演 | cici | ⏳ 待确认 | 终末输出 | Sprint 17a NC Health Snapshot dashboard 已就绪（GET /api/supply-cores/interface-monitor/nc-health）；NC 真接后 dashboard 显示真值 |

---

## 二、协调步骤建议（cici 与 NC 端沟通模板）

### Step 1：基础信息收集（Day 1-2）
向 NC 端发以下问题清单：

> 1. 请提供 NC 测试环境 OAuth2 token endpoint URL（如 https://nc.fukuang.example.com/oauth2/token）
> 2. 请颁发 SupplyCores 一组 ClientId + ClientSecret + Scope（建议 scope: `nc.api.supplycores`）
> 3. 请提供以下 23 个接口的 endpoint 路径 + 请求 schema + 响应 schema：
>    - MD-001 物料映射推送（POST /MD-001）
>    - MD-004 成本中心对照拉取（POST /MD-004）
>    - BIZ-001~BIZ-020（缺 BIZ-005A、其余 19 个）
>    - CHK-001 日对账 / CHK-004 接口状态查询（其余 3 个可后置）
> 4. 请提供 NC 业务码（0000 成功 + 其他失败码）的完整字典
> 5. NC 端限流策略（QPS / burst / 退避策略 / 是否支持指数退避）
> 6. dev / staging 环境维护窗口（避开维护时段实测）

### Step 2：先决条件验证（Day 3-4）
NC 端反馈后：
1. **OAuth2 token endpoint 可达性** — `curl` 直接调，验证 client_credentials 流可发 token
2. **单接口 dry-run** — 选 BIZ-005A（17a POC 接口）作为先发 dry-run；切 appsettings UseMock=false + 真 BaseUrl + 真 ClientId/Secret，跑 1 次真请求
3. **业务码对照** — 把 NC 端返回的实际业务码与 NcInterfaceHttpClient 的 "0000" 判定对照，必要时升级判定逻辑

### Step 3：23 接口 phase 1 实测（Day 5-7）
按风险递减顺序逐个对接：
- 优先级 1（核心 4）：MD-001、MD-004、BIZ-001、BIZ-005A
- 优先级 2（高频 6）：BIZ-002/003/004/006/014/020
- 优先级 3（其他 13）：BIZ-007~019（剔除已对接的） + CHK-001/004

每个接口对接含：
- 真请求 + Authorization Bearer header
- 响应解析（含业务码 0000 / 非 0000 / 异常路径）
- F-03 InterfaceReceipt 写入验证
- 失败重试与熔断器行为验证（Polly 三层）

---

## 三、A1 完成判定标准

| 判定项 | 标准 |
|---|---|
| 7 项清单 | 7 项全部从 ⏳ 待确认 → ✅ 完成 或 ⏳ 已交付 NC 端等反馈 |
| OAuth2 端点 | 可 curl 取 token + 1 次业务请求成功 |
| 接口 schema 对照 | 23 接口对照表（NC 真值 vs 详设 08 §6.7 Mock）完整 |
| 业务码字典 | NC 端业务码字典纳入 NcResponse 解析逻辑（必要时 PR）|
| 风险评估报告 | NC 端限流 / 维护窗口 / 联调时长评估纳入 Sprint 18b 规划 |

---

## 四、风险隔离决策

**若 A1 NC 端配合度评估 Day 1-4 内未完成关键节点（项 1-3）**：
- A2 23 接口实测顺延 Sprint 18b
- 主代理 a 在 18a 期间专注 A3（已落地）+ A4 / A5（与子代理 b/c 并行）
- A2 评估状态在 Sprint 18a Demo §三 明确标注顺延决策

**若 NC 端配合度高、Day 5 进入 A2**：
- 按优先级 1 → 2 → 3 推进
- 每个对接完成后立即提交（小步快跑），不要积压
- WireMock chaos 5 场景 + 17a 集成测试作为对照基线

---

## 五、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — 7 项评估清单 + 协调步骤（cici 与 NC 端沟通模板）+ A1 完成判定 + 风险隔离决策 |
