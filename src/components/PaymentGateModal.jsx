import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// ─────────────────────────────────────────────────────────────────────────────
// PaymentGateModal
//
// Drop-in modal that appears when a user hits a feature's free limit.
// Driven entirely by the usePaymentGate hook.
//
// Props:
//   show           – boolean, whether to show the modal
//   onClose        – close callback
//   featureKey     – e.g. "reveal_contact"
//   displayName    – human-readable feature name
//   price          – price in paise (e.g. 900 = ₹9)
//   remaining      – free uses left (0 when modal shown after limit)
//   freeLimit      – total free uses
//   onPay          – callback that triggers the Razorpay flow
//   payLoading     – true while payment is processing
//   payError       – error string from payment attempt
// ─────────────────────────────────────────────────────────────────────────────
const PaymentGateModal = ({
  show,
  onClose,
  featureKey,
  displayName,
  price = 0,
  remaining = 0,
  freeLimit = 0,
  onPay,
  payLoading,
  payError,
}) => {
  const { t } = useTranslation();

  // Lock body scroll while modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  const priceINR = (price / 100).toFixed(0);
  const isFree   = price === 0;

  const featureLabel = t(`transactions.feature.${featureKey}`, displayName);

  const FEATURE_ICON = {
    reveal_contact: "📞",
    highlight_post: "⭐",
    post_animal:    "🐄",
  };
  const FEATURE_BENEFIT_KEY = {
    reveal_contact: "payment.benefit.reveal_contact",
    highlight_post: "payment.benefit.highlight_post",
    post_animal:    "payment.benefit.post_animal",
  };
  const icon = FEATURE_ICON[featureKey] || "🔓";
  const benefit = t(FEATURE_BENEFIT_KEY[featureKey] || "payment.benefit.default", { feature: featureLabel });

  return (
    <>
      <style>{STYLES}</style>

      {/* Backdrop */}
      <div className="pgm-backdrop" onClick={onClose} />

      {/* Sheet */}
      <div className="pgm-sheet" role="dialog" aria-modal="true">

        {/* Close */}
        <button className="pgm-close" onClick={onClose} aria-label={t("common.close")}>✕</button>

        {/* Icon */}
        <div className="pgm-icon">{icon}</div>

        {/* Heading */}
        <h2 className="pgm-title">
          {isFree ? t("payment.modal.unlock", { feature: featureLabel }) : t("payment.modal.limitReached")}
        </h2>

        {/* Usage pill */}
        {freeLimit > 0 && (
          <div className="pgm-usage-pill">
            <span className="pgm-usage-bar">
              <span
                className="pgm-usage-fill"
                style={{ width: `${Math.min(100, ((freeLimit - remaining) / freeLimit) * 100)}%` }}
              />
            </span>
            <span className="pgm-usage-text">
              {t("payment.modal.youHaveUsed", { used: freeLimit - remaining, limit: freeLimit })}
            </span>
          </div>
        )}

        {/* Benefit */}
        <p className="pgm-benefit">{benefit}</p>

        {/* Price block */}
        {!isFree && (
          <div className="pgm-price-block">
            <span className="pgm-price">₹{priceINR}</span>
            <span className="pgm-price-note">{t("payment.modal.costsOnce", { price: priceINR })}</span>
          </div>
        )}

        {/* Error */}
        {payError && <p className="pgm-error">{payError}</p>}

        {/* CTA */}
        <button
          className="pgm-pay-btn"
          onClick={onPay}
          disabled={payLoading}
        >
          {payLoading
            ? <><span className="pgm-btn-spinner" /> {t("payment.modal.processing")}</>
            : isFree
            ? t("payment.modal.unlock", { feature: featureLabel })
            : t("payment.modal.payNow", { price: priceINR })}
        </button>

        <button className="pgm-cancel-btn" onClick={onClose} disabled={payLoading}>
          {t("common.cancel")}
        </button>

        <p className="pgm-secure">🔒 {t("payment.modal.razorpaySafe")}</p>
      </div>
    </>
  );
};

