import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Swal from 'sweetalert2';
import './NavBar.css';

function Navbar() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Detectar si es iOS para mostrar el botón siempre (instrucciones)
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIos(isIosDevice);

    // Escuchar el evento de instalación para Android/Desktop
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIos) {
      Swal.fire({
        title: 'Instalar Spotter',
        text: 'En iPhone, toca el botón "Compartir" de Safari y selecciona "Añadir a pantalla de inicio".',
        icon: 'info',
        confirmButtonText: '¡Entendido!'
      });
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Si el botón aparece pero no hay prompt, es que ya está instalada o el navegador no lo permite
      Swal.fire('Info', 'La app ya está instalada o tu navegador no permite la instalación directa.', 'info');
    }
  };

  const fetchUsername = async (userId) => {
    const { data } = await supabase.from('profiles').select('username').eq('id', userId).single();
    if (data) setUsername(data.username);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUsername(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUsername(session.user.id);
      else setUsername(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const closeNavbar = () => {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarCollapse?.classList.contains('show')) navbarToggler.click();
  };

  const albumCategorias = ['perros', 'gatos', 'plantas', 'paisajes'];

  return (
    <nav className="navbar navbar-expand-lg spooter-navbar">
      <div className="container-fluid px-4">
        
        {/* Botón de instalación: Visible en iOS siempre, o en Android si hay un prompt */}
        {(deferredPrompt || isIos) && (
          <button className="btn btn-sm btn-outline-warning me-3" onClick={handleInstall}>
            <i className="bi bi-download"></i> <span className="d-none d-sm-inline">Instalar</span>
          </button>
        )}

        <NavLink className="navbar-brand" to="/">
          <img src="/logo.png" alt="Spooter" height="40" onError={(e) => { e.target.style.display = 'none'; }} />
        </NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {session && (
              <li className="nav-item"><span className="user-greeting">Hola, {username || 'Usuario'}</span></li>
            )}
            <li className="nav-item"><NavLink className="nav-link" to="/" end onClick={closeNavbar}>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/comunidad" onClick={closeNavbar}>Comunidad</NavLink></li>
            {albumCategorias.map((cat) => (
              <li className="nav-item" key={cat}>
                <NavLink className="nav-link text-capitalize" to={`/album/${cat}`} onClick={closeNavbar}>{cat}</NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center">
            {session ? (
              <button className="btn btn-danger rounded-pill px-4" onClick={handleLogout}>Salir</button>
            ) : (
              <NavLink className="btn btn-login-spooter rounded-pill px-4" to="/login" onClick={closeNavbar}>Ingresar</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;