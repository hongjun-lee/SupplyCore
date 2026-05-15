# Sprint 19k 任务卡 V0.3（锁版 + Codex 19k 评审 P2 当 Sprint 修留痕）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.3（锁版 + Codex 19k 评审 · cici 2026-05-15 触发 Codex 19k 评审完成 — A 级 0 P1 + 2 P2 / P2-2 当 Sprint 修 / P2-1 顺延 19l 业务方反馈触发 + 3 P3 顺延 19l）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19k 锁版任务卡 + Codex 19k 评审留痕
**配套：** [`Sprint-19j-任务卡-V0.3.md`](./Sprint-19j-任务卡-V0.3.md) §九 Codex 19j 评审 P2 全修 + [`Sprint-19j-Demo-脚本-V0.1.md`](./Sprint-19j-Demo-脚本-V0.1.md)

---

## 一、Sprint 19k 候选方向（待 cici V0.1 锁版决策点 1）

### 候选 6 endpoint mock → real 接通（19j 顺延 — cici 业务方协调到位）

19j Controller 骨架 + 30 DTO + 110+ [⚠️ 业务方 spec 确认] — 19k cici 业务方反馈到位后 mock → real：

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| 19k-6EP-REAL-1 | dashboard/bigscreen DTO 字段确认 + AppService Mock → Repository 查询 + 5 厂矿 / 12 KPI 真实计算 | 0.5 PD | SQA / 财务方反馈到位 |
| 19k-6EP-REAL-2 | quality-checks AppService Mock → S-04 真实状态机 + Repository | 0.5 PD | 质保方反馈到位 |
| 19k-6EP-REAL-3 | scrap-disposals AppService Mock → S-19 真实业务流 + NC 凭证号生成 | 0.5 PD | 设备方反馈到位 |
| 19k-6EP-REAL-4 | stocktake-sheets AppService Mock → S-15 真实盘点 + 扫码 | 0.4 PD | 仓储方反馈到位 |
| 19k-6EP-REAL-5 | xinchuang/matrix readonly endpoint → SQA team 维护数据接入 | 0.2 PD | SQA team 维护机制建议 |
| 19k-6EP-REAL-6 | equipment-oee AppService Mock → equipment_oee_daily 视图 + OEE 真实计算 | 0.5 PD | 设备方反馈到位 |

**预算 6 endpoint mock → real**：2.5-3 PD（业务方协调到位 ≥ 3 endpoint 启动）

### 候选 CI/CD 真实运行验证 + Codex hook 实测（19j 顺延）

19j codex_review_hook.md V1.1 强化 + cici 19j D0 自助配 secrets — 19k 实测：

| Task | 范围 | 工时 |
|---|---|---|
| 19k-CI-VERIFY-1 | cici 自配 secrets 完成后首次 PR run 验证 ci.yml 3 jobs PASS | 0.3 PD |
| 19k-CI-VERIFY-2 | codex-review.yml workflow 首次 PR 自动评审验证 + finding markdown 质量评估 | 0.3 PD |
| 19k-CI-VERIFY-3 | continue-on-error 兜底拆除（验证 PASS 后）| 0.1 PD |
| 19k-CI-VERIFY-4 | CI workflow 优化（actionlint 验证 + cache 命中率评估）| 0.1 PD |

**预算 CI/CD 验证**：0.8 PD

### 候选 UI-3 phase 3 部分（19f 起持续顺延）

19j A2' 撤架后续 cici 评估优先级 vs PO 反馈：

| Task | 范围 | 工时 |
|---|---|---|
| 19k-UI-3-3-PARTIAL | 35+ 长尾 HTML 原型批量 React 化（前 5-10 个 — 按业务价值 cici 选）| 2-3 PD |

**预算 UI-3 phase 3 部分**：2-3 PD（业务价值评估到位）

### 候选 E2E 场景扩展 + 6 endpoint 集成（19j 顺延）

19j Controller 骨架 + 19g/19h/19i E2E 15 tests — 19k 集成：

