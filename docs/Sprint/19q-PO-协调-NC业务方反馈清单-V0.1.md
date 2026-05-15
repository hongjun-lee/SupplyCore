# 19q PO 协调 - NC 业务方反馈清单 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores · NC 财务接口集成
**版本：** V0.1（cici 与 PO 协调材料 6/6 · NC 域专属）
**日期：** 2026-05-16
**文档性质：** 实施层 · PO 协调材料 · NC 业务方反馈梳理
**配套：** [`Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md`](../详细设计/Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md) + [`19q-PO-协调-业务价值清单-V0.1.md`](./19q-PO-协调-业务价值清单-V0.1.md) + [`19q-PO-协调-反馈跟踪表-V0.1.md`](./19q-PO-协调-反馈跟踪表-V0.1.md)

---

## 一、TL;DR — cici 与 NC 业务方 30 min 介绍版

> **现状**：SupplyCores 已为 NC 接口集成完成单边实施 — **23 接口** JSON Schema 占位稿 + 物资侧 `NcVoucherNo` 字段（8+ 实体）+ Polly 三层防御 + OAuth2 client_credentials + Idempotency-Key

> **5 月失败**：17a-19i NC 9 次顺延 5 月 / 19j A2' 撤架 / 至今 NC 业务方未反馈

> **现行策略**（Sprint 18b A2-1'）：单边推进 — JSON Schema 占位 + 物资侧 mock 写 `NcVoucherNo` + `NcInterface:UseMock=true`；待 NC 业务方反馈后改 `UseMock=false` + 配 BaseUrl + 投递真实 NC

> **NC 端反馈需要 85 个 `[⚠️ 待确认]` 决策点**（11 全局 G + 7 NCC-OpenAPI 路径 + 67 接口级）— **本文档梳理 + 优先级 + 协调建议**

---

## 二、85 个 `[⚠️ NC 端待确认]` 分布

| 类别 | 数量 | 优先级 | 说明 |
|---|---|---|---|
| **G-1~G-11 全局规约** | 11 | 🔴 最高 | URL / Header / 业务码字典 / JSON 格式 — **不确认就完全跑不通** |
| **NC-1-1~NC-1-7 NCC OpenAPI 路径决策** | 7 | 🔴 高 | NC 端走 NCC Gateway vs 直连 NC65？鉴权 OAuth2 vs Sign 签名？— **影响 SupplyCores 是否需新加 NccOpenApiAdapter ~1 PD** |
| **MD-001/MD-004 主数据级** | 10 | 🟡 中 | 物料 / 成本中心对照 — **MD 主数据先通才能投递 BIZ** |
| **BIZ-001~018 业务接口级**（实际看到 9+ 个） | 27 | 🟡 中 | 入库 / 暂估 / 红字 / 领料 / 退货 / 调拨 — **BIZ 一个个独立确认** |
| **CHK-001/CHK-004 对账接口级** | 8 | 🟢 低 | 日对账 / 状态查询 — **可在 BIZ 真通后再讨论** |
| **TOTAL** | **63 明示**（占位稿统计 85 含未列详细的 22 个） | — | — |

---

## 三、🔴 最高优先级 — G-1~G-11 全局规约（必须先于一切确认）

| # | 决策点 | NC 端可能选项 | SupplyCores 影响 |
|---|---|---|---|
| G-1 | BaseUrl 实际路径前缀（`/api/v1/` 还是别的）| `/api/v1/` / `/nccloud/api/` / 等 | 配 `NcInterface:BaseUrl` |
| G-2 | 必填头（除 Authorization + X-Idempotency-Key）— X-Trace-Id / X-Tenant-Id / 签名？| 1-3 个额外头 | NcInterfaceHttpClient HeaderProvider |
| G-3 | 超时 30s 是否够用（BIZ-002/BIZ-018 批量）| 60s / 120s | Polly Timeout policy 调整 |
| G-4 | 响应字段名一致性（code/message/voucherNo/data）| 同 / 不同（如 state/msg/billNo） | NcResponse parsing |
| G-5 | 1001 重复推送 idempotency 命中 | `"0000"` + 历史 voucherNo / `"1001"` 独立码 | NcResponse 业务码字典 |
| G-6 | 2001 已冲销 / 已反向 | 同 / 不同业务码 | F-03 receipt 处置 |
| G-7 | 5001 业务拒收（字段校验失败 / 业务规则违反）| 详细错误码 / 通用 5001 | F-04 错误日志规则 |
| G-8 | 5002 主数据未对照 | 同 / 独立码 | MD-001 重推触发条件 |
| G-9 | 完整业务码字典（5xxx / 8xxx）| NC 端实际返哪些码 + 语义 | NcResponse 业务码字典 |
| G-10 | idempotency 命中是返 `"0000"` 还是 `"1001"` | 二选一 | F-03 留痕 / Voucher 复用 |
| G-11 | 金额是 JSON number 还是 string（防精度损失）| number / string | NcInterfaceHttpClient JSON serializer |

