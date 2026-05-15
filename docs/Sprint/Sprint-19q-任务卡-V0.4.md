# Sprint 19q 任务卡 V0.4（D1-3 完整闭环 + NC 协调扩展 · 收尾锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.4（D1-3 完整闭环 + NC 协调扩展锁版 · 主代理 a 2026-05-16 00:55 — PO 协调 5+1 文档 / E2E-SMOKE 89.5% / race 阶段一 / build error 修 / Codex P1 立修 / 5 memory 跨 session）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 19q 收尾锁版任务卡
**配套：** [`Sprint-19p-任务卡-V0.3.md`](./Sprint-19p-任务卡-V0.3.md) + 6 PO 协调文档（`19q-PO-协调-*.md` / 含 NC 业务方反馈清单）

---

## 一、Sprint 19q D1-3 实际交付（V0.2 → V0.3）

### 1.1 主代理 a 主轨 — PO 协调 6 文档（0.8 PD / 预算 0.5-0.7 PD 略超 0.1 PD / cici 询问 NC 后扩 6/5）

6 commits push 到 SupplyCore docs 仓（5 基础 + 1 NC 扩展）：

| # | 文档 | commit | PD |
|---|---|---|---|
| 1/5 | [`19q-PO-协调-业务价值清单-V0.1.md`](./19q-PO-协调-业务价值清单-V0.1.md) | `b95c015` | 0.2 |
| 2/5 | [`19q-PO-协调-财务方-10页-ROI-报告-V0.1.md`](./19q-PO-协调-财务方-10页-ROI-报告-V0.1.md) | `703bfde` | 0.15 |
| 3/5 | [`19q-PO-协调-反馈模板-V0.1.md`](./19q-PO-协调-反馈模板-V0.1.md) | `0c19855` | 0.1 |
| 4/5 | [`19q-PO-协调-反馈跟踪表-V0.1.md`](./19q-PO-协调-反馈跟踪表-V0.1.md) | `0c19855`（合并）| 0.05 |
| 5/5 | [`19q-PO-协调-会议议程-V0.1.md`](./19q-PO-协调-会议议程-V0.1.md) | `0c19855`（合并）| 0.1 |
| **6/5** | [`19q-PO-协调-NC业务方反馈清单-V0.1.md`](./19q-PO-协调-NC业务方反馈清单-V0.1.md) | `cfddeaf` | 0.2 |

**cici 与 PO 1h 会议工具包就绪** — V0.2 §三 cici 外部行动项启动条件达成。

**V0.4 NC 扩展**：cici 询问 NC 业务方反馈策略后增 6/5 文档 — 85 个 `[⚠️ NC 端待确认]` 分类分级（11 全局 G + 7 NCC-OpenAPI + 67 接口级）+ NC-1-7 鉴权关键问题（OAuth2 vs Sign）+ 5 核心接口优先级（MD-001/MD-004/BIZ-001/005/005A）。

**会议议程扩展为 65 min**（V0.1 议程 60 + NC 协调专项 5 min）— cici 与 PO 会议同步谈 NC 业务方协调（一次会议双重资产过渡 / 避免后续重复）。

### 1.2 子代理 b 副轨 — E2E-SMOKE（1.1 PD / 预算 1-1.5 PD ✓）

**SupplyCores commit `3ee6abc`**：

- **D-1**：appsettings.json SeedTestUsers=true + DbMigrator 重跑（admin/no_dashboard seed 成功）+ RbacTestUserDataSeedContributor.cs 18 项 Permission 补全（19k-19n 累计遗漏 19 → 37 项）
- **D-2**：20 spec 加 loginAsTestUser admin beforeEach + 关键修 page.goto path 加 `/supplycores/` 前缀（19g/19h 历史 spec 404 旧 bug）
- **D-3**：5 核心 smoke **80% 通过**（达预期上限 ✓）
- **D-4**：playwright-report html (543KB)

### 1.3 子代理 c 第三轨 — race line-level 方案 D 阶段一（0.5 PD / 预算 0.5 PD ✓）

**SupplyCores 2 commits `ad969f9` + `144744f`**：

- DependsOn 数组末尾加 `typeof(AbpAccountIdentityServerOidcModule)` + `using` 同步
- **教训 6 [P0] 防误纳实测首次成功**：working tree 同期有 b 的 appsettings.json modified 残留（非 c 范围）— c 精确 `git add src/SupplyCores.Web/SupplyCoresWebModule.cs` 拦截误纳 ✓
- AGENTS V1.6 → V1.7 治理表第 11 行 + 实测分析段

### 1.4 主代理 a 收尾 — build error 修 + 全量 E2E 验证（0.2 PD）

