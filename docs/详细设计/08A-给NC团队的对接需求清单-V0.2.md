# 给 NC 团队的对接需求清单 V0.1

**文档目的：** SupplyCores（阜矿物资管理系统，辽宁能源集团）需要与用友 NC（集团财务总账系统）做凭证、主数据、对账三类双向接口对接。本清单按详设 [`08-财务与NC接口详细设计-V1.1.md`](08-财务与NC接口详细设计-V1.1.md) §五 29 项接口梳理出 **NC 团队必须对外暴露 / 必须配合提供的内容**，作为发函给 NC 集成厂商（或 NC 项目组）的统一收集口。回函后联动详设 08 升 V1.2 + F-14 `interface_definition` 预置数据落库。

**回复 SLA 期望：** T+10 工作日。NC 项目尚在不同就绪阶段（详设 08 §4.3 三段式），允许分阶段回函；最迟首笔正式凭证上线前 30 天前完成对照（即详设 08 §4.3 "NC 正式启用"前 30 天）。

**优先级口径：** P0 = 联调启动前必需（包括首批 MD-001 / MD-003 + BIZ-001 / BIZ-005A 凭证）；P1 = UAT 前必需；P2 = 正式上线前必需；P3 = 上线后可补。本清单按章节标记。

---

## 一、对接背景速览

| 项 | 说明 |
|----|------|
| 物资侧系统 | 阜矿物资管理系统（SupplyCores），基于 ABP + .NET 10，单库 PostgreSQL，多 schema |
| NC 侧系统 | 辽宁能源集团 NC 财务总账（用友 NC，账套与组织以集团本部为准） |
| 对接范围 | 详设 08 §五 共 29 项接口：5 MD + 20 BIZ + 5 CHK + 4 期间/反结 |
| 对接方向 | 物资 → NC（主导方向）+ NC → 物资（成本中心、核算组织、回执）+ 双向（计量单位、对账） |
| 接口表 | 物资侧落 F-01~F-14 共 14 张表（详设 08 §六）；NC 侧由 NC 团队按现有 NC 接口平台落 |
| 三段式策略 | 详设 08 §4.3：NC 未落地 / 账套就绪未启用 / 正式启用，开关 + 人工台账并行 |

---

## 二、NC 项目当前阶段判定（P0）

请 NC 团队回函时先勾选当前处于哪一阶段（决定我方进度排期）：

- [ ] **阶段 1 — NC 完全未落地**：账套未建、组织未配、科目未维护。物资侧按详设 08 §4.3 走人工台账。
- [ ] **阶段 2 — NC 账套就绪但未正式启用**：账套/组织/科目已建，处于内部测试。允许联调测试环境。
- [ ] **阶段 3 — NC 正式启用**：生产账套已切换，凭证已对外承接。

并补充：

| 项 | 内容 |
|---|------|
| 当前 NC 版本 | NC 6.x / 7.x / NCC / Cloud？精确版本号 ___ |
| 当前账套就绪情况 | 阜矿对应账套编码 ___，启用日期 ___ |
| 当前组织/科目就绪情况 | 核算组织树是否已含阜矿试点厂矿；科目表是否已配 20 项 BIZ 对应借贷科目 |
| 接口平台 | NC 自带 OpenAPI / 第三方 ESB（如金蝶云星空 ESB、东方通）/ 自研适配器 |
| 期望联调时点 | ____ 年 ____ 月起 |

---

## 三、NC 必须提供的接口清单（核心，P0~P2）

### 3.1 凭证类（BIZ-001 ~ BIZ-020，方向：物资 → NC，共 20 个 endpoint）

每个 BIZ 接口对应一类业务凭证（详设 08 §5.2 完整定义）。**NC 团队必须对每个接口给出下表 8 列内容**（按附录 A 模板回函）：

