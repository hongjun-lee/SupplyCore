# Sprint 20af 任务卡 V0.1（2026-05-19 D2 long-time Wave 6 / 跨集团第 8 周期主推深化 ✨ / 第 7 周期 D2 / 65 Sprint 0 顺延 ✨）

**Sprint**：20af（**跨集团第 8 周期主推深化 sprint** ✨ / 接续 Sprint 20ae 第 7 周期 D1 开局 / **65 Sprint 0 顺延** ✨ / **AI 6 角色稳定运行首验 sprint** ✨ / **服务集成深化首验 sprint** ✨）
**主题**：**跨集团数据共享 V3 backend + 服务集成深化（ERP + 财务 + HR + CRM 4 系统 ≥ 99% 可用）+ AI 团队 6 角色稳定运行（main + second + memory + 跨系统 + PM + 决策 + 升版 = 7 / 实际 AI 5 角色 + main/second 双 session = 7 协作矩阵）+ 65 Sprint 0 顺延**
**节奏**：main V0.11 §2 已起草对应 main 任务 1.0 PD / 5 task 深化性 / second V0.x 续接（V0.x+ 待起草）/ 工作量 ~1.0 PD 主线 + 0.5 PD second + AI 6 角色稳定运行 0.3 PD / wall-clock 5-7 天
**性质**：**跨集团第 8 周期主推深化 sprint + 服务集成深化首验 sprint + AI 6 角色稳定运行首验 sprint**（第 7 周期 D2 / V3 backend 关键深化节点 / ERP+财务+HR+CRM 4 系统稳定首验 / AI 团队从 5 → 6 角色拓展稳定运行首验）

**V0.1 起草要点**（main long-time Wave 6 / 2026-05-19 D2 today / 跨集团第 8 周期 V2 → V3 深化节奏 / 服务集成 4 系统稳定首验 / AI 6 角色稳定运行首验 / Codex 累计 ~135+ finding 18 次 0 收敛节奏 / 第 7 周期 D2 推进）：

- **跨集团数据共享 V3 backend ✨**：V2 → V3 升级 / 多协议支持 / 容错 + 重试 + 限流 + 降级
- **服务集成深化 ✨**：ERP + 财务 + HR + CRM 4 系统 ≥ 99% 可用首验 / 跨域稳定性
- **AI 6 角色稳定运行 ✨**：Wave 1 2 + Wave 2 3 + main = 6 / 或 5 AI 独立 + main/second 双 session 协作矩阵
- **65 Sprint 0 顺延**：64（Sprint 20ae 收尾）→ 65（Sprint 20af 收尾）

---

## §1 基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2027-04 中（Sprint 20ae D5+ 后 / 第 7 周期 D2 / 跨集团第 8 周期 V3 深化首推时机）|
| main 主线工作量 | ~1.0 PD（5 task / T-A1-A5 / 跨集团 V3 backend + 服务集成深化 + AI 6 角色稳定 + Codex Round 33 + 65 顺延收尾）|
| second 副线工作量 | ~0.5 PD（1 task / T-E1 / 跨集团 V3 frontend + 服务集成 frontend 占位）|
| **AI 6 角色工作量** | **稳定运行 0.3 PD** ✨（Wave 1 2 角色 + Wave 2 3 角色 + main 编排 = 6 协作 / 累计 4 月+ 投产稳定 / 本 sprint 6 角色协作首验）|
| **AI Wave 1 工作量** | **稳定投产** ✨（memory 沉淀员 + 跨系统集成员 / 累计 5+ 月投产 / Wave 1 完全自动化）|
| **AI Wave 2 工作量** | **稳定投产** ✨（PM + 决策模板员 + 升版员 / Sprint 20ad Day 30 验收 done / 累计 1+ 月稳定投产）|
| wall-clock | 5-7 天（Day 1 跨集团 V3 backend 核心 / Day 2 服务集成 ERP + 财务 / Day 3 服务集成 HR + CRM / Day 4 AI 6 角色协作矩阵首验 + Codex Round 33 / Day 5-7 65 顺延收尾 + Sprint 20ag V0.1 起草）|
| Sprint 性质 | **跨集团第 8 周期主推深化 + 服务集成深化首验 + AI 6 角色稳定运行首验**（三重深化性质 sprint）|
| 前置 Sprint | Sprint 20ae D5 满 + 第 7 周期 D1 开局 done + 64 Sprint 0 顺延 + 跨集团 V3 起草 ready + AI Wave 1+2 全投产稳定 |
| 后续 Sprint | Sprint 20ag（第 7 周期 D3 / 66+ 顺延目标 + 跨集团 V3 持续深化 + 平台化 V1.5 准备）|
| Sprint 顺延目标 | **65 Sprint 0 顺延 ✨ + 跨集团第 8 周期 V3 backend done ✨ + 服务集成 4 系统 ≥ 99% 可用 ✨ + AI 6 角色稳定运行首验 ✨**（4 重深化里程碑达成）|

