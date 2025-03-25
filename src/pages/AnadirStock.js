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

  const verificarSiExiste = async (idSede) => {
    if (!producto) return false;
    try {
      const response = await fetch(
        `http://localhost:4000/api/inventariolocal/existe/${producto.id_producto}/${idSede}`
      );
      const data = await response.json();
      return data.existe; // Retorna true si el producto ya está en la sede
    } catch (error) {
      console.error("Error verificando existencia del producto", error);
      return false;
    }
  };

  const agregarSede = async () => {
    if (!sedeSeleccionada || !producto) {
      alert("Seleccione un producto y una sede");
      return;
    }

    // Verificar si la sede ya está en la lista antes de hacer la consulta
    if (stockPorSede.some((s) => s.sede === sedeSeleccionada)) {
      alert("Esta sede ya ha sido agregada.");
      return;
    }

    const yaExiste = await verificarSiExiste(sedeSeleccionada);

    setStockPorSede([
      ...stockPorSede,
      {
        sede: sedeSeleccionada,
        cantidad: "",
        stockMinimo: yaExiste ? null : "",
        stockMaximo: yaExiste ? null : "",
        existe: yaExiste,
      },
    ]);
    setSedeSeleccionada("");
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

    try {
      const respuestas = await Promise.all(
        stockPorSede.map(async (s) => {
          let url, method, bodyData;

          if (s.existe) {
            // Aquí corregimos la URL de PATCH
            url = `http://localhost:4000/api/inventariolocal/${producto.id_producto}/${s.sede}/ajustar`;
            method = "PATCH";
            bodyData = { cantidad: Number(s.cantidad) };
          } else {
            url = "http://localhost:4000/api/inventariolocal";
            method = "POST";
            bodyData = {
              id_producto_inventariolocal: producto.id_producto,
              id_sede_inventariolocal: Number(s.sede),
              existencia_inventariolocal: Number(s.cantidad),
              stockminimo_inventariolocal: s.stockMinimo
                ? Number(s.stockMinimo)
                : 0, // Valor predeterminado
              stockmaximo_inventariolocal: s.stockMaximo
                ? Number(s.stockMaximo)
                : 1, // Valor predeterminado
            };
          }

          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Error al añadir stock");
          }
          return data;
        })
      );

      alert("Stock actualizado correctamente");
      setStockPorSede([]);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error de conexión con el servidor");
    }
  };

  return (
    <Container className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Añadir Stock</h2>
      <Form onSubmit={handleSubmit}>
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

        {stockPorSede.map((s, index) => (
          <InputGroup className="mb-3" key={index}>
            <Form.Control
              type="text"
              value={
                sedes.find((x) => x.id_sede === Number(s.sede))?.nombre_sede ||
                ""
              }
              readOnly
            />

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

            {!s.existe && (
              <>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="Stock Mín."
                  value={s.stockMinimo}
                  onChange={(e) =>
                    actualizarCantidad(index, "stockMinimo", e.target.value)
                  }
                />

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
              </>
            )}

            <Button variant="danger" onClick={() => eliminarSede(index)}>
              ❌
            </Button>
          </InputGroup>
        ))}

        <Button type="submit" className="w-100 mt-3" variant="primary">
          Guardar Stock
        </Button>
      </Form>

      <SeleccionarProductoGeneral
        show={showProductoModal}
        handleClose={() => setShowProductoModal(false)}
        setProducto={setProducto}
      />
    </Container>
  );
}
