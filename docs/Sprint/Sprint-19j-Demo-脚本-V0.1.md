# Sprint 19j Demo 脚本 V0.1

**项目：** 阜矿物资供应管理系统 / SupplyCores
**版本：** V0.1
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19j 验收演示脚本（含 A2' 9 次顺延 5 月历史性撤架决策）
**配套：** [`Sprint-19j-任务卡-V0.2.md`](./Sprint-19j-任务卡-V0.2.md)

---

## 一、Sprint 19j 落地范围

按 V0.2 锁版（cici AskUserQuestion 必决策"路径 B 正式撤架 A2' + 6 endpoint"），实际交付 **~3.0 PD**（vs V0.2 3.8-4.3 PD 节省 22-30%）：

| Day | 交付 | commit | 执行者 | PD |
|---|---|---|---|---|
| D0 | V0.1 → V0.2 锁版 + A2' 9 次顺延 5 月历史性撤架决策（§六 撤架决策 + §七 17a-19i 8 项资产保留清单 + §八 5 步重启路径）| `553965c` | a | 0.3 |
| **D1-3** | 6 endpoint Controller 骨架（24 files / 1737+ 行 / 30 DTO + 110+ [⚠️ 业务方 spec 确认] + Mock SeedData）| `8b6738a` | **b** | 1.8 |
| **D1-3** | CI secrets 自助强化（codex_review_hook.md V1.1）+ Codex hook 实测准备 + AGENTS.md V1.3 治理表序号列（19i 4 行实测）| `2cbacba` | **c** | 0.6 |

**A2' 副轨**：✅ **正式撤架**（cici 历史性决策）— 17a-19i 9 次顺延 5 月闭环；8 项资产保留无丢失
**6 业务方协调**：cici 19j D0 自助通知 5 业务方对接人（财务/质保/设备/仓储/SQA）— 待业务方反馈 spec
**CI/CD secrets**：cici 19j D0 自助配（OPENAI_API_KEY / SUPPLYCORES_CATIO_PAT / DEVEXTREME_LICENSE）— 0.1 PD 待 cici

**测试基线**：
- 后端 1760 测试零 regression
- **dotnet build SupplyCores.slnx 0 errors**（24 新文件 / 1737+ 行编译通过）✅
- frontend build 16 entries + brotli + 0 Circular ✅
- npm run lint 0 errors / 0 warnings ✅
- 6 新 endpoint swagger 可见（待主代理 a `dotnet run` 验证）

---

## 二、Demo 演示路径

### 路径 A：6 endpoint Controller 骨架（10 分钟 — 核心高光）

按导航顺序 6 endpoint：

1. **`GET /api/supply-cores/dashboard/bigscreen`** — 大屏聚合
   - 12 KPI + 库存价值 donut + 5 厂矿柱状 + 8 单据流 + 8 高敏感关注 + 8 实时事件
   - DTO 复合结构（DashboardBigscreenDto + 子 DTO × 6）

2. **`GET /quality-checks{,/{id}}` + `POST /{id}/judge`** — S-04 质检
   - 5 列表 mock + 1 详情（5 inspection items + 6 timeline）
   - 判定 echo（业务方 spec 未到位返回固定 success）

3. **`GET /scrap-disposals` + `POST /{id}/{approve|reject|execute}`** — S-19 处置
   - 5 mock（4 类报废 / 变卖 / 回收 / 销毁）+ NC 凭证号自动生成（execute 时）
   - 状态机 echo（业务方 spec 未到位）

4. **`GET /stocktake-sheets{,/{id}}` + `POST /{id}/{scan|sync}`** — S-15 盘点
   - 5 列表 mock + 1 详情（next item + 4 scanned）
   - 扫码 / 同步 echo

5. **`GET /xinchuang/matrix`** — readonly 信创矩阵
   - 5 分层 × 12 产品 × 3 目标 + 6 keyNotes + coverage 统计
   - 静态招标承诺数据（业务方协调建议 SQA 团队维护）

6. **`GET /equipment-oee/dashboard`** — OEE 大屏（19d 顺延接通）
   - 8 矿用设备 OEE 三率 mock（含 1 台 < 60% 预警示例）
   - equipment_oee_daily 视图 endpoint 占位

**演示步骤**：
1. `cd /Users/lihongjun/aizhetech/SupplyCores && dotnet run --project src/SupplyCores.Web`
2. 浏览器 http://localhost:5100/swagger → 看 6 新 endpoint
3. curl 6 endpoint → 返回 Mock SeedData（5-12 行 mock）
4. 业务方 spec 反馈后 → AppService Mock 替为真实 DTO 字段映射 + Repository + EF Core

### 路径 B：A2' 9 次顺延 5 月历史性撤架决策（10 分钟 — 关键里程碑）

