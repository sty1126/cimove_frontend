"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Tooltip,
  Modal,
  Spin,
} from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  PercentageOutlined,
  SaveOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import {
  obtenerProductoPorId,
  actualizarProducto,
  obtenerCategorias,
} from "../../services/productosService";

const { Title, Text } = Typography;
const { TextArea } = Input;
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

// Validaciones para campos numéricos
const validations = {
  precioVenta: {
    min: 100,
    max: 50000000,
    message: {
      min: "El precio de venta no puede ser menor a $100",
      max: "El precio de venta no puede superar $50.000.000",
      lessThanCost: "El precio de venta no puede ser menor al costo de venta",
    },
  },
  costoVenta: {
    min: 0.01,
    max: 50000000,
    message: {
      min: "El costo de venta debe ser mayor a $0",
      max: "El costo de venta no puede superar $50.000.000",
    },
  },
  iva: {
    min: 0,
    max: 100,
    message: {
      min: "El IVA no puede ser negativo",
      max: "El IVA no puede ser mayor a 100%",
    },
  },
};

const ActualizarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [margenUtilidad, setMargenUtilidad] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [producto, setProducto] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productoData = await obtenerProductoPorId(id);

        setProducto(productoData);

        if (
          productoData.precioventaact_producto &&
          productoData.costoventa_producto
        ) {
          const margen =
            productoData.precioventaact_producto -
            productoData.costoventa_producto;
          setMargenUtilidad(margen);
        }

        if (productoData.valoriva_producto) {
          productoData.valoriva_producto = productoData.valoriva_producto * 100;
        }

        form.setFieldsValue(productoData);

        const categorias = await obtenerCategorias();
        setCategorias(categorias);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        message.error("Error al cargar los datos del producto");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  // Calcular margen de utilidad cuando cambian precio o costo
  const calcularMargen = (precioVenta, costoVenta) => {
    if (precioVenta && costoVenta) {
      const margen = precioVenta - costoVenta;
      setMargenUtilidad(margen);
      return margen;
    }
    setMargenUtilidad(0);
    return 0;
  };

  // Manejar cambios en precio o costo
  const handlePrecioChange = (value) => {
    const costoVenta = form.getFieldValue("costoventa_producto") || 0;

    // Validar que el precio no sea menor al costo
    if (value < costoVenta) {
      message.warning(validations.precioVenta.message.lessThanCost);
    }

    calcularMargen(value || 0, costoVenta);
  };

  const handleCostoChange = (value) => {
    const precioVenta = form.getFieldValue("precioventaact_producto") || 0;

    // Validar que el costo no sea mayor al precio
    if (value > precioVenta && precioVenta > 0) {
      message.warning(validations.precioVenta.message.lessThanCost);
    }

    calcularMargen(precioVenta, value || 0);
  };

  // Validar precio de venta
  const validarPrecioVenta = (_, value) => {
    if (value === undefined || value === null) {
      return Promise.reject(new Error("El precio de venta es requerido"));
    }

    if (typeof value !== "number") {
      return Promise.reject(new Error("El precio de venta debe ser un número"));
    }

    if (value < validations.precioVenta.min) {
      return Promise.reject(new Error(validations.precioVenta.message.min));
    }

    if (value > validations.precioVenta.max) {
      return Promise.reject(new Error(validations.precioVenta.message.max));
    }

    const costoVenta = form.getFieldValue("costoventa_producto");
    if (costoVenta && value < costoVenta) {
      return Promise.reject(
        new Error(validations.precioVenta.message.lessThanCost)
      );
    }

    return Promise.resolve();
  };

  // Validar costo de venta
  const validarCostoVenta = (_, value) => {
    if (value === undefined || value === null) {
      return Promise.reject(new Error("El costo de venta es requerido"));
    }

    if (typeof value !== "number") {
      return Promise.reject(new Error("El costo de venta debe ser un número"));
    }

    if (value < validations.costoVenta.min) {
      return Promise.reject(new Error(validations.costoVenta.message.min));
    }

    if (value > validations.costoVenta.max) {
      return Promise.reject(new Error(validations.costoVenta.message.max));
    }

    return Promise.resolve();
  };

  // Validar IVA
  const validarIVA = (_, value) => {
    if (value === undefined || value === null) {
      return Promise.reject(new Error("El IVA es requerido"));
    }

    if (typeof value !== "number") {
      return Promise.reject(new Error("El IVA debe ser un número"));
    }

    if (value < validations.iva.min) {
      return Promise.reject(new Error(validations.iva.message.min));
    }

    if (value > validations.iva.max) {
      return Promise.reject(new Error(validations.iva.message.max));
    }

    return Promise.resolve();
  };

  // Enviar formulario
  const handleSubmit = async (values) => {
    if (values.precioventaact_producto < values.costoventa_producto) {
      message.error(validations.precioVenta.message.lessThanCost);
      return;
    }

    setSubmitting(true);
    try {
      values.valoriva_producto = values.valoriva_producto / 100;

      await actualizarProducto(id, values);

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigate("/inventario");
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      message.error("Error al actualizar el producto");
    } finally {
      setSubmitting(false);
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
        <Spin size="large" tip="Cargando datos del producto..." />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: isMobile ? "12px" : "24px",
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
            <Title
              level={2}
              style={{
                color: colors.primary,
                margin: 0,
                fontSize: isMobile ? "20px" : "24px",
              }}
            >
              <ShoppingOutlined style={{ marginRight: "12px" }} />
              Actualizar Producto
            </Title>
            <Text type="secondary">
              Modifique los datos del producto y guarde los cambios
            </Text>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <ShoppingOutlined style={{ color: colors.primary }} />
                      Nombre del Producto
                    </Space>
                  }
                  name="nombre_producto"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el nombre del producto",
                    },
                    {
                      max: 35,
                      message: "El nombre no puede exceder los 35 caracteres",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese el nombre del producto"
                    disabled={submitting}
                    maxLength={35}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <AppstoreOutlined style={{ color: colors.primary }} />
                      Categoría
                    </Space>
                  }
                  name="id_categoria_producto"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione una categoría",
                    },
                  ]}
                >
                  <Select
                    placeholder="Seleccione una categoría"
                    disabled={submitting}
                  >
                    {categorias.map((categoria) => (
                      <Option
                        key={categoria.id_categoria}
                        value={categoria.id_categoria}
                      >
                        {categoria.descripcion_categoria}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <Space>
                  <FileTextOutlined style={{ color: colors.primary }} />
                  Descripción
                </Space>
              }
              name="descripcion_producto"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una descripción",
                },
              ]}
            >
              <TextArea
                placeholder="Ingrese una descripción detallada del producto"
                autoSize={{ minRows: 3, maxRows: 5 }}
                disabled={submitting}
              />
            </Form.Item>

            <Row gutter={[16, 8]}>
              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <DollarOutlined style={{ color: colors.success }} />
                      Precio de Venta
                    </Space>
                  }
                  name="precioventaact_producto"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el precio de venta",
                    },
                    {
                      validator: validarPrecioVenta,
                    },
                  ]}
                  tooltip="Debe ser mayor a $100 y no puede superar $50.000.000. Debe ser mayor al costo de venta."
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Precio de venta"
                    min={validations.precioVenta.min}
                    max={validations.precioVenta.max}
                    precision={2}
                    prefix="$"
                    onChange={handlePrecioChange}
                    disabled={submitting}
                    inputMode="decimal"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <DollarOutlined style={{ color: colors.warning }} />
                      Costo de Venta
                    </Space>
                  }
                  name="costoventa_producto"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el costo de venta",
                    },
                    {
                      validator: validarCostoVenta,
                    },
                  ]}
                  tooltip="Debe ser mayor a $0 y no puede superar $50.000.000"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Costo de venta"
                    min={validations.costoVenta.min}
                    max={validations.costoVenta.max}
                    precision={2}
                    prefix="$"
                    onChange={handleCostoChange}
                    disabled={submitting}
                    inputMode="decimal"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <CalculatorOutlined style={{ color: colors.accent }} />
                      Margen de Utilidad
                      <Tooltip title="Este valor se calcula automáticamente como la diferencia entre el precio de venta y el costo">
                        <InfoCircleOutlined style={{ color: colors.accent }} />
                      </Tooltip>
                    </Space>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    disabled
                    prefix="$"
                    value={margenUtilidad}
                    precision={2}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <Space>
                  <PercentageOutlined style={{ color: colors.primary }} />
                  IVA (%)
                </Space>
              }
              name="valoriva_producto"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el valor del IVA",
                },
                {
                  validator: validarIVA,
                },
              ]}
              tooltip="Debe estar entre 0% y 100%"
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Ingrese el porcentaje de IVA"
                min={validations.iva.min}
                max={validations.iva.max}
                precision={0}
                suffix="%"
                disabled={submitting}
                inputMode="numeric"
              />
            </Form.Item>

            <Divider
              style={{ margin: "12px 0 24px", borderColor: colors.light }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "center",
                gap: "16px",
              }}
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
                  minWidth: isMobile ? "100%" : "150px",
                  marginBottom: isMobile ? "10px" : "0",
                }}
              >
                Guardar Cambios
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="large"
                onClick={() => navigate("/inventario")}
                style={{
                  minWidth: isMobile ? "100%" : "120px",
                }}
                disabled={submitting}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card>

        {/* Modal de éxito */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <CheckCircleOutlined
                style={{
                  color: colors.success,
                  fontSize: "22px",
                  marginRight: "10px",
                }}
              />
              <span>Actualización Exitosa</span>
            </div>
          }
          open={modalVisible}
          footer={null}
          closable={false}
          centered
          maskClosable={false}
        >
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              El producto se ha actualizado correctamente.
            </p>
            <Button
              type="primary"
              style={{
                backgroundColor: colors.success,
                borderColor: colors.success,
              }}
              onClick={() => {
                setModalVisible(false);
                navigate("/inventario");
              }}
            >
              Aceptar
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ActualizarProducto;
