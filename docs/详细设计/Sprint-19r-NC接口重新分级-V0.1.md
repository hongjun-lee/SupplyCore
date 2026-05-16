# Sprint 19r NC 接口重新分级 V0.1（PO 凭证导出主线 · 二分）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（起草 · 主代理 a 2026-05-16 — Sprint 19r D1 T-A1 / cici Q1 决策 A 二分）
**日期：** 2026-05-16
**文档性质：** 设计层 · NC 接口实施优先级重新分级（PO 决策落地）
**配套：** [`Sprint-19r-任务卡-V0.2.md`](../Sprint/Sprint-19r-任务卡-V0.2.md) §一 1.1 T-A1 + [`Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md`](./Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md)

---

## 〇、起源（2026-05-16 PO 会议决策 1）

PO 决策：**NC ERP 暂不上线** → SupplyCores 改为生成凭证文件交财务手动 / 导入。

**派生**：23 接口（招标附件二 v1.1）/ 实装 25 contributor 不再"对等推进 + 等业务方反馈 swap mock→real"，改为按"财务必收凭证"重新分级 → **5 核心做凭证导出 + 20 推迟仅 Schema 占位**。

---

## 一、分级原则（二分 / cici Q1 决策 A）

| 等级 | 数量 | 19r 处置 | NC 上线后 |
|---|---|---|---|
| **核心**：财务必收凭证 | 5 | T-B1/T-B2 凭证生成器 + ClosedXML 导出 + T-C3' 契约测试 | 直接切真（mock → real swap）+ 凭证导出兼容保留 |
| **推迟**：仅 Schema 占位 | 20 | 保留 17a-19q 已建 mock client / Polly / OAuth2 备件，不再投入新开发 | 业务流需要时按需启用 |

**核心入选标准**（同时满足）：
1. 解锁 ≥ 70% 财务核算流程（PO 财务方反馈 19q V0.1 L169）
2. 业务流原型已跑通（17a-19q 已实装 contributor）
3. 财务"必须看到凭证"才能闭环（区别于"内部对账类"）

**推迟入选标准**（满足任一）：
- 暂估 / 月结 / 反结类（依赖业务期间逻辑，PO 不要求 19r 出凭证）
- 异常处理类（退货 / 调拨 / 盘盈亏 / 报废 — 频次低，可月度批量）
- 对账监控类（CHK-* 内部健康检查，不产生凭证）
- 未实装类（MD-002/003/005 / CHK-002/003/005 — 招标列出但 17a-19q 未做）

---

## 二、5 核心：财务必收凭证（19r T-B1+T-B2 范围）

### 2.1 MD-001 物料对照（基础数据 / Md001MaterialMappingContributor）

| 项 | 值 |
|---|---|
| 业务流 | SupplyCores 物料 ↔ NC 存货编码映射 |
| 借贷方向 | 不产生凭证（基础数据同步）— **MD 类凭证 stub 仅 log 不写凭证文件** |
| 触发时机 | 物料新增 / 修改时（汤云龙 Q2.2 待反馈最终方案） |
| 财务必填 | 物料编码 / 名称 / 规格 / 计量单位 / NC 存货 PK |
| 入选理由 | **解锁所有 BIZ 凭证的物料行项** — BIZ-001/005/005A 必依赖物料映射，财务凭证摘要 + 借方科目计算需要物料属性 |
| 19r 状态 | T-B1 stub `Md001MaterialMappingVoucherGenerator` ✓ |

### 2.2 MD-004 成本中心对照（基础数据 / Md004CostCenterMappingContributor）

| 项 | 值 |
|---|---|
| 业务流 | SupplyCores 部门 / 成本中心 ↔ NC 成本中心 PK 映射 |
| 借贷方向 | 不产生凭证（基础数据同步）— stub 仅 log |
| 触发时机 | 部门 / 成本中心新增 / 修改时 |
| 财务必填 | 成本中心代码 / 名称 / 上级 / NC 成本中心 PK |
| 入选理由 | **解锁所有领料 / 调拨类凭证的成本归集** — BIZ-005 领料出库借方"生产成本"必依赖成本中心 |
| 19r 状态 | T-B1 stub `Md004CostCenterMappingVoucherGenerator` ✓ |

### 2.3 BIZ-001 采购正式入库（核心 / Biz001PurchaseInboundContributor）

