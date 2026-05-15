# Sprint 19h 任务卡 V0.3（锁版 + Codex 19h 评审 P1+P2 当 Sprint 修留痕）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.3（锁版 + Codex 19h 评审 · cici 2026-05-15 触发 Codex 19h 评审完成 — 2 P1 + 3 P2 + 2 P3 / 4 当 Sprint 修 / P2-3 + P3 顺延 19i CI 真实验证强绑定）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19h 锁版任务卡 + Codex 19h 评审留痕
**配套：** [`Sprint-19g-任务卡-V0.3.md`](./Sprint-19g-任务卡-V0.3.md) §七 Codex 19g 评审 + §八 race hook 继续观察期 + [`Sprint-19g-Demo-脚本-V0.1.md`](./Sprint-19g-Demo-脚本-V0.1.md)

---

## 一、Sprint 19h 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 A2' 重启：NC 真端点 phase 2（17a-19g 7 次顺延 — 19h 评估窗口）

19d 撤主轨后 17a-19g 累计 7 次顺延（19d 实际撤而非"顺延"）— 19h 启动前 cici 评估 NC 端反馈窗口：

| Task | 范围 | 工时 |
|---|---|---|
| 19h-A2-RESTART-1 | NC 端反馈整理（cici 与项目方明确对接人 + 反馈项分级）| 0.3 PD |
| 19h-A2-RESTART-2 | A2-1' 60 ⚠️ 占位稿按反馈分级（必反馈 5 项 + 可选 2 项 + 后置 N 项）| 0.5 PD |
| 19h-A2-RESTART-3 | A2 真端点接通（OAuth2 + Polly + chaos 测试沿用 17a 基础设施）| 2-3 PD |
| 19h-A2-RESTART-4 | 业务回归（4 endpoint + InterfaceTask + 守护测试）| 0.5-1 PD |

**预算 A2' 重启**：3-4 PD（需 cici 启动前确认 NC 端反馈到位）

### 候选 6 backend endpoint 归属决策（19f UI-3 phase 2 + 19g 顺延）

19f UI-3 phase 2 5 React 页面 + 19c reports/nc-interface 累计 6 [⚠️] 占位：

| 页面 | endpoint | 业务方 |
|---|---|---|
| dashboard-bigscreen | `GET /api/supply-cores/dashboard/bigscreen` | 大屏聚合（SQA 团队 / 财务部）|
| quality-check | `GET /quality-checks{,/{id}}` + `POST /{id}/judge` | S-04 质检（质保部）|
| scrap-disposal | `GET /scrap-disposals` + `POST /{id}/{approve|reject|execute}` | S-19 处置（设备部）|
| mobile-stocktake | `GET /stocktake-sheets{,/{id}}` + `POST /{id}/{scan|sync}` | S-15 盘点（仓储部）|
| xinchuang-matrix | `GET /xinchuang/matrix` | readonly 矩阵（SQA 团队维护建议）|
| equipment-oee | `GET /equipment-oee/dashboard` + `equipment_oee_daily 视图`（19d 顺延）| OEE Controller（设备部）|

**预算 6 endpoint 归属决策**：2-3 PD（cici 与业务方协调 + 主代理 a 接通 mock → real）

### 候选 E2E 场景扩展（19g 2 → 5-6 核心场景）

19g 已落地 Playwright 1.60.0 + 2 场景基础 → 19h 扩展：

| Task | 范围 | 工时 |
|---|---|---|
| 19h-E2E-EXT-1 | dashboard-bigscreen 大屏暗色基底 + 12 KPI / donut / 实时事件流 visual baseline | 0.4 PD |
| 19h-E2E-EXT-2 | inventory + purchase-orders + material-master 3 既有页面 E2E 链路 | 0.6 PD |
| 19h-E2E-EXT-3 | RBAC 权限测试场景（21 Permission Default 路径鉴权失败 2 个场景）| 0.3 PD |

