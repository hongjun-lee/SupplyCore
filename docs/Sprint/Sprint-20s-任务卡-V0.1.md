# Sprint 20s 任务卡 V0.1（2026-05-17 / main 主代理 a 起草 / NC 真联调主推 sprint / 待 Sprint 20r NC 启动后回填前置事实 / 5 决策待 cici V0.2 答）

**Sprint**：20s（紧续 20r NC 真联调启动 → 第 4 周期 5 Sprint 第 4 阶段 / NC 主推高峰）
**主题**：NC 真联调 5 接口实测（BIZ-MR / RED / 007 / PAY / PAY-BATCH 全 / 真 NC 推送 + 真号回写 + 错误码 + Polly 重试实战 + Hangfire 监控）+ 审批闭环（驳回 / 撤销 / 审批历史）+ production runbook V0.2 → V0.3（试点单位实战修正）
**节奏**：roadmap V0.1 §2.4 / NC 主推 sprint / 工作量 ~2.1 PD（vs 协调 sprint 20p+20q 1.2 PD 高 ~75% / 第 4 周期高峰）
**性质**：**NC 真联调主推（第 4 周期高峰）+ 审批闭环 + runbook 实战升级 sprint**（vs 协调 sprint 20p/20q / vs NC 启动 sprint 20r / vs 收尾 sprint 20t）
**V0.1 起草要点**（待 Sprint 20r 真正收口 + cici 拍板 5 决策）：
- **NC 5 接口 grep 重大发现**：`Vouchers/Stubs/` 5 个 NC stub generator 全在仓（BizMrMaterialReturnStubGenerator / BizRedPurchaseReturnStubGenerator / Biz007CrossOrgTransferStubGenerator / BizPayPaymentStubGenerator / BizPayBatchPrepaymentStubGenerator）+ 14+ InterfaceCode Contributor（Biz002/003/004/005A/007/014/015/018/019/Chk001 等）+ NcInterfaceHttpClient + NcInterfaceMockClient + OAuth2 + Polly 全在 / **真接通基础完全 production-ready / 仅缺业务方 G-12 + NC 侧联调环境（Sprint 20r 触发条件）**
- **审批闭环 grep 发现**：`ApprovalAppService.RejectAsync` + `ApprovalInstanceManager.RejectAsync` + `ApprovalInstanceStates.Rejected = "已退回"` 已实现 / **驳回基础完全在仓**；Cancel / Withdraw / 历史时间线 / 业务单回退通知 待补 / **闭环范围 = 撤销 + 历史 + 业务单回退集成**
- **runbook V0.2 §十一+§十二 占位章节待 V0.3 实战补完**：V0.2 §十一 = Sprint 20n part 2 试点反馈修正占位 / §十二 = NC/财务接口准备占位 / V0.3 升版触发条件已明（§11.3 + §12.4）/ **Sprint 20s T-A3 把双占位章节升 V0.3 实战版**
- roadmap V0.1 §2.4 维持（无撤销 / 工作量 2.1 PD 沿用 / Sprint 20s = NC 主推不是协调 sprint）

---

## 一、Sprint 20r 收尾（前置事实 / 待 Sprint 20r 真正收口后回填 / 占位章节）

### 1.1 Sprint 20r 5 task 状态（占位待回填）

| Task | 主要交付 | 状态 |
|---|---|---|
| T-A1 | NC OAuth2 真接通 + 5 InterfaceCode UseMock=false 切换 + Hangfire 真路由 | ⏳ 待回填 |
| T-A2 | 审批工作流引擎选型评估实施（自研 vs Workflow Core vs Elsa）| ⏳ 待回填 |
| T-A3 | NC 真联调启动验收 + 业务方 G-12 协同 + 失败回退方案 | ⏳ 待回填 |
| T-A4 | 第 4 批模块准入评估（NC 真接通 + 5 模块 production-ready 中间点）| ⏳ 待回填 |
| T-A5 | Codex 20r 评审 + V0.x 升版 + memory + roadmap V0.3 修正 | ⏳ 待回填 |

