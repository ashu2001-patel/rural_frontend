import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { setLanguage, SUPPORTED_LANGUAGES } from "../i18n";

// ─────────────────────────────────────────────────────────────────────────────
// LanguageToggle
//
// Two layouts:
//   variant="compact" — small dropdown button (used in the navbar). Shows the
//                       current language's short label, opens a menu on click.
//   variant="pill"    — horizontal row of buttons (used in profile drawer /
//                       mobile menu / Profile page). Each language is a button.
// ─────────────────────────────────────────────────────────────────────────────
const LanguageToggle = ({ variant = "pill" }) => {
  const { i18n, t } = useTranslation();
  const current = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (code) => {
    setLanguage(code);
    setOpen(false);
  };

  // ── PILL variant: row of buttons (one per language) ────────────────────────
  if (variant === "pill") {
    return (
      <div className="lt-pill" role="group" aria-label={t("language.label")}>
        {SUPPORTED_LANGUAGES.map(lang => (
          <button
            key={lang.code}
            className={`lt-pill-btn ${lang.code === current.code ? "lt-pill-btn--active" : ""}`}
            onClick={() => choose(lang.code)}
            aria-pressed={lang.code === current.code}
          >
            {lang.nativeLabel}
          </button>
        ))}
        <style>{pillCss}</style>
      </div>
    );
  }

  // ── COMPACT variant: dropdown for navbar ───────────────────────────────────
  return (
    <div className="lt-wrap" ref={wrapRef}>
      <button
        className={`lt-trigger ${open ? "lt-trigger--open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language.label")}
      >
        <span className="lt-globe">🌐</span>
        <span className="lt-current">{current.short}</span>
        <span className="lt-caret">▾</span>
      </button>

      {open && (
        <div className="lt-menu" role="listbox">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              role="option"
              aria-selected={lang.code === current.code}
              className={`lt-item ${lang.code === current.code ? "lt-item--active" : ""}`}
              onClick={() => choose(lang.code)}
            >
              <span className="lt-item-native">{lang.nativeLabel}</span>
              {lang.code === current.code && <span className="lt-check">✓</span>}
            </button>
          ))}
        </div>
      )}

      <style>{compactCss}</style>
    </div>
  );
};

const pillCss = `
  .lt-pill {
    display: inline-flex; padding: 2px;
    background: rgba(212,175,99,.08);
    border: 1px solid rgba(212,175,99,.2);
    border-radius: 14px; gap: 0; flex-wrap: wrap;
  }
  .lt-pill-btn {
    border: none; background: transparent; cursor: pointer;
    padding: 5px 12px; border-radius: 12px;
    font-size: .76rem; font-weight: 600;
    color: rgba(230,216,181,.55);
    font-family: 'Poppins', sans-serif;
    transition: all .18s; min-height: 28px;
    white-space: nowrap;
  }
  .lt-pill-btn:hover { color: #d4af63; }
  .lt-pill-btn--active {
    background: linear-gradient(135deg,#d4af63,#8b5a2b);
    color: #1a0f05;
  }
`;

const compactCss = `
  .lt-wrap { position: relative; display: inline-block; }

  .lt-trigger {
    display: inline-flex; align-items: center; gap: 4px;
    background: transparent; border: 1px solid rgba(212,175,99,.2);
    border-radius: 8px; padding: 4px 8px; cursor: pointer;
    color: rgba(230,216,181,.65); font-size: .72rem; font-weight: 600;
    font-family: 'Poppins', sans-serif;
    transition: all .18s; min-height: 28px;
  }
  .lt-trigger:hover { border-color: rgba(212,175,99,.4); color: #d4af63; }
  .lt-trigger--open { border-color: #d4af63; color: #d4af63; }

  .lt-globe { font-size: .78rem; }
  .lt-current { letter-spacing: .04em; }
  .lt-caret { font-size: .65rem; opacity: .6; }

  .lt-menu {
    position: absolute; top: calc(100% + 6px); right: 0;
    min-width: 130px; padding: 4px;
    background: rgba(16,10,5,0.99);
    border: 1px solid rgba(212,175,99,0.18);
    border-radius: 10px;
    box-shadow: 0 12px 28px rgba(0,0,0,.5);
    z-index: 1100;
    animation: lt-fade .15s ease;
  }
  @keyframes lt-fade {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lt-item {
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; padding: 8px 10px;
    background: transparent; border: none;
    border-radius: 6px;
    color: rgba(230,216,181,.7);
    font-family: 'Poppins', sans-serif; font-size: .82rem;
    cursor: pointer; transition: background .12s;
    text-align: left;
  }
  .lt-item:hover { background: rgba(212,175,99,.08); color: #d4af63; }
  .lt-item--active { color: #d4af63; }
  .lt-item-native { font-weight: 500; }
  .lt-check { color: #d4af63; font-size: .8rem; }
`;

export default LanguageToggle;
