# Sprint 19p 任务卡 V0.2（锁版）

**项目：** 阜矿物资供应管理系统 / SupplyCore
**版本：** V0.2（锁版 · cici 2026-05-15 /loop continue — 主轨 LOGIN-FIX 0.3-0.5 PD + 副轨 race-governance V0.4 line-level 方案设计 + Codex 评审历史汇总 ~1-1.5 PD）
**日期：** 2026-05-15
**文档性质：** 实施层 · Sprint 19p 锁版任务卡
**配套：** [`Sprint-19o-Demo-脚本-V0.1.md`](./Sprint-19o-Demo-脚本-V0.1.md) + [`Sprint-19o-任务卡-V0.3.md`](./Sprint-19o-任务卡-V0.3.md) §七 Codex 19o A 级评审

---

## 一、Sprint 19p 候选方向

### 19o 必修顺延

| Task | 范围 | 工时 | 启动条件 |
|---|---|---|---|
| **19p-LOGIN-FIX**（最高优先级）| ABP OpenIddict Login UI scheme check 修（admin 实际登录 + 跳 /supplycores/home + React Island mount 验收）| 0.3-0.5 PD | 无（19o b 基础设施全就绪）|
| **19p-E2E-SMOKE**（同事评审步 4）| 5 核心 + 全量 E2E 跑（Login 真实工作后）| 0.3 PD | 19p-LOGIN-FIX 完成 |

### 持续顺延

| 候选 | 工时 | 启动条件 |
|---|---|---|
| 6 endpoint mock → real | 2.5-3 PD | 5 业务方 ≥ 3 反馈 |
| CI/CD 真实运行 + Codex hook 实测 | 0.9 PD | cici 配 secrets |
| UI-3 phase 3 续 5-10 原型 | 2-3 PD | 业务价值评估 |
| race [P0] line-level 实测设计 | 0.5 PD | 19p 任务边界故意 line-level 同改 |

---

## 二、推荐策略：Login UI 修 + E2E smoke

**V0.1 倾向**：
- 主轨 **19p-LOGIN-FIX**（0.3-0.5 PD）— 解锁 cici 实际登录验收
- 副轨 **19p-E2E-SMOKE**（0.3 PD）— 同事评审步 4 完成
- 旁路 视 cici 路径：CI 真实运行 / 6 endpoint mock → real / UI-3 续
- 总 **~1-2 PD**（缩范围 — 优先解锁验收）

**cici 19p 启动前 4 决策点**：
1. 6 业务方反馈状态
2. CI/CD secrets 自助配
3. UI-3 续 vs 6 endpoint mock → real 优先级
4. race [P0] line-level 实测意愿

---

## 三、累计技术债（参考 17a-19o 累计）

详 19o V0.2 §三。**19p 重点**：
- #LOGIN ABP OpenIddict Login UI scheme check（19o 顺延 / 0.5 PD 必修）
- #E2E E2E smoke 全跑（同事评审步 4 / 0.3 PD）

---

## 四、Sprint 19p 风险

| # | 风险 | 等级 |
|---|---|---|
| 1 | Login UI scheme check 修复复杂度超预算 | 🟢 低（19o b 基础设施全就绪）|
| 2 | E2E spec 与真实 endpoint 字段不匹配（19o b 用 ABP 默认 admin / 19i RBAC 用 rbac.test.user.no_dashboard）| 🟡 中（spec 加 fallback）|
| 3 | 业务方反馈持续延期（19j-19o 6 Sprint）| 🔴 极高 |

---

## 五、Codex 19o Finding 附录（占位 · 待评审完成补全）

---

## 六、版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| V0.1 | 2026-05-15 | 初版草案 — 主轨 19p-LOGIN-FIX 0.3-0.5 PD + 副轨 19p-E2E-SMOKE 0.3 PD + 持续顺延（业务方 / CI / UI-3 / race line-level）+ §六 Codex 19o 占位 + cici 19p 启动前 4 决策点 |
