import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Swal from 'sweetalert2';
import "./HeroCamera.css";
import TradingCard from './TradingCard';
import TEMPLATES from '../data/templates.json';
import ImageCropper from './ImageCropper';

const favicon = '/favicon.png';

function HeroCamera() {
  const cameraInputRef = useRef(null);
  const cropperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get('edit');
  const catParam = searchParams.get('category');

  const [view, setView] = useState('camera');
  const [categoriaActiva, setCategoriaActiva] = useState(location.state?.category || catParam || 'perros');
  const [rawImage, setRawImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', raza: '', personalidad: '', funFact: '' });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 🔥 FIX GALERÍA MODE
  const [openMode, setOpenMode] = useState('camera');

  useEffect(() => {
    if (location.state?.externalImage) {
      setRawImage(location.state.externalImage);
      setView('crop');
    }
  }, [location.state]);

  useEffect(() => {
    const fetchCardToEdit = async () => {
      if (editId) {
        setLoading(true);
        const { data } = await supabase
          .from('captures')
          .select('*')
          .eq('id', editId)
          .single();

        if (data) {
          setFormData({
            nombre: data.nombre || '',
            raza: data.raza || '',
            personalidad: data.metadata?.personalidad || '',
            funFact: data.metadata?.funFact || ''
          });

          setCategoriaActiva(data.categoria || 'perros');
          setPreview(data.image_url);
          setIsEditing(true);
          setView('form');
        }
        setLoading(false);
      }
    };

    fetchCardToEdit();
  }, [editId]);

  // 🔥 FIX GALERÍA AUTO OPEN
  useEffect(() => {
    const mode = searchParams.get('mode');

    if (mode === 'gallery') {
      setOpenMode('gallery');

      setTimeout(() => {
        cameraInputRef.current?.click();
      }, 300);
    }
  }, [searchParams]);

  const handleImageCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRawImage(URL.createObjectURL(file));
    setView('crop');
    e.target.value = null;
  };

  const handleEditImage = () => {
    if (preview) {
      setRawImage(preview);
      setView('crop');
    }
  };

  const handleRandom = () => {
    const list = TEMPLATES[categoriaActiva] || [];
    if (!list.length) return;

    const r = list[Math.floor(Math.random() * list.length)];

    setFormData({
      nombre: r.nombre || '',
      raza: r.raza || '',
      personalidad: r.personalidad || '',
      funFact: r.funFact || ''
    });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión");

      let finalImageUrl = preview;

      if (croppedFile instanceof File) {
        const filePath = `${user.id}/${Date.now()}.jpg`;

        const { error: uploadError } = await supabase
          .storage
          .from('Captures')
          .upload(filePath, croppedFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('Captures')
          .getPublicUrl(filePath);

        finalImageUrl = data.publicUrl;
      }

      const payload = {
        user_id: user.id,
        nombre: formData.nombre,
        categoria: categoriaActiva,
        image_url: finalImageUrl,
        metadata: formData
      };

      if (isEditing && editId) {
        await supabase.from('captures').update(payload).eq('id', editId);
      } else {
        const { error } = await supabase.from('captures').insert([payload]);
        if (error) throw error;
      }

      Swal.fire('¡Éxito!', isEditing ? 'Carta actualizada' : 'Carta guardada', 'success')
        .then(() => navigate(`/album/${categoriaActiva}`));

    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-camera-container">
      <div className="container text-center" style={{ maxWidth: 650, paddingBottom: "50px" }}>

        {view === 'camera' && (
          <div className="animate-fade-in">
            <h1>Capturá momentos</h1>
            <button onClick={() => cameraInputRef.current.click()} className="camera-lens-button">
              <img src={favicon} alt="camera" />
            </button>
          </div>
        )}

        {view === 'crop' && (
          <div className="animate-fade-in">
            <div className="cropper-box" style={{ height: '350px' }}>
              <ImageCropper
                ref={cropperRef}
                image={rawImage}
                onCancel={() => setView('form')}
                onComplete={(file) => {
                  setCroppedFile(file);
                  setPreview(URL.createObjectURL(file));
                  setView('form');
                }}
              />
            </div>

            <div className="d-flex gap-3 justify-content-center mt-4">
              <button className="btn btn-outline-light" onClick={() => setView('form')}>Cancelar</button>
              <button className="btn btn-success" onClick={() => cropperRef.current?.handleConfirm()}>
                Confirmar Recorte
              </button>
            </div>
          </div>
        )}

        {view === 'form' && (
          <div className="bg-dark-card p-4 rounded-4 animate-fade-in">
            <h4 className="text-white mb-3">
              {isEditing ? 'Editando tu carta' : 'Nueva Carta'}
            </h4>

            <button className="btn btn-outline-info btn-sm mb-3 w-100" onClick={handleEditImage}>
              ✂️ Re-ajustar imagen
            </button>

            <select
              className="form-control mb-2"
              value={categoriaActiva}
              onChange={(e) => setCategoriaActiva(e.target.value)}
            >
              <option value="perros">Perros</option>
              <option value="gatos">Gatos</option>
              <option value="plantas">Plantas</option>
              <option value="paisajes">Paisajes</option>
            </select>

            <button className="btn btn-warning mb-3 w-100" onClick={handleRandom}>
              🎲 Random
            </button>

            <input
              className="form-control mb-2"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />

            <input
              className="form-control mb-2"
              placeholder={
                categoriaActiva === 'plantas'
                  ? "Especie"
                  : categoriaActiva === 'paisajes'
                    ? "Ubicación"
                    : "Raza"
              }
              value={formData.raza}
              onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
            />

            {(categoriaActiva === 'perros' || categoriaActiva === 'gatos') && (
              <input
                className="form-control mb-2"
                placeholder="Carácter"
                value={formData.personalidad}
                onChange={(e) =>
                  setFormData({ ...formData, personalidad: e.target.value })
                }
              />
            )}

            <textarea
              className="form-control mb-3"
              placeholder="Dato curioso"
              value={formData.funFact}
              onChange={(e) =>
                setFormData({ ...formData, funFact: e.target.value })
              }
            />

            <div className="d-flex gap-2">
              <button className="btn btn-outline-light w-50" onClick={() => navigate(-1)}>
                Volver
              </button>
              <button className="btn btn-success w-50" onClick={() => setView('card')}>
                Generar carta
              </button>
            </div>
          </div>
        )}

        {view === 'card' && (
          <div className="animate-fade-in">
            <TradingCard
              data={{
                ...formData,
                categoria: categoriaActiva,
                image_url: preview
              }}
            />

            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-warning w-50" onClick={() => setView('form')}>
                Editar
              </button>
              <button
                className="btn btn-success w-50"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture={openMode === 'camera' ? 'environment' : undefined}
          onChange={handleImageCapture}
          hidden
        />

      </div>
    </div>
  );
}

export default HeroCamera;