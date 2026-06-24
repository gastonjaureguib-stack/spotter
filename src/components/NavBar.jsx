import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';


function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm spooter-navbar">
      <div className="container-fluid px-3 d-flex flex-wrap align-items-center justify-content-between">
        
        {/* LADO IZQUIERDA: Logo (vuelve al Home) */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
            src="/logo.png" 
            alt="Spooter Logo" 
            height="36" 
            className="d-inline-block align-text-top me-2"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </Link>

        {/* CONTENEDOR DERECHO EN MÓVIL: Login + Hamburguesa */}
        <div className="d-flex align-items-center gap-2 order-lg-3">
          <Link 
            className="btn btn-login-spooter fw-bold px-3 rounded-pill btn-sm" 
            to="/login"
          >
            <i className="bi bi-box-arrow-in-right me-1"></i>Ingresar
          </Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* MENÚ DESPLEGABLE */}
        <div className="collapse navbar-collapse order-lg-2 w-100-mobile" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 pt-2 pt-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                <i className="bi bi-house-door me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item"><a className="nav-link" href="#"><i className="bi bi-dog me-1"></i>Perros</a></li>
            <li className="nav-item"><a className="nav-link" href="#"><i className="bi bi-cat me-1"></i>Gatos</a></li>
            <li className="nav-item"><a className="nav-link" href="#"><i className="bi bi-tree me-1"></i>Plantas</a></li>
            <li className="nav-item">
              <Link className="nav-link" to="/album">
                <i className="bi bi-journal-album me-1"></i>Álbum
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;