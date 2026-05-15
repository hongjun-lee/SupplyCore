# Sprint 19m 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 方案 B 决策直接接受 — 主轨基础资料补完 3 原型 + 副轨 E2E 扩展 + 旁路 19l Codex P3 消化 ~3 PD）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19m 锁版任务卡
**配套：** [`Sprint-19l-任务卡-V0.3.md`](./Sprint-19l-任务卡-V0.3.md) §六 Codex 19l A 级评审 + [`Sprint-19l-Demo-脚本-V0.1.md`](./Sprint-19l-Demo-脚本-V0.1.md)

---

## 一、Sprint 19m 主线方向（cici 方案 B 已决策）

### 主轨基础资料补完 3 原型（cici 2026-05-15 方案 B）

cici 19l 期间发现"基础资料 UI 缺口"询问 → AskUserQuestion 选**方案 B**：19l b 不动 + 19m 单独主轨补完。

| Task | 原型 | 业务范围 | 工时 | 详设 |
|---|---|---|---|---|
| 19m-BASE-1 | **base-archive** | 基础档案（组织 / 仓库 / 货位 / 集团子公司）| 0.6 PD | 详设 02 基础档案与组织仓库 |
| 19m-BASE-2 | **master-data-admin** | 主数据管理（物料分类 / 编码 / BOM）| 0.6 PD | 详设 03 物料主数据与编码 |
| 19m-BASE-3 | **tender-archive** | 招标基础档案库（招标静态档案 — 与 19l tender 业务流配套）| 0.3 PD | 详设 04 需求计划与采购协同 |

**预算基础资料补完**：1.5 PD

### 副轨 E2E 扩展 19l b 5 新原型（19l 顺延）

19l b 落 5 新业务流（tender / goods-receipt / payment-request / stocktake / alert-rules）— 19l c 未做对应 spec：

| Task | 范围 | 工时 |
|---|---|---|
| 19m-E2E-EXT | 5 spec 接通 19l b 5 业务流 + 19m 基础资料 3 原型 spec | 1-1.5 PD |

**预算 E2E 扩展**：1-1.5 PD

### 旁路 19l Codex P3 顺延消化（待评审完成）

> 占位 — Codex 19l 评审完成后从顺延清单挑选

**预估 ~0.3-0.5 PD**

### 候选 6 endpoint mock → real（持续顺延 19j）

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19m-6EP-REAL | 业务方反馈到位 mock → real | 2.5-3 PD | 5 业务方 ≥ 3 反馈 |

### 候选 CI/CD secrets 真实运行（持续顺延 19h-19l）

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19m-CI-REAL | cici 配 secrets + 首次 PR run | 0.9 PD | cici 自助配 |

---

## 二、推荐策略：cici 方案 B 基础资料补完主轨

**V0.1 倾向**：
- 主轨基础资料补完 1.5 PD
- 副轨 E2E 扩展 19l b 5 新原型 1 PD
- 旁路 19l Codex P3 顺延消化 0.5 PD
- 总 **~3 PD**（缩范围 — 方便 cici 业务方协调时间）

**cici 19m 启动前 3 决策点**：
1. 6 业务方反馈状态（cici 仍推动中？反馈到位 ≥ 3 → 路径 A 主轨切 6 endpoint mock → real）
2. CI/CD secrets 自助配状态（已配 → 路径 B 副轨切 CI 真实运行）
3. UI-3 phase 3 续 5-10 原型优先级（业务价值 cici 评估）

---

## 三、累计技术债（Sprint 19m 必修，决策点 2）

### 3.1 Sprint 17a-19l 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | 17a-19i | 4 PD | **19j 正式撤架** ✅ |
| 2 | 详情页 / 编辑表单 endpoint 占位 | 19c | 0.3 PD | 19m+ 一并 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 撤架保留 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19m+ 评估 |
| 5-10 | ~~UI-2-5 E2E / vendor brotli / UI-STYLE / minSignCount / Razor Permission / abp install-libs~~ | 19c-19f | 多项 | **全已落地** ✅ |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | **19j 骨架 + 19m+ mock → real** |
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |
| 14 | 6 backend endpoint [⚠️] 占位归属决策 | 19f | 2-3 PD | **19j 骨架已落地** ✅（mock → real 19m+ 路径 A）|
| 15-17 | ~~commit history 治理债 / 双 race 治理债升级 / E2E 场景 + RBAC + CI/CD~~ | 19f-19g | 多项 | **全已落地** ✅ |
| 18 | UI-3 phase 3 35+ 长尾原型 | 19f 起 | 5-10 PD | **19k 5 + 19l 5 = 10 已落地**（19m+ 续 candidates）|
| 19 | CI/CD 真实运行验证 + secrets 配置 | 19h | 0.5 PD | **19m+ 副轨**（cici 自助配 secrets）|
| 20-23 | ~~RBAC 场景 2 / Codex pre-merge hook / hook 实测占位 / AGENTS V1.2 序号列~~ | 19h-19i | 多项 | **全已落地** ✅ |
| 24 | 6 endpoint mock → real（业务方 spec 接通）| 19j | 2.5-3 PD | **19m+ 路径 A 主轨**（业务方反馈到位）|
| 25 | E2E 6 endpoint 集成（mock-real E2E）| 19j | 1-1.5 PD | **19m+ 路径 A 旁路** |
| 26 | ~~CI/Codex workflow 静态评估 + secrets-check.yml~~ | 19k | 0.55 PD | **19k 已落地** ✅ |
| 27 | ~~path-trigger-thresholds.md cherry-pick~~ | 19k | 0 PD | **19l V0.2 §四 决策 8 已 cherry-pick** ✅ |
| 28 | ~~race 治理升级 [P0] → [P1] 降级评估~~ | 19j+19k | 0.3 PD | **19l 已落地 race-governance-downgrade-evaluation.md V0.1**（[P0] 保留）✅ |
| **29** | **基础资料补完 3 原型**（base-archive + master-data-admin + tender-archive）| **19l cici 决策** | **1.5 PD** | **19m 主轨**（cici 方案 B）|
| **30** | **E2E 扩展 19l b 5 新原型 + 19m 3 原型 spec** | **19l** | **1-1.5 PD** | **19m 副轨** |

