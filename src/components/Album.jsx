import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2';

function Album() {
  const [capturas, setCapturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCapturas();
  }, []);

  const fetchCapturas = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Swal.fire('Atención', 'Debes iniciar sesión para ver tu colección.', 'info');
        return;
      }

      const { data, error } = await supabase
        .from('captures')
        .select('*')
        .eq('user_id', user.id) // Solo las capturas del usuario logueado
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCapturas(data || []);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire('Error', 'No pudimos cargar tu colección.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5 text-uppercase">Mi Colección</h2>
      
      {loading ? (
        <div className="text-center py-5">Cargando...</div>
      ) : capturas.length === 0 ? (
        <div className="text-center py-5">
          <p>Aún no tienes capturas en tu álbum. ¡Sal a buscar algo nuevo! 📸</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {capturas.map((carta) => (
            <div key={carta.id} className="col">
              <div className="card h-100 shadow-sm">
                <img src={carta.image_url} className="card-img-top" alt={carta.nombre} />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{carta.nombre}</h5>
                  <p className="card-text small text-muted">{carta.categoria}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Album;