# Sprint 20ah 任务卡 V0.1（2026-05-19 D2 long-time Wave 8 / 35+ 单位推广 + 性能 V6 sprint ✨ / 第 7 周期 D4 / 67 Sprint 0 顺延 ✨）

**Sprint**：20ah（**35+ 单位推广深化 sprint** ✨ / 接续 Sprint 20ag 第 7 周期 D3 / **67 Sprint 0 顺延** ✨ / **性能 V6 首验 sprint** ✨ / **多租户深化首验 sprint** ✨ / **跨集团 V3 准备首验 sprint** ✨）
**主题**：**35+ 单位推广 + 反馈整合 + 性能 V6 P95 < 200ms + 多租户深化 isolation 验证 + 缓存 V3 + 分区 V2 + 跨集团 V3 准备 + AI 6 角色协作稳态 + 67 Sprint 0 顺延**
**节奏**：main V0.11 §4 已起草对应 main 任务 1.0 PD / 5 task 推广性 + 性能性 / second V0.x 续接（V0.x+ 待起草）/ 工作量 ~1.0 PD 主线 + 0.5 PD second + AI 6 角色协作稳态 0.3 PD / wall-clock 5-7 天
**性质**：**35+ 单位推广深化 sprint + 性能 V6 首验 sprint + 多租户深化首验 sprint + 跨集团 V3 准备首验 sprint**（四重深化性质 sprint）

**V0.1 起草要点**（main long-time Wave 8 / 2026-05-19 D2 today / 35+ 推广 + 性能 V6 节奏 / 多租户深化 isolation 首验 / 跨集团 V3 准备首验 / AI 6 角色协作稳态 / Codex 累计 ~150+ finding 22 次 0 收敛节奏 / 第 7 周期 D4 推进）：

- **35+ 单位推广深化 ✨**：30+ → 35+ 升级 / 10 新单位 / 跨集团组合推广 / 上线培训 + 落地支持 + 反馈机制（周报 + 月度回顾）
- **性能 V6 ✨**：P95 < 200ms / 缓存 V3 + 分区 V2 / 大数据量 grid V6 frontend 适配
- **多租户深化 ✨**：isolation 验证 / 跨租户数据隔离 ≥ 99.9% / 性能影响 ≤ 5%
- **跨集团 V3 准备 ✨**：V2 → V3 路径 design / schema 演进准备 / 多协议占位 / Sprint 20ai 真起 ready
- **67 Sprint 0 顺延**：66（Sprint 20ag 收尾）→ 67（Sprint 20ah 收尾）

---

## §1 基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2027-05 初（Sprint 20ag D5+ 后 / 第 7 周期 D4 / 35+ 推广深化首推时机）|
| main 主线工作量 | ~1.0 PD（5 task / T-A1-A5 / 35+ 推广 + 性能 V6 + 多租户深化 + 跨集团 V3 准备 + Codex Round 35 + 67 顺延收尾）|
| second 副线工作量 | ~0.5 PD（1 task / T-E1 / 35+ 单位 frontend 适配 + 大数据量 grid V6 + 多租户切换 UI）|
| **AI 6 角色工作量** | **协作稳态 0.3 PD** ✨（Wave 1 2 角色 + Wave 2 3 角色 + main 编排 = 6 协作 / 累计 5+ 月投产稳定 / 本 sprint 6 角色协作稳态运行）|
| **AI Wave 1 工作量** | **稳定投产** ✨（memory 沉淀员 + 跨系统集成员 / 累计 6+ 月投产 / Wave 1 完全自动化）|
| **AI Wave 2 工作量** | **稳定投产** ✨（PM + 决策模板员 + 升版员 / Sprint 20ad Day 30 验收 done / 累计 2+ 月稳定投产）|
| wall-clock | 5-7 天（Day 1 35+ 推广主线 / Day 2 性能 V6 P95 < 200ms 实测 / Day 3 多租户深化 isolation 验证 / Day 4 跨集团 V3 准备 + Codex Round 35 / Day 5-7 67 顺延收尾 + Sprint 20ai V0.1 起草）|
| Sprint 性质 | **35+ 单位推广深化 + 性能 V6 首验 + 多租户深化首验 + 跨集团 V3 准备首验**（四重深化性质 sprint）|
| 前置 Sprint | Sprint 20ag D5 满 + 第 7 周期 D3 done + 66 Sprint 0 顺延 + 平台化 V1.5 ready + 30+ 推广 ≥ 80% + AI 6 角色协作矩阵首验 done |
| 后续 Sprint | Sprint 20ai（第 7 周期 D5 / 68+ 顺延目标 + 跨集团 V3 backend 真起 + 大客户深化）|
| Sprint 顺延目标 | **67 Sprint 0 顺延 ✨ + 35+ 单位推广深化 done ✨ + 性能 V6 P95 < 200ms 首验 done ✨ + 多租户深化 isolation 验证 done ✨ + 跨集团 V3 准备 ready ✨**（5 重深化里程碑达成）|

