# Sprint 1 任务卡 — Stage A 收尾 + B2 启动（V0.7）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.7（D6-1 fulfillment_type 笔误修正：详设 04 §4.4.1 P-01 不含此字段）
**日期：** 2026-05-12
**文档性质：** 开发实施层 · Sprint 任务卡
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 1（10 工作日 / 约 2 周）
**衔接文档：**

- 上游业务节奏 → [`../流程调研/存货问题解决方案-领导汇报-V0.1.md`](../流程调研/存货问题解决方案-领导汇报-V0.1.md) §2.1 P0 第 1 批（4-12 周）+ 第 2 批（13-22 周）启动
- 上游工时模型 → [`开发进度规划-V0.5.md`](../详细设计/开发进度规划-V0.5.md) §3.1 模块工时 + §5.1 阶段拆分
- 上游 Sprint 节奏 → [`Sprint-0-任务卡-V0.1.md`](./Sprint-0-任务卡-V0.1.md) + [`Sprint-0.5-任务卡-V0.1.md`](./Sprint-0.5-任务卡-V0.1.md)
- 详设依据 → [`02-基础档案与组织仓库详细设计-V1.1.md`](../详细设计/02-基础档案与组织仓库详细设计-V1.1.md) / [`03-物料主数据与编码详细设计-V1.1.md`](../详细设计/03-物料主数据与编码详细设计-V1.1.md) / [`04-需求计划与采购协同详细设计-V1.1.md`](../详细设计/04-需求计划与采购协同详细设计-V1.1.md) / [`11-非功能详细设计-V1.0.md`](../详细设计/11-非功能详细设计-V1.0.md)
- 数据隔离边界 → [`评审留痕/数据隔离边界sub_group_id修订建议清单-V0.1.md`](../详细设计/评审留痕/数据隔离边界sub_group_id修订建议清单-V0.1.md) §四 影响范围列明本任务卡为待联动项
- NovaSync 切换 → [`NovaSync 实施层切换方案-V0.2.md`](../详细设计/NovaSync%20实施层切换方案-V0.2.md) — 开发期 Npgsql 直连 / 生产期 HttpReader 切换方案
- API 契约清单 → [`10A-给Catio团队的字段缺口提问清单-V1.1.md`](../详细设计/10A-给Catio团队的字段缺口提问清单-V1.1.md) §十二 NovaSync API 契约（V1.1 新增）
- Sprint 0 Demo → [`Sprint-0-Demo-脚本-V0.1.md`](./Sprint-0-Demo-脚本-V0.1.md)
- 工程约定 → `../../../SupplyCores/AGENTS.md`

---

## 一、目标与范围

### 1.1 目标

**两条主线并行：**

1. **Stage A 收尾**（V0.4 §5.1 阶段 A 1.5-2 个月预算的剩余 ~10%）：
   - **NovaOrganizationSyncContributor 第一次落地**——从 Catio 生产 `Host=fxkyjt.cn;Port=5432;Database=Nova` `platform.organizations` 同步**集团根（能源集团 level 1）祖先链 + 阜新矿业（sub_group_id = `40351efe-a370-4239-96fc-1b53a57714de`）完整子树共 996 行**（1 集团根 + 1 阜矿本部 + 24 厂矿 + level 4-7 部门/班组 970）
   - **设计姿态**：系统为**辽宁能源集团整体**设计，一期数据范围为**集团根 + 阜矿子树**；其他二级集团（清能 / 铁煤 / 沈煤 / 抚顺矿业等共 10 家）按需逐步接入，框架不动只追加 RootSubGroupId
   - **集团级汇总能力**：parent_id 链路完整到集团根 → 能源集团级跨二级集团报表自然成立；sub_group_id 一刀切过滤（评审留痕 §三 原则 2）保留作为二级集团范围内主用
   - Warehouse 链（M-02 + M-03A + M-03B）3 家代表性单位 mock seed（Nova 端无仓库数据，仍 mock）
   - Docker compose + Dockerfile（Sprint 0 D14 ⬜ 唯一剩余项，汇报 §一·第一步 1.6 试点部署）
   - **人员（platform.persons 11,258 人）不在本 Sprint 范围**——含 mobile / id_number 等 PII，留 Stage B1 真实联调期同步

2. **Stage B2 启动**（V0.4 §5.2 业务模块并行 990 PD，本 Sprint 跑通 03 编码生成 + 04 P-01/P-02 主链）：
   - 03 物料编码生成器 + 批量导入服务（V0.4 §3.1 03 模块 5 PD "批量导入"）
   - 04 P-01 demand_request + P-06 demand_request_line 需求提报全链
   - 04 P-02 purchase_plan + P-03 purchase_plan_line 采购计划全链

### 1.1.1 组织数据双轨查询模式（V0.6 澄清）

`m.organization` 上**两个并行字段**分担不同职责：

| 维度 | `sub_group_id`（bigint, 评审留痕 §修订 #4） | `org_code`（varchar(32), 来自 Catio path 编码）|
|------|------------------------------------------|-----------------------------------------|
| **设计目标** | 数据隔离边界（权限） | 业务汇总（任意层级）|
| **粒度** | 二级集团（一刀切） | 任意层级（path prefix）|
| **典型 SQL** | `WHERE sub_group_id = 阜矿_id` | `WHERE org_code LIKE '001.007%'` |
| **A-06 权限过滤** | ✅ 主用 | 辅助 |
| **集团级跨二级集团汇总** | ❌（要 OR 多个） | ✅ `LIKE '001%'` |
| **二级集团范围汇总** | ✅ | ✅ |
| **厂矿级汇总** | ❌（粒度不够） | ✅ `LIKE '001.007.002%'`（恒大煤矿） |
| **部门 / 班组级汇总** | ❌ | ✅ `LIKE '001.007.002.001%'` |
| **跨多家特定厂矿** | ❌ | ✅ `WHERE org_code SIMILAR TO '...'` |

**两者互补，不冲突**：
- `sub_group_id` = **谁有权限看**（access control，固定到二级集团粒度）
- `org_code` = **业务汇总到哪一层**（business roll-up，path 编码自然支持任意层级）

**实施现状**（D2 commit `a9c0466` 已落地）：`Organization.OrgCode` 字段从 `NovaOrgRow.Code` 拷贝同步，code 汇总能力已经 in place，**无需 D3 + 额外工作**。业务实体（M-04 物料 / M-09 供应商 / P-01 需求等）按汇总维度 JOIN `m.organization` 上 org_code 即可。

