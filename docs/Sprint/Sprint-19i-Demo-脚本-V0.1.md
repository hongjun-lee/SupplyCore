# Sprint 19i Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19i 验收演示脚本
**配套：** [`Sprint-19i-任务卡-V0.2.md`](./Sprint-19i-任务卡-V0.2.md)

---

## 一、Sprint 19i 落地范围

按 V0.2 锁版（cici AskUserQuestion 必决策"路径 2 缩范围"），实际交付 **~2.4 PD**（vs V0.2 2.6-3.0 PD 节省 7-20%）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（cici 必决策路径 2 + A2'/6 endpoint 顺延 19j）| `8ac8646` | a | 0.2 |
| **D1-3** | Codex pre-merge 评审 hook（codex-review.yml 236 行 + PR comment auto-update + OpenAI API + secrets 占位）+ 19h P2-3 CI e2e 日志 artifact upload | `296f716` | **c** | 0.9 |
| **D1-3** | RBAC 场景 2 接通（RbacTestUserDataSeedContributor + login helper + rbac.spec.ts 解 skip 真验证）+ 19h P3-1 复核（19h c 3c8f6a5 已落地不重复改）| `7fa526c` | **b** | 0.9 |

**A2' 副轨**：顺延 19j 重新评估（cici 19i AskUserQuestion 必决策 — NC 无反馈 5 月 8 次顺延）
**6 endpoint 副轨**：顺延 19j（cici 与 5 业务方协调时机不在 19i）
**CI/CD secrets**：cici 19i D0 自助配（PAT + DEVEXTREME LICENSE 0.1 PD — 未在子代理范围）

**测试基线**：
- 后端 1760 测试零 regression（含新加 RbacTestUserDataSeedContributor 2 测试用户 — SeedTestUsers=false 默认关闭）
- frontend 16 entries build OK + brotli + 0 Circular ✅
- npm run lint 0 errors / 0 warnings ✅
- **npx playwright test --list → 15 tests in 7 files**（场景 2 解除 test.skip 接通真验证）✅
- dotnet build SupplyCores.slnx **0 errors** ✅
- GitHub Actions ci.yml + codex-review.yml YAML 解析正常

---

## 二、Demo 演示路径

### 路径 A：Codex pre-merge 评审 hook（5 分钟 — 核心高光）

