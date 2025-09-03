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

export default function EstadisticasClientes({
  fechaInicio,
  fechaFin,
  loading,
}) {
  const [clientesActivos, setClientesActivos] = useState([]);
  const [mejoresClientes, setMejoresClientes] = useState([]);
  const [clientesPorSede, setClientesPorSede] = useState([]);
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

      const clientesActivosResponse = await fetch(
        `http://localhost:4000/api/estadisticas/clientes/clientes-activos?fechaInicio=${formattedFechaInicio}&fechaFin=${formattedFechaFin}`
      );
      const clientesActivosData = await clientesActivosResponse.json();

      const mejoresClientesResponse = await fetch(
        `http://localhost:4000/api/estadisticas/clientes/mejores-clientes?fechaInicio=${formattedFechaInicio}&fechaFin=${formattedFechaFin}&limite=10`
      );
      const mejoresClientesData = await mejoresClientesResponse.json();

      const clientesPorSedeResponse = await fetch(
        `http://localhost:4000/api/estadisticas/clientes/clientes-por-sede`
      );
      const clientesPorSedeData = await clientesPorSedeResponse.json();

      setClientesActivos(clientesActivosData);
      setMejoresClientes(mejoresClientesData);
      setClientesPorSede(clientesPorSedeData);
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

  // Gráfica de clientes activos
  const clientesActivosChartData = {
    labels: clientesActivos.map((item) => formatDate(item.fecha)),
    datasets: [
      {
        label: "Clientes Activos",
        data: clientesActivos.map((item) =>
          Number.parseInt(item.cantidad_clientes)
        ),
        borderColor: colors.primary,
        backgroundColor: colors.primary + "20",
        tension: 0.4,
      },
    ],
  };

  // Gráfica de mejores clientes
  const mejoresClientesChartData = {
    labels: mejoresClientes.map((item) => item.nombre_cliente),
    datasets: [
      {
        label: "Total Compras",
        data: mejoresClientes.map((item) =>
          Number.parseInt(item.total_compras)
        ),
        backgroundColor: [colors.primary, colors.secondary, colors.accent],
        borderColor: [colors.primary, colors.secondary, colors.accent],
        borderWidth: 1,
      },
    ],
  };

  // Gráfica de distribución por tipo de cliente
  const tipoClienteData = {
    labels: ["Natural", "Jurídico"],
    datasets: [
      {
        data: [
          mejoresClientes.filter((c) => c.tipo_cliente === "Natural").length,
          mejoresClientes.filter((c) => c.tipo_cliente === "Jurídico").length,
        ],
        backgroundColor: [colors.secondary, colors.primary],
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
        <p className="mt-2">Cargando estadísticas de clientes...</p>
      </div>
    );
  }

  return (
    <div>
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <Card.Title>Clientes Activos por Fecha</Card.Title>
            </Card.Header>
            <Card.Body>
              <Line data={clientesActivosChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Datos - Clientes Activos</Card.Title>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Clientes</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesActivos.map((item, index) => (
                    <tr key={index}>
                      <td>{formatDate(item.fecha)}</td>
                      <td>
                        <Badge bg="primary">{item.cantidad_clientes}</Badge>
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
              <Card.Title>Mejores Clientes por Compras</Card.Title>
            </Card.Header>
            <Card.Body>
              <Bar data={mejoresClientesChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Datos - Mejores Clientes</Card.Title>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mejoresClientes.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "0.8rem" }}>
                        {item.nombre_cliente}
                      </td>
                      <td>
                        <Badge bg="success">
                          {formatCurrency(Number.parseInt(item.total_compras))}
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
              <Card.Title>Distribución por Tipo de Cliente</Card.Title>
            </Card.Header>
            <Card.Body>
              <Doughnut data={tipoClienteData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Datos - Tipo Cliente</Card.Title>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Natural</td>
                    <td>
                      <Badge bg="secondary">
                        {
                          mejoresClientes.filter(
                            (c) => c.tipo_cliente === "Natural"
                          ).length
                        }
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td>Jurídico</td>
                    <td>
                      <Badge bg="primary">
                        {
                          mejoresClientes.filter(
                            (c) => c.tipo_cliente === "Jurídico"
                          ).length
                        }
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla completa de mejores clientes */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Detalle Completo - Mejores Clientes</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Total Compras</th>
                    <th>Cantidad Compras</th>
                    <th>Promedio Compra</th>
                    <th>Última Compra</th>
                    <th>% Ventas</th>
                  </tr>
                </thead>
                <tbody>
                  {mejoresClientes.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre_cliente}</td>
                      <td>
                        <Badge
                          bg={
                            item.tipo_cliente === "Jurídico"
                              ? "primary"
                              : "secondary"
                          }
                        >
                          {item.tipo_cliente}
                        </Badge>
                      </td>
                      <td>
                        {formatCurrency(Number.parseInt(item.total_compras))}
                      </td>
                      <td>{item.cantidad_compras}</td>
                      <td>
                        {formatCurrency(
                          Number.parseFloat(item.promedio_compra)
                        )}
                      </td>
                      <td>{formatDate(item.ultima_compra)}</td>
                      <td>
                        {Number.parseFloat(item.porcentaje_ventas).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de clientes por sede */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Clientes por Sede</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Sede</th>
                    <th>Cliente</th>
                    <th>Total Facturas</th>
                    <th>Total Ventas</th>
                    <th>Ticket Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesPorSede.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre_sede}</td>
                      <td>{item.nombre_cliente}</td>
                      <td>{item.total_facturas}</td>
                      <td>
                        {formatCurrency(Number.parseInt(item.total_ventas))}
                      </td>
                      <td>
                        {formatCurrency(
                          Number.parseFloat(item.ticket_promedio)
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
