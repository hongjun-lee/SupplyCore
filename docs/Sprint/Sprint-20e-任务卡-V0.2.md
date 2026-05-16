# Sprint 20e 任务卡 V0.2（cici 5 答 A/B/A/A/A 拍板启动 D1 · NC 真号回写前端 UI + race [P0] → [P1] 降级 + second e 续 / 32 Sprint 0 顺延目标）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（cici 5 答 A/B/A/A/A 拍板 · NC 真号回写前端 UI dialog + race [P0] → [P1] 降级 + second e 续 全 + 今天启动 D1）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 20e 定版启动任务卡（V0.1 起草 → V0.2 cici 5 答拍板 → 立即启动 D1 / 5 Sprint 窗口收尾里程碑 / race [P0] → [P1] 降级达成）
**配套：** [`Sprint-20d-任务卡-V0.4.md`](./Sprint-20d-任务卡-V0.4.md) + 20d second 轨吸收 + race [P0] 5 Sprint 窗口收尾

---

## 〇、Sprint 20d 收尾接续（V0.4 锁版 / 31 Sprint 0 顺延达成）

### 〇.1 20d D1 完成数据

| 维度 | 实际 |
|---|---|
| main commits（主仓）| 1（`be849e5` T-A3 NC 真号回写 endpoint）|
| 跨仓 commits（SupplyCore docs）| 3（V0.2 `2dc5223` + V0.3 `ce9d2f8` + V0.4 `a48e54f`）|
| main 实际 PD | ~0.85（计划 1.9 / 早完 1.05 PD）|
| Codex finding | **0 finding 通过**（类 18a A 级直接延续）|
| race 实际 | 0（连续 4 Sprint 0 race）|
| **31 Sprint 0 顺延 / 连续 7 立修 + 2 次 0 通过** | ✅ 达成 |
| second e 状态 | ⏸ 未启动 / 顺延 20e 吸收 ~1.5 PD |

### 〇.2 20d 留 task（20e 吸收 / 见 §三）

- **20d second 轨完整吸收**：T-E1 dashboard 4 → 6+ aggregator / T-E2 Reports 11 → 13+ / T-E3 E2E spec 加严 / T-E4 收尾（总 ~1.5 PD）
- **NC 真号回写前端 UI 接通**：20d T-A3 backend 完成 / frontend 需配 NC 真号填写 button + dialog
- **race [P0] 5 Sprint 窗口收尾评估**：20a-20e 第 5 Sprint / cici Q3 B 决策的窗口正式收尾节点

### 〇.3 5 Sprint 观察窗口收尾节点（cici Q3 B 决策 / 关键里程碑）

- **窗口**：20a → 20e（连续 5 Sprint）
- **观察结果**（截至 20d）：
  - 连续 4 Sprint 0 race（20a + 20b + 20c + 20d）
  - 教训 13 模板 5 次实测成熟稳定（关闭跟踪）
  - 1c 模块隔离表稳定 / second 第 6 次连续 0 文件交叉
- **20e 决策**：race [P0] → [P1] 正式降级（窗口闭合 / 4 次防御 case + 4 次 0 race 实测 / 证据链 ≥ 4 充分）
- **20f+ 维护**：维持 [P1] 防御链 / 不再强制每 Sprint 主动观察 / 仅记录失败 case 触发回升

---

## 一、Sprint 20e 范围（NC 真号回写前端 UI + race 降级评估 + second e 续 / 双 session / 总 ~3-4 PD）

### 1.1 main 主代理 a 主轨 — NC 真号回写前端 + race 降级评估（~1.5 PD）

