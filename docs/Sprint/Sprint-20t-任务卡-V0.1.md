# Sprint 20t 任务卡 V0.1（2026-05-25+ 待 Sprint 20s 收口后启动 / 第 4 周期 20p-20t 5 Sprint 收尾 + Q3 末 production deployment 正式上线 + 第 5 周期 roadmap 启动）

**Sprint**：20t（紧续 20s 收口 → **第 4 周期 5 Sprint 闭环 + production deployment 实战 cutover**）
**主题**：第 4 周期（20p-20t）5 Sprint 整体复盘 + **Q3 末 production deployment 正式上线**（实战 cutover）+ 第 3 批 5 模块 production-ready 正式准入 + 第 5 周期（20u-20y）roadmap 起草
**节奏**：roadmap V0.1 §2.5 第 3 阶段（第 6-7 周）/ **收尾 sprint + cutover sprint 双重性质**（vs Sprint 20o 纯收尾 / 工作量高约 0.9 PD / wall-clock 5 天 cutover 实战 + 文档收尾）
**性质**：**5 Sprint 周期收尾**（类 Sprint 20e / 20j / 20o 收尾模板）+ **production deployment 实战 cutover**（新元素 / 第 1 次真实生产上线 / Q3 末硬截止 deadline）
**V0.1 起草要点**：
- 6 task ~2.5 PD（vs Sprint 20o 5 task 1.6 PD / +cutover 0.9 PD）
- T-A2 production deployment cutover 主推（0.8 PD / 含 Day 1-5 详细节奏 / cici + IT + 业务方协同）
- T-A1 5 Sprint 复盘文档（类 `sprint-20k-20o-retrospective.md` 12 章节模板）
- T-A4 第 5 周期（20u-20y）roadmap 起草（Q4 + Q1 next year 战略方向）
- T-A5 production runbook V0.3 → V0.4 实战版升级（cutover 实战项陆续到位）
- 5 决策待 cici V0.2 答（含 **Q1 Q3 末 deployment 日期** / Q2 cutover 灰度策略 / Q3 业务方培训形式 / Q4 第 5 周期 roadmap 范围 / Q5 cutover 失败回退方案）

---

## 一、Sprint 20p-20s 收尾（前置事实 / 待回填 / 47 Sprint 0 顺延前置链）

### 1.1 Sprint 20p-20s 主要交付（V0.2 拍板时回填实际数据）

| Sprint | 主题 | 主要交付 | 状态 | 顺延 |
|---|---|---|---|---|
| 20p | ProcurementDocument 试点验证 + Tender↔Contract↔Approval 关联完整性 grep + UI polish + 试点扩大白音华煤矿协调 | （待 Sprint 20p 收口后回填）| ⏳ | 目标 44 |
| 20q | 合同模块 + 采购→合同关联 + 第 3 批 4 模块 production-ready 中间点验证 | （待回填）| ⏳ | 目标 45 |
| 20r | 审批工作流引擎 + 三类业务接入审批 + **NC 真联调启动（D 线升级激活）** | （待回填）| ⏳ | 目标 46 |
| 20s | NC 真联调 5 接口实测 + 审批闭环（驳回/撤销/审批历史）+ production runbook V0.3 实战修正项 | （待回填）| ⏳ | 目标 47（前置目标 / 20t 收尾达成）|
| **联合（20p-20s）** | **采购+合同+审批 3 模块 production-ready + NC 真联调激活 + 试点扩大第 1 批白音华煤矿** | （待回填）| ⏳ | **47 Sprint 0 顺延前置（Sprint 20t 收尾达成）** |

### 1.2 前置就绪（V0.2 拍板时确认）

- ⏳ 数据治理 6 handler 全 production-ready（20k-20m 已闭环 / 持续运营）
- ⏳ 库存查询 + 4 基础单据 endpoint 全在仓（20n part 2 试点反馈陆续到位）
- ⏳ 采购模块 production-ready（Sprint 20p ProcurementDocument 试点验证完成）
- ⏳ 合同模块 production-ready（Sprint 20q + 采购→合同关联）
- ⏳ 审批工作流引擎 production-ready（Sprint 20r + 三类业务接入 + 闭环驳回/撤销）
- ⏳ **NC 真联调 5 接口实测验收**（Sprint 20s + 凭证导出/查询/科目映射/反结/月结）
- ⏳ production runbook V0.3 实战修正项（Sprint 20s 试点单位实战反馈陆续到位）
- ⏳ 试点 4 单位（恒大+本部+物资公司+白音华煤矿）完整业务流跑通 demo 验收

