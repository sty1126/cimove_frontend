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
  Tooltip,
  Spin,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  TagOutlined,
  IdcardOutlined,
  SaveOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  NumberOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

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

const RegistroProveedor = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tiposProveedor, setTiposProveedor] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [loadingCiudades, setLoadingCiudades] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [digitoVerificacion, setDigitoVerificacion] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener tipos de proveedor
        const tiposResponse = await axios.get(
          "http://localhost:4000/api/proveedores/tipos"
        );
        setTiposProveedor(tiposResponse.data);
        setLoadingTipos(false);

        // Obtener ciudades
        const ciudadesResponse = await axios.get(
          "http://localhost:4000/api/ciudades/ciudades"
        );
        setCiudades(ciudadesResponse.data);
        setLoadingCiudades(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        message.error("Error al cargar datos iniciales");
        setLoadingTipos(false);
        setLoadingCiudades(false);
      }
    };

    fetchData();
  }, []);

  // Manejar cambio en el ID/NIT para calcular dígito de verificación
  const handleIdChange = (e) => {
    const value = e.target.value;
    if (value && value.length > 0) {
      const ultimoDigito = value.slice(-1);
      setDigitoVerificacion(ultimoDigito);
      form.setFieldsValue({ digitoverificacion_proveedor: ultimoDigito });
    } else {
      setDigitoVerificacion("");
      form.setFieldsValue({ digitoverificacion_proveedor: "" });
    }
  };

  // Enviar formulario
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Formatear fecha
      if (values.fecharegistro_proveedor) {
        values.fecharegistro_proveedor =
          values.fecharegistro_proveedor.format("YYYY-MM-DD");
      }

      await axios.post("http://localhost:4000/api/proveedores", values);
      message.success({
        content: "Proveedor registrado exitosamente",
        icon: <CheckCircleIcon />,
        style: {
          marginTop: "20px",
        },
      });

      // Redirigir a la lista de proveedores
      setTimeout(() => {
        navigate("/proveedores");
      }, 1500);
    } catch (error) {
      console.error(
        "Error al registrar:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message || "Error al registrar proveedor";
      message.error({
        content: errorMessage,
        style: {
          marginTop: "20px",
        },
      });
    } finally {
      setSubmitting(false);
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
          onClick={() => navigate("/proveedores")}
          style={{ marginBottom: "16px" }}
        >
          Volver a proveedores
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
              <TeamOutlined style={{ marginRight: "12px" }} />
              Registrar Nuevo Proveedor
            </Title>
            <Text type="secondary">
              Complete el formulario para registrar un nuevo proveedor en el
              sistema
            </Text>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          {(loadingTipos || loadingCiudades) && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin tip="Cargando datos iniciales..." />
            </div>
          )}

          {!loadingTipos && !loadingCiudades && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                id_proveedor: "",
                nombre_proveedor: "",
                id_ciudad_proveedor: "",
                direccion_proveedor: "",
                telefono_proveedor: "",
                email_proveedor: "",
                id_tipoproveedor_proveedor: "",
                representante_proveedor: "",
                fecharegistro_proveedor: dayjs(),
                saldo_proveedor: "0",
                digitoverificacion_proveedor: "",
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <IdcardOutlined style={{ color: colors.primary }} />
                        ID/NIT Proveedor
                      </Space>
                    }
                    name="id_proveedor"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el ID/NIT del proveedor",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Ingrese ID/NIT"
                      maxLength={9}
                      onChange={handleIdChange}
                      disabled={submitting}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <NumberOutlined style={{ color: colors.primary }} />
                        Dígito de Verificación
                        <Tooltip title="Este valor se calcula automáticamente del último dígito del ID/NIT">
                          <InfoCircleOutlined
                            style={{ color: colors.accent }}
                          />
                        </Tooltip>
                      </Space>
                    }
                    name="digitoverificacion_proveedor"
                  >
                    <Input
                      placeholder="Dígito de verificación"
                      maxLength={1}
                      disabled={true}
                      value={digitoVerificacion}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <UserOutlined style={{ color: colors.primary }} />
                        Nombre Proveedor
                      </Space>
                    }
                    name="nombre_proveedor"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el nombre del proveedor",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Ingrese nombre"
                      maxLength={25}
                      disabled={submitting}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <UserOutlined style={{ color: colors.primary }} />
                        Representante (Opcional)
                      </Space>
                    }
                    name="representante_proveedor"
                  >
                    <Input
                      placeholder="Ingrese representante"
                      maxLength={25}
                      disabled={submitting}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <TagOutlined style={{ color: colors.primary }} />
                        Tipo de Proveedor
                      </Space>
                    }
                    name="id_tipoproveedor_proveedor"
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione un tipo de proveedor",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Seleccione un tipo de proveedor"
                      disabled={submitting}
                    >
                      {tiposProveedor.map((tipo) => (
                        <Option
                          key={tipo.id_tipoproveedor}
                          value={tipo.id_tipoproveedor}
                        >
                          {tipo.nombre_tipoproveedor}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <GlobalOutlined style={{ color: colors.primary }} />
                        Ciudad
                      </Space>
                    }
                    name="id_ciudad_proveedor"
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione una ciudad",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Seleccione una ciudad"
                      disabled={submitting}
                    >
                      {ciudades.map((ciudad) => (
                        <Option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                          {ciudad.nombre_ciudad}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <Space>
                    <HomeOutlined style={{ color: colors.primary }} />
                    Dirección
                  </Space>
                }
                name="direccion_proveedor"
                rules={[
                  { required: true, message: "Por favor ingrese la dirección" },
                ]}
              >
                <Input
                  placeholder="Ingrese dirección"
                  maxLength={30}
                  disabled={submitting}
                />
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <PhoneOutlined style={{ color: colors.primary }} />
                        Teléfono
                      </Space>
                    }
                    name="telefono_proveedor"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el teléfono",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Ingrese teléfono"
                      maxLength={13}
                      disabled={submitting}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <MailOutlined style={{ color: colors.primary }} />
                        Email (Opcional)
                      </Space>
                    }
                    name="email_proveedor"
                    rules={[
                      {
                        type: "email",
                        message: "Por favor ingrese un email válido",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Ingrese email"
                      maxLength={25}
                      disabled={submitting}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <CalendarOutlined style={{ color: colors.primary }} />
                        Fecha de Registro
                      </Space>
                    }
                    name="fecharegistro_proveedor"
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione una fecha",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      disabled={submitting}
                      placeholder="Seleccione fecha"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <DollarOutlined style={{ color: colors.primary }} />
                        Saldo Inicial
                      </Space>
                    }
                    name="saldo_proveedor"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Ingrese saldo inicial"
                      min={0}
                      precision={2}
                      disabled={submitting}
                      prefix="$"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider
                style={{ margin: "12px 0 24px", borderColor: colors.light }}
              />

              <div
                style={{
                  display: "flex",
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
                    minWidth: "180px",
                  }}
                >
                  Registrar Proveedor
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  size="large"
                  onClick={() => navigate("/proveedores")}
                  style={{ minWidth: "120px" }}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          )}
        </Card>
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

export default RegistroProveedor;
