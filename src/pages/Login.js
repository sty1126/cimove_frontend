"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import "../Login.scss"; // Importamos estilos específicos para el login

const Login = () => {
  const [identificacion, setIdentificacion] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!identificacion || !contrasena) {
      Swal.fire({
        icon: "error",
        title: "Campos Vacíos",
        text: "Por favor ingrese la identificación y la contraseña.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/usuario/check-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_usuario: identificacion,
            contrasena_ingresada: contrasena,
          }),
        }
      );

      const data = await response.json();
      console.log("Datos de la respuesta:", data);

      if (response.ok) {
        const { token, user } = data;

        Swal.fire({
          icon: "success",
          title: "Login Exitoso",
          text: "Bienvenido a CIMOVE.",
        });

        // Guarda el token en el localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("rol", user.tipo_usuario);
        localStorage.setItem("id_empleado", user.id);
        localStorage.setItem("id_sede", user.sede);
        localStorage.setItem("email", user.email);

        // Redirige a la página de inicio
        navigate("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de Autenticación",
          text: data.error || "Contraseña incorrecta.",
        });
      }
    } catch (error) {
      console.error("Error al hacer login:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al intentar hacer login. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Columna izquierda */}
      <div className="login-left-column">
        <div className="login-brand">
          <h1>Kper-shop</h1>
          <p>Accesorios para dispositivos móviles</p>
        </div>

        <div className="login-logo">
          <span>K</span>
        </div>

        <p className="login-tagline">Lo mejor en accesorios para tu celular</p>

        <div className="login-footer">CIMOVE © {new Date().getFullYear()}</div>
      </div>

      {/* Columna derecha */}
      <div className="login-right-column">
        <div className="login-form-container">
          <div className="login-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="identificacion">Identificación</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input
                  type="text"
                  id="identificacion"
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                  placeholder="Correo electrónico"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contrasena">Contraseña</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="contrasena"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="recordarme"
                  checked={recordarme}
                  onChange={() => setRecordarme(!recordarme)}
                />
                <label htmlFor="recordarme">Recordarme</label>
              </div>
              <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FiLogIn />
                  Iniciar sesión
                </>
              )}
            </button>

            <div className="signup-link">
              <p>¿No tienes una cuenta?</p>
              <a href="#">Contáctate con nosotros</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
