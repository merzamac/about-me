(function () {
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* progress bar + header shadow */
  var bar = document.getElementById('progressBar');
  var header = document.getElementById('header');
  function onScroll() {
    var d = document.documentElement;
    var p = d.scrollTop / (d.scrollHeight - d.clientHeight || 1);
    bar.style.transform = 'scaleX(' + p + ')';
    header.classList.toggle('scrolled', d.scrollTop > 8);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* reveal on scroll */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

  /* scrollspy */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var spyObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  navLinks.forEach(function (a) {
    var s = document.querySelector(a.getAttribute('href'));
    if (s) spyObs.observe(s);
  });

  /* typewriter tagline */
  var tw = document.getElementById('tagline');
  var full = tw.textContent;
  if (!RM) {
    tw.textContent = '';
    tw.classList.add('typing');
    var i = 0;
    var timer = setInterval(function () {
      tw.textContent = full.slice(0, ++i);
      if (i >= full.length) { clearInterval(timer); tw.classList.remove('typing'); }
    }, 32);
    addEventListener('beforeprint', function () {
      clearInterval(timer); tw.textContent = full; tw.classList.remove('typing');
    });
  }

  /* animated counters */
  function fmt(n) { return n.toLocaleString('es-VE'); }
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      countObs.unobserve(e.target);
      var el = e.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var prefix = el.getAttribute('data-prefix') || '';
      if (RM) return;
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = prefix + fmt(v);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { countObs.observe(el); });

  /* button ripple */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('.btn');
    if (!b || RM) return;
    var r = document.createElement('span');
    r.className = 'ripple';
    var rect = b.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size + 'px';
    r.style.left = (ev.clientX - rect.left - size / 2) + 'px';
    r.style.top = (ev.clientY - rect.top - size / 2) + 'px';
    b.appendChild(r);
    setTimeout(function () { r.remove(); }, 600);
  });
  /* forced download for a[download] (browsers ignore the attribute on file://) */
  document.querySelectorAll('a[download]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var href = a.getAttribute('href');
      ev.preventDefault();
      fetch(href)
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          return res.blob();
        })
        .then(function (blob) {
          var url = URL.createObjectURL(blob);
          var t = document.createElement('a');
          t.href = url;
          t.download = href.split('/').pop();
          document.body.appendChild(t);
          t.click();
          t.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 15000);
        })
        .catch(function () {
          location.href = href;
        });
    });
  });
})();
