(function () {
  var I = window !== window.top;
  if (window.beacon) beacon('bridge:loaded inFrame=' + I, null, true);
  function nav(u) {
    if (I) {
      try { window.parent.postMessage({ type: 'navigate', url: u }, '*'); } catch (e) {}
      if (window.beacon) beacon('bridge:postMessage->parent ' + u, null, true);
    } else {
      if (window.beacon) beacon('bridge:direct-nav ' + u);
      window.location.href = u;
    }
  }
  window.cbNav = nav;
  if (I) {
    document.addEventListener('pointerdown', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var h = a.getAttribute('href') || '';
      if (!h || h.charAt(0) === '#' || h.indexOf('javascript:') === 0) return;
      a.setAttribute('data-cb-href', h);
      a.setAttribute('href', '#');
    }, true);
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var h = a.getAttribute('data-cb-href');
      if (!h) return;
      e.preventDefault();
      a.setAttribute('href', h);
      a.removeAttribute('data-cb-href');
      if (window.beacon) beacon('bridge:click-intercepted ' + h, null, true);
      nav(h);
    }, true);
  }
})();