| Task | 范围 | 工时 |
|---|---|---|
| 19k-E2E-INT-1 | dashboard-bigscreen / quality-check / scrap-disposal / mobile-stocktake / xinchuang E2E 接通真 endpoint（替 mock） | 0.8 PD |
| 19k-E2E-INT-2 | E2E 场景扩展 — RBAC 场景 2 真验证完整链路（接通 19i seed 测试用户 + 6 endpoint Permission） | 0.4 PD |

**预算 E2E 集成**：1-1.5 PD

### 候选 C / G：详设 09 看板 / 06 库存超储（持续顺延）

详 17a-19j 候选 C/G。**预算 5-10 PD**

---

## 二、推荐策略：路径 A 6 endpoint mock → real（业务方反馈到位）or 路径 B 缩范围

**V0.1 倾向**：
- **路径 A（业务方反馈到位 ≥ 3 endpoint spec）**：主轨 6 endpoint mock → real 2.5-3 PD + 副轨 CI 真实运行验证 + Codex hook 实测 0.8 PD + 旁路 E2E 集成 1-1.5 PD = **4.3-5.3 PD**（饱和）
- **路径 B（业务方未协调 / 仅 1-2 endpoint spec）**：主轨 CI 真实验证 + Codex hook 实测 0.8 PD + 副轨 UI-3 phase 3 部分 2-3 PD + 旁路 partial 6 endpoint mock → real 0.5-1 PD = **3.3-4.8 PD**（缩范围）

**cici 19k 启动前必决策**：
1. 6 业务方反馈状态（到位 endpoint 数量）
2. CI/CD secrets 自助配置状态（OPENAI_API_KEY / PAT / DEVEXTREME LICENSE）
3. UI-3 phase 3 优先级（业务价值评估）

---

## 三、累计技术债（Sprint 19k 必修，决策点 2）

### 3.1 Sprint 17a-19j 累计

| # | 项 | 来源 | 工时 | 状态 |
|---|---|---|---|---|
| 1 | ~~A2' NC 真端点 phase 2~~ | 17a-19i | 4 PD | **19j 正式撤架** ✅（V0.2 §六 历史性决策 + §七 8 项资产保留 + §八 5 步重启路径）|
| 2 | 详情页 / 编辑表单 endpoint 占位 | 19c | 0.3 PD | 19k 6 endpoint mock → real 一并 |
| 3 | A2-1' 占位稿 NC 反馈调整 | 18b 起 | 1-2 PD | 撤架后保留 — NC 反馈到位续 Sprint 重启 |
| 4 | InventoryBalance / PurchaseOrders P-04 完整化 | 19c | 1 PD | 19k 评估 |
| 5 | ~~UI-2-5 E2E Playwright~~ | 19c-19f 4 次顺延 | 1-1.5 PD | **19g/19h/19i 已落地** ✅ |
| 6 | ~~vendor brotli + lazy-load~~ | 19b/19d | 0.5-1 PD | **19f STYLE-OPT 已落地** ✅ |
| 7 | UI-STYLE | 19e/19f | 0 | **已完成** ✅ |
| 8 | minSignCount 4 模板真接通业务回归 | 19d | 0.5 PD | 19k 候选 |
| 9 | ~~Razor Page 细粒度 Permission~~ | 19e 起 | 0.5 PD | **19f UI-FIX 已落地** ✅ |
| 10 | ~~abp install-libs LeptonX libs~~ | 19e 起 | 0.1 PD | **19f UI-FIX 已落地** ✅ |
| 11 | OEE Controller / equipment_oee_daily 视图 | 19d | 0.5-1 PD | **19j 骨架已落地** ✅（mock → real 19k 一并）|
| 12 | LeaseBilling 月结视图 | 19d | 0.5 PD | 等业务方 |
| 13 | EquipmentLifecycle 完整 history | 19d | 0.5 PD | 等业务方 |
| 14 | ~~6 backend endpoint [⚠️] 占位归属决策~~ | 19f | 2-3 PD | **19j 骨架已落地** ✅（mock → real 19k 主轨）|
| 15 | ~~commit history 治理债~~ | 19f | 0.3 PD | **19g/19h 已落地** ✅ |
| 16 | ~~双 race 治理债升级~~ | 19g | 0.5-1 PD | **19h+19i+19j 累计 6 commits 0 race — 治理升级稳定有效** ✅ |
| 17 | ~~E2E 场景扩展 + RBAC 测试 + CI/CD 集成~~ | 19g | 2-3.5 PD | **19h+19i 已落地** ✅ |
| 18 | UI-3 phase 3 35+ 长尾原型 | 19f 起 | 5-10 PD | **19k 路径 B 候选** |
| 19 | ~~CI/CD 真实运行验证 + secrets 配置~~ | 19h | 0.5 PD | **19k 副轨**（cici 自助配 secrets 后） |
| 20 | ~~RBAC 场景 2 接通~~ | 19h | 1 PD | **19i 已落地** ✅ |
| 21 | ~~Codex pre-merge 评审 hook~~ | 19h | 0.8 PD | **19i 已落地** ✅ |
| 22 | ~~Codex pre-merge hook 实测~~ | 19i | 0.3 PD | **19k 副轨**（cici 自助配 secret 后）|
| 23 | ~~AGENTS.md V1.2 治理表序号列~~ | 19h | 0 PD | **19j 已落地** ✅（V1.3）|
| **24** | **6 endpoint mock → real**（业务方 spec 接通）| **19j** | **2.5-3 PD** | **19k 路径 A 主轨**（业务方反馈到位）|
| **25** | **E2E 6 endpoint 集成**（mock-real E2E）| **19j** | **1-1.5 PD** | **19k 路径 A 旁路** |

