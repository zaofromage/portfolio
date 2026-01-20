/**
 * Portfolio Terminal Futuriste - JavaScript
 * Zao Capdeville - Développeur Logiciel
 * Enhanced with cyber aesthetics and smooth animations
 */

(function() {
  'use strict';

  // Prevent FOUC (Flash of Unstyled Content)
  document.documentElement.style.opacity = '0';
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.documentElement.style.transition = 'opacity 0.3s ease';
      document.documentElement.style.opacity = '1';
    }, 50);
  });

  // ================================
  // Theme Manager - Dark Mode Toggle
  // ================================
  class ThemeManager {
    constructor() {
      this.themeToggle = document.getElementById('theme-toggle');
      if (!this.themeToggle) return;

      this.sunIcon = this.themeToggle.querySelector('.sun-icon');
      this.moonIcon = this.themeToggle.querySelector('.moon-icon');
      this.init();
    }

    init() {
      // Vérifier localStorage ou préférence système
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

      this.setTheme(initialTheme, false);

      // Event listeners
      this.themeToggle.addEventListener('click', () => this.toggleTheme());

      // Écouter les changements de préférence système
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light', true);
        }
      });
    }

    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme, true);
    }

    setTheme(theme, animate = true) {
      if (animate) {
        document.documentElement.classList.add('theme-transitioning');
      }

      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);

      // Mettre à jour les icônes
      if (theme === 'dark') {
        this.sunIcon.style.display = 'none';
        this.moonIcon.style.display = 'block';
      } else {
        this.sunIcon.style.display = 'block';
        this.moonIcon.style.display = 'none';
      }

      if (animate) {
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transitioning');
        }, 300);
      }
    }
  }

  // ================================
  // Project Filter - Filtres par catégorie
  // ================================
  class ProjectFilter {
    constructor() {
      this.filterBtns = document.querySelectorAll('.filter-btn');
      this.projects = document.querySelectorAll('.project');
      this.activeFilter = 'all';

      if (this.filterBtns.length === 0) return;
      this.init();
    }

    init() {
      this.filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => this.handleFilter(e));
      });
    }

    handleFilter(e) {
      const filter = e.target.dataset.filter;
      this.activeFilter = filter;

      // Mettre à jour l'état actif des boutons
      this.filterBtns.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      // Filtrer les projets avec animation
      this.filterProjects(filter);
    }

    filterProjects(filter) {
      this.projects.forEach((project, index) => {
        const categories = project.dataset.categories.split(',');
        const shouldShow = filter === 'all' || categories.includes(filter);

        if (shouldShow) {
          project.style.display = 'flex';
          // Animation d'apparition échelonnée
          setTimeout(() => {
            project.classList.add('visible');
            project.style.opacity = '1';
          }, index * 100);
        } else {
          project.classList.remove('visible');
          project.style.opacity = '0';
          setTimeout(() => {
            project.style.display = 'none';
          }, 300);
        }
      });
    }
  }

  // ================================
  // Project Modal - Lightbox pour projets
  // ================================
  class ProjectModal {
    constructor() {
      this.modal = document.getElementById('project-modal');
      if (!this.modal) return;

      this.modalContent = this.modal.querySelector('.modal-content');
      this.closeBtn = this.modal.querySelector('.modal-close');
      this.projects = document.querySelectorAll('.project');
      this.init();
    }

    init() {
      // Ajouter les listeners de clic aux projets
      this.projects.forEach(project => {
        project.addEventListener('click', (e) => {
          e.preventDefault();
          this.openModal(project);
        });
      });

      // Fermer le modal
      this.closeBtn.addEventListener('click', () => this.closeModal());

      // Fermer en cliquant sur l'overlay
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });

      // Fermer avec la touche ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.closeModal();
        }
      });
    }

    openModal(project) {
      const title = project.querySelector('.title').textContent;
      const desc = project.querySelector('.desc').textContent;
      const img = project.querySelector('img').src;
      const technos = project.querySelector('.technos').cloneNode(true);
      const link = project.href;

      // Peupler le modal avec les données du projet
      this.modal.querySelector('.modal-title').textContent = title;
      this.modal.querySelector('.modal-description').textContent = desc;
      this.modal.querySelector('.modal-image').src = img;
      this.modal.querySelector('.modal-image').alt = title;

      const modalTechnos = this.modal.querySelector('.modal-technos');
      modalTechnos.innerHTML = '';
      modalTechnos.appendChild(technos);

      this.modal.querySelector('.modal-link').href = link;

      // Afficher le modal avec animation
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Animer l'entrée
      requestAnimationFrame(() => {
        this.modalContent.style.transform = 'scale(1)';
        this.modalContent.style.opacity = '1';
      });
    }

    closeModal() {
      this.modalContent.style.transform = 'scale(0.95)';
      this.modalContent.style.opacity = '0';

      setTimeout(() => {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
      }, 300);
    }
  }

  // ================================
  // Scroll Animations - Intersection Observer
  // ================================
  class ScrollAnimations {
    constructor() {
      this.observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };
      this.init();
    }

    init() {
      // Éléments à animer
      const elementsToAnimate = document.querySelectorAll(
        '.skill, .project, #about, h3'
      );

      // Ajouter la classe initiale
      elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
      });

      // Créer l'observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Arrêter d'observer après l'animation
            observer.unobserve(entry.target);
          }
        });
      }, this.observerOptions);

      // Observer tous les éléments
      elementsToAnimate.forEach(el => observer.observe(el));
    }
  }

  // ================================
  // Parallax Effect - Header
  // ================================
  class ParallaxEffect {
    constructor() {
      this.header = document.querySelector('header');
      this.profileImg = document.getElementById('moi');
      this.headerText = this.header.querySelectorAll('#nom, #titre');

      if (!this.header || !this.profileImg) return;
      this.init();
    }

    init() {
      // Utiliser requestAnimationFrame pour de meilleures performances
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this.updateParallax();
            ticking = false;
          });
          ticking = true;
        }
      });
    }

    updateParallax() {
      const scrolled = window.pageYOffset;
      const headerHeight = this.header.offsetHeight;

      // Appliquer uniquement quand le header est visible
      if (scrolled < headerHeight) {
        // L'image bouge plus lentement (0.5x)
        this.profileImg.style.transform = `translateY(${scrolled * 0.5}px)`;

        // Le texte bouge encore moins vite (0.3x) pour créer de la profondeur
        this.headerText.forEach(el => {
          el.style.transform = `translateY(${scrolled * 0.3}px)`;
        });

        // Fade out progressif du header
        const opacity = 1 - (scrolled / headerHeight);
        this.header.style.opacity = Math.max(opacity, 0.3);
      }
    }
  }

  // ================================
  // Touch Gestures - Mobile interactions
  // ================================
  class TouchGestures {
    constructor() {
      this.modal = document.getElementById('project-modal');
      if (!this.modal) return;

      this.startY = 0;
      this.currentY = 0;
      this.init();
    }

    init() {
      const modalContent = this.modal.querySelector('.modal-content');

      modalContent.addEventListener('touchstart', (e) => {
        this.startY = e.touches[0].clientY;
      }, { passive: true });

      modalContent.addEventListener('touchmove', (e) => {
        this.currentY = e.touches[0].clientY;
        const diff = this.currentY - this.startY;

        // Autoriser uniquement le swipe vers le bas
        if (diff > 0 && diff < 200) {
          modalContent.style.transform = `translateY(${diff}px)`;
          modalContent.style.transition = 'none';
        }
      }, { passive: true });

      modalContent.addEventListener('touchend', () => {
        const diff = this.currentY - this.startY;

        // Fermer si swipe > 100px vers le bas
        if (diff > 100) {
          document.querySelector('.modal-close').click();
        }

        // Réinitialiser la position
        modalContent.style.transform = '';
        modalContent.style.transition = '';
        this.startY = 0;
        this.currentY = 0;
      }, { passive: true });
    }
  }

  // ================================
  // Easter Egg - Konami Code
  // ================================
  class KonamiCode {
    constructor() {
      this.konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
      ];
      this.konamiIndex = 0;
      this.init();
    }

    init() {
      document.addEventListener('keydown', (e) => {
        if (e.key === this.konamiCode[this.konamiIndex]) {
          this.konamiIndex++;

          if (this.konamiIndex === this.konamiCode.length) {
            this.activateKonamiMode();
            this.konamiIndex = 0;
          }
        } else {
          this.konamiIndex = 0;
        }
      });
    }

    activateKonamiMode() {
      document.body.classList.toggle('konami-mode');

      // Message de célébration
      console.log('🎮 Konami Code activé! Mode Arc-en-ciel! 🌈');

      // Désactiver après 10 secondes
      setTimeout(() => {
        document.body.classList.remove('konami-mode');
      }, 10000);
    }
  }

  // ================================
  // Helper Functions
  // ================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ================================
  // Cursor Effect - Custom Glowing Cursor
  // ================================
  class CursorEffect {
    constructor() {
      this.cursor = document.createElement('div');
      this.cursor.className = 'custom-cursor';
      this.cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--cyber-cyan);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease, opacity 0.15s ease;
        opacity: 0;
        mix-blend-mode: difference;
      `;
      document.body.appendChild(this.cursor);
      this.init();
    }

    init() {
      document.addEventListener('mousemove', (e) => {
        this.cursor.style.left = e.clientX - 10 + 'px';
        this.cursor.style.top = e.clientY - 10 + 'px';
        this.cursor.style.opacity = '1';
      });

      // Scale up on interactive elements
      const interactives = document.querySelectorAll('a, button, .skill, .project, .filter-btn');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.cursor.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
          this.cursor.style.transform = 'scale(1)';
        });
      });

      document.addEventListener('mouseleave', () => {
        this.cursor.style.opacity = '0';
      });
    }
  }

  // ================================
  // Glitch Effect on Hover - Progressive Reveal
  // ================================
  class GlitchEffect {
    constructor() {
      this.isAnimating = false;
      this.init();
    }

    init() {
      const nameLines = document.querySelectorAll('.nom-line');
      if (nameLines.length === 0) return;

      nameLines.forEach(line => {
        line.addEventListener('mouseenter', () => {
          if (!this.isAnimating) {
            this.applyGlitch(line);
          }
        });
      });
    }

    applyGlitch(element) {
      this.isAnimating = true;
      const originalText = element.textContent;
      let iterations = 0;
      const maxIterations = originalText.length;

      const interval = setInterval(() => {
        // Créer le texte avec révélation progressive
        const newText = originalText
          .split('')
          .map((_char, index) => {
            // Les caractères déjà révélés restent stables
            if (index < iterations) {
              return originalText[index];
            }
            // Les caractères à venir affichent des symboles aléatoires
            if (index < iterations + 3) {
              // Utiliser des caractères plus "cyber" et lisibles
              const chars = '▓▒░█▄▀■□▪▫';
              return chars[Math.floor(Math.random() * chars.length)];
            }
            // Les caractères lointains sont cachés
            return originalText[index];
          })
          .join('');

        element.textContent = newText;

        // Incrémenter progressivement pour révéler lettre par lettre
        iterations += 0.5;

        // Terminer l'animation quand toutes les lettres sont révélées
        if (iterations >= maxIterations + 3) {
          clearInterval(interval);
          element.textContent = originalText;
          this.isAnimating = false;
        }
      }, 50);
    }
  }

  // ================================
  // Initialization
  // ================================
  document.addEventListener('DOMContentLoaded', () => {
    // Initialiser tous les modules
    new ThemeManager();
    new ScrollAnimations();
    new ParallaxEffect();
    new ProjectFilter();
    new ProjectModal();
    new TouchGestures();
    new KonamiCode();

    // Desktop-only effects
    if (window.innerWidth > 768) {
      new CursorEffect();
      new GlitchEffect();
    }

    // Animation de chargement de la page
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
    });
  });

  // Support prefers-reduced-motion pour l'accessibilité
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
  }

  // Exposer debounce globalement si nécessaire
  window.debounce = debounce;

})();
