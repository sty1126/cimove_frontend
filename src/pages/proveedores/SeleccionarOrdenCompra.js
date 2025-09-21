"use client";

import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tag, message, Modal } from "antd";
import { ReloadOutlined, EyeOutlined } from "@ant-design/icons";

export default function OrdenesCompraModal({ proveedorId, visible, onClose, onSelect }) {
  const [ordenes, setOrdenes] = useState([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);

  useEffect(() => {
    if (visible) fetchOrdenes();
  }, [proveedorId, visible]);

  // 🔹 Obtener órdenes de compra
  const fetchOrdenes = async () => {
    setLoading(true);
    try {
      const url = proveedorId
        ? `https://cimove-backend.onrender.com/api/proveedor/${proveedorId}`
        : "https://cimove-backend.onrender.com/api/ordenes";

      const response = await fetch(url);
      const data = await response.json();

      const mapped = data.map((orden) => ({
        id_orden: orden.id_ordencompra,
        numero_orden: `OC-${orden.id_ordencompra}`,
        fecha_orden: orden.fecha_ordencompra,
        total_orden: orden.total_ordencompra,
        estado_orden:
          orden.estado_facturaproveedor === "A"
            ? "PENDIENTE"
            : orden.estado_facturaproveedor,
        nombre_proveedor: orden.nombre_proveedor,
        detalles: orden.detalles || [],
      }));

      setOrdenes(mapped);
      setFilteredOrdenes(mapped);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      message.error("Error al cargar las órdenes de compra");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar por número o proveedor
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = ordenes.filter(
      (orden) =>
        orden.numero_orden.toLowerCase().includes(value.toLowerCase()) ||
        orden.nombre_proveedor.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrdenes(filtered);
  };

  // 🔹 Reset filtros
  const resetFilters = () => {
    setSearchText("");
    setFilteredOrdenes(ordenes);
  };

  // 🔹 Columnas de la tabla principal
  const columns = [
    {
      title: "Número Orden",
      dataIndex: "numero_orden",
      key: "numero_orden",
    },
    {
      title: "Fecha",
      dataIndex: "fecha_orden",
      key: "fecha_orden",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Proveedor",
      dataIndex: "nombre_proveedor",
      key: "nombre_proveedor",
    },
    {
      title: "Total",
      dataIndex: "total_orden",
      key: "total_orden",
      render: (text) => `$${(text ?? 0).toLocaleString()}`,
    },
    {
      title: "Estado",
      dataIndex: "estado_orden",
      key: "estado_orden",
      render: (estado) => (
        <Tag color={estado === "PENDIENTE" ? "orange" : "green"}>
          {estado}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrden(record);
              setDetalleVisible(true);
            }}
          >
            Ver detalles
          </Button>

          <Button
            type="primary"
            onClick={() => {
              message.success(`Orden ${record.numero_orden} seleccionada`);
              onSelect?.(record); // 🔹 Devuelve la orden al padre
            }}
          >
            Seleccionar
          </Button>

        </Space>
      ),
    },
  ];

  // 🔹 Columnas de la tabla de detalles (usa los campos correctos del backend)
  const detalleColumns = [
    {
      title: "Producto",
      dataIndex: "nombre_producto",
      key: "nombre_producto",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      render: (cantidad) => cantidad ?? 0,
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio_unitario",
      key: "precio_unitario",
      render: (precio) => `$${(precio ?? 0).toLocaleString()}`,
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal) => `$${(subtotal ?? 0).toLocaleString()}`,
    },
  ];

  return (
    <>
      {/* 🔹 Modal principal de órdenes */}
      <Modal
        title="Órdenes de Compra"
        open={visible}
        onCancel={() => onClose?.()}
        footer={null}
        width={1000}
      >
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Buscar por número o proveedor"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={resetFilters}
            disabled={!searchText}
          >
            Reset
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredOrdenes}
          loading={loading}
          rowKey={(record) => record.id_orden}
          pagination={{ pageSize: 5 }}
        />
      </Modal>

      {/* 🔹 Modal secundario para ver detalles */}
      <Modal
        title={`Detalles de ${selectedOrden?.numero_orden || ""}`}
        open={detalleVisible}
        onCancel={() => setDetalleVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={detalleColumns}
          dataSource={selectedOrden?.detalles || []}
          pagination={false}
          rowKey={(row) => row.id_detalleordencompra}
        />
      </Modal>
    </>
  );
}
