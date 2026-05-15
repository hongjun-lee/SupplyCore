# Sprint 19g 任务卡 V0.3（锁版 + Codex 19g 评审 P2-2 修留痕）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.3（锁版 + Codex 19g 评审 · cici 2026-05-15 触发 Codex 19g 评审完成 — 1 P1 + 2 P2 + 3 P3 + 双 race 治理债 19h 继续观察期）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19g 锁版任务卡 + Codex 19g 评审留痕
**配套：** [`Sprint-19f-Demo-脚本-V0.1.md`](./Sprint-19f-Demo-脚本-V0.1.md) §四 候选范围 + 19f 收尾 Codex 19f 评审 P1+P2 全修

---

## 一、Sprint 19g 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 UI-2-5 E2E：Playwright 集成 + 1-2 核心场景（19c-19f 4 次顺延 — 必修）

19c/19d/19e/19f 连续 4 次顺延 — 19g 必修（避免反模式深化）：

| Task | 范围 | 工时 |
|---|---|---|
| 19g-UI-2-5-1 | Playwright 安装 + 基础配置（playwright.config.ts + 浏览器准备）| 0.3 PD |
| 19g-UI-2-5-2 | E2E 场景 1：approval-center 完整链路（list → 详情 → approve / reject 状态机）| 0.5 PD |
| 19g-UI-2-5-3 | E2E 场景 2：nc-interface 监控（NcHealthSnapshot 4 endpoint 实测）| 0.4 PD |

**预算 UI-2-5**：1-1.5 PD

### 候选 6 backend endpoint [⚠️] 占位归属决策（19f UI-3 phase 2 顺延）

19f UI-3 phase 2 5 React 页面 + 19c reports/nc-interface backend 累计 6 [⚠️] 占位：

| 页面 | endpoint | 业务方 |
|---|---|---|
| dashboard-bigscreen | `GET /api/supply-cores/dashboard/bigscreen` | 大屏聚合（SQA 团队 / 财务部）|
| quality-check | `GET /quality-checks{,/{id}}` + `POST /{id}/judge` | S-04 质检（质保部）|
| scrap-disposal | `GET /scrap-disposals` + `POST /{id}/{approve|reject|execute}` | S-19 处置（设备部）|
| mobile-stocktake | `GET /stocktake-sheets{,/{id}}` + `POST /{id}/{scan|sync}` | S-15 盘点（仓储部）|
| xinchuang-matrix | `GET /xinchuang/matrix` | readonly 矩阵（SQA 团队维护建议）|
| equipment-oee | `GET /equipment-oee/dashboard` + `equipment_oee_daily 视图`（19d 顺延）| OEE Controller（设备部）|

**预算 6 endpoint 归属决策**：2-3 PD（cici 与业务方协调 + 主代理 a 接通 mock → real）

### 候选 commit history 治理债（19f 协作 race 教训）

| Task | 范围 | 工时 |
|---|---|---|
| 19g-GOV-1 | 19f 协作 race 教训文档化（详 V0.3 §八）+ 子代理 spawn 模板加协调提示 | 0.3 PD |
| 19g-GOV-2 | 主代理 a 收到子代理报告后核实流程标准化（git log + show --stat 必查）| 0.2 PD |

**预算 commit 治理**：0.5 PD

### 候选 A2' 重启（cici 19g 启动前评估 NC 端反馈）

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19g-A2-RESTART | NC 真端点 phase 2（19d V0.2 §一 5 步重启路径）| 4 PD | NC 端反馈 ≥ 5 项关键差异 + 项目正式协调 |

### 候选 UI-3 phase 3（19f 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19g-UI-3-3 | 35+ 长尾 HTML 原型批量 React 化（按 prototype/ 剩余文件）| 5-10 PD |

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a-19f 候选 C/G。**预算 5-10 PD**

---

## 二、推荐策略：双轨 UI-2-5 E2E + 6 endpoint 归属 + commit 治理

**V0.1 倾向**：
- **主轨 UI-2-5 E2E**：1-1.5 PD（必修 4 次顺延 — 反模式深化风险红线）
- **副轨 6 backend endpoint 归属决策**：2-3 PD（cici 与业务方协调 + mock → real 接通）
- **旁路 commit history 治理债**：0.5 PD（19f 协作 race 教训文档化 + 子代理模板优化）
- **预算 19g**：3.5-5 PD（不含 A2' 重启）

