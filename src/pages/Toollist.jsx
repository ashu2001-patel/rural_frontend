import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toolAPI } from "../api/axios";

const CATEGORIES = ["All", "Tractor", "Plough", "Water Pump", "Harvester", "Sprayer", "Other"];

const ToolList = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    name: "", location: "", category: "", listingType: "", minPrice: "", maxPrice: ""
  });
  const navigate = useNavigate();

  const fetchTools = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.location) params.location = filters.location;
      if (filters.category && filters.category !== "All") params.category = filters.category;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const res = await toolAPI.get("/tool", { params });
      setTools(res.data.tools || []);
    } catch (err) {
      console.error(err);
      setTools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTools(); }, []);

  const getListingBadge = (type) => {
    if (type === "buy") return { label: "For Sale", color: "#d4af63" };
    if (type === "rent") return { label: "For Rent", color: "#78b464" };
    return { label: "Buy & Rent", color: "#7a9fd4" };
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h2 style={s.title}>Tools & Equipment</h2>
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={{ color: "rgba(74,107,58,0.8)", fontSize: 14 }}>🔧</span>
          <div style={s.dividerLine} />
        </div>
        <p style={s.subtitle}>Buy or rent agricultural tools from rural communities</p>
      </div>

      {/* Category Pills */}
      <div style={s.categoryRow}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            style={{ ...s.catPill, ...(filters.category === cat || (cat === "All" && !filters.category) ? s.catPillActive : {}) }}
            onClick={() => setFilters({ ...filters, category: cat === "All" ? "" : cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div style={s.filtersRow}>
        <input style={s.input} placeholder="Search by name" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input style={s.input} placeholder="Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />

        {/* Listing Type Toggle */}
        <div style={s.typeToggle}>
          {["", "buy", "rent"].map(type => (
            <button
              key={type}
              style={{ ...s.typeBtn, ...(filters.listingType === type ? s.typeBtnActive : {}) }}
              onClick={() => setFilters({ ...filters, listingType: type })}
            >
              {type === "" ? "All" : type === "buy" ? "🛒 Buy" : "🔑 Rent"}
            </button>
          ))}
        </div>

        <input style={s.input} type="number" placeholder="Min Price (₹)" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
        <input style={s.input} type="number" placeholder="Max Price (₹)" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
        <button style={s.searchBtn} onClick={fetchTools}>Search</button>

        {/* View Toggle */}
        <div style={s.viewToggle}>
          <button style={{ ...s.viewBtn, ...(viewMode === "grid" ? s.viewBtnActive : {}) }} onClick={() => setViewMode("grid")}>⊞</button>
          <button style={{ ...s.viewBtn, ...(viewMode === "list" ? s.viewBtnActive : {}) }} onClick={() => setViewMode("list")}>☰</button>
        </div>
      </div>

      {/* Tools Grid/List */}
      {loading ? (
        <p style={s.loading}>Loading...</p>
      ) : tools.length === 0 ? (
        <p style={s.empty}>No tools found</p>
      ) : (
        <div style={viewMode === "grid" ? s.grid : s.list}>
          {tools.map(tool => {
            const badge = getListingBadge(tool.listingType);
            return viewMode === "grid" ? (
              <div key={tool._id} style={s.card} onClick={() => navigate(`/tool/${tool._id}`)}>
                <div style={s.cardTopLine} />
                <img
                  src={tool.images?.[0] || "https://via.placeholder.com/400x170?text=No+Image"}
                  alt={tool.name}
                  style={s.img}
                />
                <div style={{ ...s.badge, color: badge.color, borderColor: badge.color }}>
                  {badge.label}
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardTitleRow}>
                    <h3 style={s.toolName}>{tool.name}</h3>
                    <span style={s.category}>{tool.category}</span>
                  </div>
                  {tool.buyPrice && <p style={s.price}>🛒 ₹{tool.buyPrice?.toLocaleString()}</p>}
                  {tool.rentPrice && <p style={s.rentPrice}>🔑 ₹{tool.rentPrice}/{tool.rentUnit}</p>}
                  <p style={s.meta}>📍 {tool.location}</p>
                  <p style={s.meta}>📞 {tool.contact}</p>
                  <div style={s.cardFooter}>
                    <span style={{ ...s.conditionTag, ...(tool.condition === "New" ? s.conditionNew : tool.condition === "Good" ? s.conditionGood : s.conditionFair) }}>
                      {tool.condition}
                    </span>
                    <span style={s.viewBtn2}>View details →</span>
                  </div>
                </div>
              </div>
            ) : (
              // List View
              <div key={tool._id} style={s.listCard} onClick={() => navigate(`/tool/${tool._id}`)}>
                <img
                  src={tool.images?.[0] || "https://via.placeholder.com/120x90?text=No+Image"}
                  alt={tool.name}
                  style={s.listImg}
                />
                <div style={s.listBody}>
                  <div style={s.listTitleRow}>
                    <h3 style={s.toolName}>{tool.name}</h3>
                    <span style={{ ...s.badge, color: badge.color, borderColor: badge.color }}>{badge.label}</span>
                  </div>
                  <span style={s.category}>{tool.category}</span>
                  <div style={s.listPriceRow}>
                    {tool.buyPrice && <p style={s.price}>🛒 ₹{tool.buyPrice?.toLocaleString()}</p>}
                    {tool.rentPrice && <p style={s.rentPrice}>🔑 ₹{tool.rentPrice}/{tool.rentUnit}</p>}
                  </div>
                  <p style={s.meta}>📍 {tool.location} &nbsp;|&nbsp; 📞 {tool.contact}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const s = {
  wrap: { minHeight: "100vh", background: "#1a120b", fontFamily: "'Crimson Pro', Georgia, serif", padding: "2.5rem 2rem" },
  header: { textAlign: "center", marginBottom: "2rem" },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#d4af63", margin: "0 0 4px" },
  divider: { display: "flex", alignItems: "center", gap: "12px", maxWidth: "300px", margin: "1rem auto" },
  dividerLine: { flex: 1, height: "1px", background: "rgba(212,175,99,0.15)" },
  subtitle: { fontSize: "0.82rem", color: "rgba(212,175,99,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 },
  categoryRow: { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.5rem" },
  catPill: { padding: "5px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,99,0.15)", borderRadius: "20px", color: "rgba(240,230,208,0.5)", fontFamily: "'Crimson Pro', serif", fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s" },
  catPillActive: { background: "rgba(212,175,99,0.1)", borderColor: "rgba(212,175,99,0.4)", color: "#d4af63" },
  filtersRow: { display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem", maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" },
  input: { padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,99,0.15)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Crimson Pro', serif", fontSize: "0.88rem", outline: "none", minWidth: "140px" },
  typeToggle: { display: "flex", border: "1px solid rgba(212,175,99,0.15)", borderRadius: "3px", overflow: "hidden" },
  typeBtn: { padding: "8px 14px", background: "transparent", border: "none", color: "rgba(240,230,208,0.5)", fontFamily: "'Crimson Pro', serif", fontSize: "0.85rem", cursor: "pointer" },
  typeBtnActive: { background: "rgba(212,175,99,0.1)", color: "#d4af63" },
  searchBtn: { padding: "8px 20px", background: "linear-gradient(135deg, #8b5a2b, #6b4420)", border: "1px solid rgba(212,175,99,0.25)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Crimson Pro', serif", fontSize: "0.88rem", cursor: "pointer" },
  viewToggle: { display: "flex", border: "1px solid rgba(212,175,99,0.15)", borderRadius: "3px", overflow: "hidden" },
  viewBtn: { padding: "8px 12px", background: "transparent", border: "none", color: "rgba(240,230,208,0.4)", fontSize: "1rem", cursor: "pointer" },
  viewBtnActive: { background: "rgba(212,175,99,0.1)", color: "#d4af63" },
  loading: { textAlign: "center", padding: "4rem", color: "rgba(212,175,99,0.4)", fontFamily: "'Playfair Display', serif" },
  empty: { textAlign: "center", color: "rgba(212,175,99,0.3)", fontFamily: "'Playfair Display', serif", padding: "3rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px", maxWidth: "1200px", margin: "0 auto" },
  list: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "900px", margin: "0 auto" },
  card: { background: "rgba(30,20,12,0.85)", border: "1px solid rgba(212,175,99,0.12)", borderRadius: "4px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s, transform 0.2s", position: "relative" },
  cardTopLine: { position: "absolute", top: 0, left: "15%", right: "15%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,99,0.4), transparent)" },
  img: { width: "100%", height: "170px", objectFit: "cover", display: "block", opacity: 0.9, filter: "sepia(15%)" },
  badge: { position: "absolute", top: "12px", right: "12px", fontSize: "0.7rem", padding: "2px 8px", border: "1px solid", borderRadius: "2px", background: "rgba(26,18,11,0.85)", letterSpacing: "0.08em", textTransform: "uppercase" },
  cardBody: { padding: "14px 16px 16px" },
  cardTitleRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" },
  toolName: { fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#f0e6d0", margin: 0 },
  category: { fontSize: "0.7rem", padding: "2px 8px", background: "rgba(139,90,43,0.15)", border: "1px solid rgba(139,90,43,0.25)", borderRadius: "2px", color: "rgba(212,175,99,0.6)", letterSpacing: "0.08em" },
  price: { fontSize: "1rem", fontWeight: 600, color: "#d4af63", margin: "4px 0", fontFamily: "'Playfair Display', serif" },
  rentPrice: { fontSize: "0.95rem", color: "#78b464", margin: "4px 0" },
  meta: { fontSize: "0.82rem", color: "rgba(240,230,208,0.45)", margin: "4px 0" },
  cardFooter: { marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(212,175,99,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  conditionTag: { fontSize: "0.7rem", padding: "2px 8px", borderRadius: "2px", letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid" },
  conditionNew: { color: "rgba(120,180,100,0.8)", borderColor: "rgba(120,180,100,0.25)", background: "rgba(74,107,58,0.1)" },
  conditionGood: { color: "rgba(212,175,99,0.7)", borderColor: "rgba(212,175,99,0.2)", background: "rgba(212,175,99,0.05)" },
  conditionFair: { color: "rgba(200,140,80,0.7)", borderColor: "rgba(200,140,80,0.2)", background: "rgba(200,140,80,0.05)" },
  viewBtn2: { fontSize: "0.78rem", color: "rgba(212,175,99,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" },
  listCard: { background: "rgba(30,20,12,0.85)", border: "1px solid rgba(212,175,99,0.12)", borderRadius: "4px", display: "flex", gap: "16px", padding: "12px", cursor: "pointer", transition: "border-color 0.2s" },
  listImg: { width: "120px", height: "90px", objectFit: "cover", borderRadius: "3px", flexShrink: 0, filter: "sepia(15%)" },
  listBody: { flex: 1 },
  listTitleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  listPriceRow: { display: "flex", gap: "16px", margin: "6px 0" },
};

export default ToolList;