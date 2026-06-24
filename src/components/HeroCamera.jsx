import React, { useRef, useState } from 'react';
import { supabase } from './supabaseClient';
import "./HeroCamera.css";
import Swal from 'sweetalert2';

const TEMPLATES_POR_CATEGORIA = {
  perros: [
    { nombre: "El Firulais del Barrio", caracteristicas: "Oreja mocha, manchas piratas", raza: "Mestizo", personalidad: "Guardián", funFact: "Le tiene pánico a las escobas." },
    { nombre: "El Flaco de la Esquina", caracteristicas: "Flaco, pelo negro", raza: "Callejero", personalidad: "Amigable", funFact: "Gran robador de panes." }
  ],
  gatos: [
    { nombre: "Michi Inspector", caracteristicas: "Mirada de juicio", raza: "Común", personalidad: "Antipático", funFact: "Maúlla como si no hubiera comido hace semanas." },
    { nombre: "Garfield del Cordón", caracteristicas: "Naranja, gordo", raza: "Naranjoso", personalidad: "Dueño del Sol", funFact: "Engaña a 4 familias para comer." }
  ],
  plantas: [
    { nombre: "La Planta Sobreviviente", caracteristicas: "Tres hojas verdes", raza: "Helecho", personalidad: "Resiliente", funFact: "Sobrevivió a 3 mudanzas." },
    { nombre: "Clavel del Aire", caracteristicas: "Despeinado", raza: "Voladora", personalidad: "Okupa", funFact: "No paga alquiler." }
  ]
};

function HeroCamera() {
  const fileInputRef = useRef(null);
  const [categoriaActiva, setCategoriaActiva] = useState('perros');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('camera');
  const [formData, setFormData] = useState({ nombre: '', caracteristicas: '', raza: '', personalidad: '', funFact: '' });

  const handleStartSpot = (categoria) => {
    setImagePreview(null);
    setFormData({ nombre: '', caracteristicas: '', raza: '', personalidad: '', funFact: '' });
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
    const lista = TEMPLATES_POR_CATEGORIA[categoriaActiva] || [];
    const random = lista[Math.floor(Math.random() * lista.length)];
    if (random) setFormData(random);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStep('card');
  };

  const handleResetAll = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setFormData({ nombre: '', caracteristicas: '', raza: '', personalidad: '', funFact: '' });
    setStep('camera');
  };

  const handleSaveToAlbum = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión para coleccionar.");

      // 1. Subir a Storage (Bucket 'Captures' con C mayúscula)
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('Captures')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('Captures')
        .getPublicUrl(fileName);

      // 3. Insertar en Base de Datos
      const { error: dbError } = await supabase.from('captures').insert({
        user_id: user.id,
        nombre: formData.nombre,
        categoria: categoriaActiva,
        image_url: publicUrl,
        metadata: formData
      });

      if (dbError) throw dbError;

      Swal.fire({
        title: '¡Carta Coleccionada!',
        text: `"${formData.nombre}" guardado en tu álbum.`,
        icon: 'success',
        background: '#111827',
        color: '#ffffff',
        confirmButtonText: '¡A seguir spootenado! 📸'
      }).then(() => {
        handleResetAll();
      });
    } catch (err) {
      console.error("Detalle del error:", err);
      Swal.fire('Error', 'No pudimos guardar la carta: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-camera-container text-white py-5 px-3 text-center d-flex align-items-center justify-content-center">
      <div className="container" style={{ maxWidth: '650px' }}>
        
        {step === 'camera' && (
          <div className="animate-fade-in">
            <h1 className="display-5 fw-extrabold mb-5">¡Capturá tu <span className="text-gradient-green">Entorno</span>!</h1>
            <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap my-4">
              {['perros', 'gatos', 'plantas'].map((cat) => (
                <div key={cat} className="disparador-item">
                  <button onClick={() => handleStartSpot(cat)} className={`btn btn-disparador-multi disp-${cat} shadow-lg`}>
                    <i className="bi bi-camera-fill fs-2 text-white"></i>
                  </button>
                  <span className="d-block mt-2 text-uppercase fw-bold text-white small">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="animate-fade-in text-start bg-dark-card p-4 rounded-4 shadow-lg border-green-glow">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-uppercase text-gradient-green">Ficha: {categoriaActiva}</h4>
              <button type="button" onClick={handleRandomize} className="btn btn-random-dice btn-sm rounded-pill px-3 fw-bold">🎲 Random</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="form-control form-spooter mb-3" placeholder="Nombre" required />
              <input type="text" name="caracteristicas" value={formData.caracteristicas} onChange={handleInputChange} className="form-control form-spooter mb-3" placeholder="Características" />
              <div className="row">
                <div className="col-6"><input type="text" name="raza" value={formData.raza} onChange={handleInputChange} className="form-control form-spooter mb-3" placeholder="Raza" /></div>
                <div className="col-6"><input type="text" name="personalidad" value={formData.personalidad} onChange={handleInputChange} className="form-control form-spooter mb-3" placeholder="Personalidad" /></div>
              </div>
              <textarea name="funFact" value={formData.funFact} onChange={handleInputChange} className="form-control form-spooter mb-4" placeholder="Dato curioso"></textarea>
              <div className="d-flex gap-2">
                <button type="button" onClick={handleResetAll} className="btn btn-outline-light rounded-pill flex-fill">Cancelar</button>
                <button type="submit" className="btn btn-success rounded-pill flex-fill">Generar Carta ✨</button>
              </div>
            </form>
          </div>
        )}

        {step === 'card' && (
          <div className="animate-fade-in">
            <div className="pokemon-card mx-auto p-3 bg-light text-dark rounded-4 shadow-lg">
              <h3 className="text-uppercase fw-bold">{formData.nombre}</h3>
              <img src={imagePreview} alt="Preview" className="img-fluid rounded mb-3" />
              <p className="small text-start"><strong>Raza:</strong> {formData.raza}</p>
              <p className="small text-start"><strong>Fun Fact:</strong> {formData.funFact}</p>
              
              <div className="d-flex gap-2 mt-3">
                <button onClick={() => setStep('form')} className="btn btn-warning flex-fill fw-bold">Editar</button>
                <button 
                  onClick={handleSaveToAlbum} 
                  disabled={loading} 
                  className="btn btn-success flex-fill fw-bold"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={handleResetAll} className="btn btn-danger flex-fill fw-bold">Borrar</button>
              </div>
            </div>
          </div>
        )}

        <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageCapture} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

export default HeroCamera;