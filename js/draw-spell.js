(function () {
  var data = window.JingjiaProjectData;
  if (!data) return;

  var container = document.getElementById("playground-cards");
  var drawBtn = document.getElementById("draw-spell-btn");
  var filterBtns = document.querySelectorAll(".playground-filter-btn");
  if (!container || !drawBtn) return;

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var currentFilter = "all";
  var isAnimating = false;

  function getFiltered() {
    return data.projects.filter(function (p) {
      if (currentFilter === "all") return true;
      return (p.category || "built") === currentFilter;
    });
  }

  function renderCard(project, index) {
    var delay = REDUCED ? 0 : index * 60;
    return (
      '<a class="playground-card" href="project.html?project=' + encodeURIComponent(project.slug) +
      '" style="animation-delay:' + delay + 'ms" aria-label="' + data.escapeHtml(project.title) + '">' +
      '<div class="playground-card-inner">' +
      '<div class="playground-card-front">' +
      '<span class="playground-card-year">' + data.escapeHtml(project.year) + '</span>' +
      '<h3 class="playground-card-title">' + data.escapeHtml(project.title) + '</h3>' +
      '<p class="playground-card-role">' + data.escapeHtml(project.role) + '</p>' +
      '<div class="playground-card-tags">' +
      (project.tags || []).slice(0, 3).map(function (t) {
        return '<span class="pg-tag">' + data.escapeHtml(t) + '</span>';
      }).join('') +
      '</div></div>' +
      '<div class="playground-card-back">' +
      '<pre class="spell-notation">cast("' + data.escapeHtml(project.title) + '")\n' +
      'role: ' + data.escapeHtml(project.role) + '\n' +
      'stack: ' + (project.tags || []).join(', ') + '\n' +
      'effect: ' + data.escapeHtml(data.stripHtml(project.bullets[0] || '').slice(0, 80)) + '</pre>' +
      '</div></div></a>'
    );
  }

  function renderAll(animate) {
    var projects = getFiltered();
    var cls = animate && !REDUCED ? ' shuffling' : '';
    container.className = 'playground-grid' + cls;
    container.innerHTML = projects.map(renderCard).join('');
    if (animate && !REDUCED) {
      setTimeout(function () { container.classList.remove('shuffling'); }, 80);
      setTimeout(function () {
        var cards = container.querySelectorAll('.playground-card');
        cards.forEach(function (c) { c.classList.add('dealt'); });
      }, 150);
    } else {
      var cards = container.querySelectorAll('.playground-card');
      cards.forEach(function (c) { c.classList.add('dealt'); });
    }
  }

  function shuffleAndDraw() {
    if (isAnimating) return;
    isAnimating = true;
    container.classList.add("shuffle-out");

    setTimeout(function () {
      var filtered = getFiltered();
      var shuffled = filtered.slice().sort(function () { return Math.random() - 0.5; });
      var count = Math.min(shuffled.length, 6);
      var selected = shuffled.slice(0, count);

      container.innerHTML = selected.map(renderCard).join('');
      container.classList.remove("shuffle-out");
      container.classList.add("shuffle-in");

      setTimeout(function () {
        var cards = container.querySelectorAll('.playground-card');
        cards.forEach(function (c) { c.classList.add('dealt'); });
      }, 100);

      setTimeout(function () {
        container.classList.remove("shuffle-in");
        isAnimating = false;
      }, 800);
    }, REDUCED ? 50 : 450);
  }

  drawBtn.addEventListener("click", shuffleAndDraw);

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      this.classList.add("active");
      currentFilter = this.getAttribute("data-filter");
      renderAll(true);
    });
  });

  renderAll(false);
})();
