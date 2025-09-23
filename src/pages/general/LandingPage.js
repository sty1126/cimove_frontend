"use client";

// Imports necesarios
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaMobile,
  FaShieldAlt,
  FaRegClock,
} from "react-icons/fa";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Paleta de colores para la página
const colors = {
  primary: "#0D7F93",
  secondary: "#4D8A52",
  accent: "#7FBAD6",
  light: "#C3D3C6",
  background: "#E8EAEC",
  text: "#2A3033",
};

const LandingPage = () => {
  // Animación para elementos al entrar en viewport
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Arrays de imágenes para carrusel de productos
  const audifonosImgs = [
    "/media/Audifonos.png",
    "/media/Audifonos2.webp",
    "/media/Audifonos3.webp",
  ];

  const relojesImgs = [
    "/media/RelojInteligente.webp",
    "/media/RelojInteligente2.webp",
  ];

  const casesImgs = [
    "/media/Cases.webp",
    "/media/Cases2.webp",
    "/media/Cases3.webp",
  ];

  const [casesIndex, setCasesIndex] = useState(0);
  const [audifonoIndex, setAudifonoIndex] = useState(0);
  const [relojIndex, setRelojIndex] = useState(0);

  // Lógica de rotación de imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setAudifonoIndex((prev) => (prev + 1) % audifonosImgs.length);
      setRelojIndex((prev) => (prev + 1) % relojesImgs.length);
      setCasesIndex((prev) => (prev + 1) % casesImgs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [audifonosImgs.length, relojesImgs.length, casesImgs.length]);

  return (
    <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      {/* HERO: sección principal con título */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          padding: "80px 0 100px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="display-4 fw-bold mb-3">Accesorios K-perShop</h1>
            <p className="lead mb-2">Shopping & retail</p>
            <p className="mb-4 mx-auto" style={{ maxWidth: "700px" }}>
              Somos tienda física con años de experiencia. Ofrecemos lo mejor en
              case, protección y mucho más para su celular.
            </p>
            <Button
              variant="light"
              size="lg"
              className="px-4 py-2 mt-3"
              style={{
                color: colors.primary,
                fontWeight: "600",
                borderRadius: "30px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              Ver productos
            </Button>
          </motion.div>
        </Container>

        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: 0,
            width: "100%",
            height: "100px",
            background: "white",
            borderRadius: "50% 50% 0 0",
          }}
        />
      </div>

      {/* Contenido principal */}
      <Container className="py-5">
        {/* ¿Por que escogernos? y Productos */}
        <Row className="g-4 mb-5">
          <Col lg={5}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card
                className="h-100 border-0 shadow-sm"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <Card.Header
                  className="py-3"
                  style={{
                    background: colors.primary,
                    color: "white",
                    borderBottom: "none",
                  }}
                >
                  <h2 className="h4 mb-0 fw-bold">¿Por qué elegirnos?</h2>
                </Card.Header>
                <Card.Body className="p-4">
                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex align-items-center">
                      <div
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "15px",
                        }}
                      >
                        <FaMobile color={colors.primary} size={18} />
                      </div>
                      <span>
                        Experiencia en venta de accesorios para celulares.
                      </span>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <div
                        style={{
                          backgroundColor: `${colors.secondary}20`,
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "15px",
                        }}
                      >
                        <FaShieldAlt color={colors.secondary} size={18} />
                      </div>
                      <span>
                        Servicio técnico especializado para dispositivos
                        móviles.
                      </span>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <div
                        style={{
                          backgroundColor: `${colors.accent}20`,
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "15px",
                        }}
                      >
                        <FaMapMarkerAlt color={colors.accent} size={18} />
                      </div>
                      <span>
                        Cuatro sedes estratégicamente ubicadas en Bogotá.
                      </span>
                    </li>
                    <li className="d-flex align-items-center">
                      <div
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "15px",
                        }}
                      >
                        <FaRegClock color={colors.primary} size={18} />
                      </div>
                      <span>
                        Atención personalizada y productos de alta calidad.
                      </span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col lg={7}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card
                className="h-100 border-0 shadow-sm"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <Card.Header
                  className="py-3"
                  style={{
                    background: colors.secondary,
                    color: "white",
                    borderBottom: "none",
                  }}
                >
                  <h2 className="h4 mb-0 fw-bold text-center">
                    Productos destacados
                  </h2>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row xs={2} md={4} className="g-4">
                    {[
                      {
                        name: "Cases",
                        content: (
                          <img
                            src={casesImgs[casesIndex]}
                            alt="Cases"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "opacity 0.8s ease-in-out",
                            }}
                          />
                        ),
                      },
                      {
                        name: "Protectores de pantalla",
                        content: (
                          <video
                            src="/media/ProtectorPantalla.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ),
                      },
                      {
                        name: "Audífonos",
                        content: (
                          <img
                            src={audifonosImgs[audifonoIndex]}
                            alt="Audífonos"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "opacity 0.8s ease-in-out",
                            }}
                          />
                        ),
                      },
                      {
                        name: "Smartwatches",
                        content: (
                          <img
                            src={relojesImgs[relojIndex]}
                            alt="Smartwatches"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "opacity 0.8s ease-in-out",
                            }}
                          />
                        ),
                      },
                    ].map((product, idx) => (
                      <Col key={idx} className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div
                            style={{
                              width: "100%",
                              paddingBottom: "100%",
                              position: "relative",
                              overflow: "hidden",
                              borderRadius: "10px",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                              marginBottom: "10px",
                            }}
                          >
                            {product.content}
                          </div>
                          <p className="mb-0 fw-medium">{product.name}</p>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Sedes y google maps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-5 pt-3"
        >
          <div className="text-center mb-4">
            <h2 className="h3 fw-bold" style={{ color: colors.primary }}>
              Nuestras Sedes
            </h2>
            <div
              style={{
                width: "70px",
                height: "4px",
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                margin: "15px auto",
                borderRadius: "2px",
              }}
            />
          </div>

          <Row xs={1} md={2} lg={4} className="g-4">
            {[
              {
                name: "Acevedo",
                address: "Carrera 33 No 28-05 Local 2",
                mapsUrl:
                  "https://www.google.com/maps?q=Carrera+33+No+28-05+Bogotá",
              },
              {
                name: "Chapinero",
                address: "Calle 63 No 15-14 Local 1",
                mapsUrl:
                  "https://www.google.com/maps?q=Calle+63+No+15-14+Bogotá",
              },
              {
                name: "Galerías",
                address: "Carrera 24 No 51-81",
                mapsUrl:
                  "https://www.google.com/maps?q=Carrera+24+No+51-81+Bogotá",
              },
              {
                name: "Chicó",
                address: "Carrera 11 No 98-53",
                mapsUrl:
                  "https://www.google.com/maps?q=Carrera+11+No+98-53+Bogotá",
              },
            ].map((location, idx) => (
              <Col key={idx}>
                <Card
                  className="h-100 border-0 shadow-sm text-center"
                  style={{
                    borderRadius: "12px",
                    transition: "transform 0.3s ease, boxShadow 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  <Card.Body className="p-4">
                    <div
                      style={{
                        backgroundColor: `${colors.accent}20`,
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 15px",
                      }}
                    >
                      <FaMapMarkerAlt color={colors.accent} size={24} />
                    </div>
                    <Card.Text className="fw-bold">{location.name}</Card.Text>
                    <Card.Text>{location.address}</Card.Text>
                    <a
                      href={location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary mt-2"
                    >
                      Ver en Google Maps
                    </a>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-5 pt-4"
        >
          <Card
            className="border-0 shadow"
            style={{
              borderRadius: "15px",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              padding: "40px 20px",
            }}
          >
            <Card.Body>
              <h2 className="text-white mb-3">
                ¿Listo para mejorar tu experiencia móvil?
              </h2>
              <p className="text-white mb-4">
                Visita cualquiera de nuestras sedes o contáctanos para conocer
                nuestros productos y servicios.
              </p>
              <Button
                variant="light"
                size="lg"
                className="px-4 py-2"
                style={{
                  color: colors.primary,
                  fontWeight: "600",
                  borderRadius: "30px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                Contáctanos
              </Button>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#2A3033",
          color: "white",
          padding: "30px 0 20px",
          marginTop: "60px",
        }}
      >
        <Container className="text-center">
          <h3 className="h5 mb-3">Accesorios K-perShop</h3>
          <p className="mb-3">
            Lo mejor en accesorios para dispositivos móviles
          </p>
          <div className="d-flex justify-content-center gap-3 mb-4">
            <a
              href="https://www.instagram.com/accesorioskper"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", fontSize: "1.5rem" }}
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/Kpershop"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", fontSize: "1.5rem" }}
            >
              <FaFacebookF />
            </a>
          </div>
          <p className="small text-muted">
            © {new Date().getFullYear()} K-perShop. Todos los derechos
            reservados.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
