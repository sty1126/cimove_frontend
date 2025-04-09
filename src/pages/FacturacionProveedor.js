import React from "react";

const FacturacionProveedor = () => {
  const facturas = [
    {
      id: "F-001",
      proveedor: "Proveedor A",
      fecha: "2025-04-01",
      montoTotal: 1000000,
      totalAbonado: 600000,
      estado: "Parcial",
    },
    {
      id: "F-002",
      proveedor: "Proveedor B",
      fecha: "2025-03-28",
      montoTotal: 800000,
      totalAbonado: 800000,
      estado: "Pagada",
    },
  ];

  const formatCurrency = (value) =>
    value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Facturación de Proveedores
      </h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="border p-2 rounded w-full">
          <option value="">Todos los proveedores</option>
          <option>Proveedor A</option>
          <option>Proveedor B</option>
        </select>

        <select className="border p-2 rounded w-full">
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
            {facturas.map((factura) => {
              const saldo = factura.montoTotal - factura.totalAbonado;
              return (
                <tr key={factura.id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{factura.id}</td>
                  <td className="p-2 border text-center">
                    {factura.proveedor}
                  </td>
                  <td className="p-2 border text-center">{factura.fecha}</td>
                  <td className="p-2 border text-center">
                    {formatCurrency(factura.montoTotal)}
                  </td>
                  <td className="p-2 border text-center">
                    {formatCurrency(factura.totalAbonado)}
                  </td>
                  <td className="p-2 border text-center">
                    {formatCurrency(saldo)}
                  </td>
                  <td className="p-2 border text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        factura.estado === "Pagada"
                          ? "bg-green-600"
                          : factura.estado === "Pendiente"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {factura.estado}
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
