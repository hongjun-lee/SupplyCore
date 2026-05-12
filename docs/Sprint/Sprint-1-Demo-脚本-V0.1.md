# Sprint 1 Demo 脚本（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-12
**文档性质：** Sprint 验收 · 演示脚本
**衔接：** [Sprint-1-任务卡-V0.7.md](./Sprint-1-任务卡-V0.7.md) D10 整体 demo

> 本脚本对照 Sprint 1 任务卡 §1.4 完成标准 + D10-2 验收清单，提供端到端 curl 全链路用例
> 与逐项验收清单。Sprint 0 用例 1-5 作回归检查；新增用例 6-8 覆盖 D4-D9 落地能力。
> 任一用例失败 → 标记问题并提 Sprint 1 收尾 bug。

---

## 一、环境准备（约 10 分钟）

```bash
# 1. 启 PostgreSQL（生产 dev.aizhetech.com:5432 / 本地 localhost:5432）
#    Sprint 1 凭 dev.aizhetech.com，appsettings 走 DbMigrator/appsettings.secrets.json

# 2. drop + DbMigrator（注意：AGENTS.md 约定，勿单跑 dotnet ef database update）
cd SupplyCores
cd modules/nova.supplycores/src/Nova.SupplyCores.EntityFrameworkCore
dotnet ef database drop --force --no-build
cd -
dotnet build src/SupplyCores.DbMigrator/SupplyCores.DbMigrator.csproj  # 关键：rebuild 防 stale assembly 漏 migration
dotnet run --project src/SupplyCores.DbMigrator

# 3. 启 Web
dotnet run --project src/SupplyCores.Web
# → 打开 http://localhost:5100/swagger
```

**预期日志关键行**：

```
NovaSync Pass 1 完成：读 996，跳过已存在 0，新增 996（其中阜矿本部自指 1）。
WarehouseSeed 完成：新增 6，跳过已存在 0，缺组织 0。
```

**预期 EF migrations**（3 条）：

```sql
SELECT "MigrationId" FROM "__EFMigrationsHistory" ORDER BY "MigrationId";
-- 20260512033645_Init
-- 20260512084400_Add_DemandRequest
-- 20260512093211_Add_PurchasePlan
```

**预期表清单**（新增 4 张，schema `m`）：

| Schema | 表 | 新增于 |
|---|---|---|
| `m` | demand_request / demand_request_line | D6 |
| `m` | purchase_plan / purchase_plan_line | D8 |

**预期 sub_group_id 索引（≥ 4 个）**：

```sql
SELECT indexname FROM pg_indexes
WHERE schemaname='m' AND indexname LIKE '%sub_group%';
-- IX_demand_request_sub_group_id
-- IX_demand_request_line_sub_group_id
-- IX_purchase_plan_sub_group_id
-- IX_purchase_plan_line_sub_group_id
```

**预期组织数（NovaSync 真实同步）**：

```sql
SELECT count(*) FROM m.organization;
-- 996（1 集团根 + 1 阜矿本部 + 24 厂矿 + 970 部门/班组）
```

---

## 二、端到端 curl 用例

> 假定 Web 起在 `http://localhost:5100`。Sprint 1 phase 1 仍未挂权限，无需 Token。
> 凡涉及 `OrgId`，从 §一的 996 组织里挑一个**厂矿级**（org_level=3）。

### 用例 1-5：Sprint 0 回归（org 树 / Material / Supplier / 审计 / 资质过期）

按 [Sprint-0-Demo-脚本-V0.1.md](./Sprint-0-Demo-脚本-V0.1.md) §二 用例 1-5 跑完即可，
确认 Sprint 1 改动未触发回归。Sprint 1 主要新增点：

- DTO `CreateUpdateMaterialDto.MaterialCode` 由 `[Required]` 改 `[StringLength(16)]`（可选）
- `MaterialAppService.CreateAsync` 不传 `materialCode` 时自动生成（用例 6 验证）

---

### 用例 6 — Material 编码生成 + 批量导入（D4 + D5）

#### 6.1 自动编码生成

