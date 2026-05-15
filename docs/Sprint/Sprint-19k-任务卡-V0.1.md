# Sprint 19k 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19k 起步草案
**配套：** [`Sprint-19j-Demo-脚本-V0.1.md`](./Sprint-19j-Demo-脚本-V0.1.md) §四 候选范围 + 19j 收尾 A2' 撤架 + 6 endpoint 骨架

---

## 一、Sprint 19k 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 6 endpoint mock → real 接通（19j 顺延 — cici 业务方协调到位）

19j Controller 骨架 + 30 DTO + 110+ [⚠️ 业务方 spec 确认] — 19k cici 业务方反馈到位后 mock → real：

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19k-6EP-REAL-1 | dashboard/bigscreen DTO 字段确认 + AppService Mock → Repository 查询 + 5 厂矿 / 12 KPI 真实计算 | 0.5 PD | SQA / 财务方反馈到位 |
| 19k-6EP-REAL-2 | quality-checks AppService Mock → S-04 真实状态机 + Repository | 0.5 PD | 质保方反馈到位 |
| 19k-6EP-REAL-3 | scrap-disposals AppService Mock → S-19 真实业务流 + NC 凭证号生成 | 0.5 PD | 设备方反馈到位 |
| 19k-6EP-REAL-4 | stocktake-sheets AppService Mock → S-15 真实盘点 + 扫码 | 0.4 PD | 仓储方反馈到位 |
| 19k-6EP-REAL-5 | xinchuang/matrix readonly endpoint → SQA team 维护数据接入 | 0.2 PD | SQA team 维护机制建议 |
| 19k-6EP-REAL-6 | equipment-oee AppService Mock → equipment_oee_daily 视图 + OEE 真实计算 | 0.5 PD | 设备方反馈到位 |

**预算 6 endpoint mock → real**：2.5-3 PD（业务方协调到位 ≥ 3 endpoint 启动）

### 候选 CI/CD 真实运行验证 + Codex hook 实测（19j 顺延）

19j codex_review_hook.md V1.1 强化 + cici 19j D0 自助配 secrets — 19k 实测：

| Task | 范围 | 工时 |
|---|---|---|
| 19k-CI-VERIFY-1 | cici 自配 secrets 完成后首次 PR run 验证 ci.yml 3 jobs PASS | 0.3 PD |
| 19k-CI-VERIFY-2 | codex-review.yml workflow 首次 PR 自动评审验证 + finding markdown 质量评估 | 0.3 PD |
| 19k-CI-VERIFY-3 | continue-on-error 兜底拆除（验证 PASS 后）| 0.1 PD |
| 19k-CI-VERIFY-4 | CI workflow 优化（actionlint 验证 + cache 命中率评估）| 0.1 PD |

**预算 CI/CD 验证**：0.8 PD

### 候选 UI-3 phase 3 部分（19f 起持续顺延）

19j A2' 撤架后续 cici 评估优先级 vs PO 反馈：

| Task | 范围 | 工时 |
|---|---|---|
| 19k-UI-3-3-PARTIAL | 35+ 长尾 HTML 原型批量 React 化（前 5-10 个 — 按业务价值 cici 选）| 2-3 PD |

**预算 UI-3 phase 3 部分**：2-3 PD（业务价值评估到位）

### 候选 E2E 场景扩展 + 6 endpoint 集成（19j 顺延）

19j Controller 骨架 + 19g/19h/19i E2E 15 tests — 19k 集成：

| Task | 范围 | 工时 |
|---|---|---|
| 19k-E2E-INT-1 | dashboard-bigscreen / quality-check / scrap-disposal / mobile-stocktake / xinchuang E2E 接通真 endpoint（替 mock） | 0.8 PD |
| 19k-E2E-INT-2 | E2E 场景扩展 — RBAC 场景 2 真验证完整链路（接通 19i seed 测试用户 + 6 endpoint Permission） | 0.4 PD |

**预算 E2E 集成**：1-1.5 PD

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a-19j 候选 C/G。**预算 5-10 PD**

---

## 二、推荐策略：路径 A 6 endpoint mock → real（业务方反馈到位）or 路径 B 缩范围

