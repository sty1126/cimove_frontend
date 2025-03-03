import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import Prueba from "./pages/Prueba";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/prueba" element={<Prueba />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
