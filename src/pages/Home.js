"use client";

import { useNavigate } from "react-router-dom";
import { Typography, Card, Row, Col, Divider } from "antd";
import {
  FileTextOutlined,
  InboxOutlined,
  CalendarOutlined,
  BellOutlined,
} from "@ant-design/icons";

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

  // Funciones para manejar el clic en cada sección
  const handleFacturarClick = () => navigate("/facturacion-ventas");
  const handleInventarioClick = () => navigate("/inventario");
  const handleCalendarioClick = () => navigate("/calendario");

  return (
    <div
      style={{
        padding: "24px",
        background: colors.background,
        borderRadius: "8px",
        minHeight: "100vh",
      }}
    >
      {/* Encabezado */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0, color: colors.primary }}>
          Kper-shop - NIT:999-999-999
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Inicio
        </Text>
      </div>

      <Divider style={{ margin: "12px 0 24px", borderColor: colors.light }} />

      {/* Sección de accesos rápidos */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} md={8}>
          <Card
            hoverable
            onClick={handleFacturarClick}
            style={{
              height: "200px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              position: "relative",
              border: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
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
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                background: colors.primary,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: `${colors.primary}10`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <FileTextOutlined
                  style={{ fontSize: "36px", color: colors.primary }}
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
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            hoverable
            onClick={handleInventarioClick}
            style={{
              height: "200px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              position: "relative",
              border: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
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
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                background: colors.secondary,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: `${colors.secondary}10`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <InboxOutlined
                  style={{ fontSize: "36px", color: colors.secondary }}
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
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            hoverable
            onClick={handleCalendarioClick}
            style={{
              height: "200px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              position: "relative",
              border: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
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
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                background: colors.accent,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: `${colors.accent}10`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <CalendarOutlined
                  style={{ fontSize: "36px", color: colors.accent }}
                />
              </div>
              <Title
                level={3}
                style={{ margin: 0, color: colors.accent, textAlign: "center" }}
              >
                Calendario
              </Title>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Sección de Notificaciones */}
      <Title level={4} style={{ marginBottom: "16px", color: colors.primary }}>
        Notificaciones
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                background: colors.warning,
              }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: `${colors.warning}10`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                }}
              >
                <BellOutlined
                  style={{ fontSize: "24px", color: colors.warning }}
                />
              </div>
              <div>
                <Text strong style={{ fontSize: "16px", display: "block" }}>
                  Pop-ups
                </Text>
                <Text type="secondary">Notificación, servicios técnicos</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                background: colors.warning,
              }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: `${colors.warning}10`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                }}
              >
                <BellOutlined
                  style={{ fontSize: "24px", color: colors.warning }}
                />
              </div>
              <div>
                <Text strong style={{ fontSize: "16px", display: "block" }}>
                  Pop-ups
                </Text>
                <Text type="secondary">Notificación, servicios técnicos</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomeContent;
