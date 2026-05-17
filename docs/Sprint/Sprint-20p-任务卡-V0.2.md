# Sprint 20p 任务卡 V0.2（2026-05-17 深夜 cici 拍板 5 决策全默认 / 第 4 周期开局协调 + 试点验证 sprint / 明天 2026-05-18 启动 Day 1）

**Sprint**：20p（紧续 20o 真正收口 → 第 4 周期 5 Sprint 第 1 阶段开局）
**主题**：ProcurementDocument 试点验证 + Tender↔Contract↔Approval 关联完整性 grep + UI polish + 试点扩大白音华煤矿 + 试点 demo
**节奏**：roadmap V0.1 §2.1 撤销「从零开发 PurchaseOrder」/ V0.2 修正为「协调 + 试点验证 + UI 完善 sprint」/ 工作量 ~1.2 PD（vs roadmap §2.1 估 2.0 PD / 省 0.8 PD）
**性质**：**协调 + 试点验证 + UI 完善 sprint**（类 Sprint 20n 模式 / vs 开发 sprint 20l-20m / vs 收尾 sprint 20o）
**V0.1 起草要点**（cici 拍板 A 协调 sprint）：
- **重大发现（grep 验证）**：ProcurementDocument 全套 + Tender 全套 + Contracts + Suppliers + Approvals + Workflows 全在仓 / frontend contract+tender+approval-center+supplier-performance+tender-archive 全在 / **不需从零开发**
- 主要工作：试点验证 ProcurementDocument 闭环 + 4 模块关联完整性 grep + UI 完善 + 试点扩大白音华煤矿协调 + demo 准备
- roadmap V0.1 §2.1 撤销 / T-A5 同步修正 roadmap V0.1 → V0.2

---

## 一、Sprint 20o 收尾（前置事实 / commits 链 / 43 Sprint 0 顺延）

### 1.1 Sprint 20o 5 task 全 done

| Task | 主要交付 | 状态 |
|---|---|---|
| T-A1 | 5 Sprint（20k-20o）整体复盘文档 `sprint-20k-20o-retrospective.md` V0.1 / 12 章节齐备 | ✅ done |
| T-A2 | 第 3 批（采购/合同/审批）启动评估 `sprint-20o-batch3-readiness-assessment.md` V0.1 / 4 维度 + 5 评分 + 6 cici 拍板项 / **重大发现：10 AppService + 34 Domain 实体全在仓** | ✅ done |
| T-A3 | production runbook V0.1 → V0.2 升级 | ✅ done |
| T-A4 | 20p+ roadmap 起草 `sprint-20p-20t-roadmap.md` V0.1 | ✅ done |
| T-A5 | Codex 5 轮 12 finding 全立修 / **Round 5 = 0 finding 收敛 ✅** / V0.4 锁版 / memory 升级 | ✅ done |

### 1.2 Sprint 20o 真正收口数字

| 维度 | 数字 / 状态 |
|---|---|
| main 主代理 commits | 14+ |
| Codex 评审 | 5 轮 12 finding 全立修 / Round 5 = 0 finding 收敛 ✅ |
| **43 Sprint 0 顺延** | **✅ 第 3 周期 20k-20o 完整闭环达成** |
| 累计 Codex 轮 | 19 / 39 finding 全立修 / 6 次 0 finding 收敛（R5/R7/R10/R11/R14 + 20o R5） |
| 关键 commit | `3b0b250`（V0.4 push） |

### 1.3 ProcurementDocument 等 entity grep 重大发现（来源 Sprint 20o T-A2）

**第 3 批模块代码侧基础已全在仓 production-ready（19q-20j 累积实施）**：

| 模块 | 实体清单 | 状态 |
|---|---|---|
| ProcurementDocument | Entity + States + Manager + AppService + Mapper + Dto + Controller | ✅ 全在仓 |
| ProcurementMethod | 全套 | ✅ 全在仓 |
| Tender 全套 | TenderResults + TenderPackageLines + TenderApplications + TenderPlatformLogs + TenderPlatforms + TenderPackages | ✅ 全在仓（6 子模块）|
| Contracts | Contracts + ContractChanges + ContractNegotiations + ContractPaymentNodes + ContractTerminations + LeaseContracts | ✅ 全在仓（6 子模块）|
| Suppliers | Entity + AppService + Handler | ✅ 全在仓 |
| Approvals | 审批模块完整 | ✅ 全在仓 |
| Workflows | 工作流引擎基础 | ✅ 全在仓 |
| frontend | contract / tender / approval-center / supplier-performance / tender-archive | ✅ 5 pages 全在 |

