# Sprint 20s 任务卡 V0.3（2026-05-20 cici D5 拍板 NC 真上线 Sprint 20s D1 / 李建颖+汤云龙 ready / D1+D2+D3+D4 全部应用 / 第 4 周期第 4 个 sprint / NC 凭证导出 P0 真上线核心 ✨ + CMS-01 业务闭环 + 合同/NC P4 闭环 + 采购 P2 闭环 / ~2026-05-31 启动 Day 1）

**Sprint**：20s（第 4 周期第 4 个 sprint / 第 2 阶段延续 / 紧续 20p 采购协调 + 20q 合同协调 + 20r 审批 + NC 升级三 sprint）
**主题**：**NC 凭证导出 P0 真上线（cici D5 拍板 A / 财务=李建颖 + 物资=汤云龙双业务方实操 ≥ 1 次 / 核心主题升级 ✨）+ CMS-01 库存看板业务闭环（M2 / 配 Sprint 20u CMS-01 P1 提前 5 周）+ 合同/NC P4 闭环 + 采购 P2 闭环**
**节奏**：NC P0 真上线 + 业务闭环 sprint 四重性质（vs Sprint 20p/20q 纯协调 / 20r 协调 + NC 升级双重）/ 工作量 ~1.1 PD 主线 + 0.6 PD second（wall-clock 2-3 天）/ 启动 ~2026-05-31
**性质**：**NC P0 真上线 + CMS-01 业务闭环 + 合同/NC P4 闭环 + 采购 P2 闭环四重 sprint**（cici D5 拍板 A 核心 / 凭证导出 P0 财务（李建颖）+ 物资（汤云龙）实际操作 ≥ 1 次 / Biz001-Biz008 8 业务单双号制 / 47 Sprint 0 顺延目标 ✨）

**V0.3 升版要点**（cici 2026-05-20 D5 拍板 NC 真上线 Sprint 20s D1 + D1+D2+D3+D4 全部应用）：

- **cici D5 拍板（2026-05-20 核心）**：
  * **D5 A 拍板**：NC 凭证导出 P0 真上线 Sprint 20s D1 启动 ✨（核心主题升级 / 财务=李建颖 + 物资=汤云龙 ready / 双业务方对接人 [[po-meeting-2026-05-16-nc-voucher-export]] 实证）
  * **D4 应用**：Codex Round 20 立修 + NC 真接（Polly + OAuth2 + WireMock chaos 5 场景 / 17a-19q production-ready 复用）
  * **D3 应用**：采购 P2 闭环 + ProcurementDocument 去 mock（采购合同 → 入库 → 付款 → 凭证全链路）
  * **D2 应用**：合同/NC P4 闭环（合同 → 付款节点 → 三单匹配 → 付款申请 → NC 凭证）
  * **D1 应用**：NC 真上线 D1 启动（李建颖+汤云龙 ready 实操 ≥ 1 次 + Biz001-Biz008 8 业务单双号制）

**V0.2 起草要点**（cici 2026-05-19 早晨 5 决策全 default 拍板 / main V0.7 §3 已起草 / 历史留痕）：

- **cici 5 决策全 default 拍板（2026-05-19 早晨）**：
  * Q1 A（双业务方同步操作 / 19r Q4 A 模式延续 / Sprint 20r Q4 A demo 反馈窗口稳定）
  * Q2 A（阈值 ≥ 10/9 宽松 / 19r 9/9 模式自然递增 1 项）
  * Q3 A（second e T-EAK1+T-EAK2+T-EAK3 全启动 0.6 PD / 第 14+ 次连续）
  * Q4 C（双轨架构隔离保证 / 凭证文件交付路径独立 / Sprint 19r D1+D2 实证）
  * Q5 A（CMS-01 库存看板 M2 业务闭环优先级 P0 / 配 Sprint 20u CMS-01 P1 提前 5 周）

- **触发条件（缺一不可 / 严格触发）**：
  * **条件 1**：Sprint 20r D3 满（审批接入 + NC 真联调激活完整 / 46 Sprint 0 顺延维持）
  * **条件 2**：cici NC 真上线决策（决策 A 第二步触发 / 凭证导出 P0 实际操作 / 业务方 G-12 推进）
  * **条件 3**：第 6 批 backend done（main V0.2 Wave I/J part 进度 + Sprint 20p/20q/20r 累积闭环）
- **NC 凭证导出 P0 真上线（cici 决策 A 第二步触发）**：
  * 第一步（已 done）：Sprint 19r 凭证导出 + 接口预留双轨架构 / IVoucherFileStorage + wwwroot/{type}/ 月分桶 / SHA256 hash / sanitize 防 path traversal
  * 第二步（本 sprint）：财务=李建颖 + 物资=汤云龙实际操作 ≥ 1 次 / 反馈窗口 ≥ 5 项收集
- **CMS-01 库存看板业务闭环（M2 / 配 Sprint 20u CMS-01 P1 提前 5 周）**：
  * 业务闭环范围：库存看板 7 KPI（库存总览 / 周转率 / 呆滞分析 / 安全库存预警 / 出入库统计 / Top N 物资 / 库龄分布）
  * 与 Sprint 20u CMS-01 P1 配对 / 提前 5 周 / cici Q5 A 拍板优先级 P0
  * main V0.2 Wave I/J 起草 8 候选 + 17+ Permission 立修（库存 9 + NC 7 + VoucherManagement 1）作为前置基础

