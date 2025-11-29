export interface LearningContent {
  title: string;
  frenchText: string;
  englishTranslation: string;
  vocabulary: Array<{
    word: string;
    translation: string;
    type: string;
    contextSentence: string;
  }>;
  quiz: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export async function generateLearningContentFromQwen(topic: string, level: string): Promise<LearningContent> {
  const response = await fetch('/api/learning', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, level }),
  });

  if (!response.ok) {
    throw new Error(`API Request Failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data as LearningContent;
}