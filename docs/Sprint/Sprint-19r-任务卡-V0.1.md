# Sprint 19r 任务卡 V0.1（PO 凭证导出主线 + 19q 顺延 · 起草版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（起草 · 主代理 a 2026-05-16 — 2026-05-16 PO 会议两条决策落地：NC 暂不上线/凭证导出 + 对接人明确 李建颖/汤云龙）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 19r 起草版任务卡（待 cici 拍板升 V0.2 启动）
**配套：** [`Sprint-19q-任务卡-V0.4.md`](./Sprint-19q-任务卡-V0.4.md) + [`Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md`](../详细设计/Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md) + [`19q-PO-协调-NC业务方反馈清单-V0.1.md`](./19q-PO-协调-NC业务方反馈清单-V0.1.md)

---

## 〇、Sprint 19r 起源（2026-05-16 PO 会议两条关键决策）

PO 会议直接重塑 17a-19q 17 Sprint NC 接入路径：

### 决策 1：NC 暂不上线 → 预留接口 + 凭证导出

- NC ERP 系统**短期内不会上线**
- SupplyCores NC 接口定位调整：**预留接口** + **生成凭证文件**
- 凭证形态：交给财务人员，由他们**手动录入** OR **批量导入** NC（待 NC 上线后）
- 不需要真实 HTTPS POST / OAuth2 token / NC API 调用
- **17a-19q 已建的 mock client / Polly / OAuth2 service 全部保留为"NC 上线后启用"备件**

### 决策 2：业务方对接人明确（5 月反模式根因 #2#3 解除）

- **财务对接人**：李建颖
- **物资对接负责人**：汤云龙
- 对接渠道首次正式化（17a-19n 5 月 0 反馈反模式根因消除）

### 派生影响

| 17a-19q 旧主线 | 19r+ 新主线 |
|---|---|
| 单边架构（mock client / OAuth2 / Polly / WireMock chaos）等业务方反馈 swap mock→real | **凭证文件生成器 + 财务导入格式 spec** |
| 23 接口对等推进 | 23 接口**重新分级**：5 财务核心凭证 / 18 仅 Schema 占位 |
| race / WireMock chaos / 接通真实性演练 | **停止投入**，资源转向凭证生成器 + F-03 留痕扩展 |
| 业务方反馈 0 → "等不到" | 反馈窗口 deadline 化（≤ 2 Sprint），对接人明确 |

---

## 一、Sprint 19r 范围（V0.1 草案 / 三轨并行 / 总 ~5.2 PD）

### 1.1 主代理 a 主轨 — 重新分级 + F-03 升级 + 业务方清单（~2.0 PD）

| Task | PD | 描述 | 输出 |
|---|---|---|---|
| **T-A1** 23 接口重新分级 V0.1 | 0.6 | 起草 `Sprint-19r-NC接口重新分级-V0.1.md`（5 财务核心 vs 18 推迟）+ 每接口标注"财务必收" / "可推迟" / "凭证文件 vs 仅 Schema 占位" | `docs/详细设计/Sprint-19r-NC接口重新分级-V0.1.md` |
| **T-A2** F-03 InterfaceReceipt 升级支持凭证文件留痕 | 0.5 | Domain 实体 `InterfaceReceipt.cs` 加 4 字段：`VoucherFilePath` / `VoucherFileHash` / `VoucherDownloadStatus`（Generated/Downloaded/ImportedToNc）/ `VoucherDownloadTime` + EF Core migration | Domain + Migration + Test |
| **T-A3** 业务方反馈清单 V0.1（李 + 汤） | 0.4 | 起草 `19r-业务方反馈清单-V0.1.md` — 财务问题（凭证导入格式 / 必填字段 / 频次） + 物资问题（NcVoucherNo 命名 / 触发时机 / 批量节奏）+ 反馈窗口 deadline | `docs/Sprint/19r-业务方反馈清单-V0.1.md` |
| **T-A4** 19q E2E 3 failed 边缘 case 修复 | 0.3 | nc-interface 场景 2 / rbac 场景 2 / supplier-performance SVG 各 0.1 PD | E2E 全量 → 95%+ |
| **T-A5** Sprint 收尾 + memory 留痕 + push V0.x 升版 | 0.2 | V0.1 → V0.2 → V0.3 收尾锁版 + 跨 session memory 5 条 | 锁版任务卡 + memory |

主代理 a 总 PD：**2.0 PD**（V0.2 预算上限）

### 1.2 子代理 b 副轨 — 凭证生成器框架 + Excel 导出（~1.6 PD = 80% × 2.0 ✓ [[feedback_subagent_workload_calibration]]）

