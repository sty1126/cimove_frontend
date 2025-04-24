import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  Card,
  Tabs,
  Tag,
  Typography,
  Spin,
  Select,
  Row,
  Col,
  Statistic,
  Divider,
  Space,
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
      const resFacturas = await fetch("http://localhost:4000/api/factura");
      const dataFacturas = await resFacturas.json();
      setFacturas(Array.isArray(dataFacturas) ? dataFacturas : [dataFacturas]);
      setFilteredFacturas(
        Array.isArray(dataFacturas) ? dataFacturas : [dataFacturas]
      );

      // Cargar servicios técnicos
      const resServicios = await fetch(
        "http://localhost:4000/api/serviciotecnico"
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
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
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
    switch (estado.toUpperCase()) {
      case "EN_DIAGNOSTICO":
        return "processing";
      case "COMPLETADO":
        return "success";
      case "PENDIENTE":
        return "warning";
      case "CANCELADO":
        return "error";
      default:
        return "default";
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
      (sum, factura) => sum + factura.total_factura,
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
        s.estadotecnico_serviciotecnico === "EN_DIAGNOSTICO"
    ).length;
    const serviciosCompletados = filteredServicios.filter(
      (s) => s.estadotecnico_serviciotecnico === "COMPLETADO"
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
          {id}
        </Text>
      ),
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
    },
    {
      title: "Cliente",
      dataIndex: "email_cliente",
      key: "email_cliente",
      render: (email, record) => (
        <div>
          <div>{email || `Cliente ID: ${record.id_cliente_factura}`}</div>
          <div style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.45)" }}>
            <UserOutlined style={{ marginRight: "4px" }} />
            ID: {record.id_cliente_factura}
          </div>
        </div>
      ),
    },
    {
      title: "Producto",
      dataIndex: "nombre_producto",
      key: "nombre_producto",
      ellipsis: true,
      render: (nombre) => nombre || "Múltiples productos",
    },
    {
      title: "Total",
      dataIndex: "total_factura",
      key: "total_factura",
      align: "right",
      sorter: (a, b) => a.total_factura - b.total_factura,
      render: (total) => (
        <Text strong style={{ color: colors.secondary }}>
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
          {id}
        </Text>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "fecha_serviciotecnico",
      key: "fecha_serviciotecnico",
      width: 100,
      render: (fecha) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <CalendarOutlined style={{ fontSize: "12px", color: colors.text }} />
          {formatDate(fecha)}
        </div>
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre_serviciotecnico",
      key: "nombre_serviciotecnico",
      ellipsis: true,
      render: (nombre, record) => (
        <div>
          <div style={{ fontWeight: "500" }}>{nombre}</div>
          {record.descripcion_serviciotecnico && (
            <div style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.45)" }}>
              {record.descripcion_serviciotecnico}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Cliente",
      dataIndex: "nombre_cliente",
      key: "nombre_cliente",
      render: (nombre, record) => (
        <div>
          <div>
            {nombre || `Cliente ID: ${record.id_cliente_serviciotecnico}`}
          </div>
          {record.email_cliente && (
            <div style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.45)" }}>
              <UserOutlined style={{ marginRight: "4px" }} />
              {record.email_cliente}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Costo",
      dataIndex: "costo_serviciotecnico",
      key: "costo_serviciotecnico",
      align: "right",
      sorter: (a, b) =>
        (a.costo_serviciotecnico || 0) - (b.costo_serviciotecnico || 0),
      render: (costo) =>
        costo ? (
          <Text strong style={{ color: colors.secondary }}>
            {formatCurrency(costo)}
          </Text>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Estado",
      dataIndex: "estadotecnico_serviciotecnico",
      key: "estadotecnico_serviciotecnico",
      width: 120,
      render: (estado) => (
        <Tag color={getEstadoServicioColor(estado)}>{estado}</Tag>
      ),
      filters: [
        { text: "En Diagnóstico", value: "EN_DIAGNOSTICO" },
        { text: "Completado", value: "COMPLETADO" },
        { text: "Pendiente", value: "PENDIENTE" },
        { text: "Cancelado", value: "CANCELADO" },
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
    <div style={{ padding: "16px", backgroundColor: "#f0f2f5" }}>
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
            <Row gutter={[12, 12]} style={{ marginBottom: "16px" }}>
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
              pagination={tableParams.pagination}
              scroll={{ x: 800 }}
              size="middle"
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
                  <Option value="EN_DIAGNOSTICO">En diagnóstico</Option>
                  <Option value="COMPLETADO">Completado</Option>
                  <Option value="PENDIENTE">Pendiente</Option>
                  <Option value="CANCELADO">Cancelado</Option>
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
              scroll={{ x: 900 }}
              size="middle"
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
