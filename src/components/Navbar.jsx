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
        <Link to="/" style={{ ...s.link, ...(isActive("/") && s.activeLink) }}>
          Animals
        </Link>

        {/* ✅ NEW FEATURE */}
        {user && (
          <Link to="/my-animals" style={{ ...s.link, ...(isActive("/my-animals") && s.activeLink) }}>
            My Animals
          </Link>
        )}

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
              Logout
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
    padding: "0 2rem",
    height: "70px",
    background: "rgba(20,14,8,0.9)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(212,175,99,0.2)",
    fontFamily: "'Poppins', sans-serif"
  },

  glowLine: {
    position: "absolute",
    bottom: 0,
    left: "15%",
    right: "15%",
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
    filter: "drop-shadow(0 0 8px rgba(212,175,99,0.7))"
  },

  logoText: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#d4af63"
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
    gap: "12px"
  },

  link: {
    position: "relative",
    color: "#e6d8b5",
    textDecoration: "none",
    fontSize: "0.9rem",
    padding: "8px 14px",
    borderRadius: "6px",
    transition: "0.3s"
  },

  activeLink: {
    background: "rgba(212,175,99,0.15)",
    color: "#d4af63",
    boxShadow: "0 0 12px rgba(212,175,99,0.4)"
  },

  divider: {
    width: "1px",
    height: "20px",
    background: "rgba(212,175,99,0.2)"
  },

  postBtn: {
    padding: "8px 18px",
    background: "linear-gradient(135deg, #d4af63, #8b5a2b)",
    border: "none",
    borderRadius: "8px",
    color: "#1a120b",
    fontWeight: "600",
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
    color: "#e6d8b5",
    cursor: "pointer",
    transition: "0.3s"
  }
};

export default Navbar;