---

## §2 Day 1-7 Task 占位（A 主轨 5 task / 总 ~1.0 PD + second 1 task 0.5 PD + AI 6 角色稳定运行 0.3 PD）

### A 主轨（main 主代理 a / 跨集团 V3 backend + 服务集成深化 + AI 6 角色稳定 + Codex Round 33 + 65 顺延收尾 / 共 5 task / 1.0 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 跨集团数据共享 V3 backend（V2 → V3 升级 / 多协议 / 容错）| 0.3 | **P0 深化核心** | main 主代理 a | ① **V2 → V3 数据 schema 演进**（向后兼容 / 字段拓展 / migration 双跑期间无停机）② **多协议支持**（RESTful + GraphQL + gRPC 任选 / 跨集团子单位接入差异化协议）③ **容错机制**（Polly 三层 retry / circuit breaker / 限流 token bucket / 降级回 V2 fallback）④ **监控 metrics**（Prometheus + Grafana 看板 / V3 调用次数 / 响应时间 p95 / 错误率 / 限流触发率）⑤ **告警机制**（错误率 ≥ 1% / p95 ≥ 500ms / 限流触发 ≥ 10 次/分钟 → 飞书机器人告警）⑥ **跨集团子单位接入示例**（3 个 V3 试点单位 / 多协议各 1 个 / 性能 + 容错 + 监控全链路实测）⑦ 写到 `modules/nova.supplycores/Domain/CrossOrg/V3/` + `docs/详细设计/跨集团数据共享-V3-V0.1.md` ≥ 200 行 | Sprint 20ae D5 满 + 第 7 周期 D1 开局 done + V3 起草 ready | V3 backend 核心 done / 多协议 ≥ 2 种 / 容错 4 层全 / 监控 + 告警 / 3 单位试点接入 / 详设 V0.1 ≥ 200 行 |
| **T-A2** 服务集成深化（ERP + 财务 + HR + CRM 4 系统 ≥ 99% 可用首验）| 0.25 | **P0 深化里程碑** | main 主代理 a | ① **ERP 集成深化**（财务凭证 / 库存同步 / 采购订单 / 销售订单 4 业务流 ≥ 99% 可用 / 接口契约稳定 / WireMock chaos 5 场景实测）② **财务集成深化**（总账 + 应付 + 应收 + 报表 4 业务 / 月结对账 准确率 ≥ 99% / Sprint 17a OAuth2 + Polly 三层延续）③ **HR 集成深化**（员工档案 + 组织架构 + 权限映射 / SCIM 协议 / 自动同步频率 ≤ 1 hr / 跨组织权限 RBAC 准确率 ≥ 99%）④ **CRM 集成深化**（客户 + 商机 + 销售订单 / 单向同步 SupplyCores → CRM / 数据完整性 ≥ 99%）⑤ **4 系统跨域稳定性**（4 系统并行调用 / 错误隔离 / 单系统宕机不影响其他 / 端到端 SLA ≥ 99%）⑥ **跨系统集成员 AI 角色协助**（Wave 1 AI 跨系统集成员稳定投产 / 协助接口契约校验 + 错误日志分析）⑦ 写到 `modules/nova.supplycores/Domain/Integration/` + `docs/详细设计/服务集成深化-V0.1.md` ≥ 180 行 | T-A1 ready + AI Wave 1 跨系统集成员稳定投产 | 4 系统集成深化 done / ≥ 99% 可用首验 / WireMock chaos 5 场景实测 / 月结准确率 + 权限准确率 + 数据完整性 ≥ 99% / 详设 V0.1 ≥ 180 行 |
| **T-A3** AI 团队 6 角色稳定运行首验（Wave 1 2 + Wave 2 3 + main 编排 = 6 / 协作矩阵首验）| 0.2 | **P0 协作里程碑** | main 主代理 a | ① **6 角色协作矩阵定义**（main 编排 + memory 沉淀员 + 跨系统集成员 + PM + 决策模板员 + 升版员 = 6 / 协作流程图 + 责任分工 + commit 邮箱矩阵）② **协作场景实测 ≥ 3 个**：场景 A = 跨 sprint 决策跟踪（PM + 决策模板员 + memory 沉淀员）/ 场景 B = 升版闭环（升版员 + memory 沉淀员 + main）/ 场景 C = 跨集团 V3 集成校验（跨系统集成员 + memory 沉淀员 + main）③ **稳定运行度量**（6 角色累计 PD / 6 角色协作 race 0 漏 / 跨角色 SLA ≤ 4 hr / 综合评分 ≥ 7.5/10）④ **6 角色 commit 邮箱矩阵全完整**：cici + main@catio.team + second@catio.team + memory@ + integrator@ + pm@ + decision@ + versioning@ = 8 类（含 cici 7 类 AI）⑤ **AI Wave 3 catalog V0.2 起草**（业务对话员 + 数据稽核员 + 测试自动员 + 监控员 4-6 角色 / 第 8 周期投产准备）⑥ 写到 `docs/AI-Team/6-Roles-Collaboration-Matrix-V0.1.md` ≥ 150 行 | T-A1 + T-A2 ready + AI Wave 1+2 全投产稳定 | 6 角色协作矩阵 done / ≥ 3 场景实测 / 稳定运行度量达标 / commit 邮箱 8 类全 / Wave 3 catalog V0.2 / 协作矩阵 V0.1 ≥ 150 行 |
| **T-A4** Codex Round 33 立修 + 复测 + 0 收敛追求（Sprint 20o R5 / 20p R12 / 20q-20ae R13-32 连续 18 次后第 19 次 0 收敛追求）| 0.15 | P0 | main 主代理 a | 标准 Codex 立修 + 复测 / 0 finding 收敛目标 / 验证规则参考 [[feedback_codex_false_positive_verify_first]] raw SQL + EF Fluent + partial index 三处 / 涉及跨集团 V3 backend + 服务集成深化 + 6 角色协作矩阵 + 详设 V0.1 评审 / 评审范围扩大 4 文档 ≥ 700 行综合 | Sprint 20ae T-A4 R32 done | Codex Round 33 finding 全立修 / 复测全通过 / 0 收敛达成（连续 19 次 0 收敛追求 / 累计度量纳入第 7 周期 retrospective）|
| **T-A5** 65 Sprint 0 顺延收尾 commit + memory + Sprint 20ag V0.1 起草 | 0.1 | P0 | main 主代理 a | ① Sprint 20af 任务卡 V0.x 升版（教训 13 6 步模板 / 第 N 次实测 / 由 AI 升版员协助 done）② memory 升级（**65 Sprint 0 顺延 ✨ + 跨集团第 8 周期 V3 backend done ✨ + 服务集成 4 系统 ≥ 99% 可用 ✨ + AI 6 角色稳定运行首验 ✨ 4 重深化里程碑**）③ Sprint 20ag V0.1 起草占位（第 7 周期 D3 / 跨集团 V3 持续 + 平台化 V1.5 准备 + 大客户接入 ramp-up）④ Sprint 20af 收尾 commit | T-A1-A4 全 done + Codex 0 收敛 + AI 6 角色稳定运行首验 done | V0.x 锁版 / memory commit / Sprint 20ag V0.1 占位 done / 4 重深化里程碑达成 ✅ |

