import axios from "axios";

//const BASE_URL = "https://cimove-backend.onrender.com/api/estadisticas";
const BASE_URL = "http://localhost:4000/api";


// Productos
export const obtenerTopProductosPorCantidad = () =>
  fetch(`${BASE_URL}/estadisticas/productos/top-/cantidad`).then((res) => res.json());

export const obtenerTopProductosPorValor = () =>
  fetch(`${BASE_URL}/estadisticas/productos/top-valor`).then((res) => res.json());

export const obtenerProductosFrecuentes = () =>
  fetch(`${BASE_URL}/estadisticas/productos/frecuentes`).then((res) => res.json());

export const obtenerStockVsVentas = () =>
  fetch(`${BASE_URL}/estadisticas/productos/stock-vs-ventas`).then((res) => res.json());

export const obtenerProductosObsoletos = () =>
  fetch(`${BASE_URL}/estadisticas/productos/obsoletos`).then((res) => res.json());

// Clientes
export const obtenerTopClientesPorMonto = () =>
  fetch(`${BASE_URL}/estadisticas/clientes/top-monto`).then((res) => res.json());

export const obtenerTopClientesPorCantidad = () =>
  fetch(`${BASE_URL}/estadisticas/clientes/top-cantidad`).then((res) => res.json());

export const obtenerTopClientesPorFrecuencia = () =>
  fetch(`${BASE_URL}/estadisticas/clientes/frecuencia`).then((res) => res.json());

export const obtenerClientesFrecuentesVsEsporadicos = () =>
  fetch(`${BASE_URL}/estadisticas/clientes/frecuentes-vs-esporadicos`).then((res) =>
    res.json()
  );

export const obtenerClientesConPagosPendientes = () =>
  fetch(`${BASE_URL}/estadisticas/clientes/con-pagos-pendientes`).then((res) => res.json());

//Ingresos
export const getIngresosTotales = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/total-pagado`)).data;

export const getIngresosPorDia = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/dia`)).data;

export const getIngresosPorMes = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/mes`)).data;

export const getIngresosPorMetodoPago = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/metodo-pago`)).data;

export const getVentasPorSede = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ventas/sede`)).data;

export const getVentasPorSedePorMes = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ventas/sede/mes`)).data;

export const getVentasPorSedePorDia = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ventas/sede/dia`)).data;

//Clientes
export const getClientesConPagosPendientes = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/clientes/con-pagos-pendientes`)).data;

export const getTopClientesPorMonto = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/clientes/top-monto`)).data;

//Pagos a proveedores
export const getPagosProveedoresTotales = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/pagos/proveedores/total`)).data;

export const getPagosProveedoresPorMes = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/pagos/proveedores/mes`)).data;

//Nómina
export const getNominaPorSedeYRol = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/nomina/sede-rol`)).data;
