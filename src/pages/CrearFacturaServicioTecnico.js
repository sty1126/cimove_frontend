import React, { useState, useEffect } from "react";
import axios from "axios";
import SeleccionarClientePorSede from "./SeleccionarClientePorSede";
import { Form } from "react-bootstrap";

const CrearServicioTecnico = () => {
  const [formData, setFormData] = useState({
    idCliente: null,
    idSede: null,
    aplicaProveedor: false,
    idProveedor: "",
    nombreServicio: "",
    descripcionServicio: "",
    fechaServicio: new Date().toISOString().split("T")[0],
    fechaEntrega: "",
    tipoDano: "",
    claveDispositivo: "",
    costo: "",
    abono: "",
    garantiaAplica: false,
    fechaGarantia: "",
    numeroContactoAlternativo: "",
    autorizado: true,
  });

  const [sedes, setSedes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedSede, setSelectedSede] = useState("");
  const [showModalCliente, setShowModalCliente] = useState(false);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get("https://cimove-backend.onrender.com/api/sedes/");
        setSedes(response.data);
      } catch (error) {
        console.error("Error cargando sedes:", error);
      }
    };

    const fetchProveedores = async () => {
      try {
        const response = await axios.get(
          "https://cimove-backend.onrender.com/api/proveedores/all"
        );
        setProveedores(response.data);
      } catch (error) {
        console.error("Error cargando proveedores:", error);
      }
    };

    fetchSedes();
    fetchProveedores();
  }, []);

  const setCliente = (clienteSeleccionado) => {
    if (clienteSeleccionado) {
      setFormData((prev) => ({
        ...prev,
        idCliente: clienteSeleccionado.id_cliente,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectSede = (e) => {
    const sedeId = e.target.value;
    setSelectedSede(sedeId);
    setFormData((prev) => ({
      ...prev,
      idSede: sedeId,
      idCliente: "", // Limpiar cliente si cambia sede
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idCliente || !formData.idSede) {
      alert("Por favor seleccione una sede y un cliente antes de continuar.");
      return;
    }

    const payload = {
      id_cliente: formData.idCliente,
      id_sede: formData.idSede,
      id_proveedor: formData.aplicaProveedor
        ? formData.idProveedor
        : "PROV_TEMP_123",
      nombre_servicio: formData.nombreServicio,
      descripcion_servicio: formData.descripcionServicio,
      fecha_servicio: formData.fechaServicio,
      fecha_entrega: formData.fechaEntrega,
      tipo_dano: formData.tipoDano,
      clave_dispositivo: formData.claveDispositivo,
      costo: Number(formData.costo),
      abono: Number(formData.abono),
      garantia_aplica: formData.garantiaAplica,
      fecha_garantia: formData.fechaGarantia,
      numero_contacto_alternativo: formData.numeroContactoAlternativo,
      autorizado: formData.autorizado,
    };

    try {
      const response = await axios.post(
        "https://cimove-backend.onrender.com/api/serviciotecnico",
        payload
      );
      alert("Servicio técnico creado exitosamente.");
      console.log(response.data);
    } catch (error) {
      console.error("Error creando servicio técnico:", error);
      alert("Error al crear servicio técnico.");
    }
  };

  const obtenerNombreSede = (id) => {
    const sede = sedes.find((s) => s.id_sede === parseInt(id));
    return sede ? sede.nombre_sede : "";
  };

  return (
    <div className="container">
      <h2>Crear Servicio Técnico</h2>

      {/* Selección de sede */}
      <div className="mb-3">
        <label>
          <strong>Sede:</strong>
        </label>
        <select
          value={selectedSede}
          onChange={handleSelectSede}
          className="form-control"
          required
        >
          <option value="">-- Seleccionar sede --</option>
          {sedes.map((sede) => (
            <option key={sede.id_sede} value={sede.id_sede}>
              {sede.nombre_sede}
            </option>
          ))}
        </select>
      </div>

      {/* Selección de cliente */}
      <div className="mb-3">
        <label>
          <strong>Cliente:</strong>
        </label>
        <div>
          {formData.idCliente ? (
            <span>ID Cliente seleccionado: {formData.idCliente}</span>
          ) : (
            <span>No hay cliente seleccionado.</span>
          )}
          <button
            type="button"
            onClick={() => setShowModalCliente(true)}
            disabled={!selectedSede}
            className="btn btn-primary btn-sm ms-2"
          >
            Seleccionar Cliente
          </button>
        </div>
      </div>

      <SeleccionarClientePorSede
        show={showModalCliente}
        handleClose={() => setShowModalCliente(false)}
        setCliente={setCliente}
        selectedSede={obtenerNombreSede(selectedSede)}
        sedes={sedes}
      />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del servicio:</label>
          <input
            type="text"
            name="nombreServicio"
            value={formData.nombreServicio}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción del servicio:</label>
          <textarea
            name="descripcionServicio"
            value={formData.descripcionServicio}
            onChange={handleChange}
            className="form-control"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Tipo de daño:</label>
          <select
            name="tipoDano"
            value={formData.tipoDano}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Seleccionar --</option>
            <option value="grave">Grave</option>
            <option value="medio">Medio</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        <div className="form-group">
          <label>Clave del dispositivo:</label>
          <input
            type="text"
            name="claveDispositivo"
            value={formData.claveDispositivo}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Costo estimado ($):</label>
          <input
            type="number"
            name="costo"
            value={formData.costo}
            onChange={handleChange}
            className="form-control"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Abono mínimo ($):</label>
          <input
            type="number"
            name="abono"
            value={formData.abono}
            onChange={handleChange}
            className="form-control"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Número de contacto alternativo:</label>
          <input
            type="text"
            name="numeroContactoAlternativo"
            value={formData.numeroContactoAlternativo}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fecha servicio:</label>
          <input
            type="date"
            name="fechaServicio"
            value={formData.fechaServicio}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha entrega estimada:</label>
          <input
            type="date"
            name="fechaEntrega"
            value={formData.fechaEntrega}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <Form.Check
          type="checkbox"
          label="¿Aplica proveedor?"
          checked={formData.aplicaProveedor}
          onChange={(e) =>
            setFormData({ ...formData, aplicaProveedor: e.target.checked })
          }
        />

        {formData.aplicaProveedor && (
          <div className="form-group mt-2">
            <label>Proveedor:</label>
            <select
              name="idProveedor"
              value={formData.idProveedor}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">-- Seleccionar proveedor --</option>
              {proveedores.map((prov) => (
                <option key={prov.id_proveedor} value={prov.id_proveedor}>
                  {prov.nombre_proveedor}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group mt-3">
          <label>
            ¿Aplica garantía?
            <input
              type="checkbox"
              name="garantiaAplica"
              checked={formData.garantiaAplica}
              onChange={handleChange}
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>

        {formData.garantiaAplica && (
          <div className="form-group">
            <label>Fecha de garantía:</label>
            <input
              type="date"
              name="fechaGarantia"
              value={formData.fechaGarantia}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        )}

        <button type="submit" className="btn btn-success mt-3">
          Crear Servicio Técnico
        </button>
      </form>
    </div>
  );
};

export default CrearServicioTecnico;
