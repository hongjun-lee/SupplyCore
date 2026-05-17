# Sprint 20q 任务卡 V0.2（2026-05-18 cici 5 决策全 default 拍板 / 待 Sprint 20p 收口后启动 / 第 4 周期第 2 个 sprint / 协调 + 试点验证 + UI 完善 sprint）

**Sprint**：20q（紧续 20p 收口 → 第 4 周期 5 Sprint 第 2 阶段 / 合同模块协调试点）
**主题**：Contracts 试点验证 + Contract ↔ ProcurementDocument ↔ Tender ↔ Approval 关联完整性 grep + Contract ↔ NC 凭证关联预留 + 第 3 批 4 模块 production-ready **中间点验证**（数据治理 + 库存 + 采购 + 合同）+ UI 完善
**节奏**：roadmap V0.1 §2.2 撤销「合同 entity 从零开发」/ V0.2 修正为「协调 + 试点验证 + UI 完善 + 中间点验证 sprint」/ 工作量 ~1.3 PD（vs roadmap §2.2 估 2.1 PD / 省 0.8 PD / 中间点验证 +0.1）
**性质**：**协调 + 试点验证 + 第 3 批 4 模块 production-ready 中间点验证 sprint**（类 Sprint 20n + Sprint 20p 模式 / vs 开发 sprint 20l-20m / vs 收尾 sprint 20o）
**V0.1 起草要点**（main a grep 实测）：
- **重大发现（grep 验证）**：Contracts 6 子模块 entity + Manager + AppService（315 行 / 14 个状态机方法 / 含 bond 全生命周期）+ Controller（14+ endpoint）全在仓 / frontend `pages/contract` 仅 App.tsx + main.tsx 壳（UI 待完善）/ **不需从零开发 entity / 后端 production-ready**
- 主要工作：① Contracts 完整流程 grep + 试点验证 ② cross-aggregate 关联完整性（Contract↔ProcurementDocument↔Tender↔Approval）③ Contract↔NC 凭证关联预留 grep ④ **第 3 批 4 模块中间点验证**（数据治理+库存+采购+合同 demo 串联）⑤ 试点扩大第 2 批协调（Sprint 20p 白音华之后）⑥ UI 完善（contract frontend page 实施）
- roadmap V0.1 §2.2 撤销 / T-A5 同步修正 roadmap V0.x → V0.x+1（§2.2 撤销「从零开发」+ 添加 grep 重大发现章节 + Sprint 20q 性质修正）

---

## 一、Sprint 20p 收尾（前置事实 / commits 链 / 待 Sprint 20p 真正收口后回填）

### 1.1 Sprint 20p 5 task 全 done（待 Sprint 20p V0.x 真正收口后回填）

| Task | 主要交付 | 状态 |
|---|---|---|
| T-A1 | ProcurementDocument 完整流程 grep + 试点验证报告 | ⏳ pending（Sprint 20p Day 1）|
| T-A2 | ProcurementDocument↔Tender↔Contract↔Approval 关联完整性 grep | ⏳ pending（Sprint 20p Day 1）|
| T-A3 | 试点单位扩大白音华煤矿协调 + OrgCode | ⏳ pending（cici 协调 / wall-clock 3-4 周）|
| T-A4 | 试点 demo prep + UI polish（main + second e）| ⏳ pending（Sprint 20p Day 2）|
| T-A5 | Codex + V0.x 升版 + memory + **roadmap V0.x §2.1+§2.2 修正** | ⏳ pending（Sprint 20p Day 2）|

### 1.2 Sprint 20p 真正收口数字（待 Sprint 20p 收口后回填）

| 维度 | 目标 / 状态 |
|---|---|
| main 主代理 commits | 目标 ~7+ |
| Codex 评审 | 目标 ≥ 2 轮 / 0 finding 收敛保留 |
| **44 Sprint 0 顺延** | **目标维持 ✅**（待 Sprint 20p 收口达成）|
| 关键 commit | 待 Sprint 20p V0.x push 后回填 |

### 1.3 Contracts entity grep 重大发现（来源 Sprint 20q V0.1 起草实测）

**Contracts 6 子模块代码侧基础已全在仓 production-ready**（19q-20j 累积实施）：

| 模块 | 实体 / 服务清单 | 状态 |
|---|---|---|
| Contracts | Contract.cs + ContractBondStates.cs + ContractManager.cs + ContractStates.cs（Domain）/ ContractAppService.cs 315 行 + ContractFromNegotiationLinkage.cs + ContractMappers.cs（Application）/ ContractDto + CreateContractDto + IContractAppService + IContractFromNegotiationLinkage（Contracts）/ ContractsController.cs 14+ endpoint（HttpApi）| ✅ 全在仓 |
| ContractChanges | ContractChange + ContractChangeManager + ContractChangeStates（Domain）+ Application + Contracts + Controller | ✅ 全在仓 |
| ContractNegotiations | ContractNegotiation + ContractNegotiationManager + ContractNegotiationStates（Domain）+ Application + Contracts + Controller | ✅ 全在仓 |
| ContractPaymentNodes | ContractPaymentNode + ContractPaymentNodeManager + ContractPaymentNodeStates（Domain）+ Application + Contracts + Controller | ✅ 全在仓 |
| ContractTerminations | ContractTermination + ContractTerminationManager + ContractTerminationStates（Domain）+ Application + Contracts + Controller | ✅ 全在仓 |
| ContractClauses | ContractClause（Domain）| ✅ 全在仓（条款库）|

**ContractAppService 状态机方法（14 个 / 实测 grep）**：
- 基础：GetAsync / GetListAsync / CreateAsync
- 流转：SubmitAsync / ApproveAsync / RejectAsync / StartExecutionAsync / CompleteAsync / TerminateAsync / VoidAsync
- 保证金 bond 全生命周期：PayBondAsync / ReleaseBondAsync / ForfeitBondAsync
- 超限：ApproveOverlimitAsync

**ContractsController endpoint**（14+ 个 / 实测 grep）：
- Route: `api/supply-cores/contracts`
- GET: `{id}` / list
- POST: `/` / `/{id}/submit` / `/{id}/approve` / `/{id}/reject` / `/{id}/start-execution` / `/{id}/complete` / `/{id}/terminate` / `/{id}/void` / `/{id}/pay-bond` / `/{id}/release-bond` / `/{id}/forfeit-bond` 等

**frontend `pages/contract` 实测**：
- 仅 `App.tsx` + `main.tsx` 两个壳文件
- **缺**：列表 / 详情 / 创建表单 / 状态显示 / 关联视图（采购单 + Tender 链路）→ second e T-E1 主要工作

**结论**：Contracts 6 子模块后端 production-ready（含 bond 全生命周期罕见地齐全）/ **不需从零开发 entity** / Sprint 20q 主要为：① 后端 grep 验证 + 试点 ② cross-aggregate 关联完整性 ③ frontend UI 完善（Contract list/detail/form/关联视图）④ 第 3 批 4 模块 production-ready 中间点验证。

---

## 二、Sprint 20q Task 清单（A 主轨 5 task / 总 ~1.3 PD）

