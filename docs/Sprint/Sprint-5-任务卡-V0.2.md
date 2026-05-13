# Sprint 5 任务卡 — Sprint 4 质量闸 + 招投标后续 + 外委检修起步（V0.2）

**项目：** 阜矿物资供应管理系统 / SupplyCore  
**版本：** V0.2（评审后锁版 / 实施基线）  
**日期：** 2026-05-13  
**文档性质：** 开发实施层 · Sprint 任务卡（实施基线）  
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 5（预估 10 工作日 / 约 2 周）

**衔接文档：**

- 上游 Sprint → [`Sprint-4-任务卡-V0.2.md`](./Sprint-4-任务卡-V0.2.md) §三
- 上游工时模型 → [`开发进度规划-V0.5.md`](../详细设计/开发进度规划-V0.5.md) §3.3 11 项政策驱动剩余增量
- 详设依据：04 §4.10-4.14 / 05 §8.7 / 06 §4.1、§4.3 / 07 §外委检修 / 10 V1.2 §4.6、§7.1
- Sprint 4 落地基线 → commit `4b7a518`（D10 收尾，345 测试通过）

---

## 一、目标与范围

### 1.1 V0.2 评审决策点（已锁版）

| # | 决策点 | 锁版结论 | 理由 |
|---|--------|----------|------|
| 1 | Sprint 5 切片 | **先 D0 修 Sprint 4 质量闸 + A 招投标后续 + 外委检修起步 + F 顺延项** | 不把 Sprint 4 的流程/数据风险带入 Sprint 5；同时兑现 T-06~T-09 与政策增量 |
| 2 | T-06/T-07/T-08/T-09 | **全 4 项一次性落** | Sprint 4 已落 T-03/T-04/T-05，Sprint 5 应补齐招投标闭环骨架，避免 T 域长期半截 |
| 3 | 外委检修 | **Sprint 5 仅起步**：E-05 字段 + WF-RPR-001 mock + 40% 上限 + SENS-CON-004 | 07 设备完整模块约 20 PD，拆到 Sprint 5-6 更稳 |
| 4 | Stage B1 真接 | **继续机会窗口，不占主线工时** | OAuth / NC 回函仍属外部依赖；就绪则插入，不就绪只登记 Sprint 6 |
| 5 | 详设升版 | **本期升 07 V1.1；必要时联动 05 V1.3 小升版** | 外委检修字段和 40% 上限必须有详设依据 |
| 6 | 总工时 | **严卡 10 PD** | Sprint 4 已出现质量债；本 Sprint 不再用超额换范围 |

### 1.2 Sprint 5 锁版范围

**D0. Sprint 4 质量闸修复（1 PD，必须先做）**

- T-03 发标前置校验：必须存在同 `PackageId` 的 T-04 已发布采购文件，否则禁止发标
- S-04 让步入库联动去硬编码：不得继续使用 `WarehouseId=1 / SupplierId=1`；来源字段取不到则显式失败或登记待补，不允许静默错入库
- T-05 `package_id NOT NULL` 迁移去掉直接 `DELETE` 业务数据，改为显式失败 / 人工回填脚本 / 可追溯修复
- Sprint 4 FullChain E2E 顺序修正：先 T-04 发布，再 T-03 发标

**A. 招投标后续（3.5 PD）**

- T-06 TenderPlatformLog 招采平台对接日志（纯日志型，无状态机）
- T-07 TenderPackageLine 标包明细
- T-08 BidResponse 投标响应
- T-09 EvaluationResult 评标结果明细

**C. 外委检修起步（3 PD）**

- 详设 07 V1.1 升版
- E-05 RepairApplication 外委检修申请最小可用版
- WF-RPR-001 mock 审批模板
- 外委检修合同 40% 原值上限校验
- SENS-CON-004 超阈值高敏感拦截器 + WF-CON-OVERLIMIT-001 触发占位

**F. Sprint 4 顺延项（1 PD）**

- S-01 `fulfillment_type` 字段补
- C-03 ContractClause AppService + Controller
- sub_group_id 索引 P95 监控基线脚本（轻量）

**D8-D10 验收收口（1.5 PD）**

- Sprint 5 集成测试 + 守护单测 + 全量回归
- Demo 脚本 + Sprint 6 backlog
- Stage B1 仅作机会窗口检查，不占主线工时

