# Sprint 20k 任务卡 V0.2（cici 6 反馈修订 / 第 3 周期开局 · 第 0 批上线准备 + 数据问题台账模块 / 38 Sprint 0 顺延目标）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（cici 6 点反馈修订 — #1 V0.2 任务卡补 / #3+#4 6 类模板链接同步 V0.2 / 2026-05-17）
**日期：** 2026-05-17
**文档性质：** 实施层 · Sprint 20k 任务卡（V0.2 修订 — cici 6 反馈修补 / 第 3 周期开局 / **第 3 周期第 1 Sprint / 上线 + 数据治理导向**）
**配套**：
- [`Sprint-20j-任务卡-V0.4.md`](./Sprint-20j-任务卡-V0.4.md)（第 2 周期末）
- [`sprint-20k-20o-roadmap.md`](../../../SupplyCores/docs/internal/sprint-20k-20o-roadmap.md) V0.2 §2.1
- [`分批上线与基础数据采集计划-V0.2.md`](../上线/分批上线与基础数据采集计划-V0.2.md)（同事 273 行建议）
- [`数据采集总览-V0.2.md`](../上线/数据采集模板/00-数据采集总览-V0.2.md)（6 类模板）
- [`数据问题台账-详设-V0.2.md`](../详细设计/数据问题台账-详设-V0.2.md)

---

## 〇、战略转向接续（V0.2 roadmap 主轴）

### 〇.1 战略调整（同事建议 / 不再堆功能 → 上线 + 数据治理）

按同事文档 §一总体判断：
> 主体框架、核心服务、报表大屏、NC 凭证导出主线、部署 runbook 和质量治理已经具备阶段性基础，但正式上线的主要风险不在"有没有代码"，而在数据是否完整、业务方是否确认字段、Mock 是否替换为真实数据、NC 真接通是否具备双方条件、上线后是否有问题台账。

**第 3 周期主轴**：
- 20k 第 0 批（上线准备 + 数据模板定版 + 数据问题台账 / 3-5 天 → 1 Sprint）
- 20l 第 1 批前段（数据采集试运行 / 1 周）
- 20m 第 1 批后段（数据清洗 + 质量报告 / 1 周）
- 20n 第 2 批（库存查询 + 基础单据试点 / 3-4 周开始）
- 20o 第 2 批续 + 第 3 批启动评估 + 5 Sprint 复盘

### 〇.2 Sprint 20j 收尾接续（37 Sprint 0 顺延 / 5 Sprint 周期目标达成）

- main 5 commits（5 Sprint 复盘 + production runbook + roadmap + perf baseline + Codex 立修）/ ~1.5 PD
- Codex 3 finding 全立修（OpenIddict + Hangfire + NcInterface 配置 key）
- 37 Sprint 0 顺延 / 连续 11 立修 + 5 次 0 finding 通过 / 26 finding 累计

---

## 一、Sprint 20k 范围（第 0 批上线准备 / 总 ~2-3 PD / 工期 ~1 day）

### 1.1 main 主代理 a 主轨（数据治理 + 上线准备 / ~1.8 PD）

| Task | PD | 描述 | 工作线 |
|---|---|---|---|
| **T-A1** 6 类基础数据采集模板（已完成 ✓）| **0**（已 Sprint 20j 后续完成）| docs/上线/数据采集模板/ × 7 文件（00 总览 + 01-06 6 类）/ 1018 行 / commit `25706cc` | A 数据治理 |
| **T-A2** 数据问题台账模块实施 | 0.6 | Entity + Manager + AppService + Controller + 单测 / 按 `数据问题台账-详设-V0.2.md` 详设 / commit `efd747f` | A 数据治理 |
| **T-A3** 试点单位推荐文档 + cici 协调追踪 | 0.1 | 推荐艾友 + 本部 / cici 与 PO 协调正式指定 | C 业务流程 |
| **T-A4** 第 2 次 demo 时段追踪 + 上线书面确认 | 0.1 | cici 与 PO 正式书面确认第一批上线范围 + 第 2 次 demo 时段 | C 业务流程 |
| **T-A5** Codex 20k 评审 + 立修 | 0.2 | `codex review --base 91fa02f`（20j Codex 立修末）/ 立修保 38 Sprint 0 顺延 | 标准 |
| **T-A6** Sprint 20k 收尾 + V0.x 升版 + memory | 0.3 | V0.1 → V0.4 锁版 + memory 升级（38 Sprint 0 顺延 / 战略转向沉淀）| 主代理 a 标准 |

main 主代理 a 总：**~1.3 PD**（实质工作量 / T-A1 已 sunk cost 完成）

### 1.2 second 主代理 e 副轨 — 数据问题台账 frontend 工具支持（~0.4-0.7 PD / 第 11 次连续）

| Task | PD | 描述 |
|---|---|---|
| **T-E1** 数据问题台账 frontend page | 0.4 | /supplycores/data-issue-log / DataGrid + Filter + Dialog + 统计 dashboard（按详设 §六）|
| **T-E2** 数据采集模板下载 page | 0.2 | /supplycores/data-import-template / 6 类模板 .xlsx 下载 + 字段说明 |
| **T-E3** 收尾 + memory + race 检查 | 0.2 | 第 11 次连续 Reports/Dashboards → 数据治理新模块（同模块连续被打破 / 算新模块第 1 次）|

second 副轨总：**~0.8 PD**

---

## 二、cici 20k 外部行动项

