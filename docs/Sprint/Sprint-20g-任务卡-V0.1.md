# Sprint 20g 任务卡 V0.1（业务方 G-12 后续 + dashboard 7→8 完整 + second e 第 8 次连续 / 34 Sprint 0 顺延目标）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（main a 起草 · 5 开放问题待 cici 答 / 基于 roadmap §2.2 候选）
**日期：** 2026-05-17
**文档性质：** 实施层 · Sprint 20g 提前规划任务卡（V0.1 起草框架 → cici 5 答 → V0.2 拍板启动 D1）
**配套：** [`Sprint-20f-任务卡-V0.4.md`](./Sprint-20f-任务卡-V0.4.md) + [`sprint-20f-20j-roadmap.md`](../../../SupplyCores/docs/internal/sprint-20f-20j-roadmap.md)

---

## 〇、Sprint 20f 收尾接续（V0.4 锁版 / 33 Sprint 0 顺延 / 连续 9 立修）

### 〇.1 20f D1 完成数据

| 维度 | 实际 |
|---|---|
| main commits（主仓）| 3（`5cba2cd` P2-1 防御性 + `3702ea3` Codex P2 立修 + `82e2011` roadmap）|
| second e commits（主仓）| 4（T-E1~T-E4 / aggregator 5→7 + Reports 11→14 + spec + NcInterface）|
| 跨仓 commits（SupplyCore docs）| 3（V0.2 + prompt 同步 + V0.4 跳 V0.3）|
| main 实际 PD | ~0.95（计划 1.0 / 副轨化精准）|
| second e 实际 PD | ~1.6（第 7 次连续 / aggregator 5→7 + Reports 11→14）|
| **33 Sprint 0 顺延** | **✅ 持续保持** / 连续 9 立修 |
| 新模式实测 | main 防御性立修（second e 预判 → main 不等 Codex 立修 / 节省 Codex 立修工作量）|
| 新经验沉淀 | EF Core Task.WhenAll DbContext 并发陷阱 |

### 〇.2 20f 顺延（20g 吸收）

| 来源 | task | 工作量 | 触发 |
|---|---|---|---|
| 20f T-E1 + Codex 立修 | dashboard aggregator 7/8（剩 1 个高敏感关注）| 0.2 | second e T-E1 |
| 20f second 预判 P2-2 P2-3 | dataSource 注释 + BuildMockSnapshot static/memoize | 0.1 | second e 后续修 |
| 19r-20f F-3 持续 | 12 列 Excel 业务方持续验收 | 0 PD | 业务方触发 |
| 19r-20f G-13 A | NcAccountRule 字典扩 | 0.3-0.4 PD | 业务方反馈触发 |

### 〇.3 race [P0] → [P1] 降级后 20g 适配（继续）

- ✅ 不再 T-A4 race 观察 task（节省 0.05 PD/Sprint）
- 维护 1c 模块隔离表 + 教训 13 + stash + pathspec 多重防御
- 被动监控：仅当出现新 race case 时回升 [P0]

---

## 一、Sprint 20g 范围（业务方 G-12 后续 + dashboard 7→8 完整 + second 第 8 次连续 / 总 ~2-2.5 PD）

### 1.1 main 主代理 a 主轨（副轨化 / ~0.5-1.0 PD）

| Task | PD | 描述 | 触发 |
|---|---|---|---|
| **T-A1** 业务方 demo 第 2 次协调（D2 demo F-3 + G-12 frontend UI 验收）| 0.1 | 与 cici 协调下次 demo 时段（推荐 5 月下）/ demo checklist 续用 | cici 协调 |
| **T-A2** NC 真接通启动时机评估（**Q2 触发**）| 0-0.4 | 业务方 G-12 后续反馈到位 → 评估 NC 真接通启动条件（17a-19q 单边架构启用 UseMock=false / OAuth2 + Polly + 23 接口预备）| cici Q2 决策 |
| **T-A3** Codex 20g 评审 + 立修 | 0.2 | `codex review --base 77210d2`（20f V0.4 跨仓末）/ main 主仓 base `3702ea3` / 立修保 34 Sprint 0 顺延 | 标准收尾 |
| **T-A4** Sprint 20g 收尾 + V0.x 升版 + memory | 0.3 | V0.1 → V0.4 锁版 + memory 升级（34 Sprint 0 顺延 / 业务方第 2 次 demo / NC 真接通启动评估结论）| 主代理 a 标准收尾 |

main 主代理 a 总：**~0.6-1.0 PD**（副轨化延续）

### 1.2 second 主代理 e 主轨 — Reports/Dashboards 续吸收（~1.5 PD / 第 8 次连续）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** dashboard aggregator 7 → 8（完整）| 0.2 | 20f 7 真接通 / 20g 续 1 个（高敏感关注 — 多源 UNION 火工品/NC 失败/暂估）/ 8/8 完整收尾 |
| **T-E2** Reports 模板 14 → 15+ | 0.3 | 20f 14 个 / 20g 续 1-2 个（如外委检修月报 / 设备折旧月报）|
| **T-E3** dashboard 性能压测准备 | 0.3 | 8 aggregator 真接通后 / 5 min IMemoryCache TTL + 30s 轮询 / 大屏端到端性能 baseline |
| **T-E4** second 预判 P2-2 + P2-3 立修 | 0.2 | dataSource 注释明确"非 100% real" + BuildMockSnapshot static/memoize 性能小问题 |
| **T-E5** 收尾 + memory + race 检查 | 0.3 | 第 8 次连续 Reports/Dashboards 同模块（19s + 19t + 20a + 20b 吸收 + 20c + 20d 吸收 + 20e 吸收 + 20f + 20g）|

