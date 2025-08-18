"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  message,
  Select,
  Modal,
  Row,
  Col,
  Tag,
  Card,
  Typography,
  Divider,
  Space,
  Avatar,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  getProveedores,
  getTiposProveedor,
  crearTipoProveedor,
  desactivarProveedor,
} from "../../services/proveedoresService";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  SyncOutlined,
  TeamOutlined,
  ShopOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

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

const ListaProveedores = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchTipo, setSearchTipo] = useState("");
  const [tiposProveedor, setTiposProveedor] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTipo, setNewTipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      showTotal: (total) => `Total: ${total} proveedores`,
    },
  });

  // Obtener datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [providersRes, typesRes] = await Promise.all([
        getProveedores(),
        getTiposProveedor(),
      ]);

      setData(providersRes);
      setFilteredData(providersRes);
      setTiposProveedor(typesRes);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      message.error("Error al cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar proveedores
  useEffect(() => {
    let filtered = [...data];

    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.nombre_proveedor
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          (item.representante_proveedor &&
            item.representante_proveedor
              .toLowerCase()
              .includes(searchText.toLowerCase()))
      );
    }

    if (searchId) {
      filtered = filtered.filter((item) =>
        item.id_proveedor?.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    if (searchTipo) {
      filtered = filtered.filter(
        (item) => item.nombre_tipoproveedor === searchTipo
      );
    }

    setFilteredData(filtered);
  }, [searchText, searchId, searchTipo, data]);

  // Funciones CRUD
  const handleUpdate = (record) => {
    navigate(`/actualizar-proveedor/${record.id_proveedor}`);
  };

  const handleViewDetails = (record) => {
    navigate(`/proveedores/${record.id_proveedor}`);
  };

  const handleDelete = async (id) => {
    try {
      await desactivarProveedor(id);
      message.success("Proveedor desactivado exitosamente");
      setData((prev) =>
        prev.map((p) =>
          p.id_proveedor === id ? { ...p, estado_proveedor: "I" } : p
        )
      );
    } catch (error) {
      message.error("Error al desactivar el proveedor");
    }
  };

  // Crear nuevo tipo de proveedor
  const handleCreateTipo = async () => {
    try {
      await crearTipoProveedor(newTipo);

      message.success("Tipo de proveedor creado exitosamente");
      setIsModalVisible(false);
      setNewTipo("");

      const typesRes = await getTiposProveedor();
      setTiposProveedor(typesRes);
    } catch (error) {
      message.error(error.message || "Error al crear el tipo de proveedor");
      console.error(error);
    }
  };

  // Resetear todos los filtros
  const resetFilters = () => {
    setSearchText("");
    setSearchId("");
    setSearchTipo("");
  };

  // Manejar cambios en la tabla
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });
  };

  // Función para generar colores basados en tipo de proveedor
  const getProviderTypeColor = (type) => {
    if (!type) return colors.accent;

    // Crear un hash simple del nombre del tipo
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      hash = type.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Usar algunos colores predefinidos basados en el hash
    const typeColors = [
      colors.primary,
      colors.secondary,
      colors.accent,
      "#5B9A82", // Verde azulado más vibrante
      "#2D93AD", // Azul turquesa más vibrante
    ];

    return typeColors[Math.abs(hash) % typeColors.length];
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
      dataIndex: "id_proveedor",
      sorter: (a, b) => a.id_proveedor?.localeCompare(b.id_proveedor),
      width: 150, // Aumentado para mostrar el ID completo
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          {id}
        </Text>
      ),
    },
    {
      title: "Proveedor",
      dataIndex: "nombre_proveedor",
      sorter: (a, b) => a.nombre_proveedor?.localeCompare(b.nombre_proveedor),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor: getProviderTypeColor(
                record.nombre_tipoproveedor
              ),
              marginRight: 12,
            }}
          >
            {getInitials(text)}
          </Avatar>
          <div>
            <Text strong style={{ color: colors.text }}>
              {text}
            </Text>
            {record.representante_proveedor && (
              <div>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  <UserOutlined style={{ marginRight: 4 }} />
                  {record.representante_proveedor}
                </Text>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "nombre_tipoproveedor",
      width: 180, // Aumentado para evitar sobreposición
      render: (type) => {
        if (!type) return "-";
        return (
          <Tag
            color={getProviderTypeColor(type)}
            style={{
              color: "#0D5F70",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: `${getProviderTypeColor(type)}40`,
              maxWidth: "160px", // Limitar ancho
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={type} // Tooltip al hacer hover
          >
            {type}
          </Tag>
        );
      },
      filters: tiposProveedor?.map((tipo) => ({
        text: tipo.nombre_tipoproveedor,
        value: tipo.nombre_tipoproveedor,
      })),
      onFilter: (value, record) => record.nombre_tipoproveedor === value,
    },
    {
      title: "Contacto",
      dataIndex: "telefono_proveedor",
      width: 220,
      render: (phone, record) => (
        <div>
          {phone && (
            <div style={{ marginBottom: 4 }}>
              <PhoneOutlined
                style={{ marginRight: 8, color: colors.primary }}
              />
              <Text>{phone}</Text>
            </div>
          )}
          {record.email_proveedor && (
            <div
              style={{
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <MailOutlined style={{ marginRight: 8, color: colors.primary }} />
              <Text title={record.email_proveedor}>
                {record.email_proveedor}
              </Text>
            </div>
          )}
        </div>
      ),
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
            icon={<EditOutlined />}
            size="middle"
            onClick={() => handleUpdate(record)}
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            size="middle"
            onClick={() => handleViewDetails(record)}
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
            }}
          />
          <Popconfirm
            title={`¿Seguro que deseas ${
              record.estado_proveedor === "A" ? "desactivar" : "activar"
            } este proveedor?`}
            onConfirm={() => handleDelete(record.id_proveedor)}
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
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Estadísticas rápidas
  const stats = {
    totalProviders: filteredData.length,
    activeProviders: filteredData.filter((p) => p.estado_proveedor === "A")
      .length,
    providerTypes: new Set(
      filteredData.map((p) => p.nombre_tipoproveedor).filter(Boolean)
    ).size,
  };

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
            Lista de Proveedores
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
              title="Total Proveedores"
              value={stats.totalProviders}
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
              title="Proveedores Activos"
              value={stats.activeProviders}
              prefix={<ShopOutlined style={{ color: colors.secondary }} />}
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
              title="Tipos de Proveedor"
              value={stats.providerTypes}
              prefix={<AppstoreAddOutlined style={{ color: colors.accent }} />}
              valueStyle={{ color: colors.accent }}
            />
          </Card>
        </div>

        <Divider style={{ margin: "12px 0", borderColor: colors.light }} />

        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Buscar por ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                allowClear
                prefix={<FilterOutlined style={{ color: colors.primary }} />}
                style={{ borderRadius: "6px" }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Buscar por nombre"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                prefix={<FilterOutlined style={{ color: colors.primary }} />}
                style={{ borderRadius: "6px" }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Filtrar por tipo"
                value={searchTipo}
                onChange={setSearchTipo}
                style={{ width: "100%", borderRadius: "6px" }}
                allowClear
                suffixIcon={
                  <FilterOutlined style={{ color: colors.primary }} />
                }
              >
                {tiposProveedor?.map((tipo) => (
                  <Option
                    key={tipo.id_tipoproveedor}
                    value={tipo.nombre_tipoproveedor}
                  >
                    {tipo.nombre_tipoproveedor}
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/registro-proveedor")}
            style={{
              borderRadius: "6px",
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
          >
            Añadir Proveedor
          </Button>
          <Button
            type="primary"
            icon={<AppstoreAddOutlined />}
            onClick={() => setIsModalVisible(true)}
            style={{
              borderRadius: "6px",
              backgroundColor: colors.accent,
              borderColor: colors.accent,
            }}
          >
            Añadir Tipo de Proveedor
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
          rowKey="id_proveedor"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            ...tableParams.pagination,
            style: { marginRight: "16px" },
          }}
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: "12px 24px" }}>
                <Row gutter={[24, 12]}>
                  {record.direccion_proveedor && (
                    <Col span={24} md={12}>
                      <Text type="secondary" style={{ marginRight: 8 }}>
                        <BankOutlined /> Dirección:
                      </Text>
                      <Text>{record.direccion_proveedor}</Text>
                    </Col>
                  )}
                  {record.email_proveedor && (
                    <Col span={24} md={12}>
                      <Text type="secondary" style={{ marginRight: 8 }}>
                        <MailOutlined /> Email:
                      </Text>
                      <Text>{record.email_proveedor}</Text>
                    </Col>
                  )}
                  {record.observaciones_proveedor && (
                    <Col span={24}>
                      <Text type="secondary" style={{ marginRight: 8 }}>
                        Observaciones:
                      </Text>
                      <Text>{record.observaciones_proveedor}</Text>
                    </Col>
                  )}
                </Row>
              </div>
            ),
            expandRowByClick: true,
          }}
          style={{ marginTop: "0" }}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AppstoreAddOutlined style={{ color: colors.accent }} />
            <span>Crear Nuevo Tipo de Proveedor</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleCreateTipo}
        onCancel={() => setIsModalVisible(false)}
        okText="Crear"
        cancelText="Cancelar"
        okButtonProps={{
          style: { backgroundColor: colors.accent, borderColor: colors.accent },
        }}
      >
        <Input
          placeholder="Nombre del tipo de proveedor"
          value={newTipo}
          maxLength={25}
          onChange={(e) => setNewTipo(e.target.value)}
          onPressEnter={handleCreateTipo}
          prefix={<AppstoreAddOutlined style={{ color: "#bfbfbf" }} />}
          style={{ marginTop: "16px" }}
        />
      </Modal>
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

export default ListaProveedores;
