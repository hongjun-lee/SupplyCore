# Sprint 20j 任务卡 V0.2（cici 5 答 C/A/A/A/A 拍板 · 5 Sprint 周期收尾 + mini 压测 + 部署 runbook / 37 Sprint 0 顺延 / 今天启动 D1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（cici 5 答 C/A/A/A/A 拍板 · mini 压测 + 完整部署 runbook + 20k+ roadmap + second 全 + 今天启动 D1 / 5 Sprint 周期收尾）
**日期：** 2026-05-17
**文档性质：** 实施层 · Sprint 20j 定版启动任务卡（V0.1 起草 → V0.2 cici 5 答拍板 → 立即启动 D1 / **5 Sprint 周期 20f-20j 收尾 Sprint** / main 主轨化主推）
**配套：** [`Sprint-20i-任务卡-V0.4.md`](./Sprint-20i-任务卡-V0.4.md) + [`sprint-20f-20j-roadmap.md`](../../../SupplyCores/docs/internal/sprint-20f-20j-roadmap.md) §2.5 + [`sprint-20a-20e-retrospective.md`](../../../SupplyCores/docs/internal/sprint-20a-20e-retrospective.md)（参考模板）

---

## 〇、Sprint 20i 收尾接续（V0.4 锁版 / 36 Sprint 0 顺延 / 连续 10 立修 + 5 次 0 finding 通过）

### 〇.1 20i D1 完成数据

| 维度 | 实际 |
|---|---|
| main commits（主仓）| 2（second-e-prompt + V0.2 跨仓 sync）|
| second e commits（主仓）| 2（T-E1 Reports 18→20 含 controller / T-E2/T-E3 memory 留痕）|
| 跨仓 commits | 2（V0.2 + V0.4 跳 V0.3）|
| main 实际 PD | ~0.2（计划 0.7 / 节省 0.5）|
| Codex finding | 1 P2 second 自动修复（假阳性 / 第 5 次 0 finding 通过模式）|
| **36 Sprint 0 顺延** | **✅ 持续保持** / 连续 10 立修 + 5 次 0 通过 |
| **second 第 10 次连续 ✨** | **✅ 里程碑达成** / 21 commits / 0 race / dashboard 8/8 + Reports 20+ |
| **4 种 finding 处置模式** | **✅ 成熟**（main 立修 / main 防御性 / second 主动立修 / second 自动修复）|

### 〇.2 5 Sprint 周期回顾（20f-20j / 1-2 周）

按 [`sprint-20f-20j-roadmap.md`](../../../SupplyCores/docs/internal/sprint-20f-20j-roadmap.md) 规划 vs 实际：

| Sprint | 计划主题（roadmap）| 实际主题 | 实际数据 |
|---|---|---|---|
| 20f | second e 主轨 + main 副轨化 | ✅ 一致 / dashboard 5→7 + Reports 14 / main 防御性立修首测 | 33 Sprint 0 顺延 |
| 20g | 业务方 G-12 后续 + dashboard 7→8 完整 | ✅ 一致 / dashboard 8/8 完整里程碑 + Reports 16 + second 自主立修首测 | 34 Sprint 0 顺延 |
| 20h | 累计技术债清扫 | ✅ 一致 / 警告 baseline + 测试审计 + docs INDEX + Reports 18 + 双 0 finding 通过 | 35 Sprint 0 顺延 |
| 20i | NC 真接通正式启动（条件性）| 调整 / NC 顺延 + 测试覆盖深化 + Reports 20 + second 自动修复 | 36 Sprint 0 顺延 |
| 20j | 性能压测 + 部署 runbook + 整体复盘 | ⏳ 本 Sprint |

### 〇.3 5 Sprint（20f-20j）整体战绩预期（V0.4 实际数据）

按 roadmap §六 累计预期（vs 实际）：

| 维度 | roadmap 预期 | 5 Sprint 实际（截至 20i）|
|---|---|---|
| Sprint 数 | 5 | 5（20f-20j 含 20j）|
| main 累计 PD | ~5-7 PD | ~4.8 PD（20f 0.95 + 20g 0.6 + 20h 0.5 + 20i 0.2 + 20j ~1.5 估）|
| second 累计 PD | ~7-9 PD | ~5.7 PD（20f 1.6 + 20g 1.1 + 20h 1.0 + 20i 1.0 + 20j ~1 估）|
| Codex finding | ~5-10 | **4 + 5 次 0 通过 = 9 finding 处置点** |
| **目标 0 顺延** | 37 Sprint | **37 Sprint** ✅（20j 完成后达成）|

---

## 一、Sprint 20j 范围（5 Sprint 周期收尾 / main 主轨化主推 / 总 ~2.5-3 PD / 工期 ~1 day）

### 1.1 main 主代理 a 主轨 — 复盘 + 性能 + 部署 runbook（主轨化主推 / ~1.5-2.0 PD）

