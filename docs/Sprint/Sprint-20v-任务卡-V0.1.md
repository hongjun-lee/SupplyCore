# Sprint 20v 任务卡 V0.1（2026-05-19 cici 早晨拍板 ✅ 评分顺序应用 / 第 6 批 5 入选 第 2 个 sprint / CMS-05 物资全景 启动）

**Sprint**：20v（**第 6 批 5 入选第 2 个 sprint** / 评分顺序拍板分配第 2 / 紧续 Sprint 20u CMS-01 库存看板收尾 → CMS-05 物资全景启动）
**主题**：**CMS-05 物资全景（22 分 / 评分顺序第 2 / 与 CMS-01 同分但排序第 2）启动**
**节奏**：roadmap V0.2 §2.5 第 6 批分配 / 工作量 ~1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天
**性质**：**第 6 批 5 入选第 2 个 sprint / 业务实施 sprint**（试点 5 单位汇总视图战略级 / cici Q3 A 30+ 单位扩大后需求扩张 / 集团 PO 反馈强）

**V0.1 起草要点**（cici 2026-05-19 评分顺序拍板应用）：

- **cici 拍板**：✅ 第 6 批 5 入选按评分顺序分配 5 sprint（Sprint 20u CMS-01 / 20v CMS-05 / 20w LIFE-CYCLE / 20x CMS-02 / 20y WARN-V2）
- **CMS-05 物资全景**：跨 5 试点单位汇总视图 / cici Q3 A 30+ 单位扩大后需求扩张 / 集团 PO 反馈强 / 复用 cross-org-rbac 模式（Sprint 14a-16a）

---

## §1 基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2026-06-25（待 Sprint 20u D4 满后启动）|
| main 主线工作量 | ~1.5 PD（4 task / T-A1-A4 / 业务实施性质）|
| second 副线工作量 | ~0.5 PD（2 task / T-E1-E2 / 前端配对）|
| wall-clock | 3-4 天（Day 1-3 业务实施 + Day 4 收尾）|
| Sprint 性质 | **第 6 批 5 入选第 2 个业务实施 sprint**（CMS-05 物资全景 22 分入选优先级 P1）|
| 前置 Sprint | Sprint 20u D4 满 + CMS-01 库存看板 production-ready + cici 反馈窗口 done |
| 后续 Sprint | Sprint 20w（第 6 批第 3 / LIFE-CYCLE 设备管理 + 2 设备缺口立修）|
| Sprint 顺延目标 | **50 Sprint 0 顺延**（Sprint 20u 49 → 20v **50** 里程碑）|

---

## §2 Day 1-2 Task 占位（A 主轨 4 task / 总 ~1.5 PD）

