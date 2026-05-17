# Sprint 20r 任务卡 V0.2（2026-05-18 cici 5 决策全 default 拍板 / 第 4 周期第 3 个 sprint / 审批协调 + NC 真联调启动双重性质 / 待 Sprint 20q 收口后启动 Day 1）

**Sprint**：20r（第 4 周期第 3 个 sprint / 第 2 阶段开局 / 紧续 20q 合同协调 sprint）
**主题**：审批模块试点验证（采购+合同+出库 三类接入）+ **NC 真联调启动（UseMock=false 切换 / D 线从顺延状态升级激活）** + 试点 demo（业务方 walk-through）
**节奏**：协调 sprint + NC 升级 sprint 双重性质（vs Sprint 20p/20q 纯协调）/ 工作量 ~1.3 PD（vs roadmap §2.3 估 2.1 PD / 省 0.8 PD）
**性质**：**协调 + NC 升级双重 sprint**（roadmap V0.1 §2.3 假设"从零设计审批引擎 0.6 PD"已被 grep 实证撤销 / V0.2 修正为"审批引擎已在仓 + 3 类业务接入 + NC 真联调激活"）

**V0.1 起草要点**（待 Sprint 20q 收口后 cici 拍板 V0.2）：

- **重大发现（grep 验证 / 不要相信 roadmap §2.3）**：
  * Domain/Approvals: `ApprovalInstance.cs` + `ApprovalInstanceManager.cs` + `ApprovalInstanceStates.cs` + `IApprovalConditionEvaluator.cs` 全在仓
  * Domain/Workflows: `WorkflowTemplate.cs` + `WorkflowTemplateDataSeedContributor.cs` + `WorkflowTemplateStatuses.cs` 全在仓
  * Application/Approvals: `ApprovalAppService.cs` + `LocalEventBusApprovalCompletedNotifier.cs`（ApprovalCompletedEvent 19r D2 已接通）+ `NCalcApprovalConditionEvaluator.cs` 全在仓
  * Contracts/Approvals: `IApprovalAppService.cs` + `ApprovalDtos.cs` 全在仓
  * HttpApi/Controllers/Approvals: `ApprovalsController.cs` 在
  * Web/Pages/SupplyCores/ApprovalCenter: `Index.cshtml` + `Index.cshtml.cs` 在
  * **审批引擎从零设计撤销** / 引擎已 production-ready / Sprint 20r 工作为 3 类业务接入 + 试点验证 + NC 真联调激活
- NC 现状（grep 实证）：`NcInterface:UseMock = true`（appsettings.json L112）/ DI 注册 mock-or-real 决策 `NcInterfaceHttpClient.cs` + `NcInterfaceMockClient.cs` + `NcOAuth2TokenService.cs` + `NcOAuth2CachedToken.cs` + `InterfaceHealthCheckService.cs` + `InterfaceMonitorAppService.cs` + `InterfaceReceiptAppService.cs` + `PeriodReverseAppService.cs` 全在仓 / 14a-19q 单边架构 production-ready / Polly 三层 + WireMock chaos + OAuth2 client_credentials 5 要点 + Health snapshot extended 完整 / **激活只需切 UseMock=false + cici 协调 NC 侧联调环境**

---

## 一、前置事实（待 Sprint 20q 收口后回填 / Sprint 20p+20q 复盘）

### 1.1 Sprint 20q 待收口

| Task | 主要交付 | 状态 |
|---|---|---|
| T-A1-A5 | 合同协调 + 关联完整性 + 试点 demo + roadmap V0.2 §2.2 修正 / Codex 收敛 | ⏳ 待 Sprint 20q V0.2 拍板 |

### 1.2 Sprint 20q 真正收口数字（待回填）

| 维度 | 数字 / 状态 |
|---|---|
| main 主代理 commits | TBD（Sprint 20q 收口后）|
| Codex 评审 | TBD / 目标连续 0 finding 收敛 |
| **45 Sprint 0 顺延** | **目标维持**（20p done = 44 / 20q done = 45）|
| 累计 Codex 轮 | TBD（20q 收口后回填）|
| 关键 commit | TBD |