---

## 一、前置事实（待 Sprint 20q D5 + Sprint 20r D3 满后回填）

### 1.1 Sprint 20q + 20r 待收口

| Sprint | Task | 主要交付 | 状态 |
|---|---|---|---|
| Sprint 20q | T-A1-A5 | 合同协调 + 关联完整性 + 试点 demo + roadmap V0.2 §2.2 修正 / Codex 收敛 | ⏳ 待 D5 满 |
| Sprint 20r | T-A1-A5 | 审批引擎 grep + 3 业务接入 + NC 真联调激活 + 双业务方 demo + Codex 收敛 | ⏳ 待 D3 满 |

### 1.2 Sprint 20q + 20r 真正收口数字（待回填）

| 维度 | 数字 / 状态 |
|---|---|
| Sprint 20q main 主代理 commits | TBD（Sprint 20q D5 满后）|
| Sprint 20r main 主代理 commits | TBD（Sprint 20r D3 满后）|
| Codex 评审累计轮 | TBD / 目标连续 0 finding 收敛 |
| **47 Sprint 0 顺延** | **目标维持**（20p done = 44 / 20q done = 45 / 20r done = 46 / 20s done = 47）|
| 关键 commit | TBD |

### 1.3 NC 凭证导出 P0 真上线前提 grep 实证（来源 Sprint 19r 实施 + Sprint 20r T-A3 激活）

**凭证导出 + 接口预留双轨架构 production-ready**（[[voucher-storage-pattern]] / Sprint 19r D1）：

| 模块 | 实体清单 | 状态 |
|---|---|---|
| IVoucherFileStorage | wwwroot/{type}/ 月分桶 / SHA256 hash / sanitize 防 path traversal | ✅ 19r D1 在仓 |
| VoucherManagement | 双号制 / 12 列模板 / 重生成 API / 8 业务单按钮 | ✅ 19r D2 三轨并行 patch |
| NC 单边架构 | OAuth2 + Polly + WireMock chaos + Health snapshot extended | ✅ 17a-19q 累积 production-ready |
| Sprint 20r T-A3 | NC 真联调激活（UseMock=false / 凭证导出 + 凭证查询 2 接口先切）| ⏳ 待 Sprint 20r D2 实施 |

**结论**：Sprint 20s 凭证导出 P0 真上线 = ① Sprint 20r T-A3 激活 done + ② 财务（李建颖）+ 物资（汤云龙）实际操作 ≥ 1 次 + ③ ≥ 5 项反馈收集 / 失败回退路径 = Sprint 20r Q3 A cici 拍板 UseMock=true 一键回退兜底。

### 1.4 CMS-01 库存看板业务闭环前提（cici Q5 A 拍板 / 配 Sprint 20u CMS-01 P1 提前 5 周）

**CMS-01 库存看板 7 KPI 业务闭环范围（M2 / cici Q5 A 优先级 P0）**：

| KPI 维度 | 业务描述 | backend 基础 | 状态 |
|---|---|---|---|
| 库存总览 | 物资类别 / 仓库 / 单位维度 KPI 汇总 | Reports/Dashboards 累积 14+ 次（second e 第 13 次连续）| ⏳ Sprint 20s T-A1 实施 |
| 周转率 | 月 / 季 / 年周转率（出库金额 / 平均库存金额）| ApplyAsync handler + 单测模板 [[feedback_sprint20m_full_loop_complete]] | ⏳ Sprint 20s T-A1 实施 |
| 呆滞分析 | ≥ 90 天 / 180 天 / 365 天分层 + Top N 物资 | data-issue-log 模块 504 行 / Sprint 20k 起草 | ⏳ Sprint 20s T-A1 实施 |
| 安全库存预警 | 物资安全库存阈值 + 预警通知（R-10 ReportAlert 复用）| ReportAlert R-10 模板 [[feedback_sprint20l_full_loop_complete]] | ⏳ Sprint 20s T-A1 实施 |
| 出入库统计 | 日 / 周 / 月 / 季 出入库金额 + 数量 + 单据数 | 6 stock entity 已在仓 [[feedback_sprint20n_wave1_complete]] | ⏳ Sprint 20s T-A1 实施 |
| Top N 物资 | 出库金额 / 周转率 / 呆滞天数 多维 Top N | Reports baseline 双重模板 | ⏳ Sprint 20s T-A1 实施 |
| 库龄分布 | 入库时间分层（≤ 30 / 31-90 / 91-180 / 181-365 / ≥ 365 天）| stock entity 入库时间字段 | ⏳ Sprint 20s T-A1 实施 |

**结论**：Sprint 20s T-A1 CMS-01 库存看板业务闭环范围 = ① 7 KPI ApplyAsync handler 实施（[[feedback_sprint20m_full_loop_complete]] 6 handler Apply 全模式复用）+ ② 单测覆盖率 ≥ 80%（[[feedback_sprint20l_full_loop_complete]] 4 子代理 73 测试模板）+ ③ 配 Sprint 20u CMS-01 P1 提前 5 周（cici Q5 A 拍板优先级 P0 / M2 节点）/ DataSeedContributor 补全（[[feedback_sed_batch_contributor_template]] sed 模板加速）。

### 1.5 cici D5 A 拍板应用 — NC 真上线 Sprint 20s D1 核心 ✨（2026-05-20 / V0.3 升版核心 / D1+D2+D3+D4 全部应用）

**cici D5 A 拍板（2026-05-20）**：**NC 凭证导出 P0 真上线 Sprint 20s D1 启动** —— 财务=李建颖 + 物资=汤云龙双业务方 ready / 第 4 周期第 4 个 sprint 主题升级为 NC P0 真上线核心 / D1+D2+D3+D4 全部应用 / 47 Sprint 0 顺延目标 ✨

| D 项 | 应用内容 | 落点 task | 状态 |
|---|---|---|---|
| **D5 A（核心）** | NC 凭证导出 P0 真上线 Sprint 20s D1 启动 / 李建颖+汤云龙 ready / 主题升级核心 | T-A1（主题升级 NC P0 → CMS-01 退居 P1）| ✅ V0.3 升版 |
| **D4** | Codex Round 20 立修 + NC 真接（Polly + OAuth2 + WireMock chaos 5 场景）| T-A4（Round 20 立修 + NC 真接激活）| ✅ V0.3 升版 |
| **D3** | 采购 P2 闭环 + ProcurementDocument 去 mock（采购合同 → 入库 → 付款 → 凭证全链路）| T-A3（采购 P2 闭环 + 去 mock）| ✅ V0.3 升版 |
| **D2** | 合同/NC P4 闭环（合同 → 付款节点 → 三单匹配 → 付款申请 → NC 凭证）| T-A2（合同/NC P4 闭环 新增）| ✅ V0.3 升版 |
| **D1** | NC 真上线 D1 启动（李建颖+汤云龙 ready 实操 ≥ 1 次 + Biz001-Biz008 8 业务单双号制）| T-A1（NC P0 真上线 D1 启动 / Biz001-Biz008）| ✅ V0.3 升版 |

**NC 真上线 detail（D5 A 拍板核心）**：

- **对接人 ready**（[[po-meeting-2026-05-16-nc-voucher-export]] 2026-05-16 PO 拍板）：
  * **财务 = 李建颖**（NC 财务系统手动导入凭证 / 实操 ≥ 1 次 / 反馈 ≥ 3 项）
  * **物资 = 汤云龙**（出库 / 入库凭证实操 ≥ 1 次 / 反馈 ≥ 3 项）
  * 累计反馈 ≥ 5 项（操作流畅度 / 凭证格式正确性 / NC 导入兼容性 / 错误处理 / 优化建议）
- **8 业务单双号制范围**（Biz001-Biz008 / Sprint 19r D2 三轨并行 patch / [[voucher-storage-pattern]]）：
  * Biz001 采购入库单 / Biz002 销售出库单 / Biz003 调拨单 / Biz004 盘点单 / Biz005 报损单
  * Biz006 退货单 / Biz007 暂存单 / Biz008 月结单（共 8 业务单 / 双号制：业务单号 + NC 凭证号）
- **失败回退路径**（Q4 C 双轨架构隔离保证 / Sprint 20r Q3 A UseMock=true 一键回退兜底）：
  * NC 真联调失败 → 凭证文件路径独立交付（IVoucherFileStorage + wwwroot/{type}/ 月分桶 production-ready）
  * 业务方反馈 < 5 项 → Sprint 20t 主推 / 不影响 47 Sprint 0 顺延目标

**结论**：Sprint 20s V0.3 主题升级 = ① NC 凭证导出 P0 真上线（D5 A 核心 / 李建颖+汤云龙实操 / Biz001-Biz008 8 业务单双号制）+ ② 合同/NC P4 闭环（D2 / 合同 → 付款 → 凭证全链路）+ ③ 采购 P2 闭环（D3 / ProcurementDocument 去 mock）+ ④ Codex Round 20 立修 + NC 真接（D4 / Polly + OAuth2）+ ⑤ CMS-01 业务闭环退居 P1（M2 / Sprint 20u P1 配对）。

### 1.6 NC 接口 cici 决策 A 第二步触发前提（来源 [[po-meeting-2026-05-16-nc-voucher-export]]）

**第一步（Sprint 19r 已 done）**：凭证导出 + 接口预留双轨 / NC 暂不上线 / 凭证文件交财务手动导入

**第二步（Sprint 20s 触发）**：物资公司单边架构再次启停 / 业务方反馈 ≥ 10/9 触发 / cici 决策 A 第二步

- **触发条件**：业务方反馈累计 ≥ 10 项（vs Sprint 19r 9/9 反馈到位的 1 项门槛）
- **启停范围**：物资公司单边架构（NcInterfaceMockClient + NcInterfaceHttpClient + 8+ 实体）
- **启停模式**：UseMock=true/false 切换（Sprint 20r Q3 A 一键回退兜底基础上）
- **G-12 业务方推进**：业务方 G-12 持续推进 / NC 侧联调环境双触发

---

## 二、Sprint 20s Task 清单（A 主轨 5 task / 1.1 PD + Wave AK 副轨 3 task / 0.6 PD / 总 1.7 PD / Day 1-5 占位 / V0.3 D5 拍板升版）

