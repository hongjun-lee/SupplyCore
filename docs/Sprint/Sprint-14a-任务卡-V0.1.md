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

### 2.1 Sprint 11a/12a/13a 决策点顺延

| # | 项 | 复杂度 | 工时 |
|---|---|---|---|
| 1 | **CostEstimate** 改 SY-02 模型价格表（Sprint 12a P2-9 顺延 + Sprint 13a A 决策点 3 NCalc 引擎前置） | 中 | 0.8 PD |
| 2 | **A-20 chain_snapshot** schema 升级到 ABP NCalc / 表达式引擎（Sprint 13a 决策点 3 顺延） | 中 | 1 PD |
| 3 | **角色权限矩阵 + ICurrentUser.OrgId 扩展 + 完整 RBAC**（Sprint 13a A 决策点 2 顺延 + Codex 13a P1 完整版） | 中 | 1.5 PD |
| 4 | **R-09 SMTP 邮件接通**（Sprint 13a C-1 stub log 转真邮件） | 低 | 0.5 PD |

### 2.2 Sprint 13a Codex 13a 顺延 P2（详 §七 附录）

| # | 来源 commit | 项 | 复杂度 | 工时 |
|---|---|---|---|---|
| 5 | edb640b | R-09 调度顺序（DailyAggregator 触发 R-09 时机优化）| 低 | 0.3 PD |
| 6 | edb640b | ReportAlert OrgId=0 dup 防御（dedup 范围扩展）| 低 | 0.3 PD |
| 7 | edb640b | MonthlyPrepayment SupplierId scope 增强 | 中 | 0.5 PD |
| 8 | 8694eba | AiTokenDashboard TopOrgs OrgId scope 校验 | 低 | 0.3 PD |
| 9 | 8694eba | ReportExport audit inputParams 补 OrgId / AlertCode | 低 | 0.3 PD |

**合计 ~5.5 PD**（Sprint 决策点顺延 3.8 PD + Sprint 13a Codex 顺延 1.7 PD）

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

## 五、Codex 13a 评审已完成

Codex 13a 评审 3 commits 完成（commits edb640b / 8694eba / bcf6f7f）：
- 2 P1 全修（commit `091c276`）：ApprovalAppService self-approve 防御 + my-pending 按 caller 过滤
- 4 P2 修：ApprovalInstance partial unique（Wave 82）+ Wave 83 Repair_Aggregate_Data（修 Wave 79 软删孤儿 + Wave 76 UTC bucket）
- 3 P2 顺延 Sprint 14a §二.2
- 1 zero-finding ✨：bcf6f7f E2E

---

## 六、Codex 13a Finding 附录（完成 3/3 — 2026-05-14）

### 6.1 整体统计

| Sprint 13a Day | Commits | 已评 | finding 数 |
|---|---|---|---|
| Day 1-2 三轨第一波 | edb640b | 1 | 5 (0 P1 + 5 P2) |
| Day 3 三轨第二波 | 8694eba | 1 | 4 (**2 P1** + 2 P2) |
| Day 4 集成 E2E | bcf6f7f | 1 | 0 ✨ |
| **合计** | 3 | **3** | **2 P1（全修）/ 7 P2（4 修 + 3 顺延）/ 1 zero-finding** |

### 6.2 P1 finding（2 个 · 全修 commit `091c276`）

| # | Commit | 文件 | 标题 | 修复 |
|---|---|---|---|---|
| P1-1 | `8694eba` | `ApprovalAppService.cs:54` | approve/reject 仅校验登录态，未防 self-approve / 任意用户推进他人审批 | self-approve 防御（caller != InitiatorUserId）|
| P1-2 | `8694eba` | `ApprovalAppService.cs:83-87` | my-pending 返回全系统 InProgress 泄露他人待办 | 按 InitiatorUserId == caller 过滤 |

> 一期简化版（完整 RBAC 顺延 §二.1 #3 Sprint 14a 角色权限矩阵接通）

### 6.3 P2 finding（7 个）

**已修 4 个（commit `091c276`）**：

| # | Commit | 标题 | 修复 |
|---|---|---|---|
| P2-1 | `edb640b` | Wave79 DROP IsDeleted 前未删软删孤儿 → 已升级 DB 有"复活"行 | Wave 83 Repair_Aggregate_Data DELETE + UTC bucket 重建 |
| P2-2 | `edb640b` | Wave76 backfill 用 date_trunc 依赖 session timezone | 同上 Wave 83 UTC bucket |
| P2-3 | `edb640b` | ApprovalInstance InProgress 并发竞态可创建多实例 | Wave 82 partial unique index ON (business_entity, business_id) WHERE state='审批中' |
| P2-4 | `8694eba` | （已并入 P2-1 修复链路 — Wave 83 + Wave 82 双管齐下）| ✅ |

**顺延 Sprint 14a §二.2（3 个 P2-中低）**：

| # | Commit | 标题 |
|---|---|---|
| P2-5 | `edb640b` | R-09 调度顺序（DailyAggregator 末尾触发 R-09 时机优化）|
| P2-6 | `edb640b` | ReportAlert OrgId=0 dup 防御（dedup 范围扩展跨集团合计行）|
| P2-7 | `edb640b` | MonthlyPrepayment SupplierId scope 增强（除 OrgId+Month 外加 SupplierId）|
| P2-8 | `8694eba` | AiTokenDashboard TopOrgs 未应用 OrgId scope 校验 |
| P2-9 | `8694eba` | ReportExport audit inputParams 未带 OrgId/AlertCode（cross-org 留痕粒度不够） |

### 6.4 Zero-finding（Codex 认可干净）

| Commit | 状态 |
|---|---|
| `bcf6f7f` Sprint 13a Day 4 集成 E2E（4 全链路场景）| ✨ "did not identify a discrete regression" |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 3 候选方向（A NC / B 详设 10 / C 看板）+ 9 累计技术债（4 决策点顺延 + 5 Codex 13a 顺延）+ 5 决策点 + §六 Codex 13a 3/3 评审附录（2 P1 全修 + 4 P2 已修 + 3 P2 顺延 + 1 ✨）|
