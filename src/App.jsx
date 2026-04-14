import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AnimalList from "./pages/AnimalList";
import PostAnimal from "./pages/PostAnimal";
import Profile from "./pages/Profile";
import AnimalDetail from "./pages/AnimalDetails";
import MyAnimals from "./pages/MyAnimals";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { font-size: 16px; -webkit-text-size-adjust: 100%; }
          body { overflow-x: hidden; background: #0f0a05; }
          img { max-width: 100%; }
          input, textarea, select, button { font-family: inherit; -webkit-appearance: none; }
          a { -webkit-tap-highlight-color: transparent; }
        `}</style>
        <Navbar />
        <Routes>
          <Route path="/" element={<AnimalList />} />
          <Route path="/animal/:id" element={<AnimalDetail />} />
          <Route path="/post-animal" element={<PostAnimal />} />
          <Route path="/my-animals" element={<MyAnimals />} />
          <Route path="/my-listings" element={<MyAnimals />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<AnimalList />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;