### 1.2 Sprint 20r 真正收口数字（占位待回填）

| 维度 | 数字 / 状态 |
|---|---|
| main 主代理 commits | ⏳ 待回填 |
| Codex 评审 | ⏳ 待回填（目标 R5 = 0 finding 收敛）|
| **46 Sprint 0 顺延** | ⏳ 待 Sprint 20r 真正收口确认（Sprint 20s 目标 = 47 Sprint）|
| 关键 commit | ⏳ 待回填 |

### 1.3 NC 5 接口现状 grep 重大发现（来源 Sprint 20s V0.1 起草 / `modules/nova.supplycores/src/`）

**NC 真接通基础已 production-ready / 仅缺业务方 G-12 + NC 侧联调环境**：

| InterfaceCode | Stub Generator（仓内路径）| 状态 |
|---|---|---|
| BIZ-MR（物料退库）| `Vouchers/Stubs/BizMrMaterialReturnStubGenerator.cs` | ✅ 在仓 |
| RED（红字采购退货）| `Vouchers/Stubs/BizRedPurchaseReturnStubGenerator.cs` | ✅ 在仓 |
| 007（跨组织调拨）| `Vouchers/Stubs/Biz007CrossOrgTransferStubGenerator.cs` | ✅ 在仓 |
| PAY（付款）| `Vouchers/Stubs/BizPayPaymentStubGenerator.cs` | ✅ 在仓 |
| PAY-BATCH（批量预付）| `Vouchers/Stubs/BizPayBatchPrepaymentStubGenerator.cs` | ✅ 在仓 |

**基础设施 production-ready**：
- `NcInterfaceHttpClient` + `NcInterfaceMockClient`（双模式 UseMock 切换）
- `NcOAuth2TokenService` + `NcOAuth2CachedToken`（[[oauth2-client-credentials-pattern]] 5 要点）
- 14+ `InterfaceCode` Contributor（Biz002/003/004/005A/007/014/015/018/019/Chk001 等 / 全 InvokeAsync 通用模式）
- `InterfaceHealthCheckService` + `InterfaceMonitorAppService`（监控基础）
- `PeriodReverseAppService`（月结反结）

**结论**：NC 真联调基础完全 production-ready / **Sprint 20s 主要为业务方 G-12 触发后真 NC 推送 + 真号回写 + 错误码处理 + chaos 实战 / 不需重新开发基础**。

### 1.4 审批闭环现状 grep 发现（来源 Sprint 20s V0.1 起草 / `modules/nova.supplycores/src/`）

**审批驳回基础已 production-ready / 撤销 + 历史 + 业务单回退集成待补**：

| 能力 | 仓内位置 | 状态 |
|---|---|---|
| `RejectAsync`（驳回 API）| `Application/Approvals/ApprovalAppService.cs:129` | ✅ 在仓 |
| `ApprovalInstanceManager.RejectAsync` | `Domain/Approvals/ApprovalInstanceManager.cs:295` | ✅ 在仓 |
| `ApprovalInstanceStates.Rejected = "已退回"` | `Domain/Approvals/ApprovalInstanceStates.cs:23` | ✅ 在仓 |
| 第 1 节点退回 → 终态 Rejected（发起方需重新发起）| `Domain/Approvals/ApprovalInstanceManager.cs:314-316` | ✅ 在仓 |
| `CancelAsync` / `WithdrawAsync`（撤销 API）| **缺失** | ⏳ Sprint 20s T-A2 新增 |
| 审批历史时间线 endpoint | **缺失** | ⏳ Sprint 20s T-A2 新增 |
| 驳回 → 业务单状态回退（自动 / 手动）| **决策待 cici Q3** | ⏳ Sprint 20s T-A2 实施 |
| 多角色权限校验（驳回 / 撤销）| **待补充** | ⏳ Sprint 20s T-A2 实施 |

