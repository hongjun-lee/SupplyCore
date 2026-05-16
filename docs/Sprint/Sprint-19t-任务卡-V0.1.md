# Sprint 19t 任务卡 V0.1（业务方反馈 buffer + 19r/19s 顺延 patch + 双 session 续 · 起草版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（起草 · main 主代理 a 2026-05-16 — 19s D1 完整闭环 + cici 业务反馈到位触发）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 19t 起草版任务卡（待 cici 答业务反馈细节 + 升 V0.2 启动）
**配套：** [`Sprint-19s-任务卡-V0.4.md`](./Sprint-19s-任务卡-V0.4.md) + [`19r-业务方反馈清单-V0.3.md`](./19r-业务方反馈清单-V0.3.md)

---

## 〇、Sprint 19t 起源（19s D1 完整闭环 + 业务方反馈触发）

### 〇.1 19s D1 收尾继承（main 6 + second 2 = 8 commits / 7.1x sweet spot 实测 / 26 Sprint 0 顺延）

详 [`Sprint-19s-任务卡-V0.4.md`](./Sprint-19s-任务卡-V0.4.md)。19t 直接继承：
- ✅ 双 session 1c 模块隔离实测 7.1x sweet spot 达成（[[feedback_team_naming_convention]] V0.2 推测 6-7x 已验证）
- ✅ 跨 session race 0 误纳实测 2 次（stash + pathspec 双重防御 / [[feedback_subagent_git_race_coordination]] 教训 10）
- ✅ Codex 2 次评审保 26 Sprint 0 顺延（第 1 次 5 finding 立修 / 第 2 次 0 finding 通过）
- ✅ 业务方反馈链路打通（19r D1 9/9 反馈 + D1 见 demo 验收后续）

### 〇.2 业务方反馈触发 T-A7 buffer

cici 19s D1 见李建颖 + 汤云龙 demo 验收后反馈到位 → 19t T-A7 buffer 启动（main T-A1 范围 / patch 凭证模板字段扩 + NcAccountRule 字典扩 + 实际科目映射）。

**⏸ 反馈具体内容待 cici 在 19t V0.1 → V0.2 升版时填**（§六 5 开放问题）。

---

## 一、Sprint 19t 范围（双 session 5 轨并行 / 总 ~7-8 PD / 工期 ~1.5 day）

### 1.1 main 主代理 a 主轨 — 业务反馈 patch + 19r/19s 顺延（~2.0 PD）

| Task | PD | 描述 | 依赖 |
|---|---|---|---|
| **T-A1** 业务方反馈 patch（cici 触发 T-A7 buffer） | 0.6 | 凭证模板字段扩（12 → 13/14 含存货编码 / 凭证字号 / etc.）+ NcAccountRule 字典扩（业务方实际科目映射）+ 5 stub generator 真借贷科目 patch | cici V0.2 反馈到位 |
| **T-A2** IVoucherFileStorage 集成到 base / regenerator | 0.4 | 19s T-A4 基础设施顺延 19t — base GenerateAsync 后调 exporter + storage 生成真 .xlsx + 回填 dto.FilePath + VoucherFileHash | 19s T-A4 完成 |
| **T-A3** 19r b 占位实施（NcResponseMessage / DebitAccountName fallback） | 0.3 | 19r b 3 占位中剩 2 项实施（19s T-A3 NcAccountRule 字典化已部分解 / 此 task 完成 strict）| 19s T-A3 完成 |
| **T-A4** Codex hook + CI/CD secrets | 0.3 | 19s 顺延 #CI — cici secrets 待配 / 启动 codex pre-commit hook 实测 | cici secrets 配置 |
| **T-A5** 19t 收尾 + V0.x 升版 + memory | 0.4 | V0.1 → V0.4 各阶段锁版 + memory 沉淀（业务方反馈 patch 经验 / Codex hook 实测 / 27 Sprint 0 顺延记录）| 全 |

main 主代理 a 总：**~2.0 PD**

