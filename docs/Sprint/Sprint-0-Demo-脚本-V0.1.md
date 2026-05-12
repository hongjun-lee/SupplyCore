# Sprint 0 Demo 脚本（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-11
**文档性质：** Sprint 验收 · 演示脚本
**衔接：** [Sprint-0-任务卡-V0.1.md](./Sprint-0-任务卡-V0.1.md) D14 整体 demo

> 本脚本对照 Sprint 0 任务卡 §1.4 完成标准 + D14 验收表，提供端到端 curl 全链路用例与逐项验收清单。
> 任一用例失败 → 标记问题并提 Sprint 0 收尾 bug。

---

## 一、环境准备（约 15 分钟）

```bash
# 1. PostgreSQL 已起（端口 5432，库 supplycores_dev）
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE supplycores_dev;" || true

# 2. 配置 appsettings.Local.json（如未配置）
cat > SupplyCores/src/SupplyCores.DbMigrator/appsettings.Local.json <<EOF
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=supplycores_dev;Username=postgres;Password=postgres;Include Error Detail=true"
  }
}
EOF

# 3. 跑迁移 + Seed
cd SupplyCores
dotnet ef database update \
  -p modules/nova.supplycores/src/Nova.SupplyCores.EntityFrameworkCore \
  --connection "Host=localhost;Port=5432;Database=supplycores_dev;Username=postgres;Password=postgres"
dotnet run --project src/SupplyCores.DbMigrator

# 4. 启 Web
dotnet run --project src/SupplyCores.Web
# → 打开 http://localhost:44366/swagger
```

**预期表清单**（24 张）：

| Schema | 表 | 数量 |
|---|---|---|
| `m` | unit / unit_conversion / organization / warehouse / warehouse_zone / storage_location / material_category / material / material_attribute / material_attribute_value / nc_material_mapping / material_lot / material_request / supplier / supplier_qualification / supplier_blacklist | 16 |
| `a` | operation_log / sensitive_operation / ai_call_log / interface_operation_log / data_import_log / data_import_failure_row / data_export_log / business_data_scope_grant | 8 |
| `sy` | sequence_definition | 1 |

**预期 Seed**：
- `a.sensitive_operation` 19 条系统级条目（SENS-INV-001 ~ SENS-RPT-001）
- `m.supplier` 5 家（SUP-2026-0001 ~ SUP-2026-0005，state=潜在）

```sql
-- 验证 Seed
SELECT operation_code, operation_name FROM a.sensitive_operation ORDER BY operation_code;
SELECT supplier_code, supplier_name, supplier_state FROM m.supplier ORDER BY supplier_code;
```

---

## 二、端到端 curl 用例

> 假定 Web 起在 `http://localhost:44366`。Sprint 0 phase 1 未挂权限，无需 Token。

### 用例 1 — 17 家组织树

```bash
curl -s http://localhost:44366/api/supply-cores/organizations/tree | jq '.'
```

**验收**：返回组织树 JSON；树深度正确（集团 → 物资公司 → 矿/厂/子公司）；如 seed 仅 5-6 家也算通过。

---

### 用例 2 — Material 全生命周期（7 状态机 8 endpoint）

```bash
# 2.1 创建（默认 state=待申请）
MID=$(curl -s -X POST http://localhost:44366/api/supply-cores/materials \
  -H "Content-Type: application/json" \
  -d '{
    "materialCode": "MAT-DEMO-0001",
    "materialName": "DEMO 测试物料",
    "materialType": "一般物料",
    "categoryId": 1,
    "mainUnitId": 1,
    "purchaseUnitId": 1,
    "inventoryUnitId": 1,
    "issuanceUnitId": 1,
    "effectiveDate": "2026-05-11"
  }' | jq -r '.id')
echo "Material Id = $MID"

# 2.2 提交申请：待申请 → 待审核
curl -s -X POST http://localhost:44366/api/supply-cores/materials/$MID/submit-for-review | jq '.materialState'
# 预期: "待审核"

# 2.3 审批通过（含财务联动）：待审核 → 待映射
curl -s -X POST "http://localhost:44366/api/supply-cores/materials/$MID/approve?requiresFinanceMapping=true" | jq '.materialState'
# 预期: "待映射"

# 2.4 NC 映射确认：待映射 → 启用（会触发 NC-MD-001 mock 推送，1-2 秒延迟）
curl -s -X POST http://localhost:44366/api/supply-cores/materials/$MID/confirm-nc-mapping | jq '.materialState'
# 预期: "启用"

# 2.5 发起变更 + 变更完成
curl -s -X POST http://localhost:44366/api/supply-cores/materials/$MID/start-change | jq '.materialState'  # 变更中
curl -s -X POST "http://localhost:44366/api/supply-cores/materials/$MID/end-change?reverted=false" | jq '.materialState'  # 启用

# 2.6 停用 → 重启 → 停用 → 归档
curl -s -X POST http://localhost:44366/api/supply-cores/materials/$MID/disable | jq '.materialState'      # 停用
curl -s -X POST http://localhost:44366/api/supply-cores/materials/$MID/reactivate | jq '.materialState'   # 启用
curl -s -X POST http://localhost:44366/api/supply-cores/materials/$MID/disable | jq '.materialState'      # 停用
curl -s -X POST http://localhost:44366/api/supply-cores/materials/$MID/archive | jq '.materialState'      # 归档
```