未来 Code Review 检查项（参考 sub_group_id 评审留痕 §三 原则 2）：
- 任何"按二级集团范围"过滤：第一选择 `WHERE sub_group_id = ?`
- 任何"按厂矿 / 部门 / 班组范围"过滤：用 `WHERE org_code LIKE ?` + JOIN `m.organization`
- 禁止用 `org_code LIKE` 做二级集团范围过滤（会与 sub_group_id 双轨混乱）

### 1.2 工程现状基线（盘点 2026-05-12）

| 已落地 | 状态 |
|--------|------|
| 命名分层（ABP PascalCase / 业务 snake_case，对齐 Catio） | ✅ Sprint 0.5 + d7540ae 收口 |
| 24 张表（16 业务 schema + 8 ABP 框架）已 migration | ✅ `20260512033645_Init.cs`（基类加 SubGroupId 后重生成）|
| **基类加 `SubGroupId`（数据隔离边界字段）** | ✅ commit `2132de1`；详见 sub_group_id 评审留痕清单 §6.3 |
| DbMigrator IDbContextProvider + UoW wiring | ✅ 4b3a4c3 修复 |
| Seed：Unit ×12 / MaterialCategory ×15 / Supplier ×5 / SensitiveOperation ×19 | ✅ DbMigrator |
| 16 实体 Domain + 11 业务 Controller / AppService（M-01/02/03A/03B/04/05/06/07/08/09/10/11/12/13/14/15/16/17）| ✅ Sprint 0 |
| Material 7 状态机 8 endpoint（M-04） | ✅ Sprint 0 D2 |
| Supplier 5 状态机 endpoint（M-09 含 SENS-SUP-001）| ✅ Sprint 0 D7-12 + 4b3a4c3 attribute 补 |
| Wave6 审计接通（自定义 SupplyCoresAuditingStore）| ✅ Sprint 0 D4-6 + 4b3a4c3 长度修复 |
| NC-MD-001/002/003 mock service | ✅ Sprint 0 D13 |
| 测试 63/63（Domain 56 + EFCore 2 + Application 5）| ✅ |
| **Catio 生产 Nova DB 连通性已验证**（`fxkyjt.cn:5432/Nova`）| ✅ 2026-05-12 探查：阜矿子树 995 行 + 11,258 人员（人员本 Sprint 不取）|
| **D1 NovaSync 配置 + Reader + Mapper + probe 工具已落地**（commit `0dcbeb0`） | ✅ 2026-05-12，75/75 测试通过；INovaSourceReader 抽象 + NpgsqlNovaSourceReader 开发期实现 + NovaUuidMapper 单进程映射 + tools/probe-nova 工具 |
| **D2 NovaOrganizationSyncContributor 已落地**（commit `a9c0466`） | ✅ 2026-05-12，79/79 测试通过；DB 实测 995 行同步成功 + 阜矿本部 sub_group_id 自指 + 二次幂等。**⚠ 需 V0.5 整改：祖先链未覆盖到集团根**——D2 同步窗口仅含阜矿子树，集团根（能源集团 level 1）漏掉，阜矿本部 parent_id=NULL（应指向集团根）。V0.5 SQL 扩祖先链 → 996 行，需重跑一次 |

> **本机 DB 同步动作（V0.3 升版后须做一次）：** `dotnet ef database drop --force` → `dotnet run --project src/SupplyCores.DbMigrator`（DbMigrator 自动 apply migration + 跑 seed/sync contributors，**勿单跑 `dotnet ef database update`**——经 Sprint 0 D14 验证，design-time 写的 history runtime 看不到，会导致表重建冲突）。Sprint 1 D1 起手前完成。

### 1.3 关键缺口

| 类型 | 缺什么 | 详设依据 | 优先级 |
|------|--------|---------|--------|
| ⚠ Sync 整改 | **NovaOrganizationSyncContributor SQL 扩祖先链**——D2 commit `a9c0466` 已落地 995 行同步但未覆盖集团根；V0.5 整改 SQL 加 recursive CTE 拉祖先链到 level 1，总数 996 行；阜矿本部 parent_id 指向集团根 bigint id（不再 NULL）；集团根 sub_group_id=NULL（评审留痕 §修订 #4 边界条件） | 02 V1.1 §4.1 + sub_group_id 清单 §修订 #4 (Nova 同步契约) | P0（D2 整改）|
| ❌ 配置 | **`appsettings.secrets.json` 加 `NovaSync` 节** —— `ConnectionString` + `RootSubGroupId` (阜矿 uuid)；只读访问；**不进 git** | sub_group_id 清单 §修订 #4 + 信安 | P0 |
| ❌ 类型映射 | **NovaUuidMapper**（内存 Dictionary<Guid, long> + nova_org_id 唯一索引）—— uuid PK ↔ SupplyCore bigint PK | 02 V1.1 §4.1 + nova_org_id 字段语义 | P0 |
| ❌ Seed | **Warehouse 链 mock seed**（3 家代表性厂矿的 m.warehouse + warehouse_zone + storage_location；Nova 端无仓库数据，仍 mock）| 02 V1.1 §3-5 | P0 |
| ❌ DevOps | **`docker-compose.yml` + `Dockerfile`**（试点单位部署包草案）| Sprint-0-Demo §4.1 + 11 V1.0 §部署框架 | P0（Sprint 0 D14 ⬜ 唯一剩余）|
| ❌ 应用层 | **MaterialCodeGenerator + BulkImportService**（M-05 一物一码 + 16 + Excel 批量导入）| 03 V1.1 §编码生成 + 5 §SY-01 序列联动 | P1 |
| ❌ 实体 + Migration | **P-01 demand_request + P-06 demand_request_line**（继承基类自动获得 `SubGroupId` + `CreatedOrgId` + `DeleteReason`） | 04 V1.1 §4.4 | P0（B2 主链入口）|
| ❌ 实体 + Migration | **P-02 purchase_plan + P-03 purchase_plan_line**（同上继承）| 04 V1.1 §4.5 | P0（B2 主链续接）|
| ❌ 应用层 | **DemandRequestAppService + PurchasePlanAppService（含状态机 endpoint）** | 04 V1.1 §4.4.3 / §4.5.3 | P0 |
| ⚠ Nova 同步契约 | **`M-01.sub_group_id` 直接吃 Catio.platform.organizations.sub_group_id** 联调验收点（一期单二级集团，本 Sprint 只出 mock；真实联调待 Stage B1 OAuth 凭据后）| sub_group_id 清单 §修订 #4 | P1（Sprint 1 出 mock + 文档占位，真联调延后）|