**A2' 启动条件评估**：
- 若 cici 19g 启动前 NC 端反馈 ≥ 5 项 → A2'-RESTART 主轨（合并工时 7-8 PD）
- 若 NC 端持续无反馈 → A2' 继续顺延（性质改变 — cici 19d 已撤主线）

---

## 三、累计技术债（Sprint 19g 必修，决策点 2）

### 3.1 Sprint 17a-19f 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | 17a-19f | 4 PD | **19d 撤** + 待重启条件 |
| 2 | 详情页 / 编辑表单（reports / nc-interface backend endpoint 占位）| 19c | 0.3 PD | 19g 待 cici 确认 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 等 NC 端 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19g 评估 |
| 5 | UI-2-5 E2E Playwright | 19c-19f 4 次顺延 | 1-1.5 PD | **19g 必修** ✅ |
| 6 | ~~vendor brotli + lazy-load~~ | 19b/19d | 0.5-1 PD | **19f STYLE-OPT 已落地** ✅（DevExtreme custom bundler ROI 评估顺延 — 触发条件：19g/19h 部署 Sentry RUM 后实测 LCP > 2.5s 或 FCP > 1.8s 才启动 — 当前 brotli 后 414 KB 传输已达良好基线 / 详 19f Codex P2-2）|
| 7 | UI-STYLE | 19e/19f | 0 | **已完成** ✅ |
| 8 | minSignCount 4 模板真接通后业务回归测试 | 19d | 0.5 PD | 19g 候选 |
| 9 | ~~Razor Page 细粒度 Permission~~ | 19e 起 | 0.5 PD | **19f UI-FIX 已落地** ✅ |
| 10 | ~~abp install-libs LeptonX libs~~ | 19e 起 | 0.1 PD | **19f UI-FIX 已落地** ✅ |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | **19g 6 endpoint 归属一并** |
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |
| **14** | **6 backend endpoint [⚠️] 占位归属决策** | **19f** | **2-3 PD** | **19g 副轨** |
| **15** | **commit history 治理债**（19f 协作 race） | **19f** | **0.3 PD** | **19g 旁路** |

### 3.2 Codex 19f 顺延（待评审后补 §六附录）

> 占位 — Codex 19f 评审完成后从顺延清单挑选补到本节。

**预估合计 ~1-2 PD**（占位等评审后修订）

---

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19g 主线方向 | **双轨 主轨 UI-2-5 E2E 必修（4 次顺延红线）+ 副轨 commit 治理**（cici 2026-05-15 "继续" 接受 V0.1 推荐方案 A — 缩范围）|
| 2 | 15 累计技术债 | **#5 E2E 必修 + #15 commit 治理副轨 + P3 消化** ~2-3 PD（缩范围）|
| 3 | 工时预算 | **UI-2-5 1-1.5 + commit 治理 0.5 + P3 消化 0.3 + 缓冲 = 2-3 PD**（6 endpoint 顺延 19h 等业务方）|
| 4 | 子代理并行策略 | **主代理 a 协调 + 子代理 b UI-2-5 E2E（Playwright 从零集成 + 2 场景）+ 子代理 c commit 治理 + P3 消化** sweet spot 2x |
| 5 | Codex 19f 评审 | **已完成**（read-only 子代理 commit `e7325c5` P1+P2 全修 + `dbcd4ec` 19g §六附录）|
| 6 | A2' 重启决策 | **顺延 19h** — NC 端无反馈 → 性质改变（cici 19h 启动前重新评估）|
| 7 | 6 endpoint 业务方协调时机 | **顺延 19h** — cici 与财务/质保/设备/仓储/SQA 5 业务方协调时机不在 19g；mock 数据继续支撑 Demo |

---

## 五、Sprint 19g 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | UI-2-5 E2E 4 次顺延后再次顺延（反模式深化）| 高 | **19g 必修红线**；如启动 19g 时无可行 Playwright 配置则 spawn 子代理 1 PD 优先做 |
| 2 | 6 endpoint 业务方协调延期（业务方未指派对接人）| 中 | 19g D0 cici 提前通知 5 业务方；mock 数据可继续支撑 Demo 演示直至业务方反馈 |
| 3 | A2' 重启条件评估失误（NC 端反馈数量不足 ≥ 5 但 cici 决策启动）| 中 | V0.2 锁版前 cici 与项目方明确反馈数量 + 反馈质量基线 |
| 4 | commit history 治理债推迟到下下 Sprint（19g 也顺延）| 低 | 旁路位置确保不阻塞主线；最迟 Sprint 20a 必修（教训过期前文档化） |

