"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Input,
  Tooltip,
  Divider,
  Row,
  Col,
  Statistic,
  message,
  Tabs,
  List,
  Badge,
  Popover,
  Modal,
  Descriptions, // Import Descriptions from Ant Design
} from "antd";
import {
  FileTextOutlined,
  DollarOutlined,
  EyeOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  PlusOutlined,
  FilterOutlined,
  ReloadOutlined,
  TeamOutlined,
  CalendarOutlined,
  SearchOutlined,
  BellOutlined,
  ShoppingOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

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

const FacturacionProveedor = () => {
  const [activeTab, setActiveTab] = useState("facturas");
  const [facturas, setFacturas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [fechaRango, setFechaRango] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrdenes, setLoadingOrdenes] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50"],
      showTotal: (total) => `Total: ${total} registros`,
    },
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchFacturas();
    fetchOrdenes();
    fetchProveedores();
  }, []);

  // Obtener facturas
  const fetchFacturas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:4000/api/facturas-proveedor"
      );
      setFacturas(res.data);
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
      message.error("Error al cargar las facturas");
    } finally {
      setLoading(false);
    }
  };

  // Obtener órdenes
  const fetchOrdenes = async () => {
    setLoadingOrdenes(true);
    try {
      const res = await axios.get("http://localhost:4000/api/ordenes");
      setOrdenes(res.data);
    } catch (error) {
      console.error("Error al obtener órdenes de compra:", error);
      message.error("Error al cargar las órdenes de compra");
    } finally {
      setLoadingOrdenes(false);
    }
  };

  // Obtener proveedores
  const fetchProveedores = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/proveedores/all");
      setProveedores(res.data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      message.error("Error al cargar los proveedores");
    }
  };

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

  // Filtrar facturas
  const filtrarFacturas = () => {
    return facturas.filter((f) => {
      // Filtro por proveedor
      if (filtroProveedor && f.nombre_proveedor !== filtroProveedor) {
        return false;
      }

      // Filtro por estado
      if (
        filtroEstado &&
        f.estado_facturaproveedor?.toLowerCase() !== filtroEstado
      ) {
        return false;
      }

      // Filtro por rango de fechas
      if (fechaRango && fechaRango[0] && fechaRango[1]) {
        const fechaFactura = dayjs(f.fecha_facturaproveedor);
        if (
          !fechaFactura.isAfter(fechaRango[0].startOf("day")) ||
          !fechaFactura.isBefore(fechaRango[1].endOf("day"))
        ) {
          return false;
        }
      }

      // Filtro por texto de búsqueda
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return (
          f.id_facturaproveedor?.toString().includes(searchLower) ||
          f.nombre_proveedor?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  // Filtrar órdenes
  const filtrarOrdenes = () => {
    return ordenes.filter((o) => {
      // Filtro por proveedor
      if (filtroProveedor && o.nombre_proveedor !== filtroProveedor) {
        return false;
      }

      // Filtro por rango de fechas
      if (fechaRango && fechaRango[0] && fechaRango[1]) {
        const fechaOrden = dayjs(o.fecha_ordencompra);
        if (
          !fechaOrden.isAfter(fechaRango[0].startOf("day")) ||
          !fechaOrden.isBefore(fechaRango[1].endOf("day"))
        ) {
          return false;
        }
      }

      // Filtro por texto de búsqueda
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return (
          o.id_ordencompra?.toString().includes(searchLower) ||
          o.nombre_proveedor?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  // Calcular totales de facturas
  const calcularTotalesFacturas = () => {
    const facturasFiltradas = filtrarFacturas();
    const totalFacturas = facturasFiltradas.length;

    // Asegurarse de que los valores sean números y no NaN
    const montoTotal = facturasFiltradas.reduce((sum, f) => {
      const monto =
        typeof f.monto_facturaproveedor === "number"
          ? f.monto_facturaproveedor
          : 0;
      return sum + monto;
    }, 0);

    const totalAbonado = facturasFiltradas.reduce((sum, f) => {
      const abonado = typeof f.total_abonado === "number" ? f.total_abonado : 0;
      return sum + abonado;
    }, 0);

    const saldoPendiente = montoTotal - totalAbonado;

    return {
      totalFacturas,
      montoTotal,
      totalAbonado,
      saldoPendiente,
    };
  };

  // Calcular totales de órdenes
  const calcularTotalesOrdenes = () => {
    const ordenesFiltradas = filtrarOrdenes();
    const totalOrdenes = ordenesFiltradas.length;

    const montoTotal = ordenesFiltradas.reduce((sum, o) => {
      const monto =
        typeof o.total_ordencompra === "number" ? o.total_ordencompra : 0;
      return sum + monto;
    }, 0);

    const totalProductos = ordenesFiltradas.reduce((sum, o) => {
      return sum + (o.detalles?.length || 0);
    }, 0);

    return {
      totalOrdenes,
      montoTotal,
      totalProductos,
    };
  };

  // Resetear filtros
  const resetFilters = () => {
    setFiltroProveedor("");
    setFiltroEstado("");
    setFechaRango(null);
    setSearchText("");
  };

  // Mostrar detalles
  const mostrarDetalles = (record) => {
    setDetalleSeleccionado(record);
    setDetalleVisible(true);
  };

  // Manejar cambios en la tabla
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });
  };

  // Columnas para la tabla de facturas
  const columnasFacturas = [
    {
      title: "N.º Factura",
      dataIndex: "id_facturaproveedor",
      key: "id_facturaproveedor",
      sorter: (a, b) => a.id_facturaproveedor - b.id_facturaproveedor,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
    },
    {
      title: "Proveedor",
      dataIndex: "nombre_proveedor",
      key: "nombre_proveedor",
      sorter: (a, b) => a.nombre_proveedor?.localeCompare(b.nombre_proveedor),
      render: (nombre) => <Text>{nombre}</Text>,
    },
    {
      title: "Fecha",
      dataIndex: "fecha_facturaproveedor",
      key: "fecha_facturaproveedor",
      sorter: (a, b) =>
        new Date(a.fecha_facturaproveedor) - new Date(b.fecha_facturaproveedor),
      render: (fecha) => (
        <Text>{fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-"}</Text>
      ),
    },
    {
      title: "Monto Total",
      dataIndex: "monto_facturaproveedor",
      key: "monto_facturaproveedor",
      sorter: (a, b) => a.monto_facturaproveedor - b.monto_facturaproveedor,
      render: (monto) => <Text strong>{formatCurrency(monto)}</Text>,
    },
    {
      title: "Total Abonado",
      dataIndex: "total_abonado",
      key: "total_abonado",
      sorter: (a, b) => a.total_abonado - b.total_abonado,
      render: (abonado) => (
        <Text style={{ color: colors.success }}>{formatCurrency(abonado)}</Text>
      ),
    },
    {
      title: "Saldo Pendiente",
      key: "saldo_pendiente",
      sorter: (a, b) =>
        a.monto_facturaproveedor -
        a.total_abonado -
        (b.monto_facturaproveedor - b.total_abonado),
      render: (_, record) => {
        const saldo = record.monto_facturaproveedor - record.total_abonado;
        return (
          <Text style={{ color: colors.danger }}>{formatCurrency(saldo)}</Text>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "estado_facturaproveedor",
      key: "estado_facturaproveedor",
      render: (estado) => {
        let color = colors.warning;
        let icon = <ClockCircleOutlined />;

        if (estado?.toLowerCase() === "pagada") {
          color = colors.success;
          icon = <CheckCircleOutlined />;
        } else if (estado?.toLowerCase() === "pendiente") {
          color = colors.danger;
          icon = <ExclamationCircleOutlined />;
        }

        return (
          <Tag
            color={color}
            style={{ borderRadius: "12px", padding: "2px 10px" }}
          >
            {icon} {estado || "Desconocido"}
          </Tag>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => mostrarDetalles(record)}
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
            />
          </Tooltip>
          <Tooltip title="Registrar abono">
            <Button
              type="primary"
              shape="circle"
              icon={<DollarOutlined />}
              size="small"
              style={{
                backgroundColor: colors.success,
                borderColor: colors.success,
              }}
            />
          </Tooltip>
          <Tooltip title="Generar PDF">
            <Button
              type="primary"
              shape="circle"
              icon={<FilePdfOutlined />}
              size="small"
              style={{
                backgroundColor: colors.accent,
                borderColor: colors.accent,
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Columnas para la tabla de órdenes
  const columnasOrdenes = [
    {
      title: "ID Orden",
      dataIndex: "id_ordencompra",
      key: "id_ordencompra",
      sorter: (a, b) => a.id_ordencompra - b.id_ordencompra,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
    },
    {
      title: "Proveedor",
      dataIndex: "nombre_proveedor",
      key: "nombre_proveedor",
      sorter: (a, b) => a.nombre_proveedor?.localeCompare(b.nombre_proveedor),
      render: (nombre) => <Text>{nombre}</Text>,
    },
    {
      title: "Fecha",
      dataIndex: "fecha_ordencompra",
      key: "fecha_ordencompra",
      sorter: (a, b) =>
        new Date(a.fecha_ordencompra) - new Date(b.fecha_ordencompra),
      render: (fecha) => (
        <Text>{fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-"}</Text>
      ),
    },
    {
      title: "Total",
      dataIndex: "total_ordencompra",
      key: "total_ordencompra",
      sorter: (a, b) => a.total_ordencompra - b.total_ordencompra,
      render: (total) => <Text strong>{formatCurrency(total)}</Text>,
    },
    {
      title: "Productos",
      key: "productos",
      render: (_, record) => {
        const detalles = record.detalles || [];

        if (detalles.length === 0) {
          return <Text type="secondary">Sin productos</Text>;
        }

        return (
          <Popover
            title="Productos en la orden"
            content={
              <List
                size="small"
                dataSource={detalles}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <ShoppingOutlined style={{ color: colors.primary }} />
                      <Text>{item.nombre_producto}</Text>
                      <Badge
                        count={item.cantidad}
                        style={{ backgroundColor: colors.secondary }}
                      />
                    </Space>
                  </List.Item>
                )}
                style={{ maxHeight: "200px", overflow: "auto", width: "300px" }}
              />
            }
            placement="left"
          >
            <Button type="link" icon={<EyeOutlined />}>
              Ver {detalles.length} productos
            </Button>
          </Popover>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => mostrarDetalles(record)}
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
            />
          </Tooltip>
          <Tooltip title="Notificar">
            <Button
              type="primary"
              shape="circle"
              icon={<BellOutlined />}
              size="small"
              style={{
                backgroundColor: colors.warning,
                borderColor: colors.warning,
              }}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              size="small"
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const totalesFacturas = calcularTotalesFacturas();
  const totalesOrdenes = calcularTotalesOrdenes();

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
            }}
          >
            <Title level={2} style={{ margin: 0, color: colors.primary }}>
              <FileTextOutlined style={{ marginRight: "12px" }} />
              Facturación de Proveedores
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
            >
              Nueva Factura
            </Button>
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
                  <FileTextOutlined /> Facturas
                </span>
              }
              key="facturas"
            >
              {/* Tarjetas de estadísticas para facturas */}
              <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={12} md={6}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `4px solid ${colors.primary}`,
                      borderRadius: "4px",
                    }}
                  >
                    <Statistic
                      title="Total Facturas"
                      value={totalesFacturas.totalFacturas}
                      prefix={
                        <FileTextOutlined style={{ color: colors.primary }} />
                      }
                      valueStyle={{ color: colors.primary }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `4px solid ${colors.secondary}`,
                      borderRadius: "4px",
                    }}
                  >
                    <Statistic
                      title="Monto Total"
                      value={formatCurrency(totalesFacturas.montoTotal)}
                      valueStyle={{ color: colors.secondary }}
                      prefix={
                        <DollarOutlined style={{ color: colors.secondary }} />
                      }
                      formatter={(value) => value}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `4px solid ${colors.success}`,
                      borderRadius: "4px",
                    }}
                  >
                    <Statistic
                      title="Total Abonado"
                      value={formatCurrency(totalesFacturas.totalAbonado)}
                      valueStyle={{ color: colors.success }}
                      prefix={
                        <DollarOutlined style={{ color: colors.success }} />
                      }
                      formatter={(value) => value}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `4px solid ${colors.danger}`,
                      borderRadius: "4px",
                    }}
                  >
                    <Statistic
                      title="Saldo Pendiente"
                      value={formatCurrency(totalesFacturas.saldoPendiente)}
                      valueStyle={{ color: colors.danger }}
                      prefix={
                        <DollarOutlined style={{ color: colors.danger }} />
                      }
                      formatter={(value) => value}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Filtros para facturas */}
              <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} md={6}>
                  <Input
                    placeholder="Buscar factura..."
                    prefix={
                      <SearchOutlined style={{ color: colors.primary }} />
                    }
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Select
                    placeholder={
                      <Space>
                        <TeamOutlined style={{ color: colors.primary }} />
                        Filtrar por proveedor
                      </Space>
                    }
                    style={{ width: "100%" }}
                    value={filtroProveedor}
                    onChange={setFiltroProveedor}
                    allowClear
                  >
                    {proveedores.map((prov) => (
                      <Option
                        key={prov.id_proveedor}
                        value={prov.nombre_proveedor}
                      >
                        {prov.nombre_proveedor}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} md={6}>
                  <Select
                    placeholder={
                      <Space>
                        <FilterOutlined style={{ color: colors.primary }} />
                        Filtrar por estado
                      </Space>
                    }
                    style={{ width: "100%" }}
                    value={filtroEstado}
                    onChange={setFiltroEstado}
                    allowClear
                  >
                    <Option value="pendiente">Pendiente</Option>
                    <Option value="pagada">Pagada</Option>
                    <Option value="parcial">Parcial</Option>
                  </Select>
                </Col>
                <Col xs={24} md={6}>
                  <RangePicker
                    style={{ width: "100%" }}
                    placeholder={["Fecha inicio", "Fecha fin"]}
                    value={fechaRango}
                    onChange={setFechaRango}
                    format="DD/MM/YYYY"
                    allowClear
                    suffixIcon={
                      <CalendarOutlined style={{ color: colors.primary }} />
                    }
                  />
                </Col>
              </Row>

              <Row justify="end" style={{ marginBottom: "16px" }}>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                    Limpiar filtros
                  </Button>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={fetchFacturas}
                    loading={loading}
                    style={{
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }}
                  >
                    Actualizar
                  </Button>
                </Space>
              </Row>

              {/* Tabla de facturas */}
              <Table
                columns={columnasFacturas}
                dataSource={filtrarFacturas()}
                rowKey="id_facturaproveedor"
                loading={loading}
                onChange={handleTableChange}
                pagination={tableParams.pagination}
                scroll={{ x: 1000 }}
                size="middle"
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <ShoppingOutlined /> Órdenes de Compra
                </span>
              }
              key="ordenes"
            >
              {/* Tarjetas de estadísticas para órdenes */}
              <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={8}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `4px solid ${colors.primary}`,
                      borderRadius: "4px",
                    }}
                  >
                    <Statistic
                      title="Total Órdenes"
                      value={totalesOrdenes.totalOrdenes}
                      prefix={
                        <ShoppingOutlined style={{ color: colors.primary }} />
                      }
                      valueStyle={{ color: colors.primary }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `4px solid ${colors.secondary}`,
                      borderRadius: "4px",
                    }}
                  >
                    <Statistic
                      title="Monto Total"
                      value={formatCurrency(totalesOrdenes.montoTotal)}
                      valueStyle={{ color: colors.secondary }}
                      prefix={
                        <DollarOutlined style={{ color: colors.secondary }} />
                      }
                      formatter={(value) => value}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `4px solid ${colors.accent}`,
                      borderRadius: "4px",
                    }}
                  >
                    <Statistic
                      title="Total Productos"
                      value={totalesOrdenes.totalProductos}
                      valueStyle={{ color: colors.accent }}
                      prefix={
                        <InboxOutlined style={{ color: colors.accent }} />
                      }
                    />
                  </Card>
                </Col>
              </Row>

              {/* Filtros para órdenes */}
              <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} md={8}>
                  <Input
                    placeholder="Buscar orden..."
                    prefix={
                      <SearchOutlined style={{ color: colors.primary }} />
                    }
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Select
                    placeholder={
                      <Space>
                        <TeamOutlined style={{ color: colors.primary }} />
                        Filtrar por proveedor
                      </Space>
                    }
                    style={{ width: "100%" }}
                    value={filtroProveedor}
                    onChange={setFiltroProveedor}
                    allowClear
                  >
                    {proveedores.map((prov) => (
                      <Option
                        key={prov.id_proveedor}
                        value={prov.nombre_proveedor}
                      >
                        {prov.nombre_proveedor}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} md={8}>
                  <RangePicker
                    style={{ width: "100%" }}
                    placeholder={["Fecha inicio", "Fecha fin"]}
                    value={fechaRango}
                    onChange={setFechaRango}
                    format="DD/MM/YYYY"
                    allowClear
                    suffixIcon={
                      <CalendarOutlined style={{ color: colors.primary }} />
                    }
                  />
                </Col>
              </Row>

              <Row justify="end" style={{ marginBottom: "16px" }}>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                    Limpiar filtros
                  </Button>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={fetchOrdenes}
                    loading={loadingOrdenes}
                    style={{
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }}
                  >
                    Actualizar
                  </Button>
                </Space>
              </Row>

              {/* Tabla de órdenes */}
              <Table
                columns={columnasOrdenes}
                dataSource={filtrarOrdenes()}
                rowKey="id_ordencompra"
                loading={loadingOrdenes}
                onChange={handleTableChange}
                pagination={tableParams.pagination}
                scroll={{ x: 1000 }}
                size="middle"
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* Modal de detalles */}
      <Modal
        title={
          <Space>
            <EyeOutlined style={{ color: colors.primary }} />
            {activeTab === "facturas"
              ? "Detalles de Factura"
              : "Detalles de Orden"}
          </Space>
        }
        open={detalleVisible}
        onCancel={() => setDetalleVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetalleVisible(false)}>
            Cerrar
          </Button>,
        ]}
        width={700}
      >
        {detalleSeleccionado && (
          <div>
            {activeTab === "facturas" ? (
              <div>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="N.º Factura" span={2}>
                    <Text strong>
                      {detalleSeleccionado.id_facturaproveedor}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Proveedor">
                    {detalleSeleccionado.nombre_proveedor}
                  </Descriptions.Item>
                  <Descriptions.Item label="Fecha">
                    {dayjs(detalleSeleccionado.fecha_facturaproveedor).format(
                      "DD/MM/YYYY"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Monto Total">
                    <Text strong>
                      {formatCurrency(
                        detalleSeleccionado.monto_facturaproveedor
                      )}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Abonado">
                    <Text style={{ color: colors.success }}>
                      {formatCurrency(detalleSeleccionado.total_abonado)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Saldo Pendiente" span={2}>
                    <Text style={{ color: colors.danger }}>
                      {formatCurrency(
                        detalleSeleccionado.monto_facturaproveedor -
                          detalleSeleccionado.total_abonado
                      )}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Estado" span={2}>
                    <Tag
                      color={
                        detalleSeleccionado.estado_facturaproveedor?.toLowerCase() ===
                        "pagada"
                          ? colors.success
                          : detalleSeleccionado.estado_facturaproveedor?.toLowerCase() ===
                            "pendiente"
                          ? colors.danger
                          : colors.warning
                      }
                      style={{ borderRadius: "12px", padding: "2px 10px" }}
                    >
                      {detalleSeleccionado.estado_facturaproveedor}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">Productos</Divider>
                <List
                  size="small"
                  bordered
                  dataSource={detalleSeleccionado.productos || []}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <ShoppingOutlined
                            style={{ color: colors.primary, fontSize: "20px" }}
                          />
                        }
                        title={item.nombre_producto}
                        description={`Cantidad: ${
                          item.cantidad
                        } | Precio: ${formatCurrency(item.precio)}`}
                      />
                      <div>
                        <Text strong>
                          {formatCurrency(item.cantidad * item.precio)}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                  locale={{
                    emptyText: "No hay productos asociados a esta factura",
                  }}
                />
              </div>
            ) : (
              <div>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="ID Orden" span={2}>
                    <Text strong>{detalleSeleccionado.id_ordencompra}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Proveedor">
                    {detalleSeleccionado.nombre_proveedor}
                  </Descriptions.Item>
                  <Descriptions.Item label="Fecha">
                    {dayjs(detalleSeleccionado.fecha_ordencompra).format(
                      "DD/MM/YYYY"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total" span={2}>
                    <Text strong>
                      {formatCurrency(detalleSeleccionado.total_ordencompra)}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">Productos</Divider>
                <List
                  size="small"
                  bordered
                  dataSource={detalleSeleccionado.detalles || []}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <ShoppingOutlined
                            style={{ color: colors.primary, fontSize: "20px" }}
                          />
                        }
                        title={item.nombre_producto}
                        description={`Cantidad: ${item.cantidad}`}
                      />
                      <div>
                        <Badge
                          count={item.cantidad}
                          style={{ backgroundColor: colors.secondary }}
                        />
                      </div>
                    </List.Item>
                  )}
                  locale={{
                    emptyText: "No hay productos asociados a esta orden",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FacturacionProveedor;
