# Sprint 20u 任务卡 V0.2（2026-05-19 cici 早晨拍板 ✅ 评分顺序应用 / 第 6 批 5 入选 第 1 个 sprint / CMS-01 库存看板 启动）

**Sprint**：20u（**第 6 批 5 入选第 1 个 sprint** / 评分顺序拍板分配第 1 / 紧续 Sprint 20p-20t 第 4 周期收尾 / 第 5 周期开局延续 + 第 6 批模块业务实施启动）
**主题**：**CMS-01 库存看板（22 分 / 评分顺序第 1）启动**
**节奏**：roadmap V0.2 §2.5 第 6 批分配 / 工作量 ~1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天
**性质**：**第 6 批 5 入选第 1 个 sprint / 业务实施 sprint**（vs Sprint 20p-20t 协调 / 试点 / 收尾性质 → Sprint 20u-20y 第 6 批业务实施性质）

**V0.2 升版要点**（cici 2026-05-19 评分顺序拍板应用）：

- **cici 拍板**：✅ 第 6 批 5 入选按评分顺序分配 5 sprint：
  * Sprint 20u → **CMS-01 库存看板**（22 分 / 1.5 PD）← 本 sprint
  * Sprint 20v → CMS-05 物资全景（22 分 / 1.5 PD）
  * Sprint 20w → LIFE-CYCLE 设备管理（21 分 / 1.5 PD / 含 2 设备缺口立修）
  * Sprint 20x → CMS-02 采购看板（20 分 / 1.5 PD）
  * Sprint 20y → WARN-V2 库存预警（19 分 / 1.5 PD）

---

## §1 基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2026-06-20（待 Sprint 20t D5 满后启动 / Q3 末 deadline 前置）|
| main 主线工作量 | ~1.5 PD（4 task / T-A1-A4 / 第 6 批业务实施性质提升工作量 vs 收尾 sprint）|
| second 副线工作量 | ~0.5 PD（2 task / T-E1-E2 / 前端配对）|
| wall-clock | 3-4 天（Day 1-3 业务实施 + Day 4 收尾 / 业务 sprint 节奏）|
| Sprint 性质 | **第 6 批 5 入选第 1 个业务实施 sprint**（CMS-01 库存看板 22 分入选优先级 P1）|
| 前置 Sprint | Sprint 20p-20t 第 4 周期 5 sprint 全闭环 done / Sprint 20t T-A3 第 5 周期 roadmap V0.1 起草 done |
| 后续 Sprint | Sprint 20v（第 6 批第 2 / CMS-05 物资全景）|
| Sprint 顺延目标 | **49 Sprint 0 顺延**（Sprint 20p 44 → 20t 48 → 20u **49**）|

---

## §2 Day 1-2 Task 占位（A 主轨 4 task / 总 ~1.5 PD）

