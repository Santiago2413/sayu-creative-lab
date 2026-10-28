/* ==========================================================================
   Sayukiit Creative Lab — interacciones
   Sin dependencias externas.
   ========================================================================== */
(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("#site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = [...document.querySelectorAll(".site-nav__link")];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileBreakpoint = window.matchMedia("(max-width: 960px)");

  /* Header con fondo al hacer scroll ------------------------------------- */
  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* Menú móvil ------------------------------------------------------------ */
  const isMenuOpen = () => navToggle?.getAttribute("aria-expanded") === "true";

  const setMenu = (open, restoreFocus = false) => {
    if (!navToggle || !nav) return;

    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    navToggle.querySelector(".nav-toggle__label").textContent = open ? "Cerrar" : "Menú";
    nav.classList.toggle("is-open", open);
    header?.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("menu-open", open);

    if (open) {
      const firstLink = nav.querySelector("a");
      window.setTimeout(() => firstLink?.focus(), 160);
    } else if (restoreFocus) {
      navToggle.focus();
    }
  };

  navToggle?.addEventListener("click", () => {
    setMenu(!isMenuOpen());
  });

  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a") && mobileBreakpoint.matches) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenu(false, true);
    }
  });

  mobileBreakpoint.addEventListener("change", (event) => {
    if (!event.matches && isMenuOpen()) {
      setMenu(false);
    }
  });

  /* Aparición progresiva de bloques -------------------------------------- */
  const revealItems = [...document.querySelectorAll("[data-reveal]")];

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* Navegación activa según la sección visible --------------------------- */
  const sections = [...document.querySelectorAll("main section[id]")];

  if ("IntersectionObserver" in window && sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentId}`;
            link.classList.toggle("is-active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  /* Formulario ------------------------------------------------------------ */
  const form = document.querySelector("[data-contact-form]");

  if (form) {
    const status = form.querySelector(".form-status");

    form.addEventListener("input", () => {
      if (status) status.textContent = "";
    });

    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const endpoint = form.dataset.endpoint?.trim();

      /*
       * Integración opcional con un backend o servicio de formularios.
       * Define data-endpoint="https://..." en el formulario para activarla.
       */
      if (endpoint) {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        if (status) status.textContent = "Enviando tu mensaje…";
        if (submitButton) submitButton.disabled = true;

        fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        })
          .then((response) => {
            if (!response.ok) throw new Error("No se pudo enviar el formulario");
            form.reset();
            if (status) status.textContent = "Mensaje enviado. Te responderemos muy pronto.";
          })
          .catch(() => {
            if (status) {
              status.textContent =
                "No pudimos enviar el mensaje. Escríbenos a hola@sayucreativelab.com.";
            }
          })
          .finally(() => {
            if (submitButton) submitButton.disabled = false;
          });

        return;
      }

      /* Fallback sin backend: abre el cliente de correo con todo listo. */
      event.preventDefault();

      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const service = String(data.get("service") || "").trim();
      const message = String(data.get("message") || "").trim();
      const action = form.getAttribute("action") || "mailto:hola@sayucreativelab.com";
      const recipient = action.replace(/^mailto:/i, "").split("?")[0];

      const subject = `Nuevo proyecto · ${service || "Consulta"} · ${name}`;
      const body = [
        "Hola Sayu,",
        "",
        `Mi nombre es ${name}.`,
        `Mi correo es ${email}.`,
        "",
        `Servicio de interés: ${service || "Por definir"}`,
        "",
        "Sobre el proyecto:",
        message,
        "",
        "¡Gracias!",
      ].join("\n");

      if (status) {
        status.textContent = "Abriendo tu aplicación de correo…";
      }

      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* Año actual en el footer ---------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
})();