### A 主轨（main 主代理 / CMS-05 物资全景业务实施 / 共 4 task / 1.5 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** CMS-05 backend skeleton（M1 / Application/Cms/MaterialPanoramaAppService）| 0.3 | P0 | main 主代理 a | ① 新增 `modules/nova.supplycores/src/Nova.SupplyCores.Application/Cms/MaterialPanoramaAppService.cs` ② endpoint：`/api/cms/material/panorama` + `/api/cms/material/cross-org-summary` ③ 跨 5 试点单位汇总（恒大本部 + 物资公司 + 7 矿 / 19 OrgUnit）④ DTO 定义（MaterialPanoramaDto + CrossOrgSummaryDto + MaterialCategoryAggregateDto）⑤ Permission 配置（`SupplyCoresPermissions.Cms.MaterialPanorama.Default`）⑥ Controller class 级 `[Authorize]`（沿用 Sprint 20u 模式 / 不再漏） | Sprint 20u T-A4 done + Material upsert 数据治理产物（Sprint 20l-20m）+ 19 OrgUnit 在仓 | AppService + Controller + DTO 完整 / 2 endpoint 可调 / 跨 5 试点单位汇总数据加载 / Authorize class 级齐备 |
| **T-A2** CMS-05 业务闭环（M2 / 跨组织 RBAC + 30+ 单位扩展 + 物资分类树 + 多维聚合）| 0.4 | P0 | main 主代理 a | ① 跨组织 RBAC 演进（cross-org-rbac 模式复用 Sprint 14a-16a 经验 / OrgUnit 数据隔离 + 跨组织汇总例外路径）② 30+ 单位扩展支持（cici Q3 A 拍板 / 数据治理 OrgUnit 19+ 扩展 / 性能 ≤ 2s 加载）③ 物资分类树（MaterialCategory 层级 / 树形展开 / 多级聚合）④ 多维聚合（按物资类别 / 按组织 / 按状态 / 按使用周期）⑤ 试点 5 单位真数据加载（恒大本部 + 物资公司 + 7 矿）⑥ 写到 `docs/internal/sprint-20v-cms-material-panorama-business-closure.md` ≥ 100 行 | T-A1 backend skeleton + Sprint 14a-16a cross-org-rbac 模式 + Sprint 20l-20m 数据治理产物 | 跨组织 RBAC 隔离测试通过 / 30+ 单位扩展性能 ≤ 2s / 物资分类树展开 / 多维聚合 4 维度可视 / 试点 5 单位真数据加载通过 |
| **T-A3** CMS-05 单测 + 集成验收（M3+M4 / spawn 子代理 + E2E + 跨组织数据隔离测试 + 集团 PO 反馈窗口）| 0.4 | P0 | main 主代理 a + 子代理 | ① backend 单测 ≥ 20 case（跨组织 RBAC + 物资分类树 + 多维聚合 / spawn 1 子代理 / 类 Sprint 20l-20m 单测模板）② 跨组织数据隔离测试（A 组织看不到 B 组织数据 / 例外路径例外测试）③ E2E spec（全景视图加载 / 多维聚合切片 / 物资分类树展开）④ Pre-Delivery Checklist（6 项）⑤ 集团 PO 反馈窗口（cici 协调 / 战略级看板 PO 优先级高）⑥ 写到 `docs/internal/sprint-20v-cms-material-panorama-acceptance.md` | T-A1+T-A2 done + second e T-E1 前端 done | 单测 ≥ 20 case 全绿 / 跨组织数据隔离测试通过 / E2E spec 5+ case / Pre-Delivery Checklist 6 项全 ✅ / 集团 PO 反馈 ≥ 3 项 |
| **T-A4** Codex Round 21 立修 + 复测 + V0.x 升版 + memory + Sprint 20v 收尾 commit | 0.4 | P0 | main 主代理 a | 标准收尾 + Codex Round 21 立修 + 复测 + 0 finding 收敛目标（接续 Sprint 20o Round 5 / Sprint 20p Round 12 / Sprint 20q-20u Round 13-20 累计 7 次 0 收敛连续）/ Sprint 20v 任务卡 V0.x 升版（教训 13 6 步模板）/ memory 升级（50 Sprint 0 顺延里程碑 + Sprint 20v 第 6 批第 2 个 CMS-05 物资全景完整闭环）/ roadmap V0.3 §2.6 修正（如需 / 第 6 批分配实施进度）/ Sprint 20v 收尾 commit | Sprint 20v T-A1-A3 全 commit 完成 | Codex 0 顺延 / V0.x 锁版 / memory commit / **50 Sprint 0 顺延里程碑达成 ✅** / Sprint 20v 收尾 commit 1 个 |

**main 总：~1.5 PD**（vs Sprint 20u 1.5 PD / 第 6 批 5 sprint 业务实施工作量稳定 / 跨组织 RBAC 复杂度 +0.1 / 抵消单模块复杂度 -0.1）

### E 副轨（second 主代理 e / CMS-05 前端配对 / 共 2 task / 0.5 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** CMS-05 前端全景视图（second 配对）| 0.3 | pending | DevExtreme + Reports/Dashboards / `pages/cms-material-panorama/App.tsx` ≥ 600 行 / 跨组织全景视图 / 7+ 张图（物资分类树 + 跨组织对比 + 30+ 单位扩展 + 多维聚合 + 战略级看板 / 集团 PO 视角）/ brand tokens 严格 / ui-ux-pro-max Pre-Delivery Checklist / 类 Sprint 20u CMS-01 dashboard 模式扩展 |
| **T-E2** CMS-05 前端 e2e + UI polish + 跨组织隔离视图测试（second 自检）| 0.2 | pending | e2e spec 自动化（全景加载 / 多维切片 / 物资分类树展开 / 跨组织切换）/ UI polish + 跨组织隔离视图测试（A 用户登录看不到 B 组织数据 / 例外路径测试 / 集团 PO 跨组织视角）/ 试点 5 单位真数据加载验证（与 main T-A3 配对） |

---

## §3 第 6 批模块 mini-roadmap M1-M4（CMS-05 物资全景）

