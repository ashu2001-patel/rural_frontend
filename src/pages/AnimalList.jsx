import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";
import "./AnimalPages.css";

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    minPrice: "",
    maxPrice: "",
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

      const res = await animalAPI.get("/animal/", { params });
      const data = res.data;

      if (Array.isArray(data)) setAnimals(data);
      else setAnimals(data?.animals || []);
    } catch (err) {
      console.error("Error fetching animals:", err);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const stats = useMemo(() => {
    const total = animals.length;
    const withImages = animals.filter(a => a.images?.length).length;
    const withVideo = animals.filter(a => a.videos?.length).length;
    return { total, withImages, withVideo };
  }, [animals]);

  const openDetails = (id) => {
    navigate(`/animal/${id}`);
  };

  return (
    <div className="animal-page">
      <section className="animal-hero">
        <div className="animal-hero__content">
          <span className="animal-hero__tag">Livestock Marketplace</span>
          <h1 className="animal-hero__title">Find animals from trusted rural sellers</h1>
          <p className="animal-hero__subtitle">
            Browse animals with photos, videos, location, and price. Open any listing for full details and translation.
          </p>

          <div className="animal-hero__stats">
            <div className="animal-stat">
              <strong>{stats.total}</strong>
              <span>Listings</span>
            </div>
            <div className="animal-stat">
              <strong>{stats.withImages}</strong>
              <span>With Images</span>
            </div>
            <div className="animal-stat">
              <strong>{stats.withVideo}</strong>
              <span>With Videos</span>
            </div>
          </div>
        </div>
      </section>

      <section className="animal-toolbar">
        <div className="animal-filters">
          <input
            className="animal-input"
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <input
            className="animal-input"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <input
            className="animal-input"
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            className="animal-input"
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />

          <button className="animal-btn animal-btn--primary" onClick={fetchAnimals}>
            Search
          </button>
        </div>

        <div className="animal-view-toggle">
          <button
            className={viewMode === "grid" ? "animal-icon-btn active" : "animal-icon-btn"}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            ⊞
          </button>
          <button
            className={viewMode === "list" ? "animal-icon-btn active" : "animal-icon-btn"}
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            ☰
          </button>
        </div>
      </section>

      {loading ? (
        <div className="animal-state">
          <div className="animal-loader" />
          <p>Loading animals...</p>
        </div>
      ) : animals.length === 0 ? (
        <div className="animal-state animal-state--empty">
          <h3>No animals found</h3>
          <p>Try changing the filters or check back later for new listings.</p>
        </div>
      ) : (
        <section className={viewMode === "grid" ? "animal-grid" : "animal-list"}>
          {animals.map((animal) => {
            const hasMedia = animal.images?.length || animal.videos?.length;

            return viewMode === "grid" ? (
              <article
                key={animal._id}
                className="animal-card"
                onClick={() => openDetails(animal._id)}
              >
                <div className="animal-card__media">
                  <img
                    src={animal.images?.[0] || "https://via.placeholder.com/800x500?text=No+Image"}
                    alt={animal.name}
                    className="animal-card__img"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/800x500?text=No+Image";
                    }}
                  />
                  <div className="animal-card__overlay">
                    {animal.videos?.length ? <span>🎥 Video</span> : <span>📷 Photo</span>}
                  </div>
                </div>

                <div className="animal-card__body">
                  <div className="animal-card__top">
                    <h3 className="animal-card__title">{animal.name}</h3>
                    <span className="animal-card__badge">Available</span>
                  </div>

                  <p className="animal-card__price">₹{Number(animal.price || 0).toLocaleString()}</p>
                  <p className="animal-card__meta">📍 {animal.location || "Location not added"}</p>
                  <p className="animal-card__meta">📞 {animal.contact || "Contact not added"}</p>

                  <div className="animal-card__footer">
                    <span className="animal-card__hint">
                      {hasMedia ? "Media available" : "No media"}
                    </span>
                    <span className="animal-card__link">View details →</span>
                  </div>
                </div>
              </article>
            ) : (
              <article
                key={animal._id}
                className="animal-list-card"
                onClick={() => openDetails(animal._id)}
              >
                <img
                  src={animal.images?.[0] || "https://via.placeholder.com/220x160?text=No+Image"}
                  alt={animal.name}
                  className="animal-list-card__img"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/220x160?text=No+Image";
                  }}
                />

                <div className="animal-list-card__body">
                  <div className="animal-list-card__top">
                    <h3 className="animal-card__title">{animal.name}</h3>
                    <span className="animal-card__badge">Available</span>
                  </div>

                  <div className="animal-list-card__row">
                    <p className="animal-card__price">₹{Number(animal.price || 0).toLocaleString()}</p>
                    <span className="animal-card__hint">
                      {animal.videos?.length ? "Video included" : "Photo only"}
                    </span>
                  </div>

                  <p className="animal-card__meta">📍 {animal.location || "Location not added"}</p>
                  <p className="animal-card__meta">📞 {animal.contact || "Contact not added"}</p>

                  <span className="animal-card__link animal-card__link--mt">View details →</span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default AnimalList;