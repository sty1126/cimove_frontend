import axios from "axios";

const BASE_URL = "https://cimove-backend.onrender.com/api";
//const BASE_URL = "http://localhost:4000/api";

// Obtener producto por ID
export const obtenerProductoPorId = async (id) => {
  const response = await axios.get(`${BASE_URL}/productos/${id}`);
  if (!response.data) throw new Error("Producto no encontrado");
  return Array.isArray(response.data) ? response.data[0] : response.data;
};

// Actualizar producto
export const actualizarProducto = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/productos/${id}`, data);
  return response.data;
};

// Obtener todas las categorías
export const obtenerCategorias = async () => {
  const response = await axios.get(`${BASE_URL}/categorias`);
  return response.data;
};

// Obtener detalles del producto por ID
export const obtenerDetalleProducto = async (id) => {
  const response = await fetch(`${BASE_URL}/productos/detalle/${id}`);
  if (!response.ok) throw new Error("Error al obtener detalles del producto");
  return await response.json();
};

// Obtener proveedores por ID de producto
export const obtenerProveedoresPorProducto = async (idProducto) => {
  const response = await fetch(
    `${BASE_URL}/productos/${idProducto}/proveedores`
  );
  if (!response.ok)
    throw new Error("Error al obtener proveedores del producto");
  return await response.json();
};

// Obtener lista de productos
export const obtenerProductos = async () => {
  const response = await fetch(`${BASE_URL}/productos`);
  if (!response.ok) throw new Error("Error al obtener productos");
  return await response.json();
};

// Crear producto
export const registrarProducto = async (producto) => {
  const response = await fetch(`${BASE_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });

  if (!response.ok) {
    throw new Error("Error al registrar el producto");
  }

  return await response.json(); // Debe retornar { id_producto: ... }
};

// Obtener productos por sede
export const obtenerProductosPorSede = async (idSede) => {
  const response = await fetch(`${BASE_URL}/inventariolocal/sede/${idSede}`);
  if (!response.ok) throw new Error("Error al obtener productos por sede");
  return await response.json();
};

// Obtener producto por código
export const obtenerProductoPorCodigo = async (codigo) => {
  const response = await axios.get(`${BASE_URL}/productos/${codigo}`);
  if (!response.data) throw new Error("Producto no encontrado");
  return response.data;
};

// Obtener nombre de sede
export const obtenerNombreSede = async (idSede) => {
  const response = await fetch(`${BASE_URL}/sedes/${idSede}`);
  if (!response.ok) throw new Error("Error al obtener nombre de la sede");
  return await response.json(); // { nombre_sede: "..." }
};

// Obtener todos los productos
export const obtenerTodosLosProductos = async () => {
  const response = await fetch(`${BASE_URL}/productos`);
  if (!response.ok) throw new Error("Error al obtener productos");
  return await response.json();
};

// Obtener todos los productos con detalles generales
export const obtenerProductosGenerales = async () => {
  const response = await axios.get(`${BASE_URL}/productos/detalles`);
  return response.data;
};
