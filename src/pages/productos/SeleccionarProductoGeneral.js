"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Table,
  Button,
  Space,
  Typography,
  Empty,
  Spin,
  Tag,
  Tooltip,
  Divider,
} from "antd";
import { message } from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  ShoppingOutlined,
  DollarOutlined,
  InboxOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { obtenerTodosLosProductos } from "../../services/productosService";

const { Text, Title } = Typography;

// Paleta de colores personalizada
const colors = {
  primary: "#0D7F93",
  secondary: "#4D8A52",
  accent: "#7FBAD6",
  light: "#C3D3C6",
  background: "#E8EAEC",
  text: "#2A3033",
  success: "#4D8A52",
  warning: "#E0A458",
  danger: "#C25F48",
};

const SeleccionarProductoGeneral = ({ show, handleClose, setProducto }) => {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar productos cuando se muestra el modal
  useEffect(() => {
    const fetchProductos = async () => {
      if (!show) return;

      setLoading(true);
      try {
        const data = await obtenerTodosLosProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos", error);
        message.error("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [show]);

  const productosFiltrados = productos.filter((p) => {
    const nombre = p.nombre_producto?.toLowerCase() || "";
    const id = p.id_producto?.toString() || "";
    return nombre.includes(search.toLowerCase()) || id.includes(search);
  });

  const handleSelect = (producto) => {
    console.log("Producto seleccionado:", producto);
    setProducto(producto);
    handleClose();
  };

  const verDetalles = (productoId) => {
    window.open(`/detalles-producto/${productoId}`, "_blank");
  };

  const columns = [
    {
      title: (
        <Space>
          <IdcardOutlined style={{ color: colors.primary }} />
          ID
        </Space>
      ),
      dataIndex: "id_producto",
      key: "id_producto",
      width: 80,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          {id}
        </Text>
      ),
    },
    {
      title: (
        <Space>
          <ShoppingOutlined style={{ color: colors.primary }} />
          Nombre
        </Space>
      ),
      dataIndex: "nombre_producto",
      key: "nombre_producto",
      render: (nombre, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{nombre || "Sin nombre"}</Text>
          {record.descripcion_producto && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.descripcion_producto.length > 50
                ? `${record.descripcion_producto.substring(0, 50)}...`
                : record.descripcion_producto}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: (
        <Space>
          <DollarOutlined style={{ color: colors.primary }} />
          Precio
        </Space>
      ),
      dataIndex: "precioventaact_producto",
      key: "precioventaact_producto",
      width: 120,
      render: (precio) => (
        <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
          ${Number(precio).toLocaleString("es-CO")}
        </Text>
      ),
    },
    {
      title: (
        <Space>
          <InboxOutlined style={{ color: colors.primary }} />
          Stock
        </Space>
      ),
      dataIndex: "stock_producto",
      key: "stock_producto",
      width: 80,
      render: (stock) => {
        let color = colors.success;
        if (stock <= 5) color = colors.danger;
        else if (stock <= 15) color = colors.warning;

        return (
          <Tag
            color={color}
            style={{
              borderRadius: "10px",
              fontWeight: "bold",
              textAlign: "center",
              minWidth: "40px",
            }}
          >
            {stock}
          </Tag>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Seleccionar producto">
            <Button
              type="primary"
              shape="circle"
              icon={<CheckCircleOutlined />}
              onClick={() => handleSelect(record)}
              style={{
                backgroundColor: colors.success,
                borderColor: colors.success,
              }}
            />
          </Tooltip>
          <Tooltip title="Ver detalles">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => verDetalles(record.id_producto)}
              style={{
                backgroundColor: colors.accent,
                borderColor: colors.accent,
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space align="center">
          <ShoppingOutlined
            style={{ color: colors.primary, fontSize: "20px" }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Seleccionar Producto
          </Title>
        </Space>
      }
      open={show}
      onCancel={handleClose}
      footer={null}
      width={800}
      centered
      bodyStyle={{ padding: "16px" }}
    >
      <Input
        placeholder="Buscar por código o nombre"
        prefix={<SearchOutlined style={{ color: colors.primary }} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "16px" }}
        allowClear
      />

      <Divider style={{ margin: "8px 0 16px", borderColor: colors.light }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" tip="Cargando productos..." />
        </div>
      ) : productosFiltrados.length > 0 ? (
        <Table
          columns={columns}
          dataSource={productosFiltrados}
          rowKey="id_producto"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `Total: ${total} productos`,
          }}
          size="middle"
          scroll={{ y: 300 }}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" align="center">
              <Text type="secondary">
                No hay productos disponibles en el inventario general
              </Text>
              {search && (
                <Button type="link" onClick={() => setSearch("")}>
                  Limpiar búsqueda
                </Button>
              )}
            </Space>
          }
          style={{ margin: "40px 0" }}
        />
      )}
    </Modal>
  );
};

export default SeleccionarProductoGeneral;
