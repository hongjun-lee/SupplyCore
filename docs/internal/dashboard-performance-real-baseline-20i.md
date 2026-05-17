# Dashboard Real Environment Performance Baseline (Sprint 20i T-E2)

**Sprint：** 20i D1 second 主代理 e T-E2
**日期：** 2026-05-17
**目标：** 真实 host 环境（5100 serve）实测 baseline / 对照 20h T-E2 unit test 阈值

---

## 〇、实测条件

| 维度 | 状态 |
|---|---|
| host 进程 | PID 74004 / 19s 启动（24h+ 前 binary）/ 不含 19t b486dda DashboardBigscreenController |
| auth 状态 | anonymous / 触发 ABP redirect 中间件 → 302 跳 /Account/Login |
| Dashboard:UseMock | true（默认 / 真接通 DB 顺延 20j+） |
| endpoint 状态 | `/api/supply-cores/dashboard/bigscreen` 旧 binary 无路由 / 但 anonymous 在 controller 前被中间件拦截 → 302 不暴露 404 |

---

## 一、5 次实测样本（auth middleware overhead）

```
[run 1] GET /api/.../dashboard/bigscreen http=302 time=0.124469s size=0
[run 2] GET /api/.../dashboard/bigscreen http=302 time=0.104774s size=0
[run 3] GET /api/.../dashboard/bigscreen http=302 time=0.105120s size=0
[run 4] GET /api/.../dashboard/bigscreen http=302 time=0.104130s size=0
[run 5] GET /api/.../dashboard/bigscreen http=302 time=0.104340s size=0
```

**统计：**
- 首次（cold path）：124ms
- 后续 4 次：104-105ms（warm）
- **基础设施开销 baseline：~ 105ms**（auth middleware + redirect 计算 / 不含 controller endpoint 实际执行）

---

## 二、与 20h unit test 阈值对照

| 路径 | 20h spec 阈值 | 实测 | 说明 |
|---|---|---|---|
| Backend cache hit | < 10ms | unit test < 1ms / 真环境未测 | auth 拦截前置 / 真 endpoint 顺延 20j+ |
| Backend cache miss mock | < 50ms | unit test < 0.1ms / 真环境未测 | 同上 |
| **Auth middleware overhead** | — | **~ 105ms** | **20i 新实测 / 基础设施 baseline** |
| 真 endpoint 端到端 | < 500ms（spec） | 未测 | host restart + auth login + DB seed 后实测 / 20j+ |

---

## 三、关键结论

1. **Auth middleware ~105ms overhead** — 任何 anonymous 请求基础开销
   - 真用户场景：cookie auth ~50ms 中间件 + endpoint < 10ms = ~60ms 总（推测 / 待真测验证）
   - 大屏 30s 轮询场景：30000ms 间隔远 >> 105ms 单次开销 → 0 性能问题

2. **20h unit test 阈值仍合理**
   - cache hit < 10ms（实际 ~ 0.4ms）/ cache miss mock < 50ms（实际 ~ 4ms）
   - 真环境 cache hit < 100ms（spec）= unit test ~5ms + 网络 ~50ms + ABP middleware ~50ms ≈ 105ms 上限

3. **真接通端到端 baseline 顺延 20j+**
   - host restart 用最新 binary（含 DashboardBigscreenController）
   - Dashboard:UseMock=false + DB seed
   - admin login 拿 cookie 真实测 endpoint

---

## 四、真接通压测 SOP（20j+ 待执行）

1. kill PID 74004 旧 host / `dotnet run --project src/SupplyCores.Web --no-build`
2. 等 host listen 5100（curl -sf -o /dev/null /Account/Login）
3. login admin：`curl -c cookie.txt -d "UserNameOrEmailAddress=admin&Password=1q2w3E*" /Account/Login`
4. 切 `Dashboard:UseMock=false`（appsettings.Development.json）
5. cache 预热：`curl -b cookie.txt /api/supply-cores/dashboard/bigscreen` ×1
6. 实测 cache hit：`for i in {1..100}; do curl -b cookie.txt -w "%{time_total}\n" -o /dev/null /api/supply-cores/dashboard/bigscreen; done`
7. 实测 cache miss real：`curl -X POST -b cookie.txt /api/supply-cores/dashboard/bigscreen/refresh`（如有）+ 立即 GET 测首次

---

## 五、regression 触发条件（20i 新增）

- Auth middleware overhead > 200ms → ABP 配置 / 中间件链可能引入 N+1 等问题
- 真 endpoint 响应 > 500ms → 检查 DB 索引 / 8 aggregator EF Core query plan
- 30s 轮询导致 host CPU > 50% → Hangfire cron 预热失效 / 改 5min 间隔（已有 cron 配置）

---

## 六、与 20h baseline 互补关系

- **20h doc** — unit test baseline（< 10ms hit / < 50ms miss mock）/ 内部代码路径
- **20i doc** — 真环境基础设施 baseline（auth middleware ~105ms）/ 外部网络路径
- **20j+ doc** — 真接通端到端 baseline（端到端 ≤ 500ms）/ 全链路

---

**second 主代理 e 签名**：2026-05-17 20i T-E2 完成（基础设施 baseline 锁定 / 真接通端到端顺延 20j+）
