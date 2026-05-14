# Sprint 18b NC 接口 JSON Schema 占位稿 V0.1

**项目：** 阜矿集团物资公司供应链一体化平台 — NC 财务接口  
**版本：** V0.1（草案 · NC 端待反馈调整）  
**日期：** 2026-05-14  
**作者：** cici（主代理 a）  
**用途：** Sprint 18b A2-1' 单边占位稿；18a A1 评估清单 NC 端暂未反馈，单边先出 23 接口请求/响应 schema，待 NC 端反馈后逐项调整  
**配套：** 详设 08 V1.1 §5/§6、Sprint 17a NcInterfaceHttpClient/Contributors 实现

---

## 一、统一规约

### 1.1 请求统一头（HTTP 层 · 详设 08 §4 + Sprint 17a 实现）

| 项 | 取值/规则 | 备注 |
|---|---|---|
| Method | `POST`（业务接口）/ `GET`（CHK-004 状态查询） | 详设 08 §4.2 |
| URL | `{BaseUrl}/{InterfaceCode}` | `BaseUrl` 由 NC 端联调时给定；`InterfaceCode` 取 MD-001/BIZ-001/CHK-001 等 |
| Authorization | `Bearer {access_token}` | OAuth2 client_credentials；Sprint 17a D1 已实装 NcOAuth2TokenService（401 自动 refresh+retry 一次） |
| Content-Type | `application/json; charset=utf-8` | POST 时 |
| X-Idempotency-Key | `{InterfaceCode}:{BusinessEntity}:{BusinessId}` | 物资侧 Contributor 生成；NC 端必须按此键去重，重推返回 `code="1001"`（占位） |
| 字符集 | UTF-8 | — |
| 超时 | 单次 30s（详设 11 §10.3）+ Polly 三层重试（外 timeout / 中 retry 5xx / 内 circuit-breaker 5 次开路 60s） | Sprint 15a/16a 已实装 |

> [⚠️ NC 端待确认 G-1]：BaseUrl 实际路径前缀（NC 是否要求 `/api/v1/` 等）  
> [⚠️ NC 端待确认 G-2]：是否需要除 Authorization/X-Idempotency-Key 之外的其他必填头（如 X-Trace-Id / X-Tenant-Id / 签名）  
> [⚠️ NC 端待确认 G-3]：超时 30s 是否够用（长批量接口 BIZ-002/BIZ-018 是否需要更长超时窗口）

### 1.2 响应统一结构（基于 Sprint 17a `ParseInvokeResponseAsync` + Codex 15a P1）