**V0.1 倾向**：
- **路径 A（业务方反馈到位 ≥ 3 endpoint spec）**：主轨 6 endpoint mock → real 2.5-3 PD + 副轨 CI 真实运行验证 + Codex hook 实测 0.8 PD + 旁路 E2E 集成 1-1.5 PD = **4.3-5.3 PD**（饱和）
- **路径 B（业务方未协调 / 仅 1-2 endpoint spec）**：主轨 CI 真实验证 + Codex hook 实测 0.8 PD + 副轨 UI-3 phase 3 部分 2-3 PD + 旁路 partial 6 endpoint mock → real 0.5-1 PD = **3.3-4.8 PD**（缩范围）

**cici 19k 启动前必决策**：
1. 6 业务方反馈状态（到位 endpoint 数量）
2. CI/CD secrets 自助配置状态（OPENAI_API_KEY / PAT / DEVEXTREME LICENSE）
3. UI-3 phase 3 优先级（业务价值评估）

---

## 三、累计技术债（Sprint 19k 必修，决策点 2）

### 3.1 Sprint 17a-19j 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | 17a-19i | 4 PD | **19j 正式撤架** ✅（V0.2 §六 历史性决策 + §七 8 项资产保留 + §八 5 步重启路径）|
| 2 | 详情页 / 编辑表单 endpoint 占位 | 19c | 0.3 PD | 19k 6 endpoint mock → real 一并 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 撤架后保留 — NC 反馈到位续 Sprint 重启 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19k 评估 |
| 5 | ~~UI-2-5 E2E Playwright~~ | 19c-19f 4 次顺延 | 1-1.5 PD | **19g/19h/19i 已落地** ✅ |
| 6 | ~~vendor brotli + lazy-load~~ | 19b/19d | 0.5-1 PD | **19f STYLE-OPT 已落地** ✅ |
| 7 | UI-STYLE | 19e/19f | 0 | **已完成** ✅ |
| 8 | minSignCount 4 模板真接通业务回归 | 19d | 0.5 PD | 19k 候选 |
| 9 | ~~Razor Page 细粒度 Permission~~ | 19e 起 | 0.5 PD | **19f UI-FIX 已落地** ✅ |
| 10 | ~~abp install-libs LeptonX libs~~ | 19e 起 | 0.1 PD | **19f UI-FIX 已落地** ✅ |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | **19j 骨架已落地** ✅（mock → real 19k 一并）|
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |
| 14 | ~~6 backend endpoint [⚠️] 占位归属决策~~ | 19f | 2-3 PD | **19j 骨架已落地** ✅（mock → real 19k 主轨）|
| 15 | ~~commit history 治理债~~ | 19f | 0.3 PD | **19g/19h 已落地** ✅ |
| 16 | ~~双 race 治理债升级~~ | 19g | 0.5-1 PD | **19h+19i+19j 累计 6 commits 0 race — 治理升级稳定有效** ✅ |
| 17 | ~~E2E 场景扩展 + RBAC 测试 + CI/CD 集成~~ | 19g | 2-3.5 PD | **19h+19i 已落地** ✅ |
| 18 | UI-3 phase 3 35+ 长尾原型 | 19f 起 | 5-10 PD | **19k 路径 B 候选** |
| 19 | ~~CI/CD 真实运行验证 + secrets 配置~~ | 19h | 0.5 PD | **19k 副轨**（cici 自助配 secrets 后） |
| 20 | ~~RBAC 场景 2 接通~~ | 19h | 1 PD | **19i 已落地** ✅ |
| 21 | ~~Codex pre-merge 评审 hook~~ | 19h | 0.8 PD | **19i 已落地** ✅ |
| 22 | ~~Codex pre-merge hook 实测~~ | 19i | 0.3 PD | **19k 副轨**（cici 自助配 secret 后）|
| 23 | ~~AGENTS.md V1.2 治理表序号列~~ | 19h | 0 PD | **19j 已落地** ✅（V1.3）|
| **24** | **6 endpoint mock → real**（业务方 spec 接通）| **19j** | **2.5-3 PD** | **19k 路径 A 主轨**（业务方反馈到位）|
| **25** | **E2E 6 endpoint 集成**（mock-real E2E）| **19j** | **1-1.5 PD** | **19k 路径 A 旁路** |

