// src/pages/PagosCompras.js
import { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Card,
  Space,
  Spin,
  Empty,
  Input,
  Button,
  Row,
  Col,
  Statistic,
  Tag,
  Divider,
  Alert,
  Select,
} from "antd";
import {
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SearchOutlined,
  SyncOutlined,
  BankOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
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

const PagosCompras = () => {
  const [abonos, setAbonos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredAbonos, setFilteredAbonos] = useState([]);
  const [dateFilter, setDateFilter] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50"],
      showTotal: (total) => `Total: ${total} registros`,
    },
  });

  useEffect(() => {
    fetchAbonos();
  }, []);

  const fetchAbonos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("https://cimove-backend.onrender.com/api/abonos");
      setAbonos(res.data);
      setFilteredAbonos(res.data);
    } catch (error) {
      console.error("Error al obtener abonos:", error);
      setError(
        "No se pudieron cargar los datos de pagos. Por favor, intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Filtrar abonos cuando cambia el texto de búsqueda o el filtro de fecha
  useEffect(() => {
    const filtered = abonos.filter((abono) => {
      const matchesSearch =
        searchText === "" ||
        abono.id_abonofactura.toString().includes(searchText) ||
        abono.id_facturaproveedor_abonofactura.toString().includes(searchText);

      const matchesDate =
        !dateFilter ||
        (dateFilter === "thisMonth" &&
          dayjs(abono.fecha_abonofactura).isSame(dayjs(), "month")) ||
        (dateFilter === "lastMonth" &&
          dayjs(abono.fecha_abonofactura).isSame(
            dayjs().subtract(1, "month"),
            "month"
          )) ||
        (dateFilter === "thisYear" &&
          dayjs(abono.fecha_abonofactura).isSame(dayjs(), "year"));

      return matchesSearch && matchesDate;
    });

    setFilteredAbonos(filtered);
  }, [searchText, dateFilter, abonos]);

  // Formatear moneda
  const formatCurrency = (amount) => {
    if (amount == null || isNaN(amount)) return "-";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("COP", "$");
  };

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const totalPagos = filteredAbonos.length;
    const montoTotal = filteredAbonos.reduce(
      (sum, abono) => sum + Number(abono.monto_abonofactura || 0),
      0
    );
    const pagoPromedio = totalPagos > 0 ? montoTotal / totalPagos : 0;

    // Encontrar el pago más reciente
    let pagoReciente = null;
    if (filteredAbonos.length > 0) {
      pagoReciente = filteredAbonos.reduce((latest, current) => {
        return dayjs(current.fecha_abonofactura).isAfter(
          dayjs(latest.fecha_abonofactura)
        )
          ? current
          : latest;
      }, filteredAbonos[0]);
    }

    return {
      totalPagos,
      montoTotal,
      pagoPromedio,
      pagoReciente,
    };
  };

  const estadisticas = calcularEstadisticas();

  // Manejar cambios en la tabla
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });
  };

  const columns = [
    {
      title: "ID Abono",
      dataIndex: "id_abonofactura",
      key: "id_abonofactura",
      width: 100,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          {id}
        </Text>
      ),
    },
    {
      title: "ID Factura",
      dataIndex: "id_facturaproveedor_abonofactura",
      key: "id_facturaproveedor_abonofactura",
      width: 120,
      render: (id) => (
        <Tag color={colors.accent}>
          <FileTextOutlined style={{ marginRight: 4 }} />
          {id}
        </Tag>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "fecha_abonofactura",
      key: "fecha_abonofactura",
      width: 150,
      sorter: (a, b) =>
        new Date(a.fecha_abonofactura) - new Date(b.fecha_abonofactura),
      render: (fecha) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <CalendarOutlined style={{ color: colors.text, fontSize: "12px" }} />
          <Text>{fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-"}</Text>
        </div>
      ),
    },
    {
      title: "Monto",
      dataIndex: "monto_abonofactura",
      key: "monto_abonofactura",
      align: "right",
      sorter: (a, b) => a.monto_abonofactura - b.monto_abonofactura,
      render: (monto) => (
        <Text strong style={{ color: colors.secondary }}>
          {formatCurrency(monto)}
        </Text>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      width: 120,
      render: () => <Tag color="success">Completado</Tag>,
    },
  ];

  return (
    <div style={{ padding: "16px", backgroundColor: colors.background }}>
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
            <BankOutlined style={{ marginRight: "8px" }} />
            Pagos de Compras
          </Title>

          <Button
            icon={<SyncOutlined spin={loading} />}
            onClick={fetchAbonos}
            size="small"
          >
            Actualizar
          </Button>
        </div>

        <Text
          type="secondary"
          style={{ marginBottom: "16px", display: "block" }}
        >
          Registro de abonos realizados a proveedores
        </Text>

        {/* Tarjetas de estadísticas */}
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
                title="Total Pagos"
                value={estadisticas.totalPagos}
                prefix={<FileTextOutlined style={{ color: colors.primary }} />}
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
                value={formatCurrency(estadisticas.montoTotal)}
                prefix={<DollarOutlined style={{ color: colors.secondary }} />}
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
                borderLeft: `3px solid ${colors.accent}`,
              }}
            >
              <Statistic
                title="Pago Promedio"
                value={formatCurrency(estadisticas.pagoPromedio)}
                prefix={<ArrowUpOutlined style={{ color: colors.accent }} />}
                valueStyle={{ color: colors.accent, fontSize: "18px" }}
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
                title="Último Pago"
                value={
                  estadisticas.pagoReciente
                    ? formatCurrency(
                        estadisticas.pagoReciente.monto_abonofactura
                      )
                    : "-"
                }
                prefix={<CalendarOutlined style={{ color: colors.warning }} />}
                valueStyle={{ color: colors.warning, fontSize: "18px" }}
              />
              {estadisticas.pagoReciente && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(0, 0, 0, 0.45)",
                    marginTop: "4px",
                  }}
                >
                  {dayjs(estadisticas.pagoReciente.fecha_abonofactura).format(
                    "DD/MM/YYYY"
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Filtros */}
        <Row gutter={[12, 12]} style={{ marginBottom: "16px" }}>
          <Col xs={24} md={16}>
            <Input
              placeholder="Buscar por ID de abono o factura..."
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
              placeholder="Filtrar por fecha"
              value={dateFilter}
              onChange={setDateFilter}
              style={{ width: "100%" }}
              allowClear
              size="middle"
            >
              <Option value="thisMonth">Este mes</Option>
              <Option value="lastMonth">Mes anterior</Option>
              <Option value="thisYear">Este año</Option>
            </Select>
          </Col>
        </Row>

        {/* Mensaje de error */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}

        {/* Tabla de abonos */}
        {loading && abonos.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px 0",
            }}
          >
            <Spin size="large" tip="Cargando pagos..." />
          </div>
        ) : filteredAbonos.length === 0 ? (
          <Empty
            description="No se encontraron pagos con los criterios de búsqueda"
            style={{ margin: "40px 0" }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredAbonos}
            rowKey="id_abonofactura"
            loading={loading}
            onChange={handleTableChange}
            pagination={tableParams.pagination}
            size="middle"
            scroll={{ x: 800 }}
          />
        )}

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
            Mostrando {filteredAbonos.length} de {abonos.length} pagos
          </div>
          <div>Última actualización: {new Date().toLocaleTimeString()}</div>
        </div>
      </Card>
    </div>
  );
};

export default PagosCompras;