```json
{
  "code": "0000",
  "message": "OK",
  "voucherNo": "FK20260514-001",
  "data": {  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `code` | string | 必填 | NC 业务码；严格 `"0000"` 才算业务成功（HTTP 200 不等于业务成功） |
| `message` | string | 可空 | 业务消息；失败时给人类可读原因 |
| `voucherNo` | string | 成功时必填 | NC 凭证号；F-03 receipt 回写来源；主数据接口（MD-001/004）可空 |
| `data` | object | 可空 | 业务返回（如 MD-001 返回 `ncInventoryId`、MD-004 返回成本中心列表） |

> 字段类型不规范容错：Sprint 18b A2-5 已加 ValueKind 守卫，NC 端若返 `code=0`（int）而非 `"0000"`（string），客户端会归一化为 `"0"` 视为业务拒收。强烈建议 NC 端固定 `code` 为 string。  
> [⚠️ NC 端待确认 G-4]：响应结构中 `code/message/voucherNo` 字段名是否一致；data 字段是否使用此名

### 1.3 业务码字典（占位 — 基于 Sprint 17a NcResponse 行为推断）

| code | 含义 | 物资侧处置 | 来源 |
|---|---|---|---|
| `"0000"` | 业务成功 | F-03 receipt + 业务回写（NC 凭证号 / 状态） | Sprint 15a Codex P1 |
| `"1001"` | 重复推送（idempotency 命中） | 视为成功；复用历史 voucherNo；F-03 仍留痕 | [⚠️ NC 端待确认 G-5] |
| `"2001"` | 凭证已冲销 / 已反向 | 视为业务终态（不重试） | [⚠️ NC 端待确认 G-6] |
| `"5001"` | 业务拒收（字段校验失败 / 业务规则违反） | F-04 错误日志 + 业务方介入；不 retry | [⚠️ NC 端待确认 G-7] |
| `"5002"` | 主数据未对照（物料/成本中心 NC 端缺映射） | 物资侧触发 MD-001 重推 + 待重跑 | [⚠️ NC 端待确认 G-8] |
| `"5xxx"` | NC 内部错误（DB / 服务挂） | Polly retry（最多 3 次 exponential backoff）+ F-08 异常台账 | Sprint 15a 弹性策略 |
| `"MISSING_CODE"` | 内部码（NC 响应缺 code 字段） | 视为业务拒收 → F-04 | Sprint 15a Codex P1 |
| `"INVALID_JSON"` | NC 200 但响应非合法 JSON | 视为接口异常 → F-08 | Sprint 17a 实装 |
| `"CIRCUIT_OPEN"` | 物资侧熔断器开路 | 60s 后半开自动恢复 | Sprint 15a Polly |
| `"TIMEOUT"` | 物资侧超时 | retry 用尽 → F-08 | Sprint 15a Polly |
| `"HTTP_ERROR"` | 网络异常 | retry 用尽 → F-08 | Sprint 15a Polly |

> [⚠️ NC 端待确认 G-9]：完整业务码字典（NC 端实际返哪些 5xxx / 8xxx 码 + 对应语义）  
> [⚠️ NC 端待确认 G-10]：重复推送 idempotency 命中时是否原样返 `code="0000"` + 历史 voucherNo（而非 `"1001"`）

### 1.4 日期/金额/枚举规约

| 项 | 规则 | 示例 |
|---|---|---|
| 日期/时间 | ISO8601 UTC（`yyyy-MM-ddTHH:mm:ssZ`） | `2026-05-14T08:00:00Z` |
| 业务日期 | `yyyy-MM-dd` | `2026-05-14` |
| 月份 | `yyyy-MM` | `2026-04`（暂估、月结） |
| 金额 | decimal(18,2) — JSON number；红字以负数表示 | `123.45` / `-50.00` |
| 数量 | decimal(18,3)（详设 06） | `100.500` |
| 税额 | decimal(18,2) | `13.00` |
| 税率 | decimal(5,4) — 0.13 = 13% | `0.1300` |
| 枚举 | string；详设 06/08 已固定的中文取值（如 `已审`/`已支付`） | `"已审"` |

> [⚠️ NC 端待确认 G-11]：金额是否用 string 传（防 JSON number 精度损失）；NC 端是否能正确处理 decimal(18,2)

---

## 二、MD 主数据接口（2 个）

### 2.1 MD-001 物料-存货映射推送

- **方向**：物资 → NC（push, realtime）
- **触发**：M-14 `material_mapping.enabled_at` 落定 / 状态变更（详设 03 §M-14）
- **业务实体**：`material`
- **幂等键**：`MD-001:material:{materialId}`
- **凭证口径**：N/A（主数据无凭证）

**请求 schema**：
```json
{
  "materialId": 100123,
  "materialCode": "M-FQ-0001234",
  "materialName": "钢丝绳 6×37+IWR 28mm",
  "category": "STEEL_ROPE",
  "specification": "6×37+IWR Φ28mm",
  "unit": "M",
  "unitConversion": null,
  "ncInventoryCode": "INV-NC-001234",
  "orgId": 10001,
  "orgName": "阜矿集团物资公司",
  "enabledAt": "2026-05-14T08:00:00Z",
  "mappingVersion": 3
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `materialId` | long | Y | 物资 M-14 物料 ID |
| `materialCode` | string(64) | Y | 物料编码（M-04 业务编码规则） |
| `materialName` | string(128) | Y | 物料名称 |
| `category` | string(32) | Y | 物料分类（M-08 标准分类码） |
| `specification` | string(128) | N | 规格型号 |
| `unit` | string(16) | Y | 计量单位编码（参 MD-003 字典） |
| `unitConversion` | object | N | 多单位换算（如 `{"baseUnit":"KG","factor":1000}`） |
| `ncInventoryCode` | string(64) | Y | NC 端存货编码（M-14 映射来源） |
| `orgId` | long | Y | 集团组织 ID（与 NC 核算组织通过 MD-005 对照） |
| `orgName` | string(128) | N | 组织名称（便于 NC 端可读） |
| `enabledAt` | ISO8601 | Y | 启用时间 UTC |
| `mappingVersion` | int | N | 映射版本号（M-14 update_count，便于 NC 端识别新旧） |

**响应 schema**：
```json
{
  "code": "0000",
  "message": "OK",
  "voucherNo": null,
  "data": {
    "ncInventoryId": "8a1b2c3d-4e5f-...",
    "syncedAt": "2026-05-14T08:00:05Z"
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `data.ncInventoryId` | string | Y | NC 端存货实体 ID（NC 内部生成） |
| `data.syncedAt` | ISO8601 | N | NC 端落库时间 |

**NC 端待确认**：
- [⚠️ NC 端待确认 MD-001-1]：`unit` 是否走 MD-003 字典预对照（先同步 MD-003 字典 + 物资侧验证后再推 MD-001）vs NC 端任意接受
- [⚠️ NC 端待确认 MD-001-2]：`ncInventoryCode` 是否 NC 端动态生成（NC 接收 MD-001 时生成内部 ID）vs 物资端预先约定（M-14 配置时填 NC 既有编码）
- [⚠️ NC 端待确认 MD-001-3]：`category` / `specification` 是否参与 NC 端校验
- [⚠️ NC 端待确认 MD-001-4]：`unitConversion` 是否必须（NC 端是否支持多单位换算）
- [⚠️ NC 端待确认 MD-001-5]：响应是否回 `data.ncInventoryId` 给物资侧回写 M-14

### 2.2 MD-004 成本中心对照拉取

- **方向**：NC → 物资（pull, scheduled）
- **触发**：Hangfire 每日 04:00 UTC（Sprint 17a `Md004CostCenterMappingContributor`）
- **业务实体**：`nc-pull`
- **幂等键**：`MD-004:nc-pull:{yyyyMMdd}`
- **HTTP**：物资侧调 `GET {BaseUrl}/MD-004/status?idempotencyKey=...`（pull 模式走 QueryStatusAsync）

**请求 schema**（GET query string，无 body）：
```
GET /MD-004/status?idempotencyKey=MD-004:nc-pull:20260514&pullDate=2026-05-14
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `idempotencyKey` | string | Y | 同 HTTP header（重复） |
| `pullDate` | yyyy-MM-dd | Y | 拉取日期（增量 / 全量分流） |
| `lastSyncAt` | ISO8601 | N | 上次同步时间（增量拉取用） |

**响应 schema**：
```json
{
  "code": "0000",
  "message": "OK",
  "voucherNo": null,
  "data": {
    "totalCount": 156,
    "costCenters": [
      {
        "ncCostCenterCode": "CC-FK-001",
        "costCenterName": "采购中心",
        "ncOrgCode": "ORG-NC-100",
        "groupOrgId": 10001,
        "validFrom": "2026-01-01",
        "validTo": null,
        "status": "已启用",
        "parentCode": null,
        "level": 1
      }
    ]
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `data.totalCount` | int | Y | 本次拉取条数 |
| `data.costCenters[].ncCostCenterCode` | string(64) | Y | NC 端成本中心编码 |
| `data.costCenters[].costCenterName` | string(128) | Y | 成本中心名称 |
| `data.costCenters[].ncOrgCode` | string(64) | Y | 所属 NC 核算组织 |
| `data.costCenters[].groupOrgId` | long | Y | 集团组织 ID（与 MD-005 对照） |
| `data.costCenters[].validFrom` | yyyy-MM-dd | Y | 启用日期 |
| `data.costCenters[].validTo` | yyyy-MM-dd | N | 停用日期；NULL 表示长期有效 |
| `data.costCenters[].status` | string | Y | `已启用/已停用` |
| `data.costCenters[].parentCode` | string | N | 上级成本中心（层级树） |
| `data.costCenters[].level` | int | N | 层级深度 |

**NC 端待确认**：
- [⚠️ NC 端待确认 MD-004-1]：是否支持增量拉取（用 `lastSyncAt` 做 watermark）vs 仅支持全量
- [⚠️ NC 端待确认 MD-004-2]：分页机制（NC 成本中心若 >1000 条，是否需要分页参数 `pageNo/pageSize` + 响应 `hasMore`）
- [⚠️ NC 端待确认 MD-004-3]：成本中心是否含层级树（`parentCode/level`）vs 平铺列表
- [⚠️ NC 端待确认 MD-004-4]：m-22 物资侧成本中心表落库时机（每次拉取全量替换 vs 增量 upsert）
- [⚠️ NC 端待确认 MD-004-5]：pullDate 字段是否需要（vs 仅按 idempotencyKey 推断）

---

## 三、BIZ 业务接口（19 个）

### 3.1 BIZ-001 采购入库（正式）

- **方向**：物资 → NC（push, realtime）
- **触发**：S-05 入库审核通过 + 发票匹配完成
- **来源单据**：S-05 `purchase_receipt`
- **业务实体**：`inbound_receipt`
- **幂等键**：`BIZ-001:inbound_receipt:{receiptId}`
- **凭证口径**：借 1403 原材料，贷 2202 应付账款 + 1221 应交税费-进项税

**请求 schema**：
```json
{
  "receiptId": 50001,
  "receiptNo": "PR-2026-05-00001",
  "orgId": 10001,
  "supplierId": 30001,
  "supplierCode": "SUP-001",
  "supplierName": "鞍钢集团",
  "contractId": 60001,
  "contractNo": "CT-2026-001",
  "purchaseOrderId": 70001,
  "purchaseOrderNo": "PO-2026-05-001",
  "businessDate": "2026-05-14",
  "warehouseId": 20001,
  "warehouseCode": "WH-FK-A1",
  "ncCostCenterCode": "CC-FK-001",
  "invoiceNo": "INV-2026-001",
  "invoiceDate": "2026-05-13",
  "totalAmount": 100000.00,
  "totalTaxAmount": 13000.00,
  "currency": "CNY",
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": 100.000,
      "unit": "M",
      "unitPrice": 1000.00,
      "amount": 100000.00,
      "taxRate": 0.1300,
      "taxAmount": 13000.00,
      "batchNo": "B-20260514-001",
      "contractLineId": 60011
    }
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `receiptId` | long | Y | S-05 业务主键 |
| `receiptNo` | string(64) | Y | 入库单号 |
| `orgId` | long | Y | 集团组织 ID（NC 核算组织对照） |
| `supplierId/Code/Name` | long/string | Y | 供应商三件套 |
| `contractId/No` | long/string | Y | 关联合同（C-02） |
| `purchaseOrderId/No` | long/string | N | 关联订单（S-02） |
| `businessDate` | yyyy-MM-dd | Y | 业务日期（影响 NC 凭证期间） |
| `warehouseId/Code` | long/string | Y | 收货仓库（M-09） |
| `ncCostCenterCode` | string(64) | Y | NC 成本中心（参 MD-004 字典） |
| `invoiceNo/Date` | string/date | Y | 发票号 + 开票日 |
| `totalAmount` | decimal(18,2) | Y | 不含税总额 |
| `totalTaxAmount` | decimal(18,2) | Y | 总税额 |
| `currency` | string(8) | N | 币种；默认 `CNY` |
| `lines[]` | array | Y | 入库明细，至少 1 条 |
| `lines[].materialId / ncInventoryCode` | long/string | Y | 物料 + NC 存货编码（参 MD-001） |
| `lines[].quantity / unit / unitPrice / amount` | decimal/string | Y | 数量/单位/单价/金额 |
| `lines[].taxRate / taxAmount` | decimal | Y | 行级税率/税额 |
| `lines[].batchNo` | string(64) | N | 批次号（S-14） |
| `lines[].contractLineId` | long | Y | 合同明细（C-11，NC 回写执行数量） |

**响应 schema**（标准 §1.2）：`voucherNo` 返凭证号；`data` 可选返凭证明细 ID。

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-001-1]：发票号是否参与 NC 端三单匹配（NC 是否自己做匹配 vs 信任物资侧已匹配）
- [⚠️ NC 端待确认 BIZ-001-2]：明细 `lines[]` 数量上限（NC 单据最多挂多少行）
- [⚠️ NC 端待确认 BIZ-001-3]：`batchNo` 是否需要传 NC（NC 凭证是否记批次）
- [⚠️ NC 端待确认 BIZ-001-4]：含税 vs 不含税 — 总额是否要同时传含税金额 `totalAmountWithTax`
- [⚠️ NC 端待确认 BIZ-001-5]：`businessDate` 跨期（如 5 月业务但 6 月推送）NC 凭证期间归属规则

