import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI, toolAPI, plantAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const MyListings = () => {
  const [tab, setTab] = useState("animals");
  const [animals, setAnimals] = useState([]);
  const [tools, setTools] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [aRes, tRes, pRes] = await Promise.all([
        animalAPI.get(`/animal/employer/${user.id}`),
        toolAPI.get(`/tool/owner/${user.id}`),
        plantAPI.get(`/plant/seller/${user.id}`)
      ]);
      setAnimals(aRes.data.animals || []);
      setTools(tRes.data.tools || []);
      setPlants(pRes.data.plants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this listing?")) return;
    setDeletingId(id);
    try {
      if (type === "animal") await animalAPI.delete(`/animal/${id}`);
      if (type === "tool") await toolAPI.delete(`/tool/${id}`);
      if (type === "plant") await plantAPI.delete(`/plant/${id}`);
      if (type === "animal") setAnimals(prev => prev.filter(a => a._id !== id));
      if (type === "tool") setTools(prev => prev.filter(t => t._id !== id));
      if (type === "plant") setPlants(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert("Delete failed!");
    } finally {
      setDeletingId(null);
    }
  };

  const TABS = [
    { key: "animals", label: "🐄 Animals", count: animals.length },
    { key: "tools", label: "🔧 Tools", count: tools.length },
    { key: "plants", label: "🌱 Plants", count: plants.length }
  ];

  const currentList = tab === "animals" ? animals : tab === "tools" ? tools : plants;
  const currentType = tab === "animals" ? "animal" : tab === "tools" ? "tool" : "plant";

  const getDetailPath = (type, id) => `/${type === "animal" ? "animal" : type === "tool" ? "tool" : "plant"}/${id}`;
  const getPostPath = (type) => `/post-${type}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        .ml-page { min-height: 100vh; background: #0f0a05; font-family: 'Poppins', sans-serif; padding: 2rem 1.5rem; }
        .ml-header { text-align: center; margin-bottom: 2rem; }
        .ml-title { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem, 3vw, 2rem); color: #d4af63; margin: 0 0 4px; }
        .ml-sub { font-size: 0.78rem; color: rgba(212,175,99,0.4); letter-spacing: 0.15em; text-transform: uppercase; }
        .ml-divider { display: flex; align-items: center; gap: 12px; max-width: 280px; margin: 0.8rem auto; }
        .ml-divider-line { flex: 1; height: 1px; background: rgba(212,175,99,0.15); }
        .ml-tabs { display: flex; justify-content: center; gap: 8px; margin-bottom: 2rem; flex-wrap: wrap; }
        .ml-tab { display: flex; align-items: center; gap: 8px; padding: 9px 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,99,0.12); border-radius: 10px; color: rgba(230,216,181,0.5); font-family: 'Poppins', sans-serif; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
        .ml-tab:hover { border-color: rgba(212,175,99,0.25); color: rgba(212,175,99,0.7); }
        .ml-tab.active { background: rgba(212,175,99,0.1); border-color: rgba(212,175,99,0.35); color: #d4af63; }
        .ml-tab-count { background: rgba(212,175,99,0.15); color: #d4af63; font-size: 0.72rem; padding: 1px 7px; border-radius: 10px; font-weight: 600; }
        .ml-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; max-width: 1200px; margin: 0 auto; }
        .ml-card { background: rgba(22,14,8,0.92); border: 1px solid rgba(212,175,99,0.1); border-radius: 12px; overflow: hidden; transition: all 0.25s; }
        .ml-card:hover { border-color: rgba(212,175,99,0.25); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
        .ml-card-img { width: 100%; height: 160px; object-fit: cover; display: block; filter: sepia(12%); }
        .ml-card-body { padding: 12px 14px 14px; }
        .ml-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .ml-card-name { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f0e6d0; font-weight: 700; margin: 0; }
        .ml-card-price { font-family: 'Playfair Display', serif; font-size: 0.95rem; color: #d4af63; margin: 4px 0; }
        .ml-card-meta { font-size: 0.76rem; color: rgba(240,230,208,0.38); margin: 2px 0; }
        .ml-card-date { font-size: 0.68rem; color: rgba(212,175,99,0.25); margin-top: 4px; }
        .ml-card-actions { display: flex; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(212,175,99,0.07); }
        .ml-view-btn { flex: 1; padding: 7px; background: rgba(212,175,99,0.06); border: 1px solid rgba(212,175,99,0.15); border-radius: 6px; color: rgba(212,175,99,0.6); font-family: 'Poppins', sans-serif; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; }
        .ml-view-btn:hover { background: rgba(212,175,99,0.12); color: #d4af63; }
        .ml-del-btn { flex: 1; padding: 7px; background: rgba(180,60,40,0.06); border: 1px solid rgba(180,60,40,0.15); border-radius: 6px; color: rgba(232,145,122,0.6); font-family: 'Poppins', sans-serif; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; }
        .ml-del-btn:hover { background: rgba(180,60,40,0.12); color: #e8917a; }
        .ml-del-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ml-spinner { width: 36px; height: 36px; border: 2px solid rgba(212,175,99,0.15); border-top-color: #d4af63; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ml-loading { text-align: center; padding: 5rem 2rem; color: rgba(212,175,99,0.4); }
        .ml-empty { text-align: center; padding: 4rem 2rem; }
        .ml-empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .ml-empty h3 { font-family: 'Playfair Display', serif; color: rgba(212,175,99,0.35); margin-bottom: 8px; }
        .ml-empty p { color: rgba(240,230,208,0.22); font-size: 0.85rem; margin-bottom: 1.5rem; }
        .ml-post-btn { display: inline-block; padding: 10px 24px; background: linear-gradient(135deg, #d4af63, #8b5a2b); border: none; border-radius: 8px; color: #1a0f05; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.88rem; cursor: pointer; text-decoration: none; }
        .ml-count { text-align: center; font-size: 0.75rem; color: rgba(212,175,99,0.3); padding: 0.5rem; letter-spacing: 0.08em; margin-bottom: 1rem; }
        @media (max-width: 600px) { .ml-grid { grid-template-columns: 1fr 1fr; gap: 12px; } .ml-tab { padding: 8px 14px; font-size: 0.82rem; } }
        @media (max-width: 400px) { .ml-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ml-page">
        <div className="ml-header">
          <h2 className="ml-title">My Listings</h2>
          <p className="ml-sub">Manage all your listings</p>
          <div className="ml-divider">
            <div className="ml-divider-line" />
            <span style={{ color: "rgba(74,107,58,0.7)", fontSize: 13 }}>🌿</span>
            <div className="ml-divider-line" />
          </div>
        </div>

        {/* Tabs */}
        <div className="ml-tabs">
          {TABS.map(t => (
            <button key={t.key} className={`ml-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              {t.label}
              <span className="ml-tab-count">{t.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="ml-loading">
            <div className="ml-spinner" />
            <p>Loading your listings...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="ml-empty">
            <span className="ml-empty-icon">
              {tab === "animals" ? "🐄" : tab === "tools" ? "🔧" : "🌱"}
            </span>
            <h3>No {tab} posted yet</h3>
            <p>Start adding your {tab} to reach buyers!</p>
            <button className="ml-post-btn" onClick={() => navigate(getPostPath(currentType))}>
              ＋ Post {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
            </button>
          </div>
        ) : (
          <>
            <p className="ml-count">{currentList.length} listing{currentList.length !== 1 ? "s" : ""}</p>
            <div className="ml-grid">
              {currentList.map(item => (
                <div key={item._id} className="ml-card">
                  <img
                    src={item.images?.[0] || "https://via.placeholder.com/280x160?text=No+Image"}
                    alt={item.name}
                    className="ml-card-img"
                    onError={e => { e.currentTarget.src = "https://via.placeholder.com/280x160?text=No+Image"; }}
                  />
                  <div className="ml-card-body">
                    <div className="ml-card-top">
                      <h3 className="ml-card-name">{item.name}</h3>
                    </div>
                    <p className="ml-card-price">
                      {item.price ? `₹${Number(item.price).toLocaleString()}` : ""}
                      {item.rentPrice ? ` · ₹${item.rentPrice}/${item.rentUnit}` : ""}
                    </p>
                    <p className="ml-card-meta">📍 {item.location || "No location"}</p>
                    <p className="ml-card-meta">📞 {item.contact || "No contact"}</p>
                    <p className="ml-card-date">Posted: {new Date(item.createdAt).toLocaleDateString()}</p>
                    <div className="ml-card-actions">
                      <button className="ml-view-btn" onClick={() => navigate(getDetailPath(currentType, item._id))}>
                        👁 View
                      </button>
                      <button
                        className="ml-del-btn"
                        onClick={() => handleDelete(currentType, item._id)}
                        disabled={deletingId === item._id}
                      >
                        {deletingId === item._id ? "Deleting..." : "🗑 Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyListings;