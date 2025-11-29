import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from "openai";

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

export default async function handler(req: VercelRequest, res: VercelResponse) {

    if (req.method !== 'POST') return res.status(405).end();
    if (!QWEN_API_KEY) {
        return res.status(500).json({ error: 'Server config error: Missing QWEN_API_KEY' });
    }


    const { topic, level } = req.body;

    if (!topic || !level) {
        return res.status(400).json({ error: 'Missing topic or level' });
    }


    const openai = new OpenAI({
        apiKey: QWEN_API_KEY,
        baseURL: BASE_URL,
    });


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
        const completion = await openai.chat.completions.create({
            model: "qwen-plus",
            messages: [
                { role: "user", content: prompt },
            ],
        });

        const responseContent = completion.choices[0].message.content;

        if (!responseContent) {
            throw new Error("No content received from Qwen");
        }
        const jsonString = responseContent.replace(/^```json\s*|\s*```$/g, '');
        const parsedData = JSON.parse(jsonString);


        res.status(200).json(parsedData);

    } catch (error) {
        console.error("Qwen API Error:", error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
}