| # | 接口编码 | 业务场景 | 期望路径风格 | 同/异步 | 红冲处理方式 | 期望联调时点 | 优先级 |
|---|---------|---------|------------|--------|------------|------------|--------|
| 1 | BIZ-001 | 采购入库（正式） | `POST /nc/voucher/purchase-receipt` | 待 NC 选 | 同 endpoint 加 `reverse_flag` 或独立 endpoint | 联调起步 | P0 |
| 2 | BIZ-002 | 采购入库（暂估） | `POST /nc/voucher/purchase-accrual` | 待 NC 选 | 同上 | UAT 前 | P1 |
| 3 | BIZ-003 | 暂估红字冲销 | `POST /nc/voucher/purchase-accrual-reverse` | 待 NC 选 | — | UAT 前 | P1 |
| 4 | BIZ-004 | 采购退货 | `POST /nc/voucher/purchase-return` | 待 NC 选 | — | UAT 前 | P1 |
| 5 | BIZ-005 | 领料出库（物资自用） | `POST /nc/voucher/issue-internal` | 待 NC 选 | 同 endpoint 加 `reverse_flag` | 联调起步 | **P0** |
| 6 | BIZ-005A | 对厂矿销售出库 | `POST /nc/voucher/issue-sale` | 待 NC 选 | 同上 | 联调起步 | **P0**（含视同销售税法处理）|
| 7 | BIZ-006 | 退料入库 | `POST /nc/voucher/return-to-stock` | 待 NC 选 | — | UAT 前 | P1 |
| 8 | BIZ-007 | 跨组织调拨 | `POST /nc/voucher/transfer-inter-org` | 待 NC 选 | — | UAT 前 | P1 |
| 9 | BIZ-008 | 盘盈处理 | `POST /nc/voucher/inventory-gain` | 待 NC 选 | — | UAT 前 | P2 |
| 10 | BIZ-009 | 盘亏处理 | `POST /nc/voucher/inventory-loss` | 待 NC 选 | — | UAT 前 | P2 |
| 11 | BIZ-010 | 废旧变卖出库 | `POST /nc/voucher/scrap-issue` | 待 NC 选 | — | 上线前 | P2 |
| 12 | BIZ-011 | 废旧变卖收入 | `POST /nc/voucher/scrap-income` | 待 NC 选 | — | 上线前 | P2 |
| 13 | BIZ-012 | 危险品销毁 | `POST /nc/voucher/hazardous-disposal` | **实时** | — | 上线前 | P2 |
| 14 | BIZ-013 | 火工品出入库 | `POST /nc/voucher/explosive` | **实时** + 独立凭证序号 | 同 endpoint 加 `reverse_flag` | 联调起步 | **P0** |
| 15 | BIZ-014 | 预付款登记 | `POST /nc/voucher/prepayment` | 待 NC 选 | — | UAT 前 | P1 |
| 16 | BIZ-015 | 预付款核销 | `POST /nc/voucher/prepayment-settle` | 待 NC 选 | — | UAT 前 | P1 |
| 17 | BIZ-016 | 让步接收入库 | `POST /nc/voucher/concession-receipt` | 待 NC 选 | — | UAT 前 | P2 |
| 18 | BIZ-017 | 安全专项领用 | `POST /nc/voucher/safety-issue` | 待 NC 选 | — | UAT 前 | P1 |
| 19 | BIZ-018 | 低值易耗摊销 | `POST /nc/voucher/lvc-amortize` | **批量** | — | UAT 前 | P2 |
| 20 | BIZ-019 | 委托加工 | `POST /nc/voucher/outsource-process` | 待 NC 选 | — | 上线前 | P3（来源单据尚未落地） |
| 21 | BIZ-020 | 付款执行 | `POST /nc/voucher/payment-execute` | 待 NC 选 | — | UAT 前 | P1 |

**每个凭证接口必须回函的字段：**

- **请求 schema**：业务字段清单 + 凭证模板编码 + 组织编码 + 期间编码 + 行级明细结构 + 必填/选填标识
- **响应 schema**：**必含** `nc_voucher_no`（凭证号） + `accounted_time`（记账时间） + `finance_state`（已记账/已接收/已退回）；如异步则响应仅返 `task_id`，回执单独定义（见 §3.3）
- **HTTP 方法 + 路径**：实际生产/UAT 路径
- **错误码表**：业务校验错误（如科目不存在）+ 系统错误（NC 不可用）+ 期间错误（已封账）三类
- **幂等行为**：NC 端是否能按物资侧 `idempotent_key`（详设 08 §7.2）去重；不能则约定其他去重字段
- **限流**：单接口 QPS / 单次请求体积 / 并发上限

> **特别说明（BIZ-005 / BIZ-005A）：** 详设 08 §5.2 已明确：对厂矿（集团内部用户单位）出库按外部销售实质开票（视同销售），凭证模板与自用出库不同。NC 端**必须支持两套凭证模板分别开票**，不能合并为同一 endpoint 后端按字段判分。

### 3.2 主数据类（MD-001 ~ MD-005，共 5 个，P0~P1）

