# Sprint 20x 任务卡 V0.1（2026-05-19 cici 早晨拍板 ✅ 评分顺序应用 / 第 6 批 5 入选 第 4 个 sprint / CMS-02 采购看板 启动）

**Sprint**：20x（**第 6 批 5 入选第 4 个 sprint** / 评分顺序拍板分配第 4 / 紧续 Sprint 20w LIFE-CYCLE 设备管理收尾 → CMS-02 采购看板启动）
**主题**：**CMS-02 采购看板（20 分 / 评分顺序第 4）启动**
**节奏**：roadmap V0.2 §2.5 第 6 批分配 / 工作量 ~1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天
**性质**：**第 6 批 5 入选第 4 个 sprint / 业务实施 sprint**（合同 + 订单 + 入库三表已 production / 采购全链路可视化刚需 / 第 4 周期 ProcurementDocument + 采购合同累积基础）

**V0.1 起草要点**（cici 2026-05-19 评分顺序拍板应用）：

- **cici 拍板**：✅ 第 6 批 5 入选按评分顺序分配 5 sprint（Sprint 20u CMS-01 / 20v CMS-05 / 20w LIFE-CYCLE / 20x CMS-02 / 20y WARN-V2）
- **CMS-02 采购看板**：合同 + 订单 + 入库三表已 production / Wave I/J 已做部分整合 / 采购全链路可视化刚需 / 第 4 周期 ProcurementDocument（Sprint 20p）+ 采购合同（Sprint 20t）累积基础

---

## §1 基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2026-07-05（待 Sprint 20w D4 满后启动）|
| main 主线工作量 | ~1.5 PD（4 task / T-A1-A4 / 业务实施性质）|
| second 副线工作量 | ~0.5 PD（2 task / T-E1-E2 / 前端配对）|
| wall-clock | 3-4 天（Day 1-3 业务实施 + Day 4 收尾）|
| Sprint 性质 | **第 6 批 5 入选第 4 个业务实施 sprint**（CMS-02 采购看板 20 分入选优先级 P2）|
| 前置 Sprint | Sprint 20w D4 满 + LIFE-CYCLE 设备管理 production-ready + 2 设备缺口立修 done |
| 后续 Sprint | Sprint 20y（第 6 批第 5 / WARN-V2 库存预警 / 第 6 批收尾 sprint）|
| Sprint 顺延目标 | **52 Sprint 0 顺延**（Sprint 20w 51 → 20x **52**）|

---

## §2 Day 1-2 Task 占位（A 主轨 4 task / 总 ~1.5 PD）

