import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { userAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const NO_ACCOUNT_MSG = "Name required for new account";

const Login = () => {
  const [method, setMethod] = useState(null); // null | "email" | "otp" | "google"
  const [step, setStep] = useState(1);        // OTP flow: 1=phone, 2=otp
  const [form, setForm] = useState({ email: "", password: "", phoneNumber: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [welcome, setWelcome] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const normalisePhone = (raw) => raw.replace(/\D/g, "").replace(/^0+/, "");

  const resetState = () => {
    setError("");
    setOtp("");
    setStep(1);
    setForm({ email: "", password: "", phoneNumber: "" });
  };

  // ─── Email + Password login ─────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.post("/users/login", {
        email: form.email,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP Step 1: Send OTP ───────────────────────────────────
  const handleSendOtp = async () => {
    const digits = normalisePhone(form.phoneNumber);
    if (digits.length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await userAPI.post("/users/send-otp", { phoneNumber: digits });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP Step 2: Verify OTP then login ─────────────────────
  const handleVerifyAndLogin = async () => {
    if (!otp || otp.length < 4) { setError("Enter the OTP"); return; }
    setLoading(true);
    setError("");
    try {
      // 1. Verify OTP
      await userAPI.post("/users/verify-otp", {
        phoneNumber: normalisePhone(form.phoneNumber),
        otp,
      });
      // 2. Login / find user by phone
      const res = await userAPI.post("/users/phone-login", {
        phoneNumber: normalisePhone(form.phoneNumber),
      });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "OTP verification failed";
      if (msg === NO_ACCOUNT_MSG) {
        setError("No account found for this number. Please register first.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Google login ───────────────────────────────────────────
  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.post("/users/google-login", {
        credential: credentialResponse.credential,
      });
      login(res.data.user, res.data.token);
      if (res.data.isNewUser) setWelcome(`Welcome to Rural Company, ${res.data.user.name}! 🌾 Your account is ready.`);
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
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
          width: 100%; max-width: 420px; position: relative;
          background: rgba(22,14,8,0.92);
          border: 1px solid rgba(212,175,99,0.18);
          border-radius: 16px; padding: 2.5rem 2rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: slideUp 0.5s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-top-bar {
          position: absolute; top: 0; left: 12%; right: 12%; height: 2px;
          background: linear-gradient(90deg, transparent, #d4af63, transparent);
          border-radius: 2px;
        }
        .login-brand { text-align: center; margin-bottom: 1.6rem; }
        .login-icon { font-size: 2.2rem; display: block; margin-bottom: 6px; }
        .login-title {
          font-family: 'Playfair Display', serif; font-size: 1.6rem;
          color: #d4af63; margin: 0 0 4px; font-weight: 700;
        }
        .login-sub { font-size: 0.82rem; color: rgba(212,175,99,0.4); letter-spacing: 0.08em; margin: 0; }
        .login-divider { display: flex; align-items: center; gap: 12px; margin: 1rem 0 1.4rem; }
        .login-divider-line { flex: 1; height: 1px; background: rgba(212,175,99,0.12); }
        .login-error {
          background: rgba(180,60,40,0.12); border: 1px solid rgba(180,60,40,0.3);
          border-radius: 8px; padding: 10px 14px; color: #e8917a;
          font-size: 0.84rem; text-align: center; margin-bottom: 1rem;
        }

        /* Method selector */
        .login-method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1rem; }
        .login-method-btn {
          padding: 14px 8px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,175,99,0.15); border-radius: 10px;
          color: rgba(230,216,181,0.6); font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .login-method-btn:hover { border-color: rgba(212,175,99,0.35); color: rgba(212,175,99,0.85); background: rgba(212,175,99,0.05); }
        .login-method-icon { font-size: 1.4rem; display: block; margin-bottom: 5px; }
        .login-method-label { font-size: 0.78rem; font-weight: 500; display: block; }
        .login-method-sub { font-size: 0.67rem; color: rgba(212,175,99,0.35); display: block; margin-top: 2px; }

        /* OTP step indicator */
        .login-step-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 1.1rem; }
        .login-step-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(212,175,99,0.2); transition: all 0.2s; }
        .login-step-dot.active { background: #d4af63; width: 20px; border-radius: 4px; }
        .login-step-dot.done { background: rgba(120,180,80,0.6); }

        /* Form elements */
        .login-field { margin-bottom: 1rem; }
        .login-label {
          display: block; font-size: 0.68rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(212,175,99,0.5); margin-bottom: 6px; font-weight: 500;
        }
        .login-input {
          width: 100%; padding: 11px 14px; box-sizing: border-box;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,99,0.15);
          border-radius: 8px; color: #f0e6d0; font-family: 'Poppins', sans-serif;
          font-size: 0.93rem; outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .login-input::placeholder { color: rgba(240,230,208,0.2); }
        .login-input:focus { border-color: rgba(212,175,99,0.4); background: rgba(255,255,255,0.06); }

        /* Phone row */
        .login-phone-row { display: flex; gap: 8px; align-items: center; }
        .login-phone-prefix {
          padding: 11px 12px; background: rgba(212,175,99,0.08);
          border: 1px solid rgba(212,175,99,0.15); border-radius: 8px;
          color: rgba(212,175,99,0.7); font-size: 0.9rem; white-space: nowrap;
        }

        /* OTP row */
        .login-otp-row { display: flex; gap: 10px; }
        .login-otp-input {
          flex: 1; padding: 12px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,99,0.15); border-radius: 8px;
          color: #f0e6d0; font-family: 'Poppins', sans-serif; font-size: 1.1rem;
          text-align: center; letter-spacing: 0.3em; outline: none;
        }
        .login-otp-input:focus { border-color: rgba(212,175,99,0.4); }
        .login-resend-btn {
          padding: 11px 16px; background: rgba(212,175,99,0.08);
          border: 1px solid rgba(212,175,99,0.22); border-radius: 8px;
          color: #d4af63; font-family: 'Poppins', sans-serif;
          font-size: 0.8rem; cursor: pointer; white-space: nowrap; transition: all 0.2s;
        }
        .login-resend-btn:hover { background: rgba(212,175,99,0.15); }
        .login-resend-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Buttons */
        .login-btn {
          width: 100%; padding: 13px; margin-top: 4px;
          background: linear-gradient(135deg, #d4af63, #8b5a2b);
          border: none; border-radius: 10px; color: #1a0f05;
          font-family: 'Poppins', sans-serif; font-size: 0.95rem;
          font-weight: 700; letter-spacing: 0.05em; cursor: pointer;
          box-shadow: 0 4px 20px rgba(212,175,99,0.3); transition: all 0.2s;
        }
        .login-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(212,175,99,0.4); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .login-btn-outline {
          width: 100%; padding: 11px; margin-top: 8px; background: transparent;
          border: 1px solid rgba(212,175,99,0.22); border-radius: 8px;
          color: rgba(212,175,99,0.65); font-family: 'Poppins', sans-serif;
          font-size: 0.88rem; cursor: pointer; transition: all 0.2s;
        }
        .login-btn-outline:hover { border-color: rgba(212,175,99,0.45); color: #d4af63; }

        .login-step-title {
          font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(212,175,99,0.38); text-align: center; margin-bottom: 1rem;
        }
        .login-google-wrap { display: flex; justify-content: center; margin: 4px 0 12px; }
        .login-footer { text-align: center; margin-top: 1.4rem; font-size: 0.84rem; color: rgba(240,230,208,0.35); }
        .login-footer a { color: #d4af63; text-decoration: none; font-weight: 500; border-bottom: 1px solid rgba(212,175,99,0.3); }
        .login-welcome { background: rgba(74,107,58,0.15); border: 1px solid rgba(120,180,80,0.3); border-radius: 10px; padding: 1.2rem 1rem; text-align: center; }
        .login-welcome-icon { font-size: 2rem; display: block; margin-bottom: 6px; }
        .login-welcome-text { color: rgba(120,180,80,0.9); font-size: 0.9rem; line-height: 1.5; margin: 0 0 4px; }
        .login-welcome-sub { color: rgba(212,175,99,0.5); font-size: 0.75rem; display: block; margin-bottom: 1rem; }

        @media (max-width: 480px) {
          .login-card { padding: 2rem 1.4rem; border-radius: 12px; }
          .login-title { font-size: 1.4rem; }
        }
      `}</style>

      <div className="login-wrap">
        <div className="login-card">
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

          {/* ── Welcome banner (first-time Google sign-up) ── */}
          {welcome && (
            <div className="login-welcome">
              <span className="login-welcome-icon">🌾</span>
              <p className="login-welcome-text">{welcome}</p>
              <span className="login-welcome-sub">A welcome SMS has been sent to your registered phone.</span>
              <button className="login-btn" onClick={() => navigate("/")}>Go to Home →</button>
            </div>
          )}

          {/* ── Choose method ── */}
          {!welcome && !method && (
            <>
              <p style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(212,175,99,0.38)", marginBottom: "1rem", letterSpacing: "0.08em" }}>
                Choose how to sign in
              </p>
              <div className="login-method-grid">
                <button className="login-method-btn" onClick={() => setMethod("email")}>
                  <span className="login-method-icon">✉️</span>
                  <span className="login-method-label">Email & Password</span>
                  <span className="login-method-sub">Classic login</span>
                </button>
                <button className="login-method-btn" onClick={() => setMethod("otp")}>
                  <span className="login-method-icon">📱</span>
                  <span className="login-method-label">Phone OTP</span>
                  <span className="login-method-sub">Verify via SMS</span>
                </button>
              </div>

              {/* Google — full width */}
              <div className="login-google-wrap">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError("Google Sign In Failed")}
                  theme="filled_black"
                  shape="pill"
                  text="signin_with"
                  width="340"
                />
              </div>

              <p className="login-footer">
                Don't have an account? <Link to="/register">Create one</Link>
              </p>
            </>
          )}

          {/* ══════════════════════════════════
               EMAIL + PASSWORD FLOW
          ══════════════════════════════════ */}
          {!welcome && method === "email" && (
            <>
              <form onSubmit={handleEmailLogin}>
                <div className="login-field">
                  <label className="login-label">Email Address</label>
                  <input
                    className="login-input" type="email" name="email"
                    placeholder="you@example.com"
                    value={form.email} onChange={handleChange} required
                  />
                </div>
                <div className="login-field">
                  <label className="login-label">Password</label>
                  <input
                    className="login-input" type="password" name="password"
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange} required
                  />
                </div>
                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In →"}
                </button>
              </form>
              <button className="login-btn-outline" onClick={() => { setMethod(null); resetState(); }}>
                ← Back
              </button>
            </>
          )}

          {/* ══════════════════════════════════
               OTP FLOW
          ══════════════════════════════════ */}
          {!welcome && method === "otp" && (
            <>
              <div className="login-step-row">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`login-step-dot ${step === s ? "active" : step > s ? "done" : ""}`}
                  />
                ))}
              </div>

              {/* Step 1 — Phone */}
              {step === 1 && (
                <>
                  <p className="login-step-title">Step 1 — Enter your phone number</p>
                  <div className="login-field">
                    <label className="login-label">Phone Number</label>
                    <div className="login-phone-row">
                      <span className="login-phone-prefix">+91</span>
                      <input
                        className="login-input" type="tel" name="phoneNumber"
                        placeholder="98765 43210"
                        value={form.phoneNumber} onChange={handleChange} maxLength={10}
                      />
                    </div>
                  </div>
                  <button className="login-btn" onClick={handleSendOtp} disabled={loading}>
                    {loading ? "Sending OTP..." : "Send OTP →"}
                  </button>
                  <button className="login-btn-outline" onClick={() => { setMethod(null); resetState(); }}>
                    ← Back
                  </button>
                </>
              )}

              {/* Step 2 — OTP */}
              {step === 2 && (
                <>
                  <p className="login-step-title">Step 2 — OTP sent to +91 {form.phoneNumber}</p>
                  <div className="login-field">
                    <label className="login-label">OTP Code</label>
                    <div className="login-otp-row">
                      <input
                        className="login-otp-input" type="tel"
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                      <button
                        className="login-resend-btn"
                        onClick={handleSendOtp}
                        disabled={loading}
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                  <button className="login-btn" onClick={handleVerifyAndLogin} disabled={loading}>
                    {loading ? "Verifying..." : "Verify & Sign In →"}
                  </button>
                  <button className="login-btn-outline" onClick={() => { setStep(1); setOtp(""); setError(""); }}>
                    ← Back
                  </button>
                </>
              )}
            </>
          )}

          {!welcome && method && (
            <p className="login-footer">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
