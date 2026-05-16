# Sprint 20a 任务卡 V0.1（Sprint 19 系列收尾 + 20 新主线 · 顺延债总收口 · 起草版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（起草 · main 主代理 a 2026-05-16 — Sprint 19 系列正式收尾 + 20a 起新主线"顺延债总收口"）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 20a 起草版任务卡（待 cici 5 开放问题 + 升 V0.2 启动）
**配套：** [`Sprint-19t-任务卡-V0.3.md`](./Sprint-19t-任务卡-V0.3.md) + 19r/19s/19t 顺延债清单

---

## 〇、Sprint 编号切换（19 系列收尾 / 20 起新主线）

### 〇.1 Sprint 19 系列收尾总结（19a → 19t / 20 micro-sprint / 2026-04 — 2026-05-16）

| 阶段 | Sprint | 主题 |
|---|---|---|
| 1. NC 接入框架 | 19a-19i（9）| Mock client / Polly / OAuth2 / 23 contributor |
| 2. NC 撤架 | 19j（1）| PO 协调 A2' 撤架决策 + 5 月反模式反思 |
| 3. 维护 + 评审 ROI | 19k-19p（6）| 大屏 / E2E / DevExtreme / 同事评审 / 18a A 级延续 |
| 4. PO 决策转折 | 19q（1）| NC 暂不上线 / 凭证导出主线 / 反模式根因 #2#3#4 解除 |
| 5. 凭证导出实施 | 19r-19t（3）| 双号制 / 双 session 升级 / race [P0] 闭环 / 7.1x sweet spot 实测 |

**Sprint 19 系列总数据**：
- 20 micro-sprint / 跨 1 个多月（2026-04 - 2026-05-16）
- 累计 commits 跨多 wave / 多业务方反馈节点
- **Sprint 27 累计 0 顺延记录持续保持**（连续 4 Sprint 立修：19q + 19r + 19s + 19t）
- 双 session sweet spot 实测 7.1x（V0.2 推测 6-7x 已验证）

### 〇.2 Sprint 20 编号切换（cici 决策 C）

- **19t 即 19 系列收尾**（跳过 19u）/ 主题"NC 接入 + 凭证导出"完整闭环
- **Sprint 20a 起新主线 "顺延债总收口"**（cici 决策 A）
- 编号保留字母后缀（20a / 20b / ...）维持 micro-sprint < 1 day wall-clock 节奏（双 session 7.1x sweet spot）
- 详 [[feedback_team_naming_convention]] Sprint 命名约定演化

---

## 一、Sprint 20a 范围（顺延债总收口 / 双 session / 总 ~5-6 PD / 工期 ~1 day）

### 1.1 main 主代理 a 主轨 — 5 项顺延债 patch（~2.0-2.5 PD）

| Task | PD | 描述 | 顺延来源 |
|---|---|---|---|
| **T-A1** 接口签名 long 重构（INcVoucherGenerator / INcVoucherDispatcher）| 0.5-0.8 | 19r b BusinessIdToGuidPlaceholder 占位 → strict long sourceEntityId / 5 stub generator + dispatcher + subscriber + 5 contract test + regenerator test 同步适配 | 19r b 占位 / 19t T-A3 doc 评估 |
| **T-A2** NcVoucherFileOrchestrator 调用方接通 | 0.3 | 19t T-A2 加 Orchestrator 但调用方未接通 / 20a NcVoucherEventBusSubscriber 替换 dispatcher.DispatchAsync → orchestrator.GenerateWithFileAsync / NcVoucherRegenerator 重生成接通 orchestrator | 19t T-A2 顺延 |
| **T-A3** NcAccountRule 字典扩（条件性 / 业务方 19u+ 第 2 次反馈触发）| 0-0.3 | cici 19t Q2 A 答字典够用 / 但 20a 评估扩二级 / 项目专属（如业务方 D2 见面反馈）| 19r b fallback 占位（已 19s T-A3 字典化 / 扩字典是条件性）|
| **T-A4** race [P0] → [P1] 防御链正式降级 | 0.2 | 19t T-A6 [P0] 证据链 4 次闭环达成 / 20a 正式降级 [P1] / 维护 isolation worktree decision + memory 更新 | 19t T-A6 评估 |
| **T-A5** isolation worktree cleanup + memory 沉淀 | 0.1 | 19t T-A6 worktree locked 残留（`.claude/worktrees/agent-acb8a6ee48b8557cc`）/ git worktree remove -f + branch -D / memory 留痕 isolation 模式实测完整经验 | 19t T-A6 顺延 cleanup |
| **T-A6** Sprint 20a 收尾 + V0.x 升版 + memory | 0.4 | V0.1 → V0.4 各阶段锁版 + memory（Sprint 19 系列收尾沉淀 / 20a 顺延债 patch 经验 / 28 Sprint 0 顺延）| 主代理 a 标准收尾 |

