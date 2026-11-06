// ============================================================
//  YOUR DETAILS — edit this file only, the whole site updates.
// ============================================================
export const SITE = {
  name: "Chalaka Perera",
  title: "Mathematics Tutor",
  degree: "BSc (Hons) Computer Engineering (First Class)",
  university: "Faculty of Engineering, University of Peradeniya",
  phone: "+94 77 429 9094",
  whatsapp: "94774299094", // digits only, with country code, no +
  email: "chalakasamith@gmail.com",
  location: "Online · In person · Group classes",
  photo: "/chalak_PP.jpeg", // photo lives in /public
};

export const waLink = (msg = "Hi Sir, I'd like to know about your maths classes.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
