# Sprint 19k Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19k 验收演示脚本
**配套：** [`Sprint-19k-任务卡-V0.2.md`](./Sprint-19k-任务卡-V0.2.md)

---

## 一、Sprint 19k 落地范围

按 V0.2 锁版（cici AskUserQuestion 必决策"路径 B 缩范围 + UI-3 phase 3 主轨"），实际交付 **~3.45 PD**（vs V0.2 3.3-4 PD 持平 — 范围内）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（路径 B 缩范围 + UI-3 phase 3 主轨）| `5b2419d` | a | 0.2 |
| **D1-3** | CI/Codex workflow 静态评估（actionlint 0 issues / 1 P2 expression injection 修 + 3 P3 shellcheck）+ secrets-check.yml 162 行 + 19j P3-1 阈值 + path-trigger-thresholds.md V0.1 + codex_review_hook V1.3 §6.5 | `181e43c` | **c** | 0.55 |
| **D1-3** | UI-3 phase 3 5 原型 React 化（purchase-planning + three-way-match + supplier-performance + material-issuance + funding-plan）27 files / +3282/-6 | `bb70f0e` | **b** | 2.3 |

**业务方协调**：未到位 5/5 — 持续顺延 19l（cici 推动 + mock 数据继续支撑 Demo）
**CI/CD secrets**：未配 — 19k 仅静态评估完成（secrets-check.yml 待 cici 配置后验证）

**测试基线**：
- 后端 1760 测试零 regression
- **dotnet build SupplyCores.slnx 0 errors**（27 新文件编译通过）✅
- **vite build 21 entries OK + brotli + 0 Circular** ✅（19j 16 + 19k 5 = 21）
- npm run lint 0 errors / 0 warnings ✅
- npx playwright test --list **15 tests in 7 files**（未破坏 19g-19i E2E）✅
- **actionlint 0 issues**（19k c 修 1 P2 expression injection + 3 P3 shellcheck）

---

## 二、Demo 演示路径

### 路径 A：UI-3 phase 3 5 原型 React 化（10 分钟 — 核心高光）

1. **`/supplycores/purchase-planning`** — 采购计划 P-02/P-03
   - DataGrid + drilldown（list 计划 → 详情明细）
   - 状态机操作（提交 / 审批 / 执行）
2. **`/supplycores/three-way-match`** — 三单匹配 F-01 财务核心
   - DataGrid + 复杂 drilldown（采购单 / 收货单 / 发票单匹配差异）
   - ALR-MATCH-FAIL 预警（红色高亮异常匹配）
3. **`/supplycores/supplier-performance`** — 供应商画像 M-13/SQA
   - Dashboard 类（12 月评分 SVG sparkline + 履约率 + 质量评分）
   - 19j sqa/supplier-evaluation 业务方对接
4. **`/supplycores/material-issuance`** — 领料 S-08/S-09
   - DataGrid + Form（list+form）
   - 多级审批 + **高敏感火工品三级会签**（火工品安全部门 + 设备部门 + 现场操作）
5. **`/supplycores/funding-plan`** — 资金计划 C-04
   - DataGrid + chart（list+chart）
   - 19j fcs/funding-plan-sync 业务方对接

**关键技术沿用**（19f UI-3 phase 2 模板提速）：
- AbortController race fix（19f finding 1 模板沿用）
- DevExtreme DataGrid + Popup + Form 标准模式
- Mock 数据 + `[⚠️ 待 cici 确认 endpoint]` 注释 + 21 [⚠️ 业务方 spec 确认] 标记
- data-testid 最小化侵入（业务零改动）

### 路径 B：CI/Codex workflow 静态评估（5 分钟）

1. **actionlint 1.7.12 静态评估**：
   - commit 前 4 finding：1 P2 expression injection (codex-review.yml L64) + 3 P3 shellcheck (SC2129/SC2016)
   - commit 后 0 issues（3 workflow 全清洁）
2. **secrets-check.yml 162 行**（新建）：
   - 3 secrets 存在性检测（OPENAI_API_KEY / SUPPLYCORES_CATIO_PAT / DEVEXTREME_LICENSE）
   - 不读 value 仅 `if env != ''` 检测防泄露
   - Summary markdown table + `[OK]/[MISSING]/[UNKNOWN]` 状态
   - continue-on-error: true 全程
