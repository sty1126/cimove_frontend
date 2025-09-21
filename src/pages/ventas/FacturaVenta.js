"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  obtenerMetodosPago,
  registrarVenta,
} from "../../services/ventasService";
import {
  Layout,
  Card,
  Typography,
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
  Row,
  Col,
  Space,
  Tag,
  Alert,
  Checkbox,
  Statistic,
  Steps,
  Tooltip,
  Modal,
  Result,
  Spin,
  ConfigProvider,
} from "antd";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  PrinterOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  DollarOutlined,
  BarcodeOutlined,
  ShopOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/es_ES";

const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { Step } = Steps;

const FacturaVenta = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    carrito: cart,
    clienteSeleccionado,
    total,
    subtotal,
    descuento,
    iva,
  } = location.state || {};

  const [metodosPago, setMetodosPago] = useState([]);
  const [metodosSeleccionados, setMetodosSeleccionados] = useState([]);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [aplicaGarantia, setAplicaGarantia] = useState(false);
  const [fechaGarantia, setFechaGarantia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [facturaId, setFacturaId] = useState(null);

  // Tema personalizado para Ant Design
  const theme = {
    token: {
      colorPrimary: "#1890ff",
      borderRadius: 6,
      fontSize: 14,
    },
  };

  useEffect(() => {
    if (!cart || !Array.isArray(cart)) {
      setError("No se han recibido datos de la venta. Redirigiendo...");
      setTimeout(() => {
        navigate("/ventas");
      }, 2000);
      return;
    }

    // Cargar métodos de pago
    setLoading(true);
    obtenerMetodosPago()
      .then((data) => {
        setMetodosPago(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los métodos de pago.");
        setLoading(false);
      });
  }, [cart, navigate]);

  const agregarMetodoPago = () => {
    setMetodosSeleccionados([
      ...metodosSeleccionados,
      { id: "", monto: 0, nombre: "", comision: 0, recepcion: "" },
    ]);
  };

  const validarFechaGarantia = (fecha) => {
    if (!fecha) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha.isAfter(dayjs(hoy));
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

    // Actualizar el estado con el valor limpio
    handleMetodoChange(index, field, cleanValue);
  };

  const handleMetodoChange = (index, field, value) => {
    const updatedMetodos = [...metodosSeleccionados];
    updatedMetodos[index][field] =
      field === "id" ? Number.parseInt(value) : value;

    if (field === "id") {
      updatedMetodos[index].id_tipometodopago_metodopago =
        Number.parseInt(value);

      // Establecer el nombre del método de pago
      const metodoPago = metodosPago.find(
        (m) => m.id_tipometodopago === Number.parseInt(value)
      );
      if (metodoPago) {
        updatedMetodos[index].nombre = metodoPago.nombre_tipometodopago;
      }
    }

    setMetodosSeleccionados(updatedMetodos);
  };

  const montoTotalIngresado = metodosSeleccionados.reduce(
    (acc, m) => acc + Number.parseFloat(m.monto || 0),
    0
  );

  const faltante = total - montoTotalIngresado;
  const pagoCompleto = Math.abs(faltante) < 0.01;

  const confirmarVenta = async () => {
    // Validación: todos los métodos deben tener tipo
    for (const metodo of metodosSeleccionados) {
      if (!metodo.id_tipometodopago_metodopago) {
        setError(
          "Todos los métodos de pago deben tener un tipo de pago seleccionado."
        );
        return;
      }
    }

    try {
      setLoading(true);

      const venta = {
        idCliente: clienteSeleccionado?.id_cliente || null,
        subtotal,
        descuento,
        iva,
        total,
        saldo: total,
        idSede: cart[0]?.idSede,
        detalles: cart.map((prod) => ({
          idProducto: prod.id,
          cantidad: prod.cantidad,
          precioVenta: prod.precioVenta || prod.precio || 0,
          valorIVA: prod.valorIVA || 0,
          idSede: prod.idSede,
        })),
        metodosPago: metodosSeleccionados.map((metodo) => ({
          idTipoMetodoPago: metodo.id,
          monto: Number.parseFloat(metodo.monto),
        })),
        aplicaGarantia,
        fechaGarantia:
          aplicaGarantia && fechaGarantia
            ? fechaGarantia.format("YYYY-MM-DD")
            : null,
      };

      const response = await registrarVenta(venta);

      if (response.status === 201) {
        setExito("¡Venta registrada exitosamente!");
        setShowSuccessModal(true);
      } else {
        setError("Error al registrar la venta.");
      }
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al registrar la venta.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const columns = [
    {
      title: "Producto",
      dataIndex: "nombre",
      key: "nombre",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      render: (cantidad) => (
        <Tag color="blue" style={{ fontSize: "14px", padding: "4px 8px" }}>
          {cantidad}
        </Tag>
      ),
    },
    {
      title: "Precio unitario",
      dataIndex: "precio",
      key: "precio",
      align: "right",
      render: (precio, record) => formatCurrency(record.precioVenta || precio),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      align: "right",
      render: (_, record) => (
        <Text strong>
          {formatCurrency(
            (record.precioVenta || record.precio) * record.cantidad
          )}
        </Text>
      ),
    },
  ];

  const disabledDate = (current) => {
    // No permite seleccionar fechas anteriores a mañana
    return current && current < dayjs().endOf("day");
  };

  const renderReviewStep = () => (
    <Card className="review-card" bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card
            title={
              <>
                <UserOutlined /> Información del Cliente
              </>
            }
            bordered={false}
            className="inner-card"
          >
            <Text strong>
              {clienteSeleccionado
                ? clienteSeleccionado.nombre_cliente ||
                  clienteSeleccionado.nombre_razon
                : "Consumidor final"}
            </Text>
            {clienteSeleccionado && clienteSeleccionado.documento && (
              <div>
                <Text type="secondary">
                  Documento: {clienteSeleccionado.documento}
                </Text>
              </div>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title={
              <>
                <ShoppingCartOutlined /> Resumen de Compra
              </>
            }
            bordered={false}
            className="inner-card"
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Row justify="space-between">
                <Col>Subtotal:</Col>
                <Col>{formatCurrency(subtotal || 0)}</Col>
              </Row>
              <Row justify="space-between">
                <Col>Descuento:</Col>
                <Col>{formatCurrency(descuento || 0)}</Col>
              </Row>
              <Row justify="space-between">
                <Col>IVA:</Col>
                <Col>{formatCurrency(iva || 0)}</Col>
              </Row>
              <Divider style={{ margin: "8px 0" }} />
              <Row justify="space-between">
                <Col>
                  <Text strong>Total:</Text>
                </Col>
                <Col>
                  <Text strong>{formatCurrency(total || 0)}</Text>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <>
            <BarcodeOutlined /> Detalle de Productos
          </>
        }
        bordered={false}
        className="inner-card"
        style={{ marginTop: 24 }}
      >
        <Table
          dataSource={cart}
          columns={columns}
          pagination={false}
          rowKey={(record) => record.id}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3} align="right">
                  <Text strong>Total:</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ fontSize: "16px" }}>
                    {formatCurrency(total || 0)}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <Space>
          <Button onClick={prevStep} icon={<ArrowLeftOutlined />}>
            Atrás
          </Button>
          <Button
            type="primary"
            onClick={nextStep}
            icon={<CreditCardOutlined />}
          >
            Continuar al Pago
          </Button>
        </Space>
      </div>
    </Card>
  );

  const renderPaymentStep = () => (
    <Card className="payment-card" bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card
            title={
              <>
                <CreditCardOutlined /> Métodos de Pago
              </>
            }
            bordered={false}
            className="inner-card"
          >
            {metodosSeleccionados.length === 0 && (
              <Alert
                message="No hay métodos de pago seleccionados"
                description="Agregue al menos un método de pago para continuar."
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
            >
              Agregar método de pago
            </Button>
          </Card>

          <Card
            title={
              <>
                <CalendarOutlined /> Opciones Adicionales
              </>
            }
            bordered={false}
            className="inner-card"
            style={{ marginTop: 24 }}
          >
            <Form.Item>
              <Checkbox
                checked={aplicaGarantia}
                onChange={(e) => setAplicaGarantia(e.target.checked)}
              >
                Aplicar garantía
              </Checkbox>
            </Form.Item>

            {aplicaGarantia && (
              <Form.Item
                label="Fecha de vencimiento de la garantía"
                validateStatus={!fechaGarantia && aplicaGarantia ? "error" : ""}
                help={
                  !fechaGarantia && aplicaGarantia
                    ? "Seleccione una fecha válida"
                    : ""
                }
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  value={fechaGarantia}
                  onChange={setFechaGarantia}
                  disabledDate={disabledDate}
                  locale={locale}
                  placeholder="Seleccione una fecha"
                />
              </Form.Item>
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title={
              <>
                <InfoCircleOutlined /> Resumen del Pago
              </>
            }
            bordered={false}
            className="inner-card"
            style={{ height: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Statistic
                title="Total a pagar"
                value={total}
                precision={2}
                formatter={(value) => formatCurrency(value)}
              />

              <Statistic
                title="Total ingresado"
                value={montoTotalIngresado}
                precision={2}
                valueStyle={{ color: pagoCompleto ? "#3f8600" : "#cf1322" }}
                formatter={(value) => formatCurrency(value)}
              />

              <Statistic
                title="Faltante"
                value={faltante}
                precision={2}
                valueStyle={{ color: pagoCompleto ? "#3f8600" : "#cf1322" }}
                formatter={(value) => formatCurrency(value)}
                suffix={
                  pagoCompleto ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )
                }
              />

              {!pagoCompleto && (
                <Alert
                  message="Pago incompleto"
                  description="La suma de los métodos de pago no coincide con el total."
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
            </Space>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <Space>
          <Button onClick={prevStep} icon={<ArrowLeftOutlined />}>
            Atrás
          </Button>
          <Button
            type="primary"
            onClick={confirmarVenta}
            disabled={
              !pagoCompleto ||
              metodosSeleccionados.length === 0 ||
              (aplicaGarantia && !fechaGarantia) ||
              loading
            }
            icon={<SaveOutlined />}
            loading={loading}
          >
            Confirmar y Registrar Venta
          </Button>
        </Space>
      </div>
    </Card>
  );

  // Modal de éxito con cambios solicitados
  const successModal = (
    <Modal
      open={showSuccessModal}
      footer={null}
      closable={false}
      centered
      width={600}
    >
      <Result
        status="success"
        title="¡Venta Registrada Exitosamente!"
        extra={[
          <Button
            type="primary"
            key="console"
            icon={<ShopOutlined />}
            onClick={() => navigate("/ventas")}
          >
            Nueva Venta
          </Button>,
          <Button
            key="facturacion"
            icon={<FileTextOutlined />}
            onClick={() => navigate("/facturacion-ventas")}
          >
            Ver Facturas
          </Button>,
        ]}
      />
    </Modal>
  );

  if (error && !cart) {
    return (
      <Result
        status="error"
        title="Error al cargar los datos"
        subTitle={error}
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={() => navigate("/ventas")}
          >
            Volver a Ventas
          </Button>,
        ]}
      />
    );
  }

  return (
    <ConfigProvider theme={theme}>
      <Layout className="factura-layout">
        <Header
          className="factura-header"
          style={{
            background: "#fff",
            padding: "16px 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <Space>
                <ShopOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <Title level={3} style={{ margin: 0 }}>
                  Confirmar Venta
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/ventas")}
                >
                  Volver a Ventas
                </Button>
              </Space>
            </Col>
          </Row>
        </Header>

        <Content
          className="factura-content"
          style={{ padding: "24px", background: "#f0f2f5" }}
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          {exito && (
            <Alert
              message={exito}
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Steps current={currentStep} style={{ marginBottom: 24 }}>
            <Step title="Revisión" icon={<ShoppingCartOutlined />} />
            <Step title="Pago" icon={<CreditCardOutlined />} />
          </Steps>

          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>Procesando su solicitud...</div>
            </div>
          ) : (
            <>
              {currentStep === 0 && renderReviewStep()}
              {currentStep === 1 && renderPaymentStep()}
            </>
          )}

          {successModal}
        </Content>

        <Footer style={{ textAlign: "center", background: "#fff" }}>
          CIMOVE © {new Date().getFullYear()}
        </Footer>
      </Layout>

      <style jsx global>{`
        .factura-layout {
          min-height: 100vh;
        }

        .factura-content {
          padding: 24px;
          background: #f0f2f5;
        }

        .inner-card {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          border-radius: 8px;
        }

        .review-card,
        .payment-card {
          background: transparent;
        }

        .ant-statistic-title {
          font-size: 14px;
        }

        .ant-statistic-content {
          font-size: 20px;
        }

        .ant-table-thead > tr > th {
          background: #f7f7f7;
        }

        .ant-steps-item-process .ant-steps-item-icon {
          background: #1890ff;
          border-color: #1890ff;
        }

        .ant-picker-calendar-header {
          padding: 12px;
        }

        .ant-picker-cell-in-view.ant-picker-cell-selected
          .ant-picker-cell-inner {
          background: #1890ff;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default FacturaVenta;
