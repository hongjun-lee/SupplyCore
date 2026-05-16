# Sprint 19t 任务卡 V0.2（定版启动 D1 · cici 8 答拍板 / race isolation 实测 + 业务方满意现状）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（定版启动 · main 主代理 a 2026-05-16 — cici 8 答拍板：财务全 A 满意 / 物资 E+A 顺延 / 6C race isolation 实施 / 7A second 续 Reports / 8A 今天启动）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 19t 定版启动任务卡（V0.2 拍板 → 立即启动 D1 / second 主代理 e 续 Reports/Dashboards）
**配套：** [`Sprint-19s-任务卡-V0.4.md`](./Sprint-19s-任务卡-V0.4.md) + [`19r-业务方反馈清单-V0.3.md`](./19r-业务方反馈清单-V0.3.md)

## 版本沿革

| 版本 | 日期 | 操作 | 描述 |
|---|---|---|---|
| V0.1 | 2026-05-16 | 起草 | 业务方反馈 buffer + 19r/19s 顺延 + 5 开放问题待 cici 拍板 |
| V0.2 | 2026-05-16 | 定版启动 | cici 8 答拍板（Q1-Q3 财务全 A 满意 / Q4 E + Q5 A 物资顺延 / Q6 C race isolation 实施 / Q7 A second 续 Reports / Q8 A 今天启动）→ D1 启动 |

---

## 〇、Sprint 19t 起源（19s D1 完整闭环 + 业务方反馈触发）

### 〇.1 19s D1 收尾继承（main 6 + second 2 = 8 commits / 7.1x sweet spot 实测 / 26 Sprint 0 顺延）

详 [`Sprint-19s-任务卡-V0.4.md`](./Sprint-19s-任务卡-V0.4.md)。19t 直接继承：
- ✅ 双 session 1c 模块隔离实测 7.1x sweet spot 达成（[[feedback_team_naming_convention]] V0.2 推测 6-7x 已验证）
- ✅ 跨 session race 0 误纳实测 2 次（stash + pathspec 双重防御 / [[feedback_subagent_git_race_coordination]] 教训 10）
- ✅ Codex 2 次评审保 26 Sprint 0 顺延（第 1 次 5 finding 立修 / 第 2 次 0 finding 通过）
- ✅ 业务方反馈链路打通（19r D1 9/9 反馈 + D1 见 demo 验收后续）

### 〇.2 业务方反馈实测（cici 8 答拍板填入 / V0.2 定版）

**财务方李建颖（D1 见 5 demo .xlsx 后 / 完全满意）**：
- Q1 A：12 列字段完全够用 / 19t 不扩字段
- Q2 A：30+ 标准科目字典够用 / 19t 不扩字典
- Q3 A：NC 没试导入（PO 决策 1 NC 暂未上线 / 维持）+ 频次 A 实时 OK

→ T-A1 大幅缩减（原 0.6 PD → 0.2 PD / 仅 5 stub 真借贷科目 patch / 业务方满意现状）

**物资方汤云龙（D1 见 8 业务单按钮 demo 后 / 部分顺延）**：
- Q4 E：没看 demo / 物资侧 patch 全顺延 19u
- Q5 A：ApprovalState 用代码默认 + 不要批量重生成 UI / T-B2 + T-B3 顺延

→ main b T-B2/T-B3 顺延 + main c T-C1/T-C4 顺延

**19t 决策 3 问**：
- Q6 C：#RACE-ISOLATION race 真并发 isolation worktree 19t 实施（+0.8 PD / [P0] 证据链彻底闭环 / 验证 isolation 模式价值）
- Q7 A：second 续 Reports/Dashboards / 跨 sprint 同模块连续 / 经验复用
- Q8 A：今天立即启动 D1

---

## 一、Sprint 19t 范围（双 session 5 轨并行 / 总 ~7-8 PD / 工期 ~1.5 day）

### 1.1 main 主代理 a 主轨 — 19s/19r 顺延 + race isolation 实测（~2.0 PD / Q1-Q3 财务全 A 缩减 + Q6 C 新增 T-A6）

