import React from 'react';

function LatestCaptures() {
  // Datos falsos (mock data) para previsualizar las cartas
  const mockCards = [
    { id: 1, name: 'Firulais Destructor', type: 'Perro', info: 'Rompe pantuflas profesional.', bg: 'border-primary' },
    { id: 2, name: 'Michi Nocturno', type: 'Gato', info: 'Duerme 23 horas al día.', bg: 'border-warning' },
    { id: 3, name: 'Monstera Salvaje', type: 'Planta', info: 'Sobrevive con poca agua.', bg: 'border-success' }
  ];

  return (
    <section className="bg-light py-5">
      <div className="container">
        <h2 className="h4 fw-bold mb-4 text-dark text-uppercase border-bottom pb-2">
          <i className="bi bi-clock-history me-2 text-danger"></i>Últimas Capturas de la Comunidad
        </h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {mockCards.map((card) => (
            <div key={card.id} className="col">
              <div className={`card h-100 shadow-sm border-2 ${card.bg}`}>
                <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '180px' }}>
                  <i className="bi bi-image text-light" style={{ fontSize: '3rem' }}></i>
                </div>
                <div className="card-body">
                  <span className="badge bg-secondary mb-2">{card.type}</span>
                  <h5 className="card-title fw-bold">{card.name}</h5>
                  <p className="card-text text-muted">{card.info}</p>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-between pb-3">
                  <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-share me-1"></i>Compartir</button>
                  <button className="btn btn-sm btn-success"><i className="bi bi-eye"></i> Ver</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestCaptures;