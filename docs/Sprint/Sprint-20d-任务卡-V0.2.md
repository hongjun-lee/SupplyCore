# Sprint 20d 任务卡 V0.2（cici 5 答 B/A/B/A/A 拍板启动 D1 · NC 真接通预备启动 / G-12 B 后台 endpoint 实现 / 31 Sprint 0 顺延目标）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（cici 5 答 B/A/B/A/A 拍板 · 主题 NC 真接通预备启动 / G-12 B 触发后台 endpoint 实现 / 业务方反馈仅未闭环项 / race 被动记录第 4 Sprint / 紧接 20c V0.4 启动 D1）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 20d 定版启动任务卡（V0.1 起草 → V0.2 cici 5 答拍板 → 立即启动 D1 / G-12 B NC 真号回写 endpoint 实现）
**配套：** [`Sprint-20c-任务卡-V0.2.md`](./Sprint-20c-任务卡-V0.2.md) + 20c D2-D3 收尾后续顺延债 + 业务方持续反馈

---

## 〇、Sprint 20c 收尾接续（V0.4 锁版后填）

### 〇.1 20c D1-D3 完成数据（V0.4 锁版 `895d9af` 完成）

| 维度 | 期望 | 实际（20c V0.4 锁版后填）|
|---|---|---|
| main commits（主仓）| 3-5 | **3**（second-e-prompt + demo 反馈回填 + Codex 立修）|
| 跨仓 commits（SupplyCore docs）| 3（V0.2 + V0.3 + V0.4）| **3** ✓ |
| main 实际 PD | ~1.9 | **~0.65**（早完 1.25 PD / 业务方接受度高 + 顺延 task 已实现）|
| Codex finding 数 | TBD | **2 P2 全立修**（commit `dd40156` / dashboard 测试 4/4 全过）|
| 30 Sprint 0 顺延 | ✅ 目标 | **✅ 达成 / 连续 7 Sprint 立修**（累计 20 finding / 2.55 PD）|
| second e 实际 PD | ~2.0 | **~1.6**（4 commits / 超目标 aggregator 2→5 + Reports 5→11 / 第 5 次连续）|
| 业务方 demo 反馈数 | F-1~F-8 + M-1~M-6 + G-12~G-13 | **16 项全收集** / 13 ✅ + 1 ⏸ + 2 决策（G-12 B / G-13 A）/ **0 ⚠️ 接受度极高** |

### 〇.2 20c 顺延 task（20d 吸收 / 见 §三）

- 20c D1-D3 实际顺延（V0.4 锁版后回填）
- 业务方 demo 反馈未当 Sprint 闭环的项
- 20c Codex 评审 P3 顺延（如有）

### 〇.3 业务方反馈持续状态（cici 协调中）

- demo 时段：2026-05-16（20c D1）
- 反馈渠道：[`voucher-demo-checklist-20b.md`](../../internal/voucher-demo-checklist-20b.md)
- 20d 主轨：业务方反馈持续吸收 / NC 真接通预备（如反馈触发）

---

## 一、Sprint 20d 范围（提前规划框架 / 总 ~3-4 PD / 工期 ~1 day）

### 1.1 main 主代理 a 主轨候选（~1.5-2.0 PD）

| Task 候选 | PD | 描述 | 触发条件 |
|---|---|---|---|
| **T-A1** 20c 顺延 task 收口 | **0.2** | F-3 12 列 Excel 持续验收 spec / 业务方持续追踪准备 | 20c 收尾 |
| **T-A2** 业务方持续反馈吸收（**Q2 A 仅未闭环项**）| **0.1** | F-3 ⏸ 未涉及项持续验收 / 其他 13 ✅ 不再追踪 / G-13 字典扩持续顺延 20e+ | 业务方持续反馈 |
| **T-A3** NC 真号回写 endpoint 实现（**Q1 B + Q3 B 触发 / 20d 主轨锁定**）| **0.4** | G-12 B 后台 endpoint：PUT /api/supply-cores/interface-receipts/{id}/nc-voucher-number / 字段验证 + 双号制 NcVoucherNumber 写入 + LastModificationTime 更新 / 不需运维 SQL / Backend Controller + AppService + DTO | 业务方 G-12 B 决策触发 |
| **T-A4** race [P0] 观察记录（20d 第 4 Sprint）| 0.1 | 5 Sprint 窗口（20a-20e）/ 20d 是第 4 Sprint / 被动记录 / 0 race 期望 | cici Q3 B 决策延续 |
| **T-A5** Codex 20d 评审 + 立修 | 0.3 | `codex review --base <20c 末 commit>` 评审 20d 全 commits / 立修保 **30 Sprint 0 顺延 / 连续 8 Sprint 立修** | 标准收尾 |
| **T-A6** Sprint 20d 收尾 + V0.x 升版 + memory | 0.4 | V0.1 → V0.4 各阶段锁版 + memory（20c-20d 收尾沉淀经验）| 主代理 a 标准收尾 |

### 1.2 main 子代理 b 副轨候选（~0.5-1.0 PD）

