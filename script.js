/* script.js - Mobile Optimized
   - Preloader hide
   - AOS init
   - Smooth scroll that respects sticky navbar
   - Navbar auto-close on mobile when a nav-link is clicked
   - Scroll-to-top visibility & click
   - Mobile-specific enhancements
*/
(() => {
  // Wait until DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    
    // ---- PRELOADER (if you later add it) ----
    const pre = document.getElementById('preloader');
    if (pre) {
      setTimeout(() => {
        pre.classList?.add('preloader-hide');
        setTimeout(() => { pre.style.display = 'none'; }, 420);
      }, 650);
    }
    
    // ---- INIT AOS if available ----
    if (window.AOS) {
      // Adjust AOS settings based on screen size
      const isMobile = window.innerWidth < 768;
      AOS.init({ 
        duration: isMobile ? 600 : 800, 
        once: false, 
        offset: isMobile ? 50 : 120,
        disable: false // Enable on all devices
      });
      
      // Refresh AOS on window resize
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          AOS.refresh();
        }, 250);
      });
    }
    
    // ---- SMOOTH SCROLL for internal anchors (compensate for sticky nav) ----
    const navbar = document.querySelector('.navbar');
    const getNavHeight = () => {
      if (!navbar) return 80;
      const isMobile = window.innerWidth < 768;
      return navbar.getBoundingClientRect().height + (isMobile ? 10 : 8);
    };
    
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
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
          // Only collapse if it's shown (Bootstrap sets .show)
          if (bsCollapse.classList.contains('show')) {
            const instance = bootstrap.Collapse.getInstance(bsCollapse) || new bootstrap.Collapse(bsCollapse, {
              toggle: false
            });
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
          // Small delay for smooth appearance
          setTimeout(() => {
            scrollBtn.style.opacity = '1';
          }, 10);
        } else {
          scrollBtn.style.opacity = '0';
          setTimeout(() => { 
            if (window.scrollY <= showAfter) {
              scrollBtn.style.display = 'none'; 
            }
          }, 220);
        }
      };
      
      setVisibility();
      
      // Throttle scroll event for better performance on mobile
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        if (scrollTimeout) {
          window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
          setVisibility();
        });
      });
      
      scrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    
    // ---- MOBILE-SPECIFIC ENHANCEMENTS ----
    
    // Prevent body width issues
    document.documentElement.style.removeProperty('width');
    document.body.style.removeProperty('width');
    
    // Fix viewport height on mobile browsers (addresses URL bar issues)
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    
    // Improve touch interactions on mobile
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (window.AOS) {
          AOS.refresh();
        }
        setVH();
      }, 200);
    });
    
    // Optimize images loading on mobile
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
    
    // Add active state to navbar links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const highlightNav = () => {
      const scrollPos = window.scrollY + getNavHeight() + 50;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };
    
    // Throttle highlightNav for performance
    let navHighlightTimeout;
    window.addEventListener('scroll', () => {
      if (navHighlightTimeout) {
        window.cancelAnimationFrame(navHighlightTimeout);
      }
      navHighlightTimeout = window.requestAnimationFrame(() => {
        highlightNav();
      });
    });
    
    // Initial highlight
    highlightNav();
    
    // Prevent zoom on double-tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
    
    // Add smooth scroll behavior for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
      const smoothScrollPolyfill = (element, duration = 600) => {
        const target = element.getBoundingClientRect().top + window.pageYOffset - getNavHeight();
        const startPosition = window.pageYOffset;
        const distance = target - startPosition;
        let startTime = null;
        
        const animation = (currentTime) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = ease(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        const ease = (t, b, c, d) => {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        };
        
        requestAnimationFrame(animation);
      };
      
      // Override click handlers if smooth scroll not supported
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              smoothScrollPolyfill(target);
            }
          }
        });
      });
    }
    
    console.log('Portfolio scripts initialized successfully!');
  });
})();