**结论**：审批基础 RejectAsync 完全在仓 / **Sprint 20s 闭环范围 = 撤销 API + 审批历史时间线 + 业务单回退集成 + 多角色权限校验 / 工作量 0.5 PD**。

---

## 二、Sprint 20s Task 清单（A 主轨 5 task / 总 ~2.1 PD / NC 主推 / 工作量略高 75%）

### A 主轨（main 主代理 a / NC 真联调主推 + 审批闭环 + runbook 实战 / 共 5 task / 2.1 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** NC 真联调 5 接口实测（BIZ-MR / RED / 007 / PAY / PAY-BATCH）| 0.6 | P0 | main 主代理 a + IT | ① 真 NC 推送（5 InterfaceCode 全跑通 / payload 实测）② 真号回写（NcVoucherNo 字段 8+ 实体 / webhook 或 poll）③ 错误码处理表（5xx / 业务错误码 / 部分成功）④ Polly 三层重试实战（retry / circuit breaker / timeout / chaos 5 场景）⑤ Hangfire 任务监控（每接口成功率 + 重试次数 + 失败原因 / 写到 `docs/internal/sprint-20s-nc-5-interface-validation.md`）| Sprint 20r T-A1 NC OAuth2 切换 done + NC 联调环境就绪 | 验证报告 ≥ 120 行 / 含 5 接口 grep + 错误码表 + chaos 实测 + Hangfire 监控截图 |
| **T-A2** 审批闭环（驳回 / 撤销 / 审批历史 / 业务单回退）| 0.5 | P0 | main 主代理 a | ① 撤销 API（`ApprovalAppService.CancelAsync` + Manager / 已提交未审批可撤）② 审批历史时间线 endpoint（`GET /api/.../approval-instances/{id}/timeline`）③ 业务单回退集成（驳回 → 业务单 OnRejected 事件 + 通知发起人）④ 多角色权限校验（驳回 / 撤销 / 历史查询 / RBAC 集成）⑤ cici Q3 决策驳回后业务单状态机（自动回退草稿 vs 保留 + 提示）| Sprint 20r T-A2 审批引擎选型 done | RejectAsync 路径回归 + 新增 3 endpoint 测试 ≥ 90% / cici Q3 拍板入 V0.2 |
| **T-A3** production runbook V0.2 → V0.3 实战修正项陆续到位 | 0.4 | P0 | main 主代理 a + cici 协调 | ① §十一占位 → V0.3 实战版（部署步骤验证 + 回退方案实测 + 备份恢复实测 + 试点单位反馈优化项）② §十二 NC/财务接口准备 → V0.3 NC 真接通启动后补完整（基于 T-A1 5 接口实测 + chaos 实战）③ §二 checklist + §四 部署步骤 + §五 验收 checklist + §七 故障排查 全 NC 真联调实战项补完 / Sprint 20n part 2 试点反馈数据吸收 | Sprint 20n part 2 试点反馈 ≥ 2 周 + T-A1 NC 5 接口实测 done | runbook V0.3 ≥ 700 行（vs V0.2 624 行 / 增 ~76 行）/ 双占位章节补完 |
| **T-A4** NC 真联调 demo 业务方验收（cici 协调财务+物资+IT）| 0.2 | P0 | cici + 财务（李建颖）+ 物资（汤云龙）+ IT | ① cici 协调三方 demo（财务凭证导入 → 物资业务单 → IT 真接通监控）② 真接通验收清单（5 InterfaceCode 真号回写 ✅ / Polly chaos ✅ / 错误码处理 ✅ / Hangfire 监控 ✅）③ 反馈窗口（类 19r D1 9/9 模式）④ 反馈写到 `docs/internal/sprint-20s-nc-demo-feedback.md` | T-A1 + T-A2 done | 三方反馈 ≥ 5 项 / cici 拍板验收通过 |
| **T-A5** Codex + V0.x 升版 + memory + **roadmap V0.2 §2.4 修正** | 0.4 | P0 | main 主代理 a | 标准收尾 + **roadmap V0.2 → V0.3 §2.4 修正**：① 基于 Sprint 20s T-A1 5 接口实测结果调整 Sprint 20t 第 4 周期收尾范围 ② 审批闭环 T-A2 实际工作量回填（0.5 PD vs 估算）③ runbook V0.3 升版实战章节补完工作量回填 ④ 47 Sprint 0 顺延达成（Sprint 20o 43 + 20p+20q+20r+20s = 47 Sprint）/ memory 升级 | Sprint 20s T-A1-A4 全 commit 完成 | Codex 0 顺延（Round 5 收敛目标）/ V0.x 锁版 / roadmap V0.3 §2.4 修正 done / memory commit |

