import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import PaperCard from "../components/PaperCard";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "../components/Icons";
import { PAPERS } from "../data/papers";
import { SITE, waLink } from "../data/site";
import { useTitle } from "../hooks";

type Cred = { big: string; sup?: string; text: string; wide?: boolean; badges?: string[] };

const CREDS: Cred[] = [
  {
    big: "First Class",
    text: "BSc (Hons) Computer Engineering · Faculty of Engineering, University of Peradeniya",
    wide: true,
    badges: ["GPA 3.971 / 4.0"],
  },
  { big: "3A", sup: "s", text: "G.C.E. A/L · Combined Maths, Physics, Chemistry · 1st attempt" },
  { big: "9A", sup: "s", text: "G.C.E. O/L" },
];

const WHY = [
  ["Concept first", "Every topic built from the ground up."],
  ["Exam focused", "Model papers, past papers, marking tips."],
  ["Online or in person", "Group and individual classes."],
  ["Two mediums", "English and Sinhala medium classes."],
];

const CLASSES = [
  { g: 9, lbl: "Foundation", title: "Grade 9", items: ["Full syllabus theory", "Term test preparation", "Weekly practice sheets"] },
  { g: 10, lbl: "Build-up", title: "Grade 10", items: ["O/L syllabus coverage", "Problem-solving drills", "Term test papers"] },
  { g: 11, lbl: "Exam year", title: "O/L Mathematics", items: ["Revision & paper classes", "Past papers, fully discussed", "Aim for the A"], featured: true },
];

function HeroArt() {
  return (
    <div className="hero-art">
      <svg className="geo" viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <line className="draw" x1="20" y1="200" x2="380" y2="200" stroke="#d6cdb8" strokeWidth="1.2" />
        <line className="draw" x1="200" y1="20" x2="200" y2="380" stroke="#d6cdb8" strokeWidth="1.2" />
        <circle className="draw" cx="200" cy="200" r="130" stroke="#12182b" strokeWidth="2" />
        <path className="draw d2" d="M200 200 L310 131 L310 200 Z" stroke="#b8862f" strokeWidth="2" fill="rgba(184,134,47,.08)" />
        <path className="draw d3" d="M236 200 A36 36 0 0 0 230.5 181" stroke="#b8862f" strokeWidth="2" />
        <path className="draw d4" d="M60 330 Q 130 120 200 200 T 340 70" stroke="#2e6b55" strokeWidth="2" strokeDasharray="6 6" />
        <circle className="fade" cx="310" cy="131" r="5" fill="#12182b" />
        <g className="fade" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="18" fill="#12182b">
          <text x="244" y="194">θ</text>
          <text x="318" y="124">P</text>
          <text x="372" y="220" fontSize="15" fill="#7a7f90">x</text>
          <text x="208" y="32" fontSize="15" fill="#7a7f90">y</text>
        </g>
      </svg>
      <div className="chip c1">sin²θ + cos²θ = 1</div>
      <div className="chip c2">x = (−b ± √Δ) / 2a</div>
      <div className="chip c3">∴ Q.E.D.</div>
    </div>
  );
}

export default function Home() {
  useTitle(`${SITE.name} · Mathematics Tuition · Grade 9–11 & O/L`);
  const wa = waLink();

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">Mathematics · Grade 9 – 11 · O/L</span>
            <h1>Maths, made <em>clear.</em></h1>
            <p className="lead">Concept-first classes and free exam papers, in English and Sinhala medium.</p>
            <div className="hero-cta">
              <Link className="btn" to="/papers">Browse free papers →</Link>
              <a className="btn ghost" href={wa} target="_blank" rel="noopener"><WhatsAppIcon /> WhatsApp me</a>
            </div>
            <div className="hero-meta">
              <span><i />Now enrolling</span>
              <span>English &amp; සිංහල medium</span>
              <span>{SITE.location}</span>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="creds">
        <div className="wrap">
          <Reveal className="creds-grid">
            {CREDS.map((c) => (
              <div className={`cred ${c.wide ? "wide" : ""}`} key={c.big}>
                <b>{c.big}{c.sup && <sup>{c.sup}</sup>}</b>
                <span>{c.text}</span>
                {c.badges && (
                  <div className="cred-badges">
                    {c.badges.map((t) => <em key={t}>{t}</em>)}
                  </div>
                )}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="wrap about-grid">
          <Reveal className="portrait">
            {SITE.photo ? <img src={SITE.photo} alt={SITE.name} /> : <div className="ph"><b>∫</b>Your photo here</div>}
            <div className="tag">
              <strong>{SITE.name}</strong>
              {SITE.degree} · {SITE.university}
            </div>
          </Reveal>
          <Reveal className="about-text">
            <span className="eyebrow">About</span>
            <h2>An engineer who <em>teaches</em> maths.</h2>
            <p>I teach the way I learned: understand the idea first, then practise until it sticks. No memorising. Just clear thinking.</p>
            <div className="why">
              {WHY.map(([h, p], i) => (
                <div key={h}>
                  <span className="ico">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLASSES */}
      <section className="classes" id="classes">
        <div className="wrap">
          <Reveal className="section-head">
            <div><span className="eyebrow">Classes</span><h2>Find your <em>grade.</em></h2></div>
            <p>Weekly theory, paper classes and revision before every term test.</p>
          </Reveal>
          <div className="class-grid">
            {CLASSES.map((c) => (
              <Reveal as={Link} key={c.g} to={`/papers?grade=${c.g}`} className={`class-card ${c.featured ? "featured" : ""}`}>
                <span className="num">{c.g}</span>
                <span className="lbl">{c.lbl}</span>
                <h3>{c.title}</h3>
                <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
                <div className="mediums"><span className="pill">English</span><span className="pill">සිංහල</span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST PAPERS */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <div><span className="eyebrow">Free resources</span><h2>Latest <em>papers.</em></h2></div>
            <Link className="btn ghost" to="/papers">View all papers →</Link>
          </Reveal>
          <Reveal className="paper-grid">
            {PAPERS.slice(0, 3).map((p) => <PaperCard key={p.id} paper={p} />)}
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="wrap">
          <Reveal className="contact-card">
            <div>
              <span className="eyebrow">Join a class</span>
              <h2 style={{ marginTop: 14 }}>Let's start <em>today.</em></h2>
              <p>Message me for class times, fees and the next batch.</p>
            </div>
            <div className="contact-list">
              <a className="wa" href={wa} target="_blank" rel="noopener"><WhatsAppIcon /><span><small>WhatsApp</small>Message me</span></a>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}><PhoneIcon /><span><small>Call</small>{SITE.phone}</span></a>
              <a href={`mailto:${SITE.email}`}><MailIcon /><span><small>Email</small>{SITE.email}</span></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