| Task | PD | 描述 | 依赖 |
|---|---|---|---|
| **T-A1** 5 stub 真借贷科目 patch（cici Q1 A 缩减）| 0.2 | 财务方对 19s D1 demo 完全满意 / 12 列字段 + NcAccountRule 字典都不扩 / 仅 5 stub generator 借贷科目从占位 → 真科目（5 demo 凭证保持现状 / 业务方未触发字段扩） | 无 |
| **T-A2** IVoucherFileStorage 集成到 base / regenerator | 0.4 | 19s T-A4 基础设施顺延 19t — base GenerateAsync 后调 exporter + storage 生成真 .xlsx + 回填 dto.FilePath + VoucherFileHash + 跨 5 stub 测试 | 19s T-A4 完成 |
| **T-A3** 19r b 占位 strict 实施 | 0.3 | 19r b 3 占位中剩项 strict 实施（19s T-A3 NcAccountRule 已部分解 + 19s D1 Codex P2-1 立修 SourceInterfaceCode 已部分解 / 此 task 收尾）| 19s T-A3 + Codex 立修完成 |
| **T-A4** Codex hook + CI/CD secrets | 0.3 | 19s 顺延 #CI — cici secrets 待配 / 启动 codex pre-commit hook 实测 | cici secrets 配置 |
| **T-A5** 19t 收尾 + V0.x 升版 + memory | 0.4 | V0.2 → V0.5 各阶段锁版 + memory 沉淀（race isolation 实测经验 / Codex hook 实测 / 27 Sprint 0 顺延记录）| 全 |
| **T-A6** race isolation worktree 真并发实测（Q6 C 新增）| 0.8 | spawn 子代理 d 用 `isolation: "worktree"` 模式 / main + d 同时改 same file 真并发触发 race / git history 验证 isolation 防 race / [P0] 证据链彻底闭环（19r D2 stash + pathspec vs isolation 对比沉淀）| spawn 子代理 d isolation worktree |

main 主代理 a 总：**~2.4 PD（含 T-A6 0.8 PD）**

### 1.2 main 子代理 b 副轨 — voucher-management 真业务接通 + 单测（~1.0 PD / Q5 A 物资顺延缩减）

| Task | PD | 描述 |
|---|---|---|
| **T-B1** voucher-management 真业务数据接通 | 0.4 | 19s c voucher-management 用 mock 数据 / 19t 接通 backend InterfaceReceiptAppService.GetListAsync 真业务数据（19r D2 立修已暴露 endpoint）|
| ~~**T-B2** ApprovalCompletedEvent 实际 ApprovalState 值接通~~ | ~~0.4~~ | **顺延 19u**（Q5 A cici 答用代码默认值 / 不调整）|
| ~~**T-B3** 批量重生成 API~~ | ~~0.4~~ | **顺延 19u**（Q5 A cici 答不要批量 UI）|
| **T-B4** 单测扩展 + E2E voucher-management 真业务流 | 0.4 | T-A1-T-A3 + T-B1 配套测试 + E2E 真业务流 |
| **T-B5** Buffer | 0.2 | 19t 中段调整 |

### 1.3 main 子代理 c 第三轨 — UX 持续完善（~0.6 PD / Q4 E 物资没看 demo 大幅缩减）

| Task | PD | 描述 |
|---|---|---|
| ~~**T-C1** 8 业务单"重生成"按钮 UX 按反馈完善~~ | ~~0.4~~ | **顺延 19u**（Q4 E 物资汤云龙没看 demo / 19u 第 2 次反馈到位再做）|
| **T-C2** 凭证管理批量下载 progress bar + retry 优化 | 0.3 | 大批量场景（100+）progress bar 精确 + Retry 按钮 + 网络错误兜底 |
| **T-C3** 反 AI slop UX patch 持续（ui-ux-pro-max skill）| 0.3 | brand tokens 应用扩到更多 page / focus ring / 触控目标完善 |
| ~~**T-C4** voucher-regenerate E2E + voucher-management E2E 真业务接通~~ | ~~0.3~~ | **顺延 19u**（依赖 T-B1 真业务接通完成 + 物资反馈 / 优先级降低）|