### 3.2 BIZ-002 采购入库（暂估）

- **方向**：物资 → NC（push, batch 月末）
- **触发**：月末暂估批处理（S-07 `purchase_estimate` 关联 S-05 未发票数据）
- **来源单据**：S-07 / S-05
- **业务实体**：`inventory_estimate`
- **幂等键**：`BIZ-002:inventory_estimate:{estimateId}`
- **凭证口径**：借 1403 原材料，贷 2181 应付暂估

**请求 schema**：
```json
{
  "estimateId": 80001,
  "estimateNo": "EST-202604-001",
  "estimateMonth": "2026-04",
  "orgId": 10001,
  "businessDate": "2026-04-30",
  "lines": [
    {
      "lineNo": 1,
      "receiptId": 50001,
      "receiptNo": "PR-2026-04-00099",
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "ncCostCenterCode": "CC-FK-001",
      "quantity": 100.000,
      "estimateAmount": 100000.00,
      "currency": "CNY",
      "warehouseCode": "WH-FK-A1"
    }
  ],
  "totalAmount": 100000.00
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `estimateId/No` | long/string | Y | S-07 暂估批次主键 |
| `estimateMonth` | yyyy-MM | Y | 暂估归属月 |
| `lines[]` | array | Y | 暂估明细（关联未发票的 S-05 入库行） |
| `lines[].estimateAmount` | decimal(18,2) | Y | 暂估金额（合同价 / 历史均价取值） |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-002-1]：暂估批量是否有月末窗口（NC 端是否要求 5 月 1 日 24:00 前推完 4 月暂估）
- [⚠️ NC 端待确认 BIZ-002-2]：单批暂估明细行数上限（vs 拆批）

### 3.3 BIZ-003 暂估红字冲销

- **方向**：物资 → NC（push, batch 次月初）
- **触发**：次月初暂估冲销（与 BIZ-002 配对，发票到达后冲销并走 BIZ-001 正式入账）
- **来源单据**：S-07
- **业务实体**：`inventory_estimate_reversal`
- **幂等键**：`BIZ-003:inventory_estimate_reversal:{estimateId}`
- **凭证口径**：红字冲销原 BIZ-002 暂估

**请求 schema**：
```json
{
  "estimateId": 80001,
  "originalEstimateNo": "EST-202604-001",
  "originalVoucherNo": "AG20260430-001",
  "reversalNo": "EST-REV-202605-001",
  "reversalMonth": "2026-05",
  "businessDate": "2026-05-01",
  "totalAmount": -100000.00,
  "lines": [
    {
      "lineNo": 1,
      "originalLineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "ncCostCenterCode": "CC-FK-001",
      "quantity": -100.000,
      "amount": -100000.00
    }
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `originalVoucherNo` | string | Y | 原 BIZ-002 NC 凭证号（F-03 回写） |
| `totalAmount / lines[].amount` | decimal(18,2) | Y | 负数（红字冲销） |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-003-1]：冲销凭证是否需要 `originalVoucherNo` vs NC 端按 idempotencyKey 反查
- [⚠️ NC 端待确认 BIZ-003-2]：红字是用负数 `-100.00` vs 单独字段 `direction="DEBIT_NEG"`

### 3.4 BIZ-004 采购退货

- **方向**：物资 → NC（push, realtime）
- **触发**：S-06 退货单审核通过
- **来源单据**：S-06 `purchase_return`
- **业务实体**：`purchase_return`
- **幂等键**：`BIZ-004:purchase_return:{returnId}`
- **凭证口径**：红字借 2202 应付账款，贷 1403 原材料 + 1221 进项税转出

**请求 schema**：
```json
{
  "returnId": 90001,
  "returnNo": "RT-2026-05-00001",
  "originalReceiptId": 50001,
  "originalReceiptNo": "PR-2026-05-00001",
  "originalVoucherNo": "FK20260514-001",
  "orgId": 10001,
  "supplierCode": "SUP-001",
  "businessDate": "2026-05-15",
  "warehouseCode": "WH-FK-A1",
  "ncCostCenterCode": "CC-FK-001",
  "totalAmount": -10000.00,
  "totalTaxAmount": -1300.00,
  "lines": [
    {
      "lineNo": 1,
      "originalLineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": -10.000,
      "amount": -10000.00,
      "taxAmount": -1300.00,
      "returnReason": "质量问题"
    }
  ]
}
```

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-004-1]：退货是否必须先冲原入库（NC 端校验原凭证存在）vs 独立凭证
- [⚠️ NC 端待确认 BIZ-004-2]：`returnReason` 是否需要传 NC（NC 凭证摘要字段）

### 3.5 BIZ-005 领料出库（物资公司自用）

- **方向**：物资 → NC（push, realtime）
- **触发**：S-09 出库单审核通过 + `usage_unit_id` ∈ 物资公司自身组织
- **来源单据**：S-09 `material_issuance`
- **业务实体**：`material_issuance`
- **幂等键**：`BIZ-005:material_issuance:{issuanceId}`
- **凭证口径**：借 6602 销售费用，贷 1403 原材料

**请求 schema**：
```json
{
  "issuanceId": 110001,
  "issuanceNo": "MI-2026-05-00001",
  "issuanceType": "生产领用",
  "usageUnitId": 10001,
  "usageUnitName": "物资公司自用部门",
  "orgId": 10001,
  "warehouseCode": "WH-FK-A1",
  "ncCostCenterCode": "CC-FK-002",
  "businessDate": "2026-05-14",
  "totalAmount": 5000.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": 5.000,
      "unitPrice": 1000.00,
      "amount": 5000.00,
      "batchNo": "B-20260514-001",
      "projectCode": "PRJ-2026-001"
    }
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `issuanceType` | string | Y | 详设 06 枚举：`生产领用/办公领用/维修领用/...` |
| `usageUnitId` | long | Y | 使用单位（分流 BIZ-005 vs BIZ-005A 关键字段） |
| `lines[].projectCode` | string | N | 项目编码（NC 项目核算） |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-005-1]：`projectCode` 是否需要走独立主数据（MD-?）vs 字符串直传
- [⚠️ NC 端待确认 BIZ-005-2]：领料单价口径（移动平均 / FIFO / 标准成本，详设 06 §4.x）NC 端是否信任物资侧计算结果

### 3.6 BIZ-005A 对厂矿销售出库

- **方向**：物资 → NC（push, realtime）
- **触发**：S-09 出库单审核通过 + `usage_unit_id` ∈ 厂矿（集团内部用户单位）
- **来源单据**：S-09
- **业务实体**：`sale_outbound`
- **幂等键**：`BIZ-005A:sale_outbound:{issuanceId}`
- **凭证口径**：借 1122 应收账款，贷 6001 主营业务收入 + 2221 应交税费-销项税

**请求 schema**：
```json
{
  "issuanceId": 110002,
  "issuanceNo": "MI-2026-05-00002",
  "customerId": 40001,
  "customerCode": "BUYER-FK-MINE-01",
  "customerName": "阜矿一矿",
  "usageUnitId": 40001,
  "orgId": 10001,
  "businessDate": "2026-05-14",
  "warehouseCode": "WH-FK-A1",
  "ncCostCenterCode": "CC-FK-001",
  "invoiceNo": "OUT-INV-2026-001",
  "invoiceDate": "2026-05-14",
  "totalAmount": 50000.00,
  "totalTaxAmount": 6500.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": 50.000,
      "unitPrice": 1000.00,
      "amount": 50000.00,
      "costAmount": 45000.00,
      "taxRate": 0.1300,
      "taxAmount": 6500.00
    }
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `customerId/Code/Name` | long/string | Y | 客户三件套（厂矿作为内部客户） |
| `lines[].costAmount` | decimal(18,2) | Y | 成本金额（结转销售成本用，NC 自动生成借 6401 贷 1403 凭证） |
| 其余 | 同 BIZ-005 | — | — |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-005A-1]：销售成本结转是 NC 自动一并生成（同凭证）vs 物资侧另调接口
- [⚠️ NC 端待确认 BIZ-005A-2]：客户主数据 NC 端是否独立维护（是否需要 MD-客户 接口）vs 复用 NC 既有客户档案
- [⚠️ NC 端待确认 BIZ-005A-3]：开票动作（销项发票）是 NC 端发起 vs 物资侧发起后传单号

### 3.7 BIZ-006 退料入库

- **方向**：物资 → NC（push, realtime）
- **触发**：S-10 退料单审核通过
- **来源单据**：S-10 `material_return`
- **业务实体**：`material_return`
- **幂等键**：`BIZ-006:material_return:{returnId}`
- **凭证口径**：借 1403 原材料，贷 6602 销售费用（红字冲销原 BIZ-005）

**请求 schema**：
```json
{
  "returnId": 120001,
  "returnNo": "MRT-2026-05-00001",
  "originalIssuanceId": 110001,
  "originalIssuanceNo": "MI-2026-05-00001",
  "originalVoucherNo": "FK20260514-002",
  "returnUnitId": 10001,
  "orgId": 10001,
  "businessDate": "2026-05-16",
  "warehouseCode": "WH-FK-A1",
  "ncCostCenterCode": "CC-FK-002",
  "totalAmount": -1000.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": -1.000,
      "amount": -1000.00,
      "returnReason": "未使用退回"
    }
  ]
}
```

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-006-1]：退料如对应 BIZ-005A（销售退回）是否走另一接口 vs 自动按原凭证类型分流

### 3.8 BIZ-007 跨组织调拨

- **方向**：物资 → NC（push, realtime）
- **触发**：S-12 调出 + 调入双签收完成
- **来源单据**：S-12 `transfer_order`
- **业务实体**：`transfer_order`
- **幂等键**：`BIZ-007:transfer_order:{transferId}`
- **凭证口径**：内部往来对冲（调出组织借内部往来 贷 1403；调入组织借 1403 贷内部往来）

**请求 schema**：
```json
{
  "transferId": 130001,
  "transferNo": "TR-2026-05-00001",
  "fromOrgId": 10001,
  "fromOrgName": "物资公司",
  "toOrgId": 10002,
  "toOrgName": "阜矿二矿",
  "fromWarehouseCode": "WH-FK-A1",
  "toWarehouseCode": "WH-MINE2-B1",
  "businessDate": "2026-05-14",
  "shippedAt": "2026-05-14T10:00:00Z",
  "receivedAt": "2026-05-15T14:00:00Z",
  "totalAmount": 20000.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": 20.000,
      "unitPrice": 1000.00,
      "amount": 20000.00
    }
  ]
}
```

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-007-1]：单次接口是否生成 NC 端两套凭证（调出 + 调入两个组织）vs 调用方两次推送（按 fromOrg / toOrg 各 push 一次）
- [⚠️ NC 端待确认 BIZ-007-2]：内部往来科目编码（NC 端是否预设标准内部往来科目 vs 物资侧传入）
- [⚠️ NC 端待确认 BIZ-007-3]：shipped/received 时间差异（跨日调拨）凭证日期取哪一方

### 3.9 BIZ-008 盘盈处理

- **方向**：物资 → NC（push, realtime）
- **触发**：S-17 盘盈审批通过
- **来源单据**：S-17 `inventory_surplus`
- **业务实体**：`inventory_surplus`
- **幂等键**：`BIZ-008:inventory_surplus:{surplusId}`
- **凭证口径**：借 1403 原材料，贷 6301 营业外收入

**请求 schema**：
```json
{
  "surplusId": 140001,
  "surplusNo": "SP-2026-05-00001",
  "orgId": 10001,
  "warehouseCode": "WH-FK-A1",
  "businessDate": "2026-05-14",
  "approvedAt": "2026-05-14T16:00:00Z",
  "approvedBy": "审批人编号",
  "ncCostCenterCode": "CC-FK-001",
  "totalAmount": 500.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": 0.500,
      "unitPrice": 1000.00,
      "amount": 500.00,
      "reason": "盘点差异"
    }
  ]
}
```

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-008-1]：盘盈单价取值（移动平均 / 重置成本）vs NC 自定标准
- [⚠️ NC 端待确认 BIZ-008-2]：`approvedBy` 是用户编号 vs NC 用户实体 ID

### 3.10 BIZ-009 盘亏处理

- **方向**：物资 → NC（push, realtime）
- **触发**：S-18 盘亏审批通过
- **来源单据**：S-18 `inventory_shortage`
- **业务实体**：`inventory_shortage`
- **幂等键**：`BIZ-009:inventory_shortage:{shortageId}`
- **凭证口径**：借 6601 管理费用 / 6301 营业外支出（按损失原因分流），贷 1403 原材料

