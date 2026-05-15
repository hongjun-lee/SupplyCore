# Sprint 19n 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 AskUserQuestion 必决策"路径 C 双未 + race [P0] 同模块实测尝试" — 19j 撤架后第 4 Sprint / 5 业务方未反馈 / cici 未配 secrets / 19f-19m 累计 ~30 PD）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19n 锁版任务卡
**配套：** [`Sprint-19m-任务卡-V0.3.md`](./Sprint-19m-任务卡-V0.3.md) §六 Codex 19m A 级评审 + [`Sprint-19m-Demo-脚本-V0.1.md`](./Sprint-19m-Demo-脚本-V0.1.md)

---

## 一、Sprint 19n 候选方向

### 持续顺延项（19h-19m 累计）

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **6 endpoint mock → real** | 业务方反馈到位 mock → real | 2.5-3 PD | 5 业务方 ≥ 3 反馈 |
| **CI/CD 真实运行 + Codex hook 实测** | cici 配 secrets + 首次 PR run | 0.9 PD | cici 自助配 secrets |
| **UI-3 phase 3 续 5-10 原型** | prototype/ 剩 21 候选 | 2-3 PD（5 个）| 业务价值评估 |
| **基础资料业务字段补完**（19m 顺延）| 业务方反馈 + Mock 字段调整 | 1-2 PD | cici 业务方对接 |
| **E2E 扩展 19m 3 基础资料 + 6 业务流 cover**（持续）| 9 spec 接通真 endpoint | 1-1.5 PD | mock → real 部分到位 |
| **race 治理升级 [P0] → [P1] 同模块场景实测** | 19n+ 任务设计 b/c 同改 Application | 0.5 PD | race-governance V0.1 §四 触发 |
| **C / G** | 详设 09 看板 / 06 库存超储 | 5-10 PD | 无 |

---

## 二、推荐策略：视 cici 19n 启动前状态评估

**V0.1 倾向**：
- **路径 A**（业务方 ≥ 3 反馈 + cici 配 secrets）：主轨 6 endpoint mock → real 2.5-3 + 副轨 CI 真实 0.9 + 旁路 E2E 集成 1-1.5 = **~5 PD**
- **路径 B**（仅 cici 配 secrets）：主轨 CI 真实 + Codex hook 实测 0.9 + 副轨 UI-3 续 + race [P0] 实测 ~3 PD
- **路径 C**（仍双未）：主轨 UI-3 续 + 副轨 race [P0] 同模块实测尝试 ~3 PD

**cici 19n 启动前 3 决策点**：
1. 6 业务方反馈状态
2. CI/CD secrets 自助配状态
3. UI-3 续 vs 基础资料业务字段补完 优先级

---

## 三、累计技术债（Sprint 19n 必修）

详 17a-19m 累计技术债清单（参考 19m V0.2 §三）。19n 闭环目标：#29 基础资料 ✅（19m 已完成）+ #30 E2E 副轨 ✅（19m 8 spec 已完成）

**19n 新候选**：
- #31 基础资料业务字段 mock → real（业务方反馈后调整 base-archive / master-data-admin / tender-archive DTO 字段）
- #32 UI-3 phase 3 续候选优先级评估（cici 与 PO 协商）

---

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19n 主线方向 | **路径 C 双未 + race [P0] 同模块实测尝试**（cici 2026-05-15 AskUserQuestion 必决策）— 主轨 UI-3 续 5 原型 + 副轨 race [P0] 同模块实测方案设计 + 旁路 19m P3-3 path-trigger 补注 |
| 2 | 累计技术债 | #18 UI-3 续主轨 + #28 race [P0] 同模块实测副轨（race-governance V0.1 §四 触发评估）+ 19m P3-3 旁路 |
| 3 | 工时预算 | **UI-3 续 5 原型 2-3 PD + race 同模块实测方案设计 0.5 PD + 19m P3-3 0.05 PD + 缓冲 = 3 PD** |
| 4 | 子代理并行策略 | **主代理 a 协调 + V0.2 锁版 + 19m P3-3 path-trigger 补注 + 子代理 b UI-3 续 5 原型（src/pages 5 新 + ABP 整合）+ 子代理 c race [P0] 同模块实测方案设计文档（race-governance V0.2）** sweet spot 2x |
| 5 | Codex 19m 评审 | **已完成** ★★★★★ A 级 / 0 P1+P2 / APPROVED for merge（19l 模式延续）|
| 6 | 6 业务方反馈状态 | **持续顺延 19o**（cici 推动 + mock 数据继续）|
| 7 | CI/CD secrets 自助配 | **持续顺延 19o**（cici 自助）|
| 8 | race 治理 [P0] 同模块实测 | **19n 旁路方案设计**（race-governance V0.2 §六 加同模块实测计划 — 不真触发只设计）；19o+ 主代理 a 故意设计冲突任务实测 |
| 9 | spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.4 + spawn_template V1.1 §八/§九（19h-19m 12 commits 0 race 稳定）|
| 10 | 任务边界设计原则 | spawn 前评估任务边界天然分离（19n 仍 b src/pages / c docs/internal — 0 文件交集）|
| 11 | 19f-19m 累计 ~30 PD | cici 提示工作量信号 — 19n 路径 C 缩范围 3 PD 保持节奏 |

---

## 五、Sprint 19n 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 6 业务方反馈持续延期（≥ 4 Sprint 19j-19m）| 🟡 中 | 路径 C 缩范围；mock 数据继续支撑 Demo |
| 2 | CI/CD secrets cici 未自助配 | 🟢 低 | 路径 C 不依赖 |
| 3 | UI-3 phase 3 续 21 候选业务价值评估持续延期 | 🟡 中 | cici 与 PO 协商；可分批做 |
| 4 | race 治理 [P0] 实测条件难以触发（任务边界天然分离倾向）| 🟢 低 | 19n+ 主代理 a 故意设计同模块任务尝试触发 |

---

## 六、Codex 19m Finding 附录（占位 · 待评审完成补全）

> 占位 — Codex 19m 评审完成后补全。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 3 路径（A 业务方反馈到位 / B cici 配 secrets / C 双未）+ 累计技术债 + §六 Codex 19m 占位 + cici 19n 启动前 3 决策点 |
| **V0.2** | **2026-05-15** | **cici AskUserQuestion 必决策"路径 C 双未 + race [P0] 同模块实测尝试"** — 19j 撤架后第 4 Sprint / 5 业务方未反馈 / cici 未配 secrets / 19f-19m ~30 PD；主轨 UI-3 续 5 原型 + 副轨 race [P0] 同模块实测方案设计 + 旁路 19m P3-3 = **~3 PD**；§四 锁版决策 + 决策 11 19f-19m 累计工作量信号 |
