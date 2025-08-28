import axios from "axios";

// const BASE_URL = "https://cimove-backend.onrender.com/api";
const BASE_URL = "http://localhost:4000/api";

// ESTADÍSTICAS DE PRODUCTOS

export const obtenerTopProductosPorCantidad = async (limite = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/productos/top-por-cantidad`, {
      params: { limite }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos por cantidad:", error);
    return [];
  }
};

export const obtenerTopProductosPorValor = async (limite = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/productos/top-por-valor`, {
      params: { limite }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos por valor:", error);
    return [];
  }
};

export const obtenerProductosFrecuentes = async (limite = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/productos/frecuentes`, {
      params: { limite }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos frecuentes:", error);
    return [];
  }
};

export const obtenerStockVsVentas = async (limite = 100) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/productos/stock-vs-ventas`, {
      params: { limite }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos de stock vs ventas:", error);
    return [];
  }
};

export const obtenerProductosObsoletos = async (dias = 90, limite = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/productos/obsoletos`, {
      params: { dias, limite }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos obsoletos:", error);
    return [];
  }
};

// ESTADÍSTICAS DE CLIENTES

export const obtenerTopClientesPorMonto = async (limite = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/clientes/top-por-monto`, {
      params: { limite }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener clientes por monto:", error);
    return [];
  }
};

export const obtenerTopClientesPorCantidad = async (limite = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/clientes/top-por-cantidad`, {
      params: { limite }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener clientes por cantidad:", error);
    return [];
  }
};

export const obtenerTopClientesPorFrecuencia = async (limite = 10, meses = 6) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/clientes/top-por-frecuencia`, {
      params: { limite, meses }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener clientes por frecuencia:", error);
    return [];
  }
};

export const obtenerClientesFrecuentesVsEsporadicos = async (limite = 50, meses = 3) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/clientes/frecuentes-vs-esporadicos`, {
      params: { limite, meses }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener clasificación de clientes:", error);
    return [];
  }
};

export const obtenerClientesConPagosPendientes = async (limite = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/clientes/con-pagos-pendientes`, {
      params: { limite }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener clientes con pagos pendientes:", error);
    return [];
  }
};

// ESTADÍSTICAS FINANCIERAS
// Para el componente EstadisticasFinancieras usamos 'get' como prefijo

export const getIngresosTotales = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/ingresos/totales`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ingresos totales:", error);
    return { ingresos_totales: 0, cantidad_facturas: 0 };
  }
};

export const getIngresosPorDia = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/ingresos/por-dia`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ingresos por día:", error);
    return [];
  }
};

export const getIngresosPorMes = async (anio) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/ingresos/por-mes`, {
      params: { anio }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ingresos por mes:", error);
    return [];
  }
};

export const getIngresosPorMetodoPago = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/ingresos/por-metodo-pago`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ingresos por método de pago:", error);
    return [];
  }
};

export const getVentasPorSede = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/ventas/por-sede`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ventas por sede:", error);
    return [];
  }
};

export const getVentasPorSedePorMes = async (anio) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/ventas/por-sede/por-mes`, {
      params: { anio }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ventas por sede y mes:", error);
    return [];
  }
};

export const getVentasPorSedePorDia = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/ventas/por-sede/por-dia`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ventas por sede y día:", error);
    return [];
  }
};

export const getClientesConPagosPendientes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/clientes/con-pagos-pendientes`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener clientes con pagos pendientes:", error);
    return [];
  }
};

export const getTopClientesPorMonto = async (limite = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/clientes/top-por-monto`, {
      params: { limite }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener top clientes por monto:", error);
    return [];
  }
};

export const getPagosProveedoresTotales = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/proveedores/pagos-totales`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener pagos a proveedores:", error);
    return [];
  }
};

export const getPagosProveedoresPorMes = async (anio) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/proveedores/pagos-por-mes`, {
      params: { anio }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener pagos a proveedores por mes:", error);
    return [];
  }
};

export const getNominaPorSedeYRol = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${BASE_URL}/estadisticas/nomina/por-sede-y-rol`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos de nómina:", error);
    return [];
  }
};

// CARGA DE DATOS EN PARALELO (OPTIMIZACIÓN)

export const cargarDatosEstadisticasProductos = async () => {
  try {
    const [
      productosPorCantidad,
      productosPorValor,
      productosFrecuentes,
      stockVsVentas,
      productosObsoletos
    ] = await Promise.all([
      obtenerTopProductosPorCantidad(),
      obtenerTopProductosPorValor(),
      obtenerProductosFrecuentes(),
      obtenerStockVsVentas(),
      obtenerProductosObsoletos()
    ]);
    
    return {
      productosPorCantidad,
      productosPorValor,
      productosFrecuentes,
      stockVsVentas,
      productosObsoletos
    };
  } catch (error) {
    console.error("Error al cargar datos de estadísticas de productos:", error);
    return {
      productosPorCantidad: [],
      productosPorValor: [],
      productosFrecuentes: [],
      stockVsVentas: [],
      productosObsoletos: []
    };
  }
};

