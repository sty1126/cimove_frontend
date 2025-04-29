"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Card,
  Button,
  Row,
  Col,
  Select,
  Input,
  Table,
  Space,
  Typography,
  Divider,
  InputNumber,
  Modal,
  Tabs,
  Badge,
  Spin,
  Empty,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  SearchOutlined,
  BarcodeOutlined,
  UserOutlined,
  DollarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  TagOutlined,
  AppstoreOutlined,
  InboxOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import SeleccionarClientePorSede from "./SeleccionarClientePorSede";

const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;
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

// Estilos adicionales
const additionalStyles = `
  .cart-table-row td {
    padding: 8px 8px;
    vertical-align: top;
  }
  .ant-table-cell {
    white-space: normal;
    word-break: break-word;
  }
`;

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [selectedSede, setSelectedSede] = useState("general");
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [codigoInput, setCodigoInput] = useState("");
  const [cliente, setCliente] = useState(null);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [bloquearSede, setBloquearSede] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clientesModal, setClientesModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clientesLoading, setClientesLoading] = useState(false);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [activeTab, setActiveTab] = useState("productos");
  const [showModalCliente, setShowModalCliente] = useState(false);

  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriasRes, sedesRes] = await Promise.all([
          axios.get("https://cimove-backend.onrender.com/api/categorias"),
          axios.get("https://cimove-backend.onrender.com/api/sedes"),
        ]);

        setCategorias(categoriasRes.data);
        setSedes(sedesRes.data);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        message.error("Error al cargar datos iniciales");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cargar productos cuando cambia la sede
  useEffect(() => {
    const fetchProductos = async () => {
      if (!selectedSede || selectedSede === "general") return;

      try {
        setLoading(true);
        const sede = sedes.find((s) => s.nombre_sede === selectedSede);
        if (!sede) return;

        const res = await axios.get(
          `http://localhost:4000/api/inventariolocal/sede/${sede.id_sede}`
        );

        const transformados = res.data.map((p) => ({
          id: p.id_producto,
          nombre: p.nombre_producto,
          codigo: p.id_producto,
          precio: p.precioventaact_producto,
          iva: p.precioventaact_producto * p.valoriva_producto,
          categoria: p.id_categoria_producto,
          stock: p.existencia_inventariolocal,
        }));

        setProductos(transformados);
      } catch (error) {
        console.error("Error cargando productos:", error);
        message.error("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [selectedSede, sedes]);

  // Bloquear cambio de sede si hay cliente o productos en carrito
  useEffect(() => {
    if (cliente || carrito.length > 0) {
      setBloquearSede(true);
    } else {
      setBloquearSede(false);
    }
  }, [cliente, carrito]);

  // Validar y procesar venta
  const validarYProcesarVenta = async () => {
    if (carrito.length === 0) {
      message.warning("El carrito está vacío");
      return;
    }

    const sede = sedes.find((s) => s.nombre_sede === selectedSede);
    if (!sede) {
      message.warning("Seleccione una sede válida");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:4000/api/inventariolocal/sede/${sede.id_sede}`
      );
      const inventario = res.data;

      const faltantes = carrito.filter((item) => {
        const stockProducto = inventario.find(
          (inv) => inv.id_producto === item.id
        );
        return (
          !stockProducto ||
          stockProducto.existencia_inventariolocal < item.cantidad
        );
      });

      if (faltantes.length > 0) {
        Modal.warning({
          title: "Stock insuficiente",
          content: (
            <div>
              <p>Los siguientes productos no tienen suficiente stock:</p>
              <ul>
                {faltantes.map((p) => (
                  <li key={p.id}>
                    {p.nombre} (Cantidad requerida: {p.cantidad})
                  </li>
                ))}
              </ul>
            </div>
          ),
        });
        setLoading(false);
        return;
      }

      // Agregar idSede a cada producto del carrito
      const carritoConSede = carrito.map((producto) => ({
        ...producto,
        idSede: sede.id_sede,
      }));

      navigate("/factura", {
        state: {
          clienteSeleccionado: cliente,
          subtotal,
          descuento,
          iva: totalIVA,
          total: totalFinal,
          carrito: carritoConSede,
        },
      });
    } catch (error) {
      console.error("Error al validar stock:", error);
      message.error("Ocurrió un error al validar el inventario");
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto al carrito
  const agregarProducto = (producto) => {
    const index = carrito.findIndex((item) => item.id === producto.id);
    if (index !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito[index].cantidad += 1;
      nuevoCarrito[index].iva = producto.iva;
      setCarrito(nuevoCarrito);
      message.success(`${producto.nombre} +1`, 1);
    } else {
      setCarrito([
        ...carrito,
        {
          id: producto.id,
          nombre: producto.nombre,
          codigo: producto.codigo,
          precio: producto.precio,
          cantidad: 1,
          iva: producto.iva,
        },
      ]);
      message.success(`${producto.nombre} agregado`, 1);
    }
  };

  // Actualizar cantidad de un producto en el carrito
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const nuevoCarrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    setCarrito(nuevoCarrito);
  };

  // Eliminar producto del carrito
  const eliminarProducto = (id) => {
    const productoAEliminar = carrito.find((item) => item.id === id);
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
    message.success(`${productoAEliminar?.nombre || "Producto"} eliminado`, 1);
  };

  // Buscar producto por código
  const buscarPorCodigo = async () => {
    if (!codigoInput.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:4000/api/productos/${codigoInput}`
      );

      const producto = res.data;
      const prodTransformado = {
        id: producto.id_producto,
        nombre: producto.nombre_producto,
        codigo: producto.codigo_producto,
        precio: producto.precioventaact_producto,
        iva: producto.precioventaact_producto * producto.valoriva_producto,
        categoria: producto.id_categoria_producto,
        stock: producto.existencia || 0,
      };

      agregarProducto(prodTransformado);
      setCodigoInput("");
    } catch (error) {
      message.error("Producto no encontrado");
      console.error("Error buscando producto:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter((p) => {
    const matchesCategoria =
      !filtroCategoria || p.categoria === filtroCategoria;
    const matchesBusqueda =
      !busquedaProducto.trim() ||
      p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
      p.codigo.toString().includes(busquedaProducto);
    return matchesCategoria && matchesBusqueda;
  });

  // Calcular totales
  const totalBruto = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const totalIVA = carrito.reduce(
    (acc, item) => acc + item.iva * item.cantidad,
    0
  );
  const subtotal = totalBruto;
  const totalFinal = subtotal - descuento;

  // Obtener un icono aleatorio para los productos
  const getProductIcon = (productId) => {
    const icons = [
      <ShoppingCartOutlined
        key="cart"
        style={{ fontSize: "40px", color: colors.primary }}
      />,
      <GiftOutlined
        key="gift"
        style={{ fontSize: "40px", color: colors.secondary }}
      />,
      <InboxOutlined
        key="inbox"
        style={{ fontSize: "40px", color: colors.accent }}
      />,
      <TagOutlined
        key="tag"
        style={{ fontSize: "40px", color: colors.warning }}
      />,
      <AppstoreOutlined
        key="appstore"
        style={{ fontSize: "40px", color: colors.primary }}
      />,
    ];

    // Usar el ID del producto para seleccionar un icono de manera determinista
    const iconIndex = productId % icons.length;
    return icons[iconIndex];
  };

  // Columnas para la tabla del carrito
  const columnasCarrito = [
    {
      title: "Producto",
      dataIndex: "nombre",
      key: "nombre",
      width: "40%", // Allocate more space for product names
      render: (text, record) => (
        <div
          style={{
            wordBreak: "break-word",
            whiteSpace: "normal",
            padding: "4px 0",
          }}
        >
          <Text strong style={{ lineHeight: "1.4", display: "block" }}>
            {text}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Código: {record.codigo}
          </Text>
        </div>
      ),
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      align: "right",
      width: "15%",
      render: (precio) => <Text>${precio.toFixed(2)}</Text>,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: "25%",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<MinusOutlined />}
            onClick={() => actualizarCantidad(record.id, record.cantidad - 1)}
            disabled={record.cantidad <= 1}
            size="small"
          />
          <InputNumber
            min={1}
            value={record.cantidad}
            onChange={(value) => actualizarCantidad(record.id, value)}
            style={{ width: "50px" }}
            size="small"
          />
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => actualizarCantidad(record.id, record.cantidad + 1)}
            size="small"
          />
        </Space>
      ),
    },
    {
      title: "Total",
      key: "total",
      align: "right",
      width: "15%",
      render: (_, record) => (
        <Text strong style={{ whiteSpace: "nowrap" }}>
          ${(record.precio * record.cantidad).toFixed(2)}
        </Text>
      ),
    },
    {
      title: "",
      key: "action",
      width: "5%",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => eliminarProducto(record.id)}
          size="small"
        />
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: colors.background }}>
      <style>{additionalStyles}</style>
      <Content style={{ padding: "20px" }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={2} style={{ margin: 0, color: colors.primary }}>
                  <ShoppingCartOutlined style={{ marginRight: "12px" }} />
                  Punto de Venta
                </Title>
                <Select
                  placeholder="Seleccionar sede"
                  value={selectedSede}
                  onChange={setSelectedSede}
                  style={{ width: 200 }}
                  disabled={bloquearSede}
                >
                  <Option value="general">Seleccionar sede</Option>
                  {sedes.map((s) => (
                    <Option key={s.id_sede} value={s.nombre_sede}>
                      {s.nombre_sede}
                    </Option>
                  ))}
                </Select>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          {/* Panel izquierdo: Productos */}
          <Col xs={24} lg={15}>
            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              bodyStyle={{ padding: "12px" }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                tabBarExtraContent={
                  <Space>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setFiltroCategoria(null);
                        setBusquedaProducto("");
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  </Space>
                }
              >
                <TabPane tab="Productos" key="productos">
                  <div style={{ marginBottom: "16px" }}>
                    <Input
                      placeholder="Buscar producto por nombre o código"
                      prefix={<SearchOutlined />}
                      value={busquedaProducto}
                      onChange={(e) => setBusquedaProducto(e.target.value)}
                      allowClear
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "16px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <Button
                      type={filtroCategoria === null ? "primary" : "default"}
                      onClick={() => setFiltroCategoria(null)}
                      style={
                        filtroCategoria === null
                          ? {
                              backgroundColor: colors.primary,
                              borderColor: colors.primary,
                            }
                          : {}
                      }
                    >
                      Todos
                    </Button>
                    {categorias.map((cat) => (
                      <Button
                        key={cat.id_categoria}
                        type={
                          filtroCategoria === cat.id_categoria
                            ? "primary"
                            : "default"
                        }
                        onClick={() => setFiltroCategoria(cat.id_categoria)}
                        style={
                          filtroCategoria === cat.id_categoria
                            ? {
                                backgroundColor: colors.primary,
                                borderColor: colors.primary,
                              }
                            : {}
                        }
                      >
                        {cat.descripcion_categoria}
                      </Button>
                    ))}
                  </div>

                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <Spin size="large" />
                    </div>
                  ) : productosFiltrados.length === 0 ? (
                    <Empty description="No hay productos disponibles" />
                  ) : (
                    <Row gutter={[12, 12]}>
                      {productosFiltrados.map((producto) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={producto.id}>
                          <Card
                            hoverable
                            style={{ height: "100%" }}
                            cover={
                              <div
                                style={{
                                  padding: "12px",
                                  textAlign: "center",
                                  height: "104px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#f5f5f5",
                                }}
                              >
                                {getProductIcon(producto.id)}
                              </div>
                            }
                            onClick={() => agregarProducto(producto)}
                          >
                            <Card.Meta
                              title={
                                <div
                                  style={{
                                    whiteSpace: "normal",
                                    minHeight: "40px",
                                    maxHeight: "60px",
                                    overflow: "visible",
                                    wordBreak: "break-word",
                                    lineHeight: "1.2",
                                  }}
                                >
                                  {producto.nombre}
                                </div>
                              }
                              description={
                                <div>
                                  <Text
                                    strong
                                    style={{ color: colors.primary }}
                                  >
                                    ${producto.precio.toFixed(2)}
                                  </Text>
                                  <br />
                                  <Text type="secondary">
                                    Stock: {producto.stock}
                                  </Text>
                                </div>
                              }
                            />
                            <div
                              style={{ marginTop: "8px", textAlign: "center" }}
                            >
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="small"
                                style={{
                                  backgroundColor: colors.secondary,
                                  borderColor: colors.secondary,
                                }}
                              >
                                Agregar
                              </Button>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </TabPane>
                <TabPane tab="Código" key="codigo">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "40px 0",
                    }}
                  >
                    <Title level={4}>Buscar por código</Title>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        maxWidth: "400px",
                        marginBottom: "20px",
                      }}
                    >
                      <Input
                        placeholder="Ingrese código del producto"
                        value={codigoInput}
                        onChange={(e) => setCodigoInput(e.target.value)}
                        onPressEnter={buscarPorCodigo}
                        prefix={<BarcodeOutlined />}
                        style={{ marginRight: "8px" }}
                      />
                      <Button
                        type="primary"
                        onClick={buscarPorCodigo}
                        icon={<PlusOutlined />}
                      >
                        Agregar
                      </Button>
                    </div>
                    <Button icon={<CameraOutlined />} size="large">
                      Escanear código
                    </Button>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          {/* Panel derecho: Carrito y totales */}
          <Col xs={24} lg={9}>
            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    <ShoppingCartOutlined
                      style={{ marginRight: "8px", color: colors.primary }}
                    />
                    Carrito
                  </span>
                  <Badge
                    count={carrito.length}
                    style={{ backgroundColor: colors.secondary }}
                  >
                    <Button
                      type="text"
                      icon={
                        <ShoppingCartOutlined style={{ fontSize: "18px" }} />
                      }
                      style={{
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                      }}
                    />
                  </Badge>
                </div>
              }
            >
              {/* Sección de cliente */}
              <div style={{ marginBottom: "16px" }}>
                <Card
                  size="small"
                  title={
                    <Space>
                      <UserOutlined style={{ color: colors.primary }} />
                      Cliente
                    </Space>
                  }
                  style={{ marginBottom: "16px" }}
                >
                  {cliente ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <Text strong>
                          {cliente.nombre_cliente ||
                            cliente.razonsocial_cliente ||
                            "Cliente"}
                        </Text>
                        <br />
                        <Text type="secondary">
                          {cliente.id_cliente} -{" "}
                          {cliente.descripcion_tipocliente || "Cliente"}
                        </Text>
                      </div>
                      <Button
                        type="text"
                        danger
                        onClick={() => setCliente(null)}
                      >
                        Cambiar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      icon={<UserOutlined />}
                      onClick={() => setShowModalCliente(true)}
                      style={{
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                        width: "100%",
                      }}
                    >
                      Seleccionar cliente
                    </Button>
                  )}
                </Card>
              </div>

              {/* Tabla de productos en carrito */}
              <div
                style={{
                  marginBottom: "16px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {carrito.length === 0 ? (
                  <Empty
                    description="Carrito vacío"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <Table
                    dataSource={carrito}
                    columns={columnasCarrito}
                    pagination={false}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 500 }}
                    style={{ width: "100%" }}
                    rowClassName={() => "cart-table-row"}
                  />
                )}
              </div>

              {/* Sección de totales */}
              <Card
                size="small"
                title={
                  <Space>
                    <DollarOutlined style={{ color: colors.primary }} />
                    Resumen
                  </Space>
                }
                style={{ marginBottom: "16px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <Text>Subtotal:</Text>
                  <Text>${subtotal.toFixed(2)}</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <Text>IVA:</Text>
                  <Text>${totalIVA.toFixed(2)}</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    alignItems: "center",
                  }}
                >
                  <Text>Descuento:</Text>
                  <InputNumber
                    min={0}
                    max={subtotal}
                    value={descuento}
                    onChange={(value) => {
                      // Ensure value is not greater than subtotal
                      const newValue =
                        value && value > subtotal ? subtotal : value;
                      setDescuento(newValue || 0);
                    }}
                    style={{ width: "100px" }}
                    prefix="$"
                    precision={2}
                    controls={true}
                    keyboard={false} // Prevents direct keyboard input of non-numeric values
                    parser={(value) => {
                      // Only allow numbers
                      return value ? Number(value.replace(/[^\d.]/g, "")) : 0;
                    }}
                  />
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Title level={4} style={{ margin: 0 }}>
                    Total:
                  </Title>
                  <Title level={4} style={{ margin: 0, color: colors.primary }}>
                    ${totalFinal.toFixed(2)}
                  </Title>
                </div>
              </Card>

              {/* Botón de procesar venta */}
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                block
                onClick={validarYProcesarVenta}
                disabled={carrito.length === 0}
                loading={loading}
                style={{
                  backgroundColor: colors.success,
                  borderColor: colors.success,
                  height: "50px",
                  fontSize: "16px",
                }}
              >
                Procesar Venta
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Modal de selección de cliente - MANTENIDO EXACTAMENTE COMO ESTABA */}
      <SeleccionarClientePorSede
        show={showModalCliente}
        handleClose={() => setShowModalCliente(false)}
        setCliente={setCliente}
        selectedSede={selectedSede}
        sedes={sedes}
      />
    </Layout>
  );
};

export default Ventas;
