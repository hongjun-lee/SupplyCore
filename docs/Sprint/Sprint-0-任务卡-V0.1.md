# Sprint 0 任务卡 — P0 第 1 批数据底座补全（V0.1）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-11
**文档性质：** 开发实施层 · Sprint 任务卡
**适用范围：** 后端工程 `SupplyCores` 仓库 Sprint 0（2 周）
**衔接文档：**
- 上游业务节奏 → [`../流程调研/存货问题解决方案-领导汇报-V0.1.md`](../流程调研/存货问题解决方案-领导汇报-V0.1.md) §2.1 P0 第 1 批
- 详细设计依据 → [`01-数据库逻辑模型-V1.0.md`](../详细设计/01-数据库逻辑模型-V1.0.md) / [`02-基础档案与组织仓库详细设计-V1.0.md`](../详细设计/02-基础档案与组织仓库详细设计-V1.0.md) / [`03-物料主数据与编码详细设计-V1.1.md`](../详细设计/03-物料主数据与编码详细设计-V1.1.md)
- 工程约定 → `../../../SupplyCores/AGENTS.md` / `../../../SupplyCores/CLAUDE.md`

---

## 一、目标与范围

### 1.1 目标

补齐 P0 第 1 批"数据底座"缺口（M-09/10/11 供应商三件套 + Material/Organization 应用层 + Wave6 审计接通），交付一个**可独立演示的主数据管理后端**。

### 1.2 工程现状基线（盘点 2026-05-11）

工程 `SupplyCores` 已在 Wave 1-6 进度上：

| Wave | 内容 |
|---|---|
| Wave1 | M-07 单位 / M-01 组织 / SY-01 序列生成器 |
| Wave2 | M-04 物料分类 / M-02 仓库 / M-08 单位换算 / M-12 成本中心 / M-13 成本中心映射 / M-16 |
| Wave3 | M-03A 库区 / M-03B 货位 |
| Wave4 | M-05 物料 / M-06 物料属性 / M-14 NC 映射 / M-15 批次 |
| Wave5 | M-17 物料申请单 |
| Wave6 | 审计基础设施（OperationLog / SensitiveOperation / AiCallLog / 4 个 DataX-Log / InterfaceOperationLog / BusinessDataScopeGrant）|

**已有 AppService + Controller**（6 套全 CRUD）：MaterialCategory / Warehouse / WarehouseZone / StorageLocation / Unit / UnitConversion

**`dotnet build` 状态**：0 错误（105 warnings，DevExpress 试用 + Mapperly 警告，不影响）。

### 1.3 关键缺口

| 类型 | 缺什么 | 详设依据 |
|---|---|---|
| ❌ 实体 + Migration | **M-09 供应商 / M-10 资质 / M-11 黑名单** | 01 line 269-271 + 02 V1.0 §供应商 |
| ⚠ 应用层 | **Material 已有 Domain（MaterialState 字段 + 74 行），缺 MaterialAppService + IMaterialAppService + MaterialsController** | 03 V1.1 §物料 CRUD + 7 状态机 |
| ⚠ 应用层 | **Organization 已有 Domain，缺 OrganizationAppService + Controller**（只读查询型，因为来源是 Nova 副本）| 02 V1.0 §组织 |
| ❌ 横切 | **Wave6 审计实体已建但拦截器未接通**（无自定义 `IAuditingStore`），目前任何业务操作都不会写 OperationLog | 11 §13 + 09 R-10（5 年留存）|
| ❌ 集成 | NC-MD-001/002/003 mock service | 02 + 08 V1.1 |

### 1.4 完成标准

- M 域 16+ 实体全部 CRUD API 通
- 审计日志自动写入（每次操作触发 OperationLog 行）
- 高敏感操作（M-11 黑名单等）触发 SensitiveOperation 双签
- NC-MD-001/002/003 mock 接通
- 可独立部署给试点单位试用（1 套 Docker compose 或 IIS）
- 后端 xUnit 测试 ≥ 30 个用例

---

## 二、按日任务拆解（10 工作日）

### Day 1 — 环境验证 + Backlog 锁定（半天）

| # | 任务 | 验收 |
|---|---|---|
| D1-1 | `cd SupplyCores && dotnet restore SupplyCores.slnx && dotnet build` | 0 错误（已验证 ✓）|
| D1-2 | `dotnet ef database update -p src/SupplyCores.DbMigrator` 跑 Wave1-6 到本地 PostgreSQL | 21 张表（13 M 域 + 8 审计）存在 + Wave6 SensitiveOperation seed 数据有 |
| D1-3 | `dotnet run --project src/SupplyCores.Web` + 打开 `/swagger` | 已有 6 个 Controller 全部可见，能 GET 各列表 |
| D1-4 | Backlog 锁定（本任务卡进仓库 + issue tracker）| 任务卡 v0.1 入库 |
| D1-5 | **补抽象基类 `SupplyCoresFullAuditedAggregateRoot<TKey>`**（加 `CreatedOrgId` + `SubGroupId` + `DeleteReason` 详设独有字段）+ 加单元测试 | 见 D1-5 详细 |

> 验收任一失败 → 先解决环境问题再往下。

#### D1-5 详细 — 抽象基类（半天）

详设 01 §4.2 / §4.3 要求的 ABP 没有的字段（**2026-05-12 V1.1 起含 `SubGroupId`**，落地 `评审留痕/数据隔离边界sub_group_id修订建议清单-V0.1.md` 修订 #2）。

> **路径修正**：`FullAuditedAggregateRoot<TKey>` 在 `Volo.Abp.Ddd.Domain` 包（不在 `.Shared`）。基类放 `Domain` 项目，**不是** `Domain.Shared`：

```csharp
// modules/nova.supplycores/src/Nova.SupplyCores.Domain/Entities/Auditing/
//   SupplyCoresFullAuditedAggregateRoot.cs

using Volo.Abp.Domain.Entities.Auditing;

namespace Nova.SupplyCores.Entities.Auditing;

/// <summary>
/// SupplyCores 业务实体基类（详设 01 §4.2 + §4.3 + 审计字段映射表 V0.2）。
/// 在 ABP FullAuditedAggregateRoot 基础上扩展三个详设独有字段：
///   - CreatedOrgId 创建人所属组织（细粒度过滤辅助）
///   - SubGroupId   数据所属二级集团（A-06 数据范围"以二级集团为隔离边界"一刀切主用字段，V1.1 新增）
///   - DeleteReason 软删除原因（详设 11 §13 合规留痕要求）
/// </summary>
public abstract class SupplyCoresFullAuditedAggregateRoot<TKey>
    : FullAuditedAggregateRoot<TKey>
{
    /// <summary>详设 01 §4.2：创建人所属组织（FK→M-01）</summary>
    public virtual long? CreatedOrgId { get; protected set; }

    /// <summary>
    /// 详设 01 §4.2（V1.1 新增）：数据所属二级集团（FK→M-01）。
    /// 写入时由 CreatedOrgId 回溯 M-01.sub_group_id 确定；集团级共享主数据可为 NULL。
    /// A-06 数据范围过滤主用字段；详见
    /// 评审留痕/数据隔离边界sub_group_id修订建议清单-V0.1.md 修订 #2 + 原则 1-4。
    /// </summary>
    public virtual long? SubGroupId { get; protected set; }

    /// <summary>详设 01 §4.3：软删除原因（高敏感操作必填）</summary>
    public virtual string? DeleteReason { get; protected set; }

    protected SupplyCoresFullAuditedAggregateRoot() { }
    protected SupplyCoresFullAuditedAggregateRoot(TKey id) : base(id) { }

    /// <summary>
    /// 软删除时显式设置原因（不直接暴露 setter）。
    /// 由 IRepository.DeleteAsync 钩子或 Domain Service 调用。
    /// </summary>
    public virtual void MarkAsDeleted(string reason)
    {
        DeleteReason = reason;
        // IsDeleted 由 ABP 框架在 DeleteAsync 时自动设置
    }
}
```

**SubGroupId 写入钩子**（D2-3 接 A-06 数据范围时实现，本 Sprint 仅占位）：
- 仓储层 `ICurrentTenant` + `ICurrentOrgContext`（项目自建）在新增/迁移时由 `CreatedOrgId` 回算 `M-01.sub_group_id` 后落库
- 集团级共享主数据由 Domain Service 显式置 NULL，且必须配合 `is_group_shared=true` 等显式声明字段
- 详细规约见原则 1-4

