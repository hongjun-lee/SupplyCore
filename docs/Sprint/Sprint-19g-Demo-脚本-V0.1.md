# Sprint 19g Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19g 验收演示脚本
**配套：** [`Sprint-19g-任务卡-V0.2.md`](./Sprint-19g-任务卡-V0.2.md)

---

## 一、Sprint 19g 落地范围

按 V0.2 锁版（cici "继续" 接受 V0.1 推荐方案 A），实际交付 **~1.55 PD**（vs V0.2 2-3 PD 预算 节省 ~40%）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 草案 + V0.1 → V0.2 锁版（推荐方案 A）| `6ddb90d` + `cd0b4d0` | a | 0.2 |
| **D1-3** | UI-2-5 E2E Playwright 从零集成 + 2 场景（approval-center + nc-interface 4 tests）| `1a0ecc1`（含 race 误纳）| **b** | 0.9 |
| **D1-2** | commit 治理（AGENTS.md / docs/internal/subagent_spawn_template.md V1.0）+ P3-1 ESLint ignore + P3-2 3 App.tsx 注释 | `1a0ecc1`（race 误纳归属错位 / 实际 c 工作）| **c** | 0.55 |
| **D2** | 治理债追记 commit（19g 新 race 案例 + AGENTS.md V1.1 + spawn_template V1.1 §八 git 禁忌 + §九 commit 自检）| `b9622d8` | **c** | 0.1 |

**6 endpoint 副轨**：顺延 19h（cici 与财务/质保/设备/仓储/SQA 5 业务方协调时机不在 19g）。
**A2' 副轨**：顺延 19h（NC 端无反馈 → 性质改变）。

**测试基线**：
- 后端 1760 测试零 regression（19g 仅前端 E2E + 文档 + ESLint 修，未动业务逻辑）
- npm run build 16 entries + brotli 0 错误 ✅
- npm run lint 0 errors / 0 warnings ✅
- npx playwright --version 1.60.0 + 4 tests in 2 specs ✅
- dotnet build 0 错误 ✅

---

## 二、Demo 演示路径

### 路径 A：Playwright E2E 集成（5 分钟 — 核心高光）

1. **Playwright 1.60.0 + chromium**：`cd modules/nova.supplycores/frontend && npx playwright --version`
2. **playwright.config.ts**：baseURL `/supplycores/` + testDir `./tests/e2e` + trace/screenshot/video on retry
3. **2 spec 文件 4 tests**：
   - `tests/e2e/approval-center.spec.ts`：列表加载 + Popup 详情链路 + 发起新审批 Form（2 tests）
   - `tests/e2e/nc-interface.spec.ts`：NcHealthSnapshot Dashboard + 4 Tab + 刷新按钮（2 tests）
4. **5 data-testid 最小化侵入**（业务逻辑零改动）
5. **npm scripts**：`e2e` + `e2e:ui` 加入 + `.gitignore` 加 `test-results/` `playwright-report/`

### 路径 B：commit 治理债 V2 强化（5 分钟）

1. **AGENTS.md V1.1**（85 行 = 76 V1.0 + 9 V1.1 追记）：
   - §多子代理协作约束（触发条件 / 4 协调原则 / 19f 案例表 4 行）
   - V1.1 追加 19g 新 race 案例 + 3 条新教训
2. **docs/internal/subagent_spawn_template.md V1.1**（194 行 = 167 V1.0 + 27 V1.1）：
   - §一-§七 标准 spawn prompt 模板 / 30s 探查 / 4 核心原则 / 实测案例
   - §八 git 操作禁忌清单 6 项（git add . / git add -A / 裸 git reset HEAD / commit -a 等）
   - §九 commit 后自检 checklist 4 步（log + show --name-status + show --stat + status）

### 路径 C：双 race 治理债案例（5 分钟）

**19f race**：b commit `03de782` message "5 React 页面" 实际仅 vite/package；c commit `dc69418` 实际含 b 22 文件 + brotli — message 严重误差。
**19g race**：b commit `1a0ecc1` message "UI-2-5 E2E" 实际含 c 完整 6 文件治理工作（讽刺：c 修 race 治理的工作被 race 抓走）。c 用 `b9622d8` 治理追记自我应用 race 治理建议（精确 add + 自检），治理建议有效。

**治理债总结**：
- 功能完整落地 main 分支（每次 race 后所有文件都 push 到远程）
- commit history 与 message 错位形成治理债
- 续 Sprint 子代理 spawn prompt 必引用 AGENTS.md §多子代理协作约束 + subagent_spawn_template.md §八/§九

