# Sprint 20w 任务卡 V0.1（2026-05-19 cici 早晨拍板 ✅ 评分顺序应用 + 2 设备缺口 P0 立修 / 第 6 批 5 入选 第 3 个 sprint / LIFE-CYCLE 设备管理 启动）

**Sprint**：20w（**第 6 批 5 入选第 3 个 sprint** / 评分顺序拍板分配第 3 / 紧续 Sprint 20v CMS-05 物资全景收尾 → LIFE-CYCLE 设备管理启动 / **含 N-Q2 A 主推 + 2 设备缺口 P0 立修**）
**主题**：**LIFE-CYCLE 设备管理（21 分 / 评分顺序第 3 / N-Q2 A 主推）启动 + 2 设备缺口 P0 立修**
**节奏**：roadmap V0.2 §2.5 第 6 批分配 / 工作量 ~1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天
**性质**：**第 6 批 5 入选第 3 个 sprint / 业务实施 sprint + 2 设备缺口 P0 同日立修**（汤云龙 H1 next quarter 主轴 / 详设 07 V1.0b 已 production-ready ≥ 95% / 仅补强 + 试点上线为主）

**V0.1 起草要点**（cici 2026-05-19 评分顺序拍板 + 2 设备缺口 A 拍板应用）：

- **cici 拍板**：✅ 第 6 批 5 入选按评分顺序分配 5 sprint（Sprint 20u CMS-01 / 20v CMS-05 / 20w LIFE-CYCLE / 20x CMS-02 / 20y WARN-V2）
- **cici 拍板**：✅ 2 设备缺口 cici A 拍板 Sprint 20w P0 同日立修（**EquipmentsController class 级 [Authorize] + EquipmentDepreciations Controller 补全**）
- **LIFE-CYCLE 设备管理**：Equipment 域成熟度 4.8/5 / Sprint 5b/6b/7b 三 sprint 完整闭环 / Sprint 20q D1 设备 pre-audit 183 行已确认 / 详设 07 V1.0b 完整 / 仓内基础设施 ready ≥ 95%

---

## §1 基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2026-06-30（待 Sprint 20v D4 满后启动）|
| main 主线工作量 | ~1.5 PD（5 task / T-A1-A5 / 含 2 设备缺口 P0 立修 / +1 task vs 标准 4 task）|
| second 副线工作量 | ~0.5 PD（2 task / T-E1-E2 / 前端配对 + 详设升版）|
| wall-clock | 3-4 天（Day 1 立修 + Day 1-3 业务实施 + Day 4 收尾）|
| Sprint 性质 | **第 6 批 5 入选第 3 个业务实施 sprint + 2 设备缺口 P0 立修**（LIFE-CYCLE 21 分入选优先级 P2）|
| 前置 Sprint | Sprint 20v D4 满 + CMS-05 物资全景 production-ready + 50 Sprint 0 顺延里程碑达成 |
| 后续 Sprint | Sprint 20x（第 6 批第 4 / CMS-02 采购看板）|
| Sprint 顺延目标 | **51 Sprint 0 顺延**（Sprint 20v 50 → 20w **51**）|

---

## §2 Day 1-2 Task 占位（A 主轨 5 task / 总 ~1.5 PD / **含 T-A1 2 设备缺口 P0 立修**）

