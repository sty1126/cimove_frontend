"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Divider,
  Row,
  Col,
  Spin,
  Alert,
  Tag,
  Descriptions,
  Space,
  Avatar,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  ArrowLeftOutlined,
  IdcardOutlined,
  TeamOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  ManOutlined,
  BuildOutlined,
  NumberOutlined,
  HomeOutlined,
  TagOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

// Paleta de colores personalizada
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

const DetalleCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await axios.get(`https://cimove-backend.onrender.com/api/clientes/${id}`);
        setCliente(Array.isArray(res.data) ? res.data[0] : res.data);
      } catch (err) {
        console.error("Error cargando detalles del cliente:", err);
        setError("No se pudo cargar la información del cliente.");
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  // Obtener iniciales para el avatar
  const getInitials = (name) => {
    if (!name) return "?";

    if (cliente?.descripcion_tipocliente === "Persona Natural") {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    } else {
      // Para empresas, usar la primera letra de la razón social o nombre comercial
      const businessName =
        cliente?.razonsocial_cliente || cliente?.nombrecomercial_cliente || "?";
      return businessName.substring(0, 1).toUpperCase();
    }
  };

  // Función para generar colores basados en tipo de cliente
  const getClientTypeColor = (type) => {
    if (!type) return colors.accent;

    if (type === "Persona Natural") {
      return colors.secondary;
    } else {
      return colors.primary;
    }
  };

  // Renderizar estado con tag de color
  const renderEstado = (estado) => {
    if (!estado) return <Tag>No disponible</Tag>;

    let color = "";
    let text = "";

    switch (estado.toUpperCase()) {
      case "A":
        color = colors.success;
        text = "Activo";
        break;
      case "I":
        color = colors.danger;
        text = "Inactivo";
        break;
      default:
        color = colors.warning;
        text = estado;
    }

    return (
      <Tag
        color={color}
        style={{
          color: "#fff",
          padding: "2px 8px",
          borderRadius: "4px",
          border: "none",
        }}
      >
        {text}
      </Tag>
    );
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Cargando datos del cliente..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ maxWidth: "800px", margin: "0 auto" }}
        />
      </div>
    );
  }

  if (!cliente) return null;

  const isPersonaNatural =
    cliente.descripcion_tipocliente === "Persona Natural";

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Botón de volver */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/clientes")}
          style={{ marginBottom: "16px" }}
        >
          Volver a clientes
        </Button>

        <Card
          bordered={false}
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={2} style={{ color: colors.primary, margin: 0 }}>
              <InfoCircleOutlined style={{ marginRight: "12px" }} />
              Detalles del Cliente
            </Title>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          {/* Cabecera con información principal */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <Avatar
              size={80}
              style={{
                backgroundColor: getClientTypeColor(
                  cliente.descripcion_tipocliente
                ),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "28px",
              }}
            >
              {isPersonaNatural ? (
                getInitials(cliente.nombre_cliente)
              ) : (
                <ShopOutlined style={{ fontSize: "32px" }} />
              )}
            </Avatar>
            <div style={{ marginLeft: "20px" }}>
              <Title level={3} style={{ margin: 0 }}>
                {isPersonaNatural
                  ? `${cliente.nombre_cliente || ""} ${
                      cliente.apellido_cliente || ""
                    }`
                  : cliente.razonsocial_cliente}
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                {isPersonaNatural
                  ? "Cliente Personal"
                  : cliente.nombrecomercial_cliente || "Empresa"}
              </Text>
              <div style={{ marginTop: "8px" }}>
                <Tag
                  color={getClientTypeColor(cliente.descripcion_tipocliente)}
                  style={{
                    color: "#0D5F70",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: `${getClientTypeColor(
                      cliente.descripcion_tipocliente
                    )}40`,
                  }}
                >
                  {isPersonaNatural ? (
                    <UserOutlined style={{ marginRight: "4px" }} />
                  ) : (
                    <ShopOutlined style={{ marginRight: "4px" }} />
                  )}
                  {cliente.descripcion_tipocliente}
                </Tag>
                <Tag
                  color={colors.accent}
                  style={{
                    color: "#0D5F70",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: `${colors.accent}40`,
                    marginLeft: "8px",
                  }}
                >
                  <IdcardOutlined style={{ marginRight: "4px" }} />
                  {cliente.descripcion_tipodocumento}: {cliente.id_cliente}
                  {cliente.digitoverificacion_cliente &&
                    `-${cliente.digitoverificacion_cliente}`}
                </Tag>
              </div>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {/* Información de contacto */}
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <PhoneOutlined style={{ color: colors.primary }} />
                    <span>Información de Contacto</span>
                  </Space>
                }
                bordered={false}
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Teléfono">
                    <Space>
                      <PhoneOutlined style={{ color: colors.primary }} />
                      {cliente.telefono_cliente || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined style={{ color: colors.primary }} />
                      {cliente.email_cliente || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Sede">
                    <Space>
                      <BankOutlined style={{ color: colors.primary }} />
                      {cliente.nombre_sede ||
                        cliente.id_sede_cliente ||
                        "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Estado">
                    {renderEstado(cliente.estado_cliente)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Información de dirección */}
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <EnvironmentOutlined style={{ color: colors.primary }} />
                    <span>Información de Ubicación</span>
                  </Space>
                }
                bordered={false}
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Dirección">
                    <Space>
                      <HomeOutlined style={{ color: colors.primary }} />
                      {cliente.direccion_cliente || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Barrio">
                    <Space>
                      <EnvironmentOutlined style={{ color: colors.primary }} />
                      {cliente.barrio_cliente || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Código Postal">
                    <Space>
                      <EnvironmentOutlined style={{ color: colors.primary }} />
                      {cliente.codigopostal_cliente || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Información específica según tipo de cliente */}
            {isPersonaNatural ? (
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <UserOutlined style={{ color: colors.secondary }} />
                      <span>Datos Personales</span>
                    </Space>
                  }
                  bordered={false}
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                >
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="Nombre Completo">
                      <Space>
                        <UserOutlined style={{ color: colors.secondary }} />
                        {`${cliente.nombre_cliente || ""} ${
                          cliente.apellido_cliente || ""
                        }`}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Fecha de Nacimiento">
                      <Space>
                        <CalendarOutlined style={{ color: colors.secondary }} />
                        {formatDate(cliente.fechanacimiento_cliente)}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Género">
                      <Space>
                        <ManOutlined style={{ color: colors.secondary }} />
                        {cliente.genero_cliente || "No especificado"}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            ) : (
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <ShopOutlined style={{ color: colors.primary }} />
                      <span>Datos Empresariales</span>
                    </Space>
                  }
                  bordered={false}
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                >
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="Razón Social">
                      <Space>
                        <BuildOutlined style={{ color: colors.primary }} />
                        {cliente.razonsocial_cliente || "No disponible"}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Nombre Comercial">
                      <Space>
                        <ShopOutlined style={{ color: colors.primary }} />
                        {cliente.nombrecomercial_cliente || "No disponible"}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Representante Legal">
                      <Space>
                        <TeamOutlined style={{ color: colors.primary }} />
                        {cliente.representante_cliente || "No disponible"}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="NIT">
                      <Space>
                        <NumberOutlined style={{ color: colors.primary }} />
                        {cliente.id_cliente}
                        {cliente.digitoverificacion_cliente &&
                          `-${cliente.digitoverificacion_cliente}`}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            )}

            {/* Información adicional */}
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <TagOutlined style={{ color: colors.primary }} />
                    <span>Información Adicional</span>
                  </Space>
                }
                bordered={false}
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Tipo de Cliente">
                    <Space>
                      {isPersonaNatural ? (
                        <UserOutlined style={{ color: colors.secondary }} />
                      ) : (
                        <ShopOutlined style={{ color: colors.primary }} />
                      )}
                      {cliente.descripcion_tipocliente || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tipo de Documento">
                    <Space>
                      <IdcardOutlined style={{ color: colors.primary }} />
                      {cliente.descripcion_tipodocumento || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Fecha de Registro">
                    <Space>
                      <CalendarOutlined style={{ color: colors.primary }} />
                      {cliente.fecha_registro
                        ? formatDate(cliente.fecha_registro)
                        : "No disponible"}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/clientes")}
              style={{
                backgroundColor: colors.secondary,
                borderColor: colors.secondary,
              }}
            >
              Volver a la lista
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DetalleCliente;
