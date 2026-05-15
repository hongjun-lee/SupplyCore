# Sprint 19o Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19o 验收演示脚本
**配套：** [`Sprint-19o-任务卡-V0.2.md`](./Sprint-19o-任务卡-V0.2.md)

---

## 一、Sprint 19o 落地范围

按 V0.2 锁版（cici 选场景 2 — Full ABP OpenIddict + race [P0] 同模块实测），实际交付 **~1.8 PD**（vs V0.2 2.5-2.7 PD **节省 33%**）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | 同事评审 P0-1 + P0-2 修 | `0283da6 + 61df2b8` | a | 0.3 |
| D0 | 19o V0.1 草案 + V0.2 锁版 + 接口清单 | `57ffce1 + 929a19f + 79d92f4` | a | 0.4 |
| **D1-3** | race [P0] 同模块实测启动（race-governance V0.3 §七 + SupplyCoresWebModule.cs 注释 + AGENTS V1.5）| `90e9624` | **c** | 0.5 |
| **D1-3** | Full ABP OpenIddict + Identity UI 实施（8 NuGet + 8 DependsOn + Migration 17K 行 + Data Seed） | `b8b5d52` | **b** | 1.1 |

## 二、Demo 演示路径

### 路径 A：Full ABP OpenIddict + Identity UI（10 分钟 — 核心高光）

```bash
# 启动 5100（含 Identity UI）
kill $(lsof -ti :5100); rm -rf src/SupplyCores.Web/bin
cd /Users/lihongjun/aizhetech/SupplyCores && dotnet run --project src/SupplyCores.Web
```

浏览器验收：
1. `/Account/Login` → **真实 ABP Identity LeptonX UI**（dim 主题）✓
2. `/.well-known/openid-configuration` → OIDC discovery JSON ✓
3. `/supplycores` → 302 → `/Account/Login?ReturnUrl=/supplycores` ✓
4. ⏳ Sprint 19p 顺延：Login UserName/Password 表单（"登录请求无效 — 该客户端未配置登录方案"修复）

### 路径 B：race [P0] 同模块实测（5 分钟）

19o 首次真实同模块场景实测结果：

| 子代理 | commit | 实测点 | race 结果 |
|---|---|---|---|
| c | `90e9624`（先 push）| SupplyCoresWebModule.cs 注释（line 26-40 / namespace 前）| 0 race（路径 a）|
| b | `b8b5d52`（后 push）| SupplyCoresWebModule.cs 类体（usings / DependsOn / Configure*）| 0 race（fast-forward）|

**关键发现**：
- file-level 同改 + line-level 物理错开 → git auto-merge 成功
- 教训 6/7 [P0] 100% 命中（精确 add + 4 步自检 + commit 前 fetch）
- **AGENTS V1.4 治理升级连续 5 Sprint 16 commits 0 race**（19h-19o）
- 边界分离掩盖效应**仍部分存在**（line-level） — [P0] 降级证据链仍未达 ≥ 3

### 路径 C：3 文档综合数据驱动（5 分钟）

19o D0 前置：
- `Sprint-19a-19n-Retrospective-V0.1.md` — 9 Sprint 复盘（4 反模式识别）
- `Roadmap-19o-19s-V0.1.md` — 5 Sprint 路线图（3 场景 + 4 轨道）
- `UI-34Pages-Endpoint-Inventory-V0.1.md` — 34 页接口清单（70% Mock / 财务 10 页 ROI 最高）
- 同事评审 5 步建议（P0-1 + P0-2 修 + 5100 干净启动 + 5 步骤建议）

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 场景 2（cici 配 secrets + Full Identity）| ✅ Full ABP OpenIddict 完成 |
| 2. Full ABP OpenIddict 实施 | 19o 必修主轨 | ✅ Migration + Data Seed + UI 200 |
| 3. 业务方反馈 | cici 协调机制建立 | ⏳ 持续 |
| 4. CI/CD secrets | cici 自助 5 分钟 | ⏳ 待 cici 配 |
| 5. race [P0] 同模块实测 | 旁路 | ✅ 0 race 第 16 次稳定 |

### Sprint 19o 特殊性

**首次同事评审外部视角介入**：
- 同事评审"先把 UI 从'做得多'收成'真能跑、能演示、能验收'"
- 同事 5 步建议（冻结 UI + P0 修 + 干净启动 + E2E + mock 清单）
- cici 选 A 接受 → Full ABP OpenIddict 19o 必修

**首次真实同模块场景实测**：
- 19h-19n 14 commits 0 race 但**都因任务边界天然分离掩盖**
- 19o 首次双子代理 file-level 同改 SupplyCoresWebModule.cs
- 结果：line-level 物理错开 → 仍 0 race
- [P0] 真实价值评估：file-level race 治理有效；line-level 仍是边界分离红利

---

## 四、Sprint 19p 候选方向

### 19o 顺延必修

| Task | 范围 | 工时 |
|---|---|---|
| **19p-LOGIN-FIX** | ABP OpenIddict Login UI scheme check 修（admin 实际登录验收）| 0.3-0.5 PD |
| **19p-E2E-SMOKE** | 5 核心 + 全量 E2E 跑（同事评审步 4）| 0.3 PD |

### 持续顺延

| 候选 | 工时 | 启动条件 |
|---|---|---|
| 6 endpoint mock → real | 2.5-3 PD | 5 业务方 ≥ 3 反馈 |
| CI/CD 真实运行 + Codex hook 实测 | 0.9 PD | cici 配 secrets |
| UI-3 phase 3 续 5-10 原型 | 2-3 PD | 业务价值评估 |
| race [P0] 实测 line-level 触发设计 | 0.5 PD | 19p+ 任务边界设计 |

---

## 五、Sprint 19o Codex 评审待触发

**触发提示词**：
"评审 Sprint 19o 共 6 commits（19o D0：`0283da6` P0-1 + `61df2b8` P0-2 / 19o D0 docs：`79d92f4` 接口清单 + `57ffce1` V0.1 + `929a19f` V0.2 锁版 / 19o D1-3：`90e9624` c race 实测启动 + `b8b5d52` b Full ABP OpenIddict）— 重点关注 Full ABP OpenIddict 完整性 + race [P0] 同模块 file-level 实测结果 + Login UI scheme check 顺延评估"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 1.8 PD（vs 2.5-2.7 PD 节省 33%）+ 3 演示路径 + Full ABP OpenIddict 落地（Identity UI 200 / OIDC discovery）+ race [P0] 同模块首次实测（0 race / file-level vs line-level 反思）+ 19p Login UI scheme check 顺延 + Codex 19o 触发提示 |
