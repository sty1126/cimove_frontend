import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, message } from "antd";
import axios from "axios";

const DetallesProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/proveedores/${id}`);
        setProveedor(response.data);
      } catch (error) {
        message.error("Error al obtener los detalles del proveedor");
      } finally {
        setLoading(false);
      }
    };
    fetchProveedor();
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  if (!proveedor) return <p>No se encontró el proveedor</p>;

  return (
    <Card title={`Detalles del Proveedor: ${proveedor.nombre_proveedor}`} style={{ maxWidth: 600, margin: "20px auto" }}>
      <p><strong>ID:</strong> {proveedor.id_proveedor}</p>
      <p><strong>Nombre:</strong> {proveedor.nombre_proveedor}</p>
      <p><strong>Teléfono:</strong> {proveedor.telefono_proveedor}</p>
      <p><strong>Dirección:</strong> {proveedor.direccion_proveedor}</p>
      <p><strong>Correo:</strong> {proveedor.email_proveedor}</p>
      <p><strong>Tipo de Proveedor:</strong> {proveedor.nombre_tipoproveedor}</p>
      <div style={{ marginTop: 20 }}>
        <Button type="primary" onClick={() => navigate(`/actualizar-proveedor/${proveedor.id_proveedor}`)}>Editar</Button>
        <Button style={{ marginLeft: 10 }} onClick={() => navigate("/proveedores")}>Volver</Button>
      </div>
    </Card>
  );
};

export default DetallesProveedor;
