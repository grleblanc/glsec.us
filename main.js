/* ============================================================
   glsec.us — Main JavaScript
   Scroll reveals, theme toggle, nav behavior
   ============================================================ */

(function () {
    'use strict';

    // ---- Theme Toggle ----
    const THEME_KEY = 'glsec-theme';

    function getPreferredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);

        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Apply immediately to avoid flash
    applyTheme(getPreferredTheme());

    document.addEventListener('DOMContentLoaded', function () {

        // Re-apply after DOM is ready (icon update)
        applyTheme(getPreferredTheme());

        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                applyTheme(current === 'dark' ? 'light' : 'dark');
            });
        }

        // ---- Mobile Menu ----
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', function () {
                navLinks.classList.toggle('open');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.className = navLinks.classList.contains('open')
                        ? 'fas fa-times'
                        : 'fas fa-bars';
                }
            });

            // Close menu on link click
            navLinks.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    navLinks.classList.remove('open');
                    const icon = menuBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                });
            });
        }

        // ---- Nav Scroll Shadow ----
        const nav = document.querySelector('.nav');
        if (nav) {
            window.addEventListener('scroll', function () {
                nav.classList.toggle('scrolled', window.scrollY > 20);
            }, { passive: true });
        }

        // ---- Active Nav Link ----
        const sections = document.querySelectorAll('.section[id]');
        const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        function updateActiveLink() {
            let currentId = '';
            sections.forEach(function (section) {
                const top = section.offsetTop - 120;
                if (window.scrollY >= top) {
                    currentId = section.id;
                }
            });

            allNavLinks.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();

        // ---- Scroll Reveal ----
        const revealElements = document.querySelectorAll('.reveal');

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            revealElements.forEach(function (el, index) {
                el.style.setProperty('--stagger-index', index);
                revealObserver.observe(el);
            });
        } else {
            // Fallback: show everything immediately
            revealElements.forEach(function (el) {
                el.classList.add('visible');
            });
        }

        // ---- Smooth Scroll for Anchor Links ----
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    });
})();
