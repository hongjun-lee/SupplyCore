# 数据隔离边界 sub_group_id 修订建议清单 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-12
**文档性质：** 详细设计层 · 评审留痕 · 跨详设全局修订建议
**适用范围：** 详设 01 / 02 / 10 + 审计字段映射表 + 后续所有业务表设计

---

## 文档目的

把 2026-05-12 用户提问"Catio.platform.organizations 有 `sub_group_id` 字段，我们这边怎么对齐"过程中识别出的**数据隔离边界字段缺失**问题统一登记，给出 4 条具体修订建议 + 4 条全局设计原则，作为详设 01 / 02 / 10 后续升版与新表起草时的强制对照项。

**核心问题一句话：** 招标/概要/详设/原型多处明确"**以二级集团为数据隔离边界**"，但 `M-01 organization` 表与业务实体审计基类**都没有冗余 `sub_group_id` 字段**，过滤当前只能靠 `org_path` 字符串匹配或沿 `parent_id` 递归回溯。一期单二级集团（阜矿）部署不致命，但已与 Catio 上位表脱口径，且未来多二级集团合并部署/事后回填代价显著。

---

## 触发原因与现状证据

### 1. 上位系统口径

- **Catio.platform.organizations**：明确含 `sub_group_id` 字段，标识每条组织记录所属二级集团
- **辽宁能源集团组织模型**：5 层（集团 → 二级集团 → 厂矿 → 部门 → 班组），阜矿 = 辽宁能源下属之一二级集团

### 2. 招标 / 概要 / 详设侧已多处"言之凿凿"数据隔离边界 = 二级集团

| 出处 | 表述 |
| --- | --- |
| `docs/招标/物资供应管理系统招标技术要求-v1.1.md:797` | 数据隔离以二级集团为边界，与集团平台隔离机制保持一致 |
| `docs/招标/供应商答疑口径-v1.1.md:40` | 内部自行实现数据范围控制，但须**以二级集团为数据隔离边界** |
| `docs/招标/附件三-角色权限矩阵-v1.1.md:187` | 数据隔离粒度须与集团平台一致，以二级集团为数据隔离边界 |
| `docs/需求梳理/01-项目目标与范围说明-V1.0.md:178` | 隔离粒度和组织边界须与平台一致（以二级集团为数据隔离边界）|
| `docs/需求梳理/07-角色权限与审批矩阵-V1.0.md:372` | 同上 |
| `docs/需求梳理/08-招标技术要求目录（讨论稿）.md:241` | 同上 |
| `prototype/system-admin.html:204` | 按 sub_group_id 完整数据过滤、Nova SSO 真实联调、A-06 数据权限表完整实施 在产品实施阶段完成 |
| `prototype/ai-assistant.html:44 / 119 / 188` | 演示口径按当前角色筛选；**实际过滤以 sub_group_id 为准** |
| `prototype/README.md:25` | 数据范围按 sub_group_id 完整过滤为产品实施阶段事项 |

### 3. 详设侧的实际落点

| 文档/字段 | 现状 | 缺口 |
| --- | --- | --- |
| `02-基础档案与组织仓库详细设计-V1.0.md` §4.1 M-01 organization | 有 `parent_id` / `org_path` / `org_type` / `org_level` / `nova_org_id` | **无 `sub_group_id`** 冗余字段 |
| `01-数据库逻辑模型-V1.0.md` §4.2 审计字段 + `审计字段映射表-V0.1.md` §2.2 | 有 `created_org_id` (创建人所属组织) | **无 `sub_group_id`** —— `created_org_id` 是"创建人组织"，与"数据所在二级集团"不一定同义（共享仓 / 跨组织调拨 / 集团级主数据时差异显现）|
| `10-权限审批流详细设计-V1.2.md` §4.6 A-06 data_permission | `data_scope` 含 `org_self/org_subtree`，靠 org 维度递归 | **没有"按 sub_group_id 一刀切"的快速通道**；每张报表 / AI Tool 都要 join organization 并解析 org_path |
| `01-数据库逻辑模型-V1.0.md` §4.8 多租户字段 | 预留 `tenant_id`，一期不启用 | tenant_id 与 sub_group_id 语义**不同**：tenant 是部署/账号体系层面，sub_group 是组织/数据范围层面；不能混用 |

### 4. 风险评估

