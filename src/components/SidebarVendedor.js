
"use client";

import { useState, useEffect } from "react";
import { Layout, Menu, Button, Tooltip } from "antd";
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

const SidebarVendedor = ({ externalCollapsed, setExternalCollapsed }) => {
  // Usar el estado externo en lugar del interno
  const collapsed = externalCollapsed;
  const setCollapsed = setExternalCollapsed;

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

  // Función para renderizar los elementos de menú con tooltips cuando está colapsado
  const getMenuItem = (key, icon, label, path) => {
    const content = (
      <NavLink
        to={path}
        style={{ color: colors.text, fontWeight: "bold" }}
        className="menu-link"
      >
        {label}
      </NavLink>
    );

    return {
      key,
      icon,
      label: collapsed ? (
        <Tooltip placement="right" title={label}>
          <NavLink to={path} className="icon-only-link">
            {/* Este span vacío es solo para que el tooltip tenga un objetivo */}
            <span className="tooltip-target"></span>
          </NavLink>
        </Tooltip>
      ) : content,
    };
  };

  // Crear los elementos del menú
  const menuItems = [
    getMenuItem("1", <FaIcons.FaHome />, "Inicio", "/home"),
    getMenuItem("2", <FaIcons.FaFileInvoiceDollar />, "Facturación y Ventas", "/facturacion-ventas"),
    getMenuItem("3", <FaIcons.FaUsers />, "Clientes", "/clientes"),
    getMenuItem("4", <FaIcons.FaBoxes />, "Inventario", "/inventario"),
    getMenuItem("5", <FaIcons.FaCalendarAlt />, "Calendario", "/calendario"),
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={220}
      collapsedWidth={80}
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
<<<<<<< HEAD
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
            key: "2",
            icon: <FaIcons.FaFileInvoiceDollar />,
            label: !collapsed && (
              <NavLink
                to="/facturacion-ventas"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Movimientos y Ventas
              </NavLink>
            ),
          },
          {
            key: "3",
            icon: <FaIcons.FaUsers />,
            label: !collapsed && (
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
            icon: <FaIcons.FaBoxes />,
            label: !collapsed && (
              <NavLink
                to="/inventario"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Inventario
              </NavLink>
            ),
          },
          {
            key: "5",
            icon: <FaIcons.FaCalendarAlt />,
            label: !collapsed && (
              <NavLink
                to="/calendario"
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                Calendario
              </NavLink>
            ),
          },
        ]}
=======
        items={menuItems}
        className="custom-menu"
>>>>>>> 600d27baaf1854e9bdb5578e874b9097b8510c3a
      />

      {/* Estilos globales para personalizar el menú */}
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
          
          /* Arreglos para el modo colapsado */
          .ant-layout-sider-collapsed .ant-menu-item .anticon,
          .ant-layout-sider-collapsed .ant-menu-submenu-title .anticon {
            margin-inline-end: 0 !important;
          }
          
          /* Centrar los íconos cuando está colapsado */
          .ant-layout-sider-collapsed .ant-menu-item {
            padding-inline: 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            height: 40px !important;
          }
          
          /* Estilos para tooltips */
          .ant-tooltip {
            z-index: 1050;
          }
          
          .ant-tooltip-inner {
            padding: 6px 12px;
            color: white;
            font-weight: 500;
            border-radius: 4px;
          }
          
          /* Para que el tooltip funcione bien con el link */
          .icon-only-link {
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          
          /* Ajustar el tamaño del tooltip target para cubrir toda el área del ítem del menú */
          .tooltip-target {
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          }
        `}
      </style>
    </Sider>
  );
};

export default SidebarVendedor;
