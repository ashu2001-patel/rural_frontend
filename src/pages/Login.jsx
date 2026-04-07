import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.post("/users/login", form); // ✅ fixed endpoint
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.bg} />
      <div style={s.grain} />
      <div style={{ ...s.decoCircle, width: 500, height: 500, top: -150, right: -150 }} />
      <div style={{ ...s.decoCircle, width: 300, height: 300, bottom: -80, left: -80, borderColor: "rgba(74,107,58,0.1)" }} />

      <div style={s.card}>
        <div style={s.topLine} />

        <div style={s.brandMark}>
          <span style={s.brandIcon}>🌾</span>
          <span style={s.brandName}>Rural Company</span>
          <span style={s.brandSub}>Connecting Rural India</span>
        </div>

        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={{ color: "rgba(74,107,58,0.8)", fontSize: 14 }}>🌿</span>
          <div style={s.dividerLine} />
        </div>

        {error && <div style={s.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Email Address</label>
            <input
              style={s.fieldInput}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Password</label>
            <input
              style={s.fieldInput}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In to Your Account"}
          </button>
        </form>

        <p style={s.registerLink}>
          Don't have an account?{" "}
          <Link to="/register" style={s.link}>Create one</Link>
        </p>

        <div style={s.bottomDeco}>— Est. 2024 —</div>
      </div>
    </div>
  );
};

const s = {
  wrap: { minHeight: "100vh", background: "#1a120b", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", overflow: "hidden", fontFamily: "'Crimson Pro', Georgia, serif" },
  bg: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 80%, rgba(139,90,43,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(74,107,58,0.2) 0%, transparent 60%)" },
  grain: { position: "absolute", inset: 0, opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: "200px" },
  decoCircle: { position: "absolute", borderRadius: "50%", border: "1px solid rgba(212,175,99,0.08)" },
  card: { position: "relative", zIndex: 10, width: "100%", maxWidth: "420px", background: "rgba(30,20,12,0.85)", border: "1px solid rgba(212,175,99,0.2)", borderRadius: "4px", padding: "3rem 2.5rem", backdropFilter: "blur(12px)" },
  topLine: { position: "absolute", top: 0, left: "10%", right: "10%", height: "2px", background: "linear-gradient(90deg, transparent, #d4af63, transparent)", borderRadius: "2px" },
  brandMark: { textAlign: "center", marginBottom: "2rem" },
  brandIcon: { fontSize: "2.2rem", display: "block", marginBottom: "0.5rem" },
  brandName: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#d4af63", letterSpacing: "0.05em", display: "block" },
  brandSub: { fontSize: "0.8rem", color: "rgba(212,175,99,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginTop: "2px" },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "1.5rem 0" },
  dividerLine: { flex: 1, height: "1px", background: "rgba(212,175,99,0.15)" },
  errorMsg: { background: "rgba(180,60,40,0.15)", border: "1px solid rgba(180,60,40,0.3)", borderRadius: "3px", padding: "8px 12px", color: "#e8917a", fontSize: "0.88rem", textAlign: "center", marginBottom: "1rem" },
  fieldGroup: { marginBottom: "1.2rem" },
  fieldLabel: { display: "block", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(212,175,99,0.6)", marginBottom: "6px" },
  fieldInput: { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,99,0.18)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "1rem", boxSizing: "border-box", outline: "none" },
  btn: { width: "100%", padding: "13px", background: "linear-gradient(135deg, #8b5a2b, #6b4420)", border: "1px solid rgba(212,175,99,0.3)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", marginTop: "0.5rem" },
  registerLink: { textAlign: "center", marginTop: "1.5rem", fontSize: "0.88rem", color: "rgba(240,230,208,0.4)" },
  link: { color: "#d4af63", textDecoration: "none", borderBottom: "1px solid rgba(212,175,99,0.3)" },
  bottomDeco: { textAlign: "center", marginTop: "2rem", fontSize: "0.75rem", color: "rgba(212,175,99,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }
};

export default Login;