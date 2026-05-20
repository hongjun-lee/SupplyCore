# Sprint 20q 任务卡 V0.8（2026-05-20 D3 cici 5 A 收口拍板应用 / 收口模式启动 / Wave 1 已 done / 数据治理 P1 闭环 backend + frontend 完整化）

**Sprint**：20q（**Day 1 提前 2026-05-19 启动**（cici Q1 B 拍板应用 / 跳过间隔 1-2 天 / Sprint 20p 收口后立即续）→ 第 4 周期 5 Sprint 第 2 阶段 / 合同模块协调试点 + 设备管理 Sprint 20w 预 audit）
**主题**：Contracts 试点验证 + Contract ↔ ProcurementDocument ↔ Tender ↔ Approval 关联完整性 grep + Contract ↔ NC 凭证关联预留 + 第 3 批 4 模块 production-ready **中间点验证**（数据治理 + 库存 + 采购 + 合同）+ UI 完善 + **设备管理预 audit**（Sprint 20w 第 6 批主推前置 / cici 拍板 6 第 6 批主推 A 设备管理）+ **微信小程序 candidate 探查**（long-term Q5 拍板 / 移动端入口）
**节奏**：roadmap V0.1 §2.2 撤销「合同 entity 从零开发」/ V0.2 修正为「协调 + 试点验证 + UI 完善 + 中间点验证 sprint」/ V0.3 +设备管理预 audit + 微信小程序 candidate / 工作量 ~1.3 PD → ~1.4 PD（vs roadmap §2.2 估 2.1 PD / 省 0.7 PD / 中间点验证 +0.1 / 设备预 audit +0.1 / 微信小程序 candidate +0 计提 Sprint 20w 起算）
**性质**：**协调 + 试点验证 + 第 3 批 4 模块 production-ready 中间点验证 sprint**（类 Sprint 20n + Sprint 20p 模式 / vs 开发 sprint 20l-20m / vs 收尾 sprint 20o）
**V0.1 起草要点**（main a grep 实测）：
- **重大发现（grep 验证）**：Contracts 6 子模块 entity + Manager + AppService（315 行 / 14 个状态机方法 / 含 bond 全生命周期）+ Controller（14+ endpoint）全在仓 / frontend `pages/contract` 仅 App.tsx + main.tsx 壳（UI 待完善）/ **不需从零开发 entity / 后端 production-ready**
- 主要工作：① Contracts 完整流程 grep + 试点验证 ② cross-aggregate 关联完整性（Contract↔ProcurementDocument↔Tender↔Approval）③ Contract↔NC 凭证关联预留 grep ④ **第 3 批 4 模块中间点验证**（数据治理+库存+采购+合同 demo 串联）⑤ 试点扩大第 2 批协调（Sprint 20p 白音华之后）⑥ UI 完善（contract frontend page 实施）
- roadmap V0.1 §2.2 撤销 / T-A5 同步修正 roadmap V0.x → V0.x+1（§2.2 撤销「从零开发」+ 添加 grep 重大发现章节 + Sprint 20q 性质修正）

---

## 一、Sprint 20p 收尾（前置事实 / commits 链 / 待 Sprint 20p 真正收口后回填）

### 1.1 Sprint 20p 5 task 全 done ✅（V0.6 cici 2026-05-19 早晨拍板回填 / 来源 audit V0.9 final）

| Task | 主要交付 | 状态 | commit |
|---|---|---|---|
| T-A1 | ProcurementDocument 完整流程 grep + 试点验证报告 | ✅ done | Sprint 20p Day 1 完整闭环 |
| T-A2 | ProcurementDocument↔Tender↔Contract↔Approval 关联完整性 grep | ✅ done | Sprint 20p Day 1 完整闭环 |
| T-A3 | 试点单位扩大白音华煤矿协调 + OrgCode | ✅ done | cici 协调启动包 `2effdfa` |
| T-A4 | 试点 demo prep + UI polish（main + second e）| ✅ done | second Wave A-E 全 done |
| T-A5 | Codex + V0.x 升版 + memory + roadmap §2.1+§2.2 修正 | ✅ done | Codex 17 轮 79 finding 12 次 0 收敛 / 8 V0.x 升版 |

