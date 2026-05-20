#!/bin/bash
# regenerate_templates.sh — 一键重建 01-06 数据采集模板的当前状态
#
# 按推荐顺序执行 4 个 xlsx 工具脚本，最终结果等价于 git working copy。
# 全部脚本均幂等，可反复跑。
#
# 用法：
#   bash scripts/regenerate_templates.sh
#   bash scripts/regenerate_templates.sh --dry-run    # 不写盘，只打印计划
#
# 前置：
#   - 关闭 Excel/WPS 中任何打开的 docs/上线/word/数据采集模板-xlsx/*.xlsx
#   - 已 pip install openpyxl
#
# 修改记录见 docs/上线/数据采集模板/00-数据采集总览-V0.2.md §九 V0.2.8

set -eo pipefail

# 切到仓库根（脚本位于 scripts/ 下，向上一级）
cd "$(dirname "$0")/.."

# 解析参数：仅支持 --dry-run
DRY_RUN=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN="--dry-run" ;;
    *)
      echo "未知参数：$arg" >&2
      echo "用法：bash scripts/regenerate_templates.sh [--dry-run]" >&2
      exit 2
      ;;
  esac
done

# 锁文件预检（dry-run 时跳过，因为脚本本身在 dry-run 也容错）
if [ -z "$DRY_RUN" ]; then
  lock_files=$(ls docs/上线/word/数据采集模板-xlsx/.~* 2>/dev/null || true)
  if [ -n "$lock_files" ]; then
    echo "❌ 检测到 Excel/WPS 锁文件，请先关闭对应客户端再重跑："
    echo "$lock_files"
    exit 3
  fi
fi

echo "════════════════════════════════════════════════════════════"
echo "  SupplyCore 数据采集模板一键重建  ${DRY_RUN:+(dry-run 模式)}"
echo "  目标：docs/上线/word/数据采集模板-xlsx/"
echo "════════════════════════════════════════════════════════════"
echo

echo "▸ [1/4] fill_material_template.py"
echo "    → 02 V1.8 基线（110 行分类 + 25 单位 + 2 条跨 sheet DV）"
python3 scripts/fill_material_template.py $DRY_RUN
echo

echo "▸ [2/4] add_template_appendix.py"
echo "    → 01-06 说明 sheet 末尾追加「Sheet ↔ 数据表对照」附录"
python3 scripts/add_template_appendix.py $DRY_RUN
echo

echo "▸ [3/4] add_header_comments.py"
echo "    → 02/04/06 R1 表头必填字段批注（25 条 / 6 行格式）"
python3 scripts/add_header_comments.py $DRY_RUN
echo

echo "▸ [4/4] add_validations.py"
echo "    → 04/06 同 sheet 数据验证（9 条 / list+date+decimal）"
python3 scripts/add_validations.py $DRY_RUN
echo

echo "════════════════════════════════════════════════════════════"
echo "  ✓ 全部完成。"
echo "  建议：用 Excel/WPS 打开任一模板，验证下拉/批注/附录显示正常。"
echo "  完整复检：见 scripts/README.md §1.5 验证清单"
echo "════════════════════════════════════════════════════════════"