### A 主轨（main 主代理 / 协调 + 试点验证 + 中间点验证 sprint / 共 5 task / 1.3 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** Contracts 完整流程 grep + 试点验证 | 0.2 | P0 | main 主代理 a | grep 验证：① Contract Entity 状态机 + ContractStates + ContractBondStates ② ContractManager 业务规则 ③ ContractAppService 14 状态机方法（submit/approve/reject/start-execution/complete/terminate/void/pay-bond/release-bond/forfeit-bond/approve-overlimit/get/list/create）④ ContractsController 14+ endpoint ⑤ 6 子模块（Changes/Negotiations/PaymentNodes/Terminations/Clauses）完整度 ⑥ 测试覆盖率 / 写到 `docs/internal/sprint-20q-contracts-validation.md` | Sprint 20p T-A1+T-A2 done | 验证报告 ≥ 100 行 / 含 grep 结果 + 14 状态机方法 checklist + 6 子模块完整度 + bond 全生命周期验证 |
| **T-A2** Contract ↔ ProcurementDocument ↔ Tender ↔ Approval 关联完整性 grep（cross-aggregate / 5 维度）| 0.3 | P0 | main 主代理 a | grep cross-aggregate：① Contract 是否引用 ProcurementDocumentId（采购单触发合同生成）② ContractFromNegotiationLinkage 招标→合同链路完整度 ③ Contract 是否串接 Approval（合同审批 / 超限审批）④ Contract↔NC 凭证关联预留（NcVoucherNo 字段 + 凭证导出 link）⑤ 状态机串联与跨模块状态触发链 / 写到 `docs/internal/sprint-20q-cross-aggregate-validation.md` | T-A1 done | 验证报告 ≥ 120 行 / 含 5 维度 grep 结果 + 关联完整性表 + 缺口清单 + NC 凭证关联预留 checklist |
| **T-A3** 第 3 批 4 模块 production-ready **中间点验证**（数据治理 + 库存 + 采购 + 合同 / 4 模块 demo 串联 + e2e）| 0.3 | P0 | main 主代理 a + cici 协调 | 4 模块串联 demo：① 数据治理（Sprint 20l-20m 6 handler）→ 试点单位数据齐备 ② 库存（Sprint 20n 4 单据 endpoint）→ 出入库流程跑通 ③ 采购（Sprint 20p ProcurementDocument）→ 采购流程跑通 ④ 合同（Sprint 20q）→ 合同审批 + bond 流转 / e2e 串联测试（数据治理 → 库存 → 采购 → 合同 完整链）/ 试点单位反馈收集 / 写到 `docs/internal/sprint-20q-batch3-mid-validation.md`（V0.1 第 4 周期中间点验收报告）| T-A1 + T-A2 done | 验证报告 ≥ 100 行 / 含 4 模块 grep checklist + 2-4 模块 demo 串联结果 + 试点反馈 + 缺口清单 |
| **T-A4** 试点单位扩大第 2 批协调（cici 协调 / Sprint 20p 白音华之后）| 0.2 | P0 | main 主代理 a + cici 协调 | cici 协调 Nova 团队同步第 2 批试点候选（如：异地厂矿 1-2 单位 / OrgCode 待 Nova 同步）+ 5 维度评分（沿用 Sprint 20o T-A2 §2.3 模板 / Sprint 20p T-A3 实例）+ 试点接口人指定 / 写到 `docs/internal/sprint-20q-pilot-expansion-batch2.md` | Sprint 20p T-A3 白音华完成且试点反馈第 1 周到位 | 文档 ≥ 60 行 / 含评分 + OrgCode + 接口人 + Sprint 20p 第 1 批反馈对比 |
| **T-A5** Codex + V0.x 升版 + memory + **roadmap V0.x → V0.x+1 修正 §2.2** | 0.3 | P0 | main 主代理 a | 标准收尾 + **roadmap §2.2 修正**：① §2.2 Sprint 20q 性质从「合同 entity 从零开发」→「协调 + 试点验证 + 中间点验证 sprint」/ ② 工作量 2.1 → 1.3 PD / ③ 添加 Sprint 20q grep 重大发现章节（Contracts 6 子模块 + 14 状态机 + bond 全生命周期已在仓 / frontend 仅壳）/ Sprint 20q 任务卡 V0.x 升版 / memory 升级（45 Sprint 0 顺延 + Sprint 20q 协调 + 中间点验证 sprint 完整闭环）| Sprint 20q T-A1-A4 全 commit 完成 | Codex 0 顺延 / V0.x 锁版 / roadmap V0.x+1 修正 done / memory commit |