### 1.3 不在范围

- C-07~C-10 合同付款完整流程（移 Sprint 6）
- 出库扩展 S-06 / S-09 / S-10 / S-12（移 Sprint 6）
- 暂估 D-90/D-30 双预警、超储三级处置、后评价自动联动（移 Sprint 6）
- 07 设备完整模块（Sprint 6+，约 17 PD 剩余）
- 09 报表预警 AI 能力（跨 Sprint 大模块）
- Stage B1 真接主线开发（仅机会窗口）

### 1.4 基线

- ✅ Sprint 4 commit `4b7a518` 已 push（D1-D10，345 测试通过）
- ✅ EF migrations 18 条全部 apply（Sprint 4 新增 5 条）
- ✅ 详设 05 V1.1 → V1.2 升版完成
- ✅ sub_group_id 守护单测自动覆盖 Sprint 4 新增 6 实体
- ⚠ Sprint 4 评审发现 3 个质量闸问题，Sprint 5 D0 第一动作修复，不得后置

---

## 二、按日任务拆解（V0.2 锁版，10 PD 严卡）

### Day 0 — Sprint 4 质量闸修复（必须先做）

| # | 任务 | 验收 |
|---|------|------|
| D0-1 | T-03 `PublishAsync` 加 T-04 已发布采购文件前置校验 | 无已发布 T-04 时抛业务异常；负向单测 ≥ 1 |
| D0-2 | 修正 Sprint4FullChain E2E 顺序：先 T-04 发布，再 T-03 发标 | E2E 不再固化错误流程 |
| D0-3 | S-04 让步入库去硬编码仓库/供应商；来源取不到不得静默错入库 | 单测覆盖“来源缺失失败/不创建错误 S-05” |
| D0-4 | T-05 `package_id NOT NULL` 迁移去掉直接 DELETE | 迁移不再静默删业务数据 |

**预估工时：** 1 PD

### Day 1-2 — T-06 + T-07 招投标后续

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | T-06 TenderPlatformLog 实体（招采平台对接日志，纯日志型无状态机）| 04 §4.13 | 字段对齐；枚举值白名单校验；单测 ≥ 4 |
| D1-2 | T-07 TenderPackageLine 实体（关联 T-03 / P-03 / M-05，校验物料启用）| 04 §4.10.2 / §12.2 | 字段对齐 |
| D2-1 | T-06 / T-07 AppService + Controller | — | 单测 ≥ 5 |
| D2-2 | EF mapping + Add_Tender_T06_T07 migration | — | apply 通过 |

**预估工时：** 1.5 PD

### Day 3-4 — T-08 + T-09 投标响应 + 评标结果

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D3-1 | T-08 BidResponse 实体 + 状态机（提交 / 撤回 / 评标中 / 评定）| 04 §4.12 | 单测 ≥ 5 |
| D3-2 | T-09 EvaluationResult 评标结果明细 | 04 §4.14 | 字段对齐 |
| D3-3 | EF mapping + Add_Tender_T08_T09 migration | — | apply 通过 |
| D4-1 | T-08 / T-09 AppService + Controller | — | 单测 ≥ 6 |

**预估工时：** 2 PD

### Day 5-7 — 外委检修起步（V0.5 §3.3 #1）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D5-1 | 详设 07 V1.0 → V1.1 升版：E-05 外委检修字段、40% 上限、附件留存、审批引用 | 详设 07 | 详设入库 |
| D5-2 | 必要时详设 05 V1.2 → V1.3 小升版：外委检修合同补 `overlimit_reason / overlimit_approval_id` | 详设 05 §8.7 | 文档入库或明确无需升版 |
| D5-3 | E-05 RepairApplication 实体（外委检修申请）| 详设 07 V1.1 | 字段对齐 |
| D6-1 | WF-RPR-001 mock 审批模板配置 | 详设 10 V1.2 §4.6 | 模板配置入库 |
| D6-2 | 外委检修价格上限校验：合同总额 ≤ 设备原值 × 40% | 详设 05 §8.7 | 单测 ≥ 3 |
| D7-1 | SENS-CON-004 超阈值高敏感拦截器 + WF-CON-OVERLIMIT-001 审批触发占位 | 详设 10 §7.1 | 单测 ≥ 2 |

**预估工时：** 3 PD

