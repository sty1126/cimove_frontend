import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/" className="text-dark" activeClassName="active">
            <FaIcons.FaHouseUser className="me-2" /> Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/inventario"
            className="text-dark"
            activeClassName="active"
          >
            <FaIcons.FaArchive className="me-2" /> Inventario
          </NavLink>
        </li>
        <li>
          <NavLink to="/prueba" className="text-dark" activeClassName="active">
            <FaIcons.FaCashRegister className="me-3" />
            Prueba
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