**main 总：~1.3 PD**（vs roadmap §2.2 估 2.1 PD / 撤销从零开发 -0.8 PD + 中间点验证 +0.1 PD / 净省 0.8 PD）

### E 副轨（second 主代理 e / 条件性 / cici Q5 拍板后启动）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** Contract 详情视图 polish + 关联视图（采购单 + Tender 链路）| 0.3 | pending | 复用 DevExtreme DataGrid + Detail 模板 / 接通 ContractsController endpoint / **重点**：frontend 当前仅 App.tsx + main.tsx 壳 / list + detail + form + 关联视图（采购单 / Tender）一并实施 / 业务方 walk-through 关键 |
| **T-E2** 第 3 批 4 模块业务方 demo walk-through page | 0.2 | pending | 类 Sprint 20n T-E4 pilot-demo 模式 / 5-8 步引导 / 数据治理 → 库存 → 采购 → 合同 完整链路 demo / 试点单位业务方 self-service |
| **T-E3** e2e 测试补 | 0.2 | pending | contract spec 补（CRUD + 状态流转 + bond 流转）+ 关联流程 spec（procurement → contract）+ 4 模块串联 e2e（数据治理 → 库存 → 采购 → 合同）|

**second e 总：~0.7 PD**（cici Q5 决策 / 默认 A 全启动）

### D 顺延说明

- ~~D 线 NC/财务接口真联调~~：**继续顺延 20r+（第 4 周期第 2 阶段主推）/ 业务方 G-12 后续推进 + NC 侧提供联调环境双触发 / Sprint 20q T-A2 含 Contract↔NC 凭证关联预留 grep（NcVoucherNo 字段）**
- ~~T-B1-B5 Sprint 20n part 2 协调试点 + Sprint 20p part 2 采购协调~~：**与 Sprint 20q 并行 / 不阻塞 / 试点反馈陆续到位**

---

## 三、关键节奏

### 3.1 Sprint 20q 性质（vs Sprint 20n/20p 协调 sprint 对比 / 中间点验证）

| 维度 | Sprint 20n（库存协调）| Sprint 20p（采购协调）| **Sprint 20q（合同协调 + 中间点）** |
|---|---|---|---|
| 主轨任务数 | 5（A1-A5）| 5（A1-A5）| 5（A1-A5）|
| 主轨总 PD | ~1.2 | ~1.2 | **~1.3**（中间点验证 +0.1）|
| 验证范围 | 库存 4 单据 entity + Controller | ProcurementDocument 全流程 + 4 模块关联 | Contract + cross-aggregate（采购 + Tender + Approval + NC 预留）+ **第 3 批 4 模块中间点 demo 串联** |
| 业务方协调依赖 | 高（试点单位反馈）| 高（试点扩大 + part 2）| 中（试点扩大第 2 批 / Sprint 20p 第 1 批协调延续）|
| 主轴战略 | 库存试点 Wave 1 开局 | 采购试点 Wave 1 开局 | **合同试点 + 第 3 批 production-ready 中间点验收**（roadmap §1.2 关键里程碑「Sprint 20q 末 = 第 3 批 4 模块中间点」达成）|
| 子代理 | 0（main 直接做）| 1-2（grep + 验证报告 spawn）| **1-2**（T-A1+T-A2+T-A3 可并行 spawn）|
| frontend 工作量 | 中（库存 page polish）| 中（采购 page polish）| **高**（contract page 从壳实施 list+detail+form+关联）|

### 3.2 wall-clock 估算

- main 主轨：1-2 天（依据 grep + 验证报告深度 + 中间点 demo 串联）
  * Day 1：T-A1（0.2 PD / Contracts grep + 14 状态机方法验证）+ T-A2（0.3 PD / cross-aggregate 关联 grep / 可 spawn 子代理）
  * Day 2：T-A3（0.3 PD / 第 3 批 4 模块中间点验证 / demo 串联 / 可 spawn 子代理）+ T-A4（0.2 PD / cici 协调）+ T-A5（0.3 PD / Codex + roadmap V0.x+1 修正）
