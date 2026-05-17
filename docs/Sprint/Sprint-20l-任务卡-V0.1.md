# Sprint 20l 任务卡 V0.1（2026-05-17 起草 / 第 3 周期数据治理阶段 1）

**Sprint**：20l（继 20k 收尾）
**主题**：数据治理阶段 1 — 6 类 handler 真实现 + 试导入 + 数据质量报告骨架
**节奏**：roadmap V0.3 第 1 阶段（20k-20m 1-2 周完成数据治理）/ 当前位于阶段中段

---

## 一、Sprint 20k 收口（前置事实 / commits 链）

| 时点 | commit | 内容 |
|---|---|---|
| V0.2 修订 | `c5893fe` `da6bda1` `4d85f17` `f6b5251` `545e7c9` `45ce2b3` `8d2b29e` | DataIssueLog 立修基类 + DataImportBatch 完整实施 + roadmap V0.3 + 跨仓 4 文档 V0.2 + 试点矿 4 次反馈定版（001.007.001+002+018）|
| 框架 + 模板 | `b3dbb05` `d3951e0` | 6 类导入框架 + 6 占位 handler + .xlsx 模板 on-demand 生成 |
| Codex round 1 立修 | `84fdffc` | P1 wwwroot 暴露 + P2 confirm 卡 Importing + P2 OrgId 硬编码 0 |
| cici 复查 + sweep | `aa3b32f` `9ef1f37` `3a5562a` `cf95e6d` | P1 前端 endpoint + Orchestrator 真调 handler + OrgId claim 推导 + P2 generator 对齐 V0.2 文档 + endpoint 统一入口 |
| Codex round 2 立修 | `bd43f1a` | P1 UoW 事务隔离防脏数据 + P2 行数去重 + P2 前端 designDoc 404 |
| Codex round 3 + 同事缺口 sweep | `1b1bb25` | P1 workbook blocking flag + P1 UoW deadlock 修 + SubGroupId 查询过滤 + fieldCount 修 |

**Sprint 20k 累计**：18 commits / 代码 ~2000 行 + 文档 ~1500 行 / 5 层 build 0 errors 全程维持 / 38 Sprint 0 顺延维持 ([[codex-0-carryover-8-sprint-record]] 连续 16 立修)。

---

## 二、Sprint 20l Task 清单

### A 主轨（main 主代理）

| Task | PD | 状态 | 说明 |
|---|---|---|---|
| **T-A1b** OrgUser handler Parse+Validate 真实现 | 0.4 | ✅ 本 wave done（子代理 B）| 392 行 / 5 类 issue（excel_read_error / sheet_missing / required_field_missing / phone_format_invalid / email_format_invalid / issue_type_enum_invalid）/ ApplyAsync 业务侧扩展点 NotImpl 待 cici 拍板（A→ReportAlert / B→IT 通知 / C→Nova 推送）|
| **T-A1c** Material handler Parse+Validate 真实现 | 0.5 | ✅ 本 wave done（子代理 C）| 665 行 / 14 类 issue（含 category_8_main_incomplete / material_no_nc_mapping / high_sensitive_mismatch 等业务校验）/ ApplyAsync 业务侧扩展点 NotImpl |
| **T-A2** 端到端试导入测试 + small-sample Excel | 0.3 | ⚠️ pending | 用 DataImportTemplateGenerator 生成 6 类 .xlsx 范本 → orchestrator UploadAndValidate → 验证 batch 状态 + IssueLog 落地正确 |
| **T-A3** Codex round 4 复测（验证 1b1bb25）| 0.1 | ⚠️ pending | base bd43f1a^ 验证 cici 复查 round 3 立修 0 finding |
| **T-A4** OrgUser + Material ApplyAsync 业务侧拍板 + 实施 | 0.6 | ⚠️ pending | 待 cici 决策：A 业务联系人 ReportAlert? / B 数据责任人 IT 通知? / C Nova 异常推送? / Material 入库时机 + NC 映射缺失 IssueLog 联动 |
| **T-A5** Sprint 20l Codex 评审 + 立修 | 0.2 | ⚠️ pending | 标准 |
| **T-A6** V0.x 升版 + memory（39 Sprint 0 顺延）| 0.2 | ⚠️ pending |  |

**main 累计**：~2.3 PD（前 wave 子代理 0.9 PD + 主代理 1.4 PD）

### B 辅轨（main 子代理 - 顺延）

