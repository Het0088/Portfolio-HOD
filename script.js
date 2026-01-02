// Performance optimized portfolio JavaScript
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.ensureTopPosition();
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeNavigation();
        this.initializeFormHandling();
        this.showLoadingScreen();
    }

    // Ensure page starts at top on load/refresh
    ensureTopPosition() {
        // Immediately scroll to top without animation
        if (window.scrollY !== 0) {
            window.scrollTo(0, 0);
        }

        // Also ensure on page load
        window.addEventListener('beforeunload', () => {
            window.scrollTo(0, 0);
        });
    }

    // Loading screen management
    showLoadingScreen() {
        // Show loading screen briefly for better UX
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(loadingScreen);

        // Hide loading screen after content loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hide');
                setTimeout(() => {
                    if (document.body.contains(loadingScreen)) {
                        document.body.removeChild(loadingScreen);
                    }
                }, 500);
            }, 800);
        });
    }



    // Navigation functionality
    initializeNavigation() {
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupNavbarEffects();
        this.setupActiveNavLinks();
    }

    setupMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.contains('active');

            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Update aria-expanded attribute
            hamburger.setAttribute('aria-expanded', !isActive);

            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupNavbarEffects() {
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide/show navbar on scroll (only on mobile)
            if (window.innerWidth <= 768) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            // Update navbar background
            this.updateNavbarBackground(currentScrollY);

            lastScrollY = currentScrollY;
        };

        // Throttle scroll events for better performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateNavbarBackground(scrollY = window.scrollY) {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        if (scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
            navbar.style.boxShadow = 'none';
        }
    }

    setupActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const setActiveLink = () => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 120;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Set initial active link
        setTimeout(setActiveLink, 100);
    }

    // Animation system
    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupTimelineAnimation();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupHeroAnimations();
    }

    setupHeroAnimations() {
        // Animate hero stats on scroll
        const heroStats = document.querySelectorAll('.stat-number');

        const animateCounters = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const targetValue = parseInt(target.textContent.replace(/\D/g, ''));
                    const suffix = target.textContent.replace(/[0-9]/g, '');

                    let current = 0;
                    const duration = 2500; // 2.5 seconds total animation time
                    const steps = 100; // More steps for smoother animation
                    const increment = targetValue / steps;
                    const stepTime = duration / steps; // ~25ms per step

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= targetValue) {
                            current = targetValue;
                            clearInterval(timer);
                        }
                        target.textContent = Math.floor(current) + suffix;
                    }, stepTime);

                    // Stop observing this element
                    this.statsObserver.unobserve(target);
                }
            });
        };

        this.statsObserver = new IntersectionObserver(animateCounters, {
            threshold: 0.5
        });

        heroStats.forEach(stat => {
            this.statsObserver.observe(stat);
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add animation class and observe elements
        const animatedElements = document.querySelectorAll(
            '.skill-card, .project-card, .stat, .about-text, .contact-info, .contact-form'
        );

        animatedElements.forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }

    setupTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    setupHoverEffects() {
        // Enhanced hover effects for cards
        document.querySelectorAll('.skill-card, .project-card, .stat').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Button ripple effect
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', this.createRippleEffect);
        });

        // Enhanced logo hover effect
        const logo = document.querySelector('.nav-logo a');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                const logoIcon = logo.querySelector('.logo-icon');
                if (logoIcon) {
                    logoIcon.style.transform = 'rotate(15deg) scale(1.1)';
                }
            });

            logo.addEventListener('mouseleave', () => {
                const logoIcon = logo.querySelector('.logo-icon');
                if (logoIcon) {
                    logoIcon.style.transform = 'rotate(0deg) scale(1)';
                }
            });
        }
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    setupParallaxEffects() {
        const hero = document.querySelector('.hero');
        const shapes = document.querySelectorAll('.shape');

        if (!hero) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.3;

                    if (scrolled < window.innerHeight) {
                        hero.style.transform = `translateY(${rate}px)`;

                        // Animate floating shapes at different speeds
                        shapes.forEach((shape, index) => {
                            const shapeRate = scrolled * (-0.1 - index * 0.05);
                            shape.style.transform = `translateY(${shapeRate}px) rotate(${scrolled * 0.1}deg)`;
                        });
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Form handling
    initializeFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Name is required';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'subject':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Subject is required';
                }
                break;
            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }

    showFieldError(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');

        if (!isValid) {
            field.style.borderColor = '#ef4444';

            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = '#ef4444';
                errorElement.style.fontSize = '0.875rem';
                errorElement.style.marginTop = '0.5rem';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        } else {
            field.style.borderColor = '#10b981';
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showToast('Please fix the errors before submitting', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';

        try {
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success state
            this.showToast('Thank you for your message! I\'ll get back to you soon.', 'success');
            form.reset();

            // Clear any remaining error states
            inputs.forEach(input => this.clearFieldError(input));

        } catch (error) {
            this.showToast('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            font-weight: 500;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    // Setup all event listeners
    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });

        // Performance optimization for resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });

        // Add CSS for animations
        this.addDynamicStyles();
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }

        // Update navbar background
        this.updateNavbarBackground();
    }

    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .navbar {
                transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
            }

            .error-message {
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Improve focus accessibility */
            .nav-link:focus,
            .btn:focus,
            .dark-mode-toggle:focus,
            input:focus,
            textarea:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }

            /* Loading state for buttons */
            .btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            /* Logo icon transition */
            .logo-icon {
                transition: transform 0.3s ease;
            }

            /* Enhanced scroll indicator */
            .scroll-indicator {
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .scroll-indicator:hover {
                transform: translateY(-5px);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the portfolio application
document.addEventListener('DOMContentLoaded', () => {
    // Ensure we start at the top
    window.scrollTo(0, 0);
    new PortfolioApp();
});

// Also ensure on window load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Additional utility functions
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    scrollToElement(elementId, offset = 80) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
};

// Export for potential external use
window.PortfolioUtils = utils; 