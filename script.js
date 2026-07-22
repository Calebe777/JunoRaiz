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

// Interactive 3D Mouse Parallax & Tilt Effect on Hero Profile Capsule
const profileCapsule = document.querySelector('.hero-profile-capsule');
const profileImg = document.querySelector('.hero-profile-capsule img');

if (profileCapsule) {
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let targetRotateX = 0, targetRotateY = 0;
  let currentRotateX = 0, currentRotateY = 0;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    targetRotateX = -dy * 22;
    targetRotateY = dx * 22;
    targetX = dx * 28;
    targetY = dy * 20;
  });

  function animateHeroCapsule() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    currentRotateX += (targetRotateX - currentRotateX) * 0.1;
    currentRotateY += (targetRotateY - currentRotateY) * 0.1;

    profileCapsule.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

    if (profileImg) {
      profileImg.style.transform = `scale(1.15) translate3d(${(currentX * 0.35).toFixed(2)}px, ${(currentY * 0.35).toFixed(2)}px, 20px)`;
    }

    requestAnimationFrame(animateHeroCapsule);
  }

  animateHeroCapsule();
}