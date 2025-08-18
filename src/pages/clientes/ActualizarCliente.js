"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Importar funciones del servicio de cliente
import {
  obtenerClientePorId,
  actualizarCliente,
  obtenerSedes,
} from "../../services/clienteService";

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
  Space,
  message,
  Modal,
  Spin,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  TagOutlined,
  SaveOutlined,
  CloseOutlined,
  CalendarOutlined,
  BankOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  NumberOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

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

// Patrones de validación
const validationPatterns = {
  // Solo letras y espacios (incluyendo acentos y ñ)
  nombreApellido: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/,
  // Solo números
  telefono: /^[0-9]{7,15}$/,
  // Correo electrónico
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Dirección (letras, números, #, -, espacios)
  direccion: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s#\-.,]{1,150}$/,
  // Barrio (letras, espacios, números, guiones)
  barrio: /^[\w\sáéíóúÁÉÍÓÚñÑ-]{1,50}$/,
  // Código postal (solo números)
  codigoPostal: /^[0-9]{4,10}$/,
};

// Función para escapar HTML para prevenir XSS
const escapeHtml = (unsafe) => {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const ActualizarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [cliente, setCliente] = useState({});
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const tipoCliente = Number(cliente.id_tipocliente_cliente);
  const esPersonaNatural = tipoCliente === 1;

  // Hook principal del componente para lógica de actualización del cliente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const clienteData = await obtenerClientePorId(id);
        const clienteInfo =
          Array.isArray(clienteData) && clienteData.length > 0
            ? clienteData[0]
            : clienteData;
        setCliente(clienteInfo);

        if (clienteInfo.fechanacimiento_cliente) {
          clienteInfo.fechanacimiento_cliente = dayjs(
            clienteInfo.fechanacimiento_cliente.split("T")[0]
          );
        }

        form.setFieldsValue(clienteInfo);

        const sedesData = await obtenerSedes();
        setSedes(sedesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        message.error("Error al cargar los datos del cliente");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  // Validación personalizada para la fecha de nacimiento
  const validateBirthDate = (_, value) => {
    if (!value) return Promise.resolve();
    const birthDate = value.toDate();
    const today = new Date();

    if (birthDate > today)
      return Promise.reject("La fecha de nacimiento no puede ser futura");

    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const adjustedAge =
      m < 0 || (m === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    if (adjustedAge < 12)
      return Promise.reject("La edad debe ser mayor a 12 años");
    if (adjustedAge > 150)
      return Promise.reject("La fecha de nacimiento no es válida");

    return Promise.resolve();
  };

  // Función para enviar el formulario con los datos actualizados
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Formatear y sanitizar datos
      if (values.fechanacimiento_cliente) {
        values.fechanacimiento_cliente =
          values.fechanacimiento_cliente.format("YYYY-MM-DD");
      }
      values.nombre_cliente = escapeHtml(values.nombre_cliente || "");
      values.apellido_cliente = escapeHtml(values.apellido_cliente || "");
      values.email_cliente = escapeHtml(values.email_cliente || "");
      values.direccion_cliente = escapeHtml(values.direccion_cliente || "");
      values.barrio_cliente = escapeHtml(values.barrio_cliente || "");
      values.razonsocial_cliente = escapeHtml(values.razonsocial_cliente || "");
      values.nombrecomercial_cliente = escapeHtml(
        values.nombrecomercial_cliente || ""
      );
      values.representante_cliente = escapeHtml(
        values.representante_cliente || ""
      );

      await actualizarCliente(id, values);

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/clientes");
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      message.error("Error al actualizar el cliente");
    } finally {
      setSubmitting(false);
    }
  };

  // Indicador de carga
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
        <Spin size="large" tip="Cargando datos del cliente..." />
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
          onClick={() => navigate("/clientes")}
          style={{ marginBottom: "16px" }}
        >
          Volver a clientes
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
              {esPersonaNatural ? (
                <UserOutlined style={{ marginRight: "12px" }} />
              ) : (
                <BankOutlined style={{ marginRight: "12px" }} />
              )}
              Actualizar Cliente
            </Title>
            <Text type="secondary">
              Modifique los datos del cliente y guarde los cambios
            </Text>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={cliente}
          >
            {/* Campo de tipo de cliente (solo lectura) */}
            <Form.Item
              label={
                <Space>
                  <TagOutlined style={{ color: colors.primary }} />
                  Tipo de Cliente
                </Space>
              }
              name="id_tipocliente_cliente"
            >
              <Select disabled>
                <Option value={1}>Persona Natural</Option>
                <Option value={2}>Persona Jurídica</Option>
              </Select>
            </Form.Item>

            {esPersonaNatural ? (
              // Campos para persona natural
              <>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={
                        <Space>
                          <UserOutlined style={{ color: colors.primary }} />
                          Nombre
                        </Space>
                      }
                      name="nombre_cliente"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese el nombre",
                        },
                        {
                          pattern: validationPatterns.nombreApellido,
                          message:
                            "El nombre solo debe contener letras y espacios",
                        },
                        {
                          max: 50,
                          message:
                            "El nombre no puede exceder los 50 caracteres",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Ingrese nombre"
                        disabled={submitting}
                        maxLength={50}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={
                        <Space>
                          <UserOutlined style={{ color: colors.primary }} />
                          Apellido
                        </Space>
                      }
                      name="apellido_cliente"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese el apellido",
                        },
                        {
                          pattern: validationPatterns.nombreApellido,
                          message:
                            "El apellido solo debe contener letras y espacios",
                        },
                        {
                          max: 50,
                          message:
                            "El apellido no puede exceder los 50 caracteres",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Ingrese apellido"
                        disabled={submitting}
                        maxLength={50}
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
                          Fecha de Nacimiento
                        </Space>
                      }
                      name="fechanacimiento_cliente"
                      rules={[
                        {
                          validator: validateBirthDate,
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        placeholder="Seleccione fecha"
                        disabled={submitting}
                        disabledDate={(current) =>
                          current && current > dayjs().endOf("day")
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={
                        <Space>
                          <UserOutlined style={{ color: colors.primary }} />
                          Género
                        </Space>
                      }
                      name="genero_cliente"
                      rules={[
                        {
                          required: true,
                          message: "Por favor seleccione un género",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Seleccione género"
                        disabled={submitting}
                      >
                        <Option value="Masculino">Masculino</Option>
                        <Option value="Femenino">Femenino</Option>
                        <Option value="Otro">Otro</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : (
              // Campos para persona jurídica
              <>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={
                        <Space>
                          <BankOutlined style={{ color: colors.primary }} />
                          Razón Social
                        </Space>
                      }
                      name="razonsocial_cliente"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese la razón social",
                        },
                        {
                          max: 100,
                          message:
                            "La razón social no puede exceder los 100 caracteres",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Ingrese razón social"
                        disabled={submitting}
                        maxLength={100}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={
                        <Space>
                          <ShopOutlined style={{ color: colors.primary }} />
                          Nombre Comercial
                        </Space>
                      }
                      name="nombrecomercial_cliente"
                      rules={[
                        {
                          max: 100,
                          message:
                            "El nombre comercial no puede exceder los 100 caracteres",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Ingrese nombre comercial"
                        disabled={submitting}
                        maxLength={100}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={
                    <Space>
                      <UserOutlined style={{ color: colors.primary }} />
                      Representante Legal
                    </Space>
                  }
                  name="representante_cliente"
                  rules={[
                    {
                      pattern: validationPatterns.nombreApellido,
                      message:
                        "El nombre del representante solo debe contener letras y espacios",
                    },
                    {
                      max: 50,
                      message:
                        "El nombre del representante no puede exceder los 50 caracteres",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese representante legal"
                    disabled={submitting}
                    maxLength={50}
                  />
                </Form.Item>
              </>
            )}

            {/* Campos comunes para ambos tipos de cliente */}
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <PhoneOutlined style={{ color: colors.primary }} />
                      Teléfono
                    </Space>
                  }
                  name="telefono_cliente"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el teléfono",
                    },
                    {
                      pattern: validationPatterns.telefono,
                      message:
                        "El teléfono debe contener solo números (7-15 dígitos)",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese teléfono"
                    disabled={submitting}
                    maxLength={15}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <MailOutlined style={{ color: colors.primary }} />
                      Correo Electrónico
                    </Space>
                  }
                  name="email_cliente"
                  rules={[
                    {
                      pattern: validationPatterns.email,
                      message: "Por favor ingrese un correo electrónico válido",
                    },
                    {
                      max: 254,
                      message: "El correo no puede exceder los 254 caracteres",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese correo electrónico"
                    disabled={submitting}
                    maxLength={254}
                  />
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
              name="direccion_cliente"
              rules={[
                {
                  pattern: validationPatterns.direccion,
                  message: "La dirección contiene caracteres no permitidos",
                },
                {
                  max: 150,
                  message: "La dirección no puede exceder los 150 caracteres",
                },
              ]}
            >
              <Input
                placeholder="Ingrese dirección"
                disabled={submitting}
                maxLength={150}
              />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <EnvironmentOutlined style={{ color: colors.primary }} />
                      Barrio
                    </Space>
                  }
                  name="barrio_cliente"
                  rules={[
                    {
                      pattern: validationPatterns.barrio,
                      message: "El barrio contiene caracteres no permitidos",
                    },
                    {
                      max: 50,
                      message: "El barrio no puede exceder los 50 caracteres",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese barrio"
                    disabled={submitting}
                    maxLength={50}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <NumberOutlined style={{ color: colors.primary }} />
                      Código Postal
                    </Space>
                  }
                  name="codigopostal_cliente"
                  rules={[
                    {
                      pattern: validationPatterns.codigoPostal,
                      message:
                        "El código postal debe contener solo números (4-10 dígitos)",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese código postal"
                    disabled={submitting}
                    maxLength={10}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <Space>
                  <GlobalOutlined style={{ color: colors.primary }} />
                  Sede
                </Space>
              }
              name="id_sede_cliente"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione una sede",
                },
              ]}
            >
              <Select placeholder="Seleccione una sede" disabled={submitting}>
                {sedes.map((sede) => (
                  <Option key={sede.id_sede} value={sede.id_sede}>
                    {sede.nombre_sede}
                  </Option>
                ))}
              </Select>
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
                  minWidth: "180px",
                }}
              >
                Guardar Cambios
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="large"
                onClick={() => navigate("/clientes")}
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
              <span>Cliente Actualizado</span>
            </div>
          }
          open={showModal}
          footer={null}
          closable={false}
          centered
          maskClosable={false}
        >
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              El cliente se ha actualizado correctamente.
            </p>
            <Button
              type="primary"
              style={{
                backgroundColor: colors.success,
                borderColor: colors.success,
              }}
              onClick={() => {
                setShowModal(false);
                navigate("/clientes");
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

export default ActualizarCliente;
