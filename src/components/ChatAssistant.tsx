import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { SITE, waLink } from "../data/site";
import { FAQS, GREETING } from "../data/assistant";
import { answer, faqReply, type Reply } from "./assistantEngine";
import { PhoneIcon, MailIcon, WhatsAppIcon } from "./Icons";

type Msg = { id: number; from: "bot" | "user"; text?: string; reply?: Reply; question?: string };

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12Z" />
    <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" strokeWidth={2.4} />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m0 0-6-6m6 6-6 6" /></svg>
);

let nextId = 1;

function BotReply({ m, onNavigate }: { m: Msg; onNavigate: () => void }) {
  const r = m.reply;
  if (!r) return <p>{m.text}</p>;
  if (r.type === "fallback") {
    return (
      <>
        <p>{r.text}</p>
        <a className="btn gold sm ca-btn" href={waLink(m.question ? `Hi Sir, ${m.question}` : undefined)} target="_blank" rel="noopener">
          <WhatsAppIcon /> Message Sir on WhatsApp
        </a>
      </>
    );
  }
  if (r.type === "papers") {
    return (
      <>
        <p>Here {r.items.length === 1 ? "is what I found" : "are the closest matches"}:</p>
        <ul className="ca-list">
          {r.items.map((p) => (
            <li key={p.id}>
              <a href={p.file} target="_blank" rel="noopener">{p.title}</a>
              <span>Grade {p.grade} · {p.medium} · {p.kind}</span>
              {p.scheme && (
                <a className="ca-sub" href={p.scheme.file} target="_blank" rel="noopener">
                  {p.scheme.kind === "Worked Answers" ? "Answers" : "Marking scheme"}
                </a>
              )}
            </li>
          ))}
        </ul>
        {r.more > 0 && <p className="ca-note">{r.more} more on the Papers page.</p>}
        <Link className="btn ghost sm ca-btn" to={r.grade ? `/papers?grade=${r.grade}` : "/papers"} onClick={onNavigate}>
          See all papers
        </Link>
      </>
    );
  }
  const { faq } = r;
  return (
    <>
      <p className="ca-pre">{faq.answer}</p>
      {faq.cta === "whatsapp" && (
        <a className="btn gold sm ca-btn" href={waLink()} target="_blank" rel="noopener"><WhatsAppIcon /> Message Sir on WhatsApp</a>
      )}
      {faq.cta === "official" && (
        <div className="ca-row">
          <a className="btn gold sm" href={SITE.officialPastPapers} target="_blank" rel="noopener">Past papers ↗</a>
          <a className="btn ghost sm" href={SITE.officialMarkingSchemes} target="_blank" rel="noopener">Marking schemes ↗</a>
        </div>
      )}
      {faq.cta === "papers" && (
        <Link className="btn ghost sm ca-btn" to="/papers" onClick={onNavigate}>Open the Papers page</Link>
      )}
      {faq.id === "contact" && (
        <div className="ca-row">
          <a className="btn ghost sm" href={`tel:${SITE.phone.replace(/\s/g, "")}`}><PhoneIcon /> Call</a>
          <a className="btn ghost sm" href={`mailto:${SITE.email}`}><MailIcon /> Email</a>
        </div>
      )}
    </>
  );
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(() => {
    try { return new URLSearchParams(window.location.search).get("chat") === "open"; } catch { return false; }
  });
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: "bot", text: GREETING }]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const timer = useRef<number>();

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
    else if (wasOpen.current) fabRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Dev/screenshot helper: ?chat=open&chatq=grade 10 english model paper
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("chatq");
      if (q) ask(q, answer(q));
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ask = (question: string, reply: Reply) => {
    setMsgs((m) => [...m, { id: nextId++, from: "user", text: question }]);
    setTyping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: nextId++, from: "bot", reply, question }]);
    }, 350);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = text.trim();
    if (!q) return;
    setText("");
    ask(q, answer(q));
  };

  return (
    <div className="ca-root">
      {open && (
        <section className="ca-panel" role="dialog" aria-label="Chat assistant">
          <header className="ca-head">
            <div>
              <b>Ask about classes</b>
              <small>Instant answers, no sign-up</small>
            </div>
            <button type="button" className="ca-close" aria-label="Close chat" onClick={() => setOpen(false)}><CloseIcon /></button>
          </header>
          <div className="ca-list-wrap" ref={listRef} role="log" aria-live="polite" aria-label="Conversation">
            {msgs.map((m) => (
              <div key={m.id} className={`ca-msg ${m.from}`}>
                {m.from === "user" ? <p>{m.text}</p> : <BotReply m={m} onNavigate={() => setOpen(false)} />}
              </div>
            ))}
            {typing && <div className="ca-msg bot ca-typing" aria-label="Typing"><i /><i /><i /></div>}
            <div className="ca-chips">
              {FAQS.map((f) => (
                <button type="button" key={f.id} className="ca-chip" onClick={() => ask(f.label, faqReply(f))}>{f.label}</button>
              ))}
            </div>
          </div>
          <form className="ca-form" onSubmit={submit}>
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your question…"
              aria-label="Your question"
              maxLength={200}
              autoComplete="off"
            />
            <button type="submit" className="ca-send" aria-label="Send" disabled={!text.trim()}><SendIcon /></button>
          </form>
        </section>
      )}
      <button
        ref={fabRef}
        type="button"
        className="ca-fab"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}
