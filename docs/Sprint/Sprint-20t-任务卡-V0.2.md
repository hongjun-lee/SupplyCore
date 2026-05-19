# Sprint 20t 任务卡 V0.1（2026-05-19 main 整夜跑预先起草 / 占位 / 触发条件 = Sprint 20s D5 满 + cici 采购合同拍板）

**Sprint**：20t（紧续 20s D5 收口 → **第 4 周期 20p-20t 5 Sprint 收尾 + 采购合同启动 + 第 5 周期启动准备**）
**主题**：**采购合同启动（第 4 周期收尾）+ Cycle 4（第 5 周期）启动准备**
**节奏**：roadmap V0.2 → V0.3 应用 cici 拍板 / 工作量 ~1.0 PD 主线 + ~0.6 PD second / wall-clock 2-3 天
**性质**：**采购合同新模块启动 sprint + 第 4 周期 5 Sprint 收尾 sprint + 第 5 周期 roadmap 起草双重 sprint**（vs Sprint 20o 纯收尾 / vs Sprint 20p 协调启动）
**V0.1 起草要点**（占位 / 待 Sprint 20s D5 满 + cici 采购合同拍板触发 V0.2）：
- **采购合同字段补强**：C-02 字段补强从 Sprint 9a 顺延（BondState/ExpiryDate 之外的详设字段陆续补齐）/ 主合同 + 子合同 + 履约表三表 backend skeleton
- **业务闭环 Apply**：Approval 接通（Sprint 20r 审批工作流引擎复用）+ 月结反结模式复用（NC 真联调 Sprint 20r-20s 已激活基础）
- **第 5 周期 roadmap 起草**：顺延 long-term roadmap V0.2 → V0.3 应用 cici 拍板（Q4 + Q1 next year 战略方向 / 仅战略 + 大方向 / 不做 5 Sprint 详细规划）
- **触发条件保留**：Sprint 20s D5 满 / cici 采购合同拍板 / Cycle 3 第 4 周期 36+ Sprint 0 顺延维持

---

## 一、基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2026-06-10（待 Sprint 20s D5 满后启动 / 实际日期取决于 Sprint 20p-20s 进度 / Q3 末 deadline 前置）|
| main 主线工作量 | ~1.0 PD（4 task / T-A1-A4）|
| second 副线工作量 | ~0.6 PD（2 task / T-E1+T-E2）|
| wall-clock | 2-3 天（Day 1-2 主轨 + Day 1-3 副轨并行 / 收尾 sprint 性质快速节奏）|
| Sprint 性质 | 采购合同新模块启动 + 第 4 周期收尾 + 第 5 周期 roadmap 起草（三重性质）|
| 前置 Sprint | Sprint 20p Day 1 done / Sprint 20q D5 done / Sprint 20r D5 done / Sprint 20s D5 done |
| 后续 Sprint | Sprint 20u（第 5 周期开局 / V0.x 待 T-A3 roadmap V0.3 起草）|
| 第 4 周期总顺延目标 | **47 Sprint 0 顺延**（Sprint 20p 44 → 20q 45 → 20r 46 → 20s 47 前置 → Sprint 20t 收尾达成）|

---

## 二、Day 1-2 Task 占位（A 主轨 4 task / 总 ~1.0 PD）

