"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  message,
  Popconfirm,
  Card,
  Typography,
  Badge,
  Space,
  Divider,
  Tag,
  Avatar,
  Tabs,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  AppstoreAddOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  BarChartOutlined,
  DollarOutlined,
  InboxOutlined,
  SyncOutlined,
  ToolOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import {
  obtenerCategorias,
  obtenerSedes,
  obtenerProductosGeneral,
  obtenerProductosPorSede,
  crearCategoria,
  eliminarProducto,
} from "../../services/inventarioService";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Paleta de colores personalizada - versión más vibrante
const colors = {
  primary: "#0D7F93", // Teal más vibrante (basado en #176876)
  secondary: "#4D8A52", // Verde más vibrante (basado en #4D7952)
  accent: "#7FBAD6", // Azul más vibrante (basado en #8BB4C7)
  light: "#C3D3C6", // Verde menta claro - sin cambios
  background: "#E8EAEC", // Gris muy claro - ligeramente más claro
  text: "#2A3033", // Texto oscuro
  success: "#4D8A52", // Verde más vibrante para éxito
  warning: "#E0A458", // Naranja apagado para advertencias
  danger: "#C25F48", // Rojo más vibrante para peligro
};

const Inventario = () => {
  const navigate = useNavigate();

  // Estados
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [selectedSede, setSelectedSede] = useState("general");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
    },
  });

  // Estados adicionales para la pestaña de garantía/reparación
  const [warrantyData, setWarrantyData] = useState([]);
  const [filteredWarrantyData, setFilteredWarrantyData] = useState([]);
  const [warrantySearchText, setWarrantySearchText] = useState("");
  const [warrantyLoading, setWarrantyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [warrantySelectedSede, setWarrantySelectedSede] = useState("general");

  // Definición de columnas con estilos mejorados
  const columns = [
    {
      title: "ID",
      dataIndex: "id_producto",
      sorter: (a, b) => a.id_producto - b.id_producto,
      width: 120,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
      responsive: ["md"],
    },
    {
      title: "Categoría",
      dataIndex: "nombre_categoria",
      width: 150,
      render: (category) => (
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
          {category}
        </Tag>
      ),
      filters: categories.map((cat) => ({
        text: cat.descripcion_categoria,
        value: cat.descripcion_categoria,
      })),
      onFilter: (value, record) => record.nombre_categoria.indexOf(value) === 0,
    },
    {
      title: "Nombre",
      dataIndex: "nombre_producto",
      sorter: (a, b) => a.nombre_producto.localeCompare(b.nombre_producto),
      ellipsis: true,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            shape="square"
            size={{ xs: 32, sm: 40 }}
            style={{
              backgroundColor: getProductColor(record.id_producto),
              marginRight: 8,
            }}
            icon={<InboxOutlined style={{ color: "#fff" }} />}
          />
          <div>
            <Text strong style={{ color: colors.text }}>
              {text}
            </Text>
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.descripcion_producto?.substring(0, 20)}
                {record.descripcion_producto?.length > 20 ? "..." : ""}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Precio",
      dataIndex: "precioventaact_producto",
      sorter: (a, b) => a.precioventaact_producto - b.precioventaact_producto,
      render: (price) => (
        <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
          ${Number(price).toLocaleString("es-CO")}
        </Text>
      ),
    },
    {
      title: "Costo",
      dataIndex: "costoventa_producto",
      sorter: (a, b) => a.costoventa_producto - b.costoventa_producto,
      render: (cost) => (
        <Text type="secondary" style={{ fontWeight: "500" }}>
          ${Number(cost).toLocaleString("es-CO")}
        </Text>
      ),
    },
    {
      title: "Existencia",
      dataIndex: "existencia_producto",
      sorter: (a, b) => a.existencia_producto - b.existencia_producto,
      render: (stock) => {
        let color = colors.success;
        if (stock <= 5) color = colors.danger;
        else if (stock <= 15) color = colors.warning;

        return (
          <Badge
            count={stock}
            showZero
            style={{
              backgroundColor: color,
              fontWeight: "bold",
              fontSize: "14px",
              padding: "0 8px",
              borderRadius: "10px",
            }}
          />
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 120,
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
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/detalles-producto/${record.id_producto}`);
            }}
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
            }}
            title="Ver detalles"
          />
          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDelete(record.id_producto)}
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

  // Columnas para productos en garantía/reparación
  const warrantyColumns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: 120,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
      responsive: ["md"],
    },
    {
      title: "Estado",
      dataIndex: "estado",
      width: 100,
      render: (estado) => {
        const isGarantia = estado === "G";
        return (
          <Tag
            color={isGarantia ? colors.warning : colors.accent}
            style={{
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: isGarantia ? colors.warning : colors.accent,
            }}
          >
            {isGarantia ? "GARANTÍA" : "REPARACIÓN"}
          </Tag>
        );
      },
    },
    {
      title: "Producto",
      dataIndex: "nombre_producto",
      sorter: (a, b) => a.nombre_producto.localeCompare(b.nombre_producto),
      ellipsis: true,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            shape="square"
            size={{ xs: 32, sm: 40 }}
            style={{
              backgroundColor: getProductColor(record.id),
              marginRight: 8,
            }}
            icon={<ToolOutlined style={{ color: "#fff" }} />}
          />
          <div>
            <Text strong style={{ color: colors.text }}>
              {text}
            </Text>
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Código: {record.id_producto}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      sorter: (a, b) => a.cantidad - b.cantidad,
      render: (cantidad) => (
        <Badge
          count={cantidad}
          showZero
          style={{
            backgroundColor: colors.secondary,
            fontWeight: "bold",
            fontSize: "14px",
            padding: "0 8px",
            borderRadius: "10px",
          }}
        />
      ),
    },
    {
      title: "Sede",
      dataIndex: "nombre_sede",
      render: (sede) => (
        <Tag
          color={colors.primary}
          style={{
            color: "#fff",
            padding: "2px 8px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: `${colors.primary}90`,
          }}
        >
          {sede}
        </Tag>
      ),
    },
    {
      title: "Cliente",
      dataIndex: "nombre_cliente",
      render: (nombre, record) => (
        <div>
          <Text strong style={{ color: colors.text }}>
            {nombre} {record.apellido_cliente}
          </Text>
          <div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.telefono_cliente}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Precio",
      dataIndex: "precioventaact_producto",
      sorter: (a, b) => a.precioventaact_producto - b.precioventaact_producto,
      render: (price) => (
        <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
          ${Number(price).toLocaleString("es-CO")}
        </Text>
      ),
    },
  ];

  // Función para generar colores basados en ID usando la paleta
  const getProductColor = (id) => {
    const productColors = [
      colors.primary,
      colors.secondary,
      colors.accent,
      "#5B9A82", // Verde azulado más vibrante
      "#2D93AD", // Azul turquesa más vibrante
    ];
    return productColors[id % productColors.length];
  };

  // Manejadores de eventos
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      message.error("El nombre de la categoría no puede estar vacío");
      return;
    }

    try {
      await crearCategoria({ descripcion_categoria: newCategory });

      message.success("Categoría creada exitosamente");
      setIsModalVisible(false);
      setNewCategory("");

      // Recargar las categorías
      const categoriesRes = await obtenerCategorias();
      setCategories(categoriesRes);
    } catch (error) {
      message.error("Error al crear la categoría");
      console.error(error);
    }
  };

  // Actualizar producto
  const handleUpdate = (record) => {
    window.location.href = `/actualizar-producto/${record.id_producto}`;
  };

  // Ver detalles del producto
  const handleViewDetails = (record) => {
    navigate(`/detalles-producto/${record.id_producto}`);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const data = await eliminarProducto(id);

      if (data.error) {
        throw new Error(data.error);
      }

      message.success("Producto eliminado exitosamente");
      setProductos((prev) => prev.filter((p) => p.id_producto !== id));
      fetchData(); // Recargar datos
    } catch (error) {
      message.error("Error al eliminar el producto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });
  };

  // Formateo de datos
  const formatData = (products) => {
    return products.map((item) => ({
      key: item.id_producto,
      id_producto: item.id_producto,
      nombre_categoria:
        categories
          .find((cat) => cat.id_categoria === item.id_categoria_producto)
          ?.descripcion_categoria.trim() || "Sin categoría",
      nombre_producto: item.nombre_producto,
      descripcion_producto: item.descripcion_producto,
      precioventaact_producto: item.precioventaact_producto,
      costoventa_producto: item.costoventa_producto,
      existencia_producto: item.existencia_producto,
    }));
  };

  // Función para cargar datos de garantía/reparación
  const fetchWarrantyData = async () => {
    setWarrantyLoading(true);
    try {
      let url = "";

      if (warrantySelectedSede === "general") {
        // Endpoint que trae todos los productos en garantía/reparación
        url = "https://cimove-backend.onrender.com/api/inventariolocal/estado";
      } else {
        // Buscar sede seleccionada
        const sedeEncontrada = sedes.find(
          (sede) => sede.nombre_sede === warrantySelectedSede
        );

        if (!sedeEncontrada) return;

        url = `https://cimove-backend.onrender.com/api/inventariolocal/estado/sede/${sedeEncontrada.id_sede}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const warrantyProducts = await response.json();

      setWarrantyData(warrantyProducts);
      setFilteredWarrantyData(warrantyProducts);
    } catch (error) {
      console.error("Error al obtener productos en garantía/reparación", error);
      message.error("Error al cargar productos en garantía/reparación");
    } finally {
      setWarrantyLoading(false);
    }
  };

  // Función para cargar datos del inventario
  const fetchData = async () => {
    setLoading(true);
    try {
      if (selectedSede === "general") {
        const productsRes = await obtenerProductosGeneral();
        setData(formatData(productsRes));
        setFilteredData(formatData(productsRes));
      } else {
        const sedeEncontrada = sedes.find(
          (sede) => sede.nombre_sede === selectedSede
        );

        if (!sedeEncontrada) return;

        const productsRes = await obtenerProductosPorSede(
          sedeEncontrada.id_sede
        );
        setData(formatData(productsRes));
        setFilteredData(formatData(productsRes));
      }
    } catch (error) {
      console.error("Error al obtener los datos", error);
      message.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    const fetchSedesYCategorias = async () => {
      try {
        const [categoriesRes, sedesRes] = await Promise.all([
          obtenerCategorias(),
          obtenerSedes(),
        ]);
        setCategories(categoriesRes);
        setSedes(sedesRes);
      } catch (error) {
        console.error("Error al obtener las sedes y categorías", error);
        message.error("Error al cargar datos iniciales");
      }
    };

    fetchSedesYCategorias();
  }, []);

  useEffect(() => {
    if (sedes.length > 0) {
      fetchData();
    }
  }, [selectedSede, sedes]);

  useEffect(() => {
    let filtered = [...data];

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) =>
          item.nombre_categoria.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    const query = searchText.toLowerCase();
    filtered = filtered.filter((item) => {
      const matchesName = item.nombre_producto.toLowerCase().includes(query);
      const matchesCode = item.id_producto?.toString().includes(query);
      return matchesName || matchesCode;
    });

    setFilteredData(filtered);
  }, [searchText, selectedCategory, data]);

  useEffect(() => {
    let filtered = [...warrantyData];

    if (warrantySearchText) {
      const query = warrantySearchText.toLowerCase();
      filtered = filtered.filter((item) => {
        const matchesName = item.nombre_producto.toLowerCase().includes(query);
        const matchesCode = item.id_producto?.toString().includes(query);
        const matchesClient = `${item.nombre_cliente} ${item.apellido_cliente}`
          .toLowerCase()
          .includes(query);
        return matchesName || matchesCode || matchesClient;
      });
    }

    setFilteredWarrantyData(filtered);
  }, [warrantySearchText, warrantyData]);

  useEffect(() => {
    if (activeTab === "warranty") {
      fetchWarrantyData();
    }
  }, [activeTab, warrantySelectedSede]);

  // Estadísticas rápidas
  const stats = {
    totalProducts: filteredData.length,
    totalStock: filteredData.reduce(
      (sum, item) => sum + item.existencia_producto,
      0
    ),
    lowStock: filteredData.filter((item) => item.existencia_producto <= 5)
      .length,
    totalValue: filteredData.reduce(
      (sum, item) =>
        sum + item.precioventaact_producto * item.existencia_producto,
      0
    ),
  };

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
            {activeTab === "inventory"
              ? selectedSede === "general"
                ? "Inventario General"
                : `Inventario de ${selectedSede}`
              : "  Productos en Garantía y Reparación"}
          </Title>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={activeTab === "inventory" ? fetchData : fetchWarrantyData}
            loading={activeTab === "inventory" ? loading : warrantyLoading}
            style={{
              borderRadius: "6px",
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
          >
            Actualizar
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginBottom: "16px" }}
          items={[
            {
              key: "inventory",
              label: (
                <span>
                  <InboxOutlined />
                  Inventario
                </span>
              ),
            },
            {
              key: "warranty",
              label: (
                <span>
                  <CustomerServiceOutlined />
                  Garantía y Reparación
                </span>
              ),
            },
          ]}
        />

        {activeTab === "inventory" ? (
          <>
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
                  title="Total Productos"
                  value={stats.totalProducts}
                  prefix={<InboxOutlined style={{ color: colors.primary }} />}
                  valueStyle={{ color: colors.primary }}
                />
              </Card>
              <Card
                size="small"
                style={{
                  width: "100%",
                  maxWidth: "220px",
                  flex: "1 1 220px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid ${colors.secondary}`,
                }}
              >
                <Statistic
                  title="Existencias Totales"
                  value={stats.totalStock}
                  prefix={
                    <BarChartOutlined style={{ color: colors.secondary }} />
                  }
                  valueStyle={{ color: colors.secondary }}
                />
              </Card>
              <Card
                size="small"
                style={{
                  width: "100%",
                  maxWidth: "220px",
                  flex: "1 1 220px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid ${colors.warning}`,
                }}
              >
                <Statistic
                  title="Productos Bajo Stock"
                  value={stats.lowStock}
                  prefix={<FilterOutlined style={{ color: colors.warning }} />}
                  valueStyle={{ color: colors.warning }}
                />
              </Card>
              <Card
                size="small"
                style={{
                  width: "100%",
                  maxWidth: "220px",
                  flex: "1 1 220px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid ${colors.accent}`,
                }}
              >
                <Statistic
                  title="Valor Total"
                  value={`$${stats.totalValue.toLocaleString("es-CO")}`}
                  prefix={<DollarOutlined style={{ color: colors.accent }} />}
                  valueStyle={{ color: colors.accent }}
                />
              </Card>
            </div>

            <Divider style={{ margin: "12px 0", borderColor: colors.light }} />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  flex: "1 1 300px",
                  maxWidth: "100%",
                }}
              >
                <Select
                  defaultValue="general"
                  style={{ width: "180px", borderRadius: "6px" }}
                  onChange={setSelectedSede}
                  placeholder="Seleccionar sede"
                  suffixIcon={
                    <FilterOutlined style={{ color: colors.primary }} />
                  }
                >
                  <Option value="general">Inventario General</Option>
                  {sedes.map((sede) => (
                    <Option key={sede.id_sede} value={sede.nombre_sede}>
                      {sede.nombre_sede}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="Filtrar por categoría"
                  onChange={setSelectedCategory}
                  style={{ width: "180px", borderRadius: "6px" }}
                  allowClear
                  suffixIcon={
                    <FilterOutlined style={{ color: colors.primary }} />
                  }
                >
                  {categories.map((cat) => (
                    <Option
                      key={cat.id_categoria}
                      value={cat.descripcion_categoria}
                    >
                      {cat.descripcion_categoria}
                    </Option>
                  ))}
                </Select>

                <Search
                  placeholder="Buscar por nombre"
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: "220px", borderRadius: "6px" }}
                  allowClear
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "8px",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/registro-producto")}
                  style={{
                    borderRadius: "6px",
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  }}
                >
                  Añadir Producto
                </Button>
                <Button
                  type="primary"
                  icon={<AppstoreAddOutlined />}
                  onClick={() => navigate("/anadir-novedad")}
                  style={{
                    borderRadius: "6px",
                    backgroundColor: colors.secondary,
                    borderColor: colors.secondary,
                  }}
                >
                  Añadir Novedad
                </Button>
                <Button
                  type="primary"
                  icon={<TagsOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  style={{
                    borderRadius: "6px",
                    backgroundColor: colors.accent,
                    borderColor: colors.accent,
                  }}
                >
                  Crear Categoría
                </Button>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => navigate("/anadir-stock")}
                  style={{
                    borderRadius: "6px",
                    backgroundColor: "#5B9A82",
                    borderColor: "#5B9A82",
                  }}
                >
                  Añadir Stock
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
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
                  borderLeft: `4px solid ${colors.warning}`,
                }}
              >
                <Statistic
                  title="En Garantía"
                  value={
                    filteredWarrantyData.filter((item) => item.estado === "G")
                      .length
                  }
                  prefix={
                    <CustomerServiceOutlined
                      style={{ color: colors.warning }}
                    />
                  }
                  valueStyle={{ color: colors.warning }}
                />
              </Card>
              <Card
                size="small"
                style={{
                  width: "100%",
                  maxWidth: "220px",
                  flex: "1 1 220px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid ${colors.accent}`,
                }}
              >
                <Statistic
                  title="En Reparación"
                  value={
                    filteredWarrantyData.filter((item) => item.estado === "R")
                      .length
                  }
                  prefix={<ToolOutlined style={{ color: colors.accent }} />}
                  valueStyle={{ color: colors.accent }}
                />
              </Card>
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
                  title="Total Productos"
                  value={filteredWarrantyData.length}
                  prefix={<InboxOutlined style={{ color: colors.primary }} />}
                  valueStyle={{ color: colors.primary }}
                />
              </Card>
            </div>

            <Divider style={{ margin: "12px 0", borderColor: colors.light }} />

            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Select
                defaultValue="general"
                style={{ width: "180px", borderRadius: "6px" }}
                onChange={setWarrantySelectedSede}
                placeholder="Seleccionar sede"
                suffixIcon={
                  <FilterOutlined style={{ color: colors.primary }} />
                }
              >
                <Option value="general">Todas las Sedes</Option>
                {sedes.map((sede) => (
                  <Option key={sede.id_sede} value={sede.nombre_sede}>
                    {sede.nombre_sede}
                  </Option>
                ))}
              </Select>

              <Search
                placeholder="Buscar por producto, código o cliente"
                onChange={(e) => setWarrantySearchText(e.target.value)}
                style={{ width: "300px", borderRadius: "6px" }}
                allowClear
              />
            </div>
          </>
        )}
      </Card>

      <Card
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        bodyStyle={{ padding: "0" }}
      >
        <Table
          columns={activeTab === "inventory" ? columns : warrantyColumns}
          dataSource={
            activeTab === "inventory" ? filteredData : filteredWarrantyData
          }
          loading={activeTab === "inventory" ? loading : warrantyLoading}
          onChange={handleTableChange}
          pagination={{
            ...tableParams.pagination,
            style: { marginRight: "16px" },
            responsive: true,
            size: "small",
          }}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: "12px 0" }}>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {record.descripcion_producto || "Sin descripción disponible"}
                </Text>
              </div>
            ),
            expandRowByClick: true,
          }}
          style={{ marginTop: "0" }}
          size="small"
        />
      </Card>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TagsOutlined style={{ color: colors.accent }} />
            <span>Crear Nueva Categoría</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleCreateCategory}
        onCancel={() => setIsModalVisible(false)}
        okText="Crear"
        cancelText="Cancelar"
        okButtonProps={{
          style: { backgroundColor: colors.accent, borderColor: colors.accent },
        }}
      >
        <Input
          placeholder="Nombre de la nueva categoría"
          value={newCategory}
          maxLength={35}
          onChange={(e) => setNewCategory(e.target.value)}
          prefix={<TagsOutlined style={{ color: "#bfbfbf" }} />}
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

export default Inventario;
