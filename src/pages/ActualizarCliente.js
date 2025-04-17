import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, FloatingLabel, Modal } from "react-bootstrap";

function ActualizarCliente() {
  const { id } = useParams();
  const [cliente, setCliente] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [sedes, setSedes] = useState([]);
  const navigate = useNavigate();

  const tipoCliente = Number(cliente.id_tipocliente_cliente);
  const esPersonaNatural = tipoCliente === 1;

  useEffect(() => {
    fetch(`http://localhost:4000/api/clientes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCliente(data[0]);
        } else {
          setCliente(data);
        }
      });

    fetch("http://localhost:4000/api/sedes")
      .then((res) => res.json())
      .then(setSedes);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4000/api/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar el cliente");
        return res.json();
      })
      .then(() => {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate("/clientes");
        }, 2000);
      })
      .catch(() => setMensaje("Hubo un error al actualizar el cliente 😢"));
  };

  return (
    <Container className="mt-4 pb-5">
      <Form onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">👤 Actualizar Cliente</h2>

        {esPersonaNatural ? (
          <>
            <FloatingLabel
              controlId="nombre_cliente"
              label="Nombre:"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="nombre_cliente"
                value={cliente.nombre_cliente || ""}
                onChange={handleChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="apellido_cliente"
              label="Apellido:"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="apellido_cliente"
                value={cliente.apellido_cliente || ""}
                onChange={handleChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="fechanacimiento_cliente"
              label="Fecha de nacimiento:"
              className="mb-3"
            >
              <Form.Control
                type="date"
                name="fechanacimiento_cliente"
                value={cliente.fechanacimiento_cliente?.split("T")[0] || ""}
                onChange={handleChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="genero_cliente"
              label="Género:"
              className="mb-3"
            >
              <Form.Select
                name="genero_cliente"
                value={cliente.genero_cliente || ""}
                onChange={handleChange}
              >
                <option value="">Seleccione género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </Form.Select>
            </FloatingLabel>
          </>
        ) : (
          <>
            <FloatingLabel
              controlId="razonsocial_cliente"
              label="Razón Social:"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="razonsocial_cliente"
                value={cliente.razonsocial_cliente || ""}
                onChange={handleChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="nombrecomercial_cliente"
              label="Nombre Comercial:"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="nombrecomercial_cliente"
                value={cliente.nombrecomercial_cliente || ""}
                onChange={handleChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="representante_cliente"
              label="Representante Legal:"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="representante_cliente"
                value={cliente.representante_cliente || ""}
                onChange={handleChange}
              />
            </FloatingLabel>
          </>
        )}

        <FloatingLabel
          controlId="telefono_cliente"
          label="Teléfono:"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="telefono_cliente"
            value={cliente.telefono_cliente || ""}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="email_cliente"
          label="Correo Electrónico:"
          className="mb-3"
        >
          <Form.Control
            type="email"
            name="email_cliente"
            value={cliente.email_cliente || ""}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="direccion_cliente"
          label="Dirección:"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="direccion_cliente"
            value={cliente.direccion_cliente || ""}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="barrio_cliente"
          label="Barrio:"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="barrio_cliente"
            value={cliente.barrio_cliente || ""}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="codigopostal_cliente"
          label="Código Postal:"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="codigopostal_cliente"
            value={cliente.codigopostal_cliente || ""}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="id_sede_cliente"
          label="Sede:"
          className="mb-3"
        >
          <Form.Select
            name="id_sede_cliente"
            value={cliente.id_sede_cliente || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione una sede</option>
            {sedes.map((sede) => (
              <option key={sede.id_sede} value={sede.id_sede}>
                {sede.nombre_sede}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <Button variant="primary" type="submit">
          Actualizar
        </Button>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cliente actualizado</Modal.Title>
          </Modal.Header>
          <Modal.Body>El cliente se actualizó correctamente.</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => navigate("/clientes")}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Container>
  );
}

export default ActualizarCliente;
