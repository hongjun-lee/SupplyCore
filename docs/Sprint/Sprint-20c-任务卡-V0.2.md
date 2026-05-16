# Sprint 20c 任务卡 V0.2（cici 5 答全 A 拍板启动 D1 · 业务方今天 demo + second e 续 / main 1.5-2.0 PD + second e 2.0 PD / 30 Sprint 0 顺延目标）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（cici 5 答全 A 拍板 · 业务方今天 demo + second e 续 / NcAccountRule 跳过 / race 被动记录 / 今天启动 D1）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 20c 定版启动任务卡（V0.1 起草 → V0.2 cici 5 答全 A 拍板 → 立即启动 D1 / 业务方今天 demo 后反馈吸收）
**配套：** [`Sprint-20b-任务卡-V0.4.md`](./Sprint-20b-任务卡-V0.4.md) + 20b second 轨顺延 + 业务方 demo 反馈

---

## 〇、Sprint 20b 收尾接续（V0.4 锁版 / 29 Sprint 0 顺延 / 连续 6 立修达成）

### 〇.1 20b D1 完成数据

| 维度 | 实际 | 备注 |
|---|---|---|
| main commits（主仓）| 4 | T-A1 `ea7e631` + T-A3 `9fd5a71` + Codex 立修 `39e4b09` + 配套 |
| 跨仓 commits（SupplyCore docs）| 3 | V0.2 `7f3d415` + V0.3 `46e428f` + V0.4 `c13d59b` |
| main 实际 PD | ~1.3 | 计划 1.5 / 早完 0.2 PD |
| Codex finding | 2 P2 全立修 | 30 min / spec BIZ 断言修 + runbook SQL 修 |
| 29 Sprint 0 顺延 | ✅ | 连续 6 Sprint 立修（19q + 19r + 19s + 19t + 20a + 20b = 18 finding 全修 / 2.4 PD 累计） |
| second e 状态 | ⏸ 待续 | 20b 计划 ~2.0 PD 未启动 / 20c 吸收 |

### 〇.2 20b 留 task（20c 吸收 / 见 §三）

- **20b second 轨吸收**：T-E1 dashboard 8 aggregator 2 → 4+ / T-E2 Reports 8 → 10+ / T-E3 30s 轮询稳定 / T-E4 NcInterface menu 协调 / T-E5 收尾（总 ~2.0 PD）
- **20b T-B 副轨吸收**：voucher-management 工具栏 UX patch（业务方反馈预备）+ spec strict 模式实测验收（cici 跑 runbook）
- **20b T-C 第三轨吸收**：brand tokens 续扩到剩余 page（contracts / monthly-prepayment / nc-interface）

### 〇.3 业务方 demo 反馈状态（cici 协调中）

- demo 时段：cici 协调中（建议 D1-D2 内）
- 对接人：财务 = 李建颖 / 物资 = 汤云龙
- demo checklist：[`voucher-demo-checklist-20b.md`](../../internal/voucher-demo-checklist-20b.md)（F-1~F-8 + M-1~M-6 + G-1~G-13）
- 反馈到位 → 20c main 主轨吸收

---

## 一、Sprint 20c 范围（second e 续 + 业务方 demo 反馈接通 / 双 session / 总 ~3.5-4 PD / 工期 ~1 day）

### 1.1 main 主代理 a 主轨 — 业务方 demo 反馈吸收 + 顺延债清零（~1.5-2.0 PD）

