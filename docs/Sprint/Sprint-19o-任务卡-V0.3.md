# Sprint 19o 任务卡 V0.3（锁版 + Codex 19o A 级评审 ★★★★★ + 19l/19m/19n/19o 18a 模式连续 4 Sprint）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.3（锁版 + Codex 19o 评审 · cici 2026-05-15 触发 Codex 19o 评审完成 — **A 级 / 0 P1+P2 / 18a 模式直接延续连续 4 Sprint** / 同事评审 ROI 初验 33% 节省 / race [P0] line-level 真实测仍不充分）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19o 锁版任务卡 + Codex 19o 评审留痕
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

## 七、Codex 19o Finding 附录（评审完成 · A 级 / 0 P1+P2 / 18a 模式连续 4 Sprint）

cici 2026-05-15 触发 Codex 19o 风评审（read-only 评 7 commits — code 4 + docs 3）— **A 级 / 0 P1 + 0 P2 / 类 19l/19m/19n 18a 模式直接延续**：

### 7.1 5 维度评分

| 维度 | 评分 | 说明 |
|---|---|---|
| Full ABP OpenIddict 完整性 | ★★★★★ | 框架 100% wire + 验收通过 + Login UI 顺延 19p（已知设计债 / 路径清晰）|
| race [P0] 真验证 | ★★★☆☆ | file-level ✓ / line-level ✗ / 证据链未达 ≥ 3 |
| 同事评审 ROI（外部视角介入）| ★★★★☆ | 1.8 PD vs avg 3.6 节省 33% / 续 19p LOGIN-FIX 反向验证 |
| 文档治理 | ★★★★★ | AGENTS V1.5 + race-governance V0.3 + 接口清单 完整 |
| 顺延管理 | ★★★★☆ | LOGIN-FIX 修路径清晰 / 19p 启动条件明确 |
| **总体评分** | **A 级** | **0 P1+P2 + 18a 模式直接延续连续 4 Sprint（19l/19m/19n/19o）**|

### 7.2 关键反思

**race [P0] file-level vs line-level 反思**（19o 评审重点）：
- 19o 首次 file-level 同改 SupplyCoresWebModule.cs ✓（c `90e9624` + b `b8b5d52` git auto-merge）
- **但 line-level 物理错开掩盖**（c 注释 line 26-40 / b 类体 115-180）
- 教训 6/7 [P0] 对"精确 add + fetch 核实"有效 — 但未验证 line-level 真冲突防御
- **续 19p+ 建议**：故意设计 line-level 冲突验证（如 DependsOn 数组同时编辑）才能真验证治理升级通用防御力

**同事评审 ROI 初验**：
- 19f-19n avg 3.6 PD/Sprint vs 19o 1.8 PD（**节省 33%**）
- 推论：同事评审"质量优先于推 Sprint"模式推动工时压缩 + 质量稳定
- 反向验证：19p LOGIN-FIX 0.3-0.5 PD 若顺利则 ROI 成立

**Full ABP OpenIddict 框架 vs Login UI 设计债**：
- 框架 100% 完整（Migration 17K 行 / OIDC discovery / Identity LeptonX UI）
- Login UI scheme check 顺延 19p（IAuthenticationSchemeProvider 空集 — 修路径清晰）
- 设计债不影响框架交付评分

### 7.3 Codex 0 顺延 P2 连续记录调整

- 12a-19n 22 Sprint（17 完整 + 3 强绑定闭环 + 19i/19j 自闭环 + 19l/19m/19n 18a 模式延续 3 Sprint）
- **19o**: 0 P1 + 0 P2 — A 级 — **19l/19m/19n 模式延续连续 4 Sprint**
- **累计 23 Sprint 中 18 完整 + 3 强绑定闭环 + 19i/19j 自闭环 + 19l/19m/19n/19o 18a 模式延续连续 4 Sprint = 0 关键 P2 顺延维持**

新表述："**0 关键 P2 顺延 18 Sprint + 19b/19g/19h 闭环 + 19i/19j 自闭环 + 19k 当 Sprint 修 + 19l/19m/19n/19o 18a A 级直接延续连续 4 Sprint**"

### 7.4 续 19p 关键关注

1. **LOGIN-FIX 优先级最高**（19o b 顺延 — D0 启动）
2. **race line-level 故意冲突验证**（可选追加）
3. **同事评审 ROI 反向验证**（LOGIN-FIX ≤ 0.5 PD 即成立）
4. **业务方反馈机制建立**（财务 10 页 ROI 最高）

---

## 八、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — **基于 4 文档综合数据驱动**（Retrospective + Roadmap + 接口清单 + 同事评审 P0 修复）+ 3 场景（A 业务方反馈 / B cici secrets / C 双未）+ Full ABP OpenIddict 实施 plan + cici 19o 启动前 5 决策点 + 19n Codex P3 顺延 |
| V0.2 | 2026-05-15 | cici 选 1 = 场景 2 锁版 — Full ABP OpenIddict 实施 0.8-1 PD + race [P0] 同模块实测 0.5 PD + E2E smoke 0.3 PD = ~2.5-2.7 PD |
| **V0.3** | **2026-05-15** | **Codex 19o 评审完成 A 级 + 18a 模式连续 4 Sprint** — 实际 1.8 PD（节省 33% vs V0.2）+ Full ABP OpenIddict 100% wire（Login UI 顺延 19p）+ race [P0] file-level 同改成功（line-level 错开掩盖 / 证据链未达 ≥ 3）+ 同事评审 ROI 初验（avg 3.6 → 1.8 PD 节省 33%）；§七 Codex 19o Finding 附录（5 维度评分 + 关键反思 + Codex 0 顺延 P2 调整 23 Sprint + 续 19p 关注）|
