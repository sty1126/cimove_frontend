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
import {
  obtenerClientesPorSede,
  obtenerIdSedePorNombre,
} from "../../services/clienteService";

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

const SeleccionarClientePorSede = ({
  show,
  handleClose,
  setCliente,
  selectedSede,
}) => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      if (!show || !selectedSede || selectedSede.toLowerCase() === "general") {
        handleClose();
        return;
      }

      setLoading(true);
      try {
        const sedeId = await obtenerIdSedePorNombre(selectedSede);
        const data = await obtenerClientesPorSede(sedeId);
        setClientes(data); // Ahora usamos los datos tal como llegan
      } catch (err) {
        console.error("Error al obtener clientes por sede:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [show, selectedSede]);

  const clientesFiltrados = clientes.filter((c) => {
    const nombre = (c.nombre || "").toLowerCase();
    const razonSocial = (c.razon_social || "").toLowerCase();
    const id = c.id?.toString() || "";

    return (
      nombre.includes(search.toLowerCase()) ||
      razonSocial.includes(search.toLowerCase()) ||
      id.includes(search)
    );
  });

  const handleSelect = (cliente) => {
    setCliente({
      id_cliente: cliente.id,
      nombre_razon: cliente.nombre,
      documento: cliente.id,
    });
    handleClose();
  };

  const verDetalles = (clienteId) => {
    handleClose();
    window.open(`/cliente/${clienteId}`, "_blank");
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
      render: (razon) => razon || "No aplica",
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
      width: 150,
      render: (tipo) => {
        const tipoTexto = tipo === "N" ? "Natural" : "Jurídico";
        const color = tipo === "J" ? colors.primary : colors.secondary;
        return <Tag color={color}>{tipoTexto}</Tag>;
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
            Seleccionar Cliente por Sede
          </Title>
        </Space>
      }
      open={show}
      onCancel={handleClose}
      footer={null}
      width={850}
      centered
      bodyStyle={{ padding: "16px" }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Text strong>
          Sede actual: <Tag color={colors.primary}>{selectedSede}</Tag>
        </Text>

        <Input
          placeholder="Buscar por código, nombre o razón social"
          prefix={<SearchOutlined style={{ color: colors.primary }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </Space>

      <Divider style={{ margin: "16px 0", borderColor: colors.light }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" tip="Cargando clientes..." />
        </div>
      ) : clientesFiltrados.length > 0 ? (
        <Table
          columns={columns}
          dataSource={clientesFiltrados}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 5,
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
              <Text type="secondary">
                {selectedSede
                  ? "No hay clientes disponibles para esta sede"
                  : "Selecciona una sede para comenzar"}
              </Text>
            </Space>
          }
          style={{ margin: "40px 0" }}
        />
      )}
    </Modal>
  );
};

export default SeleccionarClientePorSede;
