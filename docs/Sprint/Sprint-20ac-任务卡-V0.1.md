# Sprint 20ac 任务卡 V0.1（2026-05-19 D2 long-time / Q1 next year 第 3 sprint / 跨集团 V2 backend 全集成 ✨ / 上下游 3 门户连接 ✨ / AI Wave 2 Day 21 80% 接管 checkpoint）

**Sprint**：20ac（**Q1 next year 第 3 sprint** / 接续 Sprint 20ab 微信小程序 Wave 2 + AI Wave 2 Day 14 中段后 / **跨集团 V2 backend 全集成 ✨ + 上下游 3 门户连接 ✨ + AI Wave 2 Day 21 80% 接管 checkpoint**）
**主题**：**跨集团 V2 backend 全集成（数据共享 V2 + 服务集成 + 接口规范 V2 / ~0.5 PD）+ 上下游 3 门户连接（供应商 + 客户 + 物流 / second 主导 ~0.6 PD）+ AI Wave 2 Day 21 80% 接管 checkpoint（3 角色）**
**节奏**：main V0.11（Sprint 20ab）已 ready / V0.12 续接 Sprint 20ac+ / 工作量 ~1.2 PD 主线 + 0.6 PD second（上下游 3 门户 frontend）+ AI Wave 2 持续 0.3 PD（Day 21 80% 接管）/ wall-clock 5-7 天
**性质**：**Q1 next year 第 3 sprint + 跨集团 V2 backend 全集成 sprint + 上下游 3 门户连接 sprint + AI Wave 2 Day 21 80% 接管 sprint**（四重性质 / Sprint 20ab Wave 2 + AI Wave 2 Day 14 ≥ 80% 后 / 第 8 周期主推 sprint）

**V0.1 起草要点**（main 长时间工作模式 / 2026-05-19 D2 long-time / Wave 6 自我安排 / Sprint 20ab V0.1 起草后续接）：

- **跨集团 V2 backend 全集成** ✨（数据共享协议 V2 + Federation 升级 + ERP/财务/HR 服务集成 + OpenAPI 3 接口规范 V2 + GraphQL 可选评估 / main 主导 ~0.5 PD）
- **上下游 3 门户连接** ✨（供应商门户 + 客户门户 + 物流门户 3 门户并行 / second 主导 frontend ~0.6 PD + 子代理 c+d 并行 0.7 PD）
- **AI Wave 2 Day 21 80% 接管 checkpoint**（PM + 决策模板员 + 升版员 3 角色 / 50% → 80% 接管 / Day 14 ≥ 80% 后第 3 周深化）

---

## §1 基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2027-02 月初（Sprint 20ab D5+ 满后 / Q1 next year 第 3 sprint）|
| main 主线工作量 | ~1.2 PD（5 task / T-A1-A5 / 跨集团 V2 backend 全集成 + 上下游 3 门户编排 + AI Wave 2 Day 21 + Codex + 收尾）|
| second 副线工作量 | ~0.6 PD（**上下游 3 门户 frontend 主线** / T-E1 / 供应商门户 + 客户门户 + 物流门户 / wall-clock 折算 0.6 PD）|
| **AI Wave 2 持续工作量** | **~0.3 PD（持续 ✨）**（3 角色 Day 21 checkpoint 准备 + 50% → 80% 接管评估）|
| wall-clock | 5-7 天（Day 1 跨集团 V2 backend 启动 + AI Wave 2 Day 21 checkpoint / Day 2-3 上下游 3 门户连接深化 + 服务集成 / Day 4-5 接口规范 V2 + Codex Round 30 + 收尾 / Day 6-7 长尾 wall-clock）|
| Sprint 性质 | **Q1 next year 第 3 sprint + 跨集团 V2 backend 全集成 + 上下游 3 门户连接 + AI Wave 2 Day 21 80% 接管**（四重性质 sprint / Q1 next year 主推 sprint）|
| 前置 Sprint | Sprint 20ab D5 满 + 微信小程序 Wave 2 稳定（合同审批 + 凭证审核 + 我的 真上线）+ AI Wave 2 Day 14 ≥ 80% + cici Q1 B 持续 + cici Q7 B 上下游门户连接拍板 + 跨集团 ERP/财务/HR 集成准备 ≥ 60% |
| 后续 Sprint | Sprint 20ad（Q1 next year 第 4 sprint / AI Wave 2 Day 30 出 onboarding 终验 + 平台化 V1.0 启动 + 跨集团第 8 周期闭环）|
| Sprint 顺延目标 | **57 Sprint 0 顺延 ✨ + 跨集团 V2 backend 全集成 ✨ + 上下游 3 门户连接 ✨ + AI Wave 2 Day 21 80% 接管 ✨**（四重里程碑达成）|

