# Sprint 19q 任务卡 V0.1（启动草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 主代理 a 2026-05-15 23:10 /loop continue 预产）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19q 启动草案任务卡
**配套：** [`Sprint-19p-任务卡-V0.3.md`](./Sprint-19p-任务卡-V0.3.md) + [`Sprint-19p-Demo-脚本-V0.1.md`](./Sprint-19p-Demo-脚本-V0.1.md) + [`Codex-Review-History-19f-19o-V0.1.md`](./Codex-Review-History-19f-19o-V0.1.md)

---

## 一、Sprint 19q 候选方向

### 19p 顺延必修

| Task | 范围 | 工时 | 启动条件 | 优先级 |
|---|---|---|---|---|
| **19q-E2E-SMOKE**（主轨候选）| 20 spec 加 loginAs + `SeedTestUsers=true` + DbMigrator 重跑 + 5 核心 spec smoke 验收 | 1-1.5 PD | 无（playwright config 19p 已修）| 🔴 高 |
| **19q-OIDC-DISCOVERY**（旁路）| /.well-known/openid-configuration 400 → 200（issuer + supported scopes 配置）| 0.2-0.3 PD | OAuth2 client_credentials 续场景需 | 🟢 低 |

### 持续顺延（按业务方反馈 / cici 决策触发）

| 候选 | 工时 | 启动条件 | 优先级 |
|---|---|---|---|
| 6 endpoint mock → real | 2.5-3 PD | 5 业务方 ≥ 3 反馈 | 🟡 中（业务方反馈 5 月 0 → 极高战略价值）|
| CI/CD 真实运行 + Codex hook 实测 | 0.9 PD | cici 配 secrets | 🟢 低 |
| UI-3 phase 3 续 5-10 原型 | 2-3 PD | 业务价值评估 | 🟢 低 |
| race [P0] line-level 实测（方案 D / V0.4 §八）| 0.5 PD | cici 19q+ 同意触发 | 🟡 中 |

---

## 二、推荐策略：E2E-SMOKE 主轨 + race line-level 副轨

### 2.1 主轨 19q-E2E-SMOKE（1-1.5 PD）

**目标**：解锁同事评审步 4 — 20 spec 全跑 + LOGIN-FIX 端到端验证

**实施拆分**（子代理 b）：
- D1 D-1：appsettings.json `SupplyCores:SeedTestUsers=true` + DbMigrator 重跑 RbacTestUserDataSeedContributor 创建 admin/no_dashboard 测试用户（0.1 PD）
- D1 D-2：20 spec 加 `loginAsTestUser(page, "admin")` beforeEach 通用模板（0.5-0.7 PD）
- D2 D-3：5 核心 spec smoke 验收（nc-interface / approval-center / inventory / material-master / purchase-orders）+ 全量跑通过率统计（0.3 PD）
- D2 D-4：playwright-report html 截图 + 19q E2E-SMOKE 结果纳入任务卡（0.1 PD）

**预期通过率**：60-80%（部分 spec 期望真实 endpoint / 数据 seed 仍可能 fail — 顺延 19r mock → real）

### 2.2 副轨 19q-RACE-LINE-LEVEL（0.5 PD）

**目标**：race [P0] 降级证据链验证 — line-level 物理冲突实测

**方案 D 实施**（子代理 c）：故意设计 DependsOn 数组同时编辑场景
- 主代理 a 分两个子代理 task：
  - 子代理 b（19q-E2E-SMOKE 任务簇）某 task 改 SupplyCoresWebModule.cs DependsOn 数组 line 44-60 — 加 `typeof(AbpAccountIdentityServerOidcModule)`
  - 子代理 c（19q-RACE 任务簇）某 task 改 SupplyCoresWebModule.cs DependsOn 数组同 line 44-60 — 加 `typeof(AnotherModule)`
- spawn 时**故意不协调** line range — 模拟真实 race
- 教训 6/7 [P0] 防御实测：
  - 精确 add 是否触发？
  - 4 步自检（git log + show + stat + status）是否发现 conflict？
  - 修复成本（resolve conflict + re-commit）

**预期结果**：触发 line-level 冲突（git pull --rebase CONFLICT marker）→ 教训 6/7 [P0] 实测命中 → [P0] 价值证据链达 ≥ 3

### 2.3 三选一 vs 双轨

