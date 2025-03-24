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
import SeleccionarCliente from "./SeleccionarCliente";
import SeleccionarProveedor from "./SeleccionarProveedor";
import { Modal } from "react-bootstrap";

export default function AnadirNovedad() {
  const [tipoMov, setTipoMov] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [estado, setEstado] = useState("Pendiente");
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [sede, setSede] = useState("");
  const [sedeDestino, setSedeDestino] = useState("");
  const [cliente, setCliente] = useState("");
  const [clientes, setClientes] = useState([]);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const navigate = useNavigate();
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [proveedor, setProveedor] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [mostrarCamposStock, setMostrarCamposStock] = useState(false);
  const [stockMinimo, setStockMinimo] = useState("");
  const [stockMaximo, setStockMaximo] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/movimientos/tipo")
      .then((response) => response.json())
      .then((data) => setTiposMovimiento(data))
      .catch((error) =>
        console.error("Error cargando tipos de movimiento", error)
      );

    fetch("http://localhost:4000/api/sedes")
      .then((response) => response.json())
      .then((data) => setSedes(data))
      .catch((error) => console.error("Error cargando sedes", error));

    fetch("http://localhost:4000/api/clientes")
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error("Error cargando clientes", error));

    fetch("http://localhost:4000/api/proveedores/all")
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => console.error("Error cargando proveedores", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0.");
      return; // ⛔ Evita el envío del formulario
    }

    const novedad = {
      ID_TIPOMOV_MOVIMIENTO: Number(tipoMov),
      ID_PRODUCTO_MOVIMIENTO: producto ? Number(producto.id_producto) : null,
      CANTIDAD_MOVIMIENTO: Number(cantidad),
      FECHA_MOVIMIENTO: fecha,
      ESTADO_MOVIMIENTO: "A", // 🔥 Siempre "A"
      ID_SEDE_MOVIMIENTO: Number(sede),
      ID_SEDEDESTINO_MOVIMIENTO:
        tipoMov === "5" ? (sedeDestino ? Number(sedeDestino) : null) : null,
      ID_CLIENTE_MOVIMIENTO:
        tipoMov === "3" || tipoMov === "6"
          ? clienteSeleccionado?.id_cliente ?? null
          : null,
      ID_PROVEEDOR_MOVIMIENTO:
        tipoMov === "7" || tipoMov === "9"
          ? proveedorSeleccionado?.id_proveedor ?? null
          : null,
    };

    if (stockMinimo && stockMaximo) {
      novedad.STOCK_MINIMO = Number(stockMinimo);
      novedad.STOCK_MAXIMO = Number(stockMaximo);
    }

    try {
      const response = await fetch("http://localhost:4000/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novedad),
      });

      const data = await response.json();
      console.log("📩 Respuesta del servidor:", data);

      if (data.error === "FALTA_STOCK") {
        alert(
          "El producto no existe en la sede destino. Ingrese stock mínimo y máximo."
        );
        setMostrarCamposStock(true); // ✅ Muestra los nuevos inputs
        return; // ⛔ Evita la recarga de la página
      }

      if (response.ok) {
        alert("Novedad registrada exitosamente.");
        navigate("/inventario");
      } else {
        console.error("❌ Error al registrar la novedad:", data);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("🔌 Error de conexión", error);
      alert("Error de conexión con el servidor.");
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

        <FloatingLabel controlId="sede" label="Sede" className="mb-3">
          <Form.Select
            value={sede}
            onChange={(e) => setSede(e.target.value)}
            required
          >
            <option value="">Seleccione Sede</option>
            {sedes.map((s) => (
              <option key={s.id_sede} value={s.id_sede}>
                {s.nombre_sede}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        {tipoMov === "5" && (
          <FloatingLabel
            controlId="sedeDestino"
            label="Sede Destino"
            className="mb-3"
          >
            <Form.Select
              value={sedeDestino}
              onChange={(e) => setSedeDestino(e.target.value)}
            >
              <option value="">Seleccione Sede Destino</option>
              {sedes.map((s) => (
                <option key={s.id_sede} value={s.id_sede}>
                  {s.nombre_sede}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        )}

        {/* Cliente */}
        {(tipoMov === "3" || tipoMov === "6") && (
          <InputGroup className="mb-3">
            <FloatingLabel controlId="cliente" label="Cliente">
              <Form.Control
                type="text"
                value={
                  clienteSeleccionado
                    ? `${clienteSeleccionado.id_cliente} - ${clienteSeleccionado.nombre} (${clienteSeleccionado.tipo})`
                    : "Seleccione un cliente"
                }
                readOnly
                required
              />
            </FloatingLabel>
            <Button
              variant="secondary"
              onClick={() => setShowClienteModal(true)}
            >
              Seleccionar
            </Button>
          </InputGroup>
        )}

        {/* Proveedor */}
        {(tipoMov === "7" || tipoMov === "9") && (
          <InputGroup className="mb-3">
            <FloatingLabel controlId="proveedor" label="Proveedor">
              <Form.Control
                type="text"
                value={
                  proveedorSeleccionado
                    ? `${proveedorSeleccionado.id_proveedor} - ${proveedorSeleccionado.nombre_proveedor}`
                    : "Seleccione un proveedor"
                }
                readOnly
                required
              />
            </FloatingLabel>
            <Button
              variant="secondary"
              onClick={() => setShowProveedorModal(true)}
            >
              Seleccionar
            </Button>
          </InputGroup>
        )}

        <InputGroup className="mb-3">
          <FloatingLabel controlId="producto" label="Producto">
            <Form.Control
              type="text"
              value={producto ? producto.nombre_producto : ""}
              readOnly
              required
              onChange={() => console.log("📌 Producto en input:", producto)}
            />
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
            min="1" // ⛔ Evita valores negativos y ceros desde el input
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
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

        {mostrarCamposStock && (
          <>
            <FloatingLabel
              controlId="stockMinimo"
              label="Stock Mínimo"
              className="mb-3"
            >
              <Form.Control
                type="number"
                min="0"
                onChange={(e) => setStockMinimo(e.target.value)}
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="stockMaximo"
              label="Stock Máximo"
              className="mb-3"
            >
              <Form.Control
                type="number"
                min="0"
                onChange={(e) => setStockMaximo(e.target.value)}
                required
              />
            </FloatingLabel>
          </>
        )}

        <Button type="submit" className="w-100 mt-3" variant="primary">
          Guardar
        </Button>
      </Form>
      <SeleccionarProducto
        show={showProductoModal}
        handleClose={() => setShowProductoModal(false)}
        setProducto={setProducto}
        idSede={sede} // ✅ Se pasa la ID de la sede seleccionada
      />
      <SeleccionarCliente
        show={showClienteModal}
        handleClose={() => setShowClienteModal(false)}
        setCliente={setClienteSeleccionado}
      />
      <SeleccionarProveedor
        show={showProveedorModal}
        handleClose={() => setShowProveedorModal(false)}
        setProveedor={setProveedorSeleccionado}
      />
    </Container>
  );
}
