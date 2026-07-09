import imageCompression from 'browser-image-compression';

export async function compressToJpeg(file: File): Promise<Blob> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: false,
      fileType: 'image/jpeg',
      initialQuality: 0.85,
    });
  } catch {
    return file;
  }
}
