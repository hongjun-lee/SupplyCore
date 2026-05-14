# Sprint 14a 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 14a 起步草案
**配套：** [`Sprint-13a-Demo-脚本-V0.1.md`](./Sprint-13a-Demo-脚本-V0.1.md) §五 候选范围

---

## 一、Sprint 14a 候选方向（待 cici V0.1 锁版决策点 1）

按 Sprint 13a Demo §五 推荐 5 个方向，cici 评审时锁版选 1-2 个：

### 候选 A：详设 08 NC 接口联调（业务大头中的大头）

| Task | 范围 | 工时 |
|---|---|---|
| 14a-A1 | NC 厂商接口能力对接函（08A V0.2 + 08B V0.1）+ 接口数据格式确认 | 1-2 PD |
| 14a-A2 | 8-10 关键接口联调（C-09 BIZ-PAY-BATCH / C-10 callback / NC 凭证 / 反结 / 接口重推）| 5-8 PD |
| 14a-A3 | 异常处理 + 重试 + 死信队列 | 1-2 PD |
| 14a-A4 | 接口监控 dashboard（成功率 / 失败率 / 平均耗时）| 1 PD |

**优势**：业务最复杂 + Sprint 12a/13a 已落基础（C-08~C-10 + 审计）
**风险**：NC 厂商配合度不确定（+30 PD 缓冲）
**预算**：10 PD

### 候选 B：详设 10 剩余 12 类审批模板 + 高级特性

| Task | 范围 | 工时 |
|---|---|---|
| 14a-B1 | 剩余 12 类审批模板配置（WF-TRF/CNT/SHT/SCP/EQP/RNT/MDT/SUP/REV/RPT/PUR-EXC 等）| 3-4 PD |
| 14a-B2 | 集团并行会签 V1.2（OR 节点支持）| 2 PD |
| 14a-B3 | 阶段 A/B/C 适配层（详设 10A V0.6）| 2-3 PD |
| 14a-B4 | ABP Interceptor 重构高敏感拦截器（Sprint 13a §一A 决策点 2 顺延）| 1 PD |
| 14a-B5 | NCalc 表达式引擎接入 condition_expr（替代硬编码 if-else）| 1-2 PD |

**优势**：详设 10 V1.2 完整闭环
**风险**：20 类模板配置 + 21 高敏感拦截器全覆盖工作量大
**预算**：10-12 PD

### 候选 C：详设 09 看板剩余 5 类 + 自定义 SQL OLAP

| Task | 范围 | 工时 |
|---|---|---|
| 14a-C1 | 5 类大屏看板（8 PD/个，一期挑 3 类）：合同 / 付款 / 库存 | 4-6 PD |
| 14a-C2 | 看板 Org Logo 管理 + PDF 模板复用 | 1 PD |
| 14a-C3 | SelfServiceReport 升级 OLAP 自定义 SQL（决策点 3 Sprint 12a 顺延）| 2-3 PD |

**优势**：业务部门 dashboard 需求大
**风险**：UI 同学配合 + 前端 Sprint 15a 集成
**预算**：8-10 PD

---

## 二、累计技术债（Sprint 14a 必修，决策点 2）

| # | 项 | 复杂度 | 工时 |
|---|---|---|---|
| 1 | **CostEstimate** 改 SY-02 模型价格表（Sprint 12a P2-9 顺延 + Sprint 13a A 决策点 3 NCalc 引擎前置） | 中 | 0.8 PD |
| 2 | **A-20 chain_snapshot** schema 升级到 ABP NCalc / 表达式引擎（Sprint 13a 决策点 3 顺延） | 中 | 1 PD |
| 3 | **角色权限矩阵 + ICurrentUser.OrgId 扩展**（Sprint 13a A 决策点 2 顺延） | 中 | 1 PD |
| 4 | **R-09 SMTP 邮件接通**（Sprint 13a C-1 stub log 转真邮件） | 低 | 0.5 PD |

**合计 ~3.3 PD**

---

## 三、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 14a 主线方向（A/B/C） | A NC 接口联调（业务最急，Sprint 12a/13a 已落基础） |
| 2 | 4 累计技术债必修哪些 | 全修（~3.3 PD，预算余裕）|
| 3 | 工时预算 | 12-15 PD（同 Sprint 12a/13a 经验值） |
| 4 | 子代理并行策略 | 主 + 2 子代理（sweet spot 3.8x，已验证）|
| 5 | Codex 13a 评审时机 | Sprint 13a 收尾后 cici 触发 |

---

## 四、Sprint 14a 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 厂商配合度不确定 | 高 | 一期仅 8-10 关键接口 + 异常路径全覆盖 + 缓冲 +5 PD |
| 2 | NC 数据清洗复杂 | 中 | Sprint 12a 已建审计 + 接口监控；Sprint 14a 加 dashboard 早发现 |
| 3 | ABP Interceptor 重构破现有 [SensitiveOperation] | 中 | 守护测试全覆盖（19 SensitiveOperation seed）+ 灰度切换 |
| 4 | NCalc 表达式引擎安全（如代码注入）| 低 | 表达式白名单 + 沙箱模式 + 测试 SQL injection |
| 5 | 看板前端依赖 UI 同学协调 | 中 | 先后端 endpoint + 前端 Sprint 15a 集成 |

---

## 五、Sprint 13a Codex 12a 评审已完成

Codex 12a 评审 13 commits 完成（详 Sprint-13a-V0.2 §七）：
- 4 P1 全修：Wave 78 setval / Hangfire reports / HTTP Controller / smoke 守护
- 8 P2 已修：守护强化 / filter 校验 / 软删 UK / Wave 81 / cross-org 审计 / Wave 79
- 2 P2 顺延（已在 Sprint 13a 完成）

Codex 13a 评审待 cici Sprint 13a 收尾后触发：
- 累计 ~5 commits（edb640b / 8694eba + E2E + Demo + 本任务卡）
- 预计 finding 数 ~3-5（按 Sprint 12a 7 commits 经验外推）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 3 候选方向（A NC / B 详设 10 / C 看板）+ 4 累计技术债 + 5 决策点 |
