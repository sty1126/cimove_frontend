"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Spin,
  Typography,
  Divider,
  Row,
  Col,
  Table,
  Tag,
  Alert,
  Descriptions,
  Statistic,
  Space,
  Badge,
  Empty,
  Progress,
} from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  PercentageOutlined,
  BarcodeOutlined,
  TagOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ShopOutlined,
  TeamOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

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

const DetallesProducto = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const { productoId } = useParams();

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:4000/api/productos/detalle/${productoId}`).then(
        (res) => res.json()
      ),
      fetch(
        `http://localhost:4000/api/productos/${productoId}/proveedores`
      ).then((res) => res.json()),
    ])
      .then(([productoData, proveedoresData]) => {
        console.log("Datos recibidos en el frontend:", productoData);
        console.log("Proveedores recibidos:", proveedoresData);
        setProduct(productoData);
        setProveedores(proveedoresData);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productoId]);

  // Calcular el porcentaje de margen de utilidad
  const calcularPorcentajeMargen = () => {
    if (!product) return 0;
    const costo = Number.parseFloat(product.costoventa_producto);
    const precio = Number.parseFloat(product.precioventaact_producto);
    if (costo === 0) return 0;
    return ((precio - costo) / precio) * 100;
  };

  // Columnas para la tabla de inventario en sedes
  const columnasInventario = [
    {
      title: "Sede",
      dataIndex: "sede_nombre",
      key: "sede_nombre",
      render: (text) => (
        <Space>
          <ShopOutlined style={{ color: colors.primary }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Existencia",
      dataIndex: "existencia",
      key: "existencia",
      align: "center",
      render: (text, record) => {
        let color = colors.success;
        let status = "success";

        // Verificar si está por debajo del stock mínimo
        if (record.stock_minimo && text < record.stock_minimo) {
          color = colors.danger;
          status = "error";
        } else if (record.stock_maximo && text > record.stock_maximo * 0.8) {
          // Si está por encima del 80% del stock máximo
          color = colors.warning;
          status = "warning";
        }

        return (
          <Badge status={status} text={<Text style={{ color }}>{text}</Text>} />
        );
      },
    },
    {
      title: "Stock Mínimo",
      dataIndex: "stock_minimo",
      key: "stock_minimo",
      align: "center",
      render: (text) => text || <Text type="secondary">No definido</Text>,
    },
    {
      title: "Stock Máximo",
      dataIndex: "stock_maximo",
      key: "stock_maximo",
      align: "center",
      render: (text) => text || <Text type="secondary">No definido</Text>,
    },
    {
      title: "Nivel de Stock",
      key: "nivel",
      align: "center",
      render: (_, record) => {
        if (!record.stock_minimo || !record.stock_maximo) {
          return <Text type="secondary">No disponible</Text>;
        }

        const min = Number.parseFloat(record.stock_minimo);
        const max = Number.parseFloat(record.stock_maximo);
        const actual = Number.parseFloat(record.existencia);
        const rango = max - min;

        if (rango <= 0)
          return <Text type="secondary">Error en configuración</Text>;

        // Calcular porcentaje relativo al rango
        let porcentaje = ((actual - min) / rango) * 100;
        porcentaje = Math.max(0, Math.min(100, porcentaje)); // Limitar entre 0 y 100

        let color = colors.success;
        if (porcentaje < 30) color = colors.danger;
        else if (porcentaje < 60) color = colors.warning;

        return (
          <Progress
            percent={Math.round(porcentaje)}
            strokeColor={color}
            size="small"
          />
        );
      },
    },
  ];

  // Columnas para la tabla de proveedores
  const columnasProveedores = [
    {
      title: "Proveedor",
      dataIndex: "nombre_proveedor",
      key: "nombre_proveedor",
      render: (text) => (
        <Space>
          <TeamOutlined style={{ color: colors.primary }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Teléfono",
      dataIndex: "telefono_proveedor",
      key: "telefono_proveedor",
      render: (text) => (
        <Space>
          <PhoneOutlined style={{ color: colors.secondary }} />
          <Text>{text || "No disponible"}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email_proveedor",
      key: "email_proveedor",
      render: (text) => (
        <Space>
          <MailOutlined style={{ color: colors.accent }} />
          <Text>{text || "No disponible"}</Text>
        </Space>
      ),
    },
  ];

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
        <Spin size="large" tip="Cargando detalles del producto..." />
      </div>
    );

  if (!product)
    return (
      <div
        style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}
      >
        <Alert
          message="Producto no encontrado"
          description="No se pudo encontrar la información del producto solicitado."
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
              marginBottom: "16px",
            }}
          >
            <Title level={2} style={{ margin: 0, color: colors.primary }}>
              <ShoppingOutlined style={{ marginRight: "12px" }} />
              {product.nombre_producto}
            </Title>
            <Tag
              color={
                product.estado_producto === "A" ? colors.success : colors.danger
              }
              style={{
                padding: "4px 12px",
                fontSize: "14px",
                borderRadius: "12px",
              }}
            >
              {product.estado_producto === "A" ? (
                <>
                  <CheckCircleOutlined /> Activo
                </>
              ) : (
                <>
                  <WarningOutlined /> Inactivo
                </>
              )}
            </Tag>
          </div>

          <Text
            type="secondary"
            style={{ fontSize: "16px", display: "block", marginBottom: "24px" }}
          >
            {product.descripcion_producto || "Sin descripción disponible"}
          </Text>

          <Divider style={{ margin: "12px 0", borderColor: colors.light }} />

          {/* Estadísticas principales */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={
                  <Text style={{ fontSize: "14px", color: colors.text }}>
                    <DollarOutlined
                      style={{ marginRight: "8px", color: colors.primary }}
                    />
                    Precio de Venta
                  </Text>
                }
                value={product.precioventaact_producto}
                precision={2}
                valueStyle={{ color: colors.primary, fontWeight: "bold" }}
                prefix="$"
              />
              {product.precioventaant_producto && (
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Precio anterior: ${product.precioventaant_producto}
                </Text>
              )}
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={
                  <Text style={{ fontSize: "14px", color: colors.text }}>
                    <DollarOutlined
                      style={{ marginRight: "8px", color: colors.secondary }}
                    />
                    Costo de Venta
                  </Text>
                }
                value={product.costoventa_producto}
                precision={2}
                valueStyle={{ color: colors.secondary, fontWeight: "bold" }}
                prefix="$"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={
                  <Text style={{ fontSize: "14px", color: colors.text }}>
                    <PercentageOutlined
                      style={{ marginRight: "8px", color: colors.accent }}
                    />
                    Margen de Utilidad
                  </Text>
                }
                value={calcularPorcentajeMargen()}
                precision={2}
                valueStyle={{ color: colors.accent, fontWeight: "bold" }}
                suffix="%"
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Valor: ${product.margenutilidad_producto}
              </Text>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={
                  <Text style={{ fontSize: "14px", color: colors.text }}>
                    <ShoppingOutlined
                      style={{ marginRight: "8px", color: colors.warning }}
                    />
                    Existencia Total
                  </Text>
                }
                value={product.existencia_total || 0}
                valueStyle={{ color: colors.warning, fontWeight: "bold" }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                IVA: {product.valoriva_producto * 100}%
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Información adicional */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            {/* Inventario en Sedes */}
            <Card
              title={
                <Space>
                  <ShopOutlined style={{ color: colors.primary }} />
                  <span>Inventario en Sedes</span>
                </Space>
              }
              bordered={false}
              style={{
                marginBottom: "24px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              headStyle={{ borderBottom: `2px solid ${colors.primary}20` }}
            >
              {product.inventario_sedes &&
              product.inventario_sedes.length > 0 ? (
                <Table
                  columns={columnasInventario}
                  dataSource={product.inventario_sedes.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={false}
                  size="middle"
                  style={{ marginTop: "12px" }}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No hay información de inventario en sedes"
                />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            {/* Proveedores */}
            <Card
              title={
                <Space>
                  <TeamOutlined style={{ color: colors.primary }} />
                  <span>Proveedores</span>
                </Space>
              }
              bordered={false}
              style={{
                marginBottom: "24px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              headStyle={{ borderBottom: `2px solid ${colors.primary}20` }}
            >
              {proveedores.length > 0 ? (
                <Table
                  columns={columnasProveedores}
                  dataSource={proveedores.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={false}
                  size="middle"
                  style={{ marginTop: "12px" }}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No hay proveedores asociados a este producto"
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* Información detallada */}
        <Card
          title={
            <Space>
              <InfoCircleOutlined style={{ color: colors.primary }} />
              <span>Información Detallada</span>
            </Space>
          }
          bordered={false}
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          headStyle={{ borderBottom: `2px solid ${colors.primary}20` }}
        >
          <Descriptions
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="ID Producto">
              <BarcodeOutlined
                style={{ color: colors.primary, marginRight: "8px" }}
              />
              {product.id_producto}
            </Descriptions.Item>
            <Descriptions.Item label="Categoría">
              <TagOutlined
                style={{ color: colors.secondary, marginRight: "8px" }}
              />
              {product.categoria || "No disponible"}
            </Descriptions.Item>
            <Descriptions.Item label="IVA">
              <PercentageOutlined
                style={{ color: colors.accent, marginRight: "8px" }}
              />
              {product.valoriva_producto * 100}%
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Creación">
              {product.fecha_creacion || "No disponible"}
            </Descriptions.Item>
            <Descriptions.Item label="Última Actualización">
              {product.fecha_actualizacion || "No disponible"}
            </Descriptions.Item>
            <Descriptions.Item label="Código de Barras">
              {product.codigo_barras || "No disponible"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default DetallesProducto;
