import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Tooltip,
  message,
  Select,
  Modal,
  Row,
  Col,
  Tag
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
  AppstoreAddOutlined
} from "@ant-design/icons";

const ListaProveedores = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchTipo, setSearchTipo] = useState("");
  const [searchEstado, setSearchEstado] = useState("");
  const [tiposProveedor, setTiposProveedor] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTipo, setNewTipo] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtener datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providersRes, typesRes] = await Promise.all([
          axios.get("http://localhost:4000/api/proveedores/all"), // Cambiado a /all
          axios.get("http://localhost:4000/api/proveedores/tipos")
        ]);
        
        setData(providersRes.data);
        setFilteredData(providersRes.data);
        setTiposProveedor(typesRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        message.error("Error al cargar los proveedores");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar proveedores
  useEffect(() => {
    let filtered = [...data];

    if (searchText) {
      filtered = filtered.filter(item =>
        item.nombre_proveedor?.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.representante_proveedor && item.representante_proveedor.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (searchId) {
      filtered = filtered.filter(item =>
        item.id_proveedor?.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    if (searchTipo) {
      filtered = filtered.filter(item =>
        item.nombre_tipoproveedor === searchTipo
      );
    }

    if (searchEstado) {
      filtered = filtered.filter(item =>
        item.estado_proveedor === searchEstado
      );
    }

    setFilteredData(filtered);
  }, [searchText, searchId, searchTipo, searchEstado, data]);

  // Funciones CRUD
  const handleUpdate = (record) => {
    navigate(`/actualizar-proveedor/${record.id_proveedor}`);
  };

  const handleViewDetails = (record) => {
    navigate(`/proveedores/${record.id_proveedor}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/proveedores/eliminar/${id}`); // Cambiado a PUT
      message.success("Proveedor desactivado exitosamente");
      setData(prev => prev.map(p => 
        p.id_proveedor === id ? {...p, estado_proveedor: 'I'} : p
      ));
    } catch (error) {
      message.error("Error al desactivar el proveedor");
    }
  };

  // Crear nuevo tipo de proveedor
  const handleCreateTipo = async () => {
    if (!newTipo.trim()) {
      message.error("El nombre del tipo no puede estar vacío");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/proveedores/tipos", {
        nombre_tipoproveedor: newTipo,
      });

      message.success("Tipo de proveedor creado exitosamente");
      setIsModalVisible(false);
      setNewTipo("");

      // Recargar los tipos
      const typesRes = await axios.get("http://localhost:4000/api/proveedores/tipos");
      setTiposProveedor(typesRes.data);
    } catch (error) {
      message.error("Error al crear el tipo de proveedor");
      console.error(error);
    }
  };

  // Resetear todos los filtros
  const resetFilters = () => {
    setSearchText("");
    setSearchId("");
    setSearchTipo("");
    setSearchEstado("");
  };

  // Columnas de la tabla
  const columns = [
    {
      title: "ID",
      dataIndex: "id_proveedor",
      sorter: (a, b) => a.id_proveedor?.localeCompare(b.id_proveedor),
      width: 120,
    },
    {
      title: "Nombre",
      dataIndex: "nombre_proveedor",
      sorter: (a, b) => a.nombre_proveedor?.localeCompare(b.nombre_proveedor),
    },
    {
      title: "Tipo",
      dataIndex: "nombre_tipoproveedor",
      //render: (text) => text ? <Tag color="blue">{text}</Tag> : '-',
      width: 150,
    },
    {
      title: "Teléfono",
      dataIndex: "telefono_proveedor",
      width: 150,
    },
    {
      title: "Estado",
      dataIndex: "estado_proveedor",
      render: (text) => (
        <Tag color={text === 'A' ? 'green' : 'red'}>
          {text === 'A' ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => handleUpdate(record)}
            />
          </Tooltip>
          <Tooltip title="Detalles">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#52c41a" }} />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Popconfirm
            title={`¿Seguro que deseas ${record.estado_proveedor === 'A' ? 'desactivar' : 'activar'} este proveedor?`}
            onConfirm={() => handleDelete(record.id_proveedor)}
            okText="Sí"
            cancelText="No"
          >
            <Tooltip title={record.estado_proveedor === 'A' ? 'Desactivar' : 'Activar'}>
              <Button 
                type="text" 
                danger={record.estado_proveedor === 'A'} 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Lista de Proveedores
      </h1>

      {/* Filtros */}
      <div style={{ marginBottom: 16, background: "#fafafa", padding: 16, borderRadius: 8 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="Buscar por ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              allowClear
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Buscar por nombre"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Filtrar por tipo"
              value={searchTipo}
              onChange={setSearchTipo}
              style={{ width: "100%" }}
              allowClear
              options={tiposProveedor?.map(tipo => ({
                value: tipo.nombre_tipoproveedor,
                label: tipo.nombre_tipoproveedor
              }))}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Filtrar por estado"
              value={searchEstado}
              onChange={setSearchEstado}
              style={{ width: "100%" }}
              allowClear
              options={[
                { value: "A", label: "Activo" },
                { value: "I", label: "Inactivo" }
              ]}
            />
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: 16 }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={resetFilters}
          >
            Limpiar filtros
          </Button>
        </Row>
      </div>

      {/* Botones de acción */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/registro-proveedor")}
        >
          Añadir Proveedor
        </Button>
        <Button
          type="default"
          icon={<AppstoreAddOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Añadir Tipo de Proveedor
        </Button>
      </div>

      {/* Tabla de proveedores */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id_proveedor"
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => `Total: ${total} proveedores`
        }}
        locale={{
          emptyText: "No hay proveedores registrados"
        }}
      />

    
      <Modal
        title="Crear Nuevo Tipo de Proveedor"
        visible={isModalVisible}
        onOk={handleCreateTipo}
        onCancel={() => setIsModalVisible(false)}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nombre del tipo de proveedor"
          value={newTipo}
          onChange={(e) => setNewTipo(e.target.value)}
          onPressEnter={handleCreateTipo}
        />
      </Modal>
    </div>
  );
};

export default ListaProveedores;
