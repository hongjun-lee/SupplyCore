# Sprint 20t 任务卡 V0.2（2026-05-19 早晨 cici 拍板回填 / 采购合同启动 + Cycle 5 第 5 周期 roadmap V0.1 起草 / C-02 字段补强 Sprint 9a 顺延详化）

**Sprint**：20t（紧续 20s D5 收口 → **第 4 周期 20p-20t 5 Sprint 收尾 + 采购合同启动 + 第 5 周期 roadmap 起草**）
**主题**：**采购合同启动（第 4 周期收尾）+ Cycle 5（第 5 周期）roadmap V0.1 起草准备 + C-02 字段补强 Sprint 9a 顺延实施**
**节奏**：roadmap V0.2 → V0.3 应用 cici 拍板 / 工作量 ~1.0 PD 主线 + ~0.6 PD second / wall-clock 2-3 天 / 启动 ~2026-06-10
**性质**：**采购合同新模块启动 sprint + 第 4 周期 5 Sprint 收尾 sprint + 第 5 周期 roadmap V0.1 起草 + C-02 字段补强顺延实施 四重 sprint**（vs Sprint 20o 纯收尾 / vs Sprint 20p 协调启动 / vs Sprint 20s NC 主推）

**V0.2 升版要点**（2026-05-19 早晨 cici 拍板）：
- **采购合同字段补强（C-02 Sprint 9a 顺延详化）**：BondReleaseState（enum 4 值）+ BondReleaseDate（DateOnly?）+ SY-02 字典化 BondReleaseAlertDays + DedupWindowHours + 简化版数据迁移 BondState=已缴纳 → BondReleaseState=未释放 + Wave 67/68 migration（详 §2.1）
- **业务闭环 Apply**：Approval 接通（Sprint 20r 审批工作流引擎复用）+ 月结反结模式复用（NC 真联调 Sprint 20r-20s 已激活基础）+ 押金状态机回写 R-05 Detector 升级
- **Cycle 5 第 5 周期 roadmap V0.1 起草 task 详化**（详 §2.3）：应用 cici 7 战略拍板 + 第 6 批 5 入选实施 + 微信小程序 Wave 1 准备 + AI 团队 Q1 next year 6 角色 3 wave 衔接
- **触发条件保留**：Sprint 20s D5 满 / cici 采购合同字段拍板 / Cycle 3 第 4 周期 36+ Sprint 0 顺延维持 / **48 Sprint 0 顺延目标**

---

## 一、基本信息

| 维度 | 取值 |
|---|---|
| 启动日期（预计）| ~ 2026-06-10（待 Sprint 20s D5 满后启动 / 实际日期取决于 Sprint 20p-20s 进度 / Q3 末 deadline 前置）|
| main 主线工作量 | ~1.0 PD（5 task / T-A1-A5）|
| second 副线工作量 | ~0.6 PD（3 task / T-E1+T-E2+T-E3）|
| wall-clock | 2-3 天（Day 1-2 主轨 + Day 1-3 副轨并行 / 收尾 sprint 性质快速节奏）|
| Sprint 性质 | 采购合同新模块启动 + 第 4 周期收尾 + 第 5 周期 roadmap V0.1 起草 + C-02 字段补强顺延实施 四重性质 |
| 前置 Sprint | Sprint 20p Day 1 done / Sprint 20q D5 done / Sprint 20r D5 done / Sprint 20s D5 done |
| 后续 Sprint | Sprint 20u（第 5 周期开局 / V0.x 待 T-A3 Cycle 5 roadmap V0.1 输入 / 第 6 批 5 入选实施启动）|
| 第 4 周期总顺延目标 | **48 Sprint 0 顺延**（Sprint 20p 44 → 20q 45 → 20r 46 → 20s 47 → Sprint 20t 48 收尾达成）|
| cici 拍板日期 | 2026-05-19 早晨（V0.1 占位 → V0.2 升版触发）|

---

## 二、Day 1-5 Task 占位（A 主轨 5 task / 总 ~1.0 PD）

### A 主轨（main 主代理 / 5 task）

