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

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener producto
        const productoRes = await axios.get(
          `http://localhost:4000/api/productos/${id}`
        );
        let productoData;

        if (Array.isArray(productoRes.data) && productoRes.data.length > 0) {
          productoData = productoRes.data[0];
        } else {
          productoData = productoRes.data;
        }

        setProducto(productoData);

        // Calcular margen de utilidad inicial
        if (
          productoData.precioventaact_producto &&
          productoData.costoventa_producto
        ) {
          const margen =
            productoData.precioventaact_producto -
            productoData.costoventa_producto;
          setMargenUtilidad(margen);
        }

        // Formatear IVA para mostrar como porcentaje
        if (productoData.valoriva_producto) {
          productoData.valoriva_producto = productoData.valoriva_producto * 100;
        }

        // Establecer valores iniciales en el formulario
        form.setFieldsValue(productoData);

        // Obtener categorías
        const categoriasRes = await axios.get(
          "http://localhost:4000/api/categorias"
        );
        setCategorias(categoriasRes.data);
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
    calcularMargen(value || 0, costoVenta);
  };

  const handleCostoChange = (value) => {
    const precioVenta = form.getFieldValue("precioventaact_producto") || 0;
    calcularMargen(precioVenta, value || 0);
  };

  // Enviar formulario
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Convertir IVA de porcentaje a decimal
      values.valoriva_producto = values.valoriva_producto / 100;

      // Enviar actualización
      await axios.put(`http://localhost:4000/api/productos/${id}`, values);

      // Mostrar modal de éxito
      setModalVisible(true);

      // Cerrar modal y redirigir después de 2 segundos
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
            <Row gutter={24}>
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
                  ]}
                >
                  <Input
                    placeholder="Ingrese el nombre del producto"
                    disabled={submitting}
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                disabled={submitting}
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
                loading={submitting}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  minWidth: "150px",
                }}
              >
                Guardar Cambios
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
