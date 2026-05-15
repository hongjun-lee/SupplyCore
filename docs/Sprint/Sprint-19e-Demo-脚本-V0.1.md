# Sprint 19e Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19e 验收演示脚本
**配套：** [`Sprint-19e-任务卡-V0.2.md`](./Sprint-19e-任务卡-V0.2.md)

---

## 一、Sprint 19e 落地范围

按 V0.2 锁版（cici 同意推荐方案 A：ABP multi-page 重构 + UI-STYLE 品牌色合并主线），实际交付 **~2.8 PD**（vs 3-4 PD 预算 节省）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（推荐方案 A）| `4d1598b` | a | 0.3 |
| **D1-2** | **ABP multi-page 重构**（删 SPA + 11 entries + 11 Razor Pages + ViteEntry TagHelper + MenuContributor + LeptonX 集成）| `f74f2ca` | **b** | 1.5 |
| **D3-4** | **UI-STYLE 品牌色**（19 `--brand-*` CSS 变量 + 11 main.tsx 注入 + 40 处 inline 替换 + DevExtreme 视觉守护）| `78e6b87` | **c** | 1.0 |
| D7 | Demo 脚本（本文档）+ Sprint 19f V0.1 草案 | 本文档 | a | 0.3 |

**A2' 副轨**：19e 期间 NC 端无反馈 → A2' 继续顺延（V0.2 §四 决策 7：性质改变不算反模式 — cici 已在 19d 撤主线 + 设重启条件）。

**测试基线**：
- 后端 1736 测试零 regression（19e 仅前端 + Razor Pages，未动业务逻辑）
- frontend 11 entries build 1.78s + manifest 25 entries 加载成功
- ABP 启动 NovaAbpViteWebModule + NovaSupplyCoresWebModule 正常

---

## 二、Demo 演示路径

### 路径 A：ABP 重构架构升级（5 分钟 — 核心高光）

1. **删 SPA → multi-page**：`vite.config.ts` 11 entries（home / approval-center / inventory / purchase-orders / material-master / reports / nc-interface / contract / equipment-lifecycle / equipment-oee / equipment-rent）
2. **11 Razor Pages**：`modules/nova.supplycores/src/Nova.SupplyCores.Web/Pages/SupplyCores/{Folder}/Index.cshtml`，每页含 `<vite-entry>` mount React Island（dev :5175 / production wwwroot manifest）
3. **MenuContributor 4 大分组**：基础档案（Material/Contract）/ 业务运营（Approval/Purchase/Inventory/Equipment-3）/ 接口监控（NcInterface）/ 报表分析（Reports）+ Home 独立项
4. **LeptonX 集成**：浏览器看到左侧 sidebar 含 SupplyCores 菜单树 + 顶部 LeptonX 主题 + 用户中心 — 与 Catio nova.platform 体系完全一致

### 路径 B：UI-STYLE 品牌色（5 分钟）

1. **shared/theme.css**：19 个 `--brand-*` 前缀变量（不污染 :root 通用色防侵入 DevExtreme）
2. **layout 应用**：page-container / page-header / app-shell 全用品牌色（#1e5fb8 主色 / #f3f5f9 bg / #475569 text-2 等）
3. **DevExtreme 守护**：DataGrid / Form / Popup 视觉与 19d 完全一致（dx.fluent.blue.light.css 不动）
4. **守护测试**：`npm run build` index.DsgBBxeN.css 含品牌变量；DevExtreme `.dx-*` 类无 override

### 路径 C：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores`
2. `cd modules/nova.supplycores/frontend && npm run build` → 11 entries + manifest 生成
3. `dotnet run --project src/SupplyCores.Web` → ABP 启动 + 加载模块 + Vite manifest loaded
4. 浏览器 http://localhost:5100/SupplyCores/Home → LeptonX sidebar 显示 SupplyCores 菜单
5. 点击 "审批中心" → http://localhost:5100/supplycores/approval-center → React Island mount + 21 模板审批列表
6. NcHealthSnapshot Dashboard 联调正常 + DevExtreme DataGrid 工业感 + 外围品牌色协调

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 主轨 ABP-REFACTOR + 副轨 UI-STYLE 合并 | ✅ 双轨完整闭环 |
| 2. 累计技术债 | #7 UI-STYLE 必修 + #1 ABP MenuContributor 接通 | ✅ 全修 |
| 3. 工时预算 | 3-4 PD | **2.8 PD 实际** vs 预算 节省 |
| 4. 子代理并行 | Day 1-2 b ABP 重构 + Day 3-4 c UI-STYLE | ✅ 双子代理 sweet spot 实测 |
| 5. Codex 19d 评审 | 待 cici 触发 | ⏳ 累计 4 Sprint 未触发 — Demo 收尾后必触发 |
| 6. ABP 重构 vs UI-STYLE 优先级 | 合并执行 + UI-3 phase 2 顺延 19f | ✅ 一次性 3 大问题解决 |
| 7. A2' 重启决策 | NC 无反馈 → 继续顺延（性质改变） | ⏳ 19f 启动前再评估 |

