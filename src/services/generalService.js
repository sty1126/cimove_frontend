import axios from "axios";

// const BASE_URL = "https://cimove-backend.onrender.com/api";
const BASE_URL = "http://localhost:4000/api";

// Login de usuario
export async function loginUsuario(identificacion, contrasena) {
  const response = await fetch(`${BASE_URL}/usuario/check-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_usuario: identificacion,
      contrasena_ingresada: contrasena,
    }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Respuesta inesperada del servidor: ${text}`);
  }

  if (!response.ok) {
    throw new Error(data.error || "Credenciales inválidas");
  }

  return data;
}

// Obtener todas las sedes (uso generalizado)
export const obtenerSedes = async () => {
  const response = await axios.get(`${BASE_URL}/sedes`);
  return response.data;
};
