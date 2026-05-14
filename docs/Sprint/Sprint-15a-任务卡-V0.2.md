# Sprint 15a 任务卡 V0.2（cici 锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（cici 锁版 · 2026-05-14）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 15a 候选任务卡草案
**配套：** [`Sprint-14a-Demo-脚本-V0.1.md`](./Sprint-14a-Demo-脚本-V0.1.md) §五 候选范围

---

## 一、Sprint 15a 候选方向（待 cici V0.1 锁版决策点 1）

按 Sprint 14a Demo §五 推荐 5 个方向，cici 评审时锁版选 1-2 个：

### 候选 A：详设 08 NC 接口联调延续（A 主线第 2 期）

| Task | 范围 | 工时 |
|---|---|---|
| 15a-A1 | 剩余 14 BIZ 接口（BIZ-002~004/006~013/015~019）| 6-8 PD |
| 15a-A2 | F-10 period_close_record + F-11 period_reverse_request 月结反结 | 2-3 PD |
| 15a-A3 | F-12 NC 凭证科目规则配置化 | 1-2 PD |
| 15a-A4 | CHK-002 周库存核对 + CHK-003 月末全量 + CHK-005 映射完整性 | 2-3 PD |
| 15a-A5 | F-05 重推记录 + F-07 对账差异清单 | 1 PD |

**优势**：业务最复杂大头延续 Sprint 14a；Mock Stub 已落，无 NC 厂商配合阻塞
**风险**：14 BIZ 接口子单据 schema 差异大 + 一期 R-09 异常预警尚未压测
**预算**：12-17 PD

### 候选 B：详设 10 剩余 12 类审批模板 + 高级特性（Sprint 14a B 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 15a-B1 | 剩余 12 类审批模板配置（WF-TRF/CNT/SHT/SCP/EQP/RNT/MDT/SUP/REV/RPT/PUR-EXC 等）| 3-4 PD |
| 15a-B2 | 集团并行会签 V1.2（OR 节点支持）| 2 PD |
| 15a-B3 | 阶段 A/B/C 适配层（详设 10A V0.6）| 2-3 PD |
| 15a-B4 | ABP Interceptor 重构高敏感拦截器（Sprint 13a §一A 决策点 2 顺延）| 1 PD |

**优势**：详设 10 V1.2 完整闭环；NCalc 表达式引擎 Sprint 14a 已落
**风险**：20 类模板配置 + 21 高敏感拦截器全覆盖工作量大
**预算**：8-10 PD

### 候选 C：详设 09 看板剩余 5 类 + 自定义 SQL OLAP（Sprint 14a C 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 15a-C1 | 5 类大屏看板（8 PD/个，一期挑 3 类）：合同 / 付款 / 库存 | 4-6 PD |
| 15a-C2 | 看板 Org Logo 管理 + PDF 模板复用 | 1 PD |
| 15a-C3 | SelfServiceReport 升级 OLAP 自定义 SQL（Sprint 12a 决策点 3 顺延 + Sprint 14a 顺延）| 2-3 PD |

**优势**：业务部门 dashboard 需求大；前端 Sprint 15a 集成切入点
**风险**：UI 同学协调 + 前端依赖
**预算**：7-10 PD

### 候选 D：NC 厂商真实接口对接（依赖 Sprint 15a NC 厂商配合度）

| Task | 范围 | 工时 |
|---|---|---|
| 15a-D1 | NC 厂商接口能力对接函（08A V0.3 + 08B V0.2）+ 接口数据格式确认 | 1-2 PD |
| 15a-D2 | NcInterfaceHttpClient 真实接通（替换 NcInterfaceMockClient）| 1 PD |
| 15a-D3 | 8 核心接口端到端 NC 联调（含网络重试 + 死信队列实战）| 3-5 PD |
| 15a-D4 | NC 凭证号回写 + 月结闭环测试 | 1-2 PD |

**优势**：NC 主线 Sprint 14a Mock 已落，真接通切入点；解锁完整业务上线
**风险**：NC 厂商配合度不确定（+30 PD 缓冲，对应 Sprint 14a 风险 #1）
**预算**：6-10 PD

### 候选 E：累计技术债 + Codex 14a finding 修复

详 §二（待 Codex 14a 评审后累计）

---

