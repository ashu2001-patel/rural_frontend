import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RevealContact = ({ contact }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!contact) {
    return <span style={s.none}>{t("common.notProvided")}</span>;
  }

  if (!user) {
    return (
      <div style={s.lockWrap}>
        <div style={s.lockIcon}>🔒</div>
        <p style={s.lockText}>{t("animalDetails.contactLoginRequired") || "Contact details are private"}</p>
        <button
          style={s.loginBtn}
          onClick={() => navigate("/login")}
        >
          {t("common.login") || "Login to view contact"}
        </button>
      </div>
    );
  }

  const waNumber = contact.replace(/\D/g, "");

  return (
    <div style={s.wrap}>
      <a href={`tel:${contact}`} style={s.phone}>{contact}</a>

      <div style={s.actionsRow}>
        <a href={`tel:${contact}`} style={s.callBtn}>
          {t("payment.reveal.call")}
        </a>
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank" rel="noreferrer"
          style={s.waBtn}
        >
          {t("payment.reveal.whatsapp")}
        </a>
      </div>

      <p style={s.note}>{t("payment.reveal.freeNote")}</p>
    </div>
  );
};

const s = {
  wrap: {
    display: "flex", flexDirection: "column", gap: "8px",
    padding: "10px 12px",
    background: "rgba(74,107,58,.08)",
    border: "1px solid rgba(74,107,58,.2)",
    borderRadius: "10px",
  },
  none: { fontSize: ".8rem", color: "rgba(240,230,208,.35)" },
  phone: {
    color: "#d4af63", fontWeight: 600, fontSize: ".95rem",
    textDecoration: "none",
  },
  actionsRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  callBtn: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "6px 12px",
    background: "rgba(74,138,58,.15)",
    border: "1px solid rgba(74,138,58,.3)",
    borderRadius: "6px",
    color: "#7ecb63", fontSize: ".78rem",
    textDecoration: "none",
    fontFamily: "'Poppins',sans-serif",
  },
  waBtn: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "6px 12px",
    background: "rgba(37,211,102,.1)",
    border: "1px solid rgba(37,211,102,.22)",
    borderRadius: "6px",
    color: "#4fcf7c", fontSize: ".78rem",
    textDecoration: "none",
    fontFamily: "'Poppins',sans-serif",
  },
  note: {
    margin: 0,
    fontSize: ".68rem",
    color: "rgba(212,175,99,.45)",
    lineHeight: 1.4,
  },
  lockWrap: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
    padding: "16px 12px",
    background: "rgba(220,53,69,.08)",
    border: "1px solid rgba(220,53,69,.25)",
    borderRadius: "10px",
    textAlign: "center",
  },
  lockIcon: {
    fontSize: "2rem",
  },
  lockText: {
    margin: 0,
    fontSize: ".85rem",
    color: "rgba(240,230,208,.6)",
    fontWeight: 500,
  },
  loginBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg,#d4af63,#8b5a2b)",
    border: "none",
    borderRadius: "6px",
    color: "#1a0f05",
    fontWeight: 600,
    fontSize: ".8rem",
    cursor: "pointer",
    fontFamily: "'Poppins',sans-serif",
    transition: "opacity .2s",
  },
};

export default RevealContact;
