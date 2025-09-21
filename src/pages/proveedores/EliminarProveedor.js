"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  Button,
  Card,
  Typography,
  Divider,
  Space,
  message,
  Spin,
  Checkbox,
  Input,
  Empty,
  Alert,
  Row,
  Col,
} from "antd";
import {
  CloseOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  SearchOutlined,
  ShoppingOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  obtenerProductoPorId,
  obtenerProveedoresAsociados,
} from "../../services/proveedoresService";
import axios from "axios";

const { Title, Text } = Typography;
const BASE_URL = "http://localhost:4000/api";

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
};

// Implementación correcta de eliminarProveedorDeProducto
const eliminarProveedorDeProducto = async (idProveedor, idProducto) => {
  try {
    const response = await axios.put(`${BASE_URL}/proveedor-producto/inactivar`, {
      id_proveedor: idProveedor,
      id_producto: idProducto
    });
    
    return response.data;
  } catch (error) {
    console.error("Error en eliminarProveedorDeProducto:", error.response || error);
    throw new Error(error.response?.data?.error || "Error al eliminar la asociación");
  }
};

const EliminarProveedores = () => {
  // Asegúrate de que estás extrayendo el parámetro correctamente
  // según cómo esté definida la ruta en tu react-router
  const { idProducto } = useParams(); // Debería coincidir con cómo está definido en tus rutas
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Validación adicional del ID de producto
        if (!idProducto) {
          throw new Error("ID de producto no válido o no encontrado");
        }

        const productoData = await obtenerProductoPorId(idProducto);
        setProducto(productoData);

        const asociados = await obtenerProveedoresAsociados(idProducto);
        setProveedores(asociados);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        message.error(`Error al cargar datos iniciales: ${error.message}`);
        setError(error.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idProducto]);

  // Resto del código sigue igual...

  // Filtrar proveedores según el texto de búsqueda
  const proveedoresFiltrados = proveedores.filter(
    (prov) =>
      prov.nombre_proveedor?.toLowerCase().includes(searchText.toLowerCase()) ||
      String(prov.id_proveedor).toLowerCase().includes(searchText.toLowerCase()) ||
      String(prov.telefono_proveedor || "").toLowerCase().includes(searchText.toLowerCase()) ||
      String(prov.email_proveedor || "").toLowerCase().includes(searchText.toLowerCase())
  );

  // Alternar selección de proveedor
  const toggleProveedor = (idProveedor) => {
    setProveedoresSeleccionados((prev) =>
      prev.includes(idProveedor)
        ? prev.filter((id) => id !== idProveedor)
        : [...prev, idProveedor]
    );
  };

  // Seleccionar/deseleccionar todos los proveedores
  const toggleSelectAll = () => {
    if (proveedoresSeleccionados.length === proveedoresFiltrados.length) {
      setProveedoresSeleccionados([]);
    } else {
      setProveedoresSeleccionados(
        proveedoresFiltrados.map((prov) => prov.id_proveedor)
      );
    }
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (proveedoresSeleccionados.length === 0) {
      message.warning("Seleccione al menos un proveedor para eliminar");
      return;
    }

    if (!idProducto) {
      message.error("ID de producto no disponible");
      return;
    }

    setSubmitting(true);
    try {
      // Mostrar mensaje de procesamiento
      message.loading({
        content: 'Eliminando relaciones...',
        key: 'processing',
        duration: 0,
      });

      // Crear un array para almacenar resultados
      const results = [];
      
      // Procesar uno por uno para mejor manejo de errores
      for (const idProveedor of proveedoresSeleccionados) {
        try {
          const result = await eliminarProveedorDeProducto(idProveedor, idProducto);
          results.push({ idProveedor, success: true, result });
        } catch (err) {
          console.error(`Error al eliminar relación con proveedor ${idProveedor}:`, err);
          results.push({ idProveedor, success: false, error: err.message });
        }
      }
      
      // Cerrar mensaje de procesamiento
      message.destroy('processing');
      
      // Contar éxitos y errores
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;
      
      // Mostrar mensaje apropiado
      if (successCount === results.length) {
        message.success({
          content: `${successCount} relaciones eliminadas correctamente`,
          icon: <CheckCircleOutlined />,
          style: { marginTop: "20px" },
        });
        
        // Actualizar lista de proveedores
        const nuevosProveedores = proveedores.filter(
          prov => !proveedoresSeleccionados.includes(prov.id_proveedor)
        );
        setProveedores(nuevosProveedores);
        setProveedoresSeleccionados([]);
        
        // Opcional: redirigir después de un éxito completo
        setTimeout(() => {
          navigate("/inventario");
        }, 1500);
      } else if (successCount > 0) {
        message.warning({
          content: `Se eliminaron ${successCount} relaciones, pero ${failCount} fallaron`,
          duration: 5,
        });
        
        // Actualizar parcialmente la lista si algunos tuvieron éxito
        const proveedoresEliminados = results
          .filter(r => r.success)
          .map(r => r.idProveedor);
          
        const nuevosProveedores = proveedores.filter(
          prov => !proveedoresEliminados.includes(prov.id_proveedor)
        );
        setProveedores(nuevosProveedores);
        setProveedoresSeleccionados(prev => prev.filter(id => !proveedoresEliminados.includes(id)));
      } else {
        message.error({
          content: "No se pudo eliminar ninguna relación",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Error general al eliminar relaciones:", error);
      message.error(
        "Error al eliminar relaciones: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Columnas para la tabla de proveedores
  const columns = [
    {
      title: (
        <Checkbox
          checked={
            proveedoresFiltrados.length > 0 &&
            proveedoresSeleccionados.length === proveedoresFiltrados.length
          }
          indeterminate={
            proveedoresSeleccionados.length > 0 &&
            proveedoresSeleccionados.length < proveedoresFiltrados.length
          }
          onChange={toggleSelectAll}
          disabled={submitting}
        />
      ),
      dataIndex: "id_proveedor",
      key: "seleccionar",
      width: 60,
      align: "center",
      render: (id) => (
        <Checkbox
          checked={proveedoresSeleccionados.includes(id)}
          onChange={() => toggleProveedor(id)}
          disabled={submitting}
        />
      ),
    },
    {
      title: "ID",
      dataIndex: "id_proveedor",
      key: "id_proveedor",
      width: 120,
      render: (id) => (
        <Text strong style={{ color: colors.primary }}>
          {id}
        </Text>
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre_proveedor",
      key: "nombre_proveedor",
      render: (nombre) => <Text strong>{nombre}</Text>,
    },
    {
      title: "Teléfono",
      dataIndex: "telefono_proveedor",
      key: "telefono_proveedor",
      width: 150,
      render: (telefono) => (
        <Space>
          <PhoneOutlined style={{ color: colors.primary }} />
          <Text>{telefono || "No disponible"}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email_proveedor",
      key: "email_proveedor",
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: colors.primary }} />
          <Text>{email || "No disponible"}</Text>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Cargando datos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert 
          type="error"
          message="Error al cargar datos" 
          description={error}
          showIcon
          action={
            <Button type="primary" onClick={() => navigate("/inventario")}>
              Volver al inventario
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Botón de volver */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/inventario")}
          style={{ marginBottom: "16px" }}
        >
          Volver al inventario
        </Button>

        <Card
          bordered={false}
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={2} style={{ color: colors.danger, margin: 0 }}>
              <DeleteOutlined style={{ marginRight: "12px" }} />
              Eliminar Relaciones de Proveedores
            </Title>
            <Text type="secondary">
              Seleccione los proveedores que desea desasociar del producto
            </Text>
          </div>

          {producto && (
            <Alert
              message={
                <Space>
                  <ShoppingOutlined style={{ color: colors.primary }} />
                  <Text strong>Producto: {producto.nombre_producto}</Text>
                </Space>
              }
              description={
                <div style={{ marginLeft: "24px" }}>
                  <Text>{producto.descripcion_producto}</Text>
                </div>
              }
              type="info"
              showIcon={false}
              style={{
                marginBottom: "24px",
                borderLeft: `4px solid ${colors.primary}`,
              }}
            />
          )}

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <Row style={{ marginBottom: "16px" }}>
            <Col xs={24} md={12}>
              <Input
                placeholder="Buscar proveedor..."
                prefix={<SearchOutlined style={{ color: colors.primary }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: "400px" }}
                allowClear
              />
            </Col>
            <Col xs={24} md={12} style={{ textAlign: "right" }}>
              <Text type="secondary">
                <InfoCircleOutlined style={{ marginRight: "8px" }} />
                {proveedoresSeleccionados.length} proveedores seleccionados para
                eliminar
              </Text>
            </Col>
          </Row>

          {proveedoresFiltrados.length > 0 ? (
            <Table
              columns={columns}
              dataSource={proveedoresFiltrados}
              rowKey="id_proveedor"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
              }}
              loading={submitting}
              size="middle"
              style={{ marginBottom: "24px" }}
            />
          ) : (
            <Empty
              description={
                <Space direction="vertical" align="center">
                  <Text type="secondary">
                    No hay proveedores asociados a este producto
                  </Text>
                  {searchText && (
                    <Button type="link" onClick={() => setSearchText("")}>
                      Limpiar búsqueda
                    </Button>
                  )}
                </Space>
              }
              style={{ margin: "40px 0" }}
            />
          )}

          <Divider
            style={{ margin: "12px 0 24px", borderColor: colors.light }}
          />

          <div
            style={{ display: "flex", justifyContent: "center", gap: "16px" }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="large"
              onClick={handleSubmit}
              loading={submitting}
              style={{
                minWidth: "180px",
              }}
              disabled={proveedoresSeleccionados.length === 0}
            >
              Eliminar Relaciones
            </Button>
            <Button
              icon={<CloseOutlined />}
              size="large"
              onClick={() => navigate("/inventario")}
              style={{ minWidth: "120px" }}
              disabled={submitting}
            >
              Cancelar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EliminarProveedores;