| Task | PD | 优先级 | 责任方 | 描述 | 前置依赖 | 验收口径 |
|---|---|---|---|---|---|---|
| **T-A1** 采购合同 backend skeleton（C-02 字段补强 Sprint 9a 顺延详化）| 0.3 | P0 | main 主代理 a | 主合同（PurchaseContract）+ 子合同（PurchaseSubContract）+ 履约表（PurchaseContractFulfillment）三表 Domain Entity + EF Configuration + Migration / **C-02 字段补强 Sprint 9a 顺延详化（详 §2.1）**：BondReleaseState enum 4 值（未释放/部分释放/已释放/已没收）+ BondReleaseDate DateOnly? + SY-02 字典化 BondReleaseAlertDays + DedupWindowHours + 简化版数据迁移 BondState=已缴纳→BondReleaseState=未释放 + Wave 67/68 migration / AppService skeleton（CRUD + 状态机）/ schema `p`（purchase）/ R-05 BondReleaseNearDetector 升级用 BondReleaseState/BondReleaseDate / 详设 09 V0.1 → V0.2 升版（与 09 V1.2 合并为 V1.3）| Sprint 20q 合同模块基础 + C-02 字段补强详设 V0.x + R-05 Detector 简化版 commit c8f2600 | Domain Entity 3 表完整 + Migration（Wave 67 BondReleaseState + Wave 68 BondReleaseDate）+ AppService skeleton + 6+ 字段补齐 + R-05 Detector 升级回归测试 + 详设 09 V1.3 锁版 |
| **T-A2** 采购合同业务闭环 Apply（Approval 接通 / 月结反结模式复用 / R-05 押金状态机回写）| 0.3 | P0 | main 主代理 a | Approval 接通（Sprint 20r 审批工作流引擎 / `IApprovalGateway` 复用 / SubmitForApproval + RejectAsync + CancelAsync 三方法）/ 月结反结模式复用（Sprint 20r-20s NC 真联调已激活 / NC 凭证回写 BIZ-MR / RED / PAY 等接口）/ Approval 状态回写到 PurchaseContract.ApprovalState / Hangfire 任务触发 NC 推送 / **R-05 押金状态机回写**（合同签订→押金缴纳 BondReleaseState=未释放 / 履约完成→BondReleaseState=已释放 / BondReleaseDate 自动填充）| T-A1 backend skeleton + Sprint 20r 审批工作流引擎 + Sprint 20s NC 真联调 5 接口实测 | 采购合同 → 审批 → NC 凭证回写完整业务流跑通 / Approval 三状态切换 / 月结反结模式复用验证 / R-05 押金状态机端到端测试 |
| **T-A3** Cycle 5 第 5 周期 roadmap V0.1 起草（应用 cici 7 战略拍板 + 第 6 批 5 入选实施 + 微信小程序 Wave 1 准备）| 0.2 | P1 | main 主代理 a | 类 `sprint-20p-20t-roadmap.md` 模板 / 写到 `docs/internal/sprint-20u-20y-roadmap.md` V0.3（已 V0.2 / 本 Sprint T-A3 升 V0.3）/ **应用 cici 7 战略拍板**（详 §2.3.1）：① cici Q4 B 推荐战略方向 ② AI 团队 Q1 next year 6 角色 3 wave ③ 第 6 批 5 入选实施 ④ 微信小程序 Wave 1 准备 ⑤ 全集团推广（试点 4 → 10-15 单位）⑥ 跨系统集成方向（NC 之外）⑦ 多租户能力评估 / **第 6 批 5 入选实施清单**（详 §2.3.2）：库存监控 / 采购合同（本 Sprint T-A1 启动）/ 数据治理监控 / 审批历史 / NC 凭证导出 walk-through / **微信小程序 Wave 1 准备**（详 §2.3.3）：① 选型评估（Taro vs uni-app vs 原生小程序）② 4 核心场景（凭证审批 / 库存查询 / 数据治理通知 / 采购合同状态查询）③ 后端 BFF 层评估 ④ Sprint 20u 启动准备 | T-A1 + T-A2 收口 / long-term roadmap V0.2 拍板项陆续应用 / 第 6 批评分 V0.2 8 候选评分 | roadmap V0.3 ≥ 200 行 / 含 cici 7 战略拍板 + 第 6 批 5 入选实施 + 微信小程序 Wave 1 准备 + AI 团队衔接 / sprint-20u-20y-roadmap.md V0.2 → V0.3 锁版 |
| **T-A4** Codex Round 21 立修 + 复测 | 0.2 | P0 | main 主代理 a | 标准收尾 / Codex Round 21 finding 全立修（前置 Sprint 20s 已 Round 20 收敛假设 / Round 21 = Sprint 20t 收尾轮）/ V0.x 升版（教训 13 6 步模板）/ memory 升级（**48 Sprint 0 顺延达成** + 第 4 周期 20p-20t 完整闭环 + 采购合同启动 + 第 5 周期 roadmap V0.1 起草 + C-02 字段补强 Sprint 9a 顺延实施）| Sprint 20t T-A1 + T-A2 + T-A3 全 commit 完成 | **48 Sprint 0 顺延达成 ✅** / V0.x 锁版 / memory commit / Round 21 = 0 finding 收敛（目标）|
| **T-A5** memory 升级 + Sprint 20u V0.1 起草（第 6 批 5 入选启动）| 0.1 | P1 | main 主代理 a | memory 写入：① 48 Sprint 0 顺延记录 ② 第 4 周期 20p-20t 5 Sprint 完整闭环复盘 ③ 采购合同新模块启动 + C-02 字段补强 Sprint 9a 顺延实施模式 ④ Cycle 5 第 5 周期 roadmap V0.1 起草节奏 / Sprint 20u V0.1 起草（第 6 批 5 入选实施启动 + 微信小程序 Wave 1 启动 + 试点扩大 4 → 10-15 单位准备）/ 类 Sprint 20t V0.1 占位模板 | T-A4 收口 | memory 2-3 条 + Sprint-20u-任务卡-V0.1.md 占位文件 ≥ 100 行 |

