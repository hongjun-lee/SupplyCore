# Sprint 4 任务卡 — 招投标全链收尾 + 合同执行收尾 + 入库/出库扩展 + V0.5 政策驱动增量吸收（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 / 待评审）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（待评审）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 4（预估 10 工作日 / 约 2 周）
**衔接文档：**

- 上游 Sprint 节奏 → [`Sprint-3-任务卡-V0.3.md`](./Sprint-3-任务卡-V0.3.md) §三 Sprint 4 衔接
- 上游工时模型 → [`开发进度规划-V0.5.md`](../详细设计/开发进度规划-V0.5.md) §3.3 V0.4→V0.5 11 项政策驱动增量
- 详设依据：04 §4.10-4.13 / 05 §4.4-4.8 / 06 §4.6+ / 07 §外委检修 / 10 §V1.2 4 新审批模板
- Sprint 3 落地基线 → commit `c3cdb03`（D9 收尾，264 测试通过）

---

## 一、目标与范围

### 1.1 目标（待评审切片）

Sprint 4 范围**候选**（V0.5 §3.3 + Sprint 3 衔接累积），10 PD 装不下全部，需评审切片：

**A. 招投标全链收尾**（V0.3 衔接，~6 PD）：
- T-03 标包（详设 04 §4.10.1，~2 PD）
- T-04 采购文件（详设 04 §4.11，~1 PD）
- T-06 评标委员会（~1 PD）
- T-07 标包明细（~1 PD）
- 招投标外部对接缓冲（招采平台 +30 PD，非主线）

**B. 合同执行收尾**（V0.3 衔接，~6 PD）：
- C-03 合同条款（详设 05 §4.3，~1 PD）
- C-04 合同付款节点（~1.5 PD）
- C-06 合同终止单（~1 PD）
- C-07~C-10 付款流程（应付/付款节点/付款申请/付款执行，~2.5 PD）

**C. V0.5 政策驱动增量**（V0.5 §3.3 11 项，~12 PD）：
- 外委检修专项 +20 PD（07 设备，部分前置准备：E-05 字段 + WF-RPR-001 mock）
- 履约保证金 `bond_required` 触发规则（05 +2 PD，**C-02 字段补 7 个**详设 §8.6.6）
- 4 新审批模板（10 +10 PD，依赖 Catio Workflow）
- 暂估 D-90/D-30 双预警（06 +2 PD，含 BIZ-002/003 NC 接口）
- 超储三级处置（06 +8 PD）
- 后评价自动联动 WF-SUP-REASSESS-001（09 +3 PD）

**D. 入库/出库扩展**（详设 06，~5 PD）：
- S-04 质检让步（~1 PD）
- S-06 采购退货（~1.5 PD）
- S-09 领料出库（~1.5 PD）
- S-10 退料入库（~1 PD）

**E. Stage B1 切换**（远端衔接，~3 PD）：
- NovaSync HttpReader 切换（OAuth 凭据到位后）
- Catio Workflow 真实联调（依赖 10A V1.1 §九 Bis 回函）
- NC 真实接入（依赖 08B 外发函回函；内部用 08A 底稿消化）

### 1.2 待评审切片建议

Sprint 4 V0.1 草案先列全 5 类（A~E）总 ~30 PD；评审拍板切到 10 PD。建议候选切片：

**切片方案 1（保守，仅延伸 Sprint 3 + 履约保证金）**：
- A 段（T-03/T-04/T-06/T-07，5 PD）
- B 段（C-04 付款节点 + C-06 终止单，2.5 PD）
- C 段履约保证金（含详设 05 V1.2 升版 + C-02 加 7 字段，2 PD）
- D 段 S-04 质检让步（1 PD）
- 验收 + Demo + Sprint 5 草案（0.5 PD）
- **小计 11 PD（略紧）**

**切片方案 2（激进，含外委检修起步）**：
- 同方案 1 + 减 D 段 + 加外委检修起步（E-05 字段 + WF-RPR-001 mock，3 PD）
- **小计 ~10 PD**

**切片方案 3（保守 + Stage B1 切换）**：
- 同方案 1 + 减 A 段 T-06/T-07 + 加 Stage B1 NovaSync HttpReader 切换（2 PD）
- **小计 10 PD**
- 优势：消除 OAuth 凭据风险阻塞，Sprint 5+ 可基于真 Catio 推进

### 1.3 基线

