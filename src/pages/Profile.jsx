import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: "40px" }}>{t("profile.loginPrompt")}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
        <h2 style={styles.name}>{user.name}</h2>
        <p style={styles.email}>{user.email}</p>
        <div style={styles.divider} />
        <div style={styles.row}><span style={styles.label}>{t("profile.fields.role")}</span><span>{user.role || t("profile.roleDefault")}</span></div>
        <div style={styles.row}><span style={styles.label}>{t("profile.fields.id")}</span><span style={{ fontSize: "12px", color: "#999" }}>{user._id || user.id}</span></div>
        <div style={{ ...styles.row, justifyContent: "space-between", alignItems: "center" }}>
          <span style={styles.label}>{t("language.label")}</span>
          <LanguageToggle />
        </div>
        <button style={styles.btn} onClick={handleLogout}>{t("profile.logout")}</button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh", background: "#f5f5f5" },
  card: { background: "white", padding: "32px", borderRadius: "12px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" },
  avatar: { width: "80px", height: "80px", borderRadius: "50%", background: "#1a1a2e", color: "white", fontSize: "32px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
  name: { margin: "0 0 4px", color: "#1a1a2e" },
  email: { color: "#666", margin: "0 0 20px" },
  divider: { height: "1px", background: "#eee", margin: "16px 0" },
  row: { display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" },
  label: { color: "#666" },
  btn: { width: "100%", padding: "12px", background: "#e74c3c", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", marginTop: "16px" }
};

export default Profile;