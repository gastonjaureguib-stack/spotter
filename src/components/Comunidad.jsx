import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Comunidad.css'; 
import TradingCard from './TradingCard';

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

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

  return (
    <div className="comunidad-bg">
      <section className="container mt-4">

        <h2 className="text-center mb-4 text-white">
          Spotteds de la Comunidad
        </h2>

        {/* BOTÓN GRID / LIST */}
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
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="card-thumb">

                {/* 🔥 FIX: compact SOLO en grid */}
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
              Aún nadie ha compartido nada. ¡Sé el primero!
            </p>
          )}
        </div>

      </section>
    </div>
  );
}

export default Comunidad;