---

## 二、Sprint 20t Task 清单（A 主轨 6 task / 总 ~2.5 PD）

### A 主轨（main 主代理 / 共 6 task / 2.5 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 5 Sprint（20p-20t）整体复盘文档起草 | 0.4 | P0 | main 主代理 a | 类 `sprint-20k-20o-retrospective.md` 模板 / 写到 `docs/internal/sprint-20p-20t-retrospective.md` / **12 章节齐备**：① 整体数据汇总（commit + PD + 顺延数演进 43→47）② Codex 评审记录（20p-20t 累计 / 5 sprint 累计 finding）③ 采购+合同+审批 3 模块闭环里程碑 ④ NC 真联调 D 线激活里程碑 ⑤ production deployment 战绩 ⑥ 双 session 模式延续 ⑦ 5 月反模式根因解除监测 ⑧ 业务方协调状态 ⑨ 20u+ 主轴预判 ⑩ 5 Sprint 战绩总结 ⑪ 关键 commit 索引 ⑫ 教训沉淀 | Sprint 20p-20s 全收口数据 + cutover 实战数据 | 文档 ≥ 250 行 / 12 章节齐备 / 含 commits 索引 + cutover 战绩 + 第 4 周期完整闭环里程碑 |
| **T-A2** **production deployment Q3 末 cutover 实战执行** | 0.8 | **P0** | main 主代理 a + cici + IT + 业务方 | **实战 cutover 主推 task**（vs Sprint 20o T-A2 第 3 批评估文档性质 / 本 task 实战上线）/ 依据 runbook V0.4 + 试点单位部署指南 V0.2（实战版）/ **Day 1-5 详细节奏 §3.2** / **灰度上线策略**：试点单位先切 1-2 周（cici Q2 推荐 B）+ 系统记录 + 线下并行 1 天 / **数据迁移**：基础数据 + 历史业务单据 + 用户权限 + NC 映射 / **业务方培训**：cici Q3 推荐 C（集中培训 + 在线录播 AB 结合）/ **cutover 验收 checklist**：5 模块完整业务流跑通 + NC 真号回写实测 + IssueLog 闭环 SLA 实时监测 / **回退方案**：cici Q5 推荐 C（灰度环境留作 fallback / 当天回退方案 + 1-2 天 buffer）| Sprint 20p-20s 全 production-ready + runbook V0.3 实战修正 + 业务方培训完成 + cutover 灰度环境验证 | **5 模块全 production 上线 ✅** / 4 试点单位完整业务流跑通 / NC 真联调实战验收 / 业务方陪同 0 阻塞 / cutover 验收报告 V0.1 |
| **T-A3** 第 4 周期复盘 + 第 3 批准入正式达成确认 | 0.3 | P0 | main 主代理 a + cici | 基于 T-A1 复盘 + T-A2 cutover 实战数据 / 采购+合同+审批 3 模块 production-ready 正式确认 / 5 模块（数据治理 + 库存 + 采购 + 合同 + 审批）production-ready 完整准入清单 / 输出到 `docs/internal/sprint-20t-batch3-production-ready-final.md` V0.1 / **cici 拍板第 3 批正式准入** | T-A1 复盘 + T-A2 cutover 完成 | 准入文档 ≥ 80 行 / 含 5 模块准入清单 + 4 试点单位完整业务流验证 + cici 拍板项 |
| **T-A4** **第 5 周期（20u-20y）roadmap 起草**（Q4 + Q1 next year 战略方向）| 0.3 | P1 | main 主代理 a | 类 `sprint-20p-20t-roadmap.md` 模板 / 写到 `docs/internal/sprint-20u-20y-roadmap.md` / **范围**：cici Q4 推荐 B（仅战略方向 + Q4-Q1 大方向 / 不做 5 Sprint 详细规划）/ **涵盖**：① 战略定位（第 4 周期 production 上线后 → 第 5 周期 production 后扩展）② 4 工作线延续判断（A 数据治理持续运营 / B 系统上线 production 后维护 / C 业务流程扩展 / D NC/财务深化）③ 候选主轴方向（M-13/S-15/E-13 扩展模块 + AI 能力深化 + 跨系统集成 + 多租户）④ 立即动作清单（5-7 项）⑤ 关键里程碑 ⑥ 风险评估 | T-A1 复盘 + T-A3 第 3 批准入达成 | roadmap V0.1 ≥ 150 行 / 含战略方向 + Q4-Q1 大方向 + 4 工作线延续判断（详细 5 Sprint 规划留 V0.2 cici 拍板）|
| **T-A5** production runbook V0.3 → V0.4 实战版升级 | 0.3 | P0 | main 主代理 a | 在 Sprint 20s T-A3 V0.3 基础（`docs/部署/production-deployment-runbook-V0.3.md`）升级到 V0.4 实战版：① cutover 实战修正项陆续到位（Day 1-5 实际执行反馈）② 5 模块完整业务流跑通章节 ③ NC 真联调实战 chaos 场景 ④ 试点 4 单位部署反馈 ⑤ 回退方案实战验证 ⑥ 备份恢复实测验证 | T-A2 cutover 完成 + 实战数据陆续到位 | runbook V0.4 ≥ V0.3 + 20% 内容 / 含 cutover Day 1-5 实战章节 + 5 模块完整业务流 |
| **T-A6** Codex 20t 评审 + 立修 + V0.x 升版 + memory | 0.4 | P0 | main 主代理 a | 标准收尾 / Codex N 轮 finding 全立修 / V0.x 升版（教训 13 模板）/ memory 升级（**47 Sprint 0 顺延达成** + 第 4 周期 20p-20t 完整闭环 + production deployment 第 1 次实战上线 + 第 5 周期启动）| Sprint 20t T-A1-A5 全 commit 完成 | **47 Sprint 0 顺延达成 ✅** / V0.x 锁版 / memory commit |

