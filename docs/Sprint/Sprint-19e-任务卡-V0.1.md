# Sprint 19e 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19e 起步草案
**配套：** [`Sprint-19d-Demo-脚本-V0.1.md`](./Sprint-19d-Demo-脚本-V0.1.md) §四 候选范围 + cici 2026-05-15 同意 UI 外围原型化建议

---

## 一、Sprint 19e 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 UI-STYLE：外围原型化 + DevExtreme Fluent Blue（cici 新讨论）

cici 2026-05-15 与同事讨论后同意采纳建议 — 80/20 法则（layout/外围占视觉感知 ~70% / DevExtreme 控件 ~30%）。

| Task | 范围 | 工时 |
|---|---|---|
| 19e-STYLE-1 | `frontend/src/shared/theme.css` 集中色彩变量（阜矿品牌色 / 字体 / 间距 / shadow） | 0.3 PD |
| 19e-STYLE-2 | App.tsx 顶级导航 + 侧边栏按 52 HTML 原型 layout 改 | 0.5 PD |
| 19e-STYLE-3 | 11 页面 page-container / page-header 按原型卡片化（统一 shared 模板）| 0.5 PD |
| 19e-STYLE-4 | 不动 DevExtreme Fluent Blue 主题（保稳定性 + 升级安全）| 0 PD |

**预算 UI-STYLE**：1.3-1.5 PD（外围 layout 重构）

### 候选 UI-3 phase 2：剩 5 核心 HTML 原型 React 化

| Task | 范围 | 工时 |
|---|---|---|
| 19e-UI-3-2-1 | dashboard-bigscreen 大屏 demo 高光（多 KPI 卡 + 图表）| 1 PD |
| 19e-UI-3-2-2 | quality-check 质检页面（DataGrid + 详情 + 状态机）| 0.7 PD |
| 19e-UI-3-2-3 | scrap-disposal 报废处置（DataGrid + 审批联动）| 0.7 PD |
| 19e-UI-3-2-4 | mobile-stocktake 移动盘点（响应式 + 触屏交互）| 0.8 PD |
| 19e-UI-3-2-5 | xinchuang-matrix 信创适配矩阵（管理后台只读视图）| 0.5 PD |

**预算 UI-3 phase 2**：3.5-4 PD（5 核心高优页面）

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

## 二、推荐策略：双轨 UI-STYLE + UI-3 phase 2

**V0.1 倾向**：
- **主轨 UI-3 phase 2**：3.5-4 PD（5 核心页面 dashboard / quality / scrap / mobile / xinchuang）
- **副轨 UI-STYLE**：1.3-1.5 PD（外围原型化 + DevExtreme Fluent Blue 保稳定）
- **旁路 STYLE-OPT**：0.5-1 PD（如时间宽裕跑 brotli 压缩）

**A2' 启动条件评估**：
- 若 cici 19e 启动前 NC 端反馈 ≥ 5 项关键差异 → 加 A2'-RESTART 主轨（撤主轨 UI-3 phase 2 部分页面）
- 若 NC 端持续无反馈 → A2' 继续顺延（**不算反模式** — cici 已在 19d 撤主线 + 设重启条件，此后顺延性质改变）

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
| 7 | UI 风格外围原型化（cici 新讨论）| 19e 起 | 1.3-1.5 PD | **19e 必修**（cici 同意）|
| 8 | 19d minSignCount 4 模板真接通后业务回归测试 | 19d | 0.5 PD | 19e 候选 |

### 3.2 Codex 19d 顺延（待评审后补 §六附录）

> 占位 — Codex 19d 评审完成后从顺延清单挑选补到本节。

**预估合计 ~1-2 PD**（占位等评审后修订）

---

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19e 主线方向 | **双轨 主轨 UI-3 phase 2 + 副轨 UI-STYLE 外围原型化**（cici 同意 80/20 法则）|
| 2 | 8 累计技术债 | **#7 UI-STYLE 外围必修 + #6 vendor 旁路** ~2 PD |
| 3 | 工时预算 | **UI-3 phase 2 3.5-4 + UI-STYLE 1.3-1.5 + STYLE-OPT 0.5-1 + 缓冲 = 6-8 PD** |
| 4 | 子代理并行策略 | **主代理 a UI-3 phase 2 5 页面 + 子代理 b UI-STYLE 外围 + 子代理 c STYLE-OPT vendor** sweet spot 3x |
| 5 | Codex 19d 评审 | Sprint 19d 收尾后 cici 触发（Demo `0aa34d7` 已就绪）|
| 6 | A2' 重启决策 | 19e 启动前 cici 评估 NC 端反馈窗口（无反馈 → 继续顺延 / 反馈到位 → 撤掉 UI-3 phase 2 部分页面腾 4 PD A2' 主轨）|

---

## 五、Sprint 19e 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | UI-STYLE 外围改 layout 破坏现有 11 页面 | 中 | shared 模板渐进改造 + 单页面验证 + 不动 DevExtreme 控件 |
| 2 | dashboard-bigscreen 1 PD 工作量乐观（实际 demo 高光级 1.5+ PD）| 中 | 子代理可选 1 个简化版 mock 数据；正式 chart 数据集成顺延 19f |
| 3 | mobile-stocktake 响应式触屏交互 0.8 PD 工作量 | 中 | DevExtreme 25 自带 responsive；仅按 HTML 原型移植样式即可 |
| 4 | A2' 启动条件评估错（cici 误判 NC 端反馈到位）| 低 | 19e Day 1 cici 明确反馈进度 → 19d V0.2 §一 5 步路径校验 |

---

## 六、Codex 19d 评审待触发（已就绪）

Sprint 19d Demo 脚本 §五 已写就触发提示词：

> "评审 Sprint 19d 共 3 commits（`fc7fbc8` V0.2 撤 A2' / `cee786d` Day 1-3 UI-3+DEBT / `0aa34d7` Demo）— 重点关注 Wave 92 minSignCount 累计逻辑 + 撤 A2' 决策完整性 + vendor split 4 chunk 收益评估 + 4 [⚠️] endpoint 占位"

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双轨 UI-3 phase 2 + UI-STYLE 外围原型化（cici 同意 80/20 法则）+ STYLE-OPT 旁路 + 8 累计技术债（含新 #7 UI-STYLE / #8 minSignCount 业务回归）+ 6 决策点 + 4 风险 |