### 1.3 审批 + 工作流引擎 grep 实证（来源本 Sprint V0.1 起草时验证 / 关键决策依据）

**审批引擎 + 工作流基础已 production-ready（19r D2 + 累积实施）**：

| 模块 | 实体清单 | 状态 |
|---|---|---|
| Domain/Approvals | ApprovalInstance + Manager + States + IApprovalConditionEvaluator | ✅ 全在仓 |
| Domain/Workflows | WorkflowTemplate + DataSeedContributor + Statuses | ✅ 全在仓 |
| Application/Approvals | ApprovalAppService + LocalEventBusApprovalCompletedNotifier + NCalcApprovalConditionEvaluator | ✅ 全在仓 |
| Contracts/Approvals | IApprovalAppService + ApprovalDtos | ✅ 全在仓 |
| HttpApi | ApprovalsController | ✅ 在仓 |
| Web | ApprovalCenter/Index page | ✅ 在仓 |
| ApprovalCompletedEvent | LocalEventBus 集成 / 19r D2 已接通 / Approved 终态触发凭证生成 | ✅ 在仓 |
| frontend | approval-center page | ✅ 在仓（Sprint 20o T-A2 确认）|

**3 类业务接入审批 grep 结果**：
- ProcurementDocument / Contracts / MaterialIssuances / SparePartIssuances 等 4 业务 AppService 目前**未见**直接引用 `WorkflowTemplate` / `ApprovalInstance` / `StartApproval` / `CreateApproval` / `IApprovalRequestable`（Sprint 20r T-A2 关键任务）
- 仅 ApprovalAppService 本身 + LocalEventBusApprovalCompletedNotifier 通过 LocalEventBus 反向通知业务模块（凭证生成路径）
- **缺口**：3 类业务正向触发审批的 interface（IApprovalRequestable 等）尚未抽象 / 业务状态机与 ApprovalInstance 集成尚未实施

**结论**：Sprint 20r 主要工作 = 3 类业务接入审批 + 试点验证 + NC 真联调激活 / **审批引擎从零设计撤销** / 工作量 2.1 → 1.3 PD（省 0.8 PD）。

### 1.4 NC 单边架构 grep 实证（来源 Sprint 14a-19q 累积 / Sprint 20r T-A3 激活前提）

**NC 单边架构（17a-19q 累积）production-ready**：

| 模块 | 实体清单 | 状态 |
|---|---|---|
| Application/Interfaces | NcInterfaceOptions + NcInterfaceMockClient + NcInterfaceHttpClient | ✅ 全在仓 |
| OAuth2 | NcOAuth2TokenService + NcOAuth2CachedToken（single-flight + RefreshBuffer + 401 retry）| ✅ 全在仓（[[oauth2-client-credentials-pattern]]）|
| Health | InterfaceHealthCheckService + InterfaceMonitorAppService + InterfaceReceiptAppService | ✅ 全在仓 |
| 月结反结 | PeriodReverseAppService | ✅ 全在仓 |
| Domain/Interfaces | INcInterfaceClient | ✅ 全在仓 |
| Contracts | InterfaceMonitorDtos | ✅ 全在仓 |
| 配置 | `appsettings.json:112` UseMock=true（默认）| ⚠️ 待 cici 切 false |
| 测试 | Sprint 16a Biz005A + 17a OAuth2 + WireMock chaos + Sprint 18a A4/A5 + Sprint 18b A2_5 / 累计 9+ 集成测试 | ✅ 全在仓 |

**结论**：NC 真联调 production-ready / 激活只需 ① cici 改 `appsettings.Production.json` UseMock=false + BaseUrl + Authentication.TokenStub 真值 ② cici 协调 NC 侧联调环境（业务方 G-12 推进 + NC 侧网络 / 凭证联通双触发）/ Sprint 20r T-A3 关键 task。

---

## 二、Sprint 20r Task 清单（A 主轨 5 task / 总 ~1.3 PD）

