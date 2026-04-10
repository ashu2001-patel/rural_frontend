import { useEffect, useState } from "react";
import { animalAPI } from "../api/axios";
import MediaViewer from "../components/MediaViewer";

const MyAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyAnimals = async () => {
    try {
      setLoading(true);
      const res = await animalAPI.get("/animal/my");
      setAnimals(res.data.animals || []);
    } catch (err) {
      console.error(err);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this animal?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await animalAPI.delete(`/animal/${id}`);

      // remove from UI instantly
      setAnimals((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchMyAnimals();
  }, []);

  return (
    <div style={s.wrap}>
      <h2 style={s.title}>🐄 My Animals</h2>

      {loading ? (
        <p style={s.loading}>Loading your animals...</p>
      ) : animals.length === 0 ? (
        <div style={s.emptyBox}>
          <p style={s.empty}>No animals posted yet</p>
          <span style={s.emptySub}>Start adding your livestock 🐐</span>
        </div>
      ) : (
        <div style={s.grid}>
          {animals.map((animal) => (
            <div key={animal._id} style={s.card}>
              
              {/* MEDIA */}
              <div style={s.mediaWrap}>
                <MediaViewer
                  images={animal.images || []}
                  videos={animal.videos || []}
                />
              </div>

              {/* BODY */}
              <div style={s.body}>
                <div style={s.headerRow}>
                  <h3 style={s.name}>{animal.name}</h3>

                  <span
                    style={{
                      ...s.status,
                      background:
                        animal.verified === "approved"
                          ? "#2e7d32"
                          : animal.verified === "pending"
                          ? "#ff9800"
                          : "#c62828"
                    }}
                  >
                    {animal.verified || "Not Verified"}
                  </span>
                </div>

                <p style={s.price}>₹{animal.price}</p>

                <p style={s.meta}>📍 {animal.location}</p>
                <p style={s.meta}>📞 {animal.contact}</p>

                {/* ACTIONS */}
                <div style={s.actions}>
                  <button
                    style={s.deleteBtn}
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
      )}
    </div>
  );
};

const s = {
  wrap: {
    padding: "25px",
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #1a120b, #0f0a06)",
    color: "#fff"
  },

  title: {
    textAlign: "center",
    color: "#d4af63",
    marginBottom: "25px",
    fontSize: "26px",
    letterSpacing: "1px"
  },

  loading: { textAlign: "center", color: "#ccc" },

  emptyBox: {
    textAlign: "center",
    marginTop: "50px"
  },

  empty: {
    fontSize: "18px",
    color: "#aaa"
  },

  emptySub: {
    fontSize: "14px",
    color: "#777"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px"
  },

  card: {
    background: "#2c1f14",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(212,175,99,0.15)",
    transition: "transform 0.2s, box-shadow 0.2s"
  },

  mediaWrap: {
    borderBottom: "1px solid rgba(212,175,99,0.1)"
  },

  body: {
    padding: "15px"
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  name: {
    margin: "0",
    fontSize: "18px"
  },

  price: {
    color: "#d4af63",
    fontWeight: "bold",
    fontSize: "16px",
    margin: "8px 0"
  },

  meta: {
    fontSize: "13px",
    color: "#ccc",
    margin: "3px 0"
  },

  status: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    color: "#fff"
  },

  actions: {
    marginTop: "12px",
    display: "flex",
    justifyContent: "flex-end"
  },

  deleteBtn: {
    padding: "6px 12px",
    background: "#c62828",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px"
  }
};

export default MyAnimals;