| 行动 | 紧迫性 | 描述 |
|---|---|---|
| **PO 正式书面确认第一批上线范围** | **极高** | 网信办 + 物资公司 + cici 协调 / 1 天内（同事第 1 立即动作）|
| **试点单位指定**（艾友 + 本部 推荐）| **极高** | 1-2 天（同事第 2 立即动作）|
| **第 2 次 demo 时段** | 高 | 本周内（同事第 4 立即动作 / F-3 + G-12 验收）|
| **6 类数据模板交付业务方** | 高 | 本周内 / 物资公司 + 各厂矿（同事第 3 立即动作 / 模板已就绪 / 仅需交付）|
| **数据采集启动会议** | 中 | 本周内（业务方接收模板 + 责任分工确认）|
| **切 second session** | 中 | 给 e 续 prompt 启动 20k second 副轨 |
| **Codex 20k 评审触发** | 标准 | D2 收尾时手动 `codex review --base 91fa02f` |

---

## 三、累计技术债（19r-20j 顺延 + 20k 处置）

| 来源 | Task | 20k 处置 |
|---|---|---|
| 20h+20i T-A3 测试 missing case | HighSensitive + dashboard real + Permission integration + Regenerator edge | **继续顺延 20l+ test 专项**（与上线优先级冲突）|
| 19r-20j G-13 A 顺延 | NcAccountRule 字典扩 | 继续顺延（业务方未触发）|
| 20i G-14~G-17 demo 反馈 | F-3 / G-12 frontend UI / NC 真号回写流程 | **T-A4 协调追踪**（demo 后启动）|
| **新增 / 同事建议产出** | 6 类数据模板 + 数据问题台账模块 + 4 工作线分工 | **T-A1/T-A2 实施**（main 主轨）|

---

## 四、子代理 spawn + 跨 session race 防御（V1.8 [P1] 降级生效）

### 4.1 1c 模块隔离表（延续 + 加 DataGovernance）

| session | 锁定模块 |
|---|---|
| **main** | Vouchers/* / Interfaces/* / Approvals/* / DbMigrator / voucher-management/* / contracts/* / monthly-prepayment/* / Warehouses/* / test/ / docs/部署/ / **DataGovernance/*（20k T-A2 新加）** |
| **second** | dashboard-bigscreen/* / reports/* / theme.css / DashboardBigscreenAppService / BusinessReportsAppService / NcInterfaceMonitor / DashboardCronConstants / **data-issue-log/* + data-import-template/*（20k T-E1 + T-E2 新加）** |

### 4.2 spawn 策略

- 默认主 worktree
- 教训 13 模板成熟稳定（第 22 次维持）
- main + second 同步：T-A2 main 实施 DataGovernance / T-E1 second frontend page 调用（API 已 stable / OK 并行）

---

## 五、Codex 20k 评审准备

- 20k 收尾 D2-D3 cici 手动触发：`codex review --base 91fa02f`（20j Codex 立修末）
- 5-15 min Codex 跑 / main a 后台等通知
- 立修保 **38 Sprint 0 顺延 / 连续 12 立修 OR 6 次 0 finding 通过**

---

## 六、V0.1 启动条件（cici 5 答拍板）

### 5 开放问题待 cici 答

1. **战略转向 V0.2 roadmap 是否采纳**：
   - A. 全部采纳（推荐 / 同事建议 + 我评估 90% 合理 / 已 V0.2 roadmap + 6 模板 + 详设 / 直接启动 20k T-A2）
   - B. 微调（cici 调整某 Sprint / 某主题）
   - C. 部分采纳（如保留部分 NC 真接通推进 + 数据治理并行）
   - D. 不采纳（按 V0.1 技术导向 roadmap 继续 / 但同事强烈建议 / 风险高）

2. **数据问题台账模块实施范围**：
   - A. 全实施（T-A2 0.6 PD / Entity + Manager + AppService + Controller + 单测 / 按详设完整）
   - B. 仅核心（Entity + AppService.RecordIssueAsync / 0.3 PD / 后续 Sprint 完善）
   - C. 顺延 20l（与 T-A1 6 类模板并行 / 但 20l 主轴是数据采集试运行 / 风险拥挤）

3. **second e 副轨范围**：
   - A. 全 T-E1 + T-E2 + T-E3（~0.8 PD / data-issue-log + data-import-template + 收尾）
   - B. 仅 T-E1 数据问题台账 page（~0.4 PD / 关键）
   - C. 暂停 second（main 单轨 / second 工作收敛于上线后期）

4. **试点单位推荐采纳**（艾友 + 本部）：
   - A. 采纳（艾友 / 中等规模 + 本部 / 协调容易 / 推荐）
   - B. cici 调整（PO 决策其他厂矿）

5. **20k 启动时间**：
   - A. 今天启动 D1（连续 / 37 Sprint 0 顺延动量延续 / cici 已工作多小时但选 8 小时模式）
   - B. 明天启动（保守 / 与同事 1-2 天定边界节奏一致）
   - C. 等 PO 书面确认（保守 / 业务方驱动）

### V0.2 拍板条件

- 5 开放问题 cici 答
- 1c 模块隔离表确认（加 DataGovernance + data-issue-log）
- second 主代理 e 同步任务卡

---

## 七、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 | main a 起草 · 第 3 周期开局 / 第 0 批上线准备 / 战略转向同事建议主轴 / 5 开放问题待 cici 答 |
| V0.2 | 2026-05-17 | second e cici 6 反馈修订 · #1 V0.2 任务卡补 + #3+#4 6 类模板链接同步 V0.2 + 计划链接 V0.2 |

---

**main 主代理 a 签名**：2026-05-17 V0.1 起草 / second e V0.2 cici 反馈修订（战略转向 / 第 3 周期 / 上线 + 数据治理导向）· 等 cici 5 答 + 升 V0.2 启动
