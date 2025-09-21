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
  Tooltip,
  Divider,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  UsergroupAddOutlined,
  IdcardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getTodosProveedores } from "../../services/proveedoresService";
import { useNavigate } from "react-router-dom";

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

export default function SeleccionarProveedor({
  show,
  handleClose,
  setProveedor,
}) {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      if (!show) return;

      setLoading(true);
      try {
        const data = await getTodosProveedores();
        setProveedores(data);
      } catch (error) {
        console.error("Error al obtener proveedores", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, [show]);

  const proveedoresFiltrados = proveedores.filter((p) => {
    const id = p.id_proveedor?.toString() || "";
    const nombre = p.nombre_proveedor?.toLowerCase() || "";
    const representante = p.representante_proveedor?.toLowerCase() || "";
    return (
      id.includes(search) ||
      nombre.includes(search.toLowerCase()) ||
      representante.includes(search.toLowerCase())
    );
  });

  const handleSelect = (proveedor) => {
    const proveedorInfo = {
      id_proveedor: proveedor.id_proveedor,
      nombre_proveedor: proveedor.nombre_proveedor || "Sin nombre",
    };
    setProveedor(proveedorInfo);
    handleClose();
  };

  const verDetalles = (id) => {
    window.open(`/detalles-proveedor/${id}`, "_blank");
  };

  const columns = [
    {
      title: (
        <Space>
          <IdcardOutlined style={{ color: colors.primary }} />
          ID
        </Space>
      ),
      dataIndex: "id_proveedor",
      key: "id_proveedor",
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
          <UsergroupAddOutlined style={{ color: colors.primary }} />
          Nombre
        </Space>
      ),
      dataIndex: "nombre_proveedor",
      key: "nombre_proveedor",
      render: (nombre) => <Text strong>{nombre || "Sin nombre"}</Text>,
    },
    {
      title: (
        <Space>
          <UserOutlined style={{ color: colors.primary }} />
          Representante
        </Space>
      ),
      dataIndex: "representante_proveedor",
      key: "representante_proveedor",
      render: (rep) => <Text>{rep || "Sin representante"}</Text>,
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 120,
      align: "center",
      render: (_, proveedor) => (
        <Space size="middle">
          <Tooltip title="Seleccionar proveedor">
            <Button
              type="primary"
              shape="circle"
              icon={<CheckCircleOutlined />}
              onClick={() => handleSelect(proveedor)}
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
              onClick={() => verDetalles(proveedor.id_proveedor)}
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
          <UsergroupAddOutlined
            style={{ color: colors.primary, fontSize: "20px" }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Seleccionar Proveedor
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
        placeholder="Buscar por ID, nombre o representante"
        prefix={<SearchOutlined style={{ color: colors.primary }} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "16px" }}
        allowClear
      />

      <Divider style={{ margin: "8px 0 16px", borderColor: colors.light }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" tip="Cargando proveedores..." />
        </div>
      ) : proveedoresFiltrados.length > 0 ? (
        <Table
          columns={columns}
          dataSource={proveedoresFiltrados}
          rowKey="id_proveedor"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `Total: ${total} proveedores`,
          }}
          size="middle"
          scroll={{ y: 300 }}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" align="center">
              <Text type="secondary">No hay proveedores disponibles</Text>
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
}
