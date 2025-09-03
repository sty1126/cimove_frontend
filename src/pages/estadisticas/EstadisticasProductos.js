"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Table, Badge } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
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

export default function EstadisticasProductos({
  fechaInicio,
  fechaFin,
  loading,
}) {
  const [masVendidos, setMasVendidos] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [historicoVentas, setHistoricoVentas] = useState([]);
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

      const masVendidosResponse = await fetch(
        `http://localhost:4000/api/estadisticas/productos/mas-vendidos?fechaInicio=${formattedFechaInicio}&fechaFin=${formattedFechaFin}&ordenarPor=unidades&limite=10`
      );
      const masVendidosData = await masVendidosResponse.json();

      const bajoStockResponse = await fetch(
        `http://localhost:4000/api/estadisticas/productos/bajo-stock?limite=20`
      );
      const bajoStockData = await bajoStockResponse.json();

      setMasVendidos(masVendidosData);
      setBajoStock(bajoStockData);
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

  // Gráfica de productos más vendidos
  const masVendidosChartData = {
    labels: masVendidos
      .slice(0, 5)
      .map((item) => item.nombre_producto.substring(0, 20) + "..."),
    datasets: [
      {
        label: "Unidades Vendidas",
        data: masVendidos
          .slice(0, 5)
          .map((item) => Number.parseInt(item.total_unidades)),
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        borderWidth: 1,
      },
    ],
  };

  // Gráfica de ventas por producto
  const ventasChartData = {
    labels: masVendidos
      .slice(0, 5)
      .map((item) => item.nombre_producto.substring(0, 20) + "..."),
    datasets: [
      {
        label: "Total Ventas",
        data: masVendidos
          .slice(0, 5)
          .map((item) => Number.parseInt(item.total_ventas)),
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
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
        <p className="mt-2">Cargando estadísticas de productos...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Productos Más Vendidos - Unidades */}
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <Card.Title>Productos Más Vendidos (Unidades)</Card.Title>
            </Card.Header>
            <Card.Body>
              <Bar data={masVendidosChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Datos - Unidades</Card.Title>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Unidades</th>
                  </tr>
                </thead>
                <tbody>
                  {masVendidos.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "0.8rem" }}>
                        {item.nombre_producto.substring(0, 25)}...
                      </td>
                      <td>
                        <Badge bg="primary">{item.total_unidades}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Productos Más Vendidos - Ventas */}
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <Card.Title>Productos Más Vendidos (Ventas)</Card.Title>
            </Card.Header>
            <Card.Body>
              <Bar data={ventasChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Datos - Ventas</Card.Title>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Total Ventas</th>
                  </tr>
                </thead>
                <tbody>
                  {masVendidos.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "0.8rem" }}>
                        {item.nombre_producto.substring(0, 25)}...
                      </td>
                      <td>
                        <Badge bg="success">
                          {formatCurrency(Number.parseInt(item.total_ventas))}
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

      {/* Tabla completa de productos más vendidos */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>
                Detalle Completo - Top Productos Más Vendidos
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Unidades</th>
                    <th>Total Ventas</th>
                    <th>Precio Promedio</th>
                    <th>Margen %</th>
                  </tr>
                </thead>
                <tbody>
                  {masVendidos.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre_producto}</td>
                      <td>{item.categoria}</td>
                      <td>{item.total_unidades}</td>
                      <td>
                        {formatCurrency(Number.parseInt(item.total_ventas))}
                      </td>
                      <td>
                        {formatCurrency(
                          Number.parseFloat(item.precio_promedio)
                        )}
                      </td>
                      <td>
                        <Badge
                          bg={
                            Number.parseFloat(item.porcentaje_margen) > 30
                              ? "success"
                              : "warning"
                          }
                        >
                          {Number.parseFloat(item.porcentaje_margen).toFixed(1)}
                          %
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

      {/* Productos con bajo stock */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Productos con Bajo Stock</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Sede</th>
                    <th>Stock Actual</th>
                    <th>Stock Mínimo</th>
                    <th>Faltantes</th>
                    <th>Valor Reposición</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bajoStock.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre_producto}</td>
                      <td>{item.nombre_sede}</td>
                      <td>{item.stock_actual}</td>
                      <td>{item.stock_minimo}</td>
                      <td>{item.unidades_faltantes}</td>
                      <td>{formatCurrency(item.valor_reposicion)}</td>
                      <td>
                        <Badge bg="danger">{item.nivel_stock}</Badge>
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