**顺延历史**：
- 17a：A2' phase 1 OAuth2 + Polly + chaos 启动
- 17a-19c：phase 2 真端点 4 次顺延
- 19d：cici 撤主轨 + 5 步重启路径声明
- 19e-19g：A2-1' 占位稿 NC 反馈迭代（3 次性质改变顺延）
- 19h-19i：v0.2 评估"极高风险"持续顺延（2 次）
- **19j：cici AskUserQuestion 必决策路径 B 正式撤架**（9 次顺延 5 月闭环）

**撤架范围**（详 V0.2 §六）：
- ❌ 撤 NC 真端点 phase 2 主轨规划 + 4 task + 启动条件
- ✅ 保留 17a-19i 8 项基础设施资产（OAuth2 + Polly + chaos + WireMock + 21 Contributor + 占位稿 + Monitor + memory）

**5 步重启路径**（V0.2 §八）：cici 与项目方明确 NC 端对接人 → 60 ⚠️ 占位稿分级 → 项目级正式协调会议 → NC 反馈到位重启 → 续 Sprint 2-3 PD 仅新接 endpoint + 适配 schema（基础设施就绪）

**cici 撤架理由 4 项**：NC 单向沟通 / Codex 多 Sprint 反模式深化评估 / 业务方协调路径未走通 / 6 endpoint 业务方协调更接近交付

### 路径 C：双子代理 0 race 治理升级第 6 次稳定（5 分钟）

**19h + 19i + 19j 累计 5 commits 全 0 race / 0 误纳**（治理升级稳定有效）：

| # | Sprint | 子代理 | commit | 教训 6 [P0] | 教训 7 [P0] | race 结果 |
|---|---|---|---|---|---|---|
| 1 | 19h | b | `a07120b` | ✓ 精确 4 路径 | ✓ 4 步自检 | 0 race |
| 2 | 19h | c | `3c8f6a5` | ✓ 精确 9 路径 | ✓ 4 步自检 + 工作树 clean | 0 race / 0 误纳 |
| 3 | 19i | c | `296f716` | ✓ 精确 3 路径 | ✓ 4 步自检 + origin 二次核实 | 0 race / 0 误纳 |
| 4 | 19i | b | `7fa526c` | ✓ 精确 5 路径 | ✓ 4 步自检 + linear history | 0 race / 0 误纳 |
| 5 | 19j | c | `2cbacba` | ✓ 精确 2 路径 | ✓ 4 步自检 + origin 二次核实 | 0 race / 0 误纳 |
| 6 | 19j | b | `8b6738a` | ✓ 精确 24 路径（全 A） | ✓ 4 步自检 + 工作树 clean | 0 race / 0 误纳 |

**任务边界天然分离**：b 改 Domain/Application/HttpApi（业务）/ c 改 .github/docs/internal/AGENTS.md（基础设施 + 文档）— 0 文件交集。

### 路径 D：完整闭环演示（5 分钟）

1. `cd /Users/lihongjun/aizhetech/SupplyCores && dotnet build SupplyCores.slnx` → 0 errors
2. `dotnet run --project src/SupplyCores.Web` → swagger /swagger 看 6 新 endpoint
3. curl 6 endpoint → 返回 Mock SeedData JSON
4. `cd modules/nova.supplycores/frontend && npm run build` + `npm run lint` → 0 errors
5. `npx playwright test --list` → 15 tests in 7 files（19g-19i E2E + RBAC）

---

## 三、关键决策回顾

| 决策点 | V0.2 锁版结论 | 落地状态 |
|---|---|---|
| 1. 主线方向 | 路径 B A2' 撤架 + 6 endpoint | ✅ 双轨闭环（撤架 + 骨架）|
| 2. 累计技术债 | #1 A2' 撤架 + #14 6 endpoint + #19 CI secrets + #22 Codex hook | ✅ 全闭环（#23 P3-2 治理表序号列）|
| 3. 工时预算 | V0.2 3.8-4.3 PD | **3.0 PD 实际** vs 预算 节省 22-30% |
| 4. 子代理并行 | b 6 endpoint + c CI secrets | ✅ 双子代理 0 race（**累计 5 commits 全 0 race 治理升级稳定有效**）|
| 5. Codex 19i 评审 | 待 cici 触发 | ⏳ 19j Demo 收尾后触发（提示词详 19i Demo §五）|
| 6. **A2' 命运决策（历史性）** | **正式撤架（cici 2026-05-15 决策）** | ✅ §六 决策记录 + §七 8 项资产保留 + §八 5 步重启路径 |
| 7. 6 业务方协调时机 | cici 19j D0 自助通知 5 业务方 | ⏳ 业务方 spec 反馈 19k+ 接通 |
| 8. CI/CD secrets 自助配 | cici 19j D0 自助配 | ⏳ cici 自助（V1.1 强化指南）|
| 9. spawn 子代理 prompt 引用约束 | 必含 AGENTS.md V1.3 + spawn_template V1.1 §八/§九 | ✅ 19j 双子代理 100% 遵守 |
| 10. 任务边界设计原则 | spawn 前评估任务边界天然分离 | ✅ 19j 实测 0 文件交集 |

