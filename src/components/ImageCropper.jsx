import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./CropImage";

const ImageCropper = forwardRef(({ image, onComplete }, ref) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaRef = useRef(null);

  // Exponemos handleConfirm al componente padre (HeroCamera)
  useImperativeHandle(ref, () => ({
    handleConfirm: async () => {
      const area = croppedAreaRef.current;
      
      // Validación básica: si no hay área, no podemos recortar
      if (!area) {
        console.error("No se ha definido un área de recorte.");
        return;
      }

      try {
        const blob = await getCroppedImg(image, area);
        if (blob) {
          const file = new File([blob], "card.jpg", { type: "image/jpeg" });
          onComplete(file);
        }
      } catch (e) {
        console.error("Error al procesar el recorte:", e);
      }
    }
  }));

  return (
    <div className="cropper-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* 🔥 FIX CRÍTICO DE ESTILOS: 
        react-easy-crop requiere obligatoriamente que su contenedor tenga "position: relative" 
        y un alto fijo real o un viewport definido para calcular los gestos táctiles en celulares.
      */}
      <div 
        className="cropper-container" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '320px', // Un poquito más de aire para el aspecto 4/6
          background: '#000',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 6}
          onCropChange={setCrop}
          onZoomChange={(z) => setZoom(Number(z))}
          onCropComplete={(_, pixels) => {
            croppedAreaRef.current = pixels;
          }}
          // 🔥 Evita comportamientos raros de scroll al arrastrar en móviles
          disableAutomaticWindowResize={false} 
        />
      </div>

      <div className="cropper-controls p-3">
        <label className="text-white mb-2" style={{ fontSize: '0.85rem' }}>Zoom</label>
        <input
          type="range"
          className="form-range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </div>
    </div>
  );
});

export default ImageCropper;