---

## §2 Day 1-7 Task 占位（A 主轨 5 task / 总 ~1.2 PD + AI Wave 2 持续 0.3 PD + E 副轨 0.6 PD 上下游 3 门户 frontend 主线）

### A 主轨（main 主代理 a / 跨集团 V2 backend 全集成 + 上下游 3 门户编排 + AI Wave 2 Day 21 / 共 5 task / 1.2 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 跨集团 V2 backend 全集成（数据共享 V2 + 服务集成 + 接口）| 0.5 | **P0** | main 主代理 a | ① **数据共享协议 V2**（Sprint 20ab 数据共享 V2 基础上深化 / Federation 升级 / 跨集团 master data 同步增量算法实施 / 跨集团 transaction 审计 V2 实施 / 跨集团 RBAC 矩阵 V2 实施 / 跨集团数据隔离深化实施）② **服务集成（ERP / 财务 / HR / CRM）**（NC ERP 凭证导出实施续接 + 金蝶财务接口对接 PoC 实施 + 用友 HR 同步 PoC 实施 + CRM 客户主数据同步 PoC 占位 / 标准 RESTful 适配层 V0.3 落地 / 重试 + 限流 + 熔断 + 链路追踪 + 监控 5 件套）③ **接口规范 V2**（OpenAPI 3 全量发布 + GraphQL 可选评估 / 接口版本化策略 + 兼容性矩阵 + Sandbox 环境 + 接口治理）④ Federation 跨集团协议升级（数据流闭环 + 协议向后兼容 + 灰度发布）⑤ 写到 `docs/internal/sprint-20ac-cross-group-v2-backend-integration-V0.1.md` ≥ 150 行 | Sprint 20ab T-A1 done + cici Q1 B 持续拍板 done + 跨集团 ERP/财务/HR 集成准备 ≥ 60% | 跨集团 V2 backend 全集成 done / 数据共享 V2 + 服务集成 + 接口规范 V2 三轴齐头 / Federation 升级 done / V0.1 ≥ 150 行 |
| **T-A2** 上下游门户 3 连接（供应商 + 客户 + 物流 / main 编排 + 子代理 c+d 并行）| 0.3 | **P0** | main 主代理 a（编排 / 拍板 / 收口）+ 子代理 c（供应商 + 客户 0.4 PD）+ 子代理 d（物流 0.3 PD）| ① **子代理 c 供应商门户 + 客户门户**（2 门户 / 0.4 PD / 供应商门户：投标 + 报价 + 中标查询 + 收款进度 + 评价 / 客户门户：订单 + 物流追踪 + 售后申请 + 对账 + 评价 / API 复用合同模块 + 财务模块 + 订单模块 + 售后模块）② **子代理 d 物流门户**（1 门户 / 0.3 PD / 物流门户：配送任务 + 路线优化 + 异常 + 签收 + 结算 / API 复用物流模块 + 结算模块 / 路线优化算法占位）③ **3 门户接口规范统一**（OpenAPI 3 三门户统一 + 鉴权统一 + 限流统一）④ **3 门户权限矩阵**（外部用户 RBAC 矩阵 + 跨集团权限隔离 + 临时权限授予）⑤ **3 门户业务流程闭环**（采购全流程闭环 + 销售全流程闭环 + 物流全流程闭环）⑥ 写到 `docs/internal/sprint-20ac-upstream-downstream-3-portals-connection-V0.1.md` ≥ 120 行 | T-A1 done + cici Q7 B 上下游门户连接拍板 done | 3 门户连接 done / 供应商门户 + 客户门户 + 物流门户齐头 / 3 门户接口规范统一 done / 业务流程闭环 done / V0.1 ≥ 120 行 / **上下游门户连接历史里程碑达成 ✨** |
| **T-A3** AI Wave 2 Day 21 80% 接管 checkpoint（3 角色 50% → 80% 接管评估）| 0.2 | **P0** | main 主代理 a | ① **PM 角色 Day 21 checkpoint**（第 3 周 50% 评估 / Sprint 协调准确率 ≥ 85% / 任务卡起草质量 ≥ 8/10 / 进入第 4 周 80% 接管 / cici 抽样审核 / 50% → 80% 接管平滑过渡）② **决策模板员 Day 21 checkpoint**（决策点识别准确率 ≥ 85% / 决策模板起草质量 ≥ 8/10 / cici 抽样审核 / 进入第 4 周 80% 接管 / 50% → 80% 接管平滑过渡）③ **升版员 Day 21 checkpoint**（V0.x 升版准确率 ≥ 95% / 教训 13 6 步模板遵守率 100% / 进入第 4 周 80% 接管 / 50% → 80% 接管平滑过渡 / 教训 13 第 14 次实测）④ **3 角色全 ≥ 80% 评估**（任 1 角色未达延迟 1 周 / Day 21 进度仪表板更新）⑤ **50% → 80% 接管机制**（per 角色独立切换 / cici 审核窗口 / 80% 接管后 cici 仅复核 ≥ 20% 抽样）⑥ AI 团队 dashboard 更新（Wave 2 Day 21 进度 / 80% 接管里程碑达成）⑦ 写到 `docs/AI-Team/Wave-2-Day-21-checkpoint-Sprint-20ac-V0.1.md` ≥ 120 行 | Sprint 20ab T-A2 done + AI Wave 2 Day 14 ≥ 80% done + AI Wave 2 三角色 50% 接管稳定 ≥ 7 天 | AI Wave 2 三角色 Day 21 checkpoint 全 done / 3 角色全 ≥ 80% 评估 done / 50% → 80% 接管机制 done / dashboard 更新 done / **AI Wave 2 80% 接管里程碑达成 ✨** |
| **T-A4** Codex Round 30 立修 + 复测 + 0 收敛目标（Sprint 20o R5 / 20p R12 / 20q-20ab R13-29 连续后第 16 次 0 收敛追求）| 0.1 | P0 | main 主代理 a | 标准 Codex 立修 + 复测 / 0 finding 收敛目标 / 验证规则参考 [[feedback_codex_false_positive_verify_first]] raw SQL + EF Fluent + partial index 三处 / 涉及跨集团 V2 backend 全集成 + 上下游 3 门户连接 + AI Wave 2 Day 21 checkpoint 三类新文档评审 / second 上下游 3 门户 frontend 代码（供应商 + 客户 + 物流）也纳入 Codex 评审范围 / 子代理 c+d 实施代码独立 Codex 评审 | Sprint 20ab T-A4 R29 done + T-A1 + T-A2 + T-A3 + T-E1 全 done | Codex Round 30 finding 全立修 / 复测全通过 / 0 收敛达成（连续 16 次 0 收敛追求）|
| **T-A5** Sprint 20ac 收尾 commit + V0.x 升版 + memory 升级 + Sprint 20ad V0.1 起草 | 0.1 | P0 | main 主代理 a | ① Sprint 20ac 任务卡 V0.x 升版（教训 13 6 步模板 / 第 14 次实测 / graduate 后第 9 次延续验证）② memory 升级（**57 Sprint 0 顺延 + 跨集团 V2 backend 全集成 ✨ + 上下游 3 门户连接 ✨ + AI Wave 2 Day 21 80% 接管 ✨** 四重里程碑）③ Sprint 20ad V0.1 起草占位（Q1 next year 第 4 sprint / AI Wave 2 Day 30 出 onboarding 终验 + 平台化 V1.0 启动 + 跨集团第 8 周期闭环）④ Sprint 20ac 收尾 commit | T-A1-A4 + T-E1 全 done + Codex 0 收敛 | V0.x 锁版 / memory commit / Sprint 20ad V0.1 占位 done / Sprint 20ac 收尾 commit 1 个 / 四重里程碑达成 ✅ |