| Task 候选 | PD | 描述 |
|---|---|---|
| **T-B1** 19r-20c 累计技术债总收口（如适用）| 0.3-0.6 | NcAccountRule 字典扩 / voucher-management 强化 / brand tokens 续 / spec strict 实测验收 |
| **T-B2** Buffer | 0.2-0.4 | 20d 中段调整空间 |

### 1.3 second 主代理 e 平行轨候选（~1.5-2.0 PD / 第 6 次连续）

| Task 候选 | PD | 描述 |
|---|---|---|
| **T-E1** Dashboard aggregator 4 → 6+ | 0.5 | 20c 4+ 真接通 / 20d 续 2-3 个（剩余库存周转 / 月费 / 库存价值高敏感 等）|
| **T-E2** Reports 模板 10 → 12+ | 0.4 | 持续扩 12+ 业务报表 / 反 AI slop UI |
| **T-E3** dashboard E2E spec 加严 | 0.3 | 真接通数据校验 / fallback case spec |
| **T-E4** memory / 收尾 | 0.3 | 第 6 次连续 Reports/Dashboards 同模块（19s+19t+20a+20b+20c+20d）|

### 1.4 second 子代理 f（可选 ~0.6 PD）

| Task 候选 | PD | 描述 |
|---|---|---|
| **T-F1** Reports 业务方持续反馈实测 | 0.3 | 反馈到位后实测 + 反馈回填 |
| **T-F2** NcInterface 监控页面强化（如适用）| 0.3 | NC 真接通预备触发 → 监控页面准备 |

---

## 二、cici 20d 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **20c 收尾 V0.4 锁版** | 高 | 20c D2-D3 完成后 / Codex 立修 + V0.4 |
| **业务方持续反馈收集** | 中 | 20c demo 反馈未闭环项 / 持续追踪 |
| **NC 真接通时机决策** | 中 | 业务方反馈 G-12 触发 → 决定是否 20d 启动 NC 真接通 |
| **Codex 20d 评审触发** | 标准 | D2 收尾时手动 `codex review --base <20c 末 commit>` |

| 时机 | 行动 |
|---|---|
| **D-1** | 等 20c V0.4 锁版 + 业务方反馈到位 |
| **D1** | 升 V0.2 启动 D1 + cici 切 second session 给 e 续 prompt |
| **D2** | Codex 评审触发 + V0.3 锁版 |
| **D3** | Codex 立修 + V0.4 锁版 + 30 Sprint 0 顺延记录持续 |

---

## 三、累计技术债（19r-20c 顺延 + 20d 部分收口）

| 来源 | Task | 20d 处置 |
|---|---|---|
| 19r-20c NcAccountRule 字典扩 | 顺延 | T-B1 条件性收口 |
| 20c 业务方反馈 | F-1~F-8 + M-1~M-6 未闭环项 | T-A2 / T-B1 持续吸收 |
| NC 真接通预备 | OAuth2 / Polly / 23 接口 | T-A3 条件性（业务方反馈触发）|
| voucher-management 强化 | 持续 UX | T-B1 |

---

## 四、子代理 spawn + 跨 session race 防御（[[feedback_subagent_git_race_coordination]] 教训 12+）

### 4.1 1c 模块隔离表（main + second 锁定清单 / 20a-20c 维持）