main 主代理 a 总：**~1.5-2.1 PD**（T-A3 条件性 / 业务方反馈触发）

### 1.2 main 子代理 b 副轨 — T-A1+T-A2 配套测试（~1.0-1.3 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-B1** T-A1 接口签名 long 重构配套测试 | 0.4 | 5 stub generator 测试 + dispatcher 测试 + subscriber 测试 + 5 contract test + regenerator test 同步适配 long 接口 / 200+ 测试维持 |
| **T-B2** T-A2 Orchestrator 接通 E2E | 0.3 | 端到端：业务单审核完成 → ApprovalCompletedEvent → subscriber → orchestrator → dispatcher → generator → exporter → storage → InterfaceReceipt 完整链路验证 |
| **T-B3** voucher-management 真业务接通完善（19t T-B1 顺延 19u）| 0.3 | host 启动 → 业务单生成凭证 → voucher-management 看到 row + 下载 .xlsx + mark-downloaded 全流程 E2E |
| **T-B4** Buffer | 0.2 | 20a 中段调整 |

### 1.3 main 子代理 c 第三轨 — UX 持续 + E2E 完善（~0.6 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-C1** voucher-management E2E 真业务接通 spec | 0.3 | 19s c voucher-management.spec 5 场景 / 20a 加真业务接通 spec + 切 strict 模式（19t T-C4 顺延） |
| **T-C2** 反 AI slop UX patch 持续 | 0.3 | brand tokens 扩到更多 page / 修 19t c 留 STATUS_COLOR string-key bug 反思 / 触控 / aria 完善 |

### 1.4 second 主代理 e 平行轨 — Reports/Dashboards 续 + 真业务接通（~2.0 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** Reports 模板扩到 8+ 业务 | 0.5 | 19t T-E3 加 5 报表 / 20a 扩 8+（如 + 资金计划 / 设备维修 / 供应商画像）|
| **T-E2** dashboard mock-to-real 真业务接通 | 0.6 | 19t T-E2 mock-to-real 协议已就绪 / 20a 实施 8 aggregator 真查询（库存 / 厂矿 / KPI / 单据 / 事件 / 敏感 / NC 率 / 订单）|
| **T-E3** dashboard-bigscreen.spec E2E 真业务接通 | 0.3 | 19t T-E3 顺延 sparkline / 大屏切换 / 20a 真业务接通后 E2E 加严 |
| **T-E4** NcInterface 监控页面持续优化 | 0.3 | 19t T-E4 顺延 / 20a 与 voucher-management 菜单分组协调 + 真业务监控 endpoint |
| **T-E5** 收尾 + memory | 0.3 | 同步 main commit / race 检查 / Codex 评审准备 |

### 1.5 second 子代理 f（可选 ~0.7 PD）

按 second e 评估 D2 是否 spawn：
- **T-F1** dashboard 数据缓存优化（IMemoryCache + Redis 评估 / 19t T-F1 顺延）

### 1.6 五轨工期估算

| 轨 | PD | session |
|---|---|---|
| main 主代理 a | 1.5-2.1 | main |
| main 子代理 b | 1.0-1.3 | main |
| main 子代理 c | 0.6 | main |
| second 主代理 e | 2.0 | second |
| second 子代理 f | 0-0.7 | second（可选）|
| **总投入** | **~5.1-6.7 PD** | 双 session 5 轨 |
| **wall-clock** | **~1 day** | 5 轨并行（19s+19t 7.1x sweet spot 节奏延续）|

理论加速比：**~5-6x**（与 19s/19t 实测 4-7x 范围一致 / 主轨工作量减少略低）

---

## 二、cici 20a 外部行动项

### 2.1 业务方第 2 次反馈（条件性触发 T-A3）

- 李建颖 D2 demo 验收 / 反馈凭证字段细化 / 字典扩
- 汤云龙 D2 demo 验收 / 反馈按钮 UX / 触发时机细化
- 反馈到位 → T-A3 NcAccountRule 字典扩启动（否则 T-A3 PD 0）

### 2.2 续业务方沟通节奏

| 时间节点 | 期望 |
|---|---|
| **D1** | 升 V0.2 启动 D1 + cici 切 second session 给 e 续 prompt |
| **D2** | main + second 60% 完成 + 业务方反馈 buffer |
| **D3** | Codex 评审 + V0.4 锁版 + 28 Sprint 0 顺延记录持续 |

---

## 三、累计技术债（19r-19t 顺延 + 20a 总收口）

