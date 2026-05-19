# Sprint 20r 任务卡 V0.3（2026-05-20 凌晨 cici 5 A 拍板收口应用 + Nova 联调启动 + 数据治理 P1 闭环 + 去 mock 第 1 批 + 5 batch 拍板延续 + 第 6 批 CMS-01 库存看板 P0 主推 + R-12+R-13 详化 + 业务方反馈第 2 轮渐进式 / 业务方反馈 + 新模块开局 + Nova 联调启动 sprint）

**Sprint**：20r（占位 / **启动条件**：Sprint 20q D5 满 + cici 第 6 批顺序拍板（已 A）+ Codex Round 19 finding ≤ 10 + Nova 联调启动条件满 / 预计 2026-05-26 启动 / 第 4 周期 5 Sprint 第 3 阶段 / 配 Sprint 20u CMS-01 库存看板开发主推启动 / **Nova 联调启动里程碑**）
**主题**：**Nova 联调启动（cici D4 A 拍板）** + **数据治理 P1 闭环（M-18 + 06 期初）+ 去 mock 第 1 批（cici D1+D2+D3 A 拍板）** + 业务方反馈第 2 轮整合 + R-12+R-13 启动 + **第 6 批 CMS-01 库存看板 P0 backend skeleton（cici 早晨拍板 A 应用）** + Codex Round 19 立修
**节奏**：roadmap V0.1 §2.3 占位「审批 + NC 真联调启动」/ V0.2 修正为「业务方反馈陆续返回后第 2 sprint + R-12+R-13 + CMS-01 库存看板 backend 开局（配 20u 主推）」/ **V0.3 收口模式延伸「Nova 联调启动 + 数据治理 P1 闭环 + 去 mock 第 1 批」** / 工作量 ~1.4 PD main + ~0.6 PD second（共 ~2.0 PD / wall-clock 2-3 天）
**性质**：**业务方反馈整合 + 新模块开局 + Nova 联调启动 sprint**（vs Sprint 20q 协调 + 验证 sprint / vs Sprint 20l-20m 数据治理开发 sprint / vs Sprint 20u CMS-01 库存看板纯开发 sprint）

**V0.2 → V0.3 升版要点**（cici 2026-05-20 凌晨 5 A 拍板收口应用 / main 整夜跑跨日收尾）：

- **5 A 拍板全 default 应用（收口模式）**：
  * **D1 缺口 priority** → **A（数据治理 → 采购 → 库存 → 合同/NC）** / Sprint 20r T-A2 数据治理 P1 闭环主推（priority 第 1 位）/ 采购库存合同 NC 按序补强
  * **D2 4 闭环顺序** → **A（评分顺序）** / Sprint 20r T-A2 + T-A3 按评分高低排列实施（评分 → 闭环 → 测试 → 业务方确认）
  * **D3 去 mock 第 1 批** → **A（migration-m18 + initial-stock-migration first）** / Sprint 20r T-A2 去 mock 第 1 批：M-18 数据迁移 handler + 06 期初库存迁移 handler / Sprint 20s 第 2 批 / Sprint 20t 第 3 批
  * **D4 Nova 联调启动** → **A（Sprint 20r D1）** / Sprint 20r T-A1 新增 Nova 联调启动 task / 业务方反馈第 2 轮整合 + Nova 联调 sandbox 接通 + Polly 三层 + WireMock chaos 5 场景
  * **D5 NC 真上线** → **A（Sprint 20s D1 / 李建颖+汤云龙）** / Sprint 20r T-A5 起草 Sprint 20s V0.3（NC 真上线 + 李建颖 / 汤云龙对接人明确）/ Sprint 20r 不实施 NC 真上线（顺延 Sprint 20s D1）

- **V0.2 5 batch 拍板延续保留**：Batch 1（第 6 批顺序 A CMS-01 优先）+ Batch 2（第 2 批 A 等白音华）+ Batch 3（D2 today）+ Batch 4（20q V0.5 回填）+ Batch 5（Q5 重拍 + 设备 A + Clauses A 顺延）/ 全部 V0.2 应用方式不变 / V0.3 在 V0.2 基础上扩 5 A 收口拍板

---

## 一、基本信息

| 维度 | 内容 |
|---|---|
| **启动日期** | Sprint 20q D5 满后 ~ 2026-05-26（占位 / 触发条件满足后 cici 拍板）|
| **wall-clock 估算** | 2-3 天（main 主轨 2 天 + 业务方反馈陆续到位持续 wall-clock + Nova 联调 sandbox wall-clock）|
| **main 主轨 PD** | ~1.4 PD（T-A1-A5 / 整合 + **Nova 联调启动** + **数据治理 P1 闭环 + 去 mock 第 1 批** + CMS-01 backend skeleton + Codex Round 19 + memory）|
| **second 副轨 PD** | ~0.6 PD（Wave AJ / T-EAJ1-EAJ3 / CMS-01 skeleton + 库存优化 + approval polish / 第 16 次连续）|
| **总 PD** | ~2.0 PD |
| **顺延目标** | **46 Sprint 0 顺延**（Sprint 20q 45 之后续 / Sprint 20q done = 45 / Sprint 20r done = 46）|
| **触发条件状态** | ⏳ pending（Sprint 20q D5 满 / cici 早晨已拍 + 凌晨 5 A 收口拍板 / Codex Round 19 finding ≤ 10 / Nova 联调启动条件满）|
| **Nova 联调启动里程碑** | **Sprint 20r D1**（cici D4 A 拍板 / Nova 集成 sandbox / Polly 三层 + WireMock chaos 5 场景 / 业务方反馈第 2 轮整合配套）|
| **数据治理 P1 闭环里程碑** | **Sprint 20r T-A2**（cici D1+D2+D3 A 拍板 / M-18 + 06 期初去 mock 第 1 批 / 迁移看板）|

