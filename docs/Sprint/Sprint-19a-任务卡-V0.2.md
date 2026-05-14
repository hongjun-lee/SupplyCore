# Sprint 19a 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 评审锁定双轨 A2' + B）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19a 锁版任务卡
**配套：** [`Sprint-18b-Demo-脚本-V0.1.md`](./Sprint-18b-Demo-脚本-V0.1.md) §四 候选范围、Sprint-19a-V0.1（已锁定）

---

## 一、Sprint 19a 主线方向（锁版 · 双轨 A2' + B）

### 主轨 A2'：NC 真端点联调 phase 2（Sprint 18b 顺延 · 待 NC 端反馈）

| Task | 范围 | 工时 | 依赖 NC 端 |
|---|---|---|---|
| 19a-A2-1 | NC 端配合度评估完成确认（基于 18b A2-1' 占位稿 56 ⚠️ 条目逐项核对） | 0.5 PD | **强** |
| 19a-A2-2 | OAuth2 token endpoint 真接通 + 业务码字典升级 | 1 PD | **强** |
| 19a-A2-3 | 23 NC 接口 phase 1 实测（MD-001/004 + 4 BIZ + 5 CHK） | 2 PD | **强** |
| 19a-A2-4 | BIZ-005A 单接口灰度上线 + Health Snapshot 真值验证 | 0.5 PD | **强** |

**预算 A2'**：4 PD（全部强依赖 NC 端反馈）

### 副轨 B：详设 10 剩 12 类审批模板（不依赖 NC 端 · 主线兜底）

| Task | 范围 | 工时 |
|---|---|---|
| 19a-B1 | 12 类审批模板设计 + Sprint 13a A-20 框架扩展 | 4-5 PD |
| 19a-B2 | NCalc condition_expr 12 类全覆盖 | 2-3 PD |
| 19a-B3 | 工作流图 / 状态机守护测试 | 1-2 PD |
| 19a-B4 | chain_snapshot freeze + 升版兼容 | 1 PD |

**预算 B**：8-11 PD（独立可推进）

### 顺延候选（Sprint 19b+ 重新评估）

- 候选 C：详设 09 看板剩 5 类 + OLAP（8-10 PD）
- 候选 G：详设 06 库存超储处置 + 暂估完整化（5-6 PD）

---

## 二、双轨策略说明（V0.2 锁版）

**双轨执行节奏**：
- **主轨 A2'**：NC 端配合度评估完成（18a A1 已交付）反馈到位时启动；阻塞时 A2-1~A2-4 顺延 Sprint 19b
- **副轨 B**：独立推进 12 类审批模板（不依赖 NC 端）；B 是 Sprint 19a 不空过的"保底主线"

**避免 18b "主线大头顺延"重演**：
- Sprint 18b 首次"主线大头顺延"作为例外允许；19a 重演会变为反模式
- 双轨 B 提供主线兜底，确保 19a 至少落地 B 全部 8-11 PD
- 若 NC 端 19a 期间反馈到位，A2' 优先用子代理 b 推进（不阻塞主代理 a B 主线）
- 若 NC 端仍阻塞，A2' 全部顺延 19b，19a 实际范围 = B 单线 8-11 PD

---

## 三、累计技术债（Sprint 19a 必修，决策点 2）

### 3.1 Sprint 18b 后续技术债

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | A2-1/A2-2/A2-3/A2-4 Sprint 18b 顺延（待 NC 端） | 18b 顺延 | 4 PD（融入候选 A2'）| 等 NC 端 |
| 2 | OAuth2 Token Redis 持久化缓存（Sprint 17a 顺延） | 17a 顺延 | 0.5 PD | 待 19a |
| 3 | A2-1' 23 接口 schema 占位稿 NC 端反馈后调整 | 18b 起 | 0.5-1 PD（融入 A2-1）| 等 NC 端 |
| 4 | InterfaceTask LastModificationTime 索引 Wave 91（dashboard OR 窗口 BitmapOr 性能） | Codex 18b P3-3 | 0.2 PD | ✅ **已完成 commit `e371f84`** |
| 5 | InterfaceMonitorAppService catch(NRE) 加 LogDebug trace（脏数据可追溯） | Codex 18b P3-4 | 0.2 PD | ✅ **已完成 commit `e371f84`** |

### 3.2 Codex 18b 顺延（评审完成 · 0 顺延 P2）

Codex 18b 评审 4 commits 共 0 P1 + 2 P2 + 2 P3，2 P2 已在 commit `ab710c1` 当 Sprint 全修：
- P2-1 ReadStringFlexible Object/Array 数据截断风险（"INVALID_TYPE" 兜底守住列长度）
- P2-2 dashboard 时间窗口语义统一（4 endpoint OR 窗口对齐 GetNcHealthSnapshotAsync）

P3 2 项顺延 Sprint 19a：
- P3-3 OR 索引退化（last_modification_time 无索引；建议拓宽 CreationTime 窗口 -2h 让索引可用 / 或加双列索引）
- P3-4 catch(NRE){} 可能掩盖脏数据 NRE（建议 LogDebug trace 或 mock 检测条件化静默）

**0 顺延 P2** — Codex 0 顺延 P2 连续 **8 Sprint** 记录达成（12a/13a/14a/15a/16a/17a/18a/18b）。

**预估合计 ~0.3 PD**（仅 P3，可融入候选 B/C/G 旁路修）

---

## 四、锁版决策（V0.2）

| # | 决策点 | V0.2 锁版结论 |
|---|---|---|
| 1 | Sprint 19a 主线方向 | **双轨 A2' + B**（避免 18b "主线大头顺延"重演 + B 主线兜底）|
| 2 | 累计技术债 | **全修** — #4/#5 已完成（commit `e371f84` 提前消化）/ #2 OAuth2 Redis 0.5 PD 待 19a / #1/#3 等 NC 端 |
| 3 | 工时预算 | **B 主线 8-11 PD + A2' 4 PD（NC 反馈到位时启动）+ #2 0.5 PD = 12-16 PD 最大 / B 单线兜底 8-11 PD 最小** |
| 4 | 子代理并行策略 | **主代理 a B 主线 + 子代理 b A2'（NC 反馈触发）** sweet spot 2x |
| 5 | Codex 18b 评审 | 已完成 0 P1 + 2 P2 全修 + 2 P3 提前消化（commit `ab710c1` + `e371f84`）连续 8 Sprint 0 顺延 P2 |
| 6 | NC 端反馈窗口 | 19a 期间任意时段反馈到位即可触发 A2'；阻塞时 B 单线主线 |

---

## 五、Sprint 19a 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | NC 端 19a 仍无法反馈 → A2' 全顺延 19b | **极高** | 双轨策略 — 副线 B/C/G 保证 Sprint 19a 不空过；A2' 再顺延 19b 时不属于"首次例外"，需重新评估 V0.2 决策 |
| 2 | NC 端反馈不完整（如 OAuth2 endpoint 没颁发但 schema 部分到位）| 高 | A2-2 OAuth2 仍阻塞但 A2-1 schema 调整 + A2-3 部分接口可启动；按可执行度分级推进 |
| 3 | 双轨 sweet spot 2x 实际 1.5x（首次双轨实测）| 中 | 子代理 b 跑 B/C/G 都是成熟范围，工作量 5-10 PD 划分易并行 |
| 4 | A2-1' 占位稿 78 ⚠️ NC 端反馈后大改 | 中 | 占位稿与 Sprint 17a Mock 严格对齐 + Codex 15a/18a 行为基线推断，预计 NC 反馈调整 < 30% |

---

## 六、Codex 18b Finding 附录（评审完成 · 0 顺延 P2 连续 8 Sprint）

| Sprint 18b Commits | 已评 | P1 | P2 | P3 | 当 Sprint 修 P2 | 顺延 19a |
|---|---|---|---|---|---|---|
| `f4378ab` A2-5 Codex 18a 4 P3 全修 | Y | 0 | 2（ReadStringFlexible 截断 + dashboard 窗口不一致）| 2（OR 索引退化 + NRE 静默吞）| 2 | 2 P3 |
| `7fc0694` / `5ffa69e` / `a7a3c88` docs commits | Y | 0 | 0 | 0 | - | - |
| **合计** | 4 | **0** | **2** | **2** | **2** | **2 P3** |

**修复 commit**：`ab710c1` "Sprint 18b Codex 18b 评审修复（0 P1 + 2 P2 全修 0 顺延，连续 8 Sprint）"

**2 P3 顺延清单**（融入 §三.1 累计技术债）：

| P3 # | finding | 顺延项 | 工时 |
|---|---|---|---|
| P3-3 | `Add_InterfaceTask_CreationTime_Index_Wave90.cs` — OR 索引退化（last_modification_time 无索引）| 加 LastModificationTime 索引 OR 改 CreationTime -2h 窗口拓宽 | 0.2 PD |
| P3-4 | `InterfaceMonitorAppService.cs:360` — catch(NRE){} 可能掩盖脏数据 NRE | LogDebug trace + 测试 mock 改用空集而非 null Task | 0.2 PD |

**Codex 0 顺延 P2 连续 8 Sprint 记录**：

| Sprint | 评审 commits | P1+P2 | 当 Sprint 修 P2 | 顺延 P2 |
|---|---|---|---|---|
| 12a | 2 | - | - | 0 |
| 13a | 2 | - | - | 0 |
| 14a | 3 | - | - | 0 |
| 15a | 2 | - | - | 0 |
| 16a | 2 | 3 | 3 | 0 |
| 17a | 5 | 3 | 3 | 0 |
| 18a | 2 | 0 | 0 | 0 |
| **18b** | **4** | **2** | **2** | **0** |

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-14 | 初版草案 — 双轨 A2' + B/C/G 策略（避免首次"主线大头顺延"重演）+ 3 累计技术债 + 6 决策点 + 4 风险（NC 端反馈仍极高风险）|
| V0.1.1 | 2026-05-15 | Codex 18b 评审完成补 §三.2 + §六附录（0 P1 + 2 P2 全修 + 2 P3 顺延 19a，连续 **8 Sprint** 0 顺延 P2 记录）|
| V0.1.2 | 2026-05-15 | Sprint 19a 预热 — Codex 18b 2 P3 提前消化（commit `e371f84`）：累计技术债 #4 Wave 91 LastModificationTime 索引 / #5 catch(NRE) LogDebug trace 已完成；§三.1 状态回填 |
| **V0.2** | **2026-05-15** | **cici 评审锁版双轨 A2' + B；避免 18b "主线大头顺延"重演；B 主线兜底 8-11 PD + A2' NC 端反馈触发 4 PD；主代理 a B 主线 + 子代理 b A2' sweet spot 2x；§一/§二/§四 加锁版决策结构** |
