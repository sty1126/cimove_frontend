import { useEffect, useState } from "react";
import { Button, Card, Row, Col, Form } from "react-bootstrap";
import SeleccionarClientePorSede from "./SeleccionarClientePorSede";
import { useNavigate } from "react-router-dom";

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [selectedSede, setSelectedSede] = useState("general");
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [codigoInput, setCodigoInput] = useState("");
  const [cliente, setCliente] = useState(null);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [bloquearSede, setBloquearSede] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const sede = sedes.find((s) => s.nombre_sede === selectedSede);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/categorias")
      .then((res) => res.json())
      .then(setCategorias);

    fetch("http://localhost:4000/api/sedes")
      .then((res) => res.json())
      .then(setSedes);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSede) return;

      try {
        const sede = sedes.find((s) => s.nombre_sede === selectedSede);
        if (!sede) return;

        const res = await fetch(
          `http://localhost:4000/api/inventariolocal/sede/${sede.id_sede}`
        );
        const data = await res.json();

        const transformados = data.map((p) => ({
          id: p.id_producto,
          nombre: p.nombre_producto,
          codigo: p.id_producto,
          precio: p.precioventaact_producto,
          iva: p.precioventaact_producto * p.valoriva_producto,
          categoria: p.id_categoria_producto,
          stock: p.existencia_inventariolocal,
        }));

        setProductos(transformados);
      } catch (err) {
        console.error("Error cargando productos", err);
      }
    };

    fetchData();
  }, [selectedSede, sedes]);

  useEffect(() => {
    if (cliente || carrito.length > 0) {
      setBloquearSede(true);
    } else {
      setBloquearSede(false);
    }
  }, [cliente, carrito]);

  const validarYProcesarVenta = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const sede = sedes.find((s) => s.nombre_sede === selectedSede);
    if (!sede) {
      alert("Seleccione una sede válida.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/api/inventariolocal/sede/${sede.id_sede}`
      );
      const inventario = await res.json();

      const faltantes = carrito.filter((item) => {
        const stockProducto = inventario.find(
          (inv) => inv.id_producto === item.id
        );
        return (
          !stockProducto ||
          stockProducto.existencia_inventariolocal < item.cantidad
        );
      });

      if (faltantes.length > 0) {
        let mensaje =
          "Los siguientes productos no tienen suficiente stock:\n\n";
        faltantes.forEach((p) => {
          mensaje += `- ${p.nombre} (Cantidad requerida: ${p.cantidad})\n`;
        });
        alert(mensaje);
        return;
      }

      // 🔥 Agregar idSede a cada producto del carrito
      const carritoConSede = carrito.map((producto) => ({
        ...producto,
        idSede: sede.id_sede,
      }));

      navigate("/factura", {
        state: {
          clienteSeleccionado: cliente, // puede ser null
          subtotal,
          descuento,
          iva: totalIVA,
          total: totalFinal,
          carrito: carritoConSede,
        },
      });
    } catch (error) {
      console.error("Error al validar stock:", error);
      alert("Ocurrió un error al validar el inventario.");
    }
  };

  const agregarProducto = (producto) => {
    const index = carrito.findIndex((item) => item.id === producto.id);
    if (index !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito[index].cantidad += 1;
      // Actualizar el IVA de ese producto en el carrito, ya que podría cambiar
      nuevoCarrito[index].iva = producto.iva;
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([
        ...carrito,
        {
          id: producto.id,
          nombre: producto.nombre,
          codigo: producto.codigo,
          precio: producto.precio,
          cantidad: 1,
          iva: producto.iva, // Usar el IVA específico del producto
        },
      ]);
    }
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const nuevoCarrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    setCarrito(nuevoCarrito);
  };

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
  };

  const buscarPorCodigo = async () => {
    if (!codigoInput.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/productos/${codigoInput}`
      );

      if (!res.ok) throw new Error("Producto no encontrado");

      const producto = await res.json();

      const prodTransformado = {
        id: producto.id_producto,
        nombre: producto.nombre_producto,
        codigo: producto.codigo_producto,
        precio: producto.precioventaact_producto,
        iva: producto.precioventaact_producto * producto.valoriva_producto,
        categoria: producto.id_categoria_producto,
        stock: producto.existencia || 0,
      };

      agregarProducto(prodTransformado);
    } catch (err) {
      alert("Producto no encontrado");
      console.error("Error buscando producto:", err);
    }

    setCodigoInput("");
  };

  // Calcular total bruto (precio sin IVA)
  const totalBruto = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // Calcular el IVA total, solo como valor separado
  const totalIVA = carrito.reduce(
    (acc, item) => acc + item.iva * item.cantidad,
    0
  );

  // El subtotal es solo el total bruto (sin IVA)
  const subtotal = totalBruto;

  // El total final es el subtotal menos el descuento
  const totalFinal = subtotal - descuento;

  return (
    <div className="container-fluid mt-3">
      <Row className="mb-3">
        <Col>
          <Form.Select
            value={selectedSede}
            onChange={(e) => setSelectedSede(e.target.value)}
            disabled={bloquearSede}
          >
            <option value="general">Seleccionar sede</option>
            {sedes.map((s) => (
              <option key={s.id_sede} value={s.nombre_sede}>
                {s.nombre_sede}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-2 d-flex">
            <Button variant="primary" onClick={() => setFiltroCategoria(null)}>
              Todos
            </Button>
            {categorias.map((cat) => (
              <Button
                key={cat.id_categoria}
                variant="secondary"
                className="ms-2"
                onClick={() => setFiltroCategoria(cat.id_categoria)}
              >
                {cat.descripcion_categoria}
              </Button>
            ))}
          </div>

          <Row>
            {productos
              .filter(
                (p) => !filtroCategoria || p.categoria === filtroCategoria
              )
              .map((p) => (
                <Col md={6} className="mb-3" key={p.id}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{p.nombre}</Card.Title>
                      <Card.Text>
                        Precio: {p.precio} <br />
                        Código: {p.codigo}
                      </Card.Text>
                      <Button onClick={() => agregarProducto(p)}>
                        Agregar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Control
              placeholder="Código"
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value)}
              className="me-2"
            />
            <Button onClick={buscarPorCodigo}>+</Button>
            <Button className="ms-2">📷</Button>
          </Form.Group>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Cliente</Card.Title>

              {!cliente ? (
                <div className="d-flex align-items-center">
                  <Button onClick={() => setShowModalCliente(true)}>
                    Seleccionar cliente
                  </Button>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center w-100">
                  <div>
                    <strong>{cliente.nombre || cliente.razon_social}</strong>{" "}
                  </div>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setCliente(null);
                    }}
                  >
                    Cambiar cliente
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Modal de selección de cliente */}
          <SeleccionarClientePorSede
            show={showModalCliente}
            handleClose={() => setShowModalCliente(false)}
            setCliente={setCliente}
            selectedSede={selectedSede} // Pasar el selectedSede
            sedes={sedes} // Pasar las sedes
          />

          {cliente && (
            <div className="alert alert-info">
              <strong>Cliente:</strong> {cliente.nombre_razon} -{" "}
              {cliente.documento}
            </div>
          )}

          <div className="mb-2">
            {carrito.map((item) => (
              <Card className="mb-1" key={item.id}>
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.nombre}</strong> <br />
                    <small>{item.codigo}</small>
                  </div>

                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        actualizarCantidad(item.id, item.cantidad - 1)
                      }
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      value={item.cantidad}
                      onChange={(e) =>
                        actualizarCantidad(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      style={{ width: "60px", margin: "0 5px" }}
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        actualizarCantidad(item.id, item.cantidad + 1)
                      }
                    >
                      +
                    </Button>
                  </div>

                  <div className="d-flex align-items-center">
                    <div style={{ marginRight: "10px" }}>
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminarProducto(item.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="mt-3">
            <p>Total bruto: {totalBruto}</p>
            <p>IVA: {totalIVA.toFixed(2)}</p>
            <p>
              Descuento:
              <Form.Control
                type="number"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value))}
                style={{
                  width: "100px",
                  display: "inline",
                  marginLeft: "10px",
                }}
              />
            </p>
            <p>Subtotal: {subtotal.toFixed(2)}</p>
            <h4>Total: {totalFinal.toFixed(2)}</h4>
          </div>
          <Button variant="success" onClick={validarYProcesarVenta}>
            Procesar venta
          </Button>
        </Col>
      </Row>
    </div>
  );
}
