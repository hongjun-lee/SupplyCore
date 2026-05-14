# Sprint 16a 任务卡 V0.2（cici 锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（cici 锁版 · 2026-05-14）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 16a 起步草案
**配套：** [`Sprint-15a-Demo-脚本-V0.1.md`](./Sprint-15a-Demo-脚本-V0.1.md) §五 候选范围

---

## 一、Sprint 16a 候选方向（待 cici V0.1 锁版决策点 1）

按 Sprint 15a Demo §五 推荐 5 个方向：

### 候选 A：剩 6 BIZ + BIZ-005A 销售 + 月结反结 E

| Task | 范围 | 工时 |
|---|---|---|
| 16a-A1 | BIZ-005A 对厂矿销售出库（详设 §5.2，借 1122 应收 贷 6001 收入）| 1 PD |
| 16a-A2 | BIZ-010~013 废旧/危险品/火工品（4 接口）| 2-3 PD |
| 16a-A3 | BIZ-015~018 预付款核销 / 让步 / 安全 / 低耗摊销（4 接口）| 2-3 PD |
| 16a-E1 | F-10 period_close_record + F-11 reverse_request + F-12 nc_account_rule 实体 + Wave | 1 PD |
| 16a-E2 | 月结 + 反结 AppService + 高敏感拦截（SENS-FIN-003/004 已有 seed） | 1 PD |

**优势**：详设 08 NC 接口域完整闭环（20 BIZ + 月结）
**风险**：NC 凭证规则配置化复杂
**预算**：~8-10 PD

### 候选 B：详设 10 剩 12 类审批模板 + 高级特性

| Task | 范围 | 工时 |
|---|---|---|
| 16a-B1 | 剩 12 类审批模板（WF-TRF/CNT/SHT/SCP/EQP/RNT/MDT/SUP/REV/RPT/PUR-EXC 等）| 3-4 PD |
| 16a-B2 | 集团并行会签 V1.2（OR 节点）| 2 PD |
| 16a-B3 | 阶段 A/B/C 适配层（详设 10A V0.6）| 2-3 PD |

**预算**：10-12 PD

### 候选 C：详设 09 看板剩 5 类 + OLAP

| Task | 范围 | 工时 |
|---|---|---|
| 16a-C1 | 3 类大屏看板（合同 / 付款 / 库存）| 4-6 PD |
| 16a-C2 | SelfServiceReport OLAP 自定义 SQL | 2-3 PD |

**预算**：8-10 PD

### 候选 D：NcInterfaceHttpClient OAuth2 升级

| Task | 范围 | 工时 |
|---|---|---|
| 16a-D1 | NC OAuth2 客户端凭证流（client_credentials）| 1 PD |
| 16a-D2 | Token 自动刷新 + 过期重试 | 1 PD |
| 16a-D3 | NC 厂商真实端点联调 | 2-3 PD |

**预算**：4-5 PD

### 候选 E：详设 04 招投标（T-01~07）+ 能源集团招采平台对接

| Task | 范围 | 工时 |
|---|---|---|
| 16a-E1 | T-01~07 招投标流程实体 + AppService | 3-4 PD |
| 16a-E2 | 能源集团招采平台 OAuth + 接口对接 | 3-4 PD |

**优势**：详设 04 V1.2 余量大头
**风险**：外部平台依赖 +30 PD 缓冲
**预算**：6-8 PD

---

## 二、累计技术债（Sprint 16a 必修，决策点 2）

### 2.1 Sprint 15a 后续技术债

| # | 项 | 复杂度 | 工时 |
|---|---|---|---|
| 1 | InterfaceMonitor cross-org RBAC 完整版（一期仅 caller 登录态校验，真业务表 OrgId join 顺延）| 中 | 0.5-1 PD |
| 2 | NC 真端点联调（含 Mock 兜底，深度由厂商配合度决定；不阻塞主线）| 中 | 1-2 PD（厂商不配合时降级仅做 Mock 健康检查 0.3 PD）|
| 3 | ~~NcInterfaceHttpClient OAuth2 升级~~ **顺延 Sprint 17a**（候选 D 单独完整做，Bearer Token stub 一期可用）| - | 顺延 |
| 4 | WireMock.Net 集成测试（Sprint 15a 决策点 3 顺延）| 低 | 0.5 PD |

### 2.2 Codex 15a 顺延（待评审后补 §六附录）

> 占位 — Codex 15a 评审完成后从顺延清单挑出 P2-低复杂度补到本节。

**预估合计 ~3-5 PD**（占位等评审后修订）

---

## 三、V0.2 决策点（cici 锁版 · 2026-05-14）

| # | 决策点 | V0.1 倾向 | **V0.2 锁版** |
|---|---|---|---|
| 1 | Sprint 16a 主线方向 | A + E 月结反结 双轨 | ✅ **A + E 月结反结 双轨**（详设 08 完整闭环 / D OAuth2 顺延 Sprint 17a）|
| 2 | 累计技术债哪些必修 | 全修 | ✅ **3 项必修**（#1 cross-org RBAC + #2 NC 真端点含 Mock 兜底 + #4 WireMock.Net；#3 OAuth2 顺延 17a）|
| 3 | 工时预算 | 12-15 PD | ✅ **12-15 PD**（A 6-8 + E 2-3 + 技术债 2-2.5 + 缓冲 ≈ 10.5-13.5 PD）|
| 4 | 子代理并行策略 | 主+2 子代理 | ✅ **主 a + 子代理 b + c**（sweet spot 3.8x）|
| 5 | Codex 15a 评审时机 | Sprint 15a 收尾触发 | ✅ **已完成**（commit `187eaf5` 修复 1 P1 + 2 P2 零顺延）|

---

## 四、Sprint 16a 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 厂商真端点配合度不确定（候选 D） | 高 | Sprint 15a Mock 已落，可平滑切换 |
| 2 | 月结反结业务逻辑复杂（候选 A E） | 中 | 复用 Sprint 14a InterfaceTaskManager + 高敏感拦截器（SENS-FIN-003/004） |
| 3 | NC 凭证科目规则配置化（F-12） | 中 | 一期仅 SY-02 简化 + 硬编码常用规则；完整化顺延 Sprint 17a |
| 4 | 招投标外部平台对接（候选 E）| 高 | +30 PD 缓冲；优先做 T-01~03 基础流 |

---

## 五、Codex 15a 评审待触发

> 占位 — Sprint 15a 完成时触发 Codex 15a 评审 4 commits（`daa0479` / `7176bc6` 锁版 + `2380a9b` 第一波 + 本 D8/Demo commit）

**评审重点**：
- 8 BIZ Contributor 一致性 + 业务实体名 / 幂等键
- NcInterfaceHttpClient Polly 三层组合（Wrap 顺序 / 异常分类 / 软失败语义）
- Bearer Token stub 安全性
- NC 异常压测 5 场景覆盖率
- Wave 86 NOTICE 升级流程

---

## 六、Codex 15a Finding 附录（占位 — 待评审后补）

| Sprint 15a Day | Commits | 已评 | finding 数 |
|---|---|---|---|
| Day 1-X 三轨第一波 | `2380a9b` | _待评_ | - |
| Day 8 E2E + Demo | _待 commit_ | _待评_ | - |
| **合计** | 2 | **0** | _待评_ |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 5 候选方向（A NC 完整 / B 详设 10 / C 看板 / D OAuth2 / E 招投标）+ 4 累计技术债 + 5 决策点 |
| V0.2 | 2026-05-14 | **cici 锁版 + 3 处修补**：①§二.1 #3 OAuth2 顺延 Sprint 17a（候选 D 完整做，避免与主线重复）②§二.1 #2 NC 真端点含 Mock 兜底（不阻塞主线，厂商配合度决定深度）③决策点 1 锁 A+E 月结反结双轨 / D OAuth2 顺延 / 工时 12-15 PD / 主+2 子代理 / Codex 15a 已完成 |