### A 主轨（main 主代理 / 协调 + NC 升级双重 sprint / 共 5 task / 1.3 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** Approvals + Workflows 完整流程 grep 验证 | 0.2 | P0 | main 主代理 a | grep 验证：① ApprovalInstanceManager 状态机 + States 流转（pending/approved/rejected/withdrawn 等）② WorkflowTemplate 数据 seed 覆盖度（采购+合同+出库 三类模板是否在 DataSeedContributor）③ ApprovalAppService CRUD + start/approve/reject endpoint ④ NCalcApprovalConditionEvaluator 表达式覆盖 ⑤ ApprovalCompletedEvent → 业务模块反向通知链 / 写到 `docs/internal/sprint-20r-approval-engine-validation.md` | Sprint 20q 收口 + grep 入仓现状 | 验证报告 ≥ 80 行 / 含 5 维度 grep 结果 + 引擎能力清单 |
| **T-A2** 3 类业务接入审批 grep + 接入点设计 | 0.3 | P0 | main 主代理 a | grep cross-aggregate：① 采购（ProcurementDocument / PurchaseTask）状态机审批触发点 ② 合同（Contracts / ContractChanges / ContractNegotiations）审批触发点 ③ 出库（MaterialIssuances / SparePartIssuances）审批触发点 ④ IApprovalRequestable interface 设计（抽象 4 业务触发审批的统一契约 / 复用 LocalEventBus 模式）⑤ 业务状态机与 ApprovalInstance 状态映射表 / 写到 `docs/internal/sprint-20r-approval-business-integration.md` | T-A1 done | 验证报告 ≥ 100 行 / 含 3 业务 grep 结果 + interface 设计草案 + 状态映射表 + 缺口清单 |
| **T-A3** NC 真联调启动（D 线升级激活）| 0.4 | P0 | main 主代理 a + cici 协调 | ① cici 协调 NC 侧联调环境（业务方 G-12 推进 + NC 侧网络 / 凭证联通双触发）② `appsettings.Production.json` UseMock=true → false 切换 + BaseUrl 真值 + Authentication.TokenStub 真值 ③ OAuth2 client_credentials 真验证（[[oauth2-client-credentials-pattern]] 5 要点复用 / single-flight + RefreshBuffer + 401 retry + Token 状态暴露 + chaos）④ 5 接口分批切真验证（凭证导出 / 凭证查询 / 科目映射 / 反结 / 月结）/ 优先切凭证导出 + 凭证查询 2 接口 ⑤ WireMock chaos 5 场景与真接对照测 ⑥ Polly 三层重试实战监控（retry / 熔断 / Timeout）+ Hangfire 任务监控 / 失败回退 UseMock=true / 写到 `docs/internal/sprint-20r-nc-real-integration-activation.md` | T-A1 + T-A2 done + cici Q1 决策（双触发 vs 不等触发）| 接通报告 ≥ 120 行 / 含切换前/后对照 + OAuth2 真验证日志 + Polly 三层监控数据 + chaos 实战 |
| **T-A4** 审批 + NC 真联调试点 demo | 0.2 | P0 | main 主代理 a + cici 协调 | ① 审批 + NC 真联调业务方 walk-through page（类 Sprint 20n T-E4 pilot-demo 模式 / 7 步引导：业务发起 → 审批分级 → 审批通过 → 凭证生成 → NC 真推送 → NC 真号回写 → 业务闭环）② demo checklist（审批 5 步 + NC 真接通 7 步）③ cici 协调财务（李建颖）+ 物资（汤云龙）双业务方走 demo / 反馈收集窗口 ④ 写到 `docs/internal/sprint-20r-approval-nc-demo-checklist.md` | T-A1 + T-A2 + T-A3 done | demo page 可访问 / checklist 12+ 步 / 双业务方反馈窗口启动 |
| **T-A5** Codex + V0.x 升版 + memory + **roadmap V0.1 → V0.2 §2.3 修正** | 0.2 | P0 | main 主代理 a | 标准收尾 + **roadmap V0.1 → V0.2 §2.3 修正**：① §2.3 Sprint 20r 性质从"审批工作流引擎从零设计 0.6 PD"→"审批引擎已在仓 + 3 类业务接入 + NC 真联调激活" / ② 工作量 2.1 → 1.3 PD / ③ 添加 Sprint 20r T-A1+T-A2 grep 重大发现章节（Approvals + Workflows 全在仓 / IApprovalRequestable 待抽象）/ ④ §六 决策 #7 审批工作流引擎选型移除（已在仓 / NCalcConditionEvaluator 已选）/ Sprint 20r 任务卡 V0.x 升版 / memory 升级（46 Sprint 0 顺延 + Sprint 20r 协调 + NC 升级双重完整闭环）| Sprint 20r T-A1-A4 全 commit 完成 | Codex 0 顺延 / V0.x 锁版 / roadmap V0.2 §2.3 修正 done / memory commit |

