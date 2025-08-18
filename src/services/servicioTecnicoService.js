import axios from "axios";

// const BASE_URL = "https://cimove-backend.onrender.com/api";
const BASE_URL = "http://localhost:4000/api";

export const obtenerServicioTecnicoConInfo = async (id) => {
  const [sedesRes, proveedoresRes, servicioRes, tiposMetodoPagoRes] =
    await Promise.all([
      axios.get(`${BASE_URL}/sedes/`),
      axios.get(`${BASE_URL}/proveedores/all`),
      axios.get(`${BASE_URL}/serviciotecnico/${id}`),
      axios.get(`${BASE_URL}/tipometodopago`),
    ]);

  return {
    sedes: sedesRes.data,
    proveedores: proveedoresRes.data,
    servicio: servicioRes.data,
    tiposMetodoPago: tiposMetodoPagoRes.data,
  };
};

export const actualizarServicioTecnico = async (id, payload) => {
  return await axios.put(`${BASE_URL}/serviciotecnico/${id}`, payload);
};

// Obtener datos necesarios para crear servicio técnico
export const obtenerDatosParaCrearServicio = async () => {
  const [resSedes, resProveedores, resMetodosPago] = await Promise.all([
    axios.get(`${BASE_URL}/sedes/`),
    axios.get(`${BASE_URL}/proveedores/all`),
    axios.get(`${BASE_URL}/tipometodopago`),
  ]);

  return {
    sedes: resSedes.data,
    proveedores: resProveedores.data,
    tiposMetodoPago: resMetodosPago.data,
  };
};

// Registrar nueva factura de servicio técnico
export const registrarServicioTecnico = async (payload) => {
  return await axios.post(`${BASE_URL}/serviciotecnico`, payload);
};

// Obtener detalles del servicio técnico junto con sedes y proveedores
export const obtenerDetallesServicioTecnico = async (id) => {
  const [sedesRes, proveedoresRes, servicioRes] = await Promise.all([
    axios.get(`${BASE_URL}/sedes/`),
    axios.get(`${BASE_URL}/proveedores/all`),
    axios.get(`${BASE_URL}/serviciotecnico/${id}`),
  ]);

  return {
    servicio: servicioRes.data,
    sedes: sedesRes.data,
    proveedores: proveedoresRes.data,
  };
};
