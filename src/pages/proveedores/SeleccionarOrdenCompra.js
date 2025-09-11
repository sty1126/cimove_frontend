"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  Input,
  Space,
  Typography,
  Tag,
  Spin,
  message,
  Empty,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

// API Routes - Acomodar según sea necesario
// GET /api/ordenes-compra - Obtener todas las órdenes de compra
// GET /api/ordenes-compra/proveedor/:id - Obtener órdenes por proveedor

const ModalSeleccionarOrden = ({
  visible,
  onClose,
  onSelect,
  proveedorId = null,
}) => {
  const [ordenes, setOrdenes] = useState([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (visible) {
      fetchOrdenes();
    }
  }, [visible, proveedorId]);

  const fetchOrdenes = async () => {
    setLoading(true);
    try {
      // Aquí va la llamada a la API
      const url = proveedorId
        ? `/api/ordenes-compra/proveedor/${proveedorId}`
        : "/api/ordenes-compra";

      // const response = await fetch(url);
      // const data = await response.json();
      // setOrdenes(data);
      // setFilteredOrdenes(data);

      // Temporal - remover cuando se conecte la API
      setOrdenes([]);
      setFilteredOrdenes([]);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      message.error("Error al cargar las órdenes de compra");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = ordenes.filter(
      (orden) =>
        orden.numero_orden?.toLowerCase().includes(value.toLowerCase()) ||
        orden.nombre_proveedor?.toLowerCase().includes(value.toLowerCase()) ||
        orden.estado_orden?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrdenes(filtered);
  };

  const handleSelect = (orden) => {
    onSelect(orden);
    onClose();
  };

  const columns = [
    {
      title: "Número de Orden",
      dataIndex: "numero_orden",
      key: "numero_orden",
      render: (text) => (
        <Space>
          <ShoppingCartOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Proveedor",
      dataIndex: "nombre_proveedor",
      key: "nombre_proveedor",
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: "#52c41a" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "fecha_orden",
      key: "fecha_orden",
      render: (text) => (
        <Space>
          <CalendarOutlined style={{ color: "#faad14" }} />
          <Text>{dayjs(text).format("DD/MM/YYYY")}</Text>
        </Space>
      ),
    },
    {
      title: "Total",
      dataIndex: "total_orden",
      key: "total_orden",
      render: (text) => (
        <Space>
          <DollarOutlined style={{ color: "#13c2c2" }} />
          <Text strong>${text?.toFixed(2)}</Text>
        </Space>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado_orden",
      key: "estado_orden",
      render: (estado) => {
        let color = "default";
        if (estado === "PENDIENTE") color = "orange";
        if (estado === "COMPLETADA") color = "green";
        if (estado === "CANCELADA") color = "red";

        return <Tag color={color}>{estado}</Tag>;
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleSelect(record)}
        >
          Seleccionar
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <ShoppingCartOutlined />
          <span>Seleccionar Orden de Compra</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Input
          placeholder="Buscar por número de orden, proveedor o estado..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
      </Space>

      <Spin spinning={loading}>
        {filteredOrdenes.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredOrdenes}
            rowKey="id_orden"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true,
            }}
            scroll={{ x: 800 }}
          />
        ) : (
          <Empty
            description="No hay órdenes de compra disponibles"
            style={{ margin: "40px 0" }}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default ModalSeleccionarOrden;