**Sprint 0 范围内的实体迁移策略**：
- **本 Sprint 新建的 M-09/10/11 供应商三件套**：**直接继承 `SupplyCoresFullAuditedAggregateRoot<long>`** ✓
- **已有 16 个业务实体（Material / Organization / Warehouse / ...）**：**Sprint 0 不动**，留到 Sprint 0.5 风格统一时一起改（避免污染 Sprint 0 + 减少 migration 次数）
- **审计 8 个实体（OperationLog 等）**：本来就用 `CreationAuditedAggregateRoot<long>`（append-only），不动

**验收**：
- 基类编译通过 ✓（dotnet build 0 错误，2026-05-11）
- 基类含 `SubGroupId` 属性（2026-05-12 V1.1 新增，含 protected setter + XML 注释链回修订清单）
- Wave7 M-09/10/11 实体继承本基类（D7 时验证）
- 单测覆盖 `MarkAsDeleted(reason)` 行为（推迟到 D1-6 测试项目建好后做）
- 单测覆盖 `SubGroupId` 属性可读写（D1-6 后补）

### D1-6 新加 — 测试项目搭建（Sprint 0 必需，0.5 天）

工程当前没有任何测试项目，所有后续单测 / 集成测试都需要先搭骨架。建议按 ABP 模板标准建：

```
test/
  ├── Nova.SupplyCores.Domain.Tests/                    Domain 单元测试（无 DI）
  ├── Nova.SupplyCores.Application.Tests/               Application 集成测试（含 DI + ABP TestBase）
  └── Nova.SupplyCores.EntityFrameworkCore.Tests/      （可选）EF Core 测试
```

**验收**：
- 3 个 test .csproj 加入 SupplyCores.slnx
- 各自含 1 个 smoke test（如 `Material_Should_Compile()`）
- `dotnet test` 通过

---

### Day 2-3 — Material / Organization 应用层补齐（2 天）

详设依据：03 V1.1 §物料 + 02 V1.0 §组织。**Domain 实体已建（74 行 Material.cs，MaterialState 字段已有），只缺 Application + Controller**。

#### Day 2 上午 — Material 7 状态机方法（Domain 层）

在 `Nova.SupplyCores.Domain/Materials/Material.cs` 内补：

```csharp
// 7 状态机：待申请 → 待审核 → 待映射 → 启用 → 变更中 / 停用 / 归档

public void SubmitForReview() {
  EnsureState("待申请");
  ChangeState("待审核");
}

public void Approve() {
  EnsureState("待审核");
  ChangeState("待映射");
}

public void ConfirmNcMapping() {
  EnsureState("待映射");
  EnsureNcMappingConfigured();  // guard: M-14 mapping_state=已配置
  ChangeState("启用");
}

public void StartChange() {
  EnsureState("启用");
  ChangeState("变更中");
}

public void EndChange() {
  EnsureState("变更中");
  ChangeState("启用");
}

public void Disable() {
  if (MaterialState is not ("启用" or "变更中")) throw new BusinessException("状态不允许停用");
  EnsureNoActiveBusinessRefs();  // guard: 无未关闭业务引用
  ChangeState("停用");
}

public void Archive() {
  EnsureState("停用");
  EnsureDisabledForAtLeast(TimeSpan.FromDays(365));  // 停用 ≥ 1 年
  ChangeState("归档");
}

private void ChangeState(string target) {
  var from = MaterialState;
  MaterialState = target;
  AddDistributedEvent(new MaterialStateChangedEto(Id, from, target));
}
```

**验收**：xUnit Domain 单测覆盖 7 个迁移 + 4 个非法迁移路径（共 11 测试）

#### Day 2 下午 — MaterialAppService + Controller

文件清单：
```
Nova.SupplyCores.Application.Contracts/Materials/
  ├── IMaterialAppService.cs          CRUD + 状态机 events
  ├── MaterialDto.cs / CreateUpdateMaterialDto.cs / GetMaterialListInput.cs

Nova.SupplyCores.Application/Materials/
  ├── MaterialAppService.cs           继承 SupplyCoresCrudAppService<Material, ...>
  ├── MaterialMappers.cs              Mapperly 风格（参考 MaterialCategoryMappers）

Nova.SupplyCores.HttpApi/Controllers/Materials/
  └── MaterialsController.cs          7 个 endpoint
```

