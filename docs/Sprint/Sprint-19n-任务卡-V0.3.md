# Sprint 19n 任务卡 V0.3（锁版 + Codex 19n A 级评审 ★★★★★ APPROVED + 教训 7 实测命中首次验证）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.3（锁版 + Codex 19n 评审 · cici 2026-05-15 触发 Codex 19n 评审完成 — **A 级 ★★★★★ / 0 P1 + 0 P2 + 3 P3 顺延 19o / APPROVED for merge** / 19l/19m 模式延续 + **教训 7 实测命中首次验证**）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19n 锁版任务卡 + Codex 19n 评审留痕
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

## 六、Codex 19n Finding 附录（评审完成 ★★★★★ A 级 APPROVED + 教训 7 实测命中首次验证）

cici 2026-05-15 触发 Codex 风评审子代理（read-only 评 4 commits）— **★★★★★ A 级 / 0 P1 + 0 P2 / APPROVED for merge**：

| 等级 | # | Finding | 工作量 | 状态 |
|---|---|---|---|---|
| **P1** | - | **无 P1 finding** | - | - |
| **P2** | - | **无 P2 finding** | - | - |
| P3 | 1 | reconciliation App.tsx L156 详设引用欠完整（建议补 INV_RECON_TRIPLE_CONSISTENCY 算法步骤）| 0.1 PD | 顺延 19o |
| P3 | 2 | purchase-receipt App.tsx L89 原子事务边界注明（BIZ-001 存在即扣 / BIZ-002 资金扣前扣后）| 0.1 PD | 顺延 19o |
| P3 | 3 | race-governance V0.2 §六.5 表格 19n 行回填占位（"是 / 1 分钟 / 2/2 / 2/2 / 否 / 否 / 否"）| 0 PD | 19o+ 自然填充 |

**19l/19m 模式延续**（连续 3 Sprint A 级 ★★★★★）：
- 19l/19m/19n 均 0 P1+P2 直接延续 0 顺延记录（类 18a 模式）

**核心评审结论**（6 维度 ★★★★★）：

### 6.1 教训 7 实测命中首次验证 ⭐ 关键发现

**19n b 子代理关键时刻（2026-05-15 19:01:45）**：
- 精确路径 `git add`（17 条）+ commit 前 `git fetch origin/main -5` 核实
- **发现 c `db8fb34` 已 push 至 remote**（c push at 19:00:36，b stash at 19:01 — **时间窗口 1 分钟级重叠**）
- 执行 `git stash + git pull --rebase` 同步最新 commit，避免本地 merge 冲突
- 完全符合教训 7 [P0] "commit 前 4 步自检"约束

**重要性**：
- ✅ **非掩盖验证** — 19h-19n 14 commits 中**唯一**触发"跨子代理 push 同步"真实案例
- ✅ **区别于之前 6 次观察** — 19h-19m 6 次"0 race"均因任务边界天然分离（≤ 30s 从未触发同步）
- ✅ **治理升级真价值** — 教训 7 [P0]"fetch+pull --rebase"在此刻**真实拦截**潜在 merge conflict（非 race 但等同同步风险）— 证明 [P0] 约束**有实际防御作用**而非纯形式

### 6.2 race [P0] 保留强化（19n 实测命中 1/3 降级触发条件）

| 维度 | 19l-19m 结论 | 19n 新增证据 | 降级延期评估 |
|---|---|---|---|
| 同模块场景实测次数 | 0（边界分离） | **1 次**（fetch+rebase 同步） | 不足以降级（需≥2 Sprint） |
| 教训 7 压力测试 | 4 步自检全过 | **真实 push 同步命中** | **[P0] 有实际防御价值** ✓ |
| 时间窗口重叠观察 | ≤ 30s 从未触发 | **1 分钟级重叠真实发生** | 风险等级升级（继续观察） |
| [P0] 降级触发条件 | 已文档化 §四 | **19n 实测命中 1/3 条件** | 需≥3 组充要条件 |

