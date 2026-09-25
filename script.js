document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------
  // CONFIG: WhatsApp number in international format.
  // Country code + number, digits only (no "+", spaces or dashes).
  // 91 = India, so 91 + 7879955498
  // ------------------------------------------------------------------
  const WHATSAPP_NUMBER = '917879955498';

  // ---------- Mobile menu ----------
  (function () {
  var btn = document.getElementById('menuOpen');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  btn.addEventListener('click', function () {
    setOpen(!menu.classList.contains('open'));
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 860) setOpen(false);
  });
})();

// ---------- work section ----------
  (function () {
  var track = document.getElementById('workTrack');
  var prev = document.getElementById('workPrev');
  var next = document.getElementById('workNext');
  if (!track || !prev || !next) return;

  function step() {
    var card = track.querySelector('.work-card');
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function update() {
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }

  prev.addEventListener('click', function () {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  next.addEventListener('click', function () {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

  // ---------- Chat widget ----------
  const chatFab = document.getElementById('chatFab');
  const chatPanel = document.getElementById('chatPanel');

  if (chatFab && chatPanel) {
    chatFab.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = chatPanel.hasAttribute('hidden');
      chatPanel.toggleAttribute('hidden', !willOpen);
      chatFab.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) chatFab.classList.remove('pulse');
    });

    document.addEventListener('click', (e) => {
      if (!chatPanel.contains(e.target) && !chatFab.contains(e.target)) {
        chatPanel.setAttribute('hidden', '');
        chatFab.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Copy email ----------
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');

  if (copyBtn && emailText) {
    const emailAddress = emailText.textContent.trim();
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard) navigator.clipboard.writeText(emailAddress).catch(() => {});
      emailText.textContent = 'Copied!';
      setTimeout(() => { emailText.textContent = emailAddress; }, 1500);
    });
  }

  // ---------- Service chips (multi-select) ----------
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const isActive = chip.classList.toggle('active');
      chip.setAttribute('aria-pressed', String(isActive));
    });
  });

  // ---------- Inquiry form -> WhatsApp ----------
  const form = document.getElementById('inquiryForm');
  const formMsg = document.getElementById('formMsg');

  // Builds a correct WhatsApp click-to-chat link.
  // Format: https://wa.me/<number>?text=<url-encoded message>
  const buildWhatsAppUrl = (message) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const value = (id, fallback = '') =>
        (document.getElementById(id)?.value || '').trim() || fallback;

      const name = value('name');
      const email = value('email');
      const phone = value('phone', 'Not provided');
      const budget = value('budget', 'Not selected');
      const details = value('details');

      const services = Array.from(document.querySelectorAll('.chip.active'))
        .map((chip) => chip.textContent.trim());
      const servicesText = services.length ? services.join(', ') : 'None selected';

      const message =
        `New Project Inquiry from ADREN DESIGN\n\n` +
        `*Name:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Phone:* ${phone}\n` +
        `*Budget:* ${budget}\n` +
        `*Services:* ${servicesText}\n\n` +
        `*Project details:*\n${details}`;

      const url = buildWhatsAppUrl(message);

      // Open WhatsApp in a new tab; if the browser blocks it, use the current tab.
      const popup = window.open(url, '_blank');
      if (popup) {
        popup.opener = null;
      } else {
        window.location.href = url;
      }

      if (formMsg) {
        formMsg.classList.add('show');
        setTimeout(() => formMsg.classList.remove('show'), 6000);
      }

      form.reset();
      chips.forEach((chip) => {
        chip.classList.remove('active');
        chip.setAttribute('aria-pressed', 'false');
      });
    });
  }
});



/* Hide the swipe hint after the first swipe */
(function () {
  var track = document.getElementById('workTrack');
  var hint = document.getElementById('swipeHint');
  if (!track || !hint) return;

  track.addEventListener('scroll', function () {
    if (track.scrollLeft > 20) hint.classList.add('is-hidden');
  }, { passive: true });
})();


/* ===== Additions: year, Esc closes chat, work lightbox ===== */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var p = document.getElementById('chatPanel'), f = document.getElementById('chatFab');
    if (p && !p.hasAttribute('hidden')) { p.setAttribute('hidden', ''); f.setAttribute('aria-expanded', 'false'); f.focus(); }
  });

  var lb = document.getElementById('lightbox');
  var cards = Array.from(document.querySelectorAll('.work-card'));
  if (!lb || !cards.length) return;
  var img = document.getElementById('lbImg'), cap = document.getElementById('lbCap'), i = 0, opener = null;

  function show(n) {
    i = (n + cards.length) % cards.length;
    var c = cards[i].querySelector('img');
    img.src = c.currentSrc || c.src;
    img.alt = c.alt;
    cap.textContent = cards[i].querySelector('h3').textContent;
  }
  function open(n, from) { opener = from; show(n); lb.hidden = false; document.body.style.overflow = 'hidden'; document.getElementById('lbClose').focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); }

  cards.forEach(function (c, n) {
    c.addEventListener('click', function (e) { e.preventDefault(); open(n, c); });
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(i - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(i + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();



/* ===== Show focus ring only for keyboard (Tab) users ===== */
(function () {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') document.body.classList.add('kbd');
  });
  ['mousedown', 'pointerdown', 'touchstart'].forEach(function (t) {
    document.addEventListener(t, function () { document.body.classList.remove('kbd'); }, { passive: true });
  });
})();


/* ===== Accordion: opening one Tip / FAQ closes all the others ===== */
(function () {
  ['.tips-grid', '.faq-list'].forEach(function (sel) {
    var group = document.querySelector(sel);
    if (!group) return;
    var all = group.querySelectorAll('details');
    all.forEach(function (d) {
      var sum = d.querySelector('summary');
      if (!sum) return;
      sum.addEventListener('click', function () {
        if (d.open) return; // it is being closed, nothing else to do
        all.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  });
})();
