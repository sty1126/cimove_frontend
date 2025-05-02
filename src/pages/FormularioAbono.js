"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Form,
  Button,
  message,
  DatePicker,
  Typography,
  Card,
  Statistic,
  InputNumber,
  Space,
  Divider,
  Row,
  Col,
  Skeleton,
  Alert,
  Badge,
  Progress,
  Tooltip,
  Tag,
} from "antd"
import {
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  BankOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons"
import axios from "axios"
import dayjs from "dayjs"

const { Text, Title, Paragraph } = Typography

// Paleta de colores personalizada
const colors = {
  primary: "#0D7F93", // Teal más vibrante
  secondary: "#4D8A52", // Verde más vibrante
  accent: "#7FBAD6", // Azul más vibrante
  light: "#C3D3C6", // Verde menta claro
  background: "#FFFFFF", // Fondo blanco (cambiado)
  text: "#2A3033", // Texto oscuro
  success: "#4D8A52", // Verde más vibrante para éxito
  warning: "#E0A458", // Naranja apagado para advertencias
  danger: "#C25F48", // Rojo más vibrante para peligro
}

const FormularioAbono = () => {
  const { idFactura } = useParams()
  const navigate = useNavigate()
  const [factura, setFactura] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()
  const [abonos, setAbonos] = useState([])

  // Formatear valores en pesos colombianos
  const formatCOP = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0)
  }

  // Calcular saldo pendiente en tiempo real
  const calcularSaldoPendiente = () => {
    if (!factura) return 0
    const montoTotal = Number.parseFloat(factura.monto_facturaproveedor) || 0
    const totalAbonado = Number.parseFloat(factura.total_abonado) || 0
    return montoTotal - totalAbonado
  }

  // Calcular porcentaje pagado
  const calcularPorcentajePagado = () => {
    if (!factura) return 0
    const montoTotal = Number.parseFloat(factura.monto_facturaproveedor) || 0
    if (montoTotal === 0) return 0
    const totalAbonado = Number.parseFloat(factura.total_abonado) || 0
    return Math.min(Math.round((totalAbonado / montoTotal) * 100), 100)
  }

  // Obtener datos actualizados de la factura
  const fetchFactura = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`https://cimove-backend.onrender.com/api/facturas-proveedor/${idFactura}`)

      const facturaData = response.data

      // Obtener abonos de la factura
      const abonosRes = await axios.get(`https://cimove-backend.onrender.com/api/abonos/factura/${idFactura}`)

      const abonosData = abonosRes.data || []
      setAbonos(abonosData)

      // Calcular total abonado
      const totalAbonado = abonosData.reduce((sum, abono) => sum + (Number(abono.monto_abonofactura) || 0), 0)

      setFactura({ ...facturaData, total_abonado: totalAbonado })
    } catch (error) {
      message.error("Error al cargar la factura")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    fetchFactura()
  }, [idFactura])

  // Manejar envío del abono
  const registrarAbono = async (values) => {
    setSubmitting(true)
    try {
      // Asegurarse de que el monto sea un número válido
      const montoAbono = Number(values.monto)

      if (isNaN(montoAbono) || montoAbono <= 0) {
        throw new Error("El monto del abono debe ser un número positivo")
      }

      console.log("Enviando abono:", {
        id_facturaproveedor_abonofactura: idFactura,
        fecha_abonofactura: values.fecha.format("YYYY-MM-DD"),
        monto_abonofactura: montoAbono,
      })

      await axios.post("https://cimove-backend.onrender.com/api/abonos", {
        id_facturaproveedor_abonofactura: idFactura,
        fecha_abonofactura: values.fecha.format("YYYY-MM-DD"),
        monto_abonofactura: montoAbono,
      })

      message.success({
        content: "Abono registrado exitosamente",
        icon: <CheckCircleOutlined style={{ color: colors.success }} />,
      })
      form.resetFields()
      await fetchFactura() // Actualizar datos incluyendo el nuevo abono

      // Redireccionar a la página de facturación de proveedores
      setTimeout(() => {
        navigate("/facturacion-proveedor")
      }, 1000) // Pequeño retraso para que el usuario vea el mensaje de éxito
    } catch (error) {
      console.error("Error al registrar abono:", error)
      message.error({
        content: error.response?.data?.message || "Error al registrar abono",
        icon: <ExclamationCircleOutlined style={{ color: colors.danger }} />,
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Validar que solo se ingresen números en el campo de monto
  const validateNumberOnly = (e) => {
    // Permitir solo teclas numéricas, teclas de navegación y teclas de control
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]

    if (!allowedKeys.includes(e.key)) {
      e.preventDefault()
      message.warning("Solo se permiten números en este campo")
    }
  }

  const saldoPendiente = calcularSaldoPendiente()
  const isPagado = saldoPendiente <= 0
  const porcentajePagado = calcularPorcentajePagado()

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "100%",
        background: colors.background, // Fondo blanco
        minHeight: "100vh",
      }}
    >
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/facturacion-proveedor")}
        style={{ marginBottom: "16px" }}
      >
        Volver a Facturación
      </Button>

      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <CreditCardOutlined style={{ fontSize: "28px", color: "white" }} />
            <Title level={3} style={{ margin: 0, color: "white" }}>
              Registrar Abono
            </Title>
            <Badge
              count={`Factura #${idFactura}`}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                fontSize: "14px",
                padding: "0 10px",
                borderRadius: "12px",
              }}
            />
          </div>
        }
        loading={loading}
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "12px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
        headStyle={{
          background: colors.primary, // Color sólido en lugar de gradiente
          color: "white",
          borderBottom: "none",
          padding: "16px 24px",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : factura ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div
              style={{
                background: "#f9f9f9",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #eaeaea",
              }}
            >
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={16}>
                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileTextOutlined style={{ color: colors.primary }} />
                      <Text strong>Información de la Factura</Text>
                    </div>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Text type="secondary">Número de Factura:</Text>
                        <br />
                        <Text strong>{idFactura}</Text>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">Fecha:</Text>
                        <br />
                        <Text strong>
                          {factura.fecha_facturaproveedor
                            ? dayjs(factura.fecha_facturaproveedor).format("DD/MM/YYYY")
                            : "No disponible"}
                        </Text>
                      </Col>
                      {/* Se eliminó la información del proveedor */}
                      <Col span={12}>
                        <Text type="secondary">Estado:</Text>
                        <br />
                        <Tag color={isPagado ? "green" : "orange"} style={{ marginTop: "4px" }}>
                          {isPagado ? "PAGADO" : "PENDIENTE"}
                        </Tag>
                      </Col>
                    </Row>
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: "center" }}>
                    <Progress
                      type="circle"
                      percent={porcentajePagado}
                      format={(percent) => `${percent}%`}
                      strokeColor={{
                        "0%": colors.primary,
                        "100%": colors.success,
                      }}
                      strokeWidth={10}
                      width={120}
                    />
                    <Paragraph style={{ marginTop: "8px" }}>
                      <Text strong>Porcentaje Pagado</Text>
                    </Paragraph>
                  </div>
                </Col>
              </Row>
            </div>

            <Row gutter={[16, 24]} style={{ marginTop: "16px" }}>
              <Col xs={24} sm={8}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: "8px",
                    borderTop: `3px solid ${colors.text}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  bodyStyle={{ padding: "16px" }}
                >
                  <Statistic
                    title={
                      <Tooltip title="Valor total de la factura">
                        <Text strong style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <DollarOutlined />
                          Valor Total
                        </Text>
                      </Tooltip>
                    }
                    value={factura.monto_facturaproveedor}
                    precision={0}
                    formatter={(val) => formatCOP(val)}
                    valueStyle={{ color: colors.text, fontSize: "20px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: "8px",
                    borderTop: `3px solid ${colors.success}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  bodyStyle={{ padding: "16px" }}
                >
                  <Statistic
                    title={
                      <Tooltip title="Total abonado hasta la fecha">
                        <Text strong style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <CheckCircleOutlined />
                          Total Abonado
                        </Text>
                      </Tooltip>
                    }
                    value={factura.total_abonado || 0}
                    precision={0}
                    formatter={(val) => formatCOP(val)}
                    valueStyle={{ color: colors.success, fontSize: "20px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: "8px",
                    borderTop: `3px solid ${isPagado ? colors.success : colors.danger}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  bodyStyle={{ padding: "16px" }}
                >
                  <Statistic
                    title={
                      <Tooltip title="Saldo pendiente por pagar">
                        <Text strong style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                          {isPagado ? <CheckCircleOutlined /> : <ArrowDownOutlined />}
                          Saldo Pendiente
                        </Text>
                      </Tooltip>
                    }
                    value={saldoPendiente}
                    precision={0}
                    formatter={(val) => formatCOP(val)}
                    valueStyle={{
                      color: isPagado ? colors.success : colors.danger,
                      fontWeight: 600,
                      fontSize: "20px",
                    }}
                  />
                </Card>
              </Col>
            </Row>

            {isPagado && (
              <Alert
                message="Factura Pagada en su Totalidad"
                description="Esta factura ya ha sido pagada completamente. No se requieren más abonos."
                type="success"
                showIcon
                icon={<CheckCircleOutlined style={{ fontSize: "24px" }} />}
                style={{
                  marginBottom: "16px",
                  borderRadius: "8px",
                  border: `1px solid ${colors.success}25`,
                }}
              />
            )}

            {abonos.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <Divider orientation="left">
                  <Space>
                    <HistoryOutlined />
                    <span>Historial de Abonos</span>
                    <Badge count={abonos.length} style={{ backgroundColor: colors.primary }} />
                  </Space>
                </Divider>

                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    padding: "8px",
                    background: "#f9f9f9",
                    borderRadius: "8px",
                    border: "1px solid #eaeaea",
                  }}
                >
                  {abonos.map((abono, index) => (
                    <Card
                      key={index}
                      size="small"
                      style={{
                        marginBottom: "8px",
                        borderLeft: `4px solid ${colors.primary}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space>
                          <BankOutlined style={{ color: colors.primary }} />
                          <div>
                            <Text strong>{formatCOP(abono.monto_abonofactura)}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {dayjs(abono.fecha_abonofactura).format("DD/MM/YYYY")}
                            </Text>
                          </div>
                        </Space>
                        <Tag color={colors.primary}>Abono #{index + 1}</Tag>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Divider style={{ margin: "24px 0", borderColor: colors.light }} />

            <div
              style={{
                background: "#f9f9f9",
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid #eaeaea",
              }}
            >
              <Title
                level={4}
                style={{ marginTop: 0, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <DollarOutlined style={{ color: colors.primary }} />
                Registrar Nuevo Abono
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={registrarAbono}
                initialValues={{ fecha: dayjs() }}
                disabled={isPagado}
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="monto"
                      label={
                        <Text strong>
                          <DollarOutlined style={{ marginRight: "8px", color: colors.primary }} />
                          Valor del Abono (COP)
                        </Text>
                      }
                      rules={[
                        { required: true, message: "Ingrese el valor del abono" },
                        { type: "number", min: 1, message: "Mínimo $1 COP" },
                        () => ({
                          validator(_, value) {
                            if (!value || value <= saldoPendiente) {
                              return Promise.resolve()
                            }
                            return Promise.reject("El abono no puede exceder el saldo pendiente")
                          },
                        }),
                      ]}
                      tooltip="El valor no puede exceder el saldo pendiente"
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        max={saldoPendiente}
                        precision={0}
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        parser={(value) => {
                          // Eliminar cualquier carácter que no sea un dígito
                          const parsed = value ? value.toString().replace(/[^\d]/g, "") : ""
                          return parsed ? Number.parseInt(parsed, 10) : ""
                        }}
                        onChange={(value) => {
                          // Si el valor excede el saldo pendiente, establecerlo al saldo pendiente
                          if (value > saldoPendiente) {
                            form.setFieldsValue({ monto: saldoPendiente })
                            message.warning("El monto no puede ser mayor al saldo pendiente")
                          }
                        }}
                        onKeyDown={validateNumberOnly}
                        disabled={isPagado}
                        size="large"
                        placeholder="Ingrese el monto a abonar"
                        controls={true}
                        addonAfter="COP"
                        keyboard={false} // Deshabilita la entrada de teclado no numérica
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="fecha"
                      label={
                        <Text strong>
                          <CalendarOutlined style={{ marginRight: "8px", color: colors.primary }} />
                          Fecha del Abono
                        </Text>
                      }
                      rules={[{ required: true, message: "Seleccione la fecha del abono" }]}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        disabledDate={(current) => current > dayjs().endOf("day")}
                        size="large"
                        disabled={isPagado}
                        placeholder="Seleccione una fecha"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginTop: "24px", marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={isPagado}
                    size="large"
                    style={{
                      height: "50px",
                      fontSize: "16px",
                      width: "100%",
                      maxWidth: "400px",
                      margin: "0 auto",
                      display: "block",
                      background: isPagado ? colors.success : colors.primary, // Color sólido en lugar de gradiente
                      borderColor: isPagado ? colors.success : colors.primary,
                      borderRadius: "8px",
                    }}
                    icon={isPagado ? <CheckCircleOutlined /> : <DollarOutlined />}
                  >
                    {isPagado ? "FACTURA PAGADA EN SU TOTALIDAD" : "REGISTRAR ABONO"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Space>
        ) : (
          <Alert
            message="Error al cargar la factura"
            description="No se pudo cargar la información de la factura. Por favor, intente nuevamente."
            type="error"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate("/facturacion-proveedor")}>
                Volver
              </Button>
            }
          />
        )}
      </Card>
    </div>
  )
}

export default FormularioAbono
