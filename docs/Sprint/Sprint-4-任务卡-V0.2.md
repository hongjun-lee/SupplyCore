# Sprint 4 任务卡 — 招投标延伸 + 合同执行 + 履约保证金 + 质检让步（V0.2）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（评审后锁版 / 实施基线）
**日期：** 2026-05-13
**文档性质：** 开发实施层 · Sprint 任务卡（实施基线）
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 4（预估 10 工作日 / 约 2 周）
**衔接文档：**

- 上游 Sprint 节奏 → [`Sprint-3-任务卡-V0.3.md`](./Sprint-3-任务卡-V0.3.md) §三 Sprint 4 衔接
- 上游工时模型 → [`开发进度规划-V0.5.md`](../详细设计/开发进度规划-V0.5.md) §3.3 V0.4→V0.5 11 项政策驱动增量
- 详设依据：04 §4.10-4.13 / 05 §4.4-4.8 / 06 §4.6+ / 07 §外委检修 / 10 §V1.2 4 新审批模板
- Sprint 3 落地基线 → commit `c3cdb03`（D9 收尾，264 测试通过）

---

## 一、目标与范围

### 1.1 目标（V0.2 锁版）

Sprint 4 范围按 V0.2 评审 6 决策点锁版（详 §六 V0.2 沿革），**严卡 10 PD**：

**A. 招投标延伸**（V0.3 衔接，1.5 PD）：
- T-03 标包（详设 04 §4.10.1）
- T-04 采购文件（详设 04 §4.11）
- T-05 PackageId NOT NULL 收口（Sprint 3 D3 留的 nullable）
- ⚠ T-06 评标委员会 / T-07 标包明细 → 延 Sprint 5（V0.2 决策点 4）

**B. 合同执行**（V0.3 衔接，1.5 PD）：
- C-03 合同条款字段（详设 05 §4.3，仅 entity 字段）
- C-04 合同付款节点（详设 05 §4.4）+ 4 状态机
- C-06 合同终止单（详设 05 §4.6）+ 4 状态机
- ⚠ C-07~C-10 付款流程 → 延 Sprint 5

**C. 履约保证金 `bond_required`**（V0.5 §3.3 #11，2.5 PD，**V0.2 决策点 2 必做**）：
- 详设 05 V1.1 → V1.2 升版（§4.2.1 字段表 + §8.6.6 7 字段 + §8.7 service_subtype）
- C-02 字段补 8 个（BondRequired / BondAmount / BondForm / BondState / BondPaidDate / BondReleaseDate / BondReleaseTrigger + ServiceSubtype）
- bond_state 4 状态枚举 + 状态机（待缴纳 / 已缴纳 / 已退还 / 已没收）
- SENS-CON-003 没收高敏感拦截器（V0.5 §3.3 #4）

**D. 质检让步**（详设 06 §4.3，1 PD）：
- S-04 QualityInspection 实体 + 5 状态机
- 让步入库联动 S-05

**E. Stage B1 切换 → 改"机会窗口"**（V0.2 决策点 3，1 PD 机会窗口）：
- NovaSync HttpReader 切换（若 OAuth 凭据就绪）
- Catio Workflow 真接（10A V1.1 §九 Bis 若回函）
- NC 真实接入（08B 外发函若回函）
- ⚠ 不预占主线工时；若依赖延期则登记到 Sprint 5

### 1.2 V0.2 评审决策点（已锁版）

| # | 决策点 | 选项 | 理由 |
|---|--------|------|------|
| 1 | 切片方案 | **方案 1 + 删 T-06/T-07 + 集成压缩 + Stage B1 改机会窗口** | 砍 1.5 PD 严卡 10 PD |
| 2 | 履约保证金 D4-5 | **本 Sprint 必做** | V0.5 §3.3 #11 主增量；详设 05 V1.2 升版不能拖；SENS-CON-003 顺带落 |
| 3 | Stage B1 (D9) | **改"机会窗口"型，不占主线工时** | OAuth 凭据高概率延期；不应让外部依赖阻塞主线 |
| 4 | T-06 / T-07 | **延 Sprint 5 跟 T-08/T-09 整批做** | 二者标"最小可用版"价值不足，分批反而碎 |
| 5 | D7-8 集成测试 | **压到 1.5 PD（性能优化挪后）** | 性能 D7-2 在 V0.1 已标"可选"，腾给主线 |
| 6 | 总工时硬上限 | **严卡 10 PD** | 上 3 个 Sprint 累积超额；本 Sprint buffer 留给履约保证金详设升版风险 |

