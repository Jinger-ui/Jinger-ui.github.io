(function () {
  var path = document.getElementById("journey-path");
  var nodes = document.querySelectorAll(".journey-node");
  var details = document.querySelectorAll(".journey-detail");
  if (!path || !nodes.length) return;

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var totalLength;
  try {
    totalLength = path.getTotalLength();
  } catch (e) {
    var y1 = parseFloat(path.getAttribute("y1") || 0);
    var y2 = parseFloat(path.getAttribute("y2") || 800);
    totalLength = Math.abs(y2 - y1);
  }
  path.style.strokeDasharray = totalLength;
  path.style.strokeDashoffset = REDUCED ? "0" : totalLength;

  var drawn = false;
  var activeNode = null;

  function animatePath(progress) {
    var offset = totalLength * (1 - progress);
    path.style.strokeDashoffset = offset;

    for (var i = 0; i < nodes.length; i++) {
      var threshold = (i + 0.5) / nodes.length;
      if (progress >= threshold) {
        nodes[i].classList.add("visible");
      }
    }
  }

  if (!REDUCED) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !drawn) {
          drawn = true;
          var start = null;
          var duration = 2500;
          function step(ts) {
            if (!start) start = ts;
            var elapsed = ts - start;
            var p = Math.min(elapsed / duration, 1);
            var ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            animatePath(ease);
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.15 });

    var journeySection = document.getElementById("journey");
    if (journeySection) observer.observe(journeySection);
  } else {
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("visible");
  }

  for (var j = 0; j < nodes.length; j++) {
    (function (index) {
      nodes[index].addEventListener("click", function () {
        var slug = this.getAttribute("data-journey");
        if (activeNode === slug) {
          closeDetail();
          return;
        }
        activeNode = slug;
        for (var k = 0; k < nodes.length; k++) nodes[k].classList.remove("active");
        this.classList.add("active");
        for (var d = 0; d < details.length; d++) {
          if (details[d].getAttribute("data-journey") === slug) {
            details[d].classList.add("open");
          } else {
            details[d].classList.remove("open");
          }
        }
      });

      nodes[index].addEventListener("mouseenter", function () {
        this.classList.add("hovered");
      });
      nodes[index].addEventListener("mouseleave", function () {
        this.classList.remove("hovered");
      });
    })(j);
  }

  function closeDetail() {
    activeNode = null;
    for (var k = 0; k < nodes.length; k++) nodes[k].classList.remove("active");
    for (var d = 0; d < details.length; d++) details[d].classList.remove("open");
  }
})();