- ✅ Sprint 3 commit `c3cdb03` 已 push（D0-D9，264 测试通过）
- ✅ EF migrations 13 条全部 apply（含 D0 schema_move）
- ✅ Sprint 3 全链 E2E 通过（P-05→T-01→T-05 / C-05→C-02 / S-05→C-02 执行中 + NC）
- ✅ sub_group_id 守护单测自动覆盖 Sprint 3 新增 5 实体
- ✅ 8 schema 全部启用（m / p / t / c / s / e / f / a / sy；e/f/r 待 Sprint 4+ 业务实体落地）

### 1.4 不在范围

- T-04 招标公告内容详化（仅落 entity，业务侧公告渲染留 Sprint 5+）
- C-07~C-10 付款流程（若方案 1 含 C-04 仅，付款流程留 Sprint 5）
- 09 报表预警与 AI 能力（Sprint 5+）
- 详设 07 设备模块完整落地（V0.5 +20 PD，单独 Sprint）
- 10 权限审批 V1.2 4 新审批模板完整（依赖 Catio Workflow 真实联调）

### 1.5 完成标准（Sprint 4 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 280 通过（Sprint 3 基线 264 + Sprint 4 新增 ~20）
- [ ] 新增 EF migrations ≥ 4 条（按切片定）
- [ ] Sprint-4-Demo-脚本 V0.1 入库
- [ ] commit log 整洁

---

## 二、按日任务拆解（切片方案 1，待评审）

> ⚠ 以下任务按切片方案 1 起草；V0.2 升版时按评审结果调整。

### Day 1-2 — 招投标完整 T-03/T-04/T-06/T-07

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | T-03 TenderPackage 实体 + 6 状态机 | 04 §4.10.1 | 单测 ≥ 5 |
| D1-2 | T-04 ProcurementDocument 实体（采购文件）| 04 §4.11 | 字段对齐 |
| D1-3 | T-07 TenderPackageLine 实体（标包明细，关联 P-03 + M-05）| 04 §4.10.2 | 字段对齐 |
| D1-4 | EF mapping + Add_TenderFull migration | — | apply 通过 |
| D2-1 | T-03 / T-04 / T-07 AppService + Controller | 04 §4.10-4.11 | 单测 ≥ 8 |
| D2-2 | T-06 EvaluationCommittee 实体（评标委员会，最小可用版）| 04 §4.13 | 字段对齐 |
| D2-3 | T-05 PackageId 改 NOT NULL（Sprint 3 D3 留的 nullable 收口）| Sprint 3 D3 备注 | migration + 单测无回归 |

**预估工时：** 2 PD

### Day 3 — C-04 付款节点 + C-06 合同终止单

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D3-1 | C-04 ContractPaymentNode 实体（详设 05 §4.4）+ 4 状态机 | 05 §4.4 | 单测 ≥ 4 |
| D3-2 | C-06 ContractTermination 实体 + 4 状态机 | 05 §4.6 | 单测 ≥ 4 |
| D3-3 | EF mapping + 2 migration | — | apply 通过 |
| D3-4 | C-04 / C-06 AppService + Controller | 05 §4.4 / §4.6 | 单测 ≥ 5 |
| D3-5 | C-03 ContractClause 实体（合同条款，详设 §4.3）| 05 §4.3 | 字段对齐 |

**预估工时：** 1.5 PD

### Day 4 — 履约保证金 `bond_required`（V0.5 §3.3 #11）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D4-1 | **详设 05 V1.1 → V1.2 升版**：§4.2.1 字段表加 §8.6.6 履约保证金 7 字段 + §8.7 service_subtype 字段 | 详设 05 V1.2 升版 | 详设文档入库 |
| D4-2 | C-02 实体加 BondRequired / BondAmount / BondForm / BondState / BondPaidDate / BondReleaseDate / BondReleaseTrigger + ServiceSubtype 8 字段 | 详设 05 V1.2 §4.2.1（升版后）| 字段对齐 |
| D4-3 | EF migration Add_Contract_BondFields | — | apply 通过 |
| D4-4 | ContractAppService.Approve 时自动判 bond_required（详设 §8.6.1：金额≥20万 + 竞争性方式）| 详设 §8.6.1 | 单测 ≥ 3 |
| D4-5 | bond_state 4 状态枚举 + 状态机方法（待缴纳 / 已缴纳 / 已退还 / 已没收）| 详设 §8.6.6 | 单测 ≥ 4 |
| D4-6 | SENS-CON-003 没收高敏感拦截器（详设 §8.6.7 + 10 §7）| 详设 10 V1.2 §7.1 | 单测 ≥ 2 |

