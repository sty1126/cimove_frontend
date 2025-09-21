import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Obtener cliente por ID
export async function obtenerClientePorId(id) {
  const response = await fetch(`${BASE_URL}/clientes/${id}`);
  if (!response.ok) throw new Error("Error al obtener el cliente");
  return response.json();
}

// Actualizar cliente
export async function actualizarCliente(id, datos) {
  const response = await fetch(`${BASE_URL}/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("Error al actualizar el cliente");
  return response.json();
}

// Obtener sedes
export async function obtenerSedes() {
  const response = await fetch(`${BASE_URL}/sedes`);
  if (!response.ok) throw new Error("Error al obtener las sedes");
  return response.json();
}

// Crear cliente
export async function crearCliente(datos) {
  const response = await fetch(`${BASE_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("Error al crear el cliente");
  return response.json();
}

// Obtener tipos de documento
export async function obtenerTiposDocumento() {
  const response = await fetch(`${BASE_URL}/tipodocumento`);
  if (!response.ok) throw new Error("Error al obtener tipos de documento");
  return response.json();
}

// Obtener tipos de cliente
export async function obtenerTiposCliente() {
  const response = await fetch(`${BASE_URL}/tipocliente`);
  if (!response.ok) throw new Error("Error al obtener tipos de cliente");
  return response.json();
}

// Obtener todos los clientes
export const obtenerClientes = async () => {
  const response = await fetch(`${BASE_URL}/clientes/`);
  if (!response.ok) throw new Error("Error al obtener los clientes");
  return await response.json();
};

export const eliminarCliente = async (id) => {
  const response = await fetch(`${BASE_URL}/clientes/eliminar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Error al eliminar el cliente");
  return response.json();
};

// Obtener clientes formateados (usado para selectores)
export const obtenerClientesFormateados = async () => {
  const response = await axios.get(`${BASE_URL}/clientes/formateados`);
  return response.data;
};

// Obtener ID de una sede por nombre
export const obtenerIdSedePorNombre = async (nombreSede) => {
  const response = await fetch(`${BASE_URL}/sedes/nombre/${nombreSede}`);
  if (!response.ok) throw new Error("Error al obtener la sede");
  const data = await response.json();
  return data.id_sede;
};

// Obtener clientes por ID de sede
export const obtenerClientesPorSede = async (idSede) => {
  const response = await fetch(`${BASE_URL}/clientes/sede/${idSede}`);
  if (!response.ok) throw new Error("Error al obtener los clientes por sede");
  return response.json();
};