**预算 E2E 扩展**：1-1.5 PD

### 候选 CI/CD 集成（19g 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19h-CI-1 | GitHub Actions workflow（dotnet build + dotnet test + npm run build + npm run e2e）| 0.5 PD |
| 19h-CI-2 | Playwright headed 模式 + visual regression baseline diff | 0.3 PD |
| 19h-CI-3 | Codex pre-merge 评审 hook（19f + 19g race 治理债防范）| 0.2 PD |

**预算 CI/CD**：1 PD

### 候选 双 race 治理债升级（19g 顺延评估）

19f + 19g 连续 2 次 race → 是否需 git pre-commit hook：

| Task | 范围 | 工时 |
|---|---|---|
| 19h-RACE-HOOK | git pre-commit hook 校验（验 commit message keyword vs staged 文件路径 / 警告 git add . / -A）| 0.5-1 PD |

**预算 race hook**：0.5-1 PD（视 cici 决策升级紧迫性）

### 候选 UI-3 phase 3（19g 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19h-UI-3-3 | 35+ 长尾 HTML 原型批量 React 化（按 prototype/ 剩余文件）| 5-10 PD |

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a-19g 候选 C/G。**预算 5-10 PD**

---

## 二、推荐策略：双轨 A2' 重启 / 6 endpoint + 旁路 E2E 扩展（视 cici 决策）

**V0.1 倾向**：
- **路径 1（NC 端反馈到位）**：主轨 A2' 重启 3-4 PD + 副轨 6 endpoint 归属 2-3 PD + 旁路 E2E 扩展 1-1.5 PD = **6.5-8.5 PD**（饱和 Sprint）
- **路径 2（NC 端持续无反馈 / 业务方未协调）**：主轨 E2E 扩展 + RBAC 1-1.5 PD + 副轨 CI/CD 集成 1 PD + 旁路 race hook 0.5-1 PD = **2.5-3.5 PD**（缩范围）

**cici 19h 启动前必决策**：
1. NC 端反馈窗口（A2' 重启条件 ≥ 5 项关键差异是否到位）
2. 6 业务方协调（财务/质保/设备/仓储/SQA 5 业务方对接人是否明确）
3. race hook 紧迫性（连续 2 次 race 是否需 mechanical 防范升级）

---

## 三、累计技术债（Sprint 19h 必修，决策点 2）

### 3.1 Sprint 17a-19g 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | 17a-19g | 4 PD | **19d 撤** + 19h 评估重启 |
| 2 | 详情页 / 编辑表单（reports / nc-interface backend endpoint 占位）| 19c | 0.3 PD | 19h 待 cici 确认 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 等 NC 端 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19h 评估 |
| 5 | ~~UI-2-5 E2E Playwright~~ | 19c-19f 4 次顺延 | 1-1.5 PD | **19g 已落地** ✅ |
| 6 | ~~vendor brotli + lazy-load~~ | 19b/19d | 0.5-1 PD | **19f STYLE-OPT 已落地** ✅ |
| 7 | UI-STYLE | 19e/19f | 0 | **已完成** ✅ |
| 8 | minSignCount 4 模板真接通后业务回归测试 | 19d | 0.5 PD | 19h 候选 |
| 9 | ~~Razor Page 细粒度 Permission~~ | 19e 起 | 0.5 PD | **19f UI-FIX 已落地** ✅ |
| 10 | ~~abp install-libs LeptonX libs~~ | 19e 起 | 0.1 PD | **19f UI-FIX 已落地** ✅ |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | **19h 6 endpoint 归属一并** |
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |
| 14 | 6 backend endpoint [⚠️] 占位归属决策 | 19f | 2-3 PD | **19h 副轨**（如业务方协调到位）|
| 15 | commit history 治理债（19f race）| 19f | 0.3 PD | **19g 已落地（AGENTS.md V1.1 + spawn_template V1.1）** ✅ |
| **16** | **双 race 治理债升级（19f + 19g 连续 2 次）** | **19g** | **0.5-1 PD** | **19h 旁路评估 race hook 必要性** |
| **17** | **E2E 场景扩展 + RBAC 测试 + CI/CD 集成** | **19g** | **2-3.5 PD** | **19h 路径 2 主轨** |
| **18** | **UI-3 phase 3 35+ 长尾原型** | **19f 起** | **5-10 PD** | **顺延 19i/20a**（业务价值评估）|