| Task | PD | 描述 | 输出 |
|---|---|---|---|
| **T-B1** 凭证生成器框架骨架 | 1.0 | Application 层 `INcVoucherGenerator` interface + `NcVoucherGeneratorBase` 基类 + 5 核心接口 generator stub（MD-001 物料对照 / MD-004 成本中心 / BIZ-001 采购入库 / BIZ-005 领料出库 / BIZ-005A 对厂矿销售） + 触发器（基于已有合同/入库/付款业务流事件订阅） | Application + 5 stub + Test |
| **T-B2** 凭证文件 Excel 导出基础 | 0.6 | 用 MiniExcel（Catio 默认 / [[reference_team_tech_stack]]）+ 财务标准凭证 Excel 模板（科目 / 借贷 / 金额 / 摘要 / 凭证号占位 / 日期）+ 5 核心接口各 1 demo 凭证文件输出 | MiniExcel + 5 demo |

子代理 b 总 PD：**1.6 PD**（spawn 主 worktree 串行化 / [[feedback_spawn_worktree_decision]]）

### 1.3 子代理 c 第三轨 — race 真并发 + OIDC + 契约测试（~1.6 PD）

| Task | PD | 描述 | 输出 |
|---|---|---|---|
| **T-C1** race [P0] line-level 真并发实测（isolation worktree） | 0.8 | 19q 顺延 — Agent tool spawn 用 `isolation: "worktree"` 创建独立 worktree（[[feedback_spawn_worktree_decision]]）+ 两 worktree commit + push 时机重叠 + 验证教训 6 [P0] 精确 add 防误纳 + 教训 7 [P0] 4 步自检 + 修复成本（[P0] 证据链 2/3 → 3/3） | AGENTS V1.7 → V1.8 |
| **T-C2** OIDC discovery 400 → 200 修复 | 0.4 | 19q 顺延 — `/.well-known/openid-configuration` 返 400 → 200 + Issuer / Endpoints 完整 + smoke test | OIDC + Test |
| **T-C3** BIZ-001 / BIZ-005 凭证 contract 测试 | 0.4 | 5 核心接口的前 2 个验证凭证字段完整性（基于 T-B1 stub）+ Schema-compliant + 财务必填字段不漏 | 2 contract test |

子代理 c 总 PD：**1.6 PD**（worktree decision：T-C1 必须 isolation / T-C2/T-C3 主 worktree）

### 1.4 三轨工期估算

| 主代理 a | 子代理 b | 子代理 c | 总实际工期 |
|---|---|---|---|
| 2.0 PD | 1.6 PD | 1.6 PD | **~2.5 day**（按主代理 a 单线程 0.8 PD/day 节奏 / [[feedback_sweet_spot_4_sprint_validation]]） |

总投入 **5.2 PD** → 实际工期 **~2.5 day**（理论加速比 ~2.1x，sweet spot 范围 / [[feedback_sweet_spot_4_sprint_validation]]）

---

## 二、cici 19r 外部行动项（必修 / 不能等）

按 [[feedback_business_party_coordination_failure]] 续 Sprint 必修红线 — PO 会议已开 / 对接人已明确，cici **必须**在 Sprint 19r 内启动对接：

### 2.1 财务方李建颖对接（D1-D3）

用 T-A3 输出的反馈清单问 5 问题：

1. **凭证导入格式**：NC 标准凭证导入模板？Excel？CSV？专属格式？（拿一个样例文件最优）
2. **必填字段**：科目 / 借贷方 / 金额 / 摘要 / 凭证日期 / 制单人 / 附件号 / 部门 / 项目 — 哪些必填？
3. **频次**：实时（每笔业务触发）/ 日终批量 / 月结批量？
4. **凭证号生成**：NC 自动生成 vs SupplyCores 预生成给 NC？
5. **失败处理**：导入失败回滚？人工修订？

### 2.2 物资方汤云龙对接（D1-D3）

用 T-A3 输出的反馈清单问 4 问题：

1. **NcVoucherNo 字段命名**：物资侧 8+ 实体的字段命名是否统一？（当前已用 `NcVoucherNo`）
2. **触发时机**：业务单确认即触发？审核后？还是月结时批量？
3. **批量节奏**：单条 vs 批量？批量阈值（条数 / 时间窗口）？
4. **重推规则**：财务导入失败后是否需要 SupplyCores 重新生成？

### 2.3 反馈窗口 deadline

- **D5（2026-05-21）前** ≥ 1 业务方初步反馈到位
- **D7（2026-05-23）前** 双方反馈到位 → 19s 启动凭证模板真实化
- **超期**：升级 PO + 启动单边凭证占位（5 默认模板）

---

## 三、累计技术债（参考 17a-19q 累计 / V0.1 起草）