**预估工时：** 2 PD

### Day 5 — S-04 质检让步

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D5-1 | S-04 QualityInspection 实体 + 5 状态机（详设 06 §4.3）| 06 §4.3 | 单测 ≥ 5 |
| D5-2 | EF mapping + Add_QualityInspection migration | — | apply 通过 |
| D5-3 | AppService + Controller + 让步入库联动 S-05（让步数量生成 S-05 让步入库）| 06 §4.3 业务规则 | 单测 ≥ 5 |

**预估工时：** 1 PD

### Day 6-7 — 集成测试 + 守护 + 优化

| # | 任务 | 验收 |
|---|------|------|
| D6-1 | Sprint4FullChain_E2E：T-01 → T-03/T-04/T-07 → T-05 → T-06 评标 → C-02（含 bond_*）→ S-04 让步 → S-05 入库 | 1 个 E2E 通过 |
| D6-2 | sub_group_id 守护单测自动覆盖新增（T-03/T-04/T-06/T-07/C-03/C-04/C-06/S-04/S-22）| 守护单测全过 |
| D7-1 | 全量回归 ≥ 280 通过 | 0 失败 |
| D7-2 | 性能优化：sub_group_id 索引 P95 监控（如 EFCore.Tests 加查询响应基线断言）| 可选 |

**预估工时：** 2 PD

### Day 8-9 — Stage B1 OAuth + Catio Workflow + NC 真实接入起步

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D8-1 | **依赖外部回函**：Catio 10A V1.1 §九 Bis 回函检查；如就绪，启动 NovaSync HttpReader 切换 | NovaSync 切换方案 V0.1 | 切换方案落地或登记延后 |
| D8-2 | **依赖外部回函**：NC 团队 08B 外发函回函检查；如就绪，启动 BIZ-001 真实接口切换（Sprint 3 mock 替换）| 08B 外发函 V0.1 + 08A 内部底稿 V0.2 | 切换方案落地或登记延后 |
| D9-1 | Catio Workflow 真实联调：C-01 多方会签 chain 解析（替换 Sprint 2 单签 mock） | 详设 10 V1.2 §4.6 | 单测 + E2E |
| D9-2 | 4 新审批模板（WF-DIR / WF-RPR / WF-CON-OVERLIMIT / WF-SUP-REASSESS）配置（V0.5 §3.3 #3）| 详设 10 V1.2 | 模板配置入库 |

**预估工时：** 2 PD（若外部依赖延期则部分降级到登记）

### Day 10 — Sprint 4 验收 + Demo + Sprint 5 backlog

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 280 通过 | 0 失败 |
| D10-2 | Sprint 1-3 Demo 用例 1-14 回归；新增用例 15-18（招投标完整 / 合同执行 / 履约保证金 / 质检让步）| 全 200 OK |
| D10-3 | `docker compose up` 容器内跑全套 | 全通过 |
| D10-4 | 写 `Sprint-4-Demo-脚本-V0.1.md` | 入库 |
| D10-5 | 起 Sprint 5 任务卡草案：外委检修专项 + 暂估双预警 + 超储三级 + 后评价联动 + 09 报表 + 出库 S-09/S-10/S-12 | `Sprint-5-任务卡-V0.1.md` 草案入库 |
| D10-6 | 整理 Sprint 4 commit log | git log 整洁 |

**预估工时：** 1 PD

---

## 三、Sprint 5+ 衔接 + V0.5 §3.3 剩余增量吸收路径

### 3.1 Sprint 5（下一个 Sprint，~10 PD 候选）

| 重点 | 详设依据 | V0.5 §3.3 关联 |
|------|---------|-----|
| 外委检修专项（07 模块 +20 PD 分两 Sprint）| 政策 01/02 + 流程 14 + 详设 07 | #1 +25 PD |
| 暂估闭环 D-90/D-30 双预警 + BIZ-002/003 NC | 详设 06 + 09 + 11 | #5 +5 PD |
| 超储三级处置 | 政策 04 + 详设 06 | #6 +8 PD |
| 出库 S-09 / S-10 / S-12 跨组织调拨 | 详设 06 §4.7-4.9 | — |

### 3.2 Sprint 6+ 衔接

