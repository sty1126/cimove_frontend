"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "antd";
import {
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Text, Title } = Typography;

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

const FormularioAbono = () => {
  const { idFactura } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Formatear valores en pesos colombianos
  const formatCOP = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // Calcular saldo pendiente en tiempo real
  const calcularSaldoPendiente = () => {
    if (!factura) return 0;
    const montoTotal = Number.parseFloat(factura.monto_facturaproveedor) || 0;
    const totalAbonado = Number.parseFloat(factura.total_abonado) || 0;
    return montoTotal - totalAbonado;
  };

  // Obtener datos actualizados de la factura
  const fetchFactura = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://cimove-backend.onrender.com/api/facturas-proveedor/${idFactura}`
      );
      setFactura(response.data);
    } catch (error) {
      message.error("Error al cargar la factura");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchFactura();
  }, [idFactura]);

  // Manejar envío del abono
  const registrarAbono = async (values) => {
    setSubmitting(true);
    try {
      // Asegurarse de que el monto sea un número válido
      const montoAbono = Number(values.monto);

      if (isNaN(montoAbono) || montoAbono <= 0) {
        throw new Error("El monto del abono debe ser un número positivo");
      }

      console.log("Enviando abono:", {
        id_facturaproveedor_abonofactura: idFactura,
        fecha_abonofactura: values.fecha.format("YYYY-MM-DD"),
        monto_abonofactura: montoAbono,
      });

      await axios.post("https://cimove-backend.onrender.com/api/abonos", {
        id_facturaproveedor_abonofactura: idFactura,
        fecha_abonofactura: values.fecha.format("YYYY-MM-DD"),
        monto_abonofactura: montoAbono,
      });

      message.success({
        content: "Abono registrado exitosamente",
        icon: <CheckCircleOutlined style={{ color: colors.success }} />,
      });
      form.resetFields();
      await fetchFactura(); // Actualizar datos incluyendo el nuevo abono

      // Redireccionar a la página de facturación de proveedores
      setTimeout(() => {
        navigate("/facturacion-proveedor");
      }, 1000); // Pequeño retraso para que el usuario vea el mensaje de éxito
    } catch (error) {
      console.error("Error al registrar abono:", error);
      message.error({
        content: error.response?.data?.message || "Error al registrar abono",
        icon: <ExclamationCircleOutlined style={{ color: colors.danger }} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const saldoPendiente = calcularSaldoPendiente();
  const isPagado = saldoPendiente <= 0;

  return (
    <div style={{ padding: "10px", maxWidth: "100%" }}>
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <CreditCardOutlined
              style={{ fontSize: "24px", color: colors.primary }}
            />
            <Title level={4} style={{ margin: 0 }}>
              Registrar Abono
            </Title>
            <Badge
              count={`Factura #${idFactura}`}
              style={{ backgroundColor: colors.accent }}
            />
          </div>
        }
        loading={loading}
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: "20px" }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : factura ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row gutter={[16, 24]}>
              <Col xs={24} sm={8}>
                <Statistic
                  title={<Text strong>Valor Total Factura</Text>}
                  value={factura.monto_facturaproveedor}
                  precision={0}
                  formatter={(val) => formatCOP(val)}
                  valueStyle={{ color: colors.text }}
                  prefix={<DollarOutlined />}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title={<Text strong>Total Abonado</Text>}
                  value={factura.total_abonado || 0}
                  precision={0}
                  formatter={(val) => formatCOP(val)}
                  valueStyle={{ color: colors.success }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title={<Text strong>Saldo Pendiente</Text>}
                  value={saldoPendiente}
                  precision={0}
                  formatter={(val) => formatCOP(val)}
                  valueStyle={{
                    color: isPagado ? colors.success : colors.danger,
                    fontWeight: 600,
                  }}
                  prefix={
                    isPagado ? <CheckCircleOutlined /> : <ArrowDownOutlined />
                  }
                />
              </Col>
            </Row>

            {isPagado && (
              <Alert
                message="Factura Pagada"
                description="Esta factura ya ha sido pagada en su totalidad."
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                style={{ marginBottom: "16px" }}
              />
            )}

            <Divider style={{ margin: "16px 0", borderColor: colors.light }} />

            <Form
              form={form}
              layout="vertical"
              onFinish={registrarAbono}
              initialValues={{ fecha: dayjs() }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="monto"
                    label={
                      <Text strong>
                        <DollarOutlined
                          style={{ marginRight: "8px", color: colors.primary }}
                        />
                        Valor del Abono (COP)
                      </Text>
                    }
                    rules={[
                      { required: true, message: "Ingrese el valor del abono" },
                      { type: "number", min: 1, message: "Mínimo $1 COP" },
                      () => ({
                        validator(_, value) {
                          if (!value || value <= saldoPendiente) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "El abono no puede exceder el saldo pendiente"
                          );
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
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                      }
                      parser={(value) => {
                        const parsed = value.replace(/\$\s?|(\.*)/g, "");
                        // Solo permitir dígitos
                        return parsed.replace(/[^\d]/g, "");
                      }}
                      onChange={(value) => {
                        // If value exceeds saldoPendiente, set it to saldoPendiente
                        if (value > saldoPendiente) {
                          form.setFieldsValue({ monto: saldoPendiente });
                          message.warning(
                            "El monto no puede ser mayor al saldo pendiente"
                          );
                        }
                      }}
                      disabled={isPagado}
                      size="large"
                      placeholder="Ingrese el monto a abonar"
                      controls={true}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fecha"
                    label={
                      <Text strong>
                        <CalendarOutlined
                          style={{ marginRight: "8px", color: colors.primary }}
                        />
                        Fecha del Abono
                      </Text>
                    }
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

              <Form.Item style={{ marginTop: "16px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  disabled={isPagado}
                  block
                  size="large"
                  style={{
                    height: "48px",
                    fontSize: "16px",
                    backgroundColor: isPagado ? colors.success : colors.primary,
                    borderColor: isPagado ? colors.success : colors.primary,
                  }}
                  icon={isPagado ? <CheckCircleOutlined /> : <DollarOutlined />}
                >
                  {isPagado
                    ? "FACTURA PAGADA EN SU TOTALIDAD"
                    : "REGISTRAR ABONO"}
                </Button>
              </Form.Item>
            </Form>
          </Space>
        ) : (
          <Alert
            message="Error al cargar la factura"
            description="No se pudo cargar la información de la factura. Por favor, intente nuevamente."
            type="error"
            showIcon
          />
        )}
      </Card>
    </div>
  );
};

export default FormularioAbono;
