import { DocIcon, PlayIcon } from "../components/Icons";
import { TUTORIALS } from "../data/tutorials";
import { TUTORIAL_DOCS } from "../data/papers";
import { useTitle } from "../hooks";

/** One list: tutorial-notes PDFs (from papers-src) + video/link tutorials (from data/tutorials.ts). */
const ITEMS = [
  ...TUTORIAL_DOCS.map((d) => ({
    key: d.id,
    title: d.title,
    meta: `Notes · ${d.topic ?? ""} · Grade ${d.grade} · ${d.medium === "Sinhala" ? "සිංහල" : "English"}`,
    link: d.file,
    video: false,
  })),
  ...TUTORIALS.map((t) => ({
    key: t.link + t.title,
    title: t.title,
    meta: `${t.kind} · ${t.topic} · Grade ${t.grade}`,
    link: t.link,
    video: t.kind === "Video",
  })),
];

export default function Tutorials() {
  useTitle("Maths Tutorials · Chalaka Perera");
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Learn</span>
          <h1>Tutorials &amp; <em>notes.</em></h1>
          <p>Short lessons on the topics students find hardest.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="tut-list">
            {ITEMS.length ? (
              ITEMS.map((t) => (
                <a className="tut" key={t.key} href={t.link} target="_blank" rel="noopener">
                  <span className="k">{t.video ? <PlayIcon /> : <DocIcon />}</span>
                  <span>
                    <h3>{t.title}</h3>
                    <p>{t.meta}</p>
                  </span>
                  <span className="go">→</span>
                </a>
              ))
            ) : (
              <div className="empty"><b>Soon</b>Tutorials are on the way.</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