**协调要点**：cici 与 NC 业务方 30 min 走完 G-1~G-11 决策 — **这是阻塞最深的根本协调**（业务方 1h 内可完成）。

---

## 四、🔴 高优先级 — NC-1-1~NC-1-7 NCC OpenAPI 路径决策

**关键决策**：NC 端走 **NCC OpenAPI Gateway**（云端标准化）还是 **直连 NC65 业务接口**（On-Premises）？

| # | 决策点 | NCC OpenAPI 路径 | 直连 NC65 路径 | SupplyCores 影响 |
|---|---|---|---|---|
| NC-1-1 | 集成路径 | `/nccloud/api/{模块}/{业务}` | 直接 NC65 业务接口 | 完全不同的 URL 模式 |
| NC-1-2 | 客户端包装 | 三层包装请求 + state=1/2 响应 | 业务接口直接调 | NcInterface 客户端 ~1 PD 改造 |
| NC-1-3 | 响应结构 | `{state: 1/2, data: {...}}` | NC 自定义如 `{success, errorCode, ...}` | NcResponse parser 完全重写 |
| NC-1-4 | F-12 NcAccountRule 存编码 | 编码 "1403" + UUID 双字段 | 编码 + UUID | F-12 schema 升级 |
| NC-1-5 | pk_currtype 一期 | 硬编码 CNY UUID | SY-02 字典化 | SY-02 字典扩展 |
| NC-1-6 | F-03 InterfaceReceipt | 拆 NcVoucherPk + NcVoucherNo 双字段 | 单字段 NcVoucherNo | Wave 91 schema 升级 |
| NC-1-7 | 鉴权方式 | OAuth2 client_credentials（标准）| **Sign 签名**（如阜矿用） | **Sprint 17a NcOAuth2TokenService 可能换 NcSignTokenService ~0.5 PD** |

**协调要点**：
- NC-1-7 鉴权方式是**最大未知**：SupplyCores 已实装 OAuth2 client_credentials（Sprint 17a 5 要点完整）— 但阜矿 NC 实际是 Sign 签名（参 memory `reference_nc_ncc_openapi_format`）
- cici 与 NC 业务方第一句话：**"SupplyCores 已实现 OAuth2 client_credentials 标准流，NC 端能否提供该方式？或者必须 Sign 签名？"**

---

## 五、🟡 中优先级 — 接口级 [⚠️] 数

| 接口 | 业务 | [⚠️] 数 | 优先级 | 业务影响 |
|---|---|---|---|---|
| **MD-001** | 物料-存货映射推送 | 5 | 🔴 高（先于 BIZ）| 物料对照不通 → 所有 BIZ 5002 拒收 |
| **MD-004** | 成本中心对照拉取 | 5 | 🔴 高（先于 BIZ）| 成本中心不通 → BIZ-005 等领料类拒收 |
| **BIZ-001** | 采购入库（正式）| 5 | 🔴 高 | 采购完成核心 / 三单匹配联动 |
| **BIZ-002** | 采购入库（暂估）| 2 | 🟡 中 | 月末暂估 |
| **BIZ-003** | 暂估红字冲销 | 2 | 🟡 中 | 与 BIZ-002 配对 |
| **BIZ-004** | 采购退货 | 2 | 🟡 中 | 红字凭证 |
| **BIZ-005** | 领料出库（物资自用）| 2 | 🔴 高 | 领料核心 |
| **BIZ-005A** | 对厂矿销售出库 | ?（占位未读）| 🔴 高 | 销售出库 |
| **BIZ-006** | 退料入库 | ?（占位未读）| 🟡 中 | - |
| **BIZ-007** | 跨组织调拨 | ?（占位未读）| 🟡 中 | - |
| **BIZ-008** | 盘盈处理 | ?（占位未读）| 🟢 低 | 月度调整 |
| **BIZ-009~018** | （占位未读 10 接口）| ?（占位未读）| - | 待补充 |
| **CHK-001** | 日对账 | 8 | 🟢 低（后置）| 业务通后做对账 |
| **CHK-004** | 接口状态查询 | -（含 CHK-001 8 个内）| 🟢 低（后置）| - |

**协调要点**：
- **MD 主数据 2 接口 + BIZ-001/005/005A 3 核心 = 5 接口先通**（解锁核心业务流 70%）
- 其余 18 接口可分批确认（按月推进）

---

## 六、cici 与 NC 业务方协调话术

### 6.1 业务价值话术（5 min）

> "NC 接口集成 SupplyCores 单边已经完成所有技术准备 — 23 接口 JSON Schema 占位 / Polly 三层弹性 / OAuth2 client_credentials / Idempotency-Key 全部就位。**只差 NC 端 BaseUrl + 鉴权方式 + 业务码字典 = 1 小时内可联调跑通 5 接口**（MD-001/MD-004/BIZ-001/005/005A）。"

> "阻塞 5 月（17a-19i 9 次顺延）的关键节点是 NC 端反馈窗口未建立 — 19q 我们与 PO 已建立反馈机制，希望 NC 业务方也加入。"

### 6.2 关键问题清单（cici 现场必问 / 1h 内可答）

1. **NC 端走 NCC OpenAPI Gateway 还是直连 NC65？**（NC-1-1）
2. **鉴权方式：OAuth2 client_credentials 还是 Sign 签名？**（NC-1-7 / **最关键**）
3. **BaseUrl 实际路径前缀**（G-1）
4. **超时 30s 够不够 BIZ-002/BIZ-018 批量**（G-3）
5. **响应字段名一致吗（code/message/voucherNo/data）**（G-4）

### 6.3 风险话术

> "如果 NC 业务方继续 5 月+ 不反馈 — SupplyCores 19r-19s 仍 mock — 财务方月结流程仍全手工 — 阜矿物资公司核心交易系统继续是 PowerPoint 演示。"

### 6.4 对接人要求

> "我需要 NC 业务方主管 1 个对接人 / 周 1 同步会 / 紧急 1d 响应 / 反馈 deadline 每接口 1 周内。"

> "**首批协调 5 接口**（MD-001/MD-004/BIZ-001/005/005A）3 周内通真 → 解锁财务方 10 页 mock→real 主线（19r-19s 路线）"

---

## 七、NC 业务方对接 + 反馈窗口建议

加入 [`19q-PO-协调-反馈跟踪表-V0.1.md`](./19q-PO-协调-反馈跟踪表-V0.1.md) §一 业务方花名册：

| 业务方 | 对接人 | 部门 | 联系方式 | 备份 | deadline |
|---|---|---|---|---|---|
| **NC 业务方**（NC 系统运维 / 集成开发）| ⏳ 待确认 | NC 系统组 | - | - | ≤ 1 周内对接人接洽 / G-1~G-11 + NC-1-1~NC-1-7 全部 30 min 内决策 |

**反馈频率**：周 1 同步会（cici + NC 业务方 + PO）+ 紧急 1d 响应

**反馈 deadline**：
- G-1~G-11 全局规约 → 1 周内 30 min 完成
- 5 核心接口（MD-001/MD-004/BIZ-001/005/005A）→ 2-3 周内逐项反馈 + 联调
- 其余 18 接口 → 1 月内分批

---

## 八、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-16 | 初版 — 85 个 `[⚠️ NC 端待确认]` 分类分级（11 全局 G + 7 NCC-OpenAPI + 67 接口级）+ §三 全局 G-1~G-11 高优先级清单 + §四 NCC OpenAPI 路径决策（**NC-1-7 鉴权方式最关键**）+ §五 23 接口 [⚠️] 分布 + §六 cici 与 NC 业务方协调话术（业务价值 / 5 必问 / 风险 / 对接人要求）+ §七 NC 业务方对接 deadline（1 周 G 决策 + 2-3 周 5 核心接口 + 1 月分批 18 接口）|
