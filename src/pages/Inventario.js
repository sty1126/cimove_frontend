import React, { useState } from "react";
import { Table, Input, Select } from "antd";

const { Search } = Input;
const { Option } = Select;

const columns = [
  {
    title: "ID Producto",
    dataIndex: "id_producto",
    sorter: (a, b) => a.id_producto - b.id_producto,
  },
  {
    title: "Categoría",
    dataIndex: "categoria",
  },
  {
    title: "Nombre",
    dataIndex: "nombre",
    sorter: (a, b) => a.nombre.localeCompare(b.nombre),
  },
  {
    title: "Descripción",
    dataIndex: "descripcion",
  },
  {
    title: "Precio",
    dataIndex: "precio",
    sorter: (a, b) => a.precio - b.precio,
  },
  {
    title: "Costo Venta",
    dataIndex: "costo_venta",
    sorter: (a, b) => a.costo_venta - b.costo_venta,
  },
  {
    title: "IVA",
    dataIndex: "iva",
    sorter: (a, b) => a.iva - b.iva,
  },
  {
    title: "Existencia",
    dataIndex: "existencia",
    sorter: (a, b) => a.existencia - b.existencia,
  },
];

const data = [
  {
    key: "1",
    id_producto: 1,
    categoria: "1",
    nombre: "Producto Prueba A",
    descripcion: "Descripción A",
    precio: 10000,
    costo_venta: 8000,
    iva: 0.19,
    existencia: 10,
  },
  {
    key: "2",
    id_producto: 2,
    categoria: "1",
    nombre: "Producto Prueba B",
    descripcion: "Descripción B",
    precio: 11000,
    costo_venta: 8500,
    iva: 0.19,
    existencia: 15,
  },
  {
    key: "3",
    id_producto: 3,
    categoria: "2",
    nombre: "Producto Prueba C",
    descripcion: "Descripción C",
    precio: 12000,
    costo_venta: 9000,
    iva: 0.19,
    existencia: 20,
  },
  {
    key: "4",
    id_producto: 4,
    categoria: "2",
    nombre: "Producto Prueba D",
    descripcion: "Descripción D",
    precio: 13000,
    costo_venta: 9500,
    iva: 0.19,
    existencia: 25,
  },
  {
    key: "5",
    id_producto: 5,
    categoria: "3",
    nombre: "Producto Prueba E",
    descripcion: "Descripción E",
    precio: 14000,
    costo_venta: 10000,
    iva: 0.19,
    existencia: 30,
  },
];

const Inventario = () => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
    filterData(value, selectedCategory);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    filterData(searchText, value);
  };

  const filterData = (search, category) => {
    let filtered = data;
    if (category) {
      filtered = filtered.filter((item) => item.categoria === category);
    }
    if (search) {
      filtered = filtered.filter((item) =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredData(filtered);
  };

  return (
    <div>
      <h1>Inventario</h1>
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
          <Option value="1">Categoría 1</Option>
          <Option value="2">Categoría 2</Option>
          <Option value="3">Categoría 3</Option>
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
