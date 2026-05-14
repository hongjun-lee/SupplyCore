# Sprint 19b 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 选 A 双轨 UI MVP + A2' / 模块化 frontend）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19b 锁版任务卡
**配套：** [`Sprint-19a-Demo-脚本-V0.1.md`](./Sprint-19a-Demo-脚本-V0.1.md) §四 候选范围、Sprint-19b-V0.1（已锁定）、52 HTML 原型 `../../prototype/`

---

## 一、Sprint 19b 主线方向（锁版 · 双轨 UI MVP + A2'）

### 主轨 UI MVP：5-8 核心页面（基于 52 HTML 原型 + Catio React 19 + DevExtreme 25）

cici 2026-05-15 关键决策（plan `melodic-doodling-wirth.md`）：
- 基于 SupplyCore/prototype/ 已有 **52 HTML 原型**（覆盖采购/库存/合同付款/接口/报表/审批 全域）
- 复用 Catio nova.platform/frontend/ 模块化 React 架构
- **模块化要求**：前端必须放 `modules/nova.supplycores/frontend/`（与 src/ 同级），**不能**起在 Host (`src/SupplyCores.Web/`) 中

| Task | 范围 | 工时 |
|---|---|---|
| 19b-UI-D0 | Sprint V0.2 锁版（本文档） | 0.3 PD |
| 19b-UI-D1 | 模块化 frontend 骨架 + Health Snapshot 联调（NcHealthSnapshotDto 渲染） | 0.5-1 PD |
| 19b-UI-D2-5 | 5-8 MVP 页面（approval-center / inventory / purchase-orders / reports / nc-interface / material-master + 可选 contract-list / dashboard-bigscreen） | 3-4 PD |
| 19b-UI-D6 | 全量页面 API 联调 + cross-org RBAC + 少量 E2E 测试 | 0.5-1 PD |
| 19b-UI-D7 | Demo 脚本 + 收尾 | 0.5 PD |

**预算 UI MVP**：5-7 PD（5 必选页面 + 1-3 可选）

### 副轨 A2'：NC 真端点联调 phase 2（Sprint 19a 顺延 · 待 NC 端反馈）

| Task | 范围 | 工时 | 依赖 NC 端 |
|---|---|---|---|
| 19b-A2-1 | NC 端配合度评估完成确认（基于 18b A2-1' V0.1.1 占位稿 60 ⚠️ 条目 + NC-1-1~7 NCC OpenAPI 关键差异确认） | 0.5 PD | **强** |
| 19b-A2-2 | OAuth2 token endpoint 真接通（确认非 OAuth2 时改 NcSignTokenService）+ 业务码字典升级 | 1-1.5 PD | **强** |
| 19b-A2-3 | 23 NC 接口 phase 1 实测（MD-001/004 + 4 BIZ + 5 CHK） | 2 PD | **强** |
| 19b-A2-4 | BIZ-005A 单接口灰度上线 + Health Snapshot 真值验证 | 0.5 PD | **强** |

**预算 A2'**：4-4.5 PD（强依赖 NC 端反馈）

### 累计技术债 X1：OAuth2 Token Redis 持久化缓存（Sprint 17a 顺延）

| Task | 范围 | 工时 |
|---|---|---|
| 19b-X1 | NcOAuth2TokenService 加 IDistributedCache 抽象 + Redis 配置 + InMemory fallback + 测试 | 0.5 PD |

### 累计技术债 X2：A2-1' 占位稿 NC 端反馈调整（NC-1-7 NCC OpenAPI 适配）

| Task | 范围 | 工时 |
|---|---|---|
| 19b-X2-1 | 若 NC 端用 Sign 鉴权 → 实现 NcSignTokenService（HMAC + timestamp） | 0.5 PD |
| 19b-X2-2 | 若 NC 端走 OpenAPI Gateway → NccOpenApiAdapter 三层包装层 + state→ncCode 转换 | 1 PD |
| 19b-X2-3 | F-12 NcAccountRule pk_accasoa UUID 转换层（如 NC 端要 UUID 而非编码） | 0.5 PD |

**预算 X1+X2**：1.5-3 PD（部分条件触发）

### 顺延候选（Sprint 19c+ 重新评估）

- 候选 C：详设 09 看板剩 5 类 + OLAP（7-10 PD 独立 — 与 reports.html 联动）
- 候选 G：详设 06 库存超储处置 + 暂估完整化（5-6 PD 独立）

---

## 二、双轨策略说明（V0.2 锁版）

**双轨执行节奏**：
- **主代理 a**：UI MVP 主轨（19b-UI-D0~D7 完整链路）
- **子代理 b**：A2' 副轨（NC 反馈到位时启动 A2-1~A2-4；阻塞时机会主义跑 X1 OAuth2 Redis 0.5 PD）
- **子代理 c**：累计技术债（X2 NC 反馈触发 / WF-MDT/RPT 节点重评）/ Day 6 联调测试辅助

**模块化 frontend 关键约束**（cici 反馈）：
- ❌ **不能**建在 `src/SupplyCores.Web/clientapp/`（Host 中）
- ❌ **不能**建在 `modules/nova.supplycores/src/Nova.SupplyCores.Web/clientapp/`（Web 项目内）
- ✅ **必须**建在 `modules/nova.supplycores/frontend/`（模块内 frontend/ 与 src/ 同级，参考 Catio 5 模块统一模式）

理由：Nova Satellite Module Pattern + ABP Host 仅 Razor Pages 壳 + 与 Catio 5 模块（platform/kaoqin/workflow/hrx/weightaudit）一致。

**避免 A2' 二次顺延反模式**：
- A2' 副轨保留 — 子代理 b 在 NC 反馈到位时立即推进
- 即使 19b 期间 NC 端仍无反馈，子代理 b 跑 X1 OAuth2 Redis 兜底；A2' 真正顺延 19c 也不属于反模式（首先 19a 已是顺延，19b 转 UI MVP 主轨非 A2' 二次顺延语义 — 19b 主线已变更为 UI MVP）

---

## 三、累计技术债（Sprint 19b 必修，决策点 2）

### 3.1 Sprint 19a 后续技术债

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | A2-1/A2-2/A2-3/A2-4 Sprint 19a 顺延（待 NC 端） | 19a 顺延 | 4 PD（融入候选 A2'）| 等 NC 端 |
| 2 | OAuth2 Token Redis 持久化缓存（17a 顺延 + 19a 顺延） | 17a/19a 顺延 | 0.5 PD（融入候选 X1）| 待 19b |
| 3 | A2-1' 23 接口 schema 占位稿 NC 端反馈后调整 | 18b 起 | 1-2 PD（融入候选 X2）| 等 NC 端 |
| 4 | WF-MDT-001 / WF-RPT-001 模板新增节点（B1-1 V0.2 决策点 6/7 限制：MDT-001 仅变更走 WF；RPT-001 不叠加业务会签 — 若 cici 实际场景需要补） | 19a B1 | 0.3 PD | 19b 重评 |

### 3.2 Codex 19a 顺延（待评审后补 §六附录）

> 占位 — Codex 19a 评审完成后从顺延清单挑选补到本节。

**预估合计 ~1-2 PD**（占位等评审后修订）

---

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19b 主线方向 | **双轨 A2' + C 或 A2' + G**（不允许 A2' 二次顺延 + 单线 19b 反模式）|
| 2 | 4 累计技术债哪些必修 | **全修** ~5-7 PD（A2' 主线 / X1 副 / X2 副 / WF-MDT/RPT 节点重评） |
| 3 | 工时预算 | **A2' 4 + C/G 5-10 + 技术债 1-2 + 缓冲 = 12-18 PD（C 双轨）/ 9-13 PD（G 双轨）** |
| 4 | 子代理并行策略 | 主+1 子代理 sweet spot 2x（19a 实测 4x 含模板批量），首选副轨 C/G + A2' 子代理 |
| 5 | Codex 19a 评审 | Sprint 19a 收尾后 cici 触发（Demo 脚本 `55f86f4` 已就绪）|
| 6 | NC 端反馈窗口 | 19b 启动前 cici 给出 NC 端反馈时间线（无反馈 → A2' 强行二次顺延 = 反模式触发）|

---

## 五、Sprint 19b 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 端 19b 仍无反馈 → A2' 二次顺延（反模式） | **极高** | cici 19b 启动前必须明确 NC 端反馈窗口；阻塞时立即撤 A2' 转单线 C/G 主线 |
| 2 | NC 端反馈与 NCC OpenAPI 公开资料偏差大（Gateway / Sign / pk_accasoa 完全不匹配） | 高 | X2 候选预留 1-2 PD 适配工作量；NCC OpenAPI 资料仅作参考非真值 |
| 3 | C 看板 OLAP 性能基线无 dev 数据量 | 中 | 用 mock 大数据集 / fixture 数据生成器辅助 baseline |
| 4 | G 库存超储 +10 PD 详设 06 V1.1 超 19b 预算 | 中 | G 仅做 5-6 PD 核心，剩余顺延 19c |

---

## 六、Codex 19a 评审待触发（已就绪）

Sprint 19a Demo 脚本 §五 已写就触发提示词：

> "评审 Sprint 19a 共 6 commits（`b8c2388`/`be17189` V0.2 / `e371f84` P3 / `0f96b75` B1-1 / `bafdd1f` B1-2 / `cb2acb7` B1-3+B2 / `bfb5308` B3+B4）— 重点关注 B 副轨 13 模板 chain_snapshot JSON 完整性 + D9 节点 pass NCalc 异常视为命中安全性 + freeze 方案 B 最小化与 Version schema 升级权衡"

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双轨 A2' + C/G 策略（A2' 二次顺延反模式触发）+ 4 累计技术债 + 6 决策点 + 4 风险（NC 端反馈仍极高风险）|
| **V0.2** | **2026-05-15** | **cici 选 A 双轨 UI MVP + A2'**（plan `melodic-doodling-wirth.md`）：基于 52 HTML 原型 + 61 Controller + Catio React 19 三重就绪；模块化 `modules/nova.supplycores/frontend/`（不在 Host 中）；UI MVP 5-8 页面 5-7 PD + A2' 4 PD（NC 反馈触发）+ X1 0.5 PD = 8-10 PD；§一/§二/§四 双轨结构 + 模块化决策 |
