/**
 * KAILANG DESIGN Portfolio
 * Vanilla JS — no dependencies
 */

(function () {
  'use strict';

  // Category configuration
  const categories = [
    { key: 'svg-tweets', folder: 'images/svg-tweets', titleEn: 'SVG Tweets', titleCn: 'SVG推文' },
    { key: 'product-posters', folder: 'images/product-posters', titleEn: 'Product Posters', titleCn: '产品海报' },
    { key: 'brand-kv', folder: 'images/brand-kv', titleEn: 'Brand KV', titleCn: '品牌KV' }
  ];

  // Build portfolio sections
  function buildPortfolio() {
    const main = document.querySelector('.main');
    const footer = document.querySelector('.footer');

    categories.forEach((cat, index) => {
      const files = portfolio[cat.key] || [];
      if (files.length === 0) return;

      // Section divider
      if (index > 0) {
        const divider = document.createElement('div');
        divider.className = 'section-divider';
        main.insertBefore(divider, footer);
      }

      // Section container
      const section = document.createElement('section');
      section.className = 'portfolio-section';
      section.id = cat.key;

      // Title
      const title = document.createElement('h2');
      title.className = 'section-title';
      title.innerHTML = `${cat.titleEn} <span class="cn">${cat.titleCn}</span>`;
      section.appendChild(title);

      // Grid
      const grid = document.createElement('div');
      if (cat.key === 'brand-kv') {
        grid.className = 'grid grid-kv';
      } else {
        grid.className = cat.key === 'svg-tweets' ? 'grid grid-fixed' : 'grid grid-flex';
      }

      files.forEach((file) => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = `${cat.folder}/${file}`;
        img.alt = `${cat.titleCn}`;
        img.loading = 'lazy';

        img.addEventListener('load', function () {
          const ratio = img.naturalHeight / img.naturalWidth;

          if (grid.classList.contains('grid-flex')) {
            const rowHeight = 10;
            const gapSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-gap')) || 16;
            const colWidth = card.offsetWidth;
            const imgDisplayHeight = colWidth * ratio;
            const rowSpan = Math.ceil((imgDisplayHeight + gapSize) / (rowHeight + gapSize));
            card.style.gridRowEnd = `span ${rowSpan}`;
          }

          if (ratio > 2.0) {
            card.classList.add('tall');
            requestAnimationFrame(function () {
              const containerHeight = card.offsetHeight;
              const displayedImgHeight = card.offsetWidth * ratio;
              const overflow = displayedImgHeight - containerHeight;
              if (overflow > 0) {
                card.dataset.overflow = overflow;
                card.dataset.scrollPos = 0;
                card.dataset.hovered = 'false';
                startAutoScroll(card, img);
              }
            });
          }
        });

        card.addEventListener('mouseenter', function () {
          card.dataset.hovered = 'true';
        });

        card.addEventListener('mouseleave', function () {
          card.dataset.hovered = 'false';
        });

        card.addEventListener('wheel', function (e) {
          if (!card.classList.contains('tall')) return;
          e.preventDefault();
          const overflow = parseFloat(card.dataset.overflow) || 0;
          if (overflow <= 0) return;
          let pos = parseFloat(card.dataset.scrollPos) || 0;
          pos += e.deltaY * 0.5;
          pos = Math.max(0, Math.min(pos, overflow));
          card.dataset.scrollPos = pos;
          img.style.transform = `translateY(-${pos}px)`;
        }, { passive: false });

        card.appendChild(img);
        grid.appendChild(card);
      });

      section.appendChild(grid);
      main.insertBefore(section, footer);
    });

    initScrollReveal();
  }

  let tallCardIndex = 0;

  function startAutoScroll(card, img) {
    const baseSpeed = 0.2;
    const speedVariation = [1.0, 0.7, 1.3, 0.9, 1.1, 0.8];
    const myIndex = tallCardIndex++;
    const speed = baseSpeed * (speedVariation[myIndex % speedVariation.length]);

    const overflow = parseFloat(card.dataset.overflow) || 0;
    const startPos = overflow * (myIndex % 3) * 0.2;
    card.dataset.scrollPos = startPos;
    img.style.transform = `translateY(-${startPos}px)`;

    let direction = 1;
    let isInView = false;

    const viewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isInView = entry.intersectionRatio >= 0.75;
      });
    }, { threshold: [0.75] });
    viewObserver.observe(card);

    function animate() {
      if (card.dataset.hovered === 'false' && isInView) {
        let pos = parseFloat(card.dataset.scrollPos) || 0;
        pos += speed * direction;

        if (pos >= overflow) {
          pos = overflow;
          direction = -1;
        } else if (pos <= 0) {
          pos = 0;
          direction = 1;
        }

        card.dataset.scrollPos = pos;
        img.style.transform = `translateY(-${pos}px)`;
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  function initScrollReveal() {
    const cards = document.querySelectorAll('.card');
    if (!('IntersectionObserver' in window)) {
      cards.forEach(card => card.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const grid = card.parentElement;
          const siblings = Array.from(grid.children);
          const index = siblings.indexOf(card);
          const delay = (index % 4) * 80;

          setTimeout(() => {
            card.classList.add('visible');
          }, delay);

          observer.unobserve(card);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    cards.forEach(card => observer.observe(card));
  }

  function handleResize() {
    const tallCards = document.querySelectorAll('.card.tall');
    tallCards.forEach(card => {
      const img = card.querySelector('img');
      if (img && img.naturalHeight) {
        const ratio = img.naturalHeight / img.naturalWidth;
        const containerHeight = card.offsetHeight;
        const displayedImgHeight = card.offsetWidth * ratio;
        const overflow = displayedImgHeight - containerHeight;
        if (overflow > 0) {
          card.dataset.overflow = overflow;
          let pos = parseFloat(card.dataset.scrollPos) || 0;
          pos = Math.min(pos, overflow);
          card.dataset.scrollPos = pos;
          img.style.transform = `translateY(-${pos}px)`;
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildPortfolio();
    window.addEventListener('resize', debounce(handleResize, 200));
  });

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
})();