---

## 二、cici 2026-05-19 早晨 5 batch 拍板应用章节

### 2.1 5 batch 拍板原文 + 应用方式

| Batch | cici 拍板 | 应用位置 | 应用方式 |
|---|---|---|---|
| **Batch 1 第 6 批顺序** | A：CMS-01 库存看板 → 设备管理 → 合同模板 | Sprint 20r T-A2 / Sprint 20u P0 主推 | T-A2 从「N-Q2 设备管理」改为「CMS-01 库存看板 P0 backend skeleton」/ 设备管理顺延 Sprint 20s+ / 合同模板顺延 Sprint 20s+ |
| **Batch 2 第 2 批 A 等白音华** | A：白音华反馈 ≥ 8/9 到位后启动 | Sprint 20r T-A1 业务方反馈第 2 轮整合 | T-A1 主轨触发条件改为「白音华反馈 ≥ 5/9 启动整合 / ≥ 8/9 R-12+R-13 拍板 / ≥ 9/9 V0.2 task 锁定」/ 与 Sprint 20q D5 业务方反馈跟踪表联动 |
| **Batch 3 D2 today** | today：D2 任务今天启动 | Sprint 20q D2 / Sprint 20r 不直接受影响 | Sprint 20q D2 today 启动 / Sprint 20r 受益于 20q 完整收口（C-1 触发条件）|
| **Batch 4 20q V0.5 回填** | V0.5 回填：Sprint 20q V0.5 收口后回填 Sprint 20r 前置事实 | Sprint 20r §一 前置事实（Sprint 20q V0.5 收口数字）| Sprint 20q V0.5 收口数据（commits / Codex / 0 顺延数 / 关键里程碑）回填 Sprint 20r 启动前置事实块 |
| **Batch 5 Q5 重拍 + 设备 A + Clauses A 顺延** | 设备 A 顺延 / Clauses A 顺延 Sprint 20s+ | Sprint 20r T-A2 范围限定 / Sprint 20s+ V0.1 起草 | T-A2 范围限定为 CMS-01 库存看板 P0 / 设备 + 合同模板 顺延 Sprint 20s V0.1 占位 / Sprint 20r 不实施 |

### 2.2 拍板应用结果

- Sprint 20r 第 6 批 P0 候选范围从「设备管理 + 合同模板 + CMS-01」3 个 → 收敛到「CMS-01 库存看板单一 P0」
- Sprint 20s+ 续接「设备管理 P0 backend skeleton」（第 6 批顺序第 2 个）
- Sprint 20t+ 续接「合同模板 P0 backend skeleton」（第 6 批顺序第 3 个）
- Sprint 20u 启动「CMS-01 库存看板纯开发 sprint」（接力 Sprint 20r T-A2 skeleton / 全栈开发 0.6-0.8 PD）

### 2.5 cici 2026-05-20 凌晨 5 A 拍板应用章节（收口模式 / V0.3 新增）

