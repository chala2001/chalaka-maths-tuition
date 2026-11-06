# Paper conversion guide

Every PDF on the website is built from one HTML source in `papers-src/docs/` using one shared
template (`template/paper.css`). The build script adds the header, footer and fonts, so a doc file
only holds **meta + content**.

```
papers-src/
  docs/<id>.html        one file per PDF (meta block + body content)
  assets/<id>/fig-N.svg diagrams / images used by that doc
  changes/<id>.md       log of every typo fix + flagged issues
  template/paper.css    shared styles (do NOT edit for one doc)
  originals/            the original PDFs (source material, not deployed)
  unpublished/          PDFs of docs with "publish": false (not deployed)
  build.mjs             node papers-src/build.mjs [id]  -> public/pdfs/grade-N/<id>.pdf
  tools/pdftool.py      text / render / crop / images / drawings helpers
```

Reference example: `docs/g10-si-mp01-paper.html` (first page shows every paper component).

## 1. Ids and meta

| Doc | id | kind | title | webTitle |
|---|---|---|---|---|
| G10 model paper N (Sinhala) | `g10-si-mp0N-paper` | `Model Paper` | `ආදර්ශ ප්‍රශ්න පත්‍රය — 0N` | `Model Paper 0N` |
| its marking scheme | `g10-si-mp0N-scheme` | `Marking Scheme` | `ආදර්ශ ප්‍රශ්න පත්‍රය — 0N` | `Model Paper 0N — Marking Scheme` |
| G9 topic answers (English) | `g9-en-<topic-slug>-answers` | `Worked Answers` | English topic name, e.g. `Algebraic Fractions` | `<Topic> — Worked Answers` |
| G9 topic answers (Sinhala) | `g9-si-<topic-slug>-answers` | `Worked Answers` | Sinhala topic name, e.g. `වීජීය භාග` | `<English topic> — Worked Answers` |

```html
<script type="application/json" id="meta">
{
  "id": "g10-si-mp01-scheme",
  "grade": 10,
  "lang": "si",                       // "si" or "en"
  "kind": "Marking Scheme",           // "Model Paper" | "Marking Scheme" | "Worked Answers"
  "number": 1,                        // model papers / schemes only
  "topic": "Algebraic Fractions",     // grade 9 only (English name, also for Sinhala docs)
  "title": "ආදර්ශ ප්‍රශ්න පත්‍රය — 01",
  "subtitle": "තෙවන වාර පරීක්ෂණය (සම්පූර්ණ විෂය නිර්දේශය)",   // keep the original subtitle line if any
  "webTitle": "Model Paper 01 — Marking Scheme",
  "pairOf": "g10-si-mp01-paper",      // schemes only
  "publish": true
}
</script>
```

`"publish": false` builds the PDF into `papers-src/unpublished/` and keeps it off the website
(used for the Model Paper 04–06 schemes until their question papers are added — then set both to true).
Model papers get a generated "*** සියලු හිමිකම් ඇවිරිණි ***" end line; don't write one.

The header (grade · subject · medium bar, kind badge, title, subtitle, "Prepared by Chalaka Perera …")
and the footer are generated. **Never** put Chalaka Perera / degree / university / page numbers in the body.
Drop the old header lines and old footer completely.

## 2. Components (use only these classes)

**Exam front matter**
- `<div class="exam-meta"><div>කාලය: <span>පැය 3</span></div><div>මුළු ලකුණු: <span>100</span></div></div>`
- `<div class="name-line"><div>නම:</div><div class="short">පන්තිය:</div><div class="short">දිනය:</div></div>`
- `<div class="box instructions"><h3>උපදෙස්:</h3><ul><li>…</li></ul></div>` (scheme notes box: same, title as original e.g. `සටහන (ගුරුවරුන් සඳහා):`)
- `<table class="grid">` generic bordered table (`th` header cells). Add `wide` for full width, `left` for left aligned cells.

**Sections**
- `<h2 class="section">A කොටස</h2>` + optional `<p class="section-note">…</p>`
- Wrap all of Part A questions in `<div class="qa"> … </div>` (gives dashed separators).
- `<div class="page-break"></div>` before Part B if the original started Part B on a new page.
- `<h3 class="qhead">ප්‍රශ්නය 4</h3>` / `Question 4` — question heading in schemes & answer sheets.

