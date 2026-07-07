// Hamburger overlay menu toggle
const menuBtn = document.querySelector('.menu-btn');
const menuOverlayLinks = document.querySelectorAll('.menu-overlay-links a, .menu-overlay-cta a');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
}

menuOverlayLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
  });
});

// Accordion (FAQ) toggle
document.querySelectorAll('.qbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.parentElement.classList.toggle('open');
  });
});

// Reveal on scroll animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stats counter animation
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const targetValue = parseInt(el.dataset.to, 10);
      let currentValue = 0;
      // Faster or slower increment steps based on target size
      const step = Math.max(1, Math.round(targetValue / 50));
      
      const timer = setInterval(() => {
        currentValue += step;
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(timer);
        }
        el.textContent = '+' + currentValue;
      }, 20);
      
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-to]').forEach(el => counterObserver.observe(el));