**main 总：~2.5 PD**（vs Sprint 20o 1.6 PD / +cutover 0.9 PD 占主要工作量 / vs Sprint 20j 1.7 PD / 20t 性质特殊带实战 cutover）

### E 副轨（second e / 共 ~0.5 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** cutover 业务方培训 walk-through page | 0.2 | 5 模块（数据治理 + 库存 + 采购 + 合同 + 审批）+ 上线后 6 步流程（登录 / 切组织 / 选模块 / 操作业务 / 查报告 / 反馈 IssueLog）/ DevExtreme + brand tokens / 类 Sprint 20n T-E4 pilot-demo walk-through page 模板 |
| **T-E2** 上线后监控 dashboard 完整化 | 0.2 | 数据治理 + 库存 + 采购 + 合同 + 审批 + NC 全模块监控 / 卡片化 + 实时刷新 / 复用 Reports / Dashboards 8/8 模板 |
| **T-E3** e2e smoke 全模块 spec 跑通（production smoke）| 0.1 | 5 模块完整业务流 e2e + login smoke + cutover 后 smoke 验证脚本 |

### D 顺延说明

- ~~D 线 NC/财务接口真联调~~：**Sprint 20r-20s 已激活 / Sprint 20t cutover 实战验收 / 不再顺延**
- 第 5 周期（20u-20y）roadmap：**T-A4 起草 / V0.1 仅战略方向 / 详细规划 V0.2 cici 拍板**

---

## 三、关键节奏

### 3.1 Sprint 20t 性质（vs Sprint 20o 纯收尾对比）

| 维度 | Sprint 20o（第 3 周期纯收尾）| **Sprint 20t（第 4 周期收尾 + cutover）** |
|---|---|---|
| 主轨任务数 | 5（A1-A5）| **6**（A1-A6 / +cutover task）|
| 主轨总 PD | ~1.6 | **~2.5**（cutover +0.9）|
| 收尾内容 | 5 Sprint 复盘 + 第 3 批评估 + runbook V0.2 + 20p+ roadmap | 5 Sprint 复盘 + **Q3 末 production deployment 实战** + 第 3 批准入正式达成 + 第 5 周期 roadmap |
| 实战元素 | ❌（纯文档）| ✅ **cutover 实战上线**（第 1 次真实生产部署）|
| 业务方协调强度 | 中（试点反馈）| **高**（cutover 培训 + 上线 + 业务方陪同 + 4 单位响应）|
| Q3 末硬截止 deadline | ❌ | ✅（Q3 末 production deployment 硬截止 / 任何前置 Sprint 顺延都会影响）|
| wall-clock | 3-5 天 | **5-7 天**（cutover Day 1-5 详细节奏 / 含文档收尾）|
| second 副轨 | 暂停（Q4 B）| ✅ 启用（T-E1 培训 + T-E2 监控 + T-E3 e2e）|

