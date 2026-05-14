# Sprint 13a 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 13a 起步草案
**配套：** [`Sprint-12a-Demo-脚本-V0.1.md`](./Sprint-12a-Demo-脚本-V0.1.md) §五 候选范围

---

## 一、Sprint 13a 候选方向（待 cici V0.1 锁版决策点 1）

按 Sprint 12a Demo §五 推荐 3 个方向，cici 评审时锁版选 1-2 个：

### 候选 A：详设 10 权限审批流（60 PD 后端 + 45 前端，**业务大头**）

| Task | 范围 | 工时 |
|---|---|---|
| 13a-A1 | 20 类审批模板配置（WF-DIR / WF-RPR / WF-CON-OVERLIMIT / WF-SUP-REASSESS 等） | 4-5 PD |
| 13a-A2 | 21 条高敏感操作拦截器（SENS-CON-003/004 等） | 2-3 PD |
| 13a-A3 | 角色权限矩阵初始化（10A V0.6 §角色权限） | 1-2 PD |
| 13a-A4 | 阶段 A/B/C 适配层（详设 10A） | 2-3 PD |
| 13a-A5 | 集团并行会签 V1.2 + sub_group_id A-06 一刀切口径 | 1-2 PD |

**优势**：业务最急需（流程审批是日常操作核心）
**风险**：20 类模板配置与测试工作量大；阶段 A/B/C 适配层涉及详设 10A V0.6 复杂规则
**预算**：10 PD（一期不全做完 60 PD，仅核心 20 类模板 + 部分拦截器）

### 候选 B：详设 08 NC 接口联调（业务大头中的大头，47 PD + 229 PD 联调）

| Task | 范围 | 工时 |
|---|---|---|
| 13a-B1 | NC 厂商接口能力对接函（08A V0.2 + 08B V0.1） | 1-2 PD |
| 13a-B2 | 29 个接口 ×4 PD 联调（一期仅做 8-10 关键接口） | 5-8 PD |
| 13a-B3 | 对账封账反结 + 委托加工受托虚拟仓成本并入 | 2-3 PD |
| 13a-B4 | 异常处理 + 重试 + 死信队列 | 1-2 PD |

**优势**：业务最复杂（涉及与 NC 厂商外部对接 + 数据清洗 + 异常处理）
**风险**：依赖 NC 厂商配合度 + 数据格式不确定（外部对接缓冲 +30 PD）
**预算**：10 PD（一期不全做完 276 PD，仅核心 8-10 接口 + 异常处理）

### 候选 C：详设 09 看板 + R-09 完整闭环（22 PD 后端 + 50 前端）

| Task | 范围 | 工时 |
|---|---|---|
| 13a-C1 | R-09 ReportAlertCodes 新增 + Aggregator 接通 r.alert_log（Sprint 12a D6-4 stub 转完整） | 0.5 PD |
| 13a-C2 | SMTP 邮件通知接通（替代 stub log） | 1 PD |
| 13a-C3 | 6 类大屏看板（8 PD/个，一期仅做 2 类）：Token 用量 + 预警概览 | 2-3 PD |
| 13a-C4 | PDF 导出（QuestPDF + Org logo 管理，Sprint 12a 砍掉的部分） | 1-2 PD |
| 13a-C5 | 自定义 SQL OLAP（如业务确认需要） | 2-3 PD |

**优势**：Sprint 12a 顺延债务清理；看板是 V0.x 验收门
**风险**：看板设计需 UI 同学配合（前端 50 PD 占比大）
**预算**：8-10 PD（一期 R-09 + SMTP + 2 类看板 + PDF）

---

## 二、累计技术债（Sprint 13a 必修，决策点 2）

### 2.1 Sprint 11a Codex 11a §七 顺延（Sprint 12a 累计）

| # | 项 | 复杂度 | 工时 |
|---|---|---|---|
| 1 | **P2-1** MonthlyPrepayment idempotent rerun（C-09 同月份重跑应返已有而非生成新行） | 中 | 0.5 PD |
| 2 | **P2-8** PaymentExecution Paid shortcut 状态守护（C-08 已 Paid 时不跳过 C-10/C-02 更新） | 中 | 0.5 PD |
| 3 | **CostEstimate** 改 SY-02 模型价格表（替代 $0.001/$0.002 固定值） | 低 | 0.5 PD |

