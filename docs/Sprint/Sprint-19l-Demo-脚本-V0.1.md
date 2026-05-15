# Sprint 19l Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19l 验收演示脚本
**配套：** [`Sprint-19l-任务卡-V0.2.md`](./Sprint-19l-任务卡-V0.2.md)

---

## 一、Sprint 19l 落地范围

按 V0.2 锁版（cici AskUserQuestion 必决策"路径 C 双未 + UI-3 续"），实际交付 **~4.1 PD**（vs V0.2 3.3-4.3 PD 顶部范围）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（路径 C 双未 + UI-3 续）| `b1eb2a7` | a | 0.2 |
| **D1-3** | E2E 扩展 19k 5 业务流 spec（10 新 tests）+ race 治理 [P0]→[P1] 降级评估 + AGENTS.md V1.4 治理表 + 19k Codex P3-1/-2/-3 消化 | `98a6fd9` | **c** | 1.2 |
| **D1-3** | UI-3 phase 3 续 5 原型 React 化（tender + goods-receipt + payment-request + stocktake + alert-rules）27 files / +2773/-6 | `d911347` | **b** | 2.3 |

**业务方协调**：未到位 5/5 — 持续顺延 19m+（cici 推动 + mock 数据继续支撑 Demo）
**CI/CD secrets**：未配 — 持续顺延 19m+

**测试基线**：
- 后端 1760 测试零 regression
- **dotnet build SupplyCores.slnx 0 errors** ✅
- **vite build 26 entries OK + brotli + 0 Circular** ✅（19j 16 + 19k 5 + 19l 5 = 26）
- npm run lint 0 errors / 0 warnings ✅
- **npx playwright test --list → 25 tests in 12 files**（19g 4 + 19h 11 + 19l 10 新）✅

---

## 二、Demo 演示路径

### 路径 A：UI-3 phase 3 续 5 原型 React 化（10 分钟 — 核心高光）

5 业务流原型覆盖（与 19k 5 业务流复杂度形态错开）：

1. **`/supplycores/tender`** — 招标管理 T-01~T-05
   - 5 单 + 详情 8 步流程 timeline + 5 投标方排名 + 4 文档
   - 招采流转 + 集团平台对接
2. **`/supplycores/goods-receipt`** — 到货验收 S-02/S-03
   - 5 单（待验收 / 部分验收 / 退回）+ 详情 3 行验收明细
   - 与 PO / 质检 / 三单匹配连贯
3. **`/supplycores/payment-request`** — 付款申请 F-02
   - 5 申请单 + 三单匹配 3 卡 + 6 步审批 Timeline
   - form-heavy + 三单匹配 + Timeline 复杂度
4. **`/supplycores/stocktake`** — 桌面盘点 S-06/S-07
   - 4 盘点单 + 详情 4 差异行（盘亏 / 盘盈 / 高敏感复核）
   - 配套 19f mobile-stocktake
5. **`/supplycores/alert-rules`** — 预警规则中心 R-05
   - 13 规则 + 分类 filter + 详情 4 历史触发
   - Dashboard + 分类 filter Demo 高光

**关键技术沿用**（19k UI-3 phase 3 模板提速）：
- AbortController race fix + DevExtreme + Mock 数据 + [⚠️ 待 cici 确认 endpoint]
- data-testid 最小化侵入
- i18n 双语 zh-Hans 全角 / en 半角（19k Codex P2-2 规范）

### 路径 B：E2E 扩展 19k 5 业务流（5 分钟）

5 spec 接通 19k 5 业务流（purchase-planning / three-way-match / supplier-performance / material-issuance / funding-plan）：
- 每 spec 2 cases（list + 详情 / form / chart）= 10 新 tests
- 容错 skip 机制（mock 数据无 row 时不破坏 CI）

`npx playwright test --list` → **25 tests in 12 files**（19g 4 + 19h 11 + 19l 10）

### 路径 C：双子代理 0 race 第 10 次稳定（5 分钟 — 治理升级里程碑）

**19h+19i+19j+19k+19l 累计 10 commits 全 0 race / 0 误纳** — 治理升级稳定**第 10 次**：