- 09 报表预警与 AI 能力（11 报表 + 13 预警 + 8 AI Tool + 6 看板，~250 PD 跨多 Sprint）
- 后评价自动联动 WF-SUP-REASSESS-001（V0.5 §3.3 #7）
- 集团并行会签 A4（V0.5 §3.3 #12，依赖详设 10 V1.2）
- 多二级集团扩展（清能 / 铁煤 / 沈煤 等 10 家二级集团）

### 3.3 政策驱动 V0.5 §3.3 11 项吸收路径

| # | 增量 | 落地 Sprint | 备注 |
|---|------|------------|------|
| 1 | 外委检修专项 | Sprint 5-6 | 跨两 Sprint（07 大模块 +20 PD）|
| 2 | WF-DIR-001 直达例外 | Sprint 4 D9 | Catio Workflow 真实联调时一并接 |
| 3 | 4 新审批模板 | Sprint 4 D9 | 同上 |
| 4 | 2 新高敏感 SENS-CON-003/004 | Sprint 4 D4 | SENS-CON-003 履约保证金没收一并落 |
| 5 | 暂估 D-90/D-30 双预警 | Sprint 5 | 09 报表预警关联 |
| 6 | 超储三级处置 | Sprint 5 | 06 库存 |
| 7 | 后评价自动联动 | Sprint 6 | 09 报表 + 10 审批 |
| 8 | S-01 fulfillment_type | Sprint 4 D5 | 落 S-04 时一并补 S-01 字段 |
| 9 | 委托加工受托虚拟仓 | Sprint 6+ | 06 + 08 |
| 10 | 第四批 E 类必补 5 项 | Sprint 5-6 | 07 设备 |
| 11 | 履约保证金 `bond_required` | **Sprint 4 D4** | ⭐ 本 Sprint 主要 V0.5 增量 |
| 12 | 集团并行会签 A4 | Sprint 6+ | Catio Workflow V1.2 |
| 13 | sub_group_id 全链路 | ✅ 已落 Sprint 1-2 | — |
| 14 | NovaSync 切换方案 | Sprint 4 D8 起步 | Stage B1 |

---

## 四、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 详设 05 V1.2 升版与 D4 履约保证金落地冲突 | 中 | D4 前置依赖详设升版 | D4-1 第一动作；详设升版与代码落地一周内合并 |
| Catio Workflow OAuth 凭据延期 | 高 | D9 真实联调降级 | 提前 1 Sprint 申请 + Mock 模式继续 |
| NC 08B 回函延期 | 中 | D8 NC 真接降级 | Sprint 3 mock 继续；08B 回函到位即切，08A 内部底稿用于字段消化 |
| 招投标外部对接（招采平台）延期 | 高 | T-03/T-04 完整化滞后 | 主线不依赖外部对接，先落 entity + 状态机 |
| Sprint 4 范围切片偏紧 | 高 | 工时超 10 PD | V0.2 评审时按切片方案 1/2/3 拍板 |

---

## 五、可复用资产（Sprint 1-3 → Sprint 4 沿用）

| 资产 | 来源 | 复用方式 |
|------|------|---------|
| `SupplyCoresFullAuditedAggregateRoot<TKey>` | Sprint 1 D6 | 新业务实体继承 |
| `XxxManager.CreateDraftAsync` Domain Service | Sprint 1+ | 每个 AppService 用 Manager 触发 sub_group_id 钩子 |
| 双轨钩子（C-02 复制 / OrgId 反查）| Sprint 3 D7-2 | S-04/S-06/S-09 等同模式 |
| `IXxxLinkage` + `[ExposeServices]` 抽象 | Sprint 1+ | 新 linkage 沿用 |
| `INcInterfaceService.PushAsync` | Sprint 0 + Sprint 2/3 | BIZ-001/002/003 真接入时替换实现 |
| sub_group_id 钩子覆盖率守护单测 | Sprint 2 D5-4 | 反射自动覆盖新加业务实体 |
| Mapperly + NSubstitute 测试模板 | Sprint 0-3 | 新单测复用 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版草案，Sprint 3 D10-5 起。列 5 类候选范围（A 招投标 / B 合同执行 / C V0.5 政策驱动 / D 入库出库 / E Stage B1）共 ~30 PD；按切片方案 1 起草 §二 D1-D10（11 PD 略紧）；§三 V0.5 §3.3 11 项政策驱动增量吸收路径表。待用户评审 + 三方进度信号回函后升 V0.2 联动。|
