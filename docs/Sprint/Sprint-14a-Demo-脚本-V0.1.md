# Sprint 14a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 14a 验收演示脚本
**配套：** [`Sprint-14a-任务卡-V0.2.md`](./Sprint-14a-任务卡-V0.2.md) + [`Sprint-14a-Day1-X-A-NC接口联调-设计-V0.2.md`](./Sprint-14a-Day1-X-A-NC接口联调-设计-V0.2.md)

---

## 一、Sprint 14a 落地范围

按 V0.2 锁版 5 决策点（A NC 接口联调 / 9 累计技术债全修 / 12-15 PD / 主+2 子代理 sweet spot 3.8x / Codex 13a 评审已完成），本 Sprint 实际交付 **~14 PD**（预算 12-15 PD 内）：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| **D1-1** | F-14 InterfaceDefinition + F-13 InterfaceSwitch + F-01 InterfaceTask + Wave 84 migration | `4b867c3` | a |
| **D1-2** | F-02 InterfaceMessage + F-03 InterfaceReceipt + F-04 InterfaceLog + F-08 ExceptionRecord（V0.2 改进 #1）| `4b867c3` | a |
| **C-1（决策点顺延 #1）** | CostEstimate SY-02 模型价格表接通 | `4b867c3` | c |
| **C-2（决策点顺延 #4）** | R-09 SMTP 真接通（MailKit + StubMailSender）| `4b867c3` | c |
| **§二.2 Codex** | Codex 13a 5 P2 全修（R-09 调度顺序 / OrgId dup / SupplierId scope / TopOrgs scope / ReportExport audit）| `4b867c3` | b |
| **D2-1** | INcInterfaceClient HTTP 抽象 + Polly retry + 幂等键 | `9169816` | a |
| **D2-2** | InterfaceTaskManager 状态机 + IRecurringJobManager（Hangfire 调度） | `9169816` | a |
| **D2-3** | NcInterfaceMockClient stub（V0.2 改进 #2 解锁本地联调）| `9169816` | a |
| **D3-1** | MD-001 物料-存货映射同步（M-14 → NC）| `9169816` | a |
| **D3-2** | MD-004 成本中心对照同步（NC → 物资）| `9169816` | a |
| **C-3（决策点顺延 #2）** | NCalc 表达式引擎 + A-20 chain_snapshot 接通 | `9169816` | c |
| **C-4（决策点顺延 #3）** | ICurrentUserRoleResolver + ApprovalAppService RBAC 二期 | `9169816` | c |
| **D4** | BIZ-001 采购入库（S-05 → NC）+ BIZ-005 领料出库（S-09 → NC）| Day 3 三波 | a |
| **D5** | BIZ-014 预付款登记 + BIZ-020 付款执行（C-08/C-10 → NC）| Day 3 三波 | b |
| **D6** | CHK-001 日对账 + F-06 reconciliation_record + CHK-004 接口状态查询 | Day 3 三波 | a |
| **D7-1** | InterfaceMonitorAppService + Controller（dashboard 4 endpoint：成功率/失败率/耗时/重试数）+ 8 测试 | Day 3 三波 | c |
| **D7-2** | 异常监控 LogWarning（F-08 触发后 logger 实时告警通道）+ 1 守护测试 | Day 3 三波 | c |
| **D8** | Sprint 14a 集成 E2E + Demo 脚本 + Sprint 15a 草案 + Codex 14a 评审触发 | 本文档 | a |

**测试基线演进**：

| 阶段 | Domain | Application | EFCore | Web | **合计** | 较前波 |
|---|---|---|---|---|---|---|
| Sprint 13a 收尾 | 808 | 559 | 29 | 6 | **1402** | - |
| Sprint 14a Day 1-2 三轨第一波（`4b867c3`）| 818 | 581 | 32 | 6 | **1437** | +35 |
| Sprint 14a Day 2-3 三轨第二波（`9169816`）| 832 | 590 | 34 | 6 | **1462** | +25 |
| Sprint 14a Day 3 三轨第三波 + D7 + Demo | 833 | 599 | 34 | 6 | **1472** | +10 |