> P-04 plan_adjustment / P-05 purchase_task / T-01~07 招投标推后到 Sprint 2-3（详 §三 衔接）。

### 1.4 完成标准（Sprint 1 验收）

- ✅ `dotnet test SupplyCores.slnx` ≥ **75 个用例通过**（当前 63 + Sprint 1 新增 ≥ 12 单测：P-01/P-02 状态机 + Material 编码生成 + NovaUuidMapper + NovaOrganizationSyncContributor）
- ✅ Demo 脚本用例 1 重跑 `GET /api/supply-cores/organizations/tree` 返回**能源集团 → 阜新矿业 → 24 家 level 3 厂矿 → level 4-7 子树**完整三层及以上嵌套（**总 996 行**：1 集团根 + 995 阜矿子树；非空且名称为 Catio 真实命名如"辽宁省能源产业控股集团有限责任公司"/"阜新矿业（集团）有限责任公司本部"/"阜新矿业（集团）有限责任公司恒大煤矿"等）
- ✅ Demo 新用例 6：批量导入 5 条 Material（CSV）→ 编码自动按 03 §3 规则生成（HG / ZH / SB / ... 前缀 + 6 位序号）
- ✅ Demo 新用例 7：创建 P-01 需求 → 提交 → 审批 → 自动归集为 P-02 计划草稿（按 org + 月聚合）
- ✅ Demo 新用例 8：P-02 计划审批通过 → 状态转 `已审`，linkage 待 Sprint 2 接 P-05 分解
- ✅ Demo 新用例 9：**NovaSync 二次跑幂等**——`dotnet run --project DbMigrator` 重复执行，`m.organization` 行数不增（按 nova_org_id 唯一索引去重）
- ✅ `docker compose up` 在本地一行启动 supplycores-web + postgres，`/swagger` 可达
- ✅ 跑完 5+ 个 P-01 / P-02 操作，`a.operation_log` 新增 ≥ 20 行（继续 Sprint 0 验收的审计自动写入）
- ✅ **`sub_group_id` 数据隔离边界字段覆盖**（评审留痕清单 §三 原则 1 + §6.3 修订 #2 落地验证）：
  - 每张业务表（`m.*` + `a.*` + 新建的 `m.demand_request` / `m.purchase_plan` 等）DDL 必须含 `sub_group_id bigint NULL` 列（由 EnforceSnakeCaseColumnNames 自动转 snake_case）—— 已 ✅ commit `2132de1` + 验证 m schema 18 个 + sy schema 1 个共 19 张表
  - **Nova 同步后**：`m.organization.sub_group_id` 非空率 = 995/996（集团根 sub_group_id=NULL 符合评审留痕 §修订 #4 边界；阜矿本部 sub_group_id 自指本地 bigint id；其下 994 行 sub_group_id 全部 = 阜矿本部本地 bigint id）
  - **Nova 同步后**：`m.organization.parent_id` 非空率 = 995/996（集团根无父；阜矿本部 parent_id 指向集团根 bigint id；其下 994 行 parent_id 链路完整）
  - **集团级汇总查询验证**：能源集团下所有组织递归 COUNT(*) = 996（包含集团根本身）；阜矿二级集团下 sub_group_id 一刀切 COUNT(*) = 995
  - 新增 EFCore.Tests 单测：扫 `ctx.Model.GetEntityTypes()`，所有有 schema 的业务实体都必须含 `SubGroupId` 属性（原则 1 CI 检测后端版）

---

## 二、按日任务拆解（10 工作日）

### Day 1 — NovaSync 准备（配置 + Mapper + 探查）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D1-1 | `appsettings.secrets.json` 加 `NovaSync` 节：`{ "ConnectionString": "Host=fxkyjt.cn;Port=5432;Database=Nova;Username=postgres;Password=...", "RootSubGroupId": "40351efe-a370-4239-96fc-1b53a57714de", "ReadOnly": true }`；**写到 `appsettings.secrets.json` 而非 `appsettings.json`，不进 git** | sub_group_id 清单 §修订 #4 + 信安 | secrets 文件未被 git 跟踪（`.gitignore` 已含；DbMigrator + Web 两边都加）|
| D1-2 | 新增 `Nova.SupplyCores.Domain/Integration/Nova/NovaSyncOptions` POCO + DI 绑定 | ABP options pattern | `IOptions<NovaSyncOptions>` DI 可解析 |
| D1-3 | 新增 `Nova.SupplyCores.Domain/Integration/Nova/INovaSourceReader` + `NpgsqlNovaSourceReader` 实现（连 fxkyjt.cn 只读查询，返回 `IAsyncEnumerable<NovaOrgRow>`）| 02 V1.1 §4.1 nova_org_id 同步 | 单测 mock NpgsqlConnection，验证 SELECT 阜矿子树 SQL 语句正确（含 sub_group_id 过滤）|
| D1-4 | 新增 `Nova.SupplyCores.Domain/Integration/Nova/NovaUuidMapper`：内存 `Dictionary<Guid, long>`（uuid → SupplyCore bigint id）+ `Resolve(Guid? novaId)` + `Register(Guid novaId, long localId)` + 持久化层用 `m.organization.nova_org_id` 唯一索引保跨进程查询 | 02 V1.1 §4.1.2 nova_org_id varchar UQ | 单测 ≥ 4：注册 / 解析 / null 处理 / 重复注册抛异常 |
| D1-5 | 探查脚本入仓 `tools/probe-nova/`（一次性 csproj + Npgsql 读取阜矿子树结构性快照，**结果只输出到 stdout 不入仓**），用于团队成员二次验证 Nova 端 schema | — | `dotnet run --project tools/probe-nova` 输出阜矿 995 行汇总 + 各层级行数 |

**预估工时：** 1 工作日

---