| Task | PD | 描述 | 触发 |
|---|---|---|---|
| **T-A1** 5 Sprint（20f-20j）整体复盘文档起草 | 0.4 | 类似 [`sprint-20a-20e-retrospective.md`](../../../SupplyCores/docs/internal/sprint-20a-20e-retrospective.md) 模板 / 写到 docs/internal/sprint-20f-20j-retrospective.md | 周期收尾 |
| **T-A2** 性能压测（条件性 / 见 §六 Q1）| 0-0.5 | 凭证生成 + 下载 + dashboard 8/8 + Reports 20 并发压测 / k6 或 wrk / 结果沉淀 docs/internal/performance-baseline-20j.md | cici Q1 决策 |
| **T-A3** 部署 runbook 起草 | 0.4 | docs/部署/ runbook 整理 / production 准备 / appsettings 配置 / Hangfire / IMemoryCache / 80%生产环境 checklist | 周期收尾 |
| **T-A4** 业务方 G 反馈追踪 + roadmap 20k+ 起草 | 0.2 | demo 第 2 次反馈追踪 + 20k+ roadmap 框架（Q3 中期方向）| 周期收尾 |
| **T-A5** Codex 20j 评审 + 立修 | 0.2 | `codex review --base bc6d652` / 立修保 37 Sprint 0 顺延 | 标准收尾 |
| **T-A6** Sprint 20j 收尾 + V0.x 升版 + memory | 0.3 | V0.1 → V0.4 锁版 + memory 升级（37 Sprint 0 顺延 / 5 Sprint 复盘）| 主代理 a 标准收尾 |

main 主代理 a 总：**~1.5-2.0 PD**（T-A2 条件性）

### 1.2 second 主代理 e 副轨延续（条件性 / ~0.5-1.0 PD / 第 11 次连续）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** Reports 模板 20 → 22+（如时间允许）| 0.3 | 持续扩 22+ 业务模板 |
| **T-E2** dashboard E2E spec 真业务场景加严 | 0.3 | 8/8 完整 + 真接通后端到端业务流程 spec |
| **T-E3** 收尾 + memory + race 检查 | 0.2 | 第 11 次连续 Reports/Dashboards 同模块 |

second 总：**~0.8 PD**（副轨 / 周期收尾自然收敛）

---

## 二、cici 20j 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **业务方第 2 次 demo 时段确认** | 中 | 推荐 5 月下 / 实际 demo 后启动 G-14~G-17 反馈追踪 |
| **NC 真接通启动决策**（条件性）| 低 | 业务方 G-12 后续推进时 cici 决定 |
| **生产环境准备评估** | 高 | 性能压测 + 部署 runbook 通过后 / cici 协调 production deployment 时机 |
| **切 second session** | 中 | 给 e 续 prompt 启动 20j second 副轨 |
| **Codex 20j 评审触发** | 标准 | D2 收尾时手动 `codex review --base bc6d652` |

---

## 三、累计技术债（19r-20i 顺延 + 20j 部分收口）

| 来源 | Task | 20j 处置 |
|---|---|---|
| 20h T-A3 测试 missing case | HighSensitive + dashboard real + Permission integration + Regenerator edge | **继续顺延 20k+ test 专项**（cici 还原 20i T-A1 已确认）|
| 19r-20i G-13 A 顺延 | NcAccountRule 字典扩 | 继续顺延（业务方未触发）|
| NC 真接通预备 | OAuth2 + Polly + 23 接口 | 继续顺延（业务方未触发）|
| 20i G-14~G-17 demo 反馈 | F-3 / G-12 frontend UI / NC 真号回写流程 | **T-A4 协调追踪**（demo 后启动）|

---

## 四、子代理 spawn + 跨 session race 防御（V1.8 [P1] 降级生效）

### 4.1 1c 模块隔离表（延续 20a-20i）

