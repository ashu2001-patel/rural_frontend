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

  const badge =
    tool.listingType === "buy"
      ? { label: "For Sale", color: "#d4af63" }
      : tool.listingType === "rent"
      ? { label: "For Rent", color: "#78b464" }
      : { label: "Buy & Rent", color: "#7a9fd4" };

  return (
    <div style={s.wrap}>
      {/* BACK BUTTON */}
      <button style={s.backBtn} onClick={() => navigate("/tools")}>
        ← Back
      </button>

      <div style={s.container}>
        {/* GRID */}
        <div style={s.grid}>
          
          {/* LEFT - MEDIA */}
          <div style={s.mediaCol}>
            <MediaViewer images={tool.images} videos={tool.videos} />
          </div>

          {/* RIGHT - INFO */}
          <div style={s.infoCol}>
            <div style={s.card}>
              
              {/* TITLE */}
              <div style={s.titleRow}>
                <h1 style={s.title}>{tool.name}</h1>
                <span style={{ ...s.badge, borderColor: badge.color, color: badge.color }}>
                  {badge.label}
                </span>
              </div>

              <p style={s.category}>{tool.category}</p>

              {/* PRICE */}
              <div style={s.priceBox}>
                {tool.buyPrice && (
                  <div style={s.priceRow}>
                    <span>Buy</span>
                    <b>₹{tool.buyPrice}</b>
                  </div>
                )}
                {tool.rentPrice && (
                  <div style={s.priceRow}>
                    <span>Rent</span>
                    <b style={{ color: "#78b464" }}>
                      ₹{tool.rentPrice}/{tool.rentUnit}
                    </b>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div style={s.infoBox}>
                <p>📍 {tool.location}</p>
                <p>📞 {tool.contact}</p>
                <p>📅 {new Date(tool.createdAt).toLocaleDateString()}</p>
              </div>

              {/* TRANSLATION */}
              {tool.description && <TranslateBox text={tool.description} />}

              {/* DESKTOP CTA */}
              <div style={s.ctaRow}>
                <a href={`tel:${tool.contact}`} style={s.callBtn}>
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/${tool.contact}`}
                  target="_blank"
                  rel="noreferrer"
                  style={s.whatsappBtn}
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE FIXED CTA */}
        <div style={s.mobileCta}>
          <a href={`tel:${tool.contact}`} style={s.mobileCall}>
            Call
          </a>
          <a
            href={`https://wa.me/${tool.contact}`}
            target="_blank"
            rel="noreferrer"
            style={s.mobileWhats}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;

/* ---------------- STYLES ---------------- */
const s = {
  wrap: {
    minHeight: "100vh",
    background: "#1a120b",
    padding: "1rem",
    color: "#fff"
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto"
  },

  backBtn: {
    background: "transparent",
    border: "1px solid rgba(212,175,99,0.3)",
    color: "#d4af63",
    padding: "8px 14px",
    borderRadius: "6px",
    marginBottom: "10px",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },

  mediaCol: {
    position: "sticky",
    top: "80px"
  },

  infoCol: {},

  card: {
    background: "rgba(44,31,20,0.85)",
    border: "1px solid rgba(212,175,99,0.15)",
    borderRadius: "12px",
    padding: "16px"
  },

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: {
    fontSize: "1.5rem",
    color: "#f0e6d0"
  },

  badge: {
    padding: "4px 10px",
    border: "1px solid",
    borderRadius: "6px",
    fontSize: "12px"
  },

  category: {
    color: "#d4af63",
    marginTop: "6px"
  },

  priceBox: {
    marginTop: "12px",
    background: "rgba(212,175,99,0.05)",
    padding: "10px",
    borderRadius: "8px"
  },

  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    margin: "5px 0"
  },

  infoBox: {
    marginTop: "10px",
    color: "#ccc"
  },

  ctaRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },

  callBtn: {
    flex: 1,
    textAlign: "center",
    padding: "10px",
    background: "#8b5a2b",
    borderRadius: "8px",
    color: "#fff",
    textDecoration: "none"
  },

  whatsappBtn: {
    flex: 1,
    textAlign: "center",
    padding: "10px",
    background: "#2d5a2b",
    borderRadius: "8px",
    color: "#fff",
    textDecoration: "none"
  },

  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#d4af63"
  },

  /* MOBILE */
  mobileCta: {
    display: "none"
  },

  "@media (max-width: 768px)": {
    grid: {
      gridTemplateColumns: "1fr"
    },
    mediaCol: {
      position: "relative"
    },
    mobileCta: {
      display: "flex",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#1a120b",
      padding: "10px",
      gap: "10px"
    }
  }
};