**main 总：~1.3 PD**（vs roadmap §2.3 估 2.1 PD / 审批引擎从零设计撤销后省 0.8 PD）

### E 副轨（second 主代理 e / 条件性 / cici Q5 拍板后启动 / 共 3 task / 0.5 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** 审批 page 待办列表 + 操作 + 历史 timeline polish | 0.2 | pending | DevExtreme DataGrid 待办 + 操作面板（通过 / 驳回 / 转办）+ Timeline 历史 / 试点反馈优化 |
| **T-E2** NC 真联调监控 dashboard | 0.2 | pending | 接口调用次数 / 错误率 / Token 状态 / Polly chaos 实战 / 复用 Sprint 19s+20i Reports/Dashboards 基础 |
| **T-E3** e2e spec 补 | 0.1 | pending | approval + nc-interface spec 补 / 类 Sprint 19q E2E-SMOKE 模板 |

### D 顺延说明

- ~~NC 真联调主推（5 接口实测）~~：**Sprint 20s 第 4 周期第 2 阶段主推（20r 仅启动 + 2 接口先切真）**
- ~~审批闭环（驳回 / 撤销 / 审批历史）~~：**Sprint 20s 主推（20r 仅接入 3 类业务 + 引擎 grep 验证）**

---

## 三、关键节奏

### 3.1 Sprint 20r 性质（NC 升级 + 协调双重 / vs Sprint 20p/20q 纯协调对比）

| 维度 | Sprint 20p/20q（纯协调）| **Sprint 20r（协调 + NC 升级双重）** |
|---|---|---|
| 主轨任务数 | 5（A1-A5）| 5（A1-A5）|
| 主轨总 PD | ~1.2 | ~1.3（含 NC 激活 +0.1）|
| 验证范围 | 1 模块（采购 / 合同）| 审批 + NC 双重（4 业务 + 5 接口）|
| NC 状态 | 顺延 | **真联调激活（D 线升级）** |
| cici 协调强度 | 试点扩大（白音华煤矿）| **NC 侧联调环境 + G-12 业务方推进双触发** |
| 业务方协调依赖 | 高（试点反馈）| 高（NC demo 双业务方 + cici 单点 + 网络 / 凭证联通）|
| 主轴战略 | 采购 / 合同试点 | **审批接入 + D 线激活第一步** |
| 子代理 | 1-2（grep + 验证报告 spawn）| 1-2（grep + NC 切真分批 spawn）|

### 3.2 wall-clock 估算

- main 主轨：2-3 天（NC 真联调激活 +1 天 / 取决于 cici 协调 NC 侧联调环境）
  * Day 1：T-A1（0.2 PD / 审批引擎 grep）+ T-A2（0.3 PD / 3 业务接入 grep + interface 设计）
  * Day 2：T-A3（0.4 PD / NC 真联调激活 / 优先 2 接口切真 / OAuth2 真验证 / cici 协调 NC 侧联调环境）
  * Day 3：T-A4（0.2 PD / 审批 + NC demo prep / 双业务方协调）+ T-A5（0.2 PD / Codex + roadmap V0.2 §2.3 修正）
