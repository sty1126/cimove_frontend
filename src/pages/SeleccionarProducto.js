import { useState, useEffect } from "react";
import { Modal, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEye } from "react-icons/fa";
import axios from "axios";

export default function SeleccionarProducto({
  show,
  handleClose,
  setProducto,
  idSede,
}) {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      if (!idSede) return; // ✅ Evita llamadas innecesarias si no hay sede seleccionada

      try {
        const response = await axios.get(
          `http://localhost:4000/api/inventariolocal/sede/${idSede}`
        );
        setProductos(response.data);
      } catch (error) {
        console.error("❌ Error al obtener productos", error);
      }
    };

    if (show) fetchProductos();
  }, [show, idSede]);

  const filtrarProductos = () => {
    return productos.filter((p) => {
      const nombre_producto = p.nombre_producto
        ? p.nombre_producto.toLowerCase()
        : "";
      const id = p.id_producto ? p.id_producto.toString() : "";
      return (
        nombre_producto.includes(search.toLowerCase()) || id.includes(search)
      );
    });
  };

  const handleSelect = (producto) => {
    console.log("✅ Producto seleccionado:", producto);
    setProducto(producto);
    handleClose();
  };

  const verDetalles = (productoId) => {
    navigate(`/detalles-producto/${productoId}`);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Sede Seleccionada:</strong> {idSede || "Ninguna"}
        </p>{" "}
        {/* ✅ Muestra la sede seleccionada */}
        <Form.Control
          type="text"
          placeholder="Buscar por código o nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarProductos().map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre_producto || "Sin nombre"}</td>
                <td className="text-center">
                  <FaCheckCircle
                    className="text-success me-3"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    onClick={() => handleSelect(producto)}
                    title="Seleccionar producto"
                  />
                  <FaEye
                    className="text-info"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    onClick={() => verDetalles(producto.id_producto)}
                    title="Ver detalles del producto"
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