**main 总：~1.0 PD**（vs Sprint 20ad 1.2 PD 收尾性 / Sprint 20af 深化性平衡 / 跨集团 V3 + 4 系统集成深度大 + AI 6 角色首验 = 工作量饱满但不溢出）

### E 副轨（second 主代理 e / 跨集团 V3 frontend + 服务集成 frontend 占位 / 共 1 task / 0.5 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** 跨集团 V3 frontend + 服务集成 frontend（second 主轨）| 0.5 | pending | ① **跨集团 V3 frontend**（多协议切换 UI / V2 → V3 schema 切换提示 / 容错状态实时显示 / 监控 + 告警面板 frontend / 3 试点单位接入示例 frontend）② **服务集成 frontend**（4 系统集成状态看板 / 跨系统调用链 visualizer / 错误日志聚合显示 / SLA 实时显示）③ **Reports/Dashboards 26 次连续完整闭环 ✨**（25 次 Sprint 20ae + 1 次 Sprint 20af = 26 次累计 / dashboard + Reports 模板稳定 / 双重 baseline 第 18 次）④ DevExtreme + ExcelJS 累积 28 次延续（第 7 周期 D2 节点）⑤ grid V6 + 缓存 V4 持续优化 ⑥ 大屏 4K 适配深化 ⑦ 写到 `modules/nova.supplycores/frontend/src/pages/CrossOrgV3/` + `modules/nova.supplycores/frontend/src/pages/Integration/` |