| 技术债 | 来源 | 20a 处置 |
|---|---|---|
| 接口签名 long 重构（5 stub + dispatcher + subscriber + test）| 19r b 占位 / 19t T-A3 评估 | T-A1 ✓ |
| NcVoucherFileOrchestrator 接通调用方 | 19t T-A2 顺延 | T-A2 ✓ |
| NcAccountRule 字典扩 | 19r b fallback / 19s T-A3 字典化 / 业务方反馈触发 | T-A3 条件性 |
| race [P0] → [P1] 降级 | 19t T-A6 4 次闭环达成 | T-A4 ✓ |
| isolation worktree cleanup | 19t T-A6 locked 残留 | T-A5 ✓ |
| voucher-management 真业务 E2E | 19t T-C4 顺延 | T-C1 ✓ |
| Reports 模板扩到 8+ 业务 | 19t T-E3 扩 5 报表 | T-E1 ✓ |
| dashboard mock-to-real 真业务 | 19t T-E2 协议就绪 | T-E2 ✓ |
| dashboard E2E 真业务 | 19t T-E3 顺延 | T-E3 ✓ |
| NcInterface 监控持续优化 | 19t T-E4 顺延 | T-E4 ✓ |
| dashboard 数据缓存优化 | 19t T-F1 顺延 / 20a 评估 spawn | T-F1 可选 |
| ~~Codex hook + CI/CD secrets~~ | 19t T-A4 | ⏸ cici 决策 A 维持手动 / 不在 20a 范围 |

---

## 四、子代理 spawn + 跨 session race 防御

19s-19t 4 次实测成熟（stash + pathspec 双重防御 + 教训 11 反向恢复模式）：

### 4.1 1c 模块隔离表（沿用 19t / main + second）

main 锁定：Vouchers/* + Stubs/ + InterfaceReceipt + voucher-management/* + RegenerateVoucherButton + 8 业务单 + Permissions/* + Web/Menus/*
second 锁定：dashboard-bigscreen/* + reports/* + theme.css + Reports/* + Web/Pages/{Reports,DashboardBigscreen}/

### 4.2 race 防御红线（19s-19t 成熟模板）

```bash
git stash --include-untracked --keep-index   # 隔离他人未 commit
git diff --cached --stat                     # 二次确认 staged
git commit -m "MSG" -- pathspec              # pathspec 限定
git push
git stash pop                                # 恢复 0 丢失
```

### 4.3 isolation worktree（19t T-A6 实测沉淀）

- 默认主 worktree（19s-19t 多次实测 0 race / 5 命令短流程）
- isolation worktree 仅用于：长任务（≥ 1 PD）/ 真并发 race 高风险 / 独立 build CI
- **[P0] 防御链已 4 次闭环 / 20a T-A4 正式降级 [P1] 维护**

---

## 五、Codex 20a 评审准备（手动模式 / cici 19t A 决策）

按 [[feedback_codex_cli_review_modes]] cici 19t A 决策维持手动 codex CLI：

- 20a 收尾 D3 cici 手动触发：`codex review --base <19t 末 commit>` 评审 20a 全 commits
- 5-15 min Codex 跑 / main a 后台等通知 / 完成立修保 28 Sprint 0 顺延记录
- hook 基础设施保留（`.github/workflows/codex-review.yml`）/ 20a+ 评估是否启用

---

## 六、V0.1 起草说明 + 待 cici 拍板

### V0.1 起草版（待拍）

main 主代理 a 起草 / 待 cici V0.1 → V0.2 拍板 / 升 V0.2 启动 D1。

### 5 开放问题待 cici 答

1. **接口签名 long 重构范围**：
   - A. 完整重构（5 stub + dispatcher + subscriber + 5 contract test + regenerator test 全改）→ 0.8 PD
   - B. 分阶段（先 dispatcher + subscriber / 后 5 stub 19v）→ 0.5 PD 但留尾巴
   - C. 仍维持 BusinessIdToGuidPlaceholder 占位（不重构 / 顺延 / 业务紧迫性低）

2. **NcVoucherFileOrchestrator 接通顺序**：
   - A. NcVoucherEventBusSubscriber 替换 dispatcher 优先（业务单审核完成自动生成文件）
   - B. NcVoucherRegenerator 替换优先（重生成时生成文件）
   - C. 两者一起（0.3 PD 全做）

3. **race [P0] → [P1] 降级时机**：
   - A. 20a 正式降级（4 次闭环已达成）
   - B. 保留观察 ≥ 5 Sprint 后降级
   - C. 不降级（保持 [P0] 持续监控）

4. **second e 续 Reports 还是切其他模块**：
   - A. 续 Reports / Dashboards mock-to-real 真业务接通（推荐 / 跨 sprint 同模块连续）
   - B. 切其他模块（你说哪个）

5. **20a 启动时间**：
   - A. 今天 / 现在升 V0.2 启动 D1
   - B. 明天（等业务方第 2 反馈 / cici 见面）
   - C. 等李建颖 / 汤云龙 demo 验收反馈到位

### V0.2 启动条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（§四.1）
- second 主代理 e 同步任务卡

---

**main 主代理 a 签名**：2026-05-16 V0.1 起草 · 等 cici 5 答 + 升 V0.2 启动
