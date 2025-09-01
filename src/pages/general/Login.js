"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FiMail, FiLock, FiLogIn, FiSmartphone } from "react-icons/fi";
import "./Login.scss";
import { loginUsuario } from "../../services/generalService";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const [identificacion, setIdentificacion] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ identificacion: "", contrasena: "" });
  const navigate = useNavigate();

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validación de contraseña
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setIdentificacion(value);

    if (value && !validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        identificacion: "Por favor ingresa un correo electrónico válido",
      }));
    } else {
      setErrors((prev) => ({ ...prev, identificacion: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setContrasena(value);

    if (value && !validatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        contrasena: "La contraseña debe tener al menos 6 caracteres",
      }));
    } else {
      setErrors((prev) => ({ ...prev, contrasena: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};
    if (!identificacion) {
      formErrors.identificacion = "El correo electrónico es requerido";
    } else if (!validateEmail(identificacion)) {
      formErrors.identificacion =
        "Por favor ingresa un correo electrónico válido";
    }

    if (!contrasena) {
      formErrors.contrasena = "La contraseña es requerida";
    } else if (!validatePassword(contrasena)) {
      formErrors.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { token, user } = await loginUsuario(identificacion, contrasena);

      localStorage.setItem("token", token);
      localStorage.setItem("rol", user.tipo_usuario);
      localStorage.setItem("id_empleado", user.id);
      localStorage.setItem("id_sede", user.sede);
      localStorage.setItem("email", user.email);

      navigate("/home");
    } catch (error) {
      console.error("Error al hacer login:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error de Autenticación",
        text:
          error.message ||
          "No se pudo conectar con el servidor. Por favor verifica tu conexión a internet e inténtalo de nuevo.",
        confirmButtonText: "Intentar de nuevo",
        confirmButtonColor: "#0D7F93",
        background: "#fff",
        iconColor: "#C25F48",
        showClass: { popup: "swal-animate-show" },
        hideClass: { popup: "swal-animate-hide" },
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
          <div className="brand-icon">
            <FiSmartphone size={48} />
          </div>
          <h1>K-per shop</h1>
          <p>Accesorios para dispositivos móviles</p>
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-dot"></span>
            <span>Productos de calidad</span>
          </div>
          <div className="feature-item">
            <span className="feature-dot"></span>
            <span>Soporte técnico especializado</span>
          </div>
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
                  type="email"
                  id="identificacion"
                  value={identificacion}
                  onChange={handleEmailChange}
                  placeholder="Correo electrónico"
                  required
                  maxLength={40}
                />
              </div>
              {errors.identificacion && (
                <span className="error-message">{errors.identificacion}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contrasena">Contraseña</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="contrasena"
                  value={contrasena}
                  onChange={handlePasswordChange}
                  placeholder="Contraseña"
                  required
                  minLength={6}
                  maxLength={25}
                />
              </div>
              {errors.contrasena && (
                <span className="error-message">{errors.contrasena}</span>
              )}
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
