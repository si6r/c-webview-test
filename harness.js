(function () {
  function rnd() { return Math.random().toString(36).slice(2, 7); }
  var page = (location.pathname.split('/').pop() || 'page').replace(/\.html$/, '');
  window.SID = page + '-' + rnd();

  window.getParam = function (k, d) {
    try { var v = new URLSearchParams(location.search).get(k); return v == null ? d : v; }
    catch (e) { return d; }
  };

  var panel;
  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.style.cssText =
      'position:fixed;top:0;left:0;right:0;z-index:2147483647;' +
      'background:rgba(0,0,0,.88);color:#fff;font:12px/1.45 monospace;' +
      'padding:6px 8px;max-height:48%;overflow:auto;white-space:pre-wrap;' +
      '-webkit-overflow-scrolling:touch;box-shadow:0 2px 8px rgba(0,0,0,.5)';
    var head = document.createElement('div');
    head.textContent = 'LOG · ' + window.SID + ' · ' +
      ((window.BEACON_URL && window.BEACON_URL.indexOf('REPLACE-ME') === -1) ? 'beacon ON' : 'beacon OFF');
    head.style.cssText = 'color:#ffd43b;border-bottom:1px solid #444;margin-bottom:4px;padding-bottom:3px';
    panel.appendChild(head);
    (document.body || document.documentElement).appendChild(panel);
    return panel;
  }

  window.logOnScreen = function (step, extra, ok) {
    try {
      ensurePanel();
      var line = document.createElement('div');
      var mark = ok === true ? '✅ ' : ok === false ? '❌ ' : '• ';
      line.textContent = mark + new Date().toISOString().slice(11, 23) + '  ' + step + (extra ? ('  ' + extra) : '');
      if (ok === false) line.style.color = '#ff6b6b';
      else if (ok === true) line.style.color = '#51cf66';
      panel.appendChild(line);
      panel.scrollTop = panel.scrollHeight;
    } catch (e) {}
  };

  window.beacon = function (step, extra, ok) {
    try {
      var u = window.BEACON_URL || '';
      if (u && u.indexOf('REPLACE-ME') === -1) {
        var img = new Image();
        img.src = u + (u.indexOf('?') > -1 ? '&' : '?') +
          'sid=' + encodeURIComponent(window.SID) +
          '&step=' + encodeURIComponent(step) +
          '&t=' + Date.now() +
          (extra ? ('&x=' + encodeURIComponent(extra)) : '') +
          (ok === true ? '&ok=1' : ok === false ? '&ok=0' : '');
      }
    } catch (e) {}
    window.logOnScreen(step, extra, ok);
  };
})();