### 1.3 基线

- ✅ Sprint 3 commit `c3cdb03` 已 push（D0-D9，264 测试通过）
- ✅ EF migrations 13 条全部 apply（含 D0 schema_move）
- ✅ Sprint 3 全链 E2E 通过（P-05→T-01→T-05 / C-05→C-02 / S-05→C-02 执行中 + NC）
- ✅ sub_group_id 守护单测自动覆盖 Sprint 3 新增 5 实体
- ✅ 8 schema 全部启用（m / p / t / c / s / e / f / a / sy；e/f/r 待 Sprint 4+ 业务实体落地）

### 1.4 不在范围

- T-04 招标公告内容详化（仅落 entity，业务侧公告渲染留 Sprint 5+）
- T-06 评标委员会 / T-07 标包明细（V0.2 决策点 4 延 Sprint 5）
- C-07~C-10 付款流程（付款流程留 Sprint 5）
- 09 报表预警与 AI 能力（Sprint 5+）
- 详设 07 设备模块完整落地（V0.5 +20 PD，单独 Sprint）
- 10 权限审批 V1.2 4 新审批模板完整（依赖 Catio Workflow 真实联调）
- 外委检修起步（V0.2 决策点 1 切片方案 2 否决；留 Sprint 5-6）

### 1.5 完成标准（Sprint 4 验收）

- [ ] §二 D1-D10 全部任务 ✅
- [ ] 全量测试 ≥ 280 通过（Sprint 3 基线 264 + Sprint 4 新增 ~20）
- [ ] 新增 EF migrations 4-5 条（T-03 / T-04 / T-05_PackageId_NotNull / C-04 / C-06 / C-02_BondFields / S-04）
- [ ] 详设 05 V1.1 → V1.2 升版完成（D4-1）
- [ ] Sprint-4-Demo-脚本 V0.1 入库
- [ ] commit log 整洁

---

## 二、按日任务拆解（V0.2 锁版，10 PD 严卡）

### Day 1-2 — 招投标延伸 T-03/T-04 + T-05 收口

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | T-03 TenderPackage 实体 + 6 状态机 | 04 §4.10.1 | 单测 ≥ 5 |
| D1-2 | T-04 ProcurementDocument 实体（采购文件）| 04 §4.11 | 字段对齐 |
| D1-3 | EF mapping + Add_TenderPackage / Add_ProcurementDocument migrations | — | apply 通过 |
| D2-1 | T-03 / T-04 AppService + Controller | 04 §4.10-4.11 | 单测 ≥ 6 |
| D2-2 | T-05 PackageId 改 NOT NULL（Sprint 3 D3 留的 nullable 收口）| Sprint 3 D3 备注 | migration + 单测无回归 |

**预估工时：** 1.5 PD

> ⚠ T-06 评标委员会 / T-07 标包明细 → 延 Sprint 5（V0.2 决策点 4：与 T-08/T-09 整批做）

### Day 3 — C-04 付款节点 + C-06 合同终止单 + C-03 字段

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D3-1 | C-04 ContractPaymentNode 实体（详设 05 §4.4）+ 4 状态机 | 05 §4.4 | 单测 ≥ 4 |
| D3-2 | C-06 ContractTermination 实体 + 4 状态机 | 05 §4.6 | 单测 ≥ 4 |
| D3-3 | EF mapping + 2 migration | — | apply 通过 |
| D3-4 | C-04 / C-06 AppService + Controller | 05 §4.4 / §4.6 | 单测 ≥ 5 |
| D3-5 | C-03 ContractClause 实体（合同条款，详设 §4.3，仅 entity 字段，AppService 留 Sprint 5）| 05 §4.3 | 字段对齐 |

**预估工时：** 1.5 PD

