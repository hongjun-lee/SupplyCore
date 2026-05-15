# Sprint 19l 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19l 起步草案
**配套：** [`Sprint-19k-Demo-脚本-V0.1.md`](./Sprint-19k-Demo-脚本-V0.1.md) §四 候选范围 + 19k 收尾双子代理 0 race 第 8 次

---

## 一、Sprint 19l 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 6 endpoint mock → real（19j 顺延 / 业务方反馈到位）

19j Controller 骨架 + 30 DTO + 110+ [⚠️ 业务方 spec 确认] — cici 19l 业务方反馈到位后接通：

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19l-6EP-REAL-1 | dashboard/bigscreen DTO 字段确认 + Repository | 0.5 PD | SQA / 财务方反馈 |
| 19l-6EP-REAL-2 | quality-checks Repository + S-04 真实状态机 | 0.5 PD | 质保方反馈 |
| 19l-6EP-REAL-3 | scrap-disposals Repository + NC 凭证生成 | 0.5 PD | 设备方反馈 |
| 19l-6EP-REAL-4 | stocktake-sheets Repository + S-15 真实盘点 | 0.4 PD | 仓储方反馈 |
| 19l-6EP-REAL-5 | xinchuang/matrix SQA team 维护接入 | 0.2 PD | SQA team 维护机制 |
| 19l-6EP-REAL-6 | equipment-oee equipment_oee_daily 视图 + OEE 计算 | 0.5 PD | 设备方反馈 |

**预算 6 endpoint mock → real**：2.5-3 PD（业务方反馈到位 ≥ 3 endpoint 启动）

### 候选 CI/CD 真实运行验证 + Codex hook 实测（19j/19k 顺延）

19k secrets-check.yml + V1.3 静态评估完成 — 19l cici 配 secrets 后真实运行：

| Task | 范围 | 工时 |
|---|---|---|
| 19l-CI-REAL-1 | cici 配 secrets（OPENAI_API_KEY / PAT / DEVEXTREME LICENSE）+ secrets-check.yml dispatch 验证 | 0.2 PD |
| 19l-CI-REAL-2 | 首次 PR run 验证 ci.yml 3 jobs PASS | 0.3 PD |
| 19l-CI-REAL-3 | codex-review.yml workflow 首次 PR 自动评审验证 + finding 质量评估 | 0.3 PD |
| 19l-CI-REAL-4 | continue-on-error 兜底拆除（验证 PASS 后）| 0.1 PD |

**预算 CI/CD 真实运行验证**：0.9 PD

### 候选 UI-3 phase 3 续 5-10 原型（19k 续）

19k 已落 5 业务流核心 — 19l 续 5-10 原型（按 prototype/ 剩余 31+ 文件 cici / 子代理 自选）：

| Task | 范围 | 工时 |
|---|---|---|
| 19l-UI-3-3-CONT | 5-10 长尾原型 React 化（按 19k 选择标准 + 业务价值）| 2-3 PD（5 个）/ 4-5 PD（10 个） |

**预算 UI-3 phase 3 续**：2-3 PD（5 原型）/ 4-5 PD（10 原型）

### 候选 E2E 场景扩展 + 21 entries 集成

19k 21 entries + 19i 15 tests — 19l 集成扩展：

| Task | 范围 | 工时 |
|---|---|---|
| 19l-E2E-EXT-1 | 19j 6 endpoint mock-real E2E 链路（如 mock → real 部分到位）| 0.5 PD |
| 19l-E2E-EXT-2 | 19k 5 业务流原型 E2E 链路（purchase-planning / three-way-match / supplier-performance / material-issuance / funding-plan）| 1 PD |

**预算 E2E 扩展**：1.5 PD

### 候选 race 治理升级 [P0] → [P1] 降级（19j Codex 升级建议）

19h+19i+19j+19k 累计 8 commits 全 0 race — Codex 19j 评审建议 [P0] → [P1] 降级：

| Task | 范围 | 工时 |
|---|---|---|
| 19l-RACE-DOWNGRADE | AGENTS.md V1.4 §教训 6/7 标 [P1] 高优先级（非强制注入 spawn prompt）+ V1.3 治理升级表加 19k 2 行 + 续 Sprint 同模块场景验证条件 | 0.3 PD |

**预算 race 降级评估**：0.3 PD

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a-19k 候选 C/G。**预算 5-10 PD**

---

## 二、推荐策略：路径 A（业务方反馈到位）or 路径 B（缩范围 + CI 实测）