### 3.2 Codex 19l 顺延（待评审后补 §六附录）

> 占位 — Codex 19l 评审完成后从顺延清单挑选补到本节。

**预估 ~0.3-0.5 PD**

---

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19m 主线方向 | **方案 B 主轨基础资料补完 3 原型**（cici 2026-05-15 已决策）— 主轨 1.5 PD + 副轨 E2E 扩展 1-1.5 PD + 旁路 19l Codex P3 消化 0.3 PD = **~3 PD** |
| 2 | 30 累计技术债 | **#29 基础资料主轨 + #30 E2E 副轨 + 19l P3-1/-2 旁路** |
| 3 | 工时预算 | **基础资料 1.5 + E2E 8 spec 1-1.5 + 19l P3 0.3 + 缓冲 = 3-3.5 PD**（缩范围方便 cici 业务方协调时间）|
| 4 | 子代理并行策略 | **主代理 a 协调 + V0.2 锁版 + 19l P3-1 i18n 完整性扫描 + 子代理 b 基础资料 3 原型（base-archive + master-data-admin + tender-archive）+ 子代理 c E2E 扩展 19l b 5 + 19m b 3 = 8 spec + 19l P3-2 path-trigger V0.2 §5 实测填充** sweet spot 2x |
| 5 | Codex 19l 评审 | **已完成**（commit `c244193` V0.3 §六 A 级 0 P1+P2 + 18a 模式直接延续）|
| 6 | 6 业务方反馈状态 | **未反馈 5/5** — 持续顺延 19n（cici 推动 + mock 数据继续支撑 Demo）|
| 7 | CI/CD secrets 自助配 | **未配** — 持续顺延 19n；19m 不依赖 secrets 路径 |
| 8 | 基础资料 3 原型业务范围 | **base-archive**（组织/仓库/货位/集团子公司 — 详设 02）+ **master-data-admin**（物料分类/编码/BOM — 详设 03）+ **tender-archive**（招标静态档案 — 详设 04 / 19l tender 业务流配套）|
| 9 | spawn 子代理 prompt 引用约束 | **必含** AGENTS.md V1.4 + spawn_template V1.1 §八/§九（19h-19l 10 commits 0 race 稳定）|
| 10 | 任务边界设计原则 | spawn 前评估任务边界天然分离（b src/pages 3 新基础资料 / c tests/e2e 8 spec + docs/internal — 0 文件交集）|
| 11 | race 治理 [P0] 保留 + 同模块场景验证 | **保留 [P0] 续观察 19n+**（19m 仍边界分离 — 触发条件未达 / race-governance V0.1 §四 触发条件文档化）|

---

## 五、Sprint 19m 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 基础资料 3 原型业务复杂度低于预估 | 🟢 低 | 19k/19l 模板提速；如实际 0.5-1 PD 完成 → 余量做 19l b 5 spec 联动 |
| 2 | 6 业务方反馈持续延期（≥ 3 Sprint 19j-19m）| 🟡 中 | mock 数据继续支撑 Demo；19m+ 评估 cici 直接代业务方决策（PO 介入）|
| 3 | UI-3 phase 3 续候选过多（剩 21 个 prototype/）| 🟡 中 | 19m+ 主代理 a 与 cici 协商优先级 + PO 业务价值评估 |
| 4 | race 治理升级 [P0] 保留延后到 19n+ 同模块场景实测 | 🟢 低 | 19m+ 同模块场景识别 + race-governance-downgrade-evaluation V0.1 触发条件已文档化 |

---

## 六、Codex 19l Finding 附录（占位 · 待评审完成补全）

> 占位 — Codex 19l 评审完成后从顺延清单挑选补到本节。

**评审重点候选**（详 19l Demo §五）：
- UI-3 phase 3 续 5 业务流选择合理性
- E2E 扩展 19k 5 业务流 + race 治理 [P0] 保留评估
- AGENTS.md V1.4 + race-governance V0.1 + path-trigger V0.2 + codex_review_hook V1.4 治理升级
- **双子代理 0 race 第 10 次稳定 + 基础资料 UI 缺口决策（方案 B 19m）**

**触发提示词**：详 19l Demo §五

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — **cici 方案 B 主轨基础资料补完 3 原型** + 副轨 E2E 扩展 19l b 5 + 19m 3 spec + 旁路 19l Codex P3 + 30 累计技术债（19l 闭环 #28 + 新增 #29 #30）+ §六 Codex 19l Finding 附录占位 + cici 19m 启动前 3 决策点（业务方反馈 / secrets 配 / 基础资料范围）|
| **V0.2** | **2026-05-15** | **cici 方案 B 决策直接接受锁版** — 主轨基础资料补完 3 原型（base-archive + master-data-admin + tender-archive）1.5 PD + 副轨 E2E 扩展 8 spec（19l b 5 + 19m b 3）1-1.5 PD + 旁路 19l Codex P3-1/-2 消化 0.3 PD = **3-3.5 PD**；§四 锁版决策 + 决策 6/7 业务方+secrets 顺延 19n + 决策 11 race 治理保留 [P0] |
