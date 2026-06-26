/* ===================================================
   SOURABH SHARMA — PORTFOLIO SCRIPTS
   Particle Canvas | Scroll Animations | Interactivity
   =================================================== */

(function () {
    'use strict';

    // ── Particle / Constellation Canvas ──
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles, animationId;
        const PARTICLE_COUNT = 80;
        const CONNECTION_DISTANCE = 140;
        const MOUSE_RADIUS = 200;
        let mouse = { x: -1000, y: -1000 };

        function resizeCanvas() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: (Math.random() - 0.5) * 0.6,
                    radius: Math.random() * 2 + 0.8,
                    opacity: Math.random() * 0.5 + 0.2,
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);

            // Connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DISTANCE) {
                        const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                        ctx.strokeStyle = `rgba(212, 168, 67, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Particles
            particles.forEach((p) => {
                // Mouse interaction
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    p.vx -= (dx / dist) * force * 0.015;
                    p.vy -= (dy / dist) * force * 0.015;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Boundaries
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
                p.x = Math.max(0, Math.min(width, p.x));
                p.y = Math.max(0, Math.min(height, p.y));

                // Damping
                p.vx *= 0.999;
                p.vy *= 0.999;

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 168, 67, ${p.opacity})`;
                ctx.fill();

                // Glow for larger particles
                if (p.radius > 1.5) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(212, 168, 67, ${p.opacity * 0.1})`;
                    ctx.fill();
                }
            });

            animationId = requestAnimationFrame(drawParticles);
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        resizeCanvas();
        createParticles();
        drawParticles();
    }

    // ── Typewriter Effect ──
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const phrases = [
            'Talent Management & HR Analytics Professional',
            'HR Analytics Specialist',
            'MBA (Finance) Candidate',
            'Performance Management Expert',
            'Workforce Intelligence Leader',
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 50;

        function typeEffect() {
            const current = phrases[phraseIndex];
            if (isDeleting) {
                typewriterEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 30;
            } else {
                typewriterEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 60;
            }

            if (!isDeleting && charIndex === current.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 300;
            }

            setTimeout(typeEffect, typeSpeed);
        }
        setTimeout(typeEffect, 1200);
    }

    // ── Navbar Scroll ──
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    const allNavLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    allNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    function highlightNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    // ── Scroll Reveal ──
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger delay for siblings
                    const parent = entry.target.parentElement;
                    const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
                    const siblingIndex = siblings.indexOf(entry.target);
                    const delay = siblingIndex >= 0 ? siblingIndex * 100 : 0;

                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, delay);

                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));

    // ── Stat Counter Animation ──
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    const suffix = el.dataset.suffix || '';
                    let current = 0;
                    const duration = 2000;
                    const step = target / (duration / 16);

                    function countUp() {
                        current += step;
                        if (current >= target) {
                            el.textContent = target + suffix;
                            return;
                        }
                        el.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(countUp);
                    }
                    countUp();
                    statObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );
    statNumbers.forEach((el) => statObserver.observe(el));

    // ── Skill Bar Animation ──
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetWidth = el.dataset.width;
                    setTimeout(() => {
                        el.style.width = targetWidth + '%';
                        el.classList.add('animate');
                    }, 200);
                    skillObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.3 }
    );
    skillFills.forEach((el) => skillObserver.observe(el));

    // ── Contact Form ──
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-primary');
            const originalText = btn.innerHTML;
            btn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Message Sent!
            `;
            btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ── Toggle Extra Certifications ──
    const toggleCertsBtn = document.getElementById('toggleCertsBtn');
    const moreCertsGrid = document.getElementById('moreCertsGrid');
    if (toggleCertsBtn && moreCertsGrid) {
        toggleCertsBtn.addEventListener('click', () => {
            const isShown = moreCertsGrid.classList.contains('show');
            if (isShown) {
                moreCertsGrid.classList.remove('show');
                toggleCertsBtn.innerHTML = `
                    View More Certifications
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                `;
                // Scroll back to the top of certifications section
                const certsSection = document.getElementById('certifications');
                if (certsSection) {
                    certsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                moreCertsGrid.classList.add('show');
                toggleCertsBtn.innerHTML = `
                    Show Less
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
                `;
                
                // Re-trigger reveal animation for newly shown items
                const revealItems = moreCertsGrid.querySelectorAll('.reveal');
                revealItems.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('active');
                    }, index * 100);
                });
            }
        });
    }

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
