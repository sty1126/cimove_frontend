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
  Select,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  UserOutlined,
  IdcardOutlined,
  BankOutlined,
  TagOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Text, Title } = Typography;
const { Option } = Select;

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
  selectedSede, // Cambiado de sedeActual a selectedSede
  sedes,
}) => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar clientes cuando se abre el modal
  useEffect(() => {
    console.log("Sede seleccionada en useEffect:", selectedSede); // Verifica el nombre de la sede

    const fetchClientes = async () => {
      if (!show || !selectedSede) {
        console.log("No se está pasando la sede correctamente.");
        return;
      }

      if (selectedSede.toLowerCase() === "general") {
        alert("Por favor, selecciona una sede válida primero.");
        handleClose();
        return; // No continuar si la sede es "general"
      }

      setLoading(true);
      try {
        // Primero obtenemos la ID de la sede a partir del nombre de la sede seleccionada
        const resSede = await axios.get(
          `https://cimove-backend.onrender.com/api/sedes/nombre/${selectedSede}`
        );
        const sedeId = resSede.data.id_sede; // Obtenemos la ID de la sede

        // Ahora usamos la ID de la sede para obtener los clientes
        const resClientes = await axios.get(
          `https://cimove-backend.onrender.com/api/clientes/sede/${sedeId}`
        );
        setClientes(resClientes.data);
      } catch (err) {
        console.error("Error al obtener clientes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [show, selectedSede]);

  const clientesFiltrados = clientes.filter((c) => {
    const nombreCompleto = `${c.nombre_cliente || ""} ${
      c.apellido_cliente || ""
    }`.toLowerCase();
    const razonSocial = (c.razonsocial_cliente || "").toLowerCase();
    const id = c.id_cliente?.toString() || "";

    return (
      nombreCompleto.includes(search.toLowerCase()) ||
      razonSocial.includes(search.toLowerCase()) ||
      id.includes(search)
    );
  });

  const handleSelect = (cliente) => {
    const nombreCompleto =
      cliente.descripcion_tipocliente === "Persona Jurídica"
        ? cliente.razonsocial_cliente
        : `${cliente.nombre_cliente} ${cliente.apellido_cliente}`;

    setCliente({
      id_cliente: cliente.id_cliente,
      nombre_razon: nombreCompleto,
      documento: cliente.id_cliente,
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
      dataIndex: "id_cliente",
      key: "id_cliente",
      width: 100,
    },
    {
      title: (
        <Space>
          <UserOutlined style={{ color: colors.primary }} />
          Nombre
        </Space>
      ),
      key: "nombre",
      render: (record) =>
        record.nombre_cliente
          ? `${record.nombre_cliente} ${record.apellido_cliente}`
          : `${record.representante_cliente}`,
    },
    {
      title: (
        <Space>
          <BankOutlined style={{ color: colors.primary }} />
          Razón Social
        </Space>
      ),
      dataIndex: "razonsocial_cliente",
      key: "razonsocial_cliente",
      render: (razon) => razon || "No aplica",
    },
    {
      title: (
        <Space>
          <TagOutlined style={{ color: colors.primary }} />
          Tipo
        </Space>
      ),
      dataIndex: "descripcion_tipocliente",
      key: "descripcion_tipocliente",
      width: 150,
      render: (tipo) => {
        const color = tipo === "Empresa" ? colors.primary : colors.secondary;
        return <Tag color={color}>{tipo}</Tag>;
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
              onClick={() => verDetalles(record.id_cliente)}
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
