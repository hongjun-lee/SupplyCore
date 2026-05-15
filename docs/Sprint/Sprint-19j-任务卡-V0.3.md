# Sprint 19j 任务卡 V0.3（锁版 + A2' 撤架 + Codex 19j 评审 P2 当 Sprint 修留痕）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.3（锁版 + Codex 19j 评审 · cici 2026-05-15 触发 Codex 19j 评审完成 — A 级 0 P1 + 3 P2 (0.6 PD) + 3 P3 顺延 19k）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19j 锁版任务卡 + A2' 撤架决策留痕 + Codex 19j 评审 P2 全修留痕
**配套：** [`Sprint-19i-Demo-脚本-V0.1.md`](./Sprint-19i-Demo-脚本-V0.1.md) §四 候选范围 + 19d V0.2 §一 A2' 5 步重启路径

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

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19j 主线方向 | **路径 B 正式撤架 A2' + 6 endpoint**（cici 2026-05-15 AskUserQuestion 历史性决策 — A2' 9 次顺延 5 月 / 17a-19i 基础设施保留 / NC 反馈到位续 Sprint 重启路径文档化）|
| 2 | 23 累计技术债 | **#1 A2' 撤架 0.5 PD + #14 6 endpoint 归属主轨 2.5-3 PD + #19 CI secrets 副轨 0.5 PD + #22 Codex hook 实测 0.3 PD + #23 文档润色** |
| 3 | 工时预算 | **A2' 撤架 0.5 + 6 endpoint 2.5-3 + CI secrets 0.5 + Codex hook 0.3 + 缓冲 = 3.8-4.3 PD** |
| 4 | 子代理并行策略 | **主代理 a 协调 + A2' 撤架文档化 + V0.2 锁版 + 子代理 b 6 endpoint Controller 接通 + 子代理 c CI/CD secrets 验证 + Codex hook 实测 + P3 润色** sweet spot 2x |
| 5 | Codex 19i 评审 | **待 cici 触发**（提示词详 19i Demo §五 — 重点 0 race 反向验证 + Codex pre-merge hook 设计）|
| 6 | **A2' 命运决策（已锁版）** | **正式撤架（cici 2026-05-15 选）** — 详 §六 A2' 撤架决策记录 + §七 17a-19i 资产保留清单 + §八 重启路径文档 |
| 7 | 6 业务方协调时机 | **19j D0 cici 通知 5 业务方对接人**（财务/质保/设备/仓储/SQA — 路径 B 启动条件）；子代理 b mock → real 时 cici 业务方 spec 介入 |
| 8 | CI/CD secrets 自助配 | **cici 19j D0 自助配**（OPENAI_API_KEY / PAT / DEVEXTREME LICENSE）— 0.1 PD |
| 9 | spawn 子代理 prompt 引用约束 | **必含** AGENTS.md V1.2 + spawn_template V1.1 §八/§九（19h+19i 双 Sprint 0 race 验证稳定）|
| 10 | 任务边界设计原则 | spawn 前评估"任务边界是否天然分离"（19i 实测有效）|

---

## 五、Sprint 19j 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | ~~A2' 9 次顺延无决策反模式深化~~ | - | **V0.2 已锁路径 B 撤架** ✅ |
| 2 | 6 业务方协调延期（5 业务方对接人未明确）| 🟡 中 | 19j D0 cici 通知 5 业务方；子代理 b 优先做不依赖业务方的 Controller 骨架（DTO + AppService + endpoint 占位 + Mock SeedData 标记）；真实数据 spec 等业务方反馈后补 |
| 3 | CI/CD secrets cici 未自助配 → continue-on-error 兜底 | 🟢 低 | 不阻塞功能开发 |
| 4 | A2' 撤架后续 NC 反馈到位再重启（撤而后启）| 🟡 中 | §七 17a-19i 资产保留清单 + §八 5 步重启路径文档化 |

---

## 六、A2' 撤架决策记录（cici 2026-05-15 历史性决策）

### 6.1 顺延历史 5 月 9 次