| 接口编码 | 方向 | NC 必须实现 | 期望路径 | 优先级 |
|---------|------|----------|---------|--------|
| MD-001 | 物资 → NC | **接收端**：物料/存货档案推送 + 启停状态 | `POST /nc/masterdata/material` | **P0** |
| MD-002 | 物资 → NC | **接收端**：物料停用通知 + NC 端阻塞规则（如有未完结业务单据时 NC 端返回阻塞错误码） | `POST /nc/masterdata/material/disable` | P1 |
| MD-003 | 双向 | **读 + 写**：计量单位字典；明确以谁为源 | `GET/POST /nc/masterdata/unit` | **P0** |
| MD-004 | NC → 物资 | **NC 提供查询 endpoint**：成本中心全量 + 增量（`?since=yyyy-MM-ddTHH:mm:ss`）；支持订阅推送更佳 | `GET /nc/masterdata/cost-center` | P1 |
| MD-005 | NC → 物资 | **NC 提供查询 endpoint**：核算组织树 + 与集团二级组织（阜矿子树）映射 | `GET /nc/masterdata/accounting-org` | **P0** |

**MD 类必须回函的字段：**
- 各档案的 NC 主键字段（`material_id` / `cost_center_id` / `accounting_org_id`）+ 编码字段 + 名称字段 + 状态字段
- 增量拉取的 `since` 时间戳精度（秒/毫秒）+ 时区约定
- NC 主数据的码表（如物料类别、计量单位类型等）

### 3.3 回执 / 对账类（F-03 回执 + CHK-001 ~ CHK-004，共 5 个，P0~P2）

NC 必须实现以下接口的**任一种**（NC 端能力决定选择）：

| 接口 | 选项 A（推荐） | 选项 B（兜底） |
|------|-------------|-------------|
| F-03 凭证回执 | NC 主动回调物资侧 webhook：`POST {supplycore-base}/nc-callback/voucher-receipt` | NC 提供查询接口让物资轮询：`GET /nc/voucher/{task_id}/receipt` |
| CHK-001 日对账 | NC 主动推送日汇总到物资 webhook | NC 提供查询：`GET /nc/reconcile/daily?date=yyyy-MM-dd&org=___` |
| CHK-002 周库存余额 | — | NC 提供查询：`GET /nc/reconcile/inventory-balance?week=yyyy-Wnn` |
| CHK-003 月末全量对账 | — | NC 提供查询：`GET /nc/reconcile/month?period=yyyy-MM&org=___` |
| CHK-004 状态查询 | — | NC 提供查询：`GET /nc/voucher/query?task_id=___` 或 `?nc_voucher_no=___` 或 `?source_bill_no=___` |

**回函必须明确：**
- F-03 回执选 A 还是 B；选 A 时物资侧暴露的 webhook 路径会另发；选 B 时物资侧的轮询频率（建议 30 秒一次）
- 对账接口的返回字段：笔数、金额、凭证号清单、状态分布
- CHK-005 映射完整性属于物资内部接口，**不需要 NC 实现**

### 3.4 期间 / 反结（F-10 + F-11，共 2 个，P1）

| 接口 | NC 必须实现 | 期望路径 | 优先级 |
|------|----------|---------|--------|
| F-10 月结状态查询 | NC 当前期间状态（未结/已结/已反结）+ 上次结账时间 | `GET /nc/period/{yyyy-MM}/status` | P1 |
| F-11 反结申请 | 是否支持接口提交反结 / 还是仅 NC 系统内人工操作 | `POST /nc/period/{yyyy-MM}/reverse` | P2 |

**回函必须明确：** NC 端结账锁定多严？已结账期间能否补推？反结后允许补推的窗口期？

---

## 四、接入与鉴权要求（P0）

### 4.1 endpoint 与环境

| 项 | 必须回函 |
|---|---------|
| 生产环境 baseURL | `https://___.___:___/___` |
| UAT 环境 baseURL | `https://___.___:___/___` |
| 网络通道 | 专线 / VPN / 公网 + IP 白名单（要求白名单 IP 列表） |
| 物资侧出网 IP 段 | 由物资方提供（部署阶段补） |

### 4.2 鉴权方式

请勾选 NC 支持的鉴权方式：

- [ ] OAuth2 Client Credentials（推荐）
- [ ] API Key + 共享密钥签名（HMAC-SHA256）
- [ ] 双向 TLS（mTLS）证书
- [ ] 用户名/密码（不推荐）
- [ ] 其他：___

**回函必须明确：**
- 凭据获取流程（如何申请 client_id / client_secret 或证书）
- 凭据轮换 SLA（多久换一次、过期前多少天通知）
- Token 有效期 + 刷新机制
- 签名算法的完整字段拼接顺序 + 加签 sample

### 4.3 通信约束

