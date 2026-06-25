import React, { useState } from 'react';
import { supabase } from '../components/supabaseClient';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para el ojito

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ 
        email, password, options: { emailRedirectTo: window.location.origin }
      });
      setLoading(false);
      if (error) Swal.fire('Error', error.message, 'error');
      else Swal.fire('Registro exitoso', 'Revisa tu correo para confirmar.', 'success');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        Swal.fire('Error al ingresar', 'Usuario o contraseña incorrectos.', 'error');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5" style={{ minHeight: '60vh' }}>
      <div className="card shadow-lg p-4 rounded-4 border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#1a365d' }}>{isRegistering ? 'Crear Cuenta' : 'Ingresar'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">Correo</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
              {/* INPUT DE CONTRASEÑA CON ALTERNANCIA */}
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn w-100 py-2 rounded-pill fw-bold text-white" style={{ background: '#2b6cb0' }} disabled={loading}>
            {loading ? 'Cargando...' : isRegistering ? 'Registrarme' : 'Iniciar Sesión'}
          </button>
        </form>

        <button className="btn btn-link w-100 mt-3" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? '¿Ya tenés cuenta? Ingresá' : '¿No tenés cuenta? Registrate'}
        </button>
      </div>
    </div>
  );
}

export default Login;