**Sprint 14a 累计 +70 测试**（1402 → 1472），9 累计技术债全修，A 主线 8 核心接口骨架 + 4 类核心 MD/BIZ 接口 + Mock Stub 全落地。

---

## 二、Demo 演示路径

### 路径 A：NC 接口联调主线（15 分钟）

#### 2.1 表骨架 + Mock Stub（D1-1 / D1-2 / D2-3）

1. **F-14 InterfaceDefinition 8 接口元数据 seed**
   - 查 `f.interface_definition`：MD-001/004 / BIZ-001/005/014/020 / CHK-001/004（is_enabled=true）
2. **F-13 InterfaceSwitch 灰度开关**
   - 查 `f.interface_switch`：每个接口对应一行开关 row
3. **F-01 InterfaceTask 幂等键约束**
   - SQL `\d f.interface_task` 查看 UNIQUE (interface_code, idempotency_key)

#### 2.2 状态机演示（D2-2 + D7-1 dashboard 验证）

1. **创建 BIZ-001 任务 → CreateTaskAsync**
   - 调 `InterfaceTaskManager.CreateTaskAsync(1L, "BIZ-001", "s_05", 1001L, "BIZ-001-1001", payload)`
   - 验证 F-01 `task_state='待处理'` + F-02 报文写入
2. **Hangfire worker 抢任务 → MarkInProgressAsync**
   - F-01 task_state '待处理' → '处理中'
3. **调 NcInterfaceMockClient → MarkSuccessAsync**
   - F-01 task_state '处理中' → '成功'
   - F-03 InterfaceReceipt 写凭证号 `MOCK-BIZ-001-xxx`
4. **失败重试演示（关键路径）**
   - 构造一个 max_retry=2 task → MarkFailedOrRetryAsync 2 次
   - 第 1 次：`task_state='重试中'` + F-04 写 Warning + **D7-2 LogWarning 触发**（实时告警通道）
   - 第 2 次（达 max_retry）：`task_state='失败'` + F-08 ExceptionRecord 写入 + LogError 触发

#### 2.3 接口监控 Dashboard（D7-1 4 endpoint）

1. **GET `/api/supply-cores/interface-monitor/overview`**
   - 验证返回：TotalCount / SuccessCount / FailedCount / SuccessRate (0.5) / FailedRate (0.25) / AvgDurationMs / TotalRetries / OpenExceptionCount
2. **GET `/api/supply-cores/interface-monitor/tasks?interfaceCode=BIZ-001&taskState=失败`**
   - 验证 F-01 列表过滤 + 倒序 + 分页
3. **GET `/api/supply-cores/interface-monitor/reconciliations?reconcileType=Daily`**
   - 验证 F-06 对账记录列表
4. **GET `/api/supply-cores/interface-monitor/exceptions?onlyUnresolved=true&severity=High`**
   - 验证 F-08 异常台账列表（仅高严重未解决）

### 路径 B：累计技术债 9 项全修（10 分钟）

#### 2.4 决策点顺延 4 项

1. **#1 CostEstimate SY-02 模型价格表**：单元价从 SY-02 字典查询，CostEstimate 不再硬编码
2. **#2 NCalc 表达式引擎**：A-20 chain_snapshot.condition_expr 支持 `Amount >= 100000 and Org == 5` 表达式
3. **#3 RBAC ICurrentUserRoleResolver**：ApprovalAppService.ApproveNodeAsync 校验 caller 角色匹配 chain_snapshot 当前节点 approver_role
4. **#4 R-09 SMTP 真接通**：R09NotificationService 配置完整时 MailKit StartTls 发送告警邮件，缺失时降级 LogWarning + 保留 r.alert_log

#### 2.5 Codex 13a P2 顺延 5 项

5. **P2-5 R-09 调度顺序**：DailyAggregator 末尾触发 R-09 时机优化
6. **P2-6 ReportAlert OrgId=0 dup 防御**：dedup 范围扩展跨集团合计行
7. **P2-7 MonthlyPrepayment SupplierId scope**：除 OrgId+Month 外加 SupplierId 隔离
8. **P2-8 AiTokenDashboard TopOrgs OrgId scope**：caller OrgId claim fallback
9. **P2-9 ReportExport audit OrgId/AlertCode**：cross-org 留痕粒度增强