### A 主轨（main 主代理 / CMS-01 库存看板业务实施 / 共 4 task / 1.5 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** CMS-01 backend skeleton（M1 / Application/Cms/InventoryDashboardAppService）| 0.3 | P0 | main 主代理 a | ① 新增 `modules/nova.supplycores/src/Nova.SupplyCores.Application/Cms/InventoryDashboardAppService.cs` ② endpoint：`/api/cms/inventory/overview` + `/api/cms/inventory/multi-dimension` ③ 复用现有 6 stock entity（StockMaster + StockLot + StockMovement + StockReservation + StockAdjustment + StockTransfer）+ Material upsert 数据源 ④ DTO 定义（InventoryOverviewDto + InventoryMultiDimensionDto）⑤ Permission 配置（`SupplyCoresPermissions.Cms.InventoryDashboard.Default`）⑥ Controller class 级 `[Authorize]`（吸取 Sprint 20q D-4 + 20p ProcurementDocument fbf4927 立修模式 / 不再漏） | Sprint 20t T-A2 第 4 周期产品 done + 6 stock entity production-ready | AppService + Controller + DTO 完整 / 2 endpoint 可调 / Permission 注册 / Authorize class 级齐备 |
| **T-A2** CMS-01 业务闭环（M2 / 多维度切片 + 库存周转率 + 预警联动）| 0.4 | P0 | main 主代理 a | ① 多维度切片（按组织 OrgUnit / 按物资类别 MaterialCategory / 按试点单位 / 按状态 StockState）② 库存周转率计算（30 天滚动 / SQL 聚合 + AppService 计算）③ 库存预警联动（接 WARN-V2 future endpoint / 现阶段读 ReportAlert R-10 / Sprint 20l done 基础）④ 跨组织 RBAC（沿用 Sprint 14a-16a cross-org-rbac 模式）⑤ 试点 5 单位真数据加载（恒大本部 + 物资公司 + 7 矿数据治理产物 / Sprint 20l-20m）⑥ 写到 `docs/internal/sprint-20u-cms-inventory-dashboard-business-closure.md` ≥ 100 行 | T-A1 backend skeleton + Sprint 20l ReportAlert R-10 + Sprint 20l-20m 数据治理产物 | 4 维度切片可视 / 周转率 SQL 验证 / 预警联动接通 / 试点 5 单位真数据加载通过 |
| **T-A3** CMS-01 单测 + 集成验收（M3+M4 / spawn 子代理 + E2E + Pre-Delivery Checklist）| 0.4 | P0 | main 主代理 a + 子代理 | ① backend 单测 ≥ 15 case（spawn 1 子代理 / 类 Sprint 20l 4 handler 73 测试 / 20m Wave 5 单测模板）② E2E spec（dashboard 加载 / 多维度切片 / 周转率 / 预警联动）③ Pre-Delivery Checklist（accessibility 4.5:1 / 44px touch / 键盘可达 / icon hint or aria-label / 反馈 150-300ms / 不用 emoji 做图标）④ 试点 5 单位真数据验收（PO 协调反馈窗口）⑤ 写到 `docs/internal/sprint-20u-cms-inventory-dashboard-acceptance.md` | T-A1+T-A2 done + second e T-E1 前端 done | 单测 ≥ 15 case 全绿 / E2E spec 4+ case / Pre-Delivery Checklist 6 项全 ✅ / 试点 5 单位真数据加载验收通过 |
| **T-A4** Codex Round 20 立修 + 复测 + V0.x 升版 + memory + Sprint 20u 收尾 commit | 0.4 | P0 | main 主代理 a | 标准收尾 + Codex Round 20 立修 + 复测 + 0 finding 收敛目标（接续 Sprint 20o Round 5 / Sprint 20p Round 12 / Sprint 20q-20t Round 13-19 累计 6 次 0 收敛连续）/ Sprint 20u 任务卡 V0.x 升版（教训 13 6 步模板）/ memory 升级（49 Sprint 0 顺延 + Sprint 20u 第 6 批第 1 个 CMS-01 库存看板完整闭环）/ roadmap V0.3 §2.6 修正（如需 / 第 6 批分配实施记录）/ Sprint 20u 收尾 commit | Sprint 20u T-A1-A3 全 commit 完成 | Codex 0 顺延 / V0.x 锁版 / memory commit / roadmap V0.4 §2.6 修正 done（如需）/ Sprint 20u 收尾 commit 1 个 |

**main 总：~1.5 PD**（vs Sprint 20p-20t ~1.0-1.3 PD 协调 / 试点性质 / 第 6 批业务实施性质 +0.2-0.5 PD 提升）

### E 副轨（second 主代理 e / CMS-01 前端配对 / 共 2 task / 0.5 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** CMS-01 前端 dashboard（second 配对）| 0.3 | pending | DevExtreme + Reports/Dashboards / `pages/cms-inventory-dashboard/App.tsx` ≥ 400 行 / 5-7 张图（库存总览 + 多维度切片 + 周转率趋势 + 预警联动 + 试点单位对比 + 物资类别分布 + 状态分布）/ brand tokens 严格 / ui-ux-pro-max Pre-Delivery Checklist / 类 [[feedback_dual_session_19t_continuous_validation]] Reports/Dashboards 累积 14+ 次模板复用 |
| **T-E2** CMS-01 前端 e2e + UI polish（second 自检）| 0.2 | pending | e2e spec 自动化（dashboard 加载 / 多维度切换 / 预警联动跳转）/ UI polish（brand-* 检查 / 响应式 / 加载状态 / 空状态 / 错误处理）/ 试点 5 单位真数据加载验证（与 main T-A3 配对） |

---

## §3 第 6 批模块 mini-roadmap M1-M4（CMS-01 库存看板）

| 阶段 | 内容 | PD | Day | 责任方 |
|---|---|---|---|---|
| **M1 backend skeleton** | AppService + Controller + DTO + Permission + Authorize / 6 stock entity + Material 数据源接通 | 0.3 | Day 1 | main T-A1 |
| **M2 业务闭环** | 4 维度切片 + 周转率（30 天滚动）+ 预警联动（接 R-10）+ 跨组织 RBAC + 试点 5 单位真数据 | 0.4 | Day 2 | main T-A2 |
| **M3 单测 + 前端** | backend 单测 ≥ 15 case（spawn 子代理）+ frontend `App.tsx` ≥ 400 行 / 5-7 张图（second 主轨） | 0.5 | Day 3 | main T-A3（part 单测）+ second e T-E1 |
| **M4 集成验收** | E2E spec + 试点 5 单位真数据加载 + Pre-Delivery Checklist（6 项）+ PO 反馈窗口 | 0.3 | Day 4 | main T-A3（part E2E）+ second e T-E2 |

