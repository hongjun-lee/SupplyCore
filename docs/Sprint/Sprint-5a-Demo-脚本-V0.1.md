# Sprint 5a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** 实施层 · Sprint 5a 验收演示脚本
**配套：** [`Sprint-5a-招投标闭环-任务卡-V0.2.md`](./Sprint-5a-招投标闭环-任务卡-V0.2.md)（D10-3 验收物）
**并行轨道：** 与 Sprint 5b 外委检修专项 平行落地，b 轨道 Demo 见 [`Sprint-5b-Demo-脚本-V0.1.md`](./Sprint-5b-Demo-脚本-V0.1.md)（由 b 输出）

---

## 一、Sprint 5a 落地范围

按 V0.2 锁版 6 决策点，本 Sprint 实际交付 **10 PD / 10 天工作**：

| Day | 交付 | 详设 / commit |
|---|---|---|
| D1-2 | T-08 BidResponse 实体（4 状态 + 16 字段）+ Codex M-1 枚举白名单加固 | 04 V1.2 §4.13a + commit `b18df41` |
| D3-4 | T-09 EvaluationResult 评分明细 + TenderEvaluationAggregator 综合得分聚合（不依赖 IBidResponseAppService 直写 §4.13b 业务规则 4）| 04 V1.2 §4.13b + commit `44bb1af` / `5bbe0bf` |
| D5 | Sprint5a_FullChain_E2E + Codex 二次评审修复（C-4 彻底化 MarkEvaluatedAsync 私化 + sync LINQ 单测兼容）⭐ | commit `9fb706c` / `4ba1245` |
| D6-7 | S-06 PurchaseReturn 采购退货 + NC BIZ-RED 红字接口 stub + 双轨 SubGroupId 钩子 | 06 V1.1 §4.6 + commit `303cd93` |
| D8 | S-09 MaterialIssuance 领料出库 + NC BIZ-005 stub + 防重复打印（PrintHash）| 06 V1.1 §4.9 + commit `946c8b6` |
| D9 | Sprint5aSupplyChain_E2E + 全量回归 ≥ 530 通过 | — |
| D10 | Demo 脚本 + Sprint-6a 任务卡草案 | 本文档 |

**详设升版：** 04 V1.1 → V1.2（D1 实施期发现 §4.12 实际是 T-05；按 B 方案补 §4.13a T-08 + §4.13b T-09 全字段表）。

**Codex 评审：** 5 critical + 3 major + 3 minor finding 全闭环（C-1 BiddingDeadline null / C-2 投标报价校验 / C-3 平台导入幂等 / C-4 MarkEvaluated 私化 / C-5 流标判定补有效响应数 / M-1 枚举白名单 / M-2 默认值 / m-3 sync LINQ 单测兼容）。

---

## 二、回归用例（Sprint 1-4 已落，共 18 项）

承接 `Sprint-4-Demo-脚本-V0.1.md` 用例 1-18；本次 Demo 仅列 Sprint 5a 新增 4 项。

---

## 三、Sprint 5a 新增 Demo 用例（19-22）

### 用例 19：T-08 BidResponse 投标响应全生命周期

**目标：** 验证投标 4 状态机 + 撤回/启动评标前置校验 + 平台导入幂等 + Codex C-1/C-2/C-3 修复。

