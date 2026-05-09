import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";

const CATEGORIES = [
  { key: "Cow",     icon: "🐄" },
  { key: "Buffalo", icon: "🐃" },
  { key: "Goat",    icon: "🐐" },
  { key: "Sheep",   icon: "🐑" },
  { key: "Pig",     icon: "🐷" },
  { key: "Poultry", icon: "🐓" },
  { key: "Horse",   icon: "🐴" },
  { key: "Camel",   icon: "🐪" },
  { key: "Other",   icon: "🐾" },
];

const PostAnimal = () => {
  const [form, setForm] = useState({
    name: "", category: "", price: "",
    description: "", location: "", contact: "",
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const pickCategory = (cat) => {
    setForm(f => ({
      ...f,
      category: cat,
      name: f.name || cat,
    }));
  };

  const addImages = (files) =>
    setImages(prev => [...prev, ...Array.from(files)].slice(0, 5));

  const addVideos = (files) =>
    setVideos(prev => [...prev, ...Array.from(files)].slice(0, 2));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { setError("Please select a category"); return; }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(f => fd.append("images", f));
      videos.forEach(f => fd.append("videos", f));
      await animalAPI.post("/animal", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/my-animals");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post animal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      {loading && (
        <div className="pa-overlay">
          <div className="pa-spinner" />
          <p className="pa-overlay-text">Uploading your listing…</p>
        </div>
      )}

      <div className="pa-page">
        <div className="pa-shell">

          {/* ── Header ── */}
          <div className="pa-header">
            <button className="pa-back" onClick={() => navigate(-1)}>← Back</button>
            <h1 className="pa-title">Post Animal</h1>
            <p className="pa-sub">List your livestock for thousands of rural buyers</p>
          </div>

          {error && <div className="pa-error">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* ── Category ── */}
            <div className="pa-section">
              <label className="pa-label">Select Category *</label>
              <div className="pa-cat-grid">
                {CATEGORIES.map(({ key, icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`pa-cat-btn ${form.category === key ? "pa-cat-btn--active" : ""}`}
                    onClick={() => pickCategory(key)}
                  >
                    <span className="pa-cat-icon">{icon}</span>
                    <span className="pa-cat-label">{key}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Basic details ── */}
            <div className="pa-section">
              <label className="pa-label">Animal Name *</label>
              <input
                className="pa-input"
                name="name"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Jersey Cow, Male Buffalo…"
                required
              />
            </div>

            <div className="pa-row">
              <div className="pa-section pa-section--flex">
                <label className="pa-label">Price (₹) *</label>
                <input
                  className="pa-input"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={e => set("price", e.target.value)}
                  placeholder="25000"
                  required
                />
              </div>
              <div className="pa-section pa-section--flex">
                <label className="pa-label">Location *</label>
                <input
                  className="pa-input"
                  name="location"
                  value={form.location}
                  onChange={e => set("location", e.target.value)}
                  placeholder="Village / City"
                  required
                />
              </div>
            </div>

            <div className="pa-section">
              <label className="pa-label">Contact Number *</label>
              <input
                className="pa-input"
                type="tel"
                name="contact"
                value={form.contact}
                onChange={e => set("contact", e.target.value)}
                placeholder="10-digit mobile number"
                required
              />
            </div>

            <div className="pa-section">
              <label className="pa-label">
                Description
                <span className="pa-char">{form.description.length}/500</span>
              </label>
              <textarea
                className="pa-input pa-textarea"
                name="description"
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Age, breed, health condition, reason for selling…"
                maxLength={500}
              />
            </div>

            {/* ── Images ── */}
            <div className="pa-section">
              <label className="pa-label">Photos ({images.length}/5)</label>
              <label className="pa-upload" htmlFor="img-input">
                <span className="pa-upload-icon">📸</span>
                <span className="pa-upload-text">Tap to add photos</span>
                <span className="pa-upload-hint">Up to 5 images · JPG, PNG</span>
              </label>
              <input
                id="img-input" type="file" accept="image/*" multiple
                style={{ display: "none" }}
                onChange={e => addImages(e.target.files)}
              />
              {images.length > 0 && (
                <div className="pa-preview-row">
                  {images.map((f, i) => (
                    <div key={i} className="pa-thumb">
                      <img src={URL.createObjectURL(f)} alt="" className="pa-thumb-img" />
                      <button
                        type="button"
                        className="pa-thumb-remove"
                        onClick={() => setImages(p => p.filter((_, j) => j !== i))}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Videos ── */}
            <div className="pa-section">
              <label className="pa-label">Videos ({videos.length}/2)</label>
              <label className="pa-upload" htmlFor="vid-input">
                <span className="pa-upload-icon">🎥</span>
                <span className="pa-upload-text">Tap to add videos</span>
                <span className="pa-upload-hint">Up to 2 videos · MP4, MOV</span>
              </label>
              <input
                id="vid-input" type="file" accept="video/*" multiple
                style={{ display: "none" }}
                onChange={e => addVideos(e.target.files)}
              />
              {videos.length > 0 && (
                <div className="pa-preview-row">
                  {videos.map((f, i) => (
                    <div key={i} className="pa-thumb">
                      <video src={URL.createObjectURL(f)} className="pa-thumb-img" />
                      <button
                        type="button"
                        className="pa-thumb-remove"
                        onClick={() => setVideos(p => p.filter((_, j) => j !== i))}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="pa-submit" disabled={loading}>
              {loading ? "Posting…" : "🐄 Post Animal Listing"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');

/* ── Base ── */
.pa-page  { min-height:100vh; background:#0f0a05; padding:16px 16px 80px; font-family:'Poppins',sans-serif; }
.pa-shell { max-width:600px; margin:0 auto; }

/* ── Header ── */
.pa-back  { background:none; border:none; color:rgba(212,175,99,.55); cursor:pointer; font-size:.85rem; padding:0 0 14px; font-family:'Poppins',sans-serif; }
.pa-title { font-family:'Playfair Display',serif; color:#f0e6d0; font-size:1.7rem; margin:0 0 4px; }
.pa-sub   { color:rgba(240,230,208,.35); font-size:.8rem; margin:0 0 24px; line-height:1.6; }
.pa-header { margin-bottom:8px; }

/* ── Error ── */
.pa-error {
  padding:12px 16px; background:rgba(220,53,69,.12);
  border:1px solid rgba(220,53,69,.3); border-radius:10px;
  color:#fc8181; font-size:.84rem; margin-bottom:18px;
}

/* ── Form elements ── */
.pa-section     { margin-bottom:18px; }
.pa-section--flex { flex:1; }
.pa-row         { display:flex; gap:12px; }
.pa-label       { display:flex; justify-content:space-between; font-size:.77rem; color:rgba(212,175,99,.7); margin-bottom:8px; letter-spacing:.04em; }
.pa-char        { color:rgba(212,175,99,.35); }

.pa-input {
  width:100%; padding:12px 14px; background:rgba(255,255,255,.04);
  border:1px solid rgba(212,175,99,.2); border-radius:10px;
  color:#f0e6d0; font-family:'Poppins',sans-serif; font-size:.9rem;
  outline:none; box-sizing:border-box; transition:border-color .2s;
}
.pa-input:focus   { border-color:rgba(212,175,99,.45); }
.pa-input::placeholder { color:rgba(240,230,208,.22); }
.pa-textarea      { height:100px; resize:vertical; }

/* ── Category grid ── */
.pa-cat-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.pa-cat-btn   {
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:5px; padding:12px 6px; background:rgba(255,255,255,.03);
  border:1px solid rgba(212,175,99,.14); border-radius:10px;
  color:rgba(240,230,208,.5); cursor:pointer; transition:all .18s;
}
.pa-cat-btn:hover    { border-color:rgba(212,175,99,.3); color:rgba(212,175,99,.8); }
.pa-cat-btn--active  { background:rgba(212,175,99,.12); border-color:rgba(212,175,99,.5); color:#d4af63; }
.pa-cat-icon         { font-size:1.5rem; line-height:1; }
.pa-cat-label        { font-size:.7rem; font-weight:500; }

/* ── Upload ── */
.pa-upload {
  display:flex; flex-direction:column; align-items:center;
  gap:5px; padding:20px 16px; background:rgba(255,255,255,.02);
  border:1.5px dashed rgba(212,175,99,.22); border-radius:10px;
  cursor:pointer; margin-bottom:10px; transition:border-color .2s;
}
.pa-upload:hover      { border-color:rgba(212,175,99,.4); }
.pa-upload-icon       { font-size:1.8rem; }
.pa-upload-text       { font-size:.84rem; color:rgba(212,175,99,.7); }
.pa-upload-hint       { font-size:.7rem; color:rgba(212,175,99,.35); }

.pa-preview-row { display:flex; flex-wrap:wrap; gap:8px; }
.pa-thumb       { position:relative; }
.pa-thumb-img   { width:78px; height:78px; object-fit:cover; border-radius:8px; display:block; }
.pa-thumb-remove {
  position:absolute; top:-7px; right:-7px; width:22px; height:22px;
  border-radius:50%; background:#e53e3e; border:none; color:#fff;
  font-size:15px; cursor:pointer; line-height:22px; text-align:center; padding:0;
}

/* ── Submit ── */
.pa-submit {
  width:100%; padding:15px; background:linear-gradient(135deg,#d4af63,#8b5a2b);
  color:#1a0f05; border:none; border-radius:12px; font-weight:700;
  font-size:1rem; cursor:pointer; font-family:'Poppins',sans-serif;
  transition:opacity .2s; margin-top:8px;
}
.pa-submit:disabled { opacity:.6; cursor:not-allowed; }

/* ── Loading overlay ── */
.pa-overlay {
  position:fixed; inset:0; background:rgba(15,10,5,.85);
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; z-index:9999;
}
.pa-spinner {
  width:40px; height:40px; border:3px solid rgba(212,175,99,.2);
  border-top:3px solid #d4af63; border-radius:50%;
  animation:pa-spin .8s linear infinite;
}
.pa-overlay-text { color:#f0e6d0; margin-top:14px; font-size:.9rem; font-family:'Poppins',sans-serif; }
@keyframes pa-spin { to { transform:rotate(360deg); } }

/* ── Responsive ── */
@media (max-width:480px) {
  .pa-cat-grid { grid-template-columns:repeat(3,1fr); gap:6px; }
  .pa-row      { flex-direction:column; gap:0; }
  .pa-cat-icon { font-size:1.3rem; }
}
`;

export default PostAnimal;
