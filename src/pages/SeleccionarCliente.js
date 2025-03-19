import { useState, useEffect } from "react";
import { Modal, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEye } from "react-icons/fa";

export default function SeleccionarCliente({ show, handleClose, setCliente }) {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/clientes/formateados"
        );
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener clientes", error);
      }
    };

    if (show) fetchClientes();
  }, [show]);

  const filtrarClientes = () =>
    clientes.filter((c) => {
      const nombre = c.nombre ? c.nombre.toLowerCase() : "";
      const id = c.id ? c.id.toString() : "";
      const razonSocial = c.razon_social ? c.razon_social.toLowerCase() : "";

      return (
        nombre.includes(search.toLowerCase()) ||
        id.includes(search) ||
        razonSocial.includes(search.toLowerCase())
      );
    });

  const handleSelect = (cliente) => {
    setCliente({
      id_cliente: cliente.id,
      nombre: cliente.nombre,
      razon_social: cliente.razon_social,
      tipo: cliente.tipo,
    });
    handleClose();
  };

  const verDetalles = (clienteId) => navigate(`/detalles-cliente/${clienteId}`);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Buscar por código, nombre o razón social"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Razón Social</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarClientes().length > 0 ? (
              filtrarClientes().map((cliente, index) => (
                <tr key={cliente.id ?? `cliente-${index}`}>
                  {console.log("Cliente actual:", cliente)}
                  <td>{cliente.id || "Sin ID"}</td>
                  <td>{cliente.nombre || "Sin nombre"}</td>
                  <td>{cliente.razon_social || "No aplica"}</td>
                  <td>{cliente.tipo || "N/A"}</td>
                  <td className="text-center">
                    <FaCheckCircle
                      className="text-success me-3"
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      onClick={() => handleSelect(cliente)}
                      title="Seleccionar cliente"
                    />
                    <FaEye
                      className="text-info"
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      onClick={() => verDetalles(cliente.id)}
                      title="Ver detalles del cliente"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay clientes disponibles
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
