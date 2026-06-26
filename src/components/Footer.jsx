import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">

      <Link to="/" className="footer-btn home">
        🏠 Inicio
      </Link>

      <Link to="/album/perros" className="footer-btn dogs">
        🐶 Perros
      </Link>

      <Link to="/album/gatos" className="footer-btn cats">
        🐱 Gatos
      </Link>

      <Link to="/album/plantas" className="footer-btn plants">
        🌿 Plantas
      </Link>

      <Link to="/comunidad" className="footer-btn community">
        🌎 Comunidad
      </Link>

    </footer>
  );
}

export default Footer;