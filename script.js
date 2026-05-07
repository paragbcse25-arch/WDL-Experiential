/* =========================================
   INKWELL STUDIO — script.js
   ========================================= */

// ── CUSTOM CURSOR ────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  follower.style.opacity = '1';
});

// ── NAV SCROLL EFFECT ────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ── HAMBURGER / MOBILE MENU ──────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  hamburger.classList.toggle('active', menuOpen);
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── TYPEWRITER EFFECT ────────────────────
const words = ['move', 'captivate', 'convert', 'linger with', 'ignite'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    typeEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    typeEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  const speed = isDeleting ? 70 : 100;
  setTimeout(typeWriter, speed);
}

// Start after a small delay
setTimeout(typeWriter, 900);

// ── SCROLL REVEAL ────────────────────────
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on siblings
      const siblings = Array.from(entry.target.parentElement.children)
        .filter(el => el.classList.contains('reveal-up') || 
                      el.classList.contains('reveal-left') ||
                      el.classList.contains('reveal-right'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.08}s`;
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATION ────────────────────
const counters = document.querySelectorAll('.stat-num');

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

// ── SMOOTH NAV SCROLLING ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── CONTACT FORM ─────────────────────────
const submitBtn = document.getElementById('submitBtn');
const formNote = document.getElementById('formNote');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const serviceSelect = document.getElementById('serviceSelect');
const messageInput = document.getElementById('messageInput');

submitBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const service = serviceSelect.value;
  const message = messageInput.value.trim();

  // Basic validation
  if (!name || !email || !service || !message) {
    formNote.textContent = '✦ Please fill in all fields before sending.';
    formNote.style.color = '#c0392b';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formNote.textContent = '✦ Please enter a valid email address.';
    formNote.style.color = '#c0392b';
    return;
  }

  // Simulate submission
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  setTimeout(() => {
    formNote.textContent = '✦ Brief received! We\'ll be in touch within 24 hours.';
    formNote.style.color = 'var(--gold)';
    submitBtn.textContent = 'Sent ✓';
    submitBtn.style.background = '#2c6e49';
    nameInput.value = '';
    emailInput.value = '';
    serviceSelect.selectedIndex = 0;
    messageInput.value = '';

    // Reset after 5 seconds
    setTimeout(() => {
      submitBtn.textContent = 'Send My Brief →';
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      formNote.textContent = '';
    }, 5000);
  }, 1200);
});

// ── SERVICE CARD HOVER PARALLAX ──────────
// Only apply on non-touch devices
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
if (!isTouch) {
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'none';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s';
    });
  });
}

// ── MARQUEE PAUSE ON HOVER ────────────────
const marqueeInner = document.querySelector('.marquee-inner');
const marqueeTrack = document.querySelector('.marquee-track');
marqueeTrack.addEventListener('mouseenter', () => {
  marqueeInner.style.animationPlayState = 'paused';
});
marqueeTrack.addEventListener('mouseleave', () => {
  marqueeInner.style.animationPlayState = 'running';
});

// ── INIT HERO REVEALS ─────────────────────
// Trigger hero reveals on load
window.addEventListener('load', () => {
  const heroReveals = document.querySelectorAll('.hero .reveal-up');
  heroReveals.forEach((el, i) => {
    el.style.transitionDelay = `${0.2 + i * 0.15}s`;
    el.classList.add('revealed');
  });
});
