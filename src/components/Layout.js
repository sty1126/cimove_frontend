"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SidebarVendedor from "./SidebarVendedor";
import { Outlet } from "react-router-dom";
import "../Layout.scss";

const Layout = () => {
  const rol = localStorage.getItem("rol");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar a la izquierda */}
      <div className={`app-sidebar ${isCollapsed ? "collapsed" : ""}`}>
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
        style={{
          marginLeft: isCollapsed ? "80px" : "220px",
          width: `calc(100% - ${isCollapsed ? "80px" : "220px"})`,
          transition: "margin-left 0.3s, width 0.3s",
        }}
      >
        <div className="app-navbar">
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
