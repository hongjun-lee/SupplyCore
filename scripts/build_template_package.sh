#!/bin/bash
# build_template_package.sh — 业务方手填包构建脚本（A 包重制 V0.3.0）
#
# 原"数据采集模板 A 包"V0.2.8 = 给原系统工程师的 7 xlsx + 用法 + 4 对照清单，
# V0.2.11 后工程师场景由 B 包一站式覆盖，A 包重制为"业务方手填包"。
#
# 受众：物资公司 + 各厂矿物资部 / 仓储 / 财务 业务方接口人
# 内容：5 份业务方真正手填的 xlsx (01/04/05/06 + 07 字典) + 1 业务方填报指引
# 用途：覆盖 SQL 抽不到的 4 个手填局部场景（详见包内填报指引）
#
# 02/03 没有放进来 — 这两类 100% 由原系统 SQL 抽，业务方主战场是 staging Web UI 调整。
#
# 用法：
#   bash scripts/build_template_package.sh                  # 实际打包
#   bash scripts/build_template_package.sh --dry-run        # 列文件清单不打包
#   bash scripts/build_template_package.sh --version V0.3.1 # 自定义版本号（默认 V0.3.0）
#   bash scripts/build_template_package.sh --out dist       # 自定义输出目录（默认 dist）
#
# 包内结构：
#   业务方手填包-V0.3.0/
#   ├── README.txt                  本包说明 + 4 手填场景速查 + 与 staging 调整的关系
#   ├── 业务方填报指引-V0.1.docx     ← 首先读这份（4 手填场景细则 + staging 边界）
#   ├── 01-组织与人员模板-V0.2.xlsx   ← 场景 1：业务联系人补充
#   ├── 04-仓储基础数据模板-V0.2.xlsx ← 场景 2：货位实地补充
#   ├── 05-财务与NC映射模板-V0.2.xlsx ← 场景 3：NC 映射全量人工对照
#   ├── 06-期初库存模板-V0.2.xlsx     ← 场景 4：物理盘点差异补录
#   └── 07-组织架构参考表-V0.2.xlsx   ← 反查字典：org_code（只读）
#
# 前置：
#   - xlsx 已 bash scripts/regenerate_templates.sh 重建到当前状态
#   - 业务方填报指引 docx 已 python3 scripts/convert_md_to_doc.py 转出最新版

set -eo pipefail

cd "$(dirname "$0")/.."  # repo root

# ============ 参数解析 ============
VERSION="V0.3.0"
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
PKG_NAME="业务方手填包-${VERSION}"
ZIP_NAME="${PKG_NAME}.zip"
WORK_DIR="${OUT_DIR}/${PKG_NAME}"

# ============ 文件清单 ============
XLSX_SRC="docs/上线/word/数据采集模板-xlsx"
DOCX_SRC="docs/上线/word"

GUIDE_DOC="业务方填报指引-V0.1.docx"
XLSX_FILES=(
  "01-组织与人员模板-V0.2.xlsx"
  "04-仓储基础数据模板-V0.2.xlsx"
  "05-财务与NC映射模板-V0.2.xlsx"
  "06-期初库存模板-V0.2.xlsx"
  "07-组织架构参考表-V0.2.xlsx"
)

# ============ 预检 ============
echo "════════════════════════════════════════════════════════════"
echo "  业务方手填包构建"
echo "  版本：${VERSION}   日期：${DATE}   输出：${OUT_DIR}/${ZIP_NAME}"
echo "  ${DRY_RUN:+(dry-run 模式，不打包)}"
echo "════════════════════════════════════════════════════════════"
echo

missing=0
echo "▸ [1/4] 文件清单预检"
if [ -f "${DOCX_SRC}/${GUIDE_DOC}" ]; then
  sz=$(ls -l "${DOCX_SRC}/${GUIDE_DOC}" | awk '{print $5}')
  echo "    ✓ ${GUIDE_DOC}  (${sz} bytes)"
