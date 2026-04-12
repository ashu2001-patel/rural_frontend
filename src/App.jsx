import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AnimalList from "./pages/AnimalList";
import PostAnimal from "./pages/PostAnimal";
import Profile from "./pages/Profile";
import ToolList from "./pages/Toollist";
import PostTool from "./pages/PostTool";
import ToolDetail from "./pages/Tooldetails";
import AnimalDetail from "./pages/AnimalDetails";
import PlantList from "./pages/PlantList";
import PlantDetail from "./pages/PlantDetails";
import PostPlant from "./pages/PostPlant";
import MyListings from "./pages/MyListings";

const ComingSoon = ({ title, icon }) => (
  <div style={{
    minHeight: "100vh",
    background: "#0f0a05",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "2rem"
  }}>
    <span style={{ fontSize: "3rem" }}>{icon}</span>
    <h2 style={{
      fontFamily: "'Playfair Display', serif",
      color: "#d4af63",
      fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
      textAlign: "center",
      margin: 0
    }}>
      {title}
    </h2>
    <p style={{
      color: "rgba(212,175,99,0.4)",
      fontSize: "0.85rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      textAlign: "center"
    }}>
      Coming Soon
    </p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global mobile meta */}
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { font-size: 16px; -webkit-text-size-adjust: 100%; }
          body { overflow-x: hidden; }
          img { max-width: 100%; }
          input, textarea, select, button {
            font-family: inherit;
            -webkit-appearance: none;
            border-radius: 0;
          }
          a { -webkit-tap-highlight-color: transparent; }
        `}</style>

        <Navbar />
        <Routes>
          {/* Animal */}
          <Route path="/" element={<AnimalList />} />
          <Route path="/animal/:id" element={<AnimalDetail />} />
          <Route path="/post-animal" element={<PostAnimal />} />

          {/* Tools */}
          <Route path="/tools" element={<ToolList />} />
          <Route path="/tool/:id" element={<ToolDetail />} />
          <Route path="/post-tool" element={<PostTool />} />

          {/* Plants */}
          <Route path="/plants" element={<PlantList />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/post-plant" element={<PostPlant />} />

          {/* My Listings */}
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/my-animals" element={<MyListings />} />
          <Route path="/my-tools" element={<MyListings />} />

          {/* User */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Coming Soon */}
          <Route path="/vet" element={<ComingSoon title="Vet Consultation Service" icon="🏥" />} />

          {/* 404 */}
          <Route path="*" element={<ComingSoon title="Page Not Found" icon="🌾" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;