(function () {
  var nav = document.getElementById("site-nav");
  var yearEl = document.getElementById("year");
  var progress = document.getElementById("scroll-progress");
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-scroll a[href^="#"]')
  );

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  document.documentElement.classList.add("dark");

  function updateNavChrome() {
    if (nav) {
      nav.classList.toggle("is-scrolled", window.scrollY > 14);
    }
    if (progress) {
      var max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight, 1
      );
      var ratio = Math.min(Math.max(window.scrollY / max, 0), 1);
      progress.style.transform = "scaleX(" + ratio + ")";
    }
  }

  function updateActiveSection() {
    if (!navLinks.length) return;
    var currentId = "";
    var threshold = window.scrollY + 160;

    for (var i = 0; i < navLinks.length; i++) {
      var href = navLinks[i].getAttribute("href");
      if (!href) continue;
      var section = document.querySelector(href);
      if (section && section.offsetTop <= threshold) {
        currentId = href;
      }
    }

    for (var j = 0; j < navLinks.length; j++) {
      var isActive = navLinks[j].getAttribute("href") === currentId;
      navLinks[j].classList.toggle("is-active", isActive);
      if (isActive) navLinks[j].setAttribute("aria-current", "true");
      else navLinks[j].removeAttribute("aria-current");
    }
  }

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
      }
    });
  }, { threshold: 0.08 });

  var sections = document.querySelectorAll(".grimoire-section");
  sections.forEach(function (s) {
    if (REDUCED) {
      s.classList.add("section-visible");
    } else {
      sectionObserver.observe(s);
    }
  });

  function onScroll() {
    updateNavChrome();
    updateActiveSection();
  }

  updateNavChrome();
  updateActiveSection();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();
