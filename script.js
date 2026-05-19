/* ============================================================
   SUPER FARMACIA TODO+SALUD — script.js v2
   Animaciones premium, interactividad y UX mejorada
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CUSTOM CURSOR ── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  if (cursor && window.innerWidth > 1024) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
    const animFollower = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animFollower);
    };
    animFollower();

    // Scale on clickable elements
    document.querySelectorAll('a,button,.pcard,.svc-card,.tcard').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        follower.style.transform = 'translate(-50%,-50%) scale(1.6)';
        follower.style.opacity = '.3';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.opacity = '.6';
      });
    });
  }

  /* ── 2. SCROLL PROGRESS ── */
  const progressBar = document.getElementById('scrollProgress');
  const backTop     = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = `${(scrollTop / docH) * 100}%`;
    if (backTop) backTop.classList.toggle('visible', scrollTop > 400);
  }, { passive: true });

  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── 3. NAVBAR ── */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  allLinks.forEach(l => {
    l.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const onScroll = () => {
    const y = window.scrollY + 130;
    sections.forEach(sec => {
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        allLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 4. NAV SEARCH ── */
  const navSearchBtn = document.getElementById('navSearchBtn');
  const navSearchBar = document.getElementById('navSearchBar');
  const searchClose  = document.getElementById('searchClose');
  const searchInput  = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const allProducts = [
    { name: 'Analgésicos y Antifebriles', cat: 'medicamentos', sec: '#productos' },
    { name: 'Antibióticos', cat: 'medicamentos', sec: '#productos' },
    { name: 'Antihipertensivos', cat: 'medicamentos', sec: '#productos' },
    { name: 'Antidiabéticos', cat: 'medicamentos', sec: '#productos' },
    { name: 'Vitamina C + Zinc', cat: 'vitaminas', sec: '#productos' },
    { name: 'Vitamina D3', cat: 'vitaminas', sec: '#productos' },
    { name: 'Multivitamínicos', cat: 'vitaminas', sec: '#productos' },
    { name: 'Omega 3', cat: 'vitaminas', sec: '#productos' },
    { name: 'Cuidado Facial', cat: 'cuidado', sec: '#productos' },
    { name: 'Higiene Personal', cat: 'cuidado', sec: '#productos' },
    { name: 'Pañales y Toallitas', cat: 'bebe', sec: '#productos' },
    { name: 'Fórmulas Infantiles', cat: 'bebe', sec: '#productos' },
  ];

  const openSearch = () => {
    navSearchBar.classList.add('open');
    setTimeout(() => searchInput.focus(), 350);
  };
  const closeSearch = () => {
    navSearchBar.classList.remove('open');
    searchInput.value = '';
    searchResults.innerHTML = '';
  };

  navSearchBtn?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    if (!q) return;
    const hits = allProducts.filter(p => p.name.toLowerCase().includes(q));
    if (hits.length === 0) {
      searchResults.innerHTML = '<span class="s-no-result">Sin resultados. ¡Consúltanos directamente!</span>';
      return;
    }
    hits.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 's-result-chip';
      btn.textContent = p.name;
      btn.addEventListener('click', () => {
        closeSearch();
        document.querySelector(p.sec)?.scrollIntoView({ behavior: 'smooth' });
        // activate tab
        setTimeout(() => {
          const tab = document.querySelector(`.ptab[data-tab="${p.cat}"]`);
          if (tab) tab.click();
        }, 700);
      });
      searchResults.appendChild(btn);
    });
  });

  /* ── 5. HERO CANVAS PARTICLES ── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 2.5 + .5;
        this.vx = (Math.random() - .5) * .4;
        this.vy = (Math.random() - .5) * .4;
        this.alpha = Math.random() * .5 + .1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 55; i++) particles.push(new Particle());

    // Connect close particles
    const connect = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${.06 * (1 - dist/100)})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
    };

    const animCanvas = () => {
      ctx.clearRect(0, 0, W, H);
      connect();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animCanvas);
    };
    animCanvas();
  }

  /* ── 6. HERO COUNTERS (instant run) ── */
  const heroCounters = document.querySelectorAll('.count-hero');
  const runHeroCounters = () => {
    heroCounters.forEach(el => {
      const target = parseInt(el.dataset.target);
      let curr = 0;
      const step = () => {
        curr = Math.min(curr + Math.ceil(target / 60), target);
        el.textContent = curr.toLocaleString('es-MX') + (curr >= target ? '+' : '');
        if (curr < target) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  // Run after a small delay to allow animation in
  setTimeout(runHeroCounters, 800);

  /* ── 7. INTERSECTION OBSERVER — reveal ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── 8. COUNTER ANIMATION ── */
  let countersRan = false;
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersRan) {
        countersRan = true;
        document.querySelectorAll('.counter').forEach(el => {
          const target = parseInt(el.dataset.target);
          let curr = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const step = () => {
            curr = Math.min(curr + increment, target);
            el.textContent = Math.floor(curr).toLocaleString('es-MX');
            if (curr < target) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
        counterObs.disconnect();
      }
    });
  }, { threshold: .3 });

  const statsBelt = document.querySelector('.stats-belt');
  if (statsBelt) counterObs.observe(statsBelt);

  /* ── 9. PRODUCT SEARCH + FILTER ── */
  const prodSearch = document.getElementById('prodSearch');
  const ptabs      = document.querySelectorAll('.ptab');
  const pcards     = document.querySelectorAll('.pcard');
  const noResults  = document.getElementById('noResults');
  let activeTab    = 'todos';

  const filterProducts = () => {
    const q = prodSearch ? prodSearch.value.trim().toLowerCase() : '';
    let visible = 0;

    pcards.forEach((card, i) => {
      const cat  = card.dataset.category;
      const name = card.dataset.name || '';
      const matchTab  = activeTab === 'todos' || cat === activeTab;
      const matchQuery = !q || name.includes(q) || card.querySelector('h4').textContent.toLowerCase().includes(q);

      if (matchTab && matchQuery) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity .4s ease, transform .4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 55);
        visible++;
      } else {
        card.classList.add('hidden');
        card.style.opacity = '';
        card.style.transform = '';
        card.style.transition = '';
      }
    });

    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  };

  ptabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ptabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      filterProducts();
    });
  });

  prodSearch?.addEventListener('input', filterProducts);

  /* ── 10. TESTIMONIALS SLIDER ── */
  const ttrack = document.getElementById('ttrack');
  const tcards = document.querySelectorAll('.tcard');
  const tdots  = document.getElementById('tdots');
  const tPrev  = document.getElementById('tPrev');
  const tNext  = document.getElementById('tNext');

  if (ttrack && tcards.length > 0) {
    let idx = 0;
    const getVis = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

    const buildDots = () => {
      const vis = getVis();
      const max = Math.ceil(tcards.length / vis);
      tdots.innerHTML = '';
      for (let i = 0; i < max; i++) {
        const d = document.createElement('button');
        d.className = `tdot${i === idx ? ' active' : ''}`;
        d.setAttribute('aria-label', `Slide ${i+1}`);
        d.addEventListener('click', () => goTo(i));
        tdots.appendChild(d);
      }
    };

    const updateDots = () => {
      document.querySelectorAll('.tdot').forEach((d, i) => d.classList.toggle('active', i === idx));
    };

    const goTo = (i) => {
      const vis = getVis();
      const max = Math.ceil(tcards.length / vis) - 1;
      idx = Math.max(0, Math.min(i, max));
      const w = tcards[0].offsetWidth + 24;
      ttrack.style.transform = `translateX(-${idx * vis * w}px)`;
      updateDots();
    };

    tPrev?.addEventListener('click', () => goTo(idx - 1));
    tNext?.addEventListener('click', () => goTo(idx + 1));

    // Touch swipe
    let tsx = 0;
    ttrack.addEventListener('touchstart', e => { tsx = e.touches[0].clientX; }, { passive: true });
    ttrack.addEventListener('touchend', e => {
      const diff = tsx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(idx + 1) : goTo(idx - 1);
    });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') goTo(idx - 1);
      if (e.key === 'ArrowRight') goTo(idx + 1);
    });

    // Auto play
    let auto = setInterval(() => {
      const vis = getVis();
      const max = Math.ceil(tcards.length / vis) - 1;
      goTo(idx >= max ? 0 : idx + 1);
    }, 5000);

    ttrack.addEventListener('mouseenter', () => clearInterval(auto));
    ttrack.addEventListener('mouseleave', () => {
      const vis = getVis();
      const max = Math.ceil(tcards.length / vis) - 1;
      auto = setInterval(() => goTo(idx >= max ? 0 : idx + 1), 5000);
    });

    buildDots();
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
  }

  /* ── 11. OPEN STATUS ── */
  const openStatus = document.getElementById('openStatus');
  const openPill   = document.getElementById('openPill');

  if (openStatus) {
    const now  = new Date();
    const day  = now.getDay();
    const time = now.getHours() + now.getMinutes() / 60;
    let open   = false;

    if (day >= 1 && day <= 5) open = time >= 8 && time < 20;
    else if (day === 6)        open = time >= 8 && time < 18;
    else                       open = time >= 9 && time < 15;

    if (open) {
      openStatus.textContent = '¡Abierto ahora!';
    } else {
      openStatus.textContent = 'Cerrado en este momento';
      openPill?.classList.add('closed');
    }
  }

  /* ── 12. CONTACT FORM ── */
  const form      = document.getElementById('contactForm');
  const formOk    = document.getElementById('formOk');
  const submitBtn = document.getElementById('submitBtn');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const fields = ['nombre','telefono','asunto','mensaje'];
    let valid = true;

    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const wrap = el.closest('.cinput-wrap') || el;
      el.style.borderColor = '';
      if (!el.value.trim()) {
        valid = false;
        // Mark as error
        if (el.closest('.cinput-wrap')) {
          el.closest('.cinput-wrap').style.borderColor = '#ef4444';
          el.closest('.cinput-wrap').style.boxShadow = '0 0 0 4px rgba(239,68,68,.1)';
        } else {
          el.style.borderColor = '#ef4444';
        }
      }
    });

    if (!valid) {
      // Shake
      form.animate([
        {transform:'translateX(0)'},{transform:'translateX(-8px)'},
        {transform:'translateX(8px)'},{transform:'translateX(-6px)'},
        {transform:'translateX(6px)'},{transform:'translateX(0)'}
      ], {duration:400, easing:'ease'});
      return;
    }

    // Simulate send
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Enviando...';
    submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';

    setTimeout(() => {
      submitBtn.style.display = 'none';
      formOk.classList.add('show');
      form.reset();
      // Reset border colors
      document.querySelectorAll('.cinput-wrap').forEach(w => {
        w.style.borderColor = '';
        w.style.boxShadow = '';
      });
    }, 1600);
  });

  /* ── 13. CARD 3D TILT ── */
  if (window.innerWidth > 1024) {
    document.querySelectorAll('.svc-card,.nos-feat,.oferta-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const x  = e.clientX - r.left - r.width  / 2;
        const y  = e.clientY - r.top  - r.height / 2;
        const tx = -(y / r.height) * 5;
        const ty =  (x / r.width)  * 5;
        card.style.transform = `translateY(-10px) perspective(600px) rotateX(${tx}deg) rotateY(${ty}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .45s ease';
        setTimeout(() => card.style.transition = '', 450);
      });
    });
  }

  /* ── 14. RIPPLE on buttons ── */
  document.querySelectorAll('.btn-hero-primary,.btn-submit,.btn-map,.btn-oferta,.nav-cta').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function(e) {
      const r = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;
        background:rgba(255,255,255,0.3);
        width:${size}px;height:${size}px;
        left:${e.clientX - r.left - size/2}px;
        top:${e.clientY - r.top  - size/2}px;
        animation:ripple .65s ease-out forwards;
        pointer-events:none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const rs = document.createElement('style');
  rs.textContent = `@keyframes ripple{from{transform:scale(0);opacity:1}to{transform:scale(1);opacity:0}}`;
  document.head.appendChild(rs);

  /* ── 15. PARALLAX on hero shapes ── */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy < window.innerHeight) {
        const mesh = hero.querySelector('.hero-mesh');
        if (mesh) mesh.style.transform = `translateY(${sy * .25}px)`;
      }
    }, { passive: true });
  }

  /* ── 16. PRODUCT CARD OBSERVER (stagger) ── */
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.pcard').forEach(c => cardObs.observe(c));

  /* ── 17. FOOTER LOGO → back top ── */
  document.querySelector('.footer-logo')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 18. SMOOTH AOS-LIKE for hero ── */
  document.querySelectorAll('[data-aos]').forEach((el, i) => {
    const delay = parseInt(el.dataset.aosDelay || 0);
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    setTimeout(() => {
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, delay + 200);
  });

  /* ── 19. TYPING EFFECT on nav brand (subtle) ── */
  // No-op placeholder — kept minimal for performance

  /* ── 20. DECORATION CONSOLE ── */
  console.log('%c💊 Super Farmacia Todo+Salud', 'color:#1B5FB5;font-size:22px;font-weight:900;font-family:sans-serif');
  console.log('%c✅ Tu salud, nuestra misión.', 'color:#E85514;font-size:13px');
  console.log('%c🚀 Landing v2 – Diseño mejorado', 'color:#16a34a;font-size:11px');

});
/* ── CUSTOM SELECT ── */
const trigger   = document.getElementById('customSelectTrigger');
const dropdown  = document.getElementById('customSelectDropdown');
const selectText= document.getElementById('customSelectText');
const hiddenSel = document.getElementById('asunto');
const options   = document.querySelectorAll('.custom-option');

trigger?.addEventListener('click', () => {
  trigger.classList.toggle('open');
  dropdown.classList.toggle('open');
});

options.forEach(opt => {
  opt.addEventListener('click', () => {
    const val   = opt.dataset.value;
    const label = opt.textContent.trim();

    if (!val) return; // ignorar "Selecciona un tema"

    // Actualizar texto visible
    selectText.textContent = label;
    trigger.classList.add('selected');

    // Marcar opción activa
    options.forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');

    // Sincronizar con select oculto
    hiddenSel.value = val;

    // Cerrar
    trigger.classList.remove('open');
    dropdown.classList.remove('open');

    // Quitar error si lo había
    trigger.style.borderColor = '';
    trigger.style.boxShadow   = '';
  });
});

// Cerrar al hacer click fuera
document.addEventListener('click', e => {
  if (!document.getElementById('customSelectWrap')?.contains(e.target)) {
    trigger?.classList.remove('open');
    dropdown?.classList.remove('open');
  }
});