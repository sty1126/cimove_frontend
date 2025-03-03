import React from "react";
import { FiLogOut } from "react-icons/fi";
import * as FaIcons from "react-icons/fa";

import {
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import logo from "../media/logoCimove_noletras.png";

const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light px-3">
      <a className="navbar-brand d-flex align-items-center" href="/">
        <img src={logo} alt="CIMOVE Logo" width="50" />
        <span className="ms-2 fs-3 fw-bold">CIMOVE</span>
      </a>

      <Nav className="ms-auto">
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            <FaIcons.FaRegUserCircle className="me-2 text-dark" />
            Usuario
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>
              <FaIcons.FaUserEdit className="me-2" />
              Mi perfil
            </DropdownItem>
            <DropdownItem>
              <FaIcons.FaUserCog className="me-2" />
              Configuraciones
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <FiLogOut className="me-2" />
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </nav>
  );
};

export default Navbar;
