# Sprint 20o 任务卡 V0.4（2026-05-17 深夜 Sprint 20o 真正收口 / Codex round 5 = 0 finding 收敛 ✅ / 43 Sprint 0 顺延达成 / 第 3 周期 20k-20o 完整闭环）

**Sprint**：20o（紧续 20n Wave 1 收口 → 第 3 周期 5 Sprint 闭环 + 第 3 批准入评估）
**主题**：5 Sprint 周期（20k-20o）整体复盘 + 第 3 批（采购/合同/审批）启动评估 + production runbook V0.2 升级 + 20p+ roadmap 起草
**节奏**：roadmap V0.3 第 2-3 阶段过渡 / **协调 + 评估 sprint**（依赖 Sprint 20n part 2 试点反馈 + 第 3 批准入条件判断 / wall-clock 估算 3-5 天 main 主轨 / part 2 反馈数据待业务方响应）
**性质**：5 Sprint 周期收尾（类 Sprint 20e / 20j）+ 第 3 批准入评估（新元素 / 不同于 20j 纯收尾）+ 战略转向第 3 周期后段 production 准备 + 第 4 周期 roadmap 启动
**V0.2 拍板要点**（cici 2026-05-17 同意 5 决策全 B 推荐答案）：
- 按 roadmap V0.3 §2.5 已定 5 task（不增不删）：T-A1 复盘 / T-A2 第 3 批评估 / T-A3 runbook V0.2 / T-A4 20p+ roadmap / T-A5 Codex+V0.x
- 总工作量 ~1.6 PD（main 主轨主推 / second 副轨 ✅ B 暂停 / Sprint 20n part 2 反馈数据为关键输入）
- 42 Sprint 0 顺延维持（part 2 试点反馈最终验收后达成 43 Sprint）
- **cici 5 决策全 B 拍板**：Q1 B 复盘 V0.1 起草 + part 2 反馈陆续补 / Q2 B 观察期 + cici 拍板 / Q3 B 核心升级 / Q4 B second 暂停 / Q5 B 明天启动（详 §四）
- **启动时间：2026-05-17 深夜 Day 1**（Q5 改 B → A / cici 决定今天启动 / 不等明天 / 连续 42 Sprint 0 顺延动量延续）
- **完成时间：2026-05-17 深夜 Sprint 20o 真正收口 ✅**（5 task 全 done / Codex round 5 = 0 finding 收敛 / **43 Sprint 0 顺延达成 / 第 3 周期 20k-20o 完整闭环**）

---

## 一、Sprint 20k-20n 收尾（前置事实 / commits 链 / 42 Sprint 0 顺延）

### 1.1 Sprint 20k-20m 数据治理阶段 1 闭环

| Sprint | 主要交付 | commits | 状态 |
|---|---|---|---|
| 20k | 6 类基础数据采集模板 + 数据问题台账模块（Entity+AppService+Controller）+ 试点单位 V0.3 定版（3 单位组合）+ frontend data-issue-log page | ~5 | ✅ done / 38 Sprint 0 顺延 |
| 20l | 6 handler Parse+Validate 全 + 2 ApplyAsync（OrgUser + Material）+ Wave 4 73 测试 + Codex round 4-9 累计 10 finding 全立修 | 14 | ✅ done / 40 Sprint 0 顺延 |
| 20m | 4 handler ApplyAsync 全闭环 + T-A5 数据质量报告 AppService + Wave 5 29 ApplyAsync 单测 + Codex round 8-11 累计 3 finding 立修（Round 10+11 首次 0 finding 收敛） | 6+ | ✅ done / 41 Sprint 0 顺延 |
| **联合（20k-20m）** | **数据治理 6/6 全闭环 / 103/103 测试 / 9500+ 行代码 / 18 子代理累计** | **20+** | **✅ 第 3 周期阶段 1 完整闭环** |

### 1.2 Sprint 20n Wave 1 真正收口

