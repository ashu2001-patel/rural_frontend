import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";

const PostAnimal = () => {
  const [form, setForm] = useState({ name: "", price: "", description: "", location: "", contact: "" });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      images.forEach(img => formData.append("images", img));
      videos.forEach(vid => formData.append("videos", vid));

      await animalAPI.post("/animal", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post animal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Post Animal</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" name="name" placeholder="Animal Name" value={form.name} onChange={handleChange} required />
          <input style={styles.input} type="number" name="price" placeholder="Price (₹)" value={form.price} onChange={handleChange} required />
          <textarea style={{...styles.input, height: "80px"}} name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input style={styles.input} type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
          <input style={styles.input} type="text" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} required />

          <label style={styles.label}>Upload Images (max 5)</label>
          <input style={styles.input} type="file" accept="image/*" multiple onChange={e => setImages([...e.target.files])} />

          <label style={styles.label}>Upload Videos (max 2)</label>
          <input style={styles.input} type="file" accept="video/*" multiple onChange={e => setVideos([...e.target.files])} />

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Animal"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "24px", background: "#f5f5f5", minHeight: "90vh" },
  card: { background: "white", padding: "32px", borderRadius: "12px", width: "100%", maxWidth: "500px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", height: "fit-content" },
  title: { textAlign: "center", marginBottom: "24px", color: "#1a1a2e" },
  input: { width: "100%", padding: "10px", marginBottom: "14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
  label: { fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" },
  btn: { width: "100%", padding: "12px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  error: { color: "red", textAlign: "center", marginBottom: "12px" }
};

export default PostAnimal;