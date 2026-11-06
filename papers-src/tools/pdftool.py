"""Helpers for converting the original PDFs into papers-src/docs HTML.

  python -I pdftool.py text   <pdf>                      -> per-page text with span styles (bold/italic/sup, size, x,y)
  python -I pdftool.py render <pdf> <outdir> [dpi]       -> page PNGs (to look at the layout / check a build)
  python -I pdftool.py crop   <pdf> <page> <x0> <y0> <x1> <y1> <out.svg>
                                                           -> exact vector crop of a diagram (page is 1-based, PDF points)
  python -I pdftool.py images <pdf> <outdir>             -> extract embedded raster images as PNG (+ their bbox)
  python -I pdftool.py drawings <pdf> <page>             -> bounding boxes of drawing clusters (to find diagram areas)
"""
import sys
import fitz

sys.stdout.reconfigure(encoding="utf-8")


def text(pdf):
    d = fitz.open(pdf)
    for pno, p in enumerate(d, 1):
        print(f"\n===== PAGE {pno}  ({p.rect.width:.0f}x{p.rect.height:.0f}) =====")
        for b in p.get_text("dict")["blocks"]:
            if b["type"] != 0:
                print(f"[IMAGE block bbox={[round(v) for v in b['bbox']]}]")
                continue
            for line in b["lines"]:
                out = []
                for s in line["spans"]:
                    t = s["text"]
                    if not t.strip():
                        out.append(t)
                        continue
                    f = s["flags"]
                    tags = []
                    if f & 16 or "Bold" in s["font"]:
                        tags.append("b")
                    if f & 2 or "Italic" in s["font"]:
                        tags.append("i")
                    if f & 1:
                        tags.append("sup")
                    out.append(f"<{'+'.join(tags)}>{t}</>" if tags else t)
                x, y = line["bbox"][:2]
                print(f"  [{x:5.0f},{y:5.0f}] " + "".join(out))


def render(pdf, outdir, dpi=80):
    import os
    os.makedirs(outdir, exist_ok=True)
    d = fitz.open(pdf)
    for i, p in enumerate(d, 1):
        path = f"{outdir}/page-{i}.png"
        p.get_pixmap(dpi=int(dpi)).save(path)
        print(path)


def crop(pdf, page, x0, y0, x1, y1, out):
    src = fitz.open(pdf)
    clip = fitz.Rect(float(x0), float(y0), float(x1), float(y1))
    doc = fitz.open()
    pg = doc.new_page(width=clip.width, height=clip.height)
    pg.show_pdf_page(pg.rect, src, int(page) - 1, clip=clip)
    svg = pg.get_svg_image(text_as_path=True)
    open(out, "w", encoding="utf-8").write(svg)
    print(f"wrote {out}  ({clip.width:.0f}x{clip.height:.0f}pt -> use width:{clip.width * 0.3528:.0f}mm)")


def images(pdf, outdir):
    import os
    os.makedirs(outdir, exist_ok=True)
    d = fitz.open(pdf)
    for pno, p in enumerate(d, 1):
        for n, info in enumerate(p.get_images(full=True), 1):
            pix = fitz.Pixmap(d, info[0])
            if pix.n - pix.alpha >= 4:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            path = f"{outdir}/p{pno}-img{n}.png"
            pix.save(path)
            r = p.get_image_bbox(info)
            print(f"{path}  bbox={[round(v) for v in r]}  ({r.width * 0.3528:.0f}mm wide on page)")


def drawings(pdf, page):
    p = fitz.open(pdf)[int(page) - 1]
    rects = [d["rect"] for d in p.get_drawings()]
    clusters = []
    for r in rects:
        for c in clusters:
            if c.intersects(fitz.Rect(r.x0 - 12, r.y0 - 12, r.x1 + 12, r.y1 + 12)):
                c |= r
                break
        else:
            clusters.append(fitz.Rect(r))
    for c in sorted(clusters, key=lambda c: c.y0):
        if c.width > 20 and c.height > 20:
            print(f"cluster bbox=({c.x0:.0f},{c.y0:.0f},{c.x1:.0f},{c.y1:.0f})  {c.width:.0f}x{c.height:.0f}pt")


if __name__ == "__main__":
    cmd, *args = sys.argv[1:]
    {"text": text, "render": render, "crop": crop, "images": images, "drawings": drawings}[cmd](*args)
