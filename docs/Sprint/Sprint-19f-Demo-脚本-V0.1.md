# Sprint 19f Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19f 验收演示脚本
**配套：** [`Sprint-19f-任务卡-V0.3.md`](./Sprint-19f-任务卡-V0.3.md)

---

## 一、Sprint 19f 落地范围

按 V0.3 锁版（cici 同意范围扩大 — V0.2 双轨 + 同事评审 5 fix 副轨），实际交付 **~4.3 PD**（vs 5.6-7.6 PD V0.3 预算 节省 26-46%）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D-1 | 19f 预热：Codex 19d/19e 3 P2 全修 | `813d93f` | 之前会话 | 0.4 |
| D0 | V0.1 草案 + V0.1 → V0.2 锁版（推荐方案 A）| `96134d5` + `9f0a377` | a | 0.3 |
| **D1-3** | UI-FIX abp install-libs + 11 Razor Page Permission 细粒度 | `67cb4aa` | **c task 1** | 0.6 |
| **D1-3** | UI-3 phase 2 5 React 页面 + ABP 整合（含 STYLE-OPT brotli 配合）| `03de782` + `dc69418` | **b + c task 2** | 2.4 |
| D4 | 同事评审 5 fix 4 真实修（root redirect / ESLint / chunk / body scope）| `3f245f2` | **a** | 0.6 |
| D4 | V0.2 → V0.3 升版（5 fix 范围扩大 + 协作 race 治理债附录）| `ccd8ef4` | a | 0.2 |
| D7 | Demo 脚本（本文档）+ Sprint 19g V0.1 草案 | 本文档 | a | 0.3 |

**A2' 副轨**：19f 期间 NC 端无反馈 → A2' 继续顺延（V0.3 §四 决策 6：性质改变 / cici 19d 已撤主线）；续 Sprint 19g 启动前 cici 评估窗口。

**测试基线**：
- 后端 1760 测试零 regression（19f 仅前端 + Razor Pages + ABP 整合 + Permission 增加 11 page Default）
- frontend 16 entries build OK（11 既有 + 5 新）+ manifest 30+ entries + 0 Circular warning
- vendor-devextreme.js 1898 KB → 414 KB brotli（21.8% / 78% 节省）
- npm run lint 0 errors / 0 warnings（ESLint 9 flat config 新建）
- dotnet build SupplyCores.Web 0 错误

---

## 二、Demo 演示路径

### 路径 A：UI-3 phase 2 5 React 页面（10 分钟 — 核心高光）

按导航顺序（LeptonX sidebar 4 大分组 + 1 新分组「运维 / 集成」）：

1. **dashboard-bigscreen `/supplycores/dashboard-bigscreen`** — 综合监控大屏（Demo 高光）
   - 暗色基底 + 12 KPI / 库存价值 donut / 厂矿柱状 / 实时事件流 / 高敏感关注 / 时钟
   - 投屏目标 1920×1080；useEffect setInterval 1s 时钟刷新
   - `bigscreen.css` scope `#dashboard-bigscreen-root` 不污染 `:root`

2. **quality-check `/supplycores/quality-check`** — 质检 S-04（详设 06 V1.1a §6.4 三类验收串行短路）
   - DataGrid + Lookup（quality_state 5 状态）+ Popup 详情含 timeline + 5 检验项 + 摘要
   - Popup AbortController race fix（19d Codex P2 finding 1 教训沿用）
   - flow-strip 6 步 + KPI 4 卡 + 操作按钮（判合格 / 判不合格）

3. **scrap-disposal `/supplycores/scrap-disposal`** — 废旧处置 S-19（4 类报废 / 变卖 / 回收 / 销毁）
   - DataGrid + 状态机操作（批准 / 驳回 / 执行处置）+ NC 凭证号展示
   - 高敏感规则卡（变卖 ≥¥50,000 触发 SENS / 火工品安全部门会签）

4. **mobile-stocktake `/supplycores/mobile-stocktake`** — 移动盘点 S-15
   - 360×740 phone-frame 模拟 + scan-zone 扫描动画 + 后端联动 timeline 5 步
   - mobile.css scope `#mobile-stocktake-root`

