# Sprint 15a 任务卡 V0.1（草案 · 待 cici 锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 2026-05-14）
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

### 2.1 Sprint 14a 决策点顺延（已识别）

> 占位待 Sprint 14a Codex 评审 finding 累计补充。

| # | 项 | 复杂度 | 工时 |
|---|---|---|---|
| 1 | _占位_ — Sprint 14a Codex 评审 P2 顺延（待评审）| - | - |
| 2 | _占位_ — Sprint 14a A 主线一期未覆盖 NC 异常场景压测（如断网 / 5XX / 慢响应）| 中 | 0.5-1 PD |
| 3 | _占位_ — 接口监控 dashboard cross-org 视图 scope（一期监控视图未应用 RBAC OrgId 过滤）| 中 | 0.5 PD |
| 4 | _占位_ — Wave 84 升级前 PG session timezone NOTICE（参考 Wave 81 模式）| 低 | 0.3 PD |

### 2.2 Codex 14a 顺延 P2（待评审后补 §七 附录）

> 占位 — Codex 14a 三波评审完成后从顺延清单挑出 P2-低复杂度补到本节。

**当前已知占位**：3 commits（`4b867c3` Day 1-2 第一波 + `9169816` Day 2-3 第二波 + Day 3 第三波待 commit）等 Codex 评审。

**预估合计 ~2-4 PD**（占位等评审后修订）

---

## 三、V0.1 决策点（待 cici 锁版）

| # | 决策点 | V0.1 倾向 | **V0.1 锁版** | 影响 |
|---|---|---|---|---|
| 1 | Sprint 15a 主线方向（A/B/C/D/E） | A 延续 + D NC 真接 | _待 cici_ | 选 A 优先解锁剩余 BIZ，选 D 优先解锁 NC 厂商真接 |
| 2 | 累计技术债必修哪些 | 4 决策点顺延 + Codex 14a 顺延（待评审）| _待 cici_ | 工时 ~3-5 PD |
| 3 | 工时预算 | 10-15 PD | _待 cici_ | A 12-17 + 债 3-5 = 15-22 PD 略超须 cici 评估 |
| 4 | 子代理并行策略 | 主+2 子代理 | _待 cici_ | sweet spot 3.8x（同 Sprint 13a/14a）|
| 5 | Codex 14a 评审时机 | Sprint 14a 收尾即触发 | _待 cici_ | Sprint 15a §六 附录待补 |

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

## 五、Codex 14a 评审待触发

> 占位 — Sprint 14a 完成时（D8 后）触发 Codex 14a 评审 3 commits（`4b867c3` Day 1-2 第一波 + `9169816` Day 2-3 第二波 + Day 3 第三波）

**评审重点（建议提示词）**：
- A 主线 NC 接口框架（F-01 状态机幂等键 / 重试 backoff / F-08 异常台账 / NcInterfaceMockClient stub 安全性）
- C 决策点顺延（NCalc 沙箱 + 白名单 / RBAC role resolver / R-09 SMTP fail-safe）
- D7 dashboard 视图（SuccessRate 边界值 / 时间窗默认值 / 分页防 SQL injection）

---

## 六、Codex 14a Finding 附录（占位 — 待评审后补）

| Sprint 14a Day | Commits | 已评 | finding 数 |
|---|---|---|---|
| Day 1-2 三轨第一波 | `4b867c3` | _待评_ | - |
| Day 2-3 三轨第二波 | `9169816` | _待评_ | - |
| Day 3 三轨第三波 + D7 + Demo | _待 commit_ | _待评_ | - |
| **合计** | 3 | **0** | _待评_ |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 5 候选方向（A NC 延续 / B 详设 10 / C 看板 / D NC 真接 / E 技术债）+ 4 决策点顺延占位 + Codex 14a 占位 |
