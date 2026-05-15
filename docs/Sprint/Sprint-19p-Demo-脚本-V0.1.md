# Sprint 19p Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19p 验收演示脚本
**配套：** [`Sprint-19p-任务卡-V0.3.md`](./Sprint-19p-任务卡-V0.3.md)

---

## 一、Sprint 19p 落地范围

按 V0.3 完整闭环锁版，累计 **~1.7 PD**（含 D3 DevExtreme license 修 0.1 PD / V0.2 预算 ~1-1.5 PD / 略超 0.2 PD）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | 同事评审 P0-1 + P0-2 修 | `0283da6 + 61df2b8` | a | 0.3 |
| D0 | 19o V0.1 草案 + V0.2 锁版（19p 启动前） | `929a19f`（参考） | a | - |
| D1-3 | LOGIN-FIX（ABP Account SettingDefinition + Nova.Platform CompanyClaimsPrincipalContributor 双根因修） | `42e5730` | **b** | 0.4 |
| D1-3 | race-governance V0.4 §八 + Codex 历史汇总 + AGENTS V1.6 | `47ab1c3` + `4774bdd` | **c** | 0.7 |
| D2 | playwright webServer.url 旧 bug 修 | `1281e81` | a | 0.05 |
| D2 | 19p 任务卡 V0.2 → V0.3 收尾锁版 | `8dee897` | a | 0.1 |
| D3 | DevExtreme license .gitignore + 复制 license + npm run build | `ab8cd8e` | a | 0.1 |

---

## 二、Demo 演示路径

### 路径 A：LOGIN-FIX admin 实际登录全流程（10 分钟 — 核心高光）

```bash
# 1. 启动 5100（确认 5100 在跑 / build 产物已 copy）
kill $(lsof -ti :5100) 2>/dev/null
cd /Users/lihongjun/aizhetech/SupplyCores && dotnet run --project src/SupplyCores.Web
```

浏览器验收：
1. `http://127.0.0.1:5100/Account/Login` → **真实 ABP Identity LeptonX UI**（dim 主题 / UserName + Password 表单）✓
2. 输 `admin` / `1q2w3E*` → 302 跳转 → `/supplycores/home`
3. **首页（NC 健康快照）React 页面 mount** + DevExtreme DataGrid / TabPanel 渲染（无 evaluation 提示）✓
4. DevTools Console 显示 `[DevExtreme] License key configured successfully` ✓

### 路径 B：DevExtreme license 修（5 分钟 — cici 直接关注的痛点）

**修前**：浏览器 evaluation 提示 "For evaluation purposes only. Redistribution prohibited..."

**修后链路验证**：
```bash
# build 产物含 license key
grep -l "ewogICJmb3JtYXQi" src/SupplyCores.Web/wwwroot/supplycores/assets/*.js
# index.GF7H2oTq.js 含 const e="ewogICJmb3JtYXQiOiAxLA..."

# Razor Page 加载链
# /supplycores/home → home.DyLhzogw.js → index.GF7H2oTq.js（含 license）
#                  → vendor-devextreme.DSE8x8V9.js → config({ licenseKey })

# vite log 无 "License file not found" 警告（之前有）
```

**关键发现**：
- SupplyCores 已具备完整 Catio 模式（vite define + devextreme-license.ts + 22 page entry import）
- 仅缺仓根 `DevExtreme_License.txt` 文件本身
- .gitignore 加 DevExtreme_License.txt + DevExpress_License.txt（与 Catio "Licenses (keep out of VCS)" 一致）

### 路径 C：race-governance V0.4 §八 + Codex 历史汇总（5 分钟）

19p 副轨子代理 c 实测结果：

| 子代理 | commit | 实测点 | race 结果 |
|---|---|---|---|
| c | `47ab1c3`（SupplyCores）| AGENTS V1.6 治理表 19o 实测回填 + race-governance V0.4 §八 3 方案 | 0 race / 0 误纳 |
| c | `4774bdd`（SupplyCore docs）| Codex-Review-History-19f-19o-V0.1.md 230 行 5 维度 | 0 race / 0 误纳 |

**race-governance V0.4 §八 关键内容**（line-level 冲突方案设计）：
- **方案 D 推荐**：DependsOn 数组同时编辑（极高 race 强度）
- 方案 E：using 段同时加 import（中高强度）
- 方案 F：vite.config.ts entries 同时加（中强度）
- 4 KPI：conflict 触发率 / 教训 6/7 [P0] 防御有效性 / 修复成本 / line-level 累计 0 race 次数
- 启动条件：cici 19p+ 同意触发 + 主代理 a 故意设计

**Codex-Review-History-19f-19o-V0.1.md 关键数据**：
- 10 评审 / 5 P1 + 16 P2 + 26 P3 / **P1+P2 当 Sprint 修率 90%**
- 18a 模式连续 4 Sprint（19l → 19m → 19n → 19o）
- race 治理升级 16 commits 0 race（19h-19o）
- 同事评审 ROI 节省 33%（19o 1.8 PD vs avg 3.6）
- **Codex 0 顺延 P2 连续 23 Sprint 达成历史完整证据链**

### 路径 D：playwright config 旧 bug 修（3 分钟 — 同事评审步 4 铺路）