**main 总：~1.0 PD**（5 task / vs Sprint 20o 1.6 PD 收尾 / vs Sprint 20p 1.0 PD 启动 / 20t 性质混合但工作量保持轻量化 / cutover 实战推到 Sprint 20u+ 第 5 周期 / 20t 仅启动 + 收尾不做 cutover）

### 2.1 C-02 字段补强 Sprint 9a 顺延详化（来源 [[project_r05_simplification_owed_to_sprint9]]）

**简化版现状**（Sprint 8a Day 7 决策 commit `428e5cc` / `c8f2600`）：

| 详设 09 V0.1 §4.2 | Sprint 8a 实际实现 | Sprint 20t T-A1 升级 |
|---|---|---|
| C-02.BondReleaseState ∈ {未释放, 部分释放} | C-02.BondState (4 状态：待缴纳/已缴纳/已退还/已没收)，用 `BondState=="已缴纳"` 替代"未释放" | **新增 C-02.BondReleaseState enum 4 值（未释放/部分释放/已释放/已没收）** |
| C-02.BondReleaseDate < TODAY+90 | C-02.ExpiryDate < TODAY+90（合同到期=押金可释放窗口） | **新增 C-02.BondReleaseDate DateOnly?**（实际退还日 / Released 后填充）|
| 独立 idempotent_key 列 | AlertContent JSON 字段写 SHA256 短码 | 保留（不改造 / AlertContent 模式延续）|

**Sprint 20t T-A1 字段补强清单**（详设 09 V0.1 → V0.2 升版 / 与 09 V1.2 合并为 V1.3）：

1. **C-02 表字段新增**（Wave 67 + Wave 68 migration）：
   - `bond_release_state` enum NOT NULL DEFAULT 'NotReleased'（未释放/部分释放/已释放/已没收）
   - `bond_release_date` DateOnly NULL（实际退还日）
2. **简化版数据迁移**（Wave 68 migration / SQL）：
   - `UPDATE c.c_02 SET bond_release_state = 'NotReleased' WHERE bond_state = '已缴纳'`
   - `UPDATE c.c_02 SET bond_release_state = 'Released' WHERE bond_state = '已退还'`
   - `UPDATE c.c_02 SET bond_release_state = 'Forfeited' WHERE bond_state = '已没收'`
