(function () {
  var data = window.JingjiaProjectData;
  var grid = document.getElementById("proj-grid");

  if (!data || !grid) return;

  function renderCard(project) {
    var tagsHtml = (project.tags || [])
      .slice(0, 4)
      .map(function (tag) {
        return '<span class="proj-tag">' + data.escapeHtml(tag) + "</span>";
      })
      .join("");

    var excerpt = data.stripHtml(project.bullets[0] || "");

    return (
      '<a class="proj-card" href="project.html?project=' +
      encodeURIComponent(project.slug) +
      '" aria-label="Open project page for ' +
      data.escapeHtml(project.title) +
      '">' +
      data.renderCover(project, "proj-card-cover") +
      '<div class="proj-card-body">' +
      '<div class="proj-card-head">' +
      '<h3 class="proj-card-title">' +
      data.escapeHtml(project.title) +
      "</h3>" +
      '<span class="proj-card-year">' +
      data.escapeHtml(project.year) +
      "</span>" +
      "</div>" +
      '<p class="proj-card-role">' +
      data.escapeHtml(project.role) +
      "</p>" +
      '<p class="proj-card-excerpt">' +
      data.escapeHtml(excerpt) +
      "</p>" +
      '<div class="proj-card-tags">' +
      tagsHtml +
      "</div>" +
      '<span class="proj-card-hint">Open case study</span>' +
      "</div></a>"
    );
  }

  grid.innerHTML = data.projects.map(renderCard).join("");
})();