## 二、累计技术债（Sprint 15a 必修，决策点 2）

### 2.1 Sprint 14a 后续技术债（待评审）

| # | 项 | 复杂度 | 工时 |
|---|---|---|---|
| 1 | NC 异常场景压测（断网 / 5XX / 慢响应 / NC 厂商 SLA 边界）| 中 | 0.5-1 PD |
| 2 | 接口监控 dashboard cross-org 视图 scope（一期监控视图未应用 RBAC OrgId 过滤）| 中 | 0.5 PD |
| 3 | Wave 84 升级前 PG session timezone NOTICE（参考 Wave 81 模式）| 低 | 0.3 PD |
| 4 | NcInterfaceHttpClient 真 HTTP 实现 + Polly retry（Sprint 14a 仅落 Mock）| 中 | 1-1.5 PD |

### 2.2 Codex 14a P2 顺延

> **无顺延** — Sprint 14a Codex 评审 3 P1 + 7 P2 全部在当 Sprint 修复（commit `225ff71`）。详 §六。

**合计 ~2-3 PD**（仅 Sprint 14a 后续 4 项 + Codex 14a 零顺延）

---

## 三、V0.1 决策点（待 cici 锁版）

| # | 决策点 | V0.1 倾向 | **V0.1 锁版** | 影响 |
|---|---|---|---|---|
| 1 | Sprint 15a 主线方向（A/B/C/D/E） | A + D 双轨 | ✅ **A 剩 14 BIZ + D NC 真接通（双轨）** | B/C/E 顺延 Sprint 16a/17a |
| 2 | 累计技术债必修哪些 | 全 4 项 | ✅ **4 项全修**：NcInterfaceHttpClient + NC 异常压测 + dashboard cross-org + Wave 84 NOTICE | 工时 2.3 PD |
| 3 | 工时预算 | 12-15 PD | ✅ **12-15 PD**（同 Sprint 13a/14a 经验） | A 剩 BIZ 3-4 + D NC 真接 3-4 + 技术债 2.3 + 缓冲 ≈ 11-14 PD |
| 4 | 子代理并行策略 | 主+2 子代理 | ✅ **主 a + 子代理 b + c**（sweet spot 3.8x） | a 做 A 剩 BIZ / b 做 D NC 真接 / c 做累计技术债 |
| 5 | Codex 14a 评审时机 | Sprint 14a 收尾触发 | ✅ **已完成**（commit 225ff71 修复落地 3 P1 + 7 P2 零顺延）| §六 附录已含 |

---

## 四、Sprint 15a 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 厂商配合度不确定（候选 D）| 高 | 一期 Mock Stub 已落，可平滑切换；候选 D 工时 +30 PD 缓冲 |
| 2 | 剩余 14 BIZ 接口子单据 schema 差异大（候选 A）| 中 | 复用 Sprint 14a InterfaceTaskManager 框架；增量加 BIZ-XX entity payload mapping |
| 3 | NC 异常场景压测覆盖不足（一期）| 中 | §二.1 #2 顺延独立 task；Sprint 15a 加 Chaos 测试 |
| 4 | 接口监控 dashboard cross-org RBAC 缺失 | 中 | §二.1 #3 顺延，与 Sprint 14a §二.1 #3 完整 RBAC 框架统一 |
| 5 | 详设 10 阶段 A/B/C 适配层与 NCalc 互动复杂（候选 B）| 中 | NCalc 一期已落，阶段适配层在表达式引擎之上加 phase 维度，可增量做 |
| 6 | 看板前端依赖 UI 同学协调（候选 C）| 中 | 同 Sprint 14a C 顺延理由；先后端 endpoint + 前端 Sprint 16a 集成 |

---

## 五、Codex 14a 评审已完成

Codex 14a 评审 3 commits 完成（commits `4b867c3` / `9169816` / `3d38611`）：
- **3 P1 全修**（commit `225ff71`）：NC client DI 注册 / 8 Contributor payload+retry / RBAC 复合角色+starter 节点
- **7 P2 全修**（commit `225ff71`）：TopOrgs scope / SystemConfigTool fallback / my-pending RBAC / 幂等键 payload 验证 / CHK-004 target / CHK-001 daily window / Dashboard OpenException
- **0 顺延 Sprint 15a**（全部当 Sprint 修复落地）

