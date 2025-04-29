import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, message, DatePicker, Typography, Card, Statistic, InputNumber, Space } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const FormularioAbono = () => {
  const { idFactura } = useParams();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Formatear valores en pesos colombianos
  const formatCOP = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  // Calcular saldo pendiente en tiempo real
  const calcularSaldoPendiente = () => {
    if (!factura) return 0;
    const montoTotal = parseFloat(factura.monto_facturaproveedor) || 0;
    const totalAbonado = parseFloat(factura.total_abonado) || 0;
    return montoTotal - totalAbonado;
  };

  // Obtener datos actualizados de la factura
  const fetchFactura = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://cimove-backend.onrender.com/api/facturas-proveedor/${idFactura}`);
      setFactura(response.data);
    } catch (error) {
      message.error('Error al cargar la factura');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => { 
    fetchFactura(); 
  }, [idFactura]);

  // Manejar envío del abono
  const registrarAbono = async (values) => {
    setSubmitting(true);
    try {
      await axios.post('https://cimove-backend.onrender.com/api/abonos', {
        id_facturaproveedor_abonofactura: idFactura,
        fecha_abonofactura: values.fecha.format('YYYY-MM-DD'),
        monto_abonofactura: values.monto,
      });
      
      message.success('Abono registrado exitosamente');
      form.resetFields();
      await fetchFactura(); // Actualizar datos incluyendo el nuevo abono
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al registrar abono');
    } finally {
      setSubmitting(false);
    }
  };

  const saldoPendiente = calcularSaldoPendiente();

  return (
    <Card 
      title={<Title level={4}>Registrar Abono - Factura #{idFactura}</Title>}
      loading={loading}
      style={{ maxWidth: 700, margin: '20px auto' }}
    >
      {factura && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Statistic
              title="Valor Total Factura"
              value={factura.monto_facturaproveedor}
              precision={0}
              formatter={val => formatCOP(val)}
            />
            <Statistic
              title="Total Abonado"
              value={factura.total_abonado || 0}
              precision={0}
              formatter={val => formatCOP(val)}
            />
            <div style={{ marginTop: 16 }}>
              <Text strong style={{ fontSize: 16 }}>Saldo Pendiente: </Text>
              <Text 
                style={{ 
                  color: saldoPendiente > 0 ? '#f5222d' : '#389e0d',
                  fontWeight: 600,
                  fontSize: 18
                }}
              >
                {formatCOP(saldoPendiente)}
              </Text>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={registrarAbono}
            initialValues={{ fecha: dayjs() }}
          >
            <Form.Item
              name="monto"
              label="Valor del Abono (COP)"
              rules={[
                { required: true, message: 'Ingrese el valor del abono' },
                { type: 'number', min: 1, message: 'Mínimo $1 COP' },
                () => ({
                  validator(_, value) {
                    if (!value || value <= saldoPendiente) {
                      return Promise.resolve();
                    }
                    return Promise.reject('El abono no puede exceder el saldo pendiente');
                  },
                }),
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={saldoPendiente}
                precision={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\$\s?|(\.*)/g, '')}
                disabled={saldoPendiente <= 0}
                size="large"
              />
            </Form.Item>

            <Form.Item name="fecha" label="Fecha del Abono">
              <DatePicker 
                format="DD/MM/YYYY" 
                style={{ width: '100%' }}
                disabledDate={current => current > dayjs().endOf('day')}
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={saldoPendiente <= 0}
              block
              size="large"
            >
              {saldoPendiente <= 0 ? 'FACTURA PAGADA EN SU TOTALIDAD' : 'REGISTRAR ABONO'}
            </Button>
          </Form>
        </Space>
      )}
    </Card>
  );
};

export default FormularioAbono;