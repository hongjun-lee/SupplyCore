# Sprint 20f 任务卡 V0.1（second e 续吸收 + 业务方 F-3 持续验收 + NC 真接通下一步评估 / 33 Sprint 0 顺延目标）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（main a 起草 · 5 开放问题待 cici 答）
**日期：** 2026-05-17
**文档性质：** 实施层 · Sprint 20f 提前规划任务卡（V0.1 起草框架 → cici 5 答 → V0.2 拍板启动 D1）
**配套：** [`Sprint-20e-任务卡-V0.4.md`](./Sprint-20e-任务卡-V0.4.md) + [`sprint-20a-20e-retrospective.md`](../../../SupplyCores/docs/internal/sprint-20a-20e-retrospective.md)

---

## 〇、Sprint 20a-20e 收尾接续（5 Sprint 整体复盘归档完成）

### 〇.1 5 Sprint 战绩汇总（复盘文档已归档）

| 维度 | 数据 |
|---|---|
| Sprint 完整闭环 | 5（20a-20e）|
| Wall-clock | < 2 天（2026-05-16 → 2026-05-17）|
| 主仓 commits | 18+（含 second e 4）|
| 跨仓 commits | 14+ |
| main 实际 PD | ~9.15（计划 12-13 / 节省 3-3.85 PD）|
| Codex finding | 21 立修 + 2 次 0 通过 |
| **32 Sprint 0 顺延** | **✅ 持续保持** |
| 双里程碑 | ✅ race 降级 + 双号制全栈 |

### 〇.2 20a-20e 顺延 task（20f 吸收）

| 来源 | task | 工作量 | 触发 |
|---|---|---|---|
| 19s-20e 持续顺延 | **second e 续 dashboard + Reports（第 7+ 次连续）**| ~1.5+ PD | cici 切 second session |
| 20c demo F-3 | F-3 12 列 Excel 持续验收 | 0 PD（演练 step 已存在）| 业务方持续 demo |
| 19r-20e G-13 A | NcAccountRule 字典扩 | 0.3-0.4 PD | 业务方反馈触发 |
| PO 决策保留 | NC 真接通预备启动评估 | TBD | 业务方 G-12 推进后续 |

### 〇.3 race [P0] → [P1] 降级后 20f 适配

- ✅ 不再 T-A4 race 观察 task（节省 0.05 PD/Sprint）
- ✅ 维护 1c 模块隔离表 + 教训 13 + stash + pathspec 多重防御
- 触发回升 [P0] 条件保留：新 race case / 1c 隔离失效 / 教训 13 模板失效

---

## 一、Sprint 20f 范围（second e 主轨 + main 副轨 / 总 ~2-2.5 PD / 工期 ~1 day）

### 1.1 main 主代理 a 主轨（副轨化 / ~0.5-1 PD）

main 在 20f 角色降低 — 主要是 second e 续吸收 Sprint / main 副轨小工作量：

| Task | PD | 描述 | 触发 |
|---|---|---|---|
| **T-A1** 业务方 F-3 持续验收追踪 | 0.1 | F-3 ⏸ 12 列 Excel 持续验收 / 与 cici 协调下次 demo 时段 | 业务方持续 demo |
| **T-A2** NC 真接通下一步评估（**Q3 触发**）| 0-0.4 | 业务方 G-12 后续反馈推进 / 评估 NC OAuth2 + Polly + 23 接口预备启动时机 / 主线代码暂不动 | cici Q3 决策 |
| **T-A3** Codex 20f 评审 + 立修 | 0.2 | `codex review --base 6d13d5c` / 立修保 33 Sprint 0 顺延 | 标准收尾 |
| **T-A4** Sprint 20f 收尾 + V0.x 升版 + memory | 0.3 | V0.1 → V0.4 锁版 + memory 升级（33 Sprint 0 顺延 / 6 Sprint 高密度后续节奏）| 主代理 a 标准收尾 |

main 主代理 a 总：**~0.6-1.0 PD**（副轨小工作量 / 让 second e 主跑）

### 1.2 second 主代理 e 主轨 — Reports/Dashboards 续吸收（~1.5-2.0 PD / 第 7 次连续）

吸收 20d+20e second e 计划未启动任务：

| Task | PD | 描述 |
|---|---|---|
| **T-E1** dashboard aggregator 5 → 7+ | 0.5 | 20c 5 真接通 / 20f 续 2 个（库存周转 / 在租设备月费 / 高敏感关注）|
| **T-E2** Reports 模板 11 → 13+ | 0.4 | 20c 11 个 / 20f 续 2 个（月结对账 / 反结申请 / 暂估月报）|
| **T-E3** dashboard E2E spec 加严 | 0.3 | 真接通数据校验 + fallback case spec + 30s 轮询稳定（顺延 20d+20e）|
| **T-E4** NcInterface 监控强化 | 0.3 | NcVoucherNumber 填写后 status 显示真号 / aria-live 提示（顺延 20e）|
| **T-E5** 收尾 + memory + race 检查 | 0.3 | 第 7 次连续 Reports/Dashboards 同模块（19s + 19t + 20a + 20b + 20c + 20d + 20e + 20f）|