| 维度 | 数字 / 状态 |
|---|---|
| main 主代理 commits | 9（V0.1+V0.2+V0.3+V0.4 任务卡 / T-A1+A2 验证 / cici 2 决策实施 / Round 12 立修 / Round 13 立修 / Retrospective Part 1 / V0.x 升版）|
| second e commits | 4（T-E1 数据质量看板 / T-E2 反馈处理 page / T-E3 e2e + Codex 立修 / T-E4 pilot-demo walk-through）|
| 关键 commit | `f908cd6`（V0.4 任务卡跨仓）/ `d8f4587`（Round 13 立修）/ `aef8be4`（Retrospective Part 1）/ `412cc39`（cici 2 决策 + Round 12 立修）/ `56fa89f`（T-A1+A2 验证报告）|
| Codex 评审 | 14 轮累计 27 finding 全立修 / Round 14 = 0 finding 收敛 ✅ |
| 代码 / 文档 | ~500 行代码 + ~600 行文档（Wave 1 协调 sprint 性质 / 代码量远低于 20l-20m 开发 sprint）|
| **42 Sprint 0 顺延** | **✅ Wave 1 真正收口达成** |
| 剩 part 2 | T-B1-B5 协调试点等 cici + 业务方（wall-clock 3-4 周）/ Sprint 20n Retrospective Part 2 试点反馈后补 |

**前置就绪**：
- ✅ 数据治理 6 handler 全 production-ready（业务方下载模板 → 填 → 上传 → IssueLog → 质量报告全流程）
- ✅ 库存查询 + 4 基础单据 endpoint 全在仓（5 controller 完整状态机 grep 已验证）
- ✅ 试点 demo walk-through page 已 build（业务方实操 6 步引导）
- ✅ 数据质量看板 dashboard 6 卡片真接通
- ⏳ 试点单位（恒大煤矿 + 本部 + 物资公司）实际数据导入 + 反馈待 part 2（cici 协调中）

---

## 二、Sprint 20o Task 清单（A 主轨 5 task / 总 ~1.6 PD）

### A 主轨（main 主代理 / 共 5 task / 1.6 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 5 Sprint（20k-20o）整体复盘文档起草 | 0.4 | P0 | main 主代理 a | 类 `sprint-20a-20e-retrospective.md` + `sprint-20f-20j-retrospective.md` 模板 / 写到 `docs/internal/sprint-20k-20o-retrospective.md` / 涵盖：整体数据汇总 + Codex 评审记录（19q-20o 累计）+ 数据治理 6 handler 闭环里程碑 + 库存试点验证 + 双 session 模式延续 + 5 月反模式根因解除监测 + 业务方协调状态 + 20p+ 主轴预判 + 5 Sprint 战绩总结 + 关键 commit 索引 | Sprint 20n part 2 部分反馈数据（无须等齐 / 可注 "待 part 2 补"）| 文档 ≥ 200 行 / 12 章节齐备 / 含 commits 索引 + 数据汇总表 |
| **T-A2** 第 3 批（采购/合同/审批）启动评估 | 0.3 | P0 | main 主代理 a + cici 协调 | 前置条件检查清单：① 物料 / 供应商 / 仓库 / 人员权限基础数据是否到位（grep 试点单位实际数据填报情况）② 试点单位扩大评估（恒大+本部+物资公司 → 是否加入白音华煤矿 / 5 维度评分立项）③ 第 3 批准入触发条件（库存试点 4 单据流程跑通 ≥ X% / IssueLog SLA 命中率 ≥ Y% / 业务方培训完成 ≥ Z 厂矿）④ 启动 deadline 与负责人 / 输出到 `docs/internal/sprint-20o-batch3-readiness-assessment.md` | T-A1 复盘数据（数据治理完成度）+ Sprint 20n part 2 试点反馈（库存试点跑通情况）| 评估文档 ≥ 100 行 / 含准入清单 + 试点扩大候选 + 风险评估 + cici 拍板项 |
| **T-A3** production runbook V0.2 升级 | 0.3 | P0 | main 主代理 a | 在 Sprint 20j V0.1 基础（`docs/部署/runbook-V0.1.md`）升级到 V0.2：① 20k-20o 反馈补强（数据治理流程 + 数据问题台账 + 数据质量报告 + 试点单位导入演练 SOP）② 上线 checklist 实战修正（试点单位实测反馈 / 部署步骤验证 / 回退方案 / 备份恢复实测）③ 数据治理 production-ready checklist（6 类模板下发流程 / IssueLog 闭环 SLA / 质量报告周月报） | T-A1 复盘 + Sprint 20n part 2 试点反馈（实战修正项）| runbook V0.2 ≥ V0.1 + 30% 内容 / 含数据治理章节 + checklist 实战修正项 |
| **T-A4** 20p+ roadmap 起草（第 4 周期 / 采购+合同+审批）| 0.2 | P1 | main 主代理 a | 类 `sprint-20k-20o-roadmap.md` V0.3 模板 / 写到 `docs/internal/sprint-20p-20t-roadmap.md` / 涵盖：① 战略定位（按 roadmap V0.3 §四 第 3-4 阶段 / 5-7 周 wall-clock）② 5 Sprint 任务规划（20p-20q 采购+合同 / 20r-20s 审批 / 20t 第 4 周期收尾 + Q3 末 production deployment）③ 4 条工作线分工延续（A 数据治理 / B 系统上线 / C 业务流程 / D NC/财务 → 第 4 周期升级到 NC 真联调）④ 立即动作清单 + 风险评估 + 关键里程碑 | T-A1 复盘 + T-A2 评估结果（第 3 批准入条件）| roadmap V0.1 ≥ 200 行 / 含 5 Sprint 详细规划 + 阶段时间口径分层 |
| **T-A5** Codex 20o 评审 + 立修 + V0.x 升版 + memory | 0.4 | P0 | main 主代理 a | ✅ **done** / Codex 5 轮 12 finding 全立修（R1v2 5 / R2 4 / R3 2 / R4 1 / **R5 0 收敛 ✅**）/ V0.3 → V0.4 升版（教训 13 模板第 11 次）/ memory 升级（43 Sprint 0 顺延 + 第 3 周期完整闭环 + Sprint 20o spawn 子代理 ~2x 加速 3 次实测） | Sprint 20o T-A1-A4 全 commit 完成 | **43 Sprint 0 顺延达成 ✅** / V0.4 锁版 / memory commit |

