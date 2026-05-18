# Sprint 20y 任务卡 V0.1（2026-05-19 cici 早晨拍板 ✅ 评分顺序应用 / 第 6 批 5 入选 第 5 个 sprint 收尾 / WARN-V2 库存预警 启动）

**Sprint**：20y（**第 6 批 5 入选第 5 个 sprint / 第 6 批收尾 sprint** / 评分顺序拍板分配第 5 / 紧续 Sprint 20x CMS-02 采购看板收尾 → WARN-V2 库存预警启动 + 第 6 批完整闭环）
**主题**：**WARN-V2 库存预警（19 分 / 评分顺序第 5 / 第 6 批收尾）启动 + 第 6 批 5 入选完整闭环**
**节奏**：roadmap V0.2 §2.5 第 6 批分配 / 工作量 ~1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天
**性质**：**第 6 批 5 入选第 5 个 sprint / 业务实施 sprint + 第 6 批收尾 sprint**（现有预警单维 / Sprint 20l ReportAlert R-10 已 done / 多阈值 + 多通道告警自然演进 / 与告警系统设计联动）

**V0.1 起草要点**（cici 2026-05-19 评分顺序拍板应用）：

- **cici 拍板**：✅ 第 6 批 5 入选按评分顺序分配 5 sprint（Sprint 20u CMS-01 / 20v CMS-05 / 20w LIFE-CYCLE / 20x CMS-02 / 20y WARN-V2）
- **WARN-V2 库存预警**：现有预警单维 / Sprint 20l ReportAlert R-10 已 done 基础 / 多阈值（安全库存 + 预警库存 + 报警库存 + 死库存）+ 多通道告警（邮件 + IM + 短信 + 大屏弹窗）扩展自然演进 / 与告警系统设计联动

---

## §1 基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2026-07-10（待 Sprint 20x D4 满后启动 / 第 6 批收尾 sprint）|
| main 主线工作量 | ~1.5 PD（4 task / T-A1-A4 / 业务实施 + 第 6 批收尾双重性质）|
| second 副线工作量 | ~0.5 PD（2 task / T-E1-E2 / 前端配对）|
| wall-clock | 3-4 天（Day 1-3 业务实施 + Day 4 收尾 + 第 6 批闭环复盘）|
| Sprint 性质 | **第 6 批 5 入选第 5 个业务实施 + 第 6 批收尾双重 sprint**（WARN-V2 19 分入选优先级 P3）|
| 前置 Sprint | Sprint 20x D4 满 + CMS-02 采购看板 production-ready + 52 Sprint 0 顺延 |
| 后续 Sprint | Sprint 20z（第 7 周期开局 / 待 cici roadmap V0.4 拍板）|
| Sprint 顺延目标 | **53 Sprint 0 顺延**（Sprint 20x 52 → 20y **53** / 第 6 批完整闭环里程碑）|

---

## §2 Day 1-2 Task 占位（A 主轨 4 task / 总 ~1.5 PD）

### A 主轨（main 主代理 / WARN-V2 库存预警业务实施 + 第 6 批收尾 / 共 4 task / 1.5 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** WARN-V2 backend skeleton（M1 / Application/ReportAlerts/InventoryAlertV2AppService）| 0.3 | P0 | main 主代理 a | ① 扩展 `modules/nova.supplycores/src/Nova.SupplyCores.Application/ReportAlerts/InventoryAlertV2AppService.cs`（复用 ReportAlert R-10 基础 / Sprint 20l done）② endpoint：`/api/report-alert/inventory-v2/multi-threshold` + `/api/report-alert/inventory-v2/multi-channel` + `/api/report-alert/inventory-v2/dashboard` ③ 多阈值 entity 扩展（InventoryAlertThreshold 4 类：安全库存 / 预警库存 / 报警库存 / 死库存）④ 多通道 entity 扩展（AlertChannel 4 类：邮件 / IM / 短信 / 大屏弹窗）⑤ Permission 配置（`SupplyCoresPermissions.ReportAlert.InventoryV2.Default`）⑥ Controller class 级 `[Authorize]` | Sprint 20x T-A4 done + Sprint 20l ReportAlert R-10 production-ready | AppService + Controller + DTO 完整 / 3 endpoint 可调 / 多阈值 4 类 + 多通道 4 类 entity / Authorize class 级齐备 |
| **T-A2** WARN-V2 业务闭环（M2 / 多阈值规则 + 多通道告警发送 + 告警系统设计联动）| 0.4 | P0 | main 主代理 a | ① 多阈值规则引擎（安全库存：定额 ≤ x / 预警库存：x < 库存 ≤ y / 报警库存：y < 库存 ≤ z / 死库存：长期未动）② 多通道告警发送（邮件 SMTP + IM HTTP 接口 + 短信 SMS / 网关 + 大屏弹窗 SignalR push）③ 告警去重（同一物资同一阈值 cooldown 期 / 复用 ReportAlert R-10 dedup pending 模式）④ 告警系统设计联动（写 `sprint-20x-alerting-system-design.md`）⑤ 试点 5 单位真预警数据加载 + 多通道真发送测试 ⑥ 写到 `docs/internal/sprint-20y-warn-v2-business-closure.md` ≥ 100 行 | T-A1 backend skeleton + ReportAlert R-10 dedup pending 模式 / Sprint 20l raw SQL CREATE UNIQUE INDEX IF NOT EXISTS UX_report_alert_dedup_pending | 多阈值 4 类规则 / 多通道 4 类真发送 / 去重 cooldown 验证 / 试点 5 单位真预警数据 / 多通道真发送 ≥ 4 个通道 |
| **T-A3** WARN-V2 单测 + 集成验收 + 第 6 批完整闭环复盘（M3+M4 / spawn 子代理 + E2E + 5 sprint retrospective）| 0.4 | P0 | main 主代理 a + 子代理 | ① backend 单测 ≥ 12 case（多阈值规则 + 多通道发送 + 去重 / spawn 1 子代理）② E2E spec（预警 dashboard + 多阈值切换 + 多通道真发送）③ Pre-Delivery Checklist（6 项）④ **第 6 批 5 sprint 完整闭环复盘**（Sprint 20u-20y / 5 入选模块累计 commits / 子代理 spawn / Codex Round 19-23 累计 0 收敛 / PO 反馈累计 / 试点 5 单位实施 / 性能 ≤ 2s 验证累计）⑤ 写到 `docs/internal/sprint-20u-20y-batch6-retrospective.md` ≥ 200 行 + `docs/internal/sprint-20y-warn-v2-acceptance.md` ≥ 80 行 | T-A1+T-A2 done + second e T-E1 前端 done | 单测 ≥ 12 case 全绿 / E2E spec 4+ case / 多通道真发送 ≥ 4 通道 / 第 6 批 retrospective ≥ 200 行 / 5 sprint 累计度量完整 |
| **T-A4** Codex Round 24 立修 + 复测 + V0.x 升版 + memory + Sprint 20y 收尾 commit + 第 6 批完整闭环 commit | 0.4 | P0 | main 主代理 a | 标准收尾 + Codex Round 24 立修 + 复测 + 0 finding 收敛目标（接续 Sprint 20o Round 5 / Sprint 20p Round 12 / Sprint 20q-20x Round 13-23 累计 10 次 0 收敛连续）/ Sprint 20y 任务卡 V0.x 升版（教训 13 6 步模板）/ memory 升级（**53 Sprint 0 顺延 + 第 6 批 5 入选完整闭环里程碑** + Sprint 20y WARN-V2 完整闭环）/ roadmap V0.3 → V0.4 §2.6 升版（第 6 批 5 sprint 累计实施完整记录 + 第 7 周期方向起草）/ Sprint 20y 收尾 commit + **第 6 批完整闭环 commit**（类 Sprint 20o T-A5 第 3 周期完整收尾 commit 模板复用） | Sprint 20y T-A1-A3 全 commit 完成 | Codex 0 顺延 / V0.x 锁版 / memory commit / **第 6 批 5 入选完整闭环里程碑达成 ✅** / roadmap V0.4 §2.6 升版 done / Sprint 20y 收尾 commit + 第 6 批完整闭环 commit 各 1 个 |