### Day 8 — 顺延项 + 轻量性能守护

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D8-1 | S-01 SaleOrder 加 `fulfillment_type` 字段 | 详设 06 §4.1 / V0.5 §3.3 #8 | migration apply |
| D8-2 | C-03 ContractClause AppService + Controller | 详设 05 §4.3 | 单测 ≥ 4 |
| D8-3 | sub_group_id 索引 P95 监控基线脚本（轻量，不做性能专项）| 详设 11 | 脚本可运行 / 不阻塞主线 |

**预估工时：** 1 PD

### Day 9 — 集成测试 + Stage B1 机会窗口检查

| # | 任务 | 验收 |
|---|------|------|
| D9-1 | Sprint5FullChain_E2E：T-03/T-04/T-06/T-07/T-08/T-09 + E-05 + SENS-CON-004 | E2E 通过 |
| D9-2 | sub_group_id 守护单测自动覆盖新增实体 | 守护单测全过 |
| D9-3 | 全量回归 | ≥ 380 通过 / 0 失败 |
| D9-4 | Stage B1 机会窗口检查：Catio OAuth / NC 08B 回函 / Workflow 真接是否就绪 | 就绪则小步接入；未就绪登记 Sprint 6，不阻塞 |

**预估工时：** 1 PD（Stage B1 不占主线，作为检查项）

### Day 10 — Sprint 5 验收 + Demo + Sprint 6 backlog

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 380 通过 | 0 失败 |
| D10-2 | Sprint 1-4 Demo 用例回归 + 新增用例 19-22 | 全 200 OK |
| D10-3 | `docker compose up` 容器内跑全套 | 全通过 |
| D10-4 | 写 `Sprint-5-Demo-脚本-V0.1.md` | 入库 |
| D10-5 | 起 Sprint 6 任务卡草案：付款 C-07~C-10 / 出库 S-06,S-09,S-10,S-12 / 设备完整 / 暂估双预警 / 超储三级 | `Sprint-6-任务卡-V0.1.md` 草案 |
| D10-6 | 整理 Sprint 5 commit log | git log 整洁 |

**预估工时：** 0.5 PD

**Sprint 5 V0.2 总工时：** 1 + 1.5 + 2 + 3 + 1 + 1 + 0.5 = **10 PD ✓**

---

## 三、Sprint 6+ 衔接 + V0.5 §3.3 剩余增量

### 3.1 Sprint 6（候选范围，~10-15 PD）

| 重点 | 详设依据 | V0.5 §3.3 关联 |
|------|---------|----------------|
| C-07~C-10 付款流程 | 详设 05 §4.7-4.10 | — |
| 出库 S-06 / S-09 / S-10 / S-12 | 详设 06 §4.6-4.9 | — |
| 07 设备完整模块（剩余约 17 PD） | 详设 07 V1.1 | #1 +20 PD |
| 暂估 D-90/D-30 双预警 + BIZ-002/003 NC | 详设 06 + 09 + 11 | #5 +5 PD |
| 超储三级处置 | 政策 04 + 详设 06 | #6 +8 PD |
| 后评价自动联动 WF-SUP-REASSESS-001 | 详设 09 + 10 | #7 +3 PD |

### 3.2 Sprint 7+ 衔接

- 09 报表预警与 AI 能力（11 报表 + 13 预警 + 8 AI Tool + 6 看板，~250 PD 跨多 Sprint）
- 集团并行会签 A4（V0.5 §3.3 #12，依赖详设 10 V1.2）
- 多二级集团扩展（清能 / 铁煤 / 沈煤 等 10 家二级集团）
- 委托加工受托虚拟仓（V0.5 §3.3 #9）
- Stage B1 真接：OAuth / NC / Workflow 外部依赖到位后小步切换

### 3.3 政策驱动 V0.5 §3.3 14 项落地路径