3. **SY-02 字典化**（Wave 67 migration）：
   - `BondReleaseAlertDays` int（默认 90 / 来源 R-05 Detector const 硬编码升级）
   - `DedupWindowHours` int（默认 24 / 来源 R-05 Detector const 硬编码升级）
4. **R-05 BondReleaseNearDetector 升级**：
   - 改用 `BondReleaseState ∈ {未释放, 部分释放}` 替代 `BondState=="已缴纳"`
   - 改用 `BondReleaseDate < TODAY+SY-02.BondReleaseAlertDays` 替代 `ExpiryDate < TODAY+90`
   - 回归测试覆盖简化版数据（兼容现存 BondState=已缴纳 → BondReleaseState=未释放）
5. **详设 09 V0.1 → V0.2 升版**（与 09 V1.2 合并为 V1.3）：
   - §4.2 字段表更新（新增 BondReleaseState + BondReleaseDate）
   - §4.3 Detector 算法更新（升级条件 + SY-02 字典化）
   - 沿革 V1.3 = V1.2 + Sprint 20t T-A1 字段补强

**工作量估算**：~0.5-1 PD（含字段补强 + 数据迁移 + Detector 改造 + 测试 + 详设升版）/ 实际落入 Sprint 20t T-A1 0.3 PD（采购合同 skeleton 同 commit）

### 2.2 采购合同业务闭环模式（T-A2 详化）

**Approval 接通**（IApprovalGateway 复用 / Sprint 20r 审批工作流引擎）：
- `SubmitForApprovalAsync(contractId, approverIds)` → 状态 Draft → PendingApproval
- `RejectAsync(contractId, reason)` → 状态 PendingApproval → Rejected（业务单 OnRejected 事件通知发起方）
- `CancelAsync(contractId)` → 已提交未审批可撤销 → 状态回退 Draft

**月结反结模式复用**（Sprint 20r-20s NC 真联调）：
- 采购合同签订 → NC 凭证推送 BIZ-MR（物料退库不适用 / 采购合同适用 BIZ-PUR-CONTRACT 新接口）
- NC 真号回写 → `PurchaseContract.NcVoucherNo` 字段
- 月结反结 → `PeriodReverseAppService` 复用 / 反结时 NC 凭证撤销

**R-05 押金状态机回写**：
- 合同签订 → 押金缴纳事件触发 → `BondReleaseState=未释放` + `BondState=已缴纳`
- 履约完成 → `BondReleaseState=已释放` + `BondReleaseDate=今天`
- 部分履约 → `BondReleaseState=部分释放` + `BondReleaseDate=null`
- 违约 → `BondReleaseState=已没收` + `BondState=已没收`

### 2.3 Cycle 5 第 5 周期 roadmap V0.1 起草章节（T-A3 详化）

#### 2.3.1 应用 cici 7 战略拍板清单

来源：[[feedback_main_overnight_cross_day_2026_05_18_19]] + [[feedback_main_v02_wave_fghij_complete]] long-term prompt 矩阵 53.5 PD 161 task 跨 26 sprint

| # | 战略拍板 | cici 决策（推测 Q4 B 推荐）| Sprint 20t T-A3 落实 |
|---|---|---|---|
| 1 | Q4 战略方向（production 上线后扩展 vs 巩固） | B 平衡（巩固 60% + 扩展 40%）| roadmap §1 战略定位 |
| 2 | AI 团队 Q1 next year 6 角色 3 wave | 全启动（PM + QA + DevOps + 前端 + 后端 + 数据 6 角色 / 3 wave / 第 5 周期 wave 1 启动）| roadmap §3 AI 团队衔接 |
| 3 | 第 6 批模块准入 5 入选实施 | 库存监控 + 采购合同 + 数据治理监控 + 审批历史 + NC 凭证导出 walk-through | roadmap §2.1 第 6 批 5 入选实施 |
| 4 | 微信小程序 Wave 1 启动时机 | Sprint 20u Wave 1 选型 + Sprint 20v Wave 1 4 核心场景 | roadmap §2.2 微信小程序衔接 |
| 5 | 全集团推广（试点 4 → 10-15 单位）| 第 5 周期 Sprint 20u-20w 渐进扩大 / Sprint 20x-20y 全集团准备 | roadmap §4 全集团推广 |
| 6 | 跨系统集成方向（NC 之外）| OA / HR / 财务报表系统 3 候选（待第 5 周期 cici 拍板）| roadmap §5 跨系统集成 |
| 7 | 多租户能力评估 | 第 5 周期 Sprint 20y 评估文档 + 第 6 周期实施 | roadmap §6 多租户准备 |

