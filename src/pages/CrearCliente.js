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
  DatePicker,
  Space,
  message,
  Spin,
  Modal,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  TagOutlined,
  IdcardOutlined,
  SaveOutlined,
  BankOutlined,
  ShopOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  NumberOutlined,
  CalendarOutlined,
  ManOutlined,
  BuildOutlined,
  CheckCircleOutlined,
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

const CrearCliente = () => {
  const [form] = Form.useForm();
  const [documentos, setDocumentos] = useState([]);
  const [tiposCliente, setTiposCliente] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [tipoCliente, setTipoCliente] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [resDocs, resTipos, resSedes] = await Promise.all([
          axios.get("https://cimove-backend.onrender.com/api/tipodocumento"),
          axios.get("https://cimove-backend.onrender.com/api/tipocliente"),
          axios.get("https://cimove-backend.onrender.com/api/sedes"),
        ]);
        setDocumentos(resDocs.data);
        setTiposCliente(resTipos.data);
        setSedes(resSedes.data);
      } catch (error) {
        console.error("Error cargando datos auxiliares:", error);
        message.error("Error al cargar datos iniciales");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar cambio de tipo de cliente
  const handleTipoClienteChange = (value) => {
    console.log("Tipo de cliente seleccionado:", value); // Para depuración
    setTipoCliente(value);

    // Si el tipo de cliente cambia a Jurídico, se fuerza el documento como NIT (5)
    if (value === "2") {
      form.setFieldValue("id_tipodocumento_cliente", "5");
    } else {
      form.setFieldValue("id_tipodocumento_cliente", "");
    }

    // Limpiar campos específicos según el tipo de cliente
    if (value === "1") {
      form.setFieldsValue({
        razonsocial_cliente: "",
        nombrecomercial_cliente: "",
        representante_cliente: "",
        digitoverificacion_cliente: "",
      });
    } else if (value === "2") {
      form.setFieldsValue({
        nombre_cliente: "",
        apellido_cliente: "",
        fechanacimiento_cliente: null,
        genero_cliente: "",
      });
    }
  };

  // Enviar formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Formatear fecha si existe
      if (values.fechanacimiento_cliente) {
        values.fechanacimiento_cliente =
          values.fechanacimiento_cliente.format("YYYY-MM-DD");
      }

      await axios.post("https://cimove-backend.onrender.com/api/clientes", values);

      // Mostrar modal de éxito
      setModalVisible(true);

      // Resetear formulario
      form.resetFields();
      setTipoCliente(null);
    } catch (error) {
      console.error("Error al crear cliente:", error);
      message.error("Error al crear el cliente");
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
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
              <UserOutlined style={{ marginRight: "12px" }} />
              Crear Cliente
            </Title>
            <Text type="secondary">
              Complete el formulario para registrar un nuevo cliente
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
              id_cliente: "",
              id_tipodocumento_cliente: "",
              id_tipocliente_cliente: "",
              telefono_cliente: "",
              id_sede_cliente: "",
              email_cliente: "",
              direccion_cliente: "",
              barrio_cliente: "",
              codigopostal_cliente: "",
              nombre_cliente: "",
              apellido_cliente: "",
              fechanacimiento_cliente: null,
              genero_cliente: "",
              razonsocial_cliente: "",
              nombrecomercial_cliente: "",
              representante_cliente: "",
              digitoverificacion_cliente: "",
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
                        ID / Documento
                      </Space>
                    }
                    name="id_cliente"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el documento",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese número de documento" maxLength={10} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <TagOutlined style={{ color: colors.primary }} />
                        Tipo de Cliente
                      </Space>
                    }
                    name="id_tipocliente_cliente"
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione el tipo de cliente",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Seleccione tipo de cliente"
                      onChange={handleTipoClienteChange}
                    >
                      {tiposCliente.map((tipo) => (
                        <Option
                          key={tipo.id_tipocliente}
                          value={tipo.id_tipocliente.toString()}
                        >
                          {tipo.descripcion_tipocliente}
                        </Option>
                      ))}
                    </Select>
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
                    name="id_tipodocumento_cliente"
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione el tipo de documento",
                      },
                    ]}
                  >
                    <Select
                      placeholder={
                        tipoCliente === "2"
                          ? "NIT"
                          : "Seleccione tipo de documento"
                      }
                      disabled={tipoCliente === "2"}
                    >
                      {documentos
                        .filter(
                          (doc) =>
                            tipoCliente === "1"
                              ? doc.id_tipodocumento !== 5 // Excluir NIT para naturales
                              : doc.id_tipodocumento === 5 // Solo NIT para jurídicos
                        )
                        .map((doc) => (
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
              </Row>
            </Card>

            {/* Sección de contacto */}
            <Card
              title={
                <Space>
                  <PhoneOutlined style={{ color: colors.primary }} />
                  <span>Información de Contacto</span>
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
                        <PhoneOutlined style={{ color: colors.primary }} />
                        Teléfono
                      </Space>
                    }
                    name="telefono_cliente"
                  >
                    <Input placeholder="Ingrese teléfono" maxLength={13} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <MailOutlined style={{ color: colors.primary }} />
                        Email
                      </Space>
                    }
                    name="email_cliente"
                    rules={[
                      {
                        type: "email",
                        message: "Por favor ingrese un email válido",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese email" maxLength={30} />
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
                    name="id_sede_cliente"
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

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <HomeOutlined style={{ color: colors.primary }} />
                        Dirección
                      </Space>
                    }
                    name="direccion_cliente"
                  >
                    <Input placeholder="Ingrese dirección" maxLength={30} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <EnvironmentOutlined
                          style={{ color: colors.primary }}
                        />
                        Barrio
                      </Space>
                    }
                    name="barrio_cliente"
                  >
                    <Input placeholder="Ingrese barrio" maxLength={15}/>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <EnvironmentOutlined
                          style={{ color: colors.primary }}
                        />
                        Código Postal
                      </Space>
                    }
                    name="codigopostal_cliente"
                  >
                    <Input placeholder="Ingrese código postal" maxLength={6} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Sección condicional según tipo de cliente */}
            {tipoCliente === "1" && (
              <Card
                title={
                  <Space>
                    <UserOutlined style={{ color: colors.primary }} />
                    <span>Información del Cliente Natural</span>
                  </Space>
                }
                style={{ marginBottom: "24px", borderRadius: "8px" }}
                headStyle={{ backgroundColor: "#f5f5f5" }}
              >
                <Row gutter={24}>
                  <Col xs={24} md={6}>
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
                          required: tipoCliente === "1",
                          message: "Por favor ingrese el nombre",
                        },
                      ]}
                    >
                      <Input placeholder="Ingrese nombre" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={6}>
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
                          required: tipoCliente === "1",
                          message: "Por favor ingrese el apellido",
                        },
                      ]}
                    >
                      <Input placeholder="Ingrese apellido" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={6}>
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
                        placeholder="Seleccione fecha"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={6}>
                    <Form.Item
                      label={
                        <Space>
                          <ManOutlined style={{ color: colors.primary }} />
                          Género
                        </Space>
                      }
                      name="genero_cliente"
                    >
                      <Select placeholder="Seleccione género">
                        <Option value="Masculino">Masculino</Option>
                        <Option value="Femenino">Femenino</Option>
                        <Option value="Otro">Otro</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )}

            {tipoCliente === "2" && (
              <Card
                title={
                  <Space>
                    <ShopOutlined style={{ color: colors.primary }} />
                    <span>Información del Cliente Jurídico</span>
                  </Space>
                }
                style={{ marginBottom: "24px", borderRadius: "8px" }}
                headStyle={{ backgroundColor: "#f5f5f5" }}
              >
                <Row gutter={24}>
                  <Col xs={24} md={6}>
                    <Form.Item
                      label={
                        <Space>
                          <BuildOutlined style={{ color: colors.primary }} />
                          Razón Social
                        </Space>
                      }
                      name="razonsocial_cliente"
                      rules={[
                        {
                          required: tipoCliente === "2",
                          message: "Por favor ingrese la razón social",
                        },
                      ]}
                    >
                      <Input placeholder="Ingrese razón social" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={6}>
                    <Form.Item
                      label={
                        <Space>
                          <ShopOutlined style={{ color: colors.primary }} />
                          Nombre Comercial
                        </Space>
                      }
                      name="nombrecomercial_cliente"
                    >
                      <Input placeholder="Ingrese nombre comercial" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={6}>
                    <Form.Item
                      label={
                        <Space>
                          <TeamOutlined style={{ color: colors.primary }} />
                          Representante Legal
                        </Space>
                      }
                      name="representante_cliente"
                    >
                      <Input placeholder="Ingrese representante legal" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={6}>
                    <Form.Item
                      label={
                        <Space>
                          <NumberOutlined style={{ color: colors.primary }} />
                          Dígito de Verificación
                        </Space>
                      }
                      name="digitoverificacion_cliente"
                    >
                      <Input placeholder="Ingrese dígito" maxLength={1} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )}

            {!tipoCliente && (
              <Card
                style={{
                  marginBottom: "24px",
                  borderRadius: "8px",
                  borderLeft: `4px solid ${colors.warning}`,
                  backgroundColor: "#FFFBE6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TagOutlined
                    style={{
                      color: colors.warning,
                      fontSize: "20px",
                      marginRight: "12px",
                    }}
                  />
                  <div>
                    <Text strong>Seleccione un tipo de cliente</Text>
                    <div>
                      <Text type="secondary">
                        Por favor seleccione un tipo de cliente para mostrar los
                        campos adicionales.
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            )}

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
                Crear Cliente
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
              <span>Registro Exitoso</span>
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
              El cliente se ha creado correctamente.
            </p>
            <Button
              type="primary"
              style={{
                backgroundColor: colors.success,
                borderColor: colors.success,
              }}
              onClick={() => {
                setModalVisible(false);
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

export default CrearCliente;