**main 总：~2.1 PD**（NC 主推 / 工作量略高于协调 sprint 75% / 第 4 周期高峰）

### E 副轨（second 主代理 e / 条件性 / cici Q5 拍板后启动 / 共 ~0.6 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** NC 真联调监控 dashboard 完整化 | 0.3 | pending | Token 刷新状态 + Polly chaos 实时 + 5 接口调用统计 + 真号回写成功率 + InterfaceHealthCheckService 集成 |
| **T-E2** 审批闭环 UI polish | 0.2 | pending | 驳回 modal + 撤销 modal + 审批历史时间线组件 + 业务单状态回退提示 |
| **T-E3** e2e spec 补 | 0.1 | pending | `nc-interface.spec.ts`（5 接口）+ `approval-cycle.spec.ts`（驳回 / 撤销 / 历史 / 业务单回退）|

### D 顺延说明

- ~~D 线 NC/财务接口顺延~~：**Sprint 20r 已激活 / Sprint 20s 正式真联调 / D 线高峰**
- T-B1-B5 Sprint 20n part 2 协调试点：**与 Sprint 20s 并行 / 不阻塞 / 试点反馈 ≥ 2 周供 T-A3 runbook V0.3 升版**

---

## 三、关键节奏

### 3.1 Sprint 20s 性质（NC 主推 sprint / vs Sprint 20r NC 启动对比）

| 维度 | Sprint 20r（NC 启动）| **Sprint 20s（NC 主推）** |
|---|---|---|
| NC 状态 | UseMock=false 切换 + OAuth2 真接通 | **5 InterfaceCode 真联调 + chaos 实战 + 真号回写自动化** |
| Main PD | ~1.3 | **~2.1（NC 主推 / 工作量高 50-75%）** |
| 主轨任务数 | 5（A1-A5）| 5（A1-A5）|
| 风险 | NC 启动失败回退方案 | **真号回写错误 + 业务方验收风险 + Polly chaos 不完整** |
| 业务方协调 | G-12 推进（cici）| **三方 demo（财务+物资+IT / cici 协调高负载）** |
| 子代理 | 1-2 spawn | **2-3 spawn（T-A1 5 接口 grep + T-A2 撤销 API + runbook V0.3）** |

### 3.2 wall-clock 估算

- main 主轨：3-4 天（NC 5 接口实测 +1 天 / vs Sprint 20r 2 天）
  * Day 1：T-A1（0.3 PD / 5 接口 grep + payload 实测前 2 接口）
  * Day 2：T-A1（0.3 PD / 5 接口 chaos 实战 + Hangfire 监控）+ T-A2（0.3 PD / 撤销 API + 审批历史）
  * Day 3：T-A2（0.2 PD / 业务单回退 + RBAC）+ T-A3（0.4 PD / runbook V0.3 升版）
  * Day 4：T-A4（0.2 PD / cici demo 协调）+ T-A5（0.4 PD / Codex + V0.x + roadmap V0.3 §2.4）
- 业务方验收：cici 协调多方 / 不确定（多 demo 反馈窗口）
- part 2 协调：3-4 周持续（与 Sprint 20s 并行 / 不阻塞）

