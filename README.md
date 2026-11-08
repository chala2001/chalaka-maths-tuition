# Chalaka Perera · Maths Tuition

Website for my Grade 9 – 11 / O/L Mathematics classes, in English and Sinhala medium.
Students can view and download model papers, marking schemes and worked answers for free.

**Live:** _coming soon_

![Grade 10 · Grade 9](https://img.shields.io/badge/grades-9%20%C2%B7%2010%20%C2%B7%2011-1b2a4e) ![Medium](https://img.shields.io/badge/medium-English%20%C2%B7%20%E0%B7%83%E0%B7%92%E0%B6%82%E0%B7%84%E0%B6%BD-b8862f) ![Vercel](https://img.shields.io/badge/hosted%20on-Vercel-black)

## What's inside

| | |
|---|---|
| **G.C.E. O/L model papers** | 6 full papers (Paper I + Paper II) in English and Sinhala, each with marking schemes, following the latest O/L exam structure |
| **Grade 10 model papers** | 6 full papers in English and Sinhala, each with its marking scheme |
| **Grade 9 model papers** | 6 third-term papers in English and Sinhala, each with its marking scheme |
| **Grade 9 tutorials** | Algebraic Fractions, Area, Axioms, Graphs, Inequalities, Loci & Constructions, in English and Sinhala, each with worked answers |
| **Paper template** | Every PDF is built from one HTML/CSS template, so all papers look the same |

## Tech

- React 18 + TypeScript + Vite
- React Router
- Static site, no backend. Hosted on Vercel.
- PDFs are generated from HTML with headless Chrome (`papers-src/build.mjs`)

## Project structure

```
src/                  website (pages, components, data)
public/pdfs/          built PDFs served by the site
papers-src/
  docs/               source of every paper (one HTML file each)
  assets/             diagrams used in the papers
  template/           paper.css + fonts (shared design)
  changes/            notes on corrections made to each paper
  originals/          original PDFs
  build.mjs           builds PDFs + the website's paper list
  GUIDE.md            how a paper is written
```

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

## Add a new paper

```bash
# copy a doc in papers-src/docs/ (or use the private templates), then edit it
node papers-src/build.mjs g10-si-mp07        # builds the PDF and adds it to the site
```

More in [`papers-src/GUIDE.md`](papers-src/GUIDE.md).

## Contact

**Chalaka Perera**, BSc (Hons) Computer Engineering (First Class), University of Peradeniya
WhatsApp / Call: 077 429 9094 · chalakasamith@gmail.com

---

© Chalaka Perera. Papers and answers may be used freely for personal study. Please don't republish them without permission.