3. **path-trigger-thresholds.md V0.1**（新建 — 19j Codex P3-1 闭环）：
   - 路径 A/B 触发阈值清单（业务方维度 A1-A3 + CI/CD 维度 B1-B3）
   - 续 Sprint 19l/19m 30s 探查 checklist
   - 阈值演进表（19j 撤架 → 19k 路径 B → 19l 评估）
4. **codex_review_hook.md V1.3 §6.5**（升版）：
   - 静态评估留痕 6 小节（工具链 / 流程 / 19k 实测 4 finding → 0 issues / 修复策略模板 / 静态 vs 真实运行覆盖矩阵 / 19k 总结）

### 路径 C：双子代理 0 race 第 8 次稳定（5 分钟）

**19h+19i+19j+19k 累计 8 commits 全 0 race / 0 误纳**：

| # | Sprint | 子代理 | commit | 教训 6 [P0] | 教训 7 [P0] | race 结果 |
|---|---|---|---|---|---|---|
| 1 | 19h | b | `a07120b` | ✓ 精确 4 路径 | ✓ 4 步自检 | 0 race |
| 2 | 19h | c | `3c8f6a5` | ✓ 精确 9 路径 | ✓ 4 步自检 + 工作树 clean | 0 race / 0 误纳 |
| 3 | 19i | c | `296f716` | ✓ 精确 3 路径 | ✓ 4 步自检 + origin 二次核实 | 0 race / 0 误纳 |
| 4 | 19i | b | `7fa526c` | ✓ 精确 5 路径 | ✓ 4 步自检 + linear history | 0 race / 0 误纳 |
| 5 | 19j | c | `2cbacba` | ✓ 精确 2 路径 | ✓ 4 步自检 + origin 二次核实 | 0 race / 0 误纳 |
| 6 | 19j | b | `8b6738a` | ✓ 精确 24 路径 | ✓ 4 步自检 + 工作树 clean | 0 race / 0 误纳 |
| 7 | 19k | c | `181e43c` | ✓ 精确 4 路径 | ✓ 4 步自检 | 0 race / 0 误纳 |
| 8 | 19k | b | `bb70f0e` | ✓ 精确 27 路径 | ✓ 4 步自检 + commit 前 fetch 发现 c 已 push | 0 race / 0 误纳 |

**任务边界天然分离**：b 改 frontend / Razor / Permission / i18n / 你改 .github/workflows + docs/internal — 8 commits 全 0 文件交集。

**Codex 19j 升级建议落地评估**（19k V0.2 决策 11）：教训 6/7 [P0] 强制约束 19k 继续观察 — 续 Sprint 同模块场景验证条件未达

### 路径 D：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores`
2. `cd modules/nova.supplycores/frontend && npm run build` → 21 entries + brotli + 0 Circular
3. `dotnet build SupplyCores.slnx` → 0 errors
4. `npm run lint` → 0 errors / 0 warnings
5. `npx playwright test --list` → 15 tests in 7 files
6. `actionlint .github/workflows/*.yml` → 0 issues
7. 浏览器 http://localhost:5100/supplycores → 21 menu items（4 大分组 + 1 新分组 GroupOps）

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 路径 B 缩范围 + UI-3 phase 3 主轨 | ✅ 双轨闭环 |
| 2. 累计技术债 | #18 UI-3 phase 3 部分 + #19 CI 静态 + 19j P3 消化 | ✅ 全闭环 |
| 3. 工时预算 | V0.2 3.3-4 PD | **3.45 PD 实际** vs 预算持平范围 |
| 4. 子代理并行 | b UI-3 phase 3 + c CI 静态 + P3 | ✅ 双子代理 0 race（**累计 8 commits 全 0 race**）|
| 5. Codex 19j 评审 | 已完成（36c72c6 P2-2/-3 + fad45d1 V0.3 §九/§十）| ✓ |
| 6. 6 业务方反馈状态 | 未协调 5/5 — 顺延 19l | ⏳ cici 持续推动 |
| 7. CI/CD secrets 自助配 | 未配 — 19k 静态评估 + secrets-check.yml 待 cici 配 | ⏳ cici 自助 |
| 8. UI-3 phase 3 优先级 | cici 默认接受子代理 b 自选 5 业务流核心 | ✅ 子代理选择合理 |
| 9. spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.3 + spawn_template V1.1 §八/§九 | ✅ 19k 双子代理 100% 遵守 |
| 10. 任务边界设计原则 | 19k 实测 0 文件交集 | ✅ 任务边界天然分离 |
| 11. race 治理升级降级评估 | 19k 继续观察期 | ⏳ 续 Sprint 同模块场景验证 |

