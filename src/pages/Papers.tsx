import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaperCard from "../components/PaperCard";
import { SearchIcon } from "../components/Icons";
import { PAPERS, type Paper } from "../data/papers";
import { useTitle } from "../hooks";
import { SITE } from "../data/site";

type Opt = { v: string; label: string };

function Seg({ label, opts, value, onChange }: { label: string; opts: Opt[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="filter-row">
      <span>{label}</span>
      <div className="seg">
        {opts.map((o) => (
          <button key={o.v} className={value === o.v ? "on" : ""} onClick={() => onChange(o.v)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const ALL: Opt = { v: "all", label: "All" };
const uniq = <T,>(xs: T[]) => [...new Set(xs)];
const GRADES: Opt[] = [ALL, ...uniq(PAPERS.map((p) => p.grade)).sort((a, b) => a - b).map((g) => ({ v: String(g), label: `Grade ${g}` }))];
const MEDIUMS: Opt[] = [ALL, { v: "English", label: "English" }, { v: "Sinhala", label: "සිංහල" }];
const KINDS: Opt[] = [ALL, ...uniq(PAPERS.map((p) => p.kind)).map((k) => ({ v: k, label: k }))];

/** Group cards under "Grade 10 · Model Papers" style headings, keeping list order. */
function groupOf(list: Paper[]) {
  const groups = new Map<string, Paper[]>();
  for (const p of list) {
    const plural: Record<string, string> = { "Model Paper": "Model Papers", Tutorial: "Tutorials" };
    const key = `Grade ${p.grade} · ${plural[p.kind] ?? p.kind}`;
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  return [...groups];
}

export default function Papers() {
  useTitle("Free Maths Papers · Chalaka Perera");
  const [params, setParams] = useSearchParams();
  const grade = params.get("grade") ?? "all";
  const [medium, setMedium] = useState("all");
  const [kind, setKind] = useState("all");
  const [q, setQ] = useState("");

  const setGrade = (v: string) => setParams(v === "all" ? {} : { grade: v }, { replace: true });

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return PAPERS.filter(
      (p) =>
        (grade === "all" || String(p.grade) === grade) &&
        (medium === "all" || p.medium === medium) &&
        (kind === "all" || p.kind === kind) &&
        (!s || `${p.title} ${p.kind} ${p.topic ?? ""} grade ${p.grade} ${p.medium}`.toLowerCase().includes(s)),
    );
  }, [grade, medium, kind, q]);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Paper library</span>
          <h1>Free maths <em>papers.</em></h1>
          <p>Model papers with marking schemes, and topic tutorials with worked answers. View online or download.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="filters">
            <label className="search">
              <SearchIcon />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search… e.g. area, model paper 02" />
            </label>
            <Seg label="Grade" opts={GRADES} value={grade} onChange={setGrade} />
            <Seg label="Medium" opts={MEDIUMS} value={medium} onChange={setMedium} />
            <Seg label="Type" opts={KINDS} value={kind} onChange={setKind} />
          </div>
          <p className="count">{list.length} document{list.length === 1 ? "" : "s"}</p>

          {list.length ? (
            groupOf(list).map(([title, items]) => (
              <div className="paper-group" key={title}>
                <h2 className="group-title">{title}<span>{items.length}</span></h2>
                <div className="paper-grid">
                  {items.map((p) => <PaperCard key={p.id} paper={p} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="empty"><b>∅</b>No papers here yet. Try another filter.</div>
          )}

          <div className="official-card">
            <div>
              <span className="eyebrow">Official resources</span>
              <h2>G.C.E. O/L past papers &amp; marking schemes</h2>
              <p>Real past papers from the Department of Examinations, Sri Lanka. Marking schemes are published in their <b>Evaluation Reports</b>. Opens the official website in a new tab.</p>
            </div>
            <div className="official-actions">
              <a className="btn gold" href={SITE.officialPastPapers} target="_blank" rel="noopener">Official past papers ↗</a>
              <a className="btn ghost" href={SITE.officialMarkingSchemes} target="_blank" rel="noopener">Marking schemes ↗</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
