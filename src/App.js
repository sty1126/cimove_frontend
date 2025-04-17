import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import ConsultaProducto from "./pages/ConsultaProducto";
import RegistroProducto from "./pages/RegistroProducto";
import DetallesProducto from "./pages/DetallesProducto";
import ActualizarProducto from "./pages/ActualizarProducto";
import AnadirNovedad from "./pages/AnadirNovedad";
import AnadirStock from "./pages/AnadirStock";
import AsociarProveedores from "./pages/AsociarProveedores";
import ListaProveedores from "./pages/ListaProveedores";
import DetallesProveedor from "./pages/DetallesProveedor";
import RegistroProveedor from "./pages/RegistroProveedor";
import ActualizarProveedor from "./pages/ActualizarProveedor";
import Catalogo from "./pages/Catalogo";
import FacturacionProveedor from "./pages/FacturacionProveedor";
import ProcesarPedido from "./pages/ProcesarPedido";
import ListaClientes from "./pages/ListaClientes";
import ActualizarCliente from "./pages/ActualizarCliente";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="content">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route
                path="/productos-vendidos"
                element={<ConsultaProducto />}
              />
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
              <Route path="/proveedores/:id" element={<DetallesProveedor />} />
              <Route
                path="/registro-proveedor"
                element={<RegistroProveedor />}
              />
              <Route
                path="/actualizar-proveedor/:id"
                element={<ActualizarProveedor />}
              />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route
                path="/facturacion-proveedor"
                element={<FacturacionProveedor />}
              />
              <Route path="/procesar-pedido" element={<ProcesarPedido />} />
              <Route path="/clientes" element={<ListaClientes />} />
              <Route
                path="/actualizar-cliente/:id"
                element={<ActualizarCliente />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}
export default App;
