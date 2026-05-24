/* 函館らーめん 汐のや ― interactive bits */

(function () {
  'use strict';

  /* ---------- mobile nav toggle ---------- */
  const masthead = document.querySelector('.masthead');
  const toggle   = document.querySelector('.masthead__toggle');
  const navLinks = document.querySelectorAll('.masthead__nav a');

  if (toggle && masthead) {
    toggle.addEventListener('click', () => {
      const isOpen = masthead.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        masthead.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- reveal-on-scroll ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealTargets = document.querySelectorAll(
    '.story__lede, .story__voice, .story__stat, .pillar, .menu__block, .menu__extras-block, .room__card, .access__main, .access__map, .folio'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if (reduceMotion) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- bowl parallax + tilt on hover ---------- */
  const bowl = document.querySelector('.cover__bowl svg');
  const stamp = document.querySelector('.cover__pricestamp');
  if (bowl && !reduceMotion) {
    let raf = null;
    const onMove = (e) => {
      const rect = bowl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        bowl.style.transform = `translate(${dx * -10}px, ${dy * -6}px) rotate(${dx * 1.6}deg)`;
        if (stamp) {
          stamp.style.transform = `rotate(${-12 + dx * 3}deg) translate(${dx * 4}px, ${dy * 3}px)`;
        }
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
  }

  /* ---------- subtle highlight on menu item hover (with rotation) ---------- */
  document.querySelectorAll('.menu__item').forEach((li, idx) => {
    li.addEventListener('mouseenter', () => {
      li.style.transition = 'background .2s ease, padding-left .25s ease';
      li.style.background = 'rgba(217,161,58,0.10)';
      li.style.paddingLeft = '.6rem';
    });
    li.addEventListener('mouseleave', () => {
      li.style.background = '';
      li.style.paddingLeft = '';
    });
  });

  /* ---------- ticker pause on hover ---------- */
  const ticker = document.querySelector('.masthead__ticker-track');
  if (ticker) {
    const parent = ticker.parentElement;
    parent.addEventListener('mouseenter', () => { ticker.style.animationPlayState = 'paused'; });
    parent.addEventListener('mouseleave', () => { ticker.style.animationPlayState = 'running'; });
  }

})();
