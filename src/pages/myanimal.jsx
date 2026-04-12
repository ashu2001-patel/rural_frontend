import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MediaViewer from "../components/MediaViewer";

const MyAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyAnimals();
  }, [user]);

  const fetchMyAnimals = async () => {
    try {
      setLoading(true);
      // ✅ Fixed endpoint — uses employer ID from token
      const res = await animalAPI.get(`/animal/my/${user.id}`);
      setAnimals(res.data.animals || []);
    } catch (err) {
      console.error(err);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this animal?");
    if (!confirmDelete) return;
    try {
      setDeletingId(id);
      await animalAPI.delete(`/animal/${id}`);
      setAnimals((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        .ma-page { min-height: 100vh; background: #0f0a05; font-family: 'Poppins', sans-serif; padding: 2rem 1.5rem; }
        .ma-header { text-align: center; margin-bottom: 2rem; }
        .ma-title { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem, 3vw, 2rem); color: #d4af63; margin: 0 0 4px; }
        .ma-sub { font-size: 0.78rem; color: rgba(212,175,99,0.4); letter-spacing: 0.15em; text-transform: uppercase; }
        .ma-divider { display: flex; align-items: center; gap: 12px; max-width: 280px; margin: 0.8rem auto 0; }
        .ma-divider-line { flex: 1; height: 1px; background: rgba(212,175,99,0.15); }
        .ma-count { text-align: center; margin-bottom: 1.5rem; font-size: 0.82rem; color: rgba(212,175,99,0.35); }
        .ma-count strong { color: #d4af63; font-family: 'Playfair Display', serif; font-size: 1.1rem; }
        .ma-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
        .ma-card { background: rgba(22,14,8,0.92); border: 1px solid rgba(212,175,99,0.12); border-radius: 12px; overflow: hidden; transition: all 0.25s; }
        .ma-card:hover { border-color: rgba(212,175,99,0.28); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
        .ma-media-wrap { border-bottom: 1px solid rgba(212,175,99,0.08); }
        .ma-body { padding: 14px 16px 16px; }
        .ma-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .ma-name { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #f0e6d0; margin: 0; font-weight: 700; }
        .ma-price { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #d4af63; font-weight: 700; margin: 6px 0; }
        .ma-meta { font-size: 0.8rem; color: rgba(240,230,208,0.4); margin: 3px 0; }
        .ma-date { font-size: 0.7rem; color: rgba(212,175,99,0.25); margin-top: 6px; }
        .ma-actions { display: flex; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(212,175,99,0.07); }
        .ma-edit-btn { flex: 1; padding: 8px; background: rgba(212,175,99,0.08); border: 1px solid rgba(212,175,99,0.2); border-radius: 6px; color: #d4af63; font-family: 'Poppins', sans-serif; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .ma-edit-btn:hover { background: rgba(212,175,99,0.15); }
        .ma-delete-btn { flex: 1; padding: 8px; background: rgba(180,60,40,0.08); border: 1px solid rgba(180,60,40,0.2); border-radius: 6px; color: #e8917a; font-family: 'Poppins', sans-serif; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .ma-delete-btn:hover { background: rgba(180,60,40,0.15); }
        .ma-delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ma-spinner { width: 36px; height: 36px; border: 2px solid rgba(212,175,99,0.15); border-top-color: #d4af63; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ma-loading { text-align: center; padding: 5rem 2rem; color: rgba(212,175,99,0.4); }
        .ma-empty { text-align: center; padding: 5rem 2rem; }
        .ma-empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .ma-empty h3 { font-family: 'Playfair Display', serif; color: rgba(212,175,99,0.4); margin-bottom: 8px; }
        .ma-empty p { color: rgba(240,230,208,0.25); font-size: 0.85rem; margin-bottom: 1.5rem; }
        .ma-post-btn { display: inline-block; padding: 10px 24px; background: linear-gradient(135deg, #d4af63, #8b5a2b); border: none; border-radius: 8px; color: #1a0f05; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; text-decoration: none; }
        @media (max-width: 600px) {
          .ma-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ma-page">
        <div className="ma-header">
          <h2 className="ma-title">🐄 My Animals</h2>
          <p className="ma-sub">Manage your livestock listings</p>
          <div className="ma-divider">
            <div className="ma-divider-line" />
            <span style={{ color: "rgba(74,107,58,0.7)", fontSize: 13 }}>🌿</span>
            <div className="ma-divider-line" />
          </div>
        </div>

        {loading ? (
          <div className="ma-loading">
            <div className="ma-spinner" />
            <p>Loading your animals...</p>
          </div>
        ) : animals.length === 0 ? (
          <div className="ma-empty">
            <span className="ma-empty-icon">🐄</span>
            <h3>No animals posted yet</h3>
            <p>Start adding your livestock to reach buyers!</p>
            <button className="ma-post-btn" onClick={() => navigate("/post-animal")}>
              ＋ Post Animal
            </button>
          </div>
        ) : (
          <>
            <p className="ma-count">
              You have <strong>{animals.length}</strong> listing{animals.length > 1 ? "s" : ""}
            </p>
            <div className="ma-grid">
              {animals.map((animal) => (
                <div key={animal._id} className="ma-card">
                  <div className="ma-media-wrap">
                    <MediaViewer
                      images={animal.images || []}
                      videos={animal.videos || []}
                    />
                  </div>
                  <div className="ma-body">
                    <div className="ma-header-row">
                      <h3 className="ma-name">{animal.name}</h3>
                    </div>
                    <p className="ma-price">₹{Number(animal.price || 0).toLocaleString()}</p>
                    <p className="ma-meta">📍 {animal.location || "No location"}</p>
                    <p className="ma-meta">📞 {animal.contact || "No contact"}</p>
                    <p className="ma-date">
                      Posted: {new Date(animal.createdAt).toLocaleDateString()}
                    </p>
                    <div className="ma-actions">
                      <button
                        className="ma-edit-btn"
                        onClick={() => navigate(`/post-animal?edit=${animal._id}`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="ma-delete-btn"
                        onClick={() => handleDelete(animal._id)}
                        disabled={deletingId === animal._id}
                      >
                        {deletingId === animal._id ? "Deleting..." : "🗑 Delete"}
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

export default MyAnimals;