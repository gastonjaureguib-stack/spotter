import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./CropImage";

const ImageCropper = forwardRef(({ image, onComplete }, ref) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    handleConfirm: async () => {
      const area = croppedAreaRef.current;
      
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
      
      <div 
        className="cropper-container" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '320px', 
          background: '#222', 
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {image ? (
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
            disableAutomaticWindowResize={false}
            style={{
              containerStyle: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                userSelect: 'none',
                touchAction: 'none',
                cursor: 'move',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              },
              // 🔥 SOLUCIÓN: Quitamos maxWidth/maxHeight y objectFit que aplastaban las fotos reales de la cámara
              mediaStyle: {
                position: 'absolute',
                willChange: 'transform'
              },
              cropAreaStyle: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: '2px solid rgba(255,255,255,0.8)',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                boxSizing: 'border-box'
              }
            }}
          />
        ) : (
          <div className="text-white d-flex align-items-center justify-content-center h-100">
            <span style={{ fontSize: '0.85rem' }}>Cargando imagen...</span>
          </div>
        )}
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