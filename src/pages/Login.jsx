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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.post("/users/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GOOGLE LOGIN (redirect to backend)
  const handleGoogleLogin = () => {
    window.location.href = "http://YOUR_BACKEND_URL/api/users/google";
  };

  return (
    <div style={s.wrap}>
      <div style={s.overlay} />

      <div style={s.card}>
        <h2 style={s.title}>Welcome Back 👋</h2>
        <p style={s.subtitle}>Login to continue your journey</p>

        {error && <div style={s.error}>{error}</div>}

        {/* 🔥 GOOGLE BUTTON */}
        <button style={s.googleBtn} onClick={handleGoogleLogin}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="google"
            style={s.googleIcon}
          />
          Continue with Google
        </button>

        <div style={s.divider}>
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            style={s.input}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            style={s.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button style={s.btn} disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p style={s.bottom}>
          Don’t have an account?{" "}
          <Link to="/register" style={s.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const s = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a120b, #3b2a1a)",
    fontFamily: "Poppins"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 20%, rgba(212,175,99,0.2), transparent)"
  },

  card: {
    width: "100%",
    maxWidth: "380px",
    padding: "30px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(212,175,99,0.2)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.4)"
  },

  title: {
    color: "#d4af63",
    textAlign: "center",
    marginBottom: "5px"
  },

  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: "20px"
  },

  googleBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    cursor: "pointer",
    marginBottom: "15px",
    fontWeight: "600"
  },

  googleIcon: {
    width: "20px"
  },

  divider: {
    textAlign: "center",
    margin: "15px 0",
    color: "#aaa"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff"
  },

  btn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #d4af63, #8b5a2b)",
    border: "none",
    borderRadius: "8px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer"
  },

  error: {
    background: "rgba(255,0,0,0.1)",
    color: "#ff6b6b",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "10px",
    textAlign: "center"
  },

  bottom: {
    textAlign: "center",
    marginTop: "15px",
    color: "#ccc"
  },

  link: {
    color: "#d4af63",
    textDecoration: "none"
  }
};

export default Login;