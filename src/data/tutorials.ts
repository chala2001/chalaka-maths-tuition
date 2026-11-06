// ============================================================
//  TUTORIALS LIST
//  kind "Video" → YouTube link · "Notes" → PDF in public/pdfs/
//  The Tutorials page and its menu link appear once this list has entries.
// ============================================================
import type { Grade } from "./papers";

export interface Tutorial {
  title: string;
  topic: string;
  grade: Grade;
  kind: "Video" | "Notes";
  link: string;
}

export const TUTORIALS: Tutorial[] = [
  // { title: "Solving Quadratic Equations", topic: "Algebra", grade: 10, kind: "Video", link: "https://youtu.be/..." },
];
