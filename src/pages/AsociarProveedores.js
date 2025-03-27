import { useState, useEffect } from "react";
import { Button, Container, Form, FloatingLabel, Table } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const AsociarProveedores = () => {
  const { idProducto } = useParams(); // Obtiene el ID del producto desde la URL
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/proveedores/all")
      .then((res) => setProveedores(res.data))
      .catch((error) => console.error("Error al obtener proveedores", error));
  }, []);

  const toggleProveedor = (idProveedor) => {
    setProveedoresSeleccionados((prev) =>
      prev.includes(idProveedor)
        ? prev.filter((id) => id !== idProveedor)
        : [...prev, idProveedor]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (proveedoresSeleccionados.length === 0) {
      toast.error("Seleccione al menos un proveedor 🚨");
      return;
    }

    try {
      await Promise.all(
        proveedoresSeleccionados.map((idProveedor) =>
          axios.post("http://localhost:4000/api/proveedor-producto", {
            id_proveedor_proveedorproducto: idProveedor,
            id_producto_proveedorproducto: idProducto,
          })
        )
      );

      toast.success("Proveedores asociados correctamente 🎉");
      setTimeout(() => navigate("/inventario"), 2000);
    } catch (error) {
      console.error("Error al asociar proveedores", error);
      toast.error("Error al asociar proveedores 🚨");
    }
  };

  return (
    <Container className="p-4 bg-white shadow rounded">
      <h2 className="text-center mb-4">Asociar Proveedores</h2>
      <p>Seleccione los proveedores para el producto</p>

      <Form onSubmit={handleSubmit}>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((prov) => (
              <tr key={prov.id_proveedor}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={proveedoresSeleccionados.includes(
                      prov.id_proveedor
                    )}
                    onChange={() => toggleProveedor(prov.id_proveedor)}
                  />
                </td>
                <td>{prov.nombre_proveedor}</td>
                <td>{prov.telefono_proveedor}</td>
                <td>{prov.email_proveedor || "No disponible"}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button variant="primary" type="submit" className="px-4 py-2">
            Guardar Asociación
          </Button>
          <Button
            variant="danger"
            onClick={() => navigate("/inventario")}
            className="px-4 py-2"
          >
            Cancelar
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AsociarProveedores;
