import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={s.nav}>
      <div style={s.bottomLine} />

      <Link to="/" style={s.logo}>
        <span style={s.logoIcon}>🌾</span>
        <div>
          <span style={s.logoText}>Rural Company</span>
          <span style={s.logoSub}>Connecting Rural India</span>
        </div>
      </Link>

      <div style={s.links}>
        <Link to="/" style={s.link}>Animals</Link>
        <div style={s.divider} />

        {user ? (
          <>
            <Link to="/post-animal" style={s.postBtn}>＋ Post Animal</Link>
            <div style={s.userBadge}>
              <div style={s.avatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={s.username}>{user.name?.split(" ")[0]}</span>
            </div>
            <button onClick={handleLogout} style={s.logoutBtn}>Sign Out</button>
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
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2.5rem", height: "64px", background: "#1a120b", borderBottom: "1px solid rgba(212,175,99,0.15)", position: "relative", fontFamily: "'Crimson Pro', Georgia, serif" },
  bottomLine: { position: "absolute", bottom: 0, left: "5%", right: "5%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,99,0.3), transparent)" },
  logo: { display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" },
  logoIcon: { fontSize: "1.5rem" },
  logoText: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "#d4af63", letterSpacing: "0.03em", display: "block" },
  logoSub: { fontSize: "0.62rem", color: "rgba(212,175,99,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", display: "block", lineHeight: 1, marginTop: "1px" },
  links: { display: "flex", alignItems: "center", gap: "8px" },
  link: { color: "rgba(240,230,208,0.6)", textDecoration: "none", fontSize: "0.88rem", letterSpacing: "0.08em", padding: "6px 14px", borderRadius: "2px", fontFamily: "'Crimson Pro', Georgia, serif" },
  divider: { width: "1px", height: "16px", background: "rgba(212,175,99,0.15)", margin: "0 4px" },
  postBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", background: "linear-gradient(135deg, #8b5a2b, #6b4420)", border: "1px solid rgba(212,175,99,0.25)", borderRadius: "2px", color: "#f0e6d0", fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "0.88rem", letterSpacing: "0.06em", cursor: "pointer", textDecoration: "none" },
  userBadge: { display: "flex", alignItems: "center", gap: "8px", padding: "4px 12px 4px 4px", border: "1px solid rgba(212,175,99,0.12)", borderRadius: "20px", background: "rgba(212,175,99,0.04)" },
  avatar: { width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5a2b, #4a6b3a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#f0e6d0", fontFamily: "'Playfair Display', serif" },
  username: { fontSize: "0.82rem", color: "rgba(212,175,99,0.7)", fontFamily: "'Crimson Pro', serif" },
  logoutBtn: { padding: "7px 14px", background: "transparent", border: "1px solid rgba(212,175,99,0.2)", borderRadius: "2px", color: "rgba(240,230,208,0.5)", fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "0.85rem", letterSpacing: "0.06em", cursor: "pointer" }
};

export default Navbar;