---

## §3 跨集团数据共享 V3 detail

### §3.1 V2 → V3 升级路径

| 维度 | V2（Sprint 20ad 收尾）| V3（Sprint 20af 深化）|
|---|---|---|
| **数据 schema** | 集团-煤矿-供应商 3 层 / 固定字段 | **schema 演进 / 自定义字段拓展 / 向后兼容**（V2 字段保留 / V3 新增字段 nullable）|
| **协议支持** | RESTful 单协议 | **多协议**（RESTful + GraphQL + gRPC / 子单位差异化选择）|
| **容错** | 基础 Polly retry | **容错 4 层**（Polly retry + circuit breaker + 限流 token bucket + 降级 V2 fallback）|
| **监控** | 基础日志 | **Prometheus + Grafana 看板**（调用次数 / p95 / 错误率 / 限流触发率）|
| **告警** | 无 | **飞书机器人告警**（错误率 ≥ 1% / p95 ≥ 500ms / 限流触发 ≥ 10/分钟）|
| **接入单位** | 集团 1 + 煤矿 30+ + 供应商 100+ | **+ 3 V3 试点单位**（多协议各 1 / 性能 + 容错 + 监控全链路实测）|

### §3.2 多协议支持设计

| 协议 | 适用场景 | 实施难度 | 试点单位 |
|---|---|---|---|
| **RESTful**（默认）| 简单 CRUD / 子单位低技术栈 | 低 | 集团 + 煤矿大部分 |
| **GraphQL** | 复杂查询 / 跨表 join / 移动端 | 中 | 1 个 V3 试点（煤矿数据分析）|
| **gRPC** | 高性能 / 跨服务调用 / 大批量同步 | 高 | 1 个 V3 试点（供应商批量同步）|

### §3.3 容错 4 层 detail

| 层 | 机制 | 触发条件 | 实施 |
|---|---|---|---|
| **L1 Polly Retry** | 指数退避重试 | 临时网络错误 / 5xx | retry 3 次 / 指数 2/4/8 秒 |
| **L2 Circuit Breaker** | 熔断 | 错误率 ≥ 50% / 60 秒窗口 | 半开 30 秒 → 闭合 |
| **L3 限流 Token Bucket** | 流量整形 | 请求频率 ≥ 阈值 | 子单位 100 req/s / 集团 1000 req/s |
| **L4 降级 Fallback** | 降级 V2 | L1-L3 全失败 / 超时 | 自动降级 V2 端点 / 监控告警 |

### §3.4 监控 + 告警指标

