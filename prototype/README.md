# SupplyCore 原型 v0.5

> **用途仅限演示与沟通** — 与管理层、业务部门、招标参与方对齐功能与流程。
> **非真实数据，亦非开发或验收依据。** 权威口径请以 `docs/详细设计/*` 为准。

## 一、如何打开

直接双击任一 HTML 文件，或在浏览器中打开：

- 入口：`prototype/index.html`（工作台）
- 大屏：`prototype/dashboard-bigscreen.html`（适合 1920×1080 投屏）
- AI 助理：`prototype/ai-assistant.html`（可输入互动）/ `ai-write-flow.html`（写操作完整链路演示）
- 移动演示：`prototype/mobile-stocktake.html`（手持端 PDA 扫码盘点）
- 信创矩阵：`prototype/xinchuang-matrix.html`（招标响应与选型决策）
- 无需任何构建步骤、无需联网；样式与脚本均为本地文件
- 兼容 Chrome / Edge / Safari 现代版本

## 二、本版覆盖范围（v0.5 = v0.4 + 4 页）

### 业务流转 — 11 页

需求计划列表 / 详情 · 采购订单 · 到货验收 · **质检** · 库存查询 · 盘点 · **移动端盘点** ★v0.5 · 废旧处置 · 设备租赁 · 设备生命周期 · **设备维修工单** ★v0.5

### 采购协同 — 1 页

招投标

### 合同与资金 — 4 页

合同管理 · 合同详情 · 付款申请 · 资金计划月度

### 基础数据 — 2 页

物料主数据（7 状态机）· 基础档案（组织/仓库/供应商）

### 决策 / AI — 5 页

报表中心 · 报表穿透 · AI 助理（互动）· **AI 写操作完整链路** ★v0.5 · 大屏看板（暗色投屏）

### 运维 / 集成 — 3 页

NC 接口监控 · 系统管理 · **信创兼容性矩阵** ★v0.5

### 工作 — 2 页

工作台 · 审批中心

### v0.5 新页面要点

#### 1. `maintenance-order.html` — 设备维修工单（E-04）
- 5 单工单列表 + 完整一单详情（掘进机 EBZ200 故障维修）
- 6 节点流转条：故障报修 → 调度派工 → 到达现场 → 检修执行 → 试运行验证 → 验收关单
- 故障描述 + 现场诊断分色卡片（红色故障 / 蓝色诊断）
- **备件领用子表**：联动 S-22 领料申请 + 物料编码 + 出库状态
- **关单后自动回写**：设备生命周期 / 维修历史 / 库存事务流水 / NC-MD-005 保修索赔 / OEE 指标
- 现场照片附件区

#### 2. `mobile-stocktake.html` — 移动端扫码盘点
- **360×720 手机外框预览**（含状态栏、应用栏、扫码区动画）
- 扫码动画区（青绿色扫描线沿框上下移动）
- 当前区域 + 盘点进度条（836/1284 = 65%）
- 待盘下一项卡片 + 最近已盘列表（含盘亏标红）
- 右侧：交互说明（扫码方式 / 离线缓存 / 挂起续盘 / 权限）+ 后端联动 timeline + 硬件建议（Honeywell EDA52 / Urovo i6310）

#### 3. `ai-write-flow.html` — AI 写操作完整链路
- 完整 6 轮对话演示：用户提需求 → AI 收集字段 → 用户口语化补充 → AI 字段识别 → 用户确认 → AI 生成草稿
- **关键边界明示**（红色徽章）：AI 不会代替用户提交单据
- 右侧"待提交需求草稿"虚线大框（蓝色 dashed border 醒目区分）
- **3 个底部按钮**：取消 / 编辑后提交 / **✓ 我已确认 · 提交**（点击有提示）
- 7 条 AI 写操作能力边界：3 项允许（绿）+ 3 项禁止（红）+ 1 项审计（蓝）
- 提交后审计与审批路径垂直 timeline（含 source = AI_ASSISTED 标注）