### Day 2 — NovaOrganizationSyncContributor 实现 + 验证

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D2-1 | 新增 `Nova.SupplyCores.Domain/Integration/Nova/NovaOrganizationSyncContributor`（实现 `IDataSeedContributor`），SQL 含**祖先链 + 子树**：`recursive CTE 拉 root 的所有祖先（含集团根 level 1）+ sub_group_id = root::uuid 的子树`，按 level ASC, display_order ASC 排序流式返回 | sub_group_id 清单 §修订 #4 + 02 V1.1 §4.1 + V0.5 §1.1 设计姿态 | DbMigrator 跑完后 `m.organization` 行数 = 996（含集团根 1 行）|
| D2-2 | 字段映射逻辑：`id = SupplyCore bigint 新分配` / `nova_org_id = Catio uuid 字符串` / `parent_id = NovaUuidMapper.Resolve(catio.parent_id)` / `sub_group_id = NovaUuidMapper.Resolve(catio.sub_group_id)`（阜矿自身 sub_group_id 自指本地 bigint id）| 02 V1.1 §4.1.2 字段表 | 单测验证字段映射正确（≥ 6 case 覆盖集团根 / 阜矿本部 / 各 level 子节点）|
| D2-3 | 拓扑顺序保证：按 `level ASC, display_order ASC` 排序后单遍 insert：**集团根 level=1 第一**（parent_id=NULL, sub_group_id=NULL）→ **阜矿本部 level=2**（parent_id=集团根 bigint）→ **24 家厂矿 level=3**（parent_id=阜矿本部）→ level 4-7。parent_id 引用的 nova_org_id 必须先 register 到 mapper；否则抛 `KeyNotFoundException`（NovaUuidMapper.ResolveOrThrow 兜底）| — | 单测：故意删除 mapper 中一条 parent 后调用应抛 |
| D2-4 | Idempotent：第二次 SeedAsync 调用应跳过已存在的 nova_org_id 行（按唯一索引判定），不重复 insert；Pass 0 预加载 DB 已有映射到 mapper | sub_group_id 清单 §修订 #1 + idempotent | 单测：连续两次 SeedAsync，`m.organization` 行数稳定在 996 |
| D2-5 | 边界 NULL 处理（评审留痕 §修订 #4 + 原则 4）：**集团根 sub_group_id=NULL + parent_id=NULL**；**阜矿本部 sub_group_id 自指本地 bigint id**（Insert 后 SetSubGroupId 回填）| 02 V1.1 §4.1 + sub_group_id 清单 §修订 #1 / 原则 4 | 单测：集团根 NULL 双字段；阜矿本部 `sub_group_id = id`（自指）|
| D2-6 | 加 `NovaOrganizationSyncContributor_Tests` 集成测试（连接 Catio 测一次，标 `[Trait("Category","Integration")]`，CI 默认跳过；本地开发跑全量）| — | 集成测试通过 + 计数 996 + 集团根 + 阜矿自指 + 厂矿链路 |

**SQL 示例**（祖先链 recursive CTE）：

```sql
WITH RECURSIVE ancestors AS (
    SELECT id, parent_id FROM platform.organizations
     WHERE id = @root::uuid AND is_deleted = false
    UNION ALL
    SELECT o.id, o.parent_id FROM platform.organizations o
    JOIN ancestors a ON o.id = a.parent_id
    WHERE o.is_deleted = false
)
SELECT id, parent_id, sub_group_id, code, name, short_name,
       org_type_id, level, name_path, is_leaf, display_order,
       is_active, effective_date, expiry_date, description
  FROM platform.organizations
 WHERE is_deleted = false
   AND (sub_group_id = @root::uuid OR id IN (SELECT id FROM ancestors))
 ORDER BY level, display_order, id
```

**预估工时：** 1.5 工作日（V0.4 §3.1 02 模块 51 PD 残余 + uuid 映射 + 拓扑 insert + idempotent ≈ 3-4 PD；V0.5 整改 SQL +0.2 PD：改 recursive CTE + 重跑 drop+DbMigrator 验证 996 行）

---

### Day 3 — Warehouse 链 mock seed + Docker compose + Dockerfile

| # | 任务 | 引用 | 验收 |
|---|------|---------|------|
| D3-1 | 新增 `WarehouseDataSeedContributor`，给阜矿 24 家 level 3 中的 **3 家代表性厂矿**（建议：阜新矿业本部 + 恒大煤矿 + 阜新矿业集团物资公司）seed 各 2 个 Warehouse，**parent_id 引用通过 NovaUuidMapper 解析的本地 bigint**；Nova 端无仓库数据，故仍 mock | 02 V1.1 §4.2 + 汇报 §四·决策 3 试点 2-3 家 | DbMigrator 跑完后 `m.warehouse` ≥ 6 行 + 关联 organization 正确 |
| D3-2 | 链式 seed 简化：每个 Warehouse 下 1 个 WarehouseZone + 2 个 StorageLocation（不再要求 36 个 storage_location，按需扩展）| 02 V1.1 §4.3 / §4.4 | `m.warehouse_zone` ≥ 6 + `m.storage_location` ≥ 12 |
| D3-3 | seed 包含 1 个**火工品专管仓**（warehouse_type=`HG`，触发 03 §特殊属性的火工品场景）| 02 V1.1 §4.2.3 + 03 V1.1 §特殊属性 | `m.warehouse` 中至少 1 行 `warehouse_type = 'HG'` |
| D3-4 | 新增 `Dockerfile`（基于 `mcr.microsoft.com/dotnet/aspnet:10.0`，多阶段 build，输出 `SupplyCores.Web` 镜像）| Sprint-0-Demo §4.1 草案 | `docker build -t supplycores-web .` 成功 |
| D3-5 | 新增 `docker-compose.yml`（postgres:16 + supplycores-web 服务，含 healthcheck + volume；**`NovaSync__ConnectionString` 通过 env 注入**） | Sprint-0-Demo §4.1 草案 | `docker compose up -d` 后 30 秒内 `/swagger` 可达；容器内能拉到 995 行阜矿组织 |
| D3-6 | 新增 `docs/部署/试点单位部署指南-V0.1.md`（落到 `SupplyCores` 仓库）| Sprint-0-Demo §4.1 + 11 V1.0 §九 切换 | 指南覆盖：先决条件 / Nova 连接配置 / 启动顺序 / 健康检查 / 故障回滚 |

**预估工时：** 1.5 工作日（V0.4 §3.1 11 非功能模块部署基础设施 1-2 PD + Warehouse mock 0.5 PD）

---