**main 总：~1.6 PD**（vs Sprint 20j 1.7 PD / 略低 / 20o 性质类似但带评估增量）

### D 顺延说明

- ~~D 线 NC/财务接口真联调~~：**继续顺延 20r+（第 4 周期主推）/ 业务方 G-12 后续推进 + NC 侧提供联调环境双触发**
- ~~T-B1-B5 Sprint 20n part 2 协调试点~~：**与 Sprint 20o 并行 / 不阻塞 / Sprint 20n Retrospective Part 2 试点反馈后补**
- second 副轨：**条件性 / 默认暂停**（5 Sprint 周期收尾 second 工作自然收敛 / cici 拍板项 Q4 / 详 §四 决策点 4）

---

## 三、关键节奏

### 3.1 Sprint 20o 性质（vs 20j 收尾 sprint 对比）

| 维度 | Sprint 20j（第 2 周期收尾）| **Sprint 20o（第 3 周期收尾 + 第 3 批评估）** |
|---|---|---|
| 主轨任务数 | 6（A1-A6）| 5（A1-A5）|
| 主轨总 PD | ~1.5-2.0 | ~1.6 |
| 收尾内容 | 5 Sprint 复盘 + 性能 + runbook V0.1 + 20k+ roadmap | 5 Sprint 复盘 + 第 3 批评估 + runbook V0.2 + 20p+ roadmap |
| 评估元素 | ❌ 无（纯收尾）| ✅ T-A2 第 3 批准入评估（新元素）|
| 业务方协调依赖 | 低（demo 已完成 / cici 协调）| **高**（依赖 Sprint 20n part 2 试点反馈数据）|
| 主轴战略 | 第 2 周期完整闭环 / production 准备 | 第 3 周期完整闭环 + 第 4 周期启动评估 / 数据治理→采购扩大 |
| second 副轨 | 全 T-E1+T-E2+T-E3（第 11 次连续）| **暂停 / 条件性**（详 §四 Q4）|

### 3.2 wall-clock 估算

