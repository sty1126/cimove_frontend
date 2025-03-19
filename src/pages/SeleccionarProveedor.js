import { useState, useEffect } from "react";
import { Modal, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEye } from "react-icons/fa";

export default function SeleccionarProveedor({
  show,
  handleClose,
  setProveedor,
}) {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/proveedores/all"
        );
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        console.error("Error al obtener proveedores", error);
      }
    };
    if (show) fetchProveedores();
  }, [show]);

  const filtrarProveedores = () => {
    return proveedores.filter((p) => {
      const id = p.id_proveedor ? p.id_proveedor.toString() : "";
      const nombre = p.nombre_proveedor ? p.nombre_proveedor.toLowerCase() : "";
      const representante = p.representante_proveedor
        ? p.representante_proveedor.toLowerCase()
        : "";

      return (
        id.includes(search) ||
        nombre.includes(search.toLowerCase()) ||
        representante.includes(search.toLowerCase())
      );
    });
  };

  const handleSelect = (proveedor) => {
    setProveedor({
      id: proveedor.id_proveedor,
      nombre: proveedor.nombre_proveedor || "Sin nombre",
    });
    handleClose();
  };

  const verDetalles = (proveedorId) => {
    window.open(`/detalles-proveedor/${proveedorId}`, "_blank");
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Buscar por ID, nombre o representante"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Representante</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarProveedores().map((proveedor) => (
              <tr key={proveedor.id_proveedor}>
                <td>{proveedor.id_proveedor}</td>
                <td>{proveedor.nombre_proveedor || "Sin nombre"}</td>
                <td>
                  {proveedor.representante_proveedor || "Sin representante"}
                </td>
                <td className="text-center">
                  <FaCheckCircle
                    className="text-success me-3"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    onClick={() => handleSelect(proveedor)}
                    title="Seleccionar proveedor"
                  />
                  <FaEye
                    className="text-info"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    onClick={() => verDetalles(proveedor.id_proveedor)}
                    title="Ver detalles del proveedor"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
