# Sprint 19a-19n Retrospective V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · 9 Sprint 完整复盘（数据驱动 / 反模式识别 / 教训沉淀）
**触发**：cici 切 effort=max + AskUserQuestion 选 C+A 路径（暂停 UI-3 续 + 复盘 + Roadmap + cici 协调）

---

## 一、9 Sprint 数据汇总（19a-19n 顺时）

> 注：19f 起为重点统计周期（含 A2' 撤架 / Codex 评审 / race 治理升级）

### 1.1 PD 工时分布

| Sprint | 主线方向 | 实际 PD | vs 预算 | 关键决策 |
|---|---|---|---|---|
| 19a | B 副轨 21 模板审批中心 + 双子代理 sweet spot | 3.35 | - | - |
| 19b | A2' NC + UI MVP + 模块化 frontend | - | - | cici "模块化要求"反馈 |
| 19c | UI-2 完整化 + StockBalance + L1+L2 OAuth2 | 2.9 | - | - |
| 19d | UI-3 phase 1 4 React + UI-3-DEBT + **撤 A2' 主轨** | 2.5 | vs 8-10 节省 70% | cici 选 1 撤主轨 |
| 19e | ABP multi-page 重构 + UI-STYLE 品牌色合并 | 2.8 | vs 3-4 节省 | cici 同意推荐方案 A |
| 19f | UI-3 phase 2 5 + UI-FIX + STYLE-OPT + **5 fix 同事评审** | 4.3 | vs 5.6-7.6 节省 26-46% | cici 同意推荐方案 A |
| 19g | UI-2-5 E2E + commit 治理 + **双 race 治理债深化** | 1.55 | vs 2-3 节省 40% | cici "继续" 接受 |
| 19h | CI/CD 集成 + E2E 扩展 + **race 治理升级首测 0 race** | 2.9 | vs 3-4 节省 13-35% | cici "继续" 路径 2 缩范围 |
| 19i | Codex pre-merge hook + RBAC 场景 2 + AGENTS V1.3 | 2.4 | vs 2.6-3 节省 7-20% | cici AskUserQuestion 路径 2 缩范围 |
| 19j | **A2' 9 次顺延 5 月正式撤架** + 6 endpoint 骨架 + Codex 升级建议 | 3.1 | vs 3.8-4.3 节省 19-28% | **cici AskUserQuestion 路径 B 撤架** ⭐ |
| 19k | UI-3 phase 3 5 业务流 + CI 静态评估 + race 反向验证 | 3.75 | vs 3.3-4 顶部 | cici AskUserQuestion 路径 B 缩范围 |
| 19l | UI-3 续 5 + E2E 5 spec + race [P0] 保留 + AGENTS V1.4 | 4.1 | vs 3.3-4.3 顶部 | cici AskUserQuestion 路径 C 双未 |
| 19m | **基础资料补完 3 原型方案 B** + E2E 8 spec + 19l P3 | 3.0 | vs 3-3.5 下限节省 | cici 方案 B 决策 |
| 19n | UI-3 续 5 + race V0.2 同模块实测方案 + **教训 7 实测命中首次验证** | 3.2 | vs 3 接近 + 缓冲 | cici AskUserQuestion 路径 C |
| **累计 19f-19n** | **9 Sprint** | **~32.4 PD** | **avg 3.6 PD/Sprint** | **6 次 cici AskUserQuestion 决策** |

### 1.2 commit 分布（19f-19n）

| Sprint | code commits | docs commits | 总 | 备注 |
|---|---|---|---|---|
| 19f | 5 | 3 | 8 | 双子代理 + Codex 评审 + 同事评审 5 fix |
| 19g | 2 | 3 | 5 | 治理升级首测 |
| 19h | 3 | 3 | 6 | CI/CD 集成 |
| 19i | 2 | 3 | 5 | Codex hook + RBAC |
| 19j | 3 | 3 | 6 | A2' 撤架（cici 历史决策）|
| 19k | 3 | 3 | 6 | UI-3 phase 3 启动 + race 反向 |
| 19l | 2 | 3 | 5 | UI-3 续 + race 保留 |
| 19m | 2 | 2 | 4 | 基础资料 + E2E 扩展 |
| 19n | 2 | 2 | 4 | UI-3 续 + race V0.2 |
| **总** | **24** | **25** | **49** | **~5.4 commits/Sprint** |