| 指标 | 阈值 | 告警渠道 | 响应 SLA |
|---|---|---|---|
| **调用次数** | 每分钟 ≥ 100 / 子单位 | Grafana 看板 | 持续监控 |
| **p95 响应时间** | ≤ 500ms | 飞书告警 ≥ 500ms | ≤ 30 分钟修复 |
| **错误率** | ≤ 1% | 飞书告警 ≥ 1% | ≤ 30 分钟修复 |
| **限流触发率** | ≤ 10 次/分钟 | 飞书告警 ≥ 10 | ≤ 1 hr 调整阈值 |
| **降级触发** | ≤ 1 次/天 | 飞书告警 / 紧急 | ≤ 15 分钟介入 |

---

## §4 服务集成深化 detail（ERP + 财务 + HR + CRM）

### §4.1 ERP 集成深化

| 业务流 | 当前状态（Sprint 20ad）| 深化目标（Sprint 20af）| 实施 |
|---|---|---|---|
| **财务凭证** | 单向导出（NC mock）| ≥ 99% 可用 / 接口契约稳定 | OAuth2 + Polly 三层延续 + WireMock chaos 5 场景 |
| **库存同步** | 单向同步占位 | ≥ 99% 可用 / 实时同步 ≤ 5 分钟 | 事件驱动 + Kafka 队列（占位）|
| **采购订单** | 占位 | ≥ 99% 可用 / 跨系统订单 | 双向同步 / 状态机一致性 |
| **销售订单** | 占位 | ≥ 99% 可用 / 销售订单回流 | 单向 ERP → SupplyCores |

### §4.2 财务集成深化

| 业务 | 当前 | 深化目标 | 实施 |
|---|---|---|---|
| **总账** | 凭证生成 | 凭证 + 月结对账 准确率 ≥ 99% | NC mock + 真接 OAuth2 / 月结时点对齐 |
| **应付** | 占位 | 应付凭证 + 账期 + 付款单 | NC 应付模块对接 |
| **应收** | 占位 | 应收凭证 + 收款单 | NC 应收模块对接 |
| **报表** | 占位 | 财务报表自动拉取（资产负债 + 利润）| NC 报表 API |

### §4.3 HR 集成深化

| 业务 | 当前 | 深化目标 | 实施 |
|---|---|---|---|
| **员工档案** | 占位 | SCIM 协议 / 自动同步 ≤ 1 hr | SCIM 2.0 + webhook |
| **组织架构** | 占位 | 三方组织映射 / 跨组织 RBAC | 组织映射表 + 权限映射规则 |
| **权限映射** | 占位 | 跨组织 RBAC 准确率 ≥ 99% | 权限矩阵 + 自动同步 |

### §4.4 CRM 集成深化

| 业务 | 当前 | 深化目标 | 实施 |
|---|---|---|---|
| **客户** | 占位 | 单向同步 SupplyCores → CRM / ≥ 99% 完整 | 客户主数据推送 |
| **商机** | 占位 | 商机阶段同步 | 商机状态机映射 |
| **销售订单** | 占位 | 销售订单同步 CRM | 订单关联客户 + 商机 |

### §4.5 4 系统跨域稳定性

| 维度 | 要求 | 实施 |
|---|---|---|
| **错误隔离** | 单系统宕机不影响其他 | 异步队列 + 熔断 |
| **端到端 SLA** | ≥ 99% | 全链路监控 + SLO 告警 |
| **并行调用** | 4 系统并行 / 错误隔离 | Polly + circuit breaker per system |
| **数据一致性** | 最终一致 / 补偿事务 | Outbox pattern + 补偿任务 |

---

## §5 AI 6 角色稳定运行 detail

### §5.1 6 角色协作矩阵（含 main 编排）

| 角色 | Wave | commit 邮箱 | 累计实战 PD | 当前状态 | 本 sprint 工作 |
|---|---|---|---|---|---|
| **main 编排者** | 主线 | claude@catio.team / cici | N/A | 长期主线 | 编排 + 拍板 + 收口 |
| **memory 沉淀员** | Wave 1 | `memory@catio.team` | ~4 PD | 稳定投产 | feedback memory link 维护 |
| **跨系统集成员** | Wave 1 | `integrator@catio.team` | ~4 PD | 稳定投产 | 服务集成 4 系统校验 |
| **PM** | Wave 2 | `pm@catio.team` | ~2 PD | 稳定投产 | Sprint 任务卡 V0.x 起草 |
| **决策模板员** | Wave 2 | `decision@catio.team` | ~2 PD | 稳定投产 | 跨 sprint 决策跟踪 |
| **升版员** | Wave 2 | `versioning@catio.team` | ~2 PD | 稳定投产 | V0.x 升版 6 步模板 |
| **AI 6 角色累计** | 5 AI + main | 8 类邮箱矩阵 | **~14 PD 累计** | **协作矩阵首验** | 6 角色协作首验 |

