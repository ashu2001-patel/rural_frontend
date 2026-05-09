import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import usePaymentGate from "../hooks/usePaymentGate";
import PaymentGateModal from "./PaymentGateModal";
import UsageBadge from "./UsageBadge";

const HighlightPost = ({ animalId, isHighlighted, onSuccess }) => {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const gate      = usePaymentGate("highlight_post", animalId);

  const handleHighlight = async () => {
    if (!user) { navigate("/login"); return; }
    await gate.requestAccess(() => onSuccess?.());
  };

  // ── Already highlighted ───────────────────────────────────────────────────
  if (isHighlighted) {
    return (
      <div style={s.highlighted}>
        ⭐ Post is Highlighted
      </div>
    );
  }

  // ── Gate: hide if price is 0 AND no free limit (fully open feature) ───────
  if (!gate.loading && gate.price === 0 && gate.freeLimit === 0) return null;

  return (
    <div style={s.wrap}>

      <button
        style={s.btn}
        onClick={handleHighlight}
        disabled={gate.loading || gate.payLoading}
      >
        {gate.loading || gate.payLoading
          ? "Processing…"
          : gate.requiresPayment
          ? `⭐ Highlight — ₹${(gate.price / 100).toFixed(0)}`
          : gate.remaining > 0
          ? `⭐ Highlight Post (Free)`
          : `⭐ Highlight Post`}
      </button>

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
        featureKey="highlight_post"
        displayName={gate.displayName || "Highlight Post"}
        price={gate.price}
        remaining={gate.remaining}
        freeLimit={gate.freeLimit}
        onPay={() => gate.initiatePayment(() => onSuccess?.())}
        payLoading={gate.payLoading}
        payError={gate.payError}
      />
    </div>
  );
};

const s = {
  wrap: { display: "flex", flexDirection: "column", gap: "6px" },
  btn: {
    width: "100%", padding: "10px 14px",
    background: "rgba(212,175,99,.08)",
    border: "1px solid rgba(212,175,99,.25)",
    borderRadius: "8px", color: "#d4af63",
    fontSize: ".84rem", cursor: "pointer",
    fontFamily: "'Poppins',sans-serif",
    transition: "background .18s",
  },
  highlighted: {
    padding: "8px 14px",
    background: "rgba(212,175,99,.1)",
    border: "1px solid rgba(212,175,99,.25)",
    borderRadius: "8px", fontSize: ".82rem",
    color: "#d4af63", textAlign: "center",
    fontFamily: "'Poppins',sans-serif",
  },
};

export default HighlightPost;
