import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={s.nav}>
      <div style={s.glowLine} />

      {/* 🔥 LOGO */}
      <Link to="/" style={s.logo}>
        <span style={s.logoIcon}>🌾</span>
        <div>
          <span style={s.logoText}>Rural Company</span>
          <span style={s.logoSub}>Connecting Rural India</span>
        </div>
      </Link>

      {/* 🔥 LINKS */}
      <div style={s.links}>
        <Link to="/" style={{
          ...s.link,
          ...(isActive("/") && s.activeLink)
        }}>
          Animals
        </Link>

        <div style={s.divider} />

        {user ? (
          <>
            <Link to="/post-animal" style={s.postBtn}>
              ＋ Post Animal
            </Link>

            <div style={s.userBadge}>
              <div style={s.avatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={s.username}>
                {user.name?.split(" ")[0]}
              </span>
            </div>

            <button onClick={handleLogout} style={s.logoutBtn}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={s.link}>Login</Link>
            <Link to="/register" style={s.postBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const s = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2.5rem",
    height: "70px",
    background: "rgba(26,18,11,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(212,175,99,0.15)",
    fontFamily: "'Crimson Pro', serif"
  },

  glowLine: {
    position: "absolute",
    bottom: 0,
    left: "10%",
    right: "10%",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #d4af63, transparent)"
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none"
  },

  logoIcon: {
    fontSize: "1.8rem",
    filter: "drop-shadow(0 0 6px rgba(212,175,99,0.6))"
  },

  logoText: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#d4af63",
    display: "block"
  },

  logoSub: {
    fontSize: "0.65rem",
    color: "rgba(212,175,99,0.5)",
    letterSpacing: "0.15em",
    textTransform: "uppercase"
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  link: {
    color: "rgba(240,230,208,0.6)",
    textDecoration: "none",
    fontSize: "0.9rem",
    padding: "8px 16px",
    borderRadius: "6px",
    transition: "all 0.3s ease"
  },

  activeLink: {
    background: "rgba(212,175,99,0.15)",
    color: "#d4af63",
    boxShadow: "0 0 10px rgba(212,175,99,0.3)"
  },

  divider: {
    width: "1px",
    height: "18px",
    background: "rgba(212,175,99,0.2)"
  },

  postBtn: {
    padding: "8px 18px",
    background: "linear-gradient(135deg, #d4af63, #8b5a2b)",
    border: "none",
    borderRadius: "6px",
    color: "#1a120b",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
    transition: "0.3s",
    boxShadow: "0 4px 15px rgba(212,175,99,0.3)"
  },

  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 12px",
    borderRadius: "20px",
    background: "rgba(212,175,99,0.1)"
  },

  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5a2b, #4a6b3a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "bold"
  },

  username: {
    color: "#d4af63",
    fontSize: "0.85rem"
  },

  logoutBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid rgba(212,175,99,0.3)",
    background: "transparent",
    color: "#f0e6d0",
    cursor: "pointer",
    transition: "0.3s"
  }
};

export default Navbar;