7 个状态迁移 endpoint：
- `POST /api/app/material/{id}/submit-for-review`
- `POST /api/app/material/{id}/approve`
- `POST /api/app/material/{id}/confirm-nc-mapping`
- `POST /api/app/material/{id}/start-change`
- `POST /api/app/material/{id}/end-change`
- `POST /api/app/material/{id}/disable`
- `POST /api/app/material/{id}/archive`

**验收**：
- `POST /api/app/material` 能创建（state=待申请）
- `POST /api/app/material/{id}/submit-for-review` 能流转
- 不合法迁移返回 `400 BusinessException`
- Swagger 7 个 endpoint 全可见 + curl smoke 通过

#### Day 3 — Organization AppService + Controller

Organization 是 Nova 同步副本，**只暴露查询 API + 树形结构**（无 CRUD）：

```
IOrganizationAppService:
  - GetAsync(Guid id)
  - GetTreeAsync()                    返回树形 17 家结构
  - GetListAsync(GetOrgListInput)
```

**验收**：
- `GET /api/app/organization/tree` 返回 17 家组织树（如果 seed 未补，先用 5-6 家 mock）
- 树深度正确（集团 → 物资公司 → 矿 / 厂 / 子公司）

---

### Day 4-6 — Wave6 审计拦截器接通（3 天）

**Sprint 0 最关键的一环**：详设 11 §13 要求 5 年留存，但当前 Wave6 只建了表没有写入逻辑。

#### Day 4 — 设计审计接入方式（半天 + 半天编码）

**推荐方案 A — 自定义 `IAuditingStore`**（ABP 标准接入点）：

```csharp
// Nova.SupplyCores.Application/Auditing/SupplyCoresAuditingStore.cs

public class SupplyCoresAuditingStore : IAuditingStore, ITransientDependency
{
    private readonly IRepository<OperationLog, long> _opLogRepo;
    private readonly IRepository<SensitiveOperation, long> _sensitiveRepo;

    public async Task SaveAsync(AuditLogInfo auditInfo) {
        // 1. 转换为 OperationLog + 保存（actor / entity / action / before / after）
        // 2. 如 EntityChanges 含敏感实体（按 SensitiveOperation seed 规则）→ 写 SensitiveOperation
        // 3. 默认 ABP audit log（按需保留）
    }
}
```

**备选方案 B — Domain Event 驱动**：更解耦但需各 AppService 显式 emit Event，工作量大。

**验收 Day 4**：方案选定 + AuditingStore 骨架代码 + DI 注册 + 团队设计评审

#### Day 5 — OperationLog 写入逻辑

- 拦截所有 AppService 方法（ABP `[Audited]` attribute 自动触发 IAuditingStore）
- AuditLogInfo → OperationLog 映射：actor(UserId) / entity(EntityType.Name) / action(MethodName) / before-after(EntityChanges JSON)
- 关联 A-20 approval 字段（先空，待审批模块上来后接）

**验收**：
- POST/PUT/DELETE 任意 Material → OperationLog 表自动新增一行
- before / after JSON 完整（不缺字段）
- 单测覆盖：创建 / 更新 / 状态迁移 / 失败回滚（失败不写日志）

#### Day 6 — SensitiveOperation 触发器 + InterfaceOperationLog hook

- 高敏感操作触发（SENS-CON-003/004 / M-11 黑名单等）：当 AppService 检测到 sensitive flag → AuditingStore 额外写 SensitiveOperation
- InterfaceOperationLog：NC 接口推送 mock 调用时写入（先在 Material/Supplier 创建时模拟一条 NC-MD-001 调用）

**验收**：
- M-11 黑名单写入（Wave7 实施时验证）→ SensitiveOperation 自动新增
- Material 创建 → InterfaceOperationLog 自动新增一条 NC-MD-001 mock 调用记录

---

### Day 7-12 — Wave7：M-09/10/11 供应商三件套（5 天）

详设依据：01 line 269-271 + 02 V1.0 §供应商 + 10A 角色权限矩阵 §M-11 高敏感。

#### Day 7 — Domain 层

```
Nova.SupplyCores.Domain/Suppliers/
  ├── Supplier.cs                    4 状态机：潜在 / 合格 / 负面 / 黑名单
  ├── SupplierQualification.cs       资质（营业执照 / 煤安证 / 防爆证 等）
  ├── SupplierBlacklist.cs           高敏感：列入 / 解除待审 / 已解除
  └── SupplierStateChangedEto.cs     Domain Event
```

