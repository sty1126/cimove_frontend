import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

import Layout from "./components/Layout";
import LandingPageNavbar from "./components/LandingNavbar";
import PrivateRoute from "./components/PrivateRoute"; // Importa el PrivateRoute

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
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
import CrearCliente from "./pages/CrearCliente";
import ActualizarCliente from "./pages/ActualizarCliente";
import DetalleCliente from "./pages/DetallesCliente";
import ListaEmpleados from "./pages/ListaEmpleados";
import CrearEmpleado from "./pages/CrearEmpleado";
import DetalleEmpleado from "./pages/DetallesEmpleado";
import ActualizarEmpleado from "./pages/ActualizarEmpleado";
import CrearFacturaProveedor from "./pages/CrearFacturaProveedor";
import PagosCompras from "./pages/PagosCompras";
import FormularioAbono from "./pages/FormularioAbono";
import Ventas from "./pages/Ventas";
import FacturaVenta from "./pages/FacturaVenta";
import ListaFacturacionVentas from "./pages/ListaFacturacionVentas";
import CrearFacturaServicioTecnico from "./pages/CrearFacturaServicioTecnico";
import Login from "./pages/Login";
import Estadisticas from "./pages/Estadisticas";

import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* LANDING PAGE */}
          <Route
            path="/"
            element={
              <>
                <LandingPageNavbar />
                <LandingPage />
              </>
            }
          />

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* TODAS LAS DEMÁS PÁGINAS */}
          <Route path="/*" element={<Layout />}>
            {/* Rutas protegidas por autenticación */}
            <Route path="home" element={<PrivateRoute element={<Home />} />} />
            <Route
              path="inventario"
              element={<PrivateRoute element={<Inventario />} />}
            />
            <Route
              path="registro-producto"
              element={<PrivateRoute element={<RegistroProducto />} />}
            />
            <Route
              path="actualizar-producto/:id"
              element={<PrivateRoute element={<ActualizarProducto />} />}
            />
            <Route
              path="detalles-producto/:productoId"
              element={<PrivateRoute element={<DetallesProducto />} />}
            />
            <Route
              path="anadir-novedad"
              element={<PrivateRoute element={<AnadirNovedad />} />}
            />
            <Route
              path="anadir-stock"
              element={<PrivateRoute element={<AnadirStock />} />}
            />
            <Route
              path="asociar-proveedores/:idProducto"
              element={<PrivateRoute element={<AsociarProveedores />} />}
            />
            <Route
              path="proveedores"
              element={<PrivateRoute element={<ListaProveedores />} />}
            />
            <Route
              path="proveedores/:id"
              element={<PrivateRoute element={<DetallesProveedor />} />}
            />
            <Route
              path="facturacion-proveedor"
              element={<PrivateRoute element={<FacturacionProveedor />} />}
            />
            <Route
              path="pagos-compras"
              element={<PrivateRoute element={<PagosCompras />} />}
            />
            <Route
              path="registro-proveedor"
              element={<PrivateRoute element={<RegistroProveedor />} />}
            />
            <Route
              path="actualizar-proveedor/:id"
              element={<PrivateRoute element={<ActualizarProveedor />} />}
            />
            <Route
              path="catalogo"
              element={<PrivateRoute element={<Catalogo />} />}
            />
            <Route
              path="nueva-Factura-proveedor"
              element={<PrivateRoute element={<CrearFacturaProveedor />} />}
            />
            <Route
              path="procesar-pedido"
              element={<PrivateRoute element={<ProcesarPedido />} />}
            />
            <Route
              path="clientes"
              element={<PrivateRoute element={<ListaClientes />} />}
            />
            <Route
              path="crear-cliente"
              element={<PrivateRoute element={<CrearCliente />} />}
            />
            <Route
              path="actualizar-cliente/:id"
              element={<PrivateRoute element={<ActualizarCliente />} />}
            />
            <Route
              path="cliente/:id"
              element={<PrivateRoute element={<DetalleCliente />} />}
            />
            <Route
              path="empleados"
              element={<PrivateRoute element={<ListaEmpleados />} />}
            />
            <Route
              path="crear-empleado"
              element={<PrivateRoute element={<CrearEmpleado />} />}
            />
            <Route
              path="empleados/:id"
              element={<PrivateRoute element={<DetalleEmpleado />} />}
            />
            <Route
              path="empleados/editar/:id"
              element={<PrivateRoute element={<ActualizarEmpleado />} />}
            />
            <Route
              path="registro-abono/:idFactura"
              element={<PrivateRoute element={<FormularioAbono />} />}
            />
            <Route
              path="ventas"
              element={<PrivateRoute element={<Ventas />} />}
            />
            <Route
              path="factura"
              element={<PrivateRoute element={<FacturaVenta />} />}
            />
            <Route
              path="facturacion-ventas"
              element={<PrivateRoute element={<ListaFacturacionVentas />} />}
            />
            <Route
              path="servicio-tecnico"
              element={
                <PrivateRoute element={<CrearFacturaServicioTecnico />} />
              }
            />
            <Route
              path="estadisticas"
              element={<PrivateRoute element={<Estadisticas />} />}
            />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
