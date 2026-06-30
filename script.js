// ============================================
// AMBIENT CURSOR-FOLLOWING GLOW
// ============================================
const glow = document.getElementById('glow');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (glow && !prefersReducedMotion) {
  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ============================================
// VISITOR COUNTER
// Uses the free CountAPI service — no backend or PHP needed.
// Each page load increments a counter tied to your namespace/key.
// ============================================
const visitorText = document.getElementById('visitorText');

// IMPORTANT: change "opemipo-portfolio" below to something unique to you
// (e.g. your GitHub username) so your counter doesn't clash with anyone else's.
const COUNTER_NAMESPACE = 'Opemipo-portfolio';
const COUNTER_KEY = 'visits';

async function updateVisitorCount() {
  try {
    const response = await fetch(
      `https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`
    );
    const data = await response.json();
    visitorText.textContent = `You're visitor #${data.value.toLocaleString()}`;
  } catch (error) {
    // Fail quietly — don't let a third-party outage break the page
    visitorText.textContent = 'Welcome';
  }
}

updateVisitorCount();

// ============================================
// SCROLL-TRIGGERED SECTION REVEALS
// ============================================
const sections = document.querySelectorAll('.section');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

sections.forEach(section => revealObserver.observe(section));

// ============================================
// CONTACT FORM (Formspree submission via fetch)
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = "Thank you — your message has been sent. I'll respond within 1 business days.";
        formStatus.classList.add('is-success');
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
        formStatus.classList.add('is-error');
      }
    } catch (error) {
      formStatus.textContent = 'Network error. Please check your connection and try again.';
      formStatus.classList.add('is-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}
