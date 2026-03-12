/**
 * main.js
 * Lógica de la landing page de canchas.
 *
 * Módulos:
 *  1. Header — se oscurece al hacer scroll
 *  2. Reveal — anima elementos al entrar al viewport
 *  3. Parallax — movimiento suave del hero
 *  4. Contadores — anima los números de stats
 *  5. WhatsApp form — validación + armado del link
 *  6. Año en el footer
 */

/* ─────────────────────────────────────────────────────
   NÚMERO DE WHATSAPP DE TU PAPÁ
   Formato: código de país + número, sin el +
   Ej: Argentina, número 11 2345 6789 → "5491123456789"
───────────────────────────────────────────────────── */
const WHATSAPP_NUMBER = '5493513785192'; // ← reemplazá aquí

/* ─────────────────────────────────────────────────────
   1. HEADER — fondo al hacer scroll
───────────────────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    // Agrega clase "scrolled" cuando el usuario baja más de 60px
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Corre una vez al cargar por si la página ya está scrolleada
})();

/* ─────────────────────────────────────────────────────
   2. REVEAL — Intersection Observer para animaciones de scroll
───────────────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Una vez visible, dejamos de observar para no reprocesar
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,  // el elemento debe estar 12% visible para dispararse
      rootMargin: '0px 0px -30px 0px', // empieza un poco antes del borde inferior
    }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────
   3. PARALLAX HERO — Movimiento suave del fondo
   Solo activo en desktop (prefersReducedMotion ya se
   maneja en CSS, pero chequeamos para no correr JS innecesario)
───────────────────────────────────────────────────── */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  function onScroll() {
    // Movemos el fondo a la mitad de la velocidad del scroll
    const offset = window.scrollY * 0.40;
    heroBg.style.transform = `translateY(${offset}px)`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────────────────
   4. CONTADORES ANIMADOS — Stats del equipo
   Se activan cuando el elemento entra al viewport
───────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const duration = 1750; // milisegundos de animación

  function animateCounter(el) {
const target = parseInt(el.getAttribute('data-target'), 10);

    // Si el placeholder no es un número, salimos
    if (isNaN(target)) return;

    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out cúbico
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();


/* ─────────────────────────────────────────────────────
   5. FORMULARIO WHATSAPP — Validación + redirección
───────────────────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('whatsapp-form');
  if (!form) return;

  const rules = [
    { id: 'nombre',   errorId: 'error-nombre',   msg: 'Por favor, ingresá tu nombre.' },
    { id: 'ubicacion',errorId: 'error-ubicacion', msg: 'Por favor, ingresá tu ciudad.' },
    { id: 'deporte',  errorId: 'error-deporte',   msg: 'Seleccioná el tipo de cancha.' },
    { id: 'proyecto', errorId: 'error-proyecto',  msg: 'Seleccioná el tipo de proyecto.' },
  ];

  function clearError(inputEl, errorEl) {
    inputEl.classList.remove('input--error');
    errorEl.textContent = '';
  }

  function showError(inputEl, errorEl, msg) {
    inputEl.classList.add('input--error');
    errorEl.textContent = msg;
  }

  function validate() {
    let valid = true;
    rules.forEach(({ id, errorId, msg }) => {
      const input   = document.getElementById(id);
      const errorEl = document.getElementById(errorId);
      if (!input.value.trim()) {
        showError(input, errorEl, msg);
        valid = false;
      } else {
        clearError(input, errorEl);
      }
    });
    return valid;
  }

  rules.forEach(({ id, errorId }) => {
    const input   = document.getElementById(id);
    const errorEl = document.getElementById(errorId);
    input.addEventListener('input',  () => clearError(input, errorEl));
    input.addEventListener('change', () => clearError(input, errorEl));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    const nombre   = document.getElementById('nombre').value.trim();
    const ubicacion= document.getElementById('ubicacion').value.trim();
    const deporte  = document.getElementById('deporte').value;
    const proyecto = document.getElementById('proyecto').value;
    const espacio  = document.getElementById('espacio').value.trim();
    const mensaje  = document.getElementById('mensaje').value.trim();

    let texto =
      `Hola Marcelo, consulta desde la web 🎾\n\n` +
      `👤 Nombre: ${nombre}\n` +
      `📍 Ubicación: ${ubicacion}\n` +
      `🎾 Cancha: ${deporte}\n` +
      `🏗️ Proyecto: ${proyecto}\n`

    if (espacio)  texto += `\n📐 Espacio: ${espacio}`;
    if (mensaje)  texto += `\n💬 Comentario: ${mensaje}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();



/* ─────────────────────────────────────────────────────
   6. AÑO DINÁMICO EN EL FOOTER
───────────────────────────────────────────────────── */
(function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ─────────────────────────────────────────────────────
   7. MENÚ HAMBURGUESA — Mobile
───────────────────────────────────────────────────── */
(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('nav-menu');
  if (!toggle || !nav) return;

  function closeMenu() {
    toggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cierra al hacer clic en cualquier link del menú
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Cierra al hacer clic fuera del menú
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      closeMenu();
    }
  });
})();