### 3.3 第 4 周期 5 Sprint 节奏（V0.1 起草时状态）

| Sprint | 性质 | 工作量 | 备注 |
|---|---|---|---|
| Sprint 20p | 协调 + 试点验证 + UI 完善 | 1.2 PD | ✅ done（V0.2 cici 拍板）|
| Sprint 20q | 合同模块 协调 sprint（推测 / 待回填）| 1.2 PD（推测）| ⏳ 待回填 / 类 20p 协调模式 |
| Sprint 20r | NC 真联调启动 | 1.3 PD | ⏳ 待 NC 启动 / Sprint 20s 前置 |
| **Sprint 20s（本）** | **NC 主推 + 审批闭环 + runbook V0.3** | **2.1 PD** | **第 4 周期高峰** |
| Sprint 20t | 第 4 周期收尾 + Q3 末 production deployment | 2.2 PD | 硬截止 deadline |

---

## 四、关键决策点（cici V0.1→V0.2 待拍板）

| # | 决策 | 选项 | 推荐 | **cici 拍板** |
|---|---|---|---|---|
| **Q1** | T-A1 5 接口实测顺序 | A. 全 5 接口并行（最快 / 风险高）/ B. 按业务优先级 BIZ-MR → PAY → PAY-BATCH → 007 → RED（业务方关心顺序）/ C. 按风险升序 BIZ-MR（最易）→ PAY → 007 → RED → PAY-BATCH（最难） | **B 默认**（业务方优先级高 / 财务+物资 demo 同期推进 / cici 决策窗口对齐）|
| **Q2** | T-A3 runbook V0.3 升级深度 | A. 大幅（V0.2 → V0.3 完整重构 / 增 ~200 行 / 0.6 PD）/ B. 核心实战修正（§十一+§十二 双占位补完 + §二/四/五/七 实战项补 / 增 ~76 行 / 0.4 PD）/ C. 微调（仅 §十二 NC 真接通补完 / 增 ~30 行 / 0.2 PD）| **B 默认**（双占位章节 V0.3 升版触发条件已明 / 试点反馈 + NC 真联调实战必须吸收 / 0.4 PD 合理）|
| **Q3** | 审批闭环驳回后业务单状态机 | A. 自动回退到草稿状态（用户体验好 / 业务单状态机重新设计）/ B. 保留待审批状态 + 提示用户重新发起（最简 / 兼容现 Rejected 终态模式）/ C. cici Day 2 答（基于 T-A2 撤销 API 实施情况）| **C 默认**（Day 2 撤销 API 实施情况影响业务单状态机设计 / 不预先拍板防返工）|
| **Q4** | NC demo 业务方验收范围 | A. 财务（李建颖）+ 物资（汤云龙）+ IT 三方（最完整 / cici 协调高负载）/ B. 仅财务（李建颖凭证导入验收 / 最聚焦）/ C. 仅 cici demo（cici 验收后再扩展 / 最低风险）| **A 默认**（NC 真接通涉及三方协同 / 19r D1 9/9 反馈模式成熟 / cici 协调负载可控）|
| **Q5** | second e 副轨范围 | A. T-E1+T-E2+T-E3 全（NC 监控 + 审批 UI + e2e / 0.6 PD）/ B. 仅 T-E1 NC dashboard（0.3 PD / 简化）/ C. 暂停（类 20o）| **A 默认**（NC 真联调需 dashboard 监控真数据 / 审批闭环 UI 必须同步 / second 第 13+ 次连续 / 模块切换至 NC + 审批）|

---

## 五、风险与依赖

### 5.1 高风险

- **NC 真联调 5 接口实测错误码 / 真号回写 / chaos 实战不完整**：NC 侧错误码协议可能与 NCC OpenAPI 公开资料不完全一致 / 真号回写 webhook vs poll 模式 cici Q1 拍板待 Sprint 20r 启动后定 / Polly chaos 5 场景 WireMock 实测 vs 真 NC 环境差异
  * **缓解**：T-A1 验证报告 ≥ 120 行 / 错误码表完整 / Polly chaos 5 场景实测留痕 / 失败回退方案文档化 / Sprint 20r T-A3 失败回退方案前置
