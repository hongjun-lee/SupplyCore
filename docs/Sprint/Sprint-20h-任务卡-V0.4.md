# Sprint 20h 任务卡 V0.4（Codex 0 finding 通过 · main 主轨化 + second 第 9 次连续 / 35 Sprint 0 顺延 / 连续 10 立修 + 3 次 0 通过）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.4（Codex 0 finding 通过 · main 5 commits + second 3 commits / 警告 baseline + 测试覆盖审计 + docs INDEX 起草 / Codex 评审 0 P1+0 P2+0 P3 / **35 Sprint 0 顺延达成 / 连续 10 立修 + 3 次 0 finding 通过**）
**日期：** 2026-05-17
**文档性质：** 实施层 · Sprint 20h 收尾锁版任务卡（V0.2 拍板 → V0.4 Codex 0 finding 通过 / 跳 V0.3 类 20f 模式 / 35 Sprint 0 顺延达成 / 第 3 次 0 finding 通过）
**配套：** [`Sprint-20g-任务卡-V0.4.md`](./Sprint-20g-任务卡-V0.4.md) + [`sprint-20f-20j-roadmap.md`](../../../SupplyCores/docs/internal/sprint-20f-20j-roadmap.md) §2.3

---

## 〇、Sprint 20g 收尾接续（V0.4 锁版 / 34 Sprint 0 顺延 / 连续 10 立修 / 三里程碑）

### 〇.1 20g D1 完成数据

| 维度 | 实际 |
|---|---|
| main commits（主仓）| 3（second-e-prompt + demo checklist + Codex 立修）|
| second e commits（主仓）| 4（T-E1 8/8 完整 + T-E2 Reports +2 + T-E3 性能 baseline + T-E4 P2-2/P2-3 自主立修）|
| 跨仓 commits（SupplyCore docs）| 3（V0.2 + V0.3 + V0.4）|
| main 实际 PD | ~0.6（计划 0.8 / 早完 0.2）|
| second e 实际 PD | ~1.1（第 8 次连续 高效）|
| **34 Sprint 0 顺延** | **✅ 持续保持** / 连续 10 立修 |
| 三里程碑 | ✅ dashboard 8/8 完整 + Reports 16 + second 自主立修模式 |

### 〇.2 20g 顺延 → 20h 吸收候选

| 来源 | task | 工作量 | 处置 |
|---|---|---|---|
| 19r-20g G-13 A 顺延 | NcAccountRule 字典扩 | 0.3-0.4 PD | **T-A1 条件性**（业务方反馈触发）|
| 6 Sprint 累计 warning | dotnet build WarehouseMappers RMG012 171 警告 + CS8604 多处 | 0.3 PD | **T-A2 整体警告盘点** |
| 测试覆盖率审计 | 关键路径无 test 补齐 | 0.3 PD | **T-A3 测试覆盖率审计** |
| docs/internal 杂项 | 19o-20g 留下 runbook + 评估 + roadmap + retrospective | 0.2 PD | **T-A4 docs 整理 + INDEX** |
| Reports 持续扩 | 16 → 18+ | 0.4 PD | **second 副轨 T-E1**（条件性）|
| dashboard 性能深化 | 8/8 完整后真实环境压测 | 0.3 PD | **second 副轨 T-E2**（条件性）|

### 〇.3 20h 主题反转 — main 主轨化（vs 20f-20g main 副轨化）

- **20f-20g**：main 副轨 ~0.6 PD / second 主轨 ~1.1-1.6 PD（业务方驱动 + dashboard 完整里程碑）
- **20h 反转**：**main 主轨化 ~1.5-2.0 PD**（累计技术债清扫 / second 副轨 ~0.5-1.0 PD 持续）
- 理由：dashboard 8/8 完整 + Reports 16 完整 → second 工作量自然收敛 / main 该清扫累计债务

---

## 一、Sprint 20h 范围（累计技术债清扫 / main 主轨化 / 总 ~2-3 PD / 工期 ~1 day）

### 1.1 main 主代理 a 主轨（主轨化 / ~1.5-2.0 PD）

