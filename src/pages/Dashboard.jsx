import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { animalAPI, paymentAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const FEATURE_ICON = {
  reveal_contact: "📞",
  post_animal:    "🐄",
  highlight_post: "⭐",
};

const fmtRelative = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)    return "just now";
  if (m < 60)   return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)   return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)    return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    listings:    [],
    sellerReqs:  [],
    buyerReqs:   [],
    transactions: [],
    usage:       [],
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    // Each call is independent; one failing should not blank out the page.
    const safe = (p) => p.then(r => r.data).catch(() => null);

    const [listings, sellerReqs, buyerReqs, history, usage] = await Promise.all([
      safe(animalAPI.get("/animal/my")),
      safe(animalAPI.get("/request/seller/requests")),
      safe(animalAPI.get("/request/buyer/requests")),
      safe(paymentAPI.get("/payment/history")),
      safe(paymentAPI.get("/usage/status")),
    ]);

    setData({
      listings:     listings?.animals || listings?.data || listings || [],
      sellerReqs:   sellerReqs?.requests || sellerReqs || [],
      buyerReqs:    buyerReqs?.requests  || buyerReqs  || [],
      transactions: history?.transactions || [],
      usage:        usage?.features || [],
    });
    setLoading(false);
  };

  /* ── Derived stats ────────────────────────────────────────────────── */
  const listings    = Array.isArray(data.listings) ? data.listings : [];
  const sellerReqs  = Array.isArray(data.sellerReqs) ? data.sellerReqs : [];
  const buyerReqs   = Array.isArray(data.buyerReqs) ? data.buyerReqs : [];
  const transactions = Array.isArray(data.transactions) ? data.transactions : [];

  const activeListings  = listings.filter(a => a.status !== "sold").length;
  const pendingReceived = sellerReqs.filter(r => r.status === "pending").length;
  const totalSpent      = transactions
    .filter(t => t.status === "success" && !t.isFree)
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const freeRemaining   = data.usage.reduce((sum, f) => sum + f.remaining, 0);

  /* ── Recent activity feed (merged + sorted) ────────────────────────── */
  const activity = [
    ...transactions.slice(0, 10).map(t => ({
      kind: "tx",
      date: t.createdAt,
      icon: FEATURE_ICON[t.type] || "💳",
      title: t.isFree
        ? `Used free ${(t.type || "").replace("_", " ")}`
        : `Paid ₹${(t.amount / 100).toFixed(0)} for ${(t.type || "").replace("_", " ")}`,
      meta: t.status,
      link: t.referenceId ? `/animal/${t.referenceId}` : null,
    })),
    ...sellerReqs.slice(0, 10).map(r => ({
      kind: "req-in",
      date: r.createdAt,
      icon: "📥",
      title: `New request from ${r.buyerName || "buyer"}`,
      meta: r.status,
      link: r.animalId ? `/animal/${r.animalId}` : "/requests",
    })),
    ...buyerReqs.slice(0, 10).map(r => ({
      kind: "req-out",
      date: r.createdAt,
      icon: "📤",
      title: `You requested ${r.animalName || "an animal"}`,
      meta: r.status,
      link: r.animalId ? `/animal/${r.animalId}` : "/requests",
    })),
  ]
    .filter(a => a.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <>
      <style>{css}</style>
      <div className="db-wrap">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <header className="db-hero">
          <div>
            <p className="db-greet">Welcome back,</p>
            <h1 className="db-name">{user?.name?.split(" ")[0] || "Friend"} 👋</h1>
          </div>
          <Link to="/post-animal" className="db-post-btn">＋ Post Animal</Link>
        </header>

        {/* ── Stat cards ───────────────────────────────────────────── */}
        <section className="db-stats">
          <Link to="/my-listings" className="db-stat clickable">
            <span className="db-stat-ico">🐄</span>
            <div>
              <span className="db-stat-val">{loading ? "—" : activeListings}</span>
              <span className="db-stat-lbl">Active Listings</span>
            </div>
          </Link>

          <Link to="/requests" className="db-stat clickable">
            <span className="db-stat-ico">📥</span>
            <div>
              <span className="db-stat-val">{loading ? "—" : pendingReceived}</span>
              <span className="db-stat-lbl">Pending Requests</span>
            </div>
          </Link>

          <div className="db-stat">
            <span className="db-stat-ico">🎁</span>
            <div>
              <span className="db-stat-val">{loading ? "—" : freeRemaining}</span>
              <span className="db-stat-lbl">Free Uses Left</span>
            </div>
          </div>

          <Link to="/transactions" className="db-stat clickable">
            <span className="db-stat-ico">💳</span>
            <div>
              <span className="db-stat-val amber">
                {loading ? "—" : `₹${(totalSpent / 100).toFixed(0)}`}
              </span>
              <span className="db-stat-lbl">Total Spent</span>
            </div>
          </Link>
        </section>

        {/* ── Free usage breakdown ─────────────────────────────────── */}
        <section className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">Your Free Usage</h2>
            <span className="db-card-sub">Resets monthly</span>
          </div>

          {loading && <div className="db-skeleton" />}
          {!loading && data.usage.length === 0 && (
            <p className="db-empty-line">No usage data available.</p>
          )}
          {!loading && data.usage.length > 0 && (
            <div className="db-usage-list">
              {data.usage.map(f => {
                const used = f.freeLimit - f.remaining;
                const pct  = f.freeLimit > 0 ? (used / f.freeLimit) * 100 : 0;
                const done = f.remaining === 0;
                return (
                  <div key={f.featureKey} className="db-usage-row">
                    <div className="db-usage-head">
                      <span className="db-usage-name">
                        <span className="db-usage-ico">{FEATURE_ICON[f.featureKey] || "•"}</span>
                        {f.displayName}
                      </span>
                      <span className={`db-usage-count ${done ? "exhausted" : ""}`}>
                        {f.remaining}/{f.freeLimit} left
                      </span>
                    </div>
                    <div className="db-bar">
                      <div
                        className="db-bar-fill"
                        style={{ width: `${pct}%`, background: done ? "#fc8181" : undefined }}
                      />
                    </div>
                    {done && (
                      <span className="db-usage-note">
                        ₹{(f.price / 100).toFixed(0)} per use after limit
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Recent activity ───────────────────────────────────────── */}
        <section className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">Recent Activity</h2>
            <Link to="/transactions" className="db-card-link">View history →</Link>
          </div>

          {loading && (
            <>
              <div className="db-skeleton" />
              <div className="db-skeleton" />
              <div className="db-skeleton" />
            </>
          )}

          {!loading && activity.length === 0 && (
            <p className="db-empty-line">
              Nothing here yet. Browse the marketplace to get started.
            </p>
          )}

          {!loading && activity.length > 0 && (
            <div className="db-activity">
              {activity.map((a, i) => {
                const Wrapper = a.link ? Link : "div";
                const props   = a.link ? { to: a.link } : {};
                return (
                  <Wrapper key={i} className="db-activity-item" {...props}>
                    <span className="db-act-ico">{a.icon}</span>
                    <div className="db-act-body">
                      <span className="db-act-title">{a.title}</span>
                      <span className="db-act-meta">
                        {fmtRelative(a.date)}
                        {a.meta && <> · <span className="db-act-status">{a.meta}</span></>}
                      </span>
                    </div>
                    {a.link && <span className="db-act-arrow">→</span>}
                  </Wrapper>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Quick links ──────────────────────────────────────────── */}
        <section className="db-quick">
          <Link to="/my-listings"   className="db-quick-tile">📋 My Listings</Link>
          <Link to="/requests"      className="db-quick-tile">📥 Requests</Link>
          <Link to="/transactions"  className="db-quick-tile">💳 Transactions</Link>
          <Link to="/profile"       className="db-quick-tile">👤 Profile</Link>
        </section>
      </div>
    </>
  );
};

const css = `
  .db-wrap {
    max-width: 960px; margin: 0 auto; padding: 20px 16px 80px;
    font-family: 'Poppins', sans-serif; color: #f0e6d0;
  }

  /* Hero */
  .db-hero {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
  }
  .db-greet {
    color: rgba(240,230,208,.5); margin: 0; font-size: .85rem;
  }
  .db-name {
    font-family: 'Playfair Display', serif; color: #d4af63;
    font-size: 1.9rem; margin: 2px 0 0; font-weight: 700;
  }
  .db-post-btn {
    padding: 10px 20px; background: linear-gradient(135deg,#d4af63,#8b5a2b);
    color: #1a0f05; border-radius: 10px; text-decoration: none;
    font-weight: 600; font-size: .9rem; box-shadow: 0 2px 12px rgba(212,175,99,.25);
    transition: transform .15s, box-shadow .15s;
  }
  .db-post-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 18px rgba(212,175,99,.35);
  }

  /* Stat cards */
  .db-stats {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
    margin-bottom: 24px;
  }
  .db-stat {
    display: flex; align-items: center; gap: 12px;
    background: rgba(212,175,99,.05);
    border: 1px solid rgba(212,175,99,.12);
    border-radius: 14px; padding: 14px 16px;
    text-decoration: none; color: inherit;
    transition: border-color .15s, transform .15s;
  }
  .db-stat.clickable:hover {
    border-color: rgba(212,175,99,.3);
    transform: translateY(-2px);
  }
  .db-stat-ico {
    font-size: 1.6rem; flex-shrink: 0;
  }
  .db-stat-val {
    display: block; font-size: 1.3rem; font-weight: 600; color: #f0e6d0;
    line-height: 1.1;
  }
  .db-stat-val.amber { color: #d4af63; }
  .db-stat-lbl {
    display: block; font-size: .68rem; color: rgba(212,175,99,.5);
    letter-spacing: .08em; text-transform: uppercase; margin-top: 2px;
  }

  /* Card */
  .db-card {
    background: rgba(212,175,99,.04);
    border: 1px solid rgba(212,175,99,.12);
    border-radius: 14px; padding: 18px; margin-bottom: 18px;
  }
  .db-card-header {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 14px; flex-wrap: wrap; gap: 6px;
  }
  .db-card-title {
    font-family: 'Playfair Display', serif; color: #d4af63;
    font-size: 1.1rem; margin: 0; font-weight: 500;
  }
  .db-card-sub {
    font-size: .7rem; color: rgba(212,175,99,.4);
    text-transform: uppercase; letter-spacing: .08em;
  }
  .db-card-link {
    color: #d4af63; text-decoration: none; font-size: .82rem;
  }
  .db-card-link:hover { text-decoration: underline; }
  .db-empty-line {
    color: rgba(240,230,208,.4); font-size: .85rem; margin: 0;
  }

  /* Usage rows */
  .db-usage-list { display: flex; flex-direction: column; gap: 14px; }
  .db-usage-row { display: flex; flex-direction: column; gap: 6px; }
  .db-usage-head {
    display: flex; justify-content: space-between; align-items: center;
    font-size: .88rem;
  }
  .db-usage-name {
    color: #f0e6d0; display: inline-flex; gap: 8px; align-items: center;
  }
  .db-usage-ico { font-size: 1rem; }
  .db-usage-count { color: rgba(212,175,99,.7); font-size: .78rem; }
  .db-usage-count.exhausted { color: #fc8181; }
  .db-bar {
    height: 6px; background: rgba(212,175,99,.1);
    border-radius: 3px; overflow: hidden;
  }
  .db-bar-fill {
    height: 100%; background: linear-gradient(90deg,#d4af63,#8b5a2b);
    transition: width .4s;
  }
  .db-usage-note {
    font-size: .7rem; color: #fc8181; opacity: .8;
  }

  /* Activity */
  .db-activity { display: flex; flex-direction: column; gap: 8px; }
  .db-activity-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; background: rgba(212,175,99,.03);
    border: 1px solid rgba(212,175,99,.08);
    border-radius: 10px; text-decoration: none; color: inherit;
    transition: background .15s, border-color .15s;
  }
  .db-activity-item:hover {
    background: rgba(212,175,99,.07);
    border-color: rgba(212,175,99,.18);
  }
  .db-act-ico { font-size: 1.2rem; flex-shrink: 0; }
  .db-act-body { flex: 1; min-width: 0; }
  .db-act-title {
    display: block; color: #f0e6d0; font-size: .88rem; font-weight: 500;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .db-act-meta {
    display: block; color: rgba(240,230,208,.4); font-size: .72rem;
    margin-top: 2px;
  }
  .db-act-status { text-transform: capitalize; }
  .db-act-arrow { color: rgba(212,175,99,.4); flex-shrink: 0; }

  /* Skeleton */
  .db-skeleton {
    height: 50px; border-radius: 10px; margin-bottom: 8px;
    background: linear-gradient(90deg,
      rgba(212,175,99,.04), rgba(212,175,99,.12), rgba(212,175,99,.04));
    background-size: 200% 100%;
    animation: db-shimmer 1.4s ease-in-out infinite;
  }
  @keyframes db-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Quick links */
  .db-quick {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  }
  .db-quick-tile {
    text-align: center; padding: 14px 10px;
    background: rgba(212,175,99,.05);
    border: 1px solid rgba(212,175,99,.12);
    border-radius: 10px; color: #d4af63; text-decoration: none;
    font-size: .85rem; transition: all .15s;
  }
  .db-quick-tile:hover {
    background: rgba(212,175,99,.12);
    border-color: rgba(212,175,99,.3);
  }

  /* Mobile */
  @media (max-width: 720px) {
    .db-stats { grid-template-columns: repeat(2, 1fr); }
    .db-quick { grid-template-columns: repeat(2, 1fr); }
    .db-name  { font-size: 1.5rem; }
    .db-stat-val { font-size: 1.1rem; }
  }
`;

export default Dashboard;
