# Sprint 3 Demo 脚本（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-13
**文档性质：** Sprint 验收 · 演示脚本
**衔接：** [Sprint-3-任务卡-V0.3.md](./Sprint-3-任务卡-V0.3.md) D10 整体 demo + [Sprint-2-Demo-脚本-V0.1.md](./Sprint-2-Demo-脚本-V0.1.md)

> 对照 Sprint 3 任务卡 V0.3 §1.4 完成标准。Sprint 1/2 用例 1-11 作回归；新增用例 12-14
> 覆盖 D0-D9 落地能力。任一失败 → 标记 Sprint 3 收尾 bug。

---

## 一、环境准备

```bash
cd SupplyCores
cd modules/nova.supplycores/src/Nova.SupplyCores.EntityFrameworkCore
dotnet ef database drop --force --no-build
cd -
dotnet build src/SupplyCores.DbMigrator/SupplyCores.DbMigrator.csproj
dotnet run --project src/SupplyCores.DbMigrator
dotnet run --project src/SupplyCores.Web   # http://localhost:5100/swagger
```

**预期 EF migrations**（Sprint 3 末态 13 条）：

```sql
SELECT "MigrationId" FROM "__EFMigrationsHistory" ORDER BY "MigrationId";
-- 20260512033645_Init
-- 20260512084400_Add_DemandRequest
-- 20260512093211_Add_PurchasePlan
-- 20260512102938_Add_PlanAdjustment
-- 20260512120928_Add_PurchaseTask
-- 20260512125045_Add_ContractNegotiation
-- 20260512134808_Add_Contract
-- 20260512150758_Schema_Move_P_Tables_To_PSchema (D0)
-- 20260512153312_Add_ProcurementMethod (D1)
-- 20260512153602_Add_TenderApplication (D2)
-- 20260512160353_Add_TenderResult (D3)
-- 20260512165745_Add_ContractChange (D5)
-- 20260512170339_Add_StockInbound (D6)
```

**预期表清单**（Sprint 3 新增 6 张）：

| Schema | 表 | 新增于 |
|---|---|---|
| `t` | procurement_method | D1（schema t 首次启用）|
| `t` | tender_application | D2 |
| `t` | tender_result | D3 |
| `c` | contract_change | D5 |
| `s` | stock_inbound / stock_inbound_line | D6（schema s 首次启用）|

**预期 T-02 seed 数据**：

```sql
SELECT method_code, method_name FROM t.procurement_method ORDER BY method_id;
-- 8 条系统内置（OPEN_TENDER / INVITED_TENDER / COMPETITIVE_NEGO / INQUIRY /
--   BIDDING / DIRECT_PURCHASE / SINGLE_SOURCE / SMALL_PURCHASE）
```

**预期 D0 schema 整改后的 6 张 P 表均在 `p` schema 下**：

```sql
SELECT schemaname FROM pg_tables WHERE tablename IN
  ('demand_request', 'demand_request_line', 'purchase_plan', 'purchase_plan_line',
   'plan_adjustment', 'purchase_task') GROUP BY schemaname;
-- 应只有 p
```

---

## 二、端到端 curl 用例

### 用例 1-11：Sprint 1/2 回归

按 [Sprint-2-Demo-脚本-V0.1.md](./Sprint-2-Demo-脚本-V0.1.md) §二 用例 1-11 跑完。**特别注意：**
原 Sprint 1/2 用例里 `m.demand_request` / `m.purchase_plan` 等表已迁到 `p` schema
（Sprint 3 D0 整改），SQL 验证语句须改 `p.demand_request` 等。

---

### 用例 12 — T-01/T-02/T-05 招投标主链（D1-D4）

