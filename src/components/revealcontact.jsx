import { useTranslation } from "react-i18next";

// ─────────────────────────────────────────────────────────────────────────────
// RevealContact — shows the seller's phone freely.
// Pricing may be re-introduced later (the payment-gate scaffolding still
// exists in usePaymentGate / FeatureConfig and can be turned back on
// without UI changes here).
// ─────────────────────────────────────────────────────────────────────────────
const RevealContact = ({ contact }) => {
  const { t } = useTranslation();

  if (!contact) {
    return <span style={s.none}>{t("common.notProvided")}</span>;
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
};

export default RevealContact;
