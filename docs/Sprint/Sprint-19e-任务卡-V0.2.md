# Sprint 19e 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 同意推荐方案 A：ABP multi-page 重构 + UI-STYLE 品牌色合并主线）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19e 锁版任务卡
**配套：** [`Sprint-19d-Demo-脚本-V0.1.md`](./Sprint-19d-Demo-脚本-V0.1.md) §四 候选范围 + Catio nova.platform 模式

---

## 一、Sprint 19e 主线方向（锁版 · ABP multi-page 重构 + UI-STYLE 品牌色合并）

### 主轨 ABP-REFACTOR：multi-page 重构 + LeptonX 集成 + ABP MenuContributor

cici 2026-05-15 同意推荐 — 一次性解决导航 + 视觉 + 集成 Catio 三大问题（复利最高）。

| Task | 范围 | 工时 |
|---|---|---|
| 19e-ABP-1 | vite.config.ts multi-page input 12 entries（删 SPA 单 main → 12 独立 entry/chunk）| 0.3 PD |
| 19e-ABP-2 | 删 react-router-dom 依赖 + 改 main.tsx（原 SPA 路由删除）| 0.2 PD |
| 19e-ABP-3 | 12 React 页面拆独立 main 入口（含 home + approval-center + 6 19b/19c MVP + 4 19d UI-3 phase 1）| 0.5 PD |
| 19e-ABP-4 | Module Web (Nova.SupplyCores.Web) 加 12 Razor Pages 占位（每页含 React Island mount 点）| 0.5 PD |
| 19e-ABP-5 | LeptonX 主题集成（Razor Pages 模板继承 + 页面注册）| 0.3 PD |
| 19e-ABP-6 | ABP MenuContributor 注册 12 菜单项（接 SupplyCoresMenuContributor 现有结构 + 树形分组）| 0.3 PD |

**预算 ABP-REFACTOR**：2-2.5 PD（一次性架构重构）

### 副轨 UI-STYLE：原型品牌色提取 + DevExtreme Fluent Blue 不动（cici 2 次确认）

cici 2026-05-15 与同事讨论后同意采纳建议 — 80/20 法则（layout/外围占视觉感知 ~70% / DevExtreme 控件 ~30%）+ cici 二次确认"除 DevExtreme 外配色采用原型"。

| Task | 范围 | 工时 |
|---|---|---|
| 19e-STYLE-1 | 解析 `SupplyCore/prototype/assets/styles.css` 提取原型品牌色 + 间距 + 字体 → `frontend/src/shared/theme.css` 定义 5-10 个 `--brand-*` 前缀 CSS 变量（**不污染 `:root` 通用色防侵入 `.dx-*`**）| 0.5 PD |
| 19e-STYLE-2 | App.tsx 顶级导航 + 侧边栏按 52 HTML 原型 layout 改（用 `--brand-*` 变量）| 0.5 PD |
| 19e-STYLE-3 | 11 页面 page-container / page-header 按原型卡片化（统一 shared 模板 + 品牌色应用）| 0.5 PD |
| 19e-STYLE-4 | 自定义 button / link 用 `--brand-*` 变量；**DevExtreme Button / DataGrid / Form / Popup 保 Fluent Blue 不动**（不改 `dx.fluent.blue.light.css` import）| 0 PD |
| 19e-STYLE-5 | 守护测试：12 React 页面 build 0 错误 + DevExtreme 控件视觉无变化 + 跑 home 页面 NcHealthSnapshot 联调正常 | 0.2 PD |

**预算 UI-STYLE**：1.5-2 PD（外围 layout + 品牌色提取 + 守护）

**关键约束**：
- ❌ 不要把品牌色直接覆盖通用色（如 `--primary-color: #brown`）— 会侵入 DevExtreme 内部 `.dx-*` class 致控件视觉混乱
- ✅ CSS 变量带前缀 `--brand-*` + scope 限制到 `.app-shell` 或自定义 class
- ✅ DevExtreme 控件 100% 走 `dx.fluent.blue.light.css` 默认（不改 import）
- ✅ 升级 DX 25→26 / chaos 测试 / 跑回归测试都零额外成本

**视觉收益**：
- 外围 layout 70% 感知靠拢原型 → Demo 视觉一致性大幅提升
- DevExtreme 工业感保留 → 客户看表格 / 表单 / Popup "专业感"不丢

### 顺延候选（Sprint 19f+ 重新评估）

#### UI-3 phase 2：5 核心 HTML 原型 React 化（顺延 19f）

