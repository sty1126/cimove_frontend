"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  List,
  Tag,
  Spin,
  Empty,
  Popconfirm,
  message,
  Tabs,
  Badge,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  EditOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CheckOutlined,
  DeleteOutlined,
  UndoOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import ModalCrearNotificacion from "./CrearNotificacion";
import ModalModificarNotificacion from "./ModificarNotificacion";
import {
  getNotificaciones,
  getNotificacionesCompletadas,
  marcarNotificacionCompletada,
  restaurarNotificacionPendiente,
  eliminarNotificacion,
} from "../../services/notificacionesService";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const colors = {
  primary: "#2673bbff",
  secondary: "#3d9411ff",
  accent: "#13a1a1ff",
  light: "#f0f0f0",
  background: "#fafafa",
  text: "#262626",
  success: "#419418ff",
  warning: "#ebb750ff",
  danger: "#be2c2eff",
  white: "#ffffff",
  lightGray: "#f5f5f5",
  mediumGray: "#d9d9d9",
};

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalModificarVisible, setModalModificarVisible] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesCompletadas, setNotificacionesCompletadas] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedNotificacionForEdit, setSelectedNotificacionForEdit] =
    useState(null);
  const [activeTab, setActiveTab] = useState("pendientes");

  // Obtener información del mes actual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  // Nombres de los meses y días
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  // Cargar notificaciones
  const cargarNotificaciones = async () => {
    setLoading(true);
    try {
      const data = await getNotificaciones();
      setNotificaciones(data);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      message.error("Error al cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  // Cargar notificaciones completadas
  const cargarNotificacionesCompletadas = async () => {
    try {
      const data = await getNotificacionesCompletadas();
      setNotificacionesCompletadas(data);
    } catch (error) {
      console.error("Error al cargar notificaciones completadas:", error);
      message.error("Error al cargar las notificaciones completadas");
    }
  };

  // Cargar notificaciones al montar el componente y al cambiar de mes
  useEffect(() => {
    cargarNotificaciones();
    cargarNotificacionesCompletadas();
  }, [currentDate]);

  const getDayNotifications = (day, month, year) => {
    const dayDate = new Date(year, month, day);
    const pendingNotifications = notificaciones.filter((notif) => {
      // Only include non-completed notifications
      if (notif.estado_notificacion === "C") return false;

      const fechaInicio = new Date(notif.fechainicio_notificacion);
      const fechaFin = new Date(notif.fechafin_notificacion);

      // Convert to local date strings for comparison (YYYY-MM-DD format)
      const dayDateStr = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const fechaInicioStr = fechaInicio.toISOString().split("T")[0];
      const fechaFinStr = fechaFin.toISOString().split("T")[0];

      return dayDateStr >= fechaInicioStr && dayDateStr <= fechaFinStr;
    });

    // Sort by urgency: U (Urgent) first, then N (Normal), then B (Low)
    return pendingNotifications.sort((a, b) => {
      const urgencyOrder = { U: 0, N: 1, B: 2 };
      return (
        urgencyOrder[a.urgencia_notificacion] -
        urgencyOrder[b.urgencia_notificacion]
      );
    });
  };

  // Función para obtener el color del borde del día según la urgencia más alta
  const getDayBorderColor = (dayNotifications) => {
    if (dayNotifications.length === 0) return "transparent";

    // Buscar la urgencia más alta
    const hasUrgent = dayNotifications.some(
      (notif) => notif.urgencia_notificacion === "U"
    );
    const hasNormal = dayNotifications.some(
      (notif) => notif.urgencia_notificacion === "N"
    );

    if (hasUrgent) return colors.danger;
    if (hasNormal) return colors.warning;
    return colors.success;
  };

  // Función para obtener el color del indicador según la urgencia
  const getUrgencyColor = (urgencia) => {
    switch (urgencia) {
      case "U": // Urgente
        return colors.danger;
      case "N": // Normal
        return colors.warning;
      case "B": // Baja/No urgente
        return colors.success;
      default:
        return colors.accent;
    }
  };

  // Función para obtener el color del estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case "P": // Pendiente
        return colors.warning;
      case "E": // En proceso
        return colors.accent;
      case "A": // Activo
        return colors.success;
      case "C": // Completado
        return colors.mediumGray;
      default:
        return colors.primary;
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (estado) => {
    switch (estado) {
      case "P":
        return "Pendiente";
      case "E":
        return "En Proceso";
      case "A":
        return "Activo";
      case "C":
        return "Completado";
      default:
        return "Desconocido";
    }
  };

  // Función para obtener el texto de urgencia
  const getUrgencyText = (urgencia) => {
    switch (urgencia) {
      case "U":
        return "Urgente";
      case "N":
        return "Normal";
      case "B":
        return "No Urgente";
      default:
        return "Normal";
    }
  };

  // Marcar notificación como completada
  const handleMarcarCompletado = async (notificacion) => {
    setActionLoading((prev) => ({
      ...prev,
      [`complete_${notificacion.id_notificacion}`]: true,
    }));
    try {
      await marcarNotificacionCompletada(notificacion.id_notificacion);
      message.success("Notificación marcada como completada");
      await cargarNotificaciones();
      await cargarNotificacionesCompletadas();
    } catch (error) {
      console.error("Error al marcar como completado:", error);
      message.error("Error al marcar la notificación como completada");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`complete_${notificacion.id_notificacion}`]: false,
      }));
    }
  };

  // Restaurar notificación a pendiente
  const handleRestaurarPendiente = async (notificacion) => {
    setActionLoading((prev) => ({
      ...prev,
      [`restore_${notificacion.id_notificacion}`]: true,
    }));
    try {
      await restaurarNotificacionPendiente(notificacion.id_notificacion);
      message.success("Notificación restaurada a pendiente");
      await cargarNotificaciones();
      await cargarNotificacionesCompletadas();
    } catch (error) {
      console.error("Error al restaurar notificación:", error);
      message.error("Error al restaurar la notificación");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`restore_${notificacion.id_notificacion}`]: false,
      }));
    }
  };

  // Eliminar notificación
  const handleEliminarNotificacion = async (notificacion) => {
    setActionLoading((prev) => ({
      ...prev,
      [`delete_${notificacion.id_notificacion}`]: true,
    }));
    try {
      await eliminarNotificacion(notificacion.id_notificacion);
      message.success("Notificación eliminada exitosamente");
      await cargarNotificaciones();
      await cargarNotificacionesCompletadas();
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
      message.error("Error al eliminar la notificación");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`delete_${notificacion.id_notificacion}`]: false,
      }));
    }
  };

  // Editar notificación
  const handleEditarNotificacion = (notificacion) => {
    setSelectedNotificacionForEdit(notificacion);
    setModalModificarVisible(true);
  };

  // Obtener el primer día del mes y la cantidad de días
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  // Obtener días del mes anterior para completar la primera semana
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  // Generar array de días para mostrar
  const calendarDays = [];

  // Días del mes anterior
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true,
    });
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPrevMonth: false,
      isToday: isCurrentMonth && day === todayDate,
    });
  }

  // Días del siguiente mes para completar la última semana
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPrevMonth: false,
    });
  }

  // Navegación entre meses
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Seleccionar día
  const selectDay = (dayInfo) => {
    if (dayInfo.isCurrentMonth) {
      setSelectedDay(dayInfo.day);
      setActiveTab("pendientes"); // Cambiar a la pestaña de pendientes al seleccionar día
    }
  };

  // Abrir modal para crear notificación
  const handleAgregarNotificacion = () => {
    setModalCrearVisible(true);
  };

  // Abrir modal para modificar notificación
  const handleModificarNotificacion = () => {
    setModalModificarVisible(true);
  };

  // Cerrar modales
  const handleCloseModalCrear = () => {
    setModalCrearVisible(false);
  };

  const handleCloseModalModificar = () => {
    setModalModificarVisible(false);
    setSelectedNotificacionForEdit(null);
  };

  // Éxito al crear/modificar notificación
  const handleSuccessModal = () => {
    setModalCrearVisible(false);
    setModalModificarVisible(false);
    cargarNotificaciones();
    cargarNotificacionesCompletadas();
  };

  // Obtener notificaciones del día seleccionado
  const selectedDayNotifications = selectedDay
    ? getDayNotifications(selectedDay, month, year)
    : notificaciones.filter((notif) => notif.estado_notificacion !== "C"); // Show all pending notifications when no day selected

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        flexDirection: window.innerWidth <= 768 ? "column" : "row",
        padding: window.innerWidth <= 768 ? "16px" : "0",
      }}
    >
      {/* Calendario principal */}
      <Card
        bordered={false}
        style={{
          flex: "1",
          minWidth: window.innerWidth <= 768 ? "100%" : "600px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: colors.white,
        }}
        bodyStyle={{ padding: window.innerWidth <= 768 ? "16px" : "24px" }}
      >
        {/* Header con botones de acción */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Title
              level={window.innerWidth <= 768 ? 3 : 2}
              style={{ margin: 0, color: colors.primary }}
            >
              📅 Calendario de Notificaciones
            </Title>

            <Space size="middle" wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAgregarNotificacion}
                size={window.innerWidth <= 768 ? "middle" : "large"}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  borderRadius: "8px",
                  height: window.innerWidth <= 768 ? "36px" : "40px",
                  padding: window.innerWidth <= 768 ? "0 16px" : "0 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {window.innerWidth <= 768 ? "Agregar" : "Agregar notificación"}
              </Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleModificarNotificacion}
                size={window.innerWidth <= 768 ? "middle" : "large"}
                style={{
                  backgroundColor: colors.secondary,
                  borderColor: colors.secondary,
                  borderRadius: "8px",
                  height: window.innerWidth <= 768 ? "36px" : "40px",
                  padding: window.innerWidth <= 768 ? "0 16px" : "0 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {window.innerWidth <= 768
                  ? "Gestionar"
                  : "Gestionar notificaciones"}
              </Button>
            </Space>
          </div>
        </div>

        {/* Navegación del calendario */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={goToPreviousMonth}
            style={{
              color: colors.primary,
              fontSize: "18px",
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          <Title
            level={window.innerWidth <= 768 ? 4 : 3}
            style={{
              margin: 0,
              color: colors.text,
              fontSize: window.innerWidth <= 768 ? "18px" : "24px",
              fontWeight: "600",
            }}
          >
            {monthNames[month]} {year}
          </Title>

          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={goToNextMonth}
            style={{
              color: colors.primary,
              fontSize: "18px",
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>

        {/* Días de la semana */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
            marginBottom: "8px",
            padding: "0 4px",
          }}
        >
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              style={{
                textAlign: "center",
                padding: window.innerWidth <= 768 ? "8px 4px" : "12px 8px",
                fontWeight: "600",
                color: colors.text,
                fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                backgroundColor: colors.lightGray,
                borderRadius: "6px",
              }}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Grid del calendario */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
            padding: "0 4px",
          }}
        >
          {calendarDays.map((dayInfo, index) => {
            const isSelected =
              selectedDay === dayInfo.day && dayInfo.isCurrentMonth;
            const isToday = dayInfo.isToday;

            // Obtener notificaciones para este día
            const dayNotifications = dayInfo.isCurrentMonth
              ? getDayNotifications(dayInfo.day, month, year)
              : [];
            const borderColor = getDayBorderColor(dayNotifications);

            return (
              <div
                key={index}
                onClick={() => selectDay(dayInfo)}
                style={{
                  minHeight: window.innerWidth <= 768 ? "40px" : "50px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  cursor: dayInfo.isCurrentMonth ? "pointer" : "default",
                  backgroundColor: isSelected
                    ? colors.primary
                    : isToday
                    ? `${colors.accent}40`
                    : "transparent",
                  border: isSelected
                    ? `3px solid ${colors.secondary}`
                    : isToday && !isSelected
                    ? `2px solid ${colors.accent}`
                    : dayNotifications.length > 0
                    ? `2px solid ${borderColor}`
                    : "2px solid transparent",
                  color: isSelected
                    ? colors.white
                    : dayInfo.isCurrentMonth
                    ? colors.text
                    : colors.mediumGray,
                  fontWeight: isToday || isSelected ? "600" : "400",
                  fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  transition: "all 0.2s ease",
                  position: "relative",
                  padding: "4px",
                  boxShadow:
                    dayNotifications.length > 0 && !isSelected
                      ? `0 2px 8px ${borderColor}40, 0 0 0 1px ${borderColor}30`
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (dayInfo.isCurrentMonth && !isSelected) {
                    e.currentTarget.style.backgroundColor = `${colors.light}60`;
                    if (dayNotifications.length > 0) {
                      e.currentTarget.style.boxShadow = `0 4px 12px ${borderColor}60, 0 0 0 2px ${borderColor}50`;
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (dayInfo.isCurrentMonth && !isSelected && !isToday) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    if (dayNotifications.length > 0) {
                      e.currentTarget.style.boxShadow = `0 2px 8px ${borderColor}40, 0 0 0 1px ${borderColor}30`;
                    }
                  } else if (isToday && !isSelected) {
                    e.currentTarget.style.backgroundColor = `${colors.accent}40`;
                  }
                }}
              >
                <div>{dayInfo.day}</div>

                {/* Indicadores de notificaciones */}
                {dayNotifications.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      marginTop: "2px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      animation: "pulse 2s infinite",
                    }}
                  >
                    {dayNotifications
                      .slice(0, window.innerWidth <= 768 ? 2 : 3)
                      .map((notif, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: window.innerWidth <= 768 ? "4px" : "6px",
                            height: window.innerWidth <= 768 ? "4px" : "6px",
                            borderRadius: "50%",
                            backgroundColor: getUrgencyColor(
                              notif.urgencia_notificacion
                            ),
                            border: `1px solid ${
                              isSelected ? colors.white : colors.white
                            }`,
                            boxShadow: `0 1px 3px rgba(0,0,0,0.3)`,
                          }}
                        />
                      ))}
                    {dayNotifications.length >
                      (window.innerWidth <= 768 ? 2 : 3) && (
                      <div
                        style={{
                          fontSize: window.innerWidth <= 768 ? "6px" : "8px",
                          color: isSelected ? colors.white : colors.text,
                          fontWeight: "bold",
                        }}
                      >
                        +
                        {dayNotifications.length -
                          (window.innerWidth <= 768 ? 2 : 3)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Información del día seleccionado */}
        {selectedDay && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              backgroundColor: colors.lightGray,
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                color: colors.text,
              }}
            >
              Día seleccionado:{" "}
              <strong>
                {selectedDay} de {monthNames[month]} {year}
              </strong>
              {selectedDayNotifications.length > 0 && (
                <span style={{ marginLeft: "8px", color: colors.primary }}>
                  ({selectedDayNotifications.length} notificación
                  {selectedDayNotifications.length !== 1 ? "es" : ""})
                </span>
              )}
            </Text>
          </div>
        )}
      </Card>

      {/* Panel lateral con pestañas */}
      <Card
        bordered={false}
        style={{
          width: window.innerWidth <= 768 ? "100%" : "450px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: colors.white,
        }}
        bodyStyle={{ padding: window.innerWidth <= 768 ? "16px" : "24px" }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginTop: "-8px" }}
          items={[
            {
              key: "pendientes",
              label: (
                <span>
                  <CalendarOutlined />
                  {window.innerWidth <= 768
                    ? selectedDay
                      ? ` ${selectedDay}`
                      : " Pendientes"
                    : selectedDay
                    ? ` ${selectedDay} de ${monthNames[month]}`
                    : " Notificaciones"}
                  {selectedDayNotifications.length > 0 && (
                    <Badge
                      count={selectedDayNotifications.length}
                      style={{ marginLeft: "8px" }}
                    />
                  )}
                </span>
              ),
              children: (
                <div>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <Spin size="large" />
                    </div>
                  ) : selectedDayNotifications.length > 0 ? (
                    <List
                      dataSource={selectedDayNotifications}
                      renderItem={(notif) => (
                        <List.Item
                          style={{
                            padding: "16px 0",
                            borderBottom: `1px solid ${colors.lightGray}`,
                          }}
                        >
                          <div style={{ width: "100%" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "8px",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <Text
                                  strong
                                  style={{
                                    color: colors.text,
                                    fontSize: "14px",
                                  }}
                                >
                                  {notif.nombre_notificacion}
                                </Text>
                                <div
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: getUrgencyColor(
                                      notif.urgencia_notificacion
                                    ),
                                    display: "inline-block",
                                    marginLeft: "8px",
                                  }}
                                />
                              </div>

                              {/* Botones de acción */}
                              <div
                                style={{
                                  display: "flex",
                                  gap: "4px",
                                  marginLeft: "8px",
                                }}
                              >
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() =>
                                    handleEditarNotificacion(notif)
                                  }
                                  style={{
                                    color: colors.primary,
                                    padding: "4px",
                                    height: "24px",
                                    width: "24px",
                                    borderRadius: "4px",
                                  }}
                                  title="Editar notificación"
                                />

                                {notif.estado_notificacion !== "C" && (
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<CheckOutlined />}
                                    onClick={() =>
                                      handleMarcarCompletado(notif)
                                    }
                                    loading={
                                      actionLoading[
                                        `complete_${notif.id_notificacion}`
                                      ]
                                    }
                                    style={{
                                      color: colors.success,
                                      padding: "4px",
                                      height: "24px",
                                      width: "24px",
                                      borderRadius: "4px",
                                    }}
                                    title="Marcar como completado"
                                  />
                                )}

                                <Popconfirm
                                  title="¿Eliminar notificación?"
                                  description="Esta acción no se puede deshacer"
                                  onConfirm={() =>
                                    handleEliminarNotificacion(notif)
                                  }
                                  okText="Sí, eliminar"
                                  cancelText="Cancelar"
                                  okButtonProps={{
                                    style: {
                                      backgroundColor: colors.danger,
                                      borderColor: colors.danger,
                                    },
                                  }}
                                >
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    loading={
                                      actionLoading[
                                        `delete_${notif.id_notificacion}`
                                      ]
                                    }
                                    style={{
                                      color: colors.danger,
                                      padding: "4px",
                                      height: "24px",
                                      width: "24px",
                                      borderRadius: "4px",
                                    }}
                                    title="Eliminar notificación"
                                  />
                                </Popconfirm>
                              </div>
                            </div>

                            <Text
                              type="secondary"
                              style={{
                                fontSize: "12px",
                                display: "block",
                                marginBottom: "8px",
                                lineHeight: "1.4",
                              }}
                            >
                              {notif.descripcion_notificacion}
                            </Text>

                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                                marginBottom: "8px",
                              }}
                            >
                              <Tag
                                color={getStatusColor(
                                  notif.estado_notificacion
                                )}
                                style={{ fontSize: "10px", padding: "2px 6px" }}
                              >
                                {getStatusText(notif.estado_notificacion)}
                              </Tag>
                              <Tag
                                color={getUrgencyColor(
                                  notif.urgencia_notificacion
                                )}
                                style={{ fontSize: "10px", padding: "2px 6px" }}
                              >
                                {getUrgencyText(notif.urgencia_notificacion)}
                              </Tag>
                            </div>

                            <div
                              style={{
                                fontSize: "11px",
                                color: colors.mediumGray,
                              }}
                            >
                              <ClockCircleOutlined
                                style={{ marginRight: "4px" }}
                              />
                              {notif.horainicio_notificacion?.substring(0, 5)} -{" "}
                              {notif.horafin_notificacion?.substring(0, 5)}
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  ) : selectedDay ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No hay notificaciones para este día"
                      style={{ padding: "40px 0" }}
                    />
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px 0",
                        color: colors.mediumGray,
                      }}
                    >
                      <CalendarOutlined
                        style={{ fontSize: "48px", marginBottom: "16px" }}
                      />
                      <Text type="secondary">
                        Haz clic en un día para ver sus notificaciones
                      </Text>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "completadas",
              label: (
                <span>
                  <CheckCircleOutlined />
                  Completadas
                  {notificacionesCompletadas.length > 0 && (
                    <Badge
                      count={notificacionesCompletadas.length}
                      style={{ marginLeft: "8px" }}
                    />
                  )}
                </span>
              ),
              children: (
                <div>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <Spin size="large" />
                    </div>
                  ) : notificacionesCompletadas.length > 0 ? (
                    <List
                      dataSource={notificacionesCompletadas}
                      renderItem={(notif) => (
                        <List.Item
                          style={{
                            padding: "16px 0",
                            borderBottom: `1px solid ${colors.lightGray}`,
                          }}
                        >
                          <div style={{ width: "100%" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "8px",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <Text
                                  strong
                                  style={{
                                    color: colors.mediumGray,
                                    fontSize: "14px",
                                    textDecoration: "line-through",
                                  }}
                                >
                                  {notif.nombre_notificacion}
                                </Text>
                                <div
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: colors.success,
                                    display: "inline-block",
                                    marginLeft: "8px",
                                  }}
                                />
                              </div>

                              {/* Botones de acción para completadas */}
                              <div
                                style={{
                                  display: "flex",
                                  gap: "4px",
                                  marginLeft: "8px",
                                }}
                              >
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<UndoOutlined />}
                                  onClick={() =>
                                    handleRestaurarPendiente(notif)
                                  }
                                  loading={
                                    actionLoading[
                                      `restore_${notif.id_notificacion}`
                                    ]
                                  }
                                  style={{
                                    color: colors.warning,
                                    padding: "4px",
                                    height: "24px",
                                    width: "24px",
                                    borderRadius: "4px",
                                  }}
                                  title="Restaurar a pendiente"
                                />

                                <Popconfirm
                                  title="¿Eliminar notificación completada?"
                                  description="Esta acción no se puede deshacer"
                                  onConfirm={() =>
                                    handleEliminarNotificacion(notif)
                                  }
                                  okText="Sí, eliminar"
                                  cancelText="Cancelar"
                                  okButtonProps={{
                                    style: {
                                      backgroundColor: colors.danger,
                                      borderColor: colors.danger,
                                    },
                                  }}
                                >
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    loading={
                                      actionLoading[
                                        `delete_${notif.id_notificacion}`
                                      ]
                                    }
                                    style={{
                                      color: colors.danger,
                                      padding: "4px",
                                      height: "24px",
                                      width: "24px",
                                      borderRadius: "4px",
                                    }}
                                    title="Eliminar permanentemente"
                                  />
                                </Popconfirm>
                              </div>
                            </div>

                            <Text
                              type="secondary"
                              style={{
                                fontSize: "12px",
                                display: "block",
                                marginBottom: "8px",
                                lineHeight: "1.4",
                                opacity: 0.7,
                              }}
                            >
                              {notif.descripcion_notificacion}
                            </Text>

                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                                marginBottom: "8px",
                              }}
                            >
                              <Tag
                                color={colors.success}
                                style={{ fontSize: "10px", padding: "2px 6px" }}
                              >
                                Completado
                              </Tag>
                              <Tag
                                color={getUrgencyColor(
                                  notif.urgencia_notificacion
                                )}
                                style={{
                                  fontSize: "10px",
                                  padding: "2px 6px",
                                  opacity: 0.7,
                                }}
                              >
                                {getUrgencyText(notif.urgencia_notificacion)}
                              </Tag>
                            </div>

                            <div
                              style={{
                                fontSize: "11px",
                                color: colors.mediumGray,
                                opacity: 0.7,
                              }}
                            >
                              <ClockCircleOutlined
                                style={{ marginRight: "4px" }}
                              />
                              {notif.horainicio_notificacion?.substring(0, 5)} -{" "}
                              {notif.horafin_notificacion?.substring(0, 5)}
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No hay notificaciones completadas"
                      style={{ padding: "40px 0" }}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Modales */}
      <ModalCrearNotificacion
        visible={modalCrearVisible}
        onClose={handleCloseModalCrear}
        onSuccess={handleSuccessModal}
        selectedDate={selectedDay || todayDate}
        selectedMonth={month}
        selectedYear={year}
      />

      <ModalModificarNotificacion
        visible={modalModificarVisible}
        onClose={handleCloseModalModificar}
        onSuccess={handleSuccessModal}
        selectedNotificacion={selectedNotificacionForEdit}
      />
    </div>
  );
};

export default Calendario;
