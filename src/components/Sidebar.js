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

const Sidebar = ({ externalCollapsed, setExternalCollapsed }) => {
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
      "/empleados": "13",
    };

    const key = routeToKey[path];
    if (key) {
      setSelectedKeys([key]);
    }
  }, [location]);

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

  // Generar los elementos del menú con tooltips
  const menuItems = [
    getMenuItem("1", <FaIcons.FaHome />, "Inicio", "/home"),
    {
      type: "group",
      label: (
        <div style={groupTitleStyle} className="group-title">
          <div style={groupIndicatorStyle}></div>
          <span style={{ marginLeft: "10px" }}>Ventas</span>
        </div>
      ),
      children: [
        getMenuItem("2", <FaIcons.FaFileInvoiceDollar />, "Movimientos", "/facturacion-ventas"),
        getMenuItem("4", <FaIcons.FaUsers />, "Clientes", "/clientes"),
      ],
    },
    {
      type: "group",
      label: (
        <div style={groupTitleStyle} className="group-title">
          <div style={groupIndicatorStyle}></div>
          <span style={{ marginLeft: "10px" }}>Compras</span>
        </div>
      ),
      children: [
        getMenuItem("5", <FaIcons.FaFileInvoice />, "Movimientos", "/facturacion-proveedor"),
        getMenuItem("7", <FaIcons.FaTruck />, "Proveedores", "/proveedores"),
        getMenuItem("8", <FaIcons.FaBoxOpen />, "Catálogo", "/catalogo"),
        getMenuItem("9", <FaIcons.FaWarehouse />, "Inventario", "/inventario"),
      ],
    },
    {
      type: "group",
      label: (
        <div style={groupTitleStyle} className="group-title">
          <div style={groupIndicatorStyle}></div>
          <span style={{ marginLeft: "10px" }}>Monitoreo</span>
        </div>
      ),
      children: [
        getMenuItem("11", <FaIcons.FaCalendarAlt />, "Calendario", "/calendario"),
        getMenuItem("12", <FaIcons.FaChartBar />, "Estadísticas", "/estadisticas"),
        getMenuItem("13", <FaIcons.FaUsers />, "Empleados", "/empleados"),
      ],
    },
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
        overflow: "hidden auto",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
      }}
      trigger={null}
      className="custom-scrollbar"
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
          backgroundColor: "transparent",
          fontSize: "15px",
          border: "none",
          padding: "0 8px",
        }}
        items={menuItems}
        className="custom-menu"
      />

      {/* Estilos globales */}
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
          
          /* Ocultar títulos de grupo cuando el sidebar está colapsado */
          .ant-layout-sider-collapsed .group-title {
            display: none !important;
            padding: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          
          /* Ajustar padding de los grupos cuando está colapsado */
          .ant-layout-sider-collapsed .ant-menu-item-group-list {
            padding: 0 !important;
          }
          
          /* Ocultar completamente los títulos de grupo colapsados */
          .ant-layout-sider-collapsed .ant-menu-item-group-title {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
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

export default Sidebar;
