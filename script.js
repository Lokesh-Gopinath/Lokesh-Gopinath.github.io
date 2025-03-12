document.addEventListener('DOMContentLoaded', function() {
    const titleSpans = document.querySelectorAll('#title span');
    const fonts = ['Poppins, sans-serif', 'Roboto Mono, monospace'];
    const config = { intervalTime: 2000, transitionTime: 400 };
    let animationInterval = null;

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function updateSpan(span) {
        span.style.opacity = 0;
        span.style.transform = 'translateY(15px)';
        setTimeout(() => {
            span.style.fontFamily = getRandomItem(fonts);
            span.style.color = `hsl(${Math.random() * 360}, 80%, 70%)`;
            span.style.opacity = 1;
            span.style.transform = 'translateY(0)';
            setTimeout(() => span.style.color = '#7289da', 300);
        }, config.transitionTime);
    }

    function animateTitle() {
        titleSpans.forEach((span, index) => {
            setTimeout(() => updateSpan(span), index * 80);
        });
    }

    function initializeTitleStyles() {
        titleSpans.forEach(span => {
            span.style.transition = `opacity ${config.transitionTime / 1000}s ease, transform 0.4s ease`;
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
                techStack.style.transform = 'translateY(15px)';
            });
        });
    }

    function setupSkillsProgress() {
        const skills = [
            { selector: '.skill-card:nth-child(1)', width: '90%' }, // Node-RED
            { selector: '.skill-card:nth-child(2)', width: '75%' }, // Mindsphere
            { selector: '.skill-card:nth-child(3)', width: '85%' }, // Programming
            { selector: '.skill-card:nth-child(4)', width: '80%' }, // Embedded
            { selector: '.skill-card:nth-child(5)', width: '95%' }, // Logical Thinking
            { selector: '.skill-card:nth-child(6)', width: '90%' }, // Time Management
            { selector: '.skill-card:nth-child(7)', width: '85%' }, // Adaptability
            { selector: '.skill-card:nth-child(8)', width: '80%' }, // Organizational
        ];
        skills.forEach(skill => {
            const card = document.querySelector(skill.selector);
            card.innerHTML += `<div class="progress-bar"><span style="width: 0;"></span></div>`;
            const bar = card.querySelector('.progress-bar span');
            setTimeout(() => {
                bar.style.width = skill.width;
            }, 500);
        });
    }

    function setupParticles() {
        const particleContainer = document.getElementById('particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
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
        setupSkillsProgress();
        setupParticles();

        const navLinks = document.querySelectorAll('nav ul li a');
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 60;
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
