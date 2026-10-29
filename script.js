/* ==========================================================================
   STRYKR SPORTS - Multi-Page Engine
   Features:
   - Preloader fade-out
   - Floating neon canvas particle system
   - Interactive Contact Form handling
   - IntersectionObserver scroll reveal animations
   - Animated statistics counters
   - Mobile navigation toggle & active page link detection
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 2. FLOATING NEON PARTICLES CANVAS
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 45;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 2.2 + 0.8;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.alpha = Math.random() * 0.7 + 0.2;
                this.growth = (Math.random() - 0.5) * 0.01;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                this.alpha += this.growth;
                if (this.alpha <= 0.1 || this.alpha >= 0.85) {
                    this.growth = -this.growth;
                }

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 217, 43, ${this.alpha})`;
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#C8D92B';
                ctx.fill();
                ctx.closePath();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // 3. INTERACTIVE CONTACT FORM CONTROLLER
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const category = document.getElementById('category').value;
            const message = document.getElementById('message').value.trim();

            if (!fullName || !phone || !email || !category || !message) {
                formStatus.className = 'form-status-box error';
                formStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please fill in all required fields to submit your message.';
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                formStatus.className = 'form-status-box success';
                formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you, <strong>' + fullName + '</strong>! Your message has been received. Our team will contact you shortly.';
                
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                setTimeout(() => {
                    formStatus.className = 'form-status-box hidden';
                }, 6000);
            }, 1200);
        });
    }

    // 4. SCROLL REVEAL (FADE-UP ANIMATIONS)
    const fadeElements = document.querySelectorAll('.fade-up');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    // 5. ANIMATED METRICS COUNTER
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let count = 0;
            const speed = target > 50 ? 25 : 120;
            
            const timer = setInterval(() => {
                count++;
                stat.innerText = count;
                if (count >= target) {
                    stat.innerText = target;
                    clearInterval(timer);
                }
            }, speed);
        });
    }

    const heroStatsEl = document.querySelector('.hero-stats');
    if (heroStatsEl) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    hasAnimatedStats = true;
                    animateStats();
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStatsEl);
    }

    // 6. MOBILE NAVIGATION TOGGLE & ACTIVE PAGE HIGHLIGHTING
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Set active link based on current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split('#')[0];
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else if (!link.getAttribute('href').startsWith('#') && linkHref !== currentPage) {
            link.classList.remove('active');
        }
    });

});
