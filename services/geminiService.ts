import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LearningMaterial, ProficiencyLevel } from "../types";

// Initialize the API client
// Note: In a real production app, ensure your environment variables are set correctly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the structured learning material based on topic and level.
 */
export const generateLearningContent = async (
  topic: string,
  level: ProficiencyLevel
): Promise<LearningMaterial> => {
  
  const prompt = `
    Generate a French learning text about the topic: "${topic}".
    The difficulty level must be exactly: ${level}.
    
    Return a JSON object containing:
    1. "title": A creative French title.
    2. "frenchText": A coherent, engaging paragraph or story (approx 150-200 words).
    3. "englishTranslation": The English translation of the text.
    4. "vocabulary": An array of 5-8 difficult or key words from the text. Each item has "word", "translation", "type" (noun, verb, etc), and "contextSentence" (a short example sentence using the word).
    5. "quiz": An array of 3 multiple choice questions to test comprehension. Each item has "question" (in French), "options" (array of 4 strings), "correctIndex" (0-3), and "explanation" (why it is correct).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            frenchText: { type: Type.STRING },
            englishTranslation: { type: Type.STRING },
            vocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  translation: { type: Type.STRING },
                  type: { type: Type.STRING },
                  contextSentence: { type: Type.STRING },
                },
                required: ["word", "translation", "type", "contextSentence"]
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctIndex", "explanation"]
              }
            }
          },
          required: ["title", "frenchText", "englishTranslation", "vocabulary", "quiz"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as LearningMaterial;
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

/**
 * Generates speech audio for a given text.
 */
export const generateSpeech = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is usually a good standard voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received");
    }

    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};