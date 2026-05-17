# Sprint 20n 任务卡 V0.2（2026-05-17 拍板版 / 第 3 周期第 2 阶段 / 库存查询 + 基础单据试点）

**Sprint**：20n（紧续 20m 收尾 → 第 3 周期第 2 阶段开局）
**主题**：低风险高价值 库存查询 + 基础流转 / 试点 1-2 厂矿（恒大煤矿 + 本部）
**节奏**：roadmap V0.3 第 2 阶段（**3-4 周 wall-clock** / 与 Sprint 20l-20m 一晚上节奏不同）
**V0.2 拍板要点**（基于 V0.1 + cici 4 决策）：
- **重大发现**：grep 确认**全 6 个 stock 业务 entity 已存在**（StockInbound + MaterialIssuance 领料=业务出库 + StockTransfer + StockReturn + StockBalance + StocktakeSheet 全有 AppService + Controller）
- **T-A3 StockOutbound 删除**（MaterialIssuance 替代 / Sprint 20n 主代码量降到 ~0.9 PD）
- T-B1 试点单位协调：Day 1 立即启动（main T-A1-A4 + cici 协调 + second e T-E1+T-E4 同时推 / 不等）
- 启动 Wave 1：cici 拍板 V0.2 后
**性质**：**协调 + 试点验证 sprint**（代码量小 ~1 PD / 协调工作量大 / 依赖试点单位响应）

---

## 一、Sprint 20l + 20m 收尾（前置事实 / commits 链）

| Sprint | 主要交付 | commits |
|---|---|---|
| 20l | 6 handler Parse+Validate + 2 ApplyAsync + Wave 4 73 测试 | 14 |
| 20m | 4 handler ApplyAsync + T-A5 质量报告 + Wave 5 29 ApplyAsync 单测 | 6+ |
| **联合** | **数据治理 6/6 全闭环 / 41 Sprint 0 顺延 / 103/103 测试** | **20+** |

**前置就绪**：
- ✅ 业务方下载 6 类模板 + 试填 + 试导入 → 数据问题台账 → 质量报告全流程 demo 就绪
- ✅ second e prompt V0.2 已含 T-E4 试点 demo walk-through page（业务方实操引导）
- ✅ 库存核心 entity 全在仓（StockInbound + StockTransfer + StockReturn + StockBalance + StockBatchBalance + StocktakeSheet 含 AppService + Controller）

---

## 二、Sprint 20n Task 清单（性质：协调试点 + 验证）

### A 主轨（main 主代理 / V0.2 调整后 ~0.9 PD）

| Task | PD | 优先级 | 状态 | 说明 |
|---|---|---|---|---|
| **T-A1** 库存查询 endpoint 试点验证 | 0.2 | P0 | pending | GET /api/supply-cores/stock-balances + stock-batch-balances 现有 endpoint / 试点单位（恒大 001.007.002 + 本部 001.007.001）数据可见性 / A-06 隔离查询端测试 |
| **T-A2** 4 基础单据 endpoint 试点验证 | 0.3 | P0 | pending | 4 业务单据：StockInbound（入库）+ MaterialIssuance（领料=业务出库）+ StockTransfer（调拨）+ StockReturn（退料）— **全在仓 / Route 验证**。试点单位创建 → 审核 → 完成流程跑通 |
| ~~T-A3~~ ~~StockOutbound 实施~~ | ~~0.3-0.5~~ | - | **删除** | **V0.2 拍板**：grep 确认 MaterialIssuance（领料）= 业务上的出库 / 完整 entity + Controller 已存在 / Route `/api/supply-cores/material-issuances` / 不需要再实施 StockOutbound |
| **T-A4** Sprint 20n Codex round 12+ + 立修 | 0.2 | P0 | pending | 标准 / 任务卡 + V0.2 + Wave 1 实施 commits 覆盖 |
| **T-A5** V0.x 升版 + memory（42 Sprint 0 顺延）| 0.2 | P0 | pending | Sprint 20n V0.3 + Retrospective + 第 2 阶段开局 memory |

**main 总：~0.9 PD**（vs V0.1 估算 1.0-1.4 PD / 删 T-A3 后更轻 / 体现"全 6 stock entity 在仓"前置就绪）

### B 协调轨（cici 协调 / 周期长）

| Task | 周期 | 责任方 | 说明 |
|---|---|---|---|
| **T-B1** 试点单位（恒大+本部）数据导入演练 | 1 周 | cici + 物资公司 IT | 试点单位下载 V0.2 模板 → 填 → 上传 → 看 batch 状态 → 处理 IssueLog |
| **T-B2** 业务方实操培训（视频教程 / 文档）| 1 周 | cici + second e T-E4 walk-through page | 试点单位业务方培训 / 用 T-E4 demo page 引导 6 步流程 |
| **T-B3** 业务方反馈收集 + 处理 | 持续 | cici + 物资公司 PO + 各厂矿对接人 | 数据问题台账 + second e T-E2 反馈处理 page / 业务方填模板时反馈字段不清 / 错误提示不准 等 |
| **T-B4** 库存查询试运行（试点 1-2 仓库）| 2 周 | cici + 恒大煤矿仓储主任 + 本部仓库管理员 | 系统记录 + 线下复核并行 / 暂不强行替代原有流程 / 每周汇总问题清单 |
| **T-B5** 基础单据试运行（4 单据 / 试点）| 2-3 周 | cici + 试点单位仓储 | 入库 / 出库 / 调拨 / 退料 4 类 / 试点单位实际使用验证 |

