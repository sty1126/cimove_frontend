import React, { useState, useEffect } from "react";
import { Form, Button, Container, FloatingLabel, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const RegistroProveedor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_proveedor: "",
    nombre_proveedor: "",
    id_ciudad_proveedor: "", 
    direccion_proveedor: "",
    telefono_proveedor: "",
    email_proveedor: "",
    id_tipoproveedor_proveedor: "",
    representante_proveedor: "",
    fecharegistro_proveedor: new Date().toISOString().split('T')[0],
    saldo_proveedor: "0",
    digitoverificacion_proveedor: ""
  });

  const [tiposProveedor, setTiposProveedor] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [loadingCiudades, setLoadingCiudades] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener tipos de proveedor
        const tiposResponse = await axios.get("http://localhost:4000/api/proveedores/tipos");
        setTiposProveedor(tiposResponse.data);
        
        // Obtener ciudades
        const ciudadesResponse = await axios.get("http://localhost:4000/api/ciudades/ciudades");
        console.log("Datos de ciudades:", ciudadesResponse.data);
        setCiudades(ciudadesResponse.data);
        
        setLoadingTipos(false);
        setLoadingCiudades(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        toast.error("Error al cargar datos iniciales", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoadingTipos(false);
        setLoadingCiudades(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "id_proveedor" && value.length > 0) {
      const ultimoDigito = value.slice(-1);
      setFormData(prev => ({
        ...prev,
        digitoverificacion_proveedor: ultimoDigito
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.id_proveedor || !formData.nombre_proveedor || 
        !formData.id_ciudad_proveedor || !formData.id_tipoproveedor_proveedor) {
      toast.error("Complete los campos obligatorios", {
        position: "top-right",
        autoClose: 3000,
      });
      setSubmitting(false);
      return;
    }

    if (formData.email_proveedor && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_proveedor)) {
      toast.error("Ingrese un email válido", {
        position: "top-right",
        autoClose: 3000,
      });
      setSubmitting(false);
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/proveedores", formData);
      toast.success("Proveedor registrado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/proveedores"), 1500);
    } catch (error) {
      console.error("Error al registrar:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Error al registrar proveedor";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-4 pb-5" style={{ maxWidth: '800px' }}>
      <h2 className="text-center mb-4">Registrar Nuevo Proveedor</h2>
      
      <Form onSubmit={handleSubmit}>
        {/* Campo ID/NIT */}
        <FloatingLabel controlId="id_proveedor" label="ID/NIT Proveedor" className="mb-3">
          <Form.Control
            type="text"
            name="id_proveedor"
            value={formData.id_proveedor}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Ingrese ID/NIT"
            maxLength={9}
          />
        </FloatingLabel>

        {/* Campo Nombre */}
        <FloatingLabel controlId="nombre_proveedor" label="Nombre Proveedor" className="mb-3">
          <Form.Control
            type="text"
            name="nombre_proveedor"
            value={formData.nombre_proveedor}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Ingrese nombre"
            maxLength={25}
          />
        </FloatingLabel>

        {/* Selector de Ciudades*/}
        <FloatingLabel controlId="id_ciudad_proveedor" label="Ciudad" className="mb-3">
  <Form.Select
    name="id_ciudad_proveedor"
    value={formData.id_ciudad}
    onChange={handleChange}
    required
    disabled={loadingCiudades || submitting}
  >
    <option value="">Seleccionar ciudad</option>
    {loadingCiudades ? (
      <option disabled>Cargando ciudades...</option>
    ) : ciudades.length > 0 ? (
      ciudades.map((ciudad) => (
        <option 
          key={ciudad.id_ciudad}  // Campo correcto
          value={ciudad.id_ciudad}
        >
          {ciudad.nombre_ciudad}  {/* Campo correcto */}
        </option>
      ))
    ) : (
      <option disabled>No hay ciudades disponibles</option>
    )}
  </Form.Select>
</FloatingLabel>
  

        {/* Campo Dirección */}
        <FloatingLabel controlId="direccion_proveedor" label="Dirección" className="mb-3">
          <Form.Control
            type="text"
            name="direccion_proveedor"
            value={formData.direccion_proveedor}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Ingrese dirección"
            maxLength={30}
          />
        </FloatingLabel>

        {/* Campo Teléfono */}
        <FloatingLabel controlId="telefono_proveedor" label="Teléfono" className="mb-3">
          <Form.Control
            type="tel"
            name="telefono_proveedor"
            value={formData.telefono_proveedor}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Ingrese teléfono"
            maxLength={13}
          />
        </FloatingLabel>

        {/* Campo Email */}
        <FloatingLabel controlId="email_proveedor" label="Email (Opcional)" className="mb-3">
          <Form.Control
            type="email"
            name="email_proveedor"
            value={formData.email_proveedor}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Ingrese email"
            maxLength={25}
          />
        </FloatingLabel>

        {/* Selector de Tipo de Proveedor */}
        <FloatingLabel
          controlId="id_tipoproveedor_proveedor"
          label="Tipo de Proveedor"
          className="mb-3"
        >
          <Form.Select
            name="id_tipoproveedor_proveedor"
            value={formData.id_tipoproveedor_proveedor}
            onChange={handleChange}
            required
            disabled={loadingTipos || submitting}
          >
            <option value="">Seleccionar tipo de proveedor</option>
            {loadingTipos ? (
              <option disabled>Cargando tipos...</option>
            ) : tiposProveedor.length > 0 ? (
              tiposProveedor.map((tipo) => (
                <option key={tipo.id_tipoproveedor} value={tipo.id_tipoproveedor}>
                  {tipo.nombre_tipoproveedor}
                </option>
              ))
            ) : (
              <option disabled>No hay tipos disponibles</option>
            )}
          </Form.Select>
        </FloatingLabel>

        {/* Campo Representante */}
        <FloatingLabel controlId="representante_proveedor" label="Representante (Opcional)" className="mb-3">
          <Form.Control
            type="text"
            name="representante_proveedor"
            value={formData.representante_proveedor}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Ingrese representante"
            maxLength={25}
          />
        </FloatingLabel>

        {/* Campo Fecha Registro */}
        <FloatingLabel controlId="fecharegistro_proveedor" label="Fecha de Registro" className="mb-3">
          <Form.Control
            type="date"
            name="fecharegistro_proveedor"
            value={formData.fecharegistro_proveedor}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </FloatingLabel>

        {/* Campo Saldo */}
        <FloatingLabel controlId="saldo_proveedor" label="Saldo Inicial" className="mb-3">
          <Form.Control
            type="number"
            name="saldo_proveedor"
            value={formData.saldo_proveedor}
            onChange={handleChange}
            min="0"
            step="0.01"
            disabled={submitting}
            placeholder="Ingrese saldo inicial"
          />
        </FloatingLabel>

        {/* Campo Dígito Verificación */}
        <FloatingLabel controlId="digitoverificacion_proveedor" label="Dígito de Verificación" className="mb-3">
          <Form.Control
            type="text"
            name="digitoverificacion_proveedor"
            value={formData.digitoverificacion_proveedor}
            onChange={handleChange}
            maxLength={1}
            required
            readOnly
            placeholder="Dígito de verificación"
          />
        </FloatingLabel>

        {/* Botones de acción */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button 
            variant="primary" 
            type="submit" 
            className="px-4 py-2"
            disabled={submitting || loadingTipos || loadingCiudades}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Registrando...
              </>
            ) : 'Registrar Proveedor'}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={() => navigate("/proveedores")}
            className="px-4 py-2"
            disabled={submitting}
          >
            Cancelar
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default RegistroProveedor;
