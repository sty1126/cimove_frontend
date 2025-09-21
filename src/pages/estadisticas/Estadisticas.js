"use client";

import { useState } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Alert,
  Nav,
  Tab,
} from "react-bootstrap";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";
import EstadisticasGeneral from "./EstadisticasGenerales";
import EstadisticasIngresos from "./EstadisticasIngresos";
import EstadisticasEgresos from "./EstadisticasEgresos";
import EstadisticasProductos from "./EstadisticasProductos";
import EstadisticasClientes from "./EstadisticasClientes";

// Paleta de colores personalizada
const colors = {
  primary: "#0D7F93",
  secondary: "#4D8A52",
  accent: "#7FBAD6",
  light: "#C3D3C6",
  background: "#E8EAEC",
  text: "#2A3033",
  success: "#4D8A52",
  warning: "#E0A458",
  danger: "#C25F48",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  mediumGray: "#D9D9D9",
};

export default function EstadisticasApp() {
  const [activeTab, setActiveTab] = useState("general");
  const [fechaInicio, setFechaInicio] = useState("2025-08-17");
  const [fechaFin, setFechaFin] = useState("2025-08-31");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  const API_BASE = "https://cimove-backend.onrender.com/api/estadisticas";
  const API_BASE2 = "https://cimove-backend.onrender.com/api";

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleFechaInicioChange = (e) => {
    const newFechaInicio = e.target.value;
    const today = getTodayDate();

    // No permitir fechas futuras
    if (newFechaInicio > today) {
      alert("No se pueden seleccionar fechas futuras");
      return;
    }

    // Si la fecha fin es menor que la nueva fecha inicio, ajustarla
    if (fechaFin < newFechaInicio) {
      setFechaFin(newFechaInicio);
    }

    setFechaInicio(newFechaInicio);
  };

  const handleFechaFinChange = (e) => {
    const newFechaFin = e.target.value;
    const today = getTodayDate();

    // No permitir fechas futuras
    if (newFechaFin > today) {
      alert("No se pueden seleccionar fechas futuras");
      return;
    }

    // No permitir que fecha fin sea menor que fecha inicio
    if (newFechaFin < fechaInicio) {
      alert("La fecha fin no puede ser menor que la fecha de inicio");
      return;
    }

    setFechaFin(newFechaFin);
  };

  const loadData = async () => {
    setLoading(true);
    setApiError(false);

    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const generatePDF = async () => {
    try {
      const response = await fetch(`${API_BASE2}/api/reportes/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fechaInicio,
          fechaFin,
          seccion: activeTab, // si tu backend lo usa
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `estadisticas-${activeTab}-${fechaInicio}-${fechaFin}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const text = await response.text();
        console.error("Error en la respuesta del servidor:", text);
      }
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: colors.background,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Container fluid style={{ maxWidth: "1400px" }}>
        {apiError && (
          <Alert variant="info" className="mb-4">
            <AlertCircle size={16} className="me-2" />
            No se pudo conectar con la API en {API_BASE}. Mostrando datos de
            ejemplo. Para conectar con tu API real, asegúrate de que esté
            corriendo en el puerto 4000.
          </Alert>
        )}

        <Card
          style={{
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "2px solid #e0e0e0",
          }}
        >
          <Card.Header style={{ padding: "1.5rem" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <BarChart3
                  size={32}
                  style={{ color: colors.primary }}
                  className="me-3"
                />
                <Card.Title
                  style={{
                    fontSize: "1.75rem",
                    color: colors.primary,
                    margin: 0,
                  }}
                >
                  Estadísticas
                </Card.Title>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="success"
                  onClick={generatePDF}
                  className="d-flex align-items-center me-2"
                >
                  <FileText size={16} className="me-2" />
                  Generar PDF
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={loadData}
                  disabled={loading}
                  className="d-flex align-items-center"
                >
                  <RefreshCw
                    size={16}
                    className={`me-2 ${loading ? "spin" : ""}`}
                  />
                  Actualizar
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body style={{ padding: "2rem" }}>
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Fecha Inicio:</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    max={getTodayDate()}
                    onChange={handleFechaInicioChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Fecha Fin:</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    min={fechaInicio}
                    max={getTodayDate()}
                    onChange={handleFechaFinChange}
                  />
                </Form.Group>
              </div>
            </div>

            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link
                    eventKey="general"
                    className="d-flex align-items-center"
                  >
                    <BarChart3 size={16} className="me-2" />
                    General
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="ingresos"
                    className="d-flex align-items-center"
                  >
                    <TrendingUp size={16} className="me-2" />
                    Ingresos
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="egresos"
                    className="d-flex align-items-center"
                  >
                    <TrendingDown size={16} className="me-2" />
                    Egresos
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="productos"
                    className="d-flex align-items-center"
                  >
                    <ShoppingCart size={16} className="me-2" />
                    Productos
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="clientes"
                    className="d-flex align-items-center"
                  >
                    <Users size={16} className="me-2" />
                    Clientes
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="general">
                  <EstadisticasGeneral
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    loading={loading}
                    apiError={apiError}
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="ingresos">
                  <EstadisticasIngresos
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    loading={loading}
                    apiError={apiError}
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="egresos">
                  <EstadisticasEgresos
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    loading={loading}
                    apiError={apiError}
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="productos">
                  <EstadisticasProductos
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    loading={loading}
                    apiError={apiError}
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="clientes">
                  <EstadisticasClientes
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    loading={loading}
                    apiError={apiError}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
