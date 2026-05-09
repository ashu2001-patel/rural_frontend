import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MediaViewer from "../components/MediaViewer";
import TranslateBox from "../components/TranslateBox";
import RevealContact from "../components/revealcontact";

const AnimalDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [animal, setAnimal]               = useState(null);
  const [loading, setLoading]             = useState(true);
  const [showForm, setShowForm]           = useState(false);
  const [requestSent, setRequestSent]     = useState(false);
  const [requestLoading, setReqLoading]   = useState(false);
  const [form, setForm] = useState({ buyerName: "", buyerContact: "", message: "" });

  useEffect(() => {
    animalAPI.get(`/animal/${id}`)
      .then(res => setAnimal(res.data.animal || res.data))
      .catch(() => setAnimal(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setReqLoading(true);
    try {
      await animalAPI.post(`/request/animal/${id}/request`, form);
      setRequestSent(true);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setReqLoading(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="ad-state">
      <div className="ad-spinner" />
      <p className="ad-state-text">Loading animal details…</p>
    </div>
  );

  /* ── Not found ── */
  if (!animal) return (
    <div className="ad-state">
      <span style={{ fontSize: "2.5rem" }}>🐄</span>
      <h3 className="ad-state-title">Animal not found</h3>
      <button className="ad-btn ad-btn--gold" onClick={() => navigate(-1)}>← Go Back</button>
    </div>
  );

  const isOwner   = user && (animal.employerId === user.id || animal.employerId === user._id);
  const isSold    = animal.status === "sold";
  const createdAt = animal.createdAt
    ? new Date(animal.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "N/A";

  return (
    <>
      <style>{STYLES}</style>
      <div className="ad-page">

        {/* ── Back ── */}
        <button className="ad-back" onClick={() => navigate(-1)}>← Back to listings</button>

        <div className="ad-grid">

          {/* ── LEFT — Media ── */}
          <div className="ad-media-col">
            <MediaViewer images={animal.images || []} videos={animal.videos || []} />
          </div>

          {/* ── RIGHT — Info ── */}
          <div className="ad-info-col">
            <div className="ad-card">

              {/* Title row */}
              <div className="ad-card-header">
                <div>
                  {animal.category && <span className="ad-category-tag">{animal.category}</span>}
                  <h1 className="ad-name">{animal.name}</h1>
                </div>
                <span className={`ad-status-badge ${isSold ? "ad-status-badge--sold" : "ad-status-badge--live"}`}>
                  {isSold ? "❌ Sold" : "🟢 Available"}
                </span>
              </div>

              {/* Price */}
              <p className="ad-price">₹{Number(animal.price || 0).toLocaleString()}</p>

              {/* Info grid */}
              <div className="ad-info-grid">
                <div className="ad-info-item">
                  <span className="ad-info-label">📍 Location</span>
                  <strong className="ad-info-val">{animal.location || "Not specified"}</strong>
                </div>
                <div className="ad-info-item">
                  <span className="ad-info-label">📅 Listed On</span>
                  <strong className="ad-info-val">{createdAt}</strong>
                </div>
                <div className="ad-info-item">
                  <span className="ad-info-label">🧾 Category</span>
                  <strong className="ad-info-val">{animal.category || "Animal"}</strong>
                </div>
                <div className="ad-info-item">
                  <span className="ad-info-label">📞 Contact</span>
                  <RevealContact contact={animal.contact} animalId={animal._id} />
                </div>
              </div>

              {/* Description */}
              {animal.description && (
                <div className="ad-desc-wrap">
                  <p className="ad-desc-label">About this animal</p>
                  <TranslateBox text={animal.description} />
                </div>
              )}

              {/* Desktop CTA — hidden on mobile (shown in sticky bar instead) */}
              <div className="ad-desktop-cta">
                {animal.contact && (
                  <div className="ad-cta-row">
                    <a href={`tel:${animal.contact}`} className="ad-cta-btn ad-cta-btn--call">
                      📞 Call Seller
                    </a>
                    <a
                      href={`https://wa.me/${animal.contact.replace(/\D/g, "")}`}
                      target="_blank" rel="noreferrer"
                      className="ad-cta-btn ad-cta-btn--whatsapp"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                )}

                {!isOwner && !isSold && (
                  <div className="ad-request-wrap">
                    {requestSent ? (
                      <div className="ad-success-msg">✅ Request sent! The seller will contact you.</div>
                    ) : !showForm ? (
                      <button className="ad-cta-btn ad-cta-btn--request" onClick={() => setShowForm(true)}>
                        🤝 Request to Buy
                      </button>
                    ) : (
                      <RequestForm
                        form={form} setForm={setForm}
                        onSubmit={handleRequest} loading={requestLoading}
                        onCancel={() => setShowForm(false)}
                      />
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── Mobile sticky bottom bar ── */}
        <div className="ad-sticky-bar">
          {animal.contact ? (
            <>
              <a href={`tel:${animal.contact}`} className="ad-sticky-btn ad-sticky-btn--call">📞 Call</a>
              <a
                href={`https://wa.me/${animal.contact.replace(/\D/g, "")}`}
                target="_blank" rel="noreferrer"
                className="ad-sticky-btn ad-sticky-btn--whatsapp"
              >
                💬 WhatsApp
              </a>
            </>
          ) : null}
          {!isOwner && !isSold && !requestSent && (
            <button
              className="ad-sticky-btn ad-sticky-btn--request"
              onClick={() => setShowForm(f => !f)}
            >
              {showForm ? "✕ Cancel" : "🤝 Request"}
            </button>
          )}
          {!isOwner && !isSold && requestSent && (
            <div className="ad-sticky-sent">✅ Request Sent</div>
          )}
        </div>

        {/* ── Mobile slide-up request form ── */}
        {showForm && !requestSent && (
          <div className="ad-mobile-form-wrap">
            <RequestForm
              form={form} setForm={setForm}
              onSubmit={handleRequest} loading={requestLoading}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

      </div>
    </>
  );
};

const RequestForm = ({ form, setForm, onSubmit, loading, onCancel }) => (
  <form onSubmit={onSubmit} className="ad-req-form">
    <p className="ad-req-title">Send a buying request</p>
    <input
      className="ad-req-input" required placeholder="Your Name"
      value={form.buyerName}
      onChange={e => setForm(f => ({ ...f, buyerName: e.target.value }))}
    />
    <input
      className="ad-req-input" required placeholder="Your Contact Number"
      value={form.buyerContact}
      onChange={e => setForm(f => ({ ...f, buyerContact: e.target.value }))}
    />
    <textarea
      className="ad-req-input ad-req-textarea" placeholder="Message (optional)"
      value={form.message}
      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
    />
    <div className="ad-req-btns">
      <button type="submit" className="ad-req-send" disabled={loading}>
        {loading ? "Sending…" : "Send Request"}
      </button>
      <button type="button" className="ad-req-cancel" onClick={onCancel}>Cancel</button>
    </div>
  </form>
);

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');

/* ── Base ── */
.ad-page { min-height:100vh; background:#0f0a05; font-family:'Poppins',sans-serif; padding:16px; padding-bottom:90px; }

/* ── Back ── */
.ad-back { background:none; border:none; color:rgba(212,175,99,.55); cursor:pointer; font-size:.84rem; padding:0 0 14px; font-family:'Poppins',sans-serif; display:block; }

/* ── Two-col grid ── */
.ad-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:1100px; margin:0 auto; }

/* ── Media col ── */
.ad-media-col { position:sticky; top:72px; align-self:start; }

/* ── Info card ── */
.ad-card {
  background:rgba(22,14,8,.92); border:1px solid rgba(212,175,99,.12);
  border-radius:16px; padding:20px;
}

/* ── Header ── */
.ad-card-header { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px; }
.ad-category-tag { font-size:.62rem; padding:2px 9px; background:rgba(212,175,99,.1); border:1px solid rgba(212,175,99,.22); border-radius:4px; color:rgba(212,175,99,.7); display:inline-block; margin-bottom:4px; }
.ad-name  { font-family:'Playfair Display',serif; font-size:1.5rem; color:#f0e6d0; margin:0; line-height:1.2; }
.ad-status-badge { font-size:.62rem; padding:4px 10px; border-radius:20px; white-space:nowrap; flex-shrink:0; font-weight:600; letter-spacing:.05em; }
.ad-status-badge--live { background:rgba(74,138,58,.2); border:1px solid rgba(74,138,58,.3); color:#7ecb63; }
.ad-status-badge--sold { background:rgba(180,60,60,.18); border:1px solid rgba(180,60,60,.3); color:#f08080; }

/* ── Price ── */
.ad-price { font-family:'Playfair Display',serif; font-size:1.8rem; color:#d4af63; font-weight:700; margin:8px 0 16px; }

/* ── Info grid ── */
.ad-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px; }
.ad-info-item { background:rgba(255,255,255,.03); border:1px solid rgba(212,175,99,.08); border-radius:10px; padding:12px; }
.ad-info-label { display:block; font-size:.72rem; color:rgba(212,175,99,.45); margin-bottom:5px; }
.ad-info-val   { font-size:.88rem; color:#f0e6d0; display:block; word-break:break-word; }

/* ── Description ── */
.ad-desc-wrap  { margin-bottom:18px; }
.ad-desc-label { font-size:.75rem; color:rgba(212,175,99,.45); margin-bottom:8px; letter-spacing:.05em; }

/* ── Desktop CTA ── */
.ad-cta-row     { display:flex; gap:10px; margin-bottom:10px; }
.ad-cta-btn     { flex:1; padding:13px 10px; border-radius:10px; border:none; cursor:pointer; font-family:'Poppins',sans-serif; font-size:.85rem; font-weight:600; text-align:center; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:6px; transition:opacity .18s; }
.ad-cta-btn--call      { background:rgba(74,138,58,.2); border:1px solid rgba(74,138,58,.35); color:#7ecb63; }
.ad-cta-btn--whatsapp  { background:rgba(37,211,102,.12); border:1px solid rgba(37,211,102,.25); color:#4fcf7c; }
.ad-cta-btn--request   { background:linear-gradient(135deg,#d4af63,#8b5a2b); color:#1a0f05; width:100%; }

/* ── Request form ── */
.ad-request-wrap { margin-top:10px; }
.ad-req-form     { background:rgba(15,10,5,.9); border:1px solid rgba(212,175,99,.15); border-radius:12px; padding:16px; }
.ad-req-title    { font-size:.8rem; color:rgba(212,175,99,.6); margin:0 0 12px; letter-spacing:.05em; }
.ad-req-input    { width:100%; padding:10px 12px; background:rgba(255,255,255,.04); border:1px solid rgba(212,175,99,.18); border-radius:8px; color:#f0e6d0; font-family:'Poppins',sans-serif; font-size:.85rem; outline:none; box-sizing:border-box; margin-bottom:8px; }
.ad-req-textarea { height:72px; resize:none; }
.ad-req-input::placeholder { color:rgba(240,230,208,.22); }
.ad-req-btns  { display:flex; gap:8px; margin-top:4px; }
.ad-req-send  { flex:1; padding:10px; background:linear-gradient(135deg,#d4af63,#8b5a2b); color:#1a0f05; border:none; border-radius:8px; font-weight:600; cursor:pointer; font-family:'Poppins',sans-serif; font-size:.85rem; }
.ad-req-send:disabled { opacity:.6; }
.ad-req-cancel { padding:10px 16px; background:transparent; border:1px solid rgba(255,255,255,.1); border-radius:8px; color:rgba(240,230,208,.5); cursor:pointer; font-family:'Poppins',sans-serif; font-size:.85rem; }

/* ── Success ── */
.ad-success-msg { padding:12px; background:rgba(74,107,58,.15); border:1px solid rgba(74,107,58,.25); border-radius:10px; text-align:center; font-size:.84rem; color:#a0d080; }

/* ── Mobile sticky bar ── */
.ad-sticky-bar {
  display:none; position:fixed; bottom:0; left:0; right:0;
  background:rgba(15,10,5,.96); border-top:1px solid rgba(212,175,99,.12);
  padding:10px 14px; gap:8px; z-index:100; backdrop-filter:blur(12px);
}
.ad-sticky-btn { flex:1; padding:12px 8px; border-radius:10px; border:none; cursor:pointer; font-family:'Poppins',sans-serif; font-size:.82rem; font-weight:600; text-align:center; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:5px; }
.ad-sticky-btn--call      { background:rgba(74,138,58,.2); border:1px solid rgba(74,138,58,.3); color:#7ecb63; }
.ad-sticky-btn--whatsapp  { background:rgba(37,211,102,.12); border:1px solid rgba(37,211,102,.25); color:#4fcf7c; }
.ad-sticky-btn--request   { background:linear-gradient(135deg,#d4af63,#8b5a2b); color:#1a0f05; }
.ad-sticky-sent { flex:1; text-align:center; color:#a0d080; font-size:.82rem; padding:12px; }

/* ── Mobile form overlay ── */
.ad-mobile-form-wrap {
  position:fixed; bottom:66px; left:0; right:0;
  padding:12px 14px; background:rgba(15,10,5,.98);
  border-top:1px solid rgba(212,175,99,.12); z-index:99;
}

/* ── State / loading ── */
.ad-state { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:12px; font-family:'Poppins',sans-serif; }
.ad-spinner { width:36px; height:36px; border:2px solid rgba(212,175,99,.15); border-top:2px solid #d4af63; border-radius:50%; animation:ad-spin .8s linear infinite; }
.ad-state-text  { color:rgba(212,175,99,.4); font-size:.85rem; }
.ad-state-title { font-family:'Playfair Display',serif; color:rgba(212,175,99,.45); font-size:1.2rem; }
.ad-btn         { padding:10px 20px; border-radius:8px; border:none; cursor:pointer; font-family:'Poppins',sans-serif; }
.ad-btn--gold   { background:linear-gradient(135deg,#d4af63,#8b5a2b); color:#1a0f05; font-weight:600; }
@keyframes ad-spin { to { transform:rotate(360deg); } }

/* ── Tablet ── */
@media (max-width:900px) {
  .ad-grid { grid-template-columns:1fr; }
  .ad-media-col { position:static; }
}

/* ── Mobile ── */
@media (max-width:640px) {
  .ad-page        { padding:12px; padding-bottom:80px; }
  .ad-price       { font-size:1.4rem; }
  .ad-name        { font-size:1.3rem; }
  .ad-info-grid   { grid-template-columns:1fr 1fr; }
  .ad-sticky-bar  { display:flex; }
  .ad-desktop-cta { display:none; }
}
@media (max-width:380px) {
  .ad-info-grid { grid-template-columns:1fr; }
}
`;

export default AnimalDetail;
