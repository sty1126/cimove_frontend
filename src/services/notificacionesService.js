import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Obtener todas las notificaciones (solo activas)
export const getNotificaciones = async () => {
  const response = await axios.get(`${BASE_URL}/notificaciones`);
  return response.data;
};

// Obtener notificación por ID
export const getNotificacionById = async (id) => {
  const response = await axios.get(`${BASE_URL}/notificaciones/${id}`);
  return response.data;
};

// Crear nueva notificación
export const crearNotificacion = async (notificacionData) => {
  const response = await axios.post(
    `${BASE_URL}/notificaciones`,
    notificacionData
  );
  return response.data;
};

export const probarEnvioCorreo = async () => {
  const response = await axios.get(`${BASE_URL}/notificaciones/test-email`);
  return response.data;
};

// Actualizar notificación
export const actualizarNotificacion = async (id, notificacionData) => {
  const response = await axios.put(
    `${BASE_URL}/notificaciones/${id}`,
    notificacionData
  );
  return response.data;
};

// Inactivar notificación (eliminación lógica)
export const inactivarNotificacion = async (id) => {
  const response = await axios.put(
    `${BASE_URL}/notificaciones/${id}/inactivar`
  );
  return response.data;
};

// Obtener notificaciones completadas
export const getNotificacionesCompletadas = async () => {
  const response = await axios.get(`${BASE_URL}/notificaciones/completadas`);
  return response.data;
};

// Marcar notificación como completada
export const marcarNotificacionCompletada = async (id) => {
  const response = await axios.put(
    `${BASE_URL}/notificaciones/${id}/completar`
  );
  return response.data;
};

// Restaurar notificación pendiente
export const restaurarNotificacionPendiente = async (id) => {
  const response = await axios.put(
    `${BASE_URL}/notificaciones/${id}/restaurar`
  );
  return response.data;
};

// Eliminar notificación
export const eliminarNotificacion = async (id) => {
  const response = await axios.put(
    `${BASE_URL}/notificaciones/${id}/inactivar`
  );
  return response.data;
};

// Obtener notificaciones por estado
export const getNotificacionesPorEstado = async (estado) => {
  const response = await axios.get(
    `${BASE_URL}/notificaciones?estado=${estado}`
  );
  return response.data;
};

// Obtener notificaciones por urgencia
export const getNotificacionesPorUrgencia = async (urgencia) => {
  const response = await axios.get(
    `${BASE_URL}/notificaciones?urgencia=${urgencia}`
  );
  return response.data;
};

// Obtener notificaciones por rango de fechas
export const getNotificacionesPorFechas = async (fechaInicio, fechaFin) => {
  const response = await axios.get(
    `${BASE_URL}/notificaciones?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  );
  return response.data;
};

// Obtener notificaciones del día actual
export const getNotificacionesHoy = async () => {
  const hoy = new Date().toISOString().split("T")[0];
  const response = await axios.get(`${BASE_URL}/notificaciones?fecha=${hoy}`);
  return response.data;
};

// Obtener notificaciones pendientes
export const getNotificacionesPendientes = async () => {
  return await getNotificacionesPorEstado("P");
};

// Obtener notificaciones urgentes
export const getNotificacionesUrgentes = async () => {
  return await getNotificacionesPorUrgencia("U");
};
