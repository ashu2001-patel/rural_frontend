import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const RequestsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [myAnimals, setMyAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [sellerRes, buyerRes, animalsRes] = await Promise.all([
        animalAPI.get("/request/seller/requests"),
        animalAPI.get("/request/buyer/requests")
      ]);

      setReceived(sellerRes?.data?.requests || []);
      setSent(buyerRes?.data?.requests || []);
    
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    await animalAPI.patch(`/request/${id}/accept`);
    fetchAll();
  };

  const handleReject = async (id) => {
    await animalAPI.patch(`/request/${id}/reject`);
    fetchAll();
  };

  const handleCancel = async (id) => {
    if (!window.confirm(t("requests.actions.cancel") + "?")) return;
    await animalAPI.delete(`/request/${id}/cancel`);
    fetchAll();
  };

  const statusColor = (status) => {
    if (status === "accepted") return "#22c55e";
    if (status === "rejected") return "#ef4444";
    return "#f59e0b";
  };

  const statusLabel = (status) => {
    return t(`requests.status.${status}`, status);
  };

  const tabs = [
    { key: "received", label: `📥 ${t("requests.tabs.received")}` },
    { key: "sent", label: `📤 ${t("requests.tabs.sent")}` },
  ];

  if (loading) {
    return <h2 style={{ textAlign: "center", color: "#fff" }}>{t("common.loading")}</h2>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📋 {t("requests.title")}</h2>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            style={{
              ...styles.tabButton,
              ...(tab === tabItem.key ? styles.activeTab : {})
            }}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.grid}>
        {tab === "received" &&
          (received.length === 0 ? (
            <p>{t("requests.empty.received")}</p>
          ) : (
            received.map((r) => (
              <div key={r._id} style={styles.card}>
                <h3>{r.animalId?.name}</h3>
                <p>{t("requests.fields.buyer")}: {r.buyerName}</p>

                <p style={{ color: statusColor(r.status) }}>
                  {statusLabel(r.status).toUpperCase()}
                </p>

                <div style={styles.actions}>
                  {r.status === "pending" && (
                    <>
                      <button
                        style={styles.acceptBtn}
                        onClick={() => handleAccept(r._id)}
                      >
                        {t("requests.actions.accept")}
                      </button>
                      <button
                        style={styles.rejectBtn}
                        onClick={() => handleReject(r._id)}
                      >
                        {t("requests.actions.reject")}
                      </button>
                    </>
                  )}

                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/animal/${r.animalId?._id}`)}
                  >
                    {t("common.view")}
                  </button>
                </div>
              </div>
            ))
          ))}

        {tab === "sent" &&
          (sent.length === 0 ? (
            <p>{t("requests.empty.sent")}</p>
          ) : (
            sent.map((r) => (
              <div key={r._id} style={styles.card}>
                <h3>{r.animalId?.name}</h3>

                <p style={{ color: statusColor(r.status) }}>
                  {statusLabel(r.status).toUpperCase()}
                </p>

                {r.status === "pending" && (
                  <button
                    style={styles.rejectBtn}
                    onClick={() => handleCancel(r._id)}
                  >
                    {t("requests.actions.cancel")}
                  </button>
                )}
              </div>
            ))
          ))}
      </div>
    </div>
  );
};

export default RequestsPage;

const styles = {
  container: {
    padding: "16px",
    color: "#fff",
    maxWidth: "1200px",
    margin: "auto"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px"
  },
  tabButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#333",
    color: "#fff",
    cursor: "pointer"
  },
  activeTab: {
    background: "#d4af63",
    color: "#000"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px"
  },
  card: {
    background: "#1f1f1f",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
  },
  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  acceptBtn: {
    background: "#22c55e",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  rejectBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  viewBtn: {
    background: "#3b82f6",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};