import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="">Inicio</Link>
          <Link to="">Inventario</Link>
          <Link to="">Prueba</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
