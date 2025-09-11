"use client";

import { useNavigate } from "react-router-dom";
import { Typography, Card, Row, Col, Divider } from "antd";
import {
  FileTextOutlined,
  InboxOutlined,
  CalendarOutlined,
  TeamOutlined,
  ToolOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./Home.scss"; // Importamos un archivo CSS separado para las animaciones

const { Title, Text } = Typography;

// Paleta de colores personalizada - igual que en tus otros componentes
const colors = {
  primary: "#0D7F93", // Teal más vibrante
  secondary: "#4D8A52", // Verde más vibrante
  accent: "#7FBAD6", // Azul más vibrante
  light: "#C3D3C6", // Verde menta claro
  background: "#E8EAEC", // Gris muy claro
  text: "#2A3033", // Texto oscuro
  success: "#4D8A52", // Verde más vibrante para éxito
  warning: "#E0A458", // Naranja apagado para advertencias
  danger: "#C25F48", // Rojo más vibrante para peligro
};

const HomeContent = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  // Funciones para manejar el clic en cada sección
  const handleFacturarClick = () => navigate("/facturacion-ventas");
  const handleInventarioClick = () => navigate("/inventario");
  const handleCalendarioClick = () => navigate("/calendario");
  const handleClientesClick = () => navigate("/clientes");
  const handleServicioTecnicoClick = () => navigate("/servicio-tecnico");
  const handleVentasClick = () => navigate("/facturacion-ventas"); // Cambiado de "/contacto" a "/facturacion-ventas"


  // Efecto para animar las tarjetas con retraso
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="simple-background">
      <div className="content-wrapper">
        {/* Encabezado */}
        <div style={{ marginBottom: "24px" }}>
          <Title level={2} style={{ margin: 0, color: colors.primary }}>
            Kper-shop
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Bienvenido al sistema de gestión
          </Text>
        </div>

        <Divider style={{ margin: "12px 0 24px", borderColor: colors.light }} />

        {/* Sección de accesos rápidos */}
        <Title
          level={4}
          style={{ marginBottom: "16px", color: colors.primary }}
        >
          Accesos Rápidos
        </Title>
        <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={handleFacturarClick}
              className="simple-card"
              style={{
                height: "180px",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                position: "relative",
                border: "none",
              }}
              bodyStyle={{
                padding: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="card-accent"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "5px",
                  background: colors.primary,
                }}
              />
              <div
                className="icon-container"
                style={{ background: `${colors.primary}10` }}
              >
                <FileTextOutlined
                  style={{ fontSize: "32px", color: colors.primary }}
                />
              </div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Facturar
              </Title>
              <Text
                style={{ textAlign: "center", marginTop: "8px", color: "#666" }}
              >
                Ventas y facturas
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={handleInventarioClick}
              className="simple-card"
              style={{
                height: "180px",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                position: "relative",
                border: "none",
              }}
              bodyStyle={{
                padding: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="card-accent"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "5px",
                  background: colors.secondary,
                }}
              />
              <div
                className="icon-container"
                style={{ background: `${colors.secondary}10` }}
              >
                <InboxOutlined
                  style={{ fontSize: "32px", color: colors.secondary }}
                />
              </div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Inventario
              </Title>
              <Text
                style={{ textAlign: "center", marginTop: "8px", color: "#666" }}
              >
                Productos y stock
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={handleCalendarioClick}
              className="simple-card"
              style={{
                height: "180px",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                position: "relative",
                border: "none",
              }}
              bodyStyle={{
                padding: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="card-accent"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "5px",
                  background: colors.accent,
                }}
              />
              <div
                className="icon-container"
                style={{ background: `${colors.accent}10` }}
              >
                <CalendarOutlined
                  style={{ fontSize: "32px", color: colors.accent }}
                />
              </div>
              <Title
                level={3}
                style={{ margin: 0, color: colors.accent, textAlign: "center" }}
              >
                Calendario
              </Title>
              <Text
                style={{ textAlign: "center", marginTop: "8px", color: "#666" }}
              >
                Citas y eventos
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={handleClientesClick}
              className="simple-card"
              style={{
                height: "180px",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                position: "relative",
                border: "none",
              }}
              bodyStyle={{
                padding: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="card-accent"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "5px",
                  background: colors.primary,
                }}
              />
              <div
                className="icon-container"
                style={{ background: `${colors.primary}10` }}
              >
                <TeamOutlined
                  style={{ fontSize: "32px", color: colors.primary }}
                />
              </div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Clientes
              </Title>
              <Text
                style={{ textAlign: "center", marginTop: "8px", color: "#666" }}
              >
                Gestión de clientes
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={handleServicioTecnicoClick}
              className="simple-card"
              style={{
                height: "180px",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                position: "relative",
                border: "none",
              }}
              bodyStyle={{
                padding: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="card-accent"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "5px",
                  background: colors.secondary,
                }}
              />
              <div
                className="icon-container"
                style={{ background: `${colors.secondary}10` }}
              >
                <ToolOutlined
                  style={{ fontSize: "32px", color: colors.secondary }}
                />
              </div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Servicio Técnico
              </Title>
              <Text
                style={{ textAlign: "center", marginTop: "8px", color: "#666" }}
              >
                Reparaciones y soporte
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={handleVentasClick}
              className="simple-card"
              style={{
                height: "180px",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                position: "relative",
                border: "none",
              }}
              bodyStyle={{
                padding: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="card-accent"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "5px",
                  background: colors.accent,
                }}
              />
              <div
                className="icon-container"
                style={{ background: `${colors.accent}10` }}
              >
                <FileTextOutlined 
                  style={{ fontSize: "32px", color: colors.accent }}
                />
              </div>
              <Title
                level={3}
                style={{ margin: 0, color: colors.accent, textAlign: "center" }}
              >
                Lista Ventas
              </Title>
              <Text
                style={{ textAlign: "center", marginTop: "8px", color: "#666" }}
              >
                Lista de las ventas
              </Text>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomeContent;