```bash
# 12.1 查 T-02 字典 8 条（D1 seed）
psql -h dev.aizhetech.com -U postgres -d SupplyCore \
  -c "SELECT method_code, method_name, route_level FROM t.procurement_method ORDER BY method_id"
# 预期: 8 行（OPEN_TENDER / INVITED_TENDER / ... / SMALL_PURCHASE）

# 12.2 取一个 P-05 招采任务（用例 10 已建）
TASK_ID=$(curl -s "http://localhost:5100/api/supply-cores/purchase-tasks?sourceType=招采" | jq -r '.items[0].id')

# 12.3 调 AutoCreateTender → 自动建 T-01 草稿 + task.MarkInTender 推进
curl -s -X POST "http://localhost:5100/api/supply-cores/purchase-tasks/$TASK_ID/auto-create-tender?procurementMethodCode=OPEN_TENDER" | \
  jq '{taskState, tenderAppId}'
# 预期: taskState="招采申请中", tenderAppId=<某 long>

TENDER_ID=$(curl -s http://localhost:5100/api/supply-cores/purchase-tasks/$TASK_ID | jq -r '.tenderAppId')

# 12.4 T-01 状态机：Submit → Approve → StartTender
curl -s -X POST http://localhost:5100/api/supply-cores/tender-applications/$TENDER_ID/submit | jq '.applicationState'
# 预期: "待审"
curl -s -X POST "http://localhost:5100/api/supply-cores/tender-applications/$TENDER_ID/approve?approverUserId=1" | jq '.applicationState'
# 预期: "已审"
curl -s -X POST http://localhost:5100/api/supply-cores/tender-applications/$TENDER_ID/start-tender | jq '.applicationState'
# 预期: "进行中"

# 12.5 创建 T-05 中标结果 + Verify
RESULT_ID=$(curl -s -X POST http://localhost:5100/api/supply-cores/tender-results \
  -H "Content-Type: application/json" \
  -d "{
    \"tenderAppId\": $TENDER_ID,
    \"supplierId\": 1,
    \"winningQuantity\": 100,
    \"winningPrice\": 50,
    \"winningAmount\": 5000,
    \"resultDate\": \"2026-05-13\",
    \"importSource\": \"手工录入\"
  }" | jq -r '.id')
curl -s -X POST http://localhost:5100/api/supply-cores/tender-results/$RESULT_ID/verify | jq '.verificationState'
# 预期: "已验证"
```

**验收（D1-D4 主用例）**：

- 8 条 T-02 字典 seed 入库
- AutoCreateTenderAsync 自动建 T-01 草稿 + P-05.TaskState=招采申请中 + TenderAppId 回填
- T-01 7 状态机全转换（待审 → 已审 → 进行中）
- T-05 SubGroupId 复制源 T-01（原则 3）+ Verify 状态机

---

### 用例 13 — C-05 合同变更 + 回写 C-02（D5）

```bash
# 13.0 取一个已签 C-02（用例 11 已建）
CT_ID=$(curl -s "http://localhost:5100/api/supply-cores/contracts?contractState=已签" | jq -r '.items[0].id')

# 13.1 创建 C-05 金额变更（10 万 → 15 万）
CC_ID=$(curl -s -X POST http://localhost:5100/api/supply-cores/contract-changes \
  -H "Content-Type: application/json" \
  -d "{
    \"changeNo\": \"CC-DEMO-001\",
    \"contractId\": $CT_ID,
    \"changeSeq\": 1,
    \"changeType\": \"金额变更\",
    \"changeReason\": \"需求增加 50%\",
    \"changeDetailJson\": \"{\\\"before\\\":{\\\"contractAmount\\\":100000}, \\\"after\\\":{\\\"contractAmount\\\":150000}}\",
    \"oldContractAmount\": 100000,
    \"newContractAmount\": 150000,
    \"amountDelta\": 50000
  }" | jq -r '.id')

# 13.2 Submit → Approve
curl -s -X POST http://localhost:5100/api/supply-cores/contract-changes/$CC_ID/submit | jq '.changeState'
# 预期: "待审"
curl -s -X POST http://localhost:5100/api/supply-cores/contract-changes/$CC_ID/approve | jq '.changeState'
# 预期: "已审" + C-02.contract_amount 已自动回写到 150000

# 13.3 验证 C-02 金额已更新
curl -s http://localhost:5100/api/supply-cores/contracts/$CT_ID | jq '.contractAmount'
# 预期: 150000

# 13.4 测试守护：新金额 < ExecutedAmount 应被拒
CC_BAD_ID=$(curl -s -X POST http://localhost:5100/api/supply-cores/contract-changes \
  -H "Content-Type: application/json" \
  -d "{\"changeNo\":\"CC-BAD-001\",\"contractId\":$CT_ID,\"changeSeq\":2,\"changeType\":\"金额变更\",\"changeReason\":\"test\",\"changeDetailJson\":\"{}\",\"newContractAmount\":1}" | jq -r '.id')
curl -s -X POST http://localhost:5100/api/supply-cores/contract-changes/$CC_BAD_ID/submit > /dev/null
curl -s -X POST http://localhost:5100/api/supply-cores/contract-changes/$CC_BAD_ID/approve | jq '.error.code'
# 预期: "SupplyCores:ContractChange:AmountBelowExecuted"
```

**验收（D5 主用例）**：

- C-05 8 种 ChangeType 中"金额变更"路径 → C-02.ContractAmount 自动回写
- 业务规则 4 守护：新金额 ≥ ExecutedAmount，否则抛 AmountBelowExecuted
- 付款条件 / 交期 / 供应商信息变更类型仅 log（Sprint 4 接 C-04 付款节点 + C-03 条款）

---

### 用例 14 — S-05 入库主链 + NC BIZ-001 + C-02 转执行中（D6-D8）

