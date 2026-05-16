# Sprint 19r 任务卡 V0.3（D1 完整闭环 + cici 业务方 9 反馈到位 + D2-3 patch 启动）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.3（定版启动 D2-3 · 主代理 a 2026-05-16 — D1 5 task 全闭环 + cici 见面反馈 9/9 到位 + 双号制 patch 启动）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 19r D2-3 启动版任务卡（V0.3 定版 → 立即启动 D2 patch）
**配套：** [`Sprint-19q-任务卡-V0.4.md`](./Sprint-19q-任务卡-V0.4.md) + [`19r-业务方反馈清单-V0.2.md`](./19r-业务方反馈清单-V0.2.md)（cici 见面 9 反馈到位） + [`Sprint-19r-NC接口重新分级-V0.1.md`](../详细设计/Sprint-19r-NC接口重新分级-V0.1.md)

## 版本沿革

| 版本 | 日期 | 操作 | 描述 |
|---|---|---|---|
| V0.1 | 2026-05-16 | 起草 | PO 会议两条决策 + 5 开放问题待 cici 拍板 |
| V0.2 | 2026-05-16 | 定版启动 | cici 5 决策拍板 → D1 启动（T-A1-T-A4 + T-B1-T-B2 + T-C2-T-C3'）|
| V0.3 | 2026-05-16 | 定版启动 D2 | D1 完整闭环（5.0 PD / 6 commit / 0 race / 43 单测全过 + 6 E2E）+ cici 见面 9 反馈到位 → D2-3 patch 启动 |

---

## 〇、Sprint 19r 起源（2026-05-16 PO 会议两条关键决策 / V0.2 维持）

详 V0.2 §〇。简：
1. NC 暂不上线 → 凭证导出主线
2. 对接人明确：财务=李建颖 / 物资=汤云龙

---

## 一、Sprint 19r 范围（V0.3 / 三轨并行 / D1 ✅ + D2-3 patch 启动）

### 1.1 主代理 a 主轨 D1（~2.0 PD ✅）

| Task | PD | commit | 状态 |
|---|---|---|---|
| **T-A3** 业务方反馈清单 V0.1 | 0.4 | `90c3f09` | ✅ D1 |
| **T-A1** 23 接口重新分级 V0.1 | 0.6 | `3db63e4` | ✅ D1 |
| **T-A2** F-03 4 字段 + Wave 93 migration | 0.5 | `9e1f1ae` | ✅ D1 |
| **T-A4** 19q 3 E2E failed 修复 | 0.3 | `e84d805` | ✅ D1（6 passed / 1 容错 skip / 0 failed）|

### 1.2 子代理 b 副轨 D1（~1.6 PD ✅ / commit `4aa3426`）

T-B1 凭证生成器框架 + T-B2 ClosedXML 5 demo · 41/41 测试通过 / 子代理 b 主动选择"NcVoucherDispatcher 替代 ABP ILocalEventBus"避免过度设计

### 1.3 子代理 c 第三轨 D1（~1.6 PD ✅ / commit `32ef7eb`）

T-C2 OIDC 验证（**重要发现：19o D1-3 b Full ABP OpenIddict 已自然修复，c 只需 curl 验证**）+ T-C3' 5 接口契约测试（25/25 全过）

### 1.4 D1 总结

| 项 | 数据 |
|---|---|
| 总 PD | **5.0 PD**（V0.2 预算 5.2 PD ✓ 略低预算）|
| commits | 6 个（SupplyCores 4：a×3 + b×1 + c×1；SupplyCore docs 2：a 反馈清单 + a 接口重新分级 + a V0.2 → V0.3 升版）|
| wall-clock | ~1.6 day → **3.1x sweet spot**（[[feedback_sweet_spot_4_sprint_validation]] 范围内）|
| race | 0 路径冲突 / 0 误纳（19q 教训 6 [P0] 沿用）|
| 测试 | dotnet --filter Vouchers 43/43 + Playwright 6 passed / 1 容错 skip |

### 1.5 D2-3 patch 范围（cici 9 反馈到位 → 综合规划 ~3.4 PD / 三轨并行 ~1.5 day）

#### 主代理 a（~1.2 PD）

