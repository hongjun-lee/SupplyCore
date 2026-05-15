# Sprint 19f 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 同意推荐方案 A：双轨 UI-3 phase 2 + UI-FIX + STYLE-OPT 旁路）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19f 锁版任务卡
**配套：** [`Sprint-19e-Demo-脚本-V0.1.md`](./Sprint-19e-Demo-脚本-V0.1.md) §四 候选范围 + 19e 收尾 Codex 19d/19e 评审修复

---

## 一、Sprint 19f 主线方向（锁版 · 双轨 UI-3 phase 2 + UI-FIX）

### 主轨 UI-3 phase 2：5 核心 HTML 原型 React 化（19e 顺延）

复用 19e ABP multi-page + UI-STYLE 品牌色基础（提速 40%+）：

| Task | 范围 | 工时 |
|---|---|---|
| 19f-UI-3-2-1 | dashboard-bigscreen 大屏 demo 高光（多 KPI 卡 + 图表）| 1 PD |
| 19f-UI-3-2-2 | quality-check 质检页面（DataGrid + 详情 + 状态机）| 0.7 PD |
| 19f-UI-3-2-3 | scrap-disposal 报废处置（DataGrid + 审批联动）| 0.7 PD |
| 19f-UI-3-2-4 | mobile-stocktake 移动盘点（响应式 + 触屏交互）| 0.8 PD |
| 19f-UI-3-2-5 | xinchuang-matrix 信创适配矩阵（管理后台只读视图）| 0.5 PD |

**预算 UI-3 phase 2**：3.5-4 PD

### 副轨 UI-FIX：abp install-libs + Razor Page Permission 细粒度（19e 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19f-UI-FIX-1 | Host SupplyCores.Web 跑 abp install-libs（或 Configure<AbpMvcLibsOptions>(o => o.CheckLibs = false)）| 0.1 PD |
| 19f-UI-FIX-2 | 11 Razor Page 加 SupplyCoresPermissions 细粒度（替 [Authorize]）| 0.5 PD |
| 19f-UI-FIX-3 | RazorPagesOptions.Conventions.AuthorizePage 注册 11 page Permission | 0.2 PD |

**预算 UI-FIX**：0.8 PD

### 旁路 STYLE-OPT：vendor brotli + lazy-load（19b/19d 累计顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19f-STYLE-OPT-1 | vite-plugin-compression brotli pre-compress（vendor-devextreme 1.16MB → ~400KB 传输）| 0.3 PD |
| 19f-STYLE-OPT-2 | DevExtreme 25.x lazy-load build 评估 + 升级 chunk 拆分 assert | 0.5 PD |

**预算 STYLE-OPT**：0.5-1 PD

### 候选 UI-2-5 E2E（19c/19d/19e 三次顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19f-UI-2-5 | Playwright 集成 + 1-2 核心场景（approval-center 完整链路 + nc-interface 监控）| 1-1.5 PD |

### 候选 A2' 重启（cici 19f 启动前评估 NC 端反馈）

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19f-A2-RESTART | NC 真端点 phase 2（19d V0.2 §一 5 步重启路径）| 4 PD | NC 端反馈 ≥ 5 项关键差异 + 项目正式协调 |

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a-19e 候选 C/G。**预算 5-10 PD**

---

## 二、推荐策略：双轨 UI-3 phase 2 + UI-FIX

**V0.1 倾向**：
- **主轨 UI-3 phase 2**：3.5-4 PD（5 核心页面 — 复用 19e multi-page + 品牌色提速 40%+）
- **副轨 UI-FIX**：0.8 PD（abp install-libs + 11 Razor Page Permission 细粒度 — 19e 顺延 Host-only 调整 + 安全完整化）
- **旁路 STYLE-OPT**：0.5-1 PD（如时间宽裕跑 brotli 压缩）

**A2' 启动条件评估**：
- 若 cici 19f 启动前 NC 端反馈 ≥ 5 项 → A2'-RESTART 主轨（撤主轨 UI-3 phase 2 5 页面顺延 19g）
- 若 NC 端持续无反馈 → A2' 继续顺延（性质改变 — cici 19d 已撤主线）

---

## 三、累计技术债（Sprint 19f 必修，决策点 2）

### 3.1 Sprint 17a-19e 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | 17a-19d | 4 PD | **19d V0.2 撤** + 待重启条件 |
| 2 | 详情页 / 编辑表单（reports / nc-interface backend endpoint 占位）| 19c | 0.3 PD | 19f 待 cici 确认 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 等 NC 端 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19f 评估（StockBalance 已用 7a Domain 复用 OK）|
| 5 | UI-2-5 E2E Playwright | 19c/19d/19e 三次顺延 | 1-1.5 PD | 19f 候选 |
| 6 | vendor brotli + lazy-load（19d split 续优化）| 19b/19d | 0.5-1 PD | 19f 旁路 STYLE-OPT |
| 7 | UI-STYLE 已基本完成（19e contract + 19f 9 页面 hex 替换） | 19e/19f | 0 | ✅ 已完成 |
| 8 | minSignCount 4 模板真接通后业务回归测试 | 19d | 0.5 PD | 19f 候选 |
| 9 | Razor Page 细粒度 Permission（19e [Authorize] 起步）| 19e 起 | 0.5 PD | 19f UI-FIX |
| 10 | abp install-libs LeptonX libs（19e Host-only 调整）| 19e 起 | 0.1 PD | 19f UI-FIX |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | 19f 待 cici 确认 |
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |

### 3.2 Codex 19d/19e 已闭环

3 P2 全修（commit `813d93f`）：
- 19d P2 finding 1: 4 新页面 Popup race AbortController（3 修 + equipment-oee 无 Popup 跳过）
- 19e P2 finding 1: 9 页面 UI-STYLE hex 替换 252 处 sed 批量
- 19e P2 finding 2: en.json 8 keys 补齐

### 3.3 Codex 19f 顺延（待评审后补 §六附录）

> 占位 — Codex 19f 评审完成后从顺延清单挑选补到本节。

**预估合计 ~1-2 PD**（占位等评审后修订）

---

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19f 主线方向 | **双轨 主轨 UI-3 phase 2 + 副轨 UI-FIX + 旁路 STYLE-OPT**（cici 同意推荐方案 A）|
| 2 | 13 累计技术债 | **#5 E2E 顺延 19g + #6 vendor 旁路 + #9-#10 UI-FIX 必修** ~2-3 PD |
| 3 | 工时预算 | **UI-3 phase 2 3.5-4 + UI-FIX 0.8 + STYLE-OPT 0.5-1 + 缓冲 = 5-7 PD** |
| 4 | 子代理并行策略 | **主代理 a 协调 + 子代理 b UI-3 phase 2 5 页面 + 子代理 c UI-FIX + STYLE-OPT 合并** sweet spot 2x（19e 实测多子代理 30-40% 提速）|
| 5 | Codex 19e 评审 | 已完成（commit `813d93f` 修复 + `96134d5` 19f V0.1 §六附录）|
| 6 | A2' 重启决策 | **19f 启动前 cici 评估 NC 端反馈窗口**（无反馈 → 继续顺延性质改变；反馈 ≥ 5 项 → 撤主轨改 A2'-RESTART）|

---

## 五、Sprint 19f 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | dashboard-bigscreen 1 PD 工作量乐观（实际 demo 高光级 1.5+ PD）| 中 | 子代理可选 1 个简化版 mock 数据；正式 chart 数据集成顺延 19g |
| 2 | mobile-stocktake 响应式触屏交互 0.8 PD 工作量 | 中 | DevExtreme 25 自带 responsive；仅按 HTML 原型移植样式即可 |
| 3 | abp install-libs 失败（无 ABP CLI / 网络问题）| 低 | fallback Configure<AbpMvcLibsOptions>(o => o.CheckLibs = false)（一行配置）|
| 4 | 11 Razor Page Permission 细粒度可能引入业务路径鉴权 bug | 中 | 守护测试覆盖 11 page 启动 + 鉴权失败 2 个场景 |

---

## 六、Codex 19d/19e Finding 附录（评审完成 · 全 P2 当 Sprint 修）

| Sprint Commit 范围 | 已评 | P1 | P2 | P3 | 当 Sprint 修 P1+P2 | 顺延 19f/19g |
|---|---|---|---|---|---|---|
| Sprint 19d 3 commits | Y | 0 | 1 | 4 | 1 P2 (19f 修) | 4 P3 |
| Sprint 19e 4 commits | Y | 0 | 2 | 3 | 2 P2 (19f 修) | 3 P3 |
| **合计** | 7 | **0** | **3** | **7** | **3 P2** | **7 P3** |

**修复 commit**：`813d93f` "Sprint 19f 预热修复: Codex 19d/19e 3 P2 全修（0.4 PD vs 0.65 预估 节省 38%）"

**Codex 0 顺延 P2 连续 Sprint 记录调整**：
- 11a-19a 9 Sprint 完整 0 P2 顺延 ✓
- 19b 1 P2 显式顺延（vendor 工作量超阈值 / 与 Catio 同等技术债 #6）
- 19c/19d/19e 各 0 P2 顺延（全当 Sprint 修）
- **累计 13 Sprint 中 12 Sprint 完整 0 P2 顺延 / 1 P2 显式顺延**

新表述："**0 关键 P2 顺延 12 Sprint（11a/13a-19a/19c/19d/19e 跳 19b）+ 1 工作量超阈值 P2 显式顺延（19b vendor）**"

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双轨 UI-3 phase 2 + UI-FIX 副轨（19e 顺延 abp install-libs + Razor Page Permission）+ STYLE-OPT 旁路 + 13 累计技术债 + §六 Codex 19d/19e Finding 附录（3 P2 当 Sprint 全修） |
| **V0.2** | **2026-05-15** | **cici 同意推荐方案 A — 双轨 UI-3 phase 2 + UI-FIX + STYLE-OPT 旁路 5-7 PD**；§一 主线/副轨/旁路 结构 + §四 锁版决策 + sweet spot 2x（主代理协调 + 子代理 b UI-3 + 子代理 c UI-FIX/STYLE-OPT）|
