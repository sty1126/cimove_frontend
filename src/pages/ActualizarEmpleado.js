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
  Spin,
  Modal,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  SaveOutlined,
  CloseOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  IdcardOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

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

const ActualizarEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del empleado y opciones para los selects
        const [empleadoRes, tiposRes, sedesRes] = await Promise.all([
          fetch(`https://cimove-backend.onrender.com/api/empleados/${id}`).then(
            (res) => res.json()
          ),
          fetch("https://cimove-backend.onrender.com/api/tipousuario").then(
            (res) => res.json()
          ),
          fetch("https://cimove-backend.onrender.com/api/sedes").then((res) =>
            res.json()
          ),
        ]);

        // Procesar datos del empleado
        let empleadoData;
        if (Array.isArray(empleadoRes) && empleadoRes.length > 0) {
          empleadoData = empleadoRes[0];
        } else {
          empleadoData = empleadoRes;
        }

        // Establecer valores en el formulario
        form.setFieldsValue(empleadoData);

        // Guardar opciones para los selects
        setTiposUsuario(tiposRes);
        setSedes(sedesRes);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        message.error("Error al cargar los datos del empleado");
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
      const response = await fetch(
        `https://cimove-backend.onrender.com/api/empleados/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el empleado");
      }

      // Mostrar modal de éxito
      setModalVisible(true);

      // Cerrar modal y redirigir después de 2 segundos
      setTimeout(() => {
        setModalVisible(false);
        navigate("/empleados");
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      message.error("Error al actualizar el empleado");
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
        <Spin size="large" tip="Cargando datos del empleado..." />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
      className="px-3 sm:px-6"
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Botón de volver */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/empleados")}
          style={{ marginBottom: "16px" }}
        >
          Volver a empleados
        </Button>

        <Card
          bordered={false}
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          className="p-3 sm:p-6"
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title
              level={2}
              style={{ color: colors.primary, margin: 0 }}
              className="text-xl sm:text-2xl"
            >
              <EditOutlined style={{ marginRight: "12px" }} />
              Actualizar Empleado
            </Title>
            <Text type="secondary">
              Modifique los datos del empleado y guarde los cambios
            </Text>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <UserOutlined style={{ color: colors.primary }} />
                      Nombre del Empleado
                    </Space>
                  }
                  name="nombre_empleado"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el nombre del empleado",
                    },
                    {
                      pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/,
                      message: "Solo se permiten letras, espacios y acentos",
                    },
                    {
                      pattern: /^[^<>{};,:]+$/,
                      message:
                        "No se permiten caracteres especiales como < > ; , { } :",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese nombre completo"
                    disabled={submitting}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <IdcardOutlined style={{ color: colors.primary }} />
                      Cargo
                    </Space>
                  }
                  name="cargo_empleado"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el cargo",
                    },
                    {
                      pattern: /^[^<>{};,:]+$/,
                      message:
                        "No se permiten caracteres especiales como < > ; , { } :",
                    },
                  ]}
                >
                  <Input placeholder="Ingrese cargo" disabled={submitting} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <PhoneOutlined style={{ color: colors.primary }} />
                      Teléfono (Empleado)
                    </Space>
                  }
                  name="telefono_empleado"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el teléfono",
                    },
                    {
                      pattern: /^\d{7,10}$/,
                      message: "El teléfono debe tener entre 7 y 10 dígitos",
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
                      Email (Empleado)
                    </Space>
                  }
                  name="email_empleado"
                  rules={[
                    {
                      type: "email",
                      message: "Por favor ingrese un email válido",
                    },
                    {
                      required: true,
                      message: "Por favor ingrese el email",
                    },
                    {
                      pattern: /^[^<>{};,:]+$/,
                      message:
                        "No se permiten caracteres especiales como < > ; , { } :",
                    },
                  ]}
                >
                  <Input placeholder="Ingrese email" disabled={submitting} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <MailOutlined style={{ color: colors.primary }} />
                      Email (Usuario)
                    </Space>
                  }
                  name="email_usuario"
                  rules={[
                    {
                      type: "email",
                      message: "Por favor ingrese un email válido",
                    },
                    {
                      required: true,
                      message: "Por favor ingrese el email de usuario",
                    },
                    {
                      pattern: /^[^<>{};,:]+$/,
                      message:
                        "No se permiten caracteres especiales como < > ; , { } :",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese email de usuario"
                    disabled={submitting}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <PhoneOutlined style={{ color: colors.primary }} />
                      Teléfono (Usuario)
                    </Space>
                  }
                  name="telefono_usuario"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el teléfono de usuario",
                    },
                    {
                      pattern: /^\d{7,10}$/,
                      message: "El teléfono debe tener entre 7 y 10 dígitos",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese teléfono de usuario"
                    disabled={submitting}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <TeamOutlined style={{ color: colors.primary }} />
                      Rol
                    </Space>
                  }
                  name="id_tipousuario_usuario"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione un rol",
                    },
                  ]}
                >
                  <Select placeholder="Seleccione un rol" disabled={submitting}>
                    {tiposUsuario.map((rol) => (
                      <Option
                        key={rol.id_tipousuario}
                        value={rol.id_tipousuario}
                      >
                        {rol.descripcion_tipousuario}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <BankOutlined style={{ color: colors.primary }} />
                      Sede
                    </Space>
                  }
                  name="id_sede_empleado"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione una sede",
                    },
                  ]}
                >
                  <Select
                    placeholder="Seleccione una sede"
                    disabled={submitting}
                  >
                    {sedes.map((sede) => (
                      <Option key={sede.id_sede} value={sede.id_sede}>
                        {sede.nombre_sede}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <DollarOutlined style={{ color: colors.success }} />
                      Salario
                    </Space>
                  }
                  name="monto_salario"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el salario",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Ingrese salario"
                    min={0}
                    precision={2}
                    prefix="$"
                    disabled={submitting}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <CalendarOutlined style={{ color: colors.primary }} />
                      Tipo de Pago
                    </Space>
                  }
                  name="tipopago_salario"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione un tipo de pago",
                    },
                  ]}
                >
                  <Select
                    placeholder="Seleccione tipo de pago"
                    disabled={submitting}
                  >
                    <Option value="Mensual">Mensual</Option>
                    <Option value="Quincenal">Quincenal</Option>
                    <Option value="Semanal">Semanal</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider
              style={{ margin: "12px 0 24px", borderColor: colors.light }}
            />

            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={submitting}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                }}
                className="w-full"
              >
                Guardar Cambios
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="large"
                onClick={() => navigate("/empleados")}
                disabled={submitting}
                className="w-full"
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
              El empleado se ha actualizado correctamente.
            </p>
            <Button
              type="primary"
              style={{
                backgroundColor: colors.success,
                borderColor: colors.success,
              }}
              onClick={() => {
                setModalVisible(false);
                navigate("/empleados");
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

export default ActualizarEmpleado;