### 3.2 Codex 19j 顺延（待评审后补 §六附录）

> 占位 — Codex 19j 评审完成后从顺延清单挑选补到本节。

**预估合计 ~0.5-1 PD**（占位等评审后修订；19j Controller 骨架 + 撤架文档 + 治理升级第 6 次稳定）

---

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19k 主线方向 | **路径 A（业务方反馈到位 ≥ 3 endpoint）**：6 endpoint mock → real 主轨 + CI 真实验证副轨 + E2E 集成旁路 4.3-5.3 PD；或 **路径 B（业务方未协调）**：CI 真实验证主轨 + UI-3 phase 3 部分副轨 + partial 6 endpoint 旁路 3.3-4.8 PD |
| 2 | 25 累计技术债 | 视 cici 路径：路径 A = #24 主线；路径 B = #19/#22 + #18 主线 |
| 3 | 工时预算 | 路径 A：4.3-5.3 PD（饱和）；路径 B：3.3-4.8 PD（缩范围）|
| 4 | 子代理并行策略 | 路径 A：a 协调 + b 6 endpoint mock → real（≥3 endpoint）+ c CI 验证 + E2E 集成；路径 B：a CI 验证 + b UI-3 phase 3 部分 + c partial 6 endpoint |
| 5 | Codex 19j 评审 | **待 cici 触发**（提示词详 19j Demo §五 — 重点 A2' 撤架完整性 + Mock SeedData 合理性 + 治理升级第 6 次稳定）|
| 6 | 6 业务方反馈状态 | **19k 启动前 cici 评估业务方反馈状态** — 到位 ≥ 3 endpoint → 路径 A；< 3 → 路径 B |
| 7 | CI/CD secrets 自助配 | **cici 19k D0 自助配**（OPENAI_API_KEY / PAT / DEVEXTREME LICENSE）— 0.1 PD |
| 8 | UI-3 phase 3 优先级（路径 B 触发）| cici 与 PO 确认业务价值（5-10 PD 大投入是否值得）|
| 9 | spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.3 + spawn_template V1.1 §八/§九（19h+19i+19j 三 Sprint 0 race 稳定有效）|
| 10 | 任务边界设计原则 | spawn 前评估任务边界天然分离（19j 实测有效 0 文件交集）|

---

## 五、Sprint 19k 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 6 业务方反馈延期（< 3 endpoint spec）| 🟡 中 | 路径 B 缩范围 — UI-3 phase 3 + CI 验证不依赖业务方 |
| 2 | CI/CD secrets cici 未自助配 → CI workflow 走 continue-on-error 兜底 | 🟢 低 | 19h/19i 已加 continue-on-error；不阻塞功能开发 |
| 3 | 6 endpoint mock → real 时 DTO 字段需重构（业务方 spec 与 19j 反推差异大） | 🟡 中 | DTO 字段已加 [⚠️ 业务方 spec 确认] 标记 — 业务方反馈到位后允许 breaking change |
| 4 | UI-3 phase 3 35+ 长尾原型 → 业务价值评估失误（PO 优先级低）| 🟡 中 | cici 与 PO 19k 启动前确认；路径 B 仅做 5-10 个高价值原型 |

---

## 六、Codex 19j Finding 附录（占位 · 待评审完成补全）

> 占位 — Codex 19j 评审完成后从顺延清单挑选补到本节。

**评审重点候选**（详 19j Demo §五）：
- 6 endpoint Controller 骨架设计正确性 + Mock SeedData 字段反推合理性
- A2' 撤架决策完整性（§六/§七/§八）
- AGENTS.md V1.3 + codex_review_hook.md V1.1 治理升级第 6 次稳定
- 双子代理 0 race 第 6 次稳定反向验证

**触发提示词**：详 19j Demo §五

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双路径（业务方反馈到位 / 缩范围）+ 6 endpoint mock → real + CI 真实验证 + Codex hook 实测 + UI-3 phase 3 部分 + E2E 集成 + 25 累计技术债（19j 闭环 #1/#14/#16/#23 + 新增 #24/#25）+ §六 Codex 19j Finding 附录占位 + cici 19k 启动前 3 决策点 |
