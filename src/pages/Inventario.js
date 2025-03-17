import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  message,
  Popconfirm,
  Tooltip,
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
} from "@ant-design/icons";

const Inventario = () => {
  const { Search } = Input;
  const { Option } = Select;
  const navigate = useNavigate();

  const columns = [
    {
      title: "ID Producto",
      dataIndex: "id_producto",
      sorter: (a, b) => a.id_producto - b.id_producto,
    },
    { title: "Categoría", dataIndex: "nombre_categoria" },
    {
      title: "Nombre",
      dataIndex: "nombre_producto",
      sorter: (a, b) => a.nombre_producto.localeCompare(b.nombre_producto),
    },
    {
      title: "Precio",
      dataIndex: "precioventaact_producto",
      sorter: (a, b) => a.precioventaact_producto - b.precioventaact_producto,
    },
    {
      title: "Costo Venta",
      dataIndex: "costoventa_producto",
      sorter: (a, b) => a.costoventa_producto - b.costoventa_producto,
    },
    {
      title: "Existencia",
      dataIndex: "existencia_producto",
      sorter: (a, b) => a.existencia_producto - b.existencia_producto,
    },
    {
      title: " ",
      key: "acciones",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="Actualizar">
            <Button
              type="link"
              onClick={() => handleUpdate(record)}
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
            />
          </Tooltip>

          <Tooltip title="Detalles">
            <Button
              type="link"
              onClick={() => handleViewDetails(record)}
              icon={<EyeOutlined style={{ color: "#52c41a" }} />}
            />
          </Tooltip>

          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            onConfirm={() => handleDelete(record.id_producto)}
            okText="Sí"
            cancelText="No"
          >
            <Tooltip title="Eliminar">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [selectedSede, setSelectedSede] = useState("general");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [searchCode, setSearchCode] = useState(""); // <-- Agregamos el estado

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
      }
    };

    fetchSedesYCategorias();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
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
      }
    };

    if (sedes.length > 0) {
      fetchData();
    }
  }, [selectedSede, sedes]);

  const handleUpdate = (record) => {
    window.location.href = `/actualizar-producto/${record.id_producto}`;
  };

  const handleViewDetails = (record) => {
    window.location.href = `/detalles-producto/${record.id_producto}`;
  };

  const handleDelete = (record) => {
    window.location.href = `/actualizar-producto/${record.id_producto}`;
  };

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
      const searchNumber = parseInt(searchCode, 10); // Convertimos a número
      if (!isNaN(searchNumber)) {
        filtered = filtered.filter((item) => item.id_producto === searchNumber);
      }
    }

    setFilteredData(filtered);
  }, [searchCode, searchText, selectedCategory, data]);

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        {selectedSede === "general"
          ? "Inventario General"
          : `Inventario de ${selectedSede}`}
      </h1>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 2 columnas
            gap: "10px", // Espaciado entre elementos
            maxWidth: "450px", // Ajusta el ancho máximo según el diseño
            marginBottom: "16px",
          }}
        >
          <Select
            defaultValue="general"
            style={{ width: "100%" }}
            onChange={setSelectedSede}
          >
            <Option value="general">Inventario General</Option>
            {sedes.map((sede) => (
              <Option key={sede.id_sede} value={sede.nombre_sede}>
                {sede.nombre_sede}
              </Option>
            ))}
          </Select>
          <Search
            placeholder="Buscar por nombre"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%" }}
          />
          <Select
            placeholder="Filtrar por categoría"
            onChange={setSelectedCategory}
            style={{ width: "100%" }}
            allowClear
          >
            {categories.map((cat) => (
              <Option key={cat.id_categoria} value={cat.descripcion_categoria}>
                {cat.descripcion_categoria}
              </Option>
            ))}
          </Select>
          <Search
            placeholder="Buscar por código"
            onChange={(e) => setSearchCode(e.target.value)}
            style={{ width: "100%" }}
          />{" "}
          {categories.map((cat) => (
            <Option key={cat.id_categoria} value={cat.descripcion_categoria}>
              {cat.descripcion_categoria}
            </Option>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
            maxWidth: "400px",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/registro-producto")}
          >
            Añadir Producto
          </Button>
          <Button
            type="default"
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              color: "white",
            }}
            icon={<AppstoreAddOutlined />}
            onClick={() => navigate("/anadir-novedad")}
          >
            Añadir Novedad
          </Button>
          <Button
            type="default"
            style={{
              backgroundColor: "#faad14",
              borderColor: "#faad14",
              color: "white",
            }}
            icon={<TagsOutlined />}
            onClick={() => setIsModalVisible(true)} // Abre el modal de Categoría
          >
            Crear Categoría
          </Button>
          <Button
            type="default"
            style={{
              backgroundColor: "#722ed1",
              borderColor: "#722ed1",
              color: "white",
            }}
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate("/añadir-stock")}
          >
            Añadir Stock
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.descripcion_producto}</p>
          ),
        }}
      />

      <Modal
        title="Crear Nueva Categoría"
        open={isModalVisible}
        onOk={handleCreateCategory}
        onCancel={() => setIsModalVisible(false)}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nombre de la nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Inventario;