| Sprint | 决策 | NC 反馈状态 |
|---|---|---|
| 17a | A2' phase 1（OAuth2 + Polly + chaos 基础设施）启动 | NC 端无反馈 |
| 17a-19c | A2' phase 2 真端点 4 次顺延 | 持续无反馈 |
| 19d | cici 选 1 撤主轨 + 5 步重启路径声明 | NC 反馈无进展 |
| 19e-19g | A2-1' 占位稿 NC 反馈迭代（3 次性质改变顺延）| 持续无反馈 |
| 19h | V0.2 顺延 19i + Codex 19h §八 评估"极高风险" | 5 月累计无反馈 |
| 19i | V0.2 cici AskUserQuestion 必决策"路径 2 缩范围"（A2' 顺延 19j 评估）| 5 月累计无反馈 |
| **19j** | **V0.2 cici AskUserQuestion 必决策"路径 B 正式撤架"** | **NC 端 5 月无反馈 — 不可接受继续顺延** |

### 6.2 cici 撤架理由（Codex 19j P2-1 修 — 补量化指标）

- ✅ **NC 端 5 月持续无反馈** — 单向沟通无法支撑技术接通
  - 量化：17a-19i 9 次顺延 / 5 月 / 累计推动 9 次 NC 端对接尝试 0 反馈
- ✅ **Codex 17a-19h 多 Sprint 评估**"反模式深化"+"产品 ROI 偏低"+ 终局评估指标
  - 量化：年化继续顺延成本 — 假设每 Sprint 0.1 PD 重新评估 + 占位稿维护 → 4-6 Sprint × 0.1 = 0.4-0.6 PD/年；撤架损失 = 0（资产 100% 保留 §七）
- ✅ **业务方协调路径需 cici 与 PO 明确**（17a-19i 单 cici 推动失败 5 月）
  - 量化：5 月 0 业务方介入 vs 6 endpoint 6 业务方协调点（财务/质保/设备/仓储/SQA + 1 PO）— 协调界面比 1 v 1 NC 厂商更具系统性
- ✅ **现实路径**：6 endpoint 业务方协调 mock → real 更接近交付（业务方多个 vs NC 单点）
  - 量化：6 endpoint mock → real 预估 0.5-1.5 PD/endpoint（详 §六.4）vs A2' 重启 4 PD + NC 反馈不确定性

### 6.4 6 endpoint mock → real 改动范围分级（Codex 19j P2-2 修 — 业务方反馈后改动预期）

按业务方反馈差距 3 个 level：

| Level | 改动范围 | 预估 / endpoint | 总 19k 工作量 |
|---|---|---|---|
| **L1 最优**（业务方反馈 = 19j DTO 字段 + 命名一致）| 仅替 AppService `BuildMock*` return → `_repository.GetListAsync(...)` | 0.3-0.5 PD | 1.5-3 PD |
| **L2 中等**（业务方反馈缺/改字段名 1-3 个）| AppService Mock 替 + DTO 加/删字段 + frontend binding 微调 | 0.5-1 PD | 3-6 PD |
| **L3 最坏**（业务方 spec 与 19j 反推差异大 ≥ 5 字段）| DTO 重构 + AppService 改 + frontend binding 改 + E2E spec 改 | 1-1.5 PD | 6-9 PD |

**19j 设计目标**：争取 L1（19j DTO 已按 19f React mock 完整反推 + 110+ [⚠️ 业务方 spec 确认] 标记完整）

### 6.5 5 步重启路径前置条件（Codex 19j P2-1 修 — fallback 方案）

**NC 反馈到位启动条件**（V0.3 量化）：
- 必反馈 ≥ 5 项关键差异（详 18b NC 接口 JSON-Schema 占位稿 V0.1 — 60 ⚠️ 中 cici 与 PO 共选 5 项必反馈）
- 项目级正式协调会议机制建立（财务方业务负责人 + NCC 厂商客户经理）
- 反馈周期不超过 5 个 Sprint（约 2.5 月）

**Fallback 方案**（NC 端反馈 < 5 项关键差异时）：
- A2'-PAUSE：保留 8 项资产 + 占位稿不维护更新（避免持续投入）
- 评估替代方案：F-01 NC 接口转手动凭证录入（业务方介入）/ 第三方 NC API gateway 服务（购买）

### 6.3 撤架范围

- ❌ 撤架 NC 真端点 phase 2 主轨（17a-19i 主线规划路径）
- ❌ 撤架 19j-A2-RESTART-1/2/3/4 4 task
- ❌ 撤架"NC 反馈 ≥ 5 项关键差异"作为 Sprint 启动条件
- ✅ **保留** 17a OAuth2 + Polly + chaos + WireMock 基础设施代码（详 §七）
- ✅ **保留** A2-1' 60 ⚠️ 占位稿（详 18b NC 接口 JSON-Schema 占位稿 V0.1）
- ✅ **保留** 5 步重启路径文档（详 §八）

---

