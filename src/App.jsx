import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AnimalList from "./pages/AnimalList";
import PostAnimal from "./pages/PostAnimal";
import Profile from "./pages/Profile";
import ToolList from "./pages/Toollist";
import MyAnimals from "./pages/myanimal";
import PostTool from "./pages/PostTool";
import ToolDetail from "./pages/Tooldetails";
import AnimalDetail from "./pages/AnimalDetails"; // ✅ FIXED

// Add inside Routes:


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Animal Routes */}
          <Route path="/" element={<AnimalList />} />
          <Route path="/post-animal" element={<PostAnimal />} />
          <Route path="/tool/:id" element={<ToolDetail />} />

          {/* Tool Routes */}
          <Route path="/tools" element={<ToolList />} />
          <Route path="/post-tool" element={<PostTool />} />
<Route path="/animal/:id" element={<AnimalDetail />} /> 
          {/* User Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vet" element={<div>Vet Service Coming Soon</div>} />
<Route path="/plants" element={<div>Plants & Gardening Coming Soon</div>} />
<Route path="/my-tools" element={<div>My Tools Coming Soon</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;