| Task | PD | 范围 |
|---|---|---|
| **T-A6** F-03 加 `NcVoucherNumber` + Wave 94 migration（**Q1.4 C 双号制**）| 0.2 | Domain InterfaceReceipt + EF mapping + ef migrations add |
| **T-A7** 8 物资实体 rename + 加新字段 + Wave 95 migration（**Q2.1 D 双字段拆分**）| 0.5 | Contract / StockInbound / MaterialIssuance / StockReturn / StockTransfer / PurchaseReturn / PaymentRequest / MonthlyPrepaymentSummary 各 patch + 17a-19q 关联 23 contributor + mock client 同步 |
| **T-A8** F-03 状态机 Failed → Regenerated 实装（**Q1.5 B / Q2.4 B**）| 0.2 | NcVoucherGeneratorBase 加 RegenerateAsync + 状态转换测试 |
| **T-A9** 跨实体一致性测试 | 0.1 | rename + 双字段集成测试 |
| **T-A5** Sprint 收尾 V0.3 → V0.4 + memory 5 条 | 0.2 | 锁版 + memory（5 月反模式根因 #2#3 解除验证 / 双号制 / D1 sweet spot 3.1x / dotnet ef 工作流 / 顺延 task 启动前验证）|

#### 子代理 b（~1.5 PD）

| Task | PD | 范围 |
|---|---|---|
| **T-B3** T-B1 订阅 `ApprovalCompletedEvent` + 替换调度器内部（**Q2.2 C 终审**）| 0.3 | NcVoucherDispatcher 改 EventBus 订阅 |
| **T-B4** T-B1 加重生成 API + INcVoucherRegenerator | 0.3 | Failed 状态触发 / 双号制凭证号生成 |
| **T-B5** T-B2 模板扩到 12 列（贷方科目代码/名称 + 存货编码 + 凭证字号）（**Q1.2 cici 字段表 + 补贷方科目名称**）| 0.3 | ClosedXML 模板 + 5 demo 文件重生成 |
| **T-B6** T-B2 批量合并 export 方法（**Q2.3 D 单条 + 财务侧批量下载**）| 0.3 | 多张凭证 → 1 个 Excel（多 sheet 或多行）|
| **T-B7** 单测扩展 | 0.3 | 重生成 / 双号制 / 批量 export 测试 |

#### 子代理 c（~0.7 PD / 前端 patch）

| Task | PD | 范围 |
|---|---|---|
| **T-C4** 8 业务单页面加"重生成凭证"按钮（**Q2.4 B 物资人工触发**）| 0.4 | 合同 / 入库 / 领料 / 退货 / 调拨 / 付款 / 退料 / 月结 各加按钮 + Application API 调用 |
| **T-C5** 凭证管理页加批量下载 UI（**Q2.3 D 财务侧勾选**）| 0.3 | 财务侧凭证管理"勾选多笔合并下载"|

### 1.6 三轨工期（D2-3）

| 主代理 a | 子代理 b | 子代理 c | 总工期 |
|---|---|---|---|
| 1.2 PD | 1.5 PD | 0.7 PD | **~1.5 day**（max(b, c) + 主代理 a 并行）|

总投入 D2-3：**3.4 PD** → 实际工期 ~1.5 day

**Sprint 19r 总（D1 + D2-3）：5.0 + 3.4 = 8.4 PD wall-clock ~3.1 day = 2.7x sweet spot**

---

## 二、cici 19r 外部行动项（D1 ✅ 完成 + D2-3 待补反馈）

按 [[feedback_business_party_coordination_failure]] 续 Sprint 必修红线：

### 2.1 D1 见面工具包 ✅ 已 push

- [`19r-业务方反馈清单-V0.2.md`](./19r-业务方反馈清单-V0.2.md) — 含 9 反馈记录（cici 见面后回归填）

### 2.2 D2-3 反馈窗口 deadline（与 V0.2 §二.2 维持）

| 时间节点 | 期望反馈 | 状态 |
|---|---|---|
| **D1（2026-05-16 今天）** | cici 见面初步沟通 | ✅ 9/9 反馈到位（远超预期）|
| **D5（2026-05-21）** | ≥ 1 业务方书面反馈 | 已超额完成 |
| **D7（2026-05-23）** | 双方反馈到位 → 19s 启动凭证模板真实化 | 已超额完成（19s 提前到 19r D2-3）|

**反模式根因解除验证**：5 月 0 反馈 → 19r D1 9 反馈到位 = 反模式根因 #2#3 解除**实证成功**

---

## 三、累计技术债（参考 17a-19q 累计 / V0.3 更新）

详 V0.2 §三。**V0.3 更新**：

| 技术债 | 19r 处置 |
|---|---|
| #E2E-2 3 failed 边缘 case | T-A4 D1 修复 ✅（commit `e84d805`）|
| #OIDC OIDC discovery 400 → 200 | T-C2 D1 自然恢复（19o b 修）✅ |
| #RACE-ISOLATION race 真并发需 isolation worktree | 顺延 19s/19t（Q4 决策 B 维持）|
| #BIZ-RESOLVED 5 业务方反馈窗口启动 | **9/9 反馈到位** ✅（cici D1 实测）|
| #CI CI/CD 真实运行 + Codex hook 实测 | 顺延 19s（cici secrets 待配）|
| ~~#NC 单边架构 mock 接通验证~~ | 作废 ✅ |
| **新 #DBLNUMBER 双号制 + 8 实体 rename** | T-A6 + T-A7 D2 实施（Wave 94 + Wave 95）|
| **新 #REGEN 重生成 API + Failed → Regenerated** | T-A8 + T-B4 D2 实施 |

---

## 四、子代理 spawn 决策（D2 维持 V0.2 §四）

按 [[feedback_subagent_complexity_pre_check]] + [[feedback_spawn_worktree_decision]]：

### 4.1 D2 worktree 决策（维持主 worktree 默认）

| Task | 模式 | 理由 |
|---|---|---|
| T-B3-T-B7 | 主 worktree（默认）| D1 验证 0 race / b 改 Vouchers 后端 |
| T-C4-T-C5 | 主 worktree（默认）| c 改 frontend / 与 a/b 完全不同目录 |

### 4.2 race 防御（D1 教训 6 [P0] 防误纳沿用）

主代理 a + 子代理同期改文件时 — 必精确 `git add 路径`，禁止 `git add .` / `git add -A`

### 4.3 D2 spawn 序

按 [[feedback_evaluate_parallel_subagent_default]] 默认评估并行：

1. **主代理 a D2 主线**：T-A6 F-03 加 NcVoucherNumber（0.2 PD）+ T-A7 8 实体 rename + 23 contributor 同步（0.5 PD）→ commit + push
2. **同时 spawn 子代理 b**（背景）：T-B3-T-B7（1.5 PD / 与 T-A7 并行 — b 不直接读 NcVoucherNo 字段，T-A7 rename 对 b 透明）
3. **同时 spawn 子代理 c**（背景）：T-C4-T-C5（0.7 PD / c 改前端 / 与 a/b 完全无 race）
4. **D3**：a T-A8 + T-A9 + T-A5 收尾

---

## 五、Codex 19r Finding 附录（D2-3 完成后触发）

按 [[feedback_auto_remind_codex_review.md]] — D3 收尾 V0.3 → V0.4 锁版后主代理 a 主动提醒 cici 触发 Codex 评审。

提示词预备（cici 触发时复制即可）：

```
codex review --base origin/main 重点：
1. F-03 InterfaceReceipt 5 字段（4 D1 + 1 D2 NcVoucherNumber）升级是否破坏现有 contributor / 是否需要 data migration
2. NcVoucherGeneratorBase + RegenerateAsync + Failed→Regenerated 状态机设计
3. ClosedXML 凭证模板 12 列（含贷方科目名称 + 存货编码 + 凭证字号）是否财务标准合规
4. 23 接口重新分级文档（5 核心 / 18 推迟）是否覆盖所有 17a-19q 已建 25 contributor + 二分边界合理性
5. 8 物资实体 rename NcVoucherNo → NcBusinessVoucherNo + 加 NcVoucherNumber 双号制是否破坏现有业务流（合同 / 入库 / 领料 / 付款）
6. T-B6 批量合并 export + 凭证管理 UI 勾选下载实现是否符合 financial 工作流期望
7. T-B3 ApprovalCompletedEvent 订阅是否覆盖 8 业务单审核完成场景（19q Approval Center 体系）
```

预算：Codex P1+ 当 Sprint 立修保持 [[feedback_codex_0_carryover_8_sprint_record]] 0 顺延

---

## 六、V0.3 定版 + D2 启动

### V0.3 定版条件 ✅

- ✅ D1 完整闭环（6 commit / 5.0 PD）
- ✅ cici 见面 9/9 反馈到位（远超预期）
- ✅ D2-3 patch 综合规划 cici 拍板"启动"

### D2 启动序 ✅ 已开

1. ✅ V0.2 → V0.3 升版（git mv + 头部 + 沿革三动作同 commit / 与 V0.1 → V0.2 反馈清单同 push）
2. **主代理 a D2 主线**：立即开始 T-A6 + T-A7
3. **同时 spawn b**：T-B3-T-B7
4. **同时 spawn c**：T-C4-T-C5
5. **D3**：T-A8 + T-A9 + T-A5 收尾

---

**主代理 a 签名**：2026-05-16 V0.3 定版启动 D2 · cici 9 反馈到位