---

## §4 触发条件

| 条件 | 内容 | 状态 |
|---|---|---|
| **C-1** | Sprint 20t D5 满（第 4 周期收尾 + 第 5 周期 roadmap V0.1 起草 done / 48 Sprint 0 顺延前置达成）| ⏳ 待 Sprint 20t D5 |
| **C-2** | cici 第 6 批分配 cici 拍板 ✅（**2026-05-19 评分顺序拍板 done**）| ✅ done |
| **C-3** | 6 stock entity production-ready + Material upsert 在仓（Sprint 20l-20m 数据治理产物 + 7 矿 + 恒大 + 物资公司 19 OrgUnit 在仓）| ✅ done |
| **C-4** | Sprint 20l ReportAlert R-10 done（预警联动基础 / WARN-V2 future endpoint 占位）| ✅ done |
| **C-5** | 48 Sprint 0 顺延维持（前置 Codex 健康度 + Sprint 20p-20t 第 4 周期累积达成）| ⏳ 待 Sprint 20t T-A4 |

**触发判断**：C-1 + C-5 待达成 / C-2-C-4 已 done / Sprint 20t D5 满后启动 Day 1

---

## §5 沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-19（main 整夜跑预先起草 / 占位 / 第 4 周期最后 sprint cutover 收尾 + 第 5 周期开局准备双重性质 / ~200 行）| main a 起草占位版 / 4 主轨 task ~1.0 PD（T-A1 NC cutover 实际日期拍板 + T-A2 采购合同业务闭环 done 验证 + T-A3 第 5 周期 roadmap V0.1 完整起草 + T-A4 Codex Round 20 立修）/ 2 副轨 ~0.6 PD / 触发条件：Sprint 20t D5 满 + cici NC cutover 拍板 + 采购合同业务闭环 + 39+ Sprint 0 顺延 |
| **V0.2** | **2026-05-19（cici 早晨拍板 ✅ 评分顺序分配第 6 批应用 / Sprint 20u 主题切换：CMS-01 库存看板启动）** | **cici 2026-05-19 评分顺序拍板第 6 批 5 入选分配 5 sprint 应用**：① **Sprint 20u 主题切换 ✅**（第 4 周期收尾 + 第 5 周期开局 → CMS-01 库存看板 22 分入选第 1 个 sprint 业务实施）② **T-A1-A4 重写**（T-A1 backend skeleton M1 / T-A2 业务闭环 M2 / T-A3 单测 + 集成验收 M3+M4 / T-A4 Codex Round 20 收尾）③ **M1-M4 mini-roadmap §3 完整**（每阶段 PD + Day + 责任方）④ **second 副轨 0.5 PD**（T-E1 前端 dashboard + T-E2 e2e + UI polish）⑤ **触发条件 5 条 §4**（C-2 done / C-1 C-5 待 Sprint 20t）⑥ 工作量 1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天 |

---

**起草人**：main 主代理 a（V0.1 2026-05-19 整夜跑 / V0.2 2026-05-19 cici 评分顺序拍板应用）
**预期 Sprint 20u Day 1 启动**：Sprint 20t D5 满后（~ 2026-06-20）
**Related**：
- [`Sprint-20t-任务卡-V0.1.md`](Sprint-20t-任务卡-V0.1.md)（前序 / 第 4 周期收尾 + 第 5 周期 roadmap V0.1 起草 / D5 满触发本 sprint）
- [`Sprint-20v-任务卡-V0.1.md`](Sprint-20v-任务卡-V0.1.md)（后序 / CMS-05 物资全景 / 评分顺序第 2）
- [`Sprint-20q-任务卡-V0.6.md`](Sprint-20q-任务卡-V0.6.md)（cici 第 6 批拍板 ✅ 评分顺序应用源 / V0.5 §V0.5 段记录）
- [`../内部/cycle4-batch6-module-scoring-V0.2.md`](../内部/cycle4-batch6-module-scoring-V0.2.md)（第 6 批 8 候选评分 + 5 入选 / mini-roadmap M1-M4 来源）
- [[feedback_sprint20l_full_loop_complete]]（6 handler Apply 全 + 单测覆盖模式 / 本 sprint T-A3 复用）
- [[feedback_sprint20m_full_loop_complete]]（4 子代理 73 测试模板 / 本 sprint T-A3 spawn 子代理参考）
- [[feedback_dual_session_19t_continuous_validation]]（second e Reports/Dashboards 14+ 次连续 / 本 sprint T-E1 第 15 次连续）
- [[reference_team_tech_stack]]（前端 DevExtreme + ExcelJS 默认 / 本 sprint T-E1 复用）
- [[feedback_codex_0_carryover_8_sprint_record]]（48 Sprint 0 顺延记录 / 本 sprint 目标 49）
