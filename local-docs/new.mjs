// Start a new document from a template.
//
//   node local-docs/new.mjs paper    si 10 7                 -> papers-src/docs/g10-si-mp07-paper.html
//   node local-docs/new.mjs scheme   si 10 7                 -> papers-src/docs/g10-si-mp07-scheme.html
//   node local-docs/new.mjs answers  en 9  "Circles"         -> papers-src/docs/g9-en-circles-answers.html
//   node local-docs/new.mjs tutorial si 10 "Quadratic Equations" -> papers-src/docs/g10-si-quadratic-equations-tutorial.html
//
// Then edit the new file and run:  node papers-src/build.mjs <id>
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOCS = join(HERE, "..", "papers-src", "docs");
const [type, lang, gradeArg, arg] = process.argv.slice(2);

const TEMPLATE = { paper: "model-paper", scheme: "marking-scheme", answers: "worked-answers", tutorial: "tutorial" };
if (!TEMPLATE[type] || !["si", "en"].includes(lang) || !gradeArg || !arg) {
  console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(0, 8).join("\n"));
  process.exit(1);
}

const grade = Number(gradeArg);
const nn = String(arg).padStart(2, "0");
const slug = String(arg).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const id = {
  paper: `g${grade}-${lang}-mp${nn}-paper`,
  scheme: `g${grade}-${lang}-mp${nn}-scheme`,
  answers: `g${grade}-${lang}-${slug}-answers`,
  tutorial: `g${grade}-${lang}-${slug}-tutorial`,
}[type];

const out = join(DOCS, `${id}.html`);
if (existsSync(out)) { console.error(`Already exists: ${out}`); process.exit(1); }

let src = readFileSync(join(HERE, "templates", `${TEMPLATE[type]}.${lang}.html`), "utf8");
const meta = JSON.parse(src.match(/<script type="application\/json" id="meta">([\s\S]*?)<\/script>/)[1]);
const oldId = meta.id;

meta.id = id;
meta.grade = grade;
if (type === "paper" || type === "scheme") {
  meta.number = Number(arg);
  meta.title = lang === "si" ? `ආදර්ශ ප්‍රශ්න පත්‍රය — ${nn}` : `Model Paper — ${nn}`;
  meta.webTitle = `Model Paper ${nn}${type === "scheme" ? " — Marking Scheme" : ""}`;
  if (type === "scheme") meta.pairOf = id.replace(/-scheme$/, "-paper");
} else {
  meta.topic = arg;
  meta.title = lang === "en" ? arg : "‹සිංහල මාතෘකාව›";
  meta.webTitle = `${arg} — ${type === "answers" ? "Worked Answers" : "Tutorial Notes"}`;
}

src = src.replace(/(<script type="application\/json" id="meta">)[\s\S]*?(<\/script>)/, `$1\n${JSON.stringify(meta, null, 2)}\n$2`);
src = src.split(oldId).join(id); // asset paths inside comments
writeFileSync(out, src);
console.log(`Created ${out}`);
if (lang === "si" && type !== "paper" && type !== "scheme") console.log("→ Set the Sinhala \"title\" in the meta block.");
console.log(`Edit it, then build:  node papers-src/build.mjs ${id}`);
