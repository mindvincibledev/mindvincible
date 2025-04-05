
/**
 * Converts canvas content to a base64-encoded PNG image
 * @param canvas The canvas element
 * @returns Base64 string or Blob of the canvas image
 */
export const getBase64FromCanvas = (canvas: HTMLCanvasElement | null): Blob | null => {
  if (!canvas) return null;
  
  // Convert canvas to blob
  return new Promise<Blob | null>(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    }, 'image/png', 0.95);
  }) as any as Blob;
};

/**
 * Helper function to generate a unique filename for jar images
 */
export const generateJarFilename = (userId: string): string => {
  return `jar_${userId}_${Date.now()}.png`;
};
