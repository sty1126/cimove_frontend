"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SidebarVendedor from "./SidebarVendedor";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import "../Layout.scss";

const Layout = () => {
  const rol = localStorage.getItem("rol");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !showMobileSidebar) {
        setIsCollapsed(true);
      }
    };

    // Verificar al cargar
    checkIfMobile();

    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [showMobileSidebar]);

  // Función para alternar la visibilidad del sidebar en móviles
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <div className="app-layout">
      {/* Overlay para cerrar el sidebar en móviles al hacer clic fuera */}
      {isMobile && showMobileSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`app-sidebar ${isCollapsed ? "collapsed" : ""} ${
          showMobileSidebar ? "open" : ""
        }`}
      >
        {rol === "1" ? (
          <Sidebar
            externalCollapsed={isCollapsed}
            setExternalCollapsed={setIsCollapsed}
          />
        ) : (
          <SidebarVendedor
            externalCollapsed={isCollapsed}
            setExternalCollapsed={setIsCollapsed}
          />
        )}
      </div>

      {/* Contenedor principal */}
      <div
        className="app-main"
        style={
          !isMobile
            ? {
                marginLeft: isCollapsed ? "80px" : "220px",
                width: `calc(100% - ${isCollapsed ? "80px" : "220px"})`,
                transition: "margin-left 0.3s, width 0.3s",
              }
            : {}
        }
      >
        <div className="app-navbar">
          {/* Botón de hamburguesa integrado en el navbar */}
          {isMobile && (
            <button
              className="navbar-menu-button"
              onClick={toggleMobileSidebar}
              aria-label="Abrir menú"
            >
              <FiMenu size={24} />
            </button>
          )}
          <Navbar />
        </div>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
