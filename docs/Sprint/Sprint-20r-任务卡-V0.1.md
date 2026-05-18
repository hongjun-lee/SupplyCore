# Sprint 20r 任务卡 V0.1（2026-05-19 main 整夜跑预先起草 / 占位 / 业务方反馈陆续返回后第 2 sprint / R-12+R-13 + 第 6 批模块启动）

**Sprint**：20r（占位 / **启动条件**：Sprint 20q D5 满 + cici 第 6 批 5 候选评分拍板 + Codex Round 17 finding ≤ 10 / 预计 2026-05-26 启动 / 第 4 周期 5 Sprint 第 3 阶段）
**主题**：业务方反馈第 2 轮整合 + R-12+R-13 启动 + 第 6 批模块（5 候选评分）P0 启动 + Codex Round 17 立修
**节奏**：roadmap V0.1 §2.3 占位「审批 + NC 真联调启动」/ V0.1 占位修正为「业务方反馈陆续返回后第 2 sprint + R-12+R-13 + 第 6 批模块开局」/ 工作量 ~0.8 PD main + ~0.5 PD second（共 ~1.3 PD / wall-clock 2-3 天）
**性质**：**业务方反馈整合 + 新模块开局 sprint**（vs Sprint 20q 协调 + 验证 sprint / vs Sprint 20l-20m 数据治理开发 sprint）
**V0.1 起草要点**（main a 整夜跑 / 预先占位）：
- Sprint 20q 业务方反馈陆续返回（5/9 → 8/9 → 9/9 渐进式）/ Sprint 20r 主线整合业务方反馈第 2 轮 + 启动 R-12+R-13
- 第 6 批模块 P0 候选（cici 拍板 N-Q2 设备管理 / Sprint 20q T-A1 预 audit 输出 production ready 度评分 / Sprint 20r 启动 P0 候选 backend skeleton）
- Codex Round 17（Sprint 20p 之后累计 / 预计 finding 数 ≤ 10）/ 立修 + 复测
- second e 副轨：第 6 批模块前端 skeleton（与 main T-A2 配对 / 第 15 次连续）+ 库存试点反馈优化前端（R-12+R-13 配对）

---

## 一、基本信息

| 维度 | 内容 |
|---|---|
| **启动日期** | Sprint 20q D5 满后 ~ 2026-05-26（占位 / 触发条件满足后 cici 拍板）|
| **wall-clock 估算** | 2-3 天（main 主轨 1.5-2 天 + 业务方反馈陆续到位持续 wall-clock）|
| **main 主轨 PD** | ~0.8 PD（T-A1-A4 / 整合 + R-12+R-13 + 第 6 批 + Codex）|
| **second 副轨 PD** | ~0.5 PD（T-E1-E2 / 第 6 批前端 + 库存试点优化）|
| **总 PD** | ~1.3 PD |
| **顺延目标** | 46 Sprint 0 顺延（Sprint 20q 45 之后续）|
| **触发条件状态** | ⏳ pending（Sprint 20q D5 满 / cici 第 6 批拍板 / Codex Round 17 finding ≤ 10）|

---

## 二、Day 1-2 task 占位

