# Sprint 2 Demo 脚本（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-12
**文档性质：** Sprint 验收 · 演示脚本
**衔接：** [Sprint-2-任务卡-V0.2.md](./Sprint-2-任务卡-V0.2.md) D10 整体 demo + [Sprint-1-Demo-脚本-V0.1.md](./Sprint-1-Demo-脚本-V0.1.md)

> 对照 Sprint 2 任务卡 V0.2 §1.4 完成标准 + D10-2 验收清单。Sprint 1 用例 1-8 作回归检查；新增
> 用例 9-11 覆盖 D1-D9 落地能力。任一用例失败 → 标记问题并提 Sprint 2 收尾 bug。

---

## 一、环境准备

```bash
cd SupplyCores
cd modules/nova.supplycores/src/Nova.SupplyCores.EntityFrameworkCore
dotnet ef database drop --force --no-build
cd -
dotnet build src/SupplyCores.DbMigrator/SupplyCores.DbMigrator.csproj
dotnet run --project src/SupplyCores.DbMigrator   # 5 条 migration 全 apply
dotnet run --project src/SupplyCores.Web          # http://localhost:5100/swagger
```

**预期 EF migrations**（Sprint 2 末态 7 条）：

```sql
SELECT "MigrationId" FROM "__EFMigrationsHistory" ORDER BY "MigrationId";
-- 20260512033645_Init
-- 20260512084400_Add_DemandRequest
-- 20260512093211_Add_PurchasePlan
-- 20260512102938_Add_PlanAdjustment
-- 20260512120928_Add_PurchaseTask
-- 20260512125045_Add_ContractNegotiation
-- 20260512134808_Add_Contract
```

**Sprint 2 新增表**（5 张）：`m.plan_adjustment` / `m.purchase_task` / `c.contract_approval` / `c.contract`。
（外加 Sprint 1 落的 `m.demand_request` / `m.demand_request_line` / `m.purchase_plan` / `m.purchase_plan_line` 共 4 张）

**预期 sub_group_id 索引（业务表 ≥ 12 个）**：

```sql
SELECT indexname FROM pg_indexes
WHERE schemaname IN ('m','c') AND indexname LIKE '%sub_group%';
-- IX_demand_request_sub_group_id / IX_demand_request_line_sub_group_id
-- IX_purchase_plan_sub_group_id / IX_purchase_plan_line_sub_group_id
-- IX_plan_adjustment_sub_group_id
-- IX_purchase_task_sub_group_id
-- IX_contract_approval_sub_group_id
-- IX_contract_sub_group_id
```

---

## 二、端到端 curl 用例

> 假定 Web 起在 `http://localhost:5100`。Sprint 2 phase 仍未挂权限，无需 Token。

### 用例 1-8：Sprint 1 回归

按 [Sprint-1-Demo-脚本-V0.1.md](./Sprint-1-Demo-脚本-V0.1.md) §二 用例 1-8 跑完，确认 Sprint 2 改动未引发回归。
**特别注意：** Sprint 2 D4-3 改了 `PurchasePlan.ApproveAsync` 行为 —— Approve 后自动触发
linkage 拆 P-05 + P-02 终态变 `已分解`（不再是 `已审`）。Sprint 1 用例 8 验收点要联动校正。

---

### 用例 9 — P-04 plan_adjustment 全生命周期（D1-D2）

