# NovaSync 实施层切换方案 V0.2

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（用户确认：开发期直连、联调期 API 契约、UAT/生产前切换）
**日期：** 2026-05-13
**文档性质：** 详细设计层 · 集成实施方案
**适用范围：** Catio Nova 组织 + 人员同步的实施层（开发期直连 → 生产期 WebAPI）
**衔接文档：**

- [`Sprint-1-任务卡（V0.3+）`](../Sprint/Sprint-1-任务卡-V0.7.md) §1.1 D1-2 NovaSync 范围
- [`02-基础档案与组织仓库详细设计-V1.1.md`](./02-基础档案与组织仓库详细设计-V1.1.md) §4.1 M-01 organization
- [`评审留痕/数据隔离边界sub_group_id修订建议清单-V0.1.md`](./评审留痕/数据隔离边界sub_group_id修订建议清单-V0.1.md) §修订 #4 Nova 同步契约
- [`10A-给Catio团队的字段缺口提问清单`](./10A-给Catio团队的字段缺口提问清单-V1.1.md) §九 Bis NovaSync API 契约（V1.1+ 增加）

---

## 一、背景

Sprint 1 D1-D2 让 SupplyCore 落地"从 Catio 同步阜矿组织树到本地 M-01 表"的第一版实现。**开发期**为了快速跑通，走的是**直连 Catio 生产 Nova DB**（`Host=fxkyjt.cn;Port=5432;Database=Nova` 只读访问 `platform.organizations`）。**UAT / 生产前**这条路必须改走 Catio 提供的 **WebAPI**，理由见 §三。

本文档不重新定义同步语义（语义见 sub_group_id 评审留痕清单 §修订 #4 + 详设 02 V1.1 §4.1）；只规定**实施层从开发期到生产期的切换路径**。

## 二、阶段性协同决议（2026-05-13 用户确认）

本项目采用 **“需求先跑通、契约后固化”** 的协同模式：Catio 团队可以在需求明确后再形成正式 API 契约和交付计划，SupplyCore 不因 Catio API 未完全就绪而阻塞开发验证；但 **UAT / 生产前必须完成 API 化切换**，不得长期依赖数据库直连。

### 2.1 三阶段策略

| 阶段 | SupplyCore 允许做法 | Catio 团队职责 | 退出条件 |
|------|------------------|---------------|----------|
| **Stage A：开发验证期** | 允许只读直连 `platform.organizations`；允许基于 Catio 源码复用 `Nova.Platform` / `Nova.Workflow` 模块并在 SupplyCore 本地库建表；人员、权限、事件类能力可先 mock / 本地过渡 | 配合确认字段语义、表结构事实、源码版本；不要求一次性交付全部 API | SupplyCore 跑通组织同步、sub_group_id 数据隔离、Workflow 映射样例；沉淀真实 API 需求 |
| **Stage B：联调期** | 从直连实现切换为可配置的 `HttpNovaSourceReader`；保留 `INovaSourceReader` 抽象，业务下游不改 | 基于 Stage A 实测需求提供组织 / 人员 API 契约、OAuth scope、测试环境、字段清单、错误码和版本承诺 | API 契约冻结；staging 环境可拉取阜矿组织树；OAuth client 可用 |
| **UAT / 生产前** | 禁止继续依赖生产 DB 直连；统一走 Catio WebAPI / OAuth / 审计链路 | 提供正式环境 API、凭据、限流和审计说明；明确 schema / DTO 演进兼容策略 | DbMigrator + Web 均通过 API 同步验证；直连凭据下线或仅保留开发诊断用途 |

### 2.2 可先直连或本地过渡的范围

- **组织机构 `platform.organizations`**：开发期可只读直连，用于同步阜矿子树、验证 `sub_group_id`、`org_code`、层级路径和字段口径；正式 API 到位后切换 `HttpNovaSourceReader`。
- **组织字段探查 / 需求反推**：`id / parent_id / sub_group_id / code / name / level / name_path / is_active` 等字段可先从库中实测，再反向整理成 Catio API DTO 需求。
- **Catio 模块源码复用**：`Nova.Platform` / `Nova.Workflow` 可先通过 `[DependsOn]` 在 SupplyCore 本地独立库建表跑通；这不等同于访问集团 Nova 运行库。
- **Workflow DSL / ApproverRule / 审批记录映射**：可先按 Catio 源码和本地样例验证，Catio 后续补正式 JSON Schema、模板示例和接口文档。
- **人员数据**：开发期原则上使用 mock 或脱敏样例；不直接批量拉取手机号、身份证等 PII。待字段权限和脱敏规则明确后，再接 Catio 人员 API。
- **权限数据范围**：SupplyCore 可先本地实现 `sub_group_id`、组织范围、仓库 / 物料 / 供应商业务范围等规则；Catio 后续补 DataScope 授权接口与审计口径。
- **组织 / 人员变更事件**：Webhook / SignalR / SSE 可滞后；未提供前按定时全量 / 增量同步 + 幂等对账降级。

### 2.3 不建议直连、必须走正式机制的范围

