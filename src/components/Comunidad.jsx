import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Comunidad.css';
import TradingCard from './TradingCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [groupedPosts, setGroupedPosts] = useState({});
  const [recentPosts, setRecentPosts] = useState([]);
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
        console.error(error);
      } else {
        const allPosts = data || [];

        setPosts(allPosts);
        setRecentPosts(allPosts.slice(0, 6));

        const grouped = {
          perros: [],
          gatos: [],
          plantas: [],
          paisajes: []
        };

        allPosts.forEach(post => {
          const categoria = post.categoria?.toLowerCase();

          if (grouped[categoria]) {
            grouped[categoria].push(post);
          }
        });

        setGroupedPosts(grouped);
      }

      setLoading(false);
    };

    getSession();
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5 text-white">
        Cargando spotteds...
      </div>
    );
  }

  return (
    <div className="comunidad-bg">
      <section className="container-fluid mt-4 pb-5">

        <h2 className="text-center mb-5 text-white">
          Comunidad
        </h2>

        {recentPosts.length > 0 && (
          <div className="recientes-wrapper mb-5">

            <h3 className="category-title text-center text-white">
              ✨ Últimos Spotteds ✨
            </h3>

            <div className="cards-stack-container">

              <Swiper
                effect="cards"
                modules={[EffectCards]}
                className="swiper-recientes"
                grabCursor
                speed={400}
                resistanceRatio={0.5}
                touchReleaseOnEdges
                watchSlidesProgress
                lazyPreloadPrevNext={1}
                cardsEffect={{
                  slideShadows: false,
                  perSlideOffset: 12,
                  perSlideRotate: 3,
                }}
              >

                {recentPosts.map(post => (

                  <SwiperSlide
                    key={`recent-${post.id}`}
                    className="slide-stack-card"
                  >

                    <div onClick={() => setSelectedCard(post)}>
                      <TradingCard
                        data={post}
                        userId={user?.id}
                        showUser={true}
                      />
                    </div>

                  </SwiperSlide>

                ))}

              </Swiper>

            </div>

          </div>
        )}

        <hr className="comunidad-divider" />

        {categorias.map(cat => {

          const filtered = groupedPosts[cat.id] || [];

          if (!filtered.length) return null;

          return (

            <div
              key={cat.id}
              className="category-section mb-4"
            >

              <h3 className="category-title text-white">
                {cat.label}
              </h3>

              <Swiper
                className="horizontal-category-swiper"
                grabCursor
                speed={350}
                resistanceRatio={0.6}
                touchReleaseOnEdges
                watchSlidesProgress
                lazyPreloadPrevNext={1}
                breakpoints={{
                  0: {
                    slidesPerView: 1.15,
                    spaceBetween: 15
                  },
                  550: {
                    slidesPerView: 1.5,
                    spaceBetween: 20
                  },
                  768: {
                    slidesPerView: 'auto',
                    spaceBetween: 25
                  }
                }}
              >

                {filtered.map(post => (

                  <SwiperSlide
                    key={post.id}
                    className="slide-card-horizontal"
                  >

                    <div onClick={() => setSelectedCard(post)}>
                      <TradingCard
                        data={post}
                        userId={user?.id}
                        showUser={true}
                      />
                    </div>

                  </SwiperSlide>

                ))}

              </Swiper>

            </div>

          );

        })}

        {selectedCard && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedCard(null)}
          >

            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >

              <TradingCard
                data={selectedCard}
                userId={user?.id}
                showUser={true}
              />

              <button
                className="close-btn"
                onClick={() => setSelectedCard(null)}
              >
                Cerrar
              </button>

            </div>

          </div>
        )}

      </section>
    </div>
  );
}

export default Comunidad;