**验收**：
- 8 个 endpoint 全 200 OK
- 状态机迁移按详设 §4.2.2 表格走通
- 非法迁移（如归档后再 reactivate）返回 400 + `SupplyCores:Material:InvalidStateTransition`

---

### 用例 3 — Supplier 三件套（M-09 + M-10 + M-11）

#### 3.1 Supplier 主流程

```bash
# 取 seed 第 1 家
SID=$(curl -s "http://localhost:44366/api/supply-cores/suppliers?filter=SUP-2026-0001" | jq -r '.items[0].id')

# 3.1.1 合格化（潜在 → 合格）+ NC-MD-003 推送
curl -s -X POST "http://localhost:44366/api/supply-cores/suppliers/$SID/qualify?qualifiedDate=2026-05-11" | jq '.supplierState'
# 预期: "合格"

# 3.1.2 累加角色标签（自动去重）
curl -s -X POST "http://localhost:44366/api/supply-cores/suppliers/$SID/role-tags?tag=投标" | jq '.roleTags'
curl -s -X POST "http://localhost:44366/api/supply-cores/suppliers/$SID/role-tags?tag=中标" | jq '.roleTags'
curl -s -X POST "http://localhost:44366/api/supply-cores/suppliers/$SID/role-tags?tag=中标" | jq '.roleTags'  # 重复不增加

# 3.1.3 标为负面（合格 → 负面，24 月冷却）
curl -s -X POST "http://localhost:44366/api/supply-cores/suppliers/$SID/mark-as-negative?cooldownUntil=2028-05-11&reason=综合评价D" | jq '.supplierState'
# 预期: "负面"

# 3.1.4 整改恢复（负面 → 合格）
curl -s -X POST "http://localhost:44366/api/supply-cores/suppliers/$SID/restore?reason=整改完成审核通过" | jq '.supplierState'
# 预期: "合格"
```

#### 3.2 黑名单流程（A-11 高敏感，触发 SENS-SUP-001）

```bash
# 3.2.1 列入黑名单（合格 → 黑名单）
curl -s -X POST "http://localhost:44366/api/supply-cores/suppliers/$SID/blacklist?reason=严重违约重大事故" | jq '.supplierState'
# 预期: "黑名单"

# 3.2.2 直接 Supplier.Delist 解除（A-11 高敏感，AuditingStore 应识别 [SENS-SUP-001]）
curl -s -X POST "http://localhost:44366/api/supply-cores/suppliers/$SID/delist?reason=项目领导小组审批通过补救完成" | jq '.supplierState'
# 预期: "合格"
```

#### 3.3 资质（M-10）增删改查

```bash
QID=$(curl -s -X POST http://localhost:44366/api/supply-cores/supplier-qualifications \
  -H "Content-Type: application/json" \
  -d "{
    \"supplierId\": $SID,
    \"qualType\": \"营业执照\",
    \"qualNo\": \"91370800MA3R6X5T8K\",
    \"issueOrg\": \"济宁市市场监督管理局\",
    \"issueDate\": \"2020-01-01\",
    \"expireDate\": \"2030-01-01\",
    \"isLongValid\": false
  }" | jq -r '.id')

# 续期
curl -s -X POST "http://localhost:44366/api/supply-cores/supplier-qualifications/$QID/renew?newExpireDate=2035-01-01" | jq '.expireDate'
```

#### 3.4 黑名单台账（M-11，独立记录表）

