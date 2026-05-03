# SupplyCore 静态演示原型

这是物资供应管理系统的第一版静态演示原型，用于先确认菜单树、主页面布局、列表页和单据骨架。

## 如何打开

直接在浏览器打开：

```text
/Users/lihongjun/aizhetech/SupplyCore/prototype2/index.html
```

也可以在本目录启动一个静态服务：

```bash
python3 -m http.server 4175 --bind 127.0.0.1
```

然后访问：

```text
http://127.0.0.1:4175/
```

## 当前范围

- 综合工作台
- 基础档案：仓库管理等列表骨架
- 物料主数据：物料档案、物料申请单
- 需求计划、采购协同、合同资金
- 库存流转：采购入库单、领料出库单、库存台账
- 设备租赁
- 财务接口：NC 接口任务
- 报表预警
- 权限审批：我的待办

## 文件说明

- `UI设计说明.md`：原型设计原则、菜单结构和页面模板说明
- `index.html`：静态页面入口
- `styles/app.css`：界面样式
- `scripts/app.js`：菜单、页面切换和 mock 数据
- `favicon.svg`：浏览器页签图标
