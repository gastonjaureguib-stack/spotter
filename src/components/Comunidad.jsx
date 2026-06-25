import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Comunidad.css'; 
import TradingCard from './TradingCard';

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('captures')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error al cargar el muro:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-5">Cargando spotteds...</div>;

  return (
    <section className="container mt-4">
      <h2 className="text-center mb-4">Spotteds de la Comunidad</h2>
      {}
      <div className="album-grid"> 
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="card-thumb">
              {}
              <TradingCard data={post} />
            </div>
          ))
        ) : (
          <p className="text-center">Aún nadie ha compartido nada. ¡Sé el primero!</p>
        )}
      </div>
    </section>
  );
}

export default Comunidad;