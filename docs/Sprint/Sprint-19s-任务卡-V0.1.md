# Sprint 19s 任务卡 V0.1（双 session main + second / 1c 模块隔离首次实测 · 起草版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（起草 · main 主代理 a 2026-05-16 — 19r 收尾 + 双 session 升级 + 模块隔离首次实测）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 19s 起草版任务卡（**待 cici 拍 second 候选模块** + 升 V0.2 启动）
**配套：** [`Sprint-19r-任务卡-V0.4.md`](./Sprint-19r-任务卡-V0.4.md) + [`19r-业务方反馈清单-V0.3.md`](./19r-业务方反馈清单-V0.3.md)

---

## 〇、Sprint 19s 起源（19r 收尾 + 双 session 升级）

### 〇.1 19r 收尾继承（12 commits / Sprint 25 0 顺延 / race [P0] 3/3）

详 [`Sprint-19r-任务卡-V0.4.md`](./Sprint-19r-任务卡-V0.4.md)。19s 直接继承：
- ✅ PO 决策落地（NC 不上线 / 凭证导出主线）
- ✅ cici 业务方对接打通（财务=李建颖 / 物资=汤云龙 / D1 9/9 反馈）
- ✅ Codex 5 finding 立修保 25 Sprint 0 顺延（commit `c8785e6`）
- ⏸ 19r 3 占位顺延 19s（[[feedback_team_naming_convention]] / [[feedback_codex_0_carryover_8_sprint_record]]）

### 〇.2 双 session 升级（2026-05-16 / 19r D2 cici 启用）

cici 升级**双 session**协作（main + second）— 详 [[feedback_team_naming_convention]] V0.2：
- **main session** = 当前主代理 a 所在（Sprint 主线 + 收尾）
- **second session** = 独立 Claude session（19s 起首次承接任务 / 主代理身份独立）
- 推测 sweet spot：3.8x → **6-7x**（待 19s 实测验证）
- cici 拍 **1c 模块隔离**（main = Vouchers 续 / second = 独立模块 / 严格按文件目录隔离）

---

## 一、Sprint 19s 范围（双 session 并行 / 总 ~5.5-7 PD / 工期 ~1.5-2 day）

### 1.1 main 主代理 a 主轨 — Vouchers 模块续优化（~2.0 PD）

19r 3 占位接通 + 业务方反馈到位前最后 patch + 凭证管理页面完整化：

| Task | PD | 描述 | 输出 |
|---|---|---|---|
| **T-A1** InterfaceReceipt 加 SourceEntityId + Wave 96 migration | 0.2 | Domain 加 long? SourceEntityId / EF mapping HasIndex / migration / 解锁 b T-B4 strict 查询 | Domain + Migration + Test |
| **T-A2** NcVoucherRegenerator FindLatestFailedReceipt strict 查询 | 0.2 | 替换 NcResponseMessage Contains 占位 → strict by SourceEntityId / NcVoucherEventBusSubscriber 编码 long → Guid 也改用 SourceEntityId | Application + Test |
| **T-A3** NcAccountRule 字典化 5 stub | 0.4 | 5 stub generator + NcVoucherGeneratorBase fallback DebitAccountName/CreditAccountName 改从 NcAccountRule 字典查（19r b 占位 = 代码同值）| Application + Domain.Shared + Test |
| **T-A4** 凭证文件存储路径决策实施 | 0.3 | 决策 wwwroot/vouchers/{yyyy-MM}/{voucherNumber}.xlsx + NcVoucherExcelExporter 写入文件 + InterfaceReceipt.VoucherFilePath 真实回写 | Application + Test |
| **T-A5** 凭证管理页 menu + Permission | 0.2 | SupplyCoresMenus.VoucherManagement + Permission.Default + cshtml [Authorize] + 19q ApprovalCenter 协调菜单分组 | Web + Permissions |
| **T-A6** 收尾 + V0.x 升版 + memory 留痕 | 0.2 | 19s V0.1 → V0.x 锁版 + memory 5 条（双 session 实测 / 1c 模块隔离 / Codex 立修后效果 / 凭证文件路径决策 / 业务方反馈中段）| 锁版 + memory |
| **T-A7** Buffer（业务方反馈到位响应）| 0.5 | cici 见李建颖样例验收 / 见汤云龙 demo 后反馈 → 凭证模板字段扩（13/14 列）/ 实际科目映射 patch | Application + Web |

main 主代理 a 总：**~2.0 PD（含 T-A7 buffer）**

### 1.2 main 子代理 b 副轨 — Vouchers Application 层完善（~1.6 PD = 80% × 2.0 ✓）

