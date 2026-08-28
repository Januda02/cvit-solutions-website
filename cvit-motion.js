(function(){
  if (window.__cvitMotion) return; window.__cvitMotion = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  var seen = new WeakSet();
  function scan(){
    document.querySelectorAll('.cv-reveal, .cv-reveal-lg, .cv-reveal-scale').forEach(function(el){
      if (seen.has(el)) return;
      seen.add(el);
      io.observe(el);
    });
  }

  // Mouse tracking (normalized -1..1 relative to viewport center)
  var mx = 0, my = 0, tmx = 0, tmy = 0;
  window.addEventListener('mousemove', function(e){
    tmx = (e.clientX / window.innerWidth) * 2 - 1;
    tmy = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function apply(){
    // Smooth interpolate mouse
    mx += (tmx - mx) * 0.08;
    my += (tmy - my) * 0.08;

    var y = window.scrollY || window.pageYOffset;
    var nav = document.querySelector('.cv-nav');
    if (nav){ nav.classList.toggle('is-compact', y > 40); }
    var progress = document.querySelector('.cv-progress');
    if (progress){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? Math.min(100, (y / h) * 100) : 0;
      progress.style.width = pct + '%';
    }

    if (!reduce){
      var hero3d = document.querySelector('[data-hero-3d-inner]');
      if (hero3d){
        var rotY = y * 0.35 + mx * 35;
        var rotX = -18 + Math.sin(y * 0.004) * 6 + (-my * 22);
        var sc = 1 + Math.min(0.5, y * 0.0009);
        hero3d.style.transform = 'translate(-50%,-50%) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      }
      var wrap = document.querySelector('[data-hero-3d]');
      if (wrap){
        // subtle counter-drift on the container so it feels parallax-y
        wrap.style.transform = 'translate3d(' + (mx * 6).toFixed(2) + 'px,' + (my * 4).toFixed(2) + 'px,0)';
      }

      var heroStage = document.querySelector('[data-hero-stage]');
      if (heroStage){
        var rect2 = heroStage.getBoundingClientRect();
        var ph = Math.max(0, Math.min(1, -rect2.top / (rect2.height || 1)));
        var laptop = heroStage.querySelector('[data-hero-laptop]');
        if (laptop){ laptop.style.transform = 'translateX(-50%) translateY(' + (ph * -30) + 'px) scale(' + (1 - ph * 0.06) + ')'; }
        var glow = heroStage.querySelector('[data-hero-glow]');
        if (glow){ glow.style.transform = 'translateX(-50%) translateY(' + (ph * 40) + 'px)'; glow.style.opacity = String(1 - ph * 0.4); }
        var heroText = document.querySelector('[data-hero-text]');
        if (heroText){ heroText.style.transform = 'translateY(' + (ph * -20) + 'px)'; heroText.style.opacity = String(Math.max(0.4, 1 - ph * 0.7)); }
      }
    }
    requestAnimationFrame(apply);
  }
  requestAnimationFrame(apply);

  var mo = new MutationObserver(function(){ scan(); });
  function start(){
    scan();
    if (document.body){ mo.observe(document.body, { childList: true, subtree: true }); }
  }
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', start); } else { start(); }
  window.addEventListener('load', function(){ scan(); });
})();
