# Sprint 19d Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19d 验收演示脚本
**配套：** [`Sprint-19d-任务卡-V0.2.md`](./Sprint-19d-任务卡-V0.2.md)

---

## 一、Sprint 19d 落地范围

按 V0.2 锁版（cici 选 1 撤 A2' + 双轨 UI-3 + UI-3-DEBT），实际交付 **~2.5 PD**（vs 8-10 PD 预算 提速 ~70%）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（撤 A2' + 双轨）| `fc7fbc8` | a | 0.3 |
| **D1-3** | UI-3 phase 1 4 React 页面（contract / equipment-lifecycle / equipment-oee / equipment-rent）| `cee786d` | **c** | 1.5h ≪ 2.5 PD（提速 75%）|
| **D1-3** | UI-3-DEBT 13 P3 + 1 P2 vendor split（minSignCount Wave 92 / D9 LogDebug / 兼容构造删 / Popup race / Form validate / vendor 4-chunk split / LOOKUP 公共枚举 / 19c material-master unit dirty tracking）| `cee786d` | **b** | 2.0 PD |
| D7 | Demo 脚本（本文档）+ Sprint 19e V0.1 草案 | 本文档 | a | 0.3 |

**A2' 第三次顺延决策（cici 选 1 撤 A2'）**：详 V0.2 §一 放弃理由声明 — NC 端持续无反馈构成反模式深化风险，撤 A2' 改 V0 删除 + 项目层面正式重启（19e/20a 协调到位后）。所有底层基础设施（OAuth2 / Polly / chaos 守护 / NcInterfaceHttpClient）保留不丢失。

**测试基线演进**：
- Sprint 19c 收尾：1750 后端
- Sprint 19d Day 1-3：1736（含 8 新 Sprint19d_MinSignCount + 14 OAuth2 + 5 StockBalance + 调整 - frontend 改动不影响后端）
- frontend：11 路由（home + 6 19b/19c MVP + 4 19d UI-3 phase 1）+ build 0 错误

---

## 二、Demo 演示路径

### 路径 A：UI-3 phase 1 4 新页面（10 分钟）

按导航顺序：

1. **合同 `/contract`**（C-02）：
   - 列表 + 详情 Popup + 新建 Form
   - 状态机 6 操作（Submit/Approve/Reject/StartExecution/Complete/Terminate）
   - 履约保证金 / 外委检修 40% 上限字段全显示
2. **设备生命周期 `/equipment-lifecycle`**（E-01）：
   - 7 状态分布卡片（点击过滤）+ DataGrid
   - 11 状态机操作（Submit/Approve/Activate/PutInUse/Lease/Unlease/SendToRepair/FinishRepair/RequestScrap/ApproveScrap/Return）
3. **设备 OEE `/equipment-oee`**：
   - 5 KPI 卡（综合 / 可用 / 性能 / 良品 / 预警）
   - DataGrid 排行（mock 数据 [⚠️ Controller 待建]）
4. **设备租赁 `/equipment-rent`**（E-09）：
   - LeaseContract 列表 + 4 KPI 卡 + 详情含三笔保证金独立核算（押金 / 履约 / 质保金）
   - 新建 Form + 状态机 3 操作（Submit/Sign/Reopen）

### 路径 B：UI-3-DEBT 13 P3 + 1 P2 vendor 消化（5 分钟）

后端：
- **minSignCount 会签计票**（Wave 92）：跑 8 守护测试 — WF-CON-002 4 节点 minSignCount=2 / WF-SHT-001 财务+安全会签 / Reject 重置
- **D9 NCalc 异常 LogDebug**：触发 NCalc 语法错 → LogDebug trace 显示 tpl/expr/ctxLen
- **InitiateAsync 首节点 D9**：模板 1 节点带 conditionExpr 不命中 → 自动 pass

前端：
- **Popup race fix**：5 页面快速点详情→关闭 不再有"重新弹出"bug
- **Form validate()**：5 页面用 DevExtreme `formRef.current.instance().validate()` 替手写 if 链
- **material-master unit dirty tracking**：编辑物料不改 unit 字段时 PUT body 不污染历史值
- **vendor split**：4 chunk（vendor-devextreme 1.16MB / grid 671KB / form 108KB / heavy 10KB）HTTP/2 并发 download
- **LOOKUP 公共枚举**：shared/lookupOptions.ts 5 枚举抽象（替 valueExpr="v" 单字母键）

### 路径 C：A2' 撤决策 + 项目协调路径（5 分钟）