### 1.4 second 主代理 e 平行轨 — Reports/Dashboards 续 + 19s T-F1/T-F2 顺延（~2.0 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** dashboard-bigscreen 后端聚合 Hangfire | 0.5 | 19s T-F1 顺延 — Hangfire 预聚合 cron / 索引优化 / DTO 缓存 |
| **T-E2** mock-to-real 切换协议 | 0.3 | 19s T-F2 顺延 — 19q 已 mock / 真业务数据 swap / 19o b OAuth2 接通备件复用 |
| **T-E3** Reports 模板扩到更多业务（XlsxTemplateHelper 复用）| 0.5 | 19s 50c211c 加的 XlsxTemplateHelper 已 ok / 19t 扩到 5+ 报表（如供应商履约 / 月度对账 / 库存盘点）|
| **T-E4** NcInterface 监控页面优化（19q 已稳 / 与凭证管理协调）| 0.4 | 19q nc-interface page 与 19s voucher-management 菜单分组统一 / E2E 加严 |
| **T-E5** 收尾 + 双 session 协调 + memory | 0.3 | 同步 main commit / race 检查 / Codex 评审准备 |

### 1.5 second 子代理 f（可选 ~0.7 PD）

按 second e 评估 D2 是否 spawn：
- **T-F1** dashboard 数据查询缓存（如 second T-E1 工作量超）

### 1.6 五轨工期估算（V0.2 定版 / cici 8 答缩减 + Q6 C 新增 T-A6）

| 轨 | V0.1 估 | V0.2 实际 | 变化 |
|---|---|---|---|
| main 主代理 a | 2.0 | **2.4** | +0.4（Q1-Q3 缩 0.4 / Q6 C 加 0.8）|
| main 子代理 b | 1.6 | **1.0** | -0.6（Q5 A 顺延 T-B2/T-B3）|
| main 子代理 c | 1.3 | **0.6** | -0.7（Q4 E 顺延 T-C1/T-C4）|
| second 主代理 e | 2.0 | 2.0 | 不变（Q7 A 续 Reports）|
| second 子代理 f | 0-0.7 | 0-0.7 | 可选 |
| **总投入** | 7.0-7.7 | **~6.0-6.7 PD** | **-1 PD（业务方满意现状缩减）**|
| **wall-clock** | ~1.5 day | **~1.5 day** | 不变（main a 2.4 PD 主轨节奏）|

理论加速比：**~4-4.5x（含 second f）** — 比 19s 7.1x 略低（main 工作量减少 / second 不变）

---

## 二、cici 19t 外部行动项

### 2.1 业务方反馈细节回报（V0.1 → V0.2 升版前必答）

详 §六 5 开放问题。

### 2.2 续业务方沟通

- 李建颖第 2 次反馈（19t T-A1 patch 完成后 demo）
- 汤云龙第 2 次反馈（19t T-C1 按钮 UX 完善后 demo）

### 2.3 反馈窗口 deadline

| 时间节点 | 期望 | 超期处置 |
|---|---|---|
| **D1** | cici 回报业务方反馈 + 升 V0.2 | 红色警报 / T-A1 buffer 不启动 |
| **D2** | main + second 三轨完成 60% | 中段 race 检查 |
| **D3** | V0.4 锁版 + Codex 评审 | 保 27 Sprint 0 顺延 |

---

## 三、累计技术债（19r + 19s 顺延 + 19t 处置）

| 技术债 | 19t 处置 |
|---|---|
| 19s T-A4 IVoucherFileStorage base 集成 | T-A2 ✓ |
| 19r b 占位 NcResponseMessage / DebitAccountName fallback | T-A3 ✓ |
| 19s 顺延 #CI CI/CD secrets + Codex hook | T-A4 ✓（cici secrets 配置依赖）|
| 19s T-F1/T-F2 后端聚合 + mock-to-real | second T-E1 + T-E2 ✓ |
| 19r #RACE-ISOLATION race 真并发 isolation worktree | **降优先级**（19s 跨 session race 0 误纳已验证 stash + pathspec 防御 / isolation 长 / 顺延 19u+ 或评估废弃）|
| **新 #BUSINESS-FEEDBACK** 业务方第 2 次反馈窗口 | cici 19t D1 完成后启动 |

---

## 四、子代理 spawn + 跨 session race 防御

19s D1 实测成熟模板（[[feedback_subagent_git_race_coordination]] 教训 10 + [[feedback_dual_session_1c_module_isolation_first_validation]]）：

### 4.1 1c 模块隔离表（19t 继承 + 续）