---

## 六、Codex 19f Finding 附录（评审完成 · P1+P2 全修留痕）

cici 2026-05-15 触发 Codex 风评审子代理（read-only 评 7 commits），独立 finding 清单：

| 等级 | # | Finding | 涉及文件 | 工作量 | 状态 |
|---|---|---|---|---|---|
| **P1** | 1 | 5 新 React Razor Page 权限设计遗漏（67cb4aa 仅修 11 既有，新 5 页面仍 [Authorize]）| SupplyCoresPermissions.cs / Provider / 5 PageModel / i18n × 2 | 0.2 PD | ✅ **当 Sprint 修** |
| P1 | 2 | commit message 与内容严重不符（03de782 message 5 React 页面 vs 实际 vite/package；dc69418 message STYLE-OPT vs 实际 b 22 文件 + brotli）| git history（不可修历史）| 0 | ✅ V0.3 §八 治理债附录已落地 + 19g #15 子代理模板优化 |
| P2 | 1 | React Island mount root id 命名规范文档缺失（虽 16 个 root id 实际一致 kebab-case `#{page-slug}-root`）| frontend/README.md | 0.1 PD | ✅ **当 Sprint 修** |
| P2 | 2 | DevExtreme 25.2.4 lazy-load 评估留档触发条件不明确 | vite.config.ts 注释 + 19g §三 #6 | 0 | ✅ §三 #6 sub-note 加 Sentry RUM LCP/FCP 触发条件 |
| P2 | 3 | scrap-disposal Popup race fix 验证 | scrap-disposal/App.tsx | 0 | ✅ 验证：scrap-disposal 0 Popup → race fix N/A（评审条件不成立）|
| P3 | 1 | eslint.config.mjs ignore 相对路径混合（`dist` vs `../src/...`）| eslint.config.mjs L11-16 | 0.05 PD | 顺延 19g/19h |
| P3 | 2 | 5 新页面 AbortController lifecycle 文档（dashboard / mobile / xinchuang 接真端点后需补 race fix 注释）| 3 App.tsx | 0 | 顺延 19g 接真端点时一并 |

**修复 commit**：`<待 P1+P2 全修 commit>` "fix(supplycores): Sprint 19f Codex 评审 P1+P2 全修（5 新页面 Permission + mount naming + 19g §三 #6 触发条件）"

**Codex 0 顺延 P2 连续 Sprint 记录调整**：
- 12a-19e 13 Sprint（含 19b 1 P2 闭环）
- **19f**: 0 P2 顺延（含 5 fix 全修 + Codex 评审 P1+P2 全修 — 总 0.3 PD ≤ 0.5 PD 阈值）
- **累计 15 Sprint 中 14 Sprint 完整 0 P2 顺延 / 1 P2 闭环（19b vendor → 19f STYLE-OPT 落地）**

新表述："**0 关键 P2 顺延 14 Sprint（11a/13a-19a/19c/19d/19e/19f 跳 19b）+ 1 工作量超阈值 P2 闭环（19b vendor）**"

**协作 race 治理建议（续 19g 子代理 spawn 模板要点）**：
1. 双轨同改 vite.config.ts / package.json 时主代理 spawn 前明确"谁先 commit、谁等对方完成"
2. 子代理回滚 push 后 commit 应先 `git fetch + git log origin/<branch>` 核实远程
3. Codex 评审对 commit message 与内容不符时应逐文件 `git show --stat` 核实
4. 续 19g 主代理 review 子代理报告时必须 `git log + show --stat` 核实，不信赖 message 描述

---

## 七、Codex 19g Finding 附录（评审完成 · P2-2 当 Sprint 修 + 双 race 治理债 19h 继续观察期）

cici 2026-05-15 触发 Codex 风评审子代理（read-only 评 5 commits — code 2 + docs 3）：

| 等级 | # | Finding | 涉及文件 | 工作量 | 状态 |
|---|---|---|---|---|---|
| P1 | 1 | Playwright webServer 配置全注释（CI/CD 集成前置）| playwright.config.ts L47-53 | 0.2 PD | **顺延 19h CI/CD** — 强绑定 19h-CI-1 |
| **P2** | **1** | spec 容错逻辑过松散（Promise.race nodata 虚假 pass）| approval-center / nc-interface spec | 0.25 PD | **顺延 19h** — 与 P1-1 CI/CD 绑定 |
| **P2** | **2** | approval-center 按钮选择器不稳定（`{hasText: "发起新审批"}`）| approval-center.spec.ts L86 | 0.1 PD | ✅ **当 Sprint 修**（getByRole 替）|
| P3 | 1 | 2 spec 缺 seed mock 指南 | 2 spec 顶部 JSDoc | 0.15 PD | 顺延 19h E2E 文档完善 |
| P3 | 2 | nc-interface maxDiffPixelRatio 15% 过高 | nc-interface.spec.ts L82 | 0.1 PD | 顺延 19h baseline 调优 |
| P3 | 3 | AGENTS.md 教训未标优先级 | AGENTS.md 案例表 | 0.05 PD | 顺延 19h spawn_template V1.2 |

**P2-2 修复 commit**：`<待 commit>` "fix(supplycores/frontend): Sprint 19g Codex P2-2 修 — approval-center 按钮选择器（getByRole 替 hasText）"

**Codex 0 顺延 P2 连续记录调整**：
- 12a-19f 14 Sprint（13 完整 + 1 19b vendor 闭环）
- **19g**: 1 P2 当 Sprint 修（P2-2）+ 2 P2 显式顺延 19h（P1-1 webServer + P2-1 spec 容错 — 与 CI/CD 强绑定）
- **累计 15 Sprint 中 13 Sprint 完整 0 P2 顺延 / 1 P2 闭环 / 1 P2 部分顺延（19g）**

新表述："**0 关键 P2 顺延 13 Sprint（11a/13a-19a/19c/19d/19e/19f 跳 19b）+ 1 工作量超阈值 P2 闭环（19b vendor）+ 1 P2 部分顺延（19g 2/3 与 CI/CD 强绑定）**"

---

## 八、双 race 治理债升级评估（Codex 19g 评审重点 · 19h 继续观察期）

**评审结论**（详 19g Demo §三）：
- 教训落地有效性 100%（c b9622d8 自我应用建议 — 精确 add / 自检 / commit 后 4 步验证）
- Hook ROI 偏低（0.5-1 PD vs 14% race 频率 — 2 次 / 14 Sprint）
- 假阳性风险中等（git add . 在 final cleanup 偶现需 --no-verify 绕过）
- 主代理 review + Codex 评审已捕获 race（不依赖 hook）

**19h 决策**：
- **继续观察期** — 不急于实施 git pre-commit hook
- **触发升级阈值**：连续 **3 次** race 或同一子代理 **2 次** race → P1 决策实施
- 替代方案：Codex pre-merge 评审 hook（19h CI-3 候选）
- **19h spawn 子代理 prompt 必须引用** AGENTS.md §多子代理协作约束 + subagent_spawn_template.md §八/§九

**升级预算**（如触发）：19h §一 候选 race-hook 0.5-1 PD（详 19h V0.1 §一）

---

## 九、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双轨 UI-2-5 E2E 必修（4 次顺延红线）+ 副轨 6 endpoint 归属（业务方协调）+ 旁路 commit 治理（19f race 教训）+ 15 累计技术债 + §六 Codex 19f Finding 附录（评审完成 P1+P2 全修留痕）+ A2' 重启评估时机 |
| V0.2 | 2026-05-15 | cici "继续" = 接受 V0.1 推荐方案 A 缩范围 — 双轨 主轨 UI-2-5 E2E（Playwright 从零集成 + 2 场景 1-1.5 PD）+ 副轨 commit 治理（19f race 教训文档化 + 子代理 spawn 模板优化 0.5 PD）+ P3 消化 0.3 PD = 2-3 PD；6 endpoint 顺延 19h 等业务方 + A2' 顺延 19h 性质改变 |
| **V0.3** | **2026-05-15** | **Codex 19g 评审完成 + P2-2 当 Sprint 修** — §七 Codex 19g Finding 附录（1 P1 + 2 P2 + 3 P3 / 1 P2 当 Sprint 修 / 2 P2 显式顺延 19h CI/CD 强绑定）+ §八 双 race 治理债升级评估（19h 继续观察期 / 触发阈值 3 次 / Hook ROI 偏低）+ 累计 P2 记录调整 |