**main 总：~1.2 PD**（vs Sprint 20ab 0.8 PD / 跨集团 V2 backend 主推 sprint 工作量上升 / 跨集团 V2 backend 全集成 + 上下游 3 门户编排占主 / 主线协调 + 编排 + 拍板 + 收口）

### E 副轨（second 主代理 e / **上下游 3 门户 frontend 主线** ✨ / 共 1 task 3 子门户 / 0.6 PD wall-clock）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-E1** **上下游 3 门户 frontend** ✨（second 主导 / 配套 main T-A2 编排）| 0.6（3 子门户 wall-clock 折算 0.6 PD / second 编排 + 3 子代理 spawn）| pending | ① **供应商门户 frontend supplier-portal-frontend** 0.2 PD（投标列表 + 报价表单 + 中标查询 + 收款进度看板 + 评价表单 / API 复用 main T-A2 子代理 c 接口 / DevExtreme + ExcelJS 复用 Catio 技术栈 / RBAC 适配）② **客户门户 frontend customer-portal-frontend** 0.2 PD（订单列表 + 物流追踪 + 售后申请表单 + 对账单下载 + 评价表单 / API 复用 main T-A2 子代理 c 接口 / 客户档案 + 满意度调查）③ **物流门户 frontend logistics-portal-frontend** 0.2 PD（配送任务列表 + 路线优化地图 + 异常上报 + 签收确认 + 结算单 / API 复用 main T-A2 子代理 d 接口 / 地图组件占位）|