## 七、17a-19i 资产保留清单（A2' 撤架后续重启基础）

A2' 撤架不丢失任何代码资产 — 续 Sprint NC 反馈到位时快速重启路径：

| 资产 | 位置 | 状态 |
|---|---|---|
| OAuth2 client_credentials 接通 | `modules/nova.supplycores/src/Nova.SupplyCores.Application/Interfaces/NcOAuth2TokenService.cs` | ✅ 保留 |
| Polly 三层（Timeout / Retry / CircuitBreaker）| `modules/nova.supplycores/src/Nova.SupplyCores.Application/Interfaces/NcInterfaceHttpClient*.cs` | ✅ 保留 |
| L1+L2 缓存（IDistributedCache Redis）| `NcOAuth2TokenService` 19c X1 升级 | ✅ 保留 |
| chaos 测试 WireMock 10 场景 | `modules/nova.supplycores/test/.../NcInterfaceChaosTests.cs` | ✅ 保留 |
| 21 NC Contributor（sed 批量 14a-16a）| `modules/nova.supplycores/src/Nova.SupplyCores.Application/Interfaces/Contributors/` | ✅ 保留 |
| A2-1' 60 ⚠️ 占位稿 | `docs/详细设计/Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md` | ✅ 保留 |
| InterfaceMonitor + NcHealthSnapshot 4 endpoint | `modules/nova.supplycores/src/Nova.SupplyCores.Application/Interfaces/InterfaceMonitorAppService.cs` | ✅ 保留（19f Codex 19d 19e 修过）|
| 用友 NC/NCC OpenAPI 公开资料检索（Sprint 18b）| memory `reference_nc_ncc_openapi_format.md` | ✅ 保留 |

**保留声明**：所有上述资产无业务功能依赖 NC 真端点 — 续 Sprint NC 反馈到位时仅需新接 endpoint + 适配 schema，不需重写基础设施。

---

## 八、A2' 撤后 NC 反馈到位续 Sprint 5 步重启路径

19d V0.2 §一 5 步重启路径沿用（A2' 撤架后续 NC 反馈到位时按此路径重启）：

1. **cici 与项目方明确 NC 端对接人**（财务部 IT / NCC 厂商客户经理）
2. **60 ⚠️ 占位稿拆"必反馈 5 项 + 可选 2 项 + 后置 N 项"分级**
3. **设置项目级正式协调会议**（含财务方业务负责人）替代 cici 个人推动
4. **NC 端反馈到位 → 重启 A2'**（19j 撤架后 / 续 Sprint 启动 — 评估 4 PD 任务卡 V0.1）
5. **重启时无需重新设计**：所有 §七 §基础设施就绪 → 仅新接 endpoint + 适配 schema 2-3 PD

---

## 九、Codex 19j Finding 附录（评审完成 · 3 P2 当 Sprint 修 + A2' 撤架风险评估 + 双子代理 0 race 第 6 次反向验证）

cici 2026-05-15 触发 Codex 风评审子代理（read-only 评 4 commits — code 2 + docs 2）— **A 级 0 P1 评审**：

| 等级 | # | Finding | 涉及文件 | 工作量 | 状态 |
|---|---|---|---|---|---|
| **P2** | **1** | A2' 撤架理由 4 项缺量化指标 + 5 步重启路径前置条件 | 19j-任务卡-V0.3.md §六.2/§六.5 | 0.2 PD | ✅ **当 Sprint 修**（V0.3 §六.2 量化 + §六.5 fallback）|
| **P2** | **2** | 6 endpoint Mock SeedData 来源 / Entity 依赖 / 19k 改动预期 xmldoc 缺失 | 6 AppService 类 xmldoc + 19j V0.3 §六.4 | 0.3 PD | ✅ **当 Sprint 修**（V0.3 §六.4 L1/L2/L3 分级 + 6 AppService 类 xmldoc 引用）|
| **P2** | **3** | Codex pre-merge hook OpenAI quota 耗尽预案缺失 | docs/internal/codex_review_hook.md V1.1 → V1.2 | 0.1 PD | ✅ **当 Sprint 修**（V1.2 §4.2.3 quota 预案 + §6.2.4 升版条件）|
| P3 | 1 | 19k V0.1 双路径 A/B 触发阈值不清晰 | 19k 任务卡 V0.1 | 0.05 PD | 顺延 19k V0.2 锁版时补 |
| P3 | 2 | 6 endpoint Permission 与业务方岗位权限分层一致性 | 19k 业务方协调会议 agenda | 0 PD | 顺延 19k 业务方协调时 |
| P3 | 3 | 3 secrets 验证 checklist 模板化（.github/workflows/secrets-check.yml）| 19k 优化 | 0.2 PD | 顺延 19k |

