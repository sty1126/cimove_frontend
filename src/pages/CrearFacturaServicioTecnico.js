"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
  Space,
  message,
  Spin,
  Modal,
  Checkbox,
  InputNumber,
  Alert,
  Tooltip,
  Statistic,
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
  PlusOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import SeleccionarClientePorSede from "./SeleccionarClientePorSede";

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

// Validation utility functions
const validarTextoSeguro = (texto) => {
  if (!texto) return true;
  return !/[<>{};]/.test(texto);
};

const validarNumeroTelefono = (numero) => {
  if (!numero) return true;
  return /^[0-9]{7,10}$/.test(numero);
};

const CrearServicioTecnico = () => {
  const [form] = Form.useForm();
  const [sedes, setSedes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedSede, setSelectedSede] = useState(null);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [aplicaProveedor, setAplicaProveedor] = useState(false);
  const [aplicaGarantia, setAplicaGarantia] = useState(false);
  const [costoEstimado, setCostoEstimado] = useState(0);
  const [abono, setAbono] = useState(0);
  const [modalExitoVisible, setModalExitoVisible] = useState(false);

  // Estados para métodos de pago
  const [metodosPago, setMetodosPago] = useState([]);
  const [metodosSeleccionados, setMetodosSeleccionados] = useState([]);
  const [pagoCompleto, setPagoCompleto] = useState(false);
  const [faltante, setFaltante] = useState(0);

  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [resSedes, resProveedores, resMetodosPago] = await Promise.all([
          axios.get("https://cimove-backend.onrender.com/api/sedes/"),
          axios.get("https://cimove-backend.onrender.com/api/proveedores/all"),
          axios.get("https://cimove-backend.onrender.com/api/tipometodopago"),
        ]);
        setSedes(resSedes.data);
        setProveedores(resProveedores.data);
        setMetodosPago(resMetodosPago.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        message.error("Error al cargar datos iniciales");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular abono total a partir de los métodos de pago
  useEffect(() => {
    const montoTotalIngresado = metodosSeleccionados.reduce(
      (acc, m) => acc + Number.parseFloat(m.monto || 0),
      0
    );
    setAbono(montoTotalIngresado);

    // Verificar si el abono es válido (no mayor al costo)
    if (montoTotalIngresado > costoEstimado) {
      message.warning("El abono no puede ser mayor al costo estimado");
    }

    // Calcular faltante para mostrar en la UI
    const nuevoFaltante = 0; // Ya no hay faltante porque el abono es igual a la suma de métodos
    setFaltante(nuevoFaltante);
    setPagoCompleto(montoTotalIngresado <= costoEstimado); // Solo está completo si el abono no excede el costo
  }, [metodosSeleccionados, costoEstimado]);

  // Función para manejar la selección de cliente
  const handleClienteSeleccionado = (cliente) => {
    if (cliente) {
      setClienteSeleccionado(cliente);
      form.setFieldsValue({
        idCliente: cliente.id_cliente,
      });
    }
    setShowModalCliente(false);
  };

  // Función para manejar el cambio de sede
  const handleSedeChange = (value) => {
    // Si ya hay un cliente seleccionado, mostrar advertencia
    if (clienteSeleccionado) {
      Modal.confirm({
        title: "Cambio de sede",
        icon: <WarningOutlined style={{ color: colors.warning }} />,
        content:
          "Cambiar la sede eliminará el cliente seleccionado. ¿Desea continuar?",
        okText: "Sí, cambiar",
        cancelText: "Cancelar",
        okButtonProps: {
          style: {
            backgroundColor: colors.warning,
            borderColor: colors.warning,
          },
        },
        onOk: () => {
          setSelectedSede(value);
          setClienteSeleccionado(null);
          form.setFieldsValue({ idCliente: null });
        },
      });
    } else {
      setSelectedSede(value);
    }
  };

  // Función para validar que la fecha no sea anterior a hoy
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Funciones para métodos de pago
  const agregarMetodoPago = () => {
    // Verificar que no haya más de 2 métodos de pago
    if (metodosSeleccionados.length >= 2) {
      message.warning("Solo se permiten hasta dos métodos de pago");
      return;
    }

    setMetodosSeleccionados([
      ...metodosSeleccionados,
      { id: "", monto: 0, id_tipo: "", nombre: "" },
    ]);
  };

  const eliminarMetodoPago = (index) => {
    const nuevosMetodos = [...metodosSeleccionados];
    nuevosMetodos.splice(index, 1);
    setMetodosSeleccionados(nuevosMetodos);
  };

  // Función para validar que solo se ingresen números
  const validateNumberInput = (e) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    // Permitir solo dígitos (0-9)
    if (!/^\d+$/.test(keyValue)) {
      e.preventDefault();
      return false;
    }
  };

  // Función para manejar cambios en los campos de entrada numérica
  const handleNumberInputChange = (e, index, field) => {
    const value = e.target.value;
    // Eliminar cualquier carácter que no sea un dígito
    const cleanValue = value.replace(/[^\d]/g, "");

    // Verificar si el valor ha cambiado para evitar un bucle infinito
    if (value !== cleanValue) {
      e.target.value = cleanValue;
    }

    // Actualizar el estado con el valor limpio
    handleMetodoChange(index, field, cleanValue);
  };

  const handleMetodoChange = (index, field, value) => {
    const updatedMetodos = [...metodosSeleccionados];

    if (field === "id") {
      updatedMetodos[index].id = value;
      updatedMetodos[index].id_tipo = value;

      // Establecer el nombre del método de pago
      const metodoPago = metodosPago.find(
        (m) => m.id_tipometodopago === Number.parseInt(value)
      );
      if (metodoPago) {
        updatedMetodos[index].nombre = metodoPago.nombre_tipometodopago;
      }
    } else {
      updatedMetodos[index][field] = value;
    }

    setMetodosSeleccionados(updatedMetodos);
  };

  // Función para enviar el formulario
  const handleSubmit = async (values) => {
    // Validar que haya un abono
    if (abono <= 0) {
      message.error(
        "Debe registrar al menos un método de pago con abono para crear el servicio técnico"
      );
      return;
    }

    // Validar métodos de pago
    if (abono > 0) {
      // Verificar que haya al menos un método de pago
      if (metodosSeleccionados.length === 0) {
        message.error(
          "Debe registrar al menos un método de pago para el abono"
        );
        return;
      }

      // Verificar que todos los métodos tengan un tipo seleccionado
      const metodosSinTipo = metodosSeleccionados.some((m) => !m.id_tipo);
      if (metodosSinTipo) {
        message.error(
          "Todos los métodos de pago deben tener un tipo seleccionado"
        );
        return;
      }
    }

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
        metodos_pago:
          abono > 0
            ? metodosSeleccionados.map((metodo) => ({
                id_tipo: Number(metodo.id_tipo),
                monto: Number(metodo.monto),
              }))
            : [],
      };

      await axios.post(
        "https://cimove-backend.onrender.com/api/serviciotecnico",
        payload
      );
      setModalExitoVisible(true);
    } catch (error) {
      console.error("Error creando servicio técnico:", error);
      message.error(
        "Error al crear el servicio técnico: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre de sede
  const obtenerNombreSede = (id) => {
    if (!id) return "";
    const sede = sedes.find((s) => s.id_sede === Number.parseInt(id));
    return sede ? sede.nombre_sede : "";
  };

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
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
              <ToolOutlined style={{ marginRight: "12px" }} />
              Crear Servicio Técnico
            </Title>
            <Text type="secondary">
              Complete el formulario para registrar un nuevo servicio técnico
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
              fechaServicio: dayjs(),
              autorizado: true,
              aplicaProveedor: false,
              garantiaAplica: false,
              costo: 0,
            }}
          >
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
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione una sede",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Seleccione una sede"
                      onChange={handleSedeChange}
                      disabled={!!clienteSeleccionado}
                    >
                      {sedes.map((sede) => (
                        <Option key={sede.id_sede} value={sede.id_sede}>
                          {sede.nombre_sede}
                        </Option>
                      ))}
                    </Select>
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
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione un cliente",
                      },
                    ]}
                  >
                    <Input
                      readOnly
                      addonAfter={
                        <Button
                          type="link"
                          onClick={() => setShowModalCliente(true)}
                          disabled={!selectedSede}
                          style={{ padding: 0 }}
                        >
                          Seleccionar
                        </Button>
                      }
                      placeholder="Seleccione un cliente"
                      value={
                        clienteSeleccionado
                          ? `${clienteSeleccionado.id_cliente}`
                          : ""
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              {clienteSeleccionado && (
                <Alert
                  message={
                    <Space>
                      <InfoCircleOutlined />
                      <span>
                        Cliente seleccionado: {clienteSeleccionado.id_cliente} -{" "}
                        {clienteSeleccionado.nombre_cliente ||
                          clienteSeleccionado.razonsocial_cliente}
                      </span>
                    </Space>
                  }
                  type="info"
                  showIcon={false}
                  style={{ marginBottom: "16px" }}
                />
              )}
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
                      {
                        validator: (_, value) =>
                          validarTextoSeguro(value)
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  "No se permiten símbolos como <, >, {, }, ;"
                                )
                              ),
                      },
                      {
                        max: 100,
                        message:
                          "El nombre no puede exceder los 100 caracteres",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Ej: Reparación de pantalla"
                      maxLength={100}
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
                  {
                    validator: (_, value) =>
                      validarTextoSeguro(value)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "No se permiten símbolos como <, >, {, }, ;"
                            )
                          ),
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
                    rules={[
                      {
                        validator: (_, value) =>
                          validarTextoSeguro(value)
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  "No se permiten símbolos como <, >, {, }, ;"
                                )
                              ),
                      },
                    ]}
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
                    rules={[
                      {
                        validator: (_, value) =>
                          !value || validarNumeroTelefono(value)
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  "El número debe tener entre 7 y 10 dígitos numéricos"
                                )
                              ),
                      },
                    ]}
                  >
                    <Input
                      placeholder="Número de contacto alternativo"
                      maxLength={10}
                      onKeyPress={(e) => {
                        const keyCode = e.keyCode || e.which;
                        const keyValue = String.fromCharCode(keyCode);
                        if (!/^\d+$/.test(keyValue)) {
                          e.preventDefault();
                        }
                      }}
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
                  {costoEstimado > 0 && (
                    <Alert
                      message="Recomendación de abono"
                      description={`Se recomienda un abono de al menos ${formatCurrency(
                        costoEstimado * 0.5
                      )} (50% del costo estimado).`}
                      type="info"
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                  )}
                </Col>

                <Col xs={24} md={12}>
                  <Statistic
                    title={
                      <Space>
                        <DollarOutlined style={{ color: colors.primary }} />
                        <Tooltip title="El abono se calcula automáticamente a partir de los métodos de pago">
                          Abono Total
                        </Tooltip>
                      </Space>
                    }
                    value={abono}
                    precision={0}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{
                      color: abono > 0 ? colors.success : colors.text,
                    }}
                  />
                </Col>
              </Row>

              {/* Sección de Métodos de Pago */}
              <div style={{ marginTop: "16px" }}>
                <Divider orientation="left">
                  <Space>
                    <CreditCardOutlined style={{ color: colors.primary }} />
                    Métodos de Pago
                  </Space>
                </Divider>

                {metodosSeleccionados.length === 0 && (
                  <Alert
                    message="No hay métodos de pago seleccionados"
                    description="Agregue al menos un método de pago para registrar un abono."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                {metodosSeleccionados.map((metodo, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                    <Row gutter={16} align="middle">
                      <Col span={10}>
                        <Form.Item
                          label="Tipo de pago"
                          validateStatus={!metodo.id ? "error" : ""}
                          help={!metodo.id ? "Seleccione un método" : ""}
                          style={{ marginBottom: 0 }}
                        >
                          <Select
                            value={metodo.id || undefined}
                            onChange={(value) =>
                              handleMetodoChange(index, "id", value)
                            }
                            placeholder="Seleccione un método"
                            style={{ width: "100%" }}
                          >
                            {metodosPago.map((metodoPago) => {
                              const yaSeleccionado = metodosSeleccionados.some(
                                (m, i) =>
                                  m.id === metodoPago.id_tipometodopago &&
                                  i !== index
                              );
                              return (
                                <Option
                                  key={metodoPago.id_tipometodopago}
                                  value={metodoPago.id_tipometodopago}
                                  disabled={yaSeleccionado}
                                >
                                  {metodoPago.nombre_tipometodopago}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          label="Monto"
                          validateStatus={!metodo.monto ? "error" : ""}
                          help={!metodo.monto ? "Ingrese un monto" : ""}
                          style={{ marginBottom: 0 }}
                        >
                          <Input
                            value={metodo.monto}
                            onChange={(e) =>
                              handleNumberInputChange(e, index, "monto")
                            }
                            onKeyPress={validateNumberInput}
                            prefix={<DollarOutlined />}
                            placeholder="Monto"
                            min={0}
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ textAlign: "right" }}>
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => eliminarMetodoPago(index)}
                        >
                          Eliminar
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={agregarMetodoPago}
                  style={{ width: "100%", marginTop: 16 }}
                  icon={<PlusOutlined />}
                  disabled={metodosSeleccionados.length >= 2}
                >
                  Agregar método de pago
                </Button>

                {/* Resumen de pago */}
                <Row gutter={24} style={{ marginTop: 16 }}>
                  <Col xs={24} md={8}>
                    <Statistic
                      title="Abono total"
                      value={abono}
                      precision={0}
                      formatter={(value) => formatCurrency(value)}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Statistic
                      title="Total ingresado"
                      value={metodosSeleccionados.reduce(
                        (sum, m) => sum + Number(m.monto || 0),
                        0
                      )}
                      precision={0}
                      valueStyle={{
                        color: pagoCompleto ? colors.success : colors.danger,
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Statistic
                      title="Faltante"
                      value={faltante}
                      precision={0}
                      valueStyle={{
                        color: pagoCompleto ? colors.success : colors.danger,
                      }}
                      formatter={(value) => formatCurrency(value)}
                      suffix={
                        pagoCompleto ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                    />
                  </Col>
                </Row>

                {!pagoCompleto && metodosSeleccionados.length > 0 && (
                  <Alert
                    message="Pago incompleto"
                    description="La suma de los métodos de pago no coincide con el valor del abono."
                    type="warning"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}

                {metodosSeleccionados.length > 0 && pagoCompleto && (
                  <Alert
                    message="Pago completo"
                    description="El pago está listo para ser procesado."
                    type="success"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}
              </div>
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
                    <DatePicker
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                    />
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
                    <Checkbox defaultChecked>
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

            {abono > costoEstimado && (
              <Alert
                message="Error en el abono"
                description="El abono no puede ser mayor al costo estimado del servicio."
                type="error"
                showIcon
                style={{ marginTop: 16, marginBottom: 16 }}
              />
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
                disabled={
                  abono <= 0 ||
                  (abono > 0 && metodosSeleccionados.length === 0) ||
                  abono > costoEstimado
                }
              >
                Crear Servicio Técnico
              </Button>
            </div>
          </Form>
        </Card>

        {/* Modal para seleccionar cliente */}
        <SeleccionarClientePorSede
          show={showModalCliente}
          handleClose={() => setShowModalCliente(false)}
          setCliente={handleClienteSeleccionado}
          selectedSede={obtenerNombreSede(selectedSede)}
          sedes={sedes}
        />

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
          open={modalExitoVisible}
          footer={null}
          closable={false}
          centered
          maskClosable={false}
        >
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              El servicio técnico se ha creado correctamente.
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

export default CrearServicioTecnico;
