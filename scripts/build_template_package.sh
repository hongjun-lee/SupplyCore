#!/bin/bash
# build_template_package.sh — 数据采集模板 A 包构建脚本
#
# 把 7 份 xlsx 模板 + 1 份用法说明 + 4 份对照清单打成 zip，发给阜矿原系统工程师。
# 配合 scripts/regenerate_templates.sh 使用：先重建 xlsx 当前状态，再打包发出。
#
# 用法：
#   bash scripts/build_template_package.sh                  # 实际打包
#   bash scripts/build_template_package.sh --dry-run        # 列文件清单不打包
#   bash scripts/build_template_package.sh --version V0.3   # 指定版本号（默认 V0.2.8）
#   bash scripts/build_template_package.sh --out dist       # 指定输出目录（默认 dist）
#
# 包内结构：
#   数据采集模板A包-V0.2.8/
#   ├── README.txt        本包说明 + 当前版本增强项 + V0.2.1 → V0.2.8 差异
#   ├── 模板/             7 份 xlsx
#   ├── 用法说明/         1 份 docx
#   └── 对照清单/         4 份 docx
#
# 前置：
#   - xlsx 已 bash scripts/regenerate_templates.sh 重建到当前状态
#   - docx 已 python3 scripts/convert_md_to_doc.py 转换出最新版

set -eo pipefail

cd "$(dirname "$0")/.."  # repo root

# ============ 参数解析 ============
VERSION="V0.2.8"
OUT_DIR="dist"
DRY_RUN=""
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN="1"; shift ;;
    --version) VERSION="$2"; shift 2 ;;
    --out)     OUT_DIR="$2"; shift 2 ;;
    *)
      echo "未知参数：$1" >&2
      echo "用法：bash scripts/build_template_package.sh [--dry-run] [--version Vx.x.x] [--out dir]" >&2
      exit 2
      ;;
  esac
done

DATE=$(date +%Y-%m-%d)
PKG_NAME="数据采集模板A包-${VERSION}"
ZIP_NAME="${PKG_NAME}.zip"
WORK_DIR="${OUT_DIR}/${PKG_NAME}"

# ============ 文件清单 ============
XLSX_SRC="docs/上线/word/数据采集模板-xlsx"
DOCX_SRC="docs/上线/word"

XLSX_FILES=(
  "01-组织与人员模板-V0.2.xlsx"
  "02-物资主数据模板-V0.2.xlsx"
  "03-供应商档案模板-V0.2.xlsx"
  "04-仓储基础数据模板-V0.2.xlsx"
  "05-财务与NC映射模板-V0.2.xlsx"
  "06-期初库存模板-V0.2.xlsx"
  "07-组织架构参考表-V0.2.xlsx"
)
USAGE_DOC="原系统迁移-Excel采集模板用法说明-V0.1.docx"
COMPARE_DOCS=(
  "原系统迁移-对照清单-02物资主数据-V0.1.docx"
  "原系统迁移-对照清单-03供应商档案-V0.1.docx"
  "原系统迁移-对照清单-04仓储基础-V0.1.docx"
  "原系统迁移-对照清单-06期初库存-V0.1.docx"
)

# ============ 预检 ============
echo "════════════════════════════════════════════════════════════"
echo "  数据采集模板 A 包构建"
echo "  版本：${VERSION}   日期：${DATE}   输出：${OUT_DIR}/${ZIP_NAME}"
echo "  ${DRY_RUN:+(dry-run 模式，不打包)}"
echo "════════════════════════════════════════════════════════════"
echo

missing=0
echo "▸ [1/4] 文件清单预检"
for f in "${XLSX_FILES[@]}"; do
  if [ -f "${XLSX_SRC}/${f}" ]; then
    sz=$(ls -l "${XLSX_SRC}/${f}" | awk '{print $5}')
    echo "    ✓ 模板/${f}  (${sz} bytes)"
  else
    echo "    ❌ 缺失：${XLSX_SRC}/${f}"
    missing=$((missing + 1))
  fi
done
if [ -f "${DOCX_SRC}/${USAGE_DOC}" ]; then
  sz=$(ls -l "${DOCX_SRC}/${USAGE_DOC}" | awk '{print $5}')
  echo "    ✓ 用法说明/${USAGE_DOC}  (${sz} bytes)"
else
  echo "    ❌ 缺失：${DOCX_SRC}/${USAGE_DOC}"
  missing=$((missing + 1))
