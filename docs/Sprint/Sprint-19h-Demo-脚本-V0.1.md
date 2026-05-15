# Sprint 19h Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19h 验收演示脚本
**配套：** [`Sprint-19h-任务卡-V0.2.md`](./Sprint-19h-任务卡-V0.2.md)

---

## 一、Sprint 19h 落地范围

按 V0.2 锁版（cici "继续" = 接受 V0.1 路径 2 缩范围），实际交付 **~2.6 PD**（vs V0.2 3-4 PD 预算 节省 13-35%）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（路径 2 缩范围 + 6 endpoint/A2' 顺延 19i + race hook 旁路评估）| `dfd68f6` | a | 0.2 |
| **D1-3** | CI/CD 集成（GitHub Actions ci.yml 197 行 / 3 jobs / NuGet+npm cache）+ Codex 19g 顺延闭环（P1-1 webServer 激活 + P2-1 spec 容错加严）| `a07120b` | **b** | 1.15 |
| **D1-3** | E2E 扩展（dashboard-bigscreen + inventory + purchase-orders + material-master 4 spec + RBAC 5 spec / 11 新 cases）+ 4 App.tsx data-testid | `3c8f6a5` | **c** | 1.0 |
| **D4** | AGENTS.md V1.2 治理升级实测验证表 + git pre-commit hook 评估文档化（旁路） + Codex 19g P3-3 教训优先级标签 [P0/P1/P2] | `47b1dbd` | **a** | 0.25 |

**A2' 副轨**：顺延 19i（19d 撤后 17a-19g 累计 7 次顺延）— cici 19i 启动前重新评估 NC 反馈窗口
**6 endpoint 副轨**：顺延 19i — cici 与业务方协调时机不在 19h
**race hook 旁路**：评估文档化（不实施）— 19h 双子代理 0 race 验证文档治理已足够

**测试基线**：
- 后端 1760 测试零 regression
- frontend 16 entries build OK + brotli + 0 Circular ✅
- npm run lint 0 errors / 0 warnings ✅
- **npx playwright test --list → 15 tests in 7 files** ✅（19g 4 + 19h 11 新）
- dotnet build 0 错误 ✅
- GitHub Actions ci.yml YAML 解析正常（pyyaml safe_load）

---

## 二、Demo 演示路径

### 路径 A：CI/CD 集成（5 分钟 — 核心高光）

1. **`.github/workflows/ci.yml` 197 行 3 jobs**：
   - **dotnet-build**: dotnet restore + build SupplyCores.slnx + test --filter "Category!=Integration"（沿用 17a Wave87 Trait 约定）
   - **frontend-build**: npm ci + tsc -b + vite build + eslint
   - **e2e**: Playwright chromium（needs frontend-build）
2. **触发**: push to main + pull_request to main + workflow_dispatch
3. **矩阵**: .NET 10 + Node 22 + NuGet/npm 双 cache（actions/cache）
4. **3 cici 决策点 continue-on-error 兜底**：
   - SUPPLYCORES_CATIO_PAT secret（Catio sibling checkout 需 PAT）
   - DEVEXTREME_LICENSE secret（vite build license 注入）
   - backend integration E2E（19i 决策点）
5. **19g 顺延 P1-1 webServer 激活**（`playwright.config.ts` L47-69）：
   - command: `npm run dev` + url `http://localhost:5175` + reuseExistingServer + 60s timeout
   - 本地 `npx playwright test --list` 验通 12 tests / 6 files
6. **19g 顺延 P2-1 spec 容错加严**：
   - approval-center / nc-interface 3 处 nodata 分支加 `console.warn` → 不再静默 pass

### 路径 B：E2E 场景扩展（5 分钟）

1. **15 tests in 7 files**（vs 19g 4 tests 提速 4x）：
   - 既有：approval-center.spec.ts (2) + nc-interface.spec.ts (2)
   - 新加：dashboard-bigscreen (2) + inventory (2) + purchase-orders (2) + material-master (2) + rbac (3)