- **main 主轨**：3-5 天（取决于 part 2 试点反馈数据齐全度）
  * Day 1-2：T-A1 复盘文档（0.4 PD）+ T-A3 runbook V0.2 起草框架（0.15 PD）
  * Day 2-3：T-A2 第 3 批评估文档（0.3 PD）+ T-A3 runbook V0.2 完善（0.15 PD）
  * Day 3-4：T-A4 20p+ roadmap（0.2 PD）
  * Day 4-5：T-A5 Codex 评审 + 立修 + V0.x 升版（0.4 PD）

- **part 2 协调**：3-4 周持续（cici + 业务方 / 不阻塞 Sprint 20o 主轨 / 反馈数据陆续回填 T-A1 + T-A2 + T-A3）

### 3.3 5 Sprint 周期闭环里程碑

- **第 1 周期 20a-20e**：race [P0] → [P1] 降级 / dashboard 8/8 部分完成 / Reports 5→11 / 32 Sprint 0 顺延
- **第 2 周期 20f-20j**：dashboard 8/8 完整 + Reports 20 + production runbook V0.1 / 37 Sprint 0 顺延
- **第 3 周期 20k-20o（本）**：数据治理 6 handler 闭环 + 数据问题台账 + 数据质量报告 + 试点单位库存试运行 + production runbook V0.2 + 第 3 批评估 / **目标 43 Sprint 0 顺延**

---

## 四、关键决策点（cici V0.1→V0.2 已拍板 ✅）

| # | 决策 | 选项 | 推荐 | **cici 拍板** |
|---|---|---|---|---|
| **Q1** | T-A1 复盘文档完成度（part 2 反馈数据齐不齐）| A. 完整版（等 part 2 反馈数据齐 / 推迟到 part 2 收口）/ B. **V0.1 起草 + part 2 反馈陆续补**（推荐 / 不阻塞 Sprint 20o 主轨）/ C. 仅占位框架（最简）| **B** | ✅ **B 拍板** |
| **Q2** | T-A2 第 3 批准入触发条件量化标准 | A. 严格量化（库存 4 单据 ≥ 80% / SLA ≥ 90% / 培训 3 厂矿）/ B. **观察期 + cici 拍板**（推荐 / 业务方反馈定 / 灵活）/ C. 不量化（仅文字描述）| **B** | ✅ **B 拍板** |
| **Q3** | T-A3 runbook V0.2 升级深度 | A. 大幅升级（含数据治理完整章节 + 试点 SOP / 0.5 PD）/ B. **核心升级**（数据治理 + checklist 实战修正 / 0.3 PD / 推荐）/ C. 微调（仅修 V0.1 笔误 / 0.1 PD）| **B** | ✅ **B 拍板** |
| **Q4** | second 副轨范围 | A. 启动 T-E1 dashboard 样式 polish + T-E2 收尾（~0.5 PD / 第 12 次连续 / 但模块 8/8 已完整难再扩）/ B. **暂停 second**（推荐 / 周期收尾自然收敛 / 类 20j 模式但工作量更低）/ C. cici 评估时再决定（D2 答）| **B** | ✅ **B 拍板**（second e 第 11 次连续后暂停 / 模块 8/8 完整 / 类 20j 收尾模式）|
| **Q5** | Sprint 20o 启动时间 | A. 今天升 V0.2 启动 D1（连续 / 42 Sprint 动量延续 / 但 main 已 Sprint 20n Wave 1 ~1.2 PD + 大量 Sprint 20m 后段工作）/ B. ~~明天启动~~（推荐撤销 → cici 改）/ C. 等 part 2 完整反馈触发（保守 / 推迟 3-4 周）| ~~B~~ | ✅ **A 拍板**（V0.3 cici 改 / 2026-05-17 深夜启动 Day 1 / 连续 42 Sprint 动量延续）|

### V0.2 拍板条件 ✅ 全 done

- ✅ 5 开放问题 cici 答（全 B 推荐 / 2026-05-17 深夜同意）
- ✅ 1c 模块隔离表确认（Sprint 20o 主轨涉及 docs/internal/ + docs/部署/ / second e 暂停 / 无 race 风险）
- ✅ Sprint 20n Wave 1 真正收口已达成（commit `f908cd6` push 确认 / Round 14 0 finding 收敛）
- ⏳ 至少 part 2 第一周试点反馈数据初步入手（Q1 B 选项前提 / 2026-05-18 启动 D1 时陆续到位）

