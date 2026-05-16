# Sprint 19r 任务卡 V0.2（PO 凭证导出主线 + 19q 顺延 · 定版启动）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（定版启动 · 主代理 a 2026-05-16 — cici 5 决策拍板 / 5 月反模式根因 #2#3 解除 / cici D1 今天约见李建颖+汤云龙）
**日期：** 2026-05-16
**文档性质：** 实施层 · Sprint 19r 定版启动任务卡（V0.2 拍板 → 立即启动 D1）
**配套：** [`Sprint-19q-任务卡-V0.4.md`](./Sprint-19q-任务卡-V0.4.md) + [`Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md`](../详细设计/Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md) + [`19r-业务方反馈清单-V0.1.md`](./19r-业务方反馈清单-V0.1.md)（cici 今天约见用）

## 版本沿革

| 版本 | 日期 | 操作 | 描述 |
|---|---|---|---|
| V0.1 | 2026-05-16 | 起草 | PO 会议两条决策落地 + 5 开放问题待 cici 拍板 |
| V0.2 | 2026-05-16 | 定版启动 | cici 5 决策拍板（1A 二分 / 2A 19r 升 F-03 / 3B ClosedXML / 4B race 顺延 19s+ / 5 今天约见）→ 立即启动 D1 |

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
| 23 接口对等推进 | 23 接口**重新分级（二分）**：5 财务核心凭证 / 18 推迟（仅 Schema 占位） |
| race / WireMock chaos / 接通真实性演练 | **停止投入**，资源转向凭证生成器 + F-03 留痕扩展 + 5 接口契约测试 |
| 业务方反馈 0 → "等不到" | 反馈窗口 deadline 化（≤ 2 Sprint），对接人明确，**cici D1 今天约见** |

---

## 一、Sprint 19r 范围（V0.2 定版 / 三轨并行 / 总 ~5.2 PD）

### 1.1 主代理 a 主轨 — 重新分级 + F-03 升级 + 业务方清单（~2.0 PD）

| Task | PD | 描述 | 输出 | 状态 |
|---|---|---|---|---|
| **T-A1** 23 接口重新分级 V0.1（**二分**）| 0.6 | 起草 `Sprint-19r-NC接口重新分级-V0.1.md`（5 财务核心 vs 18 推迟）— 二分（Q1 决策 A）：核心 = MD-001 物料 / MD-004 成本中心 / BIZ-001 采购入库 / BIZ-005 领料出库 / BIZ-005A 对厂矿销售；推迟 = 其余 18 含 BIZ-002~020 + CHK-001~005 | `docs/详细设计/Sprint-19r-NC接口重新分级-V0.1.md` | D1 待启 |
| **T-A2** F-03 InterfaceReceipt 升级支持凭证文件留痕（**19r 升 / Q2 决策 A**）| 0.5 | Domain 实体 `InterfaceReceipt.cs` 加 4 字段：`VoucherFilePath` / `VoucherFileHash` / `VoucherDownloadStatus`（Generated/Downloaded/ImportedToNc/Failed/Regenerated）/ `VoucherDownloadTime` + EF Core migration | Domain + Migration + Test | D2-3 |
| **T-A3** 业务方反馈清单 V0.1（**已紧急产出 ✓**）| 0.4 | `19r-业务方反馈清单-V0.1.md` 已 push（与 V0.2 同 commit） — 财务李建颖 5 问 + 物资汤云龙 4 问 + 反馈窗口 deadline + 见面后填写区 | `docs/Sprint/19r-业务方反馈清单-V0.1.md` ✓ | **D1 ✓ 已完成（cici 可拿走）** |
| **T-A4** 19q E2E 3 failed 边缘 case 修复 | 0.3 | nc-interface 场景 2 / rbac 场景 2 / supplier-performance SVG 各 0.1 PD | E2E 全量 → 95%+ | D2-3 |
| **T-A5** Sprint 收尾 + memory 留痕 + V0.2 → V0.3 锁版 | 0.2 | 收尾锁版 + 跨 session memory 5 条（PO 决策落地 / cici 约见结果 / 19r 实际交付 / 5 月反模式解除验证 / 业务方反馈实际到位率） | 锁版任务卡 + memory | D3 |

主代理 a 总 PD：**2.0 PD**（V0.2 定版预算）

### 1.2 子代理 b 副轨 — 凭证生成器框架 + ClosedXML（~1.6 PD = 80% × 2.0 ✓ [[feedback_subagent_workload_calibration]]）