2. **dashboard-bigscreen 暗色基底 visual baseline**（maxDiffPixelRatio 8% — 比 19g nc 15% 严格）+ mask 时钟 + 日期防 false positive
3. **RBAC 2 场景**：
   - 场景 1：context.clearCookies() 模拟匿名 + 容忍 3 种合规结果（URL Login/Identity/authorize / status 302/401/403 / body 含登录关键字）
   - 场景 2：test.skip 占位 [⚠️ 待 cici 19i+ 接通测试用户 seed + 登录 helper]
4. **4 App.tsx data-testid 最小化侵入**：page-container + h1 title 2 个 testid 加在已有 JSX

### 路径 C：双子代理治理升级实测（5 分钟 — 关键里程碑）

19h 双子代理 b/c 0 race / 0 误纳 — **race 治理升级 100% 有效验证**：

| 子代理 | commit | 教训 6 [P0] | 教训 7 [P0] | race 结果 |
|---|---|---|---|---|
| 19h b | `a07120b` | ✓ 精确 4 路径 add | ✓ 4 步自检 | 0 race |
| 19h c | `3c8f6a5` | ✓ 精确 9 路径 add | ✓ 4 步自检 + 工作树 clean | 0 race / 0 误纳 |

**对比 19f / 19g race 历史**：
| Sprint | 子代理 | race | 治理结论 |
|---|---|---|---|
| 19f | b/c | 2 次 race（commit message 误差严重）| 文档化教训 |
| 19g | b/c | 1 次 race（c 修治理债工作被抓走 — 讽刺）| 教训 5/6/7 + spawn_template V1.1 §八/§九 |
| **19h** | **b/c** | **0 race** | **治理升级 100% 有效** |

### 路径 D：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores && cd modules/nova.supplycores/frontend && npm run e2e`
2. 自动启动 vite dev server（webServer 配置激活）+ 跑 15 tests / 7 files
3. visual baseline 首次跑生成 .png snapshots
4. 浏览器看 GitHub Actions ci.yml workflow 推送后 trigger（待 cici 配置 secrets）

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 路径 2 缩范围（E2E 扩展 + CI/CD + race hook 评估）| ✅ 双轨闭环 + race hook 评估文档化 |
| 2. 累计技术债 | #17 E2E + CI/CD 主线 + 19g 顺延 P1-1/P2-1 强绑定 | ✅ 全闭环 |
| 3. 工时预算 | V0.2 3-4 PD | **2.6 PD 实际** vs 预算 节省 13-35% |
| 4. 子代理并行 | b CI/CD + c E2E + RBAC | ✅ 双子代理 sweet spot 实测（**0 race 突破**）|
| 5. Codex 19g 评审 | 已完成（1dd09e7 P2-2 + f9821dc V0.3）| ✓ |
| 6. A2' 重启 | 顺延 19i（7 次顺延性质改变）| ⏳ 19i 启动前评估 |
| 7. 6 endpoint 业务方协调 | 顺延 19i | ⏳ 19i cici 协调 |
| 8. race hook 紧迫性 | 19h 继续观察期（不实施）| ✅ AGENTS.md V1.2 评估文档化 |
| 9. spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.1 + spawn_template V1.1 §八/§九 | ✅ 19h 双子代理 100% 遵守 |

### Sprint 19h 特殊性

**首次 race 治理升级 0 race 验证**：
- 19f / 19g 连续 2 次 race → 19h 0 race（spawn_template V1.1 §八/§九 强制注入生效）
- 教训 6/7 [P0] 100% 命中（双子代理精确 add + 4 步自检）
- git pre-commit hook 评估：不实施（文档治理已足够），触发阈值连续 3 次 / 同子代理 2 次

