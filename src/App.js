// Core y estilos
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

// Contexto y utilidades
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { CartProvider } from "./context/CartContext";

// Componentes globales
import Layout from "./components/Layout";
import LandingPageNavbar from "./components/LandingNavbar";
import PrivateRoute from "./components/PrivateRoute";

// Clientes
import ActualizarCliente from "./pages/clientes/ActualizarCliente";
import CrearCliente from "./pages/clientes/CrearCliente";
import DetallesCliente from "./pages/clientes/DetallesCliente";
import ListaClientes from "./pages/clientes/ListaClientes";
import SeleccionarCliente from "./pages/clientes/SeleccionarCliente";
import SeleccionarClientePorSede from "./pages/clientes/SeleccionarClientePorSede";

// Empleados
import ActualizarEmpleado from "./pages/empleados/ActualizarEmpleado";
import CrearEmpleado from "./pages/empleados/CrearEmpleado";
import DetallesEmpleado from "./pages/empleados/DetallesEmpleado";
import ListaEmpleados from "./pages/empleados/ListaEmpleados";

// Estadísticas
import Estadisticas from "./pages/estadisticas/Estadisticas";

// General
import Home from "./pages/general/Home";
import LandingPage from "./pages/general/LandingPage";
import Login from "./pages/general/Login";
import ResetPassword from "./pages/general/ResetPassword";
import MiPerfil from "./pages/general/MiPerfil";

// Inventario
import AnadirNovedad from "./pages/inventario/AnadirNovedad";
import AnadirStock from "./pages/inventario/AnadirStock";
import Inventario from "./pages/inventario/Inventario";

// Productos
import ActualizarProducto from "./pages/productos/ActualizarProducto";
import ConsultaProducto from "./pages/productos/ConsultaProducto";
import DetallesProducto from "./pages/productos/DetallesProducto";
import ListaProducto from "./pages/productos/ListaProducto";
import RegistroProducto from "./pages/productos/RegistroProducto";
import SeleccionarProducto from "./pages/productos/SeleccionarProducto";
import SeleccionarProductoGeneral from "./pages/productos/SeleccionarProductoGeneral";

// Proveedores
import ActualizarProveedor from "./pages/proveedores/ActualizarProveedor";
import AsociarProveedores from "./pages/proveedores/AsociarProveedores";
import Catalogo from "./pages/proveedores/Catalogo";
import CrearFacturaProveedor from "./pages/proveedores/CrearFacturaProveedor";
import DetallesProveedor from "./pages/proveedores/DetallesProveedor";
import FacturacionProveedor from "./pages/proveedores/FacturacionProveedor";
import FormularioAbono from "./pages/proveedores/FormularioAbono";
import ListaProveedores from "./pages/proveedores/ListaProveedores";
import PagosCompras from "./pages/proveedores/PagosCompras";
import ProcesarPedido from "./pages/proveedores/ProcesarPedido";
import RegistroProveedor from "./pages/proveedores/RegistroProveedor";
import SeleccionarProveedor from "./pages/proveedores/SeleccionarProveedor";
import EliminarProveedor from "./pages/proveedores/EliminarProveedor";

// Servicios Técnicos
import ActualizarServicioTecnico from "./pages/serviciosTecnicos/ActualizarServicioTecnico";
import CrearFacturaServicioTecnico from "./pages/serviciosTecnicos/CrearFacturaServicioTecnico";
import DetallesServicioTecnico from "./pages/serviciosTecnicos/DetallesServicioTecnico";

// Ventas
import FacturaVenta from "./pages/ventas/FacturaVenta";
import ListaFacturacionVentas from "./pages/ventas/ListaFacturacionVentas";
import Ventas from "./pages/ventas/Ventas";

// Notificaciones
import Calendario from "./pages/notificaciones/Calendario";

if (process.env.NODE_ENV === "production") disableReactDevTools();

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
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* TODAS LAS DEMÁS PÁGINAS */}
          <Route path="/*" element={<Layout />}>
            {/* Rutas protegidas por autenticación */}
            <Route path="home" element={<PrivateRoute element={<Home />} />} />
            
            {/* Mi Perfil - Sin parámetro en la ruta */}
            <Route
              path="mi-perfil"
              element={<PrivateRoute element={<MiPerfil />} />}
            />
            
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
              element={<PrivateRoute element={<DetallesCliente />} />}
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
              element={<PrivateRoute element={<DetallesEmpleado />} />}
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
            <Route
              path="detalles-servicio/:id"
              element={<PrivateRoute element={<DetallesServicioTecnico />} />}
            />
            <Route
              path="editar-servicio/:id"
              element={<PrivateRoute element={<ActualizarServicioTecnico />} />}
            />
            <Route
              path="calendario"
              element={<PrivateRoute element={<Calendario />} />}
            />
            <Route
              path="eliminar-proveedores/:idProducto"
              element={<PrivateRoute element={<EliminarProveedor />} />}
            />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