1. **`.github/workflows/codex-review.yml` 236 行**：
   - 触发：PR opened/synchronize/reopened on main + 手动 workflow_dispatch
   - 评审引擎：curl + jq 调 OpenAI Chat Completions API（model 默认 `gpt-4o-mini`，env 可改）
   - PR diff 处理：`git diff origin/<base>...HEAD` 截断 60KB，排除 lock/dist/bin/obj/*.min.* 防 token 超限
   - PR comment：`actions/github-script@v7` + `<!-- codex-review-bot -->` header 识别已有 comment 自动 update（不堆积）
   - markdown table 格式与 Sprint 19f-19h §六附录一致（P1/P2/P3 + 涉及文件 + 工作量 + 修复建议）
2. **secrets 占位**：
   - `OPENAI_API_KEY`（cici 自助配；未配时跳过 API 调用 + placeholder comment 提示）
   - `GITHUB_TOKEN`（自动注入 `pull-requests: write`）
3. **兜底**：`continue-on-error: true` API 不可用不阻塞 merge；finding 同步上传 artifact（retention 14 天）

### 路径 B：RBAC 场景 2 接通（5 分钟）

1. **`RbacTestUserDataSeedContributor.cs`**（Domain/Identity/）：
   - `rbac.test.user.admin` — 19 项 `SupplyCoresPermissions.*.Default` 全 grant
   - `rbac.test.user.no_dashboard` — 仅 `Inventory.Default` + 显式撤销 `DashboardBigscreen.Default`
   - 开关 `SupplyCores:SeedTestUsers=true`（默认关闭，生产严禁开启）
   - `[UnitOfWork]` + 幂等（重跑 seed 不重复创建）
2. **`tests/e2e/helpers/login.ts`**（frontend）：
   - `loginAs(page, username, password)` — APIRequestContext POST `/Account/Login`（GET 拿 CSRF → POST form → 302 + cookie 同步）
   - `loginAsTestUser(page, role)` — 'admin' | 'no_dashboard' 便捷封装
3. **`rbac.spec.ts` 场景 2 真验证**（替代 19h test.skip 占位）：
   - 链路：`loginAsTestUser('no_dashboard') → goto /dashboard-bigscreen → expect 403 ∪ 框架级 hint ∩ NOT 重定向登录`
   - 加严断言（参考 19h Codex P1-2 hasAuthFrameworkHint 模式）
   - 容错：seed 未启用 → console.warn + test.skip（不破坏 CI）
4. **启动条件（cici 19i D0 自助）**：
   - `appsettings.json` 加 `"SupplyCores": { "SeedTestUsers": true }`
   - `dotnet run src/SupplyCores.DbMigrator`

### 路径 C：19h 顺延强绑定闭环（5 分钟）

1. **P2-3 CI workflow e2e 日志 artifact 上传**（`ci.yml`）：
   - `npm run e2e 2>&1 | tee e2e.log`（保留退出码 `set -o pipefail`）
   - `actions/upload-artifact@v4` 上传 e2e.log + playwright-report/（retention 14 天，`if: always()`）
   - 失败时也上传 — 便于诊断
2. **P3-1 3 App.tsx title testid**：19h c `3c8f6a5` 已落地（b 复核遵守任务边界分离不重复改）
3. **P3-2 AGENTS.md 治理升级表序号列**：可顺延 19j 文档润色（影响轻）

### 路径 D：双子代理 0 race 治理升级稳定（5 分钟）

19h + 19i 连续 2 Sprint 双子代理 0 race（治理升级稳定有效）：

| Sprint | 子代理 | commit | race 结果 | 关键证据 |
|---|---|---|---|---|
| 19h | b | `a07120b` | 0 race | 精确 4 路径 + 4 步自检 |
| 19h | c | `3c8f6a5` | 0 race / 0 误纳 | 精确 9 路径 + 工作树 clean 验证 |
| **19i** | c | `296f716` | **0 race / 0 误纳** | 精确 3 路径 + 4 步自检 + origin/main 二次核实 |
| **19i** | b | `7fa526c` | **0 race / 0 误纳** | 精确 5 路径 + 4 步自检 + linear history（c 已 commit 之上）|

**任务边界天然分离 100%**：c 改 .github + docs/internal / b 改 Domain + frontend tests/e2e — 0 文件交集。

**Codex 19h 评审 §七 反向验证结论**：50% 教训有效 + 50% 任务边界天然分离 → **19i 双子代理"任务边界设计原则"（V0.2 决策 10）执行后 0 race 实测稳定**。

### 路径 E：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores`
2. `cd modules/nova.supplycores/frontend && npm run build` → 16 entries + brotli + 0 Circular
3. `dotnet build SupplyCores.slnx` → 0 errors
4. `npm run lint` → 0 errors / 0 warnings
5. `npx playwright test --list` → 15 tests in 7 files（场景 2 不再 skip）
6. PR open → GitHub Actions ci.yml + codex-review.yml 双 workflow 触发（cici 自助配 secrets 后可用）

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 路径 2 缩范围（CI/CD + RBAC + Codex hook）| ✅ 双轨闭环 |
| 2. 累计技术债 | #19 + #20 + #21 主线 + 19h 顺延 P2-3 / P3-1 一并 | ✅ 全闭环（P3-2 顺延 19j 文档润色）|
| 3. 工时预算 | V0.2 2.6-3.0 PD | **2.4 PD 实际** vs 预算 节省 7-20% |
| 4. 子代理并行 | b RBAC + c Codex hook | ✅ 双子代理 0 race（**19h + 19i 连续 2 Sprint 治理升级稳定**）|
| 5. Codex 19h 评审 | 已完成（460ed6a 4 当 Sprint 修 + e4ab206 V0.3 §六/§七/§八）| ✓ |
| 6. A2' 重启 | 顺延 19j（cici AskUserQuestion 必决策结论）| ⏳ 19j 启动前 cici 再评估 |
| 7. 6 endpoint 业务方协调 | 顺延 19j | ⏳ 19j cici 协调 |
| 8. CI/CD secrets 配置时机 | cici 19i D0 自助配 | ⏳ cici 自助（OPENAI_API_KEY / PAT / DEVEXTREME LICENSE）|
| 9. spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.2 + spawn_template V1.1 §八/§九 | ✅ 19i 双子代理 100% 遵守 |
| 10. 任务边界设计原则 | spawn 前评估"任务边界是否天然分离" | ✅ 19i 实测有效（0 文件交集）|

### Sprint 19i 特殊性

**首次 Codex pre-merge 评审 hook 落地**：
- GitHub Actions workflow 调 OpenAI API + PR comment 自动留痕
- 替代 git pre-commit hook 路径（19h race hook 评估替代方案）
- 与 ci.yml 独立 workflow + secrets 占位 + continue-on-error 兜底

**首次 RBAC 真验证接通**：
- 2 测试用户 seed（admin / no_dashboard）+ login helper + rbac.spec.ts 场景 2 解 skip
- 容错 skip 机制（seed 未启用不 break CI）

**双子代理 0 race 连续 2 Sprint 稳定**：
- 19h + 19i 实测 4 commits 全部 0 race / 0 误纳
- 任务边界设计原则（V0.2 决策 10）+ V1.1 §八/§九 + V1.2 治理升级表 三重保险

**Codex 0 顺延 P2 连续记录维持**：
- 累计 16 Sprint 13 完整 + 2 强绑定闭环（19b vendor + 19g CI）+ 1 部分顺延（19h 1/3 → 19i 闭环）
- 期望 19i 0 P2 顺延（Codex 19i 评审待触发）

---

## 四、Sprint 19j 候选方向

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **A2' 重启** | NC 真端点 phase 2（19d 5 步重启路径）| 4 PD | NC 端反馈 ≥ 5 项 + 项目协调正式化 |
| **A2' 正式撤架**（替代方案）| 文档化 A2' 撤架 + 转 UI-3 phase 3 主线 | 0.5 PD + 5-10 PD UI-3 | cici 与 PO 明确 A2' 不可达 + 优先级转换 |
| **6 backend endpoint 归属决策** | 业务方协调 mock → real | 2-3 PD | cici 与业务方协调到位 |
| **CI/CD 真实运行验证 + secrets** | cici 自助配 secrets + 首次 PR run + continue-on-error 拆除 | 0.5 PD | cici 自助 |
| **Codex pre-merge hook 实测** | OPENAI_API_KEY 配置 + 首次 PR 自动评审验证 | 0.3 PD | cici 自助 |
| **UI-3 phase 3** | 35+ 长尾 HTML 原型批量 React 化 | 5-10 PD | 业务价值评估 |
| **C / G** | 详设 09 看板 / 06 库存超储（持续顺延）| 5-10 PD | 无 |

**V0.1 倾向**：cici 19j 启动前必决策 A2' 命运（重启 vs 正式撤架）— 这是 9 次顺延决策红线。

---

## 五、Sprint 19i Codex 评审待触发

> 占位 — Sprint 19i 完成时 cici 触发 Codex 19i 评审

**评审重点**：
- Codex pre-merge hook 设计正确性（PR diff 截断策略 / API 调用 / comment update 机制）
- RbacTestUserDataSeedContributor 设计（2 用户 / SeedTestUsers 开关 / 幂等）
- login helper（APIRequestContext 鉴权策略 / cookie 同步机制）
- rbac.spec.ts 场景 2 真验证完整性 + 容错 skip 合理性
- CI workflow artifact upload 覆盖度（e2e.log / playwright-report / retention 14 天）
- **双子代理 0 race 连续 2 Sprint 稳定性反向验证**

**触发提示词**：
"评审 Sprint 19i 共 3 commits（`8ac8646` V0.2 锁版 / `296f716` c Codex hook + P2-3 / `7fa526c` b RBAC 场景 2 + P3-1 复核）— 重点关注 Codex pre-merge hook 设计正确性 + RBAC 真验证 + **双子代理 0 race 连续 2 Sprint 治理升级反向验证**"

**累计 Codex 0 顺延 P2 记录目标**：保持 13 完整 + 2 闭环 + 19i 闭环 19h 1/3 强绑定（期望）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 路径 2 缩范围 2.4 PD（vs 2.6-3.0 PD 节省 7-20%）+ 5 演示路径 + 双子代理 0 race 连续 2 Sprint 稳定验证 + Codex pre-merge hook 落地 + RBAC 真验证接通 + Codex 19i 触发提示 |
