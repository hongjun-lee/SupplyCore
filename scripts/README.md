# scripts/ — SupplyCore 文档与模板工具脚本

本目录维护两套独立的工具链：

1. **xlsx 数据采集模板** 工具链（4 个 Python 脚本 + 1 个一键 shell）
2. **docx 文档转换** 工具链（2 个 Python 脚本 + 1 个环境配置 shell）

> **核心原则**：所有"会反复执行"的 xlsx 操作都必须沉淀成脚本，**禁止再走"一次性 inline heredoc"老路**——历史上吃过这个亏（V0.2.1 ②④ 虚假完成、V0.2.5 `formula1=` bug），都是因为没脚本化、没复检。

---

## 一、xlsx 工具链（docs/上线/word/数据采集模板-xlsx/）

### 1.1 Quick Start — 一键重建 01-06 模板当前状态

```bash
bash scripts/regenerate_templates.sh
```

按推荐顺序跑 4 个脚本，最终状态 = 当前 git working copy 的 xlsx 状态。
全部脚本均**幂等**（反复跑结果一致），跑前**请关闭 Excel/WPS** 中任何打开的模板。

### 1.2 脚本职责矩阵

| # | 脚本 | 影响范围 | 写入内容 | 何时手工跑 |
|---|---|---|---|---|
| 1 | `fill_material_template.py` | 02 物料分类 + 计量单位 + 物料主数据 | 110 行 V1.8 分类 + 25 个标准单位 + 2 条跨 sheet 下拉 DV | V1.8 基线调整 / PS 解封 / 新增单位 |
| 2 | `add_template_appendix.py` | 01-06 说明 sheet | 末尾追加"Sheet ↔ 数据表对照"附录（每份 2-6 行） | 模板新增 sheet 或表名调整 |
| 3 | `add_header_comments.py` | 02/04/06 数据 sheet 的 R1 表头 | 25 条 6 行批注（字段英文名/类型/✅/校验/示例/❌常见错误） | 字段口径 / 校验 / 示例值变更 |
| 4 | `add_validations.py` | 04/06 数据 sheet | 9 条同 sheet 数据验证（list/date/decimal） | 枚举范围变更 / 添加新约束 |

每个脚本均支持：
- `--dry-run`：不写盘，只打印计划
- `--only <文件名>`：单文件处理（add_template_appendix/add_header_comments/add_validations）
- 锁文件检测：发现 `.~xxx.xlsx` 时跳过该文件并报告，等用户关闭客户端

### 1.3 执行顺序与依赖关系

```
┌─────────────────────────────┐
│ fill_material_template.py   │  ① 必须最先：02 数据基线
│ 写入 02 物料分类/计量单位   │
└──────────────┬──────────────┘
               │ (02 的 110 行/25 单位被消费)
       ┌───────┴───────┐
       │               │
       ↓               ↓
┌─────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ appendix.py │ │ header_comments │ │ validations.py  │
│ 说明 sheet  │ │ R1 批注         │ │ 同 sheet DV     │
│ 01-06       │ │ 02/04/06        │ │ 04/06           │
└─────────────┘ └─────────────────┘ └─────────────────┘
        ② / ③ / ④ 彼此独立，顺序无关，反复跑幂等
```

**为什么 ①必须最先**：`fill_material_template.py` 会清空 02 的物料分类/计量单位 sheet 重写；如果 ① 之后已经有 ②③④ 的产物（说明 sheet 附录、表头批注、DV），① 不会破坏它们（实测幂等）。但反过来如果 ① 跑得太晚，②③④ 引用的数据基线就是过期的。

**安全保证**：所有脚本都在自己的 scope 内只动该动的东西，不误伤其他人产物。

### 1.4 CRITICAL — 添加新 DataValidation 时必读

**openpyxl 的 `DataValidation.formula1` 不能带前导 `=`**——这是 V0.2.5 用半天踩出来的坑，未来加新 DV 必看：

