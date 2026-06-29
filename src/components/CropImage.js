export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve) => {
    console.log("➡️ getCroppedImg iniciado");
    console.log("Imagen (recortada para log):", typeof imageSrc === 'string' ? imageSrc.substring(0, 60) : imageSrc);
    console.log("Área:", croppedAreaPixels);

    const image = new Image();

    // 🔥 FIX DEFINITIVO PARA MÓVILES Y BASE64:
    // Solo aplicamos crossOrigin si es una URL externa (http/https).
    // Si viene de Base64 (data:) o un blob local (blob:), NO le ponemos crossOrigin 
    // para evitar que el navegador del celular bloquee los píxeles.
    if (typeof imageSrc === 'string' && imageSrc.startsWith('http')) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => {
      console.log("✅ Imagen cargada en CropImage");

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Validamos que los píxeles existan para que no rompa en 0
      const width = croppedAreaPixels.width || 100;
      const height = croppedAreaPixels.height || 100;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        width,
        height,
        0,
        0,
        width,
        height
      );

      canvas.toBlob(
        (blob) => {
          console.log("✅ Blob generado con éxito:", blob);
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    };

    image.onerror = (e) => {
      console.error("❌ Error cargando la imagen en CropImage", e);
      resolve(null);
    };

    image.src = imageSrc;
  });
};