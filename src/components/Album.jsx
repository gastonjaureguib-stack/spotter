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

  // Función para determinar la clase de fondo según la categoría
  const getBackgroundClass = () => {
    return category?.toLowerCase() === 'plantas' ? 'bg-plantas' : 'bg-mascotas';
  };

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
        .order('numero_figurita', { ascending: true });

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

  // Lógica para manejar la subida desde galería
  const handleGalleryUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      navigate(`/camera`, { 
        state: { 
          imageFile: file,
          category: category 
        } 
      });
    }
  };

  const handleDelete = async (id) => {
    setSelectedCard(null);
    const result = await Swal.fire({
      title: '¿Borrar carta?',
      text: "¡Esta acción eliminará la carta permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('captures').delete().eq('id', id);
        if (error) throw error;
        setCapturas((prev) => prev.filter((c) => c.id !== id));
        Swal.fire('Borrado', 'La carta ha sido eliminada.', 'success');
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar.', 'error');
      }
    }
  };

  const handleShareToCommunity = async (card) => {
    const result = await Swal.fire({
      title: '¿Compartir en la comunidad?',
      text: "Tu carta será visible para todos en el muro.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: '¡Compartir!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('captures')
          .update({ is_public: true })
          .eq('id', card.id);

        if (error) throw error;

        Swal.fire('¡Éxito!', 'Tu carta ya está en la comunidad.', 'success');
        setSelectedCard(null);
      } catch (err) {
        Swal.fire('Error', 'No se pudo compartir: ' + err.message, 'error');
      }
    }
  };

  const handleEdit = (card) => {
    setSelectedCard(null);
    navigate(`/camera?edit=${card.id}`);
  };

  return (
    <div className={getBackgroundClass()}>
      <div className="container py-5">
        
        <h2 className="album-title text-center mb-5 text-white">
          {category ? `Álbum de ${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Mi Colección'}
        </h2>

        {/* Botón de subida desde galería (Minimalista, izquierda) */}
        <div className="upload-container">
          <input 
            type="file" 
            id="gallery-input" 
            accept="image/*" 
            onChange={handleGalleryUpload} 
            style={{ display: 'none' }} 
          />
          <label htmlFor="gallery-input" className="btn-gallery-small">
            + Subir de galería
          </label>
        </div>

        {loading ? (
          <div className="text-center text-white">Cargando colección...</div>
        ) : capturas.length === 0 ? (
          <div className="text-center text-white">
            <p>Aún no hay cartas aquí.</p>
            <button className="btn btn-success mt-3" onClick={() => navigate('/')}>Ir a capturar</button>
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
                <button className="btn-share" onClick={() => handleShareToCommunity(selectedCard)}>Compartir en comunidad</button>
              </div>
              
              <button className="close-btn" onClick={() => setSelectedCard(null)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Album;