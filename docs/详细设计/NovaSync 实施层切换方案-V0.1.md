# NovaSync 实施层切换方案 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（首版，待用户确认）
**日期：** 2026-05-12
**文档性质：** 详细设计层 · 集成实施方案
**适用范围：** Catio Nova 组织 + 人员同步的实施层（开发期直连 → 生产期 WebAPI）
**衔接文档：**

- [`Sprint-1-任务卡（V0.3+）`](../Sprint/Sprint-1-任务卡-V0.6.md) §1.1 D1-2 NovaSync 范围
- [`02-基础档案与组织仓库详细设计-V1.1.md`](./02-基础档案与组织仓库详细设计-V1.1.md) §4.1 M-01 organization
- [`评审留痕/数据隔离边界sub_group_id修订建议清单-V0.1.md`](./评审留痕/数据隔离边界sub_group_id修订建议清单-V0.1.md) §修订 #4 Nova 同步契约
- [`10A-给Catio团队的字段缺口提问清单`](./10A-给Catio团队的字段缺口提问清单-V1.1.md) §九 Bis NovaSync API 契约（V1.1+ 增加）

---

## 一、背景

Sprint 1 D1-D2 让 SupplyCore 落地"从 Catio 同步阜矿组织树到本地 M-01 表"的第一版实现。**开发期**为了快速跑通，走的是**直连 Catio 生产 Nova DB**（`Host=fxkyjt.cn;Port=5432;Database=Nova` 只读访问 `platform.organizations`）。**生产期**这条路必须改走 Catio 提供的 **WebAPI**，理由见 §二。

本文档不重新定义同步语义（语义见 sub_group_id 评审留痕清单 §修订 #4 + 详设 02 V1.1 §4.1）；只规定**实施层从开发期到生产期的切换路径**。

## 二、生产期不能继续直连 DB 的 6 条理由

| 维度 | 直连 DB（开发期） | WebAPI（生产期） |
|------|------------------|------------------|
| 凭据管理 | 5432 凭据明文落地到每个消费方 secrets，泄露后须改密影响所有消费方 | OAuth token，过期自动失效 + 单方吊销 |
| Schema 演进 | Catio 改 `platform.organizations` 列名 / 索引直接挂消费方 | API 契约稳定，Catio 内部 schema 演进对消费方透明 |
| 网络边界 | 5432 端口跨网段暴露（防火墙 / VPN 接入痛点）| HTTPS 443，集团统一接入标准 |
| 权限粒度 | DB user 只能做表 / schema 维度授权（粗）| API 维度（细，能按 user.sub_group_id 自动过滤数据范围 = sub_group_id 评审留痕清单 §三 原则 2 直接落地）|
| 实时事件 | 只能轮询（T+1 全量校验 + 每小时增量？性能 / 延迟两难）| Webhook / SSE / SignalR 推送，组织变更秒级到 SupplyCore |
| 审计 | DB query log（重，含全部 SQL 文本，不带 caller 业务身份）| API log（轻，含 caller user_id + sub_group_id + 操作类型）|

## 三、当前 D1 直连实现的边界

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

## 四、生产期 HttpNovaSourceReader 切换条件

按 sub_group_id 评审留痕清单 §修订 #4，Catio 团队需要提供以下 **3 件事**，切换才能闭环：

### 4.1 组织树查询 API endpoint

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

### 4.2 OAuth 凭据 + scope

API 凭据由 Stage B1 申请：

- `client_id` / `client_secret` 颁发给 SupplyCore.Web 应用
- scope 至少包含 `platform.organizations.read`
- 凭据由 `Nova.Platform.OpenIddict` 颁发，token 过期可吊销

OAuth 凭据流程绑定到 sub_group_id 评审留痕 §修订 #4"Nova 同步契约"和 V0.4 §5.3 阻塞项 #1。

### 4.3 实时事件订阅（可选 / 二期）

进阶能力：组织变更秒级推送，免去全量轮询。形式可以是：

- Webhook（Catio → SupplyCore POST `/api/supplycores/nova-sync/webhook`）+ HMAC 签名
- 或 SignalR Hub / SSE 长连接
- 或 RabbitMQ / Kafka topic

不强制 Stage B1 落地；不在则降级为每 6 小时全量 + idempotent 对账。

## 五、切换 checklist

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

## 六、对项目其他文档的影响

| 文档 | 影响 |
|------|------|
| `Sprint-1-任务卡 V0.4+` | §五 可复用资产里标 `INovaSourceReader` 是切换扩展点；§三 衔接里加"Stage B1 切换 HttpReader"作为后续 Sprint 范围 |
| `10A-给Catio团队的字段缺口提问清单-V1.1` | §九 Bis 新增缺口 #6：NovaSync API 契约（组织树 endpoint / 字段 / 分页 / 增量 / 实时事件 5 项 Q） |
| `02-基础档案与组织仓库详细设计-V1.2`（未来）| §4.1 业务规则"Nova 同步规则"补 API 端点 + OAuth scope 描述 |
| `开发进度规划-V0.4` | §5.3 阻塞项 #1 OAuth 凭据预申请的"目标阶段 A 末到位"延伸到"NovaSync HttpReader 切换" |

## 七、版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-12 | 首版：从开发期 NpgsqlNovaSourceReader（直连 fxkyjt.cn:5432）切换到生产期 HttpNovaSourceReader 的方案；含 6 条 WebAPI 必要性论证 + 当前 D1 实现边界 + 3 件 Catio 团队需提供物 + 6 步切换 checklist。 |
