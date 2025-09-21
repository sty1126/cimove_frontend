import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Obtener empleado por ID
export async function obtenerEmpleadoPorId(id) {
  const response = await fetch(`${BASE_URL}/empleados/${id}`);
  if (!response.ok) throw new Error("Error al obtener el empleado");
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

// Actualizar empleado
export async function actualizarEmpleado(id, datos) {
  const response = await fetch(`${BASE_URL}/empleados/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("Error al actualizar el empleado");
  return await response.json();
}

// Obtener tipos de usuario
export async function obtenerTiposUsuario() {
  const response = await fetch(`${BASE_URL}/tipousuario`);
  if (!response.ok) throw new Error("Error al obtener tipos de usuario");
  return await response.json();
}

// Crear empleado
export async function crearEmpleado(datos) {
  const response = await fetch(`${BASE_URL}/empleados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("Error al crear el empleado");
  return response.json();
}

// Obtener todos los empleados
export async function obtenerTodosLosEmpleados() {
  const response = await fetch(`${BASE_URL}/empleados/`);
  if (!response.ok) throw new Error("Error al obtener los empleados");
  return await response.json();
}

// Desactivar empleado
export async function desactivarEmpleado(id) {
  const response = await fetch(`${BASE_URL}/empleados/eliminar/${id}`, {
    method: "PUT",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al desactivar");
  return data;
}

// Restaurar empleado
export async function restaurarEmpleado(id) {
  const response = await fetch(`${BASE_URL}/empleados/restaurar/${id}`, {
    method: "PUT",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al reactivar");
  return data;
}

export const obtenerTiposDocumento = async () => {
  const res = await axios.get(`${BASE_URL}/tipodocumento`);
  return res.data;
};
