import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './NavBar.css';

function Navbar() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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

        <div className="d-flex align-items-center gap-2 order-lg-3">
          {session ? (
            <button className="btn btn-danger btn-sm rounded-pill fw-bold" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Salir
            </button>
          ) : (
            <Link className="btn btn-login-spooter fw-bold px-3 rounded-pill btn-sm" to="/login">
              <i className="bi bi-box-arrow-in-right me-1"></i>Ingresar
            </Link>
          )}
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="collapse navbar-collapse order-lg-2" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 pt-2 pt-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/"><i className="bi bi-house-door me-1"></i>Home</Link></li>
            {/* NUEVO ENLACE A COMUNIDAD */}
            <li className="nav-item"><Link className="nav-link" to="/comunidad"><i className="bi bi-people me-1"></i>Comunidad</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/album/perros"><i className="bi bi-dog me-1"></i>Perros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/album/gatos"><i className="bi bi-cat me-1"></i>Gatos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/album/plantas"><i className="bi bi-tree me-1"></i>Plantas</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;