**V0.1 倾向**：
- **路径 A（5 业务方 ≥ 3 反馈到位 + cici 配 secrets）**：主轨 6 endpoint mock → real 2.5-3 PD + 副轨 CI 真实运行 0.9 PD + 旁路 E2E 扩展 1.5 PD = **4.9-5.4 PD**（饱和）
- **路径 B（业务方未协调 / cici 已配 secrets）**：主轨 CI 真实运行 + Codex hook 实测 0.9 PD + 副轨 UI-3 phase 3 续 5 原型 2-3 PD + 旁路 race 降级评估 0.3 PD = **3.2-4.2 PD**
- **路径 C（业务方未协调 / cici 未配 secrets）**：主轨 UI-3 phase 3 续 5 原型 2-3 PD + 副轨 E2E 扩展（19k 5 业务流）1 PD + 旁路 race 降级评估 0.3 PD = **3.3-4.3 PD**

**cici 19l 启动前 3 决策点**：
1. 6 业务方反馈状态（≥ 3 endpoint spec / < 3 / 0 反馈）
2. CI/CD secrets 自助配置状态（已配 / 未配）
3. race 治理升级降级评估（19k 0 race + Codex 19j 评审建议）

---

## 三、累计技术债（Sprint 19l 必修，决策点 2）

### 3.1 Sprint 17a-19k 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | 17a-19i | 4 PD | **19j 正式撤架** ✅ |
| 2 | 详情页 / 编辑表单 endpoint 占位 | 19c | 0.3 PD | 19l 6 endpoint 一并 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 撤架保留 — 重启时用 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19l 评估 |
| 5 | ~~UI-2-5 E2E Playwright~~ | 19c-19f 4 次顺延 | 1-1.5 PD | **19g/19h/19i 已落地** ✅ |
| 6 | ~~vendor brotli + lazy-load~~ | 19b/19d | 0.5-1 PD | **19f STYLE-OPT 已落地** ✅ |
| 7 | UI-STYLE | 19e/19f | 0 | **已完成** ✅ |
| 8 | minSignCount 4 模板真接通业务回归 | 19d | 0.5 PD | 19l 候选 |
| 9 | ~~Razor Page 细粒度 Permission~~ | 19e 起 | 0.5 PD | **19f UI-FIX 已落地** ✅ |
| 10 | ~~abp install-libs LeptonX libs~~ | 19e 起 | 0.1 PD | **19f UI-FIX 已落地** ✅ |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | **19j 骨架 + 19l mock → real 一并** |
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |
| 14 | ~~6 backend endpoint [⚠️] 占位归属决策~~ | 19f | 2-3 PD | **19j 骨架已落地** ✅（mock → real 19l 主轨）|
| 15 | ~~commit history 治理债~~ | 19f | 0.3 PD | **19g/19h 已落地** ✅ |
| 16 | ~~双 race 治理债升级~~ | 19g | 0.5-1 PD | **19h+19i+19j+19k 累计 8 commits 0 race — 治理升级稳定有效** ✅ |
| 17 | ~~E2E 场景扩展 + RBAC 测试 + CI/CD 集成~~ | 19g | 2-3.5 PD | **19h+19i 已落地** ✅ |
| 18 | UI-3 phase 3 35+ 长尾原型 | 19f 起 | 5-10 PD | **19k 5 原型已落地**（19l 续 5-10 原型候选） |
| 19 | CI/CD 真实运行验证 + secrets 配置 | 19h | 0.5 PD | **19l 副轨**（cici 自助配 secrets 后）|
| 20 | ~~RBAC 场景 2 接通~~ | 19h | 1 PD | **19i 已落地** ✅ |
| 21 | ~~Codex pre-merge 评审 hook~~ | 19h | 0.8 PD | **19i 已落地** ✅ |
| 22 | Codex pre-merge hook 实测 | 19i | 0.3 PD | **19l 副轨**（cici 配 secret 后）|
| 23 | ~~AGENTS.md V1.2 治理表序号列~~ | 19h | 0 PD | **19j 已落地** ✅（V1.3）|
| 24 | 6 endpoint mock → real（业务方 spec 接通）| 19j | 2.5-3 PD | **19l 路径 A 主轨**（业务方反馈到位）|
| 25 | E2E 6 endpoint 集成（mock-real E2E）| 19j | 1-1.5 PD | **19l 路径 A 旁路** |
| **26** | **CI/Codex workflow 静态评估 + secrets-check.yml** | **19k** | **0.55 PD** | **19l CI 真实运行后验证** |
| **27** | **path-trigger-thresholds.md V0.1 cherry-pick 入 19k V0.3 或 19l V0.1** | **19k** | **0.05 PD** | **19l V0.1 本草案 / 主代理 a cherry-pick** |
| **28** | **race 治理升级 [P0] → [P1] 降级评估** | **19j+19k** | **0.3 PD** | **19l 旁路评估**（19k 0 race 第 8 次稳定 + Codex 升级建议）|

