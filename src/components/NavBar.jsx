import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <nav className="navbar navbar-expand-lg spooter-navbar">
      <div className="container-fluid px-4">
        
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" alt="Spooter" height="40" onError={(e) => { e.target.style.display = 'none'; }} />
        </Link>

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
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/comunidad">Comunidad</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/album/perros">Perros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/album/gatos">Gatos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/album/plantas">Plantas</Link></li>
          </ul>

          <div className="d-flex align-items-center">
            {session ? (
              <button className="btn btn-danger rounded-pill px-4" onClick={handleLogout}>Salir</button>
            ) : (
              <Link className="btn btn-login-spooter rounded-pill px-4" to="/login">Ingresar</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;