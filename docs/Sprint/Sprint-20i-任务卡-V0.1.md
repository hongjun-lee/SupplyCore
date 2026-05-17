# Sprint 20i 任务卡 V0.1（NC 真接通条件性 + 测试覆盖率深化 + second 第 10 次连续 / 36 Sprint 0 顺延目标）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（main a 起草 · 5 开放问题待 cici 答 / 基于 roadmap §2.4 + 20h T-A3 顺延）
**日期：** 2026-05-17
**文档性质：** 实施层 · Sprint 20i 提前规划任务卡（V0.1 起草框架 → cici 5 答 → V0.2 拍板启动 D1）
**配套：** [`Sprint-20h-任务卡-V0.4.md`](./Sprint-20h-任务卡-V0.4.md) + [`sprint-20f-20j-roadmap.md`](../../../SupplyCores/docs/internal/sprint-20f-20j-roadmap.md) §2.4 + [`test-coverage-audit-20h.md`](../../../SupplyCores/docs/internal/test-coverage-audit-20h.md)

---

## 〇、Sprint 20h 收尾接续（V0.4 锁版 / 35 Sprint 0 顺延 / 连续 10 立修 + 4 次 0 finding 通过）

### 〇.1 20h D1 完成数据

| 维度 | 实际 |
|---|---|
| main commits（主仓）| 5（second-e-prompt + 警告 baseline + 测试审计 + docs INDEX + V0.2 跨仓 sync）|
| second e commits（主仓）| 3（T-E1 Reports 16→18 + T-E2 性能 baseline + T-E3 收尾）|
| 跨仓 commits（SupplyCore docs）| 2（V0.2 + V0.4 跳 V0.3 类 20f）|
| main 实际 PD | ~0.5（计划 1.3 / 早完 0.8）|
| second e 实际 PD | ~1.0（第 9 次连续高效）|
| **35 Sprint 0 顺延** | **✅ 持续保持** / 连续 10 立修 + **4 次 0 finding 通过** |
| 双 0 finding 通过（同 Sprint）| ✅ 首次实测（main 评审 + T-E2 补评审）|
| 治理基础设施成熟标志 | ✅ 达成（第 3+4 次 0 finding 通过证明）|

### 〇.2 20h 顺延 → 20i 吸收候选

| 来源 | task | 工作量 | 处置 |
|---|---|---|---|
| 20h T-A3 测试覆盖率 missing case | HighSensitive aggregator 实际数据 + dashboard 8 aggregator real 路径 integration / Reports endpoint Permission integration / NcVoucherRegenerator strict edge case | ~1.5 PD | **T-A1 测试专项**（推荐 / 20i 主轨）|
| 19r-20h G-13 A 顺延 | NcAccountRule 字典扩 | 0.3-0.4 PD | 继续顺延（业务方未触发）|
| 业务方第 2 次 demo | F-3 + G-12 frontend UI + M-7 等 | cici 协调 | **T-A2 协调追踪**（条件性）|
| NC 真接通预备 | OAuth2 + Polly + 23 接口 启用 | ~1.3 PD | **T-A3 启动评估**（条件性 / 见 §六 Q1）|
| Reports / dashboard 持续 | 18 → 20+ + dashboard 真实压测 | ~0.5 PD | **second 副轨**（第 10 次连续）|

### 〇.3 NC 真接通启动评估（条件性 / cici 决策）

按 roadmap §四触发条件：
- **A. 业务方 G-12 后续推进**（财务侧主动反馈"想测试 NC 真接通"）
- **B. PO 决策反转**（"NC 暂不上线" → "NC 上线"决策更新）
- **C. 5 Sprint 业务方反馈饱和**（凭证导出主线全部业务方验收通过后自然推进）

**当前状态**：20c demo 后业务方 16 项 0 ⚠️ / G-12 决策 B 后台 endpoint 实施完整 / 但**业务方未主动触发 NC 真接通**。

**评估**：等业务方第 2 次 demo（推荐 5 月下）反馈后再决定 / 不在 20i 主动启动。

