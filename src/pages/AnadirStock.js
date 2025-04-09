"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  Divider,
  Row,
  Col,
  InputNumber,
  Space,
  message,
  Spin,
  Table,
  Empty,
  Tag,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  ShopOutlined,
  ShoppingOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  NumberOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import axios from "axios";
import SeleccionarProductoGeneral from "./SeleccionarProductoGeneral";

const { Title, Text } = Typography;
const { Option } = Select;

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

const AnadirStock = () => {
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [sedes, setSedes] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [stockPorSede, setStockPorSede] = useState([]);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [addingLocation, setAddingLocation] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sedesRes = await axios.get("http://localhost:4000/api/sedes");
        setSedes(sedesRes.data);
      } catch (error) {
        console.error("Error al obtener sedes:", error);
        message.error("Error al cargar las sedes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Verificar si el producto existe en la sede
  const verificarSiExiste = async (idSede) => {
    if (!producto) return false;
    try {
      setAddingLocation(true);
      const response = await axios.get(
        `http://localhost:4000/api/inventariolocal/existe/${producto.id_producto}/${idSede}`
      );
      return response.data.existe; // Retorna true si el producto ya está en la sede
    } catch (error) {
      console.error("Error verificando existencia del producto", error);
      return false;
    } finally {
      setAddingLocation(false);
    }
  };

  // Agregar sede a la lista
  const agregarSede = async () => {
    if (!sedeSeleccionada || !producto) {
      message.warning("Seleccione un producto y una sede");
      return;
    }

    // Verificar si la sede ya está en la lista
    if (stockPorSede.some((s) => s.sede === sedeSeleccionada)) {
      message.warning("Esta sede ya ha sido agregada");
      return;
    }

    const yaExiste = await verificarSiExiste(sedeSeleccionada);

    // Obtener el nombre de la sede
    const sedeInfo = sedes.find((s) => s.id_sede === Number(sedeSeleccionada));
    const nombreSede = sedeInfo ? sedeInfo.nombre_sede : "Sede desconocida";

    setStockPorSede([
      ...stockPorSede,
      {
        key: Date.now(), // Clave única para la tabla
        sede: sedeSeleccionada,
        nombreSede: nombreSede,
        cantidad: "",
        stockMinimo: yaExiste ? null : "",
        stockMaximo: yaExiste ? null : "",
        existe: yaExiste,
      },
    ]);
    setSedeSeleccionada("");
  };

  // Actualizar cantidad o stock mínimo/máximo
  const actualizarCantidad = (key, campo, valor) => {
    setStockPorSede(
      stockPorSede.map((item) =>
        item.key === key ? { ...item, [campo]: valor } : item
      )
    );
  };

  // Eliminar sede de la lista
  const eliminarSede = (key) => {
    setStockPorSede(stockPorSede.filter((item) => item.key !== key));
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!producto) {
      message.warning("Seleccione un producto");
      return;
    }

    if (stockPorSede.length === 0) {
      message.warning("Agregue al menos una sede");
      return;
    }

    // Validar que todos los campos requeridos estén completos
    const camposIncompletos = stockPorSede.some((s) => {
      if (!s.cantidad) return true;
      if (!s.existe && (!s.stockMinimo || !s.stockMaximo)) return true;
      return false;
    });

    if (camposIncompletos) {
      message.warning("Complete todos los campos requeridos");
      return;
    }

    setSubmitting(true);

    try {
      await Promise.all(
        stockPorSede.map(async (s) => {
          let url, method, bodyData;

          if (s.existe) {
            url = `http://localhost:4000/api/inventariolocal/${producto.id_producto}/${s.sede}/ajustar`;
            method = "PATCH";
            bodyData = { cantidad: Number(s.cantidad) };
          } else {
            url = "http://localhost:4000/api/inventariolocal";
            method = "POST";
            bodyData = {
              id_producto_inventariolocal: producto.id_producto,
              id_sede_inventariolocal: Number(s.sede),
              existencia_inventariolocal: Number(s.cantidad),
              stockminimo_inventariolocal: s.stockMinimo
                ? Number(s.stockMinimo)
                : 0,
              stockmaximo_inventariolocal: s.stockMaximo
                ? Number(s.stockMaximo)
                : 1,
            };
          }

          const response = await axios({
            url,
            method,
            data: bodyData,
          });

          return response.data;
        })
      );

      message.success({
        content: "Stock actualizado correctamente",
        icon: <CheckCircleIcon />,
        style: {
          marginTop: "20px",
        },
      });

      // Limpiar formulario
      setStockPorSede([]);

      // Redirigir al inventario después de 1.5 segundos
      setTimeout(() => {
        navigate("/inventario");
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      message.error(
        "Error al actualizar stock: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Columnas para la tabla de stock por sede
  const columns = [
    {
      title: "Sede",
      dataIndex: "nombreSede",
      key: "nombreSede",
      render: (text, record) => (
        <Space>
          <ShopOutlined style={{ color: colors.primary }} />
          <Text strong>{text}</Text>
          {record.existe ? (
            <Tag color={colors.success} style={{ marginLeft: 8 }}>
              <CheckCircleOutlined /> Existente
            </Tag>
          ) : (
            <Tag color={colors.warning} style={{ marginLeft: 8 }}>
              <WarningOutlined /> Nuevo
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      width: 150,
      render: (text, record) => (
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          value={text}
          onChange={(value) =>
            actualizarCantidad(record.key, "cantidad", value)
          }
          placeholder="Cantidad"
          disabled={submitting}
          prefix={<NumberOutlined style={{ color: colors.primary }} />}
        />
      ),
    },
    {
      title: "Stock Mínimo",
      dataIndex: "stockMinimo",
      key: "stockMinimo",
      width: 150,
      render: (text, record) => {
        if (record.existe) {
          return (
            <Text type="secondary" italic>
              No aplicable
            </Text>
          );
        }
        return (
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            value={text}
            onChange={(value) =>
              actualizarCantidad(record.key, "stockMinimo", value)
            }
            placeholder="Mínimo"
            disabled={submitting}
            prefix={<ArrowDownOutlined style={{ color: colors.warning }} />}
          />
        );
      },
    },
    {
      title: "Stock Máximo",
      dataIndex: "stockMaximo",
      key: "stockMaximo",
      width: 150,
      render: (text, record) => {
        if (record.existe) {
          return (
            <Text type="secondary" italic>
              No aplicable
            </Text>
          );
        }
        return (
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            value={text}
            onChange={(value) =>
              actualizarCantidad(record.key, "stockMaximo", value)
            }
            placeholder="Máximo"
            disabled={submitting}
            prefix={<ArrowUpOutlined style={{ color: colors.success }} />}
          />
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => eliminarSede(record.key)}
          disabled={submitting}
          shape="circle"
        />
      ),
    },
  ];

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
        <Spin size="large" tip="Cargando datos iniciales..." />
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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Botón de volver */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/inventario")}
          style={{ marginBottom: "16px" }}
        >
          Volver al inventario
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
              <ShoppingOutlined style={{ marginRight: "12px" }} />
              Añadir Stock
            </Title>
            <Text type="secondary">
              Actualice el stock de productos en diferentes sedes
            </Text>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Form.Item
                label={
                  <Space>
                    <ShoppingOutlined style={{ color: colors.primary }} />
                    Producto
                  </Space>
                }
              >
                <Input.Group compact>
                  <Input
                    style={{ width: "calc(100% - 120px)" }}
                    placeholder="Seleccione un producto"
                    value={producto ? producto.nombre_producto : ""}
                    readOnly
                  />
                  <Button
                    type="primary"
                    onClick={() => setShowProductoModal(true)}
                    style={{
                      width: "120px",
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }}
                    disabled={submitting}
                  >
                    Seleccionar
                  </Button>
                </Input.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <Space>
                    <ShopOutlined style={{ color: colors.primary }} />
                    Sede
                  </Space>
                }
              >
                <Input.Group compact>
                  <Select
                    style={{ width: "calc(100% - 120px)" }}
                    placeholder="Seleccione sede"
                    value={sedeSeleccionada}
                    onChange={(value) => setSedeSeleccionada(value)}
                    disabled={!producto || submitting || addingLocation}
                  >
                    {sedes.map((s) => (
                      <Option key={s.id_sede} value={s.id_sede.toString()}>
                        {s.nombre_sede}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={agregarSede}
                    style={{
                      width: "120px",
                      backgroundColor: colors.secondary,
                      borderColor: colors.secondary,
                    }}
                    disabled={
                      !producto ||
                      !sedeSeleccionada ||
                      submitting ||
                      addingLocation
                    }
                    loading={addingLocation}
                  >
                    Añadir
                  </Button>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: "24px", marginBottom: "24px" }}>
            {stockPorSede.length > 0 ? (
              <Table
                columns={columns}
                dataSource={stockPorSede}
                pagination={false}
                rowKey="key"
                bordered
                size="middle"
                loading={submitting}
                style={{ marginBottom: "24px" }}
              />
            ) : (
              <Empty
                description={
                  <Space direction="vertical" align="center">
                    <Text type="secondary">No hay sedes agregadas</Text>
                    <Text type="secondary">
                      <InfoCircleOutlined style={{ marginRight: "8px" }} />
                      Seleccione un producto y agregue sedes para actualizar el
                      stock
                    </Text>
                  </Space>
                }
                style={{ margin: "40px 0" }}
              />
            )}
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <div
            style={{ display: "flex", justifyContent: "center", gap: "16px" }}
          >
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="large"
              onClick={handleSubmit}
              loading={submitting}
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
                minWidth: "180px",
              }}
              disabled={stockPorSede.length === 0}
            >
              Guardar Stock
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              size="large"
              onClick={() => navigate("/inventario")}
              style={{ minWidth: "120px" }}
              disabled={submitting}
            >
              Cancelar
            </Button>
          </div>
        </Card>

        {/* Modal para selección de producto */}
        <SeleccionarProductoGeneral
          show={showProductoModal}
          handleClose={() => setShowProductoModal(false)}
          setProducto={setProducto}
        />
      </div>
    </div>
  );
};

// Componente de icono personalizado
const CheckCircleIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11.003 16L17.073 9.929L15.659 8.515L11.003 13.172L8.174 10.343L6.76 11.757L11.003 16Z"
      fill={colors.success}
    />
  </svg>
);

export default AnadirStock;
