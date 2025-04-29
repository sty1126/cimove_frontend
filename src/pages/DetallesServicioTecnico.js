import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DetallesServicioTecnico = () => {
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sedes, setSedes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedSede, setSelectedSede] = useState("");

  useEffect(() => {
    if (!id) {
      console.error("ID no disponible");
      return;
    }

    const fetchData = async () => {
      try {
        const [sedesRes, proveedoresRes, servicioRes] = await Promise.all([
          axios.get("http://localhost:4000/api/sedes/"),
          axios.get("http://localhost:4000/api/proveedores/all"),
          axios.get(`http://localhost:4000/api/serviciotecnico/${id}`),
        ]);

        console.log("Datos de las sedes:", sedesRes.data);
        console.log("Datos de los proveedores:", proveedoresRes.data);
        console.log("Datos del servicio técnico:", servicioRes.data);

        setSedes(sedesRes.data);
        setProveedores(proveedoresRes.data);
        setServicio(servicioRes.data);
        setFormData({
          idCliente: servicioRes.data.id_cliente_serviciotecnico || "",
          idSede: servicioRes.data.id_sede_serviciotecnico || "",
          aplicaProveedor:
            servicioRes.data.id_proveedor_serviciotecnico !== "PROV_TEMP_123",
          idProveedor:
            servicioRes.data.id_proveedor_serviciotecnico !== "PROV_TEMP_123"
              ? servicioRes.data.id_proveedor_serviciotecnico
              : "",
          nombreServicio: servicioRes.data.nombre_serviciotecnico || "",
          descripcionServicio:
            servicioRes.data.descripcion_serviciotecnico || "",
          fechaServicio: servicioRes.data.fecha_serviciotecnico
            ? servicioRes.data.fecha_serviciotecnico.split("T")[0]
            : "",
          fechaEntrega: servicioRes.data.fecha_entrega_serviciotecnico
            ? servicioRes.data.fecha_entrega_serviciotecnico.split("T")[0]
            : "",
          tipoDano: servicioRes.data.tipo_dano_serviciotecnico || "",
          claveDispositivo:
            servicioRes.data.clave_dispositivo_serviciotecnico || "",
          costo: servicioRes.data.costo_serviciotecnico || "",
          abono: servicioRes.data.abono_serviciotecnico || "",
          garantiaAplica:
            servicioRes.data.garantia_aplica_serviciotecnico || false,
          fechaGarantia: servicioRes.data.fecha_garantia_serviciotecnico
            ? servicioRes.data.fecha_garantia_serviciotecnico.split("T")[0]
            : "",
          numeroContactoAlternativo:
            servicioRes.data.numero_contacto_alternativo_servicio || "",
          autorizado: servicioRes.data.autorizado_serviciotecnico || false,
        });

        setSelectedSede(servicioRes.data.id_sede_serviciotecnico);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("Hubo un problema cargando los datos.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!servicio) {
    return <div>No se encontró el servicio técnico.</div>;
  }

  return (
    <div className="container">
      <h2>Detalles del Servicio Técnico</h2>
      <div className="mb-3">
        <strong>Id Servicio Técnico:</strong> {servicio.id_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Id Sede:</strong> {servicio.id_sede_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Id Proveedor:</strong> {servicio.id_proveedor_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Id Cliente:</strong> {servicio.id_cliente_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Id Factura:</strong> {servicio.id_factura_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Abono:</strong> {servicio.abono_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Autorizado:</strong>{" "}
        {servicio.autorizado_serviciotecnico ? "Sí" : "No"}
      </div>
      <div className="mb-3">
        <strong>Clave Dispositivo:</strong>{" "}
        {servicio.clave_dispositivo_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Costo:</strong> {servicio.costo_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Descripción:</strong> {servicio.descripcion_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Estado:</strong> {servicio.estado_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Estado Técnico:</strong>{" "}
        {servicio.estadotecnico_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Fecha Entrega:</strong>{" "}
        {new Date(servicio.fecha_entrega_serviciotecnico).toLocaleDateString()}
      </div>
      <div className="mb-3">
        <strong>Fecha Factura:</strong>{" "}
        {new Date(servicio.fecha_factura).toLocaleDateString()}
      </div>
      <div className="mb-3">
        <strong>Fecha Servicio Técnico:</strong>{" "}
        {new Date(servicio.fecha_serviciotecnico).toLocaleDateString()}
      </div>
      <div className="mb-3">
        <strong>Garantía Aplica:</strong>{" "}
        {servicio.garantia_aplica_serviciotecnico ? "Sí" : "No"}
      </div>
      <div className="mb-3">
        <strong>Fecha Garantía:</strong>{" "}
        {servicio.fecha_garantia_serviciotecnico
          ? new Date(
              servicio.fecha_garantia_serviciotecnico
            ).toLocaleDateString()
          : "No aplica"}
      </div>
      <div className="mb-3">
        <strong>Tipo de Daño:</strong> {servicio.tipo_dano_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Nombre Cliente:</strong> {servicio.nombre_cliente}
      </div>
      <div className="mb-3">
        <strong>Nombre Proveedor:</strong> {servicio.nombre_proveedor}
      </div>
      <div className="mb-3">
        <strong>Nombre Sede:</strong> {servicio.nombre_sede}
      </div>
      <div className="mb-3">
        <strong>Nombre Servicio Técnico:</strong>{" "}
        {servicio.nombre_serviciotecnico}
      </div>
      <div className="mb-3">
        <strong>Número de Contacto Alternativo:</strong>{" "}
        {servicio.numero_contacto_alternativo_servicio}
      </div>
      <div className="mb-3">
        <strong>Saldo Factura:</strong> {servicio.saldo_factura}
      </div>
      <div className="mb-3">
        <strong>Total Factura:</strong> {servicio.total_factura}
      </div>
    </div>
  );
};

export default DetallesServicioTecnico;