```bash
# 前置：T-03 标包发布 + 投标截止时间 = 未来时刻
POST /api/supply-cores/tender-packages/100/publish

# 1. 三家供应商提交投标响应（人工录入）
POST /api/supply-cores/bid-responses
{
  "packageId": 100,
  "supplierId": 1,
  "bidNo": "BR-001",
  "bidDate": "2026-05-13",
  "bidAmount": 490000.00,
  "importSource": "人工录入"
}
# 期望：bid_state=已提交，sub_group_id=42

# 2. 平台导入幂等（C-3 修复）
POST /api/supply-cores/bid-responses
{
  "packageId": 100, "supplierId": 2, "bidNo": "BR-002",
  "bidAmount": 480000.00,
  "importSource": "平台导入",
  "platformBidCode": "PLAT-ZB-2026-002"
}
# 重复 POST 相同 platformBidCode → 返回已有记录（不报错，不重复创建）

# 3. 撤回前置校验（C-1 修复）
POST /api/supply-cores/bid-responses/{id}/withdraw
{ "reason": "报价错误" }
# 期望：bid_state=已撤回；
# 反向场景：标包 BiddingDeadline=null 时撤回 → BiddingDeadlineRequired
# 反向场景：截止后撤回 → WithdrawAfterBiddingDeadline

# 4. 启动评标（前置：标包 Published + 截止时间已过）
# 模拟时间快进或直接改 T-03.bidding_deadline = 过去
POST /api/supply-cores/bid-responses/{id}/start-evaluation
# 期望：bid_state=评标中

# 5. 录入评定结论（中标 / 候选 / 落标 三选一 — M-1 白名单）
POST /api/supply-cores/bid-responses/{id}/set-conclusion
{ "conclusion": "中标" }
# 期望：evaluation_conclusion=中标
# 反向场景：conclusion=未知值 → InvalidConclusion
```

**验收点：**
- 4 状态 transition 全通：Submitted / Withdrawn / Evaluating / Evaluated
- 6 endpoint 全通（C-4 彻底化后 MarkEvaluated 不暴露 HTTP）
- 平台导入幂等键 (ImportSource=平台导入, PlatformBidCode) 唯一约束
- Codex M-1 EnsureValidConclusion 白名单生效

---

### 用例 20：T-09 评标结果 + 综合得分聚合 ⭐

**目标：** 验证 TenderEvaluationAggregator 综合得分计算 + 权重之和校验 + 排名回写 + Codex C-4 私化保护。

```bash
# 前置：3 家投标响应均已进入"评标中"状态

# 1. 录入评分（3 评委 × 3 维度，权重之和 = 1.0）
# 评委 101 / 102 / 103，维度 价格(0.4) / 技术(0.3) / 商务(0.3)
POST /api/supply-cores/evaluation-results
{
  "bidId": 1,
  "evaluatorId": 101,
  "scoreDimension": "价格",
  "score": 95.0,
  "weight": 0.4,
  "evaluationDate": "2026-05-13"
}
# 期望：sub_group_id=42（从 T-08 复制）

# 重复 9 条（3 bid × 3 维度 × 3 评委，本用例缩为 1 bid × 3 维度 × 1 评委）

# 2. 反向场景：权重之和 ≠ 1.0（容差 0.001）
POST /api/supply-cores/evaluation-results
{ "bidId": 1, "evaluatorId": 102, "scoreDimension": "价格", "score": 80, "weight": 0.5 }
# 同评委只录 0.5，未补 0.3/0.2 → 聚合时报 WeightSumNotEqualToOne

# 3. 触发综合得分聚合（详设 §4.13b.2 业务规则 4）
POST /api/supply-cores/tender-evaluation-aggregator/aggregate
{ "packageId": 100 }
# 期望：
#   bid 1 综合分 = 95×0.4 + 90×0.3 + 92×0.3 = 92.6（3 评委一致情况）
#   T-08 evaluation_score / evaluation_rank 自动回写
#   bid_state 从 评标中 → 已评定

# 4. C-4 保护验证：直接调 BidResponse 写分 endpoint 应不存在
POST /api/supply-cores/bid-responses/{id}/mark-evaluated
# 期望：404 Not Found（C-4 修复后 MarkEvaluatedAsync 不进 IBidResponseAppService 契约）
```

**验收点：**
- 单评委综合分 = Σ(score × weight) 单元测试 7 用例全通
- 多评委 → avg(各评委综合分) 同 PackageId 内按 score 倒排
- C-4 保护：BidResponse 不公开写分入口，唯一通过 Aggregator 聚合校验后回写

---

### 用例 21：S-06 PurchaseReturn 红字退货 + NC BIZ-RED stub ⭐

**目标：** 验证退货 5 状态 + NC 红字接口 stub 失败不阻断 Approve + 双轨 SubGroupId 钩子。