### 3.2 cutover 详细节奏（Day 1-5）

**Day 1（cutover 准备 / Pre-Cutover）**：
- 数据迁移 dry run：试点环境完整数据迁移演练（基础数据 + 业务历史 + 权限 + NC 映射 / 全量 + 增量验证）
- 业务方培训完成确认：4 试点单位（恒大+本部+物资公司+白音华煤矿）培训完成签字 / walk-through page 实操过 / 6 步流程熟悉
- 灰度环境验证：production 镜像环境部署 5 模块 / 全业务流跑通 / NC 真联调 chaos 场景验证 / 回退方案演练
- cutover go/no-go 决策会：cici + IT + 业务方代表 / 决策上线 / 任一关键风险触发回退保留时间窗 1-2 天 buffer

**Day 2（灰度上线 / Pilot Cutover）**：
- 试点单位先切：物资公司 + 集团本部（cici 推荐 B 灰度 1-2 周）/ 系统记录 + 线下并行 1 天（双轨）
- 数据库正式数据迁移：从试点 → production / pg_dump + restore + verify checksum
- 5 模块上线启动：dotnet host + Hangfire workers + frontend dist/ deploy / health-check 验证
- 业务方陪同：cici + IT 现场 / 物资公司 PO（汤云龙）+ 财务（李建颖）协同 / 第一批业务单据真实操作

**Day 3-4（全单位上线 + 业务方陪同）**：
- 第 2 批厂矿上线：恒大煤矿 + 白音华煤矿 / 试点单位反馈验证后扩大
- 业务方陪同：4 试点单位完整业务流跑通（采购单 → 合同 → 审批 → 入库 → NC 凭证回写）
- 实时监控：IssueLog SLA 实时监测 / Hangfire 任务监控 / NC 真号回写率监测
- 业务方反馈窗口：cici 集中收集（类 19r D1 demo 9/9 反馈到位模式）/ 立修小问题 / 大问题 cici 拍板

**Day 5（cutover 验收 + 复盘 + runbook V0.4 实战项回填）**：
- cutover 验收会：cici + IT + 业务方 + PO / 5 模块完整业务流验收清单 / 4 试点单位完整业务流跑通确认
- runbook V0.4 实战项回填：Day 1-5 实际执行反馈 / 实战修正项 / 回退方案验证 / 备份恢复实测
- Sprint 20t T-A1 复盘文档完成：cutover 战绩 + 第 4 周期完整闭环里程碑
- T-A3 第 3 批准入正式达成确认：cici 拍板 5 模块 production-ready 准入清单

### 3.3 wall-clock 估算

- **main 主轨**：5-7 天（cutover 实战 + 文档收尾）
  * Day 1-5：T-A2 cutover 实战执行（0.8 PD / 主推）
  * Day 5-6：T-A1 5 Sprint 复盘文档（0.4 PD / 含 cutover 战绩）
  * Day 6：T-A3 第 3 批准入达成确认（0.3 PD）+ T-A5 runbook V0.4 升级（0.3 PD）
  * Day 7：T-A4 第 5 周期 roadmap 起草（0.3 PD）+ T-A6 Codex 评审 + V0.x 升版 + memory（0.4 PD）

- **second e 副轨**：3-4 天（cutover 前 1 周完成 / 不阻塞 cutover）
  * T-E1 cutover 业务方培训 walk-through page（0.2 PD）
  * T-E2 上线后监控 dashboard 完整化（0.2 PD）
  * T-E3 e2e smoke 全模块 spec 跑通（0.1 PD）

### 3.4 5 Sprint 周期闭环里程碑（第 4 周期 20p-20t）

- **第 1 周期 20a-20e**：race [P0] → [P1] 降级 / dashboard 8/8 部分完成 / Reports 5→11 / **32 Sprint 0 顺延**
- **第 2 周期 20f-20j**：dashboard 8/8 完整 + Reports 20 + production runbook V0.1 / **37 Sprint 0 顺延**
- **第 3 周期 20k-20o**：数据治理 6 handler 闭环 + 数据问题台账 + 数据质量报告 + 试点单位库存试运行 + production runbook V0.2 + 第 3 批评估 / **43 Sprint 0 顺延**
- **第 4 周期 20p-20t（本）**：采购+合同+审批 3 模块 production-ready + NC 真联调激活 + **Q3 末 production deployment 第 1 次实战上线** + 第 5 周期 roadmap 起草 / **目标 47 Sprint 0 顺延**