| Task | PD | 描述 | 触发 |
|---|---|---|---|
| **T-A1** NcAccountRule 字典扩（条件性 / 见 §六 Q1）| 0-0.4 | 业务方 G-13 反馈"借贷科目代码默认值不准"时启动 / 二级 / 项目专属 / 否则跳过 | cici Q1 决策 |
| **T-A2** 整体警告盘点 + WarehouseMappers 修复 | 0.3 | dotnet build 0 errors / 171 警告（WarehouseMappers RMG012）+ CS8604 nullable 警告盘点 + 关键警告修复（不一定全修 / 看 ROI）| 标准清扫 |
| **T-A3** 测试覆盖率审计 | 0.3 | dotnet test 跑全 / 覆盖率报告 / 关键路径（Vouchers + Interfaces + Reports + Dashboard）无 test 补齐 | 标准清扫 |
| **T-A4** docs/internal 整理 + INDEX 起草 | 0.2 | 19o-20g 留下 runbook + 评估文档 + roadmap + retrospective / 起草 docs/internal/INDEX.md 给团队检索 | 标准清扫 |
| **T-A5** Codex 20h 评审 + 立修 | 0.2 | `codex review --base f45272d`（20g Codex 立修末）/ 立修保 35 Sprint 0 顺延 | 标准收尾 |
| **T-A6** Sprint 20h 收尾 + V0.x 升版 + memory | 0.3 | V0.1 → V0.4 锁版 + memory 升级（35 Sprint 0 顺延 / 累计技术债清扫经验）| 主代理 a 标准收尾 |

main 主代理 a 总：**~1.3-1.7 PD**（T-A1 条件性）

### 1.2 main 子代理 b 副轨（可选 / ~0.3-0.5 PD / spawn 评估）

| Task | PD | 描述 |
|---|---|---|
| **T-B1** WarehouseMappers RMG012 警告批量修 | 0.3 | 171 警告 / Mapper 缺字段补齐 / 或 ignore 注解 |
| **T-B2** CS8604 nullable 警告关键路径修 | 0.2 | dotnet test warning 多处 / ShouldContain 等 / null check + ShouldNotBeNull |

按 [[feedback_evaluate_parallel_subagent_default]] 评估 spawn — T-A2 + T-A3 + T-A4 单线程做更稳（顺序 task / 子代理 spawn ROI 不高）。

### 1.3 second 主代理 e 副轨（条件性 / ~0.5-1.0 PD / 第 9 次连续）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** Reports 16 → 18+（如时间允许）| 0.4 | 持续扩 18+ 业务模板（如人员效率周报 / 设备闲置率月报 / 库存周转周报）|
| **T-E2** dashboard 真实环境压测（如时间允许）| 0.3 | 8/8 完整后真实环境 (5100 host serve) 压测 / 性能 baseline 实测 vs spec 阈值 |
| **T-E3** 收尾 + memory + race 检查 | 0.2 | 第 9 次连续 / dashboard 8/8 + Reports 16 之后 second 工作收敛 |

second 主代理 e 总：**~0.5-1.0 PD**（副轨化 / vs 20f-20g 主轨化反转）

---

## 二、cici 20h 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **业务方第 2 次 demo 时段确认** | 中 | 推荐 5 月下 / 实际 demo 后启动 G-14~G-17 反馈追踪 |
| **G-13 NcAccountRule 字典扩决策** | 低 | 业务方反馈触发后 cici 决定 20h 启动 T-A1 |
| **切 second session** | 中 | 给 e 续 prompt 启动 20h second 副轨（条件性）|
| **Codex 20h 评审触发** | 标准 | D2 收尾时手动 `codex review --base f45272d` |

| 时机 | 行动 |
|---|---|
| **D1** | 升 V0.2 启动 D1 + cici 切 second session 给 e 续 prompt（如启 second）|
| **D2** | Codex 评审 + V0.3 锁版 |
| **D3** | Codex 立修（如有）+ V0.4 锁版 + 35 Sprint 0 顺延记录 |

---

