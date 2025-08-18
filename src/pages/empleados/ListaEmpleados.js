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
  Tabs,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  obtenerTodosLosEmpleados,
  desactivarEmpleado,
  restaurarEmpleado,
} from "../../services/empleadoService";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
  ReloadOutlined,
  SyncOutlined,
  MailOutlined,
  BankOutlined,
  TeamOutlined,
  IdcardOutlined,
  StopOutlined,
  CheckCircleOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;

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
  const [empleadosActivos, setEmpleadosActivos] = useState([]);
  const [empleadosInactivos, setEmpleadosInactivos] = useState([]);
  const [filteredDataActivos, setFilteredDataActivos] = useState([]);
  const [filteredDataInactivos, setFilteredDataInactivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchRol, setSearchRol] = useState("");
  const [searchSede, setSearchSede] = useState("");
  const [roles, setRoles] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [activeTab, setActiveTab] = useState("activos");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      showTotal: (total) => `Total: ${total} empleados`,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const empleados = await obtenerTodosLosEmpleados();
      setEmpleados(empleados);

      // Separar empleados activos e inactivos
      const activos = empleados.filter((emp) => emp.estado_empleado === "A");
      const inactivos = empleados.filter((emp) => emp.estado_empleado === "I");

      setEmpleadosActivos(activos);
      setEmpleadosInactivos(inactivos);
      setFilteredDataActivos(activos);
      setFilteredDataInactivos(inactivos);

      // Extraer roles únicos
      const uniqueRoles = [
        ...new Set(empleados.map((emp) => emp.descripcion_tipousuario)),
      ].filter(Boolean);
      setRoles(uniqueRoles.map((rol) => ({ id: rol, nombre: rol })));

      // Extraer sedes únicas
      const uniqueSedes = [
        ...new Set(empleados.map((emp) => emp.nombre_sede)),
      ].filter(Boolean);
      setSedes(uniqueSedes.map((sede) => ({ id: sede, nombre: sede })));
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      message.error("Error al cargar los empleados");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar empleados activos
  useEffect(() => {
    let filtered = [...empleadosActivos];

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

    setFilteredDataActivos(filtered);
  }, [searchText, searchId, searchRol, searchSede, empleadosActivos]);

  // Filtrar empleados inactivos
  useEffect(() => {
    let filtered = [...empleadosInactivos];

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

    setFilteredDataInactivos(filtered);
  }, [searchText, searchId, searchRol, searchSede, empleadosInactivos]);

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

  // Función para desactivar empleado
  const handleDeactivate = async (id) => {
    try {
      setLoading(true);
      await desactivarEmpleado(id);
      message.success("Empleado desactivado exitosamente");
      fetchData(); // Recargar datos para actualizar las listas
    } catch (error) {
      message.error("Error al desactivar el empleado: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para reactivar empleado
  const handleReactivate = async (id) => {
    try {
      setLoading(true);
      await restaurarEmpleado(id);
      message.success("Empleado reactivado exitosamente");
      fetchData(); // Recargar datos para actualizar las listas
    } catch (error) {
      message.error("Error al reactivar el empleado: " + error.message);
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

  // Columnas de la tabla para empleados activos
  const columnsActivos = [
    {
      title: "ID",
      dataIndex: "id_empleado",
      sorter: (a, b) => a.id_empleado - b.id_empleado,
      width: 80,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
      responsive: ["md"],
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
              marginRight: 8,
            }}
            size={{ xs: 32, sm: 40 }}
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
            title="¿Seguro que deseas desactivar este empleado?"
            description="El empleado quedará inactivo en el sistema"
            onConfirm={() => handleDeactivate(record.id_empleado)}
            okText="Sí"
            cancelText="No"
            placement="left"
            okButtonProps={{
              style: {
                backgroundColor: colors.warning,
                borderColor: colors.warning,
              },
            }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<StopOutlined />}
              size="middle"
              style={{
                backgroundColor: colors.warning,
                borderColor: colors.warning,
              }}
              title="Desactivar"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Columnas de la tabla para empleados inactivos
  const columnsInactivos = [
    {
      title: "ID",
      dataIndex: "id_empleado",
      sorter: (a, b) => a.id_empleado - b.id_empleado,
      width: 80,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
      responsive: ["md"],
    },
    {
      title: "Empleado",
      dataIndex: "nombre_empleado",
      sorter: (a, b) => a.nombre_empleado?.localeCompare(b.nombre_empleado),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor: "#d9d9d9",
              marginRight: 8,
            }}
            size={{ xs: 32, sm: 40 }}
          >
            {getInitials(text)}
          </Avatar>
          <div>
            <Text type="secondary" strong>
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
            style={{
              color: "#666",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#f0f0f0",
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
            style={{
              color: "#666",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#f0f0f0",
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
      width: 150,
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
          <Popconfirm
            title="¿Seguro que deseas reactivar este empleado?"
            description="El empleado volverá a estar activo en el sistema"
            onConfirm={() => handleReactivate(record.id_empleado)}
            okText="Sí"
            cancelText="No"
            placement="left"
            okButtonProps={{
              style: {
                backgroundColor: colors.success,
                borderColor: colors.success,
              },
            }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<CheckCircleOutlined />}
              size="middle"
              style={{
                backgroundColor: colors.success,
                borderColor: colors.success,
              }}
              title="Reactivar"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Estadísticas rápidas para empleados activos
  const statsActivos = {
    totalEmpleados: filteredDataActivos.length,
    totalRoles: new Set(
      filteredDataActivos.map((e) => e.descripcion_tipousuario).filter(Boolean)
    ).size,
    totalSedes: new Set(
      filteredDataActivos.map((e) => e.nombre_sede).filter(Boolean)
    ).size,
  };

  // Estadísticas rápidas para empleados inactivos
  const statsInactivos = {
    totalEmpleados: filteredDataInactivos.length,
    totalRoles: new Set(
      filteredDataInactivos
        .map((e) => e.descripcion_tipousuario)
        .filter(Boolean)
    ).size,
    totalSedes: new Set(
      filteredDataInactivos.map((e) => e.nombre_sede).filter(Boolean)
    ).size,
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
        padding: "12px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
      className="px-3 sm:px-6 md:px-8 lg:px-24"
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
          <Space>
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
          </Space>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
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
          }
        >
          <TabPane
            tab={
              <span>
                <UserSwitchOutlined /> Empleados Activos (
                {empleadosActivos.length})
              </span>
            }
            key="activos"
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "24px",
                width: "100%",
              }}
            >
              <Card
                size="small"
                style={{
                  width: "100%",
                  maxWidth: "220px",
                  flex: "1 1 220px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid ${colors.primary}`,
                }}
              >
                <Statistic
                  title="Total Empleados"
                  value={statsActivos.totalEmpleados}
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
                  value={statsActivos.totalRoles}
                  prefix={
                    <IdcardOutlined style={{ color: colors.secondary }} />
                  }
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
                  value={statsActivos.totalSedes}
                  prefix={<BankOutlined style={{ color: colors.accent }} />}
                  valueStyle={{ color: colors.accent }}
                />
              </Card>
            </div>

            <Divider style={{ margin: "12px 0", borderColor: colors.light }} />

            <div style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Input
                    placeholder="Buscar por ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    allowClear
                    prefix={
                      <FilterOutlined style={{ color: colors.primary }} />
                    }
                    style={{ borderRadius: "6px", width: "100%" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Input
                    placeholder="Buscar por nombre o email"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    prefix={
                      <FilterOutlined style={{ color: colors.primary }} />
                    }
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

            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              bodyStyle={{ padding: "0" }}
            >
              <Table
                columns={columnsActivos}
                dataSource={filteredDataActivos}
                rowKey="id_empleado"
                loading={loading}
                onChange={handleTableChange}
                pagination={{
                  ...tableParams.pagination,
                  style: { marginRight: "16px" },
                  size: "small",
                  responsive: true,
                }}
                scroll={{ x: "max-content" }}
                style={{ marginTop: "0" }}
                size="small"
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <StopOutlined /> Empleados Inactivos (
                {empleadosInactivos.length})
              </span>
            }
            key="inactivos"
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "24px",
                width: "100%",
              }}
            >
              <Card
                size="small"
                style={{
                  width: "100%",
                  maxWidth: "220px",
                  flex: "1 1 220px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid #999`,
                }}
              >
                <Statistic
                  title="Total Empleados Inactivos"
                  value={statsInactivos.totalEmpleados}
                  prefix={<TeamOutlined style={{ color: "#999" }} />}
                  valueStyle={{ color: "#999" }}
                />
              </Card>
              <Card
                size="small"
                style={{
                  width: "220px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid #999`,
                }}
              >
                <Statistic
                  title="Roles Diferentes"
                  value={statsInactivos.totalRoles}
                  prefix={<IdcardOutlined style={{ color: "#999" }} />}
                  valueStyle={{ color: "#999" }}
                />
              </Card>
              <Card
                size="small"
                style={{
                  width: "220px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid #999`,
                }}
              >
                <Statistic
                  title="Sedes"
                  value={statsInactivos.totalSedes}
                  prefix={<BankOutlined style={{ color: "#999" }} />}
                  valueStyle={{ color: "#999" }}
                />
              </Card>
            </div>

            <Divider style={{ margin: "12px 0", borderColor: colors.light }} />

            <div style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Input
                    placeholder="Buscar por ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    allowClear
                    prefix={
                      <FilterOutlined style={{ color: colors.primary }} />
                    }
                    style={{ borderRadius: "6px", width: "100%" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Input
                    placeholder="Buscar por nombre o email"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    prefix={
                      <FilterOutlined style={{ color: colors.primary }} />
                    }
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

            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              bodyStyle={{ padding: "0" }}
            >
              <Table
                columns={columnsInactivos}
                dataSource={filteredDataInactivos}
                rowKey="id_empleado"
                loading={loading}
                onChange={handleTableChange}
                pagination={{
                  ...tableParams.pagination,
                  style: { marginRight: "16px" },
                  size: "small",
                  responsive: true,
                }}
                scroll={{ x: "max-content" }}
                style={{ marginTop: "0" }}
                size="small"
              />
            </Card>
          </TabPane>
        </Tabs>
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
