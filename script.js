document.addEventListener('DOMContentLoaded', function() {
    const titleSpans = document.querySelectorAll('#title span');
    const fonts = ['Poppins, sans-serif', 'Roboto Mono, monospace'];
    const config = { intervalTime: 3000, transitionTime: 600 };
    let animationInterval = null;

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function updateSpan(span) {
        span.style.opacity = 0;
        span.style.transform = 'translateY(25px) scale(0.85)';
        setTimeout(() => {
            span.style.fontFamily = getRandomItem(fonts);
            span.style.color = `hsl(${Math.random() * 360}, 90%, 80%)`;
            span.style.opacity = 1;
            span.style.transform = 'translateY(0) scale(1)';
            setTimeout(() => span.style.color = '#7289da', 500);
        }, config.transitionTime);
    }

    function animateTitle() {
        titleSpans.forEach((span, index) => {
            setTimeout(() => updateSpan(span), index * 120);
        });
    }

    function initializeTitleStyles() {
        titleSpans.forEach(span => {
            span.style.transition = `opacity ${config.transitionTime / 1000}s ease, transform 0.6s ease`;
            span.style.display = 'inline-block';
        });
    }

    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.fade-in, .hidden').forEach(el => {
            el.classList.add('hidden');
            observer.observe(el);
        });
    }

    function setupSmoothScroll() {
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function setupProjectHover() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const techStack = card.querySelector('.tech-stack');
            card.addEventListener('mouseenter', () => {
                techStack.style.opacity = '1';
                techStack.style.transform = 'translateY(0)';
            });
            card.addEventListener('mouseleave', () => {
                techStack.style.opacity = '0';
                techStack.style.transform = 'translateY(25px)';
            });
        });
    }

    function setupParticles() {
        const particleContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 7}s`;
            particleContainer.appendChild(particle);
        }
    }

    function setupCursorTrail() {
        const trail = document.querySelector('.cursor-trail');
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateTrail() {
            trailX += (mouseX - trailX) * 0.2;
            trailY += (mouseY - trailY) * 0.2;
            trail.style.left = `${trailX}px`;
            trail.style.top = `${trailY}px`;
            requestAnimationFrame(animateTrail);
        }

        animateTrail();
    }

    function init() {
        if (!titleSpans.length) {
            console.warn('No title spans found.');
            return;
        }

        initializeTitleStyles();
        animateTitle();
        animationInterval = setInterval(animateTitle, config.intervalTime);

        setupScrollAnimations();
        setupSmoothScroll();
        setupProjectHover();
        setupParticles();
        setupCursorTrail();

        const navLinks = document.querySelectorAll('nav ul li a');
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 80;
            navLinks.forEach(link => {
                const section = document.querySelector(link.getAttribute('href'));
                if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
    }

    window.addEventListener('unload', () => {
        if (animationInterval) clearInterval(animationInterval);
    });

    init();
});
