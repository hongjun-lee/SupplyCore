#!/bin/bash
# build_migration_package.sh — 原系统迁移方案 B 包构建脚本
#
# 把迁移方案主文档 + 物料分类规范 + 4 份对照清单打成 zip，
# 与 A 包（数据采集模板）配套发给阜矿原系统工程师 + 物资公司。
#
# 用法：
#   bash scripts/build_migration_package.sh                  # 实际打包
#   bash scripts/build_migration_package.sh --dry-run        # 列文件清单不打包
#   bash scripts/build_migration_package.sh --version V0.3   # 指定版本号（默认 V0.2.8）
#   bash scripts/build_migration_package.sh --out dist       # 指定输出目录（默认 dist）
#
# 包内结构（B-core）：
#   原系统迁移方案B包-V0.2.8/
#   ├── README.txt              本包说明 + 阅读顺序 + 与 A 包关系
#   ├── 01-主方案/              迁移方案主文档（必读）
#   │   └── 原系统迁移方案-V0.1.docx
#   ├── 02-物料分类规范/        02 物料相关（写 02 SQL 前必读）
#   │   ├── 物料分类基线-V0.1.docx
#   │   └── 物料分类映射指南-V0.1.docx
#   └── 03-对照清单/            4 份 SQL 字段对照清单
#       ├── 原系统迁移-对照清单-02物资主数据-V0.1.docx
#       ├── 原系统迁移-对照清单-03供应商档案-V0.1.docx
#       ├── 原系统迁移-对照清单-04仓储基础-V0.1.docx
#       └── 原系统迁移-对照清单-06期初库存-V0.1.docx
#
# 前置：
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
      echo "用法：bash scripts/build_migration_package.sh [--dry-run] [--version Vx.x.x] [--out dir]" >&2
      exit 2
      ;;
  esac
done

DATE=$(date +%Y-%m-%d)
PKG_NAME="原系统迁移方案B包-${VERSION}"
ZIP_NAME="${PKG_NAME}.zip"
WORK_DIR="${OUT_DIR}/${PKG_NAME}"

# ============ 文件清单 ============
DOCX_SRC="docs/上线/word"

MAIN_DOC="原系统迁移方案-V0.1.docx"
CATEGORY_DOCS=(
  "物料分类基线-V0.1.docx"
  "物料分类映射指南-V0.1.docx"
)
COMPARE_DOCS=(
  "原系统迁移-对照清单-02物资主数据-V0.1.docx"
  "原系统迁移-对照清单-03供应商档案-V0.1.docx"
  "原系统迁移-对照清单-04仓储基础-V0.1.docx"
  "原系统迁移-对照清单-06期初库存-V0.1.docx"
)

# ============ 预检 ============
echo "════════════════════════════════════════════════════════════"
echo "  原系统迁移方案 B 包构建"
echo "  版本：${VERSION}   日期：${DATE}   输出：${OUT_DIR}/${ZIP_NAME}"
echo "  ${DRY_RUN:+(dry-run 模式，不打包)}"
echo "════════════════════════════════════════════════════════════"
echo

missing=0
echo "▸ [1/4] 文件清单预检"
if [ -f "${DOCX_SRC}/${MAIN_DOC}" ]; then
  sz=$(ls -l "${DOCX_SRC}/${MAIN_DOC}" | awk '{print $5}')
  echo "    ✓ 01-主方案/${MAIN_DOC}  (${sz} bytes)"
else
  echo "    ❌ 缺失：${DOCX_SRC}/${MAIN_DOC}"
  missing=$((missing + 1))
fi
for f in "${CATEGORY_DOCS[@]}"; do
  if [ -f "${DOCX_SRC}/${f}" ]; then
    sz=$(ls -l "${DOCX_SRC}/${f}" | awk '{print $5}')
    echo "    ✓ 02-物料分类规范/${f}  (${sz} bytes)"
  else
    echo "    ❌ 缺失：${DOCX_SRC}/${f}"
    missing=$((missing + 1))
  fi
done
for f in "${COMPARE_DOCS[@]}"; do
  if [ -f "${DOCX_SRC}/${f}" ]; then
    sz=$(ls -l "${DOCX_SRC}/${f}" | awk '{print $5}')
    echo "    ✓ 03-对照清单/${f}  (${sz} bytes)"
  else
    echo "    ❌ 缺失：${DOCX_SRC}/${f}"
    missing=$((missing + 1))
  fi
done
echo

if [ $missing -gt 0 ]; then
  echo "❌ 共 ${missing} 个文件缺失，请补齐后重试。" >&2
  echo "  - docx 缺失：python3 scripts/convert_md_to_doc.py <对应 md>" >&2
  exit 4
fi