---

## §2 Day 1-7 Task 占位（A 主轨 5 task / 总 ~1.0 PD + second 1 task 0.5 PD + AI 6 角色协作稳态 0.3 PD）

### A 主轨（main 主代理 a / 35+ 推广 + 性能 V6 + 多租户深化 + 跨集团 V3 准备 + Codex Round 35 + 67 顺延收尾 / 共 5 task / 1.0 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 35+ 单位推广 + 反馈整合（30+ → 35+ 升级 / 10 新单位 / 跨集团组合 / 上线培训 + 落地支持 + 反馈机制）| 0.25 | **P0 推广核心** | main 主代理 a | ① **推广 plan V0.2 起草**（10 新单位选定标准 / 跨集团组合优先 / 煤矿 + 化工 + 矿建 + 物流 4 行业混合 / 单位规模分布合理 / 累计达 35+ ≥ 80%）② **10 新单位接入流程**（基础数据导入 / 组织映射 / 权限初始化 / 上线培训计划 / 落地支持 SLA ≤ 1 周）③ **上线培训方案**（标准培训材料 / 培训师配置 / 培训时长 ≤ 2 天 / 培训完成率 ≥ 95%）④ **落地支持机制**（落地支持人员 / 24 小时响应 SLA / 问题分类 P0/P1/P2 / 升级路径 / 累计反馈 ≥ 50 项）⑤ **反馈机制**（周报模板 + 月度回顾会 + 反馈日志 / 反馈分类 bug / feature / UX / training / 处理状态跟踪 done/in-progress/pending）⑥ **35+ 单位反馈整合**（累计反馈 ≥ 80 项整合 / 优先级排序 / 加入 Sprint 20ai+ backlog / 闭环率 ≥ 70%）⑦ 写到 `docs/详细设计/35单位推广-plan-V0.2.md` + `docs/上线/培训方案-V0.1.md` ≥ 200 行 | Sprint 20ag D5 满 + 30+ 推广 ≥ 80% done | 35+ 推广 plan V0.2 done / 10 新单位接入 ≥ 8 / 培训完成率 ≥ 95% / 反馈机制运行 / 累计反馈 ≥ 80 项闭环率 ≥ 70% / 详设 V0.2 ≥ 200 行 |
| **T-A2** 性能 V6 + 多租户深化（P95 < 200ms / 多租户 isolation 验证 / 缓存 V3 + 分区 V2）| 0.3 | **P0 性能里程碑** | main 主代理 a | ① **性能 V6 P95 < 200ms 首验**（API endpoint p95 ≤ 200ms / 1000 并发 RPS / 全 API 端到端实测 / 性能瓶颈分析 + 优化 ≥ 5 项）② **缓存 V3 升级**（Redis 多级缓存 / L1 in-memory + L2 Redis + L3 DB / 缓存命中率 ≥ 80% / TTL 策略 + 缓存失效 + 缓存预热）③ **分区 V2 升级**（PostgreSQL 分区表 / 按 tenant + 时间双维度 / 历史数据归档 / 查询性能提升 ≥ 30%）④ **多租户 isolation 验证**（跨租户数据隔离 ≥ 99.9% / row-level security 策略 / 测试用例 ≥ 20 / 性能影响 ≤ 5%）⑤ **多租户切换性能**（租户切换响应 ≤ 100ms / 上下文切换无 race / 跨租户查询禁用）⑥ **大数据量场景实测**（35+ 单位 + 100万级业务数据 / 1000 并发 / 性能 + 准确性双达标）⑦ **性能监控 V3**（Prometheus + Grafana 看板 / P50 P95 P99 实时显示 / 性能退化告警 ≥ 200ms 触发）⑧ 写到 `modules/nova.supplycores/Domain/Performance/V6/` + `docs/详细设计/性能-V6-V0.1.md` + `docs/详细设计/多租户深化-V0.1.md` ≥ 220 行 | T-A1 ready + 35+ 推广 plan V0.2 done | 性能 V6 P95 < 200ms / 多租户 isolation ≥ 99.9% / 缓存命中率 ≥ 80% / 分区查询提升 ≥ 30% / 性能影响 ≤ 5% / 详设 V0.1 ≥ 220 行 |
| **T-A3** 跨集团 V3 准备（V2 → V3 路径 design / schema 演进准备 / 多协议占位 / Sprint 20ai 真起 ready）| 0.2 | **P0 准备里程碑** | main 主代理 a | ① **V2 → V3 升级路径 design**（schema 演进 / 字段拓展 / 向后兼容 / migration 双跑策略 / 灰度发布 plan）② **schema 演进准备**（V3 新字段定义 / nullable 默认 / V2 字段保留 / data migration 脚本占位）③ **多协议占位**（RESTful 默认延续 / GraphQL + gRPC 实施可行性评估 / 子单位差异化协议选型）④ **容错 4 层 design**（Polly retry + circuit breaker + 限流 token bucket + 降级 V2 fallback / 实施 plan）⑤ **监控 + 告警 design**（Prometheus 指标定义 / Grafana 看板模板 / 飞书告警阈值表 / 实施 plan）⑥ **3 试点单位选定**（跨集团 V3 试点 / 多协议各 1 个 / 性能 + 容错 + 监控全链路测试用例 design）⑦ **Sprint 20ai 真起 ready 验证**（V3 backend 接口契约 done / migration 脚本 ready / 试点单位接入计划 done）⑧ 写到 `docs/详细设计/跨集团数据共享-V3-准备-V0.1.md` ≥ 180 行 | T-A1 + T-A2 ready | V3 准备 design done / schema 演进 + 多协议 + 容错 + 监控 4 维度 design done / 3 试点单位选定 / Sprint 20ai 真起 ready / 详设 V0.1 ≥ 180 行 |
| **T-A4** Codex Round 35 立修 + 复测 + 0 收敛追求（Sprint 20o R5 / 20p R12 / 20q-20ag R13-34 连续 22 次后第 23 次 0 收敛追求）| 0.15 | P0 | main 主代理 a | 标准 Codex 立修 + 复测 / 0 finding 收敛目标 / 验证规则参考 [[feedback_codex_false_positive_verify_first]] raw SQL + EF Fluent + partial index 三处 / 涉及 35+ 推广 plan + 性能 V6 + 多租户深化 + 跨集团 V3 准备 + 详设 V0.x 评审 / 评审范围扩大 4 文档 ≥ 800 行综合 | Sprint 20ag T-A4 R34 done | Codex Round 35 finding 全立修 / 复测全通过 / 0 收敛达成（连续 23 次 0 收敛追求 / 累计度量纳入第 7 周期 retrospective）|
| **T-A5** 67 Sprint 0 顺延收尾 commit + memory + Sprint 20ai V0.1 起草 | 0.1 | P0 | main 主代理 a | ① Sprint 20ah 任务卡 V0.x 升版（教训 13 6 步模板 / 第 N 次实测 / 由 AI 升版员协助 done）② memory 升级（**67 Sprint 0 顺延 ✨ + 35+ 单位推广深化 done ✨ + 性能 V6 P95 < 200ms 首验 done ✨ + 多租户深化 isolation 验证 done ✨ + 跨集团 V3 准备 ready ✨ 5 重深化里程碑**）③ Sprint 20ai V0.1 起草占位（第 7 周期 D5 / 跨集团 V3 backend 真起 + 大客户深化 + 68+ 顺延目标）④ Sprint 20ah 收尾 commit | T-A1-A4 全 done + Codex 0 收敛 + 35+ 推广 + 性能 V6 + 多租户 + V3 准备 done | V0.x 锁版 / memory commit / Sprint 20ai V0.1 占位 done / 5 重深化里程碑达成 ✅ |

