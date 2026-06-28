export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve) => {
    console.log("➡️ getCroppedImg iniciado");
    console.log("Imagen:", imageSrc);
    console.log("Área:", croppedAreaPixels);

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      console.log("✅ Imagen cargada");

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(
        (blob) => {
          console.log("✅ Blob generado:", blob);
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    };

    image.onerror = (e) => {
      console.error("❌ Error cargando la imagen", e);
      resolve(null);
    };

    image.src = imageSrc;
  });
};