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

// Interactive 2D Mouse Parallax & Smooth Ambient Float (Zero Image Deformation)
const profileCapsule = document.querySelector('.hero-profile-capsule');

if (profileCapsule) {
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let floatTime = 0;
  let isHovered = false;

  profileCapsule.addEventListener('mouseenter', () => { isHovered = true; });
  profileCapsule.addEventListener('mouseleave', () => { isHovered = false; });

  window.addEventListener('mousemove', (e) => {
    const rect = profileCapsule.getBoundingClientRect();
    const capsuleCenterX = rect.left + rect.width / 2;
    const capsuleCenterY = rect.top + rect.height / 2;
    
    if (isHovered) {
      const dx = (e.clientX - capsuleCenterX) / (rect.width / 2);
      const dy = (e.clientY - capsuleCenterY) / (rect.height / 2);
      targetX = dx * 16;
      targetY = dy * 12;
    } else {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      targetX = dx * 18;
      targetY = dy * 14;
    }
  }, { passive: true });

  function animateHeroCapsule() {
    floatTime += 0.025;
    const ambientFloatY = Math.sin(floatTime) * 6;

    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    const totalY = currentY + ambientFloatY;

    // Apply pure 2D translation (no rotation, zero deformation)
    profileCapsule.style.transform = `translate3d(${currentX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0)`;

    requestAnimationFrame(animateHeroCapsule);
  }

  animateHeroCapsule();
}