### 1.2 main 子代理 b 副轨 — 凭证业务接通 + 批量重生成（~1.6 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-B1** voucher-management 真业务数据接通 | 0.4 | 19s c voucher-management 用 mock 数据 / 19t 接通 backend InterfaceReceiptAppService.GetListAsync 真业务数据（19r D2 立修已暴露 endpoint）|
| **T-B2** ApprovalCompletedEvent 实际 ApprovalState 值接通 | 0.4 | cici Q2.2 答 C 终审 → 19r b 订阅 ApprovalCompletedEvent 但 ApprovalState 实际值待业务方确认（D1 见面后 / cici V0.2 答）|
| **T-B3** 批量重生成 API（业务方反馈如需 / 条件性） | 0.4 | 100+ 业务单同时失败时物资员逐个 click 太烦 → batch-regenerate endpoint 接收 List<sourceEntityId, interfaceCode> | cici V0.2 反馈 |
| **T-B4** 单测扩展 + E2E voucher-management 真业务流 | 0.3 | T-A1-T-A3 + T-B1-T-B3 配套测试 |
| **T-B5** Buffer | 0.1 | 19t 中段调整 |

### 1.3 main 子代理 c 第三轨 — UX 持续完善（~1.3 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-C1** 8 业务单"重生成"按钮 UX 按反馈完善 | 0.4 | 按汤云龙反馈调整（位置 / disabled 规则细化 / Popup 预设理由列表）|
| **T-C2** 凭证管理批量下载 progress bar + retry 优化 | 0.3 | 大批量场景（100+）progress bar 精确 + Retry 按钮 + 网络错误兜底 |
| **T-C3** 反 AI slop UX patch 持续（ui-ux-pro-max skill）| 0.3 | brand tokens 应用扩到更多 page / focus ring / 触控目标完善 |
| **T-C4** voucher-regenerate E2E + voucher-management E2E 真业务接通 | 0.3 | host 启动后跑 E2E（19s c demo 模式 → 真业务 strict）|

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

### 1.6 五轨工期估算

| 轨 | PD | session |
|---|---|---|
| main 主代理 a | 2.0 | main |
| main 子代理 b | 1.6 | main |
| main 子代理 c | 1.3 | main |
| second 主代理 e | 2.0 | second |
| second 子代理 f | 0-0.7 | second（可选）|
| **总投入** | **~7.0-7.7 PD** | 双 session 5 轨 |
| **wall-clock** | **~1.5 day** | max(main 三轨 1.5 day, second 两轨 1 day) |

理论加速比：**~5x（保守）/ ~7x（含 second f）** — 19s 实测 7.1x 基准延续

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

### V0.1 起草版（待拍）

main 主代理 a 起草，业务方反馈细节区占位待 cici V0.1 → V0.2 升版前答。**V0.2 拍板前不动代码**（按 [[feedback_doc_first_workflow]] 文档先行）。

### 待 cici 决策的 5 个开放问题

1. **业务方反馈具体内容**：
   - 李建颖（财务）见 5 demo 凭证后说了什么？字段对不对 / 格式对不对 / 缺什么字段（如存货编码 / 凭证字号）？
   - 汤云龙（物资）见 8 业务单"重生成"按钮 demo 后说了什么？按钮位置 / disabled 规则 / Popup UX 调整？
2. **T-A7 buffer patch 范围**：基于业务反馈 / T-A1 scope（凭证模板扩字段 / NcAccountRule 字典扩 / 5 stub 真借贷科目 / 三选 X 或全做）？
3. **T-B3 批量重生成 API**：业务方反馈如有 100+ 失败场景 → 启动 / 否则顺延？
4. **#RACE-ISOLATION 处置**：降优先级顺延 19u / 评估废弃（19s 跨 session race 0 误纳已验证 stash + pathspec 防御技术）？
5. **second 续模块 + 19t 启动时间**：second e 续做 Reports/Dashboards（T-E1-T-E5 顺延）/ 还是切其他模块？19t 今天启动还是明天？

### V0.2 启动条件

- 5 开放问题 cici 答复
- 业务反馈具体内容填到 §〇.2
- 1c 模块隔离表确认（§四.1）
- second 主代理 e 同步任务卡

---

**main 主代理 a 签名**：2026-05-16 V0.1 起草 · 等 cici 答业务反馈 + 升 V0.2 启动