```bash
# 前置：S-05 入库单 ID=1 已审，TotalQuantity=100，SubGroupId=42

# 1. 创建退货单（SubGroupId 从 S-05 复制，C-02 模式）
POST /api/supply-cores/purchase-returns
{
  "returnNo": "RT-2026-001",
  "receiptId": 1,
  "supplierId": 1,
  "orgId": 100,
  "warehouseId": 1,
  "returnDate": "2026-05-13",
  "returnReason": "质量不达标 / 5% 锈蚀",
  "totalReturnQuantity": 30,
  "totalReturnAmount": 3000
}
# 期望：
#   return_state=待审
#   sub_group_id=42（从 S-05 复制）
#   反向：S-05 未审状态 → SourceReceiptNotApproved
#   反向：return_qty > S-05.TotalQuantity → ReturnQuantityExceedsReceipt

# 2. 审批通过 → 触发 NC BIZ-RED 红字接口 stub
POST /api/supply-cores/purchase-returns/{id}/approve?approverUserId=99
# 期望：
#   return_state=已审
#   interface_push_state=推送成功
#   nc_voucher_no=NC-RED-xxx 回写
#   idempotent_key=BIZ-RED-RT-2026-001-100

# 3. NC 失败场景（mock NcPushResult.Success=false）
# 即使 NC 失败：return_state 仍 = 已审（已审事实成立）
# interface_push_state=推送失败 + push_error_code 回写

# 4. 已审 → 已冲销（业务原因，如发票退回）
POST /api/supply-cores/purchase-returns/{id}/reverse
{ "reason": "发票退回需重开" }
# 期望：return_state=已冲销

# 5. 反向场景：作废仅允许 待审
POST /api/supply-cores/purchase-returns/{id}/void
{ "reason": "..." }
# 已审状态调用 → InvalidStateTransition
```

**验收点：**
- 5 状态 transition：PendingReview / Approved / Rejected / Voided / Reversed
- NC BIZ-RED 失败不阻断（沿用 Sprint 2 D9-3 C-02 BIZ-001 模式）
- 双轨 SubGroupId：优先 ReceiptId → S-05 复制；S-05 SubGroupId 为 null 时备路 OrgId 反查
- 强约束：S-05.PurchaseReceiptState=已审 + return_qty ≤ S-05.TotalQuantity

---

### 用例 22：S-09 MaterialIssuance 领料出库 + NC BIZ-005 + 防重复打印 ⭐

**目标：** 验证 6 状态机 + 出库类型白名单 + NC BIZ-005 stub + 防重复打印（PrintHash 唯一约束）。

```bash
# 1. 创建领料出库单（草稿）
POST /api/supply-cores/material-issuances
{
  "issuanceNo": "IS-2026-001",
  "orgId": 100,
  "usageUnitId": 100,
  "warehouseId": 1,
  "issuanceDate": "2026-05-13",
  "issuanceType": "领料出库",
  "totalQuantity": 20,
  "totalAmount": 2000
}
# 期望：
#   issuance_state=草稿
#   sub_group_id=42（OrgId → Org.SubGroupId 反查）
#   反向：issuance_type=非白名单 → InvalidIssuanceType

# 2. 提交 → 审核 → 发料
POST /api/supply-cores/material-issuances/{id}/submit
# 期望：issuance_state=待审

POST /api/supply-cores/material-issuances/{id}/approve?approverUserId=99
# 期望：issuance_state=已审，approved_by=99

POST /api/supply-cores/material-issuances/{id}/issue
# 期望：
#   issuance_state=已出库（终态）
#   interface_push_state=推送成功
#   nc_voucher_no=NC-005-xxx
#   idempotent_key=BIZ-005-IS-2026-001-100

# 3. NC 失败场景
# 已出库事实成立，仅 interface_push_state=推送失败

# 4. 防重复打印（PrintHash 唯一）
POST /api/supply-cores/material-issuances/{id}/mark-printed
{ "printHash": "sha256-abc..." }
# 期望：
#   print_state=已打印
#   first_print_time 回填，print_month=2026-05
#   print_hash=sha256-abc...

# 重复调用：
POST /api/supply-cores/material-issuances/{id}/mark-printed
{ "printHash": "other-hash" }
# 期望：抛 AlreadyPrinted（防重复打印）

# 5. 冲销（已出库 → 已冲销）
POST /api/supply-cores/material-issuances/{id}/reverse
{ "reason": "发料数量错误，原单冲销重开" }
# 期望：issuance_state=已冲销

# 6. 作废仅允许 草稿
POST /api/supply-cores/material-issuances/{id2}/void
{ "reason": "..." }
# 已审状态调用 → InvalidStateTransition
```