### Day 4-5 — 履约保证金 `bond_required`（V0.5 §3.3 #11，V0.2 决策点 2 必做）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D4-1 | **详设 05 V1.1 → V1.2 升版**（D4 第一动作）：§4.2.1 字段表加 §8.6.6 履约保证金 7 字段 + §8.7 service_subtype 字段 | 详设 05 V1.2 升版 | 详设文档入库（git mv + 头部 + §六 沿革 三动作同 commit）|
| D4-2 | C-02 实体加 BondRequired / BondAmount / BondForm / BondState / BondPaidDate / BondReleaseDate / BondReleaseTrigger + ServiceSubtype 8 字段 | 详设 05 V1.2 §4.2.1（升版后）| 字段对齐 |
| D4-3 | EF migration Add_Contract_BondFields | — | apply 通过 |
| D4-4 | ContractAppService.Approve 时自动判 bond_required（详设 §8.6.1：金额≥20万 + 竞争性方式）| 详设 §8.6.1 | 单测 ≥ 3 |
| D5-1 | bond_state 4 状态枚举 + 状态机方法（待缴纳 / 已缴纳 / 已退还 / 已没收）| 详设 §8.6.6 | 单测 ≥ 4 |
| D5-2 | SENS-CON-003 没收高敏感拦截器（V0.5 §3.3 #4，详设 §8.6.7 + 10 §7）| 详设 10 V1.2 §7.1 | 单测 ≥ 2 |
| D5-3 | C-02 履约保证金端到端单测：审批通过自动判定 → 缴纳 → 释放 / 没收 | — | E2E 单测 1 个 |

**预估工时：** 2.5 PD

### Day 6 — S-04 质检让步

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D6-1 | S-04 QualityInspection 实体 + 5 状态机（详设 06 §4.3）| 06 §4.3 | 单测 ≥ 5 |
| D6-2 | EF mapping + Add_QualityInspection migration | — | apply 通过 |
| D6-3 | AppService + Controller + 让步入库联动 S-05（让步数量生成 S-05 让步入库）| 06 §4.3 业务规则 | 单测 ≥ 5 |

**预估工时：** 1 PD

### Day 7-8 — 集成测试 + 守护 + 全量回归（V0.2 决策点 5：压缩至 1.5 PD）

| # | 任务 | 验收 |
|---|------|------|
| D7-1 | Sprint4FullChain_E2E：T-01 → T-03/T-04 → T-05 → C-02（含 bond_* 状态）→ S-04 让步 → S-05 入库 | 1 个 E2E 通过 |
| D7-2 | sub_group_id 守护单测自动覆盖新增（T-03/T-04/C-03/C-04/C-06/S-04）| 守护单测全过 |
| D8-1 | 全量回归 ≥ 280 通过 | 0 失败 |

> ⚠ V0.1 D7-2 性能优化（sub_group_id 索引 P95 监控）→ 挪后 Sprint 5

**预估工时：** 1.5 PD

### Day 9 — Stage B1 机会窗口（V0.2 决策点 3：不预占主线工时）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D9-1 | **机会窗口**：Catio 10A V1.1 §九 Bis 回函检查；若就绪，启动 NovaSync HttpReader 切换 | NovaSync 切换方案 V0.2 | 切换方案落地 / 或登记延 Sprint 5 |
| D9-2 | **机会窗口**：NC 团队 08B 外发函回函检查；若就绪，启动 BIZ-001 真实接口切换（Sprint 3 mock 替换）| 08B 外发函 V0.1 + 08A 内部底稿 V0.2 | 切换落地 / 或登记延 Sprint 5 |
| D9-3 | 若两项依赖均延期，本日改做：Sprint 5 任务卡草案预研（D10-5 前置）+ 性能基线脚本设计 | — | 任一交付 |

**预估工时：** 1 PD（机会窗口型；外部依赖延期则改 Sprint 5 预研）

### Day 10 — Sprint 4 验收 + Demo + Sprint 5 backlog

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 全量测试 ≥ 280 通过 | 0 失败 |
| D10-2 | Sprint 1-3 Demo 用例 1-14 回归；新增用例 15-18（招投标延伸 / 合同执行 / 履约保证金 / 质检让步）| 全 200 OK |
| D10-3 | `docker compose up` 容器内跑全套 | 全通过 |
| D10-4 | 写 `Sprint-4-Demo-脚本-V0.1.md` | 入库 |
| D10-5 | 起 Sprint 5 任务卡草案：T-06/T-07/T-08+ 招投标后续 + 外委检修起步 + 暂估双预警 + 超储三级 + C-07~C-10 付款流程 + 出库 S-09/S-10/S-12 + Stage B1 延后部分 | `Sprint-5-任务卡-V0.1.md` 草案入库 |
| D10-6 | 整理 Sprint 4 commit log | git log 整洁 |