**second 总：~0.6 PD wall-clock**（3 子门户 wall-clock 0.6 PD / second 编排 + 3 子代理 spawn / 上下游 3 门户连接历史里程碑 frontend 配套 / 7 page MVP 后续展 3 门户 = 微信小程序 7 page + 上下游 3 门户 = 累计 10 page 体系）

---

## §3 跨集团 V2 backend 全集成 detail（main 主导 / 历史里程碑 ✨ / 跨集团第 8 周期主推）

### §3.1 数据共享协议 V2 + Federation 升级

| 维度 | 内容 |
|---|---|
| **跨集团 master data 同步增量算法** | 基于 timestamp + version 的增量同步 / 冲突解决策略（last-write-wins + manual review）/ 全量校验定时任务（每周一次）/ 数据一致性监控 dashboard / 同步 SLA ≤ 5 min |
| **跨集团 transaction 审计 V2** | 跨集团交易审计链路深化 / 不可篡改日志（append-only）/ 区块链占位评估（如 cici Q5 试点 / 私有链 + 联盟链 / Ethereum vs Hyperledger Fabric 评估）/ 审计报表（日 / 周 / 月）|
| **跨集团 RBAC 矩阵 V2** | 跨集团 RBAC 矩阵深化 + 数据隔离深化 + 跨集团访问审批工作流 + 临时权限授予（24 hr / 7 day / 30 day 三档）+ 权限审计日志 |
| **跨集团数据隔离深化** | 行级数据隔离（org_id + group_id 双维度）+ 列级数据脱敏（敏感字段脱敏中间件）+ 跨集团报表汇总策略（汇总不下钻 / 下钻需审批）|
| **Federation 升级** | Sprint 20aa-20ab Federation 基础上升级 / 跨集团协议向后兼容 + 灰度发布 + 协议版本协商机制 / Federation gateway 多活部署 |

### §3.2 服务集成（ERP / 财务 / HR / CRM）