- NC 真联调激活：依赖 cici 协调 NC 侧（不确定 / 5 月反模式 NC 9 次顺延历史 / 缺一不可）+ 业务方 G-12 推进（不确定 / part 2 试点反馈持续陆续到位）
- part 2 协调：3-4 周持续（与 Sprint 20p+20q+20s 部分并行）

### 3.3 第 4 周期第 2 阶段开局节奏

| Sprint | 性质 | 工作量 | 备注 |
|---|---|---|---|
| Sprint 20p（已 done）| 采购协调 | 1.2 PD | 44 Sprint 0 顺延 |
| Sprint 20q（待 done）| 合同协调 | 待 V0.2 | 45 Sprint 0 顺延（目标）|
| **Sprint 20r（本）** | **审批协调 + NC 升级双重** | **1.3 PD** | **第 2 阶段开局 / D 线激活第一步 / 46 Sprint 0 顺延（目标）** |
| Sprint 20s | NC 真联调主推 + 审批闭环 | roadmap V0.1 估 ~2.1 PD | D 线 5 接口实测 / 审批驳回撤销 / runbook V0.3 |
| Sprint 20t | 第 4 周期收尾 + Q3 末 production deployment | ~2.2 PD | 硬截止 deadline |

---

## 四、关键决策点（cici V0.1→V0.2 待拍板）

| # | 决策 | 选项 | 推荐 | **cici 拍板** |
|---|---|---|---|---|
| **Q1** | Sprint 20r 启动条件 | A. NC 联调环境到位即启动（窄触发）/ B. G-12 业务方 + NC 联调环境双触发（缺一不可 / 严格触发）/ C. 不等触发 / 先做审批协调 / NC 顺延 Sprint 20s | **B 默认**（roadmap V0.1 §六 决策 #5 一致 / Sprint 20r T-A3 关键 task 缺一不可 / 5 月反模式 NC 9 次顺延历史 / 触发回退到审批协调单一性质即可）| ✅ **B 拍板**（cici 2026-05-18 / NC 双触发 / G-12 + NC 联调环境缺一不可 / 触发回退到审批协调单一性质）|
| **Q2** | 审批引擎选型确认（grep 已实证）| A. 沿用现有 Workflows + Approvals（NCalcApprovalConditionEvaluator）/ B. 升级或换 Workflow Core / Elsa / C. 重新评估 | **A 默认**（grep 实证已 production-ready / [[main_orchestrator_default_spawn]] 不做范围外扩展 / Sprint 20r T-A2 仅接入 3 业务 + interface 抽象）| ✅ **A 拍板**（cici 2026-05-18 / 沿用现有 Workflows + Approvals + NCalcApprovalConditionEvaluator / production-ready 不做范围外扩展）|
| **Q3** | NC 真联调启动失败回退策略 | A. UseMock=true 一键回退（快速止损）/ B. 部分切真（仅 1-2 接口 / 凭证导出 + 凭证查询）/ C. 推迟 Sprint 20s（不强求 20r 激活）| **B 默认**（凭证导出 + 凭证查询 2 接口为最低验证集 / 其它 3 接口 Sprint 20s 主推 / A 作为最坏情况兜底）| ✅ **A 拍板**（cici 2026-05-18 / UseMock=true 一键回退兜底 / 快速止损 / B 部分切真作为下一步推进）|
| **Q4** | T-A4 NC + 审批双业务方 demo 协调 | A. cici 联系财务（李建颖）+ 物资（汤云龙）双业务方同步 demo / B. 等 NC 真联调 + 审批 3 业务接入稳定后再 demo / C. 同期但分两次（先审批 demo + 后 NC demo）| **A 默认**（[[po-meeting-2026-05-16-nc-voucher-export]] 2 业务方对接人已明确 / demo 反馈窗口稳定 / 同步 demo 节省 cici 协调成本）| ✅ **A 拍板**（cici 2026-05-18 / cici 联系财务李建颖 + 物资汤云龙双业务方同步 demo / demo 反馈窗口稳定）|
| **Q5** | second e 副轨范围 | A. T-E1+T-E2+T-E3 全（0.5 PD / 13 次连续 / 模块切到审批 + NC dashboard）/ B. 仅 T-E1 polish（0.2 PD / 简化）/ C. 暂停（类 Sprint 20o）| **A 默认**（审批 page polish + NC 监控 dashboard 真正影响试点验证 + NC 激活监控 / second e 第 13 次连续 / 模块切换成本可接受）| ✅ **A 拍板**（cici 2026-05-18 / second e T-E1+T-E2+T-E3 全启动 0.5 PD / 模块切到审批 + NC dashboard / 第 13 次连续）|

