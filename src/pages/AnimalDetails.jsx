import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { animalAPI } from "../api/axios";
import MediaViewer from "../components/MediaViewer";
import TranslateBox from "../components/TranslateBox";
import "./AnimalPages.css";

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="animal-state">
        <div className="animal-loader" />
        <p>Loading animal details...</p>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="animal-state animal-state--empty">
        <h3>Animal not found</h3>
        <p>The listing may have been removed or the link is invalid.</p>
        <button className="animal-btn animal-btn--primary" onClick={() => navigate("/")}>
          Back to listings
        </button>
      </div>
    );
  }

  const createdAt = animal.createdAt ? new Date(animal.createdAt).toLocaleDateString() : "N/A";

  return (
    <div className="animal-detail">
      <button className="animal-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="animal-detail__grid">
        <div className="animal-detail__media">
          <MediaViewer images={animal.images || []} videos={animal.videos || []} />
        </div>

        <div className="animal-detail__content">
          <div className="animal-detail__card">
            <div className="animal-detail__header">
              <div>
                <span className="animal-detail__tag">Animal Details</span>
                <h1 className="animal-detail__title">{animal.name}</h1>
              </div>

              <span className="animal-detail__status">Available</span>
            </div>

            <div className="animal-detail__price">
              ₹{Number(animal.price || 0).toLocaleString()}
            </div>

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

            {animal.description && (
              <div className="animal-detail__description">
                <TranslateBox text={animal.description} />
              </div>
            )}

            <div className="animal-detail__actions">
              {animal.contact && (
                <>
                  <a className="animal-action animal-action--call" href={`tel:${animal.contact}`}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetail;