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
  const [viewMode, setViewMode] = useState('grid');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const getBackgroundClass = () => {
    const cat = category?.toLowerCase().trim();
    if (cat === 'plantas') return 'bg-plantas';
    if (cat === 'paisajes') return 'bg-paisajes';
    return 'bg-mascotas';
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchCapturas(user.id);
      } else {
        setLoading(false);
      }
    };
    init();
  }, [category]);

  const fetchCapturas = async (uid) => {
    try {
      setLoading(true);

      let query = supabase
        .from('captures')
        .select('*')
        .eq('user_id', uid)
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

  // ✅ FIX DEFINITIVO SWEETALERT
  const handleChangeCategory = async (card) => {
    const { value: nuevaCategoria } = await Swal.fire({
      title: 'Cambiar categoría',
      html: `
        <div style="text-align:left">
          <select id="categoria" style="
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ccc;
            background: #ffffff;
            color: #111827;
            font-size: 14px;
            outline: none;
          ">
            <option value="">Selecciona una categoría</option>
            <option value="perros">🐶 Perros</option>
            <option value="gatos">🐱 Gatos</option>
            <option value="plantas">🌿 Plantas</option>
            <option value="paisajes">🏞 Paisajes</option>
          </select>
        </div>
      `,
      background: '#1b2631',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonText: 'Mover',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#27ae60',
      focusConfirm: false,
      preConfirm: () => {
        const value = document.getElementById('categoria').value;
        if (!value) {
          Swal.showValidationMessage('Selecciona una categoría');
          return false;
        }
        return value;
      }
    });

    if (!nuevaCategoria) return;

    try {
      const { error } = await supabase
        .from('captures')
        .update({ categoria: nuevaCategoria })
        .eq('id', card.id);

      if (error) throw error;

      Swal.fire('¡Éxito!', 'La carta se ha movido correctamente.', 'success');
      setSelectedCard(null);
      fetchCapturas(userId);
    } catch (err) {
      Swal.fire('Error', 'No se pudo actualizar la categoría.', 'error');
    }
  };

  // 🚀 INTERCEPCIÓN DE GALERÍA CORREGIDA
  const handleGalleryUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Convertimos el file binario de la galería en una URL de objeto temporal que entienda la etiqueta img / Cropper
      const imageUrl = URL.createObjectURL(file);
      
      // Enviamos bajo la propiedad clave 'externalImage' para que HeroCamera haga el bypass
      navigate(`/camera`, {
        state: { externalImage: imageUrl, category: category }
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
        fetchCapturas(userId);
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
        <h2 className="album-title text-center mb-4 text-white">
          {category ? `Álbum de ${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Mi Colección'}
        </h2>

        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <label htmlFor="gallery-input" className="btn btn-outline-light btn-sm">
            + Subir de galería
          </label>

          <input
            type="file"
            id="gallery-input"
            accept="image/*"
            onChange={handleGalleryUpload}
            style={{ display: 'none' }}
          />

          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'Ver lista' : 'Ver galería'}
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">Cargando colección...</div>
        ) : capturas.length === 0 ? (
          <div className="text-center text-white">
            <p>Aún no hay cartas aquí.</p>
            <button className="btn btn-success" onClick={() => navigate('/')}>
              Ir a capturar
            </button>
          </div>
        ) : (
          <div className={`album-grid ${viewMode === 'list' ? 'view-list' : 'view-grid'}`}>
            {capturas.map((carta) => (
              <div
                key={carta.id}
                className="card-thumb"
                onClick={() => setSelectedCard(carta)}
              >
                <TradingCard
                  data={{
                    ...carta,
                    compact: viewMode === 'grid'
                  }}
                  userId={userId}
                  onShare={() => handleShareToCommunity(carta)}
                />
              </div>
            ))}
          </div>
        )}

        {selectedCard && (
          <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <TradingCard data={selectedCard} />

              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(selectedCard)}>
                  Editar
                </button>

                <button className="btn-secondary" onClick={() => handleChangeCategory(selectedCard)}>
                  Mover de categoría
                </button>

                <button className="btn-delete" onClick={() => handleDelete(selectedCard.id)}>
                  Eliminar
                </button>
              </div>

              <button className="close-btn" onClick={() => setSelectedCard(null)}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Album;