## 三、累计技术债（20h 主清扫）

| 来源 | Task | 20h 处置 |
|---|---|---|
| 6 Sprint warning 累计 | dotnet build 171 警告 + dotnet test CS8604 多处 | **T-A2 整体盘点 + 关键路径修**（main 主轨）|
| 测试覆盖率审计 | 关键路径（Vouchers + Interfaces + Reports + Dashboard）覆盖率 | **T-A3 审计 + 补齐** |
| docs/internal 杂项 | 19o-20g 12+ 文档 / 缺索引 | **T-A4 INDEX.md 起草** |
| 19r-20g G-13 字典扩 | NcAccountRule 二级 / 项目专属 | **T-A1 条件性**（业务方触发）|
| Reports 16 → 18+ | 持续扩 | **second 副轨 T-E1**（如启 second）|

---

## 四、子代理 spawn + 跨 session race 防御（V1.8 [P1] 降级生效）

### 4.1 1c 模块隔离表（延续 20a-20g）

| session | 锁定模块 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / SupplyCoresWebModule.cs / voucher-management/* / contracts/* / monthly-prepayment/* / Warehouses/*（20h T-A2 + T-B1）|
| **second** | dashboard-bigscreen/* / reports/* / theme.css / DashboardBigscreenAppService / BusinessReportsAppService / NcInterfaceMonitor / DashboardCronConstants |

### 4.2 spawn 策略

- 默认主 worktree（race [P1] 降级后不强制）
- 教训 13 模板成熟稳定（第 16 次维持记录）
- stash + pathspec 双重防御保留
- 评估子代理并行（[[feedback_evaluate_parallel_subagent_default]] / 20h T-A2 + T-A3 + T-A4 单线程 ROI 评估）

---

## 五、Codex 20h 评审准备（手动模式延续）

- 20h 收尾 D2-D3 cici 手动触发：`codex review --base f45272d`（20g Codex 立修末）
- 5-15 min Codex 跑 / main a 后台等通知
- 立修保 **35 Sprint 0 顺延 / 连续 11 Sprint 立修 OR 3 次 0 finding 通过**

---

## 六、V0.1 启动条件（cici 5 答拍板）

### 5 开放问题待 cici 答

1. **NcAccountRule 字典扩 G-13 启动**：
   - A. 顺延（业务方未明确触发 / 0 PD / 推荐 / 20i+ 业务方反馈再启）
   - B. 20h 预先扩二级（基于详设字典表 / 0.3 PD）
   - C. 项目专属字典扩（覆盖 8 业务单按钮各借贷规则 / 0.4 PD）

2. **整体警告修复范围**：
   - A. 全 171 警告盘点 + 关键路径修（推荐 / T-A2 + T-B1 ~0.5 PD）
   - B. 仅 WarehouseMappers RMG012 修（最大头 / 0.3 PD）
   - C. 顺延（warning 不影响功能 / 0 PD）

3. **second e 副轨范围**：
   - A. 全 T-E1+T-E2+T-E3（Reports 18+ + dashboard 压测 + 收尾 / ~1.0 PD / 第 9 次连续）
   - B. 仅 T-E1（Reports 18+ / 0.4 PD / 保守）
   - C. 暂停 second（main 单轨 / dashboard + Reports 已完整）

4. **测试覆盖率审计深度**：
   - A. T-A3 0.3 PD 审计 + 关键路径无 test 补齐（推荐）
   - B. 仅审计报告（不补 test）/ 0.1 PD
   - C. 顺延（test 已 200+ 全过 / 当前 ROI 不高）

5. **20h 启动时间**：
   - A. 今天升 V0.2 启动 D1（连续 / 34 Sprint 0 顺延动量延续 / 但 main 已 ~12 PD）
   - B. 明天启动（推荐 / 7 Sprint 高密度后调整）
   - C. 等业务方反馈触发（保守）

### V0.2 拍板条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（§四.1）
- second 主代理 e 同步任务卡（如启 second）

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 | main a 起草 · 提前规划框架（基于 roadmap §2.3 累计技术债清扫主题）/ 5 开放问题待 cici 答 |
| V0.2 | 2026-05-17 | **cici 5 答全 A 拍板**（Q1A NcAccountRule 顺延 / Q2A 全警告盘点+关键修 / Q3A second 全 T-E1+T-E2+T-E3 / Q4A 测试覆盖审计+补齐 / Q5A 今天启动 D1）· 启动 D1 |
| V0.4 | 2026-05-17 | **Codex 评审 0 finding 通过**（类 18a A 级直接延续 / 第 3 次 0 finding 通过 / 19s 第 2 次 + 20d + 20h）· main 5 commits（V0.2 + second-e-prompt + 警告 baseline + 测试审计 + docs INDEX）+ second 3 commits（T-E1 Reports 16→18 + T-E2 性能 baseline + T-E3 收尾）· **35 Sprint 0 顺延达成 / 连续 10 立修 + 3 次 0 finding 通过**（19q P1 / 19r 5 / 19s 5+0 / 19t 3 / 20a 2 / 20b 2 / 20c 2 / 20d 0 / 20e 1 / 20f 1 / 20g 1 / **20h 0** = 24 finding + 3 次 0 通过 / 3.0 PD 累计）|

---

## 八、V0.2 拍板启动 D1（cici 5 答全 A）

| Q | 答 | 影响 |
|---|---|---|
| Q1 | A | NcAccountRule 字典扩顺延（业务方未明确触发 / 0 PD）|
| Q2 | A | 全警告盘点（171 RMG012 + CS8604）+ 关键路径修（T-A2 0.3 PD）|
| Q3 | A | second e 全 T-E1+T-E2+T-E3（~1.0 PD / 第 9 次连续 / Reports 16→18+ + dashboard 真实压测）|
| Q4 | A | 测试覆盖率审计 + 关键路径补齐（T-A3 0.3 PD）|
| Q5 | A | 今天启动 D1（34 Sprint 0 顺延动量延续）|

### 8.1 main D1 启动顺序（主轨化反转）

1. **T-A2 整体警告盘点** + WarehouseMappers 修复（0.3 PD / 首启）
2. **T-A3 测试覆盖率审计** + 关键路径补齐（0.3 PD）
3. **T-A4 docs/internal INDEX.md 起草**（0.2 PD / 19o-20g 12+ 文档梳理）
4. **T-A1 NcAccountRule 字典扩** = 0 PD（Q1 A 顺延）
5. **T-A5 Codex 评审 + 立修**（0.2 PD / D2）
6. **T-A6 V0.x 升版 + memory**（0.3 PD / D2-D3）

main D1 实际：~1.3 PD（主轨化 / vs 20f-20g 副轨 0.6 PD）

### 8.2 second e D1 启动顺序（cici 切 second session 给 e 续 prompt）

详 [`second-e-prompt-20h-raw.txt`](../../../SupplyCores/docs/internal/second-e-prompt-20h-raw.txt)：
1. T-E1 Reports 16 → 18+（0.4 PD / 人员效率周报 / 设备闲置率月报 / 库存周转周报）
2. T-E2 dashboard 真实环境压测（0.3 PD / 8/8 完整 baseline 实测）
3. T-E3 收尾 + memory + race 检查（0.2 PD / 第 9 次连续）

### 8.3 启动条件全部满足

- ✅ 5 开放问题 cici 全 A 答
- ✅ 1c 模块隔离表确认（§四.1 / 与 20a-20g 同模式）
- ✅ 20g V0.4 锁版完成（跨仓 `4c535ca` / 34 Sprint 0 顺延 + 三里程碑达成）
- ⏳ second 主代理 e 同步任务卡（cici 切 session 给 e 续 prompt）

---

**main 主代理 a 签名**：2026-05-17 V0.1 起草 · V0.2 cici 5 答全 A 拍板 → **V0.4 Codex 0 finding 通过**（跳 V0.3 / main 5 + second 3 commits / 总 ~1.5 PD / **35 Sprint 0 顺延 / 连续 10 立修 + 第 3 次 0 finding 通过达成**）
