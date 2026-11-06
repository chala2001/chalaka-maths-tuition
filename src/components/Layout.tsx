import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { SITE } from "../data/site";
import { TUTORIALS } from "../data/tutorials";
import { TUTORIAL_DOCS } from "../data/papers";

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const cls = ({ isActive }: { isActive: boolean }) => (isActive ? "active" : "");

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">{SITE.name.trim()[0]}</span>
          <span>
            {SITE.name}
            <small>{SITE.title}</small>
          </span>
        </Link>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end className={cls}>Home</NavLink>
          <NavLink to="/papers" className={cls}>Papers</NavLink>
          {TUTORIALS.length + TUTORIAL_DOCS.length > 0 && <NavLink to="/tutorials" className={cls}>Tutorials</NavLink>}
          <Link to="/#contact" className="btn sm">Join a class</Link>
        </nav>
        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}

/** Scroll to top on page change, or to #hash when present. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <Nav />
      <main>
        <Outlet />
      </main>
      <footer>
        <div className="wrap">
          <span>© {new Date().getFullYear()} {SITE.name} · Mathematics</span>
          <span>{SITE.location}</span>
        </div>
      </footer>
    </>
  );
}
