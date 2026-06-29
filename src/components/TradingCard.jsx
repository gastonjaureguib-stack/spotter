import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './TradingCard.css';

const TradingCard = ({
  data,
  userId,
  showUser = false,
  onShare,
  enableImageZoom = false,
  onImageClick
}) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const categoria = (data?.categoria || 'perros').toLowerCase();

  const config = {
    perros: { icon: 'bi-paw-fill', label: 'PERRO', attr: 'RAZA' },
    gatos: { icon: 'bi-github', label: 'GATO', attr: 'RAZA' },
    plantas: { icon: 'bi-leaf-fill', label: 'PLANTA', attr: 'ESPECIE' },
    paisajes: { icon: 'bi-mountain-fill', label: 'PAISAJE', attr: 'UBICACIÓN' }
  };

  const theme = config[categoria] || config.perros;

  const displayId = data?.numero_figurita
    ? `#${String(data.numero_figurita).padStart(3, '0')}`
    : '#NEW';

  const getText = (text, max = 80) => {
    if (!text) return '---';
    return text.length > max ? text.slice(0, max) + '...' : text;
  };

  // ... (tu lógica de useEffect y toggleLike se mantiene igual)
  useEffect(() => {
    if (!data?.id) return;
    const fetchLikes = async () => {
      const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('capture_id', data.id);
      setLikeCount(count || 0);
      if (userId) {
        const { data: userLike } = await supabase.from('likes').select('*').eq('capture_id', data.id).eq('user_id', userId).maybeSingle();
        setIsLiked(!!userLike);
      }
    };
    fetchLikes();
  }, [data?.id, userId]);

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!userId) { alert('Iniciá sesión ❤️'); return; }
    const prev = isLiked;
    setIsLiked(!prev);
    setLikeCount(prev ? likeCount - 1 : likeCount + 1);
    try {
      if (prev) { await supabase.from('likes').delete().eq('capture_id', data.id).eq('user_id', userId); } 
      else { await supabase.from('likes').insert({ capture_id: data.id, user_id: userId }); }
    } catch { setIsLiked(prev); setLikeCount(likeCount); }
  };

  if (!data) return null;

  const nombre = getText(data.nombre || data.metadata?.nombre || 'SIN NOMBRE', 22);
  const raza = getText(data.raza || data.metadata?.raza || 'DESCONOCIDO', 22);
  const personalidad = getText(data.personalidad || data.metadata?.personalidad || '', 45);
  const funFact = getText(data.funFact || data.metadata?.funFact || 'Sin información', 120);

  return (
    <div className={`tc-wrapper ${data?.compact ? 'compact' : ''}`}>
      <div className={`tc-card ${categoria}`}>
        
        {/* HEADER */}
        <div className="tc-header">
          <div className="tc-id">{displayId}</div>
          <div className="tc-type">
            <i className={`bi ${theme.icon}`}></i>
            <span>{theme.label}</span>
          </div>
        </div>

        {/* IMAGEN */}
        <div className={`tc-image`} onClick={(e) => { if (!enableImageZoom) return; e.stopPropagation(); if (onImageClick) onImageClick({ url: data.image_url, title: nombre }); }}>
          {data.image_url && <img src={data.image_url} alt={nombre} draggable={false} />}
        </div>

        {/* INFO DINÁMICA */}
        <div className="tc-body">
          <div className="tc-title">{nombre}</div>

          <div className="tc-row">
            <span className="label">{theme.attr}</span>
            <span className="value">{raza}</span>
          </div>

          {/* Mostrar Personalidad solo si es Perro o Gato y existe el dato */}
          {(categoria === 'perros' || categoria === 'gatos') && personalidad && (
            <div className="tc-row">
              <span className="label">CARÁCTER</span>
              <span className="value">{personalidad}</span>
            </div>
          )}

          <div className="tc-fact">{funFact}</div>
        </div>

        {/* FOOTER */}
        <div className="tc-footer">
          {showUser ? <div className="tc-user"><i className="bi bi-person-circle"></i><span>@{data.profiles?.username || 'anon'}</span></div> : <div />}
          <button className={`tc-like ${isLiked ? 'active' : ''}`} onClick={toggleLike}>
            <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingCard;