# SupplyCore 原型 v0.22

> **用途仅限演示与沟通** — 与管理层、业务部门、招标参与方对齐功能与流程。
> **非真实数据，亦非开发或验收依据。** 权威口径请以 `docs/详细设计/*` 为准。

> **命名说明**：本仓库内部使用"档 A 一阶段 / 二阶段"标识开发分批节奏（**不是招标分期**）。本原型仅展示档 A 范围内的功能与口径，**正式招标承诺范围以招标技术要求 / 功能响应清单为准**；"一阶段 / 二阶段"是档 A 内部的迭代分批节奏，与"招标二期"无关。

## 当前版本范围分层

| 分层 | 内容 | 状态 |
|---|---|---|
| **档 A 一阶段** | 框架层（store/sm/linkage/seed/nc/roles/ui，~1100 行）+ 11 页引擎接入 + 9 状态机 + 主数据 + S-05 入库主线（核心联动 + NC mock）| ✅ 完成 |
| **档 A 二阶段 P0**（5 项）| A4a 月度集体决议 + C-04/C-07/C-08/C-10 四层付款 + A4b BIZ-013/014/015/020 + A2 出库 + A8 暂估闭环 + B1 时间穿越 + A14 化整为零 | ✅ 完成 |
| **档 A 二阶段 P1**（4 项）| A3 调拨 + A5 盘点 + A12 后评价 + B3 主数据维护 | ✅ 完成 |
| **档 A 二阶段 P2**（10 项）| A6 废旧 / A7 设备租赁 / A9 委托加工 / A10 外委检修 / A11 直达使用 / A13 应急采购 / B2 数据导入导出 / B4 三对一致对账 / B5 AI Tool / B6 演示快照 | ✅ 完成 |
| **范围外** | IoT 设备实时数据接入 / Nova 完整 sub_group_id 数据范围过滤 / 信创栈联调（招标响应阶段后启动） | ⚪ 不在档 A |

**功能完整度自检表**（演示前可逐项核对）：
- 档 A 一阶段引擎层 7 个 asset：`assets/{store,statemachine,linkage,seed-data,mock-nc,roles,ui-helper}.js`
- 档 A 二阶段补丁：18 项业务页 + 状态机扩展 14 个（C-04/C-07/E-04/E-08/OP-01/M-09/M-13/S-07/S-08/S-09/S-11/S-12/S-15/S-17/S-19/S-23 等）
- F-13 NC 接口开关：14 项 BIZ（演示口径默认全开；正式实施时按合同范围用 F-13 紧急熔断）
- 角色：6 类（buyer/planner/storage_mgr/finance/it/group_committee）—— 顶部下拉切换 + 数据范围演示

**已知演示限制**（非缺陷，需在介绍时主动说明）：
- 数据范围按 sub_group_id 完整过滤为产品实施阶段事项，原型仅展示界面与口径
- 信创栈兼容性仅展示矩阵，实际联调由本系统供应商联合 NC 厂商在试运行期完成
- LocalStorage 持久化已支持 schemaVersion 检查 + 一键重置 banner（启动时检测旧数据自动提示）
- 侧栏菜单**不按角色隐藏**（仅徽标 + 数据范围按角色变化）；正式系统按 `SC.roles.canSee()` 完整过滤


## 一、如何打开

**两种方式**：

1. **直接双击**（开发 / 单页查看）：file:// 协议，打开任一 HTML 文件即可，无需构建
2. **本地 HTTP 服务**（**演示推荐**）：`python3 -m http.server 4175 --bind 127.0.0.1`，然后访问 `http://127.0.0.1:4175/prototype/`

> **为什么演示要用 http.server**：档 A 引擎层使用 LocalStorage 持久化和 BroadcastChannel 跨页同步，`file://` 下的 origin 隔离规则在不同浏览器（Chrome/Edge/Safari/Firefox）行为不一致，可能导致跨标签页数据不同步；通过 `http://127.0.0.1:4175` 把所有页面纳入同一 origin，行为最稳定。

**入口建议**：

- 工作台：`prototype/index.html`
- **档 A 引擎演示**：`prototype/requirement-list.html`（从最起点 P-01 跑完整链路，每页顶部有"档 A · N/12"主流程导航条）
- 大屏：`prototype/dashboard-bigscreen.html`（适合 1920×1080 投屏）
- AI 助理：`prototype/ai-assistant.html`（可输入互动）/ `ai-write-flow.html`（写操作完整链路演示）
- 移动演示：`prototype/mobile-stocktake.html`（手持端 PDA 扫码盘点）
- 信创矩阵：`prototype/xinchuang-matrix.html`（招标响应与选型决策）
- 引擎烟雾测试：`prototype/_engine-test.html`（含 reset 数据按钮）
- 兼容 Chrome / Edge / Safari 现代版本

## 二、本版覆盖范围（52 页 + 1 个 CSS + 9 个 JS asset）

> 标注 `★ 二阶段` 的页面 = 档 A 内部分批节奏中"二阶段"已演示项；其他无标注的为一阶段页面。
>
> 注：本表用 ★二阶段 标识档 A 内部分批节奏；侧栏菜单为减少业务方理解负担**不带此标识**，业务领域分组与本表一致。

### 工作 — 3 页

工作台 · 审批中心 · 引擎层烟雾测试（`_engine-test.html`，开发面向）

### 业务流转 — 18 页

需求计划列表 · 需求计划详情 · 采购订单 · 到货验收 · 质检 · 采购入库审核 · 库存查询 · 库存流转 · 盘点 · 移动端盘点 · 废旧处置 · 设备租赁 · 设备生命周期 · 设备维修工单 · 设备 OEE 看板 · **库存调拨** ★二阶段 · **领料出库主线** ★二阶段 · **委托加工** ★二阶段

### 采购协同 — 6 页

采购计划编排 · 采购任务分解 · 招投标 · 招投标过程归档 · **直达使用单位** ★二阶段 · **应急采购** ★二阶段

### 合同与资金 — 8 页

合同管理 · 合同详情 · 付款申请 · 资金计划月度 · 三单匹配 · 暂估闭环 · **月度集体决议** ★二阶段（A4a）· **付款执行台账** ★二阶段（A4b）

### 基础数据 — 4 页

物料主数据 · 基础档案（组织/仓库/供应商）· 供应商履约画像 · **主数据维护** ★二阶段

### 决策 / AI — 8 页

报表中心 · 报表穿透 · 预警规则配置 · AI 助理（互动）· AI 写操作完整链路 · 大屏看板（暗色投屏）· **化整为零反规避** ★二阶段 · **演示数据快照** ★二阶段

### 运维 / 集成 — 5 页

NC 接口监控 · NC 接口异常详情 · 系统管理 · 信创兼容性矩阵 · **三对一致对账（月度）** ★二阶段

**统计**：3 + 18 + 6 + 8 + 4 + 8 + 5 = **52 页**（含 `_engine-test` 已计入"工作"分组的 3 页）。
其中**二阶段已演示新页**：库存调拨 / 领料出库 / 委托加工 / 直达使用 / 应急采购 / 月度决议 / 付款执行台账 / 主数据维护 / 化整为零 / 演示快照 / 三对一致对账 = **11 页**（其余 7 项二阶段实现见现有页面的引擎接入卡）。

### v0.16 档 A 一阶段同事评审 5 项 P1/P2 修复

档 A 一阶段 v0.15 收口后，同事评审发现 5 项联动断链 / 口径不一致问题，本版修复：

| # | 评审项 | 问题 | 修复 |
|---|---|---|---|
| **P1-1** | P-01 审批后未进入 P-02 链路 | `P-01:已审` 是终态，无 linkage 触发聚合 | 新加 `linkage.on('P-01:已审')` → 按当月 + org 找/创 P-02 草稿 + 创建 P-03 行 + 累加 P-02 金额（幂等：按 source_request_no 查重）|
| **P1-2** | P-02 → P-05 不幂等 | 直接 create，重复 emit 会重复创建 | 改 linkage：先 `list('P-05', { plan_id })` 按 plan_line_id 索引查重；seed 移除 P-02/P-03 已审项（避免诱导）；`_engine-test.html` approveP02 去掉重复 emit，只走 sm.transition |
| **P1-3** | 直采 / 合同采购 跑不到订单 | linkage 只处理招采/直采，合同采购漏；S-01 没状态机 | 加 S-01 状态机（草稿/待审/已审/已驳回/已作废）+ `linkage.on('S-01:已审')` → 自动 create S-02；`P-05:草稿→已分解` 加合同采购分支（关联现有 C-02 已签）|
| **P2-1** | 审批中心 C-01/C-02 口径不一致 | TODO_RULES 写 C-02 会签中，文案说 C-01 | 加 C-01 状态机；TODO_RULES 改 C-02 → C-01（stateField=approval_state）；contract-detail.html 手工 `engineApproveC01` 改用 `SC.sm.transition('C-01', ...)`；新加 `linkage.on('C-01:已批准')` → 自动 create C-02 已签 |
| **P2-2** | C-04 残留文案 | "付款节点（C-04）"、"修订 C-04 节点" 等 | contract-detail.html 改文案：付款节点 → 付款条件（payment_terms 文本字段）+ 标注"C-04 节点移二阶段 A4"；C-02 创建带 payment_terms 默认文本 |

**架构原则一致性**（V0.4a 收口延续）：
- 状态机只迁移状态，副作用全在 linkage
- 所有 linkage 创建动作幂等（按业务键查重）
- 关键状态转换走统一 `SC.sm.transition`，不在页面手工 `SC.store.create`/`emit`

**端到端联动测试**（修复后预期）：
```
P-01 #1 [草稿] → 提交审批 → 审批通过 → 已审 (final)
   ↓ linkage on('P-01:已审')
P-02 #1 [草稿] auto-created（period=2026-04, org=艾友矿）+ P-03 #1 行
P-01 #2 [草稿] → 提交审批 → 审批通过 → 已审 (final)
   ↓ linkage（org 不同 → 新建 P-02 #2，period=2026-04, org=东梁矿）
P-02 #2 [草稿] + P-03 #2 行
   ↓ 计划员审批 P-02 #1 (sm.transition '提交审批' → '审批通过')
   ↓ linkage on('P-02:已审')（幂等：仅 plan_line_id 未 create 过的才创建）
P-05 #1 [草稿] (按 P-03 #1)
   ↓ 选 tender_type → '确认分解'（sm.transition）
   ↓ linkage on('P-05:草稿→已分解')
T-01 #1 / S-01 #1（按路径）
   ↓ S-01 审批通过 (sm.transition '提交审批' → '审批通过')
   ↓ linkage on('S-01:已审')
S-02 #1 [草稿]
```

### v0.15 档 A 一阶段 · Week 6 收口（核心报表 + 演示脚本 + 一期完成 ✅）

按 02 V0.4 §八 第 6 周路线图，核心报表 + 演示脚本 + 一期完成：

- `reports.html` 顶部加 **E3 核心报表**（5 张实时聚合）：
  - **RPT-INV-001 库存余额表** — 来自 S-13，含 unit_cost 移动平均
  - **RPT-INV-002 收发存报表** — 按物料聚合 S-21（入/出/净）
  - **RPT-FIN-001 接口推送状态** — F-01 按状态 + 按接口聚合，含 F-08 异常计数
  - **RPT-PUR-001 采购入库汇总** — S-05 已审 × S-25 行 按物料聚合
  - **RPT-WF-001 审批超时统计** — 待审 P-01/P-02/C-02 + ALR-WF-001 计数
  - tab 切换；订阅所有相关实体，任何变化实时重渲染（无缓存）

- 新增 `docs/原型设计/05-档A演示脚本-V0.1.md`：
  - 场景 1：正常采购入库 happy path（24 步 / 5 分钟，覆盖端到端）
  - 场景 2：流标 → 重新走集体决策（13 步 / 合规防火墙）
  - 场景 3：NC 失败 → 自动重推 → 成功（28 步 / 治理闭环）
  - 辅助场景：6 角色切换 + 口径 Q&A + 重置数据

### 档 A 一阶段路线图：6 周全部完成 ✅

| 周 | 内容 | 状态 |
|---|---|---|
| **Week 1** | 框架层：store / sm / linkage / seed / nc / roles / ui | ✅ |
| **Week 2** | 业务前段：需求 → 计划 → 任务 → 招采 | ✅ |
| **Week 3** | 业务中段：合同 → 订单 → 验收 → 质检 | ✅ |
| **Week 4** | 核心联动 + NC mock：S-05 库存原子事务 + F-01 推送 | ✅ **核心亮点** |
| **Week 5** | 一类扩展：审批中心 E1 + 预警中心 E2 + 动态徽标 | ✅ |
| **Week 6** | 核心报表 E3 + 演示脚本 + 整体验收 | ✅ |

**档 A 一阶段交付**：
- 7 个引擎 asset（store / statemachine / linkage / seed-data / mock-nc / roles / ui-helper），约 1100 行
- 11 个原型页面引擎接入（含 1 个新建 purchase-receipt.html）
- 9 状态机 + 6 个预定义 linkage + 4 类自动预警
- 5 张核心报表（实时聚合）
- 演示脚本 3 主场景 + 1 辅助
- LocalStorage 持久化 + BroadcastChannel 跨页同步

**Week 1+2+3+4+5+6 端到端**（5 分钟核心演示）：
```
P-01 创建 → 审批 (1 节点)
   ↓
P-02 创建+P-03 → 多节点审批 → 已审
   ↓ linkage 自动
P-05 草稿 → 选 tender_type → 确认分解
   ↓ linkage 自动
T-01 → 已审 → T-03 → 直录中标 T-05
   ↓ linkage 自动
C-01 → 三部门并行会签 → C-02 已签
   ↓ 手动
S-02 创建+下达 → NC 同步
   ↓
S-03 + D3 → S-04 串行短路 → S-05 草稿
   ↓ 提交审核 → 审核通过
   ↓ linkage 原子事务
S-21 流水 + S-13 余额（移动平均）+ S-14 批次 + F-01 NC 任务
   ↓ mock-nc 1-2 秒
F-03 凭证回执
   ↓
5 张核心报表实时聚合 + sidebar 红点动态变化
```

档 A 一阶段 Week 6 **完成 100%**。下一阶段：档 A 二阶段（按 03 V0.2，等业务方反馈触发，不主动推进）。

### v0.14 档 A 一阶段 · Week 5 治理能力（E1 审批中心 + E2 预警中心 + 动态徽标）

按 02 V0.4 §八 第 5 周路线图，治理能力 2 个核心扩展接入引擎：

| 页面 | 引擎面板 | 核心机制 |
|---|---|---|
| `approval-center.html` | E1 审批中心三段视图（待办 / 已审过 / 我发起占位）+ 跨实体聚合 | 一键审批跨实体（P-01/P-02/C-02/T-01/S-02/S-05），按角色过滤 |
| `alert-rules.html` | E2 预警中心三段视图（未读 / 已确认 / 已处理）+ 4 类自动预警按钮 | 流标 / NC 失败 / 库存异常 自动 emit；审批超时 mock 触发 |

**linkage.js 扩展（v0.14）** —— 3 个自动预警 + 1 个 mock 触发器：
- `T-03:流标` → 自动 create R-05 ALR-PUR-002（重要级）
- `F-01:推送失败` → 自动 create R-05 ALR-INT-001（一般 / 紧急级 by retry_count）
- `S-13` create/update → 检查 quantity 阈值（< 50 低储 / > 1500 超储）→ create R-05 ALR-INV-001/002
- `SC.linkage.mockTriggerWFTimeout()` → 给所有当前待审 P-01/P-02 创建 ALR-WF-001（替代时间穿越）

**chrome.js v0.14** —— 动态徽标：
- `SC.updateBadges()` 在 sidebar render 后 200ms 调用
- 检查 `SC.roles.badgeCounts()` 计算当前角色的 todo / alert 数量
- 动态更新 sidebar"审批中心"和"预警规则"链接的红点徽标
- 引擎未加载时静默不干扰静态徽标

**Week 5 端到端**：
```
1. 在 approval-center 一键通过 P-02 → linkage 自动 P-05 + 切到 alert-rules 看预警计数
2. 进入 tender 流标 T-03 → 自动 ALR-PUR-002 → 切到 alert-rules 看到
3. 进入 purchase-receipt 触发 S-05:已审 → S-13 异常 → 自动 ALR-INV
4. 用 mock 按钮触发 ALR-WF-001 审批超时（演示用替代时间穿越）
5. 标记预警 已确认 → 已处理 → sidebar 红点动态减少
```

### v0.13 档 A 一阶段 · Week 4 核心联动 + NC mock（1 新页 + 3 页接入）

按 02 V0.4 §八 第 4 周路线图，Week 4 是档 A 一阶段的**核心演示亮点**：S-05:已审 触发库存原子事务 + NC mock 推送：

| 页面 | 引擎面板 | 演示亮点 |
|---|---|---|
| **NEW** `purchase-receipt.html` | S-05 入库审核（带 mock 行）+ 实时观察原子事务效应 | 点"审核通过" → 同事务内 4 件事原子完成（S-21 流水 + S-13 余额移动平均 + S-14 批次 + F-01 NC 任务）+ 1-2 秒后 F-03 凭证回执 |
| `nc-interface.html` | F-01 接口任务 + 重推 + F-13 BIZ-001 开关切换 | 状态分层（推送状态 vs 财务状态）+ 强制成功 / 强制失败 / 立即重推 演示按钮 |
| `inventory.html` | S-13 余额 + S-14 批次 + S-21 流水穿透 | **一致性自动校验**：S-13.quantity = S-21 累计 quantity_delta（绿✓ / 红✗ 实时）|
| `nc-interface-detail.html` | F-08 异常台账（≥3 次重推失败升级）| 高敏感处置入口：编辑映射 / 重推 / 关闭 |

**Week 4 端到端核心演示**（2-3 分钟）：
```
1. 进入 prototype/purchase-receipt.html
2. 点"+ 创建 S-05 草稿"（自动带 3 行 mock：锚杆 200 / 雷管 1000 / 截齿 80）
3. 点"提交审核" → 状态 待审
4. 点"审核通过" → 状态 已审 + 同事务内：
   - 3 行 S-21 库存事务流水（+200 / +1000 / +80）
   - 3 条 S-13 库存余额（unit_cost 移动平均自动计算）
   - 1 条 S-14 批次（雷管 B202605-101）
   - 1 条 F-01 NC 任务（待推送 → 推送中 → 1-2 秒后 推送成功 → F-03 凭证回执 NCxxxx）
5. 切到 inventory.html 看 S-13/S-14/S-21 同步出现 + 一致性校验绿✓
6. 切到 nc-interface.html 看 F-01 任务最新状态
7. （可选）点"强制失败" 演示自动重推；连续 3 次失败 → F-08 异常台账
```

**核心架构落地**（02 V0.4 §6.3）：
- 库存原子事务由 `SC.store.transaction(['S-21','S-13','S-14','F-01'], fn)` 保证
- 移动平均：`unit_cost = (旧总额 + 入库金额) / (旧数量 + 入库数量)`
- 状态分层：F-01.task_state（推送中/成功/失败）独立于 F-01.finance_state（已记账）
- F-13 BIZ-001 开关默认开；切换为关 → S-05 已审不再创建 F-01（演示开关治理）
- 自动重推：30 秒延迟 + ≤3 次；超 3 次升 F-08 异常台账

### v0.12 档 A 一阶段 · Week 3 业务中段（4 页接入引擎）

按 02 V0.4 §八 第 3 周路线图，业务中段 4 个页面接入引擎，承接 Week 2 端到端：

| 页面 | 引擎面板内容 | 演示路径 |
|---|---|---|
| `contract-detail.html` | C-01 会签（D4 三部门并行）+ C-02 8 状态机 | T-05 中标 → C-01 一键三部门会签通过 → 生成 C-02 已签 |
| `purchase-orders.html` | S-02 订单 + 关联 C-02 + NC mock 同步 | C-02 → 创建 S-02 → 下达 → NC 同步 → 部分到货 → 全部到货 → 已关闭 |
| `goods-receipt.html` | S-03 到货 + D3 质检开关 | S-02 → 创建 S-03 → 勾选「需要质检」→ 验收 → 创建 S-04 / 不勾选 → 直接生成 S-05 |
| `quality-check.html` | S-04 三类验收串行短路 | 待检 → 品种合格 → 数量合格 → 质量合格 → 自动生成 S-05；任一不合格短路入待验区 |

**端到端测试路径**（Week 1 + 2 + 3 全程引擎）：
```
P-01 创建 → 提交 → 审批通过
   ↓
P-02 创建（含 P-03）→ 审批 → 已审
   ↓ linkage
P-05 草稿 (×N) → 选 tender_type → 确认分解
   ↓ linkage
T-01 → T-03 → 直录中标 T-05
   ↓ linkage
C-01 会签 → 三部门并行通过
   ↓ 手动
C-02 已签 → 执行中
   ↓ 手动
S-02 订单 → 下达 → NC 同步
   ↓ 手动
S-03 到货 → D3 质检开关
   ↓
分支 A：勾选 → S-04 三类串行 → 全合格 → 自动 S-05 草稿
分支 B：不勾选 → 直接 S-05 草稿
   ↓ Week 4
S-05 已审 → 库存原子事务（S-21 + S-13 + S-14 + F-01 NC 推送）
```

Week 3 完成后，整条采购入库主线（除 S-05 已审的核心库存原子事务外）已全部走通；Week 4 重点演示 S-05 已审的核心联动 + 库存视图 + NC mock 监控。

### v0.11 档 A 一阶段 · Week 2 业务前段（4 页接入引擎）

按 02 V0.4 §八 第 2 周路线图，业务前段 4 个页面**叠加引擎面板**（保留原静态 UI 作为对照），形成端到端联动：

| 页面 | 引擎面板内容 | 演示路径 |
|---|---|---|
| `requirement-list.html` | P-01 列表 + 创建草稿 + 状态迁移按钮 | 创建 → 提交审批 → 审批通过 |
| `purchase-planning.html` | P-02 列表 + 多节点审批 + P-03 / P-05 计数 | 审批通过 → linkage 自动生成 P-05 草稿 |
| `purchase-task-decomposition.html` | P-05 草稿表 + tender_type 选择 + 路径分流 | 选招采 → 确认分解 → linkage 自动 create T-01 |
| `tender.html` | T-01 / T-03 / T-05 三栏 + 流标按钮 | 直录中标 → linkage 自动 create C-01 会签 |

**端到端烟雾测试路径**（全部走 SC.store + SC.sm + SC.linkage）：
```
P-01 创建 → 提交审批 → 已审
   ↓
P-02 创建 + P-03 行 → 提交审批 → 已审
   ↓ (linkage 自动)
P-05 草稿（按 P-03 行预生成）
   ↓ (人工选 tender_type → 确认分解)
T-01 招标申请（招采） / S-01 采购申请（直采）
   ↓ (T-01:已审 → 生成 T-03)
T-03 标包 → 直录中标 T-05
   ↓ (linkage 自动)
C-01 合同会签
```

每个引擎面板：边框蓝色（与原静态 UI 区分）+ 顶部"📡 档 A 引擎接入"标识 + LocalStorage 持久化（刷新页面数据保留）+ BroadcastChannel 跨页同步 + SC.ui.toast 操作反馈。

引擎面板与原静态 UI **并存**：用户能在同一页面看到"老演示数据"和"新引擎活数据"，确认升级前后行为对应。

### v0.10 档 A 一阶段 · Week 1 框架层完成（按 02 V0.4 §八 路线图）

按 `docs/原型设计/02-档A增强原型实施方案-V0.4.md` 启动一期实施，第 1 周交付**引擎层 7 个新文件 + 1 个烟雾测试页**（chrome.js 版本号同步升 v0.10）：

#### 1. `assets/store.js` — LocalStorage 数据层
- CRUD API：`list / get / create / update / remove / upsert`
- 持久化：`SC.store.seed(seedData)` 初次填充；`SC.store.reset()` 重置到 seed
- 跨页广播：BroadcastChannel('sc-state-bus') + `SC.store.subscribe(entity, cb)`
- 事务：`snapshot / rollback / transaction(entities, fn)`（库存原子事务必备）
- 取号：`SC.store.nextNo(prefix, padDigits)` — 按月份 + 序号生成业务编号
- 调试：`SC.store.stats()` — 列出所有实体记录数

#### 2. `assets/statemachine.js` — 9 状态机引擎
- API：`define / has / canTransition / getAllowedEvents / transition / debug`
- guards 校验机制（如 `hasLines / allTasksDecomposed`）
- transition 触发后自动 emit `entity:targetState` 和 `entity:from→to` 两个 linkage 事件
- 预定义 9 个状态机：**P-01** 需求 / **P-02** 采购计划 / **P-05** 采购任务 / **T-01** 招标申请 / **T-03** 标包（含流标 E5）/ **C-02** 合同 / **S-02** 采购订单 / **S-03** 到货 / **S-04** 质检（D3 串行短路） / **S-05** 采购入库

#### 3. `assets/linkage.js` — 联动总线（V0.4a 收口：状态机不做副作用）
- API：`on / off / emit / debug`
- 预定义关键联动：
  - `P-02:已审` → 自动按 P-03 计划行预生成 P-05 草稿
  - `P-05:草稿→已分解` → 路径分流（招采→T-01 / 直采→S-01）+ 检查 P-02 全部分解完毕则触发 P-02 自动转「已分解」
  - `T-05:已验证` → 自动创建 C-01 会签
  - `C-02:已签` → 初始化 executed_amount/paid_amount
  - `S-05:已审` → **核心库存原子事务**（S-21 流水 + S-13 余额移动平均 + S-14 批次 + F-01 NC 接口任务），事务包裹保证原子性
  - `F-01:推送失败` → 30 秒后自动重推（≤3 次）；超 3 次升级 F-08 异常台账

#### 4. `assets/seed-data.js` — 主数据预填
- M-01 组织（6 条：集团 + 物资公司 + 4 矿）
- M-02 仓库（6 个含火工品专管库）
- M-05 物料（10 个覆盖支护 / 电缆 / 火工品 / 设备 / 通风等）
- M-09 供应商（5 家含 role_tags）
- M-12 成本中心（4 个）
- F-13 NC 开关（14 个 BIZ：001/002/003/005/005A/007/008/009/010/011/012/013/014/015/019/020 演示口径全开，正式实施按合同用 F-13 紧急熔断）
- 业务种子：P-01 草稿 3 条（让用户从最起点演示 → linkage 自动聚合 P-02/P-03 + 拆解 P-05）+ C-02 已签合同 1 条（演示付款链路起点）+ M-13 后评价 3 条（演示供应商重评估）

#### 5. `assets/mock-nc.js` — NC 推送 mock（Day 4）
- `SC.nc.push(taskId)`：1-2 秒延迟 + 5% 失败率（可配）
- 成功 → 创建 F-03 凭证回执 + 更新 F-01 task_state=推送成功 + 写 nc_voucher_no
- 失败 → 更新 F-01 task_state=推送失败 + emit `F-01:推送失败` 触发 linkage 自动重推（≤3 次，超 3 升 F-08）
- 调试：`SC.nc.simulateSuccess(taskId)` / `simulateFailure(taskId)` / `setConfig(overrides)`

#### 6. `assets/roles.js` — 6 角色定义与能力（Day 5a）
- 6 角色 + capabilities：**采购员** / **计划员** / **物资主管** / **财务** / **IT** / **集团委员会**
- 每角色含：menus 可见菜单 + dataScope（GROUP/OWN_MINE/OWN_DEPT）+ defaultLanding + description
- API：`current / currentInfo / set / list / canSee(menu) / dataFilter(entity) / badgeCounts`
- `set()` 触发 BroadcastChannel 跨页广播 `{ type: 'role-change' }`
- `badgeCounts()` 按角色返回 { todo, alert } — 物资主管看 P-02 待审 / 财务看 C-02 会签 / IT 看 F-01 推送失败 / 通用看 R-05 未读

#### 7. `assets/ui-helper.js` — 统一 UI 组件（Day 5c）
- `SC.ui.toast(msg, type, duration)` — 4 种类型（info/success/warning/error），3 秒自动消失，右上角堆叠
- `SC.ui.alert(msg, opts)` — Promise-based，统一替代 window.alert
- `SC.ui.confirm(msg, opts)` — Promise-based，返回 boolean
- `SC.ui.prompt(msg, opts)` — Promise-based，返回字符串或 null（取消）
- `SC.ui.loading(true/false, msg)` — 全屏遮罩 + 旋转 spinner
- 自动注入样式（一次性），不依赖任何 CSS 文件

#### 8. `prototype/_engine-test.html` — 烟雾测试页（9 卡）
开发面向，验证引擎层端到端：
- ① Seed 主数据状态 + reset
- ② P-01 CRUD + 状态迁移（草稿 → 待审 → 已审）
- ③ P-02 审批 → linkage 自动生成 P-05 草稿 → 分解路径分流
- ④ 状态机引擎调试（已注册 SM + 当前 P-01 可执行 events）
- ⑤ 联动总线调试（已订阅事件 + 触发计数）
- ⑥ BroadcastChannel 跨页验证（在另一标签页操作 → 实时收到）
- ⑦ **NC mock**：S-05:已审 → 库存原子事务 + F-01 推送（随机失败 / 强制成功 / 强制失败）
- ⑧ **6 角色切换**：6 角色按钮 + 能力面板 + badgeCounts
- ⑨ **UI 组件演示**：toast/alert/confirm/prompt/loading

#### 路线图位置

| 周 | 内容 | 状态 |
|---|---|---|
| **Week 1** | 框架层：store / sm / linkage / seed / nc / roles / ui | ✅ **完成** |
| **Week 2** | 业务前段：需求 → 计划 → 任务 → 招采 | ✅ **完成** |
| **Week 3** | 业务中段：合同 → 订单 → 验收 → 质检 | ✅ **完成** |
| **Week 4** | 核心联动 + NC mock：S-05 库存原子事务 + F-01 推送 | ✅ **完成**（核心亮点）|
| **Week 5** | 一类扩展：审批中心 E1 + 预警中心 E2 + 动态徽标 | ✅ **完成** |
| **Week 6** | 核心报表 E3 + 演示脚本 + 整体验收 | ✅ **完成 — 一期收口** |

**Week 1 验证**：浏览器打开 `prototype/_engine-test.html` → 点 9 个测试卡 → 所有功能可用；同时打开两标签页验证 BroadcastChannel 实时同步。

### v0.9 P1 收口要点（不新增页面，4 页深化）

#### 1. `contract-detail.html` — 合同变更与履约节点深化
- **变更冻结顶部 banner**：当存在待审 / 已审未生效的变更时，提示付款节点已冻结
- **履约节点表（C-04 履约视角）**：与左侧"付款节点"分层 — 这里展示履约动作（合同生效 / 到货 / 验收 / 质保期）的计划 vs 实际对比 + 履约偏差
- **合同变更记录（C-05）**：示例 2 条 — 数量变更已生效（金额 +¥48 万）+ 付款条件变更待审；展示编号 / 类型 / 原因 / 金额变化 / 提交+生效日 / 状态 + 联动规则说明
- **履约预警**：对齐详设 09 V1.2 §六 ALR-CON-* — 合同到期、变更待审过期、外委超限等
- **变更冻结控制 KV**：冻结状态 / 受影响节点 / 起始日期 / 归口部门

#### 2. `contract-list.html` — 列表加变更列
- 新增"变更"列，展示 changeCount 计数 + 待审角标（amber 表示有待审变更）

#### 3. `payment-request.html` — 变更冻结提示
- 顶部加 amber 警示卡：关联合同存在待审变更时，付款节点不允许新建付款申请

#### 4. `equipment-rent.html` — 设备租赁计费深化
- **flow-strip 7 步**：申请 → 审批 → 登记 → 起租 → 在租/月度费用 → 续/停租 → 退租+交接（原 6 步细化）
- **租赁详情面板（示例 ZL-2026-0211 采煤机）**：设备 / 出租方 / 承租 / 合同 / 租期 / 月租金+总额 / 计费模式（MONTHLY/ONE_TIME）/ 计费规则 / 读数（起→当前）
- **月度费用汇总 E-13**：3 个月 mock 数据 + 计费天数 / 不计费天数 / 月租金 / 调整 / 应付 / 累计 / 关联付款 + 月末批处理 / 推付款 演示按钮
- **付款节点 C-04**：5 个节点（起租预付 / 月度结算 ×3 / 退租结算+质保金退还）
- **三笔保证金独立核算卡**：押金（¥50,000）/ 履约保证金（§8.6 触发，¥51,600）/ 租赁质保金（§8.10+政策 02 第四十一条触发，¥25,800，仅现金 5%）— 强调三笔不冲抵
- **租赁动作面板**：续租（E-10）/ 停租（E-11）/ 退租（E-12）三个动作 + 简短说明 + 演示按钮
- **全生命周期 timeline**：申请 → 审批 → 合同签订 → 登记 → 起租 → 在租中（current）→ 退租+交接
- **新增 1 个一次性收费案例**（ZL-2026-0216 应急排水泵 ¥18,000 / 3 天），演示 paymentMode=ONE_TIME 场景

### v0.8 详设同步要点

#### 1. `tentative-estimate.html` — 暂估闭环
- 4 张 KPI（暂估余额 / D-90 / D-30 / D-0 阻断 + D+30 转报）
- 暂估台账：暂估单、入库单、供应商、暂估金额、6 个月截止、剩余天数、NC 状态
- D-90 / D-30 / D-0 / D+30 四阶段控制链路（对齐详设 06 V1.1a §7.6.4）：催票、联合处理、三单匹配、冲减暂估、D-0 阻断、D+30 月度专项对账
- 预警等级标注：D-90 ALR-INV-006 一般级 / D-30 ALR-INV-006B 重要级 / D-0 ALR-INV-007 紧急级
- 明确 BIZ-002 暂估、BIZ-003 冲销、三单匹配之间的关系

#### 2. `purchase-planning.html` — 采购计划与标包编排
- 全流程图：基层需求审批 → 采购计划 → 采购任务 → 标包 / 招采 → 合同 → 采购订单 → 到货入库
- 采购计划行汇总：展示来源需求、单位、物资范围、预算金额、采购方式、路径和状态
- 标包编排：展示 T-03/T-07 标包、合包 / 拆包、供应商数量和审批规则
- 明确“需求审批通过后先进入计划汇总，不是直接招标”

#### 3. `purchase-task-decomposition.html` — 采购任务分解（B 方案深化）
- "全流程 Step 3 放大视图" 标注 + 子步号 3.1-3.5（与采购计划编排页 7 步全流程对齐）
- **mergeGroup 颜色组联动**：6 条计划行 ↔ 5 个任务用 5 色绑定，鼠标悬停同色组联动高亮
- **合并案例 + 拆分案例 两张高亮卡片**：合并案例 PT-001（综采+掘进备件 2 → 1）；拆分案例 PT-005（外委检修按管控独立）
- **P-05 任务表 12 列实例化**：编号 / 名称含管控 / 来源+组织 / 金额 / 路径 / 业务流向 / 计划交付 / 紧急度 / 供应商或合同范围 / 后续单据 / 状态
- 计划行按"建议路径 + 分解原因"展示，任务按"业务流向（外购/直达设备/外委检修等）+ 紧急度"分类
- 右栏：分解规则 / 路径分流结果 / 操作留痕 timeline（系统预分解 → 计划员确认 → 后续单据）/ 下一步演示入口
- 演示模式按钮：合并 / 拆分 / 重新预分解 / 确认生成 P-05 / 批量生成后续单据 均带 alert 提示
- 强调 P-05 是计划进入执行的分水岭，不等同于招标项目、合同或订单

#### 4. 已有页面详设同步
- 需求计划 / 采购订单：补 `fulfillment_type`，展示外购入库、直达材料、直达设备、外购代储、外委检修、委托加工；非目录直达触发 WF-DIR-001
- 采购计划编排 / 采购任务分解：补需求审批后进入采购计划、P-05 任务分解、路径分流和标包编排的中间层演示，避免误解为需求审批后直接招标
- 库存查询 / 预警：低储按 `safety_stock`，超储按储备资金 110% + 周转天数双维度
- 设备维修工单 / 合同：补外委检修审批、内部能力判断、40% 原值上限、WF-RPR-001、WF-CON-OVERLIMIT-001、SENS-CON-004
- 合同详情 / 付款申请：补履约保证金收取、退还 SLA、没收高敏感 SENS-CON-003，以及质保金边界
- 审批中心 / 系统管理：补 WF-DIR-001、WF-RPR-001、WF-CON-OVERLIMIT-001、WF-SUP-REASSESS-001
- 供应商履约 / 质检：补防爆 / 煤安异常和后评价差评自动反馈至供应商重评估
- NC 接口：外委检修凭证保留待确认占位，不在原型中写死科目

### v0.7 新页面要点

#### 1. `equipment-oee.html` — 设备 OEE 看板
- 4 张 KPI（综合 OEE / 运行率 / 性能率 / 良品率）+ OEE 公式条
- **关键设备 OEE 排行**：12 周迷你趋势条 + 故障数 + OEE < 60% 自动飘红
- **近 12 周故障频次趋势**：双色堆叠柱图（故障维修 + 计划保养）
- **单设备 OEE 详情**：环形仪表（46% 预警）+ 三联指标 + 主要拖累分析
- 本月停机原因构成横向条形 + 指标定义与回写来源说明 + 边界

#### 2. `nc-interface-detail.html` — NC 接口异常详情
- 任务概要：接口 / 关联业务 / 触发时间 / 业务执行状态（与推送状态分层）
- **错误诊断**：NC 错误码 + 可能原因 + AI 建议处置（按推荐顺序）
- 4 个 Tab：请求报文 / 响应报文（深色代码块带语法高亮）/ 重试历史 / 审计与处置
- **人工处置入口**：触发主数据下推 / 编辑映射 / 忽略 / 关闭 / 重推（高敏感审批）
- 解释三类错误级别（BUSINESS / SYSTEM / NETWORK）的不同重试策略

#### 3. `three-way-match.html` — 三单匹配
- 4 张 KPI（待匹配 / 自动通过率 / 差异挂账 / 异常拒付）
- 匹配清单 + 匹配状态 + 差异类型筛选
- **示例 1 · 匹配通过**：三栏对比（订单 / 入库 / 发票）一致 → 生成应付凭证
- **示例 2 · 差异挂账**：差异行标红 + 系统判定 + 关联单据 + 例外审批入口
- 三单容差配置（数量/金额/单价 ±1%）+ 边界（不替代财务做账、暂估闭环联动）

### v0.6 新页面要点

#### 1. `inventory-flow.html` — 库存流转
- 以“申请填报 → 库存校核 → 审批/双人复核 → 出入库执行 → 台账流水原子写入 → NC 接口任务”串起库存流转闭环
- 三个页签：领料出库 / 退料入库 / 调拨单
- 明确领料、退料、调拨对 S-13 库存台账、S-14 批次账、S-21 库存事务流水的影响
- 强调火工品、危险化学品、盘亏调整、跨组织调拨等高敏感审批与审计控制

#### 2. `supplier-performance.html` — 供应商履约画像
- 从“基础档案”提升到独立供应商管理视角
- 展示准入待审、合格、暂停接单、黑名单等状态
- 展示交付准时率、验收一次合格率、退货次数、履约等级和风险标签
- 明确供应商准入、评价、暂停、黑名单与招投标/合同/采购订单联动

#### 3. `tender-archive.html` — 招投标过程归档
- 展示计划来源、标包拆分、采购文件、平台开评标、结果回传归档、合同生成链路
- 归档采购文件、公告回执、开标记录、评标报告、评委签字表、中标通知书
- 增加完整性校验、一致性校验、审计留痕、合同联动规则
- 明确本系统不替代能源集团招采平台开评标过程，只负责资料回传归档与合同联动

#### 4. `alert-rules.html` — 预警规则配置
- 展示安全库存、合同履约、NC 接口、供应商资质、报表订阅等预警规则
- 展示今日预警记录和报表订阅推送
- 明确 AI 可以解释预警和生成建议，但不能自动关闭预警、绕过审批或替用户提交单据

### v0.5 新页面要点

#### 1. `maintenance-order.html` — 设备维修工单（E-04）
- 5 单工单列表 + 完整一单详情（掘进机 EBZ200 故障维修）
- 6 节点流转条：故障报修 → 调度派工 → 到达现场 → 检修执行 → 试运行验证 → 验收关单
- 故障描述 + 现场诊断分色卡片（红色故障 / 蓝色诊断）
- **备件领用子表**：联动 S-22 领料申请 + 物料编码 + 出库状态
- **关单后自动回写**：设备生命周期 / 维修历史 / 库存事务流水 / NC-MD-005 保修索赔 / OEE 指标
- 现场照片附件区

#### 2. `mobile-stocktake.html` — 移动端扫码盘点
- **360×720 手机外框预览**（含状态栏、应用栏、扫码区动画）
- 扫码动画区（青绿色扫描线沿框上下移动）
- 当前区域 + 盘点进度条（836/1284 = 65%）
- 待盘下一项卡片 + 最近已盘列表（含盘亏标红）
- 右侧：交互说明（扫码方式 / 离线缓存 / 挂起续盘 / 权限）+ 后端联动 timeline + 硬件建议（Honeywell EDA52 / Urovo i6310）

#### 3. `ai-write-flow.html` — AI 写操作完整链路
- 完整 6 轮对话演示：用户提需求 → AI 收集字段 → 用户口语化补充 → AI 字段识别 → 用户确认 → AI 生成草稿
- **关键边界明示**（红色徽章）：AI 不会代替用户提交单据
- 右侧"待提交需求草稿"虚线大框（蓝色 dashed border 醒目区分）
- **3 个底部按钮**：取消 / 编辑后提交 / **✓ 我已确认 · 提交**（点击有提示）
- 7 条 AI 写操作能力边界：3 项允许（绿）+ 3 项禁止（红）+ 1 项审计（蓝）
- 提交后审计与审批路径垂直 timeline（含 source = AI_ASSISTED 标注）

#### 4. `xinchuang-matrix.html` — 信创兼容性矩阵
- 4 张测试覆盖统计卡（已测 / 通过 / 部分通过 / 阻塞）
- **6 大兼容层矩阵**（操作系统 / 数据库 / 中间件 / 浏览器 / 办公软件 / CPU 架构）
- 每层内多个产品 × 4 个目标 OS（麒麟 / 统信 / Windows 过渡 / 欧拉）的支持网格（绿✓ / 灰— / 黄~）
- 每行含厂商 + 备注（推荐 / 内核 / 联调要求等）
- 4 条关键说明：推荐组合 / 过渡兼容 / 注意事项
- **招标技术响应承诺**卡：最低支持范围 / 双架构 / 过渡期 / 联调责任

## 三、暂未覆盖（后续候选）

- **租赁计费深化**：起租、停租、退租、费用汇总、付款联动（部分需 P0 业务方回执后再做）
- **合同变更与履约节点深化**：变更审批、履约节点预警（受 P0 Q-04 集团三部门串/并行影响）
- **委托加工台账 / 直达使用单位流程**：受 P0 Q-07 / Q-08 影响
- **真实后端 / 升 C 档**：平移到 `../SupplyCores/modules/nova.supplycores/frontend` 的 Vite/React 工程

## 四、文件结构（52 个 HTML + 1 个 CSS + 9 个 JS asset）

```
prototype/
├── README.md
├── index.html                          工作台
├── approval-center.html                审批中心
├── _engine-test.html                   引擎层烟雾测试（开发面向，9 卡）
│
├── 业务流转
│   ├── requirement-list.html / requirement-detail.html
│   ├── purchase-orders.html / goods-receipt.html / quality-check.html / purchase-receipt.html
│   ├── inventory.html / inventory-flow.html / stocktake.html / mobile-stocktake.html
│   ├── inventory-transfer.html       (二阶段 A3 调拨)
│   ├── material-issuance.html        (二阶段 A2 出库主线)
│   ├── outsourced-processing.html    (二阶段 A9 委托加工)
│   ├── scrap-disposal.html / equipment-rent.html / equipment-lifecycle.html
│   └── maintenance-order.html / equipment-oee.html
│
├── 采购协同
│   ├── purchase-planning.html / purchase-task-decomposition.html
│   ├── tender.html / tender-archive.html
│   ├── direct-delivery.html          (二阶段 A11 直达使用)
│   └── emergency-purchase.html       (二阶段 A13 应急采购)
│
├── 合同与资金
│   ├── contract-list.html / contract-detail.html
│   ├── payment-request.html / funding-plan.html / three-way-match.html / tentative-estimate.html
│   ├── council-meeting.html          (二阶段 A4a 月度集体决议)
│   └── payment-execution.html        (二阶段 A4b 付款执行 + BIZ-013/014/015/020)
│
├── 基础数据
│   ├── material-master.html / base-archive.html / supplier-performance.html
│   └── master-data-admin.html        (二阶段 B3 主数据维护)
│
├── 决策 / AI
│   ├── reports.html / report-detail.html / alert-rules.html
│   ├── ai-assistant.html / ai-write-flow.html
│   ├── split-detection.html          (二阶段 A14 化整为零反规避)
│   ├── demo-snapshot.html            (二阶段 B2/B6 数据快照)
│   └── dashboard-bigscreen.html
│
├── 运维 / 集成
│   ├── nc-interface.html / nc-interface-detail.html / system-admin.html
│   ├── reconciliation.html           (二阶段 B4 三对一致对账)
│   └── xinchuang-matrix.html
│
└── assets/
    ├── styles.css                    含响应式 + 大屏暗色 + 手机外框 + 扫码动画 + 信创矩阵 + AI 草稿面板
    ├── chrome.js                     头/侧栏/角色切换/移动端 drawer/演示场景切换器/底部 dock/schemaVersion banner
    ├── data.js                       Mock 数据（roles 6 角色对齐 roles.js）
    ├── store.js                      LocalStorage CRUD + BroadcastChannel + snapshot/rollback + schemaVersion
    ├── statemachine.js               14+ 状态机（P-01/P-02/P-05/T-01/T-03/C-01/C-02/C-04/C-07/C-08/C-10/S-01~S-23/E-04/E-08/OP-01/M-09/M-13）
    ├── linkage.js                    联动总线（30+ handler 含 A4a 自动建 C-04/C-07）
    ├── seed-data.js                  M-01/02/05/09/12 + F-13 NC 开关 14 项 + P-01 草稿 3 条
    ├── mock-nc.js                    NC 推送 mock（1-2 秒延迟 + 5% 失败率 + 自动重推）
    ├── roles.js                      6 角色 capabilities（菜单可见性 + 数据范围 + badgeCounts）
    ├── ui-helper.js                  toast/alert/confirm/prompt/loading（Promise 化）
    └── time.js                       B1 时间穿越 mock 系统时间
```

## 五、设计与口径约定

- **业务系统视觉**：克制的"国企信息系统"风格 — 深色侧栏 + 白色主区 + 蓝色主色 + 中性灰
- **大屏视觉**：暗色 + 青蓝渐变 + 数据感发光 + 实时脉冲指示器
- **移动端视觉**：手机外框 + 扫码动画 + 大字号 + 单手友好布局
- **AI 助理**：与业务系统同视觉语言；写操作场景**虚线大框 + 蓝色边界**强调"待用户确认"
- **状态色**：绿 / 蓝 / 黄 / 红 / 灰 五色一致
- **字段命名**与详设状态字段保持一致

## 六、变更日志

- **v0.22 (2026-05-11)** — **同事评审 P0 修复 + 命名规范化**：(1) 修 system-admin SC.setRole bug（实际 API 是 SC.roles.set）+ ROLE_DESC 中文 8 key 改为对齐 roles.js 的 6 个 id key（buyer/planner/storage_mgr/finance/it/group_committee）；(2) 修 contract-list / funding-plan 实体编号错口径 — C-05 是合同变更不是付款计划，正确链路 C-04 → C-07 → C-08 → C-10；(3) 全局改名"一期/二期 → 一阶段/二阶段"避免与"招标二期"混淆，21 文件 124 处替换 + 文件 git mv（03-档A二期扩展规划-V0.2.md → 03-档A二阶段扩展规划-V0.2.md）；(4) README 升级到 v0.22 + 加范围分层表 + 修 F-13 NC 开关描述。
- **v0.21 (2026-05-11)** — **二阶段 A4a 补丁 + 21 页页面说明卡统一 + audit 措辞清理**：(1) audit 发现 A4a 的 C-04 合同付款节点 + C-07 付款计划漏做引擎接入 — 补 statemachine.js 加 C-04 / C-07 状态机；linkage.js 加 5 个 handler（C-02 已签自动建 3 节点 + 3 计划 / C-04 ↔ C-07 双向联动 / C-08 已审累加 cumulative_amount / C-10 已记账推动 C-04 已付款）；(2) BIZ-014/015/020 mock NC 推送 — payment-execution 加月度消减按钮；(3) 28 页业务依据卡顶→底统一为"页面说明 · 业务依据 + 实现要点"；(4) inventory.html batch_state 字段口径明示 M-15 关联（S-13/S-14 不另设状态字段）；(5) 全站 audit 修订 5 处过时措辞。
- **v0.20 (2026-05-11)** — **静态页完善三波 P0 + P1 + 第三波 + 业务侧文案清理**：(1) P0 7 项核心页改造（tender-archive 重写 / inventory-flow / contract-list / funding-plan / payment-request / base-archive / material-master）；(2) P1 9 项页加业务依据卡 + 引擎接入卡（three-way-match / nc-interface-detail / alert-rules / equipment-lifecycle / equipment-oee / system-admin / requirement-detail / ai-write-flow / mobile-stocktake）；(3) 21 页底部加 / 升级"页面说明"卡；(4) sidebar 补 8 项二阶段新增页 + 顺序整理（质检 ↔ 入库审核 业务正序）；(5) 业务侧文案去除 "二期 / ★" 内部分批标识。
- **v0.19 (2026-05-10)** — **二阶段 P2 第二批 5 项**：A7 设备租赁（E-08 在租/月结/已结算 + BIZ-019）/ A9 委托加工（OP-01 投料→产出→入库 + 受托虚拟仓 + 标准损耗率 + 三方联合验收）/ A10 外委检修（E-04 审批 + 40% 原值上限演示 + ALR-CON-OVERLIMIT-001 + WF 加签）/ B4 三对一致对账（手工触发 S-13 vs S-21 + 月度调度日历 + 历史归档）/ B5 AI Tool（5 类查询接 SC.store + 自然语言响应 + 角色权限标识）。
- **v0.18 (2026-05-10)** — **二阶段 P2 第一批 4 项 + P1 4 项**：(1) P2 第一批：A6 废旧处置（4 类处置路径 + BIZ-010/011/012）/ A11 直达使用（S-23 不进 S-13 + BIZ-005A）/ A13 应急采购（is_emergency 紧急通道 + 3 工作日补办）/ B2/B6 数据快照（保存/还原/导入导出）；(2) P1：A3 调拨主线（S-11/S-12 + BIZ-007）/ A5 盘点（S-15/S-17 + BIZ-008/009）/ A12 后评价（M-13 + WF-SUP-REASSESS）/ B3 主数据维护（M-04/M-05/M-09 增删改）。
- **v0.17 (2026-05-10)** — **二阶段 P0 5 项重写 + 付款链路 3 页业务工作台细做**：(1) P0 5 项推倒重写按一阶段引擎接入风格 + 详设文档（material-issuance / council-meeting / payment-execution / split-detection / tentative-estimate）；(2) 付款链路 3 页业务工作台细做 — 决议日历 / 出纳工作台 / 银行账户 / 历史归档；(3) 步骤条改演示场景切换器（19 个场景）；(4) 引擎面板移到底部 dock。
- **v0.16 (2026-05-10)** — **同事评审 5 项 P1/P2 修复**：(P1-1) 加 linkage on('P-01:已审') → 按月+org 自动归集到 P-02 草稿 + 创建 P-03 行（按 source_request_no 幂等）；(P1-2) linkage on('P-02:已审') 加 plan_line_id 查重避免重复创建 P-05 草稿 + seed 移除 P-02/P-03 已审项（P-01 改草稿态让用户从起点演示）+ _engine-test approveP02 去重复 emit；(P1-3) 加 S-01 状态机（草稿/待审/已审/已驳回/已作废）+ linkage on('S-01:已审') → 自动 create S-02；P-05:草稿→已分解 加合同采购分支（关联已签 C-02）；(P2-1) TODO_RULES C-02 改 C-01（stateField=approval_state）+ 加 C-01 状态机 + linkage on('C-01:已批准') → 自动 create C-02 已签 + contract-detail engineApproveC01 改用 SC.sm.transition；(P2-2) contract-detail "付款节点（C-04）" 改 "付款条件（payment_terms 文本）"，标注 C-04 移二阶段 A4。架构原则：状态机只迁移、副作用全 linkage、所有 create 幂等查重。
- **v0.15 (2026-05-10)** — **档 A 一阶段 Week 6 收口（一期 100% 完成）**：(1) `reports.html` 加 E3 核心报表 5 张（tab 切换实时聚合）— RPT-INV-001 库存余额（含 unit_cost 移动平均）/ RPT-INV-002 收发存（S-21 按物料聚合）/ RPT-FIN-001 接口推送状态（按状态 + 接口）/ RPT-PUR-001 采购入库汇总（S-05 已审 × S-25 按物料）/ RPT-WF-001 审批超时统计（待审 + ALR-WF-001）；订阅 12 个相关实体任何变化实时重渲染。(2) 新增 `docs/原型设计/05-档A演示脚本-V0.1.md`（294 行，3 主场景 + 1 辅助 + Q&A）。(3) chrome.js 升 v0.15。**档 A 一阶段 6 周全部完成**：交付 7 个引擎 asset（约 1100 行）+ 11 页引擎接入 + 9 状态机 + 6 linkage + 4 自动预警 + 5 核心报表 + 演示脚本。下一阶段：档 A 二阶段（按 03 V0.2，等业务方反馈触发，不主动推进）。
- **v0.14 (2026-05-10)** — **档 A 一阶段 Week 5 治理能力（E1 审批中心 + E2 预警中心）**：(1) `approval-center.html` 加 E1 三段视图（待办 / 已审过 / 我发起占位）+ 跨实体聚合（P-01/P-02/C-02/T-01/S-02/S-05 自动收集待审）+ 一键通过/驳回 → SC.sm.transition 触发对应 linkage。(2) `alert-rules.html` 扩为 alert-center + 三段视图（未读 / 已确认 / 已处理）+ 4 类自动预警 mock 触发按钮。(3) **`linkage.js` 扩展 3 个自动预警**：T-03:流标 → ALR-PUR-002 / F-01:推送失败 → ALR-INT-001 / S-13 异常 → ALR-INV-001（quantity < 50 低储 / > 1500 超储）+ mockTriggerWFTimeout 替代时间穿越。(4) **`chrome.js` v0.14 动态徽标**：SC.updateBadges 在 sidebar 渲染后调用 SC.roles.badgeCounts 自动更新审批中心和预警规则的红点徽标（引擎未加载时静默）。Week 6（核心报表 E3 + 整体验收）pending。
- **v0.13 (2026-05-10)** — **档 A 一阶段 Week 4 核心联动 + NC mock**（档 A 演示亮点）：(1) 新建 `purchase-receipt.html` S-05 入库审核独立页（02 V0.4 附录 A 决策）— 创建草稿带 3 行 mock S-25 → 提交审核 → 审核通过 → linkage 触发 SC.store.transaction 包裹的 4 件原子事务（每行 S-21 流水 + S-13 余额移动平均 + S-14 批次 upsert）+ F-01 NC 任务创建 + setTimeout(SC.nc.push, 0) → 1-2 秒后 F-03 凭证回执 NCxxxx；页面实时观察 4 个效应表格。(2) `nc-interface.html` 加 F-01 引擎面板 + 状态分层（推送状态 vs 财务状态）+ 立即重推/强制成功/强制失败按钮 + F-13 BIZ-001 开关切换演示。(3) `inventory.html` 加 S-13 + S-14 + S-21 三表穿透 + **一致性自动校验**（S-13.quantity = S-21 累计 quantity_delta，绿✓/红✗ 实时显示）。(4) `nc-interface-detail.html` 加 F-08 异常台账（≥3 次重推失败升级）+ 高敏感处置（编辑映射/重推/关闭）。chrome.js 升 v0.13；READE 加 Week 4 章节 + 端到端核心演示路径（2-3 分钟）。Week 5（审批中心 E1 + 预警中心 E2）pending。
- **v0.12 (2026-05-10)** — **档 A 一阶段 Week 3 业务中段（4 页引擎接入）**：在 4 个静态页面顶部叠加"📡 档 A 引擎接入"面板，承接 Week 2 端到端：(1) `contract-detail.html` 加 C-01 会签（D4 三部门并行 财务+法务+经发部，一键全签模拟）+ C-02 8 状态机；T-05 中标 → linkage 自动 create C-01 → 三部门会签通过 → linkage 触发 C-02:已签 初始化金额。(2) `purchase-orders.html` 加 S-02 订单（关联 C-02）+ 5 状态机（草稿/已下达/部分到货/全部到货/已关闭）+ NC mock 订单同步标记。(3) `goods-receipt.html` 加 S-03 到货 + D3 质检开关 checkbox：勾选 → 验收后自动 create S-04 进入串行短路；不勾选 → 直接 create S-05 草稿。(4) `quality-check.html` 加 S-04 三类验收串行短路（品种 → 数量 → 质量），任一不合格短路 + 物资入待验区不进库存；全合格自动 create S-05 草稿。Week 1+2+3 端到端 P-01→P-02→P-05→T→C-01→C-02→S-02→S-03→S-04→S-05草稿 全程引擎联动。Week 4（S-05 已审 → 库存原子事务）pending。
- **v0.11 (2026-05-10)** — **档 A 一阶段 Week 2 业务前段（4 页引擎接入）**：在 4 个原静态页面顶部叠加"📡 档 A 引擎接入"面板（活数据走 SC.store + SC.sm + SC.linkage，与原静态 UI 并存）。`requirement-list.html` 加 P-01 创建 + 状态迁移；`purchase-planning.html` 加 P-02 多节点审批 + 联动 P-05 自动生成；`purchase-task-decomposition.html` 加 P-05 草稿表 + tender_type 选择 + 路径分流（招采→T-01 / 直采→S-01）；`tender.html` 加 T-01/T-03/T-05 三栏 + 直录中标 + 流标演示（→ linkage 自动 create C-01 会签）。端到端测试路径：P-01 → P-02 → P-05 → T-01 → T-03 → T-05 → C-01 全程 SC.store 联动 + LocalStorage 持久化 + BroadcastChannel 跨页同步 + SC.ui.toast 反馈。Week 2 完成。
- **v0.10 (2026-05-10)** — **档 A 一阶段 Week 1 框架层完成**（按 02 V0.4 §八 5 天全交付）：新增 7 个引擎文件 + 1 个烟雾测试页 + chrome.js 版本号同步升 v0.10。Day 1: `store.js` LocalStorage CRUD + BroadcastChannel + snapshot/rollback 事务；Day 2: `statemachine.js` 9 状态机引擎（P-01/P-02/P-05/T-01/T-03/C-02/S-02/S-03/S-04/S-05）；Day 3: `linkage.js` 联动总线 6 个预定义级联（P-02:已审→生成 P-05/P-05:草稿→已分解→路径分流/T-05:已验证→创建 C-01/C-02:已签→初始化金额/S-05:已审→库存原子事务+NC 任务/F-01:推送失败→自动重推）+ `seed-data.js` 主数据预填（M-01/02/05/09/12 + F-13 NC 开关 + P-01/02/03 业务种子）；Day 4: `mock-nc.js` NC 推送 mock（1-2 秒延迟 + 5% 失败率 + 自动重推 ≤3 次 + simulate 调试）；Day 5: `roles.js` 6 角色定义（采购员/计划员/物资主管/财务/IT/集团委员会，含 menus/dataScope/badgeCounts）+ `ui-helper.js` UI 组件（toast/alert/confirm/prompt/loading 全 Promise 化，自动注样式）。`_engine-test.html` 升 9 个验证卡（含 NC mock + 6 角色切换 + UI 组件）。共 40 页 HTML + 10 个 assets（含 styles.css）。Week 2 业务前段（需求 → 计划 → 任务 → 招采）pending。
- **v0.9 (2026-05-10)** — P1 剩余 2 项收口（不新增页面，4 页深化）：(1) 合同变更与履约节点：contract-detail 加顶部冻结 banner + 履约节点表 + C-05 变更记录 + 履约预警 + 变更冻结控制；contract-list 加变更列；payment-request 加变更冻结提示。(2) 设备租赁计费：equipment-rent 整页升级 — flow-strip 7 步、租赁详情面板、月度费用 E-13、付款节点 C-04、三笔保证金独立核算（押金 / 履约保证金 §8.6 / 租赁质保金 §8.10 政策 02）、续/停/退租动作、全生命周期 timeline；equipmentLeases 加 paymentMode 字段 + 1 个 ONE_TIME 案例。共 39 页（v0.8 收口的 P1）。
- **v0.8 (2026-05-10)** — 对齐 2026-05-10 详细设计同步基线：新增暂估闭环页、采购计划编排页、采购任务分解页；更新全局版本、需求/采购业务流向、直达例外审批、库存低储/超储口径、外委检修审批与 40% 原值上限、履约保证金高敏感控制、供应商后评价自动重评估、预警/报表、NC 外委检修待确认占位。共 39 页。
- **v0.7 (2026-05-08)** — 新增 3 页（P0 业务方回执未到的间隙补"零踩 P0"展示页）：设备 OEE 看板（综合 OEE + 12 周趋势 + 单设备详情 + 停机原因）、NC 接口异常详情（错误诊断 + 报文 / 重试历史 / 审计与处置 + 高敏感重推）、三单匹配（订单 / 入库 / 发票三栏对比 + 差异挂账 + 例外审批）。共 36 页。
- **v0.6 (2026-05-08)** — 新增 4 页：库存流转（领料出库 / 退料入库 / 调拨单 + 库存台账流水 + NC 触发点）、供应商履约画像（准入 / 评价 / 暂停 / 黑名单 + 准时率 / 一次合格率）、招投标过程归档（采购文件 / 开评标资料 / 评标报告 / 中标通知书 + 合同联动）、预警规则配置（安全库存 / 合同履约 / NC 接口 / 供应商资质 / 报表订阅）。共 33 页。
- **v0.5 (2026-05-03)** — 新增 4 页：设备维修工单（E-04 + 备件领用 + 关单回写）、移动端扫码盘点（360×720 手机外框 + 扫码动画 + 后端联动）、AI 写操作完整链路（6 轮对话 + 草稿确认 + 7 条边界 + 审计标注）、信创兼容性矩阵（6 层 × 4 目标 OS + 招标响应承诺）。新增组件：matrix（信创矩阵网格）/ phone-frame（手机外框）/ scan-zone（扫码动画）/ ai-draft-panel（AI 草稿确认）/ rule-list（允许/禁止/审计）。共 29 页。
- **v0.4 (2026-05-03)** — 新增 4 页：设备生命周期 / 招投标 / AI 助理独立 / 大屏看板。共 25 页。
- **v0.3 (2026-05-03)** — 新增 4 页：质检 / 付款申请 / 资金计划 / 报表穿透 + 响应式适配。共 21 页。
- **v0.2 (2026-05-03)** — 新增 8 页。共 17 页。
- **v0.1 (2026-05-03)** — 首版 9 页。
