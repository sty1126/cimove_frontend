"use client";

import { useCart } from "../context/CartContext";
import { Drawer, Select, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

// Paleta de colores personalizada
const colors = {
  primary: "#0D7F93", // Teal más vibrante
  secondary: "#4D8A52", // Verde más vibrante
  accent: "#7FBAD6", // Azul más vibrante
  light: "#C3D3C6", // Verde menta claro
  background: "#E8EAEC", // Gris muy claro
  text: "#2A3033", // Texto oscuro
  success: "#4D8A52", // Verde más vibrante para éxito
  warning: "#E0A458", // Naranja apagado para advertencias
  danger: "#C25F48", // Rojo más vibrante para peligro
};

const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    hover: {
      backgroundColor: "#0A6A7A",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    hover: {
      backgroundColor: "#3D7042",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  },
  danger: {
    backgroundColor: colors.danger,
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    hover: {
      backgroundColor: "#A34A38",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  },
  quantity: {
    backgroundColor: "#f3f4f6",
    color: colors.text,
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    hover: {
      backgroundColor: "#e5e7eb",
    },
  },
};

const Catalogo = () => {
  const { cart, setCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [selectedSede, setSelectedSede] = useState(null);
  const [generalProducts, setGeneralProducts] = useState([]);
  const [sedeProducts, setSedeProducts] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const formatData = (productos) =>
    productos.map((prod) => ({
      ...prod,
      nombre_producto: prod.nombre_producto || prod.nombre,
      costoventa_producto:
        prod.costoventa_producto || prod.precioventaact_producto || prod.precio,
      existencia_producto: prod.existencia_producto ?? prod.stock,
    }));

  const filterAndSortProducts = (products) => {
    return products
      .filter((p) =>
        p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
      )
      .sort((a, b) => a.existencia_producto - b.existencia_producto); // stock ascendente
  };

  const fetchSedes = async () => {
    try {
      const res = await axios.get("https://cimove-backend.onrender.com/api/sedes");
      setSedes(res.data);
      if (res.data.length > 0) {
        setSelectedSede(res.data[0].nombre_sede);
      }
    } catch (err) {
      message.error("No se pudieron cargar las sedes");
    }
  };

  const fetchData = async () => {
    try {
      // Inventario general
      const generalRes = await axios.get(
        "https://cimove-backend.onrender.com/api/productos/detalles"
      );
      setGeneralProducts(formatData(generalRes.data));

      // Inventario sede
      const sedeObj = sedes.find((s) => s.nombre_sede === selectedSede);
      if (!sedeObj) return;
      const sedeRes = await axios.get(
        `https://cimove-backend.onrender.com/inventariolocal/sede/${sedeObj.id_sede}`
      );
      setSedeProducts(formatData(sedeRes.data));
    } catch (error) {
      message.error("Error al obtener los productos");
    }
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  useEffect(() => {
    if (selectedSede && sedes.length > 0) {
      fetchData();
    }
  }, [selectedSede, sedes]);

  const filterProducts = (products) => {
    return products.filter((p) =>
      p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  const addToCart = (producto) => {
    setCart((prevCart) => {
      const yaExiste = prevCart.some(
        (p) => p.id_producto === producto.id_producto
      );
      if (yaExiste) {
        return prevCart;
      } else {
        return [...prevCart, { ...producto }];
      }
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Select
            value={selectedSede}
            onChange={(value) => setSelectedSede(value)}
            style={{ minWidth: "200px" }}
          >
            {sedes.map((sede) => (
              <Option key={sede.id_sede} value={sede.nombre_sede}>
                {sede.nombre_sede}
              </Option>
            ))}
          </Select>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                padding: "8px 16px 8px 40px",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                width: "250px",
                fontSize: "14px",
              }}
            />
            <FaSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            />
          </div>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            ...buttonStyles.secondary,
            padding: "10px 20px",
            borderRadius: "24px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor =
              buttonStyles.secondary.hover.backgroundColor;
            e.currentTarget.style.boxShadow =
              buttonStyles.secondary.hover.boxShadow;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor =
              buttonStyles.secondary.backgroundColor;
            e.currentTarget.style.boxShadow = buttonStyles.secondary.boxShadow;
          }}
        >
          <FaShoppingCart size={18} />
          <span>Ver Carrito</span>
        </button>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Inventario General */}
        <div
          style={{
            flex: "1 1 45%",
            minWidth: "300px",
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "calc(100vh - 180px)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "16px",
              color: colors.primary,
            }}
          >
            Inventario General
          </h2>
          <div style={{ overflowY: "auto", height: "calc(100% - 60px)" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {filterAndSortProducts(generalProducts).map((prod) => (
                <li
                  key={prod.id_producto}
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "15px", color: colors.text }}>
                      {prod.nombre_producto}
                    </strong>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      <span
                        style={{ color: colors.secondary, fontWeight: "500" }}
                      >
                        $
                        {prod.costoventa_producto?.toLocaleString("es-CO") ||
                          "0"}
                      </span>
                      <span style={{ margin: "0 6px" }}>|</span>
                      <span>
                        Stock:{" "}
                        <span
                          style={{
                            color:
                              prod.existencia_producto <= 5
                                ? colors.danger
                                : prod.existencia_producto <= 15
                                ? colors.warning
                                : colors.success,
                            fontWeight: "500",
                          }}
                        >
                          {prod.existencia_producto}
                        </span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(prod)}
                    style={buttonStyles.primary}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        buttonStyles.primary.hover.backgroundColor;
                      e.currentTarget.style.boxShadow =
                        buttonStyles.primary.hover.boxShadow;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        buttonStyles.primary.backgroundColor;
                      e.currentTarget.style.boxShadow =
                        buttonStyles.primary.boxShadow;
                    }}
                  >
                    <FaPlus size={14} />
                    <span>Añadir</span>
                  </button>
                </li>
              ))}
              {filterAndSortProducts(generalProducts).length === 0 && (
                <li
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                  }}
                >
                  No se encontraron productos
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Inventario por sede */}
        <div
          style={{
            flex: "1 1 45%",
            minWidth: "300px",
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "calc(100vh - 180px)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "16px",
              color: colors.primary,
            }}
          >
            Inventario - {selectedSede}
          </h2>
          <div style={{ overflowY: "auto", height: "calc(100% - 60px)" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {filterAndSortProducts(sedeProducts).map((prod) => (
                <li
                  key={prod.id_producto}
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "15px", color: colors.text }}>
                      {prod.nombre_producto}
                    </strong>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      <span
                        style={{ color: colors.secondary, fontWeight: "500" }}
                      >
                        $
                        {prod.costoventa_producto?.toLocaleString("es-CO") ||
                          "0"}
                      </span>
                      <span style={{ margin: "0 6px" }}>|</span>
                      <span>
                        Stock:{" "}
                        <span
                          style={{
                            color:
                              prod.existencia_producto <= 5
                                ? colors.danger
                                : prod.existencia_producto <= 15
                                ? colors.warning
                                : colors.success,
                            fontWeight: "500",
                          }}
                        >
                          {prod.existencia_producto}
                        </span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(prod)}
                    style={buttonStyles.primary}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        buttonStyles.primary.hover.backgroundColor;
                      e.currentTarget.style.boxShadow =
                        buttonStyles.primary.hover.boxShadow;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        buttonStyles.primary.backgroundColor;
                      e.currentTarget.style.boxShadow =
                        buttonStyles.primary.boxShadow;
                    }}
                  >
                    <FaPlus size={14} />
                    <span>Añadir</span>
                  </button>
                </li>
              ))}
              {filterAndSortProducts(sedeProducts).length === 0 && (
                <li
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                  }}
                >
                  No se encontraron productos
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Drawer del carrito */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: colors.primary,
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            <FaShoppingCart />
            <span>Carrito</span>
          </div>
        }
        placement="right"
        closable={true}
        onClose={() => setIsCartOpen(false)}
        open={isCartOpen}
        width={350}
      >
        {cart.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#666",
            }}
          >
            <FaShoppingCart
              style={{ fontSize: "48px", opacity: 0.2, marginBottom: "16px" }}
            />
            <p>El carrito está vacío</p>
          </div>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cart.map((item) => (
                <li
                  key={item.id_producto}
                  style={{
                    marginBottom: "16px",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <strong style={{ fontSize: "15px", color: colors.text }}>
                      {item.nombre_producto}
                    </strong>
                    <div
                      style={{
                        fontSize: "14px",
                        color: colors.secondary,
                        fontWeight: "500",
                        marginTop: "4px",
                      }}
                    >
                      $
                      {item.costoventa_producto?.toLocaleString("es-CO") || "0"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      onClick={() =>
                        setCart((prev) =>
                          prev.filter((p) => p.id_producto !== item.id_producto)
                        )
                      }
                      style={{
                        ...buttonStyles.danger,
                        marginLeft: "auto",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor =
                          buttonStyles.danger.hover.backgroundColor;
                        e.currentTarget.style.boxShadow =
                          buttonStyles.danger.hover.boxShadow;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor =
                          buttonStyles.danger.backgroundColor;
                        e.currentTarget.style.boxShadow =
                          buttonStyles.danger.boxShadow;
                      }}
                    >
                      <FaTrash size={12} />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => navigate("/procesar-pedido")}
                style={{
                  ...buttonStyles.secondary,
                  padding: "12px 24px",
                  width: "100%",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor =
                    buttonStyles.secondary.hover.backgroundColor;
                  e.currentTarget.style.boxShadow =
                    buttonStyles.secondary.hover.boxShadow;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor =
                    buttonStyles.secondary.backgroundColor;
                  e.currentTarget.style.boxShadow =
                    buttonStyles.secondary.boxShadow;
                }}
              >
                <FaShoppingCart size={16} />
                <span>Procesar Pedido</span>
              </button>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Catalogo;
