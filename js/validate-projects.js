#!/usr/bin/env node

var fs = require("fs");
var path = require("path");

var REQUIRED_COUNT = 16;
var VALID_CATEGORIES = ["built", "designed", "researched", "explored"];
var REQUIRED_FIELDS = ["slug", "title", "year", "role", "description", "tags", "bullets", "category"];

var dataPath = path.join(__dirname, "project-data.js");
var source = fs.readFileSync(dataPath, "utf-8");

var mockGlobal = {};
var wrapped = "(function(global){" + source.replace(/\(function\s*\(\s*global\s*\)\s*\{/, "").replace(/\}\)\(window\);?\s*$/, "") + "})(mockGlobal);";

try {
  var fn = new Function("mockGlobal", wrapped);
  fn(mockGlobal);
} catch (e) {
  console.error("FAIL: Could not parse project-data.js");
  console.error(e.message);
  process.exit(1);
}

if (!mockGlobal.JingjiaProjectData || !mockGlobal.JingjiaProjectData.projects) {
  console.error("FAIL: JingjiaProjectData.projects not found");
  process.exit(1);
}

var projects = mockGlobal.JingjiaProjectData.projects;
var errors = [];

if (projects.length !== REQUIRED_COUNT) {
  errors.push("Expected " + REQUIRED_COUNT + " projects, found " + projects.length);
}

var slugs = {};
projects.forEach(function (p, i) {
  var label = "Project " + (i + 1) + " (" + (p.slug || "no-slug") + ")";

  REQUIRED_FIELDS.forEach(function (field) {
    if (p[field] === undefined || p[field] === null) {
      errors.push(label + ": missing field '" + field + "'");
    }
  });

  if (typeof p.slug === "string" && p.slug.trim()) {
    if (slugs[p.slug]) {
      errors.push(label + ": duplicate slug '" + p.slug + "'");
    }
    slugs[p.slug] = true;
  }

  if (typeof p.category === "string") {
    if (VALID_CATEGORIES.indexOf(p.category) === -1) {
      errors.push(label + ": invalid category '" + p.category + "' (expected one of: " + VALID_CATEGORIES.join(", ") + ")");
    }
  } else {
    errors.push(label + ": category must be a non-empty string");
  }

  if (!Array.isArray(p.bullets) || p.bullets.length === 0) {
    errors.push(label + ": 'bullets' must be a non-empty array");
  }

  if (!Array.isArray(p.tags)) {
    errors.push(label + ": 'tags' must be an array");
  }
});

if (errors.length > 0) {
  console.error("VALIDATION FAILED (" + errors.length + " error" + (errors.length > 1 ? "s" : "") + "):\n");
  errors.forEach(function (e) { console.error("  - " + e); });
  process.exit(1);
}

console.log("PASS: All " + REQUIRED_COUNT + " projects validated successfully.");
console.log("");
projects.forEach(function (p, i) {
  console.log("  " + (i + 1).toString().padStart(2) + ". " + p.slug + " [" + p.category + "]");
});
process.exit(0);
