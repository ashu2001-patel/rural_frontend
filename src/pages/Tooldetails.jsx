import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toolAPI } from "../api/axios";
import MediaViewer from "../components/MediaViewer";
import TranslateBox from "../components/TranslateBox";

const ToolDetail = () => {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const res = await toolAPI.get(`/tool/${id}`);
        setTool(res.data.tool);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [id]);

  if (loading) return <p style={s.loading}>Loading...</p>;
  if (!tool) return <p style={s.loading}>Tool not found</p>;

  const getListingBadge = (type) => {
    if (type === "buy") return { label: "For Sale", color: "#d4af63" };
    if (type === "rent") return { label: "For Rent", color: "#78b464" };
    return { label: "Buy & Rent", color: "#7a9fd4" };
  };

  const badge = getListingBadge(tool.listingType);

  return (
    <div style={s.wrap}>
      <div style={s.bg} />
      <div style={s.container}>

        {/* Back Button */}
        <button style={s.backBtn} onClick={() => navigate("/tools")}>
          ← Back to Tools
        </button>

        <div style={s.grid}>
          {/* Left — Media */}
          <div style={s.leftCol}>
            <MediaViewer images={tool.images} videos={tool.videos} />
          </div>

          {/* Right — Details */}
          <div style={s.rightCol}>
            <div style={s.card}>
              <div style={s.topLine} />

              <div style={s.titleRow}>
                <h1 style={s.title}>{tool.name}</h1>
                <span style={{ ...s.badge, color: badge.color, borderColor: badge.color }}>
                  {badge.label}
                </span>
              </div>

              <div style={s.categoryRow}>
                <span style={s.category}>{tool.category}</span>
                <span style={{ ...s.condition,
                  color: tool.condition === "New" ? "#78b464" : tool.condition === "Good" ? "#d4af63" : "#e8917a"
                }}>
                  {tool.condition} condition
                </span>
              </div>

              {/* Pricing */}
              <div style={s.priceBox}>
                {tool.buyPrice && (
                  <div style={s.priceRow}>
                    <span style={s.priceLabel}>🛒 Buy Price</span>
                    <span style={s.priceValue}>₹{tool.buyPrice?.toLocaleString()}</span>
                  </div>
                )}
                {tool.rentPrice && (
                  <div style={s.priceRow}>
                    <span style={s.priceLabel}>🔑 Rent Price</span>
                    <span style={{ ...s.priceValue, color: "#78b464" }}>
                      ₹{tool.rentPrice} / {tool.rentUnit}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div style={s.infoBox}>
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>📍 Location</span>
                  <span style={s.infoValue}>{tool.location}</span>
                </div>
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>📞 Contact</span>
                  <span style={s.infoValue}>{tool.contact}</span>
                </div>
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>📅 Listed</span>
                  <span style={s.infoValue}>
                    {new Date(tool.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Description with Translation */}
              {tool.description && (
                <TranslateBox text={tool.description} />
              )}

              {/* CTA Buttons */}
              <div style={s.ctaRow}>
                <a href={`tel:${tool.contact}`} style={s.callBtn}>
                  📞 Call Seller
                </a>
                <a href={`https://wa.me/${tool.contact}`} target="_blank" rel="noreferrer" style={s.whatsappBtn}>
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  wrap: { minHeight: "100vh", background: "#1a120b", position: "relative", fontFamily: "'Crimson Pro', Georgia, serif", padding: "2rem" },
  bg: { position: "fixed", inset: 0, background: "radial-gradient(ellipse at 20% 80%, rgba(139,90,43,0.15) 0%, transparent 60%)", pointerEvents: "none" },
  container: { position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto" },
  backBtn: { padding: "8px 16px", background: "transparent", border: "1px solid rgba(212,175,99,0.2)", borderRadius: "3px", color: "rgba(212,175,99,0.6)", fontFamily: "'Crimson Pro', serif", fontSize: "0.88rem", cursor: "pointer", marginBottom: "1.5rem" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" },
  leftCol: { position: "sticky", top: "80px", height: "fit-content" },
  rightCol: {},
  card: { background: "rgba(28,18,10,0.9)", border: "1px solid rgba(212,175,99,0.15)", borderRadius: "4px", padding: "1.8rem", position: "relative" },
  topLine: { position: "absolute", top: 0, left: "10%", right: "10%", height: "2px", background: "linear-gradient(90deg, transparent, #d4af63, transparent)" },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#f0e6d0", margin: 0, flex: 1 },
  badge: { fontSize: "0.72rem", padding: "3px 10px", border: "1px solid", borderRadius: "2px", background: "rgba(26,18,11,0.85)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0, marginLeft: "10px" },
  categoryRow: { display: "flex", gap: "10px", marginBottom: "1.2rem" },
  category: { fontSize: "0.75rem", padding: "3px 10px", background: "rgba(139,90,43,0.15)", border: "1px solid rgba(139,90,43,0.25)", borderRadius: "2px", color: "rgba(212,175,99,0.7)", letterSpacing: "0.08em" },
  condition: { fontSize: "0.75rem", padding: "3px 10px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "2px", letterSpacing: "0.08em" },
  priceBox: { background: "rgba(212,175,99,0.04)", border: "1px solid rgba(212,175,99,0.1)", borderRadius: "3px", padding: "12px 16px", marginBottom: "1rem" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(212,175,99,0.06)" },
  priceLabel: { fontSize: "0.85rem", color: "rgba(240,230,208,0.5)" },
  priceValue: { fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#d4af63" },
  infoBox: { marginBottom: "1rem" },
  infoRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(212,175,99,0.06)" },
  infoLabel: { fontSize: "0.85rem", color: "rgba(240,230,208,0.4)" },
  infoValue: { fontSize: "0.9rem", color: "#f0e6d0" },
  ctaRow: { display: "flex", gap: "10px", marginTop: "1.5rem" },
  callBtn: { flex: 1, padding: "12px", background: "linear-gradient(135deg, #8b5a2b, #6b4420)", border: "1px solid rgba(212,175,99,0.25)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, textAlign: "center", textDecoration: "none", cursor: "pointer" },
  whatsappBtn: { flex: 1, padding: "12px", background: "linear-gradient(135deg, #2d5a2b, #1a3d18)", border: "1px solid rgba(74,107,58,0.4)", borderRadius: "3px", color: "#a8d48a", fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, textAlign: "center", textDecoration: "none" },
  loading: { textAlign: "center", padding: "4rem", color: "rgba(212,175,99,0.4)", fontFamily: "'Playfair Display', serif" }
};

export default ToolDetail;