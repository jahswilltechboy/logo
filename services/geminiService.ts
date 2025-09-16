/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Modality } from "@google/genai";

// Helper function to extract base64 data and mimeType from a data URL
const parseDataUrl = (dataUrl: string): { data: string; mimeType: string } => {
    const parts = dataUrl.split(',');
    if (parts.length !== 2) {
        throw new Error('Invalid data URL format');
    }
    const meta = parts[0];
    const data = parts[1];

    const mimeTypeMatch = meta.match(/:(.*?);/);
    if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
        throw new Error('Could not extract MIME type from data URL');
    }
    const mimeType = mimeTypeMatch[1];
    
    return { data, mimeType };
}


/**
 * Generates logo images using AI based on a brand name and text prompt.
 * @param brandName The name of the brand.
 * @param prompt The text prompt describing the desired logo.
 * @returns A promise that resolves to an array of data URLs for the generated logos.
 */
export const generateLogos = async (
    brandName: string,
    prompt: string
): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    try {
        console.log('Sending prompt to Gemini image generation model.');
        let fullPrompt = `A professional, modern logo for a brand named "${brandName}".`;
        if (prompt.trim()) {
            fullPrompt += ` The logo should be inspired by: "${prompt}".`;
        }
        fullPrompt += ` Please generate 4 distinct variations on a clean, solid background. The logos should be suitable for use on websites and marketing materials. Do not include any text unless it is part of the brand name itself.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
              numberOfImages: 4,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });
        
        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error('The model did not return any images. This could be due to a safety policy violation or an issue with the prompt.');
        }

        const imageUrls = response.generatedImages.map(img => {
            const base64ImageBytes: string = img.image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        });
        
        console.log(`Received ${imageUrls.length} generated logos.`);
        return imageUrls;

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during logo generation.';
        console.error('Logo generation error:', err);
        throw new Error(errorMessage);
    }
};


/**
 * Enhances a logo image using AI based on a text prompt.
 * @param base64ImageData The base64 encoded image data URL (e.g., "data:image/png;base64,...").
 * @param prompt The text prompt describing the desired edits.
 * @returns A promise that resolves to a data URL for the generated logo.
 */
export const enhanceLogo = async (
    base64ImageData: string,
    prompt: string
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    try {
        const { data, mimeType } = parseDataUrl(base64ImageData);
        
        console.log('Sending prompt to Gemini image editing model.');

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: data,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (!imagePart || !imagePart.inlineData) {
            const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text)?.text;
            const defaultMessage = 'The model did not return an image. It might have responded with text instead or refused the request due to safety policies.';
            throw new Error(textPart || defaultMessage);
        }

        const base64ImageBytes: string = imagePart.inlineData.data;
        const newMimeType: string = imagePart.inlineData.mimeType;
        const imageUrl = `data:${newMimeType};base64,${base64ImageBytes}`;
        
        console.log(`Received enhanced logo.`);
        return imageUrl;

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during logo enhancement.';
        console.error('Logo enhancement error:', err);
        throw new Error(errorMessage);
    }
};