```bash
# 取 HG（火工品）类目 Id
HG_ID=$(curl -s "http://localhost:5100/api/supply-cores/material-categories?filter=HG" | jq -r '.items[0].id')

# 不传 materialCode，让 generator 自动生成 HG000001
curl -s -X POST http://localhost:5100/api/supply-cores/materials \
  -H "Content-Type: application/json" \
  -d "{
    \"materialName\": \"火工品测试 1\",
    \"materialType\": \"一般物料\",
    \"categoryId\": $HG_ID,
    \"mainUnitId\": 1, \"purchaseUnitId\": 1, \"inventoryUnitId\": 1, \"issuanceUnitId\": 1,
    \"effectiveDate\": \"2026-05-12\"
  }" | jq '.materialCode'
# 预期: "HG000001"

# 再造 2 个 → 序号递增
curl -s -X POST http://localhost:5100/api/supply-cores/materials \
  -H "Content-Type: application/json" \
  -d "{\"materialName\":\"火工品-2\",\"materialType\":\"一般物料\",\"categoryId\":$HG_ID,\"mainUnitId\":1,\"purchaseUnitId\":1,\"inventoryUnitId\":1,\"issuanceUnitId\":1,\"effectiveDate\":\"2026-05-12\"}" | jq '.materialCode'
# 预期: "HG000002"
```

**验收**：

- 返回 `materialCode` 匹配 `^[A-Z]{2}\d{6}$`（详设 03 V1.1 §3.1 编码规则）
- 同 category 序号严格递增；不同 category 独立分桶
- 数据库 `sy.sequence_generator` 出现 prefix=`MAT_HG`、`MAT_ZH` 等行，CurrentValue 同步增长

#### 6.2 CSV 批量导入

```bash
cat > /tmp/materials-bulk.csv <<EOF
material_name,material_type,category_id,main_unit_id,purchase_unit_id,inventory_unit_id,issuance_unit_id,effective_date
钢丝绳 A,一般物料,$HG_ID,1,1,1,1,2026-05-12
钢丝绳 B,一般物料,$HG_ID,1,1,1,1,2026-05-12
钢丝绳 C,一般物料,$HG_ID,1,1,1,1,2026-05-12
钢丝绳 D,一般物料,$HG_ID,1,1,1,1,2026-05-12
钢丝绳 E,一般物料,$HG_ID,1,1,1,1,2026-05-12
EOF

curl -s -X POST http://localhost:5100/api/supply-cores/materials/bulk-import \
  -F "file=@/tmp/materials-bulk.csv" | jq '.'
# 预期: { "total":5, "succeeded":5, "failed":0, "importLogId":<某 long>, "failures":[] }
```

**验收**：

- 返回 `{succeeded: 5, failed: 0}`（任务卡 D5-3 验收主用例）
- `a.data_import_log` 增 1 行，`import_type=Material` / `status=成功` / `total_records=5`
- `a.data_import_failure_row` 不变（无失败行）
- 5 行物料的 `material_code` 全部按 HG 桶自动递增

#### 6.3 部分失败容错

```bash
cat > /tmp/materials-mixed.csv <<EOF
material_name,material_type,category_id,main_unit_id,purchase_unit_id,inventory_unit_id,issuance_unit_id,effective_date
合法 1,一般物料,$HG_ID,1,1,1,1,2026-05-12
,一般物料,$HG_ID,1,1,1,1,2026-05-12
合法 3,一般物料,$HG_ID,1,1,1,1,2026-05-12
EOF

curl -s -X POST http://localhost:5100/api/supply-cores/materials/bulk-import \
  -F "file=@/tmp/materials-mixed.csv" | jq '{total, succeeded, failed, failures: .failures | length}'
# 预期: { "total":3, "succeeded":2, "failed":1, "failures":1 }
```

**验收**：第 2 行缺 `material_name` → 整批继续；`a.data_import_failure_row` 新增 1 行
（`error_code=SupplyCores:Material:ImportFieldRequired`，`raw_row_data` 为 jsonb 完整快照）。

---

### 用例 7 — DemandRequest 全生命周期（D6 + D7）