```bash
# 9.0 准备：从已有 P-02 + P-03 行（用例 8 已建）取数
PLAN_ID=$(curl -s "http://localhost:5100/api/supply-cores/purchase-plans?planPeriod=2026-05&orgId=$ORG_ID" | jq -r '.items[0].id')
LINE_ID=$(curl -s "http://localhost:5100/api/supply-cores/purchase-plans/$PLAN_ID" | jq -r '.lines[0].id' 2>/dev/null || echo "")
# 若 lines 没暴露，直接查 DB：
psql -h dev.aizhetech.com -U postgres -d SupplyCore \
  -c "SELECT id FROM m.purchase_plan_line WHERE plan_id=$PLAN_ID AND fulfillment_state='待采购' LIMIT 1"

# 9.1 增量调整：原数量 10 → 调到 20
ADJ_ID=$(curl -s -X POST http://localhost:5100/api/supply-cores/plan-adjustments \
  -H "Content-Type: application/json" \
  -d "{
    \"adjNo\": \"AD-DEMO-001\",
    \"planId\": $PLAN_ID,
    \"planLineId\": $LINE_ID,
    \"adjType\": \"增量\",
    \"adjReason\": \"需求增加 100%\",
    \"oldQuantity\": 10,
    \"newQuantity\": 20,
    \"oldEstimatedAmount\": 50,
    \"newEstimatedAmount\": 100
  }" | jq -r '.id')
curl -s -X POST http://localhost:5100/api/supply-cores/plan-adjustments/$ADJ_ID/submit | jq '.approvalState'
# 预期: "待审"
curl -s -X POST "http://localhost:5100/api/supply-cores/plan-adjustments/$ADJ_ID/approve?approverUserId=1" | jq '.approvalState'
# 预期: "已审" + 对应 P-03 行 quantity 自动更新到 20

# 9.2 取消行：要求 P-03 fulfillment_state=待采购
curl -s -X POST http://localhost:5100/api/supply-cores/plan-adjustments \
  -H "Content-Type: application/json" \
  -d "{\"adjNo\":\"AD-DEMO-002\",\"planId\":$PLAN_ID,\"planLineId\":$LINE_ID,\"adjType\":\"取消行\",\"adjReason\":\"业务变更\"}" | jq '.id'
# Approve 后该 P-03 行 fulfillment_state → 已取消

# 9.3 新增行：传 NewMaterial* 字段，Approve 后自动建 P-03
curl -s -X POST http://localhost:5100/api/supply-cores/plan-adjustments \
  -H "Content-Type: application/json" \
  -d "{
    \"adjNo\": \"AD-DEMO-003\",
    \"planId\": $PLAN_ID,
    \"adjType\": \"新增行\",
    \"adjReason\": \"补充计划外需求\",
    \"newQuantity\": 5,
    \"newEstimatedAmount\": 25,
    \"newMaterialId\": 1,
    \"newCategoryId\": 11,
    \"newUnitId\": 1,
    \"newUnitPrice\": 5
  }" | jq '.id'
# 提交+审批后 m.purchase_plan_line 表增 1 行，sub_group_id 与 P-02 对齐
```

**验收（D2-2 业务规则三路径）**：

- 增量：`m.purchase_plan_line.quantity` 自动更新
- 取消行：`m.purchase_plan_line.fulfillment_state` = 已取消（须前置 fulfillment_state=待采购，否则抛 `CancelLineRequiresPendingState`）
- 新增行：`m.purchase_plan_line` 增一行，`sub_group_id` = 源 P-02 sub_group_id（原则 3）

---

### 用例 10 — P-02 → P-05 自动拆任务（D3-D4 主用例）

```bash
# 10.0 用例 8 中已创建 1 个 P-02 (10 行 line)。Sprint 2 起 ApproveAsync 触发 linkage
# 因此 用例 8.3 的 PLAN_ID 在 Approve 后已自动拆出 10 条 P-05 任务

# 10.1 查 P-05 任务列表（按 planId 过滤）
curl -s "http://localhost:5100/api/supply-cores/purchase-tasks?planId=$PLAN_ID" | jq '.items | length, .[0]'
# 预期: length=10, item.taskState="待采购", item.sourceType="招采", item.subGroupId=<与 P-02 一致>

TASK_ID=$(curl -s "http://localhost:5100/api/supply-cores/purchase-tasks?planId=$PLAN_ID" | jq -r '.items[0].id')

# 10.2 分派采购员（不改状态）
curl -s -X POST "http://localhost:5100/api/supply-cores/purchase-tasks/$TASK_ID/assign?userId=999" | jq '.assignedToId'

# 10.3 转入招采（source_type=招采 路径）
curl -s -X POST "http://localhost:5100/api/supply-cores/purchase-tasks/$TASK_ID/mark-in-tender?tenderAppId=12345" | jq '.taskState, .tenderAppId'
# 预期: "招采申请中", 12345

# 10.4 完成
curl -s -X POST http://localhost:5100/api/supply-cores/purchase-tasks/$TASK_ID/complete | jq '.taskState'
# 预期: "已完成"

# 10.5 验证 P-02 终态
curl -s http://localhost:5100/api/supply-cores/purchase-plans/$PLAN_ID | jq '.approvalState'
# 预期: "已分解"（D4-3 接通 MarkDecomposed 的成果）
```