```python
# ❌ 错误：带 = 前缀，Excel/WPS 静默丢弃 DV 甚至触发"自动修复"回退数据
DataValidation(type="list", formula1="=计量单位!$A$2:$A$26")
DataValidation(type="date", formula1="=TODAY()")

# ✓ 正确
DataValidation(type="list", formula1="计量单位!$A$2:$A$26")        # 跨 sheet 引用
DataValidation(type="list", formula1='"主仓,临时仓,工地仓"')        # 同 sheet enum，带双引号包裹
DataValidation(type="date", formula1="TODAY()")                    # 日期函数
DataValidation(type="decimal", formula1="0", operator="greaterThan") # 数值范围
```

**仅靠 openpyxl 读回不能验证**——openpyxl 自身能读非法格式 xml，必须用 unzip 看真实写入的 xml：

```bash
unzip -p docs/上线/word/数据采集模板-xlsx/02-物资主数据模板-V0.2.xlsx \
  xl/worksheets/sheet4.xml | rg formula1
# 期望输出：<formula1>计量单位!$A$2:$A$26</formula1>（无 = 前缀）
```

### 1.5 验证清单（跑完任一脚本后）

```bash
python3 - << 'PY'
from openpyxl import load_workbook
expected = {
    "02-物资主数据模板-V0.2.xlsx": {
        "物料分类":   (4, 0, 111),   # (批注数, DV 数, max_row)
        "物料主数据": (5, 2, 4),
        "计量单位":   (3, 0, 26),
    },
    "04-仓储基础数据模板-V0.2.xlsx": {
        "仓库": (6, 2, None),
        "库区": (0, 1, None),
        "货位": (0, 1, None),
    },
    "06-期初库存模板-V0.2.xlsx": {
        "期初库存": (7, 5, None),
    },
}
for fname, sheets in expected.items():
    wb = load_workbook(f"docs/上线/word/数据采集模板-xlsx/{fname}")
    for sn, (exp_c, exp_d, exp_r) in sheets.items():
        ws = wb[sn]
        c = sum(1 for cc in range(1, ws.max_column+1) if ws.cell(1,cc).comment)
        d = len(ws.data_validations.dataValidation)
        ok = "✓" if (c == exp_c and d == exp_d and (exp_r is None or ws.max_row == exp_r)) else "❌"
        print(f"  {ok} {fname[:2]}/{sn}: 批注 {c}/{exp_c}, DV {d}/{exp_d}, max_row {ws.max_row}/{exp_r}")
    wb.close()
PY
```

### 1.6 打包发外（A 包）

需要把模板发给阜矿原系统工程师时，跑：

```bash
bash scripts/build_template_package.sh                  # 实际打包到 dist/
bash scripts/build_template_package.sh --dry-run        # 只列文件清单不打包
bash scripts/build_template_package.sh --version V0.3   # 自定义版本号
```

包内结构（**用 Python zipfile 模块强制 UTF-8 文件名**，Windows 解压不乱码）：

```
dist/数据采集模板A包-V0.2.8.zip
└── 数据采集模板A包-V0.2.8/
    ├── README.txt          自动生成；含当前版本相比上次发包的关键增强项
    ├── 模板/                7 份 xlsx（01-07）
    ├── 用法说明/            1 份 docx（V0.1）
    └── 对照清单/            4 份 docx（02/03/04/06）
```

发包前检查：
- xlsx 已 `bash scripts/regenerate_templates.sh` 重建到当前状态
- docx 已 `python3 scripts/convert_md_to_doc.py` 转换到最新
- `dist/` 在 `.gitignore` 里（不入 git，只作为本地构建产物）

### 1.7 打包发外（B 包：原系统迁移方案）

A 包是"工具"，B 包是"指导"——两者必须**配套发出**，原系统工程师才能写得出 SQL。

```bash
bash scripts/build_migration_package.sh                  # 实际打包到 dist/
bash scripts/build_migration_package.sh --dry-run        # 只列文件清单不打包
bash scripts/build_migration_package.sh --version V0.3   # 自定义版本号
```

包内结构（B-core 7 文件 / 用 Python zipfile 模块强制 UTF-8 文件名）：

```
dist/原系统迁移方案B包-V0.2.8.zip
└── 原系统迁移方案B包-V0.2.8/
    ├── README.txt                自动生成；含与 A 包关系 + 推荐阅读路径
    ├── 01-主方案/                 必读：原系统迁移方案-V0.1.docx
    ├── 02-物料分类规范/           写 02 SQL 前必读：基线 + 映射指南
    └── 03-对照清单/               4 份 SQL 字段对照（02/03/04/06）
```