| 风险 | 严重度 | 触发条件 |
| --- | --- | --- |
| 跨二级集团数据泄露（filter 遗漏一条 SQL） | **高** | 多二级集团合并部署 |
| 报表/AI Tool 每次过滤 join + org_path 解析 → 性能退化 | 中 | 数据量 ≥ 百万级 |
| 事后回填 sub_group_id（业务表已积累大量数据） | **高（人力成本）** | 一期上线后 ≥ 6 个月才发现 |
| 与 Catio 上位表字段脱口径，同步映射逻辑变复杂 | 中 | Nova 同步联调阶段 |

---

## 评审定位

**本清单未敲定；** 经详设作者评审采纳后，随对应详设文档同步升版：
- 修订 #1 → `02-基础档案与组织仓库详细设计-V1.1`（M-01 加字段）
- 修订 #2 → `01-数据库逻辑模型-V1.1` + `审计字段映射表-V0.2`（基类加字段）
- 修订 #3 → `10-权限审批流详细设计-V1.3`（A-06 过滤优先用新字段）
- 修订 #4 → `02-基础档案与组织仓库详细设计-V1.1` §4.1 业务规则 + Sprint-1 任务卡（Nova 同步契约）
- 驳回的条目在本清单显式记录"为什么不接受"

**评审 SLA 期望：** T+3 工作日（涉及 Sprint 0 抽象基类落地，越早决越省事）。

---

## 一、修订建议总表（4 项）

| # | 类别 | 修订点 | 触发原因 | 优先级 |
| --- | --- | --- | --- | --- |
| 1 | L1 | 详设 02 §4.1 `M-01 organization` 增加 `sub_group_id bigint NULL FK→M-01.org_id` 自指字段 | 与 Catio.platform.organizations 字段对齐 | **P0** |
| 2 | L1 | 详设 01 §4.2 审计字段 + 审计字段映射表 §2.2 + `SupplyCoresFullAuditedAggregateRoot<TKey>` 基类**增加** `sub_group_id` 字段 | 业务实体一刀切过滤 | **P0** |
| 3 | L2 | 详设 10 §4.6 A-06 data_permission：org 维度过滤增加"按 sub_group_id 直接匹配"的快速通道 | 性能 + 防泄露 | P1 |
| 4 | L2 | 详设 02 §4.1 业务规则 + Sprint-1 任务卡补充 Nova 同步契约：`sub_group_id` 由 Catio.platform.organizations.sub_group_id 直接同步映射，不做物资侧推导 | 同步映射边界清晰 | P1 |

**P0 必须在 Sprint 0 D1-5 抽象基类落地前敲定**（详见 `Sprint-0-任务卡-V0.1.md` D1-5），否则 Sprint 0.5 全库 snake_case 改造后再回头改基类成本翻倍。

---

## 二、逐条修订建议

### 修订 #1：详设 02 §4.1 `M-01 organization` 加 `sub_group_id` 字段（L1 / P0）

**触发：** Catio.platform.organizations 已有此字段；详设 02 缺。

**当前详设 02 §4.1.1 全字段表（节选）：**

```
| nova_org_id    | varchar(64) | NOT NULL UQ | Nova Platform 端的稳定 ID |
| parent_id      | bigint      | NULL FK→M-01 | 树形自引用；根节点为 NULL |
| org_type       | varchar(32) | NOT NULL    | 集团/二级集团/厂矿/部门/班组 |
| org_level      | smallint    | NOT NULL    | 1-5；1=集团（辽宁能源）；5=班组 |
| org_path       | varchar(512)| NOT NULL    | 路径形如 `/1/12/108/` |
```

**建议在 `org_path` 之后插入：**

```
| sub_group_id   | bigint      | NULL FK→M-01.org_id | idx | 所属二级集团 org_id；
                                                       自身即二级集团时 = org_id；
                                                       集团根节点（org_level=1）为 NULL；
                                                       与 Catio.platform.organizations.sub_group_id 对齐 |
```

**特别说明追加：**

> - `sub_group_id` 由 Nova 同步时根据 `org_type='二级集团'` 自动回算，或直接吃 Catio 上位字段（详见修订 #4）
> - 物资侧不允许人工维护；`parent_id` 变更触发的 `org_path` 重算同时重算 `sub_group_id`
> - 集团根节点（辽宁能源，`org_level=1`）`sub_group_id IS NULL`；任何**跨二级集团共享**的集团级主数据可设 NULL 显式标注