| 拍板编号 | cici 拍板 | 应用位置 | 应用方式 | 触发条件 |
|---|---|---|---|---|
| **D1 缺口 priority** | **A：数据治理 → 采购 → 库存 → 合同/NC** | Sprint 20r T-A2 主推 priority 第 1 位 / Sprint 20s+ 续接 | T-A2 数据治理 P1 闭环（M-18 + 06 期初）放第 1 位 / Sprint 20s 采购缺口补 / Sprint 20t 库存缺口补 / Sprint 20u 合同 + Sprint 20s NC 缺口补 | Sprint 20r D1 启动 |
| **D2 4 闭环顺序** | **A：评分顺序** | Sprint 20r T-A2 + T-A3 按评分高低排列 | T-A2 数据治理 P1（评分最高 / cici D1 priority 第 1 位）→ T-A3 R-12+R-13（评分次高 / 业务方反馈触发）→ T-A1 业务方反馈整合 + Nova 联调（评分第 3 / wall-clock 跨多 day）→ T-A4 Codex Round 19（评分第 4 / 收尾 priority）| Sprint 20r D1-D4 按序实施 |
| **D3 去 mock 第 1 批** | **A：migration-m18 + initial-stock-migration first** | Sprint 20r T-A2 数据治理 P1 闭环子任务 | 第 1 批：M-18 数据迁移 handler 去 mock（接通真 Nova endpoint）+ 06 期初库存迁移 handler 去 mock（接通真物资公司 001.007.001+002+018）/ 第 2 批：Sprint 20s（NC 凭证导出 + 数据治理 handler 余下 4 个）/ 第 3 批：Sprint 20t（设备 audit + 合同审批）| Sprint 20r D1 启动数据治理 P1 闭环 |
| **D4 Nova 联调启动** | **A：Sprint 20r D1** | Sprint 20r T-A1 新增 Nova 联调启动子任务 | Nova 集成 sandbox 接通（业务方提供 endpoint + token）+ Polly 三层（retry + circuit-breaker + timeout）+ WireMock chaos 5 场景（401 / 500 / timeout / partial-success / rate-limit）+ OAuth2 client_credentials 5 要点（single-flight + RefreshBuffer + 401 requestFactory retry + Token 状态暴露 + WireMock chaos）/ 与 17a OAuth2 模式对齐 / 业务方反馈第 2 轮整合配套（白音华 ≥ 5/9 到位触发整合启动）| Sprint 20r D1 启动 / Nova sandbox 业务方提供 endpoint + token |
| **D5 NC 真上线** | **A：Sprint 20s D1 / 李建颖+汤云龙** | Sprint 20r T-A5 起草 Sprint 20s V0.3 NC 真上线 task | NC 真上线对接人明确：财务=李建颖 / 物资=汤云龙（2026-05-16 PO 会议拍板延续）/ Sprint 20r 不实施（顺延 Sprint 20s D1）/ T-A5 起草 Sprint 20s V0.3 占位 NC 真上线 task（含 NC sandbox → 真 endpoint 切换 + 凭证导出 → 真 NC 注入切换 + 6 业务单按钮 → 真 NC 凭证号映射）| Sprint 20r D5 收口 / Sprint 20s D1 启动 |

### 2.6 5 A 拍板应用闭环说明

- **D1 + D2** 联合：缺口 priority + 闭环顺序 = T-A2 数据治理 P1 第 1 位 + T-A3 R-12+R-13 第 2 位 + T-A1 反馈整合 + Nova 联调第 3 位 + T-A4 Codex Round 19 第 4 位
- **D3** 嵌入 T-A2：去 mock 第 1 批（M-18 + 06 期初）作为数据治理 P1 闭环的核心子任务
- **D4** 嵌入 T-A1：Nova 联调启动（Sprint 20r D1 ✨）作为业务方反馈第 2 轮整合的配套子任务
- **D5** 嵌入 T-A5：Sprint 20s V0.3 NC 真上线起草（李建颖+汤云龙对接人明确）
- **收口模式**：V0.3 升版即 cici 5 A 拍板的代码与文档落地准备 / 不抢业务方反馈节奏 / 与 V0.2 5 batch 拍板叠加生效

---

## 三、Day 1-5 task 占位

