import { useState } from "react";
import { translateText } from "../api/axios";

const LANGUAGES = [
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "gu", label: "ગુજરાતી (Gujarati)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "or", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "en", label: "English" }
];

const TranslateBox = ({ text }) => {
  const [translated, setTranslated] = useState("");
  const [selectedLang, setSelectedLang] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;
    setLoading(true);
    setError("");
    try {
      const result = await translateText(text, selectedLang);
      setTranslated(result);
      setShowOriginal(false);
    } catch (err) {
      setError("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      {/* Original Text */}
      <div style={s.originalBox}>
        <div style={s.labelRow}>
          <span style={s.label}>Description</span>
          {translated && (
            <button style={s.toggleBtn} onClick={() => setShowOriginal(!showOriginal)}>
              {showOriginal ? "Show Translation" : "Show Original"}
            </button>
          )}
        </div>
        <p style={s.text}>{showOriginal || !translated ? text : translated}</p>
      </div>

      {/* Translation Controls */}
      <div style={s.controls}>
        <select style={s.select} value={selectedLang} onChange={e => setSelectedLang(e.target.value)}>
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
        <button style={s.translateBtn} onClick={handleTranslate} disabled={loading}>
          {loading ? "Translating..." : "🌐 Translate"}
        </button>
      </div>

      {error && <p style={s.error}>{error}</p>}

      {translated && !showOriginal && (
        <div style={s.translatedInfo}>
          <span style={s.translatedLabel}>
            Translated to {LANGUAGES.find(l => l.code === selectedLang)?.label}
          </span>
        </div>
      )}
    </div>
  );
};

const s = {
  wrap: { fontFamily: "'Crimson Pro', Georgia, serif", marginTop: "1rem" },
  originalBox: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,99,0.12)", borderRadius: "4px", padding: "14px 16px", marginBottom: "10px" },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  label: { fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(212,175,99,0.5)" },
  toggleBtn: { fontSize: "0.72rem", color: "rgba(212,175,99,0.6)", background: "transparent", border: "1px solid rgba(212,175,99,0.2)", borderRadius: "2px", padding: "3px 8px", cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
  text: { color: "#f0e6d0", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 },
  controls: { display: "flex", gap: "10px", alignItems: "center" },
  select: { flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,99,0.15)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "0.88rem", outline: "none" },
  translateBtn: { padding: "8px 18px", background: "linear-gradient(135deg, #4a6b3a, #2d4a22)", border: "1px solid rgba(74,107,58,0.4)", borderRadius: "3px", color: "#a8d48a", fontFamily: "'Crimson Pro', serif", fontSize: "0.88rem", cursor: "pointer", whiteSpace: "nowrap" },
  error: { color: "#e8917a", fontSize: "0.82rem", marginTop: "6px" },
  translatedInfo: { marginTop: "6px" },
  translatedLabel: { fontSize: "0.72rem", color: "rgba(212,175,99,0.35)", letterSpacing: "0.1em" }
};

export default TranslateBox;