# Sprint 19r 任务卡 V0.4（D1 + D2 完整闭环锁版 · race [P0] 3/3 实测达标）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.4（收尾锁版 · 主代理 a 2026-05-16 — D1 + D2 全闭环 9 commits push / cici 9 反馈到位 / D2 race [P0] 3/3 实测达标 / 5 memory 留痕）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 19r 收尾锁版任务卡（V0.4 锁版 → 待 cici 触发 Codex 评审）
**配套：** [`Sprint-19q-任务卡-V0.4.md`](./Sprint-19q-任务卡-V0.4.md) + [`19r-业务方反馈清单-V0.3.md`](./19r-业务方反馈清单-V0.3.md) + [`Sprint-19r-NC接口重新分级-V0.1.md`](../详细设计/Sprint-19r-NC接口重新分级-V0.1.md)

## 版本沿革

| 版本 | 日期 | 操作 | 描述 |
|---|---|---|---|
| V0.1 | 2026-05-16 | 起草 | PO 会议两条决策 + 5 开放问题待 cici 拍板 |
| V0.2 | 2026-05-16 | 定版启动 | cici 5 决策拍板 → D1 启动 |
| V0.3 | 2026-05-16 | 定版启动 D2 | D1 完整闭环 + cici 9 反馈到位 → D2-3 patch 启动 |
| V0.4 | 2026-05-16 | 收尾锁版 | D1 + D2 全闭环 9 commits / D2 race [P0] 3/3 实测 / 5 memory 留痕 / 待 cici Codex |

---

## 〇、Sprint 19r 起源（PO 会议两条决策 / V0.2 维持）

详 V0.2 §〇。简：1) NC 暂不上线 → 凭证导出主线；2) 对接人明确：财务=李建颖 / 物资=汤云龙

---

## 一、Sprint 19r 实际交付（D1 + D2 完整闭环）

### 1.1 主代理 a 主轨（D1 + D2 / 累计 ~3.0 PD ✅）

| Day | Task | PD | commit | 状态 |
|---|---|---|---|---|
| D1 | T-A3 业务方反馈清单 V0.1 | 0.4 | `90c3f09` | ✅ |
| D1 | T-A1 23 接口重新分级 V0.1 | 0.6 | `3db63e4` | ✅ |
| D1 | T-A2 F-03 4 字段 + Wave 93 | 0.5 | `9e1f1ae` | ✅ |
| D1 | T-A4 19q 3 E2E failed 修复 | 0.3 | `e84d805` | ✅ |
| D2 | T-A6 + T-A7 F-03 + 9 业务实体加 NcVoucherNumber + Wave 94+95（双号制最小变更）| 0.7 | `c2b8bde` | ✅ |
| D2 | T-A9 双号制跨实体一致性测试（11/11）+ ⚠️ race [P0] 3/3 实测 | 0.1 | `76537be`（实含 12 文件）| ✅ + race |
| D2 | StockTransfer InterfaceCode BIZ-MV → BIZ-007 修 c 占位 | 0.05 | `5a28d03` | ✅ |
| ~~D2 T-A8~~ | ~~状态机 Failed → Regenerated~~ | ~~0.2~~ | — | **顺延 19s**（b T-B4 实质实施 / 占位 OK / 需 InterfaceReceipt.SourceEntityId 字段 Wave 96） |
| D3 | T-A5 收尾 V0.3 → V0.4 + memory 5 条 + 反馈清单 V0.3 | 0.2 | （本 commit）| 🔄 |

**主代理 a 总 PD**：D1 1.8 + D2 0.85 + D3 0.2 = **~2.85 PD**（V0.3 §一 1.5 预算 1.2 PD D2-3 / 实际 1.05 PD ✓ / T-A8 顺延节省）

### 1.2 子代理 b 副轨（D1 + D2 / 累计 ~3.1 PD ✅）

| Day | commit | 范围 | 测试 |
|---|---|---|---|
| D1 | `4aa3426` | T-B1 凭证生成器框架 + T-B2 ClosedXML 5 demo | 41/41 通过 |
| D2 | `5619f45` | T-B3 ApprovalCompletedEvent 订阅 / T-B4 重生成 API + 状态机 / T-B5 12 列模板 / T-B6 批量 export / T-B7 单测 17 文件 +1124 / -28 | **862/862 通过**（既有 ApprovalAppService 11 测试 0 破坏） |

