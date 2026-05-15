# Sprint 19i 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19i 起步草案
**配套：** [`Sprint-19h-Demo-脚本-V0.1.md`](./Sprint-19h-Demo-脚本-V0.1.md) §四 候选范围 + 19h 收尾 race 治理升级 0 race 实测

---

## 一、Sprint 19i 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 A2' 重启：NC 真端点 phase 2（17a-19h 8 次顺延 — 19i 评估窗口）

19d 撤主轨后 17a-19h 累计 8 次顺延（19d 实际撤而非"顺延"）— 19i 启动前 cici 评估 NC 端反馈窗口：

| Task | 范围 | 工时 |
|---|---|---|
| 19i-A2-RESTART-1 | NC 端反馈整理（cici 与项目方明确对接人 + 反馈项分级）| 0.3 PD |
| 19i-A2-RESTART-2 | A2-1' 60 ⚠️ 占位稿按反馈分级（必反馈 5 项 + 可选 2 项 + 后置 N 项）| 0.5 PD |
| 19i-A2-RESTART-3 | A2 真端点接通（OAuth2 + Polly + chaos 测试沿用 17a 基础设施）| 2-3 PD |
| 19i-A2-RESTART-4 | 业务回归（4 endpoint + InterfaceTask + 守护测试）| 0.5-1 PD |

**预算 A2' 重启**：3-4 PD（需 cici 启动前确认 NC 端反馈到位）

### 候选 6 backend endpoint 归属决策（19f UI-3 phase 2 + 19g/19h 顺延）

19f UI-3 phase 2 5 React 页面 + 19c reports/nc-interface 累计 6 [⚠️] 占位：

| 页面 | endpoint | 业务方 |
|---|---|---|
| dashboard-bigscreen | `GET /api/supply-cores/dashboard/bigscreen` | 大屏聚合（SQA / 财务）|
| quality-check | `GET /quality-checks{,/{id}}` + `POST /{id}/judge` | S-04 质检（质保部）|
| scrap-disposal | `GET /scrap-disposals` + `POST /{id}/{approve|reject|execute}` | S-19 处置（设备部）|
| mobile-stocktake | `GET /stocktake-sheets{,/{id}}` + `POST /{id}/{scan|sync}` | S-15 盘点（仓储部）|
| xinchuang-matrix | `GET /xinchuang/matrix` | readonly 矩阵（SQA 维护）|
| equipment-oee | `GET /equipment-oee/dashboard` + `equipment_oee_daily 视图` | OEE Controller（设备部）|

**预算 6 endpoint 归属决策**：2-3 PD（cici 与业务方协调 + 主代理 a 接通 mock → real）

### 候选 CI/CD 真实运行验证 + secrets 配置（19h 顺延）

19h CI/CD 集成完整但 cici 还需配置 secrets + 首次 PR run 验证：

| Task | 范围 | 工时 |
|---|---|---|
| 19i-CI-VERIFY-1 | cici 配 SUPPLYCORES_CATIO_PAT secret + DEVEXTREME_LICENSE secret | 0.1 PD |
| 19i-CI-VERIFY-2 | 首次 PR run 验证 3 jobs 全 PASS（dotnet + frontend + e2e）| 0.3 PD |
| 19i-CI-VERIFY-3 | continue-on-error 兜底拆除（验证 PASS 后改 false）| 0.1 PD |

**预算 CI/CD 真实验证**：0.5 PD

### 候选 RBAC 场景 2 接通（19h 占位顺延）

19h c rbac.spec.ts L66 场景 2 test.skip 占位 — [⚠️ 待 cici 19i+ 接通测试用户 seed + 登录 helper]：

| Task | 范围 | 工时 |
|---|---|---|
| 19i-RBAC-2-1 | 测试用户 seed 设计（无 DashboardBigscreen Permission 用户 + ABP DataSeed 注入）| 0.3 PD |
| 19i-RBAC-2-2 | E2E 登录 helper（programmatic 鉴权 cookie 注入）| 0.4 PD |
| 19i-RBAC-2-3 | rbac.spec.ts 场景 2 接通（test.skip 解除 + 真鉴权流验证）| 0.3 PD |

