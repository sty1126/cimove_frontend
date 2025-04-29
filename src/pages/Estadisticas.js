"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, Typography, Button, Divider, Table, Avatar, Tag } from "antd"
import axios from "axios"
import { UserOutlined, DollarOutlined, SyncOutlined, AlertOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts"

const { Title, Text } = Typography

// Paleta de colores personalizada - versión más vibrante (igual que en Inventario)
const colors = {
  primary: "#0D7F93", // Teal más vibrante
  secondary: "#4D8A52", // Verde más vibrante
  accent: "#7FBAD6", // Azul más vibrante
  light: "#C3D3C6", // Verde menta claro
  background: "#E8EAEC", // Gris muy claro
  text: "#2A3033", // Texto oscuro
  success: "#4D8A52", // Verde más vibrante para éxito
  warning: "#E0A458", // Naranja apagado para advertencias
  danger: "#C25F48", // Rojo más vibrante para peligro
  natural: "#7FBAD6", // Color para clientes naturales
  juridico: "#4D8A52", // Color para clientes jurídicos
}

// Componente de estadística personalizado (igual que en Inventario)
const Statistic = ({ title, value, prefix, valueStyle }) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
        <Text type="secondary">{title}</Text>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "8px", fontSize: "16px" }}>{prefix}</span>
        <Text style={{ fontSize: "24px", fontWeight: "bold", ...valueStyle }}>{value}</Text>
      </div>
    </div>
  )
}

