/* ============================================================
 * 档 A 二期 · B1 · 时间穿越（mock 系统时间）
 * SC.time — 全局时间 helper + LocalStorage 持久化 + 跨页广播
 *
 * 使用方式：
 *   SC.time.now()       // 当前 Date（默认真实，mock 时返回 mock 时间）
 *   SC.time.iso()       // ISO 字符串（业务记录用）
 *   SC.time.today()     // 当天 0 点
 *   SC.time.setMock(d)  // 设置 mock 时间（Date 或 ISO）
 *   SC.time.clearMock() // 清除 mock，回到真实时间
 *   SC.time.advance(days, hours)  // 在 mock 基础上前进
 *   SC.time.isMocked()  // 当前是否 mock 模式
 *   SC.time.label()     // 显示用字符串（含 mock 标记）
 *   SC.time.subscribe(cb)  // 订阅时间变化（mock 切换 / 跨页同步）
 *
 * 与 SC.store 共存：store 内部仍用 new Date() 记录 created_at/updated_at（实
 * 操审计层），业务层（暂估超期 / 合同到期 / 应急补办时限等）应改用 SC.time。
 * ============================================================ */
(function () {
  var SC = window.SC = window.SC || {};
  if (SC.time) return; // idempotent

  var KEY_MOCK = 'sc:_mockTime';      // 持久化 mock 时间（ISO）
  var BUS_NAME = 'sc-time-bus';

  var bus = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel(BUS_NAME) : null;
  var subs = [];
  var cachedMock = null;  // 内存缓存（避免每次 now() 都读 LS）

  function readMock() {
    try {
      var raw = localStorage.getItem(KEY_MOCK);
      if (!raw) return null;
      var d = new Date(raw);
      return isNaN(d.getTime()) ? null : d;
    } catch (e) { return null; }
  }

  function writeMock(d) {
    try {
      if (d == null) localStorage.removeItem(KEY_MOCK);
      else localStorage.setItem(KEY_MOCK, d.toISOString());
    } catch (e) { console.warn('[time] writeMock failed', e); }
  }

  function notify(d) {
    var msg = { mockTime: d ? d.toISOString() : null };
    subs.forEach(function (cb) { try { cb(msg); } catch (e) { console.error('[time] sub error', e); } });
    if (bus) { try { bus.postMessage(msg); } catch (e) { /* ignore */ } }
  }

  if (bus) {
    bus.onmessage = function (ev) {
      cachedMock = ev.data && ev.data.mockTime ? new Date(ev.data.mockTime) : null;
      subs.forEach(function (cb) { try { cb(ev.data); } catch (e) { /* ignore */ } });
    };
  }

  // 初始加载
  cachedMock = readMock();

  SC.time = {
    now: function () {
      if (cachedMock) {
        // 返回 mock 时间的副本（防外部突变）
        return new Date(cachedMock.getTime());
      }
      return new Date();
    },
    iso: function () { return SC.time.now().toISOString(); },
    today: function () {
      var d = SC.time.now();
      d.setHours(0, 0, 0, 0);
      return d;
    },
    setMock: function (d) {
      var date = (d instanceof Date) ? d : new Date(d);
      if (isNaN(date.getTime())) {
        console.error('[time] setMock 无效日期', d);
        return;
      }
      cachedMock = date;
      writeMock(date);
      notify(date);
    },
    clearMock: function () {
      cachedMock = null;
      writeMock(null);
      notify(null);
    },
    advance: function (days, hours) {
      var base = cachedMock ? new Date(cachedMock.getTime()) : new Date();
      base.setDate(base.getDate() + (days || 0));
      base.setHours(base.getHours() + (hours || 0));
      SC.time.setMock(base);
    },
    isMocked: function () { return cachedMock != null; },
    label: function () {
      var d = SC.time.now();
      var s = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0') + ' ' +
        String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0');
      return cachedMock ? '🕐 ' + s + ' (mock)' : s;
    },
    daysBetween: function (from, to) {
      // 工具：返回 to - from 的整数天数（Date 或 ISO 均可）
      var f = (from instanceof Date) ? from : new Date(from);
      var t = (to instanceof Date) ? to : new Date(to);
      var ms = t.getTime() - f.getTime();
      return Math.round(ms / 86400000);
    },
    addDays: function (d, days) {
      var base = (d instanceof Date) ? new Date(d.getTime()) : new Date(d);
      base.setDate(base.getDate() + days);
      return base;
    },
    subscribe: function (cb) {
      subs.push(cb);
      return function () {
        var i = subs.indexOf(cb);
        if (i >= 0) subs.splice(i, 1);
      };
    }
  };
})();
