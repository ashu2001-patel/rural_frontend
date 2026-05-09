import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MediaViewer from "../components/MediaViewer";
import TranslateBox from "../components/TranslateBox";
import RevealContact from "../components/revealcontact";
import "./AnimalPages.css";

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request To Buy State
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  const [requestForm, setRequestForm] = useState({
    buyerName: "",
    buyerContact: "",
    message: ""
  });

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const res = await animalAPI.get(`/animal/${id}`);
        setAnimal(res.data.animal || res.data);
      } catch (error) {
        console.error("Fetch animal failed:", error);
        setAnimal(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  const handleRequest = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    setRequestLoading(true);

    try {
      await animalAPI.post(
        `/request/animal/${id}/request`,
        requestForm
      );

      setRequestSent(true);
      setShowRequestForm(false);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to send request"
      );
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animal-state">
        <div className="animal-loader"/>
        <p>Loading animal details...</p>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="animal-state animal-state--empty">
        <h3>Animal not found</h3>

        <button
          className="animal-btn animal-btn--primary"
          onClick={() => navigate("/")}
        >
          Back To Listings
        </button>
      </div>
    );
  }

  const createdAt = animal.createdAt
    ? new Date(animal.createdAt).toLocaleDateString()
    : "N/A";

  const isOwner =
    user &&
    (
      animal.employerId === user.id ||
      animal.employerId === user._id
    );

  return (
    <div className="animal-detail">

      <button
        className="animal-back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="animal-detail__grid">

        {/* LEFT */}
        <div className="animal-detail__media">
          <MediaViewer
            images={animal.images || []}
            videos={animal.videos || []}
          />
        </div>

        {/* RIGHT */}
        <div className="animal-detail__content">
          <div className="animal-detail__card">

            {/* Header */}
            <div className="animal-detail__header">
              <div>
                <span className="animal-detail__tag">
                  Animal Details
                </span>

                <h1 className="animal-detail__title">
                  {animal.name}
                </h1>
              </div>

              <span className="animal-detail__status">
                {animal.status === "sold"
                  ? "❌ Sold"
                  : "🟢 Available"}
              </span>
            </div>

            {/* Price */}
            <div className="animal-detail__price">
              ₹{Number(animal.price || 0).toLocaleString()}
            </div>

            {/* Info */}
            <div className="animal-detail__info-grid">

              <div className="animal-info">
                <span>📍 Location</span>
                <strong>
                  {animal.location || "Not added"}
                </strong>
              </div>

              <div className="animal-info">
                <span>📞 Contact</span>

                {/* REVEAL CONTACT HERE */}
                <RevealContact
                  contact={animal.contact}
                  animalId={animal._id}
                />
              </div>

              <div className="animal-info">
                <span>📅 Listed</span>
                <strong>{createdAt}</strong>
              </div>

              <div className="animal-info">
                <span>🧾 Type</span>
                <strong>
                  {animal.category || "Animal"}
                </strong>
              </div>

            </div>

            {/* Description */}
            {animal.description && (
              <div className="animal-detail__description">
                <TranslateBox
                  text={animal.description}
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="animal-detail__actions">

              {animal.contact && (
                <>
                  <a
                    href={`tel:${animal.contact}`}
                    className="animal-action animal-action--call"
                  >
                    📞 Call Seller
                  </a>

                  <a
                    href={`https://wa.me/${animal.contact}`}
                    target="_blank"
                    rel="noreferrer"
                    className="animal-action animal-action--whatsapp"
                  >
                    💬 WhatsApp
                  </a>
                </>
              )}

            </div>

            {/* Request To Buy */}
            {!isOwner && animal.status !== "sold" && (
              <div style={{ marginTop: 18 }}>

                {requestSent ? (
                  <div
                    style={{
                      padding:"12px",
                      background:"rgba(74,107,58,.15)",
                      borderRadius:"10px",
                      textAlign:"center"
                    }}
                  >
                    ✅ Request Sent Successfully
                  </div>

                ) : !showRequestForm ? (

                  <button
                    onClick={() =>
                      setShowRequestForm(true)
                    }
                    style={primaryBtn}
                  >
                    🤝 Request To Buy
                  </button>

                ) : (

                  <form
                    onSubmit={handleRequest}
                    style={formStyle}
                  >

                    <input
                      required
                      placeholder="Your Name"
                      value={requestForm.buyerName}
                      onChange={(e)=>
                        setRequestForm({
                          ...requestForm,
                          buyerName:e.target.value
                        })
                      }
                      style={inputStyle}
                    />

                    <input
                      required
                      placeholder="Contact Number"
                      value={requestForm.buyerContact}
                      onChange={(e)=>
                        setRequestForm({
                          ...requestForm,
                          buyerContact:e.target.value
                        })
                      }
                      style={inputStyle}
                    />

                    <textarea
                      placeholder="Message"
                      value={requestForm.message}
                      onChange={(e)=>
                        setRequestForm({
                          ...requestForm,
                          message:e.target.value
                        })
                      }
                      style={{
                        ...inputStyle,
                        height:"80px"
                      }}
                    />

                    <div
                      style={{
                        display:"flex",
                        gap:10
                      }}
                    >
                      <button
                        disabled={requestLoading}
                        style={primaryBtn}
                      >
                        {requestLoading
                          ? "Sending..."
                          : "Send"}
                      </button>

                      <button
                        type="button"
                        style={secondaryBtn}
                        onClick={() =>
                          setShowRequestForm(false)
                        }
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

const formStyle={
 padding:"14px",
 marginTop:"12px",
 border:"1px solid rgba(255,255,255,.1)",
 borderRadius:"10px"
};

const inputStyle={
 width:"100%",
 padding:"10px",
 marginBottom:"10px",
 borderRadius:"6px"
};

const primaryBtn={
 flex:1,
 padding:"11px",
 background:"#4a8a28",
 color:"#fff",
 border:"none",
 borderRadius:"8px",
 cursor:"pointer"
};

const secondaryBtn={
 padding:"11px",
 border:"1px solid #ccc",
 background:"transparent",
 borderRadius:"8px",
 cursor:"pointer"
};

export default AnimalDetail;