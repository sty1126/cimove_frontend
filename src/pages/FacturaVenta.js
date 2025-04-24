import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FacturaVenta = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    carrito: cart,
    clienteSeleccionado,
    total,
    subtotal,
    descuento,
    iva,
  } = location.state || {};

  const [metodosPago, setMetodosPago] = useState([]); // Estado para los métodos de pago
  const [metodosSeleccionados, setMetodosSeleccionados] = useState([]); // Métodos de pago seleccionados
  const [generarElectronica, setGenerarElectronica] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [aplicaGarantia, setAplicaGarantia] = useState(false);
  const [fechaGarantia, setFechaGarantia] = useState("");

  useEffect(() => {
    if (!cart || !Array.isArray(cart)) {
      setError("No se han recibido datos de la venta. Redirigiendo...");
      setTimeout(() => {
        navigate("/ventas");
      }, 2000);
    }

    // Cargar los métodos de pago
    axios
      .get("http://localhost:4000/api/tipometodopago") // URL de tu API
      .then((response) => {
        setMetodosPago(response.data); // Guardamos los métodos de pago en el estado
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los métodos de pago.");
      });
  }, [cart, navigate]);

  const agregarMetodoPago = () => {
    setMetodosSeleccionados([
      ...metodosSeleccionados,
      { id: "", monto: 0, nombre: "", comision: 0, recepcion: "" },
    ]);
  };
  const validarFechaGarantia = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Elimina la hora para comparar solo fechas
    const fechaSeleccionada = new Date(fecha);
    return fechaSeleccionada > hoy;
  };

  const eliminarMetodoPago = (index) => {
    const nuevosMetodos = [...metodosSeleccionados];
    nuevosMetodos.splice(index, 1);
    setMetodosSeleccionados(nuevosMetodos);
  };

  const handleMetodoChange = (index, field, value) => {
    const updatedMetodos = [...metodosSeleccionados];
    updatedMetodos[index][field] = field === "id" ? parseInt(value) : value;
    // Asegúrate de que el valor de 'id' se mapea a 'id_tipometodopago_metodopago'
    if (field === "id") {
      updatedMetodos[index].id_tipometodopago_metodopago = parseInt(value);
    }
    setMetodosSeleccionados(updatedMetodos);
    console.log("Métodos de pago actualizados:", updatedMetodos);
  };

  const montoTotalIngresado = metodosSeleccionados.reduce(
    (acc, m) => acc + parseFloat(m.monto || 0),
    0
  );

  const confirmarVenta = async () => {
    // Verificar que todos los métodos de pago tienen un id_tipometodopago_metodopago válido
    for (let metodo of metodosSeleccionados) {
      if (!metodo.id_tipometodopago_metodopago) {
        setError(
          "Todos los métodos de pago deben tener un tipo de pago seleccionado."
        );
        return;
      }
    }

    try {
      const venta = {
        idCliente: clienteSeleccionado?.id_cliente || null,
        subtotal,
        descuento,
        iva,
        total,
        saldo: total,
        detalles: cart.map((prod) => ({
          idProducto: prod.id,
          cantidad: prod.cantidad,
          precioVenta: prod.precioVenta || prod.precio || 0,
          valorIVA: prod.valorIVA || 0,
          idSede: prod.idSede,
        })),
        metodosPago: metodosSeleccionados.map((metodo) => ({
          idTipoMetodoPago: metodo.id,
          monto: parseFloat(metodo.monto),
        })),

        generarElectronica,
        aplicaGarantia,
        fechaGarantia: aplicaGarantia ? fechaGarantia : null,
      };

      console.log("Datos a enviar al backend:", venta);

      const response = await axios.post(
        "http://localhost:4000/api/factura",
        venta
      );

      if (response.status === 201) {
        setExito("¡Venta registrada exitosamente!");
        setTimeout(() => {
          navigate("/facturacion-ventas");
        }, 2000);
      } else {
        setError("Error al registrar la venta.");
      }
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al registrar la venta.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Confirmar Venta</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {exito && <Alert variant="success">{exito}</Alert>}

      {cart && Array.isArray(cart) && (
        <>
          <Row className="mb-4">
            <Col>
              <h5>Cliente:</h5>
              <p>
                {clienteSeleccionado
                  ? clienteSeleccionado.nombre_cliente
                  : "Consumidor final"}
              </p>
            </Col>
            <Col>
              <h5>Resumen:</h5>
              <p>Subtotal: ${subtotal?.toFixed(2) || 0}</p>
              <p>Descuento: ${descuento?.toFixed(2) || 0}</p>
              <p>IVA: ${iva?.toFixed(2) || 0}</p>
              <h5>Total: ${total?.toFixed(2) || 0}</h5>
            </Col>
          </Row>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((prod, index) => (
                  <tr key={index}>
                    <td>{prod.nombre}</td>
                    <td>{prod.cantidad}</td>
                    <td>${(prod.precioVenta || prod.precio).toFixed(2)}</td>
                    <td>
                      $$
                      {(
                        (prod.precioVenta || prod.precio) * prod.cantidad
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay productos en el carrito.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Label>Métodos de pago</Form.Label>

              {metodosSeleccionados.map((metodo, index) => (
                <div key={index}>
                  <Row className="mb-2">
                    <Col>
                      <Form.Select
                        value={metodo.id}
                        onChange={(e) =>
                          handleMetodoChange(index, "id", e.target.value)
                        }
                      >
                        <option value="">Seleccione un método</option>
                        {metodosPago.map((metodoPago) => {
                          const yaSeleccionado = metodosSeleccionados.some(
                            (m, i) =>
                              m.id === metodoPago.id_tipometodopago &&
                              i !== index
                          );
                          return (
                            <option
                              key={metodoPago.id_tipometodopago}
                              value={metodoPago.id_tipometodopago}
                              disabled={yaSeleccionado}
                            >
                              {metodoPago.nombre_tipometodopago}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        value={metodo.monto}
                        onChange={(e) =>
                          handleMetodoChange(index, "monto", e.target.value)
                        }
                        placeholder="Monto"
                      />
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => eliminarMetodoPago(index)}
                      >
                        Eliminar
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}

              <Button variant="secondary" onClick={agregarMetodoPago}>
                Agregar otro método de pago
              </Button>

              <Row className="mt-3">
                <Col>
                  <h5>Total a pagar: ${total.toFixed(2)}</h5>
                  <h5
                    style={{
                      color:
                        metodosSeleccionados.reduce(
                          (acc, m) => acc + parseFloat(m.monto || 0),
                          0
                        ) === total
                          ? "green"
                          : "red",
                    }}
                  >
                    Total ingresado: $
                    {metodosSeleccionados
                      .reduce((acc, m) => acc + parseFloat(m.monto || 0), 0)
                      .toFixed(2)}
                  </h5>
                  <h6
                    style={{
                      color: total > montoTotalIngresado ? "red" : "green",
                    }}
                  >
                    Faltante: ${(total - montoTotalIngresado).toFixed(2)}
                  </h6>

                  {metodosSeleccionados.reduce(
                    (acc, m) => acc + parseFloat(m.monto || 0),
                    0
                  ) !== total && (
                    <Alert variant="warning">
                      La suma de los métodos de pago no coincide con el total.
                    </Alert>
                  )}
                </Col>

                <Form.Group className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="¿Aplica garantía?"
                    checked={aplicaGarantia}
                    onChange={(e) => setAplicaGarantia(e.target.checked)}
                  />
                </Form.Group>

                {aplicaGarantia && (
                  <Form.Group className="mt-2">
                    <Form.Label>Fecha de vencimiento de la garantía</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaGarantia}
                      min={
                        new Date(Date.now() + 86400000)
                          .toISOString()
                          .split("T")[0]
                      } // mañana
                      onChange={(e) => {
                        const seleccionada = new Date(e.target.value);
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);
                        if (seleccionada <= hoy) {
                          setError(
                            "La fecha de garantía debe ser posterior al día de hoy."
                          );
                          setFechaGarantia("");
                        } else {
                          setError(""); // limpiamos si estaba mostrando algún error
                          setFechaGarantia(e.target.value);
                        }
                      }}
                    />
                  </Form.Group>
                )}
              </Row>
              <Button
                variant="success"
                className="mt-4"
                onClick={confirmarVenta}
                disabled={
                  montoTotalIngresado !== total ||
                  (aplicaGarantia && !validarFechaGarantia(fechaGarantia))
                }
              >
                Confirmar y Registrar Venta
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default FacturaVenta;