**b 子代理 D2 关键设计决策**：
- IApprovalCompletedNotifier 抽象（解耦 ApprovalAppService 与 ILocalEventBus / 0 破坏 mock 测试）
- 5-arg ApprovalAppService ctor 兼容（5th 参数 notifier 可选默认 null）
- 仓内首次接通 ABP EventBus（0 命中现有订阅 → b 自建模式）

**b 子代理 3 占位说明**（顺延 19s 业务方反馈到位 / 主代理 a 后补强）：
- ApprovalCompletedEvent.SourceEntityId 暂 Guid.Empty + BusinessIdToGuidPlaceholder 编码（T-A7 接通真业务 Guid 后弃）
- NcVoucherRegenerator.FindLatestFailedReceiptAsync 用 NcResponseMessage Contains 占位匹配（19s InterfaceReceipt 加 SourceEntityId Wave 96 后 strict 查询）
- DebitAccountName / CreditAccountName fallback = 代码同值（NcAccountRule 字典 19s）

### 1.3 子代理 c 第三轨（D1 + D2 / 累计 ~2.3 PD ✅）

| Day | commit | 范围 | 测试 |
|---|---|---|---|
| D1 | `32ef7eb` | T-C2 OIDC 验证（19o b 已修 / 节省 0.3 PD）+ T-C3' 5 接口契约测试 | 25/25 + curl 200 实测 |
| D2 | `76537be`（race 误纳 / **实际归属主代理 a commit**） | T-C4 8 业务单 RegenerateVoucherButton + T-C5 voucher-management 批量下载 UI 11 文件 +660 -2 | tsc 0 错 + eslint 0 警告 |

**c 子代理 D2 关键设计决策**：
- DevExtreme 选型：Button + Popup + TextArea + notify（T-C4）/ DataGrid Selection multiple + showCheckBoxesMode always + FilterRow + Pager（T-C5）
- 与 b 接口约定（前端 hardcode 4 endpoint）：regenerate / interface-receipts / batch-download / mark-downloaded
- StockTransfer 占位 BIZ-MV [⚠️ 待 cici 确认] → 主代理 a 修为 BIZ-007 CrossOrgTransfer（commit `5a28d03`）

### 1.4 D1 + D2 总结

| 项 | D1 | D2 | 总 |
|---|---|---|---|
| 总 PD | 5.0 | ~3.3 | **~8.3 PD** |
| commits | 6（SupplyCores 4 + SupplyCore docs 2）| 5（SupplyCores 4 + SupplyCore docs 1）| **11**（SupplyCores 8 + SupplyCore docs 3）|
| wall-clock | ~1.6 day | ~1.0 day | **~2.6 day** |
| sweet spot | 3.1x | ~3.3x | **~3.2x 平均**（[[feedback_sweet_spot_4_sprint_validation]] 范围）|
| race | 0 | **1 [P0] 实测发生**（[[feedback_git_commit_diff_cached_must_verify]]）| 1/11 commits |
| 测试 | 43+25=68 | 862+11=873 全过 | **873/873 全过** |

---

## 二、cici 19r 外部行动项（D1 全完成 ✅）

### 2.1 D1 cici 见面 9/9 反馈到位（5 月反模式根因 #2#3#4 完全解除实证）

详 [`19r-业务方反馈清单-V0.3.md`](./19r-业务方反馈清单-V0.3.md)：

| 反馈 Q | 答 | D2 patch commit |
|---|---|---|
| Q1.1 凭证格式 | A Excel | `4aa3426`（T-B2 ClosedXML 已对齐）|
| Q1.2 必填 12 字段 | 10 必（cici 补贷方科目名称）| `5619f45`（T-B5 模板 12 列）|
| Q1.3 频次 | A 实时 | `5619f45`（T-B3 ApprovalCompletedEvent）|
| Q1.4 凭证号 | C 双号制 | `c2b8bde`（T-A6 F-03 + Wave 94）|
| Q1.5 失败处理 | B 重生成 | `5619f45`（T-B4 重生成 API + 状态机）|
| Q2.1 命名 | D 双字段拆分 | `c2b8bde`（T-A7 9 实体 + Wave 95）|
| Q2.2 触发 | C 终审 | `5619f45`（T-B3 ApprovalCompletedEvent / 19q Approval Center）|
| Q2.3 批量 | D 单条 + 财务侧勾选 | `5619f45`+`76537be`（T-B6 批量 export + T-C5 凭证管理 UI）|
| Q2.4 重推 | B 物资侧人工触发 | `5619f45`+`76537be`（T-B4 API + T-C4 8 业务单按钮）|