---

## 五、风险与依赖

### 5.1 高风险

- **Sprint 20n part 2 试点反馈数据延迟**：cici + 业务方 3-4 周 wall-clock / 数据导入演练实际响应取决于业务方排程 / 可能 Sprint 20o 主轨完成时 part 2 数据未齐 → T-A1 复盘 + T-A2 评估 + T-A3 runbook 升级数据基础不足 → **缓解**：B 选项 V0.1 起草 + 反馈陆续补 / 不阻塞 / 数据齐后回填升 V0.5
- **第 3 批准入条件难量化**：数据治理刚启动 / 试点单位反馈不充分 → SLA / 完成度阈值难定 → **缓解**：Q2 B 选项观察期 + cici 拍板 / 不强行量化

### 5.2 中风险

- **5 月反模式根因 #1 cici 单点协调**：仍未解除 / part 2 协调全依赖 cici / 试点单位响应不一致 / Sprint 20n part 2 reception 风险延续 → **缓解**：roadmap V0.3 已注 / 顺延 20p+ 加 PM 角色评估
- **production runbook V0.2 实战修正项不足**：试点单位部署演练未实操 / 仅文档层修正 → **缓解**：V0.2 留 V0.3 实战部署后再升

### 5.3 低风险

- T-A4 20p+ roadmap 起草（V0.3 模板成熟 / Q3 中期方向已基本明确）
- T-A5 Codex + V0.x 升版（教训 13 模板 graduate / 14+ 轮 Codex 模式成熟）

### 5.4 主要依赖

- **Sprint 20n part 2 反馈**：T-A1 复盘 + T-A2 评估 + T-A3 runbook 升级共同前提
- **业务方协调**：cici 单点 / 部分依赖 PO + 试点单位响应
- **Codex 评审**：手动模式延续 / cici D5 触发 `codex review --base <Sprint 20n 末 commit>`

---

## 六、对外汇报口径

> Sprint 20o 第 3 周期（20k-20o）5 Sprint 完整闭环：数据治理 6 handler 全 production-ready + 库存试点（恒大煤矿+本部+物资公司 3 单位组合）+ production runbook V0.2 升级 + 第 3 批（采购/合同/审批）启动评估完成。数据治理阶段 1（20k-20m）一晚上节奏与库存试点阶段 2（20n-20o 3-4 周）联合达成 roadmap V0.3 §一 第 1+2 阶段全部目标 / 43 Sprint 0 顺延维持。下一周期 20p-20t 启动第 3 批采购+合同+审批扩大试点 + 第 4 周期 NC 真联调准备 / Q3 末 production deployment 正式上线目标。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 深夜（紧续 Sprint 20n Wave 1 真正收口 / Round 14 0 finding 收敛 / 42 Sprint 0 顺延达成）| main a 起草 / Sprint 20o 任务卡 / 5 task 按 roadmap V0.3 §2.5 落地（T-A1 复盘 + T-A2 第 3 批评估 + T-A3 runbook V0.2 + T-A4 20p+ roadmap + T-A5 Codex+V0.x / 总 ~1.6 PD）/ 性质为 5 Sprint 周期收尾 + 第 3 批评估 sprint（vs Sprint 20j 纯收尾）/ 5 开放问题待 cici 答（Q1 复盘完成度 / Q2 第 3 批准入阈值 / Q3 runbook V0.2 深度 / Q4 second 副轨范围 / Q5 启动时间）/ [[main-orchestrator-default-spawn]] 新规则首次实测：spawn general-purpose 子代理起草 / wall-clock ~3 min / 加速 ~2x |
| V0.2 | 2026-05-17 深夜（同 V0.1 当晚 / cici 拍板）| **cici 同意 5 决策全 B 推荐答案** ✅（Q1 复盘 V0.1 起草 + part 2 反馈陆续补 / Q2 观察期 + cici 拍板 / Q3 runbook V0.2 核心升级 / Q4 second 暂停 / Q5 2026-05-18 启动 Day 1）/ 决策表加 cici 拍板列 / V0.2 拍板条件全 done（除 part 2 第一周反馈陆续到位）/ V0.2 锁版 Day 1 启动 |
| V0.3 | 2026-05-17 深夜（V0.2 后 ~10 min / cici 改 Q5 拍板）| **cici 改 Q5 B → A**（"今天启动"/ 连续 42 Sprint 动量延续 / 不等明天）/ Day 1 立即启动（main spawn 2 子代理：T-A1 5 Sprint 复盘起草 + T-A3 runbook V0.2 升级 / 按 [[main-orchestrator-default-spawn]] 并行 ~5 min wall-clock）/ T-A2 + T-A4 顺延 Day 2-3 / V0.3 锁版 Day 1 启动状态 |
| V0.4 | 2026-05-17 深夜（Sprint 20o 真正收口）| **Sprint 20o 全 5 task done ✅** / Codex 5 轮 12 finding 全立修（R1v2 5 / R2 4 / R3 2 / R4 1 / **R5 = 0 finding 收敛 ✅** codex 原话 "No actionable regressions were found"）/ **43 Sprint 0 顺延达成 ✅ / 第 3 周期 20k-20o 完整闭环 ✅** / [[main-orchestrator-default-spawn]] 新规则 ~2x 加速 3 次连续实测 / 累计 19 轮 codex / 39 finding 全立修 / 6 次 0 finding 收敛（R5/R7/R10/R11/R14 + Sprint 20o R5）|