### 1.3 vite entries 演进（前端 React 化）

```
19b 起步：1 entry（home）
19c-19e：11 entries（home + 10 base + approval-center / contract / equipment-* 3 / inventory / material-master / nc-interface / purchase-orders / reports）
19f phase 2：+5 = 16（dashboard-bigscreen / quality-check / scrap-disposal / mobile-stocktake / xinchuang-matrix）
19k phase 3：+5 = 21（purchase-planning / three-way-match / supplier-performance / material-issuance / funding-plan）
19l 续：+5 = 26（tender / goods-receipt / payment-request / stocktake / alert-rules）
19m 基础资料补：+3 = 29（base-archive / master-data-admin / tender-archive）
19n 续：+5 = 34（requirement-list / purchase-receipt / reconciliation / inventory-flow / maintenance-order）
```

**当前**：**34 entries**（prototype/ 52 HTML 已 React 化 ~30 个 + base / approval-center / contract / equipment-* 等 4 个非 prototype 来源 = 实际覆盖率 ~65%）

### 1.4 E2E tests 演进

```
19g：4 tests in 2 files（approval-center + nc-interface — 19g 必修 4 次顺延）
19h：+11 = 15 tests in 7 files（dashboard / inventory / purchase-orders / material-master / rbac 4 new + 4 spec / approval 2 + nc 2）
19l：+10 = 25 tests in 12 files（19k 5 业务流 spec × 2 cases）
19m：+13 = 38 tests in 20 files（19l 5 业务流 + 19m 3 基础资料 8 spec）
19n：未加 spec（19n c 做 race-governance V0.2 而非 spec）
```

**当前**：**38 tests in 20 files** — vite 34 entries 中 18 entries 有 spec 覆盖（**53% 覆盖率**）

### 1.5 Codex 0 顺延 P2 记录（22 Sprint 完整链）

| 期间 | Sprint | finding 类型 | 状态 |
|---|---|---|---|
| 12a-15a | 4 Sprint | 0 P1+P2 | 完整延续 |
| 16a-17a | 2 Sprint | 0 P1 + 3 P2 当 Sprint 修 | 完整延续 |
| 18a | 1 Sprint | 0 P1+P2 + 4 P3 顺延 | **首次 18a 模式直接延续** |
| 18b | 1 Sprint | 0 P1 + 2 P2 当 Sprint 修（meta-评审修旧引新）| 完整延续 |
| 19a-19c 三轨 | 1 评 | 2 P1 + 5 P2 + 1 P2 工作量顺延 + 13 P3 顺延 | 19b vendor P2 闭环（19f STYLE-OPT 落地）|
| 19d/19e/19f | 各 1 | 1 P1（19f）+ 2 P2 + 0 + 4 fix（同事评审）| 当 Sprint 修 |
| **19g** | 1 | 1 P2 当 Sprint 修 + **2 P2 强绑定顺延 19h** | 19h CI/CD 闭环 |
| **19h** | 1 | 2 P2 当 Sprint 修 + **1 P2 部分顺延 19i** | 19i 闭环 |
| **19i** | 1 | 0 P1+P2 + 3 P2 当 Sprint 修（自闭环） | 完整延续 |
| **19j** | 1 | 0 P1+P2 + 3 P2 当 Sprint 修（A2' 撤架 + 双子代理 0 race）| 完整延续 |
| **19k** | 1 | 1 P2 当 Sprint 修 + 1 P2 强绑定顺延 19l（19l 闭环 18a 模式）| 19l 闭环 |
| **19l** | 1 | **A 级 0 P1+P2 / 18a 模式直接延续**（首次连续 18a）| 完整延续 |
| **19m** | 1 | **A 级 0 P1+P2 / 18a 模式直接延续连续 2 Sprint** | 完整延续 |
| **19n** | 1 | **A 级 0 P1+P2 / 18a 模式直接延续连续 3 Sprint** | 完整延续 |
| **合计 22 Sprint** | - | **17 完整 + 3 强绑定闭环 + 19i/19j 自闭环 + 19l/19m/19n 18a 模式** | **0 关键 P2 顺延维持** |