**验收（D4-1 + D4-3 主用例）**：

- 10 P-03 行 → 10 P-05 任务（一刀切 B 方案）
- 每条 P-05 `sub_group_id` 继承自 P-03（端到端一致）
- P-02 `approval_state` = 已分解（Sprint 1 D8 MarkDecomposed 首次实际调用点）
- P-03 `task_id` 回填到对应 P-05

---

### 用例 11 — C-01 合同会签 → C-02 合同生效 + NC stub（D6-D9 主用例）

```bash
# 11.1 创建 C-01 合同会签
APPROVAL_ID=$(curl -s -X POST http://localhost:5100/api/supply-cores/contract-negotiations \
  -H "Content-Type: application/json" \
  -d "{
    \"approvalNo\": \"CA-DEMO-001\",
    \"orgId\": $ORG_ID,
    \"supplierId\": 1,
    \"contractType\": \"采购合同\",
    \"contractAmount\": 100000,
    \"contractSummary\": \"钢丝绳 100 米采购合同（含 6 月质保）\"
  }" | jq -r '.id')

# 11.2 提交 + 财务会签（最简 mock 单签即批，V0.2 决策点 3）
curl -s -X POST http://localhost:5100/api/supply-cores/contract-negotiations/$APPROVAL_ID/submit | jq '.contractApprovalState'
# 预期: "会签中"
curl -s -X POST http://localhost:5100/api/supply-cores/contract-negotiations/$APPROVAL_ID/approve \
  -H "Content-Type: application/json" \
  -d '{"financeApproverId": 999, "comment": "财务通过"}' | jq '{state: .contractApprovalState, createdContractId}'
# 预期: state="已批准", createdContractId=<某 long，D9-2 linkage 自动生成 C-02>

CONTRACT_ID=$(curl -s "http://localhost:5100/api/supply-cores/contract-negotiations/$APPROVAL_ID" | jq -r '.createdContractId')

# 11.3 查 C-02 草稿（D9-2 linkage 自动生成）
curl -s http://localhost:5100/api/supply-cores/contracts/$CONTRACT_ID | jq '{state: .contractState, subGroupId, orgId, supplierId, contractAmount}'
# 预期: state="草稿", subGroupId=<与 C-01 一致>, orgId=$ORG_ID, contractAmount=100000

# 11.4 业务员补完字段 + 提交 + 审批通过（自动触发 NC stub）
curl -s -X PUT http://localhost:5100/api/supply-cores/contracts/$CONTRACT_ID \
  -H "Content-Type: application/json" \
  -d "{
    \"contractName\": \"钢丝绳采购合同（业务员补完）\",
    \"paymentTerms\": \"到货付款\",
    \"effectiveDate\": \"2026-06-01\",
    \"contractDate\": \"2026-05-12\"
  }" 2>/dev/null   # 这里假设 Sprint 3 加 PUT；Sprint 2 实际仅 Create 时填全

curl -s -X POST http://localhost:5100/api/supply-cores/contracts/$CONTRACT_ID/submit | jq '.contractState'
# 预期: "待审"

# 11.5 Approve → NC 推送 BIZ-001 + mock 凭证号回写（D9-3 主用例）
curl -s -X POST http://localhost:5100/api/supply-cores/contracts/$CONTRACT_ID/approve | jq '{state: .contractState, ncVoucherNo, interfacePushState, lastPushTime}'
# 预期: state="已签", ncVoucherNo=<mock NC-VR-XXX>, interfacePushState="推送成功", lastPushTime 非空

# 11.6 状态机后续流转：StartExecution / Complete
curl -s -X POST http://localhost:5100/api/supply-cores/contracts/$CONTRACT_ID/start-execution | jq '.contractState'
# 预期: "执行中"
curl -s -X POST http://localhost:5100/api/supply-cores/contracts/$CONTRACT_ID/complete | jq '.contractState'
# 预期: "已完成"
```