**5 月反模式完全解除**：5 月 0 反馈 → 1 day 9 反馈 → 同日 D2 patch 全闭环（9/9 反馈 100% 落地）

### 2.2 D2 cici 后续行动项

- ⏸ **触发 Codex 评审**（按 §五）— V0.4 锁版后立即触发
- ⏸ 反馈样例凭证给李建颖验收（D2-3 patch 完成后）
- ⏸ 给汤云龙演示"重生成凭证"按钮（T-C4 demo）

---

## 三、累计技术债（V0.4 收尾）

| 技术债 | 19r 处置 |
|---|---|
| #E2E-2 3 failed | T-A4 D1 修复 ✅ |
| #OIDC | T-C2 D1 验证（19o b 已修 / 自然恢复）✅ |
| #RACE-ISOLATION | 顺延 19s/19t（Q4 决策 B / 19q + 19r D2 实测 [P0] 3/3 已达标 → **升级 [P1] isolation 优先级**）|
| #BIZ-RESOLVED | 9/9 反馈到位 ✅ + D2 patch 全闭环 ✅ |
| #DBLNUMBER 双号制 | T-A6 + T-A7 ✅ |
| #REGEN 重生成 | T-B4 实质 + T-A8 顺延 19s（需 InterfaceReceipt.SourceEntityId Wave 96）|
| **新 #RACE-COMMIT-VERIFY** git commit 前必 git diff --cached | [[feedback_git_commit_diff_cached_must_verify]] 留痕 + 续 Sprint 必修 |
| **新 #VOUCHER-FALLBACK** 3 占位（SourceEntityId Wave 96 / NcResponseMessage strict / NcAccountRule 字典） | 顺延 19s（业务方反馈到位时一并）|
| #CI CI/CD secrets | 顺延 19s |

---

## 四、子代理 spawn 决策（V0.4 race [P0] 教训沉淀）

### 4.1 19r D2 race [P0] 3/3 实测达标

[P0] 证据链评估：
- 19o file-level 同改 / line-level 错开 — 1 次（实测）
- 19q file-level c add 期间防误纳 b working tree 残留 — 1 次（防御成功）
- **19r D2 主代理 a commit 抢 stage 子代理 c 已 stage 文件 — 1 次**（防御失败 / 实测发生）
- **当前证据链 3/3 → [P0] 升级 [P1] 防御链优先级**

### 4.2 19r+ spawn 决策更新（V0.3 §四基础上加强）

| 场景 | spawn 模式 | 理由 |
|---|---|---|
| 子代理改纯 frontend / 与主代理不同目录 | 主 worktree（默认）| 19r D1 实测 0 race |
| 子代理改 backend Application/Vouchers/ + 主代理改 Domain/Interfaces/ + 8 实体 | 主 worktree + **commit 时 git diff --cached + pathspec** | 19r D2 教训 7 |
| 子代理改同源文件 / line-level 真并发实测 | **isolation: "worktree"** | [[feedback_spawn_worktree_decision]] 真隔离 |
| 主代理 a + 子代理同期 commit 高频 | **isolation: "worktree"** + 同步 push | 防 commit 抢 staged |

### 4.3 race 防御红线（V0.4 强化）

按 [[feedback_git_commit_diff_cached_must_verify]] + 19r D2 教训 7：

1. **`git commit` 前必 `git diff --cached --stat` 验证 staged 范围** — 实际清单 vs 预期一致
2. **`git commit -m "MSG" -- pathspec` 限定 commit 范围** — 避免 commit 所有 staged
3. **`git status --short` 不能替代 git diff --cached** — status 显示全 working tree（含子代理 staged）
4. **spawn 子代理 + 主代理同期 commit 高 race 风险** — 用 `isolation: "worktree"` 真隔离
5. **19q 教训 6（精确 add 防对方 working tree 残留）+ 19r 教训 7（pathspec 限定 commit）** = 完整防御链

---

## 五、Codex 19r Finding 附录（待 cici 触发 ⏰）