| 服务 | 内容 |
|---|---|
| **NC ERP 凭证导出实施续接** | Sprint 17a-19q 单边架构保留备件 + 主线凭证导出延续 + 接口预留续接 + 财务方手动导入流程优化 + 凭证模板 V0.3 升级（12 列 + 业务方反馈） |
| **金蝶财务接口对接 PoC 实施** | 部分单位用金蝶 / 标准 RESTful 适配层 PoC 实施 / 凭证导出 + 报表查询实施 / WireMock chaos 5 场景测试 / Polly 三层防御 |
| **用友 HR 同步 PoC 实施** | 人员组织 master 同步 PoC 实施 / 标准 RESTful 适配层 / 人员变更通知机制（webhook + polling 双轨）/ 同步 SLA ≤ 30 min |
| **CRM 客户主数据同步 PoC** | 占位评估 / 客户主数据 + 联系人 + 跟进记录同步 / Salesforce + 用友 CRM + 钉钉 CRM 三选一调研 |
| **标准 RESTful 适配层 V0.3** | 统一接口规范 + 重试 + 限流 + 熔断 + 监控 + 链路追踪 5 件套 / OpenAPI 3 + Polly + Polly.Extensions.Http + Serilog + OpenTelemetry |

### §3.3 接口规范 V2

| 维度 | 内容 |
|---|---|
| **OpenAPI 3 全量发布** | 跨集团所有接口 OpenAPI 3 文档 / Swagger UI 在线浏览 / 接口示例 + 错误码 + 鉴权说明 / 接口治理 dashboard |
| **GraphQL 可选评估** | GraphQL 适用场景评估（聚合查询 + 跨集团数据） / HotChocolate vs Strawberry Shake 选型 / PoC 实施评估 / cici Q8 决策点 |
| **接口版本化策略** | URL 版本化（/v1/ /v2/）+ Header 版本化 + 兼容性矩阵 + 废弃接口下线策略（提前 90 天通知） |
| **Sandbox 环境** | 跨集团 Sandbox 环境 + Mock 数据 + 接口压测工具 + 接口治理 |
| **接口治理** | 接口注册中心 + 接口监控 + 接口性能仪表板 + 接口审批工作流 |

### §3.4 跨集团 V2 backend 风险防御

| 风险 | 防御 | 触发回退条件 |
|---|---|---|
| **Federation 升级协议不兼容** | 协议向后兼容 + 灰度发布 + 协议版本协商机制 / 旧协议保留 6 个月 | 任 1 集团协议不兼容 → 立修兼容层 / 不阻塞升级 |
| **金蝶/用友接口对接失败** | WireMock chaos 5 场景 + Polly 三层防御 + 接口失败降级 | 任 1 接口对接失败 ≥ 3 次 → 立修对接逻辑 / 不阻塞 PoC |
| **跨集团数据同步延迟** | 增量算法 + SLA ≤ 5 min + 监控 dashboard + 告警 | 同步延迟 ≥ 10 min → 立修同步算法 |
| **GraphQL 选型不当** | PoC 实施评估 + cici Q8 决策点 + HotChocolate vs Strawberry Shake 对比 | PoC 失败 → 维持 OpenAPI 3 单选 / 不阻塞接口规范 V2 |
| **跨集团权限矩阵 V2 复杂度** | 临时权限授予 24/7/30 三档 + 权限审计日志 + cici 拍板 | 权限矩阵复杂度 ≥ 100 角色 → 简化 RBAC + 调整范围 |

---

## §4 上下游 3 门户连接 detail（main T-A2 编排 + 子代理 c+d 并行 / second T-E1 frontend 配套 / 历史里程碑 ✨）

### §4.1 供应商门户 supplier-portal

| 维度 | 内容 |
|---|---|
| **功能** | 投标列表（招标项目浏览 + 投标资格 + 投标文件上传）+ 报价表单（询价响应 + 报价单提交 + 报价历史）+ 中标查询（中标通知 + 中标合同下载 + 中标公示）+ 收款进度（应收账款查询 + 付款进度 + 发票申请 + 对账单）+ 评价（甲方评价 + 历史评价 + 信用分） |
| **API 复用** | 招投标模块 + 合同模块 + 财务模块 + 评价模块 / RESTful + RBAC 适配 |
| **业务流程闭环** | 招标公告 → 投标 → 评标 → 中标 → 合同 → 履约 → 验收 → 付款 → 评价（采购全流程闭环）|
| **权限** | 外部供应商用户 RBAC / 仅查看自身相关数据 / 跨集团权限隔离 / 临时权限授予（如询价响应窗口）|
| **业务价值** | 供应商自助化 / 减少人工沟通 / 流程透明 / 信用体系建立 |