### 3.2 Codex 19k 顺延（待评审后补 §六附录）

> 占位 — Codex 19k 评审完成后从顺延清单挑选补到本节。

**预估合计 ~0.3-0.5 PD**（占位等评审后修订；19k 0 race + actionlint 0 issues 预期 finding 较少）

---

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19l 主线方向 | **路径 A**：业务方 ≥ 3 反馈到位 + cici 配 secrets → 主轨 6 endpoint mock → real 4.9-5.4 PD；**路径 B**：cici 已配 secrets 未协调业务方 → 主轨 CI 真实运行 + UI-3 续 3.2-4.2 PD；**路径 C**：业务方未协调 + cici 未配 secrets → 主轨 UI-3 续 + E2E 扩展 3.3-4.3 PD |
| 2 | 28 累计技术债 | 视路径 — 路径 A = #14/#24 主线；路径 B = #19/#22 主线 + #18 副轨；路径 C = #18 主线 + #25 副轨 |
| 3 | 工时预算 | 路径 A 4.9-5.4 / 路径 B 3.2-4.2 / 路径 C 3.3-4.3 |
| 4 | 子代理并行策略 | 视路径 — sweet spot 2x |
| 5 | Codex 19k 评审 | **待 cici 触发**（提示词详 19k Demo §五 — 重点 UI-3 phase 3 + CI 静态 + 双子代理 0 race 第 8 次 + race 治理降级）|
| 6 | 6 业务方反馈状态 | **19l 启动前 cici 评估** — ≥ 3 反馈 → 路径 A；< 3 反馈 → 路径 B/C |
| 7 | CI/CD secrets 自助配 | **19l 启动前 cici 自助** — 已配 → 路径 A/B；未配 → 路径 C |
| 8 | race 治理升级降级评估 | **19l 旁路评估** — 19k 0 race 第 8 次稳定 + Codex 19j 升级建议；评估 [P0] → [P1] 降级是否触发（同模块场景验证条件未达） |
| 9 | spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.3 + spawn_template V1.1 §八/§九（19h-19k 4 Sprint 0 race 稳定）|
| 10 | 任务边界设计原则 | spawn 前评估任务边界天然分离（19k 实测 0 文件交集）|

---

## 五、Sprint 19l 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 6 业务方反馈持续延期（≥ 2 Sprint）| 🟡 中 | 路径 C 缩范围 — UI-3 phase 3 续 + E2E 扩展不依赖业务方 |
| 2 | cici CI/CD secrets 未自助配（19l 仍静态评估）| 🟢 低 | 19k secrets-check.yml 已落地；路径 C 不依赖 |
| 3 | UI-3 phase 3 续 5-10 原型业务价值评估失误 | 🟡 中 | 19k 模板提速 + cici / PO 协商业务价值 |
| 4 | race 治理升级 [P0] → [P1] 降级后续 Sprint race 发生 | 🟢 低 | 19l 旁路评估 — 同模块场景验证条件未达 → 保留 [P0] |

---

## 六、Codex 19k Finding 附录（占位 · 待评审完成补全）

> 占位 — Codex 19k 评审完成后从顺延清单挑选补到本节。

**评审重点候选**（详 19k Demo §五）：
- UI-3 phase 3 5 原型 React 化设计正确性 + 业务流选择合理性
- CI/Codex workflow 静态评估完整性 + secrets-check.yml 设计
- codex_review_hook.md V1.3 §6.5 静态评估留痕
- **双子代理 0 race 第 8 次稳定 + race 治理升级 [P0] → [P1] 降级评估**

**触发提示词**：详 19k Demo §五

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 3 路径（A 业务方反馈到位 / B cici 配 secrets 未协调 / C 未配 + 未协调）+ 28 累计技术债（19k 闭环 #16/#23 + 新增 #26/#27/#28）+ §六 Codex 19k Finding 附录占位 + cici 19l 启动前 3 决策点（业务方反馈 / secrets 配 / race 降级评估）|
