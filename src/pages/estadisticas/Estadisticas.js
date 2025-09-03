"use client"

import { Card, Row, Col, Table, Button } from "react-bootstrap"
import { DollarSign, TrendingUp, TrendingDown, PieChart, FileText } from "lucide-react"

const colors = { primary:"#0D7F93", success:"#4D8A52", danger:"#C25F48", accent:"#7FBAD6", text:"#2A3033" }

export const Estadisticas = ({ dashboardData, generatePDF, formatCurrency }) => {
  if (!dashboardData) return <div className="text-center p-5">Cargando datos...</div>

  return (
    <div>
      <Row className="mb-4">
        <Col md={3}><Card style={{ borderLeft: `4px solid ${colors.success}` }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title style={{ fontSize:"0.875rem", color: colors.text }}>Total Ingresos</Card.Title>
                <div style={{ fontSize:"1.5rem", fontWeight:"bold", color: colors.success }}>
                  {formatCurrency(dashboardData.resumen?.totalIngresos || 0)}
                </div>
              </div>
              <TrendingUp size={20} style={{ color: colors.success }} />
            </div>
          </Card.Body>
        </Card></Col>

        <Col md={3}><Card style={{ borderLeft: `4px solid ${colors.danger}` }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title style={{ fontSize:"0.875rem", color: colors.text }}>Total Egresos</Card.Title>
                <div style={{ fontSize:"1.5rem", fontWeight:"bold", color: colors.danger }}>
                  {formatCurrency(dashboardData.resumen?.totalEgresos || 0)}
                </div>
              </div>
              <TrendingDown size={20} style={{ color: colors.danger }} />
            </div>
          </Card.Body>
        </Card></Col>

        <Col md={3}><Card style={{ borderLeft: `4px solid ${colors.primary}` }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title style={{ fontSize:"0.875rem", color: colors.text }}>Beneficio Neto</Card.Title>
                <div style={{ fontSize:"1.5rem", fontWeight:"bold", color: colors.primary }}>
                  {formatCurrency(dashboardData.resumen?.beneficioNeto || 0)}
                </div>
              </div>
              <DollarSign size={20} style={{ color: colors.primary }} />
            </div>
          </Card.Body>
        </Card></Col>

        <Col md={3}><Card style={{ borderLeft: `4px solid ${colors.accent}` }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title style={{ fontSize:"0.875rem", color: colors.text }}>Margen</Card.Title>
                <div style={{ fontSize:"1.5rem", fontWeight:"bold", color: colors.accent }}>
                  {dashboardData.resumen?.margenPorcentaje || 0}%
                </div>
              </div>
              <PieChart size={20} style={{ color: colors.accent }} />
            </div>
          </Card.Body>
        </Card></Col>
      </Row>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <PieChart size={20} style={{ color: colors.primary }} className="me-2" />
            <Card.Title className="mb-0">Ingresos por Categoría</Card.Title>
          </div>
          <Button onClick={() => generatePDF("dashboard")} style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
            <FileText size={16} className="me-2" /> Generar PDF
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Ingreso Total</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {(dashboardData.ingresos?.porCategoria || []).map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight:"500" }}>{item.categoria}</td>
                  <td style={{ color: colors.success, fontWeight:"600" }}>{formatCurrency(item.ingreso_total)}</td>
                  <td>{item.porcentaje}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )
}