| 项 | 期望值 | NC 实际 |
|---|--------|---------|
| 单次请求超时 | 30 秒 | ___ |
| 自动重试次数 | 物资侧默认 3 次（详设 08 §十一 `NC_AUTO_RETRY_MAX_COUNT`） | ___ |
| 退避策略 | 指数退避，初始 30 秒（详设 08 §十一 `NC_AUTO_RETRY_INITIAL_SECONDS`） | ___ |
| QPS / 并发上限 | — | NC 必须告知 |
| 单次报文体积上限 | — | NC 必须告知（影响批量接口分批策略） |

---

## 五、报文契约要求（P0）

### 5.1 数据格式

请勾选 NC 接收的数据格式：

- [ ] JSON（推荐 application/json; charset=utf-8）
- [ ] XML
- [ ] SOAP（不推荐）

### 5.2 编码与时区

| 项 | 期望 | NC 实际 |
|---|------|---------|
| 字符编码 | UTF-8 | ___ |
| 时区 | 时间戳一律 UTC + ISO 8601；显示侧由各系统转 +08:00 | ___ |
| 金额精度 | decimal(20,4) | ___ |
| 期间编码 | `YYYY-MM` | NC 是否同？___ |

### 5.3 必返字段（重申）

每个凭证响应**必须**含：
- `nc_voucher_no` — NC 凭证号（用于物资侧 F-01 `nc_voucher_no` 回写）
- `accounted_time` — 记账时间（UTC ISO 8601）
- `finance_state` — 状态码，至少含「已接收 / 已记账 / 已退回」三态
- `request_id` — 回响物资侧传入的 `request_id`（用于物资 F-02 关联）

---

## 六、错误码与异常处理（P0）

### 6.1 错误码分层

NC 必须按以下三类返回错误码（详设 08 §F-08 `exception_record` 分类对齐）：

| 类型 | 含义 | 物资侧处理 | NC 必须给出码表 |
|------|------|----------|--------------|
| 业务校验失败 | 科目不存在、组织未启用、期间已封账等 | 写 F-08 异常台账，不自动重推；待人工处理 | ___ |
| 系统暂时不可用 | NC 实例宕机、网关超时、限流 | 物资按 §4.3 退避自动重推 | ___ |
| 数据冲突 | 幂等键已存在但报文不同 | 阻断（详设 08 §十一 `NC_IDEMPOTENT_CONFLICT_BLOCK=true`） | ___ |

### 6.2 退回 / 冲销

| 场景 | NC 端流程 | 物资侧需要的信息 |
|------|---------|---------------|
| NC 端凭证退回 | NC 通过 F-03 回执通知 `finance_state=已退回` | 退回原因（自由文本 + 错误码）+ 期望物资侧动作（红冲 / 修正 / 关闭） |
| NC 端冲销凭证 | NC 自行冲销后，物资侧如何感知？ | 是否通过 F-03 推送冲销事件？还是只能物资侧拉 CHK-001/CHK-004？ |

### 6.3 重复推送

- 物资侧因网络抖动可能对同一业务单据推送多次。NC 端**必须**按 `idempotent_key`（详设 08 §7.2 规则）去重，重复推送返回首次的凭证号 + 标记 `idempotent=true`。

---

## 七、运维与变更（P1）

| 项 | 必须回函 |
|---|---------|
| 接口升级公告窗口 | NC 端接口变更/废弃前提前多少天通知物资侧？（建议 ≥ 30 天） |
| 测试环境 SLA | UAT 环境的可用时间窗口、维护窗口、可用率承诺 |
| 联调对接人 | 接口开发负责人姓名 + 联系方式 + 应急电话 |
| 监控告警渠道 | NC 端告警如何通知物资侧？（邮件 / 短信 / 钉钉 / 企业微信） |
| 日志保留期 | NC 端接口日志保留多久？（影响物资侧排障可追溯期） |

---

## 八、联调与上线时点（P0）

按详设 08 §4.3 三段式策略，物资侧期望排期：

| 阶段 | 物资侧动作 | NC 团队配合 | 时点（待 NC 阶段判定后确认） |
|------|----------|-----------|------------------------|
| 联调起步 | F-13 接口级开关启用 MD-001/MD-003/MD-005 + BIZ-001/005/005A/013 | 提供 UAT 环境 + P0 接口（§3 标 P0 的 7 个）+ 鉴权凭据 | T+0 |
| UAT | F-13 接口级开关启用 P1 接口 + CHK-001 日对账 | 提供 §3 标 P1 的 ~10 个接口 + 完整科目表 + 成本中心 | T+30 天 |
| 上线前 | F-13 全局开关从关→开（详设 08 §十一 `NC_INTERFACE_GLOBAL_SWITCH`） | 提供 §3 标 P2 的剩余接口 + 反结接口（F-11） | T+60 天 |
| 上线后 | 切正式凭证；F-08 异常台账接管 | 接口 7×24 可用承诺 + 应急响应 SLA | T+90 天 |

