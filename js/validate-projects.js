#!/usr/bin/env node
// Validates all projects have categories assigned in playgroundProjects.ts

const fs = require('fs');
const path = require('path');

const tomlContent = fs.readFileSync(path.join(__dirname, '..', 'content', 'projects.toml'), 'utf8');
const tsContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'playgroundProjects.ts'), 'utf8');

// Extract project titles from TOML [[items]] blocks only (skip card-level title)
const titleRegex = /\[\[items\]\][\s\S]*?^title\s*=\s*"(.+)"/gm;
const titles = [];
let match;
while ((match = titleRegex.exec(tomlContent)) !== null) {
  titles.push(match[1]);
}

// Extract categories from TS
const categoryRegex = /'([^']+)':\s*'(built|designed|researched|explored)'/g;
const categories = {};
while ((match = categoryRegex.exec(tsContent)) !== null) {
  categories[match[1]] = match[2];
}

const validCategories = ['built', 'designed', 'researched', 'explored'];
let errors = 0;

console.log(`\nProject Category Validation`);
console.log(`${'='.repeat(50)}`);
console.log(`Total projects in TOML: ${titles.length}`);
console.log(`Total category mappings: ${Object.keys(categories).length}`);
console.log();

for (const title of titles) {
  const cat = categories[title];
  if (!cat) {
    console.log(`  MISSING: "${title}" has no category mapping`);
    errors++;
  } else if (!validCategories.includes(cat)) {
    console.log(`  INVALID: "${title}" has category "${cat}"`);
    errors++;
  } else {
    console.log(`  OK: "${title}" → ${cat}`);
  }
}

console.log();
console.log(`Category count: ${Object.keys(categories).length}`);
console.log(`Missing: ${errors}`);
console.log(`Expected: 16`);

if (titles.length !== 16) {
  console.error(`\nERROR: Expected 16 projects, found ${titles.length}`);
  process.exit(1);
}

if (errors > 0) {
  console.error(`\nERROR: ${errors} project(s) missing valid category`);
  process.exit(1);
}

console.log(`\nAll projects validated successfully.`);
process.exit(0);
