import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MediaViewer from "../components/MediaViewer";
import HighlightPost from "../components/Highlightpost";

const MyAnimals = () => {
  const [animals, setAnimals]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deletingId, setDelId]  = useState(null);
  const [refreshing, setRefresh] = useState(false);

  const { user }  = useAuth();
  const navigate  = useNavigate();

  const fetchMyAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await animalAPI.get("/animal/my");
      setAnimals(res?.data?.animals || []);
    } catch (err) {
      console.error("Fetch failed", err?.response?.data || err.message);
      setAnimals([]);
      if (err?.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchMyAnimals();
  }, [user, navigate, fetchMyAnimals]);

  const handleRefresh = () => { setRefresh(true); fetchMyAnimals(); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    try {
      setDelId(id);
      await animalAPI.delete(`/animal/${id}`);
      setAnimals(prev => prev.filter(a => a._id !== id));
    } catch {
      alert("Delete failed. Please try again.");
    } finally {
      setDelId(null);
    }
  };

  const totalValue      = animals.reduce((s, a) => s + Number(a.price || 0), 0);
  const availableCount  = animals.filter(a => a.status !== "sold").length;
  const soldCount       = animals.length - availableCount;

  return (
    <>
      <style>{STYLES}</style>
      <div className="ma-page">
        <div className="ma-shell">

          {/* ── Top bar ── */}
          <div className="ma-topbar">
            <div>
              <h2 className="ma-heading">My Animals</h2>
              <p className="ma-sub">Manage your livestock listings</p>
            </div>
            <div className="ma-topbar-actions">
              <button className="ma-btn ma-btn--ghost" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? "…" : "↻"}
              </button>
              <button className="ma-btn ma-btn--gold" onClick={() => navigate("/post-animal")}>
                + Post Animal
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="ma-stats">
            {[
              { label: "Total",     value: animals.length,             icon: "🐄" },
              { label: "Available", value: availableCount,             icon: "🟢" },
              { label: "Sold",      value: soldCount,                  icon: "✅" },
              { label: "Est. Value",value: `₹${totalValue.toLocaleString()}`, icon: "💰" },
            ].map(s => (
              <div key={s.label} className="ma-stat-card">
                <span className="ma-stat-icon">{s.icon}</span>
                <strong className="ma-stat-val">{s.value}</strong>
                <span className="ma-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="ma-center">
              <div className="ma-spinner" />
              <p className="ma-hint">Loading your animals…</p>
            </div>

          ) : animals.length === 0 ? (
            <div className="ma-empty">
              <span className="ma-empty-icon">🐄</span>
              <h3 className="ma-empty-title">No listings yet</h3>
              <p className="ma-empty-sub">Post your first animal to reach thousands of buyers</p>
              <button className="ma-btn ma-btn--gold ma-btn--wide" onClick={() => navigate("/post-animal")}>
                + Post Your First Animal
              </button>
            </div>

          ) : (
            <div className="ma-grid">
              {animals.map(animal => (
                <div key={animal._id} className="ma-card">

                  {/* Media */}
                  <div className="ma-card-media">
                    <MediaViewer images={animal.images || []} videos={animal.videos || []} />
                    <span className={`ma-status-badge ${animal.status === "sold" ? "ma-status-badge--sold" : "ma-status-badge--live"}`}>
                      {animal.status === "sold" ? "Sold" : "Live"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="ma-card-body">
                    <div className="ma-card-row">
                      <h3 className="ma-card-name">{animal.name}</h3>
                      {animal.category && (
                        <span className="ma-card-cat">{animal.category}</span>
                      )}
                    </div>

                    <p className="ma-card-price">₹{Number(animal.price || 0).toLocaleString()}</p>

                    <div className="ma-card-meta-row">
                      <span className="ma-card-meta">📍 {animal.location || "—"}</span>
                      <span className="ma-card-meta">📞 {animal.contact || "—"}</span>
                    </div>

                    <p className="ma-card-date">
                      Posted {animal.createdAt
                        ? new Date(animal.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
                        : "N/A"}
                    </p>

                    {/* Highlight */}
                    <div className="ma-highlight-wrap">
                      <HighlightPost
                        animalId={animal._id}
                        isHighlighted={animal.isHighlighted}
                        onSuccess={fetchMyAnimals}
                      />
                    </div>

                    {/* Actions */}
                    <div className="ma-actions">
                      <button
                        className="ma-action-btn ma-action-btn--requests"
                        onClick={() => navigate("/requests")}
                      >
                        📥 Requests
                      </button>
                      <button
                        className="ma-action-btn ma-action-btn--view"
                        onClick={() => navigate(`/animal/${animal._id}`)}
                      >
                        👁 View
                      </button>
                      <button
                        className="ma-action-btn ma-action-btn--delete"
                        disabled={deletingId === animal._id}
                        onClick={() => handleDelete(animal._id)}
                      >
                        {deletingId === animal._id ? "…" : "🗑"}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');

/* ── Base ── */
.ma-page  { min-height:100vh; background:#0f0a05; padding:16px; font-family:'Poppins',sans-serif; color:#f0e6d0; }
.ma-shell { max-width:1100px; margin:0 auto; }

/* ── Top bar ── */
.ma-topbar         { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
.ma-topbar-actions { display:flex; gap:8px; align-items:center; }
.ma-heading { font-family:'Playfair Display',serif; font-size:1.5rem; color:#f0e6d0; margin:0 0 2px; }
.ma-sub     { font-size:.78rem; color:rgba(240,230,208,.35); margin:0; }

/* ── Buttons ── */
.ma-btn        { padding:9px 16px; border-radius:8px; border:none; cursor:pointer; font-family:'Poppins',sans-serif; font-size:.82rem; font-weight:500; transition:all .18s; }
.ma-btn--ghost { background:rgba(255,255,255,.05); border:1px solid rgba(212,175,99,.18); color:rgba(212,175,99,.7); }
.ma-btn--gold  { background:linear-gradient(135deg,#d4af63,#8b5a2b); color:#1a0f05; font-weight:600; }
.ma-btn--wide  { padding:12px 24px; font-size:.9rem; margin-top:16px; }
.ma-btn--ghost:hover { border-color:rgba(212,175,99,.4); }

/* ── Stats ── */
.ma-stats    { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:22px; }
.ma-stat-card {
  background:rgba(22,14,8,.85); border:1px solid rgba(212,175,99,.1);
  border-radius:12px; padding:14px 10px; text-align:center;
  display:flex; flex-direction:column; align-items:center; gap:4px;
}
.ma-stat-icon  { font-size:1.3rem; }
.ma-stat-val   { font-family:'Playfair Display',serif; font-size:1.2rem; color:#d4af63; }
.ma-stat-label { font-size:.65rem; color:rgba(212,175,99,.4); letter-spacing:.08em; text-transform:uppercase; }

/* ── Grid ── */
.ma-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:18px; }

/* ── Card ── */
.ma-card {
  background:rgba(22,14,8,.92); border:1px solid rgba(212,175,99,.1);
  border-radius:14px; overflow:hidden; transition:border-color .2s, box-shadow .2s;
}
.ma-card:hover { border-color:rgba(212,175,99,.25); box-shadow:0 8px 28px rgba(0,0,0,.4); }
.ma-card-media { position:relative; }
.ma-status-badge {
  position:absolute; top:10px; right:10px;
  font-size:.62rem; padding:3px 9px; border-radius:20px;
  letter-spacing:.07em; text-transform:uppercase; font-weight:600; z-index:2;
}
.ma-status-badge--live { background:rgba(74,138,58,.25); border:1px solid rgba(74,138,58,.4); color:#7ecb63; }
.ma-status-badge--sold { background:rgba(180,60,60,.22); border:1px solid rgba(180,60,60,.35); color:#f08080; }

.ma-card-body     { padding:14px; }
.ma-card-row      { display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap; }
.ma-card-name     { font-family:'Playfair Display',serif; font-size:1.1rem; color:#f0e6d0; margin:0; }
.ma-card-cat      { font-size:.62rem; padding:2px 8px; background:rgba(212,175,99,.1); border:1px solid rgba(212,175,99,.22); border-radius:4px; color:rgba(212,175,99,.7); }
.ma-card-price    { font-family:'Playfair Display',serif; font-size:1.2rem; color:#d4af63; font-weight:700; margin:6px 0; }
.ma-card-meta-row { display:flex; flex-direction:column; gap:3px; margin-bottom:6px; }
.ma-card-meta     { font-size:.76rem; color:rgba(240,230,208,.45); }
.ma-card-date     { font-size:.7rem; color:rgba(212,175,99,.3); margin-bottom:10px; }
.ma-highlight-wrap { margin-bottom:10px; }

/* ── Card actions ── */
.ma-actions { display:flex; gap:7px; }
.ma-action-btn {
  flex:1; padding:9px 6px; border:none; border-radius:8px;
  cursor:pointer; font-size:.75rem; font-family:'Poppins',sans-serif;
  font-weight:500; transition:opacity .18s;
}
.ma-action-btn:disabled       { opacity:.5; cursor:not-allowed; }
.ma-action-btn--requests      { background:rgba(212,175,99,.1); border:1px solid rgba(212,175,99,.22); color:rgba(212,175,99,.8); }
.ma-action-btn--view          { background:rgba(74,107,180,.12); border:1px solid rgba(74,107,180,.25); color:rgba(130,160,230,.8); }
.ma-action-btn--delete        { flex:0 0 42px; background:rgba(220,53,69,.1); border:1px solid rgba(220,53,69,.2); color:rgba(240,100,100,.8); }

/* ── Empty / loading ── */
.ma-center { display:flex; flex-direction:column; align-items:center; padding:80px 16px; }
.ma-spinner {
  width:36px; height:36px; border:2px solid rgba(212,175,99,.15);
  border-top:2px solid #d4af63; border-radius:50%;
  animation:ma-spin .8s linear infinite; margin-bottom:14px;
}
.ma-hint  { color:rgba(212,175,99,.4); font-size:.84rem; }
@keyframes ma-spin { to { transform:rotate(360deg); } }

.ma-empty       { text-align:center; padding:70px 16px; }
.ma-empty-icon  { font-size:3rem; display:block; margin-bottom:14px; }
.ma-empty-title { font-family:'Playfair Display',serif; color:rgba(212,175,99,.45); font-size:1.2rem; margin:0 0 6px; }
.ma-empty-sub   { color:rgba(240,230,208,.22); font-size:.83rem; }

/* ── Responsive ── */
@media (max-width:768px) {
  .ma-stats { grid-template-columns:repeat(2,1fr); }
  .ma-grid  { grid-template-columns:1fr; }
}
@media (max-width:400px) {
  .ma-stats    { grid-template-columns:repeat(2,1fr); gap:8px; }
  .ma-stat-val { font-size:1rem; }
}
`;

export default MyAnimals;