**main 总：~1.0 PD**（vs Sprint 20af 1.0 PD 深化性 / Sprint 20ah 推广 + 性能性平衡 / 35+ 推广 + 性能 V6 + 多租户 + V3 准备 深度大 / AI 6 角色协作稳态 = 工作量饱满但不溢出）

### E 副轨（second 主代理 e / 35+ 单位 frontend 适配 + 大数据量 grid V6 / 共 1 task / 0.5 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** 35+ 单位 frontend 适配 + 大数据量 grid V6（second 主轨）| 0.5 | pending | ① **35+ 单位 frontend 适配**（10 新单位品牌化 + logo + 主题色 + 单位选择器 UX 优化 / 跨集团切换 ≤ 100ms）② **大数据量 grid V6 frontend**（DevExtreme grid 虚拟化滚动 / 1万行 + 50 列流畅 / 列固定 + 排序 + 筛选 + 分组性能 / 内存占用 ≤ 200MB）③ **多租户切换 UI**（租户切换组件 / 上下文实时显示 / 切换动效 ≤ 100ms / 跨租户数据隔离视觉反馈）④ **性能监控 frontend**（实时性能指标小部件 / P95 显示 / 慢请求告警条 frontend）⑤ **Reports/Dashboards 28 次连续完整闭环 ✨**（27 次 Sprint 20ag + 1 次 Sprint 20ah = 28 次累计 / dashboard + Reports 模板稳定 / 双重 baseline 第 20 次）⑥ DevExtreme + ExcelJS 累积 30 次延续（第 7 周期 D4 节点）⑦ grid V6 + 缓存 V4 持续优化 + 大屏 4K 适配深化 ⑧ 写到 `modules/nova.supplycores/frontend/src/pages/Promotion35/` + `modules/nova.supplycores/frontend/src/pages/MultiTenant/` |

