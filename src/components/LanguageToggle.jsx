import { useTranslation } from "react-i18next";
import { setLanguage } from "../i18n";

const LanguageToggle = ({ variant = "pill" }) => {
  const { i18n } = useTranslation();
  const isHi = i18n.language === "hi";

  const toggle = () => setLanguage(isHi ? "en" : "hi");

  if (variant === "compact") {
    return (
      <button className="lt-compact" onClick={toggle} aria-label="Toggle language">
        <span className={isHi ? "lt-active" : ""}>हि</span>
        <span className="lt-divider">/</span>
        <span className={!isHi ? "lt-active" : ""}>EN</span>
        <style>{compactCss}</style>
      </button>
    );
  }

  return (
    <div className="lt-pill" role="group" aria-label="Language switch">
      <button
        className={`lt-pill-btn ${isHi ? "lt-pill-btn--active" : ""}`}
        onClick={() => setLanguage("hi")}
        aria-pressed={isHi}
      >
        हिं
      </button>
      <button
        className={`lt-pill-btn ${!isHi ? "lt-pill-btn--active" : ""}`}
        onClick={() => setLanguage("en")}
        aria-pressed={!isHi}
      >
        EN
      </button>
      <style>{pillCss}</style>
    </div>
  );
};

const pillCss = `
  .lt-pill {
    display: inline-flex; padding: 2px;
    background: rgba(212,175,99,.08);
    border: 1px solid rgba(212,175,99,.2);
    border-radius: 14px; gap: 0;
  }
  .lt-pill-btn {
    border: none; background: transparent; cursor: pointer;
    padding: 4px 10px; border-radius: 12px;
    font-size: .72rem; font-weight: 600;
    color: rgba(230,216,181,.55);
    font-family: 'Poppins', sans-serif;
    transition: all .18s; min-height: 26px;
  }
  .lt-pill-btn:hover { color: #d4af63; }
  .lt-pill-btn--active {
    background: linear-gradient(135deg,#d4af63,#8b5a2b);
    color: #1a0f05;
  }
`;

const compactCss = `
  .lt-compact {
    background: transparent; border: 1px solid rgba(212,175,99,.2);
    border-radius: 8px; padding: 4px 9px; cursor: pointer;
    color: rgba(230,216,181,.5); font-size: .7rem; font-weight: 600;
    font-family: 'Poppins', sans-serif; display: inline-flex; gap: 3px;
    transition: all .18s; min-height: 28px; align-items: center;
  }
  .lt-compact:hover { border-color: rgba(212,175,99,.4); }
  .lt-active { color: #d4af63; }
  .lt-divider { color: rgba(212,175,99,.3); }
`;

export default LanguageToggle;
