"use client";

import { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

const { Sider } = Layout;

// Paleta de colores personalizada
const colors = {
  primary: "#8BB4C7",
  primaryDark: "#7AA3B6",
  primaryLight: "#9CC5D8",
  text: "#1A1A1A",
  textLight: "#FFFFFF",
  accent: "#4D8A52",
  hover: "rgba(255, 255, 255, 0.2)",
  active: "rgba(255, 255, 255, 0.3)",
};

const SidebarVendedor = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);

  // Actualizar la clave seleccionada basada en la ruta actual
  useEffect(() => {
    const path = location.pathname;

    // Mapeo de rutas a claves de menú
    const routeToKey = {
      "/home": "1",
      "/facturacion-ventas": "2",
      "/clientes": "3",
      "/inventario": "4",
      "/calendario": "5",
    };

    const key = routeToKey[path];
    if (key) {
      setSelectedKeys([key]);
    }
  }, [location]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={220}
      style={{
        height: "100vh",
        backgroundColor: colors.primary,
        position: "relative",
        overflow: "hidden auto", // Permite scroll pero mantiene el fondo fijo
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
      }}
      trigger={null}
      className="custom-scrollbar" // Clase para personalizar la barra de desplazamiento
    >
      {/* Botón de colapsar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 0",
          backgroundColor: colors.primaryDark,
          marginBottom: "8px",
        }}
      >
        <Button
          type="text"
          icon={
            collapsed ? (
              <FaIcons.FaBars size={20} />
            ) : (
              <FaIcons.FaTimes size={20} />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{
            color: colors.textLight,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
      </div>

      {/* Menú principal */}
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        style={{
          backgroundColor: "transparent", // Transparente para que se vea el fondo del Sider
          fontSize: "15px",
          border: "none",
          padding: "0 8px",
        }}
        items={[
          {
            key: "1",
            icon: <FaIcons.FaHome />,
            label: !collapsed && (
              <NavLink
                to="/home"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Inicio
              </NavLink>
            ),
          },
          {
            type: "group",
            label: (
              <div
                style={{
                  color: colors.text,
                  fontWeight: "bold",
                  padding: "10px 16px",
                }}
              >
                Ventas
              </div>
            ),
            children: [
              {
                key: "2",
                icon: <FaIcons.FaFileInvoiceDollar />,
                label: (
                  <NavLink
                    to="/facturacion-ventas"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Facturación
                  </NavLink>
                ),
              },
            ],
          },
          {
            type: "group",
            label: (
              <div
                style={{
                  color: colors.text,
                  fontWeight: "bold",
                  padding: "10px 16px",
                }}
              >
                Gestión
              </div>
            ),
            children: [
              {
                key: "3",
                icon: <FaIcons.FaUsers />,
                label: (
                  <NavLink
                    to="/clientes"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Clientes
                  </NavLink>
                ),
              },
              {
                key: "4",
                icon: <FaIcons.FaWarehouse />,
                label: (
                  <NavLink
                    to="/inventario"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Inventario
                  </NavLink>
                ),
              },
            ],
          },
          {
            key: "5",
            icon: <FaIcons.FaCalendarAlt />,
            label: (
              <NavLink
                to="/calendario"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Calendario
              </NavLink>
            ),
          },
        ]}
      />
    </Sider>
  );
};

export default SidebarVendedor;