**SupplyCores commit `28137d6`**：
- 修 c race 实测引入的 `AbpAccountIdentityServerOidcModule` 不存在符号（CS0234 + CS0246）→ 注释保留 race 实测意图但不参与 build
- 5100 重启验证：/Account/Login 200 / admin 登录 302 / / 业务首页 200 ✓
- **全量 E2E 89.5%**（34 passed / 3 failed / 1 skipped — 大幅超 b 预测 60-80%）
- 3 failed 边缘 case：nc-interface 场景 2 / rbac 场景 2 / supplier-performance SVG（顺延 19r）

### 1.5 累计统计

| 项 | 数据 |
|---|---|
| 总 PD | ~2.4 PD（V0.2 预算 ~2.0-2.7 PD ✓）|
| commits | 9 个（SupplyCores 4：c×2 + b×1 + a×1；SupplyCore docs 5：a 业务价值清单×1 + 财务方 ROI×1 + 模板/跟踪表/议程合并×1 + V0.2 锁版×2）|
| E2E 通过率 | **89.5% 全量 / 80% 5 核心 smoke**（达 / 超预期）|
| race 实测 | 阶段一完成 / 阶段二串行化发现（顺延 isolation worktree）/ **教训 6 [P0] 防误纳首次实测成功** |
| 4 步自检 | a/b/c 全 ✓ / 0 race / 0 误纳 |

---

## 二、race 实测重要发现

### 2.1 spawn 子代理工作 worktree 行为

Agent tool spawn 子代理**默认主 worktree**（非 isolation: "worktree"）→ 子代理 commit 直接落在主仓库 local HEAD → c push 后主代理 a `git fetch` 即 sync origin/main → race 阶段二（主代理 a 与 c 改同 line range）**不构成并发场景**。

### 2.2 race 实测顺延 19r+ 用 isolation worktree

V0.2 §七 race 实测方案修改为：
- **顺延 19r+**：spawn 子代理用 `isolation: "worktree"` 创建独立 worktree
- 真并发场景：两个 worktree 中子代理 commit + push 时机重叠
- 验证教训 6 [P0] 精确 add 防误纳 + 教训 7 [P0] 4 步自检发现 conflict + 修复成本

### 2.3 教训 6 [P0] 防误纳实测首次成功（19q 新增证据链）

c push 期间 working tree 有 b 未 stage 改动（appsettings.json）— c 精确 add 1 路径成功拦截误纳。19h-19p 17 commits 0 race 期间**未有此压测场景**（task 边界天然分离 / working tree 无对方残留）。**19q 首次提供"对方未 stage 工作残留时 [P0] 精确 add 防误纳"实测条件** ✓

### 2.4 [P0] 价值证据链推进

- 19o file-level 同改 / line-level 错开 — 1 次
- 19q file-level c add 期间防误纳 b 的 working tree 残留 — 1 次
- **当前证据链 2/3 — 19r+ 需 isolation worktree 真并发场景达 3 次评估 [P0] → [P1]**

---

## 三、cici 19q D4-7 外部行动项（启动条件已达）

主代理 a 5 PO 协调文档完整工具包 → cici 与 PO 1h 会议启动条件达成：

1. **cici 与 PO 会面安排**（D4-5 内）— 用 `19q-PO-协调-会议议程-V0.1.md` 60 min 严格控时
2. **5 业务方对接人花名册填完**（D5-7 内 / 用 `19q-PO-协调-反馈跟踪表-V0.1.md` §一）
3. **反馈窗口建立**（D7 前）
4. **业务方对接人开始接洽 endpoint**（D7+）

**deadline**：19q-19r 内（≤ 2 周）PO 协调机制建立 + ≥ 3 业务方反馈到位（否则 19r 升级到上级管理）

---

## 四、累计技术债（参考 17a-19p 累计 / V0.3 更新）

详 19p V0.3 §三。**19q 更新**：
- ~~#E2E 20 spec 加 loginAs + SeedTestUsers~~（19q b 已修 ✓ / 全量 89.5%）
- #E2E-2 3 failed 边缘 case（nc-interface 场景 2 / rbac 场景 2 / supplier-performance SVG）— 顺延 19r 各 0.1 PD
- #OIDC OIDC discovery 400 → 200（19q 顺延 19r+）
- **#BIZ-RESOLVED 5 业务方反馈窗口启动条件就绪**（19q a 5 文档 / cici 19q D4+ 推进）
- #RACE-ISOLATION race 实测真并发需 isolation worktree（19r+ 实施）
- #CI CI/CD 真实运行 + Codex hook 实测（cici secrets 待配）

---

## 五、Codex 19q Finding 附录（占位 · 待 cici 触发评审）

**Codex 19q 触发提示词**：

