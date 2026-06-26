import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import "./HeroCamera.css";
import Swal from 'sweetalert2';
import TradingCard from './TradingCard';
import TEMPLATES from '../data/templates.json';

function HeroCamera() {
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const editId = searchParams.get('edit'); 

  const [categoriaActiva, setCategoriaActiva] = useState('perros');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('camera');
  const [formData, setFormData] = useState({ nombre: '', raza: '', personalidad: '', funFact: '' });

  const getFormLabels = (cat) => {
    const isNature = ['plantas', 'paisajes'].includes(cat);
    return {
      nombre: isNature ? 'Nombre del lugar o especie' : 'Nombre',
      raza: isNature ? 'Tipo / Especie' : 'Raza',
      personalidad: isNature ? 'Características' : 'Personalidad',
      funFact: isNature ? 'Encontrado en' : 'Dato curioso'
    };
  };

  const labels = getFormLabels(categoriaActiva);

  // Carga inicial y limpieza de estado corrupto
  useEffect(() => {
    if (location.state?.imageFile) {
      const file = location.state.imageFile;
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setCategoriaActiva(location.state.category || 'perros');
      setStep('form');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleStartSpot = (categoria) => {
    setCategoriaActiva(categoria);
    fileInputRef.current.click();
  };

  const handleImageCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setStep('form');
    }
    event.target.value = null; 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setStep('camera');
    if (editId) navigate('/album');
  };

  const handleSaveToAlbum = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión.");

      let publicUrl = imagePreview;
      if (selectedFile) {
        const fileName = `${user.id}/${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage.from('Captures').upload(fileName, selectedFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl: newUrl } } = supabase.storage.from('Captures').getPublicUrl(fileName);
        publicUrl = newUrl;
      }

      if (editId) {
        await supabase.from('captures').update({ nombre: formData.nombre, categoria: categoriaActiva, image_url: publicUrl, metadata: formData }).eq('id', editId);
      } else {
        const { data: existing } = await supabase.from('captures').select('numero_figurita').eq('user_id', user.id).eq('categoria', categoriaActiva);
        const newNumber = (existing?.length || 0) + 1;
        await supabase.from('captures').insert({ user_id: user.id, nombre: formData.nombre, categoria: categoriaActiva, numero_figurita: newNumber, image_url: publicUrl, metadata: formData });
      }
      Swal.fire('¡Éxito!', 'Carta guardada correctamente', 'success').then(() => navigate(`/album/${categoriaActiva}`));
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-camera-container text-white py-5 px-3 text-center d-flex align-items-center justify-content-center">
      <div className="container" style={{ maxWidth: '650px' }}>
        
        {step === 'camera' && (
          <div className="animate-fade-in">
            <h1 className="display-5 fw-extrabold mb-5">¡Capturá tu Entorno!</h1>
            <div className="d-flex justify-content-center gap-4 flex-wrap my-4">
              {['perros', 'gatos', 'plantas', 'paisajes'].map((cat) => (
                <div key={cat}>
                  <button onClick={() => handleStartSpot(cat)} className={`btn btn-disparador-multi disp-${cat}`}>
                    <i className="bi bi-camera-fill fs-2"></i>
                  </button>
                  <span className="d-block mt-2 text-uppercase fw-bold">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="animate-fade-in bg-dark-card p-4 rounded-4 shadow-lg">
            {!imagePreview ? (
              <div className="text-center">
                <p className="mb-3">Se perdió la sesión. Por favor, vuelve a capturar.</p>
                <button onClick={handleReset} className="btn btn-warning">Volver a la cámara</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setStep('card'); }}>
                <input name="nombre" value={formData.nombre} onChange={handleInputChange} className="form-control mb-3" placeholder={labels.nombre} required />
                <input name="raza" value={formData.raza} onChange={handleInputChange} className="form-control mb-3" placeholder={labels.raza} />
                <input name="personalidad" value={formData.personalidad} onChange={handleInputChange} className="form-control mb-3" placeholder={labels.personalidad} />
                <textarea name="funFact" value={formData.funFact} onChange={handleInputChange} className="form-control mb-4" placeholder={labels.funFact}></textarea>
                <div className="d-flex gap-2">
                  <button type="button" onClick={handleReset} className="btn btn-outline-light w-50">Cancelar</button>
                  <button type="submit" className="btn btn-success w-50">Generar Carta ✨</button>
                </div>
              </form>
            )}
          </div>
        )}

        {step === 'card' && (
          <div className="animate-fade-in">
            <TradingCard data={{ ...formData, categoria: categoriaActiva, image_url: imagePreview }} />
            <div className="d-flex gap-2 mt-4">
              <button onClick={() => setStep('form')} className="btn btn-warning w-50">Editar</button>
              <button onClick={handleSaveToAlbum} className="btn btn-success w-50" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar en Álbum'}
              </button>
            </div>
          </div>
        )}

        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={fileInputRef} 
          onChange={handleImageCapture} 
          style={{ display: 'none' }} 
        />
      </div>
    </div>
  );
}

export default HeroCamera;