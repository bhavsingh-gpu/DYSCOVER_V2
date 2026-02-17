import Tesseract from 'tesseract.js';

/**
 * Preprocess image using Canvas for better OCR (Grayscale & High Contrast)
 * @param {File|string} imageFile 
 * @returns {Promise<string>} - Base64 of processed image
 */
const preprocessImage = (imageFile) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw original image
                ctx.drawImage(img, 0, 0);

                // Apply Grayscale and Contrast Filter
                ctx.filter = 'grayscale(100%) contrast(150%)';
                ctx.drawImage(img, 0, 0);

                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    });
};

/**
 * OCR Service
 * Purpose: Extract text from images locally on the client side.
 */
export const extractTextFromImage = async (imageFile, onProgress = () => { }) => {
    try {
        // 1. Preprocess the image for better accuracy
        const processedImage = await preprocessImage(imageFile);

        // 2. Run Tesseract
        const result = await Tesseract.recognize(
            processedImage,
            'eng',
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        onProgress(Math.floor(m.progress * 100));
                    }
                }
            }
        );

        return {
            text: result.data.text.trim(),
            confidence: result.data.confidence // 0-100
        };
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from image. Please try again or type your text.');
    }
};