### A 主轨（main 主代理 / 共 4 task / ~0.8 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 业务方反馈第 2 轮整合 | 0.2 | P0 | main 主代理 a | Sprint 20q 业务方反馈陆续返回（5/9 → 8/9 → 9/9 渐进式 / 试点单位库存 + 采购 + 合同 demo 反馈 + 凭证导出 + 数据治理 + 设备 audit）/ 整合到代码：① 反馈分类（UI / 业务规则 / 数据 / 性能 / 文案）② 立修 priority 排序 ③ 反馈 → commit 映射表 ④ 业务方反馈跟踪表更新 / 写到 `docs/internal/sprint-20r-feedback-batch2-integration.md` | Sprint 20q 业务方反馈 ≥ 5/9 到位 | 整合报告 ≥ 80 行 / 含分类 + 优先级 + 反馈→commit 映射 + 跟踪表更新 |
| **T-A2** 第 6 批模块 P0 候选 backend skeleton | 0.3 | P0 | main 主代理 a + cici 拍板 | cici 拍板 N-Q2 第 6 批主推 A 设备管理 / Sprint 20q T-A1 预 audit 输出 production ready 度评分 / Sprint 20r：① P0 候选模块 Domain entity skeleton（如设备管理 Equipment + EquipmentStates + EquipmentManager）② Application AppService skeleton（GetAsync / GetListAsync / CreateAsync / 状态机方法预留）③ Contracts DTO + IEquipmentAppService skeleton ④ HttpApi Controller skeleton + Route ⑤ EF migration skeleton + DbContext 注册 / 写到 `docs/internal/sprint-20r-batch6-p0-skeleton.md` | Sprint 20q T-A1 设备 audit 报告 + cici 第 6 批 5 候选评分拍板 | skeleton 完整度报告 ≥ 100 行 / 含 entity + Manager + AppService + Controller + migration skeleton |
| **T-A3** Codex Round 17 立修 + 复测 | 0.2 | P0 | main 主代理 a | Sprint 20p 之后累计 Codex Round 17（预计 finding ≤ 10 / 含 Sprint 20q 收尾 round）/ ① finding 分类（false positive / 立修 / 顺延）② 立修 commit + 测试 ③ 复测 round 0 finding 收敛 / 写到 commit message + memory | Codex Round 17 启动 + finding 数 ≤ 10 | Codex Round 17 0 finding 收敛 / 立修全 commit / memory 升级 |
| **T-A4** memory + audit + Sprint 20s V0.1 起草 | 0.1 | P0 | main 主代理 a | ① memory 升级（46 Sprint 0 顺延 + Sprint 20r 业务方反馈整合 + R-12+R-13 + 第 6 批开局完整闭环）② audit V0.x 升版 ③ Sprint 20s V0.1 起草（占位 / NC 真联调主推 + 审批闭环 / 预计 ~2.0 PD）/ 不 git add / 不 commit / main 收口 | Sprint 20r T-A1-A3 全 commit 完成 | memory commit / audit V0.x 锁版 / Sprint 20s V0.1 起草占位完成 |

**main 主轨总：~0.8 PD**

### E 副轨（second 主代理 e / 第 15 次连续 / 共 2 task / ~0.5 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** 第 6 批模块 P0 候选前端 skeleton（与 main T-A2 配对）| 0.3 | pending | 复用 DevExtreme DataGrid + Detail 模板 / 接通 T-A2 Controller endpoint / 实施 list + detail + form skeleton（壳级别 / 业务方 walk-through 预留）/ 与 Sprint 20q T-E1 contract page 模式一致 |
| **T-E2** 库存试点反馈优化前端（R-12+R-13 配对）| 0.2 | pending | R-12 / R-13 业务方反馈第 2 轮整合（UI 优化 / 业务规则细节 / 文案）/ 库存 4 单据 page polish / 与 main T-A1 反馈整合配对 |

**second e 总：~0.5 PD**（第 15 次连续 / 累计模块切换：Reports → Dashboards → data-issue-log → data-import-template → orgs-users-pilot → contract → 第 6 批）

### D 顺延说明

- ~~D 线 NC/财务接口真联调~~：**继续顺延 Sprint 20s+（第 4 周期第 2 阶段主推 / cici N-Q4 拍板「仅 G-12 业务方推进即启」）**
- ~~T-B1-B5 Sprint 20n-20q part 2 协调试点反馈~~：**持续 wall-clock 到位 / 不阻塞 Sprint 20r / 与 T-A1 反馈整合配套**

---

## 三、R-12+R-13 占位

### 3.1 R-12 占位（待 Sprint 20q D5 后 cici 拍板具体内容）

