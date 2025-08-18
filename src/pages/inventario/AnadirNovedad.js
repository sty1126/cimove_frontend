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
  DatePicker,
  InputNumber,
  Space,
  message,
  Spin,
  Alert,
} from "antd";
import {
  SwapOutlined,
  CalendarOutlined,
  SaveOutlined,
  CloseOutlined,
  ShopOutlined,
  TagOutlined,
  UserOutlined,
  TeamOutlined,
  ShoppingOutlined,
  NumberOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  getTiposMovimiento,
  getSedes,
  crearNovedad,
} from "../../services/inventarioService";
import dayjs from "dayjs";
import SeleccionarProducto from "../productos/SeleccionarProducto";
import SeleccionarCliente from "../clientes/SeleccionarCliente";
import SeleccionarProveedor from "../proveedores/SeleccionarProveedor";

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

const AnadirNovedad = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tipoMov, setTipoMov] = useState("");
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [fecha, setFecha] = useState(dayjs());
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [sede, setSede] = useState("");
  const [sedeDestino, setSedeDestino] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [mostrarCamposStock, setMostrarCamposStock] = useState(false);
  const [stockMinimo, setStockMinimo] = useState("");
  const [stockMaximo, setStockMaximo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposMovRes, sedesRes] = await Promise.all([
          getTiposMovimiento(),
          getSedes(),
        ]);

        setTiposMovimiento(tiposMovRes);
        setSedes(sedesRes);
      } catch (error) {
        console.error("Error al obtener datos iniciales:", error);
        message.error("Error al cargar datos iniciales");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar cambio de tipo de movimiento
  const handleTipoMovChange = (value) => {
    setTipoMov(value);
    // Resetear campos relacionados
    if (value !== "5") {
      setSedeDestino("");
    }
    if (value !== "3" && value !== "6") {
      setClienteSeleccionado(null);
    }
    if (value !== "7" && value !== "9") {
      setProveedorSeleccionado(null);
    }
  };

  // Manejar cambio de sede
  const handleSedeChange = (value) => {
    setSede(value);
    setProducto(null); // Resetear producto al cambiar sede
  };

  // Obtener nombre del tipo de movimiento
  const getTipoMovimientoNombre = (id) => {
    const tipo = tiposMovimiento.find((t) => t.id_tipomov === Number(id));
    return tipo ? tipo.nom_tipomov : "";
  };

  // Enviar formulario
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      if (!producto) {
        message.error("Debe seleccionar un producto");
        setSubmitting(false);
        return;
      }

      if (cantidad <= 0) {
        message.error("La cantidad debe ser mayor a 0");
        setSubmitting(false);
        return;
      }

      const novedad = {
        ID_TIPOMOV_MOVIMIENTO: Number(tipoMov),
        ID_PRODUCTO_MOVIMIENTO: producto ? Number(producto.id_producto) : null,
        CANTIDAD_MOVIMIENTO: Number(cantidad),
        FECHA_MOVIMIENTO: fecha.format("YYYY-MM-DD"),
        ESTADO_MOVIMIENTO: "A",
        ID_SEDE_MOVIMIENTO: Number(sede),
        ID_SEDEDESTINO_MOVIMIENTO:
          tipoMov === "5" ? (sedeDestino ? Number(sedeDestino) : null) : null,
        ID_CLIENTE_MOVIMIENTO:
          tipoMov === "3" || tipoMov === "6"
            ? clienteSeleccionado?.id_cliente ?? null
            : null,
        ID_PROVEEDOR_MOVIMIENTO:
          tipoMov === "7" || tipoMov === "9"
            ? proveedorSeleccionado?.id_proveedor ?? null
            : null,
      };

      if (mostrarCamposStock && stockMinimo && stockMaximo) {
        novedad.STOCK_MINIMO = Number(stockMinimo);
        novedad.STOCK_MAXIMO = Number(stockMaximo);
      }

      const response = await crearNovedad(novedad);

      if (response.error === "FALTA_STOCK") {
        message.warning(
          "El producto no existe en la sede destino. Ingrese stock mínimo y máximo."
        );
        setMostrarCamposStock(true);
        setSubmitting(false);
        return;
      }

      message.success({
        content: "Novedad registrada exitosamente",
        icon: <CheckCircleIcon />,
        style: {
          marginTop: "20px",
        },
      });

      // Redirigir al inventario después de 1.5 segundos
      setTimeout(() => {
        navigate("/inventario");
      }, 1500);
    } catch (error) {
      console.error("Error al registrar la novedad:", error);
      message.error(
        "Error al registrar la novedad: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizar título según el tipo de movimiento
  const renderTituloMovimiento = () => {
    if (!tipoMov) return "Agregar Novedad de Inventario";

    const tipoNombre = getTipoMovimientoNombre(tipoMov);
    return `Registrar ${tipoNombre}`;
  };

  // Renderizar icono según el tipo de movimiento
  const renderIconoMovimiento = () => {
    switch (tipoMov) {
      case "3": // Venta
      case "6": // Devolución cliente
        return <UserOutlined style={{ marginRight: "12px" }} />;
      case "5": // Traslado
        return <SwapOutlined style={{ marginRight: "12px" }} />;
      case "7": // Compra
      case "9": // Devolución proveedor
        return <TeamOutlined style={{ marginRight: "12px" }} />;
      default:
        return <TagOutlined style={{ marginRight: "12px" }} />;
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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
              {renderIconoMovimiento()}
              {renderTituloMovimiento()}
            </Title>
            <Text type="secondary">
              Complete el formulario para registrar un movimiento en el
              inventario
            </Text>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <TagOutlined style={{ color: colors.primary }} />
                      Tipo de Movimiento
                    </Space>
                  }
                  name="tipoMov"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione un tipo de movimiento",
                    },
                  ]}
                  initialValue={tipoMov}
                >
                  <Select
                    placeholder="Seleccione tipo de movimiento"
                    onChange={handleTipoMovChange}
                    disabled={submitting}
                  >
                    {tiposMovimiento.map((tipo) => (
                      <Option
                        key={tipo.id_tipomov}
                        value={tipo.id_tipomov.toString()}
                      >
                        {tipo.nom_tipomov}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <ShopOutlined style={{ color: colors.primary }} />
                      Sede Origen
                    </Space>
                  }
                  name="sede"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione una sede",
                    },
                  ]}
                  initialValue={sede}
                >
                  <Select
                    placeholder="Seleccione sede origen"
                    onChange={handleSedeChange}
                    disabled={submitting}
                  >
                    {sedes.map((s) => (
                      <Option key={s.id_sede} value={s.id_sede.toString()}>
                        {s.nombre_sede}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {tipoMov === "5" && (
              <Form.Item
                label={
                  <Space>
                    <ArrowRightOutlined style={{ color: colors.primary }} />
                    Sede Destino
                  </Space>
                }
                name="sedeDestino"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione una sede destino",
                  },
                ]}
                initialValue={sedeDestino}
              >
                <Select
                  placeholder="Seleccione sede destino"
                  onChange={(value) => setSedeDestino(value)}
                  disabled={submitting}
                >
                  {sedes
                    .filter((s) => s.id_sede.toString() !== sede) // Filtrar la sede origen
                    .map((s) => (
                      <Option key={s.id_sede} value={s.id_sede.toString()}>
                        {s.nombre_sede}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            )}

            {/* Cliente */}
            {(tipoMov === "3" || tipoMov === "6") && (
              <Form.Item
                label={
                  <Space>
                    <UserOutlined style={{ color: colors.primary }} />
                    Cliente
                  </Space>
                }
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione un cliente",
                  },
                ]}
              >
                <Input.Group compact>
                  <Input
                    style={{ width: "calc(100% - 120px)" }}
                    placeholder="Seleccione un cliente"
                    value={
                      clienteSeleccionado
                        ? `${clienteSeleccionado.id_cliente} - ${clienteSeleccionado.nombre} (${clienteSeleccionado.tipo})`
                        : ""
                    }
                    readOnly
                  />
                  <Button
                    type="primary"
                    onClick={() => setShowClienteModal(true)}
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
            )}

            {/* Proveedor */}
            {(tipoMov === "7" || tipoMov === "9") && (
              <Form.Item
                label={
                  <Space>
                    <TeamOutlined style={{ color: colors.primary }} />
                    Proveedor
                  </Space>
                }
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione un proveedor",
                  },
                ]}
              >
                <Input.Group compact>
                  <Input
                    style={{ width: "calc(100% - 120px)" }}
                    placeholder="Seleccione un proveedor"
                    value={
                      proveedorSeleccionado
                        ? `${proveedorSeleccionado.id_proveedor} - ${proveedorSeleccionado.nombre_proveedor}`
                        : ""
                    }
                    readOnly
                  />
                  <Button
                    type="primary"
                    onClick={() => setShowProveedorModal(true)}
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
            )}

            {/* Producto */}
            <Form.Item
              label={
                <Space>
                  <ShoppingOutlined style={{ color: colors.primary }} />
                  Producto
                </Space>
              }
              rules={[
                { required: true, message: "Por favor seleccione un producto" },
              ]}
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
                  disabled={!sede || submitting}
                >
                  Seleccionar
                </Button>
              </Input.Group>
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <NumberOutlined style={{ color: colors.primary }} />
                      Cantidad
                    </Space>
                  }
                  name="cantidad"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese la cantidad",
                    },
                  ]}
                  initialValue={cantidad}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={1}
                    onChange={(value) => setCantidad(value)}
                    disabled={submitting}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <CalendarOutlined style={{ color: colors.primary }} />
                      Fecha de Movimiento
                    </Space>
                  }
                  name="fecha"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione una fecha",
                    },
                  ]}
                  initialValue={fecha}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    onChange={(value) => setFecha(value)}
                    disabled={submitting}
                  />
                </Form.Item>
              </Col>
            </Row>

            {mostrarCamposStock && (
              <>
                <Alert
                  message="Configuración de Stock"
                  description="El producto no existe en la sede destino. Por favor, configure los niveles de stock mínimo y máximo."
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined style={{ color: colors.accent }} />}
                  style={{ marginBottom: "16px" }}
                />

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={
                        <Space>
                          <ArrowLeftOutlined
                            style={{ color: colors.warning }}
                          />
                          Stock Mínimo
                        </Space>
                      }
                      name="stockMinimo"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese el stock mínimo",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        onChange={(value) => setStockMinimo(value)}
                        disabled={submitting}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={
                        <Space>
                          <ArrowRightOutlined
                            style={{ color: colors.success }}
                          />
                          Stock Máximo
                        </Space>
                      }
                      name="stockMaximo"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese el stock máximo",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        onChange={(value) => setStockMaximo(value)}
                        disabled={submitting}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Divider
              style={{ margin: "12px 0 24px", borderColor: colors.light }}
            />

            <div
              style={{ display: "flex", justifyContent: "center", gap: "16px" }}
            >
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={submitting}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  minWidth: "180px",
                }}
              >
                Guardar Novedad
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
          </Form>
        </Card>

        {/* Modales para selección */}
        <SeleccionarProducto
          show={showProductoModal}
          handleClose={() => setShowProductoModal(false)}
          setProducto={setProducto}
          idSede={sede}
        />

        <SeleccionarCliente
          show={showClienteModal}
          handleClose={() => setShowClienteModal(false)}
          setCliente={setClienteSeleccionado}
        />

        <SeleccionarProveedor
          show={showProveedorModal}
          handleClose={() => setShowProveedorModal(false)}
          setProveedor={setProveedorSeleccionado}
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

export default AnadirNovedad;
