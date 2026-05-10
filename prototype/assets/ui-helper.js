/* ============================================================
 * 档 A 一期 · Day 5 · UI 通用组件
 * SC.ui — confirm / alert / toast / loading / prompt
 *
 * 简单 Modal 与 Toast 实现，统一 alert/confirm 体验，避免散乱的 window.alert。
 * ============================================================ */
(function () {
  var SC = window.SC = window.SC || {};
  if (SC.ui) return;

  /* 注入样式（一次性） */
  function ensureStyles() {
    if (document.getElementById('sc-ui-styles')) return;
    var style = document.createElement('style');
    style.id = 'sc-ui-styles';
    style.textContent = [
      '@keyframes sc-toast-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }',
      '@keyframes sc-toast-out { from { opacity: 1; } to { opacity: 0; } }',
      '.sc-toast-box { position: fixed; top: 16px; right: 16px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }',
      '.sc-toast { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 14px; font-size: 13px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); max-width: 360px; line-height: 1.5; pointer-events: auto; animation: sc-toast-in 0.2s ease; }',
      '.sc-toast.success { border-left: 4px solid #10b981; color: #064e3b; }',
      '.sc-toast.error   { border-left: 4px solid #ef4444; color: #7f1d1d; }',
      '.sc-toast.warning { border-left: 4px solid #f59e0b; color: #78350f; }',
      '.sc-toast.info    { border-left: 4px solid #3b82f6; color: #1e3a8a; }',
      '.sc-modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 9998; display: flex; align-items: center; justify-content: center; animation: sc-toast-in 0.15s ease; }',
      '.sc-modal { background: #fff; border-radius: 8px; padding: 22px 24px; max-width: 420px; min-width: 320px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); }',
      '.sc-modal .sc-modal-title { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 8px; }',
      '.sc-modal .sc-modal-body { font-size: 13px; color: #1f2937; line-height: 1.6; margin-bottom: 16px; }',
      '.sc-modal .sc-modal-input { width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; box-sizing: border-box; margin-bottom: 12px; }',
      '.sc-modal .sc-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }',
      '.sc-loading-mask { position: fixed; inset: 0; background: rgba(255,255,255,0.6); z-index: 9997; display: flex; align-items: center; justify-content: center; }',
      '.sc-loading-box { background: #fff; padding: 18px 28px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.16); font-size: 13px; color: #111; display: flex; gap: 10px; align-items: center; }',
      '.sc-loading-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid #d1d5db; border-top-color: #3b82f6; border-radius: 50%; animation: sc-spin 0.8s linear infinite; }',
      '@keyframes sc-spin { to { transform: rotate(360deg); } }',
    ].join('\n');
    document.head.appendChild(style);
  }

  function ensureToastBox() {
    var box = document.getElementById('sc-toast-box');
    if (box) return box;
    box = document.createElement('div');
    box.id = 'sc-toast-box';
    box.className = 'sc-toast-box';
    document.body.appendChild(box);
    return box;
  }

  function makeMask() {
    var mask = document.createElement('div');
    mask.className = 'sc-modal-mask';
    return mask;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  SC.ui = {
    /* 短暂消息提示，3 秒自动消失 */
    toast: function (message, type, durationMs) {
      ensureStyles();
      var box = ensureToastBox();
      var el = document.createElement('div');
      el.className = 'sc-toast ' + (type || 'info');
      el.textContent = message;
      box.appendChild(el);
      var dur = durationMs || 3000;
      setTimeout(function () {
        el.style.animation = 'sc-toast-out 0.2s ease';
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 200);
      }, dur);
    },

    /* 信息提示弹窗 */
    alert: function (message, opts) {
      ensureStyles();
      opts = opts || {};
      return new Promise(function (resolve) {
        var mask = makeMask();
        mask.innerHTML =
          '<div class="sc-modal">' +
            (opts.title ? '<div class="sc-modal-title">' + escapeHtml(opts.title) + '</div>' : '') +
            '<div class="sc-modal-body">' + (opts.html ? message : escapeHtml(message)) + '</div>' +
            '<div class="sc-modal-actions">' +
              '<button class="btn btn-primary" data-act="ok">' + (opts.okText || '确认') + '</button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(mask);
        mask.querySelector('[data-act="ok"]').onclick = function () {
          if (mask.parentNode) mask.parentNode.removeChild(mask);
          resolve(true);
        };
      });
    },

    /* 确认弹窗 */
    confirm: function (message, opts) {
      ensureStyles();
      opts = opts || {};
      return new Promise(function (resolve) {
        var mask = makeMask();
        mask.innerHTML =
          '<div class="sc-modal">' +
            (opts.title ? '<div class="sc-modal-title">' + escapeHtml(opts.title) + '</div>' : '') +
            '<div class="sc-modal-body">' + (opts.html ? message : escapeHtml(message)) + '</div>' +
            '<div class="sc-modal-actions">' +
              '<button class="btn" data-act="cancel">' + (opts.cancelText || '取消') + '</button>' +
              '<button class="btn btn-primary" data-act="ok">' + (opts.okText || '确认') + '</button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(mask);
        var close = function (v) {
          if (mask.parentNode) mask.parentNode.removeChild(mask);
          resolve(v);
        };
        mask.querySelector('[data-act="ok"]').onclick = function () { close(true); };
        mask.querySelector('[data-act="cancel"]').onclick = function () { close(false); };
      });
    },

    /* 简单 prompt：返回输入字符串或 null（取消） */
    prompt: function (message, opts) {
      ensureStyles();
      opts = opts || {};
      return new Promise(function (resolve) {
        var mask = makeMask();
        mask.innerHTML =
          '<div class="sc-modal">' +
            (opts.title ? '<div class="sc-modal-title">' + escapeHtml(opts.title) + '</div>' : '') +
            '<div class="sc-modal-body">' + escapeHtml(message) + '</div>' +
            '<input type="text" class="sc-modal-input" placeholder="' + escapeHtml(opts.placeholder || '') + '" value="' + escapeHtml(opts.default || '') + '" />' +
            '<div class="sc-modal-actions">' +
              '<button class="btn" data-act="cancel">取消</button>' +
              '<button class="btn btn-primary" data-act="ok">' + (opts.okText || '确认') + '</button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(mask);
        var input = mask.querySelector('.sc-modal-input');
        input.focus(); input.select();
        var close = function (v) {
          if (mask.parentNode) mask.parentNode.removeChild(mask);
          resolve(v);
        };
        mask.querySelector('[data-act="ok"]').onclick = function () { close(input.value); };
        mask.querySelector('[data-act="cancel"]').onclick = function () { close(null); };
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') close(input.value);
          if (e.key === 'Escape') close(null);
        });
      });
    },

    /* 加载遮罩 */
    loading: function (show, message) {
      ensureStyles();
      var existing = document.getElementById('sc-loading-mask');
      if (show) {
        if (existing) return;
        var mask = document.createElement('div');
        mask.id = 'sc-loading-mask';
        mask.className = 'sc-loading-mask';
        mask.innerHTML = '<div class="sc-loading-box"><span class="sc-loading-spinner"></span><span>' + escapeHtml(message || '处理中…') + '</span></div>';
        document.body.appendChild(mask);
      } else {
        if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      }
    },
  };

  console.log('[ui] ready · toast / alert / confirm / prompt / loading');
})();