**Question (paper)**
```html
<div class="q"><span class="qn">1.</span><div class="qb">
  <p>question text</p>
  <div class="ws"></div><div class="answer-line">පිළිතුර:</div>   <!-- Part A only; ws = working space (.ws.s / .ws / .ws.l) -->
</div></div>
```
Sub-parts with marks (Part B):
```html
<div class="parts">
  <div class="part"><span class="pl">(a)</span><div>text</div><span class="mk">(ලකුණු 4)</span></div>
  <div class="part"><span class="pl">(c)</span><div>text
     <div class="part"><span class="pl">(i)</span><div>text</div><span class="mk">(ලකුණු 1)</span></div>
  </div><span class="mk"></span></div>
</div>
```

**Marking scheme**
- Part A answer: `<div class="ans"><p class="work"><b>1.</b> working…</p><p class="final">අවසාන පිළිතුර: 48</p><span class="mk">(ලකුණු 2)</span></div>`
- Part B step table:
```html
<table class="scheme">
  <tr class="sub"><td colspan="2">(a)</td></tr>
  <tr><td>step text</td><td class="m">1</td></tr>
</table>
<p class="total">මුළු ලකුණු: 10</p>
```

**Worked answers (grade 9)**
- `<div class="box formula">Formulas: …</div>` for formula lines
- `<h3 class="qhead">Question 1</h3>` then each sub answer: `<p class="sol"><span class="pl">(i)</span> Area = base × height = 14 × 6 = <b>84 cm<sup>2</sup></b></p>`

**Figures**
- `<figure class="fig"><img src="../assets/<id>/fig-1.svg" style="width:90mm"></figure>`
- Vector diagram: find its area with `pdftool.py drawings <pdf> <page>`, then
  `pdftool.py crop <pdf> <page> x0 y0 x1 y1 papers-src/assets/<id>/fig-1.svg` (prints the mm width to use).
  Leave ~6pt padding so labels are not cut. Check the crop by rendering your built PDF.
- Raster image: `pdftool.py images <pdf> papers-src/assets/<id>` then rename to fig-N.png.
- Tables in the original are **tables**, not figures — rebuild them in HTML.

**Maths**
- Fraction: `<span class="frac"><span>22</span><span>7</span></span>`; mixed: `2<span class="frac">…</span>`
- Powers `x<sup>2</sup>`, subscripts `T<sub>1</sub>`, angle hats keep the Unicode (Â, Ĉ, AÔP), √, π, °, ×, ÷, −, ≤, ≥, ∴, ≅, ∥.
- Use the real minus sign `−` as in the original.

## 3. Editing rules

1. **Do not change the core**: same questions, same order, numbers, values, marks, answers, wording.
2. **Fix clear typos** (Sinhala letters swapped/wrong, wrong vowel sign, English spelling). Only fix what you
   can SEE is wrong in the rendered original page — text extraction itself can garble Sinhala
   (missing ZWJ in ්‍ර / ්‍ය, reordered vowel signs). Always compare against the page image, and write
   correct Unicode (e.g. `ප්‍ර` = ප + ් + ZWJ + ර).
3. **Do not fix maths.** If an answer, value or mark total looks wrong, leave it and FLAG it.
4. Log everything in `papers-src/changes/<id>.md`:
   ```
   # <id>
   Source: <original file name>
   ## Typo fixes
   - p2 Q8: "ඇත්නම්" → "ඇත්නම්" (reason)
   ## Flags (not changed — needs Chalaka's decision)
   - Q14: answer gives 44 cm but working shows 42 cm
   ## Notes
   - anything unusual (non-maths content, missing parts, …)
   ```

## 4. Check before finishing

1. `node papers-src/build.mjs <id>` then `python -I papers-src/tools/pdftool.py render public/pdfs/grade-N/<id>.pdf <scratch dir>`
2. Look at every page next to the original: all questions/answers present, diagrams complete and
   readable, no overflow, tables intact, page breaks sensible (a question never split across pages).
3. Count questions/sub-parts in original vs. new — they must match.

## 5. Adding a new paper (e.g. Model Paper 04)

1. Put the original PDF in `papers-src/originals/`.
2. Create `docs/g10-si-mp04-paper.html` by copying a template from `local-docs/templates/` (or `node local-docs/new.mjs paper si 10 4`).
3. Set `"publish": true` in both `g10-si-mp04-paper` and `g10-si-mp04-scheme`.
4. `node papers-src/build.mjs` — PDFs land in `public/pdfs/`, the website list updates automatically.

## 6. Grade 9 tutorial question sheets

| Doc | id | kind | title | subtitle | webTitle |
|---|---|---|---|---|---|
| English | `g9-en-<slug>-tutorial` | `Tutorial` | `Area` | `Structured (Essay-type) Questions` (as original) | `Area — Tutorial` |
| Sinhala | `g9-si-<slug>-tutorial` | `Tutorial` | `වර්ගඵලය` | `ව්‍යුහගත (රචනා) ප්‍රශ්න` (as original) | `Area — Tutorial` |

Set `"topic"` to the English topic name. The matching worked-answers doc gets
`"pairOf": "<tutorial id>"`, so the website shows the answers on the tutorial's card.

Body:
```html
<div class="name-line"><div>Name:</div><div class="short">Date:</div></div>
<div class="box note"><b>Remember:</b> …</div>            <!-- only if the original has a "Remember" box -->
<p>Instructions: …</p>

<div class="tq">
  <h3 class="qhead">Question 1</h3>
  <p>question text</p>
  <p class="sol"><span class="pl">(i)</span> sub-question</p>
  <figure class="fig">…</figure>                         <!-- grids / diagrams: vector crop -->
  <div class="answer-box"></div>                          <!-- .s / (default) / .l / .xl -->
</div>
```
Text + diagram side by side (as in the Area sheet): wrap in `<div class="tq-row"><div>text</div><figure class="fig">…</figure></div>`.
Answer box: keep it about the size of the original's dashed box. If the original has none (blank grid to draw on), leave the box out.

## 7. Grade 9 model papers (Part I / Part II format) and their marking schemes

| Doc | id | kind | title | subtitle | webTitle |
|---|---|---|---|---|---|
| Sinhala paper N | `g9-si-mp0N-paper` | `Model Paper` | `ආදර්ශ ප්‍රශ්න පත්‍රය — 0N` | `තෙවන වාර පරීක්ෂණය` | `Model Paper 0N` |
| English paper N | `g9-en-mp0N-paper` | `Model Paper` | `Model Paper — 0N` | `Third Term Test` | `Model Paper 0N` |
| scheme (si / en) | `g9-si-mp0N-scheme` / `g9-en-mp0N-scheme` | `Marking Scheme` | same as its paper | same | `Model Paper 0N — Marking Scheme` (+ `"pairOf"`) |

Use `"number": N`, `"grade": 9`. Structure of the PAPER (keep every instruction line of the original):
```html
<div class="exam-meta"><div>කාලය: <span>පැය 3</span></div><div>මුළු ලකුණු: <span>100</span></div></div>
<div class="name-line"><div>නම / විභාග අංකය:</div></div>
<div class="box instructions"><ul><li>…original instruction bullets…</li></ul></div>
<table class="grid"> examiner table: I කොටස – A /30, I කොටස – B /20, II කොටස /50, එකතුව /100 </table>

<h2 class="section">I කොටස</h2>
<div class="qa">
  <p class="section-note">A කොටස – … (එකකට ලකුණු 2)</p>
  <div class="q"> … Q1–Q15 with .ws + .answer-line, diagrams as figure.fig (vector crop) … </div>
</div>
<p class="section-note">B කොටස – …</p>
<div class="q"> Q1, Q2 with .parts / .part / .mk exactly like G10 Part B </div>
<div class="page-break"></div>
<h2 class="section">II කොටස</h2>
<p class="section-note">ප්‍රශ්න පහකට පමණක් … (එකකට ලකුණු 10)</p>
<div class="q"> Q1–Q7 with .parts / .part / .mk </div>
```
Inline fractions like `2⅓`, `x/3`, `(x + 2)/3` → use the `.frac` component. Powers with `<sup>`.

The MARKING SCHEME (new content written by us, must be mathematically exact):
- Same notes box as the G10 schemes, adapted: Part I A = 2 marks each (1 method + 1 answer where there is working), Part I B and Part II = 10 marks each, marks per step in the right column, Part II: candidates answer any five.
- `<h2 class="section">I කොටස – A — පිළිතුරු</h2>` → one `.ans` card per question (working + `.final` + `(ලකුණු 2)`).
- `I කොටස – B` and `II කොටස` → one `.keep` block per question: `h3.qhead` + `table.scheme` + `p.total`. The step marks of every sub-part MUST add up to the marks printed on the paper for that sub-part, and every question to 10.
- Graph / construction / sketch questions: give the key values, a short description of what a correct drawing shows, and the mark points (e.g. "correct axes and scale 1, all points plotted 1, straight line 1").
- Measured answers (constructions, scale drawings): give the theoretical value and an acceptance range, e.g. "AC ≈ 6.3 cm (6.1 – 6.5 accepted)".
- English and Sinhala schemes for the same paper number are the same scheme in two languages.