### 2.2 Sprint 12a Codex 12a §七 顺延（详 §七 评审附录）

| # | 来源 commit | 项 | 复杂度 | 工时 |
|---|---|---|---|---|
| 4 | 43fbab6 | Wave 76 backfill SQL `date_trunc('day', alert_time)` 用 session timezone — 改 AT TIME ZONE 'UTC' 保证一致；需 Wave 80 fix | 低 | 0.3 PD |
| 5 | 75c63b1 | ReportExport cross-org Excel 导出缺审计（caller_org + 行数 + 时间范围）— 接 IAiCallLogManager 或新 r.* 表 | 中 | 0.5 PD |
| 6 | 21846a2 / 20a567d | Sprint-12a 任务卡 §七 文档不一致（D9 行 + P1 计数 + commit ref 假串） | 低 | 0.2 PD |

**合计 ~2.5 PD**（Sprint 11a 顺延 1.5 PD + Sprint 12a 顺延 1.0 PD）

---

## 三、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 13a 主线方向（A / B / C） | A 权限审批 + C R-09 看板（双轨） |
| 2 | P2-1 + P2-8 累计技术债是否必修 | 必修（Sprint 12a 顺延债务） |
| 3 | Sprint 13a 工时预算 | 10-12 PD（同 Sprint 11a 经验值）|
| 4 | 子代理并行策略 | 主代理 + 子代理 b/c（A 模板 + C 看板并行） |
| 5 | Codex 12a 评审时机 | Sprint 12a 收尾后 cici 触发 + 累计 finding 进 Sprint 13a 任务卡 |

---

## 四、Sprint 13a 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 详设 10 20 类审批模板配置工作量大 | 中 | 一期仅核心 10 类 + 复杂类型 Sprint 14a |
| 2 | 详设 08 NC 厂商配合度不确定 | 高 | 优先对接 8-10 关键接口 + 异常路径覆盖 + 缓冲 +5 PD |
| 3 | 详设 09 看板 UI 同学协调 | 中 | 先后端 endpoint + 前端 Sprint 14a 集成 |
| 4 | P2-1 跨 D1 P1-3 边界修复 | 低 | idempotent 同月份重跑返已有 + 测试覆盖前期回归 |
| 5 | 三轨并行 sweet spot 3.8x | 低 | spawn 前 30s 探查（按 memory `feedback_subagent_complexity_pre_check`）|

---

## 六、Sprint 12a 累计成果（基线 1262 → 1364）

详 [`Sprint-12a-Demo-脚本-V0.1.md`](./Sprint-12a-Demo-脚本-V0.1.md)：
- Day 1-2 修 4 P1 + 5 P2-高严重 + 守护测试
- Day 3-5 详设 12 报表统计完善（cici V0.2 锁版）
- Day 6 详设 11 Token DailyAggregator + 4 endpoint dashboard + 异常监控 stub
- Day 9 集成 E2E（详设 12 + 详设 11 全链路）
- Day 10 Demo 脚本 + Sprint 13a 草案
- Codex 12a 评审 13/13 完成 + 4 P1 修复 + 8 P2 修复（详 §七）

---

## 七、Codex 12a 13 commits Finding 附录（完成 13/13 — 2026-05-14）

### 7.1 整体统计

| Sprint 12a Day | Commits | 已评 | finding 数 |
|---|---|---|---|
| D1-2 修复（4 P1 + 5 P2 + 守护）| 21846a2 / 0421b11 / d2be1d0 / ddb8534 / 20a567d | 5 | 6 (1 P1 + 5 P2 + 2 ✨) |
| D3-5 详设 12 | 43fbab6 / 0c7b2e4 / 1f63c25 / 75c63b1 / f871986 | 5 | 11 (3 P1 + 8 P2，部分 P1 与 D6 同源) |
| D6 + D9 | e631b48 / 881afdd / 8ee346e | 3 | 2 (1 P1 + 1 P2 + 2 ✨) |
| **合计** | 13 | **13** | **5 P1（去重 4）/ 14 P2（去重 12）/ 4 zero-finding** |

### 7.2 P1 finding（4 个去重，全部已修）