| 维度 | 占位描述 |
|---|---|
| **来源** | Sprint 20q 业务方反馈第 2 轮归纳出的核心需求项（具体待 cici Sprint 20q D5 拍板）|
| **预估 PD** | ~0.2 PD（含在 T-A1 整合 task）|
| **占位假设** | 可能涉及：库存盘点细化 / 合同审批字段补强 / 采购单业务规则细节（待业务方反馈具体）|
| **触发条件** | Sprint 20q 业务方反馈 ≥ 8/9 到位 + cici 拍板 R-12 具体内容 |

### 3.2 R-13 占位（待 Sprint 20q D5 后 cici 拍板具体内容）

| 维度 | 占位描述 |
|---|---|
| **来源** | 同 R-12（业务方反馈第 2 轮归纳）|
| **预估 PD** | ~0.2 PD（含在 T-A1 整合 task）|
| **占位假设** | 可能涉及：跨模块关联补强 / 凭证导出格式细节 / 数据治理 handler 补强（待业务方反馈具体）|
| **触发条件** | Sprint 20q 业务方反馈 ≥ 8/9 到位 + cici 拍板 R-13 具体内容 |

**注**：R-12+R-13 具体内容由 Sprint 20q D5 业务方反馈第 2 轮归纳后 cici 拍板 / Sprint 20r V0.2 时填充具体 task 描述。

---

## 四、业务方反馈第 2 轮（5/9 → 8/9 → 9/9 持续）

### 4.1 反馈到位节奏占位

| 反馈批次 | 到位时间窗 | 状态 | 主要内容占位 |
|---|---|---|---|
| **第 1 批** | Sprint 20q D2-D3 | ⏳ pending | 库存试点（Sprint 20n 4 单据 endpoint）+ 数据治理（Sprint 20l-20m 6 handler）反馈 |
| **第 2 批** | Sprint 20q D3-D5 | ⏳ pending | 采购试点（Sprint 20p ProcurementDocument）+ 凭证导出反馈 |
| **第 3 批** | Sprint 20q D5 - Sprint 20r D1 | ⏳ pending | 合同试点（Sprint 20q Contracts）+ 设备 audit 反馈 |

### 4.2 反馈整合工作流（T-A1 主要工作）

1. 反馈收集 → 业务方反馈跟踪表更新（沿用 Sprint 19q PO 协调模板）
2. 反馈分类（UI / 业务规则 / 数据 / 性能 / 文案）→ priority 排序
3. 立修 → commit + 测试 + 业务方确认
4. 顺延 → Sprint 20s+ 任务卡占位
5. 反馈 → commit 映射表（透明度保留）

### 4.3 反馈到位阈值

| 阈值 | 行动 |
|---|---|
| **5/9 到位** | T-A1 整合启动（最低启动门槛）|
| **8/9 到位** | R-12+R-13 cici 拍板 + Sprint 20r 正式启动（Day 1）|
| **9/9 到位** | Sprint 20r 完整 task 清单锁定 / V0.1 → V0.2 升版 |

---

## 五、触发条件

### 5.1 启动触发条件（必须全部满足）

| 条件 | 状态 | 验证方式 |
|---|---|---|
| **C-1** Sprint 20q D5 满 | ⏳ pending | Sprint 20q V0.x 真正收口 + 45 Sprint 0 顺延达成 |
| **C-2** cici 第 6 批 5 候选评分拍板 | ⏳ pending | Sprint 20q T-A1 设备 audit 报告输出 + cici 拍板第 6 批主推模块（已 N-Q2 拍板设备管理 / 5 候选评分 sprint 20q D4-D5 cici 拍板）|
| **C-3** Codex Round 17 finding ≤ 10 | ⏳ pending | Sprint 20p 之后累计 Codex Round 17 启动 + finding 数 ≤ 10 |
| **C-4** Sprint 20q 业务方反馈 ≥ 5/9 到位 | ⏳ pending | 业务方反馈跟踪表 ≥ 5/9 标 done |

### 5.2 触发条件未满时的回退方案

