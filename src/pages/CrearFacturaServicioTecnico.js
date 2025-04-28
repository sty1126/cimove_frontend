import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { Select } from "antd";
import SeleccionarClientePorSede from "./SeleccionarClientePorSede";
import SeleccionarProveedor from "./SeleccionarProveedor";

const { Option } = Select;

const ServicioTecnicoForm = () => {
  const today = new Date().toISOString().split("T")[0]; // <-- aquí se obtiene la fecha de hoy formato YYYY-MM-DD

  const [formData, setFormData] = useState({
    id_proveedor: "", // Inicialmente vacío
    id_cliente: "",
    nombre: "",
    descripcion: "",
    fecha: today, // <-- se asigna fecha de hoy
    fechaEntrega: "",
    tipoDanio: "",
    claveDispositivo: "",
    costo: "",
    abono: "",
    contactoAlternativo: "",
    estadoTecnico: "D",
    autorizado: true,
    garantiaAplica: false,
    fechaGarantia: "",
  });

  const [sedes, setSedes] = useState([]);
  const [selectedSede, setSelectedSede] = useState(null);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [showModalProveedor, setShowModalProveedor] = useState(false);
  const [mostrarSeleccionProveedor, setMostrarSeleccionProveedor] =
    useState(false);
  const [errorProveedor, setErrorProveedor] = useState(""); // Estado para manejar el error

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/sedes/")
      .then((res) => setSedes(res.data))
      .catch((error) => console.error("Error al cargar sedes:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el proveedor no esté vacío
    if (!formData.id_proveedor) {
      setErrorProveedor("El proveedor es obligatorio.");
      return; // Detener el envío del formulario si no hay proveedor
    }

    setErrorProveedor(""); // Limpiar el error si el proveedor está presente

    try {
      const response = await axios.post(
        "http://localhost:4000/api/serviciotecnico",
        {
          ...formData,
          sede: selectedSede, // incluir sede seleccionada si aplica
        }
      );
      alert("Servicio técnico y factura registrados correctamente.");
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al registrar el servicio técnico.");
    }
  };

  return (
    <div>
      <h2>Registrar Servicio Técnico</h2>
      <Form onSubmit={handleSubmit}>
        {/* Selector de sede */}
        <Form.Group className="mb-3">
          <Form.Label>Sede</Form.Label>
          <Select
            placeholder="Seleccionar sede"
            value={selectedSede}
            onChange={setSelectedSede}
            style={{ width: "100%" }}
          >
            <Option value="general">Seleccionar sede</Option>
            {sedes.map((sede) => (
              <Option key={sede.id_sede} value={sede.nombre_sede}>
                {sede.nombre_sede}
              </Option>
            ))}
          </Select>
        </Form.Group>

        {/* Botón y modal de selección de cliente */}
        <Button
          variant="outline-secondary"
          onClick={() => setShowModalCliente(true)}
          className="my-2"
        >
          Seleccionar Cliente
        </Button>

        <Form.Group className="mb-3">
          <Form.Label>ID del Cliente Seleccionado</Form.Label>
          <Form.Control
            type="text"
            value={formData.id_cliente || "Ninguno"}
            readOnly
          />
        </Form.Group>

        <SeleccionarClientePorSede
          show={showModalCliente}
          handleClose={() => setShowModalCliente(false)}
          setCliente={(cliente) =>
            setFormData({ ...formData, id_cliente: cliente.id_cliente })
          }
          selectedSede={selectedSede}
          sedes={sedes}
        />

        {/* Campos del formulario */}
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Servicio</Form.Label>
          <Form.Control
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha de Ingreso</Form.Label>
          <Form.Control
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha de Entrega</Form.Label>
          <Form.Control
            type="date"
            name="fechaEntrega"
            value={formData.fechaEntrega}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipo de Daño</Form.Label>
          <Form.Control
            name="tipoDanio"
            value={formData.tipoDanio}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Clave del Dispositivo</Form.Label>
          <Form.Control
            name="claveDispositivo"
            value={formData.claveDispositivo}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Costo Estimado</Form.Label>
          <Form.Control
            type="number"
            name="costo"
            value={formData.costo}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Abono Inicial</Form.Label>
          <Form.Control
            type="number"
            name="abono"
            value={formData.abono}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contacto Alternativo</Form.Label>
          <Form.Control
            name="contactoAlternativo"
            value={formData.contactoAlternativo}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Check
          type="checkbox"
          label="¿Aplica Garantía?"
          name="garantiaAplica"
          checked={formData.garantiaAplica}
          onChange={handleChange}
          className="mb-2"
        />

        {formData.garantiaAplica && (
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Garantía</Form.Label>
            <Form.Control
              type="date"
              name="fechaGarantia"
              value={formData.fechaGarantia}
              onChange={handleChange}
            />
          </Form.Group>
        )}

        <Form.Check
          type="checkbox"
          label="¿Se conoce cuál será el proveedor?"
          checked={mostrarSeleccionProveedor}
          onChange={() =>
            setMostrarSeleccionProveedor(!mostrarSeleccionProveedor)
          }
          className="mb-2"
        />

        {mostrarSeleccionProveedor && (
          <>
            <Button
              variant="outline-secondary"
              onClick={() => setShowModalProveedor(true)}
              className="my-2"
            >
              Seleccionar Proveedor
            </Button>
            <SeleccionarProveedor
              show={showModalProveedor}
              handleClose={() => setShowModalProveedor(false)}
              setProveedor={(prov) =>
                setFormData({ ...formData, id_proveedor: prov.id_proveedor })
              }
            />
          </>
        )}

        {errorProveedor && <p style={{ color: "red" }}>{errorProveedor}</p>}

        <Button type="submit" variant="primary" className="mt-3">
          Registrar Servicio Técnico
        </Button>
      </Form>
    </div>
  );
};

export default ServicioTecnicoForm;
