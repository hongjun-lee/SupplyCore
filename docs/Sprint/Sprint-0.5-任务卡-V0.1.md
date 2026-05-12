# Sprint 0.5 任务卡 — DB 命名风格统一 + 详设字段术语对齐（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-11
**文档性质：** 开发实施层 · Sprint 任务卡（夹缝小 Sprint）
**适用范围：** Sprint 0 完成后立即执行（1-2 天）
**前置：** Sprint 0 已完成 D1-5 抽象基类 + Wave7 M-09/10/11 供应商三件套
**衔接：**
- 上游 → [`Sprint-0-任务卡-V0.1.md`](./Sprint-0-任务卡-V0.1.md)
- 下游 → Sprint 1（第 2 批 P0 采购入库 / 库存调拨 / 盘点废旧）

---

## 一、目标与背景

### 1.1 目标

把工程层和详设层在命名风格上统一为 **snake_case**（PostgreSQL 行业惯例 + DBA 友好），并完成 ABP 概念术语对齐。

### 1.2 现状不一致

| 维度 | 详设（设计层）| 工程（实施层 Sprint 0 后）|
|---|---|---|
| 风格 | snake_case 业务名（`created_at`）| PascalCase ABP 默认（`CreationTime`）|
| 字段语义 | `created_at` / `updated_at` / `version_no` | `CreationTime` / `LastModificationTime` / `ConcurrencyStamp` |
| 已固化范围 | 12 个详设文档 V1.0-V1.2 | 24 张表 + Wave1-7 共 7 个 migration |

**两边对不上**，Sprint 1 业务开发期再改的话每个新模块都要受影响，所以现在做最划算。

### 1.3 决策（已拍板 2026-05-11）

**采用方案 D**：
- 详设字段名保留 snake_case（业务方/DBA 友好）+ 与 ABP 概念对齐
- 工程层加 `EFCore.NamingConventions` → ABP 属性 `CreationTime` 自动映射 DB 列 `creation_time`
- 全库统一 snake_case
- 开发期 reset DB（最干净，不写 rename migration）

---

## 二、字段术语对齐表

### 2.1 ABP 标准字段（详设字段名调整后与 ABP 概念一致）

| 旧详设字段（snake_case 业务名）| 新详设字段（snake_case + ABP 对齐）| ABP 实体属性 | 备注 |
|---|---|---|---|
| `created_at` | `creation_time` | `CreationTime` | 与 ABP 概念一致 |
| `created_by` | `creator_id` | `CreatorId` | 同上 |
| `updated_at` | `last_modification_time` | `LastModificationTime` | 同上 |
| `updated_by` | `last_modifier_id` | `LastModifierId` | 同上 |
| `is_deleted` | `is_deleted`（不变）| `IsDeleted` | 已一致 |
| `deleted_at` | `deletion_time` | `DeletionTime` | ABP 对齐 |
| `deleted_by` | `deleter_id` | `DeleterId` | ABP 对齐 |
| `version_no` (integer 乐观锁) | `concurrency_stamp` (varchar(40) GUID) | `ConcurrencyStamp` | **类型从 integer 改 varchar GUID 字符串** |

### 2.2 详设独有字段（ABP 没有，本仓库扩展）

| 字段 | 类型 | 说明 |
|---|---|---|
| `created_org_id` | bigint? FK→M-01 | 详设 01 §4.2：创建人所属组织（数据范围过滤用）|
| `delete_reason` | varchar(500)? | 详设 01 §4.3：软删除原因（高敏感操作必填）|
| `tenant_id` | uuid? | 一期默认全为同一租户值；ABP `TenantId` 等价 |

### 2.3 业务状态字段（不动，已是 snake_case）

详设 §4.4 `bill_state` / `approval_state` / `interface_push_state` / `finance_state` / `period_state` —— 保持 snake_case 值域不变。

---

## 三、按日任务（1-2 天）

### Day 1 上午 — 工程：加 snake_case 命名约定

| # | 任务 | 验收 |
|---|---|---|
| S05-1 | 加 NuGet 包：`EFCore.NamingConventions` 到 `Nova.SupplyCores.EntityFrameworkCore.csproj` | `dotnet restore` 通过 |
| S05-2 | 修改 `SupplyCoresDbContextFactory.cs` / `OnModelCreating`：加 `optionsBuilder.UseSnakeCaseNamingConvention()` 全局应用 | DbContext 编译通过 |
| S05-3 | 对 ABP 框架表（`AbpAuditLog` 等）单独检查 — 是否需要排除 / 如何 override 命名 | 全部映射策略确定 |

### Day 1 下午 — 工程：现有实体迁移 + Reset DB

| # | 任务 | 验收 |
|---|---|---|
| S05-4 | 16 个业务实体改继承：`FullAuditedAggregateRoot<long>` → `SupplyCoresFullAuditedAggregateRoot<long>`（Sprint 0 D1-5 已建好基类）| 全部编译通过 + 单测过 |
| S05-5 | 删除旧 migration 文件 Wave1-7（开发期 reset，不保留中间历史）| `Migrations/` 仅留 `Snapshot.cs` 占位 |
| S05-6 | 删除本地 DB：`dotnet ef database drop -p src/SupplyCores.DbMigrator --force` | DB 不存在 |
| S05-7 | 新建合并 migration：`dotnet ef migrations add Init_AllSnakeCase` | 生成的 migration 列名全 snake_case + 含 `created_org_id` / `delete_reason` 字段 |
| S05-8 | `dotnet ef database update` 跑通 | DB 重建，21 + 3 张表列名全 snake_case |
| S05-9 | Seed 数据重灌（运行 DbMigrator）| seed 数据正常 |