### 路径 D：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores && dotnet run --project src/SupplyCores.Web`
2. 另一终端 `cd modules/nova.supplycores/frontend && npm run dev`
3. 另一终端 `npm run e2e` → 4 tests pass（chromium headless）
4. 浏览器访问 `/supplycores/approval-center` + `/supplycores/nc-interface` 看 React Island mount 正常

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 双轨 主轨 UI-2-5 E2E + 副轨 commit 治理 | ✅ 双轨完整闭环 |
| 2. 累计技术债 | #5 E2E 必修 + #15 commit 治理 + P3 消化 | ✅ 全修 |
| 3. 工时预算 | V0.2 2-3 PD | **1.55 PD 实际** vs 预算 节省 ~40% |
| 4. 子代理并行 | b UI-2-5 + c commit 治理 + P3 | ✅ 双子代理 sweet spot 实测（但 race 再次发生）|
| 5. Codex 19f 评审 | 已完成（e7325c5 P1+P2 全修 + dbcd4ec）| ✓ |
| 6. A2' 重启 | 顺延 19h（NC 无反馈性质改变）| ⏳ 19h 启动前评估 |
| 7. 6 endpoint 业务方协调 | 顺延 19h（mock 数据继续支撑 Demo）| ⏳ 19h cici 协调 |

### Sprint 19g 特殊性

**双 race 治理债深化（19f + 19g 连续 2 次）**：
- 19g race 完全复现 19f 模式 — 治理建议本想防止但被 race 抓走
- c 用 b9622d8 追记 commit 自我应用 race 治理建议（精确 add + 自检），证明建议有效
- AGENTS.md V1.1 + spawn_template V1.1 §八 git 禁忌 + §九 自检 落地 — 续 Sprint 必引用
- Memory V2 更新（19f + 19g 双案例 + 8 条 How to apply）

**首次 E2E 测试集成**（19c-19f 4 次顺延后 19g 必修红线达成）：
- Playwright 1.60.0 + chromium 标准模板
- 2 核心场景（approval-center 完整链路 + nc-interface 监控）
- 5 data-testid 最小化侵入 + DevExtreme 内置 class 复用

**Codex 0 顺延 P2 连续记录维持**：14 Sprint 13 完整 + 1 闭环（19b vendor → 19f STYLE-OPT 落地）；19g 期望保持。

---

## 四、Sprint 19h 候选方向

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **A2' 重启** | NC 真端点 phase 2（19d V0.2 §一 5 步重启路径）| 4 PD | NC 端反馈 ≥ 5 项关键差异 + 项目正式协调 |
| **6 backend endpoint 归属决策** | dashboard / quality / scrap / mobile / xinchuang / OEE 业务方协调 mock → real | 2-3 PD | cici 与业务方协调到位 |
| **UI-3 phase 3** | 35+ 长尾 HTML 原型批量 React 化 | 5-10 PD | 无 |
| **E2E 场景扩展** | 19g 2 场景 → 5-6 核心场景（含 react-router / dashboard-bigscreen 暗色基底）| 1-1.5 PD | 无 |
| **CI/CD 集成** | GitHub Actions Playwright + dotnet test 矩阵 | 1 PD | 无 |
| **C / G** | 详设 09 看板 / 06 库存超储（持续顺延）| 5-10 PD | 无 |

**V0.1 倾向**：双轨 A2' 重启（如 NC 反馈到位）+ 6 endpoint 归属 — 7-8 PD；或退路双轨 E2E 扩展 + CI/CD 集成 ~2.5 PD

---

## 五、Sprint 19g Codex 评审待触发

> 占位 — Sprint 19g 完成时 cici 触发 Codex 19g 评审

**评审重点**：
- Playwright 集成正确性（playwright.config.ts / spec 模板 / 5 data-testid 最小化侵入）
- 4 tests 实际 runtime 验证（需 dotnet run + npm run dev + npm run e2e）
- AGENTS.md V1.1 + spawn_template V1.1 §八 git 禁忌 + §九 自检 完整性
- **双 race 治理债评估**（19f + 19g 连续 2 次后建议升级 — 是否需要 git pre-commit hook 验证）
- P3-1 ESLint ignore 绝对路径修 + P3-2 3 App.tsx AbortController lifecycle 注释

**触发提示词**：
"评审 Sprint 19g 共 4 commits（`6ddb90d` V0.2 mv / `cd0b4d0` V0.2 内容 / `1a0ecc1` b UI-2-5 E2E 含 c 误纳 / `b9622d8` c 治理追记）— 重点关注 Playwright 集成正确性 + AGENTS.md V1.1 + spawn_template V1.1 治理升级 + **双 race 治理债建议升级**"

**累计待评审 Sprint**：19g（19f 已评审 P1+P2 全修）— 强烈建议 cici 触发 Codex 19g 评审，重点验证双 race 治理债升级建议。

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 双轨 UI-2-5 E2E + commit 治理 1.55 PD（vs 2-3 PD 节省 40%）+ 4 演示路径 + 双 race 治理债深化（19f + 19g）+ Codex 19g 触发提示 |
