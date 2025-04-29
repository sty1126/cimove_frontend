"use client";

import { useState, useEffect } from "react";
import { Popconfirm } from "antd";
import {
  Table,
  Input,
  Button,
  Modal,
  Row,
  Col,
  Tag,
  Card,
  Typography,
  Divider,
  Space,
  Avatar,
  Spin,
  message,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
  SyncOutlined,
  MailOutlined,
  BankOutlined,
  TeamOutlined,
  IdcardOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

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

const ListaEmpleados = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchRol, setSearchRol] = useState("");
  const [searchSede, setSearchSede] = useState("");
  const [roles, setRoles] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      showTotal: (total) => `Total: ${total} empleados`,
    },
  });

  // Obtener datos iniciales - mantener la funcionalidad original
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://cimove-backend.onrender.com/api/empleados/");
      setEmpleados(res.data);
      setFilteredData(res.data);

      // Extraer roles únicos
      const uniqueRoles = [
        ...new Set(res.data.map((emp) => emp.descripcion_tipousuario)),
      ].filter(Boolean);
      setRoles(uniqueRoles.map((rol) => ({ id: rol, nombre: rol })));

      // Extraer sedes únicas
      const uniqueSedes = [
        ...new Set(res.data.map((emp) => emp.nombre_sede)),
      ].filter(Boolean);
      setSedes(uniqueSedes.map((sede) => ({ id: sede, nombre: sede })));
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      message.error("Error al cargar los empleados");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar empleados
  useEffect(() => {
    let filtered = [...empleados];

    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.nombre_empleado
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.email_usuario?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (searchId) {
      filtered = filtered.filter((item) =>
        item.id_empleado?.toString().includes(searchId)
      );
    }

    if (searchRol) {
      filtered = filtered.filter(
        (item) => item.descripcion_tipousuario === searchRol
      );
    }

    if (searchSede) {
      filtered = filtered.filter((item) => item.nombre_sede === searchSede);
    }

    setFilteredData(filtered);
  }, [searchText, searchId, searchRol, searchSede, empleados]);

  // Resetear todos los filtros
  const resetFilters = () => {
    setSearchText("");
    setSearchId("");
    setSearchRol("");
    setSearchSede("");
  };

  // Manejar cambios en la tabla
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });
  };

  // Función para eliminar empleado - mantener la funcionalidad original
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://cimove-backend.onrender.com/api/empleados/eliminar/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar");
      }

      message.success("Empleado eliminado exitosamente");
      setEmpleados((prev) => prev.filter((e) => e.id_empleado !== id));
      setFilteredData((prev) => prev.filter((e) => e.id_empleado !== id));

      // Si tienes función para recargar datos:
      // fetchEmpleados();
    } catch (error) {
      message.error("Error al eliminar el empleado: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para generar colores basados en rol
  const getRoleColor = (role) => {
    if (!role) return colors.accent;

    // Crear un hash simple del nombre del rol
    let hash = 0;
    for (let i = 0; i < role.length; i++) {
      hash = role.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Usar algunos colores predefinidos basados en el hash
    const roleColors = [
      colors.primary,
      colors.secondary,
      colors.accent,
      "#5B9A82", // Verde azulado más vibrante
      "#2D93AD", // Azul turquesa más vibrante
    ];

    return roleColors[Math.abs(hash) % roleColors.length];
  };

  // Obtener iniciales para el avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Columnas de la tabla
  const columns = [
    {
      title: "ID",
      dataIndex: "id_empleado",
      sorter: (a, b) => a.id_empleado - b.id_empleado,
      width: 100,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          {id}
        </Text>
      ),
    },
    {
      title: "Empleado",
      dataIndex: "nombre_empleado",
      sorter: (a, b) => a.nombre_empleado?.localeCompare(b.nombre_empleado),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor: getRoleColor(record.descripcion_tipousuario),
              marginRight: 12,
            }}
          >
            {getInitials(text)}
          </Avatar>
          <div>
            <Text strong style={{ color: colors.text }}>
              {text}
            </Text>
            {record.email_usuario && (
              <div>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  <MailOutlined style={{ marginRight: 4 }} />
                  {record.email_usuario}
                </Text>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Rol",
      dataIndex: "descripcion_tipousuario",
      width: 180,
      render: (role) => {
        if (!role) return "-";
        return (
          <Tag
            color={getRoleColor(role)}
            style={{
              color: "#0D5F70",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: `${getRoleColor(role)}40`,
              maxWidth: "160px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={role}
          >
            {role}
          </Tag>
        );
      },
      filters: roles?.map((rol) => ({
        text: rol.nombre,
        value: rol.nombre,
      })),
      onFilter: (value, record) => record.descripcion_tipousuario === value,
    },
    {
      title: "Sede",
      dataIndex: "nombre_sede",
      width: 150,
      render: (sede) => {
        if (!sede) return "-";
        return (
          <Tag
            color={colors.accent}
            style={{
              color: "#0D5F70",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: `${colors.accent}40`,
            }}
          >
            <BankOutlined style={{ marginRight: 4 }} />
            {sede}
          </Tag>
        );
      },
      filters: sedes?.map((sede) => ({
        text: sede.nombre,
        value: sede.nombre,
      })),
      onFilter: (value, record) => record.nombre_sede === value,
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            size="middle"
            onClick={() => navigate(`/empleados/${record.id_empleado}`)}
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
            }}
            title="Ver detalles"
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            size="middle"
            onClick={() => navigate(`/empleados/editar/${record.id_empleado}`)}
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
            title="Editar"
          />
          <Popconfirm
            title="¿Seguro que deseas eliminar este empleado? No podas crear un empleado nuevamente con esa ID."
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDelete(record.id_empleado)}
            okText="Sí"
            cancelText="No"
            placement="left"
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
              style={{
                backgroundColor: colors.danger,
                borderColor: colors.danger,
              }}
              title="Eliminar"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Estadísticas rápidas
  const stats = {
    totalEmpleados: filteredData.length,
    totalRoles: new Set(
      filteredData.map((e) => e.descripcion_tipousuario).filter(Boolean)
    ).size,
    totalSedes: new Set(filteredData.map((e) => e.nombre_sede).filter(Boolean))
      .size,
  };

  if (loading && empleados.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Cargando datos de empleados..." />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
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
            Lista de Empleados
          </Title>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={fetchData}
            loading={loading}
            style={{
              borderRadius: "6px",
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
          >
            Actualizar
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <Card
            size="small"
            style={{
              width: "220px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderLeft: `4px solid ${colors.primary}`,
            }}
          >
            <Statistic
              title="Total Empleados"
              value={stats.totalEmpleados}
              prefix={<TeamOutlined style={{ color: colors.primary }} />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
          <Card
            size="small"
            style={{
              width: "220px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderLeft: `4px solid ${colors.secondary}`,
            }}
          >
            <Statistic
              title="Roles Diferentes"
              value={stats.totalRoles}
              prefix={<IdcardOutlined style={{ color: colors.secondary }} />}
              valueStyle={{ color: colors.secondary }}
            />
          </Card>
          <Card
            size="small"
            style={{
              width: "220px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderLeft: `4px solid ${colors.accent}`,
            }}
          >
            <Statistic
              title="Sedes"
              value={stats.totalSedes}
              prefix={<BankOutlined style={{ color: colors.accent }} />}
              valueStyle={{ color: colors.accent }}
            />
          </Card>
        </div>

        <Divider style={{ margin: "12px 0", borderColor: colors.light }} />

        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Buscar por ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                allowClear
                prefix={<FilterOutlined style={{ color: colors.primary }} />}
                style={{ borderRadius: "6px" }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Buscar por nombre o email"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                prefix={<FilterOutlined style={{ color: colors.primary }} />}
                style={{ borderRadius: "6px" }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filtrar por rol"
                value={searchRol}
                onChange={setSearchRol}
                style={{ width: "100%", borderRadius: "6px" }}
                allowClear
                suffixIcon={
                  <FilterOutlined style={{ color: colors.primary }} />
                }
              >
                {roles?.map((rol) => (
                  <Option key={rol.id} value={rol.nombre}>
                    {rol.nombre}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filtrar por sede"
                value={searchSede}
                onChange={setSearchSede}
                style={{ width: "100%", borderRadius: "6px" }}
                allowClear
                suffixIcon={
                  <FilterOutlined style={{ color: colors.primary }} />
                }
              >
                {sedes?.map((sede) => (
                  <Option key={sede.id} value={sede.nombre}>
                    {sede.nombre}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 16 }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={resetFilters}
              style={{ borderRadius: "6px" }}
            >
              Limpiar filtros
            </Button>
          </Row>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/crear-empleado")}
            style={{
              borderRadius: "6px",
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
          >
            Registrar Empleado
          </Button>
        </div>
      </Card>

      <Card
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        bodyStyle={{ padding: "0" }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id_empleado"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            ...tableParams.pagination,
            style: { marginRight: "16px" },
          }}
          scroll={{ x: 1000 }}
          style={{ marginTop: "0" }}
        />
      </Card>
    </div>
  );
};

// Componente de estadística personalizado
const Statistic = ({ title, value, prefix, valueStyle }) => {
  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
      >
        <Text type="secondary">{title}</Text>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "8px", fontSize: "16px" }}>{prefix}</span>
        <Text style={{ fontSize: "24px", fontWeight: "bold", ...valueStyle }}>
          {value}
        </Text>
      </div>
    </div>
  );
};

export default ListaEmpleados;
