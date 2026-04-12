import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { plantAPI } from "../api/axios";
import MediaViewer from "../components/MediaViewer";

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await plantAPI.get(`/plant/${id}`);
        setPlant(res.data.plant);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0f06", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "2px solid rgba(120,180,80,0.15)", borderTopColor: "#78b450", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (!plant) return (
    <div style={{ minHeight: "100vh", background: "#0a0f06", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(120,180,80,0.4)", fontFamily: "Playfair Display, serif", fontSize: "1.2rem" }}>
      Plant not found
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .pd-page { min-height: 100vh; background: #0a0f06; font-family: 'Poppins', sans-serif; color: #e8f0e0; padding: 1.5rem; }
        .pd-back { padding: 7px 14px; background: transparent; border: 1px solid rgba(120,180,80,0.18); border-radius: 7px; color: rgba(120,180,80,0.55); font-family: 'Poppins', sans-serif; font-size: 0.82rem; cursor: pointer; margin-bottom: 1.5rem; transition: all 0.2s; }
        .pd-back:hover { border-color: rgba(120,180,80,0.35); color: #78b450; }
        .pd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 1100px; margin: 0 auto; }
        .pd-left { position: sticky; top: 80px; height: fit-content; }
        .pd-card { background: rgba(12,18,8,0.95); border: 1px solid rgba(120,180,80,0.12); border-radius: 14px; padding: 1.8rem; position: relative; }
        .pd-top-line { position: absolute; top: 0; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent, #78b450, transparent); border-radius: 2px; }
        .pd-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .pd-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #e8f0e0; margin: 0; }
        .pd-cat-badge { font-size: 0.7rem; padding: 3px 10px; background: rgba(45,90,30,0.2); border: 1px solid rgba(120,180,80,0.25); border-radius: 4px; color: rgba(120,180,80,0.8); letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; margin-left: 8px; margin-top: 4px; }
        .pd-listing-badge { font-size: 0.7rem; padding: 3px 10px; border: 1px solid; border-radius: 4px; letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; }
        .pd-price-box { background: rgba(45,90,30,0.08); border: 1px solid rgba(120,180,80,0.1); border-radius: 8px; padding: 12px 16px; margin-bottom: 1rem; }
        .pd-price-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid rgba(120,180,80,0.06); }
        .pd-price-label { font-size: 0.85rem; color: rgba(232,240,224,0.45); }
        .pd-price-val { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #78b450; font-weight: 700; }
        .pd-info-box { margin-bottom: 1rem; }
        .pd-info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(120,180,80,0.06); }
        .pd-info-label { font-size: 0.82rem; color: rgba(232,240,224,0.38); }
        .pd-info-val { font-size: 0.88rem; color: #e8f0e0; }
        .pd-care-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1rem; }
        .pd-care-item { background: rgba(45,90,30,0.1); border: 1px solid rgba(120,180,80,0.12); border-radius: 8px; padding: 10px; text-align: center; }
        .pd-care-icon { font-size: 1.2rem; display: block; margin-bottom: 4px; }
        .pd-care-label { font-size: 0.62rem; color: rgba(120,180,80,0.45); letter-spacing: 0.1em; text-transform: uppercase; display: block; }
        .pd-care-val { font-size: 0.82rem; color: rgba(232,240,224,0.7); display: block; margin-top: 2px; }
        .pd-tabs { display: flex; gap: 0; border: 1px solid rgba(120,180,80,0.12); border-radius: 8px; overflow: hidden; margin-bottom: 1rem; }
        .pd-tab { flex: 1; padding: 9px; background: transparent; border: none; color: rgba(232,240,224,0.4); font-family: 'Poppins', sans-serif; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; }
        .pd-tab.active { background: rgba(120,180,80,0.12); color: #78b450; }
        .pd-tab-content { background: rgba(45,90,30,0.06); border: 1px solid rgba(120,180,80,0.1); border-radius: 8px; padding: 14px 16px; margin-bottom: 1rem; min-height: 80px; }
        .pd-tab-text { font-size: 0.88rem; color: rgba(232,240,224,0.6); line-height: 1.8; }
        .pd-cta-row { display: flex; gap: 10px; margin-top: 1.2rem; }
        .pd-call-btn { flex: 1; padding: 12px; background: linear-gradient(135deg, #4a8a28, #2d5a18); border: 1px solid rgba(120,180,80,0.3); border-radius: 10px; color: #e8f0e0; font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; text-align: center; text-decoration: none; cursor: pointer; transition: all 0.2s; }
        .pd-call-btn:hover { transform: translateY(-1px); }
        .pd-wa-btn { flex: 1; padding: 12px; background: linear-gradient(135deg, #1a5c1a, #0f3d0f); border: 1px solid rgba(74,150,74,0.3); border-radius: 10px; color: #a8e0a8; font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; text-align: center; text-decoration: none; }
        @media (max-width: 768px) { .pd-grid { grid-template-columns: 1fr; } .pd-left { position: static; } .pd-care-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <div className="pd-page">
        <button className="pd-back" onClick={() => navigate("/plants")}>← Back to Plants</button>

        <div className="pd-grid">
          {/* Left — Media */}
          <div className="pd-left">
            <MediaViewer images={plant.images || []} videos={plant.videos || []} />
          </div>

          {/* Right — Details */}
          <div>
            <div className="pd-card">
              <div className="pd-top-line" />

              <div className="pd-title-row">
                <h1 className="pd-title">{plant.name}</h1>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                  <span className="pd-cat-badge">{plant.category}</span>
                  <span className="pd-listing-badge" style={{ color: plant.listingType === "buy" ? "#d4af63" : "#78b450", borderColor: plant.listingType === "buy" ? "rgba(212,175,99,0.3)" : "rgba(120,180,80,0.3)" }}>
                    {plant.listingType === "buy" ? "🛒 For Sale" : plant.listingType === "rent" ? "🔑 For Rent" : "🛒 Buy & Rent"}
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="pd-price-box">
                {plant.price && (
                  <div className="pd-price-row">
                    <span className="pd-price-label">🛒 Buy Price</span>
                    <span className="pd-price-val">₹{Number(plant.price).toLocaleString()}</span>
                  </div>
                )}
                {plant.rentPrice && (
                  <div className="pd-price-row">
                    <span className="pd-price-label">🔑 Rent Price</span>
                    <span className="pd-price-val" style={{ color: "#78b450" }}>₹{plant.rentPrice} / {plant.rentUnit}</span>
                  </div>
                )}
              </div>

              {/* Care Grid */}
              <div className="pd-care-grid">
                <div className="pd-care-item">
                  <span className="pd-care-icon">☀️</span>
                  <span className="pd-care-label">Sunlight</span>
                  <span className="pd-care-val">{plant.sunlight || "N/A"}</span>
                </div>
                <div className="pd-care-item">
                  <span className="pd-care-icon">💧</span>
                  <span className="pd-care-label">Watering</span>
                  <span className="pd-care-val">{plant.wateringFrequency || "N/A"}</span>
                </div>
                <div className="pd-care-item">
                  <span className="pd-care-icon">🌡️</span>
                  <span className="pd-care-label">Season</span>
                  <span className="pd-care-val">{plant.season || "N/A"}</span>
                </div>
                <div className="pd-care-item">
                  <span className="pd-care-icon">⏱️</span>
                  <span className="pd-care-label">Growth Time</span>
                  <span className="pd-care-val">{plant.growthTime || "N/A"}</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="pd-tabs">
                {["about", "howToPlant", "howTocare"].map(tab => (
                  <button key={tab} className={`pd-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                    {tab === "about" ? "About" : tab === "howToPlant" ? "How to Plant" : "How to Care"}
                  </button>
                ))}
              </div>
              <div className="pd-tab-content">
                <p className="pd-tab-text">
                  {activeTab === "about" ? plant.description : activeTab === "howToPlant" ? plant.howToPlant : plant.howTocare}
                  {!(activeTab === "about" ? plant.description : activeTab === "howToPlant" ? plant.howToPlant : plant.howTocare) && (
                    <span style={{ color: "rgba(120,180,80,0.25)", fontStyle: "italic" }}>No information provided</span>
                  )}
                </p>
              </div>

              {/* Info */}
              <div className="pd-info-box">
                <div className="pd-info-row"><span className="pd-info-label">📍 Location</span><span className="pd-info-val">{plant.location}</span></div>
                <div className="pd-info-row"><span className="pd-info-label">📞 Contact</span><span className="pd-info-val">{plant.contact}</span></div>
                <div className="pd-info-row"><span className="pd-info-label">📦 Stock</span><span className="pd-info-val">{plant.stock} available</span></div>
                <div className="pd-info-row"><span className="pd-info-label">📅 Listed</span><span className="pd-info-val">{new Date(plant.createdAt).toLocaleDateString()}</span></div>
              </div>

              {/* CTA */}
              <div className="pd-cta-row">
                <a href={`tel:${plant.contact}`} className="pd-call-btn">📞 Call Seller</a>
                <a href={`https://wa.me/${plant.contact?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="pd-wa-btn">💬 WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlantDetail;