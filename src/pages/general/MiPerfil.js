// MiPerfil.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Descriptions,
  Button,
  Avatar,
  Spin,
  Tag,
  Space,
  Tabs,
  message,
  Alert
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  DollarOutlined,
  TeamOutlined,
  HomeOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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

function MiPerfil() {
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos del empleado actual
  useEffect(() => {
    const fetchDatosEmpleado = async () => {
      try {
        // Obtener ID del empleado desde localStorage
        const idEmpleado = localStorage.getItem("idEmpleado");
        
        if (!idEmpleado) {
          setError("No se ha encontrado información del usuario. Por favor, inicie sesión nuevamente.");
          setLoading(false);
          return;
        }
        
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/empleados/${idEmpleado}`);
        setEmpleado(response.data);
      } catch (error) {
        console.error("Error al cargar datos del empleado:", error);
        setError("No se pudieron cargar los datos del empleado");
      } finally {
        setLoading(false);
      }
    };

    fetchDatosEmpleado();
  }, []);

  // Redireccionar a la página de cambio de contraseña
  const handleIrACambiarPassword = () => {
    navigate("/reset-password");
  };

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

  // Componente de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        backgroundColor: colors.background 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Mostrar error si ocurrió uno
  if (error) {
    return (
      <div style={{ 
        padding: "24px", 
        backgroundColor: colors.background, 
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center" 
      }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          action={
            <Button 
              type="primary" 
              onClick={() => navigate("/login")}
              danger
            >
              Volver al inicio de sesión
            </Button>
          }
        />
      </div>
    );
  }

  // Si no hay empleado después de cargar
  if (!empleado) {
    return (
      <div style={{ 
        padding: "24px", 
        backgroundColor: colors.background, 
        minHeight: "100vh" 
      }}>
        <Alert
          message="No se encontraron datos"
          description="No se pudo encontrar información del perfil"
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "24px", 
      backgroundColor: colors.background, 
      minHeight: "100vh" 
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Card
          bordered={false}
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            overflow: "hidden"
          }}
        >
          {/* Encabezado del perfil */}
          <div style={{ 
            backgroundColor: colors.primary, 
            margin: "-24px -24px 0",
            padding: "40px 24px 100px",
            position: "relative"
          }}>
            <Title level={2} style={{ color: "white", margin: 0 }}>
              Mi Perfil
            </Title>
            <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Gestiona tu información y contraseña
            </Text>
          </div>

          {/* Tarjeta de información principal */}
          <Card
            style={{
              marginTop: "-80px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                <Avatar 
                  size={120} 
                  style={{ 
                    backgroundColor: colors.secondary,
                    fontSize: "48px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  {getInitials(empleado.nombre_empleado)}
                </Avatar>
                <div style={{ marginTop: "16px" }}>
                  <Title level={3} style={{ marginBottom: "4px" }}>
                    {empleado.nombre_empleado}
                  </Title>
                  <Tag color={colors.primary} style={{ padding: "4px 12px" }}>
                    {empleado.cargo_empleado}
                  </Tag>
                </div>
              </Col>

              <Col xs={24} sm={16}>
                <Tabs defaultActiveKey="personal">
                  <TabPane 
                    tab={
                      <span>
                        <UserOutlined /> Información Personal
                      </span>
                    } 
                    key="personal"
                  >
                    <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                      <Descriptions.Item label={<><IdcardOutlined /> ID</>}>
                        {empleado.id_empleado}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><PhoneOutlined /> Teléfono</>}>
                        {empleado.telefono_empleado}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><MailOutlined /> Email</>}>
                        {empleado.email_empleado}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><HomeOutlined /> Sede</>}>
                        {empleado.nombre_sede}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><TeamOutlined /> Tipo de usuario</>}>
                        {empleado.descripcion_tipousuario}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><DollarOutlined /> Salario</>}>
                        {empleado.monto_salario ? 
                          `$${empleado.monto_salario.toLocaleString()} - ${empleado.tipopago_salario}` : 
                          "No disponible"}
                      </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginTop: "24px", textAlign: "right" }}>
                      <Button
                        type="primary"
                        icon={<LockOutlined />}
                        onClick={handleIrACambiarPassword}
                        style={{
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        }}
                      >
                        Cambiar Contraseña
                      </Button>
                    </div>
                  </TabPane>

                  <TabPane 
                    tab={
                      <span>
                        <SafetyCertificateOutlined /> Acceso
                      </span>
                    } 
                    key="acceso"
                  >
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label={<><MailOutlined /> Email de usuario</>}>
                        {empleado.email_usuario}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><PhoneOutlined /> Teléfono de usuario</>}>
                        {empleado.telefono_usuario}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><TeamOutlined /> Tipo de acceso</>}>
                        <Tag color={colors.success}>{empleado.descripcion_tipousuario}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label={<><SafetyCertificateOutlined /> Estado</>}>
                        {empleado.estado_usuario === "A" ? (
                          <Tag color="green">Activo</Tag>
                        ) : (
                          <Tag color="red">Inactivo</Tag>
                        )}
                      </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginTop: "24px", textAlign: "right" }}>
                      <Button
                        type="primary"
                        icon={<LockOutlined />}
                        onClick={handleIrACambiarPassword}
                        style={{
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        }}
                      >
                        Cambiar Contraseña
                      </Button>
                    </div>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </Card>
        </Card>
      </div>
    </div>
  );
}

export default MiPerfil;
