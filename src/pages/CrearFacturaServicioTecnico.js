import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import SeleccionarClientePorSede from "./SeleccionarClientePorSede";
import { Select } from "antd";

// ... resto de imports
const CrearFacturaServicioTecnico = () => {
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/sedes");
        setSedes(res.data);
      } catch (error) {
        console.error("Error al cargar las sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  const [formData, setFormData] = useState({
    id_cliente_factura: "",
    total_factura: "",
    descuento_factura: "",
    iva_factura: "",
    subtotal_factura: "",
    aplica_garantia_factura: false,
    fecha_garantia_factura: "",
    saldo_factura: "",
    id_proveedor_servicio: "",
    id_sede_servicio: "",
    nombre_servicio: "",
    descripcion_servicio: "",
    costo_servicio: "",
    fecha_servicio: "",
  });

  const [selectedSede, setSelectedSede] = useState(null);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [cliente, setCliente] = useState(null);
  const { Option } = Select;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación mínima: cliente y sede
    if (!formData.id_cliente_factura || !selectedSede) {
      alert("Debes seleccionar una sede y un cliente antes de continuar.");
      return;
    }

    // Añadir la sede seleccionada
    const sedeObj = sedes.find((s) => s.nombre_sede === selectedSede);
    const finalFormData = {
      ...formData,
      id_sede_servicio: sedeObj?.id_sede || "",
    };

    try {
      const response = await axios.post(
        "/api/factura-servicio-tecnico",
        finalFormData
      );
      console.log("Factura creada:", response.data);
      // Aquí podrías redirigir al detalle de factura para que el admin/técnico edite luego
    } catch (error) {
      console.error("Error al crear factura:", error);
    }
  };

  useEffect(() => {
    if (cliente) {
      setFormData((prev) => ({
        ...prev,
        id_cliente_factura: cliente.id_cliente,
      }));
    }
  }, [cliente]);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Crear Factura de Servicio Técnico</Card.Title>
          <Form onSubmit={handleSubmit}>
            <h5 className="mt-3">Datos de la Factura</h5>
            <Row>
              <div style={{ marginBottom: 16 }}>
                <Select
                  placeholder="Selecciona una sede"
                  style={{ width: 300 }}
                  onChange={(value) => setSelectedSede(value)}
                  value={selectedSede}
                >
                  {sedes.map((sede) => (
                    <Option key={sede.id_sede} value={sede.nombre_sede}>
                      {sede.nombre_sede}
                    </Option>
                  ))}
                </Select>

                <Button
                  type="primary"
                  style={{ marginLeft: 16 }}
                  onClick={() => {
                    if (selectedSede) {
                      setShowModalCliente(true);
                    } else {
                      alert("Primero debes seleccionar una sede.");
                    }
                  }}
                >
                  Seleccionar Cliente
                </Button>
              </div>

              <Col md={6}>
                <Form.Group controlId="id_cliente_factura">
                  <Form.Label>Cliente</Form.Label>
                  <Form.Control
                    type="text"
                    name="id_cliente_factura"
                    value={formData.id_cliente_factura}
                    onChange={handleChange}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group controlId="total_factura">
                  <Form.Label>Total</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_factura"
                    value={formData.total_factura}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="descuento_factura">
                  <Form.Label>Descuento</Form.Label>
                  <Form.Control
                    type="number"
                    name="descuento_factura"
                    value={formData.descuento_factura}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="iva_factura">
                  <Form.Label>IVA</Form.Label>
                  <Form.Control
                    type="number"
                    name="iva_factura"
                    value={formData.iva_factura}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={6}>
                <Form.Group controlId="subtotal_factura">
                  <Form.Label>Subtotal</Form.Label>
                  <Form.Control
                    type="number"
                    name="subtotal_factura"
                    value={formData.subtotal_factura}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="saldo_factura">
                  <Form.Label>Saldo</Form.Label>
                  <Form.Control
                    type="number"
                    name="saldo_factura"
                    value={formData.saldo_factura}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="aplica_garantia_factura" className="mt-3">
              <Form.Check
                type="checkbox"
                name="aplica_garantia_factura"
                label="Aplicar Garantía"
                checked={formData.aplica_garantia_factura}
                onChange={handleChange}
              />
            </Form.Group>
            {formData.aplica_garantia_factura && (
              <Form.Group controlId="fecha_garantia_factura" className="mt-2">
                <Form.Label>Fecha de Garantía</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_garantia_factura"
                  value={formData.fecha_garantia_factura}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
            <hr />
            <h5 className="mt-3">Datos del Servicio Técnico (Opcionales)</h5>
            <Row>
              <Col md={6}>
                <Form.Group controlId="id_proveedor_servicio">
                  <Form.Label>Proveedor</Form.Label>
                  <Form.Control
                    type="text"
                    name="id_proveedor_servicio"
                    value={formData.id_proveedor_servicio}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="nombre_servicio">
                  <Form.Label>Nombre del Servicio</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_servicio"
                    value={formData.nombre_servicio}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="descripcion_servicio" className="mt-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion_servicio"
                value={formData.descripcion_servicio}
                onChange={handleChange}
              />
            </Form.Group>
            <Row className="mt-2">
              <Col md={6}>
                <Form.Group controlId="costo_servicio">
                  <Form.Label>Costo</Form.Label>
                  <Form.Control
                    type="number"
                    name="costo_servicio"
                    value={formData.costo_servicio}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="fecha_servicio">
                  <Form.Label>Fecha del Servicio</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha_servicio"
                    value={formData.fecha_servicio}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <SeleccionarClientePorSede
              show={showModalCliente}
              handleClose={() => setShowModalCliente(false)}
              setCliente={setCliente}
              selectedSede={selectedSede}
              sedes={sedes}
            />

            <Button type="submit" className="mt-4" variant="primary">
              Crear Factura
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CrearFacturaServicioTecnico;