const STYLES = `
/* ── Backdrop ── */
.pgm-backdrop {
  position:fixed; inset:0; background:rgba(10,6,2,.75);
  z-index:1000; backdrop-filter:blur(4px);
  animation:pgm-fade-in .2s ease;
}

/* ── Sheet (bottom sheet on mobile, centred card on desktop) ── */
.pgm-sheet {
  position:fixed; left:50%; transform:translateX(-50%);
  bottom:0; width:100%; max-width:420px;
  background:linear-gradient(160deg,#1a100a 0%,#0f0a05 100%);
  border:1px solid rgba(212,175,99,.18);
  border-radius:20px 20px 0 0;
  padding:28px 24px 36px;
  z-index:1001;
  font-family:'Poppins',sans-serif;
  animation:pgm-slide-up .28s ease;
  text-align:center;
}

/* ── Close ── */
.pgm-close {
  position:absolute; top:14px; right:16px;
  background:none; border:none; color:rgba(212,175,99,.45);
  font-size:1rem; cursor:pointer; line-height:1; padding:4px;
}

/* ── Icon ── */
.pgm-icon { font-size:2.8rem; margin-bottom:10px; }

/* ── Title ── */
.pgm-title {
  font-family:'Playfair Display',serif;
  font-size:1.25rem; color:#f0e6d0;
  margin:0 0 14px;
}

/* ── Usage progress ── */
.pgm-usage-pill {
  display:flex; flex-direction:column; align-items:center; gap:5px;
  margin-bottom:14px;
}
.pgm-usage-bar {
  width:160px; height:6px; background:rgba(212,175,99,.12);
  border-radius:3px; overflow:hidden; display:block;
}
.pgm-usage-fill {
  display:block; height:100%;
  background:linear-gradient(90deg,#d4af63,#8b5a2b);
  border-radius:3px; transition:width .4s;
}
.pgm-usage-text { font-size:.7rem; color:rgba(212,175,99,.45); letter-spacing:.04em; }

/* ── Benefit ── */
.pgm-benefit { font-size:.84rem; color:rgba(240,230,208,.5); margin:0 0 18px; line-height:1.6; }

/* ── Price block ── */
.pgm-price-block {
  display:flex; flex-direction:column; align-items:center; gap:3px;
  margin-bottom:18px; padding:12px 20px;
  background:rgba(212,175,99,.06); border:1px solid rgba(212,175,99,.14);
  border-radius:12px;
}
.pgm-price      { font-family:'Playfair Display',serif; font-size:2rem; color:#d4af63; font-weight:700; line-height:1; }
.pgm-price-note { font-size:.7rem; color:rgba(212,175,99,.4); }

/* ── Error ── */
.pgm-error { font-size:.8rem; color:#fc8181; margin:0 0 12px; }

/* ── Pay button ── */
.pgm-pay-btn {
  width:100%; padding:14px;
  background:linear-gradient(135deg,#d4af63,#8b5a2b);
  color:#1a0f05; border:none; border-radius:12px;
  font-weight:700; font-size:.95rem; cursor:pointer;
  font-family:'Poppins',sans-serif;
  display:flex; align-items:center; justify-content:center; gap:8px;
  transition:opacity .18s;
}
.pgm-pay-btn:disabled { opacity:.6; cursor:not-allowed; }

/* ── Cancel ── */
.pgm-cancel-btn {
  width:100%; padding:11px; margin-top:8px;
  background:transparent; border:1px solid rgba(255,255,255,.08);
  border-radius:12px; color:rgba(240,230,208,.4);
  cursor:pointer; font-family:'Poppins',sans-serif; font-size:.85rem;
}
.pgm-cancel-btn:disabled { opacity:.5; }

/* ── Secure ── */
.pgm-secure { font-size:.68rem; color:rgba(212,175,99,.25); margin:12px 0 0; letter-spacing:.04em; }

/* ── Spinner ── */
.pgm-btn-spinner {
  width:14px; height:14px;
  border:2px solid rgba(26,15,5,.4); border-top:2px solid #1a0f05;
  border-radius:50%; animation:pgm-spin .7s linear infinite; flex-shrink:0;
}

/* ── Animations ── */
@keyframes pgm-fade-in  { from { opacity:0; } to { opacity:1; } }
@keyframes pgm-slide-up { from { transform:translateX(-50%) translateY(40px); opacity:0; } to { transform:translateX(-50%) translateY(0); opacity:1; } }
@keyframes pgm-spin     { to { transform:rotate(360deg); } }

/* ── Desktop: centred card ── */
@media (min-width:640px) {
  .pgm-sheet {
    bottom:auto; top:50%; border-radius:20px;
    transform:translate(-50%,-50%);
    animation:pgm-centre-in .25s ease;
  }
  @keyframes pgm-centre-in {
    from { transform:translate(-50%,-50%) scale(.94); opacity:0; }
    to   { transform:translate(-50%,-50%) scale(1);   opacity:1; }
  }
}
`;

export default PaymentGateModal;
