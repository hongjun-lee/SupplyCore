# Sprint 19o 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 选 1 = 场景 2 推荐 — cici 配 secrets + Full ABP OpenIddict 实施 + race [P0] 同模块实测真触发 ~2.5-2.7 PD）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19o 锁版任务卡
**配套**：
- [`Sprint-19a-19n-Retrospective-V0.1.md`](./Sprint-19a-19n-Retrospective-V0.1.md) §五 4 必修红线
- [`Roadmap-19o-19s-V0.1.md`](./Roadmap-19o-19s-V0.1.md) §二 4 轨道 + §三 3 场景
- [`UI-34Pages-Endpoint-Inventory-V0.1.md`](./UI-34Pages-Endpoint-Inventory-V0.1.md) §二.3 业务方分类
- 同事评审 5 步进度（19o D0 commit `0283da6 + 61df2b8 + 79d92f4`）

---

## 一、19o D0 状态摘要（启动前盘点）

### 1.1 同事评审 5 步已完成 3 步

| 步 | 状态 | commit |
|---|---|---|
| 1. 冻结 UI 页面扩展 | ✅ 19o V0.2 默认主线不加 UI 页面 | - |
| 2. P0-1 + P0-2 修 | ✅ 全修 | `0283da6` + `61df2b8` |
| 3. 5100 干净启动 | ✅ 14288 含 fix / curl 验证 302 跳登录 | - |
| 4. E2E smoke | ⏳ **续 Sprint** | 需 Full Identity UI |
| 5. 34 页 mock/真实清单 | ✅ 70% Mock / 财务 10 页 ROI 最高 | `79d92f4` |

### 1.2 累计技术债关键状态

- **❌ Mock 24 页**（70%）— 业务方反馈缺口 / 19j 6 endpoint 骨架 + 19l-19n 14 业务流 + 19m 3 基础资料
- **🔴 财务方 10 页 mock 待反馈** — ROI 最高
- **⏳ Full ABP OpenIddict + Identity UI** — 解锁 cici 实际登录 + 验收
- **⏳ CI/CD secrets 自助配** — 7 Sprint 顺延 / Codex hook 实测 / CI 真实运行

### 1.3 路径决策依赖

| 外部依赖 | 状态 | 影响路径 |
|---|---|---|
| 业务方反馈（5 业务方 ≥ 3 反馈）| ⏳ 待 cici 推动 PO 建立机制 | 决定 Roadmap 轨道 A 启动 |
| CI/CD secrets 自助配 | ⏳ 待 cici 5 分钟自助 | 决定 Roadmap 轨道 B 启动 |
| PO 业务价值评估 | ⏳ 待 cici 与 PO 协调 | 决定 19o 主线（A/B/C/D 优先级）|

---

## 二、19o 候选方向（按 Roadmap 4 轨道 + 3 场景）

### 场景 1：业务方反馈到位（≥ 3 财务方 endpoint spec）

| Task | 范围 | 工时 |
|---|---|---|
| 19o-A1 | 财务方 3 endpoint mock → real（按 19j V0.3 §六.4 L1 0.3-0.5 PD/endpoint）| 1.5 PD |
| 19o-A2 | E2E 集成（5 业务流 spec 接通真 endpoint）| 0.5 PD |
| 19o-B1 | CI/CD secrets 验证（cici 配 secrets 后）| 0.3 PD |
| 19o-C1 | race [P0] 同模块实测（按 race-governance V0.2 §六.2 方案 1）| 0.5 PD |

**预算场景 1**：~3 PD（饱和模式）

### 场景 2：cici 配 secrets 但业务方未反馈（最优等待期间路径）

| Task | 范围 | 工时 |
|---|---|---|
| 19o-B1 | CI/CD 真实运行验证 + Codex hook 实测 | 0.9 PD |
| 19o-Identity | Full ABP OpenIddict + Identity UI 实施（解锁登录 + E2E）| 0.8-1 PD |
| 19o-C1 | race [P0] 同模块实测（按 V0.2 §六.2 方案 1）| 0.5 PD |
| 19o-E2E | E2E smoke 全跑（Identity 实施后）| 0.3 PD |

**预算场景 2**：~2.5-2.7 PD（推荐）

### 场景 3：双未持续（业务方 + secrets 都未）

| Task | 范围 | 工时 |
|---|---|---|
| 19o-Identity | Full ABP OpenIddict + Identity UI 实施 | 0.8-1 PD |
| 19o-C1 | race [P0] 同模块实测 | 0.5 PD |
| 19o-E2E | E2E smoke 全跑（Identity 实施后）| 0.3 PD |
| 19o-DOC | 财务方 3 endpoint mock 数据规范化 + 业务方反馈模板 | 0.3 PD |

**预算场景 3**：~2 PD（缩范围）

---

## 三、Full ABP OpenIddict + Identity UI 实施 plan（场景 2/3 关键任务）

### 3.1 DependsOn 模块（NuGet packages）

```csharp
// SupplyCoresWebModule.cs DependsOn 加：
typeof(AbpAccountWebOpenIddictModule),  // Account UI + OpenIddict server
typeof(AbpAspNetCoreAuthenticationJwtBearerModule),  // Bearer 接收
typeof(AbpAspNetCoreAuthenticationOpenIdConnectModule),  // 如 Web 是 OIDC client
typeof(AbpOpenIddictAspNetCoreModule),  // OpenIddict integration
```

