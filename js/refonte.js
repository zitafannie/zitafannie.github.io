/* =========================================================================
   Zita Fannie — Portfolio « La Rédaction »
   JavaScript vanilla, sans dépendance.
   ========================================================================= */
(function () {
  "use strict";

  var doc = document;
  var body = doc.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu mobile ---------- */
  var toggle = doc.querySelector(".nav-toggle");
  var mobileMenu = doc.getElementById("mobile-menu");

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (toggle) toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!body.classList.contains("menu-open"));
    });
  }
  if (mobileMenu) {
    mobileMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
  }
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Scrollspy (lien actif) ---------- */
  var navAnchors = Array.prototype.slice.call(doc.querySelectorAll(".nav-links a"));
  var sections = navAnchors
    .map(function (a) { return doc.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spyObs.observe(s); });
  }

  /* ---------- Filtre portfolio ---------- */
  var filterBtns = doc.querySelectorAll(".filters button");
  var galItems = doc.querySelectorAll(".gal-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      galItems.forEach(function (item) {
        var show = f === "all" || item.getAttribute("data-cat") === f;
        item.classList.toggle("hide", !show);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = doc.getElementById("lightbox");
  var lbImg = doc.getElementById("lbImg");
  var lbClose = doc.getElementById("lbClose");
  var lastFocus = null;

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lbImg.setAttribute("src", src);
    lbImg.setAttribute("alt", alt || "");
    lightbox.classList.add("open");
    lastFocus = doc.activeElement;
    lbClose.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lbImg.setAttribute("src", "");
    if (lastFocus) lastFocus.focus();
  }
  galItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var full = item.getAttribute("data-full");
      var img = item.querySelector("img");
      openLightbox(full, img ? img.getAttribute("alt") : "");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Bouton retour en haut ---------- */
  var toTop = doc.getElementById("toTop");
  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle("show", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Formulaire de contact → mailto ---------- */
  var form = doc.getElementById("contactForm");
  var note = doc.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var nom = doc.getElementById("nom").value.trim();
      var email = doc.getElementById("email").value.trim();
      var objet = doc.getElementById("objet").value.trim();
      var message = doc.getElementById("message").value.trim();

      var subject = encodeURIComponent(objet || ("Message de " + nom));
      var bodyText = encodeURIComponent(
        "Nom : " + nom + "\n" +
        "Email : " + email + "\n\n" +
        message
      );
      window.location.href =
        "mailto:fannie.andria15@gmail.com?subject=" + subject + "&body=" + bodyText;

      if (note) {
        note.textContent = "Votre logiciel de messagerie devrait s'ouvrir. Sinon, écrivez directement à fannie.andria15@gmail.com.";
      }
    });
  }

  /* ---------- Année du footer ---------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) {
    var y = new Date().getFullYear();
    if (y && !isNaN(y)) yearEl.textContent = y;
  }
})();