**结论**：第 3 批模块代码侧基础已 production-ready / **不需从零开发** / Sprint 20p 主要为试点验证 + 关联完整性 grep + UI 完善 + 试点扩大协调 + demo 准备。

---

## 二、Sprint 20p Task 清单（A 主轨 5 task / 总 ~1.2 PD）

### A 主轨（main 主代理 / 协调 + 试点验证 + UI 完善 sprint / 共 5 task / 1.2 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** ProcurementDocument 完整流程 grep + 试点验证 | 0.2 | P0 | main 主代理 a | grep 验证：① ProcurementDocument Entity 状态机 + States ② Manager + AppService CRUD ③ AppService 状态流转（submit/approve/reject/void）④ Controller endpoint ⑤ 测试覆盖率 / 写到 `docs/internal/sprint-20p-procurement-document-validation.md` | Sprint 20o T-A2 评估输出 | 验证报告 ≥ 80 行 / 含 grep 结果 + 5 维度 checklist |
| **T-A2** ProcurementDocument ↔ Tender ↔ Contract ↔ Approval 关联完整性 grep | 0.3 | P0 | main 主代理 a | grep cross-aggregate：① ProcurementDocument 是否触发 Tender 流程 ② Tender 结果是否回写 ProcurementDocument ③ Contract 是否引用 ProcurementDocument ④ Approval 是否串接 4 类业务（采购/招标/合同/出库）⑤ 状态机串联与跨模块状态触发链 / 写到 `docs/internal/sprint-20p-cross-aggregate-validation.md` | T-A1 done | 验证报告 ≥ 100 行 / 含 5 维度 grep 结果 + 关联完整性表 + 缺口清单 |
| **T-A3** 试点单位扩大白音华煤矿协调（含 OrgCode 同步）| 0.2 | P0 | main 主代理 a + cici 协调 | cici 协调 Nova 团队同步白音华煤矿 OrgCode（约 `001.007.XXX`）+ 5 维度评分确认（沿用 Sprint 20o T-A2 §2.3 模板）+ 试点接口人指定 / 写到 `docs/internal/sprint-20p-pilot-expansion-baiyinhua.md` | cici 在 Sprint 20n part 2 反馈后拍板 | 文档 ≥ 60 行 / 含评分 + OrgCode + 接口人 |
| **T-A4** 试点 demo prep + UI polish | 0.3 | P0 | main 主代理 a + second e | ① ProcurementDocument 业务方 walk-through page（类 Sprint 20n T-E4 pilot-demo 模式 / 5 步引导）② 试点 demo checklist（采购流程 + Tender 关联 + Contract 关联 + Approval 串接 5 步）③ second e 副轨 UI polish（ProcurementDocument frontend page 试点反馈优化） | T-A1 + T-A2 done | demo page 可访问 / checklist 8+ 步 |
| **T-A5** Codex + V0.x 升版 + memory + **roadmap V0.1 → V0.2 修正** | 0.2 | P0 | main 主代理 a | 标准收尾 + **roadmap V0.1 → V0.2 修正**：① §2.1 Sprint 20p 性质从「采购模块从零开发」→「协调 + 试点验证 + UI 完善」/ ② 工作量 2.0 → 1.2 PD / ③ 添加 Sprint 20p T-A1+T-A2 grep 重大发现章节（10 AppService + 34 Domain 实体已在仓）/ Sprint 20p 任务卡 V0.x 升版 / memory 升级（44 Sprint 0 顺延 + Sprint 20p 协调 sprint 完整闭环） | Sprint 20p T-A1-A4 全 commit 完成 | Codex 0 顺延 / V0.x 锁版 / roadmap V0.2 修正 done / memory commit |

**main 总：~1.2 PD**（vs roadmap §2.1 估 2.0 PD / 撤销从零开发后省 0.8 PD）

### E 副轨（second 主代理 e / 条件性 / cici Q2 拍板后启动）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** ProcurementDocument frontend page polish | 0.3 | pending | 列表 + 详情 + 状态显示 polish / 试点反馈优化 |
| **T-E2** 采购模块业务方 demo walk-through page | 0.2 | pending | 类 Sprint 20n T-E4 pilot-demo 模式 / 5 步引导 |
| **T-E3** e2e 测试补 | 0.2 | pending | procurement-document spec 补 / 关联流程 spec |

### D 顺延说明

- ~~D 线 NC/财务接口真联调~~：**继续顺延 20r+（第 4 周期第 2 阶段主推）/ 业务方 G-12 后续推进 + NC 侧提供联调环境双触发**
- ~~T-B1-B5 Sprint 20n part 2 协调试点~~：**与 Sprint 20p 并行 / 不阻塞 / 试点反馈陆续到位**

---