| 阶段 | 内容 | PD | Day | 责任方 |
|---|---|---|---|---|
| **M1 backend skeleton** | AppService + Controller + DTO + Permission + Authorize / 跨 5 试点单位 + 19 OrgUnit 汇总 query | 0.3 | Day 1 | main T-A1 |
| **M2 业务闭环** | 跨组织 RBAC + 30+ 单位扩展 + 物资分类树 + 多维聚合 + 试点 5 单位真数据 | 0.4 | Day 2 | main T-A2 |
| **M3 单测 + 前端** | backend 单测 ≥ 20 case + 跨组织数据隔离测试（spawn 子代理）+ frontend `App.tsx` ≥ 600 行 / 7+ 张图（second 主轨） | 0.5 | Day 3 | main T-A3（part 单测）+ second e T-E1 |
| **M4 集成验收** | E2E spec + 跨组织隔离验证 + Pre-Delivery Checklist（6 项）+ 集团 PO 反馈窗口 ≥ 3 项 | 0.3 | Day 4 | main T-A3（part E2E）+ second e T-E2 |

---

## §4 触发条件

| 条件 | 内容 | 状态 |
|---|---|---|
| **C-1** | Sprint 20u D4 满（CMS-01 库存看板 production-ready + 49 Sprint 0 顺延前置达成）| ⏳ 待 Sprint 20u D4 |
| **C-2** | cici 第 6 批分配 cici 拍板 ✅（**2026-05-19 评分顺序拍板 done**）| ✅ done |
| **C-3** | Sprint 14a-16a cross-org-rbac 模式 production-ready（跨组织 RBAC 演进基础）| ✅ done |
| **C-4** | Material upsert + 19 OrgUnit + Sprint 20l-20m 数据治理产物在仓（跨 5 试点单位数据源）| ✅ done |
| **C-5** | 49 Sprint 0 顺延维持（前置 Codex 健康度 + Sprint 20u T-A4 累积达成）| ⏳ 待 Sprint 20u T-A4 |

**触发判断**：C-1 + C-5 待达成 / C-2-C-4 已 done / Sprint 20u D4 满后启动 Day 1

---

## §5 沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.1** | **2026-05-19（cici 早晨拍板 ✅ 评分顺序分配第 6 批应用 / Sprint 20v V0.1 起草）** | **cici 2026-05-19 评分顺序拍板第 6 批 5 入选分配 5 sprint 应用 V0.1 起草**：① **Sprint 20v 主题：CMS-05 物资全景启动**（22 分入选 / 评分顺序第 2 / 与 CMS-01 同分但排序第 2）② **T-A1-A4 完整**（T-A1 backend skeleton M1 / T-A2 业务闭环 M2 / T-A3 单测 + 集成验收 M3+M4 / T-A4 Codex Round 21 + 50 Sprint 0 顺延里程碑收尾）③ **M1-M4 mini-roadmap §3 完整**（每阶段 PD + Day + 责任方）④ **second 副轨 0.5 PD**（T-E1 前端全景视图 + T-E2 e2e + UI polish + 跨组织隔离视图测试）⑤ **触发条件 5 条 §4**（C-2-C-4 done / C-1 C-5 待 Sprint 20u）⑥ 工作量 1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天 / **50 Sprint 0 顺延里程碑目标** |

---

**起草人**：main 主代理 a（2026-05-19 cici 评分顺序拍板应用 V0.1 起草）
**预期 Sprint 20v Day 1 启动**：Sprint 20u D4 满后（~ 2026-06-25）
**Related**：
- [`Sprint-20u-任务卡-V0.2.md`](Sprint-20u-任务卡-V0.2.md)（前序 / 第 6 批第 1 / CMS-01 库存看板 / D4 满触发本 sprint）
- [`Sprint-20w-任务卡-V0.1.md`](Sprint-20w-任务卡-V0.1.md)（后序 / 第 6 批第 3 / LIFE-CYCLE 设备管理 + 2 设备缺口立修）
- [`Sprint-20q-任务卡-V0.6.md`](Sprint-20q-任务卡-V0.6.md)（cici 第 6 批拍板 ✅ 评分顺序应用源）
- [`../内部/cycle4-batch6-module-scoring-V0.2.md`](../内部/cycle4-batch6-module-scoring-V0.2.md)（第 6 批 8 候选评分 + 5 入选 / CMS-05 mini-roadmap §4.2 来源）
- [[feedback_sprint20l_full_loop_complete]]（6 handler Apply 全 + 单测覆盖模式）
- [[feedback_dual_session_19t_continuous_validation]]（second e Reports/Dashboards 累积 / 本 sprint T-E1 第 16 次连续）
- [[reference_team_tech_stack]]（前端 DevExtreme + ExcelJS 默认）
- [[feedback_codex_0_carryover_8_sprint_record]]（49 Sprint 0 顺延记录 / 本 sprint 目标 50 里程碑）
