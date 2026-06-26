import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Comunidad.css'; 
import TradingCard from './TradingCard';

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [viewMode, setViewMode] = useState('grid');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    const fetchPosts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('captures')
        .select('*, profiles(username)') 
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error al cargar el muro:", error);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    };

    getSession();
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Cargando spotteds...</div>;
  }

  // 🔥 FILTRO REAL POR CATEGORÍA
  const filteredPosts =
    categoryFilter === 'all'
      ? posts
      : posts.filter(
          p => p.categoria?.toLowerCase() === categoryFilter
        );

  return (
    <div className="comunidad-bg">
      <section className="container mt-4">

        <h2 className="text-center mb-4 text-white">
          Spotteds de la Comunidad
        </h2>

        {/* 🔥 FILTRO DE CATEGORÍAS */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-3">

          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setCategoryFilter('all')}
          >
            Todos 🌎
          </button>

          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setCategoryFilter('perros')}
          >
            Perros 🐶
          </button>

          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setCategoryFilter('gatos')}
          >
            Gatos 🐱
          </button>

          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setCategoryFilter('plantas')}
          >
            Plantas 🌿
          </button>

          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setCategoryFilter('paisajes')}
          >
            Paisajes 🌄
          </button>

        </div>

        {/* GRID / LIST TOGGLE */}
        <div className="d-flex justify-content-center mb-4">
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() =>
              setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'))
            }
          >
            {viewMode === 'grid' ? 'Ver lista ' : 'Ver galería '}
          </button>
        </div>

        {/* GRID / LIST */}
        <div className={`album-grid ${viewMode === 'list' ? 'view-list' : 'view-grid'}`}> 
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post.id} className="card-thumb">

                <div className={`trading-card-wrapper ${viewMode === 'grid' ? 'compact' : ''}`}>
                  <TradingCard 
                    data={post} 
                    userId={user?.id} 
                    showUser={true} 
                  />
                </div>

              </div>
            ))
          ) : (
            <p className="text-center text-white">
              No hay publicaciones en esta categoría.
            </p>
          )}
        </div>

      </section>
    </div>
  );
}

export default Comunidad;