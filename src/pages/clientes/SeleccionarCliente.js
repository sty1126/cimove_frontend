"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  SearchOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  UserOutlined,
  IdcardOutlined,
  BankOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { obtenerClientesFormateados } from "../../services/clienteService";

const { Text, Title } = Typography;

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

const SeleccionarCliente = ({ show, handleClose, setCliente }) => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      if (!show) return;
      setLoading(true);
      try {
        const data = await obtenerClientesFormateados();
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener clientes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [show]);

  const clientesFiltrados = clientes.filter((c) => {
    const nombre = c.nombre?.toLowerCase() || "";
    const id = c.id?.toString() || "";
    const razonSocial = c.razon_social?.toLowerCase() || "";

    return (
      nombre.includes(search.toLowerCase()) ||
      id.includes(search) ||
      razonSocial.includes(search.toLowerCase())
    );
  });

  const handleSelect = (cliente) => {
    setCliente({
      id_cliente: cliente.id,
      nombre: cliente.nombre,
      razon_social: cliente.razon_social,
      tipo: cliente.tipo,
    });
    handleClose();
  };

  const verDetalles = (clienteId) => {
    handleClose();
    navigate(`/detalles-cliente/${clienteId}`);
  };

  const columns = [
    {
      title: (
        <Space>
          <IdcardOutlined style={{ color: colors.primary }} />
          ID
        </Space>
      ),
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          {id || "Sin ID"}
        </Text>
      ),
    },
    {
      title: (
        <Space>
          <UserOutlined style={{ color: colors.primary }} />
          Nombre
        </Space>
      ),
      dataIndex: "nombre",
      key: "nombre",
      render: (nombre) => <Text>{nombre || "Sin nombre"}</Text>,
    },
    {
      title: (
        <Space>
          <BankOutlined style={{ color: colors.primary }} />
          Razón Social
        </Space>
      ),
      dataIndex: "razon_social",
      key: "razon_social",
      render: (razonSocial) => <Text>{razonSocial || "No aplica"}</Text>,
    },
    {
      title: (
        <Space>
          <TagOutlined style={{ color: colors.primary }} />
          Tipo
        </Space>
      ),
      dataIndex: "tipo",
      key: "tipo",
      width: 120,
      render: (tipo) => {
        let color = colors.accent;
        if (tipo === "Persona Natural") color = colors.secondary;
        if (tipo === "Empresa") color = colors.primary;

        return (
          <Tag color={color} style={{ borderRadius: "4px" }}>
            {tipo || "N/A"}
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
          <Tooltip title="Seleccionar cliente">
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
              onClick={() => verDetalles(record.id)}
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
          <UserOutlined style={{ color: colors.primary, fontSize: "20px" }} />
          <Title level={4} style={{ margin: 0 }}>
            Seleccionar Cliente
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
        placeholder="Buscar por código, nombre o razón social"
        prefix={<SearchOutlined style={{ color: colors.primary }} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "16px" }}
        allowClear
      />

      <Divider style={{ margin: "8px 0 16px", borderColor: colors.light }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" tip="Cargando clientes..." />
        </div>
      ) : clientesFiltrados.length > 0 ? (
        <Table
          columns={columns}
          dataSource={clientesFiltrados}
          rowKey={(record) => record.id || `cliente-${Math.random()}`}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `Total: ${total} clientes`,
          }}
          size="middle"
          scroll={{ y: 300 }}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" align="center">
              <Text type="secondary">No hay clientes disponibles</Text>
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

export default SeleccionarCliente;
