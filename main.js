(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d = document, root = d.documentElement;

  // Kopfzeile: Zustand beim Scrollen
  var hd = d.querySelector('.hd');
  function onScroll(){ if(hd) hd.classList.toggle('scrolled', window.scrollY > 12); }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // Mobiles Menü
  var burger = d.querySelector('.burger');
  if(burger){
    burger.addEventListener('click', function(){
      var open = d.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
    });
    d.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && d.body.classList.contains('menu-open')){
        d.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded','false'); burger.focus();
      }
    });
  }

  // Einblenden beim Scrollen
  var rv = d.querySelectorAll('.rv');
  if(reduce || !('IntersectionObserver' in window)){
    rv.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(en){
      en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } });
    }, {threshold:.15, rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(el){ io.observe(el); });
  }

  // Zeitleiste füllt sich beim Scrollen
  d.querySelectorAll('.tl').forEach(function(tl){
    function fill(){
      var r = tl.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh*0.7 - r.top) / r.height));
      tl.style.setProperty('--tlh', (reduce ? 100 : p*100) + '%');
    }
    fill(); if(!reduce) window.addEventListener('scroll', fill, {passive:true});
  });

  // Hero: Streifen im Hintergrund bewegen sich leicht mit
  var hero = d.querySelector('.hero');
  if(hero && !reduce){
    var tick = false;
    window.addEventListener('scroll', function(){
      if(tick) return; tick = true;
      requestAnimationFrame(function(){
        hero.style.setProperty('--py', Math.min(60, window.scrollY*.08) + 'px'); tick = false;
      });
    }, {passive:true});
  }

  // Menü mit Auswahl: Pfeil öffnet und schliesst (Touch und Tastatur)
  d.querySelectorAll('.dd .chev').forEach(function(b){
    b.addEventListener('click', function(){
      var dd = b.parentNode, o = dd.classList.toggle('open');
      b.setAttribute('aria-expanded', o);
    });
  });
  d.addEventListener('click', function(e){
    d.querySelectorAll('.dd.open').forEach(function(dd){ if(!dd.contains(e.target)) dd.classList.remove('open'); });
  });

  // Seitenwechsel: sanft ausblenden
  d.querySelectorAll('a[href]').forEach(function(a){
    var h = a.getAttribute('href');
    if(!h || h.charAt(0)==='#' || /^(https?:|mailto:|tel:)/.test(h) || a.target==='_blank' || a.hasAttribute('download')) return;
    a.addEventListener('click', function(e){
      if(reduce || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      d.body.classList.add('leaving');
      setTimeout(function(){ location.href = h; }, 320);
    });
  });
  window.addEventListener('pageshow', function(e){ if(e.persisted) d.body.classList.remove('leaving'); });

  // Kontaktformular: Entwurf, kein Versand
  var f = d.querySelector('form[data-demo]');
  if(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var n = f.querySelector('.note'); if(n) n.classList.add('show');
    });
  }

  var y = d.getElementById('yr'); if(y) y.textContent = new Date().getFullYear();
})();
