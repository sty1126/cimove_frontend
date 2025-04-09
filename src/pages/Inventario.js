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
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

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

  // Definición de columnas con estilos mejorados
  const columns = [
    {
      title: "ID",
      dataIndex: "id_producto",
      sorter: (a, b) => a.id_producto - b.id_producto,
      width: 80,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
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
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            shape="square"
            size={40}
            style={{
              backgroundColor: getProductColor(record.id_producto),
              marginRight: 12,
            }}
            icon={<InboxOutlined style={{ color: "#fff" }} />}
          />
          <div>
            <Text strong style={{ color: colors.text }}>
              {text}
            </Text>
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.descripcion_producto?.substring(0, 30)}
                {record.descripcion_producto?.length > 30 ? "..." : ""}
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
      width: 150,
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
      await axios.post("http://localhost:4000/api/categorias", {
        descripcion_categoria: newCategory,
      });

      message.success("Categoría creada exitosamente");
      setIsModalVisible(false);
      setNewCategory("");

      // Recargar las categorías después de crear una nueva
      const categoriesRes = await axios.get(
        "http://localhost:4000/api/categorias"
      );
      setCategories(categoriesRes.data);
    } catch (error) {
      message.error("Error al crear la categoría");
      console.error(error);
    }
  };

  const handleUpdate = (record) => {
    window.location.href = `/actualizar-producto/${record.id_producto}`;
  };

  const handleViewDetails = (record) => {
    window.open(`/detalles-producto/${record.id_producto}`, "_blank");
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/productos/eliminar/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar");
      }

      message.success("Producto eliminado exitosamente");
      setProductos((prev) => prev.filter((p) => p.id_producto !== id));

      // Recargar datos
      fetchData();
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

  // Efectos
  useEffect(() => {
    const fetchSedesYCategorias = async () => {
      try {
        const [categoriesRes, sedesRes] = await Promise.all([
          axios.get("http://localhost:4000/api/categorias"),
          axios.get("http://localhost:4000/api/sedes"),
        ]);
        setCategories(categoriesRes.data);
        setSedes(sedesRes.data);
      } catch (error) {
        console.error("Error al obtener las sedes y categorías", error);
        message.error("Error al cargar datos iniciales");
      }
    };

    fetchSedesYCategorias();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (selectedSede === "general") {
        const productsRes = await axios.get(
          "http://localhost:4000/api/productos/detalles"
        );
        setData(formatData(productsRes.data));
        setFilteredData(formatData(productsRes.data));
      } else {
        const sedeEncontrada = sedes.find(
          (sede) => sede.nombre_sede === selectedSede
        );

        if (!sedeEncontrada) return;

        const productsRes = await axios.get(
          `http://localhost:4000/api/inventariolocal/sede/${sedeEncontrada.id_sede}`
        );
        setData(formatData(productsRes.data));
        setFilteredData(formatData(productsRes.data));
      }
    } catch (error) {
      console.error("Error al obtener los datos", error);
      message.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

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

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.nombre_producto.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (searchCode) {
      const searchNumber = Number.parseInt(searchCode, 10);
      if (!isNaN(searchNumber)) {
        filtered = filtered.filter((item) => item.id_producto === searchNumber);
      }
    }

    setFilteredData(filtered);
  }, [searchCode, searchText, selectedCategory, data]);

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
            {selectedSede === "general"
              ? "Inventario General"
              : `Inventario de ${selectedSede}`}
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
              title="Total Productos"
              value={stats.totalProducts}
              prefix={<InboxOutlined style={{ color: colors.primary }} />}
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
              title="Existencias Totales"
              value={stats.totalStock}
              prefix={<BarChartOutlined style={{ color: colors.secondary }} />}
              valueStyle={{ color: colors.secondary }}
            />
          </Card>
          <Card
            size="small"
            style={{
              width: "220px",
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
              width: "220px",
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
            gap: "16px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              flex: "1 1 500px",
              maxWidth: "800px",
            }}
          >
            <Select
              defaultValue="general"
              style={{ width: "180px", borderRadius: "6px" }}
              onChange={setSelectedSede}
              placeholder="Seleccionar sede"
              suffixIcon={<FilterOutlined style={{ color: colors.primary }} />}
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
              suffixIcon={<FilterOutlined style={{ color: colors.primary }} />}
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
              style={{ width: "180px", borderRadius: "6px" }}
              allowClear
            />

            <Search
              placeholder="Buscar por código"
              onChange={(e) => setSearchCode(e.target.value)}
              style={{ width: "180px", borderRadius: "6px" }}
              allowClear
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
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
      </Card>

      <Card
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        bodyStyle={{ padding: "0" }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
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
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {record.descripcion_producto || "Sin descripción disponible"}
                </Text>
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
