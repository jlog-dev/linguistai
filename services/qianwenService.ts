import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";

const BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_QWEN_API_KEY,
  dangerouslyAllowBrowser: true,
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
  // const completion = await openai.chat.completions.create({
  //   model: "qwen-plus",
  //   messages: messages,
  // });

  // const response = completion.choices[0].message.content;
  // console.log(response)
  // const jsonString = response.replace(/^```json\s*|\s*```$/g, '');
  // return JSON.parse(jsonString);

  const mockContent = {
    "title": "Un Café à Paris",
    "frenchText": "Marie est à Paris. Elle a soif et veut un café. Elle entre dans un petit café près de la Seine. Un serveur souriant dit : « Bonjour, madame. Que désirez-vous ? » Marie répond : « Bonjour. Je voudrais un café, s’il vous plaît. » Le serveur demande : « Un café allongé, un expresso ou un cappuccino ? » Marie ne connaît pas bien les cafés. Elle choisit un expresso. « Un expresso, s’il vous plaît », dit-elle. Le serveur apporte le café rapidement. Le café est chaud et très bon. Marie paie avec deux euros. « Merci », dit-elle. « Au revoir », répond le serveur. Marie sort du café et marche près de la rivière. Elle est contente. Le soleil brille et son café était parfait.",
    "englishTranslation": "Marie is in Paris. She is thirsty and wants a coffee. She enters a small café near the Seine. A smiling waiter says: 'Hello, madam. What would you like?' Marie answers: 'Hello. I would like a coffee, please.' The waiter asks: 'An Americano, an espresso, or a cappuccino?' Marie doesn't know coffees well. She chooses an espresso. 'An espresso, please,' she says. The waiter brings the coffee quickly. The coffee is hot and very good. Marie pays with two euros. 'Thank you,' she says. 'Goodbye,' replies the waiter. Marie leaves the café and walks by the river. She is happy. The sun is shining and her coffee was perfect.",
    "vocabulary": [
      {
        "word": "serveur",
        "translation": "waiter",
        "type": "noun",
        "contextSentence": "Le serveur est gentil et rapide."
      },
      {
        "word": "désirez",
        "translation": "would you like",
        "type": "verb",
        "contextSentence": "Que désirez-vous boire ce matin ?"
      },
      {
        "word": "expresso",
        "translation": "espresso",
        "type": "noun",
        "contextSentence": "Je prends un expresso, s’il vous plaît."
      },
      {
        "word": "chaud",
        "translation": "hot",
        "type": "adjective",
        "contextSentence": "Le thé est très chaud."
      },
      {
        "word": "paie",
        "translation": "pays",
        "type": "verb",
        "contextSentence": "Elle paie avec une carte."
      },
      {
        "word": "contente",
        "translation": "happy",
        "type": "adjective",
        "contextSentence": "Marie est contente après son café."
      }
    ],
    "quiz": [
      {
        "question": "Où est Marie au début du texte ?",
        "options": [
          "À Londres",
          "À Paris",
          "À New York",
          "À Tokyo"
        ],
        "correctIndex": 1,
        "explanation": "Le texte dit : 'Marie est à Paris.' Donc, la réponse correcte est 'À Paris'."
      },
      {
        "question": "Quel type de café Marie commande-t-elle ?",
        "options": [
          "Un cappuccino",
          "Un café allongé",
          "Un chocolat",
          "Un expresso"
        ],
        "correctIndex": 3,
        "explanation": "Marie dit : 'Un expresso, s’il vous plaît.' C’est donc la bonne réponse."
      },
      {
        "question": "Comment Marie paie-t-elle ?",
        "options": [
          "Avec une carte",
          "Avec des chèques",
          "Avec deux euros",
          "Gratuitement"
        ],
        "correctIndex": 2,
        "explanation": "Le texte mentionne : 'Marie paie avec deux euros.' C’est l’information clé."
      }
    ]
  }

  return mockContent
}