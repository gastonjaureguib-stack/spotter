import React from 'react';

function Categories() {
  const categories = [
    { name: 'Perros', icon: 'bi-dog', color: 'btn-outline-primary' },
    { name: 'Gatos', icon: 'bi-cat', color: 'btn-outline-warning' },
    { name: 'Plantas', icon: 'bi-tree', color: 'btn-outline-success' }
  ];

  return (
    <section className="container my-5 text-center">
      <h2 className="h4 fw-bold mb-4 text-secondary text-uppercase">Explorá por Categorías</h2>
      <div className="row justify-content-center g-3">
        {categories.map((cat, index) => (
          <div key={index} className="col-6 col-md-3">
            <button className={`btn ${cat.color} w-100 py-3 rounded-3 shadow-sm fw-bold d-flex flex-column align-items-center justify-content-center`}>
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