import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetallesProducto = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const { productoId } = useParams();

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:4000/api/productos/detalle/${productoId}`).then(
        (res) => res.json()
      ),
      fetch(
        `http://localhost:4000/api/productos/${productoId}/proveedores`
      ).then((res) => res.json()),
    ])
      .then(([productoData, proveedoresData]) => {
        console.log("Datos recibidos en el frontend:", productoData);
        console.log("Proveedores recibidos:", proveedoresData);
        setProduct(productoData);
        setProveedores(proveedoresData);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productoId]);

  if (loading) return <p className="text-center text-gray-600">Cargando...</p>;
  if (!product)
    return (
      <p className="text-center text-red-500">No se encontró el producto.</p>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Detalles del Producto
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="mb-2">
          <strong>Nombre:</strong> {product.nombre_producto}
        </p>
        <p className="mb-2">
          <strong>Descripción:</strong>{" "}
          {product.descripcion_producto || "No disponible"}
        </p>
        <p className="mb-2">
          <strong>Categoría:</strong> {product.categoria || "No disponible"}
        </p>
        <p className="mb-2">
          <strong>Precio de Venta Actual:</strong> $
          {product.precioventaact_producto}
        </p>
        <p className="mb-2">
          <strong>Precio de Venta Anterior:</strong>{" "}
          {product.precioventaant_producto
            ? `$${product.precioventaant_producto}`
            : "No disponible"}
        </p>
        <p className="mb-2">
          <strong>Costo de Venta:</strong> ${product.costoventa_producto}
        </p>
        <p className="mb-2">
          <strong>Margen de Utilidad:</strong> $
          {product.margenutilidad_producto}
        </p>
        <p className="mb-2">
          <strong>IVA:</strong> {product.valoriva_producto * 100}%
        </p>
        <p className="mb-2">
          <strong>Estado:</strong> {product.estado_producto}
        </p>
        <p className="mb-2">
          <strong>Existencia Total:</strong> {product.existencia_total || 0}
        </p>
      </div>

      <h2 className="text-xl font-bold text-center mt-10 mb-6">
        Inventario en Sedes
      </h2>

      {product.inventario_sedes && product.inventario_sedes.length > 0 ? (
        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Sede</th>
                <th className="border border-gray-300 px-4 py-2">Existencia</th>
                <th className="border border-gray-300 px-4 py-2">
                  Stock Mínimo
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Stock Máximo
                </th>
              </tr>
            </thead>
            <tbody>
              {product.inventario_sedes.map((inv, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.sede_nombre}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.existencia}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.stock_minimo || "No disponible"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.stock_maximo || "No definido"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No hay información de inventario en sedes.
        </p>
      )}

      {/* Sección de Proveedores */}
      <h2 className="text-xl font-bold text-center mt-16 mb-6">Proveedores</h2>
      {proveedores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Teléfono</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((prov, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {prov.nombre_proveedor}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {prov.telefono_proveedor}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {prov.email_proveedor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No hay proveedores asociados a este producto.
        </p>
      )}
    </div>
  );
};

export default DetallesProducto;