**验收**：Domain 单测覆盖 supplier_state 4 个迁移 + qualification_status 4 个迁移 + blacklist 3 状态

#### Day 8 — EF Core 配置 + Migration Wave7

```
Nova.SupplyCores.EntityFrameworkCore/
  ├── EntityConfigurations/Suppliers/SupplierConfiguration.cs
  ├── EntityConfigurations/Suppliers/SupplierQualificationConfiguration.cs
  ├── EntityConfigurations/Suppliers/SupplierBlacklistConfiguration.cs
  └── Migrations/20260513_Wave7_M09_M10_M11.cs
```

**验收**：
- `dotnet ef migrations add Wave7_M09_M10_M11`
- 3 张表落到 schema `m`（`m.supplier` / `m.supplier_qualification` / `m.supplier_blacklist`）
- `dotnet ef database update` 通过

#### Day 9-10 — Application + Controller（含资质过期 hook）

```
- ISupplierAppService（CRUD + StateTransition events）
- ISupplierQualificationAppService（CRUD + ExpireCheck job hook）
- ISupplierBlacklistAppService（列入 / 解除待审 / 双签确认 - 高敏感）
```

**关键 hook**：
- M-09 状态变化 → emit `SupplierStateChangedEto` → 审计 Store 自动记 OperationLog
- M-11 黑名单列入 → **必须经 SensitiveOperation 双签**（接 Wave6 SensitiveOperationDataSeedContributor 已 seed 的规则）
- M-10 资质过期 → `IBackgroundJobManager` 每日 cron 任务扫描 expire_date < now+30d 的资质 → 写 InterfaceOperationLog（先打日志，后续接 R 域预警）

**验收**：完整 curl smoke：
1. 创建供应商 → state=潜在
2. 加资质 → state=合格
3. 累计负评 → 自动转 负面
4. 触发黑名单审批 → 双签确认 → state=黑名单 + SensitiveOperation 表新增一条
5. 审计表 OperationLog 含 6+ 条对应操作

#### Day 11-12 — 集成测试 + Seed 数据

```
Nova.SupplyCores.Domain/Suppliers/SupplierDataSeedContributor.cs
  → seed 5 家供应商（对照原型 seed-data.js M-09）

Nova.SupplyCores.Application.Tests/Suppliers/SupplierAppServiceTests.cs
  → xUnit + ABP TestBase 覆盖 CRUD + 状态机 + 高敏感
```

**验收**：
- `dotnet test` 通过（覆盖 Material / Organization / Supplier 三件套 + 审计 hook）
- 数据库初始化后 5 家供应商种子可见

---

### Day 13-14 — 联调 + Sprint 0 收尾（2 天）

#### Day 13 — NC-MD mock service 接通

```csharp
// Nova.SupplyCores.Application/NcInterfaces/INcInterfaceService.cs
public interface INcInterfaceService {
    Task<NcPushResult> PushAsync(string interfaceCode, object payload);  // NC-MD-001/002/003
}

// 默认 mock 实现：1-2 秒延迟 + 5% 失败率 + 写 InterfaceOperationLog
public class MockNcInterfaceService : INcInterfaceService { ... }
```

在 MaterialAppService / SupplierAppService 创建后调用 `INcInterfaceService.PushAsync("NC-MD-001", dto)` → 自动写日志。

**验收**：创建物料 → InterfaceOperationLog 新增一条 NC-MD-001 调用（task_state=推送成功 或 5% 概率失败重试）

#### Day 14 — Sprint 0 验收 + Demo + Sprint 1 backlog

| 项 | 验收 |
|---|---|
| 17 家组织树 | GET 返回完整树 |
| 物料 / 供应商完整 CRUD + 状态机 | curl 全套通过 |
| 审计自动写入 | 5+ 操作触发 OperationLog 5+ 行 |
| 高敏感双签 | 黑名单流程双签通过 + SensitiveOperation 行 |
| NC-MD mock 接通 | InterfaceOperationLog 含 NC 调用记录 |
| 试点单位部署 | 1 套独立部署给试点单位测试用（Docker compose 或 IIS）|
| 后端 xUnit 测试 | ≥ 30 个用例通过 |

---

## 三、Sprint 1 衔接（第 13 周开始）

按《存货问题解决方案-领导汇报-V0.1》§2.1 节奏：

