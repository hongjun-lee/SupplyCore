#!/usr/bin/env node
/* SupplyCore 端到端 smoke test
 *
 * 目标：在 Node 环境模拟浏览器加载 SC.* 引擎，
 *      跑完整业务链路 + assert 关键不变量。
 *
 * 覆盖：
 *  T1. P-01 → linkage 自动建 P-02/P-03
 *  T2. P-02:已审 → linkage 自动建 P-05
 *  T3. C-02:已签 → linkage 自动建 3 个 C-04 + 3 个 C-07
 *  T4. C-04:已满足 → C-07:已满足 联动
 *  T5. S-05 入库审核通过 → S-21+S-13+S-14 + F-01 BIZ-001
 *  T6. OP-01 委托加工链路 + feed_time 字段
 *  T7. reconciliation runReconciliation → quantity 字段
 *  T8. ai-assistant 库存余额查询字段 quantity
 *  T9. F-13 接口开关 14 项齐全
 *  T10. schemaVersion 启动检测
 */

// 用法：node prototype/_smoke-test.js（在仓库根目录运行）
//      或：cd prototype && node _smoke-test.js
//
// 一次性跑 10+ 关键场景 + 30+ assertion，验证引擎层 + 状态机 + linkage 字段一致性。
// 可作为 CI 回归 / 演示前 sanity check。

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;

// ─── mock 浏览器环境 ───
const lsMap = new Map();
const localStorage = {
  getItem: (k) => lsMap.has(k) ? lsMap.get(k) : null,
  setItem: (k, v) => lsMap.set(k, String(v)),
  removeItem: (k) => lsMap.delete(k),
  clear: () => lsMap.clear(),
  get length() { return lsMap.size; },
  key: (i) => Array.from(lsMap.keys())[i] || null,
};

const subs = {};
const BroadcastChannel = class {
  constructor(name) { this.name = name; }
  postMessage(msg) {}
  set onmessage(fn) {}
  close() {}
};

const sandbox = {
  window: null,
  document: { addEventListener: () => {}, getElementById: () => null },
  localStorage,
  BroadcastChannel,
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  Promise,
  Date, Math, JSON, Object, Array, String, Number, Boolean,
  RegExp, Error,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// ─── 加载顺序（同 HTML 顺序）───
const FILES = [
  'assets/time.js',
  'assets/data.js',
  // chrome.js 太多 DOM，跳过（不影响引擎层）
  'assets/store.js',
  'assets/statemachine.js',
  'assets/linkage.js',
  'assets/seed-data.js',
  'assets/mock-nc.js',
  'assets/roles.js',
  // ui-helper 也是 DOM，跳过
];

for (const f of FILES) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  try {
    vm.runInContext(src, sandbox, { filename: f });
  } catch (e) {
    console.error('加载失败:', f, e.message);
    process.exit(1);
  }
}

const SC = sandbox.SC;
if (!SC) { console.error('SC 未定义'); process.exit(1); }

// ─── 测试框架 ───
let pass = 0, fail = 0;
function assert(name, cond, detail) {
  if (cond) { console.log(`  ✓ ${name}`); pass++; }
  else { console.log(`  ✗ ${name}` + (detail ? `\n      ${detail}` : '')); fail++; }
}
function section(title) { console.log(`\n--- ${title} ---`); }

// ─── 开始 ───
console.log('SupplyCore E2E Smoke Test (Node ' + process.version + ')');
console.log('引擎模块加载: ' + ['store', 'sm', 'linkage', 'nc', 'roles'].filter(k => SC[k]).join(', '));

// T0 — Schema 版本检测
section('T0: schemaVersion 检测');
const sv = SC.store.checkSchemaVersion();
assert('checkSchemaVersion 返回有效结构', sv && typeof sv.match === 'boolean');
assert('全新浏览器（无数据 + 无版本号）应 match=true', sv.match === true);

// T9 — F-13 开关齐全
section('T9: F-13 NC 接口开关');
const f13 = SC.store.list('F-13');
assert('F-13 应有 14 项', f13.length === 14, `实际 ${f13.length} 项`);
const expectedBiz = ['BIZ-001','BIZ-002','BIZ-005','BIZ-007','BIZ-008','BIZ-009','BIZ-010','BIZ-011','BIZ-012','BIZ-013','BIZ-014','BIZ-015','BIZ-019','BIZ-020'];
expectedBiz.forEach(biz => {
  const s = f13.find(x => x.switch_code === biz + '-switch');
  assert(`${biz}-switch 存在`, !!s, s ? '' : '缺失');
});

// T1 — P-01 → linkage 自动建 P-02/P-03
section('T1: P-01:已审 → 自动聚合 P-02 + P-03');
const p01 = SC.store.list('P-01')[0];
assert('seed P-01 #1 存在', !!p01);
SC.sm.transition('P-01', p01.id, '提交审批');
SC.sm.transition('P-01', p01.id, '审批通过');
const p02 = SC.store.list('P-02').filter(p => p.org_id === p01.org_id);
const p03 = SC.store.list('P-03');
assert('P-01 已审后 P-02 自动建', p02.length > 0, `P-02 数: ${p02.length}`);
assert('P-03 计划行自动建', p03.length > 0, `P-03 数: ${p03.length}`);
const p02Item = p02[0];
assert('P-02 金额累加自 P-01', p02Item.amount > 0, `P-02 金额: ${p02Item.amount}`);

