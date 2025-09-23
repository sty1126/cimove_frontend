import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const estadisticasService = {
  async generatePDF({ fechaInicio, fechaFin, seccion }) {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/reportes/pdf`,
        { fechaInicio, fechaFin, seccion },
        { responseType: "blob" } // 👈 importante para que llegue como archivo
      );
      return response; // el blob va en response.data
    } catch (error) {
      console.error("Error generando PDF:", error);
      throw error;
    }
  },

  async loadData() {
    // mock de carga, quítalo cuando uses tu API real
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  },
  async getClientesActivos(fechaInicio, fechaFin) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/clientes/clientes-activos`,
    { params: { fechaInicio, fechaFin } }
  );
  return response.data;
},

async getMejoresClientes(fechaInicio, fechaFin, limite = 10) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/clientes/mejores-clientes`,
    { params: { fechaInicio, fechaFin, limite } }
  );
  return response.data;
},

async getClientesPorSede() {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/clientes/clientes-por-sede`
  );
  return response.data;
},

async getEgresos(fechaInicio, fechaFin) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/egresos/egresos`,
    { params: { fechaInicio, fechaFin } }
  );
  return response.data;
},

async getPrincipalesEgresos(fechaInicio, fechaFin, limite = 10) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/egresos/principales-egresos`,
    { params: { fechaInicio, fechaFin, limite } }
  );
  return response.data;
},
async getRentabilidad(fechaInicio, fechaFin) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/generales/rentabilidad`,
    { params: { fechaInicio, fechaFin } }
  );
  return response.data;
},

async getRentabilidadEvolucion(fechaInicio, fechaFin) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/generales/rentabilidad-evolucion`,
    { params: { fechaInicio, fechaFin } }
  );
  return response.data;
},

async getVentasDiaSemana(fechaInicio, fechaFin) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/ingresos/ventas-dia-semana`,
    { params: { fechaInicio, fechaFin } }
  );
  return response.data;
},

async getIngresosPeriodo(fechaInicio, fechaFin) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/ingresos/ingresos-periodo`,
    { params: { fechaInicio, fechaFin } }
  );
  return response.data;
},

async getIngresosCategoria(fechaInicio, fechaFin, limite = 10) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/ingresos/ingresos-categoria`,
    { params: { fechaInicio, fechaFin, limite } }
  );
  return response.data;
},

async getIngresosMetodoPago(fechaInicio, fechaFin) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/ingresos/ingresos-metodo-pago`,
    { params: { fechaInicio, fechaFin } }
  );
  return response.data;
},
async getProductosMasVendidos(fechaInicio, fechaFin, ordenarPor = "unidades", limite = 10) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/productos/mas-vendidos`,
    { params: { fechaInicio, fechaFin, ordenarPor, limite } }
  );
  return response.data;
},

async getProductosBajoStock(limite = 20) {
  const response = await axios.get(
    `${BASE_URL}/api/estadisticas/productos/bajo-stock`,
    { params: { limite } }
  );
  return response.data;
},

};