### A 主轨（main 主代理 / LIFE-CYCLE 设备管理业务实施 + 2 设备缺口立修 / 共 5 task / 1.5 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 2 设备缺口 P0 立修（Day 1 优先 / cici A 拍板 / 不增加 Sprint 20q PD）| 0.2 | **P0 立修** | main 主代理 a | **2 设备缺口立修（吸取 Sprint 20q D1 设备 pre-audit 183 行 + cici A 拍板）**：① **EquipmentsController class 级 `[Authorize(SupplyCoresPermissions.EquipmentLifecycle.Default)]`**（同 Contracts 20q D-4 fbf4927 模式 / 同 ProcurementDocument 20p）② **EquipmentDepreciations Controller 补全**（暴露折旧 Controller / 沿用 Equipments 模式 / 含基本 CRUD endpoint / Authorize class 级）③ Permission 配置补全（`SupplyCoresPermissions.EquipmentDepreciation.Default` 已在仓 grep 验证）④ 单测补 ≥ 2 case（Authorize 鉴权 + Controller endpoint）⑤ 写到 `docs/internal/sprint-20w-equipment-2-gaps-fix.md` | Sprint 20q D1 设备 pre-audit + cici A 拍板 | 2 缺口立修 done / Authorize class 级齐备 / EquipmentDepreciations Controller 暴露 + 4+ endpoint / 单测 2+ case |
| **T-A2** LIFE-CYCLE backend skeleton（M1 / Application/Equipments/EquipmentLifecycleDashboardAppService）| 0.3 | P0 | main 主代理 a | ① 新增 `modules/nova.supplycores/src/Nova.SupplyCores.Application/Equipments/EquipmentLifecycleDashboardAppService.cs` ② endpoint：`/api/equipment/lifecycle/dashboard` + `/api/equipment/lifecycle/cross-module-summary` ③ 整合 OEE + 折旧 + 维修 + 租赁 4 模块（EquipmentOee + EquipmentDepreciation + RepairApplication + LeaseContract）④ DTO 定义（EquipmentLifecycleDashboardDto + CrossModuleSummaryDto）⑤ Permission 配置（`SupplyCoresPermissions.Equipment.LifecycleDashboard.Default`）⑥ Controller class 级 `[Authorize]` | T-A1 设备缺口立修 done + Sprint 5b/6b/7b 4 模块 production-ready | AppService + Controller + DTO 完整 / 2 endpoint 可调 / 跨 4 模块整合数据加载 |
| **T-A3** LIFE-CYCLE 业务闭环（M2 / 月度盘点 + NC 凭证 Md001 联动 + 扫码进出场）| 0.4 | P0 | main 主代理 a | ① 月度盘点流程 entity + 状态机（EquipmentMonthlyInventory + 状态 [Draft/Submitted/Approved/Closed]）② 与 NC 凭证 Md001 联动（设备折旧凭证 / 沿用 Sprint 19r 凭证导出双轨架构）③ 设备扫码进出场（PDA 集成预留 / endpoint `/api/equipment/lifecycle/scan-entry` + `/scan-exit`）④ 与第 6 批模块联动评估（CMS-01 库存看板设备引用 / 详设 N-Q6）⑤ 写到 `docs/internal/sprint-20w-life-cycle-business-closure.md` ≥ 100 行 | T-A2 backend skeleton + Sprint 19r 凭证导出双轨 + 详设 07 V1.0b | 月度盘点状态机 + NC 凭证 Md001 联动 + 扫码进出场 endpoint / 验证报告 ≥ 100 行 |
| **T-A4** LIFE-CYCLE 单测 + 集成验收（M3+M4 / spawn 子代理 + E2E + 汤云龙业务方对齐 + 详设升版）| 0.3 | P0 | main 主代理 a + 子代理 | ① backend 单测 ≥ 18 case（spawn 1 子代理 / 月度盘点状态机 + NC 凭证联动 + 扫码进出场 + 跨模块整合 / 类 Sprint 6b/7b E2E 模板）② E2E spec（dashboard 加载 / 跨模块切片 / 月度盘点流程 / NC 凭证联动）③ Pre-Delivery Checklist（6 项）④ 汤云龙业务方对齐（cici 协调 / H1 next quarter 主轴）⑤ 详设升版（`详设-07-设备与设备租赁详细设计-V1.1.md`）⑥ 写到 `docs/internal/sprint-20w-life-cycle-acceptance.md` | T-A1-T-A3 done + second e T-E1 前端 done | 单测 ≥ 18 case 全绿 / E2E spec 5+ case / 详设 07 升版 V1.1 / 汤云龙对齐反馈 ≥ 3 项 |
| **T-A5** Codex Round 22 立修 + 复测 + V0.x 升版 + memory + Sprint 20w 收尾 commit | 0.3 | P0 | main 主代理 a | 标准收尾 + Codex Round 22 立修 + 复测 + 0 finding 收敛目标（接续 Sprint 20o Round 5 / Sprint 20p Round 12 / Sprint 20q-20v Round 13-21 累计 8 次 0 收敛连续）/ Sprint 20w 任务卡 V0.x 升版（教训 13 6 步模板）/ memory 升级（51 Sprint 0 顺延 + Sprint 20w 第 6 批第 3 个 LIFE-CYCLE 完整闭环 + 2 设备缺口立修 done）/ roadmap V0.3 §2.6 修正（如需）/ Sprint 20w 收尾 commit | Sprint 20w T-A1-T-A4 全 commit 完成 | Codex 0 顺延 / V0.x 锁版 / memory commit / Sprint 20w 收尾 commit 1 个 |

