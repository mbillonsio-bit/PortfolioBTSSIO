/* ══════════════════════════════════════════════
   PORTFOLIO — MAXENCE BILLON
   script.js
   ══════════════════════════════════════════════ */

/* ── Drag to scroll projects ── */
const slider = document.querySelector('.projects-scroll-wrapper');
let isDown = false, startX, scrollLeft;
slider.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; });
slider.addEventListener('mouseleave', () => isDown = false);
slider.addEventListener('mouseup',    () => isDown = false);
slider.addEventListener('mousemove',  e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - slider.offsetLeft; slider.scrollLeft = scrollLeft - (x - startX) * 1.2; });

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ── Skill bar fill on scroll ── */
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.pct + '%'; barObserver.unobserve(e.target); } }); }, { threshold: 0.3 });
bars.forEach(b => barObserver.observe(b));

/* ══════════════════════════════════════════════
   PROJECT MODAL
   ══════════════════════════════════════════════ */

(function () {
  const overlay    = document.getElementById('modal-overlay');
  const closeBtn   = document.getElementById('modal-close');
  const modalTag   = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalContext = document.getElementById('modal-context');
  const modalBilan   = document.getElementById('modal-bilan');
  const modalLangs = document.getElementById('modal-langs');
  const modalComps = document.getElementById('modal-comps');
  const track      = document.getElementById('modal-img-track');
  const dotsWrap   = document.getElementById('modal-dots');
  const prevBtn    = document.getElementById('modal-prev');
  const nextBtn    = document.getElementById('modal-next');

  let currentSlide = 0;
  let totalSlides  = 0;

  function openModal(card) {
    modalTag.textContent   = card.dataset.tag   || '';
    modalTitle.textContent = card.dataset.title || '';
    function formatText(str) {
      return (str || '').split('\\n\\n').map(p => `<p>${p.replace(/\\n/g, '<br>')}</p>`).join('');
    }
    modalContext.innerHTML = formatText(card.dataset.context);
    modalBilan.innerHTML   = formatText(card.dataset.bilan);

    const srcLangs = card.querySelector('.project-langs');
    const srcComps = card.querySelector('.project-comps');
    modalLangs.innerHTML = srcLangs ? srcLangs.innerHTML : '—';
    modalComps.innerHTML = srcComps ? srcComps.innerHTML : '—';

    track.innerHTML    = '';
    dotsWrap.innerHTML = '';
    currentSlide = 0;

    const images = (card.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);

    if (images.length > 0) {
      images.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'modal-img-slide';
        const img = document.createElement('img');
        img.src = src; img.alt = card.dataset.title || '';
        slide.appendChild(img);
        track.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = 'modal-img-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); });
        dotsWrap.appendChild(dot);
      });
      totalSlides = images.length;
    } else {
      const slide = document.createElement('div');
      slide.className = 'modal-img-slide';
      const srcPh = card.querySelector('.project-img-placeholder');
      slide.innerHTML = srcPh ? srcPh.innerHTML : '<i class="bi bi-image"></i>';
      track.appendChild(slide);
      totalSlides = 1;
    }

    updateCarousel();
    overlay.classList.add('open');
    document.body.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
    startAutoRotate();
  }

  function closeModal() {
    stopAutoRotate();
    overlay.classList.remove('open');
    document.body.classList.remove('modal-active');
    document.body.style.overflow = '';
  }

  let autoTimer = null;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dotsWrap.querySelectorAll('.modal-img-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    const single = totalSlides <= 1;
    prevBtn.classList.toggle('hidden', single);
    nextBtn.classList.toggle('hidden', single);
    dotsWrap.style.display = single ? 'none' : 'flex';
  }

  function startAutoRotate() {
    stopAutoRotate();
    if (totalSlides <= 1) return;
    autoTimer = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }, 3500);
  }

  function stopAutoRotate() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  /* Pause on hover */
  const modalBox = document.getElementById('modal-box');
  modalBox.addEventListener('mouseenter', stopAutoRotate);
  modalBox.addEventListener('mouseleave', () => { if (document.getElementById('modal-overlay').classList.contains('open')) startAutoRotate(); });

  prevBtn.addEventListener('click', e => { e.stopPropagation(); stopAutoRotate(); currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateCarousel(); startAutoRotate(); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); stopAutoRotate(); currentSlide = (currentSlide + 1) % totalSlides; updateCarousel(); startAutoRotate(); });

  document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
    let moved = false;
    card.addEventListener('mousedown', () => moved = false);
    card.addEventListener('mousemove', () => moved = true);
    card.addEventListener('click', () => { if (!moved) openModal(card); });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft')  { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateCarousel(); }
    if (e.key === 'ArrowRight') { currentSlide = (currentSlide + 1) % totalSlides; updateCarousel(); }
  });
})();