# Sprint 18b Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-14
**文档性质：** 实施层 · Sprint 18b 验收演示脚本
**配套：** [`Sprint-18b-任务卡-V0.2.md`](./Sprint-18b-任务卡-V0.2.md) + [`Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md`](../详细设计/Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md)

---

## 一、Sprint 18b 落地范围

按 V0.2.1 锁版（主线 A2 NC 真端点 phase 2），实际交付 **~2.3 PD**（A2-1~A2-4 因 NC 端暂无法反馈顺延 Sprint 19a，仅 A2-1' 占位稿 + A2-5 Codex 修复落地）：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（cici 评审锁主线 A2）| `7fc0694` | a |
| **D1** | A2-5 Codex 18a 4 P3 修复（索引 Wave 90 / catch 异常处理 / LastModificationTime 窗口 / ValueKind 守卫） | `f4378ab` | a |
| **D1** | V0.2.1 范围调整记录（A2-1 → A2-1' + A2-2~4 顺延 19a） | `5ffa69e` | a |
| **D1** | A2-1' 23 NC 接口 JSON Schema 占位稿（基于详设 08 + Sprint 17a Mock；56 待确认 / 78 ⚠️ 埋点） | `a7a3c88` | **b（子代理）** |
| D7 | Demo 脚本 + Codex 18b 触发 | 本文档 | a |

**测试基线演进**：
- Sprint 18a 收尾：**1589**（默认）+ 10 Integration
- Sprint 18b Day 1 A2-5：**1589**（无新测试，仅修 4 P3）+ 3 新 P3-4 守护测试（Integration）+ A4 Test 3 适配
- Domain 876 / Application 674 / EFCore 33（默认）/ Web 6

**A2-2~A2-4 顺延 Sprint 19a**：强依赖 NC 端配合（OAuth2 token endpoint + 23 接口 schema 真值 + 业务码字典 + 测试环境 BaseUrl）。

---

## 二、Demo 演示路径

### 路径 A：A2-5 Codex 18a 4 P3 修复（10 分钟）

#### A.1 Wave 90 InterfaceTask CreationTime 索引（P3-1）
1. dev DB 跑 Wave 90 migration：`dotnet ef database update` → `CREATE INDEX ix_interface_task_creation_time`
2. EXPLAIN 跑 dashboard 24h 查询：`SELECT * FROM f.interface_task WHERE creation_time >= now() - interval '24h'`
3. 验证：原全表扫 → Index Scan on `ix_interface_task_creation_time`

#### A.2 InterfaceMonitorAppService catch 显式异常处理（P3-2）
1. 跑 `dotnet test FullyQualifiedName~Sprint17a_D5_NcHealthSnapshot`（4 守护全过 — mock 路径走 `NullReferenceException` 兜底）
2. 集成测试触发真 DB 异常 → Logger.LogWarning 留运维可观测性（不再静默吞）

#### A.3 LastSuccessfulCallAt 用 LastModificationTime 窗口（P3-3）
1. 数据准备：插 1 个 26h 前创建 + 5min 前 retry 成功的 InterfaceTask
2. GET `/api/supply-cores/interface-monitor/nc-health` → `LastSuccessfulCallAt` 应有值（不再被漏算）
3. 验证：修复前漏算（CreationTime > 24h）；修复后命中（LastModificationTime <= 24h）

#### A.4 ParseInvokeResponseAsync ValueKind 守卫（P3-4）
跑 3 新守护测试 `Sprint18b_A2_5_ValueKindGuard_Tests`：
- `code=5001 (int)` → 不抛 + NcResponseCode="5001" + Success=false 业务拒收
- `voucherNo=null` → 不抛 + NcVoucherNo=null
- `message=true (bool)` → 不抛 + NcResponseMessage="True"

修复前：NC 端误返 int code 抛 InvalidOperationException → F-08 errorCode 是 .NET 异常名 ❌
修复后：归一化字符串 → F-08 errorCode 是业务码 ✓

### 路径 B：A2-1' 23 接口 JSON Schema 占位稿（5 分钟）

