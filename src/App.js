import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import ConsultaProducto from "./pages/ConsultaProducto";
import RegistroProducto from "./pages/RegistroProducto";
import ListaProducto from "./pages/ListaProducto";
import DetallesProducto from "./pages/DetallesProducto";
import ActualizarProducto from "./pages/ActualizarProducto";
import AnadirNovedad from "./pages/AnadirNovedad";
import AnadirStock from "./pages/AnadirStock";
import AsociarProveedores from "./pages/AsociarProveedores";
import ListaProveedores from "./pages/ListaProveedores";
import DetallesProveedor from "./pages/DetallesProveedor";
import RegistroProveedor from "./pages/RegistroProveedor";
import ActualizarProveedor from "./pages/ActualizarProveedor";

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
              path="/detalles-producto/:productoId"
              element={<DetallesProducto />}
            />
            <Route
              path="/actualizar-producto/:id"
              element={<ActualizarProducto />}
            />
            <Route path="/anadir-novedad" element={<AnadirNovedad />} />
            <Route path="/anadir-stock" element={<AnadirStock />} />
            <Route
              path="/asociar-proveedores/:idProducto"
              element={<AsociarProveedores />}
            />
            <Route path="/proveedores" element={<ListaProveedores />} />
            <Route
              path="/proveedores/:id"
              element={<DetallesProveedor />}
            />
            <Route
              path="/registro-proveedor"
              element={<RegistroProveedor />}
            />
            <Route
              path="/actualizar-proveedor/:id"
              element={<ActualizarProveedor />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
