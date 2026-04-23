"""
批量后处理发标包 docx 样式：
  1. 所有正文字体统一为宋体 14pt（中英文同字号，中文走 eastAsia）
  2. 所有标题段落（Heading 1~6 / Title）加粗，字号按层级放大
  3. 所有表格单元格四周加实体边框（single line, 4pt 宽度, 黑色）
  4. 表格单元格内文字也同样强制为宋体 14pt

用法:
  python3 scripts/apply_docx_style.py "docs/招标/word"
"""
from __future__ import annotations

import sys
from pathlib import Path

from docx import Document
from docx.shared import Pt, RGBColor
from docx.oxml.ns import qn, nsmap
from docx.oxml import OxmlElement


ZH_FONT = "宋体"
EN_FONT = "宋体"
BASE_PT = 14
HEADING_PT = {
    "Title": 22,
    "Heading 1": 20,
    "Heading 2": 14,
    "Heading 3": 16,
    "Heading 4": 15,
    "Heading 5": 14,
    "Heading 6": 14,
}
BORDER_SIZE = "4"
BORDER_COLOR = "000000"


def set_run_font(run, size_pt: int, bold: bool | None = None):
    run.font.name = EN_FONT
    run.font.size = Pt(size_pt)
    if bold is not None:
        run.bold = bold
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    rFonts.set(qn("w:ascii"), EN_FONT)
    rFonts.set(qn("w:hAnsi"), EN_FONT)
    rFonts.set(qn("w:eastAsia"), ZH_FONT)
    rFonts.set(qn("w:cs"), EN_FONT)

    sz = rPr.find(qn("w:sz"))
    if sz is None:
        sz = OxmlElement("w:sz")
        rPr.append(sz)
    sz.set(qn("w:val"), str(size_pt * 2))
    szCs = rPr.find(qn("w:szCs"))
    if szCs is None:
        szCs = OxmlElement("w:szCs")
        rPr.append(szCs)
    szCs.set(qn("w:val"), str(size_pt * 2))


def paragraph_size_and_bold(paragraph) -> tuple[int, bool | None]:
    style_name = paragraph.style.name if paragraph.style else ""
    if style_name in HEADING_PT:
        return HEADING_PT[style_name], True
    if style_name.startswith("TOC"):
        return BASE_PT, None
    return BASE_PT, None


def style_paragraph(paragraph):
    size, bold = paragraph_size_and_bold(paragraph)
    if not paragraph.runs:
        pPr = paragraph._p.get_or_add_pPr()
        rPr = pPr.find(qn("w:rPr"))
        if rPr is None:
            rPr = OxmlElement("w:rPr")
            pPr.append(rPr)
    for run in paragraph.runs:
        set_run_font(run, size, bold)

    # 标题段落启用"与下段同页"，避免末尾孤行或与下方图表被分页拆开
    style_name = paragraph.style.name if paragraph.style else ""
    if style_name in HEADING_PT:
        paragraph.paragraph_format.keep_with_next = True


def set_cell_border(cell):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = tcPr.find(qn("w:tcBorders"))
    if tcBorders is None:
        tcBorders = OxmlElement("w:tcBorders")
        tcPr.append(tcBorders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = tcBorders.find(qn(f"w:{edge}"))
        if el is None:
            el = OxmlElement(f"w:{edge}")
            tcBorders.append(el)
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), BORDER_SIZE)
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), BORDER_COLOR)


def set_table_borders(table):
    tbl = table._tbl
    tblPr = tbl.find(qn("w:tblPr"))
    if tblPr is None:
        tblPr = OxmlElement("w:tblPr")
        tbl.insert(0, tblPr)
    tblBorders = tblPr.find(qn("w:tblBorders"))
    if tblBorders is None:
        tblBorders = OxmlElement("w:tblBorders")
        tblPr.append(tblBorders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = tblBorders.find(qn(f"w:{edge}"))
        if el is None:
            el = OxmlElement(f"w:{edge}")
            tblBorders.append(el)
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), BORDER_SIZE)
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), BORDER_COLOR)


def style_table(table):
    set_table_borders(table)
    for row in table.rows:
        for cell in row.cells:
            set_cell_border(cell)
            for p in cell.paragraphs:
                style_paragraph(p)
            for nested in cell.tables:
                style_table(nested)


def style_normal_definition(document):
    styles_element = document.styles.element
    for style in styles_element.findall(qn("w:style")):
        rPr = style.find(qn("w:rPr"))
        if rPr is None:
            rPr = OxmlElement("w:rPr")
            style.append(rPr)
        rFonts = rPr.find(qn("w:rFonts"))
        if rFonts is None:
            rFonts = OxmlElement("w:rFonts")
            rPr.insert(0, rFonts)
        rFonts.set(qn("w:ascii"), EN_FONT)
        rFonts.set(qn("w:hAnsi"), EN_FONT)
        rFonts.set(qn("w:eastAsia"), ZH_FONT)
        rFonts.set(qn("w:cs"), EN_FONT)


def process_docx(path: Path):
    doc = Document(path)
    style_normal_definition(doc)
    for paragraph in doc.paragraphs:
        style_paragraph(paragraph)
    for table in doc.tables:
        style_table(table)
    for section in doc.sections:
        for header in (section.header, section.first_page_header, section.even_page_header):
            if header is None:
                continue
            for p in header.paragraphs:
                style_paragraph(p)
        for footer in (section.footer, section.first_page_footer, section.even_page_footer):
            if footer is None:
                continue
            for p in footer.paragraphs:
                style_paragraph(p)
    doc.save(path)


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "docs/招标/word")
    files = sorted(root.rglob("*.docx"))
    if not files:
        print(f"No docx files under {root}")
        return
    print(f"Found {len(files)} docx files under {root}")
    for f in files:
        print(f"  styling: {f.relative_to(root)}")
        try:
            process_docx(f)
        except Exception as e:
            print(f"    !! failed: {e}")
    print("All done.")


if __name__ == "__main__":
    main()
