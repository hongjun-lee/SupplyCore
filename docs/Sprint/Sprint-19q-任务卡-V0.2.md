# Sprint 19q 任务卡 V0.2（锁版 · cici 战略调整）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 23:20 战略调整 — 主轨改 PO 协调材料 + 副轨 E2E-SMOKE 并行 + 第三轨 race line-level）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19q 锁版任务卡
**配套：** [`Sprint-19p-任务卡-V0.3.md`](./Sprint-19p-任务卡-V0.3.md) + [`Sprint-19p-Demo-脚本-V0.1.md`](./Sprint-19p-Demo-脚本-V0.1.md) + [`UI-34Pages-Endpoint-Inventory-V0.1.md`](./UI-34Pages-Endpoint-Inventory-V0.1.md) + [`Codex-Review-History-19f-19o-V0.1.md`](./Codex-Review-History-19f-19o-V0.1.md)

---

## 一、Sprint 19q 战略调整（V0.1 → V0.2）

### 1.1 cici 战略反思（2026-05-15 23:18）

cici 问 "UI 现状 vs 真实数据 + 设计考量"，主代理 a 回答 70% Mock + 5 Sprint 累积策略 + 业务方协调失败反模式后，**cici 战略决策**：

> "那 19q 先推动 PO 协调而不是 E2E-SMOKE？"

**核心识别**：业务方协调失败 5 月 0 反馈是**战略红线**（feedback memory `feedback_business_party_coordination_failure`），技术 SMOKE 工作再多也无法解锁 mock → real 业务价值。

### 1.2 主代理 a 关键澄清

**主代理 a 不能直接做 PO 协调**（cici 与 PO 是人际工作 / 主代理 a 是技术助手）。

**主代理 a 能做**：产出 PO 协调材料降低协调摩擦 — 业务价值清单 / 财务方 10 页 ROI 报告 / 反馈模板 / 反馈跟踪表 / PO 会议议程。

**3 轨 sweet spot**：
- 🎯 **主代理 a**：PO 协调材料（5 文档 / 0.5-0.7 PD）
- 🔧 **子代理 b**：E2E-SMOKE（1-1.5 PD / 不阻塞 PO 协调 / 给业务方"能跑"版本）
- 🧪 **子代理 c**：race line-level 方案 D 实测（0.5 PD / race [P0] 降级证据链验证）

### 1.3 与 V0.1 §二的对比

| 项 | V0.1 | V0.2 |
|---|---|---|
| 主轨 | E2E-SMOKE（技术）| **PO 协调材料（业务战略）** |
| 副轨 | race line-level | E2E-SMOKE（子代理 b 独立做）|
| 第三轨 | - | race line-level（子代理 c）|
| cici 关注点 | "能跑" | **"能解锁业务方反馈窗口"** |

---

## 二、Sprint 19q 任务簇详细

### 2.1 主轨 — PO 协调材料（主代理 a / 0.5-0.7 PD）

**目标**：cici 与 PO 见面前材料充分 — 降低协调摩擦 / 提高反馈窗口建立成功率

**5 文档产出**：

| # | 文档 | 范围 | 工时 |
|---|---|---|---|
| 1 | **`19q-PO-协调-业务价值清单-V0.1.md`** | 34 页按业务方分组 + ROI 排序（财务 10 页最高）+ 阻塞业务流影响 + mock → real 工时 L1/L2/L3 | 0.2 PD |
| 2 | **`19q-PO-协调-财务方-10页-ROI-报告-V0.1.md`** | F-01 三单匹配 / F-02 付款 / C-04 资金计划 / T-01-T-05 招标 / 等 10 页深度业务价值分析 + 阻塞月结 / 反结 / 三单匹配证据链 | 0.15 PD |
| 3 | **`19q-PO-协调-反馈模板-V0.1.md`** | 业务方填什么（DTO 字段对齐 / 业务规则 / 异常分支 / 工作流路由）+ 模板示例（采购订单 / 合同状态机 / 库存出入库）| 0.1 PD |
| 4 | **`19q-PO-协调-反馈跟踪表-V0.1.md`** | 业务方 / 对接人 / 反馈状态 / deadline / mock → real 进度跟踪 markdown 表 | 0.05 PD |
| 5 | **`19q-PO-协调-会议议程-V0.1.md`** | 1h 会议议程 — 现状汇报 / 业务方对接人确认 / 反馈窗口建立 / 19q-19s 路线图 / 反馈 deadline | 0.1 PD |