**main 总：~1.5 PD**（vs Sprint 20u-20x 1.5 PD / 第 6 批 5 sprint 业务实施工作量稳定 / 收尾 sprint 复盘工作 +0.1 / WARN-V2 单模块复杂度抵消 -0.1）

### E 副轨（second 主代理 e / WARN-V2 前端配对 + 第 6 批 retrospective 协助 / 共 2 task / 0.5 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** WARN-V2 前端告警 dashboard（second 配对）| 0.3 | pending | DevExtreme + Reports/Dashboards / `pages/inventory-warning-v2/App.tsx` ≥ 400 行 / 5-7 张图（多阈值切换 + 多通道发送状态 + 告警列表 + 告警趋势 + 试点单位对比）/ 大屏弹窗 SignalR client 接通 / brand tokens 严格 / ui-ux-pro-max Pre-Delivery Checklist |
| **T-E2** WARN-V2 前端 e2e + 第 6 批前端 retrospective 协助（second 自检）| 0.2 | pending | e2e spec 自动化（多阈值切换 / 多通道真发送跳转 / 大屏弹窗）/ UI polish / 第 6 批前端 retrospective 协助（Sprint 20u-20y 5 sprint 前端累计度量 / 5 dashboard 一致性检查 / second e Reports/Dashboards 累积 14-18 次模板完成 19 次） |

---

## §3 第 6 批模块 mini-roadmap M1-M4（WARN-V2 库存预警）

| 阶段 | 内容 | PD | Day | 责任方 |
|---|---|---|---|---|
| **M1 backend skeleton** | AppService + Controller + DTO + Permission + Authorize / 多阈值 4 类 + 多通道 4 类 entity / 复用 ReportAlert R-10 | 0.3 | Day 1 | main T-A1 |
| **M2 业务闭环** | 多阈值规则引擎 + 多通道告警发送 + 告警去重 + 告警系统设计联动 + 试点 5 单位真预警 | 0.4 | Day 2 | main T-A2 |
| **M3 单测 + 前端** | backend 单测 ≥ 12 case（spawn 子代理）+ frontend `App.tsx` ≥ 400 行 / 大屏弹窗 SignalR（second 主轨） | 0.5 | Day 3 | main T-A3（part 单测）+ second e T-E1 |
| **M4 集成验收 + 第 6 批 retrospective** | E2E spec + 多通道真发送 ≥ 4 通道 + Pre-Delivery Checklist（6 项）+ **第 6 批 5 sprint 完整闭环复盘 ≥ 200 行** | 0.3 | Day 4 | main T-A3（part E2E + retrospective）+ second e T-E2 |

---

## §4 触发条件

| 条件 | 内容 | 状态 |
|---|---|---|
| **C-1** | Sprint 20x D4 满（CMS-02 采购看板 production-ready + 52 Sprint 0 顺延前置达成）| ⏳ 待 Sprint 20x D4 |
| **C-2** | cici 第 6 批分配 cici 拍板 ✅（**2026-05-19 评分顺序拍板 done**）| ✅ done |
| **C-3** | Sprint 20l ReportAlert R-10 production-ready（多阈值 + 多通道告警发送基础 / dedup pending 模式）| ✅ done |
| **C-4** | 多通道发送基础设施在仓（邮件 SMTP + IM HTTP 接口 + 短信 SMS 网关 / SignalR 大屏弹窗 push）| ⏳ 待验证 / 部分在仓 |
| **C-5** | 52 Sprint 0 顺延维持（前置 Codex 健康度 + Sprint 20x T-A4 累积达成）| ⏳ 待 Sprint 20x T-A4 |