**main 总：~1.5 PD**（vs Sprint 20u/20v 1.5 PD / 5 task vs 4 task 但每 task PD 略缩 / 2 设备缺口立修 0.2 PD 内化 / Equipment 域 4.8/5 高 production-ready 度抵消）

### E 副轨（second 主代理 e / LIFE-CYCLE 前端配对 + 详设升版 / 共 2 task / 0.5 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** LIFE-CYCLE 前端深化（second 配对）| 0.3 | pending | DevExtreme + Reports/Dashboards / `pages/equipment-lifecycle/App.tsx` 深化（现 364 行 → 600+ 行）/ 跨模块 dashboard（OEE + 折旧 + 维修 + 租赁）/ 7+ 张图 / 月度盘点流程 UI / 扫码进出场 UI 占位 / brand tokens 严格 / ui-ux-pro-max Pre-Delivery Checklist |
| **T-E2** LIFE-CYCLE 前端 e2e + UI polish + 详设升版协助（second 自检）| 0.2 | pending | e2e spec 自动化（dashboard 加载 / 跨模块切片 / 月度盘点 / 扫码进出场）/ UI polish / 详设升版协助（详设 07 V1.0b → V1.1 / 与 main T-A4 配对 / 月度盘点 + 扫码进出场新增章节起草） |

---

## §3 第 6 批模块 mini-roadmap M1-M4（LIFE-CYCLE 设备管理）

| 阶段 | 内容 | PD | Day | 责任方 |
|---|---|---|---|---|
| **M0 2 设备缺口 P0 立修** | EquipmentsController [Authorize] + EquipmentDepreciations Controller 补 + Permission + 单测 | 0.2 | Day 1（优先） | main T-A1 |
| **M1 backend skeleton** | AppService + Controller + DTO + Permission + Authorize / OEE + 折旧 + 维修 + 租赁 4 模块整合 | 0.3 | Day 1-2 | main T-A2 |
| **M2 业务闭环** | 月度盘点状态机 + NC 凭证 Md001 联动 + 扫码进出场 + 跨模块联动评估 | 0.4 | Day 2-3 | main T-A3 |
| **M3 单测 + 前端** | backend 单测 ≥ 18 case（spawn 子代理）+ frontend `App.tsx` 深化 600+ 行（second 主轨） | 0.5 | Day 3 | main T-A4（part 单测）+ second e T-E1 |
| **M4 集成验收** | E2E spec + 详设 07 升版 V1.1 + 汤云龙对齐 + Pre-Delivery Checklist（6 项） | 0.3 | Day 4 | main T-A4（part E2E）+ second e T-E2 |

---

## §4 触发条件

| 条件 | 内容 | 状态 |
|---|---|---|
| **C-1** | Sprint 20v D4 满（CMS-05 物资全景 production-ready + 50 Sprint 0 顺延里程碑达成）| ⏳ 待 Sprint 20v D4 |
| **C-2** | cici 第 6 批分配 cici 拍板 ✅ + 2 设备缺口 A 拍板 ✅（**2026-05-19 评分顺序拍板 + 2 设备缺口 A 拍板 done**）| ✅ done |
| **C-3** | Equipment 域 4 模块 production-ready（OEE + 折旧 + 维修 + 租赁 / Sprint 5b/6b/7b 完整闭环 / 详设 07 V1.0b）| ✅ done |
| **C-4** | Sprint 20q D1 设备 pre-audit 183 行 done（2 设备缺口确认 / cici A 拍板源）| ✅ done |
| **C-5** | 50 Sprint 0 顺延维持（前置 Codex 健康度 + Sprint 20v T-A4 累积达成）| ⏳ 待 Sprint 20v T-A4 |

