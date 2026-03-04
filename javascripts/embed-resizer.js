(function () {
  window.addEventListener('message', function (event) {
    var h = event.data && event.data.frameHeight;
    if (!h || h <= 0) return;
    var iframes = document.querySelectorAll('iframe[src*="r2.dev"]');
    iframes.forEach(function (iframe) {
      try {
        if (iframe.contentWindow === event.source) {
          iframe.style.height = (h + 1) + 'px';
        }
      } catch (e) {}
    });
  });
})();