if [ -n "$DRY_RUN" ]; then
  total_files=$((1 + ${#CATEGORY_DOCS[@]} + ${#COMPARE_DOCS[@]} + 1))  # +1 README
  echo "[dry-run] 预计打包 ${total_files} 个文件（含 1 个 README.txt 即时生成）→ ${OUT_DIR}/${ZIP_NAME}"
  exit 0
fi

# ============ 准备工作目录 ============
echo "▸ [2/4] 准备工作目录 ${WORK_DIR}"
rm -rf "${WORK_DIR}"
mkdir -p "${WORK_DIR}/01-主方案" "${WORK_DIR}/02-物料分类规范" "${WORK_DIR}/03-对照清单"

# ============ 拷贝文件 ============
cp "${DOCX_SRC}/${MAIN_DOC}" "${WORK_DIR}/01-主方案/${MAIN_DOC}"
for f in "${CATEGORY_DOCS[@]}"; do
  cp "${DOCX_SRC}/${f}" "${WORK_DIR}/02-物料分类规范/${f}"
done
for f in "${COMPARE_DOCS[@]}"; do
  cp "${DOCX_SRC}/${f}" "${WORK_DIR}/03-对照清单/${f}"
done
echo "    ✓ 1 主方案 + 2 物料分类规范 + 4 对照清单 已拷贝"
echo

# ============ 生成包内 README.txt ============
echo "▸ [3/4] 生成包内 README.txt"
cat > "${WORK_DIR}/README.txt" <<EOF
═══════════════════════════════════════════════════════════════
原系统迁移方案 B 包  ${VERSION}
═══════════════════════════════════════════════════════════════

致：阜矿现有物资系统工程师 + 物资公司
来自：网信办
打包日期：${DATE}

───────────────────────────────────────────────────────────────
本包定位（B 包） vs 数据采集模板 A 包
───────────────────────────────────────────────────────────────

  A 包（数据采集模板A包-${VERSION}.zip）= 工具
    7 份 xlsx 模板 + 用法说明 + 对照清单副本
    用途：作为新表 schema 参考 / 局部小表手填 / 烟雾测试样本

  B 包（本包）= 指导
    迁移方案主文档 + 物料分类规范 + 对照清单
    用途：指导你如何从原系统抽数 / 编码规则 / SQL 写作

  → 实际工作流：先读 B 包搞清方案，再用 A 包的 xlsx 对照表头写 SQL。

───────────────────────────────────────────────────────────────
本包包含（按阅读顺序编号）
───────────────────────────────────────────────────────────────

  📂 01-主方案/                  必读 ⭐⭐⭐
    原系统迁移方案-V0.1.docx
    包含：
      §一 背景与 Spencer 3 项决策
      §二 6 类模板迁移覆盖判断
      §三 协作模式（你产 SQL → 我们跑 → DataImportBatch 入库）
      §四 范围过滤（全集团 / OrgCode LIKE '001.007.%'）
      §五 字段映射表（02 物资主数据内部参考）
      §六 双轨编码方案（material_code + legacy_code）
      §七 SQL 抽取模板参考样例
      §八 验证机制（DataIssueLog / 抽样核查 / 双向核对）
      §八-A 业务方数据调整确认环节（关键 / staging 调整）
      §八-A.8 物料分类编码前置确认（关键工作流）
      §九 风险与回退 / §十 时序计划

  📂 02-物料分类规范/             写 02 SQL 前必读 ⭐⭐⭐
    物料分类基线-V0.1.docx           ← 物资分类树（V1.8 14+1 大类 / 95 二级）
    物料分类映射指南-V0.1.docx       ← 原系统物料如何映射到新分类

    重要：物料分类是 PK 级引用，必须先确认分类基线（物资公司锁定）
    再迁物料数据。你按物资公司锁定后的基线做"原 → 新"映射回填。

  📂 03-对照清单/                 写 SQL 时对照取数 ⭐⭐⭐
    原系统迁移-对照清单-02物资主数据-V0.1.docx
    原系统迁移-对照清单-03供应商档案-V0.1.docx
    原系统迁移-对照清单-04仓储基础-V0.1.docx
    原系统迁移-对照清单-06期初库存-V0.1.docx

    每份清单包含：
      - 新表英文字段名（SELECT 别名直接用）
      - 中文名 / 用途 / 是否必填 / 长度类型
      - 备注（特殊业务约束 / 样例值）
    SQL 字段别名 = 新表英文字段名 → 我们接收后零再加工。

  注：01-组织人员 / 05-NC映射 由 Nova 同步主导，不走原系统 SQL 迁移。
      07-组织架构参考表 在 A 包提供（只读字典）。

───────────────────────────────────────────────────────────────
推荐阅读路径（首次拿到本包）
───────────────────────────────────────────────────────────────

  Step 1（30 min）通读 01-主方案/原系统迁移方案-V0.1.docx
                   重点：§三 协作模式、§六 双轨编码、§七 SQL 模板

  Step 2（15 min）跳读 02-物料分类规范/
                   重点：14+1 大类编码 / 你原系统的物料如何对到新分类

  Step 3（按需）  挑你最熟的表，打开 03-对照清单/ 对应那份
                  对照 A 包同名 xlsx 表头 → 写 SELECT SQL

  Step 4（首发）  02 物资主数据 SQL 可先把字段抽出来
                  分类映射等物资公司锁定基线后再回填

───────────────────────────────────────────────────────────────
交付物你给我们什么（见主方案 §三）
───────────────────────────────────────────────────────────────

  主交付：可重复执行的 SELECT SQL 脚本（推荐 / 利于增量同步 / 审计留痕）
  备选：  CSV / Excel 一次性快照（不熟 SQL 时降级使用）

  我们会用 read-only 账号跑你的 SQL，结果集自动进 DataImportBatch 草稿态，
  校验失败的行落 DataIssueLog，业务方在 staging 调整后再 confirm 应用。

───────────────────────────────────────────────────────────────
反馈渠道
───────────────────────────────────────────────────────────────

  SQL 写作 / schema 不一致 / 字段语义不明 等任何反馈请直接回邮件。
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
echo "  下一步：与 A 包配套发给原系统工程师 + 物资公司"
echo "════════════════════════════════════════════════════════════"