5. **xinchuang-matrix `/supplycores/xinchuang-matrix`** — 信创矩阵
   - 5 层（OS / DB / 浏览器 / 办公 / 中间件）× 3 目标矩阵 + 6 关键说明 + 招标承诺 KV
   - 4 覆盖统计卡（已测 / 通过 / 部分 / 阻塞）+ 推荐 / 过渡 / 注意 3 类规则

### 路径 B：UI-FIX + STYLE-OPT（5 分钟）

**UI-FIX**：
- `Configure<AbpMvcLibsOptions>(o => o.CheckLibs = false)` 开发期跳过 install-libs
- 11 Razor Page PageModel `[Authorize]` → `[Authorize(SupplyCoresPermissions.X.Default)]` 细粒度
- SupplyCoresPermissions 加 11 page Default 类 + SupplyCoresPermissionDefinitionProvider 注册
- 双语本地化同步（zh-Hans + en 各 +12 keys）

**STYLE-OPT**：
- vite-plugin-compression brotli + gzip 双层（threshold 10 KB / deleteOriginFile=false）
- copyToMainApp closeBundle order:"post" sequential:true 显式声明执行顺序
- Host wwwroot 17 .br + 17 .gz 完整同步
- DevExtreme 25.2.4 lazy-load 评估：现状最优（sub-path 导入 + manualChunks），custom bundler 路径 ROI 偏低顺延

### 路径 C：同事评审 5 fix（5 分钟）

| # | Fix | 演示 |
|---|---|---|
| 1 | /supplycores/ root redirect | 浏览器访问 `/supplycores` → 自动 → `/supplycores/home` |
| 3 | ESLint flat config | `npm run lint` 0 errors / 0 warnings（eslint.config.mjs flat config） |
| 4 | DevExtreme 5 Circular warning 消除 | `npm run build` 输出无 Circular（vs 19d B1 5 条 warning） |
| 5 | body CSS scope | 浏览器看 ABP/LeptonX 外壳保持原样 + React Island mount root scope 品牌色 |

### 路径 D：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores`
2. `cd modules/nova.supplycores/frontend && npm run build` → 16 entries + brotli/gzip + 0 Circular
3. `dotnet run --project src/SupplyCores.Web` → ABP 启动 + 加载模块 + Vite manifest loaded
4. 浏览器 http://localhost:5100/supplycores → 自动 redirect to /supplycores/home
5. LeptonX sidebar 显示 SupplyCores 5 大分组（基础档案 / 业务运营 / 接口监控 / 报表分析 / 运维 / 集成）+ 16 menu items
6. 点击 "综合监控大屏" → http://localhost:5100/supplycores/dashboard-bigscreen → React Island mount + 暗色大屏全交互
7. 点击 "质检" → DataGrid 显示质检列表 + Popup 详情 + 判定流程
8. NcHealthSnapshot Dashboard 联调正常 + DevExtreme DataGrid 工业感 + 外围品牌色协调

---

## 三、关键决策回顾

| 决策点 | V0.3 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 双轨 主轨 UI-3 phase 2 + 副轨 UI-FIX + 旁路 STYLE-OPT + V0.3 5 fix 副轨 | ✅ 双轨闭环 + 5 fix 4 修 1 自解决 |
| 2. 累计技术债 + 5 fix | #6 vendor ✅ + #9-#10 UI-FIX ✅ + 5 fix 4 修 | ✅ 全修 |
| 3. 工时预算 | V0.3 5.6-7.6 PD | **4.3 PD 实际** vs 预算 节省 26-46% |
| 4. 子代理并行 | b UI-3 + c UI-FIX/STYLE-OPT + a 5 fix | ✅ 双子代理 sweet spot 实测 |
| 5. Codex 19e 评审 | 已完成（813d93f）| ✓ |
| 6. A2' 重启 | NC 无反馈 → 继续顺延（性质改变）| ⏳ 19g 启动前再评估 |
| 7. 同事评审 5 fix | 4 真实修 + 1 自解决 | ✅ 全闭环（commit `3f245f2`）|

### Sprint 19f 特殊性

