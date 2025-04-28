"use client";

import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import {
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import logo from "../media/logoCimove_noletras.png";

// Estilos personalizados
const styles = {
  navbar: {
    padding: "12px 24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#333",
    transition: "transform 0.3s ease",
  },
  brandHover: {
    transform: "scale(1.03)",
  },
  logo: {
    width: "50px",
    height: "auto",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    transition: "transform 0.3s ease",
  },
  logoSpin: {
    animation: "spin 10s linear infinite",
  },
  brandText: {
    marginLeft: "12px",
    fontSize: "1.5rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #0D7F93, #4D8A52)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  dropdownToggle: {
    color: "#333 !important",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
  },
  dropdownToggleHover: {
    backgroundColor: "#e9ecef",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
  },
  userIcon: {
    marginRight: "8px",
    fontSize: "1.2rem",
    color: "#0D7F93",
    transition: "transform 0.3s ease",
  },
  userIconSpin: {
    transform: "rotate(360deg)",
  },
  dropdownMenu: {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    animation: "fadeIn 0.2s ease-out",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    borderRadius: "6px",
    margin: "4px 0",
    transition: "all 0.2s ease",
    color: "#333",
    fontWeight: "500",
  },
  dropdownItemHover: {
    backgroundColor: "#f1f5f9",
    transform: "translateX(5px)",
  },
  dropdownItemIcon: {
    marginRight: "10px",
    fontSize: "1rem",
    transition: "transform 0.2s ease",
  },
  dropdownItemIconHover: {
    transform: "scale(1.2)",
  },
  divider: {
    margin: "8px 0",
    backgroundColor: "#e9ecef",
  },
  logoutItem: {
    color: "#C25F48",
  },
  logoutItemHover: {
    backgroundColor: "rgba(194, 95, 72, 0.1)",
  },
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(-10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

const Navbar = () => {
  const [brandHovered, setBrandHovered] = useState(false);
  const [dropdownHovered, setDropdownHovered] = useState(false);
  const [dropdownItemsHovered, setDropdownItemsHovered] = useState({
    profile: false,
    settings: false,
    logout: false,
  });
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [userIconAnimated, setUserIconAnimated] = useState(false);

  // Función para animar el logo
  const handleLogoClick = () => {
    setLogoAnimated(true);
    setTimeout(() => setLogoAnimated(false), 10000); // Detener después de 10 segundos
  };

  // Función para animar el icono de usuario
  const handleUserIconClick = () => {
    setUserIconAnimated(true);
    setTimeout(() => setUserIconAnimated(false), 1000);
  };

  const handleLogout = () => {
    // Elimina el token o el estado de autenticación (esto depende de tu implementación)
    localStorage.removeItem("token"); // o el método que uses para gestionar la sesión

    // Redirige al usuario a la página de inicio de sesión
    window.location.href = "/login"; // o la ruta que uses para el login
  };

  return (
    <nav style={styles.navbar} className="navbar navbar-expand-lg">
      <a
        className="navbar-brand"
        href="/"
        style={{
          ...styles.brand,
          ...(brandHovered ? styles.brandHover : {}),
        }}
        onMouseEnter={() => setBrandHovered(true)}
        onMouseLeave={() => setBrandHovered(false)}
      >
        <img
          src={logo || "/placeholder.svg"}
          alt="CIMOVE Logo"
          style={{
            ...styles.logo,
            ...(logoAnimated ? styles.logoSpin : {}),
          }}
          onClick={handleLogoClick}
        />
        <span style={styles.brandText}>CIMOVE</span>
      </a>

      <Nav className="ms-auto">
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle
            nav
            style={{
              ...styles.dropdownToggle,
              ...(dropdownHovered ? styles.dropdownToggleHover : {}),
            }}
            onMouseEnter={() => setDropdownHovered(true)}
            onMouseLeave={() => setDropdownHovered(false)}
          >
            <FaIcons.FaRegUserCircle
              style={{
                ...styles.userIcon,
                ...(userIconAnimated ? styles.userIconSpin : {}),
              }}
              onClick={handleUserIconClick}
            />
            Usuario
          </DropdownToggle>
          <DropdownMenu end style={styles.dropdownMenu}>
            <DropdownItem
              style={{
                ...styles.dropdownItem,
                ...(dropdownItemsHovered.profile
                  ? styles.dropdownItemHover
                  : {}),
              }}
              onMouseEnter={() =>
                setDropdownItemsHovered({
                  ...dropdownItemsHovered,
                  profile: true,
                })
              }
              onMouseLeave={() =>
                setDropdownItemsHovered({
                  ...dropdownItemsHovered,
                  profile: false,
                })
              }
            >
              <FaIcons.FaUserEdit
                style={{
                  ...styles.dropdownItemIcon,
                  ...(dropdownItemsHovered.profile
                    ? styles.dropdownItemIconHover
                    : {}),
                  color: "#0D7F93",
                }}
              />
              Mi perfil
            </DropdownItem>
            <DropdownItem
              style={{
                ...styles.dropdownItem,
                ...(dropdownItemsHovered.settings
                  ? styles.dropdownItemHover
                  : {}),
              }}
              onMouseEnter={() =>
                setDropdownItemsHovered({
                  ...dropdownItemsHovered,
                  settings: true,
                })
              }
              onMouseLeave={() =>
                setDropdownItemsHovered({
                  ...dropdownItemsHovered,
                  settings: false,
                })
              }
            >
              <FaIcons.FaUserCog
                style={{
                  ...styles.dropdownItemIcon,
                  ...(dropdownItemsHovered.settings
                    ? styles.dropdownItemIconHover
                    : {}),
                  color: "#4D8A52",
                }}
              />
              Configuraciones
            </DropdownItem>
            <DropdownItem divider style={styles.divider} />
            <DropdownItem
              style={{
                ...styles.dropdownItem,
                ...styles.logoutItem,
                ...(dropdownItemsHovered.logout
                  ? { ...styles.dropdownItemHover, ...styles.logoutItemHover }
                  : {}),
              }}
              onMouseEnter={() =>
                setDropdownItemsHovered({
                  ...dropdownItemsHovered,
                  logout: true,
                })
              }
              onMouseLeave={() =>
                setDropdownItemsHovered({
                  ...dropdownItemsHovered,
                  logout: false,
                })
              }
              onClick={handleLogout} // Aquí
            >
              <FiLogOut
                style={{
                  ...styles.dropdownItemIcon,
                  ...(dropdownItemsHovered.logout
                    ? styles.dropdownItemIconHover
                    : {}),
                }}
              />
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>

      {/* Estilos globales para animaciones */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .dropdown-menu {
            animation: fadeIn 0.2s ease-out;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
