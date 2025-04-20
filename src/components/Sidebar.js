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

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);

  // Actualizar la clave seleccionada basada en la ruta actual
  useEffect(() => {
    const path = location.pathname;

    // Mapeo de rutas a claves de menú
    const routeToKey = {
      "/": "1",
      "/facturacion-ventas": "2",
      "/pagos-ventas": "3",
      "/clientes": "4",
      "/facturacion-compras": "5",
      "/pagos-compras": "6",
      "/proveedores": "7",
      "/catalogo": "8",
      "/inventario": "9",
      "/productos-vendidos": "10",
      "/calendario": "11",
      "/estadisticas": "12",
    };

    const key = routeToKey[path];
    if (key) {
      setSelectedKeys([key]);
    }
  }, [location]);

  // Estilos personalizados para el menú
  const menuItemStyle = {
    margin: "4px 0",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  };

  const menuItemActiveStyle = {
    backgroundColor: colors.active,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  // Estilo personalizado para el título del grupo
  const groupTitleStyle = {
    color: colors.text,
    fontWeight: "bold",
    fontSize: "14px",
    padding: "10px 16px 5px",
    marginTop: "5px",
    position: "relative",
  };

  // Estilo para el indicador de grupo
  const groupIndicatorStyle = {
    content: '""',
    position: "absolute",
    left: "0",
    top: "50%",
    transform: "translateY(-50%)",
    width: "4px",
    height: "16px",
    backgroundColor: colors.accent,
    borderRadius: "0 2px 2px 0",
  };

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
          transition: "all 0.3s ease",
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
        // Personalización de los elementos del menú
        items={[
          {
            key: "1",
            icon: <FaIcons.FaHome />,
            label: !collapsed && (
              <NavLink
                to="/"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Inicio
              </NavLink>
            ),
          },
          {
            type: "group",
            label: (
              <div style={groupTitleStyle}>
                <div style={groupIndicatorStyle}></div>
                <span style={{ marginLeft: "10px" }}>Ventas</span>
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
              {
                key: "3",
                icon: <FaIcons.FaMoneyBillWave />,
                label: (
                  <NavLink
                    to="/pagos-ventas"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Pagos
                  </NavLink>
                ),
              },
              {
                key: "4",
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
            ],
          },
          {
            type: "group",
            label: (
              <div style={groupTitleStyle}>
                <div style={groupIndicatorStyle}></div>
                <span style={{ marginLeft: "10px" }}>Compras</span>
              </div>
            ),
            children: [
              {
                key: "5",
                icon: <FaIcons.FaFileInvoice />,
                label: (
                  <NavLink
                    to="/facturacion-proveedor"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Facturación
                  </NavLink>
                ),
              },
              {
                key: "6",
                icon: <FaIcons.FaMoneyCheckAlt />,
                label: (
                  <NavLink
                    to="/pagos-compras"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Pagos
                  </NavLink>
                ),
              },
              {
                key: "7",
                icon: <FaIcons.FaTruck />,
                label: (
                  <NavLink
                    to="/proveedores"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Proveedores
                  </NavLink>
                ),
              },
              {
                key: "8",
                icon: <FaIcons.FaBoxOpen />,
                label: (
                  <NavLink
                    to="/catalogo"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Catálogo
                  </NavLink>
                ),
              },
              {
                key: "9",
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
            type: "group",
            label: (
              <div style={groupTitleStyle}>
                <div style={groupIndicatorStyle}></div>
                <span style={{ marginLeft: "10px" }}>Monitoreo</span>
              </div>
            ),
            children: [
              {
                key: "10",
                icon: <FaIcons.FaClipboardList />,
                label: (
                  <NavLink
                    to="/productos-vendidos"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Productos vendidos
                  </NavLink>
                ),
              },
              {
                key: "11",
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
              {
                key: "12",
                icon: <FaIcons.FaChartBar />,
                label: (
                  <NavLink
                    to="/estadisticas"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Estadísticas
                  </NavLink>
                ),
              },
              {
                key: "13",
                icon: <FaIcons.FaUsers />,
                label: (
                  <NavLink
                    to="/empleados"
                    style={{ color: colors.text, fontWeight: "bold" }}
                  >
                    Empleados
                  </NavLink>
                ),
              },
            ],
          },
        ]}
        // Personalización de los estilos de los elementos del menú
        className="custom-menu"
      />

      {/* Estilos globales para personalizar el menú y la barra de desplazamiento */}
      <style>
        {`
          /* Personalización del menú */
          .custom-menu .ant-menu-item {
            margin: 4px 0 !important;
            border-radius: 6px !important;
            transition: all 0.3s ease !important;
          }
          
          .custom-menu .ant-menu-item:hover {
            background-color: ${colors.hover} !important;
          }
          
          .custom-menu .ant-menu-item-selected {
            background-color: ${colors.active} !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          }
          
          .custom-menu .ant-menu-item-active {
            background-color: ${colors.hover} !important;
          }
          
          /* Personalización de la barra de desplazamiento */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${colors.primary};
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: ${colors.primaryDark};
            border-radius: 6px;
            border: 2px solid ${colors.primary};
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.3);
          }
          
          /* Asegurar que el fondo del menú sea consistente */
          .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
            background-color: transparent !important;
          }
          
          /* Estilo para los grupos de menú */
          .ant-menu-item-group-title {
            padding: 10px 16px 5px !important;
          }
          
          /* Animación para el botón de colapso */
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(180deg); }
          }
        `}
      </style>
    </Sider>
  );
};

export default Sidebar;
