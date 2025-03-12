import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const ActualizarProducto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id_producto: "",
    nombre_producto: "",
    descripcion_producto: "",
    id_categoria_producto: "",
    precioventaact_producto: "",
    costoventa_producto: "",
    margenutilidad_producto: "",
    valoriva_producto: "",
    estado_producto: "",
  });

  const [producto, setProducto] = useState({});
  const [categorias, setCategorias] = useState({});

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener producto por ID
        const resProducto = await axios.get(
          `http://localhost:4000/api/productos/${id}`
        );
        setProducto(resProducto.data);

        // Obtener categorías
        const resCategorias = await axios.get(
          "http://localhost:4000/api/categorias"
        );
        setCategorias(resCategorias.data);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    obtenerDatos();
  }, [id]); // Se ejecuta cada vez que cambia el ID

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === "precioventaact_producto" || name === "costoventa_producto") {
      const precioVenta =
        parseFloat(updatedFormData.precioventaact_producto) || 0;
      const costoVenta = parseFloat(updatedFormData.costoventa_producto) || 0;
      updatedFormData.margenutilidad_producto = Math.round(
        precioVenta - costoVenta
      );
    } else if (name === "valoriva_producto") {
      let iva = parseFloat(value) / 100;
      if (iva > 1) iva = 1;
      if (iva < 0) iva = 0;
      updatedFormData.valoriva_producto = iva.toFixed(2);
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:4000/api/productos/${id}`, formData)
      .then(() => {
        toast.success("Producto actualizado exitosamente 🎉", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        toast.error("Error al actualizar producto 🚨", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("Error al actualizar producto", error);
      });
  };

  return (
    <Container className="mt-4 pb-5">
      <h2 className="text-center mb-4">✏️ Actualizar Producto</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>ID Producto</Form.Label>
          <Form.Control
            type="text"
            name="id_producto"
            value={formData.id_producto}
            readOnly
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre_producto"
            value={formData.nombre_producto}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            name="descripcion_producto"
            value={formData.descripcion_producto}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            as="select"
            name="id_categoria_producto"
            value={formData.id_categoria_producto}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.descripcion_categoria}
                </option>
              ))
            ) : (
              <option disabled>Cargando categorías...</option>
            )}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Precio Venta</Form.Label>
          <Form.Control
            type="number"
            name="precioventaact_producto"
            value={formData.precioventaact_producto}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Costo Venta</Form.Label>
          <Form.Control
            type="number"
            name="costoventa_producto"
            value={formData.costoventa_producto}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Margen Utilidad (calculado)</Form.Label>
          <Form.Control
            type="text"
            name="margenutilidad_producto"
            value={formData.margenutilidad_producto}
            readOnly
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>IVA (%)</Form.Label>
          <Form.Control
            type="number"
            name="valoriva_producto"
            value={formData.valoriva_producto * 100}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Estado</Form.Label>
          <Form.Control
            as="select"
            name="estado_producto"
            value={formData.estado_producto}
            onChange={handleChange}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Form.Control>
        </Form.Group>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button variant="primary" type="submit">
            Actualizar Producto
          </Button>
          <Button variant="danger" onClick={() => navigate("/inventario")}>
            Cancelar
          </Button>
        </div>
      </Form>

      <ToastContainer />
    </Container>
  );
};

export default ActualizarProducto;