second 主代理 e 总：**~1.3 PD**（dashboard 接近完整 / 工作量收敛）

---

## 二、cici 20g 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **业务方第 2 次 demo 协调** | 中 | 推荐 5 月下与李建颖 + 汤云龙 demo（F-3 + G-12 frontend UI）|
| **NC 真接通启动决策** | 中 | 业务方 G-12 后续推进后 cici 决定 NC 真接通是否 20g 启动 |
| **切 second session** | 高 | 给 e 续 prompt 启动 20g second 轨 |
| **Codex 20g 评审触发** | 标准 | D2 收尾时手动 `codex review --base 3702ea3` |

| 时机 | 行动 |
|---|---|
| **D1** | 升 V0.2 启动 D1 + cici 切 second session 给 e 续 prompt |
| **D2** | Codex 评审 + V0.3 锁版 |
| **D3** | Codex 立修（如有）+ V0.4 锁版 + 34 Sprint 0 顺延记录 |

---

## 三、累计技术债（19r-20f 顺延 + 20g 部分收口）

| 来源 | Task | 20g 处置 |
|---|---|---|
| 20f T-E1 + Codex 立修 | dashboard 8/8 完整 | **second e T-E1 收口**（最后 1 个 aggregator）|
| 20f second 预判 P2-2 P2-3 | dataSource 注释 + static fallback | **second e T-E4 收口** |
| 19r-20f F-3 持续 | 业务方 demo F-3 12 列 Excel | **main T-A1 协调追踪** |
| 19r-20f G-13 A 顺延 | NcAccountRule 字典扩 | 继续顺延 / 不在 20g 范围 |
| NC 真接通预备 | OAuth2 + Polly + 23 接口 | **main T-A2 条件性启动**（cici Q2 决策）|

---

## 四、子代理 spawn + 跨 session race 防御（V1.8 [P1] 降级生效）

### 4.1 1c 模块隔离表（main + second 锁定清单 / 延续 20a-20f）

| session | 锁定模块 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / SupplyCoresWebModule.cs / voucher-management/* / contracts/* / monthly-prepayment/* |
| **second** | dashboard-bigscreen/* / reports/* / theme.css / DashboardBigscreenAppService / BusinessReportsAppService / NcInterfaceMonitor / DashboardCronConstants |

### 4.2 spawn 策略 + race 防御

- 默认主 worktree（race [P1] 降级后不强制 isolation）
- 教训 13 模板成熟稳定（第 13 次维持记录）
- stash + pathspec 双重防御保留
- main 防御性立修模式（20f 实测 / second e 预判 → main 不等 Codex 立修）

---

## 五、Codex 20g 评审准备（手动模式延续）

- 20g 收尾 D2-D3 cici 手动触发：`codex review --base 3702ea3`（20f Codex 立修末）
- 5-15 min Codex 跑 / main a 后台等通知
- 立修保 **34 Sprint 0 顺延 / 连续 10 Sprint 立修**

---

## 六、V0.1 启动条件（cici 5 答拍板）

### 5 开放问题待 cici 答

1. **20g 主题确认**：
   - A. 业务方 G-12 后续 + dashboard 完整 + second 第 8 次连续（推荐 / 自然 next）
   - B. NC 真接通正式启动（如业务方 G-12 后续触发）
   - C. 累计技术债清扫为主（顺延 second 续吸收）

2. **NC 真接通启动时机**：
   - A. 顺延 20h+（业务方 G-12 后续未明确 / 0 PD）
   - B. 20g 启动评估（T-A2 0.4 PD / OAuth2 + Polly + 23 接口预备）
   - C. 等业务方明确推进后再启动（保守）

3. **second e 续 Reports/Dashboards 范围**：
   - A. T-E1~T-E5 全任务（~1.3 PD / 推荐 / 第 8 次连续 / dashboard 8/8 完整收尾）
   - B. 仅 T-E1+T-E2（dashboard 完整 + Reports 续 / 0.5 PD / 保守）
   - C. 暂停 second（仅 main / 等 cici 协调）

4. **业务方第 2 次 demo 时段**：
   - A. T-A1 0.1 PD 追踪协调（与 cici 协调推荐 5 月下）
   - B. 顺延 20h（业务方未主动反馈）
   - C. 主动联系业务方下次 demo

5. **20g 启动时间**：
   - A. 今天升 V0.2 启动 D1（连续 / 33 Sprint 0 顺延动量延续 / 但 main 已 ~11 PD）
   - B. 明天启动（推荐 / 6 Sprint 高密度后调整 / main 工作量饱和）
   - C. 等业务方反馈触发（保守）

### V0.2 拍板条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（§四.1）
- second 主代理 e 同步任务卡

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 | main a 起草 · 提前规划框架（基于 roadmap §2.2 候选）/ 5 开放问题待 cici 答 |

---

**main 主代理 a 签名**：2026-05-17 V0.1 起草（基于 roadmap §2.2 候选）· 等 cici 5 答 + 升 V0.2 启动