| # | Sprint | 子代理 | commit | race | 任务边界 |
|---|---|---|---|---|---|
| 1-2 | 19h | b/c | a07120b/3c8f6a5 | 0 race | 天然分离 |
| 3-4 | 19i | b/c | 7fa526c/296f716 | 0 race / 0 误纳 | 天然分离 |
| 5-6 | 19j | b/c | 8b6738a/2cbacba | 0 race / 0 误纳 | 天然分离 |
| 7-8 | 19k | b/c | bb70f0e/181e43c | 0 race / 0 误纳 | 天然分离 |
| **9-10** | **19l** | **b/c** | **d911347/98a6fd9** | **0 race / 0 误纳** | **天然分离** |

**race 治理 [P0] → [P1] 降级评估**（c 19l 任务 3 落地）：
- `docs/internal/race-governance-downgrade-evaluation.md` V0.1（6 节）
- 19l 评估结论：**保留 [P0]** — 同模块场景验证条件未达（10 commits 0 race 主因是任务边界天然分离）
- 触发条件：≥ 2 Sprint 同模块 0 race 实测后再评估降级

### 路径 D：AGENTS.md V1.4 + 19k Codex P3 全消化（5 分钟）

- **AGENTS.md V1.4**：治理表 8 行（19h-19l）+ 19k 反向验证段 + [P0] → [P1] 降级触发条件
- **path-trigger-thresholds.md V0.2**（19k P3-1）：§5 实测命令补正（Domain→Application 路径 + gh repo 修正）
- **secrets-check.yml**（19k P3-2）：exit code 语义化 + actionlint 0 issues
- **codex_review_hook.md V1.4 §6.5.7**（19k P3-3）：actionlint 工具链版本 + 文件统计 + 修复耗时

### 路径 E：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores`
2. `cd modules/nova.supplycores/frontend && npm run build` → **26 entries** + brotli + 0 Circular
3. `dotnet build SupplyCores.slnx` → 0 errors
4. `npm run lint` → 0 errors / 0 warnings
5. `npx playwright test --list` → **25 tests in 12 files**
6. `actionlint .github/workflows/*.yml` → 0 issues
7. 浏览器 → 26 React 页面 + 5 大分组菜单

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 路径 C 双未 + UI-3 续 | ✅ 双轨闭环（5 业务流 + 10 E2E + race 降级 + AGENTS V1.4）|
| 2. 累计技术债 | #18 UI-3 续主轨 + #25 E2E + #28 race 降级 | ✅ 全闭环 |
| 3. 工时预算 | V0.2 3.3-4.3 PD | **4.1 PD 实际** vs 预算顶部范围 |
| 4. 子代理并行 | b UI-3 续 + c E2E + race + AGENTS V1.4 | ✅ 双子代理 0 race（**累计 10 commits 0 race**）|
| 5. Codex 19k 评审 | 已完成（d1d47ea P2-2 + f7a2344 V0.3）| ✓ |
| 6. 6 业务方反馈状态 | 未协调 5/5 — 顺延 19m+ | ⏳ cici 持续推动 |
| 7. CI/CD secrets 自助配 | 未配 — 顺延 19m+ | ⏳ cici 自助 |
| 8. race 治理降级评估 | **保留 [P0]**（10 commits 因边界分离） | ✅ race-governance-downgrade-evaluation.md V0.1 |
| 9. spawn 子代理 prompt 引用 | 必含 AGENTS V1.3 + spawn_template V1.1 | ✅ 19l 双子代理 100% 遵守 |
| 10. 任务边界设计原则 | spawn 前评估 | ✅ 19l 0 文件交集 |
| 11. **基础资料 UI 补完**（cici 在 b 跑期间问）| **方案 B**：19l b 不动 + 19m 单独主轨 base-archive + master-data-admin + tender-archive | ⏳ 19m V0.1 |

### Sprint 19l 特殊性