cici 2026-05-15 决策 — UI-3 phase 2 顺延 19f，让 19e 集中 ABP 重构 + UI-STYLE 一次性视觉重构。19f 启动时复用 19e 后的 multi-page 模式 + 品牌色变量（提速 40%+）：

| Task | 范围 | 工时 |
|---|---|---|
| 19f-UI-3-2-1 | dashboard-bigscreen 大屏 demo 高光 | 1 PD |
| 19f-UI-3-2-2 | quality-check 质检 | 0.7 PD |
| 19f-UI-3-2-3 | scrap-disposal 报废处置 | 0.7 PD |
| 19f-UI-3-2-4 | mobile-stocktake 移动盘点 | 0.8 PD |
| 19f-UI-3-2-5 | xinchuang-matrix 信创适配 | 0.5 PD |

**预算 UI-3 phase 2 (19f)**：3.5-4 PD

### 候选 A2' 重启（待项目协调到位）

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19e-A2-RESTART | 重启 A2' NC 真端点 phase 2（撤后重启）| 4 PD | **NC 端反馈到位 + 项目正式协调** |

启动条件（19d V0.2 §一 5 步重启路径）：
1. cici 与项目方明确 NC 端对接人
2. 18b 60 ⚠️ 占位稿拆分级
3. 项目级正式协调会议
4. NC 端反馈 ≥ 5 项关键差异
5. 重启时复用 17a OAuth2 / Polly / chaos 守护底层基础设施

### 候选 UI-2-5 E2E（19c/19d 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19e-UI-2-5 | Playwright 集成 + 1-2 核心场景（approval-center 完整链路 + nc-interface 监控）| 1-1.5 PD |

### 候选 STYLE-OPT：vendor brotli 压缩 / lazy-load（19b/19d 续优化）

| Task | 范围 | 工时 |
|---|---|---|
| 19e-STYLE-OPT-1 | vite-plugin-compression brotli pre-compress（vendor-devextreme 1.16MB → ~400KB 传输）| 0.3 PD |
| 19e-STYLE-OPT-2 | DevExtreme 25.x lazy-load build 评估 | 0.5 PD |

**预算 STYLE-OPT**：0.5-1 PD（性能优化）

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a/18a/19a/19b/19c/19d 候选 C/G。**预算 5-10 PD**

---

## 二、双轨执行策略（V0.2 锁版）

**主轨 ABP-REFACTOR + 副轨 UI-STYLE 合并执行**（共 ~3-4 PD），UI-3 phase 2 顺延 19f：

- **Day 1-2 主代理 a + 子代理 b**：ABP multi-page 重构（vite.config.ts + 12 entry + 12 Razor Pages + LeptonX 集成 + MenuContributor）
- **Day 3 子代理 c**：UI-STYLE 原型品牌色提取（解析 styles.css + theme.css 变量 + 应用到外围 layout）
- **Day 4 主代理 a**：UI-STYLE 12 页面应用 + 守护测试 + Demo 收尾

**复利收益**：
- 一次性解决导航（ABP MenuContributor）+ 视觉（品牌色 + LeptonX）+ 集成（Catio 体系）三大问题
- 19f UI-3 phase 2 启动时复用 multi-page 模式 + 品牌色变量（预期提速 40%+）

**A2' 重启条件评估**：
- 19e 启动前 cici 评估 NC 端反馈窗口；如反馈 ≥ 5 项关键差异 → 撤副轨 UI-STYLE 改 A2'-RESTART 主轨
- 如 NC 端持续无反馈 → A2' 继续顺延（**不算反模式** — cici 已在 19d 撤主线 + 设重启条件，此后顺延性质改变）

---

## 三、累计技术债（Sprint 19e 必修，决策点 2）

### 3.1 Sprint 17a-19d 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | ~~17a-19d~~ | 4 PD | **19d V0.2 撤** + 待重启条件（详 19d V0.2 §一）|
| 2 | 详情页 / 编辑表单（reports / nc-interface backend endpoint 占位）| 19c | 0.3 PD | 19e 待 cici 确认 |
| 3 | A2-1' 占位稿 NC 反馈调整（NCC OpenAPI 适配）| 18b 起 | 1-2 PD | 等 NC 端 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19e 评估（StockBalance 已用 7a Domain 复用 OK）|
| 5 | UI-2-5 E2E Playwright | 19c/19d 顺延 | 1-1.5 PD | 19e 候选 |
| 6 | vendor 优化（19d split + brotli + lazy-load）| 19b/19d | 0.5-1 PD | 19e 旁路 STYLE-OPT |
| 7 | UI 风格外围原型化（cici 2 次确认 — 含原型品牌色提取 + CSS 变量 scope 隔离）| 19e 起 | 1.5-2 PD | **19e 必修**（cici 同意）|
| 8 | 19d minSignCount 4 模板真接通后业务回归测试 | 19d | 0.5 PD | 19e 候选 |