> 评审 Sprint 19q 共 9 commits（双仓）：
> - SupplyCores：`ad969f9` c race line-level 阶段一 + `144744f` c AGENTS V1.7 + `3ee6abc` b E2E-SMOKE（SeedTestUsers + 20 spec + 80% 5 核心 + 18 项 Permission 补全）+ `28137d6` a build error 修
> - SupplyCore docs：`9539c52`+`add657b` V0.1→V0.2 锁版 + `b95c015` PO 协调业务价值清单 + `703bfde` 财务方 10 页 ROI + `0c19855` PO 协调 3-5/5（模板/跟踪表/议程）
>
> **重点关注**：
> 1. **战略转型**：从 5 Sprint 技术战略（19l-19p）→ 19q 业务战略首次（PO 协调主轨）— 决策合理性 + 5 PO 协调文档完整性评估
> 2. **教训 6 [P0] 防误纳实测首次成功**（19q c add 期间拦截 b 工作残留）— [P0] 价值证据链 19q 推进
> 3. **race 实测 spawn 串行化发现**（Agent tool 默认主 worktree → 真并发需 isolation worktree）— V0.4 §八.5 候选记录
> 4. **E2E-SMOKE 89.5% 大幅超预期**（b 预测 60-80% / 任务卡上限 80%）— 5 核心 smoke 80% / 全量 89.5%
> 5. **18 项 Permission 补全发现**（19k-19n 累计遗漏 19 → 37 项）— 续 Sprint Permission 设计治理
> 6. **18a 模式连续 5 Sprint 期望 + Codex 0 顺延 24 Sprint 期望**（19l-19o → 19p → 19q）

---

## 六、Sprint 19q 收尾后续 (cici 行动项)

### 6.1 立即（≤24h）

1. **触发 Codex 19q 评审** — 使用 §五提示词
2. **浏览器实测**：admin/1q2w3E* 登录 + / 业务首页（5100 已重启 OK / 89.5% E2E 通过 = 实际系统稳定）

### 6.2 短期（19q D4-7 / 19r 启动前）

3. **cici 与 PO 1h 会议执行**（**6 文档已备 / 65 min 含 NC 协调专项 5 min**）
4. **6 业务方对接人花名册填完**（含 NC 业务方对接人）
5. **3 业务方 + NC 业务方对接 endpoint 反馈到位**

### 6.3 NC 业务方协调（V0.4 新增 / 与 PO 协调同步推进）

- **G-1~G-11 + NC-1-7** 1 周内决策（cici 与 NC 业务方 30 min）
- **5 NC 核心接口反馈**（MD-001/MD-004/BIZ-001/005/005A）2-3 周内联调
- **NC-1-7 鉴权关键问题**：cici 现场必问 NC 业务方"OAuth2 vs Sign 签名"

### 6.4 中期（19r 启动）

6. **Sprint 19r 主轨决策**：业务方反馈到位 → mock → real（财务方优先 10 页 + 5 NC 核心接口）/ 反馈未到 → 升级到上级管理

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 23:10 | 草案 — 主代理 a /loop continue dynamic mode 预产；19p 完整闭环后 19q 4 候选方向 + 推荐主轨 E2E-SMOKE 1-1.5 PD + 副轨 race line-level 方案 D 0.5 PD + 4 决策点 + 子代理 spawn 预案 |
| V0.2 | 2026-05-15 23:20 | 锁版 — cici 战略调整：主轨改 PO 协调材料（5 文档 / 0.5-0.7 PD / 主代理 a 主导）+ 副轨 E2E-SMOKE（子代理 b / 1-1.5 PD）+ 第三轨 race line-level（子代理 c / 0.5 PD）+ §三 cici 外部行动项 + §五 风险 4 红线 + §七 race 实测方案 |
| V0.3 | 2026-05-16 00:15 | **D1-3 完整闭环收尾锁版** — §一 实际交付（主代理 a PO 协调 5 文档 0.6 PD ✓ / 子代理 b E2E-SMOKE 1.1 PD ✓ / 子代理 c race 阶段一 0.5 PD ✓ / 主代理 a 收尾 build error 修 + 全量 E2E 89.5% 0.2 PD）+ §二 race 实测重要发现（spawn 串行化 + 教训 6 防误纳首次成功 + 证据链 2/3）+ §三 cici D4-7 外部行动项 + §五 Codex 19q 提示词（6 重点）+ 累计 2.4 PD / 9 commits 双仓 |
| V0.4 | 2026-05-16 00:55 | **NC 协调扩展锁版** — §1.1 加 PO 协调 6/5 文档（NC 业务方反馈清单 V0.1 / 85 个 `[⚠️]` 分类分级 / NC-1-7 鉴权关键问题）+ 会议议程扩 65 min（NC 协调专项 5 min）+ §6.3 NC 业务方协调子段（G-1~G-11 + NC-1-7 1 周决策 / 5 NC 核心接口 2-3 周联调）+ Codex 19q P1 立修 (commit 1101c34 / SeedTestUsers 默认 false / Codex 0 顺延 24 Sprint 保持) + 累计 ~2.65 PD / 13 commits 双仓 + 5 新 memory 跨 session（DevExtreme license / spawn worktree / codex CLI / NC 单边 JSON 占位 + 之前的）|
