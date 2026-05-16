# Sprint 20b 任务卡 V0.4（Codex 立修完整闭环 · main 4 commits / 2 finding 全修 / 29 Sprint 0 顺延 / 连续 6 立修）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.4（Codex 立修完整闭环 · main 4 commits / commit 39e4b09 P2 spec BIZ 断言脆弱 + P2 runbook SQL 表名 / 29 Sprint 0 顺延达成 / 连续 6 Sprint 立修）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 20b 收尾锁版任务卡（V0.3 D1 完成 → V0.4 Codex 立修完整闭环 / 29 Sprint 0 顺延达成 / D1 wall-clock < 1 day）
**配套：** [`Sprint-20a-任务卡-V0.4.md`](./Sprint-20a-任务卡-V0.4.md) + 19r/19s/19t/20a 累计顺延债

---

## 〇、Sprint 20a 收尾接续（V0.4 锁版 / 28 Sprint 0 顺延达成）

### 〇.1 20a D1 完整闭环数据

| 维度 | 实际 | 备注 |
|---|---|---|
| main 主轨 commits | 8 | 7 D1 + 1 Codex 立修 `8c8bdb6` |
| second 平行轨 commits | 1 | e `ff8f9e5` mock-to-real |
| 跨仓 V0.4 锁版 commits | 2 | `ed20233` git mv + `53d2a5f` 内容补全 |
| Codex finding | 2（1 P1 + 1 P2）| 全立修 / dotnet test 4/4 全过 |
| 实施总 PD | ~5.25 | 在计划（5.3-6.2）|
| 28 Sprint 0 顺延 | ✅ | 连续 5 Sprint 立修（19q P1 + 19r 5 + 19s 5 + 19t 3 + 20a 2 = 16 finding 全修 / 2.25 PD 累计） |

### 〇.2 PO 协调状态（2026-05-16 见面后）

- 业务方对接人：财务 = **李建颖** / 物资 = **汤云龙**（[[project_po_meeting_2026_05_16_nc_voucher_export]]）
- 5 月反模式根因 #2#3#4 完全解除（19r D1 当天 9/9 反馈到位实证）
- NC 改"凭证导出主线"+ 接口预留双轨（凭证已 20a D1 完整闭环 / 接口侧维持 19i-19q 单边架构）
- **业务侧 demo 接受准备就绪** — 凭证导出主线（双号制 / 12 列模板 / 重生成 API / 8 业务单按钮 / mock-to-real）已 production-ready

### 〇.3 20a 完整顺延债清单（20b 准备吸收 / 见 §三）

- 19t T-B1 / 20a T-B3：voucher-management host 启动端到端 E2E 完整链路（host 启动 → 业务单生成凭证 → row + 下载 .xlsx + mark-downloaded）
- 19r T-A3 / 20a T-A3：NcAccountRule 字典二级 / 项目专属扩（条件性 / 业务方反馈触发）
- 20a T-B4 buffer 顺延（中段调整空间）

---

## 一、Sprint 20b 范围（业务方 demo 反馈接通 / 双 session / 总 ~5-6 PD / 工期 ~1 day）

### 1.1 main 主代理 a 主轨 — 业务侧 demo 配合 + 顺延债 patch（~2.0-2.5 PD）

