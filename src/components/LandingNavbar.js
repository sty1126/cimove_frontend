"use client";

import { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaPhoneAlt } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";

// Paleta de colores personalizada
const colors = {
  primary: "#0D7F93", // Teal más vibrante
  secondary: "#4D8A52", // Verde más vibrante
  accent: "#7FBAD6", // Azul más vibrante
  light: "#C3D3C6", // Verde menta claro
  background: "#E8EAEC", // Gris muy claro
  text: "#2A3033", // Texto oscuro
};

const LandingNavbar = () => {
  const [brandHovered, setBrandHovered] = useState(false);
  const [navItemsHovered, setNavItemsHovered] = useState({
    home: false,
    contact: false,
    login: false,
  });

  return (
    <Navbar
      bg="light"
      expand="lg"
      style={{
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        backgroundColor: "#ffffff",
      }}
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          onMouseEnter={() => setBrandHovered(true)}
          onMouseLeave={() => setBrandHovered(false)}
          style={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #0D7F93, #4D8A52)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "transform 0.3s ease",
            transform: brandHovered ? "scale(1.03)" : "scale(1)",
            fontSize: "1.5rem",
            textDecoration: "none",
          }}
        >
          Kpershop
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              onMouseEnter={() =>
                setNavItemsHovered({ ...navItemsHovered, home: true })
              }
              onMouseLeave={() =>
                setNavItemsHovered({ ...navItemsHovered, home: false })
              }
              style={{
                display: "flex",
                alignItems: "center",
                color: colors.text,
                fontWeight: "500",
                transition: "all 0.2s ease",
                transform: navItemsHovered.home
                  ? "translateY(-2px)"
                  : "translateY(0)",
              }}
            >
              <FaHome
                style={{
                  marginRight: "8px",
                  transition: "transform 0.2s ease",
                  transform: navItemsHovered.home ? "scale(1.2)" : "scale(1)",
                  color: colors.primary,
                }}
              />
              Home
            </Nav.Link>

            <Nav.Link
              href="#contact"
              onMouseEnter={() =>
                setNavItemsHovered({ ...navItemsHovered, contact: true })
              }
              onMouseLeave={() =>
                setNavItemsHovered({ ...navItemsHovered, contact: false })
              }
              style={{
                display: "flex",
                alignItems: "center",
                color: colors.text,
                fontWeight: "500",
                transition: "all 0.2s ease",
                transform: navItemsHovered.contact
                  ? "translateY(-2px)"
                  : "translateY(0)",
              }}
            >
              <FaPhoneAlt
                style={{
                  marginRight: "8px",
                  transition: "transform 0.2s ease",
                  transform: navItemsHovered.contact
                    ? "scale(1.2)"
                    : "scale(1)",
                  color: colors.secondary,
                }}
              />
              Contáctanos
            </Nav.Link>
          </Nav>

          <Button
            as={Link}
            to="/login"
            variant="outline-primary"
            onMouseEnter={() =>
              setNavItemsHovered({ ...navItemsHovered, login: true })
            }
            onMouseLeave={() =>
              setNavItemsHovered({ ...navItemsHovered, login: false })
            }
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: navItemsHovered.login ? colors.primary : "white",
              color: navItemsHovered.login ? "white" : colors.primary,
              borderColor: colors.primary,
              boxShadow: navItemsHovered.login
                ? "0 4px 6px rgba(13, 127, 147, 0.2)"
                : "none",
              transition: "all 0.3s ease",
              borderRadius: "6px",
              padding: "0.375rem 1rem",
            }}
          >
            <FiLogIn
              style={{
                marginRight: "8px",
                transition: "transform 0.3s ease",
                transform: navItemsHovered.login
                  ? "rotate(360deg)"
                  : "rotate(0)",
              }}
            />
            Iniciar sesión
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LandingNavbar;