### Day 4 — Material 编码生成器（M-05 一物一码）

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D4-1 | 新增 `IMaterialCodeGenerator` 接口 + `MaterialCodeGenerator` 实现（依赖 SY-01 `sequence_generator`）| 03 V1.1 §3.1 编码规则 + 01 V1.0 SY-01 | DI 中可解析 |
| D4-2 | 编码规则实现：`{material_category_code}{6 位顺序号}`（按 category 分桶取序列，并发安全）| 03 V1.1 §3.1.1 | 单测 16 次并发生成不重复，按 HG 桶则全部 HG 前缀 |
| D4-3 | 改 `MaterialAppService.CreateAsync`：当 `material_code` 留空时调用 generator 自动生成 | 03 V1.1 §3.2 + Sprint-0-Demo §2.1 修订 | POST `/materials` 不传 `materialCode` → 返回值自动带 `materialCode` |
| D4-4 | 加 `MaterialCodeGenerator_Tests` 单测：6 种 category × 3 次生成 = 18 用例，全部 `^[A-Z]{2}\d{6}$` | — | `dotnet test` 通过 |

**预估工时：** 1 工作日（V0.4 §3.1 03 模块 61 PD 含编码生成器）

---

### Day 5 — Material 批量导入服务

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D5-1 | 新增 `IMaterialBulkImportService` + `MaterialBulkImportService`（接收 CSV / Excel 流，按 D4 编码生成器逐行入库）| 03 V1.1 §3.5 批量导入 | DI 解析通过 |
| D5-2 | 异常容错：单行失败写 `a.data_import_failure_row`（已建表），整批仍继续；返回成功 / 失败统计 | 11 V1.0 §13 数据导入失败留痕 | 单测：5 行含 1 行非法物料类型 → 返回 4 成功 1 失败，DataImportFailureRow 表新增 1 行 |
| D5-3 | 新增 `MaterialsController.BulkImport`（POST `/materials/bulk-import`，accepts multipart/form-data）| 03 V1.1 + Demo §2.4 新增 | curl 上传 5 行 CSV → 返回 `{ succeeded: 5, failed: 0 }` |
| D5-4 | 加 `MaterialBulkImportService_Tests`（≥3 单测：happy path / 单行失败 / 全失败）| — | `dotnet test` 通过 |

**预估工时：** 1 工作日（V0.4 §3.1 03 模块 5 PD 批量导入）

---

### Day 6 — P-01 demand_request + P-06 demand_request_line Domain

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D6-1 | 新增 Domain 实体 `DemandRequest`（继承 `SupplyCoresFullAuditedAggregateRoot<long>` → **自动获得 `SubGroupId` / `CreatedOrgId` / `DeleteReason`**）| 04 V1.1 §4.4.1 P-01 全字段表 + 基类设计 | 字段对齐详设 4.4.1 全 20 业务字段 + 基类 7 字段 = 27；EF model 含 `sub_group_id` 列（基类继承）|
| D6-2 | 新增 Domain 实体 `DemandRequestLine`（继承同上，FK→DemandRequest + Material）| 04 V1.1 §4.4.2 P-06 全字段表 | 字段对齐详设 4.4.2；EF model 含 `sub_group_id` 列 |
| D6-3 | 新增 EF mapping（`m.demand_request` + `m.demand_request_line`，snake_case 列名由 EnforceSnakeCaseColumnNames 自动处理）；**`sub_group_id` 加索引**（A-06 一刀切过滤主用，原则 2 性能要求）| AGENTS.md §数据库规则 + sub_group_id 清单 §三 原则 2 | migration 列名全 snake_case；`sub_group_id` 索引存在（IsBusinessTable + has SubGroupId 的实体都加）|
| D6-4 | 状态机方法 `DemandRequest.Submit() / Approve(approverUserId) / Reject(reason)`（5 状态：草稿/待审/已审/已驳回/已分解，详设 §4.4.3）| 04 V1.1 §4.4.3 | 单测 ≥ 6 用例（每个 transition + 非法迁移 400）|
| D6-5 | EF migration 生成（`dotnet ef migrations add Add_DemandRequest`，名字按 commit message 风格）| — | migration 文件存在 + apply 后 2 张表 + 索引 ≥ 4（含 `sub_group_id` 索引）|
| D6-6 | **写入钩子（DomainService 或 AppService.CreateAsync 入口）：根据 `ICurrentUser.OrgId` 反查 M-01.sub_group_id 一次性回算后落库**（业务实体写入时 SubGroupId 不为 null，除非显式声明集团级共享，原则 3）| sub_group_id 清单 §修订 #2 + §三 原则 3 | 创建 1 条 P-01 → `m.demand_request.sub_group_id` 等于该 user 所属 org 的 sub_group_id |

**预估工时：** 1 工作日（V0.4 §3.2 04 子模块"需求计划 M-09/10/11" 9 后端 PD 中 ~4 PD 用于 P-01/06 实体）

---

### Day 7 — P-01 AppService + Controller + linkage 入口

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D7-1 | 新增 `IDemandRequestAppService` 契约（4 endpoint：Create / Submit / Approve / Reject）| 04 V1.1 §4.4.4 业务规则 | 契约 DTO 命名对齐详设 |
| D7-2 | 新增 `DemandRequestAppService` 实现 + Mapperly DTO mapper | 04 V1.1 + Sprint 0 D2 风格 | DI 解析 + 单测 ≥ 4 |
| D7-3 | 新增 `DemandRequestsController`（路由 `/api/supply-cores/demand-requests`）+ 4 endpoint | 04 V1.1 | Swagger 可见 |
| D7-4 | **关键 linkage：`DemandRequest:已审` → 触发 P-02 草稿生成器**（按 source_request_no 幂等查重，按 org + 月聚合到 PurchasePlan 草稿；首版可不开 PurchasePlan 实体，留 Day 8 接）| 原型 v0.16 `linkage.js` `on('P-01:已审')` + 04 V1.1 §4.5.4 | Day 7 末 endpoint approve 成功（具体落 P-02 草稿 D8 接）|
| D7-5 | 加 `DemandRequestAppService_Tests` 单测（5 个：每 endpoint + 跨调用顺序）| — | `dotnet test` 通过 |

**预估工时：** 1 工作日（04 子模块需求计划余下 ~5 PD）

---

