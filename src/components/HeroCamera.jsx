import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import "./HeroCamera.css";
import Swal from 'sweetalert2';
import TradingCard from './TradingCard';
import TEMPLATES from '../data/templates.json';

function HeroCamera() {
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit'); 
  const navigate = useNavigate();

  const [categoriaActiva, setCategoriaActiva] = useState('perros');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('camera');
  const [formData, setFormData] = useState({ nombre: '', raza: '', personalidad: '', funFact: '' });

  // Función para encontrar el primer número libre (1, 2, 3...)
  const getAvailableNumber = async (userId, categoria) => {
    const { data, error } = await supabase
      .from('captures')
      .select('numero_figurita')
      .eq('user_id', userId)
      .eq('categoria', categoria)
      .order('numero_figurita', { ascending: true });

    if (error) throw error;

    const occupiedNumbers = data.map(item => item.numero_figurita);
    let nextNum = 1;
    while (occupiedNumbers.includes(nextNum)) {
      nextNum++;
    }
    return nextNum;
  };

  useEffect(() => {
    if (editId) {
      const cargarCarta = async () => {
        const { data, error } = await supabase
          .from('captures')
          .select('*')
          .eq('id', editId)
          .single();
        
        if (data) {
          setFormData(data.metadata || { 
            nombre: data.nombre, 
            raza: data.raza || '', 
            personalidad: data.personalidad || '', 
            funFact: data.funFact || '' 
          });
          setImagePreview(data.image_url);
          setCategoriaActiva(data.categoria);
          setStep('card'); 
        }
      };
      cargarCarta();
    }
  }, [editId]);

  const handleStartSpot = (categoria) => {
    setImagePreview(null);
    setFormData({ nombre: '', raza: '', personalidad: '', funFact: '' });
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRandomize = () => {
    const lista = TEMPLATES[categoriaActiva] || [];
    if (lista.length > 0) {
      const random = lista[Math.floor(Math.random() * lista.length)];
      setFormData(random);
    } else {
      Swal.fire('Info', 'No hay datos cargados para esta categoría.', 'info');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStep('card');
  };

  const handleResetAll = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setFormData({ nombre: '', raza: '', personalidad: '', funFact: '' });
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
        const { error: dbError } = await supabase
          .from('captures')
          .update({
            nombre: formData.nombre,
            categoria: categoriaActiva,
            image_url: publicUrl,
            metadata: formData
          })
          .eq('id', editId);
        if (dbError) throw dbError;
        
        Swal.fire('¡Carta Actualizada!', 'Tus cambios fueron guardados.', 'success')
            .then(() => navigate(`/album/${categoriaActiva.toLowerCase()}`));
      } else {
        // Cálculo del nuevo número antes del insert
        const newNumber = await getAvailableNumber(user.id, categoriaActiva);

        const { error: dbError } = await supabase.from('captures').insert({
          user_id: user.id,
          nombre: formData.nombre,
          categoria: categoriaActiva,
          numero_figurita: newNumber,
          image_url: publicUrl,
          metadata: formData
        });
        
        if (dbError) throw dbError;
        Swal.fire('¡Carta Guardada!', `Agregada al álbum como #${newNumber}.`, 'success').then(() => handleResetAll());
      }
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
              {['perros', 'gatos', 'plantas'].map((cat) => (
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
            <div className="d-flex justify-content-between mb-4">
              <h4>Ficha: {categoriaActiva}</h4>
              <button onClick={handleRandomize} className="btn btn-warning btn-sm">🎲 Random</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="form-control mb-3" placeholder="Nombre" required />
              <input type="text" name="raza" value={formData.raza} onChange={handleInputChange} className="form-control mb-3" placeholder="Raza" />
              <input type="text" name="personalidad" value={formData.personalidad} onChange={handleInputChange} className="form-control mb-3" placeholder="Personalidad" />
              <textarea name="funFact" value={formData.funFact} onChange={handleInputChange} className="form-control mb-4" placeholder="Dato curioso"></textarea>
              <div className="d-flex gap-2">
                <button type="button" onClick={handleResetAll} className="btn btn-outline-light flex-fill">Cancelar</button>
                <button type="submit" className="btn btn-success flex-fill">Generar Carta ✨</button>
              </div>
            </form>
          </div>
        )}

        {step === 'card' && (
          <div className="animate-fade-in">
            <TradingCard data={{ ...formData, categoria: categoriaActiva, image_url: imagePreview }} />
            <div className="d-flex gap-2 mt-4 justify-content-center">
              <button onClick={() => setStep('form')} className="btn btn-warning flex-fill">Editar</button>
              <button onClick={handleSaveToAlbum} disabled={loading} className="btn btn-success flex-fill">
                {loading ? 'Guardando...' : (editId ? 'Guardar Cambios' : 'Guardar en Álbum')}
              </button>
            </div>
          </div>
        )}

        <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageCapture} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

export default HeroCamera;