```bash
BID=$(curl -s -X POST http://localhost:44366/api/supply-cores/supplier-blacklists \
  -H "Content-Type: application/json" \
  -d "{
    \"supplierId\": $SID,
    \"reason\": \"严重违约具体情节描述\",
    \"reasonType\": \"重大违约\",
    \"listedDate\": \"2026-05-11\",
    \"listedBy\": \"00000000-0000-0000-0000-000000000001\",
    \"listApproverId\": \"00000000-0000-0000-0000-000000000002\"
  }" | jq -r '.id')

# 解除流程：提交申请 → 审批 → 已解除
curl -s -X POST "http://localhost:44366/api/supply-cores/supplier-blacklists/$BID/submit-delist-request?delistReason=整改完成补救到位" | jq '.status'
# 预期: "解除待审"

curl -s -X POST "http://localhost:44366/api/supply-cores/supplier-blacklists/$BID/approve-delist?delistBy=00000000-0000-0000-0000-000000000003&delistApproverId=00000000-0000-0000-0000-000000000004" | jq '.status'
# 预期: "已解除"
```

---

### 用例 4 — 审计日志（A-13 OperationLog + A-15 InterfaceOperationLog）

跑完用例 2-3 后查表：

```sql
-- A-13：业务操作 30+ 条
SELECT count(*), operation_type FROM a.operation_log GROUP BY operation_type ORDER BY count DESC;

-- 高敏感识别：SENS-SUP-001 应该至少 1 条
SELECT operation_type, change_reason FROM a.operation_log WHERE change_reason LIKE '%SENS-SUP-001%';

-- A-15：NC 接口推送 2 条（NC-MD-001 + NC-MD-003）
SELECT interface_id, operation_type, operation_details FROM a.interface_operation_log ORDER BY creation_time DESC LIMIT 5;
```

**验收**：
- `a.operation_log` ≥ 20 行（用例 2 至少 8 行 Material 状态机 + 用例 3 多条 Supplier）
- 至少 1 行 ChangeReason 包含 `[SENS-SUP-001]`，OperationType 含 `SENSITIVE_` 前缀
- `a.interface_operation_log` 至少 2 行（含 NC-MD-001 + NC-MD-003），DurationMs 在 1000-2000 之间
- 约 5% 概率会有 1 行 `operation_type='推送失败'`（mock 模拟）

---

### 用例 5 — 资质过期 cron worker（仅观察，不强制时序）

```bash
# 等 SupplierQualificationExpiryWorker 触发（每 6 小时），或重启服务立即触发一次
# 跑完后查：
psql ... -c "SELECT id, qual_type, expire_date, qualification_status FROM m.supplier_qualification WHERE qualification_status='待更新';"
```

**验收**：距到期 ≤ 90 天且 IsLongValid=false 的资质应被自动标为"待更新"。

---

## 三、验收对照表

| Task card §1.4 完成标准 | 验收用例 | 状态 |
|---|---|---|
| M 域 16+ 实体全部 CRUD API 通 | Swagger 16 个 controller 全可见 + 用例 2-3 跑通 | ⬜ |
| 审计日志自动写入 | 用例 4 第一条 SQL | ⬜ |
| 高敏感操作触发 SensitiveOperation 双签 | 用例 3.2 + 用例 4 第二条 SQL | ⬜ |
| NC-MD-001/002/003 mock 接通 | 用例 2.4 / 3.1.1 + 用例 4 第三条 SQL | ⬜ |
| 后端 xUnit 测试 ≥ 30 个用例 | `dotnet test`（Domain.Tests 56 + Application.Tests 5 = 61，已超额） | ✅ |
| 可独立部署给试点单位试用 | docker-compose 包 / IIS 部署文档（Sprint 0 末交付） | ⬜ |

---

## 四、试点单位部署包

### 4.1 Docker compose（推荐）

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: supplycores_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  supplycores-web:
    build:
      context: ../SupplyCores
      dockerfile: Dockerfile
    environment:
      ConnectionStrings__Default: "Host=postgres;Port=5432;Database=supplycores_dev;Username=postgres;Password=postgres"
    ports: ["44366:80"]
    depends_on: [postgres]

volumes:
  postgres_data:
```

> Dockerfile 待 Sprint 0 末提交（基于 `mcr.microsoft.com/dotnet/aspnet:10.0`）。

### 4.2 IIS 部署（备选）

参考 Nova 现有 IIS 部署文档；需为 SupplyCores.Web 单独建一个站点 + Application Pool（.NET 10）。

---

## 五、问题登记区

| 序号 | 用例 | 问题描述 | 处理人 | 处理状态 |
|---|---|---|---|---|
| | | | | |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-11 | 首版 demo 脚本：5 个端到端用例 + 验收对照表 + 部署包草案；对照 Sprint-0-任务卡 D14 验收 |