```bash
# 14.1 创建 S-05 入库单（绑 C-02）
RC_ID=$(curl -s -X POST http://localhost:5100/api/supply-cores/stock-inbounds \
  -H "Content-Type: application/json" \
  -d "{
    \"receiptNo\": \"RC-DEMO-001\",
    \"orgId\": $ORG_ID,
    \"warehouseId\": 1,
    \"supplierId\": 1,
    \"contractId\": $CT_ID,
    \"receiptDate\": \"2026-05-13\",
    \"receiptType\": \"采购入库\",
    \"totalQuantity\": 50,
    \"totalAmount\": 2500,
    \"invoiceNo\": \"INV-2026-001\"
  }" | jq -r '.id')

# 验证 SubGroupId 已从 C-02 复制（D7-2 双轨钩子主路径）
curl -s http://localhost:5100/api/supply-cores/stock-inbounds/$RC_ID | jq '.subGroupId'
# 预期: <非 null，与 C-02 一致>

# 14.2 Submit → Approve 触发三联动：ExecutedAmount + StartExecution + NC
curl -s -X POST http://localhost:5100/api/supply-cores/stock-inbounds/$RC_ID/submit | jq '.purchaseReceiptState'
# 预期: "待审"
curl -s -X POST http://localhost:5100/api/supply-cores/stock-inbounds/$RC_ID/approve | jq '{state: .purchaseReceiptState, ncVoucherNo, interfacePushState}'
# 预期: state="已审", ncVoucherNo=<mock NC-XXX>, interfacePushState="推送成功"

# 14.3 验证 C-02 已联动到 执行中 + ExecutedAmount 回写
curl -s http://localhost:5100/api/supply-cores/contracts/$CT_ID | jq '{contractState, executedAmount}'
# 预期: contractState="执行中", executedAmount=2500（D7-3 回写）

# 14.4 测试紧急采购无 C-02 路径（D7-2 双轨备用钩子）
curl -s -X POST http://localhost:5100/api/supply-cores/stock-inbounds \
  -H "Content-Type: application/json" \
  -d "{
    \"receiptNo\": \"RC-URGENT-001\",
    \"orgId\": $ORG_ID,
    \"warehouseId\": 1,
    \"supplierId\": 1,
    \"contractId\": null,
    \"receiptDate\": \"2026-05-13\",
    \"receiptType\": \"采购入库\",
    \"totalQuantity\": 10,
    \"totalAmount\": 500
  }" | jq '.subGroupId'
# 预期: <非 null，从 OrgId 反查 M-01 得到>
```

**验收（D6-D8 主用例）**：

- **D7-2 双轨钩子**：有 C-02 复制 SubGroupId（原则 3）/ 无 C-02 OrgId 反查
- **D7-3 ExecutedAmount 回写**：C-02.ExecutedAmount += S-05.TotalAmount
- **D8-1 NC BIZ-001 接通点**：S-05 已审 → 调 INcInterfaceService.PushAsync → mock 凭证号回写
- **D8-2 首笔入库触发**：C-02 已签 → 执行中（首笔 S-05 入库审核驱动）

---

## 三、验收对照表

| 任务卡条目 | Demo 用例 | 通过条件 |
|---|---|---|
| D0 schema 整改 | §一 表清单 + 用例 1-11 回归 | 6 P 表在 p schema |
| D1 T-02 字典 + Seed | 用例 12.1 | 8 条 seed |
| D2 T-01 实体 + AppService | 用例 12.2-12.4 | 7 状态机全通 |
| D3 T-05 最小可用版 | 用例 12.5 | 3 状态全通 |
| D4 P-05→T-01 linkage | 用例 12.3 | AutoCreate + TaskState 推进 |
| D5 C-05 + 回写 C-02 | 用例 13 | 金额变更回写 + 守护 |
| D6 S-05 实体 + 状态机 | 用例 14.1 | 5 状态 |
| D7-2 双轨钩子 | 用例 14.1 + 14.4 | SubGroupId 双路径都正确 |
| D7-3 ExecutedAmount | 用例 14.3 | 自动回写 |
| D8-1 NC BIZ-001 | 用例 14.2 | NcVoucherNo 回写 |
| D8-2 StartExecution | 用例 14.3 | C-02 已签→执行中 |
| D9-1 E2E 集成测试 | Sprint3FullChain_E2E_Tests | 264 测试全通 |

---

## 四、容器化部署验证（D10-3）

```bash
cd SupplyCores
docker compose down -v
docker compose up -d --build
docker compose logs -f supplycores-web   # 等 NovaSync + 13 条 migration apply 完
# 容器内跑 §二 全套用例
```

---

## 五、问题登记区

| # | 用例 | 现象 | 严重程度 | 处理 |
|---|---|---|---|---|
| | | | | |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-13 | 首版：Sprint 3 D10-4 起。覆盖新增用例 12-14（T-01 主链 / C-05 变更 / S-05 入库 + NC + C-02 联动）+ Sprint 1/2 用例 1-11 回归引用；§三 验收对照表。 |