---

## 四、关键决策点（cici V0.1 → V0.2 拍板）

| # | 决策 | 选项 | 推荐 | **cici 拍板（V0.2 待答）** |
|---|---|---|---|---|
| **Q1** | **Q3 末 production deployment 日期** | A. Q3 末固定（6 月末 / 硬截止）/ B. Q3 末 + 1-2 周 buffer（弹性 / 防 Sprint 20q-s 延误）/ C. **cici 拍板**（依据 Sprint 20q-s 实际进度 / 推荐 C 默认）| **C** | ⏳ |
| **Q2** | cutover 灰度策略 | A. 全部一次切（高风险 / Q3 末紧）/ B. **试点单位先 1-2 周**（推荐 / 物资公司+本部先切 / 验证后扩 4 单位）/ C. 模块分批切（数据治理 → 库存 → 采购 → 合同 → 审批 / 复杂度高）| **B** | ⏳ |
| **Q3** | cutover 业务方培训形式 | A. 集中培训（cici + 物资公司 PO + 3-5 厂矿 / 单日完成）/ B. 在线录播（可重复观看 / 异地厂矿友好）/ C. **AB 结合**（推荐 / 集中培训 + 录播 fallback）| **C** | ⏳ |
| **Q4** | T-A4 第 5 周期 roadmap 范围 | A. 5 Sprint 详细规划（含每 Sprint task 估）/ B. **仅战略方向 + Q4-Q1 大方向**（推荐 / V0.1 战略定调 / V0.2 cici 拍板细化）/ C. 等 Sprint 20t 收口后再起草（推迟 / 不与 cutover 并行）| **B** | ⏳ |
| **Q5** | cutover 失败回退方案 | A. 当天回退（最保守 / 1 天 buffer）/ B. 1-2 天 buffer + 回退（中等 / cutover 后 1-2 天观察期 / 不达预期回退）/ C. **灰度环境留作 fallback**（推荐 / production 上线后 1-2 周灰度环境保留 / 任何重大问题切回灰度）| **C** | ⏳ |

### V0.2 拍板条件

- ⏳ 5 开放问题 cici 答（Q1 Q3 末日期最关键 / 推荐 Q2 B + Q3 C + Q4 B + Q5 C）
- ⏳ 1c 模块隔离表确认（Sprint 20t 主轨涉及 docs/internal/ + docs/部署/ + cutover 实战环境 / second e T-E1+E2+E3 涉及 frontend / 协调机制提前明确）
- ⏳ Sprint 20s 真正收口已达成（runbook V0.3 实战修正 + NC 真联调 5 接口实测 + 审批闭环 / 前置依赖链全 done）
- ⏳ Sprint 20p-20s 累计 46 Sprint 0 顺延前置（Sprint 20t 收尾达成 47）

---

## 五、风险与依赖

### 5.1 高风险（4 项）

- **cutover 数据迁移失败**：production 数据迁移失败 / pg_dump + restore checksum 不一致 / 历史业务单据丢失 → **缓解**：Day 1 dry run + 全量 + 增量验证 / Day 5 备份恢复实测 / cici Q5 C 灰度环境 fallback 留 1-2 周
- **业务方培训不充分**：4 试点单位（恒大+本部+物资公司+白音华煤矿）培训完成度不一致 / 异地厂矿响应延迟 / 上线后业务方操作不熟悉 → **缓解**：cici Q3 C AB 结合（集中培训 + 录播 fallback）/ T-E1 walk-through page 自助引导 / 业务方陪同 Day 2-4
- **NC 真联调上线后 chaos**：Sprint 20r-20s 真联调验收完成 / 但 production 流量下 chaos 场景未知（高并发 / 大数据量 / 跨时区时差）→ **缓解**：runbook V0.4 含 NC 真联调实战 chaos 章节 / Polly 三层重试实战验证 / cutover 后第 1 周密集监控
- **业务方上线后反馈密集**：4 试点单位上线后第 1 周反馈集中 / cici 单点协调瓶颈（根因 #1 仍保留）/ 立修响应延迟 → **缓解**：cici 集中收集 + 立修小问题 / 大问题 cici 拍板 / PM 角色评估（roadmap V0.1 §五 已注）