### §4.2 客户门户 customer-portal

| 维度 | 内容 |
|---|---|
| **功能** | 订单列表（订单查询 + 订单状态 + 订单详情）+ 物流追踪（实时物流 + 配送进度 + 签收确认）+ 售后申请（售后表单 + 售后历史 + 工单跟踪）+ 对账（对账单下载 + 发票申请 + 历史对账）+ 评价（订单评价 + 客户满意度调查 + 评价历史） |
| **API 复用** | 订单模块 + 物流模块 + 售后模块 + 财务模块 + 评价模块 / RESTful + RBAC 适配 |
| **业务流程闭环** | 询价 → 报价 → 订单 → 生产 → 物流 → 签收 → 售后 → 对账 → 付款 → 评价（销售全流程闭环）|
| **权限** | 外部客户用户 RBAC / 仅查看自身订单 / 跨集团权限隔离 / 客户分级权限（VIP 客户专属服务）|
| **业务价值** | 客户自助化 / 物流透明 / 售后响应快 / 客户满意度提升 |

### §4.3 物流门户 logistics-portal

| 维度 | 内容 |
|---|---|
| **功能** | 配送任务列表（任务接收 + 任务详情 + 任务接单）+ 路线优化（地图展示 + 路线推荐 + 实时导航）+ 异常上报（异常类型 + 异常照片上传 + 异常处理跟踪）+ 签收确认（签收照片 + 签收人 + 签收时间 + GPS 定位）+ 结算（结算单查询 + 结算明细 + 历史结算）|
| **API 复用** | 物流模块 + 结算模块 + 地图模块（占位）/ RESTful + RBAC 适配 |
| **业务流程闭环** | 任务派发 → 接单 → 取货 → 运输 → 签收 → 异常处理 → 结算 → 评价（物流全流程闭环）|
| **权限** | 外部物流公司用户 RBAC / 仅查看自身任务 / 跨集团权限隔离 / 司机 vs 调度员分级权限 |
| **业务价值** | 物流商自助化 / 路线优化降本 / 异常实时处理 / 结算透明 |

### §4.4 上下游 3 门户共性

| 维度 | 内容 |
|---|---|
| **3 门户接口规范统一** | OpenAPI 3 三门户统一 / 鉴权统一（OAuth2 + JWT）/ 限流统一（1000 req/min per user）/ 错误码统一 |
| **3 门户权限矩阵** | 外部用户 RBAC 矩阵 + 跨集团权限隔离 + 临时权限授予 + 权限审计日志 |
| **3 门户基础设施** | 共用 API Gateway + 共用鉴权服务 + 共用监控 + 共用日志 + 共用文件存储 |
| **3 门户运营** | 用户注册审批工作流 + 用户行为分析 + 满意度调查 + 客服支持 + 帮助文档 |

### §4.5 上下游 3 门户风险防御

| 风险 | 防御 | 触发回退条件 |
|---|---|---|
| **外部用户身份伪造** | OAuth2 + JWT + IP 白名单 + 设备指纹 + 异常登录告警 | 异常登录 ≥ 3 次 → 账号锁定 + 人工审核 |
| **跨集团权限越权** | 行级数据隔离 + 列级数据脱敏 + 权限审计日志 + cici 抽样审核 | 越权事件 ≥ 1 次 → 立修权限矩阵 + 全量审计 |
| **门户性能不达标** | API 缓存 + CDN + 限流 + 监控 + 性能基线 | 响应时间 ≥ 3s → 立修缓存 + 限流策略 |
| **门户业务流程不闭环** | 业务流程图 + 端到端测试 + cici 业务方反馈窗口 | 业务方反馈不闭环 ≥ 3 次 → 立修流程设计 |
| **3 子代理并行 race** | spawn 时明确协调 + isolation worktree + pathspec 严格 / 教训 13 第 14 次实测延续 | race 检测 → 立修 + 串行化 |

### §4.6 上下游 3 门户 子代理 spawn 协调