| # | 增量 | 落地 Sprint | 备注 |
|---|------|------------|------|
| 1 | 外委检修专项 | **Sprint 5 起步** + Sprint 6 完整 | Sprint 5 落 E-05 + WF-RPR-001 mock + 价格上限 |
| 2 | WF-DIR-001 直达例外 | Sprint 6 | 依赖 Catio Workflow 真接 |
| 3 | 4 新审批模板 | Sprint 5 起步 / Sprint 6 完整 | WF-RPR/WF-CON-OVERLIMIT 先落 mock |
| 4 | 2 新高敏感 SENS-CON-003/004 | ✅ Sprint 4 D5-2（003）+ Sprint 5 D7-1（004） | — |
| 5 | 暂估 D-90/D-30 双预警 | Sprint 6 | 09 报表预警 |
| 6 | 超储三级处置 | Sprint 6 | 06 库存 |
| 7 | 后评价自动联动 | Sprint 6 | 09 + 10 |
| 8 | S-01 fulfillment_type | **Sprint 5 D8** | Sprint 4 顺延 |
| 9 | 委托加工受托虚拟仓 | Sprint 7+ | 06 + 08 |
| 10 | 第四批 E 类必补 5 项 | Sprint 5-6 | 07 设备 |
| 11 | 履约保证金 `bond_required` | ✅ Sprint 4 D4-5 完成 | — |
| 12 | 集团并行会签 A4 | Sprint 7+ | Catio Workflow V1.2 |
| 13 | sub_group_id 全链路 | ✅ 已落 Sprint 1-4，Sprint 5 继续守护 | — |
| 14 | NovaSync 切换方案 | 机会窗口 / Sprint 6 | 外部凭据到位后切 |

---

## 四、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| Sprint 4 质量闸不先修，后续 E2E 固化错误流程 | 高 | 招投标和库存联动口径偏离 | D0 第一动作修复，不得后置 |
| T-06~T-09 一次性补齐压缩工时 | 中 | Day 3-4 超时 | 严格做字段 + 业务规则 + AppService 最小可用版，平台对接细节不进本 Sprint |
| 详设 07 V1.1 升版与代码落地互相阻塞 | 中 | D5-D7 延期 | D5-1 第一动作；文档与代码同周收口 |
| Catio Workflow OAuth 凭据继续延期 | 高 | Stage B1 不能真接 | Stage B1 仅机会窗口，不占主线 |
| NC 08B 回函继续延期 | 中 | BIZ 真接不能落 | Sprint 5 不承诺 NC 真接；继续用 Mock / 接口抽象 |
| 外委检修业务方细节未全部确认 | 中 | E-05 字段返工 | Sprint 5 只做起步，完整设备专项留 Sprint 6 |

---

## 五、可复用资产（Sprint 1-4 → Sprint 5 沿用）

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | 新业务实体继承 |
| `XxxManager.CreateDraftAsync` Domain Service | Sprint 1+ | 每个 AppService 用 Manager 触发 sub_group_id 钩子 |
| 双轨钩子（C-02 复制 / OrgId 反查）| Sprint 3 D7-2 | T-06/T-07/T-08/T-09/E-05 同模式 |
| `INcInterfaceService.PushAsync` + Mock | Sprint 0 + 2/3 | BIZ 真接时替换实现 |
| `SensitiveOperationAttribute` + AuditingStore | Sprint 2 D9-D10 + Sprint 4 D5-2 | SENS-CON-004 沿用 |
| sub_group_id 守护单测覆盖率 | Sprint 2 D5-4 | 反射自动覆盖新实体 |
| 详设升版“三动作同 commit” | Sprint 1+ | 详设 07 V1.1 / 05 V1.3 复用 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，Sprint 4 D10-5 起。列 6 类候选范围（A 招投标后续 / B 付款流程 / C V0.5 政策驱动 / D 出库扩展 / E Stage B1 真接续作 / F 顺延）共 ~28 PD；推荐方案 4（招投标后续 + 外委检修起步 + S-01 + Stage B1）+ 6 决策点待用户评审。Sprint 4 D9 机会窗口未达成（OAuth + 08B 回函均未到），Stage B1 真接续作转 Sprint 5 D9 主线。 |
| V0.2 | 2026-05-13 | 评审拍板锁版：(1) 先设 D0 修 Sprint 4 三个质量闸：T-03 发标前置 T-04 已发布、S-04 让步入库去硬编码/失败不静默、T-05 NOT NULL 迁移去直接 DELETE；(2) T-06/T-07/T-08/T-09 全 4 项一次性补齐；(3) 外委检修 Sprint 5 仅起步，设备完整留 Sprint 6；(4) Stage B1 继续机会窗口，不占主线；(5) 本期升 07 V1.1，必要时联动 05 V1.3；(6) 总工时严卡 10 PD。§二 按 1+1.5+2+3+1+1+0.5 重排，总 **10 PD ✓**。 |
