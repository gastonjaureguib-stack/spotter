import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Comunidad.css'; 
import TradingCard from './TradingCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const categorias = [
    { id: 'perros', label: 'Perros 🐶' },
    { id: 'gatos', label: 'Gatos 🐱' },
    { id: 'plantas', label: 'Plantas 🌿' },
    { id: 'paisajes', label: 'Paisajes 🌄' }
  ];

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

      if (error) console.error("Error al cargar el muro:", error);
      else setPosts(data || []);
      setLoading(false);
    };

    getSession();
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-5 text-white">Cargando spotteds...</div>;

  return (
    <div className="comunidad-bg">
      <section className="container-fluid mt-4">
        <h2 className="text-center mb-5 text-white">Comunidad</h2>

        {categorias.map(cat => {
          const filtered = posts.filter(p => p.categoria?.toLowerCase() === cat.id);
          if (filtered.length === 0) return null;

          return (
            <div key={cat.id} className="category-section">
              <h3 className="category-title">{cat.label}</h3>
              <Swiper
                spaceBetween={15}
                slidesPerView={'auto'}
                className="horizontal-category-swiper"
              >
                {filtered.map(post => (
                  <SwiperSlide key={post.id} className="slide-card">
                    <div onClick={() => setSelectedCard(post)}>
                      <TradingCard data={post} userId={user?.id} showUser={true} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          );
        })}

        {/* MODAL */}
        {selectedCard && (
          <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <TradingCard data={selectedCard} userId={user?.id} showUser={true} />
              <button className="close-btn" onClick={() => setSelectedCard(null)}>Cerrar</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Comunidad;