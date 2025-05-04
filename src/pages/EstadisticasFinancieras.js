"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Tabs,
  DatePicker,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Select,
  Space,
  Badge,
  Segmented,
  Spin,
  Radio,
  Progress,
  Dropdown,
  message,
} from "antd";
import {
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  BankOutlined,
  CreditCardOutlined,
  TeamOutlined,
  ShopOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ShoppingOutlined,
  WalletOutlined,
  ThunderboltOutlined,
  HomeOutlined,
  CarOutlined,
  GlobalOutlined,
  TableOutlined,
  ClockCircleOutlined,
  DropboxOutlined, // Reemplazamos WaterOutlined con DropboxOutlined para representar agua
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import {
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

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

const EstadisticasFinancieras = () => {
  // Estados para datos
  const [activeTab, setActiveTab] = useState("general");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mes");
  const [loading, setLoading] = useState(true);
  const [vistaIngresos, setVistaIngresos] = useState("graficos");
  const [vistaEgresos, setVistaEgresos] = useState("graficos");

  // Estados para datos de la API
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [egresosTotales, setEgresosTotales] = useState(0);
  const [ingresosPorDia, setIngresosPorDia] = useState([]);
  const [ingresosPorMes, setIngresosPorMes] = useState([]);
  const [ingresosPorMetodoPago, setIngresosPorMetodoPago] = useState([]);
  const [ventasPorSede, setVentasPorSede] = useState([]);
  const [ventasPorSedePorMes, setVentasPorSedePorMes] = useState([]);
  const [ventasPorSedePorDia, setVentasPorSedePorDia] = useState([]);
  const [clientesConPagosPendientes, setClientesConPagosPendientes] = useState(
    []
  );
  const [topClientesPorMonto, setTopClientesPorMonto] = useState([]);
  const [pagosProveedoresTotales, setPagosProveedoresTotales] = useState(0);
  const [pagosProveedoresPorMes, setPagosProveedoresPorMes] = useState([]);
  const [nominaPorSedeYRol, setNominaPorSedeYRol] = useState([]);
  // Add a new state variable for abonos after the other state variables
  const [abonos, setAbonos] = useState([]);

  // Cargar datos
  useEffect(() => {
    // Modify the useEffect to fetch abonos data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar datos de ingresos
        const [
          ingresosTotalesRes,
          ingresosPorDiaRes,
          ingresosPorMesRes,
          ingresosPorMetodoPagoRes,
          ventasPorSedeRes,
          ventasPorSedePorMesRes,
          ventasPorSedePorDiaRes, // Agregar esta línea
          clientesConPagosPendientesRes,
          topClientesPorMontoRes,
          pagosProveedoresTotalesRes,
          pagosProveedoresPorMesRes,
          nominaPorSedeYRolRes,
          abonosRes, // Add this line
        ] = await Promise.all([
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/ingresos/total"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/ingresos/dia"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/ingresos/mes"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/ingresos/metodo-pago"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/ingresos/sede"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/ingresos/sedemes"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/ingresos/sededia"
          ), // Agregar esta línea
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/clientes-pagos-pendientes"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/top-clientes/monto"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/pagos-proveedores/totales"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/pagos-proveedores/por-mes"
          ),
          axios.get(
            "https://cimove-backend.onrender.com/api/estadisticas/nomina/por-sede-rol"
          ),
          axios.get("https://cimove-backend.onrender.com/api/abonos"), // Add this line
        ]);

        // Establecer datos
        setIngresosTotales(ingresosTotalesRes.data.total_facturado);
        setIngresosPorDia(ingresosPorDiaRes.data);
        setIngresosPorMes(ingresosPorMesRes.data);
        setIngresosPorMetodoPago(ingresosPorMetodoPagoRes.data);
        setVentasPorSede(ventasPorSedeRes.data);
        setVentasPorSedePorMes(ventasPorSedePorMesRes.data);
        setVentasPorSedePorDia(ventasPorSedePorDiaRes.data);
        setClientesConPagosPendientes(clientesConPagosPendientesRes.data);
        setTopClientesPorMonto(topClientesPorMontoRes.data);
        setPagosProveedoresTotales(
          pagosProveedoresTotalesRes.data.total_pagado_proveedores
        );
        setPagosProveedoresPorMes(pagosProveedoresPorMesRes.data);
        setAbonos(abonosRes.data); // Add this line

        // Transformar datos de nómina
        const nominaData = nominaPorSedeYRolRes.data.map((item) => ({
          sede: item[0],
          rol: item[1],
          monto: item[2],
        }));
        setNominaPorSedeYRol(nominaData);

        // Calcular egresos totales (pagos a proveedores + nómina)
        const totalNomina = nominaData.reduce(
          (sum, item) => sum + (Number.parseFloat(item.monto) || 0),
          0
        );
        const totalProveedores = Number.parseFloat(
          pagosProveedoresTotalesRes.data.total_pagado_proveedores || 0
        );
        console.log("Cálculo de egresos:", { totalNomina, totalProveedores });
        setEgresosTotales(totalProveedores + totalNomina);

        console.log("Datos recibidos:", {
          ingresosTotales,
          pagosProveedoresTotales,
          nominaData: nominaPorSedeYRol,
          egresosTotales,
        });
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
    if (value == null || isNaN(value)) return "$ 0";

    // Convertir a número si es string
    const numValue =
      typeof value === "string" ? Number.parseFloat(value) : value;

    // Verificar nuevamente si es un número válido
    if (isNaN(numValue)) return "$ 0";

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

  // Preparar datos para gráficos
  const prepararDatosIngresosPorDia = () => {
    return ingresosPorDia
      .map((item) => ({
        fecha: dayjs(item.fecha).format("DD/MM"),
        total: Number(item.total),
      }))
      .reverse();
  };

  const prepararDatosIngresosPorMes = () => {
    return ingresosPorMes
      .map((item) => ({
        mes: dayjs(item.mes).format("MMM YYYY"),
        total: Number(item.total),
      }))
      .reverse();
  };

  const prepararDatosIngresosPorMetodoPago = () => {
    return ingresosPorMetodoPago.map((item) => ({
      name: item.metodo,
      value: Number(item.total),
    }));
  };

  const prepararDatosVentasPorSede = () => {
    return ventasPorSede.map((item) => ({
      name: item.nombre_sede,
      value: Number(item.total_ventas),
    }));
  };

  const prepararDatosVentasPorSedePorMes = () => {
    // Agrupar por mes
    const mesesUnicos = [
      ...new Set(ventasPorSedePorMes.map((item) => item.mes)),
    ];

    return mesesUnicos.map((mes) => {
      const datosMes = ventasPorSedePorMes.filter((item) => item.mes === mes);
      const resultado = { mes: dayjs(mes).format("MMM YYYY") };

      datosMes.forEach((item) => {
        resultado[item.nombre_sede] = Number(item.total_ventas);
      });

      return resultado;
    });
  };

  const prepararDatosVentasPorSedePorDia = () => {
    // Agrupar por día
    const diasUnicos = [
      ...new Set(ventasPorSedePorDia.map((item) => item.dia)),
    ];

    return diasUnicos
      .map((dia) => {
        const datosDia = ventasPorSedePorDia.filter((item) => item.dia === dia);
        const resultado = {
          dia: dayjs(dia).format("DD/MM"),
          fecha_completa: dayjs(dia).format("DD/MM/YYYY"),
        };

        datosDia.forEach((item) => {
          resultado[item.nombre_sede] = Number(item.total_ventas);
        });

        return resultado;
      })
      .sort((a, b) =>
        dayjs(b.fecha_completa, "DD/MM/YYYY").diff(
          dayjs(a.fecha_completa, "DD/MM/YYYY")
        )
      );
  };

  const prepararDatosPagosProveedoresPorMes = () => {
    return pagosProveedoresPorMes
      .map((item) => ({
        mes: dayjs(item.mes).format("MMM YYYY"),
        total: Number(item.total),
      }))
      .reverse();
  };

  const prepararDatosNominaPorSede = () => {
    // Agrupar por sede
    const sedesUnicas = [
      ...new Set(nominaPorSedeYRol.map((item) => item.sede)),
    ];

    return sedesUnicas.map((sede) => {
      const datosSede = nominaPorSedeYRol.filter((item) => item.sede === sede);
      const totalSede = datosSede.reduce((sum, item) => sum + item.monto, 0);

      return {
        name: sede,
        value: totalSede,
      };
    });
  };

  const prepararDatosNominaPorRol = () => {
    // Agrupar por rol
    const rolesUnicos = [...new Set(nominaPorSedeYRol.map((item) => item.rol))];

    return rolesUnicos.map((rol) => {
      const datosRol = nominaPorSedeYRol.filter((item) => item.rol === rol);
      const totalRol = datosRol.reduce((sum, item) => sum + item.monto, 0);

      return {
        name: rol,
        value: totalRol,
      };
    });
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
          <p style={{ margin: 0, fontWeight: "bold" }}>{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ margin: 0, color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Columnas para tablas
  const columnasClientesPendientes = [
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
    },
    {
      title: "Facturas Pendientes",
      dataIndex: "facturas_pendientes",
      key: "facturas_pendientes",
      align: "center",
      render: (text) => (
        <Badge count={text} style={{ backgroundColor: colors.warning }} />
      ),
    },
    {
      title: "Total Pendiente",
      dataIndex: "total_pendiente",
      key: "total_pendiente",
      align: "right",
      render: (text) => (
        <Text style={{ color: colors.danger }}>{formatCurrency(text)}</Text>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          style={{
            backgroundColor: colors.secondary,
            borderColor: colors.secondary,
          }}
        >
          Gestionar Cobro
        </Button>
      ),
    },
  ];

  const columnasMetodosPago = [
    {
      title: "Método de Pago",
      dataIndex: "metodo",
      key: "metodo",
      render: (text) => {
        let icon = <CreditCardOutlined />;
        if (text === "Efectivo") icon = <DollarOutlined />;
        else if (text === "Nequi" || text === "Daviplata")
          icon = <WalletOutlined />;
        else if (text === "Transferencia") icon = <BankOutlined />;

        return (
          <Space>
            {icon}
            <Text>{text}</Text>
          </Space>
        );
      },
    },
    {
      title: "Monto Total",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (text) => <Text strong>{formatCurrency(text)}</Text>,
    },
    {
      title: "Comisión Estimada",
      key: "comision",
      align: "right",
      render: (_, record) => {
        let comision = 0;
        if (record.metodo === "Nequi") comision = Number(record.total) * 0.01;
        else if (record.metodo === "Daviplata")
          comision = Number(record.total) * 0.005;
        else if (record.metodo === "Tarjeta")
          comision = Number(record.total) * 0.03;

        return <Text type="secondary">{formatCurrency(comision)}</Text>;
      },
    },
    {
      title: "Total Neto",
      key: "neto",
      align: "right",
      render: (_, record) => {
        let comision = 0;
        if (record.metodo === "Nequi") comision = Number(record.total) * 0.01;
        else if (record.metodo === "Daviplata")
          comision = Number(record.total) * 0.005;
        else if (record.metodo === "Tarjeta")
          comision = Number(record.total) * 0.03;

        const neto = Number(record.total) - comision;
        return (
          <Text style={{ color: colors.success }}>{formatCurrency(neto)}</Text>
        );
      },
    },
  ];

  const columnasNomina = [
    {
      title: "Sede",
      dataIndex: "sede",
      key: "sede",
      render: (text) => (
        <Space>
          <ShopOutlined style={{ color: colors.primary }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Rol",
      dataIndex: "rol",
      key: "rol",
      render: (text) => (
        <Tag
          color={text === "Administrador" ? colors.primary : colors.secondary}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Salario",
      dataIndex: "monto",
      key: "monto",
      align: "right",
      render: (text) => <Text strong>{formatCurrency(text)}</Text>,
    },
  ];

  // Renderizar componentes según la pestaña activa
  const renderContenidoGeneral = () => (
    <div>
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} md={8}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={
                <Text style={{ fontSize: "16px", color: colors.text }}>
                  <ArrowUpOutlined
                    style={{ color: colors.success, marginRight: "8px" }}
                  />
                  Total de Ingresos
                </Text>
              }
              value={ingresosTotales}
              precision={0}
              valueStyle={{ color: colors.success, fontSize: "28px" }}
              prefix="$"
              formatter={(value) =>
                new Intl.NumberFormat("es-CO").format(value)
              }
            />
            <div className="mt-4">
              <Progress
                percent={100}
                strokeColor={colors.success}
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={
                <Text style={{ fontSize: "16px", color: colors.text }}>
                  <ArrowDownOutlined
                    style={{ color: colors.danger, marginRight: "8px" }}
                  />
                  Total de Egresos
                </Text>
              }
              value={egresosTotales}
              precision={0}
              valueStyle={{ color: colors.danger, fontSize: "28px" }}
              prefix="$"
              formatter={(value) =>
                new Intl.NumberFormat("es-CO").format(value)
              }
            />
            <div className="mt-4">
              <Progress
                percent={100}
                strokeColor={colors.danger}
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={
                <Text style={{ fontSize: "16px", color: colors.text }}>
                  <DollarOutlined
                    style={{ color: colors.primary, marginRight: "8px" }}
                  />
                  Ganancia Neta
                </Text>
              }
              value={ingresosTotales - egresosTotales}
              precision={0}
              valueStyle={{
                color:
                  ingresosTotales - egresosTotales >= 0
                    ? colors.primary
                    : colors.danger,
                fontSize: "28px",
              }}
              prefix="$"
              formatter={(value) =>
                new Intl.NumberFormat("es-CO").format(value)
              }
            />
            <div className="mt-4">
              <Progress
                percent={(ingresosTotales / (egresosTotales || 1)) * 50}
                strokeColor={
                  ingresosTotales - egresosTotales >= 0
                    ? colors.primary
                    : colors.danger
                }
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="mb-6">
        <Title
          level={4}
          style={{ color: colors.primary, marginBottom: "20px" }}
        >
          <LineChartOutlined style={{ marginRight: "10px" }} />
          Evolución Financiera
        </Title>
        <div style={{ height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={prepararDatosIngresosPorMes()}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="total"
                name="Ingresos"
                fill={colors.success}
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Tendencia"
                stroke={colors.primary}
                strokeWidth={2}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card bordered={false} className="h-full">
            <Title
              level={4}
              style={{ color: colors.primary, marginBottom: "20px" }}
            >
              <PieChartOutlined style={{ marginRight: "10px" }} />
              Distribución de Ingresos por Sede
            </Title>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepararDatosVentasPorSede()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {prepararDatosVentasPorSede().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} className="h-full">
            <Title
              level={4}
              style={{ color: colors.primary, marginBottom: "20px" }}
            >
              <PieChartOutlined style={{ marginRight: "10px" }} />
              Distribución por Método de Pago
            </Title>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepararDatosIngresosPorMetodoPago()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {prepararDatosIngresosPorMetodoPago().map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      )
                    )}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderContenidoIngresos = () => (
    <div>
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
          value={vistaIngresos}
          onChange={setVistaIngresos}
          style={{ marginBottom: "20px" }}
        />
      </div>

      {vistaIngresos === "graficos" ? (
        <>
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <LineChartOutlined style={{ marginRight: "10px" }} />
                  Evolución de Ingresos
                </Title>
                <Radio.Group
                  value={periodoSeleccionado}
                  onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                  style={{ marginBottom: "20px" }}
                >
                  <Radio.Button value="dia">Por Día</Radio.Button>
                  <Radio.Button value="mes">Por Mes</Radio.Button>
                </Radio.Group>
                <div style={{ height: "400px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={
                        periodoSeleccionado === "dia"
                          ? prepararDatosIngresosPorDia()
                          : prepararDatosIngresosPorMes()
                      }
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey={
                          periodoSeleccionado === "dia" ? "fecha" : "mes"
                        }
                      />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="Ingresos"
                        stroke={colors.success}
                        fill={`${colors.success}40`}
                        activeDot={{ r: 8 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} md={12}>
              <Card bordered={false} className="h-full">
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <PieChartOutlined style={{ marginRight: "10px" }} />
                  Distribución por Método de Pago
                </Title>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepararDatosIngresosPorMetodoPago()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {prepararDatosIngresosPorMetodoPago().map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={chartColors[index % chartColors.length]}
                            />
                          )
                        )}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card bordered={false} className="h-full">
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <BarChartOutlined style={{ marginRight: "10px" }} />
                  Ventas por Sede
                </Title>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepararDatosVentasPorSede()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <RechartsTooltip
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Bar
                        dataKey="value"
                        name="Ventas"
                        fill={colors.primary}
                        radius={[0, 4, 4, 0]}
                      >
                        {prepararDatosVentasPorSede().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <LineChartOutlined style={{ marginRight: "10px" }} />
                  Ventas por Sede y Mes
                </Title>
                <div style={{ height: "400px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepararDatosVentasPorSedePorMes()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      {ventasPorSede.map((sede, index) => (
                        <Bar
                          key={sede.nombre_sede}
                          dataKey={sede.nombre_sede}
                          name={sede.nombre_sede}
                          fill={chartColors[index % chartColors.length]}
                          stackId="a"
                          radius={[0, 0, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <LineChartOutlined style={{ marginRight: "10px" }} />
                  Ventas Diarias por Sede
                </Title>
                <div style={{ height: "400px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepararDatosVentasPorSedePorDia()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      {ventasPorSede.map((sede, index) => (
                        <Bar
                          key={sede.nombre_sede}
                          dataKey={sede.nombre_sede}
                          name={sede.nombre_sede}
                          fill={chartColors[index % chartColors.length]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <CreditCardOutlined style={{ marginRight: "10px" }} />
                  Ingresos por Método de Pago
                </Title>
                <Table
                  columns={columnasMetodosPago}
                  dataSource={ingresosPorMetodoPago.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={false}
                  summary={(pageData) => {
                    const totalIngresos = pageData.reduce(
                      (total, item) => total + Number(item.total),
                      0
                    );

                    const totalComisiones = pageData.reduce((total, item) => {
                      let comision = 0;
                      if (item.metodo === "Nequi")
                        comision = Number(item.total) * 0.01;
                      else if (item.metodo === "Daviplata")
                        comision = Number(item.total) * 0.005;
                      else if (item.metodo === "Tarjeta")
                        comision = Number(item.total) * 0.03;
                      return total + comision;
                    }, 0);

                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text strong>Total</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong>{formatCurrency(totalIngresos)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong>{formatCurrency(totalComisiones)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong style={{ color: colors.success }}>
                            {formatCurrency(totalIngresos - totalComisiones)}
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <ShopOutlined style={{ marginRight: "10px" }} />
                  Ventas por Sede
                </Title>
                <Table
                  columns={[
                    {
                      title: "Sede",
                      dataIndex: "nombre_sede",
                      key: "nombre_sede",
                      render: (text) => (
                        <Space>
                          <ShopOutlined style={{ color: colors.primary }} />
                          <Text>{text}</Text>
                        </Space>
                      ),
                    },
                    {
                      title: "Total Ventas",
                      dataIndex: "total_ventas",
                      key: "total_ventas",
                      align: "right",
                      render: (text) => (
                        <Text strong>{formatCurrency(text)}</Text>
                      ),
                    },
                    {
                      title: "Porcentaje",
                      key: "porcentaje",
                      align: "right",
                      render: (_, record) => {
                        const totalVentas = ventasPorSede.reduce(
                          (sum, item) => sum + Number(item.total_ventas),
                          0
                        );
                        const porcentaje =
                          (Number(record.total_ventas) / totalVentas) * 100;
                        return (
                          <Space>
                            <Text>{porcentaje.toFixed(1)}%</Text>
                            <Progress
                              percent={porcentaje}
                              size="small"
                              showInfo={false}
                              strokeColor={colors.primary}
                              style={{ width: 100 }}
                            />
                          </Space>
                        );
                      },
                    },
                  ]}
                  dataSource={ventasPorSede.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={false}
                  summary={(pageData) => {
                    const totalVentas = pageData.reduce(
                      (total, item) => total + Number(item.total_ventas),
                      0
                    );

                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text strong>Total</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong>{formatCurrency(totalVentas)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong>100%</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <CalendarOutlined style={{ marginRight: "10px" }} />
                  Ventas Diarias por Sede
                </Title>
                <Table
                  columns={[
                    {
                      title: "Fecha",
                      dataIndex: "fecha_completa",
                      key: "fecha_completa",
                      render: (text) => (
                        <Space>
                          <CalendarOutlined style={{ color: colors.primary }} />
                          <Text>{text}</Text>
                        </Space>
                      ),
                    },
                    ...ventasPorSede.map((sede) => ({
                      title: sede.nombre_sede,
                      dataIndex: sede.nombre_sede,
                      key: sede.nombre_sede,
                      align: "right",
                      render: (text) => (
                        <Text>{formatCurrency(text || 0)}</Text>
                      ),
                    })),
                    {
                      title: "Total del Día",
                      key: "total_dia",
                      align: "right",
                      render: (_, record) => {
                        const totalDia = ventasPorSede.reduce(
                          (sum, sede) => sum + (record[sede.nombre_sede] || 0),
                          0
                        );
                        return <Text strong>{formatCurrency(totalDia)}</Text>;
                      },
                    },
                  ]}
                  dataSource={prepararDatosVentasPorSedePorDia().map(
                    (item, index) => ({
                      ...item,
                      key: index,
                    })
                  )}
                  pagination={{ pageSize: 7 }}
                  summary={(pageData) => {
                    const totalPorSede = {};
                    ventasPorSede.forEach((sede) => {
                      totalPorSede[sede.nombre_sede] = pageData.reduce(
                        (sum, item) => sum + (item[sede.nombre_sede] || 0),
                        0
                      );
                    });

                    const granTotal = Object.values(totalPorSede).reduce(
                      (sum, value) => sum + value,
                      0
                    );

                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text strong>Total</Text>
                        </Table.Summary.Cell>
                        {ventasPorSede.map((sede) => (
                          <Table.Summary.Cell
                            key={sede.nombre_sede}
                            align="right"
                          >
                            <Text strong>
                              {formatCurrency(totalPorSede[sede.nombre_sede])}
                            </Text>
                          </Table.Summary.Cell>
                        ))}
                        <Table.Summary.Cell align="right">
                          <Text strong style={{ color: colors.success }}>
                            {formatCurrency(granTotal)}
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.danger, marginBottom: "20px" }}
                >
                  <WarningOutlined style={{ marginRight: "10px" }} />
                  Clientes con Pagos Pendientes
                </Title>
                <Table
                  columns={columnasClientesPendientes}
                  dataSource={clientesConPagosPendientes.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={{ pageSize: 5 }}
                  summary={(pageData) => {
                    const totalPendiente = clientesConPagosPendientes.reduce(
                      (total, item) => total + Number(item.total_pendiente),
                      0
                    );

                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text strong>Total</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="center">
                          <Badge
                            count={clientesConPagosPendientes.reduce(
                              (total, item) =>
                                total + Number(item.facturas_pendientes),
                              0
                            )}
                            style={{ backgroundColor: colors.warning }}
                          />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong style={{ color: colors.danger }}>
                            {formatCurrency(totalPendiente)}
                          </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell />
                      </Table.Summary.Row>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );

  // Add a new section to the renderContenidoEgresos function after the Gastos Fijos section
  const renderContenidoEgresos = () => (
    <div>
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
          value={vistaEgresos}
          onChange={setVistaEgresos}
          style={{ marginBottom: "20px" }}
        />
      </div>

      {vistaEgresos === "graficos" ? (
        <>
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <LineChartOutlined style={{ marginRight: "10px" }} />
                  Evolución de Pagos a Proveedores
                </Title>
                <div style={{ height: "400px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={prepararDatosPagosProveedoresPorMes()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="Pagos"
                        stroke={colors.danger}
                        fill={`${colors.danger}40`}
                        activeDot={{ r: 8 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} md={12}>
              <Card bordered={false} className="h-full">
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <PieChartOutlined style={{ marginRight: "10px" }} />
                  Distribución de Nómina por Sede
                </Title>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepararDatosNominaPorSede()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {prepararDatosNominaPorSede().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card bordered={false} className="h-full">
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <PieChartOutlined style={{ marginRight: "10px" }} />
                  Distribución de Nómina por Rol
                </Title>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepararDatosNominaPorRol()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {prepararDatosNominaPorRol().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <BarChartOutlined style={{ marginRight: "10px" }} />
                  Distribución de Egresos
                </Title>
                <div style={{ height: "400px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Pagos a Proveedores",
                          value: pagosProveedoresTotales,
                          color: colors.danger,
                        },
                        {
                          name: "Nómina",
                          value: nominaPorSedeYRol.reduce(
                            (sum, item) => sum + item.monto,
                            0
                          ),
                          color: colors.warning,
                        },
                        {
                          name: "Servicios",
                          value: 1200000, // Valor de ejemplo
                          color: colors.accent,
                        },
                        {
                          name: "Otros Gastos",
                          value: 800000, // Valor de ejemplo
                          color: colors.secondary,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <RechartsTooltip
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Bar dataKey="value" name="Monto" radius={[0, 4, 4, 0]}>
                        {[0, 1, 2, 3].map((index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <TeamOutlined style={{ marginRight: "10px" }} />
                  Nómina por Sede y Rol
                </Title>
                <Table
                  columns={columnasNomina}
                  dataSource={nominaPorSedeYRol.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={false}
                  summary={(pageData) => {
                    const totalNomina = pageData.reduce(
                      (total, item) => total + item.monto,
                      0
                    );

                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={2}>
                          <Text strong>Total Nómina</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong>{formatCurrency(totalNomina)}</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <ShoppingOutlined style={{ marginRight: "10px" }} />
                  Pagos a Proveedores por Mes
                </Title>
                <Table
                  columns={[
                    {
                      title: "Mes",
                      dataIndex: "mes",
                      key: "mes",
                      render: (text) => (
                        <Space>
                          <CalendarOutlined style={{ color: colors.primary }} />
                          <Text>{text}</Text>
                        </Space>
                      ),
                    },
                    {
                      title: "Total Pagado",
                      dataIndex: "total",
                      key: "total",
                      align: "right",
                      render: (text) => (
                        <Text strong>{formatCurrency(text)}</Text>
                      ),
                    },
                    {
                      title: "Porcentaje",
                      key: "porcentaje",
                      align: "right",
                      render: (_, record) => {
                        const totalPagos = pagosProveedoresPorMes.reduce(
                          (sum, item) => sum + Number(item.total),
                          0
                        );
                        const porcentaje =
                          (Number(record.total) / totalPagos) * 100;
                        return (
                          <Space>
                            <Text>{porcentaje.toFixed(1)}%</Text>
                            <Progress
                              percent={porcentaje}
                              size="small"
                              showInfo={false}
                              strokeColor={colors.danger}
                              style={{ width: 100 }}
                            />
                          </Space>
                        );
                      },
                    },
                  ]}
                  dataSource={prepararDatosPagosProveedoresPorMes().map(
                    (item, index) => ({
                      ...item,
                      key: index,
                    })
                  )}
                  pagination={false}
                  summary={(pageData) => {
                    const totalPagos = pageData.reduce(
                      (total, item) => total + Number(item.total),
                      0
                    );

                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text strong>Total</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong>{formatCurrency(totalPagos)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong>100%</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <HomeOutlined style={{ marginRight: "10px" }} />
                  Gastos Fijos
                </Title>
                <Table
                  columns={[
                    {
                      title: "Servicio",
                      dataIndex: "servicio",
                      key: "servicio",
                      render: (text) => {
                        let icon = <GlobalOutlined />;
                        if (text === "Luz") icon = <ThunderboltOutlined />;
                        else if (text === "Agua") icon = <DropboxOutlined />;
                        // Cambiamos a DropboxOutlined para agua
                        else if (text === "Arriendo") icon = <HomeOutlined />;
                        else if (text === "Transporte") icon = <CarOutlined />;

                        return (
                          <Space>
                            {icon}
                            <Text>{text}</Text>
                          </Space>
                        );
                      },
                    },
                    {
                      title: "Monto Mensual",
                      dataIndex: "monto",
                      key: "monto",
                      align: "right",
                      render: (text) => (
                        <Text strong>{formatCurrency(text)}</Text>
                      ),
                    },
                    {
                      title: "Último Pago",
                      dataIndex: "fecha",
                      key: "fecha",
                      render: (text) => (
                        <Text>{dayjs(text).format("DD/MM/YYYY")}</Text>
                      ),
                    },
                    {
                      title: "Estado",
                      dataIndex: "estado",
                      key: "estado",
                      align: "center",
                      render: (text) => (
                        <Tag
                          color={
                            text === "Pagado" ? colors.success : colors.warning
                          }
                          style={{ borderRadius: "12px", padding: "2px 10px" }}
                        >
                          {text === "Pagado" ? (
                            <CheckCircleOutlined />
                          ) : (
                            <ClockCircleOutlined />
                          )}{" "}
                          {text}
                        </Tag>
                      ),
                    },
                  ]}
                  dataSource={[
                    {
                      key: "1",
                      servicio: "Luz",
                      monto: 450000,
                      fecha: "2025-05-10",
                      estado: "Pagado",
                    },
                    {
                      key: "2",
                      servicio: "Agua",
                      monto: 280000,
                      fecha: "2025-05-15",
                      estado: "Pagado",
                    },
                    {
                      key: "3",
                      servicio: "Internet",
                      monto: 180000,
                      fecha: "2025-05-05",
                      estado: "Pagado",
                    },
                    {
                      key: "4",
                      servicio: "Arriendo",
                      monto: 2500000,
                      fecha: "2025-05-01",
                      estado: "Pagado",
                    },
                    {
                      key: "5",
                      servicio: "Transporte",
                      monto: 800000,
                      fecha: "2025-05-20",
                      estado: "Pendiente",
                    },
                  ]}
                  pagination={false}
                  summary={(pageData) => {
                    const totalGastosFijos = pageData.reduce(
                      (total, item) => total + item.monto,
                      0
                    );

                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text strong>Total Gastos Fijos</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong>{formatCurrency(totalGastosFijos)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell colSpan={2} />
                      </Table.Summary.Row>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* Add the new Abonos section here */}
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card bordered={false}>
                <Title
                  level={4}
                  style={{ color: colors.primary, marginBottom: "20px" }}
                >
                  <CreditCardOutlined style={{ marginRight: "10px" }} />
                  Abonos a Facturas de Proveedores
                </Title>
                <Table
                  columns={[
                    {
                      title: "ID",
                      dataIndex: "id_abonofactura",
                      key: "id_abonofactura",
                      width: 80,
                      render: (text) => <Text strong>#{text}</Text>,
                    },
                    {
                      title: "Factura Proveedor",
                      dataIndex: "id_facturaproveedor_abonofactura",
                      key: "id_facturaproveedor_abonofactura",
                      render: (text) => (
                        <Space>
                          <FileTextOutlined style={{ color: colors.primary }} />
                          <Text>#{text}</Text>
                        </Space>
                      ),
                    },
                    {
                      title: "Fecha",
                      dataIndex: "fecha_abonofactura",
                      key: "fecha_abonofactura",
                      render: (text) => (
                        <Space>
                          <CalendarOutlined style={{ color: colors.primary }} />
                          <Text>{dayjs(text).format("DD/MM/YYYY")}</Text>
                        </Space>
                      ),
                    },
                    {
                      title: "Monto",
                      dataIndex: "monto_abonofactura",
                      key: "monto_abonofactura",
                      align: "right",
                      render: (text) => (
                        <Text strong>{formatCurrency(text)}</Text>
                      ),
                    },
                    {
                      title: "Estado",
                      dataIndex: "estado_abonofactura",
                      key: "estado_abonofactura",
                      align: "center",
                      render: (text) => (
                        <Tag
                          color={text === "A" ? colors.success : colors.warning}
                        >
                          {text === "A" ? "Activo" : "Inactivo"}
                        </Tag>
                      ),
                    },
                  ]}
                  dataSource={abonos.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={{ pageSize: 5 }}
                  summary={(pageData) => {
                    const totalAbonos = abonos.reduce(
                      (total, item) => total + Number(item.monto_abonofactura),
                      0
                    );

                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={3}>
                          <Text strong>Total Abonos</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Text strong>{formatCurrency(totalAbonos)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell />
                      </Table.Summary.Row>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );

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
              Estadísticas Financieras
            </Title>
            <Space wrap>
              <Select
                defaultValue="30"
                style={{ width: 180 }}
                onChange={(value) => {
                  const dias = Number.parseInt(value);
                  setDateRange([dayjs().subtract(dias, "day"), dayjs()]);
                }}
              >
                <Option value="7">Últimos 7 días</Option>
                <Option value="30">Últimos 30 días</Option>
                <Option value="90">Últimos 3 meses</Option>
                <Option value="180">Últimos 6 meses</Option>
                <Option value="365">Último año</Option>
              </Select>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                }}
                onClick={() => {
                  // Función para recargar datos con el rango de fechas seleccionado
                  // Aquí podrías llamar a fetchData nuevamente con los parámetros de fecha
                  message.success("Datos actualizados");
                }}
              >
                Actualizar
              </Button>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: "Exportar a Excel",
                      icon: <FileExcelOutlined />,
                      onClick: () => message.info("Exportando a Excel..."),
                    },
                    {
                      key: "2",
                      label: "Exportar a PDF",
                      icon: <FilePdfOutlined />,
                      onClick: () => message.info("Exportando a PDF..."),
                    },
                  ],
                }}
              >
                <Button icon={<DownloadOutlined />}>
                  Exportar <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            style={{ marginBottom: "24px" }}
            tabBarStyle={{ marginBottom: "16px" }}
          >
            <TabPane
              tab={
                <span>
                  <DollarOutlined /> Vista General
                </span>
              }
              key="general"
            >
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Spin size="large" />
                  <div style={{ marginTop: "16px" }}>
                    Cargando datos financieros...
                  </div>
                </div>
              ) : (
                renderContenidoGeneral()
              )}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ArrowUpOutlined style={{ color: colors.success }} /> Ingresos
                </span>
              }
              key="ingresos"
            >
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Spin size="large" />
                  <div style={{ marginTop: "16px" }}>
                    Cargando datos de ingresos...
                  </div>
                </div>
              ) : (
                renderContenidoIngresos()
              )}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ArrowDownOutlined style={{ color: colors.danger }} /> Egresos
                </span>
              }
              key="egresos"
            >
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Spin size="large" />
                  <div style={{ marginTop: "16px" }}>
                    Cargando datos de egresos...
                  </div>
                </div>
              ) : (
                renderContenidoEgresos()
              )}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default EstadisticasFinancieras;