### A 主轨（main 主代理 / CMS-02 采购看板业务实施 / 共 4 task / 1.5 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** CMS-02 backend skeleton（M1 / Application/Cms/ProcurementDashboardAppService）| 0.3 | P0 | main 主代理 a | ① 新增 `modules/nova.supplycores/src/Nova.SupplyCores.Application/Cms/ProcurementDashboardAppService.cs` ② endpoint：`/api/cms/procurement/dashboard` + `/api/cms/procurement/full-chain` ③ 整合合同（Contract / ProcurementContract）+ 订单（PurchaseOrder / ProcurementDocument）+ 入库（StockMovement / GoodsReceipt）三表 query ④ DTO 定义（ProcurementDashboardDto + FullChainDto + SupplierRankingDto + PriceTrendDto）⑤ Permission 配置（`SupplyCoresPermissions.Cms.ProcurementDashboard.Default`）⑥ Controller class 级 `[Authorize]`（沿用 Sprint 20u-20w 模式） | Sprint 20w T-A5 done + 合同 + 订单 + 入库三表 production / Sprint 20p ProcurementDocument + Sprint 20t 采购合同累积基础 | AppService + Controller + DTO 完整 / 2 endpoint 可调 / 三表整合数据加载 / Authorize class 级齐备 |
| **T-A2** CMS-02 业务闭环（M2 / 采购全链路 + 供应商排名 + 价格趋势 + 采购周期）| 0.4 | P0 | main 主代理 a | ① 采购全链路时序（询价 → 合同 → 订单 → 入库 → 付款 / 5 阶段时序图数据）② 供应商排名（采购金额 / 履约率 / 准时入库率 / 质量评分）③ 价格趋势（30/60/90 天滚动 / 物资类别维度 / 供应商维度）④ 采购周期分析（合同签订到入库 / 入库到付款 / 端到端周期）⑤ 试点 5 单位真数据加载（恒大本部 + 物资公司 + 7 矿采购数据）⑥ 写到 `docs/internal/sprint-20x-cms-procurement-dashboard-business-closure.md` ≥ 100 行 | T-A1 backend skeleton + Sprint 20p ProcurementDocument + Sprint 20t 采购合同 production-ready | 全链路时序可视 / 供应商排名 4 维度 / 价格趋势 3 滚动维度 / 采购周期 3 阶段 / 试点 5 单位真数据加载通过 |
| **T-A3** CMS-02 单测 + 集成验收（M3+M4 / spawn 子代理 + E2E + Pre-Delivery Checklist）| 0.4 | P0 | main 主代理 a + 子代理 | ① backend 单测 ≥ 15 case（采购全链路 + 供应商排名 + 价格趋势 + 采购周期 / spawn 1 子代理）② E2E spec（dashboard 加载 / 全链路时序 / 供应商排名切换 / 价格趋势钻取）③ Pre-Delivery Checklist（6 项）④ 试点 5 单位真数据验收（PO 协调反馈窗口）⑤ 集团 PO + 物资公司汤云龙反馈窗口 ⑥ 写到 `docs/internal/sprint-20x-cms-procurement-dashboard-acceptance.md` | T-A1+T-A2 done + second e T-E1 前端 done | 单测 ≥ 15 case 全绿 / E2E spec 5+ case / Pre-Delivery Checklist 6 项全 ✅ / 试点 5 单位真数据加载验收通过 / 反馈 ≥ 3 项 |
| **T-A4** Codex Round 23 立修 + 复测 + V0.x 升版 + memory + Sprint 20x 收尾 commit | 0.4 | P0 | main 主代理 a | 标准收尾 + Codex Round 23 立修 + 复测 + 0 finding 收敛目标（接续 Sprint 20o Round 5 / Sprint 20p Round 12 / Sprint 20q-20w Round 13-22 累计 9 次 0 收敛连续）/ Sprint 20x 任务卡 V0.x 升版（教训 13 6 步模板）/ memory 升级（52 Sprint 0 顺延 + Sprint 20x 第 6 批第 4 个 CMS-02 采购看板完整闭环）/ roadmap V0.3 §2.6 修正（如需）/ Sprint 20x 收尾 commit | Sprint 20x T-A1-A3 全 commit 完成 | Codex 0 顺延 / V0.x 锁版 / memory commit / Sprint 20x 收尾 commit 1 个 |

**main 总：~1.5 PD**（vs Sprint 20u-20w 1.5 PD / 第 6 批业务实施工作量稳定 / CMS-02 三表整合复杂度 vs 累积基础平衡）

### E 副轨（second 主代理 e / CMS-02 前端配对 / 共 2 task / 0.5 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** CMS-02 前端 dashboard（second 配对）| 0.3 | pending | DevExtreme + Reports/Dashboards / `pages/cms-procurement-dashboard/App.tsx` ≥ 450 行 / 6-8 张图（采购全链路时序图 + 供应商排名 + 价格趋势 + 采购周期 + 物资分布 + 单位对比）/ brand tokens 严格 / ui-ux-pro-max Pre-Delivery Checklist / 类 Sprint 20u/20v dashboard 模式扩展 |
| **T-E2** CMS-02 前端 e2e + UI polish（second 自检）| 0.2 | pending | e2e spec 自动化（dashboard 加载 / 全链路时序 / 排名钻取 / 价格趋势）/ UI polish / 试点 5 单位真数据加载验证（与 main T-A3 配对） |

---

## §3 第 6 批模块 mini-roadmap M1-M4（CMS-02 采购看板）

| 阶段 | 内容 | PD | Day | 责任方 |
|---|---|---|---|---|
| **M1 backend skeleton** | AppService + Controller + DTO + Permission + Authorize / 合同 + 订单 + 入库三表整合 query | 0.3 | Day 1 | main T-A1 |
| **M2 业务闭环** | 采购全链路时序 + 供应商排名 + 价格趋势 + 采购周期 + 试点 5 单位真数据 | 0.4 | Day 2 | main T-A2 |
| **M3 单测 + 前端** | backend 单测 ≥ 15 case（spawn 子代理）+ frontend `App.tsx` ≥ 450 行 / 6-8 张图（second 主轨） | 0.5 | Day 3 | main T-A3（part 单测）+ second e T-E1 |
| **M4 集成验收** | E2E spec + 试点 5 单位真数据 + Pre-Delivery Checklist（6 项）+ PO + 物资公司反馈窗口 ≥ 3 项 | 0.3 | Day 4 | main T-A3（part E2E）+ second e T-E2 |

