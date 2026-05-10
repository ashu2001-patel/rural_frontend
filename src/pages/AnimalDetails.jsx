import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MediaViewer from "../components/MediaViewer";
import RevealContact from "../components/revealcontact";

const AnimalDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const { t, i18n } = useTranslation();

  const [animal, setAnimal]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animalAPI.get(`/animal/${id}`)
      .then(res => setAnimal(res.data.animal || res.data))
      .catch(() => setAnimal(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Loading ── */
  if (loading) return (
    <div className="ad-state">
      <style>{STYLES}</style>
      <div className="ad-spinner" />
      <p className="ad-state-text">{t("animalDetails.loading")}</p>
    </div>
  );

  /* ── Not found ── */
  if (!animal) return (
    <div className="ad-state">
      <style>{STYLES}</style>
      <span style={{ fontSize: "2.5rem" }}>🐄</span>
      <h3 className="ad-state-title">{t("animalDetails.notFound")}</h3>
      <button className="ad-btn ad-btn--gold" onClick={() => navigate(-1)}>← {t("common.goBack")}</button>
    </div>
  );

  const isSold    = animal.status === "sold";
  const createdAt = animal.createdAt
    ? new Date(animal.createdAt).toLocaleDateString(i18n.language === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })
    : t("animalDetails.info.dateNA");

  return (
    <>
      <style>{STYLES}</style>
      <div className="ad-page">

        {/* ── Back ── */}
        <button className="ad-back" onClick={() => navigate(-1)}>{t("animalDetails.back")}</button>

        <div className="ad-grid">

          {/* ── LEFT — Media ── */}
          <div className="ad-media-col">
            <MediaViewer images={animal.images || []} videos={animal.videos || []} />
          </div>

          {/* ── RIGHT — Info ── */}
          <div className="ad-info-col">
            <div className="ad-card">

              {/* Title row */}
              <div className="ad-card-header">
                <div>
                  {animal.category && <span className="ad-category-tag">{animal.category}</span>}
                  <h1 className="ad-name">{animal.name}</h1>
                </div>
                <span className={`ad-status-badge ${isSold ? "ad-status-badge--sold" : "ad-status-badge--live"}`}>
                  {isSold ? t("animalDetails.statusSold") : t("animalDetails.statusLive")}
                </span>
              </div>

              {/* Price */}
              <p className="ad-price">₹{Number(animal.price || 0).toLocaleString()}</p>

              {/* Info grid */}
              <div className="ad-info-grid">
                <div className="ad-info-item">
                  <span className="ad-info-label">{t("animalDetails.info.location")}</span>
                  <strong className="ad-info-val">{animal.location || t("common.notSpecified")}</strong>
                </div>
                <div className="ad-info-item">
                  <span className="ad-info-label">{t("animalDetails.info.listedOn")}</span>
                  <strong className="ad-info-val">{createdAt}</strong>
                </div>
                <div className="ad-info-item">
                  <span className="ad-info-label">{t("animalDetails.info.category")}</span>
                  <strong className="ad-info-val">{animal.category || t("animalDetails.info.categoryDefault")}</strong>
                </div>
                <div className="ad-info-item ad-info-item--contact">
                  <span className="ad-info-label">{t("animalDetails.info.contact")}</span>
                  <RevealContact contact={animal.contact} />
                </div>
              </div>

              {/* Description (plain text — translation widget removed) */}
              {animal.description && (
                <div className="ad-desc-wrap">
                  <p className="ad-desc-label">{t("animalDetails.description.label")}</p>
                  <p className="ad-desc-text">{animal.description}</p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');

/* ── Base ── */
.ad-page { min-height:100vh; background:#0f0a05; font-family:'Poppins',sans-serif; padding:16px; }

/* ── Back ── */
.ad-back { background:none; border:none; color:rgba(212,175,99,.55); cursor:pointer; font-size:.84rem; padding:0 0 14px; font-family:'Poppins',sans-serif; display:block; }

/* ── Two-col grid ── */
.ad-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:1100px; margin:0 auto; }

/* ── Media col ── */
.ad-media-col { position:sticky; top:72px; align-self:start; }

/* ── Info card ── */
.ad-card {
  background:rgba(22,14,8,.92); border:1px solid rgba(212,175,99,.12);
  border-radius:16px; padding:20px;
}

/* ── Header ── */
.ad-card-header { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px; }
.ad-category-tag { font-size:.62rem; padding:2px 9px; background:rgba(212,175,99,.1); border:1px solid rgba(212,175,99,.22); border-radius:4px; color:rgba(212,175,99,.7); display:inline-block; margin-bottom:4px; }
.ad-name  { font-family:'Playfair Display',serif; font-size:1.5rem; color:#f0e6d0; margin:0; line-height:1.2; }
.ad-status-badge { font-size:.62rem; padding:4px 10px; border-radius:20px; white-space:nowrap; flex-shrink:0; font-weight:600; letter-spacing:.05em; }
.ad-status-badge--live { background:rgba(74,138,58,.2); border:1px solid rgba(74,138,58,.3); color:#7ecb63; }
.ad-status-badge--sold { background:rgba(180,60,60,.18); border:1px solid rgba(180,60,60,.3); color:#f08080; }

/* ── Price ── */
.ad-price { font-family:'Playfair Display',serif; font-size:1.8rem; color:#d4af63; font-weight:700; margin:8px 0 16px; }

/* ── Info grid ── */
.ad-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px; }
.ad-info-item { background:rgba(255,255,255,.03); border:1px solid rgba(212,175,99,.08); border-radius:10px; padding:12px; }
.ad-info-item--contact { grid-column:1 / -1; }
.ad-info-label { display:block; font-size:.72rem; color:rgba(212,175,99,.45); margin-bottom:5px; }
.ad-info-val   { font-size:.88rem; color:#f0e6d0; display:block; word-break:break-word; }

/* ── Description ── */
.ad-desc-wrap  { margin-bottom:4px; }
.ad-desc-label { font-size:.75rem; color:rgba(212,175,99,.45); margin-bottom:8px; letter-spacing:.05em; }
.ad-desc-text  {
  color:#f0e6d0; font-size:.95rem; line-height:1.7;
  margin:0; padding:14px 16px;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(212,175,99,.08);
  border-radius:10px;
  white-space:pre-wrap;
}

/* ── State / loading ── */
.ad-state { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:12px; font-family:'Poppins',sans-serif; background:#0f0a05; }
.ad-spinner { width:36px; height:36px; border:2px solid rgba(212,175,99,.15); border-top:2px solid #d4af63; border-radius:50%; animation:ad-spin .8s linear infinite; }
.ad-state-text  { color:rgba(212,175,99,.4); font-size:.85rem; }
.ad-state-title { font-family:'Playfair Display',serif; color:rgba(212,175,99,.45); font-size:1.2rem; }
.ad-btn         { padding:10px 20px; border-radius:8px; border:none; cursor:pointer; font-family:'Poppins',sans-serif; }
.ad-btn--gold   { background:linear-gradient(135deg,#d4af63,#8b5a2b); color:#1a0f05; font-weight:600; }
@keyframes ad-spin { to { transform:rotate(360deg); } }

/* ── Tablet ── */
@media (max-width:900px) {
  .ad-grid { grid-template-columns:1fr; }
  .ad-media-col { position:static; }
}

/* ── Mobile ── */
@media (max-width:640px) {
  .ad-page  { padding:12px; }
  .ad-price { font-size:1.4rem; }
  .ad-name  { font-size:1.3rem; }
  .ad-info-grid { grid-template-columns:1fr 1fr; }
}
@media (max-width:380px) {
  .ad-info-grid { grid-template-columns:1fr; }
  .ad-info-item--contact { grid-column:auto; }
}
`;

export default AnimalDetail;
