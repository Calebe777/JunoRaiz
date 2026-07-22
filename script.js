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
const heroSection = document.querySelector('.hero');
const profileCapsule = document.querySelector('.hero-profile-capsule');
const profileImg = document.querySelector('.hero-profile-capsule img');

if (heroSection && profileCapsule) {
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let targetRotateX = 0, targetRotateY = 0;
  let currentRotateX = 0, currentRotateY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = (e.clientX - centerX) / (window.innerWidth / 2);
    const mouseY = (e.clientY - centerY) / (window.innerHeight / 2);

    targetRotateX = Math.max(-20, Math.min(20, -mouseY * 18));
    targetRotateY = Math.max(-20, Math.min(20, mouseX * 18));
    targetX = Math.max(-30, Math.min(30, mouseX * 24));
    targetY = Math.max(-24, Math.min(24, mouseY * 18));
  });

  function animateHeroCapsule() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    currentRotateX += (targetRotateX - currentRotateX) * 0.08;
    currentRotateY += (targetRotateY - currentRotateY) * 0.08;

    profileCapsule.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

    if (profileImg) {
      profileImg.style.transform = `scale(1.1) translate3d(${currentX * 0.3}px, ${currentY * 0.3}px, 15px)`;
    }

    requestAnimationFrame(animateHeroCapsule);
  }

  animateHeroCapsule();
}