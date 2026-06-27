import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

import HeroCamera from '../components/HeroCamera';
import Categories from '../components/Categories';
import LatestCaptures from '../components/LatestCaptures';

function Home() {

  useEffect(() => {

    // =====================================================
    // 🔧 CAMBIAR SOLO ESTE TEXTO CUANDO ESTÉS TRABAJANDO
    // =====================================================
    const trabajandoEn = "🎨 Actualmente estoy mejorando el diseño de las cartas.";
    // Ejemplos:
    // const trabajandoEn = "🦶 Actualmente estoy trabajando en el Footer.";
    // const trabajandoEn = "📷 Estoy mejorando la cámara.";
    // const trabajandoEn = "👤 Estoy realizando cambios en el perfil de usuario.";
    // =====================================================

    Swal.fire({
      title: "👋 ¡Bienvenido!",
      icon: "info",
      confirmButtonText: "🚀 ¡Vamos!",
      confirmButtonColor: "#198754",
      html: `
        <div style="text-align:left">

          <p>Si llegaste hasta acá, seguramente seas un amigo o familiar que aceptó probar esta aplicación. ❤️</p>

          <p><strong>¡Muchísimas gracias por regalarme un ratito!</strong></p>

          <hr>

          <p style="background:#eef7ff;padding:10px;border-radius:8px;">
            <strong>${trabajandoEn}</strong>
          </p>

          <p>Es posible que esa parte todavía tenga errores o cambios visuales mientras sigo desarrollándola.</p>

          <p>Mientras tanto, recorré la aplicación, capturá momentos y disfrutala.</p>

          <p><strong>Tu opinión vale muchísimo.</strong> Si encontrás un error o tenés una idea para mejorarla, decímela sin filtro. Cada comentario suma.</p>

          <p style="text-align:center;font-size:18px;">
            📸 ¡Gracias por ayudarme a construir Spotters!
          </p>

        </div>
      `
    });

  }, []);

  return (
    <>
      <HeroCamera />
      <Categories />
      <LatestCaptures />
    </>
  );
}

export default Home;