### 1.6 双子代理 0 race 治理升级（19h-19n）

| Sprint | b commit | c commit | race 结果 | 任务边界 | 教训命中 |
|---|---|---|---|---|---|
| 19h | a07120b | 3c8f6a5 | 0 race | 天然分离 | 教训 6/7 [P0] 文档约束 |
| 19i | 7fa526c | 296f716 | 0 race / 0 误纳 | 天然分离 | 教训 6/7 [P0] |
| 19j | 8b6738a | 2cbacba | 0 race / 0 误纳 | 天然分离 | 教训 6/7 [P0] |
| 19k | bb70f0e | 181e43c | 0 race / 0 误纳 | 天然分离 | 教训 6/7 [P0] |
| 19l | d911347 | 98a6fd9 | 0 race / 0 误纳 | 天然分离 | 教训 6/7 [P0] |
| 19m | 5794fb9 | 7456907 | 0 race / 0 误纳 | 天然分离 | 教训 6/7 [P0] |
| **19n** | **6f9fdc8** | **db8fb34** | **0 race / 0 误纳** | **天然分离** | **教训 7 [P0] 实测命中首次验证** ⭐ |
| **合计 7 Sprint 14 commits** | - | - | **全 0 race** | **0 文件交集** | **教训 6/7 [P0] 100% 遵守 + 19n 真实防御作用** |

## 二、关键模式识别

### 2.1 ✅ 成功模式

1. **双子代理任务边界天然分离**（19h-19n 14 commits 0 race）
   - b 改 src/pages / Razor / Permission / Menu / i18n / vite
   - c 改 tests/e2e / docs/internal / AGENTS.md
   - 0 文件交集 — 自然防 race

2. **Codex 0 顺延 P2 连续 22 Sprint**
   - 关键阈值：≤ 0.5 PD 当 Sprint 修 / > 0.5 PD 显式顺延 / 强绑定下 Sprint 主线顺延
   - 19l/19m/19n 连续 3 Sprint A 级 0 P1+P2 — 18a 模式延续

3. **sed 批量提速**（19f 同事评审 4 fix / 19k 6 AppService xmldoc）— 模板化重复工作

4. **AskUserQuestion 关键决策点明确化**（19g/19h/19i/19j/19k/19l/19m/19n 7 次 — cici 路径决策 + A2' 撤架）

### 2.2 ⚠️ 反模式 / 风险信号

1. 🔴 **业务方协调路径未走通**（19j 撤架前 17a-19i 9 次顺延 5 月 / 撤架后 19j-19n 5 Sprint 仍 0 反馈）
   - 单点 cici 推动失败
   - 6 业务方（财务/质保/设备/仓储/SQA）对接人未明确
   - PO 介入未到位

2. 🟡 **cici 未配 CI/CD secrets 7 Sprint 顺延**（19h-19n）
   - 5 分钟自助任务持续未做
   - Codex pre-merge hook 实测未启动
   - CI 真实运行未验证

3. 🟡 **UI-3 续边际价值递减**
   - 19f phase 2 5（核心 Demo 高光）→ 19k 5 业务流核心 → 19l 5 业务流续 → 19m 3 基础资料补 → 19n 5 续
   - 26 React 化页面无 endpoint 接通 — mock → real 调整成本越来越大
   - prototype/ 剩 16 候选已非核心业务流

4. 🟡 **任务边界天然分离掩盖治理升级真效能**
   - 14 commits 0 race 主要因 b/c 不同模块（src/pages vs tests/e2e）
   - 19n 教训 7 实测命中**首次**真实防御 — 之前 13 次都是边界分离红利
   - race [P0] → [P1] 降级条件未达（需 ≥ 2 Sprint 同模块场景实测）

### 2.3 🎯 关键决策回顾

