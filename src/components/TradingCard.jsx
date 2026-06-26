import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './TradingCard.css';

const TradingCard = ({ data, userId, showUser = false, onShare }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const categoria = data.categoria || 'perros';
  const isNature = ['plantas', 'paisajes'].includes(categoria.toLowerCase());

  const labels = {
    raza: isNature ? 'TIPO / ESPECIE' : 'RAZA',
    personalidad: isNature ? 'CARACTERÍSTICAS' : 'PERSONALIDAD',
    funFact: isNature ? 'ENCONTRADO EN' : 'DATO CURIOSO'
  };

  useEffect(() => {
    if (!data?.id) return;

    const fetchLikes = async () => {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('capture_id', data.id);
      
      if (!error) setLikeCount(count || 0);

      if (userId) {
        const { data: userLike } = await supabase
          .from('likes')
          .select('*')
          .eq('capture_id', data.id)
          .eq('user_id', userId)
          .maybeSingle();
        
        setIsLiked(!!userLike);
      }
    };

    fetchLikes();
  }, [data?.id, userId]);

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    if (!userId) {
      alert("Inicia sesión para dar amor ❤️");
      return;
    }

    const previousLikeStatus = isLiked;
    const previousCount = likeCount;

    setIsLiked(!previousLikeStatus);
    setLikeCount(previousLikeStatus ? previousCount - 1 : previousCount + 1);

    try {
      if (previousLikeStatus) {
        await supabase.from('likes').delete().eq('capture_id', data.id).eq('user_id', userId);
      } else {
        await supabase.from('likes').insert({ capture_id: data.id, user_id: userId });
      }
    } catch (err) {
      setIsLiked(previousLikeStatus);
      setLikeCount(previousCount);
      console.error("Error al actualizar like:", err);
    }
  };

  if (!data) return null;

  const displayId = data.numero_figurita ? `#${data.numero_figurita}` : 'NEW';
  const nombre = data.nombre || data.metadata?.nombre || 'SIN NOMBRE';
  const raza = data.raza || data.metadata?.raza || 'DESCONOCIDA';
  const personalidad = data.personalidad || data.metadata?.personalidad || '---';
  const funFact = data.funFact || data.metadata?.funFact || 'Sin datos aún...';
  const spotterName = data.profiles?.username || 'Anónimo';

  return (
    <div className="trading-card-wrapper">
      <div className="card-container">
        <div className="card-id-header">{displayId}</div>
        
        <div className="card-image-box">
          {data.image_url && <img src={data.image_url} alt={nombre} />}
        </div>

        {showUser && (
          <div className="spotter-badge">
            <i className="bi bi-camera-fill me-2"></i>
            <span>Spotter: <strong>@{spotterName}</strong></span>
          </div>
        )}

        <div className="card-info-section">
          <div className="like-section">
            <button onClick={handleToggleLike} className="btn-like">
              {isLiked ? "❤️" : "🤍"} <span>{likeCount}</span>
            </button>
          </div>

          <div className="info-cell">
            <span className="cell-label">NOMBRE</span>
            <p className="cell-value">{nombre}</p>
          </div>

          <div className="info-cell">
            <span className="cell-label">{labels.raza}</span>
            <p className="cell-value">{raza}</p>
          </div>

          <div className="info-cell">
            <span className="cell-label">{labels.personalidad}</span>
            <p className="cell-value">{personalidad}</p>
          </div>

          <div className="info-cell full-width">
            <span className="cell-label">{labels.funFact}</span>
            <p className="cell-value">{funFact}</p>
          </div>
        </div>
      </div>

      {/* Botón debajo, alineado a la izquierda */}
      {onShare && !data.is_public && (
        <button 
          className="btn-share-outside" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onShare(data); 
          }}
        >
          <i className="bi bi-share-fill"></i> COMPARTIR
        </button>
      )}
    </div>
  );
};

export default TradingCard;