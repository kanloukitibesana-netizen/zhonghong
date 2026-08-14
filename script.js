
document.addEventListener('DOMContentLoaded', () => {

  /*  MENU MOBILE */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const backdrop = document.querySelector('.menu-backdrop');
  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    if (backdrop) backdrop.classList.remove('open');
  }
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      if (backdrop) backdrop.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    if (backdrop) backdrop.addEventListener('click', closeMenu);
  }

  /*  LIEN NAV ACTIF */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });

  /*  REVEAL AU SCROLL  */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /*  COMPTEURS ANIMÉS (stats)  */
  const counters = document.querySelectorAll('.num[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObserver.observe(el));

  /*  BARRES DE BATTERIE (autonomie)  */
  const bars = document.querySelectorAll('.battery-fill[data-fill]');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.fill + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(el => barObserver.observe(el));

  /* TILT 3D (cartes moto / features)  */
  const tiltCards = document.querySelectorAll('.moto-card, .feature-card');
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (!isTouchDevice) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /*  FILTRES CATALOGUE  */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const motoCards = document.querySelectorAll('.moto-card');
  if (filterBtns.length && motoCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        motoCards.forEach(card => {
          const match = filter === 'all' || card.dataset.type === filter;
          card.style.display = match ? 'flex' : 'none';
        });
      });
    });
  }

  /* NAVBAR AU SCROLL (ombre)  */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
      else navbar.style.boxShadow = 'none';
    });
  }


  /* GALERIE DES MODÈLES — AJOUT UNIQUEMENT
      */
  const galleryRoot = document.getElementById('zh-gallery');
  const galleryImage = document.getElementById('zh-gallery-image');
  const galleryTitle = document.getElementById('zh-gallery-title');
  const galleryCounter = document.getElementById('zh-gallery-counter');
  const galleryThumbs = document.getElementById('zh-gallery-thumbs');
  const galleryPrev = document.querySelector('.zh-gallery-prev');
  const galleryNext = document.querySelector('.zh-gallery-next');

  let zhGalleryImages = [];
  let zhGalleryIndex = 0;
  let zhGalleryTitle = '';
  let zhGalleryTouchStartX = 0;

  function zhBaseName(src) {
    const clean = src.split('?')[0];
    const slash = clean.lastIndexOf('/');
    const dir = slash >= 0 ? clean.slice(0, slash + 1) : '';
    const file = slash >= 0 ? clean.slice(slash + 1) : clean;
    const dot = file.lastIndexOf('.');
    if (dot === -1) return { dir, name: file, ext: '' };
    return { dir, name: file.slice(0, dot), ext: file.slice(dot) };
  }

  /*
     Pour chaque carte, la photo actuelle reste inchangée.
     Tu ajoutes ensuite les photos de la galerie avec le même nom :
       moto6.jpg
       moto6-2.jpg
       moto6-3.jpg
       moto6-4.jpg
       moto6-5.jpg
       ...
     Le JS détecte automatiquement les fichiers qui existent.
  */
  function zhFindGalleryImages(mainSrc, done) {
    const base = zhBaseName(mainSrc);
    const candidates = [mainSrc];

    for (let i = 2; i <= 20; i++) {
      candidates.push(`${base.dir}${base.name}-${i}${base.ext}`);
    }

    const found = [];
    let checked = 0;

    candidates.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        found[index] = src;
        checked++;
        if (checked === candidates.length) done(found.filter(Boolean));
      };
      img.onerror = () => {
        checked++;
        if (checked === candidates.length) done(found.filter(Boolean));
      };
      img.src = src;
    });
  }

  function zhRenderThumbs() {
    galleryThumbs.innerHTML = '';

    zhGalleryImages.forEach((src, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'zh-gallery-thumb' + (index === zhGalleryIndex ? ' is-active' : '');
      button.setAttribute('aria-label', `Voir la photo ${index + 1}`);

      const img = document.createElement('img');
      img.src = src;
      img.alt = `${zhGalleryTitle} - photo ${index + 1}`;
      img.loading = 'lazy';

      button.appendChild(img);
      button.addEventListener('click', () => zhShowGalleryImage(index));
      galleryThumbs.appendChild(button);
    });
  }

  function zhShowGalleryImage(index) {
    if (!zhGalleryImages.length) return;

    zhGalleryIndex = (index + zhGalleryImages.length) % zhGalleryImages.length;
    galleryImage.classList.add('zh-gallery-loading');
    galleryImage.src = zhGalleryImages[zhGalleryIndex];
    galleryImage.alt = `${zhGalleryTitle} - photo ${zhGalleryIndex + 1}`;

    galleryImage.onload = () => galleryImage.classList.remove('zh-gallery-loading');
    galleryCounter.textContent = `${zhGalleryIndex + 1} / ${zhGalleryImages.length}`;

    galleryThumbs.querySelectorAll('.zh-gallery-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('is-active', i === zhGalleryIndex);
    });

    const activeThumb = galleryThumbs.querySelector('.zh-gallery-thumb.is-active');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  function zhOpenGallery(card) {
    const mainImage = card.querySelector('.img-wrap img');
    const title = card.querySelector('h3');
    if (!mainImage) return;

    zhGalleryTitle = title ? title.textContent.trim() : 'Galerie du modèle';
    galleryTitle.textContent = zhGalleryTitle;
    galleryCounter.textContent = 'Chargement…';
    galleryThumbs.innerHTML = '';
    galleryImage.removeAttribute('src');

    galleryRoot.classList.add('is-open');
    galleryRoot.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    zhFindGalleryImages(mainImage.getAttribute('src'), (images) => {
      if (!galleryRoot.classList.contains('is-open')) return;

      zhGalleryImages = images;
      zhGalleryIndex = 0;

      if (!zhGalleryImages.length) {
        galleryCounter.textContent = 'Aucune photo disponible';
        return;
      }

      zhRenderThumbs();
      zhShowGalleryImage(0);
    });
  }

  function zhCloseGallery() {
    galleryRoot.classList.remove('is-open');
    galleryRoot.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    galleryImage.removeAttribute('src');
  }

  if (galleryRoot && galleryImage) {
    /* Ajoute automatiquement Voir plus à toutes les cartes actuelles. */
    document.querySelectorAll('.moto-card').forEach(card => {
      const ctaRow = card.querySelector('.cta-row');
      if (!ctaRow || ctaRow.querySelector('.zh-gallery-trigger')) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'zh-gallery-trigger';
      button.innerHTML = '<span aria-hidden="true">▣</span> Voir plus';
      button.addEventListener('click', () => zhOpenGallery(card));

      /* Le bouton est placé avant le bouton WhatsApp existant. */
      ctaRow.insertBefore(button, ctaRow.firstChild);
    });

    document.querySelectorAll('[data-gallery-close]').forEach(el => {
      el.addEventListener('click', zhCloseGallery);
    });

    galleryPrev.addEventListener('click', () => zhShowGalleryImage(zhGalleryIndex - 1));
    galleryNext.addEventListener('click', () => zhShowGalleryImage(zhGalleryIndex + 1));

    document.addEventListener('keydown', (event) => {
      if (!galleryRoot.classList.contains('is-open')) return;
      if (event.key === 'Escape') zhCloseGallery();
      if (event.key === 'ArrowLeft') zhShowGalleryImage(zhGalleryIndex - 1);
      if (event.key === 'ArrowRight') zhShowGalleryImage(zhGalleryIndex + 1);
    });

    galleryImage.addEventListener('touchstart', (event) => {
      zhGalleryTouchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    galleryImage.addEventListener('touchend', (event) => {
      const endX = event.changedTouches[0].screenX;
      const diff = zhGalleryTouchStartX - endX;
      if (Math.abs(diff) < 50) return;
      if (diff > 0) zhShowGalleryImage(zhGalleryIndex + 1);
      else zhShowGalleryImage(zhGalleryIndex - 1);
    }, { passive: true });
  }

});


/* ===== AJOUT : contrôle du son de la vidéo d'accueil ===== */
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("homeBackgroundVideo");
  const button = document.getElementById("videoSoundToggle");

  if (!video || !button) return;

  button.addEventListener("click", function () {
    video.muted = !video.muted;

    if (video.muted) {
      button.innerHTML = " <span>Activer le son</span>";
      button.setAttribute("aria-label", "Activer le son de la vidéo");
      button.setAttribute("aria-pressed", "false");
      button.classList.remove("is-on");
    } else {
      video.volume = 1;
      button.innerHTML = " <span>Désactiver le son</span>";
      button.setAttribute("aria-label", "Désactiver le son de la vidéo");
      button.setAttribute("aria-pressed", "true");
      button.classList.add("is-on");
    }
  });
});