**联动改动：**
- §4.1.3 业务规则 #2 "数据权限根节点"补一句：厂矿级（`org_level=3`）默认 `is_data_scope_root=true` **且** `sub_group_id` 必须指向其所在二级集团（`org_level=2`）的 `org_id`
- §五 ERD：`M-01 organization` 节点上加自指虚线 `sub_group_id → org_id`
- Sprint-1 任务卡 mock seed 数据：17 家组织的 `sub_group_id` 全部 = 阜矿 org_id（一期单二级集团）

---

### 修订 #2：审计基类 + 详设 01 §4.2 加 `sub_group_id`（L1 / P0）

**触发：** 业务实体过滤要"一刀切"，必须把二级集团 ID 冗余落到每行业务数据上；不能依赖 `created_org_id` 回溯，因为：
- 共享仓库（M-02 `is_shared=true`）的库存数据"创建组织" ≠ "数据所在二级集团"
- 跨二级集团调拨（详设 07 已显式标注一期不开放，但二期可能解禁）将出现 `created_org_id` 与"数据归属"分离
- 集团级共享主数据（M-05 物料、M-09 供应商）未来可能 `sub_group_id IS NULL`

**当前 `01-V1.0.md` §4.2 审计字段表：**

```
| creator_id              | uuid       |
| creation_time           | timestamptz|
| last_modifier_id        | uuid?      |
| last_modification_time  | timestamptz?|
| created_org_id          | bigint?    | 详设独有
| concurrency_stamp       | varchar(40)|
```

**建议在 `created_org_id` 之后追加：**

```
| sub_group_id            | bigint?    | 详设独有 | 该行业务数据所属二级集团（FK→M-01）；
                                                  写入时由 created_org_id 回溯 M-01.sub_group_id 确定；
                                                  集团级共享主数据可为 NULL；
                                                  A-06 数据范围过滤的"一刀切"主用字段 |
```

**联动改动：**

1. **`审计字段映射表-V0.1.md` §2.2 详设独有字段** 追加：

   | 详设字段 | 类型 | C# 属性 | 说明 |
   | --- | --- | --- | --- |
   | `sub_group_id` | bigint NULL | `SubGroupId` `long?` | 数据所属二级集团（FK→M-01），A-06 一刀切过滤主用字段 |

2. **抽象基类 `SupplyCoresFullAuditedAggregateRoot<TKey>`** 加属性（`Sprint-0-任务卡-V0.1.md` D1-5）：

   ```csharp
   /// <summary>详设 01 §4.2：数据所属二级集团（FK→M-01）；A-06 过滤主用</summary>
   public virtual long? SubGroupId { get; protected set; }
   ```

3. **写入钩子**：仓储层 `ICurrentUser` + 组织上下文，新增/迁移时由 `created_org_id` → `M-01.sub_group_id` 一次性回算后落库；集团级共享主数据由 Domain Service 显式置 NULL。

4. **CI 检测项追加**：所有继承 `SupplyCoresFullAuditedAggregateRoot<TKey>` 的业务表，DDL 必须有 `sub_group_id` 列；缺失即 CI 红灯。

---

### 修订 #3：A-06 数据权限 org 维度过滤增加 sub_group_id 快速通道（L2 / P1）

**触发：** 当前 A-06 `data_scope` 取值 `all / org_self / org_subtree / specified`，org 维度过滤靠递归 org_path；新增字段后应优先用单字段匹配。

**当前详设 10 §4.6：**

```
| data_scope | varchar(20) | all / org_self / org_subtree / specified |
| scope_value| jsonb       | data_scope=specified 时存储具体 ID 列表 |
```

**建议在 `data_scope` 取值中追加 `sub_group_self`：**

| 取值 | 语义 | 实现 |
| --- | --- | --- |
| `sub_group_self` | 限定为用户所在二级集团范围内全部数据 | `WHERE sub_group_id = :user_sub_group_id`（单条件，命中索引）|
| `org_self` | 仅创建组织 = 用户所在组织 | `WHERE created_org_id = :user_org_id` |
| `org_subtree` | 创建组织 ∈ 用户组织子树 | `WHERE created_org_id IN (SELECT org_id FROM m_01 WHERE org_path LIKE :user_org_path || '%')` |

**默认推荐**：业务角色的默认 `data_scope = sub_group_self`（招标口径"以二级集团为隔离边界"），`org_subtree` 仅用于厂矿级及以下精细化控制。