---

## 一、Sprint 20i 范围（测试覆盖深化 + 业务方 demo 协调 + second 续 / 总 ~2.5-3 PD / 工期 ~1 day）

### 1.1 main 主代理 a 主轨 — 测试覆盖率深化（主轨化延续 / ~1.3-1.7 PD）

| Task | PD | 描述 | 触发 |
|---|---|---|---|
| **T-A1** 测试覆盖率深化（20h T-A3 顺延 missing case）| 0.6 | 关键 missing case：HighSensitive aggregator 实际数据 mock + Reports endpoint Permission integration + NcVoucherRegenerator strict edge case | 20h T-A3 审计 |
| **T-A2** 业务方第 2 次 demo 协调追踪（条件性）| 0.1 | 与 cici 协调 demo 时段 / 反馈窗口 | 业务方 |
| **T-A3** NC 真接通启动评估（条件性 / 见 §六 Q1）| 0-0.4 | 业务方反馈触发后启动 OAuth2 + Polly + 23 接口预备 / 否则跳过 | cici Q1 决策 |
| **T-A4** Codex 20i 评审 + 立修 | 0.2 | `codex review --base 7d810e8`（20h second T-E2 末）/ 立修保 36 Sprint 0 顺延 | 标准收尾 |
| **T-A5** Sprint 20i 收尾 + V0.x 升版 + memory | 0.3 | V0.1 → V0.4 锁版 + memory 升级（36 Sprint 0 顺延 / 测试深化经验）| 主代理 a 标准收尾 |

main 主代理 a 总：**~1.2-1.6 PD**（T-A3 条件性）

### 1.2 second 主代理 e 副轨 — Reports/Dashboards 续吸收（~1.0 PD / 第 10 次连续）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** Reports 模板 18 → 20+ | 0.4 | 持续扩（如：物料周转月报 / 入库时效周报 / 暂估调差季报）|
| **T-E2** dashboard 真实环境压测 baseline 实测 | 0.3 | 20h T-E2 unit test 已立 spec / 20i 真 5100 host serve 实测 vs spec 阈值 |
| **T-E3** 收尾 + memory + race 检查 | 0.3 | 第 10 次连续 Reports/Dashboards 同模块（19s + 19t + 20a + 20c + 20e（顺延）+ 20f + 20g + 20h + 20i）|

second 主代理 e 总：**~1.0 PD**（副轨延续）

---

## 二、cici 20i 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **业务方第 2 次 demo 时段确认** | 中 | 推荐 5 月下与李建颖 + 汤云龙 demo（F-3 + G-12 frontend UI）|
| **NC 真接通启动决策** | 低 | 业务方反馈触发后 cici 决定 20i T-A3 启动 |
| **切 second session** | 中 | 给 e 续 prompt 启动 20i second 副轨 |
| **Codex 20i 评审触发** | 标准 | D2 收尾时手动 `codex review --base 7d810e8` |

---

## 三、累计技术债（19r-20h 顺延 + 20i 部分收口）

| 来源 | Task | 20i 处置 |
|---|---|---|
| 20h T-A3 测试 missing case | HighSensitive + dashboard 8 aggregator real + Permission integration + Regenerator edge | **T-A1 收口**（main 主轨）|
| 19r-20h G-13 A 顺延 | NcAccountRule 字典扩 | 继续顺延（业务方未触发）|
| 20c demo F-3 / G-12 frontend | 业务方 demo 第 2 次验收 | **T-A2 协调追踪** |
| NC 真接通预备 | OAuth2 + Polly + 23 接口 | **T-A3 条件性**（cici Q1 决策）|
| Reports 18 → 20+ | 持续扩 | **second 副轨 T-E1** |

---

## 四、子代理 spawn + 跨 session race 防御（V1.8 [P1] 降级生效）

### 4.1 1c 模块隔离表（延续 20a-20h）

