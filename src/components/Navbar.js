import logo from "../media/logoCimove_noletras.png";
import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid d-flex align-items-center justify-content-begin">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src={logo} alt="CIMOVE Logo" width="50" />
          <span className="ms-2 fs-3 fw-bold">CIMOVE</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