- **业务方验收不通过（cici 协调失败 5 月反模式 #1 cici 单点）**：NC demo 三方协同 / cici 协调负载显著 / 反馈窗口不稳定风险
  * **缓解**：T-A4 反馈窗口模式参考 [[feedback_business_party_coordination_failure]] / cici demo 前 1 天准备反馈表 / 19r D1 9/9 反馈模式复用

### 5.2 中风险

- **审批闭环驳回业务单状态机重新设计 / cici Q3 Day 2 答风险**：驳回 → 业务单 OnRejected 事件 + 通知发起人 / 状态机回退路径复杂
  * **缓解**：T-A2 Day 2 撤销 API 实施后 cici Q3 拍板入 V0.2 / 状态机回退路径单测覆盖 ≥ 90%
- **runbook V0.3 实战修正项不足（试点反馈 ≥ 2 周条件未达）**：Sprint 20n part 2 试点反馈累积速度可能 < 2 周
  * **缓解**：T-A3 优先吸收 NC 真联调 chaos 实战 / 试点反馈不足时 §十一占位章节 V0.3 部分补完 / 剩余 Sprint 20t T-A3 续推

### 5.3 低风险

- **OAuth2 + Polly + WireMock chaos 已实测**（[[oauth2-client-credentials-pattern]] 5 要点 Sprint 17a 验证）
- **NC 单边架构基础成熟**（17a-19q 单边架构 + 凭证导出 production-ready）
- **NC 5 接口 Stub Generator 全在仓**（`Vouchers/Stubs/` 5 文件确认）
- **审批 RejectAsync 基础完全在仓**（[[carryover-task-verify-first]] / Sprint 20s grep 模式延续）
- **NC 真联调 chaos 防御链**（Polly 三层 + WireMock 5 场景 + Hangfire 监控 + dashboard NcSuccessRate）

### 5.4 主要依赖

- Sprint 20r NC 真联调启动 done（前置 / Sprint 20s T-A1 触发）
- Sprint 20n part 2 试点反馈累积 ≥ 2 周（Sprint 20s T-A3 runbook V0.3 升版触发）
- cici 拍板 5 决策点（Q1-Q5）
- 业务方 G-12 NC OAuth2 凭证 + NC 侧联调环境维持稳定（Sprint 20r 触发后 Sprint 20s 持续）
- cici 协调财务+物资+IT 三方 demo 窗口（T-A4）

---

## 六、对外汇报口径

> Sprint 20s 第 4 周期第 4 阶段 NC 真联调主推：NC 5 接口实测（BIZ-MR / RED / 007 / PAY / PAY-BATCH 全真接通 + 真号回写 + chaos 实战 + Hangfire 监控）+ 审批闭环（驳回 + 撤销 + 历史 + 业务单回退 + RBAC）+ production runbook V0.2 → V0.3（双占位章节实战补完）+ 三方业务方 demo 验收（财务+物资+IT）/ 目标 47 Sprint 0 顺延达成（Sprint 20o 43 + 20p+20q+20r+20s = 47）。NC 单边架构 17a-19q 累积转为真联调 production-ready / 第 4 周期高峰 sprint。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17（待 Sprint 20r NC 启动后 cici 拍板升 V0.2 / 预计 2026-05-20+）| main 主代理 a 起草 / NC 主推 sprint / 5 task ~2.1 PD（vs 协调 sprint 20p 1.2 PD 高 75%）/ NC 5 接口 grep 重大发现（5 Stub Generator + 14+ Contributor 全在仓）/ 审批闭环 grep 发现（RejectAsync 完全在仓 / Cancel + 历史 + 业务单回退集成待补 / 工作量 0.5 PD）/ runbook V0.2 §十一+§十二 占位章节升 V0.3 实战版触发条件已明 / 5 决策待 cici V0.2 答（Q1 5 接口实测顺序 / Q2 runbook V0.3 升级深度 / Q3 驳回后业务单状态机 cici Day 2 答 / Q4 三方 demo 验收范围 / Q5 second e 副轨范围）/ T-A5 含 roadmap V0.2 → V0.3 §2.4 修正提示 |

