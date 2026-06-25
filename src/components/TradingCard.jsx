import React from 'react';
import './TradingCard.css';

const TradingCard = ({ data }) => {
  if (!data) return null;

  // 1. Número de figurita con lógica de prioridad
  const displayId = data.numero_figurita ? `#${data.numero_figurita}` : 'NEW';

  // 2. Extraer valores de forma segura (prioridad raíz > metadata)
  const nombre = data.nombre || (data.metadata && data.metadata.nombre) || 'SIN NOMBRE';
  const raza = data.raza || (data.metadata && data.metadata.raza) || 'DESCONOCIDA';
  const funFact = data.funFact || (data.metadata && data.metadata.funFact) || 'SIN DATOS';

  return (
    <div className="card-container">
      {/* Header con el número limpio */}
      <div className="card-id-header">{displayId}</div>
      
      <div className="card-image-box">
        <img src={data.image_url} alt={nombre} />
      </div>

      <div className="card-info-section">
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