### 2.2 副轨 — E2E-SMOKE（子代理 b / 1-1.5 PD）

**目标**：给业务方"能跑能演示"的版本 — 强化 PO 协调说服力（"19q 已能演示，业务方需求一到就能 swap mock"）

**4 task 拆分**：
- **D-1**：`appsettings.json` SupplyCores:SeedTestUsers=true + DbMigrator 重跑 RbacTestUserDataSeedContributor（创建 admin/no_dashboard 测试用户）— 0.1 PD
- **D-2**：20 spec 加 `loginAsTestUser(page, "admin")` beforeEach 通用模板（每 spec 0.03-0.05 PD）— 0.5-0.7 PD
- **D-3**：5 核心 spec smoke 验收（nc-interface / approval-center / inventory / material-master / purchase-orders）+ 全量跑通过率统计 — 0.3 PD
- **D-4**：playwright-report html 截图 + 19q E2E-SMOKE 结果纳入任务卡 — 0.1 PD

**预期通过率**：60-80%（部分 spec 期望真实 endpoint / 数据 seed 仍可能 fail — 顺延 19r 等业务方反馈到位）

### 2.3 第三轨 — race line-level 方案 D 实测（子代理 c / 0.5 PD）

**目标**：race [P0] 降级证据链验证 — line-level 物理冲突实测（19h-19p 17 commits 0 race 但都是 file-level / line-level 错开掩盖）

**实施细节**（race-governance V0.4 §八.2 方案 D 推荐）：
- 主代理 a 在 spawn b/c 时**故意设计 line range 冲突**：
  - 子代理 c task：改 `SupplyCoresWebModule.cs` L44-60 DependsOn 数组 — 加 `typeof(AbpAccountIdentityServerOidcModule)`
  - 主代理 a task（同时进行）：改**同一**SupplyCoresWebModule.cs L44-60 DependsOn 数组 — 加 `typeof(AnotherTestModule)`
- 教训 6/7 [P0] 防御实测：
  - 精确 add 是否触发？（仍 add SupplyCoresWebModule.cs 但 line 冲突）
  - 4 步自检（git log + show --name-status + show --stat + status）是否发现 conflict？
  - 修复成本（git pull --rebase CONFLICT marker → 手动 resolve → re-commit）

**预期结果**：触发 line-level 冲突 → 教训 6/7 [P0] 实测命中 → [P0] 价值证据链达 ≥ 3 → 19q+ 可评估 [P0] → [P1] 降级

**风险**：rebase 严重冲突阻塞 c 进度 — 主代理 a 立即介入 + 教训 8 候选记录

---

## 三、cici 19q 启动外部行动项

主代理 a **无法代做**的人际工作：

1. **cici 与 PO 会面安排**（19q D1-3 内）— 使用主代理 a 产 §2.1 5 文档
2. **业务方对接人明确**：
   - 财务方 1 人（F-01/F-02/C-04/T-01-T-05 共 10 页）
   - 设备方 1 人（E-03/E-04 5 页）
   - 仓储方 1 人（S-* 7 页）
   - 质保方 1 人（QC 1 页）
   - SQA 方 1 人（DBM/dashboard 6 页）
3. **反馈窗口建立**：每周 / 每月 几次 / 用什么工具（Slack / 飞书 / 邮件）/ 反馈 deadline（如每个 endpoint 1 周内必须回复）
4. **反馈跟踪机制**：cici 与 PO 谁负责催办 / 业务方延期处理流程

**deadline**：19q 启动到 19r 之间（≤ 2 周内 PO 协调机制建立成功 / 至少 3 业务方反馈到位）

---

## 四、累计技术债（参考 17a-19p 累计 / V0.2 更新）

详 19p V0.3 §三。**19q 更新**：
- ~~#LOGIN ABP OpenIddict Login UI~~（19p 已修 ✓）
- #E2E 20 spec 加 loginAs + SeedTestUsers（19q 子代理 b / 1-1.5 PD）
- #OIDC OIDC discovery 400 → 200（19q 顺延 19r+）
- **#BIZ 5 业务方反馈窗口建立（19q 必修战略红线 / 0 PD 技术但极高人际工作量 / cici 主导）**
- #CI CI/CD 真实运行 + Codex hook 实测（cici secrets 待配）

