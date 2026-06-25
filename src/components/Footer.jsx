import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container-fluid px-4">
        
        {/* LOGO: Usamos Link to="/" */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo.png" alt="Spooter Logo" height="40" className="me-2" />
      
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
          {/* NAVEGACIÓN: Link to="..." */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/"><i className="bi bi-house-door me-1"></i>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/album/perros"><i className="bi bi-dog me-1"></i>Perros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/album/gatos"><i className="bi bi-cat me-1"></i>Gatos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/album/plantas"><i className="bi bi-tree me-1"></i>Plantas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/comunidad"><i className="bi bi-journal-album me-1"></i>Comunidad</Link>
            </li>
          </ul>

          <div className="d-flex">
            {/* Botón Ingresar */}
            <Link to="/login" className="btn btn-outline-success fw-bold px-4 rounded-pill">
              <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;