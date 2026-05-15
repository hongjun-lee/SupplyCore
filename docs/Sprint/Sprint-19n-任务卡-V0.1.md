# Sprint 19n 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19n 起步草案
**配套：** [`Sprint-19m-Demo-脚本-V0.1.md`](./Sprint-19m-Demo-脚本-V0.1.md)

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

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19n 主线方向 | **视 cici 启动前状态** — 业务方反馈 ≥ 3 → 路径 A / cici 配 secrets → 路径 B / 仍双未 → 路径 C |
| 2 | 工时预算 | 路径 A ~5 PD / 路径 B ~3 PD / 路径 C ~3 PD |
| 3 | 子代理并行策略 | 视路径 — sweet spot 2x |
| 4 | Codex 19m 评审 | **待 cici 触发**（提示词详 19m Demo §五）|
| 5 | 6 业务方反馈状态 | **19n 启动前 cici 评估** |
| 6 | CI/CD secrets 自助配 | **cici 19n D0 自助** |
| 7 | UI-3 phase 3 续优先级 | **cici 与 PO 协商业务价值** |
| 8 | race 治理 [P0] 同模块实测时机 | 19n+ 任务设计触发（b/c 同改 Application） |
| 9 | spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.4 + spawn_template V1.1 §八/§九 |
| 10 | 任务边界设计原则 | spawn 前评估任务边界天然分离 |

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