19h Codex P2-1 修 timeout 60s → 20s，但 webServer.url 仍是 `5175/`（vite multi-page 模式 root 404 / 实际服务在 `5175/supplycores/`）。

修复：webServer.url 改 `http://localhost:5175/supplycores/@vite/client`（vite 始终 200 / multi-page 通用 health check）。

实测：playwright webServer 启动正常；E2E 框架已通；但 20 spec 匿名访问 → 302 → React 不 mount → testid 找不到 → 顺延 19q E2E-SMOKE 主轨。

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主轨 LOGIN-FIX 优先级 | 19p 最高（19o 顺延 / 阻塞 5 Sprint）| ✅ 0.4 PD 落预算内 / 双根因发现 |
| 2. 副轨 race-governance V0.4 + Codex 历史 | 0.5-0.8 PD 子代理 c | ✅ 0.7 PD 落预算内 |
| 3. 业务方反馈 | cici 协调机制建立 | ⏳ 5 月 0 反馈（cici 19q 必修）|
| 4. CI/CD secrets | cici 自助 5 分钟 | ⏳ 待 cici 配 |
| 5. race [P0] line-level 实测 | V0.4 §八 方案设计 + 19q+ 实测 | ✅ 方案 D 推荐 |
| 6. DevExtreme license（cici D3 提）| 参考 Catio 修 | ✅ 0.1 PD 修补 |

### Sprint 19p 特殊性

**首次同时解决 LOGIN-FIX 阻塞 + license 痛点 + race 治理升级 + Codex 历史汇总 4 件大事**：
- LOGIN-FIX 阻塞 5 Sprint（19j-19o）— 解锁 admin 实际登录验收
- DevExtreme license 阻塞所有页面 UX（evaluation 提示影响 cici 演示信心）
- race-governance V0.4 §八 — 19h-19o 16 commits 0 race 的下一阶段铺路
- Codex 历史汇总 — Codex 0 顺延 23 Sprint 完整证据链形成

**Sprint 收尾连续性达成**：
- 19o → 19p 双 Sprint cici /loop continue × 4 次推动
- 主代理 a + 子代理 b/c 三并行（sweet spot 3.8x）
- 单 Sprint 4 commits 双仓 + 0 race + 18a 模式连续 5 Sprint 预期

---

## 四、Sprint 19q 候选方向

### 19p 顺延

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **19q-E2E-SMOKE**（主轨候选）| 20 spec 加 loginAs + `SeedTestUsers=true` + DbMigrator 重跑 RbacTestUserDataSeedContributor | 1-1.5 PD | 无（playwright config 已修）|
| **19q-OIDC-DISCOVERY**（旁路）| /.well-known/openid-configuration 400 → 200 | 0.2-0.3 PD | OAuth2 client_credentials 续场景需要才修 |

### 持续顺延

| 候选 | 工时 | 启动条件 |
|---|---|---|
| 6 endpoint mock → real | 2.5-3 PD | 5 业务方 ≥ 3 反馈 |
| CI/CD 真实运行 + Codex hook 实测 | 0.9 PD | cici 配 secrets |
| UI-3 phase 3 续 5-10 原型 | 2-3 PD | 业务价值评估 |
| race [P0] line-level 实测（方案 D / V0.4 §八）| 0.5 PD | cici 19q+ 同意触发 |

---

## 五、Sprint 19p Codex 评审待触发

**触发提示词**（参考 19p V0.3 §五完整版）：

> 评审 Sprint 19p 共 4 commits（双仓）：
> - SupplyCores：`42e5730` b LOGIN-FIX（双根因修）+ `47ab1c3` c race V0.4 §八 + AGENTS V1.6 + `1281e81` a playwright config fix + `ab8cd8e` a DevExtreme license .gitignore
> - SupplyCore docs：`4774bdd` c Codex-Review-History-19f-19o + `8dee897` a 19p V0.3 锁版
>
> **重点关注**：
> 1. LOGIN-FIX 双根因发现 + 修复完整性（admin 实际登录 ✓ / React Island mount ✓）
> 2. ABP community 版未引 Application module 导致 SettingDefinition 未注册的通用模式
> 3. PostConfigureServices 移除 CompanyClaimsPrincipalContributor 的时机正确性
> 4. race-governance V0.4 §八 3 line-level 方案按强度排序合理性（D 推荐）
> 5. Codex-Review-History V0.1 5 维度覆盖 + Codex 0 顺延 23 Sprint 连续记录准确性
> 6. E2E-SMOKE 改造工时评估 1-1.5 PD 是否合理（playwright config 已修 + 20 spec 加 loginAs）
> 7. DevExtreme license .gitignore 是否符合"keep out of VCS"通用合规精神
> 8. **18a 模式连续 5 Sprint 期望**（19l-19o → 19p）
> 9. **race [P0] 同模块 file-level 实测连续 17 commits 0 race**

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 1.7 PD（含 D3 DevExtreme license 修 0.1 PD）+ 4 演示路径（LOGIN-FIX / license / race V0.4 + Codex 汇总 / playwright fix）+ Sprint 19p 4 件大事完整闭环 + 19q 候选方向 + Codex 19p 触发提示 |