| 决策 | Sprint | 决策方向 | 评估 |
|---|---|---|---|
| **撤 A2'** | 19d | 选 1 撤主轨 + 5 步重启路径 | ✅ 正确 — 防反模式深化 |
| **A2' 正式撤架** | 19j | cici AskUserQuestion 选路径 B 撤架 | ✅ 历史性正确决策 — 5 月 9 次顺延止损 |
| **基础资料方案 B** | 19l-19m | cici 决策 19m 独立主轨补完 3 原型 | ✅ Codex 评审客观合理 — 强化 Demo 聚焦点 |
| **race [P0] 保留** | 19k-19n | Codex 19j 升级建议 → 19k 反向 → 19l/19m/19n 保留 | ✅ 客观 — 19n 实测命中证明 [P0] 有真实防御价值 |
| **同事评审引入** | 19f | cici 引入外部评审视角 | ✅ 发现 5 fix（4 真实 + 1 自解决）|

## 三、教训沉淀（已 memory 化）

memory 已落地：
1. ✅ 「Codex 0 顺延 P2 连续 22 Sprint 记录」
2. ✅ 「双子代理改同源文件需协调 commit 时序」V2（含 9 条 How to apply + 19n 教训 7 实测命中）
3. ✅ 「sed 批量生成 Contributor 10x 加速」
4. ✅ 「子代理工作量略小于主线程」「默认评估子代理并行机会」「spawn 子代理前 30 秒探查实际复杂度」
5. ✅ 「Sprint 任务卡 V0.x 定版后逐 Day 切换不问确认」

待沉淀（推荐）：
- 🆕 「业务方协调失败 5 月反模式」— 单点推动 vs PO 介入 / 项目级正式协调机制
- 🆕 「UI-3 续 5 Sprint 边际递减」— prototype/ 候选业务价值评估机制（cici/PO/业务方三方）
- 🆕 「cici 自助任务执行阻力分析」— 5 分钟 secrets 配置 7 Sprint 顺延的根因

## 四、19a-19n 总体评估

| 维度 | 评分 | 说明 |
|---|---|---|
| **交付完整性** | ★★★★★ | 34 entries + 38 tests + 6 endpoint 骨架 + A2' 撤架决策 |
| **质量基线** | ★★★★★ | Codex 0 顺延 P2 22 Sprint + 14 commits 0 race + dotnet/lint/build 0 errors |
| **节奏控制** | ★★★★☆ | 32.4 PD / 9 Sprint avg 3.6 — 健康但有疲劳信号 |
| **业务价值** | ★★★☆☆ | UI 框架完整但 mock 数据 — 业务方未反馈实际价值未交付 |
| **战略决策** | ★★★★★ | A2' 撤架 / 方案 B 基础资料 / race [P0] 保留 全合理 |
| **反模式控制** | ★★★☆☆ | 已撤 A2' / 方案 B 解 UI 缺口；但业务方协调 / secrets 自助仍未解 |
| **综合** | ★★★★☆ | 技术质量 ★★★★★ / 业务进展 ★★★☆☆（卡 cici-业务方协调路径）|

---

## 五、续 Sprint 必修红线（19o-19s 中期）

1. 🔴 **业务方协调机制建立**（cici 1-2 day）
   - 与 PO 明确 5 业务方对接人 + 反馈窗口
   - 项目级正式协调会议替代 cici 单点推动

2. 🟡 **CI/CD secrets 自助配**（cici 5 分钟）
   - 阻塞 #19/#22 累计 7 Sprint 顺延项
   - 解锁 Codex pre-merge hook 实测

3. 🟡 **PO 业务价值评估**（cici 1 day）
   - 19o-19s 优先级（mock → real 还是 UI-3 续？）
   - 26 React 化页面与业务方反馈对接顺序

4. 🟢 **race [P0] 同模块实测启动**（主代理 a 0.5 PD）
   - 按 race-governance V0.2 §六.2 方案 1 启动（b/c 同改 Permissions.cs）
   - 积累 [P0] → [P1] 降级证据链（19n 已 1/3）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 19a-19n 9 Sprint 完整复盘（数据驱动 + 反模式识别 + 教训沉淀 + ★★★★☆ 综合评估）+ 4 续 Sprint 必修红线 |
