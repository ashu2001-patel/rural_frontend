import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const close = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&display=swap');

        .nav-wrap {
          position: sticky; top: 0; z-index: 999;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 2rem; height: 68px;
          background: rgba(15,10,5,0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(212,175,99,0.15);
          font-family: 'Poppins', sans-serif;
        }
        .nav-glow {
          position: absolute; bottom: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,99,0.5), transparent);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon { font-size: 1.8rem; filter: drop-shadow(0 0 8px rgba(212,175,99,0.6)); }
        .nav-logo-text { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #d4af63; display: block; }
        .nav-logo-sub { font-size: 0.58rem; color: rgba(212,175,99,0.4); letter-spacing: 0.18em; text-transform: uppercase; display: block; }

        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          color: rgba(230,216,181,0.7); text-decoration: none; font-size: 0.88rem;
          padding: 7px 12px; border-radius: 6px; transition: all 0.2s; font-weight: 500;
        }
        .nav-link:hover { color: #d4af63; background: rgba(212,175,99,0.08); }
        .nav-link.active { color: #d4af63; background: rgba(212,175,99,0.12); }
        .nav-divider { width: 1px; height: 18px; background: rgba(212,175,99,0.15); margin: 0 6px; }
        .nav-post-btn {
          padding: 7px 14px; background: linear-gradient(135deg, #d4af63, #8b5a2b);
          border: none; border-radius: 8px; color: #1a0f05; font-weight: 600;
          cursor: pointer; text-decoration: none; font-size: 0.82rem;
          box-shadow: 0 2px 12px rgba(212,175,99,0.25); transition: all 0.2s;
        }
        .nav-post-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(212,175,99,0.35); }
        .nav-user-badge {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 12px; border-radius: 20px;
          background: rgba(212,175,99,0.08); border: 1px solid rgba(212,175,99,0.12);
        }
        .nav-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #8b5a2b, #4a6b3a);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: bold; font-size: 0.8rem;
        }
        .nav-username { color: #d4af63; font-size: 0.82rem; font-weight: 500; }
        .nav-logout-btn {
          padding: 7px 12px; border-radius: 6px;
          border: 1px solid rgba(212,175,99,0.2);
          background: transparent; color: rgba(230,216,181,0.6);
          cursor: pointer; font-size: 0.82rem; transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
        }
        .nav-logout-btn:hover { border-color: rgba(220,80,60,0.4); color: #e8917a; }

        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .nav-hamburger span {
          display: block; width: 22px; height: 2px;
          background: #d4af63; border-radius: 2px; transition: all 0.3s;
        }

        .nav-mobile {
          display: none; flex-direction: column; gap: 6px;
          position: absolute; top: 68px; left: 0; right: 0;
          background: rgba(12,8,4,0.98); backdrop-filter: blur(16px);
          padding: 1.2rem 1.5rem; border-bottom: 1px solid rgba(212,175,99,0.15);
          z-index: 998;
        }
        .nav-mobile.open { display: flex; }
        .nav-mobile .nav-link { padding: 10px 14px; font-size: 0.95rem; }
        .nav-mobile .nav-post-btn { text-align: center; padding: 10px; font-size: 0.9rem; }
        .nav-mobile .nav-logout-btn { width: 100%; padding: 10px; font-size: 0.9rem; }
        .nav-mobile .nav-user-badge { justify-content: center; }
        .nav-mobile .nav-divider { width: 100%; height: 1px; margin: 4px 0; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <nav className="nav-wrap">
        <div className="nav-glow" />

        <Link to="/" className="nav-logo" onClick={close}>
          <span className="nav-logo-icon">🌾</span>
          <div>
            <span className="nav-logo-text">Rural Company</span>
            <span className="nav-logo-sub">Connecting Rural India</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>🐄 Animals</Link>
          <Link to="/tools" className={`nav-link ${isActive("/tools") ? "active" : ""}`}>🔧 Tools</Link>
          {user && <Link to="/my-animals" className={`nav-link ${isActive("/my-animals") ? "active" : ""}`}>My Listings</Link>}
          <div className="nav-divider" />
          {user ? (
            <>
              <Link to="/post-animal" className="nav-post-btn">＋ Animal</Link>
              <Link to="/post-tool" className="nav-post-btn">＋ Tool</Link>
              <div className="nav-user-badge">
                <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="nav-username">{user.name?.split(" ")[0]}</span>
              </div>
              <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-post-btn">Register</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`nav-mobile ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`} onClick={close}>🐄 Animals</Link>
        <Link to="/tools" className={`nav-link ${isActive("/tools") ? "active" : ""}`} onClick={close}>🔧 Tools</Link>
        {user && <Link to="/my-animals" className={`nav-link ${isActive("/my-animals") ? "active" : ""}`} onClick={close}>My Listings</Link>}
        <div className="nav-divider" />
        {user ? (
          <>
            <div className="nav-user-badge">
              <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="nav-username">{user.name?.split(" ")[0]}</span>
            </div>
            <Link to="/post-animal" className="nav-post-btn" onClick={close}>＋ Post Animal</Link>
            <Link to="/post-tool" className="nav-post-btn" onClick={close}>＋ Post Tool</Link>
            <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={close}>Login</Link>
            <Link to="/register" className="nav-post-btn" onClick={close}>Register</Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;