#### 4. `xinchuang-matrix.html` — 信创兼容性矩阵
- 4 张测试覆盖统计卡（已测 / 通过 / 部分通过 / 阻塞）
- **6 大兼容层矩阵**（操作系统 / 数据库 / 中间件 / 浏览器 / 办公软件 / CPU 架构）
- 每层内多个产品 × 4 个目标 OS（麒麟 / 统信 / Windows 过渡 / 欧拉）的支持网格（绿✓ / 灰— / 黄~）
- 每行含厂商 + 备注（推荐 / 内核 / 联调要求等）
- 4 条关键说明：推荐组合 / 过渡兼容 / 注意事项
- **招标技术响应承诺**卡：最低支持范围 / 双架构 / 过渡期 / 联调责任

## 三、暂未覆盖（v0.6 候选）

- **设备 OEE 指标看板**：单设备运行率 / 性能率 / 良品率 + 故障频次趋势
- **供应商履约画像**：历史交付准时率 / 验收一次合格率 / 黑名单原因记录
- **招投标过程归档**：开标视频 / 评标录音 / 评委签字表归档查询
- **报表订阅与定时推送**：管理层每日 / 周报订阅 + 推送渠道（邮件 / 钉钉 / 短信）
- **真实后端 / 升 C 档**：平移到 `../SupplyCores/modules/nova.supplycores/frontend` 的 Vite/React 工程

## 四、文件结构（29 个 HTML + 3 个资产）

```
prototype/
├── README.md
├── index.html                     工作台
├── approval-center.html           审批中心
│
├── requirement-list.html / requirement-detail.html
├── purchase-orders.html / goods-receipt.html / quality-check.html
├── inventory.html / stocktake.html / mobile-stocktake.html ★v0.5
├── scrap-disposal.html
├── equipment-rent.html / equipment-lifecycle.html
├── maintenance-order.html         ★ v0.5
│
├── tender.html
│
├── contract-list.html / contract-detail.html
├── payment-request.html / funding-plan.html
│
├── material-master.html / base-archive.html
│
├── reports.html / report-detail.html
├── ai-assistant.html / ai-write-flow.html ★v0.5
├── dashboard-bigscreen.html
│
├── nc-interface.html / system-admin.html
├── xinchuang-matrix.html          ★ v0.5
│
└── assets/
    ├── styles.css                 含响应式 + 大屏暗色 + 手机外框 + 扫码动画 + 信创矩阵 + AI 草稿面板
    ├── chrome.js                  头/侧栏/角色切换/移动端 drawer
    └── data.js                    Mock 数据
```

## 五、设计与口径约定

- **业务系统视觉**：克制的"国企信息系统"风格 — 深色侧栏 + 白色主区 + 蓝色主色 + 中性灰
- **大屏视觉**：暗色 + 青蓝渐变 + 数据感发光 + 实时脉冲指示器
- **移动端视觉**：手机外框 + 扫码动画 + 大字号 + 单手友好布局
- **AI 助理**：与业务系统同视觉语言；写操作场景**虚线大框 + 蓝色边界**强调"待用户确认"
- **状态色**：绿 / 蓝 / 黄 / 红 / 灰 五色一致
- **字段命名**与详设状态字段保持一致

## 六、变更日志

- **v0.5 (2026-05-03)** — 新增 4 页：设备维修工单（E-04 + 备件领用 + 关单回写）、移动端扫码盘点（360×720 手机外框 + 扫码动画 + 后端联动）、AI 写操作完整链路（6 轮对话 + 草稿确认 + 7 条边界 + 审计标注）、信创兼容性矩阵（6 层 × 4 目标 OS + 招标响应承诺）。新增组件：matrix（信创矩阵网格）/ phone-frame（手机外框）/ scan-zone（扫码动画）/ ai-draft-panel（AI 草稿确认）/ rule-list（允许/禁止/审计）。共 29 页。
- **v0.4 (2026-05-03)** — 新增 4 页：设备生命周期 / 招投标 / AI 助理独立 / 大屏看板。共 25 页。
- **v0.3 (2026-05-03)** — 新增 4 页：质检 / 付款申请 / 资金计划 / 报表穿透 + 响应式适配。共 21 页。
- **v0.2 (2026-05-03)** — 新增 8 页。共 17 页。
- **v0.1 (2026-05-03)** — 首版 9 页。
