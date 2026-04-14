import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const MyListings = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchAnimals = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await animalAPI.get(`/animal/employer/${user.id}`);
      setAnimals(res?.data?.animals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAnimals();
  }, [user, navigate, fetchAnimals]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this animal listing?")) return;

    setDeletingId(id);
    try {
      await animalAPI.delete(`/animal/${id}`);
      setAnimals(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="ml-page">
      <h2 className="ml-title">🐄 My Animal Listings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : animals.length === 0 ? (
        <div className="ml-empty">
          <h3>No animals posted yet</h3>
          <button onClick={() => navigate("/post-animal")}>
            ＋ Post Animal
          </button>
        </div>
      ) : (
        <div className="ml-grid">
          {animals.map((item) => (
            <div key={item._id} className="ml-card">
              <img
                src={item.images?.[0] || "https://via.placeholder.com/280x160"}
                alt={item.name}
              />

              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <p>📍 {item.location}</p>

              <button onClick={() => navigate(`/animal/${item._id}`)}>
                View
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                disabled={deletingId === item._id}
              >
                {deletingId === item._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;