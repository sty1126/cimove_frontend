"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Table } from "react-bootstrap";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { estadisticasService } from "../../services/estadisticasService";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const colors = {
  primary: "#0D7F93",
  secondary: "#4D8A52",
  accent: "#7FBAD6",
  warning: "#E0A458",
  danger: "#C25F48",
};

export default function EstadisticasGeneral({
  fechaInicio,
  fechaFin,
  loading,
  apiError,
}) {
  const [rentabilidad, setRentabilidad] = useState(null);
  const [evolucion, setEvolucion] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchData();
  }, [fechaInicio, fechaFin]);

  const formatDateForAPI = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  
const fetchData = async () => {
  setLoadingData(true);
  try {
    const formattedFechaInicio = formatDateForAPI(fechaInicio);
    const formattedFechaFin = formatDateForAPI(fechaFin);

    const rentabilidadData = await estadisticasService.getRentabilidad(
      formattedFechaInicio,
      formattedFechaFin
    );

    const evolucionData = await estadisticasService.getRentabilidadEvolucion(
      formattedFechaInicio,
      formattedFechaFin
    );

    setRentabilidad(rentabilidadData);
    setEvolucion(evolucionData);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoadingData(false);
  }
};

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      month: "short",
      day: "numeric",
    });
  };

  const evolucionChartData = {
    labels: evolucion.map((item) => formatDate(item.fecha)),
    datasets: [
      {
        label: "Ingresos",
        data: evolucion.map((item) => Number.parseInt(item.ingreso_total)),
        borderColor: colors.primary,
        backgroundColor: colors.primary + "20",
        tension: 0.4,
      },
      {
        label: "Beneficio Neto",
        data: evolucion.map((item) => Number.parseInt(item.beneficio_neto)),
        borderColor: colors.secondary,
        backgroundColor: colors.secondary + "20",
        tension: 0.4,
      },
    ],
  };

  const margenChartData = {
    labels: evolucion.map((item) => formatDate(item.fecha)),
    datasets: [
      {
        label: "Margen (%)",
        data: evolucion.map((item) => item.margen_porcentaje),
        backgroundColor: colors.accent,
        borderColor: colors.accent,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loadingData || loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando estadísticas generales...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Tarjetas de resumen */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5 style={{ color: colors.primary }}>Ingresos Totales</h5>
              <h3 style={{ color: colors.primary }}>
                {rentabilidad
                  ? formatCurrency(Number.parseInt(rentabilidad.ingreso_total))
                  : "-"}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5 style={{ color: colors.danger }}>Egresos Totales</h5>
              <h3 style={{ color: colors.danger }}>
                {rentabilidad
                  ? formatCurrency(Number.parseInt(rentabilidad.egreso_total))
                  : "-"}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5 style={{ color: colors.secondary }}>Beneficio Neto</h5>
              <h3 style={{ color: colors.secondary }}>
                {rentabilidad
                  ? formatCurrency(Number.parseInt(rentabilidad.beneficio_neto))
                  : "-"}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficas */}
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Evolución de Rentabilidad</Card.Title>
            </Card.Header>
            <Card.Body>
              <Line data={evolucionChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Margen de Beneficio</Card.Title>
            </Card.Header>
            <Card.Body>
              <Bar data={margenChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detalle de Evolución */}
      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Detalle de Evolución</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Ingresos</th>
                    <th>Beneficio Neto</th>
                    <th>Margen (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {evolucion.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(item.fecha).toLocaleDateString("es-CO")}
                      </td>
                      <td>
                        {formatCurrency(Number.parseInt(item.ingreso_total))}
                      </td>
                      <td>
                        {formatCurrency(Number.parseInt(item.beneficio_neto))}
                      </td>
                      <td>{item.margen_porcentaje.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