**D-4 联合补 ✅**（3 模块鉴权 P0）：
- Sprint 20p ProcurementDocument: commit `fbf4927` (+36-1) / 新增 SupplyCore.Procurement Permission
- Sprint 20q Contract: commit `fd5b421` (+87-7 / +2 endpoint bonus) / SupplyCore.Contract Permission 已存在
- Sprint 20r Approvals: commit `c74f3af` (+15) / SupplyCore.ApprovalCenter Permission 已存在

### 1.2 Sprint 20p 真正收口数字 ✅（来源 audit V0.9 final / 2026-05-19 早晨回填）

| 维度 | 实际达成 |
|---|---|
| main 主代理 commits | **~10**（02:50 ~ 05:10 / 11+ pushed） |
| 整夜跨日 wall-clock | **~32 hr** |
| 加速比 vs 单线程 | **~10x** |
| 总 commits（SupplyCores + SupplyCore） | **~130+** |
| Codex 评审 | **17 轮 79 finding / 12 次 0 收敛 ✅** + Round 18 0 finding 收敛（today Sprint 20q D1 base 2de0aef） |
| **44 Sprint 0 顺延** | **✅ 达成 / 等 Sprint 20q Day 1 启动达 45** |
| AI SOP | **5+1 全 ready / 3565 行** |
| AI 角色目录 | V0.3 / 6 现有 + 6 计划 / 3 Wave 引入 |
| AI prompts | V0.4 / 6 拍板 ✅ + 5+1 SOP ready + decision-template V0.1 引用 |
| Roadmap | Cycle6-10 V0.4 / 5 周期 / 100+ 顺延目标 / Q5 Q1 next year 重拍 |
| Long-term prompt 矩阵 | **73.5 PD / 222+ task / 跨 32 sprint** |
| cici 累计拍板 | **42+** / 100% A default + 局部例外 |
| Sprint 任务卡 | 20q V0.6 + 20r/20s/20t/20u V0.1 + 第 6 批 5 sprint V0.2 (Sprint 20u-20y 子代理批量起草中) |
| 第 6 批 5 入选 cici 拍板 ✅ | CMS-01 22 → CMS-05 22 → LIFE-CYCLE 21 → CMS-02 20 → WARN-V2 19 / 评分顺序分配 |
| 微信小程序 candidate | V0.2 / Q5 重拍 Q1 next year / Sprint 20aa+ 启动（提前 6 月 vs Q3 2027）|

