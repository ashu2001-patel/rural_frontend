// ─────────────────────────────────────────────────────────────────────────────
// UsageBadge — shows remaining free uses inline next to a feature button.
//
// Props:
//   remaining   – free uses left
//   freeLimit   – total free uses
//   price       – price in paise (0 = always free)
//   loading     – true while fetching
//   size        – "sm" | "md" (default "sm")
// ─────────────────────────────────────────────────────────────────────────────
const UsageBadge = ({ remaining, freeLimit, price = 0, loading = false, size = "sm" }) => {
  if (loading) return <span style={s.skeleton} />;

  // Always-free feature — no badge needed
  if (price === 0 && freeLimit === 0) return null;

  const used    = freeLimit - remaining;
  const pct     = freeLimit > 0 ? Math.min(100, (used / freeLimit) * 100) : 0;
  const isWarn  = remaining <= 1 && remaining > 0;
  const isDone  = remaining === 0;

  const color = isDone ? "#fc8181" : isWarn ? "#fbd38d" : "#a0d080";

  if (size === "md") {
    return (
      <div style={s.wrapMd}>
        <div style={s.barWrap}>
          <div style={{ ...s.barFill, width: `${pct}%` }} />
        </div>
        <span style={{ ...s.text, color }}>
          {isDone
            ? `Free limit reached · ₹${(price / 100).toFixed(0)} to continue`
            : `${remaining} free use${remaining !== 1 ? "s" : ""} left`}
        </span>
      </div>
    );
  }

  // size === "sm"
  return (
    <span
      style={{
        ...s.pill,
        background: isDone
          ? "rgba(220,53,69,.12)"
          : isWarn
          ? "rgba(251,211,141,.1)"
          : "rgba(74,138,58,.1)",
        border: `1px solid ${isDone ? "rgba(220,53,69,.3)" : isWarn ? "rgba(251,211,141,.3)" : "rgba(74,138,58,.25)"}`,
        color,
      }}
    >
      {isDone ? "Limit reached" : `${remaining} free left`}
    </span>
  );
};

const s = {
  pill: {
    display: "inline-block", padding: "2px 8px", borderRadius: "12px",
    fontSize: "0.66rem", letterSpacing: "0.04em", fontFamily: "'Poppins',sans-serif",
    whiteSpace: "nowrap",
  },
  wrapMd: {
    display: "flex", flexDirection: "column", gap: "4px",
  },
  barWrap: {
    height: "4px", background: "rgba(212,175,99,.1)", borderRadius: "2px", overflow: "hidden",
    width: "100%",
  },
  barFill: {
    height: "100%",
    background: "linear-gradient(90deg,#d4af63,#8b5a2b)",
    borderRadius: "2px",
    transition: "width .4s",
  },
  text: {
    fontSize: "0.7rem", fontFamily: "'Poppins',sans-serif",
  },
  skeleton: {
    display: "inline-block", width: "70px", height: "16px",
    borderRadius: "8px", background: "rgba(212,175,99,.08)",
  },
};

export default UsageBadge;