**触发判断**：C-1 + C-5 待达成 / C-2-C-4 已 done / Sprint 20v D4 满后启动 Day 1

---

## §5 沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.1** | **2026-05-19（cici 早晨拍板 ✅ 评分顺序分配第 6 批应用 + 2 设备缺口 A 拍板 Sprint 20w 立修 / Sprint 20w V0.1 起草）** | **cici 2026-05-19 评分顺序拍板第 6 批 5 入选分配 5 sprint + 2 设备缺口 A 拍板应用 V0.1 起草**：① **Sprint 20w 主题：LIFE-CYCLE 设备管理启动 + 2 设备缺口 P0 立修**（21 分入选 / 评分顺序第 3 / N-Q2 A 主推）② **T-A1-A5 完整**（T-A1 **2 设备缺口 P0 立修 / EquipmentsController [Authorize] + EquipmentDepreciations Controller 补** / T-A2 backend skeleton M1 / T-A3 业务闭环 M2 / T-A4 单测 + 集成验收 + 详设升版 / T-A5 Codex Round 22 收尾）③ **M0-M4 mini-roadmap §3 完整**（M0 立修 / M1-M4 业务实施）④ **second 副轨 0.5 PD**（T-E1 前端深化 364→600+ 行 + T-E2 e2e + 详设升版协助）⑤ **触发条件 5 条 §4**（C-2-C-4 done / C-1 C-5 待 Sprint 20v）⑥ 工作量 1.5 PD 主线 + 0.5 PD second / wall-clock 3-4 天 / **51 Sprint 0 顺延目标** |

---

**起草人**：main 主代理 a（2026-05-19 cici 评分顺序 + 2 设备缺口 A 拍板应用 V0.1 起草）
**预期 Sprint 20w Day 1 启动**：Sprint 20v D4 满后（~ 2026-06-30）
**Related**：
- [`Sprint-20v-任务卡-V0.1.md`](Sprint-20v-任务卡-V0.1.md)（前序 / 第 6 批第 2 / CMS-05 物资全景 / D4 满触发本 sprint）
- [`Sprint-20x-任务卡-V0.1.md`](Sprint-20x-任务卡-V0.1.md)（后序 / 第 6 批第 4 / CMS-02 采购看板）
- [`Sprint-20q-任务卡-V0.6.md`](Sprint-20q-任务卡-V0.6.md)（cici 第 6 批拍板 ✅ + 2 设备缺口 A 拍板源 / V0.5 §V0.5 段记录）
- [`../内部/cycle4-batch6-module-scoring-V0.2.md`](../内部/cycle4-batch6-module-scoring-V0.2.md)（第 6 批 8 候选评分 + 5 入选 / LIFE-CYCLE mini-roadmap §4.3 来源）
- [`../内部/sprint-20q-equipment-pre-audit.md`](../内部/sprint-20q-equipment-pre-audit.md)（Sprint 20q D1 设备 pre-audit 183 行 / 2 设备缺口确认源 / Equipment 域 4.8/5 评分）
- [`07-设备与设备租赁详细设计-V1.0b.md`](../详细设计/07-设备与设备租赁详细设计-V1.0b.md)（详设 07 V1.0b / 本 sprint T-A4 升版 V1.1）
- [[feedback_sprint20l_full_loop_complete]]（6 handler Apply 全 + 单测覆盖模式）
- [[feedback_dual_session_19t_continuous_validation]]（second e Reports/Dashboards 累积 / 本 sprint T-E1 第 17 次连续）
- [[reference_voucher_storage_pattern]]（凭证存储模式 / 本 sprint T-A3 NC 凭证 Md001 联动复用）
- [[feedback_codex_0_carryover_8_sprint_record]]（50 Sprint 0 顺延记录 / 本 sprint 目标 51）
