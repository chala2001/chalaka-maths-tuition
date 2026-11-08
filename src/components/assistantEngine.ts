import { FAQS, FALLBACK, type Faq } from "../data/assistant";
import { PAPERS, TUTORIAL_DOCS, type Paper } from "../data/papers";

export type Reply =
  | { type: "faq"; faq: Faq }
  | { type: "papers"; items: Paper[]; grade: number | null; more: number }
  | { type: "fallback"; text: string };

const norm = (s: string) =>
  s.toLowerCase().replace(/o\s*\/\s*l/g, " ol ").replace(/[^\p{L}\p{N}\p{M}\s]/gu, " ").replace(/\s+/g, " ").trim();
const tokens = (s: string) => norm(s).split(" ").filter(Boolean);

const KIND_WORDS: Record<string, string[]> = {
  "Model Paper": ["paper", "papers", "model", "past", "ප්‍රශ්න", "පත්‍ර", "පත්‍රය"],
  "Marking Scheme": ["scheme", "schemes", "marking", "answers", "answer", "පිළිතුරු"],
  Tutorial: ["tutorial", "tutorials", "notes", "ටියුටෝරියල්"],
};
const GENERIC = new Set(["paper", "papers", "model", "past", "ප්‍රශ්න", "පත්‍ර", "පත්‍රය", "free", "pdf", "download", "marking", "scheme", "schemes", "answers", "answer", "tutorial", "tutorials", "notes", "grade", "english", "sinhala", "medium", "ol"]);
const STOP = new Set(["and", "the", "of", "a", "to", "for", "in", "with", "paper", "model", "marking", "scheme", "answers", "tutorial", "grade", "english", "sinhala", "ol", "part", "i", "ii"]);

/** Topic words come from the library itself, so new topics work automatically. */
const TOPIC_WORDS = (() => {
  const set = new Set<string>();
  for (const p of [...PAPERS, ...TUTORIAL_DOCS]) {
    if (!p.topic) continue;
    for (const t of tokens(p.topic)) if (t.length > 2 && !STOP.has(t) && !/^\d+$/.test(t)) set.add(t);
  }
  return set;
})();

const matchesToken = (t: string, w: string) => t === w || (t.length > 3 && w.length > 3 && (t.startsWith(w) || w.startsWith(t)));

function faqScore(faq: Faq, q: string, toks: string[]): number {
  let s = 0;
  for (const k of faq.keywords) {
    const kn = norm(k);
    if (!kn) continue;
    if (kn.includes(" ")) {
      if (q.includes(kn)) s += 3;
    } else if (toks.some((t) => t === kn || (kn.length > 3 && t.length > 3 && (t.startsWith(kn) || kn.startsWith(t))))) s += 2;
  }
  return s;
}

function findPapers(toks: string[]) {
  let grade: number | null = null;
  const g = toks.find((t) => t === "9" || t === "10" || t === "11");
  if (g) grade = Number(g);
  else if (toks.includes("ol")) grade = 11;
  const medium = toks.includes("sinhala") || toks.includes("සිංහල") ? "Sinhala" : toks.includes("english") ? "English" : null;
  const kinds = (Object.keys(KIND_WORDS) as (keyof typeof KIND_WORDS)[]).filter((k) => KIND_WORDS[k].some((w) => toks.includes(w)));
  const specificKinds = kinds.filter((k) => k !== "Model Paper" || toks.includes("model"));
  const topics = toks.filter((t) => [...TOPIC_WORDS].some((w) => matchesToken(t, w)));
  return { grade, medium, kinds: specificKinds, topics, anyKind: kinds.length > 0 };
}

function runFinder(toks: string[]): Reply | null {
  const f = findPapers(toks);
  const pool: Paper[] = PAPERS;
  const wantScheme = f.kinds.includes("Marking Scheme");
  const items = pool.filter((p) => {
    if (f.grade && p.grade !== f.grade) return false;
    if (f.medium && p.medium !== f.medium) return false;
    if (f.topics.length) {
      const hay = tokens(`${p.topic ?? ""} ${p.title}`);
      if (!f.topics.every((t) => hay.some((h) => matchesToken(t, h)))) return false;
    }
    const wantTut = f.kinds.includes("Tutorial");
    const wantPaper = f.kinds.includes("Model Paper");
    if (wantTut && !wantPaper && !wantScheme && p.kind !== "Tutorial") return false;
    if (wantPaper && !wantTut && p.kind === "Tutorial") return false;
    if (wantScheme && !wantTut && !wantPaper && !p.scheme) return false;
    return true;
  });
  if (!items.length) return null;
  return { type: "papers", items: items.slice(0, 5), grade: f.grade, more: Math.max(0, items.length - 5) };
}

export function answer(input: string): Reply {
  const q = norm(input);
  const toks = q.split(" ").filter(Boolean);
  if (!toks.length) return { type: "fallback", text: FALLBACK };

  const f = findPapers(toks);
  const specific = f.kinds.length > 0 || f.topics.length > 0;
  const bareGeneric = toks.every((t) => GENERIC.has(t) || /^\d+$/.test(t));

  // Typed requests for specific papers go to the finder.
  const hasDigit = toks.some((t) => t === "9" || t === "10" || t === "11");
  if (specific || hasDigit || f.grade !== null || (f.medium && f.anyKind)) {
    const r = runFinder(toks);
    if (r) return r;
  }

  const scored = FAQS.map((faq) => ({ faq, s: faqScore(faq, q, toks) })).sort((a, b) => b.s - a.s);
  if (scored[0].s > 0) return { type: "faq", faq: scored[0].faq };

  if (f.medium || bareGeneric) {
    const r = runFinder(toks);
    if (r) return r;
  }
  return { type: "fallback", text: FALLBACK };
}

export const faqReply = (faq: Faq): Reply => ({ type: "faq", faq });