**联动改动：**
- 10A V0.6 节五 / 6.1 实施层映射表追加 `sub_group_self` 的 Catio Nova.Platform.DataScopeGrant 落点
- AI Tool 调用（R-07）默认按 `sub_group_self` 过滤

---

### 修订 #4：Nova 同步契约补 sub_group_id 字段映射（L2 / P1）

**触发：** Catio.platform.organizations 已有 sub_group_id 字段，**优先直接同步**而非物资侧推导，避免双口径漂移。

**当前 02 §4.1.3 业务规则 #1**：

> Nova 同步规则：T+1 全量校验 + 实时事件订阅；同步失败回写 sync_status=同步失败 并触发 F-09 mapping_missing_alert 告警

**建议补充**：

> **Nova 同步字段映射**（新增）：
> - Catio.platform.organizations.sub_group_id → SupplyCore M-01.sub_group_id（**直接同步，不做物资侧推导**）
> - 若 Catio 端字段为空（极少数老数据），物资侧按 `org_type='二级集团'` 沿 parent_id 回溯一次后回写，**并触发 mapping_missing_alert 提示 Catio 端补数据**
> - 同步映射逻辑落在 `10A-给Catio团队的字段缺口提问清单` 补一条 Q（如已有 sub_group_id 对接条款则确认；若无则要求 Catio 团队明确该字段语义与值域）

**联动改动：**
- `10A-给Catio团队的字段缺口提问清单-V1.0.md` 增加一条问询：sub_group_id 字段语义、值域、是否对所有组织节点都有值
- Sprint-1 任务卡 B 阶段（Nova 联调）增加一条验收点：同步过来的 17 家 mock 组织 sub_group_id 字段非空率 100%（集团根节点除外）

---

## 三、设计原则（防止后续踩坑）

> 以下 4 条原则在采纳修订 #1 #2 后自动生效；**新增/修改物资侧业务表时必须逐条对照**。

### 原则 1：所有业务实体必须通过基类落 sub_group_id，禁止绕过

- 业务实体一律继承 `SupplyCoresFullAuditedAggregateRoot<TKey>`；该基类自带 `sub_group_id`
- 严禁直接继承 ABP `FullAuditedAggregateRoot<TKey>`（绕过基类即绕过 sub_group_id）
- CI 检测：`grep -r ": FullAuditedAggregateRoot" modules/nova.supplycores/src/Nova.SupplyCores.Domain/` 应零结果

**例外白名单**（不挂 sub_group_id）：
- 系统级配置/字典（`SY-*`、`F-13`、`F-14`、`R-01`）— 全局生效
- 审计/日志类（`A-13` 到 `A-19`）— 已有自己的范围标识
- 多租户 `tenant_id` 字段表（与 sub_group_id 语义平行）

### 原则 2：以二级集团为数据隔离边界的过滤优先用 sub_group_id 一刀切，禁止递归 org_path

- 任何报表、API、AI Tool、导出的 SQL 在"按二级集团范围"维度过滤时，**第一选择 `WHERE sub_group_id = ?`**
- `org_path LIKE` 递归仅用于：厂矿级及以下子树精细化过滤、跨二级集团统计（必须显式声明授权）
- 不允许：业务代码里出现 `WHERE created_org_id IN (SELECT org_id FROM m_01 WHERE org_path LIKE '%')` 这种回溯模式
- Code Review 检查项

### 原则 3：跨二级集团业务必须在表上显式声明，禁止靠组织树推导

- 跨二级集团调拨（详设 07 已标一期不开放）、集团级共享物料、集团级共享供应商等场景，必须在对应表加显式字段（如 `is_group_shared boolean` / `cross_group_authorized boolean`），不允许靠"sub_group_id IS NULL" 隐式表达多义
- 详设 07 §728 "跨二级集团设备权属变更"已是反例：当前仅说"一期不开放、需项目领导小组确认"，未明确表字段；二期解禁时必须先建字段

### 原则 4：sub_group_id IS NULL 仅用于集团根 / 集团级共享主数据，过滤时显式处理

- NULL 语义有且仅有两种：① 集团根节点（辽宁能源 org_level=1）；② 集团级共享主数据
- SQL 过滤时禁止 `WHERE sub_group_id = :x OR sub_group_id IS NULL` 隐式合并；必须显式：

  ```sql
  WHERE sub_group_id = :user_sub_group_id
     OR (sub_group_id IS NULL AND is_group_shared = true)
  ```

