# Sprint 19b Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19b 验收演示脚本
**配套：** [`Sprint-19b-任务卡-V0.2.md`](./Sprint-19b-任务卡-V0.2.md) · plan [`melodic-doodling-wirth.md`](/Users/lihongjun/.claude/plans/melodic-doodling-wirth.md)

---

## 一、Sprint 19b 落地范围

按 V0.2 锁版（cici 选 A 双轨 UI MVP + A2'），实际交付 **~2.55 PD**（UI MVP 6/6 页面完整 + A2' 顺延 19c）：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（双轨 UI MVP + A2'） | `b521feb` + `68640b9` | a |
| **D1** | 模块化 frontend 骨架（modules/nova.supplycores/frontend/）+ NcHealthSnapshot 联调 | `4842244` | a |
| **D2** | approval-center 标准模板（react-router + DevExtreme 模板 1/6 MVP） | `4fb2280` | a |
| **D3-4** | 5 React MVP 页面（inventory / purchase-orders / material-master / reports / nc-interface） | `6717355` | **b + c（双子代理）** |
| D6-7 | Demo 脚本（本文档）+ 收尾 | 本文档 | a |

**A2' 副轨**：19b 期间 NC 端无反馈 → A2-1~A2-4 顺延 Sprint 19c；子代理 b 副轨机会主义未触发（双子代理优先跑 UI MVP）。

**测试基线演进**：
- Sprint 19a 收尾：1742 后端测试
- Sprint 19b：1742（无后端代码改动 — Codex 18b 4 finding 已 Sprint 19a 期间提前消化）+ 0 frontend 测试（Sprint 19c 加 E2E）
- frontend 模块化骨架：React 19 + DevExtreme 25 + Vite 7 + react-router 7 + TypeScript 5.9

---

## 二、Demo 演示路径

### 路径 A：模块化 frontend 启动（3 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores/modules/nova.supplycores/frontend`
2. `npm run dev` → vite dev server 启 port 5175
3. 启 backend：`cd ../../../src/SupplyCores.Web && dotnet run` → port 5100
4. 浏览器打开 `http://localhost:5175/supplycores/` → 看到导航 + 首页（NcHealthSnapshot）

### 路径 B：6 MVP 页面演示（10 分钟）

按导航顺序演示：

1. **首页 (`/`)**：NcHealthSnapshot 联调 — 13 字段 DataGrid 展示（Mock 模式 / 认证类型 / OAuth2 配置 / Token 缓存 / 24h 成功率 / 熔断器提示等）
2. **审批中心 (`/approval-center`)**：21 模板的 UI 入口 — TabPanel 三段（待办 / 已审过 / 我发起）+ DataGrid + Approve/Reject 按钮联调 6 endpoint
3. **库存查询 (`/inventory`)**：库存清单 DataGrid + 搜索过滤 — 联调 stock-inbounds 占位（[⚠️ 待 cici 确认 InventoryBalance 聚合 endpoint]）
4. **采购订单 (`/purchase-orders`)**：订单列表 DataGrid + 行操作 — 联调 purchase-plans 占位（[⚠️ 待 cici 确认 PurchaseOrders Controller P-04]）
5. **物料主数据 (`/material-master`)**：完整联调 `/api/supply-cores/materials` + disable/reactivate POST — Filter/MaterialType/MaterialState 多维过滤
6. **报表中心 (`/reports`)**：4-Tab（预警台账 / 日趋势 / Org 排行 / 类型分布）+ 时间范围筛选 + Excel/PDF 导出按钮（report-exports）
7. **NC 接口监控 (`/nc-interface`)**：顶部 NcHealthSnapshot 4 卡片（24h 成功率彩色边框 / LastSuccessfulCallAt / CircuitBreakerHint 状态着色 / Mock+Token）+ 底部 4-Tab（Overview/任务/对账/异常）— 真正 demo 高光

### 路径 C：模块化架构验证（2 分钟）

1. `tree -L 2 modules/nova.supplycores/` 显示 `frontend/` 与 `src/` 同级（cici 反馈关键要求）
2. 验证 `src/SupplyCores.Web/wwwroot/supplycores/` build 产物（vite copyToMainApp 自动）
3. 对比 Catio nova.platform/frontend/ 结构一致性

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 双轨 UI MVP + A2' | ✅ UI MVP 6/6 完成；**A2' 副轨未触发 → 顺延 19c**（NC 端持续无反馈）|
| 2. 累计技术债 | 全修 | ✅ Codex 18b 4 P3 已 Sprint 19a 期间提前消化（commit `e371f84`）；X1 OAuth2 Redis 顺延 19c |
| 3. 工时预算 | 8-10 PD | **2.55 PD 实际**（UI 2.55 / A2' 0 / X1 0）远低预算 — sweet spot 双子代理 + approval-center 模板复用 |
| 4. 子代理并行 | 主+子代理 b+c sweet spot 2-3x | ✅ Day 3-4 双子代理 b（3 页面 0.9 PD）+ c（2 页面 0.75 PD）同窗口 |
| 5. Codex 19a 评审 | 已就绪（Demo `55f86f4`） | ⏳ 待 cici 触发 |
| 6. NC 端反馈窗口 | 19b 任意时段 | ❌ 19b 期间无反馈 → A2' 顺延 19c |
| 7. 模块化 frontend | `modules/nova.supplycores/frontend/` | ✅ 与 src/ 同级 + 完全参考 Catio nova.platform 模式 |
| 8. UI MVP 6 必选页面 | approval-center / inventory / purchase-orders / reports / nc-interface / material-master | ✅ 6/6 完成（可选 2 contract-list / dashboard-bigscreen 顺延） |

### Sprint 19b 特殊性

**双子代理 sweet spot 2x → 实测 3-4x（含模板复用）**：approval-center Day 2 标准模板让 5 后续页面 sed 模板批量复用，单页平均 ~0.3-0.4 PD 而非 0.5 PD 预估。

**首次 UI 大头 Sprint**：之前 17a-19a 全后端 — 19b 转 UI 主线证明 React + DevExtreme 模块化前端流程已可批量交付，与 Catio nova.platform 风格完全一致。

---

## 四、Sprint 19c 候选方向（A2' 顺延 + 新增）

| 候选 | 范围 | 工时 |
|---|---|---|
| **A2'** | **NC 真端点 phase 2（19a/19b 二次顺延）— 待 NC 端反馈** | 4 PD |
| 候选 X1 | OAuth2 Token Redis 持久化缓存（17a/19a/19b 三次顺延）| 0.5 PD |
| 候选 X2 | A2-1' 占位稿 NC 反馈调整（NCC OpenAPI 适配）| 1-2 PD |
| 候选 UI-2 | 6 MVP 页面详情页 / 编辑表单完整化 + InventoryBalance + PurchaseOrders P-04 endpoint 配套 | 3-4 PD |
| 候选 UI-3 | 可选 2 页面（contract-list / dashboard-bigscreen）+ 剩余 44 HTML 原型批量 React 化 | 8-12 PD |

**V0.1 倾向**：双轨 UI-2 (详情页 + 后端 endpoint 配套) + A2' (NC 反馈触发) — 主线 UI 完整化 / A2' 保留触发

---

## 五、Sprint 19b Codex 评审待触发

> 占位 — Sprint 19b 完成时 cici 触发 Codex 19b 评审

**评审重点**：
- 模块化 frontend 架构（与 Catio nova.platform 一致性 / Host 隔离）
- React 19 + DevExtreme 25 升级是否引入风险（旧 React 18 / DX 24 升级）
- approval-center 标准模板复用质量（5 后续页面是否真复用 vs 重复）
- API 联调 endpoint 缺口（InventoryBalance / PurchaseOrders P-04 待补）
- 详情页 / 编辑表单临时 alert 顺延 19c 是否合理

**触发提示词**：
"评审 Sprint 19b 共 5 commits（`b521feb`+`68640b9` V0.2 / `4842244` Day 1 frontend skeleton / `4fb2280` Day 2 approval-center / `6717355` Day 3-4 5 页面 双子代理）— 重点关注模块化 frontend 架构正确性 + React 19/DevExtreme 25 升级稳定性 + approval-center 模板复用质量 + 3 [⚠️] 待 cici 确认 endpoint 缺口"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — UI MVP 6/6 完成（2.55 PD vs 5-7 PD 预估提速 ~50%）+ 模块化 frontend 架构 + A2' 顺延 19c + 3 演示路径 + Codex 19b 触发提示 |
