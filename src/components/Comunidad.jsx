import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Comunidad.css'; 
import TradingCard from './TradingCard';

// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  const [selectedCard, setSelectedCard] = useState(null);
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
    return <div className="text-center mt-5 text-white">Cargando spotteds...</div>;
  }

  const filteredPosts =
    categoryFilter === 'all'
      ? posts
      : posts.filter(p => p.categoria?.toLowerCase() === categoryFilter);

  return (
    <div className="comunidad-bg">
      <section className="container mt-4">
        <h2 className="text-center mb-4 text-white">Spotteds de la Comunidad</h2>

        {/* FILTRO DE CATEGORÍAS */}
        <div className="filter-bar">
          <button className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>Todos 🌎</button>
          <button className={`filter-btn ${categoryFilter === 'perros' ? 'active' : ''}`} onClick={() => setCategoryFilter('perros')}>Perros 🐶</button>
          <button className={`filter-btn ${categoryFilter === 'gatos' ? 'active' : ''}`} onClick={() => setCategoryFilter('gatos')}>Gatos 🐱</button>
          <button className={`filter-btn ${categoryFilter === 'plantas' ? 'active' : ''}`} onClick={() => setCategoryFilter('plantas')}>Plantas 🌿</button>
          <button className={`filter-btn ${categoryFilter === 'paisajes' ? 'active' : ''}`} onClick={() => setCategoryFilter('paisajes')}>Paisajes 🌄</button>
        </div>

        {/* CARRUSEL DE DESTACADOS */}
        {filteredPosts.length > 0 && (
          <div className="swiper-cards-container my-5">
            <h5 className="text-white text-center mb-4">Lo más reciente</h5>
            <Swiper
              key={categoryFilter} // Esto asegura que el loop se reinicie al cambiar de categoría
              effect={'cards'}
              grabCursor={true}
              loop={true} // <-- EFECTO GIRATORIO ACTIVADO
              modules={[EffectCards]}
              className="mySwiper"
            >
              {filteredPosts.slice(0, 5).map(post => (
                <SwiperSlide key={post.id} onClick={() => setSelectedCard(post)}>
                  <TradingCard data={{...post, compact: false}} userId={user?.id} showUser={true} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* TOGGLE VISTA */}
        <div className="view-toggle">
          <button onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? 'Ver lista ' : 'Ver galería '}
          </button>
        </div>

        {/* GRID / LIST */}
        <div className={`album-grid ${viewMode === 'list' ? 'view-list' : 'view-grid'}`}> 
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post.id} className="card-thumb" onClick={() => setSelectedCard(post)}>
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
            <p className="text-center text-white">No hay publicaciones en esta categoría.</p>
          )}
        </div>

        {/* MODAL */}
        {selectedCard && (
          <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <TradingCard 
                data={selectedCard} 
                userId={user?.id} 
                showUser={true} 
              />
              <button className="close-btn" onClick={() => setSelectedCard(null)}>Cerrar</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Comunidad;