export const cargarDatosEstadisticasClientes = async () => {
  try {
    const [
      clientesPorMonto,
      clientesPorCantidad,
      clientesPorFrecuencia,
      clientesFrecuentesVsEsporadicos,
      clientesConPagosPendientes
    ] = await Promise.all([
      obtenerTopClientesPorMonto(),
      obtenerTopClientesPorCantidad(),
      obtenerTopClientesPorFrecuencia(),
      obtenerClientesFrecuentesVsEsporadicos(),
      obtenerClientesConPagosPendientes()
    ]);
    
    return {
      clientesPorMonto,
      clientesPorCantidad,
      clientesPorFrecuencia,
      clientesFrecuentesVsEsporadicos,
      clientesConPagosPendientes
    };
  } catch (error) {
    console.error("Error al cargar datos de estadísticas de clientes:", error);
    return {
      clientesPorMonto: [],
      clientesPorCantidad: [],
      clientesPorFrecuencia: [],
      clientesFrecuentesVsEsporadicos: [],
      clientesConPagosPendientes: []
    };
  }
};

export const cargarDatosEstadisticasFinancieras = async (anio) => {
  if (!anio) {
    anio = new Date().getFullYear();
  }
  
  try {
    const [
      ingresosTotales,
      ingresosPorMes,
      ingresosPorMetodoPago,
      ventasPorSede,
      ventasPorSedePorMes,
      pagosProveedoresTotales,
      pagosProveedoresPorMes
    ] = await Promise.all([
      getIngresosTotales(),
      getIngresosPorMes(anio),
      getIngresosPorMetodoPago(),
      getVentasPorSede(),
      getVentasPorSedePorMes(anio),
      getPagosProveedoresTotales(),
      getPagosProveedoresPorMes(anio)
    ]);
    
    return {
      ingresosTotales,
      ingresosPorMes,
      ingresosPorMetodoPago,
      ventasPorSede,
      ventasPorSedePorMes,
      pagosProveedoresTotales,
      pagosProveedoresPorMes
    };
  } catch (error) {
    console.error("Error al cargar datos financieros:", error);
    return {
      ingresosTotales: { ingresos_totales: 0, cantidad_facturas: 0 },
      ingresosPorMes: [],
      ingresosPorMetodoPago: [],
      ventasPorSede: [],
      ventasPorSedePorMes: [],
      pagosProveedoresTotales: [],
      pagosProveedoresPorMes: []
    };
  }
};

// Función para cargar todos los datos de estadísticas a la vez
export const cargarTodasLasEstadisticas = async () => {
  try {
    const [datosProductos, datosClientes] = await Promise.all([
      cargarDatosEstadisticasProductos(),
      cargarDatosEstadisticasClientes()
    ]);
    
    return {
      ...datosProductos,
      ...datosClientes
    };
  } catch (error) {
    console.error("Error al cargar todas las estadísticas:", error);
    throw error;
  }
};

// Función para obtener un resumen del dashboard financiero
export const obtenerDashboardFinanciero = async (anio) => {
  if (!anio) {
    anio = new Date().getFullYear();
  }
  
  try {
    const [
      ingresosTotales,
      ingresosPorMes,
      ingresosPorMetodoPago,
      ventasPorSede,
      topClientes,
      pagosProveedoresTotales
    ] = await Promise.all([
      getIngresosTotales(),
      getIngresosPorMes(anio),
      getIngresosPorMetodoPago(),
      getVentasPorSede(),
      getTopClientesPorMonto(5),
      getPagosProveedoresTotales()
    ]);
    
    // Calcular la rentabilidad (ingresos - pagos a proveedores)
    const totalIngresos = ingresosTotales.ingresos_totales || 0;
    const totalPagos = pagosProveedoresTotales.reduce(
      (sum, prov) => sum + (prov.total_pagos || 0), 
      0
    );
    const rentabilidad = totalIngresos - totalPagos;
    
    return {
      totalIngresos,
      totalPagos,
      rentabilidad,
      ingresosPorMes,
      ingresosPorMetodoPago,
      ventasPorSede,
      topClientes
    };
  } catch (error) {
    console.error("Error al obtener dashboard financiero:", error);
    return {
      totalIngresos: 0,
      totalPagos: 0,
      rentabilidad: 0,
      ingresosPorMes: [],
      ingresosPorMetodoPago: [],
      ventasPorSede: [],
      topClientes: []
    };
  }
};
