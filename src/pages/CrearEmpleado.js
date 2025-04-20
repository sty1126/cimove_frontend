"use client";

import { useState, useEffect } from "react";
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
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  SaveOutlined,
  IdcardOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  NumberOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const CrearEmpleado = () => {
  const [form] = Form.useForm();
  const [sedes, setSedes] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setDataLoading(true);
        const [resSedes, resDocs, resUsuarios] = await Promise.all([
          axios.get("http://localhost:4000/api/sedes"),
          axios.get("http://localhost:4000/api/tipodocumento"),
          axios.get("http://localhost:4000/api/tipousuario"),
        ]);
        setSedes(resSedes.data);
        setTiposDocumento(resDocs.data);
        setTiposUsuario(resUsuarios.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
        messageApi.error("Error al cargar datos iniciales");
      } finally {
        setDataLoading(false);
      }
    };
    fetchInfo();
  }, [messageApi]);

  // Enviar formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Preparar datos para enviar
      const data = {
        ...values,
        telefono_usuario: values.telefono_empleado, // Usar el mismo teléfono para usuario
      };

      await axios.post("http://localhost:4000/api/empleados", data);

      messageApi.success("Empleado creado correctamente");

      // Redireccionar después de 1.5 segundos
      setTimeout(() => {
        navigate("/empleados");
      }, 1500);

      // Resetear formulario
      form.resetFields();
    } catch (error) {
      console.error("Error al crear empleado:", error);
      messageApi.error("Error al crear empleado");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
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
      {contextHolder}
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
              Crear Empleado
            </Title>
            <Text type="secondary">
              Complete el formulario para registrar un nuevo empleado
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
              id_empleado: "",
              id_sede_empleado: "",
              id_tipodocumento_empleado: "",
              nombre_empleado: "",
              telefono_empleado: "",
              cargo_empleado: "",
              email_empleado: "",
              email_usuario: "",
              id_tipousuario_usuario: "",
              monto_salario: "",
              tipopago_salario: "",
            }}
          >
            {/* Sección de identificación */}
            <Card
              title={
                <Space>
                  <IdcardOutlined style={{ color: colors.primary }} />
                  <span>Información de Identificación</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <NumberOutlined style={{ color: colors.primary }} />
                        ID Empleado
                      </Space>
                    }
                    name="id_empleado"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el ID del empleado",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese ID del empleado" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <IdcardOutlined style={{ color: colors.primary }} />
                        Tipo de Documento
                      </Space>
                    }
                    name="id_tipodocumento_empleado"
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione el tipo de documento",
                      },
                    ]}
                  >
                    <Select placeholder="Seleccione tipo de documento">
                      {tiposDocumento.map((doc) => (
                        <Option
                          key={doc.id_tipodocumento}
                          value={doc.id_tipodocumento}
                        >
                          {doc.descripcion_tipodocumento}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
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
                    <Select placeholder="Seleccione sede">
                      {sedes.map((sede) => (
                        <Option key={sede.id_sede} value={sede.id_sede}>
                          {sede.nombre_sede}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Sección de información personal */}
            <Card
              title={
                <Space>
                  <UserOutlined style={{ color: colors.primary }} />
                  <span>Información Personal</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <UserOutlined style={{ color: colors.primary }} />
                        Nombre Completo
                      </Space>
                    }
                    name="nombre_empleado"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el nombre del empleado",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese nombre completo" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <PhoneOutlined style={{ color: colors.primary }} />
                        Teléfono
                      </Space>
                    }
                    name="telefono_empleado"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el teléfono",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese teléfono" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <MailOutlined style={{ color: colors.primary }} />
                        Email Personal
                      </Space>
                    }
                    name="email_empleado"
                    rules={[
                      {
                        type: "email",
                        message: "Por favor ingrese un email válido",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese email personal" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <SolutionOutlined style={{ color: colors.primary }} />
                        Cargo
                      </Space>
                    }
                    name="cargo_empleado"
                  >
                    <Input placeholder="Ingrese cargo" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Sección de información de usuario */}
            <Card
              title={
                <Space>
                  <TeamOutlined style={{ color: colors.primary }} />
                  <span>Información de Usuario</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <MailOutlined style={{ color: colors.primary }} />
                        Email Corporativo
                      </Space>
                    }
                    name="email_usuario"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el email corporativo",
                      },
                      {
                        type: "email",
                        message: "Por favor ingrese un email válido",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese email corporativo" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <TeamOutlined style={{ color: colors.primary }} />
                        Rol / Tipo de Usuario
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
                    <Select placeholder="Seleccione rol">
                      {tiposUsuario.map((tipo) => (
                        <Option
                          key={tipo.id_tipousuario}
                          value={tipo.id_tipousuario}
                        >
                          {tipo.descripcion_tipousuario}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Sección de información de salario */}
            <Card
              title={
                <Space>
                  <DollarOutlined style={{ color: colors.primary }} />
                  <span>Información de Salario</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <DollarOutlined style={{ color: colors.primary }} />
                        Monto Salario
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
                      placeholder="Ingrese monto"
                      min={0}
                      precision={2}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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
                        message: "Por favor seleccione el tipo de pago",
                      },
                    ]}
                  >
                    <Select placeholder="Seleccione tipo de pago">
                      <Option value="Diario">Diario</Option>
                      <Option value="Semanal">Semanal</Option>
                      <Option value="Quincenal">Quincenal</Option>
                      <Option value="Mensual">Mensual</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  minWidth: "200px",
                }}
              >
                Crear Empleado
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CrearEmpleado;