| # | Commit | 文件 | 标题 | 修复 commit |
|---|---|---|---|---|
| **P1-1** | `d2be1d0` | `Wave75 migration.cs:24-27` | Wave 75 用 PG IDENTITY 自增 id，但 Wave 71/73 固定 id seed 未推进 identity sequence → nextval 撞已有 id → PK conflict | `0a353b8` Wave 78 setval |
| **P1-2** | `0c7b2e4` / `e631b48` | `SupplyCoresWebModule.cs:99` | AddHangfireServer.Queues 仅 default/alerts/monthly-batch，未含 reports → AlertAggregateDaily / AiTokenUsageDaily 02:00/02:10 任务永不执行 | `d1a0563` Queues 加 "reports" |
| **P1-3** | `75c63b1` | `ReportExportAppService.cs:15` | ReportExport / ReportAggregator / SelfServiceReport / AiTokenUsageQuery 4 个 AppService 无 HTTP Controller → 端点对外不可达 | `a8e7b19` 新增 4 Controller |
| **P1-4** | `f871986` | `AlertAggregateDaily_Cron_Smoke_Tests.cs:39-40` | smoke test 字符串搜索过弱，未真正校验 options.Queues 含 reports → P1-2 之前回归未拦住 | `0a353b8` 守护强化 + `d1a0563` 加 Queues 断言 |

### 7.3 P2 finding（12 个去重）

**已修 8 个**：

| # | Commit | 文件 | 标题 | 修复 commit |
|---|---|---|---|---|
| P2-1 | `21846a2` / `20a567d` | Sprint-12a-V0.1 §七 D9 状态/P1 计数不一致 | 文档 | 顺延 §二.2 |
| P2-2 | `d2be1d0` | Wave 75 Down 删 OrgScope seed 可能删 pre-existing | low | 不修（OrgId=10086 是示例数据）|
| P2-3 | `ddb8534` | smoke 守护 toolContext 仅 grep 文本未验 ExecuteToolAsync | `0a353b8` 完整匹配 |
| P2-4 | `ddb8534` | SystemConfigAppService Set/Delete OR 逻辑漏检测单边回退 | `0a353b8` regex 计数 ≥ 2 |
| P2-5 | `ddb8534` | Wave 75 fixed-id 严格字符串守护对缩进/CRLF 敏感 | `0a353b8` 结构性 regex |
| P2-6 | `43fbab6` | AlertAggregateDaily 软删基类 + UK 未排除软删 → 重跑撞 PK | `d1a0563` 改 AuditedAggregateRoot + Wave 79 |
| P2-7 | `1f63c25` | SelfServiceReport 未知 filter key 静默忽略 → typo 假阴性 | `a8e7b19` UserFriendlyException |
| P2-8 | `75c63b1` | SelfServiceReport day filter 未应用 → 应引导 StartDate/EndDate | `a8e7b19` throw |
| P2-9 | `75c63b1` | SelfServiceReport org_id filter 无效值（非 long）静默忽略 | `a8e7b19` throw |

**顺延 Sprint 13a §二.2（2 P2-中）**：

| # | Commit | 文件 | 标题 |
|---|---|---|---|
| P2-10 | `43fbab6` | Wave 76 backfill SQL UTC 时区一致性（session timezone 影响 date_trunc）|
| P2-11 | `75c63b1` | ReportExport cross-org Excel 导出缺审计（caller_org + 行数 + 时间窗）|

### 7.4 Zero-finding（Codex 认可干净）

| Commit | 状态 |
|---|---|
| `0421b11` Sprint 12a D1-2 4 P1 修复 | ✨ "did not identify a discrete regression" |
| `881afdd` Sprint 12a D6-4 Token 异常监控 stub | ✨ |
| `8ee346e` Sprint 12a D9 集成 E2E | ✨ |
| `20a57d` §七 附录 10/10 完成（仅 P3 文档串）| ✨（P3 顺延）|

---

## 五、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 3 候选方向 + 6 累计技术债（Sprint 11a 顺延 3 + Sprint 12a 顺延 3）+ 5 决策点 + §七 Codex 12a 13/13 评审附录（4 P1 / 12 P2 / 4 ✨，全部 P1 已修 + 8 P2 已修） |
