import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";

const PostAnimal = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    location: "",
    contact: ""
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔥 Handle images with limit
  const handleImages = (files) => {
    const selected = Array.from(files).slice(0, 5);
    setImages(selected);
  };

  // 🔥 Handle videos with limit
  const handleVideos = (files) => {
    const selected = Array.from(files).slice(0, 2);
    setVideos(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key =>
        formData.append(key, form[key])
      );

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
    <div style={s.wrap}>
      <div style={s.card}>
        <h2 style={s.title}>🌾 Post Your Animal</h2>

        {error && <p style={s.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={s.input}
            type="text"
            name="name"
            placeholder="Animal Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            style={s.input}
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            required
          />

          <textarea
            style={{ ...s.input, height: "80px" }}
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            style={s.input}
            type="text"
            name="location"
            placeholder="Village / City"
            value={form.location}
            onChange={handleChange}
            required
          />

          <input
            style={s.input}
            type="text"
            name="contact"
            placeholder="Phone Number"
            value={form.contact}
            onChange={handleChange}
            required
          />

          {/* 🔥 IMAGE UPLOAD */}
          <label style={s.label}>Upload Images (max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImages(e.target.files)}
          />

          <div style={s.previewWrap}>
            {images.map((img, i) => (
              <div key={i} style={s.previewItem}>
                <img
                  src={URL.createObjectURL(img)}
                  alt=""
                  style={s.previewImg}
                />
              </div>
            ))}
          </div>

          {/* 🔥 VIDEO UPLOAD */}
          <label style={s.label}>Upload Videos (max 2)</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleVideos(e.target.files)}
          />

          <div style={s.previewWrap}>
            {videos.map((vid, i) => (
              <video key={i} src={URL.createObjectURL(vid)} style={s.previewVideo} controls />
            ))}
          </div>

          <button style={s.btn} disabled={loading}>
            {loading ? "Posting..." : "Post Animal"}
          </button>
        </form>
      </div>
    </div>
  );
};

const s = {
  wrap: {
    display: "flex",
    justifyContent: "center",
    padding: "30px",
    background: "#1a120b",
    minHeight: "100vh"
  },

  card: {
    background: "#2c1f14",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    color: "#fff"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#d4af63"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "none"
  },

  label: {
    fontSize: "13px",
    marginTop: "10px",
    marginBottom: "5px",
    display: "block",
    color: "#ccc"
  },

  previewWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "10px"
  },

  previewItem: {
    position: "relative"
  },

  previewImg: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px"
  },

  previewVideo: {
    width: "120px",
    borderRadius: "6px"
  },

  btn: {
    width: "100%",
    padding: "12px",
    background: "#d4af63",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  },

  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px"
  }
};

export default PostAnimal;