- part 2 协调：3-4 周持续（cici 协调第 2 批试点 + 试点反馈 + 与 Sprint 20n+20p part 2 同期）

### 3.3 第 4 周期 5 Sprint 节奏调整（含本 sprint 修正）

| Sprint | 性质 | 工作量 | 备注 |
|---|---|---|---|
| Sprint 20p | 协调 + 试点验证 + UI 完善（已修正 V0.2）| 1.2 PD | vs roadmap §2.1 估 2.0 PD / 省 0.8 PD |
| **Sprint 20q（本）** | **协调 + 试点验证 + 中间点验证 + UI 完善** | **1.3 PD** | vs roadmap §2.2 估 2.1 PD / 省 0.8 PD（中间点 +0.1）/ T-A5 修正 roadmap V0.x+1 §2.2 |
| Sprint 20r | 审批 + NC 真联调启动 | roadmap V0.1 估 ~2.1 PD | D 线激活 / 主推 / Approvals entity 已在仓 / 可能也转协调 sprint（待 Sprint 20r V0.1 grep 重评）|
| Sprint 20s | NC 真联调主推 + 审批闭环 | roadmap V0.1 估 ~2.0 PD | D 线主推 / 5 接口实测 |
| Sprint 20t | 第 4 周期收尾 + Q3 末 production deployment | ~2.2 PD | 硬截止 deadline |

### 3.4 第 3 批 4 模块中间点验证关键（T-A3 核心）

**Sprint 20q 末 = roadmap §1.2 关键里程碑「第 3 批 4 模块 production-ready 中间点验证」达成节点**：

| 模块 | 产出 sprint | 状态机覆盖 | 测试覆盖 | 试点验证 |
|---|---|---|---|---|
| 数据治理（6 handler）| Sprint 20l-20m | Parse+Validate+ApplyAsync 全 | 103/103 测试 | ⏳ Sprint 20n part 2 试点反馈持续 |
| 库存（4 单据 endpoint）| Sprint 20n | 5 controller submit/approve/reject/void/reverse/ship/receive 等 grep done | endpoint 验证 done | ⏳ Sprint 20n part 2 试点反馈 |
| 采购（ProcurementDocument 全流程）| Sprint 20p | submit/approve/reject/void grep done | T-A1+T-A2 验证 | ⏳ Sprint 20p part 2 + 白音华扩大 |
| 合同（Contracts 6 子模块）| **Sprint 20q（本）** | **14 状态机 + bond 全生命周期 grep**（T-A1）| ⏳ T-A1+T-A3 验证 | ⏳ Sprint 20q part 2 试点反馈 |
| **关联完整性** | **Sprint 20q T-A2** | **cross-aggregate 5 维度 grep**（Contract↔Procurement↔Tender↔Approval↔NC 预留）| T-A3 e2e 串联 | T-A3 demo 串联 |

---

## 四、关键决策点（cici V0.1→V0.2 待拍板 5 项）