### Sprint 19e 特殊性

**首次大规模 frontend 架构重构 + 视觉重构合并**（一次性解决 3 大问题）：
- **导航问题**：MenuContributor 接通 + LeptonX sidebar 树形 + 4 大分组（替代 19b 自建 nav-links）
- **视觉问题**：原型品牌色提取 + 11 页面应用（外围 70% 视觉感知靠拢原型）
- **集成问题**：完整接入 Catio nova.platform 体系（multi-page + Razor Page React Island + LeptonX 主题）

**双子代理 sweet spot 实测**：
- ABP 重构 1.5 PD vs 2-2.5 预估 节省 35%（Catio nova.abp.vite Module 0 改动复用 + sed 批量 11 Razor Page）
- UI-STYLE 1.0 PD vs 1.5-2 预估 节省 33%（原型 :root design tokens 现成 + sed 批量 main.tsx 注入）
- 累计 17a-19e 8 Sprint sweet spot 双/三子代理实测 60-70% 平均提速

---

## 四、Sprint 19f 候选方向（UI-3 phase 2 + 长尾消化）

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **UI-3 phase 2** | 5 核心 HTML 原型 React 化（dashboard-bigscreen / quality-check / scrap-disposal / mobile-stocktake / xinchuang-matrix）| 3-4 PD | 复用 19e multi-page + 品牌色 提速 40%+ |
| UI-3 phase 3 | 剩 35+ 长尾原型批量 React 化 | 5-10 PD | 无 |
| UI-2-5 E2E | Playwright 1-2 核心场景 | 1-1.5 PD | 无 |
| vendor brotli / lazy-load | 19b/19d 续优化 | 0.5-1 PD | 无 |
| **A2' 重启** | NC 真端点 phase 2（撤后重启） | 4 PD | NC 端反馈到位 + 项目协调正式化 |
| C / G | 详设 09 看板 / 06 库存超储（持续顺延） | 5-10 PD | 无 |

**V0.1 倾向**：双轨 UI-3 phase 2 + UI-2-5 E2E（如 A2' 启动条件未到位）

---

## 五、Sprint 19e Codex 评审待触发

> 占位 — Sprint 19e 完成时 cici 触发 Codex 19e 评审

**评审重点**：
- ABP multi-page 重构架构正确性（Catio nova.platform 模式对齐 / ViteEntry TagHelper 复用 / Razor Page React Island mount）
- MenuContributor 4 大分组合理性 + LeptonX 集成完整度
- UI-STYLE 19 brand 变量覆盖完整 + DevExtreme `.dx-*` 无 override 守护
- abp install-libs / AbpMvcLibsOptions.CheckLibs 决策（Host-only 调整顺延）
- 11 Razor Page 仅 [Authorize] 鉴登录 — 细粒度 SupplyCoresPermissions 顺延

**触发提示词**：
"评审 Sprint 19e 共 3 commits（`4d1598b` V0.2 锁版 / `f74f2ca` Day 1-2 ABP 重构 / `78e6b87` Day 3-4 UI-STYLE / 本 commit Demo）— 重点关注 ABP multi-page 架构 + MenuContributor + UI-STYLE CSS 变量 scope 隔离 + DevExtreme 守护"

**累计待评审 4 Sprint**（19a/19b/19c 已评 + 19d 未评 + 19e 即将完成）— 强烈建议 cici 触发 Codex 19d + 19e 双 Sprint 评审。

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — ABP multi-page + UI-STYLE 品牌色合并 2.8 PD（vs 3-4 PD 预算节省）+ 一次性解决导航/视觉/集成 3 大问题 + 双子代理 sweet spot 实测 + Codex 19d/19e 触发提醒 |
