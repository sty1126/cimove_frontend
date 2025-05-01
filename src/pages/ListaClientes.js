"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  Space,
  Tag,
  Typography,
  Radio,
  Avatar,
  Tooltip,
  Divider,
  Row,
  Col,
  Statistic,
  message,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  BankOutlined,
  HomeOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

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

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [tipoActivo, setTipoActivo] = useState("todos");
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50"],
      showTotal: (total) => `Total: ${total} clientes`,
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://cimove-backend.onrender.com/api/clientes"
      );
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      message.error("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  const filtrarClientes = () => {
    return clientes.filter((cliente) => {
      if (cliente.estado_cliente !== "A") return false;

      const esNatural = cliente.descripcion_tipocliente === "Persona Natural";
      const esJuridico = cliente.descripcion_tipocliente === "Persona Jurídica";

      if (tipoActivo === "naturales" && !esNatural) return false;
      if (tipoActivo === "juridicos" && !esJuridico) return false;

      const nombre = esNatural
        ? `${cliente.nombre_cliente || ""} ${
            cliente.apellido_cliente || ""
          }`.toLowerCase()
        : cliente.razonsocial_cliente?.toLowerCase() || "";

      return (
        nombre.includes(filtro.toLowerCase()) ||
        (cliente.id_cliente && cliente.id_cliente.toString().includes(filtro))
      );
    });
  };

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const clientesFiltrados = filtrarClientes();
    const totalClientes = clientesFiltrados.length;
    const clientesNaturales = clientesFiltrados.filter(
      (c) => c.descripcion_tipocliente === "Persona Natural"
    ).length;
    const clientesJuridicos = clientesFiltrados.filter(
      (c) => c.descripcion_tipocliente === "Persona Jurídica"
    ).length;

    return {
      totalClientes,
      clientesNaturales,
      clientesJuridicos,
    };
  };

  const estadisticas = calcularEstadisticas();

  // Obtener iniciales para el avatar
  const getInitials = (cliente) => {
    if (cliente.descripcion_tipocliente === "Persona Natural") {
      const nombre = cliente.nombre_cliente || "";
      const apellido = cliente.apellido_cliente || "";
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    } else {
      const razonSocial = cliente.razonsocial_cliente || "";
      return razonSocial.charAt(0).toUpperCase();
    }
  };

  // Obtener color para el avatar basado en el tipo de cliente
  const getAvatarColor = (cliente) => {
    return cliente.descripcion_tipocliente === "Persona Natural"
      ? colors.secondary
      : colors.primary;
  };

  // Manejar cambios en la tabla
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });
  };

  // Funciones de navegación
  const handleCreate = () => {
    navigate("/crear-cliente");
  };

  const handleViewDetails = (record) => {
    navigate(`/cliente/${record.id_cliente}`);
  };

  const handleUpdate = (record) => {
    navigate(`/actualizar-cliente/${record.id_cliente}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://cimove-backend.onrender.com/api/clientes/eliminar/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        message.success("Cliente eliminado correctamente");
        // Recargar la lista de clientes
        fetchClientes();
      } else {
        message.error("Error al eliminar el cliente");
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      message.error("Error al eliminar el cliente");
    }
  };

  // Columnas para la tabla
  const columns = [
    {
      title: "ID",
      dataIndex: "id_cliente",
      key: "id_cliente",
      sorter: (a, b) => a.id_cliente - b.id_cliente,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
      width: 80,
      responsive: ["md"],
    },
    {
      title: "Cliente",
      key: "nombre",
      render: (_, record) => {
        const esNatural = record.descripcion_tipocliente === "Persona Natural";
        const nombre = esNatural
          ? `${record.nombre_cliente || ""} ${record.apellido_cliente || ""}`
          : record.razonsocial_cliente || "";

        const subtitulo = esNatural
          ? record.genero_cliente
            ? `${record.genero_cliente}`
            : ""
          : record.nombrecomercial_cliente || "";

        return (
          <Space>
            <Avatar
              style={{
                backgroundColor: getAvatarColor(record),
                color: "#fff",
              }}
              size={{ xs: 32, sm: 40 }}
            >
              {getInitials(record)}
            </Avatar>
            <div>
              <Text strong style={{ fontSize: "14px" }}>
                {nombre}
              </Text>
              {subtitulo && (
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {subtitulo}
                  </Text>
                </div>
              )}
            </div>
          </Space>
        );
      },
      sorter: (a, b) => {
        const nombreA =
          a.descripcion_tipocliente === "Persona Natural"
            ? `${a.nombre_cliente || ""} ${a.apellido_cliente || ""}`
            : a.razonsocial_cliente || "";
        const nombreB =
          b.descripcion_tipocliente === "Persona Natural"
            ? `${b.nombre_cliente || ""} ${b.apellido_cliente || ""}`
            : b.razonsocial_cliente || "";
        return nombreA.localeCompare(nombreB);
      },
    },
    {
      title: "Tipo",
      dataIndex: "descripcion_tipocliente",
      key: "tipo",
      render: (tipo) => {
        const color =
          tipo === "Persona Natural" ? colors.secondary : colors.primary;
        const icon =
          tipo === "Persona Natural" ? <UserOutlined /> : <BankOutlined />;
        return (
          <Tag
            color={color}
            icon={icon}
            style={{ borderRadius: "12px", padding: "2px 8px" }}
          >
            {tipo === "Persona Natural" ? "Natural" : "Jurídica"}
          </Tag>
        );
      },
      filters: [
        { text: "Persona Natural", value: "Persona Natural" },
        { text: "Persona Jurídica", value: "Persona Jurídica" },
      ],
      onFilter: (value, record) => record.descripcion_tipocliente === value,
      width: 120,
    },
    {
      title: "Contacto",
      key: "contacto",
      render: (_, record) => (
        <div>
          {record.telefono_cliente && (
            <div style={{ marginBottom: "4px" }}>
              <PhoneOutlined
                style={{ color: colors.primary, marginRight: 8 }}
              />
              <Text>{record.telefono_cliente}</Text>
            </div>
          )}
          {record.email_cliente && (
            <div style={{ marginBottom: "4px" }}>
              <MailOutlined style={{ color: colors.primary, marginRight: 8 }} />
              <Text>{record.email_cliente}</Text>
            </div>
          )}
          {record.direccion_cliente && (
            <div>
              <HomeOutlined style={{ color: colors.primary, marginRight: 8 }} />
              <Text type="secondary">{record.direccion_cliente}</Text>
              {record.barrio_cliente && (
                <Text type="secondary"> - {record.barrio_cliente}</Text>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Detalles",
      key: "detalles",
      render: (_, record) => {
        if (record.descripcion_tipocliente === "Persona Natural") {
          return (
            <div>
              {record.fechanacimiento_cliente && (
                <div>
                  <CalendarOutlined
                    style={{ color: colors.accent, marginRight: 8 }}
                  />
                  <Text>
                    {new Date(
                      record.fechanacimiento_cliente
                    ).toLocaleDateString()}
                  </Text>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div>
              {record.representante_cliente && (
                <div>
                  <UserOutlined
                    style={{ color: colors.accent, marginRight: 8 }}
                  />
                  <Text>{record.representante_cliente}</Text>
                </div>
              )}
              {record.digitoverificacion_cliente && (
                <div>
                  <Text type="secondary">
                    DV: {record.digitoverificacion_cliente}
                  </Text>
                </div>
              )}
            </div>
          );
        }
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="middle"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="middle"
              style={{
                backgroundColor: colors.secondary,
                borderColor: colors.secondary,
              }}
              onClick={() => handleUpdate(record)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Popconfirm
              title="¿Eliminar cliente?"
              description="Esta acción no se puede deshacer"
              okText="Sí"
              cancelText="No"
              onConfirm={() => handleDelete(record.id_cliente)}
              okButtonProps={{
                style: {
                  backgroundColor: colors.danger,
                  borderColor: colors.danger,
                },
              }}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                size="middle"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
      className="px-3 sm:px-6 md:px-8 lg:px-24"
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Card
          bordered={false}
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Title level={2} style={{ margin: 0, color: colors.primary }}>
              <TeamOutlined style={{ marginRight: "12px" }} />
              Gestión de Clientes
            </Title>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchClientes}
                loading={loading}
                style={{ borderRadius: "6px" }}
              >
                Actualizar
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  backgroundColor: colors.secondary,
                  borderColor: colors.secondary,
                }}
                onClick={handleCreate}
              >
                Crear Cliente
              </Button>
            </Space>
          </div>

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          {/* Tarjetas de estadísticas */}
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} sm={12} md={8}>
              <Card
                size="small"
                style={{
                  borderLeft: `4px solid ${colors.primary}`,
                  borderRadius: "4px",
                  height: "100%",
                }}
              >
                <Statistic
                  title="Total Clientes"
                  value={estadisticas.totalClientes}
                  prefix={<TeamOutlined style={{ color: colors.primary }} />}
                  valueStyle={{ color: colors.primary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                size="small"
                style={{
                  borderLeft: `4px solid ${colors.secondary}`,
                  borderRadius: "4px",
                  height: "100%",
                }}
              >
                <Statistic
                  title="Personas Naturales"
                  value={estadisticas.clientesNaturales}
                  prefix={<UserOutlined style={{ color: colors.secondary }} />}
                  valueStyle={{ color: colors.secondary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                size="small"
                style={{
                  borderLeft: `4px solid ${colors.accent}`,
                  borderRadius: "4px",
                  height: "100%",
                }}
              >
                <Statistic
                  title="Personas Jurídicas"
                  value={estadisticas.clientesJuridicos}
                  prefix={<BankOutlined style={{ color: colors.accent }} />}
                  valueStyle={{ color: colors.accent }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filtros */}
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} lg={16}>
              <Input
                placeholder="Buscar por ID, nombre o razón social..."
                prefix={<SearchOutlined style={{ color: colors.primary }} />}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                allowClear
                size="large"
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={24} lg={8}>
              <Radio.Group
                value={tipoActivo}
                onChange={(e) => setTipoActivo(e.target.value)}
                buttonStyle="solid"
                size="large"
                style={{ width: "100%", display: "flex" }}
              >
                <Radio.Button
                  value="todos"
                  style={{ flex: 1, textAlign: "center", fontSize: "12px" }}
                >
                  <TeamOutlined /> Todos
                </Radio.Button>
                <Radio.Button
                  value="naturales"
                  style={{ flex: 1, textAlign: "center", fontSize: "12px" }}
                >
                  <UserOutlined /> Naturales
                </Radio.Button>
                <Radio.Button
                  value="juridicos"
                  style={{ flex: 1, textAlign: "center", fontSize: "12px" }}
                >
                  <BankOutlined /> Jurídicos
                </Radio.Button>
              </Radio.Group>
            </Col>
          </Row>

          {/* Tabla de clientes */}
          <Table
            columns={columns}
            dataSource={filtrarClientes()}
            rowKey="id_cliente"
            loading={loading}
            onChange={handleTableChange}
            pagination={{
              ...tableParams.pagination,
              size: "small",
              responsive: true,
            }}
            scroll={{ x: "max-content" }}
            size="small"
            locale={{ emptyText: "No se encontraron clientes" }}
            rowClassName={() => "table-row-hover"}
          />
        </Card>
      </div>
    </div>
  );
};

export default ListaClientes;