### A 主轨（main 主代理 / 共 5 task / ~1.0 PD）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 业务方反馈第 2 轮整合（5/9 → 8/9 → 9/9 渐进式）+ **Nova 联调启动（cici D4 A 拍板）** | 0.3 | P0 | main 主代理 a + cici 拍板 | **cici D4 A 拍板应用：Sprint 20r D1 Nova 联调启动** / 主任务双轨：① 业务方反馈第 2 轮整合（Sprint 20q 白音华为主 / 试点单位库存 + 采购 + 合同 demo + 凭证导出 + 数据治理 + 设备 audit）→ 反馈分类（UI / 业务规则 / 数据 / 性能 / 文案）→ 立修 priority 排序 → 反馈 → commit 映射表 → 业务方反馈跟踪表更新 ② **Nova 联调启动**：Nova sandbox endpoint + token 接通（业务方提供）+ Polly 三层（retry + circuit-breaker + timeout）+ WireMock chaos 5 场景（401 / 500 / timeout / partial-success / rate-limit）+ OAuth2 client_credentials 5 要点（single-flight + RefreshBuffer + 401 requestFactory retry + Token 状态暴露 + WireMock chaos）+ 与 17a OAuth2 模式对齐 / 双轨写到 `docs/internal/sprint-20r-feedback-batch2-integration.md` + `docs/internal/sprint-20r-nova-integration-bootstrap.md` | 白音华反馈 ≥ 5/9 到位（Batch 2 A 拍板触发）+ Nova sandbox endpoint + token 业务方提供（cici D4 A 拍板触发）| 双轨整合报告 ≥ 120 行 / 含反馈分类 + 优先级 + 反馈→commit 映射 + 跟踪表更新 + Nova sandbox 接通报告 + Polly 三层验证 + WireMock chaos 5 场景测试通过 |
| **T-A2** **数据治理 P1 闭环（M-18 + 06 期初）+ 去 mock 第 1 批（cici D1+D2+D3 A 拍板）** + 第 6 批 CMS-01 库存看板 P0 backend skeleton | 0.6 | P0 | main 主代理 a + cici 拍板 | **cici D1 A priority 第 1 位 + D2 A 评分顺序 + D3 A 去 mock 第 1 批 三连拍板应用** / 主任务双轨：① **数据治理 P1 闭环 + 去 mock 第 1 批**（cici D1+D2+D3 A 拍板 / priority 第 1 位）：M-18 数据迁移 handler 去 mock（接通真 Nova endpoint）+ 06 期初库存迁移 handler 去 mock（接通真物资公司 001.007.001+002+018）+ 迁移看板（数据治理 P1 监控视图 / dashboard widget 占位 / migration-progress + handler-status + rollback-history）+ Sprint 20l-20m 6 handler 链路完整性验证（cross-handler 联调） ② 第 6 批 CMS-01 库存看板 P0 backend skeleton（cici 早晨 Batch 1 A 拍板延续 / 配 Sprint 20u 启动）：Domain entity skeleton（StockDashboardWidget + WidgetDataSource + WidgetLayoutConfig）+ Application AppService skeleton（GetDashboardAsync / GetWidgetListAsync / SubscribeAsync）+ Contracts DTO + IStockDashboardAppService skeleton + HttpApi Controller skeleton + Route /api/cms/stock-dashboard + EF migration skeleton + DbContext 注册（schema = `cms`）/ 双轨写到 `docs/internal/sprint-20r-data-governance-p1-closing.md` + `docs/internal/sprint-20r-cms01-stock-dashboard-skeleton.md` | Sprint 20q T-A1 第 6 批 5 候选评分输出 + cici 早晨 Batch 1 A 已拍 + cici 凌晨 D1+D2+D3 A 已拍 + M-18 + 06 期初 mock client 在仓（grep 验证） | 双轨完整度报告 ≥ 200 行 / 含 M-18 + 06 期初去 mock 实施 + 6 handler cross-handler 联调 + 迁移看板 widget 占位 + CMS-01 entity + AppService + Controller + migration skeleton / 与 Sprint 20u 主推 sprint 衔接说明 |
| **T-A3** R-12+R-13 实施（cici Day 1 拍板触发 / D2 A 评分顺序第 2 位）| 0.2 | P0 | main 主代理 a + cici 拍板 | Sprint 20q 业务方反馈第 2 轮归纳出 R-12+R-13 具体内容 / Sprint 20r D1 cici 拍板触发（cici D2 A 评分顺序应用 / 第 2 位）：① R-12 实施（占位描述待 cici 具体拍板 / 候选范围 1/2/3 / §四 详化）② R-13 实施（占位描述待 cici 具体拍板 / 候选范围 1/2/3 / §四 详化）③ commit + 测试 + 业务方确认 ④ Sprint 20r feedback-batch2 整合报告关联 + 数据治理 P1 闭环关联（如 R-13 候选范围 3 数据治理 handler 补强）/ 写到 commit message + memory | 白音华反馈 ≥ 8/9 到位（Batch 2 A 拍板触发 R-12+R-13）+ cici D1 拍板具体内容 + cici D2 A 评分顺序应用 | R-12+R-13 全 commit / 业务方反馈跟踪表 R-12+R-13 标 done / memory 升级 |
| **T-A4** Codex Round 19 立修 + 复测（D2 A 评分顺序第 3 位） | 0.1 | P0 | main 主代理 a | Sprint 20q 收尾 + Sprint 20r D1-D4 累计 Codex Round 19（预计 finding ≤ 10 / Round 18 收敛后续接 Round 19）/ ① finding 分类（false positive / 立修 / 顺延）② 立修 commit + 测试 ③ 复测 round 0 finding 收敛（Sprint 20o R5 + Sprint 20l Round 7 + Round 10+11+14 等 6 次 0 finding 收敛模式延续）/ 写到 commit message + memory | Codex Round 19 启动 + finding 数 ≤ 10 | Codex Round 19 0 finding 收敛 / 立修全 commit / memory 升级 |
| **T-A5** memory + **Sprint 20s V0.3 起草（NC 真上线 + 李建颖+汤云龙 / cici D5 A 拍板）** + audit V0.x 升版（D2 A 评分顺序第 4 位）| 0.2 | P0 | main 主代理 a + cici 拍板 | **cici D5 A 拍板应用：Sprint 20s V0.3 NC 真上线起草** / 三联子任务：① memory 升级（**46 Sprint 0 顺延** + Sprint 20r 业务方反馈整合 + **Nova 联调启动** + **数据治理 P1 闭环 + 去 mock 第 1 批** + R-12+R-13 + 第 6 批 CMS-01 backend skeleton 完整闭环 + Sprint 20u CMS-01 主推启动衔接 + Sprint 20s NC 真上线衔接）② **Sprint 20s V0.3 起草**（cici D5 A 拍板 / NC 真上线 D1 + 李建颖（财务）+ 汤云龙（物资）对接人明确 / 含：NC sandbox → 真 endpoint 切换 + 凭证导出 → 真 NC 注入切换 + 6 业务单按钮 → 真 NC 凭证号映射 + 设备管理 P0 backend skeleton 第 6 批顺序第 2 位 + 数据治理 P2 去 mock 第 2 批 / 预计 ~1.5 PD）③ audit V0.x 升版 / 不 git add / 不 commit / main 收口 | Sprint 20r T-A1-A4 全 commit 完成 + cici D5 A 已拍 | memory commit / audit V0.x 锁版 / Sprint 20s V0.3 起草占位完成（≥ 220 行 / 含 NC 真上线 + 对接人 + 切换链路） |

**main 主轨总：~1.4 PD**

