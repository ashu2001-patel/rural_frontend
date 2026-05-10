import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { animalAPI } from "../api/axios";

const CATEGORIES = ["All", "Cow", "Buffalo", "Goat", "Sheep", "Pig", "Poultry", "Horse", "Camel"];
const CAT_ICONS  = { All:"🐄", Cow:"🐄", Buffalo:"🐃", Goat:"🐐", Sheep:"🐑", Pig:"🐷", Poultry:"🐓", Horse:"🐴", Camel:"🐪" };
const CAT_KEYS = { All: "all", Cow: "cow", Buffalo: "buffalo", Goat: "goat", Sheep: "sheep", Pig: "pig", Poultry: "poultry", Horse: "horse", Camel: "camel" };

const SKELETON_COUNT = 6;

const AnimalList = () => {
  const { t } = useTranslation();
  const [animals,  setAnimals]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [viewMode, setView]     = useState("grid");
  const [category, setCat]      = useState("All");
  const [sortBy,   setSort]     = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(
    () => JSON.parse(localStorage.getItem("wishlist") || "[]")
  );
  const [filters, setFilters] = useState({
    name: "", location: "", minPrice: "", maxPrice: "",
  });
  const navigate = useNavigate();

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name)     params.name     = filters.name;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const res  = await animalAPI.get("/animal/", { params });
      const data = res.data;
      setAnimals(Array.isArray(data) ? data : (data?.animals || []));
    } catch {
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnimals(); }, []);

  const toggleWishlist = (e, id) => {
    e.stopPropagation();
    const updated = wishlist.includes(id)
      ? wishlist.filter(w => w !== id)
      : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const filtered = useMemo(() => {
    let list = [...animals];
    if (category !== "All") {
      list = list.filter(a =>
        a.category?.toLowerCase() === category.toLowerCase() ||
        a.name?.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (sortBy === "price_asc")  list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "price_desc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === "latest")     list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [animals, category, sortBy]);

  const stats = useMemo(() => ({
    total:      animals.length,
    withImages: animals.filter(a => a.images?.length).length,
    withVideo:  animals.filter(a => a.videos?.length).length,
    states:     new Set(animals.map(a => a.location?.split(",").pop()?.trim()).filter(Boolean)).size,
  }), [animals]);

  return (
    <>
      <style>{STYLES}</style>
      <div className="al-page">

        {/* ── Hero ── */}
        <section className="al-hero">
          <span className="al-hero-tag">{t("animalList.heroTag")}</span>
          <h1 className="al-hero-title">{t("animalList.heroTitle")}</h1>
          <p className="al-hero-sub">{t("animalList.heroSub")}</p>
          <div className="al-stats">
            <div className="al-stat"><strong>{stats.total}</strong><span>{t("animalList.stats.listings")}</span></div>
            <div className="al-stat"><strong>{stats.withImages}</strong><span>{t("animalList.stats.withPhotos")}</span></div>
            <div className="al-stat"><strong>{stats.withVideo}</strong><span>{t("animalList.stats.withVideos")}</span></div>
            <div className="al-stat"><strong>{stats.states}</strong><span>{t("animalList.stats.states")}</span></div>
          </div>
        </section>

        {/* ── Category pills ── */}
        <div className="al-cats">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`al-cat ${category === cat ? "al-cat--active" : ""}`}
              onClick={() => setCat(cat)}
            >
              {CAT_ICONS[cat] || "🐾"} {t(`animalList.categories.${CAT_KEYS[cat]}`)}
            </button>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="al-toolbar">
          {/* Mobile: toggle filter panel */}
          <div className="al-toolbar-top">
            <button
              className="al-filter-toggle"
              onClick={() => setShowFilters(f => !f)}
            >
              {showFilters ? t("animalList.toolbar.hideFilters") : t("animalList.toolbar.showFilters")}
            </button>
            <select className="al-sort" value={sortBy} onChange={e => setSort(e.target.value)}>
              <option value="latest">{t("animalList.toolbar.sortLatest")}</option>
              <option value="price_asc">{t("animalList.toolbar.sortPriceAsc")}</option>
              <option value="price_desc">{t("animalList.toolbar.sortPriceDesc")}</option>
            </select>
            <div className="al-view-toggle">
              <button
                className={`al-view-btn ${viewMode === "grid" ? "al-view-btn--active" : ""}`}
                onClick={() => setView("grid")} aria-label={t("animalList.toolbar.viewGrid")}
              >⊞</button>
              <button
                className={`al-view-btn ${viewMode === "list" ? "al-view-btn--active" : ""}`}
                onClick={() => setView("list")} aria-label={t("animalList.toolbar.viewList")}
              >☰</button>
            </div>
          </div>

          {/* Filter inputs */}
          {showFilters && (
            <div className="al-filters">
              <input
                className="al-input" placeholder={t("animalList.filters.name")}
                value={filters.name}
                onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
              />
              <input
                className="al-input" placeholder={t("animalList.filters.location")}
                value={filters.location}
                onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
              />
              <input
                className="al-input al-input--narrow" type="number" placeholder={t("animalList.filters.minPrice")}
                value={filters.minPrice}
                onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
              />
              <input
                className="al-input al-input--narrow" type="number" placeholder={t("animalList.filters.maxPrice")}
                value={filters.maxPrice}
                onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
              />
              <button className="al-search-btn" onClick={fetchAnimals}>{t("animalList.toolbar.search")}</button>
              <button
                className="al-clear-btn"
                onClick={() => {
                  setFilters({ name: "", location: "", minPrice: "", maxPrice: "" });
                  setTimeout(fetchAnimals, 0);
                }}
              >{t("animalList.toolbar.clear")}</button>
            </div>
          )}
        </div>

        {/* ── Results ── */}
        {loading ? (
          <div className={viewMode === "grid" ? "al-grid" : "al-list"}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="al-skeleton" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="al-skel-img" />
                <div className="al-skel-body">
                  <div className="al-skel-line al-skel-line--wide" />
                  <div className="al-skel-line al-skel-line--mid"  />
                  <div className="al-skel-line al-skel-line--short" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="al-empty">
            <span className="al-empty-icon">🐄</span>
            <h3 className="al-empty-title">{t("animalList.empty.title")}</h3>
            <p className="al-empty-sub">{t("animalList.empty.sub")}</p>
          </div>
        ) : (
          <>
            <p className="al-count">{t("animalList.count", { count: filtered.length })}</p>

            <section className={viewMode === "grid" ? "al-grid" : "al-list"}>
              {filtered.map((animal, idx) =>
                viewMode === "grid"
                  ? <GridCard  key={animal._id} t={t} animal={animal} idx={idx} wishlist={wishlist} onWishlist={toggleWishlist} onView={() => navigate(`/animal/${animal._id}`)} />
                  : <ListCard  key={animal._id} t={t} animal={animal} idx={idx} wishlist={wishlist} onWishlist={toggleWishlist} onView={() => navigate(`/animal/${animal._id}`)} />
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
};

/* ── Grid Card ── */
const GridCard = ({ t, animal, idx, wishlist, onWishlist, onView }) => (
  <article className="al-card" style={{ animationDelay: `${idx * 0.05}s` }} onClick={onView}>
    <div className="al-card-media">
      <img
        src={animal.images?.[0] || `https://via.placeholder.com/400x175?text=${encodeURIComponent(animal.name)}`}
        alt={animal.name}
        className="al-card-img"
        onError={e => { e.currentTarget.src = "https://via.placeholder.com/400x175?text=No+Image"; }}
      />
      <div className="al-card-grad" />
      <div className="al-card-tags">
        {animal.category && <span className="al-card-tag">{animal.category}</span>}
        {animal.videos?.length
          ? <span className="al-card-tag">{t("animalList.card.video")}</span>
          : animal.images?.length
          ? <span className="al-card-tag">📷 {animal.images.length}</span>
          : null}
      </div>
      <button
        className={`al-wish ${wishlist.includes(animal._id) ? "al-wish--liked" : ""}`}
        onClick={e => onWishlist(e, animal._id)}
        aria-label={t("animalList.card.wishlist")}
      >
        {wishlist.includes(animal._id) ? "♥" : "♡"}
      </button>
    </div>
    <div className="al-card-body">
      <div className="al-card-top">
        <h3 className="al-card-title">{animal.name}</h3>
        <span className="al-badge">{animal.status === "sold" ? t("animalList.card.sold") : t("animalList.card.available")}</span>
      </div>
      <p className="al-price">₹{Number(animal.price || 0).toLocaleString()}</p>
      <p className="al-meta">📍 {animal.location || t("animalList.card.locationMissing")}</p>
      <div className="al-card-footer">
        <span className="al-photos">
          {t("animalList.card.photos", { count: animal.images?.length || 0 })}
          {animal.videos?.length ? ` · ${t("animalList.card.videoCount", { count: animal.videos.length })}` : ""}
        </span>
        <span className="al-view-link">{t("animalList.card.viewLink")}</span>
      </div>
    </div>
  </article>
);

/* ── List Card ── */
const ListCard = ({ t, animal, idx, wishlist, onWishlist, onView }) => (
  <article className="al-list-card" style={{ animationDelay: `${idx * 0.04}s` }} onClick={onView}>
    <img
      src={animal.images?.[0] || "https://via.placeholder.com/100x80?text=No+Image"}
      alt={animal.name}
      className="al-list-img"
      onError={e => { e.currentTarget.src = "https://via.placeholder.com/100x80?text=No+Image"; }}
    />
    <div className="al-list-body">
      <div className="al-list-top">
        <h3 className="al-card-title">{animal.name}</h3>
        <span className="al-badge">{animal.status === "sold" ? t("animalList.card.sold") : t("animalList.card.availableShort")}</span>
      </div>
      <div className="al-list-price-row">
        <p className="al-price" style={{ margin: 0 }}>₹{Number(animal.price || 0).toLocaleString()}</p>
        {animal.category && <span className="al-card-tag">{animal.category}</span>}
      </div>
      <p className="al-meta">📍 {animal.location || t("animalList.card.locationDash")}</p>
    </div>
    <button
      className={`al-wish al-wish--static ${wishlist.includes(animal._id) ? "al-wish--liked" : ""}`}
      onClick={e => onWishlist(e, animal._id)} aria-label={t("animalList.card.wishlist")}
    >
      {wishlist.includes(animal._id) ? "♥" : "♡"}
    </button>
  </article>
);

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');

/* ── Base ── */
.al-page { min-height:100vh; background:#0f0a05; font-family:'Poppins',sans-serif; }

/* ── Hero ── */
.al-hero { padding:2.5rem 1.5rem 1.8rem; text-align:center; background:linear-gradient(160deg,rgba(139,90,43,.18) 0%,transparent 65%); border-bottom:1px solid rgba(212,175,99,.08); }
.al-hero-tag   { display:inline-flex; align-items:center; gap:6px; font-size:.67rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(212,175,99,.6); border:1px solid rgba(212,175,99,.18); border-radius:20px; padding:4px 14px; margin-bottom:1rem; }
.al-hero-title { font-family:'Playfair Display',serif; font-size:clamp(1.3rem,4vw,2rem); color:#f0e6d0; margin:0 0 .5rem; }
.al-hero-sub   { font-size:.8rem; color:rgba(240,230,208,.32); max-width:460px; margin:0 auto 1.2rem; line-height:1.7; }
.al-stats { display:flex; justify-content:center; gap:2rem; flex-wrap:wrap; }
.al-stat strong { display:block; font-family:'Playfair Display',serif; font-size:1.6rem; color:#d4af63; line-height:1; }
.al-stat span   { font-size:.62rem; color:rgba(212,175,99,.35); letter-spacing:.15em; text-transform:uppercase; }

/* ── Categories ── */
.al-cats { display:flex; gap:7px; padding:.7rem 1.2rem; overflow-x:auto; border-bottom:1px solid rgba(212,175,99,.07); scrollbar-width:none; }
.al-cats::-webkit-scrollbar { display:none; }
.al-cat { display:flex; align-items:center; gap:5px; padding:7px 14px; background:rgba(255,255,255,.03); border:1px solid rgba(212,175,99,.12); border-radius:20px; font-size:.77rem; color:rgba(230,216,181,.48); cursor:pointer; white-space:nowrap; transition:all .18s; flex-shrink:0; min-height:38px; }
.al-cat:hover     { color:rgba(212,175,99,.7); border-color:rgba(212,175,99,.25); }
.al-cat--active   { background:rgba(212,175,99,.1); border-color:rgba(212,175,99,.35); color:#d4af63; }

/* ── Toolbar ── */
.al-toolbar { padding:.8rem 1.2rem; background:rgba(10,6,2,.96); border-bottom:1px solid rgba(212,175,99,.07); position:sticky; top:64px; z-index:10; backdrop-filter:blur(12px); }
.al-toolbar-top { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.al-filter-toggle { padding:7px 14px; background:rgba(212,175,99,.08); border:1px solid rgba(212,175,99,.2); border-radius:8px; color:rgba(212,175,99,.7); cursor:pointer; font-size:.79rem; font-family:'Poppins',sans-serif; white-space:nowrap; min-height:36px; }
.al-sort   { padding:7px 10px; background:rgba(255,255,255,.04); border:1px solid rgba(212,175,99,.13); border-radius:8px; color:rgba(240,230,208,.6); font-family:'Poppins',sans-serif; font-size:.8rem; outline:none; cursor:pointer; min-height:36px; }
.al-sort option { background:#1a0f05; }
.al-view-toggle { display:flex; border:1px solid rgba(212,175,99,.13); border-radius:8px; overflow:hidden; margin-left:auto; }
.al-view-btn { padding:7px 11px; background:transparent; border:none; color:rgba(212,175,99,.35); cursor:pointer; font-size:.95rem; transition:all .18s; min-height:36px; min-width:36px; }
.al-view-btn--active { background:rgba(212,175,99,.1); color:#d4af63; }

/* Filters expanded */
.al-filters    { display:flex; flex-wrap:wrap; gap:8px; padding-top:.8rem; align-items:center; }
.al-input      { padding:7px 12px; background:rgba(255,255,255,.04); border:1px solid rgba(212,175,99,.13); border-radius:8px; color:#f0e6d0; font-family:'Poppins',sans-serif; font-size:.8rem; outline:none; min-width:110px; min-height:36px; transition:border-color .18s; }
.al-input:focus { border-color:rgba(212,175,99,.35); }
.al-input::placeholder { color:rgba(240,230,208,.18); }
.al-input--narrow { min-width:80px; max-width:90px; }
.al-search-btn { padding:7px 16px; background:linear-gradient(135deg,#d4af63,#8b5a2b); border:none; border-radius:8px; color:#1a0f05; font-weight:600; font-size:.8rem; cursor:pointer; min-height:36px; }
.al-clear-btn  { padding:7px 14px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; color:rgba(240,230,208,.4); font-size:.8rem; cursor:pointer; min-height:36px; }

/* ── Count ── */
.al-count { text-align:center; font-size:.73rem; color:rgba(212,175,99,.3); padding:.7rem; letter-spacing:.07em; }

/* ── Grid / List layout ── */
.al-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(255px,1fr)); gap:16px; padding:1.2rem; max-width:1300px; margin:0 auto; }
.al-list { display:flex; flex-direction:column; gap:10px; padding:1.2rem; max-width:860px; margin:0 auto; }

/* ── Grid card ── */
.al-card { background:rgba(20,13,7,.92); border:1px solid rgba(212,175,99,.1); border-radius:12px; overflow:hidden; cursor:pointer; transition:all .25s; position:relative; animation:al-fade .4s ease both; }
.al-card:hover { border-color:rgba(212,175,99,.28); transform:translateY(-5px); box-shadow:0 14px 32px rgba(0,0,0,.45); }
.al-card-media { position:relative; height:170px; overflow:hidden; }
.al-card-img   { width:100%; height:100%; object-fit:cover; transition:transform .4s; filter:sepia(8%); }
.al-card:hover .al-card-img { transform:scale(1.06); }
.al-card-grad  { position:absolute; bottom:0; left:0; right:0; height:55px; background:linear-gradient(to top,rgba(10,6,2,.85),transparent); pointer-events:none; }
.al-card-tags  { position:absolute; top:9px; left:9px; display:flex; gap:4px; flex-wrap:wrap; }
.al-card-tag   { font-size:.58rem; padding:2px 7px; border-radius:4px; background:rgba(0,0,0,.55); color:rgba(212,175,99,.75); }
.al-wish       { position:absolute; top:9px; right:9px; width:30px; height:30px; border-radius:50%; background:rgba(0,0,0,.5); border:1px solid rgba(212,175,99,.2); display:flex; align-items:center; justify-content:center; font-size:13px; cursor:pointer; transition:all .18s; }
.al-wish:hover   { background:rgba(212,175,99,.15); }
.al-wish--liked  { border-color:rgba(220,80,80,.4); background:rgba(220,80,80,.12); }
.al-wish--static { position:static; flex-shrink:0; }

.al-card-body  { padding:12px 13px 14px; }
.al-card-top   { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; gap:6px; }
.al-card-title { font-family:'Playfair Display',serif; font-size:.98rem; color:#f0e6d0; font-weight:700; margin:0; }
.al-badge      { font-size:.56rem; padding:2px 7px; background:rgba(74,107,58,.15); border:1px solid rgba(74,107,58,.28); border-radius:4px; color:rgba(120,180,100,.75); letter-spacing:.07em; text-transform:uppercase; flex-shrink:0; }
.al-price      { font-family:'Playfair Display',serif; font-size:1.05rem; color:#d4af63; font-weight:700; margin:4px 0; }
.al-meta       { font-size:.74rem; color:rgba(240,230,208,.36); margin:2px 0; }
.al-card-footer { display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding-top:7px; border-top:1px solid rgba(212,175,99,.07); }
.al-photos     { font-size:.64rem; color:rgba(212,175,99,.28); letter-spacing:.04em; }
.al-view-link  { font-size:.68rem; color:rgba(212,175,99,.5); letter-spacing:.1em; text-transform:uppercase; }

/* ── List card ── */
.al-list-card { background:rgba(20,13,7,.92); border:1px solid rgba(212,175,99,.1); border-radius:10px; display:flex; gap:12px; padding:12px; cursor:pointer; transition:all .18s; animation:al-fade .4s ease both; align-items:center; }
.al-list-card:hover { border-color:rgba(212,175,99,.25); transform:translateX(4px); }
.al-list-img  { width:95px; height:75px; object-fit:cover; border-radius:8px; flex-shrink:0; filter:sepia(8%); }
.al-list-body { flex:1; min-width:0; }
.al-list-top  { display:flex; justify-content:space-between; align-items:center; margin-bottom:3px; gap:6px; }
.al-list-price-row { display:flex; gap:10px; align-items:center; margin:2px 0 4px; flex-wrap:wrap; }

/* ── Skeleton loading ── */
.al-skeleton { background:rgba(20,13,7,.92); border:1px solid rgba(212,175,99,.07); border-radius:12px; overflow:hidden; animation:al-fade .4s ease both; }
.al-skel-img  { height:170px; background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.07) 50%,rgba(255,255,255,.03) 75%); background-size:200% 100%; animation:al-shimmer 1.5s infinite; }
.al-skel-body { padding:12px; }
.al-skel-line { height:10px; border-radius:4px; margin-bottom:8px; background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.07) 50%,rgba(255,255,255,.03) 75%); background-size:200% 100%; animation:al-shimmer 1.5s infinite; }
.al-skel-line--wide  { width:75%; }
.al-skel-line--mid   { width:50%; }
.al-skel-line--short { width:35%; }

/* ── Empty ── */
.al-empty       { text-align:center; padding:5rem 2rem; }
.al-empty-icon  { font-size:2.5rem; display:block; margin-bottom:12px; }
.al-empty-title { font-family:'Playfair Display',serif; color:rgba(212,175,99,.4); margin-bottom:6px; }
.al-empty-sub   { color:rgba(240,230,208,.22); font-size:.82rem; }

/* ── Animations ── */
@keyframes al-fade    { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes al-shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }

/* ── Responsive ── */
@media (max-width:768px) {
  .al-toolbar     { position:static; }
  .al-toolbar-top { gap:6px; }
  .al-grid  { grid-template-columns:1fr 1fr; gap:10px; padding:.9rem; }
  .al-stats { gap:1.2rem; }
}
@media (max-width:500px) {
  .al-hero  { padding:1.8rem 1rem 1.4rem; }
  .al-grid  { grid-template-columns:1fr 1fr; gap:8px; padding:.7rem; }
  .al-card-media { height:140px; }
  .al-skel-img { height:140px; }
  .al-list-img { width:80px; height:65px; }
}
@media (max-width:360px) {
  .al-grid { grid-template-columns:1fr; }
}
`;

export default AnimalList;
