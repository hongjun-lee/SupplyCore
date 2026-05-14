# Sprint 18b 任务卡 V0.1（草案）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1（草案 · 待 cici 评审）
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 18b 起步草案
**配套：** [`Sprint-18a-Demo-脚本-V0.1.md`](./Sprint-18a-Demo-脚本-V0.1.md) §四 候选范围、[`Sprint-18a-NC端配合度评估-V0.1.md`](./Sprint-18a-NC端配合度评估-V0.1.md)

---

## 一、Sprint 18b 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 A2：NC 真端点联调 phase 2（Sprint 18a 顺延 · V0.1 倾向）

| Task | 范围 | 工时 | 依赖 NC 端 |
|---|---|---|---|
| 18b-A2-1 | NC 端配合度评估完成确认（18a A1 评估清单 7 项追踪） | 0.5 PD | **强** |
| 18b-A2-2 | OAuth2 token endpoint 真接通 + 业务码字典升级 | 1 PD | **强** |
| 18b-A2-3 | 23 NC 接口 phase 1 实测（MD-001/004 + 4 BIZ + 5 CHK） | 2 PD | **强** |
| 18b-A2-4 | BIZ-005A 单接口灰度上线 + Health Snapshot 真值验证 | 0.5 PD | **强** |
| 18b-A2-5 | Codex 18a 4 P3 finding 修复（索引 / catch / LastModif / ValueKind 守卫） | 1 PD | 无 |

**预算**：~5 PD（A2-1 至 A2-4 强依赖 NC 端，A2-5 可独立做）

### 候选 B：详设 10 剩 12 类审批模板（顺延候选）

详 Sprint 17a/18a 候选 B。**预算 10-12 PD**

### 候选 C：详设 09 看板剩 5 类 + OLAP（顺延候选）

详 Sprint 17a/18a 候选 C。**预算 8-10 PD**

### 候选 G：详设 06 库存超储处置 + 暂估完整化（顺延候选）

详 Sprint 17a/18a 候选 G。**预算 5-6 PD**

---

## 二、累计技术债（Sprint 18b 必修，决策点 2）

### 2.1 Sprint 18a 后续技术债

| # | 项 | 来源 | 工时 |
|---|---|---|---|
| 1 | F-12 NcAccountRule ledger_sum 实接（Sprint 18a A3 schema 已升级，等 NC 真值填入） | 18a 顺延 | 0.5 PD（融入 A2-3）|
| 2 | OAuth2 Token Redis 持久化缓存（Sprint 17a 顺延，一期内存）| 17a 顺延 | 0.5 PD |
| 3 | InterfaceTask CreationTime 索引 Wave 90（dashboard 性能） | Codex 18a P3-1 | 0.3 PD |
| 4 | InterfaceMonitorAppService catch{} 显式异常处理（DB 故障可观测性） | Codex 18a P3-2 | 0.3 PD |
| 5 | LastSuccessfulCallAt 用 LastModificationTime 窗口（防漏长尾成功） | Codex 18a P3-3 | 0.2 PD |
| 6 | ParseInvokeResponseAsync ValueKind 守卫 + errorCode 语义化 | Codex 18a P3-4 / 17a 顺延 | 0.5 PD |

### 2.2 Codex 18a 顺延（评审完成 · 0 P2 顺延）

Codex 18a 评审 2 代码 commits（`9b57f08` A3 / `641ff0e` A4+A5）共 **0 P1 + 0 P2 + 4 P3**：
- 全 P3 finding 顺延 Sprint 18b（融入累计技术债 #3-#6）
- **0 P2 当 Sprint 顺延** — Codex 0 顺延 P2 连续 **7 Sprint** 记录达成（12a/13a/14a/15a/16a/17a/18a）

**预估合计 ~2-3 PD**（4 P3 + 2 Sprint 17a/18a 顺延）

---

## 三、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 18b 主线方向（A2/B/C/G）| **A2** NC 真端点 phase 2（关键依赖 NC 端配合 18a 评估已交付）|
| 2 | 6 累计技术债哪些必修 | **全修** ~2-3 PD（A2-3/A2-5 主线吸收 #1/#3-#6） |
| 3 | 工时预算 | 7-8 PD（A2 5 + 技术债 2-3 + 缓冲）|
| 4 | 子代理并行策略 | 主+2 子代理 sweet spot 3.8x |
| 5 | Codex 18a 评审 | 已完成 0 P1 + 0 P2 全顺延 P3（commit 仅 §六附录）连续 7 Sprint 0 顺延 P2 |
| 6 | 启动前置 | NC 端配合度评估 7 项需完成至少 5 项才能进 A2-2（OAuth2 真接通）|

---

## 四、Sprint 18b 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 厂商真端点配合度仍未到位（A2 全部强依赖）| **极高** | Sprint 18a A1 评估清单 7 项已交付 NC 端；若仍阻塞 → A2 顺延 Sprint 19a，18b 转候选 B/C/G |
| 2 | NC 真端点实际 schema 与 Mock 偏差 | 中 | Sprint 17a Mock + WireMock chaos 5 + Sprint 18a chaos phase 2 5 = 10 场景已覆盖；偏差点逐个适配 |
| 3 | OAuth2 token endpoint 实际安全要求（mTLS / IP 白名单）| 中 | NcOAuth2TokenService 已抽离 HttpClient 注入，可扩 |
| 4 | InterfaceTask 性能（量大 dashboard 全表扫）| 中 | Wave 90 加 CreationTime 索引（Codex 18a P3-1 修复）|
| 5 | F-08 errorCode 不规范（.NET 异常名进入）| 低 | ParseInvokeResponseAsync ValueKind 守卫 + errorCode 语义化（Codex 18a P3-4 修复）|

---

## 五、Codex 18a 评审待触发（已完成）

> Codex 18a 评审已完成（子代理 `a5d3c14d27ed452f8`）— 详 §六附录

---

## 六、Codex 18a Finding 附录（评审完成 · 0 P2 顺延）

| Sprint 18a Commits | 已评 | P1 | P2 | P3 | 当 Sprint 修 | 顺延 18b |
|---|---|---|---|---|---|---|
| `9b57f08` A3 F-06 amount Wave 89 | Y | 0 | 0 | 0 | - | - |
| `641ff0e` A4 chaos phase 2 + A5 Health Snapshot 扩展 | Y | 0 | 0 | 4 | 0 | 4 |
| **合计** | 2 | **0** | **0** | **4** | **0** | **4** |

**4 P3 顺延清单**（融入 §二.1 累计技术债）：

| P3 # | finding | 顺延项 | 工时 |
|---|---|---|---|
| P3-1 | `SupplyCoresDbContextModelCreatingExtensions.cs:2317-2333` — interface_task 缺 CreationTime 索引，dashboard 全表扫风险 | Wave 90 加 `(CreationTime)` 或 `(CreationTime DESC, InterfaceCode)` 复合索引 | 0.3 PD |
| P3-2 | `InterfaceMonitorAppService.cs:355-362` — 静默 catch{} 吞 DB 故障无可观测性 | 显式 `catch (NullReferenceException)` mock 路径 + `catch (Exception) Logger.LogWarning` 真异常 | 0.3 PD |
| P3-3 | `InterfaceMonitorAppService.cs:329-330` — LastSuccessfulCallAt 用 CreationTime 窗口漏长尾 retry 成功 | 改 LastModificationTime 窗口 | 0.2 PD |
| P3-4 | `NcInterfaceHttpClient.ParseInvokeResponseAsync` — `GetString()` 对 ValueKind=Number 抛 InvalidOperationException | ValueKind 守卫 + errorCode 归一化为 `NC_INVALID_FIELD_TYPE` | 0.5 PD |

**Codex 0 顺延 P2 连续 7 Sprint 记录**：

| Sprint | 评审 commits | P1+P2 | 当 Sprint 修 P2 | 顺延 P2 |
|---|---|---|---|---|
| 12a | 2 | - | - | 0 |
| 13a | 2 | - | - | 0 |
| 14a | 3 | - | - | 0 |
| 15a | 2 | - | - | 0 |
| 16a | 2 | 3 | 3 | 0 |
| 17a | 5 | 3 | 3 | 0 |
| **18a** | **2** | **0** | **0** | **0** |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — A2 NC 真端点 phase 2（V0.1 倾向）+ 6 累计技术债（含 Codex 18a 4 P3）+ 6 决策点 + 连续 7 Sprint 0 顺延 P2 记录 |
