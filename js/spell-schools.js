(function () {
  var schoolEls = document.querySelectorAll(".spell-school");
  var skillNodes = document.querySelectorAll(".skill-node");
  if (!schoolEls.length) return;

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  schoolEls.forEach(function (el) { observer.observe(el); });

  skillNodes.forEach(function (node) {
    node.addEventListener("mouseenter", function () {
      if (REDUCED) return;
      var school = this.closest(".spell-school");
      if (!school) return;
      var siblings = school.querySelectorAll(".skill-node");
      siblings.forEach(function (s) { s.classList.add("constellation-active"); });
      school.classList.add("school-glow");
    });

    node.addEventListener("mouseleave", function () {
      var school = this.closest(".spell-school");
      if (!school) return;
      var siblings = school.querySelectorAll(".skill-node");
      siblings.forEach(function (s) { s.classList.remove("constellation-active"); });
      school.classList.remove("school-glow");
    });

    node.addEventListener("click", function () {
      var tooltip = this.querySelector(".skill-tooltip");
      if (tooltip) {
        tooltip.classList.toggle("show");
        var allTooltips = document.querySelectorAll(".skill-tooltip.show");
        allTooltips.forEach(function (t) {
          if (t !== tooltip) t.classList.remove("show");
        });
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".skill-node")) {
      var tooltips = document.querySelectorAll(".skill-tooltip.show");
      tooltips.forEach(function (t) { t.classList.remove("show"); });
    }
  });
})();