### E 副轨（second 主代理 e / Wave AJ / 第 16 次连续 / 共 3 task / ~0.6 PD）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-EAJ1** 第 6 批 CMS-01 库存看板 P0 前端 skeleton（与 main T-A2 配对）| 0.3 | pending | 复用 DevExtreme Dashboard 模板 / 接通 T-A2 Controller endpoint `/api/cms/stock-dashboard` / 实施 dashboard layout + widget skeleton（壳级别 / Sprint 20u walk-through 预留）/ 与 Sprint 20q T-E1 contract page 模式一致 / vite entry +1 |
| **T-EAJ2** 库存试点反馈优化前端（R-12+R-13 配对）| 0.2 | pending | R-12 / R-13 业务方反馈第 2 轮整合（UI 优化 / 业务规则细节 / 文案）/ 库存 4 单据 page polish / 与 main T-A1 反馈整合配对 / 累计 baseline 第 11 次 |
| **T-EAJ3** approval polish | 0.1 | pending | Sprint 20p T-EAG1 approval-center page 体验优化（cici Sprint 20q 反馈 / Wave AJ 收尾 polish） / 与 Sprint 20p approval 闭环模式延续 |

**second e 总：~0.6 PD**（Wave AJ / 第 16 次连续 / 累计模块切换：Reports → Dashboards → data-issue-log → data-import-template → orgs-users-pilot → contract → CMS-01 库存看板）

### D 顺延说明

- ~~D 线 NC 真上线~~：**顺延 Sprint 20s D1（cici D5 A 拍板 / 李建颖+汤云龙对接人明确）/ T-A5 起草 Sprint 20s V0.3 占位**
- ~~D 线 NC sandbox 联调（非 Nova）~~：**部分迁移 Sprint 20r T-A1（cici D4 A 拍板 Nova 联调启动 / NC 凭证导出 19r 模式延续保留）/ NC 真 endpoint 切换顺延 Sprint 20s D1**
- ~~设备管理 P0 backend skeleton~~：**顺延 Sprint 20s+（cici Batch 5 A 拍板）/ 第 6 批顺序第 2 位 / T-A5 Sprint 20s V0.3 起草含设备**
- ~~合同模板 P0 backend skeleton~~：**顺延 Sprint 20s+ 或 Sprint 20t（cici Batch 5 A 拍板 Clauses A 顺延）/ 第 6 批顺序第 3 位**
- ~~T-B1-B5 Sprint 20n-20q part 2 协调试点反馈~~：**持续 wall-clock 到位 / 不阻塞 Sprint 20r / 与 T-A1 反馈整合配套**
- ~~数据治理 P2 去 mock 第 2 批（NC 凭证导出 + 数据治理 handler 余下 4 个）~~：**顺延 Sprint 20s（cici D3 A 拍板 / 第 2 批排序）**
- ~~数据治理 P3 去 mock 第 3 批（设备 audit + 合同审批）~~：**顺延 Sprint 20t（cici D3 A 拍板 / 第 3 批排序）**

---

## 四、R-12+R-13 详化（cici Day 1 拍板触发 / 占位列）

### 4.1 R-12 详化（待 Sprint 20q D5 / Sprint 20r D1 cici 拍板触发具体内容）

| 维度 | 占位描述 | 触发条件 |
|---|---|---|
| **来源** | Sprint 20q 业务方反馈第 2 轮（白音华为主）归纳出的核心需求项 #1 | 白音华反馈 ≥ 8/9 到位（Batch 2 A 拍板触发）|
| **预估 PD** | ~0.1 PD（含在 T-A3 实施 task）| - |
| **候选范围 1** | 库存盘点细化（盘点单审批字段补强 / 差异调整规则）| 白音华反馈 G-11 / R-09 关联 |
| **候选范围 2** | 合同审批字段补强（合同 supplement 单审批流 / 关联工作流引擎）| 白音华反馈 G-9 / R-10 关联 |
| **候选范围 3** | 采购单业务规则细节（采购数量 vs 申购数量 vs 在途数量 校验）| 白音华反馈 G-3 / 采购协调反馈关联 |
| **占位列** | cici 拍板列：**待 Day 1 拍板**（候选范围 1/2/3 之一或组合）| - |
| **实施口径** | cici 拍板后 main 主代理 a 立即实施 / commit + 测试 + 业务方确认 | Sprint 20r D1 cici 拍板 R-12 具体内容 |

### 4.2 R-13 详化（待 Sprint 20q D5 / Sprint 20r D1 cici 拍板触发具体内容）

| 维度 | 占位描述 | 触发条件 |
|---|---|---|
| **来源** | Sprint 20q 业务方反馈第 2 轮（白音华为主）归纳出的核心需求项 #2 | 白音华反馈 ≥ 8/9 到位（Batch 2 A 拍板触发）|
| **预估 PD** | ~0.1 PD（含在 T-A3 实施 task）| - |
| **候选范围 1** | 跨模块关联补强（采购 → 入库 → 库存 → 出库 → 凭证 链路完整性）| 白音华反馈 G-12 / 协调试点反馈链路 |
| **候选范围 2** | 凭证导出格式细节（NC 凭证文件 12 列模板增列 / 备注字段格式）| 白音华反馈 G-11 / 凭证导出 19r D2 关联 |
| **候选范围 3** | 数据治理 handler 补强（试点数据 import + validate + apply 链路细化）| 白音华反馈 G-7 / Sprint 20l-20m handler 关联 |
| **占位列** | cici 拍板列：**待 Day 1 拍板**（候选范围 1/2/3 之一或组合）| - |
| **实施口径** | cici 拍板后 main 主代理 a 立即实施 / commit + 测试 + 业务方确认 | Sprint 20r D1 cici 拍板 R-13 具体内容 |

