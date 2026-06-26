import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Comunidad.css'; 
import TradingCard from './TradingCard';

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    const fetchPosts = async () => {
      setLoading(true);
      // Ajuste clave: pedimos la relación con la tabla 'profiles'
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

  if (loading) return <div className="text-center mt-5">Cargando spotteds...</div>;

  return (
    <section className="container mt-4">
      <h2 className="text-center mb-4">Spotteds de la Comunidad</h2>
      <div className="album-grid"> 
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="card-thumb">
              {/* Le pasamos el objeto post completo que ya incluye profiles */}
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