| 批次 | 模块 | 周期 |
|---|---|---|
| 第 1 批（Sprint 0-2）| ① 基础档案 + ② 物料主数据 | 8 周（含 Sprint 0 本卡）|
| **第 2 批（Sprint 3-5）** | ③ 采购入库（含暂估）+ ④ 库存调拨 + ⑤ 盘点废旧 | 10 周 |
| 第 3 批（Sprint 6-8）| ⑥ NC 接口 + ⑦ 报表预警 | 10 周 |

进入第 2 批 P0 对应详设：[`04-需求计划与采购协同详细设计-V1.1.md`](../详细设计/04-需求计划与采购协同详细设计-V1.1.md) + [`06-库存实物流转详细设计-V1.1.md`](../详细设计/06-库存实物流转详细设计-V1.1.md) + [`08-财务与NC接口详细设计-V1.1.md`](../详细设计/08-财务与NC接口详细设计-V1.1.md)。

---

## 四、资源 / 风险

| 项 | 估算 / 应对 |
|---|---|
| **人月** | 1 个全栈高级 .NET + 0.3 个 DBA + 0.2 个测试 ≈ **1.5 人月** |
| **关键风险** | Wave6 审计拦截器（Day 4-6）若 `IAuditingStore` 设计不当会影响后续所有模块；**建议 Day 4 设计评审**，由架构师与开发人员对齐 |
| **依赖外部** | Nova SSO（如未通需先解决）/ Nova 17 家组织数据（可先 mock 5-6 家用于演示）|

---

## 五、可复用资产（来自原型 v0.22）

| 原型来源 | 后端对应实现 |
|---|---|
| `prototype/assets/statemachine.js` M-09 配置 `'合格' → '暂停' / '黑名单' / '解除'` | Domain `Supplier.ChangeState()` 方法 + enum |
| `prototype/_smoke-test.js` T9（F-13 14 项 NC 开关）| 后端 `f.interface_switch` 表 seed 数据 |
| 原型 `master-data-admin.html` 三个 panel（NC-MD 下推队列 / 审批流 / 变更审计）| 前端 `nova.supplycores/frontend` 里对应页面 |
| 原型字段口径（每页底部"页面说明"卡引用的详设章节）| 后端实体注释 + xmldoc 引用同一详设 |

---

## 六、衔接 Sprint 0.5（风格统一）

Sprint 0 后**紧跟 Sprint 0.5（1-2 天）**做命名风格统一 — 避免 Sprint 1 业务开发期再回头改：

| 任务 | 估时 |
|---|---|
| 加 `EFCore.NamingConventions` + 配 `UseSnakeCaseNamingConvention()` | 0.5 天 |
| Reset DB + 重做 Wave1-7 migration（PascalCase 列名 → snake_case）| 0.5 天 |
| 已有 16 个业务实体 → 改继承 `SupplyCoresFullAuditedAggregateRoot<TKey>`（在 D1-5 已建好基类）| 0.5 天 |
| 详设 12 个文档全文术语对齐（`created_at` → `creation_time` 等）| 0.5 天 |

完整任务卡见 [`Sprint-0.5-任务卡-V0.1.md`](./Sprint-0.5-任务卡-V0.1.md)。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-11 | 首版任务卡：2 周 10 工作日；Day 1-14 拆解；M-09/10/11 供应商 + Material/Organization 应用层 + Wave6 审计接通 + NC-MD mock 四大块；衔接 Sprint 1 第 2 批 P0；估算 1.5 人月 |
| V0.2 | 2026-05-11 | 加 D1-5 补抽象基类 `SupplyCoresFullAuditedAggregateRoot<TKey>`（含 `CreatedOrgId` + `DeleteReason`）+ Wave7 M-09/10/11 直接用新基类；衔接 Sprint 0.5 命名风格统一 |
| V0.3 | 2026-05-12 | 落地 `评审留痕/数据隔离边界sub_group_id修订建议清单-V0.1` 修订 #2：D1-5 抽象基类追加 `SubGroupId long?` 详设独有字段（数据所属二级集团 FK→M-01，A-06 数据范围一刀切主用字段）+ 写入钩子占位说明 + 验收点 2 条。**联动：** 详设 01 V1.1 / 详设 02 V1.1 / 审计字段映射表 V0.2 同期生效；CI 检测项（业务表必须有 sub_group_id 列）在 Sprint 0.5 任务卡落地。 |
