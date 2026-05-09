import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const RequestsPage = () => {
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
    if (!window.confirm("Cancel request?")) return;
    await animalAPI.delete(`/request/${id}/cancel`);
    fetchAll();
  };

  const statusColor = (status) => {
    if (status === "accepted") return "#22c55e";
    if (status === "rejected") return "#ef4444";
    return "#f59e0b";
  };

  const tabs = [
    { key: "received", label: "📥 Received" },
    { key: "sent", label: "📤 Sent" },
   
  ];

  if (loading) {
    return <h2 style={{ textAlign: "center", color: "#fff" }}>Loading...</h2>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📋 Activity & History</h2>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              ...styles.tabButton,
              ...(tab === t.key ? styles.activeTab : {})
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.grid}>
        {tab === "received" &&
          (received.length === 0 ? (
            <p>No requests</p>
          ) : (
            received.map((r) => (
              <div key={r._id} style={styles.card}>
                <h3>{r.animalId?.name}</h3>
                <p>Buyer: {r.buyerName}</p>

                <p style={{ color: statusColor(r.status) }}>
                  {r.status.toUpperCase()}
                </p>

                <div style={styles.actions}>
                  {r.status === "pending" && (
                    <>
                      <button
                        style={styles.acceptBtn}
                        onClick={() => handleAccept(r._id)}
                      >
                        Accept
                      </button>
                      <button
                        style={styles.rejectBtn}
                        onClick={() => handleReject(r._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/animal/${r.animalId?._id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ))}

        {tab === "sent" &&
          (sent.length === 0 ? (
            <p>No sent requests</p>
          ) : (
            sent.map((r) => (
              <div key={r._id} style={styles.card}>
                <h3>{r.animalId?.name}</h3>

                <p style={{ color: statusColor(r.status) }}>
                  {r.status.toUpperCase()}
                </p>

                {r.status === "pending" && (
                  <button
                    style={styles.rejectBtn}
                    onClick={() => handleCancel(r._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          ))}

        {tab === "myanimals" &&
          (myAnimals.length === 0 ? (
            <p>No animals</p>
          ) : (
            myAnimals.map((a) => (
              <div key={a._id} style={styles.card}>
                <h3>{a.name}</h3>
                <p>₹{a.price}</p>

                <button
                  style={styles.viewBtn}
                  onClick={() => navigate(`/animal/${a._id}`)}
                >
                  View
                </button>
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