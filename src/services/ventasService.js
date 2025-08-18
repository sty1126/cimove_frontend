import axios from "axios";

// const BASE_URL = "https://cimove-backend.onrender.com/api";
const BASE_URL = "http://localhost:4000/api";

// Obtener tipos de métodos de pago
export const obtenerMetodosPago = async () => {
  const response = await axios.get(`${BASE_URL}/tipometodopago`);
  return response.data;
};

// Registrar una nueva venta
export const registrarVenta = async (ventaData) => {
  const response = await axios.post(`${BASE_URL}/factura`, ventaData);
  return response;
};

// Obtener todas las facturas de ventas
export const obtenerFacturasVenta = async () => {
  const res = await axios.get(`${BASE_URL}/factura`);
  return res.data;
};

// Obtener todas las facturas de servicios técnicos
export const obtenerFacturasServicioTecnico = async () => {
  const res = await axios.get(`${BASE_URL}/serviciotecnico`);
  return res.data;
};

// Obtener categorías de productos
export const obtenerCategorias = async () => {
  const res = await axios.get(`${BASE_URL}/categorias`);
  return res.data;
};

// Obtener productos por sede
export const obtenerProductosPorSede = async (idSede) => {
  const res = await axios.get(`${BASE_URL}/inventariolocal/sede/${idSede}`);
  return res.data;
};

// Buscar producto por código
export const buscarProductoPorCodigo = async (codigo) => {
  const res = await axios.get(`${BASE_URL}/productos/${codigo}`);
  return res.data;
};
