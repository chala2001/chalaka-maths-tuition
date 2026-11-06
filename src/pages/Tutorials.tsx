import { useState } from "react";
import PaperCard from "../components/PaperCard";
import { PlayIcon, DocIcon } from "../components/Icons";
import { TUTORIALS } from "../data/tutorials";
import { TUTORIAL_DOCS } from "../data/papers";
import { useTitle } from "../hooks";

const MEDIUMS = [
  { v: "all", label: "All" },
  { v: "English", label: "English" },
  { v: "Sinhala", label: "සිංහල" },
];

export default function Tutorials() {
  useTitle("Maths Tutorials · Chalaka Perera");
  const [medium, setMedium] = useState("all");
  const docs = TUTORIAL_DOCS.filter((d) => medium === "all" || d.medium === medium);
  const grades = [...new Set(docs.map((d) => d.grade))].sort((a, b) => b - a);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Learn</span>
          <h1>Tutorials &amp; <em>practice.</em></h1>
          <p>Practice questions by topic. Try them first, then check the worked answers.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {TUTORIAL_DOCS.length > 0 && (
            <div className="filters" style={{ marginBottom: 32 }}>
              <div className="filter-row">
                <span>Medium</span>
                <div className="seg">
                  {MEDIUMS.map((o) => (
                    <button key={o.v} className={medium === o.v ? "on" : ""} onClick={() => setMedium(o.v)}>{o.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {grades.map((g) => (
            <div className="paper-group" key={g}>
              <h2 className="group-title">Grade {g} · Tutorials<span>{docs.filter((d) => d.grade === g).length}</span></h2>
              <div className="paper-grid">
                {docs.filter((d) => d.grade === g).map((d) => <PaperCard key={d.id} paper={d} />)}
              </div>
            </div>
          ))}

          {TUTORIALS.length > 0 && (
            <div className="paper-group">
              <h2 className="group-title">Videos &amp; notes</h2>
              <div className="tut-list">
                {TUTORIALS.map((t) => (
                  <a className="tut" key={t.link + t.title} href={t.link} target="_blank" rel="noopener">
                    <span className="k">{t.kind === "Video" ? <PlayIcon /> : <DocIcon />}</span>
                    <span><h3>{t.title}</h3><p>{t.kind} · {t.topic} · Grade {t.grade}</p></span>
                    <span className="go">→</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {!TUTORIAL_DOCS.length && !TUTORIALS.length && <div className="empty"><b>Soon</b>Tutorials are on the way.</div>}
        </div>
      </section>
    </>
  );
}