## 三、关键节奏

### 3.1 Sprint 20p 性质（vs Sprint 20n 协调 sprint 对比）

| 维度 | Sprint 20n（库存协调）| **Sprint 20p（采购协调）** |
|---|---|---|
| 主轨任务数 | 5（A1-A5）| 5（A1-A5）|
| 主轨总 PD | ~1.2 | ~1.2 |
| 验证范围 | 库存 4 单据 entity + Controller | ProcurementDocument 全流程 + 4 模块关联（Tender + Contract + Approval）|
| 业务方协调依赖 | 高（试点单位反馈）| 高（试点扩大 + 试点 demo + part 2 持续）|
| 主轴战略 | 库存试点 Wave 1 开局 | 采购试点 Wave 1 开局 |
| 子代理 | 0（main 主轨直接做）| 1-2（grep + 验证报告 spawn）|

### 3.2 wall-clock 估算

- main 主轨：1-2 天（依据 grep + 验证报告深度）
  * Day 1：T-A1（0.2 PD）+ T-A2（0.3 PD / 关联完整性 grep）
  * Day 2：T-A3（0.2 PD / cici 协调）+ T-A4（0.3 PD / demo prep + UI polish）+ T-A5（0.2 PD / Codex + roadmap V0.2 修正）
- part 2 协调：3-4 周持续（cici 协调白音华煤矿 + 试点反馈 + 与 Sprint 20n part 2 同期）

### 3.3 第 4 周期 5 Sprint 节奏调整

| Sprint | 性质 | 工作量 | 备注 |
|---|---|---|---|
| **Sprint 20p（本）** | **协调 + 试点验证 + UI 完善** | **1.2 PD** | vs roadmap §2.1 估 2.0 PD / 省 0.8 PD |
| Sprint 20q | 合同模块 | 待 V0.2 重新评估 | grep 已确认 Contracts 6 子模块全在 / 可能同 Sprint 20p 转协调 sprint |
| Sprint 20r-s | 审批 + NC 真联调 | roadmap V0.1 估 ~2.1 PD/Sprint | D 线激活 / 主推 |
| Sprint 20t | 第 4 周期收尾 + Q3 末 production deployment | ~2.2 PD | 硬截止 deadline |

---

## 四、关键决策点（cici V0.1→V0.2 待拍板）

| # | 决策 | 选项 | 推荐 | **cici 拍板** |
|---|---|---|---|---|
| **Q1** | Sprint 20p 启动时间 | A. 今天启动（连续 43 Sprint 动量延续）/ B. 明天启动（调整）/ C. 等 Sprint 20n part 2 第一周反馈 | **B 默认**（启动节奏调整 / 给 cici 半天 part 2 反馈消化）|
| **Q2** | second e 副轨范围 | A. 启动 T-E1+T-E2+T-E3（3 task / 0.7 PD）/ B. 仅 T-E1 polish（0.3 PD / 简化）/ C. 暂停（类 20o）| **A 默认**（采购 UI polish 真正影响试点验证 / second e 第 12 次连续 / 模块切到采购）|
| **Q3** | T-A3 试点扩大白音华煤矿协调 | A. Sprint 20p 同期推（cici Day 1 启动协调）/ B. 顺延 Sprint 20q（等 ProcurementDocument 验证 done 再扩）/ C. Sprint 20p 不做 / 顺延 20n part 2 后再评估 | **A 默认**（cici 协调与代码验证并行 / 不阻塞主轨）|
| **Q4** | T-A5 roadmap V0.2 修正深度 | A. 仅 §2.1 Sprint 20p 修正（最小）/ B. §2.1+§2.2 一起修正（合同也需 grep）/ C. 整 §二 5 Sprint 全重新评估（大幅修正 / 0.4 PD）| **B 默认**（合同模块同需 grep / 一次修两个 sprint 高效）|
| **Q5** | Sprint 20p 收口标准 | A. ProcurementDocument 全流程跑通 ≥ 90% / B. ProcurementDocument 试点 1-2 单位跑通即可 / C. 仅 grep 验证 + 试点扩大启动 | **B 默认**（试点协调 sprint 不强求 100% / 沿用 Sprint 20o Q2 B 观察期 + cici 拍板模式）|

---

## 五、风险与依赖

### 5.1 高风险

- **白音华煤矿试点扩大协调（cici 单点）**：与 Sprint 20n part 2 协调并行 / cici 协调负载显著增加 / 5 月反模式根因 #1 cici 单点仍保留
  * **缓解**：T-A3 文档 ≥ 60 行明确 OrgCode + 接口人 + 评分 / Sprint 20q 评估是否引入 PM 角色（roadmap V0.3 §九 已注）