**A vs B 边界**（也写在 B 包 README.txt 里给收件方看）：

| 包 | 定位 | 主体 | 工作流位置 |
|---|---|---|---|
| A 包 | 工具 | 7 xlsx + 用法 + 对照清单副本 | 写 SQL 时对照表头 / 局部小表手填 / 烟雾测试 |
| B 包 | 指导 | 迁移方案 + 编码规范 + 对照清单 | **先读 B 包搞清方案**，再用 A 包对照表头 |

> 对照清单 ×4 两包都带一份——B 包独立自洽，收件方解压一个包不用对照另一个包。

### 1.8 何时**不**用脚本（合理保留手工/inline）

| 操作 | 实现方式 | 为何不脚本化 |
|---|---|---|
| 5 份 xlsx 的 sheet 重命名（Material→物料主数据 等） | inline python（已完成 V0.2.1） | 一次性操作，sheet 名定型不再改 |
| 04 仓库 sheet 加成 13 列完整字段示范 | inline python（已完成 V0.2.1） | 一次性 demo |
| 07 组织架构 xlsx（996 行真实数据） | subagent 从 SupplyCores PostgreSQL 抽数 | 由 Nova 自动同步主导，不在文档侧维护循环 |
| 新模板从零搭表头骨架 | 直接 Excel/WPS 手工创建 | 比脚本快且符合"先看 md 字段再定表头"的人工节奏 |

---

## 二、docx 工具链（招标 / 详设文档转换）

| 脚本 | 用途 |
|---|---|
| `convert_md_to_doc.py` | md → docx，含 Mermaid 图渲染（默认调用 apply_docx_style） |
| `apply_docx_style.py` | 统一字体（仿宋_GB2312 小三）/ 标题加粗 / 表格边框 |
| `install_mermaid_cli.sh` | 安装 Mermaid CLI（首次环境配置） |

```bash
# 单文件转换
python3 scripts/convert_md_to_doc.py path/to/file.md

# 跳过样式应用
python3 scripts/convert_md_to_doc.py path/to/file.md --no-style

# 批量转换
find docs/招标 -name "*.md" -exec python3 scripts/convert_md_to_doc.py {} \;
```

---

## 三、维护原则

1. **新增能力** = 在合适的脚本里加 dict 项；**禁止**走"一次性 inline heredoc"老路
2. **修改后必须** 走完五步验证：`dry-run → 实际跑 → openpyxl 读回 → unzip xml 验证 → Excel/WPS 实际打开看`
3. **新增 DV** 务必先读 §1.4 CRITICAL 警告
4. **每次变更** 加 V0.2.x 行到 [`docs/上线/数据采集模板/00-数据采集总览-V0.2.md`](../docs/上线/数据采集模板/00-数据采集总览-V0.2.md) §九版本沿革（正序排列）

## 四、关键演进里程碑（详见 00 总览 §九）

| 版本 | 内容 | 教训价值 |
|---|---|---|
| V0.2.1 | 6 份 xlsx 中文化/附录/批注（**②④ 实际未完成**，仅 07 生效） | "inline heredoc + 未复检 = 虚假完成"的反面教材 |
| V0.2.3 | 02 V1.8 基线 + 跨 sheet 下拉首次落地（fill_material_template.py） | xlsx 工具脚本化起点 |
| **V0.2.5** | **formula1 不带 `=` 的关键 bug 修复** | **必读教训**（§1.4） |
| V0.2.4 / V0.2.6 / V0.2.7 | 附录 / 批注 / DV 分别脚本化补齐 | 全量脚本化完成 |
| V0.2.8 | 本 README + regenerate_templates.sh 一键脚本 | 知识沉淀完成 |
| V0.2.9 | build_template_package.sh 一键打 A 包发外（含包内 README + 中文文件名 UTF-8） | 发包流程脚本化 |
| V0.2.10 | build_migration_package.sh 一键打 B 包发外（迁移方案 + 物料分类规范 + 4 对照清单） | A/B 双包配套，工程师有指导也有工具 |

---

**Maintained**: main 主代理 a
**Last updated**: 2026-05-20 / V0.2.10