---

## 五、Sprint 19q 风险

| # | 风险 | 等级 | 缓解 |
|---|---|---|---|
| 1 | PO 协调时间长（cici 与 PO 会面安排 / 业务方反馈周期）| 🟡 中 | 主代理 a 5 文档让 cici 与 PO 见面 1 h 内决策 |
| 2 | E2E spec 改造工时超预算 | 🟡 中 | 通用 beforeEach 模板降 to 0.03-0.05 PD/spec |
| 3 | race line-level 实测引发严重 rebase conflict | 🟢 低 | 教训 6/7 [P0] 就位 + 主代理 a 立即介入 |
| 4 | **PO 协调失败 / 业务方对接人未明确 / 反馈窗口未建立** | 🔴 极高 | **19q-19r 内必修红线** — cici 反思机制 / 反模式监测 / 上升到上级管理（如 cici 多次尝试无效）|
| 5 | 业务方反馈到位但 DTO 不匹配 → L3 重构 1.5 PD/页 | 🟡 中 | 19j DTO 反推预留 110+ [⚠️] 标记 / 期望 L1+L2 占 80% |

---

## 六、Codex 19p Finding 附录（占位 · 待 cici 触发评审）

**Codex 19p 触发提示词**（参考 19p Demo §五完整版）— cici 19q 启动前**强烈建议触发**（已积累 6 commits 双仓 + 同事评审 ROI 等多个 finding 增量价值）。

---

## 七、19q 子代理协作 spawn 预案

参考 memory `feedback_sweet_spot_4_sprint_validation`（sweet spot 主代理 + 2 子代理 = 3.8x）+ `feedback_subagent_complexity_pre_check`（spawn 前 30 秒预检）：

| 角色 | 任务簇 | 文件域 | 预估 PD |
|---|---|---|---|
| 主代理 a | PO 协调 5 文档 + D0 V0.1→V0.2 锁版 + 协调 spawn + 收尾 + race line-level 故意 line 冲突 | docs/Sprint/19q-PO-协调-*.md + Sprint-19q-任务卡 + SupplyCoresWebModule.cs L44-60 | 0.6-0.8 |
| 子代理 b | E2E-SMOKE（appsettings + 20 spec + smoke + html report）| modules/nova.supplycores/frontend/tests/e2e/* + appsettings.json | 1-1.5 |
| 子代理 c | race line-level 方案 D 实测（DependsOn 故意 line 冲突）+ AGENTS V1.7 治理表回填 | src/SupplyCores.Web/SupplyCoresWebModule.cs DependsOn L44-60 + AGENTS.md | 0.5 |

**spawn 前 30 秒预检**：
- b：grep appsettings.json `SeedTestUsers` + sample 1 spec 看 beforeEach 模板难度
- c：read race-governance V0.4 §八.2 方案 D + 实际看 SupplyCoresWebModule.cs L44-60 当前 DependsOn 数组

**任务边界**（重要）：
- b 改 frontend tests/e2e + appsettings — **与 c 路径完全分离** ✓
- c 改 SupplyCoresWebModule.cs DependsOn L44-60 — **与 b 路径分离** ✓ 但**故意 line-level 冲突** ✗（race 实测目标）
- 主代理 a：PO 协调文档与 b/c 分离 ✓；但 race 实测主代理 a 同改 SupplyCoresWebModule.cs L44-60 与 c 故意 line-level 冲突 ✗

---

## 八、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 23:10 | 草案 — 主代理 a /loop continue dynamic mode 预产；19p 完整闭环后 19q 4 候选方向 + 推荐主轨 E2E-SMOKE 1-1.5 PD + 副轨 race line-level 方案 D 0.5 PD + 4 决策点 + 子代理 spawn 预案 |
| V0.2 | 2026-05-15 23:20 | **锁版 — cici 战略调整**：主轨改 PO 协调材料（5 文档 / 0.5-0.7 PD / 主代理 a 主导）+ 副轨 E2E-SMOKE（子代理 b 独立做 / 1-1.5 PD）+ 第三轨 race line-level（子代理 c / 0.5 PD）+ §三 cici 外部行动项（5 业务方对接人 + 反馈窗口 + deadline）+ §五 风险 4 红线（业务方协调失败 19q-19r 必修）+ §七 race 实测方案修改（主代理 a 与 c 同改 SupplyCoresWebModule.cs L44-60） |
