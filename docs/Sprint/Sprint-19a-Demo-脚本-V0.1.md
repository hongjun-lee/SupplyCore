# Sprint 19a Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19a 验收演示脚本
**配套：** [`Sprint-19a-任务卡-V0.2.md`](./Sprint-19a-任务卡-V0.2.md) + [`Sprint-19a-B1-12类审批模板设计-V0.2.md`](../详细设计/Sprint-19a-B1-12类审批模板设计-V0.2.md)

---

## 一、Sprint 19a 落地范围

按 V0.2 锁版（双轨 A2' + B），实际交付 **~3.4 PD**（B 副轨完整闭环 3.35 PD + Codex 18b 4 finding 提前消化 0.4 PD = ~3.75 PD；A2' 主轨全部顺延 19b 待 NC 端反馈）：

| Day | 交付 | commit | 执行者 |
|---|---|---|---|
| D0 | V0.1 → V0.2 锁版（cici 双轨 A2' + B）| `b8c2388` + `be17189` | a |
| **D1** | Codex 18b 2 P3 提前消化（Wave 91 LastModif 索引 + catch NRE LogDebug） | `e371f84` | a |
| **D1** | B1-1 12 类审批模板设计 V0.2（cici 一键采纳 9 决策点） | `0f96b75` | **b（子代理）** |
| **D1** | B1-2 DataSeed 13 模板（含 WF-REV-001 收编） | `bafdd1f` | **b（子代理）** |
| **D2** | B1-3 A-20 接入测试 39 个 + B2 NCalc 30 测试 + D9 节点 pass | `cb2acb7` | **b + c（双子代理）** |
| **D2-3** | B3 状态机 20 测试 + B4 chain_snapshot freeze 7 测试 | `bfb5308` | **b + c（双子代理）** |
| D7 | Demo 脚本 + Codex 19a 触发 | 本文档 | a |

**测试基线演进**：
- Sprint 18b 收尾（含 Codex 18b 修复）：1589 默认 + 60 Integration
- Sprint 19a Day 1 Codex 18b P3 消化：1589（无新测试，仅 schema/Logger 改动）
- Sprint 19a Day 1 B1-2：1622（+33 = 23 B1 守护 + 10 老 seed 适配）
- Sprint 19a Day 2 B1-3 + B2：1709（+87 = 39 接入 + 30 NCalc + 18 其他附加）
- **Sprint 19a Day 3 B3 + B4**：**1742**（+33 = 20 状态机 + 7 freeze + 6 其他）
- Domain 909 / Application 784 / EFCore 43 / Web 6

**A2' 顺延 Sprint 19b**：
- 强依赖 NC 端配合度评估 7 项反馈（Sprint 18a A1 评估清单 + Sprint 18b A2-1' 60 ⚠️ 占位稿已交付等反馈）
- 19a 期间 NC 端无反馈 → A2' 4 PD 全部顺延 19b
- 19b 主线 = A2' + Codex 19a 顺延（如有）

---

## 二、Demo 演示路径

### 路径 A：B1-2 13 审批模板 DataSeed（5 分钟）

1. **dev DB 跑 seed**：启动 DbMigrator → WorkflowTemplateDataSeedContributor 自动 seed 13 新模板（幂等）
2. **查 sy.workflow_template 表**：21 模板（8 旧 + 13 新含 WF-REV-001 收编）
3. **验证 chain JSON**：每个模板 ApprovalChain 字段是合法 JSON（`SELECT TemplateCode, ApprovalChain FROM sy.workflow_template WHERE TemplateCode LIKE 'WF-CON%'`）
4. **重启再 seed**：验证幂等（不会重复插入）

### 路径 B：A-20 接入 + chain_snapshot freeze（5 分钟）

跑 `Sprint19a_B1_ApprovalInstanceTemplates_Tests`（39 测试）：
- WF-CON-002 InitiateAsync → InProgress 实例创建
- chain_snapshot freeze（模板事后改 ApprovalChain 不影响已 freeze 实例）
- SENS-* DataSeed 校验

跑 `Sprint19a_B4_ChainSnapshotFreeze_Tests`（7 freeze 跨升版守护）：
- 模板 V1→V2 升版 V1 实例不漂
- 模板禁用后 InitiateAsync 抛 + 已 InProgress 可继续推进
- 模板物理删除后已 InProgress 仍可 ApproveNodeAsync / RejectAsync

### 路径 C：状态机 + NCalc 节点 pass（5 分钟）

跑 `Sprint19a_B3_ApprovalInstanceStateMachine_Tests`（20 状态机）：
- 多节点链路通过 → Approved
- 任一节点拒绝 → Rejected
- 发起人 Terminate → Terminated
- 终态不可变（Approved/Rejected/Terminated 各 3 操作 9 测试）

跑 `Sprint19a_B2_ApprovalConditionEvaluator_Tests`（30 NCalc + D9）：
- 14 条件表达式 × 2 场景 = 28 NCalc 测试
- D9 节点 pass 行为（条件不满足 → CurrentNodeSeq++ skip 到末尾 → Approved）

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 双轨 A2' + B | 部分 ✅ B 副轨完整闭环；**A2' 主轨全部顺延 19b** |
| 2. 累计技术债 | 全修 | ✅ #4/#5 Day 1 提前消化（commit `e371f84`）/ #2 OAuth2 Redis 顺延 19b（待 cici 决策）/ #1/#3 等 NC 端 |
| 3. 工时预算 | 12-16 PD 最大 / 8-11 PD 兜底 | **3.75 PD 实际**（B 3.35 + Codex 18b P3 0.4）远低于预算 — sweet spot 双轨提速 60%+ |
| 4. 子代理并行策略 | 主+1 子代理 sweet spot 2x | ✅ 实测双子代理 b+c 同窗口跑 4 轮（B1-1/B1-2/B1-3+B2/B3+B4） |
| 5. Codex 18b 评审 | 已完成 0 P1+2 P2 全修 | ✅ commit `ab710c1` + `e371f84` 连续 8 Sprint 0 顺延 P2 |
| 6. NC 端反馈窗口 | 19a 期间任意时段 | ❌ 19a 期间 NC 端无反馈 → A2' 顺延 19b |

### Sprint 19a 特殊性

**双子代理 sweet spot 2x → 4x 实测验证**：原 8-11 PD 预算 B 副轨实际仅 3.35 PD（提速 60%+）。关键提速因素：
- B1-2 DataSeed sed 批量（0.4 vs 0.9 预估 / 56% 提速）
- B1-3 接入测试 sed + Theory 复用（0.6 vs 2.2 / 73% 提速）
- B2 NCalc D9 复用现有 evaluator + DataSeed 已落（0.6 vs 2-2.5 / 75% 提速）
- B3 状态机 0 业务代码改动（0.7 vs 1.5 / 53% 提速）
- B4 freeze 方案 B 最小化（0.25 vs 0.3 / 17% 提速）

实际"sweet spot 双子代理 sweet spot 2x"加上"工作复用 / 模板批量"在结构化 Sprint（如审批模板 13 模板批量）可达 **2-4x 提速**。

---

## 四、Sprint 19b 候选方向（A2' 顺延 + 新增）

| 候选 | 范围 | 工时 |
|---|---|---|
| **A2'** | **NC 真端点 phase 2 主线（19a 顺延）— 待 NC 端反馈** | 4 PD |
| 候选 X1 | OAuth2 Token Redis 持久化缓存（17a 累计技术债 #2 顺延） | 0.5 PD |
| 候选 X2 | A2-1' 23 接口 schema 占位稿 NC 端反馈调整（NC-1-7 NCC OpenAPI 适配 / Sign 鉴权 / 三层包装等） | 1-2 PD |
| 候选 C | 详设 09 看板剩 5 类 + OLAP（不依赖 NC 端） | 8-10 PD |
| 候选 G | 详设 06 库存超储处置 + 暂估完整化（不依赖 NC 端） | 5-6 PD |

**V0.1 倾向**：双轨 A2' + C 或 A2' + G（避免 A2' 二次顺延 → 反模式）

---

## 五、Sprint 19a Codex 评审待触发

> 占位 — Sprint 19a 完成时 cici 触发 Codex 19a 评审

**评审重点**：
- B1-2 13 模板 chain_snapshot JSON 完整性（节点 / 角色 / 条件）
- B2 D9 节点 pass 行为（NCalc 异常视为命中是否安全 / 跳过逻辑边界）
- B3 状态机覆盖完备性（Cancelled/Withdrawn 是否有遗漏分支）
- B4 freeze 方案 B 最小化是否充分（vs 加 Version 字段 schema 升级）
- Codex 18b P3 提前消化（Wave 91 索引 + LogDebug）实际效果

**触发提示词**：
"评审 Sprint 19a 共 6 commits（`b8c2388`/`be17189` V0.2 / `e371f84` P3 / `0f96b75` B1-1 / `bafdd1f` B1-2 / `cb2acb7` B1-3+B2 / `bfb5308` B3+B4）— 重点关注 B 副轨 13 模板 chain_snapshot JSON 完整性 + D9 节点 pass NCalc 异常视为命中安全性 + freeze 方案 B 最小化与 Version schema 升级权衡"

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — B 副轨完整闭环 3.35 PD（提速 60%+）+ A2' 顺延 19b + 3 演示路径 + Codex 19a 触发提示 |
