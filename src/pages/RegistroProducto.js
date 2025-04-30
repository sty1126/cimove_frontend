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
  Tooltip,
} from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  PercentageOutlined,
  SaveOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  CalculatorOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";

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

const RegistrarProducto = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [margenUtilidad, setMargenUtilidad] = useState(0);

  // Cargar categorías al iniciar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get("https://cimove-backend.onrender.com/api/categorias");
        setCategorias(res.data);
      } catch (error) {
        console.error("Error al obtener categorías", error);
        message.error("No se pudieron cargar las categorías");
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  // Calcular margen de utilidad cuando cambian precio o costo
  const calcularMargen = (precioVenta, costoVenta) => {
    if (precioVenta && costoVenta) {
      const margen = precioVenta - costoVenta;
      setMargenUtilidad(margen);
      form.setFieldValue("margenutilidad_producto", margen);
      return margen;
    }
    setMargenUtilidad(0);
    return 0;
  };

  // Manejar cambios en precio o costo
  const handlePrecioChange = (value) => {
    const costoVenta = form.getFieldValue("costoventa_producto") || 0;
    calcularMargen(value || 0, costoVenta);
  };

  const handleCostoChange = (value) => {
    const precioVenta = form.getFieldValue("precioventaact_producto") || 0;
    calcularMargen(precioVenta, value || 0);
  };

  // Enviar formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://cimove-backend.onrender.com/api/productos",
        values
      );
      const idProducto = response.data.id_producto;

      message.success({
        content: "Producto registrado exitosamente",
        icon: <CheckCircleIcon />,
        style: {
          marginTop: "20px",
        },
      });

      // Redirigir a la pantalla de asociar proveedores
      setTimeout(() => {
        navigate(`/asociar-proveedores/${idProducto}`);
      }, 1500);
    } catch (error) {
      console.error("Error al registrar producto", error);
      message.error({
        content: "Error al registrar el producto",
        style: {
          marginTop: "20px",
        },
      });
    } finally {
      setLoading(false);
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
              <ShoppingOutlined style={{ marginRight: "12px" }} />
              Registrar Nuevo Producto
            </Title>
            <Text type="secondary">
              Complete el formulario para registrar un nuevo producto en el
              inventario
            </Text>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              id_producto: "",
              nombre_producto: "",
              descripcion_producto: "",
              id_categoria_producto: "",
              precioventaact_producto: "",
              costoventa_producto: "",
              margenutilidad_producto: "",
              valoriva_producto: "",
            }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <BarcodeIcon />
                      ID Producto
                    </Space>
                  }
                  name="id_producto"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el ID del producto",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Ingrese el ID del producto"
                    maxLength={13}
                    min={1}
                    precision={0}
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
                    loading={loadingCategorias}
                  >
                    {categorias.map((cat) => (
                      <Option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.descripcion_categoria}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

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
              ]}
            >
              <Input placeholder="Ingrese el nombre del producto" maxLength={35}/>
            </Form.Item>

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
              />
            </Form.Item>

            <Row gutter={24}>
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
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Precio de venta"
                    min={0}
                    precision={2}
                    prefix="$"
                    onChange={handlePrecioChange}
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
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Costo de venta"
                    min={0}
                    precision={2}
                    prefix="$"
                    onChange={handleCostoChange}
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
                  name="margenutilidad_producto"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    disabled
                    prefix="$"
                    value={margenUtilidad}
                    precision={2}
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
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Ingrese el porcentaje de IVA"
                min={0}
                max={100}
                precision={2}
                suffix="%"
              />
            </Form.Item>

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
                loading={loading}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  minWidth: "150px",
                }}
              >
                Registrar Producto
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="large"
                onClick={() => navigate("/inventario")}
                style={{ minWidth: "120px" }}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

// Componentes de iconos personalizados
const BarcodeIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: colors.primary }}
  >
    <path
      d="M2 6H4V18H2V6ZM5 6H6V18H5V6ZM7 6H10V18H7V6ZM11 6H12V18H11V6ZM14 6H16V18H14V6ZM17 6H20V18H17V6ZM21 6H22V18H21V6Z"
      fill="currentColor"
    />
  </svg>
);

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

export default RegistrarProducto;