| Task | PD | 描述 | 来源 |
|---|---|---|---|
| **T-A1** 业务方 demo 反馈吸收（**Q2 A 今天 demo / 锁定**）| **0.8** | cici 今天协调李建颖 + 汤云龙 demo / 反馈 G-1~G-13 + F-1~F-8 + M-1~M-6 patch / 等 cici 收集反馈回填后 patch | 20b T-A3 demo checklist 反馈窗口 |
| **T-A2** NcAccountRule 字典扩（**Q3 A 跳过**）| **0** | cici Q3 A 决策：demo 反馈未明确"借贷科目代码默认值不准"前不动 / 顺延 20d+ 字典扩 | 19r b 占位 / 20a + 20b T-A2 持续顺延 / **20c 跳过** |
| **T-A3** voucher-management UX patch（业务方 demo 反馈预备）| 0.3 | 批量下载进度条 / 批量 mark-downloaded 进度 / 错误重试按钮 / 表格列宽自适应 | 20b T-B2 顺延 |
| **T-A4** race [P0] 观察记录（20c 第 3 Sprint）| 0.1 | 5 Sprint 窗口（20a-20e）/ 20c 是第 3 Sprint / 被动记录 / 0 race 期望 | cici Q3 B 决策延续 |
| **T-A5** Codex 20c 评审 + 立修 | 0.3 | `codex review --base 39e4b09` 评审 20c 全 commits / 立修保 **30 Sprint 0 顺延 / 连续 7 Sprint 立修** | 标准收尾 |
| **T-A6** Sprint 20c 收尾 + V0.x 升版 + memory | 0.4 | V0.1 → V0.4 各阶段锁版 + memory（业务方 demo 反馈吸收经验 / 第 5 次连续 second / 30 Sprint 0 顺延）| 主代理 a 标准收尾 |

main 主代理 a 总：**~1.9 PD**（T-A1 锁 0.8 / T-A2 跳过 / cici Q2 + Q3 拍板）

### 1.2 main 子代理 b 副轨 — voucher-management 强化 + spec strict 实测验收（~0.5-0.8 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-B1** voucher-management strict spec 实测验收（cici 跑 runbook + 截图归档）| 0.3 | cici 按 [`voucher-management-strict-e2e-runbook.md`](../../internal/voucher-management-strict-e2e-runbook.md) §五 跑通 / 截图归档 / 实测结果回填 20c V0.4 |
| **T-B2** brand tokens 续扩剩余 page（contracts / monthly-prepayment / nc-interface）| 0.3 | 20b T-C1 顺延 / 反 AI slop UX 持续 |
| **T-B3** Buffer | 0.2 | 20c 中段调整 |

### 1.3 second 主代理 e 平行轨 — Reports/Dashboards 续吸收（~2.0 PD / 第 5 次连续）

吸收 20b second e 计划完整未启动任务：

| Task | PD | 描述 |
|---|---|---|
| **T-E1** dashboard 8 aggregator 真接通 2 → 4+ | 0.6 | 20a 2 真（NcSuccessRate / WarnAlertKpi）/ 20c 续 2-3（库存价值 StockBatchBalance / 厂矿订单 PurchaseOrder / 单据流转）|
| **T-E2** Reports 模板扩 8 → 10+ | 0.5 | 20a 8（5 + 3 新增）/ 20c 续 2-3（如月结对账 + 反结申请 + 暂估月报）|
| **T-E3** dashboard 30s 轮询稳定 + 切实例数据校验 E2E | 0.3 | mock-to-real 切换 spec / fallback case spec / IMemoryCache 5min TTL 验证 |
| **T-E4** NcInterface 监控 + voucher-management menu 协调 | 0.3 | menu group + breadcrumb 协调 |
| **T-E5** 收尾 + memory + race 检查 | 0.3 | 同步 main commit / race 检查（跨 session 第 5 次连续）|

second 主代理 e 总：**~2.0 PD**（与 19s+19t+20a+20b 同节奏 / 第 5 次连续 Reports/Dashboards 同模块）

### 1.4 second 子代理 f（可选 ~0.6 PD / 仅业务方 demo 反馈到位且时间允许）

| Task | PD | 描述 |
|---|---|---|
| **T-F1** Reports 业务方 demo 实测演练录屏 | 0.3 | 业务方 demo 后 / 录屏 + checklist 沉淀到 docs/internal/ |
| **T-F2** dashboard 真接通 demo 验收 | 0.3 | NcSuccessRate 真数据 + WarnAlertKpi 真预警 demo 验收 |

---

