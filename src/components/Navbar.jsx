import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
    setDrawerOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const close = () => {
    setMenuOpen(false);
    setDrawerOpen(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&display=swap');

        .nav-wrap {
          position: sticky;
          top: 0;
          z-index: 999;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
          height: 64px;
          background: rgba(15, 10, 5, 0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(212, 175, 99, 0.15);
          font-family: 'Poppins', sans-serif;
        }

        .nav-glow {
          position: absolute;
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 99, 0.4), transparent);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          min-width: 0;
        }

        .nav-logo-icon {
          font-size: 1.6rem;
        }

        .nav-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          color: #d4af63;
          display: block;
          line-height: 1.2;
        }

        .nav-logo-sub {
          font-size: 0.55rem;
          color: rgba(212, 175, 99, 0.4);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          display: block;
        }

        .nav-center {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 1rem;
          flex: 1;
        }

        .nav-link {
          color: rgba(230, 216, 181, 0.65);
          text-decoration: none;
          font-size: 0.84rem;
          padding: 7px 11px;
          border-radius: 8px;
          transition: all 0.2s;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #d4af63;
          background: rgba(212, 175, 99, 0.08);
        }

        .nav-link.active {
          color: #d4af63;
          background: rgba(212, 175, 99, 0.12);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .nav-post-btn {
          padding: 7px 14px;
          background: linear-gradient(135deg, #d4af63, #8b5a2b);
          border: none;
          border-radius: 8px;
          color: #1a0f05;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 2px 10px rgba(212, 175, 99, 0.2);
          transition: all 0.2s;
        }

        .nav-post-btn:hover {
          transform: translateY(-1px);
        }

        .nav-avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5a2b, #4a6b3a);
          border: 2px solid rgba(212, 175, 99, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f0e6d0;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }

        .nav-avatar-btn:hover {
          border-color: rgba(212, 175, 99, 0.6);
        }

        .nav-avatar-btn.open {
          border-color: #d4af63;
        }

        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          margin-left: 2px;
        }

        .nav-hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #d4af63;
          border-radius: 2px;
          transition: all 0.3s;
        }

        .profile-drawer {
          position: absolute;
          top: 64px;
          right: 1rem;
          width: min(280px, calc(100vw - 2rem));
          background: rgba(16, 10, 5, 0.99);
          border: 1px solid rgba(212, 175, 99, 0.15);
          border-radius: 14px;
          z-index: 1000;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
          animation: drawerIn 0.18s ease;
        }

        @keyframes drawerIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pd-header {
          padding: 1rem 1.1rem;
          border-bottom: 1px solid rgba(212, 175, 99, 0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pd-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5a2b, #4a6b3a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f0e6d0;
          font-weight: 700;
          font-size: 1rem;
          border: 2px solid rgba(212, 175, 99, 0.2);
          flex-shrink: 0;
        }

        .pd-name {
          font-family: 'Playfair Display', serif;
          color: #d4af63;
          font-size: 0.95rem;
          display: block;
          line-height: 1.3;
        }

        .pd-role {
          font-size: 0.68rem;
          color: rgba(212, 175, 99, 0.35);
          letter-spacing: 0.08em;
        }

        .pd-section-title {
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(212, 175, 99, 0.25);
          padding: 8px 1.1rem 2px;
        }

        .pd-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 1.1rem;
          color: rgba(230, 216, 181, 0.68);
          font-size: 0.84rem;
          text-decoration: none;
          transition: all 0.15s;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'Poppins', sans-serif;
        }

        .pd-item:hover {
          background: rgba(212, 175, 99, 0.06);
          color: #d4af63;
        }

        .pd-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }

        .pd-icon.amber { background: rgba(212, 175, 99, 0.1); }
        .pd-icon.green { background: rgba(74, 107, 58, 0.15); }
        .pd-icon.red { background: rgba(180, 60, 40, 0.1); }

        .pd-divider {
          height: 1px;
          background: rgba(212, 175, 99, 0.07);
          margin: 4px 1.1rem;
        }

        .nav-mobile {
          display: none;
          flex-direction: column;
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(12, 8, 4, 0.98);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(212, 175, 99, 0.12);
          z-index: 998;
          padding: 0.8rem 0 1rem;
          overflow-y: auto;
        }

        .nav-mobile.open {
          display: flex;
        }

        .mobile-overlay {
          position: fixed;
          inset: 64px 0 0 0;
          background: rgba(0, 0, 0, 0.35);
          z-index: 997;
        }

        .nm-section {
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(212, 175, 99, 0.25);
          padding: 10px 1rem 3px;
        }

        .nm-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 1rem;
          color: rgba(230, 216, 181, 0.68);
          font-size: 0.92rem;
          text-decoration: none;
          transition: all 0.15s;
        }

        .nm-item.active {
          color: #d4af63;
          background: rgba(212, 175, 99, 0.06);
        }

        .nm-divider {
          height: 1px;
          background: rgba(212, 175, 99, 0.06);
          margin: 4px 1rem;
        }

        .nm-post {
          margin: 0.4rem 1rem 0.2rem;
          padding: 12px;
          background: linear-gradient(135deg, #d4af63, #8b5a2b);
          border: none;
          border-radius: 10px;
          color: #1a0f05;
          font-weight: 700;
          font-size: 0.9rem;
          text-align: center;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          text-decoration: none;
          display: block;
        }

        .nm-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 1rem;
          border-top: 1px solid rgba(212, 175, 99, 0.08);
          margin-top: 4px;
        }

        .nm-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5a2b, #4a6b3a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f0e6d0;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .nm-username {
          color: #d4af63;
          font-size: 0.85rem;
          font-weight: 500;
          flex: 1;
          min-width: 0;
        }

        .nm-logout {
          padding: 6px 10px;
          background: transparent;
          border: 1px solid rgba(212, 175, 99, 0.15);
          border-radius: 7px;
          color: rgba(230, 216, 181, 0.7);
          font-size: 0.75rem;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .nm-logout:hover {
          border-color: rgba(220, 80, 60, 0.3);
          color: #e8917a;
        }

        @media (max-width: 900px) {
          .nav-center { display: none; }
          .nav-hamburger { display: flex; }
          .nav-post-btn { display: none; }
          .profile-drawer { right: 0.75rem; }
        }

        @media (max-width: 480px) {
          .nav-wrap { padding: 0 0.75rem; }
          .nav-logo-sub { display: none; }
          .nav-logo-text { font-size: 1rem; }
          .nav-avatar-btn { width: 34px; height: 34px; }
        }
      `}</style>

      <nav className="nav-wrap" ref={drawerRef}>
        <div className="nav-glow" />

        <Link to="/" className="nav-logo" onClick={close}>
          <span className="nav-logo-icon">🐄</span>
          <div>
            <span className="nav-logo-text">Animal Market</span>
            <span className="nav-logo-sub">Buy • Sell • Trade Animals</span>
          </div>
        </Link>

        <div className="nav-center">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Animals
          </Link>

          {user && (
            <Link
              to="/my-listings"
              className={`nav-link ${isActive("/my-listings") ? "active" : ""}`}
            >
              My Listings
            </Link>
          )}
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <Link to="/post-animal" className="nav-post-btn">
                ＋ Post Animal
              </Link>
              <button
                className={`nav-avatar-btn ${drawerOpen ? "open" : ""}`}
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-post-btn">
                Register
              </Link>
            </>
          )}

          <button
            className="nav-hamburger"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setDrawerOpen(false);
            }}
            aria-label="Open menu"
          >
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>

        {drawerOpen && user && (
          <div className="profile-drawer">
            <div className="pd-header">
              <div className="pd-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <div>
                <span className="pd-name">{user.name}</span>
                <span className="pd-role">{user.role || "Member"}</span>
              </div>
            </div>

            <div className="pd-section-title">My Account</div>
            <Link to="/profile" className="pd-item" onClick={close}>
              <div className="pd-icon green">👤</div> Profile Settings
            </Link>
            <Link to="/my-listings" className="pd-item" onClick={close}>
              <div className="pd-icon amber">📋</div> My Listings
            </Link>

            <div className="pd-divider" />
            <div className="pd-section-title">Post New</div>
            <Link to="/post-animal" className="pd-item" onClick={close}>
              <div className="pd-icon amber">🐄</div> Post Animal
            </Link>

            <div className="pd-divider" />
            <button
              className="pd-item"
              style={{ color: "rgba(232, 145, 122, 0.8)" }}
              onClick={handleLogout}
            >
              <div className="pd-icon red">🚪</div> Sign Out
            </button>
          </div>
        )}
      </nav>

      {menuOpen && <div className="mobile-overlay" onClick={close} />}

      <div className={`nav-mobile ${menuOpen ? "open" : ""}`}>
        <div className="nm-section">Browse</div>
        <Link to="/" className={`nm-item ${isActive("/") ? "active" : ""}`} onClick={close}>
          🐄 Animals
        </Link>
        <Link
          to="/my-listings"
          className={`nm-item ${isActive("/my-listings") ? "active" : ""}`}
          onClick={close}
        >
          📋 My Listings
        </Link>

        {user && (
          <>
            <div className="nm-divider" />
            <div className="nm-section">Account</div>
            <Link to="/profile" className={`nm-item ${isActive("/profile") ? "active" : ""}`} onClick={close}>
              👤 Profile Settings
            </Link>
          </>
        )}

        <div className="nm-divider" />

        {user ? (
          <>
            <div className="nm-section">Post</div>
            <Link to="/post-animal" className="nm-post" onClick={close}>
              🐄 Post Animal
            </Link>

            <div className="nm-user">
              <div className="nm-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="nm-username">{user.name?.split(" ")[0]}</span>
              <button className="nm-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nm-item" onClick={close}>
              Login
            </Link>
            <Link to="/register" className="nm-post" onClick={close}>
              Register Free
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;