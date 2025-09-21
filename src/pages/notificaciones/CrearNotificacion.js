"use client";

import { useState, useEffect } from "react";
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
  Checkbox,
} from "antd";
import {
  PlusCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TagOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { crearNotificacion } from "../../services/notificacionesService";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

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
};

const ModalCrearNotificacion = ({
  visible,
  onClose,
  onSuccess,
  selectedDate,
  selectedMonth,
  selectedYear,
}) => {
  const [form] = Form.useForm(); // ✅ Solución aquí
  const [loading, setLoading] = useState(false);
  const [masDeUnDia, setMasDeUnDia] = useState(false);
  const [todoElDia, setTodoElDia] = useState(false);

  const urgenciaOptions = [
    {
      label: "No Urgente",
      value: "B",
      color: colors.success,
      icon: <FlagOutlined style={{ color: colors.success }} />,
    },
    {
      label: "Normal",
      value: "N",
      color: colors.warning,
      icon: <FlagOutlined style={{ color: colors.warning }} />,
    },
    {
      label: "Urgente",
      value: "U",
      color: colors.danger,
      icon: <FlagOutlined style={{ color: colors.danger }} />,
    },
  ];

  useEffect(() => {
    if (visible) {
      const fechaSeleccionada = dayjs(
        new Date(selectedYear, selectedMonth, selectedDate)
      );

      form.setFieldsValue({
        nombre_notificacion: "",
        descripcion_notificacion: "",
        fechainicio_notificacion: fechaSeleccionada,
        fechafin_notificacion: fechaSeleccionada,
        horainicio_notificacion: dayjs("09:00", "HH:mm"),
        horafin_notificacion: dayjs("18:00", "HH:mm"),
        urgencia_notificacion: "N", // Normal por defecto
      });
    }
  }, [visible, selectedDate, selectedMonth, selectedYear, form]);

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (
        values.fechafin_notificacion.isBefore(values.fechainicio_notificacion)
      ) {
        message.error("La fecha de fin no puede ser anterior a la fecha de inicio");
        setLoading(false);
        return;
      }

      const today = dayjs().startOf("day");
      if (values.fechainicio_notificacion.isBefore(today)) {
        message.error("No se pueden seleccionar fechas en el pasado");
        setLoading(false);
        return;
      }

      if (values.fechainicio_notificacion.isSame(values.fechafin_notificacion, "day")) {
        if (values.horafin_notificacion.isBefore(values.horainicio_notificacion)) {
          message.error("La hora de fin no puede ser anterior a la hora de inicio");
          setLoading(false);
          return;
        }
      }

      const notificacionData = {
        nombre_notificacion: values.nombre_notificacion,
        descripcion_notificacion: values.descripcion_notificacion,
        urgencia_notificacion: values.urgencia_notificacion,
        fechainicio_notificacion: values.fechainicio_notificacion.format("YYYY-MM-DD"),
        fechafin_notificacion: values.fechafin_notificacion.format("YYYY-MM-DD"),
        horainicio_notificacion: values.horainicio_notificacion.format("HH:mm:ss"),
        horafin_notificacion: values.horafin_notificacion.format("HH:mm:ss"),
        estado_notificacion: "P", // Pendiente por defecto
      };
      await crearNotificacion(notificacionData);
      message.success("Notificación creada exitosamente");
      form.resetFields();
      setMasDeUnDia(false);
      setTodoElDia(false);
      onSuccess();
    } catch (error) {
      console.error("Error al crear notificación:", error);
      message.error(error?.response?.data?.error || "Error al crear la notificación");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setMasDeUnDia(false);
    setTodoElDia(false);
    onClose();
  };

  const handleTodoElDiaChange = (checked) => {
    setTodoElDia(checked);
    if (checked) {
      form.setFieldsValue({
        horainicio_notificacion: dayjs("07:00", "HH:mm"),
        horafin_notificacion: dayjs("19:00", "HH:mm"),
      });
    }
  };

  const handleMasDeUnDiaChange = (checked) => {
    setMasDeUnDia(checked);
    if (!checked) {
      const fechaInicio = form.getFieldValue("fechainicio_notificacion");
      if (fechaInicio) {
        form.setFieldsValue({ fechafin_notificacion: fechaInicio });
      }
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <PlusCircleOutlined style={{ color: colors.success, fontSize: "24px" }} />
          <div>
            <Title level={4} style={{ margin: 0, color: colors.text }}>
              Crear Nueva Notificación
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Organiza tu tiempo y no olvides lo importante
            </Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={window.innerWidth <= 768 ? "95%" : 800}
      style={{ top: window.innerWidth <= 768 ? 10 : 20 }}
      bodyStyle={{
        padding: window.innerWidth <= 768 ? "16px" : "24px",
        maxHeight: window.innerWidth <= 768 ? "80vh" : "70vh",
        overflowY: "auto",
      }}
    >
      <Form
        form={form} // ✅ Aquí pasamos el form
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ marginTop: "16px" }}
      >
        <div style={{ marginBottom: "24px" }}>
          <Title
            level={5}
            style={{ color: colors.success, marginBottom: "16px" }}
          >
            <TagOutlined style={{ marginRight: "8px" }} />
            Información Básica
          </Title>

          <Form.Item
            name="nombre_notificacion"
            label="Nombre de la Notificación"
            rules={[
              { required: true, message: "El nombre es obligatorio" },
              { max: 100, message: "Máximo 100 caracteres" },
            ]}
          >
            <Input
              prefix={<FileTextOutlined style={{ color: colors.primary }} />}
              placeholder="Ej: Reunión con el equipo, Entrega de proyecto..."
              style={{ borderRadius: "8px", height: "40px" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="urgencia_notificacion"
                label="Nivel de Urgencia"
                rules={[
                  {
                    required: true,
                    message: "Seleccione el nivel de urgencia",
                  },
                ]}
              >
                <Select
                  placeholder="¿Qué tan importante es?"
                  style={{ borderRadius: "8px" }}
                  suffixIcon={
                    <ExclamationCircleOutlined
                      style={{ color: colors.primary }}
                    />
                  }
                >
                  {urgenciaOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: colors.background,
                  borderRadius: "8px",
                  marginTop: window.innerWidth <= 768 ? "0" : "32px",
                }}
              >
                <Text style={{ fontSize: "12px", color: colors.text }}>
                  <InfoCircleOutlined style={{ marginRight: "4px" }} />
                  <strong>Tip:</strong> Las notificaciones urgentes aparecerán
                  con borde rojo en el calendario
                </Text>
              </div>
            </Col>
          </Row>

          <Form.Item
            name="descripcion_notificacion"
            label="Descripción Detallada"
            rules={[
              { required: true, message: "La descripción es obligatoria" },
              { max: 500, message: "Máximo 500 caracteres" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Describe los detalles importantes de esta notificación..."
              style={{ borderRadius: "8px" }}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>

        <Divider style={{ margin: "24px 0", borderColor: colors.light }}>
          <CalendarOutlined style={{ color: colors.primary }} />
        </Divider>

        <div style={{ marginBottom: "24px" }}>
          <Title
            level={5}
            style={{ color: colors.primary, marginBottom: "16px" }}
          >
            <CalendarOutlined style={{ marginRight: "8px" }} />
            Programación
          </Title>

          <div style={{ marginBottom: "16px" }}>
            <Checkbox
              checked={masDeUnDia}
              onChange={(e) => handleMasDeUnDiaChange(e.target.checked)}
              style={{ marginRight: "16px" }}
            >
              Más de un día
            </Checkbox>
            <Checkbox
              checked={todoElDia}
              onChange={(e) => handleTodoElDiaChange(e.target.checked)}
            >
              Todo el día (7:00 AM - 7:00 PM)
            </Checkbox>
          </div>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="fechainicio_notificacion"
                label="Fecha de Inicio"
                rules={[
                  {
                    required: true,
                    message: "La fecha de inicio es obligatoria",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%", borderRadius: "8px", height: "40px" }}
                  format="DD/MM/YYYY"
                  placeholder="¿Cuándo inicia?"
                  disabledDate={disabledDate}
                  onChange={(date) => {
                    if (!masDeUnDia && date) {
                      form.setFieldsValue({ fechafin_notificacion: date });
                    }
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="fechafin_notificacion"
                label="Fecha de Fin"
                rules={[
                  { required: true, message: "La fecha de fin es obligatoria" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%", borderRadius: "8px", height: "40px" }}
                  format="DD/MM/YYYY"
                  placeholder="¿Cuándo termina?"
                  disabledDate={disabledDate}
                  disabled={!masDeUnDia}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="horainicio_notificacion"
                label="Hora de Inicio"
                rules={[
                  {
                    required: true,
                    message: "La hora de inicio es obligatoria",
                  },
                ]}
              >
                <TimePicker
                  style={{ width: "100%", borderRadius: "8px", height: "40px" }}
                  format="HH:mm"
                  placeholder="Hora de inicio"
                  suffixIcon={
                    <ClockCircleOutlined style={{ color: colors.primary }} />
                  }
                  disabled={todoElDia}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="horafin_notificacion"
                label="Hora de Fin"
                rules={[
                  { required: true, message: "La hora de fin es obligatoria" },
                ]}
              >
                <TimePicker
                  style={{ width: "100%", borderRadius: "8px", height: "40px" }}
                  format="HH:mm"
                  placeholder="Hora de fin"
                  suffixIcon={
                    <ClockCircleOutlined style={{ color: colors.primary }} />
                  }
                  disabled={todoElDia}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

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
            onClick={handleCancel}
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
            icon={<CheckCircleOutlined />}
            style={{
              backgroundColor: colors.success,
              borderColor: colors.success,
              borderRadius: "8px",
              height: "44px",
              padding: "0 24px",
              fontWeight: "500",
              boxShadow: "0 2px 8px rgba(77, 138, 82, 0.3)",
            }}
          >
            Crear Notificación
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCrearNotificacion;
