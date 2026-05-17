# Sprint 20m 任务卡 V0.1（2026-05-17 起草 / 第 3 周期数据治理阶段 1 续）

**Sprint**：20m（继 20l 收尾）
**主题**：数据治理阶段 1 续 — 4 handler ApplyAsync 业务实施 + 数据质量报告 + 试点单位实操准备
**节奏**：roadmap V0.3 第 1 阶段（20k-20m 1-2 周完成数据治理）/ 阶段 1 终点

---

## 一、Sprint 20l 收尾（前置事实 / commits 链）

| 时点 | commit | 内容 |
|---|---|---|
| Wave 1 框架+占位 | `4d8847c` | 6 handler 占位 + 框架 + second prompt |
| Wave 2 端到端测试 | `fd4c22c` | T-A2 14/14 + Generator 立修 |
| Codex round 4 立修 | `502ae35` | Razor pages + apiFetch FormData + Material required |
| Wave 3 4 子代理并行 | `e4633df` | Supplier+Warehouse+NcMapping+InitialStock Parse+Validate + ApplyAsync 方案 |
| Codex round 5 立修 | `8633d0e` | NcMapping 列名 + Supplier orphan child |
| **T-A4 ApplyAsync 实施** | `fb5a018` | OrgUser + Material ApplyAsync（cici a/a 拍板 / ReportAlert R-10 + 3 表 upsert）|
| second e 协作 | `5d6bd70` | P2#3+#4 data-import-batch frontend 字段对齐 |

**Sprint 20l 累计**：~10 commits / 代码 ~5000 行 + 文档 ~500 行 / 14/14 测试 / 39 Sprint 0 顺延维持。

---

## 二、Sprint 20m Task 清单

### A 主轨（main 主代理）

| Task | PD | 说明 | 决策依据 |
|---|---|---|---|
| **T-A1** Supplier ApplyAsync 实施 | 0.7 | 5 子表级联 upsert（Supplier→Contact/Bank/Qualification/NcMapping）+ 资质 cron 联动（SupplierQualificationExpiryWorker）+ 黑名单 access_status=暂停 联动 | cici T-A4 决策 #3 选 a |
| **T-A2** Warehouse ApplyAsync 实施 | 0.5 | 三级级联 upsert（Warehouse→Zone→Location）+ manager_employee_no 跨 sheet 校验留 IssueLog 不阻断 + 火工品仓 enable_batch/expiry 强约束 | cici T-A4 决策 #4 选 a |
| **T-A3** NcMapping ApplyAsync 实施 | 0.5 | 5 表入库 / **NC 真接通 checklist 解耦**（仅入库 / checklist 在 NC 真接通 Sprint 20r 单独做）| cici T-A4 决策 #5 选 b |
| **T-A4** InitialStock ApplyAsync 实施 | 0.8 | 跨域关联校验（material/warehouse/supplier sheet → ApplyAsync 阶段做）+ s.initial_stock 入库 + m.stock_batch_balance 期初快照 + 财务对账 cost_center 联动 + 高敏感 4 步走最终强校验 | cici T-A4 决策 #6 选 a |
| **T-A5** 第一版数据质量报告骨架 | 0.4 | 6 类 batch 成功率 / 失败趋势 / 按责任部门 SLA 命中 / 试点单位（恒大+本部+物资公司）数据导入完整度 | 同事 273 行建议第 1 批主要产出 |
| **T-A6** Sprint 20m Codex 评审 round 7+ + 立修 | 0.2 | 标准 / 4 handler ApplyAsync 实施复测 |
| **T-A7** V0.x 升版 + memory（41 Sprint 0 顺延）| 0.2 |  |

**main 累计**：~3.3 PD（可分 Wave 3 spawn 4 子代理并行类似 20l / 单 sprint 1-2 day wall-clock）

### B 子代理并行（可 spawn 类似 Sprint 20l Wave 3 模式）

| 子代理 | Task | 估算 PD |
|---|---|---|
| 子代理 D | Supplier ApplyAsync 实施 | 0.7 |
| 子代理 E | Warehouse ApplyAsync 实施 | 0.5 |
| 子代理 F | NcMapping ApplyAsync 实施 | 0.5 |
| 子代理 G | InitialStock ApplyAsync 实施 | 0.8 |
| 主代理 | T-A5 + T-A6 + T-A7 | 0.8 |

**并行节奏**：wall-clock ~40-50 min（4 handler 各自独立 entity / 无 race / [[sprint20l-4-5x-subagent-parallel-pattern]] 已实测）

### E 副轨（second 主代理 e / 跨 session）

