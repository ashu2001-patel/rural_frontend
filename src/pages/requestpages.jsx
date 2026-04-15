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
        animalAPI.get("/seller/requests"),
        animalAPI.get("/buyer/requests"),
        animalAPI.get(`/animal/employer/${user?.id}`)
      ]);

      setReceived(sellerRes?.data?.requests || []);
      setSent(buyerRes?.data?.requests || []);
      setMyAnimals(animalsRes?.data?.animals || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ACTIONS
  const handleAccept = async (id) => {
    try {
      await animalAPI.patch(`/request/${id}/accept`);
      fetchAll(); // reload
    } catch {
      alert("Failed to accept");
    }
  };

  const handleReject = async (id) => {
    try {
      await animalAPI.patch(`/request/${id}/reject`);
      fetchAll();
    } catch {
      alert("Failed to reject");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel request?")) return;
    try {
      await animalAPI.delete(`/request/${id}/cancel`);
      fetchAll();
    } catch {
      alert("Failed to cancel");
    }
  };

  const statusColor = (status) => {
    if (status === "accepted") return "green";
    if (status === "rejected") return "red";
    return "orange";
  };

  const TABS = [
    { key: "received", label: "📥 Received" },
    { key: "sent", label: "📤 Sent" },
    { key: "myanimals", label: "🐄 My Animals" }
  ];

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>📋 Activity & History</h2>

      {/* Tabs */}
      <div style={{ marginBottom: "20px" }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              marginRight: 10,
              padding: 8,
              background: tab === t.key ? "#d4af63" : "#222",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* RECEIVED */}
      {tab === "received" && (
        <div>
          {received.length === 0 ? <p>No requests</p> : received.map(r => (
            <div key={r._id} style={{ border: "1px solid #444", padding: 10, marginBottom: 10 }}>
              <h3>{r.animalId?.name}</h3>
              <p>Buyer: {r.buyerName}</p>
              <p>Status: <span style={{ color: statusColor(r.status) }}>{r.status}</span></p>

              {r.status === "pending" && (
                <>
                  <button onClick={() => handleAccept(r._id)}>Accept</button>
                  <button onClick={() => handleReject(r._id)}>Reject</button>
                </>
              )}

              <button onClick={() => navigate(`/animal/${r.animalId?._id}`)}>View</button>
            </div>
          ))}
        </div>
      )}

      {/* SENT */}
      {tab === "sent" && (
        <div>
          {sent.length === 0 ? <p>No sent requests</p> : sent.map(r => (
            <div key={r._id} style={{ border: "1px solid #444", padding: 10, marginBottom: 10 }}>
              <h3>{r.animalId?.name}</h3>
              <p>Status: {r.status}</p>

              {r.status === "pending" && (
                <button onClick={() => handleCancel(r._id)}>Cancel</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MY ANIMALS */}
      {tab === "myanimals" && (
        <div>
          {myAnimals.length === 0 ? <p>No animals</p> : myAnimals.map(a => (
            <div key={a._id} style={{ border: "1px solid #444", padding: 10, marginBottom: 10 }}>
              <h3>{a.name}</h3>
              <p>₹{a.price}</p>
              <button onClick={() => navigate(`/animal/${a._id}`)}>View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;