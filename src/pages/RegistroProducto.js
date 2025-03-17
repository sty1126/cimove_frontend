import React, { useState, useEffect } from "react";
import { Form, Button, Container, FloatingLabel } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const RegistrarProducto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_producto: "",
    nombre_producto: "",
    descripcion_producto: "",
    id_categoria_producto: "",
    precioventaact_producto: "",
    costoventa_producto: "",
    margenutilidad_producto: "",
    valoriva_producto: "",
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/categorias")
      .then((res) => setCategorias(res.data))
      .catch((error) => console.error("Error al obtener categorías", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData };

    if (name === "precioventaact_producto" || name === "costoventa_producto") {
      const precioVenta = parseFloat(value) || 0;
      const costoVenta = parseFloat(updatedFormData.costoventa_producto) || 0;
      updatedFormData[name] = value;
      updatedFormData.margenutilidad_producto = Math.round(
        precioVenta - costoVenta
      );
    } else if (name === "valoriva_producto") {
      let iva = parseFloat(value) / 100;
      if (iva > 1) iva = 1;
      if (iva < 0) iva = 0;
      updatedFormData.valoriva_producto = iva.toFixed(2);
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/productos", formData)
      .then(() => {
        toast.success("Producto registrado exitosamente 🎉", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        toast.error("Error al registrar producto 🚨", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("Error al registrar producto", error);
      });
  };

  return (
    <Container className="mt-4 pb-5">
      <h2 className="text-center mb-4">📦 Registrar Producto</h2>
      <Form onSubmit={handleSubmit}>
        <FloatingLabel
          controlId="id_producto"
          label="ID Producto"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="id_producto"
            value={formData.id_producto}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="nombre_producto"
          label="Nombre"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="nombre_producto"
            value={formData.nombre_producto}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="descripcion_producto"
          label="Descripción"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="descripcion_producto"
            value={formData.descripcion_producto}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="id_categoria_producto"
          label="Categoría"
          className="mb-3"
        >
          <Form.Select
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
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel
          controlId="precioventaact_producto"
          label="Precio Venta"
          className="mb-3"
        >
          <Form.Control
            type="number"
            name="precioventaact_producto"
            value={formData.precioventaact_producto}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="costoventa_producto"
          label="Costo Venta"
          className="mb-3"
        >
          <Form.Control
            type="number"
            name="costoventa_producto"
            value={formData.costoventa_producto}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="margenutilidad_producto"
          label="Margen Utilidad (calculado)"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="margenutilidad_producto"
            value={formData.margenutilidad_producto}
            readOnly
            className="bg-light"
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="valoriva_producto"
          label="IVA (%)"
          className="mb-3"
        >
          <Form.Control
            type="number"
            name="valoriva_producto"
            value={
              formData.valoriva_producto
                ? Math.round(formData.valoriva_producto * 100)
                : ""
            }
            onChange={(e) => {
              const value = e.target.value.replace(/^0+/, ""); // Elimina ceros a la izquierda
              handleChange({
                target: {
                  name: "valoriva_producto",
                  value: value ? Number(value) / 100 : 0,
                },
              });
            }}
            min="0"
            max="100"
            required
          />
        </FloatingLabel>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button variant="primary" type="submit" className="px-4 py-2">
            Registrar Producto
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

export default RegistrarProducto;
