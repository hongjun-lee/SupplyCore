# Sprint 19p 任务卡 V0.3（D1-3 完整闭环 · 收尾锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.3（D1-3 完整闭环锁版 · cici 2026-05-15 /loop continue ×4 — LOGIN-FIX 主轨 + race-governance V0.4 副轨 + 主代理 a playwright config fix + E2E-SMOKE 顺延 19q）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19p 收尾锁版任务卡
**配套：** [`Sprint-19o-Demo-脚本-V0.1.md`](./Sprint-19o-Demo-脚本-V0.1.md) + [`Sprint-19o-任务卡-V0.3.md`](./Sprint-19o-任务卡-V0.3.md) §七 Codex 19o A 级评审 + [`Codex-Review-History-19f-19o-V0.1.md`](./Codex-Review-History-19f-19o-V0.1.md)

---

## 一、Sprint 19p 实际交付（D1-3 完整闭环）

### 1.1 主轨 — LOGIN-FIX（子代理 b）

**commit** `42e5730` · **~0.4 PD**（预算 0.3-0.5 PD ✓）

**双根因修复**：

1. **ABP Account SettingDefinition 未注册**（"该客户端未配置登录方案"）
   - 根因：community 仅引 `Volo.Abp.Account.Application.Contracts`（常量+DTO），未引 `Volo.Abp.Account.Application`（含 `AccountSettingDefinitionProvider` 注册 `Abp.Account.EnableLocalLogin` 默认 "true"）
   - 修复：新增 `src/SupplyCores.Web/SupplyCoresSettingDefinitionProvider.cs`（37 行）本地注册 2 settings，ABP `AutoAddDefinitionProviders` conventional 注册

2. **Nova.Platform CompanyClaimsPrincipalContributor 查 platform.user_organizations 表不存在**（admin 登录后 500）
   - 根因：19o b 引入 Platform 4 实现模块但 SupplyCoresDbContext 未含 Platform migrations → 42P01
   - 修复：`SupplyCoresWebModule.PostConfigureServices` 内 `Configure<AbpClaimsPrincipalFactoryOptions>` 移除 `typeof(CompanyClaimsPrincipalContributor)`

**实测验收**：
- `GET /Account/Login` → HTTP 200 + UserName/Password 表单（4+2 occurrences）
- `POST /Account/Login (admin / 1q2w3E*)` → HTTP 302 + Set-Cookie `.AspNetCore.Identity.Application`
- 登录后 `/supplycores/home` → HTTP 200 + `<title>首页（NC 健康快照）</title>` + `<div id="home-root">` React Island mount

### 1.2 副轨 — race-governance V0.4 + Codex 历史汇总 + AGENTS V1.6（子代理 c）

**commits** `47ab1c3` (SupplyCores) + `4774bdd` (SupplyCore docs) · **~0.7 PD**（预算 0.5-0.8 PD ✓）

- **race-governance V0.4 §八** — 3 故意 line-level 冲突候选方案按强度排序（**方案 D 推荐**：DependsOn 数组同时编辑极高强度 / 方案 E using 段中高 / 方案 F vite.config.ts entries 中）+ 4 KPI + 启动条件
- **Codex-Review-History-19f-19o-V0.1.md**（230 行 / 5 维度）— **10 评审 / P1+P2 当 Sprint 修率 90% / 18a 模式连续 4 Sprint / race 16 commits 0 race / 同事评审 ROI 节省 33% / Codex 0 顺延 23 Sprint 连续达成**
- **AGENTS V1.5 → V1.6** — 治理表 9/10 行 19o c/b 实测数据回填 + 同模块 file-level ✓ / line-level ✗ 反思段

### 1.3 主代理 a — D0 同事评审 fix + V0.2 锁版 + playwright config fix

**commits** `0283da6 + 61df2b8`（D0 P0-1/P0-2）+ `ab269c6`（V0.2 锁版）+ `1281e81`（playwright fix）· **~0.5 PD**

- D0 P0-1：删除 `/supplycores` trailing slash route（AmbiguousMatchException）
- D0 P0-2：简化 Cookie scheme + LoginPath（无 DefaultChallengeScheme — 19o b 后替换为 Full ABP OpenIddict）
- V0.2 锁版 + 子代理任务分配
- **playwright config webServer.url 修旧 bug**：`5175/` 改 `5175/supplycores/@vite/client`（19h Codex P2-1 修 timeout 但 url 未修 / vite multi-page 模式 root 404）

### 1.4 累计统计

| 项 | 数据 |
|---|---|
| 总 PD | ~1.6 PD（V0.2 预算 ~1-1.5 PD / 略超 0.1 PD 因 a 加 playwright fix）|
| commits | 4 个（`42e5730` b / `47ab1c3` c / `4774bdd` SupplyCore c / `1281e81` a fix）|
| 双仓 push | SupplyCores `b8b5d52..1281e81` + SupplyCore `ab269c6..4774bdd`|
| race 结果 | **0 race / 0 误纳**（教训 6/7 [P0] 100% 命中 / 路径完全分离）|
| 4 步自检 | b ✓ / c ✓ / a ✓（HEAD + name-status + stat + status）|

---

## 二、Sprint 19q 候选方向

### 19p 顺延

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **19q-E2E-SMOKE**（主轨候选）| 20 spec 加 loginAs + `SeedTestUsers=true` + DbMigrator 重跑 RbacTestUserDataSeedContributor | 1-1.5 PD | 无（playwright config 已修）|
| **19q-OIDC-DISCOVERY**（旁路）| /.well-known/openid-configuration 400 → 200（issuer + supported scopes 配置）| 0.2-0.3 PD | OAuth2 client_credentials 续场景需要才修 |

### 持续顺延（V0.2 → V0.3 保留）

