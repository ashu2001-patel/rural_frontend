import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { userAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { t } = useTranslation();
  const [method, setMethod] = useState(null); // "otp" | "gmail"
  const [step, setStep] = useState(1);        // 1=phone, 2=otp, 3=details
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    phoneNumber: "", address: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [welcome, setWelcome] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ─── Normalise phone: strip non-digits, remove leading 0 ───
  const normalisePhone = (raw) => raw.replace(/\D/g, "").replace(/^0+/, "");

  // ─── Step 1: Send OTP ───────────────────────────────────────
  const handleSendOtp = async () => {
    const digits = normalisePhone(form.phoneNumber);
    if (digits.length !== 10) {
      setError(t("auth.errors.validPhone"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await userAPI.post("/users/send-otp", { phoneNumber: digits });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || t("auth.errors.otpFailed"));
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Verify OTP ────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) { setError(t("auth.errors.enterOtp")); return; }
    setLoading(true);
    setError("");
    try {
      await userAPI.post("/users/verify-otp", {
        phoneNumber: normalisePhone(form.phoneNumber),
        otp,
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || t("auth.errors.otpInvalid"));
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Register after OTP (phone-login endpoint) ─────
  // This creates the user account with all their details
  const handleOtpRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError(t("auth.errors.fillRequired"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Use /phone-login — backend creates user if not exists
      const res = await userAPI.post("/users/phone-login", {
        phoneNumber: normalisePhone(form.phoneNumber),
        name: form.name,
        email: form.email,
        address: form.address,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      if (res.data.isNewUser) setWelcome(t("auth.welcome.message", { name: res.data.user.name }));
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.errors.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  // ─── Gmail manual form register ────────────────────────────
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError(t("auth.errors.fillRequired"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber || undefined,
        address: form.address || undefined,
      });
      login(res.data.user, res.data.token);
      if (res.data.isNewUser) setWelcome(t("auth.welcome.message", { name: res.data.user.name }));
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.errors.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  // ─── Google one-click ───────────────────────────────────────
  const handleGoogleRegister = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.post("/users/google-login", {
        credential: credentialResponse.credential,
      });
      login(res.data.user, res.data.token);
      if (res.data.isNewUser) setWelcome(t("auth.welcome.message", { name: res.data.user.name }));
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.errors.googleSignupFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        .reg-wrap { min-height: 100vh; background: #1a120b; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; position: relative; overflow: hidden; font-family: 'Poppins', sans-serif; }
        .reg-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 80% 80%, rgba(74,107,58,0.2) 0%, transparent 60%), radial-gradient(ellipse at 20% 20%, rgba(139,90,43,0.2) 0%, transparent 60%); pointer-events: none; }
        .reg-card { position: relative; z-index: 10; width: 100%; max-width: 460px; background: rgba(30,20,12,0.9); border: 1px solid rgba(212,175,99,0.18); border-radius: 12px; padding: 2.5rem 2rem; }
        .reg-top-line { position: absolute; top: 0; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent, #d4af63, transparent); border-radius: 2px; }
        .reg-brand { text-align: center; margin-bottom: 1.5rem; }
        .reg-icon { font-size: 1.8rem; display: block; margin-bottom: 4px; }
        .reg-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #d4af63; display: block; }
        .reg-sub { font-size: 0.75rem; color: rgba(212,175,99,0.4); letter-spacing: 0.15em; text-transform: uppercase; display: block; margin-top: 3px; }
        .reg-divider { display: flex; align-items: center; gap: 12px; margin: 1rem 0 1.4rem; }
        .reg-divider-line { flex: 1; height: 1px; background: rgba(212,175,99,0.12); }
        .reg-error { background: rgba(180,60,40,0.12); border: 1px solid rgba(180,60,40,0.25); border-radius: 8px; padding: 9px 12px; color: #e8917a; font-size: 0.84rem; text-align: center; margin-bottom: 1rem; }
        .reg-method-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.2rem; }
        .reg-method-btn { padding: 14px 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,99,0.15); border-radius: 10px; color: rgba(230,216,181,0.6); font-family: 'Poppins', sans-serif; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; text-align: center; }
        .reg-method-btn:hover { border-color: rgba(212,175,99,0.3); color: rgba(212,175,99,0.8); background: rgba(212,175,99,0.05); }
        .reg-method-icon { font-size: 1.4rem; display: block; margin-bottom: 5px; }
        .reg-method-label { font-size: 0.8rem; font-weight: 500; display: block; }
        .reg-method-sub { font-size: 0.68rem; color: rgba(212,175,99,0.4); display: block; margin-top: 2px; }
        .reg-step-indicator { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 1.2rem; }
        .reg-step-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(212,175,99,0.2); transition: all 0.2s; }
        .reg-step-dot.active { background: #d4af63; width: 20px; border-radius: 4px; }
        .reg-step-dot.done { background: rgba(120,180,80,0.6); }
        .reg-label { display: block; font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(212,175,99,0.5); margin-bottom: 5px; }
        .reg-input { width: 100%; padding: 10px 13px; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,99,0.15); border-radius: 8px; color: #f0e6d0; font-family: 'Poppins', sans-serif; font-size: 0.92rem; box-sizing: border-box; outline: none; transition: border-color 0.2s; }
        .reg-input::placeholder { color: rgba(240,230,208,0.2); }
        .reg-input:focus { border-color: rgba(212,175,99,0.4); background: rgba(255,255,255,0.06); }
        .reg-field { margin-bottom: 1rem; }
        .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .reg-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #d4af63, #8b5a2b); border: none; border-radius: 8px; color: #1a0f05; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.92rem; cursor: pointer; transition: all 0.2s; margin-top: 4px; }
        .reg-btn:hover { transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .reg-btn-outline { width: 100%; padding: 11px; background: transparent; border: 1px solid rgba(212,175,99,0.25); border-radius: 8px; color: rgba(212,175,99,0.7); font-family: 'Poppins', sans-serif; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
        .reg-btn-outline:hover { border-color: rgba(212,175,99,0.45); color: #d4af63; }
        .reg-otp-row { display: flex; gap: 10px; }
        .reg-otp-input { flex: 1; padding: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,99,0.15); border-radius: 8px; color: #f0e6d0; font-family: 'Poppins', sans-serif; font-size: 1.1rem; text-align: center; letter-spacing: 0.3em; outline: none; }
        .reg-otp-input:focus { border-color: rgba(212,175,99,0.4); }
        .reg-otp-btn { padding: 12px 18px; background: rgba(212,175,99,0.1); border: 1px solid rgba(212,175,99,0.25); border-radius: 8px; color: #d4af63; font-family: 'Poppins', sans-serif; font-size: 0.82rem; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .reg-otp-btn:hover { background: rgba(212,175,99,0.18); }
        .reg-phone-row { display: flex; gap: 8px; align-items: center; }
        .reg-phone-prefix { padding: 10px 12px; background: rgba(212,175,99,0.08); border: 1px solid rgba(212,175,99,0.15); border-radius: 8px; color: rgba(212,175,99,0.7); font-size: 0.9rem; white-space: nowrap; }
        .reg-step-title { font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(212,175,99,0.4); text-align: center; margin-bottom: 1rem; }
        .reg-success-check { width: 44px; height: 44px; border-radius: 50%; background: rgba(74,107,58,0.2); border: 2px solid rgba(120,180,80,0.4); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin: 0 auto 8px; }
        .reg-login { text-align: center; margin-top: 1.2rem; font-size: 0.84rem; color: rgba(240,230,208,0.35); }
        .reg-login a { color: #d4af63; text-decoration: none; border-bottom: 1px solid rgba(212,175,99,0.3); }
        .reg-google-wrap { display: flex; justify-content: center; margin-bottom: 4px; }
        .reg-required { color: rgba(232,145,122,0.7); margin-left: 2px; }
        .reg-welcome { background: rgba(74,107,58,0.15); border: 1px solid rgba(120,180,80,0.3); border-radius: 10px; padding: 1.2rem 1rem; text-align: center; margin-bottom: 1.2rem; }
        .reg-welcome-icon { font-size: 2rem; display: block; margin-bottom: 6px; }
        .reg-welcome-text { color: rgba(120,180,80,0.9); font-size: 0.9rem; line-height: 1.5; }
        .reg-welcome-sub { color: rgba(212,175,99,0.5); font-size: 0.75rem; margin-top: 6px; display: block; }
        @media (max-width: 480px) { .reg-card { padding: 2rem 1.4rem; } .reg-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="reg-wrap">
        <div className="reg-bg" />
        <div className="reg-card">
          <div className="reg-top-line" />

          <div className="reg-brand">
            <span className="reg-icon">🌾</span>
            <span className="reg-title">{t("auth.joinTitle")}</span>
            <span className="reg-sub">{t("auth.joinSub")}</span>
          </div>

          <div className="reg-divider">
            <div className="reg-divider-line" />
            <span style={{ color: "rgba(74,107,58,0.7)", fontSize: 13 }}>🌿</span>
            <div className="reg-divider-line" />
          </div>

          {error && <div className="reg-error">{error}</div>}

          {/* ── Welcome banner (shown after new registration) ── */}
          {welcome && (
            <div className="reg-welcome">
              <span className="reg-welcome-icon">🌾</span>
              <p className="reg-welcome-text">{welcome}</p>
              <span className="reg-welcome-sub">{t("auth.welcome.smsSentShort")}</span>
              <button className="reg-btn" style={{ marginTop: "1rem" }} onClick={() => navigate("/")}>
                {t("auth.buttons.goHome")}
              </button>
            </div>
          )}

          {/* ── Choose method ── */}
          {!welcome && !method && (
            <>
              <p style={{ textAlign: "center", fontSize: "0.82rem", color: "rgba(212,175,99,0.4)", marginBottom: "1rem", letterSpacing: "0.08em" }}>
                {t("auth.chooseRegisterMethod")}
              </p>
              <div className="reg-method-row">
                <button className="reg-method-btn" onClick={() => { setMethod("otp"); setStep(1); }}>
                  <span className="reg-method-icon">📱</span>
                  <span className="reg-method-label">{t("auth.method.registerOtp")}</span>
                  <span className="reg-method-sub">{t("auth.method.registerOtpSub")}</span>
                </button>
                <button className="reg-method-btn" onClick={() => setMethod("gmail")}>
                  <span className="reg-method-icon">✉️</span>
                  <span className="reg-method-label">{t("auth.method.emailGoogle")}</span>
                  <span className="reg-method-sub">{t("auth.method.emailGoogleSub")}</span>
                </button>
              </div>
              <p className="reg-login">
                {t("auth.footer.alreadyHaveAccount")} <Link to="/login">{t("auth.footer.signIn")}</Link>
              </p>
            </>
          )}

          {/* ══════════════════════════════════
               OTP FLOW
          ══════════════════════════════════ */}
          {!welcome && method === "otp" && (
            <>
              <div className="reg-step-indicator">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`reg-step-dot ${step === s ? "active" : step > s ? "done" : ""}`}
                  />
                ))}
              </div>

              {/* Step 1 — Phone */}
              {step === 1 && (
                <>
                  <p className="reg-step-title">{t("auth.step.step1Phone")}</p>
                  <div className="reg-field">
                    <label className="reg-label">{t("auth.fields.phone")} <span className="reg-required">*</span></label>
                    <div className="reg-phone-row">
                      <span className="reg-phone-prefix">+91</span>
                      <input
                        className="reg-input"
                        type="tel"
                        name="phoneNumber"
                        placeholder={t("auth.fields.phonePlaceholder")}
                        value={form.phoneNumber}
                        onChange={handleChange}
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <button className="reg-btn" onClick={handleSendOtp} disabled={loading}>
                    {loading ? t("auth.buttons.sendingOtp") : t("auth.buttons.sendOtp")}
                  </button>
                  <button className="reg-btn-outline" onClick={() => setMethod(null)}>{t("auth.buttons.back")}</button>
                </>
              )}

              {/* Step 2 — OTP */}
              {step === 2 && (
                <>
                  <p className="reg-step-title">{t("auth.step.step2OtpSent", { phone: form.phoneNumber })}</p>
                  <div className="reg-field">
                    <label className="reg-label">{t("auth.fields.otpCode")} <span className="reg-required">*</span></label>
                    <div className="reg-otp-row">
                      <input
                        className="reg-otp-input"
                        type="tel"
                        placeholder={t("auth.fields.otpPlaceholder")}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                      <button className="reg-otp-btn" onClick={handleSendOtp} disabled={loading}>
                        {t("auth.buttons.resend")}
                      </button>
                    </div>
                  </div>
                  <button className="reg-btn" onClick={handleVerifyOtp} disabled={loading}>
                    {loading ? t("auth.buttons.verifying") : t("auth.buttons.verifyOtp")}
                  </button>
                  <button className="reg-btn-outline" onClick={() => { setStep(1); setOtp(""); setError(""); }}>
                    {t("auth.buttons.back")}
                  </button>
                </>
              )}

              {/* Step 3 — Fill details */}
              {step === 3 && (
                <>
                  <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <div className="reg-success-check">✅</div>
                    <p style={{ fontSize: "0.78rem", color: "rgba(120,180,80,0.7)", letterSpacing: "0.1em" }}>
                      {t("auth.step.phoneVerified")}
                    </p>
                  </div>
                  <p className="reg-step-title">{t("auth.step.step3Profile")}</p>
                  <form onSubmit={handleOtpRegister}>
                    <div className="reg-row">
                      <div className="reg-field">
                        <label className="reg-label">{t("auth.fields.name")} <span className="reg-required">*</span></label>
                        <input className="reg-input" type="text" name="name" placeholder={t("auth.fields.namePlaceholder")}
                          value={form.name} onChange={handleChange} required />
                      </div>
                      <div className="reg-field">
                        <label className="reg-label">{t("auth.fields.email")} <span className="reg-required">*</span></label>
                        <input className="reg-input" type="email" name="email" placeholder={t("auth.fields.emailPlaceholder")}
                          value={form.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">{t("auth.fields.address")}</label>
                      <input className="reg-input" type="text" name="address" placeholder={t("auth.fields.addressPlaceholder")}
                        value={form.address} onChange={handleChange} />
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">{t("auth.fields.password")} <span className="reg-required">*</span></label>
                      <input className="reg-input" type="password" name="password" placeholder={t("auth.fields.passwordPlaceholder")}
                        value={form.password} onChange={handleChange} required />
                    </div>
                    <button className="reg-btn" type="submit" disabled={loading}>
                      {loading ? t("auth.buttons.creatingAccount") : t("auth.buttons.createAccount")}
                    </button>
                  </form>
                </>
              )}
            </>
          )}

          {/* ══════════════════════════════════
               GMAIL FLOW
          ══════════════════════════════════ */}
          {!welcome && method === "gmail" && (
            <>
              <p className="reg-step-title">{t("auth.step.signupGoogleOrEmail")}</p>

              {/* Option A — Google one-click */}
              <div className="reg-google-wrap">
                <GoogleLogin
                  onSuccess={handleGoogleRegister}
                  onError={() => setError(t("auth.errors.googleFailed"))}
                  theme="filled_black"
                  shape="pill"
                  text="signup_with"
                />
              </div>

              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(212,175,99,0.3)", margin: "12px 0", letterSpacing: "0.08em" }}>
                {t("auth.step.orFillManually")}
              </p>

              {/* Option B — Manual email form */}
              <form onSubmit={handleEmailRegister}>
                <div className="reg-row">
                  <div className="reg-field">
                    <label className="reg-label">{t("auth.fields.name")} <span className="reg-required">*</span></label>
                    <input className="reg-input" type="text" name="name" placeholder={t("auth.fields.namePlaceholder")}
                      value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">{t("auth.fields.phone")}</label>
                    <input className="reg-input" type="tel" name="phoneNumber" placeholder={t("auth.fields.phonePlaceholder")}
                      value={form.phoneNumber} onChange={handleChange} maxLength={10} />
                  </div>
                </div>
                <div className="reg-field">
                  <label className="reg-label">{t("auth.fields.email")} <span className="reg-required">*</span></label>
                  <input className="reg-input" type="email" name="email" placeholder={t("auth.fields.emailGmailPlaceholder")}
                    value={form.email} onChange={handleChange} required />
                </div>
                <div className="reg-field">
                  <label className="reg-label">{t("auth.fields.address")}</label>
                  <input className="reg-input" type="text" name="address" placeholder={t("auth.fields.addressPlaceholder")}
                    value={form.address} onChange={handleChange} />
                </div>
                <div className="reg-field">
                  <label className="reg-label">{t("auth.fields.password")} <span className="reg-required">*</span></label>
                  <input className="reg-input" type="password" name="password" placeholder={t("auth.fields.passwordPlaceholder")}
                    value={form.password} onChange={handleChange} required />
                </div>
                <button className="reg-btn" type="submit" disabled={loading}>
                  {loading ? t("auth.buttons.creatingAccount") : t("auth.buttons.createAccount")}
                </button>
              </form>

              <button className="reg-btn-outline" onClick={() => { setMethod(null); setError(""); }}>
                {t("auth.buttons.back")}
              </button>
            </>
          )}

          {!welcome && method && (
            <p className="reg-login">
              {t("auth.footer.alreadyHaveAccount")} <Link to="/login">{t("auth.footer.signIn")}</Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