### 5.2 中风险（3 项）

- **Q3 末 deadline 紧**：cutover Day 1-5 5 天 + 文档收尾 2 天 = 7 天 wall-clock / Q3 末硬截止 / 任一 Sprint 20q-s 延误传导 → **缓解**：cici Q1 C 推荐（依据 Sprint 20q-s 进度拍板）/ Q3 末 + 1-2 周 buffer 选项 B 备用 / cutover go/no-go 决策会 Day 1 留 1-2 天 buffer
- **runbook V0.3 实战修正不足**：Sprint 20s T-A3 升级 V0.3 / 但实战部署演练未必充分 → **缓解**：T-A5 V0.3 → V0.4 实战项陆续到位 / cutover Day 5 回填实战修正
- **第 4 周期完整闭环交付压力**：5 模块（数据治理 + 库存 + 采购 + 合同 + 审批）+ NC 真联调 + cutover 实战 + 第 5 周期 roadmap / 工作量集中 → **缓解**：6 task 节奏分布 5-7 天 / cutover Day 1-5 主推 / 文档收尾 Day 5-7 集中

### 5.3 低风险（3 项）

- **5 Sprint 复盘文档**（T-A1）：3 次模板（20a-20e / 20f-20j / 20k-20o）成熟 / 12 章节齐备模式稳定
- **Codex 0 顺延**（T-A6）：43 Sprint 实测稳定（截至 20o）/ 6 次 0 finding 收敛 / 立修流程成熟
- **第 5 周期 roadmap**（T-A4）：V0.1 战略方向起草（Q4 B 推荐）/ 不做详细规划 / cici Q4 B 拍板 V0.2 细化

### 5.4 主要依赖

- **Sprint 20p-20s 累计交付**：5 模块全 production-ready + NC 真联调实战验收 + runbook V0.3 实战修正
- **业务方协调**：cici 单点 / 4 试点单位响应 + 物资公司 PO（汤云龙）+ 财务（李建颖）+ IT 协同
- **cutover 实战环境**：production 服务器 + 数据库 + 灰度环境 / IT 配合 / 备份恢复机制
- **Codex 评审**：手动模式延续 / cici 触发 `codex review --base <Sprint 20s 末 commit>`

---

## 六、对外汇报口径

> **Sprint 20t 第 4 周期 20p-20t 完整闭环 + Q3 末 production deployment 正式上线**：数据治理 + 库存 + 采购 + 合同 + 审批 + NC 6 模块全 production-ready 上线 / 试点单位扩大第 2 批（恒大+本部+物资公司+白音华煤矿 4 单位完整业务流跑通）/ production runbook V0.4 实战版（cutover Day 1-5 实战章节）/ 第 3 批（采购+合同+审批）正式准入达成 / **47 Sprint 0 顺延维持目标**（连续 4 个 5 Sprint 周期完整闭环 / 累计 20 micro-sprint）/ 第 5 周期（20u-20y）启动（Q4 + Q1 next year 战略方向 / V0.1 战略定调 / V0.2 cici 拍板细化）。整个 Sprint 20t 性质为 5 Sprint 周期收尾（类 Sprint 20j / 20o 模板）+ **production deployment 实战 cutover**（新元素 / 第 1 次真实生产上线）/ 风险管控以 Q3 末硬截止 deadline + cutover 数据迁移 + 业务方培训 + NC 真联调 chaos + cici 单点协调为主要监测项。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-25+（待 Sprint 20s 收口后启动 / 实际日期取决于 Sprint 20p-20s 进度）| main a 起草 / Sprint 20t 任务卡 / **第 4 周期 20p-20t 5 Sprint 收尾 + cutover sprint** / 6 task 按 roadmap V0.1 §2.5 落地（T-A1 5 Sprint 复盘 + **T-A2 production deployment cutover 主推 0.8 PD** + T-A3 第 3 批准入达成 + T-A4 第 5 周期 roadmap + T-A5 runbook V0.4 实战版 + T-A6 Codex+V0.x / 总 **~2.5 PD**）/ 性质为 **5 Sprint 周期收尾 + cutover sprint 双重性质**（vs Sprint 20o 纯收尾 / 工作量 +0.9 PD）/ cutover Day 1-5 详细节奏（Pre-Cutover / Pilot Cutover / 全单位上线 / 业务方陪同 / cutover 验收）/ 5 开放问题待 cici 答（**Q1 Q3 末 deployment 日期最关键** / Q2 灰度策略 / Q3 业务方培训形式 / Q4 第 5 周期 roadmap 范围 / Q5 cutover 回退方案）/ second e 副轨启用（T-E1 培训 walk-through + T-E2 监控 dashboard + T-E3 e2e smoke）/ 目标 **47 Sprint 0 顺延达成**（第 4 周期完整闭环里程碑）|
| V0.2（计划）| Sprint 20s 收口后 cici 拍板 | cici 5 决策拍板（Q1 Q3 末日期最关键）/ Sprint 20p-20s 实际数据回填 §一 / 1c 模块隔离表确认 / cutover go/no-go 决策会准备清单 / V0.2 锁版启动 Day 1 |