- **SSO 登录 / OAuth 授权**：生产登录必须走 Nova / OIDC，不得直连用户表模拟。
- **向 Catio / Nova 写数据**：组织、人员、角色、平台权限等权威数据不得由 SupplyCore 直写。
- **生产环境长期数据库直连**：直连仅限开发验证或诊断；UAT / 生产前必须切换 API，否则凭据、安全审计、网络边界和 schema 演进风险不可控。
- **敏感人员字段**：身份证号、手机号等 PII 必须有明确授权、脱敏策略和审计要求后方可同步。

### 2.4 对 Catio 滞后交付的边界要求

Catio 团队可以在 SupplyCore 明确实测需求后再形成正式需求和排期，但需满足以下边界：

1. **Stage A 不阻塞**：API 未就绪不阻塞 SupplyCore 组织同步、业务主线和 Workflow 适配验证。
2. **Stage B 必须给契约**：进入真实联调前，至少提供组织 API、OAuth scope、测试环境、字段说明和版本 / commit 标识。
3. **UAT 前必须切换**：UAT / 生产验收前，SupplyCore 的组织同步必须从 `NpgsqlNovaSourceReader` 切到 `HttpNovaSourceReader`；人员同步、SSO、权限授权等也必须走正式 API / OAuth / Workflow 机制。
4. **未提供实时事件可降级**：组织 / 人员变更事件不是 Stage B 必需项；没有事件时按每 6 小时全量 / 增量同步 + 幂等对账处理。

## 三、生产期不能继续直连 DB 的 6 条理由

| 维度 | 直连 DB（开发期） | WebAPI（生产期） |
|------|------------------|------------------|
| 凭据管理 | 5432 凭据明文落地到每个消费方 secrets，泄露后须改密影响所有消费方 | OAuth token，过期自动失效 + 单方吊销 |
| Schema 演进 | Catio 改 `platform.organizations` 列名 / 索引直接挂消费方 | API 契约稳定，Catio 内部 schema 演进对消费方透明 |
| 网络边界 | 5432 端口跨网段暴露（防火墙 / VPN 接入痛点）| HTTPS 443，集团统一接入标准 |
| 权限粒度 | DB user 只能做表 / schema 维度授权（粗）| API 维度（细，能按 user.sub_group_id 自动过滤数据范围 = sub_group_id 评审留痕清单 §三 原则 2 直接落地）|
| 实时事件 | 只能轮询（T+1 全量校验 + 每小时增量？性能 / 延迟两难）| Webhook / SSE / SignalR 推送，组织变更秒级到 SupplyCore |
| 审计 | DB query log（重，含全部 SQL 文本，不带 caller 业务身份）| API log（轻，含 caller user_id + sub_group_id + 操作类型）|

## 四、当前 D1 直连实现的边界

`Sprint-1-任务卡-V0.6` D1-D5 已落地的代码：

```
modules/nova.supplycores/src/
├── Nova.SupplyCores.Domain/Integration/Nova/
│   ├── NovaSyncOptions.cs          POCO（ConnectionString + RootSubGroupId + ReadOnly + Timeout）
│   ├── NovaOrgRow.cs               行模型 DTO
│   ├── INovaSourceReader.cs        ★ 抽象接口 —— 实现可换的关键
│   └── NovaUuidMapper.cs           单进程 uuid ↔ bigint 映射
└── Nova.SupplyCores.EntityFrameworkCore/Integration/Nova/
    └── NpgsqlNovaSourceReader.cs   ★ 开发期实现（Npgsql 直连 + 指数退避重试）
```

**关键设计：** `INovaSourceReader` 接口在 Domain 层（不依赖 Npgsql），具体实现通过 DI 注入。这就是为生产期切换准备的扩展点。

**边界 / 已知缺陷：**

- 凭据写在 `appsettings.secrets.json` —— 不入 git，但开发机本地落地，**不适合生产**
- 5432 直连受限于 fxkyjt.cn 出网 ACL，**集团生产环境网络隔离后可能不可达**
- 当前仅同步组织（995 行 `m.organization`），**不同步人员**（11258 人含 PII，留生产期）
- 无实时事件订阅，每次 DbMigrator 跑时全量拉取 + idempotent 比对
- 没有按调用方身份过滤数据范围（开发期所有 SupplyCore 实例都能拉阜矿全树）

## 五、生产期 HttpNovaSourceReader 切换条件

按 sub_group_id 评审留痕清单 §修订 #4 与本方案 §二 的阶段性协同决议，Catio 团队在 Stage B / UAT 前需要提供以下 **3 件事**，切换才能闭环：

### 5.1 组织树查询 API endpoint

期望端点形如：

```http
GET /api/platform/organizations
  ?sub_group_id={uuid}        ← 必填，调用方所在二级集团 ID（鉴权应自动注入）
  &include_descendants=true    ← 可选，默认 true，返回完整子树
  &since={iso8601}             ← 可选，增量拉取（last_modification_time >= since）
  &page_size=500
Accept: application/json

→ 200 OK
{
  "items": [
    {
      "id": "40351efe-...",
      "parentId": "7d10b21e-...",
      "subGroupId": "40351efe-...",
      "code": "001.007",
      "name": "阜新矿业",
      ...
    },
    ...
  ],
  "page_token": "...",
  "total": 995
}
```