- 集团级共享主数据必须有伴随字段（如 `is_group_shared / share_scope`），不允许仅靠 NULL 兜底

---

## 四、影响范围

| 详设/产物 | 影响点 | 改动量 |
| --- | --- | --- |
| `01-数据库逻辑模型-V1.0.md` | §4.2 审计字段表加一行 | 小 |
| `02-基础档案与组织仓库详细设计-V1.0.md` | §4.1 加字段 + §4.1.3 业务规则 + §五 ERD + §十二版本沿革 | 中 |
| `审计字段映射表-V0.1.md` | §2.2 加一行 + §三基类代码示例 | 小 |
| `10-权限审批流详细设计-V1.2.md` | §4.6 data_scope 加 sub_group_self 取值 | 小 |
| `10A-权限审计域整合方案-V0.6.md` | 节五 / 6.1 实施层映射表追加 | 小 |
| `10A-给Catio团队的字段缺口提问清单-V1.0.md` | 加一条 sub_group_id 字段问询 | 小 |
| `Sprint-0-任务卡-V0.1.md` D1-5 | 抽象基类加 SubGroupId 属性 + EF 配置 | **关键 P0 节点** |
| `Sprint-0.5-任务卡-V0.1.md` | snake_case 检测脚本加 sub_group_id 列存在性校验 | 小 |
| `Sprint-1-任务卡-V0.1.md` | mock seed 17 家组织数据加 sub_group_id 列 + Nova 联调验收点 | 小 |
| `prototype/` | 现有原型已经口径上用 sub_group_id，不需要改 | 无 |
| 其他业务详设 03-09 | 不需要改字段表（基类决定）；但需要在 Code Review 阶段对照原则 1-4 | 检查项 |

---

## 五、与既有约定的关系

| 既有约定 | 与本清单的关系 |
| --- | --- |
| 详设 01 §4.8 `tenant_id` 一期不启用 | **不冲突**：tenant_id 是租户/部署体系，sub_group_id 是组织/数据范围；两者语义平行，未来可并存 |
| `created_org_id`（详设 01 §4.2 现有字段） | **保留**：用于"创建人所属组织"的细粒度过滤；sub_group_id 用于二级集团一刀切；两者互补不替代 |
| `org_path`（详设 02 §4.1 现有字段） | **保留**：用于厂矿级及以下子树精细化过滤；sub_group_id 用于二级集团粗粒度过滤 |
| `is_data_scope_root`（详设 02 §4.1 现有字段，厂矿级默认 true） | **保留**：用于权限分配的最小完整业务单元；sub_group_id 用于过滤主用字段 |
| 详设 07 §240 "跨二级集团调拨一期不开放" | **保留**：本清单原则 3 进一步约束二期解禁时必须在表上显式声明 |

---

## 六、项目内确认状态记录（2026-05-12）

> **状态：** 项目内已确认（详设作者 2026-05-12 逐项评审），清单进入"被吸收"阶段。
> **SLA 留痕：** 原 T+3 SLA 当日关闭；采纳条目按"修订采纳后联动版本号"表同步落地。

### 6.1 修订决议表

| # | 修订点（简述） | 项目内决定 | 备注 |
| --- | --- | --- | --- |
| 1 | 详设 02 §4.1 M-01 organization 加 `sub_group_id` 字段 | 采纳 | 与 Catio.platform.organizations 同名字段对齐 |
| 2 | 详设 01 §4.2 + 审计字段映射表 §2.2 + 基类加 `sub_group_id` | 采纳 | Sprint 0 D1-5 抽象基类一并落地 |
| 3 | 详设 10 §4.6 A-06 新增 `sub_group_self` 取值 | **采纳+调整** | 见下方"#3 调整说明" |
| 4 | Nova 同步契约：sub_group_id 直接吃 Catio 同名字段 | 采纳 | 加边界条件：集团根节点 NULL 与 Catio 端保持一致 |
| O1-O4 | 4 条全局设计原则（必经基类 / 过滤一刀切 / 跨二级集团显式声明 / NULL 显式处理） | 采纳 | 作为 Code Review 强制检查项；后续 03-09 各详设新表起草必须对照 |

### 6.2 #3 调整说明

**原建议：** 在详设 10 §4.6 A-06 data_scope 字典正式新增 `sub_group_self` 取值（一刀切过滤主用）。

**调整为：** 本次升版仅在 §4.6 加注"过滤实现优先用 sub_group_id 单字段匹配，详见 sub_group_id 修订清单原则 2"；**不正式新增字典取值**。