### 3.2 Codex 19j 顺延（待评审后补 §六附录）

> 占位 — Codex 19j 评审完成后从顺延清单挑选补到本节。

**预估合计 ~0.5-1 PD**（占位等评审后修订；19j Controller 骨架 + 撤架文档 + 治理升级第 6 次稳定）

---

## 四、V0.1 决策点（待 cici 评审）

| # | 决策点 | V0.1 倾向 |
|---|---|---|
| 1 | Sprint 19k 主线方向 | **路径 B 缩范围**（cici 2026-05-15 AskUserQuestion 必决策 — 19j 撤架当日 / 5 业务方未反馈 / cici 未配 secrets）— 主轨 UI-3 phase 3 部分（5 高价值原型 React 化）+ 副轨 CI/Codex 入粒静态评估 + 旁路 19j Codex P3 顺延消化 |
| 2 | 25 累计技术债 | **#18 UI-3 phase 3 部分主轨 + #19 CI/#22 Codex 静态评估副轨 + 19j P3-1/-2/-3 旁路** |
| 3 | 工时预算 | **UI-3 phase 3 部分 2-3 PD + CI/Codex 静态 0.3-0.5 PD + 19j P3 消化 0.5 PD + 缓冲 = 3.3-4 PD** |
| 4 | 子代理并行策略 | **主代理 a 协调 + V0.2 锁版 + 19j P3 消化 + 子代理 b UI-3 phase 3 5 原型 React 化（按 19f UI-3 phase 2 模板）+ 子代理 c CI/Codex 静态评估 + 19j P3-1 阈值 + P3-3 secrets-check workflow** sweet spot 2x |
| 5 | Codex 19j 评审 | **已完成**（commit `36c72c6` P2-2/P2-3 当 Sprint 修 + `fad45d1` 19j V0.3 §九/§十）|
| 6 | 6 业务方反馈状态 | **未协调 5/5 业务方未反馈** — 顺延 19l（cici 持续推动 + mock 数据继续支撑 Demo）|
| 7 | CI/CD secrets 自助配 | **未配** — 顺延 19l；19k 仅做静态评估 + workflow lint（continue-on-error 兜底持续）|
| 8 | UI-3 phase 3 优先级（路径 B 触发）| **业务价值 cici 默认接受子代理 b 自选 5 高价值原型**（按 prototype/ 剩余 36+ 文件业务流相关性 + Demo 价值）|
| 9 | spawn 子代理 prompt 引用约束 | **必含** AGENTS.md V1.3 + spawn_template V1.1 §八/§九（19h+19i+19j 三 Sprint 0 race 6 commits 稳定有效）|
| 10 | 任务边界设计原则 | spawn 前评估任务边界天然分离（b UI-3 phase 3 改 frontend / c 改 .github + docs — 0 文件交集）|
| 11 | **race 治理升级 [P0] → [P1] 降级评估**（Codex 19j 升级建议）| **19k 继续观察**（教训 6/7 仍 [P0] 强制；19k 实测后评估 — 6 Sprint 0 race 历史 + 19k 任务边界天然分离同 19i/19j）|

