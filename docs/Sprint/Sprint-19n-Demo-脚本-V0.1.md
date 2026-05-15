# Sprint 19n Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19n 验收演示脚本
**配套：** [`Sprint-19n-任务卡-V0.2.md`](./Sprint-19n-任务卡-V0.2.md)

---

## 一、Sprint 19n 落地范围（路径 C + race [P0] 同模块实测方案设计）

按 V0.2 锁版（cici 路径 C + race [P0] 同模块实测尝试），实际交付 **~3.2 PD**（vs V0.2 3 PD 接近 + 缓冲）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | 19m V0.3 + 19n V0.2 锁版 | `57c428f` | a | 0.2 |
| **D1-3** | race-governance V0.2 §六 同模块实测方案设计（5 子段 / 不真触发只设计）| `db8fb34` | **c** | 0.4 |
| **D1-3** | UI-3 phase 3 续 5 原型 React 化（requirement-list / purchase-receipt / reconciliation / inventory-flow / maintenance-order）27 files / +2504/-6 | `6f9fdc8` | **b** | 2.2 |

**测试基线**：
- 后端 1760 测试零 regression
- **dotnet build 0 errors** ✅
- **vite build 34 entries**（19j 16 + 19k 5 + 19l 5 + 19m 3 + 19n 5 = 34）+ brotli + 0 Circular ✅
- npm run lint 0 errors / 0 warnings ✅
- npx playwright test --list 38 tests in 20 files（未破坏）✅

---

## 二、Demo 演示路径

### 路径 A：UI-3 phase 3 续 5 原型（10 分钟 — 核心高光）

5 业务流原型覆盖：
1. **`/supplycores/requirement-list`** — 采购起点 P-01（6 状态机 + 跨矿合并 + 应急通道）
2. **`/supplycores/purchase-receipt`** — 库存核心 S-05（4 件事原子事务 BIZ-001/BIZ-002）
3. **`/supplycores/reconciliation`** — 财务核心 INV_RECON（三对一致 / 3 数据源 tabs + diff 工作台）
4. **`/supplycores/inventory-flow`** — 流水图谱 S-21（7 类型 filter + 出入调拨 3 tabs）
5. **`/supplycores/maintenance-order`** — 设备运维 E-03/E-04（40% 阈值 + 加签）

### 路径 B：race-governance V0.2 §六 同模块实测方案设计（5 分钟）

5 子段：
- §六.1 5 类同模块场景识别（vite.config / Permissions / Menu / DomainModule / AppService — 含 race 概率 + 出现频率）
- §六.2 3 故意冲突触发方案（Permissions.cs 高 / vite.config.ts 高 / DomainModule.cs 中）
- §六.3 4 度量指标 + 4 辅助观察（race 发生率 / 教训 6/7 遵守率 / 修复成本）
- §六.4 5 保守启动条件（cici 同意 / 被动观察优先 / 主动触发次之 / 降级阈值 / 兜底）
- §六.5 19o-19q 回填占位（≥ 3 触发 [P0] → [P1] 降级评估）

### 路径 C：双子代理 0 race 第 14 次稳定（5 分钟）

**19h+19i+19j+19k+19l+19m+19n 累计 14 commits 全 0 race**：
- 19n b commit `6f9fdc8` 教训 7 实测命中：commit 前 fetch 发现 c `db8fb34` 已 push → stash + pull --rebase 同步（治理升级 V1.4 自我应用 100%）
- 19n 仍边界分离（b src/pages / c docs/internal）— race [P0] 保留延续观察

### 路径 D：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores`
2. `cd modules/nova.supplycores/frontend && npm run build` → **34 entries** + brotli + 0 Circular
3. `dotnet build SupplyCores.slnx` → 0 errors
4. `npm run lint` → 0 errors / 0 warnings
5. `npx playwright test --list` → 38 tests in 20 files
6. 浏览器 → 34 React 页面 + 5 大分组菜单

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 路径 C 双未 + race [P0] 同模块实测方案 | ✅ 双轨闭环 |
| 2. 工时预算 | ~3 PD | **3.2 PD 实际** |
| 3. 子代理并行 | b UI-3 续 + c race-governance V0.2 | ✅ 0 race 第 14 次 |
| 4. Codex 19m 评审 | 已完成（57c428f V0.3 ★★★★★ A 级 APPROVED）| ✓ |
| 5-7. 业务方 / secrets / UI-3 | 持续顺延 19o | ⏳ cici 推动 |
| 8. race [P0] 同模块实测 | 方案设计 V0.2 §六（不真触发）| ✅ 19o+ 实测启动 |

### Sprint 19n 特殊性

**Codex 19j 升级建议 → 19k 反向 → 19l 保留 → 19m 评估 → 19n 方案设计** — 5 Sprint 完整治理债演进闭环：
- 19j 提出降级 [P0] → [P1]
- 19k 反向验证"治理升级与低 race 率无因果关联"
- 19l/19m A 级评审一致保留 [P0]
- 19n 不真触发 race（保守）但落地同模块实测方案设计（19o+ 实测可启动）

**双子代理 0 race 第 14 次稳定**（19h-19n 7 Sprint 14 commits）：
- 19n b 教训 7 实测命中（fetch 发现 c push → rebase 同步）— 治理升级真生效
- 边界分离仍然主导（cici 路径 C 保守）

---

## 四、Sprint 19o 候选方向

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **6 endpoint mock → real** | 业务方反馈到位 | 2.5-3 PD | 5 业务方 ≥ 3 反馈 |
| **CI/CD 真实运行 + Codex hook 实测** | cici 配 secrets | 0.9 PD | cici 自助 |
| **race [P0] 同模块实测启动**（19n 顺延）| 按 V0.2 §六.2 方案启动 1 实测 | 0.5 PD | cici 同意触发 |
| **UI-3 phase 3 续 5-10 原型** | prototype/ 剩 16 候选 | 2-3 PD | 业务价值评估 |
| **基础资料业务字段补完**（19m 顺延）| 业务方反馈后 DTO 调整 | 1-2 PD | 业务方反馈 |

**V0.1 倾向**：cici 19o 启动前评估业务方反馈 + secrets 配置 + race 实测意愿

---

## 五、Sprint 19n Codex 评审待触发

**触发提示词**：
"评审 Sprint 19n 共 3 commits（`57c428f` 19m V0.3 + 19n V0.2 锁版 / `db8fb34` c race-governance V0.2 §六 / `6f9fdc8` b UI-3 续 5 原型）— 重点关注 race-governance V0.2 §六 同模块实测方案 + 双子代理 0 race 第 14 次（含 b 教训 7 实测命中 fetch+rebase）"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 路径 C 双未 + race [P0] 同模块实测方案设计 + UI-3 续 5 原型 3.2 PD + 4 演示路径 + 双子代理 0 race 第 14 次稳定（19h-19n 7 Sprint）+ Codex 19n 触发提示 |