### 路径 C：NCalc 表达式 + RBAC（5 分钟）

1. **NCalc 沙箱模式 + 表达式白名单**
   - 演示 `Amount >= 100000` 通过；`System.IO.File.Delete(...)` 拒绝
2. **RBAC chain_snapshot.approver_role 匹配**
   - caller 角色 `合同管理` → 通过第 2 节点
   - caller 角色 `仓库管理员` → UserFriendlyException "角色不匹配"

---

## 三、验收要点

| # | 验收项 | 状态 |
|---|---|---|
| 1 | Codex 13a 评审 3/3 + 2 P1 全修 + 9 P2 处理（4 修 + 5 顺延 14a） | ✅ |
| 2 | A 主线：F-14/F-13/F-01/F-02/F-03/F-04/F-06/F-08 8 表骨架 + Wave 84 落地 | ✅ |
| 3 | INcInterfaceClient + NcInterfaceMockClient + InterfaceTaskManager 状态机 | ✅ |
| 4 | 4 类核心接口（MD-001/004 + BIZ-001/005/014/020 + CHK-001/004）+ 8 mock JSON 响应 | ✅ |
| 5 | InterfaceMonitorAppService dashboard 4 endpoint + RESTful Controller | ✅ |
| 6 | 异常监控（F-08 InsertAsync + LogError + 重试 LogWarning 双告警链）| ✅ |
| 7 | 9 累计技术债全修（决策点 4 + Codex 13a 5）| ✅ |
| 8 | 基线 ≥ 1453（实际 **1472**，+70 较 Sprint 13a 收尾 1402）| ✅ |
| 9 | sweet spot 3.8x 主 a + 2 子代理 b/c 三轨并行 | ✅ |
| 10 | Demo 脚本 + Sprint 15a 草案 + Codex 14a 评审触发 | ✅ |

---

## 四、Sprint 14a 收益总结

- **NC 接口框架完整接通** — F-14 元数据 + F-01 状态机 + F-02/F-03/F-04 报文链 + F-06 对账 + F-08 异常台账（详设 08 V1.1 §六 8 张表骨架全落地）
- **4 类核心接口骨架 + Mock Stub** — MD-001/004 主数据 + BIZ-001/005/014/020 业务 + CHK-001/004 对账（一期 8/29 接口）
- **接口监控 dashboard 全套** — InterfaceMonitorAppService 4 endpoint（overview / tasks / reconciliations / exceptions）+ RESTful Controller + 8 单测
- **异常监控双告警链** — 重试路径 LogWarning（实时告警 + F-04 持久化）+ 终态失败 LogError + F-08 ExceptionRecord（运维台账）
- **9 累计技术债清零** — 决策点 4（CostEstimate SY-02 / NCalc / RBAC / R-09 SMTP）+ Codex 13a 5 P2 顺延全部落地
- **基线增长 +70** — 1402 → 1472（Domain +25 / Application +40 / EFCore +5）
- **sweet spot 3.8x 验证** — 主 a + 子 b + 子 c 三轨并行 ~14 PD 实际 ~3.7 PD 等效工时

---

## 五、Sprint 15a 候选范围

详 [`Sprint-15a-任务卡-V0.1.md`](./Sprint-15a-任务卡-V0.1.md)（草案）。

主要方向：

1. **A 主线延续 — 剩余 14 BIZ 接口 + F-10/F-11 月结反结 + F-12 NC 凭证科目规则配置化**（详设 08 一期未完 21 PD）
2. **B 详设 10 剩余 12 类审批模板 + 集团并行会签 + 阶段 A/B/C 适配 + ABP Interceptor 重构**（Sprint 14a B 顺延 10-12 PD）
3. **C 详设 09 看板剩余 5 类 + 自定义 SQL OLAP**（Sprint 14a C 顺延 8-10 PD）
4. **D NC 厂商真实接口对接**（依赖 Sprint 15a NC 厂商配合度确认）
5. **累计技术债** — Codex 14a finding 累计（占位待评审）+ 其他

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — Sprint 14a 收尾 Demo 脚本（A NC 主线 + 9 技术债 + dashboard）+ Sprint 15a 候选 |