---

## 五、风险与依赖

### 5.1 高风险

- **NC 侧联调环境延误（cici 单点）**：业务方 G-12 后续推进 + NC 侧联调环境双触发 / 5 月反模式 NC 9 次顺延历史 / NC 侧环境可能延误数周 / cici 协调负载显著增加
  * **缓解**：T-A3 文档 ≥ 120 行明确切换前/后对照 + OAuth2 真验证日志 + Polly 监控 / Q3 B 回退策略 / Sprint 20s 主推可顺延
- **G-12 业务方推进延误（5 月反模式根因 #1 cici 单点保留）**：业务方协调持续依赖 cici
  * **缓解**：roadmap V0.1 §六 决策 #5 双触发缺一不可 / Q1 B 严格触发 / 不强求 20r 激活 / Sprint 20s 主推
- **NC 真联调失败回退（Q3 决策）**：UseMock=true 一键回退或部分切真
  * **缓解**：分批切真（凭证导出 + 凭证查询 2 接口先 / 其它 3 接口 Sprint 20s 主推）/ Polly 三层 + chaos 5 场景已实测 / Hangfire 任务监控

### 5.2 中风险

- **3 类业务接入审批状态机互斥**：采购 / 合同 / 出库 状态机与 ApprovalInstance 状态映射可能冲突
  * **缓解**：T-A2 状态映射表 + 缺口清单 / IApprovalRequestable interface 抽象 / Sprint 20s 闭环（驳回 / 撤销）主推
- **审批引擎集成复杂度（业务侧）**：业务 AppService 接入 IApprovalRequestable 改动面可能扩散
  * **缓解**：T-A2 grep 缺口清单 / 优先 1 业务（推荐采购）pilot 接入 / 2 业务（合同 + 出库）Sprint 20s 续推

### 5.3 低风险

- **Approvals + Workflows 基础在仓**（grep 已实证）
- **NC OAuth2 + Polly + WireMock chaos 已实测**（17a-19q 累积 / [[oauth2-client-credentials-pattern]] 5 要点模式）
- **grep 验证模式成熟**（[[carryover-task-verify-first]] / 顺延 task D1 必先 grep / curl / 实测）

### 5.4 主要依赖

- Sprint 20p+20q 完整收口（前置）
- Sprint 20n+20p+20q part 2 试点反馈持续到位（不阻塞 Sprint 20r / 与 Sprint 20r 并行）
- cici 拍板 5 决策点（Q1-Q5）
- cici 协调 NC 侧联调环境 + 业务方 G-12 推进（双触发 / 缺一不可 / Q1）
- cici 协调财务（李建颖）+ 物资（汤云龙）双业务方 demo（T-A4 / Q4）

---

## 六、对外汇报口径