**请求 schema**：
```json
{
  "shortageId": 150001,
  "shortageNo": "SH-2026-05-00001",
  "orgId": 10001,
  "warehouseCode": "WH-FK-A1",
  "businessDate": "2026-05-14",
  "approvedAt": "2026-05-14T16:00:00Z",
  "lossReason": "管理责任",
  "ncDebitAccount": "6601",
  "ncCostCenterCode": "CC-FK-001",
  "totalAmount": 1000.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": 1.000,
      "unitPrice": 1000.00,
      "amount": 1000.00,
      "reason": "管理责任"
    }
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `lossReason` | string | Y | 损失原因（决定 ncDebitAccount 分流） |
| `ncDebitAccount` | string(8) | Y | 借方科目（6601/6301，物资侧按 lossReason 预先选定） |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-009-1]：借方科目分流是物资侧选定 vs NC 按 lossReason 自动选
- [⚠️ NC 端待确认 BIZ-009-2]：盘亏高敏感审批后是否要传责任人字段（NC 凭证摘要）

### 3.11 BIZ-010 废旧变卖出库

- **方向**：物资 → NC（push, realtime）
- **触发**：S-20 处置审批通过 + 出库执行
- **来源单据**：S-20 / S-31 `scrap_disposal`
- **业务实体**：`scrap_outbound`
- **幂等键**：`BIZ-010:scrap_outbound:{disposalId}`
- **凭证口径**：借 6301 营业外支出，贷 1403 原材料

**请求 schema**：
```json
{
  "disposalId": 160001,
  "disposalNo": "SCR-2026-05-00001",
  "disposalType": "变卖",
  "orgId": 10001,
  "warehouseCode": "WH-FK-A1",
  "businessDate": "2026-05-14",
  "ncCostCenterCode": "CC-FK-001",
  "totalCostAmount": 800.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": 10.000,
      "costUnitPrice": 80.00,
      "costAmount": 800.00
    }
  ]
}
```

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-010-1]：BIZ-010（出库）与 BIZ-011（收入）是否绑 BIZ-业务组合（NC 端按业务组合一次推送 vs 物资侧两次推送）
- [⚠️ NC 端待确认 BIZ-010-2]：废旧出库成本口径（残值 / 历史成本 / 0 元）

### 3.12 BIZ-011 废旧变卖收入

- **方向**：物资 → NC（push, realtime）
- **触发**：S-20 变卖收款确认
- **来源单据**：S-20
- **业务实体**：`scrap_income`
- **幂等键**：`BIZ-011:scrap_income:{disposalId}`
- **凭证口径**：借 1002 银行存款，贷 6301 营业外收入 + 2221 销项税

**请求 schema**：
```json
{
  "disposalId": 160001,
  "disposalNo": "SCR-2026-05-00001",
  "buyerCode": "BUYER-RECYCLE-01",
  "buyerName": "废品回收公司",
  "orgId": 10001,
  "businessDate": "2026-05-15",
  "receivedAt": "2026-05-15T10:00:00Z",
  "bankAccount": "62222...",
  "totalAmount": 1200.00,
  "totalTaxAmount": 156.00,
  "currency": "CNY",
  "ncCostCenterCode": "CC-FK-001",
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": 10.000,
      "salesUnitPrice": 120.00,
      "amount": 1200.00,
      "taxRate": 0.1300,
      "taxAmount": 156.00
    }
  ]
}
```

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-011-1]：收款银行账户编码（`bankAccount`）是 NC 银行档案编码 vs 卡号原文
- [⚠️ NC 端待确认 BIZ-011-2]：买家主数据 NC 端管理 vs 物资侧管理

### 3.13 BIZ-012 危险品销毁

- **方向**：物资 → NC（push, realtime - 优先级高）
- **触发**：S-20/S-31 销毁审批通过
- **来源单据**：S-20 / S-31
- **业务实体**：`hazmat_destroy`
- **幂等键**：`BIZ-012:hazmat_destroy:{disposalId}`
- **凭证口径**：借 6301 营业外支出，贷 1403 原材料

**请求 schema**：
```json
{
  "disposalId": 170001,
  "disposalNo": "HAZ-2026-05-00001",
  "destroyMethod": "焚烧 / 填埋 / 中和",
  "destroyAgency": "委托销毁机构名称",
  "destroyCertificateNo": "HAZ-CERT-2026-001",
  "destroyedAt": "2026-05-14T10:00:00Z",
  "approverList": ["A001", "A002", "A003"],
  "orgId": 10001,
  "warehouseCode": "WH-FK-HAZ",
  "businessDate": "2026-05-14",
  "ncCostCenterCode": "CC-FK-SAFETY",
  "totalAmount": 2000.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100456,
      "ncInventoryCode": "INV-NC-HAZ-001",
      "hazmatCategory": "易燃液体",
      "quantity": 100.000,
      "unitPrice": 20.00,
      "amount": 2000.00
    }
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `destroyCertificateNo` | string | Y | 销毁证书号（合规留痕） |
| `approverList[]` | array | Y | 多级审批人列表（高敏感） |
| `hazmatCategory` | string | Y | 危险品分类 |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-012-1]：合规字段（销毁证书号 / 委托机构）是否进 NC 凭证摘要
- [⚠️ NC 端待确认 BIZ-012-2]：审批人列表是否必传（NC 端是否做留痕） vs 物资侧自留

### 3.14 BIZ-013 火工品出入库

- **方向**：物资 → NC（push, realtime - 优先级高）
- **触发**：S-05/S-09/S-21 火工品出入库审核通过
- **来源单据**：S-05 / S-09 / S-21（独立通道）
- **业务实体**：`explosives_in_out`
- **幂等键**：`BIZ-013:explosives_in_out:{transactionId}`
- **凭证口径**：独立科目（火工品专户）+ 单独凭证序号

**请求 schema**：
```json
{
  "transactionId": 180001,
  "transactionNo": "EXP-2026-05-00001",
  "transactionType": "入库",
  "explosivesCategory": "雷管 / 炸药 / 索类",
  "policeFilingNo": "GA-2026-001",
  "explosivesCertificateNo": "EXP-CERT-2026-001",
  "approverList": ["A001", "A002"],
  "supplierOrCustomer": "上游供应商或下游用户",
  "orgId": 10001,
  "warehouseCode": "WH-FK-EXP",
  "businessDate": "2026-05-14",
  "ncCostCenterCode": "CC-FK-EXP",
  "ncSpecialAccount": "1403-EXP",
  "totalAmount": 10000.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100789,
      "ncInventoryCode": "INV-NC-EXP-001",
      "quantity": 1000.000,
      "unitPrice": 10.00,
      "amount": 10000.00
    }
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `transactionType` | string | Y | `入库/出库` |
| `policeFilingNo` | string | Y | 公安备案号 |
| `ncSpecialAccount` | string | Y | NC 火工品专户科目（独立） |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-013-1]：火工品专户科目编码（NC 端是否预设独立科目 vs 物资侧传入）
- [⚠️ NC 端待确认 BIZ-013-2]：公安备案号字段是否进 NC 凭证（合规要求）
- [⚠️ NC 端待确认 BIZ-013-3]：出入库是否分两个接口 vs 一个接口 `transactionType` 分流

### 3.15 BIZ-014 预付款登记

- **方向**：物资 → NC（push, realtime）
- **触发**：C-08 预付款申请审批通过（`is_prepayment=true`）/ C-10 预付款执行
- **来源单据**：C-08 / C-10
- **业务实体**：`payment_request` 或 `payment_execution`
- **幂等键**：`BIZ-014:payment_request:{requestId}` 或 `BIZ-014:payment_execution:{executionId}`
- **凭证口径**：借 1123 预付账款，贷 1002 银行存款

**请求 schema**：
```json
{
  "businessEntity": "payment_execution",
  "businessId": 200001,
  "executionNo": "PAY-2026-05-00001",
  "paymentBatchNo": "BATCH-202605-001",
  "contractId": 60001,
  "contractNo": "CT-2026-001",
  "supplierCode": "SUP-001",
  "supplierName": "鞍钢集团",
  "orgId": 10001,
  "businessDate": "2026-05-14",
  "paidAt": "2026-05-14T14:00:00Z",
  "paymentAmount": 30000.00,
  "currency": "CNY",
  "bankAccount": "62222...",
  "ncCostCenterCode": "CC-FK-001",
  "remark": "预付款登记 - 合同 CT-2026-001 首付款"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `businessEntity` | string | Y | `payment_request` / `payment_execution` |
| `paymentBatchNo` | string | N | C-09 月度批次号（Sprint 16a 已落） |
| `bankAccount` | string(32) | Y | 付款银行账户（M-21 银行档案） |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-014-1]：触发时机 — 申请审批 vs 实付完成（详设 08 §5.2 业务方 Q-13-4 确认走 C-10 触发）
- [⚠️ NC 端待确认 BIZ-014-2]：预付款核销是否要在 BIZ-014 推送时携带"待核销额"字段 vs 完全由 BIZ-015 接管

