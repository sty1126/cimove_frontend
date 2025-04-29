"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Spin,
  message,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Tag,
  Avatar,
  Descriptions,
  Alert,
  Statistic,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  TagOutlined,
  IdcardOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
  TeamOutlined,
  CalendarOutlined,
  CommentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;

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

const DetallesProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener detalles del proveedor
        const responseProveedor = await axios.get(
          `https://cimove-backend.onrender.com/api/proveedores/${id}`
        );
        setProveedor(responseProveedor.data);

        // Intentar obtener productos asociados al proveedor (si existe el endpoint)
        try {
          const responseProductos = await axios.get(
            `https://cimove-backend.onrender.com/api/proveedores/${id}/productos`
          );
          setProductos(responseProductos.data);
        } catch (error) {
          console.log("No se pudieron cargar los productos asociados");
          setProductos([]);
        }
      } catch (error) {
        message.error("Error al obtener los detalles del proveedor");
      } finally {
        setLoading(false);
        setLoadingProductos(false);
      }
    };

    fetchData();
  }, [id]);

  // Función para obtener iniciales para el avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para generar color basado en tipo de proveedor
  const getProviderTypeColor = (type) => {
    if (!type) return colors.accent;

    // Crear un hash simple del nombre del tipo
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      hash = type.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Usar algunos colores predefinidos basados en el hash
    const typeColors = [
      colors.primary,
      colors.secondary,
      colors.accent,
      "#5B9A82", // Verde azulado más vibrante
      "#2D93AD", // Azul turquesa más vibrante
    ];

    return typeColors[Math.abs(hash) % typeColors.length];
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Cargando detalles del proveedor..." />
      </div>
    );

  if (!proveedor)
    return (
      <div
        style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}
      >
        <Alert
          message="Proveedor no encontrado"
          description="No se pudo encontrar la información del proveedor solicitado."
          type="error"
          showIcon
        />
      </div>
    );

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Botón de volver */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/proveedores")}
          style={{ marginBottom: "16px" }}
        >
          Volver a la lista
        </Button>

        {/* Tarjeta principal */}
        <Card
          bordered={false}
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <Avatar
              size={64}
              style={{
                backgroundColor: getProviderTypeColor(
                  proveedor.nombre_tipoproveedor
                ),
                marginRight: "16px",
              }}
            >
              {getInitials(proveedor.nombre_proveedor)}
            </Avatar>
            <div>
              <Title level={2} style={{ margin: 0, color: colors.primary }}>
                {proveedor.nombre_proveedor}
              </Title>
              <Space align="center">
                <Tag
                  color={getProviderTypeColor(proveedor.nombre_tipoproveedor)}
                  style={{
                    color: "#0D5F70",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: `${getProviderTypeColor(
                      proveedor.nombre_tipoproveedor
                    )}40`,
                  }}
                >
                  <TagOutlined style={{ marginRight: "4px" }} />
                  {proveedor.nombre_tipoproveedor || "Sin tipo"}
                </Tag>
                <Tag
                  color={
                    proveedor.estado_proveedor === "A"
                      ? colors.success
                      : colors.danger
                  }
                  style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {proveedor.estado_proveedor === "A" ? (
                    <>
                      <CheckCircleOutlined /> Activo
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined /> Inactivo
                    </>
                  )}
                </Tag>
              </Space>
            </div>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          {/* Información de contacto */}
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <UserOutlined style={{ color: colors.primary }} />
                    <span>Información de Contacto</span>
                  </Space>
                }
                bordered={false}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
                headStyle={{ borderBottom: `2px solid ${colors.primary}20` }}
              >
                <Descriptions column={1} layout="vertical" colon={false}>
                  {proveedor.representante_proveedor && (
                    <Descriptions.Item
                      label={
                        <Text type="secondary">
                          <UserOutlined style={{ marginRight: "8px" }} />
                          Representante
                        </Text>
                      }
                    >
                      <Text strong>{proveedor.representante_proveedor}</Text>
                    </Descriptions.Item>
                  )}

                  <Descriptions.Item
                    label={
                      <Text type="secondary">
                        <PhoneOutlined style={{ marginRight: "8px" }} />
                        Teléfono
                      </Text>
                    }
                  >
                    <Text strong>
                      {proveedor.telefono_proveedor || "No disponible"}
                    </Text>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <Text type="secondary">
                        <MailOutlined style={{ marginRight: "8px" }} />
                        Correo Electrónico
                      </Text>
                    }
                  >
                    <Text strong>
                      {proveedor.email_proveedor || "No disponible"}
                    </Text>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <Text type="secondary">
                        <HomeOutlined style={{ marginRight: "8px" }} />
                        Dirección
                      </Text>
                    }
                  >
                    <Text strong>
                      {proveedor.direccion_proveedor || "No disponible"}
                    </Text>
                  </Descriptions.Item>

                  {proveedor.ciudad_proveedor && (
                    <Descriptions.Item
                      label={
                        <Text type="secondary">
                          <GlobalOutlined style={{ marginRight: "8px" }} />
                          Ciudad
                        </Text>
                      }
                    >
                      <Text strong>{proveedor.ciudad_proveedor}</Text>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <IdcardOutlined style={{ color: colors.primary }} />
                    <span>Información Adicional</span>
                  </Space>
                }
                bordered={false}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
                headStyle={{ borderBottom: `2px solid ${colors.primary}20` }}
              >
                <Descriptions column={1} layout="vertical" colon={false}>
                  <Descriptions.Item
                    label={
                      <Text type="secondary">
                        <IdcardOutlined style={{ marginRight: "8px" }} />
                        ID Proveedor
                      </Text>
                    }
                  >
                    <Text strong>{proveedor.id_proveedor}</Text>
                  </Descriptions.Item>

                  {proveedor.nit_proveedor && (
                    <Descriptions.Item
                      label={
                        <Text type="secondary">
                          <IdcardOutlined style={{ marginRight: "8px" }} />
                          NIT
                        </Text>
                      }
                    >
                      <Text strong>{proveedor.nit_proveedor}</Text>
                    </Descriptions.Item>
                  )}

                  {proveedor.fecha_creacion && (
                    <Descriptions.Item
                      label={
                        <Text type="secondary">
                          <CalendarOutlined style={{ marginRight: "8px" }} />
                          Fecha de Registro
                        </Text>
                      }
                    >
                      <Text strong>
                        {new Date(
                          proveedor.fecha_creacion
                        ).toLocaleDateString()}
                      </Text>
                    </Descriptions.Item>
                  )}

                  {proveedor.observaciones_proveedor && (
                    <Descriptions.Item
                      label={
                        <Text type="secondary">
                          <CommentOutlined style={{ marginRight: "8px" }} />
                          Observaciones
                        </Text>
                      }
                    >
                      <Paragraph>{proveedor.observaciones_proveedor}</Paragraph>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </Col>
          </Row>

          {/* Estadísticas y productos (si están disponibles) */}
          {productos.length > 0 && (
            <Card
              title={
                <Space>
                  <TeamOutlined style={{ color: colors.primary }} />
                  <span>Productos Suministrados</span>
                </Space>
              }
              bordered={false}
              style={{
                marginTop: "24px",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              headStyle={{ borderBottom: `2px solid ${colors.primary}20` }}
            >
              <Row gutter={[16, 16]}>
                {productos.map((producto) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={producto.id_producto}>
                    <Card size="small" hoverable>
                      <Statistic
                        title={producto.nombre_producto}
                        value={`$${producto.precio}`}
                        precision={2}
                        valueStyle={{ color: colors.secondary }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          {/* Botones de acción */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/actualizar-proveedor/${proveedor.id_proveedor}`)
              }
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
            >
              Editar Proveedor
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DetallesProveedor;
