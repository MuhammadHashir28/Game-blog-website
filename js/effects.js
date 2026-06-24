(() => {
  const root = document.documentElement;
  const tiltSurfaces = [...document.querySelectorAll('.tilt-surface')];
  const revealTargets = [...document.querySelectorAll('.hero-copy, .page-hero > div, .video-copy, .article-card, .intel-card, .contact-card, .purchase-card, .trailer-panel, .feature-card, .store-card, .package-grid article, .timeline > div, .stat-grid article, .gallery img, .news-panel, .news-card, .poster-card')];

  const supportsMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  const setScrollVars = () => {
    const y = window.scrollY || 0;
    root.style.setProperty('--scroll-y', String(y));
    root.style.setProperty('--scroll-01', String(Math.min(y / 1000, 1)));
  };

  const onMove = (event, surface) => {
    if (!supportsMotion || !surface) return;
    const r = surface.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width - 0.5;
    const py = (event.clientY - r.top) / r.height - 0.5;
    surface.style.setProperty('--tilt-x', `${(py * -8).toFixed(2)}deg`);
    surface.style.setProperty('--tilt-y', `${(px * 8).toFixed(2)}deg`);
  };

  setScrollVars();
  window.addEventListener('scroll', setScrollVars, { passive: true });

  const observer = supportsMotion && 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }
  }, { threshold: 0.18 }) : null;

  revealTargets.forEach((el) => {
    el.classList.add('reveal');
    if (observer) observer.observe(el);
    else el.classList.add('is-visible');
  });

  tiltSurfaces.forEach((surface) => {
    if (!supportsMotion) return;
    surface.addEventListener('pointermove', (event) => onMove(event, surface));
    surface.addEventListener('pointerleave', () => {
      surface.style.setProperty('--tilt-x', '0deg');
      surface.style.setProperty('--tilt-y', '0deg');
    });
  });
})();