#### 2.3.2 第 6 批 5 入选实施清单

来源：[[feedback_main_v02_wave_fghij_complete]] §第 6 批 8 候选评分

| # | 模块 | Sprint 安排 | 责任方 | 备注 |
|---|---|---|---|---|
| 1 | **库存监控** | Sprint 20u（第 5 周期 wave 1）| main + second | 库存试点 20n+20o 基础延续 / dashboard 实时告警 |
| 2 | **采购合同** | Sprint 20t（本 Sprint 启动 T-A1+T-A2）→ Sprint 20u-20v 闭环 | main | C-02 字段补强 Sprint 9a 顺延实施同 commit |
| 3 | **数据治理监控** | Sprint 20u-20v（第 5 周期 wave 1-2）| main + AI 团队数据角色 | 6 handler ApplyAsync 全闭环 20l-20m 基础延续 |
| 4 | **审批历史** | Sprint 20v（第 5 周期 wave 2）| main + AI 团队后端 | 时间线 endpoint + UI 组件 / Sprint 20s T-A2 基础 |
| 5 | **NC 凭证导出 walk-through** | Sprint 20w（第 5 周期 wave 3）| main + 财务方 | Sprint 20s NC 真联调 5 接口实测后 production-ready |

**第 6 批入选标准**：① production-ready 基础已就位 ② 试点单位明确反馈需求 ③ 工作量 ≤ 1 Sprint ④ 不阻塞其他模块 ⑤ AI 团队角色能接 / 入选 5 / 落选 3（机型管理 / 设备租赁监控 / 移动端审批 推迟第 7 批）

#### 2.3.3 微信小程序 Wave 1 准备清单

来源：[[feedback_main_v02_wave_fghij_complete]] + Sprint 20u T-A3 占位

| 阶段 | Sprint | 内容 | 工作量 |
|---|---|---|---|
| 选型评估 | Sprint 20u | Taro vs uni-app vs 原生小程序 3 选项评估 / cici 拍板选型 | 0.3 PD |
| 4 核心场景设计 | Sprint 20u | ① 凭证审批 ② 库存查询 ③ 数据治理通知 ④ 采购合同状态查询 | 0.2 PD |
| 后端 BFF 层评估 | Sprint 20u | API Gateway 是否新增 / 复用 SupplyCores.Web / 鉴权方案（OAuth2 / JWT） | 0.2 PD |
| Wave 1 启动 | Sprint 20v | 选型确认后启动 / 4 场景中 1-2 个试点 | 0.5 PD |

**前置条件**：① cici Q4 战略拍板 ② AI 团队 Q1 next year wave 1 启动 ③ Sprint 20s NC 真联调 5 接口实测 production-ready / 试点单位反馈窗口稳定

### E 副轨（second e / 3 task / 总 ~0.6 PD）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** 采购合同前端（second 配对）| 0.3 | DevExtreme DataGrid 列表 + 详情 form（主合同 + 子合同 tab + 履约表 tab）/ Approval 状态展示 + NC 凭证下载 / brand tokens + ui-ux-pro-max checklist / 类 Sprint 20p ProcurementDocument 前端模板 / **R-05 押金状态机 UI 展示**（BondReleaseState 4 值 badge + BondReleaseDate 格式化）|
| **T-E2** 第 6 批前端 5 候选全 done 收尾（second）| 0.2 | main V0.2 §第 6 批 5 入选实施评分 / second e 收尾 5 候选 walk-through page 完整化 + UI polish + e2e smoke / 类 Sprint 20n part 2 试点反馈修正模板 |
| **T-E3** Cycle 5 roadmap second 前端配合占位 | 0.1 | 微信小程序 Wave 1 前端选型 second 参与意见（Taro vs uni-app 前端栈对比）+ 4 核心场景 UI/UX wireframe 占位（pending Sprint 20u 启动）|