---

## §3 35+ 单位推广 detail

### §3.1 30+ → 35+ 升级路径

| 维度 | 30+ 推广（Sprint 20ag 收尾）| 35+ 推广深化（Sprint 20ah）|
|---|---|---|
| **单位数量** | 30+ ≥ 80% 接入 | **35+ ≥ 95% 接入 / 10 新单位推广** ✨ |
| **行业分布** | 煤矿主 / 化工占位 | **煤矿 + 化工 + 矿建 + 物流 4 行业混合** ✨ |
| **跨集团组合** | 集团 1 + 煤矿 30+ + 供应商 100+ | **+ 跨集团子单位组合（≥ 3 跨集团）** ✨ |
| **上线培训** | 基础培训 | **标准培训方案 V0.1 / 培训完成率 ≥ 95%** ✨ |
| **落地支持** | 占位 | **落地支持 SLA ≤ 1 周 / 24 小时响应** ✨ |
| **反馈机制** | 散点反馈 | **周报 + 月度回顾 + 反馈日志 / 闭环率 ≥ 70%** ✨ |

### §3.2 10 新单位推广 plan V0.2

| 单位 | 行业 | 规模 | 集团归属 | 接入优先级 |
|---|---|---|---|---|
| **新单位 1** | 煤矿 | 中型 | 集团 A | P0（推广模板）|
| **新单位 2** | 化工 | 大型 | 集团 A | P0（跨行业首验）|
| **新单位 3** | 矿建 | 中型 | 集团 B | P1（跨集团首验）|
| **新单位 4** | 物流 | 小型 | 独立 | P1（轻量化推广）|
| **新单位 5-7** | 煤矿 | 混合 | 集团 A/B | P1（推广深化）|
| **新单位 8-10** | 混合 4 行业 | 混合 | 跨集团 | P2（多元化）|