**触发判断**：C-1 + C-4 + C-5 待达成 / C-2 + C-3 已 done / Sprint 20x D4 满后启动 Day 1

---

## §5 沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.1** | **2026-05-19（cici 早晨拍板 ✅ 评分顺序分配第 6 批应用 / Sprint 20y V0.1 起草 / 第 6 批收尾 sprint）** | **cici 2026-05-19 评分顺序拍板第 6 批 5 入选分配 5 sprint 应用 V0.1 起草**：① **Sprint 20y 主题：WARN-V2 库存预警启动 + 第 6 批收尾**（19 分入选 / 评分顺序第 5 / 第 6 批 5 入选完整闭环里程碑）② **T-A1-A4 完整**（T-A1 backend skeleton M1 / T-A2 业务闭环 M2 / T-A3 单测 + 集成验收 + 第 6 批 5 sprint retrospective ≥ 200 行 / T-A4 Codex Round 24 + 第 6 批完整闭环 commit 收尾）③ **M1-M4 mini-roadmap §3 完整**（每阶段 PD + Day + 责任方 / M4 含第 6 批 retrospective）④ **second 副轨 0.5 PD**（T-E1 前端告警 dashboard + 大屏弹窗 SignalR + T-E2 e2e + 第 6 批前端 retrospective 协助）⑤ **触发条件 5 条 §4**（C-2 + C-3 done / C-1 + C-4 + C-5 待 Sprint 20x）⑥ 工作量 1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天 / **53 Sprint 0 顺延 + 第 6 批 5 入选完整闭环里程碑目标** |

---

**起草人**：main 主代理 a（2026-05-19 cici 评分顺序拍板应用 V0.1 起草）
**预期 Sprint 20y Day 1 启动**：Sprint 20x D4 满后（~ 2026-07-10）
**Related**：
- [`Sprint-20x-任务卡-V0.1.md`](Sprint-20x-任务卡-V0.1.md)（前序 / 第 6 批第 4 / CMS-02 采购看板 / D4 满触发本 sprint）
- [`Sprint-20u-任务卡-V0.2.md`](Sprint-20u-任务卡-V0.2.md)（第 6 批第 1 / CMS-01 库存看板 / 第 6 批开局）
- [`Sprint-20q-任务卡-V0.6.md`](Sprint-20q-任务卡-V0.6.md)（cici 第 6 批拍板 ✅ 评分顺序应用源）
- [`../内部/cycle4-batch6-module-scoring-V0.2.md`](../内部/cycle4-batch6-module-scoring-V0.2.md)（第 6 批 8 候选评分 + 5 入选 / WARN-V2 mini-roadmap §4.5 来源）
- [[feedback_sprint20l_full_loop_complete]]（ReportAlert R-10 实施完整闭环 / 本 sprint T-A1 复用基础）
- [[feedback_codex_false_positive_verify_first]]（raw SQL CREATE UNIQUE INDEX IF NOT EXISTS UX_report_alert_dedup_pending 模式 / 本 sprint T-A2 去重复用）
- [[feedback_sprint20o_full_loop_complete]]（第 3 周期完整闭环 commit 模板 / 本 sprint T-A4 第 6 批完整闭环 commit 复用）
- [[feedback_dual_session_19t_continuous_validation]]（second e Reports/Dashboards 累积 / 本 sprint T-E1 第 19 次连续 + 第 6 批前端 retrospective 协助）
- [[reference_team_tech_stack]]（前端 DevExtreme + ExcelJS 默认）
- [[feedback_codex_0_carryover_8_sprint_record]]（52 Sprint 0 顺延记录 / 本 sprint 目标 53 + 第 6 批完整闭环里程碑）