### A 主轨（main 主代理 / **NC P0 真上线核心 ✨ + CMS-01 业务闭环 + 合同/NC P4 闭环 + 采购 P2 闭环四重 sprint** / 共 5 task / 1.1 PD / Day 1-5 占位）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** **NC 凭证导出 P0 真上线 D1 启动 ✨（cici D5 A 拍板核心 / 财务=李建颖 + 物资=汤云龙 ready / Biz001-Biz008 8 业务单双号制 / Day 1）** | 0.3 | P0 | main 主代理 a + **cici PO 协调（财务李建颖 + 物资汤云龙双对接人 ready / [[po-meeting-2026-05-16-nc-voucher-export]] 2026-05-16 拍板）** | ① **cici D5 A 拍板核心**（NC 凭证导出 P0 真上线 Sprint 20s D1 启动 ✨ / 主题升级核心 / 4 周期第 4 sprint）② **双业务方实操 ≥ 1 次**：财务=李建颖（凭证生成 → 下载 → 手动导入 NC 财务系统 ≥ 1 次）+ 物资=汤云龙（出库 / 入库凭证实操 ≥ 1 次）③ **Biz001-Biz008 8 业务单双号制**（业务单号 + NC 凭证号 / Biz001 采购入库 / Biz002 销售出库 / Biz003 调拨 / Biz004 盘点 / Biz005 报损 / Biz006 退货 / Biz007 暂存 / Biz008 月结 / Sprint 19r D2 三轨并行 patch 基础）④ 反馈窗口 ≥ 5 项收集（操作流畅度 / 凭证格式正确性 / NC 导入兼容性 / 错误处理 / 优化建议 / 财务 ≥ 3 + 物资 ≥ 3）⑤ **CMS-01 业务闭环退居 P1**（M2 节点 / Sprint 20u P1 配对 / 简化范围至 ≥ 3 KPI 占位）⑥ 失败回退路径（Q4 C 双轨架构隔离 / 凭证文件交付独立 / Sprint 20r Q3 A UseMock=true 一键回退兜底）⑦ 写到 `docs/internal/sprint-20s-nc-voucher-export-p0-go-live.md` | Sprint 20r T-A3+T-A4 done + **cici D5 A 拍板** + cici Q1 A 决策（双业务方同步操作 19r Q4 A 模式延续）+ 双对接人 ready | **NC P0 真上线报告 ≥ 150 行 / 双业务方（李建颖 + 汤云龙）各 ≥ 1 次操作 + Biz001-Biz008 8 业务单双号制 + ≥ 5 项反馈 + 失败回退验证** |
| **T-A2** **合同/NC P4 闭环 ✨（cici D2 应用 / 合同 → 付款节点 → 三单匹配 → 付款申请 → NC 凭证全链路 / Day 2）** | 0.25 | P0 | main 主代理 a + 1 子代理 spawn | ① **cici D2 应用**（合同/NC P4 闭环 / Sprint 20q 合同协调延续）② 合同 → 付款节点（Contract.PaymentSchedule）③ 三单匹配（采购单 + 入库单 + 发票 / ProcurementDocument 关联）④ 付款申请（PaymentRequest）⑤ NC 凭证（VoucherManagement 关联生成 / 配 T-A1 NC P0 真上线）⑥ 单测覆盖（≥ 10 test / [[feedback_sprint20l_full_loop_complete]] 73 测试模板复用）⑦ 写到 `docs/internal/sprint-20s-contract-nc-p4-closure.md` | T-A1 done + Sprint 20q 合同协调收口 | **P4 闭环报告 ≥ 100 行 / 5 节点链路完整 + 单测覆盖率 ≥ 80% + NC 凭证关联验证** |
| **T-A3** **采购 P2 闭环 + ProcurementDocument 去 mock ✨（cici D3 应用 / 采购合同 → 入库 → 付款 → 凭证全链路 / Day 3）** | 0.2 | P0 | main 主代理 a + 1 子代理 spawn | ① **cici D3 应用**（采购 P2 闭环 + ProcurementDocument 去 mock / Sprint 20p 采购协调延续）② ProcurementDocument 去 mock（mock client → 真实 entity / NC 真接配 T-A4）③ 采购合同（PurchaseContract）→ 入库（StockInbound）→ 付款（Payment）→ 凭证（Voucher）全链路验证 ④ 与 T-A2 合同/NC P4 闭环联动（采购合同复用 Contract.PaymentSchedule）⑤ 单测覆盖（≥ 8 test / [[feedback_sprint20m_full_loop_complete]] Apply 全模式复用）⑥ 写到 `docs/internal/sprint-20s-procurement-p2-closure.md` | T-A1+T-A2 done + Sprint 20p 采购协调收口 | **P2 闭环报告 ≥ 80 行 / 4 节点链路完整 + ProcurementDocument 去 mock done + 单测覆盖率 ≥ 80%** |
| **T-A4** **Codex Round 20 立修 + NC 真接激活 ✨（cici D4 应用 / Polly + OAuth2 + WireMock chaos 5 场景 / Day 4）** | 0.2 | P0 | main 主代理 a | ① **cici D4 应用**（Codex Round 20 立修 + NC 真接 / [[oauth2-client-credentials-pattern]] 5 要点复用 / 17a-19q production-ready）② Codex Round 20 立修 + 复测（接续 Sprint 20o Round 5 / 20p Round 12 / 20q+20r Round 13-19 累计 0 收敛连续 / 第 N 次 0 收敛里程碑）③ **NC 真接激活**（Polly 三层 / OAuth2 single-flight + RefreshBuffer / 401 requestFactory retry / Token 状态暴露 / WireMock chaos 5 场景 / [[feedback_oauth2_client_credentials_pattern]] Sprint 17a 实测）④ codex review 模式 [[feedback_codex_cli_review_modes]]（--base BRANCH / xhigh 5-15 min / cici A 维持手动 33 Sprint 0 顺延稳定 / Sprint 20s 第 34 Sprint 手动）| Sprint 20s T-A1-A3 全 commit 完成 | **Codex 0 顺延 / Round 20 立修 done / 0 finding 收敛达成 / NC 真接激活 Polly + OAuth2 + chaos 5 场景验证** |
| **T-A5** **47 ✨ + memory 升级 + V0.x 锁版 + Sprint 20t V0.3 起草（Day 5）** | 0.15 | P0 | main 主代理 a | ① **47 Sprint 0 顺延达成 ✨**（44 → 45 → 46 → 47 累计连续 / Codex 0 顺延记录）② memory 升级（**NC P0 真上线 D5 A 拍板核心** + 李建颖+汤云龙双业务方实操实证 + Biz001-Biz008 8 业务单双号制 + 合同/NC P4 闭环 + 采购 P2 闭环 + Codex Round 20 0 收敛）③ Sprint 20s 任务卡 V0.3 锁版 ④ **Sprint 20t V0.3 起草**（第 4 周期收尾 sprint + 第 6 批模块完整闭环 + NC 5 接口全切真 + Q3 末 production deployment / ~2.2 PD 估算 / 教训 13 模板第 N 次）⑤ roadmap V0.2 → V0.3 §2.4 修正（如需 / 47 Sprint 0 顺延达成数据回填）| T-A1-A4 全 commit 完成 | memory commit / V0.x 锁版 / Sprint 20t V0.3 起草 ≥ 150 行 / **47 ✨ 达成数据** + roadmap V0.3 §2.4 修正 done（如需）|