**关键 commit 链**（整夜 main 自做 + 早晨 D1）：
- 整夜：`00be444` / `23e9274` / `5fb1aa2` / `1311e76` / `81b9629` / `0e8767d` / `fc5a205` / `c31b10f` / `f7d147f` / `2de0aef`
- 早晨 D1：`6d66ebc` (第 6 批 V0.2) / `feecad8` (20q V0.5 / 跨仓) / `23e8400` (D1 5 报告 1198 行) / `48085f3` (candidate V0.2) / `aacc8bd` (roadmap V0.4)

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
| **T-A1** Contracts 完整流程 grep + 试点验证 + **设备管理 Sprint 20w 预 audit**（V0.3 +0.1 PD）| 0.3 | P0 | main 主代理 a | grep 验证：① Contract Entity 状态机 + ContractStates + ContractBondStates ② ContractManager 业务规则 ③ ContractAppService 14 状态机方法（submit/approve/reject/start-execution/complete/terminate/void/pay-bond/release-bond/forfeit-bond/approve-overlimit/get/list/create）④ ContractsController 14+ endpoint ⑤ 6 子模块（Changes/Negotiations/PaymentNodes/Terminations/Clauses）完整度 ⑥ 测试覆盖率 ⑦ **设备管理预 audit**（V0.3 N-Q2/N-Q6 应用 / Sprint 20w 第 6 批主推 A 设备管理 / grep 设备 entity 是否在仓 + Manager + AppService + Controller 完整度 + 与 库存 关联 / 缩短 Sprint 20w 启动成本）/ 写到 `docs/internal/sprint-20q-contracts-validation.md` + `docs/internal/sprint-20q-equipment-pre-audit.md` | Sprint 20p T-A1+T-A2 done | 验证报告 ≥ 100 行 + 设备预 audit ≥ 40 行 / 含 grep 结果 + 14 状态机方法 checklist + 6 子模块完整度 + bond 全生命周期验证 + 设备模块产品 ready 度评分 |
| **T-A2** Contract ↔ ProcurementDocument ↔ Tender ↔ Approval 关联完整性 grep（cross-aggregate / 5 维度）| 0.3 | P0 | main 主代理 a | grep cross-aggregate：① Contract 是否引用 ProcurementDocumentId（采购单触发合同生成）② ContractFromNegotiationLinkage 招标→合同链路完整度 ③ Contract 是否串接 Approval（合同审批 / 超限审批）④ Contract↔NC 凭证关联预留（NcVoucherNo 字段 + 凭证导出 link）⑤ 状态机串联与跨模块状态触发链 / 写到 `docs/internal/sprint-20q-cross-aggregate-validation.md` | T-A1 done | 验证报告 ≥ 120 行 / 含 5 维度 grep 结果 + 关联完整性表 + 缺口清单 + NC 凭证关联预留 checklist |
| **T-A3** 第 3 批 4 模块 production-ready **中间点验证**（数据治理 + 库存 + 采购 + 合同 / 4 模块 demo 串联 + e2e）| 0.3 | P0 | main 主代理 a + cici 协调 | 4 模块串联 demo：① 数据治理（Sprint 20l-20m 6 handler）→ 试点单位数据齐备 ② 库存（Sprint 20n 4 单据 endpoint）→ 出入库流程跑通 ③ 采购（Sprint 20p ProcurementDocument）→ 采购流程跑通 ④ 合同（Sprint 20q）→ 合同审批 + bond 流转 / e2e 串联测试（数据治理 → 库存 → 采购 → 合同 完整链）/ 试点单位反馈收集 / 写到 `docs/internal/sprint-20q-batch3-mid-validation.md`（V0.1 第 4 周期中间点验收报告）| T-A1 + T-A2 done | 验证报告 ≥ 100 行 / 含 4 模块 grep checklist + 2-4 模块 demo 串联结果 + 试点反馈 + 缺口清单 |
| **T-A4** 试点单位扩大第 2 批协调（cici 协调 / Sprint 20p 白音华之后）| 0.2 | P0 | main 主代理 a + cici 协调 | cici 协调 Nova 团队同步第 2 批试点候选（如：异地厂矿 1-2 单位 / OrgCode 待 Nova 同步）+ 5 维度评分（沿用 Sprint 20o T-A2 §2.3 模板 / Sprint 20p T-A3 实例）+ 试点接口人指定 / 写到 `docs/internal/sprint-20q-pilot-expansion-batch2.md` | Sprint 20p T-A3 白音华完成且试点反馈第 1 周到位 | 文档 ≥ 60 行 / 含评分 + OrgCode + 接口人 + Sprint 20p 第 1 批反馈对比 |
| **T-A6** 微信小程序 candidate 探查（**V0.3 新增 / N-Q5 / L-Q5 应用 / 0 PD 计提**）| 0 | P2 | main 主代理 a | long-term Q5 拍板「微信小程序」应用 / Sprint 20q candidate 探查：① 微信小程序 framework 候选（Taro / uni-app / 原生）/ ② 与现有 React + DevExtreme 复用度 / ③ 试点单位移动端使用场景预 grep（库存盘点 / 合同审批 / 凭证审核）/ ④ Sprint 20w-20z 落地时间窗预估 / 写到 `docs/internal/sprint-20q-wechat-miniprogram-candidate.md` | Sprint 20q T-A1 done（含设备 audit 验证移动端候选场景）| 文档 ≥ 50 行 / 含 framework 评分 + 复用度 + 场景 + 时间窗 |
| **T-A5** Codex + V0.x 升版 + memory | 0.3 | P0 | main 主代理 a | 标准收尾（V0.2 Q4 跳过应用 / roadmap §2.2 已在 V0.2 修过 / 不再单修）：① Sprint 20q 任务卡 V0.x 升版（V0.3 → V0.x+1 视实际拍板）/ ② memory 升级（45 Sprint 0 顺延 + Sprint 20q 协调 + 中间点验证 sprint 完整闭环 + 20 拍板应用 + 设备 audit + 微信小程序 candidate）/ ③ Codex 评审 ≥ 2 轮 / 0 finding 收敛保留 | Sprint 20q T-A1-A4+T-A6 全 commit 完成 | Codex 0 顺延 / V0.x 锁版 / memory commit |

