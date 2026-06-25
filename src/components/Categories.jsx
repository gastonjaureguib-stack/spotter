import React from 'react';
import { useNavigate } from 'react-router-dom';

function Categories() {
  const navigate = useNavigate();

  // Lista de categorías con sus rutas asociadas
  const categories = [
    { name: 'Perros', icon: 'bi-dog', color: 'btn-outline-primary', route: 'perros' },
    { name: 'Gatos', icon: 'bi-cat', color: 'btn-outline-warning', route: 'gatos' },
    { name: 'Plantas', icon: 'bi-tree', color: 'btn-outline-success', route: 'plantas' }
  ];

  return (
    <section className="container my-5 text-center">
      <h2 className="h4 fw-bold mb-4 text-secondary text-uppercase">Explorá por Categorías</h2>
      <div className="row justify-content-center g-3">
        {categories.map((cat) => (
          <div key={cat.route} className="col-6 col-md-3">
            <button 
              onClick={() => navigate(`/album/${cat.route}`)}
              className={`btn ${cat.color} w-100 py-3 rounded-3 shadow-sm fw-bold d-flex flex-column align-items-center justify-content-center`}>
              <i className={`bi ${cat.icon} fs-2 mb-2`}></i>
              {cat.name}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;