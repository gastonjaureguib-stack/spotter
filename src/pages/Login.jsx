import React, { useState } from 'react';
import { supabase } from '../components/supabaseClient';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Importamos el hook de navegación

function Login() {
  const navigate = useNavigate(); // Inicializamos la navegación
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegistering) {
      // Lógica de Registro
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      setLoading(false);
      
      if (error) {
        Swal.fire('Error', error.message, 'error');
      } else {
        Swal.fire({
          title: '¡Registro exitoso!',
          text: 'Te enviamos un correo de confirmación.',
          icon: 'success',
          confirmButtonColor: '#2f855a'
        });
      }
    } else {
      // Lógica de Inicio de Sesión
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setLoading(false);
        Swal.fire('Error al ingresar', 'Usuario o contraseña incorrectos.', 'error');
      } else {
        Swal.fire({
          title: '¡Bienvenido a Spooter!',
          text: 'Sesión iniciada correctamente.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          setLoading(false);
          navigate('/'); // Redirige al Home (la raíz '/')
        });
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5" style={{ minHeight: '60vh' }}>
      <div className="card shadow-lg p-4 rounded-4 border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#1a365d' }}>
            {isRegistering ? 'Crear Cuenta' : 'Ingresar a Spooter'}
          </h2>
          <p className="text-muted small">
            {isRegistering ? 'Súmate a la comunidad de spooters' : '¡Prepará tu cámara para spootear!'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">Correo Electrónico</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-secondary"><i className="bi bi-envelope"></i></span>
              <input 
                type="email" 
                className="form-control" 
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-secondary"><i className="bi bi-lock"></i></span>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn w-100 py-2 rounded-pill fw-bold text-white mb-3"
            style={{ background: 'linear-gradient(135deg, #2f855a, #2b6cb0)', border: 'none' }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : isRegistering ? 'Registrarme' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-center mt-2">
          <button 
            type="button" // IMPORTANTE: tipo button para no disparar el form
            className="btn btn-link btn-sm text-decoration-none fw-semibold" 
            style={{ color: '#2b6cb0' }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? '¿Ya tenés cuenta? Ingresá acá' : '¿No tenés cuenta? Registrate gratis'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;