**验收（D7-D9 主用例）**：

- **C-01 最简 mock 单签即批**（V0.2 决策点 3）：Submit → 会签中 → Approve（财务 ID + 评论）→ 已批准
- **C-01 → C-02 自动 linkage**（D9-2）：C-01 已批准后立即建 C-02 草稿，复制 OrgId/SupplierId/ContractType/Amount + sub_group_id；回填 created_contract_id
- **NC 中等 stub**（V0.2 决策点 4 + D9-3）：C-02.Approve 后调 BIZ-001 → mock 凭证号回写 `nc_voucher_no` + `interface_push_state=推送成功`
- **8 状态机**：草稿 → 待审 → 已签 → 执行中 → 已完成 全路径走通
- NC 推送失败时（mock 5% 概率）：合同仍达 已签，但 `interface_push_state=推送失败` + 错误码记录，**不阻断 Approve**

---

## 三、验收对照表

| 任务卡条目 | Demo 用例 | 通过条件 |
|---|---|---|
| D1-1~3 P-04 实体 + 状态机 | 用例 9.0 准备 | 表 + 索引到位 |
| D2-1 P-04 AppService | 用例 9.1~9.3 | 6 endpoint 全通 |
| D2-2 三 AdjType 路径 | 用例 9.1 / 9.2 / 9.3 | 各路径 P-03 自动联动 |
| D3-1~3 P-05 实体 + 状态机 | 用例 10.2~10.4 | 5 状态全转换 |
| D4-1 P-02→P-05 linkage | 用例 10.1 | 10 task 自动生成 |
| D4-2 P-05 AppService | 用例 10.2~10.4 | 7 endpoint 全通 |
| D4-3 MarkDecomposed 接通 | 用例 10.5 | P-02 终态=已分解 |
| D5-4 sub_group_id 守护 | EFCore.Tests 守护单测 | 全部 pass |
| D6-1~3 C-01 实体 + 状态机 | 用例 11.1~11.2 | 4 状态 + 9 单测 |
| D7-1~2 C-01 AppService + mock | 用例 11.2 | 最简单签即批 |
| D8-1~3 C-02 实体 + 状态机 | 用例 11.3~11.6 | 8 状态全转换 |
| D9-1 C-02 AppService | 用例 11.4~11.6 | 9 endpoint 全通 |
| D9-2 C-01→C-02 linkage | 用例 11.2~11.3 | 自动建草稿 + 字段复制 |
| D9-3 NC 中等 stub | 用例 11.5 | nc_voucher_no 回写 |

---

## 四、容器化部署验证（D10-3）

```bash
cd SupplyCores
docker compose down -v
docker compose up -d --build
docker compose logs -f supplycores-web   # 等 NovaSync + 7 条 migration apply 完
# 容器内跑 §二 全套用例（端口走 5100）
```

按 [`docs/部署/试点单位部署指南-V0.1.md`](../部署/试点单位部署指南-V0.1.md) 调整环境变量后跑。

---

## 五、问题登记区

| # | 用例 | 现象 | 严重程度 | 处理 |
|---|---|---|---|---|
| | | | | |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-12 | 首版：Sprint 2 D10-4 起。覆盖新增用例 9-11（D1-D9 落地能力）+ Sprint 1 用例 1-8 回归引用；§四 容器化部署验证；§三 任务卡条目对照表。 |