- **ProcurementDocument 关联完整性可能有缺口**：T-A2 grep 验证后才能定 / Tender↔Contract↔Approval 跨模块状态触发链可能不完整
  * **缓解**：T-A2 验证报告输出缺口清单 / Sprint 20q-20r 续推关联完整性修补

### 5.2 中风险

- **second e 第 12 次连续 / 模块 8/8 已完整 / 副轨可能找不到高价值 task**：cici Q2 决策 second 副轨范围
  * **缓解**：Q2 A 选项启动 T-E1+T-E2+T-E3 / 采购模块 frontend polish 真正影响试点验证 / 模块切换成本评估

### 5.3 低风险

- **ProcurementDocument 基础在仓 / 状态机已实现**（grep 已确认）
- **grep 验证模式成熟**（[[carryover-task-verify-first]] / 顺延 task D1 必先 grep / curl / 实测）

### 5.4 主要依赖

- Sprint 20n part 2 试点反馈持续到位（不阻塞 Sprint 20p / 与 Sprint 20p 并行）
- cici 拍板 5 决策点（Q1-Q5）
- 白音华煤矿 OrgCode 待 Nova 团队同步

---

## 六、对外汇报口径

> Sprint 20p 第 4 周期第 1 阶段开局：ProcurementDocument 试点验证 + 4 模块关联完整性 grep + 白音华煤矿试点扩大协调 + 采购业务方 demo 准备 / 43 Sprint 0 顺延维持。第 3 批 4 模块（数据治理+库存+采购+合同）production-ready 中间点验证持续。roadmap V0.1 §2.1 撤销「从零开发」转为「协调 + 试点验证 + UI 完善 sprint」/ 工作量 2.0 → 1.2 PD / T-A5 同步修正 roadmap V0.2。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 深夜（紧续 Sprint 20o 真正收口 / `3b0b250` push 后）| main a 起草 / **cici 拍板 A 协调 sprint**（vs roadmap §2.1 从零开发已撤）/ 5 task 1.2 PD（vs roadmap §2.1 估 2.0 PD 省 0.8）/ 重大发现：ProcurementDocument + Tender + Contract + Approval + Workflows 等 entity 全在仓（10 AppService + 34 Domain 实体）/ frontend contract+tender+approval-center+supplier-performance+tender-archive 5 pages 全在 / **不需从零开发** / 5 开放问题待 cici V0.2 答（Q1 启动时间 / Q2 second 副轨 / Q3 试点扩大 / Q4 roadmap V0.2 修正深度 / Q5 收口标准）/ T-A5 含 roadmap V0.1 → V0.2 修正提示 |

---

**Created**: 2026-05-17 深夜 / Sprint 20o 真正收口（`3b0b250` push 后）→ 20p V0.1 起草 → V0.2 cici 拍板 / **等 2026-05-18 Day 1 启动** / main 主代理 a

**Related**:
- [`Sprint-20o-任务卡-V0.4.md`](Sprint-20o-任务卡-V0.4.md)（同 cycle 前序 / V0.4 真正收口 / Codex round 5 = 0 finding 收敛 / 43 Sprint 0 顺延达成）
- [`Sprint-20n-任务卡-V0.4.md`](Sprint-20n-任务卡-V0.4.md)（同协调 sprint 模板 / Wave 1 真正收口 / Round 14 0 finding 收敛）
- [`../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md`](../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md) V0.1（第 4 周期 roadmap / 待 T-A5 修正 V0.2 §2.1）
- [`../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md`](../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md) V0.1（第 3 批准入评估 / 重大发现 10 AppService + 34 Domain 实体全在仓）
- [`../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md`](../../SupplyCores/docs/internal/sprint-20k-20o-retrospective.md) V0.1（第 3 周期复盘）
- [[feedback_codex_0_carryover_8_sprint_record]]（43 Sprint 0 顺延记录 / 目标 47 Sprint）
- [[main_orchestrator_default_spawn]]（main 编排者新规则 / Sprint 20p 子代理 1-2 spawn）
- [[carryover_task_verify_first]]（顺延 task D1 必先 grep / curl / 实测 / Sprint 20p T-A1+T-A2 grep 验证模式）
- [[feedback_sprint20n_wave1_complete]]（库存试点开局 Wave 1 完整闭环 / 协调 sprint 模板参考）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 + 第 4 周期业务模块扩大）
- [[project_po_meeting_2026_05_16_nc_voucher_export]]（PO 决策 NC 顺延 / 第 4 周期 D 线激活触发）
- [[feedback_business_party_coordination_failure]]（5 月反模式根因 #1 cici 单点仍保留 / 第 4 周期监测）
