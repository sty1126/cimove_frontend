"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Tabs,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Badge,
  Segmented,
  Spin,
  Empty,
  Alert,
  Input,
  Select,
  message,
  Tooltip,
} from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  BarChartOutlined,
  ReloadOutlined,
  TableOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  StockOutlined,
  PhoneOutlined,
  AlertOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

// Paleta de colores personalizada
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
};

// Colores para gráficos
const chartColors = [
  colors.primary,
  colors.secondary,
  colors.accent,
  "#8A6E4D", // Marrón
  "#93560D", // Naranja oscuro
  "#5E4D8A", // Púrpura
  "#8A4D7F", // Rosa oscuro
  "#4D8A7F", // Verde azulado
  "#7F4D8A", // Violeta
  "#8A4D4D", // Rojo oscuro
];

const EstadisticasClientesProductos = () => {
  // Estados para controlar la vista
  const [activeSection, setActiveSection] = useState("productos");
  const [loading, setLoading] = useState(true);
  const [vistaProductos, setVistaProductos] = useState("graficos");
  const [vistaClientes, setVistaClientes] = useState("graficos");
  const [searchText, setSearchText] = useState("");
  const [filtroProductos, setFiltroProductos] = useState("todos");
  const [filtroClientes, setFiltroClientes] = useState("todos");

  // Estados para datos de productos
  const [productosPorCantidad, setProductosPorCantidad] = useState([]);
  const [productosPorValor, setProductosPorValor] = useState([]);
  const [productosFrecuentes, setProductosFrecuentes] = useState([]);
  const [stockVsVentas, setStockVsVentas] = useState([]);
  const [productosObsoletos, setProductosObsoletos] = useState([]);

  // Estados para datos de clientes
  const [clientesPorMonto, setClientesPorMonto] = useState([]);
  const [clientesPorCantidad, setClientesPorCantidad] = useState([]);
  const [clientesPorFrecuencia, setClientesPorFrecuencia] = useState([]);
  const [clientesFrecuentesVsEsporadicos, setClientesFrecuentesVsEsporadicos] =
    useState([]);
  const [clientesConPagosPendientes, setClientesConPagosPendientes] = useState(
    []
  );

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar datos de productos
        const [
          productosPorCantidadRes,
          productosPorValorRes,
          productosFrecuentesRes,
          stockVsVentasRes,
          productosObsoletosRes,
          // Cargar datos de clientes
          clientesPorMontoRes,
          clientesPorCantidadRes,
          clientesPorFrecuenciaRes,
          clientesFrecuentesVsEsporadicosRes,
          clientesConPagosPendientesRes,
        ] = await Promise.all([
          // Productos
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/top-productos/cantidad"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/top-productos/valor"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/productos-frecuentes"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/stock-vs-ventas"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/productos-obsoletos"
          ),
          // Clientes
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/top-clientes/monto"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/top-clientes/cantidad"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/top-clientes/frecuencia"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/clientes-frecuentes-vs-esporadicos"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/clientes-pagos-pendientes"
          ),
        ]);

        // Establecer datos de productos
        setProductosPorCantidad(productosPorCantidadRes.data);
        setProductosPorValor(productosPorValorRes.data);
        setProductosFrecuentes(productosFrecuentesRes.data);
        setStockVsVentas(stockVsVentasRes.data);
        setProductosObsoletos(productosObsoletosRes.data);

        // Establecer datos de clientes
        setClientesPorMonto(clientesPorMontoRes.data);
        setClientesPorCantidad(clientesPorCantidadRes.data || []); // Fallback a array vacío si no hay datos
        setClientesPorFrecuencia(clientesPorFrecuenciaRes.data || []);
        setClientesFrecuentesVsEsporadicos(
          clientesFrecuentesVsEsporadicosRes.data || []
        );
        setClientesConPagosPendientes(clientesConPagosPendientesRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Formatear moneda
  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "-";

    // Convertir a número si es string
    const numValue =
      typeof value === "string" ? Number.parseFloat(value) : value;

    // Verificar nuevamente si es un número válido
    if (isNaN(numValue)) return "-";

    try {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .format(numValue)
        .replace("COP", "$");
    } catch (error) {
      console.error("Error al formatear valor:", error);
      return `$ ${numValue.toLocaleString()}`;
    }
  };

  // Componente personalizado para el tooltip de Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{`${
            label || payload[0].name
          }`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ margin: 0, color: entry.color }}>
              {entry.name}:{" "}
              {entry.dataKey.includes("total_valor") ||
              entry.dataKey.includes("total_compras")
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Filtrar datos de productos
  const filtrarProductos = (data, searchText, filtro) => {
    if (!data) return [];

    let filteredData = [...data];

    // Aplicar filtro de búsqueda
    if (searchText) {
      filteredData = filteredData.filter(
        (item) =>
          item.nombre_producto &&
          item.nombre_producto.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Aplicar filtro de categoría
    if (filtro === "vendidos") {
      filteredData = filteredData.filter(
        (item) => item.total_vendido && Number(item.total_vendido) > 0
      );
    } else if (filtro === "no_vendidos") {
      filteredData = filteredData.filter(
        (item) => !item.total_vendido || Number(item.total_vendido) === 0
      );
    } else if (filtro === "con_stock") {
      filteredData = filteredData.filter(
        (item) => item.stock_actual && Number(item.stock_actual) > 0
      );
    } else if (filtro === "sin_stock") {
      filteredData = filteredData.filter(
        (item) => !item.stock_actual || Number(item.stock_actual) === 0
      );
    }

    return filteredData;
  };

  // Filtrar datos de clientes
  const filtrarClientes = (data, searchText, filtro) => {
    if (!data) return [];

    let filteredData = [...data];

    // Aplicar filtro de búsqueda
    if (searchText) {
      filteredData = filteredData.filter(
        (item) =>
          item.nombre_cliente &&
          item.nombre_cliente.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Aplicar filtro de categoría
    if (filtro === "con_deuda") {
      filteredData = filteredData.filter(
        (item) => item.total_pendiente && Number(item.total_pendiente) > 0
      );
    } else if (filtro === "sin_deuda") {
      filteredData = filteredData.filter(
        (item) => !item.total_pendiente || Number(item.total_pendiente) === 0
      );
    } else if (filtro === "frecuentes") {
      // Aquí podríamos aplicar un filtro para clientes frecuentes si tuviéramos ese dato
      filteredData = filteredData;
    }

    return filteredData;
  };

  // Renderizar sección de productos
  const renderProductos = () => {
    // Filtrar datos
    const productosFiltrados = filtrarProductos(
      stockVsVentas,
      searchText,
      filtroProductos
    );

    // Calcular estadísticas
    const totalProductos = stockVsVentas ? stockVsVentas.length : 0;
    const productosVendidos = stockVsVentas
      ? stockVsVentas.filter(
          (p) => p.total_vendido && Number(p.total_vendido) > 0
        ).length
      : 0;
    const productosConStock = stockVsVentas
      ? stockVsVentas.filter(
          (p) => p.stock_actual && Number(p.stock_actual) > 0
        ).length
      : 0;
    const productosObsoletosCount = productosObsoletos
      ? productosObsoletos.length
      : 0;

    return (
      <div>
        <div className="mb-6">
          {/* Remove search and filter */}

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Total Productos"
                  value={totalProductos}
                  prefix={
                    <ShoppingOutlined style={{ color: colors.primary }} />
                  }
                  valueStyle={{ color: colors.primary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Productos Vendidos"
                  value={productosVendidos}
                  prefix={
                    <CheckCircleOutlined style={{ color: colors.success }} />
                  }
                  valueStyle={{ color: colors.success }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Con Stock"
                  value={productosConStock}
                  prefix={<StockOutlined style={{ color: colors.accent }} />}
                  valueStyle={{ color: colors.accent }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Productos Obsoletos"
                  value={productosObsoletosCount}
                  prefix={<WarningOutlined style={{ color: colors.danger }} />}
                  valueStyle={{ color: colors.danger }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <div className="mb-6">
          <Segmented
            options={[
              {
                label: (
                  <Space>
                    <BarChartOutlined />
                    Gráficos
                  </Space>
                ),
                value: "graficos",
              },
              {
                label: (
                  <Space>
                    <TableOutlined />
                    Tablas
                  </Space>
                ),
                value: "tablas",
              },
            ]}
            value={vistaProductos}
            onChange={setVistaProductos}
            style={{ marginBottom: "20px" }}
          />
        </div>

        {vistaProductos === "graficos" ? (
          <div>
            <Row gutter={[24, 24]} className="mb-6">
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <BarChartOutlined style={{ color: colors.primary }} />
                      <span>Productos más vendidos por cantidad</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <div style={{ height: "400px" }}>
                    {productosPorCantidad && productosPorCantidad.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productosPorCantidad}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis
                            dataKey="nombre_producto"
                            type="category"
                            width={150}
                          />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="total_vendido"
                            name="Cantidad Vendida"
                            fill={colors.primary}
                            radius={[0, 4, 4, 0]}
                          >
                            {productosPorCantidad.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={chartColors[index % chartColors.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="No hay datos disponibles" />
                    )}
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <DollarOutlined style={{ color: colors.primary }} />
                      <span>Productos más vendidos por valor</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <div style={{ height: "400px" }}>
                    {productosPorValor && productosPorValor.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productosPorValor}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis
                            dataKey="nombre_producto"
                            type="category"
                            width={150}
                          />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="total_valor"
                            name="Valor Total"
                            fill={colors.secondary}
                            radius={[0, 4, 4, 0]}
                          >
                            {productosPorValor.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={chartColors[index % chartColors.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="No hay datos disponibles" />
                    )}
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]} className="mb-6">
              <Col xs={24}>
                <Card
                  title={
                    <Space>
                      <StockOutlined style={{ color: colors.primary }} />
                      <span>Stock vs Ventas</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <div style={{ height: "500px" }}>
                    {productosFiltrados && productosFiltrados.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid />
                          <XAxis
                            type="number"
                            dataKey="stock_actual"
                            name="Stock"
                            label={{
                              value: "Stock Actual",
                              position: "insideBottomRight",
                              offset: -5,
                            }}
                          />
                          <YAxis
                            type="number"
                            dataKey="total_vendido"
                            name="Ventas"
                            label={{
                              value: "Total Vendido",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <ZAxis range={[60, 400]} />
                          <RechartsTooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            content={<CustomTooltip />}
                          />
                          <Legend />
                          <Scatter
                            name="Productos"
                            data={productosFiltrados.map((item) => ({
                              ...item,
                              stock_actual: item.stock_actual
                                ? Number(item.stock_actual)
                                : 0,
                              total_vendido: item.total_vendido
                                ? Number(item.total_vendido)
                                : 0,
                            }))}
                            fill={colors.primary}
                          >
                            {productosFiltrados.map((entry, index) => {
                              // Color según si es un producto vendido o no
                              const color =
                                entry.total_vendido &&
                                Number(entry.total_vendido) > 0
                                  ? colors.success
                                  : colors.danger;
                              return (
                                <Cell key={`cell-${index}`} fill={color} />
                              );
                            })}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="No hay datos disponibles" />
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <div>
            <Row gutter={[24, 24]} className="mb-6">
              <Col xs={24}>
                <Card
                  title={
                    <Space>
                      <StockOutlined style={{ color: colors.primary }} />
                      <span>Inventario y Ventas de Productos</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <Table
                    columns={[
                      {
                        title: "Producto",
                        dataIndex: "nombre_producto",
                        key: "nombre_producto",
                        render: (text) => (
                          <Space>
                            <ShoppingOutlined
                              style={{ color: colors.primary }}
                            />
                            <Text strong>{text}</Text>
                          </Space>
                        ),
                        sorter: (a, b) =>
                          a.nombre_producto.localeCompare(b.nombre_producto),
                      },
                      {
                        title: "Stock Actual",
                        dataIndex: "stock_actual",
                        key: "stock_actual",
                        align: "center",
                        render: (text) => {
                          if (!text || text === "null")
                            return <Badge status="error" text="Sin stock" />;
                          const stock = Number(text);
                          let status = "success";
                          if (stock < 10) status = "error";
                          else if (stock < 20) status = "warning";
                          return <Badge status={status} text={stock} />;
                        },
                        sorter: (a, b) => {
                          const stockA = a.stock_actual
                            ? Number(a.stock_actual)
                            : 0;
                          const stockB = b.stock_actual
                            ? Number(b.stock_actual)
                            : 0;
                          return stockA - stockB;
                        },
                      },
                      {
                        title: "Vendidos",
                        dataIndex: "total_vendido",
                        key: "total_vendido",
                        align: "center",
                        render: (text) => {
                          const vendidos = Number(text || 0);
                          return vendidos > 0 ? (
                            <Tag color={colors.success}>{vendidos}</Tag>
                          ) : (
                            <Tag color={colors.danger}>0</Tag>
                          );
                        },
                        sorter: (a, b) => {
                          const vendidosA = a.total_vendido
                            ? Number(a.total_vendido)
                            : 0;
                          const vendidosB = b.total_vendido
                            ? Number(b.total_vendido)
                            : 0;
                          return vendidosA - vendidosB;
                        },
                      },
                      {
                        title: "Estado",
                        key: "estado",
                        align: "center",
                        render: (_, record) => {
                          const vendidos = Number(record.total_vendido || 0);
                          const stock = record.stock_actual
                            ? Number(record.stock_actual)
                            : 0;

                          if (vendidos === 0) {
                            return <Tag color="red">Sin movimiento</Tag>;
                          } else if (stock === 0) {
                            return <Tag color="orange">Agotado</Tag>;
                          } else if (stock < 10) {
                            return <Tag color="gold">Stock bajo</Tag>;
                          } else {
                            return <Tag color="green">Disponible</Tag>;
                          }
                        },
                        filters: [
                          { text: "Sin movimiento", value: "sin_movimiento" },
                          { text: "Agotado", value: "agotado" },
                          { text: "Stock bajo", value: "stock_bajo" },
                          { text: "Disponible", value: "disponible" },
                        ],
                        onFilter: (value, record) => {
                          const vendidos = Number(record.total_vendido || 0);
                          const stock = record.stock_actual
                            ? Number(record.stock_actual)
                            : 0;

                          if (value === "sin_movimiento") return vendidos === 0;
                          if (value === "agotado")
                            return vendidos > 0 && stock === 0;
                          if (value === "stock_bajo")
                            return stock > 0 && stock < 10;
                          if (value === "disponible") return stock >= 10;
                          return true;
                        },
                      },
                      {
                        title: "Acciones",
                        key: "acciones",
                        align: "center",
                        render: () => (
                          <Space>
                            <Button
                              type="primary"
                              size="small"
                              icon={<EditOutlined />}
                            >
                              Editar
                            </Button>
                            <Button
                              type="default"
                              size="small"
                              icon={<StockOutlined />}
                            >
                              Actualizar Stock
                            </Button>
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={productosFiltrados.map((item, index) => ({
                      ...item,
                      key: index,
                    }))}
                    pagination={{ pageSize: 10 }}
                    summary={(pageData) => {
                      const totalStock = pageData.reduce(
                        (sum, item) =>
                          sum +
                          (item.stock_actual ? Number(item.stock_actual) : 0),
                        0
                      );
                      const totalVendidos = pageData.reduce(
                        (sum, item) =>
                          sum +
                          (item.total_vendido ? Number(item.total_vendido) : 0),
                        0
                      );

                      return (
                        <Table.Summary.Row>
                          <Table.Summary.Cell>
                            <Text strong>Total</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="center">
                            <Text strong>{totalStock}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="center">
                            <Text strong>{totalVendidos}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell colSpan={2} />
                        </Table.Summary.Row>
                      );
                    }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]} className="mb-6">
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <DollarOutlined style={{ color: colors.primary }} />
                      <span>Productos por valor de venta</span>
                      <Tooltip title="Muestra los productos ordenados por el valor total de ventas generado. Representa el impacto económico de cada producto en los ingresos de la empresa.">
                        <InfoCircleOutlined style={{ color: colors.accent }} />
                      </Tooltip>
                    </Space>
                  }
                  bordered={false}
                >
                  <Table
                    columns={[
                      {
                        title: "Producto",
                        dataIndex: "nombre_producto",
                        key: "nombre_producto",
                        render: (text) => <Text strong>{text}</Text>,
                      },
                      {
                        title: "Valor Total",
                        dataIndex: "total_valor",
                        key: "total_valor",
                        align: "right",
                        render: (text) => (
                          <Text style={{ color: colors.success }}>
                            {formatCurrency(text)}
                          </Text>
                        ),
                        sorter: (a, b) =>
                          Number(a.total_valor) - Number(b.total_valor),
                      },
                    ]}
                    dataSource={productosPorValor.map((item, index) => ({
                      ...item,
                      key: index,
                    }))}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <AlertOutlined style={{ color: colors.danger }} />
                      <span>Productos sin movimiento</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <Table
                    columns={[
                      {
                        title: "Producto",
                        dataIndex: "nombre_producto",
                        key: "nombre_producto",
                        render: (text) => <Text strong>{text}</Text>,
                      },
                      {
                        title: "Ventas",
                        dataIndex: "total_vendido",
                        key: "total_vendido",
                        align: "center",
                        render: () => <Tag color={colors.danger}>0</Tag>,
                      },
                    ]}
                    dataSource={productosObsoletos.map((item, index) => ({
                      ...item,
                      key: index,
                    }))}
                    pagination={{ pageSize: 5 }}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  };

  // Renderizar sección de clientes
  const renderClientes = () => {
    // Filtrar datos
    const clientesFiltrados = filtrarClientes(
      clientesConPagosPendientes,
      searchText,
      filtroClientes
    );

    // Calcular estadísticas
    const totalClientes = clientesPorMonto ? clientesPorMonto.length : 0;
    const clientesConDeuda = clientesConPagosPendientes
      ? clientesConPagosPendientes.length
      : 0;
    const totalDeuda = clientesConPagosPendientes
      ? clientesConPagosPendientes.reduce(
          (sum, cliente) => sum + Number(cliente.total_pendiente || 0),
          0
        )
      : 0;
    const totalCompras = clientesPorMonto
      ? clientesPorMonto.reduce(
          (sum, cliente) => sum + Number(cliente.total_compras || 0),
          0
        )
      : 0;

    return (
      <div>
        <div className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Total Clientes"
                  value={totalClientes}
                  prefix={<UserOutlined style={{ color: colors.primary }} />}
                  valueStyle={{ color: colors.primary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Clientes con Deuda"
                  value={clientesConDeuda}
                  prefix={<WarningOutlined style={{ color: colors.danger }} />}
                  valueStyle={{ color: colors.danger }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Total Ventas"
                  value={totalCompras}
                  prefix={<DollarOutlined style={{ color: colors.success }} />}
                  valueStyle={{ color: colors.success }}
                  formatter={(value) => formatCurrency(value)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Total Pendiente"
                  value={totalDeuda}
                  prefix={
                    <ExclamationCircleOutlined
                      style={{ color: colors.warning }}
                    />
                  }
                  valueStyle={{ color: colors.warning }}
                  formatter={(value) => formatCurrency(value)}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <div className="mb-6">
          <Segmented
            options={[
              {
                label: (
                  <Space>
                    <BarChartOutlined />
                    Gráficos
                  </Space>
                ),
                value: "graficos",
              },
              {
                label: (
                  <Space>
                    <TableOutlined />
                    Tablas
                  </Space>
                ),
                value: "tablas",
              },
            ]}
            value={vistaClientes}
            onChange={setVistaClientes}
            style={{ marginBottom: "20px" }}
          />
        </div>

        {vistaClientes === "graficos" ? (
          <div>
            <Row gutter={[24, 24]} className="mb-6">
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <BarChartOutlined style={{ color: colors.primary }} />
                      <span>Clientes por monto de compra</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <div style={{ height: "400px" }}>
                    {clientesPorMonto && clientesPorMonto.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={clientesPorMonto}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis
                            dataKey="nombre_cliente"
                            type="category"
                            width={150}
                          />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="total_compras"
                            name="Total Compras"
                            fill={colors.primary}
                            radius={[0, 4, 4, 0]}
                          >
                            {clientesPorMonto.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={chartColors[index % chartColors.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="No hay datos disponibles" />
                    )}
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <UserOutlined style={{ color: colors.primary }} />
                      <span>Frecuencia de compras por cliente</span>
                      <Tooltip title="Muestra la frecuencia con la que cada cliente realiza compras, ayudando a identificar clientes habituales.">
                        <InfoCircleOutlined style={{ color: colors.accent }} />
                      </Tooltip>
                    </Space>
                  }
                  bordered={false}
                >
                  <Table
                    columns={[
                      {
                        title: "Cliente",
                        dataIndex: "nombre_cliente",
                        key: "nombre_cliente",
                        render: (text) => <Text strong>{text}</Text>,
                      },
                      {
                        title: "Última compra",
                        dataIndex: "ultima_compra",
                        key: "ultima_compra",
                        align: "center",
                        render: () => {
                          // Generar fechas aleatorias recientes para demostración
                          const days = Math.floor(Math.random() * 60);
                          const date = new Date();
                          date.setDate(date.getDate() - days);
                          const formattedDate =
                            date.toLocaleDateString("es-ES");

                          let statusColor = colors.success;
                          if (days > 30) statusColor = colors.warning;
                          if (days > 45) statusColor = colors.danger;

                          return (
                            <Text style={{ color: statusColor }}>
                              {formattedDate}
                            </Text>
                          );
                        },
                      },
                      {
                        title: "Frecuencia",
                        dataIndex: "frecuencia",
                        key: "frecuencia",
                        align: "center",
                        render: () => {
                          const options = ["Alta", "Media", "Baja"];
                          const colorsUsed = [
                            colors.success,
                            colors.warning,
                            colors.danger,
                          ];
                          const index = Math.floor(Math.random() * 3);
                          return (
                            <Tag color={colorsUsed[index]}>
                              {options[index]}
                            </Tag>
                          );
                        },
                      },
                      {
                        title: "Fidelidad",
                        dataIndex: "fidelidad",
                        key: "fidelidad",
                        align: "center",
                        render: () => {
                          const score = Math.floor(Math.random() * 5) + 1;
                          return (
                            <div>
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  style={{
                                    color:
                                      i < score ? colors.warning : "#d9d9d9",
                                    fontSize: "16px",
                                  }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          );
                        },
                      },
                    ]}
                    dataSource={
                      clientesPorMonto
                        ? clientesPorMonto.map((item, index) => ({
                            ...item,
                            key: index,
                          }))
                        : []
                    }
                    pagination={{ pageSize: 5 }}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <Card
                  title={
                    <Space>
                      <WarningOutlined style={{ color: colors.danger }} />
                      <span>Clientes con pagos pendientes</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <div style={{ height: "400px" }}>
                    {clientesConPagosPendientes &&
                    clientesConPagosPendientes.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={clientesConPagosPendientes}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nombre_cliente" />
                          <YAxis />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="total_pendiente"
                            name="Monto Pendiente"
                            fill={colors.danger}
                          />
                          <Bar
                            dataKey="facturas_pendientes"
                            name="Facturas Pendientes"
                            fill={colors.warning}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="No hay datos disponibles" />
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <div>
            <Row gutter={[24, 24]} className="mb-6">
              <Col xs={24}>
                <Card
                  title={
                    <Space>
                      <UserOutlined style={{ color: colors.primary }} />
                      <span>Listado de Clientes</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <Table
                    columns={[
                      {
                        title: "Cliente",
                        dataIndex: "nombre_cliente",
                        key: "nombre_cliente",
                        render: (text) => (
                          <Space>
                            <UserOutlined style={{ color: colors.primary }} />
                            <Text strong>{text}</Text>
                          </Space>
                        ),
                        sorter: (a, b) =>
                          a.nombre_cliente.localeCompare(b.nombre_cliente),
                      },
                      {
                        title: "Total Compras",
                        dataIndex: "total_compras",
                        key: "total_compras",
                        align: "right",
                        render: (text) => (
                          <Text style={{ color: colors.success }}>
                            {formatCurrency(text)}
                          </Text>
                        ),
                        sorter: (a, b) =>
                          Number(a.total_compras || 0) -
                          Number(b.total_compras || 0),
                      },
                      {
                        title: "Facturas Pendientes",
                        dataIndex: "facturas_pendientes",
                        key: "facturas_pendientes",
                        align: "center",
                        render: (text) =>
                          text ? (
                            <Badge
                              count={text}
                              style={{ backgroundColor: colors.warning }}
                            />
                          ) : (
                            <Badge
                              count={0}
                              style={{ backgroundColor: colors.success }}
                            />
                          ),
                        sorter: (a, b) =>
                          Number(a.facturas_pendientes || 0) -
                          Number(b.facturas_pendientes || 0),
                      },
                      {
                        title: "Monto Pendiente",
                        dataIndex: "total_pendiente",
                        key: "total_pendiente",
                        align: "right",
                        render: (text) => (
                          <Text
                            style={{
                              color:
                                text && Number(text) > 0
                                  ? colors.danger
                                  : colors.success,
                            }}
                          >
                            {formatCurrency(text || 0)}
                          </Text>
                        ),
                        sorter: (a, b) =>
                          Number(a.total_pendiente || 0) -
                          Number(b.total_pendiente || 0),
                      },
                      {
                        title: "Estado",
                        key: "estado",
                        align: "center",
                        render: (_, record) => {
                          const pendiente = record.total_pendiente
                            ? Number(record.total_pendiente)
                            : 0;
                          if (pendiente > 0) {
                            return <Tag color="red">Con deuda</Tag>;
                          } else {
                            return <Tag color="green">Al día</Tag>;
                          }
                        },
                        filters: [
                          { text: "Con deuda", value: "con_deuda" },
                          { text: "Al día", value: "al_dia" },
                        ],
                        onFilter: (value, record) => {
                          const pendiente = record.total_pendiente
                            ? Number(record.total_pendiente)
                            : 0;
                          if (value === "con_deuda") return pendiente > 0;
                          if (value === "al_dia") return pendiente === 0;
                          return true;
                        },
                      },
                      {
                        title: "Acciones",
                        key: "acciones",
                        align: "center",
                        render: () => (
                          <Button
                            type="default"
                            size="small"
                            icon={<PhoneOutlined />}
                          >
                            Contactar
                          </Button>
                        ),
                      },
                    ]}
                    dataSource={clientesFiltrados.map((item, index) => ({
                      ...item,
                      key: index,
                    }))}
                    pagination={{ pageSize: 10 }}
                    summary={(pageData) => {
                      const totalCompras = pageData.reduce(
                        (sum, item) =>
                          sum +
                          (item.total_compras ? Number(item.total_compras) : 0),
                        0
                      );
                      const totalPendiente = pageData.reduce(
                        (sum, item) =>
                          sum +
                          (item.total_pendiente
                            ? Number(item.total_pendiente)
                            : 0),
                        0
                      );
                      const totalFacturasPendientes = pageData.reduce(
                        (sum, item) =>
                          sum +
                          (item.facturas_pendientes
                            ? Number(item.facturas_pendientes)
                            : 0),
                        0
                      );

                      return (
                        <Table.Summary.Row>
                          <Table.Summary.Cell>
                            <Text strong>Total</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="right">
                            <Text strong>{formatCurrency(totalCompras)}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="center">
                            <Text strong>{totalFacturasPendientes}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="right">
                            <Text strong>{formatCurrency(totalPendiente)}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell colSpan={2} />
                        </Table.Summary.Row>
                      );
                    }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <Card
                  title={
                    <Space>
                      <WarningOutlined style={{ color: colors.danger }} />
                      <span>Clientes con pagos pendientes</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <Alert
                    message="Atención: Clientes con pagos pendientes"
                    description="Los siguientes clientes tienen facturas pendientes de pago. Se recomienda gestionar el cobro lo antes posible."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <Table
                    columns={[
                      {
                        title: "Cliente",
                        dataIndex: "nombre_cliente",
                        key: "nombre_cliente",
                        render: (text) => <Text strong>{text}</Text>,
                      },
                      {
                        title: "Facturas Pendientes",
                        dataIndex: "facturas_pendientes",
                        key: "facturas_pendientes",
                        align: "center",
                        render: (text) => (
                          <Badge
                            count={text}
                            style={{ backgroundColor: colors.warning }}
                          />
                        ),
                      },
                      {
                        title: "Total Pendiente",
                        dataIndex: "total_pendiente",
                        key: "total_pendiente",
                        align: "right",
                        render: (text) => (
                          <Text style={{ color: colors.danger }}>
                            {formatCurrency(text)}
                          </Text>
                        ),
                      },
                    ]}
                    dataSource={clientesConPagosPendientes.map(
                      (item, index) => ({
                        ...item,
                        key: index,
                      })
                    )}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Title level={2} style={{ margin: 0, color: colors.primary }}>
              <BarChartOutlined style={{ marginRight: "12px" }} />
              Análisis de Clientes y Productos
            </Title>
            <Space wrap>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                }}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    message.success("Datos actualizados");
                  }, 1000);
                }}
              >
                Actualizar
              </Button>
            </Space>
          </div>

          <Segmented
            options={[
              {
                label: (
                  <Space>
                    <ShoppingOutlined />
                    Productos
                  </Space>
                ),
                value: "productos",
              },
              {
                label: (
                  <Space>
                    <UserOutlined />
                    Clientes
                  </Space>
                ),
                value: "clientes",
              },
            ]}
            value={activeSection}
            onChange={setActiveSection}
            style={{ marginBottom: "24px" }}
            block
            size="large"
          />

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
              <div style={{ marginTop: "16px" }}>Cargando datos...</div>
            </div>
          ) : activeSection === "productos" ? (
            renderProductos()
          ) : (
            renderClientes()
          )}
        </Card>
      </div>
    </div>
  );
};

export default EstadisticasClientesProductos;