## 二、cici 20c 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **业务方 demo 时段确认** | 高 | 李建颖 + 汤云龙 demo 时间窗口（如未协调成功 → T-A1 跳过 / 顺延 20d）|
| **demo checklist 反馈回填** | 中 | F-1~F-8 / M-1~M-6 / G-12~G-13 反馈写回 20b checklist |
| **strict spec 实测验收** | 中 | cici 按 runbook 跑通 + 截图归档 docs/internal/screenshots/ |
| **切 second session** | 标准 | 给 e 续 prompt 启动 20c second 轨 |
| **Codex 20c 评审触发** | 标准 | D2 收尾时手动 `codex review --base 39e4b09` |

| 时机 | 行动 |
|---|---|
| **D1** | 升 V0.2 启动 D1 + cici 切 second session 给 e 续 prompt + 协调业务方 demo |
| **D2** | 业务方 demo（如已协调）+ 反馈回填 + Codex 评审触发 + V0.3 锁版 |
| **D3** | Codex 立修 + V0.4 锁版 + 30 Sprint 0 顺延记录持续 |

---

## 三、累计技术债（19r-20b 顺延 + 20c 部分收口）

| 来源 | Task | PD | 20c 处置 |
|---|---|---|---|
| 19r T-A3 / 19s T-A3 / 20a T-A3 / 20b T-A2 | NcAccountRule 字典扩 | 0-0.4 | **T-A2 条件性收口**（业务方 G-13 反馈触发）|
| 20b T-B2 顺延 | voucher-management UX patch | 0.3 | **T-A3 收口** |
| 20b T-C1 顺延 | brand tokens 续扩 | 0.3 | **T-B2 收口** |
| 20b second 轨完整 | T-E1~T-E5 全 5 项 | 2.0 | **second e 全吸收** |
| 跨 Sprint 业务方 demo 反馈 | G-12~G-13 + F-1~F-8 + M-1~M-6 | 0-0.8 | **T-A1 条件性**（cici 协调成功后）|

---

## 四、子代理 spawn + 跨 session race 防御（[[feedback_subagent_git_race_coordination]] 教训 12+）

### 4.1 1c 模块隔离表（main + second 锁定清单 / 20a-20b 维持）

