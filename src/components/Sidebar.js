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
      width={200}
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
        items={[
          {
            key: "1",
            icon: <FaIcons.FaHouseUser />,
            label: (
              <NavLink to="/" style={{ color: "black" }}>
                Inicio
              </NavLink>
            ),
          },
          {
            key: "2",
            icon: <FaIcons.FaArchive />,
            label: (
              <NavLink to="/inventario" style={{ color: "black" }}>
                Inventario
              </NavLink>
            ),
          },
          {
            key: "3",
            icon: <FaIcons.FaCashRegister />,
            label: (
              <NavLink to="/prueba" style={{ color: "black" }}>
                Prueba
              </NavLink>
            ),
          },

          {
            key: "4",
            icon: <FaIcons.FaProductHunt />,
            label: (
              <NavLink to="/productos-vendidos" style={{ color: "black" }}>
                Productos
              </NavLink>
            ),
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