second 主代理 e 总：**~1.8 PD**

---

## 二、cici 20f 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **切 second session** | 高 | 给 e 续 prompt 启动 second e 主轨（20f main 副轨化 / 让 second 主跑）|
| **业务方 F-3 持续验收** | 中 | 下次 demo 时打开 .xlsx 验收 12 列字段 |
| **NC 真接通时机决策** | 低 | 业务方 G-12 后续推进时 cici 决定是否启动 NC 真接通 |
| **Codex 20f 评审触发** | 标准 | D2 收尾时手动 `codex review --base 6d13d5c` |

| 时机 | 行动 |
|---|---|
| **D1** | 升 V0.2 启动 D1 + cici 切 second session 给 e 续 prompt（second 主跑）|
| **D2** | Codex 评审 + V0.3 锁版 |
| **D3** | Codex 立修（如有）+ V0.4 锁版 + 33 Sprint 0 顺延记录 |

---

## 三、累计技术债（19r-20e 顺延 + 20f 部分收口）

| 来源 | Task | 20f 处置 |
|---|---|---|
| 19s-20e second e 续 | T-E1~T-E5 完整吸收 | **second e 主轨**（~1.8 PD）|
| 19r-20e G-13 A 顺延 | NcAccountRule 字典扩 | 继续顺延 / 不在 20f 范围 |
| 20c demo F-3 ⏸ | 12 列 Excel 持续验收 | **T-A1 追踪**（main 副轨 0.1 PD）|
| PO 决策保留 | NC 真接通预备 | **T-A2 评估**（条件性 / cici Q3 决策）|

---

## 四、子代理 spawn + 跨 session race 防御（V1.8 [P1] 降级生效）

### 4.1 1c 模块隔离表（main + second 锁定清单 / 延续）

| session | 锁定模块 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / SupplyCoresWebModule.cs / voucher-management/* / contracts/* / monthly-prepayment/* |
| **second** | dashboard-bigscreen/* / reports/* / theme.css / DashboardBigscreenAppService / BusinessReportsAppService / NcInterfaceMonitor / DashboardCronConstants |

### 4.2 spawn 策略（20f 维持）

- 默认主 worktree（race [P1] 降级后不强制 isolation）
- 教训 13 模板成熟稳定（5 次成功后 graduate / 维持记录但不跟踪）
- stash + pathspec 双重防御保留

### 4.3 race [P1] 维护

- **不再 T-A4 race 观察 task**（20e 起 race [P0] → [P1] 降级生效 / 节省 0.05 PD/Sprint）
- 被动监控：仅当出现新 race case 时回升 [P0]

---

## 五、Codex 20f 评审准备（手动模式延续）

- 20f 收尾 D2-D3 cici 手动触发：`codex review --base 6d13d5c`（20e 末 commit）
- 5-15 min Codex 跑 / main a 后台等通知
- 立修保 **33 Sprint 0 顺延**

---

## 六、V0.1 启动条件（cici 5 答拍板）

### 5 开放问题待 cici 答

1. **20f 主题确认**：
   - A. second e 主轨 + main 副轨化（推荐 / second e 续吸收 + main 副轨小工作量）
   - B. main 主轨 + second e 副轨（main 启 NC 真接通预备 / second 副轨）
   - C. 双方均副轨（保守 / 20f 是个调整 Sprint）
   - D. main 唯一 / second 暂停（仅 main 跑 / 等业务方反馈）

2. **second e 续 Reports/Dashboards 范围**：
   - A. 全任务（T-E1~T-E5 / ~1.8 PD / 推荐 / 吸收 20d+20e 顺延）
   - B. 仅 T-E1+T-E2（dashboard + Reports / 0.9 PD / 保守）
   - C. 暂停 second（仅 main / 等 cici 协调其他主轨）

3. **NC 真接通启动时机**：
   - A. 顺延（业务方 G-12 后续未明确 / 0 PD）
   - B. 20f 启动评估（T-A2 0.4 PD / 评估 OAuth2 + Polly + 23 接口预备）
   - C. 等 20g+ 启动（cici 决策业务方反馈后再启动）

4. **业务方 F-3 12 列 Excel 持续验收**：
   - A. T-A1 0.1 PD 追踪（与 cici 协调下次 demo 时段）
   - B. 顺延 20g（业务方未主动反馈 / 不主动追加）
   - C. 主动联系业务方下次 demo

5. **20f 启动时间**：
   - A. 今天升 V0.2 启动 D1（连续 / 32 Sprint 0 顺延动量延续）
   - B. 明天启动（保守 / 5 Sprint 高密度后调整）
   - C. 等业务方持续反馈触发（保守 / wall-clock 拉长 ≥ 2 day）

### V0.2 拍板条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（§四.1 / 与 20a-20e 同模式）
- second 主代理 e 同步任务卡（cici 切 session 给 e 续 prompt）

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 | main a 起草 · 提前规划框架 / 5 开放问题待 cici 答 |

---

**main 主代理 a 签名**：2026-05-17 V0.1 起草（提前规划框架）· 等 cici 5 答 + 升 V0.2 启动