| session | 锁定模块 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / voucher-management/* / contracts/* / monthly-prepayment/* / Warehouses/* / test/ / **docs/部署/（20j T-A3）** |
| **second** | dashboard-bigscreen/* / reports/* / theme.css / DashboardBigscreenAppService / BusinessReportsAppService / NcInterfaceMonitor / DashboardCronConstants |

### 4.2 spawn 策略

- 默认主 worktree
- 教训 13 模板成熟稳定（第 20 次维持记录）
- 子代理评估 spawn — 20j T-A1 复盘 + T-A3 runbook 可考虑 spawn 2 子代理并行（独立 + 0.4 + 0.4 PD）

---

## 五、Codex 20j 评审准备（手动模式延续）

- 20j 收尾 D2-D3 cici 手动触发：`codex review --base bc6d652`（20i second T-E1 末）
- 5-15 min Codex 跑 / main a 后台等通知
- 立修保 **37 Sprint 0 顺延 / 5 Sprint 周期目标达成**

---

## 六、V0.1 启动条件（cici 5 答拍板）

### 5 开放问题待 cici 答

1. **性能压测启动**：
   - A. 顺延 20k+（推荐 / 需 production-like 环境 / 准备成本高 0.5 PD）
   - B. 20j 启动（T-A2 0.5 PD / 基础 unit test 性能 baseline 已有 20h+20i / 生产压测顺延）
   - C. 仅 dashboard 8/8 + Reports 20 mini 压测（0.2 PD / unit test 级 / 已基本完成）

2. **部署 runbook 起草深度**：
   - A. 完整起草（T-A3 0.4 PD / 涵盖 appsettings + Hangfire + IMemoryCache + 80% checklist / 推荐）
   - B. 仅核心 checklist（0.2 PD / production 启动核心 + 顺延 detail 20k+）
   - C. 顺延 20k+（cici 不急）

3. **20k+ roadmap 框架起草**：
   - A. T-A4 起草 20k-20o roadmap（Q3 中期 / 0.2 PD / 推荐）
   - B. 仅简单 next-sprint candidate（0.1 PD）
   - C. 顺延 20k 起 Sprint 时再写

4. **second e 副轨范围**：
   - A. 全 T-E1+T-E2+T-E3（Reports 22+ + E2E spec + 收尾 / ~0.8 PD / 第 11 次连续）
   - B. 仅 T-E2 E2E spec（核心 / 0.3 PD）
   - C. 暂停 second（main 单轨 / 5 Sprint 周期收尾 / second 工作自然收敛）

5. **20j 启动时间**：
   - A. 今天升 V0.2 启动 D1（连续 / 36 Sprint 0 顺延动量延续 / 但 main 已 ~13 PD）
   - B. 明天启动（推荐 / 9 Sprint 高密度后调整）
   - C. 等业务方反馈触发（保守）

### V0.2 拍板条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（§四.1 / 加 docs/部署/）
- second 主代理 e 同步任务卡

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 | main a 起草 · 提前规划框架（5 Sprint 周期 20f-20j 收尾）/ 5 开放问题待 cici 答 |
| V0.2 | 2026-05-17 | **cici 5 答 C/A/A/A/A 拍板**（Q1C mini 压测 / Q2A 完整 runbook / Q3A 20k+ roadmap / Q4A second 全 / Q5A 今天启动 D1）· 启动 D1 |

---

## 八、V0.2 拍板启动 D1（cici 5 答 C/A/A/A/A）

| Q | 答 | 影响 |
|---|---|---|
| Q1 | C | mini 压测 0.2 PD（unit test 级 / 已基本完成 / production 顺延 20k+）|
| Q2 | A | 完整部署 runbook 0.4 PD（appsettings + Hangfire + IMemoryCache + 80% checklist）|
| Q3 | A | 20k+ roadmap 框架起草 0.2 PD（Q3 中期方向）|
| Q4 | A | second 全 T-E1+T-E2+T-E3（~0.8 PD / 第 11 次连续）|
| Q5 | A | 今天启动 D1（36 Sprint 0 顺延动量延续）|

### 8.1 main D1 启动顺序（主轨化主推）

1. **T-A1 5 Sprint 整体复盘文档**（0.4 PD / 首启 / 主要工作 / 类 20a-20e 模板）
2. **T-A3 部署 runbook 起草**（0.4 PD / docs/部署/ + production checklist）
3. **T-A4 20k+ roadmap 框架 + 业务方反馈追踪**（0.2 PD）
4. **T-A2 mini 压测**（0.2 PD / unit test 级 / 已有 20h+20i baseline）
5. **T-A5 Codex 评审 + 立修**（0.2 PD / D2）
6. **T-A6 V0.4 锁版 + memory**（0.3 PD / D2-D3）

main D1 实际：~1.7 PD

### 8.2 second e D1 启动顺序（cici 切 second session）

详 second-e-prompt-20j-raw.txt（待起草）：
1. T-E1 Reports 模板 20 → 22+（0.3 PD）
2. T-E2 dashboard E2E spec 真业务场景加严（0.3 PD）
3. T-E3 收尾 + memory（0.2 PD / 第 11 次连续）

### 8.3 启动条件全部满足

- ✅ 5 开放问题 cici 5 答
- ✅ 1c 模块隔离表确认（加 docs/部署/ main 锁）
- ✅ 20i V0.4 锁版完成（跨仓 `eaf6676` / 36 Sprint 0 顺延 + second 第 10 次连续里程碑）

---

**main 主代理 a 签名**：2026-05-17 V0.1 起草 · V0.2 cici 5 答 C/A/A/A/A 拍板 → 立即启动 D1 / 5 Sprint 周期收尾 / 37 Sprint 0 顺延目标
