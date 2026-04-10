import { useState } from "react";

const MediaViewer = ({ images = [], videos = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeType, setActiveType] = useState(images.length > 0 ? "image" : "video");
  const [isLightbox, setIsLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);

  const allMedia = [
    ...images.map(url => ({ url, type: "image" })),
    ...videos.map(url => ({ url, type: "video" }))
  ];

  if (allMedia.length === 0) {
    return (
      <div style={s.noMedia}>
        <span style={{ fontSize: "3rem" }}>📷</span>
        <p style={{ color: "rgba(212,175,99,0.4)", marginTop: "8px" }}>No media available</p>
      </div>
    );
  }

  const current = allMedia[activeIndex];

  return (
    <div style={s.wrap}>
      {/* Main Viewer */}
      <div style={s.mainViewer} onClick={() => current.type === "image" && setIsLightbox(true)}>
        {current.type === "image" ? (
          <img src={current.url} alt="media" style={s.mainImg} />
        ) : (
          <video src={current.url} controls style={s.mainVideo} />
        )}
        {current.type === "image" && (
          <div style={s.zoomHint}>🔍 Click to enlarge</div>
        )}
      </div>

      {/* Thumbnails */}
      <div style={s.thumbnails}>
        {allMedia.map((media, i) => (
          <div
            key={i}
            style={{ ...s.thumb, ...(i === activeIndex ? s.thumbActive : {}) }}
            onClick={() => setActiveIndex(i)}
          >
            {media.type === "image" ? (
              <img src={media.url} alt={`thumb-${i}`} style={s.thumbImg} />
            ) : (
              <div style={s.videoThumb}>
                <span style={{ fontSize: "1.5rem" }}>▶️</span>
                <span style={s.videoLabel}>Video</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {allMedia.length > 1 && (
        <div style={s.navRow}>
          <button
            style={s.navBtn}
            onClick={() => setActiveIndex(i => (i - 1 + allMedia.length) % allMedia.length)}
          >
            ← Prev
          </button>
          <span style={s.counter}>{activeIndex + 1} / {allMedia.length}</span>
          <button
            style={s.navBtn}
            onClick={() => setActiveIndex(i => (i + 1) % allMedia.length)}
          >
            Next →
          </button>
        </div>
      )}

      {/* Lightbox */}
      {isLightbox && current.type === "image" && (
        <div style={s.lightboxOverlay} onClick={() => { setIsLightbox(false); setZoom(1); }}>
          <div style={s.lightboxContent} onClick={e => e.stopPropagation()}>
            <img
              src={current.url}
              alt="lightbox"
              style={{ ...s.lightboxImg, transform: `scale(${zoom})` }}
            />
            <div style={s.lightboxControls}>
              <button style={s.lightboxBtn} onClick={() => setZoom(z => Math.max(1, z - 0.5))}>➖ Zoom Out</button>
              <span style={s.zoomLevel}>{Math.round(zoom * 100)}%</span>
              <button style={s.lightboxBtn} onClick={() => setZoom(z => Math.min(3, z + 0.5))}>➕ Zoom In</button>
              <button style={{ ...s.lightboxBtn, marginLeft: "16px" }} onClick={() => { setIsLightbox(false); setZoom(1); }}>✕ Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  wrap: { width: "100%", fontFamily: "'Crimson Pro', Georgia, serif" },
  noMedia: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "250px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(212,175,99,0.2)", borderRadius: "4px" },
  mainViewer: { position: "relative", width: "100%", height: "320px", background: "rgba(0,0,0,0.3)", borderRadius: "4px", overflow: "hidden", cursor: "zoom-in", marginBottom: "10px" },
  mainImg: { width: "100%", height: "100%", objectFit: "contain" },
  mainVideo: { width: "100%", height: "100%", objectFit: "contain" },
  zoomHint: { position: "absolute", bottom: "10px", right: "10px", fontSize: "0.72rem", color: "rgba(212,175,99,0.5)", background: "rgba(0,0,0,0.5)", padding: "3px 8px", borderRadius: "2px", letterSpacing: "0.08em" },
  thumbnails: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" },
  thumb: { width: "70px", height: "55px", borderRadius: "3px", overflow: "hidden", cursor: "pointer", border: "1px solid rgba(212,175,99,0.1)", opacity: 0.6, transition: "all 0.2s" },
  thumbActive: { border: "1px solid rgba(212,175,99,0.5)", opacity: 1 },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  videoThumb: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" },
  videoLabel: { fontSize: "0.6rem", color: "rgba(212,175,99,0.6)", marginTop: "2px" },
  navRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" },
  navBtn: { padding: "6px 14px", background: "rgba(212,175,99,0.08)", border: "1px solid rgba(212,175,99,0.2)", borderRadius: "3px", color: "#d4af63", fontFamily: "'Crimson Pro', serif", fontSize: "0.85rem", cursor: "pointer" },
  counter: { fontSize: "0.82rem", color: "rgba(212,175,99,0.5)" },
  lightboxOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" },
  lightboxContent: { display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", maxWidth: "90vw", maxHeight: "90vh" },
  lightboxImg: { maxWidth: "80vw", maxHeight: "75vh", objectFit: "contain", transition: "transform 0.2s", borderRadius: "4px" },
  lightboxControls: { display: "flex", alignItems: "center", gap: "10px" },
  lightboxBtn: { padding: "7px 14px", background: "rgba(212,175,99,0.1)", border: "1px solid rgba(212,175,99,0.25)", borderRadius: "3px", color: "#d4af63", fontFamily: "'Crimson Pro', serif", fontSize: "0.85rem", cursor: "pointer" },
  zoomLevel: { fontSize: "0.85rem", color: "rgba(212,175,99,0.6)", minWidth: "40px", textAlign: "center" }
};

export default MediaViewer;