### 3.2 Codex 19g 顺延（待评审后补 §六附录）

> 占位 — Codex 19g 评审完成后从顺延清单挑选补到本节。

**预估合计 ~1-2 PD**（占位等评审后修订）

---

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19h 主线方向 | **路径 2 缩范围**（cici "继续" = 接受 V0.1 路径 2）— 主轨 E2E 扩展 + RBAC 1-1.5 PD + 副轨 CI/CD 集成（含 19g 顺延 P1-1 webServer + P2-1 spec 容错）1-1.5 PD + 旁路 race hook 继续观察 + 19g P3 消化 |
| 2 | 18 累计技术债 | **#17 E2E + CI/CD 主线 + 19g 顺延 P1-1/P2-1 强绑定 CI/CD 子任务 + #16 race hook 旁路评估 + #11 OEE 顺延 19i** |
| 3 | 工时预算 | **E2E 1-1.5 + CI/CD 1-1.5（含 19g 顺延）+ race hook 评估 0.2 + P3 消化 0.3 + 缓冲 = 3-4 PD** |
| 4 | 子代理并行策略 | **主代理 a 协调 + 子代理 b CI/CD 集成（含 19g 顺延 P1-1/P2-1）+ 子代理 c E2E 扩展 + RBAC 测试** sweet spot 2x（19g spawn 模板 V1.1 §八 git 禁忌 + §九 自检 必引用）|
| 5 | Codex 19g 评审 | **已完成**（read-only 子代理 commit `1dd09e7` P2-2 当 Sprint 修 + `f9821dc` 19g V0.3 §七/§八）|
| 6 | A2' 重启决策 | **顺延 19i** — 7 次顺延（性质改变）；cici 19i 启动前重新评估 |
| 7 | 6 endpoint 业务方协调 | **顺延 19i** — cici 与业务方协调时机不在 19h；mock 数据继续支撑 Demo |
| 8 | race hook 紧迫性 | **19h 继续观察期** — 教训落地有效（19g c b9622d8 自我应用 100%）；Hook ROI 偏低；触发阈值连续 3 次 race 或同子代理 2 次 race → P1 实施；19h 旁路评估文档化 0.2 PD |
| 9 | spawn 子代理 prompt 引用约束（19g 新加）| **必含** — AGENTS.md §多子代理协作约束 + subagent_spawn_template.md §八 git 禁忌 + §九 commit 后自检 |

---

## 五、Sprint 19h 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | A2' 重启第 7 次顺延（NC 端持续无反馈）| 高 | cici 19h 启动前评估 → 选路径 2 缩范围 |
| 2 | 6 endpoint 业务方协调延期 | 中 | mock 数据继续支撑 Demo；路径 2 不依赖业务方协调 |
| 3 | E2E 场景扩展 dashboard-bigscreen 暗色基底 visual regression | 中 | snapshot baseline 容忍模糊度调整 + 关键 KPI 文本断言 |
| 4 | race hook 假阳性（误警告合法 commit）| 中 | 实施前先在 b 主代理本地验证 1 周 + 仅警告不阻塞 |

---

## 六、Codex 19h Finding 附录（评审完成 · 4 当 Sprint 修 + race 治理升级反向验证）

cici 2026-05-15 触发 Codex 风评审子代理（read-only 评 5 commits — code 3 + docs 2）：

