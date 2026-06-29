import React, { useEffect, useState, useRef } from 'react';
import { supabase } from './supabaseClient';
import './TradingCard.css';

const TradingCard = ({
  data,
  userId,
  showUser = false,
  enableImageZoom = false,
  onImageClick
}) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  // Nota: Dejamos el ref por si lo necesitas en el componente padre (el Modal) 
  // para la función toPng, pero ya no maneja los botones aquí.
  const cardRef = useRef(null); 

  const categoria = (data?.categoria || 'perros').toLowerCase();

  const config = {
    perros: { icon: 'bi-paw-fill', label: 'PERRO', attr: 'RAZA' },
    gatos: { icon: 'bi-github', label: 'GATO', attr: 'RAZA' },
    plantas: { icon: 'bi-leaf-fill', label: 'PLANTA', attr: 'ESPECIE' },
    paisajes: { icon: 'bi-mountain-fill', label: 'PAISAJE', attr: 'UBICACIÓN' }
  };

  const theme = config[categoria] || config.perros;

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

  const nombre = data.nombre || data.metadata?.nombre || 'SIN NOMBRE';
  const raza = data.raza || data.metadata?.raza || 'DESCONOCIDO';
  const personalidad = data.personalidad || data.metadata?.personalidad || '';
  const funFact = data.funFact || data.metadata?.funFact || 'Sin información';

  return (
    <div className={`tc-wrapper ${data?.compact ? 'compact' : ''}`}>
      <div ref={cardRef} className={`tc-card ${categoria}`}>
        
        {/* HEADER */}
        <div className="tc-header">
          <div className="tc-id">{data?.numero_figurita ? `#${String(data.numero_figurita).padStart(3, '0')}` : '#NEW'}</div>
          <div className="tc-type">
            <i className={`bi ${theme.icon}`}></i>
            <span>{theme.label}</span>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="tc-image" onClick={(e) => { if (enableImageZoom && onImageClick) onImageClick({ url: data.image_url, title: nombre }); }}>
          {data.image_url && <img src={data.image_url} alt={nombre} draggable={false} />}
        </div>

        {/* INFO */}
        <div className="tc-body">
          <div className="tc-title">{nombre}</div>
          <div className="tc-row">
            <span className="label">{theme.attr}</span>
            <span className="value">{raza}</span>
          </div>
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