**UI-3 phase 3 续 5 业务流核心**：
- tender 招标 + goods-receipt 验收 + payment-request 付款 + stocktake 盘点 + alert-rules 预警
- 与 19k 5 业务流（采购计划 / 三单匹配 / 供应商画像 / 领料 / 资金）形态错开

**双子代理 0 race 第 10 次稳定**（19h-19l 5 Sprint）：
- 治理升级 [P0] 保留观察期延长（同模块场景验证未达）

**Codex 0 顺延 P2 连续记录维持**：
- 19 Sprint 14 完整 + 3 强绑定闭环 + 19l 期望保持（待 Codex 19l 评审）

**基础资料 UI 缺口**（cici 19l 期间发现）：
- 已 React 化 26 entries 中含部分基础资料（material-master / contract / equipment-* 3 / supplier-performance / xinchuang-matrix / tender 7 个）
- 缺：base-archive（组织/仓库/货位）+ master-data-admin（物料分类/编码/BOM）+ tender-archive（招标静态档案库）
- **方案 B**：19m 单独主轨"基础资料补完"3 原型 ~1.5 PD

---

## 四、Sprint 19m 候选方向

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **基础资料补完 3 原型**（cici 方案 B）| base-archive + master-data-admin + tender-archive | 1.5 PD | 主轨默认（cici 已决策）|
| **6 endpoint mock → real**（19j 顺延）| 业务方反馈到位 mock → real | 2.5-3 PD | 5 业务方反馈 ≥ 3 |
| **CI/CD 真实运行验证 + Codex hook 实测**（19h-19l 持续顺延）| cici 配 secrets 后首次 PR run | 0.9 PD | cici 自助配 3 secrets |
| **UI-3 phase 3 续 5-10 原型**（19l 顺延）| 31-5=26 候选继续 | 2-3 PD（5 个）| 业务价值评估 |
| **E2E 场景扩展 + 26 entries 集成**（19l E2E 续）| 19l 5 业务流 spec → 19l b 5 新原型 + 19j 6 endpoint mock-real | 1-1.5 PD | 19l 5 业务流 spec 完整 |
| **C / G** | 详设 09 看板 / 06 库存超储（持续顺延）| 5-10 PD | 无 |

**V0.1 倾向**：cici **方案 B 主轨基础资料补完** 1.5 PD + 副轨 19l b 5 新原型 E2E 扩展 1 PD + 旁路 19l Codex P3 顺延消化 0.5 PD = **3 PD**（缩范围方便 cici 后续协调时间）

---

## 五、Sprint 19l Codex 评审待触发

> 占位 — Sprint 19l 完成时 cici 触发 Codex 19l 评审

**评审重点**：
- UI-3 phase 3 续 5 业务流原型设计正确性 + 复杂度形态错开评估
- E2E 扩展 19k 5 业务流 spec 完整性 + 容错 skip 机制
- race 治理 [P0] → [P1] 降级评估文档（race-governance-downgrade-evaluation.md V0.1）合理性
- AGENTS.md V1.4 治理表 8 行 + 反向验证段
- **双子代理 0 race 第 10 次稳定反向验证 + 治理升级里程碑**
- 19k Codex P3-1/-2/-3 消化完整性

**触发提示词**：
"评审 Sprint 19l 共 3 commits（`b1eb2a7` V0.2 锁版 / `98a6fd9` c E2E + race 降级 + AGENTS V1.4 / `d911347` b UI-3 续 5 原型）— 重点关注 UI-3 续 5 业务流选择合理性 + E2E 扩展完整性 + **双子代理 0 race 第 10 次稳定反向验证 + race 治理 [P0] 保留评估 + 基础资料 UI 缺口（方案 B 19m 补完）**"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 路径 C 双未 + UI-3 续 5 业务流 + E2E 扩展 19k + race 治理降级 + AGENTS V1.4 + 19k P3 全消化 4.1 PD（vs V0.2 3.3-4.3 PD 顶部）+ 5 演示路径 + 双子代理 0 race 第 10 次稳定（19h-19l 5 Sprint）+ Codex 19l 触发提示 + cici 基础资料 UI 缺口方案 B 决策（19m 补完）|
