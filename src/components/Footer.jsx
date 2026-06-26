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

          <p><b>Spotter</b> es una app donde capturás momentos de tu vida — mascotas, paisajes y todo lo que te gusta — y los transformás en cartas coleccionables digitales.</p>

          <hr/>

          <h3>⚙️ ¿Cómo funciona?</h3>

          <p><b>1. Creás tu cuenta</b><br/>
          Te registrás e iniciás sesión para acceder a tu colección personal.</p>

          <p><b>2. Capturás momentos</b><br/>
          Elegís una categoría (perros, gatos, plantas o paisajes) y:</p>

          <ul>
            <li>Sacás una foto</li>
            <li>o la subís desde tu galería</li>
          </ul>

          <p>Se convierte automáticamente en una trading card.</p>

          <p><b>3. Tu álbum</b><br/>
          Tus cards se guardan en tu colección privada organizada por categoría.</p>

          <hr/>

          <h3>🌍 Comunidad</h3>

          <ul>
            <li>Compartís cartas que querés mostrar</li>
            <li>Ves publicaciones de otros usuarios</li>
            <li>Dás “me gusta” ❤️</li>
            <li>Descubrís nuevas cards</li>
          </ul>

          <hr/>

          <h3>💡 En resumen</h3>

          <p><b>Spotter convierte momentos reales en coleccionables digitales.</b></p>
          <p>No es solo una galería de fotos, es una forma de coleccionar lo que vivís.</p>

        </div>
      `,
      confirmButtonText: 'Empezar 🚀',
      confirmButtonColor: '#27ae60',
      background: '#1b2631',
      color: '#ffffff',
      width: '600px'
    });
  };

  return (
    <footer className="app-footer">

      {/* FILA PRINCIPAL */}
      <div className="footer-main">

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

      </div>

      {/* FILA SECUNDARIA */}
      <div className="footer-secondary">

        <button
          className="footer-btn info"
          onClick={showSpotterSteps}
        >
          ❓ Qué es Spotter
        </button>

      </div>

    </footer>
  );
}

export default Footer;