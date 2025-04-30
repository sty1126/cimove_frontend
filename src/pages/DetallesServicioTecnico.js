"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Spin,
  Alert,
  Tag,
  Descriptions,
  Badge,
  Button,
  Statistic,
  Timeline,
} from "antd";
import {
  ToolOutlined,
  CalendarOutlined,
  UserOutlined,
  BankOutlined,
  PhoneOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  EditOutlined,
  PrinterOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

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

// Función para formatear moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

// Función para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return "No especificada";
  try {
    return dayjs(dateString).format("DD/MM/YYYY");
  } catch (error) {
    return "Fecha inválida";
  }
};

// Mapeo de estados a colores de badge
const estadoColors = {
  pendiente: "warning",
  "en proceso": "processing",
  completado: "success",
  cancelado: "error",
  facturado: "cyan",
};

const DetallesServicioTecnico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      console.error("ID no disponible");
      return;
    }

    const fetchData = async () => {
      try {
        const [sedesRes, proveedoresRes, servicioRes] = await Promise.all([
          axios.get("https://cimove-backend.onrender.com/api/sedes/"),
          axios.get("https://cimove-backend.onrender.com/api/proveedores/all"),
          axios.get(
            `https://cimove-backend.onrender.com/api/serviciotecnico/${id}`
          ),
        ]);

        setServicio(servicioRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("Hubo un problema cargando los datos del servicio técnico.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/servicios-tecnicos/editar/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate("/facturacion-ventas");
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
        <Spin size="large" tip="Cargando detalles del servicio técnico..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={handleBack}>
              Volver
            </Button>
          }
        />
      </div>
    );
  }

  if (!servicio) {
    return (
      <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <Alert
          message="No encontrado"
          description="No se encontró el servicio técnico solicitado."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={handleBack}>
              Volver
            </Button>
          }
        />
      </div>
    );
  }

  // Calcular el saldo pendiente
  const saldoPendiente =
    servicio.costo_serviciotecnico - servicio.abono_serviciotecnico;

  // Determinar el estado de pago
  let estadoPago = "Pendiente";
  let colorEstadoPago = "warning";

  if (servicio.id_factura_serviciotecnico) {
    estadoPago = "Facturado";
    colorEstadoPago = "success";
  } else if (servicio.abono_serviciotecnico >= servicio.costo_serviciotecnico) {
    estadoPago = "Pagado";
    colorEstadoPago = "success";
  } else if (servicio.abono_serviciotecnico > 0) {
    estadoPago = "Abonado";
    colorEstadoPago = "processing";
  }

  // Función para interpretar el estado del servicio
  const interpretarEstado = (estado) => {
    if (!estado) return "Pendiente";

    switch (estado.toUpperCase()) {
      case "D":
        return "En diagnóstico";
      case "A":
        return "Completado";
      default:
        return estado;
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Encabezado */}
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
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Title level={2} style={{ color: colors.primary, margin: 0 }}>
                <ToolOutlined style={{ marginRight: "12px" }} />
                Servicio Técnico #{id}
              </Title>
              <Text type="secondary">Detalles completos del servicio</Text>
            </div>
            <Space>
              <Button icon={<RollbackOutlined />} onClick={handleBack}>
                Volver
              </Button>
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                Imprimir
              </Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Editar
              </Button>
            </Space>
          </div>

          <Divider style={{ margin: "16px 0", borderColor: colors.light }} />

          {/* Estado del servicio */}
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8}>
              <Badge.Ribbon
                text={interpretarEstado(servicio.estado_serviciotecnico)}
                color={
                  servicio.estado_serviciotecnico?.toUpperCase() === "A"
                    ? "success"
                    : servicio.estado_serviciotecnico?.toUpperCase() === "D"
                    ? "processing"
                    : estadoColors[
                        servicio.estado_serviciotecnico?.toLowerCase()
                      ] || "default"
                }
              >
                <Card size="small" title="Estado del Servicio">
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <Text strong style={{ fontSize: "16px" }}>
                      {servicio.estadotecnico_serviciotecnico ||
                        "No especificado"}
                    </Text>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Badge.Ribbon text={estadoPago} color={colorEstadoPago}>
                <Card size="small" title="Estado de Pago">
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <Text strong style={{ fontSize: "16px" }}>
                      {servicio.id_factura_serviciotecnico
                        ? `Factura #${servicio.id_factura_serviciotecnico}`
                        : "Sin facturar"}
                    </Text>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Card size="small" title="Autorización">
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  {servicio.autorizado_serviciotecnico ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      Autorizado
                    </Tag>
                  ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                      No Autorizado
                    </Tag>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Información principal */}
        <Row gutter={24}>
          {/* Columna izquierda */}
          <Col xs={24} md={16}>
            {/* Detalles del servicio */}
            <Card
              title={
                <Space>
                  <FileTextOutlined style={{ color: colors.primary }} />
                  <span>Detalles del Servicio</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              >
                <Descriptions.Item label="Nombre del Servicio" span={2}>
                  <Text strong>{servicio.nombre_serviciotecnico}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Descripción">
                  <Paragraph
                    ellipsis={{ rows: 3, expandable: true, symbol: "más" }}
                  >
                    {servicio.descripcion_serviciotecnico}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Tipo de Daño">
                  <Tag
                    color={
                      servicio.tipo_dano_serviciotecnico === "grave"
                        ? "red"
                        : servicio.tipo_dano_serviciotecnico === "medio"
                        ? "orange"
                        : "green"
                    }
                  >
                    {servicio.tipo_dano_serviciotecnico?.toUpperCase() ||
                      "No especificado"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Clave del Dispositivo">
                  {servicio.clave_dispositivo_serviciotecnico ? (
                    <Text code>
                      {servicio.clave_dispositivo_serviciotecnico}
                    </Text>
                  ) : (
                    <Text type="secondary">No especificada</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Contacto Alternativo">
                  {servicio.numero_contacto_alternativo_servicio ? (
                    <Text>
                      <PhoneOutlined style={{ marginRight: "8px" }} />
                      {servicio.numero_contacto_alternativo_servicio}
                    </Text>
                  ) : (
                    <Text type="secondary">No especificado</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Fechas */}
            <Card
              title={
                <Space>
                  <CalendarOutlined style={{ color: colors.primary }} />
                  <span>Fechas</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <Timeline
                mode="left"
                items={[
                  {
                    label: formatDate(servicio.fecha_serviciotecnico),
                    children: "Fecha de Recepción",
                    color: "blue",
                    dot: <CalendarOutlined style={{ fontSize: "16px" }} />,
                  },
                  {
                    label: formatDate(servicio.fecha_entrega_serviciotecnico),
                    children: "Fecha de Entrega Estimada",
                    color: "orange",
                    dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
                  },
                  ...(servicio.garantia_aplica_serviciotecnico
                    ? [
                        {
                          label: formatDate(
                            servicio.fecha_garantia_serviciotecnico
                          ),
                          children: "Fecha de Garantía",
                          color: "green",
                          dot: (
                            <SafetyCertificateOutlined
                              style={{ fontSize: "16px" }}
                            />
                          ),
                        },
                      ]
                    : []),
                  ...(servicio.fecha_factura
                    ? [
                        {
                          label: formatDate(servicio.fecha_factura),
                          children: "Fecha de Facturación",
                          color: "purple",
                          dot: (
                            <FileProtectOutlined style={{ fontSize: "16px" }} />
                          ),
                        },
                      ]
                    : []),
                ]}
              />
            </Card>
          </Col>

          {/* Columna derecha */}
          <Col xs={24} md={8}>
            {/* Información del cliente */}
            <Card
              title={
                <Space>
                  <UserOutlined style={{ color: colors.primary }} />
                  <span>Cliente</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="ID Cliente">
                  <Tag color="blue">{servicio.id_cliente_serviciotecnico}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Nombre">
                  <Text strong>{servicio.nombre_cliente}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Sede">
                  <Space>
                    <BankOutlined />
                    <Text>{servicio.nombre_sede}</Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Información del proveedor */}
            {servicio.id_proveedor_serviciotecnico !== "PROV_TEMP_123" && (
              <Card
                title={
                  <Space>
                    <ShopOutlined style={{ color: colors.primary }} />
                    <span>Proveedor</span>
                  </Space>
                }
                style={{ marginBottom: "24px", borderRadius: "8px" }}
                headStyle={{ backgroundColor: "#f5f5f5" }}
              >
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="ID Proveedor">
                    <Tag color="purple">
                      {servicio.id_proveedor_serviciotecnico}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Nombre">
                    <Text strong>{servicio.nombre_proveedor}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {/* Información de costos */}
            <Card
              title={
                <Space>
                  <DollarOutlined style={{ color: colors.primary }} />
                  <span>Información Financiera</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Statistic
                    title="Costo Total"
                    value={servicio.costo_serviciotecnico}
                    precision={0}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{ color: colors.text }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Abono"
                    value={servicio.abono_serviciotecnico}
                    precision={0}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{ color: colors.success }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Saldo Pendiente"
                    value={saldoPendiente}
                    precision={0}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{
                      color:
                        saldoPendiente > 0 ? colors.danger : colors.success,
                    }}
                  />
                </Col>
              </Row>

              {/* Información de factura */}
              {servicio.id_factura_serviciotecnico && (
                <div style={{ marginTop: "16px" }}>
                  <Divider style={{ margin: "12px 0" }} />
                  <Tag
                    color="cyan"
                    icon={<FileProtectOutlined />}
                    style={{ padding: "5px 10px" }}
                  >
                    Facturado - Factura #{servicio.id_factura_serviciotecnico}
                  </Tag>
                </div>
              )}
            </Card>

            {/* Garantía */}
            <Card
              title={
                <Space>
                  <SafetyCertificateOutlined
                    style={{ color: colors.primary }}
                  />
                  <span>Garantía</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                {servicio.garantia_aplica_serviciotecnico ? (
                  <div>
                    <Tag
                      color="green"
                      icon={<CheckCircleOutlined />}
                      style={{ padding: "5px 10px", margin: "10px 0" }}
                    >
                      Aplica Garantía
                    </Tag>
                    <div style={{ marginTop: "10px" }}>
                      <Text strong>Fecha de Vencimiento:</Text>
                      <br />
                      <Text>
                        {formatDate(servicio.fecha_garantia_serviciotecnico)}
                      </Text>
                    </div>
                  </div>
                ) : (
                  <Tag
                    color="red"
                    icon={<CloseCircleOutlined />}
                    style={{ padding: "5px 10px" }}
                  >
                    No Aplica Garantía
                  </Tag>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Información adicional */}
        <Card
          title={
            <Space>
              <InfoCircleOutlined style={{ color: colors.primary }} />
              <span>Información Adicional</span>
            </Space>
          }
          style={{ marginBottom: "24px", borderRadius: "8px" }}
          headStyle={{ backgroundColor: "#f5f5f5" }}
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Statistic
                title="ID Servicio Técnico"
                value={servicio.id_serviciotecnico}
                valueStyle={{ fontSize: "16px" }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="ID Sede"
                value={servicio.id_sede_serviciotecnico}
                valueStyle={{ fontSize: "16px" }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="ID Factura"
                value={servicio.id_factura_serviciotecnico || "No facturado"}
                valueStyle={{ fontSize: "16px" }}
              />
            </Col>
          </Row>
        </Card>

        {/* Botones de acción */}
        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            marginBottom: "48px",
          }}
        >
          <Space size="large">
            <Button
              icon={<RollbackOutlined />}
              size="large"
              onClick={handleBack}
            >
              Volver
            </Button>
            <Button
              icon={<PrinterOutlined />}
              size="large"
              onClick={handlePrint}
            >
              Imprimir
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="large"
              onClick={handleEdit}
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
            >
              Editar Servicio
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default DetallesServicioTecnico;
