# Sprint 16a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 16a 验收演示脚本
**配套：** [`Sprint-16a-任务卡-V0.2.md`](./Sprint-16a-任务卡-V0.2.md) + [`Sprint-16a-Day1-X-AE-设计-V0.2.md`](./Sprint-16a-Day1-X-AE-设计-V0.2.md)

---

## 一、Sprint 16a 落地范围

按 V0.2 锁版（A+E 月结反结双轨 / 3 累计技术债 / 12-15 PD / 主+2 子代理），实际交付 **~11 PD**：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（任务卡 + A+E 设计）| `a2c5145` / `1939478` | a |
| **D1-X** | A 主线 9 个新 BIZ Contributor + 10 smoke 测试 | `6452501` | a |
| **D1-X** | E 月结反结：F-10/F-11/F-12 + Wave 87 + PeriodCloseManager + 23 测试 | `6452501` | **b（子代理）** |
| **D1-X** | 累计技术债：cross-org RBAC + HealthCheck + WireMock.Net + 12 测试 | `6452501` | **c（子代理）** |
| **D8** | Sprint16aMonthlyClose_E2E（月结→反结→重月结 + 重复月结拦截）| 本 commit | a |
| D9 | Demo 脚本 + Sprint 17a 草案 | 本文档 | a |

**测试基线演进**：
- Sprint 15a 收尾：**1519**
- Sprint 16a Day 1-X 三轨第一波：**1560**（+41）
- **Sprint 16a Day 8 E2E**：**1562**（+2）
- Domain 876 / Application 642 / EFCore 38 / Web 6

---

## 二、Demo 演示路径

### 路径 A：9 BIZ Contributor 链路（10 分钟）

1. **BIZ-005A 销售出库**：S-09 收货方=厂矿 → 借 1122 应收 / 贷 6001 收入 + 2221 销项税
2. **BIZ-010/011 废旧出入**：处置审 → 出库 + 收款 双侧
3. **BIZ-012 危险品销毁 + BIZ-013 火工品**：独立科目 / 独立凭证序号
4. **BIZ-015 预付款核销**：关联 BIZ-014 已登记 + F-03 voucher 回写
5. **BIZ-018 低耗摊销**：月末批 Hangfire 触发（一次性/五五/分期）

### 路径 B：月结反结全链路（5 分钟）

1. **月结发起**：PeriodCloseManager.InitiateCloseAsync("202604") → F-10 已月结
2. **反结申请**：ApplyReverseAsync → F-11 待审批 + A-20 ApprovalInstance 触发 WF-REV-001
3. **审批通过**：ApproveReverseAsync → F-11 已通过 + F-10 已反结
4. **重月结**：InitiateCloseAsync 复用同 PeriodCode F-10 行 → 已月结
5. **高敏感拦截**：SENS-FIN-003（月结）+ SENS-FIN-004（反结审批）自动审计留痕

### 路径 C：累计技术债 3 项（5 分钟）

1. **cross-org RBAC 完整版**：InterfaceTask.OrgId + Wave 88 + InterfaceMonitor 4 endpoint 按 caller's claim 过滤
2. **NC HealthCheck**：IsHealthyAsync GET /health + InterfaceHealthCheckService 启动期一次 + 不健康降级 Mock
3. **WireMock.Net POC**：BIZ-005A 端到端集成测试（真 NcInterfaceHttpClient → WireMock NC → F-03 写入）

---

## 三、验收要点

| # | 验收项 | 状态 |
|---|---|---|
| 1 | A 主线 9 BIZ Contributor 完整 | ✅ |
| 2 | E F-10/F-11/F-12 + Wave 87 + 月结反结状态机 | ✅ |
| 3 | NcAccountRule 6 规则硬编码 seed | ✅ |
| 4 | SENS-FIN-003/004 高敏感拦截 | ✅ |
| 5 | InterfaceTask.OrgId + Wave 88 + cross-org RBAC | ✅ |
| 6 | NC HealthCheck + HostedService | ✅ |
| 7 | WireMock.Net BIZ-005A POC | ✅ |
| 8 | 集成 E2E 月结→反结→重月结全链路 | ✅ |
| 9 | 基线 ≥ 1550（实际 1562）| ✅ |

---

## 四、Sprint 16a 收益总结

- **详设 08 NC 接口完整闭环** — 21 个接口（Sprint 14a 8 + Sprint 15a 8 + Sprint 16a 9）覆盖详设 08 §5.2 主要业务
- **月结反结** — F-10/F-11/F-12 完整状态机 + 高敏感拦截 + ApprovalInstance 联动
- **跨组织 RBAC** — InterfaceTask.OrgId + InterfaceMonitor scope 完整保护
- **NC 真接通辅助** — HealthCheck + WireMock.Net POC 加固上线前最后验证

**基线增长 +43**：1519 → 1562

---

## 五、Sprint 17a 候选范围

详 [`Sprint-17a-任务卡-V0.1.md`](./Sprint-17a-任务卡-V0.1.md)（草案）。

主要方向：
1. **D NcInterfaceHttpClient OAuth2 升级**（Sprint 15a/16a Bearer stub → 真 OAuth2）
2. **B 详设 10 剩 12 类审批模板**
3. **C 详设 09 看板剩 5 类 + OLAP**
4. **F-12 NC 凭证规则 SY-02 化**（Sprint 16a 硬编码 6 规则 → 配置化）
5. **NC 真端点联调**（NC 厂商配合后真实联调）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — Sprint 16a 收尾 Demo + Sprint 17a 候选 |
