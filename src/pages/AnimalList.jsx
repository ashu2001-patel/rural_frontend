import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    minPrice: "",
    maxPrice: ""
  });

  // 🔥 Media Viewer State
  const [viewer, setViewer] = useState({
    open: false,
    media: [],
    index: 0
  });

  const navigate = useNavigate();

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await animalAPI.get("/animal", { params });
      setAnimals(res.data.animals || []);
    } catch (err) {
      console.error(err);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  // 🔥 Viewer Functions
  const openViewer = (animal, index = 0) => {
    const media = [...(animal.images || []), ...(animal.videos || [])];
    setViewer({ open: true, media, index });
  };

  const closeViewer = () => {
    setViewer({ ...viewer, open: false });
  };

  const nextMedia = () => {
    setViewer(v => ({
      ...v,
      index: (v.index + 1) % v.media.length
    }));
  };

  const prevMedia = () => {
    setViewer(v => ({
      ...v,
      index: (v.index - 1 + v.media.length) % v.media.length
    }));
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h2 style={s.title}>Animals for Sale</h2>
        <p style={s.subtitle}>Find livestock from rural communities</p>
      </div>

      <div style={s.filters}>
        <input style={s.input} placeholder="Search by name" value={filters.name}
          onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input style={s.input} placeholder="Location" value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })} />
        <input style={s.input} type="number" placeholder="Min Price"
          value={filters.minPrice}
          onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
        <input style={s.input} type="number" placeholder="Max Price"
          value={filters.maxPrice}
          onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />

        <button style={s.searchBtn} onClick={fetchAnimals}>Search</button>
      </div>

      {loading ? (
        <p style={s.loading}>Loading...</p>
      ) : (
        <div style={s.grid}>
          {animals.length === 0 ? (
            <p style={s.empty}>No animals found</p>
          ) : (
            animals.map(animal => (
              <div key={animal._id} style={s.card}
                onClick={() => navigate(`/animal/${animal._id}`)}>

                {/* 🔥 CLICKABLE IMAGE */}
                <img
                  src={animal.images?.[0] || "https://via.placeholder.com/400x170"}
                  alt={animal.name}
                  style={s.img}
                  onClick={(e) => {
                    e.stopPropagation();
                    openViewer(animal, 0);
                  }}
                />

                <div style={s.cardBody}>
                  <h3 style={s.animalName}>{animal.name}</h3>
                  <p style={s.price}>₹{animal.price}</p>
                  <p style={s.meta}>📍 {animal.location}</p>
                  <p style={s.meta}>📞 {animal.contact}</p>

                  <div style={s.cardFooter}>
                    <span style={s.tag}>Available</span>
                    <span style={s.viewBtn}>View details →</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 🔥 MEDIA VIEWER */}
      {viewer.open && (
        <div style={s.viewer}>
          <button style={s.closeBtn} onClick={closeViewer}>✖</button>

          <button style={s.navLeft} onClick={prevMedia}>◀</button>

          {viewer.media[viewer.index]?.includes(".mp4") ? (
            <video src={viewer.media[viewer.index]} controls style={s.viewerMedia} />
          ) : (
            <img src={viewer.media[viewer.index]} alt="" style={s.viewerMedia} />
          )}

          <button style={s.navRight} onClick={nextMedia}>▶</button>
        </div>
      )}
    </div>
  );
};

const s = {
  wrap: { padding: "20px", background: "#1a120b", color: "#fff" },
  header: { textAlign: "center", marginBottom: "20px" },
  title: { fontSize: "28px", color: "#d4af63" },
  subtitle: { color: "#ccc" },

  filters: { display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" },

  input: { padding: "8px", borderRadius: "5px" },
  searchBtn: { padding: "8px 15px", cursor: "pointer" },

  loading: { textAlign: "center" },
  empty: { textAlign: "center" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#2c1f14",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer"
  },

  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover"
  },

  cardBody: { padding: "10px" },
  animalName: { color: "#fff" },
  price: { color: "#d4af63" },
  meta: { fontSize: "14px", color: "#ccc" },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },

  tag: { color: "lightgreen" },
  viewBtn: { color: "#d4af63" },

  // 🔥 Viewer Styles
  viewer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  },

  viewerMedia: {
    maxWidth: "90%",
    maxHeight: "80%"
  },

  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    fontSize: "24px",
    color: "#fff",
    background: "none",
    border: "none",
    cursor: "pointer"
  },

  navLeft: {
    position: "absolute",
    left: "20px",
    fontSize: "30px",
    color: "#fff",
    background: "none",
    border: "none",
    cursor: "pointer"
  },

  navRight: {
    position: "absolute",
    right: "20px",
    fontSize: "30px",
    color: "#fff",
    background: "none",
    border: "none",
    cursor: "pointer"
  }
};

export default AnimalList;