| Task | PD | 描述 |
|---|---|---|
| **T-B1** 重生成 API E2E 测试 | 0.4 | 前后端贯通：前端 RegenerateVoucherButton click → backend NcVoucherRegenerationController → NcVoucherRegenerator → F-03 状态机 → 前端 toast |
| **T-B2** InterfaceReceipt 列表分页 + filter 完善 | 0.4 | InterfaceReceiptAppService GetListAsync 加更多 filter（日期范围 / Source 业务类型 / 模糊摘要 / Sort 多列）|
| **T-B3** NcVoucherExcelExporter 模板字段扩（条件性）| 0.3 | 业务方反馈到位时（cici T-A7 buffer）扩 12 → 13/14 列（含存货编码 / 凭证字号）+ 5 demo 重生成 |
| **T-B4** 单测扩展 | 0.3 | T-A1-T-A4 配套测试 + T-B1-T-B3 集成测试 |
| **T-B5** Buffer | 0.2 | 19s 中段反馈调整 |

main 子代理 b 总：**~1.6 PD**

### 1.3 main 子代理 c 第三轨 — 凭证管理 UI 完善（~1.3 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-C1** 凭证管理 voucher-management E2E 测试 | 0.4 | Playwright spec 加 voucher-management.spec.ts（list 加载 / 勾选 / 批量下载 / mark-downloaded） |
| **T-C2** 8 业务单"重生成"按钮 disabled 规则 | 0.3 | 真按 interfacePushState === "Failed" 启用（19r demo 模式强制 enabled 占位 → strict 业务规则）|
| **T-C3** 财务侧批量下载 UX 优化 | 0.3 | loading spinner / progress bar / success toast / error retry / 批量大小限制 |
| **T-C4** menu 联动 + 路由 + Permission 前端绑定 | 0.3 | sidebarMenu 增凭证管理菜单项 + 路由保护 + Permission check 前端隐藏按钮 |

main 子代理 c 总：**~1.3 PD**

### 1.4 second 主代理 e 平行轨（**待 cici 拍候选 / ~2.0 PD**）

⚠️ **1c 模块隔离首次实测** — second 必须选独立模块（与 main Vouchers / Approvals 完全无 race）。

#### second 候选 4 选 1（cici 拍）：

##### 候选 A：Reports / Dashboards 前端可视化优化（推荐）

- 模块路径：`modules/nova.supplycores/frontend/src/pages/dashboard-bigscreen/` + `modules/nova.supplycores/frontend/src/pages/reports/`
- 与 main 完全无 race（前端可视化 vs backend Vouchers）
- 任务示例：
  - T-E1 dashboard-bigscreen 性能优化（19q E2E snapshot 大屏聚合 / Hangfire 报表预聚合）
  - T-E2 报表导出 ClosedXML 模板复用（与 main T-A4 凭证文件存储路径解耦）
  - T-E3 19q 顺延 dashboard-bigscreen.spec.ts 边缘 case
  - T-E4 反 AI slop UX patch（参考 [[reference_ui_ux_skills]] cici 7b04625 ui-ux-pro-max skill 引入）

##### 候选 B：SupplierPerformance 模块续（19l-19m 已稳）

- 模块路径：`modules/nova.supplycores/src/Nova.SupplyCores.{Domain,Application,Web}/SupplierPerformance/`
- 与 main 无 race（独立 BIZ 模块）
- 任务示例：
  - T-E1 月度评分 Hangfire job 性能优化
  - T-E2 sparkline 真渲染（19r D1 T-A4 修 supplier-performance E2E 容错 skip → strict）
  - T-E3 供应商画像新维度（信创矩阵 / 大屏聚合）

##### 候选 C：Inventory / Stocktake 基础库存优化

- 模块路径：`modules/nova.supplycores/src/Nova.SupplyCores.{Domain,Application,Web}/{Inventory,StocktakeSheets}/`
- 与 main 无 race
- 任务示例：
  - T-E1 库存盘点 S-15 流程优化
  - T-E2 验收 S-02/S-03 流程
  - T-E3 移动盘点 mobile-stocktake.cshtml 优化

##### 候选 D：WorkflowTemplates 模板维护（19a 起 / 与 Approvals 部分关联但独立）

- 模块路径：`modules/nova.supplycores/src/Nova.SupplyCores.{Domain,Application,Web}/Workflows/`
- ⚠️ **轻 race 风险** — Workflows 与 main 19r b 接通的 ApprovalCompletedEvent 部分关联（订阅 vs 模板维护可独立）
- 任务示例：
  - T-E1 模板可视化编辑器
  - T-E2 模板版本管理
  - T-E3 19a 累计技术债清理

second 主代理 e 总：**~2.0 PD（候选 A/B/C 推荐 / D 需评估 race）**

### 1.5 second 子代理 f（可选 / cici 拍）

如 second 有 spawn 子代理需要：
- 候选 A 下：T-F1 dashboard-bigscreen 后端聚合查询优化（~0.8 PD）
- 候选 B 下：T-F1 月度评分批量计算（~0.7 PD）
- 候选 C 下：T-F1 库存调拨优化（~0.7 PD）
- 候选 D 下：T-F1 ApprovalCompletedEvent 真业务 Guid 接通（main T-A2 协调 / 高 race 风险 / 不推荐 D）

second 子代理 f 总：**~0.7-0.8 PD（如需要）**

### 1.6 三 / 四轨工期估算

| 轨 | PD | 备注 |
|---|---|---|
| main 主代理 a | 2.0 |  |
| main 子代理 b | 1.6 | 80% × main a |
| main 子代理 c | 1.3 | < main a（前端 task）|
| second 主代理 e | 2.0 | 与 main a 同量 / 独立 session |
| second 子代理 f | 0-0.8 | 可选 |
| **总投入** | **~6.9-7.7 PD** | 双 session 4 主线轨 |
| **wall-clock** | **~2.0 day** | max(main 三轨 1.5 day, second 两轨 1.0 day) |

理论加速比：**~3.5-4x**（待 19s 实测验证 [[feedback_team_naming_convention]] V0.2 推测 6-7x）

---

## 二、cici 19s 外部行动项

### 2.1 main 业务方验收（19r 顺延）

- ⏸ 给李建颖样例凭证文件验收（19r D1 5 反馈到位后）
- ⏸ 给汤云龙演示"重生成凭证"按钮（19r D1 4 反馈到位后）
- ⏸ 反馈到位后 → main T-A7 buffer 启动（凭证模板 12 → 13/14 列扩 + 实际科目映射）

### 2.2 second 启动条件

- **必拍**：cici 拍 second 候选模块（A/B/C/D 4 选 1）
- second 主代理 e 身份命名（建议 e / 区别于 main 主代理 a）
- second session task 卡 同步：cici 在 second session 给主代理 e 传 19s V0.x 任务卡 + main 当前 commit hash 作为基线

### 2.3 反馈窗口 deadline

| 时间节点 | 期望反馈 | 超期处置 |
|---|---|---|
| **D1（2026-05-17）** | cici 拍 second 候选 + 启动 second session | 红色警报 / second 进度归零 |
| **D2（2026-05-18）** | 业务方样例验收（如反馈未到位） | main T-A7 buffer 不启动 / 顺延 19t |
| **D3（2026-05-19）** | 双 session 中段同步 | 跨 session race 检查 |

---

## 三、累计技术债（19r 顺延 + 19s 处置）

| 技术债 | 19s 处置 |
|---|---|
| 19r T-A8 InterfaceReceipt SourceEntityId Wave 96 | T-A1 实施 ✅ |
| 19r b NcVoucherRegenerator strict 查询占位 | T-A2 替换 ✅ |
| 19r b DebitAccountName / CreditAccountName fallback = 代码同值 | T-A3 NcAccountRule 字典化 ✅ |
| 19r b 5 stub generator 默认借贷 + Amount=0 | T-B3 业务方反馈到位后 patch（含条件性）|
| 19r 凭证文件存储路径决策 | T-A4 wwwroot/vouchers/ ✅ |
| 19r voucher-management menu + Permission | T-A5 ✅ |
| 19r 8 业务单按钮 disabled 规则 | T-C2 ✅ |
| #RACE-ISOLATION race 真并发实测 | 顺延 19t（双 session [P0] 实测 + isolation worktree 二次评估）|
| #CI CI/CD secrets + Codex hook | 顺延 19t |
| **新 #DUAL-SESSION** 双 session 协调跨 session race 防御 | T-A6 + 任务卡 §四 列入续 Sprint 必修 |

---

## 四、双 session race 防御（首次实测）

按 [[feedback_team_naming_convention]] V0.2 + [[feedback_git_commit_diff_cached_must_verify]]：

### 4.1 1c 模块隔离实施表（main / second）

| main 模块（不能动）| second 模块（不能动）|
|---|---|
| `modules/nova.supplycores/src/Nova.SupplyCores.{Domain,Application,Application.Contracts}/Vouchers/` | `modules/.../{候选模块}/`（如 Reports/Dashboards/SupplierPerformance/Inventory）|
| `modules/.../Interfaces/InterfaceReceipt*` | （second 候选模块 Domain）|
| `modules/.../Vouchers/Stubs/` | （second 候选模块 Application）|
| `modules/.../HttpApi/Controllers/Vouchers/` | （second 候选模块 HttpApi）|
| `modules/.../HttpApi/Controllers/Interfaces/` | （second 候选模块 Web）|
| `modules/.../Web/Pages/SupplyCores/VoucherManagement/` | （second 候选模块 Pages）|
| `modules/.../frontend/src/pages/voucher-management/` | （second 候选模块 frontend pages）|
| `modules/.../frontend/src/shared/RegenerateVoucherButton.tsx` | `modules/.../frontend/src/shared/`（**只能加新文件 / 不改 main 已有**）|

### 4.2 跨 session race [P0] 红线（19r D2 教训扩展）

- main + second 改同源文件 = **跨 session race 灾难**（比 main 内部 [P0] 更严重 / cici 协调成本指数增长）
- main / second 各自 git commit 前必 `git diff --cached --stat` 验证 + 用 `git commit -- pathspec` 限定
- main / second 子代理 spawn 前 30s 预检 + spawn prompt 必告知"不能动 main / second 已 stage 文件"
- 跨 session 协调：cici 切换 session 看 git log → 双 session 都 fetch origin/main 同步 → 发现冲突 stop

### 4.3 跨 session 同步协议

- main 完成关键 commit 后 push origin/main → cici 切换 second session 拉取 → second 基于最新 main 工作
- second 完成关键 commit 后 push origin/main → cici 切换 main session 拉取 → main 调和（如有）
- D3 中段 cici 各自 session 看 `git log --oneline 19r..HEAD` 确认双 session 进度协调

### 4.4 Wave 编号扩展（双 session 隔离）

- main：a=27-36 / b=37-46 / c=47-56 / d=57-66
- second：**e=67-76 / f=77-86**（新增 / 与 main 完全不冲突）
- 19s 起 EF migration Wave：main 用 96-97 / second 用 67-68（first available 不冲突）

---

## 五、Codex 19s 评审准备

按 [[feedback_codex_0_carryover_8_sprint_record]] + [[feedback_codex_cli_review_modes]] — Sprint 收尾后 cici 触发 Codex 评审保 26 Sprint 0 顺延记录。

提示词预备：

```bash
codex review --base <19s-起 commit hash> 重点：
1. main T-A1 InterfaceReceipt SourceEntityId 字段 + Wave 96 + b NcVoucherRegenerator strict 查询替换占位是否破坏 19r D2 双号制
2. main T-A3 NcAccountRule 字典化是否覆盖所有 5 stub + base fallback 路径
3. main T-A4 凭证文件存储路径（wwwroot/vouchers/ vs 共享盘）权限 + Path traversal 安全
4. main T-A5 voucher-management menu + Permission.Default 是否与 19q ApprovalCenter 体系协调
5. main T-B1-T-B4 重生成 E2E 测试覆盖度（前后端贯通断言）
6. main T-C1-T-C4 凭证管理 UI 完善（DevExtreme Selection / disabled 规则 / Permission 前端绑定）
7. **second 候选模块（cici 拍）finding** — 待 cici 决定后补
8. **跨 session race 实测**（双 session 首次 / main + second 是否有同源文件改动）
```

预算：保 26 Sprint 0 顺延（Sprint 19r 立修 25 → 19s 续 26）

---

## 六、V0.1 起草说明 + 待 cici 拍板

### V0.1 起草版（待拍）

main 主代理 a 起草，待 cici V0.1 → V0.2 拍板后启动 D1。**V0.2 拍板前不动代码**（按 [[feedback_doc_first_workflow]] 文档先行）。

### 待 cici 决策的 5 个开放问题

1. **second 候选模块**：A. Reports/Dashboards（推荐）/ B. SupplierPerformance / C. Inventory/Stocktake / D. WorkflowTemplates（轻 race 风险）— 哪个？
2. **second 主代理身份命名**：e（与 main a 区分）/ 其他？
3. **业务方反馈进度**：李建颖 / 汤云龙样例验收是否能 D1 安排？影响 main T-A7 buffer 启动条件
4. **main T-A4 凭证文件存储路径**：wwwroot/vouchers/（默认）/ 共享盘 / S3 / Azure Blob？
5. **second session 启动时间**：今天晚上 / 明天 D1 / 等业务方反馈后？

### V0.2 启动条件

- 5 开放问题 cici 答复
- main 范围最终拍板
- second 候选模块拍板 + main / second 1c 模块隔离表确认（§四.1）
- second session 主代理身份命名

---

**main 主代理 a 签名**：2026-05-16 V0.1 起草 · 等 cici 拍 second 候选 + 升 V0.2