### 3.16 BIZ-015 预付款核销

- **方向**：物资 → NC（push, realtime）
- **触发**：C-08 + S-05 发票 + 入库匹配完成（三单匹配）
- **来源单据**：C-08 + S-05
- **业务实体**：`prepayment_writeoff`
- **幂等键**：`BIZ-015:prepayment_writeoff:{paymentRequestId}`
- **凭证口径**：借 2202 应付账款，贷 1123 预付账款

**请求 schema**：
```json
{
  "writeoffId": 210001,
  "paymentRequestId": 200001,
  "originalPrepaymentVoucherNo": "FK20260514-003",
  "receiptId": 50001,
  "receiptNo": "PR-2026-05-00001",
  "invoiceNo": "INV-2026-001",
  "contractId": 60001,
  "orgId": 10001,
  "businessDate": "2026-05-20",
  "writeoffAmount": 30000.00,
  "currency": "CNY",
  "ncCostCenterCode": "CC-FK-001"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `originalPrepaymentVoucherNo` | string | Y | 原 BIZ-014 NC 凭证号 |
| `writeoffAmount` | decimal(18,2) | Y | 核销金额（可能小于原预付额，部分核销） |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-015-1]：部分核销 NC 端是否支持（如预付 30000 核销 25000）vs 必须全额核销
- [⚠️ NC 端待确认 BIZ-015-2]：多次核销同一预付款（如分批入库）NC 端是否累计扣减预付账款余额

### 3.17 BIZ-016 让步接收入库

- **方向**：物资 → NC（push, realtime）
- **触发**：S-04 质检让步 + 降价确认 + S-05 入库
- **来源单据**：S-04 + S-05
- **业务实体**：`concession_inbound`
- **幂等键**：`BIZ-016:concession_inbound:{receiptId}`
- **凭证口径**：降价后借 1403 原材料，贷 2202 应付账款（按降价后金额）

**请求 schema**：
```json
{
  "receiptId": 220001,
  "receiptNo": "PR-2026-05-CON-00001",
  "qualityInspectionId": 230001,
  "concessionReason": "外观瑕疵 / 性能轻度不达标",
  "originalUnitPrice": 1000.00,
  "concessionUnitPrice": 800.00,
  "concessionRate": 0.2000,
  "approvedBy": "A001",
  "approvedAt": "2026-05-14T16:00:00Z",
  "orgId": 10001,
  "supplierCode": "SUP-001",
  "businessDate": "2026-05-14",
  "warehouseCode": "WH-FK-A1",
  "ncCostCenterCode": "CC-FK-001",
  "totalAmount": 8000.00,
  "totalTaxAmount": 1040.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100123,
      "ncInventoryCode": "INV-NC-001234",
      "quantity": 10.000,
      "unitPrice": 800.00,
      "amount": 8000.00,
      "taxRate": 0.1300,
      "taxAmount": 1040.00,
      "qualityIssue": "外观瑕疵"
    }
  ]
}
```

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-016-1]：让步审批记录是否需要 NC 凭证摘要（合规留痕）
- [⚠️ NC 端待确认 BIZ-016-2]：让步降价后是否与正式入库 BIZ-001 共用接口 vs 必须独立 BIZ-016

### 3.18 BIZ-017 安全专项领用

- **方向**：物资 → NC（push, realtime）
- **触发**：S-09 安全专项领料审核通过
- **来源单据**：S-09（`issuance_type=安全专项`）
- **业务实体**：`safety_special_issue`
- **幂等键**：`BIZ-017:safety_special_issue:{issuanceId}`
- **凭证口径**：借专项储备科目，贷 1403 原材料

**请求 schema**：
```json
{
  "issuanceId": 240001,
  "issuanceNo": "MI-SAFETY-2026-05-00001",
  "safetyProjectCode": "SAFETY-PRJ-2026-001",
  "safetyProjectName": "矿井通风专项",
  "ncSpecialReserveAccount": "4301",
  "usageUnitId": 10002,
  "usageUnitName": "二矿安全管理处",
  "orgId": 10001,
  "warehouseCode": "WH-FK-A1",
  "ncCostCenterCode": "CC-FK-SAFETY",
  "businessDate": "2026-05-14",
  "totalAmount": 5000.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100200,
      "ncInventoryCode": "INV-NC-SAF-001",
      "quantity": 50.000,
      "unitPrice": 100.00,
      "amount": 5000.00
    }
  ]
}
```

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-017-1]：专项储备科目编码（NC 端是否预设安全专项储备账户 vs 物资侧传入）
- [⚠️ NC 端待确认 BIZ-017-2]：安全专项项目是否走 NC 端项目主数据（NC 项目核算）

### 3.19 BIZ-018 低值易耗品摊销

- **方向**：物资 → NC（push, batch 月末）
- **触发**：月末摊销批处理（一次性 / 五五摊销 / 分期摊销三种规则）
- **来源单据**：S-09 / S-21
- **业务实体**：`low_value_amortize`
- **幂等键**：`BIZ-018:low_value_amortize:{amortizeBatchId}`
- **凭证口径**：借 6602 销售费用 / 6601 管理费用（按使用部门），贷 1403 原材料（待摊费用）

**请求 schema**：
```json
{
  "amortizeBatchId": 250001,
  "amortizeBatchNo": "AMT-202605-001",
  "amortizeMonth": "2026-05",
  "amortizeMethod": "五五摊销",
  "orgId": 10001,
  "businessDate": "2026-05-31",
  "totalAmount": 2000.00,
  "lines": [
    {
      "lineNo": 1,
      "materialId": 100333,
      "ncInventoryCode": "INV-NC-LV-001",
      "issuanceId": 110123,
      "ncCostCenterCode": "CC-FK-002",
      "amortizePeriod": "首次 50%",
      "amortizeAmount": 1000.00
    }
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `amortizeMethod` | string | Y | `一次性 / 五五摊销 / 分期摊销` |
| `lines[].amortizePeriod` | string | Y | `首次 50%` / `尾次 50%` / `第 N 期` |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-018-1]：分期摊销周期是物资侧管控（每月跑批 push）vs NC 端自动摊销（推一次后 NC 内部跑）
- [⚠️ NC 端待确认 BIZ-018-2]：单批次摊销明细行数上限（vs 拆批）

### 3.20 BIZ-019 委托加工财务触发

- **方向**：物资 → NC（push, realtime）
- **触发**：发出物料 / 加工费确认（Q-07-4 业务方 2026-05-09 确认）
- **来源单据**：委托加工单 / 扩展单据（一期暂用占位）
- **业务实体**：`outsourced_processing`
- **幂等键**：`BIZ-019:outsourced_processing:{processingId}`
- **凭证口径**：借"委托加工物资"独立科目，贷"原材料"

**请求 schema**：
```json
{
  "processingId": 260001,
  "processingNo": "OP-2026-05-00001",
  "phase": "发出 / 加工费确认 / 完工入库",
  "processorCode": "OUT-PROC-001",
  "processorName": "委托加工方",
  "originalMaterialId": 100400,
  "originalNcInventoryCode": "INV-NC-RAW-001",
  "originalQuantity": 100.000,
  "originalAmount": 50000.00,
  "processingFee": 5000.00,
  "outputMaterialId": 100500,
  "outputNcInventoryCode": "INV-NC-PROC-001",
  "ncOutsourcedAccount": "1408",
  "orgId": 10001,
  "warehouseCode": "WH-FK-OP",
  "businessDate": "2026-05-14",
  "ncCostCenterCode": "CC-FK-002"
}
```

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-019-1]：一期来源单据待补（委托加工模块详设顺延 Sprint 后续）— 字段是否要等委托加工模块详设落定后再调
- [⚠️ NC 端待确认 BIZ-019-2]：phase（发出 vs 加工费确认 vs 完工入库）是否合并到一个接口 vs 拆 3 个接口
- [⚠️ NC 端待确认 BIZ-019-3]：委托加工物资独立科目（NC 1408 vs 自定义编码）