| Task | PD | 实施 Sprint | 说明 |
|---|---|---|---|
| T-B1 Supplier handler 真实现 | 0.5 | 20m T-A1a | 5 sheet 联动 + 资质临期 cron 联动 |
| T-B2 Warehouse handler 真实现 | 0.5 | 20m T-A1a | 3 sheet 三级联动 + manager_employee_no 反查 User |
| T-B3 NcMapping handler 真实现 | 0.6 | 20m T-A1b | 5 sheet + NC 真接通前置 100% 校验 |
| T-B4 InitialStock handler 真实现 | 0.7 | 20m T-A1b | 20 字段 + 95% 准确率验收 + 高敏感 4 步走 |

### E 副轨（second 主代理 e / 跨 session）

详 `../../SupplyCores/docs/internal/second-e-prompt-20l-raw.txt`（V0.1 备料）：

| Task | PD | 说明 |
|---|---|---|
| T-E1 data-issue-log frontend 接通真接口 | 0.2 | 当前 V0.1 504 行 / endpoint 切真 API（去 mock） + filter 按 SubGroupId 隐含过滤验证 |
| T-E2 data-import-template frontend 已 V0.2 接通 | done | aa3b32f + bd43f1a + 1b1bb25 已修复 endpoint + 链接 + fieldCount |
| **T-E3** data-import-batch frontend page（新建）| 0.5 | upload 表单 + batch list 状态机展示 + IssueLog drill-down + confirm/rollback 按钮 + progress |
| T-E4 数据质量看板 dashboard（顺延 20m）| 0.4 | 6 类成功率 + 失败趋势 + 责任部门 SLA 命中 |

---

## 三、本 Sprint 关键节奏

### Day 1（本日 / 5-17）

- [x] Wave 1 并行（4 task 并行） — B + C 子代理 done / A + D 主代理 done
- [ ] Wave 2 — T-A3 Codex round 4 复测（后台跑 + 立修）+ T-A2 端到端试导入测试
- [ ] cici 切 second session 启动 T-E3

### Day 2-3

- T-A4 OrgUser + Material ApplyAsync 业务侧拍板 + 实施（cici 决策驱动）
- T-A5 Sprint 20l Codex 评审 + 立修
- T-A6 V0.x 升版 + memory（39 Sprint 0 顺延 / Sprint 20l 收尾）
- second e T-E1 + T-E3 完成

### Sprint 20m 衔接

- B 辅轨 4 个 handler（Supplier / Warehouse / NcMapping / InitialStock）按 20l 模式增量实施
- 数据质量报告骨架 → 试点单位（恒大 + 本部 + 物资公司 三单位组合）真填模板试导入

---

## 四、风险与依赖

### 高风险

- **OrgUser + Material ApplyAsync 业务侧扩展点**：需要 cici 拍板（A 业务联系人是否真入 m.contact_person 表？B 数据责任人放哪里？C Nova 异常如何通知 Nova 团队？）
- **Material → NC 映射缺失自动 IssueLog 联动**：与 05 NcMapping handler 互依赖（cross-handler 数据流）

### 中风险

- **端到端测试覆盖** — handler.ParseAsync 实测需要真 Excel；Generator 模板 + handler Parse 闭环未自动化测试
- **second e 模块切换成本** — data-import-batch page 与 data-import-template 共享 apiClient 但是新模块，~0.6 PD 切换成本（[[dual-session-19t-continuous-validation]] 实测）

### 低风险

- Codex round 4 大概率 0 finding（1b1bb25 已 sweep 3 round + cici 复查 / 累计 12 finding 立修）

---

## 五、对外汇报口径

> Sprint 20l 数据治理阶段 1：6 类导入 handler 完成 Parse + Validate 真实现（已 done OrgUser + Material 2/6 / 顺延 Supplier+Warehouse+NcMapping+InitialStock 4/6 到 20m）。试点单位（恒大+本部+物资公司）可下载 V0.2 模板试填 / 系统侧 ParseAsync + ValidateAsync 校验完整 / 数据问题台账 SubGroupId 隔离查询端到位。

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-17 晚 | main a 起草 / Sprint 20l 任务卡 / Wave 1 并行 4 task 子代理交付后立刻收口起草 |

---

**Created**: 2026-05-17 / Sprint 20k 收尾 → 20l 开局 / main 主代理 a
**Related**:
- [[strategic-pivot-cycle3-data-governance]] 第 3 周期战略转向
- [[v02-revision-full-loop-sprint20k]] Sprint 20k V0.2 反馈修订完整闭环
- [`../../SupplyCores/docs/internal/sprint-20k-20o-roadmap.md`](../../SupplyCores/docs/internal/sprint-20k-20o-roadmap.md) V0.3
- [`../上线/分批上线与基础数据采集计划-V0.2.md`](../上线/分批上线与基础数据采集计划-V0.2.md)
