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

  // ✅ logout
  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
    setDrawerOpen(false);
  };

  // ✅ better active check (supports nested routes)
  const isActive = (path) => location.pathname.startsWith(path);

  // ✅ close all
  const close = () => {
    setMenuOpen(false);
    setDrawerOpen(false);
  };

  // ✅ safe initials
  const getInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  // ✅ outside click + escape
  useEffect(() => {
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") close();
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
      {/* KEEP YOUR EXISTING CSS (no change needed) */}

      <nav className="nav-wrap" ref={drawerRef}>
        <div className="nav-glow" />

        {/* LOGO */}
        <Link to="/" className="nav-logo" onClick={close}>
          <span className="nav-logo-icon">🐄</span>
          <div>
            <span className="nav-logo-text">Animal Market</span>
            <span className="nav-logo-sub">Buy • Sell • Trade Animals</span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="nav-center">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Animals
          </Link>

          {user && (
            <>
              <Link
                to="/my-listings"
                className={`nav-link ${isActive("/my-listings") ? "active" : ""}`}
              >
                My Listings
              </Link>

              {/* ✅ NEW: REQUESTS PAGE */}
              <Link
                to="/requests"
                className={`nav-link ${isActive("/requests") ? "active" : ""}`}
              >
                Requests
              </Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/post-animal" className="nav-post-btn">
                ＋ Post Animal
              </Link>

              <button
                className={`nav-avatar-btn ${drawerOpen ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDrawerOpen((prev) => !prev);
                }}
              >
                {getInitial()}
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

          {/* HAMBURGER */}
          <button
            className="nav-hamburger"
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setDrawerOpen(false);
            }}
          >
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "" }} />
          </button>
        </div>

        {/* PROFILE DRAWER */}
        {drawerOpen && user && (
          <div className="profile-drawer">
            <div className="pd-header">
              <div className="pd-avatar">{getInitial()}</div>
              <div>
                <span className="pd-name">{user.name}</span>
                <span className="pd-role">{user.role || "Member"}</span>
              </div>
            </div>

            <div className="pd-section-title">My Account</div>

            <Link to="/profile" className="pd-item" onClick={close}>
              <div className="pd-icon green">👤</div> Profile
            </Link>

            <Link to="/my-listings" className="pd-item" onClick={close}>
              <div className="pd-icon amber">📋</div> My Listings
            </Link>

            {/* ✅ NEW */}
            <Link to="/requests" className="pd-item" onClick={close}>
              <div className="pd-icon amber">📥</div> Requests
            </Link>

            <div className="pd-divider" />

            <Link to="/post-animal" className="pd-item" onClick={close}>
              <div className="pd-icon amber">🐄</div> Post Animal
            </Link>

            <div className="pd-divider" />

            <button
              className="pd-item"
              style={{ color: "rgba(232,145,122,0.8)" }}
              onClick={handleLogout}
            >
              <div className="pd-icon red">🚪</div> Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* OVERLAY */}
      {menuOpen && <div className="mobile-overlay" onClick={close} />}

      {/* MOBILE MENU */}
      <div className={`nav-mobile ${menuOpen ? "open" : ""}`}>
        <div className="nm-section">Browse</div>

        <Link to="/" className={`nm-item ${isActive("/") ? "active" : ""}`} onClick={close}>
          🐄 Animals
        </Link>

        {user && (
          <>
            <Link
              to="/my-listings"
              className={`nm-item ${isActive("/my-listings") ? "active" : ""}`}
              onClick={close}
            >
              📋 My Listings
            </Link>

            <Link
              to="/requests"
              className={`nm-item ${isActive("/requests") ? "active" : ""}`}
              onClick={close}
            >
              📥 Requests
            </Link>
          </>
        )}

        <div className="nm-divider" />

        {user ? (
          <>
            <Link to="/post-animal" className="nm-post" onClick={close}>
              🐄 Post Animal
            </Link>

            <div className="nm-user">
              <div className="nm-avatar">{getInitial()}</div>
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
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;