### §5.2 协作场景实测 ≥ 3 个

| 场景 | 涉及角色 | 实施流程 | 验收 |
|---|---|---|---|
| **场景 A 跨 sprint 决策跟踪** | PM + 决策模板员 + memory 沉淀员 | PM 起草 → 决策模板员 生成模板 → memory 沉淀员 存档 | 决策链路完整 / 跨 sprint 可追溯 |
| **场景 B 升版闭环** | 升版员 + memory 沉淀员 + main | 升版员 git mv + 改头部 + 改沿革 → memory 沉淀员 更新 link → main 收口 commit | 教训 13 6 步模板遵守 100% |
| **场景 C 跨集团 V3 集成校验** | 跨系统集成员 + memory 沉淀员 + main | 跨系统集成员 接口契约校验 → memory 沉淀员 存档错误模式 → main 拍板修复 | V3 集成稳定性 ≥ 99% |

### §5.3 稳定运行度量

| 维度 | 阈值 | 检查机制 |
|---|---|---|
| **6 角色累计 PD** | ≥ 12 PD 本 sprint 累计 | git log --author 累计 |
| **协作 race** | 0 漏 | pathspec 严格 / isolation worktree |
| **跨角色 SLA** | ≤ 4 hr | 反馈链路时间戳 |
| **综合评分** | ≥ 7.5/10 | cici + main 综合评分 |

### §5.4 commit 邮箱矩阵全完整

| 类别 | 邮箱 | 责任方 |
|---|---|---|
| **cici** | catio1216@proton.me | 决策 + 拍板 |
| **main** | claude@catio.team | 主线编排 |
| **second** | second@catio.team（占位）| 副线开发 |
| **memory 沉淀员** | memory@catio.team | feedback link |
| **跨系统集成员** | integrator@catio.team | 接口契约 |
| **PM** | pm@catio.team | Sprint 任务卡 |
| **决策模板员** | decision@catio.team | 决策模板 |
| **升版员** | versioning@catio.team | V0.x 升版 |

### §5.5 AI Wave 3 catalog V0.2 起草准备

- **业务对话员**：跨 sprint 业务方反馈整合 / cici 单点协调辅助
- **数据稽核员**：data-issue-log + data-import-template 数据治理 SOP 持续运维
- **测试自动员**：E2E + 单测 + 集成测试 自动调度
- **监控员**：Prometheus + Grafana 看板 + 告警响应

### §5.6 6 角色风险防御

| 维度 | 风险 | 防御机制 |
|---|---|---|
| **6 角色协作 race** | 角色边界模糊 / 重复操作 | 协作流程图 + pathspec 严格 |
| **commit 邮箱误用** | 角色归属混淆 | git config local 隔离 + pre-commit hook |
| **AI Wave 1+2 退化** | 长期稳定后偏差累积 | 月度 SOP 抽考 + cici 综合评分 |
| **6 角色 SLA 超时** | 跨角色等待累积 | 反馈链路时间戳监控 |

---

## §6 触发条件 + 沿革

### §6.1 触发条件（5 项）

| 条件 | 内容 | 状态 |
|---|---|---|
| **C-1** | Sprint 20ae D5 满（第 7 周期 D1 开局 done / 64 Sprint 0 顺延达成）| ⏳ 待 Sprint 20ae D5 |
| **C-2** | 跨集团 V3 起草 ready（V2 → V3 升级路径 + schema 演进设计 done）| ⏳ 待 Sprint 20ae D5 |
| **C-3** | AI Wave 1+2 全投产稳定（5 角色累计 1+ 月稳定运行）| ✅ done（Sprint 20ad Wave 2 验收 done 起）|
| **C-4** | cici 6 角色协作矩阵拍板（main long-time Wave 6 已起草 / cici 拍板 6 角色 vs 5 角色）| ⏳ 待 cici 拍板 |
| **C-5** | 65 Sprint 0 顺延准备（Sprint 20af 深化性达成 4 重里程碑前置）| ⏳ Sprint 20af 完成达成 |

