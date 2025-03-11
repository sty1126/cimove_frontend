import { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={220}
      style={{ height: "100vh", backgroundColor: "#f0f2f5" }}
      trigger={null}
    >
      <div
        style={{ display: "flex", justifyContent: "center", padding: "10px" }}
      >
        <Button
          type="text"
          icon={
            collapsed ? (
              <FaIcons.FaBars size={20} />
            ) : (
              <FaIcons.FaTimes size={20} />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "black" }}
        />
      </div>
      <Menu
        mode="inline"
        style={{ backgroundColor: "#f0f2f5", fontSize: "16px" }}
      >
        <Menu.Item key="1" icon={<FaIcons.FaHome />}>
          <NavLink to="/" style={{ color: "black", fontWeight: "bold" }}>
            Inicio
          </NavLink>
        </Menu.Item>

        <Menu.ItemGroup
          title={<span style={{ fontWeight: "bold" }}>Ventas</span>}
        >
          <Menu.Item key="2" icon={<FaIcons.FaFileInvoiceDollar />}>
            <NavLink to="/" style={{ color: "black" }}>
              Facturación
            </NavLink>
          </Menu.Item>
          <Menu.Item key="3" icon={<FaIcons.FaMoneyBillWave />}>
            <NavLink to="/" style={{ color: "black" }}>
              Pagos
            </NavLink>
          </Menu.Item>
          <Menu.Item key="4" icon={<FaIcons.FaUsers />}>
            <NavLink to="/" style={{ color: "black" }}>
              Clientes
            </NavLink>
          </Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup
          title={<span style={{ fontWeight: "bold" }}>Compras</span>}
        >
          <Menu.Item key="5" icon={<FaIcons.FaFileInvoice />}>
            <NavLink to="/" style={{ color: "black" }}>
              Facturación
            </NavLink>
          </Menu.Item>
          <Menu.Item key="6" icon={<FaIcons.FaMoneyCheckAlt />}>
            <NavLink to="/" style={{ color: "black" }}>
              Pagos
            </NavLink>
          </Menu.Item>
          <Menu.Item key="7" icon={<FaIcons.FaTruck />}>
            <NavLink to="/" style={{ color: "black" }}>
              Proveedores
            </NavLink>
          </Menu.Item>
          <Menu.Item key="8" icon={<FaIcons.FaBoxOpen />}>
            <NavLink to="/" style={{ color: "black" }}>
              Catálogo
            </NavLink>
          </Menu.Item>
          <Menu.Item key="9" icon={<FaIcons.FaWarehouse />}>
            <NavLink to="/inventario" style={{ color: "black" }}>
              Inventario
            </NavLink>
          </Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup
          title={<span style={{ fontWeight: "bold" }}>Monitoreo</span>}
        >
          <Menu.Item key="10" icon={<FaIcons.FaClipboardList />}>
            <NavLink to="/productos-vendidos" style={{ color: "black" }}>
              Productos vendidos
            </NavLink>
          </Menu.Item>
          <Menu.Item key="11" icon={<FaIcons.FaCalendarAlt />}>
            <NavLink to="/" style={{ color: "black" }}>
              Calendario
            </NavLink>
          </Menu.Item>
          <Menu.Item key="12" icon={<FaIcons.FaChartBar />}>
            <NavLink to="/" style={{ color: "black" }}>
              Estadísticas
            </NavLink>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