**预估工时：** 1 PD

**Sprint 4 V0.2 总工时：** 1.5 + 1.5 + 2.5 + 1 + 1.5 + 1 + 1 = **10 PD ✓**

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
| 2 | WF-DIR-001 直达例外 | Sprint 4 D9 机会窗口 → 延 Sprint 5 概率高 | V0.2 决策点 3 改机会窗口；OAuth 凭据延期则登记 Sprint 5 |
| 3 | 4 新审批模板 | Sprint 4 D9 机会窗口 → 延 Sprint 5 概率高 | 同上 |
| 4 | 2 新高敏感 SENS-CON-003/004 | **Sprint 4 D5-2**（SENS-CON-003）；004 延 Sprint 5 | SENS-CON-003 履约保证金没收随 D4-5 落，004 不在 V0.2 范围 |
| 5 | 暂估 D-90/D-30 双预警 | Sprint 5 | 09 报表预警关联 |
| 6 | 超储三级处置 | Sprint 5 | 06 库存 |
| 7 | 后评价自动联动 | Sprint 6 | 09 报表 + 10 审批 |
| 8 | S-01 fulfillment_type | 延 Sprint 5 | V0.1 计划落 D5 时补，V0.2 D6 仅 S-04 不带 S-01；改 Sprint 5 |
| 9 | 委托加工受托虚拟仓 | Sprint 6+ | 06 + 08 |
| 10 | 第四批 E 类必补 5 项 | Sprint 5-6 | 07 设备 |
| 11 | 履约保证金 `bond_required` | **Sprint 4 D4-5** | ⭐ 本 Sprint 主要 V0.5 增量（V0.2 决策点 2 必做）|
| 12 | 集团并行会签 A4 | Sprint 6+ | Catio Workflow V1.2 |
| 13 | sub_group_id 全链路 | ✅ 已落 Sprint 1-2 | — |
| 14 | NovaSync 切换方案 | Sprint 4 D9 机会窗口 → 延 Sprint 5 概率高 | V0.2 决策点 3 改机会窗口 |

---

## 四、资源 / 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 详设 05 V1.2 升版与 D4-5 履约保证金落地冲突 | 中 | D4 前置依赖详设升版 | D4-1 第一动作；详设升版与代码落地一周内合并；7 字段表先稿后码 |
| Catio Workflow OAuth 凭据延期 | 高 | D9 真接联调降级 | V0.2 决策点 3：D9 改"机会窗口"型不占主线工时；延期则登记 Sprint 5 |
| NC 08B 回函延期 | 中 | D9 NC 真接降级 | 同上，机会窗口型；Sprint 3 mock 继续 |
| 招投标外部对接（招采平台）延期 | 高 | T-03/T-04 完整化滞后 | 主线不依赖外部对接，D1-D2 先落 entity + 状态机 + AppService |
| Sprint 4 工时超 10 PD | 中 | 验收延期 | V0.2 严卡 10 PD（T-06/T-07 延 Sprint 5 + D7-8 集成压缩 + Stage B1 改机会窗口）|

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
| V0.2 | 2026-05-13 | 评审 6 决策点锁版：(1) 切片方案 1 + 删 T-06/T-07 + 集成压缩 + Stage B1 改机会窗口；(2) 履约保证金 D4-5 本 Sprint 必做（含详设 05 V1.2 升版）；(3) Stage B1 改"机会窗口"型不占主线工时；(4) T-06/T-07 延 Sprint 5；(5) D7-8 集成测试压至 1.5 PD（性能优化挪后）；(6) 严卡 10 PD。§二 D1-D10 按 1.5+1.5+2.5+1+1.5+1+1 重排，总 **10 PD ✓**。§一 1.2 加 V0.2 决策点表；§四 风险更新；§六 V0.2 沿革。|
