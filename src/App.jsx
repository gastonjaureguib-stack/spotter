import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Album from './components/Album';
import HeroCamera from './components/HeroCamera';
import Comunidad from './components/comunidad'; 

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-white">
        <Navbar />
        
        <main className="flex-shrink-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} /> 
            
            {/* RUTA PARA LA CÁMARA (NUEVA Y EDICIÓN) */}
            <Route path="/camera" element={<HeroCamera />} />
            
            {/* RUTA PARA VER TODO EL ÁLBUM */}
            <Route path="/album" element={<Album />} />
            
            {/* RUTA PARA VER POR CATEGORÍA */}
            <Route path="/album/:category" element={<Album />} />

            {/* RUTA PARA EL MURO DE LA COMUNIDAD */}
            <Route path="/comunidad" element={<Comunidad />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;