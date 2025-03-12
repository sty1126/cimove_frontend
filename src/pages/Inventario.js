import React, { useState, useEffect } from "react";
import { Table, Input, Select, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusOutlined,
  AppstoreAddOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
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
          <a
            href={`/actualizar-producto/${record.id_producto}`}
            style={{
              color: "#1890ff",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Actualizar
          </a>
          <a
            href={`/detalles-producto/${record.id_producto}`}
            style={{
              color: "#1890ff",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Detalles
          </a>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get(
          "http://localhost:4000/api/categorias"
        );
        const productsRes = await axios.get(
          "http://localhost:4000/api/productos/detalles"
        );
        const sedesRes = await axios.get("http://localhost:4000/api/sedes");

        setCategories(categoriesRes.data);
        setSedes(sedesRes.data);

        const formattedData = productsRes.data.map((item) => {
          const categoria = categoriesRes.data.find(
            (cat) => cat.id_categoria === item.id_categoria_producto
          );
          return {
            key: item.id_producto,
            id_producto: item.id_producto,
            nombre_categoria: categoria
              ? categoria.descripcion_categoria.trim()
              : "Sin categoría",
            nombre_producto: item.nombre_producto,
            descripcion_producto: item.descripcion_producto,
            precioventaact_producto: item.precioventaact_producto,
            costoventa_producto: item.costoventa_producto,
            existencia_producto: item.existencia_producto,
            sede: item.sede || "general",
          };
        });

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    fetchData();
  }, []);

  const filterData = (search, category, sede) => {
    let filtered = data.filter(
      (item) => sede === "general" || item.sede === sede
    );

    if (category) {
      filtered = filtered.filter(
        (item) => item.nombre_categoria.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      filtered = filtered.filter((item) =>
        item.nombre_producto.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData(searchText, selectedCategory, selectedSede);
  }, [selectedSede]);

  const handleSearch = (value) => {
    setSearchText(value);
    filterData(value, selectedCategory, selectedSede);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value || "");
    filterData(searchText, value || "", selectedSede);
  };

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
        <div style={{ display: "flex", gap: "10px" }}>
          <Select
            placeholder="Seleccionar sede"
            onChange={setSelectedSede}
            style={{ width: 200 }}
            defaultValue="general"
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
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Filtrar por categoría"
            onChange={handleCategoryChange}
            style={{ width: 200 }}
            allowClear
          >
            {categories.map((cat) => (
              <Option key={cat.id_categoria} value={cat.descripcion_categoria}>
                {cat.descripcion_categoria}
              </Option>
            ))}
          </Select>
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
            onClick={() => navigate("/añadir-novedad")}
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
            onClick={() => navigate("/crear-categoria")}
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
        showSorterTooltip={{ target: "sorter-icon" }}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.descripcion_producto}</p>
          ),
        }}
      />
    </div>
  );
};

export default Inventario;
