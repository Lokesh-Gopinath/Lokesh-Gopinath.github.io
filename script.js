document.addEventListener('DOMContentLoaded', function() {
    // Title Animation
    const titleSpans = document.querySelectorAll('#title span');
    const fonts = ['Poppins, sans-serif', 'Roboto Mono, monospace'];
    const config = { intervalTime: 1500, transitionTime: 300 };
    let animationInterval = null;

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function updateSpan(span) {
        span.style.opacity = 0;
        setTimeout(() => {
            span.style.fontFamily = getRandomItem(fonts);
            span.style.opacity = 1;
        }, config.transitionTime);
    }

    function animateTitle() {
        titleSpans.forEach((span, index) => {
            setTimeout(() => updateSpan(span), index * 60);
        });
    }

    function initializeTitleStyles() {
        titleSpans.forEach(span => {
            span.style.transition = `opacity ${config.transitionTime / 1000}s ease-in-out`;
            span.style.display = 'inline-block';
        });
    }

    // Scroll Animation for All Sections
    function animateOnScroll() {
        const elements = document.querySelectorAll('.hidden');
        const triggerBottom = window.innerHeight * 0.9;

        elements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('visible');
            }
        });
    }

    // Initialize
    function init() {
        if (!titleSpans.length) {
            console.warn('No title spans found.');
            return;
        }

        // Title setup
        initializeTitleStyles();
        animateTitle();
        animationInterval = setInterval(animateTitle, config.intervalTime);

        // Scroll animation setup
        document.querySelectorAll('.hidden').forEach(el => {
            el.classList.add('hidden');
        });
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll();

        // Nav active state
        const navLinks = document.querySelectorAll('nav ul li a');
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 50;
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