### Day 8 — P-02 purchase_plan + P-03 purchase_plan_line Domain

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D8-1 | 新增 Domain 实体 `PurchasePlan` + `PurchasePlanLine`（继承基类自动获得 SubGroupId / CreatedOrgId / DeleteReason）| 04 V1.1 §4.5.1 / §4.5.2 | 字段全对齐；EF model 含 `sub_group_id` 列 |
| D8-2 | 新增 EF mapping + migration `Add_PurchasePlan`；`sub_group_id` 加索引 | sub_group_id 清单 §三 原则 2 | apply 后 2 张表 + 索引（含 sub_group_id）|
| D8-3 | 状态机方法 `PurchasePlan.Submit() / Approve() / MarkDecomposed()`（4 状态：草稿/待审/已审/已分解，详设 §4.5.3）| 04 V1.1 §4.5.3 | 单测 ≥ 5 |
| D8-4 | **承接 D7-4 linkage**：实现 `DemandRequest:已审` → `PurchasePlan` 草稿自动生成（按 org + month 幂等聚合 + 复制 line 数据 + **复制 sub_group_id 字段**，确保聚合后的 PurchasePlan 与源 DemandRequest 在同一二级集团范围内），D7 末的 approve 调用应触发该 linkage | 原型 v0.16 + 04 V1.1 §4.5.4 + sub_group_id 清单 §三 原则 3 | 单测：approve 2 个同 org 同月 demand_request → 1 个 PurchasePlan 草稿（4 行 line）；`PurchasePlan.sub_group_id` 等于源 DemandRequest 的 sub_group_id |

**预估工时：** 1 工作日

---

### Day 9 — P-02 AppService + Controller + 集成 demo 路径

| # | 任务 | 详设引用 | 验收 |
|---|------|---------|------|
| D9-1 | 新增 `IPurchasePlanAppService` 契约（5 endpoint：List / Create / Submit / Approve / Reject）| 04 V1.1 §4.5.4 | DTO 对齐 |
| D9-2 | 新增 `PurchasePlanAppService` 实现 + Mapperly | — | DI 解析 + 单测 ≥ 5 |
| D9-3 | 新增 `PurchasePlansController` | 04 V1.1 | Swagger 可见 |
| D9-4 | **端到端集成测试**：`Application.Tests/Demand/PurchasePlanLinkage_E2E_Tests.cs` — 1 个 test 覆盖 创建 5 个 demand_request → submit → approve → 自动汇总 1 个 purchase_plan → submit → approve → 状态变 `已审`，断言 `a.operation_log` 行数增量 ≥ 10 + audit 自动写入 ≥ 1 行 SENSITIVE_（如有适用 attribute）| Sprint 0 D14 Demo + 09 ALR-* | 集成测试通过 |

**预估工时：** 1 工作日（04 子模块采购申请 12 PD 中 ~7-8 PD 用于 P-02/03 + AppService）

---

### Day 10 — Sprint 1 验收 + Demo + Sprint 2 backlog

| # | 任务 | 验收 |
|---|------|------|
| D10-1 | 跑全部测试：`dotnet test SupplyCores.slnx` ≥ 75 通过 | 0 失败 |
| D10-2 | 跑 Sprint 0 Demo 脚本用例 1（org 树）+ 用例 2-3（Material / Supplier，确认无回归）+ 新增用例 6-8（编码/批量/P-01-P-02 链） | 全 200 OK |
| D10-3 | `docker compose up` → 跑 D10-2 全套，验证容器化部署 | 容器内 demo 全通过 |
| D10-4 | 写 Sprint-1-Demo 脚本（仿 Sprint-0-Demo-脚本 V0.1 格式落到 `docs/Sprint/Sprint-1-Demo-脚本-V0.1.md`）| 文档入库 |
| D10-5 | 起 Sprint 2 任务卡草案：04 P-04/P-05 + T-01 招投标 + 05 C-01/C-02 合同三件套（按 V0.4 §3.2 工时估算）| `Sprint-2-任务卡-V0.1.md` 草案入库 |
| D10-6 | 整理 Sprint 1 commit log 写 PR / release notes | git log 整洁 |

**预估工时：** 1 工作日

---

## 三、Sprint 2 衔接 + Stage B1 衔接

### 3.1 Sprint 2（下一个 Sprint）

Sprint 1 完成后，Sprint 2 起接（V0.4 §3.2 04 + 05 子模块）：

| 重点 | 详设依据 | V0.4 工时 |
|------|---------|----------|
| P-04 plan_adjustment 计划调整单 | 04 V1.1 §4.6 | ≈ 4 PD |
| P-05 purchase_task 采购任务单 | 04 V1.1 §4.7 + 原型 v0.16 任务分解 B 方案 | ≈ 6 PD |
| T-01 招标单 + T-02/03/05 主链 | 04 V1.1 §4.8 + 招投标外部对接缓冲 +30 PD（能源集团招采平台）| ≈ 15-25 PD |
| C-01 合同会签 + C-02 合同 | 05 V1.1 §4.1 / §4.2 | ≈ 15 PD |
| 5 项预并行外部协调动作回执确认 | V0.4 §5.3 | PM/BA 工作量 |

Sprint 2 任务卡在 Sprint 1 D10-5 起草。

### 3.2 Stage B1（远端衔接）— NovaSync 实施层切换

Sprint 1 的 `NpgsqlNovaSourceReader`（直连 fxkyjt.cn）是**开发期实现**。Stage B1（OAuth 凭据到位后）需切换到 `HttpNovaSourceReader`（走 Catio 提供的 REST API）。

切换方案、前置条件、checklist 详见 [`NovaSync 实施层切换方案-V0.2.md`](../详细设计/NovaSync%20实施层切换方案-V0.2.md)。

切换工时预估：1.5–2 PD，依赖 Catio 团队 §九 Bis API 契约（见 10A 提问清单 V1.1）。

### 3.3 多二级集团扩展（远端衔接）

一期 RootSubGroupId = 阜新矿业 uuid（单值）；未来扩 **清能 / 铁煤 / 沈煤 / 抚顺矿业 / 辽能股份 / 能源投资 / 集采中心 / 辽能本部 / 电机集团 / 辽宁南票电厂** 等 10 家二级集团时：

- 改造点：`NovaSyncOptions.RootSubGroupIds` (`string[]`)，遍历同步
- 集团根 `能源集团 (7d10b21e-...)` **仍只 1 行**（recursive CTE 自然去重）
- 各二级集团本部 sub_group_id 自指本地 id（同阜矿模式）
- 各自子树 sub_group_id 指向各自二级集团本地 id
- 不冲突：集团根 + N 个二级集团子树 = N+1 个相对独立的隔离边界，A-06 数据范围按 sub_group_id 一刀切