### §3.3 上线培训 + 落地支持

| 维度 | 内容 | SLA |
|---|---|---|
| **标准培训材料** | 视频 + PDF + 在线文档 / 4 模块（基础 + 业务 + 数据 + 报表）| 培训师 1 次准备 |
| **培训师配置** | 2 名 培训师 / 同时支持 5 单位 | 培训时长 ≤ 2 天 / 单位 |
| **培训完成率** | 培训人员 ≥ 95% 通过认证 | 7 天内复测 |
| **落地支持人员** | 1 名 落地支持 / 5 单位 | 24 小时响应 |
| **落地支持 SLA** | P0 4 hr / P1 24 hr / P2 72 hr | 累计反馈 ≥ 80 项 |
| **升级路径** | P0 → main 主代理 / P1 → second / P2 → AI 业务对话员（待 Wave 3）| 反馈闭环率 ≥ 70% |

### §3.4 反馈机制详解

| 反馈类别 | 来源 | 处理 | 跟踪 |
|---|---|---|---|
| **bug 反馈** | 落地支持 / 用户直报 | T-A4 Codex Round + 立修 | bug 跟踪表 |
| **feature 反馈** | 周报整合 | Sprint 20ai+ backlog | feature 优先级表 |
| **UX 反馈** | 月度回顾 | second e frontend 优化 | UX iteration |
| **training 反馈** | 培训完成度统计 | 培训方案 V0.x 升版 | 培训方案 iteration |
| **累计反馈 ≥ 80 项** | 4 类反馈累计 | 优先级排序 + 闭环率 ≥ 70% | feedback 日志 |

---

## §4 性能 V6 + 多租户深化 detail

### §4.1 性能 V6 P95 < 200ms 首验

| 维度 | V5（Sprint 20ag）| V6（Sprint 20ah）|
|---|---|---|
| **API P95** | ≤ 500ms | **≤ 200ms** ✨ |
| **并发 RPS** | 500 | **1000 ✨** |
| **缓存** | Redis 单级 | **Redis 多级 L1 + L2 + L3** ✨ |
| **分区** | 单维度 tenant | **双维度 tenant + 时间** ✨ |
| **性能监控** | Prometheus 基础 | **Prometheus + Grafana 看板 V3** ✨ |

### §4.2 缓存 V3 升级 detail

| 层 | 类型 | 容量 | 命中率目标 | TTL 策略 |
|---|---|---|---|---|
| **L1 in-memory** | 内存缓存 | ≤ 100MB / 进程 | ≥ 50% | 5 分钟 |
| **L2 Redis** | Redis cluster | ≥ 10GB | ≥ 30% | 1 小时 |
| **L3 DB** | PostgreSQL | DB | 兜底 | N/A |
| **综合命中率** | L1 + L2 | N/A | **≥ 80%** ✨ | 全级联失效 |

### §4.3 分区 V2 升级 detail

| 维度 | V1（Sprint 20ag）| V2（Sprint 20ah）|
|---|---|---|
| **分区维度** | tenant 单维度 | **tenant + 时间双维度** ✨ |
| **历史归档** | 占位 | **历史数据归档（≥ 1 年自动归档冷库）** ✨ |
| **查询性能** | 基础 | **提升 ≥ 30%** ✨ |
| **存储优化** | 占位 | **冷热分离 + 压缩 ≥ 50%** ✨ |

### §4.4 多租户深化 isolation 验证

| 维度 | 要求 | 测试用例 | 实施 |
|---|---|---|---|
| **跨租户数据隔离** | ≥ 99.9% | ≥ 20 测试用例 | row-level security + Hangfire isolation |
| **租户切换响应** | ≤ 100ms | 上下文切换无 race | session token + 缓存预热 |
| **跨租户查询** | 禁用 | ≥ 10 反向测试 | RLS 策略 + 异常告警 |
| **性能影响** | ≤ 5% | 单租户 vs 多租户对比 | 性能 baseline + 多租户 baseline |

### §4.5 大数据量场景实测

| 维度 | 量级 | 目标 |
|---|---|---|
| **单位数量** | 35+ 单位 | 多租户并发 |
| **业务数据** | 100万级 | 查询 + 写入 |
| **并发用户** | 1000 RPS | P95 ≤ 200ms |
| **报表生成** | 复杂 join | ≤ 30 秒 |
| **大屏刷新** | 实时数据 | ≤ 5 秒 |

### §4.6 性能监控 V3

| 指标 | 阈值 | 告警渠道 | 响应 SLA |
|---|---|---|---|
| **P50** | ≤ 100ms | Grafana 看板 | 持续监控 |
| **P95** | ≤ 200ms | 飞书告警 ≥ 200ms | ≤ 30 分钟修复 |
| **P99** | ≤ 500ms | 飞书告警 ≥ 500ms | ≤ 1 hr 修复 |
| **错误率** | ≤ 0.5% | 飞书告警 ≥ 1% | ≤ 30 分钟修复 |
| **缓存命中率** | ≥ 80% | Grafana 看板 | 持续监控 |
| **多租户切换延迟** | ≤ 100ms | 飞书告警 ≥ 200ms | ≤ 1 hr 优化 |

---

## §5 触发条件 5 项 + 沿革

### §5.1 触发条件（5 项）

| 条件 | 内容 | 状态 |
|---|---|---|
| **C-1** | Sprint 20ag D5 满（第 7 周期 D3 done / 66 Sprint 0 顺延达成）| ⏳ 待 Sprint 20ag D5 |
| **C-2** | 30+ 推广 ≥ 80% done（35+ 推广前置条件 / 上线培训 + 落地支持基础就绪）| ⏳ 待 Sprint 20ag D5 |
| **C-3** | AI 6 角色协作矩阵首验 done（Sprint 20af T-A3 6 角色协作首验完成 / 5 角色累计 5+ 月稳定）| ⏳ 待 Sprint 20af 完成 |
| **C-4** | cici 性能 V6 + 多租户深化拍板（main long-time Wave 8 已起草 / cici 拍板 P95 < 200ms 阈值 + 多租户 isolation 标准）| ⏳ 待 cici 拍板 |
| **C-5** | 67 Sprint 0 顺延准备（Sprint 20ah 5 重深化里程碑前置）| ⏳ Sprint 20ah 完成达成 |

**触发判断**：C-1 + C-2 待 Sprint 20ag D5 / C-3 待 Sprint 20af 完成 / C-4 待 cici 拍板 / C-5 待 Sprint 20ah 完成 / 触发条件 0/5 待 Sprint 20af + 20ag 演进 / Sprint 20ag D5 满 + cici 拍板后即时启动 Day 1

### §5.2 沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.1** | **2026-05-19 D2 long-time Wave 8（main long-time 跨日工作 Wave 8 / Sprint 20ah 任务卡起草 / 35+ 单位推广深化 sprint / 5 重深化里程碑）** | **Sprint 20ah V0.1 起草**：① **Sprint 20ah 主题：35+ 单位推广深化 sprint ✨ + 性能 V6 首验 sprint ✨ + 多租户深化首验 sprint ✨ + 跨集团 V3 准备首验 sprint ✨ + 67 Sprint 0 顺延 ✨**（5 重深化里程碑达成 sprint）② **T-A1-A5 完整**（T-A1 35+ 单位推广 + 反馈整合 / T-A2 性能 V6 + 多租户深化 / T-A3 跨集团 V3 准备 / T-A4 Codex Round 35 0 收敛追求 / T-A5 67 顺延收尾 + Sprint 20ai V0.1 起草）③ **§3 35+ 单位推广 detail 完整**（§3.1 30+ → 35+ 升级路径 + §3.2 10 新单位 plan V0.2 + §3.3 上线培训 + 落地支持 + §3.4 反馈机制）④ **§4 性能 V6 + 多租户 detail 完整**（§4.1 P95 < 200ms + §4.2 缓存 V3 + §4.3 分区 V2 + §4.4 多租户 isolation + §4.5 大数据量场景 + §4.6 监控 V3）⑤ **second 副轨 0.5 PD**（T-E1 35+ frontend 适配 + 大数据量 grid V6 + Reports/Dashboards 28 次连续 ✨）⑥ **触发条件 5 项 §5.1**（C-1 + C-2 待 Sprint 20ag D5 / C-3 待 Sprint 20af 完成 / C-4 + C-5 待拍板 + 完成）⑦ 工作量 1.0 PD 主线 + 0.5 PD second + AI 6 角色协作稳态 0.3 PD / wall-clock 5-7 天 / **67 Sprint 0 顺延 ✨ + 35+ 推广深化 done ✨ + 性能 V6 P95 < 200ms 首验 done ✨ + 多租户 isolation 验证 done ✨ + 跨集团 V3 准备 ready ✨ 5 重深化里程碑目标** |

---

## §6 起草上下文 + Related

**起草人**：main 主代理 a（2026-05-19 D2 long-time Wave 8 / main long-time 跨日工作 Wave 8 / Sprint 20ah V0.1 起草 / 35+ 单位推广深化 sprint）
**预期 Sprint 20ah Day 1 启动**：Sprint 20ag D5 满后（~ 2027-05 初）

**起草上下文记录**：

- main V0.11 §4 已起草对应 main 任务 1.0 PD（35+ 推广 + 反馈整合 + 性能 V6 + 多租户深化 + 跨集团 V3 准备 + Codex Round 35 + 67 顺延）
- second V0.x 续接 / V0.x+ 待起草（second T-E1 35+ frontend 适配 + 大数据量 grid V6 + 多租户切换 UI + Reports/Dashboards 28 次连续同步落盘）
- 2026-05-19 D2 today long-time Wave 8 跨日工作 / 累计 prompt 矩阵 ~161 PD / 累计 task ~280+ task / 跨 38+ sprint
- 第 7 周期 Sprint 20ae-20aj 主轴 = AI Wave 1+2 全投产 + 30+ → 35+ 推广 + 平台化 V1.5 + 大客户 5-8 家接入 + 跨集团 V3 深化
- Sprint 20ah 为第 7 周期 D4 / 35+ 推广深化关键节点 / 性能 V6 P95 < 200ms 首验 / 多租户 isolation 深化 / 跨集团 V3 准备（Sprint 20ai 真起 ready）
- 5 重深化里程碑 ✨：67 Sprint 0 顺延 + 35+ 推广深化 + 性能 V6 P95 < 200ms 首验 + 多租户 isolation 验证 + 跨集团 V3 准备 ready
- 累计第 7 周期 D4 commit ~40 / wall-clock 5-7 天 / 工作量 ~1.8 PD 总（含 AI 6 角色协作稳态 0.3 PD）

**Related**：

