
/**
 * Converts canvas content to a base64-encoded PNG image
 * @param canvas The canvas element
 * @returns Promise that resolves to a Blob of the canvas image
 */
export const getBase64FromCanvas = (canvas: HTMLCanvasElement | null): Promise<Blob | null> => {
  if (!canvas) return Promise.resolve(null);
  
  // Convert canvas to blob
  return new Promise<Blob | null>(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    }, 'image/png', 0.95);
  });
};

/**
 * Helper function to generate a unique filename for jar images
 */
export const generateJarFilename = (userId: string): string => {
  return `jar_${Date.now()}.png`;
};