**second 总：~0.6 PD**（3 task / Day 1-3 与主轨并行 / 不阻塞主轨收尾）

### D 顺延说明

- ~~D 线 NC/财务接口真联调~~：**Sprint 20r-20s 已激活 / Sprint 20t T-A2 采购合同业务闭环 Apply 复用 / 不再顺延**
- ~~C-02 字段补强 Sprint 9a 顺延~~：**Sprint 20t T-A1 实施（详 §2.1）/ 详设 09 V0.2 升版同 commit / 不再顺延**
- **production deployment cutover 实战**：推迟到 Sprint 20u+ 第 5 周期开局（V0.2 拍板时确认 / 20t 仅启动采购合同 + 收尾不做 cutover）
- 第 5 周期（20u-20y）roadmap V0.3 详细规划：T-A3 起草 V0.3 / V0.4 cici 拍板细化

---

## 三、cici 协调点（V0.2 拍板回填 / 早晨 2026-05-19）

### 3.1 已拍板（V0.2 启动）

| # | 拍板项 | cici 决策（2026-05-19 早晨）| 落实 task |
|---|---|---|---|
| **Q1** | C-02 字段补强 Sprint 9a 顺延范围 | **A 拍板**：BondReleaseState + BondReleaseDate + SY-02 字典化全实施 / 详设 09 V0.2 升版同 commit / R-05 Detector 升级回归测试 ≥ 90% | T-A1 §2.1 |
| **Q2** | 采购合同三表结构 | **A 拍板**：主合同 + 子合同 + 履约表 三表（PurchaseContract + PurchaseSubContract + PurchaseContractFulfillment）/ schema `p`（purchase） | T-A1 |
| **Q3** | Cycle 5 第 5 周期 roadmap V0.1 范围 | **B 拍板**：仅战略方向 + Q4-Q1 大方向（应用 cici 7 战略拍板 + 第 6 批 5 入选实施 + 微信小程序 Wave 1 准备）/ 不做 5 Sprint 详细规划 | T-A3 §2.3 |
| **Q4** | 第 6 批模块准入 5 入选清单 | **A 拍板**：库存监控 + 采购合同 + 数据治理监控 + 审批历史 + NC 凭证导出 walk-through（5 入选 / 3 落选推迟第 7 批）| T-A3 §2.3.2 |
| **Q5** | 微信小程序 Wave 1 启动时机 | **A 拍板**：Sprint 20u Wave 1 选型 + Sprint 20v Wave 1 4 核心场景 / Taro vs uni-app vs 原生小程序 3 选项评估 / cici Sprint 20u 拍板选型 | T-A3 §2.3.3 |

### 3.2 待拍板（V0.3 触发条件）

| # | 待拍板项 | 触发条件 |
|---|---|---|
| **Q6** | 第 5 周期试点扩大单位清单（10-15 单位）| Sprint 20s D5 满 + Sprint 20p-20s 试点 4 单位反馈累积 ≥ 2 周 |
| **Q7** | 跨系统集成方向 3 候选（OA / HR / 财务报表）| Sprint 20u T-A3 评估文档起草后 cici 拍板 |
| **Q8** | 多租户能力评估范围 | Sprint 20y 第 5 周期收尾时启动评估 |

---

## 四、触发条件（V0.2 锁版前置）

### 4.1 必须达成（硬触发条件）

- ⏳ **Sprint 20s D5 满**（NC 真联调 5 接口实测验收 + 审批闭环 + runbook V0.3 实战修正 全 done）
- ✅ **cici 采购合同字段拍板**（V0.2 5 决策全拍板 2026-05-19 早晨）
- ⏳ **Cycle 3 第 4 周期 36+ Sprint 0 顺延维持**（Sprint 20p 44 → 20q 45 → 20r 46 → 20s 47 → 20t 48 全 done）

