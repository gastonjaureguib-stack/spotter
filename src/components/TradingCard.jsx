import React from 'react';
import './TradingCard.css';

const TradingCard = ({ data }) => {
  if (!data) return null;

  // Intentamos obtener el ID de varias fuentes posibles
  const displayId = data.id || data.numero_album || data.codigo || '000';

  return (
    <div className="card-container">
      {/* El ID ahora usa la variable displayId */}
      <div className="card-id-header">#{displayId}</div>
      
      <div className="card-image-box">
        <img src={data.image_url} alt={data.nombre} />
      </div>

      <div className="card-info-section">
        <div className="info-cell">
          <span className="cell-label">NOMBRE</span>
          <p className="cell-value">{data.nombre || 'SIN NOMBRE'}</p>
        </div>
        <div className="info-cell">
          <span className="cell-label">RAZA</span>
          <p className="cell-value">{data.raza || 'DESCONOCIDA'}</p>
        </div>
        <div className="info-cell full-width">
          <span className="cell-label">FUN FACT</span>
          <p className="cell-value">{data.funFact || 'SIN DATOS'}</p>
        </div>
      </div>
    </div>
  );
};

export default TradingCard;