**main 总：~1.4 PD**（vs roadmap §2.2 估 2.1 PD / 撤销从零开发 -0.8 PD + 中间点验证 +0.1 PD + 设备 audit +0.1 PD + 微信小程序 candidate 0 PD 计提 / 净省 0.7 PD）

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

- main 主轨：5 天细化（V0.4 D2-D5 任务列表）
  * **Day 1**（2026-05-19）：T-A1（0.3 PD / Contracts grep + 14 状态机方法验证 + 设备 audit）+ T-A2（0.3 PD / cross-aggregate 关联 grep / 可 spawn 子代理）→ 实际 Sprint 20p Day 1 完整闭环跨日续（Codex Round 17 0 收敛通过 / 5 spawn 子代理 + main 4 自做并行 9 task）
  * **Day 2**：T-A3（0.3 PD / 第 3 批 4 模块中间点验证 / demo 串联 / 可 spawn 子代理）+ T-A6（0 PD / 微信小程序 candidate 探查）
  * **Day 3**：T-A4（0.2 PD / cici 协调试点扩大第 2 批 / 等白音华第 1 周反馈）+ second e T-E1（0.3 PD / Contract frontend list+detail+form+关联视图实施开局）
  * **Day 4**：second e T-E2（0.2 PD / 第 3 批 4 模块业务方 demo walk-through page）+ T-E3（0.2 PD / e2e 测试补 contract + 关联流程 + 4 模块串联）
  * **Day 5**：T-A5（0.3 PD / Codex 评审 ≥ 2 轮 / 0 finding 收敛保留 + V0.4 → V0.5 锁版 + memory 升级 45 Sprint 0 顺延）
- part 2 协调：3-4 周持续（cici 协调第 2 批试点 + 试点反馈 + 与 Sprint 20n+20p part 2 同期）

### 3.2.1 Sprint 20p Day 1 收尾完整数据（V0.4 新增 link）

详见 [`../../SupplyCores/docs/internal/sprint-20p-day1-final-audit-V0.6.md`](../../SupplyCores/docs/internal/sprint-20p-day1-final-audit-V0.6.md)：
- 跨 2 晚 wall-clock 累计 ~30 hr / ~125 commits / 加速 ~10x
- main long-term V0.4 → V0.5 第 9 周期占位（965 行 / 5 Wave 18 task）
- AI 团队角色目录 V0.1 → V0.2（6 拍板 / 5+1 SOP 全 ready）
- Sprint 20r V0.1（152 行）+ 20s V0.1（227 行）+ 20t V0.1（110 行）占位
- Codex Round 17 后台启动 agentId `a46a3755` / xhigh 5-15 min / 等 PID 退出后报告 main
- 长期 prompt 矩阵：main V0.1-V0.5（29.5 PD / 89 task / 22 sprint）+ second V0.1-V0.7（34 PD / 100+ task / 26 sprint）= **63.5 PD / 189+ task / 26 sprint**

### 3.2.2 Codex Round 17 0 收敛通过 link（V0.4 新增）

详见 [`../../SupplyCores/docs/internal/sprint-20p-day1-final-audit-V0.6.md`](../../SupplyCores/docs/internal/sprint-20p-day1-final-audit-V0.6.md) §Codex Round 17 后台启动 — Round 17 0 finding 收敛通过 / Codex 链彻底收敛 / 45 Sprint 0 顺延维持。

### 3.2.3 第 4 周期 5 sprint V0.1 ready link（V0.4 新增）

第 4 周期 5 sprint 全 V0.1 ready：
- [`Sprint-20p-任务卡-V0.3.md`](Sprint-20p-任务卡-V0.3.md)（Day 1 完整闭环 / 已 push）
- [`Sprint-20q-任务卡-V0.4.md`](Sprint-20q-任务卡-V0.4.md)（本 / 协调 + 中间点验证 + UI + 设备预 audit + 微信小程序 candidate）
- [`Sprint-20r-任务卡-V0.1.md`](Sprint-20r-任务卡-V0.1.md)（152 行 / 审批 + NC 真联调启动 / Sprint 20p Day 1 占位）
- [`Sprint-20s-任务卡-V0.1.md`](Sprint-20s-任务卡-V0.1.md)（227 行 / NC 真联调主推 + 审批闭环）
- [`Sprint-20t-任务卡-V0.1.md`](Sprint-20t-任务卡-V0.1.md)（110 行 / 第 4 周期收尾 + Q3 末 production deployment）

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