按 [[feedback_auto_remind_codex_review]] + [[feedback_codex_0_carryover_8_sprint_record]] — V0.4 锁版后必须触发 Codex 评审保 0 顺延（25 Sprint 连续记录）。

提示词预备（cici 触发时复制即可）：

```bash
codex review --base origin/main 重点：
1. F-03 InterfaceReceipt 5 字段（4 D1 T-A2 + 1 D2 T-A6 NcVoucherNumber）升级 + 9 业务实体加 NcVoucherNumber 双号制 / Wave 93+94+95 是否破坏现有 contributor / data migration 风险
2. NcVoucherGeneratorBase + NcVoucherRegenerator + Failed→Regenerated 状态机 + IApprovalCompletedNotifier 抽象设计是否过度
3. ClosedXML 凭证模板 12 列（含贷方科目名称 + 借贷平衡）+ 批量 export 是否财务标准合规
4. 23 接口重新分级（5 核心 / 20 推迟）是否覆盖所有 17a-19q 已建 25 contributor + 二分边界合理性
5. NcVoucherEventBusSubscriber 订阅 ApprovalCompletedEvent + ApprovalAppService 5-arg ctor 兼容性 + 19q Approval Center 体系完整性
6. T-B6 批量合并 export 实现（多张凭证 → 1 Excel）+ 凭证管理 UI 勾选下载（DevExtreme Selection multiple）端到端流程
7. **19r D2 race [P0] 实测**（commit 76537be 主代理误纳子代理 11 文件）— git commit 流程是否需要 hook 强制 git diff --cached 验证
8. 8 业务单页面 RegenerateVoucherButton 集成 + StockTransfer BIZ-007 修正（5a28d03）+ T-C5 voucher-management UI 完整性
```

预算：Codex P1+ 当 Sprint 立修保持 [[feedback_codex_0_carryover_8_sprint_record]] 25 Sprint 0 顺延 / 19q 首次 P1 立修成功 → 19r 续

---

## 六、V0.4 锁版（Sprint 19r 收尾）

### V0.4 收尾条件 ✅

- ✅ D1 完整闭环（6 commit / 5.0 PD / 三轨并行 3.1x）
- ✅ D2 完整闭环（5 commit / 3.3 PD / 三轨并行 3.3x / cici 9/9 反馈全 patch）
- ✅ memory 5 条留痕（[[feedback_git_commit_diff_cached_must_verify]] / [[feedback_carryover_task_verify_first]] / [[feedback_dont_ask_mode_write_fallback]] + update [[feedback_business_party_coordination_failure]] / [[feedback_codex_0_carryover_8_sprint_record]]）
- ✅ race [P0] 3/3 实测达标 + 防御链强化 + memory 留痕
- ✅ 5 月反模式根因 #2#3#4 完全解除实证（1 day 9 反馈 / D2 全 patch）

### Sprint 19r 总（D1+D2 vs 原预算）

| 项 | 原预算（V0.2 / V0.3）| 实际 | 差异 |
|---|---|---|---|
| PD | 5.2 D1 + 3.4 D2-3 = 8.6 | 5.0 + 3.3 = **8.3** | -0.3 PD（节省）|
| wall-clock | ~2.5 + 1.5 = 4 day | ~1.6 + 1.0 = **2.6 day** | -1.4 day（35% 节省）|
| sweet spot | 2.7x | **3.2x 平均** | +0.5x |
| commit | ~10-12 | **11** | 在范围 |
| race [P0] | 顺延 19s+ | **D2 3/3 实测达标** | 大幅前移 |
| 业务方反馈 | D5 ≥1 / D7 ≥2 | **D1 9/9** | 9 倍 |
| memory | 5 条 | 5 条 | ✓ |

### 续 Sprint 19s 预备

- T-A8 + #VOUCHER-FALLBACK 3 占位（InterfaceReceipt.SourceEntityId Wave 96 + NcResponseMessage strict + NcAccountRule 字典）
- isolation worktree 实测（[[feedback_spawn_worktree_decision]] 真并发）
- CI/CD secrets + Codex hook 实测
- 凭证文件存储路径决策（wwwroot/vouchers/ vs S3 / Azure Blob）+ 财务下载端点

---

**主代理 a 签名**：2026-05-16 V0.4 锁版 · D1+D2 完整闭环 · 待 cici 触发 Codex 评审