**预算 RBAC 场景 2**：1 PD

### 候选 Codex pre-merge 评审 hook（19h race hook 替代路径）

19h race hook 旁路评估结论：不实施；替代方案 = Codex pre-merge 评审 hook：

| Task | 范围 | 工时 |
|---|---|---|
| 19i-CODEX-HOOK-1 | GitHub Actions workflow 加 Codex 评审 step（PR opened / synchronize trigger）| 0.5 PD |
| 19i-CODEX-HOOK-2 | Codex 评审结果 PR comment（finding 自动留痕）| 0.3 PD |

**预算 Codex hook**：0.8 PD

### 候选 UI-3 phase 3（19f 起持续顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19i-UI-3-3 | 35+ 长尾 HTML 原型批量 React 化（按 prototype/ 剩余文件）| 5-10 PD |

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a-19h 候选 C/G。**预算 5-10 PD**

---

## 二、推荐策略：双轨 A2' 重启 / 6 endpoint（cici 决策）or 路径 2 缩范围 CI/CD + RBAC

**V0.1 倾向**：
- **路径 1（NC 反馈到位 + 业务方协调）**：主轨 A2' 重启 3-4 PD + 副轨 6 endpoint 归属 2-3 PD = **5-7 PD**（饱和 Sprint）
- **路径 2（NC 无反馈 / 业务方未协调）**：主轨 CI/CD 真实验证 + secrets 0.5 PD + 副轨 RBAC 场景 2 接通 1 PD + 旁路 Codex hook 0.8 PD = **2.3 PD**（缩范围）

**cici 19i 启动前必决策**：
1. NC 端反馈窗口（A2' 重启条件 ≥ 5 项关键差异是否到位）
2. 6 业务方协调（财务/质保/设备/仓储/SQA 5 业务方对接人是否明确）
3. CI/CD secrets 配置时机（cici 自助配 GitHub secrets — 0.1 PD）

---

## 三、累计技术债（Sprint 19i 必修，决策点 2）

### 3.1 Sprint 17a-19h 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | 17a-19h | 4 PD | **19d 撤** + 19i 评估重启 |
| 2 | 详情页 / 编辑表单（reports / nc-interface backend endpoint 占位）| 19c | 0.3 PD | 19i 待 cici 确认 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 等 NC 端 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19i 评估 |
| 5 | ~~UI-2-5 E2E Playwright~~ | 19c-19f 4 次顺延 | 1-1.5 PD | **19g/19h 已落地** ✅（19g 2 + 19h 4 spec + RBAC = 15 tests）|
| 6 | ~~vendor brotli + lazy-load~~ | 19b/19d | 0.5-1 PD | **19f STYLE-OPT 已落地** ✅ |
| 7 | UI-STYLE | 19e/19f | 0 | **已完成** ✅ |
| 8 | minSignCount 4 模板真接通后业务回归测试 | 19d | 0.5 PD | 19i 候选 |
| 9 | ~~Razor Page 细粒度 Permission~~ | 19e 起 | 0.5 PD | **19f UI-FIX 已落地** ✅ |
| 10 | ~~abp install-libs LeptonX libs~~ | 19e 起 | 0.1 PD | **19f UI-FIX 已落地** ✅ |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | **19i 6 endpoint 归属一并** |
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |
| 14 | 6 backend endpoint [⚠️] 占位归属决策 | 19f | 2-3 PD | **19i 主轨**（路径 1 副轨 / 路径 2 顺延 19j）|
| 15 | commit history 治理债 | 19f | 0.3 PD | **19g/19h 已落地** ✅（AGENTS.md V1.2 + spawn_template V1.1）|
| 16 | ~~双 race 治理债升级~~ | 19g | 0.5-1 PD | **19h 继续观察期 — 0 race 验证文档治理足够** ✅ |
| 17 | ~~E2E 场景扩展 + RBAC 测试 + CI/CD 集成~~ | 19g | 2-3.5 PD | **19h 已落地** ✅ |
| 18 | UI-3 phase 3 35+ 长尾原型 | 19f 起 | 5-10 PD | 顺延 19j/20a（业务价值评估）|
| **19** | **CI/CD 真实运行验证 + secrets 配置** | **19h** | **0.5 PD** | **19i 路径 2 主轨** |
| **20** | **RBAC 场景 2 接通**（test.skip 占位）| **19h** | **1 PD** | **19i 路径 2 副轨** |
| **21** | **Codex pre-merge 评审 hook**（19h race hook 替代路径）| **19h** | **0.8 PD** | **19i 路径 2 旁路评估** |

