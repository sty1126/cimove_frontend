"use client"

import { useState, useEffect } from "react"
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Card,
  Spin,
  Empty,
} from "antd"
import {
  EditOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import { getNotificaciones, actualizarNotificacion } from "../../services/notificacionesService"

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

// Paleta de colores personalizada
const colors = {
  primary: "#0D7F93",
  secondary: "#4D8A52",
  accent: "#7FBAD6",
  light: "#C3D3C6",
  background: "#E8EAEC",
  text: "#2A3033",
  success: "#4D8A52",
  warning: "#E0A458",
  danger: "#C25F48",
  white: "#FFFFFF",
}

const ModalModificarNotificacion = ({
  visible,
  onClose,
  onSuccess,
  selectedNotificacion: propSelectedNotificacion,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [notificaciones, setNotificaciones] = useState([])
  const [selectedNotificacion, setSelectedNotificacion] = useState(null)
  const [loadingList, setLoadingList] = useState(false)
  const [view, setView] = useState("list") // "list" o "edit"

  // Cargar notificaciones al abrir el modal o manejar notificación específica
  useEffect(() => {
    if (visible) {
      if (propSelectedNotificacion) {
        // Si se pasa una notificación específica, ir directamente a edición
        setSelectedNotificacion(propSelectedNotificacion)
        setView("edit")

        // Llenar el formulario con los datos de la notificación
        form.setFieldsValue({
          nombre: propSelectedNotificacion.nombre_notificacion,
          descripcion: propSelectedNotificacion.descripcion_notificacion,
          urgencia: propSelectedNotificacion.urgencia_notificacion,
          fechaInicio: dayjs(propSelectedNotificacion.fechainicio_notificacion),
          fechaFin: dayjs(propSelectedNotificacion.fechafin_notificacion),
          horaInicio: dayjs(propSelectedNotificacion.horainicio_notificacion, "HH:mm:ss"),
          horaFin: dayjs(propSelectedNotificacion.horafin_notificacion, "HH:mm:ss"),
          estado: propSelectedNotificacion.estado_notificacion,
        })
      } else {
        // Si no se pasa notificación específica, mostrar lista
        cargarNotificaciones()
      }
    } else {
      // Reset cuando se cierra
      setView("list")
      setSelectedNotificacion(null)
      form.resetFields()
    }
  }, [visible, propSelectedNotificacion])

  const cargarNotificaciones = async () => {
    try {
      setLoadingList(true)
      const data = await getNotificaciones()
      setNotificaciones(data)
    } catch (error) {
      console.error("Error al cargar notificaciones:", error)
      message.error("Error al cargar las notificaciones")
    } finally {
      setLoadingList(false)
    }
  }

  const seleccionarNotificacion = (notificacion) => {
    setSelectedNotificacion(notificacion)
    setView("edit")

    // Llenar el formulario con los datos de la notificación
    form.setFieldsValue({
      nombre: notificacion.nombre_notificacion,
      descripcion: notificacion.descripcion_notificacion,
      urgencia: notificacion.urgencia_notificacion,
      fechaInicio: dayjs(notificacion.fechainicio_notificacion),
      fechaFin: dayjs(notificacion.fechafin_notificacion),
      horaInicio: dayjs(notificacion.horainicio_notificacion, "HH:mm:ss"),
      horaFin: dayjs(notificacion.horafin_notificacion, "HH:mm:ss"),
      estado: notificacion.estado_notificacion,
    })
  }

  const volverALista = () => {
    if (propSelectedNotificacion) {
      // Si es edición directa, cerrar modal
      onClose()
    } else {
      // Si es desde lista, volver a la lista
      setView("list")
      setSelectedNotificacion(null)
      form.resetFields()
    }
  }

  const handleGuardarCambios = async (values) => {
    try {
      setLoading(true)

      // Validar que la fecha de fin no sea anterior a la de inicio
      if (values.fechaFin.isBefore(values.fechaInicio)) {
        message.error("La fecha de fin no puede ser anterior a la fecha de inicio")
        setLoading(false)
        return
      }

      const notificacionData = {
        nombre_notificacion: values.nombre,
        descripcion_notificacion: values.descripcion,
        urgencia_notificacion: values.urgencia,
        fechainicio_notificacion: values.fechaInicio.format("YYYY-MM-DD"),
        fechafin_notificacion: values.fechaFin.format("YYYY-MM-DD"),
        horainicio_notificacion: values.horaInicio.format("HH:mm:ss"),
        horafin_notificacion: values.horaFin.format("HH:mm:ss"),
        estado_notificacion: values.estado,
      }

      const notifToUpdate = propSelectedNotificacion || selectedNotificacion
      await actualizarNotificacion(notifToUpdate.id_notificacion, notificacionData)

      message.success("Notificación actualizada exitosamente")

      if (propSelectedNotificacion) {
        onSuccess()
        onClose()
      } else {
        await cargarNotificaciones()
        volverALista()
        onSuccess()
      }
    } catch (error) {
      console.error("Error al actualizar notificación:", error)
      message.error("Error al actualizar la notificación")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setView("list")
    setSelectedNotificacion(null)
    onClose()
  }

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case "U":
        return colors.danger
      case "N":
        return colors.warning
      case "B":
        return colors.success
      default:
        return colors.text
    }
  }

  const getUrgenciaText = (urgencia) => {
    switch (urgencia) {
      case "U":
        return "Alta"
      case "N":
        return "Normal"
      case "B":
        return "Baja"
      default:
        return urgencia
    }
  }

  const getEstadoText = (estado) => {
    switch (estado) {
      case "P":
        return "Pendiente"
      case "E":
        return "En Proceso"
      case "A":
        return "Activo"
      case "C":
        return "Completado"
      default:
        return estado
    }
  }

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {view === "list" ? (
            <SearchOutlined style={{ color: colors.secondary, fontSize: "24px" }} />
          ) : (
            <EditOutlined style={{ color: colors.warning, fontSize: "24px" }} />
          )}
          <div>
            <Title level={4} style={{ margin: 0, color: colors.text }}>
              {propSelectedNotificacion
                ? `Editando: ${propSelectedNotificacion.nombre_notificacion}`
                : view === "list"
                  ? "Seleccionar Notificación"
                  : `Editando: ${selectedNotificacion?.nombre_notificacion}`}
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {view === "list"
                ? "Elige la notificación que deseas modificar"
                : "Actualiza la información de tu notificación"}
            </Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={window.innerWidth <= 768 ? "95%" : view === "list" ? 900 : 800}
      style={{ top: window.innerWidth <= 768 ? 10 : 20 }}
      bodyStyle={{
        padding: window.innerWidth <= 768 ? "16px" : "24px",
        maxHeight: window.innerWidth <= 768 ? "80vh" : "70vh",
        overflowY: "auto",
      }}
    >
      {view === "list" ? (
        // Vista de lista de notificaciones
        <div>
          {loadingList ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
              <div style={{ marginTop: "16px" }}>
                <Text>Cargando notificaciones...</Text>
              </div>
            </div>
          ) : notificaciones.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Title level={4} style={{ color: colors.text }}>
                    No hay notificaciones disponibles
                  </Title>
                  <Text type="secondary">Crea una nueva notificación para comenzar</Text>
                </div>
              }
              style={{ padding: "40px 0" }}
            />
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              <Text style={{ marginBottom: "16px", color: colors.text }}>
                Selecciona una notificación para editarla:
              </Text>
              {notificaciones.map((notificacion) => (
                <Card
                  key={notificacion.id_notificacion}
                  hoverable
                  onClick={() => seleccionarNotificacion(notificacion)}
                  style={{
                    borderRadius: "12px",
                    border: `2px solid ${colors.light}`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{ padding: "20px" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary}20`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.light
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "8px",
                        }}
                      >
                        <Title level={5} style={{ margin: 0, color: colors.text }}>
                          #{notificacion.id_notificacion} - {notificacion.nombre_notificacion}
                        </Title>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "16px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: `${getUrgenciaColor(notificacion.urgencia_notificacion)}20`,
                            color: getUrgenciaColor(notificacion.urgencia_notificacion),
                          }}
                        >
                          {getUrgenciaText(notificacion.urgencia_notificacion)}
                        </span>
                      </div>

                      <Text
                        type="secondary"
                        style={{
                          display: "block",
                          marginBottom: "12px",
                          lineHeight: "1.5",
                        }}
                      >
                        {notificacion.descripcion_notificacion?.substring(0, 120)}
                        {notificacion.descripcion_notificacion?.length > 120 ? "..." : ""}
                      </Text>

                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          fontSize: "12px",
                          color: colors.text,
                        }}
                      >
                        <Text type="secondary">
                          {dayjs(notificacion.fechainicio_notificacion).format("DD/MM/YYYY")} -{" "}
                          {dayjs(notificacion.fechafin_notificacion).format("DD/MM/YYYY")}
                        </Text>
                        <Text type="secondary">
                          {notificacion.horainicio_notificacion?.substring(0, 5)} -{" "}
                          {notificacion.horafin_notificacion?.substring(0, 5)}
                        </Text>
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "11px",
                          fontWeight: "600",
                          backgroundColor: `${colors.accent}30`,
                          color: colors.primary,
                        }}
                      >
                        {getEstadoText(notificacion.estado_notificacion)}
                      </span>
                      <EditOutlined style={{ color: colors.secondary, fontSize: "20px" }} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Vista de edición
        <div>
          <div style={{ marginBottom: "24px" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={volverALista}
              style={{
                marginBottom: "16px",
                borderRadius: "8px",
                height: "36px",
                fontWeight: "500",
              }}
            >
              {propSelectedNotificacion ? "Cancelar" : "Volver a la lista"}
            </Button>

            <div
              style={{
                padding: "16px",
                backgroundColor: colors.background,
                borderRadius: "12px",
                border: `2px solid ${colors.light}`,
              }}
            >
              <Text strong style={{ color: colors.primary }}>
                ID de Notificación:{" "}
              </Text>
              <Text style={{ fontSize: "16px", fontWeight: "600" }}>#{selectedNotificacion?.id_notificacion}</Text>
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={handleGuardarCambios}>
            {/* Información básica */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={5} style={{ color: colors.warning, marginBottom: "16px" }}>
                Información Básica
              </Title>

              <Form.Item
                name="nombre"
                label="Nombre de la Notificación"
                rules={[
                  { required: true, message: "El nombre es obligatorio" },
                  { max: 100, message: "Máximo 100 caracteres" },
                ]}
              >
                <Input
                  placeholder="Ingrese el nombre de la notificación"
                  style={{ borderRadius: "8px", height: "40px" }}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="urgencia"
                    label="Nivel de Urgencia"
                    rules={[{ required: true, message: "Seleccione el nivel de urgencia" }]}
                  >
                    <Select
                      placeholder="Seleccione la urgencia"
                      style={{ borderRadius: "8px" }}
                      suffixIcon={<FlagOutlined style={{ color: colors.primary }} />}
                    >
                      <Option value="B">Baja</Option>
                      <Option value="N">Normal</Option>
                      <Option value="U">Alta</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="estado"
                    label="Estado Actual"
                    rules={[{ required: true, message: "Seleccione el estado" }]}
                  >
                    <Select
                      placeholder="Seleccione el estado"
                      style={{ borderRadius: "8px" }}
                      suffixIcon={<CheckCircleOutlined style={{ color: colors.primary }} />}
                    >
                      <Option value="P">Pendiente</Option>
                      <Option value="E">En Proceso</Option>
                      <Option value="A">Activo</Option>
                      <Option value="C">Completado</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="descripcion"
                label="Descripción Detallada"
                rules={[
                  { required: true, message: "La descripción es obligatoria" },
                  { max: 500, message: "Máximo 500 caracteres" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Describa los detalles de la notificación..."
                  showCount
                  maxLength={500}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </div>

            <Divider style={{ borderColor: colors.light }}>
              <CalendarOutlined style={{ color: colors.primary }} />
            </Divider>

            {/* Fechas y horarios */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={5} style={{ color: colors.primary, marginBottom: "16px" }}>
                Programación
              </Title>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fechaInicio"
                    label="Fecha de Inicio"
                    rules={[{ required: true, message: "La fecha de inicio es obligatoria" }]}
                  >
                    <DatePicker
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        height: "40px",
                      }}
                      format="DD/MM/YYYY"
                      placeholder="Seleccione fecha de inicio"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="fechaFin"
                    label="Fecha de Fin"
                    rules={[{ required: true, message: "La fecha de fin es obligatoria" }]}
                  >
                    <DatePicker
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        height: "40px",
                      }}
                      format="DD/MM/YYYY"
                      placeholder="Seleccione fecha de fin"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="horaInicio"
                    label="Hora de Inicio"
                    rules={[{ required: true, message: "La hora de inicio es obligatoria" }]}
                  >
                    <TimePicker
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        height: "40px",
                      }}
                      format="HH:mm"
                      placeholder="Hora de inicio"
                      suffixIcon={<ClockCircleOutlined style={{ color: colors.primary }} />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="horaFin"
                    label="Hora de Fin"
                    rules={[{ required: true, message: "La hora de fin es obligatoria" }]}
                  >
                    <TimePicker
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        height: "40px",
                      }}
                      format="HH:mm"
                      placeholder="Hora de fin"
                      suffixIcon={<ClockCircleOutlined style={{ color: colors.primary }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Botones de acción */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                paddingTop: "16px",
                borderTop: `1px solid ${colors.light}`,
              }}
            >
              <Button
                onClick={volverALista}
                size="large"
                style={{
                  borderRadius: "8px",
                  height: "44px",
                  padding: "0 24px",
                  fontWeight: "500",
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: colors.warning,
                  borderColor: colors.warning,
                  borderRadius: "8px",
                  height: "44px",
                  padding: "0 24px",
                  fontWeight: "500",
                  boxShadow: "0 2px 8px rgba(224, 164, 88, 0.3)",
                }}
              >
                Guardar Cambios
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  )
}

export default ModalModificarNotificacion