| Task | PD | 描述 | 来源 |
|---|---|---|---|
| **T-A1** voucher-management host 端到端 E2E 实测 | 0.4 | host 启动 → admin 登录 → 业务单审核 → 凭证生成 → voucher-management 看到 row → 下载 .xlsx → mark-downloaded 全流程实测 / 截图留痕 / spec 加严 | 19t T-B1 + 20a T-B3 顺延 |
| **T-A2** NcAccountRule 字典扩（**Q2 A 跳过**）| **0** | cici Q2 A 决策：业务方反馈未明确"借贷科目代码默认值不准"前不动 / 顺延 20c+ 业务方反馈触发再启动 | 19r b 占位 / 19s T-A3 已字典化 / 20a T-A3 顺延 / **20b 跳过** |
| **T-A3** 业务方 demo 准备 + 验收 spec | 0.3 | 准备 demo 演练脚本（财务侧凭证导出 / 物资侧 NcVoucherNo 留痕）+ 1 页 demo checklist 给李建颖 / 汤云龙 + 反馈窗口 deadline | 20a 凭证导出主线 production-ready 后接续 |
| **T-A4** race [P0] 观察记录 + 防御链留痕 | 0.1 | 20a-20e 5 Sprint 观察窗口起算（20a 是第 1 Sprint）/ 20b race case 记录到 [[feedback_spawn_worktree_decision]] | 20a T-A4 cici Q3 B 决策延续 |
| **T-A5** Codex 20b 评审触发 + 立修 | 0.3 | `codex review --base 8c8bdb6` 评审 20b 全 commits / 等 PID 退出 / 立修保 **29 Sprint 0 顺延 / 连续 6 Sprint 立修** | 标准收尾 |
| **T-A6** Sprint 20b 收尾 + V0.x 升版 + memory | 0.4 | V0.1 → V0.4 各阶段锁版 + memory（业务方 demo 反馈接通经验 / 跨 Sprint 同模块第 4 次连续 / 29 Sprint 0 顺延）| 主代理 a 标准收尾 |

main 主代理 a 总：**~1.5 PD**（T-A2 跳过 / cici Q2 A）

### 1.2 main 子代理 b 副轨 — voucher-management 真业务接通完善（~0.8-1.2 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-B1** voucher-management spec 真业务接通加严（19t T-C4 + 20a T-C1 接续） | 0.3 | 19s c 5 场景 + 20a c 场景 10 listener / 20b 加业务实测后的 strict 断言（row count + 下载文件名 + mark-downloaded 状态翻转）|
| **T-B2** voucher-management 工具栏 UX patch（业务方反馈预备） | 0.3 | 按业务方 demo 后预期反馈：批量下载进度条 / 批量 mark-downloaded 进度 / 错误重试按钮 / 表格列宽自适应 |
| **T-B3** Buffer | 0.2-0.3 | 20b 中段调整空间 |

### 1.3 main 子代理 c 第三轨 — UX 持续 + brand tokens 扩（~0.5 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-C1** brand tokens 扩到剩余 page（反 AI slop 续）| 0.3 | 19t c / 20a c 已扩 voucher-management + dashboard-bigscreen / 20b 扩 contracts / monthly-prepayment / nc-interface 监控页 |
| **T-C2** Pre-Delivery Checklist 全 page 验证 + a11y 修复 | 0.2 | ui-ux-pro-max skill / 44px touch / aria-label / 4.5:1 contrast / 反馈 150-300ms |

### 1.4 second 主代理 e 平行轨 — Reports/Dashboards 真接通深化（~1.5-2.0 PD / 第 4 次连续）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** dashboard 8 aggregator 真接通进度 — 2 → 4+（19v+ 拆 4 个）| 0.6 | 20a 2 真接通（NcSuccessRate / WarnAlertKpi）/ 20b 续 2-3（库存价值 StockBatchBalance / 厂矿订单 PurchaseOrder / 单据流转 多源 COUNT）|
| **T-E2** Reports 模板扩到 10+ 业务（20a 8 → 20b 10+）| 0.5 | 20a 8（5 + 3 新增 / 资金计划 + 设备维修 + 供应商画像）/ 20b 续 2-3（如 + 月结对账 + 反结申请 + 暂估月报）|
| **T-E3** dashboard-bigscreen 30s 轮询稳定性 + 切实例数据校验 E2E | 0.3 | 19t T-E3 顺延 / 20b 加：mock-to-real 切换 spec / fallback case spec / IMemoryCache 5min TTL 验证 |
| **T-E4** NcInterface 监控页面 + voucher-management 菜单分组协调 | 0.3 | 19t T-E4 + 20a T-E4 顺延 / 20b 完成 menu group + breadcrumb 协调 |
| **T-E5** 收尾 + memory + race 检查 | 0.3 | 同步 main commit / race 检查（跨 session 第 4 次连续 / 1c 模块隔离）/ Codex 评审准备 |

second 主代理 e 总：**~2.0 PD**（与 19s+19t+20a 同节奏）

### 1.5 second 子代理 f（可选 ~0.6 PD / 仅业务方 demo 反馈到位且时间允许）

| Task | PD | 描述 |
|---|---|---|
| **T-F1** Reports 业务方 demo 实测演练 | 0.3 | 业务方 demo 后 / 把演练录屏 + checklist 沉淀到 docs/internal/ |
| **T-F2** dashboard 真接通 demo 验收 | 0.3 | NcSuccessRate 真数据 + WarnAlertKpi 真预警 demo 验收 |

---

## 二、cici 20b 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **协调业务方 demo 时间** | 中 | 李建颖 + 汤云龙凭证导出 demo 时间窗口（推荐 D1-D2 内）|
| **demo 后反馈收集** | 中 | 给业务方 1 页 demo checklist（main T-A3 起草）+ 反馈 deadline ≤ D2 EOD |
| **Codex 20b 评审触发** | 标准 | D2 收尾时手动 `codex review --base 8c8bdb6` |
| **V0.4 锁版前确认** | 标准 | Codex 立修后 V0.3 → V0.4 锁版 cici 确认无误 |

| 时机 | 行动 |
|---|---|
| **D1** | 升 V0.2 启动 D1 + cici 切 second session 给 e 续 prompt + 协调业务方 demo 时间 |
| **D2** | 业务方 demo 演练 + 反馈收集 + Codex 评审触发 + V0.3 锁版 |
| **D3** | Codex 立修 + V0.4 锁版 + 29 Sprint 0 顺延记录持续 |

---

## 三、累计技术债（19r-20a 顺延 + 20b 部分收口）

| 来源 | Task | PD | 20b 处置 |
|---|---|---|---|
| 19t T-B1 / 20a T-B3 | voucher-management host 端到端 E2E | 0.4 | **T-A1 收口** |
| 19r T-A3 / 19s T-A3 / 20a T-A3 | NcAccountRule 字典扩 | 0-0.4 | **T-A2 条件性收口**（业务方反馈触发）|
| 19t T-E3 | dashboard sparkline / 切换 spec | 0.3 | **T-E3 收口** |
| 19t T-E4 / 20a T-E4 | NcInterface 监控 + voucher-management menu 协调 | 0.3 | **T-E4 收口** |
| 20a 累计 buffer 顺延 | 中段调整空间 | - | **T-B3 buffer** |
| 跨 Sprint 业务方 NC 接通 G-1 ~ G-11 反馈 | 已 19r D1 9/9 到位 | - | 已闭环（剩 2 项观察 / 20b 不主动追）|

---

## 四、子代理 spawn + 跨 session race 防御（[[feedback_subagent_git_race_coordination]] 教训 12+）

### 4.1 1c 模块隔离表（main + second 锁定清单 / 19s D1 实测 + 20a 维持）