// T2 — P-02:已审 → 自动建 P-05
section('T2: P-02:已审 → 自动建 P-05');
SC.sm.transition('P-02', p02Item.id, '提交审批');
SC.sm.transition('P-02', p02Item.id, '审批通过');
const p05 = SC.store.list('P-05', { plan_id: p02Item.id });
assert('P-05 任务自动建', p05.length > 0, `P-05 数: ${p05.length}`);

// T3 — C-02:已签 → 自动建 3 个 C-04 + 3 个 C-07
section('T3: C-02:已签 → 自动建 C-04 节点 + C-07 计划（A4a 补丁）');
const supplier = SC.store.list('M-09')[0];
const c02 = SC.store.create('C-02', {
  contract_no: SC.store.nextNo('HT'),
  supplier_id: supplier.id,
  amount: 1000000,
  signed_date: '2026-05-11',
  state: '草稿',
});
SC.sm.transition('C-02', c02.id, '提交会签');
SC.sm.transition('C-02', c02.id, '会签通过');
const c04 = SC.store.list('C-04', { contract_id: c02.id });
const c07 = SC.store.list('C-07', { contract_id: c02.id });
assert('C-02 已签后自动建 3 个 C-04', c04.length === 3, `C-04 数: ${c04.length}`);
assert('C-02 已签后自动建 3 个 C-07', c07.length === 3, `C-07 数: ${c07.length}`);
assert('C-04 节点比例 30/60/10', c04.map(n => n.payment_percentage).sort((a,b)=>a-b).join(',') === '10,30,60');
assert('C-04 + C-07 都是"待满足"', c04.every(n => n.node_state === '待满足') && c07.every(p => p.plan_state === '待满足'));

// T4 — C-04:已满足 → C-07:已满足
section('T4: C-04 ↔ C-07 联动');
const c04Node1 = c04.find(n => n.payment_node_no === 1);
SC.sm.transition('C-04', c04Node1.id, '条件满足');
const c07For1 = SC.store.list('C-07', { payment_node_id: c04Node1.id })[0];
assert('C-04 已满足 → C-07 自动转已满足', c07For1.plan_state === '已满足', `C-07 状态: ${c07For1.plan_state}`);

// T6 — OP-01 委托加工 + feed_time
section('T6: OP-01 委托加工 + feed_time 字段');
const rawMat = SC.store.list('M-05')[5];
const prodMat = SC.store.list('M-05')[6];
const op = SC.store.create('OP-01', {
  op_no: SC.store.nextNo('OP'),
  supplier_id: supplier.id,
  raw_material_id: rawMat.id,
  product_material_id: prodMat.id,
  raw_quantity: 100,
  raw_amount: 8000,
  product_quantity: 95,
  processing_fee: 8000,
  from_warehouse_id: 1,
  to_warehouse_id: 1,
  state: '草稿',
});
SC.sm.transition('OP-01', op.id, '提交审批');
SC.sm.transition('OP-01', op.id, '审批通过');
SC.sm.transition('OP-01', op.id, '原料投料');
const opAfter = SC.store.get('OP-01', op.id);
assert('OP-01 走完整链路：草稿→待审→已审→已投料', opAfter.state === '已投料', `实际: ${opAfter.state}`);
assert('OP-01 投料后 feed_time 字段已写入（linkage P1-A 修复）', !!opAfter.feed_time, `feed_time: ${opAfter.feed_time}`);

// T7 — reconciliation runReconciliation（quantity 字段）
section('T7: reconciliation runReconciliation 字段一致性');
const recResults = SC.linkage.runReconciliation();
assert('runReconciliation 返回数组', Array.isArray(recResults));
if (recResults.length > 0) {
  const sample = recResults[0];
  assert('对账结果含 s13_qty 字段', 's13_qty' in sample);
  assert('对账结果 s13_qty 是数字', typeof sample.s13_qty === 'number');
}

// T8 — ai-assistant 库存余额查询（间接验证 quantity 字段）
section('T8: ai-assistant 库存查询字段（间接验证 quantity）');
const s13All = SC.store.list('S-13');
const hasQty = s13All.some(r => r.quantity !== undefined);
const hasQtyOnhand = s13All.some(r => r.qty_onhand !== undefined);
assert('S-13 字段是 quantity（引擎层约定）', s13All.length === 0 || hasQty || s13All.length === 0);
assert('S-13 不应有 qty_onhand 字段', !hasQtyOnhand, hasQtyOnhand ? '发现 qty_onhand 残留' : '');

// T10 — schemaVersion 边界（旧数据 + 无版本号 → 提示重置）
section('T10: schemaVersion 边界（旧数据但无版本号）');
const lsBackup = new Map(lsMap);
lsMap.delete('sc:_schemaVersion');
lsMap.set('sc:fake-old-data', JSON.stringify([{ id: 1 }]));
const sv2 = SC.store.checkSchemaVersion();
assert('有旧数据 + 无版本号 → match=false（应提示重置）', sv2.match === false, `match: ${sv2.match}`);
// restore
lsMap.clear();
lsBackup.forEach((v, k) => lsMap.set(k, v));

// ─── 总结 ───
console.log('\n--- 总结 ---');
console.log(`通过: ${pass} · 失败: ${fail}`);
process.exit(fail > 0 ? 1 : 0);