**main 总：~1.1 PD**（5 task / Day 1-5 占位 / **NC P0 真上线核心 ✨ + 合同 P4 + 采购 P2 + Codex R20 + NC 真接四重** / 配 cici PO 协调主推 / 第 4 周期高峰 sprint）

### Wave AK 副轨（second 主代理 e / cici Q3 A 拍板启动 / 共 3 task / 0.6 PD / 第 14+ 次连续 / 模块切到 CMS-01 + 设备 skeleton + NC 凭证 UI）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-EAK1** CMS-01 库存看板前端业务闭环（second 配对 main T-A1）| 0.25 | pending | CMS-01 7 KPI 前端实施（库存总览 / 周转率 / 呆滞分析 / 安全库存预警 / 出入库统计 / Top N 物资 / 库龄分布）/ DevExtreme dashboard + Reports（[[feedback_dual_session_19t_continuous_validation]] Reports/Dashboards 14+ 次累积 / 双重 baseline）/ ExcelJS 导出（[[reference_team_tech_stack]] DevExtreme + ExcelJS 默认 / ClosedXML 复杂样式备用）/ 单测覆盖 |
| **T-EAK2** 设备模块 skeleton 提前起草（M3 候选 / 配 Sprint 20t-20u 第 6 批扩展）| 0.2 | pending | 设备模块（EQ-01 设备台账 + EQ-02 设备维保 + EQ-03 设备点检）skeleton 起草：① Domain entity 占位（Equipment / MaintenanceRecord / InspectionLog）② AppService 接口契约（Nova Satellite Module Pattern）③ DbContext + Migration 占位 ④ Permission 定义占位（Sprint 20s+ 第 6 批 17+ Permission 立修模板延续）/ 模块切换成本 ~0.2 PD（[[feedback_dual_session_19t_continuous_validation]] 20k 切 data-issue-log 504 行模式）|
| **T-EAK3** NC 凭证 UI（凭证生成 / 下载 / 重生成 / 业务单按钮 polish）| 0.15 | pending | NC 凭证导出 UI polish（配 main T-A2 双业务方实操）：① 8 业务单"生成凭证"按钮 polish（Sprint 19r D2 已 patch / Sprint 20s 实操优化）② 凭证下载 UX 提升（双号制 12 列模板格式化 / 实际操作流畅度）③ 重生成 API UI 集成（错误处理 / 失败提示 / 双轨架构隔离指示）④ 反馈数据收集（双业务方实操反馈 ≥ 5 项 / 与 main T-A2 配对）|

### D 顺延说明

- ~~第 6 批模块完整业务闭环（全 8 候选）~~：**Sprint 20t 主推**（20s 仅 cici 拍板优先级 P0 模块 / ≥ 1 模块）
- ~~NC 真联调 5 接口全切真~~：**Sprint 20t 主推**（20s 仅扩展科目映射 / 反结 / 月结 3 接口判断）

---

## 三、关键节奏

### 3.1 Sprint 20s 性质（**NC P0 真上线核心 ✨ + 业务闭环四重** / vs Sprint 20p/20q/20r 对比 / V0.3 D5 拍板升版）

