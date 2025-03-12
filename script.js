document.addEventListener('DOMContentLoaded', function() {
    const titleSpans = document.querySelectorAll('#title span');
    const fonts = ['Poppins, sans-serif', 'Roboto Mono, monospace'];
    const config = { intervalTime: 2500, transitionTime: 500 };
    let animationInterval = null;

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function updateSpan(span) {
        span.style.opacity = 0;
        span.style.transform = 'translateY(20px) scale(0.9)';
        setTimeout(() => {
            span.style.fontFamily = getRandomItem(fonts);
            span.style.color = `hsl(${Math.random() * 360}, 85%, 75%)`;
            span.style.opacity = 1;
            span.style.transform = 'translateY(0) scale(1)';
            setTimeout(() => span.style.color = '#7289da', 400);
        }, config.transitionTime);
    }

    function animateTitle() {
        titleSpans.forEach((span, index) => {
            setTimeout(() => updateSpan(span), index * 100);
        });
    }

    function initializeTitleStyles() {
        titleSpans.forEach(span => {
            span.style.transition = `opacity ${config.transitionTime / 1000}s ease, transform 0.5s ease`;
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
                techStack.style.transform = 'translateY(20px)';
            });
        });
    }

    function setupParticles() {
        const particleContainer = document.getElementById('particles');
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 6}s`;
            particleContainer.appendChild(particle);
        }
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

        const navLinks = document.querySelectorAll('nav ul li a');
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 70;
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