**调整理由：**
- **原则 2 已强制约束** 过滤优先用 sub_group_id 一刀切，实现侧已可在 `org_self`/`org_subtree` 的 SQL 模板里直接用 sub_group_id 做条件包装，无需新增字典枚举
- 新增 `sub_group_self` 取值会让 Catio Nova.Platform.DataScopeGrant 适配层多一个映射点（10A V0.6 节五），与"减少接口层散点"的整治方向相反
- 详设 10 V1.2 刚出版（2026-05-11），不必为加一个取值立刻升 V1.3；等 10A 下次批量升版（如 V0.7）时再正式纳入字典更经济
- 二期若出现真正需要"按二级集团显式授权而非默认隔离"的场景（如集团报表角色），届时再正式加取值，回头不晚

**联动确认：** Sprint 0 抽象基类先把字段建好（修订 #2），实现层就能用；A-06 字典正式扩枚不在本次升版关键路径上。

### 6.3 修订采纳后联动版本号

| 文档 | 当前版本 | 采纳后版本 | 本次升版 | 说明 |
| --- | --- | --- | --- | --- |
| 详设 02 基础档案与组织仓库 | V1.0 | V1.1 | ✅ 本次 | M-01 加字段 + 业务规则 + ERD + 版本沿革 |
| 详设 01 数据库逻辑模型 | V1.0 | V1.1 | ✅ 本次 | §4.2 审计字段表加行 |
| 审计字段映射表 | V0.1 | V0.2 | ✅ 本次 | §2.2 加行 + §三基类代码 + §七 CI 检测 |
| 详设 10 权限审批流 | V1.2 | （加注不升版） | ✅ 本次（仅加注） | §4.6 A-06 加 sub_group_id 优先口径注；正式扩枚下次批量合入 |
| Sprint-0 任务卡 | V0.1 | （文内追加） | ✅ 本次 | D1-5 抽象基类加 SubGroupId 属性 + EF 配置 + 验收点 |
| 10A 权限审计域整合方案 | V0.6 | （视情）V0.7 | ⏸ 待联动 | 下次批量升版时 §五 / §6.1 落点表追加 sub_group_id 维度 |
| 10A 给 Catio 团队字段缺口提问清单 | V1.0 | V1.1 | ⏸ 待联动 | 追加 Q：sub_group_id 字段语义/值域/集团根节点取值 |
| Sprint-0.5 任务卡 | V0.1 | （文内追加） | ⏸ 待联动 | snake_case CI 检测脚本加 sub_group_id 列存在性 |
| Sprint-1 任务卡 | V0.1 | （文内追加） | ⏸ 待联动 | mock seed 17 家组织加 sub_group_id；Nova 联调验收点 |

**项目内确认人：** 详设作者（2026-05-12 项目内代行评审）
**确认方式：** 2026-05-12 单次过审，4 项修订 + 4 项原则全部采纳（#3 含调整）

**当前状态：** 本次升版完成详设 02 V1.0→V1.1、详设 01 V1.0→V1.1、审计字段映射表 V0.1→V0.2、详设 10 §4.6 加注、Sprint-0 任务卡 D1-5 字段追加；待联动文档（10A / 给 Catio 字段缺口清单 / Sprint-0.5 / Sprint-1）纳入下一次批量合入。本清单不再作为待办清单使用，仅保留评审留痕。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
| --- | --- | --- |
| V0.1 | 2026-05-12 | 首版：4 条修订建议 + 4 条设计原则；触发原因来自用户提问"Catio sub_group_id 我们是否支持" |
| V0.1（评审通过补记）| 2026-05-12 | 追加节六"项目内确认状态记录"：4 项修订 + 4 项原则全部采纳（#3 含调整为加注不扩枚）；详设 02/01/审计字段映射表/详设 10/Sprint 0 本次升版落地；10A/给 Catio 缺口清单/Sprint 0.5/1 待联动。清单进入"被吸收"阶段，版本号保留 V0.1（终态），不升 V0.2。 |

---

## 八、一句话结论

招标/详设/原型多处把"以二级集团为数据隔离边界"写死了，但 M-01 organization 与业务审计基类都没有 sub_group_id 字段；本清单 4 项修订 + 4 项原则评审通过并已落地 P0 详设文档，Sprint 0 抽象基类同步加字段，后续每张业务表起草必须对照原则 1-4 做 Code Review。