| session | 锁定模块 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / SupplyCoresWebModule.cs / voucher-management/* / contracts/* / monthly-prepayment/* |
| **second** | dashboard-bigscreen/* / reports/* / theme.css / DashboardBigscreenAppService / BusinessReportsAppService / NcInterfaceMonitor / DashboardCronConstants |

### 4.2 spawn 策略（20d 维持）

- **默认主 worktree**（同 19r-20c 模式 / 串行化无 race / 连续 3 Sprint 0 race 实测稳）
- **教训 13 模板**（4 次实测成熟 → 5 次成熟稳定 → 关闭跟踪）
- **stash + pathspec 双重防御**：第 6 次连续场景

### 4.3 跨 session 协议（19s+ 稳定）

- 同 [`second-e-prompt-20c.md`](../../internal/second-e-prompt-20c.md) 协议清单

---

## 五、Codex 20d 评审准备（手动模式延续）

- 20d 收尾 D2-D3 cici 手动触发：`codex review --base <20c 末 commit>`
- 5-15 min Codex 跑 / main a 后台等通知（Bash run_in_background + nohup PID）
- 立修保 **30 Sprint 0 顺延 / 连续 8 Sprint 立修**
- hook 基础设施保留 / 维持手动模式

---

## 六、V0.1 框架开放问题（待 20c 收尾后 cici 5 答）

### 5 开放问题待 cici 答（20c V0.4 锁版后）

1. **20d 主题最终确认**（20c 反馈 + 顺延后定）：
   - A. 20c 顺延债收口 + 业务方持续反馈吸收（默认 / 不主动新功能）
   - B. NC 真接通预备启动（业务方 G-12 触发 / OAuth2 + Polly + 23 接口）
   - C. 19r-20c 累计技术债总收口（大型清扫 / 减债务）
   - D. 切其他主题（cici 决定）

2. **业务方持续反馈范围**：
   - A. 仅 20c 未闭环项续 patch（保守）
   - B. 持续追踪 + 主动联系业务方收集（积极）
   - C. 暂停（业务方反馈饱和 / 不追加扰）

3. **NC 真接通启动时机**：
   - A. 顺延（等业务方 G-12 NC 真号回写明确触发）
   - B. 20d 启动（预备 / 不依赖业务方触发）
   - C. 等 20e+ 启动（与 race [P0] 降级一起做）

4. **race [P0] 20d 观察方式**（5 Sprint 窗口第 4 Sprint）：
   - A. 维持被动记录（推荐 / 20a-20c 已 0 race）
   - B. 加 1 个 isolation worktree 主动实验（加强证据 / 20e 降级前补一）
   - C. 直接降级 [P1]（不等 20e 窗口结束）

5. **20d 启动时间**：
   - A. 紧接 20c V0.4 锁版（连续）
   - B. 间隔 1 天（cici 收集业务方反馈 / 等 G-12 NC 真接通触发）
   - C. 等 20e 周期（保守）

### V0.2 拍板条件

- 20c V0.4 锁版完成
- 业务方 demo 反馈收集结果到位（F-1~F-8 + M-1~M-6 + G-12~G-13 状态明确）
- 5 开放问题 cici 答
- second 主代理 e 同步任务卡

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-16 | main a 起草 · 提前规划框架 / 范围待 20c 收尾后具体化 / 5 开放问题待 cici 答 |
| V0.2 | 2026-05-16 | **cici 5 答 B/A/B/A/A 拍板**（Q1B NC 真接通预备 / Q2A 业务方反馈仅未闭环项 / Q3B 20d 启动 NC 真接通 / Q4A race 被动记录第 4 Sprint / Q5A 紧接 20c V0.4 启动）· 启动 D1 |

---

## 八、V0.2 拍板启动 D1（cici 5 答 B/A/B/A/A）

| Q | 答 | 影响 |
|---|---|---|
| Q1 | B | 主题：NC 真接通预备启动 / T-A3 NC 真号回写 endpoint 实现锁定 0.4 PD |
| Q2 | A | 业务方反馈仅未闭环项续 patch / T-A2 0.1 PD（F-3 ⏸ 12 列 Excel 持续验收）|
| Q3 | B | NC 真接通 20d 启动 / 不等 20e+ / G-12 B 后台 endpoint 触发 |
| Q4 | A | race [P0] 被动记录 / T-A4 0.1 PD（20a-20e 窗口第 4 Sprint / 20a-20c 已 0 race 3 次连续）|
| Q5 | A | 今天启动 D1 / 30 Sprint 0 顺延动量延续 |

### 8.1 main D1 启动顺序

1. **T-A4 race 观察记录**（0.1 PD / 首启 / 不依赖外部）
2. **T-A3 NC 真号回写 endpoint 实现**（0.4 PD / 主要工作 / G-12 B 触发）：
   - 后端 InterfaceReceiptAppService.UpdateNcVoucherNumberAsync
   - Controller PUT /api/supply-cores/interface-receipts/{id}/nc-voucher-number
   - DTO UpdateNcVoucherNumberDto（NcVoucherNumber required string）
   - 字段验证 + Permission check + LastModificationTime 更新
   - 单测 + spec 加严
3. **T-A2 业务方反馈 F-3 持续验收**（0.1 PD / 给 cici 加 demo checklist 续看 .xlsx 12 列 spec）
4. **T-A1 20c 顺延 task 收口**（0.2 PD / F-3 spec 验收 + 其他顺延 task）
5. **T-A5 Codex 评审 + 立修**（D2-D3）
6. **T-A6 V0.x 升版 + memory**（D2-D3）

### 8.2 second e D1 启动顺序（cici 切 second session 给 e 续 prompt）

1. T-E1 dashboard aggregator 4 → 6+（0.5 PD / 续 20c 5 真接通 + 加 2-3 / 库存周转 / 月费 / 高敏感）
2. T-E2 Reports 模板扩 11 → 13+（0.4 PD / 续 20c 11 个 + 加 2-3）
3. T-E3 dashboard E2E spec 加严（0.3 PD / 真接通数据校验 + fallback case spec）
4. T-E4 收尾 + memory + race 检查（0.3 PD / 第 6 次连续 Reports/Dashboards）

### 8.3 启动条件全部满足

- ✅ 5 开放问题 cici B/A/B/A/A 答
- ✅ 1c 模块隔离表确认（§四.1 / 与 20a-20c 同模式）
- ✅ 20c V0.4 锁版完成（`895d9af` / 30 Sprint 0 顺延达成）
- ⏳ second 主代理 e 同步任务卡（cici 切 session 给 e 续 prompt 时同步）

---

**main 主代理 a 签名**：2026-05-16 V0.1 起草 · V0.2 cici 5 答 B/A/B/A/A 拍板 → 立即启动 D1 / G-12 B NC 真号回写 endpoint 实现 / 31 Sprint 0 顺延目标