> Sprint 20r 第 4 周期第 3 个 sprint / 第 2 阶段开局 / 协调 + NC 升级双重性质：审批模块 3 类业务接入（采购+合同+出库）+ **NC 真联调启动（UseMock=false 切换 / D 线从顺延状态正式激活）** + 试点 demo（双业务方 walk-through）/ 46 Sprint 0 顺延维持目标。审批引擎 + Workflows 模块 grep 实证已 production-ready（[[main_orchestrator_default_spawn]] 不做范围外扩展）/ NC 单边架构（17a-19q 累积）激活只需 cici 协调 NC 侧联调环境 + G-12 业务方推进双触发。roadmap V0.1 §2.3 假设"从零设计审批引擎 0.6 PD"撤销 / T-A5 同步修正 V0.2 §2.3（2.1 → 1.3 PD）。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.2 | 2026-05-18 | **cici 5 决策全 default 拍板**：Q1 B（NC 双触发 / G-12 + NC 联调环境缺一不可）/ Q2 A（沿用现有 Workflows + Approvals + NCalcApprovalConditionEvaluator）/ Q3 A（UseMock=true 一键回退兜底 / 快速止损 / B 部分切真作为下一步推进）/ Q4 A（cici 联系财务李建颖 + 物资汤云龙双业务方同步 demo）/ Q5 A（second e T-E1+T-E2+T-E3 全启动 0.5 PD / 第 13 次连续 / 模块切到审批 + NC dashboard）/ 主要工作维持 V0.1 5 task 1.3 PD |
| V0.1 | 2026-05-17（待 Sprint 20q 收口后 / 紧续 20p+20q 协调 sprint）| main a 起草 / 协调 + NC 升级双重性质 / 5 task ~1.3 PD（vs roadmap §2.3 估 2.1 PD 省 0.8）/ 重大发现：Approvals + Workflows + NCalcConditionEvaluator + ApprovalCompletedEvent + ApprovalsController + ApprovalCenter page 全在仓（Domain + Application + Contracts + HttpApi + Web）/ 3 类业务接入 grep 缺口（采购 + 合同 + 出库 未直接引用 ApprovalInstance / WorkflowTemplate / IApprovalRequestable 待抽象）/ NC 单边架构 production-ready / UseMock=true 默认（appsettings L112）/ OAuth2 + Polly + WireMock chaos + Health snapshot 全在仓 / **审批引擎从零设计撤销** / 5 开放问题待 Sprint 20q 收口后 cici V0.2 答（Q1 NC 启动双触发 / Q2 引擎选型 / Q3 失败回退 / Q4 双业务方 demo / Q5 second 副轨范围）/ T-A5 含 roadmap V0.1 → V0.2 §2.3 修正提示 + §六 决策 #7 引擎选型移除 |

---

**Created**: 2026-05-17 / Sprint 20p+20q 收口前 → 20r V0.1 起草（提前起草 / 待 Sprint 20q 收口后 cici 拍板 V0.2）/ main 主代理 a

**Related**:
- [`Sprint-20p-任务卡-V0.2.md`](Sprint-20p-任务卡-V0.2.md)（同 cycle 前序 / V0.2 cici 5 决策全默认 / 协调 sprint 模板）
- [`Sprint-20q-任务卡-V0.x.md`]（待 Sprint 20q V0.x 收口后回填 / 合同协调 sprint）
- [`../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md`](../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md) V0.1 §2.3（待 Sprint 20r T-A5 修正 V0.2 §2.3）
- [`../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md`](../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md) V0.1（第 3 批准入评估 / Approvals + Workflows 全在仓引用源）
- [`../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md`](../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md) V0.1（第 3 周期复盘）
- [[nc-interface-unilateral-json-strategy]]（NC 单边架构 17a-19q 累积 / Sprint 20r T-A3 激活前提）
- [[po-meeting-2026-05-16-nc-voucher-export]]（PO 决策 NC 顺延 / 双业务方对接人明确 / 第 4 周期 D 线激活触发）
- [[oauth2-client-credentials-pattern]]（NC OAuth2 5 要点模式 / Sprint 20r T-A3 复用）
- [[feedback_codex_0_carryover_8_sprint_record]]（46 Sprint 0 顺延记录 / 目标 47 Sprint）
- [[main_orchestrator_default_spawn]]（main 编排者新规则 / Sprint 20r 子代理 1-2 spawn）
- [[carryover_task_verify_first]]（顺延 task D1 必先 grep / curl / 实测 / Sprint 20r T-A1+T-A2 grep 验证模式）
- [[feedback_business_party_coordination_failure]]（5 月反模式根因 #1 cici 单点仍保留 / 第 4 周期监测 / NC 真联调激活前置 cici 协调）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 + 第 4 周期业务模块扩大）
- [[feedback_sprint20n_wave1_complete]]（协调 sprint 模板参考 / 业务方 walk-through 模式）