### E 副轨（second 主代理 e / 已 V0.2 prompt 备料）

详 `docs/internal/second-e-prompt-20m-V0.2-raw.txt`：

| Task | PD | 优先级 |
|---|---|---|
| **T-E1** 数据质量看板 dashboard | 0.5 | P0 |
| **T-E4** 试点单位 demo walk-through page（业务方实操关键）| 0.8 | **P0 重点** |
| T-E5 数据质量报告 Excel 导出 + 大屏样式 | 0.3 | P1 |
| T-E6 dashboard 样式 polish | 0.3 | P2 |
| T-E2 试点单位反馈处理 page | 0.4 | P1 |
| T-E3 e2e 测试补 | 0.3 | P2 |

---

## 三、关键节奏

### Week 1（衔接 Sprint 20m / V0.2 调整后）

- **Day 1**：
  * main: T-A1 + T-A2 endpoint 试点验证（4 基础单据流程跑通）
  * cici: T-B1 试点单位（恒大+本部）协调启动 / 不等 main 完成
  * second e: T-E1 数据质量看板 + T-E4 试点 demo walk-through page 同时推（**用 V0.2 prompt 已备料**）
- Day 2：T-A4 Sprint 20n Codex round 12 评审 + 立修
- Day 3-5：T-B2 业务方培训 + T-B1 试点单位数据导入演练 + T-B3 反馈收集（与试点单位异步）

### Week 2

- 试点单位实操（试导入 / 反馈）/ second e T-E2 反馈处理 page 接通
- 数据质量报告第一版输出（第 1 阶段数据治理闭环 + 第 2 阶段开局验证）

### Week 3-4

- 库存查询 + 基础单据试运行（T-B4+B5）
- 业务方反馈持续收集 + 处理
- 第 2 阶段验收准备（试点单位完整度 95%+ / 数据质量报告 / SLA 命中）

---

## 四、关键决策点（cici V0.1→V0.2 已拍板）

| # | 决策 | cici 拍板 |
|---|---|---|
| 1 | T-A3 StockOutbound 实施范围 | ✅ **删除**（grep 确认 MaterialIssuance 已存在 / 业务上替代）|
| 2 | T-B1 试点单位数据导入演练协调时间 | ✅ **Day 1 立即启动**（不等 main T-A1-A4 完成 / cici + main + second e 并行推）|
| 3 | T-B2 业务方培训形式 | （待 V0.3 / 默认 second e T-E4 walk-through page 自助引导）|
| 4 | Sprint 20n 收口标准 | （待 V0.3 / 默认试点完整度 95%+ + 4 单据流程跑通 + 数据质量报告）|

---

## 五、风险与依赖

### 高风险

- **试点单位响应速度**：恒大+本部 协调能否在 1 周内启动数据导入演练 — cici 单点协调风险
- **业务方培训效果**：50+ 业务方用 demo walk-through page 自助引导是否够 / 必要时升级到现场培训
- **基础单据 entity 现有完整度**：grep 看是否缺关键字段 / 业务流是否真跑通

### 中风险

- **数据质量报告 SLA 命中率**：试点单位数据填错 → IssueLog 超期未处理 → SLA 命中率低
- **second e T-E4 demo walk-through 工作量**：0.8 PD 估算 / 实际可能涉及多次 cici 反馈迭代

### 低风险

- 库存核心 entity 全在 / 代码改动量小
- Sprint 20l-20m 6 handler 全闭环 / 试点单位数据导入流程成熟

---

## 六、对外汇报口径

> Sprint 20n 第 3 周期第 2 阶段开局（3-4 周）：试点单位（恒大煤矿+本部）库存查询 + 基础单据（入库/出库/调拨/退料）试运行 / 业务方实操培训 + 数据质量报告输出 / 数据治理闭环（Sprint 20k-20m 一晚上完成）+ 库存试点（Sprint 20n-20o 3-4 周）联合达成 roadmap V0.3 第 1+2 阶段。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 深夜（紧续 Sprint 20m）| main a 起草 / Sprint 20n 任务卡 / 第 3 周期第 2 阶段开局规划 / 性质为协调试点 sprint（vs 20l-20m 一晚上开发节奏不同）|
| V0.2 | 2026-05-17 深夜（紧续 V0.1）| **cici 拍板**：T-A3 StockOutbound 删除（grep 确认 MaterialIssuance 已存在 / 业务出库）/ T-B1 试点协调 Day 1 立即启动（不等）/ main 工作量降到 ~0.9 PD / 启动 Wave 1（main T-A1+A2 + cici T-B1 + second e T-E1+T-E4 并行）|

---

**Created**: 2026-05-17 深夜 / Sprint 20m 收口 → 20n 启动前置 / main 主代理 a
**Related**:
- [`Sprint-20m-任务卡-V0.2.md`](Sprint-20m-任务卡-V0.2.md)
- [[sprint20m-full-loop-complete]] Sprint 20m 完整闭环
- [[sprint20l-full-loop-complete]] Sprint 20l 完整闭环
- [`../../SupplyCores/docs/internal/sprint-20k-20o-roadmap.md`](../../SupplyCores/docs/internal/sprint-20k-20o-roadmap.md) V0.3 第 2 阶段
- [`../../SupplyCores/docs/internal/second-e-prompt-20m-V0.2-raw.txt`](../../SupplyCores/docs/internal/second-e-prompt-20m-V0.2-raw.txt)（T-E4 试点 demo walk-through 关键）
