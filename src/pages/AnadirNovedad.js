import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FloatingLabel,
  Button,
  Container,
  InputGroup,
} from "react-bootstrap";
import SeleccionarProducto from "./SeleccionarProducto";

export default function AgregarNovedad() {
  const [tipoMov, setTipoMov] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [estado, setEstado] = useState("Pendiente");
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/movimientos/tipo")
      .then((response) => response.json())
      .then((data) => setTiposMovimiento(data))
      .catch((error) =>
        console.error("Error cargando tipos de movimiento", error)
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novedad = {
      ID_TIPOMOV: tipoMov,
      ID_PRODUCTO: producto,
      CANTIDAD_MOV: cantidad,
      FECHA_MOVIMIENTO: fecha,
      ESTADO_MOVIMIENTO: estado,
    };

    try {
      const response = await fetch("/api/novedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novedad),
      });

      if (response.ok) {
        navigate("/inventario");
      } else {
        console.error("Error al registrar la novedad");
      }
    } catch (error) {
      console.error("Error de conexión", error);
    }
  };

  return (
    <Container className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Agregar Novedad</h2>
      <Form onSubmit={handleSubmit}>
        <FloatingLabel
          controlId="tipoMov"
          label="Tipo de Movimiento"
          className="mb-3"
        >
          <Form.Select
            value={tipoMov}
            onChange={(e) => setTipoMov(e.target.value)}
            required
          >
            <option value="">Seleccione Tipo de Movimiento</option>
            {tiposMovimiento.map((tipo) => (
              <option key={tipo.id_tipomov} value={tipo.id_tipomov}>
                {tipo.nom_tipomov}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <InputGroup className="mb-3">
          <FloatingLabel controlId="producto" label="Producto">
            <Form.Control type="text" value={producto} readOnly required />
          </FloatingLabel>
          <Button
            variant="secondary"
            onClick={() => setShowProductoModal(true)}
          >
            Seleccionar
          </Button>
        </InputGroup>

        <FloatingLabel controlId="cantidad" label="Cantidad" className="mb-3">
          <Form.Control
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="fecha"
          label="Fecha de Movimiento"
          className="mb-3"
        >
          <Form.Control
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel controlId="estado" label="Estado" className="mb-3">
          <Form.Select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
          </Form.Select>
        </FloatingLabel>

        <Button type="submit" className="w-100 mt-3" variant="primary">
          Guardar
        </Button>
      </Form>

      <SeleccionarProducto
        show={showProductoModal}
        handleClose={() => setShowProductoModal(false)}
        setProducto={setProducto}
      />
    </Container>
  );
}