### A 主轨（main 主代理 / 4 task）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 采购合同 backend skeleton（C-02 字段补强从 Sprint 9a 顺延）| 0.3 | P0 | main 主代理 a | 主合同（PurchaseContract）+ 子合同（PurchaseSubContract）+ 履约表（PurchaseContractFulfillment）三表 Domain Entity + EF Configuration + Migration / C-02 字段补强从 Sprint 9a 顺延（BondState/ExpiryDate 之外详设字段陆续补齐 / 合同方 / 履约期 / 金额 / 货币 / 付款条款）/ AppService skeleton（CRUD + 状态机）/ schema `p`（purchase）| Sprint 20q 合同模块基础 + C-02 字段补强详设 V0.x | Domain Entity 3 表完整 + Migration + AppService skeleton + 6+ 字段补齐 |
| **T-A2** 采购合同业务闭环 Apply（Approval 接通 / 月结反结模式复用）| 0.3 | P0 | main 主代理 a | Approval 接通（Sprint 20r 审批工作流引擎 / `IApprovalGateway` 复用 / SubmitForApproval + RejectAsync + CancelAsync 三方法）/ 月结反结模式复用（Sprint 20r-20s NC 真联调已激活 / NC 凭证回写 BIZ-MR / RED / PAY 等接口）/ Approval 状态回写到 PurchaseContract.ApprovalState / Hangfire 任务触发 NC 推送 | T-A1 backend skeleton + Sprint 20r 审批工作流引擎 + Sprint 20s NC 真联调 5 接口实测 | 采购合同 → 审批 → NC 凭证回写完整业务流跑通 / Approval 三状态切换 / 月结反结模式复用验证 |
| **T-A3** Cycle 4 第 5 周期 roadmap V0.1 起草（long-term roadmap V0.2 → V0.3 应用 cici 拍板）| 0.2 | P1 | main 主代理 a | 类 `sprint-20p-20t-roadmap.md` 模板 / 写到 `docs/internal/sprint-20u-20y-roadmap.md` V0.1 / **范围**：cici Q4 B 推荐（仅战略方向 + Q4-Q1 大方向 / 不做 5 Sprint 详细规划）/ **应用 cici 拍板**：long-term roadmap V0.2 → V0.3 升版应用（20+ cici 拍板项 / 5 AI SOP 全 ready / Q1 next year 6 角色 3 wave）/ **涵盖**：① 战略定位（第 4 周期 production 上线后 → 第 5 周期 production 后扩展）② 4 工作线延续判断 ③ 候选主轴方向（M-13/S-15/E-13 扩展模块 + AI 能力深化 + 跨系统集成 + 多租户）④ 立即动作清单 ⑤ 关键里程碑 ⑥ 风险评估 | T-A1 + T-A2 收口 / long-term roadmap V0.2 拍板项陆续应用 | roadmap V0.1 ≥ 150 行 / 含战略方向 + Q4-Q1 大方向 + 4 工作线延续判断（详细 5 Sprint 规划留 V0.2 cici 拍板）|
| **T-A4** Codex Round 19 立修 + 复测 | 0.2 | P0 | main 主代理 a | 标准收尾 / Codex Round 19 finding 全立修（前置 Sprint 20s 已 Round 18 收敛假设 / Round 19 = Sprint 20t 收尾轮）/ V0.x 升版（教训 13 6 步模板）/ memory 升级（**47 Sprint 0 顺延达成** + 第 4 周期 20p-20t 完整闭环 + 采购合同启动 + 第 5 周期启动准备）| Sprint 20t T-A1 + T-A2 + T-A3 全 commit 完成 | **47 Sprint 0 顺延达成 ✅** / V0.x 锁版 / memory commit / Round 19 = 0 finding 收敛（目标）|

**main 总：~1.0 PD**（4 task / vs Sprint 20o 1.6 PD 收尾 / vs Sprint 20p 1.0 PD 启动 / 20t 性质混合但工作量保持轻量化 / cutover 实战推到 Sprint 20u+ 第 5 周期 / 20t 仅启动 + 收尾不做 cutover）

### E 副轨（second e / 2 task / 总 ~0.6 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** 采购合同前端（second 配对）| 0.4 | DevExtreme DataGrid 列表 + 详情 form（主合同 + 子合同 tab + 履约表 tab）/ Approval 状态展示 + NC 凭证下载 / brand tokens + ui-ux-pro-max checklist / 类 Sprint 20p ProcurementDocument 前端模板 |
| **T-E2** 第 6 批前端 5 候选全 done 收尾（second）| 0.2 | main V0.2 §第 6 批 5 候选评分（库存 / 采购 / 合同 / 审批 / 数据治理 监控）/ second e 收尾 5 候选 walk-through page 完整化 + UI polish + e2e smoke / 类 Sprint 20n part 2 试点反馈修正模板 |

**second 总：~0.6 PD**（2 task / Day 1-3 与主轨并行 / 不阻塞主轨收尾）

### D 顺延说明

- ~~D 线 NC/财务接口真联调~~：**Sprint 20r-20s 已激活 / Sprint 20t T-A2 采购合同业务闭环 Apply 复用 / 不再顺延**
- **production deployment cutover 实战**：推迟到 Sprint 20u+ 第 5 周期开局（V0.2 拍板时确认 / 20t 仅启动采购合同 + 收尾不做 cutover）
- 第 5 周期（20u-20y）roadmap 详细规划：T-A3 仅起草 V0.1 战略方向 / V0.2 cici 拍板细化

---

## 三、触发条件（V0.1 锁版前置）

### 3.1 必须达成（硬触发条件）

- ⏳ **Sprint 20s D5 满**（NC 真联调 5 接口实测验收 + 审批闭环 + runbook V0.3 实战修正 全 done）
- ⏳ **cici 采购合同拍板**（V0.x 待答 / 含合同方 / 履约期 / 金额字段 / 子合同结构 / 付款条款 / 与采购单关联模式）
- ⏳ **Cycle 3 第 4 周期 36+ Sprint 0 顺延维持**（Sprint 20p 44 → 20q 45 → 20r 46 → 20s 47 前置 全 done）

### 3.2 建议达成（软触发条件 / 不阻塞但建议）