| # | 决策 | 选项 | 推荐 | **cici 拍板** |
|---|---|---|---|---|
| **Q1** | Sprint 20q 启动时机 | A. 紧续 Sprint 20p 收口（动量延续）/ B. 间隔 1-2 天（调整 / cici 消化 Sprint 20p part 2 反馈）/ C. 等 Sprint 20n part 2 数据齐 + Sprint 20p 白音华第 1 周反馈 | **B 默认**（启动节奏调整 / 给 cici 半天消化 Sprint 20p 反馈 + Sprint 20p part 2 与 Sprint 20q 并行 / 模仿 Sprint 20p Q1 模式）| ✅ **B 拍板**（cici 2026-05-18 / 间隔 1-2 天 / 给 cici 消化 Sprint 20p part 2 反馈）|
| **Q2** | T-A3 第 3 批中间点验证深度 | A. 4 模块全 demo 串联（e2e 完整链 / 数据治理 → 库存 → 采购 → 合同）/ B. 仅 grep checklist + 2 模块 demo（精简 / 数据治理 + 合同 demo）/ C. 仅 grep（最小 / 不做 demo） | **B 默认**（精简 / 协调 sprint 不强求全 demo / 4 模块完整 e2e 串联可顺延 Sprint 20t production deployment 前再做 / Sprint 20q 仅 2 模块 demo 验证概念）| ✅ **B 拍板**（cici 2026-05-18 / grep + 2 模块 demo 数据治理 + 合同 / 4 模块完整 e2e 顺延 Sprint 20t）|
| **Q3** | 试点扩大第 2 批候选 | A. 等 Sprint 20p 白音华完成（第 1 周反馈）后再扩 / B. Sprint 20q 同期再扩 1 单位（异地厂矿）/ C. 暂不扩（等 Sprint 20p 第 1 批稳定）| **A 默认**（不并发扩大 / cici 协调负载控制 / 类 Sprint 20p Q3 A 模式 / 第 2 批等 Sprint 20p 白音华验证稳定后 Sprint 20r+ 启动）| ✅ **A 拍板**（cici 2026-05-18 / 等白音华第 1 周反馈 / cici 协调负载控制 / 第 2 批 Sprint 20r+ 启动）|
| **Q4** | T-A5 roadmap V0.x+1 §2.2 修正深度 | A. 仅 §2.2 修正（最小 / Sprint 20q 本身）/ B. §2.2+§2.3 一起修正（Approvals 也需 grep / 同 Sprint 20p Q4 B 思路）/ C. 整 §二 全修正（大幅 / 0.4 PD） | **A 默认**（§2.1 在 Sprint 20p 已修 / §2.2 本 sprint 修 / §2.3-2.5 后续 sprint 各自修 / 模仿 Sprint 20p 启动时 cici 选 B 一次修两个 sprint 的反向考虑 = §2.3 Approvals 由 Sprint 20r V0.1 起草时再 grep 重评 / 不预判）| ✅ **跳过 / roadmap V0.2 已含 §2.2 修正**（cici 2026-05-18 / Sprint 20p T-A5 已修 roadmap V0.2 含 §2.1+§2.2 双 sprint / Sprint 20q T-A5 不再单修 §2.2 / 节省 0.1 PD）|
| **Q5** | second e 副轨范围 | A. T-E1+T-E2+T-E3 全 0.7 PD（启动 / contract page 真正影响试点 / second e 第 14 次连续）/ B. 仅 T-E1 polish（0.3 PD / 简化）/ C. 暂停（类 Sprint 20o） | **A 默认**（contract frontend 仅 App.tsx + main.tsx 壳 / list+detail+form+关联视图必须实施 / second e 第 14 次连续 / 模块切到合同）| ✅ **A 拍板**（cici 2026-05-18 / second e T-E1+T-E2+T-E3 全启动 0.7 PD / contract frontend 从壳实施 list+detail+form+关联视图 / second e 第 14 次连续）|

---

## 五、风险与依赖

### 5.1 高风险

- **Sprint 20p 收尾延误**：Sprint 20q 依赖 Sprint 20p T-A1+T-A2 grep 结果（ProcurementDocument 全流程 + 关联完整性）/ Sprint 20p 任一 task 延误 → Sprint 20q 启动延后
  * **缓解**：Q1 B 默认间隔 1-2 天 / Sprint 20p 真正收口标志 = V0.x push + 44 Sprint 0 顺延达成 / 不强行紧续
- **试点扩大第 2 批协调（cici 单点）**：与 Sprint 20n + Sprint 20p part 2 协调并行 / cici 协调负载持续高 / 5 月反模式根因 #1 cici 单点仍保留
  * **缓解**：Q3 A 默认不并发扩大 / 第 2 批等 Sprint 20p 白音华验证稳定后 Sprint 20r+ 启动 / 引入 PM 角色（roadmap V0.3 §九 已注）
