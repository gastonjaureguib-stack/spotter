import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css'; 

function Categories() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Perros', img: '/buttomdog.png', route: 'perros' },
    { name: 'Gatos', img: '/buttomcat.png', route: 'gatos' },
    { name: 'Plantas', img: '/buttomplant.png', route: 'plantas' },
    { name: 'Comunidad', img: '/buttomcomunidad.png', route: 'comunidad' } // <-- Agregado
  ];

  return (
    <section className="container my-5 text-center">
      <h2 className="mb-5 fw-bold text-dark">Mirá tus álbumes</h2>

      <div className="row justify-content-center g-4">
        {categories.map((cat) => (
          <div key={cat.route} className="col-6 col-md-3 d-flex flex-column align-items-center">
            <button 
              onClick={() => navigate(cat.route === 'comunidad' ? '/comunidad' : `/album/${cat.route}`)} 
              className="image-btn"
              aria-label={cat.name}
            >
              <img src={cat.img} alt={cat.name} className="btn-icon" />
            </button>
            <span className="mt-2 fw-semibold text-muted">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;