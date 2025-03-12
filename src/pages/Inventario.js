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
            style={{ color: "#1890ff", textDecoration: "underline" }}
          >
            Actualizar
          </a>
          <a
            href={`/detalles-producto/${record.id_producto}`}
            style={{ color: "#1890ff", textDecoration: "underline" }}
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
          console.log("Inventario General:", productsRes.data); // Imprimir datos recibidos
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
          console.log(`Inventario de ${selectedSede}:`, productsRes.data); // Imprimir datos recibidos
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

    setFilteredData(filtered);
  }, [searchText, selectedCategory, data]);

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
            defaultValue="general"
            style={{ width: 200 }}
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
            style={{ width: 200 }}
          />
          <Select
            placeholder="Filtrar por categoría"
            onChange={setSelectedCategory}
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
