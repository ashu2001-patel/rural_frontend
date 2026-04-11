import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";

const CATEGORIES = ["All", "Cow", "Buffalo", "Goat", "Sheep", "Pig", "Poultry", "Horse", "Camel"];
const CAT_ICONS = { All: "🐄", Cow: "🐄", Buffalo: "🐃", Goat: "🐐", Sheep: "🐑", Pig: "🐷", Poultry: "🐓", Horse: "🐴", Camel: "🐪" };

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist") || "[]"));
  const [filters, setFilters] = useState({ name: "", location: "", minPrice: "", maxPrice: "" });
  const navigate = useNavigate();

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const res = await animalAPI.get("/animal/", { params });
      const data = res.data;
      if (Array.isArray(data)) setAnimals(data);
      else setAnimals(data?.animals || []);
    } catch (err) {
      console.error(err);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnimals(); }, []);

  const toggleWishlist = (e, id) => {
    e.stopPropagation();
    const updated = wishlist.includes(id)
      ? wishlist.filter(w => w !== id)
      : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const filtered = useMemo(() => {
    let list = [...animals];
    if (category !== "All") {
      list = list.filter(a => a.name?.toLowerCase().includes(category.toLowerCase()));
    }
    if (sortBy === "price_asc") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "price_desc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === "latest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [animals, category, sortBy]);

  const stats = useMemo(() => ({
    total: animals.length,
    withImages: animals.filter(a => a.images?.length).length,
    withVideo: animals.filter(a => a.videos?.length).length,
    states: new Set(animals.map(a => a.location?.split(",").pop()?.trim()).filter(Boolean)).size
  }), [animals]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');

        .al-page { min-height: 100vh; background: #0f0a05; font-family: 'Poppins', sans-serif; }

        .al-hero { padding: 3rem 1.5rem 2rem; text-align: center; background: linear-gradient(160deg, rgba(139,90,43,0.18) 0%, transparent 65%); border-bottom: 1px solid rgba(212,175,99,0.08); }
        .al-hero-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(212,175,99,0.6); border: 1px solid rgba(212,175,99,0.18); border-radius: 20px; padding: 4px 14px; margin-bottom: 1rem; }
        .al-hero-title { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem, 4vw, 2.2rem); color: #f0e6d0; margin: 0 0 0.6rem; line-height: 1.2; }
        .al-hero-sub { font-size: 0.82rem; color: rgba(240,230,208,0.35); max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.7; }
        .al-stats { display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
        .al-stat strong { display: block; font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #d4af63; line-height: 1; }
        .al-stat span { font-size: 0.65rem; color: rgba(212,175,99,0.35); letter-spacing: 0.15em; text-transform: uppercase; }

        .al-cats { display: flex; gap: 8px; padding: 0.8rem 1.5rem; overflow-x: auto; border-bottom: 1px solid rgba(212,175,99,0.07); scrollbar-width: none; }
        .al-cats::-webkit-scrollbar { display: none; }
        .al-cat { display: flex; align-items: center; gap: 5px; padding: 6px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,99,0.12); border-radius: 20px; font-size: 0.78rem; color: rgba(230,216,181,0.5); cursor: pointer; white-space: nowrap; transition: all 0.2s; flex-shrink: 0; }
        .al-cat:hover { color: rgba(212,175,99,0.7); border-color: rgba(212,175,99,0.25); }
        .al-cat.active { background: rgba(212,175,99,0.1); border-color: rgba(212,175,99,0.35); color: #d4af63; }

        .al-toolbar { display: flex; flex-wrap: wrap; gap: 8px; padding: 1rem 1.5rem; align-items: center; justify-content: center; background: rgba(10,6,2,0.96); border-bottom: 1px solid rgba(212,175,99,0.07); position: sticky; top: 64px; z-index: 10; backdrop-filter: blur(12px); }
        .al-input { padding: 8px 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,99,0.13); border-radius: 8px; color: #f0e6d0; font-family: 'Poppins', sans-serif; font-size: 0.82rem; outline: none; min-width: 120px; transition: border-color 0.2s; }
        .al-input::placeholder { color: rgba(240,230,208,0.18); }
        .al-input:focus { border-color: rgba(212,175,99,0.35); }
        .al-sort { padding: 8px 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,99,0.13); border-radius: 8px; color: rgba(240,230,208,0.6); font-family: 'Poppins', sans-serif; font-size: 0.82rem; outline: none; cursor: pointer; }
        .al-sort option { background: #1a0f05; }
        .al-search-btn { padding: 8px 18px; background: linear-gradient(135deg, #d4af63, #8b5a2b); border: none; border-radius: 8px; color: #1a0f05; font-weight: 600; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; }
        .al-search-btn:hover { transform: translateY(-1px); }
        .al-view-toggle { display: flex; border: 1px solid rgba(212,175,99,0.13); border-radius: 8px; overflow: hidden; }
        .al-view-btn { padding: 7px 11px; background: transparent; border: none; color: rgba(212,175,99,0.35); cursor: pointer; font-size: 0.95rem; transition: all 0.2s; }
        .al-view-btn.active { background: rgba(212,175,99,0.1); color: #d4af63; }

        .al-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(255px, 1fr)); gap: 18px; padding: 1.5rem; max-width: 1300px; margin: 0 auto; }
        .al-list { display: flex; flex-direction: column; gap: 12px; padding: 1.5rem; max-width: 900px; margin: 0 auto; }

        .al-card { background: rgba(20,13,7,0.92); border: 1px solid rgba(212,175,99,0.1); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.28s; position: relative; animation: fadeIn 0.4s ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .al-card:hover { border-color: rgba(212,175,99,0.28); transform: translateY(-5px); box-shadow: 0 16px 36px rgba(0,0,0,0.45); }
        .al-card-media { position: relative; height: 175px; overflow: hidden; }
        .al-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s; filter: sepia(12%); }
        .al-card:hover .al-card-img { transform: scale(1.06); }
        .al-card-grad { position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(to top, rgba(10,6,2,0.85), transparent); }
        .al-card-tags { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; }
        .al-card-tag { font-size: 0.6rem; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.06em; background: rgba(0,0,0,0.55); color: rgba(212,175,99,0.75); }
        .al-wishlist { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(212,175,99,0.2); display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; transition: all 0.2s; }
        .al-wishlist:hover { background: rgba(212,175,99,0.15); }
        .al-wishlist.liked { border-color: rgba(220,80,80,0.4); background: rgba(220,80,80,0.1); }
        .al-card-body { padding: 12px 14px 14px; }
        .al-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .al-card-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f0e6d0; font-weight: 700; }
        .al-badge { font-size: 0.58rem; padding: 2px 7px; background: rgba(74,107,58,0.15); border: 1px solid rgba(74,107,58,0.28); border-radius: 4px; color: rgba(120,180,100,0.75); letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; }
        .al-price { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #d4af63; font-weight: 700; margin: 5px 0; }
        .al-meta { font-size: 0.76rem; color: rgba(240,230,208,0.38); margin: 2px 0; }
        .al-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(212,175,99,0.07); }
        .al-photos { font-size: 0.66rem; color: rgba(212,175,99,0.28); letter-spacing: 0.05em; }
        .al-view-link { font-size: 0.7rem; color: rgba(212,175,99,0.5); letter-spacing: 0.1em; text-transform: uppercase; }

        .al-list-card { background: rgba(20,13,7,0.92); border: 1px solid rgba(212,175,99,0.1); border-radius: 10px; display: flex; gap: 14px; padding: 12px; cursor: pointer; transition: all 0.2s; animation: fadeIn 0.4s ease both; }
        .al-list-card:hover { border-color: rgba(212,175,99,0.25); transform: translateX(4px); }
        .al-list-img { width: 100px; height: 80px; object-fit: cover; border-radius: 8px; flex-shrink: 0; filter: sepia(12%); }
        .al-list-body { flex: 1; min-width: 0; }
        .al-list-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .al-list-price-row { display: flex; gap: 12px; align-items: center; margin: 3px 0; }

        .al-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; }
        .al-spinner { width: 36px; height: 36px; border: 2px solid rgba(212,175,99,0.15); border-top-color: #d4af63; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .al-loading p { color: rgba(212,175,99,0.4); font-size: 0.85rem; letter-spacing: 0.1em; }
        .al-empty { text-align: center; padding: 5rem 2rem; }
        .al-empty h3 { font-family: 'Playfair Display', serif; color: rgba(212,175,99,0.4); margin-bottom: 8px; }
        .al-empty p { color: rgba(240,230,208,0.22); font-size: 0.85rem; }
        .al-results-count { text-align: center; font-size: 0.75rem; color: rgba(212,175,99,0.3); padding: 0.8rem; letter-spacing: 0.08em; }

        @media (max-width: 768px) {
          .al-toolbar { position: static; }
          .al-grid { grid-template-columns: 1fr 1fr; gap: 12px; padding: 1rem; }
          .al-input { min-width: 100px; }
        }
        @media (max-width: 480px) {
          .al-hero { padding: 2rem 1rem 1.5rem; }
          .al-grid { grid-template-columns: 1fr 1fr; gap: 10px; padding: 0.8rem; }
          .al-card-media { height: 140px; }
          .al-list-img { width: 80px; height: 65px; }
        }
        @media (max-width: 360px) {
          .al-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="al-page">
        {/* Hero */}
        <section className="al-hero">
          <span className="al-hero-tag">🌾 Livestock Marketplace</span>
          <h1 className="al-hero-title">Find animals from trusted rural sellers</h1>
          <p className="al-hero-sub">Browse livestock with photos, videos, location and direct contact</p>
          <div className="al-stats">
            <div className="al-stat"><strong>{stats.total}</strong><span>Listings</span></div>
            <div className="al-stat"><strong>{stats.withImages}</strong><span>With Images</span></div>
            <div className="al-stat"><strong>{stats.withVideo}</strong><span>With Videos</span></div>
            <div className="al-stat"><strong>{stats.states}</strong><span>States</span></div>
          </div>
        </section>

        {/* Category Pills */}
        <div className="al-cats">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`al-cat ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {CAT_ICONS[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="al-toolbar">
          <input className="al-input" placeholder="🔍 Search by name" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
          <input className="al-input" placeholder="📍 Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
          <input className="al-input" type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} style={{ width: "90px" }} />
          <input className="al-input" type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} style={{ width: "90px" }} />
          <select className="al-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="latest">Sort: Latest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
          <button className="al-search-btn" onClick={fetchAnimals}>Search</button>
          <div className="al-view-toggle">
            <button className={`al-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>⊞</button>
            <button className={`al-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>☰</button>
          </div>
        </div>

        {loading ? (
          <div className="al-loading">
            <div className="al-spinner" />
            <p>Loading animals...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="al-empty">
            <h3>No animals found</h3>
            <p>Try changing the filters or check back later</p>
          </div>
        ) : (
          <>
            <p className="al-results-count">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} found</p>
            <section className={viewMode === "grid" ? "al-grid" : "al-list"}>
              {filtered.map((animal, idx) => viewMode === "grid" ? (
                <article
                  key={animal._id}
                  className="al-card"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  onClick={() => navigate(`/animal/${animal._id}`)}
                >
                  <div className="al-card-media">
                    <img
                      src={animal.images?.[0] || "https://via.placeholder.com/400x175?text=No+Image"}
                      alt={animal.name}
                      className="al-card-img"
                      onError={e => { e.currentTarget.src = "https://via.placeholder.com/400x175?text=No+Image"; }}
                    />
                    <div className="al-card-grad" />
                    <div className="al-card-tags">
                      <span className="al-card-tag">🐄 {animal.name}</span>
                      {animal.videos?.length ? <span className="al-card-tag">🎥 Video</span> : animal.images?.length ? <span className="al-card-tag">📷 {animal.images.length} Photos</span> : null}
                    </div>
                    <div
                      className={`al-wishlist ${wishlist.includes(animal._id) ? "liked" : ""}`}
                      onClick={e => toggleWishlist(e, animal._id)}
                    >
                      {wishlist.includes(animal._id) ? "♥" : "♡"}
                    </div>
                  </div>
                  <div className="al-card-body">
                    <div className="al-card-top">
                      <h3 className="al-card-title">{animal.name}</h3>
                      <span className="al-badge">Available</span>
                    </div>
                    <p className="al-price">₹{Number(animal.price || 0).toLocaleString()}</p>
                    <p className="al-meta">📍 {animal.location || "Location not added"}</p>
                    <p className="al-meta">📞 {animal.contact || "Contact not added"}</p>
                    <div className="al-card-footer">
                      <span className="al-photos">
                        {animal.images?.length || 0} photos{animal.videos?.length ? ` · ${animal.videos.length} videos` : ""}
                      </span>
                      <span className="al-view-link">View →</span>
                    </div>
                  </div>
                </article>
              ) : (
                <article
                  key={animal._id}
                  className="al-list-card"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                  onClick={() => navigate(`/animal/${animal._id}`)}
                >
                  <img
                    src={animal.images?.[0] || "https://via.placeholder.com/100x80?text=No+Image"}
                    alt={animal.name}
                    className="al-list-img"
                    onError={e => { e.currentTarget.src = "https://via.placeholder.com/100x80?text=No+Image"; }}
                  />
                  <div className="al-list-body">
                    <div className="al-list-top">
                      <h3 className="al-card-title">{animal.name}</h3>
                      <span className="al-badge">Available</span>
                    </div>
                    <div className="al-list-price-row">
                      <p className="al-price" style={{ margin: 0 }}>₹{Number(animal.price || 0).toLocaleString()}</p>
                      <span className="al-photos">{animal.videos?.length ? "🎥 Video" : "📷 Photo"}</span>
                    </div>
                    <p className="al-meta">📍 {animal.location || "Location not added"}</p>
                    <p className="al-meta">📞 {animal.contact || "Contact not added"}</p>
                  </div>
                  <div
                    className={`al-wishlist ${wishlist.includes(animal._id) ? "liked" : ""}`}
                    style={{ position: "static", flexShrink: 0 }}
                    onClick={e => toggleWishlist(e, animal._id)}
                  >
                    {wishlist.includes(animal._id) ? "♥" : "♡"}
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default AnimalList;