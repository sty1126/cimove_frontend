"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  InputNumber,
  Button,
  Space,
  Divider,
  Row,
  Col,
  Empty,
  Alert,
  message,
  Spin,
  Tag,
  Statistic,
  Badge,
} from "antd";
import {
  ShoppingCartOutlined,
  SendOutlined,
  TeamOutlined,
  ShoppingOutlined,
  DollarOutlined,
  InboxOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useCart } from "../context/CartContext"; // Ajusta la ruta según tu estructura

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

const ProcesarPedido = () => {
  const [productosConProveedores, setProductosConProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  // Trae proveedores asociados a cada producto
  useEffect(() => {
    const fetchProveedores = async () => {
      if (!cart || cart.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const ids = cart.map((p) => p.id_producto).join(",");

      try {
        const res = await fetch(
          `https://cimove-backend.onrender.com/api/proveedor-producto?ids=${ids}`
        );
        const data = await res.json();

        // Agrupamos los proveedores por producto
        const agrupado = cart.map((prod) => {
          const proveedoresDelProducto = data
            .filter((prov) => prov.id_producto === prod.id_producto)
            .map((prov) => ({
              ...prov,
              cantidad: 0, // cantidad inicial
            }));

          return {
            ...prod,
            proveedores: proveedoresDelProducto,
          };
        });

        setProductosConProveedores(agrupado);
      } catch (error) {
        console.error("Error cargando proveedores múltiples:", error);
        message.error("Error al cargar los proveedores de los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, [cart]);

  // Calcular totales
  const calcularTotales = () => {
    let totalProductos = 0;
    let totalUnidades = 0;
    let totalProveedores = 0;

    productosConProveedores.forEach((producto) => {
      totalProductos++;
      producto.proveedores.forEach((prov) => {
        if (prov.cantidad > 0) {
          totalUnidades += prov.cantidad;
          totalProveedores++;
        }
      });
    });

    return { totalProductos, totalUnidades, totalProveedores };
  };

  const totales = calcularTotales();

  // Manejar cambio de cantidad
  const handleCantidadChange = (idProducto, idProveedor, cantidad) => {
    setProductosConProveedores((prev) =>
      prev.map((prod) =>
        prod.id_producto === idProducto
          ? {
              ...prod,
              proveedores: prod.proveedores.map((prov) =>
                prov.id_proveedor === idProveedor
                  ? { ...prov, cantidad: Number(cantidad) }
                  : prov
              ),
            }
          : prod
      )
    );
  };

  // Validar si hay al menos un producto con cantidad
  const hayProductosSeleccionados = () => {
    return productosConProveedores.some((prod) =>
      prod.proveedores.some((prov) => prov.cantidad > 0)
    );
  };

  // Enviar pedido
  const handleEnviar = async () => {
    if (!hayProductosSeleccionados()) {
      message.warning("Debe seleccionar al menos un producto y cantidad");
      return;
    }

    const payload = productosConProveedores
      .map((prod) => ({
        id_producto: prod.id_producto,
        proveedores: prod.proveedores
          .filter((p) => p.cantidad > 0)
          .map((p) => ({
            id_proveedor: p.id_proveedor,
            cantidad: p.cantidad,
          })),
      }))
      .filter((prod) => prod.proveedores.length > 0);

    setSubmitting(true);
    try {
      await axios.post("https://cimove-backend.onrender.com/api/ordenes/procesar-pedido", {
        productos: payload,
      });

      message.success({
        content: "Pedido procesado con éxito",
        icon: <CheckCircleOutlined style={{ color: colors.success }} />,
      });

      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate("/facturacion-proveedor");
      }, 500);
    } catch (err) {
      console.error("Error en la petición:", err);
      message.error("Error al procesar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  // Formatear moneda
  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "-";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("COP", "$");
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
        <Spin size="large" tip="Cargando productos y proveedores..." />
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div
        style={{
          padding: "24px",
          backgroundColor: colors.background,
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Card
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" align="center">
                  <Text type="secondary" style={{ fontSize: "16px" }}>
                    No hay productos en el carrito
                  </Text>
                  <Button
                    type="primary"
                    onClick={() => navigate("/catalogo")}
                    style={{
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }}
                  >
                    Ir al catálogo
                  </Button>
                </Space>
              }
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
              <ShoppingCartOutlined style={{ marginRight: "12px" }} />
              Procesar Pedido
            </Title>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/catalogo")}
              style={{ borderRadius: "6px" }}
            >
              Volver al catálogo
            </Button>
          </div>

          <Text
            type="secondary"
            style={{ marginBottom: "24px", display: "block" }}
          >
            Seleccione la cantidad de productos a solicitar a cada proveedor
          </Text>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          {/* Tarjetas de estadísticas */}
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} sm={8}>
              <Card
                size="small"
                style={{
                  borderLeft: `4px solid ${colors.primary}`,
                  borderRadius: "4px",
                }}
              >
                <Statistic
                  title="Total Productos"
                  value={totales.totalProductos}
                  prefix={
                    <ShoppingOutlined style={{ color: colors.primary }} />
                  }
                  valueStyle={{ color: colors.primary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                size="small"
                style={{
                  borderLeft: `4px solid ${colors.secondary}`,
                  borderRadius: "4px",
                }}
              >
                <Statistic
                  title="Unidades Seleccionadas"
                  value={totales.totalUnidades}
                  prefix={<InboxOutlined style={{ color: colors.secondary }} />}
                  valueStyle={{ color: colors.secondary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                size="small"
                style={{
                  borderLeft: `4px solid ${colors.accent}`,
                  borderRadius: "4px",
                }}
              >
                <Statistic
                  title="Proveedores Seleccionados"
                  value={totales.totalProveedores}
                  prefix={<TeamOutlined style={{ color: colors.accent }} />}
                  valueStyle={{ color: colors.accent }}
                />
              </Card>
            </Col>
          </Row>

          {/* Lista de productos */}
          {productosConProveedores.map((producto) => (
            <Card
              key={producto.id_producto}
              style={{ marginBottom: "16px", borderRadius: "8px" }}
              title={
                <Space>
                  <ShoppingOutlined style={{ color: colors.primary }} />
                  <Text strong>{producto.nombre_producto}</Text>
                </Space>
              }
              extra={
                <Space>
                  <Badge
                    count={producto.existencia_producto}
                    style={{
                      backgroundColor:
                        producto.existencia_producto <= 5
                          ? colors.danger
                          : producto.existencia_producto <= 15
                          ? colors.warning
                          : colors.success,
                    }}
                  >
                    <Tag color={colors.primary}>Stock actual</Tag>
                  </Badge>
                  <Tag color={colors.secondary} icon={<DollarOutlined />}>
                    {formatCurrency(producto.costoventa_producto)}
                  </Tag>
                </Space>
              }
            >
              <div style={{ marginBottom: "8px" }}>
                <Text type="secondary">{producto.descripcion_producto}</Text>
              </div>

              <Divider orientation="left">
                <Space>
                  <TeamOutlined style={{ color: colors.primary }} />
                  Proveedores
                </Space>
              </Divider>

              {producto.proveedores.length === 0 ? (
                <Alert
                  message="Sin proveedores"
                  description="Este producto no tiene proveedores asociados"
                  type="warning"
                  showIcon
                  icon={<WarningOutlined style={{ color: colors.warning }} />}
                />
              ) : (
                <Row gutter={[16, 16]}>
                  {producto.proveedores.map((prov) => (
                    <Col xs={24} sm={12} md={8} key={prov.id_proveedor}>
                      <Card size="small" bordered>
                        <div style={{ marginBottom: "8px" }}>
                          <Text strong>{prov.nombre_proveedor}</Text>
                        </div>
                        <Space align="center">
                          <Text>Cantidad:</Text>
                          <InputNumber
                            min={0}
                            value={prov.cantidad}
                            onChange={(value) =>
                              handleCantidadChange(
                                producto.id_producto,
                                prov.id_proveedor,
                                value
                              )
                            }
                            style={{ width: "100px" }}
                            disabled={submitting}
                          />
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card>
          ))}

          <Divider style={{ margin: "24px 0", borderColor: colors.light }} />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleEnviar}
              loading={submitting}
              disabled={!hayProductosSeleccionados()}
              size="large"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
                minWidth: "200px",
                height: "48px",
                fontSize: "16px",
              }}
            >
              Enviar Pedido
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProcesarPedido;
