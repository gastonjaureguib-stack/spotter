import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './NavBar.css';

function Navbar() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  const fetchUsername = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
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

  // Función para cerrar el menú en móviles tras seleccionar una opción
  const closeNavbar = () => {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    // Si el menú está abierto, forzamos el cierre
    if (navbarCollapse?.classList.contains('show')) {
      navbarToggler.click();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg spooter-navbar">
      <div className="container-fluid px-4">
        
        <NavLink className="navbar-brand" to="/">
          <img src="/logo.png" alt="Spooter" height="40" onError={(e) => { e.target.style.display = 'none'; }} />
        </NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {session && (
              <li className="nav-item">
                <span className="user-greeting">Hola, {username || 'Usuario'}</span>
              </li>
            )}
            
            {/* Usamos NavLink para que el CSS detecte la clase 'active' */}
            <li className="nav-item"><NavLink className="nav-link" to="/" end onClick={closeNavbar}>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/comunidad" onClick={closeNavbar}>Comunidad</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/album/perros" onClick={closeNavbar}>Perros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/album/gatos" onClick={closeNavbar}>Gatos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/album/plantas" onClick={closeNavbar}>Plantas</NavLink></li>
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