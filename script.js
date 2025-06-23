document.addEventListener('DOMContentLoaded', () => {
    function animateTitle() {
        const title = document.getElementById('title');
        if (!title) return;
        const text = title.textContent;
        title.innerHTML = text.split('').map(char => `<span>${char}</span>`).join('');
        const spans = title.querySelectorAll('span');
        gsap.from(spans, {
            y: 60,
            opacity: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)'
        });
        spans.forEach(span => {
            span.addEventListener('mouseenter', () => {
                gsap.to(span, {
                    color: 'var(--accent-color)',
                    scale: 1.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            span.addEventListener('mouseleave', () => {
                gsap.to(span, {
                    color: 'var(--primary-color)',
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    function setupParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 20;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        const particleCount = 150; // Reduced for performance
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const randoms = new Float32Array(particleCount);
        const scales = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            let x, y, z, len;
            do {
                x = Math.random() * 2 - 1;
                y = Math.random() * 2 - 1;
                z = Math.random() * 2 - 1;
                len = x * x + y * y + z * z;
            } while (len > 1 || len === 0);
            const r = Math.cbrt(Math.random());
            positions[i * 3] = x * r * 10;
            positions[i * 3 + 1] = y * r * 10;
            positions[i * 3 + 2] = z * r * 10;
            colors[i * 3] = Math.random(); // Random colors
            colors[i * 3 + 1] = Math.random();
            colors[i * 3 + 2] = Math.random();
            randoms[i] = Math.random();
            scales[i] = 0.3 + Math.random() * 0.7;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particlesGeometry.setAttribute('random', new THREE.BufferAttribute(randoms, 1));
        particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        const vertexShader = `
            attribute float random;
            attribute float scale;
            uniform float uTime;
            uniform float uSpread;
            uniform float uBaseSize;
            uniform vec2 uMouse;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec3 pos = position * uSpread;
                float dist = length(pos.xy - uMouse);
                float repel = max(0.0, 1.0 - dist / 2.0);
                pos.xy += normalize(pos.xy - uMouse) * repel * 0.5;
                pos.x += sin(uTime * random + 6.28 * random) * mix(0.1, 1.5, random);
                pos.y += cos(uTime * random + 6.28 * random) * mix(0.1, 1.5, random);
                pos.z += sin(uTime * random + 6.28 * random) * mix(0.1, 1.5, random);
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = (uBaseSize * scale * (1.0 + 0.3 * sin(uTime + random * 6.28))) / length(mvPosition.xyz);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        const fragmentShader = `
            varying vec3 vColor;
            uniform float uTime;
            void main() {
                vec2 uv = gl_PointCoord.xy;
                float d = length(uv - vec2(0.5));
                if (d > 0.5) discard;
                gl_FragColor = vec4(vColor, 0.8 + 0.2 * sin(uTime));
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSpread: { value: 10 },
                uBaseSize: { value: 100 },
                uMouse: { value: new THREE.Vector2(0, 0) }
            },
            transparent: true,
            depthTest: false
        });

        const particles = new THREE.Points(particlesGeometry, material);
        scene.add(particles);

        const mouse = { x: 0, y: 0 };
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            material.uniforms.uMouse.value.set(mouse.x * 10, mouse.y * 10);
        });

        function animate(time) {
            requestAnimationFrame(animate);
            material.uniforms.uTime.value = time * 0.0002;
            particles.rotation.z += 0.0005;
            renderer.render(scene, camera);
        }
        animate(0);

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    }

    function setupScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            gsap.from(section.querySelectorAll('.glassy-card'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 80,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: 'power3.out'
            });
            gsap.from(section.querySelectorAll('i'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                rotation: 360,
                stagger: 0.1,
                duration: 0.8,
                ease: 'back.out(1.5)'
            });
            gsap.from(section.querySelector('h2'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                x: -100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });
    }

    function setupSmoothScroll() {
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    gsap.to(window, {
                        scrollTo: targetElement.offsetTop - 70,
                        duration: 1.2,
                        ease: 'power3.out'
                    });
                }
            });
        });
    }

    function setupNavActive() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 70;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                    gsap.to(link, {
                        scale: 1.15,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(link, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    function setupProjectHover() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const techStack = card.querySelector('.tech-stack');
                if (techStack) {
                    gsap.to(techStack, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power3.out'
                    });
                }
            });
            card.addEventListener('mouseleave', () => {
                const techStack = card.querySelector('.tech-stack');
                if (techStack) {
                    gsap.to(techStack, {
                        opacity: 0,
                        y: 25,
                        duration: 0.5,
                        ease: 'power3.out'
                    });
                }
            });
        });
    }

    function setupCursorTrail() {
        let lastX = 0, lastY = 0;
        document.addEventListener('mousemove', (e) => {
            const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
            if (dist > 20) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = `${e.clientX}px`;
                trail.style.top = `${e.clientY}px`;
                document.body.appendChild(trail);
                gsap.to(trail, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => trail.remove()
                });
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });
    }

    function setupScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    }

    function init() {
        animateTitle();
        setupParticles();
        setupScrollAnimations();
        setupSmoothScroll();
        setupNavActive();
        setupProjectHover();
        setupCursorTrail();
        setupScrollProgress();
        document.querySelectorAll('.skill-card, .project-card, .contact-card, .education-card').forEach((el, i) => {
            el.style.setProperty('--order', i);
        });
    }

    init();
});