**触发判断**：C-3 已 done 1/5 / C-1 + C-2 待 Sprint 20ae D5 / C-4 待 cici 拍板 / C-5 待 Sprint 20af 完成 / 触发条件 1/5 20% 提前达成 / Sprint 20ae D5 满 + cici 拍板后即时启动 Day 1

### §6.2 沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.1** | **2026-05-19 D2 long-time Wave 6（main long-time 跨日工作 Wave 6 / Sprint 20af 任务卡起草 / 跨集团第 8 周期主推深化 sprint / 4 重深化里程碑）** | **Sprint 20af V0.1 起草**：① **Sprint 20af 主题：跨集团第 8 周期主推深化 sprint ✨ + 服务集成深化首验 sprint ✨ + AI 6 角色稳定运行首验 sprint ✨ + 65 Sprint 0 顺延 ✨**（4 重深化里程碑达成 sprint）② **T-A1-A5 完整**（T-A1 跨集团 V3 backend ≥ 200 行 / T-A2 服务集成 4 系统 ≥ 99% 可用 / T-A3 AI 6 角色稳定运行首验 / T-A4 Codex Round 33 0 收敛追求 / T-A5 65 顺延收尾 + Sprint 20ag V0.1 起草）③ **§3 跨集团数据共享 V3 detail 完整**（§3.1 V2 → V3 升级路径 + §3.2 多协议支持 + §3.3 容错 4 层 + §3.4 监控告警指标）④ **§4 服务集成深化 detail 完整**（§4.1 ERP + §4.2 财务 + §4.3 HR + §4.4 CRM + §4.5 跨域稳定性）⑤ **§5 AI 6 角色稳定运行 detail 完整**（§5.1 协作矩阵 + §5.2 协作场景 ≥ 3 + §5.3 度量 + §5.4 commit 邮箱 8 类 + §5.5 Wave 3 catalog V0.2 + §5.6 风险防御）⑥ **second 副轨 0.5 PD**（T-E1 跨集团 V3 frontend + 服务集成 frontend + Reports/Dashboards 26 次连续 ✨）⑦ **触发条件 5 项 §6.1**（C-3 已 done 1/5 / C-1 + C-2 + C-4 + C-5 待 sprint 间或拍板）⑧ 工作量 1.0 PD 主线 + 0.5 PD second + AI 6 角色 0.3 PD 稳定运行 / wall-clock 5-7 天 / **65 Sprint 0 顺延 ✨ + 跨集团第 8 周期 V3 backend done ✨ + 服务集成 4 系统 ≥ 99% 可用 ✨ + AI 6 角色稳定运行首验 ✨ 4 重深化里程碑目标** |

---

**起草人**：main 主代理 a（2026-05-19 D2 long-time Wave 6 / main long-time 跨日工作 Wave 6 / Sprint 20af V0.1 起草 / 跨集团第 8 周期主推深化 sprint）
**预期 Sprint 20af Day 1 启动**：Sprint 20ae D5 满后（~ 2027-04 中）

