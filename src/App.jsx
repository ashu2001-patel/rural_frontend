import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AnimalList from "./pages/AnimalList";
import PostAnimal from "./pages/PostAnimal";
import Profile from "./pages/Profile";
import AnimalDetail from "./pages/AnimalDetails";
import MyAnimals from "./pages/myanimal";
import RequestsPage from "./pages/requestpages";
import Dashboard from "./pages/Dashboard";
import TransactionHistory from "./pages/TransactionHistory";

import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const ComingSoon = ({ title }) => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#d4af63",
      fontSize: "20px",
    }}
  >
    {title}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh"
          }}
        >
          <Navbar />

          <div style={{ flex: 1, padding: "10px" }}>
            <Routes>

              {/* Home */}
              <Route path="/" element={<AnimalList />} />
              <Route path="/animal/:id" element={<AnimalDetail />} />
              <Route path="/post-animal" element={<PostAnimal />} />

              {/* My Listings */}
              <Route path="/my-listings" element={<MyAnimals />} />
              <Route path="/my-animals" element={<MyAnimals />} />

              {/* Requests */}
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/history" element={<RequestsPage />} />

              {/* Dashboard & Transactions */}
              <Route path="/dashboard"    element={<Dashboard />} />
              <Route path="/transactions" element={<TransactionHistory />} />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Profile */}
              <Route path="/profile" element={<Profile />} />

              {/* Legal */}
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Fallback */}
              <Route
                path="*"
                element={<ComingSoon title="Page Not Found" />}
              />

            </Routes>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;