main 锁定：
- Vouchers/* + Stubs/ + InterfaceReceipt + voucher-management/* + RegenerateVoucherButton + 8 业务单 frontend pages + Permissions/* + Web/Menus/*

second 锁定：
- dashboard-bigscreen/* + reports/* + theme.css + dashboard-bigscreen.spec + ReportAlerts/ + Application/Reports/ + Web/Pages/{Reports,DashboardBigscreen}/

共享区（双方加新文件可 / 改对方已有不可）：
- `frontend/src/shared/`（only add new file）
- `src/SupplyCores.Web/`（main + second 协调 / second 19s 已加 SupplyCoresBrandingProvider）

### 4.2 race 防御红线（stash + pathspec 双重防御 / 19s D1 验证）

```bash
git stash --include-untracked --keep-index   # 隔离他人工作（保留 staged）
git diff --cached --stat                     # 二次确认
git commit -m "MSG" -- pathspec
git push
git stash pop                                # 恢复 0 丢失
```

---

## 五、Codex 19t 评审准备

按 [[feedback_codex_0_carryover_8_sprint_record]] + [[feedback_codex_cli_review_modes]]：

预备：保 **27 Sprint 0 顺延** 记录（19q + 19r + 19s + 19t = 连续 4 Sprint 立修 / 或 19s D1 第 2 次评审 0 finding 模式）。

提示词预备（cici 触发时）：

```bash
codex review --base <19t-起 commit hash> 重点：
1. T-A1 凭证模板字段扩 + NcAccountRule 字典扩 + 5 stub generator 真借贷科目（业务方反馈合规）
2. T-A2 IVoucherFileStorage base 集成（base + regenerator 调用 / dto.FilePath 真实回填）
3. T-A3 19r b 占位 strict 实施（NcResponseMessage / DebitAccountName fallback）
4. T-B1 voucher-management 真业务接通（前后端契约 / mock → real swap）
5. T-B2 ApprovalCompletedEvent 实际 ApprovalState 值接通
6. T-C1-T-C4 UX 完善（按业务方反馈 / brand tokens / E2E 真业务）
7. second T-E1-T-E5 Reports/Dashboards 续（Hangfire / XlsxTemplateHelper 扩 / NcInterface 优化）
8. 跨 session race 检查（main + second 是否触碰对方锁定）
```

---

## 六、V0.1 起草说明 + 待 cici 拍板

### V0.2 定版（cici 8 答拍板）

- Q1 → A 12 列字段不变
- Q2 → A NcAccountRule 字典够用
- Q3 → A NC 没试 + 频次 A 维持
- Q4 → E 物资没看 demo / T-C1+T-C4 顺延
- Q5 → A ApprovalState 默认 + 不要批量 UI / T-B2+T-B3 顺延
- Q6 → C race isolation 19t 实施（+0.8 PD T-A6）
- Q7 → A second 续 Reports/Dashboards
- Q8 → A 今天启动

### D1 启动序

**main session**（当前主代理 a）：
1. ✅ V0.1 → V0.2 升版 + push（本 commit）
2. **main 主代理 a 立即开 T-A1**：5 stub 真借贷科目 patch
3. **同时 spawn main 子代理 b**：T-B1+T-B4+T-B5
4. **同时 spawn main 子代理 c**：T-C2+T-C3
5. D2：main T-A2 IVoucherFileStorage base 集成 + T-A3 19r b 占位 strict + T-A6 race isolation 实测
6. D3：T-A4 Codex hook + T-A5 收尾

**second session**（cici 在 second 切换续启动主代理 e）：
1. cici 切到 second session（沿用 19s session 或新启）
2. 给主代理 e 传 V0.2 任务卡 + main 当前 commit hash 作为基线
3. **second 主代理 e 启 T-E1**：dashboard 后端聚合 Hangfire
4. D2-3：second T-E2-T-E5

### 启动条件 ✅

- ✅ cici 8 答已拍
- ✅ V0.2 定版 push（second e 可拉取任务卡）
- ✅ 1c 模块隔离表确认（§四.1 维持 19s）
- ✅ race isolation worktree T-A6 准备（T-A6 实施时单独 spawn 子代理 d / 与 b/c 时机错开）

---

**main 主代理 a 签名**：2026-05-16 V0.1 起草 · 等 cici 答业务反馈 + 升 V0.2 启动
