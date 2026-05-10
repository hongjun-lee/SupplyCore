/* ============================================================
 * 档 A 一阶段 · Day 1 · 数据层
 * SC.store — LocalStorage CRUD + 跨页广播 + 事务快照
 *
 * 与现有 SC.data（静态 mock）共存：
 *   - SC.data 保持不变（静态展示数据，向后兼容）
 *   - SC.store 是新引擎，业务实体的"活数据"全部走 store
 * ============================================================ */
(function () {
  var SC = window.SC = window.SC || {};
  if (SC.store) return; // idempotent

  var KEY_PREFIX = 'sc:'; // LocalStorage key 前缀
  var SEQ_PREFIX = 'sc:_seq:';
  var BUS_NAME = 'sc-state-bus';
  var SCHEMA_VERSION_KEY = 'sc:_schemaVersion';
  // 当 seed 结构 / 状态机 / 字段口径有破坏性变更时，更新此版本号 → 自动提示用户重置
  var CURRENT_SCHEMA_VERSION = '0.22';

  var bus = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel(BUS_NAME) : null;
  var subs = {};   // entity → [callback]
  var seedRef = null; // 保存 seed 引用，用于 reset

  function read(entity) {
    try {
      var raw = localStorage.getItem(KEY_PREFIX + entity);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[store] read failed', entity, e);
      return null;
    }
  }

  function write(entity, items) {
    try {
      localStorage.setItem(KEY_PREFIX + entity, JSON.stringify(items));
    } catch (e) {
      console.error('[store] write failed', entity, e);
      throw e;
    }
  }

  function notify(entity, event, item) {
    var msg = { entity: entity, event: event, item: item, ts: Date.now() };
    (subs[entity] || []).forEach(function (cb) {
      try { cb(msg); } catch (e) { console.error('[store] sub error', e); }
    });
    if (bus) {
      try { bus.postMessage(msg); } catch (e) { /* ignore serialize errors */ }
    }
  }

  if (bus) {
    bus.onmessage = function (ev) {
      var d = ev.data;
      (subs[d.entity] || []).forEach(function (cb) {
        try { cb(d); } catch (e) { console.error('[store] cross-tab sub error', e); }
      });
    };
  }

  SC.store = {
    KEY_PREFIX: KEY_PREFIX,
    SCHEMA_VERSION: CURRENT_SCHEMA_VERSION,

    /* ---------- Schema 版本检查 ---------- */
    /* 启动时调用：如本地 schemaVersion 与代码不一致 / 残留无版本号的旧数据 → 提示用户重置 */
    checkSchemaVersion: function () {
      var stored = localStorage.getItem(SCHEMA_VERSION_KEY);
      if (stored === CURRENT_SCHEMA_VERSION) {
        return { match: true, stored: stored, current: CURRENT_SCHEMA_VERSION };
      }
      // 检查是否有任何 sc:* 业务数据（排除版本号 key 本身）
      var hasOldData = false;
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(KEY_PREFIX) === 0 && k !== SCHEMA_VERSION_KEY) {
          hasOldData = true;
          break;
        }
      }
      if (!stored && !hasOldData) {
        // 全新浏览器 / 已重置过 → 直接写入当前版本，无须提示
        localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
        return { match: true, stored: null, current: CURRENT_SCHEMA_VERSION };
      }
      // 不匹配（含两种场景）：① 版本号不一致 ② 无版本号但有旧业务数据 → 提示重置
      return { match: false, stored: stored || '(无版本号 + 有旧数据)', current: CURRENT_SCHEMA_VERSION };
    },

    /* 用户确认后的重置 + 升级版本号 */
    upgradeSchema: function () {
      SC.store.reset();
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
      console.log('[store] schema upgraded → ' + CURRENT_SCHEMA_VERSION);
    },

    /* ---------- 初始化 / 重置 ---------- */
    seed: function (seedData) {
      seedRef = seedData || seedRef;
      if (!seedRef) return;
      Object.keys(seedRef).forEach(function (entity) {
        if (!read(entity)) {
          write(entity, JSON.parse(JSON.stringify(seedRef[entity])));
        }
      });
      console.log('[store] seeded', Object.keys(seedRef).length, 'entities');
    },

    reset: function () {
      if (!seedRef) {
        console.warn('[store] reset: no seed registered');
        return;
      }
      for (var j = localStorage.length - 1; j >= 0; j--) {
        var oldKey = localStorage.key(j);
        if (oldKey && oldKey.indexOf(KEY_PREFIX) === 0 && oldKey !== SCHEMA_VERSION_KEY) {
          localStorage.removeItem(oldKey);
        }
      }
      // 重置后回写当前版本号
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
      Object.keys(seedRef).forEach(function (entity) {
        write(entity, JSON.parse(JSON.stringify(seedRef[entity])));
      });
      Object.keys(seedRef).forEach(function (entity) {
        notify(entity, 'reset', null);
      });
      console.log('[store] reset done');
    },

    /* ---------- CRUD ---------- */
    list: function (entity, filter) {
      var items = read(entity) || [];
      if (filter) {
        items = items.filter(function (it) {
          return Object.keys(filter).every(function (k) { return it[k] === filter[k]; });
        });
      }
      return items;
    },

    get: function (entity, id) {
      var items = read(entity) || [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) return items[i];
      }
      return null;
    },

    create: function (entity, payload) {
      var items = read(entity) || [];
      var maxId = items.reduce(function (m, it) { return it.id > m ? it.id : m; }, 0);
      var now = new Date().toISOString();
      var newItem = Object.assign({}, payload, {
        id: maxId + 1,
        created_at: now,
        updated_at: now,
      });
      items.push(newItem);
      write(entity, items);
      notify(entity, 'create', newItem);
      return newItem;
    },

    update: function (entity, id, patch) {
      var items = read(entity) || [];
      var idx = -1;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) { idx = i; break; }
      }
      if (idx < 0) return null;
      Object.assign(items[idx], patch, { updated_at: new Date().toISOString() });
      write(entity, items);
      notify(entity, 'update', items[idx]);
      return items[idx];
    },

    remove: function (entity, id) {
      var items = read(entity) || [];
      var filtered = items.filter(function (it) { return it.id !== id; });
      if (filtered.length === items.length) return false;
      write(entity, filtered);
      notify(entity, 'delete', { id: id });
      return true;
    },

    upsert: function (entity, matcher, payload) {
      var items = read(entity) || [];
      var idx = -1;
      for (var i = 0; i < items.length; i++) {
        var match = Object.keys(matcher).every(function (k) { return items[i][k] === matcher[k]; });
        if (match) { idx = i; break; }
      }
      if (idx >= 0) {
        Object.assign(items[idx], payload, { updated_at: new Date().toISOString() });
        write(entity, items);
        notify(entity, 'update', items[idx]);
        return items[idx];
      }
      return SC.store.create(entity, Object.assign({}, matcher, payload));
    },

    /* ---------- 订阅 ---------- */
    subscribe: function (entity, callback) {
      if (!subs[entity]) subs[entity] = [];
      subs[entity].push(callback);
      return function unsubscribe() {
        var idx = subs[entity].indexOf(callback);
        if (idx >= 0) subs[entity].splice(idx, 1);
      };
    },

    /* ---------- 事务（snapshot / rollback） ---------- */
    snapshot: function (entities) {
      var snap = {};
      entities.forEach(function (e) {
        snap[e] = JSON.parse(JSON.stringify(read(e) || []));
      });
      return snap;
    },

    rollback: function (snap) {
      if (!snap) return;
      Object.keys(snap).forEach(function (e) {
        write(e, snap[e]);
        notify(e, 'rollback', null);
      });
    },

    transaction: function (entities, fn) {
      var snap = SC.store.snapshot(entities);
      try {
        var result = fn();
        if (result && typeof result.then === 'function') {
          return result.catch(function (e) {
            SC.store.rollback(snap);
            throw e;
          });
        }
        return result;
      } catch (e) {
        SC.store.rollback(snap);
        throw e;
      }
    },

    /* ---------- 取号 ---------- */
    nextNo: function (prefix, padDigits) {
      padDigits = padDigits || 4;
      var key = SEQ_PREFIX + prefix;
      var seq = (parseInt(localStorage.getItem(key) || '0', 10)) + 1;
      localStorage.setItem(key, String(seq));
      var dt = new Date();
      var ymd = dt.getFullYear() + String(dt.getMonth() + 1).padStart(2, '0');
      return prefix + '-' + ymd + '-' + String(seq).padStart(padDigits, '0');
    },

    /* ---------- 工具 ---------- */
    stats: function () {
      var s = {};
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf(KEY_PREFIX) !== 0) continue;
        if (k.indexOf(SEQ_PREFIX) === 0) continue;
        var entity = k.slice(KEY_PREFIX.length);
        var items = read(entity) || [];
        s[entity] = items.length;
      }
      return s;
    },

    /* 调试用 */
    _read: read,
    _write: write,
    _bus: bus,
  };

  console.log('[store] ready · BroadcastChannel:' + (bus ? 'on' : 'off'));
})();