详 V0.2 §一 放弃理由声明：
1. **撤 A2' 不丢失**：18a A1 7 项清单 + 18b A2-1' 60 ⚠️ 占位稿（含 NCC OpenAPI 7 关键差异 NC-1-1~7）+ 17a OAuth2 完整实现 + 10 chaos 守护 都保留
2. **5 步重启路径**：
   1. cici 与项目方明确 NC 端对接人（财务部 IT / NCC 厂商客户经理）
   2. 60 ⚠️ 占位稿拆"必反馈 5 项 + 可选 2 项 + 后置 N 项"分级
   3. 设置项目级正式协调会议（含财务方业务负责人）替代 cici 个人推动
   4. NC 端反馈到位 → 重启 A2'（19e/20a 主线 4 PD）
   5. 重启时无需重新设计：所有底层基础设施就绪

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 双轨 UI-3 phase 1 + UI-3-DEBT（撤 A2'）| ✅ 4 React 页面 + 13 P3 + 1 P2 vendor 全完整 |
| 2. 累计技术债 | 全修（除 #1 A2' 已撤）| ✅ #6 vendor 完成 split + #4-#5 P3 全消化；#2-#5 部分顺延 19e |
| 3. 工时预算 | 8-10 PD | **2.5 PD 实际 vs 预算 提速 ~70%** |
| 4. 子代理并行 | 主+b+c sweet spot 3x | ✅ 双子代理 b+c 双轨实测 |
| 5. Codex 19c 评审 | 已完成（commit `a5974c0`）| ✓ |
| 6. **A2' 第三次顺延决策** | **cici 选 1：撤 A2' + 项目层面正式重启** | ✅ §一 放弃理由声明 + 5 步重启路径 |

### Sprint 19d 特殊性

**首次"撤主线"决策 + 首次"反模式触发后撤回"**：
- 撤 A2' 是 Sprint 17a-19c 13 Sprint 中首次"主线撤回"决策
- 反模式（持续顺延）触发后果断撤 vs 静默废弃 — 项目治理层面重要里程碑
- 后续 Sprint（19e/20a）启动 A2' 重启需明确"项目协调到位"前置条件

**双子代理 sweet spot 持续验证**：
- 19c: 65% 提速（双子代理 4 轮 + 模板复用）
- 19d: ~70% 提速（双子代理 2 轮 + DEBT 综合 + 模板复用）
- 累计 17a-19d 7 Sprint sweet spot 双/三子代理实测 60-70% 平均提速

---

## 四、Sprint 19e 候选方向（A2' 重启 + UI-3 phase 2 + 长尾消化）

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **A2' 重启** | NC 真端点 phase 2（撤后重启）| 4 PD | **NC 端反馈到位 + 项目协调正式化** |
| **UI-3 phase 2** | 剩 5+ 核心 HTML 原型 React 化（dashboard-bigscreen / quality-check / scrap-disposal / mobile-stocktake / xinchuang-matrix）| 3-4 PD | 无 |
| **UI-3 phase 3** | 剩 35+ 长尾原型批量 React 化 | 5-10 PD | 无 |
| **UI-2-5 E2E** | Playwright 1-2 核心场景 | 1-1.5 PD | 无 |
| **vendor brotli 压缩 / lazy-load** | 19d split 后续优化（与 Catio 同等） | 0.5-1 PD | 无 |
| **C / G** | 详设 09 看板 / 06 库存超储（持续顺延） | 5-10 PD | 无 |

**V0.1 倾向**：双轨 UI-3 phase 2 + UI-2-5 E2E（A2' 启动条件未到位时）

---

## 五、Sprint 19d Codex 评审待触发

> 占位 — Sprint 19d 完成时 cici 触发 Codex 19d 评审

**评审重点**：
- minSignCount 会签计票（Wave 92 + ApproveNodeAsync 累计逻辑 / 跨节点 Reject 归零边界）
- D9 NCalc LogDebug trace 完整性（与 18b NRE LogDebug 对称口径）
- vendor split 4 chunk 实际收益（HTTP/2 并发 vs 总量不变 trade-off）
- 撤 A2' 决策记录 + 重启路径完整性
- 4 React 页面 [⚠️] 待 cici 确认 endpoint 占位

**触发提示词**：
"评审 Sprint 19d 共 3 commits（`fc7fbc8` V0.2 撤 A2' / `cee786d` Day 1-3 UI-3+DEBT / 本 commit Demo）— 重点关注 Wave 92 minSignCount 累计逻辑 + 撤 A2' 决策完整性 + vendor split 4 chunk 收益评估 + 4 [⚠️] endpoint 占位"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 双轨 UI-3 + UI-3-DEBT 完整 2.5 PD（vs 8-10 预算提速 70%）+ 撤 A2' 项目重启路径 + 3 演示路径 + Codex 19d 触发提示 |
