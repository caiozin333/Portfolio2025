document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const header = document.querySelector('header');
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeSwitch = document.getElementById('checkbox');
    const backToTop = document.querySelector('.back-to-top');
    const cursor = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');
    const sections = document.querySelectorAll('section');
    const skillBars = document.querySelectorAll('.skill-progress');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contactForm');
    const typingText = document.getElementById('typing-text');
    const canvas = document.getElementById('particles');

    // Verificar tema atual e aplicar
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        themeSwitch.checked = true;
    } else {
        body.classList.remove('dark-mode');
        themeSwitch.checked = false;
    }

    function toggleMenu() {
        menuBtn.classList.toggle('open');
        nav.classList.toggle('active');
        body.classList.toggle('no-scroll');
    }

    function closeMenu() {
        menuBtn.classList.remove('open');
        nav.classList.remove('active');
        body.classList.remove('no-scroll');
    }

    function toggleTheme() {
        if (themeSwitch.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    function updateCursor(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        
        setTimeout(() => {
            cursorBlur.style.left = `${x}px`;
            cursorBlur.style.top = `${y}px`;
        }, 50);
    }

    function enlargeCursor() {
        cursor.style.width = '25px';
        cursor.style.height = '25px';
        cursor.style.backgroundColor = 'rgba(74, 99, 231, 0.5)';
    }

    function shrinkCursor() {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursor.style.backgroundColor = 'var(--primary-color)';
    }

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + scrollY;
            if (scrollY > sectionTop - windowHeight + 150) {
                section.classList.add('active');
            }
        });
        
        if (document.querySelector('.skills').classList.contains('active')) {
            skillBars.forEach(bar => {
                const width = bar.parentElement.previousElementSibling.querySelector('.percentage').textContent;
                bar.style.width = width;
            });
        }
        
        if (scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function filterProjects(category) {
        projectCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function typeEffect() {
        const textArray = ["Desenvolvedor Web", "Designer Front-End", "Estudante"];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentText = textArray[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % textArray.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        }
        
        type();
    }

    function initParticles() {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                color: body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.3)' : 'rgba(74, 99, 231, 0.3)',
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5
            });
        }
        
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.speedX = -particle.speedX;
                }
                
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.speedY = -particle.speedY;
                }
                
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(74, 99, 231, 0.1)';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
        }
        
        animate();
        
        themeSwitch.addEventListener('change', () => {
            particles.forEach(particle => {
                particle.color = body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.3)' : 'rgba(74, 99, 231, 0.3)';
            });
        });
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Event Listeners
    menuBtn.addEventListener('click', toggleMenu);
    themeSwitch.addEventListener('change', toggleTheme);
    window.addEventListener('mousemove', updateCursor);
    
    const clickableElements = document.querySelectorAll('a, button, .btn, .social-icon, .filter-btn');
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', enlargeCursor);
        element.addEventListener('mouseleave', shrinkCursor);
    });
    
    window.addEventListener('scroll', revealOnScroll);
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-filter');
            filterProjects(category);
        });
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    typeEffect();
    initParticles();
    revealOnScroll();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 10;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    window.addEventListener('resize', function() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});