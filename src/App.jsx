import React from 'react';
// IMPORTANTE: Asegúrate de que esta línea esté tal cual:
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Album from './components/Album';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-white">
        <Navbar />
        
        <main className="flex-shrink-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} /> 
            
            {/* RUTA PARA VER TODO EL ÁLBUM */}
            <Route path="/album" element={<Album />} />
            
            {/* RUTA PARA VER POR CATEGORÍA */}
            <Route path="/album/:category" element={<Album />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;