| 候选 | 工时 | 启动条件 |
|---|---|---|
| 6 endpoint mock → real | 2.5-3 PD | 5 业务方 ≥ 3 反馈 |
| CI/CD 真实运行 + Codex hook 实测 | 0.9 PD | cici 配 secrets |
| UI-3 phase 3 续 5-10 原型 | 2-3 PD | 业务价值评估 |
| race [P0] line-level 实测（方案 D 推荐 / V0.4 §八）| 0.5 PD | cici 19q+ 同意触发 |

### Sprint 19q 4 决策点

1. **E2E-SMOKE 是否 19q 主轨**：1-1.5 PD 大改造 vs 价值（LOGIN-FIX 已 curl 验证）
2. **race [P0] line-level 实测启动**：方案 D（DependsOn 极高强度）→ V0.4 §八.4 启动条件达成
3. **业务方反馈状态**：cici 与 PO 协调机制是否启动（5 月 0 反馈 → 19q 不能再单点推动）
4. **UI-3 续 vs 6 endpoint mock → real 优先级**

---

## 三、累计技术债（参考 17a-19o 累计 · 19p 更新）

详 19o V0.2 §三。**19p 更新**：
- ~~#LOGIN ABP OpenIddict Login UI scheme check~~（19p 已修 ✓）
- #E2E 20 spec 全跑 SMOKE（19p 顺延 19q / 1-1.5 PD）
- #OIDC OIDC discovery 400 → 200（19p 顺延 19q+ / 0.2-0.3 PD）

---

## 四、Sprint 19p 风险（V0.3 最终）

| # | 风险 | 等级 | V0.3 实测 |
|---|---|---|---|
| 1 | Login UI scheme check 修复复杂度超预算 | 🟢 低（19o b 基础设施全就绪）| ✅ 0.4 PD 落预算内 / 双根因发现 |
| 2 | E2E spec 与真实 endpoint 字段不匹配 | 🟡 中（spec 加 fallback）| ⏳ 顺延 19q / playwright config 已修 |
| 3 | 业务方反馈持续延期（19j-19o 6 Sprint）| 🔴 极高 | ⏳ 5 月 0 反馈 — 19q cici 与 PO 协调必修 |

---

## 五、Codex 19p Finding 附录（占位 · 待评审完成补全）

**Codex 19p 触发提示词**：

> 评审 Sprint 19p 共 4 commits（双仓）：
> - SupplyCores：`42e5730` b LOGIN-FIX（ABP Account SettingDefinition + Nova.Platform CompanyClaimsPrincipalContributor 双根因修）+ `47ab1c3` c race V0.4 §八 + AGENTS V1.6 + `1281e81` a playwright webServer.url 旧 bug 修
> - SupplyCore docs：`4774bdd` c Codex-Review-History-19f-19o-V0.1.md（230 行）
>
> **重点关注**：
> 1. LOGIN-FIX 双根因发现 + 修复完整性（admin 实际登录 + React Island mount 验收 ✓）
> 2. ABP community 版未引 Application module 导致 SettingDefinition 未注册的通用模式（续 Sprint 适用 ABP 升级版本检查）
> 3. PostConfigureServices 移除 CompanyClaimsPrincipalContributor 的时机正确性（vs ConfigureServices 时机选择 / `AbpSecurityModule.PostConfigureServices` AutoAdd 钩子）
> 4. race-governance V0.4 §八 3 line-level 方案按强度排序合理性（方案 D DependsOn 极高 vs E using 段中高 vs F vite.config.ts entries 中）
> 5. Codex-Review-History V0.1 5 维度覆盖 + Codex 0 顺延 23 Sprint 连续记录是否准确
> 6. E2E-SMOKE 改造工时评估 1-1.5 PD 是否合理（playwright config 已修 + 20 spec 加 loginAs）
> 7. **18a 模式连续 5 Sprint 期望**（19l → 19m → 19n → 19o → 19p）
> 8. **race [P0] 同模块 file-level 实测连续 17 commits 0 race**（19h-19o 16 + 19p +1 = 17）

---

## 六、Sprint 19p 收尾后续 (cici 行动项)

### 6.1 立即（≤24h）

1. **触发 Codex 19p 评审** — 使用 §五提示词
2. **浏览器实测 admin 登录** — http://127.0.0.1:5100/Account/Login → admin/1q2w3E* → /supplycores/home React 页

### 6.2 短期（Sprint 19q 启动前）

3. **与 PO 协调机制启动**（业务方反馈 5 月 0 → 不能再单点）
4. **Sprint 19q 主轨决策** — E2E-SMOKE 1-1.5 PD vs race line-level 0.5 PD vs UI-3 续

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 主轨 19p-LOGIN-FIX 0.3-0.5 PD + 副轨 19p-E2E-SMOKE 0.3 PD + 持续顺延（业务方 / CI / UI-3 / race line-level）+ §六 Codex 19o 占位 + cici 19p 启动前 4 决策点 |
| V0.2 | 2026-05-15 | 锁版 — cici /loop continue 触发 / 主轨 LOGIN-FIX + 副轨 race-governance V0.4 + Codex 历史汇总 ~1-1.5 PD |
| V0.3 | 2026-05-15 | **D1-3 完整闭环收尾锁版** — §一 实际交付（b LOGIN-FIX 0.4 PD 双根因 / c race V0.4 + Codex 汇总 + AGENTS V1.6 0.7 PD / a D0+config 0.5 PD）+ §二 19q 候选（E2E-SMOKE 顺延 + 4 决策点）+ §四 风险 V0.3 实测 + §五 Codex 19p 提示词 + §六 cici 后续行动项 + 累计 1.6 PD / 4 commits / 0 race ✓ |
