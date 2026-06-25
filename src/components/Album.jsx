import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Swal from 'sweetalert2';
import './Album.css';
import TradingCard from './TradingCard';

function Album() {
  const { category } = useParams();
  const [capturas, setCapturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCapturas();
  }, [category]);

  const fetchCapturas = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('captures')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: true });

      if (category) {
        query = query.eq('categoria', category.toLowerCase().trim());
      }

      const { data, error } = await query;
      if (error) throw error;
      setCapturas(data || []);
    } catch (error) {
      Swal.fire('Error', 'No pudimos cargar el álbum.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // 1. Cerramos el modal primero para liberar la interfaz y evitar conflictos de capas
    setSelectedCard(null);

    // 2. Pedimos confirmación
    const result = await Swal.fire({
      title: '¿Borrar carta?',
      text: "¡Esta acción eliminará la carta de tu colección permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // 3. Borrado real en Supabase
        const { error } = await supabase
          .from('captures')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // 4. Si el borrado fue exitoso, actualizamos el estado local para quitar la carta de la vista
        setCapturas((prev) => prev.filter((c) => c.id !== id));
        
        Swal.fire('Borrado', 'La carta ha sido eliminada del álbum.', 'success');
      } catch (err) {
        console.error("Error al borrar:", err);
        Swal.fire('Error', 'No se pudo eliminar la carta de la base de datos.', 'error');
      }
    }
  };

  const handleEdit = (card) => {
    Swal.fire({
      title: 'Editar información',
      text: 'Funcionalidad de edición en desarrollo.',
      icon: 'info'
    });
  };

  return (
    <div className="container py-5">
      <h2 className="album-title text-center mb-5">
        {category ? `Álbum de ${category}` : 'Mi Colección'}
      </h2>

      {loading ? (
        <div className="text-center">Cargando colección...</div>
      ) : capturas.length === 0 ? (
        <div className="text-center">
            <p>Aún no hay cartas aquí.</p>
            <button className="btn btn-success" onClick={() => navigate('/')}>Ir a capturar</button>
        </div>
      ) : (
        <div className="album-grid">
          {capturas.map((carta) => (
            <div key={carta.id} className="card-thumb" onClick={() => setSelectedCard(carta)}>
              <TradingCard data={carta} />
            </div>
          ))}
        </div>
      )}

      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TradingCard data={selectedCard} />
            
            <div className="card-actions">
              <button className="btn-edit" onClick={() => handleEdit(selectedCard)}>Editar</button>
              <button className="btn-delete" onClick={() => handleDelete(selectedCard.id)}>Eliminar</button>
            </div>
            
            <button className="close-btn" onClick={() => setSelectedCard(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Album;