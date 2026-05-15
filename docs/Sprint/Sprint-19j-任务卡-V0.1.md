# Sprint 19j 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审 — **A2' 9 次顺延红线 cici 必决策**）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19j 起步草案
**配套：** [`Sprint-19i-Demo-脚本-V0.1.md`](./Sprint-19i-Demo-脚本-V0.1.md) §四 候选范围 + 19i 收尾双子代理 0 race 连续 2 Sprint 稳定

---

## 一、Sprint 19j 必决策（A2' 命运红线）

⚠️ **9 次顺延 cici 19j 必决策** — A2' 重启 vs 正式撤架 vs 继续顺延（**已不可接受 — Codex 19h §八 风险评估极高**）。

### 候选 A2' 重启：NC 真端点 phase 2

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19j-A2-RESTART-1 | NC 端反馈整理（cici 与项目方明确对接人 + 反馈项分级）| 0.3 PD | NC 反馈到位 ≥ 5 项 |
| 19j-A2-RESTART-2 | A2-1' 60 ⚠️ 占位稿按反馈分级 | 0.5 PD | 同上 |
| 19j-A2-RESTART-3 | A2 真端点接通（OAuth2 + Polly + chaos）| 2-3 PD | 同上 |
| 19j-A2-RESTART-4 | 业务回归 | 0.5-1 PD | 同上 |

**预算 A2' 重启**：3-4 PD

### 候选 A2' 正式撤架（替代方案 — cici 与 PO 协调后）

| Task | 范围 | 工时 |
|---|---|---|
| 19j-A2-WITHDRAW-1 | A2' 正式撤架文档化（详设 08 NC 接口 V0.x 标 NC 真端点暂搁 + 17a-19i 资产保留清单）| 0.3 PD |
| 19j-A2-WITHDRAW-2 | 17a OAuth2 + Polly + chaos 基础设施保留声明（续 Sprint NC 反馈到位重启路径）| 0.2 PD |
| 19j-A2-WITHDRAW-3 | 主线转 UI-3 phase 3 或 6 endpoint 归属（cici 决策）| - |

**预算 A2' 撤架**：0.5 PD + 转主线工作量

### 候选 6 backend endpoint 归属决策（19f-19i 持续顺延）

19f UI-3 phase 2 5 React 页面 + 19c reports/nc-interface 累计 6 [⚠️] 占位：

| Task | 范围 | 工时 | 业务方 |
|---|---|---|---|
| 19j-6EP-1 | dashboard-bigscreen 大屏聚合 | 0.5 PD | SQA / 财务 |
| 19j-6EP-2 | quality-check S-04 质检 endpoint | 0.5 PD | 质保部 |
| 19j-6EP-3 | scrap-disposal S-19 处置 endpoint | 0.5 PD | 设备部 |
| 19j-6EP-4 | mobile-stocktake S-15 盘点 endpoint | 0.4 PD | 仓储部 |
| 19j-6EP-5 | xinchuang-matrix readonly endpoint | 0.2 PD | SQA |
| 19j-6EP-6 | equipment-oee Controller + equipment_oee_daily 视图 | 0.5-1 PD | 设备部 |

**预算 6 endpoint**：2.5-3 PD（业务方协调到位则启动）

### 候选 CI/CD 真实运行验证 + Codex hook 实测

19i CI/CD + Codex hook 已落地但等 cici 自助配 secrets：

| Task | 范围 | 工时 |
|---|---|---|
| 19j-CI-VERIFY-1 | cici 配 secrets（OPENAI_API_KEY / PAT / DEVEXTREME LICENSE）| 0.1 PD |
| 19j-CI-VERIFY-2 | 首次 PR run 验证 ci.yml + codex-review.yml 双 workflow PASS | 0.4 PD |
| 19j-CI-VERIFY-3 | continue-on-error 兜底拆除（验证 PASS 后）| 0.1 PD |
| 19j-CI-VERIFY-4 | 主代理 a 触发首次 PR 让 Codex hook 自动评审验证 | 0.2 PD |

**预算 CI/CD 验证**：0.8 PD

