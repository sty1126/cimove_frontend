import React, { useEffect, useState } from "react";
import axios from "axios";

const FacturacionProveedor = () => {
  const [facturas, setFacturas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    fetchFacturas();
    fetchProveedores();
  }, []);

  const fetchFacturas = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/facturas-proveedor"
      );
      setFacturas(res.data);
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/proveedores/all");
      setProveedores(res.data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  const formatCurrency = (value) => {
    if (value == null) return "-"; // Si el valor es null o undefined, retorna un guion o algún valor predeterminado
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  const filtrarFacturas = () => {
    return facturas.filter((f) => {
      const estado = (f.estado_facturaproveedor || "").toLowerCase();
      return (
        (filtroProveedor === "" || f.nombre_proveedor === filtroProveedor) &&
        (filtroEstado === "" || estado === filtroEstado)
      );
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Facturación de Proveedores
      </h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          className="border p-2 rounded w-full"
          value={filtroProveedor}
          onChange={(e) => setFiltroProveedor(e.target.value)}
        >
          <option value="">Todos los proveedores</option>
          {proveedores.map((prov) => (
            <option key={prov.id_proveedor} value={prov.nombre_proveedor}>
              {prov.nombre_proveedor}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded w-full"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagada">Pagada</option>
          <option value="parcial">Parcial</option>
        </select>

        <input type="date" className="border p-2 rounded w-full" />
        <input type="date" className="border p-2 rounded w-full" />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">N.º Factura</th>
              <th className="p-2 border">Proveedor</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Monto Total</th>
              <th className="p-2 border">Total Abonado</th>
              <th className="p-2 border">Saldo Pendiente</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarFacturas().map((factura) => {
              const saldo = factura.monto_factura - factura.total_abonado;
              return (
                <tr key={factura.id_factura} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">
                    {factura.id_facturaproveedor}
                  </td>
                  <td className="p-2 border text-center">
                    {factura.nombre_proveedor}
                  </td>
                  <td className="p-2 border text-center">
                    {new Date(factura.fecha_facturaproveedor).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center">
                    {formatCurrency(factura.monto_facturaproveedor)}
                  </td>
                  <td className="p-2 border text-center">
                    {formatCurrency(factura.total_abonado)}
                  </td>
                  <td className="p-2 border text-center">
                    {formatCurrency(saldo)}
                  </td>
                  <td className="p-2 border text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        factura.estado_facturaproveedor === "Pagada"
                          ? "bg-green-600"
                          : factura.estado_facturaproveedor === "Pendiente"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {factura.estado_facturaproveedor}
                    </span>
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                      Ver detalles
                    </button>
                    <button className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                      Registrar abono
                    </button>
                    <button className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                      PDF
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacturacionProveedor;