### 3.2 Codex 19h 顺延（待评审后补 §六附录）

> 占位 — Codex 19h 评审完成后从顺延清单挑选补到本节。

**预估合计 ~0.5-1 PD**（占位等评审后修订；19h 0 race + 治理升级 100% 有效，预期 finding 较少）

---

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19i 主线方向 | **路径 1（NC 反馈到位）双轨 A2' + 6 endpoint** 或 **路径 2 双轨 CI/CD 真实验证 + RBAC 场景 2 + Codex hook**（cici 19i 启动前评估）|
| 2 | 21 累计技术债 | 视 cici 路径选择：路径 1 = #1 #14 主线；路径 2 = #19 #20 #21 主线 |
| 3 | 工时预算 | 路径 1：5-7 PD（饱和）；路径 2：2.3 PD（缩范围）|
| 4 | 子代理并行策略 | 路径 1：a A2' 重启 + b 6 endpoint 协调 + c CI/CD secrets 兜底；路径 2：a CI/CD secrets + b RBAC 场景 2 + c Codex hook |
| 5 | Codex 19h 评审 | **待 cici 触发**（提示词详 19h Demo §五 — 重点 race 治理升级反向验证）|
| 6 | A2' 重启决策 | **19i 启动前 cici 评估 NC 端反馈窗口**（无反馈 8 次顺延 → 路径 2 缩范围；反馈到位 → 路径 1 饱和）|
| 7 | 6 endpoint 业务方协调时机 | **19i 启动前 cici 通知 5 业务方对接人** — 协调到位则路径 1 副轨启动 |
| 8 | CI/CD secrets 配置时机 | **cici 19i D0 自助配 GitHub secrets**（PAT + DEVEXTREME LICENSE 0.1 PD）|

---

## 五、Sprint 19i 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | A2' 重启第 8 次顺延（NC 端持续无反馈）| **极高** | cici 19i 必决策 — 启动重启或正式撤架（避免持续顺延反模式深化）|
| 2 | 6 endpoint 业务方协调延期 | 中 | mock 数据继续支撑 Demo；路径 2 不依赖业务方协调 |
| 3 | RBAC 场景 2 测试用户 seed 设计复杂度 | 中 | ABP DataSeed 标准接入 + Permission 注入 + cookie helper |
| 4 | CI/CD 首次 PR run 失败（secrets / network / sibling repo 不可达）| 中 | 19h 已加 continue-on-error 兜底 → 真验证再拆除 |

---

## 六、Codex 19h Finding 附录（占位 · 待评审完成补全）

> 占位 — Codex 19h 评审完成后从顺延清单挑选补到本节。

**评审重点候选**（详 19h Demo §五）：
- GitHub Actions ci.yml 配置正确性（3 jobs / cache / continue-on-error 兜底 / secrets 占位）
- 19g 顺延 P1-1 webServer + P2-1 spec 容错闭环完整性
- E2E 4 spec + RBAC 2 场景实现策略
- AGENTS.md V1.2 race hook 评估完整性 + 触发阈值合理性
- **双子代理 0 race 治理升级反向验证**

**触发提示词**：详 19h Demo §五

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双路径（NC 反馈到位 / 缩范围）+ A2' 重启 + 6 endpoint + CI/CD 真实验证 + RBAC 场景 2 接通 + Codex pre-merge 评审 hook + 21 累计技术债（19h 闭环 #5/#15/#16/#17 + 新增 #19/#20/#21）+ §六 Codex 19h Finding 附录占位 + cici 19i 启动前 3 决策点（NC 反馈 / 业务方协调 / CI/CD secrets）|
