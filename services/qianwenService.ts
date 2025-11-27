import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";

const BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_QWEN_API_KEY,
    dangerouslyAllowBrowser: true ,
  baseURL: BASE_URL,
});


export async function generateLearningContentFromQwen(topic: string, level: string) {

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
const messages: ChatCompletionMessageParam[] = [
    {
        role: "user",
        content: prompt,
    },
];
  const completion = await openai.chat.completions.create({
    model: "qwen-plus",
    messages: messages,
  });

  return completion.choices[0].message.content;
}


/**
 * Generates speech audio for a given text.
 */
export const generateSpeech = async (text: string): Promise<string> => {

  return ""
};