### Sprint 19j 特殊性

**A2' 9 次顺延 5 月历史性撤架**：
- 17a-19i 主线规划路径正式终止
- cici AskUserQuestion 必决策清晰 + 4 项撤架理由
- 8 项资产保留无丢失声明 + 5 步重启路径 — NC 反馈到位续 Sprint 快速重启 2-3 PD

**6 endpoint Controller 骨架接通**：
- 24 files / 1737+ 行 / 30 DTO + 110+ [⚠️ 业务方 spec 确认] 标记
- Mock SeedData 5-12 行 per endpoint
- 19k+ 业务方反馈 spec 后 mock → real（仅替 AppService Mock 数据为真 Repository 查询）

**双子代理 0 race 第 6 次稳定**：
- 19h+19i+19j 累计 5 commits 全 0 race / 0 误纳
- 治理升级（AGENTS.md V1.3 + spawn_template V1.1 §八/§九 + 任务边界天然分离原则）三重保险稳定有效

**Codex 0 顺延 P2 连续记录维持**：
- 累计 16 Sprint 13 完整 + 2 强绑定闭环 + 1 部分顺延（19i 期望闭环 19h 1/3 → 待 Codex 19i 评审）
- 19j 期望保持（待 Codex 19j 评审 19k）

---

## 四、Sprint 19k 候选方向

| 候选 | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **6 endpoint 业务方 spec 反馈 mock → real** | DTO 字段映射 + Repository 查询 + EF Core | 2-3 PD | 5 业务方反馈 ≥ 3 endpoint spec |
| **CI/CD 真实运行验证** | secrets 自配后首次 PR run + continue-on-error 拆除 | 0.5 PD | cici 配 secrets |
| **Codex pre-merge hook 实测** | OPENAI_API_KEY 配置 + 首次 PR 自动评审验证 | 0.3 PD | cici 配 secret |
| **UI-3 phase 3 部分** | 35+ 长尾 HTML 原型批量 React 化（前 5-10）| 2-3 PD | 业务价值评估 |
| **E2E 场景扩展 + 6 endpoint 集成** | 6 endpoint mock-real E2E 链路 | 1-1.5 PD | 6 endpoint 业务方 spec 部分到位 |
| **C / G** | 详设 09 看板 / 06 库存超储（持续顺延）| 5-10 PD | 无 |

**V0.1 倾向**：路径 A 6 endpoint mock → real（业务方反馈到位）+ 副轨 CI 真实运行验证 + 旁路 Codex hook 实测 ~3-4 PD；或路径 B 缩范围 CI 验证 + UI-3 phase 3 起步 ~2.5-3 PD（业务方未协调时）

---

## 五、Sprint 19j Codex 评审待触发

> 占位 — Sprint 19j 完成时 cici 触发 Codex 19j 评审

**评审重点**：
- 6 endpoint Controller 骨架设计正确性（30 DTO + 110+ [⚠️] 标记完整性 / Mock SeedData 字段反推合理性）
- A2' 撤架决策完整性（§六/§七/§八 历史性决策 + 资产保留 + 重启路径）
- AGENTS.md V1.3 + codex_review_hook.md V1.1 治理升级第 6 次稳定文档化
- **6 endpoint 业务方 spec 等待期间 Mock SeedData 设计合理性**（字段反推 vs 业务方反馈差距）
- **A2' 撤架后续重启路径风险评估**（NC 反馈到位概率 + 5 步路径执行难度）

**触发提示词**：
"评审 Sprint 19j 共 3 commits（`553965c` V0.2 锁版 + A2' 撤架 / `2cbacba` c CI secrets + AGENTS V1.3 / `8b6738a` b 6 endpoint Controller 骨架）— 重点关注 **A2' 撤架决策完整性 + 资产保留清单 + 6 endpoint Mock SeedData 设计合理性 + 双子代理 0 race 第 6 次稳定反向验证**"

**累计 Codex 0 顺延 P2 记录目标**：保持 13 完整 + 2 闭环 + 19i 期望闭环 + 19j 期望 0 P2 顺延

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版 — A2' 9 次顺延 5 月历史性撤架 + 6 endpoint Controller 骨架 3.0 PD（vs V0.2 3.8-4.3 PD 节省 22-30%）+ 4 演示路径 + 双子代理 0 race 第 6 次稳定 + Codex 19j 触发提示 |