**起草上下文记录**：
- main V0.11 §2 已起草对应 main 任务 1.0 PD（跨集团 V3 backend + 服务集成深化 + AI 6 角色稳定 + Codex Round 33 + 65 顺延）
- second V0.x 续接 / V0.x+ 待起草（second T-E1 跨集团 V3 frontend + 服务集成 frontend + Reports/Dashboards 26 次连续同步落盘）
- 2026-05-19 D2 today long-time Wave 6 跨日工作 / 累计 prompt 矩阵 ~161 PD / 累计 task ~260+ task / 跨 36+ sprint
- 第 7 周期 Sprint 20ae-20aj 主轴 = AI Wave 1+2 全投产 + 30+ 推广 ≥ 75% + 平台化 V1.5 + 大客户 5-8 家接入 + 跨集团 V3 深化
- Sprint 20af 为第 7 周期 D2 / 跨集团第 8 周期主推深化节点 / V2 → V3 关键过渡 / 服务集成 4 系统 ≥ 99% 可用首验 / AI 6 角色协作矩阵首验
- 4 重深化里程碑 ✨：65 Sprint 0 顺延 + 跨集团 V3 backend done + 服务集成 4 系统 ≥ 99% 可用 + AI 6 角色稳定运行首验
- 累计第 7 周期 D2 commit ~30 / wall-clock 5-7 天 / 工作量 ~1.8 PD 总（含 AI 6 角色稳定运行 0.3 PD）

**Related**：
- [`Sprint-20ae-任务卡-V0.1.md`](Sprint-20ae-任务卡-V0.1.md)（前序 / 第 7 周期 D1 开局 / 64 顺延 / D5 满触发本 sprint）
- [`Sprint-20ad-任务卡-V0.1.md`](Sprint-20ad-任务卡-V0.1.md)（第 6 周期收尾 / AI Wave 2 Day 30 验收 done / 跨集团第 8 周期演进开始 commit 节点）
- [`跨集团数据共享-V3-V0.1.md`](../详细设计/跨集团数据共享-V3-V0.1.md)（待 T-A1 起草 / V3 backend 核心详设）
- [`服务集成深化-V0.1.md`](../详细设计/服务集成深化-V0.1.md)（待 T-A2 起草 / 4 系统集成深化详设）
- [`6-Roles-Collaboration-Matrix-V0.1.md`](../AI-Team/6-Roles-Collaboration-Matrix-V0.1.md)（待 T-A3 起草 / 6 角色协作矩阵首验）
- [`Roadmap-Cycle7-V0.5.md`](Roadmap-Cycle7-V0.5.md)（Sprint 20ad T-A3 起草 / 第 7 周期 roadmap / 本 sprint 第 7 周期 D2 节奏依据）
- [`Long-term-Roadmap-V0.7.md`](Long-term-Roadmap-V0.7.md)（Sprint 20ad T-A3 升版 / cycle6-10 长期视野 / 本 sprint 跨集团 V3 + 服务集成深化对应长期视野第 2 阶段）
- [[feedback_main_overnight_cross_day_2026_05_18_19]]（main 跨日工作模式 / 26 hr ~120 commits / 本 sprint V0.1 起草环境 long-time Wave 6）
- [[feedback_main_overnight_validation_pattern]]（main 整夜跑模式 / 5-8x 加速 / 本 sprint Day 1-7 节奏复用）
- [[feedback_main_v02_wave_fghij_complete]]（main V0.x Wave 全 part done 实测 / AI 6 角色协作矩阵来源 / 本 sprint T-A3 来源）
- [[feedback_dual_session_19t_continuous_validation]]（second e Reports/Dashboards 累积 19 次 / 本 sprint T-E1 26 次连续 ✨）
- [[feedback_oauth2_client_credentials_pattern]]（OAuth2 5 要点 / 本 sprint T-A2 财务集成深化复用 NC OAuth2 + Polly）
- [[feedback_nc_interface_sprint_pattern]]（NC 域 3 sprint 完整闭环节奏 / 本 sprint T-A2 服务集成 4 系统深化节奏参考）
- [[feedback_codex_0_carryover_8_sprint_record]]（53 Sprint 0 顺延记录 / 本 sprint 目标 65 + 4 重深化里程碑）
- [[feedback_codex_false_positive_verify_first]]（raw SQL + EF Fluent + partial index 三处验证规则 / 本 sprint T-A4 Codex Round 33 复用）
- [[reference_team_tech_stack]]（前端 DevExtreme + ExcelJS 默认 / 本 sprint second T-E1 延续）
- [[project_strategic_pivot_cycle3_data_governance]]（战略转向第 3 周期 / 本 sprint 第 7 周期 D2 = 战略推进 4-5 个完整周期 + 跨集团 V3 深化里程碑）