- 双轨（推荐）：~1.5-2 PD（主 1-1.5 + 副 0.5）
- 三轨（如 cici 加 CI/CD secrets 0.9 PD）：~2.4-2.9 PD
- 单轨保守：~1-1.5 PD

**cici 19q 启动前 4 决策点**：
1. **主轨方向**：E2E-SMOKE（1-1.5 PD）vs OIDC（0.3 PD 旁路）vs UI-3 续（2-3 PD）vs 6 endpoint mock → real（2.5-3 PD 待业务方）
2. **race line-level 实测启动**：方案 D（极高强度）vs 保守不主动制造
3. **业务方反馈状态**：cici 是否已与 PO 协调 / 财务方 10 页是否启动反馈
4. **CI/CD secrets**：cici 是否配（解锁 CI hook 实测）

---

## 三、累计技术债（参考 17a-19p 累计）

详 19p V0.3 §三。**19q 重点**：
- #E2E 20 spec 全跑 SMOKE（19p 顺延 / 1-1.5 PD）
- #OIDC OIDC discovery 400 → 200（19p 顺延 / 0.2-0.3 PD）
- #BIZ 6 endpoint mock → real（5 月 0 反馈 / cici 与 PO 协调机制）
- #CI CI/CD 真实运行 + Codex hook 实测（cici secrets 待配）

---

## 四、Sprint 19q 风险

| # | 风险 | 等级 | 缓解 |
|---|---|---|---|
| 1 | E2E spec 20 改造工时超预算（每 spec 复杂度差异）| 🟡 中 | 通用 beforeEach 模板降 to 0.03-0.05 PD/spec |
| 2 | SeedTestUsers seed 跑失败 / 与 ABP admin seed 冲突 | 🟢 低（19i 设计已考虑）| 失败兜底 console.warn + skip |
| 3 | race line-level 实测意外引发严重 race（rebase 复杂 conflict）| 🟢 低（教训 6/7 [P0] 已就位）| 主代理 a 立即介入 + 教训 8 候选记录 |
| 4 | 业务方反馈持续延期（19j-19p 7 Sprint）| 🔴 极高 | cici 与 PO 协调机制建立（19q 必修 / 5 月 0 反馈红线）|

---

## 五、Codex 19p Finding 附录（占位 · 待 cici 触发评审完成补全）

19q 启动前 cici 触发 Codex 19p 评审（提示词在 [`Sprint-19p-Demo-脚本-V0.1.md`](./Sprint-19p-Demo-脚本-V0.1.md) §五）。

预期：**18a 模式连续 5 Sprint**（19l → 19m → 19n → 19o → 19p）— 维持 Codex 0 顺延 P2 24 Sprint 连续记录。

---

## 六、19q 子代理协作 spawn 预案

参考 memory `feedback_sweet_spot_4_sprint_validation`（sweet spot 主代理 + 2 子代理 = 3.8x）：

| 角色 | 任务簇 | 文件域 | 预估 PD |
|---|---|---|---|
| 主代理 a | D0 V0.1→V0.2 锁版 + 协调 spawn + 收尾 | docs/Sprint/ | 0.3 |
| 子代理 b | E2E-SMOKE（appsettings + 20 spec + smoke 验收）| modules/nova.supplycores/frontend/tests/e2e/* + appsettings.json | 1-1.5 |
| 子代理 c | race line-level 方案 D 实测（与 b 故意 line range 冲突）+ AGENTS V1.7 治理表回填 | src/SupplyCores.Web/SupplyCoresWebModule.cs DependsOn 数组 + AGENTS.md + docs/internal/race-governance | 0.5 |

**spawn 前 30 秒预检**（memory `feedback_subagent_complexity_pre_check`）：
- b：grep appsettings.json `SeedTestUsers` + ls tests/e2e/*.spec.ts 20 + 1 spec sample 看通用 beforeEach 难度
- c：read race-governance V0.4 §八 + 决定方案 D 具体 line range 冲突点

**任务边界**：b 改 frontend + appsettings；c 改 SupplyCoresWebModule.cs DependsOn（line-level 冲突点）+ docs/internal/。**任务边界天然分离 ✗ — 故意 line-level 冲突 ✓**（race 实测目标）

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 23:10 | 草案 — 主代理 a /loop continue 预产；19p 完整闭环后 19q 4 候选方向 + 推荐主轨 E2E-SMOKE 1-1.5 PD + 副轨 race line-level 方案 D 0.5 PD + 4 决策点 + 子代理 spawn 预案 + 6 §子代理 spawn 表 |