| Task | PD | 描述 | 触发 |
|---|---|---|---|
| **T-A1** NC 真号回写前端 UI 接通（**Q2 B dialog 设计**）| **0.4** | voucher-management 页加 "回填 NC 真号" 按钮（每行 action）+ dialog 输入 NcVoucherNumber + 字段验证（required + 1-64 长度）+ 调 PUT /api/.../nc-voucher-number / 表格 NcVoucherNumber 列即时更新 / aria-label + brand tokens / **不动表格 inline edit** | 20d T-A3 backend 已完成 / Q2 B 选 dialog |
| **T-A2** race [P0] → [P1] **正式降级**（**Q3 A 拍板**）| **0.2** | 5 Sprint 窗口（20a-20e）正式收尾 / 评估窗口数据（连续 4 Sprint 0 race + 教训 13 模板成熟）/ [[feedback_spawn_worktree_decision]] 升级 [P0] → [P1] + AGENTS.md V1.7+ 记录 / 维护降级理由 + 触发回升条件 | cici Q3 A 拍板 |
| **T-A3** 业务方持续反馈追踪 | 0.1 | F-3 12 列 Excel 持续验收（顺延 20f）/ G-12 NC 真号回写前端 UI 给业务方反馈追踪 / 不主动追加业务方扰 | Q2 A 仅未闭环项续 |
| **T-A4** race 观察记录（第 5 Sprint / 最后）| 0.1 | 5 Sprint 窗口最后一 Sprint / 被动记录 / memory 留痕窗口收尾 | cici Q3 B 决策延续 |
| **T-A5** Codex 20e 评审 + 立修 | 0.3 | `codex review --base a48e54f`（20d 末 commit）/ 立修保 **32 Sprint 0 顺延** | 标准收尾 |
| **T-A6** Sprint 20e 收尾 + V0.x 升版 + memory | 0.4 | V0.1 → V0.4 锁版 + memory（race [P0] 降级达成 / 5 Sprint 窗口收尾沉淀 / G-12 全栈实现）| 主代理 a 标准收尾 |

main 主代理 a 总：**~1.5 PD**

### 1.2 main 子代理 b 副轨 — voucher-management spec 加严 + brand tokens 续（~0.5-0.8 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-B1** NC 真号回写前端 spec 加严 | 0.3 | voucher-management.spec.ts 加场景 14：点 NC 真号回填 button → 输入 NC 真号 → 提交 → 表格列即时更新 / 失败重试 + 验证错误提示 |
| **T-B2** brand tokens 续扩剩余 page（contracts / monthly-prepayment / nc-interface）| 0.3 | 19t/20a/20b/20c 已扩 / 20e 完成 / 反 AI slop UX 持续 |
| **T-B3** Buffer | 0.2 | 20e 中段调整 |

### 1.3 second 主代理 e 平行轨 — Reports/Dashboards 续吸收（~1.5-1.8 PD / 第 7 次连续）

吸收 20d second e 计划完整未启动任务 + 续 20c 进度：

| Task | PD | 描述 |
|---|---|---|
| **T-E1** dashboard aggregator 5 → 7+ | 0.5 | 20c 5 真接通 / 20e 续 2 个（库存周转 / 在租设备月费 / 高敏感关注）|
| **T-E2** Reports 模板 11 → 13+ | 0.4 | 20c 11 个 / 20e 续 2 个（月结对账 / 反结申请 / 暂估月报）|
| **T-E3** dashboard E2E spec 加严 | 0.3 | 真接通数据校验 + fallback case spec + 30s 轮询稳定（顺延 20d）|
| **T-E4** NcInterface 监控强化 | 0.3 | NcVoucherNumber 填写后 status 显示真号 / aria-live 提示 |
| **T-E5** 收尾 + memory | 0.3 | 第 7 次连续 Reports/Dashboards 同模块（19s + 19t + 20a + 20b + 20c + 20d + 20e）|

second 主代理 e 总：**~1.8 PD**

---

## 二、cici 20e 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **NC 真号回写前端 UI 验收** | 中 | T-A1 完成后 cici 验证 button + dialog + 表格列即时更新 |
| **race [P0] 5 Sprint 窗口降级确认** | 中 | T-A2 完成后 cici 确认 [P0] → [P1] 降级（窗口收尾节点）|
| **切 second session** | 标准 | 给 e 续 prompt 启动 20e second 轨 |
| **Codex 20e 评审触发** | 标准 | D2 收尾时手动 `codex review --base a48e54f` |

| 时机 | 行动 |
|---|---|
| **D1** | 升 V0.2 启动 D1 + cici 切 second session 给 e 续 prompt + cici 验证 NC 真号回写前端 |
| **D2** | Codex 评审触发 + V0.3 锁版 |
| **D3** | Codex 立修（如有）+ V0.4 锁版 + 32 Sprint 0 顺延记录持续 |

