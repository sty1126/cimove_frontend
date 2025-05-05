"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  Card,
  Tabs,
  Tag,
  Typography,
  Select,
  Row,
  Col,
  Statistic,
  Divider,
  Space,
  Avatar,
  Tooltip,
  Popover,
  List,
  Empty,
} from "antd";
import {
  FileTextOutlined,
  ToolOutlined,
  EyeOutlined,
  EditOutlined,
  FilePdfOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  ShopOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
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

const ListaFacturacionVentas = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("facturas");
  const [facturas, setFacturas] = useState([]);
  const [serviciosTecnicos, setServiciosTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [filteredServicios, setFilteredServicios] = useState([]);
  const [estadoFilter, setEstadoFilter] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50"],
      showTotal: (total) => `Total: ${total} registros`,
    },
  });

  // Cargar datos
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Cargar facturas
      const resFacturas = await fetch(
        "https://cimove-backend.onrender.com/api/factura/"
      );
      const dataFacturas = await resFacturas.json();
      setFacturas(Array.isArray(dataFacturas) ? dataFacturas : [dataFacturas]);
      setFilteredFacturas(
        Array.isArray(dataFacturas) ? dataFacturas : [dataFacturas]
      );

      // Cargar servicios técnicos
      const resServicios = await fetch(
        "https://cimove-backend.onrender.com/api/serviciotecnico/"
      );
      const dataServicios = await resServicios.json();
      setServiciosTecnicos(Array.isArray(dataServicios) ? dataServicios : []);
      setFilteredServicios(Array.isArray(dataServicios) ? dataServicios : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar datos cuando cambia el texto de búsqueda o el filtro de estado
  useEffect(() => {
    // Filtrar facturas
    const filteredF = facturas.filter((factura) => {
      const matchesSearch =
        searchText === "" ||
        factura.id_factura.toString().includes(searchText) ||
        (factura.email_cliente &&
          factura.email_cliente
            .toLowerCase()
            .includes(searchText.toLowerCase())) ||
        (factura.cliente &&
          factura.cliente.nombre_cliente &&
          factura.cliente.nombre_cliente
            .toLowerCase()
            .includes(searchText.toLowerCase()));

      const matchesEstado =
        estadoFilter === "" || factura.estado_factura === estadoFilter;

      return matchesSearch && matchesEstado;
    });

    setFilteredFacturas(filteredF);

    // Filtrar servicios técnicos
    const filteredS = serviciosTecnicos.filter((servicio) => {
      const matchesSearch =
        searchText === "" ||
        servicio.id_serviciotecnico.toString().includes(searchText) ||
        servicio.nombre_serviciotecnico
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (servicio.nombre_cliente &&
          servicio.nombre_cliente
            .toLowerCase()
            .includes(searchText.toLowerCase())) ||
        (servicio.email_cliente &&
          servicio.email_cliente
            .toLowerCase()
            .includes(searchText.toLowerCase()));

      const matchesEstado =
        estadoFilter === "" ||
        servicio.estadotecnico_serviciotecnico === estadoFilter;

      return matchesSearch && matchesEstado;
    });

    setFilteredServicios(filteredS);
  }, [searchText, estadoFilter, facturas, serviciosTecnicos]);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Obtener color de estado para facturas
  const getEstadoFacturaColor = (estado) => {
    switch (estado) {
      case "A":
        return "success";
      case "I":
        return "error";
      case "P":
        return "warning";
      default:
        return "default";
    }
  };

  // Obtener texto de estado para facturas
  const getEstadoFacturaText = (estado) => {
    switch (estado) {
      case "A":
        return "Activa";
      case "I":
        return "Inactiva";
      case "P":
        return "Pendiente";
      default:
        return estado;
    }
  };

  // Obtener color de estado para servicios técnicos
  const getEstadoServicioColor = (estado) => {
    if (!estado) return "default";

    switch (estado.toUpperCase()) {
      case "D":
      case "EN_DIAGNOSTICO":
        return "processing";
      case "C":
      case "COMPLETADO":
        return "success";
      case "P":
      case "PENDIENTE":
        return "warning";
      case "X":
      case "CANCELADO":
        return "error";
      default:
        return "default";
    }
  };

  // Obtener texto de estado para servicios técnicos
  const getEstadoServicioText = (estado) => {
    if (!estado) return "Desconocido";

    switch (estado.toUpperCase()) {
      case "D":
        return "En Diagnóstico";
      case "C":
        return "Completado";
      case "P":
        return "Pendiente";
      case "X":
        return "Cancelado";
      default:
        return estado;
    }
  };

  // Manejar cambios en la tabla
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });
  };

  // Generar PDF (placeholder)
  const generarPDF = (id, tipo) => {
    console.log(`Generando PDF para ${tipo} con ID: ${id}`);
    // Aquí iría la lógica para generar el PDF
  };

  // Calcular estadísticas para facturas
  const calcularEstadisticasFacturas = () => {
    const totalFacturas = filteredFacturas.length;
    const totalMonto = filteredFacturas.reduce(
      (sum, factura) => sum + (factura.total_factura || 0),
      0
    );
    const facturasPendientes = filteredFacturas.filter(
      (f) => f.estado_factura === "P"
    ).length;
    const facturasActivas = filteredFacturas.filter(
      (f) => f.estado_factura === "A"
    ).length;

    return {
      totalFacturas,
      totalMonto,
      facturasPendientes,
      facturasActivas,
    };
  };

  // Calcular estadísticas para servicios técnicos
  const calcularEstadisticasServicios = () => {
    const totalServicios = filteredServicios.length;
    const totalMonto = filteredServicios.reduce(
      (sum, servicio) => sum + (servicio.costo_serviciotecnico || 0),
      0
    );
    const serviciosPendientes = filteredServicios.filter(
      (s) =>
        s.estadotecnico_serviciotecnico === "PENDIENTE" ||
        s.estadotecnico_serviciotecnico === "P" ||
        s.estadotecnico_serviciotecnico === "EN_DIAGNOSTICO" ||
        s.estadotecnico_serviciotecnico === "D"
    ).length;
    const serviciosCompletados = filteredServicios.filter(
      (s) =>
        s.estadotecnico_serviciotecnico === "COMPLETADO" ||
        s.estadotecnico_serviciotecnico === "C"
    ).length;

    return {
      totalServicios,
      totalMonto,
      serviciosPendientes,
      serviciosCompletados,
    };
  };

  const estadisticasFacturas = calcularEstadisticasFacturas();
  const estadisticasServicios = calcularEstadisticasServicios();

  // Renderizar detalles de productos
  const renderDetallesProductos = (detalles) => {
    if (!detalles || detalles.length === 0) {
      return (
        <Empty
          description="No hay productos"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <List
        size="small"
        dataSource={detalles}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  icon={<ShoppingOutlined />}
                  style={{ backgroundColor: colors.accent }}
                />
              }
              title={
                item.producto
                  ? item.producto.nombre_producto
                  : "Producto sin nombre"
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">
                    Cantidad: <Text strong>{item.cantidad}</Text>
                  </Text>
                  <Text type="secondary">
                    Precio:{" "}
                    <Text strong>{formatCurrency(item.precio_unitario)}</Text>
                  </Text>
                </Space>
              }
            />
            <div>
              <Text strong>
                {formatCurrency(item.precio_unitario * item.cantidad)}
              </Text>
            </div>
          </List.Item>
        )}
      />
    );
  };

  // Renderizar métodos de pago
  const renderMetodosPago = (metodos) => {
    if (!metodos || metodos.length === 0) {
      return (
        <Empty
          description="No hay métodos de pago"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <List
        size="small"
        dataSource={metodos}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  icon={<DollarOutlined />}
                  style={{ backgroundColor: colors.accent }}
                />
              }
              title={item.nombre_tipo_metodo_pago || "Método sin nombre"}
              description={
                <Text type="secondary">
                  ID: <Text strong>{item.id_tipo_metodo_pago}</Text>
                </Text>
              }
            />
            <div>
              <Text strong>{formatCurrency(item.monto)}</Text>
            </div>
          </List.Item>
        )}
      />
    );
  };

  // Renderizar información del cliente
  const renderInfoCliente = (cliente) => {
    if (!cliente) {
      return <Text type="secondary">Cliente no especificado</Text>;
    }

    return (
      <Space direction="vertical" size={0}>
        <Text strong>{cliente.nombre_cliente}</Text>
        {cliente.email_cliente && (
          <Text type="secondary">
            <MailOutlined style={{ marginRight: 4 }} />
            {cliente.email_cliente}
          </Text>
        )}
        {cliente.telefono_cliente && (
          <Text type="secondary">
            <PhoneOutlined style={{ marginRight: 4 }} />
            {cliente.telefono_cliente}
          </Text>
        )}
        {cliente.id_cliente && (
          <Text type="secondary">
            <IdcardOutlined style={{ marginRight: 4 }} />
            ID: {cliente.id_cliente}
          </Text>
        )}
      </Space>
    );
  };

  // Columnas para la tabla de facturas
  const columnasFacturas = [
    {
      title: "ID",
      dataIndex: "id_factura",
      key: "id_factura",
      sorter: (a, b) => a.id_factura - b.id_factura,
      width: 70,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
      responsive: ["md"],
    },
    {
      title: "Fecha",
      dataIndex: "fecha_factura",
      key: "fecha_factura",
      width: 100,
      render: (fecha) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <CalendarOutlined style={{ fontSize: "12px", color: colors.text }} />
          {formatDate(fecha)}
        </div>
      ),
      responsive: ["sm"],
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
      render: (cliente, record) => {
        if (cliente) {
          return (
            <Tooltip title="Ver detalles del cliente">
              <div style={{ cursor: "pointer" }}>
                <Text strong>{cliente.nombre_cliente}</Text>
                <div style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.45)" }}>
                  <UserOutlined style={{ marginRight: "4px" }} />
                  ID: {cliente.id_cliente}
                </div>
              </div>
            </Tooltip>
          );
        } else {
          return (
            <div>
              <Text type="secondary">Cliente no especificado</Text>
              {record.id_cliente_factura && (
                <div style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.45)" }}>
                  <UserOutlined style={{ marginRight: "4px" }} />
                  ID: {record.id_cliente_factura}
                </div>
              )}
            </div>
          );
        }
      },
    },
    {
      title: "Productos",
      key: "productos",
      render: (_, record) => {
        const detalles = record.detalles || [];
        const cantidadProductos = detalles.length;

        if (cantidadProductos === 0) {
          return <Text type="secondary">Sin productos</Text>;
        }

        return (
          <Popover
            content={renderDetallesProductos(detalles)}
            title="Detalle de productos"
            trigger="click"
            placement="right"
            overlayStyle={{ width: 300 }}
          >
            <Button
              type="text"
              size="small"
              icon={<ShoppingOutlined />}
              style={{ color: colors.primary }}
            >
              {cantidadProductos}{" "}
              {cantidadProductos === 1 ? "producto" : "productos"}
            </Button>
          </Popover>
        );
      },
    },
    {
      title: "Resumen",
      key: "resumen",
      render: (_, record) => {
        return (
          <Space direction="vertical" size={0}>
            <Text>
              Subtotal:{" "}
              <Text strong>{formatCurrency(record.subtotal_factura)}</Text>
            </Text>
            <Text>
              IVA: <Text strong>{formatCurrency(record.iva_factura)}</Text>
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total_factura",
      key: "total_factura",
      align: "right",
      sorter: (a, b) => a.total_factura - b.total_factura,
      render: (total) => (
        <Text strong style={{ color: colors.secondary, fontSize: "16px" }}>
          {formatCurrency(total)}
        </Text>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado_factura",
      key: "estado_factura",
      width: 100,
      render: (estado) => (
        <Tag color={getEstadoFacturaColor(estado)}>
          {getEstadoFacturaText(estado)}
        </Tag>
      ),
      filters: [
        { text: "Activa", value: "A" },
        { text: "Inactiva", value: "I" },
        { text: "Pendiente", value: "P" },
      ],
      onFilter: (value, record) => record.estado_factura === value,
    },
    {
      title: "Métodos de Pago",
      key: "metodos_pago",
      render: (_, record) => {
        const metodos = record.metodos_pago || [];
        const cantidadMetodos = metodos.length;

        if (cantidadMetodos === 0) {
          return <Text type="secondary">Sin métodos de pago</Text>;
        }

        return (
          <Popover
            content={renderMetodosPago(metodos)}
            title="Métodos de pago"
            trigger="click"
            placement="right"
            overlayStyle={{ width: 300 }}
          >
            <Button
              type="text"
              size="small"
              icon={<DollarOutlined />}
              style={{ color: colors.primary }}
            >
              {cantidadMetodos} {cantidadMetodos === 1 ? "método" : "métodos"}
            </Button>
          </Popover>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 160,
      align: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/detalles-venta/${record.id_factura}`)}
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
            title="Ver detalles"
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(`/editar-venta/${record.id_factura}`)}
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
            }}
            title="Editar"
          />
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            size="small"
            onClick={() => generarPDF(record.id_factura, "factura")}
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.accent,
            }}
            title="Generar PDF"
          />
        </Space>
      ),
    },
  ];

  // Columnas para la tabla de servicios técnicos
  const columnasServicios = [
    {
      title: "ID",
      dataIndex: "id_serviciotecnico",
      key: "id_serviciotecnico",
      sorter: (a, b) => a.id_serviciotecnico - b.id_serviciotecnico,
      width: 70,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          #{id}
        </Text>
      ),
    },
    {
      title: "Fechas",
      key: "fechas",
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Tooltip title="Fecha de ingreso">
              <CalendarOutlined
                style={{ fontSize: "12px", color: colors.primary }}
              />
            </Tooltip>
            {formatDate(record.fecha_serviciotecnico)}
          </div>
          {record.fecha_entrega_serviciotecnico && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Tooltip title="Fecha de entrega estimada">
                <CalendarOutlined
                  style={{ fontSize: "12px", color: colors.warning }}
                />
              </Tooltip>
              {formatDate(record.fecha_entrega_serviciotecnico)}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Servicio",
      key: "servicio",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.nombre_serviciotecnico}</Text>
          {record.descripcion_serviciotecnico && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.descripcion_serviciotecnico}
            </Text>
          )}
          {record.tipo_dano_serviciotecnico && (
            <Tag
              color={
                record.tipo_dano_serviciotecnico === "normal" ? "blue" : "red"
              }
            >
              {record.tipo_dano_serviciotecnico.toUpperCase()}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Cliente",
      key: "cliente",
      render: (_, record) => {
        const clienteInfo = [];

        if (record.nombre_cliente) {
          clienteInfo.push(
            <Text key="nombre" strong>
              {record.nombre_cliente}
            </Text>
          );
        }

        if (record.email_cliente) {
          clienteInfo.push(
            <Text key="email" type="secondary" style={{ fontSize: "12px" }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email_cliente}
            </Text>
          );
        }

        if (record.telefono_cliente) {
          clienteInfo.push(
            <Text key="telefono" type="secondary" style={{ fontSize: "12px" }}>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {record.telefono_cliente}
            </Text>
          );
        }

        if (record.nombre_sede) {
          clienteInfo.push(
            <Text key="sede" type="secondary" style={{ fontSize: "12px" }}>
              <ShopOutlined style={{ marginRight: 4 }} />
              {record.nombre_sede}
            </Text>
          );
        }

        if (clienteInfo.length === 0) {
          return <Text type="secondary">Cliente no especificado</Text>;
        }

        return (
          <Space direction="vertical" size={0}>
            {clienteInfo}
          </Space>
        );
      },
    },
    {
      title: "Proveedor",
      dataIndex: "nombre_proveedor",
      key: "nombre_proveedor",
      render: (proveedor) =>
        proveedor ? (
          <Text>{proveedor}</Text>
        ) : (
          <Text type="secondary">No asignado</Text>
        ),
    },
    {
      title: "Financiero",
      key: "financiero",
      render: (_, record) => {
        // Calculate total abono from payment methods
        const totalAbono =
          record.metodos_pago && record.metodos_pago.length > 0
            ? record.metodos_pago.reduce(
                (sum, metodo) => sum + (metodo.monto || 0),
                0
              )
            : record.abono_serviciotecnico || 0;

        return (
          <Space direction="vertical" size={0}>
            <Text>
              Costo:{" "}
              <Text strong>{formatCurrency(record.costo_serviciotecnico)}</Text>
            </Text>
            <Text>
              Abono: <Text strong>{formatCurrency(totalAbono)}</Text>
            </Text>
            {record.costo_serviciotecnico && (
              <Text type="secondary">
                Saldo:{" "}
                {formatCurrency(record.costo_serviciotecnico - totalAbono)}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "estadotecnico_serviciotecnico",
      key: "estadotecnico_serviciotecnico",
      width: 120,
      render: (estado) => (
        <Tag color={getEstadoServicioColor(estado)}>
          {getEstadoServicioText(estado)}
        </Tag>
      ),
      filters: [
        { text: "En Diagnóstico", value: "D" },
        { text: "Completado", value: "C" },
        { text: "Pendiente", value: "P" },
        { text: "Cancelado", value: "X" },
      ],
      onFilter: (value, record) =>
        record.estadotecnico_serviciotecnico === value,
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 160,
      align: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() =>
              navigate(`/detalles-servicio/${record.id_serviciotecnico}`)
            }
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
            title="Ver detalles"
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() =>
              navigate(`/editar-servicio/${record.id_serviciotecnico}`)
            }
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
            }}
            title="Editar"
          />
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            size="small"
            onClick={() => generarPDF(record.id_serviciotecnico, "servicio")}
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.accent,
            }}
            title="Generar PDF"
          />
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "8px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
      className="px-2 sm:px-4 md:px-6 lg:px-16"
    >
      <Card
        bordered={false}
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          marginBottom: "16px",
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
          <Title level={3} style={{ margin: 0, color: colors.primary }}>
            {activeTab === "facturas" ? (
              <FileTextOutlined style={{ marginRight: "8px" }} />
            ) : (
              <ToolOutlined style={{ marginRight: "8px" }} />
            )}
            Sistema de Gestión
          </Title>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              navigate(
                activeTab === "facturas" ? "/ventas" : "/servicio-tecnico"
              )
            }
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
          >
            {activeTab === "facturas"
              ? "Nueva Venta"
              : "Nuevo Servicio Técnico"}
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Button
              icon={<SyncOutlined spin={loading} />}
              onClick={fetchData}
              size="small"
            >
              Actualizar
            </Button>
          }
        >
          <TabPane
            tab={
              <span>
                <FileTextOutlined /> Facturas
              </span>
            }
            key="facturas"
          >
            {/* Tarjetas de resumen para Facturas */}
            <Row gutter={[8, 8]} style={{ marginBottom: "16px" }}>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    borderLeft: `3px solid ${colors.primary}`,
                    height: "100%",
                  }}
                >
                  <Statistic
                    title="Total Facturas"
                    value={estadisticasFacturas.totalFacturas}
                    prefix={
                      <FileTextOutlined style={{ color: colors.primary }} />
                    }
                    valueStyle={{ color: colors.primary, fontSize: "18px" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    borderLeft: `3px solid ${colors.secondary}`,
                    height: "100%",
                  }}
                >
                  <Statistic
                    title="Monto Total"
                    value={formatCurrency(estadisticasFacturas.totalMonto)}
                    prefix={
                      <DollarOutlined style={{ color: colors.secondary }} />
                    }
                    valueStyle={{ color: colors.secondary, fontSize: "18px" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    borderLeft: `3px solid ${colors.warning}`,
                    height: "100%",
                  }}
                >
                  <Statistic
                    title="Facturas Pendientes"
                    value={estadisticasFacturas.facturasPendientes}
                    prefix={
                      <ClockCircleOutlined style={{ color: colors.warning }} />
                    }
                    valueStyle={{ color: colors.warning, fontSize: "18px" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    borderLeft: `3px solid ${colors.success}`,
                    height: "100%",
                  }}
                >
                  <Statistic
                    title="Facturas Activas"
                    value={estadisticasFacturas.facturasActivas}
                    prefix={
                      <CheckCircleOutlined style={{ color: colors.success }} />
                    }
                    valueStyle={{ color: colors.success, fontSize: "18px" }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Filtros para Facturas */}
            <Row gutter={[8, 8]} style={{ marginBottom: "16px" }}>
              <Col xs={24} md={16}>
                <Input
                  placeholder="Buscar por ID, cliente o email..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                  allowClear
                  style={{ width: "100%" }}
                  size="middle"
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  placeholder="Filtrar por estado"
                  value={estadoFilter}
                  onChange={setEstadoFilter}
                  style={{ width: "100%" }}
                  allowClear
                  size="middle"
                >
                  <Option value="A">Activa</Option>
                  <Option value="I">Inactiva</Option>
                  <Option value="P">Pendiente</Option>
                </Select>
              </Col>
            </Row>

            {/* Tabla de Facturas */}
            <Table
              columns={columnasFacturas}
              dataSource={filteredFacturas}
              rowKey="id_factura"
              loading={loading}
              onChange={handleTableChange}
              pagination={{
                ...tableParams.pagination,
                size: "small",
                responsive: true,
              }}
              scroll={{ x: "max-content" }}
              size="small"
              expandable={{
                expandedRowRender: (record) => (
                  <Card
                    size="small"
                    bordered={false}
                    style={{ backgroundColor: "#f9f9f9", padding: "8px" }}
                  >
                    <Row gutter={[8, 16]}>
                      <Col span={24} md={8}>
                        <Card
                          size="small"
                          title={
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <ShoppingOutlined
                                style={{
                                  marginRight: 8,
                                  color: colors.primary,
                                }}
                              />
                              <span>Productos</span>
                              {record.detalles &&
                                record.detalles.length > 0 &&
                                record.detalles[0].sede && (
                                  <Tag
                                    color={colors.primary}
                                    style={{ marginLeft: 8 }}
                                  >
                                    <ShopOutlined style={{ marginRight: 4 }} />
                                    {record.detalles[0].sede.nombre_sede ||
                                      `ID: ${record.detalles[0].sede.id_sede}`}
                                  </Tag>
                                )}
                            </div>
                          }
                          style={{ height: "100%" }}
                        >
                          {renderDetallesProductos(record.detalles)}
                        </Card>
                      </Col>
                      <Col span={24} md={8}>
                        <Card
                          size="small"
                          title={
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <DollarOutlined
                                style={{
                                  marginRight: 8,
                                  color: colors.primary,
                                }}
                              />
                              <span>Métodos de Pago</span>
                            </div>
                          }
                          style={{ height: "100%" }}
                        >
                          {renderMetodosPago(record.metodos_pago)}
                        </Card>
                      </Col>
                      <Col span={24} md={8}>
                        <Card
                          size="small"
                          title={
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <UserOutlined
                                style={{
                                  marginRight: 8,
                                  color: colors.primary,
                                }}
                              />
                              <span>Información del Cliente</span>
                            </div>
                          }
                          style={{ height: "100%" }}
                        >
                          {renderInfoCliente(record.cliente)}
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                ),
                expandIcon: ({ expanded, onExpand, record }) =>
                  expanded ? (
                    <Button
                      type="text"
                      icon={<InfoCircleOutlined />}
                      onClick={(e) => onExpand(record, e)}
                      style={{ color: colors.primary }}
                    />
                  ) : (
                    <Button
                      type="text"
                      icon={<InfoCircleOutlined />}
                      onClick={(e) => onExpand(record, e)}
                    />
                  ),
              }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <ToolOutlined /> Servicios Técnicos
              </span>
            }
            key="servicios"
          >
            {/* Tarjetas de resumen para Servicios Técnicos */}
            <Row gutter={[12, 12]} style={{ marginBottom: "16px" }}>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    borderLeft: `3px solid ${colors.primary}`,
                  }}
                >
                  <Statistic
                    title="Total Servicios"
                    value={estadisticasServicios.totalServicios}
                    prefix={<ToolOutlined style={{ color: colors.primary }} />}
                    valueStyle={{ color: colors.primary, fontSize: "18px" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    borderLeft: `3px solid ${colors.secondary}`,
                  }}
                >
                  <Statistic
                    title="Monto Total"
                    value={formatCurrency(estadisticasServicios.totalMonto)}
                    prefix={
                      <DollarOutlined style={{ color: colors.secondary }} />
                    }
                    valueStyle={{ color: colors.secondary, fontSize: "18px" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    borderLeft: `3px solid ${colors.warning}`,
                  }}
                >
                  <Statistic
                    title="Servicios Pendientes"
                    value={estadisticasServicios.serviciosPendientes}
                    prefix={
                      <ExclamationCircleOutlined
                        style={{ color: colors.warning }}
                      />
                    }
                    valueStyle={{ color: colors.warning, fontSize: "18px" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    borderLeft: `3px solid ${colors.success}`,
                  }}
                >
                  <Statistic
                    title="Servicios Completados"
                    value={estadisticasServicios.serviciosCompletados}
                    prefix={
                      <CheckCircleOutlined style={{ color: colors.success }} />
                    }
                    valueStyle={{ color: colors.success, fontSize: "18px" }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Filtros para Servicios Técnicos */}
            <Row gutter={[12, 12]} style={{ marginBottom: "16px" }}>
              <Col xs={24} md={16}>
                <Input
                  placeholder="Buscar por ID, nombre o cliente..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                  allowClear
                  style={{ width: "100%" }}
                  size="middle"
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  placeholder="Filtrar por estado"
                  value={estadoFilter}
                  onChange={setEstadoFilter}
                  style={{ width: "100%" }}
                  allowClear
                  size="middle"
                >
                  <Option value="D">En diagnóstico</Option>
                  <Option value="C">Completado</Option>
                  <Option value="P">Pendiente</Option>
                  <Option value="X">Cancelado</Option>
                </Select>
              </Col>
            </Row>

            {/* Tabla de Servicios Técnicos */}
            <Table
              columns={columnasServicios}
              dataSource={filteredServicios}
              rowKey="id_serviciotecnico"
              loading={loading}
              onChange={handleTableChange}
              pagination={tableParams.pagination}
              scroll={{ x: 1200 }}
              size="middle"
              expandable={{
                expandedRowRender: (record) => (
                  <Card
                    size="small"
                    bordered={false}
                    style={{ backgroundColor: "#f9f9f9" }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={24} md={12}>
                        <Card
                          size="small"
                          title={
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <ToolOutlined
                                style={{
                                  marginRight: 8,
                                  color: colors.primary,
                                }}
                              />
                              <span>Detalles del Servicio</span>
                            </div>
                          }
                          style={{ height: "100%" }}
                        >
                          <Space direction="vertical" size={8}>
                            {record.descripcion_serviciotecnico && (
                              <div>
                                <Text strong>Descripción:</Text>
                                <div>{record.descripcion_serviciotecnico}</div>
                              </div>
                            )}
                            {record.tipo_dano_serviciotecnico && (
                              <div>
                                <Text strong>Tipo de daño:</Text>
                                <div>
                                  <Tag
                                    color={
                                      record.tipo_dano_serviciotecnico ===
                                      "normal"
                                        ? "blue"
                                        : "red"
                                    }
                                  >
                                    {record.tipo_dano_serviciotecnico.toUpperCase()}
                                  </Tag>
                                </div>
                              </div>
                            )}
                            <div>
                              <Text strong>Autorizado:</Text>
                              <div>
                                <Tag
                                  color={
                                    record.autorizado_serviciotecnico
                                      ? "green"
                                      : "red"
                                  }
                                >
                                  {record.autorizado_serviciotecnico
                                    ? "SÍ"
                                    : "NO"}
                                </Tag>
                              </div>
                            </div>
                          </Space>
                        </Card>
                      </Col>
                      <Col span={24} md={12}>
                        <Card
                          size="small"
                          title={
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <DollarOutlined
                                style={{
                                  marginRight: 8,
                                  color: colors.primary,
                                }}
                              />
                              <span>Información Financiera</span>
                            </div>
                          }
                          style={{ height: "100%" }}
                        >
                          <Space direction="vertical" size={8}>
                            <div>
                              <Text strong>Costo del servicio:</Text>
                              <div>
                                {formatCurrency(record.costo_serviciotecnico)}
                              </div>
                            </div>
                            <div>
                              <Text strong>Abono:</Text>
                              <div>
                                {formatCurrency(
                                  record.metodos_pago &&
                                    record.metodos_pago.length > 0
                                    ? record.metodos_pago.reduce(
                                        (sum, metodo) =>
                                          sum + (metodo.monto || 0),
                                        0
                                      )
                                    : record.abono_serviciotecnico || 0
                                )}
                              </div>
                            </div>
                            <div>
                              <Text strong>Saldo pendiente:</Text>
                              <div>
                                {formatCurrency(
                                  record.costo_serviciotecnico -
                                    (record.metodos_pago &&
                                    record.metodos_pago.length > 0
                                      ? record.metodos_pago.reduce(
                                          (sum, metodo) =>
                                            sum + (metodo.monto || 0),
                                          0
                                        )
                                      : record.abono_serviciotecnico || 0)
                                )}
                              </div>
                            </div>
                            {record.total_factura && (
                              <div>
                                <Text strong>Total factura:</Text>
                                <div>
                                  {formatCurrency(record.total_factura)}
                                </div>
                              </div>
                            )}
                          </Space>
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                ),
                expandIcon: ({ expanded, onExpand, record }) =>
                  expanded ? (
                    <Button
                      type="text"
                      icon={<InfoCircleOutlined />}
                      onClick={(e) => onExpand(record, e)}
                      style={{ color: colors.primary }}
                    />
                  ) : (
                    <Button
                      type="text"
                      icon={<InfoCircleOutlined />}
                      onClick={(e) => onExpand(record, e)}
                    />
                  ),
              }}
            />
          </TabPane>
        </Tabs>

        <Divider style={{ margin: "16px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(0, 0, 0, 0.45)",
            fontSize: "12px",
          }}
        >
          <div>
            Mostrando{" "}
            {activeTab === "facturas"
              ? filteredFacturas.length
              : filteredServicios.length}{" "}
            de{" "}
            {activeTab === "facturas"
              ? facturas.length
              : serviciosTecnicos.length}{" "}
            registros
          </div>
          <div>Última actualización: {new Date().toLocaleTimeString()}</div>
        </div>
      </Card>
    </div>
  );
};

export default ListaFacturacionVentas;
