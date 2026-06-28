import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Comunidad.css'; 
import TradingCard from './TradingCard';

// 🚀 IMPORTACIONES DE SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

// Estilos obligatorios de Swiper
import 'swiper/css';
import 'swiper/css/effect-cards';

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]); // Guardará las cartas del mazo superior
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

      if (error) {
        console.error("Error al cargar el muro:", error);
      } else {
        setPosts(data || []);
        // Extraemos las 6 cartas más nuevas de toda la comunidad para el mazo apilado
        setRecentPosts(data?.slice(0, 6) || []);
      }
      setLoading(false);
    };

    getSession();
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-5 text-white">Cargando spotteds...</div>;

  return (
    <div className="comunidad-bg">
      <section className="container-fluid mt-4 pb-5">
        <h2 className="text-center mb-5 text-white">Comunidad</h2>

        {/* 🔥 SECCIÓN MÁGICA: MAZO APILADO DE RECIENTES OPTIMIZADO */}
        {recentPosts.length > 0 && (
          <div className="recientes-wrapper mb-5">
            <h3 className="category-title text-center text-white">✨ Últimos Spotteds ✨</h3>
            <div className="cards-stack-container">
              <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className="swiper-recientes"
                speed={400}
                touchReleaseOnEdges={true}
                resistanceRatio={0.5}
                cardsEffect={{
                  slideShadows: false, // 👈 Quita sombras pesadas que rompen el rendimiento móvil
                  perSlideOffset: 12,  // 👈 Más separación física atrás para que no se corte
                  perSlideRotate: 3,   // Grados sutiles
                }}
              >
                {recentPosts.map(post => (
                  <SwiperSlide key={`recent-${post.id}`} className="slide-stack-card">
                    <div onClick={() => setSelectedCard(post)}>
                      <TradingCard data={post} userId={user?.id} showUser={true} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        <hr className="comunidad-divider" />

        {/* 📋 CARRETERAS HORIZONTALES POR CATEGORÍA OPTIMIZADAS */}
        {categorias.map(cat => {
          const filtered = posts.filter(p => p.categoria?.toLowerCase() === cat.id);
          if (filtered.length === 0) return null;

          return (
            <div key={cat.id} className="category-section mb-4">
              <h3 className="category-title text-white">{cat.label}</h3>
              <Swiper
                grabCursor={true}
                className="horizontal-category-swiper"
                speed={350}
                touchReleaseOnEdges={true}
                resistanceRatio={0.6}
                // 🛠️ CONTROL RIGUROSO DE ESPACIADOS SEGÚN EL DISPOSITIVO
                breakpoints={{
                  0: {
                    slidesPerView: 1.15, // 👈 Se ve una carta entera y asoma un 15% de la siguiente
                    spaceBetween: 15     // 👈 Separación fija en pixeles para móvil
                  },
                  550: {
                    slidesPerView: 1.5,
                    spaceBetween: 20
                  },
                  768: {
                    slidesPerView: 'auto', // 👈 Vuelve al comportamiento original en computadoras
                    spaceBetween: 25
                  }
                }}
              >
                {filtered.map(post => (
                  <SwiperSlide key={post.id} className="slide-card-horizontal">
                    <div onClick={() => setSelectedCard(post)}>
                      <TradingCard data={post} userId={user?.id} showUser={true} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          );
        })}

        {/* TU MODAL ORIGINAL */}
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