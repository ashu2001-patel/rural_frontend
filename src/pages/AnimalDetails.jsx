import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MediaViewer from "../components/MediaViewer";
import TranslateBox from "../components/TranslateBox";
import "./AnimalPages.css";

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Request state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    buyerName: "",
    buyerContact: "",
    message: ""
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Fetch animal
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const res = await animalAPI.get(`/animal/${id}`);
        setAnimal(res.data.animal || res.data);
      } catch (err) {
        console.error("Error fetching animal:", err);
        setAnimal(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  // 🔥 Send request
  const handleRequest = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    setRequestLoading(true);
    try {
      await animalAPI.post(`/animal/${id}/request`, requestForm);
      setRequestSent(true);
      setShowRequestForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setRequestLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="animal-state">
        <div className="animal-loader" />
        <p>Loading animal details...</p>
      </div>
    );
  }

  // Not found
  if (!animal) {
    return (
      <div className="animal-state animal-state--empty">
        <h3>Animal not found</h3>
        <p>The listing may have been removed or the link is invalid.</p>
        <button
          className="animal-btn animal-btn--primary"
          onClick={() => navigate("/")}
        >
          Back to listings
        </button>
      </div>
    );
  }

  const createdAt = animal.createdAt
    ? new Date(animal.createdAt).toLocaleDateString()
    : "N/A";

  const isOwner = user && (animal.employerId === user.id || animal.employerId === user._id);

  return (
    <div className="animal-detail">
      <button className="animal-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="animal-detail__grid">
        {/* LEFT MEDIA */}
        <div className="animal-detail__media">
          <MediaViewer
            images={animal.images || []}
            videos={animal.videos || []}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="animal-detail__content">
          <div className="animal-detail__card">

            {/* HEADER */}
            <div className="animal-detail__header">
              <div>
                <span className="animal-detail__tag">Animal Details</span>
                <h1 className="animal-detail__title">{animal.name}</h1>
              </div>

              <span className="animal-detail__status">
                {animal.status === "sold" ? "❌ Sold" : "🟢 Available"}
              </span>
            </div>

            {/* PRICE */}
            <div className="animal-detail__price">
              ₹{Number(animal.price || 0).toLocaleString()}
            </div>

            {/* INFO GRID */}
            <div className="animal-detail__info-grid">
              <div className="animal-info">
                <span>📍 Location</span>
                <strong>{animal.location || "Not added"}</strong>
              </div>
              <div className="animal-info">
                <span>📞 Contact</span>
                <strong>{animal.contact || "Not added"}</strong>
              </div>
              <div className="animal-info">
                <span>📅 Listed</span>
                <strong>{createdAt}</strong>
              </div>
              <div className="animal-info">
                <span>🧾 Type</span>
                <strong>{animal.category || "Animal"}</strong>
              </div>
            </div>

            {/* DESCRIPTION */}
            {animal.description && (
              <div className="animal-detail__description">
                <TranslateBox text={animal.description} />
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="animal-detail__actions">
              {animal.contact && (
                <>
                  <a
                    className="animal-action animal-action--call"
                    href={`tel:${animal.contact}`}
                  >
                    📞 Call Seller
                  </a>

                  <a
                    className="animal-action animal-action--whatsapp"
                    href={`https://wa.me/${animal.contact}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    💬 WhatsApp
                  </a>
                </>
              )}
            </div>

            {/* 🔥 REQUEST TO BUY SECTION */}
            {!isOwner && animal.status !== "sold" && (
              <div style={{ marginTop: "16px" }}>

                {requestSent ? (
                  <div
                    style={{
                      padding: "12px",
                      background: "rgba(74,107,58,0.15)",
                      border: "1px solid rgba(74,107,58,0.3)",
                      borderRadius: "10px",
                      textAlign: "center",
                      color: "rgba(120,180,80,0.9)"
                    }}
                  >
                    ✅ Request sent! Seller will contact you soon.
                  </div>
                ) : !showRequestForm ? (
                  <button
                    onClick={() => setShowRequestForm(true)}
                    style={{
                      width: "100%",
                      padding: "13px",
                      background:
                        "linear-gradient(135deg, #4a8a28, #2d5a18)",
                      borderRadius: "10px",
                      color: "#e8f0e0",
                      fontWeight: "600",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}
                  >
                    🤝 Request to Buy
                  </button>
                ) : (
                  <form
                    onSubmit={handleRequest}
                    style={{
                      marginTop: "10px",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(120,180,80,0.2)"
                    }}
                  >
                    <input
                      placeholder="Your Name"
                      required
                      value={requestForm.buyerName}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          buyerName: e.target.value
                        })
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Your Contact"
                      required
                      value={requestForm.buyerContact}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          buyerContact: e.target.value
                        })
                      }
                      style={inputStyle}
                    />

                    <textarea
                      placeholder="Message (optional)"
                      value={requestForm.message}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          message: e.target.value
                        })
                      }
                      style={{ ...inputStyle, height: "70px" }}
                    />

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="submit"
                        disabled={requestLoading}
                        style={primaryBtn}
                      >
                        {requestLoading ? "Sending..." : "Send"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowRequestForm(false)}
                        style={secondaryBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

/* 🔥 STYLES */
const inputStyle = {
  width: "100%",
  padding: "9px",
  marginBottom: "8px",
  borderRadius: "6px",
  border: "1px solid rgba(212,175,99,0.2)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff"
};

const primaryBtn = {
  flex: 1,
  padding: "10px",
  background: "#4a8a28",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer"
};

const secondaryBtn = {
  padding: "10px",
  background: "transparent",
  border: "1px solid rgba(212,175,99,0.3)",
  borderRadius: "6px",
  color: "#ccc",
  cursor: "pointer"
};

export default AnimalDetail;