| 等级 | # | Finding | 涉及文件 | 工作量 | 状态 |
|---|---|---|---|---|---|
| **P1** | **1** | CI E2E 启动策略与 baseURL 错位（webServer :5175 vs baseURL :5100 / dotnet host CI 未启 ECONNREFUSED）| .github/workflows/ci.yml + playwright.config.ts | 0.05-0.3 PD | ✅ **决策 B 文档化**（commit `460ed6a`）+ 决策 A 顺延 19i CI 真实运行验证 |
| **P1** | **2** | RBAC 场景 1 hasAuthHint 正则过宽松（"权限"业务词假阳性）| rbac.spec.ts L48-54 | 0.2 PD | ✅ **当 Sprint 修**（改 ABP/Identity 框架级 marker）|
| **P2** | **1** | webServer timeout 60s 过长 | playwright.config.ts L67 | 0.1 PD | ✅ **当 Sprint 修**（→ 20s）|
| **P2** | **2** | dashboard-bigscreen visual baseline 8% 对 mock 数据过严 | dashboard-bigscreen.spec.ts L74 | 0.1 PD | ✅ **当 Sprint 修**（→ 12%）|
| P2 | 3 | CI workflow 缺 e2e 日志 artifact 上传 | ci.yml L185-188 | 0.2 PD | 顺延 19i CI 真实运行验证强绑定 |
| P3 | 1 | 3 App.tsx 缺 title testid + spec 检查 | inventory/purchase-orders/material-master | 0.1 PD | 顺延 19i 文档完善 |
| P3 | 2 | AGENTS.md V1.2 治理升级表加序号列 | AGENTS.md L220-223 | 0 PD | 顺延 19i 文档润色 |

**修复 commit**：`460ed6a` "fix(supplycores/frontend): Sprint 19h Codex 评审 P1+P2 当 Sprint 修（4 项 0.45 PD）"

**Codex 0 顺延 P2 连续记录调整**：
- 12a-19g 15 Sprint（13 完整 + 1 闭环 + 1 部分顺延 19g 闭环 19h）
- **19h**: 2 P2 当 Sprint 修（P2-1 + P2-2）+ 1 P2 显式顺延 19i（P2-3 与 CI 真实验证强绑定）
- **累计 16 Sprint 中 13 Sprint 完整 + 2 闭环（19b vendor + 19g 强绑定）+ 1 P2 部分顺延（19h 1/3 与 CI 真实运行强绑定）**

新表述："**0 关键 P2 顺延 13 Sprint + 19b vendor 闭环 + 19g/19h 强绑定 P2 闭环 + 19i CI 真实运行强绑定续闭环（期望）**"

---

## 七、双子代理 0 race 治理升级反向验证（Codex 19h 评审重点）

**关键数据对标**：
- 19f：2 race（子代理 commit 误纳）
- 19g：1 race（子代理 reset HEAD 冲走另一子代理 staged 文件）
- **19h：0 race**（19h b/c 零误纳 / 零冲突）

**反向验证结论（Codex 19h 评审）**：
1. ✅ 教训 6 [P0] 强制有效 — 19h 双子代理 100% 遵守"禁 git add . / -A"，精确路径 add（b 4 / c 9）
2. ✅ 教训 7 [P0] 自检有效 — b/c 均执行 4 步自检（git log -1 + show --name-status + stat + status）
3. ⚠️ **治理升级成熟度评估**：19h 0 race 拆解 = **50% 教训有效 + 50% 任务边界天然分离**
   - 19h 双子代理任务边界天然分离（b 改 .github + spec 2，c 改 4 spec + 4 App.tsx — 无竞争关键文件）
   - vs 19g race 源于 c 已 staged 6 治理文件后 b reset --hard 全冲走 — 这次任务设计避免该竞争场景
   - **续 Sprint 验证条件**：当双子代理改同一模块（如都改 App.tsx / vite.config.ts）时治理建议有效性才能真验证

**19h → 19i 续约**：
- 教训 6/7 [P0] 保留为强制约束（spawn prompt 必含）
- Hook ROI 评估维持"继续观察期"决策（Codex 19h 评审一致）
- 触发条件不变（连续 3 次 race 或同子代理 2 次）
- **任务边界设计原则（19i 新加）**：spawn 双子代理时主代理 a 先评估"任务边界是否天然分离"，若否则考虑串行 spawn 或更明确的文件归属约束

---

## 八、A2' 8 次顺延评估（Codex 19h 评审 / cici 19i 必决策）

**顺延历史回顾**：
- 17a-19c：A2' NC 真端点 phase 2（4 次顺延）
- 19d：NC 反馈无进展 → **撤架**（性质变更，非顺延）
- 19e-19g：A2-1' 占位稿 NC 反馈迭代（3 次顺延）
- 19h：v0.2 决策"顺延 19i"（第 8 次）

**A2' 重启风险评估（Codex 19h 评审）**：

| 指标 | 当前状态 | 风险等级 | cici 19i 决策 |
|---|---|---|---|
| NC 端反馈（必要条件） | 无进展 5 月 | 🔴 高 | 需主动沟通 NC；无反馈则改为 mock 或缩范围 |
| 业务方协调（必要条件） | 6 endpoint 业务方对接人未明确 | 🟡 中 | cici 需与财务/质保/设备/仓储 5 方确认时间表 |
| 技术负债成熟度（充分条件） | 19f 基础设施（Polly + chaos）仍可用 | 🟢 低 | 19i-A2-RESTART-3 可复用 17a 代码；2-3 PD 可信 |
| 产品 ROI（终局评估） | 8 次顺延 = 5 月耗时 | 🔴 高 | **cici 与 PO 确认**：A2' 重启 vs UI-3 phase 3 优先级 |

**19i 必决策清单**：
- [ ] NC 端反馈是否到位（"关键 5 项差异" 答复）— **NO** → 改 mock 或撤 A2' 转做 UI-3
- [ ] 6 业务方对接人确认 — **NO** → mock 继续支撑 Demo
- [ ] A2' 重启优先级 vs UI-3 phase 3 对标 — 需 PO 明确
- [ ] CI secrets 自配（DEVEXTREME_LICENSE / SUPPLYCORES_CATIO_PAT）时机确认

**Codex 19h 评审建议**：19h 评审通过后，cici 立即发起 NC 端/业务方对接，给 19i D1-D2 留出决策窗口；否则 19i 启动日期需后延。

---

## 九、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双路径（NC 反馈到位 / 缩范围）+ A2' 重启 + 6 endpoint + E2E 扩展 + CI/CD + race hook + 18 累计技术债 + §六 Codex 19g Finding 附录占位 + cici 19h 启动前 3 决策点（NC 反馈 / 业务方协调 / race hook 紧迫性）|
| V0.2 | 2026-05-15 | cici "继续" = 接受 V0.1 路径 2 缩范围 — 主轨 E2E 扩展 + RBAC 1-1.5 PD + 副轨 CI/CD 集成（含 19g 顺延 P1-1 webServer + P2-1 spec 容错）1-1.5 PD + 旁路 race hook 继续观察期 + P3 消化 = 3-4 PD；A2' + 6 endpoint 顺延 19i；§四 锁版决策 + 决策 9（spawn 子代理 prompt 必引用 AGENTS.md V1.1 + spawn_template V1.1 §八/§九）|
| **V0.3** | **2026-05-15** | **Codex 19h 评审完成 + P1+P2 4 当 Sprint 修** — §六 Codex 19h Finding 附录（2 P1 + 3 P2 + 2 P3 / 4 当 Sprint 修 commit `460ed6a` / P2-3 + P3 顺延 19i CI 真实验证强绑定）+ §七 双子代理 0 race 治理升级反向验证（50% 教训有效 + 50% 任务边界天然分离 / 续 Sprint 真验证条件）+ §八 A2' 8 次顺延评估（cici 19i 必决策清单）+ 累计 P2 记录调整 |
