import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, FloatingLabel, Modal } from "react-bootstrap";

function ActualizarProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState({
    id_producto: "",
    id_categoria_producto: "",
    nombre_producto: "",
    descripcion_producto: "",
    precioventaact_producto: "",
    costoventa_producto: "",
    valoriva_producto: "",
  });

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState(""); // Para mostrar mensajes de éxito/error

  // Cargar el producto
  useEffect(() => {
    fetch(`http://localhost:4000/api/productos/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Producto recibido:", data);
        if (Array.isArray(data) && data.length > 0) {
          setProducto(data[0]);
        } else {
          setProducto(data);
        }
      })
      .catch((error) => console.error("Error al cargar el producto:", error));
  }, [id]);

  // Cargar las categorías
  useEffect(() => {
    fetch("http://localhost:4000/api/categorias")
      .then((response) => response.json())
      .then((data) => {
        console.log("Categorías recibidas:", data);
        setCategorias(data);
      })
      .catch((error) =>
        console.error("Error al cargar las categorías:", error)
      );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProducto((prevProducto) => {
      return {
        ...prevProducto,
        [name]: value,
      };
    });
  };

  // Manejar el envío del formulario (PUT)
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    try {
      fetch(`http://localhost:4000/api/productos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar el producto");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Producto actualizado:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setMensaje("Hubo un error al actualizar el producto 😢");
        });
      setShowModal(true); // Muestra la alerta emergente

      setTimeout(() => {
        setShowModal(false); // Cierra la alerta
        navigate("/inventario"); // Redirige a inventario
      }, 2000); // Espera 2 segundos antes de redirigir
    } catch (error) {
      alert("Error al actualizar el producto"); // O puedes mostrar un modal de error
    }
  };

  return (
    <Container className="mt-4 pb-5">
      <Form onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">📦 Actualizar Producto</h2>
        <FloatingLabel
          controlId="nombre_producto"
          label="Nombre del producto:"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="nombre_producto"
            value={producto.nombre_producto}
            onChange={handleChange}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="id_categoria_producto"
          label="Categoría:"
          className="mb-3"
        >
          <Form.Select
            name="id_categoria_producto"
            value={producto.id_categoria_producto}
            onChange={handleChange}
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option
                key={categoria.id_categoria}
                value={categoria.id_categoria}
              >
                {categoria.descripcion_categoria}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel
          controlId="descripcion_producto"
          label="Descripción:"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="descripcion_producto"
            value={producto.descripcion_producto}
            onChange={handleChange}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="precioventaact_producto"
          label="Precio de venta actual:"
          className="mb-3"
        >
          <Form.Control
            type="number"
            name="precioventaact_producto"
            value={producto.precioventaact_producto}
            onChange={handleChange}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="costoventa_producto"
          label="Costo de venta:"
          className="mb-3"
        >
          <Form.Control
            type="number"
            name="costoventa_producto"
            value={producto.costoventa_producto}
            onChange={handleChange}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="valoriva_producto"
          label="IVA (%):"
          className="mb-3"
        >
          <Form.Control
            type="number"
            name="valoriva_producto"
            min="0"
            max="100"
            value={
              producto.valoriva_producto
                ? Math.round(producto.valoriva_producto * 100)
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
          />
        </FloatingLabel>
        <Button variant="primary" type="submit">
          Actualizar
        </Button>
        {/* Modal de éxito */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Actualización exitosa</Modal.Title>
          </Modal.Header>
          <Modal.Body>El producto se actualizó correctamente.</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => navigate("/inventario")}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Container>
  );
}

export default ActualizarProducto;