---

**Created**: 2026-05-25+ 待 Sprint 20s 收口（Sprint 20p-20s 实际进度决定）→ V0.1 起草 / main 主代理 a / 第 4 周期 20p-20t 5 Sprint 收尾 + Q3 末 production deployment 实战 cutover sprint

**Related**:
- [`Sprint-20s-任务卡-V0.x.md`](Sprint-20s-任务卡-V0.x.md)（前序 / NC 真联调 5 接口实测 + 审批闭环 + runbook V0.3 实战修正 / 待 Sprint 20s 起草后填）
- [`Sprint-20r-任务卡-V0.x.md`](Sprint-20r-任务卡-V0.x.md)（前前序 / 审批工作流引擎 + NC 真联调启动 D 线激活 / 待起草）
- [`Sprint-20q-任务卡-V0.x.md`](Sprint-20q-任务卡-V0.x.md)（前前前序 / 合同模块 + 采购→合同关联 / 待起草）
- [`Sprint-20p-任务卡-V0.2.md`](Sprint-20p-任务卡-V0.2.md)（第 4 周期开局 / ProcurementDocument 试点验证 + 试点扩大白音华煤矿协调）
- [`Sprint-20o-任务卡-V0.4.md`](Sprint-20o-任务卡-V0.4.md)（第 3 周期收尾模板参考 / 同收尾 sprint 模板 / 5 task 1.6 PD）
- [`../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md`](../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md) V0.1（第 4 周期 roadmap / §2.5 本 Sprint 任务规划）
- [`../../SupplyCores/docs/部署/production-deployment-runbook-V0.2.md`](../../SupplyCores/docs/部署/production-deployment-runbook-V0.2.md) V0.2（runbook 当前版 / 待 Sprint 20s 升 V0.3 / 本 Sprint 升 V0.4 实战版）
- [`../../SupplyCores/docs/部署/试点单位部署指南-V0.1.md`](../../SupplyCores/docs/部署/试点单位部署指南-V0.1.md)（试点环境部署模板 / cutover 复用）
- [`../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md`](../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md) V0.1（5 Sprint 复盘模板参考 / 12 章节齐备）
- [`../../SupplyCores/docs/internal/sprint-20f-20j-retrospective.md`](../../SupplyCores/docs/internal/sprint-20f-20j-retrospective.md)（第 2 周期复盘模板参考）
- [`../../SupplyCores/docs/internal/sprint-20a-20e-retrospective.md`](../../SupplyCores/docs/internal/sprint-20a-20e-retrospective.md)（第 1 周期复盘模板参考）
- [[feedback_codex_0_carryover_8_sprint_record]]（42 Sprint 0 顺延记录 / 第 4 周期目标 47 Sprint）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 / 第 4 周期业务模块扩大 + production deployment）
- [[project_po_meeting_2026_05_16_nc_voucher_export]]（PO 决策 / 第 4 周期 D 线激活触发 / NC 真联调上线）
- [[feedback_business_party_coordination_failure]]（5 月反模式根因 #1 cici 单点仍保留 / 第 4 周期 cutover 主要监测项）
- [[feedback_oauth2_client_credentials_pattern]]（NC 真联调 OAuth2 5 要点模式 / Sprint 20r-20s 复用 / cutover 实战验收）
- [[reference_voucher_storage_pattern]]（凭证导出 production-ready / cutover NC 真联调切换基础）