- [`Sprint-20ag-任务卡-V0.1.md`](Sprint-20ag-任务卡-V0.1.md)（前序 / 第 7 周期 D3 done / 66 顺延 / D5 满触发本 sprint）
- [`Sprint-20af-任务卡-V0.1.md`](Sprint-20af-任务卡-V0.1.md)（跨集团第 8 周期主推深化 / AI 6 角色协作矩阵首验 / 本 sprint AI 6 角色协作稳态依据）
- [`Sprint-20ae-任务卡-V0.1.md`](Sprint-20ae-任务卡-V0.1.md)（第 7 周期 D1 开局 / 64 顺延 / 第 7 周期主轴起点）
- [`35单位推广-plan-V0.2.md`](../详细设计/35单位推广-plan-V0.2.md)（待 T-A1 起草 / 10 新单位推广计划详设）
- [`培训方案-V0.1.md`](../上线/培训方案-V0.1.md)（待 T-A1 起草 / 上线培训方案详设）
- [`性能-V6-V0.1.md`](../详细设计/性能-V6-V0.1.md)（待 T-A2 起草 / P95 < 200ms 性能详设）
- [`多租户深化-V0.1.md`](../详细设计/多租户深化-V0.1.md)（待 T-A2 起草 / 多租户 isolation 验证详设）
- [`跨集团数据共享-V3-准备-V0.1.md`](../详细设计/跨集团数据共享-V3-准备-V0.1.md)（待 T-A3 起草 / V3 准备 design 详设）
- [`Roadmap-Cycle7-V0.5.md`](Roadmap-Cycle7-V0.5.md)（Sprint 20ad T-A3 起草 / 第 7 周期 roadmap / 本 sprint 第 7 周期 D4 节奏依据）
- [`Long-term-Roadmap-V0.7.md`](Long-term-Roadmap-V0.7.md)（Sprint 20ad T-A3 升版 / cycle6-10 长期视野 / 本 sprint 35+ 推广 + 性能 V6 + 多租户深化对应长期视野第 2 阶段）
- [[feedback_main_overnight_cross_day_2026_05_18_19]]（main 跨日工作模式 / 26 hr ~120 commits / 本 sprint V0.1 起草环境 long-time Wave 8）
- [[feedback_main_overnight_validation_pattern]]（main 整夜跑模式 / 5-8x 加速 / 本 sprint Day 1-7 节奏复用）
- [[feedback_main_v02_wave_fghij_complete]]（main V0.x Wave 全 part done 实测 / AI 6 角色协作稳态来源）
- [[feedback_dual_session_19t_continuous_validation]]（second e Reports/Dashboards 累积 19 次 / 本 sprint T-E1 28 次连续 ✨）
- [[feedback_oauth2_client_credentials_pattern]]（OAuth2 5 要点 / 本 sprint T-A3 V3 准备 ERP/财务集成多协议参考）
- [[feedback_nc_interface_sprint_pattern]]（NC 域 3 sprint 完整闭环节奏 / 本 sprint T-A3 跨集团 V3 准备节奏参考）
- [[feedback_codex_0_carryover_8_sprint_record]]（53 Sprint 0 顺延记录 / 本 sprint 目标 67 + 5 重深化里程碑）
- [[feedback_codex_false_positive_verify_first]]（raw SQL + EF Fluent + partial index 三处验证规则 / 本 sprint T-A4 Codex Round 35 复用）
- [[reference_team_tech_stack]]（前端 DevExtreme + ExcelJS 默认 / 本 sprint second T-E1 延续）
- [[project_strategic_pivot_cycle3_data_governance]]（战略转向第 3 周期 / 本 sprint 第 7 周期 D4 = 战略推进 4-5 个完整周期 + 35+ 推广深化里程碑）
- [[feedback_sprint20l_4_5x_subagent_parallel_pattern]]（4-5x 子代理并行模式 / 本 sprint T-A1 + T-A2 spawn 可能性）
