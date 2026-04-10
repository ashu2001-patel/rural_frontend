import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toolAPI } from "../api/axios";

const CATEGORIES = ["Tractor", "Plough", "Water Pump", "Harvester", "Sprayer", "Other"];

const PostTool = () => {
  const [form, setForm] = useState({
    name: "", category: "Tractor", description: "",
    condition: "Good", listingType: "both",
    buyPrice: "", rentPrice: "", rentUnit: "per day",
    location: "", contact: ""
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      images.forEach(img => formData.append("images", img));
      videos.forEach(vid => formData.append("videos", vid));
      await toolAPI.post("/tool", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/tools");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post tool");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.bg} />
      <div style={s.card}>
        <div style={s.topLine} />
        <div style={s.header}>
          <span style={s.icon}>🔧</span>
          <span style={s.title}>List Your Tool</span>
          <span style={s.sub}>Reach buyers & renters across rural India</span>
        </div>

        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={{ color: "rgba(74,107,58,0.7)", fontSize: 13 }}>🌿</span>
          <div style={s.dividerLine} />
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.sectionLabel}>Tool Details</div>

          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Tool Name</label>
              <input style={s.input} type="text" name="name" placeholder="e.g. Mahindra Tractor" value={form.name} onChange={handleChange} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Category</label>
              <select style={s.input} name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Description</label>
            <textarea style={s.textarea} name="description" placeholder="Describe condition, age, brand, features..." value={form.description} onChange={handleChange} />
          </div>

          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Condition</label>
              <select style={s.input} name="condition" value={form.condition} onChange={handleChange}>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Listing Type</label>
              <select style={s.input} name="listingType" value={form.listingType} onChange={handleChange}>
                <option value="buy">For Sale only</option>
                <option value="rent">For Rent only</option>
                <option value="both">Both Buy & Rent</option>
              </select>
            </div>
          </div>

          <div style={s.sectionLabel}>Pricing</div>
          <div style={s.row}>
            {(form.listingType === "buy" || form.listingType === "both") && (
              <div style={s.field}>
                <label style={s.label}>Buy Price (₹)</label>
                <input style={s.input} type="number" name="buyPrice" placeholder="50,000" value={form.buyPrice} onChange={handleChange} />
              </div>
            )}
            {(form.listingType === "rent" || form.listingType === "both") && (
              <>
                <div style={s.field}>
                  <label style={s.label}>Rent Price (₹)</label>
                  <input style={s.input} type="number" name="rentPrice" placeholder="500" value={form.rentPrice} onChange={handleChange} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Rent Unit</label>
                  <select style={s.input} name="rentUnit" value={form.rentUnit} onChange={handleChange}>
                    <option value="per day">Per Day</option>
                    <option value="per week">Per Week</option>
                    <option value="per month">Per Month</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div style={s.sectionLabel}>Contact & Location</div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Location</label>
              <input style={s.input} type="text" name="location" placeholder="Village, District" value={form.location} onChange={handleChange} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Contact Number</label>
              <input style={s.input} type="text" name="contact" placeholder="+91 98765 43210" value={form.contact} onChange={handleChange} required />
            </div>
          </div>

          <div style={s.sectionLabel}>Media Upload</div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Images (max 5)</label>
              <label style={s.uploadZone}>
                <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => setImages([...e.target.files])} />
                <span style={s.uploadIcon}>🖼️</span>
                <p style={s.uploadText}>{images.length > 0 ? `${images.length} image(s) selected` : "Click to upload"}</p>
                <p style={s.uploadSub}>JPG, PNG, WEBP</p>
              </label>
            </div>
            <div style={s.field}>
              <label style={s.label}>Videos (max 2)</label>
              <label style={s.uploadZone}>
                <input type="file" accept="video/*" multiple style={{ display: "none" }} onChange={e => setVideos([...e.target.files])} />
                <span style={s.uploadIcon}>🎥</span>
                <p style={s.uploadText}>{videos.length > 0 ? `${videos.length} video(s) selected` : "Click to upload"}</p>
                <p style={s.uploadSub}>MP4, MOV</p>
              </label>
            </div>
          </div>

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Posting..." : "🔧 Post Tool Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

const s = {
  wrap: { minHeight: "100vh", background: "#1a120b", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2.5rem 2rem", position: "relative", overflow: "hidden", fontFamily: "'Crimson Pro', Georgia, serif" },
  bg: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 10% 90%, rgba(139,90,43,0.2) 0%, transparent 55%), radial-gradient(ellipse at 90% 10%, rgba(74,107,58,0.15) 0%, transparent 55%)" },
  card: { position: "relative", zIndex: 10, width: "100%", maxWidth: "560px", background: "rgba(28,18,10,0.9)", border: "1px solid rgba(212,175,99,0.16)", borderRadius: "4px", padding: "2.5rem", backdropFilter: "blur(12px)" },
  topLine: { position: "absolute", top: 0, left: "10%", right: "10%", height: "2px", background: "linear-gradient(90deg, transparent, #d4af63, transparent)" },
  header: { textAlign: "center", marginBottom: "1.8rem" },
  icon: { fontSize: "2rem", display: "block", marginBottom: "4px" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#d4af63", display: "block", letterSpacing: "0.03em" },
  sub: { fontSize: "0.75rem", color: "rgba(212,175,99,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", display: "block", marginTop: "3px" },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "1.2rem 0 1.8rem" },
  dividerLine: { flex: 1, height: "1px", background: "rgba(212,175,99,0.12)" },
  sectionLabel: { fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,99,0.35)", margin: "1.4rem 0 0.8rem" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(212,175,99,0.5)", marginBottom: "5px" },
  input: { width: "100%", padding: "10px 13px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,99,0.13)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "0.95rem", boxSizing: "border-box", outline: "none" },
  textarea: { width: "100%", padding: "10px 13px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,99,0.13)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "0.95rem", boxSizing: "border-box", outline: "none", height: "80px", resize: "vertical" },
  uploadZone: { border: "1px dashed rgba(212,175,99,0.2)", borderRadius: "3px", padding: "18px", textAlign: "center", cursor: "pointer", display: "block", background: "rgba(255,255,255,0.02)" },
  uploadIcon: { fontSize: "1.4rem", display: "block", marginBottom: "4px" },
  uploadText: { fontSize: "0.82rem", color: "rgba(212,175,99,0.45)", margin: 0 },
  uploadSub: { fontSize: "0.7rem", color: "rgba(212,175,99,0.25)", marginTop: "2px" },
  error: { background: "rgba(180,60,40,0.1)", border: "1px solid rgba(180,60,40,0.25)", borderRadius: "3px", padding: "8px 12px", color: "#e8917a", fontSize: "0.88rem", textAlign: "center", marginBottom: "1rem" },
  btn: { width: "100%", padding: "13px", background: "linear-gradient(135deg, #8b5a2b, #6b4420)", border: "1px solid rgba(212,175,99,0.28)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", marginTop: "1.2rem" }
};

export default PostTool;