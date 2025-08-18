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
  EditOutlined,
  IdcardOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { obtenerEmpleadoPorId } from "../../services/empleadoService"; // ajusta el path si cambia

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

const DetalleEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const data = await obtenerEmpleadoPorId(id);
        setEmpleado(data);
      } catch (err) {
        console.error("Error cargando detalles del empleado:", err);
        setError("No se pudo cargar la información del empleado.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleado();
  }, [id]);

  // Obtener iniciales para el avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para generar colores basados en rol
  const getRoleColor = (role) => {
    if (!role) return colors.accent;

    // Crear un hash simple del nombre del rol
    let hash = 0;
    for (let i = 0; i < role.length; i++) {
      hash = role.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Usar algunos colores predefinidos basados en el hash
    const roleColors = [
      colors.primary,
      colors.secondary,
      colors.accent,
      "#5B9A82", // Verde azulado más vibrante
      "#2D93AD", // Azul turquesa más vibrante
    ];

    return roleColors[Math.abs(hash) % roleColors.length];
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
        <Spin size="large" tip="Cargando datos del empleado..." />
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

  if (!empleado) return null;

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
          onClick={() => navigate("/empleados")}
          style={{ marginBottom: "16px" }}
        >
          Volver a empleados
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
              Detalles del Empleado
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
                backgroundColor: getRoleColor(empleado.descripcion_tipousuario),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "28px",
              }}
            >
              {getInitials(empleado.nombre_empleado)}
            </Avatar>
            <div style={{ marginLeft: "20px" }}>
              <Title level={3} style={{ margin: 0 }}>
                {empleado.nombre_empleado}
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                {empleado.cargo_empleado}
              </Text>
              <div style={{ marginTop: "8px" }}>
                <Tag
                  color={getRoleColor(empleado.descripcion_tipousuario)}
                  style={{
                    color: "#0D5F70",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: `${getRoleColor(
                      empleado.descripcion_tipousuario
                    )}40`,
                  }}
                >
                  <TeamOutlined style={{ marginRight: "4px" }} />
                  {empleado.descripcion_tipousuario}
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
                  <BankOutlined style={{ marginRight: "4px" }} />
                  {empleado.nombre_sede}
                </Tag>
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(`/empleados/editar/${empleado.id_empleado}`)
                }
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                }}
              >
                Editar
              </Button>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {/* Información personal */}
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <UserOutlined style={{ color: colors.primary }} />
                    <span>Información Personal</span>
                  </Space>
                }
                bordered={false}
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="ID Empleado">
                    <Text strong>{empleado.id_empleado}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Teléfono">
                    <Space>
                      <PhoneOutlined style={{ color: colors.primary }} />
                      {empleado.telefono_empleado || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email Personal">
                    <Space>
                      <MailOutlined style={{ color: colors.primary }} />
                      {empleado.email_empleado || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Estado">
                    {renderEstado(empleado.estado_empleado)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Información de usuario */}
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <IdcardOutlined style={{ color: colors.primary }} />
                    <span>Información de Usuario</span>
                  </Space>
                }
                bordered={false}
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Email Corporativo">
                    <Space>
                      <MailOutlined style={{ color: colors.primary }} />
                      {empleado.email_usuario || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Teléfono Usuario">
                    <Space>
                      <PhoneOutlined style={{ color: colors.primary }} />
                      {empleado.telefono_usuario || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Rol">
                    <Space>
                      <TeamOutlined style={{ color: colors.primary }} />
                      {empleado.descripcion_tipousuario || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Estado Usuario">
                    {renderEstado(empleado.estado_usuario)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Información de sede */}
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <EnvironmentOutlined style={{ color: colors.primary }} />
                    <span>Información de Sede</span>
                  </Space>
                }
                bordered={false}
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Sede">
                    <Space>
                      <BankOutlined style={{ color: colors.primary }} />
                      {empleado.nombre_sede || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Información de salario */}
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <DollarOutlined style={{ color: colors.primary }} />
                    <span>Información de Salario</span>
                  </Space>
                }
                bordered={false}
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Monto Salario">
                    <Text strong style={{ color: colors.success }}>
                      ${empleado.monto_salario?.toLocaleString() || "0"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tipo de Pago">
                    <Space>
                      <CalendarOutlined style={{ color: colors.primary }} />
                      {empleado.tipopago_salario || "No disponible"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Estado del Salario">
                    {renderEstado(empleado.estado_salario)}
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
              onClick={() => navigate("/empleados")}
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

export default DetalleEmpleado;
