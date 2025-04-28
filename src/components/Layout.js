import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SidebarVendedor from "./SidebarVendedor";
import { Outlet } from "react-router-dom";
import "../Layout.scss"; // Importamos los estilos específicos

const Layout = () => {
  const rol = localStorage.getItem("rol");

  return (
    <div className="app-layout">
      {/* Sidebar a la izquierda */}
      <div className="app-sidebar">
        {rol === "1" ? <Sidebar /> : <SidebarVendedor />}
      </div>

      {/* Contenedor principal */}
      <div className="app-main">
        {/* Navbar arriba */}
        <div className="app-navbar">
          <Navbar />
        </div>

        {/* Contenido principal */}
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
