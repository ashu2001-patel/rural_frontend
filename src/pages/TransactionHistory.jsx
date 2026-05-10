import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { paymentAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const FEATURE_META = {
  reveal_contact: { label: "Reveal Contact", icon: "📞" },
  post_animal:    { label: "Post Animal",    icon: "🐄" },
  highlight_post: { label: "Highlight Post", icon: "⭐" },
};

const STATUS_STYLES = {
  success: { color: "#a0d080", bg: "rgba(74,138,58,.12)", border: "rgba(74,138,58,.3)" },
  pending: { color: "#fbd38d", bg: "rgba(251,211,141,.1)", border: "rgba(251,211,141,.3)" },
  failed:  { color: "#fc8181", bg: "rgba(220,53,69,.12)", border: "rgba(220,53,69,.3)" },
};

const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
       + " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const TransactionHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [filter, setFilter]   = useState("all"); // all | success | pending | failed | free

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await paymentAPI.get("/payment/history");
      setTransactions(res.data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load history");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (filter === "all")  return transactions;
    if (filter === "free") return transactions.filter(t => t.isFree);
    return transactions.filter(t => t.status === filter && !t.isFree);
  }, [transactions, filter]);

  const stats = useMemo(() => {
    const paid    = transactions.filter(t => t.status === "success" && !t.isFree);
    const total   = paid.reduce((sum, t) => sum + (t.amount || 0), 0);
    const free    = transactions.filter(t => t.isFree).length;
    return {
      totalSpent: total,
      paidCount:  paid.length,
      freeCount:  free,
      pending:    transactions.filter(t => t.status === "pending").length,
    };
  }, [transactions]);

  return (
    <>
      <style>{css}</style>
      <div className="th-wrap">
        <header className="th-header">
          <Link to="/profile" className="th-back">← Back</Link>
          <h1 className="th-title">Transaction History</h1>
          <p className="th-sub">All your payments, free uses, and pending orders</p>
        </header>

        {/* ── Stats Strip ─────────────────────────────────────────────── */}
        <div className="th-stats">
          <div className="th-stat">
            <span className="th-stat-label">Total Spent</span>
            <span className="th-stat-val amber">₹{(stats.totalSpent / 100).toFixed(0)}</span>
          </div>
          <div className="th-stat">
            <span className="th-stat-label">Paid</span>
            <span className="th-stat-val">{stats.paidCount}</span>
          </div>
          <div className="th-stat">
            <span className="th-stat-label">Free Uses</span>
            <span className="th-stat-val">{stats.freeCount}</span>
          </div>
          <div className="th-stat">
            <span className="th-stat-label">Pending</span>
            <span className="th-stat-val">{stats.pending}</span>
          </div>
        </div>

        {/* ── Filters ────────────────────────────────────────────────── */}
        <div className="th-filters">
          {[
            { k: "all",     label: "All" },
            { k: "success", label: "Successful" },
            { k: "pending", label: "Pending" },
            { k: "failed",  label: "Failed" },
            { k: "free",    label: "Free" },
          ].map(f => (
            <button
              key={f.k}
              className={`th-chip ${filter === f.k ? "active" : ""}`}
              onClick={() => setFilter(f.k)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Body ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="th-list">
            {[1,2,3].map(i => (
              <div key={i} className="th-skeleton">
                <div className="sk-icon" />
                <div className="sk-body">
                  <div className="sk-line w70" />
                  <div className="sk-line w40" />
                </div>
                <div className="sk-amt" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="th-empty error">
            <span className="th-empty-ico">⚠</span>
            <p>{error}</p>
            <button className="th-retry" onClick={fetchHistory}>Retry</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="th-empty">
            <span className="th-empty-ico">📭</span>
            <h3>No transactions yet</h3>
            <p>
              {filter === "all"
                ? "Your payments and free uses will appear here."
                : `No ${filter} transactions found.`}
            </p>
            {filter !== "all" && (
              <button className="th-retry" onClick={() => setFilter("all")}>Show all</button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="th-list">
            {filtered.map(tx => {
              const meta   = FEATURE_META[tx.type] || { label: tx.type, icon: "•" };
              const status = tx.isFree ? "success" : tx.status;
              const sStyle = STATUS_STYLES[status] || STATUS_STYLES.pending;

              return (
                <div key={tx._id} className="th-item">
                  <div className="th-icon">{meta.icon}</div>

                  <div className="th-main">
                    <div className="th-line1">
                      <span className="th-feature">{meta.label}</span>
                      <span
                        className="th-status"
                        style={{
                          color: sStyle.color,
                          background: sStyle.bg,
                          borderColor: sStyle.border,
                        }}
                      >
                        {tx.isFree ? "Free" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    <div className="th-line2">
                      <span className="th-date">{fmtDate(tx.createdAt)}</span>
                      {tx.referenceId && (
                        <Link to={`/animal/${tx.referenceId}`} className="th-ref">
                          View animal →
                        </Link>
                      )}
                    </div>

                    {tx.razorpayPaymentId && (
                      <div className="th-line3">
                        Payment ID: <span className="th-mono">{tx.razorpayPaymentId}</span>
                      </div>
                    )}
                  </div>

                  <div className="th-amount">
                    {tx.isFree
                      ? <span className="amt-free">FREE</span>
                      : <span className="amt-val">₹{(tx.amount / 100).toFixed(0)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const css = `
  .th-wrap {
    max-width: 760px; margin: 0 auto; padding: 24px 16px 80px;
    font-family: 'Poppins', sans-serif; color: #f0e6d0;
  }
  .th-header { margin-bottom: 18px; }
  .th-back {
    display: inline-block; color: rgba(212,175,99,.6); text-decoration: none;
    font-size: .85rem; margin-bottom: 8px; transition: color .15s;
  }
  .th-back:hover { color: #d4af63; }
  .th-title {
    font-family: 'Playfair Display', serif; color: #d4af63;
    font-size: 1.7rem; margin: 4px 0 6px;
  }
  .th-sub { color: rgba(240,230,208,.5); font-size: .85rem; margin: 0; }

  .th-stats {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
    margin: 18px 0;
  }
  .th-stat {
    background: rgba(212,175,99,.05);
    border: 1px solid rgba(212,175,99,.12);
    border-radius: 10px; padding: 12px 10px; text-align: center;
  }
  .th-stat-label {
    display: block; font-size: .65rem; letter-spacing: .12em;
    text-transform: uppercase; color: rgba(212,175,99,.45); margin-bottom: 4px;
  }
  .th-stat-val { font-size: 1.15rem; font-weight: 600; color: #f0e6d0; }
  .th-stat-val.amber { color: #d4af63; }

  .th-filters {
    display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0;
    overflow-x: auto; padding-bottom: 4px;
  }
  .th-chip {
    padding: 6px 14px; border-radius: 16px;
    background: transparent; border: 1px solid rgba(212,175,99,.2);
    color: rgba(240,230,208,.6); font-size: .78rem; cursor: pointer;
    font-family: inherit; white-space: nowrap; transition: all .15s;
  }
  .th-chip:hover { border-color: rgba(212,175,99,.4); color: #d4af63; }
  .th-chip.active {
    background: rgba(212,175,99,.12); border-color: #d4af63; color: #d4af63;
  }

  .th-list { display: flex; flex-direction: column; gap: 10px; }
  .th-item {
    display: flex; gap: 12px; align-items: center;
    background: rgba(212,175,99,.04);
    border: 1px solid rgba(212,175,99,.12);
    border-radius: 12px; padding: 14px 16px;
    transition: border-color .15s, background .15s;
  }
  .th-item:hover {
    border-color: rgba(212,175,99,.28);
    background: rgba(212,175,99,.06);
  }
  .th-icon {
    width: 42px; height: 42px; border-radius: 10px;
    background: rgba(212,175,99,.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
  }
  .th-main { flex: 1; min-width: 0; }
  .th-line1 {
    display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
    flex-wrap: wrap;
  }
  .th-feature { font-size: .92rem; color: #f0e6d0; font-weight: 500; }
  .th-status {
    padding: 2px 8px; border-radius: 10px; font-size: .65rem;
    border: 1px solid; text-transform: uppercase; letter-spacing: .06em;
    font-weight: 600;
  }
  .th-line2 {
    display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
    font-size: .76rem; color: rgba(240,230,208,.45);
  }
  .th-ref {
    color: #d4af63; text-decoration: none; font-weight: 500;
  }
  .th-ref:hover { text-decoration: underline; }
  .th-line3 {
    font-size: .68rem; color: rgba(240,230,208,.35); margin-top: 4px;
  }
  .th-mono { font-family: 'Courier New', monospace; }

  .th-amount { flex-shrink: 0; text-align: right; }
  .amt-val { font-size: 1.05rem; font-weight: 600; color: #d4af63; }
  .amt-free {
    font-size: .68rem; font-weight: 600; color: #a0d080;
    padding: 4px 8px; background: rgba(74,138,58,.1);
    border-radius: 6px; border: 1px solid rgba(74,138,58,.25);
    letter-spacing: .08em;
  }

  /* Skeleton */
  .th-skeleton {
    display: flex; gap: 12px; align-items: center;
    background: rgba(212,175,99,.04);
    border: 1px solid rgba(212,175,99,.1);
    border-radius: 12px; padding: 14px 16px;
  }
  .sk-icon, .sk-line, .sk-amt {
    background: linear-gradient(90deg,
      rgba(212,175,99,.06), rgba(212,175,99,.14), rgba(212,175,99,.06));
    background-size: 200% 100%;
    animation: th-shimmer 1.4s ease-in-out infinite;
    border-radius: 6px;
  }
  .sk-icon  { width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0; }
  .sk-body  { flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .sk-line  { height: 12px; }
  .w70      { width: 70%; }
  .w40      { width: 40%; }
  .sk-amt   { width: 60px; height: 20px; }
  @keyframes th-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Empty / Error */
  .th-empty {
    text-align: center; padding: 60px 20px;
    background: rgba(212,175,99,.03);
    border: 1px dashed rgba(212,175,99,.18);
    border-radius: 14px;
  }
  .th-empty.error { border-color: rgba(220,53,69,.3); }
  .th-empty-ico {
    font-size: 2.2rem; display: block; margin-bottom: 10px; opacity: .7;
  }
  .th-empty h3 {
    color: #d4af63; font-family: 'Playfair Display', serif;
    margin: 0 0 6px; font-weight: 500;
  }
  .th-empty p {
    color: rgba(240,230,208,.5); font-size: .88rem; margin: 0 0 16px;
  }
  .th-retry {
    padding: 8px 18px; background: rgba(212,175,99,.1);
    border: 1px solid rgba(212,175,99,.3); border-radius: 8px;
    color: #d4af63; font-size: .82rem; cursor: pointer;
    font-family: inherit; transition: background .15s;
  }
  .th-retry:hover { background: rgba(212,175,99,.18); }

  @media (max-width: 540px) {
    .th-stats { grid-template-columns: repeat(2, 1fr); }
    .th-title { font-size: 1.4rem; }
    .th-feature { font-size: .85rem; }
    .amt-val { font-size: .95rem; }
  }
`;

export default TransactionHistory;
