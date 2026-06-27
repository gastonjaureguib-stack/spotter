import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './TradingCard.css';

const TradingCard = ({ data, userId, showUser = false, onShare }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Función para limitar caracteres
  const getLimitedText = (text, limit) => {
    if (!text) return '---';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const categoria = data.categoria?.toLowerCase() || 'perros';
  const isNature = ['plantas', 'paisajes'].includes(categoria);

  const categoryColors = {
    perros: '#f39c12',
    gatos: '#8e44ad',
    plantas: '#27ae60',
    paisajes: '#3498db'
  };

  const borderColor = categoryColors[categoria] || '#27ae60';

  const labels = {
    raza: isNature ? 'TIPO / ESPECIE' : 'RAZA',
    personalidad: isNature ? 'CARACTERÍSTICAS' : 'PERSONALIDAD',
    funFact: isNature ? 'ENCONTRADO EN' : 'DATO CURIOSO'
  };

  // ... (tu useEffect y handleToggleLike se mantienen igual) ...
  useEffect(() => {
    if (!data?.id) return;
    const fetchLikes = async () => {
      const { count, error } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('capture_id', data.id);
      if (!error) setLikeCount(count || 0);
      if (userId) {
        const { data: userLike } = await supabase.from('likes').select('*').eq('capture_id', data.id).eq('user_id', userId).maybeSingle();
        setIsLiked(!!userLike);
      }
    };
    fetchLikes();
  }, [data?.id, userId]);

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    if (!userId) { alert("Inicia sesión para dar amor ❤️"); return; }
    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      if (prevLiked) await supabase.from('likes').delete().eq('capture_id', data.id).eq('user_id', userId);
      else await supabase.from('likes').insert({ capture_id: data.id, user_id: userId });
    } catch { setIsLiked(prevLiked); setLikeCount(prevCount); }
  };

  if (!data) return null;

  const displayId = data.numero_figurita ? `#${data.numero_figurita}` : 'NEW';
  const nombre = getLimitedText(data.nombre || data.metadata?.nombre || 'SIN NOMBRE', 20);
  const raza = getLimitedText(data.raza || data.metadata?.raza || 'DESCONOCIDA', 20);
  const personalidad = getLimitedText(data.personalidad || data.metadata?.personalidad || '---', 40);
  const funFact = getLimitedText(data.funFact || data.metadata?.funFact || 'Sin datos aún...', 150);
  const spotterName = data.profiles?.username || 'Anónimo';

  return (
    <div className={`trading-card-wrapper ${data?.compact ? 'compact' : ''}`}>
      <div className="card-container" style={{ border: `3px solid ${borderColor}` }}>
        <div className="card-id-header" style={{ color: borderColor }}>{displayId}</div>
        <div className="card-image-box" style={{ borderColor: borderColor }}>
          {data.image_url && <img src={data.image_url} alt={nombre} />}
        </div>
        
        {/* ... (resto del JSX igual, usando las variables truncadas arriba) ... */}
        {showUser && (
          <div className="spotter-badge" style={{ borderLeft: `4px solid ${borderColor}`, backgroundColor: `${borderColor}20` }}>
            <i className="bi bi-camera-fill me-2" style={{ color: borderColor }}></i>
            <span>Spotter: <strong style={{ color: borderColor }}>@{spotterName}</strong></span>
          </div>
        )}

        <div className="card-info-section">
          <div className="like-section">
            <button onClick={handleToggleLike} className="btn-like">{isLiked ? "❤️" : "🤍"} <span>{likeCount}</span></button>
          </div>
          <div className="info-cell" style={{ border: `1px solid ${borderColor}50` }}>
            <span className="cell-label" style={{ color: borderColor }}>NOMBRE</span>
            <p className="cell-value">{nombre}</p>
          </div>
          <div className="info-cell" style={{ border: `1px solid ${borderColor}50` }}>
            <span className="cell-label" style={{ color: borderColor }}>{labels.raza}</span>
            <p className="cell-value">{raza}</p>
          </div>
          <div className="info-cell" style={{ border: `1px solid ${borderColor}50` }}>
            <span className="cell-label" style={{ color: borderColor }}>{labels.personalidad}</span>
            <p className="cell-value">{personalidad}</p>
          </div>
          <div className="info-cell full-width" style={{ border: `1px solid ${borderColor}50` }}>
            <span className="cell-label" style={{ color: borderColor }}>{labels.funFact}</span>
            <p className="cell-value">{funFact}</p>
          </div>
        </div>
      </div>
      {onShare && !data.is_public && (
        <button className="btn-share-outside" onClick={(e) => { e.stopPropagation(); onShare(data); }} style={{ backgroundColor: borderColor }}>
          <i className="bi bi-share-fill"></i> COMPARTIR
        </button>
      )}
    </div>
  );
};

export default TradingCard;