### 4.3 R-12+R-13 实施流程

1. Sprint 20q D5 业务方反馈 ≥ 8/9 到位 → 归纳 R-12+R-13 候选范围
2. Sprint 20r D1 cici 拍板 R-12+R-13 具体内容（候选范围 1/2/3 之一或组合）
3. main 主代理 a 立即实施（T-A3 / ~0.2 PD）
4. commit + 测试 + 业务方确认
5. memory 升级 + Sprint 20r feedback-batch2 整合报告关联

### 4.4 R-12+R-13 占位列编号约定

| 占位列字段 | 命名约定 | 示例 |
|---|---|---|
| R-12 具体内容 | `R-12: <候选范围 1/2/3>` | `R-12: 库存盘点细化（盘点单审批字段补强）` |
| R-13 具体内容 | `R-13: <候选范围 1/2/3>` | `R-13: 跨模块关联补强（采购→入库→库存→出库→凭证）` |
| 关联反馈编号 | `G-x` / `R-x` | `G-11 / R-09` |
| commit 关联 | `feat(...): R-12+R-13 实施` | commit message 含「R-12+R-13」关键词便于 grep |

---

## 五、业务方反馈第 2 轮（5/9 → 8/9 → 9/9 渐进式 / 白音华为主）

### 5.1 反馈到位节奏占位

| 反馈批次 | 到位时间窗 | 状态 | 主要内容占位 |
|---|---|---|---|
| **第 1 批** | Sprint 20q D2-D3 | ⏳ pending | 库存试点（Sprint 20n 4 单据 endpoint）+ 数据治理（Sprint 20l-20m 6 handler）反馈 |
| **第 2 批** | Sprint 20q D3-D5 | ⏳ pending | 采购试点（Sprint 20p ProcurementDocument）+ 凭证导出反馈 |
| **第 3 批** | Sprint 20q D5 - Sprint 20r D1 | ⏳ pending | 合同试点（Sprint 20q Contracts）+ 设备 audit 反馈 |

### 5.2 反馈整合工作流（T-A1 主要工作）

1. 反馈收集 → 业务方反馈跟踪表更新（沿用 Sprint 19q PO 协调模板）
2. 反馈分类（UI / 业务规则 / 数据 / 性能 / 文案）→ priority 排序
3. 立修 → commit + 测试 + 业务方确认
4. 顺延 → Sprint 20s+ 任务卡占位
5. 反馈 → commit 映射表（透明度保留）

### 5.3 反馈到位阈值（cici Batch 2 A 拍板应用）

| 阈值 | 行动 |
|---|---|
| **5/9 到位** | T-A1 整合启动（最低启动门槛 / Batch 2 A 拍板触发）|
| **8/9 到位** | R-12+R-13 cici 拍板 + Sprint 20r 正式启动（Day 1）/ T-A3 启动 |
| **9/9 到位** | Sprint 20r 完整 task 清单锁定 / V0.2 → V0.3 升版（如有需要）|

---

## 六、触发条件

### 6.1 启动触发条件（必须全部满足）

| 条件 | 状态 | 验证方式 |
|---|---|---|
| **C-1** Sprint 20q D5 满 | ⏳ pending | Sprint 20q V0.x 真正收口 + 45 Sprint 0 顺延达成 |
| **C-2** cici 第 6 批顺序拍板（CMS-01 优先）| ✅ **done**（cici 早晨 Batch 1 A 已拍）| Sprint 20q T-A1 第 6 批 5 候选评分 + cici Batch 1 A 拍 |
| **C-3** Codex Round 19 finding ≤ 10 | ⏳ pending | Sprint 20q 收尾 + Sprint 20r D1-D4 累计 Codex Round 19 启动 + finding 数 ≤ 10（Round 18 收敛后续接）|
| **C-4** Sprint 20q 业务方反馈 ≥ 5/9 到位（Batch 2 A 拍板触发）| ⏳ pending | 业务方反馈跟踪表 ≥ 5/9 标 done（白音华为主）|
| **C-5** Sprint 20q V0.5 收口数字回填 | ⏳ pending | Sprint 20q V0.5 收口数据回填 Sprint 20r §一 前置事实块（Batch 4 V0.5 回填拍板）|
| **C-6** **Nova sandbox endpoint + token 业务方提供**（cici D4 A 拍板触发）| ⏳ pending | Nova 集成 sandbox endpoint + OAuth2 client_credentials token 由业务方 / 物资公司 IT 提供 / T-A1 Nova 联调启动子任务前置 |
| **C-7** **M-18 + 06 期初 mock client 在仓 grep 验证**（cici D3 A 拍板触发 / [[carryover_task_verify_first]] 应用）| ⏳ pending | grep `MockMigrationM18Client` / `MockInitialStockMigrationClient` 类在仓 / T-A2 数据治理 P1 闭环去 mock 第 1 批前置 |