---

## §4 触发条件

| 条件 | 内容 | 状态 |
|---|---|---|
| **C-1** | Sprint 20w D4 满（LIFE-CYCLE 设备管理 production-ready + 2 设备缺口立修 done + 51 Sprint 0 顺延前置达成）| ⏳ 待 Sprint 20w D4 |
| **C-2** | cici 第 6 批分配 cici 拍板 ✅（**2026-05-19 评分顺序拍板 done**）| ✅ done |
| **C-3** | 合同 + 订单 + 入库三表 production-ready（Sprint 20p ProcurementDocument + Sprint 20t 采购合同累积 + StockMovement 在仓）| ✅ done |
| **C-4** | 试点 5 单位采购数据治理 done（Sprint 20l-20m 数据治理产物 + Sprint 20q ProcurementDocument 跨集 22/25 评分实证）| ✅ done |
| **C-5** | 51 Sprint 0 顺延维持（前置 Codex 健康度 + Sprint 20w T-A5 累积达成）| ⏳ 待 Sprint 20w T-A5 |

**触发判断**：C-1 + C-5 待达成 / C-2-C-4 已 done / Sprint 20w D4 满后启动 Day 1

---

## §5 沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.1** | **2026-05-19（cici 早晨拍板 ✅ 评分顺序分配第 6 批应用 / Sprint 20x V0.1 起草）** | **cici 2026-05-19 评分顺序拍板第 6 批 5 入选分配 5 sprint 应用 V0.1 起草**：① **Sprint 20x 主题：CMS-02 采购看板启动**（20 分入选 / 评分顺序第 4）② **T-A1-A4 完整**（T-A1 backend skeleton M1 / T-A2 业务闭环 M2 / T-A3 单测 + 集成验收 M3+M4 / T-A4 Codex Round 23 收尾）③ **M1-M4 mini-roadmap §3 完整**（每阶段 PD + Day + 责任方）④ **second 副轨 0.5 PD**（T-E1 前端 dashboard + T-E2 e2e + UI polish）⑤ **触发条件 5 条 §4**（C-2-C-4 done / C-1 C-5 待 Sprint 20w）⑥ 工作量 1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天 / **52 Sprint 0 顺延目标** |

---

**起草人**：main 主代理 a（2026-05-19 cici 评分顺序拍板应用 V0.1 起草）
**预期 Sprint 20x Day 1 启动**：Sprint 20w D4 满后（~ 2026-07-05）
**Related**：
- [`Sprint-20w-任务卡-V0.1.md`](Sprint-20w-任务卡-V0.1.md)（前序 / 第 6 批第 3 / LIFE-CYCLE 设备管理 + 2 设备缺口立修 / D4 满触发本 sprint）
- [`Sprint-20y-任务卡-V0.1.md`](Sprint-20y-任务卡-V0.1.md)（后序 / 第 6 批第 5 / WARN-V2 库存预警 / 第 6 批收尾）
- [`Sprint-20p-任务卡-V0.3.md`](Sprint-20p-任务卡-V0.3.md)（ProcurementDocument 试点验证 / 本 sprint 三表基础）
- [`Sprint-20t-任务卡-V0.1.md`](Sprint-20t-任务卡-V0.1.md)（采购合同启动 / 本 sprint 三表基础）
- [`Sprint-20q-任务卡-V0.6.md`](Sprint-20q-任务卡-V0.6.md)（cici 第 6 批拍板 ✅ 评分顺序应用源）
- [`../内部/cycle4-batch6-module-scoring-V0.2.md`](../内部/cycle4-batch6-module-scoring-V0.2.md)（第 6 批 8 候选评分 + 5 入选 / CMS-02 mini-roadmap §4.4 来源）
- [[feedback_sprint20l_full_loop_complete]]（6 handler Apply 全 + 单测覆盖模式）
- [[feedback_dual_session_19t_continuous_validation]]（second e Reports/Dashboards 累积 / 本 sprint T-E1 第 18 次连续）
- [[reference_team_tech_stack]]（前端 DevExtreme + ExcelJS 默认）
- [[feedback_codex_0_carryover_8_sprint_record]]（51 Sprint 0 顺延记录 / 本 sprint 目标 52）