### Day 2 上午 — 详设字段术语全文替换

涉及详设文档（12 个）：

| 文件 | 主要替换项 |
|---|---|
| `01-数据库逻辑模型-V1.0.md` | §4.2 字段定义重写 + 全文 8 项字段名替换 |
| `02-基础档案与组织仓库详细设计-V1.0.md` | line 78 通用字段引用更新 + 全文检索 |
| `03-物料主数据与编码详细设计-V1.1.md` | 同上 |
| `04-需求计划与采购协同详细设计-V1.1.md` | 同上 |
| `05-合同与资金详细设计-V1.1.md` | 同上 |
| `06-库存实物流转详细设计-V1.1.md` | 同上 |
| `07-设备与设备租赁详细设计-V1.0.md` | 同上 |
| `08-财务与NC接口详细设计-V1.1.md` | 同上 |
| `09-报表预警与AI能力详细设计-V1.2.md` | 同上 |
| `10-权限审批流详细设计-V1.2.md` | A-13 operation_log 的 `created_at` → `creation_time`（line 314）+ 全文 |
| `11-非功能详细设计-V1.0.md` | §13 操作日志字段术语对齐 |
| `10A-权限审计域整合方案-V0.6.md` | 同上 |

**替换映射（sed 批量）**：

```bash
# 全文档全局替换（按长串优先）
sed -i '' 's/`created_at`/`creation_time`/g' docs/详细设计/*.md
sed -i '' 's/`created_by`/`creator_id`/g'    docs/详细设计/*.md
sed -i '' 's/`updated_at`/`last_modification_time`/g' docs/详细设计/*.md
sed -i '' 's/`updated_by`/`last_modifier_id`/g'      docs/详细设计/*.md
sed -i '' 's/`deleted_at`/`deletion_time`/g' docs/详细设计/*.md
sed -i '' 's/`deleted_by`/`deleter_id`/g'    docs/详细设计/*.md
sed -i '' 's/`version_no`/`concurrency_stamp`/g' docs/详细设计/*.md
# version_no 类型变化也要改：integer → varchar(40)
```

| # | 任务 | 验收 |
|---|---|---|
| S05-10 | 上述 sed 批量替换 + 人工 review 8 个字段全部到位 | `grep -r "version_no\|created_at\|created_by\|updated_at\|updated_by\|deleted_at\|deleted_by" docs/详细设计/` 应零结果 |
| S05-11 | 详设 01 §4.2 / §4.3 字段定义重写为新版（含类型 + ABP 映射注释）| 字段表完整 + 加 "对应 ABP 字段" 列 |
| S05-12 | 加映射表附录文档 `docs/详细设计/审计字段映射表-V0.1.md` | 详设字段 ↔ ABP 属性 ↔ DB 列名 三栏对照 |

### Day 2 下午 — 集成测试 + 收尾

| # | 任务 | 验收 |
|---|---|---|
| S05-13 | `dotnet test` 全部测试通过 | 0 failed |
| S05-14 | curl smoke：随便创建几个实体，看 DB 列名实际是 snake_case（`SELECT column_name FROM information_schema.columns WHERE table_schema='m' LIMIT 20`）| 全 snake_case ✓ |
| S05-15 | 详设字段术语对齐 commit + push | commit message: `refactor(docs): 详设字段术语 snake_case + ABP 对齐` |
| S05-16 | 工程层 commit + push | commit message: `feat(db): snake_case 命名约定 + 自定义抽象基类 + Wave 合并重做` |
| S05-17 | Sprint 1 启动会议 | 第 2 批 P0 准备就绪 |

---

## 四、风险 / 应对

| # | 风险 | 应对 |
|---|---|---|
| 1 | **reset DB 误删生产数据** | 仅适用本地开发 / 测试环境；如已有试点单位真实数据，必须改写 rename migration 方案（工作量 +1-2 天）|
| 2 | ABP 框架表（`AbpAuditLog` / `AbpUsers` 等）`UseSnakeCaseNamingConvention()` 后列名变化 | Day 1 早上验证：观察 migration diff，必要时对 ABP 框架表用 `[Keyless]` / `Ignore()` 保持原 PascalCase 或全库统一 snake_case（推荐后者）|
| 3 | 详设字段替换不彻底（部分文档中含 sed 未匹配的引用）| Day 2 上午 sed 后人工 grep review；重点检查 markdown 表格 + 代码块内的字段名 |
| 4 | `version_no` 类型变化（integer → varchar GUID） | 详设 01 §4.2 重写时明确类型变化 + 字段长度 varchar(40)；任何文档中引用 `version_no` 自增 / 数字比较的语义需调整 |
| 5 | Sprint 0 已建的 `CreatedOrgId` / `DeleteReason` 字段在新 migration 中保留 | Day 1 下午 S05-4 + S05-7 验证 |

---

## 五、Definition of Done

- [ ] DB 全部表列名为 snake_case（含业务表 + ABP 框架表）
- [ ] 详设 12 个文档零残留旧字段名（grep 验证）
- [ ] 详设 01 §4.2 / §4.3 重写完毕 + 加附录映射表
- [ ] 16 个业务实体 + Wave7 M-09/10/11 全部继承 `SupplyCoresFullAuditedAggregateRoot<long>`
- [ ] `version_no` 完全替换为 `concurrency_stamp`（含类型变化）
- [ ] xUnit 测试 0 失败
- [ ] commit + push（文档 / 工程各一）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-11 | 首版：方案 D（详设字段名对齐 ABP 概念 + 全库 snake_case）；1-2 天工作量；reset DB 路径；version_no → concurrency_stamp 类型变化；衔接 Sprint 0 D1-5 抽象基类 |
