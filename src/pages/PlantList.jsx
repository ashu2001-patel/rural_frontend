import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { plantAPI } from "../api/axios";

const CATEGORIES = ["All", "Vegetable", "Fruit", "Flower", "Herb & Medicinal", "Tree & Sapling", "Seed"];
const CAT_ICONS = { All: "🌿", Vegetable: "🥦", Fruit: "🍎", Flower: "🌸", "Herb & Medicinal": "🌿", "Tree & Sapling": "🌳", Seed: "🌱" };

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("plant_wishlist") || "[]"));
  const [filters, setFilters] = useState({ name: "", location: "", listingType: "", season: "", sunlight: "" });
  const navigate = useNavigate();

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.location) params.location = filters.location;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.season) params.season = filters.season;
      if (filters.sunlight) params.sunlight = filters.sunlight;
      if (category !== "All") params.category = category;
      const res = await plantAPI.get("/plant", { params });
      setPlants(res.data.plants || []);
    } catch (err) {
      console.error(err);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlants(); }, [category]);

  const toggleWishlist = (e, id) => {
    e.stopPropagation();
    const updated = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem("plant_wishlist", JSON.stringify(updated));
  };

  const sorted = useMemo(() => {
    let list = [...plants];
    if (sortBy === "price_asc") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "price_desc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [plants, sortBy]);

  const stats = useMemo(() => ({
    total: plants.length,
    buy: plants.filter(p => p.listingType === "buy" || p.listingType === "both").length,
    rent: plants.filter(p => p.listingType === "rent" || p.listingType === "both").length,
    states: new Set(plants.map(p => p.location?.split(",").pop()?.trim()).filter(Boolean)).size
  }), [plants]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        .pl-page { min-height: 100vh; background: #0a0f06; font-family: 'Poppins', sans-serif; }
        .pl-hero { padding: 3rem 1.5rem 2rem; text-align: center; background: linear-gradient(160deg, rgba(45,90,30,0.25) 0%, rgba(139,90,43,0.1) 100%); border-bottom: 1px solid rgba(120,180,80,0.1); }
        .pl-hero-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(120,180,80,0.7); border: 1px solid rgba(120,180,80,0.2); border-radius: 20px; padding: 4px 14px; margin-bottom: 1rem; }
        .pl-hero-title { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem, 4vw, 2.2rem); color: #e8f0e0; margin: 0 0 0.6rem; }
        .pl-hero-sub { font-size: 0.82rem; color: rgba(232,240,224,0.38); max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.7; }
        .pl-stats { display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
        .pl-stat strong { display: block; font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #78b450; line-height: 1; }
        .pl-stat span { font-size: 0.65rem; color: rgba(120,180,80,0.38); letter-spacing: 0.15em; text-transform: uppercase; }
        .pl-cats { display: flex; gap: 8px; padding: 0.8rem 1.5rem; overflow-x: auto; border-bottom: 1px solid rgba(120,180,80,0.08); scrollbar-width: none; }
        .pl-cats::-webkit-scrollbar { display: none; }
        .pl-cat { display: flex; align-items: center; gap: 5px; padding: 6px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(120,180,80,0.12); border-radius: 20px; font-size: 0.78rem; color: rgba(232,240,224,0.5); cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.2s; }
        .pl-cat:hover { color: rgba(120,180,80,0.7); border-color: rgba(120,180,80,0.25); }
        .pl-cat.active { background: rgba(120,180,80,0.12); border-color: rgba(120,180,80,0.35); color: #78b450; }
        .pl-toolbar { display: flex; flex-wrap: wrap; gap: 8px; padding: 1rem 1.5rem; background: rgba(8,12,5,0.96); border-bottom: 1px solid rgba(120,180,80,0.07); position: sticky; top: 64px; z-index: 10; backdrop-filter: blur(12px); }
        .pl-input { padding: 8px 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(120,180,80,0.13); border-radius: 8px; color: #e8f0e0; font-family: 'Poppins', sans-serif; font-size: 0.82rem; outline: none; min-width: 120px; }
        .pl-input::placeholder { color: rgba(232,240,224,0.18); }
        .pl-select { padding: 8px 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(120,180,80,0.13); border-radius: 8px; color: rgba(232,240,224,0.6); font-family: 'Poppins', sans-serif; font-size: 0.82rem; outline: none; }
        .pl-select option { background: #0a0f06; }
        .pl-search-btn { padding: 8px 18px; background: linear-gradient(135deg, #4a8a28, #2d5a18); border: none; border-radius: 8px; color: #e8f0e0; font-weight: 600; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; }
        .pl-search-btn:hover { transform: translateY(-1px); }
        .pl-results { text-align: center; font-size: 0.75rem; color: rgba(120,180,80,0.3); padding: 0.8rem; letter-spacing: 0.08em; }
        .pl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 18px; padding: 1.5rem; max-width: 1300px; margin: 0 auto; }
        .pl-card { background: rgba(12,18,8,0.95); border: 1px solid rgba(120,180,80,0.1); border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.28s; position: relative; animation: plFadeIn 0.4s ease both; }
        @keyframes plFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .pl-card:hover { border-color: rgba(120,180,80,0.3); transform: translateY(-5px); box-shadow: 0 16px 36px rgba(0,0,0,0.5); }
        .pl-card-media { position: relative; height: 170px; overflow: hidden; }
        .pl-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s; }
        .pl-card:hover .pl-card-img { transform: scale(1.06); }
        .pl-card-grad { position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(to top, rgba(8,12,5,0.9), transparent); }
        .pl-card-tags { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; flex-wrap: wrap; }
        .pl-card-tag { font-size: 0.6rem; padding: 2px 7px; border-radius: 4px; background: rgba(0,0,0,0.6); color: rgba(120,180,80,0.8); letter-spacing: 0.06em; }
        .pl-wishlist { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(120,180,80,0.2); display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; transition: all 0.2s; }
        .pl-wishlist.liked { border-color: rgba(220,80,80,0.4); background: rgba(220,80,80,0.1); }
        .pl-card-body { padding: 12px 14px 14px; }
        .pl-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .pl-card-name { font-family: 'Playfair Display', serif; font-size: 1rem; color: #e8f0e0; font-weight: 700; }
        .pl-card-cat { font-size: 0.58rem; padding: 2px 7px; background: rgba(45,90,30,0.2); border: 1px solid rgba(120,180,80,0.25); border-radius: 4px; color: rgba(120,180,80,0.8); letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; }
        .pl-card-price { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #78b450; font-weight: 700; margin: 5px 0; }
        .pl-card-meta { font-size: 0.74rem; color: rgba(232,240,224,0.38); margin: 2px 0; }
        .pl-care-tags { display: flex; gap: 5px; margin-top: 8px; flex-wrap: wrap; }
        .pl-care-tag { font-size: 0.62rem; padding: 2px 8px; background: rgba(45,90,30,0.15); border: 1px solid rgba(120,180,80,0.15); border-radius: 10px; color: rgba(120,180,80,0.65); }
        .pl-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(120,180,80,0.07); }
        .pl-stock { font-size: 0.66rem; color: rgba(120,180,80,0.3); }
        .pl-view-link { font-size: 0.7rem; color: rgba(120,180,80,0.55); letter-spacing: 0.1em; text-transform: uppercase; }
        .pl-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; }
        .pl-spinner { width: 36px; height: 36px; border: 2px solid rgba(120,180,80,0.15); border-top-color: #78b450; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pl-loading p { color: rgba(120,180,80,0.4); font-size: 0.85rem; letter-spacing: 0.1em; }
        .pl-empty { text-align: center; padding: 5rem 2rem; }
        .pl-empty h3 { font-family: 'Playfair Display', serif; color: rgba(120,180,80,0.4); margin-bottom: 8px; }
        .pl-empty p { color: rgba(232,240,224,0.22); font-size: 0.85rem; }
        @media (max-width: 768px) { .pl-toolbar { position: static; } .pl-grid { grid-template-columns: 1fr 1fr; gap: 12px; padding: 1rem; } }
        @media (max-width: 480px) { .pl-grid { grid-template-columns: 1fr 1fr; gap: 10px; padding: 0.8rem; } .pl-card-media { height: 140px; } }
        @media (max-width: 360px) { .pl-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pl-page">
        <section className="pl-hero">
          <span className="pl-hero-tag">🌱 Plants & Gardening</span>
          <h1 className="pl-hero-title">Grow your garden with rural sellers</h1>
          <p className="pl-hero-sub">Buy plants, seeds, saplings and rent gardening tools from trusted rural communities</p>
          <div className="pl-stats">
            <div className="pl-stat"><strong>{stats.total}</strong><span>Listings</span></div>
            <div className="pl-stat"><strong>{stats.buy}</strong><span>For Sale</span></div>
            <div className="pl-stat"><strong>{stats.rent}</strong><span>For Rent</span></div>
            <div className="pl-stat"><strong>{stats.states}</strong><span>States</span></div>
          </div>
        </section>

        <div className="pl-cats">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`pl-cat ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>
              {CAT_ICONS[cat]} {cat}
            </button>
          ))}
        </div>

        <div className="pl-toolbar">
          <input className="pl-input" placeholder="🔍 Search plants" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
          <input className="pl-input" placeholder="📍 Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
          <select className="pl-select" value={filters.listingType} onChange={e => setFilters({ ...filters, listingType: e.target.value })}>
            <option value="">All Types</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
            <option value="both">Buy & Rent</option>
          </select>
          <select className="pl-select" value={filters.season} onChange={e => setFilters({ ...filters, season: e.target.value })}>
            <option value="">All Seasons</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
            <option value="Monsoon">Monsoon</option>
            <option value="Spring">Spring</option>
            <option value="All Season">All Season</option>
          </select>
          <select className="pl-select" value={filters.sunlight} onChange={e => setFilters({ ...filters, sunlight: e.target.value })}>
            <option value="">All Sunlight</option>
            <option value="Full Sun">Full Sun</option>
            <option value="Partial Sun">Partial Sun</option>
            <option value="Shade">Shade</option>
          </select>
          <select className="pl-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
          <button className="pl-search-btn" onClick={fetchPlants}>Search</button>
        </div>

        {loading ? (
          <div className="pl-loading"><div className="pl-spinner" /><p>Loading plants...</p></div>
        ) : sorted.length === 0 ? (
          <div className="pl-empty"><h3>No plants found</h3><p>Try changing filters or check back later</p></div>
        ) : (
          <>
            <p className="pl-results">{sorted.length} listing{sorted.length !== 1 ? "s" : ""} found</p>
            <div className="pl-grid">
              {sorted.map((plant, idx) => (
                <article key={plant._id} className="pl-card" style={{ animationDelay: `${idx * 0.05}s` }} onClick={() => navigate(`/plant/${plant._id}`)}>
                  <div className="pl-card-media">
                    <img src={plant.images?.[0] || "https://via.placeholder.com/400x170?text=No+Image"} alt={plant.name} className="pl-card-img" onError={e => { e.currentTarget.src = "https://via.placeholder.com/400x170?text=No+Image"; }} />
                    <div className="pl-card-grad" />
                    <div className="pl-card-tags">
                      <span className="pl-card-tag">{CAT_ICONS[plant.category]} {plant.category}</span>
                      <span className="pl-card-tag">{plant.listingType === "buy" ? "🛒 Buy" : plant.listingType === "rent" ? "🔑 Rent" : "🛒 Buy & Rent"}</span>
                    </div>
                    <div className={`pl-wishlist ${wishlist.includes(plant._id) ? "liked" : ""}`} onClick={e => toggleWishlist(e, plant._id)}>
                      {wishlist.includes(plant._id) ? "♥" : "♡"}
                    </div>
                  </div>
                  <div className="pl-card-body">
                    <div className="pl-card-top">
                      <h3 className="pl-card-name">{plant.name}</h3>
                      <span className="pl-card-cat">{plant.category}</span>
                    </div>
                    <p className="pl-card-price">
                      {plant.price ? `₹${Number(plant.price).toLocaleString()}` : ""}
                      {plant.rentPrice ? ` · ₹${plant.rentPrice}/${plant.rentUnit}` : ""}
                    </p>
                    <p className="pl-card-meta">📍 {plant.location || "Location not added"}</p>
                    <p className="pl-card-meta">📞 {plant.contact || "Contact not added"}</p>
                    <div className="pl-care-tags">
                      {plant.sunlight && <span className="pl-care-tag">☀️ {plant.sunlight}</span>}
                      {plant.wateringFrequency && <span className="pl-care-tag">💧 {plant.wateringFrequency}</span>}
                      {plant.season && <span className="pl-care-tag">🌡️ {plant.season}</span>}
                    </div>
                    <div className="pl-card-footer">
                      <span className="pl-stock">Stock: {plant.stock || 0}</span>
                      <span className="pl-view-link">View →</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PlantList;