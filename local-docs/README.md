# local-docs: paper templates

Templates for every kind of document on the website, in the **same design** as the published papers:

| Template | Sinhala | English | Shows on website as |
|---|---|---|---|
| Question paper | `templates/model-paper.si.html` | `templates/model-paper.en.html` | Papers → Model Papers |
| Marking scheme | `templates/marking-scheme.si.html` | `templates/marking-scheme.en.html` | "Marking scheme" link on its paper's card |
| Worked answers | `templates/worked-answers.si.html` | `templates/worked-answers.en.html` | Papers → Worked Answers |
| Tutorial notes | `templates/tutorial.si.html` | `templates/tutorial.en.html` | Tutorials page |

`preview/` has each template built as a PDF so you can see what it looks like.

## Make a new document (3 steps)

```bash
# 1. Create it from a template (the id and titles are filled in for you)
node local-docs/new.mjs paper    si 10 7                      # Model Paper 07, Sinhala
node local-docs/new.mjs scheme   si 10 7                      # its marking scheme
node local-docs/new.mjs answers  en 9  "Circles"              # worked answers
node local-docs/new.mjs tutorial si 10 "Quadratic Equations"  # tutorial notes

# 2. Edit the new file in papers-src/docs/ and replace the example content

# 3. Build: makes the PDF and adds it to the website
node papers-src/build.mjs g10-si-mp07
```

Then run `npm run dev` to check it on the site, and deploy.

## Rules that keep every paper consistent

- **Never** type your name, degree or page numbers. The header and footer add them.
- Keep the classes from the template (`q`, `part`, `mk`, `ans`, `scheme`, …). Never style one doc by hand.
- Fractions: `<span class="frac"><span>22</span><span>7</span></span>`. Powers: `x<sup>2</sup>`. Use the real minus sign `−`.
- Diagrams go in `papers-src/assets/<id>/` and are used with `<figure class="fig"><img src="../assets/<id>/fig-1.svg" style="width:80mm"></figure>`.
- Not ready to publish yet? Set `"publish": false` in the meta. The PDF goes to `papers-src/unpublished/` and stays off the website.
- Sinhala spellings we use: ලක්ෂ්‍යය / ලක්ෂ්‍යයේ / ලක්ෂ්‍යයක්, ඍණ, සාමාන්‍යයෙන්, ශූන්‍යයෙන්.

## Preview the templates again

```bash
node papers-src/build.mjs --src local-docs/templates --out local-docs/preview
```

Full component reference: `papers-src/GUIDE.md`.
