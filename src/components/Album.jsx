import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Swal from 'sweetalert2';
import { toPng } from 'html-to-image';
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
      Swal.fire({
        title: 'Error',
        text: 'No pudimos cargar el álbum.',
        icon: 'error',
        target: document.body,
        zIndex: 10001
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setSelectedCard(null);

  // ==============================
  // FIX APLICADO SOLO AQUÍ
  // ==============================
  const handleShareToCommunity = async (card) => {
    setSelectedCard(null);

    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);

    const result = await Swal.fire({
      title: '¿Compartir en la comunidad?',
      text: 'Tu carta será visible para todos.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Compartir',
      cancelButtonText: 'Cancelar',
      target: document.body
    });

    if (!result.isConfirmed) return;

    try {
      await supabase
        .from('captures')
        .update({ is_public: true })
        .eq('id', card.id);

      await Swal.fire({
        title: 'Publicado',
        icon: 'success',
        target: document.body
      });

      fetchCapturas(userId);
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo compartir.',
        icon: 'error',
        target: document.body
      });
    }
  };

  const handleEdit = (card) => {
    closeModal();
    navigate(`/camera?edit=${card.id}`);
  };

  const handleDelete = async (id) => {
    closeModal();

    const result = await Swal.fire({
      title: '¿Borrar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      target: document.body
    });

    if (!result.isConfirmed) return;

    await supabase.from('captures').delete().eq('id', id);
    setCapturas(prev => prev.filter(c => c.id !== id));
  };

  const handleChangeCategory = async (card) => {
    closeModal();

    const { value: nuevaCategoria } = await Swal.fire({
      title: 'Cambiar categoría',
      html: `
        <select id="categoria" class="form-control">
          <option value="perros">Perros</option>
          <option value="gatos">Gatos</option>
          <option value="plantas">Plantas</option>
          <option value="paisajes">Paisajes</option>
        </select>
      `,
      preConfirm: () => document.getElementById('categoria').value,
      target: document.body
    });

    if (!nuevaCategoria) return;

    await supabase
      .from('captures')
      .update({ categoria: nuevaCategoria })
      .eq('id', card.id);

    fetchCapturas(userId);
  };

  const handleShareFromModal = async (platform) => {
    const modalCardNode = document.querySelector('.modal-content .tc-card');
    if (!modalCardNode) return;

    const dataUrl = await toPng(modalCardNode, { cacheBust: true });

    if (platform === 'whatsapp') {
      const text = encodeURIComponent('Mirá mi carta!');
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }

    if (platform === 'instagram') {
      const link = document.createElement('a');
      link.download = 'card.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className={getBackgroundClass()}>
      <div className="container py-5">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="album-title text-white m-0">Mi Colección</h2>

          <div className="d-flex gap-2">

            <button
              className="btn-view-toggle"
              onClick={() => navigate('/camera?mode=gallery')}
            >
              + Subir
            </button>

            <button
              className="btn-view-toggle"
              onClick={() =>
                setViewMode(viewMode === 'grid' ? 'list' : 'grid')
              }
            >
              {viewMode === 'grid' ? 'Lista' : 'Grid'}
            </button>

          </div>
        </div>

        {loading ? (
          <div className="text-white text-center">Cargando...</div>
        ) : (
          <div className={`album-grid ${viewMode === 'list' ? 'view-list' : 'view-grid'}`}>
            {capturas.map((carta) => (
              <div
                key={carta.id}
                className="card-thumb"
                onClick={() => setSelectedCard(carta)}
              >
                <TradingCard
                  data={{ ...carta, compact: viewMode === 'grid' }}
                  userId={userId}
                />
              </div>
            ))}
          </div>
        )}

        {selectedCard && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

              <TradingCard data={selectedCard} userId={userId} />

              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(selectedCard)}>Editar</button>
                <button className="btn-secondary" onClick={() => handleChangeCategory(selectedCard)}>Mover</button>
                <button className="btn-delete" onClick={() => handleDelete(selectedCard.id)}>Eliminar</button>
              </div>

              <div className="d-flex flex-column gap-2 mt-3 w-100" style={{ maxWidth: '280px' }}>

                {!selectedCard.is_public && (
                  <button className="btn-edit" onClick={() => handleShareToCommunity(selectedCard)}>
                    Compartir en Comunidad
                  </button>
                )}

                <div className="d-flex gap-2 justify-content-center">
                  <button className="whatsapp" onClick={() => handleShareFromModal('whatsapp')}>
                    WhatsApp
                  </button>
                  <button className="instagram" onClick={() => handleShareFromModal('instagram')}>
                    Insta
                  </button>
                </div>

              </div>

              <button className="close-btn mt-3" onClick={closeModal}>
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