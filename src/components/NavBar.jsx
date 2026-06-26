import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './NavBar.css';

function Navbar() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(null); // Nuevo estado
  const navigate = useNavigate();

  // Función para obtener el nombre de la DB
  const fetchUsername = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (data) setUsername(data.username);
  };

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUsername(session.user.id);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUsername(session.user.id);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm spooter-navbar">
      <div className="container-fluid px-3 d-flex flex-wrap align-items-center justify-content-between">
        
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" alt="Spooter Logo" height="36" onError={(e) => { e.target.style.display = 'none'; }} />
        </Link>

        {/* --- MOSTRAR NOMBRE Y SALIR --- */}
        <div className="d-flex align-items-center gap-3 order-lg-3">
          {session ? (
            <>
              <span className="navbar-text fw-bold text-primary">
                Hola, {username || 'Usuario'}
              </span>
              <button className="btn btn-danger btn-sm rounded-pill fw-bold" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>Salir
              </button>
            </>
          ) : (
            <Link className="btn btn-login-spooter fw-bold px-3 rounded-pill btn-sm" to="/login">
              <i className="bi bi-box-arrow-in-right me-1"></i>Ingresar
            </Link>
          )}
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* ... resto de tu navbar ... */}
      </div>
    </nav>
  );
}

export default Navbar;