如果 Catio 没有现成端点，SupplyCore 团队可以提交 PR 到 `Catio/modules/nova.platform`，按详设 02 V1.1 §4.1 字段表逐字段映射。

### 5.2 OAuth 凭据 + scope

API 凭据由 Stage B1 申请：

- `client_id` / `client_secret` 颁发给 SupplyCore.Web 应用
- scope 至少包含 `platform.organizations.read`
- 凭据由 `Nova.Platform.OpenIddict` 颁发，token 过期可吊销

OAuth 凭据流程绑定到 sub_group_id 评审留痕 §修订 #4"Nova 同步契约"和 V0.4 §5.3 阻塞项 #1。

### 5.3 实时事件订阅（可选 / 二期）

进阶能力：组织变更秒级推送，免去全量轮询。形式可以是：

- Webhook（Catio → SupplyCore POST `/api/supplycores/nova-sync/webhook`）+ HMAC 签名
- 或 SignalR Hub / SSE 长连接
- 或 RabbitMQ / Kafka topic

不强制 Stage B1 落地；不在则降级为每 6 小时全量 + idempotent 对账。

## 六、切换 checklist

按以下步骤切换（预计 1.5-2 PD，落到 Stage B1 范围）：

1. **新增 `HttpNovaSourceReader` 实现**（`Nova.SupplyCores.HttpApi` 层或新建 `Nova.SupplyCores.Integration.Http`）
   - 注入 `IHttpClientFactory` + OAuth token 获取
   - 实现 `INovaSourceReader.ReadOrganizationsAsync` 流式 + 分页 + 错误重试
   - 同等返回 `NovaOrgRow`，业务下游零改

2. **DI 切换**
   - 在 `NovaSupplyCoresEntityFrameworkCoreModule.ConfigureServices` 加：
     ```csharp
     if (env.IsProduction())
         context.Services.AddTransient<INovaSourceReader, HttpNovaSourceReader>();
     else
         context.Services.AddTransient<INovaSourceReader, NpgsqlNovaSourceReader>();
     ```
   - 或更优：按 `NovaSyncOptions.Mode = "Http" | "Npgsql"` 配置切换

3. **secrets 配置改用 OAuth**
   - 删 `appsettings.secrets.json` 的 `NovaSync:ConnectionString`
   - 改为 `NovaSync:ApiBaseUrl` + `NovaSync:ClientId` + `NovaSync:ClientSecret`

4. **端到端测试覆盖**
   - 集成测试`NpgsqlNovaSourceReader_IntegrationTests` 加平行的 `HttpNovaSourceReader_IntegrationTests`（指向 Catio test/staging API）
   - 同等覆盖 995 行 + level 分布 + 阜矿本部首行 + sub_group_id 全部指向阜矿

5. **DbMigrator + Web 两边重 deploy 验证**
   - drop + DbMigrator 验证 995 行从 API 拉取成功
   - swagger 验证 `/api/supply-cores/organizations/tree` 返回阜矿组织树

6. **下线 `NpgsqlNovaSourceReader`**
   - 保留代码（标 `[Obsolete("Sprint 1 开发期实现；生产期请用 HttpNovaSourceReader")]`）
   - 或彻底删除（若开发机也走 staging API + tunnel）

## 七、对项目其他文档的影响

| 文档 | 影响 |
|------|------|
| `Sprint-1-任务卡 V0.7+` | §五 可复用资产里标 `INovaSourceReader` 是切换扩展点；§三 衔接里加"Stage B1 切换 HttpReader"作为后续 Sprint 范围 |
| `10A-给Catio团队的字段缺口提问清单-V1.1` | §九 Bis 新增缺口 #6：NovaSync API 契约；§12.6 补充开发期直连 / 联调期契约 / UAT 前切换的过渡策略 |
| `02-基础档案与组织仓库详细设计-V1.2`（未来）| §4.1 业务规则"Nova 同步规则"补 API 端点 + OAuth scope 描述 |
| `开发进度规划-V0.5` | §5.3 阻塞项 #1 OAuth 凭据预申请的"目标阶段 A 末到位"延伸到"NovaSync HttpReader 切换" |

## 八、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-12 | 首版：从开发期 NpgsqlNovaSourceReader（直连 fxkyjt.cn:5432）切换到生产期 HttpNovaSourceReader 的方案；含 6 条 WebAPI 必要性论证 + 当前 D1 实现边界 + 3 件 Catio 团队需提供物 + 6 步切换 checklist。 |
| V0.2 | 2026-05-13 | 用户确认阶段性协同口径：Catio 可在需求明确后滞后提供正式 API 契约，SupplyCore Stage A 允许只读直连 / mock / 源码复用以避免阻塞；Stage B 由 Catio 提供组织 / 人员 API、OAuth scope、测试环境和字段清单；UAT / 生产前必须切换到 WebAPI / OAuth，不得长期依赖 DB 直连。新增 §二 三阶段策略、可直连范围、不可直连范围和滞后交付边界。 |