| 项 | 值 |
|---|---|
| 业务流 | 三单匹配（合同 + 入库 + 发票）通过 → 采购入库凭证 |
| 借贷方向 | 借：原材料库存 (1403) / 贷：应付账款 (2202) |
| 触发时机 | 入库单一级审核通过（汤云龙 Q2.2 待反馈最终时机） |
| 财务必填 | 入库单号 / 物料编码 / 数量 / 单价 / 金额 / 供应商 / 仓库 / 入库日期 / 制单人 |
| 入选理由 | **F-01 三单匹配核心交付** — 财务月结基础，PO 19q 协调清单优先级 #1 |
| 19r 状态 | T-B1 stub `Biz001PurchaseInboundVoucherGenerator` ✓ + T-C3' 契约测试 ✓ |

### 2.4 BIZ-005 领料出库（核心 / Biz005MaterialIssuanceContributor）

| 项 | 值 |
|---|---|
| 业务流 | 生产 / 项目领料 → 领料凭证（成本归集） |
| 借贷方向 | 借：生产成本 / 工程施工 / 管理费用（按领用部门）/ 贷：原材料库存 (1403) |
| 触发时机 | 领料单审核通过（汤云龙 Q2.2 待反馈最终时机） |
| 财务必填 | 领料单号 / 物料 / 数量 / 金额 / 领用部门（成本中心）/ 项目（如有）/ 领用日期 |
| 入选理由 | **核算中心科目核心** — 成本归集闭环，PO 19q 协调清单优先级 #2 |
| 19r 状态 | T-B1 stub `Biz005MaterialIssuanceVoucherGenerator` ✓ + T-C3' 契约测试 ✓ |

### 2.5 BIZ-005A 对厂矿销售（核心 / Biz005APurchaseToSubsidiarySalesContributor）

| 项 | 值 |
|---|---|
| 业务流 | 集团内对厂矿销售（应收 + 销售收入） |
| 借贷方向 | 借：应收账款 - 内部往来 (1122) / 贷：主营业务收入 (6001) + 应交税费 - 增值税销项 (22210501) |
| 触发时机 | 销售单审核通过（汤云龙 Q2.2 待反馈） |
| 财务必填 | 销售单号 / 客户（厂矿）/ 物料 / 数量 / 单价 / 金额 / 税率 / 税额 / 销售日期 |
| 入选理由 | **应收 + 销收双向凭证** — 集团内部往来必收凭证 / 19q V0.4 NC 协调扩展明确为 5 核心之一 |
| 19r 状态 | T-B1 stub `Biz005APurchaseToSubsidiarySalesVoucherGenerator` ✓ + T-C3' 契约测试 ✓ |

---

## 三、20 推迟：仅 Schema 占位（NC 上线后启用）

### 3.1 BIZ 推迟（17 项 / 已实装但 19r 不做凭证导出）

| 接口 | Contributor | 推迟理由 | NC 上线后启用 Sprint |
|---|---|---|---|
| BIZ-002 暂估入库 | Biz002InventoryEstimateContributor | 暂估月末批量 / 依赖月结期间 | 19s+（业务方反馈月结流程后） |
| BIZ-003 暂估冲回 | Biz003InventoryEstimateReversalContributor | 暂估反结配套 | 19s+ |
| BIZ-004 采购退货 | Biz004PurchaseReturnContributor | 异常处理 / 频次低 / 月度批量 | 19s+ |
| BIZ-006 退料 | Biz006MaterialReturnContributor | 领料逆向 / 频次低 | 19s+ |
| BIZ-007 跨组织调拨 | Biz007CrossOrgTransferContributor | 跨组织内部往来 / 复杂 RBAC 已实装但财务凭证规则待业务方反馈 | 19s+ |
| BIZ-008 盘盈 | Biz008StockGainContributor | 异常 / 月度盘点批量 | 19s+ |
| BIZ-009 盘亏 | Biz009StockLossContributor | 同上 | 19s+ |
| BIZ-010 报废出库 | Biz010ScrapOutboundContributor | 异常 / 季度批量 | 19s+ |
| BIZ-011 废旧收入 | Biz011ScrapIncomeContributor | 异常 / 频次极低 | 19s+ |
| BIZ-012 危废销毁 | Biz012HazmatDestroyContributor | 合规专项 / 季度 | 19t+ |
| BIZ-013 火工出入库 | Biz013ExplosivesInOutContributor | 安全专项 / 单独流程 | 19t+ |
| BIZ-014 预付款登记 | Biz014PrepaymentRegistrationContributor | 资金类 / 与 BIZ-020 联动 | 19s+ |
| BIZ-015 预付款核销 | Biz015PrepaymentWriteoffContributor | 同上 | 19s+ |
| BIZ-016 让步入库 | Biz016ConcessionInboundContributor | 异常 / 频次低 | 19s+ |
| BIZ-017 安全专项 | Biz017SafetySpecialIssueContributor | 安全专项 | 19t+ |
| BIZ-018 低值易耗摊销 | Biz018LowValueAmortizeContributor | 月结摊销 | 19s+ |
| BIZ-019 委外加工 | Biz019OutsourcedProcessingContributor | 委外专项 / 频次低 | 19t+ |
| BIZ-020 支付执行 | Biz020PaymentExecutionContributor | 资金 / F-02 付款专项 / 财务直接核算 | 19s+（高优 / 财务后续主推） |