export default function EstadisticasPage() {
  // Estados
  const [clientes, setClientes] = useState([])
  const [abonos, setAbonos] = useState([])
  const [productosStock, setProductosStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [clientesPieData, setClientesPieData] = useState([])
  const [abonosChartData, setAbonosChartData] = useState([])
  const [stockChartData, setStockChartData] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  // Funciones para obtener datos
  const getClientes = async () => {
    try {
      const { data } = await axios.get("https://cimove-backend.onrender.com/api/estadisticas/ultimos-clientes")
      setClientes(data)

      // Contar clientes por tipo
      const naturales = data.filter((c) => c.tipo === "NATURAL").length
      const juridicos = data.filter((c) => c.tipo === "JURIDICO").length

      // Preparar datos para el gráfico circular
      const pieData = [
        { name: "Naturales", value: naturales, color: colors.natural },
        { name: "Jurídicos", value: juridicos, color: colors.juridico },
      ]

      setClientesPieData(pieData)
    } catch (error) {
      console.error("Error al obtener clientes:", error)
    }
  }

  const getAbonos = async () => {
    try {
      const { data } = await axios.get("https://cimove-backend.onrender.com/api/estadisticas/ultimos-abonos")
      setAbonos(data)

      // Preparar datos para el gráfico de abonos
      const chartData = data.map((abono) => {
        const fecha = new Date(abono.fecha_abonofactura)
        return {
          name: fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }),
          fecha: fecha,
          monto: Number(abono.monto_abonofactura),
          id: abono.id_abonofactura,
          id_factura: abono.id_facturaproveedor_abonofactura,
        }
      })

      // Ordenar por fecha
      chartData.sort((a, b) => a.fecha - b.fecha)

      setAbonosChartData(chartData)
    } catch (error) {
      console.error("Error al obtener abonos:", error)
    }
  }

  const getProductosStock = async () => {
    try {
      const { data } = await axios.get("https://cimove-backend.onrender.com/api/estadisticas/productos-stock-bajo")
      setProductosStock(data)

      // Preparar datos para el gráfico de stock
      const chartData = data.map((producto) => ({
        name:
          producto.nombre_producto.length > 15
            ? `${producto.nombre_producto.substring(0, 15)}...`
            : producto.nombre_producto,
        existencia: Number(producto.existencia_inventariolocal),
        stockMinimo: Number(producto.stockminimo_inventariolocal),
        sede: producto.nombre_sede,
        fullName: producto.nombre_producto,
      }))

      setStockChartData(chartData)
    } catch (error) {
      console.error("Error al obtener productos con stock bajo:", error)
    }
  }

  // Usar useCallback para memorizar la función cargarTodo
  const cargarTodo = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([getClientes(), getAbonos(), getProductosStock()])
    } catch (error) {
      console.error("Error al cargar datos:", error)
    } finally {
      setLoading(false)
    }
  }, []) // No hay dependencias porque las funciones internas no dependen de estados o props

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    cargarTodo()
  }, [cargarTodo]) // Ahora incluimos cargarTodo como dependencia

  // Estadísticas rápidas
  const stats = {
    totalClientes: clientes.length,
    totalAbonos: abonos.reduce((sum, item) => sum + Number(item.monto_abonofactura || 0), 0),
    productosStockBajo: productosStock.length,
    clientesNaturales: clientes.filter((c) => c.tipo === "NATURAL").length,
    clientesJuridicos: clientes.filter((c) => c.tipo === "JURIDICO").length,
    montoMaximo: Math.max(...abonos.map((a) => Number(a.monto_abonofactura) || 0), 0),
  }

  // Componente personalizado para el tooltip del gráfico de abonos
  const CustomTooltipAbonos = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const abono = abonosChartData.find((a) => a.name === label)

      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: `1px solid ${colors.light}`,
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: "0", fontWeight: "bold", color: colors.text }}>Fecha: {label}</p>
          <p style={{ margin: "0", color: colors.text }}>ID Factura: {abono ? abono.id_factura : "N/A"}</p>
          <p style={{ margin: "0", color: colors.secondary, fontWeight: "bold" }}>
            Monto: ${payload[0].value.toLocaleString("es-CO")}
          </p>
        </div>
      )
    }
    return null
  }

  // Componente personalizado para el tooltip del gráfico de stock
  const CustomTooltipStock = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const producto = stockChartData.find((p) => p.name === label)

      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: `1px solid ${colors.light}`,
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: "0", fontWeight: "bold", color: colors.text }}>{producto ? producto.fullName : label}</p>
          <p style={{ margin: "0", color: colors.text }}>Sede: {producto ? producto.sede : "N/A"}</p>
          <p style={{ margin: "0", color: colors.danger, fontWeight: "bold" }}>Existencia: {payload[0].value}</p>
          <p style={{ margin: "0", color: colors.warning }}>Stock Mínimo: {producto ? producto.stockMinimo : "N/A"}</p>
        </div>
      )
    }
    return null
  }

  // Función para renderizar el sector activo del gráfico circular
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={colors.text}
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill={colors.text}
        >{`${value} clientes`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    )
  }

  // Función para manejar el hover en el gráfico circular
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  // Columnas para la tabla de clientes
  const clientesColumns = [
    {
      title: "Cliente",
      dataIndex: "nombre",
      key: "nombre",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size={40}
            style={{
              backgroundColor: record.tipo === "NATURAL" ? colors.natural : colors.juridico,
              marginRight: 12,
            }}
            icon={<UserOutlined style={{ color: "#fff" }} />}
          />
          <div>
            <Text strong style={{ color: colors.text }}>
              {text}
            </Text>
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.apellido}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "ID",
      dataIndex: "id_cliente",
      key: "id_cliente",
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      render: (tipo) => (
        <Tag
          color={tipo === "NATURAL" ? colors.natural : colors.juridico}
          style={{
            color: tipo === "NATURAL" ? "#0D5F70" : "#2A4A2D",
            padding: "2px 8px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: tipo === "NATURAL" ? `${colors.natural}40` : `${colors.juridico}40`,
          }}
        >
          {tipo}
        </Tag>
      ),
    },
  ]

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      <Card
        bordered={false}
        style={{
          marginBottom: "24px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Title level={2} style={{ margin: 0, color: colors.primary }}>
            Estadísticas del Sistema
          </Title>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={cargarTodo}
            loading={loading}
            style={{
              borderRadius: "6px",
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
          >
            Actualizar
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <Card
            size="small"
            style={{
              width: "220px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderLeft: `4px solid ${colors.primary}`,
            }}
          >
            <Statistic
              title="Clientes Naturales"
              value={stats.clientesNaturales}
              prefix={<UserOutlined style={{ color: colors.natural }} />}
              valueStyle={{ color: colors.natural }}
            />
          </Card>
          <Card
            size="small"
            style={{
              width: "220px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderLeft: `4px solid ${colors.secondary}`,
            }}
          >
            <Statistic
              title="Clientes Jurídicos"
              value={stats.clientesJuridicos}
              prefix={<UserOutlined style={{ color: colors.juridico }} />}
              valueStyle={{ color: colors.juridico }}
            />
          </Card>
          <Card
            size="small"
            style={{
              width: "220px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderLeft: `4px solid ${colors.secondary}`,
            }}
          >
            <Statistic
              title="Total Abonos"
              value={`$${stats.totalAbonos.toLocaleString("es-CO")}`}
              prefix={<DollarOutlined style={{ color: colors.secondary }} />}
              valueStyle={{ color: colors.secondary }}
            />
          </Card>
          <Card
            size="small"
            style={{
              width: "220px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderLeft: `4px solid ${colors.danger}`,
            }}
          >
            <Statistic
              title="Productos Bajo Stock"
              value={stats.productosStockBajo}
              prefix={<AlertOutlined style={{ color: colors.danger }} />}
              valueStyle={{ color: colors.danger }}
            />
          </Card>
        </div>

        <Divider style={{ margin: "12px 0", borderColor: colors.light }} />
      </Card>

      {/* Gráfico y Tabla de Clientes */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserOutlined style={{ color: colors.primary }} />
            <span style={{ color: colors.primary }}>Últimos 10 Clientes</span>
          </div>
        }
        bordered={false}
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
        headStyle={{ borderBottom: `1px solid ${colors.light}` }}
      >
        {loading ? (
          <div style={{ height: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            Cargando...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {/* Gráfico circular */}
              <div style={{ flex: "1 1 300px", minHeight: "300px" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={clientesPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    >
                      {clientesPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <text
                      x="50%"
                      y="20"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "16px", fontWeight: "bold", fill: colors.text }}
                    >
                      Distribución por Tipo
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Tabla de clientes */}
              <div style={{ flex: "1 1 500px" }}>
                <Table
                  dataSource={clientes}
                  columns={clientesColumns}
                  rowKey="id_cliente"
                  pagination={false}
                  style={{ marginTop: "0" }}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Gráfico de Abonos */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DollarOutlined style={{ color: colors.secondary }} />
            <span style={{ color: colors.secondary }}>Últimos 10 Abonos</span>
          </div>
        }
        bordered={false}
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
        headStyle={{ borderBottom: `1px solid ${colors.light}` }}
      >
        {loading ? (
          <div style={{ height: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            Cargando...
          </div>
        ) : (
          <div style={{ height: "400px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={abonosChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.light} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: colors.text, fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: colors.text }}
                  domain={[0, stats.montoMaximo * 1.1]}
                  tickFormatter={(value) => `$${value.toLocaleString("es-CO")}`}
                />
                <Tooltip content={<CustomTooltipAbonos />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "14px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="monto"
                  stroke={colors.secondary}
                  strokeWidth={3}
                  dot={{ fill: colors.secondary, r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Monto del Abono"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Gráfico de Productos con Bajo Stock */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShoppingCartOutlined style={{ color: colors.danger }} />
            <span style={{ color: colors.danger }}>Top 5 Productos con Menor Existencia</span>
          </div>
        }
        bordered={false}
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
        headStyle={{ borderBottom: `1px solid ${colors.light}` }}
      >
        {loading ? (
          <div style={{ height: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            Cargando...
          </div>
        ) : (
          <div style={{ height: "400px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                layout="vertical"
                data={stockChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 100,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.light} horizontal={false} />
                <XAxis type="number" tick={{ fill: colors.text }} />
                <YAxis dataKey="name" type="category" tick={{ fill: colors.text, fontSize: 12 }} width={100} />
                <Tooltip content={<CustomTooltipStock />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "14px",
                  }}
                />
                <Bar
                  dataKey="existencia"
                  fill={colors.danger}
                  name="Existencia Actual"
                  barSize={20}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="stockMinimo"
                  fill={colors.warning}
                  name="Stock Mínimo"
                  barSize={20}
                  radius={[0, 4, 4, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  )
}