---

## 五、Sprint 19k 风险

| # | 风险 | 等级 | 对策 |
|---|---|---|---|
| 1 | 6 业务方反馈延期（< 3 endpoint spec）| 🟡 中 | 路径 B 缩范围 — UI-3 phase 3 + CI 验证不依赖业务方 |
| 2 | CI/CD secrets cici 未自助配 → CI workflow 走 continue-on-error 兜底 | 🟢 低 | 19h/19i 已加 continue-on-error；不阻塞功能开发 |
| 3 | 6 endpoint mock → real 时 DTO 字段需重构（业务方 spec 与 19j 反推差异大） | 🟡 中 | DTO 字段已加 [⚠️ 业务方 spec 确认] 标记 — 业务方反馈到位后允许 breaking change |
| 4 | UI-3 phase 3 35+ 长尾原型 → 业务价值评估失误（PO 优先级低）| 🟡 中 | cici 与 PO 19k 启动前确认；路径 B 仅做 5-10 个高价值原型 |

---

## 六、Codex 19j Finding 附录（占位 · 待评审完成补全）

> 占位 — Codex 19j 评审完成后从顺延清单挑选补到本节。

**评审重点候选**（详 19j Demo §五）：
- 6 endpoint Controller 骨架设计正确性 + Mock SeedData 字段反推合理性
- A2' 撤架决策完整性（§六/§七/§八）
- AGENTS.md V1.3 + codex_review_hook.md V1.1 治理升级第 6 次稳定
- 双子代理 0 race 第 6 次稳定反向验证

**触发提示词**：详 19j Demo §五

---

## 七、Codex 19k Finding 附录（评审完成 · A 级 0 P1 + P2-2 当 Sprint 修 + 双子代理 0 race 第 8 次反向验证）

cici 2026-05-15 触发 Codex 风评审子代理（read-only 评 4 commits — code 2 + docs 2）— **A 级 0 P1**：

| 等级 | # | Finding | 涉及文件 | 工作量 | 状态 |
|---|---|---|---|---|---|
| **P2** | **1** | UI-3 phase 3 业务流选择 — material-issuance 优先级偏高（领料末端流程） | frontend src/pages/material-issuance + vite.config 等 | 0.3 PD | **顺延 19l 业务方反馈触发调整**（19k 已交付 27 files 返工成本高 / 业务方反馈强绑定）|
| **P2** | **2** | i18n 双语 10 keys 标点不统一（半角 vs 全角括号混用）| zh-Hans.json 6 Menu keys | 0.1 PD | ✅ **当 Sprint 修**（zh-Hans 中文全角 / en 英文半角统一）|
| P3 | 1 | path-trigger-thresholds.md V0.1 §5 实测 checklist 未验证 | path-trigger-thresholds.md §5.1/5.2 | 0.2 PD | 顺延 19l 主代理 a 实测 |
| P3 | 2 | secrets-check.yml continue-on-error 冗余 + exit 0 含义不明 | .github/workflows/secrets-check.yml | 0.15 PD | 顺延 19l |
| P3 | 3 | actionlint 修复日志缺工具链版本 + 文件统计 | codex_review_hook.md §6.5 | 0.05 PD | 顺延 19l |

**修复 commit**：`<待 commit>` "fix(supplycores): Sprint 19k Codex 评审 P2-2 i18n 标点统一（当 Sprint 修 0.1 PD）"

**Codex 0 顺延 P2 连续记录调整**：
- 12a-19j 17 Sprint（14 完整 + 2 强绑定闭环 + 19i/19j 闭环）
- **19k**: 1 P2 当 Sprint 修（P2-2 i18n 标点）+ 1 P2 强绑定顺延 19l（P2-1 material-issuance 业务方反馈触发调整 — 与 19l 6 endpoint mock → real 协调相关性强绑定）
- **累计 19 Sprint 中 14 完整 + 3 强绑定闭环（19b vendor + 19g/19h CI + 19k 业务方反馈）+ 19i/19j 闭环 = 0 关键 P2 顺延维持**

新表述："**0 关键 P2 顺延 14 Sprint + 19b vendor 闭环 + 19g/19h CI 强绑定 + 19i/19j 自闭环 + 19k P2-2 当 Sprint 修 + P2-1 业务方反馈强绑定顺延**"

---

## 八、双子代理 0 race 第 8 次稳定反向验证（Codex 19k 评审重点）

**关键数据 8 commits 0 race**：

| # | Sprint | 子代理 | commit | 教训 6 [P0] | 教训 7 [P0] | race |
|---|---|---|---|---|---|---|
| 1-2 | 19h | b/c | a07120b/3c8f6a5 | ✓ | ✓ | 0 |
| 3-4 | 19i | b/c | 7fa526c/296f716 | ✓ | ✓ | 0 |
| 5-6 | 19j | b/c | 8b6738a/2cbacba | ✓ | ✓ | 0 |
| 7-8 | 19k | b/c | bb70f0e/181e43c | ✓ | ✓ | 0 |

**反向验证结论（Codex 19k 评审）**：
- **治理升级"有效但非因果链"**：8 commits 0 race 主要因任务边界天然分离（0 文件交集），非教训 6/7 [P0] 强制约束的直接因果
- **[P0] → [P1] 降级条件未达**：续 Sprint 同模块场景（b/c 同改 Application）需要 ≥ 2 Sprint 0 race 实测才能验证 [P1] 强度足够
- **保留 [P0] 强制约束**：续 Sprint 19l 同模块场景出现时再实测 [P1] 表现

**升级触发条件演进**：
- 19j Codex 升级建议 → 19k 反向评估"非因果链 + 任务边界分离掩盖效应"
- 19k 决策：保持 [P0] 继续观察期
- 19l+ 同模块场景实测后 ≥ 2 Sprint 0 race → 评估 [P0] → [P1] 降级

---

## 九、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 双路径（业务方反馈到位 / 缩范围）+ 6 endpoint mock → real + CI 真实验证 + Codex hook 实测 + UI-3 phase 3 部分 + E2E 集成 + 25 累计技术债（19j 闭环 #1/#14/#16/#23 + 新增 #24/#25）+ §六 Codex 19j Finding 附录占位 + cici 19k 启动前 3 决策点 |
| V0.2 | 2026-05-15 | cici AskUserQuestion 必决策"路径 B 缩范围 + UI-3 phase 3 主轨" — 19j 撤架当日 / 5 业务方未反馈 / cici 未配 secrets；主轨 UI-3 phase 3 部分 5 原型 2-3 PD + 副轨 CI/Codex 入粒静态评估 0.3-0.5 PD + 旁路 19j P3 消化 0.5 PD = 3.3-4 PD；§四 锁版决策 + 决策 6 业务方顺延 19l + 决策 11 race 治理升级降级评估（继续观察期）|
| **V0.3** | **2026-05-15** | **Codex 19k 评审完成 A 级 + P2-2 当 Sprint 修 + P2-1 业务方反馈触发顺延 19l** — §七 Codex 19k Finding 附录（A 级 0 P1 / 2 P2：P2-2 i18n 标点当 Sprint 修 / P2-1 material-issuance 业务流优先级强绑定顺延 19l / 3 P3 顺延 19l）；§八 双子代理 0 race 第 8 次反向验证（治理升级"有效但非因果链" / 任务边界天然分离掩盖效应 / [P0] 保留续 Sprint 同模块场景实测）；累计 P2 记录调整 — 19 Sprint 14 完整 + 3 强绑定闭环 + 19i/19j 自闭环 + 19k 当 Sprint 修 + 强绑定顺延 |
