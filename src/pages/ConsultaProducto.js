import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => (
  <nav className="navbar navbar-light bg-light shadow-sm p-3">
    <div className="container-fluid d-flex justify-content-end">
      <span className="me-2 fw-semibold">Administrador</span>
      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: "35px", height: "35px" }}>
        <span className="text-white">👤</span>
      </div>
    </div>
  </nav>
);

const ProductTable = () => {
  const [search, setSearch] = useState("");
  const products = [
    { name: "Funda de silicona", units: 10, price: "$10.000" },
    { name: "Cargador rápido", units: 5, price: "$25000" },
    { name: "Audífonos Bluetooth", units: 8, price: "$30000" },
    { name: "Protector de pantalla", units: 20, price: "$10500" }
  ];

  return (
    <div className="card shadow-sm mt-4 p-4">
      <h5 className="card-title">Productos vendidos</h5>
      <input
        type="text"
        className="form-control mt-2 mb-3"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="table table-bordered">
        <thead className="table-primary">
          <tr>
            <th>Producto</th>
            <th>Unidades</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.units}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const NewProductForm = () => {
  const [product, setProduct] = useState({ name: "", units: "", price: "" });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto agregado:", product);
  };

  return (
    <div className="card shadow-sm mt-4 p-4">
      <h5 className="card-title">Ingresar Nuevo Producto</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del Producto</label>
          <input type="text" name="name" className="form-control" value={product.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Unidades</label>
          <input type="number" name="units" className="form-control" value={product.units} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input type="number" name="price" className="form-control" value={product.price} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Agregar Producto</button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="container py-4">
      <Header />
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-4 d-flex flex-row align-items-center">
            <button className="btn btn-primary me-2">1</button>
            <button className="btn btn-primary me-2">2</button>
            <button className="btn btn-primary">3</button>
            <span className="ms-3 fw-semibold">Productos más vendidos</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-4 text-center">
            <h6 className="fw-semibold">Detalles</h6>
            <div className="bg-primary rounded-circle mx-auto mt-3" style={{ width: "50px", height: "50px" }}></div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-4 d-flex flex-row justify-content-between align-items-center">
            <h6 className="fw-semibold">Total:</h6>
            <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>$</div>
          </div>
        </div>
      </div>
      <ProductTable />
      <NewProductForm />
    </div>
  );
};

export default Dashboard;