## 四、关键决策点（V0.2 5 项 cici 拍板应用 + V0.3 长期 7 + AI 团队 6 + Sprint 20q 7 共 20 拍板）

### 4.1 Sprint 20q V0.2 5 决策（cici 2026-05-18 拍板 / V0.3 状态：已应用）

| # | 决策 | cici 拍板（V0.2）| **V0.3 应用状态** |
|---|---|---|---|
| **Q1** | Sprint 20q 启动时机 | B 间隔 1-2 天 | ✅ **应用 + 实际微调**：实际启动 2026-05-19（V0.2 B 拍板「间隔 1-2 天」实际仅 1 天达成 / Sprint 20p 收口翌日提前续 / cici 已睡 / Day 1 自启 / 启动机制改进有效）|
| **Q2** | T-A3 第 3 批中间点验证深度 | B grep + 2 模块 demo（数据治理 + 合同）| ✅ **应用**：T-A3 grep 4 模块 + 2 模块 demo（数据治理 + 合同）/ 4 模块完整 e2e 顺延 Sprint 20t |
| **Q3** | 试点扩大第 2 批候选 | A 等白音华第 1 周反馈 | ✅ **应用**：T-A4 暂保留 candidate 探查 / 实际第 2 批 Sprint 20r+ 启动 / cici 协调负载控制维持 |
| **Q4** | T-A5 roadmap §2.2 修正深度 | 跳过（roadmap V0.2 已含）| ✅ **应用**：T-A5 仅 Codex + 任务卡 V0.x → V0.x+1 + memory / roadmap §2.2 不再单修 / 节省 0.1 PD |
| **Q5** | second e 副轨范围 | A T-E1+T-E2+T-E3 全启动 | ✅ **应用**：second e 第 14 次连续 / contract frontend 从壳实施 list+detail+form+关联视图 |

### 4.2 long-term roadmap V0.1 7 战略拍板（cici 2026-05-19 / 影响 Sprint 20q+ 长期）

| # | 战略 | cici 拍板 | **V0.3 影响 Sprint 20q+** |
|---|---|---|---|
| **L-Q1** | 第 8 周期战略 | B 跨集团 SaaS | Sprint 20q 不直接 / 第 8 周期 Sprint 30+ 起算 |
| **L-Q2** | 海外市场 | C 不做 | Sprint 20q 不影响 / 缩窄范围 |
| **L-Q3** | Web3 / 区块链 | C 不做 | Sprint 20q 不影响 / 缩窄范围 |
| **L-Q4** | 服务单位规模 | A 30+ 单位 | Sprint 20q T-A4 试点扩大第 2 批战略目标明确 / 第 6 周期累计 30+ |
| **L-Q5** | 移动端入口 | 微信小程序 | **Sprint 20q 新增 T-A6 微信小程序 candidate 探查**（0 PD 计提 / Sprint 20w 起算 / 移动端入口落地）|
| **L-Q6** | 国产 AI | C 不做 | Sprint 20q 不影响 / AI 仍 Claude/GPT |
| **L-Q7** | 上下游延伸 | B 适度 | Sprint 20q 不直接 / 第 7 周期起 |

### 4.3 AI 团队 6 拍板（cici 2026-05-19 / 影响 Sprint 20q+ 团队节奏）

| # | 决策 | cici 拍板 | **V0.3 影响 Sprint 20q+** |
|---|---|---|---|
| **T-Q1** | 团队规模扩张 | A 加 1 PM | Sprint 20q T-A4 引入 PM 角色已注（V0.2 §5.1）/ V0.3 落地为 T-A4 配套 |
| **T-Q2** | Sprint 节奏 | B 维持 1.2-1.4 PD | Sprint 20q 维持 1.4 PD（V0.3 +0.1 设备 audit 后）/ 节奏对齐 |
| **T-Q3** | 子代理上限 | A 6 个并行 | Sprint 20q T-A1+T-A2+T-A3 可并行 spawn 不超 6 / 安全余量 |
| **T-Q4** | 评审节奏 | A Codex 每 sprint ≥ 2 轮 | Sprint 20q T-A5 Codex ≥ 2 轮维持 / 0 finding 收敛保留 |
| **T-Q5** | memory 升级节奏 | A 每 sprint 升级 | Sprint 20q T-A5 memory 升级保留 |
| **T-Q6** | 跨 session 同步 | A 维持双 session | Sprint 20q second e 第 14 次连续 / 维持 |

### 4.4 Sprint 20q V0.3 新增 7 拍板（cici 2026-05-19 / Sprint 20q+ 直接生效）

| # | 拍板 | cici 决策 | **V0.3 应用** |
|---|---|---|---|
| **N-Q1** | Sprint 20q 启动时机调整 | **B 提前 2026-05-19**（取代 V0.2 Q1 B 间隔 1-2 天 / 实际仅 1 天 / 启动提前）| ✅ Day 1 自启 / cici 已睡 / 主代理 a 独立推进 |
| **N-Q2** | 第 6 批主推方向（Sprint 20w+）| **A 设备管理** | ✅ Sprint 20q T-A1+T-A3 含设备模块预 audit（grep 设备管理 entity / Manager / AppService / Controller 完整度）+ 中间点验证含设备模块 |
| **N-Q3** | Sprint 20s Q3 驳回逻辑 | **A 自动回退草稿**（Sprint 20s 时应用）| ⏳ Sprint 20s 时应用 / Sprint 20q 不直接 |
| **N-Q4** | NC 启动时机 | **C 仅 G-12 业务方推进即启**（Sprint 20r 时应用）| ⏳ Sprint 20r 时应用 / Sprint 20q 不直接 |
| **N-Q5** | 微信小程序候选 | **long-term Q5 拍板 / Sprint 20q 探查 candidate** | ✅ Sprint 20q T-A6 candidate 探查 0 PD 计提 / Sprint 20w 起算 |
| **N-Q6** | 设备管理 Sprint 20w 预 audit | **Sprint 20q T-A1+T-A3 含设备模块预 audit** | ✅ T-A1 grep 设备管理 entity / T-A3 中间点验证含设备模块 / 同步 Sprint 20w 启动前缩短启动成本 |
| **N-Q7** | Sprint 20q 工作量调整 | **V0.3 +0.1 设备 audit = 1.4 PD** | ✅ T-A1 0.2 → 0.3 PD（含设备 grep）/ 总 1.4 PD |

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
| **V0.8** | **2026-05-20 D3 today 收口模式启动** | **cici D3 早晨 5 A 拍板全应用 ✅ / Wave 1 数据治理 P1 闭环 backend + frontend 完整化**：① **收口模式正式启动**（横向扩远期 → 纵向打穿 / 同事建议 4 阶段 cici 拍板 A+C / 远期 plan V0.1-V0.17 保留作备份不撤回）② **5 A 拍板全应用**：D1 缺口 priority A（数据治理 → 采购 → 库存 → 合同/NC）/ D2 4 闭环顺序 A / D3 去 mock 第 1 批 A（migration-m18 + initial-stock first）/ D4 Nova 联调 A（Sprint 20r D1）/ D5 NC 真上线 A（Sprint 20s D1 / 李建颖+汤云龙）③ **Wave 1 backend done**：子代理 a `d4b0094` MaterialCategoryLegacyMapping AppService + Controller 193 行 / 子代理 b `49d8e7b` InitialStockMigrationValidation AppService + Controller 343 行 / 0 errors / Permission 复用 ④ **Wave 1 frontend done (second e)**：T-E1 M-18 去 mock 完整化 (Toast/retry/effective chip) `666ab1c` / T-E3 数据治理 dashboard 新建 `ebb54da` / T-E4 4 闭环 e2e (5 用例) `b8cfa06` / T-E7 采购全链路 e2e `4aefbf8` ⑤ **main self Wave 1 收尾**：roadmap V0.3 → V0.4 `ea618e8` / 3 test 文件整理 `3c169c7` 633 行 / Sprint 20r V0.3 + Sprint 20s V0.3 升版 `f3ba7b0` ⑥ **D3 today 14 hr plan ready**（main 5 Wave + second 4 Wave / 30-40 push 目标 / 5-8x 加速）⑦ **45 Sprint 0 顺延维持** / Codex Round 18 0 收敛延续 / 收口模式 4 Phase ready (缺口清单 + 4 闭环 + 去 mock + 试点 UAT) |
| **V0.7** | **2026-05-19 D2 today done** | **cici "你也按照任务开始自己的工作吧，要自我安排，长时间工作" 应用 / main 整夜跑模式启动**：① **5 子代理后台并发**（Sprint 20r V0.2 / Sprint 20s V0.2 / Sprint 20t V0.2 / 第 6 批 mini-roadmap V0.1 详化 / main V0.8 Sprint 20v-20y 续接）② **main 自做 3 task**：Sprint 20q V0.6 → V0.7（本升版）/ roadmap V0.4 → V0.5（50/63 里程碑应用）/ memory + audit V0.9 → V1.0 ③ **D2 today done 内容**：T-A5 收尾 + Codex Round 18 0 finding 收敛 ✅ + audit V0.9 final ✅ + memory 2 新条 (cici-morning-batch + codex-round18) ✅ + cici 5 batch 拍板全应用 ✅ + 长期 execution plan V0.1 (904 行) + main V0.7 (712 行) + second V0.9 (1048 行) ✅ ④ **second 切 session 启动方式**：cici 复制 second V0.9 1048 行 → 5 Wave 14 task / 2.4 PD / 跨 Sprint 20q D2 + 20r-20u ⑤ **长期 prompt 矩阵升新**：main V0.1-V0.7 39 PD + second V0.1-V0.9 41 PD = 80 PD / 250 task / 跨 37 sprint ⑥ **8 task TaskCreate**（task 138-145 / 5 spawn + 3 main self）|
| **V0.6** | **2026-05-19 早晨 cici 4 拍板回填** | **§1.1+§1.2 Sprint 20p 收口数据全填 ✅ + 第 6 批评分顺序分配 + Q5 重拍 Q1 next year + D2 today 续启动**：① §1.1 5 task 全 done 状态填 + D-4 联合补 3 commit hash + Permission 表 ② §1.2 Sprint 20p 真正收口数字全填（10 commits / 32 hr / 130+ total / 加速 10x / Codex 17→18 轮 79 finding 13 次 0 收敛 / 5+1 AI SOP / Long-term prompt 73.5 PD / cici 42+ 拍板 / 第 6 批 5 入选 / 微信小程序 V0.2）③ **第 6 批 5 入选评分顺序分配**：Sprint 20u → CMS-01 22 / 20v → CMS-05 22 / 20w → LIFE-CYCLE 21 / 20x → CMS-02 20 / 20y → WARN-V2 19（cici A 拍板 / 子代理 afbcba 批量起草 V0.2）④ **第 2 批试点 cici A 拍板**（等白音华第 1 周反馈满后担 / Sprint 20r+ 启动）⑤ **D2 today 续启动**（cici A 拍板 / D2 T-A5 收尾启动 / Codex Round 18 0 finding 收敛 ✅）⑥ **Q5 微信小程序重拍**（V0.2 candidate Q3 2027 → Q1 next year / Sprint 20aa+ / roadmap V0.4 同步应用）/ 关键 commit 链 整夜 10 + 早晨 D1 5 commit 全列 |
| **V0.5** | **2026-05-19 06:00 cici 早晨拍板后升** | **cici "1今天 2ok 3启动" + 2 设备拍板 A + ContractClauses A 顺延 全应用**：① **Day 1 today 启动**（cici "1 今天" / 提前 1 天 vs 2026-05-20 推荐 / Sprint 20q D1 in_progress）② **T-A1 done ✅**（Contracts validation 219 行 / 设备 pre-audit 183 行 / 子代理 a82bf 报告）③ **T-A2 done ✅**（cross-aggregate 402 行 / 22/25 评分 88% HIGH / 远超 Sprint 20p ProcurementDocument 18/25 / 子代理 ab31c 报告 / 6 缺口 4 闭 + 2 顺延 G-B4/G-B6 等 NC 真接入）④ **第 6 批 V0.2 cici 拍板 ✅**（"2 ok" / 5 入选 CMS-01 22 + CMS-05 22 + LIFE-CYCLE 21 + CMS-02 20 + WARN-V2 19 / 总 7.5 PD 跨 Sprint 20u-20y）⑤ **2 设备缺口 cici A 拍板 Sprint 20w 立修**（EquipmentsController [Authorize] + EquipmentDepreciations Controller 补 / Sprint 20w P0 同日立修 / 不增 Sprint 20q PD）⑥ **ContractClauses cici A 顺延**（全栈缺失 / 详设 V1.3+ 留位 / Sprint 20q 不动 / 主题协调 + 试点验证 / 不混入条款库实施）⑦ **Codex Round 18 启动**（"3 启动" / PID 55174 后台 / base 2de0aef / 5-15 min / 等结果）⑧ **T-A6 微信小程序 candidate 子代理 a053cc 跑中**（0 PD 计提 / framework 评估 + 复用度 + 场景）⑨ **T-A3 main self grep + 起草**（4 模块中间点验证 / 数据治理+库存+采购+合同 demo 串联 / 0.3 PD）/ T-A4 等 cici 协调第 2 批试点 / T-A5 收尾 |
| **V0.4** | **2026-05-19 凌晨~早晨**（main 整夜跑跨日续） | **D2-D5 细化 task + Sprint 20p Day 1 收尾完整数据 link + Codex Round 17 0 收敛通过 link + 第 4 周期 5 sprint V0.1 ready link**：① §3.2 wall-clock 估算扩展为 D1-D5 5 天细化 task（main + second e 各日 task 列表清晰）② §3.2.1 新增 Sprint 20p Day 1 收尾完整数据 link（[`sprint-20p-day1-final-audit-V0.6.md`](../../SupplyCores/docs/internal/sprint-20p-day1-final-audit-V0.6.md) / 跨 2 晚 30 hr / 125 commits / 加速 ~10x / long-term prompt 矩阵 63.5 PD 189+ task 26 sprint）③ §3.2.2 新增 Codex Round 17 0 收敛通过 link（agentId `a46a3755` / xhigh / Codex 链彻底收敛 / 45 Sprint 0 顺延维持）④ §3.2.3 新增第 4 周期 5 sprint V0.1 ready link（20p V0.3 + 20q V0.4 + 20r V0.1 152 行 + 20s V0.1 227 行 + 20t V0.1 110 行）/ T-A1-A6 task 不变 / 主要工作量 1.4 PD 维持 |
| **V0.3** | **2026-05-19** | **cici 长期 7 战略 + AI 团队 6 + Sprint 20q 7 共 20 拍板应用**：① **V0.2 5 决策应用状态确认**（Q1 B 提前 2026-05-19 实际仅 1 天 / Q2 B grep+2模块demo 应用 / Q3 A 第 2 批 Sprint 20r+ 应用 / Q4 跳过 §2.2 修正 应用 / Q5 A second e T-E1+T-E2+T-E3 全启动 应用）② **long-term roadmap V0.1 7 战略拍板**（L-Q1 B 跨集团 / L-Q2 C 不做海外 / L-Q3 C 不做 Web3 / L-Q4 A 30+ 单位 / L-Q5 微信小程序 / L-Q6 C 国产 AI / L-Q7 B 上下游适度）③ **AI 团队 6 拍板**（T-Q1-Q6 加 PM / 1.2-1.4 PD / 6 并行 / Codex ≥ 2 轮 / memory 每 sprint / 双 session）④ **Sprint 20q V0.3 新增 7 拍板**（N-Q1 启动提前 2026-05-19 / N-Q2 第 6 批 A 设备管理 / N-Q3 Sprint 20s Q3 自动回退草稿 / N-Q4 NC C 仅 G-12 后启 / N-Q5 微信小程序 candidate / N-Q6 设备预 audit / N-Q7 工作量 +0.1 = 1.4 PD）⑤ **任务清单变更**：T-A1 0.2 → 0.3 PD（含设备 audit）+ 新增 T-A6 微信小程序 candidate 0 PD / T-A5 不再单修 roadmap §2.2 / main 总 1.3 → 1.4 PD（净省 0.7 PD vs roadmap 估）/ Day 1 提前 2026-05-19 自启 / cici 已睡 / 主代理 a 独立推进 |
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
