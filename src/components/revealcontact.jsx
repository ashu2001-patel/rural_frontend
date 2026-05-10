import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import usePaymentGate from "../hooks/usePaymentGate";
import PaymentGateModal from "./PaymentGateModal";
import UsageBadge from "./UsageBadge";

const RevealContact = ({ contact, animalId }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Persist reveal state for this animal across re-renders (sessionStorage)
  const [revealed, setRevealed] = useState(
    () => sessionStorage.getItem(`revealed_${animalId}`) === "1"
  );

  const gate = usePaymentGate("reveal_contact", animalId);

  const persistReveal = () => {
    sessionStorage.setItem(`revealed_${animalId}`, "1");
    setRevealed(true);
  };

  const handleReveal = async () => {
    if (revealed) return;
    // requestAccess either consumes a free slot or opens the payment modal
    await gate.requestAccess(persistReveal);
  };

  if (!contact) {
    return <span style={s.none}>{t("common.notProvided")}</span>;
  }

  // ── Already revealed ──────────────────────────────────────────────────────
  if (revealed) {
    return (
      <div style={s.revealed}>
        <a href={`tel:${contact}`} style={s.phone}>{contact}</a>
        <a
          href={`https://wa.me/${contact.replace(/\D/g, "")}`}
          target="_blank" rel="noreferrer"
          style={s.waBtn}
        >
          {t("payment.reveal.whatsapp")}
        </a>
      </div>
    );
  }

  // ── Hidden / gated ────────────────────────────────────────────────────────
  return (
    <div style={s.wrap}>

      <div style={s.blurRow}>
        <span style={s.blurred}>{t("payment.reveal.blurredPlaceholder")}</span>
        <button style={s.revealBtn} onClick={handleReveal} disabled={gate.loading}>
          {gate.loading
            ? t("payment.reveal.loadingDot")
            : gate.requiresPayment
            ? t("payment.reveal.buttonRevealPaid", { price: (gate.price / 100).toFixed(0) })
            : t("payment.reveal.buttonRevealFree")}
        </button>
      </div>

      {user && (
        <UsageBadge
          remaining={gate.remaining}
          freeLimit={gate.freeLimit}
          price={gate.price}
          loading={gate.loading}
        />
      )}

      <PaymentGateModal
        show={gate.showModal}
        onClose={gate.closeModal}
        featureKey="reveal_contact"
        displayName={gate.displayName || t("payment.reveal.displayName")}
        price={gate.price}
        remaining={gate.remaining}
        freeLimit={gate.freeLimit}
        onPay={() => gate.initiatePayment(persistReveal)}
        payLoading={gate.payLoading}
        payError={gate.payError}
      />
    </div>
  );
};

const s = {
  wrap:    { display: "flex", flexDirection: "column", gap: "6px" },
  none:    { fontSize: ".8rem", color: "rgba(240,230,208,.35)" },
  blurRow: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  blurred: {
    color: "rgba(240,230,208,.25)", letterSpacing: ".1em",
    fontSize: ".9rem", userSelect: "none", filter: "blur(3px)",
  },
  revealBtn: {
    padding: "5px 12px",
    background: "linear-gradient(135deg,rgba(212,175,99,.15),rgba(139,90,43,.15))",
    border: "1px solid rgba(212,175,99,.3)", borderRadius: "6px",
    color: "#d4af63", fontSize: ".76rem", cursor: "pointer",
    fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap",
  },
  revealed: {
    display: "flex", flexDirection: "column", gap: "7px",
    padding: "10px 12px", background: "rgba(74,107,58,.1)",
    border: "1px solid rgba(74,107,58,.2)", borderRadius: "10px",
  },
  phone: { color: "#d4af63", fontWeight: 600, fontSize: ".95rem", textDecoration: "none" },
  waBtn: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "6px 12px", background: "rgba(37,211,102,.1)",
    border: "1px solid rgba(37,211,102,.22)", borderRadius: "6px",
    color: "#4fcf7c", fontSize: ".78rem", textDecoration: "none",
    fontFamily: "'Poppins',sans-serif",
  },
};

export default RevealContact;