```bash
# 取一个厂矿 + 物料
ORG_ID=$(curl -s "http://localhost:5100/api/supply-cores/organizations?filter=阜新煤业" | jq -r '.items[0].id')
M1=$(curl -s "http://localhost:5100/api/supply-cores/materials?filter=HG000001" | jq -r '.items[0].id')

# 7.1 创建草稿（自动写入钩子触发 sub_group_id 反查）
DR_ID=$(curl -s -X POST http://localhost:5100/api/supply-cores/demand-requests \
  -H "Content-Type: application/json" \
  -d "{
    \"requestNo\": \"DR-DEMO-001\",
    \"orgId\": $ORG_ID,
    \"usageUnitId\": $ORG_ID,
    \"planPeriod\": \"2026-05\",
    \"priority\": \"一般\",
    \"requestReason\": \"Sprint 1 Demo 试点需求\",
    \"lines\": [
      { \"lineNo\": 1, \"materialId\": $M1, \"quantity\": 10, \"unitId\": 1, \"estimatedUnitPrice\": 5 }
    ]
  }" | jq -r '.id')
echo "DemandRequest Id = $DR_ID"

# 验证 sub_group_id 已自动回算（应等于厂矿所属二级集团 id，非 null）
curl -s http://localhost:5100/api/supply-cores/demand-requests/$DR_ID | jq '{requestState, subGroupId, createdOrgId, totalLineCount, totalEstimatedAmount}'
# 预期: requestState="草稿", subGroupId=<某 long, 非 null>, totalEstimatedAmount=50

# 7.2 提交审批
curl -s -X POST http://localhost:5100/api/supply-cores/demand-requests/$DR_ID/submit | jq '.requestState'
# 预期: "待审"

# 7.3 审批通过（同步触发 P-02 linkage —— 见用例 8）
curl -s -X POST "http://localhost:5100/api/supply-cores/demand-requests/$DR_ID/approve?approverUserId=1" | jq '.requestState, .approvedBy, .planId'
# 预期: "已审", 1, <某 long, P-02 plan_id 回填>

# 7.4 验证驳回路径（造一个新 DR 走驳回）
DR2_ID=$(curl -s -X POST http://localhost:5100/api/supply-cores/demand-requests \
  -H "Content-Type: application/json" \
  -d "{\"requestNo\":\"DR-DEMO-002\",\"orgId\":$ORG_ID,\"usageUnitId\":$ORG_ID,\"planPeriod\":\"2026-05\",\"priority\":\"一般\",\"requestReason\":\"驳回测试\",\"lines\":[{\"lineNo\":1,\"materialId\":$M1,\"quantity\":1,\"unitId\":1}]}" | jq -r '.id')
curl -s -X POST http://localhost:5100/api/supply-cores/demand-requests/$DR2_ID/submit > /dev/null
curl -s -X POST http://localhost:5100/api/supply-cores/demand-requests/$DR2_ID/reject \
  -H "Content-Type: application/json" -d '{"reason":"数量偏小"}' | jq '.requestState, .rejectReason'
# 预期: "已驳回", "数量偏小"
```

**验收**：

- 4 endpoint 全 200 OK；状态机按详设 §4.4.3 走通
- `sub_group_id` 非 null（D6-6 写入钩子接通的验收主用例）
- 明细行（`m.demand_request_line`）`sub_group_id` 与主表一致
- `total_estimated_amount` 由服务层 `Sum(qty * price)` 计算填充

---

### 用例 8 — P-01 → P-02 自动 linkage（D8 + D9）