- ⏳ Sprint 20q 合同模块基础已 production-ready（采购→合同关联 + 合同模块字段基础）
- ⏳ Sprint 20r 审批工作流引擎 production-ready（IApprovalGateway 接口稳定 + 三业务接入模板）
- ⏳ Sprint 20s NC 真联调 5 接口实测验收（BIZ-MR / RED / 007 / PAY / PAY-BATCH 全 production-ready）
- ⏳ long-term roadmap V0.2 cici 20+ 拍板项陆续应用到位（T-A3 V0.3 升版基础）
- ⏳ 5 AI SOP 30 天 onboarding 全 ready（main 整夜跑 2026-05-17→19 已完成 / Sprint 20u+ 招聘准备）

### 3.3 触发条件检查清单（V0.2 启动前 main 主代理 a 复核）

- [ ] Sprint 20s 真正收口达成（commit + memory + V0.x 锁版）
- [ ] cici 采购合同拍板（V0.x 问答记录）
- [ ] 47 Sprint 0 顺延达成（Sprint 20s T-A6 collateral）
- [ ] Sprint 20q + 20r + 20s 三 Sprint 累计前置条件 grep 验证
- [ ] long-term roadmap V0.2 拍板项整理（T-A3 V0.3 升版输入清单）

---

## 四、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-19（main 整夜跑预先起草 / 占位 / 触发条件 = Sprint 20s D5 满 + cici 采购合同拍板）| main a 起草 / Sprint 20t 任务卡占位版 / **主题切换：采购合同启动（第 4 周期收尾）+ Cycle 4（第 5 周期）启动准备**（vs V0.2 历史版本 production deployment cutover 推迟到 Sprint 20u+ 第 5 周期开局）/ 4 task 主轨 ~1.0 PD（T-A1 采购合同 backend skeleton + T-A2 业务闭环 Apply + T-A3 第 5 周期 roadmap V0.1 起草 + T-A4 Codex Round 19 立修）/ 2 task 副轨 ~0.6 PD（T-E1 前端 + T-E2 第 6 批 5 候选收尾）/ wall-clock 2-3 天 / 触发条件：Sprint 20s D5 满 + cici 采购合同拍板 + Cycle 3 第 4 周期 36+ Sprint 0 顺延维持 / 目标 **47 Sprint 0 顺延达成**（第 4 周期完整闭环里程碑）|
| V0.2（计划）| Sprint 20s 收口后 cici 采购合同拍板 | cici 采购合同字段拍板回填 §二（T-A1 字段补强清单完整化）/ Sprint 20p-20s 实际数据回填 / long-term roadmap V0.2 拍板项整理输入 T-A3 / 1c 模块隔离表确认（main T-A1+A2 涉及 `modules/nova.supplycores/src/` p schema + Approval gateway / second e T-E1 涉及 frontend 采购合同模块）/ V0.2 锁版启动 Day 1 |

---

**Created**: 2026-05-19 main 整夜跑预先起草 → V0.1 占位 / main 主代理 a / 第 4 周期 20p-20t 5 Sprint 收尾 + 采购合同启动 sprint + 第 5 周期 roadmap 起草

**Status**: ⏳ V0.1 占位 / 不 git add / 不 commit / main 收口 / 待 Sprint 20s D5 满 + cici 采购合同拍板触发 V0.2

**Related**:
- [`Sprint-20s-任务卡-V0.2.md`](Sprint-20s-任务卡-V0.2.md)（前序 / NC 真联调 5 接口实测 + 审批闭环 + runbook V0.3 实战修正 / D5 满触发本 Sprint）
- [`Sprint-20r-任务卡-V0.2.md`](Sprint-20r-任务卡-V0.2.md)（前前序 / 审批工作流引擎 + NC 真联调启动 D 线激活）
- [`Sprint-20q-任务卡-V0.3.md`](Sprint-20q-任务卡-V0.3.md)（前前前序 / 合同模块 + 采购→合同关联 / 本 Sprint T-A1 基础）
- [`Sprint-20p-任务卡-V0.3.md`](Sprint-20p-任务卡-V0.3.md)（第 4 周期开局 / ProcurementDocument 试点验证）
- [`Sprint-20o-任务卡-V0.4.md`](Sprint-20o-任务卡-V0.4.md)（第 3 周期收尾模板参考 / 同收尾 sprint 模板）
- [`Sprint-20t-任务卡-V0.2.md`](Sprint-20t-任务卡-V0.2.md)（历史 V0.2 版本 / production deployment cutover 主题 / 本 V0.1 主题切换为采购合同启动 + cutover 推迟到 Sprint 20u+ 第 5 周期）
- [[feedback_codex_0_carryover_8_sprint_record]]（43 Sprint 0 顺延记录 / 第 4 周期目标 47 Sprint）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 / 第 4 周期采购合同扩展）
- [[project_r05_simplification_owed_to_sprint9]]（C-02 字段补强从 Sprint 9a 顺延 / 本 Sprint T-A1 应用）
- [[feedback_main_overnight_cross_day_2026_05_18_19]]（main 整夜跑预先起草模式 / 本 V0.1 占位即整夜跑产出）
- [[feedback_sprint20p_day1_full_loop_complete]]（第 4 周期协调试点开局模板）