### 3.2 Codex 19d 顺延（待评审后补 §六附录）

> 占位 — Codex 19d 评审完成后从顺延清单挑选补到本节。

**预估合计 ~1-2 PD**（占位等评审后修订）

---

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19e 主线方向 | **主轨 ABP-REFACTOR multi-page + 副轨 UI-STYLE 品牌色合并执行**（cici 同意推荐方案 A — 一次性解决导航+视觉+集成三大问题）|
| 2 | 8 累计技术债 | **#7 UI-STYLE 必修 + #1 ABP MenuContributor 接通**（A2' 撤后 #1 标含义变更为"导航接通"而非 NC 真端点）|
| 3 | 工时预算 | **ABP-REFACTOR 2-2.5 + UI-STYLE 1.5-2 + 缓冲 = 3-4 PD**（远低于 19e V0.1 6-8 预算 — 撤 UI-3 phase 2 顺延）|
| 4 | 子代理并行策略 | **Day 1-2 主+b ABP 重构 + Day 3 子代理 c UI-STYLE 提取 + Day 4 主代理应用** sweet spot 3x |
| 5 | Codex 19d 评审 | Sprint 19d 收尾后 cici 触发（Demo `0aa34d7` 已就绪 — 累计 4 Sprint 未触发，建议 19e 启动前一并触发）|
| 6 | **ABP 重构 vs UI-STYLE 优先级** | **合并执行 + UI-3 phase 2 顺延 19f**（cici 选 A 推荐方案）|
| 7 | A2' 重启决策 | 19e 启动前 cici 评估 NC 端反馈窗口（无反馈 → 继续顺延，性质改变不算反模式）|

---

## 五、Sprint 19e 风险（V0.2 调整）

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | **首次大规模 frontend 架构重构**（SPA → multi-page）| **高** | 参考 Catio nova.platform 完整模式（已验证 5 个 Catio 模块复用）+ 单页面渐进验证 |
| 2 | 12 React 页面拆独立 entry 可能引入 build 复杂度 / chunk 重复 | 中 | vite manualChunks 已就绪（vendor-react / vendor-devextreme）+ 守护测试验全 12 路由可访问 |
| 3 | LeptonX + Razor Page React Island mount 集成调试 | 中 | 复制 Catio Nova.Platform.Web Razor Pages 现成模板 |
| 4 | UI-STYLE 品牌色侵入 DevExtreme `.dx-*` class | 低 | CSS 变量带 `--brand-*` 前缀 + scope 限 `.app-shell` + 守护测试验 DevExtreme 视觉无变化 |
| 5 | A2' 启动条件评估错（cici 误判 NC 端反馈到位）| 低 | 19e Day 1 cici 明确反馈进度 → 19d V0.2 §一 5 步路径校验 |

---

## 六、Codex 19d 评审待触发（已就绪）

Sprint 19d Demo 脚本 §五 已写就触发提示词：

> "评审 Sprint 19d 共 3 commits（`fc7fbc8` V0.2 撤 A2' / `cee786d` Day 1-3 UI-3+DEBT / `0aa34d7` Demo）— 重点关注 Wave 92 minSignCount 累计逻辑 + 撤 A2' 决策完整性 + vendor split 4 chunk 收益评估 + 4 [⚠️] endpoint 占位"

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双轨 UI-3 phase 2 + UI-STYLE 外围原型化（cici 同意 80/20 法则）+ STYLE-OPT 旁路 + 8 累计技术债（含新 #7 UI-STYLE / #8 minSignCount 业务回归）+ 6 决策点 + 4 风险 |
| V0.1.1 | 2026-05-15 | UI-STYLE 升级 — 原型品牌色提取 + CSS 变量 scope 隔离（cici 2 次确认）|
| **V0.2** | **2026-05-15** | **cici 同意推荐方案 A：ABP multi-page 重构 + UI-STYLE 品牌色合并主线** — 一次性解决导航（ABP MenuContributor）+ 视觉（品牌色 + LeptonX）+ 集成（Catio 体系）三大问题；UI-3 phase 2 顺延 19f；3-4 PD 预算（vs V0.1 6-8 PD）；首次大规模 frontend 架构重构（SPA → multi-page）|