| 维度 | 子代理 c（供应商 + 客户）| 子代理 d（物流）|
|---|---|---|
| **PD** | 0.4 PD（2 门户）| 0.3 PD（1 门户）|
| **模块** | supplier-portal + customer-portal | logistics-portal |
| **API 复用** | 招投标 + 合同 + 财务 + 评价 + 订单 + 物流 + 售后 | 物流 + 结算 + 地图（占位）|
| **isolation** | worktree（spawn 默认 / pathspec 严格）| worktree（spawn 默认 / pathspec 严格）|
| **协调** | main T-A2 编排 / spawn 单 message 双子代理并行 / wall-clock ~0.4 PD | main T-A2 编排 / 与子代理 c 文件域不交叉 |
| **race 防御** | 教训 13 第 14 次实测 / git stash + isolation worktree + pathspec 严格 | 同 |
| **commit 时序** | 子代理 c 先 commit / 子代理 d 后 commit / main 收口 push | 同 |

---

## §5 触发条件（5 项）

| 条件 | 内容 | 状态 |
|---|---|---|
| **C-1** | Sprint 20ab D5 满（微信小程序 Wave 2 done + AI Wave 2 Day 14 ≥ 80% + 跨集团第 8 周期演进续 三重里程碑达成）| ⏳ 待 Sprint 20ab D5 |
| **C-2** | AI Wave 2 Day 14 ≥ 80% 接管 ✅（PM + 决策模板员 + 升版员 三角色 50% 接管稳定 ≥ 7 天 / Sprint 20ab T-A2 done）| ⏳ 待 Sprint 20ab AI Wave 2 Day 14 |
| **C-3** | 跨集团第 8 周期演进决策（cici Q1 B 持续 / 跨集团 V2 backend 全集成 + Federation 升级 + ERP/财务/HR 服务集成 + 接口规范 V2 拍板）| ⏳ 待 cici Q1 B 持续拍板 |
| **C-4** | 上下游门户连接决策（cici Q7 B 拍板 / 供应商门户 + 客户门户 + 物流门户 3 门户同步启动 + 业务流程闭环 + 权限矩阵 + 运营策略）| ⏳ 待 cici Q7 B 拍板 |
| **C-5** | 跨集团 ERP / 财务 / HR 集成准备 ≥ 60%（NC ERP 凭证导出续接 + 金蝶 + 用友 PoC 准备完成 / Sprint 20ab T-A1 done）| ⏳ 待 Sprint 20ab T-A1 + 集成准备评估 |

**触发判断**：5/5 待 Sprint 20ab 完成 + cici 双决策（Q1 B 持续 + Q7 B 上下游门户连接）+ AI Wave 2 Day 14 评估 + 集成准备 ≥ 60% / Sprint 20ab D5 满 + 双决策达成 + 集成准备 ≥ 60% 后启动 Day 1

---

## §6 沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.1** | **2026-05-19 D2 long-time（main 自我安排长时间 Wave 6 / 跨日收尾累积 / Sprint 20ab V0.1 起草后续接）** | **Sprint 20ac V0.1 起草**：① **Sprint 20ac 主题：Q1 next year 第 3 sprint + 跨集团 V2 backend 全集成 ✨ + 上下游 3 门户连接 ✨ + AI Wave 2 Day 21 80% 接管**（四重性质 sprint）② **T-A1-A5 完整**（T-A1 跨集团 V2 backend 全集成 / T-A2 上下游门户 3 连接（子代理 c 供应商+客户 + 子代理 d 物流）/ T-A3 AI Wave 2 Day 21 80% 接管 checkpoint / T-A4 Codex Round 30 0 收敛追求 / T-A5 Sprint 20ac 收尾 commit）③ **§3 跨集团 V2 backend 全集成 detail 完整**（§3.1 数据共享 V2 + Federation 升级 + §3.2 服务集成 ERP/财务/HR/CRM + §3.3 接口规范 V2 + §3.4 风险防御）④ **§4 上下游 3 门户连接 detail 完整**（§4.1 供应商门户 + §4.2 客户门户 + §4.3 物流门户 + §4.4 3 门户共性 + §4.5 风险防御）⑤ **second 副轨 0.6 PD wall-clock**（T-E1 上下游 3 门户 frontend / 供应商 + 客户 + 物流 3 子门户）⑥ **触发条件 5 条 §5**（5/5 待 Sprint 20ab 完成 + cici 双决策 + AI Wave 2 Day 14 评估 + 集成准备 ≥ 60%）⑦ 工作量 1.2 PD 主线 + 0.6 PD second + **0.3 PD AI Wave 2 持续（Day 21 80% 接管）** / wall-clock 5-7 天 / **57 Sprint 0 顺延 ✨ + 跨集团 V2 backend 全集成 ✨ + 上下游 3 门户连接 ✨ + AI Wave 2 Day 21 80% 接管 ✨ 四重里程碑目标** |

