# Sprint 19c Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19c 验收演示脚本
**配套：** [`Sprint-19c-任务卡-V0.2.md`](./Sprint-19c-任务卡-V0.2.md)

---

## 一、Sprint 19c 落地范围

按 V0.2 锁版（双轨 UI-2 + A2' + X1 旁路），实际交付 **~3.9 PD**（UI-2 4 子项完整 + X1 收编 + A2' 顺延 19d）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（双轨 UI-2 + A2' + X1）| `05f015c` | a | 0.3 |
| **D1-2** | UI-2-1 StockBalance Application + Controller + DTO + Mapperly + 5 守护 + frontend inventory 切换 | `ce7de00` | **b** | 0.6 |
| **D1-2** | X1 OAuth2 Token L1+L2 双层缓存（17a/19a/19b 三次顺延收编）+ 3 守护 | `ce7de00` | **c** | 0.4 |
| **D3-5** | UI-2-3 详情页 6 个（approval-center / inventory / purchase-orders / material-master / reports / nc-interface）| `ccce0ea` | **b** | 1.6 |
| **D3-5** | UI-2-4 编辑表单 5 个（inventory 跳过 - 业务规则）+ 21 模板下拉 + 校验 | `ccce0ea` | **c** | 1.3 |
| D7 | Demo 脚本（本文档）+ 收尾 | 本文档 | a | 0.3 |

**A2' 副轨**：19c 期间 NC 端无反馈 → A2' 第三次顺延 19d；cici 19d 启动前需评估硬截止 vs 撤 A2' 决策。

**UI-2-5 E2E Playwright**：评估后顺延 19d（Playwright 集成 + 接 React+DevExtreme 测试 ~1+ PD 超 0.5-1 预算；优先级低于 19d UI-3 大批量 React 化）。

**测试基线演进**：
- Sprint 19b 收尾：1742 后端
- Sprint 19c Day 1-2：1750（+8 = 5 StockBalance 守护 + 3 OAuth2 L2 守护）
- Sprint 19c Day 3-5：1750（仅 frontend 改动，无新后端测试）
- Domain 909 / Application 792 / EFCore 43 / Web 6
- frontend：885 modules / build 1.95s / 6 详情 Popup + 5 编辑 Form 完整

---

## 二、Demo 演示路径

### 路径 A：UI-2 6 页面完整链路（10 分钟）

每个页面演示流程：列表 → 详情 → 编辑/操作

1. **审批中心 `/approval-center`**：
   - 列表三段（待办/已审过/我发起）
   - **详情**：chain_snapshot 节点链路彩色 + 当前节点高亮 + trigger_context
   - **发起**：21 模板下拉 + 11 业务实体 + BusinessId + TriggerContextJson 校验 → POST /initiate
   - 行操作：Approve / Reject 联调 6 endpoint
2. **库存 `/inventory`**：
   - 列表 13 列（账面/可用/冻结/预留/累计入出/单价/金额）
   - **详情**：维度 + 数量四分账卡片 + 推算与差异
   - **编辑**：跳过（StockBalance 聚合事实源 - ApplyDelta 唯一入口业务规则说明）
3. **采购订单 `/purchase-orders`**：列表 + 详情 lines[] + 新建 Form（PlanNo/4 类型/期间正则）
4. **物料主数据 `/material-master`**：列表 + 详情 4 段 + 编辑 Form（GroupItem 三组）+ 启用/停用
5. **报表中心 `/reports`**：4-Tab + 详情（来源单据/处理结果）+ 忽略预警 Form（HandlerUserId/Reason ≤512）
6. **NC 接口监控 `/nc-interface`**：4 卡片 + 4-Tab + F-01 任务详情 / F-08 异常详情 + 手动重试 Form（[⚠️ endpoint 待补]）

### 路径 B：StockBalance + X1 OAuth2 后端验证（5 分钟）

1. **StockBalance**：
   - GET `/api/supply-cores/stock-balances?Filter=&MaxResultCount=10` → 返 StockBalanceDto 列表
   - GET `/api/supply-cores/stock-balances/1` → 单条详情
   - frontend inventory 联调真值
2. **X1 OAuth2 L1+L2**：
   - 默认 ABP InMemory fallback（InMemory 与 17a 等价）
   - 配 appsettings `Redis:Configuration` → 启 Redis 跨进程持久化（无代码改动）
   - 跑 12 守护：9 旧 (L1 行为) + 3 新 (L2 cache hit / L1+L2 miss / L2 异常 fallback)

### 路径 C：模块化 frontend 架构 + 双子代理 sweet spot（5 分钟）

1. `tree -L 2 modules/nova.supplycores/` 显示 frontend/ 与 src/ 同级
2. Sprint 19c 双子代理 sweet spot 实测：
   - Day 1-2: b (UI-2-1 0.6) + c (X1 0.4) = 1.0 PD
   - Day 3-5: b (UI-2-3 1.6) + c (UI-2-4 1.3) = 2.9 PD
   - 共 4 轮双子代理同窗口 vs 单线串行预估 6.5-7 PD = **提速 ~40%**

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 双轨 UI-2 + A2' + X1 旁路 | ✅ UI-2 完整 + X1 收编；**A2' 第三次顺延 19d** |
| 2. 累计技术债 | 全修 | ✅ #1 InventoryBalance（StockBalance 复用）+ #2 PurchaseOrders（PurchasePlans 复用）+ #3 详情页/编辑表单 + #4 OAuth2 Redis；**#5 A2' 仍顺延** |
| 3. 工时预算 | 11-13 PD | **3.9 PD 实际 + 0.3 Demo = 4.2 PD vs 11-13 预算 提速 ~65%** |
| 4. 子代理并行 | 主+b+c sweet spot 3x | ✅ Day 1-2 + Day 3-5 双子代理 4 轮（实测累计 3-4x 含模板复用） |
| 5. Codex 19b 评审 | 已就绪 | ⏳ 待 cici 触发 |
| 6. A2' 第三次顺延决策 | 19d 前 cici 评估硬截止 vs 撤 | ⚠️ **19c 第三次顺延已发生 — 19d 必须明确决策** |

### Sprint 19c 特殊性

**双子代理 sweet spot + 模块复用 = 提速 65%**：
- 后端 endpoint 部分（UI-2-1 / UI-2-2）实际复用 Sprint 7a StockBalance + PurchasePlans Domain（不需新建）— 子代理 b 工作量 0.6 PD vs 预估 1.5 PD
- 前端 6 详情 + 5 编辑模板复用 approval-center Day 2 标准模板（19b sweet spot 经验延续）
- X1 OAuth2 三次顺延一次收编（IDistributedCache ABP 标准抽象 + 主+兼容双构造保 9 旧测试零侵入）

---

## 四、Sprint 19d 候选方向（A2' 第三次顺延后必须决策）

| 候选 | 范围 | 工时 |
|---|---|---|
| **A2'-FINAL** | NC 真端点 phase 2（19a/19b/19c 三次顺延后硬截止决策窗口）| 4 PD |
| 候选 UI-3 | 剩 44 HTML 原型批量 React 化（contract-list / equipment-* / quality-check / scrap-disposal 等）| 8-12 PD |
| 候选 UI-2-5 | Playwright E2E（顺延项）| 0.5-1 PD |
| 候选 C | 详设 09 看板剩 5 类 + OLAP（持续顺延）| 7-10 PD |
| 候选 G | 详设 06 库存超储处置 + 暂估完整化（持续顺延）| 5-6 PD |

**V0.1 倾向**：**A2' 决策驱动**
- 如 NC 端 19d 前反馈 → 双轨 A2' + UI-3 部分（4 + 4 = 8 PD）
- 如 NC 端继续无反馈 → 撤 A2' 改单线 UI-3 大批量（8-12 PD）+ 19e 或 20a 重启 A2'

---

## 五、Sprint 19c Codex 评审待触发

> 占位 — Sprint 19c 完成时 cici 触发 Codex 19c 评审

**评审重点**：
- StockBalance Application + Controller 设计（DTO 字段镜像 / Mapperly partial mapper / IQueryable 过滤合理性）
- X1 OAuth2 L1+L2 双层缓存（write-through 一致性 / L2 异常 fallback / 兼容构造与主构造的边界）
- frontend 6 详情 Popup + 5 编辑 Form（DevExtreme Popup state 管理 / 校验完整性 / inventory 跳过编辑业务规则记录）
- 双子代理 race 处理（同改 6 .tsx 文件但不同函数 - c 修了 b 引入字段缺失）
- A2' 第三次顺延记录（reflection on Sprint 19a/19b/19c 三次顺延决策链）

**触发提示词**：
"评审 Sprint 19c 共 4 commits（`05f015c` V0.2 / `ce7de00` Day 1-2 UI-2-1+X1 / `ccce0ea` Day 3-5 UI-2-3+UI-2-4 / 本 commit Demo）— 重点关注 StockBalance Application + Controller / OAuth2 L1+L2 一致性 / frontend 6 详情+5 编辑模板复用质量 / 双子代理 race 处理 / A2' 第三次顺延决策"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — UI-2 完整 4 子项 3.9 PD（vs 11-13 PD 预算 提速 ~65%）+ X1 收编 + A2' 第三次顺延 19d + 3 演示路径 + Codex 19c 触发提示 + UI-2-5 E2E 顺延 19d |
