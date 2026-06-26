import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Footer.css';

function Footer() {

  const showSpotterSteps = () => {
    Swal.fire({
      title: '¿Qué es Spotter?',
      html: `
        <div style="text-align:left; font-size:14px; line-height:1.6">
          <h3>📸 Step 1</h3>
          <p>Capturás momentos: mascotas, plantas y paisajes.</p>
          <hr/>
          <h3>🃏 Step 2</h3>
          <p>Cada foto se convierte en una trading card coleccionable.</p>
          <hr/>
          <h3>🌍 Step 3</h3>
          <p>Podés guardarlas en tu álbum o compartirlas en la comunidad.</p>
          <hr/>
          <b>Spotter = coleccionar momentos de tu vida.</b>
        </div>
      `,
      confirmButtonText: 'Empezar 🚀',
      confirmButtonColor: '#27ae60',
      background: '#1b2631',
      color: '#ffffff'
    });
  };

  return (
    <footer className="app-footer">

      {/* FILA PRINCIPAL (botones reducidos sin el de Inicio) */}
      <div className="footer-main">

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

      </div>

      {/* FILA INFERIOR (Logo ahora es botón de inicio + info) */}
      <div className="footer-bottom">

        <Link to="/" className="footer-logo">
          <img src="/logoblanco.png" alt="Spotter - Inicio" />
        </Link>

        <button
          className="footer-btn info"
          onClick={showSpotterSteps}
        >
            Qué es Spotter ❓
        </button>

      </div>

    </footer>
  );
}

export default Footer;