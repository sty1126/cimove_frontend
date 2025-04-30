"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
  Spin,
  Modal,
  Checkbox,
  InputNumber,
  Alert,
  Tooltip,
  Badge,
  Tag,
} from "antd";
import {
  ToolOutlined,
  CalendarOutlined,
  UserOutlined,
  BankOutlined,
  PhoneOutlined,
  LockOutlined,
  DollarOutlined,
  FileTextOutlined,
  WarningOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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

const ActualizarServicioTecnico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [sedes, setSedes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [sedeInfo, setSedeInfo] = useState(null);
  const [aplicaProveedor, setAplicaProveedor] = useState(false);
  const [aplicaGarantia, setAplicaGarantia] = useState(false);
  const [costoEstimado, setCostoEstimado] = useState(0);
  const [abono, setAbono] = useState(0);
  const [modalExitoVisible, setModalExitoVisible] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [sedesRes, proveedoresRes, servicioRes] = await Promise.all([
          axios.get("https://cimove-backend.onrender.com/api/sedes/"),
          axios.get("https://cimove-backend.onrender.com/api/proveedores/all"),
          axios.get(
            `https://cimove-backend.onrender.com/api/serviciotecnico/${id}`
          ),
        ]);

        setSedes(sedesRes.data);
        setProveedores(proveedoresRes.data);

        const servicio = servicioRes.data;

        // Establecer información de sede
        const sede = sedesRes.data.find(
          (s) => s.id_sede === Number.parseInt(servicio.id_sede_serviciotecnico)
        );
        setSedeInfo(sede);

        // Establecer información de cliente
        setClienteInfo({
          id_cliente: servicio.id_cliente_serviciotecnico,
          // Aquí podrías añadir más información del cliente si la tienes disponible
        });

        // Establecer estados para checkboxes
        setAplicaProveedor(
          servicio.id_proveedor_serviciotecnico !== "PROV_TEMP_123"
        );
        setAplicaGarantia(servicio.garantia_aplica_serviciotecnico);
        setCostoEstimado(servicio.costo_serviciotecnico);
        setAbono(servicio.abono_serviciotecnico);

        // Establecer valores del formulario
        form.setFieldsValue({
          idCliente: servicio.id_cliente_serviciotecnico,
          idSede: servicio.id_sede_serviciotecnico,
          aplicaProveedor:
            servicio.id_proveedor_serviciotecnico !== "PROV_TEMP_123",
          idProveedor:
            servicio.id_proveedor_serviciotecnico !== "PROV_TEMP_123"
              ? servicio.id_proveedor_serviciotecnico
              : undefined,
          nombreServicio: servicio.nombre_serviciotecnico,
          descripcionServicio: servicio.descripcion_serviciotecnico,
          fechaServicio: servicio.fecha_serviciotecnico
            ? dayjs(servicio.fecha_serviciotecnico)
            : null,
          fechaEntrega: servicio.fecha_entrega_serviciotecnico
            ? dayjs(servicio.fecha_entrega_serviciotecnico)
            : null,
          tipoDano: servicio.tipo_dano_serviciotecnico,
          claveDispositivo: servicio.clave_dispositivo_serviciotecnico,
          costo: servicio.costo_serviciotecnico,
          abono: servicio.abono_serviciotecnico,
          garantiaAplica: servicio.garantia_aplica_serviciotecnico,
          fechaGarantia: servicio.fecha_garantia_serviciotecnico
            ? dayjs(servicio.fecha_garantia_serviciotecnico)
            : null,
          numeroContactoAlternativo:
            servicio.numero_contacto_alternativo_servicio,
          autorizado: servicio.autorizado_serviciotecnico,
        });
      } catch (error) {
        console.error("Error cargando datos:", error);
        message.error("Error al cargar datos del servicio técnico");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  // Función para validar que el abono no sea mayor al costo
  const validateAbono = (_, value) => {
    if (value > costoEstimado) {
      return Promise.reject(
        new Error("El abono no puede ser mayor al costo estimado")
      );
    }
    return Promise.resolve();
  };

  // Función para validar que la fecha no sea anterior a hoy
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Función para enviar el formulario
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        id_cliente: values.idCliente,
        id_sede: values.idSede,
        id_proveedor: values.aplicaProveedor
          ? values.idProveedor
          : "PROV_TEMP_123",
        nombre_servicio: values.nombreServicio,
        descripcion_servicio: values.descripcionServicio,
        fecha_servicio: values.fechaServicio.format("YYYY-MM-DD"),
        fecha_entrega: values.fechaEntrega
          ? values.fechaEntrega.format("YYYY-MM-DD")
          : null,
        tipo_dano: values.tipoDano,
        clave_dispositivo: values.claveDispositivo || "",
        costo: Number(values.costo),
        abono: Number(values.abono),
        garantia_aplica: values.garantiaAplica,
        fecha_garantia:
          values.garantiaAplica && values.fechaGarantia
            ? values.fechaGarantia.format("YYYY-MM-DD")
            : null,
        numero_contacto_alternativo: values.numeroContactoAlternativo || "",
        autorizado: values.autorizado,
      };

      await axios.put(
        `https://cimove-backend.onrender.com/api/serviciotecnico/${id}`,
        payload
      );
      setModalExitoVisible(true);
    } catch (error) {
      console.error("Error actualizando servicio técnico:", error);
      message.error("Error al actualizar el servicio técnico");
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar y volver atrás
  const handleCancel = () => {
    Modal.confirm({
      title: "¿Está seguro que desea cancelar?",
      content: "Los cambios no guardados se perderán",
      okText: "Sí, cancelar",
      cancelText: "No, continuar editando",
      onOk: () => navigate("/facturacion-ventas"),
    });
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
        <Spin size="large" tip="Cargando datos del servicio técnico..." />
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
              <EditOutlined style={{ marginRight: "12px" }} />
              Actualizar Servicio Técnico
            </Title>
            <Text type="secondary">
              Modifique los datos del servicio técnico #{id}
            </Text>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* Sección de Cliente y Sede */}
            <Card
              title={
                <Space>
                  <UserOutlined style={{ color: colors.primary }} />
                  <span>Información del Cliente</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
              extra={<Badge status="processing" text="No editable" />}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <BankOutlined style={{ color: colors.primary }} />
                        Sede
                      </Space>
                    }
                    name="idSede"
                  >
                    <Input
                      readOnly
                      value={sedeInfo?.nombre_sede}
                      addonBefore={
                        <Tag color="blue">{form.getFieldValue("idSede")}</Tag>
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <UserOutlined style={{ color: colors.primary }} />
                        Cliente
                      </Space>
                    }
                    name="idCliente"
                  >
                    <Input
                      readOnly
                      addonBefore={
                        <Tag color="green">
                          {form.getFieldValue("idCliente")}
                        </Tag>
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Alert
                message={
                  <Space>
                    <InfoCircleOutlined />
                    <span>
                      La sede y el cliente no se pueden modificar. Si necesita
                      cambiar estos datos, cree un nuevo servicio.
                    </span>
                  </Space>
                }
                type="info"
                showIcon={false}
                style={{ marginBottom: "16px" }}
              />
            </Card>

            {/* Sección de Detalles del Servicio */}
            <Card
              title={
                <Space>
                  <ToolOutlined style={{ color: colors.primary }} />
                  <span>Detalles del Servicio</span>
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
                        <FileTextOutlined style={{ color: colors.primary }} />
                        Nombre del Servicio
                      </Space>
                    }
                    name="nombreServicio"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el nombre del servicio",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Ej: Reparación de pantalla"
                      maxLength={50}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <WarningOutlined style={{ color: colors.primary }} />
                        Tipo de Daño
                      </Space>
                    }
                    name="tipoDano"
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione el tipo de daño",
                      },
                    ]}
                  >
                    <Select placeholder="Seleccione el tipo de daño">
                      <Option value="grave">Grave</Option>
                      <Option value="medio">Medio</Option>
                      <Option value="normal">Normal</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <Space>
                    <FileTextOutlined style={{ color: colors.primary }} />
                    Descripción del Servicio
                  </Space>
                }
                name="descripcionServicio"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese la descripción del servicio",
                  },
                ]}
              >
                <TextArea
                  placeholder="Describa detalladamente el servicio a realizar"
                  rows={4}
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <LockOutlined style={{ color: colors.primary }} />
                        Clave del Dispositivo
                      </Space>
                    }
                    name="claveDispositivo"
                  >
                    <Input.Password placeholder="Clave del dispositivo (opcional)" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <PhoneOutlined style={{ color: colors.primary }} />
                        Número de Contacto Alternativo
                      </Space>
                    }
                    name="numeroContactoAlternativo"
                  >
                    <Input
                      placeholder="Número de contacto alternativo"
                      maxLength={15}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Sección de Costos */}
            <Card
              title={
                <Space>
                  <DollarOutlined style={{ color: colors.primary }} />
                  <span>Información de Costos</span>
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
                        Costo Estimado ($)
                      </Space>
                    }
                    name="costo"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el costo estimado",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      step={1000}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      onChange={(value) => setCostoEstimado(value || 0)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <DollarOutlined style={{ color: colors.primary }} />
                        <Tooltip title="El abono no puede ser mayor al costo estimado">
                          Abono ($)
                        </Tooltip>
                      </Space>
                    }
                    name="abono"
                    rules={[
                      { required: true, message: "Por favor ingrese el abono" },
                      { validator: validateAbono },
                    ]}
                    dependencies={["costo"]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      max={costoEstimado}
                      step={1000}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      onChange={(value) => setAbono(value || 0)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Sección de Fechas */}
            <Card
              title={
                <Space>
                  <CalendarOutlined style={{ color: colors.primary }} />
                  <span>Fechas y Plazos</span>
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
                        <CalendarOutlined style={{ color: colors.primary }} />
                        Fecha de Servicio
                      </Space>
                    }
                    name="fechaServicio"
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione la fecha de servicio",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <ClockCircleOutlined
                          style={{ color: colors.primary }}
                        />
                        Fecha de Entrega Estimada
                      </Space>
                    }
                    name="fechaEntrega"
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Sección de Opciones Adicionales */}
            <Card
              title={
                <Space>
                  <InfoCircleOutlined style={{ color: colors.primary }} />
                  <span>Opciones Adicionales</span>
                </Space>
              }
              style={{ marginBottom: "24px", borderRadius: "8px" }}
              headStyle={{ backgroundColor: "#f5f5f5" }}
            >
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item name="aplicaProveedor" valuePropName="checked">
                    <Checkbox
                      onChange={(e) => setAplicaProveedor(e.target.checked)}
                    >
                      <Space>
                        <ShopOutlined style={{ color: colors.primary }} />
                        ¿Aplica proveedor?
                      </Space>
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="garantiaAplica" valuePropName="checked">
                    <Checkbox
                      onChange={(e) => setAplicaGarantia(e.target.checked)}
                    >
                      <Space>
                        <SafetyCertificateOutlined
                          style={{ color: colors.primary }}
                        />
                        ¿Aplica garantía?
                      </Space>
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="autorizado" valuePropName="checked">
                    <Checkbox>
                      <Space>
                        <CheckCircleOutlined
                          style={{ color: colors.primary }}
                        />
                        Autorizado
                      </Space>
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              {aplicaProveedor && (
                <Form.Item
                  label={
                    <Space>
                      <ShopOutlined style={{ color: colors.primary }} />
                      Proveedor
                    </Space>
                  }
                  name="idProveedor"
                  rules={[
                    {
                      required: aplicaProveedor,
                      message: "Por favor seleccione un proveedor",
                    },
                  ]}
                >
                  <Select placeholder="Seleccione un proveedor">
                    {proveedores.map((prov) => (
                      <Option key={prov.id_proveedor} value={prov.id_proveedor}>
                        {prov.nombre_proveedor}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {aplicaGarantia && (
                <Form.Item
                  label={
                    <Space>
                      <CalendarOutlined style={{ color: colors.primary }} />
                      Fecha de Garantía
                    </Space>
                  }
                  name="fechaGarantia"
                  rules={[
                    {
                      required: aplicaGarantia,
                      message: "Por favor seleccione la fecha de garantía",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              )}
            </Card>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Space size="large">
                <Button
                  danger
                  icon={<RollbackOutlined />}
                  size="large"
                  onClick={handleCancel}
                  style={{
                    minWidth: "150px",
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    minWidth: "150px",
                  }}
                >
                  Actualizar Servicio
                </Button>
              </Space>
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
          open={modalExitoVisible}
          footer={null}
          closable={false}
          centered
          maskClosable={false}
        >
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              El servicio técnico se ha actualizado correctamente.
            </p>
            <Button
              type="primary"
              style={{
                backgroundColor: colors.success,
                borderColor: colors.success,
              }}
              onClick={() => {
                setModalExitoVisible(false);
                navigate("/facturacion-ventas");
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

export default ActualizarServicioTecnico;
