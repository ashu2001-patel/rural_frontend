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
      const res = await userAPI.post("/user/login", form); // ✅ fixed endpoint
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        .login-wrap {
          min-height: 100vh; display: flex; align-items: center;
          justify-content: center; padding: 1.5rem;
          background: #0f0a05;
          background-image:
            radial-gradient(ellipse at 15% 85%, rgba(139,90,43,0.2) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 15%, rgba(74,107,58,0.15) 0%, transparent 55%);
          font-family: 'Poppins', sans-serif;
        }
        .login-card {
          width: 100%; max-width: 400px;
          background: rgba(22,14,8,0.92);
          border: 1px solid rgba(212,175,99,0.18);
          border-radius: 16px; padding: 2.5rem 2rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: slideUp 0.5s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-top-bar {
          position: absolute; top: 0; left: 12%; right: 12%; height: 2px;
          background: linear-gradient(90deg, transparent, #d4af63, transparent);
          border-radius: 2px;
        }
        .login-brand { text-align: center; margin-bottom: 1.8rem; }
        .login-icon { font-size: 2.2rem; display: block; margin-bottom: 6px; }
        .login-title {
          font-family: 'Playfair Display', serif; font-size: 1.6rem;
          color: #d4af63; margin: 0 0 4px; font-weight: 700;
        }
        .login-sub { font-size: 0.82rem; color: rgba(212,175,99,0.4); letter-spacing: 0.08em; }
        .login-divider { display: flex; align-items: center; gap: 12px; margin: 1.2rem 0 1.5rem; }
        .login-divider-line { flex: 1; height: 1px; background: rgba(212,175,99,0.12); }
        .login-field { margin-bottom: 1rem; }
        .login-label {
          display: block; font-size: 0.7rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(212,175,99,0.5); margin-bottom: 6px;
          font-weight: 500;
        }
        .login-input {
          width: 100%; padding: 11px 14px; box-sizing: border-box;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,99,0.15); border-radius: 8px;
          color: #f0e6d0; font-family: 'Poppins', sans-serif; font-size: 0.95rem;
          outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .login-input::placeholder { color: rgba(240,230,208,0.2); }
        .login-input:focus { border-color: rgba(212,175,99,0.4); background: rgba(255,255,255,0.06); }
        .login-btn {
          width: 100%; padding: 13px; margin-top: 0.5rem;
          background: linear-gradient(135deg, #d4af63, #8b5a2b);
          border: none; border-radius: 10px; color: #1a0f05;
          font-family: 'Poppins', sans-serif; font-size: 0.95rem;
          font-weight: 700; letter-spacing: 0.05em; cursor: pointer;
          box-shadow: 0 4px 20px rgba(212,175,99,0.3);
          transition: all 0.2s;
        }
        .login-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(212,175,99,0.4); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .login-error {
          background: rgba(180,60,40,0.12); border: 1px solid rgba(180,60,40,0.3);
          border-radius: 8px; padding: 10px 14px; color: #e8917a;
          font-size: 0.85rem; text-align: center; margin-bottom: 1rem;
        }
        .login-footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: rgba(240,230,208,0.35); }
        .login-footer a { color: #d4af63; text-decoration: none; font-weight: 500; border-bottom: 1px solid rgba(212,175,99,0.3); }
        @media (max-width: 480px) {
          .login-card { padding: 2rem 1.5rem; border-radius: 12px; }
          .login-title { font-size: 1.4rem; }
        }
      `}</style>

      <div className="login-wrap">
        <div className="login-card" style={{ position: "relative" }}>
          <div className="login-top-bar" />

          <div className="login-brand">
            <span className="login-icon">🌾</span>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-sub">Sign in to your account</p>
          </div>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span style={{ color: "rgba(74,107,58,0.7)", fontSize: 13 }}>🌿</span>
            <div className="login-divider-line" />
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <input className="login-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="login-field">
              <label className="login-label">Password</label>
              <input className="login-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;