else
  echo "    ❌ 缺失：${DOCX_SRC}/${GUIDE_DOC}"
  missing=$((missing + 1))
fi
for f in "${XLSX_FILES[@]}"; do
  if [ -f "${XLSX_SRC}/${f}" ]; then
    sz=$(ls -l "${XLSX_SRC}/${f}" | awk '{print $5}')
    echo "    ✓ ${f}  (${sz} bytes)"
  else
    echo "    ❌ 缺失：${XLSX_SRC}/${f}"
    missing=$((missing + 1))
  fi
done
echo

if [ $missing -gt 0 ]; then
  echo "❌ 共 ${missing} 个文件缺失，请补齐后重试。" >&2
  echo "  - xlsx 缺失：bash scripts/regenerate_templates.sh" >&2
  echo "  - docx 缺失：python3 scripts/convert_md_to_doc.py docs/上线/业务方填报指引-V0.1.md" >&2
  exit 4
fi

if [ -n "$DRY_RUN" ]; then
  total_files=$((1 + ${#XLSX_FILES[@]} + 1))  # +1 README
  echo "[dry-run] 预计打包 ${total_files} 个文件（含 1 个 README.txt 即时生成）→ ${OUT_DIR}/${ZIP_NAME}"
  exit 0
fi

# ============ 准备工作目录 ============
echo "▸ [2/4] 准备工作目录 ${WORK_DIR}"
rm -rf "${WORK_DIR}"
mkdir -p "${WORK_DIR}"

# ============ 拷贝文件 ============
cp "${DOCX_SRC}/${GUIDE_DOC}" "${WORK_DIR}/${GUIDE_DOC}"
for f in "${XLSX_FILES[@]}"; do
  cp "${XLSX_SRC}/${f}" "${WORK_DIR}/${f}"
done
echo "    ✓ 1 填报指引 + 5 xlsx 已拷贝（含 07 只读字典）"
echo

# ============ 生成包内 README.txt ============
echo "▸ [3/4] 生成包内 README.txt"
cat > "${WORK_DIR}/README.txt" <<EOF
═══════════════════════════════════════════════════════════════
业务方手填包  ${VERSION}
═══════════════════════════════════════════════════════════════

致：物资公司 + 各厂矿物资部 / 仓储 / 财务 业务方接口人
来自：网信办
打包日期：${DATE}

───────────────────────────────────────────────────────────────
本包定位：仅覆盖 SQL 抽不到的 4 个手填局部场景
───────────────────────────────────────────────────────────────

  ⚠️ 重要：xlsx 手填只占你工作的 20%，主战场是 staging Web UI 调整！

  02 物料 / 03 供应商 / 06 期初库存的主体数据由原系统工程师 SQL 抽
  → 落 SupplyCore DataImportBatch 草稿态
  → ⭐ 你在 staging Web UI 重新归类 / 改属性 / 删行 / 改单价（3-5 天）
  → 你点"确认应用" → 进正式库

  本包 5 份 xlsx 覆盖 SQL 抽不到的 4 个手填场景（详见填报指引 §二）。

───────────────────────────────────────────────────────────────
推荐阅读顺序
───────────────────────────────────────────────────────────────

  Step 1（15 min / 必读）打开 业务方填报指引-V0.1.docx
                          §一 你在上线流程中的位置
                          §二 4 个手填场景（每个场景填谁 / 填啥 / 回收方式）
                          §三 staging 调整窗口（你的主战场）

  Step 2（按需）找到你这次负责的手填场景，打开对应 xlsx：
    场景 1：01-组织与人员模板    各厂矿物资部补"业务联系人"字段
    场景 2：04-仓储基础数据      仓储 + 物资公司补"货位"实地数据
    场景 3：05-财务与NC映射      财务 + 物资 + cici 全量纯人工对照（4 sheet）
    场景 4：06-期初库存          物理盘点差异补录（小量在 Web UI / 大量本 xlsx）

  Step 3（填表前必看）打开 07-组织架构参考表-V0.2.xlsx 的"组织架构"sheet
                       反查你的单位 OrgCode（5 位编码 / 如 001.007.002 = 恒大煤矿）

───────────────────────────────────────────────────────────────
本包包含
───────────────────────────────────────────────────────────────

  📄 业务方填报指引-V0.1.docx       ← 首先读这份

  📊 5 份 xlsx（4 手填 + 1 字典）
    01-组织与人员模板-V0.2.xlsx       场景 1：业务联系人补充
    04-仓储基础数据模板-V0.2.xlsx     场景 2：货位实地补充
                                       （xlsx 已加 4 处下拉验证）
    05-财务与NC映射模板-V0.2.xlsx     场景 3：NC 映射全量人工对照
                                       4 个 sheet 全部需填（第 5 个 sheet 仅参考）
    06-期初库存模板-V0.2.xlsx         场景 4：物理盘点差异补录
                                       （xlsx 已加 5 处下拉/校验：数量>0 / 日期≤TODAY / 状态枚举等）
    07-组织架构参考表-V0.2.xlsx       反查字典（只读 / 反查 org_code 用）

───────────────────────────────────────────────────────────────
本包不含哪些（这些不需要你手填）
───────────────────────────────────────────────────────────────

  ❌ 02 物资主数据模板   → 原系统工程师 SQL 抽全量，你在 staging Web UI 调整分类/属性
  ❌ 03 供应商档案模板   → 原系统工程师 SQL 抽全量，你在 staging Web UI 调整准入状态
  ❌ 4 份对照清单 docx   → 那是给原系统工程师写 SQL 用的（在迁移方案 B 包里）
  ❌ 迁移方案 / 编码规范 → 那是给原系统工程师的指导（在迁移方案 B 包里）

  如需了解整体上线协作流程，参考 原系统迁移方案-V0.1.docx §八-A
  （由 cici 牵头的全员宣讲会会讲到，这里不重复）

───────────────────────────────────────────────────────────────
xlsx 已加的易用性增强（V0.2.8 状态）
───────────────────────────────────────────────────────────────

  - 02 物料分类已预填 V1.8 110 行基线 + 25 标准计量单位
    （02 不在本包但在 staging Web UI 看得到，分类下拉已就绪）
  - 04 仓库类型 / 库区类型 / 货位状态 下拉验证
  - 06 数量>0 / 入库日期≤TODAY / 库存状态/数据来源下拉
  - 02/04/06 共 25 条 R1 表头悬停批注（字段英文名/类型/校验/示例/常见错误）
  - 每份 xlsx 首页"说明" sheet 末尾"Sheet ↔ 数据表对照"附录

───────────────────────────────────────────────────────────────
环境要求
───────────────────────────────────────────────────────────────

  推荐 Microsoft Excel 2016+ 或 WPS Office 2021+
  跨 sheet 下拉验证 + 同 sheet 数据验证 + 单元格批注
  这三类功能 Office 2010 以下版本可能显示异常。

───────────────────────────────────────────────────────────────
反馈渠道
───────────────────────────────────────────────────────────────

  xlsx 字段不清楚 / 校验过严 / 示例不够     → 邮件给项目组（1 个工作日内回）
  原系统抽的数据有错（漏抽/错抽/类型乱）    → 记《数据问题台账》触发 staging 重抽
  staging Web UI 操作问题 / 批量功能需求    → 反馈给 cici 进 Sprint 评估
  物理盘点新发现物料（原系统没有）          → 06 期初库存补行 + 反馈给项目组发 02 物料新增请求

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
echo "  下一步：发给物资公司 + 各厂矿物资部接口人"
echo "         B 包 (原系统迁移方案) 已并行发给原系统工程师"
echo "════════════════════════════════════════════════════════════"
