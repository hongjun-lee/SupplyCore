# Sprint 13a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 13a 验收演示脚本
**配套：** [`Sprint-13a-任务卡-V0.2.md`](./Sprint-13a-任务卡-V0.2.md) + [`Sprint-13a-Day1-3-A-权限审批-设计-V0.2.md`](./Sprint-13a-Day1-3-A-权限审批-设计-V0.2.md)

---

## 一、Sprint 13a 落地范围

按 V0.2 锁版 5 决策点（A+C 双轨 / 4 累计技术债 / 12-15 PD / 主+2 子代理 / Codex 12a 评审已完成），本 Sprint 实际交付 **~7 PD**（预算 12-15 PD 内，含缓冲）：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| **D1-1** | A-20 ApprovalInstance 实体 + Wave 80 + EFCore 配置 | `edb640b` | a |
| **D1-2** | ApprovalInstanceManager 状态机（InitiateAsync / ApproveNodeAsync / RejectAsync / TerminateAsync）+ 12 测试 | `edb640b` | a |
| **D2-1** | WorkflowTemplate 补 4 核心模板 seed（WF-CON-001/PAY-001/PR-001/PO-001）| `edb640b` | a |
| **C-1** | R-09 TokenUsageDailyHigh 完整闭环（Sprint 12a D6-4 stub 转完整）+ 3 测试 | `edb640b` | b（子代理）|
| **§二.1** | P2-1 MonthlyPrepayment idempotent + P2-8 PaymentExecution Paid 守护 + 2 测试 | `edb640b` | c（子代理）|
| **D3-1** | ApprovalAppService 6 endpoint + ApprovalsController + 4 测试 | `8694eba` | a |
| **C-2** | PDF 导出（QuestPDF Community MIT 2024.12.3）+ AiTokenDashboard overview + 5 测试 | `8694eba` | c（子代理）|
| **§二.2** | Wave 81 UTC backfill NOTICE + ReportExport 审计接通 IAiCallLogManager + 8 测试 | `8694eba` | b（子代理）|
| **D4** | Sprint13aApproval_E2E 集成测试（4 个全链路场景）| 本文档 | a |
| **D5** | Demo 脚本 + Sprint 14a 草案 + Codex 13a 评审触发 | 本文档 | a |

**测试基线演进**：
- Sprint 12a 收尾：**1364**（Domain 793 / Application 539 / EFCore 26 / Web 6）
- Sprint 13a Day 1-2 第一波：**1381**（+17）
- Sprint 13a Day 3 第二波：**1398**（+17）
- **Sprint 13a Day 4 E2E**：**1402**（Domain 808 / Application 559 / EFCore 29 / Web 6 · +38 较 Sprint 12a）

---

## 二、Demo 演示路径

### 路径 A：权限审批主线（10 分钟）

1. **A-20 ApprovalInstance 实体 + Wave 80 migration**
   - 查 `a.approval_instance` 表 schema：自然索引 (business_entity, business_id, instance_state) 强约束
2. **8 类核心模板 seed**：4 V1.2a（DIR/RPR/CON-OVERLIMIT/SUP-REASSESS）+ 4 新（CON-001/PAY-001/PR-001/PO-001）
   - 查 WorkflowTemplate 8 条数据
3. **状态机演示**（HTTP API 调用）
   - POST `/api/supply-cores/approvals/initiate`（WF-CON-001, businessId=1001, 金额 50W）
   - POST `/api/supply-cores/approvals/{id}/approve`（业务主管 → 第 2 节点）
   - POST `/api/supply-cores/approvals/{id}/approve`（合同管理 → 第 3 节点）
   - POST `/api/supply-cores/approvals/{id}/approve`（总经理 → 终态 Approved）
4. **重复发起拦截**：同 businessId 再次 InitiateAsync → 抛 UserFriendlyException

### 路径 B：C 顺延（5 分钟）

1. **R-09 Token 用量超阈值 alert**
   - 模拟当日 Token > 100K → AiTokenUsageDailyAggregator 自动写 r.alert_log（AlertCode=R-09）
   - dedup 同 day 不重复（SourceBillType=AI-TOKEN）
2. **PDF 导出**
   - GET `/api/supply-cores/report-exports/daily-trend.pdf` → 验证 %PDF- header
3. **Token Dashboard overview**
   - GET `/api/supply-cores/ai-token-dashboard/overview` → 4 字段（Daily7Days / Top5Tools / TopOrgs / MonthTotal）

### 路径 C：累计技术债修复（5 分钟）

1. **P2-1 MonthlyPrepayment idempotent**：同月份重跑返已有记录而非空集
2. **P2-8 PaymentExecution Paid 守护**：execution 状态检查 + reconcile 分支
3. **Wave 81 UTC NOTICE**：升级时 PG session timezone 非 UTC 警告
4. **ReportExport cross-org 审计**：Excel/PDF 导出后 a.ai_call_log 留痕

---

## 三、验收要点

| # | 验收项 | 状态 |
|---|---|---|
| 1 | Codex 12a 评审 13/13 + 4 P1 + 8 P2 修复 | ✅ |
| 2 | A 主线：A-20 + 状态机 + 6 endpoint + Controller | ✅ |
| 3 | 8 类核心审批模板 seed | ✅ |
| 4 | C 顺延：R-09 + PDF + Dashboard | ✅ |
| 5 | 4 累计技术债（P2-1/P2-8/UTC/cross-org）全修 | ✅ |
| 6 | 集成 E2E 4 场景 | ✅ |
| 7 | 基线 ≥ 1380（实际 1402） | ✅ |
| 8 | sweet spot 3.8x 三轨并行 | ✅ |

---

## 四、Sprint 13a 收益总结

- **审批运行态接通** — ApprovalInstance + 状态机 + 6 endpoint，业务单据可走完整审批流（详设 10 V1.2 §6）
- **R-09 完整闭环** — Token 用量监控接通 r.alert_log（Sprint 12a stub 转完整）
- **导出能力升级** — Excel + PDF 双格式 + cross-org 审计留痕
- **累计技术债清零** — 4 项 P2（Sprint 11a 顺延 2 + Sprint 12a 顺延 2）全修
- **基线增长 +38** — 1364 → 1402

---

## 五、Sprint 14a 候选范围

详 [`Sprint-14a-任务卡-V0.1.md`](./Sprint-14a-任务卡-V0.1.md)（草案）。

主要方向：
1. **详设 08 NC 接口联调**（业务大头 - 47 PD 后端 + 229 PD 联调，一期 8-10 关键接口）
2. **详设 10 剩余 12 类审批模板** + 集团并行会签 + 阶段 A/B/C 适配
3. **详设 09 看板剩余 5 类**（已落 1 类 AiTokenDashboard）
4. **B NC 接口外部依赖** + ABP Interceptor 重构高敏感拦截器（Sprint 13a §一A 决策点 2 顺延）
5. **NCalc 表达式引擎接入**（替代 condition_expr 硬编码 if-else）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — Sprint 13a 收尾 Demo 脚本 + Sprint 14a 候选 |
