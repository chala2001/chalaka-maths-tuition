// ============================================================
//  CHAT ASSISTANT — EDIT ANSWERS HERE.
//  Each entry is one quick-reply button + the answer it gives.
//   - label:    text on the quick-reply button
//   - keywords: words/phrases (lowercase) that trigger this answer when typed
//   - answer:   the reply (plain text; use \n for new lines)
//   - cta:      optional extra button: "whatsapp" | "papers" | "official" | "call" | "email"
//  No AI and no server: it only matches the keywords below.
// ============================================================
import { SITE } from "./site";

export type Cta = "whatsapp" | "papers" | "official" | "call" | "email";

export interface Faq {
  id: string;
  label: string;
  keywords: string[];
  answer: string;
  cta?: Cta;
}

export const GREETING =
  "Hi! I'm the class assistant. Ask me about grades, fees, class times or free papers, or pick a question below. You can also type something like \"grade 10 english model paper\".";

export const FALLBACK =
  "Sorry, I couldn't find an answer to that. Sir can reply to you directly on WhatsApp.";

export const FAQS: Faq[] = [
  {
    id: "grades",
    label: "Which grades?",
    keywords: ["grade", "grades", "level", "o/l", "ol", "ordinary level", "syllabus", "ශ්‍රේණි", "වසර", "සාමාන්‍ය පෙළ"],
    answer: "Classes are for Grade 9, Grade 10 and Grade 11 (O/L Mathematics).",
  },
  {
    id: "medium",
    label: "Which mediums?",
    keywords: ["medium", "mediums", "language", "english", "sinhala", "සිංහල", "මාධ්‍ය", "මාධ්‍යය"],
    answer: "Classes and papers are available in both English and Sinhala medium.",
  },
  {
    id: "mode",
    label: "Online or in person?",
    keywords: ["online", "in person", "physical", "zoom", "group", "individual", "location", "mode", "අන්තර්ජාල", "ඔන්ලයින්", "කණ්ඩායම"],
    answer: `${SITE.location}. You can learn online, in person or in a group class.`,
  },
  {
    id: "times",
    label: "Class times",
    keywords: ["time", "times", "timetable", "schedule", "when", "day", "days", "batch", "වේලාව", "වේලාවන්", "කාලසටහන", "පන්ති වේලාව", "දින"],
    answer: "Class times depend on the batch. Details for the next batch are shared on WhatsApp.",
    cta: "whatsapp",
  },
  {
    id: "fees",
    label: "Fees",
    keywords: ["fee", "fees", "price", "cost", "charge", "payment", "pay", "how much", "ගාස්තු", "ගාස්තුව", "මිල", "ගෙවීම"],
    answer: "Fee details for the next batch are shared on WhatsApp. Message Sir and he will send them to you.",
    cta: "whatsapp",
  },
  {
    id: "join",
    label: "How to join",
    keywords: ["join", "enrol", "enroll", "register", "registration", "admission", "apply", "new batch", "සම්බන්ධ", "ලියාපදිංචි", "බැඳෙන්න", "ඇතුළත්"],
    answer: "To join, message Sir on WhatsApp. Details and openings for the next batch are shared there.",
    cta: "whatsapp",
  },
  {
    id: "teacher",
    label: "About the teacher",
    keywords: ["teacher", "sir", "tutor", "about", "who", "qualification", "qualifications", "degree", "experience", "chalaka", "peradeniya", "ගුරු", "සර්", "ගුරුවරයා"],
    answer:
      `${SITE.name} holds a ${SITE.degree} from the University of Peradeniya (First Class BSc (Hons) Computer Engineering).\n` +
      "He has 6+ years of teaching experience, since Nov 2020: O/L Maths, Science and ICT, and A/L Combined Maths and Physics.",
  },
  {
    id: "pastpapers",
    label: "Official past papers",
    keywords: ["past paper", "past papers", "official", "previous", "old paper", "old papers", "department of examinations", "doenets", "pastpapers", "evaluation report", "පසුගිය", "පසුගිය ප්‍රශ්න පත්‍ර", "පැරණි"],
    answer:
      "Official G.C.E. O/L past papers are on the Department of Examinations website. Official marking schemes are published there in the Evaluation Reports.",
    cta: "official",
  },
  {
    id: "papers",
    label: "Free papers",
    keywords: ["paper", "papers", "free", "model", "download", "marking scheme", "scheme", "pdf", "ප්‍රශ්න පත්‍ර", "ප්‍රශ්න පත්‍රය", "පත්‍ර", "නිදහස්", "නොමිලේ"],
    answer:
      "All model papers, tutorials and marking schemes are free. Open the Papers page, pick a grade and medium, then use View to read online or Download to save the PDF. Most papers have a marking scheme attached. You can also ask me, for example \"grade 11 sinhala model paper\".",
    cta: "papers",
  },
  {
    id: "contact",
    label: "Contact",
    keywords: ["contact", "phone", "call", "number", "whatsapp", "email", "mail", "reach", "message", "දුරකථන", "සම්බන්ධ කර", "අමතන්න", "ඊමේල්"],
    answer: `Phone: ${SITE.phone}\nWhatsApp: ${SITE.phone}\nEmail: ${SITE.email}`,
    cta: "whatsapp",
  },
];
