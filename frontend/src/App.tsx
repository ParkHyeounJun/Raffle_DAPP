import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Raffle from "./pages/Raffle";
import History from "./pages/History";
import "./App.css";

export default function App() {
  const location = useLocation();

  return (
    <div>
      <nav className="navbar">
        <h1 style={{ fontSize: "20px", fontWeight: 600 }}>Raffle DApp</h1>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/raffle">Raffle</Link>
          <Link to="/history">History</Link>
        </div>
      </nav>

      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/raffle" element={<Raffle />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </div>
  );
}