**修复 commit**：`<待 commit>` "fix(supplycores): Sprint 19j Codex 评审 P2 当 Sprint 全修（3 项 0.6 PD）"

**A2' 撤架风险评估**（Codex 19j 评审）：
| 维度 | 评估 | 风险 |
|---|---|---|
| 撤架决策完整性 | ✅ 4 项理由 + 8 项资产保留 + 5 步重启路径 | 🟢 低 |
| 资产保留有效性 | ✅ OAuth2/Polly/chaos + 21 Contributor + 占位稿 + Monitor + memory 全保留 | 🟢 低 |
| 5 步重启路径可执行性 | ⚠️ cici 与 NC 端对接人确认是关键（V0.3 §六.5 fallback 已补）| 🟡 中 |
| NC 反馈到位启动条件 | ⚠️ "反馈 ≥ 5 项关键差异"V0.3 §六.5 已量化 | 🟡 中 |
| 续 Sprint 重启成本 | ✅ 2-3 PD 评估合理（基础设施就绪 + 仅新接 endpoint）| 🟢 低 |

**总体风险：中**（撤架本身严谨 + 续 Sprint 重启依赖 cici-NC 沟通质量）

**双子代理 0 race 第 6 次反向验证**（Codex 19j 评审）：

| Sprint | 子代理 | commit | race | 任务边界 |
|---|---|---|---|---|
| 19h | b/c | a07120b + 3c8f6a5 | 0 race × 2 | 天然分离 |
| 19i | b/c | 7fa526c + 296f716 | 0 race × 2 | 天然分离 |
| 19j | b/c | 8b6738a + 2cbacba | 0 race × 2 | 天然分离 |

**累计 6 commits 全 0 race / 0 误纳** — 治理升级稳定有效

**Codex 升级建议**：
- 续 Sprint 任务边界天然分离仍是关键因素（19h-19j 实测）
- **当双子代理改同模块（如同改 Application/）时验证条件未达** — 续 Sprint 评估"同源文件锁定约束"必要性
- **建议 19k 起评估** [P0] 强制 → [P1] 高优先级降级（6 Sprint 0 race 历史足够说服力）

**Codex 0 顺延 P2 连续记录调整**：
- 12a-19i 16 Sprint（13 完整 + 2 闭环 + 1 部分顺延 19h→19i 闭环）
- **19j**: 3 P2 全当 Sprint 修（V0.3 §六.2/§六.4/§六.5 + 6 AppService xmldoc + codex_review_hook V1.2）
- **累计 17 Sprint 中 14 Sprint 完整 0 P2 顺延 / 2 闭环 / 0 部分顺延（19j 0 P2 顺延）**

新表述："**0 关键 P2 顺延 14 Sprint + 19b vendor 闭环 + 19g/19h 强绑定闭环（19h 自闭环）+ 19j A 级评审 P2 全修**"

---

## 十、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — A2' 9 次顺延红线 cici 必决策（重启 / 撤架 / 继续顺延极高风险）+ 3 路径方案（A NC 反馈 / B 撤架转 6 endpoint / C 撤架转 UI-3）+ 23 累计技术债 + cici 19j 启动前 3 决策点 |
| V0.2 | 2026-05-15 | cici AskUserQuestion 必决策"路径 B 正式撤架 A2' + 6 endpoint" — A2' 9 次顺延 5 月历史性决策；主轨 6 endpoint 归属 + 副轨 CI/CD secrets + A2' 撤架文档化 3.8-4.3 PD；§六 A2' 撤架决策记录 + §七 17a-19i 资产保留清单 + §八 撤后续重启 5 步路径 |
| **V0.3** | **2026-05-15** | **Codex 19j 评审完成 A 级 + 3 P2 当 Sprint 全修** — §六.2 cici 撤架理由量化指标 + §六.4 6 endpoint mock → real L1/L2/L3 改动范围分级 + §六.5 5 步重启路径前置条件 + Fallback 方案；§九 Codex 19j Finding 附录（A 级 / 0 P1 + 3 P2 当 Sprint 修 / 3 P3 顺延 19k / A2' 撤架风险评估 / 双子代理 0 race 第 6 次反向验证 / 升级建议 [P0] → [P1]）；累计 P2 记录调整 — 17 Sprint 14 完整 + 2 闭环 |
