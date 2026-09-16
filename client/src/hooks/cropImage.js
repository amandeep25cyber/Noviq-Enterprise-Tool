
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      blob.name = "cropped_avatar.jpeg";
      // Blob ke sath ek preview URL bhi bhej rahe hain
      resolve({ file: blob, url: URL.createObjectURL(blob) });
    }, "image/jpeg");
  });
};

export { getCroppedImg }