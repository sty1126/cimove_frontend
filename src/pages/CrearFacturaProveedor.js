import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Button,
  DatePicker,
  message,
  Select,
  Table,
  Card,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const CrearFacturaProveedor = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fechaFactura, setFechaFactura] = useState(dayjs());
  const [totalFactura, setTotalFactura] = useState(0);

  useEffect(() => {
    const fetchOrdenes = async () => {
      const res = await axios.get("https://cimove-backend.onrender.com/api/ordenes");
      setOrdenes(res.data);
    };
    fetchOrdenes();
  }, []);

  const handleOrdenSelect = async (id_ordencompra) => {
    setSelectedOrden(id_ordencompra);
    const res = await axios.get(
      `https://cimove-backend.onrender.com/api/facturas-proveedor/facturas/orden/${id_ordencompra}`
    );
    const productosConSubtotal = res.data.map((p) => ({
      ...p,
      cantidad: p.cantidad_ordenada,
      precio_unitario: p.preciounitario_detalleordencompra,
      subtotal: p.cantidad_ordenada * p.preciounitario_detalleordencompra,
    }));
    setProductos(productosConSubtotal);
    calcularTotal(productosConSubtotal);
  };

  const calcularTotal = (productosActualizados) => {
    const total = productosActualizados.reduce((sum, p) => sum + p.subtotal, 0);
    setTotalFactura(total);
  };

  const handleProductoChange = (value, record, field) => {
    const nuevosProductos = productos.map((p) => {
      if (p.id_producto === record.id_producto) {
        const actualizado = {
          ...p,
          [field]: value,
        };
        actualizado.subtotal =
          (field === "cantidad" ? value : p.cantidad) *
          (field === "precio_unitario" ? value : p.precio_unitario);
        return actualizado;
      }
      return p;
    });
    setProductos(nuevosProductos);
    calcularTotal(nuevosProductos);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://cimove-backend.onrender.com/api/facturas-proveedor/generar-desde-orden",
        {
          id_ordencompra: selectedOrden,
          productos: productos.map((p) => ({
            id_producto: p.id_producto,
            cantidad: p.cantidad,
            precio_unitario: p.precio_unitario,
          })),
        }
      );

      message.success("Factura registrada correctamente");
      navigate("/facturacion-proveedor");
    } catch (error) {
      console.error("Error al registrar la factura", error);
      console.log(error);
      message.error("Error al registrar la factura");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Producto",
      dataIndex: "nombre_producto",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      render: (text, record) => (
        <InputNumber
          min={1}
          value={record.cantidad}
          onChange={(value) =>
            handleProductoChange(value, record, "cantidad")
          }
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
          onChange={(value) =>
            handleProductoChange(value, record, "precio_unitario")
          }
        />
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      render: (text) => `$ ${text.toFixed(2)}`,
    },
  ];

  return (
    <Card title="Crear Factura de Proveedor">
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Orden de Compra" name="id_ordencompra" rules={[{ required: true }]}>
          <Select
            placeholder="Selecciona una orden"
            onChange={handleOrdenSelect}
            options={ordenes.map((orden) => ({
              label: `OC-${orden.id_ordencompra} | ${orden.nombre_proveedor} | ${dayjs(orden.fecha_ordencompra).format("DD/MM/YYYY")}`,
              value: orden.id_ordencompra,
            }))}
          />
        </Form.Item>

        <Form.Item label="Fecha de Factura" name="fecha_facturaproveedor" initialValue={fechaFactura}>
          <DatePicker
            format="YYYY-MM-DD"
            value={fechaFactura}
            onChange={(date) => setFechaFactura(date)}
          />
        </Form.Item>

        {productos.length > 0 && (
          <>
            <Table
              dataSource={productos}
              columns={columns}
              rowKey="id_producto"
              pagination={false}
            />
            <h3 style={{ textAlign: "right", marginTop: "1rem" }}>
              Total: ${totalFactura.toFixed(2)}
            </h3>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Registrar Factura
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CrearFacturaProveedor;