### 3.21 BIZ-020 付款执行

- **方向**：物资 → NC（push, realtime）
- **触发**：C-10 付款执行台账 PaymentTime 落定 + executive_state=已支付
- **来源单据**：C-08 + C-10
- **业务实体**：`payment_execution`
- **幂等键**：`BIZ-020:payment_execution:{executionId}`
- **凭证口径**：借 2202 应付账款，贷 1002 银行存款（应付挂账时点在 BIZ-001/002 已完成；BIZ-020 仅消减应付，业务方 Q-13-4 确认）

**请求 schema**：
```json
{
  "executionId": 270001,
  "executionNo": "PAY-2026-05-00001",
  "paymentBatchNo": "BATCH-202605-002",
  "paymentRequestId": 200005,
  "paymentRequestNo": "PR-PAY-2026-05-005",
  "contractId": 60001,
  "supplierCode": "SUP-001",
  "supplierName": "鞍钢集团",
  "orgId": 10001,
  "businessDate": "2026-05-20",
  "paidAt": "2026-05-20T14:00:00Z",
  "paymentAmount": 80000.00,
  "currency": "CNY",
  "bankAccount": "62222...",
  "bankTransactionNo": "BANK-202605-001",
  "ncCostCenterCode": "CC-FK-001",
  "remark": "应付款执行 - 合同 CT-2026-001 尾款"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `bankTransactionNo` | string | Y | 银行流水号（回写 C-10） |
| 其余 | 同 BIZ-014 | — | — |

**NC 端待确认**：
- [⚠️ NC 端待确认 BIZ-020-1]：应付挂账时点（业务方 Q-13-4 确认在 BIZ-001/002 — NC 端是否同意此口径）
- [⚠️ NC 端待确认 BIZ-020-2]：银行流水号是否必传（NC 凭证摘要 vs 仅作物资侧留痕）
- [⚠️ NC 端待确认 BIZ-020-3]：部分付款（合同分次付款）NC 端是否做应付账款余额校验

---

## 四、CHK 对账接口（2 个）

### 4.1 CHK-001 日对账（笔数/金额）

- **方向**：物资 → NC（push, scheduled 03:00 UTC）
- **触发**：Hangfire 每日 03:00 UTC
- **业务实体**：`nc-reconcile`
- **幂等键**：`CHK-001:nc-reconcile:{yyyyMMdd}`（businessId = yyyyMMdd 整数）
- **凭证口径**：N/A（对账查询，不生成凭证）

**请求 schema**：
```json
{
  "reconcileDate": "2026-05-13",
  "orgId": 10001,
  "interfaceCodes": ["BIZ-001", "BIZ-005", "BIZ-005A", "BIZ-020"],
  "scSummary": {
    "totalCount": 156,
    "totalAmount": 1234567.89,
    "byInterface": [
      { "interfaceCode": "BIZ-001", "count": 50, "amount": 500000.00 },
      { "interfaceCode": "BIZ-005", "count": 30, "amount": 50000.00 }
    ]
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `reconcileDate` | yyyy-MM-dd | Y | 对账日期（同 businessId） |
| `scSummary` | object | Y | 物资侧 F-03 receipt 当日汇总（笔数/金额） |
| `scSummary.byInterface[]` | array | Y | 按接口分组的汇总 |

**响应 schema**：
```json
{
  "code": "0000",
  "message": "OK",
  "voucherNo": null,
  "data": {
    "ncSummary": {
      "totalCount": 156,
      "totalAmount": 1234567.89,
      "byInterface": [ {  } ]
    },
    "variance": {
      "countDiff": 0,
      "amountDiff": 0.00,
      "varianceItems": []
    }
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `data.ncSummary` | object | Y | NC 侧当日凭证汇总（笔数/金额） |
| `data.variance` | object | Y | 差异结果（countDiff / amountDiff），交集为 0 即对账平 |
| `data.variance.varianceItems[]` | array | N | 差异明细（接口 + 业务键 + 差异金额） |

**NC 端待确认**：
- [⚠️ NC 端待确认 CHK-001-1]：是否支持反查模式（物资 push scSummary + NC 返 ncSummary）vs NC 主动给 push（每日固定时间 NC 端 push 汇总到物资侧 webhook）
- [⚠️ NC 端待确认 CHK-001-2]：对账时区（NC 当日 vs 物资当日，跨时区是否需要业务日期统一）
- [⚠️ NC 端待确认 CHK-001-3]：variance 差异明细颗粒度（按业务键到 voucherNo 级别 vs 仅汇总）
- [⚠️ NC 端待确认 CHK-001-4]：interfaceCodes 是否需要全 23 还是只检高频接口

### 4.2 CHK-004 接口状态查询

- **方向**：物资 → NC（pull, realtime, on-demand）
- **触发**：运维按需查 NC 接口任务状态
- **业务实体**：`interface-status-query`
- **幂等键**：`CHK-004:interface-status-query:{queryId}`
- **HTTP**：`GET {BaseUrl}/{targetInterfaceCode}/status?idempotencyKey=...`

**请求 schema**（GET query string + 物资侧 F-02 RequestBody）：

物资侧调 NC 时构建 URL：
```
GET /BIZ-001/status?idempotencyKey=BIZ-001:inbound_receipt:50001
Authorization: Bearer ...
X-Idempotency-Key: CHK-004:interface-status-query:9999  // CHK-004 自身幂等键
```

物资侧 F-02 InterfaceMessage.RequestBody（Sprint 14a Codex P2-5 修复）：
```json
{
  "target_interface_code": "BIZ-001",
  "target_idempotency_key": "BIZ-001:inbound_receipt:50001"
}
```

**响应 schema**（基于 Sprint 17a `ParseQueryResponseAsync`）：
```json
{
  "found": true,
  "taskState": "成功",
  "voucherNo": "FK20260514-001",
  "lastUpdatedAt": "2026-05-14T08:05:00Z",
  "errorCode": null,
  "errorMessage": null
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `found` | bool | Y | 是否找到目标任务 |
| `taskState` | string | Y | NC 端任务状态：`待处理/处理中/成功/失败/已重试` |
| `voucherNo` | string | N | 找到且成功时返凭证号 |
| `lastUpdatedAt` | ISO8601 | N | NC 端最后更新时间 |
| `errorCode/Message` | string | N | 失败时的 NC 错误码 + 消息 |

**NC 端待确认**：
- [⚠️ NC 端待确认 CHK-004-1]：响应字段名 `found` / `taskState` / `voucherNo` 是否一致（Sprint 17a 已实装解析此结构）
- [⚠️ NC 端待确认 CHK-004-2]：`taskState` 枚举值是否为中文（详设 08 §6.3 用 `成功/失败/已重试`）vs 英文（`success/failed/retried`）
- [⚠️ NC 端待确认 CHK-004-3]：URL 路径 `{targetInterfaceCode}/status?idempotencyKey=...` 是否一致 vs NC 端独立 endpoint（如 `/CHK-004?targetCode=BIZ-001&targetKey=...`）
- [⚠️ NC 端待确认 CHK-004-4]：未找到时 HTTP 状态码（404 vs 200 + found=false）

---

## 五、NC 端待确认问题汇总（53 条）

按"通用规约 / MD / BIZ / CHK"分组，便于 cici 与 NC 端 IT 沟通时一次性问完。

### 5.1 通用规约（11 条）

| 编号 | 问题 |
|---|---|
| G-1 | BaseUrl 实际路径前缀（NC 是否要求 `/api/v1/` 等） |
| G-2 | 必填头额外字段（X-Trace-Id / X-Tenant-Id / 签名） |
| G-3 | 30s 超时是否够用（BIZ-002 / BIZ-018 长批量） |
| G-4 | 响应字段名 code/message/voucherNo/data 是否一致 |
| G-5 | 重复推送时返 `"1001"` 还是 `"0000"` + 历史 voucherNo |
| G-6 | `"2001"` 凭证已冲销码语义 |
| G-7 | `"5001"` 业务拒收码语义 |
| G-8 | `"5002"` 主数据未对照码语义 |
| G-9 | 完整业务码字典（NC 实际返哪些 5xxx / 8xxx） |
| G-10 | idempotency 命中行为 |
| G-11 | 金额是否用 string 传（防 JSON number 精度损失） |

### 5.2 MD 主数据接口（10 条）

| 编号 | 问题 |
|---|---|
| MD-001-1 | unit 是否走 MD-003 字典预对照 |
| MD-001-2 | ncInventoryCode 由谁生成（物资侧 vs NC） |
| MD-001-3 | category/specification 是否参与 NC 校验 |
| MD-001-4 | unitConversion 是否必须 |
| MD-001-5 | 响应是否回 ncInventoryId 给物资侧回写 M-14 |
| MD-004-1 | 增量拉取 vs 全量 |
| MD-004-2 | 分页机制（pageNo/pageSize） |
| MD-004-3 | 层级树 vs 平铺列表 |
| MD-004-4 | m-22 物资侧落库时机 |
| MD-004-5 | pullDate 字段必要性 |

### 5.3 BIZ 业务接口（27 条）

| 编号 | 问题 |
|---|---|
| BIZ-001-1 | 发票号是否参与 NC 端三单匹配 |
| BIZ-001-2 | 明细 lines[] 数量上限 |
| BIZ-001-3 | batchNo 是否需要传 NC |
| BIZ-001-4 | 含税 vs 不含税字段双传 |
| BIZ-001-5 | businessDate 跨期归属规则 |
| BIZ-002-1 | 暂估批量月末窗口 |
| BIZ-002-2 | 单批暂估明细行数上限 |
| BIZ-003-1 | 冲销凭证是否需要 originalVoucherNo |
| BIZ-003-2 | 红字用负数 vs 单独字段 |
| BIZ-004-1 | 退货是否必须先冲原入库 |
| BIZ-004-2 | returnReason 是否需要传 NC |
| BIZ-005-1 | projectCode 是否走独立主数据 |
| BIZ-005-2 | 领料单价口径 |
| BIZ-005A-1 | 销售成本结转 NC 自动 vs 物资侧调 |
| BIZ-005A-2 | 客户主数据 NC 管理 vs 物资管理 |
| BIZ-005A-3 | 销项发票开票动作 NC vs 物资 |
| BIZ-006-1 | 退料对 BIZ-005A 销售退回是否走另接口 |
| BIZ-007-1 | 单接口生成两套凭证 vs 调用方两次推送 |
| BIZ-007-2 | 内部往来科目编码 |
| BIZ-007-3 | 跨日调拨凭证日期 |
| BIZ-008-1 | 盘盈单价取值 |
| BIZ-008-2 | approvedBy 编号 vs NC 用户 ID |
| BIZ-009-1 | 借方科目分流方 |
| BIZ-009-2 | 责任人字段必要性 |
| BIZ-010-1 | BIZ-010 + BIZ-011 是否绑业务组合 |
| BIZ-010-2 | 废旧出库成本口径 |
| BIZ-011-1 | bankAccount 编码 vs 卡号 |
| BIZ-011-2 | 买家主数据管理方 |
| BIZ-012-1 | 合规字段（销毁证书号）进 NC 凭证 |
| BIZ-012-2 | 审批人列表必传性 |
| BIZ-013-1 | 火工品专户科目编码 |
| BIZ-013-2 | 公安备案号必要性 |
| BIZ-013-3 | 出入库分两接口 vs 一接口 |
| BIZ-014-1 | 触发时机（申请审批 vs 实付） |
| BIZ-014-2 | 待核销额字段 |
| BIZ-015-1 | 部分核销支持性 |
| BIZ-015-2 | 多次核销累计扣减 |
| BIZ-016-1 | 让步审批进 NC 凭证摘要 |
| BIZ-016-2 | 让步是否与 BIZ-001 共用接口 |
| BIZ-017-1 | 专项储备科目编码 |
| BIZ-017-2 | 安全专项项目走 NC 项目核算 |
| BIZ-018-1 | 分期摊销周期管控方 |
| BIZ-018-2 | 单批摊销明细行数上限 |
| BIZ-019-1 | 一期委托加工详设待补 |
| BIZ-019-2 | phase 合并 vs 拆 3 接口 |
| BIZ-019-3 | 委托加工独立科目 |
| BIZ-020-1 | 应付挂账时点确认 |
| BIZ-020-2 | 银行流水号必传性 |
| BIZ-020-3 | 应付账款余额校验 |

### 5.4 CHK 对账接口（8 条）

| 编号 | 问题 |
|---|---|
| CHK-001-1 | 反查模式 vs NC 主动 push |
| CHK-001-2 | 对账时区统一 |
| CHK-001-3 | variance 颗粒度 |
| CHK-001-4 | interfaceCodes 全 23 vs 高频 |
| CHK-004-1 | 响应字段名一致性 |
| CHK-004-2 | taskState 枚举中英文 |
| CHK-004-3 | URL 路径形式 |
| CHK-004-4 | 未找到 HTTP 状态码 |

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版占位稿 — 23 接口请求/响应 schema + 业务码字典占位 + §五 56 条 NC 端待确认问题汇总 |

---

## 七、与 Sprint 17a/18b 实现对照

| 内容 | Sprint 17a/18b 已实装 | 占位稿对照 |
|---|---|---|
| HTTP Polly 三层弹性 | NcInterfaceHttpClient.BuildResilientPolicy | §1.1 超时/重试规约 |
| OAuth2 client_credentials + 401 refresh | NcOAuth2TokenService + SendWithAuthRetryAsync | §1.1 Authorization |
| 响应 code/message/voucherNo 解析 | ParseInvokeResponseAsync | §1.2 响应统一结构 |
| ValueKind 守卫（int code 容错） | ReadStringFlexible（Codex 18a P3-4） | §1.2 类型容错说明 |
| HTTP 200 != 业务成功（必须 code=0000） | Codex 15a P1 | §1.3 业务码字典 |
| CHK-004 target_interface_code 解析 | Codex 14a P2-5 | §4.2 请求 schema |
| F-02 RequestBody 透传 NC（不再 new {}） | ContributorPayloadHelper.ResolvePayloadAsync | §2-§4 各接口请求 schema 来源 |

> 本占位稿不引入新约定；所有 schema 字段命名 / 类型 / 必填性均基于 Sprint 17a 实装行为推断，等 NC 端反馈后再做调整（调整范围预估：字段名重命名 / 必填性放松 / 业务码字典订正 / data 字段结构对齐）。