---

## 九、回复格式建议

请按以下方式回函，便于物资侧批量录入 F-14 `interface_definition` 表：

1. **§二阶段判定** — 直接勾选 + 补字段
2. **§三 1~21 凭证接口** — 按附录 A 模板每接口一份回函（可合并为 Excel）
3. **§三主数据 / 回执 / 期间** — 按表格补 NC 实际 endpoint + schema
4. **§四鉴权 + §五契约 + §六错误码** — 按各小节回函
5. **§七运维 + §八时点** — 按表格回函

附 Postman collection 或 Swagger/OpenAPI 文档更佳。

---

## 十、签字栏

| 项 | 内容 |
|----|------|
| 回复人（NC 项目组） | ________ |
| 回复日期 | ________ |
| NC 系统版本 | ________ |
| 接口平台 | ________ |
| 联调负责人 + 联系方式 | ________ |
| 备注 | ________ |

物资侧联系人：阜矿物资公司信息部 ___（待补）

---

## 附录 A：单接口回函模板

```
接口编码：BIZ-001 / MD-001 / CHK-001 ...
接口名称：________
NC 端实现路径：POST /nc/___
同步 / 异步：________（异步则附 F-03 回调 URL 或轮询 URL）
鉴权头：________

请求 schema：
{
  "request_id": "string, 物资侧生成",
  "idempotent_key": "string, 详设 08 §7.2 规则",
  "org_code": "string, 组织编码",
  "period_code": "YYYY-MM",
  "business_date": "YYYY-MM-DD",
  "lines": [
    { "material_code": "...", "qty": "...", "amount": "..." }
  ],
  "voucher_template": "string, NC 凭证模板编码",
  "reverse_flag": "bool, 是否红冲"
}

响应 schema（同步成功）：
{
  "request_id": "string, 回响物资侧",
  "nc_voucher_no": "string",
  "accounted_time": "2026-05-12T03:24:11Z",
  "finance_state": "已接收 | 已记账",
  "idempotent": false
}

响应 schema（同步失败）：
{
  "request_id": "string",
  "error_type": "业务校验失败 | 系统暂时不可用 | 数据冲突",
  "error_code": "NC-VRC-2001",
  "error_message": "科目 6602 在期间 2026-05 已停用"
}

错误码表（本接口）：
| 错误码 | 含义 | 类型 |
|--------|------|------|
| ___ | ___ | ___ |

幂等行为：________（NC 是否按 idempotent_key 去重；不能则约定其他键）
QPS 上限：________
单次报文上限：________
联调可用日：________
```

---

## 附录 B：相关文档对照

| 名称 | 路径 | 说明 |
|------|------|------|
| 详设 08 财务与 NC 接口 | `docs/详细设计/08-财务与NC接口详细设计-V1.1.md` | 29 项接口完整定义 + F-01~F-14 数据模型 + 校验/对账/反结流程 |
| 物资侧 NC 服务契约 | `modules/nova.supplycores/src/Nova.SupplyCores.Application.Contracts/NcInterfaces/INcInterfaceService.cs` | `INcInterfaceService` 一期对接抽象层 |
| 物资侧 Mock 实现 | `modules/nova.supplycores/src/Nova.SupplyCores.Application/NcInterfaces/MockNcInterfaceService.cs` | NC 未落地阶段的本地 stub，NC 接口就绪后切换实现 |
| 概设 01 部署边界 | `docs/概要设计/01-总体架构与集成边界-v0.1.md` | 物资系统独立部署、与 NC 通信走 webapi 而非 DB 直连 |
| 10A 给 Catio 清单 | `docs/详细设计/10A-给Catio团队的字段缺口提问清单-V1.1.md` | 平行参考：另一个外部协作方的字段缺口清单格式 |

---

## 版本沿革

| 版本 | 日期 | 变更 |
|------|------|------|
| V0.1 | 2026-05-12 | 首版：按详设 08 V1.1 §5 29 项接口梳理出 NC 必须提供的 endpoint + 字段 + 阶段判定 + 8 列回函模板 + 附录 A 单接口回函模板。待 NC 团队回函后联动详设 08 升 V1.2 + F-14 数据预置。 |