| session | 锁定模块 / 文件 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / SupplyCoresWebModule.cs / voucher-management/* |
| **second** | dashboard-bigscreen/* / reports/* / theme.css（brand tokens 由 main c 主导但 second 不锁）/ DashboardBigscreenAppService / BusinessReportsAppService |

### 4.2 spawn 策略

- **默认主 worktree**（同 19r/19s/19t/20a 模式 / 串行化无 race 实测稳）
- **isolation: "worktree"**：仅 race [P0] 观察记录场景（cici Q3 B 5 Sprint 窗口 / 20a-20e）
- **stash + pathspec 双重防御**：第 4 次连续场景标配（19s+19t+20a = 3 次 / 20b 第 4 次）

### 4.3 跨 session 协议

- main 完成阶段性 commit → push origin/main
- second e 启动前 `git fetch + git log origin/main..HEAD` 校 actual HEAD（19s prompt 偏差教训）
- second e 改动范围外文件 → `git stash --include-untracked --keep-index` 临时栈
- second e commit 前 `git diff --cached --stat` 验证 staged 范围（[[feedback_git_commit_diff_cached_must_verify]]）

---

## 五、Codex 20b 评审准备（手动模式 / cici 19t A 决策延续）

- 20b 收尾 D2-D3 cici 手动触发：`codex review --base 8c8bdb6`（20a 末 commit）评审 20b 全 commits
- 5-15 min Codex 跑 / main a 后台等通知（Bash run_in_background + nohup）
- 完成立修保 **29 Sprint 0 顺延 / 连续 6 Sprint 立修**
- hook 基础设施保留（`.github/workflows/codex-review.yml`）/ 维持手动模式（cici T-A4 A 决策）

---

## 六、V0.1 启动条件（cici 5 答拍板）

### 5 开放问题待 cici 答

1. **20b 主题确认**：
   - A. 业务方 demo 反馈接通（推荐 / PO 解锁窗口期 / 业务侧反馈驱动 20c+ 优先级）
   - B. 内部技术债深化（顺延债总收口 / 不依赖业务方）
   - C. 混合（main A + second 续 B）

2. **NcAccountRule 字典扩范围**：
   - A. 跳过（业务方反馈未明确"借贷科目代码默认值不准"前不动 / 0 PD）
   - B. 预先二级扩（基于详设 §X 借贷科目表 / 0.3 PD）
   - C. 项目专属字典扩（覆盖 8 业务单按钮各自借贷规则 / 0.4 PD）

3. **second e 续 Reports/Dashboards 范围**：
   - A. dashboard 4+ aggregator + Reports 10+ 模板（推荐 / 与 20a 同节奏 / 2.0 PD）
   - B. 切其他模块（不续 second 同模块连续记录）
   - C. 暂停 second（仅 main 工作 / second 等业务方反馈）

4. **race [P0] 20b 观察记录方式**：
   - A. 被动记录（仅记录 20b 实际 race case / 不主动构造 / 推荐）
   - B. 主动构造 1-2 个 isolation worktree race 实验（cici Q3 B 5 Sprint 窗口加强证据）
   - C. 直接降级 [P1]（不等 5 Sprint 窗口 / 推翻 Q3 B 决策）

5. **20b 启动时间**：
   - A. 今天升 V0.2 启动 D1（连续工作 / 28 Sprint 0 顺延动量延续）
   - B. 明天启动（等业务方 demo 时间确定）
   - C. 等业务方 demo 反馈到位后启动（保守 / 但可能 wall-clock 拉长 ≥ 2 day）

### V0.2 启动条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（§四.1）
- second 主代理 e 同步任务卡（cici 切 session 给 e）

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-16 | main a 起草 · 5 开放问题待 cici 答 |
| V0.2 | 2026-05-16 | **cici 5 答全 A 拍板**（Q1A 业务方 demo 主题 / Q2A NcAccountRule 跳过 / Q3A second e 续 Reports/Dashboards / Q4A race 被动记录 / Q5A 今天启动 D1）· 启动 D1 |
| V0.3 | 2026-05-16 | **main D1 完成锁版** · main 3 commits（T-A1 ea7e631 voucher-management strict E2E + 双号制 frontend 完整化 + T-A3 9fd5a71 demo checklist + T-A4 race 0 实际 5 Sprint 窗口第 2）/ second e 待续 / 待 Codex 评审 |
| V0.4 | 2026-05-16 | **Codex 评审 2 P2 finding 立修完整闭环**（commit 39e4b09 / P2 spec BIZ-* 断言脆弱 改 dataRow.filter + P2 runbook SQL 表名单数 + ABP 必填列 4 项）· **29 Sprint 0 顺延达成 / 连续 6 Sprint 立修**（19q P1 / 19r 5 / 19s 5 / 19t 3 / 20a 2 / 20b 2 = 18 finding 全立修 / 2.4 PD 累计） |

---

## 八、V0.2 拍板启动 D1（cici 5 答全 A）

| Q | 答 | 影响 |
|---|---|---|
| Q1 | A | 主题确认：业务方 demo 反馈接通 → main T-A 主轨锁定 |
| Q2 | A | NcAccountRule 字典扩跳过 → T-A2 0 PD / 顺延 20c+ 业务方反馈触发 |
| Q3 | A | second e 续 Reports/Dashboards → 第 4 次连续（19s+19t+20a+20b）|
| Q4 | A | race [P0] 被动记录 → T-A4 0.1 PD 维持观察窗口（20a-20e）|
| Q5 | A | 今天启动 D1 → 连续工作动量延续 / 28 Sprint 0 顺延动量 |

### 8.1 main D1 启动顺序

1. T-A1 voucher-management host 端到端 E2E（0.4 PD / 首 task / 顺延债总收口）
2. T-A3 业务方 demo 准备 + 验收 spec（0.3 PD / 与 cici 协调 demo 时间并行）
3. T-A4 race [P0] 观察记录 + 防御链留痕（0.1 PD / 20a-20e 窗口第 2 个 Sprint）
4. T-A5 + T-A6 D2-D3 收尾

### 8.2 second e D1 启动顺序（cici 切 session 给 e 续 prompt）

1. T-E1 dashboard 8 aggregator 真接通 2 → 4+（0.6 PD）
2. T-E2 Reports 模板扩 8 → 10+（0.5 PD）
3. T-E3 30s 轮询稳定 + 切实例 spec（0.3 PD）
4. T-E4 NcInterface menu + voucher-management 协调（0.3 PD）
5. T-E5 收尾 + memory（0.3 PD）

### 8.3 启动条件全部满足

- ✅ 5 开放问题 cici 全 A 答
- ✅ 1c 模块隔离表确认（§四.1 / 与 19s+19t+20a 同模式）
- ⏳ second 主代理 e 同步任务卡（cici 切 session 给 e 续 prompt 时同步）

---

## 九、main D1 实测数据（V0.3 锁版）

### 9.1 main 主代理 a D1 完成清单

| Task | 计划 PD | 实际 PD | commit | 状态 |
|---|---|---|---|---|
| T-A1 voucher-management strict E2E | 0.4 | ~0.4 | `ea7e631` | ✅ 完成（runbook + frontend SC- column + spec 加严 / 顺便发现双号制 frontend 完整化 bug） |
| T-A2 NcAccountRule 字典扩 | 0 | 0 | - | ✅ Q2 A 跳过 |
| T-A3 业务方 demo 准备 | 0.3 | ~0.25 | `9fd5a71` | ✅ 完成（财务 F-1~F-8 + 物资 M-1~M-6 + 30 min 演练脚本 + G-1~G-13 待验收）|
| T-A4 race [P0] 观察记录 | 0.1 | ~0.05 | memory | ✅ 完成（5 Sprint 窗口第 2 / 0 race / 被动记录）|
| T-A5 Codex 20b 评审 + 立修 | 0.3 | ~0.15 | `39e4b09` | ✅ 完成（2 P2 全修 / spec BIZ 断言改 dataRow.filter + runbook SQL 表名修正）|
| T-A6 V0.x 升版 + memory | 0.4 | ~0.3 | V0.4 锁版 commit | ✅ 完成（V0.3 → V0.4 跨仓 + memory 升级 28 → 29 Sprint / 连续 5 → 6 立修）|

main 总实际：**~1.3 PD**（计划 1.5 / 早完 0.2 PD / T-A2 跳过 + T-A5 P2 简单 + T-A6 流程熟练）

### 9.4 D2 Codex 立修详情（V0.4 留痕）

**Codex 20b 评审 finding 清单**（`codex review --base 8c8bdb6` / 后台 PID 44748 / ~10 min）：

| finding | 优先级 | 文件 | 立修策略 |
|---|---|---|---|
| BIZ-* 断言脆弱 | P2 | `voucher-management.spec.ts:685-688` | firstRow → dataRow.filter({ hasText: /BIZ-/ }) / 至少 1 BIZ row + 该 row 含 SC- |
| runbook SQL 表名 + 必填列 | P2 | `voucher-management-strict-e2e-runbook.md:67-71` | `interface_receipts` → `interface_receipt`（单数）/ 加 ABP 必填列（extra_properties / concurrency_stamp / creation_time / is_deleted）|

立修结果：
- 2 文件 / 27 insertions / 10 deletions
- TypeScript check 静默通过
- 立修工作量 ~0.15 PD（finding 简单 / line-level 改）
- 跨仓 race 0 误纳（main D1 commits + push 完成后 / second 待启动）

### 9.5 连续 6 Sprint 立修保 0 顺延记录（V0.4 沉淀）

| Sprint | finding | commit | 工作量 |
|---|---|---|---|
| 19q | 1 P1（DbMigrator SeedTestUsers）| `1101c34` | 0.05 PD |
| 19r | 5（2 P1 + 3 P2）| `c8785e6` | 0.65 PD |
| 19s | 5（2 P1 + 3 P2）| `606d794` | 0.8 PD |
| 19t | 3（1 P1 + 2 P2）| `b486dda` | 0.6 PD |
| 20a | 2（1 P1 + 1 P2）| `8c8bdb6` | 0.15 PD |
| **20b** | **2 P2** | **`39e4b09`** | **0.15 PD** |
| **累计** | **18 finding** | **6 commit** | **2.4 PD** |

**Sprint 29 0 顺延记录持续保持 ✅** — 12a-20b 共 29 Sprint / 18 完整 + 3 强绑定闭环 + 19i/19j 自闭环 + 连续 6 立修

### 9.2 T-A1 顺便发现 + 立修（V0.3 留痕）

**Bug**：20a backend 双号制完整（NcVoucherNo SC- + NcVoucherNumber NC）/ frontend DataGrid 仅暴露 NC 真号 column / **漏 SC- 业务号 column**

**影响**：业务方 demo 准备阶段必修（否则财务侧验收看不到自动生成的 SC- 凭证号 / 双号制不完整）

**修法**（commit `ea7e631`）：
- App.tsx L620 前加 `<Column dataField="ncVoucherNo" caption="SC 业务号" width={160} />`
- spec 场景 12 加严：firstRowText 必含 `SC-\d{4}-\d{2}-\d{6}` + `BIZ-[A-Z0-9-]+`

**意义**：T-A1 "实测"路径在 spec 加严设计阶段就发现了 frontend bug — 印证 [[feedback_carryover_task_verify_first.md]] 顺延 task 启动前先验证现状原则

### 9.3 second e 状态（待 cici 切 session）

- 锁定模块：dashboard-bigscreen / reports / theme.css（与 main 1c 模块隔离表完全错开）
- 计划任务：T-E1（8 aggregator 2→4+）+ T-E2（Reports 8→10+）+ T-E3（30s 轮询稳定）+ T-E4（menu 协调）+ T-E5（收尾）/ 总 ~2.0 PD
- 第 4 次连续 Reports/Dashboards 同模块（19s + 19t + 20a + 20b）

---

**main 主代理 a 签名**：2026-05-16 V0.1 起草 · V0.2 cici 5 答全 A 拍板 → V0.3 D1 完成锁版（main 3 commits / ~0.85 PD）→ V0.4 Codex 立修完整闭环（main 4 commits / 总 ~1.3 PD / 29 Sprint 0 顺延 / 连续 6 立修达成）