### 4.2 建议达成（软触发条件 / 不阻塞但建议）

- ⏳ Sprint 20q 合同模块基础已 production-ready（采购→合同关联 + 合同模块字段基础）
- ⏳ Sprint 20r 审批工作流引擎 production-ready（IApprovalGateway 接口稳定 + 三业务接入模板）
- ⏳ Sprint 20s NC 真联调 5 接口实测验收（BIZ-MR / RED / 007 / PAY / PAY-BATCH 全 production-ready）
- ⏳ long-term roadmap V0.2 cici 20+ 拍板项陆续应用到位（T-A3 V0.3 升版基础）
- ⏳ 5 AI SOP 30 天 onboarding 全 ready（main 整夜跑 2026-05-17→19 已完成 / Sprint 20u+ 招聘准备）
- ⏳ 第 6 批 5 入选模块基础全 production-ready（Sprint 20p-20s 累积）

### 4.3 触发条件检查清单（V0.2 启动前 main 主代理 a 复核）

- [ ] Sprint 20s 真正收口达成（commit + memory + V0.x 锁版）
- [x] cici 采购合同字段拍板（V0.2 §3.1 5 决策记录 / 2026-05-19 早晨）
- [ ] 48 Sprint 0 顺延达成（Sprint 20s T-A6 collateral）
- [ ] Sprint 20q + 20r + 20s 三 Sprint 累计前置条件 grep 验证
- [ ] long-term roadmap V0.2 拍板项整理（T-A3 V0.3 升版输入清单）
- [ ] R-05 Detector 简化版 commit `c8f2600` 现状 grep 验证
- [ ] 详设 09 V0.1 + V1.2 grep 验证（与 V1.3 合并基础）

---

## 五、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| **V0.2** | **2026-05-19 早晨 cici 拍板回填** | **cici 5 决策全 default 拍板**（早晨 / 类 Sprint 20s 模式）：Q1 A（C-02 字段补强 Sprint 9a 顺延全实施 / BondReleaseState + BondReleaseDate + SY-02 字典化 / 详设 09 V0.2 升版同 commit）/ Q2 A（采购合同三表结构 PurchaseContract + PurchaseSubContract + PurchaseContractFulfillment）/ Q3 B（Cycle 5 roadmap V0.1 仅战略方向 + Q4-Q1 大方向 / 不做 5 Sprint 详细规划）/ Q4 A（第 6 批 5 入选实施清单：库存监控 + 采购合同 + 数据治理监控 + 审批历史 + NC 凭证导出 walk-through）/ Q5 A（微信小程序 Wave 1 Sprint 20u 选型 + Sprint 20v 4 核心场景）/ **新增**：① §2.1 C-02 字段补强 Sprint 9a 顺延详化（5 子步骤 + Wave 67/68 migration + 简化版数据迁移）② §2.2 业务闭环模式（Approval 接通 + 月结反结 + R-05 押金状态机回写）③ §2.3 Cycle 5 第 5 周期 roadmap V0.1 起草章节（应用 cici 7 战略拍板 + 第 6 批 5 入选清单 + 微信小程序 Wave 1 准备）④ T-A5 memory + Sprint 20u V0.1 起草新增 / 5 task 总 1.0 PD / 副轨 3 task 0.6 PD / **48 Sprint 0 顺延目标** / 工作量维持 ~1.6 PD（vs V0.1 ~1.6 PD 不变）|
| V0.1 | 2026-05-19（main 整夜跑预先起草 / 占位 / 触发条件 = Sprint 20s D5 满 + cici 采购合同拍板）| main a 起草 / Sprint 20t 任务卡占位版 / **主题切换：采购合同启动（第 4 周期收尾）+ Cycle 4（第 5 周期）启动准备**（vs 历史 V0.2 production deployment cutover 推迟到 Sprint 20u+ 第 5 周期开局）/ 4 task 主轨 ~1.0 PD（T-A1 采购合同 backend skeleton + T-A2 业务闭环 Apply + T-A3 第 5 周期 roadmap V0.1 起草 + T-A4 Codex Round 19 立修）/ 2 task 副轨 ~0.6 PD（T-E1 前端 + T-E2 第 6 批 5 候选收尾）/ wall-clock 2-3 天 / 触发条件：Sprint 20s D5 满 + cici 采购合同拍板 + Cycle 3 第 4 周期 36+ Sprint 0 顺延维持 / 目标 **47 Sprint 0 顺延达成**（第 4 周期完整闭环里程碑）|

