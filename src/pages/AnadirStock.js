import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  FloatingLabel,
  InputGroup,
} from "react-bootstrap";
import SeleccionarProductoGeneral from "./SeleccionarProductoGeneral";

export default function AnadirStock() {
  const [producto, setProducto] = useState(null);
  const [sedes, setSedes] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [stockPorSede, setStockPorSede] = useState([]);
  const [showProductoModal, setShowProductoModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/sedes")
      .then((response) => response.json())
      .then((data) => setSedes(data))
      .catch((error) => console.error("Error cargando sedes", error));
  }, []);

  const agregarSede = () => {
    if (
      sedeSeleccionada &&
      !stockPorSede.some((s) => s.sede === sedeSeleccionada)
    ) {
      setStockPorSede([
        ...stockPorSede,
        {
          sede: sedeSeleccionada,
          cantidad: "",
          stockMinimo: "",
          stockMaximo: "",
        },
      ]);
      setSedeSeleccionada("");
    }
  };

  const actualizarCantidad = (index, campo, valor) => {
    const nuevoStock = [...stockPorSede];
    nuevoStock[index][campo] = valor;
    setStockPorSede(nuevoStock);
  };

  const eliminarSede = (index) => {
    setStockPorSede(stockPorSede.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto) {
      alert("Seleccione un producto");
      return;
    }

    const datosAEnviar = stockPorSede.map((s) => ({
      ID_PRODUCTO_INVENTARIOLOCAL: producto.id_producto,
      ID_SEDE_INVENTARIOLOCAL: Number(s.sede),
      EXISTENCIA_INVENTARIOLOCAL: Number(s.cantidad),
      STOCKMINIMO_INVENTARIOLOCAL: s.stockMinimo ? Number(s.stockMinimo) : null, // ✅ Corrige NaN
      STOCKMAXIMO_INVENTARIOLOCAL: Number(s.stockMaximo),
    }));

    try {
      const response = await fetch(
        "http://localhost:4000/api/inventario/agregar-stock",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosAEnviar),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Stock agregado exitosamente");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error de conexión", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <Container className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Añadir Stock</h2>
      <Form onSubmit={handleSubmit}>
        {/* Selección de Producto */}
        <InputGroup className="mb-3">
          <FloatingLabel controlId="producto" label="Producto">
            <Form.Control
              type="text"
              value={
                producto ? producto.nombre_producto : "Seleccione un producto"
              }
              readOnly
            />
          </FloatingLabel>
          <Button
            variant="secondary"
            onClick={() => setShowProductoModal(true)}
          >
            Seleccionar
          </Button>
        </InputGroup>

        {/* Selección de Sede */}
        <FloatingLabel controlId="sede" label="Sede" className="mb-3">
          <Form.Select
            value={sedeSeleccionada}
            onChange={(e) => setSedeSeleccionada(e.target.value)}
          >
            <option value="">Seleccione una sede</option>
            {sedes.map((s) => (
              <option key={s.id_sede} value={s.id_sede}>
                {s.nombre_sede}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <Button variant="primary" onClick={agregarSede} className="mb-3">
          Añadir Sede
        </Button>

        {/* Lista de Sedes con Cantidad, Stock Mínimo y Máximo */}
        {stockPorSede.map((s, index) => (
          <InputGroup className="mb-3" key={index}>
            {/* Nombre de la Sede */}
            <Form.Control
              type="text"
              value={
                sedes.find((x) => x.id_sede === Number(s.sede))?.nombre_sede ||
                ""
              }
              readOnly
            />

            {/* Cantidad de Stock */}
            <Form.Control
              type="number"
              min="0"
              placeholder="Stock"
              value={s.cantidad}
              onChange={(e) =>
                actualizarCantidad(index, "cantidad", e.target.value)
              }
              required
            />

            {/* Stock Mínimo */}
            <Form.Control
              type="number"
              min="0"
              placeholder="Stock Mín."
              value={s.stockMinimo}
              onChange={(e) =>
                actualizarCantidad(index, "stockMinimo", e.target.value)
              }
            />

            {/* Stock Máximo */}
            <Form.Control
              type="number"
              min="1"
              placeholder="Stock Máx."
              value={s.stockMaximo}
              onChange={(e) =>
                actualizarCantidad(index, "stockMaximo", e.target.value)
              }
              required
            />

            <Button variant="danger" onClick={() => eliminarSede(index)}>
              ❌
            </Button>
          </InputGroup>
        ))}

        <Button type="submit" className="w-100 mt-3" variant="primary">
          Guardar Stock
        </Button>
      </Form>

      {/* Modal para seleccionar el producto */}
      <SeleccionarProductoGeneral
        show={showProductoModal}
        handleClose={() => setShowProductoModal(false)}
        setProducto={setProducto}
      />
    </Container>
  );
}
