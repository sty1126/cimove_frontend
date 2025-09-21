import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Typography, Space } from "antd";
import { FileSearch, User, Building, Database } from "lucide-react";
import axios from "axios";

const { Title } = Typography;

const Auditoria = () => {
  const [auditorias, setAuditorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://cimove-backend.onrender.com/api/auditoria");
        setAuditorias(res.data);
      } catch (err) {
        console.error("Error cargando auditorías", err);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: <Space><FileSearch size={16}/> ID</Space>,
      dataIndex: "id_auditoria",
      key: "id_auditoria",
    },
    {
      title: <Space><Database size={16}/> Fecha</Space>,
      dataIndex: "fecha_auditoria",
      key: "fecha_auditoria",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Acción",
      dataIndex: "accion_auditoria",
      key: "accion_auditoria",
      render: (accion) => (
        <Tag color={accion === "INSERT" ? "green" : "blue"}>{accion}</Tag>
      ),
    },
    {
      title: "Movimiento",
      dataIndex: "nom_tipomov",
      key: "nom_tipomov",
    },
    {
      title: <Space><Building size={16}/> Sede</Space>,
      dataIndex: "nombre_sede",
      key: "nombre_sede",
    },
    {
      title: <Space><User size={16}/> Empleado</Space>,
      dataIndex: "nombre_empleado",
      key: "nombre_empleado",
      render: (empleado) =>
        empleado ? (
          <Tag color="blue">{empleado}</Tag>
        ) : (
          <Tag color="red">No asignado</Tag>
        ),
    },
    {
      title: "Usuario",
      dataIndex: "username_usuario",
      key: "username_usuario",
      render: (user) =>
        user ? <Tag color="geekblue">{user}</Tag> : <Tag color="red">N/A</Tag>,
    },
    {
      title: "Detalle",
      dataIndex: "detalle_auditoria",
      key: "detalle_auditoria",
      render: (detalle) => {
        try {
          const parsed = JSON.parse(detalle);
          return (
            <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
              <div><b>Producto:</b> {parsed.idProducto}</div>
              <div><b>Cantidad:</b> {parsed.cantidad}</div>
              <div><b>Origen:</b> {parsed.sedeOrigen}</div>
              {parsed.sedeDestino && <div><b>Destino:</b> {parsed.sedeDestino}</div>}
              {parsed.cliente && <div><b>Cliente:</b> {parsed.cliente}</div>}
              {parsed.proveedor && <div><b>Proveedor:</b> {parsed.proveedor}</div>}
            </div>
          );
        } catch {
          return detalle;
        }
      },
    },
  ];

  return (
    <Card
      bordered={false}
      style={{ borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
    >
      <Title
        level={3}
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#1677ff",
        }}
      >
        📑 Auditoría de Empleados
      </Title>

      <Table
        columns={columns}
        dataSource={auditorias}
        rowKey="id_auditoria"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default Auditoria;