| 维度 | Sprint 20p/20q（纯协调）| Sprint 20r（协调 + NC 升级双重）| **Sprint 20s V0.3（NC P0 真上线核心 ✨ + 合同 P4 + 采购 P2 + Codex R20 + NC 真接四重）** |
|---|---|---|---|
| 主轨任务数 | 5（A1-A5）| 5（A1-A5）| **5（A1-A5 / Day 1-5 占位 / V0.3 D5 升版）** |
| 主轨总 PD | ~1.2 | ~1.3 | **~1.1（V0.2 1.0 + 0.1 升版）** |
| 验证范围 | 1 模块 | 审批 + NC（4 业务 + 5 接口）| **NC P0 真上线核心 ✨ + 合同/NC P4 闭环 + 采购 P2 闭环 + CMS-01 退居 P1** |
| NC 状态 | 顺延 | 真联调激活（D 线升级 / 2 接口切真）| **P0 真上线核心 ✨（D5 A 拍板 / 财务+物资双实操 / Biz001-Biz008 双号制 / NC 真接 D4 应用）** |
| cici 协调强度 | 试点扩大 | NC 侧联调环境 + G-12 双触发 | **PO 协调主导（财务李建颖+物资汤云龙 ready / D5 拍板核心 / 双业务方实操 ≥ 1 次）** |
| 业务方协调依赖 | 高（试点反馈）| 高（NC demo 双业务方 + 网络）| **极高（双业务方李建颖 + 汤云龙 ready 实操 + 反馈 ≥ 5 项 + Biz001-Biz008 8 业务单双号制）** |
| 主轴战略 | 采购 / 合同试点 | 审批接入 + D 线激活第一步 | **NC P0 真上线 ✨ + 合同 P4 闭环 + 采购 P2 闭环 + Codex R20 + NC 真接四重** |
| 子代理 | 1-2 | 1-2 | **2-3（T-A2 合同 P4 + T-A3 采购 P2 spawn / D5 拍板执行）** |

### 3.2 wall-clock 估算（Day 1-5 占位 / V0.3 D5 拍板升版）

- main 主轨：4-5 天（Day 1-5 占位 / V0.3 D5 拍板升版）
  * **Day 1**：T-A1（0.3 PD / **NC 凭证导出 P0 真上线 D1 启动 ✨ / D5 A 核心 / 财务李建颖+物资汤云龙 ready 实操 + Biz001-Biz008 8 业务单双号制**）
  * **Day 2**：T-A2（0.25 PD / **合同/NC P4 闭环 ✨ / D2 应用 / 合同 → 付款 → 三单匹配 → 付款申请 → NC 凭证全链路**）
  * **Day 3**：T-A3（0.2 PD / **采购 P2 闭环 + ProcurementDocument 去 mock ✨ / D3 应用**）
  * **Day 4**：T-A4（0.2 PD / **Codex Round 20 立修 + NC 真接激活 ✨ / D4 应用 / Polly + OAuth2 + chaos 5 场景**）
  * **Day 5**：T-A5（0.15 PD / **47 ✨ + memory + V0.3 锁版 + Sprint 20t V0.3 起草 + roadmap V0.2→V0.3 §2.4 修正**）
- 触发条件等待：Sprint 20q D5 + Sprint 20r D3 满 + **cici D5 A 拍板已 done ✅** + 双对接人 ready（启动 ~2026-05-31）
- second 副轨：与 main 并行 / Wave AK 3 task / 0.6 PD / 4-5 天

### 3.3 第 4 周期第 2 阶段延续节奏（V0.3 升版）

| Sprint | 性质 | 工作量 | 备注 |
|---|---|---|---|
| Sprint 20p（已 done）| 采购协调 | 1.2 PD | 44 Sprint 0 顺延 |
| Sprint 20q（待 done）| 合同协调 | 待 V0.2 | 45 Sprint 0 顺延（目标）|
| Sprint 20r（待 done）| 审批协调 + NC 升级双重 | 1.3 PD | 46 Sprint 0 顺延（目标）/ D 线激活第一步 |
| **Sprint 20s（本 / V0.3）** | **NC P0 真上线核心 ✨ + 合同 P4 + 采购 P2 + Codex R20 + NC 真接四重** | **1.1 PD 主线 + 0.6 PD second** | **47 Sprint 0 顺延（目标）✨ / D 线 P0 真上线 D5 A 拍板核心 / 财务李建颖+物资汤云龙 ready / Biz001-Biz008 8 业务单双号制 / D1+D2+D3+D4 全应用** |
| Sprint 20t | 第 4 周期收尾 + 第 6 批完整闭环 + NC 5 接口全切真 + Q3 末 production deployment | ~2.2 PD | 硬截止 deadline |

---

## 四、关键决策点（cici V0.1→V0.2 待拍板）