---

## 六、Codex 14a Finding 附录（完成 3/3 — 2026-05-14）

### 6.1 整体统计

| Sprint 14a Day | Commits | 已评 | finding 数 |
|---|---|---|---|
| Day 1-2 三轨第一波（NC 框架 + Codex 13a + CostEstimate + R-09） | `4b867c3` | 1 | 2 (0 P1 + 2 P2) |
| Day 2-3 三轨第二波（D2 Manager + MD + NCalc + RBAC） | `9169816` | 1 | 7 (2 P1 + 5 P2 — 去重) |
| Day 3 三轨第三波（BIZ × 4 + CHK × 2 + Dashboard） | `3d38611` | 1 | 3 (1 P1 + 3 P2) |
| **合计** | 3 | **3** | **3 P1 / 7 P2（全修）/ 0 顺延** |

### 6.2 P1 finding（3 个去重 · 全修 commit `225ff71`）

| # | Commit | 文件 | 标题 | 修复 |
|---|---|---|---|---|
| P1-1 | `9169816` | `NovaSupplyCoresApplicationModule.cs` + `NcInterfaceMockClient.cs` | NC client 未 DI 注册，UseMock=true 时所有 task 启动崩 | Module.ConfigureServices 加 NcInterface:UseMock 注册 MockClient |
| P1-2 | `9169816` + `3d38611` | 6 个 push Contributor（MD-001/BIZ-001/005/014/020/CHK-001） | InvokeAsync 传 `new {}` 而非 F-02 真 payload + NC 抛异常时 task 卡 InProgress 不 retry | ContributorPayloadHelper.ResolvePayloadAsync + try/catch MarkFailedOrRetryAsync + rethrow |
| P1-3 | `9169816` | `ApprovalInstanceManager.cs` | RBAC starter 节点（"业务发起"）拒真审批人 + 复合角色（"LEGAL+SAFETY"）整串匹配 | starter 节点透传 + 复合角色 `+` 拆分匹配 |

### 6.3 P2 finding（7 个 · 全修 commit `225ff71`）

| # | Commit | 文件 | 标题 |
|---|---|---|---|
| P2-1 | `4b867c3` | `AiTokenDashboardAppService.cs` | TopOrgs input.OrgId 信任绕过 caller claim |
| P2-2 | `4b867c3` | `GetSystemConfigTool.cs` | LLM cost fallback 0m vs aggregator 0.001/0.002 不一致 |
| P2-3 | `9169816` | `ApprovalAppService.cs` | my-pending 未按 caller 角色过滤（暴露他人待办） |
| P2-4 | `9169816` | `InterfaceTaskManager.cs` | 幂等键命中时未验证 payload（同 key 不同 payload 静默接受错误 task） |
| P2-5 | `3d38611` | `Chk004InterfaceStatusQueryContributor.cs` | 查询永远查自己 wrapper，不是真正请求的 target task |
| P2-6 | `3d38611` | `Chk001DailyReconciliationContributor.cs` | 用 UtcNow.Date 而非 task.BusinessId 解析日 → 跨午夜对账周期错位 |
| P2-7 | `3d38611` | `InterfaceMonitorAppService.cs` | GetExceptionList 不过滤 IsResolved（应默认仅未解决） |

### 6.4 修复落地

- **commit `225ff71`** — 三轨并行：a NC DI + RBAC / b 8 Contributor payload + retry / c 7 P2 finding
- 基线 1472 → 1484（+12 守护测试，3 P1 + 7 P2 全部 0 顺延）

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 5 候选方向（A NC 延续 / B 详设 10 / C 看板 / D NC 真接 / E 技术债）+ 4 决策点顺延占位 + Codex 14a 占位 |
| V0.1+ | 2026-05-14 | §五/§六 补 Codex 14a 评审完成结果（3 P1 + 7 P2 全修 commit 225ff71，0 顺延）+ §二.2 标记零顺延 + §二.1 加 Sprint 14a 后续 4 技术债 |
| V0.2 | 2026-05-14 | **cici 锁版** — 5 决策点全锁：①A+D 双轨（B/C/E 顺延）②4 累计技术债全修 ③12-15 PD 预算 ④主+2 子代理 sweet spot 3.8x ⑤Codex 14a 评审已完成 |