| session | 锁定模块 / 文件 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / SupplyCoresWebModule.cs / voucher-management/* / contracts/* / monthly-prepayment/* |
| **second** | dashboard-bigscreen/* / reports/* / theme.css / DashboardBigscreenAppService / BusinessReportsAppService |

### 4.2 spawn 策略（20c 维持）

- **默认主 worktree**（同 19r-20b 模式 / 串行化无 race 实测稳）
- **stash + pathspec 双重防御**：第 5 次连续场景标配（19s+19t+20a+20b+20c = 4 → 5 次）
- **教训 13 模板**：git mv → sed → **git add 新文件名** → diff cached → commit（20c V0.x 升版标配）

---

## 五、Codex 20c 评审准备（手动模式延续）

- 20c 收尾 D2-D3 cici 手动触发：`codex review --base 39e4b09`（20b 末 commit）
- 5-15 min Codex 跑 / main a 后台等通知（Bash run_in_background + nohup PID）
- 立修保 **30 Sprint 0 顺延 / 连续 7 Sprint 立修**
- hook 基础设施保留 / 维持手动模式（cici 19t A 决策延续）

---

## 六、V0.1 启动条件（cici 5 答拍板）

### 5 开放问题待 cici 答

1. **20c 主题确认**：
   - A. 业务方 demo 反馈吸收 + second e 续（推荐 / demo 反馈驱动 + 20b second 轨吸收）
   - B. 纯 second e 续 + main 顺延债（不等 demo / main 主轨小工作量）
   - C. demo 反馈优先 / second 暂停（仅 main / cici 协调 demo 紧密）
   - D. 等业务方 demo 反馈后启动（保守 / wall-clock 可能拉长 ≥ 2 day）

2. **业务方 demo 时段已协调**？
   - A. 已协调 / 今天 demo（T-A1 0.8 PD 准备吸收）
   - B. 已协调 / 明天 demo（T-A1 顺延 20d）
   - C. 协调中 / 不确定（T-A1 跳过 / 20c 主题切纯 second + 顺延债）

3. **NcAccountRule 字典扩范围**（依赖 demo 反馈）：
   - A. 跳过（demo 反馈未明确"借贷科目代码默认值不准"前不动 / 0 PD）
   - B. 预先二级扩（基于详设字典表 / 0.3 PD）

4. **race [P0] 20c 观察记录方式**（5 Sprint 窗口第 3 Sprint）：
   - A. 维持被动记录（推荐 / 20a + 20b 已 0 race / 第 3 Sprint 继续观察）
   - B. 加 1 个 isolation worktree 主动构造实验（加强证据链）
   - C. 直接降级 [P1]（不等 20e 窗口结束）

5. **20c 启动时间**：
   - A. 今天升 V0.2 启动 D1（连续工作 / 29 Sprint 0 顺延动量延续）
   - B. 明天启动（等 cici 协调业务方 demo）
   - C. 等业务方 demo 反馈到位后启动（保守）

### V0.2 启动条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（§四.1）
- second 主代理 e 同步任务卡（cici 切 session 给 e 续 prompt）

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-16 | main a 起草 · 5 开放问题待 cici 答 |
| V0.2 | 2026-05-16 | **cici 5 答全 A 拍板**（Q1A demo + second / **Q2A 业务方今天 demo** / Q3A NcAccountRule 跳过 / Q4A race 被动记录 / Q5A 今天启动 D1）· 启动 D1 |

---

## 八、V0.2 拍板启动 D1（cici 5 答全 A）

| Q | 答 | 影响 |
|---|---|---|
| Q1 | A | 主题确认：业务方 demo 反馈吸收 + second e 续 → main + second 双轨 |
| Q2 | A | **业务方今天 demo / T-A1 锁 0.8 PD 准备吸收**（不再"条件性"）|
| Q3 | A | NcAccountRule 字典扩跳过 / T-A2 0 PD（依赖 demo 反馈未明确）|
| Q4 | A | race [P0] 被动记录 / T-A4 0.1 PD（20a-20e 窗口第 3 Sprint）|
| Q5 | A | 今天启动 D1 / 29 Sprint 0 顺延动量延续 |

### 8.1 main D1 启动顺序（cici 切 second 同步进行）

1. **T-A4 race 观察记录**（0.1 PD / 首启 / 不依赖 demo）
2. **T-A3 voucher-management UX patch**（0.3 PD / 反馈预备 / 不依赖 demo）
3. **T-A1 业务方 demo 反馈吸收**（0.8 PD / **等 cici 今天 demo 收集反馈回填后启动**）
4. T-A5 D2-D3 Codex 评审
5. T-A6 V0.x 升版 + memory

### 8.2 cici 今天行动项（高紧迫性）

- [ ] 协调李建颖 + 汤云龙 demo 时段（推荐 30 min demo + 30 min 反馈）
- [ ] demo 前按 [`voucher-management-strict-e2e-runbook.md`](../../internal/voucher-management-strict-e2e-runbook.md) §二 启动环境
- [ ] demo 后按 [`voucher-demo-checklist-20b.md`](../../internal/voucher-demo-checklist-20b.md) §二 + §三 + §六 回填反馈
- [ ] 反馈回填 → main 主代理 a 启动 T-A1 patch
- [ ] 切 second session 给 e 续 prompt 启动 second e 平行轨

### 8.3 second e D1 启动顺序（cici 切 session 给 e 续 prompt）

1. T-E1 dashboard 8 aggregator 真接通 2 → 4+（0.6 PD）
2. T-E2 Reports 模板扩 8 → 10+（0.5 PD）
3. T-E3 30s 轮询稳定 + 切实例 spec（0.3 PD）
4. T-E4 NcInterface menu + voucher-management 协调（0.3 PD）
5. T-E5 收尾 + memory（0.3 PD）

### 8.4 启动条件全部满足

- ✅ 5 开放问题 cici 全 A 答
- ✅ 1c 模块隔离表确认（§四.1 / 与 20a-20b 同模式）
- ⏳ second 主代理 e 同步任务卡（cici 切 session 给 e 续 prompt 时同步）
- ⏳ 业务方 demo 反馈回填（cici 今天 demo 后）

---

**main 主代理 a 签名**：2026-05-16 V0.1 起草 · V0.2 cici 5 答全 A 拍板 → 立即启动 D1 / 业务方今天 demo（高紧迫）
