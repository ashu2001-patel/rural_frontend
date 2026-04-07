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

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        
        {/* 🔥 BIG CHANGE FOR CI/CD TEST */}
        <h1 style={s.testTitle}>🔥 CI/CD TEST LOGIN PAGE 🔥</h1>

        <h2 style={s.title}>Welcome Back</h2>

        {error && <p style={s.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={s.input}
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            style={s.input}
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button style={s.btn} disabled={loading}>
            {loading ? "Logging in..." : "Login Now"}
          </button>
        </form>

        <p style={s.linkText}>
          Don't have account?{" "}
          <Link to="/register" style={s.link}>Register</Link>
        </p>
      </div>
    </div>
  );
};

const s = {
  wrap: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a120b, #3e2c1c)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  },

  testTitle: {
    color: "red",
    fontSize: "18px",
    marginBottom: "10px"
  },

  title: {
    marginBottom: "20px",
    color: "#333"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  btn: {
    width: "100%",
    padding: "12px",
    background: "#ff5722",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  linkText: {
    marginTop: "15px"
  },

  link: {
    color: "#ff5722",
    textDecoration: "none"
  },

  error: {
    color: "red",
    marginBottom: "10px"
  }
};

export default Login;