**首次"协作 race 治理债"暴露**：
- 双子代理 b/c 并行改 vite.config.ts / package.json 时 commit message 与内容错位
- b commit 03de782 message 写"5 React 页面"实际只有 vite.config.ts + package
- c commit dc69418 message 写"STYLE-OPT brotli"实际含 b 全部 22 文件
- c reset --soft + reset 误判撤回（远程已 push）
- 教训：双子代理改同源文件需"协调 commit 时序"明确提示 + 主代理 a 收到子代理报告后必须 `git log + show --stat` 核实

**首次"同事独立评审"路径打通**：
- cici 引入"同事"独立评审视角（针对 813d93f 预热修复后状态）
- 5 fix 4 真实 + 1 自解决（主代理 a 验证后落地）
- 路径建立：同事/Codex 独立评审 → cici 转 + 主代理 a 验证 + 落地 → V0.3 范围扩大记录

**Codex 0 顺延 P2 连续 Sprint 记录维持**：
- 14 Sprint 中 13 Sprint 完整 0 P2 顺延 / 1 闭环（19b vendor → 19f STYLE-OPT 落地）
- 新表述："**0 关键 P2 顺延 13 Sprint（11a/13a-19a/19c/19d/19e/19f 跳 19b）+ 1 工作量超阈值 P2 闭环（19b vendor）**"

---

## 四、Sprint 19g 候选方向

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **A2' 重启** | NC 真端点 phase 2（19d V0.2 §一 5 步重启路径）| 4 PD | NC 端反馈 ≥ 5 项关键差异 + 项目协调正式化 |
| **UI-2-5 E2E** | Playwright 1-2 核心场景（approval-center 完整链路 + nc-interface 监控）| 1-1.5 PD | 19c-19f 4 次顺延 — 19g 必修 |
| **UI-3 phase 3** | 剩 35+ 长尾原型批量 React 化 | 5-10 PD | 无 |
| **6 backend endpoint [⚠️] 占位归属决策** | dashboard / quality / scrap / mobile / xinchuang / OEE | 2-3 PD | cici 与业务方协调 |
| **C / G** | 详设 09 看板 / 06 库存超储（持续顺延）| 5-10 PD | 无 |
| **commit history 治理债** | 19f 协作 race 教训文档化 + 续 Sprint 子代理 spawn 模板加协调提示 | 0.3 PD | 19g 锁版前补 |

**V0.1 倾向**：双轨 UI-2-5 E2E（必修，已 4 次顺延）+ A2' 重启评估（cici 决策）+ 6 endpoint 归属（cici 与业务方协调）

---

## 五、Sprint 19f Codex 评审待触发

> 占位 — Sprint 19f 完成时 cici 触发 Codex 19f 评审

**评审重点**：
- UI-3 phase 2 5 React 页面架构正确性（dashboard 暗色 scope / quality 状态机 / scrap 高敏感规则 / mobile 触屏 / xinchuang 静态）
- UI-FIX 11 Razor Page 细粒度 Permission 完整性 + SupplyCoresPermissions 树 + DefinitionProvider 注册
- STYLE-OPT brotli 配置正确性 + closeBundle order:"post" sequential:true 顺序保障
- DevExtreme 4 chunk 简化 + Circular warning 消除（撤 19d B1 评估）
- 5 fix 修复完整性（root redirect convention / ESLint flat config / chunk 简化 / body scope）
- **协作 race 治理债**：commit message 与内容误差教训 + 后续 子代理 spawn 协调建议

**触发提示词**：
"评审 Sprint 19f 共 6 commits（`813d93f` 预热 / `67cb4aa` UI-FIX / `03de782` b vite/package / `dc69418` STYLE-OPT 含 b 22 文件 / `3f245f2` 5 fix / `ccd8ef4` V0.3 docs）— 重点关注 UI-3 phase 2 5 React 页面 + UI-FIX Permission 完整性 + STYLE-OPT brotli + 5 fix 修复 + 协作 race commit message 误差治理建议"

**累计待评审 Sprint**：19f（19d/19e 已通过 813d93f 闭环）— 强烈建议 cici 触发 Codex 19f 评审。

**Codex 0 顺延 P2 连续记录目标**：保持 13/14 完整 + 1 闭环节奏（19f 0 P2 顺延期望）。

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — V0.3 双轨 + 5 fix 范围扩大 4.3 PD（vs 5.6-7.6 预算节省 26-46%）+ 4 演示路径 + 协作 race 治理债 + Codex 19f 触发提示 |
