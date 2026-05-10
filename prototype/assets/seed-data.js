/* ============================================================
 * 档 A 一期 · Day 3 · 主数据预填
 * SC.seedData — 静态主数据，store.seed 时灌入 LocalStorage
 *
 * 包含：
 *   M-01 organization 组织
 *   M-02 warehouse 仓库
 *   M-05 material 物料（10 个，覆盖支护 / 电缆 / 火工品 / 设备等）
 *   M-09 supplier 供应商（5 家）
 *   M-12 cost_center 成本中心（4 个）
 *   F-13 interface_switch NC 开关
 * ============================================================ */
(function () {
  var SC = window.SC = window.SC || {};

  SC.seedData = {
    /* M-01 组织（4 级 mock：集团 → 物资公司 → 矿） */
    'M-01': [
      { id: 1, code: 'GROUP', name: '阜矿集团', org_type: 'GROUP', parent_id: null },
      { id: 2, code: 'WZ',    name: '物资公司', org_type: 'COMPANY', parent_id: 1 },
      { id: 3, code: 'AYK',   name: '艾友矿',   org_type: 'MINE',    parent_id: 1 },
      { id: 4, code: 'DLK',   name: '东梁矿',   org_type: 'MINE',    parent_id: 1 },
      { id: 5, code: 'WLK',   name: '五龙矿',   org_type: 'MINE',    parent_id: 1 },
      { id: 6, code: 'XQK',   name: '新邱矿',   org_type: 'MINE',    parent_id: 1 },
    ],

    /* M-02 仓库 */
    'M-02': [
      { id: 1, code: 'WH-WZ-01',  name: '物资公司中心库', org_id: 2 },
      { id: 2, code: 'WH-AYK-01', name: '艾友矿主仓',     org_id: 3 },
      { id: 3, code: 'WH-AYK-02', name: '艾友矿设备库',   org_id: 3 },
      { id: 4, code: 'WH-DLK-01', name: '东梁矿主仓',     org_id: 4 },
      { id: 5, code: 'WH-WLK-01', name: '五龙矿主仓',     org_id: 5 },
      { id: 6, code: 'WH-WLK-HG', name: '五龙矿火工品库（专管）', org_id: 5, special: 'EXPLOSIVE' },
    ],

    /* M-05 物料（10 个，覆盖几类） */
    'M-05': [
      { id:  1, code: 'MAT-AQ-0021', name: '甲烷传感器 GJC4(A)',        spec: '0~4%CH4 本安型',  unit: '只', category: '安全监测', is_direct_eligible: false, has_batch: true },
      { id:  2, code: 'MAT-DJ-0118', name: '矿用变频器 KBSGZY',          spec: '660V 200kVA',     unit: '台', category: '电气设备', is_direct_eligible: true,  has_batch: false },
      { id:  3, code: 'MAT-DL-0220', name: '矿用电缆 MYP3*50+1*16',      spec: '阻燃 1.9/3.3kV',   unit: '米', category: '电缆电线', is_direct_eligible: false, has_batch: false },
      { id:  4, code: 'MAT-RH-0033', name: '乳化油 N5',                  spec: '200L/桶',         unit: '桶', category: '化工油料', is_direct_eligible: false, has_batch: true },
      { id:  5, code: 'MAT-HG-0007', name: '雷管 数码电子',              spec: '8 段',            unit: '发', category: '火工品',   is_direct_eligible: false, has_batch: true,  is_safety_special: true },
      { id:  6, code: 'MAT-HG-0011', name: '乳化炸药 矿用 II 级',         spec: '32mm*200g',       unit: '卷', category: '火工品',   is_direct_eligible: false, has_batch: true,  is_safety_special: true },
      { id:  7, code: 'MAT-BJ-0902', name: '掘进机截齿 S150',            spec: '硬质合金',         unit: '把', category: '采掘备件', is_direct_eligible: false, has_batch: false },
      { id:  8, code: 'MAT-BJ-0801', name: '锚杆 Φ20×2400',             spec: 'Φ20×2400',         unit: '根', category: '支护材料', is_direct_eligible: false, has_batch: false },
      { id:  9, code: 'MAT-BJ-0802', name: '托盘 150×150×8',            spec: '150×150×8',       unit: '块', category: '支护材料', is_direct_eligible: false, has_batch: false },
      { id: 10, code: 'MAT-FJ-0033', name: '局部通风机 FBD№6.7/2×30',    spec: '2×30 kW',         unit: '台', category: '通风设备', is_direct_eligible: true,  has_batch: false },
    ],

    /* M-09 供应商 */
    'M-09': [
      { id: 1, code: 'SUP-001', name: '抚顺矿用电缆厂',         tax_code: '91210400MA0XX01', state: '合格', credit_level: 'A', role_tags: ['投标', '中标', '历史合作'] },
      { id: 2, code: 'SUP-002', name: '辽宁中煤矿山装备',       tax_code: '91210000MA0XX02', state: '合格', credit_level: 'A', role_tags: ['投标', '中标', '历史合作'] },
      { id: 3, code: 'SUP-003', name: '沈阳安泰电子有限公司',   tax_code: '91210100MA0XX03', state: '合格', credit_level: 'B', role_tags: ['投标', '历史合作'] },
      { id: 4, code: 'SUP-004', name: '北京赛福斯特科技',       tax_code: '91110000MA0XX04', state: '合格', credit_level: 'B', role_tags: ['投标', '中标'] },
      { id: 5, code: 'SUP-005', name: '阜新本地物资协作单位',   tax_code: '91210900MA0XX05', state: '合格', credit_level: 'C', role_tags: ['投标', '中标', '历史合作'] },
    ],

    /* M-12 成本中心 */
    'M-12': [
      { id: 1, code: 'CC-AYK-01', name: '艾友矿·综采一队',     org_id: 3 },
      { id: 2, code: 'CC-AYK-02', name: '艾友矿·综采二队',     org_id: 3 },
      { id: 3, code: 'CC-DLK-01', name: '东梁矿·掘进一队',     org_id: 4 },
      { id: 4, code: 'CC-WLK-01', name: '五龙矿·运输二队',     org_id: 5 },
    ],

    /* F-13 NC 接口开关（v0.19 二期 P1：再加 BIZ-007 调拨 / BIZ-008 盘盈 / BIZ-009 盘亏） */
    'F-13': [
      { id: 1, switch_code: 'BIZ-001-switch', interface_name: '采购入库（正式）',         switch_status: '开' },
      { id: 2, switch_code: 'BIZ-002-switch', interface_name: '采购入库（暂估）',         switch_status: '开', remark: '二期 A8 暂估闭环 — BIZ-002 暂估 + BIZ-003 红字冲销' },
      { id: 3, switch_code: 'BIZ-005-switch', interface_name: '出库（自用消耗）',         switch_status: '开', remark: '二期 A2 出库主线' },
      { id: 4, switch_code: 'BIZ-007-switch', interface_name: '调拨（内部往来对冲）',     switch_status: '开', remark: '二期 P1 A3 调拨主线' },
      { id: 5, switch_code: 'BIZ-008-switch', interface_name: '盘盈（增加库存）',         switch_status: '开', remark: '二期 P1 A5 盘点 — 盘盈调整凭证' },
      { id: 6, switch_code: 'BIZ-009-switch', interface_name: '盘亏（减少库存）',         switch_status: '开', remark: '二期 P1 A5 盘点 — 盘亏调整凭证' },
      { id: 7, switch_code: 'BIZ-013-switch', interface_name: '付款执行',                 switch_status: '开', remark: '二期 A4b 付款链路 — NC 实付回写' },
    ],

    /* P-01 示例需求（演示用，v0.16 改为草稿态 — 让用户从最起点演示
     * 提交审批 → 审批通过 → linkage 自动聚合 P-02 + P-03 + 后续链路）
     * 修复同事评审 P1-2：原 seed 已审 + 已审 P-02 + P-03 但无 P-05，诱导测试页重复 emit 补数据 */
    'P-01': [
      { id: 1, request_no: 'XQ-2026-0421', org_id: 3, material_id: 8, quantity: 200, amount: 95620,
        purpose: '艾友矿 1308 工作面回风顺槽支护', urgency: '普通', state: '草稿',
        applicant: '李振华', submit_date: '2026-04-15' },
      { id: 2, request_no: 'XQ-2026-0427', org_id: 4, material_id: 3, quantity: 800, amount: 55000,
        purpose: '东梁矿掘进备件月度补充', urgency: '普通', state: '草稿',
        applicant: '王志刚', submit_date: '2026-04-20' },
      { id: 3, request_no: 'XQ-2026-0430', org_id: 3, material_id: 8, quantity: 120, amount: 57372,
        purpose: '艾友矿 1309 工作面追加支护（同物料合并演示）', urgency: '普通', state: '草稿',
        applicant: '赵明', submit_date: '2026-04-16' },
    ],

    /* v0.16 不再 seed P-02 / P-03 — 由 P-01 已审 linkage 自动聚合 */

    /* v0.18 二期演示种子：1 个已签合同 + 1 个执行中合同（演示付款链路起点）*/
    'C-02': [
      { id: 1, contract_no: 'HT-2026-0042', supplier_id: 1, amount: 4280000,
        payment_terms: '30% 预付 + 60% 验收 + 10% 质保（一期 payment_terms 文本，二期 A4 落 C-04 实体）',
        executed_amount: 412800, paid_amount: 1284000,
        state: '执行中', signed_date: '2026-03-12' },
    ],

    /* v0.19 二期 P1 A12 后评价种子：3 笔已确认差评（演示供应商累计触发重评估）*/
    'M-13': [
      { id: 1, supplier_id: 3, score: 2, evaluator: '王志国', evaluated_at: '2026-04-12',
        category: '交付质量', remark: '到货 5 套传感器中 2 套不合格，需要返修', state: '已确认' },
      { id: 2, supplier_id: 3, score: 1, evaluator: '李正民', evaluated_at: '2026-04-25',
        category: '交付时效', remark: '交付延期 7 天，影响下井计划', state: '已确认' },
      { id: 3, supplier_id: 3, score: 5, evaluator: '陈雪',   evaluated_at: '2026-04-30',
        category: '配合度',   remark: '响应快速、配合度高',          state: '已确认' },
    ],
  };

  /* 自动 seed（如果 store 已就绪） */
  if (SC.store && typeof SC.store.seed === 'function') {
    SC.store.seed(SC.seedData);
  }
})();
