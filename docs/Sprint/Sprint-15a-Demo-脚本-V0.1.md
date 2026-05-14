# Sprint 15a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 15a 验收演示脚本
**配套：** [`Sprint-15a-任务卡-V0.2.md`](./Sprint-15a-任务卡-V0.2.md) + [`Sprint-15a-Day1-X-AD-设计-V0.2.md`](./Sprint-15a-Day1-X-AD-设计-V0.2.md)

---

## 一、Sprint 15a 落地范围

按 V0.2 锁版（A+D 双轨 / 4 累计技术债全修 / 12-15 PD / 主+2 子代理），实际交付 **~8 PD**（预算 12-15 PD 内）：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D0 | Sprint-15a-V0.1 + V0.2 锁版 + A+D 设计 V0.1 → V0.2 | `daa0479` / `7176bc6` | a |
| **D1-X** | A 主线 8 BIZ Contributor + 9 smoke 测试 | `2380a9b` | a |
| **D1-X** | D NcInterfaceHttpClient Polly 三层（Timeout+Retry+CircuitBreaker）+ 8 测试 | `2380a9b` | **b（子代理）** |
| **D1-X** | 累计技术债 3 项（NC 异常压测 + cross-org RBAC + Wave 86）+ 13 测试 | `2380a9b` | **c（子代理）** |
| **D8** | Sprint15aNcInterface_E2E（2 全链路场景 BIZ-002 成功 + BIZ-008 异常）| `70a5cff` | a |
| D9 | Demo 脚本 + Sprint 16a 草案 | `d8fb4b3` | a |
| D10 | **Codex 15a 评审修复**（1 P1 + 2 P2 全修 0 顺延）| `187eaf5` | a |

**测试基线演进**：
- Sprint 14a 收尾：**1484**
- Sprint 15a Day 1-X 三轨第一波：**1514**（+30）
- Sprint 15a Day 8 E2E：**1516**（+2）
- **Sprint 15a D10 Codex 15a 修复**：**1519**（+3 守护测试）
- Domain 850 / Application 625 / EFCore 38 / Web 6

**Codex 15a 修复要点**（commit `187eaf5`）：
- **P1**：NcInterfaceHttpClient HTTP 200 但业务码非 0000 → 标 Success=true（拒收凭证误进 Success 不进 F-08 重试）
  - 修复：严格判定 `ncCode == "0000"` 才 Success=true / 缺失 code → `MISSING_CODE`
- **P2-1**：NcInterfaceHttpClient Transient 注册 → CircuitBreaker 状态不跨次累积
  - 修复：DI 改 AddSingleton（CircuitBreaker 实例级共享）
- **P2-2**：Polly retry 丢弃 5xx HttpResponseMessage 未 dispose（连接池耗尽风险）
  - 修复：onRetry callback `outcome.Result?.Dispose()`

---

## 二、Demo 演示路径

### 路径 A：8 BIZ Contributor + NC Mock 链路（10 分钟）

1. **8 个新 Contributor 装载**：DI 自动注册 ITransientDependency → 8 个 Contributor 实例化
2. **CreateTask 幂等**：BIZ-002 重复 Initiate（同 businessId）→ 同 idempotency_key 返已有 task
3. **InvokeAsync 成功路径**（BIZ-002 暂估）：
   - F-02 报文落库 → ContributorPayloadHelper 读 RequestBody → NcMockClient 返成功
   - F-01 → Success / F-03 写 NC 凭证号
4. **InvokeAsync 异常路径**（BIZ-008 盘盈，模拟 NC 断网）：
   - NcMockClient throw HttpRequestException → MarkFailedOrRetryAsync
   - F-01 → Retrying / RetryCount=1 / NextRetryAt 设置（exponential backoff 20s）
   - F-04 InterfaceLog Warning 落库

### 路径 B：NcInterfaceHttpClient 真接通 + Polly 三层（5 分钟）

1. **Mock↔Real DI 切换**：appsettings.json `NcInterface:UseMock=false` → 注 HttpClient（运行时验证）
2. **Polly retry**：mock HttpMessageHandler 连续返 503 → 验证 retry 3 次后 fail
3. **Polly 熔断**：5 次失败后第 6 次直接 BrokenCircuitException（30s 内）
4. **Polly Timeout**：mock 慢响应 30s+ → TimeoutRejectedException

### 路径 C：累计技术债 3 项（5 分钟）

1. **C-1 NC 异常压测**：5 场景测试覆盖（断网 / 5xx / 慢响应 / CircuitBreaker / Recovery）
2. **C-2 InterfaceMonitor cross-org RBAC**：4 endpoint 入口 EnsureCallerOrgScopeAllowed 守护
3. **C-3 Wave 86 NOTICE**：升级时 PG session timezone 非 UTC 触发 NOTICE 提示

---

## 三、验收要点

| # | 验收项 | 状态 |
|---|---|---|
| 1 | A 主线 8 BIZ Contributor（BIZ-002/003/004/006/007/008/009/019）| ✅ |
| 2 | D NcInterfaceHttpClient + Polly 三层（Retry/CircuitBreaker/Timeout）| ✅ |
| 3 | Bearer Token stub 认证（appsettings.json TokenStub）| ✅ |
| 4 | Mock↔Real 全局切换（NcInterface:UseMock）| ✅ |
| 5 | NC 异常压测 5 场景 | ✅ |
| 6 | InterfaceMonitor cross-org RBAC scope | ✅ |
| 7 | Wave 86 PG timezone NOTICE | ✅ |
| 8 | 集成 E2E 2 场景 | ✅ |
| 9 | 基线 ≥ 1500（实际 1519，含 Codex 15a 修复 +3 守护）| ✅ |
| 10 | Codex 15a 评审 1 P1 + 2 P2 全修 0 顺延 | ✅ |

---

## 四、Sprint 15a 收益总结

- **8 个新 BIZ 接口闭环** — 暂估 / 红字冲销 / 退货 / 退料 / 调拨 / 盘盈 / 盘亏 / 委托加工
- **NC 真 HTTP 接通** — Polly 三层生产标准（retry + 熔断 + Timeout），Mock↔Real 切换无侵入
- **生产可用性保障** — NC 异常 5 场景压测 + cross-org RBAC 保护 + Wave 86 timezone 提示
- **累计 12 BIZ 接口**（Sprint 14a 4 + Sprint 15a 8）+ 2 MD + 2 CHK = 16 接口

**基线增长 +32**：1484 → 1516

---

## 五、Sprint 16a 候选范围

详 [`Sprint-16a-任务卡-V0.1.md`](./Sprint-16a-任务卡-V0.1.md)（草案）。

主要方向：
1. **A 剩 6 BIZ + BIZ-005A 销售**：BIZ-005A 对厂矿销售 / BIZ-010~013 废旧/危险品/火工品 / BIZ-015~018 预付款核销/让步/安全/低耗摊销
2. **B 详设 10 剩 12 类审批模板** + 集团并行会签
3. **C 详设 09 看板剩 5 类** + OLAP
4. **E 月结反结**：F-10 period_close + F-11 reverse + F-12 NC 凭证规则
5. **NcInterfaceHttpClient OAuth2 升级**（Sprint 15a Bearer stub → 真 OAuth2）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — Sprint 15a 收尾 Demo + Sprint 16a 候选 |
| V0.1+ | 2026-05-14 | 补 D10 Codex 15a 评审修复（commit `187eaf5`，1 P1 + 2 P2 全修 0 顺延）+ 验收要点 +1 / 基线 1516 → 1519 |