详 19q V0.4 §四。**19r 处置**：

| 技术债 | 19r 处置 |
|---|---|
| #E2E-2 3 failed 边缘 case | T-A4 修复 ✓ |
| #OIDC OIDC discovery 400 → 200 | T-C2 修复 ✓ |
| #RACE-ISOLATION race 真并发需 isolation worktree | T-C1 实施 ✓（[P0] 证据链 3/3） |
| #BIZ-RESOLVED 5 业务方反馈窗口启动 | **PO 已介入 + 对接人明确**（决策 1+2 落地）→ §二 cici 19r 内对接 |
| #CI CI/CD 真实运行 + Codex hook 实测 | 顺延 19s（cici secrets 待配） |
| ~~#NC 单边架构 mock 接通验证~~ | **作废**（PO 决策 1：NC 不上线，转凭证导出主线） |

---

## 四、子代理 spawn 决策（必读）

按 [[feedback_subagent_complexity_pre_check]] + [[feedback_spawn_worktree_decision]]：

### 4.1 spawn 前 30s 预检（每子代理）

- T-B1：grep `INcInterfaceClient` / `NcInterfaceMockClient` 确认现有 Application 层结构 → 估真实工作量
- T-B2：grep `MiniExcel` 在仓内是否已引用（Catio 默认 / 19q 之前可能未在 SupplyCores 引入）→ 决定是否含 NuGet 引入
- T-C1：必读 19q V0.4 §二.1 race spawn 主 worktree 行为发现 → 不要重蹈覆辙

### 4.2 worktree 决策

| Task | 模式 | 理由 |
|---|---|---|
| T-B1 / T-B2 | 主 worktree（默认） | 串行化无 race / 19q 实测安全 |
| T-C1 | **isolation: "worktree"** | race 真并发实测必需，[[feedback_spawn_worktree_decision]] |
| T-C2 / T-C3 | 主 worktree | 单点修复 + 契约测试无并发 |

### 4.3 race 防御（19q 教训 6 [P0] 防误纳传承）

主代理 a + 子代理同期改文件时 — 必精确 `git add 路径`，禁止 `git add .` / `git add -A`（19q working tree 残留教训）

---

## 五、Codex 19r Finding 附录（占位 · 待 cici 触发评审）

按 [[feedback_auto_remind_codex_review.md]] — Sprint 收尾 D5 主代理 a 主动提醒 cici 触发 Codex 评审。

提示词预备（cici 触发时复制即可）：

```
codex review --base origin/main 重点：
1. F-03 InterfaceReceipt 4 字段升级是否破坏现有 contributor / 是否需要 data migration
2. NcVoucherGeneratorBase 抽象设计是否过度（5 stub 是否真共享逻辑 vs 各自实现）
3. MiniExcel 凭证模板是否财务标准合规（科目 / 借贷 / 金额格式）
4. T-C1 race isolation worktree 真并发实测是否捕获 [P0] 证据
5. 23 接口重新分级文档是否覆盖所有 17a-19q 已建 23 contributor
```

预算：Codex P1+ 当 Sprint 立修保持 [[feedback_codex_0_carryover_8_sprint_record]] 0 顺延（19q 首次 P1 立修成功 → 19r 续）

---

## 六、起草说明 + 待 cici 拍板事项

### V0.1 起草版（待拍）

主代理 a 起草，待 cici V0.1 → V0.2 拍板后启动 D1。**V0.2 拍板前不动代码** — 按 [[feedback_doc_first_workflow]] 文档先行。

### 待 cici 决策的 5 个开放问题

1. **23 接口重新分级颗粒度**：T-A1 是按"5 核心 vs 18 推迟"二分？还是细分"5 核心 / 8 中优 / 10 低优"三分？
2. **F-03 升级时机**：T-A2 在 19r 升 vs 顺延 19s（等业务方反馈财务标准凭证号格式后再定 schema）？
3. **MiniExcel 引入**：T-B2 默认用 MiniExcel，还是先评估 ClosedXML（[[reference_team_tech_stack]] 复杂样式场景认可）？
4. **T-C1 race [P0] 证据 3/3 优先级**：是否仍按 19q V0.4 §二.4 节奏推进 / 是否因 PO 主线转向降优先级？
5. **业务方反馈 deadline**：D5（≤ 1）/ D7（≥ 2）是否合理 / cici 与李/汤的实际可约时间？

### V0.2 启动条件

- 5 个开放问题 cici 答复
- T-A1/T-A2/T-A3 范围最终拍板
- spawn b/c 启动条件：cici 确认 worktree 决策表（§四.2）

---

**主代理 a 签名**：2026-05-16 V0.1 起草 · 等 cici 拍板
