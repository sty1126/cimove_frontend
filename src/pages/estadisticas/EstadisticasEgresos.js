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

export default function EstadisticasEgresos({
  fechaInicio,
  fechaFin,
  loading,
}) {
  const [egresos, setEgresos] = useState([]);
  const [principalesEgresos, setPrincipalesEgresos] = useState([]);
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

      const egresosResponse = await fetch(
        `http://localhost:4000/api/estadisticas/egresos/egresos?fechaInicio=${formattedFechaInicio}&fechaFin=${formattedFechaFin}`
      );
      const egresosData = await egresosResponse.json();

      const principalesEgresosResponse = await fetch(
        `http://localhost:4000/api/estadisticas/egresos/principales-egresos?fechaInicio=${formattedFechaInicio}&fechaFin=${formattedFechaFin}&limite=10`
      );
      const principalesEgresosData = await principalesEgresosResponse.json();

      setEgresos(egresosData);
      setPrincipalesEgresos(principalesEgresosData);
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

  // Gráfica de egresos por período
  const egresosChartData = {
    labels: egresos.map((item) => formatDate(item.fecha)),
    datasets: [
      {
        label: "Egresos",
        data: egresos.map((item) => Number.parseInt(item.egreso_total)),
        borderColor: colors.danger,
        backgroundColor: colors.danger + "20",
        tension: 0.4,
      },
    ],
  };

  // Gráfica de principales proveedores
  const proveedoresChartData = {
    labels: principalesEgresos.map((item) => item.nombre_proveedor),
    datasets: [
      {
        label: "Egresos por Proveedor",
        data: principalesEgresos.map((item) =>
          Number.parseInt(item.egreso_total)
        ),
        backgroundColor: [colors.danger, colors.warning],
        borderColor: [colors.danger, colors.warning],
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

  const totalEgresos = principalesEgresos.reduce(
    (sum, item) => sum + Number.parseInt(item.egreso_total),
    0
  );

  if (loadingData || loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando estadísticas de egresos...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Tarjeta de resumen */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5 style={{ color: colors.danger }}>Total Egresos</h5>
              <h3 style={{ color: colors.danger }}>
                {formatCurrency(totalEgresos)}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5 style={{ color: colors.primary }}>Número de Proveedores</h5>
              <h3 style={{ color: colors.primary }}>
                {principalesEgresos.length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5 style={{ color: colors.secondary }}>
                Promedio por Proveedor
              </h5>
              <h3 style={{ color: colors.secondary }}>
                {formatCurrency(totalEgresos / principalesEgresos.length)}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Evolución de Egresos</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Line data={egresosChartData} options={chartOptions} />
                </Col>
                <Col md={4}>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Egreso Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {egresos.map((item, index) => (
                        <tr key={index}>
                          <td>{formatDate(item.fecha)}</td>
                          <td>
                            {formatCurrency(Number.parseInt(item.egreso_total))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Principales Proveedores</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Bar data={proveedoresChartData} options={chartOptions} />
                </Col>
                <Col md={4}>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Proveedor</th>
                        <th>Total</th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {principalesEgresos.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nombre_proveedor}</td>
                          <td>
                            {formatCurrency(Number.parseInt(item.egreso_total))}
                          </td>
                          <td>
                            {(
                              (Number.parseInt(item.egreso_total) /
                                totalEgresos) *
                              100
                            ).toFixed(2)}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
