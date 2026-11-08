// Build every document in papers-src/docs into a PDF in public/pdfs/,
// and write the website library (src/data/library.json).
//
//   node papers-src/build.mjs                 build all
//   node papers-src/build.mjs g10-si-mp01     build matching ids only
//
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const run = promisify(execFile);
const ROOT = dirname(fileURLToPath(import.meta.url));
const opt = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv.splice(i, 2)[1] : null; };
const SRC_OPT = opt("--src"), OUT_OPT = opt("--out");   // e.g. --src local-docs/templates --out local-docs/preview
const DOCS = SRC_OPT ? join(process.cwd(), SRC_OPT) : join(ROOT, "docs");
const OUT_HTML = join(ROOT, "build");
const OUT_PDF = join(ROOT, "..", "public", "pdfs");
const LIBRARY = join(ROOT, "..", "src", "data", "library.json");

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
].find(existsSync);

const KIND = {
  si: { "Model Paper": "ප්‍රශ්න පත්‍රය", "Marking Scheme": "ලකුණු දීමේ පටිපාටිය", "Worked Answers": "පිළිතුරු හා විසඳුම්", "Tutorial": "පුහුණු ප්‍රශ්න පත්‍රය" },
  en: { "Model Paper": "Question Paper", "Marking Scheme": "Marking Scheme", "Worked Answers": "Worked Answers", "Tutorial": "Tutorial" },
};

const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function parse(file) {
  const src = readFileSync(join(DOCS, file), "utf8");
  const m = src.match(/<script type="application\/json" id="meta">([\s\S]*?)<\/script>/);
  if (!m) throw new Error(`${file}: missing meta block`);
  const meta = JSON.parse(m[1]);
  const body = src.replace(m[0], "").trim();
  for (const k of ["id", "grade", "lang", "kind", "title"]) if (meta[k] == null) throw new Error(`${file}: meta.${k} missing`);
  return { meta, body };
}

function header(meta) {
  const si = meta.lang === "si";
  const ol = meta.grade === 11;
  const left = ol
    ? (si ? "අ.පො.ස. (සා.පෙ.)  ·  ගණිතය" : "G.C.E. (O/L)  ·  Mathematics")
    : (si ? `${meta.grade} ශ්‍රේණිය  ·  ගණිතය` : `Grade ${meta.grade}  ·  Mathematics`);
  const right = si ? "සිංහල මාධ්‍යය" : "English Medium";
  const by = si ? "සකස් කළේ" : "Prepared by";
  return `
  <header class="doc-head">
    <div class="dh-bar"><span>${left}</span><span class="dh-medium">${right}</span></div>
    <div class="dh-main">
      <div class="dh-kind">${esc(meta.kindLabel ?? KIND[meta.lang][meta.kind])}</div>
      <h1 class="dh-title">${esc(meta.title)}</h1>
      ${meta.subtitle ? `<p class="dh-sub">${esc(meta.subtitle)}</p>` : ""}
    </div>
    <div class="dh-by">${by} <b>Chalaka Perera</b> · BSc (Hons) Computer Engineering (First Class) · University of Peradeniya</div>
  </header>`;
}

function page({ meta, body }) {
  return `<!doctype html>
<html lang="${meta.lang}">
<head>
<meta charset="utf-8">
<title>${esc(meta.title)} · Grade ${meta.grade} · Chalaka Perera</title>
<link rel="stylesheet" href="../template/paper.css">
</head>
<body class="lang-${meta.lang} kind-${meta.kind.toLowerCase().replace(/\s+/g, "-")}">
${header(meta)}
${body}
${meta.kind === "Model Paper" ? `<p class="end-mark">*** ${meta.lang === "si" ? "සියලු හිමිකම් ඇවිරිණි" : "All rights reserved"} ***</p>` : ""}
</body>
</html>`;
}

// Unpublished docs are built to papers-src/unpublished/ so they are never deployed.
const pdfPath = (meta) =>
  OUT_OPT ? join(process.cwd(), OUT_OPT, `${meta.id}.pdf`)
  : meta.publish === false
    ? join(ROOT, "unpublished", `${meta.id}.pdf`)
    : join(OUT_PDF, `grade-${meta.grade}`, `${meta.id}.pdf`);

async function build(doc) {
  const html = join(OUT_HTML, `${doc.meta.id}.html`);
  writeFileSync(html, page(doc));
  const out = pdfPath(doc.meta);
  mkdirSync(dirname(out), { recursive: true });
  await run(CHROME, [
    "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
    "--run-all-compositor-stages-before-draw", "--virtual-time-budget=8000",
    `--print-to-pdf=${out}`, pathToFileURL(html).href,
  ]);
  console.log("✓", doc.meta.id);
}

// ---------- main ----------
if (!CHROME) throw new Error("Chrome / Edge not found");
mkdirSync(OUT_HTML, { recursive: true });
const filter = process.argv.slice(2);
const docs = readdirSync(DOCS).filter((f) => f.endsWith(".html")).sort().map(parse);
const todo = filter.length ? docs.filter((d) => filter.some((f) => d.meta.id.includes(f))) : docs;

for (let i = 0; i < todo.length; i += 4) await Promise.all(todo.slice(i, i + 4).map(build)); // 4 at a time

if (OUT_OPT) process.exit(0); // preview builds never touch the website library

// Library for the website: only published docs whose PDF exists.
const library = docs
  .filter((d) => d.meta.publish !== false && existsSync(pdfPath(d.meta)))
  .map(({ meta }) => ({
    id: meta.id,
    title: meta.webTitle ?? meta.title,
    grade: meta.grade,
    medium: meta.lang === "si" ? "Sinhala" : "English",
    kind: meta.kind,
    topic: meta.topic ?? null,
    number: meta.number ?? null,
    pairOf: meta.pairOf ?? null,
    file: `/pdfs/grade-${meta.grade}/${meta.id}.pdf`,
  }));
writeFileSync(LIBRARY, JSON.stringify(library, null, 2) + "\n");
console.log(`library.json: ${library.length} published docs`);