---

**Created**: 2026-05-17 深夜 / Sprint 20n Wave 1 收口（`f908cd6` push 后）→ 20o V0.1 起草 → V0.2 cici 拍板 → V0.3 cici 改 Q5 → **V0.4 Sprint 20o 真正收口 ✅ Codex round 5 = 0 finding 收敛 / 43 Sprint 0 顺延达成 / 第 3 周期 20k-20o 完整闭环** / main 主代理 a

**Related**:
- [`Sprint-20n-任务卡-V0.4.md`](Sprint-20n-任务卡-V0.4.md)（同 cycle 前序 / V0.4 Wave 1 真正收口 / Round 14 0 finding 收敛）
- [`Sprint-20m-任务卡-V0.2.md`](Sprint-20m-任务卡-V0.2.md)（数据治理阶段 1 收尾）
- [`Sprint-20l-任务卡-V0.2.md`](Sprint-20l-任务卡-V0.2.md)（数据治理阶段 1 前段）
- [`Sprint-20k-任务卡-V0.2.md`](Sprint-20k-任务卡-V0.2.md)（数据治理阶段 1 开局）
- [`../../SupplyCores/docs/internal/sprint-20k-20o-roadmap.md`](../../SupplyCores/docs/internal/sprint-20k-20o-roadmap.md)（V0.3 第 3 周期 roadmap 总览）
- [`../../SupplyCores/docs/internal/sprint-20f-20j-retrospective.md`](../../SupplyCores/docs/internal/sprint-20f-20j-retrospective.md)（第 2 周期复盘模板参考）
- [`../../SupplyCores/docs/internal/sprint-20a-20e-retrospective.md`](../../SupplyCores/docs/internal/sprint-20a-20e-retrospective.md)（第 1 周期复盘模板参考）
- [`../../SupplyCores/docs/internal/Sprint-20n-Retrospective-V0.1-part1.md`](../../SupplyCores/docs/internal/Sprint-20n-Retrospective-V0.1-part1.md)（Sprint 20n Wave 1 Retrospective Part 1 / Part 2 待 part 2 反馈后补）
- [[feedback_codex_0_carryover_8_sprint_record]]（42 Sprint 0 顺延记录 / 累计 Codex 评审）
- [[feedback_sprint20m_full_loop_complete]]（数据治理阶段 1 收尾）
- [[feedback_sprint20n_wave1_complete]]（库存试点开局 Wave 1 完整闭环）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向）
- [[project_po_meeting_2026_05_16_nc_voucher_export]]（PO 决策 NC 顺延）
