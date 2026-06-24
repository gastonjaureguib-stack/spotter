import React from 'react';
import HeroCamera from '../components/HeroCamera';
import Categories from '../components/Categories';
import LatestCaptures from '../components/LatestCaptures';

function Home() {
  return (
    <>
      {/* Botón de acceso a la cámara */}
      <HeroCamera />

      {/* Botones de categorías */}
      <Categories />

      {/* Grilla de últimas capturas */}
      <LatestCaptures />
    </>
  );
}

export default Home;