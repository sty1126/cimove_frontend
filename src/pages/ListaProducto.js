import React, { useState, useEffect } from "react";
import { Table, Input, Select } from "antd";
import axios from "axios";

const { Search } = Input;
const { Option } = Select;

// Definir las columnas de la tabla
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
  { title: "Descripción", dataIndex: "descripcion_producto" },
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
    dataIndex: "existencia_inventario",
    sorter: (a, b) => a.existencia_inventario - b.existencia_inventario,
  },
];

const Inventario = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Obtener categorías y productos
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get(
          "http://localhost:4000/api/categorias"
        );
        const productsRes = await axios.get(
          "http://localhost:4000/api/productos"
        );

        setCategories(categoriesRes.data);

        // Formatear datos para la tabla
        const formattedData = productsRes.data.map((item) => ({
          key: item.id_producto,
          id_producto: item.id_producto,
          nombre_categoria:
            categoriesRes.data
              .find((cat) => cat.id_categoria === item.id_categoria_producto)
              ?.descripcion_categoria.trim() || "Sin categoría",
          nombre_producto: item.nombre_producto,
          descripcion_producto: item.descripcion_producto,
          precioventaact_producto: item.precioventaact_producto,
          costoventa_producto: item.costoventa_producto,
          existencia_inventario: item.existencia_inventario ?? 0, // Asegura que no sea undefined
        }));

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    fetchData();
  }, []);

  // Función de filtrado
  const filterData = (search, category) => {
    let filtered = data;

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

  // Manejo de búsqueda por nombre
  const handleSearch = (value) => {
    setSearchText(value);
    filterData(value, selectedCategory);
  };

  // Manejo de cambio en la categoría
  const handleCategoryChange = (value) => {
    setSelectedCategory(value || ""); // Evita undefined
    filterData(searchText, value || "");
  };

  return (
    <div>
      <br></br>
      <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
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
      <Table
        columns={columns}
        dataSource={filteredData}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </div>
  );
};

export default Inventario;
