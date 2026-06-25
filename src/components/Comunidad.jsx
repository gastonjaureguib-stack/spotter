import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Comunidad.css'; 
import TradingCard from './TradingCard';

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // 1. Estado para el usuario

  useEffect(() => {
    // 2. Obtener sesión del usuario al cargar
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

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

    getSession();
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-5">Cargando spotteds...</div>;

  return (
    <section className="container mt-4">
      <h2 className="text-center mb-4">Spotteds de la Comunidad</h2>
      <div className="album-grid"> 
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="card-thumb">
              {/* 3. AQUÍ ESTÁ LA CLAVE: le pasamos el id del usuario */}
              <TradingCard data={post} userId={user?.id} />
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