打开 `Sprint-18b-NC接口JSON-Schema占位稿-V0.1.md`：
1. **§1 统一规约** — HTTP 头 / 响应 `{code,message,voucherNo,data}` / 11 项业务码字典
2. **§3 BIZ 范例** — BIZ-001 采购入库（5-15 业务字段 + lines[] 明细 + ⚠️ NC 端待确认问题）
3. **§5 NC 端待确认问题汇总** — 56 条 ID 化条目（通用 11 / MD 10 / BIZ 27 / CHK 8）
4. **§7 与 Sprint 17a/18b 实现对照表** — 验证占位稿与现实现一致

cici 用 §5 一次性向 NC 端勾选回复，加速 Sprint 19a 启动。

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | A2 NC 真端点 phase 2 | 部分 ✅ A2-5 完成 + A2-1' 占位稿；**A2-1/A2-2/A2-3/A2-4 顺延 19a** |
| 2. 6 累计技术债 | 全修 | ✅ A2-5 主线吸收 Codex 18a 4 P3（索引 / catch / LastModif / ValueKind）|
| 3. 工时预算 | 7-8 PD | **2.3 PD 实际**（A2-2~4 ~4 PD 顺延 19a 待 NC 端） |
| 4. 子代理策略 | 主+2 子代理 3.8x | 部分使用 — Day 1 子代理 b A2-1' 1 PD 单轨（主代理 A2-5 同窗口）|
| 5. Codex 18a 评审 | 已完成 0 P1 + 0 P2 全顺延 P3 | ✅ 4 P3 当 Sprint 修（A2-5）连续 7 Sprint 0 顺延 P2 |
| 6. 启动前置 | NC 端配合度 7 项至少 5 项 | ❌ NC 端暂无法反馈 → A2-1' 替代方案启动 |

### Sprint 18b 特殊性

Sprint 18b 是首个"主线大头顺延下 Sprint"的 Sprint（A2-2~4 占预算 ~50%）— 转入 A2-1' 替代项 + A2-5 技术债吸收，保证 Sprint 18b 不空过。Sprint 18b → 19a 主线连续性维持靠 A2-1' 占位稿 + Codex 18a P3 修复夯实基础。

---

## 四、Sprint 19a 候选方向（A2-2~4 顺延 + 新增）

| 候选 | 范围 | 工时 |
|---|---|---|
| **A2'** | **NC 真端点 phase 2 主线（18b 顺延）— 待 NC 端反馈完成** | 3-4 PD |
| B | 详设 10 剩 12 类审批模板 | 10-12 PD |
| C | 详设 09 看板剩 5 类 + OLAP | 8-10 PD |
| G | 详设 06 库存超储处置 + 暂估完整化 | 5-6 PD |

**V0.1 倾向**：双轨 A2' + B（或 C 或 G）— 若 NC 端 19a 仍无法反馈，B/C/G 单线推进保证 Sprint 19a 不空过。

---

## 五、Sprint 18b Codex 评审待触发

> 占位 — Sprint 18b 完成时 cici 触发 Codex 18b 评审

**评审重点**：
- A2-5 P3-4 ReadStringFlexible 边界（Object/Array 归一化是否影响 dashboard / 解析其他字段）
- A2-5 P3-3 OR 条件 SQL 性能（COALESCE / 索引利用率）
- A2-5 P3-2 NullReferenceException 显式 catch 与生产真异常的边界（是否会误吞）
- A2-1' 占位稿 78 ⚠️ 标记完整性（NC 端反馈后哪些可关闭、哪些需补充）

**触发提示词**：
"评审 Sprint 18b 共 4 commits（`7fc0694` V0.2 / `f4378ab` A2-5 / `5ffa69e` V0.2.1 / `a7a3c88` A2-1'）— 重点关注 A2-5 4 P3 修复边界（特别是 ReadStringFlexible Object/Array 归一化 + OR 条件 SQL 性能 + NullReferenceException catch 误吞）"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版 — A2-5 + A2-1' 落地 2.3 PD + A2-2~4 顺延 19a + 2 演示路径 + Codex 18b 触发提示 |
