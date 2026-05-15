# Sprint 19m Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19m 验收演示脚本（方案 B 基础资料补完）
**配套：** [`Sprint-19m-任务卡-V0.2.md`](./Sprint-19m-任务卡-V0.2.md)

---

## 一、Sprint 19m 落地范围

按 V0.2 锁版（cici 方案 B 决策 — 基础资料补完），实际交付 **~3.0 PD**（vs V0.2 3-3.5 PD 接近下限节省）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（方案 B 基础资料补完）| `bf85e8a` | a | 0.2 |
| **D1-3** | E2E 扩展 8 spec（19l b 5 业务流 + 19m b 3 基础资料）+ path-trigger V0.3 实测填充 | `7456907` | **c** | 1.0 |
| **D1-3** | 基础资料补完 3 原型 React 化（base-archive + master-data-admin + tender-archive）19 files / +1526/-5 | `5794fb9` | **b** | 1.4 |

**测试基线**：
- 后端 1760 测试零 regression
- **dotnet build SupplyCores.slnx 0 errors** ✅
- **vite build 29 entries OK + brotli + 0 Circular** ✅（19j 16 + 19k 5 + 19l 5 + 19m 3 = 29）
- npm run lint 0 errors / 0 warnings ✅
- **npx playwright test --list → 38 tests in 20 files**（19g 4 + 19h 11 + 19l 10 + 19m 13 新）✅
- actionlint .github/workflows/*.yml 0 issues

---

## 二、Demo 演示路径

### 路径 A：基础资料补完 3 原型（10 分钟 — 核心高光）

1. **`/supplycores/base-archive`** — 基础档案（详设 02）
   - 4 tab：组织（TreeView 12 节点 + DataGrid）/ 仓库（10 含火工品专管）/ 仓位（10）/ 货位（30）
   - 仓库详情 Popup 三级嵌套
2. **`/supplycores/master-data-admin`** — 主数据管理（详设 03）
   - 4 tab：物料分类（TreeView 3 级 5/12/30）/ 编码规则（8）/ BOM（10 条 1 级展开）/ 单位换算（6）
3. **`/supplycores/tender-archive`** — 招标静态档案（详设 04 §4.10）
   - 3 tab：档案库（8 历史招标 + Popup 6 资料 + 7 审计）/ 分类（3）/ 法务模板（5）
   - 与 19l tender 业务流配套（招标档案静态版）

### 路径 B：E2E 扩展 8 spec（5 分钟）

- 5 19l 业务流 spec（tender / goods-receipt / payment-request / stocktake / alert-rules）
- 3 19m 基础资料 spec（base-archive / master-data-admin / tender-archive）
- 共 13 新 tests → **38 tests in 20 files**
- 容错 skip 机制保留（mock 数据无 row 不破坏 CI）

### 路径 C：双子代理 0 race 第 12 次稳定（5 分钟）

**19h+19i+19j+19k+19l+19m 累计 12 commits 全 0 race / 0 误纳**：

| # | Sprint | 子代理 | commit | race |
|---|---|---|---|---|
| 1-8 | 19h-19k | b/c | a07120b...bb70f0e | 0 race × 8 |
| 9-10 | 19l | b/c | d911347/98a6fd9 | 0 race × 2 |
| **11-12** | **19m** | **b/c** | **5794fb9/7456907** | **0 race × 2** |

**race 治理 [P0] 保留延续**（race-governance-downgrade-evaluation.md V0.1 §四 触发条件未达 — 19m 仍边界分离）

### 路径 D：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores`
2. `cd modules/nova.supplycores/frontend && npm run build` → **29 entries** + brotli + 0 Circular
3. `dotnet build SupplyCores.slnx` → 0 errors
4. `npx playwright test --list` → **38 tests in 20 files**
5. 浏览器 → 29 React 页面 + 4 大分组菜单 + 基础档案分组（material-master + contract + supplier-performance + **base-archive + master-data-admin + tender-archive 3 新**）

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 方案 B 基础资料补完 + E2E 扩展 + 19l P3 消化 | ✅ 全闭环 |
| 2. 30 累计技术债 | #29 基础资料主轨 + #30 E2E 副轨 + 19l P3 旁路 | ✅ 全闭环 |
| 3. 工时预算 | V0.2 3-3.5 PD | **3.0 PD 实际** 下限节省 |
| 4. 子代理并行 | b 基础资料 + c E2E + P3 | ✅ **0 race 第 12 次**（19h-19m 累计 12 commits）|
| 5. Codex 19l 评审 | 已完成（c244193 A 级 0 P1+P2 18a 模式）| ✓ |
| 6. 6 业务方反馈 | 未到位 → 顺延 19n | ⏳ cici 推动 |
| 7. CI/CD secrets | 未配 → 顺延 19n | ⏳ cici 自助 |
| 8. 基础资料 3 原型范围 | base-archive + master-data-admin + tender-archive | ✅ cici 方案 B 完整 |
| 9. race [P0] 保留 | 续观察 19n+ 同模块场景 | ⏳ 19n+ 实测 |

### Sprint 19m 特殊性

**首次"基础资料补完"独立 Sprint**：
- cici 19l 期间发现缺口 → 方案 B 19m 主轨补完
- 3 原型覆盖详设 02 / 03 / 04 三大基础资料域
- 业务复杂度低于业务流原型 — 1.4 PD 实际（预算 1.5）

**双子代理 0 race 第 12 次稳定**（19h-19m 6 Sprint）：
- 同模块场景仍未出现 — [P0] 保留延续

**Codex 0 顺延 P2 连续记录维持**：
- 20 Sprint + 19m 期望保持（待 Codex 19m 评审 19n）

---

## 四、Sprint 19n 候选方向

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **6 endpoint mock → real**（持续顺延）| 业务方反馈到位 | 2.5-3 PD | 5 业务方 ≥ 3 反馈 |
| **CI/CD 真实运行 + Codex hook 实测**（持续顺延）| cici 配 secrets 后首次 PR | 0.9 PD | cici 自助 |
| **UI-3 phase 3 续 5-10 原型**（持续顺延）| prototype/ 剩 21 候选 | 2-3 PD（5 个）| 业务价值评估 |
| **基础资料业务字段补完**（19m 顺延）| 业务方反馈 + Mock 字段调整 | 1-2 PD | cici 与业务方对接 |
| **C / G** | 详设 09 看板 / 06 库存超储 | 5-10 PD | 无 |

**V0.1 倾向**：cici 19n 启动前评估业务方反馈 + secrets 配置状态决定路径

---

## 五、Sprint 19m Codex 评审待触发

**触发提示词**：
"评审 Sprint 19m 共 3 commits（`bf85e8a` V0.2 锁版方案 B / `7456907` c E2E 8 spec + path-trigger V0.3 / `5794fb9` b 基础资料 3 原型）— 重点关注基础资料 3 原型设计 + path-trigger V0.3 实测填充 + 双子代理 0 race 第 12 次稳定"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 方案 B 基础资料补完 3.0 PD + 4 演示路径 + 双子代理 0 race 第 12 次稳定（19h-19m）+ 29 entries + 38 tests in 20 files + Codex 19m 触发提示 |
