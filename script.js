// Basic interactions: filters, modal, theme toggle, copy-to-clipboard, contact form simulation
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year'); yearEl.textContent = new Date().getFullYear();

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(t) {
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme','dark');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed','true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed','false');
    }
    localStorage.setItem('theme', t);
  }

  // Mobile menu (simple)
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  mobileBtn && mobileBtn.addEventListener('click', () => {
    const nav = document.querySelector('.nav-links');
    const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
    mobileBtn.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? 'none' : 'flex';
  });

  // Smooth scroll for nav links
  document.querySelectorAll('[data-scroll]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const href = a.getAttribute('href');
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectsGrid = document.getElementById('projects-grid');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    filterProjects(filter);
  }));

  function filterProjects(filter) {
    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach(card => {
      const cat = card.dataset.category;
      if (filter === '*' || filter === 'all') {
        card.style.display = '';
      } else {
        card.style.display = (cat === filter) ? '' : 'none';
      }
    });
  }

  // Modal for videos
  const modal = document.getElementById('video-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.querySelector('.modal-close');
  const openBtns = document.querySelectorAll('.open-video');
  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    const type = btn.dataset.type;
    if (type === 'youtube') {
      const vid = btn.dataset.id;
      openYouTube(vid);
    } else if (type === 'instagram') {
      const url = btn.dataset.url;
      openInstagram(url);
    } else if (type === 'link') {
      const url = btn.dataset.url;
      window.open(url || '#', '_blank', 'noopener');
    }
  }));

  // Hero showreel buttons open a YouTube short (use 1st ID)
  document.getElementById('play-showreel')?.addEventListener('click', ()=> openYouTube('KLwqqePxvgk'));
  document.getElementById('play-showreel-2')?.addEventListener('click', ()=> openYouTube('KLwqqePxvgk'));

  function openYouTube(id) {
    modalBody.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="YouTube video player" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    showModal();
  }

  function openInstagram(url) {
    // Instagram embeds often require their script and may block iframing.
    // Fallback: open in new tab, but try iframe first.
    const embed = `<iframe src="${url}embed" title="Instagram reel" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    modalBody.innerHTML = embed;
    showModal();
  }

  function showModal() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  document.querySelector('[data-close]')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  // Copy to clipboard for email
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard');
      } catch (err) {
        // fallback: select and prompt
        showToast('Copy failed — please copy manually.');
      }
    });
  });

  // Simple toast
  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg; t.style.position='fixed'; t.style.right='16px'; t.style.bottom='16px';
    t.style.background='rgba(0,0,0,0.8)'; t.style.color='#fff'; t.style.padding='0.6rem 0.9rem'; t.style.borderRadius='8px'; t.style.zIndex=9999;
    document.body.appendChild(t);
    setTimeout(()=> t.remove(),1800);
  }

  // Contact form (simulate)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      status.textContent = 'Please fill all fields.';
      return;
    }
    status.textContent = 'Sending...';
    // Simulate network
    setTimeout(() => {
      status.textContent = `Thanks ${name}! Message received. I will reply at ${email} within 24-48 hrs.`;
      form.reset();
    }, 800);
  });

});
