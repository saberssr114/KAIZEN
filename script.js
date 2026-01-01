document.addEventListener('DOMContentLoaded', () => {
    
    // --- Custom Cursor ---
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (animation in CSS could handle this too, but JS is more precise)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add hover effect to links and buttons
    const hoverElements = document.querySelectorAll('a, button, .project-card, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });


    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple hamburger animation toggle could go here
    });
    
    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });


    // --- Scroll Navbar Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // --- Scroll Reveal Animation ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    // Elements to animate
    const revealElements = document.querySelectorAll('.section-title, .service-card, .about-text, .project-card');
    
    // Add base CSS class for hidden state via JS to avoid FoUC if JS fails
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal-element { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal-element.visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(styleSheet);

    revealElements.forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
    });

    /* --- Video Modal Logic --- */
    const modal = document.getElementById('video-modal');
    const modalContent = document.querySelector('.modal-content');
    const iframe = document.getElementById('video-frame');
    const closeBtn = document.querySelector('.close-modal');
    const watchBtns = document.querySelectorAll('.watch-btn');
    const projectCardsWithVideo = document.querySelectorAll('.project-card[data-video-src]');

    function openModal(videoUrl) {
        if (!videoUrl) return;
        iframe.src = videoUrl + "?autoplay=1&rel=0"; // Auto-play on open
        modal.style.display = 'flex';
        // Small delay to allow display:flex to apply before transition
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            iframe.src = ""; // Stop video
        }, 300); // Match transition duration
    }

    // Attach to buttons
    watchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click if we add logic there later
            const card = btn.closest('.project-card');
            const videoUrl = card.getAttribute('data-video-src');
            openModal(videoUrl);
        });
    });

    // Optional: Allow clicking the whole card to open video if it's a video card
    projectCardsWithVideo.forEach(card => {
        const overlayIcon = card.querySelector('.overlay i'); // Play icon
        if(overlayIcon) {
            overlayIcon.addEventListener('click', () => {
                const videoUrl = card.getAttribute('data-video-src');
                openModal(videoUrl);
            });
        }
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

});