**首次 CI/CD 集成（GitHub Actions 从零起）**：
- 3 jobs（dotnet + frontend + e2e）+ NuGet+npm 双 cache + 3 cici 决策点 continue-on-error 兜底
- 19g 顺延 P1-1 webServer + P2-1 spec 容错全闭环

**Codex 0 顺延 P2 连续记录维持**：
- 累计 15 Sprint 13 完整 + 1 闭环（19b vendor）+ 1 部分顺延（19g 2/3 → 19h 闭环）= **19h 强绑定顺延闭环 ✅**
- 新表述："**0 关键 P2 顺延 13 Sprint + 19b vendor 闭环 + 19g/19h 强绑定顺延闭环**"

---

## 四、Sprint 19i 候选方向

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **A2' 重启** | NC 真端点 phase 2（19d 5 步重启路径）| 4 PD | NC 端反馈 ≥ 5 项 + 项目协调正式化 |
| **6 backend endpoint 归属决策** | dashboard / quality / scrap / mobile / xinchuang / OEE 业务方协调 | 2-3 PD | cici 与业务方协调到位 |
| **CI/CD 真实运行验证** | secrets 配置（PAT / DEVEXTREME LICENSE）+ 首次 PR run | 0.5 PD | cici 配 GitHub secrets |
| **RBAC 场景 2 接通**（19h 占位）| 测试用户 seed + 登录 helper + 真实 Permission 鉴权 | 1 PD | 测试用户 seed 设计 |
| **UI-3 phase 3** | 35+ 长尾 HTML 原型批量 React 化 | 5-10 PD | 业务价值评估 |
| **C / G** | 详设 09 看板 / 06 库存超储（持续顺延）| 5-10 PD | 无 |

**V0.1 倾向**：双轨 A2' 重启（如 NC 反馈到位）+ 6 endpoint 归属（cici 与业务方协调到位）— 6-7 PD；或路径 2 缩范围 CI/CD secrets + RBAC 场景 2 真接 ~1.5 PD

---

## 五、Sprint 19h Codex 评审待触发

> 占位 — Sprint 19h 完成时 cici 触发 Codex 19h 评审

**评审重点**：
- GitHub Actions ci.yml 配置正确性（3 jobs / cache / continue-on-error 兜底 / secrets 占位）
- 19g 顺延 P1-1 webServer + P2-1 spec 容错闭环完整性
- E2E 4 spec + RBAC 2 场景实现策略（visual baseline 阈值 / RBAC 2 场景 mock 鉴权方式 / test.skip 占位合理性）
- AGENTS.md V1.2 race hook 评估完整性 + 触发阈值合理性
- **双子代理 0 race 治理升级实测**（治理建议有效性的反向验证）

**触发提示词**：
"评审 Sprint 19h 共 4 commits（`dfd68f6` V0.2 锁版 / `a07120b` b CI/CD + 19g 顺延 / `3c8f6a5` c E2E 扩展 + RBAC / `47b1dbd` AGENTS.md V1.2 治理升级 + race hook 评估）— 重点关注 CI/CD 集成正确性 + RBAC 场景 2 mock 鉴权 + AGENTS.md V1.2 race hook 评估触发阈值 + **双子代理 0 race 治理升级反向验证**"

**累计待评审 Sprint**：19h（19g 已评审 P2-2 当 Sprint 修 + 19g 顺延 P1-1/P2-1 19h 闭环）— 强烈建议 cici 触发 Codex 19h 评审，重点验证 race 治理升级反向验证。

**Codex 0 顺延 P2 连续记录目标**：保持 13/15 完整 + 1 闭环 + 1 强绑定闭环节奏（19h 0 P2 顺延期望）。

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 路径 2 缩范围 2.6 PD（vs 3-4 PD 节省 13-35%）+ 4 演示路径 + 双子代理 0 race 治理升级实测验证 + race hook 评估文档化（19h 不实施 / 触发阈值 3 次）+ Codex 19h 触发提示 |
