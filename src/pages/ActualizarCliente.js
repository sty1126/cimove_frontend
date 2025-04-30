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

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener datos del cliente
        const clienteRes = await fetch(
          `https://cimove-backend.onrender.com/api/clientes/${id}`
        );
        const clienteData = await clienteRes.json();

        // Manejar si viene como array o como objeto
        const clienteInfo =
          Array.isArray(clienteData) && clienteData.length > 0
            ? clienteData[0]
            : clienteData;
        setCliente(clienteInfo);

        // Formatear fecha si existe
        if (clienteInfo.fechanacimiento_cliente) {
          clienteInfo.fechanacimiento_cliente = dayjs(
            clienteInfo.fechanacimiento_cliente.split("T")[0]
          );
        }

        // Establecer valores en el formulario
        form.setFieldsValue(clienteInfo);

        // Obtener sedes
        const sedesRes = await fetch(
          "https://cimove-backend.onrender.com/api/sedes"
        );
        const sedesData = await sedesRes.json();
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

  // Enviar formulario
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Formatear fecha si existe
      if (values.fechanacimiento_cliente) {
        values.fechanacimiento_cliente =
          values.fechanacimiento_cliente.format("YYYY-MM-DD");
      }

      const response = await fetch(
        `https://cimove-backend.onrender.com/api/clientes/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el cliente");
      }

      setShowModal(true);

      // Cerrar modal y redirigir después de 2 segundos
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
                      ]}
                    >
                      <Input
                        placeholder="Ingrese nombre"
                        disabled={submitting}
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
                      ]}
                    >
                      <Input
                        placeholder="Ingrese apellido"
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
                          Fecha de Nacimiento
                        </Space>
                      }
                      name="fechanacimiento_cliente"
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        placeholder="Seleccione fecha"
                        disabled={submitting}
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
                      ]}
                    >
                      <Input
                        placeholder="Ingrese razón social"
                        disabled={submitting}
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
                    >
                      <Input
                        placeholder="Ingrese nombre comercial"
                        disabled={submitting}
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
                >
                  <Input
                    placeholder="Ingrese representante legal"
                    disabled={submitting}
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
                  ]}
                >
                  <Input placeholder="Ingrese teléfono" disabled={submitting} />
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
                      type: "email",
                      message: "Por favor ingrese un correo electrónico válido",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese correo electrónico"
                    disabled={submitting}
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
            >
              <Input placeholder="Ingrese dirección" disabled={submitting} />
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
                >
                  <Input placeholder="Ingrese barrio" disabled={submitting} />
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
                >
                  <Input
                    placeholder="Ingrese código postal"
                    disabled={submitting}
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