| 未满条件 | 回退方案 |
|---|---|
| C-1 未满（Sprint 20q 延误） | Sprint 20r 启动延后 / 不强行紧续 / 沿用 Sprint 20q V0.2 Q1 B「间隔 1-2 天」节奏 |
| C-2 未满（cici 第 6 批拍板未到位） | T-A2 P0 候选 backend skeleton 顺延 / Sprint 20r 工作量降至 ~0.6 PD（仅 T-A1+T-A3+T-A4）|
| C-3 未满（Codex finding 数过多） | T-A3 工作量提升 / R-12+R-13 顺延 Sprint 20s |
| C-4 未满（反馈 < 5/9） | T-A1 整合延后 / Sprint 20r 工作量降至 ~0.5 PD（仅 T-A2+T-A3+T-A4） |

---

## 六、沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.1** | **2026-05-19** | **main 整夜跑预先起草占位**：① Sprint 20r 占位（业务方反馈陆续返回后第 2 sprint / R-12+R-13 + 第 6 批模块启动 / 第 4 周期第 3 阶段）② 4 main task 占位（T-A1 反馈整合 / T-A2 第 6 批 P0 backend skeleton / T-A3 Codex Round 17 / T-A4 memory + Sprint 20s V0.1 起草 / ~0.8 PD）③ 2 second task 占位（T-E1 第 6 批前端 / T-E2 库存试点优化 / ~0.5 PD / 第 15 次连续）④ R-12+R-13 占位（待 Sprint 20q D5 后 cici 拍板具体内容）⑤ 业务方反馈第 2 轮 5/9 → 8/9 → 9/9 渐进式 ⑥ 触发条件 4 项（C-1 Sprint 20q D5 满 / C-2 cici 第 6 批拍板 / C-3 Codex Round 17 finding ≤ 10 / C-4 反馈 ≥ 5/9）/ 触发条件未满回退方案 / 预计 2026-05-26 启动（Sprint 20q D5 后 ~ 2-3 天）/ 占位待 Sprint 20q 真正收口后 V0.2 cici 拍板升版 |

---

**Created**: 2026-05-19 / main 整夜跑预先起草占位 / **不 git add / 不 commit / main 收口** / 待 Sprint 20q 真正收口后 V0.2 cici 拍板升版 / main 主代理 a

**Related**:
- [`Sprint-20q-任务卡-V0.3.md`](Sprint-20q-任务卡-V0.3.md)（同 cycle 前序 / 协调 + 验证 sprint / cici 20 拍板应用 / Sprint 20r 紧续）
- [`Sprint-20p-任务卡-V0.3.md`](Sprint-20p-任务卡-V0.3.md)（同 cycle 上游 / 协调 sprint 模板 / Sprint 20p Day 1 done）
- [`../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md`](../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md) V0.x（第 4 周期 roadmap / Sprint 20r §2.3 占位）
- [`../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md`](../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md) V0.1（第 3 批准入评估 / Sprint 20r 第 6 批模块 P0 候选参考模板）
- [[feedback_codex_0_carryover_8_sprint_record]]（44 Sprint 0 顺延记录 / Sprint 20r 目标维持 46 Sprint）
- [[main_orchestrator_default_spawn]]（main 编排者新规则 / Sprint 20r T-A1+T-A2 可并行 spawn）
- [[carryover_task_verify_first]]（顺延 task D1 必先 grep / Sprint 20r T-A2 第 6 批 P0 backend skeleton 前必 grep 设备模块在仓度）
- [[feedback_business_party_coordination_failure]]（5 月反模式根因 #1 cici 单点保留 / Sprint 20r T-A1 反馈整合工作流 = 缓解协调负载）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 / 第 4 周期业务模块扩大 / Sprint 20r 第 6 批模块开局）
- [[feedback_main_overnight_validation_pattern]]（main 整夜跑模式 / Sprint 20r V0.1 起草属于此模式 / 2026-05-19 整夜跑预先起草占位）