- **Contract↔NC 凭证关联预留可能有缺口**：T-A2 grep 验证 NcVoucherNo 字段 + 凭证导出 link 是否在仓 / 凭证模块（Sprint 19s 实施 IVoucherFileStorage）与 Contract 是否串接
  * **缓解**：T-A2 验证报告输出缺口清单 / Sprint 20r-20s NC 真联调激活时一并修补

### 5.2 中风险

- **Contract frontend 仅壳 / second e T-E1 工作量集中**：T-E1 estimated 0.3 PD / 实际可能 0.5-0.7 PD（list + detail + form + 关联视图）
  * **缓解**：Q5 A 启动 T-E1+T-E2+T-E3 / second e 主力 / 业务方反馈期内可分多 round 迭代
- **第 3 批 4 模块中间点 demo 串联工作量**：T-A3 estimated 0.3 PD / 4 模块完整链 demo 可能超出
  * **缓解**：Q2 B 默认精简 2 模块 demo / 完整 4 模块 e2e 串联顺延 Sprint 20t production deployment 前

### 5.3 低风险

- **Contracts 基础在仓**（grep 实测确认 6 子模块 + 14 状态机 + bond 全生命周期）
- **grep 验证模式成熟**（[[carryover-task-verify-first]] / Sprint 20p T-A1+T-A2 模板复用）
- **协调 sprint 模板成熟**（Sprint 20n + Sprint 20p 联合 2 次验证 / Sprint 20q 第 3 次）

### 5.4 主要依赖

- Sprint 20p 真正收口（T-A1-A5 全 done + 44 Sprint 0 顺延达成）
- Sprint 20n part 2 + Sprint 20p part 2 试点反馈持续到位（不阻塞 Sprint 20q / 与 Sprint 20q 并行）
- cici 拍板 5 决策点（Q1-Q5）
- 第 2 批试点候选 OrgCode 待 Nova 团队同步（如 Q3 选 B 同期扩）

---

## 六、对外汇报口径

> Sprint 20q 第 4 周期第 1 阶段第 2 sprint：Contracts 试点验证 + cross-aggregate 关联完整性 grep（采购 + Tender + Approval + NC 凭证预留）+ **第 3 批 4 模块 production-ready 中间点验证**（数据治理 + 库存 + 采购 + 合同）+ contract frontend page 完善（list+detail+form+关联视图）+ 试点扩大第 2 批协调（条件性 / cici 拍板）/ 45 Sprint 0 顺延目标。第 3 批 4 模块 production-ready **中间点验收里程碑达成**（roadmap §1.2）。roadmap V0.x §2.2 撤销「合同从零开发」转为「协调 + 试点验证 + 中间点验证 + UI 完善 sprint」/ 工作量 2.1 → 1.3 PD / T-A5 同步修正 roadmap V0.x+1。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.2 | 2026-05-18 | **cici 5 决策全 default 拍板**：Q1 B（间隔 1-2 天 / 调整启动）/ Q2 B（grep + 2 模块 demo / 数据治理 + 合同）/ Q3 A（等白音华第 1 周反馈 / cici 协调负载控制 / 第 2 批 Sprint 20r+ 启动）/ Q4 跳过（roadmap V0.2 已含 §2.2 修正 / Sprint 20p T-A5 已修 / 节省 0.1 PD）/ Q5 A（second e T-E1+T-E2+T-E3 全启动 0.7 PD / contract frontend 从壳实施）/ T-A5 §2.2 修正提示标 cici 拍板「跳过」/ 主要工作维持 V0.1 5 task 1.3 PD |
| V0.1 | 2026-05-17（紧续 Sprint 20p V0.2 起草）| main a 起草 / Sprint 20q 任务卡 / 协调 + 试点验证 + 中间点验证 sprint / 5 task ~1.3 PD（vs roadmap §2.2 估 2.1 PD 省 0.8）/ **重大发现（grep 实测）**：Contracts 6 子模块（Contracts + Changes + Negotiations + PaymentNodes + Terminations + Clauses）全在仓 / ContractAppService 315 行 14 个状态机方法（含 bond 全生命周期 PayBond/ReleaseBond/ForfeitBond）/ ContractsController 14+ endpoint（含 submit/approve/reject/start-execution/complete/terminate/void/pay-bond/release-bond/forfeit-bond/approve-overlimit）/ frontend `pages/contract` 仅 App.tsx + main.tsx 壳（list+detail+form+关联视图待实施 → second e T-E1 主力）/ **不需从零开发 entity** / 5 开放问题待 cici V0.2 答（Q1 启动时机 / Q2 第 3 批中间点验证深度 / Q3 试点扩大第 2 批 / Q4 roadmap V0.x+1 修正深度 / Q5 second e 副轨范围）/ T-A5 含 roadmap V0.x → V0.x+1 §2.2 修正提示 |

---

**Created**: 2026-05-17 / Sprint 20p V0.1 起草后顺势 Sprint 20q V0.1（双 sprint 起草连续动作）→ V0.2 待 cici 拍板 / **等 Sprint 20p 真正收口（V0.x push + 44 Sprint 0 顺延达成）后启动 Day 1** / main 主代理 a

**Related**:
- [`Sprint-20p-任务卡-V0.2.md`](Sprint-20p-任务卡-V0.2.md)（同 cycle 前序 / cici V0.2 拍板协调 sprint / 协调 sprint 模板参考 / Sprint 20q 紧续）
- [`Sprint-20n-任务卡-V0.4.md`](Sprint-20n-任务卡-V0.4.md)（最早协调 sprint 模板 / Wave 1 真正收口 / Round 14 0 finding 收敛）
- [`Sprint-20o-任务卡-V0.4.md`](Sprint-20o-任务卡-V0.4.md)（同 cycle 上游 / 43 Sprint 0 顺延达成 / T-A2 第 3 批准入评估输出）
- [`../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md`](../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md) V0.x（第 4 周期 roadmap / 待 Sprint 20q T-A5 修正 V0.x+1 §2.2）
- [`../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md`](../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md) V0.1（第 3 批准入评估 / 重大发现 10 AppService + 34 Domain 实体全在仓 / Sprint 20q grep 实测验证一致）
- [`../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md`](../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md) V0.1（第 3 周期复盘 / §八 20p+ 主轴预判）
- [[feedback_codex_0_carryover_8_sprint_record]]（44 Sprint 0 顺延记录 / 目标 47 Sprint / Sprint 20q 维持 45）
- [[main_orchestrator_default_spawn]]（main 编排者新规则 / Sprint 20q T-A1+T-A2+T-A3 子代理 1-2 spawn）
- [[carryover_task_verify_first]]（顺延 task D1 必先 grep / curl / 实测 / Sprint 20q T-A1+T-A2 grep 验证模式 / V0.1 起草已实测 Contracts grep）
- [[feedback_sprint20n_wave1_complete]]（库存试点开局 Wave 1 完整闭环 / 协调 sprint 模板参考 / Sprint 20q 第 3 次复用）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 + 第 4 周期业务模块扩大 / 第 3 批 4 模块中间点验证里程碑）
- [[project_po_meeting_2026_05_16_nc_voucher_export]]（PO 决策 NC 顺延 / Sprint 20q T-A2 含 NC 凭证关联预留 grep）
- [[feedback_business_party_coordination_failure]]（5 月反模式根因 #1 cici 单点仍保留 / Sprint 20q Q3 A 默认不并发扩大试点 = 缓解 cici 协调负载）
- [[subagent_complexity_pre_check]]（spawn 子代理前 30 秒探查 / Sprint 20q V0.1 起草已实测 Contracts grep / 后端 production-ready / frontend 仅壳）