fi
for f in "${COMPARE_DOCS[@]}"; do
  if [ -f "${DOCX_SRC}/${f}" ]; then
    sz=$(ls -l "${DOCX_SRC}/${f}" | awk '{print $5}')
    echo "    ✓ 对照清单/${f}  (${sz} bytes)"
  else
    echo "    ❌ 缺失：${DOCX_SRC}/${f}"
    missing=$((missing + 1))
  fi
done
echo

if [ $missing -gt 0 ]; then
  echo "❌ 共 ${missing} 个文件缺失，请补齐后重试。" >&2
  echo "  - xlsx 缺失：bash scripts/regenerate_templates.sh" >&2
  echo "  - docx 缺失：python3 scripts/convert_md_to_doc.py <对应 md>" >&2
  exit 4
fi

if [ -n "$DRY_RUN" ]; then
  total_files=$((${#XLSX_FILES[@]} + 1 + ${#COMPARE_DOCS[@]} + 1))  # +1 README
  echo "[dry-run] 预计打包 ${total_files} 个文件（含 1 个 README.txt 即时生成）→ ${OUT_DIR}/${ZIP_NAME}"
  exit 0
fi

# ============ 准备工作目录 ============
echo "▸ [2/4] 准备工作目录 ${WORK_DIR}"
rm -rf "${WORK_DIR}"
mkdir -p "${WORK_DIR}/模板" "${WORK_DIR}/用法说明" "${WORK_DIR}/对照清单"

# ============ 拷贝文件 ============
for f in "${XLSX_FILES[@]}"; do
  cp "${XLSX_SRC}/${f}" "${WORK_DIR}/模板/${f}"
done
cp "${DOCX_SRC}/${USAGE_DOC}" "${WORK_DIR}/用法说明/${USAGE_DOC}"
for f in "${COMPARE_DOCS[@]}"; do
  cp "${DOCX_SRC}/${f}" "${WORK_DIR}/对照清单/${f}"
done
echo "    ✓ 7 xlsx + 1 用法说明 + 4 对照清单 已拷贝"
echo

# ============ 生成包内 README.txt ============
echo "▸ [3/4] 生成包内 README.txt"
cat > "${WORK_DIR}/README.txt" <<EOF
═══════════════════════════════════════════════════════════════
数据采集模板 A 包  ${VERSION}
═══════════════════════════════════════════════════════════════

致：阜矿现有物资系统工程师
来自：网信办
打包日期：${DATE}

───────────────────────────────────────────────────────────────
本包包含
───────────────────────────────────────────────────────────────

  📂 模板/                7 份 Excel 数据采集模板
    01-组织与人员
    02-物资主数据（V1.8 14+1 大类 / 95 二级分类 / 25 单位）
    03-供应商档案
    04-仓储基础数据
    05-财务与NC映射
    06-期初库存
    07-组织架构参考表（只读字典，反查 org_code 用）

  📂 用法说明/            1 份 Word
    原系统迁移-Excel采集模板用法说明-V0.1.docx

  📂 对照清单/            4 份 Word（02/03/04/06 SQL 取数对照）
    （01/05/07 由 Nova 同步主导，不走原系统 SQL 迁移）

───────────────────────────────────────────────────────────────
${VERSION} 相比上次发包（V0.2.1）的关键增强 ★
───────────────────────────────────────────────────────────────

1. 【02】物料分类 sheet 已直接预填 V1.8 110 行权威基线
   ─ 15 大类（HG/ZH/SB/BP/JD/YZ/GC/JZ/TF/HX/GJ/LB/BZ/BG + PS 保留）
   ─ 95 个二级分类
   ─ 高敏感行（HG/HX/YZ01）已标黄
   ─ PS 排水材料 6 行灰底标 is_active=false（保留 / 暂停用）
   你写 SQL 时直接对照本 sheet，不需要再查规范文档。

2. 【02】计量单位 sheet 已直接预填 25 个标准单位
   ─ 长度 4（M/MM/CM/KM）+ 重量 3（KG/G/T）+ 体积 3（L/ML/M3）
   ─ 数量 15（件/个/套/台/张/块/根/卷/桶/包/盒/瓶/副/双/顶）
   ─ 含换算系数（MM=0.001M / T=1000KG 等）

3. 【02】物料主数据 sheet 的「计量单位」和「新分类编码」列
   ★ 已加 Excel 下拉数据验证（覆盖 R2:R2000）
   业务方录入时点击单元格 → 下拉箭头 → 从 25/95 个标准值中选
   不在标准范围内的会被 Excel/WPS 拒绝录入。

4. 【04/06】关键字段已加 Excel 同 sheet 数据验证（9 处）
   04/仓库: 仓库类型(5项枚举) / 启用日期(≤TODAY)
   04/库区: zone_type(5项枚举)
   04/货位: location_status(4项枚举)
   06/期初库存: 数量(>0) / 入库日期(≤TODAY) / 库存状态(4项枚举)
                填报日期(TODAY±7) / 数据来源(3项枚举)

5. 【02/04/06】必填字段加 R1 表头悬停批注（共 25 条）
   每条批注 6 行：字段英文名 / 类型(长度) / ✅ 必填 / 校验说明 / 示例值 / ❌ 常见错误
   鼠标悬停 R1 表头即可看，方便填报时即时查口径。

6. 【01-07】全部 7 份 xlsx 的「说明」首页末尾追加
   "附录：Sheet ↔ 数据表对照" 3 列表格
   方便你写 SQL 时反查目标表名（如 物料主数据 ↔ Material）。

───────────────────────────────────────────────────────────────
你能用本包做什么（见用法说明 §二）
───────────────────────────────────────────────────────────────

  用法 1（最常用）目标 schema 参考 —— 写 SQL 时对照 xlsx 表头取数
  用法 2 局部小表备选 —— 计量单位/资质等小表可直接填 xlsx 补
  用法 3（推荐）连库前烟雾测试 —— 手填 10-30 行典型样本端到端验证

───────────────────────────────────────────────────────────────
环境要求
───────────────────────────────────────────────────────────────

  推荐 Microsoft Excel 2016+ 或 WPS Office 2021+
  跨 sheet 下拉验证 + 同 sheet 数据验证 + 单元格批注
  这三类功能 Office 2010 以下版本可能显示异常。

───────────────────────────────────────────────────────────────
反馈渠道
───────────────────────────────────────────────────────────────

  填报问题 / schema 不一致 / 校验过严 等任何反馈请直接回邮件。
  我们走同一条 POST /api/supply-cores/data-import/upload-and-validate
  入 staging 验证，问题立刻闭环。

═══════════════════════════════════════════════════════════════
EOF
echo "    ✓ README.txt 已生成"
echo

# ============ 打包 zip ============
# 用 Python zipfile 模块（不用系统 zip 命令）：
# - Windows 解压时中文文件名不乱码（zipfile 默认 UTF-8 flag = bit 0x800）
# - 跨平台稳定；python3 + openpyxl 本就是工具链核心依赖
echo "▸ [4/4] 压缩 ${ZIP_NAME}"
rm -f "${OUT_DIR}/${ZIP_NAME}"
python3 - "${OUT_DIR}" "${ZIP_NAME}" "${PKG_NAME}" <<'PY'
import os, sys, zipfile
out_dir, zip_name, pkg_name = sys.argv[1], sys.argv[2], sys.argv[3]
src_root = os.path.join(out_dir, pkg_name)
zip_path = os.path.join(out_dir, zip_name)
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(src_root):
        for fname in files:
            if fname == ".DS_Store":
                continue
            full = os.path.join(root, fname)
            # arcname 用相对路径，确保 zip 内目录从 pkg_name/ 起
            arc = os.path.relpath(full, out_dir)
            zf.write(full, arcname=arc)
PY

zip_size=$(ls -l "${OUT_DIR}/${ZIP_NAME}" | awk '{print $5}')
zip_size_kb=$((zip_size / 1024))
echo "    ✓ ${OUT_DIR}/${ZIP_NAME}  (${zip_size_kb} KB)"
echo

# ============ 复检 zip 内容 ============
echo "▸ zip 内容复检"
python3 - "${OUT_DIR}/${ZIP_NAME}" <<'PY'
import sys, zipfile
zip_path = sys.argv[1]
with zipfile.ZipFile(zip_path) as zf:
    items = zf.namelist()
    print(f"    共 {len(items)} 项")
    for name in sorted(items):
        info = zf.getinfo(name)
        sz = info.file_size
        if name.endswith("/"):
            print(f"    📂 {name}")
        else:
            print(f"       {name}  ({sz} bytes)")
PY
echo

echo "════════════════════════════════════════════════════════════"
echo "  ✓ 打包完成：${OUT_DIR}/${ZIP_NAME}"
echo "  下一步：复检包内容 → 通过 IM/邮件 发给原系统工程师"
echo "════════════════════════════════════════════════════════════"