### 候选 UI-3 phase 3（A2' 撤架触发）

| Task | 范围 | 工时 |
|---|---|---|
| 19j-UI-3-3 | 35+ 长尾 HTML 原型批量 React 化（按 prototype/ 剩余文件）| 5-10 PD |

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a-19i 候选 C/G。**预算 5-10 PD**

---

## 二、推荐策略：A2' 命运决策驱动

**V0.1 倾向**：
- **路径 A（NC 反馈到位）**：A2' 重启 3-4 PD + 副轨 CI 验证 0.8 PD = **4-5 PD**
- **路径 B（A2' 撤架 + 业务方协调到位）**：A2' 撤架 0.5 PD + 6 endpoint 归属 2.5-3 PD + 副轨 CI 验证 0.8 PD = **3.8-4.3 PD**
- **路径 C（A2' 撤架 + 业务方未协调）**：A2' 撤架 0.5 PD + UI-3 phase 3 部分 2-3 PD + 副轨 CI 验证 0.8 PD = **3.3-4.3 PD**

**cici 19j 启动前红线决策**：
1. **A2' 命运**（红线）：重启 / 正式撤架 / 继续顺延（**继续顺延 cici 必给出明确理由 + 时间表，否则反模式深化失控**）
2. **6 业务方协调**：cici 与 5 业务方（财务/质保/设备/仓储/SQA）对接到位时机
3. **CI/CD secrets**：cici 自助配（OPENAI_API_KEY / PAT / DEVEXTREME LICENSE）

---

## 三、累计技术债（Sprint 19j 必修，决策点 2）

### 3.1 Sprint 17a-19i 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | A2' NC 真端点 phase 2 | 17a-19i | 4 PD | **9 次顺延 — 19j 红线必决策** ⚠️ |
| 2 | 详情页 / 编辑表单 endpoint 占位 | 19c | 0.3 PD | 19j 待 cici 确认 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 等 NC 端 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19j 评估 |
| 5 | ~~UI-2-5 E2E Playwright~~ | 19c-19f 4 次顺延 | 1-1.5 PD | **19g/19h 已落地** ✅ |
| 6 | ~~vendor brotli + lazy-load~~ | 19b/19d | 0.5-1 PD | **19f STYLE-OPT 已落地** ✅ |
| 7 | UI-STYLE | 19e/19f | 0 | **已完成** ✅ |
| 8 | minSignCount 4 模板真接通业务回归 | 19d | 0.5 PD | 19j 候选 |
| 9 | ~~Razor Page 细粒度 Permission~~ | 19e 起 | 0.5 PD | **19f UI-FIX 已落地** ✅ |
| 10 | ~~abp install-libs LeptonX libs~~ | 19e 起 | 0.1 PD | **19f UI-FIX 已落地** ✅ |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | **19j 6 endpoint #6 一并** |
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |
| 14 | 6 backend endpoint [⚠️] 占位归属决策 | 19f | 2-3 PD | **19j 主轨**（路径 B 启动）|
| 15 | ~~commit history 治理债~~ | 19f | 0.3 PD | **19g/19h 已落地** ✅ |
| 16 | ~~双 race 治理债升级~~ | 19g | 0.5-1 PD | **19h/19i 双 Sprint 0 race 验证有效 — 继续观察期** ✅ |
| 17 | ~~E2E 场景扩展 + RBAC 测试 + CI/CD 集成~~ | 19g | 2-3.5 PD | **19h/19i 已落地** ✅ |
| 18 | UI-3 phase 3 35+ 长尾原型 | 19f 起 | 5-10 PD | **19j 路径 C 主线（如 A2' 撤架）** |
| 19 | ~~CI/CD 真实运行验证 + secrets 配置~~ | 19h | 0.5 PD | **19j 副轨（cici 自助配 secrets）** |
| 20 | ~~RBAC 场景 2 接通~~ | 19h | 1 PD | **19i 已落地** ✅ |
| 21 | ~~Codex pre-merge 评审 hook~~ | 19h | 0.8 PD | **19i 已落地** ✅ |
| **22** | **Codex pre-merge hook 实测** | **19i** | **0.3 PD** | **19j 副轨**（cici 配 secrets 后） |
| **23** | **AGENTS.md V1.2 治理表序号列**（19h Codex P3-2 顺延） | **19h** | **0 PD** | **19j 文档润色** |