### Sprint 19k 特殊性

**UI-3 phase 3 5 原型业务流核心选择**：
- 子代理 b 自选（cici memory「默认接受推荐」）— 业务价值 + Demo 价值 + 复杂度均衡
- 5 原型覆盖 5 业务域（采购 P-02/P-03 + 财务 F-01 + SQA M-13 + 库存 S-08/S-09 + 资金 C-04）
- 19j 6 endpoint mock 业务方 spec 待反馈时 — 5 业务流原型提供更丰富的 cici 业务方协调界面

**双子代理 0 race 第 8 次稳定**：
- 19h+19i+19j+19k 累计 8 commits 全 0 race
- Codex 19j 升级建议（[P0] → [P1] 降级）19k 继续观察 — 未达升级触发条件

**Codex 0 顺延 P2 连续记录维持**：
- 累计 18 Sprint 14 完整 + 2 闭环 + 19i/19j 闭环 + 19k 期望保持（待 Codex 19k 评审 19l）

**CI/CD 静态评估补完成**：
- 19k 未配 secrets → 静态评估完成 + secrets-check.yml 待 cici 配
- 19l cici 配 secrets 后真实运行验证（CI 真实 PR run + Codex hook 实测）

---

## 四、Sprint 19l 候选方向

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **6 endpoint mock → real**（19j 顺延）| 业务方反馈到位 mock → real | 2.5-3 PD | 5 业务方反馈 ≥ 3 endpoint spec |
| **CI/CD 真实运行验证 + Codex hook 实测**（19j/19k 顺延）| cici 配 secrets 后首次 PR run + workflow 验证 | 0.8-1 PD | cici 自助配 3 secrets |
| **UI-3 phase 3 续 5-10 原型**（19f 起持续）| 35+ 长尾继续 React 化 | 2-3 PD | 业务价值评估 |
| **E2E 场景扩展 + 21 entries 集成** | 21 entries E2E 全覆盖（19j 6 endpoint 接通 + 19k 5 业务流）| 1-2 PD | 19j 6 endpoint mock → real 部分到位 |
| **C / G** | 详设 09 看板 / 06 库存超储（持续顺延）| 5-10 PD | 无 |

**V0.1 倾向**：路径 A（业务方 ≥ 3 反馈到位）= 6 endpoint mock → real 主轨 + CI 真实运行验证副轨 = 3.5-4 PD；或路径 B（业务方未协调）= CI 真实运行验证主轨 + UI-3 phase 3 续 5 原型副轨 = 2.8-4 PD

---

## 五、Sprint 19k Codex 评审待触发

> 占位 — Sprint 19k 完成时 cici 触发 Codex 19k 评审

**评审重点**：
- UI-3 phase 3 5 原型 React 化设计正确性（业务流选择 + DevExtreme 模式 + AbortController race fix）
- ABP 整合完整性（5 Permission + Provider + MenuContributor + i18n × 2 × 10）
- CI/Codex workflow 静态评估完整性（actionlint 0 issues + secrets-check.yml 设计 + path-trigger-thresholds 阈值合理性）
- codex_review_hook.md V1.3 §6.5 静态评估留痕
- **双子代理 0 race 第 8 次稳定反向验证 + 升级建议降级评估**

**触发提示词**：
"评审 Sprint 19k 共 3 commits（`5b2419d` V0.2 锁版 / `181e43c` c CI 静态 + secrets-check + 19j P3 / `bb70f0e` b UI-3 phase 3 5 原型）— 重点关注 UI-3 phase 3 业务流原型选择合理性 + CI 静态评估完整性 + **双子代理 0 race 第 8 次稳定反向验证 + race 治理 [P0] 降级 [P1] 评估**"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — 路径 B 缩范围 + UI-3 phase 3 5 原型 3.45 PD（vs V0.2 3.3-4 PD 持平范围）+ 4 演示路径 + 双子代理 0 race 第 8 次稳定 + Codex 19k 触发提示 |
