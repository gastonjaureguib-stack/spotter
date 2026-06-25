import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './TradingCard.css';

const TradingCard = ({ data, userId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!data?.id) return;

    const fetchLikes = async () => {
      // 1. Contar totales
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('capture_id', data.id);
      setLikeCount(count || 0);

      // 2. Verificar si este usuario dio like
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
    
    // Si no hay userId, esto fallará. Verifica el componente padre.
    if (!userId) {
      alert("Inicia sesión para dar amor ❤️");
      return;
    }

    if (isLiked) {
      await supabase.from('likes').delete().eq('capture_id', data.id).eq('user_id', userId);
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      await supabase.from('likes').insert({ capture_id: data.id, user_id: userId });
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  if (!data) return null;

  const displayId = data.numero_figurita ? `#${data.numero_figurita}` : 'NEW';
  const nombre = data.nombre || data.metadata?.nombre || 'SIN NOMBRE';
  const raza = data.raza || data.metadata?.raza || 'DESCONOCIDA';
  const funFact = data.funFact || data.metadata?.funFact || 'SIN DATOS';

console.log("Datos de la carta:", data?.id);
  console.log("ID del usuario que recibe la carta:", userId);

  return (
    <div className="card-container">
      <div className="card-id-header">{displayId}</div>
      
      <div className="card-image-box">
        <img src={data.image_url} alt={nombre} />
      </div>

      <div className="card-info-section">
        {/* Aquí usamos solo la clase de CSS */}
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
          <span className="cell-label">RAZA</span>
          <p className="cell-value">{raza}</p>
        </div>
        <div className="info-cell full-width">
          <span className="cell-label">FUN FACT</span>
          <p className="cell-value">{funFact}</p>
        </div>
      </div>
    </div>
  );
};

export default TradingCard;