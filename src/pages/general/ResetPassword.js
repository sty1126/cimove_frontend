// src/components/ResetPassword.js

"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { FiLock, FiSmartphone, FiArrowLeft } from "react-icons/fi" // Added icons for consistent design
import "./Login.scss" // Using the same SCSS file as Login for consistent styling
import { resetearContrasena } from "../../services/generalService"

const ResetPassword = () => {
  const [contrasenaNueva, setContrasenaNueva] = useState("")
  const [confirmarContrasena, setConfirmarContrasena] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ contrasenaNueva: "", confirmarContrasena: "" })

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = useState(null)

  useEffect(() => {
    const urlToken = searchParams.get("token")
    if (!urlToken) {
      Swal.fire({
        icon: "error",
        title: "Token no encontrado",
        text: "El enlace de recuperación es inválido o ha expirado.",
        confirmButtonText: "Ir a la página de inicio",
        confirmButtonColor: "#0D7F93", // Added consistent button color
        background: "#fff",
        iconColor: "#C25F48",
        showClass: { popup: "swal-animate-show" },
        hideClass: { popup: "swal-animate-hide" },
      }).then(() => {
        navigate("/")
      })
    } else {
      setToken(urlToken)
    }
  }, [searchParams, navigate])

  const validateForm = () => {
    const formErrors = {}
    if (!contrasenaNueva || contrasenaNueva.length < 6) {
      formErrors.contrasenaNueva = "La contraseña debe tener al menos 6 caracteres"
    }
    if (contrasenaNueva !== confirmarContrasena) {
      formErrors.confirmarContrasena = "Las contraseñas no coinciden"
    }
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await resetearContrasena(token, contrasenaNueva)

      Swal.fire({
        icon: "success",
        title: "Contraseña Actualizada",
        text: "Tu contraseña ha sido restablecida correctamente. Por favor, inicia sesión con la nueva contraseña.",
        confirmButtonText: "Ir a Iniciar Sesión",
        confirmButtonColor: "#0D7F93", // Added consistent styling
        background: "#fff",
        showClass: { popup: "swal-animate-show" },
        hideClass: { popup: "swal-animate-hide" },
      }).then(() => {
        navigate("/")
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo restablecer la contraseña. Inténtalo de nuevo.",
        confirmButtonText: "Intentar de nuevo",
        confirmButtonColor: "#0D7F93", // Added consistent styling
        background: "#fff",
        iconColor: "#C25F48",
        showClass: { popup: "swal-animate-show" },
        hideClass: { popup: "swal-animate-hide" },
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return null
  }

  return (
    <div className="login-container">
      {/* Columna izquierda - Same branding as Login */}
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

      {/* Columna derecha - Form section */}
      <div className="login-right-column">
        <div className="login-form-container">
          <div className="login-header">
            <button type="button" className="back-button" onClick={() => navigate("/")}>
              <FiArrowLeft />
            </button>
            <h2>Restablecer Contraseña</h2>
            <p>Ingresa tu nueva contraseña para completar el proceso</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="contrasenaNueva">Nueva Contraseña</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="contrasenaNueva"
                  value={contrasenaNueva}
                  onChange={(e) => setContrasenaNueva(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  maxLength={25}
                />
              </div>
              {errors.contrasenaNueva && <span className="error-message">{errors.contrasenaNueva}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="confirmarContrasena"
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  required
                  minLength={6}
                  maxLength={25}
                />
              </div>
              {errors.confirmarContrasena && <span className="error-message">{errors.confirmarContrasena}</span>}
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Actualizando...
                </>
              ) : (
                <>
                  <FiLock />
                  Restablecer Contraseña
                </>
              )}
            </button>

            <div className="signup-link">
              <p>¿Recordaste tu contraseña?</p>
              <a href="#" onClick={() => navigate("/")}>
                Volver al inicio de sesión
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