```bash
# 8.1 在同 org 同月再造 3 个 DR + approve（含用例 7.1-7.3 的第 1 个，共 4 个 DR）
for i in 3 4 5; do
  DR_NEW=$(curl -s -X POST http://localhost:5100/api/supply-cores/demand-requests \
    -H "Content-Type: application/json" \
    -d "{\"requestNo\":\"DR-DEMO-00$i\",\"orgId\":$ORG_ID,\"usageUnitId\":$ORG_ID,\"planPeriod\":\"2026-05\",\"priority\":\"一般\",\"requestReason\":\"Demo #$i\",\"lines\":[{\"lineNo\":1,\"materialId\":$M1,\"quantity\":$((i * 5)),\"unitId\":1,\"estimatedUnitPrice\":5}]}" | jq -r '.id')
  curl -s -X POST http://localhost:5100/api/supply-cores/demand-requests/$DR_NEW/submit > /dev/null
  curl -s -X POST "http://localhost:5100/api/supply-cores/demand-requests/$DR_NEW/approve?approverUserId=1" > /dev/null
done

# 8.2 查 PurchasePlan：同 org 同月应只有 1 个草稿（包含 4 行 line）
curl -s "http://localhost:5100/api/supply-cores/purchase-plans?orgId=$ORG_ID&planPeriod=2026-05&dataSource=%E9%9C%80%E6%B1%82%E6%8F%90%E6%8A%A5" | \
  jq '.items | {count: length, plan: .[0]}'
# 预期: count=1, plan.totalItems=4, plan.approvalState="草稿",
#       plan.subGroupId=<与源 DR 一致>

PLAN_ID=$(curl -s "http://localhost:5100/api/supply-cores/purchase-plans?orgId=$ORG_ID&planPeriod=2026-05&dataSource=%E9%9C%80%E6%B1%82%E6%8F%90%E6%8A%A5" | jq -r '.items[0].id')

# 8.3 P-02 草稿 submit + approve
curl -s -X POST http://localhost:5100/api/supply-cores/purchase-plans/$PLAN_ID/submit | jq '.approvalState'
# 预期: "待审"
curl -s -X POST "http://localhost:5100/api/supply-cores/purchase-plans/$PLAN_ID/approve?approverUserId=1" | jq '.approvalState, .approvedBy'
# 预期: "已审", 1
```

**验收（D8-4 + D9-4 主用例）**：

- **聚合幂等**：4 个同 org 同月 DR → 1 个 P-02 草稿
- **sub_group_id 端到端继承**：`m.purchase_plan.sub_group_id` 等于源 DR 的（原则 3）
- **plan_id 回写**：所有 4 个 DR 的 `m.demand_request.plan_id` 都 = P-02 主键
- **P-03 行级回溯**：`m.purchase_plan_line.demand_request_id` / `demand_line_id` 完整回填
- **`(org_id, plan_period, data_source)` 复合索引保证幂等性能**

---

## 三、验收对照表

| 任务卡条目 | Demo 用例 | 通过条件 |
|---|---|---|
| D4-1/2/3/4 编码生成 | 用例 6.1 | 自动生成 `^[A-Z]{2}\d{6}$` |
| D5-1/2/3 批量导入 | 用例 6.2 | `succeeded=5 failed=0` |
| D5-2 失败容错 | 用例 6.3 | `failed=1` + `a.data_import_failure_row` 增 1 |
| D6-1~6 P-01 实体 + 钩子 | 用例 7.1 | sub_group_id 非 null |
| D7-1~5 P-01 AppService | 用例 7.2~7.4 | 4 endpoint 全通 + 状态机正确 |
| D8-1~3 P-02 实体 + 状态机 | 用例 8.3 | submit/approve 200 + ApprovalState 流转 |
| D8-4 真实 linkage | 用例 8.2 | 4 DR → 1 P-02 |
| D9-1~3 P-02 AppService | 用例 8.2~8.3 | 5 endpoint 全通 |
| D9-4 端到端链测 | 用例 7 + 8 整体 | 100% 通过 |

---

## 四、容器化部署验证（D10-3）

```bash
cd SupplyCores
docker compose down -v  # 清空旧数据
docker compose up -d --build
docker compose logs -f supplycores-web   # 等 NovaSync Pass 1 完成

# 在容器外跑 §二 全套用例（端口走 5100）
# 验收：容器内 demo 全 200 OK
```

按 [`docs/部署/试点单位部署指南-V0.1.md`](../部署/试点单位部署指南-V0.1.md) §四"启动顺序"操作。

---

## 五、问题登记区

| # | 用例 | 现象 | 严重程度 | 处理 |
|---|---|---|---|---|
| | | | | |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-12 | 首版：Sprint 1 D10-4 起草。覆盖新增用例 6-8（D4-D9 落地能力）+ Sprint 0 用例 1-5 回归引用；§四 容器化部署验证；§三 任务卡条目对照表。 |
