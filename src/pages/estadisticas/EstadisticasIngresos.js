"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Table, Badge } from "react-bootstrap";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
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

export default function EstadisticasIngresos({
  fechaInicio,
  fechaFin,
  loading,
}) {
  const [ventasDiaSemana, setVentasDiaSemana] = useState([]);
  const [ingresosPeriodo, setIngresosPeriodo] = useState([]);
  const [ingresosCategoria, setIngresosCategoria] = useState([]);
  const [ingresosMetodoPago, setIngresosMetodoPago] = useState([]);
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

      const [
        ventasDiaResponse,
        ingresosPeriodoResponse,
        categoriaResponse,
        metodoPagoResponse,
      ] = await Promise.all([
        fetch(
          `https://cimove-backend.onrender.com/api/estadisticas/ingresos/ventas-dia-semana?fechaInicio=${formattedFechaInicio}&fechaFin=${formattedFechaFin}`
        ),
        fetch(
          `https://cimove-backend.onrender.com/api/estadisticas/ingresos/ingresos-periodo?fechaInicio=${formattedFechaInicio}&fechaFin=${formattedFechaFin}`
        ),
        fetch(
          `https://cimove-backend.onrender.com/api/estadisticas/ingresos/ingresos-categoria?fechaInicio=${formattedFechaInicio}&fechaFin=${formattedFechaFin}&limite=10`
        ),
        fetch(
          `https://cimove-backend.onrender.com/api/estadisticas/ingresos/ingresos-metodo-pago?fechaInicio=${formattedFechaInicio}&fechaFin=${formattedFechaFin}`
        ),
      ]);

      const ventasDiaData = await ventasDiaResponse.json();
      const ingresosPeriodoData = await ingresosPeriodoResponse.json();
      const ingresosCategoriaData = await categoriaResponse.json();
      const ingresosMetodoPagoData = await metodoPagoResponse.json();

      setVentasDiaSemana(ventasDiaData);
      setIngresosPeriodo(ingresosPeriodoData);
      setIngresosCategoria(ingresosCategoriaData);
      setIngresosMetodoPago(ingresosMetodoPagoData);
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

  // Gráfica de ventas por día de semana
  const ventasDiaChartData = {
    labels: ventasDiaSemana.map((item) => item.nombre_dia),
    datasets: [
      {
        label: "Ventas",
        data: ventasDiaSemana.map((item) => Number.parseInt(item.total_ventas)),
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.accent,
          colors.warning,
          colors.danger,
          "#9B59B6",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Gráfica de ingresos por período
  const ingresosPeriodoChartData = {
    labels: ingresosPeriodo.map((item) => formatDate(item.fecha)),
    datasets: [
      {
        label: "Ingresos",
        data: ingresosPeriodo.map((item) =>
          Number.parseInt(item.ingreso_total)
        ),
        borderColor: colors.primary,
        backgroundColor: colors.primary + "20",
        tension: 0.4,
      },
    ],
  };

  // Gráfica de ingresos por categoría
  const categoriaChartData = {
    labels: ingresosCategoria.map((item) => item.categoria),
    datasets: [
      {
        data: ingresosCategoria.map((item) =>
          Number.parseInt(item.ingreso_total)
        ),
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.accent,
          colors.warning,
          colors.danger,
          "#9B59B6",
        ],
      },
    ],
  };

  // Gráfica de ingresos por método de pago
  const metodoPagoChartData = {
    labels: ingresosMetodoPago.map((item) => item.nombre_tipometodopago),
    datasets: [
      {
        data: ingresosMetodoPago.map((item) =>
          Number.parseInt(item.total_ingresos)
        ),
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.accent,
          colors.warning,
          colors.danger,
          "#9B59B6",
        ],
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
  };

  if (loadingData || loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando estadísticas de ingresos...</p>
      </div>
    );
  }

  return (
    <div>
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <Card.Title>Ventas por Día de Semana</Card.Title>
            </Card.Header>
            <Card.Body>
              <Bar data={ventasDiaChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Datos - Ventas por Día</Card.Title>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Total</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasDiaSemana.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "0.8rem" }}>{item.nombre_dia}</td>
                      <td>
                        <Badge bg="primary">
                          {formatCurrency(Number.parseInt(item.total_ventas))}
                        </Badge>
                      </td>
                      <td>
                        {Number.parseFloat(item.porcentaje_ventas).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <Card.Title>Evolución de Ingresos por Período</Card.Title>
            </Card.Header>
            <Card.Body>
              <Line data={ingresosPeriodoChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Datos - Ingresos por Período</Card.Title>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresosPeriodo.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "0.8rem" }}>
                        {formatDate(item.fecha)}
                      </td>
                      <td>
                        <Badge bg="success">
                          {formatCurrency(Number.parseInt(item.ingreso_total))}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <Card.Title>Ingresos por Categoría</Card.Title>
            </Card.Header>
            <Card.Body>
              <Doughnut data={categoriaChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Datos - Ingresos por Categoría</Card.Title>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Total</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresosCategoria.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "0.8rem" }}>
                        {item.categoria.substring(0, 20)}...
                      </td>
                      <td>
                        <Badge bg="info">
                          {formatCurrency(Number.parseInt(item.ingreso_total))}
                        </Badge>
                      </td>
                      <td>{Number.parseFloat(item.porcentaje).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <Card.Title>Ingresos por Método de Pago</Card.Title>
            </Card.Header>
            <Card.Body>
              <Doughnut data={metodoPagoChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Datos - Métodos de Pago</Card.Title>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Método</th>
                    <th>Total</th>
                    <th>Trans.</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresosMetodoPago.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "0.8rem" }}>
                        {item.nombre_tipometodopago}
                      </td>
                      <td>
                        <Badge bg="warning">
                          {formatCurrency(Number.parseInt(item.total_ingresos))}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg="secondary">
                          {item.cantidad_transacciones}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>
                Detalle Completo - Ingresos por Método de Pago
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Método de Pago</th>
                    <th>Cantidad Transacciones</th>
                    <th>Total Ingresos</th>
                    <th>Promedio por Transacción</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresosMetodoPago.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre_tipometodopago}</td>
                      <td>
                        <Badge bg="secondary">
                          {item.cantidad_transacciones}
                        </Badge>
                      </td>
                      <td>
                        {formatCurrency(Number.parseInt(item.total_ingresos))}
                      </td>
                      <td>
                        {formatCurrency(
                          Number.parseInt(item.total_ingresos) /
                            Number.parseInt(item.cantidad_transacciones)
                        )}
                      </td>
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
