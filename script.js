/* script.js
   - Preloader hide
   - AOS init
   - Smooth scroll that respects sticky navbar
   - Navbar auto-close on mobile when a nav-link is clicked
   - Scroll-to-top visibility & click
*/

(() => {
  // Wait until DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // ---- PRELOADER (if you later add it) ----
    const pre = document.getElementById('preloader');
    if (pre) {
      // keep visible just a moment for UX
      setTimeout(() => {
        pre.classList?.add('preloader-hide');
        setTimeout(() => { pre.style.display = 'none'; }, 420);
      }, 650);
    }

    // ---- INIT AOS if available ----
    if (window.AOS) {
      AOS.init({ duration: 700, once: true, offset: 120 });
    }

    // ---- SMOOTH SCROLL for internal anchors (compensate for sticky nav) ----
    const navbar = document.querySelector('.navbar');
    const getNavHeight = () => navbar ? navbar.getBoundingClientRect().height + 8 : 80;

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        // allow external links or buttons to behave normally
        const href = a.getAttribute('href');
        if (!href || href === '#' || href.indexOf('#') !== 0) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - getNavHeight();
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    // ---- NAVBAR AUTO CLOSE on mobile after click ----
    const bsCollapse = document.querySelector('.navbar-collapse');
    if (bsCollapse) {
      bsCollapse.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          // only collapse if it's shown (Bootstrap sets .show)
          if (bsCollapse.classList.contains('show')) {
            const instance = bootstrap.Collapse.getInstance(bsCollapse) || new bootstrap.Collapse(bsCollapse);
            instance.hide();
          }
        });
      });
    }

    // ---- SCROLL-TO-TOP BUTTON ----
    const scrollBtn = document.getElementById('scrollToTopBtn') || document.querySelector('.scroll-btn');
    if (scrollBtn) {
      const showAfter = 260;
      const setVisibility = () => {
        if (window.scrollY > showAfter) {
          scrollBtn.style.display = 'flex';
          scrollBtn.style.opacity = '1';
        } else {
          scrollBtn.style.opacity = '0';
          setTimeout(() => { if (window.scrollY <= showAfter) scrollBtn.style.display = 'none'; }, 220);
        }
      };
      setVisibility();
      window.addEventListener('scroll', setVisibility);
      scrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // small defensive fix: remove any inline width on body that may be set by accidental CSS
    document.documentElement.style.removeProperty('width');
    document.body.style.removeProperty('width');
  });
})();