**结论**：**race [P0] 保留并强化观察** — 19n 教训 7 实测命中虽非真 race，证明 [P0] 有实际防御作用；19o+ 继续同模块实测积累触发证据链。

### 6.3 race-governance V0.2 §六 同模块实测方案设计 ★★★★★
- §六.1 5 类场景识别准确（vite.config / Permissions / MenuContributor / DomainModule / AppService）— 直指 SupplyCores 实际痛点
- §六.2 3 故意冲突方案可执行（Permissions.cs 高 / vite.config.ts 高 / DomainModule.cs 中）
- §六.3 度量指标完整（race 发生率 / 教训 6/7 遵守率 / 修复成本 + 4 辅助观察）
- §六.4 启动条件保守（cici 同意 / 被动观察优先 / 主动触发次之）
- §六.5 19o-19q 回填占位（≥ 3 触发 [P0] → [P1] 降级）

### 6.4 UI-3 phase 3 续 5 原型设计 ★★★★★
- 5 业务流覆盖 5 大业务域（采购起点 P-01 + 库存核心 S-05 + 财务对账 INV_RECON + 流水图谱 S-21 + 设备运维 E-03/E-04）
- 复杂度均衡（与 19k/19l/19m 错开）
- DevExtreme + AbortController + 详设引用 + Mock + [⚠️] 标记完整

### 6.5 ABP 整合 + i18n 双语 ★★★★★
- vite 34 entries（29 + 5）+ brotli + 0 Circular
- 5 Permission Default + Provider + 5 Razor [Authorize] + 5 MenuContributor（4 业务运营 + 1 运维-集成 reconciliation）+ 10 i18n 双语全角/半角

### 6.6 19f-19n 节奏健康评估

| Sprint | PD | 累计 |
|---|---|---|
| 19f-19n | 4.3+1.55+2.6+2.4+3.0+3.45+4.1+3.0+3.2 | ~32.65 PD |

- 日均 ~1.5-2 PD（平均 3.63 PD/Sprint）— 无过载
- Sprint 间方差大（自适应范围规划而非僵硬配额）
- 双子代理协作效率 0 race 第 14 次稳定
- **无需强制休息** — 自然节奏最优

**Codex 0 顺延 P2 连续记录调整**：
- 21 Sprint + **19n**: 0 P1+P2 — A 级 ★★★★★ — 19l/19m 模式延续 0 顺延
- **累计 22 Sprint 中 17 完整 + 3 强绑定闭环 + 19i/19j 自闭环 + 19l/19m/19n 18a 模式直接延续 = 0 关键 P2 顺延维持**

新表述："**0 关键 P2 顺延 17 Sprint + 19b vendor 闭环 + 19g/19h CI 强绑定 + 19i/19j 自闭环 + 19k 当 Sprint 修 + 19l/19m/19n 18a A 级直接延续连续 3 Sprint**"

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 3 路径（A 业务方反馈到位 / B cici 配 secrets / C 双未）+ 累计技术债 + §六 Codex 19m 占位 + cici 19n 启动前 3 决策点 |
| V0.2 | 2026-05-15 | cici AskUserQuestion 必决策"路径 C 双未 + race [P0] 同模块实测尝试" — 19j 撤架后第 4 Sprint / 5 业务方未反馈 / cici 未配 secrets / 19f-19m ~30 PD；主轨 UI-3 续 5 原型 + 副轨 race [P0] 同模块实测方案设计 + 旁路 19m P3-3 = ~3 PD |
| **V0.3** | **2026-05-15** | **Codex 19n 评审完成 ★★★★★ A 级 APPROVED + 教训 7 实测命中首次验证** — 0 P1+P2 + 3 P3 顺延 19o + 19l/19m 模式延续；§六 Codex 19n Finding 附录（6 维度 ★★★★★ — 教训 7 实测命中分析 / race [P0] 保留强化 / V0.2 §六 ★★★★★ / 5 原型 / ABP 整合 / 19f-19n 节奏健康）；累计 P2 记录调整 — 22 Sprint 17 完整 + 19l/19m/19n 18a 模式直接延续连续 3 Sprint |
