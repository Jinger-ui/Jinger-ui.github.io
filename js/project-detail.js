(function () {
  var data = window.JingjiaProjectData;
  if (!data) return;

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("project");
  var project = data.getBySlug(slug) || data.projects[0];
  if (!project) return;

  var index = data.projects.findIndex(function (item) {
    return item.slug === project.slug;
  });
  var prevProject = data.projects[(index - 1 + data.projects.length) % data.projects.length];
  var nextProject = data.projects[(index + 1) % data.projects.length];

  function setHtml(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setLink(id, href, label) {
    var el = document.getElementById(id);
    if (!el) return;
    el.href = href;
    el.textContent = label;
  }

  document.title = project.title + " | Jingjia's Grimoire";

  setText("project-title", project.title);
  setText("project-role", project.role);
  setText("project-year", project.year);
  setText("project-role-summary", project.role);
  setText("project-year-summary", project.year);
  setText(
    "project-intro",
    project.description || data.stripHtml(project.bullets[0] || "")
  );
  setText(
    "project-description",
    project.description || data.stripHtml(project.bullets[0] || "")
  );
  setText("project-breadcrumb", "Spell Scroll / " + project.year);
  setHtml("project-cover", data.renderCover(project, "project-cover-media"));
  setHtml("project-gallery", data.renderGallery(project));
  var gallerySection = document.getElementById("project-gallery-section");
  if (gallerySection) {
    gallerySection.hidden = !(project.detailImages && project.detailImages.length);
  }
  setHtml(
    "project-tag-list",
    (project.tags || [])
      .map(function (tag) {
        return '<span class="proj-tag">' + data.escapeHtml(tag) + "</span>";
      })
      .join("")
  );
  setHtml(
    "project-bullets",
    project.bullets
      .map(function (bullet) {
        return "<li>" + data.escapeHtml(data.stripHtml(bullet)) + "</li>";
      })
      .join("")
  );
  setHtml(
    "project-stack",
    (project.tags || [])
      .slice(0, 3)
      .map(function (tag) {
        return '<span class="stack-pill">' + data.escapeHtml(tag) + "</span>";
      })
      .join("")
  );
  setHtml(
    "project-stack-tags",
    (project.tags || [])
      .map(function (tag) {
        return '<span class="stack-pill">' + data.escapeHtml(tag) + "</span>";
      })
      .join("")
  );

  setLink(
    "prev-project",
    "project.html?project=" + encodeURIComponent(prevProject.slug),
    "Previous: " + prevProject.title
  );
  setLink(
    "next-project",
    "project.html?project=" + encodeURIComponent(nextProject.slug),
    "Next: " + nextProject.title
  );

  var related = data.projects
    .filter(function (item) {
      return item.slug !== project.slug;
    })
    .slice(0, 3);

  setHtml(
    "related-projects",
    related
      .map(function (item) {
        return (
          '<a class="related-card" href="project.html?project=' +
          encodeURIComponent(item.slug) +
          '">' +
          '<span class="related-year">' +
          data.escapeHtml(item.year) +
          "</span>" +
          '<h3 class="related-title">' +
          data.escapeHtml(item.title) +
          "</h3>" +
          '<p class="related-copy">' +
          data.escapeHtml(data.stripHtml(item.bullets[0] || "")) +
          "</p></a>"
        );
      })
      .join("")
  );
})();
