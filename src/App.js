import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import ConsultaProducto from "./pages/ConsultaProducto";
import RegistroProducto from "./pages/RegistroProducto";
import ListaProducto from "./pages/ListaProducto";
import ActualizarProducto from "./pages/ActualizarProducto";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="content">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/productos-vendidos" element={<ConsultaProducto />} />
            <Route path="/registro-producto" element={<RegistroProducto />} />
            <Route
              path="/actualizar-producto/:id"
              element={<ActualizarProducto />}
            />
            <Route
              path="/actualizar-producto"
              element={<ActualizarProducto />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
