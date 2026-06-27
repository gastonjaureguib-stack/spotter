import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './TradingCard.css';

const TradingCard = ({ data, userId, showUser = false, onShare }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const getLimitedText = (text, limit) => {
    if (!text) return '---';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const categoria = data.categoria?.toLowerCase() || 'perros';
  
  const categoryColors = {
    perros: '#f39c12',
    gatos: '#8e44ad',
    plantas: '#27ae60',
    paisajes: '#3498db'
  };

  const borderColor = categoryColors[categoria] || '#27ae60';

  const categoryConfig = {
    perros: { labelRaza: 'RAZA', labelPers: 'PERSONALIDAD', labelFact: 'DATO CURIOSO', icon: 'bi-paw-fill' },
    gatos: { labelRaza: 'RAZA', labelPers: 'PERSONALIDAD', labelFact: 'DATO CURIOSO', icon: 'bi-paw-fill' },
    plantas: { labelRaza: 'TIPO / ESPECIE', labelPers: 'CARACTERÍSTICAS', labelFact: 'ENCONTRADO EN', icon: 'bi-leaf-fill' },
    paisajes: { labelRaza: 'TIPO / ESPECIE', labelPers: 'CARACTERÍSTICAS', labelFact: 'ENCONTRADO EN', icon: 'bi-mountain-fill' }
  };

  const config = categoryConfig[categoria] || categoryConfig['perros'];

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

  const displayId = data.numero_figurita ? `#${String(data.numero_figurita).padStart(3, '0')}` : '#NEW';
  const nombre = getLimitedText(data.nombre || data.metadata?.nombre || 'SIN NOMBRE', 20);
  const raza = getLimitedText(data.raza || data.metadata?.raza || 'DESCONOCIDA', 20);
  const personalidad = getLimitedText(data.personalidad || data.metadata?.personalidad || '---', 40);
  const funFact = getLimitedText(data.funFact || data.metadata?.funFact || 'Sin datos aún...', 150);
  const spotterName = data.profiles?.username || 'Anónimo';

  return (
    <div className={`trading-card-wrapper ${data?.compact ? 'compact' : ''}`}>
      <div className="card-container" style={{ '--accent': borderColor }}>
        
        {/* ÍCONO SUPERIOR DINÁMICO */}
        <div className="card-top-icon">
          <i className={`bi ${config.icon}`} style={{ color: borderColor }}></i>
        </div>

        {/* NÚMERO DE FIGURITA */}
        <div className="card-id-header">
          {displayId} <span className="star-sparkle">✦</span>
        </div>

        {/* CONTENEDOR CON HOJITAS DECORATIVAS PARA LA FOTO */}
        <div className="card-image-container-wrapper">
          <div className="photo-leaves leaf-top-left"></div>
          <div className="photo-leaves leaf-bottom-right"></div>
          <div className="card-image-box">
            {data.image_url && <img src={data.image_url} alt={nombre} />}
          </div>
        </div>
        
        {/* FILA DE SPOTTER + LIKES (PILL STYLE) */}
        <div className="card-meta-row">
          {showUser ? (
            <div className="spotter-badge">
              <i className="bi bi-camera-fill"></i>
              <span>Spotter: <strong>@{spotterName}</strong></span>
            </div>
          ) : <div />}
          
          <button onClick={handleToggleLike} className={`btn-like ${isLiked ? 'liked' : ''}`}>
            <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            <span>{likeCount}</span>
          </button>
        </div>

        {/* CONTENEDOR CON LA DECORACIÓN INFERIOR DE PASTO */}
        <div className="card-bottom-wrapper">
          <div className="bottom-grass-decor"></div>
          
          <div className="card-info-section">
            <div className="info-cell">
              <div className="cell-icon-box">
                <i className={`bi ${config.icon}`} style={{ color: borderColor }}></i>
              </div>
              <div className="cell-text-content">
                <span className="cell-label">NOMBRE</span>
                <p className="cell-value">{nombre}</p>
              </div>
            </div>

            <div className="info-cell">
              <div className="cell-icon-box">
                <i className="bi bi-shield-shaded" style={{ color: borderColor }}></i>
              </div>
              <div className="cell-text-content">
                <span className="cell-label">{config.labelRaza}</span>
                <p className="cell-value">{raza}</p>
              </div>
            </div>

            <div className="info-cell">
              <div className="cell-icon-box">
                <i className="bi bi-star-fill" style={{ color: borderColor }}></i>
              </div>
              <div className="cell-text-content">
                <span className="cell-label">{config.labelPers}</span>
                <p className="cell-value">{personalidad}</p>
              </div>
            </div>

            <div className="info-cell full-width">
              <div className="cell-icon-box">
                <i className="bi bi-lightbulb-fill" style={{ color: borderColor }}></i>
              </div>
              <div className="cell-text-content">
                <span className="cell-label-highlight">{config.labelFact}</span>
                <p className="cell-value-highlight">{funFact}</p>
              </div>
            </div>
          </div>

          {/* BOTÓN INTERNO CON TEXTURA DE HOJAS */}
          {onShare && !data.is_public && (
            <button className="btn-share-modern" onClick={(e) => { e.stopPropagation(); onShare(data); }}>
              <i className="bi bi-share-fill"></i> COMPARTIR
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default TradingCard;