| Task | PD | 描述 | 输出 |
|---|---|---|---|
| **T-B1** 凭证生成器框架骨架 | 1.0 | Application 层 `INcVoucherGenerator` interface + `NcVoucherGeneratorBase` 基类 + 5 核心接口 generator stub（MD-001 / MD-004 / BIZ-001 / BIZ-005 / BIZ-005A） + 触发器（基于已有合同/入库/付款业务流事件订阅） | Application + 5 stub + Test |
| **T-B2** 凭证文件 **ClosedXML** 导出基础（**Q3 决策 B**） | 0.6 | 用 ClosedXML（[[reference_team_tech_stack]] cici 已认可 D4-2 用过 / 复杂样式 / 单元格控制更友好）+ 财务标准凭证 Excel 模板（科目 / 借贷 / 金额 / 摘要 / 凭证号占位 / 日期 + 合并单元格 / 边框 / 字体）+ 5 核心接口各 1 demo 凭证文件输出 | ClosedXML + 5 demo |

子代理 b 总 PD：**1.6 PD**（spawn 主 worktree 默认 / [[feedback_spawn_worktree_decision]]）

### 1.3 子代理 c 第三轨 — OIDC + 5 接口契约测试（~1.6 PD / **race [P0] 真并发顺延 19s+**）

| Task | PD | 描述 | 输出 |
|---|---|---|---|
| **T-C2** OIDC discovery 400 → 200 修复 | 0.4 | 19q 顺延 — `/.well-known/openid-configuration` 返 400 → 200 + Issuer / Endpoints 完整 + smoke test | OIDC + Test |
| **T-C3'** **5 接口契约测试**（合并原 T-C1 0.8 + 原 T-C3 0.4 = 1.2 PD / **Q4 决策 B**）| 1.2 | 5 核心接口（MD-001 / MD-004 / BIZ-001 / BIZ-005 / BIZ-005A）凭证 contract 测试（基于 T-B1 stub）— 验证凭证字段完整性 / Schema-compliant / 财务必填字段不漏 / 凭证文件可被 Excel 打开 / F-03 留痕字段写入 | 5 contract test |

子代理 c 总 PD：**1.6 PD**（全部主 worktree 默认）

**T-C1 race [P0] line-level 真并发实测顺延 19s/19t**（Q4 决策 B）：PO 主线已转向凭证导出，race [P0] 是治理工具不是业务交付；19h-19q 18 commits 0 race 防御已稳；c 第三轨 0.8 PD 转给 T-C3' 扩展契约测试到 5 接口（更直接服务凭证主线）

### 1.4 三轨工期估算

| 主代理 a | 子代理 b | 子代理 c | 总实际工期 |
|---|---|---|---|
| 2.0 PD（含 T-A3 D1 ✓） | 1.6 PD | 1.6 PD | **~2.5 day**（按主代理 a 单线程 0.8 PD/day 节奏 / [[feedback_sweet_spot_4_sprint_validation]]） |

总投入 **5.2 PD** → 实际工期 **~2.5 day**（理论加速比 ~2.1x，sweet spot 范围）

---

## 二、cici 19r 外部行动项（**D1 今天 ✓ 启动**）

按 [[feedback_business_party_coordination_failure]] 续 Sprint 必修红线 — cici **今天约见李建颖 + 汤云龙**（Q5 决策）：

### 2.1 见面工具包（已 push ✓）

- [`19r-业务方反馈清单-V0.1.md`](./19r-业务方反馈清单-V0.1.md) — 财务 5 问 + 物资 4 问 + 反馈窗口 + 见面后填写区
- 见面后回 SupplyCores 主代理 a 同步反馈结果 → V0.x 升版反映

### 2.2 反馈窗口 deadline

| 时间节点 | 期望反馈 | 超期处置 |
|---|---|---|
| **D1（2026-05-16 今天）** | cici 见面初步沟通 | — |
| **D5（2026-05-21）** | ≥ 1 业务方书面 / 微信反馈到位 | 黄色警报 → 主代理 a 提醒 cici |
| **D7（2026-05-23）** | 双方反馈到位 → 19s 启动凭证模板真实化 | 红色警报 → cici 升级 PO |
| **超 19s（2026-05-30）** | 仍无反馈 | 启动单边凭证占位（5 默认模板）+ PO 升级到上级管理 |

---

## 三、累计技术债（参考 17a-19q 累计 / V0.2 定版）

