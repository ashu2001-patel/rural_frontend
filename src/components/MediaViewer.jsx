import { useEffect, useMemo, useRef, useState } from "react";

const MediaViewer = ({ images = [], videos = [], title = "Media" }) => {
  const mediaList = useMemo(
    () => [
      ...images.map((url) => ({ url, type: "image" })),
      ...videos.map((url) => ({ url, type: "video" })),
    ],
    [images, videos]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const current = mediaList[activeIndex];

  useEffect(() => {
    if (activeIndex >= mediaList.length) {
      setActiveIndex(0);
    }
  }, [mediaList.length, activeIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!mediaList.length) return;

      if (isLightbox) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
        if (e.key === "+" || e.key === "=") zoomIn();
        if (e.key === "-" || e.key === "_") zoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightbox, mediaList.length, activeIndex, zoom]);

  const next = () => {
    if (!mediaList.length) return;
    setActiveIndex((i) => (i + 1) % mediaList.length);
    setZoom(1);
    setIsPlaying(false);
  };

  const prev = () => {
    if (!mediaList.length) return;
    setActiveIndex((i) => (i - 1 + mediaList.length) % mediaList.length);
    setZoom(1);
    setIsPlaying(false);
  };

  const openLightbox = () => {
    if (current?.type === "image") {
      setIsLightbox(true);
      setZoom(1);
    }
  };

  const closeLightbox = () => {
    setIsLightbox(false);
    setZoom(1);
  };

  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)));
  const resetZoom = () => setZoom(1);

  const handleTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current == null ||
      touchEndX.current == null ||
      !mediaList.length
    ) {
      return;
    }

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) next();
      else prev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  if (!mediaList.length) {
    return (
      <div className="mv-shell">
        <style>{styles}</style>
        <div className="mv-empty">
          <div className="mv-emptyIcon">📷</div>
          <div className="mv-emptyTitle">No media available</div>
          <div className="mv-emptySub">Images or videos will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mv-shell">
      <style>{styles}</style>

      <div className="mv-card">
        <div className="mv-topbar">
          <div>
            <div className="mv-title">{title}</div>
            <div className="mv-subtitle">
              {activeIndex + 1} of {mediaList.length}
            </div>
          </div>

          <div className="mv-badges">
            <span className="mv-badge">
              {current?.type === "video" ? "Video" : "Image"}
            </span>
            {current?.type === "video" && isPlaying && (
              <span className="mv-badge mv-badge--live">Playing</span>
            )}
          </div>
        </div>

        <div
          className="mv-main"
          onClick={openLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {current?.type === "image" ? (
            <>
              <img
                src={current.url}
                alt={`media-${activeIndex}`}
                className="mv-media mv-media--image"
                draggable="false"
              />
              <button
                type="button"
                className="mv-zoomHint"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox();
                }}
              >
                🔍 Tap to enlarge
              </button>
            </>
          ) : (
            <video
              src={current.url}
              className="mv-media mv-media--video"
              controls
              playsInline
              muted={isMuted}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {mediaList.length > 1 && (
            <>
              <button
                type="button"
                className="mv-nav mv-nav--left"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous media"
              >
                ‹
              </button>
              <button
                type="button"
                className="mv-nav mv-nav--right"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next media"
              >
                ›
              </button>
            </>
          )}
        </div>

        <div className="mv-controls">
          <div className="mv-counter">
            {activeIndex + 1}/{mediaList.length}
          </div>

          <div className="mv-controlGroup">
            <button
              type="button"
              className="mv-controlBtn"
              onClick={prev}
              disabled={mediaList.length < 2}
            >
              Prev
            </button>
            <button
              type="button"
              className="mv-controlBtn"
              onClick={next}
              disabled={mediaList.length < 2}
            >
              Next
            </button>

            {current?.type === "video" && (
              <button
                type="button"
                className="mv-controlBtn"
                onClick={() => setIsMuted((m) => !m)}
              >
                {isMuted ? "Unmute" : "Mute"}
              </button>
            )}

            {current?.type === "image" && (
              <button
                type="button"
                className="mv-controlBtn"
                onClick={openLightbox}
              >
                Fullscreen
              </button>
            )}
          </div>
        </div>

        <div className="mv-thumbs">
          {mediaList.map((media, i) => (
            <button
              key={`${media.type}-${i}`}
              type="button"
              className={`mv-thumb ${i === activeIndex ? "mv-thumb--active" : ""}`}
              onClick={() => {
                setActiveIndex(i);
                setZoom(1);
                setIsPlaying(false);
              }}
              aria-label={`Open ${media.type} ${i + 1}`}
            >
              {media.type === "image" ? (
                <img src={media.url} alt={`thumb-${i}`} className="mv-thumbImg" />
              ) : (
                <div className="mv-thumbVideo">
                  <span className="mv-thumbPlay">▶</span>
                  <span className="mv-thumbText">Video</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {isLightbox && current?.type === "image" && (
        <div
          className="mv-lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div className="mv-lightboxInner" onClick={(e) => e.stopPropagation()}>
            <div className="mv-lightboxTop">
              <div className="mv-lightboxTitle">Preview</div>
              <button type="button" className="mv-closeBtn" onClick={closeLightbox}>
                ✕
              </button>
            </div>

            <div className="mv-lightboxMediaWrap">
              <img
                src={current.url}
                alt="lightbox"
                className="mv-lightboxImg"
                style={{ transform: `scale(${zoom})` }}
                draggable="false"
              />
            </div>

            <div className="mv-lightboxControls">
              <button type="button" className="mv-controlBtn" onClick={zoomOut}>
                −
              </button>
              <button type="button" className="mv-controlBtn" onClick={resetZoom}>
                Reset
              </button>
              <button type="button" className="mv-controlBtn" onClick={zoomIn}>
                +
              </button>

              <div className="mv-zoomValue">{Math.round(zoom * 100)}%</div>

              <button type="button" className="mv-controlBtn" onClick={prev}>
                Prev
              </button>
              <button type="button" className="mv-controlBtn" onClick={next}>
                Next
              </button>
            </div>

            <div className="mv-lightboxHint">
              Swipe on mobile, use arrow keys on desktop
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = `
.mv-shell {
  width: 100%;
  font-family: 'Crimson Pro', Georgia, serif;
}

.mv-card {
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(40,28,18,0.98), rgba(22,15,9,0.98));
  border: 1px solid rgba(212,175,99,0.14);
  box-shadow: 0 18px 40px rgba(0,0,0,0.22);
}

.mv-topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 14px 10px;
}

.mv-title {
  font-size: 1rem;
  color: #f0e6d0;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.mv-subtitle {
  margin-top: 3px;
  font-size: 0.75rem;
  color: rgba(212,175,99,0.55);
}

.mv-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.mv-badge {
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 9px;
  border-radius: 999px;
  border: 1px solid rgba(212,175,99,0.2);
  background: rgba(212,175,99,0.06);
  color: #d4af63;
}

.mv-badge--live {
  color: #8ed18d;
  border-color: rgba(142,209,141,0.25);
  background: rgba(142,209,141,0.08);
}

.mv-main {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: rgba(0,0,0,0.32);
  overflow: hidden;
  touch-action: pan-y;
}

.mv-media {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.mv-zoomHint {
  position: absolute;
  right: 12px;
  bottom: 12px;
  border: none;
  background: rgba(0,0,0,0.52);
  color: #f0e6d0;
  font-size: 0.72rem;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
}

.mv-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(212,175,99,0.22);
  background: rgba(20,14,8,0.62);
  color: #d4af63;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.mv-nav--left {
  left: 10px;
}

.mv-nav--right {
  right: 10px;
}

.mv-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-top: 1px solid rgba(212,175,99,0.08);
}

.mv-counter {
  color: rgba(212,175,99,0.75);
  font-size: 0.82rem;
}

.mv-controlGroup,
.mv-lightboxControls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.mv-controlBtn {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(212,175,99,0.18);
  background: rgba(212,175,99,0.08);
  color: #d4af63;
  cursor: pointer;
  font-size: 0.82rem;
}

.mv-controlBtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.mv-thumbs {
  display: flex;
  gap: 10px;
  padding: 0 14px 14px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.mv-thumb {
  flex: 0 0 auto;
  width: 72px;
  height: 56px;
  border: 1px solid rgba(212,175,99,0.12);
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  background: rgba(255,255,255,0.03);
  cursor: pointer;
  opacity: 0.7;
}

.mv-thumb--active {
  opacity: 1;
  border-color: rgba(212,175,99,0.5);
  box-shadow: 0 0 0 2px rgba(212,175,99,0.12);
}

.mv-thumbImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mv-thumbVideo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.35);
  color: #d4af63;
}

.mv-thumbPlay {
  font-size: 1.05rem;
  line-height: 1;
}

.mv-thumbText {
  margin-top: 2px;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mv-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.mv-lightboxInner {
  width: min(100%, 1100px);
  max-height: 92vh;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(18,12,7,0.98);
  border: 1px solid rgba(212,175,99,0.16);
  box-shadow: 0 24px 80px rgba(0,0,0,0.45);
  display: flex;
  flex-direction: column;
}

.mv-lightboxTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(212,175,99,0.08);
}

.mv-lightboxTitle {
  font-size: 0.92rem;
  color: #f0e6d0;
  font-weight: 700;
}

.mv-closeBtn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(212,175,99,0.18);
  background: rgba(212,175,99,0.08);
  color: #d4af63;
  cursor: pointer;
}

.mv-lightboxMediaWrap {
  position: relative;
  width: 100%;
  height: min(70vh, 760px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(0,0,0,0.22);
}

.mv-lightboxImg {
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
  transition: transform 0.16s ease;
  transform-origin: center center;
}

.mv-lightboxControls {
  padding: 12px 14px;
  border-top: 1px solid rgba(212,175,99,0.08);
}

.mv-zoomValue {
  min-width: 54px;
  text-align: center;
  color: rgba(212,175,99,0.8);
  font-size: 0.82rem;
}

.mv-lightboxHint {
  padding: 0 14px 14px;
  color: rgba(212,175,99,0.45);
  font-size: 0.72rem;
}

.mv-empty {
  min-height: 220px;
  border-radius: 18px;
  border: 1px dashed rgba(212,175,99,0.18);
  background: rgba(255,255,255,0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.mv-emptyIcon {
  font-size: 2.6rem;
  margin-bottom: 8px;
}

.mv-emptyTitle {
  font-size: 0.98rem;
  color: #f0e6d0;
  font-weight: 700;
}

.mv-emptySub {
  margin-top: 4px;
  font-size: 0.78rem;
  color: rgba(212,175,99,0.48);
}

@media (max-width: 640px) {
  .mv-topbar {
    padding: 12px 12px 8px;
  }

  .mv-title {
    font-size: 0.95rem;
  }

  .mv-main {
    aspect-ratio: 4 / 3;
  }

  .mv-nav {
    width: 34px;
    height: 34px;
    font-size: 1.45rem;
  }

  .mv-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .mv-controlGroup {
    justify-content: flex-start;
  }

  .mv-thumbs {
    padding: 0 12px 12px;
    gap: 8px;
  }

  .mv-thumb {
    width: 64px;
    height: 50px;
  }

  .mv-lightbox {
    padding: 10px;
  }

  .mv-lightboxInner {
    max-height: 96vh;
  }

  .mv-lightboxMediaWrap {
    height: 58vh;
  }

  .mv-lightboxControls {
    gap: 6px;
  }

  .mv-controlBtn {
    padding: 7px 10px;
    font-size: 0.78rem;
  }
}
`;

export default MediaViewer;