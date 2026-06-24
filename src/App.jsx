import React from 'react';
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
            {/* Quitamos el setView={setView} porque ya usamos navigate en Login.jsx */}
            <Route path="/login" element={<Login />} /> 
            <Route path="/album" element={<Album />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;