/* ============================================================
 * 档 A 一阶段 · Day 4 · NC 接口 mock
 * SC.nc — 模拟用友 NC 推送的真实异步行为
 *
 * 行为：
 *   - 1-2 秒延迟（可配置）
 *   - 5% 失败率（可配置）
 *   - 成功 → 创建 F-03 凭证回执 + 更新 F-01 task_state=推送成功
 *   - 失败 → 更新 F-01 task_state=推送失败 + emit linkage 事件（触发自动重推）
 *
 * 调用：在 linkage `S-05:已审` 中创建 F-01 task 后，setTimeout(SC.nc.push, 0)
 * ============================================================ */
(function () {
  var SC = window.SC = window.SC || {};
  if (SC.nc) return;

  var config = {
    delayMin: 1000,        // 最小延迟 ms
    delayMax: 2000,        // 最大延迟 ms
    failureRate: 0.05,     // 失败率 5%
    autoRetryEnabled: true, // 是否自动触发 linkage 重推
  };

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function generateVoucherNo() {
    var now = new Date();
    var ymd = now.getFullYear() +
              String(now.getMonth() + 1).padStart(2, '0') +
              String(now.getDate()).padStart(2, '0');
    var rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return 'NC' + ymd + rand;
  }

  SC.nc = {
    config: config,

    /* 推送 F-01 task 到 NC（mock）*/
    push: function (taskId) {
      var task = SC.store.get('F-01', taskId);
      if (!task) {
        console.warn('[nc] task not found:', taskId);
        return Promise.resolve(null);
      }

      // 标记推送中
      SC.store.update('F-01', taskId, {
        task_state: '推送中',
        last_pushed_at: new Date().toISOString(),
      });
      if (SC.linkage) SC.linkage.emit('F-01:推送中', SC.store.get('F-01', taskId));

      var delay = config.delayMin + Math.random() * (config.delayMax - config.delayMin);

      return sleep(delay).then(function () {
        var success = Math.random() > config.failureRate;

        if (success) {
          var voucherNo = generateVoucherNo();
          // 创建 F-03 凭证回执
          SC.store.create('F-03', {
            task_id: taskId,
            interface_id: task.interface_id,
            source_bill_no: task.source_bill_no,
            source_bill_type: task.source_bill_type,
            receipt_status: '已记账',
            nc_voucher_no: voucherNo,
            receipt_time: new Date().toISOString(),
          });
          // 更新 F-01
          var updated = SC.store.update('F-01', taskId, {
            task_state: '推送成功',
            finance_state: '已记账',
            push_success_time: new Date().toISOString(),
            push_voucher_no: voucherNo,
          });
          if (SC.linkage) SC.linkage.emit('F-01:推送成功', updated);
          console.log('[nc] ✓ push success:', task.task_no, '→ NC voucher', voucherNo, '(retry=' + (task.retry_count || 0) + ')');
          return updated;
        } else {
          var errorCodes = [
            { code: 'NC-MOCK-001', msg: '模拟接口超时（演示用）' },
            { code: 'NC-MOCK-002', msg: '模拟供应商编码不存在' },
            { code: 'NC-MOCK-003', msg: '模拟科目映射缺失' },
          ];
          var err = errorCodes[Math.floor(Math.random() * errorCodes.length)];
          var updated = SC.store.update('F-01', taskId, {
            task_state: '推送失败',
            push_error_code: err.code,
            push_error_message: err.msg,
            push_failed_time: new Date().toISOString(),
          });
          if (SC.linkage && config.autoRetryEnabled) SC.linkage.emit('F-01:推送失败', updated);
          console.log('[nc] ✗ push failed:', task.task_no, '→', err.code, err.msg, '(retry=' + (task.retry_count || 0) + ')');
          return updated;
        }
      });
    },

    /* 强制推送（失败也不重推，用于演示一次性结果）*/
    pushOnce: function (taskId) {
      var orig = config.autoRetryEnabled;
      config.autoRetryEnabled = false;
      return SC.nc.push(taskId).then(function (r) {
        config.autoRetryEnabled = orig;
        return r;
      });
    },

    /* 配置覆盖（演示用：调高失败率体验重推）*/
    setConfig: function (overrides) {
      Object.assign(config, overrides);
      console.log('[nc] config updated:', config);
    },

    /* 模拟一次成功（用于演示快速验证）*/
    simulateSuccess: function (taskId) {
      var orig = config.failureRate;
      config.failureRate = 0;
      return SC.nc.push(taskId).then(function (r) {
        config.failureRate = orig;
        return r;
      });
    },

    /* 模拟一次失败 */
    simulateFailure: function (taskId) {
      var orig = config.failureRate;
      config.failureRate = 1;
      return SC.nc.push(taskId).then(function (r) {
        config.failureRate = orig;
        return r;
      });
    },
  };

  console.log('[nc] ready · delay=' + config.delayMin + '-' + config.delayMax + 'ms · failure=' + (config.failureRate * 100) + '%');
})();