---

## 三、累计技术债（19r-20d 顺延 + 20e 收口）

| 来源 | Task | 20e 处置 |
|---|---|---|
| 20d second 轨完整 | T-E1~T-E5 全 5 项 | **second e 全吸收**（~1.8 PD）|
| 20d T-A3 NC 真号回写 backend 完成 | frontend UI 待接通 | **T-A1 收口**（main 主轨 / 0.4 PD）|
| race [P0] 5 Sprint 窗口 | 20a-20e 观察 | **T-A2 降级评估**（cici Q3 B 决策收尾）|
| 19r-20c F-3 12 列 Excel 验收 | 业务方未触发 | **T-A3 续观察 / 顺延 20f**（业务方反馈触发再启动）|
| 19r-20c NcAccountRule 字典扩 | G-13 A 顺延 | 继续顺延 / 不在 20e 范围 |

---

## 四、子代理 spawn + 跨 session race 防御

### 4.1 1c 模块隔离表（main + second 锁定清单 / 延续）

| session | 锁定模块 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / SupplyCoresWebModule.cs / voucher-management/* / contracts/* / monthly-prepayment/* |
| **second** | dashboard-bigscreen/* / reports/* / theme.css / DashboardBigscreenAppService / BusinessReportsAppService / NcInterfaceMonitor / DashboardCronConstants |

### 4.2 spawn 策略

- **默认主 worktree**（同 19r-20d 模式 / 串行化无 race / 连续 4 Sprint 0 race 实测）
- **教训 13 模板**（5 次实测成熟稳定 / 第 8+ 次维持记录）
- **race [P0] 5 Sprint 窗口最后一 Sprint** / T-A2 正式降级 [P1]

---

## 五、Codex 20e 评审准备（手动模式延续）

- 20e 收尾 D2-D3 cici 手动触发：`codex review --base a48e54f`（20d 末 commit）
- 5-15 min Codex 跑 / main a 后台等通知
- 立修保 **32 Sprint 0 顺延**
- 接续记录连续 7 Sprint 立修 + 2 次 0 finding 通过

---

## 六、V0.1 启动条件（cici 5 答拍板）

### 5 开放问题待 cici 答

1. **20e 主题确认**：
   - A. NC 真号回写前端 UI + race 降级 + second e 续（推荐 / 综合 / 自然 next）
   - B. 仅 NC 真号回写前端 UI（main only / 不启 second / 保守）
   - C. 仅 second e 续吸收（main 主轨缩减 / 等 cici 协调其他主轨）

2. **NC 真号回写前端 UI 设计**：
   - A. 表格列内联编辑（inline edit / DevExtreme cellTemplate）
   - B. 弹 dialog 输入（button "回填 NC 真号" + dialog 输入 + 提交 / 推荐 / 简单）
   - C. 顺延 20f（cici 不想动 / backend 已用 / 暂手动 SQL）

3. **race [P0] 5 Sprint 窗口降级确认**：
   - A. 20e 正式降级 [P0] → [P1]（推荐 / cici Q3 B 决策窗口收尾）
   - B. 延长窗口 +5 Sprint（20j 评估 / 保守）
   - C. 直接降级 [P2]（更激进 / 不监控）

4. **second e 续 范围**：
   - A. 吸收 20d 全任务（T-E1~T-E5 / ~1.8 PD / 推荐）
   - B. 仅 T-E1 + T-E2（dashboard + Reports 续 / 1.0 PD / 保守）
   - C. 暂停 second（仅 main / 等 cici 协调）

5. **20e 启动时间**：
   - A. 今天升 V0.2 启动 D1（连续 / 31 Sprint 0 顺延动量延续）
   - B. 明天启动（休息）
   - C. 等业务方持续反馈触发（保守）

### V0.2 拍板条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（§四.1）
- second 主代理 e 同步任务卡（cici 切 session 给 e 续 prompt）

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-16 | main a 起草 · 5 开放问题待 cici 答 |
| V0.2 | 2026-05-16 | **cici 5 答 A/B/A/A/A 拍板**（Q1A 综合主题 / Q2B dialog 设计 / **Q3A race [P0] → [P1] 正式降级** / Q4A second e 全吸收 / Q5A 今天启动 D1）· 启动 D1 |

---

## 八、V0.2 拍板启动 D1（cici 5 答 A/B/A/A/A）

| Q | 答 | 影响 |
|---|---|---|
| Q1 | A | 综合主题：NC 真号回写前端 UI + race 降级 + second e 续 / main + second 双轨 |
| Q2 | B | NC 真号回写前端 UI dialog 设计（不动表格 inline edit / 简单稳定）|
| Q3 | A | **race [P0] → [P1] 正式降级**（5 Sprint 窗口 20a-20e 收尾 / 证据链 ≥ 4 充分）|
| Q4 | A | second e 续全 T-E1~T-E5（~1.8 PD / 第 7 次连续）|
| Q5 | A | 今天启动 D1 / 31 Sprint 0 顺延动量延续 |

### 8.1 main D1 启动顺序

1. **T-A4 race 观察记录最后 Sprint**（0.1 PD / 首启 / 不依赖外部 / 5 Sprint 窗口收尾里程碑）
2. **T-A2 race [P0] → [P1] 正式降级**（0.2 PD / memory + AGENTS 升级 / 不依赖代码）
3. **T-A1 NC 真号回写前端 UI 接通**（0.4 PD / 主要工作 / dialog 设计 / 表格 + button + dialog + 调 PUT）
4. **T-A3 业务方持续反馈追踪**（0.1 PD / 不主动追加）
5. **T-A5 Codex 评审 + 立修**（D2 / 0.3 PD）
6. **T-A6 V0.x 升版 + memory**（D2-D3 / 0.4 PD）

### 8.2 second e D1 启动顺序（cici 切 second session 给 e 续 prompt）

1. T-E1 dashboard aggregator 5 → 7+（0.5 PD / 续 20c 5 真接通 + 加 2 / 库存周转 / 在租设备月费 / 高敏感）
2. T-E2 Reports 模板 11 → 13+（0.4 PD / 续 20c 11 个 + 加 2 / 月结对账 / 反结申请 / 暂估月报）
3. T-E3 dashboard E2E spec 加严（0.3 PD / 真接通数据校验 + fallback case spec + 30s 轮询稳定）
4. T-E4 NcInterface 监控强化（0.3 PD / NcVoucherNumber 填写后 status 显示真号）
5. T-E5 收尾 + memory（0.3 PD）

### 8.3 启动条件全部满足

- ✅ 5 开放问题 cici A/B/A/A/A 答
- ✅ 1c 模块隔离表确认（§四.1）
- ✅ 20d V0.4 锁版完成（`a48e54f` / 31 Sprint 0 顺延达成）
- ⏳ second 主代理 e 同步任务卡（cici 切 session 给 e 续 prompt 时同步）

### 8.4 5 Sprint 观察窗口收尾里程碑（race [P0] → [P1] 降级）

- **窗口**：20a → 20e（连续 5 Sprint）
- **观察数据**（截至 20d）：
  - 连续 4 Sprint 0 race（20a + 20b + 20c + 20d）
  - 教训 13 模板 5 次实测成熟稳定（关闭跟踪）
  - 1c 模块隔离表稳定 / second 第 6 次连续 0 文件交叉
  - cici Q6 C 目标"防御链证据 ≥ 4 次"已实现
- **20e T-A2 降级措施**：
  - [[feedback_spawn_worktree_decision]] memory 升级 [P0] → [P1]
  - AGENTS.md V1.7+ §race 防御 章节标记降级
  - 维护降级理由 + 触发回升条件（如出现新 race case 升回 [P0]）
- **降级后维护**：
  - 不再强制每 Sprint 主动观察
  - 仅记录失败 case 触发回升 [P0]
  - 维持 1c 模块隔离表 + 教训 13 模板 + stash + pathspec 双重防御

---

**main 主代理 a 签名**：2026-05-16 V0.1 起草 · V0.2 cici 5 答 A/B/A/A/A 拍板 → 立即启动 D1 / race [P0] → [P1] 降级 / 32 Sprint 0 顺延目标
