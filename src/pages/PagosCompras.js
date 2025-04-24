// src/pages/PagosCompras.js
import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Title } = Typography;

const PagosCompras = () => {
  const [abonos, setAbonos] = useState([]);

  useEffect(() => {
    const fetchAbonos = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/abonos"); 
        setAbonos(res.data);
      } catch (error) {
        console.error("Error al obtener abonos:", error);
      }
    };
    fetchAbonos();
  }, []);

  const columns = [
    {
      title: "ID Abono",
      dataIndex: "id_abonofactura",
      key: "id_abonofactura",
    },
    {
      title: "ID Factura",
      dataIndex: "id_facturaproveedor_abonofactura",
      key: "id_facturaproveedor_abonofactura",
    },
    {
        title: "Fecha",
        dataIndex: "fecha_abonofactura",
        key: "fecha_abonofactura",
        sorter: (a, b) =>
          new Date(a.fecha_abonofactura) - new Date(b.fecha_abonofactura),
        render: (fecha) => (
          <Typography.Text>
            {fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-"}
          </Typography.Text>
        ),
      },
    {
      title: "Monto",
      dataIndex: "monto_abonofactura",
      key: "monto_abonofactura",
    },
  ];

  return (
    <div>
      <Title level={3}>Pagos de Compras (Abonos a Proveedores)</Title>
      <Table columns={columns} dataSource={abonos} rowKey="id_abonofactura" />
    </div>
  );
};

export default PagosCompras;
