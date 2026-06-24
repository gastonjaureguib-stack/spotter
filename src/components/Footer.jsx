import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container-fluid px-4">
        
        {/* IZQUIERDA: Logo que redirige a Home */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img 
            src="/logo.png" 
            alt="Spooter Logo" 
            height="40" 
            className="d-inline-block align-text-top me-2"
            onError={(e) => {
              // Por si aún no pusiste el archivo en public, evita que se rompa la imagen
              e.target.style.display = 'none';
            }}
          />
          <span className="fw-bold text-success fs-4">Spooter</span>
        </a>

        {/* Botón Hamburguesa para celulares */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CENTRO Y DERECHA */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
          {/* CENTRO: Links de navegación requeridos */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <a className="nav-link active fw-semibold" aria-current="page" href="#">
                <i className="bi bi-house-door me-1"></i>Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="#">
                <i className="bi bi-dog me-1"></i>Perros
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="#">
                <i className="bi bi-cat me-1"></i>Gatos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="#">
                <i className="bi bi-tree me-1"></i>Plantas
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="#">
                <i className="bi bi-journal-album me-1"></i>Álbum
              </a>
            </li>
          </ul>

          {/* DERECHA: Botón de Login (reemplaza al formulario de búsqueda) */}
          <div className="d-flex">
            <button className="btn btn-outline-success fw-bold px-4 rounded-pill" type="button">
              <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;