### 3.2 CHK 推迟（2 项实装 + 3 项未实装）

| 接口 | Contributor | 状态 | 推迟理由 |
|---|---|---|---|
| CHK-001 日对账 | Chk001DailyReconciliationContributor | 已实装 | 内部对账，不产生凭证 |
| CHK-002 月对账 | 未实装 | — | 同上 / 19s+ 实装 |
| CHK-003 异常对账 | 未实装 | — | 同上 |
| CHK-004 接口状态查询 | Chk004InterfaceStatusQueryContributor | 已实装 | 健康检查，不产生凭证 |
| CHK-005 业务对账 | 未实装 | — | 19s+ 实装 |

### 3.3 MD 推迟（3 项未实装）

| 接口 | 状态 | 推迟理由 |
|---|---|---|
| MD-002 供应商对照 | 未实装 | NC 上线前可暂用 SupplyCores 内部供应商主数据；F-01 三单匹配已用 |
| MD-003 客户对照 | 未实装 | 19s+ 实装（BIZ-005A 对厂矿销售已用 SupplyCores 内部客户） |
| MD-005 项目对照 | 未实装 | 项目维度归集，19s+ 实装 |

---

## 四、NC 上线后激活路径

PO 决策"NC 暂不上线"是**临时状态**，不是永久放弃。NC 上线时 SupplyCores 激活路径：

### 4.1 5 核心接口切真

1. 配置切换：`appsettings.json` `NcInterface:UseMock=true → false` + 配 `BaseUrl` + `Authentication.TokenStub`
2. 17a-19q 已建组件直接生效：
   - `NcInterfaceHttpClient`（Polly 三层 wrap policy）
   - `NcOAuth2TokenService`（client_credentials 5 要点 / single-flight / RefreshBuffer / 401 retry）
   - 23 contributor 已经 `INcInterfaceClient` 抽象，切换 mock → real 无侵入
3. 19r 凭证导出主线**保留作为兼容路径** — 财务可选 NC 直推 OR 凭证导出双轨

### 4.2 20 推迟接口启用

按业务方需求 / 月结流程逐步启用，每 Sprint 1-3 个接口（参考 [[feedback_nc_interface_sprint_pattern]] 三 Sprint 完整闭环节奏）。

---

## 五、业务方反馈反向影响（19r D5+ 调整）

cici 19r D1 今天约见李建颖 + 汤云龙 → 反馈到位后可能调整本文档：

| 反馈到位项 | 影响本文档 |
|---|---|
| Q1.1 财务凭证导入格式 | §二 5 核心 ClosedXML 模板字段重定 |
| Q1.2 财务必填字段 | §二 5 核心"财务必填"列重写 |
| Q1.3 频次（实时 / 日终 / 月结） | §二 5 核心"触发时机"列重写 |
| Q1.4 凭证号生成方案 | F-03 InterfaceReceipt schema 调整（T-A2 影响） |
| Q1.5 失败处理 | F-03 `VoucherDownloadStatus` 状态机扩展 |
| Q2.1 NcVoucherNo 字段命名 | 8+ 实体 rename migration（如改） |
| Q2.2 触发时机 | §二 5 核心"触发时机"细化 |
| Q2.3 批量节奏 | T-B1 触发器单条 vs 批量逻辑调整 |
| Q2.4 重推规则 | T-B1 重生成 + F-03 状态扩展 |

**升版策略**：业务方反馈到位后本文档升 V0.2，主代理 a 在 19r 收尾或 19s 起草时同步更新。

---

## 六、关联文档

- 任务卡：[`Sprint-19r-任务卡-V0.2.md`](../Sprint/Sprint-19r-任务卡-V0.2.md)
- 业务方反馈清单：[`19r-业务方反馈清单-V0.1.md`](../Sprint/19r-业务方反馈清单-V0.1.md)
- 18b Schema 占位：[`Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md`](./Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md)
- 19q PO 协调：[`19q-PO-协调-NC业务方反馈清单-V0.1.md`](../Sprint/19q-PO-协调-NC业务方反馈清单-V0.1.md)
- 招标附件：`docs/招标/附件二-接口清单及报文示例-v1.1.md`

---

**主代理 a 签名**：2026-05-16 V0.1 起草 · D1 T-A1 完成