数据合规边界：扩展时需评估"是否将其他二级集团数据进 SupplyCore 实例"（合规、隔离、PII），不在 Sprint 1 范围。

---

## 四、资源 / 风险

| 项 | 估算 / 应对 |
|----|------------|
| **人月** | 1 个全栈 .NET 后端开发者 ≈ **0.5 人月**（10 工作日 / 21 工作日 = 0.48 人月）|
| **关键风险 1** | `fxkyjt.cn:5432/Nova` 网络稳定性 / 凭据时效 → D1-3 加超时 + 失败重试 3 次；D2-1 同步失败不影响其他 contributors（catch + log + 继续）；secrets 凭据若改密码需更新 secrets.json |
| **关键风险 2** | Docker 镜像 build 在 Apple Silicon 上跨平台 `linux/amd64` 慢 → 文档指定 `--platform linux/amd64` build 选项，CI 用 amd64 runner |
| **关键风险 3** | linkage `DemandRequest:已审 → PurchasePlan 草稿` 幂等性测试不足 → D8-4 单测覆盖"重复 approve 不重复生成 plan" |
| **关键风险 4** | sub_group_id 写入钩子覆盖不全（漏掉某个 AppService.CreateAsync 入口）→ 新增 EFCore.Tests "所有业务实体 SubGroupId 非空率" 守护测试（D6-6 + D8 涵盖）|
| **关键风险 5** | NovaSync 拓扑断裂（parent_id 引用未注册 mapper）→ D2-3 按 level 升序遍历 + 抛 MissingParentException 兜底；单测覆盖故意断裂 case |
| **关键风险 6** | 24 家是否就是业务方眼里的"17 家"？汇报材料 V0.2 与 Catio 现状口径不一致 → 数据库同步 24 家全部；业务方需要时由前端 / 报表加 `is_in_scope_v1 boolean` 标记圈定（本 Sprint 不实现该标记）|
| **数据合规** | Sprint 1 只同步组织（995 行），**不同步人员**（11258 人含 mobile / id_number 等 PII）；人员同步推到 Stage B1 真实联调期，配合 Nova SSO + 数据加密 + 合规审批 |
| **依赖外部** | `fxkyjt.cn:5432/Nova` 只读访问已确认通；OAuth / NC 厂商 / 招采平台 / 消息平台不涉及；sub_group_id 实时事件订阅推到 Stage B1 |

---

## 五、可复用资产

| 来源 | Sprint 1 复用 |
|------|--------------|
| Sprint 0 已建 `SupplyCoresFullAuditedAggregateRoot<long>` 基类 | P-01/02/03/06 4 个实体直接继承 |
| Sprint 0 自定义 `SupplyCoresAuditingStore` + `[SensitiveOperation]` 反射机制 | P-01/02 状态机 endpoint 加 [SensitiveOperation] 触发审计（特别是 P-02 审批通过这一步）|
| Sprint 0.5 命名分层（`EnforceSnakeCaseColumnNames` 按 schema 过滤） | 新表无需额外配置，列自动 snake_case |
| Sprint 0 `MockNcInterfaceService` | P-02 已审若联动 NC（详设未要求但保留扩展点），mock 已可直接调 |
| Sprint 0.5 `SchemaNamingConvention_Tests` 守护测试 | 自动验证 P-01/02/03/06 新表列名分层正确 |
| 原型 v0.16 `prototype/assets/linkage.js` `on('P-01:已审')` | D7-4 + D8-4 linkage 实现的参考样板 |
| **D1 已建 `INovaSourceReader` 抽象接口（Domain 层）+ NovaUuidMapper** | 生产期 Stage B1 切换 `HttpNovaSourceReader` 零改动业务下游；NovaUuidMapper 可用于未来 platform.persons 等其他 Nova 表同步 |
| **D1 已建 `tools/probe-nova/` 探查模式** | 后续接 Catio 其他模块时（如 hrx.persons / kq.department_mappings）可仿同样模式快速验证 schema + 数据量 |
| **`NovaSync 实施层切换方案-V0.2` §六 6 步 checklist** | Stage B1 切换 HttpReader 时按 checklist 跑，预估 1.5-2 PD 收口 |

---

## 六、与 V0.4 工时对照

| Sprint 1 Day | V0.4 §3.1/§3.2 对应模块 | V0.4 工时 PD |
|--------------|----------------------|--------------|
| D1 NovaSync 配置 + Mapper | 02 基础档案残余 + 集成配置 | ≈ 1 PD |
| D2 NovaOrganizationSyncContributor + V0.5 祖先链整改 | 02 基础档案残余 + uuid/bigint 映射层 + recursive CTE 整改 | ≈ 1.7 PD |
| D3 Warehouse mock + Docker compose | 02 残余 + 11 非功能（部署基础设施） | ≈ 1.5 PD |
| D4-5 Material 编码 + 批量导入 | 03 物料（5 PD 批量 + 1-2 PD 编码） | ≈ 5-7 PD |
| D6-7 P-01 demand_request 全链 | 04 需求计划（M-09/10/11 + P-01 全链）9 后端 PD 残余 | ≈ 5 PD |
| D8-9 P-02 purchase_plan 全链 | 04 采购申请 12 后端 PD | ≈ 8-10 PD |
| D10 验收 + 文档 | 测试 / PM | ≈ 1 PD |
| **合计** | 02+03+04+11 子集 | **≈ 22-27 PD** |

**V0.4 工时对照备注：** Sprint 1 单人节奏 10 工作日 ≈ 10 PD（含验收）；V0.4 工时盘子覆盖 ≈ 22-27 PD 含测试+PM+缓冲，对应**单人 2-3 周或 2 人 1 周**节奏。本任务卡按 1 个开发者 10 工作日设计，**未含测试 / PM / 风险缓冲的 V0.4 经验值**，实际执行可能溢出 30%（V0.4 §4.1 风险缓冲口径）。

---

## 七、Definition of Done（DoD）

- [ ] §1.4 完成标准全部 ✅（含 996 行 + 集团根 NULL 双字段 + 阜矿本部 parent_id 指向集团根 + sub_group_id 自指 + 二次幂等）
- [ ] §二 D1-D10 全部任务勾选完毕
- [ ] `dotnet test SupplyCores.slnx` ≥ 75 通过 / 0 失败
- [ ] Demo 脚本（Sprint 0 + Sprint 1 新增）全部 200
- [ ] `docker compose up` 启动后 30 秒内 `/swagger` 可达
- [ ] `Sprint-1-Demo-脚本-V0.1.md` + `Sprint-2-任务卡-V0.1.md` 草案入库
- [ ] 所有 commit follow `SupplyCores/AGENTS.md` git 规范