---

**起草人**：main 主代理 a（2026-05-19 D2 long-time / 自我安排长时间工作模式 / Wave 6 自我安排 / Sprint 20ac V0.1 起草）
**预期 Sprint 20ac Day 1 启动**：Sprint 20ab D5 满 + 微信小程序 Wave 2 稳定 + AI Wave 2 Day 14 ≥ 80% + cici 双决策（Q1 B 持续 + Q7 B 上下游门户连接）+ 集成准备 ≥ 60% 后（~ 2027-02 月初）

**起草上下文记录**：
- main V0.11 Sprint 20ab 已 ready / V0.12 续接 Sprint 20ac+（V0.13 待起草）
- 2026-05-19 D2 long-time main 自我安排长时间工作模式 / Wave 6
- cici Q1 next year 双拍板续接：Q1 B 跨集团第 8 周期演进续 + Q7 B 上下游门户连接 + AI Wave 2 30 天 onboarding 中段 → 第 4 周 80% 接管
- 历史里程碑 ✨ × 4：跨集团 V2 backend 全集成 + 上下游 3 门户连接 + AI Wave 2 Day 21 80% 接管 + 57 Sprint 0 顺延
- 累计 prompt 矩阵 ≥ 96 PD / 162+ task / 跨 34+ sprint
- Q1 next year 第 3 sprint = 跨集团 V2 backend + 上下游 3 门户 + AI Wave 2 Day 21 三轴并行
- 上下游 3 门户连接累计：供应商门户 + 客户门户 + 物流门户 = 3 门户 / second 3 子代理并行 0.6 PD
- AI Wave 2 30 天严格 onboarding 第 4 周 Day 21 checkpoint = 50% → 80% 接管评估
- 四重里程碑目标 ✨：57 Sprint 0 顺延 + 跨集团 V2 backend 全集成 + 上下游 3 门户连接 + AI Wave 2 Day 21 80% 接管
- main V0.10 §3 已起草对应 main 任务 1.2 PD / 4 task 与本任务卡 §2 主轨对齐

**Related**：
- [`Sprint-20ab-任务卡-V0.1.md`](Sprint-20ab-任务卡-V0.1.md)（前序 / Q1 next year 第 2 sprint + 微信小程序 Wave 2 + AI Wave 2 Day 14 + 跨集团第 8 周期演进续 / D5 满触发本 sprint）
- [`Sprint-20aa-任务卡-V0.1.md`](Sprint-20aa-任务卡-V0.1.md)（Q1 next year 启动 sprint / 微信小程序 Wave 1 + AI Wave 2 引入 + 跨集团第 8 周期演进开始 / 上溯前序）
- [`Sprint-20q-任务卡-V0.7.md`](Sprint-20q-任务卡-V0.7.md)（cici Q1 next year AI Wave 2 + Q7 上下游门户连接 + Q1 B 跨集团第 8 周期 三项决策来源）
- [`Roadmap-Cycle8-V0.2.md`](Roadmap-Cycle8-V0.2.md)（Sprint 20ab T-A3 起草 / 第 8 周期主轴深化）
- [`Roadmap-Cycle8-V0.3.md`](Roadmap-Cycle8-V0.3.md)（本 sprint 后续起草占位 / 跨集团 V2 backend 全集成 + 上下游 3 门户连接闭环后）
