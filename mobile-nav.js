(function(){
  if(window.__cvitMobileNav)return;
  window.__cvitMobileNav=true;

  function init(){
    var navInner=document.querySelector('.cv-nav-inner');
    if(!navInner){setTimeout(init,100);return;}
    if(navInner.querySelector('.cv-burger'))return;

    var children=Array.prototype.slice.call(navInner.children);
    var linksDiv=null,ctaEl=null;

    children.forEach(function(child){
      if(child.querySelector&&child.querySelector('.cv-nav-link'))linksDiv=child;
      if(child.classList&&child.classList.contains('cv-btn-primary'))ctaEl=child;
      if(!ctaEl&&child.querySelector&&child.querySelector('.cv-btn-primary')&&!child.querySelector('.cv-nav-link'))ctaEl=child;
    });

    if(linksDiv)linksDiv.classList.add('cv-nav-links');
    if(ctaEl)ctaEl.classList.add('cv-nav-cta');

    // Create overlay on body to avoid containing-block issues from nav's backdrop-filter
    var overlay=document.createElement('div');
    overlay.className='cv-mobile-overlay';
    overlay.style.cssText='display:none;position:fixed;inset:0;background:rgba(10,10,10,0.99);backdrop-filter:blur(20px);z-index:9999;flex-direction:column;align-items:center;justify-content:center;gap:28px;';
    if(linksDiv){
      var links=linksDiv.querySelectorAll('a');
      links.forEach(function(a){
        var clone=a.cloneNode(true);
        clone.style.cssText='color:#FDFCF7;font-size:22px;font-weight:500;text-decoration:none;';
        overlay.appendChild(clone);
      });
    }
    document.body.appendChild(overlay);

    var burger=document.createElement('button');
    burger.className='cv-burger';
    burger.setAttribute('aria-label','Menu');
    burger.innerHTML='<span></span><span></span><span></span>';
    navInner.appendChild(burger);

    burger.addEventListener('click',function(){
      var opening=!burger.classList.contains('is-open');
      burger.classList.toggle('is-open');
      overlay.style.display=opening?'flex':'none';
      document.body.style.overflow=opening?'hidden':'';
    });

    overlay.addEventListener('click',function(e){
      if(e.target.closest('a')){
        overlay.style.display='none';
        burger.classList.remove('is-open');
        document.body.style.overflow='';
      }
    });
  }

  init();
})();
