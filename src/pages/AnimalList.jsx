import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
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

  const stats = useMemo(() => ({
    total: animals.length,
    withImages: animals.filter(a => a.images?.length).length,
    withVideo: animals.filter(a => a.videos?.length).length,
  }), [animals]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');

        .al-page { min-height: 100vh; background: #0f0a05; font-family: 'Poppins', sans-serif; }

        /* Hero */
        .al-hero {
          padding: 3.5rem 2rem 2.5rem;
          background: linear-gradient(160deg, rgba(139,90,43,0.15) 0%, transparent 60%);
          border-bottom: 1px solid rgba(212,175,99,0.08);
          text-align: center;
        }
        .al-hero-tag {
          display: inline-block; font-size: 0.7rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(212,175,99,0.6);
          border: 1px solid rgba(212,175,99,0.2); border-radius: 20px;
          padding: 4px 14px; margin-bottom: 1rem;
        }
        .al-hero-title {
          font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 4vw, 2.4rem);
          color: #f0e6d0; margin: 0 0 0.8rem; font-weight: 700; line-height: 1.2;
        }
        .al-hero-sub { font-size: 0.88rem; color: rgba(240,230,208,0.4); max-width: 520px; margin: 0 auto 1.8rem; line-height: 1.6; }
        .al-stats { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
        .al-stat { text-align: center; }
        .al-stat strong { display: block; font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #d4af63; }
        .al-stat span { font-size: 0.72rem; color: rgba(212,175,99,0.4); letter-spacing: 0.12em; text-transform: uppercase; }

        /* Toolbar */
        .al-toolbar {
          padding: 1.2rem 1.5rem;
          display: flex; flex-wrap: wrap; gap: 10px;
          align-items: center; justify-content: center;
          border-bottom: 1px solid rgba(212,175,99,0.08);
          position: sticky; top: 68px; z-index: 10;
          background: rgba(12,8,4,0.95); backdrop-filter: blur(12px);
        }
        .al-input {
          padding: 9px 13px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,99,0.15); border-radius: 8px;
          color: #f0e6d0; font-family: 'Poppins', sans-serif; font-size: 0.85rem;
          outline: none; min-width: 130px; transition: border-color 0.2s;
        }
        .al-input::placeholder { color: rgba(240,230,208,0.2); }
        .al-input:focus { border-color: rgba(212,175,99,0.35); }
        .al-search-btn {
          padding: 9px 20px; background: linear-gradient(135deg, #d4af63, #8b5a2b);
          border: none; border-radius: 8px; color: #1a0f05;
          font-family: 'Poppins', sans-serif; font-size: 0.85rem;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 2px 10px rgba(212,175,99,0.2);
        }
        .al-search-btn:hover { transform: translateY(-1px); }
        .al-view-toggle { display: flex; border: 1px solid rgba(212,175,99,0.15); border-radius: 8px; overflow: hidden; }
        .al-view-btn {
          padding: 8px 12px; background: transparent; border: none;
          color: rgba(212,175,99,0.4); font-size: 1rem; cursor: pointer; transition: all 0.2s;
        }
        .al-view-btn.active { background: rgba(212,175,99,0.12); color: #d4af63; }

        /* Grid */
        .al-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px; padding: 1.5rem;
          max-width: 1300px; margin: 0 auto;
        }
        .al-list { display: flex; flex-direction: column; gap: 12px; padding: 1.5rem; max-width: 900px; margin: 0 auto; }

        /* Card */
        .al-card {
          background: rgba(22,14,8,0.9); border: 1px solid rgba(212,175,99,0.1);
          border-radius: 12px; overflow: hidden; cursor: pointer;
          transition: all 0.25s; position: relative;
        }
        .al-card:hover { border-color: rgba(212,175,99,0.3); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
        .al-card-media { position: relative; height: 180px; overflow: hidden; }
        .al-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; filter: sepia(15%); }
        .al-card:hover .al-card-img { transform: scale(1.05); }
        .al-card-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 8px 12px;
          background: linear-gradient(to top, rgba(10,6,2,0.8), transparent);
          display: flex; justify-content: flex-end;
        }
        .al-media-tag {
          font-size: 0.68rem; color: rgba(212,175,99,0.8);
          background: rgba(0,0,0,0.4); padding: 2px 8px; border-radius: 4px;
          letter-spacing: 0.06em;
        }
        .al-card-body { padding: 14px 16px 16px; }
        .al-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .al-card-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #f0e6d0; margin: 0; font-weight: 700; }
        .al-badge {
          font-size: 0.62rem; padding: 2px 8px;
          background: rgba(74,107,58,0.15); border: 1px solid rgba(74,107,58,0.3);
          border-radius: 4px; color: rgba(120,180,100,0.8);
          letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0;
        }
        .al-price { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #d4af63; font-weight: 700; margin: 6px 0; }
        .al-meta { font-size: 0.8rem; color: rgba(240,230,208,0.4); margin: 3px 0; }
        .al-card-footer {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 10px; padding-top: 10px;
          border-top: 1px solid rgba(212,175,99,0.07);
        }
        .al-hint { font-size: 0.7rem; color: rgba(212,175,99,0.3); letter-spacing: 0.06em; }
        .al-view-link { font-size: 0.75rem; color: rgba(212,175,99,0.55); letter-spacing: 0.1em; text-transform: uppercase; }

        /* List card */
        .al-list-card {
          background: rgba(22,14,8,0.9); border: 1px solid rgba(212,175,99,0.1);
          border-radius: 10px; display: flex; gap: 14px; padding: 14px;
          cursor: pointer; transition: all 0.2s;
        }
        .al-list-card:hover { border-color: rgba(212,175,99,0.25); transform: translateX(4px); }
        .al-list-img { width: 110px; height: 85px; object-fit: cover; border-radius: 8px; flex-shrink: 0; filter: sepia(15%); }
        .al-list-body { flex: 1; min-width: 0; }
        .al-list-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .al-list-price-row { display: flex; gap: 16px; align-items: center; margin: 4px 0; }

        /* States */
        .al-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; }
        .al-spinner {
          width: 36px; height: 36px; border: 2px solid rgba(212,175,99,0.15);
          border-top-color: #d4af63; border-radius: 50%;
          animation: spin 0.8s linear infinite; margin-bottom: 1rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .al-loading p { color: rgba(212,175,99,0.4); font-size: 0.88rem; letter-spacing: 0.1em; }
        .al-empty { text-align: center; padding: 5rem 2rem; }
        .al-empty h3 { font-family: 'Playfair Display', serif; color: rgba(212,175,99,0.4); font-size: 1.3rem; margin-bottom: 8px; }
        .al-empty p { color: rgba(240,230,208,0.25); font-size: 0.85rem; }

        @media (max-width: 600px) {
          .al-hero { padding: 2.5rem 1.2rem 2rem; }
          .al-toolbar { position: static; padding: 1rem; }
          .al-grid { grid-template-columns: 1fr 1fr; gap: 12px; padding: 1rem; }
          .al-input { min-width: 100px; font-size: 0.8rem; }
          .al-list-img { width: 85px; height: 70px; }
        }
        @media (max-width: 400px) {
          .al-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="al-page">
        {/* Hero */}
        <section className="al-hero">
          <span className="al-hero-tag">Livestock Marketplace</span>
          <h1 className="al-hero-title">Find animals from trusted rural sellers</h1>
          <p className="al-hero-sub">Browse livestock with photos, videos, location and price</p>
          <div className="al-stats">
            <div className="al-stat"><strong>{stats.total}</strong><span>Listings</span></div>
            <div className="al-stat"><strong>{stats.withImages}</strong><span>With Images</span></div>
            <div className="al-stat"><strong>{stats.withVideo}</strong><span>With Videos</span></div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="al-toolbar">
          <input className="al-input" placeholder="Search by name" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
          <input className="al-input" placeholder="Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
          <input className="al-input" type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
          <input className="al-input" type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
          <button className="al-search-btn" onClick={fetchAnimals}>Search</button>
          <div className="al-view-toggle">
            <button className={`al-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>⊞</button>
            <button className={`al-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>☰</button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="al-loading">
            <div className="al-spinner" />
            <p>Loading animals...</p>
          </div>
        ) : animals.length === 0 ? (
          <div className="al-empty">
            <h3>No animals found</h3>
            <p>Try changing the filters or check back later</p>
          </div>
        ) : (
          <section className={viewMode === "grid" ? "al-grid" : "al-list"}>
            {animals.map(animal => viewMode === "grid" ? (
              <article key={animal._id} className="al-card" onClick={() => navigate(`/animal/${animal._id}`)}>
                <div className="al-card-media">
                  <img src={animal.images?.[0] || "https://via.placeholder.com/400x180?text=No+Image"} alt={animal.name} className="al-card-img" onError={e => { e.currentTarget.src = "https://via.placeholder.com/400x180?text=No+Image"; }} />
                  <div className="al-card-overlay">
                    <span className="al-media-tag">{animal.videos?.length ? "🎥 Video" : "📷 Photo"}</span>
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
                    <span className="al-hint">{animal.images?.length ? `${animal.images.length} photos` : "No media"}</span>
                    <span className="al-view-link">View →</span>
                  </div>
                </div>
              </article>
            ) : (
              <article key={animal._id} className="al-list-card" onClick={() => navigate(`/animal/${animal._id}`)}>
                <img src={animal.images?.[0] || "https://via.placeholder.com/110x85?text=No+Image"} alt={animal.name} className="al-list-img" onError={e => { e.currentTarget.src = "https://via.placeholder.com/110x85?text=No+Image"; }} />
                <div className="al-list-body">
                  <div className="al-list-top">
                    <h3 className="al-card-title">{animal.name}</h3>
                    <span className="al-badge">Available</span>
                  </div>
                  <div className="al-list-price-row">
                    <p className="al-price" style={{ margin: 0 }}>₹{Number(animal.price || 0).toLocaleString()}</p>
                    <span className="al-hint">{animal.videos?.length ? "Video included" : "Photo only"}</span>
                  </div>
                  <p className="al-meta">📍 {animal.location || "Location not added"}</p>
                  <p className="al-meta">📞 {animal.contact || "Contact not added"}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </>
  );
};

export default AnimalList;