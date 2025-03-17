import { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

export default function SeleccionarProducto({
  show,
  handleClose,
  setProducto,
}) {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/productos");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos", error);
      }
    };
    if (show) fetchProductos();
  }, [show]);

  const filtrarProductos = () => {
    return productos.filter((p) => {
      const nombre_producto = p.nombre_producto
        ? p.nombre_producto.toString().toLowerCase()
        : "";
      const id = p.id_producto ? p.id_producto.toString() : "";
      return (
        nombre_producto.includes(search.toLowerCase()) || id.includes(search)
      );
    });
  };

  const handleSelect = (producto) => {
    setProducto(producto.id_producto);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtrarProductos().map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre_producto || "Sin nombre"}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSelect(producto)}
                  >
                    Seleccionar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