### 6.2 触发条件未满时的回退方案

| 未满条件 | 回退方案 |
|---|---|
| C-1 未满（Sprint 20q 延误） | Sprint 20r 启动延后 / 不强行紧续 / 沿用 Sprint 20q V0.2 Q1 B「间隔 1-2 天」节奏 |
| C-3 未满（Codex finding 数过多） | T-A4 工作量提升 / R-12+R-13 顺延 Sprint 20s |
| C-4 未满（反馈 < 5/9） | T-A1 整合延后 / Sprint 20r 工作量降至 ~0.9 PD（仅 T-A2 数据治理 + T-A4 + T-A5）|
| C-5 未满（V0.5 未收口） | Sprint 20r D1 启动延后 1 天 / V0.5 收口后回填前置事实再启动 |
| **C-6 未满**（Nova sandbox 未提供） | T-A1 Nova 联调子任务降级为「Nova 联调准备 + WireMock chaos 5 场景预测」/ 真 sandbox 接通顺延 Sprint 20s+ / T-A1 工作量 0.3 → 0.2 PD |
| **C-7 未满**（M-18 / 06 期初 mock client 不在仓）| T-A2 数据治理 P1 闭环范围调整：先补全 mock client + ApplyAsync skeleton / 去 mock 顺延 Sprint 20s 第 2 批合并 |

---

## 七、沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.1** | **2026-05-19** | **main 整夜跑预先起草占位**：① Sprint 20r 占位（业务方反馈陆续返回后第 2 sprint / R-12+R-13 + 第 6 批模块启动 / 第 4 周期第 3 阶段）② 4 main task 占位（T-A1 反馈整合 / T-A2 第 6 批 P0 backend skeleton / T-A3 Codex Round 17 / T-A4 memory + Sprint 20s V0.1 起草 / ~0.8 PD）③ 2 second task 占位（T-E1 第 6 批前端 / T-E2 库存试点优化 / ~0.5 PD / 第 15 次连续）④ R-12+R-13 占位（待 Sprint 20q D5 后 cici 拍板具体内容）⑤ 业务方反馈第 2 轮 5/9 → 8/9 → 9/9 渐进式 ⑥ 触发条件 4 项 / 触发条件未满回退方案 / 预计 2026-05-26 启动（Sprint 20q D5 后 ~ 2-3 天）|
| **V0.2** | **2026-05-19** | **cici 2026-05-19 早晨 5 batch 拍板应用 / main 整夜跑收尾**：① 5 batch 拍板全 default 应用章节新增（Batch 1 第 6 批顺序 A CMS-01 优先 / Batch 2 第 2 批 A 等白音华 / Batch 3 D2 today / Batch 4 20q V0.5 回填 / Batch 5 Q5 重拍 + 设备 A + Clauses A 顺延）② Day 1-5 task 占位从 4 → 5 main task（新增 T-A3 R-12+R-13 实施 / 原 T-A3 改 T-A4 Codex Round 18 / 原 T-A4 改 T-A5 memory + Sprint 20s V0.1 起草）③ T-A2 范围限定为 CMS-01 库存看板 P0 backend skeleton（配 Sprint 20u 启动 / cici Batch 1 A 拍板应用 / 设备 + 合同模板顺延 Sprint 20s+）④ second e Wave AJ 副轨从 2 → 3 task（新增 T-EAJ3 approval polish / 第 16 次连续）⑤ R-12+R-13 详化（占位列 + 候选范围 1/2/3 + cici Day 1 拍板触发流程）⑥ 业务方反馈第 2 轮 cici Batch 2 A 拍板触发流程明确（白音华为主）⑦ 触发条件 4 → 5 项（新增 C-5 V0.5 收口回填 / Batch 4 拍板应用 / C-2 标 done）⑧ 工作量 ~0.8 PD main + ~0.5 PD second（~1.3）→ ~1.0 PD main + ~0.6 PD second（~1.6）/ Sprint 20u CMS-01 主推 sprint 启动衔接明确 ⑨ 顺延目标 46 Sprint 0 顺延（不变）⑩ 启动日期 ~2026-05-26（不变）/ 不 git add / 不 commit / main 收口 |
| **V0.3** | **2026-05-20** | **cici 2026-05-20 凌晨 5 A 拍板收口应用 / main 整夜跑跨日收尾**：① 5 A 拍板全 default 收口应用章节新增 §2.5 + §2.6（D1 缺口 priority A 数据治理 → 采购 → 库存 → 合同/NC / D2 4 闭环顺序 A 评分顺序 / D3 去 mock 第 1 批 A M-18 + 06 期初 first / D4 Nova 联调启动 A Sprint 20r D1 ✨ / D5 NC 真上线 A Sprint 20s D1 李建颖+汤云龙）② T-A1 业务方反馈第 2 轮整合扩 + **Nova 联调启动子任务**（cici D4 A 拍板应用 / 0.2 → 0.3 PD / 双轨：反馈整合 + Nova sandbox + Polly 三层 + WireMock chaos 5 场景 + OAuth2 client_credentials 5 要点）③ T-A2 + **数据治理 P1 闭环（M-18 + 06 期初）+ 去 mock 第 1 批 + 迁移看板**（cici D1+D2+D3 A 拍板应用 / 0.4 → 0.6 PD / 双轨：数据治理 P1 闭环 + CMS-01 backend skeleton）④ T-A3 R-12+R-13 实施 + 数据治理 P1 闭环关联（cici D2 A 评分顺序第 2 位 / 候选范围 1/2/3 详化保留）⑤ T-A4 Codex Round 18 → Round 19（Sprint 20q 收尾 Round 18 后续接 / D2 A 评分顺序第 3 位 / 0 finding 收敛模式延续）⑥ T-A5 Sprint 20s V0.1 起草 → **Sprint 20s V0.3 起草（NC 真上线 + 李建颖+汤云龙 / cici D5 A 拍板）**（0.1 → 0.2 PD / 三联子任务：memory + Sprint 20s V0.3 起草 + audit V0.x 升版）⑦ 触发条件 5 → 7 项（新增 C-6 Nova sandbox 提供 + C-7 M-18 / 06 期初 mock client grep 验证 / [[carryover_task_verify_first]] 应用）+ 回退方案 4 → 6 项 ⑧ 工作量 ~1.0 PD main + ~0.6 PD second（~1.6）→ ~1.4 PD main + ~0.6 PD second（~2.0）/ Nova 联调启动里程碑 + 数据治理 P1 闭环里程碑明确 ⑨ D 顺延 4 → 7 项（新增 NC 真上线顺延 Sprint 20s D1 + NC sandbox 部分迁移 Sprint 20r T-A1 + 数据治理 P2 顺延 Sprint 20s + 数据治理 P3 顺延 Sprint 20t）⑩ 顺延目标 46 Sprint 0 顺延（不变）⑪ 启动日期 ~2026-05-26（不变）⑫ V0.2 5 batch 拍板延续保留（应用方式不变）+ V0.3 5 A 收口拍板叠加 / 不 git add / 不 commit / main 收口 |