| # | 决策 | 选项 | 推荐 | **cici 拍板** |
|---|---|---|---|---|
| **Q1** | T-A2 NC 凭证导出 P0 双业务方实操顺序 | A. 财务（李建颖）+ 物资（汤云龙）同步操作（demo 反馈窗口稳定 / Sprint 20r Q4 A 模式延续）/ B. 财务先 + 物资后（分阶段降风险）/ C. 物资先 + 财务后（出库凭证频次高优先验证）| **A 默认**（Sprint 20r Q4 A cici 已拍板双业务方同步 demo / [[po-meeting-2026-05-16-nc-voucher-export]] 2 业务方对接人已明确 / demo 反馈窗口稳定 / 节省 cici 协调成本）| ⏳ **待 Sprint 20q+20r 收口后 V0.2 拍板** |
| **Q2** | T-A3 NC 决策 A 第二步触发条件阈值 | A. 业务方反馈累计 ≥ 10/9（宽松阈值 / 接续 19r 9/9 反馈模式 / 自然递增 1 项）/ B. ≥ 15/9（严格阈值 / 保证反馈质量）/ C. 不设阈值 / 仅 cici 主观决策 | **A 默认**（Sprint 19r 已实证 9/9 反馈到位模式 / Sprint 20p+20q+20r 累积反馈自然递增 / 阈值 ≥ 10 项触发评估合理 / B 阈值过高可能延误 D 线第二步）| ⏳ **待 Sprint 20q+20r 收口后 V0.2 拍板** |
| **Q3** | second e 副轨范围 | A. T-E1+T-E2 全（0.6 PD / 14 次连续 / 第 6 批前端 + 物资看板 P0）/ B. 仅 T-E1（0.3 PD / 简化）/ C. 暂停（类 Sprint 20o）| **A 默认**（second e 第 14 次连续 / 第 6 批前端配对 + 物资看板 P0 真正影响业务闭环 / 模块切换成本可接受 / 累积 [[feedback_dual_session_19t_continuous_validation]] 14+ 次模板）| ⏳ **待 Sprint 20q+20r 收口后 V0.2 拍板** |
| **Q4** | T-A2 凭证导出反馈失败回退策略 | A. UseMock=true 一键回退（Sprint 20r Q3 A 模式延续）/ B. 仅凭证导出回退 / NC 接口保持真联调 / C. 双轨架构隔离保证 / 反馈失败不影响凭证文件交付路径 | **C 默认**（[[voucher-storage-pattern]] 双轨架构 IVoucherFileStorage + NC 真联调路径独立 / 反馈失败不影响凭证文件交付 / Sprint 19r 已实证双轨架构隔离 / A 作为最坏情况兜底）| ⏳ **待 Sprint 20q+20r 收口后 V0.2 拍板** |
| **Q5** | T-A1 第 6 批模块准入优先级 P0 | A. main V0.2 Wave I/J 第 6 批 8 候选评分前 1 模块（cici 拍板）/ B. 前 2 模块（保险范围）/ C. 全 8 候选（贪心 / 风险高）| **A 默认**（[[main_orchestrator_default_spawn]] 不做范围外扩展 / Sprint 20s 主线 1.0 PD 范围内 ≥ 1 模块业务闭环 + 单测覆盖更稳健 / 全 8 候选 Sprint 20t 主推）| ⏳ **待 Sprint 20q+20r 收口后 V0.2 拍板** |

---

## 五、风险与依赖

### 5.1 高风险

- **NC P0 真上线双业务方实操延误（cici 单点）**：财务（李建颖）+ 物资（汤云龙）双业务方协调持续依赖 cici / 5 月反模式根因 #1 cici 单点保留
  * **缓解**：T-A2 文档 ≥ 120 行明确实操流程 + 反馈窗口模板 / Q4 C 双轨架构隔离保证 / 凭证文件交付不受 NC 真联调影响 / Sprint 20t 主推可顺延
- **NC 决策 A 第二步触发条件不满足（业务方反馈 < 10/9）**：业务方反馈累计未达阈值
  * **缓解**：Q2 A 阈值 ≥ 10/9 宽松设计 / Sprint 20p+20q+20r+20s 自然递增 / 不强求 20s 触发 / Sprint 20t 主推
- **第 6 批模块准入清单延误（main V0.2 Wave I/J 待 cici 拍板）**：cici V0.2 拍板进度依赖
  * **缓解**：Q5 A 优先级 P0 ≥ 1 模块即可 / Sprint 20t 全 8 候选主推 / [[main_orchestrator_default_spawn]] 不做范围外扩展

### 5.2 中风险

- **NC 真联调激活失败回退（Sprint 20r Q3 A 兜底）**：UseMock=true 一键回退 / 影响 T-A2 凭证导出 P0 真上线路径
  * **缓解**：Q4 C 双轨架构隔离保证 / 凭证文件交付独立 / Sprint 20r T-A3 切真验证后再 P0 实操
- **第 6 批模块业务闭环 Apply 复杂度（业务侧）**：handler ApplyAsync 全闭环改动面可能扩散
  * **缓解**：T-A1 优先 1 模块（Q5 A）pilot 实施 / [[feedback_sprint20m_full_loop_complete]] 6 handler Apply 全模式复用 / 单测覆盖率 ≥ 80% 保证

### 5.3 低风险

- **凭证导出双轨架构在仓**（Sprint 19r D1+D2 已实证 / [[voucher-storage-pattern]]）
- **NC 单边架构 + OAuth2 + Polly + chaos 已实测**（17a-19q 累积 + Sprint 20r T-A3 激活验证）
- **第 6 批 17+ Permission 立修已 done**（main V0.2 Wave F+G+H+I+J / 库存 9 + NC 7 + VoucherManagement 1）
- **second e 第 14 次连续模块切换模式成熟**（[[feedback_dual_session_19t_continuous_validation]]）

### 5.4 主要依赖

- Sprint 20q D5 完整收口（前置）
- Sprint 20r D3 完整收口 / NC 真联调激活 done（前置 / 缺一不可）
- main V0.2 Wave I/J 第 6 批准入清单 cici 拍板（前置 / Q5 A）
- cici 拍板 5 决策点（Q1-Q5）
- cici 协调财务（李建颖）+ 物资（汤云龙）双业务方实操（T-A2 / Q1）
- cici NC 真上线决策（决策 A 第二步触发条件 ≥ 10/9 / Q2）

---

## 六、对外汇报口径

