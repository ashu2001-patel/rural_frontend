import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    phoneNumber: "", address: "", role: "buyer"
  });
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
      const res = await userAPI.post("/users/register", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.bg} />
      <div style={s.grain} />

      <div style={s.card}>
        <div style={s.topLine} />

        <div style={s.brand}>
          <span style={s.icon}>🌱</span>
          <span style={s.title}>Join Rural Company</span>
          <span style={s.sub}>Create your account</span>
        </div>

        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={{ color: "rgba(74,107,58,0.7)", fontSize: 13 }}>🌿</span>
          <div style={s.dividerLine} />
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} type="text" name="name" placeholder="Ramesh Kumar" value={form.name} onChange={handleChange} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Phone Number</label>
              <input style={s.input} type="tel" name="phoneNumber" placeholder="+91 98765 43210" value={form.phoneNumber} onChange={handleChange} required />
            </div>
          </div>

          {/* Email */}
          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input style={s.input} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          {/* Address */}
          <div style={s.field}>
            <label style={s.label}>Address</label>
            <input style={s.input} type="text" name="address" placeholder="Village, District, State" value={form.address} onChange={handleChange} required />
          </div>

          {/* Password */}
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>

          {/* Role */}
          <div style={s.field}>
            <label style={s.label}>I am a</label>
            <div style={s.roleRow}>
              <button
                type="button"
                style={{ ...s.roleBtn, ...(form.role === "vet" ? s.roleBtnActive : {}) }}
                onClick={() => setForm({ ...form, role: "vet" })}
              >
                🌾 Seller / Farmer
              </button>
              <button
                type="button"
                style={{ ...s.roleBtn, ...(form.role === "user" ? s.roleBtnActive : {}) }}
                onClick={() => setForm({ ...form, role: "user" })}
              >
                🛒 Buyer
              </button>
            </div>
          </div>

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={s.loginLink}>
          Already have an account? <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const s = {
  wrap: { minHeight: "100vh", background: "#1a120b", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", overflow: "hidden", fontFamily: "'Crimson Pro', Georgia, serif" },
  bg: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 80%, rgba(74,107,58,0.2) 0%, transparent 60%), radial-gradient(ellipse at 20% 20%, rgba(139,90,43,0.2) 0%, transparent 60%)" },
  grain: { position: "absolute", inset: 0, opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: "200px" },
  card: { position: "relative", zIndex: 10, width: "100%", maxWidth: "460px", background: "rgba(30,20,12,0.88)", border: "1px solid rgba(212,175,99,0.18)", borderRadius: "4px", padding: "2.5rem", backdropFilter: "blur(12px)" },
  topLine: { position: "absolute", top: 0, left: "10%", right: "10%", height: "2px", background: "linear-gradient(90deg, transparent, #d4af63, transparent)" },
  brand: { textAlign: "center", marginBottom: "1.8rem" },
  icon: { fontSize: "2rem", display: "block", marginBottom: "4px" },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#d4af63", display: "block", letterSpacing: "0.03em" },
  sub: { fontSize: "0.78rem", color: "rgba(212,175,99,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", display: "block", marginTop: "2px" },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "1.2rem 0 1.5rem" },
  dividerLine: { flex: 1, height: "1px", background: "rgba(212,175,99,0.12)" },
  error: { background: "rgba(180,60,40,0.12)", border: "1px solid rgba(180,60,40,0.25)", borderRadius: "3px", padding: "8px 12px", color: "#e8917a", fontSize: "0.88rem", textAlign: "center", marginBottom: "1rem" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(212,175,99,0.55)", marginBottom: "5px" },
  input: { width: "100%", padding: "10px 13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,99,0.15)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "0.95rem", boxSizing: "border-box", outline: "none" },
  roleRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  roleBtn: { padding: "9px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,99,0.12)", borderRadius: "3px", color: "rgba(240,230,208,0.45)", fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "0.88rem", letterSpacing: "0.06em", cursor: "pointer", textAlign: "center", transition: "all 0.2s" },
  roleBtnActive: { borderColor: "rgba(212,175,99,0.4)", background: "rgba(212,175,99,0.08)", color: "#d4af63" },
  btn: { width: "100%", padding: "13px", background: "linear-gradient(135deg, #8b5a2b, #6b4420)", border: "1px solid rgba(212,175,99,0.3)", borderRadius: "3px", color: "#f0e6d0", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", marginTop: "0.3rem" },
  loginLink: { textAlign: "center", marginTop: "1.3rem", fontSize: "0.88rem", color: "rgba(240,230,208,0.35)" },
  link: { color: "#d4af63", textDecoration: "none", borderBottom: "1px solid rgba(212,175,99,0.3)" }
};

export default Register;