---

**Created**: 2026-05-17 / Sprint 20p 第 4 周期开局 V0.2 后 + 第 3 周期数据治理收尾 → Sprint 20s V0.1 起草 / 待 Sprint 20r NC 启动后回填前置事实 + cici 拍板 5 决策 / **预计 2026-05-25+ 启动 Day 1** / main 主代理 a

**Related**:
- [`Sprint-20p-任务卡-V0.2.md`](Sprint-20p-任务卡-V0.2.md)（同 cycle 协调 sprint 模板 / 5 task 1.2 PD / cici 5 决策全默认拍板）
- [`Sprint-20n-任务卡-V0.4.md`](Sprint-20n-任务卡-V0.4.md)（协调 sprint Wave 1 完整闭环参考 / Round 14 0 finding 收敛）
- [`Sprint-20m-任务卡-V0.2.md`](Sprint-20m-任务卡-V0.2.md)（开发 sprint 完整闭环参考 / Round 10 首次 0 finding 收敛）
- [`../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md`](../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md) V0.1（第 4 周期 roadmap / §2.4 Sprint 20s NC 真联调主推 + 审批闭环 / 待 T-A5 修正 V0.3）
- [`../../SupplyCores/docs/部署/production-deployment-runbook-V0.2.md`](../../SupplyCores/docs/部署/production-deployment-runbook-V0.2.md)（V0.2 → V0.3 实战升级 / T-A3 主轨 / §十一+§十二 双占位章节）
- [`../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md`](../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md) V0.1（第 3 周期复盘）
- [[feedback_codex_0_carryover_8_sprint_record]]（43 Sprint 0 顺延记录 / Sprint 20s 目标 47 Sprint）
- [[feedback_oauth2_client_credentials_pattern]]（OAuth2 5 要点 Sprint 17a 实测 / T-A1 NC 真联调直接复用）
- [[feedback_nc_interface_unilateral_json_strategy]]（17a-19q 单边架构 / T-A1 真联调升级基础）
- [[feedback_nc_interface_sprint_pattern]]（NC 域 3 Sprint 完整闭环节奏 / Sprint 20r 启动 + 20s 主推 + 20t 收尾对齐）
- [[reference_nc_ncc_openapi_format]]（NCC OpenAPI 公开资料参考 / T-A1 真接通错误码 / state 1or2 响应）
- [[project_po_meeting_2026_05_16_nc_voucher_export]]（PO 决策 NC 凭证导出 / 第 4 周期 D 线激活触发条件 / Sprint 20r 触发后 Sprint 20s 主推）
- [[main_orchestrator_default_spawn]]（main 编排者新规则 / Sprint 20s 子代理 2-3 spawn）
- [[carryover_task_verify_first]]（顺延 task D1 必先 grep / curl / 实测 / Sprint 20s T-A1 NC 5 接口 + T-A2 审批闭环 grep 验证模式）
- [[feedback_dual_session_19t_continuous_validation]]（second e 第 13+ 次连续 / NC + 审批模块切换）
- [[feedback_business_party_coordination_failure]]（5 月反模式根因 #1 cici 单点 / T-A4 三方 demo 协调监测）
- [[feedback_sprint20l_4_5x_subagent_parallel_pattern]]（子代理并行模式 / T-A1 + T-A2 + T-A3 三轨并行评估）
- [[reference_voucher_storage_pattern]]（凭证文件存储模式 / NC 凭证导出 production-ready 基础）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 / 第 4 周期业务模块扩大）
