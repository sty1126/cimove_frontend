import axios from "axios";

const BASE_URL = "https://cimove-backend.onrender.com/api/estadisticas";

// Productos
export const obtenerTopProductosPorCantidad = () =>
  fetch(`${BASE_URL}/top-productos/cantidad`).then((res) => res.json());

export const obtenerTopProductosPorValor = () =>
  fetch(`${BASE_URL}/top-productos/valor`).then((res) => res.json());

export const obtenerProductosFrecuentes = () =>
  fetch(`${BASE_URL}/productos-frecuentes`).then((res) => res.json());

export const obtenerStockVsVentas = () =>
  fetch(`${BASE_URL}/stock-vs-ventas`).then((res) => res.json());

export const obtenerProductosObsoletos = () =>
  fetch(`${BASE_URL}/productos-obsoletos`).then((res) => res.json());

// Clientes
export const obtenerTopClientesPorMonto = () =>
  fetch(`${BASE_URL}/top-clientes/monto`).then((res) => res.json());

export const obtenerTopClientesPorCantidad = () =>
  fetch(`${BASE_URL}/top-clientes/cantidad`).then((res) => res.json());

export const obtenerTopClientesPorFrecuencia = () =>
  fetch(`${BASE_URL}/top-clientes/frecuencia`).then((res) => res.json());

export const obtenerClientesFrecuentesVsEsporadicos = () =>
  fetch(`${BASE_URL}/clientes-frecuentes-vs-esporadicos`).then((res) =>
    res.json()
  );

export const obtenerClientesConPagosPendientes = () =>
  fetch(`${BASE_URL}/clientes-pagos-pendientes`).then((res) => res.json());

export const getIngresosTotales = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/total`)).data;

export const getIngresosPorDia = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/dia`)).data;

export const getIngresosPorMes = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/mes`)).data;

export const getIngresosPorMetodoPago = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/metodo-pago`)).data;

export const getVentasPorSede = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/sede`)).data;

export const getVentasPorSedePorMes = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/sedemes`)).data;

export const getVentasPorSedePorDia = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/ingresos/sededia`)).data;

export const getClientesConPagosPendientes = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/clientes-pagos-pendientes`)).data;

export const getTopClientesPorMonto = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/top-clientes/monto`)).data;

export const getPagosProveedoresTotales = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/pagos-proveedores/totales`)).data;

export const getPagosProveedoresPorMes = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/pagos-proveedores/por-mes`)).data;

export const getNominaPorSedeYRol = async () =>
  (await axios.get(`${BASE_URL}/estadisticas/nomina/por-sede-rol`)).data;