**验收点：**
- 6 状态 transition：Draft / PendingReview / Approved / Issued / Voided / Reversed
- 4 出库类型白名单：领料出库 / 维修出库 / 消耗出库 / 其他出库
- NC BIZ-005 失败不阻断 Issue（同 BIZ-RED 模式）
- PrintHash + AlreadyPrinted 防重复打印
- SubGroupId 反查（双轨钩子默认路径）

---

## 四、E2E 主链回归

### 4.1 Sprint5aFullChain_E2E（招投标链）

```bash
dotnet test --filter "FullyQualifiedName~Sprint5aFullChain"

# 链路：
# T-01 招标申请 → T-03 标包 + T-04 招标文件
# → 3 家供应商 T-08 投标响应（人工录入）
# → 启动评标（T-08 评标中）
# → T-09 评分（3 评委 × 3 维度，权重 0.4+0.3+0.3=1.0）
# → TenderEvaluationAggregator 综合得分聚合（92.6 / 85 / 77.4）+ 排名回写（Rank=1/2/3）
# → 录入评定结论（中标 / 候选 / 落标）
# → T-06 platform_log 记录 batch 导入
# → T-06 partial_success 失败路径（20 条导入 18 成功 + 2 失败）

# 验收点：
# - SubGroupId=42 全链端到端继承
# - 综合得分 92.6 = 95×0.4 + 90×0.3 + 92×0.3 精确到 0.001
# - C-4 MarkEvaluated 仅通过 Aggregator 内部回写
```

### 4.2 Sprint5aSupplyChain_E2E（供应链下游）

```bash
dotnet test --filter "FullyQualifiedName~Sprint5aSupplyChain"

# 链路：
# S-05 mock 已审入库 → S-06 创建 + 审核 → NC BIZ-RED 推送 stub
# S-09 草稿 → 提交 → 审核 → 发料 → NC BIZ-005 推送 stub + 防重复打印

# 验收点：
# - S-06 SubGroupId 从 S-05 复制（C-02 模式）
# - S-06 NC BIZ-RED 失败不阻断 Approve
# - S-09 SubGroupId 从 Org 反查（双轨钩子默认路径）
# - S-09 NC BIZ-005 触发 + 凭证号回写
# - S-09 防重复打印（PrintHash + AlreadyPrinted）
```

---

## 五、Demo 验收检查清单

- [ ] 用例 19-22 全部 200 OK
- [ ] Sprint 1-4 用例 1-18 回归通过
- [ ] `dotnet test` 全套 ≥ 530 / 0 失败
- [ ] EF migrations 全部 apply 成功（Sprint 5a 新增 Wave 27-30 共 4 条：T-08 / T-09 / S-06 / S-09）
- [ ] sub_group_id 守护单测自动覆盖 Sprint 5a 新增 4 实体
- [ ] Codex 评审 5 critical / 3 major / 3 minor finding 全闭环
- [ ] 详设 04 V1.1 → V1.2 升版文档入库
- [ ] **b 主分支集成回归**：merge b 最新 push 后全套测试再跑一次

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版，配合 Sprint-5a-招投标闭环-任务卡-V0.2 锁版后 D10-3 验收物。覆盖 4 新增 Demo 用例（19-22）+ 2 个 E2E 主链回归。Codex 评审 11 条 finding 全闭环。|
