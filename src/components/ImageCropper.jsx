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
        // La lógica interna de getCroppedImg ya debería manejar el image.crossOrigin = 'anonymous'
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
    <div className="cropper-wrapper" style={{ width: '100%', height: '100%' }}>
      <div className="cropper-container" style={{ height: '300px', position: 'relative', width: '100%' }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 5}
          onCropChange={setCrop}
          onZoomChange={(z) => setZoom(Number(z))}
          onCropComplete={(_, pixels) => {
            croppedAreaRef.current = pixels;
          }}
        />
      </div>

      <div className="cropper-controls p-3">
        <label className="text-white mb-2">Zoom</label>
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