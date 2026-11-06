import type { Paper } from "../data/papers";
import { DownloadIcon, EyeIcon } from "./Icons";

const fileName = (p: { title: string; grade: number; medium: string }) =>
  `Grade ${p.grade} ${p.title} (${p.medium}) - Chalaka Perera.pdf`;

export default function PaperCard({ paper: p }: { paper: Paper }) {
  const si = p.medium === "Sinhala";
  return (
    <article className="paper">
      <div className="paper-top">
        <div className="paper-icon">PDF</div>
        <span className="grade">Grade {p.grade}</span>
      </div>
      <h3>{p.title}</h3>
      <div className="meta">
        <span className={`pill ${si ? "si" : "en"}`}>{si ? "සිංහල" : "English"}</span>
        <span className="pill">{p.kind}</span>
        {p.scheme && <span className="pill ok">+ Marking scheme</span>}
      </div>
      <div className="actions">
        <a className="btn ghost sm" href={p.file} target="_blank" rel="noopener">
          <EyeIcon /> View
        </a>
        <a className="btn sm" href={p.file} download={fileName(p)}>
          <DownloadIcon /> Download
        </a>
      </div>
      {p.scheme && (
        <a className="scheme-link" href={p.scheme.file} target="_blank" rel="noopener">
          <span>Marking scheme</span>
          <span>View →</span>
        </a>
      )}
    </article>
  );
}
