"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Form, Table, Alert, Nav, Tab, Spinner, Badge } from "react-bootstrap"
import {
  ShoppingCart,
  Users,
  Trophy,
  AlertTriangle,
  RefreshCw,
  FileText,
  Store,
  DollarSign,
  Percent,
  User,
  Building,
  AlertCircle,
} from "lucide-react"

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
}

const EstadisticasProductosClientes = () => {
  const [activeSection, setActiveSection] = useState("productos")
  const [fechaInicio, setFechaInicio] = useState("2025-08-30")
  const [fechaFin, setFechaFin] = useState("2025-08-31")
  const [tipoPeriodo, setTipoPeriodo] = useState("dia")
  const [ordenarPor, setOrdenarPor] = useState("unidades")
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false)

  // Estados para los datos
  const [productosData, setProductosData] = useState({
    masVendidos: [],
    bajoStock: [],
    historico: [],
  })
  const [clientesData, setClientesData] = useState({
    activos: [],
    mejores: [],
    ticketPromedio: [],
    segmentacion: [],
    dashboard: null,
  })

  const API_BASE = "http://localhost:4000/api/estadisticas"
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`)
    if (!response.ok) throw new Error("API not available")

    const data = await response.json()

    // Si es array lo devolvemos tal cual
    if (Array.isArray(data)) return data

    // Si es objeto (caso dashboards u otros), lo devolvemos completo
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    setApiError(true)
    return []
  }
}

  // Cargar datos según la sección activa
  useEffect(() => {
    loadData()
  }, [activeSection, fechaInicio, fechaFin, tipoPeriodo, ordenarPor])

  const loadData = async () => {
    setLoading(true)
    setApiError(false)
    const params = `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&tipoPeriodo=${tipoPeriodo}`

    try {
      if (activeSection === "productos") {
        const [masVendidos, bajoStock] = await Promise.all([
          fetchData(
            `/productos/mas-vendidos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&ordenarPor=${ordenarPor}&limite=10`,
          ),
          fetchData(`/productos/bajo-stock?limite=20`),
          ])
        setProductosData({
          masVendidos: Array.isArray(masVendidos) ? masVendidos : (masVendidos?.productosMasVendidos || []),
          bajoStock: Array.isArray(bajoStock) ? bajoStock : (bajoStock?.productosBajoStock || []),
          historico: [],
        })
      } else if (activeSection === "clientes") {
        const [activos, mejores, ticketPromedio, segmentacion, dashboard] = await Promise.all([
          fetchData(`/clientes/activos-por-periodo${params}`),
          fetchData(`/clientes/mejores?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&limite=10`),
          fetchData(`/clientes/ticket-promedio${params}`),
          fetchData(`/clientes/segmentacion?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
          fetchData(`/dashboard-clientes${params}`),
        ])
        setClientesData({
          activos: activos || [],
          mejores: mejores || [],
          ticketPromedio: ticketPromedio || [],
          segmentacion: segmentacion || [],
          dashboard: dashboard,
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CO")
  }

  const generatePDF = async (type) => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data: { fechaInicio, fechaFin, tipoPeriodo } }),
      })
      console.log(`PDF de ${type} generado exitosamente`)
    } catch (error) {
      console.error("Error generando PDF:", error)
    }
  }

  const renderProductos = () => (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Trophy size={20} style={{ color: colors.success }} className="me-2" />
              <Card.Title className="mb-0">Productos Más Vendidos</Card.Title>
            </div>
            <div className="d-flex align-items-center">
              <Form.Select
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value)}
                style={{ width: "120px", marginRight: "10px" }}
              >
                <option value="unidades">Unidades</option>
                <option value="monto">Monto</option>
              </Form.Select>
              <Button
                onClick={() => generatePDF("productos")}
                style={{ backgroundColor: colors.secondary, borderColor: colors.secondary }}
              >
                <FileText size={16} className="me-2" />
                PDF
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
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
              {productosData.masVendidos.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: "500" }}>{item.nombre_producto}</td>
                  <td>
                    <Badge bg="secondary" style={{ backgroundColor: colors.accent, color: colors.white }}>
                      {item.categoria}
                    </Badge>
                  </td>
                  <td style={{ color: colors.primary, fontWeight: "600" }}>{item.total_unidades}</td>
                  <td style={{ color: colors.success, fontWeight: "600" }}>{formatCurrency(item.total_ventas)}</td>
                  <td>{formatCurrency(item.precio_promedio)}</td>
                  <td>{Number.parseFloat(item.porcentaje_margen).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <div className="d-flex align-items-center">
            <AlertTriangle size={20} style={{ color: colors.warning }} className="me-2" />
            <Card.Title className="mb-0">Productos con Bajo Stock</Card.Title>
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Estado</th>
                <th>Valor Reposición</th>
              </tr>
            </thead>
            <tbody>
              {productosData.bajoStock.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: "500" }}>{item.nombre_producto}</td>
                  <td>
                    <Badge bg="secondary" style={{ backgroundColor: colors.accent, color: colors.white }}>
                      {item.categoria}
                    </Badge>
                  </td>
                  <td style={{ color: colors.warning, fontWeight: "600" }}>{item.stock_actual}</td>
                  <td>{item.stock_minimo}</td>
                  <td>
                    <Badge
                      bg={item.nivel_stock === "Bajo" ? "danger" : "success"}
                      style={{
                        backgroundColor: item.nivel_stock === "Bajo" ? colors.danger : colors.success,
                        color: colors.white,
                      }}
                      className="d-flex align-items-center"
                    >
                      {item.nivel_stock === "Bajo" && <AlertTriangle size={12} className="me-1" />}
                      {item.nivel_stock}
                    </Badge>
                  </td>
                  <td>{formatCurrency(item.valor_reposicion)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )

  const renderClientes = () => (
    <div>
      {clientesData.dashboard && (
        <Row className="mb-4">
          <Col md={6} className="mb-3">
            <Card style={{ borderLeft: `4px solid ${colors.primary}`, height: "100%" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontSize: "0.875rem", color: colors.text }}>Total Clientes</Card.Title>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: colors.primary }}>
                      {clientesData.dashboard.resumen?.totalClientes || 0}
                    </div>
                  </div>
                  <Users size={20} style={{ color: colors.primary }} />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card style={{ borderLeft: `4px solid ${colors.success}`, height: "100%" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontSize: "0.875rem", color: colors.text }}>Ticket Promedio</Card.Title>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: colors.success }}>
                      {formatCurrency(clientesData.dashboard.resumen?.ticketPromedioGeneral || 0)}
                    </div>
                  </div>
                  <DollarSign size={20} style={{ color: colors.success }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Trophy size={20} style={{ color: colors.success }} className="me-2" />
              <Card.Title className="mb-0">Mejores Clientes</Card.Title>
            </div>
            <Button
              onClick={() => generatePDF("clientes")}
              style={{ backgroundColor: colors.secondary, borderColor: colors.secondary }}
            >
              <FileText size={16} className="me-2" />
              PDF
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Total Compras</th>
                <th>Cantidad Compras</th>
                <th>Promedio Compra</th>
                <th>% Ventas</th>
              </tr>
            </thead>
            <tbody>
              {clientesData.mejores.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: "500" }}>{item.nombre_cliente}</td>
                  <td>
                    <Badge
                      bg="secondary"
                      style={{
                        backgroundColor: item.tipo_cliente === "Natural" ? colors.secondary : colors.primary,
                        color: colors.white,
                      }}
                      className="d-flex align-items-center"
                    >
                      {item.tipo_cliente === "Natural" ? (
                        <User size={12} className="me-1" />
                      ) : (
                        <Building size={12} className="me-1" />
                      )}
                      {item.tipo_cliente}
                    </Badge>
                  </td>
                  <td style={{ color: colors.success, fontWeight: "600" }}>{formatCurrency(item.total_compras)}</td>
                  <td>{item.cantidad_compras}</td>
                  <td>{formatCurrency(item.promedio_compra)}</td>
                  <td>{Number.parseFloat(item.porcentaje_ventas).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <div className="d-flex align-items-center">
            <Percent size={20} style={{ color: colors.accent }} className="me-2" />
            <Card.Title className="mb-0">Segmentación de Clientes</Card.Title>
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Segmento</th>
                <th>Estado</th>
                <th>Cantidad Clientes</th>
                <th>Total Ventas</th>
                <th>Promedio por Cliente</th>
              </tr>
            </thead>
            <tbody>
              {clientesData.segmentacion.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: "500" }}>{item.segmento_frecuencia}</td>
                  <td>
                    <Badge
                      bg="secondary"
                      style={{
                        backgroundColor: item.estado_actividad === "Activo" ? colors.success : colors.warning,
                        color: colors.white,
                      }}
                    >
                      {item.estado_actividad}
                    </Badge>
                  </td>
                  <td>{item.cantidad_clientes}</td>
                  <td style={{ color: colors.success, fontWeight: "600" }}>{formatCurrency(item.total_ventas)}</td>
                  <td>{formatCurrency(item.promedio_ventas_por_cliente)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )

  return (
    <div style={{ backgroundColor: colors.background, minHeight: "100vh", padding: "1.5rem" }}>
      <Container fluid>
        {apiError && (
          <Alert variant="info" className="mb-4">
            <AlertCircle size={16} className="me-2" />
            No se pudo conectar con la API en {API_BASE}. Mostrando datos de ejemplo. Para conectar con tu API real,
            asegúrate de que esté corriendo en el puerto 4000.
          </Alert>
        )}

        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Store size={32} style={{ color: colors.primary }} className="me-3" />
                <Card.Title style={{ fontSize: "1.75rem", color: colors.primary, margin: 0 }}>
                  Estadísticas de Productos y Clientes
                </Card.Title>
              </div>
              <Button
                variant="outline-secondary"
                onClick={loadData}
                disabled={loading}
                className="d-flex align-items-center"
              >
                <RefreshCw size={16} className={`me-2 ${loading ? "spin" : ""}`} />
                Actualizar
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {/* Filtros */}
            <Row className="mb-4">
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Fecha Inicio:</Form.Label>
                  <Form.Control type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Fecha Fin:</Form.Label>
                  <Form.Control type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Período:</Form.Label>
                  <Form.Select value={tipoPeriodo} onChange={(e) => setTipoPeriodo(e.target.value)}>
                    <option value="dia">Día</option>
                    <option value="semana">Semana</option>
                    <option value="mes">Mes</option>
                    <option value="trimestre">Trimestre</option>
                    <option value="semestre">Semestre</option>
                    <option value="año">Año</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Secciones */}
            <Tab.Container activeKey={activeSection} onSelect={setActiveSection}>
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="productos" className="d-flex align-items-center">
                    <ShoppingCart size={16} className="me-2" />
                    Productos
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="clientes" className="d-flex align-items-center">
                    <Users size={16} className="me-2" />
                    Clientes
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="productos">
                  {loading ? (
                    <Card>
                      <Card.Body className="text-center p-5">
                        <Spinner animation="border" className="me-2" />
                        Cargando...
                      </Card.Body>
                    </Card>
                  ) : (
                    renderProductos()
                  )}
                </Tab.Pane>

                <Tab.Pane eventKey="clientes">
                  {loading ? (
                    <Card>
                      <Card.Body className="text-center p-5">
                        <Spinner animation="border" className="me-2" />
                        Cargando...
                      </Card.Body>
                    </Card>
                  ) : (
                    renderClientes()
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default EstadisticasProductosClientes
