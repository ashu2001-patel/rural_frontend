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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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

          {/* User */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Coming Soon */}
          <Route path="/vet" element={<div style={{ minHeight: "100vh", background: "#0a0f06", display: "flex", alignItems: "center", justifyContent: "center", color: "#d4af63", fontFamily: "Playfair Display, serif", fontSize: "1.5rem" }}>🏥 Vet Service Coming Soon</div>} />
          <Route path="/my-tools" element={<MyListings />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;