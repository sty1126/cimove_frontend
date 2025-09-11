import axios from "axios";

const BASE_URL = "https://cimove-backend.onrender.com/api";
//const BASE_URL = "http://localhost:4000/api";

// Obtener tipos de movimiento
export const getTiposMovimiento = async () => {
  const response = await axios.get(`${BASE_URL}/movimientos/tipo`);
  return response.data;
};

// Obtener sedes
export const getSedes = async () => {
  const response = await axios.get(`${BASE_URL}/sedes`);
  return response.data;
};

// Registrar una novedad (movimiento)
export const crearNovedad = async (novedad) => {
  const response = await axios.post(`${BASE_URL}/movimientos`, novedad);
  return response.data;
};

// Verificar si un producto ya existe en una sede
export const verificarExistenciaProductoEnSede = async (idProducto, idSede) => {
  const response = await fetch(
    `${BASE_URL}/inventariolocal/existe/${idProducto}/${idSede}`
  );
  if (!response.ok)
    throw new Error("Error al verificar existencia del producto en la sede");
  return await response.json(); // { existe: true/false }
};

// Ajustar stock de producto existente
export const ajustarInventario = async (idProducto, idSede, cantidad) => {
  const response = await fetch(
    `${BASE_URL}/inventariolocal/${idProducto}/${idSede}/ajustar`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad }),
    }
  );
  if (!response.ok) throw new Error("Error al ajustar el stock existente");
  return await response.json();
};

// Registrar stock nuevo para producto en sede
export const registrarInventarioNuevo = async (data) => {
  const response = await fetch(`${BASE_URL}/inventariolocal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al registrar nuevo stock");
  return await response.json();
};

// Crear categoría
export const crearCategoria = async (data) => {
  const response = await fetch(`${BASE_URL}/categorias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear categoría");
  return await response.json();
};

// Obtener categorías
export const obtenerCategorias = async () => {
  const response = await fetch(`${BASE_URL}/categorias`);
  if (!response.ok) throw new Error("Error al obtener categorías");
  return await response.json();
};

// Eliminar producto
export const eliminarProducto = async (id) => {
  const response = await fetch(`${BASE_URL}/productos/eliminar/${id}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error("Error al eliminar producto");
  return await response.json();
};

// Obtener sedes
export const obtenerSedes = async () => {
  const response = await fetch(`${BASE_URL}/sedes`);
  if (!response.ok) throw new Error("Error al obtener sedes");
  return await response.json();
};

// Obtener todos los productos con detalles (vista general)
export const obtenerProductosGeneral = async () => {
  const response = await fetch(`${BASE_URL}/productos/detalles`);
  if (!response.ok) throw new Error("Error al obtener productos generales");
  return await response.json();
};

// Obtener productos por sede
export const obtenerProductosPorSede = async (idSede) => {
  const response = await fetch(`${BASE_URL}/inventariolocal/sede/${idSede}`);
  if (!response.ok) throw new Error("Error al obtener productos por sede");
  return await response.json();
};