> Sprint 20s 第 4 周期第 4 个 sprint / 第 2 阶段延续 / 业务闭环 + NC P0 真上线双重性质：第 6 批模块业务闭环（与 Sprint 20r T-A2 配对 / Apply 全 + 单测）+ **NC 凭证导出 P0 真上线（cici 决策 A 第二步触发 / 财务（李建颖）+ 物资（汤云龙）双业务方实际操作 ≥ 1 次 / 反馈 ≥ 5 项）** + NC 接口决策 A 第二步触发评估（业务方反馈 ≥ 10/9）/ 47 Sprint 0 顺延维持目标。凭证导出双轨架构 production-ready（Sprint 19r D1+D2）+ NC 真联调激活完整（Sprint 20r T-A3）+ 第 6 批 17+ Permission 立修在仓（main V0.2 Wave F+G+H+I+J）/ Sprint 20q D5 + Sprint 20r D3 满 + cici NC 真上线决策三触发条件后启动 Day 1。

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-19（main 整夜跑预先起草 / 占位 / 待 Sprint 20q D5 + Sprint 20r D3 满 + cici NC 真上线决策三触发后启动 Day 1）| main a 起草 / 业务闭环 + NC P0 真上线双重性质 / 4 主轨 task ~1.0 PD + 2 副轨 task 0.6 PD / 5 开放问题待 Sprint 20q+20r 收口后 cici V0.2 答（Q1 双业务方实操顺序 / Q2 触发阈值 / Q3 second 副轨范围 / Q4 反馈失败回退 / Q5 第 6 批准入优先级）/ 触发条件：① Sprint 20r D3 满 ② cici NC 真上线决策 ③ 第 6 批 backend done |

---

**Created**: 2026-05-19 / Sprint 20p Day 1 done + Sprint 20q D5 + Sprint 20r D3 待收口 → 20s V0.1 起草（提前占位 / main 整夜跑预先起草 / 待 Sprint 20q D5 + Sprint 20r D3 满 + cici NC 真上线决策三触发后启动 Day 1）/ main 主代理 a

**Related**:
- [`Sprint-20p-任务卡-V0.3.md`](Sprint-20p-任务卡-V0.3.md)（同 cycle 前序 / 协调 sprint 模板 / 44 Sprint 0 顺延 done）
- [`Sprint-20q-任务卡-V0.3.md`](Sprint-20q-任务卡-V0.3.md)（同 cycle 前序 / 合同协调 sprint / 待 D5 满）
- [`Sprint-20r-任务卡-V0.2.md`](Sprint-20r-任务卡-V0.2.md)（同 cycle 前序 / 审批协调 + NC 升级双重 / 待 D3 满 / Q3 A UseMock=true 一键回退兜底）
- [`../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md`](../../SupplyCores/docs/internal/sprint-20p-20t-roadmap.md) V0.2（待 Sprint 20s T-A4 修正 V0.3 §2.4 如需）
- [[voucher-storage-pattern]]（凭证导出双轨架构 / Sprint 19r D1+D2 实施 / Sprint 20s T-A2 P0 真上线基础）
- [[po-meeting-2026-05-16-nc-voucher-export]]（PO 决策 NC 顺延 / 财务=李建颖 + 物资=汤云龙双业务方对接人明确 / Sprint 20s T-A2 双业务方实操触发）
- [[nc-interface-unilateral-json-strategy]]（NC 单边架构 17a-19q 累积 / Sprint 20s T-A3 决策 A 第二步触发评估前提）
- [[oauth2-client-credentials-pattern]]（NC OAuth2 5 要点模式 / Sprint 20s T-A3 第二步触发后复用）
- [[feedback_codex_0_carryover_8_sprint_record]]（46 Sprint 0 顺延记录 / Sprint 20s 目标 47 Sprint）
- [[main_orchestrator_default_spawn]]（main 编排者新规则 / Sprint 20s 子代理 2-3 spawn）
- [[carryover_task_verify_first]]（顺延 task D1 必先 grep / curl / 实测 / Sprint 20s T-A1+T-A3 grep 验证模式）
- [[feedback_business_party_coordination_failure]]（5 月反模式根因 #1 cici 单点仍保留 / 第 4 周期第 2 阶段延续监测 / NC P0 真上线前置 cici 协调）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 + 第 4 周期业务模块扩大 + 第 6 批准入）
- [[feedback_sprint20n_wave1_complete]]（协调 sprint 模板参考 / 业务方 walk-through 模式）
- [[feedback_sprint20m_full_loop_complete]]（6 handler Apply 全模式 / Sprint 20s T-A1 业务闭环复用）
- [[feedback_sprint20l_full_loop_complete]]（4 子代理 73 测试模板 / Sprint 20s T-A1 单测覆盖复用）
- [[feedback_dual_session_19t_continuous_validation]]（second e 14+ 次连续模块切换模板 / Sprint 20s T-E1+T-E2 第 14 次连续）
- [[reference_team_tech_stack]]（前端 DevExtreme + ExcelJS 默认 + ClosedXML 复杂场景 / Sprint 20s T-E1 前端业务闭环复用）
- [[reference_voucher_storage_pattern]]（凭证存储模式 / Sprint 20s T-A2 P0 真上线 + T-E2 物资看板 P0 backend 复用）
- [[feedback_main_v02_wave_fghij_complete]]（main V0.2 Wave I/J 第 6 批 8 候选评分 + 17+ Permission 立修 / Sprint 20s T-A1 准入清单依据）
- [[feedback_main_overnight_validation_pattern]]（main 整夜跑模式 / Sprint 20s V0.1 起草 2026-05-19 main 整夜跑预先起草占位）
