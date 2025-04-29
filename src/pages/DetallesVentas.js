import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Table, Spinner, Badge } from "react-bootstrap";

const DetallesFactura = () => {
  const { ventasId } = useParams();
  const [facturaInfo, setFacturaInfo] = useState(null); // datos generales
  const [productos, setProductos] = useState([]); // solo productos
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/factura/${ventasId}`
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          const facturaGeneral = response.data[0]; // datos comunes
          const productosVendidos = response.data.map((producto) => ({
            id: producto.id_producto,
            nombre: producto.nombre_producto,
            descripcion: producto.descripcion_producto,
            cantidad: producto.cantvendida_detallefactura,
            precioVenta: producto.precioventa_detallefactura,
            ivaPorcentaje: producto.valoriva_producto,
            valorIvaAplicado: producto.valoriva_detallefactura,
          }));

          setFacturaInfo(facturaGeneral);
          setProductos(productosVendidos);
        }
      } catch (error) {
        console.error("Error cargando factura:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarFactura();
  }, [ventasId]);

  if (cargando) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (!facturaInfo) {
    return <p>No se encontró la factura.</p>;
  }

  return (
    <div className="container mt-4">
      <Card className="mb-4">
        <Card.Body>
          <h3>
            Factura #{facturaInfo.id_factura}{" "}
            <Badge
              bg={facturaInfo.estado_factura === "A" ? "success" : "danger"}
            >
              {facturaInfo.estado_factura === "A" ? "Activa" : "Inactiva"}
            </Badge>
          </h3>
          <p>
            <strong>Fecha de Factura:</strong>{" "}
            {new Date(facturaInfo.fecha_factura).toLocaleDateString()}
          </p>
          <p>
            <strong>Cliente:</strong>{" "}
            {facturaInfo.id_cliente_factura
              ? `ID Cliente #${facturaInfo.id_cliente_factura}`
              : "Venta a Público General"}
          </p>
          <p>
            <strong>Subtotal:</strong> $
            {facturaInfo.subtotal_factura.toLocaleString()}
          </p>
          <p>
            <strong>IVA:</strong> ${facturaInfo.iva_factura.toLocaleString()}
          </p>
          <p>
            <strong>Descuento:</strong> $
            {facturaInfo.descuento_factura.toLocaleString()}
          </p>
          <p>
            <strong>Total Facturado:</strong> $
            {facturaInfo.total_factura.toLocaleString()}
          </p>
          <p>
            <strong>Saldo Pendiente:</strong> $
            {facturaInfo.saldo_factura.toLocaleString()}
          </p>
          <p>
            <strong>Aplica Garantía:</strong>{" "}
            {facturaInfo.aplicagarantia_factura ? "Sí" : "No"}
          </p>
          {facturaInfo.aplicagarantia_factura &&
            facturaInfo.fechagarantia_factura && (
              <p>
                <strong>Fecha de Garantía:</strong>{" "}
                {new Date(
                  facturaInfo.fechagarantia_factura
                ).toLocaleDateString()}
              </p>
            )}
        </Card.Body>
      </Card>

      <h4>Productos Vendidos</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Descripción</th>
            <th>Cantidad Vendida</th>
            <th>Precio Venta Unitario</th>
            <th>IVA %</th>
            <th>Valor IVA</th>
            <th>Total Producto</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod, idx) => (
            <tr key={idx}>
              <td>{prod.nombre}</td>
              <td>{prod.descripcion}</td>
              <td>{prod.cantidad}</td>
              <td>${prod.precioVenta.toLocaleString()}</td>
              <td>{(prod.ivaPorcentaje * 100).toFixed(2)}%</td>
              <td>${prod.valorIvaAplicado.toLocaleString()}</td>
              <td>${(prod.cantidad * prod.precioVenta).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DetallesFactura;
