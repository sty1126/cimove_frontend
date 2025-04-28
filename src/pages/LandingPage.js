"use client";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaMobile,
  FaShieldAlt,
  FaRegClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Paleta de colores personalizada
const colors = {
  primary: "#0D7F93", // Teal más vibrante
  secondary: "#4D8A52", // Verde más vibrante
  accent: "#7FBAD6", // Azul más vibrante
  light: "#C3D3C6", // Verde menta claro
  background: "#E8EAEC", // Gris muy claro
  text: "#2A3033", // Texto oscuro
};

// Imágenes de ejemplo (reemplaza con tus propias imágenes)
const productImages = {
  cases: "https://via.placeholder.com/150x150?text=Cases",
  protectores: "https://via.placeholder.com/150x150?text=Protectores",
  audifonos: "https://via.placeholder.com/150x150?text=Audifonos",
  smartwatches: "https://via.placeholder.com/150x150?text=Smartwatches",
};

const LandingPage = () => {
  // Animación para elementos al entrar en viewport
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      {/* Hero Section */}
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

        {/* Decorative elements */}
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

      {/* Main Content */}
      <Container className="py-5">
        {/* Why Choose Us & Featured Products */}
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
                      { name: "Cases", img: productImages.cases },
                      {
                        name: "Protectores de pantalla",
                        img: productImages.protectores,
                      },
                      { name: "Audífonos", img: productImages.audifonos },
                      { name: "Smartwatches", img: productImages.smartwatches },
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
                            <img
                              src={product.img || "/placeholder.svg"}
                              alt={product.name}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
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

        {/* Our Locations */}
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
              "Acevedo: Carrera 33 No 28-05 Local 2",
              "Chapinero: Calle 63 No 15-14 Local 1",
              "Galerías: Carrera 24 No 51-81",
              "Chicó: Carrera 11 No 98-53",
            ].map((location, idx) => (
              <Col key={idx}>
                <Card
                  className="h-100 border-0 shadow-sm text-center"
                  style={{
                    borderRadius: "12px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
                    <Card.Text>{location}</Card.Text>
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
            {/* Aquí puedes añadir iconos de redes sociales */}
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