详 19q V0.4 §四。**19r 处置**：

| 技术债 | 19r 处置 |
|---|---|
| #E2E-2 3 failed 边缘 case | T-A4 修复 ✓ |
| #OIDC OIDC discovery 400 → 200 | T-C2 修复 ✓ |
| #RACE-ISOLATION race 真并发需 isolation worktree | **顺延 19s/19t**（Q4 决策 B：PO 主线转向凭证导出 / 19h-19q 18 commits 0 race 防御已稳 / 现有 [P1] 防御链稳定） |
| #BIZ-RESOLVED 5 业务方反馈窗口启动 | **PO 已介入 + 对接人明确**（决策 1+2 落地）→ §二 cici **D1 今天约见** ✓ |
| #CI CI/CD 真实运行 + Codex hook 实测 | 顺延 19s（cici secrets 待配） |
| ~~#NC 单边架构 mock 接通验证~~ | **作废**（PO 决策 1：NC 不上线，转凭证导出主线） |

---

## 四、子代理 spawn 决策（必读）

按 [[feedback_subagent_complexity_pre_check]] + [[feedback_spawn_worktree_decision]]：

### 4.1 spawn 前 30s 预检（每子代理）

- T-B1：grep `INcInterfaceClient` / `NcInterfaceMockClient` 确认现有 Application 层结构 → 估真实工作量
- T-B2：grep `ClosedXML` 在仓内是否已引用（19q 之前 D4-2 已用 / 大概率已在 NuGet）→ 决定是否含 NuGet 引入
- T-C2：grep `openid-configuration` / `OpenIddict` 配置点
- T-C3'：grep `INcInterfaceContributor` 5 个目标接口（Md001/Md004/Biz001/Biz005/Biz005a）确认 stub 已就绪

### 4.2 worktree 决策（V0.2 简化 — race [P0] 顺延后全部主 worktree）

| Task | 模式 | 理由 |
|---|---|---|
| T-B1 / T-B2 | 主 worktree（默认） | 串行化无 race / 19q 实测安全 |
| T-C2 / T-C3' | 主 worktree（默认） | 单点修复 + 契约测试无并发 |
| ~~T-C1~~ | ~~isolation: "worktree"~~ | **顺延 19s/19t（Q4 决策 B）** |

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
3. ClosedXML 凭证模板是否财务标准合规（科目 / 借贷 / 金额格式 / 合并单元格）
4. 23 接口重新分级文档是否覆盖所有 17a-19q 已建 23 contributor + 二分边界是否合理
5. 5 接口契约测试覆盖度（凭证字段 / Schema / F-03 留痕）
```

预算：Codex P1+ 当 Sprint 立修保持 [[feedback_codex_0_carryover_8_sprint_record]] 0 顺延（19q 首次 P1 立修成功 → 19r 续）

---

## 六、V0.2 定版说明 + D1 启动

### V0.2 定版（cici 5 决策已拍）

- Q1 → A 二分（5 核心 vs 18 推迟）
- Q2 → A 19r 升 F-03（按 V0.1 草案）
- Q3 → B ClosedXML（cici 已认可 D4-2）
- Q4 → B race [P0] 顺延 19s+（PO 主线转向，c 0.8 PD 转 T-C3'）
- Q5 → cici 今天约见李/汤（T-A3 反馈清单已紧急产出 ✓）

### D1 启动序

按 [[feedback_evaluate_parallel_subagent_default]] 默认评估并行：

1. **主代理 a D1 主线**：T-A1 23 接口重新分级 V0.1（0.6 PD）→ 与 b/c spawn 并行
2. **子代理 b spawn**（主 worktree）：T-B1 凭证生成器框架（1.0 PD）+ T-B2 ClosedXML 模板（0.6 PD）= 1.6 PD
3. **子代理 c spawn**（主 worktree）：T-C2 OIDC 修复（0.4 PD）+ T-C3' 5 接口契约（1.2 PD）= 1.6 PD
4. **D2-3**：a T-A2 F-03 升级 + a T-A4 E2E 修复 + 收尾 V0.3 锁版

### 启动条件 ✓

- ✓ cici 5 决策已拍
- ✓ T-A3 业务方反馈清单已紧急产出（cici 今天可拿走）
- ✓ V0.2 定版 push（与 T-A3 同 commit）
- ✓ spawn b/c 决策表确认（§四.2 全部主 worktree）

---

**主代理 a 签名**：2026-05-16 V0.2 定版启动 · D1 立即开工