---

## 八、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-12 | 草案：基于 V0.4 §3.1 工时 + Sprint 0 收尾状态 + 汇报 §2.1 第 1 批节奏起草；待用户评审 |
| V0.2 | 2026-05-12 | 联动 `数据隔离边界sub_group_id修订建议清单-V0.1` §四影响范围"Sprint-1 任务卡 V0.1 待联动"要求：(1) §1.2 基线加 commit `2132de1` 基类加 `SubGroupId` + migration 重生成 `20260512033645_Init`；(2) §1.3 加 Nova 同步契约对齐项（P1，真联调延后）；(3) §1.4 加 sub_group_id 字段 + 17 家非空率 + EFCore.Tests 守护测试；(4) D1-1/D1-3 OrgSeed 写明根节点 NULL / 二级集团自指 / 17 家全部 = 阜矿 + FK 自指完整性单测；(5) D6/D8 P-01/P-02 写明继承基类自动获得 SubGroupId + `sub_group_id` 索引 + linkage 复制源字段；(6) 新增 D6-6 写入钩子条目；(7) §四 加风险 4（钩子覆盖）；(8) 详设 02 引用从 V1.0 升 V1.1。 |
| V0.3 | 2026-05-12 | 整改 D1-D2 从 mock 转 Catio 真实同步（已验证 `fxkyjt.cn:5432/Nova` 连通 + 阜矿子树 995 行 + 11258 人）：(1) §1.1 目标改"NovaOrganizationSyncContributor 第一次落地"，**人员不在范围**（PII，留 Stage B1）；(2) §1.2 加 Catio 连通验证、本机 DB 同步动作改"drop + DbMigrator"两步（移除 dotnet ef database update，Sprint 0 D14 已证 history 不通）；(3) §1.3 改 Org 缺口为 NovaSync + 配置 + UuidMapper 三条；(4) §1.4 完成标准改 24 家 + 995 行真实命名 + 二次幂等用例 9；(5) §二 D1-D3 重写：D1 NovaSync 准备 / D2 同步实现 + 验证 / D3 Warehouse mock 简化 + Docker compose；(6) §四 风险加 5/6/合规三条；(7) §六 工时对照 D1-D3 拆分。**口径校正：阜矿 = 阜新矿业（不是抚顺），level 3 = 24 家不是 17 家**；汇报材料 V0.2 的 17 家是 PDF 调研老口径，下次升版调位。 |
| V0.4 | 2026-05-12 | 联动新建 `NovaSync 实施层切换方案-V0.1`（后续已升 V0.2）：(1) 头部 `衔接文档` 加 NovaSync 切换方案 + 10A 清单 V1.1 引用；(2) §1.2 基线加一行"D1 已落地（commit `0dcbeb0`），75/75 测试通过"；(3) §三 改名"Sprint 2 衔接 + Stage B1 衔接"，加 §3.2 NovaSync HttpReader 切换衔接（链到切换方案）；(4) §五 可复用资产加 3 条：INovaSourceReader 抽象 / tools/probe-nova 探查模式 / 切换 checklist；(5) 文件名升 V0.3 → V0.4，同 commit `git mv`。**关键设计立场：`NpgsqlNovaSourceReader` 是开发期实现，生产期必经 HttpReader 切换；INovaSourceReader 抽象就是为此预留的扩展点**。 |
| V0.5 | 2026-05-12 | **NovaSync 同步祖先链整改**——D2 commit `a9c0466` 同步窗口仅覆盖阜矿子树（995 行），漏掉集团根（能源集团 level 1），阜矿本部 parent_id=NULL 链路断裂。用户指出"系统为能源集团整体设计，应将父记录也同步过来，便于集团级汇总"。V0.5 修订：(1) §1.1 加"为能源集团整体设计 / 一期数据范围为集团根 + 阜矿子树"两层姿态 + 强调集团级汇总能力；(2) §1.2 基线加 D2 状态 + V0.5 需重跑提示；(3) §1.3 缺口改"NovaOrganizationSyncContributor SQL 扩祖先链 recursive CTE"；(4) §1.4 完成标准改 996 行 + 集团根 NULL 双字段 + parent_id 链路完整 + 集团级汇总查询验证；(5) §二 D2 重写 SQL 例 + 验收数；(6) §三 加 §3.3 多二级集团扩展衔接（清能 / 铁煤 / 沈煤等 10 家未来按需扩 RootSubGroupIds 数组）；(7) §六 D2 工时 +0.2 PD；(8) §七 DoD 改"完成标准全部 ✅"去掉数字硬编码；(9) 文件名升 V0.4 → V0.5，同 commit `git mv`。**核心立场：本地 PK bigint 不变；nova_org_id 仍是跨系统对齐字段；集团根本地 id 进 m.organization 让 parent_id 链路完整到顶**。 |
| V0.6 | 2026-05-12 | **org_code vs sub_group_id 双轨查询模式澄清**——用户指出"code 是为了汇总用"，强化两个并行字段的职责分清。新增 §1.1.1 小节"组织数据双轨查询模式"：sub_group_id（数据隔离边界，二级集团一刀切粒度）/ org_code（业务汇总，path 编码任意层级）两轨表格；典型 SQL；A-06 权限 + 各级汇总匹配；未来 Code Review 检查项三条。实施现状：D2 commit `a9c0466` 已落地 OrgCode 字段同步，code 汇总能力 in place，无需 D3+ 额外工作。文件名升 V0.5 → V0.6，同 commit `git mv`。**核心立场：两字段不冲突、各自最优解决一个问题**。 |
| V0.7 | 2026-05-12 | **D6-1 fulfillment_type 笔误修正**——D6 落地（commit `832c8fb`）时发现 V0.6 D6-1 描述"含 fulfillment_type 字段"与详设 04 V1.1 §4.4.1 P-01 全字段表不一致：fulfillment_type 实际定义在 S-01 采购申请单（详设 §4.14.1），不属于 P-01。已按详设走，D6-1 描述更正去掉该字段提及，字段数从"全 27 字段"细化为"20 业务字段 + 基类 7 字段 = 27"。代码不需任何变更（实体已按详设落地）。文件名升 V0.6 → V0.7，同 commit `git mv`。 |