| session | 锁定模块 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / SupplyCoresWebModule.cs / voucher-management/* / contracts/* / monthly-prepayment/* / Warehouses/* / **测试项目 test/Nova.SupplyCores.Application.Tests/Reports + Vouchers + Interfaces（20i T-A1 测试深化）** |
| **second** | dashboard-bigscreen/* / reports/* / theme.css / DashboardBigscreenAppService / BusinessReportsAppService / NcInterfaceMonitor / DashboardCronConstants |

⚠️ **20i 注意**：T-A1 测试深化涉及 DashboardBigscreenAppService_Tests + BusinessReportsAppService_Tests（second 锁定模块的测试项目）/ 与 second 主代理 e 跨 session 协调 — main 改 test 项目 / second 改 src/Reports/Dashboards 主代码 / 1c 隔离仍保持。

### 4.2 spawn 策略 + race 防御

- 默认主 worktree（race [P1] 降级后不强制）
- 教训 13 模板成熟稳定（第 18 次维持记录）
- 子代理评估 spawn — 20i T-A1 0.6 PD 可考虑 spawn 2 子代理并行（测试 case 独立 + ROI 高）

### 4.3 补评审防漏教训（20h T-E2 新加）

- second 在 main Codex 评审后继续 push → Codex 评审范围漏
- cici "Second 完成"信号必先 fetch + log origin/main 检查 → 如有新 commits 必须补评审

---

## 五、Codex 20i 评审准备（手动模式延续）

- 20i 收尾 D2-D3 cici 手动触发：`codex review --base 7d810e8`（20h second T-E2 末）
- 5-15 min Codex 跑 / main a 后台等通知
- 立修保 **36 Sprint 0 顺延 / 连续 11 Sprint 立修 OR 5 次 0 finding 通过**

---

## 六、V0.1 启动条件（cici 5 答拍板）

### 5 开放问题待 cici 答

1. **NC 真接通启动时机**：
   - A. 顺延 20j+（业务方 G-12 后续未明确 / 0 PD / 推荐 / 等业务方第 2 次 demo 反馈）
   - B. 20i 启动评估（T-A3 0.4 PD / OAuth2 + Polly + 23 接口预备）
   - C. 等 PO 决策反转明确（保守）

2. **测试覆盖率深化范围**：
   - A. 全 missing case（HighSensitive + dashboard real path + Permission integration + Regenerator edge / T-A1 0.6 PD / 推荐）
   - B. 仅 HighSensitive + Permission（关键安全 / 0.3 PD / 保守）
   - C. 顺延 20j+（不深化 / baseline 已健康）

3. **second e 副轨范围**：
   - A. 全 T-E1+T-E2+T-E3（Reports 20+ + dashboard 实测 + 收尾 / 第 10 次连续 / ~1.0 PD）
   - B. 仅 T-E2 dashboard 实测（性能 baseline 真实验证 / 0.3 PD）
   - C. 暂停 second（main 单轨 / second 工作收敛）

4. **业务方第 2 次 demo 协调追踪**：
   - A. T-A2 0.1 PD 追踪（与 cici 协调 5 月下推荐时段）
   - B. 顺延 20j（cici 协调后再追踪）
   - C. 主动联系业务方（紧迫推进）

5. **20i 启动时间**：
   - A. 今天升 V0.2 启动 D1（连续 / 35 Sprint 0 顺延动量延续 / 但 main 已 ~12.5 PD）
   - B. 明天启动（推荐 / 8 Sprint 高密度后调整）
   - C. 等业务方反馈触发（保守）

### V0.2 拍板条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（§四.1 / 注意测试项目 + main 改 test）
- second 主代理 e 同步任务卡

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 | main a 起草 · 提前规划框架（基于 roadmap §2.4 + 20h T-A3 测试 missing case 顺延）/ 5 开放问题待 cici 答 |

---

**main 主代理 a 签名**：2026-05-17 V0.1 起草（基于 roadmap §2.4 候选 + 20h 顺延吸收）· 等 cici 5 答 + 升 V0.2 启动
