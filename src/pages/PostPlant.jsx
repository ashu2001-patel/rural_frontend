import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { plantAPI } from "../api/axios";

const CATEGORIES = ["Vegetable", "Fruit", "Flower", "Herb & Medicinal", "Tree & Sapling", "Seed", "Other"];

const PostPlant = () => {
  const [form, setForm] = useState({
    name: "", category: "Vegetable", listingType: "buy",
    price: "", rentPrice: "", rentUnit: "per day",
    description: "", howToPlant: "", howTocare: "",
    sunlight: "Full Sun", wateringFrequency: "Daily",
    season: "All Season", growthTime: "",
    location: "", contact: "", stock: ""
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
      await plantAPI.post("/plant", formData, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/plants");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post plant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        .pp-wrap { min-height: 100vh; background: #0a0f06; display: flex; align-items: flex-start; justify-content: center; padding: 2.5rem 1.5rem; font-family: 'Poppins', sans-serif; position: relative; }
        .pp-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 80%, rgba(45,90,30,0.2) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(139,90,43,0.1) 0%, transparent 55%); pointer-events: none; }
        .pp-card { position: relative; z-index: 1; width: 100%; max-width: 560px; background: rgba(12,18,8,0.95); border: 1px solid rgba(120,180,80,0.14); border-radius: 16px; padding: 2.5rem; backdrop-filter: blur(12px); }
        .pp-top-line { position: absolute; top: 0; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent, #78b450, transparent); border-radius: 2px; }
        .pp-header { text-align: center; margin-bottom: 1.8rem; }
        .pp-icon { font-size: 2rem; display: block; margin-bottom: 4px; }
        .pp-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #78b450; display: block; }
        .pp-sub { font-size: 0.75rem; color: rgba(120,180,80,0.4); letter-spacing: 0.15em; text-transform: uppercase; display: block; margin-top: 3px; }
        .pp-divider { display: flex; align-items: center; gap: 12px; margin: 1.2rem 0 1.8rem; }
        .pp-divider-line { flex: 1; height: 1px; background: rgba(120,180,80,0.1); }
        .pp-section { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(120,180,80,0.3); margin: 1.4rem 0 0.8rem; }
        .pp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pp-field { margin-bottom: 1rem; }
        .pp-label { display: block; font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(120,180,80,0.45); margin-bottom: 5px; }
        .pp-input, .pp-textarea, .pp-select { width: 100%; padding: 10px 13px; background: rgba(255,255,255,0.03); border: 1px solid rgba(120,180,80,0.13); border-radius: 8px; color: #e8f0e0; font-family: 'Poppins', sans-serif; font-size: 0.92rem; box-sizing: border-box; outline: none; transition: border-color 0.2s; }
        .pp-input::placeholder, .pp-textarea::placeholder { color: rgba(232,240,224,0.18); }
        .pp-input:focus, .pp-textarea:focus { border-color: rgba(120,180,80,0.35); }
        .pp-select option { background: #0a0f06; }
        .pp-textarea { height: 80px; resize: vertical; }
        .pp-upload { border: 1px dashed rgba(120,180,80,0.2); border-radius: 8px; padding: 16px; text-align: center; cursor: pointer; display: block; background: rgba(255,255,255,0.02); transition: all 0.2s; }
        .pp-upload:hover { border-color: rgba(120,180,80,0.35); background: rgba(120,180,80,0.03); }
        .pp-upload-icon { font-size: 1.3rem; display: block; margin-bottom: 4px; }
        .pp-upload-text { font-size: 0.8rem; color: rgba(120,180,80,0.4); }
        .pp-upload-sub { font-size: 0.68rem; color: rgba(120,180,80,0.22); margin-top: 2px; }
        .pp-error { background: rgba(180,60,40,0.1); border: 1px solid rgba(180,60,40,0.25); border-radius: 8px; padding: 8px 12px; color: #e8917a; font-size: 0.85rem; text-align: center; margin-bottom: 1rem; }
        .pp-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #4a8a28, #2d5a18); border: 1px solid rgba(120,180,80,0.3); border-radius: 10px; color: #e8f0e0; font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; letter-spacing: 0.08em; cursor: pointer; margin-top: 1rem; transition: all 0.2s; }
        .pp-btn:hover { transform: translateY(-1px); }
        .pp-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        @media (max-width: 480px) { .pp-row { grid-template-columns: 1fr; } .pp-card { padding: 2rem 1.5rem; } }
      `}</style>

      <div className="pp-wrap">
        <div className="pp-bg" />
        <div className="pp-card">
          <div className="pp-top-line" />
          <div className="pp-header">
            <span className="pp-icon">🌱</span>
            <span className="pp-title">List Your Plant</span>
            <span className="pp-sub">Reach buyers & gardeners across India</span>
          </div>
          <div className="pp-divider">
            <div className="pp-divider-line" />
            <span style={{ color: "rgba(120,180,80,0.5)", fontSize: 13 }}>🌿</span>
            <div className="pp-divider-line" />
          </div>

          {error && <div className="pp-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="pp-section">Plant Details</div>
            <div className="pp-row">
              <div className="pp-field">
                <label className="pp-label">Plant Name</label>
                <input className="pp-input" type="text" name="name" placeholder="e.g. Tomato Seedling" value={form.name} onChange={handleChange} required />
              </div>
              <div className="pp-field">
                <label className="pp-label">Category</label>
                <select className="pp-select" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">Description</label>
              <textarea className="pp-textarea" name="description" placeholder="Describe the plant — variety, age, health..." value={form.description} onChange={handleChange} />
            </div>

            <div className="pp-section">Care Guide</div>
            <div className="pp-field">
              <label className="pp-label">How to Plant</label>
              <textarea className="pp-textarea" name="howToPlant" placeholder="Step by step planting instructions..." value={form.howToPlant} onChange={handleChange} />
            </div>
            <div className="pp-field">
              <label className="pp-label">How to Care</label>
              <textarea className="pp-textarea" name="howTocare" placeholder="Watering, fertilizing, pruning tips..." value={form.howTocare} onChange={handleChange} />
            </div>

            <div className="pp-row">
              <div className="pp-field">
                <label className="pp-label">Sunlight</label>
                <select className="pp-select" name="sunlight" value={form.sunlight} onChange={handleChange}>
                  <option>Full Sun</option>
                  <option>Partial Sun</option>
                  <option>Shade</option>
                </select>
              </div>
              <div className="pp-field">
                <label className="pp-label">Watering</label>
                <select className="pp-select" name="wateringFrequency" value={form.wateringFrequency} onChange={handleChange}>
                  <option>Daily</option>
                  <option>Every 2-3 days</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="pp-field">
                <label className="pp-label">Season</label>
                <select className="pp-select" name="season" value={form.season} onChange={handleChange}>
                  <option>All Season</option>
                  <option>Summer</option>
                  <option>Winter</option>
                  <option>Monsoon</option>
                  <option>Spring</option>
                </select>
              </div>
              <div className="pp-field">
                <label className="pp-label">Growth Time</label>
                <input className="pp-input" type="text" name="growthTime" placeholder="e.g. 60-90 days" value={form.growthTime} onChange={handleChange} />
              </div>
            </div>

            <div className="pp-section">Listing & Pricing</div>
            <div className="pp-row">
              <div className="pp-field">
                <label className="pp-label">Listing Type</label>
                <select className="pp-select" name="listingType" value={form.listingType} onChange={handleChange}>
                  <option value="buy">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="both">Buy & Rent</option>
                </select>
              </div>
              <div className="pp-field">
                <label className="pp-label">Stock Available</label>
                <input className="pp-input" type="number" name="stock" placeholder="50" value={form.stock} onChange={handleChange} />
              </div>
            </div>
            <div className="pp-row">
              {(form.listingType === "buy" || form.listingType === "both") && (
                <div className="pp-field">
                  <label className="pp-label">Buy Price (₹)</label>
                  <input className="pp-input" type="number" name="price" placeholder="25" value={form.price} onChange={handleChange} />
                </div>
              )}
              {(form.listingType === "rent" || form.listingType === "both") && (
                <>
                  <div className="pp-field">
                    <label className="pp-label">Rent Price (₹)</label>
                    <input className="pp-input" type="number" name="rentPrice" placeholder="100" value={form.rentPrice} onChange={handleChange} />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Rent Unit</label>
                    <select className="pp-select" name="rentUnit" value={form.rentUnit} onChange={handleChange}>
                      <option value="per day">Per Day</option>
                      <option value="per week">Per Week</option>
                      <option value="per month">Per Month</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="pp-section">Contact & Location</div>
            <div className="pp-row">
              <div className="pp-field">
                <label className="pp-label">Location</label>
                <input className="pp-input" type="text" name="location" placeholder="Village, District" value={form.location} onChange={handleChange} required />
              </div>
              <div className="pp-field">
                <label className="pp-label">Contact Number</label>
                <input className="pp-input" type="text" name="contact" placeholder="+91 98765 43210" value={form.contact} onChange={handleChange} required />
              </div>
            </div>

            <div className="pp-section">Media Upload</div>
            <div className="pp-row">
              <div className="pp-field">
                <label className="pp-label">Images (max 5)</label>
                <label className="pp-upload">
                  <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => setImages([...e.target.files])} />
                  <span className="pp-upload-icon">🖼️</span>
                  <p className="pp-upload-text">{images.length > 0 ? `${images.length} selected` : "Click to upload"}</p>
                  <p className="pp-upload-sub">JPG, PNG, WEBP</p>
                </label>
              </div>
              <div className="pp-field">
                <label className="pp-label">Videos (max 2)</label>
                <label className="pp-upload">
                  <input type="file" accept="video/*" multiple style={{ display: "none" }} onChange={e => setVideos([...e.target.files])} />
                  <span className="pp-upload-icon">🎥</span>
                  <p className="pp-upload-text">{videos.length > 0 ? `${videos.length} selected` : "Click to upload"}</p>
                  <p className="pp-upload-sub">MP4, MOV</p>
                </label>
              </div>
            </div>

            <button className="pp-btn" type="submit" disabled={loading}>
              {loading ? "Posting..." : "🌱 Post Plant Listing"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostPlant;