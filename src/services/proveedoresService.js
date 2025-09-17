import axios from "axios";

//const BASE_URL = "https://cimove-backend.onrender.com/api";
const BASE_URL = "http://localhost:4000/api";

// Obtener abonos
export const getAbonos = async () => {
  const response = await axios.get(`${BASE_URL}/abonos`);
  return response.data;
};

// Obtener proveedor por ID
export const obtenerProveedorPorId = async (id) => {
  const response = await axios.get(`${BASE_URL}/proveedores/${id}`);
  return response.data;
};

// Actualizar proveedor
export const actualizarProveedor = async (id, datos) => {
  const response = await axios.put(`${BASE_URL}/proveedores/${id}`, datos);
  return response.data;
};

// Obtener tipos de proveedor
export const obtenerTiposProveedor = async () => {
  const response = await axios.get(`${BASE_URL}/proveedores/tipos`);
  return response.data;
};

// Obtener ciudades
export const obtenerCiudades = async () => {
  const response = await axios.get(`${BASE_URL}/ciudades`);
  return response.data;
};

// Obtener todos los proveedores
export const obtenerTodosLosProveedores = async () => {
  const response = await axios.get(`${BASE_URL}/proveedores/all`);
  return response.data;
};

// Obtener detalles del producto por ID
export const obtenerProductoPorId = async (idProducto) => {
  const response = await axios.get(`${BASE_URL}/productos/${idProducto}`);
  return Array.isArray(response.data) ? response.data[0] : response.data;
};

// Obtener proveedores asociados a un producto
export const obtenerProveedoresAsociados = async (idProducto) => {
  const response = await axios.get(
    `${BASE_URL}/proveedor-producto/${idProducto}/producto`
  );
  return response.data;
};

// Asociar proveedor con producto
export const asociarProveedorAProducto = async (idProveedor, idProducto) => {
  const body = {
    id_proveedor_proveedorproducto: idProveedor,
    id_producto_proveedorproducto: idProducto,
  };
  const response = await axios.post(`${BASE_URL}/proveedor-producto`, body);
  return response.data;
};

export const obtenerOrdenesCompra = async () => {
  const response = await axios.get(`${BASE_URL}/ordenes`);
  return response.data;
};

export const obtenerProductosDeOrden = async (idOrden) => {
  console.log("ID de orden recibido en service:", idOrden); // <--- aquí imprimimos

  const response = await axios.get(`${BASE_URL}/ordenes/${idOrden}`);
  return response.data;
};


export const registrarFacturaProveedor = async (dataFactura) => {
  const response = await axios.post(
    `${BASE_URL}/facturas-proveedor`,
    dataFactura
  );
  return response.data;
};


export const obtenerDetalleProveedor = async (id) => {
  const response = await axios.get(`${BASE_URL}/proveedores/${id}`);
  return response.data;
};

export const obtenerProductosDeProveedor = async (id) => {
  const response = await axios.get(
    `${BASE_URL}/proveedor-producto/proveedor/${id}/productos`
  );
  return response.data;
};

// Obtener todas las facturas de proveedor
export const obtenerFacturasProveedor = async () => {
  const response = await axios.get(`${BASE_URL}/facturas-proveedor`);
  return response.data;
};

// Obtener todos los proveedores
export const obtenerTodosProveedores = async () => {
  const response = await axios.get(`${BASE_URL}/proveedores/all`);
  return response.data;
};

// Obtener una factura por ID (con sus abonos)
export const obtenerFacturaConAbonos = async (idFactura) => {
  try {
    const [facturaRes, abonosRes] = await Promise.all([
      axios.get(`${BASE_URL}/facturas-proveedor/${idFactura}`),
      axios.get(`${BASE_URL}/abonos/factura/${idFactura}`),
    ]);

    const facturaData = facturaRes.data;
    const abonosData = abonosRes.data || [];

    const totalAbonado = abonosData.reduce(
      (sum, abono) => sum + (Number(abono.monto_abonofactura) || 0),
      0
    );

    return {
      ...facturaData,
      total_abonado: totalAbonado,
      abonos: abonosData,
    };
  } catch (error) {
    console.error("Error al obtener factura y abonos:", error);
    throw new Error("Error al cargar la factura");
  }
};

// Registrar un abono a una factura
export const registrarAbonoFactura = async (idFactura, values) => {
  const montoAbono = Number(values.monto);

  if (isNaN(montoAbono) || montoAbono <= 0) {
    throw new Error("El monto del abono debe ser un número positivo");
  }

  const data = {
    id_facturaproveedor_abonofactura: idFactura,
    fecha_abonofactura: values.fecha.format("YYYY-MM-DD"),
    monto_abonofactura: montoAbono,
  };

  console.log("Enviando abono:", data);

  const response = await axios.post(`${BASE_URL}/abonos`, data);
  return response.data;
};

export const getProveedores = async () => {
  const response = await axios.get(`${BASE_URL}/proveedores/all`);
  return response.data;
};

// Obtener tipos de proveedor
export const getTiposProveedor = async () => {
  const response = await axios.get(`${BASE_URL}/proveedores/tipos`);
  return response.data;
};

// Crear nuevo tipo de proveedor (con validación incluida)
export const crearTipoProveedor = async (nombre) => {
  if (!nombre.trim()) {
    throw new Error("El nombre del tipo no puede estar vacío");
  }

  const response = await axios.post(`${BASE_URL}/proveedores/tipos`, {
    nombre_tipoproveedor: nombre,
  });
  return response.data;
};

// Desactivar proveedor
export const desactivarProveedor = async (id) => {
  const response = await axios.put(`${BASE_URL}/proveedores/eliminar/${id}`);
  return response.data;
};

// Obtener proveedores asociados a múltiples productos
export const getProveedoresPorProductos = async (ids) => {
  const response = await fetch(`${BASE_URL}/proveedor-producto?ids=${ids}`);
  if (!response.ok) {
    throw new Error("Error al obtener proveedores de productos");
  }
  return await response.json();
};

// Procesar pedido de orden de compra
export const procesarPedido = async (productosPayload) => {
  return await axios.post(`${BASE_URL}/ordenes/procesar-pedido`, {
    productos: productosPayload,
  });
};

// Obtener ciudades
export const getCiudades = async () => {
  const response = await axios.get(`${BASE_URL}/ciudades`);
  return response.data;
};

// Registrar proveedor
export const registrarProveedor = async (data) => {
  return await axios.post(`${BASE_URL}/proveedores`, data);
};

// Obtener todos los proveedores
export const getTodosProveedores = async () => {
  const response = await fetch(`${BASE_URL}/proveedores/all`);
  return await response.json();
};

export const eliminarProveedorDeProducto = async (idProveedor, idProducto) => {
  try {
    console.log(`Eliminando relación: proveedor=${idProveedor}, producto=${idProducto}`);

    if (!idProveedor || !idProducto) {
      throw new Error("ID de proveedor o producto inválido");
    }

    const response = await axios.put(`${BASE_URL}/proveedor-producto/inactivar`, {
      id_proveedor: idProveedor,
      id_producto: idProducto,
    });

    console.log("Respuesta de eliminación:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en eliminarProveedorDeProducto:", error);
    
    // More detailed error logging
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      
      let errorMsg = "Error al desasociar proveedor del producto";
      if (typeof error.response.data === 'object' && error.response.data !== null) {
        // If data is an object, extract error details
        errorMsg = error.response.data.error || 
                   error.response.data.message || 
                   error.response.data.details || 
                   `Error ${error.response.status}: ${error.response.statusText}`;
        
        // Log the full error stack if available
        if (error.response.data.stack) {
          console.error("Error stack:", error.response.data.stack);
        }
      }
      throw new Error(errorMsg);
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor:", error.request);
      throw new Error("No se recibió respuesta del servidor");
    } else {
      console.error("Error de configuración:", error.message);
      throw new Error(error.message || "Error al desasociar proveedor del producto");
    }
  }
};