---

**Created**: 2026-05-19 main 整夜跑预先起草 → V0.1 占位 → 2026-05-19 早晨 cici 5 决策全拍板 → V0.2 升版 / main 主代理 a / 第 4 周期 20p-20t 5 Sprint 收尾 + 采购合同启动 sprint + 第 5 周期 roadmap V0.1 起草 + C-02 字段补强 Sprint 9a 顺延实施

**Status**: ✅ V0.2 cici 拍板锁版（早晨 2026-05-19 / 5 决策全 default 拍板）/ 不 git add / 不 commit / main 收口 / 待 Sprint 20s D5 满 + 48 Sprint 0 顺延达成触发 Day 1 启动

**Related**:
- [`Sprint-20s-任务卡-V0.2.md`](Sprint-20s-任务卡-V0.2.md)（前序 / NC 真联调 5 接口实测 + 审批闭环 + runbook V0.3 实战修正 / D5 满触发本 Sprint）
- [`Sprint-20r-任务卡-V0.2.md`](Sprint-20r-任务卡-V0.2.md)（前前序 / 审批工作流引擎 + NC 真联调启动 D 线激活）
- [`Sprint-20q-任务卡-V0.4.md`](Sprint-20q-任务卡-V0.4.md)（前前前序 / 合同模块 + 采购→合同关联 / 本 Sprint T-A1 基础）
- [`Sprint-20p-任务卡-V0.3.md`](Sprint-20p-任务卡-V0.3.md)（第 4 周期开局 / ProcurementDocument 试点验证）
- [`Sprint-20o-任务卡-V0.4.md`](Sprint-20o-任务卡-V0.4.md)（第 3 周期收尾模板参考 / 同收尾 sprint 模板）
- [`../../SupplyCores/docs/internal/sprint-20u-20y-roadmap.md`](../../SupplyCores/docs/internal/sprint-20u-20y-roadmap.md) V0.2 → V0.3（第 5 周期 roadmap / T-A3 升版应用 cici 7 战略拍板）
- [`../../SupplyCores/docs/internal/sprint-20z-20ad-roadmap-V0.1.md`](../../SupplyCores/docs/internal/sprint-20z-20ad-roadmap-V0.1.md)（第 6 周期 roadmap 占位 / 第 5 周期收尾 Sprint 20y T-A2 真填触发）
- [`../../SupplyCores/docs/internal/cycle4-batch6-module-scoring-V0.2.md`](../../SupplyCores/docs/internal/cycle4-batch6-module-scoring-V0.2.md)（第 6 批 8 候选评分 V0.2 / T-A3 §2.3.2 5 入选实施基础）
- [[feedback_codex_0_carryover_8_sprint_record]]（43 Sprint 0 顺延记录 / 第 4 周期目标 48 Sprint）
- [[project_strategic_pivot_cycle3_data_governance]]（第 3 周期战略转向延续 / 第 4 周期采购合同扩展）
- [[project_r05_simplification_owed_to_sprint9]]（C-02 字段补强从 Sprint 9a 顺延 / 本 Sprint T-A1 §2.1 详化实施）
- [[feedback_main_overnight_cross_day_2026_05_18_19]]（main 整夜跑预先起草模式 / 本 V0.1 占位即整夜跑产出）
- [[feedback_sprint20p_day1_full_loop_complete]]（第 4 周期协调试点开局模板）
- [[feedback_main_v02_wave_fghij_complete]]（main V0.2 Wave J 第 6 批 8 候选评分 + cici 7 战略拍板基础 / Cycle 5 roadmap T-A3 §2.3.1 输入）
- [[feedback_versioned_doc_filename]]（教训 13 完整 6 步模板 / V0.1 → V0.2 升版 5 次实测成熟稳定 / 本 V0.2 升版第 6 次应用）
