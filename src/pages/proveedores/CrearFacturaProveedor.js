"use client";

import { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Button,
  DatePicker,
  message,
  Select,
  Table,
  Card,
  Typography,
  Divider,
  Space,
  Spin,
  Badge,
  Tooltip,
  Alert,
} from "antd";
import {
  obtenerOrdenesCompra,
  obtenerProductosDeOrden,
  registrarFacturaProveedor,
} from "../../services/proveedoresService";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  FileTextOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const CrearFacturaProveedor = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [fechaFactura, setFechaFactura] = useState(dayjs());
  const [totalFactura, setTotalFactura] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  useEffect(() => {
    const fetchOrdenes = async () => {
      setFetchingData(true);
      try {
        const res = await obtenerOrdenesCompra();
        setOrdenes(res);
      } catch (error) {
        message.error("Error al cargar las órdenes de compra");
        console.error(error);
      } finally {
        setFetchingData(false);
      }
    };
    fetchOrdenes();
  }, []);

  const handleOrdenSelect = async (id_ordencompra) => {
    setSelectedOrden(id_ordencompra);
    setFetchingData(true);
    try {
      const res = await obtenerProductosDeOrden(id_ordencompra);
      const productosConSubtotal = res.map((p) => ({
        id_producto: p.id_producto,
        nombre_producto: p.nombre_producto,
        cantidad_ordenada: p.cantidad_ordenada,
        precio_unitario: p.preciounitario_detalleordencompra,
        subtotal: p.cantidad_ordenada * p.preciounitario_detalleordencompra,
        cantidad_maxima: p.cantidad_ordenada,
      }));
      setProductos(productosConSubtotal);
      calcularTotal(productosConSubtotal);
      setValidationErrors([]);
    } catch (error) {
      message.error("Error al cargar los productos de la orden");
      console.error(error);
    } finally {
      setFetchingData(false);
    }
  };

  const calcularTotal = (productosActualizados) => {
    const total = productosActualizados.reduce((sum, p) => sum + p.subtotal, 0);
    setTotalFactura(total);
  };

  const handleProductoChange = (value, record, field) => {
    // Validar que el valor sea un número
    if (value === null || isNaN(value)) {
      message.warning("Por favor ingrese un valor numérico válido");
      return;
    }

    // Validar que la cantidad no exceda el máximo permitido
    if (field === "cantidad_ordenada" && value > record.cantidad_maxima) {
      message.warning(`La cantidad no puede exceder ${record.cantidad_maxima}`);
      value = record.cantidad_maxima;
    }

    // Asegurar que el valor sea un entero positivo para cantidad
    if (field === "cantidad_ordenada") {
      value = Math.max(1, Math.floor(value));
    }

    const nuevosProductos = productos.map((p) => {
      if (p.id_producto === record.id_producto) {
        const actualizado = {
          ...p,
          [field]: value,
        };
        actualizado.subtotal =
          (field === "cantidad_ordenada" ? value : p.cantidad_ordenada) *
          (field === "precio_unitario" ? value : p.precio_unitario);
        return actualizado;
      }
      return p;
    });

    console.log("Updated productos:", nuevosProductos);
    setProductos(nuevosProductos);
    calcularTotal(nuevosProductos);
    validateProductos(nuevosProductos);
  };

  // Función para validar todos los productos
  const validateProductos = (productosActuales) => {
    const errores = [];

    productosActuales.forEach((producto) => {
      if (!producto.cantidad_ordenada || producto.cantidad_ordenada <= 0) {
        errores.push(
          `El producto "${producto.nombre_producto}" debe tener una cantidad mayor a cero`
        );
      }

      if (!producto.precio_unitario || producto.precio_unitario <= 0) {
        errores.push(
          `El producto "${producto.nombre_producto}" debe tener un precio unitario válido`
        );
      }
    });

    setValidationErrors(errores);
    return errores.length === 0;
  };

  const validateForm = () => {
    // Validar que haya una orden seleccionada
    if (!selectedOrden) {
      message.error("Debe seleccionar una orden de compra");
      return false;
    }

    // Validar que haya una fecha de factura
    if (!fechaFactura) {
      message.error("Debe seleccionar una fecha de factura");
      return false;
    }

    // Validar que haya productos y que sean válidos
    if (productos.length === 0) {
      message.error("No hay productos para facturar");
      return false;
    }

    return validateProductos(productos);
  };

  const handleFinish = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const dataToSend = {
        id_ordencompra: selectedOrden,
        fecha_facturaproveedor: fechaFactura.format("YYYY-MM-DD"),
        monto_facturaproveedor: totalFactura,
        productos: productos.map((p) => ({
          id_producto: p.id_producto,
          cantidad_detalle: p.cantidad_ordenada,
          preciounitario_detalle: p.precio_unitario,
          subtotal_detalle: p.subtotal,
        })),
      };

      await registrarFacturaProveedor(dataToSend);

      message.success({
        content: "Factura registrada correctamente",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });

      navigate("/facturacion-proveedor");
    } catch (error) {
      console.error("Error al registrar la factura", error);
      message.error({
        content: "Error al registrar la factura",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Producto",
      dataIndex: "nombre_producto",
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad_ordenada",
      render: (text, record) => (
        <InputNumber
          min={1}
          max={record.cantidad_maxima}
          value={record.cantidad_ordenada}
          onChange={(value) =>
            handleProductoChange(value, record, "cantidad_ordenada")
          }
          style={{ width: "100%" }}
          size="middle"
          controls
          precision={0} // Solo números enteros
          parser={(value) => {
            // Asegurar que solo se acepten números enteros positivos
            const parsed = Number.parseInt(value || "0", 10);
            if (isNaN(parsed)) return 1;
            return parsed;
          }}
        />
      ),
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio_unitario",
      render: (text, record) => (
        <InputNumber
          min={0}
          value={record.precio_unitario}
          disabled={true}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          style={{ width: "100%" }}
          size="middle"
        />
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      render: (text) => (
        <Text strong style={{ color: "#1890ff" }}>
          $ {text.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "100%",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              Crear movimiento financiero de Proveedor
            </Title>
          </Space>
        }
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
        headStyle={{
          background: "#fafafa",
          borderBottom: "1px solid #f0f0f0",
          padding: "16px 24px",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark="optional"
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <Form.Item
                label={
                  <Space>
                    <ShoppingCartOutlined />
                    <span>Orden de Compra</span>
                  </Space>
                }
                name="id_ordencompra"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione una orden de compra",
                  },
                ]}
                style={{ flex: "1", minWidth: "300px" }}
              >
                <Select
                  placeholder="Selecciona una orden"
                  onChange={handleOrdenSelect}
                  options={ordenes.map((orden) => ({
                    label: `OC-${orden.id_ordencompra} | ${
                      orden.nombre_proveedor
                    } | ${dayjs(orden.fecha_ordencompra).format("DD/MM/YYYY")}`,
                    value: orden.id_ordencompra,
                  }))}
                  style={{ width: "100%" }}
                  loading={fetchingData}
                  size="large"
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <CalendarOutlined />
                    <span>Fecha de movimiento financiero</span>
                  </Space>
                }
                name="fecha_facturaproveedor"
                initialValue={fechaFactura}
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione una fecha del movimiento financiero",
                  },
                ]}
                style={{ flex: "1", minWidth: "200px" }}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  value={fechaFactura}
                  onChange={(date) => setFechaFactura(date)}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </div>

            {fetchingData && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "40px",
                }}
              >
                <Spin size="large" tip="Cargando datos..." />
              </div>
            )}

            {validationErrors.length > 0 && (
              <Alert
                message="Hay errores en el formulario"
                description={
                  <ul style={{ paddingLeft: "20px", margin: "10px 0 0 0" }}>
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                }
                type="warning"
                showIcon
                icon={<ExclamationCircleOutlined />}
                style={{ marginBottom: "16px" }}
              />
            )}

            {productos.length > 0 && !fetchingData && (
              <>
                <Divider orientation="left">
                  <Space>
                    <DollarOutlined />
                    <span>Detalle de Productos</span>
                    <Badge
                      count={productos.length}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  </Space>
                </Divider>

                <div
                  style={{
                    overflowX: "auto",
                    borderRadius: "8px",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <Table
                    dataSource={productos}
                    columns={columns}
                    rowKey="id_producto"
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    size="middle"
                    style={{ marginBottom: "0" }}
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    }
                    summary={() => (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell
                            index={0}
                            colSpan={3}
                            style={{ textAlign: "right" }}
                          >
                            <Text strong>Total:</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text
                              strong
                              style={{ fontSize: "16px", color: "#1890ff" }}
                            >
                              ${" "}
                              {totalFactura
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                </div>

                <div style={{ marginTop: "16px" }}>
                  <Space align="center">
                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    <Text type="secondary">
                      Nota: El campo de cantidad solo acepta números enteros
                      positivos.
                    </Text>
                  </Space>
                </div>
              </>
            )}

            <Form.Item style={{ marginTop: "24px" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  height: "48px",
                  fontSize: "16px",
                  width: "100%",
                  maxWidth: "300px",
                  borderRadius: "6px",
                }}
                disabled={productos.length === 0 || validationErrors.length > 0}
                icon={<CheckCircleOutlined />}
              >
                Registrar movimiento
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>

      <style jsx global>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #fafafa;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f7ff;
          color: #1890ff;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default CrearFacturaProveedor;