### 3.2 Codex 19i 顺延（待评审后补 §六附录）

> 占位 — Codex 19i 评审完成后从顺延清单挑选补到本节。

**预估合计 ~0.3-0.8 PD**（占位等评审后修订；19i 双子代理 0 race + 治理升级稳定，预期 finding 较少）

---

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | **Sprint 19j 主线方向**（红线）| **cici 必决策 A2' 命运**：重启（路径 A）/ 正式撤架（路径 B 转 6 endpoint / 路径 C 转 UI-3 phase 3）/ 继续顺延（**反模式深化失控警告**）|
| 2 | 23 累计技术债 | 视 A2' 命运决策：路径 A = #1 主线；路径 B = #14 主线 + #1 撤架；路径 C = #18 主线 + #1 撤架 |
| 3 | 工时预算 | 路径 A：4-5 PD；路径 B：3.8-4.3 PD；路径 C：3.3-4.3 PD |
| 4 | 子代理并行策略 | 视路径 — sweet spot 2-3x |
| 5 | Codex 19i 评审 | **待 cici 触发**（提示词详 19i Demo §五 — 重点 0 race 反向验证 + Codex pre-merge hook 设计）|
| 6 | **A2' 命运决策（红线）** | **19j 启动前 cici 必给出明确选择 + 理由**（继续顺延必给时间表 — 否则 PO 介入）|
| 7 | 6 业务方协调时机 | 19j 启动前 cici 通知 5 业务方对接人（路径 B 启动条件）|
| 8 | CI/CD secrets 自助配 | cici 19j D0 自助配（OPENAI_API_KEY / PAT / DEVEXTREME LICENSE）— 0.1 PD |
| 9 | spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.2 + spawn_template V1.1 §八/§九（19h+19i 双 Sprint 0 race 验证稳定）|
| 10 | 任务边界设计原则 | spawn 前评估"任务边界是否天然分离"（19i 实测有效 0 文件交集）|

---

## 五、Sprint 19j 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | **A2' 9 次顺延继续无决策（反模式深化失控）** | **🔴 极高** | **19j 启动前 cici 必给明确选择 — 否则 PO / 项目方介入** |
| 2 | 6 业务方协调延期（5 业务方对接人未明确）| 🟡 中 | mock 数据继续支撑 Demo；路径 C UI-3 phase 3 不依赖 |
| 3 | CI/CD secrets cici 未自助配 → CI workflow 走 continue-on-error 兜底 | 🟢 低 | 19h/19i 已加 continue-on-error；不阻塞功能开发 |
| 4 | A2' 撤架后续 Sprint NC 反馈到位再重启（撤而后启）| 🟡 中 | 17a-19i 基础设施保留声明（OAuth2 + Polly + chaos）+ 重启路径文档化 |

---

## 六、Codex 19i Finding 附录（占位 · 待评审完成补全）

> 占位 — Codex 19i 评审完成后从顺延清单挑选补到本节。

**评审重点候选**（详 19i Demo §五）：
- Codex pre-merge hook 设计正确性
- RbacTestUserDataSeedContributor + login helper + rbac.spec.ts 场景 2 真验证
- CI workflow artifact upload 覆盖度
- **双子代理 0 race 连续 2 Sprint 稳定性反向验证**

**触发提示词**：详 19i Demo §五

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — **A2' 9 次顺延红线 cici 必决策**（重启 / 撤架 / 继续顺延极高风险）+ 3 路径方案（A NC 反馈 / B 撤架转 6 endpoint / C 撤架转 UI-3）+ 23 累计技术债（19i 闭环 #20 #21 + 新增 #22 #23）+ §六 Codex 19i Finding 附录占位 + cici 19j 启动前 3 决策点（A2' 命运 / 业务方协调 / CI secrets）|