详 `../../SupplyCores/docs/internal/second-e-prompt-20m-raw.txt`（V0.1 备料 / 本 commit 同时起草）：

| Task | PD | 说明 |
|---|---|---|
| **T-E1** 数据质量看板 dashboard | 0.5 | 6 类导入成功率 / 失败趋势 / 试点单位（恒大+本部+物资公司）数据完整度热力图 / DevExtreme 大屏样式 |
| **T-E2** 试点单位反馈处理 page | 0.4 | 业务方提交反馈 page / IssueLog drill-down + comment 时序 / 评分（1-5 星）/ 状态机 |
| T-E3 数据问题台账 e2e 测试补 | 0.3 | tests/e2e/data-issue-log.spec.ts 5 smoke 用例（list / filter / resolve / ignore / drill-down）|

---

## 三、本 Sprint 关键节奏

### Day 1（衔接 20l）

- [ ] Wave 1 并行：spawn 4 子代理 D/E/F/G 实施 4 handler ApplyAsync / 主代理同时 T-A5 数据质量报告骨架
- [ ] cici 切 second session 启动 T-E1/T-E2

### Day 2

- [ ] T-A5 数据质量报告 + T-A6 Codex round 7 评审 + 立修
- [ ] T-A7 V0.x 升版 + 41 Sprint 0 顺延 memory
- [ ] second e 继续 T-E1/T-E2

### Sprint 20m 收尾

- [ ] 6 handler 全 ApplyAsync 业务闭环 done（Sprint 20l done 2/6 + Sprint 20m done 4/6 = 6/6）
- [ ] 第 1 阶段数据治理完整闭环（20k-20m 1-2 周节奏达成）
- [ ] 业务方可以下载模板 + 试填 + 试导入 + 看 batch 状态 + 看数据问题台账 + 看质量报告 = 全流程 demo 就绪
- [ ] 准备 Sprint 20n 第 2 阶段（库存试点 / 恒大煤矿 + 本部 / 3-4 周）

---

## 四、风险与依赖

### 高风险

- **跨 sheet 关联校验**（InitialStock 06 / Supplier 03）：ApplyAsync 阶段需要注入 IRepository<Material/Warehouse/Supplier> 等多 repo / handler 依赖图复杂
- **5 表事务保护**（Supplier 03）：5 子表级联失败时 EF Core UoW 自动 rollback / orchestrator 已包 transactional UoW（fb5a018 验证）

### 中风险

- **试点单位响应速度**：恒大+本部+物资公司 3 单位是否能在本 Sprint 完成第一轮模板填报 — 业务方协调依赖
- **second e dashboard 工作量**：6 类成功率 + 失败趋势可能比预想大 / 0.5 PD 估算偏低

### 低风险

- handler ApplyAsync 实施有 Sprint 20l OrgUser+Material 完整模板（双构造模式 + cache + IssueLog 联动 / [[sprint20l-full-loop-complete]]）
- Codex 立修节奏成熟（5 轮立修无 P2 顺延 / [[codex-0-carryover-8-sprint-record]]）

---

## 五、对外汇报口径

> Sprint 20m 数据治理阶段 1 收尾：6 类导入 handler 全 ApplyAsync 业务闭环完成（Sprint 20l done 2 + Sprint 20m done 4）。试点单位（恒大+本部+物资公司）可全流程 demo —— 下载模板 → 试填 → 试导入 → 看 batch 状态 → 看数据问题台账 → 看第一版数据质量报告。Sprint 20n 衔接第 2 阶段（库存查询 + 基础单据试点 / 3-4 周）。

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 深夜 | main a 起草 / Sprint 20m 任务卡 / Sprint 20l 收尾时前置规划 |

---

**Created**: 2026-05-17 / Sprint 20l 收尾时 → 20m 前置规划 / main 主代理 a
**Related**:
- [`Sprint-20l-任务卡-V0.1.md`](Sprint-20l-任务卡-V0.1.md)
- [[sprint20l-full-loop-complete]] Sprint 20l 完整闭环
- [[sprint20l-4-5x-subagent-parallel-pattern]] 4-5x 子代理并行模式
- [`../../SupplyCores/docs/internal/sprint-20k-20o-roadmap.md`](../../SupplyCores/docs/internal/sprint-20k-20o-roadmap.md) V0.3
- [`../../SupplyCores/docs/internal/Sprint-20l-T-A4-ApplyAsync-业务扩展点方案-V0.1.md`](../../SupplyCores/docs/internal/Sprint-20l-T-A4-ApplyAsync-业务扩展点方案-V0.1.md)