对应 NuGet packages：
- `Volo.Abp.Account.Web.OpenIddict`
- `Volo.Abp.AspNetCore.Authentication.JwtBearer`
- `Volo.Abp.AspNetCore.Authentication.OpenIdConnect`（可选）
- `Volo.Abp.OpenIddict.AspNetCore`

### 3.2 ConfigureServices 配置

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    // 已有 (Cookie 简化方案 — 替换为 OpenIddict)
    context.Services.AddAuthentication()
        .AddJwtBearer(options => {
            options.Authority = configuration["AuthServer:Authority"];
            options.RequireHttpsMetadata = configuration.GetValue<bool>("AuthServer:RequireHttpsMetadata");
            options.Audience = "SupplyCores";
        });

    PreConfigure<OpenIddictBuilder>(builder => {
        builder.AddValidation(options => {
            options.AddAudiences("SupplyCores");
            options.UseLocalServer();
            options.UseAspNetCore();
        });
    });

    // Account 默认登录页路径
    Configure<AbpAccountOptions>(options => {
        options.TenantAdminUserName = "admin";
        options.TenantAdminEmailAddress = "admin@abp.io";
    });
}
```

### 3.3 数据库 migration

- 加 Identity + OpenIddict tables（AbpUsers / AbpRoles / OpenIddictApplications / OpenIddictTokens / etc.）
- `dotnet ef migrations add AddIdentity` + `dotnet ef database update`

### 3.4 Data Seed

- `OpenIddictDataSeedContributor` 注册 SupplyCores client + scopes
- IdentityDataSeedContributor 默认 admin 用户

### 3.5 验收

- 浏览器访问 `/Account/Login` → 真实 ABP Identity UI（用户名/密码输入）
- admin/1q2w3E* 登录后跳 `/supplycores/home` → React Island mount
- E2E spec `loginAsTestUser()` 真实工作

**预估工作量**：0.8-1 PD（含 NuGet 安装 / migration / seed / 验证）

---

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19o 主线方向 | **场景 2 锁版**（cici 选 1 — cici 配 secrets + Full ABP OpenIddict 实施 + race [P0] 同模块实测）~2.5-2.7 PD |
| 2 | Full ABP OpenIddict 实施 | **19o 必修主轨**（解锁登录 + E2E + cici 实际验收）— 0.8-1 PD |
| 3 | 业务方反馈状态评估 | cici D0 与 PO 协调（财务方 10 页 ROI 最高）— 19o 不阻塞主轨 |
| 4 | CI/CD secrets 自助配 | cici 19o D0 自助 5 分钟 |
| 5 | race [P0] 同模块实测 | 旁路（0.5 PD）+ 19o c 子代理执行 |
| 6 | E2E smoke + 全跑 | Identity 实施后 0.3 PD（场景 2/3 必含）|
| 7 | spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.4 + spawn_template V1.1 §八/§九 |
| 8 | 任务边界设计原则 | 19o b/c 同改 SupplyCoresWebModule.cs（Identity 实施 + race 实测）— **同模块场景实测真触发**（race-governance V0.2 §六.2 方案 1）|

---

## 五、Sprint 19o 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | Full ABP OpenIddict migration 失败（数据库 conflict）| 🟡 中 | 实施前 backup + 分步 migration + rollback plan |
| 2 | Identity UI 资源缺失（abp install-libs 未跑）| 🟢 低 | 19f UI-FIX 已加 CheckLibs=false 配置 / dev 期 OK |
| 3 | race [P0] 同模块实测真触发 race（19h-19n 14 commits 0 race 记录断）| 🟢 低 | 主代理 a review + 教训 6/7 [P0] 防护 |
| 4 | 业务方反馈持续延期（19j-19o 6 Sprint）| 🔴 极高 | cici 19o 启动前必决策 — PO 升级 / 撤架 / 替代方案 |
| 5 | cici secrets 配置阻力（7 Sprint 未配信号）| 🟡 中 | 19o D0 主代理 a 提供 step-by-step screenshot 指引 |

---

## 六、Codex 19n Finding 附录（已闭环）

详 19n V0.3 §六 Codex 19n A 级 ★★★★★ APPROVED for merge + 3 P3 顺延 19o：
- P3-1 reconciliation 详设引用欠完整（0.1 PD 顺延 19o 补注）
- P3-2 purchase-receipt 原子事务边界注明（0.1 PD 顺延 19o 补注）
- P3-3 race-governance V0.2 §六.5 19n 行回填（0 PD / 19o 启动后自然填充）

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — **基于 4 文档综合数据驱动**（Retrospective + Roadmap + 接口清单 + 同事评审 P0 修复）+ 3 场景（A 业务方反馈 / B cici secrets / C 双未）+ Full ABP OpenIddict 实施 plan + cici 19o 启动前 5 决策点 + 19n Codex P3 顺延 |
| **V0.2** | **2026-05-15** | **cici 选 1 = 场景 2 锁版** — cici 配 secrets + Full ABP OpenIddict 实施 0.8-1 PD + race [P0] 同模块实测 0.5 PD（19h-19n 14 commits 0 race 后**首次真实同模块场景实测** — b/c 同改 SupplyCoresWebModule.cs）+ E2E smoke 0.3 PD + CI/CD secrets 验证 0.3 PD = **~2.5-2.7 PD**；§四 锁版决策 |