---

**Created**: 2026-05-19 / main 整夜跑预先起草占位 / **V0.2 升版**：cici 2026-05-19 早晨 5 batch 拍板应用 / **V0.3 升版**：cici 2026-05-20 凌晨 5 A 拍板收口应用（Nova 联调启动 ✨ + 数据治理 P1 闭环 + 去 mock 第 1 批 + NC 真上线 Sprint 20s 顺延对接人明确）/ **不 git add / 不 commit / main 收口** / 待 Sprint 20q 真正收口后 V0.4 cici 拍板升版（如有需要）/ main 主代理 a

**Related**:
- [`Sprint-20q-任务卡-V0.4.md`](Sprint-20q-任务卡-V0.4.md)（同 cycle 前序 / 协调 + 验证 sprint / Sprint 20r 紧续）
- [`Sprint-20p-任务卡-V0.3.md`](Sprint-20p-任务卡-V0.3.md)（同 cycle 上游 / 协调 sprint 模板 / Sprint 20p Day 1 done）
- [`Sprint-20s-任务卡-V0.2.md`](Sprint-20s-任务卡-V0.2.md)（同 cycle 后续 / 设备管理 P0 backend skeleton 第 6 批顺序第 2 位）
- [`Sprint-20u-任务卡-V0.2.md`](Sprint-20u-任务卡-V0.2.md)（CMS-01 库存看板主推 sprint / 接力 Sprint 20r T-A2 backend skeleton 全栈开发）
- [`../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md`](../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md) V0.x（第 4 周期 roadmap / Sprint 20r §2.3 占位）
- [`../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md`](../../SupplyCores/docs/internal/sprint-20o-batch3-readiness-assessment.md) V0.1（第 3 批准入评估 / Sprint 20r 第 6 批模块 P0 候选参考模板）
- [[feedback_codex_0_carryover_8_sprint_record]]（44 Sprint 0 顺延记录 / Sprint 20r 目标维持 46 Sprint）
- [[main_orchestrator_default_spawn]]（main 编排者新规则 / Sprint 20r T-A1+T-A2 可并行 spawn）
- [[carryover_task_verify_first]]（顺延 task D1 必先 grep / Sprint 20r T-A2 第 6 批 CMS-01 P0 backend skeleton 前必 grep CMS 模块在仓度）
- [[feedback_business_party_coordination_failure]]（5 月反模式根因 #1 cici 单点保留 / Sprint 20r T-A1 反馈整合工作流 = 缓解协调负载 / 根因 #2#3#4 已解除 20c demo 实证）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 / 第 4 周期业务模块扩大 / Sprint 20r 第 6 批 CMS-01 开局）
- [[feedback_main_overnight_validation_pattern]]（main 整夜跑模式 / Sprint 20r V0.1 → V0.2 升版属于此模式 / 2026-05-19 早晨 cici 5 batch 拍板收尾）
- [[feedback_main_overnight_cross_day_2026_05_18_19]]（跨日整夜跑 / 26 hr / Sprint 20r V0.2 升版属于此模式收尾）
