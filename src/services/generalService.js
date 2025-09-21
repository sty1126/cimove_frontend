import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

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

// Para recuperar la contraseña
export async function recuperarContrasena(email) {
  const response = await fetch(`${BASE_URL}/usuario/request-password-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_usuario: email,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "No se pudo enviar el correo de recuperación"
    );
  }

  return response.json();
}

export async function resetearContrasena(token, contrasenaNueva) {
  const response = await fetch(`${BASE_URL}/usuario/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      contrasena_nueva: contrasenaNueva,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al restablecer la contraseña.");
  }

  return response.json();
}
